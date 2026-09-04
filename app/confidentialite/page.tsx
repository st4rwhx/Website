import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Politique de confidentialité — Câlin d'Histoires",
};

export default function ConfidentialitePage() {
  return (
    <div className="flex-1">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 prose prose-neutral">
        <h1>Politique de confidentialité</h1>
        <p className="text-sm opacity-60">Dernière mise à jour : à compléter avant mise en ligne.</p>

        <p>
          <strong>
            Ce document est un modèle de base. Avant toute mise en production, faites-le relire par un
            professionnel du droit (les traitements de données concernant des enfants sont soumis à des règles
            renforcées en France et dans l&apos;Union européenne — RGPD, recommandations CNIL).
          </strong>
        </p>

        <h2>1. Qui sommes-nous ?</h2>
        <p>
          [Raison sociale à compléter], éditeur de l&apos;application « Câlin d&apos;Histoires », responsable du
          traitement des données décrites ci-dessous. Contact : [adresse e-mail à compléter].
        </p>

        <h2>2. Quelles données collectons-nous ?</h2>
        <ul>
          <li>Données du compte parent : nom, adresse e-mail, mot de passe (chiffré, jamais stocké en clair).</li>
          <li>
            Données des profils enfants créés par le parent : prénom, âge, personnalité, centres d&apos;intérêt,
            craintes éventuelles, personnages préférés. Ces informations sont saisies volontairement par le
            parent, jamais directement par l&apos;enfant.
          </li>
          <li>Contenu généré : les histoires créées et, le cas échéant, leur narration audio.</li>
          <li>Données de facturation : gérées par notre prestataire de paiement (Stripe), nous ne stockons pas les numéros de carte bancaire.</li>
        </ul>

        <h2>3. Pourquoi utilisons-nous ces données ?</h2>
        <ul>
          <li>Fournir le service : générer des histoires personnalisées et les rendre accessibles au parent.</li>
          <li>Gérer le compte, l&apos;abonnement et la facturation.</li>
          <li>Assurer la sécurité du service (prévention des abus).</li>
        </ul>
        <p>
          Les informations sur l&apos;enfant ne sont <strong>jamais utilisées à des fins publicitaires</strong> et
          ne sont pas revendues à des tiers.
        </p>

        <h2>4. Génération des histoires par intelligence artificielle</h2>
        <p>
          Le contenu des profils enfants et le thème choisi sont transmis à un prestataire d&apos;intelligence
          artificielle (Anthropic) pour générer le texte de l&apos;histoire, et, pour les abonnés Pro, à un
          prestataire de synthèse vocale (ElevenLabs) pour la narration audio. Ces prestataires traitent les
          données uniquement pour exécuter cette prestation technique, conformément à leurs propres engagements
          de confidentialité.
        </p>

        <h2>5. Combien de temps conservons-nous les données ?</h2>
        <p>
          Les données sont conservées tant que le compte est actif. En cas de suppression du compte, l&apos;ensemble
          des données (profils enfants, histoires, fichiers audio) est supprimé définitivement, hors obligations
          légales de conservation (ex. données de facturation).
        </p>

        <h2>6. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et
          de portabilité de vos données. Depuis votre espace, rubrique{" "}
          <strong>Mon compte</strong>, vous pouvez à tout moment télécharger l&apos;ensemble de vos données ou
          supprimer définitivement votre compte. Pour toute autre demande : [adresse e-mail à compléter].
        </p>

        <h2>7. Sécurité</h2>
        <p>
          Les mots de passe sont chiffrés. Les échanges avec le site sont sécurisés (HTTPS). L&apos;accès aux
          données est limité aux traitements strictement nécessaires au fonctionnement du service.
        </p>

        <h2>8. Cookies</h2>
        <p>
          L&apos;application utilise uniquement des cookies strictement nécessaires à l&apos;authentification
          (session). Aucun cookie publicitaire ou de mesure d&apos;audience tiers n&apos;est utilisé à ce stade.
        </p>
      </div>
    </div>
  );
}
