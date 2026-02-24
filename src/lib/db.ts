import { neon } from '@neondatabase/serverless';
import {
  readLocalDb,
  writeLocalDb,
  newId,
  nowIso,
  LocalDb,
  LocalUser,
  LocalSession,
  LocalSubscription,
  LocalUsage,
  LocalService,
} from './local-store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlQuery = (strings: TemplateStringsArray, ...values: any[]) => Promise<Record<string, any>[]>;

let _sql: SqlQuery | null = null;

const USE_LOCAL_DB = !process.env.DATABASE_URL;

function applyMutation(db: LocalDb, text: string, values: any[]): void {
  const sql = text.replace(/\s+/g, ' ').trim().toLowerCase();

  if (sql.startsWith('insert into users')) {
    const [id, email, passwordHash, name] = values as [string, string, string, string | null];
    const now = nowIso();
    const user: LocalUser = {
      id,
      email,
      password_hash: passwordHash,
      name,
      avatar_url: null,
      created_at: now,
      updated_at: now,
    };
    db.users.push(user);
    return;
  }

  if (sql.startsWith('insert into subscriptions')) {
    const [userId, plan, status] = values as [string, 'free' | 'pro' | 'business', 'active' | 'canceled' | 'past_due' | 'trialing'];
    const now = nowIso();
    const sub: LocalSubscription = {
      id: newId(),
      user_id: userId,
      plan,
      status,
      created_at: now,
      updated_at: now,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      current_period_end: null,
    };
    db.subscriptions = db.subscriptions.filter((s) => s.user_id !== userId);
    db.subscriptions.push(sub);
    return;
  }

  if (sql.startsWith('insert into sessions')) {
    const [userId, token, expiresAt] = values as [string, string, string];
    const session: LocalSession = {
      id: newId(),
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: nowIso(),
    };
    db.sessions.push(session);
    return;
  }

  if (sql.startsWith('delete from sessions')) {
    const [token] = values as [string];
    db.sessions = db.sessions.filter((s) => s.token !== token);
    return;
  }

  if (sql.startsWith('update users set name')) {
    const [name, id] = values as [string, string];
    db.users = db.users.map((u) => (u.id === id ? { ...u, name, updated_at: nowIso() } : u));
    return;
  }

  if (sql.startsWith('delete from users')) {
    const [id] = values as [string];
    db.users = db.users.filter((u) => u.id !== id);
    db.sessions = db.sessions.filter((s) => s.user_id !== id);
    db.subscriptions = db.subscriptions.filter((s) => s.user_id !== id);
    db.usage = db.usage.filter((u) => u.user_id !== id);
    db.services = db.services.filter((s) => s.user_id !== id);
    return;
  }

  if (sql.startsWith('insert into services')) {
    const [id, userId, name, description, durationMinutes, price, active, createdAt, updatedAt] = values as [
      string,
      string,
      string,
      string,
      number,
      number,
      boolean,
      string,
      string,
    ];
    const service: LocalService = {
      id,
      user_id: userId,
      name,
      description,
      duration_minutes: durationMinutes,
      price,
      active,
      created_at: createdAt,
      updated_at: updatedAt,
    };
    db.services.push(service);
    return;
  }

  if (sql.startsWith('update services set')) {
    const [name, description, durationMinutes, price, active, updatedAt, id, userId] = values as [
      string,
      string,
      number,
      number,
      boolean,
      string,
      string,
      string,
    ];
    db.services = db.services.map((service) =>
      service.id === id && service.user_id === userId
        ? { ...service, name, description, duration_minutes: durationMinutes, price, active, updated_at: updatedAt }
        : service
    );
    return;
  }

  if (sql.startsWith('update services set active')) {
    const [active, updatedAt, id, userId] = values as [boolean, string, string, string];
    db.services = db.services.map((service) =>
      service.id === id && service.user_id === userId ? { ...service, active, updated_at: updatedAt } : service
    );
    return;
  }
}

function queryLocalDb(strings: TemplateStringsArray, values: any[]): Promise<Record<string, any>[]> {
  const text = strings.join(' ').replace(/\s+/g, ' ').trim();
  const normalized = text.toLowerCase();
  const db = readLocalDb();

  if (normalized.startsWith('select id from users where email')) {
    const [email] = values as [string];
    return Promise.resolve(db.users.filter((u) => u.email === email).map((u) => ({ id: u.id })));
  }

  if (normalized.startsWith('select id, email, name, avatar_url, password_hash, created_at from users where email')) {
    const [email] = values as [string];
    return Promise.resolve(
      db.users
        .filter((u) => u.email === email)
        .map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          avatar_url: u.avatar_url,
          password_hash: u.password_hash,
          created_at: u.created_at,
        }))
    );
  }

  if (normalized.startsWith('select u.id, u.email')) {
    const [token] = values as [string];
    const session = db.sessions.find((s) => s.token === token);
    if (!session) return Promise.resolve([]);
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      db.sessions = db.sessions.filter((s) => s.token !== token);
      writeLocalDb(db);
      return Promise.resolve([]);
    }
    const user = db.users.find((u) => u.id === session.user_id);
    if (!user) return Promise.resolve([]);
    return Promise.resolve([
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    ]);
  }

  if (normalized.startsWith('select name, avatar_url from users where id')) {
    const [id] = values as [string];
    return Promise.resolve(
      db.users
        .filter((u) => u.id === id)
        .map((u) => ({ name: u.name, avatar_url: u.avatar_url }))
    );
  }

  if (normalized.startsWith('select id, email, name, avatar_url, created_at from users where id')) {
    const [id] = values as [string];
    return Promise.resolve(
      db.users
        .filter((u) => u.id === id)
        .map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          avatar_url: u.avatar_url,
          created_at: u.created_at,
        }))
    );
  }

  if (normalized.startsWith('select plan, status, current_period_end from subscriptions where user_id')) {
    const [userId] = values as [string];
    return Promise.resolve(
      db.subscriptions
        .filter((s) => s.user_id === userId)
        .map((s) => ({
          plan: s.plan,
          status: s.status,
          current_period_end: s.current_period_end ?? null,
        }))
    );
  }

  if (normalized.startsWith('select feature, count, period from usage where user_id')) {
    const [userId] = values as [string];
    return Promise.resolve(
      db.usage.filter((u) => u.user_id === userId).map((u) => ({ feature: u.feature, count: u.count, period: u.period }))
    );
  }

  if (normalized.startsWith('select id, user_id, name, description, duration_minutes, price, active, created_at, updated_at from services where user_id')) {
    const [userId] = values as [string];
    return Promise.resolve(
      db.services
        .filter((s) => s.user_id === userId)
        .map((s) => ({
          id: s.id,
          user_id: s.user_id,
          name: s.name,
          description: s.description,
          duration_minutes: s.duration_minutes,
          price: s.price,
          active: s.active,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }))
    );
  }

  applyMutation(db, text, values);
  writeLocalDb(db);
  return Promise.resolve([]);
}

export function db(): SqlQuery {
  if (USE_LOCAL_DB) {
    return (async (strings: TemplateStringsArray, ...values: any[]) =>
      queryLocalDb(strings, values)) as SqlQuery;
  }
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL is not configured');
    }
    _sql = neon(url) as SqlQuery;
  }
  return _sql;
}

// For cases where you need a fresh connection (e.g., different database)
export function createDb(url: string): SqlQuery {
  return neon(url) as SqlQuery;
}
