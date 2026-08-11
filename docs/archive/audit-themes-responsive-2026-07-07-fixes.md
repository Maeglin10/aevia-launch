# Fixes — grilles CSS rigides en style inline (§3.1 de l'audit)

Date : 2026-07-07
Suite de : `docs/audit-themes-responsive-2026-07-07.md` §3.1

## Méthode appliquée

- **Pattern 1** (préféré, cas simple — grille de cartes/stats homogènes) : `gridTemplateColumns: "repeat(N, 1fr)"` → `"repeat(auto-fit, minmax(XXXpx, 1fr))"`, XXX calculé pour que le rendu desktop reste à N colonnes identiques (largeur conteneur / N − gap, arrondi bas).
- **Pattern 2** (cas complexe — grille asymétrique avec `gridColumn`/`gridRow` span dépendant du contenu, ou élément `position: absolute` calé sur la grille) : ajout d'un `className` unique + bloc `<style>{`@media (max-width: 700px){ ... !important ... }`}</style>` inséré près de la racine du composant (ou extension d'un `<style>`/`globalStyles` existant si présent).
- `repeat(2, 1fr)` non touchés (2 colonnes passent déjà sur mobile).
- Grilles non-`repeat()` (ex. `"2fr 1fr 1fr"`, `"1fr 420px"`, layouts texte+image asymétriques) hors périmètre — non modifiées, conformément aux instructions.

Vérification finale : `grep -rE "repeat\([3-9], 1fr\)"` sur les 26 fichiers ne renvoie plus que les grilles traitées en pattern 2 (dont la valeur inline reste `repeat(N,1fr)` mais est neutralisée en mobile par le `!important` du `<style>`).

## Tableau des fixes

| Fichier | Grilles corrigées (lignes d'origine) | Pattern utilisé |
|---|---|---|
| impact-102 | 660 (stats, repeat 4) | 1 |
| impact-115 | 1280 (projects grid, `gridColumn: span 2` sur cartes "wide" → complexe) ; 1348 (philosophy, repeat 3) | 2 puis 1 |
| impact-135 | 1496, 1581, 1810, 1853, 1897 (stats/market/features/testimonials/pricing, repeat 3-4) | 1 (×5) |
| impact-14 | 1464 (stats, repeat 4) ; 1524 (destination masonry, `gridColumn`/`gridRow` span → complexe, extension du `globalStyles` existant) | 1 puis 2 |
| impact-163 | 906, 997, 1059, 1200 (authors/testimonials/pricing/footer links, repeat 3-4) | 1 (×4) |
| impact-166 | 1300, 1624 (series/testimonials, repeat 3) | 1 (×2) |
| impact-176 | 480, 1566, 1643, 1905, 1947 (metric cards/stats/features/testimonials/pricing, repeat 3-4) | 1 (×5) |
| impact-177 | 249 (stats, repeat 4 ; className Tailwind `grid-cols-2 md:grid-cols-4` déjà présent mais mort car écrasé par le style inline — laissé tel quel, non nécessaire une fois le fix appliqué) | 1 |
| impact-197 | 623, 654, 821, 853, 907 (stats/destinations/process/testimonials/packages, repeat 3-4) | 1 (×5) |
| impact-201 | 1881, 1970, 2127 (experiences/savoir-faire/testimonials, repeat 3-4) | 1 (×3) |
| impact-209 | 1481 (galerie photo, repeat 3) | 1 |
| impact-210 | 1429 (masonry gallery, `gridColumn`/`gridRow` span selon `item.aspect` → complexe) | 2 |
| impact-35 | 489 (stats, repeat 4) | 1 |
| impact-39 | 250, 305, 322, 355 (services/stats/testimonials/pricing, repeat 3-4 ; classNames Tailwind déjà présents mais morts, mêmes causes qu'impact-177) | 1 (×4) |
| impact-45 | 310 (portfolio gallery, repeat 3) | 1 |
| impact-48 | 843, 1791, 2088 (project grid/stats row 2/team cards, repeat 3-4 ; classNames `three-col`/`four-col` déjà présents mais sans définition CSS — laissés, dead code) | 1 (×3) |
| impact-57 | 543 (testimonials, repeat 3) | 1 |
| impact-58 | 644, 708 (stats bar/clients, full-bleed sans maxWidth, repeat 3-4) | 1 (×2) |
| impact-61 | 206, 289 (stats/typologies, repeat 4) | 1 (×2) |
| impact-63 | 216, 273, 359 (stats/collections/press, repeat 3-4) | 1 (×3) |
| impact-64 | 217 (stats, repeat 4) ; 255 (process 5 étapes avec ligne de connexion `position: absolute` calée sur la grille → complexe) ; 350 (testimonials, repeat 3) | 1, 2, 1 |
| impact-68 | 332 (stats, repeat 4 ; className `grid-stats-68` déjà présent mais sans définition CSS — laissé) | 1 |
| impact-69 | 227 (series grid, repeat 3) | 1 |
| impact-72 | 378 (process steps, repeat 4) | 1 |
| impact-83 | 355 (stats, repeat 4) | 1 |
| impact-96 | 1874 (pricing, repeat 3) | 1 |

**Total : 57 grilles rigides corrigées sur 26 fichiers** (4 en pattern 2 : impact-115 L1280, impact-14 L1524, impact-210 L1429, impact-64 L255 ; les 53 autres en pattern 1).

## Notes découvertes en cours de route

- **impact-177, impact-39** : ces fichiers avaient déjà des `className` Tailwind (`grid-cols-2 md:grid-cols-4`, `lg:grid-cols-2 md:grid-cols-1`, etc.) posés à côté du style inline — mais **inopérants**, car un style inline gagne toujours sur une classe externe pour la même propriété CSS, peu importe la spécificité Tailwind. Le fix pattern 1 (auto-fit/minmax en inline) règle le problème indépendamment de ces classes mortes, qui ont été laissées en place (hors périmètre de la mission : "ne refactore rien d'autre").
- **impact-48, impact-68** : classNames sémantiques (`three-col`, `four-col`, `grid-stats-68`) présents mais sans aucune définition CSS nulle part dans le repo (`app/globals.css` ni ailleurs) — même cause, laissés tels quels.
- **impact-14** : le fichier a un `globalStyles` (template string injecté via `<style dangerouslySetInnerHTML>`) déjà existant — le media query pour la grille masonry a été ajouté à la fin de ce bloc plutôt que dans un nouveau `<style>`, conformément à la consigne "si le fichier a déjà un `<style>`, étends-le".
- Aucun changement de rendu desktop constaté : tous les `minmax()` ont été calculés à partir de la largeur réelle du conteneur (`maxWidth` + `gap` + nombre de colonnes d'origine) pour que le nombre de colonnes desktop reste inchangé.

## Build

`npm run build` (Next.js) : **succès, aucune erreur introduite**. Aucune erreur préexistante rencontrée.
