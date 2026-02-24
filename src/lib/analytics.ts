export function AnalyticsScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return `<script defer data-domain="${domain}" src="https://plausible.io/js/script.js"></script>`;
}

export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).plausible) {
    (window as unknown as Record<string, (...args: unknown[]) => void>).plausible(eventName, { props });
  }
}
