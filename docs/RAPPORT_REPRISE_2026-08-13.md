# Reprise des thèmes cachés et du parcours client — 13 août 2026

**Branche** : `claude/prompt-reprise-themes-316-383-y5lfwc`

Ce document dit ce qui a été mesuré, ce qui a été corrigé, et ce qui reste.
Chaque chiffre vient d'une mesure, pas d'une estimation.

---

## 1. L'instrument mentait — quatre fois

Avant de croire une seule mesure, il a fallu réparer celui qui mesure. Le
balayage `scripts/qa-reprise.mjs`, écrit pour un conteneur sans réseau, produisait
des clichés faux :

| Ce qu'il faisait | Ce que je concluais | Ce qui était vrai |
|---|---|---|
| Coupait les requêtes vers Pexels et Unsplash | « impact-332 a une image cassée » | L'image se charge en 200 ms |
| Photographiait sans attendre l'immobilité | « impact-334 a perdu la photo de son héros » | Le héros tournait, le cliché tombait pendant la transition |
| Sautait au bas de page avant de capturer | « impact-331 est vide à 60 % » | Trente blocs à opacité 0, animation d'entrée jamais déclenchée |
| Attendait les images sans échéance | Balayage figé huit minutes, sans un mot | Une image qui ne se termine jamais |

**Règle qui en sort** : une mesure qui accuse le produit doit être vérifiée
contre le code avant d'être crue. Sur dix alertes examinées, six venaient de
l'instrument.

---

## 2. Ce que le wizard demandait, et ce que les thèmes affichaient

Deux registres pilotent les questions posées au client. Les deux avaient
divergé.

- **`capabilities.ts`** — 178 thèmes affichaient un bloc que le wizard ne
  demandait jamais. impact-99 peint les réalisations ET les prix du client : ni
  les unes ni les autres n'étaient demandées, et ces sections restaient en
  démonstration sur le site livré. **238 blocs ajoutés, aucun retiré**, deux cas
  vérifiés à la main avant écriture.
- **`photoSlots.ts`** — 45 registres décrivaient un autre thème que le leur.
  impact-332 place deux photos et n'en demandait qu'une : la seconde restait à
  jamais celle de la démonstration. impact-318 en demandait sept pour une seule
  affichée — six questions sans effet.
- **`sectionManifest.ts`** — 47 des 66 thèmes cachés proposaient au client des
  clés que le thème ne lit pas, et lisaient des clés jamais proposées. Le client
  remplissait, rien ne s'affichait. Régénéré depuis la source : **66 sur 66 en
  accord**.

---

## 3. Le parcours du client, mesuré du formulaire à la page livrée

C'est ici que se trouvait le trou le plus coûteux.

**L'adresse et la ville n'arrivaient jamais.** Le wizard demande une adresse à
l'étape 3 ; le serveur ne la lisait nulle part. La fiche partait avec
`city: ""` et sans profil, si bien qu'un couvreur de Voiron recevait un site
titré « Couvreur à Nice » — la ville de la démonstration — et que l'adresse
n'apparaissait sur aucun thème, pas même en pied de page.

Corrigé dans `app/api/webhook/route.ts` : la ville est tirée de l'adresse (elle
suit le code postal), et l'adresse est posée là où le contrat la lit
(`businessProfile.legal.companyAddress` et `geo.address`).

**Mesure de bout en bout** — formulaire rempli comme un client, brief intercepté,
session reconstruite exactement comme le fait le serveur après paiement :

```
sur la page livrée :
  ✓ nom          Toitures Béranger & Fille
  ✓ accroche     Ardoise et zinc en Chartreuse depuis 1969
  ✓ ville        Voiron
  ✓ téléphone    04 76 05 41 22
  ✓ courriel     contact@toitures-beranger.fr
  ✓ adresse      9 chemin des Ardoisiers
  ✓ prestation   Réfection de toiture en ardoise
```

**Le bouton de paiement mentait aussi.** Il s'allumait dès qu'une prestation
était nommée, puis l'envoi exigeait en plus une description et un courriel
valide, et refoulait le client. Il demande maintenant exactement ce que l'envoi
demandera — et une ligne dit lequel des trois manque, car un bouton éteint sans
explication est un cul-de-sac de plus.

---

## 4. Une page blanche en production

**impact-05 ne se chargeait pas** pour tout client ayant quatre chiffres clés.
Le thème n'a que trois onglets : `i % 3` répétait un identifiant, et deux onglets
de même valeur font boucler Base UI — « Maximum update depth exceeded », page
blanche. Reproduit sur `launch.aevia.services` avant correction : le défaut était
donc **déjà servi aux clients**.

Les neuf autres thèmes à onglets ont été chargés un par un avec le même profil :
aucun autre touché.

---

## 5. Les gardes globaux effaçaient ce qu'ils devaient protéger

`BrandColorVar.tsx` applique cinq passes à tous les thèmes. Trois faisaient plus
de mal que de bien :

- **Un titre qui défile déborde par dessein.** impact-347 affichait le sien en
  11 px — la taille plancher — au lieu de 60. Les passes reconnaissent
  maintenant un élément animé jusqu'au corps de page, et le laissent tranquille.
- **Un `nowrap` posé par le thème est une intention.** L'annuler d'emblée donnait
  « à partir / de 9 400 / € » sur trois lignes, le symbole seul en bas. On
  rétrécit d'abord, on ne replie qu'en dernier recours.
- **Le garde d'animation protégeait trop.** Une mise à l'échelle décorative posée
  haut dans impact-160 mettait à l'abri trente et un éléments qui sortaient
  vraiment de l'écran. La transformation ne protège plus qu'à deux niveaux ;
  l'animation et le défilement, sur toute la chaîne.

Deux défauts nouveaux ont aussi été corrigés à la racine :

- **Un mot du client coupé en deux lignes** — « COUVREU / R À ANNECY ». Aucun
  garde ne pouvait le voir : le texte TIENT dans son cadre. On mesure désormais
  le mot lui-même (un `Range` rend un rectangle par ligne occupée).
- **Le fond du thème ne descendait pas jusqu'au bas du document** : cent trente
  pixels blancs sous le pied de page noir d'impact-333.

---

## 6. Quinze constantes gelées à l'import

Une constante de module qui appelle le contrat est calculée au chargement du
fichier, quand la session n'existe pas encore : elle garde à jamais la donnée de
démonstration. La frise d'impact-13 affichait « Genève » quelle que soit la ville
du client ; le menu d'impact-04 et les témoignages d'impact-180 restaient ceux de
la démonstration.

Les quinze sont recalculées après l'arrivée de la session. **Deux erreurs commises
en chemin** : mon premier script coupait la déclaration jusqu'au point-virgule
suivant et a supprimé la fonction `photo()` d'impact-180 — page blanche. Repris
avec un découpage exact, les treize fichiers vérifiés au rendu.

---

## 7. Les 19 thèmes non repris

Ni téléphone, ni courriel, ni adresse du client : leur pied de page collait la
ville du client au département de la démonstration (« Annecy, Alpes-Maritimes »),
et quatre affichaient une ville en dur. Corrigé sur les dix-neuf.

Sur le reste, ils sont **complets et vendables** : nav, héros, chiffres, six
prestations, méthode, engagements, tarifs, avis, contact, pied de page ; en
français ; sans débordement ; le geste et la palette du plan sont en place. Ils
sont plus sobres que les 47 repris — environ 450 lignes contre 1 100 — mais ce
n'est pas un défaut, c'est un niveau d'élaboration.

---

## 8. Deux thèmes rédigés en anglais

impact-324 et impact-325 étaient écrits en anglais alors que le plan leur
assignait un métier français (billetterie live, séminaires corporate). Traduits
en entier, dollars compris.

---

## Ce qui reste

- **L'élévation graphique des 19 thèmes sobres** au niveau des 47 repris. Le
  prompt existe : `docs/PROMPT_REPRISE_THEMES_316_383.md`.
- **impact-160** garde une ombre décorative rognée de vingt-huit pixels en
  390 px. La page ne défile pas horizontalement, aucun texte du client n'est
  perdu ; c'est le dessin du thème.
- **Le test d'achat réel** reste impossible en local : les clés Stripe de test
  ne sont pas présentes, la production utilise `pk_live_`.
