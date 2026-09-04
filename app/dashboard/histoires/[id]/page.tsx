import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/subscription";
import DeleteStoryButton from "@/components/DeleteStoryButton";

export default async function HistoirePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const story = await prisma.story.findUnique({ where: { id }, include: { child: true } });
  if (!story || story.userId !== session.user.id) notFound();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const premium = user ? isPremium(user) : false;

  return (
    <article className="max-w-2xl">
      <Link href="/dashboard/histoires" className="text-sm text-[var(--primary)] font-medium">
        ← Toutes les histoires
      </Link>

      <div className="flex items-start justify-between mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{story.title}</h1>
          <p className="text-sm opacity-60 mt-1">
            Pour {story.child.name} · thème : {story.theme} ·{" "}
            {new Date(story.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`/api/stories/${story.id}/pdf`}
            className="text-sm text-[var(--primary)] font-medium hover:underline"
          >
            📄 Télécharger en PDF
          </a>
          <DeleteStoryButton id={story.id} />
        </div>
      </div>

      {story.audioPath ? (
        <audio controls preload="none" className="w-full mb-6">
          <source src={`/api/stories/${story.id}/audio`} type="audio/mpeg" />
        </audio>
      ) : premium ? (
        <p className="text-sm opacity-50 mb-6">
          🔊 La narration audio n&apos;a pas pu être générée pour cette histoire.
        </p>
      ) : (
        <p className="text-sm rounded-lg bg-[var(--accent)]/10 px-3 py-2 mb-6">
          🔊 Écoutez cette histoire en narration audio avec l&apos;abonnement{" "}
          <Link href="/dashboard/abonnement" className="text-[var(--primary)] underline font-medium">
            Pro
          </Link>
          .
        </p>
      )}

      <div className="prose prose-neutral max-w-none whitespace-pre-line leading-relaxed rounded-2xl bg-white border border-black/10 p-6 sm:p-8">
        {story.content}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href={`/dashboard/histoires/nouvelle?enfant=${story.childId}`}
          className="rounded-full bg-[var(--primary)] text-white px-5 py-2.5 font-semibold hover:bg-[var(--primary-dark)]"
        >
          Créer une nouvelle histoire pour {story.child.name}
        </Link>
      </div>
    </article>
  );
}
