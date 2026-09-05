import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FREE_DAILY_STORIES } from "@/lib/pricing";

export { FREE_DAILY_STORIES } from "@/lib/pricing";

/** Un abonnement Pro payant et à jour (accès illimité + narration audio). */
export function isPremium(user: Pick<User, "subscriptionStatus" | "currentPeriodEnd">) {
  const now = new Date();

  if (user.subscriptionStatus === "active") return true;

  if (user.subscriptionStatus === "past_due") {
    // On laisse un peu de marge le temps que le paiement soit régularisé.
    return !user.currentPeriodEnd || user.currentPeriodEnd > now;
  }

  return false;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Nombre d'histoires déjà générées aujourd'hui par un utilisateur au palier gratuit. */
export async function storiesGeneratedToday(userId: string) {
  return prisma.story.count({
    where: { userId, createdAt: { gte: startOfToday() } },
  });
}

/** Calcule le nombre d'histoires gratuites restantes à partir de celles déjà générées aujourd'hui. */
export function computeRemainingFree(usedToday: number) {
  return Math.max(0, FREE_DAILY_STORIES - usedToday);
}

/** Détermine si l'utilisateur peut générer une nouvelle histoire maintenant. */
export async function canGenerateStory(user: Pick<User, "id" | "subscriptionStatus" | "currentPeriodEnd">) {
  if (isPremium(user)) {
    return { allowed: true, remainingFree: null as number | null };
  }

  const usedToday = await storiesGeneratedToday(user.id);
  const remainingFree = computeRemainingFree(usedToday);
  return { allowed: remainingFree > 0, remainingFree };
}
