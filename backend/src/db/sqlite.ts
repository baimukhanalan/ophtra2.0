import BetterSqlite3 from 'better-sqlite3';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Database, QueryParams } from './types.ts';
import { logger } from '../lib/logger.ts';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * SQLite driver — the demo database.
 *
 * better-sqlite3 is synchronous; the port is async so the PostgreSQL
 * implementation can slot in unchanged. The small `await`-free bodies below are
 * intentional: wrapping sync calls in resolved promises costs nothing and keeps
 * one interface for both drivers.
 */
export class SqliteDatabase implements Database {
  readonly driver = 'sqlite' as const;
  private readonly db: BetterSqlite3.Database;

  constructor(file: string) {
    const path = resolve(process.cwd(), file);
    mkdirSync(dirname(path), { recursive: true });
    this.db = new BetterSqlite3(path);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    logger.info('database.opened', { driver: this.driver, path });
  }

  async migrate(): Promise<void> {
    const schema = readFileSync(resolve(here, 'schema.sql'), 'utf8');
    this.db.exec(schema);
    logger.info('database.migrated', { driver: this.driver });
  }

  async all<T>(sql: string, params: QueryParams = {}): Promise<T[]> {
    return this.db.prepare(sql).all(params) as T[];
  }

  async get<T>(sql: string, params: QueryParams = {}): Promise<T | undefined> {
    return this.db.prepare(sql).get(params) as T | undefined;
  }

  async run(sql: string, params: QueryParams = {}): Promise<number> {
    return this.db.prepare(sql).run(params).changes;
  }

  /**
   * better-sqlite3 transactions cannot wrap async work, so the unit of work is
   * bracketed manually. All repository calls inside are synchronous under the
   * hood, so this is equivalent — and it keeps the port's async signature.
   */
  async transaction<T>(work: () => Promise<T>): Promise<T> {
    this.db.exec('BEGIN');
    try {
      const result = await work();
      this.db.exec('COMMIT');
      return result;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  async close(): Promise<void> {
    this.db.close();
  }
}
