# Aevia Launch — vue d'ensemble

> La doc générale du produit. Une page pour comprendre ce qu'est Launch, comment il est
> bâti, ce qu'il coûte au client, et où il en est juridiquement. Tout le détail vit dans
> les fichiers pointés en bas. Termes définis dans [`GLOSSARY.md`](GLOSSARY.md).

## Rôle du produit

Aevia Launch est un **générateur de sites clients** : un prospect choisit un thème, décrit
son entreprise dans un wizard, et obtient un site **quasi-prêt** en quelques heures.

Ce n'est **pas** le produit qu'on vend à l'unité pour lui-même — c'est l'**aimant à
leads** de la suite Aevia. Un site presque fini est l'offre qui convertit les petites
entreprises sans site ; la suite logique est **Aevia Inbox** (le vrai produit vendu, la
réception/inbox IA). Launch est la porte, Inbox est la pièce.

## Architecture

### Les deux systèmes de thèmes — ne pas confondre

| Système | Route | IDs | Fichiers |
|---|---|---|---|
| **Impact templates** (ce que le client reçoit) | `app/templates/impact-XX/page.tsx` | numéros `impact-XX` | **373** dossiers dans `app/templates/` |
| **Semantic themes** (ancien) | `app/themes/[id]/page.tsx` | `ecommerce`, `vitrine`, `landing`, `saas`… | `components/themes/` + `GeneratedSite.tsx` |

Le catalogue vendu est **100 % impact**. Un `impact-XX` fait **404** à `/themes/impact-XX` —
ne jamais mélanger les deux dans les liens ou redirections. Détail : `.claude/CLAUDE.md`.

### Le contrat de contenu (thème ↔ wizard)

Le principe, non négociable : **le thème déclare ce qu'il sait montrer**, le **wizard
demande ce que le thème déclare**, puis le **thème lit un contrat unique**. Faire lire le
contrat à un thème sans que le wizard collecte la donnée, c'est « câbler du vide ».

Ordre de lecture, dans chaque thème, toujours le même :

```
donnée du client (businessProfile)
  → contenu généré (generatedContent)
    → constante de démonstration du thème
```

- Socle commun demandé à tous : identité (nom, accroche, ville, téléphone, e-mail,
  adresse), **prestations + tarifs**, photos, ce qui les distingue.
- Blocs conditionnels demandés seulement si le thème les affiche : avis, chiffres clés,
  méthode, engagements, réalisations, FAQ, équipe, zones, horaires, menu/produits.
- Le croisement wizard↔thèmes est vérifié par `scripts/audit-archetypes.mjs` : **plus
  aucune section affichée n'est laissée sans question** (8 archétypes, 68 métiers).

Détail : [`PLAN_CONTRAT_CONTENU.md`](PLAN_CONTRAT_CONTENU.md) et
[`PERSONNALISATION_PAR_THEME.md`](PERSONNALISATION_PAR_THEME.md).

### IA ou plug-and-play

Le contenu est **surtout plug-and-play** : ce que le client tape s'affiche, ce qu'il ne
tape pas garde le contenu du thème. **Aucune donnée client ne passe par un modèle.**

L'IA n'est qu'un **repli** : `/api/generate` appelle **Gemini 2.5 Flash**, avec **Groq**
en secours et `generateMockContent` en dernier recours (le site se génère toujours, même
sans clé). Elle ne sert que pour les champs laissés vides et les **métadonnées SEO** que
personne ne saisit à la main. Coût mesuré : **~0,0054 $ le site** (~5,40 $ pour 1 000
sites/mois). Détail : [`IA_OU_PLUG_AND_PLAY.md`](IA_OU_PLUG_AND_PLAY.md).

> Correctif historique : le README public a longtemps dit « Claude Haiku generates all
> copy » et « 15+ templates ». Faux. Réel : **373 thèmes**, **Gemini 2.5 Flash + Groq en
> repli**, contenu surtout plug-and-play.

### Passes globales et fichiers clés

- **Cinq corrections vivent dans `app/templates/BrandColorVar.tsx`**, une passe qui
  s'exécute après le rendu sur les 373 thèmes à la fois (lien de réservation, horaires
  du client, nom qui rétrécit au lieu d'être coupé, en-tête qui cesse de déborder, marque
  des sous-pages). Elle ne modifie **que la valeur des nœuds texte déjà en place** — elle
  ne touche jamais la structure DOM (sinon React plante au re-rendu).
- Wizard : `components/StepForm.tsx`. Sessions : `lib/sessions.ts` (Vercel Blob).
  Registre impact : `lib/templates/registry.ts` (partiellement hors sync > id ~190).
  Prix : `lib/pricing.ts`. Rendu semantic : `components/GeneratedSite.tsx`.
- `reactCompiler:false` est **délibéré** (neutralise le bug des sous-composants mémoïsés
  lisant `bp` module → données de démo en prod).

## Tarifs canoniques

Source de vérité : `lib/pricing.ts` (miroir de la DB Aevia). Montants en paiement **unique** :

| Palier | Prix | Délai | Contenu |
|---|---|---|---|
| Landing | **399 €** | 2 h | 1 page de conversion sur thème |
| Essentiel | **599 €** | 2 h | site one-page complet sur thème |
| Pro | **899 €** | 24-48 h | 3-5 pages semi-custom sur thème |
| Premium | **1 499 €** | 5-7 j | 100 % sur-mesure, hors thème |

Add-ons : **Branding 149 €** (logo + charte + retouche photo, unique) · **Maintenance
20 €/mois** (mises à jour, hébergement, support — récurrent). Multi-devises EUR/CHF/USD/GBP
(prix « jolis » par marché, pas du FX brut).

## État juridique (résumé)

Deux couches. Détail complet : [`DOC_LEGAL_AUDIT_2026-08.md`](DOC_LEGAL_AUDIT_2026-08.md).

**Le site propre d'Aevia est conforme** : bandeau cookies (accepter/refuser/personnaliser,
5 langues), GA4 chargé **sous consentement seulement**, 4 pages légales. Entité : **Aevia
WS**, auto-entrepreneur, **SIREN 852 546 225**, RCS Bourg-en-Bresse, TVA non applicable
(art. 293 B), hébergeur Vercel.

**Manques connus (à corriger) :**

1. **Asymétrie critique** : les **sites livrés aux clients chargent GA4 sans consentement
   ni bannière** (`TemplateAnalytics.tsx` monté inconditionnellement, `CookieBanner`
   seulement sur le site Aevia). Violation ePrivacy/CNIL sur les sites vendus.
2. **Pas de CGV pour les ventes propres d'Aevia** (`/legal/cgv` manquant), alors que le
   site vend 399-1499 € + 20 €/mois. Manque aussi les conditions de résiliation de
   l'abonnement (loi Chatel / résiliation en 3 clics).
3. **XSS stocké (HIGH)** : contenu client injecté via `dangerouslySetInnerHTML` sans
   désinfection — **11 points dans les thèmes** + `TemplateLegal` + `LegalDocPage` +
   `generateLegalPages`. La CSP garde `script-src 'unsafe-inline'` → ne mitige pas.
4. Politique de confidentialité (propre et générée) à aligner : **nommer les
   sous-traitants** et transferts hors UE (Stripe, Vercel, GA4, Anthropic/Gemini/Groq,
   banques d'images).

> Remédiation en cours : le commit `aa8a0078` (« fix(security): client-site GA4 behind
> consent + escape stored XSS ») s'attaque aux points **#1** (consentement GA4 sur les
> sites livrés) et **#3** (échappement XSS dans les thèmes et `generateLegalPages`). À
> re-vérifier au navigateur avant de considérer ces deux points clos. #2 et #4 restent.

## État d'ingénierie (résumé)

Audit courant : [`AUDIT_REPORT_LAUNCH.md`](AUDIT_REPORT_LAUNCH.md) — **prod-readiness 4,4/10**.
Le **rendu est mûr** (373/373 thèmes affichent tous leurs blocs, **0 plantage** avec profil
client complet — [`ETAT_THEMES_2026-08-07.md`](ETAT_THEMES_2026-08-07.md)). Mais l'**hygiène
est faible** : typage de fait désactivé (`ignoreBuildErrors:true`, ~5 700 `any`, 516
suppressions `ts-ignore`/`ts-nocheck`) et **~11 fichiers de test** pour toute l'app + 373
thèmes. Ça marche ; ça casse en silence à la prochaine grosse modif.

## État courant — où regarder

- **Sections de la page d'accueil** : [`ETAT_THEMES_2026-08-07.md`](ETAT_THEMES_2026-08-07.md)
  (l'état de référence des 373 thèmes — **on met à jour ce fichier en place**, on ne crée
  plus un instantané daté par jour ; tout nouveau daté part dans `archive/`).
- **Pages annexes** (produits, billetterie, sous-pages) :
  [`ETAT_PAGES_ANNEXES_2026-08-10.md`](ETAT_PAGES_ANNEXES_2026-08-10.md).

## Deploy

**Manuel.** Push GitHub ≠ prod.

```bash
export VERCEL_API_TOKEN=…
npx vercel --prod --yes --token "$VERCEL_API_TOKEN"
curl -sI https://launch.aevia.services | head -2   # vérifier live
```

## Le reste des docs

Index complet : [`README.md`](README.md) (dans `docs/`). Références évergreen : contrat de
contenu, personnalisation, IA-vs-plug-and-play, catalogue des gestes d'animation, méthode
de QA, teardowns, déploiement client, webhook Stripe, Strix. Prompts réutilisables :
`docs/prompts/`. Instantanés datés et journaux de chantier : `docs/archive/`.
