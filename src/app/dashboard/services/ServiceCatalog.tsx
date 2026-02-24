'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, setServiceActive, updateService, ServicePayload } from './actions';

interface ServiceCatalogProps {
  initialServices: ServicePayload[];
}

const EMPTY_FORM = {
  name: '',
  description: '',
  duration: '60',
  price: '120',
};

export default function ServiceCatalog({ initialServices }: ServiceCatalogProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServicePayload[]>(initialServices);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const activeCount = useMemo(() => services.filter((service) => service.active).length, [services]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setCreating(true);
    const formData = new FormData(event.currentTarget);
    const result = await createService(formData);
    if (result.error) {
      setError(result.error);
      setCreating(false);
      return;
    }
    if (result.service) {
      setServices((prev) => [result.service!, ...prev]);
      setForm(EMPTY_FORM);
      event.currentTarget.reset();
    }
    setCreating(false);
    router.refresh();
  };

  const handleEdit = (service: ServicePayload) => {
    setEditingId(service.id);
    setEditingForm({
      name: service.name,
      description: service.description,
      duration: String(service.duration_minutes),
      price: String(service.price),
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>, active: boolean) => {
    event.preventDefault();
    if (!editingId) return;
    setError('');
    setBusyId(editingId);
    const formData = new FormData(event.currentTarget);
    formData.set('id', editingId);
    formData.set('active', String(active));

    const result = await updateService(formData);
    if (result.error) {
      setError(result.error);
      setBusyId(null);
      return;
    }
    if (result.service) {
      setServices((prev) => prev.map((service) => (service.id === editingId ? { ...service, ...result.service! } : service)));
    }
    setBusyId(null);
    setEditingId(null);
    router.refresh();
  };

  const handleArchive = async (service: ServicePayload) => {
    setBusyId(service.id);
    await setServiceActive(service.id, !service.active);
    setServices((prev) =>
      prev.map((item) => (item.id === service.id ? { ...item, active: !service.active } : item))
    );
    setBusyId(null);
    router.refresh();
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Service Catalog</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track every service, rate, and duration in one place.
            </p>
          </div>
          <div className="rounded-xl bg-brand-50 px-4 py-2 text-sm text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            {activeCount} active services
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-6 grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Service name</label>
            <input
              name="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Signature Glow Facial"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="90-minute appointment with LED treatment"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Duration (min)</label>
            <input
              name="duration"
              type="number"
              min={15}
              step={5}
              value={form.duration}
              onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Price ($)</label>
            <input
              name="price"
              type="number"
              min={1}
              step={1}
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Adding...' : 'Add service'}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700">
            No services yet. Add your first service above.
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`rounded-2xl border p-5 shadow-sm transition ${
                service.active
                  ? 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                  : 'border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/60'
              }`}
            >
              {editingId === service.id ? (
                <form onSubmit={(event) => handleUpdate(event, service.active)} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Service name</label>
                    <input
                      name="name"
                      value={editingForm.name}
                      onChange={(event) => setEditingForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
                    <input
                      name="description"
                      value={editingForm.description}
                      onChange={(event) => setEditingForm((prev) => ({ ...prev, description: event.target.value }))}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Duration</label>
                      <input
                        name="duration"
                        type="number"
                        min={15}
                        step={5}
                        value={editingForm.duration}
                        onChange={(event) => setEditingForm((prev) => ({ ...prev, duration: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Price</label>
                      <input
                        name="price"
                        type="number"
                        min={1}
                        step={1}
                        value={editingForm.price}
                        onChange={(event) => setEditingForm((prev) => ({ ...prev, price: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={busyId === service.id}
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {service.active ? 'Active' : 'Archived'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>{service.duration_minutes} min</span>
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyId === service.id}
                      onClick={() => handleArchive(service)}
                      className="rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-200"
                    >
                      {service.active ? 'Archive' : 'Restore'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
