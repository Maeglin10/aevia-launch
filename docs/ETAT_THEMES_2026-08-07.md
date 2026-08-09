# État des 373 thèmes — 7 août 2026

Ce que le client remplit au formulaire, et ce que sa page affiche vraiment.
Chaque chiffre ci-dessous vient d'une mesure sur les 373 thèmes, pas d'une
lecture du code.

## Ce qui a été corrigé ce jour

| Défaut | Ampleur mesurée | Après |
|---|---|---|
| Titre du hero mêlant client et démonstration | 12 thèmes | 0 |
| Titre du hero entièrement en démonstration | 34 thèmes | 0 |
| Métier de la démonstration en identité | 35 thèmes | 0 |
| Surtitre annonçant le métier d'un autre | 5 thèmes | 0 |
| Nom du client amputé dans l'en-tête | 6 thèmes | 0 |
| En-tête débordant sous un nom long | 17 thèmes | 0 |
| Texte du client amputé par son propre cadre | 7 thèmes | 0 |
| Lien de réservation demandé, jamais utilisé | 151 en montrent, 5 le reliaient | tous |
| Horaires en démonstration | 91 thèmes | ~5, résidus de forme |
| Adresse à moitié vraie (« 12 rue de la Paix, 44000 Annecy ») | 14 thèmes | 0 |
| Code postal du modèle devant la ville du client | 8 thèmes | 0 |
| SIRET inventé sous le nom du client | 31 thèmes | 0 |
| Mentions légales d'une société qui n'existe pas | 603 pages | 0 |
| Marque d'une autre entreprise sur les sous-pages | 151 pages | 0 |
| Moyens de paiement jamais affichés | 1 thème réel | 0 |
| Deux `onClick` sur la même balise (menu mobile mort) | 2 thèmes | 0 |

## Corriger en un point plutôt qu'en cent cinquante

Cinq de ces corrections vivent dans `app/templates/BrandColorVar.tsx`, une passe
qui s'exécute après le rendu, sur les 373 thèmes à la fois :

- le lien de réservation sous les boutons qui le promettent ;
- les horaires du client à la place de ceux du modèle, en respectant la mise en
  page — ligne condensée, ligne par jour, fragment dans une phrase, bloc coupé
  par des `<br>`, tableau à deux colonnes ;
- le nom qui rétrécit jusqu'à tenir, plutôt que de se faire couper ;
- l'en-tête qui cesse de déborder quand le nom est long ;
- la marque des sous-pages.

Aucune ne touche au dessin des thèmes, et toutes sont neutres quand le client
n'a rien saisi.

## Le formulaire demande enfin ce que les thèmes affichent

Croisement automatique (`scripts/audit-archetypes.mjs`) entre les fonctions du
contrat qu'appellent les thèmes d'un métier et les champs que son étape réclame.

- Huit archétypes, 68 métiers : **plus aucune section affichée n'est laissée
  sans question**.
- `expertise_b2b` ne demandait pas l'adresse, `immobilier` ni les avis ni les
  réalisations ni les prestations, `produits` pas l'avant/après.
- `bookingSystem` est désormais demandé partout.

## Le catalogue proposé au client

- **68 métiers**, minimum **5 modèles** chacun (contre 1 pour l'école de musique
  et la gestion de patrimoine), moyenne **7,3**.
- **321 thèmes sur 373** apparaissent dans la liste d'au moins un métier. Les 52
  restants sont des sujets sans métier au catalogue — tableau de bord logiciel,
  carnet de voyage, magazine — et restent accessibles par la galerie.

## Les instruments, et ce qu'ils ont failli me faire croire

Cinq pannes de mesure ce jour, toutes du même genre : l'outil ment plus souvent
que le produit.

1. **Le limiteur de débit.** `/api/sessions` accepte trente requêtes par minute.
   Six mesures en parallèle l'ont saturé ; les pages se chargeaient sans session,
   et 8 206 mesures ont conclu « aucun défaut » sur des pages vides de toute
   donnée client. Les scripts lèvent maintenant une erreur quand la session n'est
   pas créée, et le serveur de mesure se lance avec `SESSIONS_RATE_LIMIT=1000000`.

2. **Le témoin de contrôle.** Un nom de deux cents lettres ne déclenchait rien :
   l'instrument voyait la page déborder, pas un texte amputé dans son propre
   cadre. Il compare maintenant le contenu à son cadre, en distinguant
   l'amputation du bandeau qui défile à dessein.

3. **La charge.** Sous six navigateurs simultanés, un thème sain rend parfois son
   titre de démonstration avant que la session ne revienne. L'instrument relit
   trois fois, de plus en plus tard.

4. **La fenêtre trop courte.** Le titre n'était cherché que dans les neuf cents
   premiers pixels : dix-sept thèmes dont le hero s'ouvre sur une image pleine
   hauteur étaient comptés en défaut alors que leur titre, personnalisé,
   commence à onze cents pixels.

5. **Le texte que la page transporte.** Le JSON-LD et les données d'hydratation
   contiennent des heures ; les compter faisait passer trois thèmes sains pour
   fautifs. Et « maintenant » contient « mar ».

Ajouté : `scripts/check-imports-contrat.mjs`. Une fonction du contrat employée
sans être importée ne casse pas la compilation — les thèmes portent
`@ts-nocheck` — mais la page entière disparaît au premier rendu. C'est ce qui
venait d'arriver à impact-351, et la mesure l'avait pris pour un titre resté en
démonstration.

## Le piège que ces corrections ont créé

Les cinq passes réécrivent la page après le rendu. Écrire avec `textContent` ou
`innerHTML` **détruit les nœuds que React suit** : au premier re-rendu, il tente
d'en retirer un qui n'existe plus et la page entière disparaît —
« NotFoundError: Failed to execute 'removeChild' on 'Node' ». Quatre thèmes
étaient tombés ainsi (impact-27, 37, 38, 42).

Les passes ne changent plus que la **valeur des nœuds texte déjà en place** ; la
structure du DOM ne bouge pas. Un morceau à effacer se masque, il ne se vide
pas.

Le harnais de plantage ne posait que le formulaire, jamais le profil : ces
passes ne se déclenchaient donc pas, et la mesure ne voyait pas ce qu'elle
aurait dû voir. Il envoie désormais horaires, prestations, agenda, adresse,
SIRET et moyens de paiement.

## Vérifications finales

- **Plantages : 0 sur 373**, 0 page vide, avec le profil complet du client.
- **Nom long** (« Établissements Vidal-Marquisats & Fils Réunis depuis 1912 »,
  56 lettres) : 0 défaut lié à la donnée du client sur 373. Reste un bandeau
  décoratif d'impact-52 qui déborde aussi **sans** session — dette du thème,
  pas de la personnalisation.
- **Contrat** : toute fonction employée est importée (`check-imports-contrat`).
- **Archétypes** : 0 section affichée sans question posée.

Trois corrections de mesure de plus, toutes du même genre que les précédentes :
« cent pour cent » de largeur suit le parent et non l'écran ; le rétrécissement
ne regardait que le contenu débordant de son cadre, jamais le cadre sortant de
l'écran ; et un nom découpé mot par mot n'était reconnu dans aucun élément,
puisque aucun ne le contenait en entier.

## Ce qui reste

- Les vingt-deux cas limites sur les deux écrans en une seule passe : le noyau
  a été vérifié cas par cas, la campagne complète demande environ trois heures
  sans interruption.
- Un bandeau décoratif d'impact-52 déborde sur téléphone, indépendamment du
  client.
