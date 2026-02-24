import { db } from './db';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_COOKIE = 'session_token';
const SESSION_EXPIRY_DAYS = 30;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const sql = db();
  await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${userId}, ${token}, ${expiresAt.toISOString()})`;

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const sql = db();
    const result = await sql`
      SELECT u.id, u.email, u.name, u.avatar_url, u.created_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `;
    return result[0] as AuthUser || null;
  } catch {
    return null;
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const sql = db();

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) return { error: 'Email already registered' };

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    await sql`INSERT INTO users (id, email, password_hash, name) VALUES (${id}, ${email}, ${passwordHash}, ${name})`;
    await sql`INSERT INTO subscriptions (user_id, plan, status) VALUES (${id}, 'free', 'active')`;

    await createSession(id);

    return {
      user: { id, email, name, avatar_url: null, created_at: new Date().toISOString() },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Signup failed' };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const sql = db();

    const users = await sql`
      SELECT id, email, name, avatar_url, password_hash, created_at FROM users WHERE email = ${email}
    `;
    if (users.length === 0) return { error: 'Invalid email or password' };

    const user = users[0];
    const valid = await verifyPassword(password, user.password_hash as string);
    if (!valid) return { error: 'Invalid email or password' };

    await createSession(user.id as string);

    return {
      user: {
        id: user.id as string,
        email: user.email as string,
        name: user.name as string | null,
        avatar_url: user.avatar_url as string | null,
        created_at: user.created_at as string,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Login failed' };
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      const sql = db();
      await sql`DELETE FROM sessions WHERE token = ${token}`;
    } catch {}
  }

  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
}
