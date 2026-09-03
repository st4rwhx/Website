import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readStoryAudio } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const story = await prisma.story.findUnique({ where: { id } });
  if (!story || story.userId !== session.user.id || !story.audioPath) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  try {
    const audio = await readStoryAudio(story.audioPath);
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Erreur de lecture du fichier audio :", err);
    return NextResponse.json({ error: "Fichier audio introuvable." }, { status: 404 });
  }
}
