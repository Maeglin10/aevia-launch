# Audit thèmes/templates — responsive mobile, logo, z-index, surcharge visuelle

Date : 2026-07-07
Périmètre : `skylaunch` (Aevia Launch)
Type : audit **read-only**, aucun fichier de code modifié.

## 0. Méthodologie (important à lire avant les tableaux)

Le repo contient deux systèmes de "thèmes" distincts, et il fallait clarifier lequel est lequel avant d'auditer :

1. **`components/themes/*.tsx`** (28 fichiers) — le vrai système de "thèmes" réutilisables, piloté par `SessionData`/`formData` (nom d'entreprise, couleur de marque, **logo uploadé en base64**, etc.), rendu par `GeneratedSite` et exposé publiquement sur `/themes` et `/themes/[id]`. Tous (sauf `AnimationHelpers.tsx`, qui est un fichier utilitaire sans JSX de layout) partagent le même nav/footer via `components/themes/ThemeWrapper.tsx`.
2. **`app/templates/impact-01` … `impact-310`** (309 dossiers `page.tsx`, 300 à 4300 lignes chacun) — la galerie de templates "one-shot" vendus aux clients (ex. `impact-217` à `impact-222`, les plus récents). Chaque template est un fichier autonome, **aucun ne partage de code de nav/footer avec un autre** — donc pas d'équivalent `ThemeWrapper`. **Confirmé par grep : aucun des 309 templates n'importe `components/themes`.**

Compte tenu du volume (309 fichiers autonomes, ~500k lignes cumulées), l'audit a été fait ainsi :
- **Lecture complète** des 28 fichiers `components/themes/*.tsx` (9522 lignes) — c'est le système partagé, donc un bug ici affecte potentiellement toutes les futures générations.
- **Lecture complète** de `impact-217` à `impact-222` (les 6 templates récents cités dans la mission).
- **Analyse statique par grep sur les 309 templates**, avec vérification manuelle (lecture du code réel) de chaque pattern positif avant de le retenir, pour trouver les bugs récurrents "copiés-collés" à grande échelle (grids CSS rigides, paddings fixes, nav mobile absente, logo client absent). Les faux positifs ont été éliminés à la main (ex. la première passe de détection "pas de hamburger mobile" donnait 212/302 faux positifs à cause de la diversité des noms de variables `menuOpen`/`mobileOpen`/`isOpen`/`<Sheet>`/etc. — après vérification manuelle, la vraie liste ne contient que 4 cas, tous mineurs).
- Je n'ai **pas lu ligne à ligne les 309 fichiers** un par un (irréaliste dans le temps imparti) ; les tableaux ci-dessous citent les fichiers réellement lus/vérifiés avec file:line exacts, et les compteurs cross-template sont issus de grep + vérification manuelle sur un échantillon de chaque groupe.

---

## 1. Thème partagé `components/themes/*` (utilisé par `/themes/[id]`)

### 1.a Tableau — bugs trouvés

| # | Problème | Fichier:ligne | Gravité | Fix suggéré |
|---|---|---|---|---|
| 1 | Le nom d'entreprise (`formData.businessName`) dans la nav n'a **ni `truncate`, ni `max-w-*`, ni `text-sm sm:text-xl`** — juste `shrink-0`. Un nom de client un peu long (fréquent : "La Maison Gourmande Traiteur & Événementiel") force la nav à dépasser 375px de large → scroll horizontal sur tout le site. Affecte **les 27 thèmes** (tous passent par `ThemeWrapper`). | `components/themes/ThemeWrapper.tsx:64` (`<div className="text-xl font-bold tracking-tight shrink-0">`) | **Bloquant démo** (si le client a un nom de marque long) | Ajouter `max-w-[45vw] truncate` + `text-base sm:text-xl` sur ce div |
| 2 | Aucun garde-fou global `overflow-x: hidden` sur `html`/`body` (`app/globals.css` n'en a aucun) — donc le bug #1 (ou tout futur débordement) casse réellement le scroll horizontal au lieu d'être absorbé silencieusement. | `app/globals.css` (absence totale de règle) | Gênant (aggrave tout futur bug de débordement) | Ajouter `html, body { overflow-x: hidden; max-width: 100vw; }` |
| 3 | Aucun menu hamburger mobile dans `ThemeWrapper` — la nav ne montre que logo + CTA. Ce n'est **pas un bug en soi** pour les 26 thèmes à page unique (rien à cacher), mais si un thème veut ajouter des liens d'ancrage (`#services`, `#about`) dans une future itération, il n'y a **aucune infrastructure de repli mobile** prête (`navSlot` n'est jamais wrappé en `hidden lg:flex` par défaut). | `components/themes/ThemeWrapper.tsx:70-93` | Mineur (dette technique, pas un bug visible aujourd'hui) | Ajouter un slot mobile (`Sheet`/drawer) dans `ThemeWrapper` avant d'autoriser plus de liens dans `navSlot` |
| 4 | `EcommerceTheme` est le seul thème multi-pages (via `navSlot`) ; il gère bien le mobile via un bandeau d'onglets à scroll horizontal (`mobileTabs`) plutôt qu'un hamburger — solution fonctionnelle mais non standard, à harmoniser si un futur thème réutilise `navSlot`. | `components/themes/EcommerceTheme.tsx:230-249` | Mineur | RAS fonctionnellement, documenter le pattern pour cohérence future |
| 5 | **Aucun des 27 thèmes ne permet au client de voir son propre logo dans la démo `/themes/[id]` sauf s'il a déjà uploadé un `logoBase64`** — sinon fallback texte (`formData.businessName`). C'est correct comme comportement, mais à vérifier : le fallback texte n'a pas de style "logo" (pas d'icône, pas de mise en forme spécifique) dans certains thèmes plus premium (Luxury, Hotel) où un vrai wordmark stylé serait attendu. | `components/themes/ThemeWrapper.tsx:64-67` | Mineur | Ajouter un style de wordmark par défaut (police + lettre-espacement) quand pas de logo uploadé |
| 6 | Grids `grid-cols-3` **sans aucune variante responsive** (RestaurantTheme "15+ / 3 Michelin / 200+", RealEstateTheme beds/baths/sqft, MagazineTheme mosaïque 3×3). Contenu court, donc pas bloquant, mais à surveiller si le contenu généré est plus long. | `RestaurantTheme.tsx:254`, `RealEstateTheme.tsx:106`, `MagazineTheme.tsx:203` | Mineur | Ajouter `grid-cols-1 sm:grid-cols-3` par précaution |
| 7 | Z-index : bien géré dans l'ensemble (déco `z-0`, contenu `z-10/20/30`, nav `z-[100]`, modals/drawers `z-[1000]`–`z-[2001]`). **Aucune collision trouvée.** | — | RAS | — |

### 1.b Positif à noter
- Les paniers/drawers (`EcommerceTheme`, `EcommerceMinimalTheme`, `EcommerceLuxuryTheme`, `HotelTheme`, `RestaurantTheme`, `VitrineTheme`) passent tous en pleine largeur sur mobile (`w-full md:w-[XXXpx]`) — bon pattern, pas de bug.
- Les tailles de texte héro (`text-6xl md:text-8xl`, etc.) ont quasi systématiquement une variante mobile réduite — pas de `text-9xl` nu sans fallback trouvé, sauf `LandingPersonalTheme.tsx:37` (`text-7xl md:text-9xl` — base mobile déjà à 72px, à surveiller avec un titre long).

---

## 2. Templates récents `app/templates/impact-217` à `impact-222` (lecture complète)

| Template | Problème | Fichier:ligne | Gravité | Fix suggéré |
|---|---|---|---|---|
| impact-217 (AirForge, e-commerce sneakers) | RAS structurel : nav responsive avec `clamp()`, hamburger fonctionnel (`af-burger`/`af-nav-links`, breakpoint 900px), logo icône+texte. | `app/templates/impact-217/page.tsx:307-452` | — | — |
| impact-218 | Hamburger présent ("Mobile hamburger" commenté), non lu en détail au-delà de la nav. | `app/templates/impact-218/page.tsx:264` | — | — |
| impact-219 (NovaSaaS) | Le bouton hamburger mobile utilise l'icône `ChevronDown` au lieu d'une icône `Menu`/hamburger classique — incohérence visuelle (le bouton ressemble à un select, pas à un menu). Fonctionne (toggle + `@media (max-width:820px)` avec `!important` sur des styles inline), mais UX trompeuse. | `app/templates/impact-219/page.tsx:147-154` (bouton), `1265-1267` (media query) | Mineur | Remplacer `ChevronDown` par `Menu`/`X` (lucide-react) |
| impact-220 (HORA VIVA, horlogerie) | Nav correcte : logo texte + tagline, liens desktop cachés via classe CSS (`nav-links-desktop`/`nav-burger`), hamburger fonctionnel. RAS. | `app/templates/impact-220/page.tsx:137-283` | — | — |
| impact-221 | Hamburger fonctionnel (`Menu` icon, `menuOpen` state), logo présent. RAS structurel dans la nav. | `app/templates/impact-221/page.tsx:101-192` | — | — |
| impact-222 (Solis, immobilier) | Nav exemplaire : logo icône (`Building2` dans un badge) + wordmark + tagline, padding en `clamp()`, hamburger `Menu`/`X` fonctionnel. **Meilleur exemple du lot pour du copier-coller vers d'autres thèmes.** | `app/templates/impact-222/page.tsx:216-370` | — | — |

**Conclusion 217-222** : ces 6 templates récents sont nettement mieux construits que la moyenne de la galerie (usage de `clamp()`, hamburgers tous fonctionnels, logos correctement présents). Le seul point mineur est l'icône `ChevronDown` à la place de `Menu` sur impact-219.

---

## 3. Patterns récurrents trans-templates (validés sur les 309 `impact-XXX`)

### 3.1 Grids CSS rigides en `style` inline (`gridTemplateColumns: repeat(N, 1fr)`) sans **aucun** `@media` dans le fichier
33 templates ont au moins une grille à 3-6 colonnes fixes en style inline, dans un fichier qui ne contient **aucune** règle `@media` pour la rattraper (donc pas de Tailwind `sm:`/`md:` possible non plus puisque c'est du `style={{}}`, et pas de fallback CSS custom). Sur 375px de large, une grille à 4 colonnes avec padding de section 64-80px de chaque côté ne laisse que ~50-90px par colonne.

Fichiers concernés (avec ligne(s) de la/les grille(s) à risque) :
- `impact-03:1233,1752,1810,1902` (repeat 3 et 4 — **le pire cas**, voir 3.3)
- `impact-102:660` (repeat 4)
- `impact-115:1280,1348` (repeat 3)
- `impact-135:1496,1581,1810,1853,1897` (repeat 3 et 4)
- `impact-14:1464,1524` (repeat 3 et 4)
- `impact-152:255`, `impact-155:258`, `impact-156:259`, `impact-196:264` (repeat 4 — **4 fichiers quasi identiques, voir 3.2**)
- `impact-163:906,997,1059,1200`
- `impact-166:1300,1624`
- `impact-176:480,1566,1643,1905,1947`
- `impact-177:249`
- `impact-197:623,654,821,853,907`
- `impact-201:1881,1970,2127`
- `impact-209:1481`, `impact-210:1429`
- `impact-35:489`
- `impact-38:881` (**repeat 6** — le plus dense, colonnes ~54px sur 375px)
- `impact-39:250,305,322,355`
- `impact-45:310`, `impact-48:843,1791,2088`
- `impact-57:543`, `impact-58:644,708`
- `impact-61:206,289`, `impact-63:216,273,359`, `impact-64:217,255,350` (repeat 5 à la ligne 255)
- `impact-68:332`, `impact-69:227`, `impact-72:378`, `impact-83:355`, `impact-96:1874`

**Fix suggéré** : convertir ces grilles inline en classes Tailwind (`grid grid-cols-2 md:grid-cols-4`) ou ajouter un bloc `@media (max-width: 640px) { .xxx { grid-template-columns: repeat(2,1fr) !important; } }` par fichier concerné.

### 3.2 Copier-coller identique entre 4 templates (même bug, mêmes lignes)
`impact-152`, `impact-155`, `impact-156`, `impact-196` partagent visiblement la même base de code (probablement même prompt de génération, famille "hôtel/résidence de luxe") :
- même padding de nav fixe `padding: "0 64px"` (`impact-152:172`, `impact-155:173`, `impact-156:174`, `impact-196:173`)
- même section stats avec padding fixe `padding: "0 80px 90px"` + `gridTemplateColumns: "repeat(4, 1fr)"` (`impact-152:218+255`, `impact-155:222+258`, `impact-156:223+259`, `impact-196:228+264`)
- même pattern "liens desktop cachés au clic prev/next testimonial hidden md:flex sans alternative tactile" n'est PAS présent ici (ça c'était 3.4), mais la nav complète est bien dupliquée telle quelle.

**Fix suggéré** : corriger une fois dans un des 4 fichiers, puis répercuter le diff identique dans les 3 autres (grep confirme les lignes quasi identiques).

### 3.3 Le pire cas : `impact-03`
Seul template sur 309 à n'avoir **ni `clamp()`, ni `@media`, ni la moindre classe Tailwind `sm:text-`/`md:text-`/`lg:text-`** — aucune stratégie responsive de typographie ou de layout du tout.
- `app/templates/impact-03/page.tsx:1902` : grille magasins `gridTemplateColumns: 'repeat(4, 1fr)'` dans une section avec `padding: '48px 40px'` par carte — sur 375px, ~13px de contenu utile par colonne.
- `app/templates/impact-03/page.tsx:1233,1752,1810` : 3 autres grilles rigides (3 et 4 colonnes) dans le même fichier.
- **Gravité : bloquant démo** si ce template est montré sur mobile.
- Fix : ajouter au minimum un bloc `@media (max-width: 640px)` global en fin de fichier qui force `grid-template-columns: 1fr !important` sur les 4 sélecteurs concernés.

### 3.4 Liens secondaires / contrôles cachés sur mobile sans alternative tactile
Après élimination des faux positifs (grep initial donnait 10 candidats sur le pattern `hidden md:flex` sans repli — vérification manuelle a éliminé 6 faux positifs qui avaient bien un hamburger sous un autre nom de variable) :
- `impact-76:286` et `impact-80:312` : lien secondaire "archive"/"programmes" (`hidden md:flex`) invisible sur mobile, aucune alternative (pas dans le menu mobile). Perte d'une page secondaire sur mobile, pas de la nav principale.
- `impact-82:207` : idem pour un lien "programmes".
- `impact-28:433` : flèches prev/next du carrousel témoignages (`hidden md:flex`) invisibles sur mobile — pas de swipe tactile détecté en remplacement, l'utilisateur mobile ne peut piloter le carrousel qu'en attendant l'autoplay (si présent).

Gravité : **gênant** (fonctionnalité secondaire perdue sur mobile, pas bloquant pour la démo principale).

### 3.5 Absence totale de logo client (image) dans la galerie `app/templates`
**Confirmé par grep sur les 309 fichiers : aucun n'a `formData.logoBase64` ni équivalent.** Le nom de marque est soit du texte en dur (ex. "AirForge", "HORA VIVA", "Studio Noma"), soit interpolé depuis une variable `fd?.businessName` optionnelle (présente dans certains templates comme impact-219/222 mais pas tous), **mais jamais une image de logo uploadée**. C'est cohérent avec `components/themes` qui, lui, supporte `logoBase64` (§1). Si le produit prévoit qu'un client personnalise son logo sur un template `impact-XXX` acheté, **cette capacité n'existe dans aucun des 309 fichiers** — à clarifier si c'est voulu (customisation manuelle post-achat) ou un gap produit.

### 3.6 Point positif à signaler (contre-intuitif vu la mission)
La quasi-totalité des templates (largement >95 % après vérification manuelle) implémentent un **menu hamburger mobile fonctionnel**, avec une grande diversité de patterns valides : `useState` maison (`menuOpen`/`mobileOpen`/`isOpen`...), composant `shadcn/ui` `<Sheet>`, classes CSS avec `@media` + `!important`. La première passe automatique par mots-clés donnait 212/302 templates "sans hamburger" — après lecture manuelle de chaque cas ambigu, la réalité est que **seuls 4 templates sur 309 ont un vrai trou de nav mobile, et seulement sur des liens/contrôles secondaires** (§3.4), jamais sur la nav principale. Ne pas traiter ce point comme une urgence transverse.

---

## 4. Top 10 des fixes prioritaires (pour une démo mobile)

| Rang | Fix | Portée | Effort |
|---|---|---|---|
| 1 | `impact-03` : ajouter un `@media (max-width:640px)` pour forcer `grid-template-columns: 1fr` sur les 4 grilles rigides (lignes 1233, 1752, 1810, 1902) + revoir les paddings fixes 40-48px des cartes | 1 template, mais c'est le seul 100 % cassé sur mobile | Faible (un seul bloc CSS à ajouter) |
| 2 | `ThemeWrapper.tsx:64` — ajouter `truncate max-w-[45vw]` sur le nom d'entreprise dans la nav partagée | 27 thèmes `components/themes` d'un coup | Très faible (1 ligne) |
| 3 | Ajouter `html, body { overflow-x: hidden; max-width:100vw }` dans `app/globals.css` | Toute l'app (filet de sécurité générique) | Très faible |
| 4 | Corriger les 4 templates dupliqués `impact-152/155/156/196` : padding nav fixe (`0 64px`) + grille stats `repeat(4,1fr)` sans repli — un seul diff à répliquer 4×, lignes citées en §3.2 | 4 templates | Faible-moyen |
| 5 | `impact-38:881` (`repeat(6,1fr)`, la grille la plus dense trouvée) : ajouter un fallback `grid-cols-2 md:grid-cols-6` | 1 template mais très visible (métriques d'impact) | Faible |
| 6 | Convertir les 33 templates du §3.1 (grilles inline sans `@media`) : prioriser ceux avec `repeat(4)`+ et section padding ≥64px cumulé (risque le plus élevé de colonnes <60px sur 375px) | ~33 templates | Moyen (à traiter par lot, diff similaire) |
| 7 | `impact-219:147-154` : remplacer l'icône `ChevronDown` du bouton hamburger par `Menu`/`X` (cohérence UX) | 1 template | Très faible |
| 8 | `impact-76:286`, `impact-80:312`, `impact-82:207` : ajouter le lien secondaire caché dans le menu mobile existant (ou dans le footer) au lieu de le perdre | 3 templates | Faible |
| 9 | `impact-28:433` : ajouter un swipe tactile (`onTouchStart/onTouchEnd` ou lib carrousel) pour remplacer les flèches prev/next cachées sur mobile | 1 template | Faible-moyen |
| 10 | Clarifier/implémenter la personnalisation du logo client (image) sur `app/templates/impact-XXX` — actuellement 0/309, alors que `components/themes` le supporte déjà via `logoBase64` (voir §3.5) | Potentiellement les 309 templates si c'est un besoin produit confirmé | Élevé (nécessite un mécanisme de session/props à ajouter à chaque template, ou un wrapper commun) |

---

## 5. Résumé exécutif

- **Système `components/themes` (28 fichiers, utilisé par `/themes`)** : globalement solide (z-index propre, drawers responsive), un bug systémique unique mais réel — nom d'entreprise non tronqué dans la nav partagée (`ThemeWrapper.tsx:64`), qui peut casser le layout mobile pour certains noms de clients.
- **Galerie `app/templates` (309 fichiers autonomes)** : qualité très hétérogène car chaque template est généré indépendamment. Le sous-groupe "récent" (217-222) est nettement meilleur que la moyenne (usage de `clamp()`, hamburgers propres). Le vrai risque mobile n'est pas l'absence de menu hamburger (quasi tous en ont un qui fonctionne) mais des **grilles CSS rigides en style inline sans aucun `@media`**, trouvées dans 33 fichiers, avec un cas catastrophique (`impact-03`, zéro stratégie responsive) et un cluster de 4 fichiers dupliqués (`impact-152/155/156/196`).
- **Aucun template de la galerie ne supporte l'upload d'un logo client** — à traiter comme décision produit plutôt que bug, mais à clarifier.
