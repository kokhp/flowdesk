'use server';

import { signUp } from '@/lib/auth';

export async function signupAction(name: string, email: string, password: string): Promise<{ error?: string }> {
  if (password.length < 8) return { error: 'Password must be at least 8 characters' };
  const result = await signUp(email, password, name);
  if (result.error) return { error: result.error };
  return {};
}
