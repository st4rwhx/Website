import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChildForm from "@/components/ChildForm";

export default async function ModifierEnfantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child || child.userId !== session.user.id) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Modifier le profil de {child.name}</h1>
      <p className="opacity-60 mb-6">Mettez à jour les informations pour affiner les prochaines histoires.</p>
      <ChildForm
        childId={child.id}
        initialValues={{
          name: child.name,
          age: child.age,
          gender: child.gender ?? "",
          personality: child.personality,
          likes: child.likes,
          dislikes: child.dislikes ?? "",
          favoriteCharacters: child.favoriteCharacters ?? "",
        }}
      />
    </div>
  );
}
