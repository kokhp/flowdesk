'use client';

import { useState, useEffect } from 'react';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch('/api/subscription');
        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription);
        }
      } catch {} finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const plan = subscription?.plan || 'free';

  return {
    subscription,
    loading,
    plan,
    isPro: plan === 'pro',
    isBusiness: plan === 'business',
    isFree: plan === 'free',
  };
}
