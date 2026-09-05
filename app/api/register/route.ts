import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { generateToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  acceptedTerms: z.literal(true, {
    error: "Vous devez accepter les conditions générales et la politique de confidentialité.",
  }),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Merci de vérifier les informations saisies (mot de passe : 8 caractères minimum)." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const { raw: verificationToken, hash: verificationTokenHash } = generateToken();

  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      termsAcceptedAt: new Date(),
      emailVerificationTokenHash: verificationTokenHash,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      // subscriptionStatus démarre à "free" (valeur par défaut du schéma) :
      // 1 histoire gratuite par jour, sans limite de durée.
    },
  });

  // Best-effort : un échec d'envoi d'email ne doit jamais bloquer l'inscription.
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    await sendEmail(
      email,
      "Confirmez votre adresse email — Câlin d'Histoires",
      `<p>Bonjour ${parsed.data.name},</p>
       <p>Bienvenue ! Confirmez votre adresse email en cliquant sur ce lien (valable 24h) :</p>
       <p><a href="${appUrl}/verifier-email?token=${verificationToken}">${appUrl}/verifier-email?token=${verificationToken}</a></p>`,
    );
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email de vérification :", err);
  }

  return NextResponse.json({ ok: true });
}
