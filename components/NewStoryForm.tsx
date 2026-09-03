"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNIVERSES } from "@/lib/universes";

type Child = { id: string; name: string };

export default function NewStoryForm({
  kids,
  defaultChildId,
  canGenerate,
  premium,
}: {
  kids: Child[];
  defaultChildId?: string;
  canGenerate: boolean;
  premium: boolean;
}) {
  const router = useRouter();
  const [childId, setChildId] = useState(defaultChildId ?? kids[0]?.id ?? "");
  const [theme, setTheme] = useState("");
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [moral, setMoral] = useState("");
  const [length, setLength] = useState<"courte" | "moyenne" | "longue">("moyenne");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, theme, moral, length }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/histoires/${data.story.id}`);
    router.refresh();
  }

  if (kids.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-black/15 p-8 text-center">
        <p className="mb-3 opacity-70">Ajoutez d&apos;abord le profil de votre enfant.</p>
        <Link
          href="/dashboard/enfants/nouveau"
          className="inline-block rounded-full bg-[var(--primary)] text-white px-5 py-2 font-semibold"
        >
          Ajouter un enfant
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Pour quel enfant ?</label>
        <select
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        >
          {kids.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Choisissez un univers *</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {UNIVERSES.map((u) => (
            <button
              type="button"
              key={u.id}
              onClick={() => {
                setSelectedUniverse(u.id);
                setTheme(u.theme);
              }}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                selectedUniverse === u.id
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-black/10 hover:bg-black/5"
              }`}
            >
              <span className="text-xl">{u.emoji}</span>
              <span className="text-xs font-medium leading-tight">{u.label}</span>
            </button>
          ))}
        </div>

        <p className="text-sm font-medium mt-4 mb-1">
          Ou décrivez votre propre idée {selectedUniverse ? "(remplace l'univers choisi)" : ""}
        </p>
        <input
          required
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            setSelectedUniverse(null);
          }}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          placeholder="Ex : un dragon gentil qui a peur de voler..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Une leçon ou morale à glisser (optionnel)</label>
        <input
          value={moral}
          onChange={(e) => setMoral(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          placeholder="Ex : il ne faut pas avoir peur de demander de l'aide"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Longueur</label>
        <div className="flex gap-2">
          {(["courte", "moyenne", "longue"] as const).map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setLength(l)}
              className={`rounded-full px-4 py-1.5 text-sm border ${
                length === l
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-black/15 hover:bg-black/5"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {premium ? (
        <p className="text-sm rounded-lg bg-[var(--accent)]/10 px-3 py-2">
          🔊 La narration audio sera générée automatiquement avec votre histoire (abonnement Pro).
        </p>
      ) : (
        <p className="text-sm opacity-60">
          🔊 Narration audio réservée à l&apos;abonnement{" "}
          <Link href="/dashboard/abonnement" className="text-[var(--primary)] underline font-medium">
            Pro
          </Link>
          .
        </p>
      )}

      {!canGenerate && (
        <p className="text-sm rounded-lg bg-red-50 text-red-700 px-3 py-2">
          Vous avez utilisé votre histoire gratuite du jour.{" "}
          <Link href="/dashboard/abonnement" className="underline font-medium">
            Activez l&apos;abonnement Pro
          </Link>{" "}
          pour générer des histoires illimitées, dès maintenant.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !canGenerate}
        className="rounded-full bg-[var(--primary)] text-white px-6 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "L'IA écrit l'histoire..." : "Générer l'histoire ✨"}
      </button>
    </form>
  );
}
