'use server';

import { getSession, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');

  const name = formData.get('name') as string;

  const sql = db();
  await sql`UPDATE users SET name = ${name} WHERE id = ${user.id}`;
  revalidatePath('/dashboard');
}

export async function exportUserData(): Promise<{ data?: Record<string, unknown>; error?: string }> {
  const user = await getSession();
  if (!user) return { error: 'Not authenticated' };

  try {
    const sql = db();
    const users = await sql`SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ${user.id}`;
    const subs = await sql`SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ${user.id}`;
    const usageData = await sql`SELECT feature, count, period FROM usage WHERE user_id = ${user.id}`;

    return {
      data: {
        profile: users[0] || null,
        subscription: subs[0] || null,
        usage: usageData,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Export failed' };
  }
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const user = await getSession();
  if (!user) return { error: 'Not authenticated' };

  try {
    const sql = db();
    // Cascading deletes handle sessions, subscriptions, usage
    await sql`DELETE FROM users WHERE id = ${user.id}`;
    await signOut();
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Delete failed' };
  }
}
