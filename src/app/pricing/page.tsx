import Link from 'next/link';
import { product } from '@/config/product';

export default function PricingPage() {
  if (product.monetization_mode !== 'freemium') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Completely Free</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{product.name} is free to use with no limits.</p>
          <Link href="/signup" className="mt-8 inline-block rounded-lg bg-brand-600 px-8 py-3 text-white font-medium hover:bg-brand-700">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const pricing = product.pricing;
  const plans = [
    {
      name: 'Free',
      price: 0,
      features: Object.entries(pricing?.free_limits || {}).map(([k, v]) => `${v} ${k}`),
      cta: 'Get Started',
      href: '/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: pricing?.pro_price || 9,
      features: pricing?.pro_features || ['Unlimited usage', 'Priority support'],
      cta: 'Start Pro',
      href: '/signup?plan=pro',
      highlighted: true,
    },
    ...(pricing?.business_price ? [{
      name: 'Business',
      price: pricing.business_price,
      features: pricing.business_features || ['Everything in Pro', 'Team features', 'API access'],
      cta: 'Start Business',
      href: '/signup?plan=business',
      highlighted: false,
    }] : []),
  ];

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Simple pricing</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Start free, upgrade when you need to.</p>
      </div>
      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-{plans.length}">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 ${
              plan.highlighted
                ? 'border-brand-600 ring-2 ring-brand-600 shadow-lg'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
              {plan.price > 0 && <span className="text-gray-500">/mo</span>}
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 block rounded-lg py-2 text-center text-sm font-medium transition-colors ${
                plan.highlighted
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
