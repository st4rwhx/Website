import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { hashToken } from "@/lib/tokens";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`password-reset-confirm:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Requête invalide (mot de passe : 8 caractères minimum)." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(parsed.data.token);
  const user = await prisma.user.findUnique({ where: { passwordResetTokenHash: tokenHash } });

  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return NextResponse.json(
      { error: "Ce lien de réinitialisation est invalide ou a expiré." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetTokenHash: null, passwordResetExpires: null },
  });

  return NextResponse.json({ ok: true });
}
