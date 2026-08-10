# Les pages annexes — 10 août 2026

Ce que le client remplit, et ce que ses **pages annexes** affichent. Chaque
chiffre vient d'une mesure au navigateur, pas d'une lecture du code.

Le chantier précédent portait sur les sections de la page d'accueil. Celui-ci
part d'une question posée autrement : « si c'est un e-commerce, tu puisses
mettre ses produits ; un thème d'événements, sa billetterie ». La réponse
était non, sur trois plans.

## Ce qui manquait

| Défaut | Ampleur mesurée | Après |
|---|---|---|
| Listes de pages annexes ne lisant rien du client | 111 pages, 253 listes | 58 câblées, 99 laissées au thème sur décision |
| Sections affichées sans question au formulaire | 216 thèmes, 174 blocs | 0 |
| Session perdue au premier clic de navigation | 820 fichiers | 0 sur 313 thèmes qui naviguent |
| Thèmes qui s'écroulent au changement de vue | 4 thèmes, 9 hooks | 0 |
| Carte du restaurant restée en démonstration | impact-99, 5 pages | 0 |
| Adresse à moitié vraie | impact-14, 4 pages | 0 |
| Commandes tactiles sous le seuil du doigt | 235 pages | 0 |
| Vulnérabilités de l'arbre livré | 8 dont 6 hautes | 0 |

## Les trois groupes de listes

Sur 447 pages annexes, **quinze** appelaient une fonction du contrat.

- **A — 33 listes.** La page d'accueil câble une liste du même nom : sa
  décision, déjà prise et vérifiée, est reprise à l'identique. Les pages
  annexes ont été fabriquées en recopiant les constantes de l'accueil —
  `impact-10/blog` déclare `ROOMS`, `SERVICES`, `STATS`.
- **B — 99 listes.** Mêmes constantes que l'accueil, jamais câblées là-bas non
  plus : navigation, spécifications techniques, journaux de bord. Au thème.
- **C — 25 listes.** Nées sur la page annexe, sans modèle nulle part.
  Appariement écrit à la main après lecture des clés réelles : cours et
  formateurs d'une école, praticiens et soins d'un cabinet, ateliers et avis
  d'un torréfacteur, studios d'un label, visites d'un domaine.

## `capabilities.ts` pilote le formulaire, pas seulement la mesure

La table alimente `ThemeBlocks` — ce que le wizard propose de remplir — et
`MissingInfo`, les manques signalés dans l'aperçu. Elle filtre **aussi** les
vérifications de `qa-sections`. 216 thèmes appelaient une fonction du contrat
pour un bloc non déclaré : la section s'affichait, le client n'était jamais
invité à la remplir, et la mesure ne la regardait pas. Un rapport « 0 muette »
qui ne portait que sur ce qu'il restait.

Complétée **sur preuve seulement** — mesure au navigateur, blocs forcés :
174 blocs ajoutés sur 154 thèmes. Sur les 90 déclarations restées muettes,
82 étaient des imports jamais appelés et 8 des sections mortes.

## Ce que personne n'avait fait : cliquer

Toutes les campagnes chargeaient chaque page avec `?session=` dans l'adresse.
Aucune ne cliquait. Deux familles de défauts en sont restées invisibles, que le
premier clic d'un visiteur déclenche :

1. **La session ne survivait pas à la navigation interne.** La page d'arrivée
   revenait à la démonstration. Retenue par thème désormais
   (`sessionStorage`, clé `apercu-session:<theme>`) — par thème, sinon une
   session d'aperçu contaminerait la galerie visitée ensuite.
2. **Un hook React appelé dans le JSX démonte toute la page.** `y: useTransform(…)`
   dans un style n'est appelé que tant que la vue qui le porte est rendue ;
   elle disparaît, React lève #300. Le pire, impact-48 : le hook était dans un
   `.map()`, donc le nombre de hooks suivait la longueur d'une liste qui porte
   la donnée du client. Un client avec trois pièces au lieu de quatre faisait
   tomber la page — le câblage avait rendu ce défaut atteignable.

## Le responsive, mesuré pour la première fois sur les annexes

447 pages à 390 px, avec la donnée du client :

- **0** page qui défile horizontalement ;
- **0** texte du client hors écran ;
- **0** texte du client amputé.

La mise en page tient déjà — c'est l'acquis des passes globales. Le témoin de
contrôle le confirme : un nom de deux cents lettres ne déborde nulle part, et
un débordement injecté volontairement est bien détecté.

Restait le tactile. L'instrument annonçait 446 cibles trop petites sur
235 pages ; l'exception d'espacement de WCAG 2.5.8 en écarte la quasi-totalité
— une cible de 22 px espacée de 36 px se vise sans erreur. Le vrai défaut, une
fois le bruit retiré : des menus burger à 20 × 22 px et des liens de pied de
page à 14 px de haut. Corrigés par du rembourrage compensé d'une marge
négative : **0 bloc déplacé, hauteur de page identique au pixel**.

## Les dépendances

L'arbre livré passe de 8 vulnérabilités à 0. `sharp` 0.34.5 portait quatre CVE
libvips sur le chemin des photos que le client téléverse ; `undici` 6.27.0
arrivait par `@vercel/blob`. `shadcn` était déclaré en dépendance de production
alors qu'aucun fichier ne l'importe : il traînait trois paquets vulnérables
dans l'arbre livré.

Vérifications avant installation : dates de publication de chaque version
cible, hooks d'installation de l'arbre en place, archives extraites et
fouillées (exfiltration, `eval(atob(`, jetons), puis `npm ci` depuis le verrou.
Les 4 vulnérabilités restantes vivent dans `eslint`, `puppeteer` et `shadcn`,
jamais livrés.

## Ce que la démonstration garde, et pourquoi

`qa-demo-residuelle.mjs` part de la page et non du code : on remplit tout ce
que le formulaire propose, et l'on relève ce que la démonstration continue
d'afficher. C'est l'instrument qui manquait — les autres partaient du contrat
(« telle section lit-elle telle fonction ») et ne voyaient donc que ce qui
était déjà câblé.

59 listes ont survécu à un profil complet. **31 ont été câblées** : ce que le
client vend (boutique, collections, montres, flotte, matériaux, menus, vins),
ce qu'il propose (chambres, espaces, spécialités, missions, secteurs,
destinations, expériences, projets, formules, fonctionnalités), qui il est
(quatre équipes), ce qu'il organise (les événements), ses distinctions.

**28 restent au thème, par décision assumée** : étapes d'une méthode, valeurs
d'une maison, piliers, jalons d'histoire, signaux de confiance, options de
mouture d'un torréfacteur, gestes d'un savoir-faire. Un client ne les saisit
nulle part et ne le devrait pas — elles font le modèle. Deux cas regardés puis
laissés : `impact-29/contact` porte déjà l'e-mail du client, ses autres entrées
sont des comptes GitHub et LinkedIn que le formulaire ne collecte pas ;
`impact-32/services` liste les assurances acceptées d'un vétérinaire, un fait
d'entreprise sans champ correspondant.

## Les garde-fous ajoutés

- `check-hooks-dans-jsx.mjs` — un hook en valeur de propriété d'objet. 0/373.
- `check-variables-contrat.mjs` — une variable de module employée sans être
  déclarée. `@ts-nocheck` laisse compiler, la page disparaît au premier rendu.
  0/373.
- `qa-navigation-session.mjs` — clique le premier lien interne et vérifie que
  le client tient. Témoin par `TEMOIN=1`, qui neutralise le `sessionStorage`.
- `qa-annexes-responsive.mjs` — téléphone, avec témoin de nom long.
- `qa-demo-residuelle.mjs` — part de la page et non du code : ce que la
  démonstration continue d'afficher quand le client a tout rempli.

## Ce que les instruments ont failli me faire croire

Chaque chiffre de ce document a d'abord été faux une fois.

- Le croisement table/code comptait les lignes d'`import` comme des appels :
  82 sections muettes fictives.
- Le premier détecteur de hooks remontait 124 lignes presque toutes légitimes.
- Le détecteur de cibles tactiles ignorait l'exception d'espacement : 446 au
  lieu de 8 — le vrai défaut noyé dans le bruit.
- `check-variables-contrat` accusait impact-314 faute de reconnaître les
  déclarations déstructurées.
- Et j'ai compilé pendant une mesure pour la troisième fois : les « 980 px »
  d'une campagne étaient mon propre build, pas un défaut du produit.
