import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canGenerateStory, isPremium } from "@/lib/subscription";
import { generateStory } from "@/lib/anthropic";
import { generateNarration } from "@/lib/tts";
import { saveStoryAudio } from "@/lib/storage";

const storySchema = z.object({
  childId: z.string().min(1),
  theme: z.string().min(1).max(300),
  moral: z.string().max(300).optional(),
  length: z.enum(["courte", "moyenne", "longue"]).default("moyenne"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const stories = await prisma.story.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { child: true },
  });

  return NextResponse.json({ stories });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const access = await canGenerateStory(user);
  if (!access.allowed) {
    return NextResponse.json(
      {
        error:
          "Vous avez utilisé votre histoire gratuite du jour. Revenez demain, ou passez à l'abonnement Pro pour des histoires illimitées.",
      },
      { status: 402 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = storySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informations invalides." }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: parsed.data.childId } });
  if (!child || child.userId !== session.user.id) {
    return NextResponse.json({ error: "Enfant introuvable." }, { status: 404 });
  }

  let generated: { title: string; content: string };
  try {
    generated = await generateStory(
      {
        name: child.name,
        age: child.age,
        gender: child.gender,
        personality: child.personality,
        likes: child.likes,
        dislikes: child.dislikes,
        favoriteCharacters: child.favoriteCharacters,
        safeMode: child.safeMode,
      },
      {
        theme: parsed.data.theme,
        moral: parsed.data.moral,
        length: parsed.data.length,
      },
    );
  } catch (err) {
    console.error("Erreur de génération d'histoire :", err);
    return NextResponse.json(
      { error: "La génération de l'histoire a échoué. Réessayez dans un instant." },
      { status: 502 },
    );
  }

  const story = await prisma.story.create({
    data: {
      userId: session.user.id,
      childId: child.id,
      theme: parsed.data.theme,
      moral: parsed.data.moral,
      length: parsed.data.length,
      title: generated.title,
      content: generated.content,
    },
  });

  // Narration audio : fonctionnalité Pro, générée en best-effort (ne bloque jamais la création de l'histoire).
  if (isPremium(user)) {
    try {
      const audio = await generateNarration(generated.content);
      if (audio) {
        const audioPath = await saveStoryAudio(story.id, audio);
        await prisma.story.update({ where: { id: story.id }, data: { audioPath } });
        story.audioPath = audioPath;
      }
    } catch (err) {
      console.error("Erreur lors de la génération de la narration audio :", err);
    }
  }

  return NextResponse.json({ story });
}
