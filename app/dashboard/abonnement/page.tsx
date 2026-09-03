import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canGenerateStory, isPremium } from "@/lib/subscription";
import { PRO_MONTHLY_PRICE_EUR } from "@/lib/pricing";
import { SubscribeButton, ManageBillingButton } from "@/components/SubscriptionActions";

const STATUS_LABELS: Record<string, string> = {
  free: "Palier gratuit",
  active: "Pro — actif",
  past_due: "Paiement en attente",
  canceled: "Annulé",
  incomplete: "Incomplet",
};

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  const premium = isPremium(user);
  const access = await canGenerateStory(user);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-1">Abonnement</h1>
      <p className="opacity-60 mb-6">Gérez votre abonnement et votre mode de paiement.</p>

      <div className="rounded-2xl border border-black/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-60">Statut actuel</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              premium ? "bg-green-100 text-green-700" : "bg-black/5"
            }`}
          >
            {STATUS_LABELS[user.subscriptionStatus] ?? user.subscriptionStatus}
          </span>
        </div>
        {!premium && (
          <p className="text-sm opacity-70">
            {access.allowed
              ? `Il vous reste ${access.remainingFree} histoire${access.remainingFree === 1 ? "" : "s"} gratuite${access.remainingFree === 1 ? "" : "s"} aujourd'hui.`
              : "Votre histoire gratuite du jour est utilisée, revenez demain."}
          </p>
        )}
        {user.subscriptionStatus === "active" && user.currentPeriodEnd && (
          <p className="text-sm opacity-70">
            Prochain renouvellement le{" "}
            {new Date(user.currentPeriodEnd).toLocaleDateString("fr-FR")}.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-black/10 p-6">
          <h2 className="font-semibold text-lg mb-1">Gratuit</h2>
          <p className="text-2xl font-extrabold mb-3">0€</p>
          <ul className="text-sm opacity-75 space-y-1.5">
            <li>✔️ 1 histoire par jour</li>
            <li>✔️ Profils enfants illimités</li>
            <li>✔️ Historique conservé</li>
            <li className="opacity-40">✘ Narration audio</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white border-2 border-[var(--primary)] p-6 relative">
          <span className="absolute -top-3 right-6 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
            Populaire
          </span>
          <h2 className="font-semibold text-lg mb-1">Pro</h2>
          <p className="text-2xl font-extrabold mb-3">{PRO_MONTHLY_PRICE_EUR}€ / mois</p>
          <ul className="text-sm opacity-75 space-y-1.5 mb-5">
            <li>✔️ Histoires illimitées</li>
            <li>✔️ 🔊 Narration audio incluse</li>
            <li>✔️ Profils enfants illimités</li>
            <li>✔️ Historique complet des histoires</li>
            <li>✔️ Annulation en un clic</li>
          </ul>
          {premium ? (
            <p className="text-sm text-green-700 font-medium">✔️ Abonnement actif</p>
          ) : (
            <SubscribeButton />
          )}
        </div>
      </div>

      {user.stripeCustomerId && (
        <div>
          <ManageBillingButton />
        </div>
      )}
    </div>
  );
}
