import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Conditions générales d'utilisation — Câlin d'Histoires",
};

export default function CGUPage() {
  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 prose prose-neutral">
        <h1>Conditions générales d&apos;utilisation</h1>
        <p className="text-sm opacity-60">Dernière mise à jour : à compléter avant mise en ligne.</p>

        <p>
          <strong>
            Ce document est un modèle de base à faire relire par un professionnel du droit avant toute mise en
            ligne.
          </strong>
        </p>

        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent l&apos;utilisation de l&apos;application « Câlin d&apos;Histoires »,
          service de génération d&apos;histoires personnalisées pour enfants par intelligence artificielle,
          éditée par [raison sociale à compléter].
        </p>

        <h2>2. Qui peut créer un compte ?</h2>
        <p>
          Le service est réservé aux personnes majeures agissant en tant que parent ou représentant légal d&apos;un
          enfant. Les profils enfants sont créés et gérés exclusivement par le titulaire du compte ; l&apos;enfant
          n&apos;a pas d&apos;accès direct à la création ou la modification de son profil.
        </p>

        <h2>3. Abonnement et paiement</h2>
        <ul>
          <li>Un palier gratuit permet de générer une histoire par jour, sans limite de durée ni carte bancaire.</li>
          <li>
            L&apos;abonnement Pro est un abonnement mensuel sans engagement, facturé via Stripe, résiliable à tout
            moment depuis l&apos;espace « Abonnement » (effet à la fin de la période déjà payée).
          </li>
          <li>Les tarifs affichés sur le site font foi au moment de la souscription.</li>
        </ul>

        <h2>4. Contenu généré</h2>
        <p>
          Les histoires sont générées par une intelligence artificielle à partir des informations fournies par le
          parent. Nous mettons en œuvre des mesures raisonnables (dont un mode « histoires apaisées » activable par
          profil) pour que le contenu reste adapté aux enfants, sans pouvoir garantir un contrôle éditorial
          exhaustif de chaque texte généré. Il appartient au parent de lire les histoires avant de les partager
          avec l&apos;enfant s&apos;il le souhaite.
        </p>

        <h2>5. Propriété du contenu</h2>
        <p>
          Les histoires générées pour votre compte vous appartiennent et peuvent être librement téléchargées,
          imprimées ou partagées à titre personnel et non commercial.
        </p>

        <h2>6. Résiliation et suppression de compte</h2>
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis la rubrique « Mon compte ». Cette action est
          irréversible et entraîne la suppression définitive de vos profils enfants, de vos histoires et des
          fichiers audio associés.
        </p>

        <h2>7. Responsabilité</h2>
        <p>
          Le service est fourni « en l&apos;état ». [Raison sociale à compléter] ne saurait être tenue responsable
          d&apos;une interruption temporaire du service ou d&apos;un contenu généré jugé inapproprié malgré les
          mesures mises en œuvre ; tout signalement peut être adressé à [adresse e-mail à compléter].
        </p>

        <h2>8. Modification des conditions</h2>
        <p>
          Ces conditions peuvent être mises à jour ; les utilisateurs seront informés de toute modification
          substantielle.
        </p>
      </div>
    </div>
  );
}
