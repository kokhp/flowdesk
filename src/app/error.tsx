'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
