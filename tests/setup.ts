import '@testing-library/jest-dom';

// Mock Neon DB
vi.mock('@/lib/db', () => ({
  db: () => {
    const mockSql = async () => [];
    return mockSql;
  },
}));

// Mock Auth
vi.mock('@/lib/auth', () => ({
  getSession: vi.fn().mockResolvedValue({
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
  }),
  signIn: vi.fn().mockResolvedValue({ user: { id: 'test-user', email: 'test@example.com' } }),
  signUp: vi.fn().mockResolvedValue({ user: { id: 'test-user', email: 'test@example.com' } }),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_APP_NAME = 'TestApp';
