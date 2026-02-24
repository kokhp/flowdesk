'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

export async function createCheckoutAction(plan: string): Promise<{ url: string | null }> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const priceId = plan === 'business'
    ? process.env.STRIPE_BUSINESS_PRICE_ID
    : process.env.STRIPE_PRO_PRICE_ID;

  if (!priceId) throw new Error('Stripe price ID not configured');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    success_url: `${appUrl}/dashboard/billing?success=true`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
    metadata: { user_id: user.id, plan },
  });

  return { url: session.url };
}

export async function openPortalAction(): Promise<{ url: string }> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');

  const sql = db();
  const subs = await sql`SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${user.id}`;
  const sub = subs[0];

  if (!sub?.stripe_customer_id) throw new Error('No subscription found');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id as string,
    return_url: `${appUrl}/dashboard/billing`,
  });

  return { url: session.url };
}

export async function cancelSubscription(): Promise<void> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');

  const sql = db();
  const subs = await sql`SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ${user.id}`;
  const sub = subs[0];

  if (!sub?.stripe_subscription_id) throw new Error('No subscription found');

  await stripe.subscriptions.update(sub.stripe_subscription_id as string, {
    cancel_at_period_end: true,
  });
}
