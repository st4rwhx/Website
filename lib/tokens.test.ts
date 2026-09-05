import { describe, it, expect } from "vitest";
import { generateToken, hashToken } from "@/lib/tokens";

describe("tokens", () => {
  it("le hash du jeton généré correspond au hash stocké", () => {
    const { raw, hash } = generateToken();
    expect(hashToken(raw)).toBe(hash);
  });

  it("génère un jeton différent à chaque appel", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hash).not.toBe(b.hash);
  });

  it("hashToken est déterministe", () => {
    expect(hashToken("valeur-fixe")).toBe(hashToken("valeur-fixe"));
  });

  it("un jeton falsifié ne produit pas le même hash", () => {
    const { raw, hash } = generateToken();
    expect(hashToken(raw + "x")).not.toBe(hash);
  });
});
