import type { ReactNode } from 'react';

interface UpgradeGateProps {
  feature: string;
  plan?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

// In free/opensource mode: always render children
// In freemium mode: check plan (to be implemented by Codex per product)
export function UpgradeGate({ feature, children, fallback }: UpgradeGateProps) {
  // Default: open gate (free mode)
  // When monetization is enabled, this component checks user's plan
  const isGated = false; // Will be replaced by actual plan check

  if (isGated) {
    return (
      <>
        {fallback || (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 text-center dark:border-brand-800 dark:bg-brand-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-white">Upgrade to unlock</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              This feature requires a Pro plan or higher.
            </p>
            <a
              href="/dashboard/billing"
              className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Upgrade Now
            </a>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
