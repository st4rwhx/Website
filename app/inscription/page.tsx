"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, acceptedTerms }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/connexion");
        return;
      }

      router.push("/dashboard/enfants/nouveau");
      router.refresh();
    } catch {
      setError("Une erreur est survenue, réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold mb-1">Créer votre compte</h1>
        <p className="text-sm opacity-60 mb-8">
1 histoire gratuite chaque jour, sans limite de durée ni carte bancaire.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Votre prénom</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              placeholder="Camille"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              placeholder="8 caractères minimum"
            />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              required
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5"
            />
            <span className="opacity-70">
              J&apos;accepte les{" "}
              <Link href="/cgu" target="_blank" className="text-[var(--primary)] underline">
                conditions générales
              </Link>{" "}
              et la{" "}
              <Link href="/confidentialite" target="_blank" className="text-[var(--primary)] underline">
                politique de confidentialité
              </Link>
              . Je certifie être majeur et créer ce compte en tant que parent ou représentant légal.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="w-full rounded-full bg-[var(--primary)] text-white px-5 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {loading ? "Création du compte..." : "Commencer gratuitement"}
          </button>
        </form>

        <p className="text-sm opacity-60 mt-6 text-center">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-[var(--primary)] font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
