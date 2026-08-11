# Catalogue des gestes — les vingt-cinq mécaniques, et comment on les a trouvées

Ce document est la référence pour poser une animation premium sur un thème.
Il dit, pour chaque geste : d'où il vient, ce qu'il fait exactement, comment il
a été mesuré, quel composant l'implémente, et sur quels métiers il tient.

Trois documents, trois rôles :

| Document | Répond à |
|---|---|
| [SLIDER_REVOLUTION_TEARDOWN_2.md](SLIDER_REVOLUTION_TEARDOWN_2.md) | Quels sont les timings, et comment ils ont été mesurés |
| **Ce document** | Quel geste existe, ce qu'il fait, quel composant l'écrit |
| [PLAN_HEROS_PREMIUM.md](archive/PLAN_HEROS_PREMIUM.md) | Sur quel thème poser quoi, dans quel ordre, avec quels contrôles (archivé) |

Trois pages de démonstration, toutes adressables par ancre :

- **`/video-labs`** — un onglet par enregistrement, un geste montré seul. La référence.
- `/hero-labs` et `/hero-labs-2` — premières séries, plusieurs gestes par sample.

---

## La méthode : pourquoi il a fallu trois passes

Ce n'est pas un détail d'outillage. Les deux premières passes ont produit des
conclusions fausses, et il faut savoir pourquoi avant de refaire l'exercice.

**Passe 1 — la courbe de mouvement.** Chaque image décodée en 64×36 niveaux de
gris ; la différence absolue moyenne entre images consécutives donne une courbe.
Un pic = une transition. La position du pic dans la salve donne l'easing : à 5 %
de la durée c'est chargé au début (`ease-out`), à 70-80 % c'est un groupe
échelonné, à 45-50 % c'est symétrique.

Excellent pour le **tempo**. Aveugle sur le **geste** : la courbe dit qu'il se
passe quelque chose pendant 0,9 s, pas que la bouteille décrit un arc.

**Passe 2 — la bande d'images à 12 im/s sur 1,4 s.** Montre la nature de la
transition — un fondu, une poussée, un flou. C'est là qu'on a vu le croisement
du tatouage et la cascade du bento.

Mais **une fenêtre trop courte coupe les trajectoires lentes**. La bouteille du
vin y ressemblait à une translation avec un léger basculement. C'était faux.

**Passe 3 — la fenêtre longue à 8 im/s, en grandes images.** 2,4 s en grille de
5×4 à 460 px par image. C'est là seulement qu'apparaissent :

- l'arc du balancier de la bouteille (rotation jusqu'à 60° autour du pied) ;
- la poussée latérale de v17, que la passe 1 avait décrite à tort comme un
  titre ancré sur un fond qui se dissout ;
- la rotation au défilement du produit de v04.

**Leçon, pour la prochaine fois : commencer par la fenêtre longue.** La courbe
sert à trouver *où* regarder, pas à conclure.

Les outils sont dans `/tmp/srev/` : `motion.py` (la courbe), `segments.py`
(les salves), `strip.sh` (la bande courte), `path.sh` (la fenêtre longue).

---

## Les trois nombres

Mesurés sur les dix-huit enregistrements, sans exception :

1. **Une transition dure 0,6 à 1,0 s.** Jamais 0,3 s. La borne basse est
   réservée à un élément seul. Constantes : `T.single` = 0,7 s, `T.group` = 1,0 s.
2. **Le temps d'arrêt vaut 3 à 6 fois la transition.** `DWELL.brisk` 3 s,
   `DWELL.normal` 4,2 s, `DWELL.slow` 5,6 s. Rien sous 2,5 s dans tout le corpus.
3. **Les enfants d'un groupe sont décalés de 55 ms** (`T.stagger`). Un groupe
   qui bouge d'un bloc se lit comme un seul élément plat.

Et une quatrième, moins évidente : **le vide se tient**. Sur le hero du vin, la
bouteille sort en 0,57 s, puis il y a **une demi-seconde où la scène est vide**,
puis la suivante entre en 0,88 s. Sur celui de la pâtisserie, la scène reste
vide 1,4 s avant que quoi que ce soit n'arrive. Aucun de nos anciens heros ne
faisait ça : tout s'y croisait en fondu, donc rien n'y respirait.

---

## Les gestes de signature

**Un seul par thème.** Deux thèmes du même métier ne portent jamais le même.
Les accessoires (compteur, flèches, plaque teintée) se répètent librement.

### ArcSwap — `hero-kit-3`

*Source : v01 oakgrove-wine-slider · Démo : `/video-labs#wine` (cave)*

L'objet balance. Rotation jusqu'à 52° **autour d'un pivot au pied** : la sortie
part vers la droite en tournant, l'entrée arrive par la gauche presque couchée
puis se redresse. Le pied reste presque immobile, le col décrit l'arc.

```tsx
<ArcSwap index={i} sweep={52} hold={0.42}>{bouteille}</ArcSwap>
```

`transformOrigin: "50% 92%"` fait tout le travail : c'est ce qui transforme une
rotation en balancier. Sortie en 0,62 s sur une courbe accélérante
(`[0.55, 0, 0.85, 0.3]`), puis 0,42 s de vide, puis entrée en 0,9 s.

**Métiers** : bouteille, flacon, bouquet, pièce montée — tout objet qui a un pied.
Ne pas l'encadrer : une arche ou un cadre ne suit pas l'objet et se voit.

### PortalZoom — `hero-kit-3`

*Source : v18 portal-effect · Démo : `/video-labs#portal` (abbaye)*

Une forme découpée dans la photo — arche, porte, fenêtre — laisse voir la slide
suivante **au travers**. À la transition, le masque s'ouvre en grand pendant que
la scène sortante recule : on traverse le seuil.

```tsx
<PortalZoom images={photos} index={i} portal="inset(22% 38% 0% 38% round 50% 50% 0 0 / 40% 40% 0 0)" />
```

Le geste le plus spectaculaire du corpus, et il ne coûte qu'un `clip-path` animé.

**Métiers** : hôtel, monument, voyage, immobilier — tout ce qui vend un lieu.

### HardCutRebuild — `hero-kit-3`

*Source : v16 fitness-gym · Démo : `/video-labs#gym` (déménageur)*

La photographie **coupe net** — pas de fondu. Puis un temps où il n'y a plus de
texte du tout, et le titre, les statistiques et le bouton se reconstruisent en
décalé. Une barre de couleur (`FixedRail`) reste fixe et donne l'axe.

C'est du montage, pas de la transition. La sortie est brutale et simultanée
(0,12 s), le retour commence 0,34 s plus tard, enfant par enfant.

**Métiers** : sport, garage, bâtiment, transport — tout ce qui doit frapper.

### CrossPush — `hero-kit-3`

*Source : v07 old-soul-tattoo · Démo : `/video-labs#tattoo` (école de danse)*

Les deux photographies se croisent : la sortante glisse à gauche pendant que
l'entrante arrive par la droite, et pendant un instant les deux sujets sont à
l'écran ensemble. Aucun fondu, deux plans qui se croisent.

**Métiers** : tatouage, danse, coiffure, portrait, mode — tout ce qui montre des gens.

### MosaicPush — `hero-kit-3`

*Source : v10 dental-clinic · Démo : `/video-labs#dental` (école privée)*

Une mosaïque de photos inégales sort par la droite, tuile par tuile avec un
décalage de 70 ms, et la suivante entre par la gauche dans le même ordre. À
mi-course la grille est presque vide : c'est ce vide qui fait lire les sept
tuiles comme un seul geste.

Diffère de `BentoCascade`, qui découpe verticalement sur place.

**Métiers** : santé, clinique, école, agence — les métiers d'équipe.

### TrackingCollapse — `hero-kit-3`

*Source : v12 hair-salon · Démo : `/video-labs#salon` (institut de beauté)*

Le mot ne se contente pas de se flouter : **son interlettrage s'écarte** pendant
qu'il disparaît, et le suivant arrive très espacé puis se resserre. On lit le
mot se construire.

```tsx
<TrackingCollapse word="VISAGE" index={i} from="0.42em" to="0.06em" />
```

Bien plus riche que `BlurThrough`, qui n'était qu'une opacité floutée.

**Métiers** : beauté, coiffure, spa, joaillerie — les métiers du geste.

### PanelDrop — `hero-kit-3`

*Source : v02 coffee-shop-split-screen · Démo : `/video-labs#coffee` (fromagerie)*

Le panneau de texte descend comme un rideau, contenu compris, pendant que la
photo change derrière. **Verticale** plutôt qu'horizontale : c'est ce qui
distingue ce slider de tous les autres du corpus.

**Métiers** : fromagerie, boulangerie, café, restaurant, boutique — le format catalogue.

### PanelRise — `hero-kit-3`

*Source : v03 shft-interior-design · Démo : `/video-labs#interior` (ébéniste)*

Le titre du héros ne bouge jamais. C'est **la section suivante qui monte
par-dessus**, comme un volet, et le recouvre. Piloté par le défilement.

**Métiers** : architecture, ébénisterie, décoration — les métiers de la matière.

### ScrollGrow — `hero-kit-3`

*Source : v05 dj-website · Démo : `/video-labs#dj` (salle de concert)*

Le titre **grandit** au défilement au lieu de partir. La page donne l'impression
d'avancer vers lui. À réserver à un titre court : trois syllabes, sinon il
déborde avant la fin du parcours.

**Métiers** : musique, nuit, événementiel, sport.

### DifferentialExit — `hero-kit-3`

*Source : v04 from-sketch-to-product · Démo : `/video-labs#sketch` (maroquinerie)*

Au défilement, le titre, le produit et le numéro **ne partent pas à la même
vitesse**. Trois plans, trois rythmes : c'est ce qui crée la profondeur, pas une
ombre portée. `depth` va de 0 (le fond, part lentement) à 1 (le premier plan).

### ScrollSpin — `hero-kit-3`

*Source : v04 · Démo : `/video-labs#sketch`*

Le produit **tourne** pendant qu'on défile. Ce n'est pas une boucle automatique,
c'est le défilement qui l'entraîne. Se combine avec `DifferentialExit`.

### LineScroll — `hero-kit-3`

*Source : v13 suits-product-showcase · Démo : `/video-labs#suits` (hôtel)*

Les lignes du titre défilent horizontalement sous masque : elles entrent par la
droite et sortent par la gauche, chacune avec son décalage. On lit un instant la
queue de la ligne sortante en même temps que la tête de l'entrante.

`LineMask` (kit 2) fait l'inverse et sans chevauchement ; celui-ci est plus
continu, plus proche d'un rouleau que d'un remplacement.

**Métiers** : hôtellerie, mode, costume, joaillerie, luxe.

### InvertSweep — `hero-kit-3`

*Source : v14 modern-web-agency · Démo : `/video-labs#agency` (studio de design)*

**Toute la page s'inverse** : le fond passe du noir au blanc et le texte du blanc
au noir, pendant qu'une forme fluide monte par le bas. Ce n'est pas une section
qui succède à une autre, c'est la même page qui bascule. Piloté par le
défilement, la forme est un dégradé conique flouté — pas de canvas, pas de
bibliothèque.

**Métiers** : agence, studio, portfolio, marque — tout ce qui vend un point de vue.

### ComposeIn — `hero-kit-3`

*Source : v15 food-presentation · Démo : `/video-labs#food` (pâtisserie)*

La scène commence **vide**. Une surface, une ombre qui dérive, et rien d'autre
pendant 1,4 s. Puis les éléments arrivent un par un, chacun depuis son propre
bord, à 170 ms d'intervalle : le titre se dévoile de gauche à droite
(`WipeReveal`), la ligne manuscrite apparaît, une carte entre par la gauche, un
aplat par la droite, la photographie en dernier.

**Le vide initial est le sujet.** Sans lui, l'arrivée n'est qu'un chargement de
page. `DriftShadow` — l'ombre qui traverse en 28 s — est ce qui empêche la scène
vide de ressembler à une page qui n'a pas fini de charger.

**Métiers** : restaurant, pâtisserie, traiteur, épicerie fine, fleuriste.

### ParticleOrb — `hero-kit-3`

*Source : v06 wordpress-hero-image · Démo : `/video-labs#particle` (maison d'édition)*

Une sphère de sept cents points répartis en spirale de Fibonacci, tournant en
44 s. Écrite en canvas : sept cents points redessinés par image coûtent moins
cher qu'autant de nœuds dans le DOM. Les points du fond sont plus petits et plus
pâles — c'est ce qui donne le volume, il n'y a pas de projection perspective.

S'arrête net sur `prefers-reduced-motion`, en laissant une image fixe plutôt
qu'un vide.

**Métiers** : éditorial, culture, spiritualité, luxe discret — **un héros sans
photographie qui ne soit pas une page vide.**

### PushBlur — `hero-kit-3`

*Source : v17 smart-living-one-pager · Démo : `/video-labs#property` (promotion immobilière)*

**Correction d'une erreur de la première lecture.** Ce template ne dissout pas
son fond derrière un titre fixe : toute la composition part sur le côté,
photographie et titre ensemble, avec un flou directionnel pendant le
déplacement. Sur deux images consécutives on lit deux fois le titre, l'un qui
sort à droite, l'autre qui entre par la gauche.

Le flou est ce qui rend la poussée crédible. Sans lui, c'est un carrousel.

**Métiers** : immobilier, promotion, architecture, automobile.

### WordFlight + ExpandFrame — `hero-kit-2`

*Source : v08 justice-row · Démo : `/video-labs#law` (notaire)*

Chaque mot du titre est son propre élément, entrant depuis un décalage vertical,
échelonné de 55 ms. La photographie part d'un petit rectangle et s'ouvre en même
temps. Les deux atterrissent ensemble — c'est pour ça que la salve de l'original
culmine à 75 % de sa durée.

**Métiers** : notaire, avocat, conseil, comptabilité — tout ce qui doit paraître grave.

### LineMask + Retint — `hero-kit-2`

*Source : v09 justice-row, seconde prise · Démo : `/video-labs#law2` (recouvrement)*

Chaque ligne du titre sort horizontalement sous son propre masque, pendant qu'un
bandeau plein prend une couleur de la slide courante.

### BentoCascade + Retint — `hero-kit-2`

*Source : v11 bento-grid-travel · Démo : `/video-labs#bento` (office de tourisme)*

Sept tuiles de tailles inégales se vident et se remplissent **en cascade
verticale**, avec un décalage de 55 ms. Mi-transition, la grille est presque
noire. La palette entière se reteinte par destination.

### HeldSwap — `hero-kit-2`

*Source : v01 · Démo : `/hero-labs#wine`*

Sortie, **un demi-temps de vide tenu**, entrée. Version simple d'`ArcSwap`,
sans la rotation : à utiliser quand l'objet n'a pas de pied (une assiette, une
pièce posée à plat).

### GhostSolid — `hero-kit-2`

Ligne en contour (`-webkit-text-stroke`) contre ligne pleine dans l'accent, même
corps, même famille. Un lockup, pas un titre. **Métiers** : sport, garage, chantier.

### AnchoredBackdrop — `hero-kit-2`

Le titre ne bouge pas, seule la photographie se dissout. **Le plus discret du
lot** : il était sur huit thèmes sur dix-huit et c'est en partie ce qui les
faisait se ressembler. À réserver.

### BlurThrough — `hero-kit-2`

Un libellé se floute en sortie et en entrée. **Saturé** : quinze thèmes sur
dix-huit. Ne plus l'utiliser comme signature — `TrackingCollapse` fait la même
chose en mieux.

---

## Les accessoires

Réutilisables librement, ils ne comptent pas comme signature.

| Composant | Kit | Rôle |
|---|---|---|
| `FixedRail` | 3 | La barre de couleur immobile qui porte le compteur et donne l'axe. C'est elle qui fait lire une coupe franche comme un montage plutôt que comme un bug |
| `DriftShadow` | 3 | L'ombre qui traverse une surface en 28 s. Rend une scène vide vivante |
| `CrossFigure` | 3 | Une silhouette qui traverse lentement : de la vie sans slider, pour un thème qui n'a qu'une photo |
| `StickyProgress` | 3 | Titre collé + liste numérotée révélée pas à pas. **Pas un héros : la section d'après**, celle qui fait « cher » sur les deux templates les plus aboutis du corpus |
| `WipeReveal` | 3 | Un titre dévoilé de gauche à droite par `clip-path` |
| `Retint` | 2 | Une surface plate prend une couleur de la photo courante. Meilleur rapport effet/travail du lot |
| `CircularLabel` | 2 | Texte sur cercle qui tourne, et **qui dit quelque chose** |
| `SlideIndex` | 2 | Le compteur, en `flat` ou en `fraction` |
| `HairlineArrows` | 2 | Flèches filaires, vrais `<button>`, cible 44 px |

---

## Un geste n'appartient pas à un métier

C'est la raison d'être de `/video-labs` : chaque geste y est posé sur **un métier
différent de celui de la vidéo d'origine**.

| Enregistrement | Métier d'origine | Métier du sample |
|---|---|---|
| v02 coffee-shop | Torréfacteur | Fromagerie |
| v03 shft-interior | Architecture d'intérieur | Ébéniste |
| v05 dj-website | Club électro | Salle de concert classique |
| v07 old-soul-tattoo | Tatouage | École de danse |
| v08 justice-row | Avocat | Notaire |
| v10 dental-clinic | Cabinet dentaire | École privée |
| v11 bento-travel | Voyage | Office de tourisme |
| v12 hair-salon | Coiffure | Institut de beauté |
| v13 suits | Costume | Hôtel |
| v16 fitness-gym | Salle de sport | Déménageur |
| v18 portal | Voyage | Abbaye |

Si le rideau du café tient sur une fromagerie et la mosaïque du dentiste sur une
école, alors le geste est bien une mécanique et non un décor. C'est le test.

---

## Les pièges, appris en les commettant

**Une image peut répondre 200 et montrer autre chose.** Sur impact-47, les trois
« bouquets » du médaillon étaient une Game Boy, un mécanicien et une rangée
d'iPhone. Le contrôle HTTP passait. Il faut ouvrir l'image :

```bash
curl -s -o /tmp/v.jpg "https://images.unsplash.com/photo-XXXX?w=400&h=400&fit=crop" && open /tmp/v.jpg
```

Sur les dix-huit samples, **onze photographies** étaient au mauvais sujet à la
première écriture. Toutes trouvées en les regardant, aucune par un test.

**Un cadre ne suit pas un objet qui bouge.** L'arche du hero vin statique
fonctionne ; autour d'une bouteille qui balance, elle ne suit pas et se voit.
Une ombre au sol marque le pivot sans encadrer.

**Un titre centré ne centre pas son écart.** `[gauche][écart][droite]` en flex ne
centre l'écart que si les deux moitiés pèsent pareil : « CLOS » contre
« MERIDIEN » poussait l'écart à gauche et le mot long passait sur la bouteille.
Une grille `minmax(0,1fr) <objet> minmax(0,1fr)` épingle l'écart au centre.

**Sur téléphone, un titre ne peut pas se fendre autour d'un objet de 130 px.**
Sous 768 px, il repasse sur une ligne au-dessus.

**Les règles CSS d'une page ne suivent pas le composant.** Une grille bento
copiée depuis `/hero-labs-2` est restée vide sur `/video-labs` : la règle
`.lab-bento` vivait dans l'autre page.

**Une étiquette d'onglet doit dire le métier du sample, pas celui de la vidéo.**
L'onglet annonçait « Salle de sport » et la page montrait un déménageur.

**Le serveur de développement meurt** sous un balayage des 315 routes — Turbopack
compile chaque route à la demande et ne rend pas la mémoire. Pour tout audit de
masse : `npm run build && npx next start`, un seul balayage à la fois.
