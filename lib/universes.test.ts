import { describe, it, expect } from "vitest";
import { UNIVERSES } from "@/lib/universes";

describe("UNIVERSES", () => {
  it("contient au moins 10 univers", () => {
    expect(UNIVERSES.length).toBeGreaterThanOrEqual(10);
  });

  it("a des identifiants uniques", () => {
    const ids = UNIVERSES.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque univers a un emoji, un label et un thème non vides", () => {
    for (const u of UNIVERSES) {
      expect(u.emoji.length).toBeGreaterThan(0);
      expect(u.label.trim().length).toBeGreaterThan(0);
      expect(u.theme.trim().length).toBeGreaterThan(0);
    }
  });
});
