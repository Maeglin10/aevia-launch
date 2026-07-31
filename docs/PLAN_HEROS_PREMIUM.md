# Plan d'exécution — poser les héros premium sur les thèmes faibles

> Pour Claude Code. Tout est écrit et testé : il s'agit de **poser** des
> mécaniques existantes sur des thèmes nommés, pas d'inventer.

## Ce que la première version de ce document a raté

Les dix-huit héros posés le 31 juillet sont meilleurs que ce qu'ils
remplaçaient, mais ils se ressemblent tous. En comptant :

| Mécanique | Thèmes sur 18 |
|---|---|
| `BlurThrough` | **15** |
| `HairlineArrows` | **17** |
| `SlideIndex` | **15** |
| `AnchoredBackdrop` | 8 |

La signature est donc partout la même : une photo qui se dissout en flou, un
compteur, deux flèches filaires. Les dix-huit enregistrements d'origine, eux,
ont **chacun leur geste** — on traverse une arche, la photo coupe net, deux
plans se croisent, une mosaïque sort par la droite, un mot s'écarte en se
floutant, un panneau descend comme un rideau.

C'est ce document qui a produit l'uniformité : il disait « copier le lab le plus
proche » et désignait `AnchoredBackdrop` comme « le choix par défaut ». Il n'y a
pas de choix par défaut.

## La règle, désormais

**Une mécanique de signature par thème. Jamais deux thèmes du même métier avec
la même.** Les accessoires — compteur, flèches, plaque teintée — peuvent se
répéter ; le geste central, non.

Avant de poser quoi que ce soit, vérifier ce que portent déjà les thèmes voisins :

```bash
grep -l "PortalZoom\|CrossPush\|MosaicPush" app/templates/*/page.tsx
```

Si la mécanique envisagée est déjà utilisée par un thème du même métier, en
prendre une autre. Il y en a vingt-cinq.

## Le catalogue complet

[CATALOGUE_GESTES.md](CATALOGUE_GESTES.md) tient les vingt-cinq gestes : d'où
vient chacun, ce qu'il fait exactement, comment il a été mesuré, quel composant
l'écrit, et sur quels métiers il tient. **À lire avant de choisir.**

## Les deux kits

- `lib/templates/hero-kit-2.tsx` — la première série, tirée de la première
  passe sur les enregistrements.
- `lib/templates/hero-kit-3.tsx` — les gestes que cette première passe avait
  laissés de côté, un par enregistrement.

Démonstrations complètes, adressables par ancre :

- **`/video-labs`** — un onglet par enregistrement, un geste montré seul, chacun
  sur un métier différent de celui de la vidéo. **La référence.**
- `/hero-labs` — `#wine` `#law` `#bakery` `#chateau` `#event` `#tailor`
- `/hero-labs-2` — `#portal` `#gym` `#ink` `#dental` `#coffee` `#couture` `#club` `#process`

## Les vingt-cinq gestes

### Signature — un seul par thème

| Mécanique | Kit | Le geste | Métiers |
|---|---|---|---|
| `PortalZoom` | 3 | On traverse une arche : la slide suivante est déjà visible au travers, le masque s'ouvre en grand | Hôtel, château, voyage, immobilier |
| `HardCutRebuild` | 3 | La photo coupe net, un temps sans texte, puis tout se reconstruit en décalé | Sport, garage, bâtiment |
| `CrossPush` | 3 | Les deux photos se croisent, visibles ensemble un instant. Aucun fondu | Tatouage, coiffure, portrait, mode |
| `MosaicPush` | 3 | Une mosaïque sort par la droite tuile par tuile, la suivante entre par la gauche | Santé, clinique, école, agence |
| `TrackingCollapse` | 3 | Le mot s'écarte en se floutant ; le suivant arrive très espacé et se resserre | Beauté, coiffure, spa, joaillerie |
| `PanelDrop` | 3 | Un panneau descend comme un rideau, contenu compris | Boulangerie, café, restaurant, boutique |
| `PanelRise` | 3 | Le titre reste fixe, la section suivante monte par-dessus au défilement | Architecture, décoration, artisan d'art |
| `ScrollGrow` | 3 | Le titre grandit au défilement au lieu de partir | Musique, nuit, événementiel |
| `DifferentialExit` | 3 | Titre, produit et numéro partent à trois vitesses différentes | Produit, e-commerce, artisan |
| `LineScroll` | 3 | Les lignes défilent d'un bord à l'autre sous masque, avec chevauchement | Mode, costume, joaillerie, luxe |
| `HeldSwap` | 2 | Sortie, **un demi-temps de vide tenu**, entrée. Le vide fait le prix | Produit unique : bouteille, bouquet, assiette, flacon |
| `WordFlight` | 2 | Le titre s'assemble mot par mot, chaque mot sous son masque | Avocat, conseil, comptabilité |
| `BentoCascade` | 2 | Des tuiles inégales se vident et se remplissent en cascade verticale | Événementiel, création, portfolio |
| `LineMask` | 2 | Le titre sort ligne par ligne sous masque horizontal | Mode, couture |
| `GhostSolid` | 2 | Ligne en contour contre ligne pleine, même corps | Sport, garage, chantier |
| `AnchoredBackdrop` | 2 | Le titre ne bouge pas, seule la photo se dissout | **À réserver** : c'est le plus discret, il est déjà sur 8 thèmes |
| `BlurThrough` | 2 | Un libellé se floute en sortie et en entrée | **Saturé** : 15 thèmes sur 18. Ne plus l'utiliser comme signature |
| `ArcSwap` | 3 | L'objet balance : rotation de 52° autour d'un pivot au pied | Bouteille, flacon, bouquet — tout objet qui a un pied |
| `PushBlur` | 3 | Toute la composition part sur le côté, avec un flou directionnel | Immobilier, promotion, automobile |
| `ScrollSpin` | 3 | Le produit tourne au défilement | Produit, artisanat, e-commerce |
| `ComposeIn` | 3 | La scène reste vide 1,4 s, puis chaque élément arrive de son bord | Restaurant, pâtisserie, traiteur, fleuriste |
| `ParticleOrb` | 3 | Une sphère de 700 points en canvas | Éditorial, culture, luxe discret — un héros sans photo |
| `InvertSweep` | 3 | Toute la page s'inverse au défilement | Agence, studio, portfolio |

### Accessoires — réutilisables librement

| Mécanique | Kit | Rôle |
|---|---|---|
| `FixedRail` | 3 | La barre de couleur immobile qui porte le compteur et donne l'axe |
| `CrossFigure` | 3 | Une silhouette qui traverse lentement : de la vie sans slider, pour un thème qui n'a qu'une photo |
| `StickyProgress` | 3 | Titre collé + liste numérotée révélée pas à pas. Pas un héros : **la section d'après**, celle qui fait « cher » |
| `Retint` | 2 | Une surface plate prend une couleur prise dans la photo courante |
| `ExpandFrame` | 2 | La photo s'ouvre depuis un petit rectangle. Se marie à `WordFlight` |
| `CircularLabel` | 2 | Texte sur cercle qui tourne, et qui dit quelque chose |
| `SlideIndex`, `HairlineArrows` | 2 | Compteur et flèches |

## Les trois nombres à ne pas changer

1. **Une transition dure 0,6 à 1,0 s.** Jamais 0,3 s. `T.single` = 0,7 s,
   `T.group` = 1,0 s.
2. **Le temps d'arrêt vaut 3 à 6 fois la transition.** `DWELL.brisk` 3 s,
   `DWELL.normal` 4,2 s, `DWELL.slow` 5,6 s. Jamais sous 2,5 s.
3. **Les enfants d'un groupe sont décalés de 55 ms** (`T.stagger`).

## Procédure par thème

### 1. Regarder le thème avant d'y toucher

```bash
open http://localhost:3000/templates/impact-NNN
```

Noter la palette (constante `C`), les polices, le ton, la langue. Le nouveau
héros doit ressembler au reste du thème : on remplace la mécanique, pas
l'identité.

### 2. Choisir une mécanique que ce métier n'a pas encore

Consulter le tableau d'allocation plus bas. Si elle est déjà prise, en prendre
une autre — jamais deux fois la même dans un métier.

### 3. Copier le lab correspondant, puis tout réécrire

Les labs sont des démonstrations, pas des gabarits. Remplacer les couleurs par
les tokens `C.*`, les polices par celles du thème, et **tout** le texte par la
voix du thème. Garder `id="hero"` et les ancres que la nav utilise.

### 4. Les photos : vérifier le code **et** regarder l'image

Deux vérifications, pas une. Un identifiant Unsplash peut répondre 200 et
montrer autre chose : sur impact-47 les trois « bouquets » étaient une Game
Boy, un mécanicien et une rangée d'iPhone, et le contrôle HTTP passait.

```bash
# 1. l'image existe-t-elle
curl -s -o /dev/null -w "%{http_code}\n" "https://images.unsplash.com/photo-XXXX?w=200"
# 2. montre-t-elle le bon sujet — la seule façon de le savoir est de l'ouvrir
curl -s -o /tmp/v.jpg "https://images.unsplash.com/photo-XXXX?w=400&h=400&fit=crop"
open /tmp/v.jpg
```

Seuls `images.unsplash.com` et `images.pexels.com` sont autorisés par le
`img-src` de la CSP dans `next.config.ts`. Tout autre hôte est bloqué en
production sans erreur visible en local.

### 5. Vérifier en mesurant

```bash
npx tsc --noEmit -p .        # doit rester à 1942, la ligne de base
npm run build                # doit passer
```

Captures en 1440×900 **et** 390×844, et les regarder vraiment. Pour un héros où
du texte côtoie une image, mesurer l'écart plutôt que le juger à l'œil :

```js
const t = document.querySelector('h1 span').getBoundingClientRect();
const f = document.querySelector('[role="img"]').getBoundingClientRect();
console.log('écart', Math.round(f.left - t.right));   // doit rester positif
```

## Tableau d'allocation

Les dix-huit thèmes déjà traités portent tous une signature trop discrète. À
reprendre en priorité — même métier, geste différent :

| Thème | Métier | Porte aujourd'hui | À poser | Lab |
|---|---|---|---|---|
| impact-209 | Coiffure | `BlurThrough` sur un mot | `TrackingCollapse` + `CrossPush` | `/hero-labs-2#ink` |
| impact-309 | Tatouage | `BlurThrough` plein cadre | `CrossPush` | `/hero-labs-2#ink` |
| impact-248 | Ostéopathe | `AnchoredBackdrop` | `MosaicPush` | `/hero-labs-2#dental` |
| impact-243 | Médecin | `AnchoredBackdrop` | `PortalZoom` (l'entrée du cabinet) | `/hero-labs-2#portal` |
| impact-84 | Clinique | `AnchoredBackdrop` | `MosaicPush` | `/hero-labs-2#dental` |
| impact-90 | Boulangerie | Split + pastilles | `PanelDrop` | `/hero-labs-2#coffee` |
| impact-213 | Maçonnerie | `GhostSolid` | `HardCutRebuild` + `FixedRail` | `/hero-labs-2#gym` |
| impact-266 | Mariage | `AnchoredBackdrop` | `PortalZoom` | `/hero-labs-2#portal` |
| impact-83 | Joaillerie | `LineMask` | `LineScroll` | `/hero-labs-2#couture` |

Thèmes non encore traités, du plus faible au moins faible (scores dans
[AUDIT_VENDABILITE_2026-07-30.md](AUDIT_VENDABILITE_2026-07-30.md)) :

| Thème | Métier | À poser |
|---|---|---|
| impact-149 | Spa | `TrackingCollapse` (le mot du soin) |
| impact-53 | Création | `DifferentialExit` |
| impact-49 | Éducation | `StickyProgress` sur le cursus |
| impact-120 | Parfumerie | `HeldSwap` — déjà posé, à conserver |
| impact-47 | Fleuriste | `HeldSwap` — déjà posé, à conserver |
| impact-131 | Cave | `HeldSwap` + arche — déjà posé, à conserver |
| impact-147 | Avocat | `WordFlight` — déjà posé, à conserver |
| impact-108 | Comptabilité | `WordFlight` — déjà posé, à conserver |
| impact-50 | Psychologue | `PanelRise` |
| impact-72, 169 | Garage, restaurant | Cibles à redéterminer : le registre annonce le mauvais métier |

**Chaque métier qui a plus de trois thèmes doit finir avec au moins trois
signatures distinctes.** C'est le critère de réussite, pas le nombre de thèmes
touchés.

## Deux pièges connus

- **`registry.ts` annonce le mauvais métier** pour une partie du catalogue.
  impact-119 y est « IronX Fitness / Sports » alors que la page est une infra
  cloud ; impact-109 « conseil » est un site audio ; impact-169 « restaurant »
  un magazine. Lire la page, jamais le registre.
- **Le serveur de développement meurt** sous un balayage des 315 routes
  (Turbopack compile à la demande et ne rend pas la mémoire). Pour tout audit
  de masse : `npm run build && npx next start`, et un seul balayage à la fois.
