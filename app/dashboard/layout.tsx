import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canGenerateStory, isPremium } from "@/lib/subscription";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/connexion");

  const premium = isPremium(user);
  const access = await canGenerateStory(user);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      {!premium && (
        <div className={`text-center text-sm py-2 px-4 ${access.allowed ? "bg-[var(--accent)]/10" : "bg-red-50 text-red-700"}`}>
          {access.allowed ? (
            <>
              🎁 Palier gratuit : <strong>{access.remainingFree} histoire{access.remainingFree === 1 ? "" : "s"}</strong> disponible aujourd&apos;hui.{" "}
              <Link href="/dashboard/abonnement" className="underline font-medium">
                Passer au Pro pour un accès illimité + audio
              </Link>
            </>
          ) : (
            <>
              Vous avez utilisé votre histoire gratuite du jour, revenez demain.{" "}
              <Link href="/dashboard/abonnement" className="underline font-medium">
                Ou activez l&apos;abonnement Pro
              </Link>{" "}
              pour des histoires illimitées dès maintenant.
            </>
          )}
        </div>
      )}
      {premium && user.subscriptionStatus === "past_due" && (
        <div className="bg-red-50 text-red-700 text-center text-sm py-2 px-4">
          Un problème est survenu avec votre dernier paiement.{" "}
          <Link href="/dashboard/abonnement" className="underline font-medium">
            Mettre à jour mon moyen de paiement
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 flex-1 grid md:grid-cols-[200px_1fr] gap-8">
        <aside className="space-y-1 text-sm">
          <SidebarLink href="/dashboard" label="Vue d'ensemble" />
          <SidebarLink href="/dashboard/enfants" label="Mes enfants" />
          <SidebarLink href="/dashboard/histoires" label="Mes histoires" />
          <SidebarLink href="/dashboard/histoires/nouvelle" label="Nouvelle histoire" />
          <SidebarLink href="/dashboard/abonnement" label="Abonnement" />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 hover:bg-black/5 font-medium"
    >
      {label}
    </Link>
  );
}
