import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!priceId) {
    return NextResponse.json(
      { error: "L'abonnement n'est pas encore configuré (STRIPE_PRICE_ID manquant)." },
      { status: 500 },
    );
  }

  try {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/abonnement?success=1`,
      cancel_url: `${appUrl}/dashboard/abonnement?canceled=1`,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Erreur lors de la création de la session Stripe Checkout :", err);
    return NextResponse.json(
      { error: "Impossible de démarrer le paiement pour le moment. Réessayez dans un instant." },
      { status: 502 },
    );
  }
}
