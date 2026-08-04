# IA ou plug-and-play — ce qui coûte quoi

État au 4 août 2026, après le chantier de personnalisation des 373 thèmes.

## Ce qui vient du client, sans IA

Le wizard recueille, et les thèmes lisent directement :

| donnée | où le client la saisit | ce qu'elle remplit |
|---|---|---|
| nom, ville, accroche | étape 1 | en-tête, hero, pied, mentions légales |
| prestations, prix, durées | étape métier | grilles de services et de tarifs |
| avis clients | étape métier | sections témoignages |
| chiffres clés | étape métier | bandeaux de chiffres |
| équipe | étape métier | sections équipe |
| questions fréquentes | étape métier | sections FAQ |
| horaires | étape métier | grilles d'ouverture |
| adresse, zones desservies | étape métier | contact, pied, référencement local |
| labels et certifications | étape métier | bandeaux d'engagements |
| photos | étape visuels | tous les emplacements du thème |
| couleur de marque | étape design | accents, boutons, liens |
| identité légale | étape légale | éditeur, mentions, CGV |
| titres et listes de section | aperçu, panneau d'édition | 2210 retouches sur 371 thèmes |

**Aucune de ces données ne passe par un modèle.** C'est du plug-and-play : ce que
le client tape s'affiche, ce qu'il ne tape pas garde le contenu du thème.

## Ce qui passe encore par un modèle

`/api/generate` appelle Gemini 2.5 Flash, avec Groq en secours, pour produire
`generatedContent` : accroche, sous-titre, titre et texte « à propos »,
trois descriptions de services, deux témoignages, un appel à action, un titre et
une description SEO. Environ 2 048 jetons de sortie, une fois par site.

Ce contenu est un **repli**, pas la source : le contrat lit toujours la donnée du
client d'abord. Un client qui remplit ses prestations ne verra jamais celles du
modèle. Le modèle sert quand le client laisse un champ vide et que le thème a
besoin d'une phrase — et pour les métadonnées de référencement, que personne ne
saisit à la main.

## Le coût

Gemini 2.5 Flash : gratuit jusqu'à 1 500 requêtes par jour (palier gratuit, sans
carte). Au-delà, 0,30 $ le million de jetons d'entrée et 2,50 $ le million en
sortie. Une génération consomme environ 1 200 jetons d'entrée et 2 000 en sortie,
soit **0,0054 $ le site** — un demi-centime.

Groq est le secours, gratuit lui aussi dans son palier, et `generateMockContent`
prend le relais si les deux échouent : le site se génère toujours, même sans
aucune clé.

**À mille sites par mois, la facture IA est de 5,40 $.** Ce n'est pas là qu'est le
coût du produit.

## Ce qu'on pourrait supprimer

Les descriptions de services et les témoignages générés ne servent qu'au client
qui n'a rien rempli. Deux façons de s'en passer :

1. **Rendre les prestations obligatoires** dans l'étape métier — le client en
   saisit au moins trois. Le modèle ne sert plus qu'aux métadonnées SEO, soit
   moins de 300 jetons.
2. **Garder le contenu du thème** au lieu d'en générer. C'est déjà la règle
   partout ailleurs, et elle est cohérente : le thème parle du métier, pas de
   l'entreprise, ce qui est acceptable tant que le client n'a rien écrit.

La seconde est la plus proche de ce qui a été demandé — pas de génération, du
plug-and-play. Elle ferait tomber le coût IA à zéro pour les sites dont le client
remplit le wizard, et laisserait le modèle uniquement sur les métadonnées.

C'est une décision de produit : le modèle actuel ne coûte presque rien, mais il
écrit des phrases que personne n'a relues.
