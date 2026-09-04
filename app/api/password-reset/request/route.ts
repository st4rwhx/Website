import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const schema = z.object({ email: z.string().email() });

const GENERIC_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`password-reset:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // On répond toujours pareil, que le compte existe ou non, pour ne pas
  // révéler quels emails sont inscrits.
  if (!user) {
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetTokenHash: tokenHash, passwordResetExpires: expires },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reinitialiser-mot-de-passe?token=${rawToken}`;

  await sendEmail(
    user.email,
    "Réinitialisez votre mot de passe — Câlin d'Histoires",
    `<p>Bonjour${user.name ? ` ${user.name}` : ""},</p>
     <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable 1 heure :</p>
     <p><a href="${resetUrl}">${resetUrl}</a></p>
     <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>`,
  );

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
