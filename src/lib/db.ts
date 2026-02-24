import { neon } from '@neondatabase/serverless';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlQuery = (strings: TemplateStringsArray, ...values: any[]) => Promise<Record<string, any>[]>;

let _sql: SqlQuery | null = null;

export function db(): SqlQuery {
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
