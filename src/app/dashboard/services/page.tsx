import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import ServiceCatalog from './ServiceCatalog';
import type { ServicePayload } from './actions';

export default async function ServicesPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const sql = db();
  const rows = await sql`
    SELECT id, user_id, name, description, duration_minutes, price, active, created_at, updated_at
    FROM services WHERE user_id = ${user.id}
  `;

  const services = (rows as ServicePayload[]).map((service) => ({
    ...service,
    price: typeof service.price === 'string' ? Number.parseFloat(service.price) : service.price,
    duration_minutes:
      typeof service.duration_minutes === 'string'
        ? Number.parseInt(service.duration_minutes, 10)
        : service.duration_minutes,
    active: Boolean(service.active),
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Operations</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Service Catalog</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Build and maintain the services you sell. Set pricing, duration, and availability at a glance.
        </p>
      </div>
      <ServiceCatalog initialServices={services} />
    </div>
  );
}
