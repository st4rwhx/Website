"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ChildFormValues = {
  name: string;
  age: number | string;
  gender: string;
  personality: string;
  likes: string;
  dislikes: string;
  favoriteCharacters: string;
  safeMode: boolean;
};

const emptyValues: ChildFormValues = {
  name: "",
  age: "",
  gender: "",
  personality: "",
  likes: "",
  dislikes: "",
  favoriteCharacters: "",
  safeMode: true,
};

export default function ChildForm({
  childId,
  initialValues,
}: {
  childId?: string;
  initialValues?: ChildFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ChildFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof ChildFormValues>(key: K, value: ChildFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(childId ? `/api/children/${childId}` : "/api/children", {
      method: childId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/enfants");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom *</label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="Léo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Âge *</label>
          <input
            required
            type="number"
            min={0}
            max={17}
            value={values.age}
            onChange={(e) => set("age", e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genre (optionnel)</label>
        <select
          value={values.gender}
          onChange={(e) => set("gender", e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        >
          <option value="">Préférer ne pas préciser</option>
          <option value="fille">Fille</option>
          <option value="garcon">Garçon</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Personnalité / caractère *</label>
        <textarea
          required
          value={values.personality}
          onChange={(e) => set("personality", e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          rows={3}
          placeholder="Curieux, très rêveur, un peu timide avec les inconnus, adore poser des questions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ce qu&apos;il/elle aime *</label>
        <textarea
          required
          value={values.likes}
          onChange={(e) => set("likes", e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          rows={3}
          placeholder="Les dinosaures, dessiner, jouer avec son chien, la couleur violette..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ce qu&apos;il/elle n&apos;aime pas ou craint</label>
        <textarea
          value={values.dislikes}
          onChange={(e) => set("dislikes", e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          rows={2}
          placeholder="Le noir, les araignées, se séparer de son doudou..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Personnages / héros préférés</label>
        <input
          value={values.favoriteCharacters}
          onChange={(e) => set("favoriteCharacters", e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2"
          placeholder="La Reine des Neiges, Spiderman, Pat'Patrouille..."
        />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-black/10 px-3 py-3 cursor-pointer">
        <input
          type="checkbox"
          checked={values.safeMode}
          onChange={(e) => set("safeMode", e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm">
          <span className="font-medium">Histoires apaisées (recommandé)</span>
          <br />
          <span className="opacity-60">
            Aucune frayeur, aucun méchant menaçant ni situation de danger : les histoires restent douces du
            début à la fin. Désactivez pour autoriser un peu de suspense léger.
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[var(--primary)] text-white px-6 py-2.5 font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : childId ? "Enregistrer les modifications" : "Créer le profil"}
      </button>
    </form>
  );
}
