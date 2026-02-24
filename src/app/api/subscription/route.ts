import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ subscription: null }, { status: 401 });
  }

  const sql = db();
  const subs = await sql`
    SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ${user.id}
  `;

  return NextResponse.json({ subscription: subs[0] || { plan: 'free', status: 'active', current_period_end: null } });
}
