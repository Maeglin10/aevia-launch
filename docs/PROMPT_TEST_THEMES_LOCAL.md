# Prompt — test local des 373 thèmes

À copier dans une session à la racine de `~/skylaunch`. Un seul projet à la fois.

Contexte mesuré le 2026-08-02, à ne pas re-découvrir : le tunnel réel est
`/configure` → secteur → métier → **thème impact** → `/api/generate` →
`/preview/{sessionId}`, qui charge `/templates/{id}?session={id}` dans une
iframe. Le thème lit la session lui-même. `/onboarding` est un ancien tunnel
qui retombe sur une page générique — ne pas le tester, il n'est pas le produit.

---

```
Vérifie que les 373 thèmes affichent le contenu du client, pas leur contenu de
démonstration, et qu'ils tiennent sur les deux tailles d'écran.

## Règle de méthode

**Mesure, ne juge pas à l'œil, et ne conclus pas depuis le code seul.** Le
comptage statique de ce dépôt m'a menti : 347 fichiers contiennent la chaîne
`heroHeadline`, mais sur douze thèmes ouverts dans un navigateur avec une vraie
session, cinq seulement affichaient le titre du client et **aucun** n'affichait
ses services. La présence d'une variable dans le fichier ne prouve rien — il
faut lire le DOM rendu.

N'utilise jamais `npm run dev` pour un balayage : le serveur meurt sous la
charge. Toujours `npm run build && npx next start`, un seul balayage à la fois.

## Préparer une session de test

Crée une session réaliste et sers-t'en pour tous les thèmes :

    POST /api/sessions   (ou écris directement l'objet dans Blob)
    formData        : businessName, city, phone, email, template, photoUrls
    generatedContent: heroHeadline, heroSubline, aboutTitle, aboutText,
                      services[{title,description}], testimonials[], ctaText,
                      metaTitle, metaDescription

Prends un métier reconnaissable et des mots introuvables dans les démos — par
exemple un couvreur lyonnais : « Le toit qui tient trente ans », services
« Réfection de toiture », « Zinguerie », « Urgences fuite sous 24h ».
Ces chaînes sont tes sondes.

Ouvre ensuite chaque thème sur `/templates/{id}?session={sessionId}`, attends
que la requête `/api/sessions` soit résolue **et** que les gestes de hero se
posent (5 s suffisent), puis lis `document.body.innerText`.

## 1 · Le contenu du client s'affiche-t-il

Pour chaque thème, note vrai/faux :

- le **titre** généré apparaît
- le **texte à propos** généré apparaît
- **au moins un service** généré apparaît
- la ville du client apparaît, et la ville de démonstration a disparu
- le téléphone et l'e-mail du client apparaissent

Le défaut connu : beaucoup de thèmes gardent leurs constantes `HERO`,
`SERVICES_DEMO`, `TARIFS`, `AVIS_DEMO` et n'en font rien du contenu reçu.
Certains embarquent un `useEffect` qui **mute ces constantes en place** sans
déclencher de rendu — le code existe, il ne produit rien. Ne le recopie pas :
il faut que le JSX lise la session, pas qu'un effet réécrive un objet de module.

## 2 · Les images

Les 58 thèmes `impact-326` → `impact-383` ont été ajoutés le 1er août avec des
animations, puis photographiés le 2. Vérifie sur chacun :

- **le hero porte bien une image** quand le thème en prévoit une ; deux la
  refusent volontairement (`impact-329` et `impact-330`, heros typographiques)
- chaque `<img>` a `naturalWidth > 0` après défilement complet
- **et surtout** : une image chargée mais **jamais peinte**. `PushBlur` plaçait
  son panneau en `position:absolute` dans un conteneur sans hauteur, qui
  s'effondrait à 0 px et clippait tout — impact-360, 375 et 383 avaient un hero
  vide sans que rien ne le signale. Contrôle : pour chaque image chargée,
  remonte six ancêtres et vérifie qu'aucun n'a une hauteur ou une largeur
  inférieure à 2 px.
- **ouvre les images et regarde-les.** Sur ce catalogue, une perceuse posée sur
  un rocher était légendée « établi d'ébéniste » et une truelle pleine de terre
  illustrait des pompes funèbres. Le `curl` ne l'attrape pas.
- la vignette `public/thumbnails/{id}.webp` existe et montre le bon thème

## 3 · Les deux tailles

À 1440×900 **et** 390×844, sur chaque thème :

- rien ne déborde horizontalement
- aucun mot d'un `h1`/`h2` plus large que sa boîte (une césure sur trait
  d'union est correcte)
- un appel à l'action visible sans défiler
- cibles tactiles ≥ 44 px
- contraste ≥ 4,5:1, mesuré sur les pixels composités

## 4 · Ce qu'un client attend et ne trouve peut-être pas

Sur un échantillon d'une vingtaine de thèmes, vérifie la présence et le
fonctionnement de :

- un formulaire de **demande de devis** qui envoie réellement
- les **mentions légales** et les **CGV**
- un numéro de téléphone cliquable et une adresse e-mail valide

## Livrable

`docs/AUDIT_THEMES_<AAAA-MM-JJ>.md`, commité, avec :

1. un tableau thème par thème pour la partie 1 (contenu client) ;
2. la liste des thèmes en défaut, groupée par cause ;
3. les trois listes habituelles ordonnées par ce que ça rapporte : bloquant
   pour vendre, visible par le client, dette.

Pas de correctif dans le même commit. Si tu corriges ensuite, un commit par
cause, avec la mesure avant/après.

Ce que je ne veux pas : un « probablement bon » présenté comme vérifié. Si tu
n'as pas ouvert la page, écris-le.
```

---

## Notes pour moi

- Le balayage des 373 thèmes × 2 tailles prend environ une heure. Prévoir la
  session en conséquence.
- La mesure du 2026-08-02 sur douze thèmes : titre 5/12, à-propos 2/12,
  **services 0/12**. C'est la ligne de base à améliorer.
