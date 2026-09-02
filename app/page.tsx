import Link from "next/link";
import Navbar from "@/components/Navbar";

const steps = [
  {
    title: "1. Créez le profil de votre enfant",
    text: "Prénom, âge, personnalité, ce qu'il adore, ses héros préférés, ses petites peurs à apprivoiser...",
    emoji: "🧒",
  },
  {
    title: "2. Choisissez un thème",
    text: "Le sommeil, le partage, un anniversaire, un dragon, l'école... ou laissez l'IA vous surprendre.",
    emoji: "✨",
  },
  {
    title: "3. Recevez une histoire unique",
    text: "Générée en quelques secondes, avec votre enfant comme héros de l'histoire.",
    emoji: "📖",
  },
];

const testimonials = [
  {
    quote:
      "Je rentre épuisée du travail et je n'ai plus l'énergie d'inventer une histoire différente chaque soir. Là, c'est prêt en 20 secondes et mon fils adore être le héros.",
    name: "Camille, maman de Léo (5 ans)",
  },
  {
    quote:
      "L'IA a repris la peur du noir de ma fille et en a fait une histoire rassurante. Ça a vraiment aidé au coucher.",
    name: "Karim, papa d'Inès (4 ans)",
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold px-3 py-1 mb-4">
            Propulsé par l&apos;intelligence artificielle
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            L&apos;histoire du soir, inventée pour{" "}
            <span className="text-[var(--primary)]">votre</span> enfant.
          </h1>
          <p className="text-lg opacity-80 mb-8">
            Après une journée de travail, plus besoin d&apos;inventer une histoire.
            Notre IA connaît la personnalité, les goûts et les peurs de votre
            enfant, et lui crée une histoire 100% originale, en quelques
            secondes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="rounded-full bg-[var(--primary)] text-white px-6 py-3 font-semibold hover:bg-[var(--primary-dark)] transition"
            >
              Commencer l&apos;essai gratuit
            </Link>
            <Link
              href="#comment-ca-marche"
              className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-black/5 transition"
            >
              Comment ça marche
            </Link>
          </div>
          <p className="text-sm opacity-60 mt-4">
            Sans engagement pendant l&apos;essai · Annulable à tout moment
          </p>
        </div>
        <div className="rounded-3xl bg-white shadow-xl border border-black/5 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wide opacity-50 mb-2">
            Aperçu d&apos;une histoire générée
          </p>
          <h3 className="font-bold text-xl mb-2">Léo et le dragon qui avait peur du noir</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Léo adorait les dinosaures et détestait se coucher tôt. Un soir, un
            petit dragon timide se glissa sous son lit... Il avait, lui aussi,
            peur du noir. Léo, si courageux d&apos;habitude, décida de
            l&apos;aider à retrouver le sommeil...
          </p>
          <p className="text-xs opacity-40 mt-4">Générée pour Léo, 5 ans — thème : peur du noir</p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="bg-white border-y border-black/5 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.title} className="text-center">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm opacity-70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pensé pour les parents débordés
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl bg-white border border-black/5 shadow-sm p-6"
              >
                <p className="italic opacity-80 mb-4">&laquo; {t.quote} &raquo;</p>
                <footer className="text-sm font-semibold opacity-60">{t.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="bg-white border-t border-black/5 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Un tarif simple</h2>
          <p className="opacity-70 mb-10">
            Essayez gratuitement, sans carte bancaire à saisir immédiatement. Continuez ensuite avec l&apos;abonnement Pro.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-black/10 p-8 text-left">
              <h3 className="font-semibold text-lg mb-1">Essai gratuit</h3>
              <p className="text-3xl font-extrabold mb-4">0€</p>
              <ul className="text-sm opacity-75 space-y-2 mb-6">
                <li>✔️ 7 jours d&apos;essai</li>
                <li>✔️ Histoires illimitées pendant l&apos;essai</li>
                <li>✔️ Jusqu&apos;à 3 profils enfants</li>
              </ul>
              <Link
                href="/inscription"
                className="block text-center rounded-full border border-black/15 px-5 py-2.5 font-semibold hover:bg-black/5"
              >
                Démarrer l&apos;essai
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-[var(--primary)] p-8 text-left relative">
              <span className="absolute -top-3 right-6 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                Populaire
              </span>
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <p className="text-3xl font-extrabold mb-1">9,99€ / mois</p>
              <p className="text-xs opacity-50 mb-4">après l&apos;essai gratuit, sans engagement</p>
              <ul className="text-sm opacity-75 space-y-2 mb-6">
                <li>✔️ Histoires illimitées</li>
                <li>✔️ Profils enfants illimités</li>
                <li>✔️ Historique de toutes les histoires</li>
                <li>✔️ Annulation en un clic</li>
              </ul>
              <Link
                href="/inscription"
                className="block text-center rounded-full bg-[var(--primary)] text-white px-5 py-2.5 font-semibold hover:bg-[var(--primary-dark)]"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs opacity-50">
        © {new Date().getFullYear()} Câlin d&apos;Histoires. Fait avec ❤️ pour les parents débordés.
      </footer>
    </div>
  );
}
