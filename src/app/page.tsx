import Link from 'next/link';
import { product } from '@/config/product';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</span>
          <div className="flex items-center gap-4">
            {product.monetization_mode === 'freemium' && (
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Pricing
              </Link>
            )}
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              {product.hero?.cta_text || 'Get Started'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center lg:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl text-balance">
          {product.hero?.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {product.hero?.subheadline}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={product.hero?.cta_url || '/signup'}
            className="rounded-lg bg-brand-600 px-8 py-3 text-base font-medium text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl"
          >
            {product.hero?.cta_text || 'Get Started Free'}
          </Link>
          <Link href="/login" className="text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400">
            Log in →
          </Link>
        </div>
      </section>

      {/* Problem */}
      {product.problem && (
        <section className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              {product.problem.headline}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {product.problem.points?.map((point: string, i: number) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solution */}
      {product.solution && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            {product.solution.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
            {product.solution.description}
          </p>
        </section>
      )}

      {/* Features */}
      {product.features?.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product.features.map((f: { name: string; description: string }, i: number) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{f.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faq?.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {product.faq.map((item: { question: string; answer: string }, i: number) => (
              <details key={i} className="group rounded-xl border border-gray-200 dark:border-gray-700">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-gray-900 dark:text-white">
                  {item.question}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100 bg-brand-600 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-lg text-brand-100">Join thousands of users. It&apos;s free.</p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-medium text-brand-600 hover:bg-brand-50 transition-colors"
          >
            {product.hero?.cta_text || 'Start Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {product.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
