import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

async function getUserIdForCustomer(customerId: string) {
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  return user?.id ?? null;
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Signature webhook Stripe invalide :", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId;
      const customerId = checkoutSession.customer as string;
      const subscriptionId = checkoutSession.subscription as string | null;

      if (userId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const item = subscription.items.data[0];
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: item?.current_period_end
              ? new Date(item.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.userId ?? (await getUserIdForCustomer(subscription.customer as string));
      const item = subscription.items.data[0];

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: item?.current_period_end
              ? new Date(item.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.userId ?? (await getUserIdForCustomer(subscription.customer as string));

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: "canceled" },
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
