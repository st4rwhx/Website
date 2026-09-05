import { describe, it, expect } from "vitest";
import { FREE_DAILY_STORIES, PRO_MONTHLY_PRICE_EUR } from "@/lib/pricing";

describe("pricing", () => {
  it("le quota gratuit quotidien est positif", () => {
    expect(FREE_DAILY_STORIES).toBeGreaterThan(0);
  });

  it("le prix Pro mensuel est positif et cohérent avec le marché (< 20€)", () => {
    expect(PRO_MONTHLY_PRICE_EUR).toBeGreaterThan(0);
    expect(PRO_MONTHLY_PRICE_EUR).toBeLessThan(20);
  });
});
