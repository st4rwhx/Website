"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [error, setError] = useState<string | null>(token ? null : "Lien invalide.");

  useEffect(() => {
    if (!token) return;

    fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus("error");
          setError(data.error ?? "Une erreur est survenue.");
          return;
        }
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
        setError("Une erreur est survenue.");
      });
  }, [token]);

  if (status === "loading") {
    return <p className="opacity-60">Vérification en cours...</p>;
  }

  if (status === "error") {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <p className="text-sm rounded-lg bg-green-50 text-green-700 px-3 py-3">
      ✔️ Votre adresse email est confirmée !
    </p>
  );
}

export default function VerifierEmailPage() {
  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold mb-8">Confirmation d&apos;email</h1>
        <Suspense fallback={<p className="opacity-60">Chargement...</p>}>
          <VerifyContent />
        </Suspense>
        <p className="text-sm opacity-60 mt-6 text-center">
          <Link href="/dashboard" className="text-[var(--primary)] font-medium">
            Aller à mon espace
          </Link>
        </p>
      </div>
    </div>
  );
}
