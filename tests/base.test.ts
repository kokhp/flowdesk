import { describe, it, expect } from 'vitest';

describe('SaaS Chassis Base Tests', () => {
  it('should have required environment variables defined', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });

  it('should have utils functions available', async () => {
    const { cn, formatCurrency, formatDate } = await import('../src/lib/utils');
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(formatCurrency(9.99)).toContain('9.99');
    expect(formatDate('2024-01-15')).toContain('2024');
  });

  it('should format currency correctly', async () => {
    const { formatCurrency } = await import('../src/lib/utils');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(29.99)).toBe('$29.99');
  });
});
