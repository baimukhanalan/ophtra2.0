-- OPHTRA demo schema.
--
-- Deliberately small: the catalogue (clinics, departments, services, doctors,
-- news, articles, promotions, FAQ, reviews, vacancies) is content, seeded from
-- /data/*.json and stored as JSON documents so an editor can change it without
-- a migration. Only the transactional entities — patients, appointments,
-- invoices, leads, notifications, assistant sessions, analytics — get real
-- relational tables, because those are what the clinic queries and reports on.
--
-- Portability: every type used here (TEXT, INTEGER, REAL) maps 1:1 onto
-- PostgreSQL, and no SQLite-specific feature is used beyond the pragmas below,
-- so this file is the migration baseline for the production database.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------------ CONTENT

CREATE TABLE IF NOT EXISTS content (
  collection  TEXT NOT NULL,
  id          TEXT NOT NULL,
  document    TEXT NOT NULL,           -- JSON payload
  published   INTEGER NOT NULL DEFAULT 1,
  position    INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (collection, id)
);

CREATE INDEX IF NOT EXISTS idx_content_collection ON content (collection, published, position);

-- ----------------------------------------------------------------- PATIENTS

CREATE TABLE IF NOT EXISTS patients (
  id          TEXT PRIMARY KEY,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL DEFAULT '',
  /** Identifier of the same patient inside the MIS, once synchronised. */
  mis_id      TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients (phone);

-- ------------------------------------------------------------- APPOINTMENTS

CREATE TABLE IF NOT EXISTS appointments (
  id             TEXT PRIMARY KEY,
  reference      TEXT NOT NULL UNIQUE,
  patient_id     TEXT NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  clinic_id      TEXT NOT NULL,
  department_id  TEXT NOT NULL,
  service_id     TEXT NOT NULL,
  doctor_id      TEXT NOT NULL,
  date           TEXT NOT NULL,          -- YYYY-MM-DD
  time           TEXT NOT NULL,          -- HH:MM
  status         TEXT NOT NULL,          -- confirmed | completed | cancelled | rescheduled
  price          INTEGER NOT NULL DEFAULT 0,
  comment        TEXT NOT NULL DEFAULT '',
  source         TEXT NOT NULL DEFAULT '',
  mis_id         TEXT,
  created_at     TEXT NOT NULL
);

-- Duplicate booking prevention at the storage layer: one patient cannot hold
-- two live appointments in the same slot, whatever the application does.
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_no_duplicates
  ON appointments (patient_id, date, time)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_slot ON appointments (doctor_id, date, time);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments (patient_id, date);

-- --------------------------------------------------------- CLINICAL RECORDS

CREATE TABLE IF NOT EXISTS prescriptions (
  id          TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  doctor_id   TEXT NOT NULL,
  date        TEXT NOT NULL,
  document    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
  id          TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  doctor_id   TEXT NOT NULL,
  date        TEXT NOT NULL,
  document    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exam_results (
  id          TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  date        TEXT NOT NULL,
  document    TEXT NOT NULL
);

-- ----------------------------------------------------------------- BILLING

CREATE TABLE IF NOT EXISTS invoices (
  id              TEXT PRIMARY KEY,
  number          TEXT NOT NULL UNIQUE,
  patient_id      TEXT NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
  appointment_id  TEXT REFERENCES appointments (id) ON DELETE SET NULL,
  amount          INTEGER NOT NULL,
  status          TEXT NOT NULL,        -- paid | unpaid | refunded
  kind            TEXT NOT NULL,        -- service | operation | prepayment
  receipt_url     TEXT,
  provider_ref    TEXT,
  issued_at       TEXT NOT NULL,
  paid_at         TEXT,
  refunded_at     TEXT
);

CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices (patient_id, status);

-- --------------------------------------------------------------------- CRM

CREATE TABLE IF NOT EXISTS leads (
  id           TEXT PRIMARY KEY,
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT NOT NULL DEFAULT '',
  service_id   TEXT NOT NULL DEFAULT '',
  source       TEXT NOT NULL DEFAULT '',
  comment      TEXT NOT NULL DEFAULT '',
  utm          TEXT NOT NULL DEFAULT '{}',
  crm_id       TEXT,
  crm_status   TEXT NOT NULL DEFAULT 'pending',
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);

-- ----------------------------------------------------------- COMMUNICATION

-- Omnichannel history: every message the clinic sends, on any channel, so the
-- CRM has one timeline per patient.
CREATE TABLE IF NOT EXISTS notifications (
  id           TEXT PRIMARY KEY,
  patient_id   TEXT,
  channel      TEXT NOT NULL,           -- whatsapp | telegram | sms | email | chat | phone | social
  template     TEXT NOT NULL,
  payload      TEXT NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL,           -- queued | sent | simulated | failed
  provider_ref TEXT,
  error        TEXT,
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notifications (patient_id, created_at DESC);

-- --------------------------------------------------------------- ASSISTANT

CREATE TABLE IF NOT EXISTS assistant_sessions (
  id          TEXT PRIMARY KEY,
  language    TEXT NOT NULL,
  state       TEXT NOT NULL DEFAULT '{}',
  handed_off  INTEGER NOT NULL DEFAULT 0,
  turns       INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assistant_messages (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES assistant_sessions (id) ON DELETE CASCADE,
  role        TEXT NOT NULL,
  text        TEXT NOT NULL,
  intent      TEXT,
  confidence  REAL,
  created_at  TEXT NOT NULL
);

-- Knowledge-base learning: questions the assistant could not answer, queued
-- for an editor to turn into FAQ entries.
CREATE TABLE IF NOT EXISTS assistant_gaps (
  id          TEXT PRIMARY KEY,
  question    TEXT NOT NULL,
  language    TEXT NOT NULL,
  hits        INTEGER NOT NULL DEFAULT 1,
  resolved    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- --------------------------------------------------------------- ANALYTICS

-- End-to-end analytics: browser events joined to clinic outcomes by session.
CREATE TABLE IF NOT EXISTS analytics_events (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  payload     TEXT NOT NULL DEFAULT '{}',
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_name ON analytics_events (name, created_at DESC);

-- ----------------------------------------------------------------- OTP CODES

CREATE TABLE IF NOT EXISTS otp_codes (
  phone       TEXT PRIMARY KEY,
  code        TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0
);
