import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAccess, trialDaysLeft } from "@/lib/subscription";
import { SubscribeButton, ManageBillingButton } from "@/components/SubscriptionActions";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Essai gratuit",
  active: "Actif",
  past_due: "Paiement en attente",
  canceled: "Annulé",
  incomplete: "Incomplet",
};

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  const access = hasAccess(user);
  const daysLeft = trialDaysLeft(user.trialEndsAt);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-1">Abonnement</h1>
      <p className="opacity-60 mb-6">Gérez votre abonnement et votre mode de paiement.</p>

      <div className="rounded-2xl border border-black/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-60">Statut actuel</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              access ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {STATUS_LABELS[user.subscriptionStatus] ?? user.subscriptionStatus}
          </span>
        </div>
        {user.subscriptionStatus === "trialing" && (
          <p className="text-sm opacity-70">
            {access
              ? `Il vous reste ${daysLeft} jour${daysLeft === 1 ? "" : "s"} d'essai gratuit.`
              : "Votre essai gratuit est terminé."}
          </p>
        )}
        {user.subscriptionStatus === "active" && user.currentPeriodEnd && (
          <p className="text-sm opacity-70">
            Prochain renouvellement le{" "}
            {new Date(user.currentPeriodEnd).toLocaleDateString("fr-FR")}.
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-white border-2 border-[var(--primary)] p-6 mb-6">
        <h2 className="font-semibold text-lg mb-1">Pro</h2>
        <p className="text-2xl font-extrabold mb-3">9,99€ / mois</p>
        <ul className="text-sm opacity-75 space-y-1.5 mb-5">
          <li>✔️ Histoires illimitées</li>
          <li>✔️ Profils enfants illimités</li>
          <li>✔️ Historique complet des histoires</li>
          <li>✔️ Annulation en un clic</li>
        </ul>
        {user.subscriptionStatus === "active" ? (
          <p className="text-sm text-green-700 font-medium">✔️ Abonnement actif</p>
        ) : (
          <SubscribeButton />
        )}
      </div>

      {user.stripeCustomerId && (
        <div>
          <ManageBillingButton />
        </div>
      )}
    </div>
  );
}
