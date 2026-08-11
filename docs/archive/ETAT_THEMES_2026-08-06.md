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

## Ce que le client écrit, et ce que son site en fait

Le test se fait par le wizard, comme un client : « Ateliers Vidal & Fils »,
plombier à Annecy, une accroche, un téléphone, une couleur. Puis on regarde ce
que la page affiche.

Quatre défauts, tous sur la donnée du client lui-même :

- **Son nom soudé à celui de la démonstration.** Le logo de cinq thèmes tient en
  deux fragments — « Bâtir » puis « Solide » en couleur d'accent. Seul le premier
  était câblé : le site affichait « ATELIERS VIDAL & FILSSOLIDE ».
- **Son accroche affichée deux fois**, dont une en gris sur une photo grise,
  mesurée à 1,1:1. Cinq thèmes appelaient à la fois le sous-titre du hero et le
  bloc prévu pour les titres trop étroits — les deux rendent la même phrase.
- **Son accroche affichée trois fois**, sur impact-118 et impact-123 : dans une
  boucle, chaque carte remplaçait sa propre description par l'accroche.
- **Son accroche nulle part.** Mesure en cours de correction.

## Dix métiers ne voyaient que des jumeaux

La ressemblance entre thèmes ne gêne pas le client dans la galerie — il ne la
parcourt pas. Elle le gêne dans **sa** liste. Mesuré : dix métiers sur
quarante-neuf proposaient une majorité de modèles issus des deux groupes qui se
ressemblent ; un dentiste voyait cinq propositions quasi identiques sur six.

Le remède n'est pas de retoucher ces thèmes — pris un par un, ils sont bons — ni
de les cacher. On complète chaque liste avec des modèles variés du même domaine.
Après : zéro métier dans ce cas, minimum quatre modèles chacun.

Le premier filtre, par mots-clés, proposait une clinique vétérinaire à un
dentiste et une fleuriste à un avocat : « care » et « conseil » se trouvent
partout. Il exige désormais un mot qui nomme le métier ou, à défaut, la même
catégorie, un voisinage trop proche étant écarté — le client choisit sur la
démonstration qu'il regarde, photo de chien comprise.

## Mesures finales sur les 373

| Contrôle | Avant | Après |
|---|---|---|
| Pages qui plantent avec les données d'un client | 5 | **0** |
| Titres coupés par la barre de navigation | 23 | **0** |
| Accroche du client en double ou absente | 16 / 26 | **0 / 0** |
| Mots collés, apostrophes perdues, entités affichées | 19 / 21 / 81 | **0** |
| Pied de page portant la donnée de la démonstration | 74 | **9** (décor de thème) |
| Débordement latéral, téléphone et ordinateur | — | **0** |
| Textes du client hors écran | 57 | **0** |
| Métiers ne voyant qu'une majorité de jumeaux | 10 / 49 | **0** |
| Textes superposés | 10 | **3** (partis pris typographiques) |

## Ce qui reste, et pourquoi

- **Neuf pieds de page** nomment une ville de décor — « Vieux-Lille », « Paris /
  Tokyo / Zürich » sur une agence internationale fictive. Les remplacer par la
  ville du client donnerait « Annecy / Tokyo / Zürich ». Le client les modifie
  par les retouches de section.
- **Trois superpositions** sont voulues : un « VULCAN » en filigrane derrière le
  titre, un nom d'atelier écrit verticalement, deux lignes de titre décalées.
- **Cent vingt-deux zones tactiles** font moins de trente pixels de haut : ce
  sont des liens de menu en ligne. Les agrandir toucherait au dessin de chaque
  en-tête.
- **Quatre-vingt-quatre thèmes** ont un texte peu contrasté à l'état nu. C'est
  le choix de leurs auteurs ; seuls les textes que la personnalisation dégradait
  ont été traités.

## Deuxième chantier — ce que le client saisit, partout (7 août)

Le premier passage n'avait mesuré que le hero et le pied de page. Les sections
du milieu — prestations, avis, chiffres, équipe, engagements, questions, carte,
catalogue, réalisations — n'avaient jamais été vérifiées en rendu.

### Les deux vrais trous

**La carte du restaurateur.** Son archétype lui demande une carte, pas des
prestations. Or les thèmes lisent tous `clientServices` : trente-deux d'entre
eux affichaient les plats de leur démonstration à qui avait rempli la sienne.
Sur le site d'un restaurant, c'est le contenu principal. Le contrat sert
désormais la carte, puis le catalogue, quand il n'y a pas de prestations — une
fonction touchée, aucun thème recâblé.

**La galerie de l'onglerie.** impact-210 affichait huit dégradés de couleur en
guise de portfolio, sans une seule image, sur un métier qui se vend par la
photographie.

### Les démonstrations, telles qu'un acheteur les voit

- Trois heros sans photographie : une boulangerie dont le pain était un emoji à
  douze pour cent d'opacité, un torréfacteur réduit à un disque orange, un salon
  de coiffure à un dégradé crème.
- Soixante-trois numéros à trous (« +33 1 XX XX XX XX ») et cent trente et un
  numéros en escalier (« 01 23 45 67 89 »), sur quatre-vingt-treize thèmes.
- Une balise HTML lue comme du texte : « a touch of <em>parisian elegance</em> ».
- Un accord fautif dans un titre qui défile : « L'ART DU COULEUR ».

### Le pied de page, cinq passes

74 → 23 → 16 → 0. Chaque correction révélait une écriture nouvelle : numéro seul
sur sa ligne, libellé entre apostrophes à côté de son lien, clé de formulaire
qui n'a jamais existé (`fd.businessPhone`), et pour finir un lien dont seul le
`href` était branché — on composait le bon numéro en cliquant, on lisait celui
de la démonstration.

## Mesures finales sur les 373

| Contrôle | Résultat |
|---|---|
| Pages qui plantent avec les données d'un client | **0** |
| Titres coupés par la barre de navigation | **0** |
| Accroche en double ou absente | **0** |
| Sections déclarées restant muettes | **0** |
| Images qui ne chargent pas | **0** |
| Thèmes sans animation | **0** |
| Débordements et textes hors écran (téléphone + ordinateur) | **0** |
| Pieds de page portant une donnée de démonstration | **0** |

## Ce que l'instrument a coûté

Sur ce second chantier, la majorité des « trous » annoncés venaient de la mesure,
pas du produit : données envoyées dans `formData` quand le contrat lit
`businessProfile` ; champ `question`/`answer` quand il lit `q`/`a` ; `title`
quand il lit `caption` ; photos dans un champ ignoré ; mots cherchés dans une
galerie d'images ; deux sources attendues là où le thème n'en montre qu'une ;
blocs jugés invisibles alors qu'ils étaient hors du champ de vision.

Et trois fois, une reconstruction lancée pendant une mesure a produit des
chiffres absurdes — cent vingt et une sections muettes, cent quatre-vingt-dix-huit
pages vides — dus à des fragments de code en erreur, jamais au produit.
**Aucune construction pendant une mesure.**
