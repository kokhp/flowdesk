import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface ProductConfig {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  pain_point: string;
  target_audience: string;
  competitors: string[];
  competitive_gaps: string[];
  features: {
    name: string;
    description: string;
    layer: number;
    priority: string;
  }[];
  monetization_mode: 'free' | 'freemium' | 'opensource';
  pricing?: {
    free_limits: Record<string, number>;
    pro_price: number;
    pro_features: string[];
    business_price?: number;
    business_features?: string[];
  };
  keywords: string[];
  color_primary: string;
  color_secondary: string;
  hero: {
    headline: string;
    subheadline: string;
    cta_text: string;
    cta_url: string;
  };
  problem: {
    headline: string;
    points: string[];
  };
  solution: {
    headline: string;
    description: string;
  };
  faq: { question: string; answer: string }[];
}

const defaultProduct: ProductConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'SaaS App',
  slug: 'saas-app',
  tagline: 'Your product tagline',
  description: 'Product description',
  category: 'NICHE_CARVEOUT',
  pain_point: '',
  target_audience: '',
  competitors: [],
  competitive_gaps: [],
  features: [],
  monetization_mode: 'free',
  keywords: [],
  color_primary: '#2563EB',
  color_secondary: '#1E40AF',
  hero: { headline: 'Build Something Amazing', subheadline: 'A powerful SaaS starter.', cta_text: 'Get Started', cta_url: '/signup' },
  problem: { headline: 'The Problem', points: [] },
  solution: { headline: 'The Solution', description: '' },
  faq: [],
};

function loadProduct(): ProductConfig {
  try {
    const path = join(process.cwd(), 'product.json');
    if (existsSync(path)) {
      const raw = readFileSync(path, 'utf-8');
      return { ...defaultProduct, ...JSON.parse(raw) };
    }
  } catch {}
  return defaultProduct;
}

export const product: ProductConfig = loadProduct();
