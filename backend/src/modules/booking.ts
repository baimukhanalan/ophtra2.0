import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { bookingReference } from '../../../shared/booking/slots.ts';
import { asyncHandler, HttpError, optionalString, requirePhone, requireString } from '../lib/http.ts';
import { authenticate } from '../lib/auth.ts';
import { getDatabase } from '../db/index.ts';
import { listContent } from '../db/content.ts';
import type { AppointmentRow, PatientRow } from '../db/types.ts';
import { mis } from '../integrations/mis.ts';
import { crm } from '../integrations/crm.ts';
import { notifications } from '../integrations/notifications.ts';
import { logger } from '../lib/logger.ts';

/**
 * Online booking.
 *
 * Implements exactly the flow the specification defines: doctor, department,
 * service and clinic selection, available dates and times, appointment
 * confirmation and automatic notifications — plus duplicate prevention and the
 * CRM/MIS handoff that must accompany every booking.
 */
export const bookingRouter = Router();

interface ServiceDocument {
  id: string;
  departmentId: string;
  price: number;
  name: Record<string, string>;
}

interface DoctorDocument {
  id: string;
  departmentIds: string[];
  clinicIds: string[];
}

/* ------------------------------------------------------------------ SLOTS */

bookingRouter.get(
  '/slots',
  asyncHandler(async (req, res) => {
    const date = String(req.query.date ?? '');
    const clinicId = String(req.query.clinicId ?? '');
    const doctorId = req.query.doctorId ? String(req.query.doctorId) : undefined;
    const departmentId = req.query.departmentId ? String(req.query.departmentId) : undefined;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw HttpError.badRequest('Query parameter "date" must be YYYY-MM-DD', 'validation_error');
    }

    // When no specific doctor is requested, offer the union of the department's
    // doctors so "any available doctor" still returns a usable schedule.
    const doctors = await listContent<DoctorDocument>('doctors');
    const candidates = doctors
      .filter((doctor) => !departmentId || doctor.departmentIds.includes(departmentId))
      .filter((doctor) => !clinicId || doctor.clinicIds.includes(clinicId))
      .map((doctor) => doctor.id);

    const slots = await mis.slots(
      { clinicId, date, ...(doctorId ? { doctorId } : {}), ...(departmentId ? { departmentId } : {}) },
      candidates,
    );

    // Slots already taken in our own database are never offered again, even if
    // the MIS has not caught up yet.
    const db = getDatabase();
    const taken = await db.all<{ time: string; doctor_id: string }>(
      `SELECT time, doctor_id FROM appointments
       WHERE date = @date AND status <> 'cancelled'`,
      { date },
    );

    const blocked = new Set(taken.map((row) => `${row.doctor_id}|${row.time}`));
    res.json(
      slots.map((slot) => ({
        ...slot,
        available: slot.available && !blocked.has(`${slot.doctorId}|${slot.time}`),
      })),
    );
  }),
);

/* ----------------------------------------------------------- APPOINTMENTS */

bookingRouter.post(
  '/appointments',
  asyncHandler(async (req, res) => {
    const body = req.body as Record<string, unknown>;

    const fullName = requireString(body, 'fullName');
    const phone = requirePhone(body);
    const clinicId = requireString(body, 'clinicId');
    const departmentId = requireString(body, 'departmentId');
    const serviceId = requireString(body, 'serviceId');
    const date = requireString(body, 'date');
    const time = requireString(body, 'time');
    const email = optionalString(body, 'email');
    const comment = optionalString(body, 'comment');
    const source = optionalString(body, 'source') || 'website';
    // Doctor appointment, diagnostics or surgery — recorded on the lead so the
    // contact centre routes the follow-up correctly.
    const visitType = optionalString(body, 'visitType') || 'consultation';
    const utm = (body.utm as Record<string, string | undefined>) ?? {};
    const marketingConsent = body.marketingConsent === true;
    const language = (optionalString(body, 'language') || 'ru') as 'ru' | 'kk' | 'en';

    if (body.consent !== true) {
      throw HttpError.badRequest('Personal data consent is required', 'consent_required');
    }

    const services = await listContent<ServiceDocument>('services');
    const service = services.find((entry) => entry.id === serviceId);
    if (!service) throw HttpError.badRequest('Unknown service', 'unknown_service');

    // "Any available doctor" resolves to the first doctor of the department who
    // works at the chosen clinic.
    let doctorId = optionalString(body, 'doctorId');
    if (!doctorId) {
      const doctors = await listContent<DoctorDocument>('doctors');
      doctorId =
        doctors.find(
          (doctor) =>
            doctor.departmentIds.includes(departmentId) && doctor.clinicIds.includes(clinicId),
        )?.id ?? '';
      if (!doctorId) throw HttpError.badRequest('No doctor available', 'no_doctor');
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const appointment = await db.transaction(async () => {
      /* ------------------------------------------------- patient record */
      let patient = await db.get<PatientRow>('SELECT * FROM patients WHERE phone = @phone', {
        phone,
      });

      if (!patient) {
        const id = randomUUID();
        await db.run(
          `INSERT INTO patients (id, full_name, phone, email, created_at)
           VALUES (@id, @full_name, @phone, @email, @created_at)`,
          { id, full_name: fullName, phone, email, created_at: now },
        );
        patient = {
          id,
          full_name: fullName,
          phone,
          email,
          mis_id: null,
          created_at: now,
        };
      }

      /* -------------------------------------------- duplicate prevention */
      const existing = await db.get<AppointmentRow>(
        `SELECT * FROM appointments
         WHERE patient_id = @patient_id AND date = @date AND time = @time AND status <> 'cancelled'`,
        { patient_id: patient.id, date, time },
      );
      if (existing) {
        throw HttpError.conflict('Appointment already exists for this slot', 'duplicate_booking');
      }

      const slotTaken = await db.get<AppointmentRow>(
        `SELECT * FROM appointments
         WHERE doctor_id = @doctor_id AND date = @date AND time = @time AND status <> 'cancelled'`,
        { doctor_id: doctorId, date, time },
      );
      if (slotTaken) throw HttpError.conflict('Slot is no longer free', 'slot_taken');

      /* ------------------------------------------------------- creation */
      const id = randomUUID();
      const reference = bookingReference(`${phone}|${date}|${time}|${doctorId}`);

      await db.run(
        `INSERT INTO appointments
           (id, reference, patient_id, clinic_id, department_id, service_id, doctor_id,
            date, time, status, price, comment, source, created_at)
         VALUES
           (@id, @reference, @patient_id, @clinic_id, @department_id, @service_id, @doctor_id,
            @date, @time, 'confirmed', @price, @comment, @source, @created_at)`,
        {
          id,
          reference,
          patient_id: patient.id,
          clinic_id: clinicId,
          department_id: departmentId,
          service_id: serviceId,
          doctor_id: doctorId,
          date,
          time,
          price: service.price,
          comment,
          source,
          created_at: now,
        },
      );

      // The invoice is raised with the appointment so the patient can pay in
      // advance from the account.
      await db.run(
        `INSERT INTO invoices (id, number, patient_id, appointment_id, amount, status, kind, issued_at)
         VALUES (@id, @number, @patient_id, @appointment_id, @amount, 'unpaid', 'service', @issued_at)`,
        {
          id: randomUUID(),
          number: `OPH-${new Date().getFullYear()}-${reference.slice(4)}`,
          patient_id: patient.id,
          appointment_id: id,
          amount: service.price,
          issued_at: now,
        },
      );

      return {
        id,
        reference,
        patient,
        clinicId,
        departmentId,
        serviceId,
        doctorId,
        date,
        time,
        price: service.price,
      };
    });

    /* ------------------------------------------- downstream integrations */
    // These run after the transaction commits: a CRM or MIS hiccup must not
    // roll back a confirmed appointment.
    const misPatientId = await mis.upsertPatient({
      fullName,
      phone,
      email,
      externalId: appointment.patient.id,
    });

    const misAppointmentId = await mis.createAppointment({
      externalId: appointment.id,
      patientMisId: misPatientId ?? appointment.patient.id,
      doctorId: appointment.doctorId,
      serviceId,
      clinicId,
      date,
      time,
      comment,
    });

    if (misAppointmentId) {
      await db.run('UPDATE appointments SET mis_id = @mis_id WHERE id = @id', {
        mis_id: misAppointmentId,
        id: appointment.id,
      });
    }

    const crmResult = await crm.pushLead({
      fullName,
      phone,
      email,
      serviceId,
      source,
      date: now,
      utm,
      comment,
    });

    await db.run(
      `INSERT INTO leads
         (id, full_name, phone, email, service_id, source, comment, utm, crm_id, crm_status, created_at)
       VALUES (@id, @full_name, @phone, @email, @service_id, @source, @comment, @utm, @crm_id, @crm_status, @created_at)`,
      {
        id: randomUUID(),
        full_name: fullName,
        phone,
        email,
        service_id: serviceId,
        source: `${source} / ${visitType}`,
        comment,
        utm: JSON.stringify(utm),
        crm_id: crmResult.crmId ?? null,
        crm_status: crmResult.status,
        created_at: now,
      },
    );

    /* ------------------------------------------- automatic notifications */
    await notifications.send({
      patientId: appointment.patient.id,
      phone,
      email,
      template: 'appointment_confirmation',
      language,
      marketingConsent,
      variables: [fullName, date, time, appointment.reference],
    });

    logger.info('booking.created', {
      reference: appointment.reference,
      misSynced: Boolean(misAppointmentId),
      crm: crmResult.status,
    });

    res.status(201).json({
      id: appointment.id,
      reference: appointment.reference,
      clinicId,
      departmentId,
      serviceId,
      doctorId: appointment.doctorId,
      date,
      time,
      status: 'confirmed',
      patientId: appointment.patient.id,
      price: appointment.price,
      createdAt: now,
    });
  }),
);

/* ------------------------------------------------- CANCEL / RESCHEDULE */

bookingRouter.post(
  '/appointments/:id/cancel',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    const db = getDatabase();

    const appointment = await db.get<AppointmentRow>(
      'SELECT * FROM appointments WHERE id = @id AND patient_id = @patient_id',
      { id: String(req.params.id), patient_id: session.subject },
    );
    if (!appointment) throw HttpError.notFound('Appointment not found');

    await db.run("UPDATE appointments SET status = 'cancelled' WHERE id = @id", {
      id: appointment.id,
    });
    if (appointment.mis_id) await mis.cancelAppointment(appointment.mis_id);

    const patient = await db.get<PatientRow>('SELECT * FROM patients WHERE id = @id', {
      id: session.subject,
    });

    if (patient) {
      await notifications.send({
        patientId: patient.id,
        phone: patient.phone,
        email: patient.email,
        template: 'appointment_cancelled',
        language: 'ru',
        variables: [patient.full_name, appointment.date, appointment.time],
      });
    }

    res.json({ ...appointment, status: 'cancelled' });
  }),
);

bookingRouter.post(
  '/appointments/:id/reschedule',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    const date = requireString(req.body, 'date');
    const time = requireString(req.body, 'time');
    const db = getDatabase();

    const appointment = await db.get<AppointmentRow>(
      'SELECT * FROM appointments WHERE id = @id AND patient_id = @patient_id',
      { id: String(req.params.id), patient_id: session.subject },
    );
    if (!appointment) throw HttpError.notFound('Appointment not found');

    const clash = await db.get<AppointmentRow>(
      `SELECT * FROM appointments
       WHERE doctor_id = @doctor_id AND date = @date AND time = @time
         AND status <> 'cancelled' AND id <> @id`,
      { doctor_id: appointment.doctor_id, date, time, id: appointment.id },
    );
    if (clash) throw HttpError.conflict('Slot is no longer free', 'slot_taken');

    await db.run(
      "UPDATE appointments SET date = @date, time = @time, status = 'rescheduled' WHERE id = @id",
      { date, time, id: appointment.id },
    );

    const patient = await db.get<PatientRow>('SELECT * FROM patients WHERE id = @id', {
      id: session.subject,
    });

    if (patient) {
      await notifications.send({
        patientId: patient.id,
        phone: patient.phone,
        email: patient.email,
        template: 'appointment_rescheduled',
        language: 'ru',
        variables: [patient.full_name, date, time, appointment.reference],
      });
    }

    res.json({ ...appointment, date, time, status: 'rescheduled' });
  }),
);
