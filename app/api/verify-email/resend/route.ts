import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  if (!checkRateLimit(`verify-email-resend:${session.user.id}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const { raw, hash } = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationTokenHash: hash, emailVerificationExpires: expires },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${appUrl}/verifier-email?token=${raw}`;

  await sendEmail(
    user.email,
    "Confirmez votre adresse email — Câlin d'Histoires",
    `<p>Bonjour${user.name ? ` ${user.name}` : ""},</p>
     <p>Confirmez votre adresse email en cliquant sur ce lien (valable 24h) :</p>
     <p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  );

  return NextResponse.json({ ok: true });
}
