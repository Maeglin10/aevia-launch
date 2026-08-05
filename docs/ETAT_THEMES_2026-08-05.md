# État des 373 thèmes — 5 août 2026

Ce que la mesure dit, pas ce que le code laisse croire. Chaque chiffre vient d'un
audit au navigateur : chaque thème reçoit **sa propre entreprise** — nom, ville,
métier, couleur, prestations, tarifs, avis, chiffres, équipe, questions, horaires,
adresse, réalisations — et ses propres images tirées des banques, puis l'on
regarde la page rendue.

## L'état

| mesure | résultat |
|---|---|
| thèmes affichant tous les blocs qu'ils déclarent | **373 / 373** |
| thèmes affichant les photos du client | **373 / 373** (50 n'ont aucun emplacement photo) |
| thèmes peignant la couleur du client | **352 / 373** (21 sont monochromes par dessein) |
| thèmes sans aucun reste de démonstration | **301 / 373** |
| pages plantées | **0** |
| sections sans aucune entrée client | **136 / 3033** (4 %) |
| retouches de section offertes au client | **2235 sur 371 thèmes** |

Détail thème par thème : [PERSONNALISATION_PAR_THEME.md](PERSONNALISATION_PAR_THEME.md).

## Les trois vrais défauts trouvés par la mesure

Ils ne se voyaient pas dans le source. Ils ne se voyaient qu'en donnant à chaque
thème une entreprise différente de celle qu'il montre.

**Le carrousel qui lit au-delà de la liste.** La rotation automatique vit dans un
`useEffect(…, [])` : la liste qu'elle capture est celle du premier rendu, avant
l'arrivée de la session — quatre témoignages de démonstration. L'index monte à
trois, la session arrive, la liste tombe au seul avis que le client a saisi, et
`TESTIMONIALS[3].stars` n'existe plus. Deux thèmes plantaient, dix-sept portaient
le montage. Chaque `LISTE[index]` est devenu `LISTE[index % LISTE.length]`.

**L'adresse d'image vide.** `img: b.afterUrl ?? b.beforeUrl ?? demo` — `??` ne
rattrape que `null` et `undefined`, pas la chaîne vide. Le client qui décrit une
réalisation sans en fournir la photo obtenait des images sans source : **ses
photos disparaissaient au moment où il donnait le plus d'informations.** Cent onze
adresses sur cinquante-cinq thèmes sont passées à `||`.

**Le prix du client remisé.** Trois thèmes calculent un tarif annuel à partir du
prix affiché. `parseInt("137 €")` vaut 137 : la tarification du client sortait
remisée de vingt pour cent, ou en `NaN€` quand le thème refaisait `Number()`. Le
calcul ne s'applique plus qu'aux prix écrits comme le thème écrit les siens.

## Ce que le client peut changer

Le wizard recueille la donnée structurée — prestations, tarifs, avis, chiffres,
équipe, questions, horaires, adresse, zones, labels, photos, couleur, identité
légale — et **s'adapte à sa niche** : les 68 niches mènent à l'un des huit
archétypes, et chaque archétype demande ce que ses thèmes affichent.

La prose passe par les retouches de section : chaque titre, chaque texte, chaque
liste de libellés porte une clé stable que le panneau d'édition de l'aperçu
déroule. **Laisser un champ vide rend au thème son texte d'origine.**

Les images viennent des photos du client, ou des deux banques — Pexels et
Pixabay, interrogées ensemble et alternées pour que deux clients du même métier
ne tombent pas sur la même.

## Ce qui reste, et pourquoi

- **10 accroches animées** — le titre du hero est découpé lettre par lettre. Y
  injecter la phrase du client la collait en un seul mot : « VOTREPLOMBIERÀANNECY ».
  Le titre reste celui du thème, l'accroche prend la ligne juste dessous.
- **21 thèmes monochromes** — leur palette est faite de noirs, de blancs et de
  gris. Il n'y a pas d'accent à recolorer, et en inventer un abîmerait le dessin.
- **72 thèmes gardent une ville dans leurs exemples** — « ÉQUIPEMENT PUBLIC ·
  BORDEAUX, 33 » sous une réalisation, « ESTP Paris » dans une biographie. Ce
  sont les projets de démonstration, que le client remplace en fournissant les
  siens ; la règle du catalogue est de garder l'exemple tant qu'il n'a rien donné.
- **136 sections sans entrée client** (4 %) — pour la plupart des galeries et des
  vues de détail dont le texte vit dans un `.map` sur les données d'exemple du
  thème, et trente-quatre sections sans aucun texte : conteneurs, décors animés,
  séparateurs.

## Les pièges de la mesure

Quatre conclusions fausses ont été tirées avant d'être corrigées. Elles portent
toutes la même leçon : **l'instrument ment plus souvent que le code.**

- **Reconstruire pendant une mesure** remplace `.next` sous le serveur en marche :
  les 373 thèmes paraissent d'un coup ne plus rien afficher.
- **Remonter en haut de page avant de lire** remet à zéro un compteur animé sorti
  du champ. Le texte se récolte maintenant pendant la descente.
- **Ne regarder que l'accueil** manque les thèmes qui réservent leurs photos à
  leurs vues intérieures. La mesure y descend quand l'accueil n'en montre aucune.
- **Conclure au premier essai** : cinq tranches mesurent en parallèle, une page
  n'a parfois rien rendu à l'échéance, et une page vide fait manquer tous les
  blocs à la fois. Trois essais, le nom de l'entreprise pour témoin.

## Les outils

    node scripts/final-audit.mjs --tranche 0 5   # une entreprise par thème
    node scripts/section-audit.mjs               # sections sans entrée client
    node scripts/rapport-personnalisation.mjs /tmp/fic*.json
    node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Dupont" "Lyon"
    node scripts/check-frozen.mjs                # appels gelés à l'import

Après toute passe de câblage, enchaîner `check-frozen`, `unfreeze-module-calls`,
`fix-partial-session`, `order-session-vars`, `order-live-calls`, puis rebâtir,
redémarrer le serveur, et seulement ensuite mesurer.
