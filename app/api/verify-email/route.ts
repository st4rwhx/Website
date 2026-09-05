import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const user = await prisma.user.findUnique({ where: { emailVerificationTokenHash: tokenHash } });

  if (!user || !user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
    return NextResponse.json(
      { error: "Ce lien de vérification est invalide ou a expiré." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpires: null,
    },
  });

  return NextResponse.json({ ok: true });
}
