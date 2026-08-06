# État des thèmes — 6 août 2026

Ce que la revue visuelle par lots a trouvé, et ce qu'elle a corrigé. Tout ce qui
est chiffré ici a été mesuré au navigateur, pas déduit du source.

## Les titres amputés par la barre de navigation

Le premier lot de dix thèmes a montré un défaut que seule l'image révèle : sur
impact-06 on lisait « AME » au lieu de « TAME YOUR BIOLOGY », sur impact-07
« HE » au lieu de « THE SILENCE », sur impact-236 « CABLE » pour « CÂBLÉ » —
l'accent circonflexe mangé par le menu, et le titre passant par-dessus le logo.

Mesure sur les 373 : **23 thèmes** dont le premier titre passait sous l'en-tête,
de 15 à 176 pixels. Après correction, **0 sur 373**.

Deux familles, deux remèdes :

- **Dix-sept** ont été dégagés par une marge posée sur le titre. Un hero centré
  verticalement absorbe la moitié de ce qu'on lui ajoute : il faut repasser
  jusqu'à ce que la mesure dise zéro, en cumulant.
- **Six** composent leur hero ancré au bas de l'écran, avec un titre très grand.
  Les pousser vers le bas ne servait à rien — le bloc est ancré par le bas, pas
  par le haut. Leur rendu est réduit **uniquement en dessous de 820 pixels de
  haut**. Au-dessus, la mesure du zoom appliqué renvoie 1 : le design est celui
  d'origine, au pixel près.

Le défaut n'existe que sur les écrans courts. Il n'est pas théorique pour autant :
un portable de 1366×768 n'offre qu'environ 650 pixels utiles une fois le
navigateur déduit.

## Le bandeau cookies collé au bord

Soixante thèmes injectent leur propre remise à zéro :

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
```

Écrite hors des couches de Tailwind, cette règle l'emporte sur les utilitaires
quelle que soit leur spécificité — c'est la règle des couches en CSS, pas une
question de poids. Conséquence : `mx-auto` et `p-4` sans effet. Le bandeau
partait à **zéro pixel** sur une fenêtre de 1440, texte coupé au ras de l'écran,
ses trois boutons sans air. Sur le premier élément que lit un visiteur.

Le style en ligne, lui, passe devant. Un seul fichier corrigé — `CookieBanner.tsx` —
pour les soixante thèmes. Mesure après correction : le bandeau commence à 272 px,
soit exactement le centre.

Même cause pour le lien d'évitement au clavier, qui apparaissait sans marge
intérieure. Il parlait anglais sur un site français ; il parle français.

## Cinq erreurs d'instrument, et ce qu'elles enseignent

Toutes ont été trouvées en mesurant, jamais en relisant le code.

1. **Le premier `h1` d'une page n'est pas le titre du hero.** Sur impact-324 et
   impact-325, c'est le logo, écrit en `h1` dans l'en-tête. Un logo dans
   l'en-tête est recouvert par définition : deux faux positifs, éliminés en
   ignorant les titres contenus dans la barre.
2. **La marge se posait sur le mauvais titre.** L'heuristique cherchait « le
   titre du hero » par voisinage de mots dans le source ; sur impact-01 elle a
   décalé de 200 px un titre de section au milieu de la page. Depuis, on part du
   texte que le navigateur affiche et on retrouve la balise qui le porte.
3. **Le rendu est en capitales, le source non.** « LIVETICKET » pour un source
   qui dit « LiveTicket » : sans comparaison insensible à la casse, on ne
   retrouve jamais le titre qu'on vient de mesurer.
4. **`em` se rapporte au parent, pas au titre.** À `0.74em`, un titre de cent
   pixels est tombé à douze — illisible. Il fallait réduire le rendu du titre
   lui-même.
5. **Le style en ligne bat la classe.** La première règle CSS n'a rien fait du
   tout : la taille était écrite en style en ligne dans le thème.

## Ce que la mesure ne voit pas

Un chiffre à zéro ne dit pas qu'une page est belle. Les trois défauts corrigés
aujourd'hui ont tous été **vus sur une capture d'écran d'abord**, mesurés
ensuite. La planche contact reste le point de départ ; l'instrument sert à
généraliser à 373, pas à décider.
