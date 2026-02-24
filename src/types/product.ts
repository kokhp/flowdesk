export interface ProductFeature {
  name: string;
  description: string;
  layer: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  acceptance_criteria: string[];
}

export interface ProductHero {
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_url: string;
}

export interface ProductProblem {
  headline: string;
  points: string[];
}

export interface ProductSolution {
  headline: string;
  description: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}
