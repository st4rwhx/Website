import ChildForm from "@/components/ChildForm";

export default function NouvelEnfantPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Profil de l&apos;enfant</h1>
      <p className="opacity-60 mb-6">
        Plus les informations sont précises, plus les histoires seront personnalisées.
      </p>
      <ChildForm />
    </div>
  );
}
