# Câlin d'Histoires

Application web permettant aux parents de générer, en quelques secondes, une
histoire du soir personnalisée pour leur enfant, grâce à l'IA (Claude
d'Anthropic). L'IA prend en compte le prénom, l'âge, la personnalité, les
goûts et les petites peurs de l'enfant pour créer une histoire unique dont il
est le héros.

Modèle économique **freemium**, aligné sur le marché français (Storia,
La Boîte à Rêves, ConteMoi...) : **1 histoire gratuite par jour, sans limite
de durée**, puis **abonnement mensuel « Pro » à 6,99€/mois** (Stripe) pour
des histoires illimitées et la narration audio.

## Stack technique

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite en local (facilement remplaçable par PostgreSQL en production)
- [NextAuth](https://next-auth.js.org) (email / mot de passe) pour l'authentification
- [Stripe](https://stripe.com) (Checkout + Billing Portal + webhooks) pour l'abonnement
- [SDK Anthropic](https://docs.anthropic.com) pour la génération des histoires
- [ElevenLabs](https://elevenlabs.io) pour la narration audio (fonctionnalité Pro, optionnelle)

## Fonctionnalités

- Inscription / connexion, palier gratuit actif dès la création du compte (pas de carte bancaire)
- Gestion de plusieurs profils enfants (prénom, âge, personnalité, goûts, peurs, héros préférés)
- Génération d'histoires personnalisées (thème libre, morale optionnelle, longueur au choix)
- **Narration audio** de l'histoire (voix multilingue via ElevenLabs), générée automatiquement pour les abonnés Pro
- Historique des histoires générées (texte + audio), consultables à tout moment
- Palier gratuit : 1 histoire par jour ; blocage au-delà avec incitation à passer au Pro
- Abonnement Stripe mensuel (Checkout), gestion de la facturation via le Billing Portal
- Webhooks Stripe pour tenir à jour le statut d'abonnement (actif, impayé, annulé...)

## Démarrage

```bash
npm install
cp .env.example .env
# renseignez ANTHROPIC_API_KEY, NEXTAUTH_SECRET, les clés STRIPE_*, etc.

npx prisma migrate dev
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

### Variables d'environnement

Voir `.env.example`. En résumé :

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Connexion à la base de données (SQLite en local) |
| `NEXTAUTH_SECRET` | Secret utilisé pour signer les sessions |
| `NEXTAUTH_URL` | URL publique de l'app (auth) |
| `ANTHROPIC_API_KEY` | Clé API Anthropic pour la génération des histoires |
| `ELEVENLABS_API_KEY` | Clé API ElevenLabs pour la narration audio (optionnel — sans elle, l'app fonctionne mais sans audio) |
| `ELEVENLABS_VOICE_ID` | Voix à utiliser (par défaut une voix multilingue) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature du webhook Stripe |
| `STRIPE_PRICE_ID` | ID du prix récurrent mensuel (abonnement Pro, 6,99€/mois) |
| `NEXT_PUBLIC_APP_URL` | URL publique utilisée pour les redirections Stripe |

### Configuration Stripe

1. Créer un produit « Pro » avec un prix récurrent mensuel dans le dashboard Stripe, copier son `price_id` dans `STRIPE_PRICE_ID`.
2. En local, écouter les webhooks avec la CLI Stripe :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   et copier le secret affiché dans `STRIPE_WEBHOOK_SECRET`.
3. En production, créer un endpoint webhook pointant vers `https://votre-domaine/api/stripe/webhook` et écouter au minimum les événements `checkout.session.completed`, `customer.subscription.updated` et `customer.subscription.deleted`.

## Structure du projet

```
app/
  page.tsx                     Landing page
  inscription/, connexion/     Authentification
  dashboard/                   Espace parent (protégé par middleware)
    enfants/                   Gestion des profils enfants
    histoires/                 Génération et consultation des histoires
    abonnement/                Gestion de l'abonnement Stripe
  api/
    register/                  Création de compte
    auth/[...nextauth]/        NextAuth
    children/                  CRUD des profils enfants
    stories/                   Génération et listing des histoires
    stripe/                    Checkout, Billing Portal, webhook
lib/                           Prisma, NextAuth, Stripe, génération IA, narration audio, logique d'abonnement
prisma/schema.prisma           Modèle de données
storage/audio/                 Fichiers audio générés (non versionné, voir Production)
```

## Production

- Remplacer SQLite par une base PostgreSQL (changer `provider` et `DATABASE_URL` dans `prisma/schema.prisma`).
- Définir toutes les variables d'environnement sur la plateforme d'hébergement.
- Configurer le webhook Stripe en production (voir ci-dessus).
- **Stockage audio** : les fichiers narrés sont actuellement écrits sur le disque local (`storage/audio/`), ce qui ne persiste pas sur les plateformes à système de fichiers éphémère (Vercel, etc.). En production, remplacer `lib/storage.ts` par un stockage objet (S3, Cloudflare R2...).
- L'API ElevenLabs limite la taille du texte envoyé en une requête ; pour les histoires très longues, prévoir un découpage en plusieurs appels si besoin.
