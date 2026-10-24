import { query } from "../db";
import { hashPassword, verifyPassword, PASSWORD_POLICY } from "./password";
import type { AuthUser } from "../context/AppContext";

export interface DbUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  password_hash: string;
}

export async function ensureAuthTables(): Promise<void> {
  await query(
    `CREATE TABLE IF NOT EXISTS prysm_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(320) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password_hash TEXT NOT NULL,
      plan VARCHAR(100) DEFAULT 'Pro Intelligence',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    )`
  );
  await query(
    `CREATE TABLE IF NOT EXISTS auth_security_events (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      email_attempt VARCHAR(320),
      success BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
  );
}

function toAuthUser(row: Pick<DbUser, "id" | "email" | "name" | "plan">): AuthUser {
  const parts = row.name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : row.name.slice(0, 2).toUpperCase();
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    plan: row.plan,
    initials,
    authSource: "database",
  };
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  await ensureAuthTables();
  const rows = await query<DbUser>(
    `SELECT id, email, name, plan, password_hash FROM prysm_users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [email.trim()]
  );
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  await ensureAuthTables();
  const rows = await query<Pick<DbUser, "id" | "email" | "name" | "plan">>(
    `SELECT id, email, name, plan FROM prysm_users WHERE id = $1 LIMIT 1`,
    [id]
  );
  const row = rows[0];
  return row ? toAuthUser(row) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  plan?: string;
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  await ensureAuthTables();
  if (!input.name.trim() || !input.email.includes("@")) {
    return { ok: false, error: "Name and a valid email are required." };
  }
  if (!PASSWORD_POLICY.validate(input.password)) {
    return { ok: false, error: PASSWORD_POLICY.message };
  }

  const existing = await findUserByEmail(input.email);
  if (existing) {
    return { ok: false, error: "An account with this email already exists. Sign in instead." };
  }

  const password_hash = await hashPassword(input.password);
  const rows = await query<Pick<DbUser, "id" | "email" | "name" | "plan">>(
    `INSERT INTO prysm_users (email, name, password_hash, plan)
     VALUES (LOWER($1), $2, $3, $4)
     RETURNING id, email, name, plan`,
    [input.email.trim(), input.name.trim(), password_hash, input.plan ?? "Pro Intelligence"]
  );
  const row = rows[0];
  if (!row) return { ok: false, error: "Could not create account. Try again." };
  return { ok: true, user: toAuthUser(row) };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  await ensureAuthTables();
  if (!email.includes("@") || password.length < 6) {
    return { ok: false, error: "Enter a valid email and password." };
  }

  const row = await findUserByEmail(email);
  if (!row) {
    await logAuthEvent("login", email, false);
    return { ok: false, error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, row.password_hash);
  await logAuthEvent("login", email, valid);
  if (!valid) {
    return { ok: false, error: "Invalid email or password." };
  }

  await query(`UPDATE prysm_users SET last_login_at = NOW() WHERE id = $1`, [row.id]);
  return { ok: true, user: toAuthUser(row) };
}

export async function upsertSeedUser(input: {
  email: string;
  name: string;
  password: string;
  plan: string;
}): Promise<void> {
  await ensureAuthTables();
  const password_hash = await hashPassword(input.password);
  await query(
    `INSERT INTO prysm_users (email, name, password_hash, plan)
     VALUES (LOWER($1), $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       plan = EXCLUDED.plan`,
    [input.email, input.name, password_hash, input.plan]
  );
}

async function logAuthEvent(
  eventType: string,
  email: string,
  success: boolean
): Promise<void> {
  try {
    await query(
      `INSERT INTO auth_security_events (event_type, email_attempt, success) VALUES ($1, LOWER($2), $3)`,
      [eventType, email.trim(), success]
    );
  } catch {
    /* non-blocking */
  }
}

export async function getSecurityAuditSnapshot(): Promise<{
  passwordAlgorithm: string;
  plaintextPasswordsStored: boolean;
  sessionCookie: string;
  sessionFlags: string[];
  usersTable: string;
  authEventsTable: string;
  seededJudgeAccount: string;
}> {
  await ensureAuthTables();
  const judge = await findUserByEmail("judge@hacknova.io");
  return {
    passwordAlgorithm: "scrypt (N=16384, r=8, p=1) via Node.js crypto",
    plaintextPasswordsStored: false,
    sessionCookie: "prysm_session (HMAC-SHA256 signed payload)",
    sessionFlags: ["HttpOnly", "SameSite=Lax", "Secure in production"],
    usersTable: "prysm_users.password_hash only — no password column",
    authEventsTable: "auth_security_events (login audit trail)",
    seededJudgeAccount: judge ? "judge@hacknova.io present" : "run npm run db:seed",
  };
}
