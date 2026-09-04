import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStoryPdf } from "@/lib/pdf";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const story = await prisma.story.findUnique({ where: { id }, include: { child: true } });
  if (!story || story.userId !== session.user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const pdf = await generateStoryPdf({
    title: story.title,
    content: story.content,
    childName: story.child.name,
    theme: story.theme,
    createdAt: story.createdAt,
  });

  const fileName = `${story.title.replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 60) || "histoire"}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
