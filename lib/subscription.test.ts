import { describe, it, expect } from "vitest";
import { isPremium, computeRemainingFree } from "@/lib/subscription";
import { FREE_DAILY_STORIES } from "@/lib/pricing";

describe("isPremium", () => {
  it("est premium si l'abonnement est actif", () => {
    expect(isPremium({ subscriptionStatus: "active", currentPeriodEnd: null })).toBe(true);
  });

  it("n'est pas premium au palier gratuit", () => {
    expect(isPremium({ subscriptionStatus: "free", currentPeriodEnd: null })).toBe(false);
  });

  it("n'est pas premium si annulé", () => {
    expect(isPremium({ subscriptionStatus: "canceled", currentPeriodEnd: null })).toBe(false);
  });

  it("reste premium en 'past_due' tant que la période de grâce n'est pas dépassée", () => {
    const future = new Date(Date.now() + 60_000);
    expect(isPremium({ subscriptionStatus: "past_due", currentPeriodEnd: future })).toBe(true);
  });

  it("n'est plus premium en 'past_due' une fois la période de grâce dépassée", () => {
    const past = new Date(Date.now() - 60_000);
    expect(isPremium({ subscriptionStatus: "past_due", currentPeriodEnd: past })).toBe(false);
  });

  it("reste premium en 'past_due' sans date de fin de période connue", () => {
    expect(isPremium({ subscriptionStatus: "past_due", currentPeriodEnd: null })).toBe(true);
  });
});

describe("computeRemainingFree", () => {
  it("renvoie le quota complet si rien n'a été généré aujourd'hui", () => {
    expect(computeRemainingFree(0)).toBe(FREE_DAILY_STORIES);
  });

  it("renvoie 0 une fois le quota du jour atteint", () => {
    expect(computeRemainingFree(FREE_DAILY_STORIES)).toBe(0);
  });

  it("ne descend jamais sous 0 même si le compteur dépasse le quota", () => {
    expect(computeRemainingFree(FREE_DAILY_STORIES + 10)).toBe(0);
  });
});
