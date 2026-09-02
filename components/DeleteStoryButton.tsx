"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteStoryButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer cette histoire ?")) return;
    setLoading(true);
    await fetch(`/api/stories/${id}`, { method: "DELETE" });
    router.push("/dashboard/histoires");
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
