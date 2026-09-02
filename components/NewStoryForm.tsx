"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Child = { id: string; name: string };

const THEME_SUGGESTIONS = [
  "L'heure du coucher",
  "Le partage avec les autres",
  "La rentrée des classes",
  "Un anniversaire surprise",
  "Un voyage magique",
  "Apprivoiser la peur du noir",
  "Une nouvelle petite sœur ou un petit frère",
  "L'amitié",
];

export default function NewStoryForm({
  kids,
  defaultChildId,
  canGenerate,
}: {
  kids: Child[];
  defaultChildId?: string;
  canGenerate: boolean;
}) {
  const router = useRouter();
  const [childId, setChildId] = useState(defaultChildId ?? kids[0]?.id ?? "");
  const [theme, setTheme] = useState("");
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
        <label className="block text-sm font-medium mb-1">Thème de l&apos;histoire *</label>
        <input
          required
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          placeholder="Ex : la peur du noir, un anniversaire, un dragon gentil..."
          list="theme-suggestions"
        />
        <datalist id="theme-suggestions">
          {THEME_SUGGESTIONS.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <div className="flex flex-wrap gap-2 mt-2">
          {THEME_SUGGESTIONS.slice(0, 4).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTheme(t)}
              className="text-xs rounded-full border border-black/15 px-3 py-1 hover:bg-black/5"
            >
              {t}
            </button>
          ))}
        </div>
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

      {!canGenerate && (
        <p className="text-sm rounded-lg bg-red-50 text-red-700 px-3 py-2">
          Votre accès est terminé.{" "}
          <Link href="/dashboard/abonnement" className="underline font-medium">
            Activez l&apos;abonnement Pro
          </Link>{" "}
          pour générer de nouvelles histoires.
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
