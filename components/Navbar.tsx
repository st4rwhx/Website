"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  return (
    <header className="border-b border-black/10 bg-[var(--background)]/90 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🌙</span>
          <span>Câlin d&apos;Histoires</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
          <Link href="/#tarifs" className="hidden sm:inline hover:text-[var(--primary)]">
            Tarifs
          </Link>
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="hover:text-[var(--primary)]">
                Mon espace
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-black/15 px-4 py-1.5 hover:bg-black/5"
              >
                Déconnexion
              </button>
            </>
          ) : status === "loading" ? (
            <span className="opacity-0">.</span>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-[var(--primary)]">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-[var(--primary)] text-white px-4 py-1.5 hover:bg-[var(--primary-dark)] transition"
              >
                Essai gratuit
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
