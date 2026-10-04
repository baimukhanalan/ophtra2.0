import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { closeDatabase, getDatabase } from './index.ts';
import { logger } from '../lib/logger.ts';

/**
 * Seeds the demo database from the canonical dataset in /data.
 *
 * The same JSON files are bundled by the frontend, so the API and the site can
 * never disagree about the catalogue. Re-running the seed is safe: content rows
 * are replaced, transactional rows are only inserted when missing.
 */

const DATA_DIR = resolve(process.cwd(), '../data');

const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(resolve(DATA_DIR, file), 'utf8')) as T;

const COLLECTIONS: Array<{ file: string; collection: string }> = [
  { file: 'clinics.json', collection: 'clinics' },
  { file: 'departments.json', collection: 'departments' },
  { file: 'services.json', collection: 'services' },
  { file: 'doctors.json', collection: 'doctors' },
  { file: 'programs.json', collection: 'programs' },
  { file: 'promotions.json', collection: 'promotions' },
  { file: 'news.json', collection: 'news' },
  { file: 'articles.json', collection: 'articles' },
  { file: 'faq.json', collection: 'faq' },
  { file: 'reviews.json', collection: 'reviews' },
  { file: 'vacancies.json', collection: 'vacancies' },
];

interface DemoAccount {
  patient: { id: string; fullName: string; phone: string; email: string };
  appointments: Array<Record<string, unknown>>;
  prescriptions: Array<Record<string, unknown>>;
  recommendations: Array<Record<string, unknown>>;
  results: Array<Record<string, unknown>>;
  invoices: Array<Record<string, unknown>>;
}

export const seed = async (): Promise<void> => {
  const db = getDatabase();
  await db.migrate();

  const now = new Date().toISOString();

  /* ------------------------------------------------------------- content */
  for (const { file, collection } of COLLECTIONS) {
    const entries = readJson<Array<Record<string, unknown>>>(file);

    for (const [index, entry] of entries.entries()) {
      await db.run(
        `INSERT INTO content (collection, id, document, published, position, updated_at)
         VALUES (@collection, @id, @document, @published, @position, @updated_at)
         ON CONFLICT (collection, id) DO UPDATE SET
           document = excluded.document,
           published = excluded.published,
           position = excluded.position,
           updated_at = excluded.updated_at`,
        {
          collection,
          id: String(entry.id),
          document: JSON.stringify(entry),
          published: entry.published === false ? 0 : 1,
          position: index,
          updated_at: now,
        },
      );
    }

    logger.info('seed.collection', { collection, count: entries.length });
  }

  // Singleton documents (site configuration and legal pages).
  for (const file of ['site.json', 'legal.json']) {
    const document = readJson<Record<string, unknown>>(file);
    await db.run(
      `INSERT INTO content (collection, id, document, published, position, updated_at)
       VALUES (@collection, @id, @document, 1, 0, @updated_at)
       ON CONFLICT (collection, id) DO UPDATE SET
         document = excluded.document, updated_at = excluded.updated_at`,
      {
        collection: 'singleton',
        id: file.replace('.json', ''),
        document: JSON.stringify(document),
        updated_at: now,
      },
    );
  }

  /* -------------------------------------------------------- demo patient */
  const demo = readJson<DemoAccount>('patient-demo.json');

  await db.run(
    `INSERT INTO patients (id, full_name, phone, email, created_at)
     VALUES (@id, @full_name, @phone, @email, @created_at)
     ON CONFLICT (id) DO NOTHING`,
    {
      id: demo.patient.id,
      full_name: demo.patient.fullName,
      phone: demo.patient.phone,
      email: demo.patient.email,
      created_at: now,
    },
  );

  for (const appointment of demo.appointments) {
    await db.run(
      `INSERT INTO appointments
         (id, reference, patient_id, clinic_id, department_id, service_id, doctor_id,
          date, time, status, price, comment, source, created_at)
       VALUES
         (@id, @reference, @patient_id, @clinic_id, @department_id, @service_id, @doctor_id,
          @date, @time, @status, @price, '', 'seed', @created_at)
       ON CONFLICT (id) DO NOTHING`,
      {
        id: String(appointment.id),
        reference: String(appointment.reference),
        patient_id: String(appointment.patientId),
        clinic_id: String(appointment.clinicId),
        department_id: String(appointment.departmentId),
        service_id: String(appointment.serviceId),
        doctor_id: String(appointment.doctorId),
        date: String(appointment.date),
        time: String(appointment.time),
        status: String(appointment.status),
        price: Number(appointment.price),
        created_at: String(appointment.createdAt),
      },
    );
  }

  const seedDocuments = async (
    table: 'prescriptions' | 'recommendations' | 'exam_results',
    rows: Array<Record<string, unknown>>,
    withDoctor: boolean,
  ) => {
    for (const row of rows) {
      await db.run(
        withDoctor
          ? `INSERT INTO ${table} (id, patient_id, doctor_id, date, document)
             VALUES (@id, @patient_id, @doctor_id, @date, @document)
             ON CONFLICT (id) DO NOTHING`
          : `INSERT INTO ${table} (id, patient_id, date, document)
             VALUES (@id, @patient_id, @date, @document)
             ON CONFLICT (id) DO NOTHING`,
        withDoctor
          ? {
              id: String(row.id),
              patient_id: String(row.patientId),
              doctor_id: String(row.doctorId),
              date: String(row.date),
              document: JSON.stringify(row),
            }
          : {
              id: String(row.id),
              patient_id: String(row.patientId),
              date: String(row.date),
              document: JSON.stringify(row),
            },
      );
    }
  };

  await seedDocuments('prescriptions', demo.prescriptions, true);
  await seedDocuments('recommendations', demo.recommendations, true);
  await seedDocuments('exam_results', demo.results, false);

  for (const invoice of demo.invoices) {
    await db.run(
      `INSERT INTO invoices
         (id, number, patient_id, appointment_id, amount, status, kind, receipt_url, issued_at)
       VALUES
         (@id, @number, @patient_id, @appointment_id, @amount, @status, @kind, @receipt_url, @issued_at)
       ON CONFLICT (id) DO NOTHING`,
      {
        id: String(invoice.id),
        number: String(invoice.number),
        patient_id: String(invoice.patientId),
        appointment_id: String(invoice.appointmentId),
        amount: Number(invoice.amount),
        status: String(invoice.status),
        kind: String(invoice.kind),
        receipt_url: (invoice.receiptUrl as string | undefined) ?? null,
        issued_at: String(invoice.issuedAt),
      },
    );
  }

  logger.info('seed.completed', { patient: demo.patient.id });
};

// Allow `npm run db:seed` to execute this file directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => closeDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('seed.failed', { error: String(error) });
      process.exit(1);
    });
}
