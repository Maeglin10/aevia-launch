# Prompt d'audit produit — à lancer sur chaque projet Aevia

Copier le bloc ci-dessous dans une session Claude Code, à la racine du dépôt à
auditer. Un projet à la fois.

Repos concernés : `~/aevia` (hub), `~/skylaunch` (Launch), `~/skysecurity`
(Security), `~/skybot-inbox` (Inbox), `~/perso-portfolio`.

---

```
Audit produit complet de ce dépôt. Objectif : passer de « vendable » à
« irréprochable ». Je vends ce produit à de vrais clients — chaque défaut que
tu ne trouves pas, un client le trouvera.

## Règle de méthode, avant tout le reste

**Mesure, ne juge pas à l'œil.** Une capture d'écran ne montre pas ce qui est
rogné : du contenu coupé par un overflow ressemble à une mise en page voulue.
Une image peut répondre 200 et montrer un tout autre sujet. Un lien peut être
bleu et souligné et ne mener nulle part.

Pour chaque constat, donne : le fichier et la ligne, ce qui se produit
concrètement pour l'utilisateur, et comment tu l'as vérifié. Si tu n'as pas
vérifié, écris-le — un « probablement » honnête vaut mieux qu'un faux « fait ».

N'utilise jamais `npm run dev` pour un balayage de masse : le serveur de
développement meurt sous la charge. Toujours `npm run build && npx next start`,
et un seul balayage à la fois.

## 1 · Est-ce que ça marche

- Le build passe-t-il ? `npm run build`
- Combien d'erreurs `tsc` ? Note le chiffre : il devient la ligne de base.
- Chaque route répond-elle 200 ? Y compris les pages secondaires, les
  variantes de langue, les pages légales.
- **Toutes les images se chargent-elles ?** Deux vérifications distinctes :
  chaque URL renvoie-t-elle 200 (`curl`), *et* chaque `<img>` a-t-il un
  `naturalWidth > 0` une fois la page rendue et défilée.
- **Chaque image montre-t-elle le bon sujet ?** Télécharge-les et ouvre-les.
  C'est le seul moyen. Sur ce catalogue, trois « bouquets » de fleuriste
  étaient une Game Boy, un mécanicien et une rangée d'iPhone — tous en 200.
- Chaque lien mène-t-il quelque part ? Les ancres `#` pointent-elles vers un
  élément qui existe ? Clique-les, ne les lis pas.
- Erreurs JavaScript en console, sur chaque page ?

## 2 · Est-ce que ça tient sur un téléphone

À 390×844 et à 1440×900, sur chaque page :

- Quelque chose déborde-t-il horizontalement ?
- Un texte est-il coupé en plein mot ? (mesure chaque mot d'un `h1`/`h2`
  contre sa boîte de ligne ; une césure sur trait d'union est correcte)
- Des éléments se chevauchent-ils ?
- Un appel à l'action est-il visible sans défiler ?
- Les cibles tactiles font-elles 44 px au minimum ?
- Le contraste texte/fond passe-t-il 4,5:1 ? Mesure les pixels composités, pas
  la couleur déclarée.

## 3 · Est-ce qu'un client comprend ce qu'il achète

Parcours le produit comme un prospect qui découvre, pas comme quelqu'un qui l'a
écrit :

- La page d'accueil dit-elle en une phrase ce que c'est, pour qui, à quel prix ?
- Le prix est-il visible sans avoir à demander ?
- Que se passe-t-il si je clique sur « Commencer » ? Combien d'étapes avant de
  comprendre ce que j'obtiens ?
- Où sont les mentions légales, les CGV, la politique de confidentialité ?
  Sont-elles à jour, cohérentes avec la réalité (SIREN, adresse, TVA) ?
- Y a-t-il une adresse de contact qui fonctionne ?
- Le produit promet-il quelque chose qu'il ne fait pas ?
- Cite-t-il des marques, des références ou des chiffres qui n'existent pas ?
  (une démo qui affiche Apple dans sa liste de clients est une fausse référence)

## 4 · Est-ce qu'on peut le vendre demain

- Le paiement fonctionne-t-il de bout en bout ? Teste un vrai parcours d'achat,
  webhook compris.
- Que reçoit le client après avoir payé ? E-mail, accès, facture ?
- Que se passe-t-il si le paiement échoue, si le client se trompe d'adresse,
  s'il demande un remboursement ?
- Existe-t-il une facture conforme (numérotation, mentions obligatoires, TVA) ?
- Le RGPD est-il traité : consentement cookies, droit à l'effacement,
  sous-traitants listés ?
- Combien de temps entre « le client paie » et « le client a son produit » ?
  Ce délai est-il tenu automatiquement ou dépend-il de quelqu'un ?

## 5 · Est-ce que ça tient en production

- Que se passe-t-il si l'API tierce tombe ? Le produit dégrade-t-il
  proprement ou affiche-t-il une page blanche ?
- Les secrets sont-ils hors du dépôt ? Cherche les clés en dur.
- Y a-t-il des journaux exploitables quand un client signale un problème ?
- Les données sont-elles cloisonnées par client ? Cherche une requête sans
  filtre de tenant.
- Y a-t-il une sauvegarde, et a-t-elle déjà été restaurée pour de vrai ?
- Le déploiement est-il reproductible ? (sur ces projets il est **manuel** :
  `vercel --prod`, pousser sur GitHub ne met rien en ligne)

## 6 · Ce qui manque

Termine par trois listes, chacune ordonnée par ce que ça rapporte :

1. **Bloquant pour vendre** — ce qui doit être corrigé avant le prochain
   client. Avec le coût estimé en heures.
2. **Visible par le client** — ce qu'un acheteur remarquera et qui abîme la
   confiance sans empêcher la vente.
3. **Dette** — ce qui coûtera cher plus tard mais que personne ne voit
   aujourd'hui.

Pour chaque ligne : le fichier, ce que ça casse concrètement, et l'effort.

## Livrable

Un fichier `docs/AUDIT_PRODUIT_<AAAA-MM-JJ>.md` dans le dépôt, commité, qui
contient les constats et les trois listes. Pas de correctif dans le même
commit : je veux lire avant que tu changes quoi que ce soit.

Si tu corriges ensuite, un commit par sujet, avec la mesure avant/après.
```

---

## Notes pour moi

- Lancer un projet à la fois. Le lancer sur deux dépôts en parallèle sature la
  mémoire et produit des faux positifs (timeouts pris pour des défauts).
- Sur `~/skylaunch`, l'audit des 315 templates prend environ 40 minutes de
  balayage. Prévoir la session en conséquence.
- Le prompt demande volontairement de **ne pas corriger** dans le même passage.
  Les deux sessions précédentes ont montré que corriger en découvrant produit
  des correctifs non vérifiés — le doublon `maxWidth` d'impact-215, les images
  au mauvais sujet.
