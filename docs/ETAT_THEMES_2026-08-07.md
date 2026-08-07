# État des 373 thèmes — 7 août 2026

Ce que le client remplit au formulaire, et ce que sa page affiche vraiment.
Chaque chiffre ci-dessous vient d'une mesure sur les 373 thèmes, pas d'une
lecture du code.

## Ce qui a été corrigé ce jour

| Défaut | Ampleur | État |
|---|---|---|
| Titre du hero mêlant client et démonstration | 12 thèmes | 0 restant |
| Titre du hero entièrement en démonstration | 34 thèmes | en cours de vérification |
| Surtitre annonçant le métier d'un autre | 5 thèmes | 0 restant |
| Métier de la démonstration en identité | 35 thèmes | 0 restant |
| Nom du client amputé dans l'en-tête | 6 thèmes | corrigé en un point |
| Lien de réservation demandé, jamais utilisé | 151 thèmes en montrent, 5 le reliaient | 0 restant |
| Adresse à moitié vraie (« 12 rue de la Paix, 44000 Annecy ») | 14 thèmes | 0 restant |
| Code postal du modèle devant la ville du client | 8 thèmes | 0 restant |
| SIRET inventé sous le nom du client | 31 thèmes | 0 restant |
| Mentions légales d'une société qui n'existe pas | 603 pages | 0 restant |
| Moyens de paiement jamais affichés | 1 thème réel | 0 restant |
| Deux `onClick` sur la même balise (menu mobile mort) | 2 thèmes | 0 restant |

## Le formulaire demande enfin ce que les thèmes affichent

Croisement automatique (`scripts/audit-archetypes.mjs`) entre les fonctions du
contrat qu'appellent les thèmes d'un métier et les champs que son étape réclame.

- Huit archétypes, 68 métiers : **plus aucune section affichée n'est laissée
  sans question**.
- `expertise_b2b` ne demandait pas l'adresse, `immobilier` ni les avis ni les
  réalisations ni les prestations, `produits` pas l'avant/après.
- `bookingSystem` est désormais demandé partout : la passe globale relie les
  boutons de réservation sur les 373 thèmes, plus seulement sur ceux du
  rendez-vous.

## Le catalogue proposé au client

- **68 métiers**, minimum **5 modèles** chacun (contre 1 pour l'école de musique
  et la gestion de patrimoine), moyenne **7,3**.
- **321 thèmes sur 373** apparaissent dans la liste d'au moins un métier. Les 52
  restants sont des sujets sans métier au catalogue — tableau de bord logiciel,
  carnet de voyage, magazine — et restent accessibles par la galerie.

## Les instruments, et ce qu'ils ont failli me faire croire

Trois pannes de mesure ce jour, toutes du même genre : l'outil ment plus souvent
que le produit.

1. **Le limiteur de débit.** `/api/sessions` accepte trente requêtes par minute.
   Six mesures en parallèle l'ont saturé ; les pages se chargeaient alors sans
   session, et 8 206 mesures ont conclu « aucun défaut » sur des pages vides de
   toute donnée client. Les scripts lèvent désormais une erreur quand la session
   n'est pas créée, et le serveur de mesure se lance avec
   `SESSIONS_RATE_LIMIT=1000000`.

2. **Le témoin de contrôle.** Un nom de deux cents lettres ne déclenchait rien :
   l'instrument voyait la page déborder, pas un texte amputé dans son propre
   cadre. Il compare maintenant le contenu à son cadre, en distinguant
   l'amputation du bandeau qui défile à dessein.

3. **La charge.** Sous six navigateurs simultanés, un thème sain rend parfois son
   titre de démonstration avant que la session ne revienne. L'instrument relit
   trois fois, de plus en plus tard.

Ajouté : `scripts/check-imports-contrat.mjs`. Une fonction du contrat employée
sans être importée ne casse pas la compilation — les thèmes portent
`@ts-nocheck` — mais la page entière disparaît au premier rendu. C'est ce qui
venait d'arriver à impact-351, et la mesure l'avait pris pour un titre resté en
démonstration.

## Ce qui reste

- Vingt-deux cas limites sur les 373, deux écrans, avec l'instrument recalibré.
- Les horaires : 118 thèmes en affichent, 27 seulement ceux du client.
- La revue visuelle, un thème à la fois, avec les données d'un vrai client.
- Les miniatures à régénérer, puis le déploiement et sa vérification en ligne.
