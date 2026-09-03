"use client";

import { useState } from "react";
import { PRO_MONTHLY_PRICE_EUR } from "@/lib/pricing";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-full bg-[var(--primary)] text-white px-6 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
    >
      {loading ? "Redirection..." : `Activer l'abonnement Pro — ${PRO_MONTHLY_PRICE_EUR}€/mois`}
    </button>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-full border border-black/15 px-6 py-2.5 font-semibold hover:bg-black/5 disabled:opacity-50"
    >
      {loading ? "Redirection..." : "Gérer mon abonnement / ma facturation"}
    </button>
  );
}
