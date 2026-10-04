/**
 * Slot generation and booking rules shared by the API and the browser.
 *
 * The MIS is the authority on real availability in production; this module
 * defines the clinic's own scheduling rules (working hours, lead time, slot
 * granularity, duplicate detection) that apply on top of whatever the MIS
 * returns, and generates the demo schedule when no MIS is connected.
 */

export interface SlotRule {
  /** Opening hour, 24h clock. */
  opensAt: number;
  /** Closing hour, 24h clock. */
  closesAt: number;
  /** Minutes between slot starts. */
  stepMinutes: number;
  /** Minimum hours between now and the earliest bookable slot. */
  leadTimeHours: number;
  /** 0 = Sunday. Days the clinic does not take appointments. */
  closedDays: number[];
}

export const DEFAULT_SLOT_RULE: SlotRule = {
  opensAt: 8,
  closesAt: 20,
  stepMinutes: 30,
  leadTimeHours: 2,
  closedDays: [],
};

export interface GeneratedSlot {
  date: string;
  time: string;
  doctorId: string;
  available: boolean;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Stable pseudo-random availability.
 *
 * A hash of doctor+date+time decides whether a demo slot is taken, so the
 * schedule looks realistically patchy yet renders identically on every reload
 * and on both the client and the server.
 */
const hash = (input: string): number => {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0) / 4294967295;
};

/** The next `count` bookable dates, skipping the clinic's closed days. */
export const availableDates = (
  count = 14,
  from: Date = new Date(),
  rule: SlotRule = DEFAULT_SLOT_RULE,
): string[] => {
  const dates: string[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    if (!rule.closedDays.includes(cursor.getDay())) dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

export const generateSlots = (
  date: string,
  doctorId: string,
  rule: SlotRule = DEFAULT_SLOT_RULE,
  now: Date = new Date(),
): GeneratedSlot[] => {
  const slots: GeneratedSlot[] = [];
  const earliest = new Date(now.getTime() + rule.leadTimeHours * 3600_000);

  for (let hour = rule.opensAt; hour < rule.closesAt; hour += 1) {
    for (let minute = 0; minute < 60; minute += rule.stepMinutes) {
      const time = `${pad(hour)}:${pad(minute)}`;
      const slotAt = new Date(`${date}T${time}:00`);

      // Anything inside the lead-time window is not offered at all.
      if (slotAt.getTime() < earliest.getTime()) continue;

      const seed = hash(`${doctorId}|${date}|${time}`);
      slots.push({ date, time, doctorId, available: seed > 0.42 });
    }
  }

  return slots;
};

/**
 * Duplicate booking prevention.
 *
 * A patient may not hold two appointments with the same doctor at the same
 * time, nor two appointments anywhere in the same slot — both are the result
 * of a double submit or a second tab, never a real intent.
 */
export interface ExistingAppointment {
  patientPhone: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
}

export const isDuplicateBooking = (
  candidate: { patientPhone: string; doctorId: string; date: string; time: string },
  existing: ExistingAppointment[],
): boolean =>
  existing.some(
    (appointment) =>
      appointment.status !== 'cancelled' &&
      appointment.patientPhone === candidate.patientPhone &&
      appointment.date === candidate.date &&
      appointment.time === candidate.time,
  );

/** Human-readable booking reference, e.g. OPH-7K3F2A. */
export const bookingReference = (seed: string): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value = Math.floor(hash(seed) * 4294967295);
  let reference = '';
  for (let index = 0; index < 6; index += 1) {
    reference += alphabet[value % alphabet.length];
    value = Math.floor(value / alphabet.length) + index * 7919;
  }
  return `OPH-${reference}`;
};
