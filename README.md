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
- [pdfkit](https://pdfkit.org) pour l'export PDF des histoires
- [@aws-sdk/client-s3](https://github.com/aws/aws-sdk-js-v3) pour le stockage audio objet (S3/R2, optionnel)
- [Resend](https://resend.com) (API HTTP simple) pour les e-mails transactionnels, optionnel — log en console sans clé

## Fonctionnalités

- Inscription / connexion, palier gratuit actif dès la création du compte (pas de carte bancaire)
- Gestion de plusieurs profils enfants (prénom, âge, personnalité, goûts, peurs, héros préférés)
- **Contrôle parental** par enfant : mode "histoires apaisées" (sans frayeur ni tension), activé par défaut
- Création d'histoire guidée par 15 **univers thématiques** en cartes visuelles (pirates, espace, magie...), ou thème libre
- **Sélecteur rapide multi-enfants** dans le dashboard pour les familles avec plusieurs profils
- Génération d'histoires personnalisées (thème/univers, morale optionnelle, longueur au choix)
- **Narration audio** de l'histoire (voix multilingue via ElevenLabs), générée automatiquement pour les abonnés Pro
- **Export PDF** imprimable de chaque histoire
- Historique des histoires générées (texte + audio), consultables à tout moment
- Palier gratuit : 1 histoire par jour ; blocage au-delà avec incitation à passer au Pro
- Abonnement Stripe mensuel (Checkout), gestion de la facturation via le Billing Portal
- Webhooks Stripe pour tenir à jour le statut d'abonnement (actif, impayé, annulé...)
- Rate limiting basique sur l'inscription, la connexion et la réinitialisation de mot de passe (anti-abus / anti-bruteforce)
- Page 404, écran d'erreur et état de chargement personnalisés
- **Conformité RGPD de base** : pages CGU/confidentialité, case de consentement horodatée à l'inscription, export des données personnelles en JSON, suppression de compte en un clic (cascade complète, y compris les fichiers audio)
- **Mot de passe oublié** : réinitialisation par e-mail à usage unique (token à hash SHA-256, expiration 1h, anti-énumération)
- **Vérification d'email** non bloquante à l'inscription, avec bannière de rappel et renvoi (rate limité)
- **SEO de base** : sitemap.xml, robots.txt, métadonnées Open Graph / Twitter Card
- **Tests automatisés** (Vitest) sur la logique métier critique (abonnement, rate limiting, jetons) + **CI GitHub Actions** (typecheck, lint, tests, build sur chaque push/PR)

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
| `S3_BUCKET` | Active le stockage objet (S3/R2) pour l'audio si défini ; sinon stockage local (optionnel) |
| `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Configuration du stockage objet (voir `.env.example`) |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi réel des e-mails (optionnel — sans elle, les e-mails sont loggés en console) |
| `EMAIL_FROM` | Adresse d'expédition des e-mails transactionnels |
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

### Tests

```bash
npm test
```

Lance la suite Vitest (logique métier : abonnement/quota gratuit, rate limiting, jetons,
intégrité des univers thématiques). Une CI GitHub Actions (`.github/workflows/ci.yml`)
exécute automatiquement `tsc`, `eslint`, `npm test` et `npm run build` sur chaque push et
pull request.

## Structure du projet

```
app/
  page.tsx                     Landing page
  inscription/, connexion/     Authentification
  mot-de-passe-oublie/,
  reinitialiser-mot-de-passe/  Réinitialisation de mot de passe
  cgu/, confidentialite/       Pages légales
  not-found.tsx, error.tsx     Pages 404 / erreur personnalisées
  dashboard/                   Espace parent (protégé par middleware)
    loading.tsx                État de chargement
    enfants/                   Gestion des profils enfants (dont contrôle parental)
    histoires/                 Génération et consultation des histoires (univers, audio, PDF)
    abonnement/                Gestion de l'abonnement Stripe
    compte/                    Export des données / suppression de compte (RGPD)
  api/
    register/                  Création de compte (rate limité, consentement requis)
    auth/[...nextauth]/        NextAuth (connexion rate limitée)
    password-reset/            Demande et confirmation de réinitialisation
    account/                   Export des données, suppression de compte
    children/                  CRUD des profils enfants
    stories/                   Génération et listing des histoires, audio, export PDF
    stripe/                    Checkout, Billing Portal, webhook
lib/                           Prisma, NextAuth, Stripe, génération IA, audio, stockage, PDF, email, rate limit
prisma/schema.prisma           Modèle de données
storage/audio/                 Fichiers audio générés en local (non versionné, voir Production)
```

## État de prod-readiness

✅ Fait :
- Auth, abonnement Stripe, génération IA, audio, PDF, contrôle parental — flow complet testé de bout en bout
- Stockage audio abstrait (bascule automatique vers S3/R2 dès que `S3_BUCKET` est défini)
- Rate limiting basique sur les endpoints sensibles à l'abus (inscription, connexion, reset mot de passe, renvoi de vérification)
- Pages d'erreur/404 personnalisées
- Réinitialisation de mot de passe et vérification d'email (fonctionnent sans provider configuré, en mode log console)
- Pages CGU/confidentialité, consentement horodaté, export et suppression des données personnelles
- Sitemap, robots.txt, métadonnées Open Graph/Twitter
- Suite de tests automatisés + CI GitHub Actions sur chaque push/PR

⚠️ À faire avant un vrai lancement public :
- **Relecture juridique** : les pages CGU/confidentialité livrées sont des modèles de base (raison sociale, adresse de contact à compléter) — à faire relire par un professionnel du droit avant mise en ligne, en particulier sur le statut du consentement parental
- **Base de données** : passer de SQLite à PostgreSQL (changer `provider` dans `prisma/schema.prisma`) — non fait dans cette session faute d'instance Postgres disponible pour tester la migration
- **Rate limiting** : l'implémentation actuelle est en mémoire (par instance) — passer sur un store partagé (Redis/Upstash) si déploiement multi-instance
- **Monitoring** : pas de suivi d'erreurs (Sentry) ni d'analytics en place
- **Longueur audio** : l'API ElevenLabs limite la taille de texte par requête ; prévoir un découpage pour les histoires très longues si besoin
- **Image Open Graph** : les métadonnées sociales sont en place mais sans image `og:image` dédiée — à ajouter avant un vrai lancement (visuel de partage sur réseaux sociaux)

## Production

- Remplacer SQLite par une base PostgreSQL (changer `provider` et `DATABASE_URL` dans `prisma/schema.prisma`).
- Définir toutes les variables d'environnement sur la plateforme d'hébergement.
- Configurer le webhook Stripe en production (voir ci-dessus).
- Définir `S3_BUCKET` (et les variables associées) pour un stockage audio persistant sur les plateformes à filesystem éphémère (Vercel, etc.) — sans cela, l'app fonctionne mais perd les fichiers audio à chaque redéploiement.
