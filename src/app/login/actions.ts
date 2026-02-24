'use server';

import { signIn } from '@/lib/auth';

export async function loginAction(email: string, password: string): Promise<{ error?: string }> {
  const result = await signIn(email, password);
  if (result.error) return { error: result.error };
  return {};
}
