'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, deleteAccount, exportUserData } from './actions';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleExport() {
    setLoading(true);
    try {
      const result = await exportUserData();
      if (result.error) throw new Error(result.error);
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage('Export failed');
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setLoading(true);
    try {
      await deleteAccount();
      router.push('/');
    } catch {
      setMessage('Failed to delete account');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
      </div>

      {message && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {message}
        </div>
      )}

      {/* Profile Form */}
      <form action={updateProfile} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Save changes
        </button>
      </form>

      {/* Data Export */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Download all your data as CSV</p>
        <button
          onClick={handleExport}
          disabled={loading}
          className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 transition-colors"
        >
          {loading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
