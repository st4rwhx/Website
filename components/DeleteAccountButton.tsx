"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (!res.ok) {
      alert("Une erreur est survenue, réessayez.");
      setLoading(false);
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-600 hover:underline"
      >
        Supprimer définitivement mon compte
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
      <p className="text-sm text-red-700">
        Cette action est <strong>irréversible</strong>. Tous vos profils enfants, vos histoires et vos
        fichiers audio seront supprimés définitivement. Confirmez-vous ?
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Suppression..." : "Oui, tout supprimer"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
