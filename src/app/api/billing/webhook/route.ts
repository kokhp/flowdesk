import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const sql = db();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan || 'pro';

      if (userId) {
        await sql`
          UPDATE subscriptions
          SET stripe_customer_id = ${session.customer as string},
              stripe_subscription_id = ${session.subscription as string},
              plan = ${plan},
              status = 'active'
          WHERE user_id = ${userId}
        `;
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await sql`
        UPDATE subscriptions
        SET status = ${subscription.status},
            current_period_end = ${new Date(subscription.current_period_end * 1000).toISOString()}
        WHERE stripe_subscription_id = ${subscription.id}
      `;
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await sql`
        UPDATE subscriptions
        SET status = 'canceled', plan = 'free'
        WHERE stripe_subscription_id = ${subscription.id}
      `;
      break;
    }
  }

  return NextResponse.json({ received: true });
}
