/**
 * Database port.
 *
 * The application talks to this interface only. The demo deployment binds it to
 * SQLite (src/db/sqlite.ts); a production deployment binds the same interface
 * to PostgreSQL without touching a single module — see docs/DATABASE.md.
 */

export interface QueryParams {
  [key: string]: string | number | null;
}

export interface Database {
  /** Runs the schema and returns once the database is ready to serve. */
  migrate(): Promise<void>;
  /** Rows matching a statement. */
  all<T>(sql: string, params?: QueryParams): Promise<T[]>;
  /** First row matching a statement, or undefined. */
  get<T>(sql: string, params?: QueryParams): Promise<T | undefined>;
  /** Insert/update/delete. Returns the number of affected rows. */
  run(sql: string, params?: QueryParams): Promise<number>;
  /** Runs a unit of work atomically. */
  transaction<T>(work: () => Promise<T>): Promise<T>;
  /** Releases connections. */
  close(): Promise<void>;
  readonly driver: 'sqlite' | 'postgres';
}

/* ------------------------------------------------------------------- ROWS */

export interface ContentRow {
  collection: string;
  id: string;
  document: string;
  published: number;
  position: number;
  updated_at: string;
}

export interface PatientRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  mis_id: string | null;
  created_at: string;
}

export interface AppointmentRow {
  id: string;
  reference: string;
  patient_id: string;
  clinic_id: string;
  department_id: string;
  service_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: string;
  price: number;
  comment: string;
  source: string;
  mis_id: string | null;
  created_at: string;
}

export interface InvoiceRow {
  id: string;
  number: string;
  patient_id: string;
  appointment_id: string | null;
  amount: number;
  status: string;
  kind: string;
  receipt_url: string | null;
  provider_ref: string | null;
  issued_at: string;
  paid_at: string | null;
  refunded_at: string | null;
}

export interface LeadRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  service_id: string;
  source: string;
  comment: string;
  utm: string;
  crm_id: string | null;
  crm_status: string;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  patient_id: string;
  doctor_id?: string;
  date: string;
  document: string;
}

export interface NotificationRow {
  id: string;
  patient_id: string | null;
  channel: string;
  template: string;
  payload: string;
  status: string;
  provider_ref: string | null;
  error: string | null;
  created_at: string;
}
