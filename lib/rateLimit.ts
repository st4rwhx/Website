/**
 * Rate limiting en mémoire, à fenêtre fixe. Suffisant pour une instance
 * unique (MVP) ; pour un déploiement multi-instance, remplacer par un
 * store partagé (Redis, Upstash...).
 */
const hits = new Map<string, { count: number; resetAt: number }>();

// Purge périodique pour éviter une fuite mémoire sur les clés expirées.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (entry.resetAt < now) hits.delete(key);
  }
}, 10 * 60 * 1000).unref?.();

/**
 * Renvoie `true` si la requête est autorisée, `false` si la limite est atteinte.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** Extrait une adresse IP raisonnable des en-têtes d'une requête (proxy compris). */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (name: string) =>
    headers instanceof Headers ? headers.get(name) : headers[name];

  const forwarded = get("x-forwarded-for");
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (forwardedIp) return forwardedIp.split(",")[0].trim();

  const real = get("x-real-ip");
  const realIp = Array.isArray(real) ? real[0] : real;
  if (realIp) return realIp;

  return "unknown";
}
