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
| 331 | opticien | `editorial` | à faire |
| 332 | serrurier | `bandeau` | à faire |
| 333 | notaire | `carte` | à faire |
| 334 | cuisiniste | `splitgauche` | à faire |
| 335 | pompes funèbres | `typo` | à faire |
| 336 | pharmacie | `diagonale` | à faire |
| 337 | assurance | `liste` | à faire |
| 338 | assurance | `devanture` | à faire |
| 339 | audioprothésiste | `pleincadre` | à faire |
| 340 | audioprothésiste | `typo` | à faire |
| 341 | auto-école | `editorial` | à faire |
| 342 | auto-école | `bandeau` | à faire |
| 343 | pressing | `carte` | à faire |
| 344 | pressing | `splitgauche` | à faire |
| 345 | commerce de bouche | `chiffre` | à faire |
| 346 | commerce de bouche | `diagonale` | à faire |
| 347 | formation | `liste` | à faire |
| 348 | formation | `devanture` | à faire |
| 349 | contrôle technique | `pleincadre` | à faire |
| 350 | contrôle technique | `typo` | à faire |
| 351 | couvreur | `editorial` | à faire |
| 352 | couvreur | `bandeau` | à faire |
| 353 | crèche | `carte` | à faire |
| 354 | crèche | `splitgauche` | à faire |
| 355 | infirmier | `chiffre` | à faire |
| 356 | infirmier | `diagonale` | à faire |
| 357 | laboratoire | `liste` | à faire |
| 358 | laboratoire | `devanture` | à faire |
| 359 | location matériel | `pleincadre` | à faire |
| 360 | location matériel | `typo` | à faire |
| 361 | peintre | `editorial` | à faire |
| 362 | peintre | `bandeau` | à faire |
| 363 | podologue | `carte` | à faire |
| 364 | podologue | `splitgauche` | à faire |
| 365 | producteur | `chiffre` | à faire |
| 366 | producteur | `diagonale` | à faire |
| 367 | sage-femme | `liste` | à faire |
| 368 | sage-femme | `devanture` | à faire |
| 369 | salle de réception | `pleincadre` | à faire |
| 370 | salle de réception | `typo` | à faire |
| 371 | sécurité | `editorial` | à faire |
| 372 | sécurité | `bandeau` | à faire |
| 373 | VTC | `carte` | à faire |
| 374 | VTC | `splitgauche` | à faire |
| 375 | vitrier | `chiffre` | à faire |
| 376 | vitrier | `diagonale` | à faire |
| 377 | école de musique | `liste` | à faire |
| 378 | gestion de patrimoine | `devanture` | à faire |
| 379 | menuisier | `pleincadre` | à faire |
| 380 | brasserie | `typo` | à faire |
| 381 | caviste | `editorial` | à faire |
| 382 | recrutement | `bandeau` | à faire |
| 383 | toiletteur | `carte` | à faire |

Deux écarts assumés à la rotation : `335` (pompes funèbres) reçoit `typo` et
non `chiffre` — un montant en énorme sur une page d'obsèques serait déplacé ;
`329` reçoit `chiffre` et non `liste`, parce que la page porte déjà ses trois
formules en bandes à `#formules` et qu'un héros-liste les redirait.

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
