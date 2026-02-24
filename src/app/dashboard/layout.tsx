import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardShell } from '@/components/dashboard/shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect('/login');

  const sql = db();
  const profiles = await sql`SELECT name, avatar_url FROM users WHERE id = ${user.id}`;
  const profile = profiles[0];

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email,
        name: (profile?.name as string) || user.name || '',
        avatar_url: (profile?.avatar_url as string) || null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
