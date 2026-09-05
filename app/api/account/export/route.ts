import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      children: true,
      stories: { select: { id: true, theme: true, moral: true, length: true, title: true, content: true, createdAt: true, childId: true, audioPath: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    compte: {
      email: user.email,
      nom: user.name,
      creeLe: user.createdAt,
      abonnement: user.subscriptionStatus,
      conditionsAccepteesLe: user.termsAcceptedAt,
      emailConfirmeLe: user.emailVerifiedAt,
    },
    enfants: user.children.map((c) => ({
      id: c.id,
      prenom: c.name,
      age: c.age,
      genre: c.gender,
      personnalite: c.personality,
      aime: c.likes,
      naimePas: c.dislikes,
      personnagesPreferes: c.favoriteCharacters,
      histoiresApaisees: c.safeMode,
      creeLe: c.createdAt,
    })),
    histoires: user.stories.map((s) => ({
      id: s.id,
      enfantId: s.childId,
      titre: s.title,
      theme: s.theme,
      morale: s.moral,
      longueur: s.length,
      contenu: s.content,
      narrationAudioDisponible: Boolean(s.audioPath),
      creeLe: s.createdAt,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mes-donnees-calin-histoires.json"`,
    },
  });
}
