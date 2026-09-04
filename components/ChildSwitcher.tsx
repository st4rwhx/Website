import Link from "next/link";
import { prisma } from "@/lib/prisma";

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase();
}

const AVATAR_COLORS = ["#f6743a", "#7c6ce8", "#2ba876", "#d64a8a", "#3b82c4"];

export default async function ChildSwitcher({ userId }: { userId: string }) {
  const children = await prisma.child.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  if (children.length === 0) return null;

  return (
    <div className="pb-2 mb-2 border-b border-black/10">
      <p className="px-3 text-xs font-semibold uppercase tracking-wide opacity-50 mb-2">Créer pour</p>
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
        {children.map((c, i) => (
          <Link
            key={c.id}
            href={`/dashboard/histoires/nouvelle?enfant=${c.id}`}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-black/5 shrink-0"
            title={`Nouvelle histoire pour ${c.name}`}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            >
              {initials(c.name)}
            </span>
            <span className="text-sm font-medium whitespace-nowrap md:whitespace-normal">{c.name}</span>
          </Link>
        ))}
        <Link
          href="/dashboard/enfants/nouveau"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-black/5 shrink-0 opacity-60"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-black/30 text-xs shrink-0">
            +
          </span>
          <span className="text-sm font-medium whitespace-nowrap md:whitespace-normal">Ajouter</span>
        </Link>
      </div>
    </div>
  );
}
