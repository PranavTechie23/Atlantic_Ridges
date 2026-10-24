import { Pool } from "pg";

// PostgreSQL Connection Pool Singleton for Next.js
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:root123@localhost:5432/prysm";

const isLocalhost =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1") ||
  connectionString.includes("host.docker.internal");

const useSsl =
  process.env.DATABASE_SSL === "true" ||
  (!isLocalhost && process.env.DATABASE_SSL !== "false") ||
  connectionString.includes("sslmode=require");

export const pool =
  global._pgPool ||
  new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
