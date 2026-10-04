import { randomInt, randomUUID } from 'node:crypto';
import { Router } from 'express';
import { env } from '../config/env.ts';
import { asyncHandler, HttpError, requirePhone, requireString } from '../lib/http.ts';
import { authenticate, issueToken } from '../lib/auth.ts';
import { getDatabase } from '../db/index.ts';
import type { AppointmentRow, DocumentRow, InvoiceRow, PatientRow } from '../db/types.ts';
import { notifications } from '../integrations/notifications.ts';
import { logger } from '../lib/logger.ts';

/**
 * Patient account.
 *
 * Sign-in is a one-time code delivered over the notification cascade. With no
 * SMS/WhatsApp provider configured the demo code from DEMO_OTP is accepted, and
 * the code that would have been sent is logged rather than delivered.
 */
export const accountRouter = Router();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

accountRouter.post(
  '/request-code',
  asyncHandler(async (req, res) => {
    const phone = requirePhone(req.body);
    const db = getDatabase();

    const code = env.nodeEnv === 'production' ? String(randomInt(1000, 9999)) : env.demoOtp;
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    await db.run(
      `INSERT INTO otp_codes (phone, code, expires_at, attempts)
       VALUES (@phone, @code, @expires_at, 0)
       ON CONFLICT (phone) DO UPDATE SET
         code = excluded.code, expires_at = excluded.expires_at, attempts = 0`,
      { phone, code, expires_at: expiresAt },
    );

    const patient = await db.get<PatientRow>('SELECT * FROM patients WHERE phone = @phone', {
      phone,
    });

    await notifications.send({
      patientId: patient?.id,
      phone,
      template: 'notification',
      language: 'ru',
      variables: [code],
      channels: ['whatsapp', 'sms'],
    });

    logger.info('account.code_requested', { phone });

    // With no SMS/WhatsApp provider configured the code can never reach the
    // patient, so outside production it is returned in the response and the UI
    // shows it. Production never leaks it.
    const simulated = env.nodeEnv !== 'production' && !env.sms.enabled && !env.whatsapp.enabled;
    res.json({ sent: true, ...(simulated ? { demoCode: code } : {}) });
  }),
);

accountRouter.post(
  '/verify-code',
  asyncHandler(async (req, res) => {
    const phone = requirePhone(req.body);
    const code = requireString(req.body, 'code');
    const db = getDatabase();

    const stored = await db.get<{ code: string; expires_at: string; attempts: number }>(
      'SELECT code, expires_at, attempts FROM otp_codes WHERE phone = @phone',
      { phone },
    );

    if (!stored) throw HttpError.unauthorized('Code was not requested', 'code_missing');
    if (stored.attempts >= MAX_ATTEMPTS) {
      throw HttpError.forbidden('Too many attempts', 'too_many_attempts');
    }
    if (new Date(stored.expires_at).getTime() < Date.now()) {
      throw HttpError.unauthorized('Code expired', 'code_expired');
    }

    if (stored.code !== code) {
      await db.run('UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = @phone', { phone });
      throw HttpError.unauthorized('Invalid code', 'code_invalid');
    }

    await db.run('DELETE FROM otp_codes WHERE phone = @phone', { phone });

    let patient = await db.get<PatientRow>('SELECT * FROM patients WHERE phone = @phone', { phone });
    if (!patient) {
      // First sign-in from a phone that has never booked: create the record so
      // the account exists and future bookings attach to it.
      const id = randomUUID();
      const now = new Date().toISOString();
      await db.run(
        `INSERT INTO patients (id, full_name, phone, email, created_at)
         VALUES (@id, '', @phone, '', @created_at)`,
        { id, phone, created_at: now },
      );
      patient = { id, full_name: '', phone, email: '', mis_id: null, created_at: now };
    }

    res.json({
      token: issueToken('patient', patient.id),
      patient: {
        id: patient.id,
        fullName: patient.full_name,
        phone: patient.phone,
        email: patient.email,
      },
    });
  }),
);

accountRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    const db = getDatabase();

    const patient = await db.get<PatientRow>('SELECT * FROM patients WHERE id = @id', {
      id: session.subject,
    });
    if (!patient) throw HttpError.notFound('Patient not found');

    const [appointments, prescriptions, recommendations, results, invoices] = await Promise.all([
      db.all<AppointmentRow>(
        'SELECT * FROM appointments WHERE patient_id = @id ORDER BY date DESC, time DESC',
        { id: patient.id },
      ),
      db.all<DocumentRow>(
        'SELECT * FROM prescriptions WHERE patient_id = @id ORDER BY date DESC',
        { id: patient.id },
      ),
      db.all<DocumentRow>(
        'SELECT * FROM recommendations WHERE patient_id = @id ORDER BY date DESC',
        { id: patient.id },
      ),
      db.all<DocumentRow>('SELECT * FROM exam_results WHERE patient_id = @id ORDER BY date DESC', {
        id: patient.id,
      }),
      db.all<InvoiceRow>('SELECT * FROM invoices WHERE patient_id = @id ORDER BY issued_at DESC', {
        id: patient.id,
      }),
    ]);

    res.json({
      patient: {
        id: patient.id,
        fullName: patient.full_name,
        phone: patient.phone,
        email: patient.email,
      },
      appointments: appointments.map((row) => ({
        id: row.id,
        reference: row.reference,
        clinicId: row.clinic_id,
        departmentId: row.department_id,
        serviceId: row.service_id,
        doctorId: row.doctor_id,
        date: row.date,
        time: row.time,
        status: row.status,
        patientId: row.patient_id,
        price: row.price,
        createdAt: row.created_at,
      })),
      prescriptions: prescriptions.map((row) => JSON.parse(row.document)),
      recommendations: recommendations.map((row) => JSON.parse(row.document)),
      results: results.map((row) => JSON.parse(row.document)),
      invoices: invoices.map((row) => ({
        id: row.id,
        number: row.number,
        patientId: row.patient_id,
        appointmentId: row.appointment_id,
        amount: row.amount,
        status: row.status,
        kind: row.kind,
        issuedAt: row.issued_at,
        receiptUrl: row.receipt_url ?? undefined,
      })),
    });
  }),
);

/** Omnichannel communication history for the signed-in patient. */
accountRouter.get(
  '/communications',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    res.json(await notifications.history(session.subject));
  }),
);
