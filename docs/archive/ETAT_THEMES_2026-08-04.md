# État des 373 thèmes — 4 août 2026

Ce que la mesure dit, pas ce que le code laisse croire. Chaque chiffre vient d'un
audit au navigateur : chaque thème reçoit sa propre entreprise — nom, ville,
métier, couleur, prestations, tarifs, avis, horaires, équipe — et ses propres
images tirées des banques, puis l'on regarde la page rendue.

## L'état

| mesure | résultat |
|---|---|
| thèmes affichant tous les blocs qu'ils déclarent | **352 / 373** |
| thèmes affichant les photos du client | **369 / 373** (56 n'ont aucun emplacement photo) |
| thèmes peignant la couleur du client | **351 / 373** (21 sont monochromes par dessein) |
| thèmes sans aucun reste de démonstration | **296 / 373** |
| pages plantées | **0** |
| sections sans aucune entrée client | **196 / 3033** (6 %), dont 65 sans texte visible |
| retouches de section offertes au client | **2210 sur 371 thèmes** |

## Le chemin

| balayage | thèmes sans manque | ce qui a bougé |
|---|---|---|
| 1 | 156 | état après le câblage des listes |
| 2 | 263 | accroche du hero, nom d'entreprise |
| 4 | 302 | le contrat recevait `{ formData: fd }` seul |
| 6 | 324 | dégel des constantes de module |
| 7 | 331 | l'en-tête vit dans `layout.tsx` sur 62 thèmes |
| 9 | 335 | ville de démonstration dans le texte |
| 13 | 348 | la ville sur la moitié du catalogue qui ne la nommait pas |
| 17 | 359 | constantes gelées dans les sous-pages |
| audit final | 352 | mesure plus sévère : une entreprise différente par thème |

Le dernier chiffre est plus bas que le précédent parce que la mesure a changé :
jusque-là les 373 thèmes recevaient la même session, ce qui masquait tout ce qui
ne s'affiche que pour un métier donné.

## Ce que le client peut changer

Le wizard recueille la donnée structurée — prestations, tarifs, avis, chiffres,
équipe, questions, horaires, adresse, zones, labels, photos, couleur, identité
légale — et **s'adapte à sa niche** : les 68 niches mènent à l'un des huit
archétypes, et chaque archétype demande ce que ses thèmes affichent.

La prose passe par les retouches de section : chaque titre, chaque texte, chaque
liste de libellés porte une clé stable que le panneau d'édition de l'aperçu
déroule. Laisser un champ vide rend au thème son texte d'origine.

Les images viennent des photos du client, ou des deux banques — Pexels et
Pixabay, interrogées ensemble et alternées pour que deux clients du même métier
ne tombent pas sur la même.

## Ce qui reste, et pourquoi

- **13 accroches** — le titre du hero est découpé lettre par lettre par un
  composant d'animation. Y injecter une chaîne casserait le thème ; c'est le
  sous-titre qui porte alors l'accroche du client.
- **21 thèmes monochromes** — leur palette est faite de noirs, de blancs et de
  gris. Il n'y a pas d'accent à recolorer, et en inventer un abîmerait le dessin.
- **77 thèmes gardent une ville dans leurs exemples** — « ÉQUIPEMENT PUBLIC ·
  BORDEAUX, 33 » sous une réalisation, « ESTP Paris » dans une biographie. Ce
  sont les projets de démonstration, que le client remplace en fournissant les
  siens ; la règle du catalogue est de garder l'exemple tant qu'il n'a rien donné.
- **65 sections sans texte** — conteneurs, décors animés, séparateurs. Il n'y a
  rien à y écrire.

## Les outils

    node scripts/final-audit.mjs --tranche 0 5   # une entreprise par thème
    node scripts/section-audit.mjs               # sections sans entrée client
    node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Dupont" "Lyon"
    node scripts/check-frozen.mjs                # appels gelés à l'import

Après toute passe de câblage, enchaîner `check-frozen`, `unfreeze-module-calls`,
`fix-partial-session`, `order-session-vars`, `order-live-calls`, puis rebâtir,
redémarrer le serveur, et seulement ensuite mesurer.

**Ne jamais reconstruire pendant une mesure** : `.next` est remplacé sous le
serveur en marche et les 373 thèmes paraissent d'un coup ne plus rien afficher.
