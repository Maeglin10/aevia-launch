# Série « toutes les niches à 2 variantes » — 53 thèmes (impact-331 → 383)

Suite de `docs/THEMES_PREMIUM_2026-08-01.md` (5 thèmes, impact-326 → 330).
Objectif donné : **aucune niche du catalogue en dessous de 2 variantes**.

## 1 · Le décompte de départ — mesuré sur le contenu, pas sur le registre

`registry.ts` ment sur les métiers au-delà de l'id ~190 (documenté dans
`.claude/CLAUDE.md`), et `docs/NICHES_MANQUANTES_2026-08-01.md` en hérite
puisqu'elle s'appuie dessus. Le décompte a donc été refait par grep plein
texte sur les 315 `page.tsx`, avec vérification manuelle des cas ambigus.

**Corrections dans les deux sens :**

| Niche | Doc niches | Réel (contenu) | Détail |
|---|---|---|---|
| Vétérinaire | 1 | **2** | impact-188 « Clinique du Bois Vert » non vu |
| Pisciniste | 1 | **5** | 15, 177, 179, 181, 183 — tous de vrais piscinistes |
| Déménageur | 0 | **2** | impact-39 est un déménageur complet (garde-meuble, estimation 24 h) |
| Infirmier libéral | 2 | **0** | les 2 « hits » étaient des thèmes de médecin citant une infirmière |
| Audioprothésiste | 1 | **0** | impact-07 est un studio d'enregistrement (« Request Audition ») |
| Couvreur | 1 | **0** | impact-213 est le maçon |

Trois niches n'avaient donc besoin de rien (vétérinaire, pisciniste,
déménageur), et trois étaient plus vides qu'annoncé.

## 2 · Ce qui a été construit — 53 thèmes, 8 lots

Chaque niche reçoit deux variantes de **positionnement différent** (ville,
clientèle, ton) et de **geste signature différent**.

| Lot | Ids | Niches |
|---|---|---|
| 1 | 331-336 | 2ᵉ variantes des 6 niches premium (opticien, serrurier, notaire, cuisiniste, funéraire, pharmacie) |
| 2 | 337-343 | assurance ×2, audioprothésiste ×2, auto-école ×2, pressing |
| 3 | 344-350 | pressing v2, boucherie, fromagerie, formation ×2, contrôle technique ×2 |
| 4 | 351-357 | couvreur ×2, crèche ×2, infirmier ×2, laboratoire |
| 5 | 358-364 | laboratoire v2, location matériel ×2, peintre ×2, podologue ×2 |
| 6 | 365-371 | producteur fermier ×2, sage-femme ×2, salle de réception ×2, sécurité |
| 7 | 372-378 | sécurité v2, VTC ×2, vitrier ×2, école de musique v2, patrimoine v2 |
| 8 | 379-383 | menuisier v2, brasserie, caviste, recrutement, toiletteur |

**24 specialties** ajoutées à `lib/templates/sectors.ts`, 53 entrées dans
`registry.ts` et 53 × 4 traductions dans `registry-i18n.ts`.

### Méthode de fabrication

Les pages sont produites par un générateur (`scratchpad/gen/gen.py`) qui
applique le squelette validé des 5 premium — nav + burger, plomberie
`session`/`fd`, `resolveList`, sections, `LegalIdentity`, media queries par
thème — à un bloc de données métier unique par thème. Le contenu (services,
méthode, tarifs, avis, mentions réglementaires) est écrit thème par thème :
le générateur ne fabrique que la structure.

**Aucune animation nouvelle** : uniquement `hero-kit-2` / `hero-kit-3`.
Six archétypes de héros couvrent les 53 thèmes (`card`, `fullbleed`, `typo`,
`tiles`, `orb`, `section`), chacun câblé sur le geste demandé.

### Mentions réglementaires par métier

Chaque thème porte les mentions que son métier doit afficher : ORIAS/ACPR
(courtiers), CNAPS (sécurité privée), COFRAC ISO 15189 (laboratoires),
agrément préfectoral (auto-écoles, pompes funèbres), Qualiopi + NDA
(formation), REVTC (VTC), Ordre professionnel (pharmacie, podologue,
sage-femme, infirmier), habilitation DDPP (pension animale), DTU 39
(miroiterie), décennale et Qualibat (bâtiment), mention de modération
(caviste, brasserie).

## 3 · Ce qui a été mesuré

`npm run build` (exit 0) puis `npx next start` — jamais le serveur de
développement — un seul balayage à la fois, aux deux tailles **1440×900** et
**390×844**, après défilement complet de chaque page.

**Les images sont bloquées pendant tout le balayage** (`route.abort()` sur
`resourceType === "image"`), conformément à la consigne : la mise en page
doit tenir sans photo, les photos ne sont qu'une couche par-dessus.

| Contrôle | Résultat sur 106 pages |
|---|---|
| Page répond 200 | 106/106 |
| Débordement horizontal du `body` | 0 |
| Élément rogné hors viewport (non clippé, hors transform) | 0 |
| Mot d'un `h1`/`h2`/`h3` plus large que sa boîte | 0 |
| CTA visible sans défiler | 106/106 |
| Cible tactile < 44 px | 0 |
| Contraste < 4,5:1 sur fond uni (hors composants globaux) | 0 |

- **tsc** : 1942 avant la série → **1942 après**, vérifié après chaque lot.
- **`npm run build`** : exit 0, les 53 routes présentes dans l'arbre.

### Les trois défauts trouvés — et corrigés

Tous invisibles avec les photos, bloquants sans elles. C'est précisément ce
que le balayage images-bloquées devait attraper.

1. **Héros plein cadre sans fond de repli** (327, 366, 369, 370) — la
   section comptait sur la photo pour son fond ; sans image il ne restait que
   le dégradé, à 0.10 d'opacité en haut, donc du texte blanc sur le fond
   clair de la page. Kicker d'impact-366 mesuré à **1,88:1**.
   → `background: C.bgDark` sur la section. Avec photo, l'image couvre le
   fond : aucun changement visuel.
2. **Kicker en couleur d'accent dans `InvertSweep`** (344, 362) — le geste
   bascule le fond du clair au sombre ; aucune couleur d'accent ne contraste
   sur les deux. Accent terra mesuré à **2,75:1** sur le fond sombre.
   → le kicker hérite la couleur pilotée par le composant, lisible dans les
   deux états.
3. **`as const` sur un ternaire** dans les trois thèmes `ComposeIn` (337,
   353, 356) — TS1355 puis TS2322, **non masqués par `@ts-nocheck`**.
   → cast explicite vers l'union littérale. tsc revenu à 1942.

### Deux pièges d'instrumentation corrigés en route

À noter pour les prochaines campagnes — ils faussaient les mesures, pas les
pages :

- **`color(srgb …)`** : Chromium sérialise certaines couleurs dans ce format
  (canaux en 0-1). L'analyseur les lisait comme du 0-255 et inventait des
  ratios de contraste. Corrigé dans le script de balayage.
- **Serveur périmé** : `next start` relancé alors que l'ancien tenait encore
  le port échoue silencieusement (EADDRINUSE) ; l'ancien serveur continue de
  répondre en servant des chunks JS qui n'existent plus → 500 sur les chunks,
  hydratation cassée, et des `noCtaAboveFold` fantômes sur 8 thèmes. Toujours
  vérifier **quel** processus tient le port, ou changer de port.

## 4 · Ce qui n'a PAS pu être vérifié ici

- **Le sujet des photographies.** Le proxy de cet environnement bloque
  `images.unsplash.com` (403 CONNECT). Parade inchangée : **aucune URL
  nouvelle** — seules des images déjà présentes dans le repo sont réutilisées,
  et les niches sans image plausible disponible ont un héros **sans photo**
  (typographie, tuiles CSS, pictogrammes). Sur les 53 thèmes, **45 sont
  entièrement sans photographie** ; les 8 qui en portent (331, 334, 335, 365,
  366, 369, 370, 379) réutilisent des images déjà présentes dans le repo, dont
  les sujets restent à contrôler en prod.
- **Le rendu live** : le déploiement est manuel (`vercel --prod`) et n'a pas
  été fait.

## 5 · Restes connus

- **Registre à corriger** : impact-138 (opticien, étiqueté « Prism Analytics /
  Tech »), impact-192 (serrurier, étiqueté « Lumina Beauty / E-Commerce »),
  impact-39 (déménageur), impact-188 (vétérinaire) — et plus largement
  resynchroniser le registre au-delà de l'id ~190.
- **Bandeau cookies global** (`components/CookieBanner.tsx`) et lien
  d'accessibilité « Skip to main content » : signalés par l'analyseur sur les
  106 pages, mais **préexistants et globaux** — vérifiés identiques sur les
  anciens templates (impact-100). Hors périmètre de cette série ; à traiter
  une fois, dans le composant, si vous voulez les faire disparaître partout.
- **Héros plein cadre des séries précédentes** : vérifiés à la mesure.
  impact-243 (18,7:1) et impact-266 (19,5:1) ont déjà un fond sombre — rien à
  faire. **impact-309 était touché** (titre blanc à 1,09:1 sur `bgDeep`
  `#f8f4f6`) : corrigé ici même, fond de repli `C.text`.
