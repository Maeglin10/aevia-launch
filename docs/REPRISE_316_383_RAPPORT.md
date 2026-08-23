# Reprise des thèmes 316–383 — ce qui a été fait, et ce qui a été mesuré

**Branche** : `claude/prompt-reprise-themes-316-383-y5lfwc` · **Plan** :
[REPRISE_316_383_PLAN.md](REPRISE_316_383_PLAN.md)

Ce document dit ce que les pages font, pas ce que le code semble faire. Tout
chiffre ci-dessous vient d'une mesure ou d'une capture regardée.

## Le point de départ

66 thèmes (316–383 ; 320 et 323 n'existent pas), en deux familles :

- **8 thèmes legacy** (316-319, 321-322, 324-325) d'avant les hero-kits :
  animations maison, câblage minimal, pas de `LegalIdentity`.
- **58 thèmes** (326-383) sur un squelette unique : 31 en split
  `1.08fr/0.92fr`, 16 en centré 1080, même ordre de sections, **16 palettes
  recyclées à l'identique** — six thèmes partageaient le même teal, cinq le
  même orange sombre. Trois paires étaient des jumeaux stricts : 336/378,
  339/367, 344/362 (mêmes props exactement).

Le câblage était creux là où il compte : `clientHours`, `clientSiret`,
`clientAreas`, `clientMenu`, `clientProducts`, `clientPayments`,
`clientCodePostalVille`, `memoriserSession` à **zéro usage** sur les 66 ;
`clientPhone` employé une fois, `clientBookingUrl` une fois, `clientEmail`
trois fois. Les thèmes lisaient `fd?.phone` en dur.

## Ce qui a changé

Chaque thème reçoit un **archétype de héros** (dix formes : split média
droite ou gauche, plein cadre titre bas, éditorial décalé, rail latéral,
typographique sans photo, magazine, bento, double colonne à rail de chiffres,
média clippé), une **paire de fontes** aux rôles opposés parmi douze, une
**palette dédoublonnée**, et un **dessin de sections** qui lui est propre —
prestations en rangées numérotées, en bento ou en colonnes filetées ; tarifs
en table fine, en bandes ou en billets perforés ; avis en spotlight, en
marquee ou en colonnes décalées.

Les gestes sont redistribués : aucun n'est employé plus de trois fois sur les
66, aucun métier n'en répète un, et quand deux thèmes partagent un geste, son
*application* diffère — l'objet de l'`ArcSwap`, la forme du `PortalZoom`, le
sujet du `CrossPush`.

## Ce que la mesure a trouvé

Le harnais (`scripts/qa-reprise.mjs`) crée une session client complète, coupe
les banques d'images et mesure aux deux tailles. Les défauts ci-dessous ont
tous été vus à l'écran ou dans le DOM, aucun par lecture du code.

| Défaut | Où | État |
|---|---|---|
| Ville écrite deux fois dans le sur-titre | 318, 319 | corrigé |
| Prix du client jamais employés là où le thème en affiche | 317, 329 | corrigé |
| Ni téléphone ni adresse du client affichés | 321 | corrigé |
| Blocs affichés mais jamais demandés au client | 10 thèmes, 27 blocs | corrigé |

Le dernier est le plus coûteux : `impact-324` et `impact-325` peignaient
prestations, avis, chiffres, engagements, réalisations et tarifs sans qu'aucun
de ces blocs ne soit déclaré dans `capabilities.ts`. Le wizard ne les
demandait donc pas, et ces sections restaient en démonstration sur un site
livré.

## L'instrument a menti avant le produit

`innerText` rend le texte **tel qu'il est peint** : une section en
`text-transform: uppercase` renvoie « ZINGUERIE », pas « Zinguerie ». Le
harnais comparait à la casse près et a compté trois thèmes « sans prestations
ni avis » alors qu'ils les affichaient parfaitement — vérifié en listant le
contenu réel des sections de `impact-318`. La comparaison ignore désormais la
casse, les accents et les espaces fines des nombres.

C'est la même leçon que les cinq pannes de mesure du 7 août : l'outil ment
plus souvent que le produit, et un « aucun défaut » se vérifie avant de se
croire.

## Les photographies

Le mandataire du conteneur bloque `images.unsplash.com` et
`images.pexels.com`. Aucune URL n'a donc été inventée — c'est vérifié
automatiquement, thème par thème, en comparant les identifiants d'images
présents avant et après réécriture : **zéro ajout**. Les emplacements
supplémentaires portent un repli dessiné en CSS (trames, halos, cadrans,
nuanciers, horizons), et toute section plein cadre porte
`background: C.bgDark` pour rester lisible sans photo.

Il ne reste donc que les images à poser.

## Comment vérifier soi-même

```bash
npm run build && SESSIONS_RATE_LIMIT=1000000 npx next start -p 3000
node scripts/qa-reprise.mjs impact-316 impact-317 --sortie /tmp/vue
node scripts/aligner-capabilites.mjs          # rapport seul, --ecrire pour appliquer
```

Le harnais pointe sur le navigateur du conteneur (`/opt/pw-browsers/chromium`),
la version que Playwright réclame n'étant pas celle qui est installée.

## État par thème

**23 août — le balayage final des 19 derniers thèmes de la reprise** (351,
354, 363, 365-366, 368-369, 372-383), session client réelle, photos coupées,
deux tailles : **19/19 sans panne, sans débordement horizontal, et sans aucun
marqueur client manquant** — nom, ville, prestations, tarifs, avis, chiffres,
téléphone, courriel, adresse et SIRET portés partout. Captures regardées sur
les remaniements du jour (354 : H4 décalé conforme, pastille soleil, rail de
chiffres ; 381 : plein cadre voûte lisible sans photo, compteur et marque
client en place). Sur 373 et 382, le titre du thème est conservé quand
l'accroche du client ne tient pas dans le gabarit : c'est la règle du contrat
(le dessin passe avant), et le nom du client est porté partout ailleurs.

Avec les 13 premiers thèmes mesurés au premier jour et les 34 vérifiés par
lots intermédiaires, **la reprise des 66 est vérifiée à l'écran de bout en
bout.**
