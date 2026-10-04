import { getDatabase } from './index.ts';
import type { ContentRow } from './types.ts';

/**
 * Content repository.
 *
 * The catalogue is stored as JSON documents keyed by collection, so editors can
 * add a field to a doctor or a promotion without a schema migration. Reads are
 * ordered by the seeded position so the site's ordering is editorial, not
 * incidental.
 */

export const listContent = async <T>(collection: string, includeDrafts = false): Promise<T[]> => {
  const db = getDatabase();
  const rows = await db.all<ContentRow>(
    `SELECT * FROM content
     WHERE collection = @collection ${includeDrafts ? '' : 'AND published = 1'}
     ORDER BY position ASC`,
    { collection },
  );
  return rows.map((row) => JSON.parse(row.document) as T);
};

export const getContent = async <T>(collection: string, id: string): Promise<T | undefined> => {
  const db = getDatabase();
  const row = await db.get<ContentRow>(
    'SELECT * FROM content WHERE collection = @collection AND id = @id',
    { collection, id },
  );
  return row ? (JSON.parse(row.document) as T) : undefined;
};

/** Merges a partial patch into a stored document. */
export const patchContent = async (
  collection: string,
  id: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown> | undefined> => {
  const db = getDatabase();
  const existing = await getContent<Record<string, unknown>>(collection, id);
  const merged = { ...(existing ?? { id }), ...patch };

  await db.run(
    `INSERT INTO content (collection, id, document, published, position, updated_at)
     VALUES (@collection, @id, @document, @published, 0, @updated_at)
     ON CONFLICT (collection, id) DO UPDATE SET
       document = excluded.document,
       published = excluded.published,
       updated_at = excluded.updated_at`,
    {
      collection,
      id,
      document: JSON.stringify(merged),
      published: merged.published === false ? 0 : 1,
      updated_at: new Date().toISOString(),
    },
  );

  return merged;
};

export const deleteContent = async (collection: string, id: string): Promise<number> => {
  const db = getDatabase();
  return db.run('DELETE FROM content WHERE collection = @collection AND id = @id', {
    collection,
    id,
  });
};
