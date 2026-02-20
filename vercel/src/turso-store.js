import { createClient } from '@libsql/client/web';

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export function createTursoKVStore(options) {
  const url = options?.url;
  const authToken = options?.authToken;

  if (!url) {
    throw new Error('Missing TURSO_DATABASE_URL');
  }

  const client = createClient({ url, authToken });
  let initPromise;

  async function ensureInit() {
    if (!initPromise) {
      initPromise = client.execute(INIT_SQL);
    }
    await initPromise;
  }

  return {
    async get(key) {
      await ensureInit();
      const result = await client.execute({
        sql: 'SELECT value FROM kv_store WHERE key = ? LIMIT 1',
        args: [key],
      });

      if (!result.rows.length) {
        return null;
      }

      return String(result.rows[0].value);
    },

    async put(key, value) {
      await ensureInit();
      await client.execute({
        sql: `
INSERT INTO kv_store (key, value)
VALUES (?, ?)
ON CONFLICT(key) DO UPDATE SET value = excluded.value
`,
        args: [key, String(value ?? '')],
      });
    },

    async delete(key) {
      await ensureInit();
      await client.execute({
        sql: 'DELETE FROM kv_store WHERE key = ?',
        args: [key],
      });
    },
  };
}
