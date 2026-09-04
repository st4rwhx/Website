"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));

    setLoading(false);
    setMessage(
      data.message ?? "Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.",
    );
  }

  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold mb-1">Mot de passe oublié</h1>
        <p className="text-sm opacity-60 mb-8">
          Indiquez votre email, nous vous envoyons un lien pour choisir un nouveau mot de passe.
        </p>

        {message ? (
          <p className="text-sm rounded-lg bg-[var(--accent)]/10 px-3 py-3">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--primary)] text-white px-5 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="text-sm opacity-60 mt-6 text-center">
          <Link href="/connexion" className="text-[var(--primary)] font-medium">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
