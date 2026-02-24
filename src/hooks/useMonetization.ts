'use client';

export function useMonetization() {
  // Monetization mode is set at build time via product.json
  // Default to 'free' if not configured
  const mode = (process.env.NEXT_PUBLIC_MONETIZATION_MODE || 'free') as 'free' | 'freemium' | 'opensource';

  return {
    mode,
    isFree: mode === 'free',
    isFreemium: mode === 'freemium',
    isOpenSource: mode === 'opensource',
    shouldShowPricing: mode === 'freemium',
    shouldShowBilling: mode === 'freemium',
  };
}
