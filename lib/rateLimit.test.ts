import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  it("autorise les requêtes jusqu'à la limite", () => {
    const key = `test-${Math.random()}`;
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
  });

  it("bloque une fois la limite atteinte", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
  });

  it("des clés différentes ont des compteurs indépendants", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    checkRateLimit(keyA, 1, 60_000);
    expect(checkRateLimit(keyA, 1, 60_000)).toBe(false);
    expect(checkRateLimit(keyB, 1, 60_000)).toBe(true);
  });

  it("réinitialise le compteur une fois la fenêtre expirée", async () => {
    const key = `test-window-${Math.random()}`;
    expect(checkRateLimit(key, 1, 30)).toBe(true);
    expect(checkRateLimit(key, 1, 30)).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(checkRateLimit(key, 1, 30)).toBe(true);
  });
});

describe("getClientIp", () => {
  it("extrait l'IP depuis x-forwarded-for (objet Headers)", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("extrait l'IP depuis x-forwarded-for (objet simple)", () => {
    expect(getClientIp({ "x-forwarded-for": "9.9.9.9" })).toBe("9.9.9.9");
  });

  it("retombe sur x-real-ip si x-forwarded-for est absent", () => {
    expect(getClientIp({ "x-real-ip": "10.0.0.1" })).toBe("10.0.0.1");
  });

  it("renvoie 'unknown' si aucun en-tête n'est présent", () => {
    expect(getClientIp({})).toBe("unknown");
  });
});
