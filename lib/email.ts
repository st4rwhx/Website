/**
 * Envoi d'e-mail transactionnel via Resend si RESEND_API_KEY est configurée ;
 * sinon, log en console (mode développement / démo, aucun envoi réel).
 */
export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Câlin d'Histoires <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[email:dev] À: ${to} — Sujet: ${subject}\n${html}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("Erreur d'envoi d'e-mail (Resend) :", res.status, await res.text().catch(() => ""));
  }
}
