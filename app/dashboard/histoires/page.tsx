import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HistoiresPage() {
  const session = await getServerSession(authOptions);
  const stories = await prisma.story.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { child: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes histoires</h1>
        <Link
          href="/dashboard/histoires/nouvelle"
          className="rounded-full bg-[var(--primary)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--primary-dark)]"
        >
          + Nouvelle histoire
        </Link>
      </div>

      {stories.length === 0 ? (
        <p className="opacity-60">Aucune histoire créée pour le moment.</p>
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
                    Pour {s.child.name} · {s.theme} · {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-sm opacity-40">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
