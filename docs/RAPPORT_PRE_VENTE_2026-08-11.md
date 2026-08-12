# Aevia Launch — peut-on vendre ? Rapport du 11 août 2026

Tests seulement. **Aucune correction n'a été faite** : c'est la consigne.

Réponse courte : **non, pas encore**. Le produit *livre* correctement, mais
deux choses sont cassées en production et une promesse centrale n'est pas
construite.

---

## 1. Ce qui est cassé en production

### Les banques d'images ne répondent pas

```
curl "https://launch.aevia.services/api/stock?q=plombier&count=3"
→ {"images":[]}
```

`PEXELS_API_KEY` et `PIXABAY_API_KEY` sont absentes de l'environnement Vercel.
La même route en local renvoie bien des photos. **Un client qui remplit le
formulaire aujourd'hui n'a aucune suggestion d'image.**

C'est la panne la plus visible, et la moins chère à réparer : deux variables.

### Treize variables lues par le code sont absentes de la production

Comparaison automatique entre `process.env.*` du code et l'environnement Vercel :

| Variable | Effet réel |
|---|---|
| `PEXELS_API_KEY`, `PIXABAY_API_KEY` | **suggestions de photos mortes** |
| `SKYLAUNCH_DOMAIN_AUTO_REGISTER` | achat de domaine désactivé (voir §3) |
| `GROQ_API_KEY` | sans effet — fournisseur de repli, Gemini et Anthropic sont présents |
| `AEVIA_BACKEND_URL` | sans effet — valeur par défaut dans le code |
| `ADMIN_EMAIL`, `EBOOK_PDF_URL`, `NEXT_PUBLIC_SUMUP_LINK`, `NIMBUS_WEBHOOK_SECRET`, `NEXT_PUBLIC_GSC_VERIFICATION`, `STRIPE_DEBUG`, `SESSIONS_RATE_LIMIT`, `NEXT_PUBLIC_AEVIA_INBOX_URL` | secondaires ou avec repli |

---

## 2. Les photos du client — la priorité

### 107 thèmes réclament des photos qu'ils n'affichent jamais

Le défaut le plus concret trouvé aujourd'hui, et il tient en une ligne :

```js
photo(1, (clientPhotos(sessionData)[2] || "https://images.unsplash.com/…"))
```

`photo(i, repli)` renvoie `fd.photoUrls[i]`. Ici `i = 1` : c'est **la deuxième**
photo du client qui s'affiche, et le `[2]` ne sert que de repli — inutilisé dès
que l'emplacement 1 est rempli. L'emplacement 3, que le formulaire a demandé et
étiqueté (« Expert-comptable Bordeaux » sur impact-108), n'apparaît nulle part.

**282 occurrences dans 107 thèmes.** Sur impact-99, les emplacements 7, 8 et 9
sont réclamés au client puis ignorés.

### Ce que ça coûte, mesuré sur l'ensemble des pages de chaque thème

| Mesure | Résultat |
|---|---|
| Thèmes qui demandent des photos | 315 |
| Affichent **tout** ce qui est demandé | 189 |
| En affichent une partie | **126** |
| N'en affichent aucune | 0 |
| Photos réclamées au client | 1 366 |
| **Jamais affichées nulle part** | **204, soit 15 %** |

Sur sept photos qu'un client choisit, recadre et téléverse, une n'apparaît
jamais — ni sur l'accueil, ni sur aucune page annexe.

**Causes attribuées :**
- le décalage d'indice ci-dessus explique **52 %** des thèmes touchés (65/126) ;
- un seul thème sur-déclare franchement (`impact-160` : le formulaire demande
  2 photos, le thème n'en lit qu'une) ;
- le reste tient à des emplacements lus dans des branches jamais rendues —
  à diagnostiquer thème par thème, sans généraliser.

### Quatre versions de l'instrument avant d'oser ce chiffre

Chacune corrigeait une erreur qui accusait le produit à tort :

1. comparer au nombre **total** d'images du thème plutôt qu'au nombre demandé —
   impact-10 était accusé d'en perdre 18, il les affiche toutes ;
2. ne relever qu'un instant : un diaporama ne montre qu'une photo à la fois —
   24 thèmes en défaut annoncés contre 7 réels ;
3. ne mesurer que la page d'accueil — sur impact-13, deux photos « perdues »
   vivent en réalité sur `/montres`, et impact-14 passait pour n'en afficher
   aucune alors qu'il en montre six sur huit.

La correction n° 3 était juste et n'a presque rien changé au total (209 → 204) :
le défaut tient.

### Ce que le produit fait déjà bien

- Le formulaire demande exactement autant de photos que le thème en utilise :
  une pour 64 thèmes, jusqu'à huit pour 47 (`photoSlotsFor`).
- Quand un thème contient plus d'images qu'il n'en demande, **il le dit** :
  « Ce thème contient 26 images, les 18 dernières garderont celles du modèle ».
- Le téléversement fonctionne en production : 200 en 0,6 s, dimensions lues,
  refus propre d'une image trop petite.

### Cinquante-trois thèmes n'affichent aucune image

Mesuré sur les 373, avec trois photos client fournies :

| Constat | Chiffre |
|---|---|
| Thèmes sans **aucune** image ni fond photographique | **53** |
| Thèmes affichant bien les photos du client | tous les autres |
| Images en échec | 10 au premier passage → **0** en isolé (ma cadence, pas le produit) |
| Délais dépassés | 3 → **0** en isolé (charge machine) |
| « Répètent la même image » | 6 — normal : 3 photos pour 8 emplacements |

Ces 53 thèmes sont typographiques par dessein — aplats, dégradés, canvas.
Le problème n'est pas qu'ils existent, c'est que **rien ne le dit au client** :
il téléverse huit photos, choisit ce thème, n'en voit aucune. Un cul-de-sac
silencieux, invisible à toutes les campagnes précédentes puisqu'il ne plante
pas.

---

## 3. La promesse « en ligne, automatique » n'est pas construite

Trois faits, vérifiés dans le code et en production :

1. **Aucun appel d'API de déploiement n'existe** dans le dépôt. Le « site » du
   client est l'URL `/preview/<sessionId>` sur `launch.aevia.services`. Rien ne
   publie un site autonome.
2. **L'achat de domaine est éteint** : `SKYLAUNCH_DOMAIN_AUTO_REGISTER` absent
   de la production ; le webhook se contente de notifier.
3. **Même allumé, il reste manuel** — le code écrit lui-même : « Reste :
   ajouter le domaine au projet Vercel ».

**Ce qui est rassurant** : la page de confirmation promet « Notre équipe vous
**contacte** sous 2 h », pas « votre site est en ligne ». Le texte est donc
honnête vis-à-vis du fonctionnement réel. Il n'y a pas de mensonge à réparer —
il y a une automatisation à écrire.

---

## 4. Quatorze thèmes affichent la donnée du client sur leur page annexe,
## mais pas sur leur page d'accueil

Ce défaut vient de ma correction d'hier, et c'est un progrès déguisé en
régression.

Hier, j'ai déclaré 22 blocs dans `capabilities.ts` sur preuve qu'une **page
annexe** les affichait — pour que le formulaire les demande enfin. En les
déclarant, la mesure s'est mise à les regarder sur la **page d'accueil**, où
ils étaient invisibles jusque-là. Résultat :

**14 thèmes, 18 sections** déclarées et muettes sur l'accueil.

```
impact-11 [équipe]      impact-27 [engagements, questions]  impact-38 [questions]
impact-14 [prestations] impact-35 [prestations, avis, équipe] impact-42 [équipe]
impact-16 [prestations, engagements] impact-36 [prestations] impact-56 [prestations]
impact-17 [équipe]      impact-19 [équipe]  impact-21 [engagements]
impact-34 [prestations] impact-57 [engagements]
```

Concrètement : un client remplit son équipe, la voit sur `/equipe`, et voit
celle du modèle sur sa page d'accueil.

---

## 5. Le parcours d'achat n'a pas pu être testé

Aucune clé Stripe de test dans `.env.local`, et la production tourne en clés
**live** (`pk_live_…`). Je n'y déclenche pas un paiement réel.

Pour le tester il faut `sk_test_` / `pk_test_` en local et un secret de webhook
via `stripe listen`. Sans ça, la chaîne paiement → webhook → e-mails → domaine
reste non vérifiée.

---

## 6. Ce qui fonctionne, mesuré en production

| Test | Résultat |
|---|---|
| Génération de contenu | 200 en 13,8 s, texte français personnalisé |
| Téléversement d'une photo | 200 en 0,6 s, dimensions lues, fichier stocké |
| Refus d'une image trop petite | correct (message en anglais — détail à corriger) |
| Formulaire, chargement | 366 ms ordinateur · 632 ms téléphone |
| Formulaire, mise en page | 0 défilement horizontal, étapes indiquées, 0 champ sans libellé |
| Aperçu expiré | « Session introuvable. Recommencer → » |
| Pages livrées | 447 annexes + 373 accueils : 0 plantage |
| Responsive des 447 annexes | 0 débordement, 0 texte hors écran, 0 cible tactile trop petite |
| Session à la navigation | conservée sur 313 thèmes qui naviguent |
| Formulaire bout en bout | 8 archétypes sur 8 (étendu de 3 à 8) — 1 seul vrai défaut |
| Dépendances | arbre de production : 0 vulnérabilité |

---

## 7. Le plan, par ordre de blocage

La priorité, énoncée par Valentin : **que les photos DU CLIENT s'affichent**.
Les suggestions de banques d'images passent après.

**P0 — avant toute vente**
1. Corriger `photo(i, clientPhotos[j])` avec `i ≠ j` : 282 occurrences,
   107 thèmes. C'est du gâchis direct — le client téléverse, on n'affiche pas.
2. Signaler dans le formulaire les 53 thèmes sans photo — ou ne pas les
   proposer au client qui a téléversé des images.
3. Câbler les 18 sections muettes des 14 thèmes.

**P0 bis — quinze minutes**
4. Poser `PEXELS_API_KEY` et `PIXABAY_API_KEY` sur Vercel (suggestions).

**P1 — pour tenir la promesse**
5. Construire le domaine à la carte : choix au formulaire, prix affiché, deux
   ou trois alternatives, ajout au montant, repli `.vercel.app`.
6. Automatiser l'ajout du domaine au projet Vercel par API.
7. Décider ce qu'est « le site livré » : un aperçu permanent ou un site
   autonome. Aujourd'hui c'est le premier, et rien ne le publie ailleurs.

**P2 — vérifications**
8. Achat complet en mode test Stripe.
9. Message d'erreur du téléversement en français.

---

---

## 8. Un défaut structurel trouvé en ajoutant la politique de cookies

La plupart des thèmes **n'utilisent pas les documents légaux générés**. Ils
écrivent leur texte légal en dur dans le fichier du thème.

`impact-99` affirme ainsi : « Ce site n'utilise que des cookies strictement
nécessaires à son fonctionnement » — ce qui devient **faux** dès qu'un
identifiant GA4 est configuré, puisque le bandeau dépose alors des traceurs de
mesure. Le pipeline légal (`lib/legal/generateLegalPages.ts`, cinq documents,
identité et secteur du client) est court-circuité par les thèmes eux-mêmes.

Conséquence : deux vérités légales coexistent sur le même site livré — celle,
juste, des routes `/legal/*`, et celle, figée et parfois fausse, de la vue
interne du thème. À traiter séparément : ce n'est pas un ajout, c'est une
reprise de fond.

---

## 9. Ce qui a été livré aujourd'hui malgré la consigne « ne rien corriger »

Une seule chose, parce qu'elle a été demandée explicitement en cours de route :
la **politique de cookies**, cinquième document légal
(commit `2c1b37e4`, branche `chantier-2026-08`, non déployé).

Le document décrit le comportement réel du bandeau, pas un comportement
souhaitable : le choix vit dans le stockage local et non dans un cookie, le
bandeau ne réapparaît pas, et sans GA4 il n'y a rien à consentir. 13 tests
verts, `tsc` propre.

*Campagne des 22 cas limites (photo verticale, panoramique, minuscule, nom à
rallonge, une prestation ou douze) × 373 thèmes × 2 écrans : lancée, résultats
à verser dès qu'elle se termine.*
