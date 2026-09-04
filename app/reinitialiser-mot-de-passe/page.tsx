"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/connexion"), 2000);
  }

  if (!token) {
    return <p className="text-sm text-red-600">Lien invalide. Demandez un nouveau lien de réinitialisation.</p>;
  }

  if (done) {
    return (
      <p className="text-sm rounded-lg bg-green-50 text-green-700 px-3 py-3">
        Mot de passe mis à jour ! Redirection vers la connexion...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--primary)] text-white px-5 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Mise à jour..." : "Choisir ce mot de passe"}
      </button>
    </form>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold mb-8">Choisir un nouveau mot de passe</h1>
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
        <p className="text-sm opacity-60 mt-6 text-center">
          <Link href="/connexion" className="text-[var(--primary)] font-medium">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
