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
  safeMode: z.boolean().default(true),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const children = await prisma.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ children });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = childSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informations invalides." }, { status: 400 });
  }

  const child = await prisma.child.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json({ child });
}
