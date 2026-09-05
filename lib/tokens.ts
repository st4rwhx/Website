import { randomBytes, createHash } from "crypto";

/** Génère un jeton à usage unique (valeur brute à envoyer par email + son hash à stocker en base). */
export function generateToken() {
  const raw = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}
