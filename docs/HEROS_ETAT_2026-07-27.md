# Chantier heros — état au 27/07/2026

Doc de passation. À lire avant de reprendre, notamment pour la revue mobile.

---

## 1. Ce qui est fait

### Le kit — `lib/templates/hero-kit.tsx`

C'est la pièce centrale. Il contient le **vocabulaire de mouvement**, pas des
heros tout faits. Chaque thème compose sa propre mise en page par-dessus.

Le vocabulaire vient de mesures, pas de goût — voir
`docs/SLIDER_REVOLUTION_TEARDOWN.md` (129 étapes d'animation décodées) :

| Élément | Valeur | Pourquoi |
|---|---|---|
| `EASE_3` | `[0.65,0,0.35,1]` = power3.inOut | départ lent, vraie accélération |
| `EASE_4` | `[0.76,0,0.24,1]` = power4.inOut | idem, plus marqué |
| `BEAT` | 0 / 300 / 500 ms | un seul rythme pour tout le hero |
| sorties | 220 ms | voir le piège n°1 plus bas |

Primitives : `useHeroSelector`, `HeroStage` (photo + dérive lente 15 s),
`Scrim`, `GhostMark`, `Rise`, `Wipe`, `SelectorRail`, `heroSectionStyle`,
`railResponsiveCSS`. Toutes respectent `prefers-reduced-motion`.

### Les 5 heros reconstruits

| Thème | Métier | Composition — volontairement différente à chaque fois |
|---|---|---|
| **impact-37** | bar à vin | La carte des vins **est** le hero. 5 vins, rail bas. |
| **impact-46** | cabinet d'avocats | H1 **fixe** (la gravité ne bouge pas), c'est la *preuve* qui change : domaine + chiffre clé. |
| **impact-208** | construction | Fiche technique chiffrée (livraison / surface / niveaux / site), grille blueprint conservée **par-dessus** la photo. |
| **impact-30** | dentaire | Le seul sur fond **clair**. Photo cadrée dans un panneau, pas en plein écran. Prix dans le rail. |
| **impact-63** | horlogerie | Chaque montre porte sa **couleur d'accent** → le hero se reteinte à chaque sélection. |

---

## 2. Les pièges rencontrés (à ne pas re-découvrir)

**1. `AnimatePresence mode="wait"` bloque la ré-entrée.**
Avec une sortie longue, le rail affichait le vin 04 pendant que le texte
montrait encore le 01 — ~2 s de désynchro visible. Les sorties doivent porter
leur **propre** transition courte (`exit={{ ..., transition: {...} }}`).

**2. `justify-content: center` fait déborder par le haut.**
Quand le contenu dépasse la hauteur, un `center` classique pousse le haut
*au-dessus* du viewport, sous la navbar fixe. Le kit utilise `safe center`.

**3. Double réservation de l'espace navbar.**
Sur impact-63, `<main>` a déjà 70 px de padding pour dégager la navbar fixe.
Un hero en `100dvh` finissait donc exactement 70 px sous la ligne de
flottaison. D'où `heroSectionStyle(bg, { topOffset: 70 })`, qui soustrait
l'offset **et** du min-height **et** du padding-haut du hero.

**4. Le `min-height` réservé tue le mobile.**
Le bloc que le sélecteur change réserve une hauteur fixe sur desktop pour que
les CTA ne sautent pas. Sur 667 px, c'est précisément ça qui faisait déborder
4 heros sur 5. Il est relâché sous 640 px.

**5. Marques réelles sur des démos fictives.**
impact-63 affichait une Omega Seamaster et une Timex, logos lisibles, sur une
maison inventée. Même faute que impact-81 (Margiela, Saint Laurent…) et
impact-321 (Google, Microsoft…). **Toujours vérifier les photos produit.**

---

## 3. Conventions à respecter pour les prochains heros

Pour que les correctifs mobile du kit s'appliquent, le thème doit taguer :

```tsx
<div className="hero-detail" style={{ minHeight: 150, ... }}>  {/* le bloc qui change */}
<p className="hero-lede" ...>                                   {/* le chapô */}
<div className="hero-secondary" ...>                            {/* ce qu'on peut masquer sur mobile */}
```

Et appeler `railResponsiveCSS("hero", { titleClamp: "..." })` dans un `<style>`.

---

## 4. Vérifications passées

Mesuré au navigateur en 375×667 **et** 1440×900 pour les 5 :

- le hero tient entièrement dans le viewport (0 px de débordement)
- le CTA principal est visible sans scroller
- le rail sélecteur est visible
- 0 image cassée
- `tsc` : aucune nouvelle erreur

---

## 5. Ce qui reste

**Revue mobile (ta relecture de cette nuit).** Les 5 heros *tiennent* dans le
viewport, mais tenir n'est pas être beau. Points que je sais imparfaits :

- impact-46 : le bouton secondaire « Tous nos domaines » perd sa bordure au
  format mobile, il flotte.
- impact-63 : le tableau technique (mouvement / boîtier / étanchéité) est
  masqué sous 640 px. C'est un choix de place, pas forcément le bon.
- impact-30 : la photo cadrée disparaît sous 900 px. Le hero devient
  purement typographique — à valider.
- impact-208 : la fiche technique 4 cases est masquée sur mobile, alors que
  c'est l'argument le plus fort du thème.

**3 heros restants** sur les 8 visés. Candidats retenus dans les « 35 vraiment
plats » : impact-131 (château), impact-33 ou 90 (boulangerie),
impact-69 ou 31 (bien-être).

**Langue.** impact-46 avait une nav française et un corps anglais. J'ai passé
le hero et les 6 domaines en français, le reste du corps est **toujours en
anglais**. Même problème sur impact-37 (« Curated from the world's finest
regions »). À traiter comme un chantier à part.

**Les captures vidéo Slider Revolution.** Leur site bloque l'automatisation :
je n'ai jamais vu une de leurs animations tourner. Le teardown me donne les
chiffres (courbes, timings, profondeur 3D), pas le ressenti. Tes vidéos
serviraient surtout à caler le *tempo* et les effets d'entrée que je n'ai pas
pu observer.
