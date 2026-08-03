# Prompt Antigravity — le visuel des 373 thèmes

Tâches légères et mécaniques, à faire pendant que le câblage des données client
est traité en parallèle. **Ne touche pas à la logique de session** : tout ce qui
concerne `formData`, `generatedContent`, `SERVICES_DEMO`, `AVIS_DEMO` ou `HERO`
est réservé — deux mains sur les mêmes fichiers produiraient des conflits.

Périmètre : `app/templates/impact-*/`, `public/thumbnails/`. Le catalogue est
entièrement composé de thèmes impact (373 sur 373), il n'y a pas d'autre famille.

---

```
Audit visuel des 373 thèmes impact de ce dépôt. Tu ne modifies que des images,
des vignettes et des règles de style. Tu ne touches à aucune donnée de session.

## Méthode, avant tout le reste

N'utilise jamais `npm run dev` pour un balayage : le serveur meurt sous la
charge. Toujours `npm run build && npx next start`, un seul balayage à la fois.

Pour chaque constat : le fichier, la ligne, ce que voit l'utilisateur, et
comment tu l'as vérifié. Si tu n'as pas ouvert la page, écris-le.

## 1 · Les images se chargent-elles, et sont-elles peintes

Deux contrôles distincts, le second est celui qui attrape les vrais bugs :

- chaque `<img>` a `naturalWidth > 0` après défilement complet de la page ;
- **chargée mais jamais peinte** : pour chaque image chargée, remonte six
  ancêtres et vérifie qu'aucun n'a une hauteur ou une largeur inférieure à 2 px.
  Le composant `PushBlur` plaçait son panneau en `position:absolute` dans un
  conteneur sans hauteur : la boîte s'effondrait à 0 px et son `overflow:hidden`
  masquait tout. impact-360, 375 et 383 avaient un hero vide sans que rien ne le
  signale. Ce contrôle est le seul qui l'attrape.

Vérifie que les autres composants du kit qui positionnent leurs enfants en
absolu (`PortalZoom`, `CrossPush`, `AnchoredBackdrop`, `CircularLabel`) ont bien
un gabarit qui donne sa taille à la boîte, comme `PushBlur` en a un depuis le
2026-08-02.

## 2 · Chaque image montre-t-elle le bon sujet

**Télécharge-les et ouvre-les.** C'est le seul moyen : une image répond 200 en
montrant tout autre chose. Sur ce catalogue on a trouvé une perceuse posée sur
un rocher légendée « établi d'ébéniste », une truelle pleine de terre pour des
pompes funèbres, une Game Boy pour un bouquet de fleuriste, le Taj Mahal pour
une abbaye.

Vérifie aussi que le texte `alt` décrit ce qui est réellement dans le cadre.

## 3 · Le partage d'images entre thèmes

Une même photographie sert jusqu'à 24 thèmes différents. Mesure la
redistribution : liste les images utilisées par plus de trois thèmes, et pour
chaque cas dis si c'est acceptable (une texture, un fond neutre) ou non (le
sujet du hero). Les clés **Pexels et Pixabay sont dans `~/skylaunch/.env.local`**
et fonctionnent — `gemini-2.5-flash` mis à part, rien d'autre n'est nécessaire
pour chercher des remplaçantes.

Quand tu remplaces : télécharge, regarde, puis pose. Trois candidates minimum
par emplacement.

## 4 · Les vignettes

`public/thumbnails/{id}.webp`, 1280×720, WebP qualité 80.

- une vignette par thème, 373 attendues ;
- elle doit montrer **le thème correspondant** — ouvre-les et compare ;
- **pas de bandeau cookies dessus.** Pose le consentement avant la capture :
  `localStorage.setItem('aevia-cookie-consent', JSON.stringify({essential:true,ts:Date.now()}))`.
  Les 58 premières générées le 2026-08-02 avaient toutes le bandeau en travers.

## 5 · Les deux tailles

À 1440×900 **et** 390×844, sur chaque thème :

- rien ne déborde horizontalement ;
- aucun mot d'un `h1`/`h2` plus large que sa boîte de ligne (une césure sur
  trait d'union est correcte) ;
- un appel à l'action visible sans défiler ;
- cibles tactiles ≥ 44 px ;
- contraste texte/fond ≥ 4,5:1, mesuré sur les pixels composités.

Deux pièges connus :

- **collision Tailwind `relative`/`absolute`** : Tailwind émet `relative` après
  `absolute`, donc un composant qui code `relative` en dur et reçoit
  `absolute inset-0` devient une boîte de hauteur zéro. Mets la position en
  style inline.
- **une rangée flex centrée ne centre l'écart que si les deux moitiés pèsent
  pareil.** Utilise `grid-template-columns: minmax(0,1fr) <objet> minmax(0,1fr)`.

## 6 · Les thèmes en anglais

Certains thèmes portent encore un contenu de démonstration en anglais alors
qu'ils seront vendus à des entreprises françaises. Liste-les — ne les traduis
pas, leur contenu sera de toute façon remplacé par celui du client ; c'est la
liste qui est utile, pour savoir lesquels prioriser.

## Livrable

`docs/AUDIT_VISUEL_<AAAA-MM-JJ>.md`, commité, avec le tableau des constats et
trois listes ordonnées par ce que ça rapporte : bloquant pour vendre, visible
par le client, dette.

Un commit par cause, avec la mesure avant/après. Pas de correctif mélangé au
rapport.

## Ce que je ne veux pas

- Un « probablement bon » présenté comme vérifié.
- Une modification touchant `formData`, `generatedContent`, `SERVICES_DEMO`,
  `AVIS_DEMO`, `TARIFS`, `METHODE` ou `HERO` — c'est traité en parallèle.
- Un déploiement. Il est manuel et se fait après relecture.
```
