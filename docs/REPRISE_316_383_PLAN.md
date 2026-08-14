# Reprise des thèmes 316–383 — plan de différenciation et d'élévation

**Date** : 2026-08-11 · **Branche** : `claude/prompt-reprise-themes-316-383-y5lfwc`
**Demande** : les 66 thèmes (316–383, 320 et 323 n'existent pas) sont de qualité
insuffisante et ultra-similaires. Sans changer les niches ni les secteurs :
différencier les rendus visuels, distribuer les gestes d'animation autrement,
élever chaque thème au niveau premium, câbler entièrement au wizard, préparer
les emplacements photos (le proxy du conteneur bloque Unsplash/Pexels — il ne
doit rester QUE les images à ajouter), vérifier par captures, tout documenter.

## 1. Le constat, mesuré

- **Famille I — 8 thèmes legacy** (316, 317, 318, 319, 321, 322, 324, 325) :
  d'avant les hero-kits. Animations maison (`useScroll`/parallaxe), câblage
  contrat minimal, pas de `LegalIdentity`, fichiers de 660 à 1561 lignes.
- **Famille II — 58 thèmes** (326–383) : tous sur le même squelette « premium »
  de 412–505 lignes. 31 en split `1.08fr/0.92fr` photo à droite, 16 en centré
  maxW 1080, même ordre de sections (nav → hero slider → stats sombres →
  services → méthode → engagements → tarifs → avis sombres → contact → footer),
  même composant `Reveal`, mêmes 11 tokens `C`, et **16 palettes recyclées à
  l'identique** entre thèmes (6 thèmes partagent le même teal, 5 le même orange
  sombre…). Les gestes varient mais le corps de page est littéralement le même
  fichier à contenu près.
- **Câblage** : sur les 66, `clientHours`/`clientSiret`/`clientAreas`/
  `clientMenu`/`clientProducts`/`clientPayments`/`clientCodePostalVille`/
  `memoriserSession` = 0 usage ; `clientPhone` 1, `clientBookingUrl` 1,
  `clientEmail` 3, `clientAddress` 3 ; les thèmes lisent `fd?.phone` en dur.

## 2. Les référentiels

- **Qualité cible** : `impact-245` (boulangerie) et `impact-247` (électricien)
  — deux fontes aux rôles opposés, ~50 `clamp()`, scrims à 3+ arrêts, chiffres
  fantômes, filets dégradés, micro-interactions à 3+ propriétés, media queries
  locales préfixées, séquence signature pilotée par un seul index. `impact-83`
  pour un hero sans photo (SVG + Retint + LineScroll). Contre-exemple :
  `impact-147` (le geste seul ne fait pas le premium).
- **Gestes** : `docs/CATALOGUE_GESTES.md` — un seul geste signature par thème,
  jamais deux fois sur le même métier ; transitions 0,6–1,0 s ; DWELL 3–6× la
  transition ; stagger 55 ms ; le vide se tient. Composants dans
  `lib/templates/hero-kit-2.tsx` / `hero-kit-3.tsx`.
- **Câblage** : patron `impact-351`/`impact-99`/`impact-14` + contrat
  `lib/templates/clientContent.ts` (40 helpers) + `resolveList`. Les passes
  globales (`BrandColorVar`, `layout.tsx`) gèrent déjà : lien réservation,
  horaires, marque des sous-pages, contraste, débordements, tap targets,
  recoloration `--brand`.

## 3. Allocation par thème

Légendes.
**Archétypes héros** — H1 split média droite · H2 split média gauche · H3 plein
cadre titre bas (fond de repli `C.bgDark` obligatoire) · H4 éditorial décalé
(titre XXL chevauchant un panneau) · H5 rail latéral fixe + titre monumental ·
H6 typographique sans photo (texture CSS/SVG) · H7 magazine (méta-rangée,
titre serif géant, bandeau média bas) · H8 bento (tuiles inégales) · H9 double
colonne texte + rail de stats vertical · H10 média clippé en biseau.
**Paires de fontes** — P1 Libre Baskerville+Nunito · P2 Playfair
Display+Space Grotesk · P3 Cormorant Garamond+system-ui · P4 Fraunces+Inter ·
P5 DM Serif Display+DM Sans · P6 Archivo+Inter (voix impact sans serif) ·
P7 Lora+Sora · P8 Newsreader+Manrope · P9 Syne+Work Sans · P10 Spectral+IBM
Plex Sans · P11 EB Garamond+Outfit · P12 Bricolage Grotesque+Figtree.
**(≠)** = geste modifié par rapport à l'existant. D = fond sombre.

### Famille I — réécriture complète sur squelette premium

| id | métier | geste | héros | fontes | palette bg/accent | signature visuelle |
|---|---|---|---|---|---|---|
| 316 | nettoyage pro B2B | DifferentialExit (≠) | H9 | P10 | #f4f6f8 / #22577a | rail de stats vertical, services en rangées alternées à filet, chiffres fantômes |
| 317 | nettoyage résidentiel | PanelDrop (≠) | H1 | P5 | #faf7fc / #7c3aed | rideau vertical au hero, services en bento, avis en marquee |
| 318 | nettoyage extrême | InvertSweep (≠) | H6 | P6 | D #0e1116 / #a3c614 | la page bascule sombre→clair (métaphore avant/après), titres en contour, tarifs en bandes |
| 319 | nettoyage écologique | ParticleOrb (≠) | H6 | P4 | #f6f8f2 / #4d7c0f | orbe de particules, glows radiaux végétaux, méthode en timeline |
| 321 | conférences/salons | LineScroll (≠) | H5 | P9 | D #0a0a12 / #8b5cf6 | rail fixe, agenda en StickyProgress, intervenants en grille |
| 322 | événementiel mariage | PortalZoom (≠) | H3 | P3 | D #14100c / #c5a880 | portail en arche, section-respiration serif, galerie mosaïque |
| 324 | billetterie live | CrossPush (≠) | H3 | P12 | D #0b0f1a / #ec4899 | affiches qui se croisent, tarifs en billets perforés CSS, marquee de dates |
| 325 | séminaires corporate | ExpandFrame (≠) | H7 | P2 | #f7f7f4 / #1e3a8a | cadre qui s'ouvre, table de tarifs à lignes fines, références 56px/1fr |

### Famille II.0 — les 5 donneurs : élévation sans changer l'identité

| id | métier | geste | héros | fontes | palette | signature visuelle |
|---|---|---|---|---|---|---|
| 326 | notaire | ArcSwap | H1 | P11 | #faf8f3 / #8a6d3f | filets dégradés, chiffres romains fantômes, tarifs notariés en table |
| 327 | cuisiniste | ExpandFrame | H3 | P8 | #faf8f4 / #a4552e | fond de repli bgDark, séquence d'atelier à 3 couches |
| 328 | pompes funèbres | HeldSwap lent | H1 | P3 | #faf9f6 / #5a6b5d | silence typographique, respiration longue, DWELL.slow |
| 329 | déménageur | HardCutRebuild | H5 | P6 | D #0b0d11 / #f2760a | FixedRail, stats monumentales, formules en bandes |
| 330 | pharmacie | MosaicPush | H1 | P5 | #f7faf8 / #1a7a52 | ordonnances en timeline, croix pharmacie en texture CSS |

### Famille II — différenciation

| id | métier | geste | héros | fontes | palette | notes |
|---|---|---|---|---|---|---|
| 331 | opticien | ScrollSpin (≠) | H4 | P2 | #f5f8f9 / #0e7490 | monture SVG qui pivote au défilement |
| 332 | serrurier | GhostSolid | H6 | P6 | D #0d1013 / #4e9fd4 | lockup contour/plein, urgence 24h en bande |
| 333 | notaire urbain | WordFlight | H7 | P11 | D #0c0e14 / #7d8ff2 | magazine sombre, domaines en sommaire numéroté |
| 334 | cuisiniste montagne | PanelDrop | H2 | P8 | #f8f5ef / #7d5a3c | média à gauche, essences de bois en nuancier |
| 335 | pompes funèbres côtier | PanelRise | H3 | P3 | #f5f8fa / #2a6f97 | plein cadre mer, repli bgDark, rythme lent |
| 336 | pharmacie | StickyProgress | H9 | P10 | #faf8fb / #6d4a8a | parcours ordonnance épinglé pas à pas |
| 337 | courtier assurance | ComposeIn | H4 | P4 | #f7f8fb / #2c4a8a | scène qui se compose, garanties en accordéon |
| 338 | courtier flottes B2B | BentoCascade | H8 | P2 | D #0b1220 / #5b7fd4 | bento hero, chiffres flotte en tuiles |
| 339 | audioprothésiste | ParticleOrb | H6 | P3 | #fdfaf5 / #c07a2c | orbe = onde sonore, courbes CSS |
| 340 | audioprothésiste urbain | WordFlight | H1 | P8 | #f8f6f1 / #b45309 | mots qui volent = mots retrouvés |
| 341 | auto-école anti-stress | TrackingCollapse | H6 | P5 | #f4f9f7 / #0d9488 | interlettrage qui respire, ton apaisé |
| 342 | auto-école urbaine | CrossPush (≠) | H3 | P6 | D #101216 / #e35b3f | plans qui se croisent = circulation, plein cadre nuit |
| 343 | pressing | WipeReveal | H2 | P5 | #fbfbfd / #4763e4 | dévoilement = linge propre, blancs dominants |
| 344 | pressing écologique | InvertSweep | H6 | P12 | #f9faf7 / #5c7a4e | bascule clair↔sombre, kicker héritant la couleur pilotée |
| 345 | boucherie | HeldSwap | H4 | P1 | D #120c0e / #d46a72 | pièce en médaillon, vide tenu |
| 346 | fromagerie | MosaicPush | H8 | P4 | #fdf9ef / #c78a1e | tuiles inégales = plateau de fromages |
| 347 | formation Qualiopi | LineScroll | H7 | P10 | #f6f7fa / #4338ca | lignes défilantes = programme, certif en exergue |
| 348 | formation reconversion | BentoCascade | H8 | P12 | #fbf7f1 / #d97706 | cascade = parcours en étapes |
| 349 | contrôle technique | GhostSolid | H5 | P6 | D #0f1114 / #f5a524 | rail fixe, points de contrôle en compteur |
| 350 | contrôle technique familial | LineMask | H1 | P8 | #f7f8f6 / #4f772d | ton famille, étapes en douceur |
| 351 | couvreur-zingueur | HardCutRebuild | H3 | P9 | D #12161a / #cc7722 | coupe franche = chantier, plein cadre repli sombre |
| 352 | couvreur patrimonial | ScrollGrow | H7 | P11 | #f4f6f8 / #31587a | titre qui grandit = monument, magazine ardoise |
| 353 | micro-crèche | ComposeIn | H2 | P5 | #f7f9f5 / #4e8a5f | la scène se compose = l'éveil, formes rondes |
| 354 | crèche cocon | ScrollGrow | H4 | P8 | #faf5f3 / #c26565 | titre court qui grandit, palette peau/rosé |
| 355 | infirmiers libéraux | PanelRise | H1 | P10 | #f2f7f6 / #0f766e | volet qui monte = tournée qui s'organise |
| 356 | infirmiers côtiers | ComposeIn | H3 | P3 | #f6fafb / #227c9d | plein cadre estuaire, repli bgDark |
| 357 | laboratoire biologie | TrackingCollapse | H9 | P2 | #f5f7fb / #4646b8 | rail de chiffres, précision typographique |
| 358 | labo rural multi-sites | LineMask (≠) | H2 | P4 | #f6f9f3 / #458a43 | lignes masquées, sites en carte-liste |
| 359 | location matériel BTP | BentoCascade | H5 | P6 | D #0e1013 / #e08a1e | rail chantier, parc machines en tuiles |
| 360 | location réception | PushBlur | H3 | P9 | D #0f1216 / #3fa8c9 | poussée floutée = scène qui s'installe |
| 361 | peintre décoration | WipeReveal | H4 | P7 | #fbf9fc / #7b3fb3 | dévoilement = passe de rouleau, nuancier en accents |
| 362 | peintre duo rénovation | InvertSweep | H6 | P9 | #f9f8f4 / #356b8f | bascule = avant/après chantier |
| 363 | pédicure-podologue | MosaicPush | H1 | P8 | #f5f9fa / #12766b | tuiles = étapes du soin |
| 364 | podologue bien-être | LineMask | H4 | P3 | #fbf8f8 / #a2504f | éditorial doux, serif dominant |
| 365 | producteur fermier | HeldSwap | H7 | P4 | #fbfaf4 / #5f7a2e | magazine de saison, panier en médaillon |
| 366 | maraîchage/AMAP | CrossPush | H3 | P12 | #f4f9f4 / #2e7d4f | plein cadre champ, repli bgDark |
| 367 | sage-femme | ParticleOrb | H6 | P11 | #fdf8f6 / #b96a75 | orbe = berceau de points, très doux |
| 368 | cabinet sages-femmes | WipeReveal (≠) | H2 | P5 | #f9f6fb / #7a5296 | dévoilement lent, formes organiques |
| 369 | domaine de mariage | PortalZoom | H3 | P3 | #fbf9f5 / #9a7b4f | portail fenêtre de château |
| 370 | halle de réception | ExpandFrame | H8 | P9 | D #14130f / #c9a35e | bento industriel, poutrelles en filets |
| 371 | sécurité privée | GhostSolid | H3 | P6 | D #0b0f12 / #5fb0e8 | plein cadre nuit, lockup contour |
| 372 | sécurité commerces | TrackingCollapse | H1 | P10 | #f4f7fa / #2f6098 | interlettrage = vigilance, ton institutionnel |
| 373 | VTC premium | HardCutRebuild | H7 | P2 | D #100d09 / #d99a2b | magazine nuit, coupe franche |
| 374 | VTC quotidien/médical | DifferentialExit | H9 | P8 | #f4f6fa / #33518f | trois plans trois vitesses = trajet |
| 375 | vitrier-miroiterie | PushBlur | H2 | P10 | #f5f9fc / #1b6aa5 | flou directionnel = reflet de verre |
| 376 | miroiterie d'agencement | LineScroll | H5 | P9 | D #0d1117 / #8f9fee | rail architectes, lignes = calepinage |
| 377 | école de musique | ScrollGrow | H5 | P12 | #f8f6fc / #6d28a8 | titre qui grandit = crescendo, portées en filets |
| 378 | gestion de patrimoine | StickyProgress | H7 | P11 | #f8f6ef / #7d6428 | stratégie déroulée pas à pas |
| 379 | ébéniste d'art | ArcSwap | H4 | P1 | #fbf9f4 / #8a6a2f | l'outil balance (rabot), veines de bois en texture |
| 380 | brasserie artisanale | ArcSwap (≠) | H3 | P6 | D #130f0b / #cf7f2e | la bouteille balance, plein cadre cuivre |
| 381 | caviste | PortalZoom (≠) | H3 | P3 | D #160d12 / #b34a5e | portail voûte de cave |
| 382 | cabinet de recrutement | WordFlight | H9 | P2 | #f5f6f9 / #31506e | mots qui s'assemblent = profils, rail de chiffres |
| 383 | toiletteur & pension | PushBlur | H4 | P4 | #fbf7f2 / #b0713a | poussée douce, formes rondes, pictos pattes CSS |

Après ces changements chaque geste est employé au plus 3 fois sur les 66, tous
les gestes du catalogue servent (ScrollSpin entre au catalogue vivant), aucun
métier ne répète un geste, et les triplets partageant un geste diffèrent par
l'archétype, la paire de fontes et la palette. Quand un geste est partagé, son
**application** change (objet de l'ArcSwap, forme du PortalZoom, sujet du
CrossPush…).

## 4. Check-list premium (opposable à chaque thème)

**Tokens** : objet `C` ≥ 13 clés (`bg bgAlt bgDark bgDarkAlt bgCard accent
accentDark accentLight ink textMuted textFaint border white` + clé métier
éventuelle) ; `accent`/`accentDark` en `var(--brand, #hex)` /
`var(--brand-light, #hex)` ; trois niveaux de texte, zéro hex en dur hors `C`
(sauf rgba de scrim).

**Typographie** : exactement deux fontes aux rôles opposés, importées par
`@import` dans un `<style>` ; `h1` héros en `clamp()` avec `lineHeight ≤ 1.0`
et tracking léger négatif, `h2` de section ≈ 1.06 ; kicker 10–11 px `0.32–0.40em`
uppercase précédé d'un filet 40×1 px ; letterSpacing gradué ; une figure de
titre répétée (un mot italique + accent) ; paragraphes `maxWidth` 460–520,
`lineHeight` 1.65–1.82.

**Rythme** : `clamp()` sur typo ET paddings de section (≥ 40 occurrences),
paddings modulés section par section ; une section-respiration après le héros ;
alternance de fonds `bg/bgAlt/bgDark/bgDarkAlt` jamais mécanique ; au moins une
texture sans image (chiffre fantôme opacité 0.06–0.1, filet dégradé 1 px, glow
radial ≤ 0.12, tuiles CSS).

**Geste** : un seul par thème, du kit ; transitions 0,6–1,0 s ; DWELL 3–6× ;
stagger 55 ms ; `EASE=[0.16,1,0.3,1]` unique répété en CSS ; `prefers-reduced-motion`
honoré ; un seul index pilote tout le héros ; `useInView(once:true)` ; parallaxe
= différentiel avec image surdimensionnée ; jamais de MotionValue en `style`
sur la propriété d'un `animate` d'entrée.

**Micro-interactions** : survols en state local, 3+ propriétés (élévation,
deux ombres, accent) en 0,45–0,55 s ; soulignement nav en largeur qui pousse ;
flèches qui avancent ; nav collante à 4 propriétés ; un détail gratuit.

**Responsive** : grilles cartes en `repeat(auto-fit, minmax(min(280px,100%),1fr))` ;
grilles 2 colonnes avec media query locale préfixée (`.iXXX-…`) ; sticky →
static au point de rupture ; `overflowX:'clip'` sur la racine, jamais `hidden` ;
pour les grilles inline, réutiliser des littéraux `gridTemplateColumns` déjà
couverts par `app/templates/layout.tsx` (sinon compléter la liste) ; vérifié à
1440×900 ET 390×844, images bloquées.

**Photos** : le proxy bloque Unsplash/Pexels — ne pas inventer d'URL. Garder
les URLs existantes du thème quand il y en a, sinon `photo(i, "")` avec repli
CSS soigné (la page doit être belle photos bloquées) ; `fd?.photoUrls?.[i] ||
clientPhotos(sessionData)[i] || repli` (`||`, pas `??`) ; fond de repli
`C.bgDark` sur toute section plein cadre.

**Câblage** (patron impact-351/245/247) : `let fd,c,bp,sessionData` au niveau
module ; `?session=` + repli `sessionStorage["apercu-session:<theme>"]` ;
affectations dans le rendu, `fd/bp/c` avant tout appel ; blocs de données en
fonctions `XXX_LIVE()` ré-appelées dans `Page()` ; toutes les listes par
`resolveList(clientXxx(…)?.map(…), DEMO)` en reprenant les champs de
présentation de la démo ; héros `clientHeroLine(s, rang, total, maxLigne)`
calibré + `clientHeroSubtitle`/`clientHeroPrestations` + `clientEyebrow`/
`clientTrade` ; contact `clientPhone/clientEmail/clientAddress` ; pied de page
`clientName/clientCity/clientCodePostalVille` + `<LegalIdentity
fallback="852 546 225" kind="siren" />` ; ≥ 5 retouches `{/* TEXTE_SECTION */
clientText(sessionData, "x.titre") ?? (<>…</>)}` ; `fd?.logoBase64` dans la
nav ; ne PAS recâbler ce que les passes globales couvrent (réservation,
horaires, marque sous-pages, contraste, tap targets, débordements).

**Contenu** : on n'invente rien ; aucune section supprimée ; mentions
réglementaires du métier conservées ; cohérence de langue ; noms/villes/démos
inchangés.

## 5. Lots et vérification

Lots : A = 316–319 · B = 321–325 · C = 326–330 · D = 331–338 · E = 339–346 ·
F = 347–354 · G = 355–362 · H = 363–370 · I = 371–378 · J = 379–383.

Après chaque lot : `check-imports-contrat`, `check-variables-contrat`,
`check-frozen`, `check-hooks-dans-jsx`, `npx tsc --noEmit` (ligne de base
stable), commit. En fin de chantier : alignement central `capabilities.ts` +
`photoSlots.ts`, `build-section-manifest.mjs`, `npm run build` (code de sortie
lu), un seul balayage Playwright (session client réelle en mémoire — le POST
`/api/sessions` retombe sur la Map mémoire sans jeton Blob, GET lit le cache),
captures 1440×900 + 390×844 regardées, mesure DOM (débordements, contenu
client présent, démo remplacée), corrections, re-balayage des corrigés.

Suivi d'exécution : voir `docs/REPRISE_316_383_RAPPORT.md` (créé en fin de
chantier avec l'état vérifié thème par thème).
