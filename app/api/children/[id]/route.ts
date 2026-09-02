import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const childSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.coerce.number().int().min(0).max(17),
  gender: z.string().optional(),
  personality: z.string().min(1).max(1000),
  likes: z.string().min(1).max(1000),
  dislikes: z.string().max(1000).optional(),
  favoriteCharacters: z.string().max(500).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child || child.userId !== session.user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = childSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informations invalides." }, { status: 400 });
  }

  const updated = await prisma.child.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ child: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child || child.userId !== session.user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await prisma.child.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
