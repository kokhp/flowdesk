import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

export interface LocalUser {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface LocalSubscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalUsage {
  id: string;
  user_id: string;
  feature: string;
  count: number;
  period: string;
  created_at: string;
}

export interface LocalService {
  id: string;
  user_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalDb {
  users: LocalUser[];
  sessions: LocalSession[];
  subscriptions: LocalSubscription[];
  usage: LocalUsage[];
  services: LocalService[];
}

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'local-db.json');

const EMPTY_DB: LocalDb = {
  users: [],
  sessions: [],
  subscriptions: [],
  usage: [],
  services: [],
};

function ensureDataFile(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(EMPTY_DB, null, 2), 'utf-8');
  }
}

export function readLocalDb(): LocalDb {
  ensureDataFile();
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as LocalDb;
    return {
      ...EMPTY_DB,
      ...parsed,
      users: parsed.users || [],
      sessions: parsed.sessions || [],
      subscriptions: parsed.subscriptions || [],
      usage: parsed.usage || [],
      services: parsed.services || [],
    };
  } catch {
    return { ...EMPTY_DB };
  }
}

export function writeLocalDb(db: LocalDb): void {
  ensureDataFile();
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
