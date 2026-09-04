import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-6xl mb-4">🧭</p>
        <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
        <p className="opacity-60 mb-8 max-w-sm">
          Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour continuer.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[var(--primary)] text-white px-6 py-2.5 font-semibold hover:bg-[var(--primary-dark)]"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
