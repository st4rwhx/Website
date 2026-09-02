import type { User } from "@prisma/client";

export function hasAccess(user: Pick<User, "subscriptionStatus" | "trialEndsAt" | "currentPeriodEnd">) {
  const now = new Date();

  if (user.subscriptionStatus === "trialing") {
    return !user.trialEndsAt || user.trialEndsAt > now;
  }

  if (user.subscriptionStatus === "active") {
    return true;
  }

  if (user.subscriptionStatus === "past_due") {
    // On laisse un peu de marge le temps que le paiement soit régularisé.
    return !user.currentPeriodEnd || user.currentPeriodEnd > now;
  }

  return false;
}

export function trialDaysLeft(trialEndsAt: Date | null) {
  if (!trialEndsAt) return 0;
  const diff = trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
