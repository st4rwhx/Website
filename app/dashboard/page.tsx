import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [children, stories] = await Promise.all([
    prisma.child.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.story.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { child: true },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Bienvenue {session!.user.name ?? ""} 👋</h1>
        <p className="opacity-60">
          {children.length === 0
            ? "Commencez par ajouter le profil de votre enfant."
            : "Prêt·e pour l'histoire du soir ?"}
        </p>
      </div>

      {children.length === 0 ? (
        <Link
          href="/dashboard/enfants/nouveau"
          className="block rounded-2xl border-2 border-dashed border-black/15 p-8 text-center hover:border-[var(--primary)] transition"
        >
          <p className="text-3xl mb-2">🧒</p>
          <p className="font-semibold">Ajouter le profil de mon enfant</p>
          <p className="text-sm opacity-60 mt-1">2 minutes suffisent</p>
        </Link>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/histoires/nouvelle"
            className="rounded-2xl bg-[var(--primary)] text-white p-6 hover:bg-[var(--primary-dark)] transition"
          >
            <p className="text-2xl mb-1">✨</p>
            <p className="font-semibold">Créer une nouvelle histoire</p>
          </Link>
          <Link
            href="/dashboard/enfants"
            className="rounded-2xl border border-black/10 p-6 hover:bg-black/5 transition"
          >
            <p className="text-2xl mb-1">🧒</p>
            <p className="font-semibold">Gérer les profils enfants ({children.length})</p>
          </Link>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Dernières histoires</h2>
          {stories.length > 0 && (
            <Link href="/dashboard/histoires" className="text-sm text-[var(--primary)] font-medium">
              Voir tout
            </Link>
          )}
        </div>

        {stories.length === 0 ? (
          <p className="text-sm opacity-60">Aucune histoire créée pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {stories.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/histoires/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 hover:bg-black/5"
                >
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs opacity-60">
                      Pour {s.child.name} · {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-sm opacity-40">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
