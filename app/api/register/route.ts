import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { TRIAL_DAYS } from "@/lib/stripe";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
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
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      subscriptionStatus: "trialing",
      trialEndsAt,
    },
  });

  return NextResponse.json({ ok: true });
}
