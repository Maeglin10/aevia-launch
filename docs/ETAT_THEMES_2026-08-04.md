# État des 373 thèmes — 4 août 2026

Ce que la mesure dit, pas ce que le code laisse croire. Chaque chiffre vient d'un
balayage au navigateur : une session est semée avec des valeurs témoins
improbables, chaque thème est ouvert, et l'on regarde ce qui apparaît vraiment
dans le texte de la page.

## Progression

| balayage | thèmes sans aucun manque | ce qui a bougé |
|---|---|---|
| 1 | 156 / 373 | état après le câblage des listes |
| 2 | 263 | accroche du hero, nom d'entreprise |
| 3 | 281 | projections `target/suffix`, `q/n/l`, `prenom/titre` |
| 4 | 302 | le contrat recevait `{ formData: fd }` seul — 27 thèmes |
| 5 | 313 | grilles tarifaires |
| 6 | 324 | dégel des constantes de module, crash impact-24 |
| 7 | 331 | l'en-tête vit dans `layout.tsx` sur 62 thèmes |
| 8 | 335 | 557 sous-pages reliées à la session |
| 9 | 335 | ville de démonstration dans le texte |
| 11 | 337 | ordre des recalculs, mentions légales |
| 12 | 341 | tarifs, manifestes corrigés |
| 13 | 348 | la ville d'exemple sur la moitié du catalogue qui ne la nommait pas |

## Ce qui a coûté le plus cher

**L'en-tête n'est pas dans `page.tsx`.** Soixante-deux thèmes le rendent dans
leur propre `layout.tsx`. La page a perdu le sien — impact-30 le dit en
commentaire — et six balayages durant, le nom du client a été écrit dans un bloc
que plus personne n'affichait. La mesure disait « le nom n'apparaît pas » sans
dire dans quel fichier il aurait dû l'être.

**Le contrat recevait un tiers de la session.** `clientServices({ formData: fd })`
ne renvoie jamais rien : les prestations vivent sous `businessProfile.services`.
Vingt-sept thèmes, quarante appels.

**L'ordre des lignes.** Trois lignes doivent se suivre — la session arrive, le
recalcul la lit, le consommateur lit le recalcul — et chaque passe de câblage
insérait la sienne juste après `fd`, sans regarder les autres. Cent trente-huit
fichiers.

**Les constantes de module.** Une passe qui câble `const courses = resolveList(…)`
produit une valeur figée à l'import, quand `fd` vaut encore `null`. Six grilles
tarifaires étaient mortes-nées le lendemain de leur câblage. `check-frozen.mjs`
surveille ça maintenant.

## Ce qui reste

Vingt-cinq thèmes ont encore un manque, aucun bloquant :

- **13 accroches** — le titre du hero est découpé lettre par lettre ou mot par mot
  par un composant d'animation. Y injecter une chaîne casserait le thème ; son
  accroche d'origine reste, tout le reste de la page est au client.
- **5 avis, 2 auteurs** — listes lues par index plutôt que par `map`.
- **3 tarifs, 2 prestations, 1 nom** — formes qui ne se ramènent à aucune des
  règles écrites ; à traiter à la main.

## Le test client

`scripts/client-run.mjs` traverse le wizard comme un client — clics, saisie,
téléversement d'une photo — et lit ce qui s'affiche sur l'aperçu. Onze métiers
passés : le nom, la ville et l'accroche s'affichent dans tous les cas, aucune page
ne plante, et plus aucune adresse e-mail de démonstration ne subsiste.

## Outils de mesure

    node scripts/theme-audit.mjs --range 1 40     # ce qu'un thème affiche vraiment
    node scripts/client-run.mjs "Santé" "Dentiste" "Cabinet Dupont" "Lyon"
    node scripts/check-frozen.mjs                 # appels gelés à l'import

Le balayage complet se lance en cinq tranches parallèles ; il dure une demi-heure.
**Ne jamais reconstruire pendant une mesure** : `.next` est remplacé sous le
serveur en marche et les 373 thèmes paraissent d'un coup ne plus rien afficher.
