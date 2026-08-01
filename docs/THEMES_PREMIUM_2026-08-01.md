# Thèmes premium — série « niches manquantes » du 1er août 2026

Exécution du prompt `docs/PROMPT_THEMES_PREMIUM.md`, sur la base de l'analyse
`docs/NICHES_MANQUANTES_2026-08-01.md`.

## Ce qui a été construit

| # | Thème | Niche | Donneur | Signature | Photos |
|---|---|---|---|---|---|
| 1 | **impact-326** Vasseur & Delmas | Notaire *(remplacement — voir ci-dessous)* | impact-03 (Maison Dorée) | `ArcSwap` (sweep 46°) | 4, réutilisées du repo |
| 2 | **impact-327** Lignes & Bois | Cuisiniste / agencement | impact-230 (Atelier du Bois) | `ExpandFrame` plein cadre | 3+1, réutilisées du repo |
| 3 | **impact-328** Maison Estève | Pompes funèbres | impact-95 (Lumière Clinic) | `HeldSwap` tilt 7° + `DWELL.slow` | 3+1, réutilisées du repo |
| 4 | **impact-329** Cap Déménagements | Déménageur *(remplacement — voir ci-dessous)* | impact-236 (ÉlectroPro) | `HardCutRebuild` stagger 90 ms | **aucune** (hero typographique) |
| 5 | **impact-330** Pharmacie du Parc | Pharmacie / parapharmacie | impact-30 (Smile Studio) | `MosaicPush` stagger 90 ms | **aucune** (tuiles CSS) |

Cinq signatures distinctes, aucune `BlurThrough`, accessoires libres
(`SlideIndex`, `HairlineArrows`) réutilisés partout. Timings du kit intouchés.

## Deux niches remplacées — et pourquoi

Le prompt prévoyait opticien et serrurier. **Les deux existent déjà** ; le
registre les étiquette à tort, ce qui a faussé l'analyse des niches (fondée
sur `registry.ts`, comme elle l'annonce elle-même) :

- **impact-138** est un thème opticien complet (« Vision Claire Nantes » :
  tarifs verres, renouvellement d'ordonnance loi 2016, 400 montures) —
  étiqueté « Prism Analytics / Tech » dans le registre.
- **impact-192** est un thème serrurier urgence 24h/24 complet
  (« SÉC'URFAST » Strasbourg : ouverture dès 149 €, multipoints, astreinte) —
  étiqueté « Lumina Beauty / E-Commerce ».

Conformément à la consigne du prompt (« remplace-la par : notaire, auto-école,
centre de formation Qualiopi, ou déménageur — dis-le »), remplacés par :

- **Notaire** (impact-326) : panier très élevé ; le donneur luxe impact-03
  l'éloigne visuellement des 11 thèmes d'avocat existants (l'objection notée
  dans l'analyse). ArcSwap = la plaque suspendue de l'étude qui oscille.
- **Déménageur** (impact-329) : `HardCutRebuild` y est littéral — on démonte
  tout, on remonte tout. Métier d'intervention, donneur ÉlectroPro adapté.

Cuisiniste, pompes funèbres et pharmacie sont réellement absents du catalogue
(vérifié dans le **contenu des pages**, pas le registre : grep plein texte sur
les 315 templates).

> À faire hors de cette série : corriger les entrées registre de impact-138 et
> impact-192 (et plus largement re-synchroniser le registre au-delà de l'id
> ~190 — il ment sur les métiers, c'est documenté dans `.claude/CLAUDE.md`).

## Conformité aux règles de fabrication

- **Aucune nouvelle animation** : uniquement `hero-kit-2` / `hero-kit-3`
  (`useSlides`, `DWELL`, `SlideIndex`, `HairlineArrows`, `ArcSwap`,
  `ExpandFrame`, `HeldSwap`, `HardCutRebuild`, `MosaicPush`).
- **Piège Tailwind `relative`/`absolute` évité** : `ExpandFrame` code sa
  position en inline — étiré via un wrapper `position:absolute; inset:0`,
  jamais en lui passant `absolute inset-0` (impact-327).
- **`prefers-reduced-motion`** : géré par le kit, non contourné (chaque geste
  reçoit ses props, aucun composant modifié).
- **Grilles** : cartes en `repeat(auto-fit, minmax(min(XXXpx,100%),1fr))`
  (auto-repliables) ; les grilles 2 colonnes et bandeaux stats ont leur propre
  media query par thème (`.i32X-split`, `.i32X-stats`) — aucun nouveau patron
  inline dépendant de la liste générée de `app/templates/layout.tsx`.
- **`overflowX: "clip"`** sur chaque wrapper racine (jamais `hidden`).
- **Mentions légales en footer** : SIREN Aevia via `LegalIdentity`
  (852 546 225 par défaut, substitué par le SIRET client en session), sans
  adresse physique. Aucune URL « sky », aucune marque inventée côté clients.
- **Mentions réglementaires par métier** : garde des Sceaux + Chambre des
  notaires (326) ; décennale pose + devis ferme (327) ; habilitation
  préfectorale + devis-type arrêté du 23 août 2010 + 24h/24 (328) ; registre
  des transporteurs DREAL + ad valorem + lettre de voiture (329) ; Ordre des
  pharmaciens + licence + 3237 (330).
- **Registres** : entrée dans `registry.ts`, traductions en/es/de/pt dans
  `registry-i18n.ts`, et 5 nouvelles specialties dans `sectors.ts`
  (`notaire`, `cuisiniste`, `pompes_funebres`, `demenageur`, `pharmacie`).

## Ce qui a été mesuré

Balayage sur `npm run build` (exit 0) + `npx next start` — jamais le serveur
dev — un seul balayage à la fois, aux deux tailles 1440×900 **et** 390×844,
après défilement complet de chaque page (script
`sweep-premium.js`, mesures DOM, pas des captures interprétées à l'œil) :

| Contrôle | 326 | 327 | 328 | 329 | 330 |
|---|---|---|---|---|---|
| Page répond 200 (les deux tailles) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Débordement horizontal du body | aucun | aucun | aucun | aucun | aucun |
| Élément rogné hors viewport (non clippé, hors transform) | 0 | 0 | 0 | 0 | 0 |
| Mot d'un h1/h2 plus large que sa boîte | 0 | 0 | 0 | 0 | 0* |
| CTA visible sans défiler (les deux tailles) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cibles tactiles < 44 px | 0** | 0** | 0** | 0** | 0** |
| Contraste < 4,5:1 sur fond uni | 1 corrigé*** | 0 | 0 | 0 | 0 |

\* Le balayage a signalé « pharmacie,au-delà » (611px > 581px) : artefact de
mesure — `textContent` fusionne les deux mots autour du `<br/>` sans espace.
Chaque mot réel tient dans sa boîte, vérifié sur capture.

\** Seul signalement : le lien global « Skip to main content » (1×1 px) — le
lien d'accessibilité masqué du layout, visible uniquement au focus clavier.
Pré-existant sur les 315 templates, pas un défaut.

\*** Les kickers laiton de l'impact-326 (`#8a6d3f` à 12 px sur fonds
`#faf8f3`/`#f2ede3`) mesuraient 4,15:1 → passés à `C.accentDark` (`#6d5530`,
6,05:1). Toutes les autres alertes de l'analyseur étaient des faux positifs :
il ignore le canal alpha (texte blanc sur carte `rgba(255,255,255,0.04)`
posée sur un fond sombre → il croit à du blanc sur blanc), et ne composite
pas les dégradés des heros. Les paires réelles recalculées à la main sont
toutes ≥ 4,5:1 (ou ≥ 3:1 en grand corps).

- **tsc** : 1942 avant la série (re-mesuré sur le main du jour, comme demandé)
  → 1942 après chacun des cinq thèmes.
- **`npm run build`** : sort en 0, les cinq routes présentes dans l'arbre.
- **Captures regardées une par une** (pas seulement mesurées) : les 10 pages
  (5 × 2 tailles). Une seule anomalie apparente — le hero d'impact-329 mobile
  « vide » — était le **temps mort volontaire** du HardCutRebuild (capture
  tombée pendant la coupe, index en cours de swap) ; re-capture après
  stabilisation : contenu complet.
- **`prefers-reduced-motion`** : porté par les composants du kit (chaque
  geste rend un fondu simple sous `useReducedMotion`), aucun contournement —
  les cinq thèmes ne font que passer des props.

## Ce qui n'a PAS pu être vérifié ici

- **Le sujet des photographies.** Le proxy de cet environnement bloque
  `images.unsplash.com` (403 CONNECT) : aucune image ne se charge, ni dans
  Chromium ni en curl. Conséquences :
  - le contrôle « chaque `<img>` a `naturalWidth > 0` » échoue mécaniquement
    ici pour toutes les images Unsplash — c'est l'environnement, pas les
    pages ;
  - « ouvrir chaque image et la regarder » est impossible depuis ce conteneur.
  Parade : **aucune URL nouvelle**. Les 11 URLs utilisées existent déjà dans
  le repo avec un alt cohérent chez leur template d'origine (cabinets
  juridiques impact-55/242, atelier bois impact-230, intérieur impact-152,
  nature/fleurs impact-59/105/191). Les sujets exacts restent **à contrôler
  en prod après déploiement** — c'est le même reste-à-faire que les sessions
  précédentes. Les deux thèmes sans images vérifiables plausibles (déménageur,
  pharmacie) sont volontairement **sans photo**.
- **Le contraste sur pixels composités au-dessus des photos** : mesuré
  seulement sur fonds unis (les photos ne se chargent pas ici). Les textes
  posés sur images ont tous un dégradé sombre ≥ 0.38 d'opacité sous eux.
- **Le rendu live** : le déploiement est manuel (`vercel --prod`) et n'a pas
  été fait, conformément au prompt.
