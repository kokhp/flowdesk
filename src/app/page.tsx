import Link from 'next/link';
import { product } from '@/config/product';

const metrics = [
  { label: 'No-show reduction', value: '32%' },
  { label: 'Avg. time saved', value: '11 hrs/week' },
  { label: 'Bookings processed', value: '48k+' },
  { label: 'Client satisfaction', value: '4.9/5' },
];

const logos = ['Aurora Dental', 'North Peak Wellness', 'Velvet Salon', 'Brightside Fitness', 'Studio Nine'];

const testimonials = [
  {
    quote:
      'FlowDesk let us replace three tools overnight. Deposits are automatic and our front desk finally has breathing room.',
    name: 'Maria L.',
    role: 'Owner, Velvet Salon',
  },
  {
    quote:
      'We cut no-shows by a third in the first month and the team can handle exceptions without me.',
    name: 'Derek R.',
    role: 'Operations Lead, North Peak Wellness',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" />
          <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Nav */}
        <nav className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <span className="text-xl font-semibold tracking-tight text-gray-900">{product.name}</span>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                {product.hero?.cta_text || 'Get Started'}
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Operations platform</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl text-balance font-display">
              {product.hero?.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-600">{product.hero?.subheadline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={product.hero?.cta_url || '/signup'}
                className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5 hover:bg-brand-700"
              >
                {product.hero?.cta_text || 'Start Free Trial'}
              </Link>
              <Link href="/login" className="text-base font-semibold text-gray-700 hover:text-gray-900">
                View live demo →
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-gray-200 bg-white/80 p-4">
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Today&apos;s schedule</p>
                  <p className="text-xs text-gray-500">6 appointments · 3 providers</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Live</span>
              </div>
              <div className="mt-6 space-y-4">
                {['09:00 — Dermal reset', '10:30 — Couples massage', '11:45 — Peak hour consult'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                    <span className="text-xs text-gray-500">Deposit captured</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-brand-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Automations</p>
                <p className="mt-2 text-sm text-gray-700">4 reminders scheduled, 2 waitlist fills queued.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Logos */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 text-sm text-gray-500">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Trusted by</span>
          {logos.map((logo) => (
            <span key={logo} className="text-sm font-semibold text-gray-500">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* Problem */}
      {product.problem && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 font-display">{product.problem.headline}</h2>
              <p className="mt-4 text-lg text-gray-600">
                FlowDesk replaces the patchwork of tools and manual follow-ups that keep you tethered to the front desk.
              </p>
              <Link href="/signup" className="mt-8 inline-flex items-center text-sm font-semibold text-brand-600">
                See how it works →
              </Link>
            </div>
            <div className="grid gap-6">
              {product.problem.points?.map((point: string) => (
                <div key={point} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solution */}
      {product.solution && (
        <section className="border-y border-gray-100 bg-gray-50">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Operations snapshot</p>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'No-show policy', value: 'Deposit required for 6 services' },
                  { label: 'Waitlist', value: '3 clients queued' },
                  { label: 'Team alerts', value: '2 escalations resolved' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{item.label}</p>
                    <p className="mt-1 text-sm text-gray-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 font-display">{product.solution.headline}</h2>
              <p className="mt-4 text-lg text-gray-600">{product.solution.description}</p>
              <div className="mt-8 grid gap-4">
                {[
                  'Automatic deposits and no-show enforcement built in.',
                  'Centralized service catalog, staff coordination, and client history.',
                  'Real-time reminders and waitlist automation to keep schedules full.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                    <p className="text-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {product.features?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-900 font-display">Capabilities</h2>
            <Link href="/signup" className="text-sm font-semibold text-brand-600">Launch with FlowDesk →</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.features.slice(0, 6).map((feature) => (
              <div key={feature.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold text-gray-900 font-display">Teams that left spreadsheets behind</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-gray-700">“{item.quote}”</p>
                <div className="mt-6 text-sm font-semibold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {product.faq?.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold text-gray-900 text-center font-display">FAQ</h2>
          <div className="mt-10 space-y-4">
            {product.faq.map((item) => (
              <details key={item.question} className="group rounded-xl border border-gray-200 bg-white p-5">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900">
                  {item.question}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pt-3 text-sm text-gray-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold text-white font-display">Ready to run without the chaos?</h2>
          <p className="mt-4 text-lg text-brand-100">Start your free trial today. Cancel anytime.</p>
          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-lg bg-white px-8 py-3 text-base font-semibold text-brand-600 hover:bg-brand-50"
          >
            {product.hero?.cta_text || 'Start Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {product.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
