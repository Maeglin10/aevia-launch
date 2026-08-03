# Le contrat de contenu — ce que le thème sait montrer, ce que le wizard doit demander

Plan du chantier des 373 thèmes, écrit après mesure. À lire avant d'ouvrir un
seul fichier de thème.

## Ce que la mesure dit

373 thèmes déclarent **432 noms de constantes différents**. Le même concept
s'appelle `SERVICES_DEMO`, `SERVICES`, `FEATURES` ou `PRESTATIONS` ; les avis
sont `AVIS_DEMO`, `TESTIMONIALS_DEMO`, `TESTIMONIALS` ou `REVIEWS`.

C'est la cause première. Le `useEffect` présent dans une centaine de fichiers
devinait quatre noms (`SERVICES`, `services`, `FEATURES`, `features`) et ratait
tout le reste — et de toute façon il mutait des constantes de module sans
déclencher de rendu, donc ne produisait rien.

Répartition des concepts réellement présents :

| concept | thèmes | part |
|---|---|---|
| avis | 150 | 40 % |
| prestations | 139 | 37 % |
| chiffres clés | 120 | 32 % |
| navigation | 115 | 31 % |
| tarifs | 92 | 25 % |
| méthode / parcours | 90 | 24 % |
| hero à diapositives | 73 | 20 % |
| engagements / garanties | 69 | 18 % |
| réalisations | 38 | 10 % |
| FAQ | 35 | 9 % |
| équipe | 23 | 6 % |
| zones d'intervention | 12 | 3 % |
| produits, menu, horaires | ≤ 10 | ≤ 3 % |

Ces chiffres sous-estiment : beaucoup de thèmes portent leur contenu
directement dans le JSX plutôt que dans une constante nommée. Ils donnent
l'ordre de grandeur, pas le compte exact.

## Le principe

**Le client choisit un thème parce qu'il montre ce qu'il veut montrer.** Un
couvreur qui prend un thème avec une section « zones d'intervention » l'a choisi
pour ça. Si le wizard ne lui demande jamais ses zones, la section restera celle
de la démonstration — et aucun câblage dans le thème n'y changera rien, puisque
la donnée n'existe pas.

D'où l'ordre des opérations, qui n'est pas négociable :

1. **le thème déclare ce qu'il sait montrer** ;
2. **le wizard demande ce que le thème déclare**, en plus du socle commun ;
3. **le thème lit un contrat unique**, plus ses propres constantes.

Faire 3 sans 1 et 2, c'est câbler du vide.

## Le socle commun

Demandé à tous, quel que soit le thème ou le métier :

- identité : nom, accroche, description, ville, téléphone, e-mail, adresse
- **prestations avec leur tarif** — nom, prix, durée, description
  *(en place depuis le 2026-08-03 pour les 68 métiers ; il n'existait que pour
  11 d'entre eux)*
- photos
- avantages / ce qui les distingue

## Les blocs conditionnels

Demandés seulement si le thème choisi les affiche :

| bloc | ce qu'on demande |
|---|---|
| avis | témoignages réels : texte, auteur, ville. **Prioritaires sur ceux générés** |
| chiffres clés | valeur + libellé (ex. « 30 ans », « d'expérience ») |
| méthode | étapes numérotées, titre + description |
| engagements | garanties, certifications, labels |
| réalisations | photos avant/après ou chantiers, avec légende |
| FAQ | questions et réponses |
| équipe | nom, rôle, photo |
| zones | communes ou rayon d'intervention |
| horaires | jours et plages |
| menu / produits | catégorie, nom, prix, description |

## Les règles de contenu

Décidées le 2026-08-03, valables partout :

- **On n'invente pas.** Les témoignages du client passent devant ; la génération
  ne sert que de repli, jamais de source première.
- **Si le client ne renseigne pas une section, on garde celle du thème — et on
  le lui dit.** Aucune section n'est supprimée. L'aperçu doit lister ce qui
  reste à remplir.
- **Cohérence de langue** : un thème en anglais vendu à une entreprise française
  se traduit. Dans les deux sens, pour fr / en / es.
- Le catalogue est **100 % impact**. Rien d'autre n'est vendu.

## L'ordre de lecture, dans chaque thème

Toujours le même, jamais l'inverse :

```
donnée du client (businessProfile)
  → contenu généré (generatedContent)
    → constante de démonstration du thème
```

## La méthode, thème par thème

Pour chacun des 373, dans l'ordre :

1. lire le fichier et **relever ce qu'il sait montrer** — c'est la déclaration ;
2. brancher chaque section sur le contrat, dans l'ordre de lecture ci-dessus ;
3. ouvrir la page avec une **session client réelle**, serveur lancé avec
   `BLOB_READ_WRITE_TOKEN` — sans quoi `/api/sessions` répond 404 et le thème
   retombe sur sa démo, ce qui donne un faux négatif ;
4. **mesurer le DOM** : contenu client présent, contenu de démonstration absent,
   aucune image chargée mais jamais peinte, aucun débordement horizontal ;
5. **capturer à 1440×900 et 390×844**, et regarder ;
6. `npm run build`, dont on lit vraiment le code de sortie ;
7. commit, avec la mesure avant/après.

Pas de script de masse : chaque thème a ses propres noms, sa propre structure de
hero et ses propres sections. C'est ce qui rend le travail long et c'est ce qui
le rend fiable.
