"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur non gérée :", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="text-6xl mb-4">😵</p>
      <h1 className="text-2xl font-bold mb-2">Une erreur est survenue</h1>
      <p className="opacity-60 mb-8 max-w-sm">
        Quelque chose s&apos;est mal passé de notre côté. Réessayez, ou revenez plus tard si le problème
        persiste.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[var(--primary)] text-white px-6 py-2.5 font-semibold hover:bg-[var(--primary-dark)]"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-full border border-black/15 px-6 py-2.5 font-semibold hover:bg-black/5"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
