'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { createCheckoutAction, openPortalAction } from './actions';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const { plan } = useSubscription();

  async function handleUpgrade(targetPlan: string) {
    setLoading(true);
    try {
      const result = await createCheckoutAction(targetPlan);
      if (result?.url) window.location.href = result.url;
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setLoading(false);
  }

  async function handleManage() {
    setLoading(true);
    try {
      const result = await openPortalAction();
      if (result?.url) window.location.href = result.url;
    } catch (err) {
      console.error('Portal error:', err);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your subscription</p>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You are on the <span className="font-medium capitalize text-brand-600">{plan}</span> plan
            </p>
          </div>
          {plan !== 'free' && (
            <button
              onClick={handleManage}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Upgrade Options */}
      {plan === 'free' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-brand-600 bg-white p-6 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pro</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">$9<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Unlimited usage</li>
              <li>Priority support</li>
              <li>Advanced features</li>
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Business</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">$29<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Everything in Pro</li>
              <li>Team features</li>
              <li>API access</li>
            </ul>
            <button
              onClick={() => handleUpgrade('business')}
              disabled={loading}
              className="mt-6 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
            >
              {loading ? 'Loading...' : 'Upgrade to Business'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
