import { env } from '../config/env.ts';
import { SqliteDatabase } from './sqlite.ts';
import type { Database } from './types.ts';

let instance: Database | null = null;

/**
 * Database factory.
 *
 * `DB_DRIVER=sqlite` (default) gives the self-contained demo database.
 * `DB_DRIVER=postgres` is the production path: implement `PostgresDatabase`
 * against the same `Database` port (see docs/DATABASE.md for the checklist) and
 * register it here. Nothing above this file changes.
 */
export const getDatabase = (): Database => {
  if (instance) return instance;

  if (env.dbDriver === 'postgres') {
    throw new Error(
      'DB_DRIVER=postgres is declared but no PostgreSQL driver is registered. ' +
        'Implement the Database port in src/db/postgres.ts and register it in src/db/index.ts. ' +
        'See docs/DATABASE.md.',
    );
  }

  instance = new SqliteDatabase(env.dbFile);
  return instance;
};

export const closeDatabase = async (): Promise<void> => {
  await instance?.close();
  instance = null;
};

export type { Database } from './types.ts';
