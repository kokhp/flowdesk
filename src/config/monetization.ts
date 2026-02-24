import { product } from './product';

export type MonetizationMode = 'free' | 'freemium' | 'opensource';

export const monetizationMode: MonetizationMode = product.monetization_mode || 'free';

export const isFreemium = monetizationMode === 'freemium';
export const isFree = monetizationMode === 'free';
export const isOpenSource = monetizationMode === 'opensource';

export function shouldShowPricing(): boolean {
  return isFreemium;
}

export function shouldShowBilling(): boolean {
  return isFreemium;
}

export function getFreeLimits(): Record<string, number> {
  return product.pricing?.free_limits || {};
}

export function getProPrice(): number {
  return product.pricing?.pro_price || 9;
}

export function getBusinessPrice(): number | undefined {
  return product.pricing?.business_price;
}
