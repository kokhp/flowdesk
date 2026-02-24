'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export interface ServicePayload {
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

function normalizePrice(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number.parseFloat(cleaned);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
}

export async function createService(formData: FormData): Promise<{ service?: ServicePayload; error?: string }> {
  const user = await getSession();
  if (!user) return { error: 'Not authenticated' };

  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const duration = Number.parseInt(String(formData.get('duration') || '0'), 10);
  const price = normalizePrice(String(formData.get('price') || '0'));

  if (!name || !description || duration <= 0 || price <= 0) {
    return { error: 'Provide a name, description, duration, and price.' };
  }

  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const sql = db();
  await sql`
    INSERT INTO services (id, user_id, name, description, duration_minutes, price, active, created_at, updated_at)
    VALUES (${id}, ${user.id}, ${name}, ${description}, ${duration}, ${price}, ${true}, ${timestamp}, ${timestamp})
  `;

  revalidatePath('/dashboard/services');

  return {
    service: {
      id,
      user_id: user.id,
      name,
      description,
      duration_minutes: duration,
      price,
      active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

export async function updateService(formData: FormData): Promise<{ service?: ServicePayload; error?: string }> {
  const user = await getSession();
  if (!user) return { error: 'Not authenticated' };

  const id = String(formData.get('id') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const duration = Number.parseInt(String(formData.get('duration') || '0'), 10);
  const price = normalizePrice(String(formData.get('price') || '0'));
  const active = String(formData.get('active') || 'true') === 'true';

  if (!id || !name || !description || duration <= 0 || price <= 0) {
    return { error: 'Provide a name, description, duration, and price.' };
  }

  const timestamp = new Date().toISOString();
  const sql = db();
  await sql`
    UPDATE services
    SET name = ${name}, description = ${description}, duration_minutes = ${duration}, price = ${price}, active = ${active}, updated_at = ${timestamp}
    WHERE id = ${id} AND user_id = ${user.id}
  `;

  revalidatePath('/dashboard/services');

  return {
    service: {
      id,
      user_id: user.id,
      name,
      description,
      duration_minutes: duration,
      price,
      active,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

export async function setServiceActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  const user = await getSession();
  if (!user) return { success: false, error: 'Not authenticated' };

  const timestamp = new Date().toISOString();
  const sql = db();
  await sql`
    UPDATE services
    SET active = ${active}, updated_at = ${timestamp}
    WHERE id = ${id} AND user_id = ${user.id}
  `;

  revalidatePath('/dashboard/services');

  return { success: true };
}
