import { env } from '../config/env.ts';
import { logger } from '../lib/logger.ts';
import { DEFAULT_SLOT_RULE, generateSlots, type GeneratedSlot } from '../../../shared/booking/slots.ts';

/**
 * MIS (medical information system) integration architecture.
 *
 * Supports everything the specification requires: doctor schedules, available
 * slots, appointment creation, patient creation, personal information transfer,
 * medical service transfer and duplicate booking prevention.
 *
 * The MIS is treated as the source of truth for availability. When it is not
 * configured, the adapter falls back to the clinic's own scheduling rules from
 * @shared/booking/slots so the site is fully operable in the demo deployment
 * and during MIS outages — bookings captured then are reconciled by the
 * contact centre from the CRM lead record.
 */

export interface MisSlotQuery {
  clinicId: string;
  date: string;
  doctorId?: string;
  departmentId?: string;
}

export interface MisPatient {
  fullName: string;
  phone: string;
  email: string;
  /** Our internal patient id, sent so the MIS can store a back-reference. */
  externalId: string;
}

export interface MisAppointment {
  externalId: string;
  patientMisId: string;
  doctorId: string;
  serviceId: string;
  clinicId: string;
  date: string;
  time: string;
  comment: string;
}

export interface MisDoctorSchedule {
  doctorId: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
}

type Mode = 'live' | 'simulated';

const mode = (): Mode => (env.mis.enabled && env.mis.endpoint ? 'live' : 'simulated');

const call = async <T>(path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${env.mis.endpoint}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': env.mis.apiKey,
      'X-Facility-Id': env.mis.facilityId,
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error(`MIS responded ${response.status}`);
  return (await response.json()) as T;
};

export const mis = {
  mode,

  /** Doctor working hours for a date range. */
  async schedules(clinicId: string, from: string, to: string): Promise<MisDoctorSchedule[]> {
    if (mode() === 'simulated') {
      logger.info('mis.schedules.simulated', { clinicId, from, to });
      return [];
    }

    try {
      return await call<MisDoctorSchedule[]>(
        `/schedules?clinic=${clinicId}&from=${from}&to=${to}`,
        { method: 'GET' },
      );
    } catch (error) {
      logger.error('mis.schedules.failed', { error: String(error) });
      return [];
    }
  },

  /** Free slots for a doctor or a whole department on a given date. */
  async slots(query: MisSlotQuery, fallbackDoctorIds: string[]): Promise<GeneratedSlot[]> {
    if (mode() === 'live') {
      try {
        return await call<GeneratedSlot[]>('/slots', {
          method: 'POST',
          body: JSON.stringify(query),
        });
      } catch (error) {
        // Degrade rather than fail: an availability outage should not stop the
        // clinic taking bookings.
        logger.error('mis.slots.failed', { error: String(error) });
      }
    }

    const doctorIds = query.doctorId ? [query.doctorId] : fallbackDoctorIds;
    if (doctorIds.length === 0) return [];

    // Merge every doctor's schedule and expose the union of free times.
    const merged = new Map<string, GeneratedSlot>();
    doctorIds.forEach((doctorId) => {
      generateSlots(query.date, doctorId, DEFAULT_SLOT_RULE).forEach((slot) => {
        const existing = merged.get(slot.time);
        if (!existing || (!existing.available && slot.available)) merged.set(slot.time, slot);
      });
    });

    return [...merged.values()].sort((a, b) => a.time.localeCompare(b.time));
  },

  /** Creates (or matches) the patient record inside the MIS. */
  async upsertPatient(patient: MisPatient): Promise<string | null> {
    if (mode() === 'simulated') {
      logger.info('mis.patient.simulated', { phone: patient.phone });
      return null;
    }

    try {
      const result = await call<{ id: string }>('/patients', {
        method: 'POST',
        body: JSON.stringify(patient),
      });
      logger.info('mis.patient.created', { misId: result.id });
      return result.id;
    } catch (error) {
      logger.error('mis.patient.failed', { error: String(error) });
      return null;
    }
  },

  /** Registers the appointment and the medical service against it. */
  async createAppointment(appointment: MisAppointment): Promise<string | null> {
    if (mode() === 'simulated') {
      logger.info('mis.appointment.simulated', {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
      });
      return null;
    }

    try {
      const result = await call<{ id: string }>('/appointments', {
        method: 'POST',
        // Idempotency key: our own appointment id. A retry after a network
        // timeout must not create a second appointment in the MIS.
        headers: { 'Idempotency-Key': appointment.externalId },
        body: JSON.stringify(appointment),
      });
      logger.info('mis.appointment.created', { misId: result.id });
      return result.id;
    } catch (error) {
      logger.error('mis.appointment.failed', { error: String(error) });
      return null;
    }
  },

  async cancelAppointment(misId: string): Promise<boolean> {
    if (mode() === 'simulated') {
      logger.info('mis.cancel.simulated', { misId });
      return true;
    }

    try {
      await call<unknown>(`/appointments/${misId}/cancel`, { method: 'POST' });
      return true;
    } catch (error) {
      logger.error('mis.cancel.failed', { error: String(error) });
      return false;
    }
  },
};
