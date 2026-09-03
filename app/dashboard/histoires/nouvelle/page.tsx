import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canGenerateStory, isPremium } from "@/lib/subscription";
import NewStoryForm from "@/components/NewStoryForm";

export default async function NouvelleHistoirePage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const { enfant } = await searchParams;
  const session = await getServerSession(authOptions);
  const [children, user] = await Promise.all([
    prisma.child.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.findUnique({ where: { id: session!.user.id } }),
  ]);

  const access = user ? await canGenerateStory(user) : { allowed: false, remainingFree: 0 };
  const premium = user ? isPremium(user) : false;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Nouvelle histoire</h1>
      <p className="opacity-60 mb-6">Choisissez un thème, l&apos;IA fait le reste en quelques secondes.</p>
      <NewStoryForm
        kids={children}
        defaultChildId={enfant}
        canGenerate={access.allowed}
        premium={premium}
      />
    </div>
  );
}
