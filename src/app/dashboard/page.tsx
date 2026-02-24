import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const stats = [
    { label: 'Active services', value: '—', change: 'Manage catalog' },
    { label: 'Bookings today', value: '—', change: 'Live view' },
    { label: 'No-show rate', value: '—', change: 'Last 30 days' },
    { label: 'Team coverage', value: '—', change: 'On schedule' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name || user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service catalog</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Add services, pricing, and durations so clients book the right slot.
          </p>
          <Link href="/dashboard/services" className="mt-4 inline-flex items-center text-sm font-semibold text-brand-600">
            Manage services →
          </Link>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Next steps</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Invite your team, set business hours, and launch your booking page.
          </p>
          <Link href="/dashboard/settings" className="mt-4 inline-flex items-center text-sm font-semibold text-brand-600">
            Complete setup →
          </Link>
        </div>
      </div>
    </div>
  );
}
