import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export default async function ComptePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mon compte</h1>
        <p className="opacity-60">Gérez vos informations et vos données personnelles.</p>
      </div>

      <div className="rounded-2xl border border-black/10 p-6 space-y-2 text-sm">
        <p>
          <span className="opacity-60">Nom :</span> {user.name ?? "—"}
        </p>
        <p>
          <span className="opacity-60">Email :</span> {user.email}
        </p>
        <p>
          <span className="opacity-60">Membre depuis :</span>{" "}
          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 p-6 space-y-3">
        <h2 className="font-semibold">Mes données</h2>
        <p className="text-sm opacity-60">
          Conformément au RGPD, vous pouvez à tout moment télécharger l&apos;ensemble de vos données
          (profils enfants, histoires) au format JSON.
        </p>
        <a
          href="/api/account/export"
          className="inline-block rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black/5"
        >
          📥 Télécharger mes données
        </a>
      </div>

      <div className="rounded-2xl border border-black/10 p-6 space-y-3">
        <h2 className="font-semibold">Zone de danger</h2>
        <p className="text-sm opacity-60">
          La suppression de votre compte efface définitivement vos profils enfants, vos histoires et vos
          fichiers audio. Cette action ne peut pas être annulée.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
