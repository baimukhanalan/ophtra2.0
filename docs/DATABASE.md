# Database

The brief scoped the database down to a demo, prepared for a production
solution. That is exactly what ships: a working SQLite database behind a driver
port, plus the checklist to swap in PostgreSQL without touching application
code.

## Shape of the design

Two kinds of data, deliberately stored differently:

**Content** — clinics, departments, services, doctors, programs, news,
articles, FAQ, reviews, vacancies, promotions. Stored as JSON documents in one
`content` table keyed by `(collection, id)`. An editor can add a field to a
doctor or a promotion without a migration, and the admin panel's generic CRUD
works for any collection.

**Transactional records** — patients, appointments, prescriptions,
recommendations, exam results, invoices, leads, notifications, assistant
sessions and analytics events. These get real relational tables with foreign
keys and indexes, because these are what the clinic queries, reports on and
must keep consistent.

The schema is `backend/src/db/schema.sql`. Every type used (`TEXT`, `INTEGER`,
`REAL`) maps 1:1 onto PostgreSQL, and no SQLite-only feature is used, so that
file is the migration baseline for production.

## Integrity guarantees in the schema

Duplicate booking prevention is enforced in the storage layer, not only in the
application:

```sql
CREATE UNIQUE INDEX idx_appointments_no_duplicates
  ON appointments (patient_id, date, time)
  WHERE status <> 'cancelled';
```

A double submit, a second browser tab or a retried request cannot create two
live appointments in one slot even if the API layer is bypassed.

## The driver port

Everything talks to `backend/src/db/types.ts`:

```ts
interface Database {
  migrate(): Promise<void>;
  all<T>(sql, params): Promise<T[]>;
  get<T>(sql, params): Promise<T | undefined>;
  run(sql, params): Promise<number>;
  transaction<T>(work: () => Promise<T>): Promise<T>;
  close(): Promise<void>;
  readonly driver: 'sqlite' | 'postgres';
}
```

The interface is async even though SQLite is synchronous, precisely so the
PostgreSQL implementation is a drop-in.

## Moving to production (Neon / any PostgreSQL)

1. **Create the database.** On Vercel: *Storage → Create Database → Neon*. It
   sets `DATABASE_URL` on the project automatically.

2. **Implement the driver.** Add `backend/src/db/postgres.ts`:

   ```ts
   import { Pool } from 'pg';
   import type { Database, QueryParams } from './types.ts';

   export class PostgresDatabase implements Database {
     readonly driver = 'postgres' as const;
     private pool = new Pool({ connectionString: env.dbUrl, max: 10 });
     // Named parameters (@name) translate to positional ($1, $2…) here —
     // that is the only dialect difference the queries rely on.
   }
   ```

3. **Register it** in `backend/src/db/index.ts`, replacing the guard that
   currently throws for `DB_DRIVER=postgres`. Nothing above that file changes.

4. **Adjust two statements** that use SQLite syntax:
   - `ON CONFLICT (collection, id) DO UPDATE SET … = excluded.…` → identical in
     PostgreSQL, no change needed.
   - `PRAGMA` statements at the top of `schema.sql` → drop them; the partial
     unique index syntax is already PostgreSQL-compatible.

5. **Set the environment** and migrate:

   ```bash
   DB_DRIVER=postgres DATABASE_URL=postgres://… npm --prefix backend run db:seed
   ```

## What the demo database does not do

Being honest about scope, since the brief excluded a complex database:

- No connection pooling strategy tuned for concurrency (SQLite is single-writer).
- No read replicas, partitioning or archival policy.
- No row-level encryption for clinical records; that belongs to the security
  workstream the brief excluded.
- Migrations are a single `schema.sql` applied idempotently, not a versioned
  migration history. Production needs a migration tool before the first schema
  change reaches live data.
