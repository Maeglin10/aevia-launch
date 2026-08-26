# Chantier « les thèmes se ressemblent tous » — les héros de 329 à 383

Relevé du 25 août 2026, branche `claude/prompt-reprise-themes-316-383-y5lfwc`.

## Ce qui se ressemblait

Pas les couleurs, pas les polices : elles sont variées. La **composition du
haut de page**, la seule chose qu'un visiteur voit avant de juger. Vérifié à
l'écran, pas à la jauge — `impact-373` et `impact-382` capturés côte à côte
sont la même page à la teinte près :

    sur-titre en capitales espacées
    titre serif sur deux lignes
    paragraphe de trois lignes, largeur 560
    bouton plein + bouton contour
    rangée « 01 / 03 · mot-clé · flèches »
    la moitié droite de l'écran vide

Trois thèmes portent même le conteneur au caractère près :
`padding: "140px 64px 70px", maxWidth: 1080`.

Les **animations ne sont pas en cause** : 26 figures différentes employées,
aucune au-dessus de 7 %. Rien à corriger de ce côté.

## Les dix archétypes

| clé | ce qu'on voit en premier |
|---|---|
| `devanture` | colonne centrée, la façade au centre, le texte dessous |
| `pleincadre` | la photographie occupe tout, le texte posé en bas |
| `typo` | pas d'image du tout, le titre remplit l'écran |
| `editorial` | rangée de méta en haut, titre, colonnes de texte |
| `bandeau` | texte compact en haut, bandeau image large en bas |
| `carte` | une carte flottante qui déborde sur l'image |
| `splitgauche` | image à gauche, texte à droite — l'inverse de l'habitude |
| `chiffre` | un montant ou un nombre tient la place du titre |
| `diagonale` | partage en biais, deux masses asymétriques |
| `liste` | la liste des prestations d'emblée, pas de héros séparé |

## Règle de voisinage

Deux thèmes **voisins** (n et n+1) ne portent jamais le même archétype — ce
sont eux qu'un client compare côte à côte, et souvent le même métier
(`337`/`338` assurance, `339`/`340` audioprothésiste, `375`/`376` vitrier…).
La rotation de dix garantit aussi qu'un archétype ne revient qu'à dix crans
d'écart, et jamais avec les mêmes proportions.

## Attribution

| thème | métier | archétype | état |
|---|---|---|---|
| 328 | pompes funèbres | `pleincadre` | fait avant ce chantier |
| 329 | déménageur | `chiffre` | fait |
| 330 | pharmacie | `devanture` | fait avant ce chantier |
| 331 | opticien | `editorial` | fait |
| 332 | serrurier | `bandeau` | fait |
| 333 | notaire | `carte` | fait |
| 334 | cuisiniste | `diagonale` | fait |
| 335 | pompes funèbres | `typo` | fait |
| 336 | pharmacie | `liste` | fait |
| 337 | assurance | `devanture` | fait |
| 338 | assurance | `chiffre` | fait |
| 339 | audioprothésiste | `splitgauche` | fait |
| 340 | audioprothésiste | `pleincadre` | fait |
| 341 | auto-école | `bandeau` | fait |
| 342 | auto-école | `carte` | fait |
| 343 | pressing | `editorial` | fait |
| 344 | pressing | `diagonale` | fait |
| 345 | commerce de bouche | `chiffre` | fait |
| 346 | commerce de bouche | `devanture` | fait |
| 347 | formation | `liste` | fait |
| 348 | formation | `typo` | fait |
| 349 | contrôle technique | `pleincadre` | fait |
| 350 | contrôle technique | `editorial` | fait |
| 351 | couvreur | `bandeau` | fait |
| 352 | couvreur | `carte` | fait |
| 353 | crèche | `devanture` | fait |
| 354 | crèche | `diagonale` | fait |
| 355 | infirmier | `chiffre` | fait |
| 356 | infirmier | `typo` | fait |
| 357 | laboratoire | `liste` | fait |
| 358 | laboratoire | `devanture` | fait |
| 359 | location matériel | `pleincadre` | fait |
| 360 | location matériel | `editorial` | fait |
| 361 | peintre | `bandeau` | à faire |
| 362 | peintre | `carte` | à faire |
| 363 | podologue | `splitgauche` | à faire |
| 364 | podologue | `diagonale` | à faire |
| 365 | producteur | `chiffre` | à faire |
| 366 | producteur | `typo` | à faire |
| 367 | sage-femme | `liste` | à faire |
| 368 | sage-femme | `devanture` | à faire |
| 369 | salle de réception | `pleincadre` | à faire |
| 370 | salle de réception | `editorial` | à faire |
| 371 | sécurité | `bandeau` | à faire |
| 372 | sécurité | `carte` | à faire |
| 373 | VTC | `splitgauche` | à faire |
| 374 | VTC | `diagonale` | à faire |
| 375 | vitrier | `chiffre` | à faire |
| 376 | vitrier | `typo` | à faire |
| 377 | école de musique | `liste` | à faire |
| 378 | gestion de patrimoine | `devanture` | à faire |
| 379 | menuisier | `pleincadre` | à faire |
| 380 | brasserie | `editorial` | à faire |
| 381 | caviste | `bandeau` | à faire |
| 382 | recrutement | `carte` | à faire |
| 383 | toiletteur | `splitgauche` | à faire |

Trois écarts assumés à la rotation, pour ne pas plier un métier à un tableau :

- `335` (pompes funèbres) reçoit `typo` et non `chiffre` — un montant écrit en
  énorme sur une page d'obsèques serait déplacé.
- `329` reçoit `chiffre` et non `liste`, parce que la page porte déjà ses trois
  formules en bandes à `#formules` et qu'un héros-liste les redirait.
- `334` reçoit `diagonale` et non `splitgauche` : son héros portait **déjà**
  l'image à gauche. Reconduire l'archétype qu'il avait n'aurait rien changé —
  c'est exactement l'erreur des trois thèmes dits « superficiels », à qui on
  n'avait donné qu'un nouveau sur-titre.
- `346` (fromager) reçoit `devanture` et non `typo` : son héros est déjà
  sans photographie — quatre tuiles de texte — et lui donner `typo` aurait
  reconduit ce qu'il avait, l'erreur des thèmes dits « superficiels ». Les
  tuiles deviennent une vitrine alignée sous un titre centré. `348`
  (organisme de formation) prend `typo` à sa place.
- `351` prend `bandeau` alors qu'il venait d'être passé en plein cadre : le
  plein cadre est déjà porté par `349`, à deux crans, et par `340`. Sa
  photographie reste au-dessus de la ligne de flottaison, ce qui était le
  point de sa réécriture précédente.
- `353` (micro-crèche) reçoit `devanture` et non `splitgauche` : son héros
  posait DÉJÀ l'image à gauche et le texte à droite. Même raison que `334`.
- `339` et `340` échangent : `340` porte déjà une photographie de client dans
  son héros et sait se replier sur une courbe de gain dessinée, il prend donc
  `pleincadre` ; `339` n'a pas d'image du tout — son orbe de particules passe
  à gauche, à fond perdu, et `343` récupère `editorial`.

## Ce qu'on supprime partout

- la deuxième ligne de titre en italique d'une autre couleur ;
- la fraction « 01 / 03 » **dans le héros** (elle reste licite plus bas) ;
- le duo bouton plein + bouton contour comme réflexe.

## Ce qu'on garde intact

Tout le câblage client : `clientEyebrow`, `clientHeroLine`,
`clientHeroSubtitle`, `clientText`, `c?.heroHeadline`, `c?.heroSubline`,
`CtaBtn`/`CtaButton`, `mail`/`telHref`, `photo(i, …)`, `fd?.photoUrls`.

## Les outils

    node scripts/voir-hero.mjs 329-343     capture 1280 + 390, débord, erreurs
    node scripts/poser-hero.mjs 329 bloc   remplace le héros PAR LIGNES
    node scripts/sequence-hero.mjs 328 383 la suite des blocs, par thème
    node scripts/charpente-hero.mjs        2 colonnes, image, centrage

`poser-hero.mjs` remplace un intervalle de lignes, jamais un motif : une
expression régulière non gourmande sur `\n}` s'arrête au `}: {` du typage,
laisse un résidu et casse le fichier. Deux thèmes y sont déjà passés.

Les jauges se sont trompées trois fois sur ce chantier (« 56 charpentes
distinctes », « italique 100 % », « 7 % »). **La capture est la seule
vérité** : chaque thème est regardé en 1280 et en 390 avant d'être compté
comme fait.
