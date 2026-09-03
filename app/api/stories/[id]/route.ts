import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteStoryAudio } from "@/lib/storage";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const story = await prisma.story.findUnique({ where: { id } });
  if (!story || story.userId !== session.user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await prisma.story.delete({ where: { id } });

  if (story.audioPath) {
    await deleteStoryAudio(story.audioPath);
  }

  return NextResponse.json({ ok: true });
}
