import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteChildButton from "@/components/DeleteChildButton";

export default async function EnfantsPage() {
  const session = await getServerSession(authOptions);
  const children = await prisma.child.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes enfants</h1>
        <Link
          href="/dashboard/enfants/nouveau"
          className="rounded-full bg-[var(--primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--primary-dark)]"
        >
          + Ajouter un enfant
        </Link>
      </div>

      {children.length === 0 ? (
        <p className="opacity-60">Aucun profil pour le moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((c) => (
            <div key={c.id} className="rounded-2xl border border-black/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{c.name}</p>
                  <p className="text-sm opacity-60">{c.age} ans</p>
                </div>
                <div className="flex gap-3 items-center text-sm">
                  <Link href={`/dashboard/enfants/${c.id}`} className="text-[var(--primary)] hover:underline">
                    Modifier
                  </Link>
                  <DeleteChildButton id={c.id} name={c.name} />
                </div>
              </div>
              <p className="text-sm opacity-70 mt-3 line-clamp-3">{c.personality}</p>
              {c.safeMode && (
                <span className="inline-block mt-2 text-xs rounded-full bg-[var(--accent)]/10 px-2.5 py-1">
                  🕊️ Histoires apaisées
                </span>
              )}
              <Link
                href={`/dashboard/histoires/nouvelle?enfant=${c.id}`}
                className="inline-block mt-4 text-sm font-medium text-[var(--primary)]"
              >
                Créer une histoire pour {c.name} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
