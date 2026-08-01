# Audit produit — Aevia Launch (skylaunch) — 2026-07-31

> Réalisé selon `docs/PROMPT_AUDIT_PRODUIT.md` (commit `fde32d38`).
> **Aucun correctif dans ce commit** — ceci est le rapport de lecture, comme
> demandé. Les corrections viendront ensuite, un commit par sujet.

## Méthode & périmètre de vérification

Environnement : conteneur d'audit distant, branche `claude/audit-prompt-fde32d38-2m5jec`.

Ce que j'ai **réellement mesuré** :

- `npm install` puis `npm run build` (Next 16.2.10) → **exit 0**.
- `npx tsc --noEmit` → **0 erreur** (ligne de base).
- `npx vitest run` → **20 tests / 4 fichiers, tous verts**.
- Balayage HTTP `curl` : routes clés + **315/315** templates `impact-XX` + tous
  les thèmes semantic + variantes `?lang=` (fr/en/es/pt/de).
- Mesure Playwright (Chromium local, viewport 390×844) de l'**overflow
  horizontal réel** (`getBoundingClientRect`) et des **erreurs console JS** sur
  16 pages représentatives.
- Lecture du code : flux de paiement, webhooks, sessions/Blob, proxy IDP,
  cron, upload, RGPD, mentions légales, `npm audit`.

Ce que je **n'ai pas pu vérifier** dans cet environnement (à refaire en local /
préprod — je le signale plutôt que de le supposer « fait ») :

- **Chargement et sujet des images.** La politique réseau du conteneur **bloque
  `images.unsplash.com`** (le proxy renvoie `403` au CONNECT — vérifié via
  `$HTTPS_PROXY/__agentproxy/status`). Les **2053** références
  `images.unsplash.com/photo-…` du catalogue n'ont donc **pas** été testées ni
  pour le `naturalWidth>0`, ni pour le bon sujet. C'est l'axe qui, aux sessions
  précédentes, a trouvé les « bouquets » qui étaient une Game Boy — **à refaire
  impérativement** hors de ce conteneur.
- **Paiement de bout en bout.** Pas de clés Stripe dans l'environnement d'audit
  (la page `/checkout` renvoie un 500 « Stripe is not configured » côté client,
  attendu sans env). Le webhook et le pricing ont été audités **par lecture**.
- **Overflow des 315 templates** : seulement **16 pages échantillonnées** (aucun
  overflow trouvé sur l'échantillon). Le balayage exhaustif ~40 min reste à faire.

---

## Axe 1 · Est-ce que ça marche

| Contrôle | Résultat | Vérifié par |
|---|---|---|
| `npm run build` | ✅ exit 0 | build complet |
| `tsc --noEmit` | ⚠️ **0 hors `app/templates`, mais 1942 erreurs dans les templates** (voir D6) | commande |
| `vitest` | ✅ 20/20 | commande |
| Routes clés (14) | ✅ 200 (sauf cas ci-dessous) | curl |
| Templates `impact-01…315` | ✅ **315/315 → 200** | curl (boucle complète) |
| Thèmes semantic (21) + id invalide | ✅ 200 / 404 sur id bidon | curl |
| `source.unsplash.com` (interdit) | ✅ **0 occurrence** | `git grep` |
| Erreurs JS console (échantillon) | ✅ aucune sauf `/checkout` (env) | Playwright |

**Défauts trouvés :**

- **⚠️ Correction de la ligne de base tsc (le premier « 0 erreur » était
  trompeur).** Le vrai chiffre est **1942 erreurs TypeScript**, toutes dans
  `app/templates/**`, **doublement masquées** : `tsconfig.json` **exclut
  `app/templates`** *et* `next.config.ts:13` porte `typescript:
  { ignoreBuildErrors: true }`. Mon premier `tsc` tournait avant tout build
  (templates exclus → 0) ; dès que `.next/types` existe, les validateurs de
  routes générés par Next ré-importent les pages et les 1942 erreurs
  apparaissent. Le code hors-templates (lib, components, api, pages) est **100 %
  propre (0 erreur)**. Runtime OK (JS ignore les types), mais **le filet de
  sécurité de types est éteint sur tout le catalogue** → voir D6.

- **`/login` n'existe pas (404) alors que le dashboard y redirige.**
  `app/dashboard/page.tsx:38` fait `router.push("/login?next=/dashboard")` sur un
  401, mais `GET /login` → **404** (seul `app/templates/impact-22/login` existe,
  sans rapport). Un visiteur non connecté qui ouvre `/dashboard` atterrit sur une
  page 404 : **le parcours de connexion au CMS est cassé**. Vérifié : curl
  `/login` = 404, `/auth` = 404 (seul `/auth/callback` existe).
- **`/preview/<id-inexistant>` renvoie HTTP 200** (et non 404) puis affiche un
  état d'erreur en clientside. Un client avec un lien de preview mort reçoit donc
  un « 200 » : mauvais signal SEO/monitoring, et l'état d'erreur n'est visible
  qu'après rendu JS. Vérifié : curl `/preview/nonexistent-id-xyz` = 200, contenu
  contient « error / 404 ».
- **`/demo` (index) → 404.** Le dossier `app/demo/` n'a pas de `page.tsx` racine ;
  seules les sous-routes existent (`/demo/ecommerce` → 307 → `/themes/ecommerce`).
  Sans impact si rien ne pointe vers `/demo` nu — à confirmer côté liens.
- **Images : angle non couvert** (voir périmètre). C'est le trou le plus
  important de cet audit.

---

## Axe 2 · Est-ce que ça tient sur un téléphone

- **Overflow horizontal @390px : aucun** sur les 16 pages mesurées (accueil,
  `/pricing`, `/themes`, `/configure`, `/order`, `/checkout`, 2 pages légales,
  6 templates répartis 01→300, 2 thèmes semantic). Les deux règles globales de
  `app/templates/layout.tsx` (tap-targets 44px + repli des grilles inline)
  tiennent sur l'échantillon. Mesuré via `getBoundingClientRect().right > innerWidth`.
- **Non couvert :** les 299 autres templates, le contraste composité 4,5:1, et
  la césure des `h1/h2` mot-à-mot. Le balayage exhaustif reste à faire (RAM :
  un seul passage à la fois, cf. `.claude/CLAUDE.md`).

---

## Axe 3 · Est-ce qu'un client comprend ce qu'il achète

- ✅ Accueil + `/pricing` répondent 200, prix exposés via `lib/pricing.ts`
  (source unique multi-devises EUR/CHF/USD/GBP).
- ✅ **Mentions légales conformes** : `Aevia WS`, SIREN `852 546 225`, RCS
  Bourg-en-Bresse, TVA art. 293 B, **sans adresse physique** (communiquée sur
  demande) — conforme à la règle métier. Pages fr/en/es/pt/de
  (`components/LegalIdentity.tsx`). CGU / cookies / confidentialité présentes.

**Défauts trouvés :**

- **Incohérence de domaine e-mail — impacte le RGPD.** Le contact légal est
  `valentinmilliand@aevia.services` (**221** occurrences), mais la **politique de
  confidentialité et de cookies pointe vers `privacy@aevia.io`** (`app/legal/…`,
  6 occurrences) et l'expéditeur transactionnel par défaut est
  `noreply@aevia.io` (5). Deux domaines distincts : `aevia.services` (le site
  live) vs `aevia.io`. **Si `aevia.io` n'est pas contrôlé/vérifié dans Resend**,
  l'adresse de contact RGPD ne reçoit rien (une personne ne peut pas exercer son
  droit à l'effacement) et les e-mails partent d'un domaine non aligné → spam /
  bounce. À trancher : un seul domaine partout.
- **« skylaunch » visible dans le copy front.** `app/onboarding/page.tsx:567`
  affiche `<span>skylaunch</span>` — viole la règle « aucune "sky" dans le copy
  front » et la marque Aevia. (`/onboarding` est le flow legacy, mais la page
  répond 200 et reste accessible.)
- **Promesse « livraison en 2h » vs réalité humaine.** La mention « livraison en
  2 heures / instantanée » apparaît partout (~412 occurrences ; description
  Stripe `app/api/checkout/route.ts:113`, e-mails). Or la livraison finale est
  **manuelle** : l'e-mail dit « Notre équipe finalise votre site et vous contacte
  sous 2 heures » (`app/api/webhook/route.ts:118`). Seul l'**aperçu** est
  auto-généré ; le site livré dépend d'une action humaine. Promesse à tenir
  automatiquement ou à reformuler.

---

## Axe 4 · Est-ce qu'on peut le vendre demain

**Ce qui est solide (par lecture) :**

- ✅ **Pas de falsification de prix.** `/api/checkout` et `/api/checkout-preview`
  calculent `unit_amount` côté serveur via `priceIn()` — le montant ne vient
  jamais du client.
- ✅ **Webhook robuste.** `app/api/webhook/route.ts` : vérification de signature
  Stripe (`constructEvent`), **idempotence** (réservation d'`event.id` dans Blob,
  fail-open documenté), capture Sentry, e-mails client + admin.
- ✅ **RGPD cookies** : `components/CookieBanner.tsx` — opt-in par catégories
  (analytics/marketing), bouton « refuser », `ConsentAwareAnalytics` ne charge
  GA4 qu'après consentement.

**Défauts / trous trouvés :**

- **PII client stockée en Blob public lisible par tous.** `lib/sessions.ts:144`
  écrit `sessions/<sessionId>.json` avec `access:"public"` **et**
  `addRandomSuffix:false`. Le `sessionId` (UUID) est exposé dans l'URL
  `/preview/<id>` partagée au client. L'URL du Blob est donc **devinable dès
  qu'on connaît le host du store**, et le JSON contient le brief complet :
  `businessName`, **email, téléphone**, contact. Quiconque a (ou intercepte) un
  lien de preview accède à la fiche brute. Problème de confidentialité / RGPD.
- **Facture conforme : absente.** Aucune génération de facture numérotée avec
  mentions obligatoires (l'objet `checkout.sessions.create` n'active pas
  `invoice_creation`). Le client n'a que le reçu Stripe — insuffisant pour une
  facture FR conforme (numérotation, TVA « non applicable art. 293 B »).
- **Le flux principal ne facture que le prix de base.**
  `/api/checkout-preview` (parcours wizard → `/preview`) crée toujours un
  `mode:"payment"` avec **une seule ligne** (site) — pas d'add-on maintenance /
  branding, contrairement à `/api/checkout` (parcours `/order`). À confirmer :
  est-ce voulu, ou perd-on l'upsell maintenance sur le parcours principal ?
- **Bout-en-bout non testé** (pas de clés dans l'env d'audit) : webhook réel,
  e-mail reçu, échec de paiement, remboursement — à jouer en préprod Stripe.

---

## Axe 5 · Est-ce que ça tient en production

**Défauts trouvés :**

- **Secret commité : `FUNNEL_ADMIN_TOKEN`.** La valeur (préfixe `fnl_…`, rédigée
  ici) était écrite en clair dans
  `.claude/CLAUDE.md:65` (fichier **suivi par git**). C'est exactement le token
  qui protège `GET /api/funnel` (stats). Si la variable d'env de prod porte cette
  même valeur, **les stats du funnel sont de fait publiques** pour quiconque lit
  le dépôt. → Roter le token et le sortir du dépôt.
- **Dépendances vulnérables — `npm audit` : 6 vulns (4 high).** Notamment
  **Next.js** (plage installée touchée) : SSRF dans les rewrites, cache
  confusion, **divulgation non authentifiée d'endpoints de Server Functions**,
  DoS Server Actions ; **sharp/libvips** (CVE-2026-33327/33328/35590/35591) ;
  `fast-uri` ; `brace-expansion` (DoS). Correctif dispo via `npm audit fix`.
- **Proxy IDP contournable par `..`.** `app/api/idp/[...path]/route.ts:20`
  autorise via `ALLOWED_PREFIXES.some(p => path.startsWith(p))`, mais l'URL est
  ensuite construite par concaténation (`${IDP_BASE}${path}`) et **`new URL`
  normalise les `..`** : un chemin comme `/auth/../../<autre>` passe l'allowlist
  (commence par `/auth/`) tout en remontant au-dessus de `/api/v1` côté backend.
  L'allowlist des endpoints proxifiés est donc défaisable (même host backend).
- **Cron `preview-reminder` fail-open.**
  `app/api/cron/preview-reminder/route.ts:84` ne vérifie l'`Authorization` que
  **si `CRON_SECRET` est défini**. Si la variable est absente en prod,
  **n'importe qui peut déclencher l'envoi de relances** à toute la liste des
  previews non payés (le commentaire du code décrit précisément ce risque). →
  Rendre le secret obligatoire (503 si non configuré).
- **`/api/upload` sans auth ni rate-limit.** `app/api/upload/route.ts` accepte
  tout POST (image ≤5 Mo, MIME déclaré côté client) et écrit un Blob **public**.
  Vecteur d'abus : remplissage du store / hébergement gratuit de fichiers. →
  Auth ou rate-limit + validation du contenu réel.
- ✅ Sentry configuré (client/server/edge) → journaux exploitables.
- ✅ Déploiement documenté comme **manuel** (`vercel --prod`) ; push GitHub ≠
  live (cf. `.claude/CLAUDE.md`).

---

## Axe 6 · Ce qui manque — trois listes (ordonnées par ce que ça rapporte)

### 1. Bloquant pour vendre

| # | Fichier | Ce que ça casse | Effort |
|---|---|---|---|
| B1 | `.claude/CLAUDE.md:65` | Token admin funnel commité en clair → stats publiques si réutilisé en prod. **Roter + retirer du dépôt + purger l'historique.** | ~1 h |
| B2 | `package.json` / `npm audit` | Next.js & sharp en versions à CVE high (SSRF, divulgation d'endpoints, DoS). `npm audit fix` + rebuild + re-test. | 2–3 h |
| B3 | `lib/sessions.ts:144` | PII client (email, tél.) en Blob public devinable. Passer en accès protégé ou chiffrer/randomiser le chemin. | 3–5 h |
| B4 | Stripe checkout (`invoice_creation`) | Pas de facture conforme après paiement (obligation légale FR). Activer la facturation Stripe + mentions. | 3–4 h |
| B5 | `app/api/cron/preview-reminder/route.ts:84` | Cron fail-open : envoi de masse déclenchable par un tiers si `CRON_SECRET` absent. Rendre le secret obligatoire. | ~1 h |

### 2. Visible par le client

| # | Fichier | Ce que ça casse | Effort |
|---|---|---|---|
| V1 | `app/dashboard/page.tsx:38` | Redirige vers `/login` qui **n'existe pas** (404) : connexion CMS cassée pour tout utilisateur déconnecté. Créer `/login` (ou pointer vers l'IDP réel). | 2–4 h |
| V2 | Images (2053 réf. Unsplash) | Chargement + bon sujet **non vérifiés** (réseau bloqué en audit). Risque d'images 404 ou hors-sujet vues par le client. **Rejouer le balayage en local.** | ~1 j |
| V3 | `app/legal/*` vs `LegalIdentity.tsx` | Contact RGPD `privacy@aevia.io` ≠ contact légal `@aevia.services`. Si `aevia.io` non configuré → e-mails RGPD/transactionnels perdus. Unifier le domaine. | 1–2 h |
| V4 | `app/api/checkout-preview/route.ts` | Parcours principal ne propose pas l'upsell maintenance/branding (à confirmer si voulu). | 2–3 h |
| V5 | `app/onboarding/page.tsx:567` | Marque « skylaunch » visible (viole branding Aevia / règle « no sky »). | 15 min |
| V6 | Promesse « 2h » (~412 occ.) | Livraison finale manuelle vs promesse automatique. Automatiser ou reformuler. | variable |
| V7 | `/preview/<id-mort>` | Renvoie 200 au lieu de 404 + erreur seulement après rendu JS. | 1–2 h |

### 3. Dette (invisible aujourd'hui, coûteuse demain)

| # | Fichier | Ce que ça casse plus tard | Effort |
|---|---|---|---|
| D1 | `app/api/idp/[...path]/route.ts:20` | Allowlist du proxy contournable par `..` (normalisation d'URL). Restreindre après normalisation. | 1–2 h |
| D2 | `app/api/upload/route.ts` | Upload public sans auth ni rate-limit → abus/coût stockage. | 2 h |
| D3 | `app/api/webhook/route.ts:53-59` | Table `SITE_PRICES` locale au webhook divergente de `lib/pricing.ts` (landing 599 vs 399) — n'affecte que l'e-mail admin, mais piège pour la maintenance. Source unique. | 1 h |
| D4 | `tests/` | Couverture fine (4 fichiers, 0 test sur les routes API/checkout/webhook). Ajouter des tests sur le paiement et l'idempotence. | 1–2 j |
| D5 | Balayage responsive | Seulement 16/315 pages mesurées. Industrialiser le balayage overflow + contraste. | 1 j |
| D6 | `tsconfig.json` (`exclude: app/templates`) + `next.config.ts:13` (`ignoreBuildErrors`) | **1942 erreurs TS** dans les templates, doublement masquées → aucun filet de types sur le catalogue ; une régression de type passe en prod sans alerte. Réactiver le check par lots (par ex. `impact-3xx` d'abord) et retirer l'exclude à terme. | 2–4 j |

---

## Note honnête de fin

Deux angles critiques de ce prompt — **images** (axe 1) et **paiement
bout-en-bout** (axe 4) — n'ont **pas** pu être exécutés ici faute de réseau
sortant et de clés Stripe. Ce sont précisément les deux endroits où les sessions
passées ont trouvé les pires défauts. Tant qu'ils ne sont pas rejoués en local /
préprod, considérer l'audit comme **partiel** sur ces deux points.
