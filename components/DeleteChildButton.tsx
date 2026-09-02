"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteChildButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer le profil de ${name} et toutes ses histoires ?`)) return;
    setLoading(true);
    await fetch(`/api/children/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
