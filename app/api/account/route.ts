import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteStoryAudio } from "@/lib/storage";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const stories = await prisma.story.findMany({
    where: { userId: session.user.id, audioPath: { not: null } },
    select: { audioPath: true },
  });

  await Promise.all(
    stories.map((s) => (s.audioPath ? deleteStoryAudio(s.audioPath) : Promise.resolve())),
  );

  // Les profils enfants et histoires sont supprimés en cascade (onDelete: Cascade).
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ ok: true });
}
