# Antigravity Prompts — Skylaunch Theme Batch

> Ces prompts sont à passer à Antigravity dans Skylaunch (`~/skylaunch`).
> Chaque section = un prompt complet et autonome.

---

## CONTEXTE COMMUN (inclure au début de chaque prompt)

```
Tu travailles sur le projet Skylaunch (~/skylaunch), une app Next.js 16 de génération de sites web.

Règles absolues pour chaque template :
- Fichier : app/templates/impact-XXX/page.tsx
- TOUJOURS commencer par 'use client';
- Imports autorisés UNIQUEMENT : react, framer-motion, lucide-react
- Aucune dépendance externe supplémentaire
- TypeScript strict, pas de `any`
- Photos : Unsplash uniquement (URLs réelles avec paramètres ?q=80&w=1600&auto=format&fit=crop)
- Animations : Framer Motion (useScroll, useTransform, useInView, motion.div, AnimatePresence)
- Icônes : Lucide React uniquement
- Structure : Palette C = {} en haut, SERIF + SANS font constants, PHOTO = {} pour Unsplash
- Format commentaire section : /* ════════ SECTION NAME ════════ */
- 10+ sections distinctes par page (navbar, hero, services/menu, about, galerie, témoignages, stats/chiffres, FAQ ou spécifique métier, contact, footer)
- Hero : TOUJOURS photo Unsplash plein écran (110-115vh), overlay gradient, texte en bas avec stagger animations
- Qualité de référence : lis d'abord app/templates/impact-290/page.tsx et app/templates/impact-291/page.tsx
- Après avoir créé le fichier page.tsx, ajoute l'entrée dans lib/templates/registry.ts à la fin du tableau TEMPLATES_REGISTRY
- Commit : git add app/templates/impact-XXX/page.tsx lib/templates/registry.ts && git commit -m "feat(templates): add impact-XXX — NomTemplate"
```

---

## PROMPT 1 — Batch Fast-Food (5 thèmes, impact-292 à 296)

```
CONTEXTE COMMUN (voir ci-dessus)

Crée 5 templates fast-food / restauration rapide en une seule passe. IDs : impact-292, 293, 294, 295, 296.

Pour chaque template :
- Lis d'abord app/templates/impact-290/page.tsx pour comprendre la structure exacte
- Crée app/templates/impact-XXX/page.tsx
- Ajoute l'entrée dans lib/templates/registry.ts

=== TEMPLATE 1 : impact-292 — BurgerCo ===
Business : Burger artisanal urbain, Paris 9e
Palette : noir charbon #0d0d0d, jaune moutarde #f5a623, blanc cassé #f0ede6, rouge brique #c0392b
Fonts : SERIF = 'Bebas Neue', sans-serif (headlines massifs) / SANS = 'Barlow', sans-serif
Style : DARK, très urban, bold, néon minimal
Photos Unsplash : burger gourmet, cuisine ouverte, salle industrielle brique, food close-up
Sections spécifiques : menu avec catégories (burgers classiques / premium / végé), compteur de commandes du jour, badge "local sourcing", cards combo avec prix, CTA "Commander maintenant"
registry : { id: "impact-292", name: "BurgerCo", description: "Burger artisanal Paris 9e — steaks homemade, frites fraîches, livraison. Bebas Neue, noir / jaune moutarde.", category: "Food & Drink", style: "Dark", tags: ["Fast-Food", "Burger", "Paris", "Vitrine"], tier: "Premium", sections: 11 }

=== TEMPLATE 2 : impact-293 — Pizza Napoli Express ===
Business : Pizzeria napolitaine rapide, Lyon Presqu'île
Palette : rouge tomate #c0392b, crème ivoire #faf7f0, vert basilic #2d6a2d, miel brun #8b5e3c
Fonts : SERIF = 'Cormorant Garamond', serif / SANS = 'Nunito', sans-serif
Style : LIGHT, chaleureux, napolitain authentique
Photos Unsplash : pizza margherita sortie du four, four à bois, chef qui étale la pâte, pizzeria animée
Sections spécifiques : carte pizza avec ingrédients, compteur "pizzas cuites aujourd'hui", badge "Farine 00 Napolitaine", temps de livraison estimé, section four à bois artisanal
registry : { id: "impact-293", name: "Pizza Napoli Express", description: "Pizzeria napolitaine Lyon Presqu'île — four à bois, pâte 72h, livraison 30 min. Cormorant Garamond, rouge / ivoire.", category: "Food & Drink", style: "Light", tags: ["Fast-Food", "Pizza", "Lyon", "Vitrine"], tier: "Premium", sections: 10 }

=== TEMPLATE 3 : impact-294 — Sultan Kebab & Grill ===
Business : Kebab & cuisine méditerranéenne, Marseille Noailles
Palette : cuivre chaud #b5651d, sable ocre #d4a853, blanc #ffffff, bordeaux profond #722f37
Fonts : SERIF = 'Playfair Display', serif / SANS = 'Poppins', sans-serif
Style : VIBRANT, méditerranéen, épicé, généreux
Photos Unsplash : kebab viande grillée, épices colorées, assiette mezze, four à braise, salle animée
Sections spécifiques : carte avec catégories (kebab / assiette / mezze / boissons), badge "Viande halal certifiée", section épices & origine, formule midi avec prix, CTA click & collect
registry : { id: "impact-294", name: "Sultan Kebab & Grill", description: "Kebab & grill méditerranéen Marseille — viande halal, mezze, click & collect. Playfair Display, cuivre / sable.", category: "Food & Drink", style: "Vibrant", tags: ["Fast-Food", "Kebab", "Marseille", "Vitrine"], tier: "Premium", sections: 10 }

=== TEMPLATE 4 : impact-295 — Wok Master ===
Business : Asian fast-food / wok & sushi, Paris 13e
Palette : laque rouge #c0111f, or japonais #d4a843, charbon #1a1a1a, papier blanc #f8f5f0
Fonts : SERIF = 'Noto Serif JP', serif / SANS = 'DM Sans', sans-serif
Style : DARK, asiatique moderne, épuré mais vibrant
Photos Unsplash : wok flammes, bol ramen, sushi roll, chef asiatique, épicerie fine asiatique
Sections spécifiques : menu avec onglets (wok / sushi / ramen / bento), badge "Fresh daily", timer livraison live, section "nos sauces maison", formule bento midi
registry : { id: "impact-295", name: "Wok Master", description: "Asian fast-food Paris 13e — wok, sushi, ramen. Noto Serif JP, rouge laque / or.", category: "Food & Drink", style: "Dark", tags: ["Fast-Food", "Asian", "Paris", "Vitrine"], tier: "Premium", sections: 11 }

=== TEMPLATE 5 : impact-296 — Caliente Tacos ===
Business : Tacos & burritos mexicains, Bordeaux Victoire
Palette : orange vif #e8521a, vert avocat #4a7c59, jaune maïs #f2c11e, terre cuite #8b4513
Fonts : SERIF = 'Oswald', sans-serif / SANS = 'Inter', sans-serif
Style : VIBRANT, festif, mexicain authentique, coloré
Photos Unsplash : tacos garnis, avocats, cuisine mexicaine, salle déco cactus, nachos
Sections spécifiques : carte avec catégories (tacos / burritos / nachos / drinks), badge "Recettes originales Oaxaca", section "nos sauces piquantes 🌶️ à 🌶️🌶️🌶️", formule déjeuner, CTA "Commandez via Uber Eats / Deliveroo"
registry : { id: "impact-296", name: "Caliente Tacos", description: "Tacos & burritos mexicains Bordeaux Victoire — recettes Oaxaca, sauces maison. Oswald, orange / vert avocat.", category: "Food & Drink", style: "Vibrant", tags: ["Fast-Food", "Mexican", "Bordeaux", "Vitrine"], tier: "Premium", sections: 10 }

Après avoir créé les 5 templates :
- git add app/templates/impact-29{2,3,4,5,6}/ lib/templates/registry.ts
- git commit -m "feat(templates): add impact-292..296 — fast-food batch (burger, pizza, kebab, asian, tacos)"
```

---

## PROMPT 2 — 5ème variantes (14 secteurs à compléter)

```
CONTEXTE COMMUN (voir ci-dessus)

Les 14 secteurs du wizard Skylaunch ont chacun exactement 4 templates. 
Il faut créer un 5ème template pour chaque secteur.
IDs à utiliser : impact-297 à impact-310.

Pour chaque template, lis les 4 variantes existantes du secteur avant de créer (pour ne pas répéter un style déjà fait).

Règle : diversifier la ville, le style (Dark vs Light), la palette et le concept par rapport aux 4 existants.

=== SECTEUR : médecin (impact-297) ===
Existants : impact-243 (Strasbourg), impact-257 (Bordeaux), impact-274 (Lyon), impact-285 (Nantes)
À créer : Médecin généraliste Toulouse Capitole — médecine sportive & prévention. Spectral + Mulish. Violet aubergine / or doux. Style LIGHT.
registry : { id: "impact-297", name: "Dr. Camille Faure", description: "Médecin généraliste Toulouse Capitole — médecine sportive, prévention, téléconsultation. Spectral, violet / or.", category: "Health", style: "Light", tags: ["Médecin", "Toulouse", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : dentiste (impact-298) ===
Existants : impact-237 (Nice), impact-252 (Lyon), impact-273 (Strasbourg), impact-284 (Bordeaux)
À créer : Chirurgien-dentiste Montpellier Antigone — implantologie, orthodontie adulte. EB Garamond + DM Sans. Turquoise méditerranéen / blanc. Style LIGHT.
registry : { id: "impact-298", name: "Dr. Estelle Blanc", description: "Chirurgien-dentiste Montpellier Antigone — implantologie, orthodontie invisible. EB Garamond, turquoise / blanc.", category: "Health", style: "Light", tags: ["Dentiste", "Montpellier", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : kine (impact-299) ===
Existants : impact-238 (Rennes), impact-253 (Paris), impact-272 (Bordeaux), impact-283 (Montpellier)
À créer : Kinésithérapeute du sport Lyon Confluence — football, running, natation. Barlow Condensed + Open Sans. Bleu roi / orange sport. Style DARK.
registry : { id: "impact-299", name: "KinéPro Sport Lyon", description: "Kinésithérapeute du sport Lyon Confluence — athlètes, rééducation post-op, dry needling. Barlow Condensed, bleu / orange.", category: "Health", style: "Dark", tags: ["Kinésithérapeute", "Lyon", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : ostéo (impact-300) ===
Existants : impact-248 (Paris), impact-264 (Nantes), impact-279 (Lyon), impact-291 (Strasbourg)
À créer : Ostéopathe périnatal & pédiatrique Nice Cimiez — nourrissons, femmes enceintes, post-partum. Merriweather + Lato. Rose doux / vert sauge. Style LIGHT.
registry : { id: "impact-300", name: "Ostéo Périnatal Nice", description: "Ostéopathe périnatal Nice Cimiez — nourrissons, grossesse, post-partum. Merriweather, rose / vert sauge.", category: "Health", style: "Light", tags: ["Ostéopathe", "Nice", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : avocat (impact-301) ===
Existants : impact-239 (Paris), impact-255 (Toulouse), impact-275 (Marseille), impact-286 (Lyon)
À créer : Avocat droit des affaires & startups Bordeaux Chartrons — M&A, levées de fonds, RGPD. Cormorant Garamond + Inter. Gris ardoise / or. Style DARK.
registry : { id: "impact-301", name: "Dubois & Partenaires", description: "Avocat droit des affaires Bordeaux — M&A, startups, RGPD. Cormorant Garamond, ardoise / or.", category: "Services", style: "Dark", tags: ["Avocat", "Bordeaux", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : comptable (impact-302) ===
Existants : impact-242 (Nantes), impact-254 (Paris), impact-261 (Bordeaux), impact-289 (Strasbourg)
À créer : Expert-comptable Toulouse — TPE e-commerce, créateurs de contenu, auto-entrepreneurs. Raleway + Source Sans. Bleu indigo / corail. Style LIGHT.
registry : { id: "impact-302", name: "Nexus Compta", description: "Expert-comptable Toulouse — e-commerce, créateurs de contenu, auto-entrepreneurs. Raleway, indigo / corail.", category: "Finance", style: "Light", tags: ["Expert-comptable", "Toulouse", "Cabinet", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : coach (impact-303) ===
Existants : impact-240 (Lyon), impact-256 (Marseille), impact-276 (Bordeaux), impact-287 (Nice)
À créer : Coach sportif online & présentiel Paris Est — transformations corps, nutrition, suivi app. Poppins + Poppins (mono-font). Noir mat / vert néon. Style DARK.
registry : { id: "impact-303", name: "Studio Peak Performance", description: "Coach sportif Paris Est — transformation physique, nutrition, suivi app. Poppins, noir / vert néon.", category: "Sports", style: "Dark", tags: ["Coach Sportif", "Paris", "Fitness", "Vitrine"], tier: "Premium", sections: 11 }

=== SECTEUR : plombier (impact-304) ===
Existants : impact-246 (Marseille), impact-260 (Lyon), impact-278 (Toulouse), impact-290 (Rennes)
À créer : Plombier-chauffagiste Paris Île-de-France — urgences 24h/7j, PAC, rénovation salle de bain. Montserrat + Roboto. Rouge pompier / blanc. Style DARK.
registry : { id: "impact-304", name: "Rapido Plomberie Paris", description: "Plombier-chauffagiste Paris — urgences 24h/7j, PAC, rénovation. Montserrat, rouge / blanc.", category: "Services", style: "Dark", tags: ["Plombier", "Paris", "Artisan", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : electricien (impact-305) ===
Existants : impact-236 (Île-de-France), impact-247 (Toulouse), impact-277 (Paris), impact-288 (Nantes)
À créer : Électricien Bordeaux Mériadeck — tertiaire, smart home, alarmes. Exo 2 + Roboto. Bleu nuit / lime électrique. Style DARK.
registry : { id: "impact-305", name: "Courant Fort Bordeaux", description: "Électricien tertiaire Bordeaux — smart home, alarmes, domotique. Exo 2, bleu nuit / lime.", category: "Services", style: "Dark", tags: ["Électricien", "Bordeaux", "Artisan", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : boulangerie (impact-306) ===
Existants : impact-245 (Lyon), impact-259 (Strasbourg), impact-269 (Bordeaux), impact-282 (Lille)
À créer : Boulangerie-pâtisserie artisanale Montpellier — pains spéciaux, brunchs, commandes événements. Libre Baskerville + Nunito. Ocre blé / vert forêt. Style LIGHT.
registry : { id: "impact-306", name: "La Miette Heureuse", description: "Boulangerie-pâtisserie Montpellier — pains spéciaux, brunch, commandes événements. Libre Baskerville, ocre / vert.", category: "Food & Drink", style: "Light", tags: ["Boulangerie", "Montpellier", "Artisan", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : mariage (impact-307) ===
Existants : impact-244 (Paris), impact-251 (Bordeaux), impact-266 (Nice), impact-280 (Strasbourg)
À créer : Wedding planner Lyon — mariages intimistes 20-80 pers., cérémonies laïques, décoration florale organique. Cinzel + Lato. Champagne / vert eucalyptus. Style LIGHT.
registry : { id: "impact-307", name: "Lumière & Vœux Lyon", description: "Wedding planner Lyon — mariages intimistes, cérémonies laïques, floral organique. Cinzel, champagne / eucalyptus.", category: "Events", style: "Light", tags: ["Mariage", "Lyon", "Wedding", "Vitrine"], tier: "Premium", sections: 11 }

=== SECTEUR : couture (impact-308) ===
Existants : impact-235 (Paris), impact-258 (Marseille), impact-265 (Lyon), impact-281 (Paris)
À créer : Créatrice de mode upcycling Bordeaux — collections capsule éco-responsables, ateliers DIY. Josefin Sans + Josefin Sans. Noir & blanc + accent terracotta. Style LIGHT.
registry : { id: "impact-308", name: "Re-Thread Studio", description: "Mode upcycling Bordeaux — collections éco, ateliers DIY, pièces uniques. Josefin Sans, noir / terracotta.", category: "Luxury", style: "Light", tags: ["Couture", "Bordeaux", "Mode", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : tatoueur (impact-309) ===
Existants : impact-249 (Montpellier), impact-262 (Paris), impact-267 (Lyon), impact-270 (Lille)
À créer : Studio tatouage fineline & aquarelle Bordeaux — feminin, délicat, sur rendez-vous. Playfair Display + DM Mono. Blanc pur / rose poudré + noir. Style LIGHT (rare pour tatoueur).
registry : { id: "impact-309", name: "Encre Délicate Bordeaux", description: "Studio tatouage fineline Bordeaux — aquarelle, fineline féminin, sur RDV. Playfair Display, blanc / rose poudré.", category: "Creative", style: "Light", tags: ["Tatouage", "Bordeaux", "Studio", "Vitrine"], tier: "Premium", sections: 10 }

=== SECTEUR : paysagiste (impact-310) ===
Existants : impact-250 (Nantes), impact-263 (Bordeaux), impact-268 (Île-de-France), impact-271 (Strasbourg)
À créer : Paysagiste & jardins méditerranéens Montpellier — espèces locales, systèmes d'irrigation économes, terrasses. Fraunces + DM Sans. Olive / sable. Style LIGHT.
registry : { id: "impact-310", name: "Jardins de l'Hérault", description: "Paysagiste méditerranéen Montpellier — espèces locales, irrigation, terrasses. Fraunces, olive / sable.", category: "Services", style: "Light", tags: ["Paysagiste", "Montpellier", "Artisan", "Vitrine"], tier: "Premium", sections: 10 }

Après création de TOUS les templates :
git add app/templates/impact-29{7,8,9}/ app/templates/impact-30{0,1,2,3,4,5,6,7,8,9,10}/ lib/templates/registry.ts
git commit -m "feat(templates): add impact-297..310 — 5ème variante tous secteurs wizard"
```

---

## PROMPT 3 — Audit images manquantes (après les 2 batchs)

```
Tu travailles sur ~/skylaunch (Next.js).

Fais un audit de TOUS les templates app/templates/impact-*/page.tsx par batch de 10.
Pour chaque template inspecté, cherche des composants qui DEVRAIENT contenir une vraie photo mais ont à la place :
- Un dégradé CSS (background: linear-gradient...)
- Une couleur unie (background: #...)
- Un emoji 📷 ou similaire
- Un texte alt écrit en clair dans le UI ("Photo ici", "Image du produit", etc.)
- Un placeholder div coloré sans image réelle

Critères d'un "component qui doit avoir une image" :
- Section hero (TOUJOURS une photo Unsplash full-screen)
- Gallery / portfolio section
- Cards produit avec aspect-ratio (photos de produits)
- Team member cards (photos de l'équipe)
- Before/after cards
- Testimonial cards avec photo de profil
- "Ambiance" / background sections avec overlay

Format de rapport :
Template | Section | Problème | Fix recommandé
impact-XX | HeroSection | gradient à la place d'Unsplash photo | Ajouter photo Unsplash [thème du business]
...

Commence par les 10 premiers (impact-01 à impact-10), puis continuer par batches de 10.
Après le rapport complet, demande confirmation avant de corriger.
```

---

## PROMPT 4 — Fix placeholders impact-292..310 (BUG CRITIQUE)

```
Tu travailles sur ~/skylaunch (Next.js).

PROBLÈME : Les 19 templates impact-292 à impact-310 ont été créés avec des placeholders
littéraux non résolus. Exemple dans chaque page.tsx :

  const C = { primary: "${t.palette.primary}", ... }   ← chaîne de caractères invalide comme couleur CSS
  const SERIF = "${t.fonts.serif}" as const            ← inutilisable
  JSX: <button>${t.content.ctaPrimary}</button>        ← affiche "${t.content.ctaPrimary}" à l'écran

TU DOIS : Pour chacun des 19 fichiers, remplacer TOUS les placeholders par les vraies valeurs.

MÉTHODE : Lis chaque fichier, fais les remplacements ci-dessous, réécris le fichier.
Pour les photos : cherche des URLs Unsplash réelles adaptées au business (format ?q=80&w=1600&auto=format&fit=crop).
Pour les textes JSX : remplace ${t.content.X} en JSX text par de vraies chaînes entre {}.

---

### impact-292 — BurgerCo (Dark)
palette: primary=#f5a623 primaryLight=#f7c05a primaryDark=#d4891a bg=#0d0d0d bgDeep=#080808 bgCard=#1a1a1a text=#f0ede6 textMuted=#9a9590 accent=#c0392b
fonts: serif='Bebas Neue', sans-serif  sans='Barlow', sans-serif
photos: hero=burger artisanal gourmet (unsplash) about=cuisine ouverte industrielle special=burger close-up fondant gallery1-4=frites/sauces/intérieur brique/commande emportée
content: headline="Le Burger Artisanal du 9ème" subtext="Steaks homemade, frites fraîches, sauce secrète. Livraison 30 min." eyebrow="Fast food artisanal · Paris 9e" ctaPrimary="Commander maintenant" ctaSecondary="Voir la carte" menuTitle="Notre Carte" aboutTitle="Local, Artisanal, Généreux" aboutDesc="Depuis 2018, BurgerCo sourcie ses ingrédients auprès de producteurs locaux parisiens. Chaque burger est assemblé à la commande." specialtyTitle="Formule du Jour" specialtyDesc="Burger + frites maison + boisson à partir de 14€. Sur place ou en livraison." footerHours="Lun–Sam 11h30–22h30 · Dim 12h–21h"

### impact-293 — Pizza Napoli Express (Light)
palette: primary=#c0392b primaryLight=#e05c4a primaryDark=#922b21 bg=#faf7f0 bgDeep=#f5f0e6 bgCard=#ffffff text=#2c1810 textMuted=#8b6b5a accent=#2d6a2d
fonts: serif='Cormorant Garamond', serif  sans='Nunito', sans-serif
photos: hero=pizza margherita sortie du four à bois about=chef napolitain qui étale la pâte special=four à bois artisanal gallery1-4=pizza close-up/mozzarella di bufala/tomates fraîches/salle animée pizzeria
content: headline="La Vraie Pizza\nNapolitaine" subtext="Farine 00 Caputo, tomates San Marzano, four à bois. En 30 minutes." eyebrow="Pizzeria napolitaine · Lyon Presqu'île" ctaPrimary="Commander en ligne" ctaSecondary="Voir la carte" menuTitle="Nos Pizzas" aboutTitle="La Tradition Napolitaine" aboutDesc="Notre pâte fermente 72h selon la tradition napolitaine. Farine 00 Caputo, tomates DOP, mozzarella di bufala. Cuite 90 secondes dans notre four à bois à 485°C." specialtyTitle="Notre Four à Bois" specialtyDesc="450°C, cuisson en 90 secondes. La croûte parfaite, croustillante dehors, moelleuse dedans." footerHours="Mar–Dim 11h30–14h · 18h–22h30"

### impact-294 — Sultan Kebab & Grill (Vibrant)
palette: primary=#b5651d primaryLight=#d4813a primaryDark=#8b4c16 bg=#ffffff bgDeep=#fdf8f3 bgCard=#fdf4eb text=#1a0a00 textMuted=#7a5c3a accent=#722f37
fonts: serif='Playfair Display', serif  sans='Poppins', sans-serif
photos: hero=kebab viande grillée broche tournante about=assiette mezze généreuse special=épices colorées marché gallery1-4=shawarma/taboulé/four à braise/salle animée méditerranéenne
content: headline="Le Vrai Kebab\nMéditerranéen" subtext="Viande halal certifiée, mezze généreux, recettes de Noailles. Click & collect." eyebrow="Kebab & grill · Marseille Noailles" ctaPrimary="Commander maintenant" ctaSecondary="La carte" menuTitle="Notre Menu" aboutTitle="Générosité & Authenticité" aboutDesc="Depuis 2015, Sultan Kebab régale le quartier Noailles avec des recettes familiales du Liban et de Turquie. Viande halal certifiée, épices fraîches broyées chaque matin." specialtyTitle="Formule Midi" specialtyDesc="Assiette kebab + boisson + dessert à 12€. Disponible en semaine 11h–15h." footerHours="Lun–Dim 11h–23h · Ven & Sam jusqu'à 1h"

### impact-295 — Wok Master (Dark)
palette: primary=#c0111f primaryLight=#e02030 primaryDark=#8c0d17 bg=#1a1a1a bgDeep=#0d0d0d bgCard=#242424 text=#f8f5f0 textMuted=#a09890 accent=#d4a843
fonts: serif='Noto Serif JP', serif  sans='DM Sans', sans-serif
photos: hero=wok flammes bleues cuisinier asiatique about=chef japonais sur bol ramen vapeur special=sushi roll close-up galerie gallery1-4=bento box/nouilles sautées/gyozas/restaurant néons asiatiques
content: headline="Wok, Sushi\n& Ramen" subtext="Cuisine asiatique fraîche chaque jour. Wok, sushi, ramen, bento. Livraison 25 min." eyebrow="Asian fast food · Paris 13e" ctaPrimary="Commander" ctaSecondary="La carte" menuTitle="La Carte" aboutTitle="Fresh Daily" aboutDesc="Chez Wok Master, tout est préparé le matin même : bouillons mijotés 8h, sauces maison, poisson livré chaque jour de Rungis. Le goût d'Asie, la rapidité du fast-food." specialtyTitle="Bento du Midi" specialtyDesc="Choix wok ou sushi + soupe miso + dessert à 13,50€. Disponible 11h30–14h30." footerHours="Lun–Sam 11h30–22h · Dim 12h–21h30"

### impact-296 — Caliente Tacos (Vibrant)
palette: primary=#e8521a primaryLight=#f06b30 primaryDark=#bf4213 bg=#fffdf8 bgDeep=#fff9f0 bgCard=#ffffff text=#1a0800 textMuted=#8b5a3a accent=#4a7c59
fonts: serif='Oswald', sans-serif  sans='Inter', sans-serif
photos: hero=tacos garnis avocat coriandre coloré about=cuisine mexicaine tradition special=nachos guacamole et salsa gallery1-4=burrito/avocats frais/déco cactus salle/churros dessert
content: headline="Tacos Mexicains\nAuthentiques" subtext="Recettes originales de Oaxaca, sauces maison, ingrédients frais. Bordeaux Victoire." eyebrow="Mexican food · Bordeaux Victoire" ctaPrimary="Commander" ctaSecondary="La carte" menuTitle="La Carta" aboutTitle="Recettes d'Oaxaca" aboutDesc="Caliente Tacos apporte les saveurs de Oaxaca à Bordeaux. Maïs nixtamalisé, chile ancho, avocats Hass premium. Nos recettes sont transmises de génération en génération." specialtyTitle="Nos Sauces Maison" specialtyDesc="De la mild à la 🌶️🌶️🌶️ — 6 sauces préparées chaque matin sans conservateurs." footerHours="Mar–Dim 12h–22h · Ven & Sam jusqu'à 23h"

### impact-297 — Dr. Camille Faure (Light, médecin Toulouse)
palette: primary=#6b3fa0 primaryLight=#8b5cc0 primaryDark=#4e2d78 bg=#fafaf8 bgDeep=#f4f3f0 bgCard=#ffffff text=#1a1520 textMuted=#6b6070 accent=#c9a84c
fonts: serif='Spectral', serif  sans='Mulish', sans-serif
photos: hero=médecin moderne cabinet lumineux about=consultation médecin patient special=sport médecine préventive gallery1-4=salle d'attente moderne/équipement médical/consultation/téléconsultation
content: headline="Médecine\nSportive & Prévention" subtext="Cabinet médical Toulouse Capitole. Généraliste, médecine du sport, téléconsultation disponible." eyebrow="Médecin généraliste · Toulouse" ctaPrimary="Prendre rendez-vous" ctaSecondary="En savoir plus" menuTitle="Nos Consultations" aboutTitle="Une Médecine Attentive" aboutDesc="Dr. Camille Faure exerce la médecine générale avec une spécialisation en médecine sportive. Suivi personnalisé, prévention et téléconsultation pour vos soins du quotidien." specialtyTitle="Médecine du Sport" specialtyDesc="Bilan de condition physique, suivi d'athlètes amateurs et professionnels, certificats sportifs." footerHours="Lun–Ven 8h–19h · Sam 9h–13h"

### impact-298 — Dr. Estelle Blanc (Light, dentiste Montpellier)
palette: primary=#0e9999 primaryLight=#15b8b8 primaryDark=#0a7070 bg=#f8fcfc bgDeep=#eef8f8 bgCard=#ffffff text=#0a1a1a textMuted=#5a7a7a accent=#f0a830
fonts: serif='EB Garamond', serif  sans='DM Sans', sans-serif
photos: hero=cabinet dentaire moderne minimaliste about=dentiste souriante avec patient special=sourire parfait résultat blanchiment gallery1-4=équipement dentaire moderne/radio numérique/salle de soins/implant
content: headline="Votre Sourire\nEn Confiance" subtext="Implantologie, orthodontie invisible, blanchiment. Cabinet Montpellier Antigone." eyebrow="Chirurgien-dentiste · Montpellier" ctaPrimary="Prendre rendez-vous" ctaSecondary="Nos soins" menuTitle="Nos Soins" aboutTitle="L'Excellence Dentaire" aboutDesc="Dr. Estelle Blanc vous reçoit dans un cabinet moderne et apaisant. Implantologie, orthodontie adulte et blanchiment professionnel avec les dernières technologies." specialtyTitle="Orthodontie Invisible" specialtyDesc="Aligneurs transparents sur mesure. Discrets, confortables, résultats en 6 à 18 mois selon votre cas." footerHours="Lun–Ven 9h–19h · Sur rendez-vous"

### impact-299 — KinéPro Sport Lyon (Dark, kine)
palette: primary=#1565c0 primaryLight=#2979d4 primaryDark=#0d47a1 bg=#111827 bgDeep=#0a0f1a bgCard=#1f2937 text=#f1f5f9 textMuted=#94a3b8 accent=#f97316
fonts: serif='Barlow Condensed', sans-serif  sans='Open Sans', sans-serif
photos: hero=athlète rééducation kinésithérapeute about=kiné travail sur genou sportif special=running athlète performance gallery1-4=table de massage kiné/électrostimulation/bande de strapping/piscine thérapeutique
content: headline="Performance\n& Récupération" subtext="Kinésithérapie du sport Lyon Confluence. Football, running, natation. Rééducation post-op." eyebrow="Kinésithérapeute du sport · Lyon" ctaPrimary="Prendre rendez-vous" ctaSecondary="Nos spécialités" menuTitle="Nos Soins" aboutTitle="Le Kiné des Sportifs" aboutDesc="KinéPro Sport accompagne les athlètes amateurs et professionnels du Grand Lyon. Rééducation post-opératoire, dry needling, thérapie manuelle et retour au sport accéléré." specialtyTitle="Dry Needling" specialtyDesc="Technique de puncture sèche pour libérer les points gâchettes musculaires. Efficace sur les douleurs chroniques et les blessures sportives." footerHours="Lun–Ven 7h30–20h · Sam 8h–14h"

### impact-300 — Ostéo Périnatal Nice (Light, ostéo)
palette: primary=#d4828a primaryLight=#e89da4 primaryDark=#b06070 bg=#fdf9f9 bgDeep=#f9f0f1 bgCard=#ffffff text=#2a1015 textMuted=#8a6068 accent=#7a9e7e
fonts: serif='Merriweather', serif  sans='Lato', sans-serif
photos: hero=ostéopathe douce avec nourrisson about=femme enceinte massage spécialisé special=bébé soin doux ostéopathie gallery1-4=cabinet chaleureux/mains ostéo/consultation post-partum/mère et bébé
content: headline="Ostéopathie\nPérinatal & Pédiatrique" subtext="Nourrissons, femmes enceintes, post-partum. Cabinet doux et bienveillant, Nice Cimiez." eyebrow="Ostéopathe · Nice Cimiez" ctaPrimary="Prendre rendez-vous" ctaSecondary="En savoir plus" menuTitle="Nos Soins" aboutTitle="La Douceur au Cœur du Soin" aboutDesc="Spécialisée en ostéopathie périnatal, j'accompagne les femmes enceintes, les jeunes mamans et les nourrissons dès la naissance. Une approche douce, respectueuse et bienveillante." specialtyTitle="Ostéopathie du Nourrisson" specialtyDesc="Consultation dès J+5 après la naissance. Traitement des tensions crâniennes, torticolis, coliques et troubles du sommeil." footerHours="Lun–Ven 9h–19h · Sam 9h–15h"

### impact-301 — Dubois & Partenaires (Dark, avocat Bordeaux)
palette: primary=#c9a84c primaryLight=#dbbe6a primaryDark=#a07e30 bg=#141414 bgDeep=#0d0d0d bgCard=#1e1e1e text=#f5f0e8 textMuted=#9a9080 accent=#5a6e7a
fonts: serif='Cormorant Garamond', serif  sans='Inter', sans-serif
photos: hero=cabinet avocat luxueux bibliothèque juridique about=avocat en réunion client confidentielle special=contrat signé stylo élégant gallery1-4=salle de réunion moderne/code civil/poignée de main affaires/Bordeaux Chartrons
content: headline="Droit des Affaires\n& Startups" subtext="M&A, levées de fonds, RGPD. Cabinet Bordeaux Chartrons — expertise juridique de haut niveau." eyebrow="Avocat · Bordeaux Chartrons" ctaPrimary="Consultation gratuite" ctaSecondary="Nos domaines" menuTitle="Nos Expertises" aboutTitle="Votre Partenaire Juridique" aboutDesc="Dubois & Partenaires conseille les entrepreneurs, startups et PME bordelaises sur leurs enjeux juridiques. Droit des sociétés, M&A, financement et conformité RGPD depuis 2012." specialtyTitle="Startups & Tech" specialtyDesc="Due diligence, pactes d'actionnaires, levées de fonds Seed à Série B. Accompagnement des fondateurs de l'idée à l'exit." footerHours="Lun–Ven 9h–18h30 · Urgences sur demande"

### impact-302 — Nexus Compta (Light, comptable Toulouse)
palette: primary=#3949ab primaryLight=#5562c4 primaryDark=#283593 bg=#fafbff bgDeep=#f0f2ff bgCard=#ffffff text=#0d1240 textMuted=#6070a0 accent=#ef6c00
fonts: serif='Raleway', sans-serif  sans='Source Sans Pro', sans-serif
photos: hero=expert-comptable moderne au bureau tablette about=consultant avec entrepreneur special=graphiques croissance business gallery1-4=coworking/ordinateur tableau de bord/réunion startup/café de travail
content: headline="L'Expertise Comptable\ndes Entrepreneurs" subtext="TPE, e-commerce, créateurs de contenu, auto-entrepreneurs. Comptabilité digitale 100% en ligne." eyebrow="Expert-comptable · Toulouse" ctaPrimary="Devis gratuit" ctaSecondary="Nos services" menuTitle="Nos Services" aboutTitle="La Compta Réinventée" aboutDesc="Nexus Compta accompagne les nouvelles formes d'entrepreneuriat : influenceurs, e-commerçants, freelances et micro-entrepreneurs. Dématérialisation complète, reporting mensuel clair." specialtyTitle="Pour les Créateurs" specialtyDesc="Optimisation fiscale pour streamers, YouTubers, influenceurs. Statut SASU vs micro-entreprise, TVA, droits voisins." footerHours="Lun–Ven 9h–18h30 · Réponse sous 24h"

### impact-303 — Studio Peak Performance (Dark, coach Paris)
palette: primary=#39ff14 primaryLight=#66ff44 primaryDark=#22cc00 bg=#0a0a0a bgDeep=#050505 bgCard=#141414 text=#f5f5f5 textMuted=#a0a0a0 accent=#ff3814
fonts: serif='Poppins', sans-serif  sans='Poppins', sans-serif
photos: hero=coach musclé entrainement intense salle de sport sombre about=transformation avant/après sportive special=nutrition préparation de repas gallery1-4=deadlift/workout circuit/suivi app mobile/dîner healthy
content: headline="Transforme\nTon Corps" subtext="Coaching sportif online et présentiel Paris Est. Nutrition, suivi app, transformation garantie." eyebrow="Coach sportif · Paris Est" ctaPrimary="Démarrer ma transformation" ctaSecondary="Voir les résultats" menuTitle="Nos Programmes" aboutTitle="Peak Performance" aboutDesc="En 12 semaines, transformez votre corps et votre rapport au sport. Programmes personnalisés, nutrition sur mesure et suivi quotidien via notre app dédiée." specialtyTitle="L'App Studio Peak" specialtyDesc="Suivi de vos entraînements, recettes personnalisées, communication directe avec votre coach. iOS & Android." footerHours="Coaching 7j/7 · Réponse garantie en 2h"

### impact-304 — Rapido Plomberie Paris (Dark, plombier)
palette: primary=#e53935 primaryLight=#f95858 primaryDark=#b71c1c bg=#0f1923 bgDeep=#080f18 bgCard=#162030 text=#e8f0f8 textMuted=#7090a8 accent=#f5a623
fonts: serif='Montserrat', sans-serif  sans='Roboto', sans-serif
photos: hero=plombier professionnel intervention urgence about=salle de bain rénovée moderne special=chaudière PAC installation gallery1-4=fuite réparée/robinetterie premium/salle de bain après rénovation/technicien certifié
content: headline="Urgences 24h/7j\nÎle-de-France" subtext="Plombier-chauffagiste Paris. Fuite, chaudière, PAC, rénovation salle de bain. Intervention en 1h." eyebrow="Plombier · Paris & Île-de-France" ctaPrimary="Appel urgent 24h/7j" ctaSecondary="Nos services" menuTitle="Nos Interventions" aboutTitle="Rapide, Fiable, Garanti" aboutDesc="Rapido Plomberie intervient en urgence sur tout Paris et l'Île-de-France. Fuite d'eau, chaudière en panne, installation PAC ou rénovation complète de salle de bain. Devis gratuit, travaux garantis." specialtyTitle="Pompe à Chaleur" specialtyDesc="Installation et maintenance de PAC air/eau et air/air. Aides MaPrimeRénov' et CEE disponibles. Devis en 48h." footerHours="Urgences 24h/7j · Bureau Lun–Ven 8h–18h"

### impact-305 — Courant Fort Bordeaux (Dark, electricien)
palette: primary=#c6f135 primaryLight=#d8f860 primaryDark=#a0cc10 bg=#0d1117 bgDeep=#080c12 bgCard=#161d26 text=#e8edf5 textMuted=#6a7a90 accent=#3d8ef0
fonts: serif='Exo 2', sans-serif  sans='Roboto', sans-serif
photos: hero=électricien tertiaire installation tableau électrique about=smart home automation maison connectée special=installation alarme domotique gallery1-4=tableau électrique propre/prises USB/éclairage LED/technicien certifié QUALIFELEC
content: headline="Smart Home\n& Tertiaire" subtext="Électricien Bordeaux Mériadeck. Smart home, alarmes, domotique, installations tertiaires." eyebrow="Électricien · Bordeaux" ctaPrimary="Devis gratuit" ctaSecondary="Nos services" menuTitle="Nos Services" aboutTitle="L'Électricité du Futur" aboutDesc="Courant Fort Bordeaux accompagne particuliers et professionnels dans leur transition vers des installations intelligentes. Certifié QUALIFELEC, référencé RGE pour les travaux éligibles aux aides." specialtyTitle="Smart Home" specialtyDesc="Volets connectés, éclairage Philips Hue, prises programmables, thermostat Netatmo. Installation et paramétrage inclus." footerHours="Lun–Ven 7h30–18h30 · Urgences disponibles"

### impact-306 — La Miette Heureuse (Light, boulangerie Montpellier)
palette: primary=#8b6914 primaryLight=#a88030 primaryDark=#6a5010 bg=#fffdf5 bgDeep=#fff8e6 bgCard=#ffffff text=#1a1200 textMuted=#7a6830 accent=#4a7c50
fonts: serif='Libre Baskerville', serif  sans='Nunito', sans-serif
photos: hero=vitrine boulangerie artisanale pains spéciaux about=boulanger pétrissage pain spécial special=brunch copieux dimanche gallery1-4=croissant beurre/pain de campagne coupé/gâteau personnalisé événement/intérieur boulangerie chaleureux
content: headline="Pain Artisanal\n& Pâtisserie" subtext="Farines biologiques, levain naturel, produits locaux. Brunchs le dimanche. Montpellier." eyebrow="Boulangerie artisanale · Montpellier" ctaPrimary="Commander un gâteau" ctaSecondary="Notre carte" menuTitle="Notre Carte" aboutTitle="L'Art du Pain Vrai" aboutDesc="La Miette Heureuse travaille uniquement des farines biologiques Label Rouge avec un levain naturel de 8 ans. Chaque pain est façonné à la main, chaque viennoiserie est feuilletée au beurre AOP." specialtyTitle="Brunch du Dimanche" specialtyDesc="Formule brunch 10h–14h : pain, viennoiseries, œufs brouillés, fromages locaux, jus frais. Sur réservation dès le jeudi." footerHours="Mar–Dim 7h–19h30 · Fermé lundi"

### impact-307 — Lumière & Vœux Lyon (Light, mariage)
palette: primary=#c5a55a primaryLight=#d8be80 primaryDark=#9c8040 bg=#fdfcf8 bgDeep=#f8f4ec bgCard=#ffffff text=#1a1408 textMuted=#80704a accent=#6a8c70
fonts: serif='Cinzel', serif  sans='Lato', sans-serif
photos: hero=mariage champêtre intimiste bouquet floral organique about=wedding planner avec couple déco florale special=cérémonie laïque extérieure verdure gallery1-4=table champagne eucalyptus/fleurs sauvages cérémonie/premier regard/danse des mariés
content: headline="Mariages Intimistes\nà Lyon" subtext="Cérémonies laïques, décoration florale organique, 20 à 80 personnes. Wedding planner Lyon." eyebrow="Wedding planner · Lyon" ctaPrimary="Réservez une consultation" ctaSecondary="Nos formules" menuTitle="Nos Formules" aboutTitle="Chaque Mariage, Une Histoire" aboutDesc="Lumière & Vœux crée des mariages sur mesure, intimes et authentiques. De la recherche des prestataires à la coordination le jour J, nous gérons tout pour que vous profitiez pleinement." specialtyTitle="Cérémonie Laïque" specialtyDesc="Rédaction et animation de votre cérémonie personnalisée. Vœux sur mesure, rituels symboliques, coordination avec le lieu." footerHours="Lun–Ven 10h–19h · Sam sur rendez-vous"

### impact-308 — Re-Thread Studio (Light, couture Bordeaux)
palette: primary=#d4714a primaryLight=#e88a60 primaryDark=#b0582c bg=#fafafa bgDeep=#f0f0f0 bgCard=#ffffff text=#0d0d0d textMuted=#6a6a6a accent=#0d0d0d
fonts: serif='Josefin Sans', sans-serif  sans='Josefin Sans', sans-serif
photos: hero=créatrice mode upcycling atelier couture about=collection capsule pièces éco-responsables special=atelier DIY participants customisation gallery1-4=vêtement upcyclé avant-après/tissu vintage récupéré/défilé capsule/espace atelier bohème
content: headline="Mode Upcycling\n& Ateliers" subtext="Collections capsule éco-responsables, ateliers DIY, pièces uniques. Bordeaux." eyebrow="Créatrice de mode · Bordeaux" ctaPrimary="Voir les collections" ctaSecondary="Nos ateliers" menuTitle="Collections & Ateliers" aboutTitle="Créer Autrement" aboutDesc="Re-Thread Studio transforme vos vêtements oubliés en pièces uniques. Chaque collection capsule raconte une histoire de matières sauvées, de gestes soignés et de mode responsable." specialtyTitle="Ateliers DIY" specialtyDesc="Apprenez à transformer vos vêtements : broderie, teinture naturelle, customisation. Sessions de 3h en petit groupe, tous niveaux." footerHours="Mar–Sam 10h–18h · Ateliers le week-end"

### impact-309 — Encre Délicate (Light, tatoueur Bordeaux)
palette: primary=#c8a0b0 primaryLight=#dab8c6 primaryDark=#a08090 bg=#fefefe bgDeep=#f8f4f6 bgCard=#ffffff text=#0d0508 textMuted=#8a7880 accent=#0d0508
fonts: serif='Playfair Display', serif  sans='DM Mono', monospace
photos: hero=tatouage fineline féminin délicat poignet about=tatoueuse travail précis artiste féminine special=aquarelle tatouage coloré gallery1-4=flash collection fineline/mandala délicat/lettering élégant/cicatrisation résultat final
content: headline="Tatouage Fineline\n& Aquarelle" subtext="Studio féminin sur rendez-vous. Fineline, aquarelle, tatouages délicats et durables. Bordeaux." eyebrow="Studio tatouage · Bordeaux" ctaPrimary="Prendre rendez-vous" ctaSecondary="Portfolio" menuTitle="Nos Styles" aboutTitle="L'Art du Trait Fin" aboutDesc="Encre Délicate est un studio féminin spécialisé dans le tatouage fineline et aquarelle. Chaque pièce est dessinée sur mesure, adaptée à votre anatomie et à votre sensibilité." specialtyTitle="Tatouage Aquarelle" specialtyDesc="Effet peinture aquarelle, couleurs douces et fondues. Technique unique pour des résultats poétiques et durables." footerHours="Mar–Sam 10h–19h · Uniquement sur rendez-vous"

### impact-310 — Jardins de l'Hérault (Light, paysagiste Montpellier)
palette: primary=#6b7c45 primaryLight=#8a9e5a primaryDark=#4e5c30 bg=#faf9f5 bgDeep=#f2f0e8 bgCard=#ffffff text=#1a1a08 textMuted=#7a7a50 accent=#c8a850
fonts: serif='Fraunces', serif  sans='DM Sans', sans-serif
photos: hero=jardin méditerranéen aménagé terrasse olivier about=paysagiste travail plantation espèces locales special=système irrigation économe eau gallery1-4=terrasse carrelée provence/lavande et romarin/garrigue aménagée/après création jardin sec
content: headline="Jardins\nMéditerranéens" subtext="Espèces locales, irrigation économe, terrasses. Paysagiste Montpellier & Hérault." eyebrow="Paysagiste · Montpellier" ctaPrimary="Demander un devis" ctaSecondary="Nos réalisations" menuTitle="Nos Services" aboutTitle="Jardins Vivants & Durables" aboutDesc="Jardins de l'Hérault crée des espaces extérieurs adaptés au climat méditerranéen. Espèces locales économes en eau, systèmes d'irrigation goutte-à-goutte, terrasses et allées en matériaux naturels." specialtyTitle="Jardin Sec Méditerranéen" specialtyDesc="Conception avec des espèces endémiques : olivier, figuier, garrigue, lavande. Arrosage réduit de 70% vs pelouse traditionnelle." footerHours="Lun–Ven 8h–18h · Sam matin sur RDV"

---

APRÈS avoir corrigé chaque fichier :
git add app/templates/impact-29{2,3,4,5,6}/ app/templates/impact-29{7,8,9}/ app/templates/impact-3{0,1}{0,1,2,3,4,5,6,7,8,9}/
git commit -m "fix(templates): resolve all placeholder values in impact-292..310 (palette, fonts, photos, content)"
```

---

## PROMPT 5 — Page Galerie de Thèmes (/galerie)

```
Tu travailles sur ~/skylaunch (Next.js 16, Tailwind, Framer Motion).

Crée une page galerie de templates à app/galerie/page.tsx (ou app/(marketing)/galerie/page.tsx selon la structure existante).

OBJECTIF : Une page vitrine qui présente TOUS les templates organisés par secteur, avec un design premium.

Lis d'abord :
- app/page.tsx (homepage pour comprendre le style général)
- lib/templates/registry.ts (la liste complète des templates)
- lib/templates/sectors.ts (la taxonomie industries/secteurs)

STRUCTURE DE LA PAGE :
1. Hero section (simple) : "Tous nos thèmes — Choisissez votre design parfait"
2. Filtres par industrie (boutons horizontaux scrollables, utilise INDUSTRIES depuis sectors.ts)
3. Grille de cartes templates (3 colonnes desktop, 2 tablet, 1 mobile)
4. Chaque carte :
   - Fond couleur extraite du tag style (Dark = zinc-900, Light = white, Vibrant = gradient)
   - Nom du template (TEMPLATE_CITY_LABELS)
   - Badge secteur
   - Badge style (Dark/Light/Vibrant)
   - CTA "Voir le thème" → href="/templates/[id]"
   - Hover : légère élévation + scale(1.02) Framer Motion
5. Filtrage côté client (useState sur l'industrie sélectionnée)
6. CTA final : "Créer mon site" → href="/onboarding"

RÈGLES :
- 'use client'
- Imports : react, framer-motion, lucide-react, next/link uniquement
- INDUSTRIES et SECTORS importés depuis @/lib/templates/sectors
- TEMPLATES_REGISTRY importé depuis @/lib/templates/registry
- TEMPLATE_CITY_LABELS importé depuis @/lib/templates/sectors
- Style cohérent avec le reste du site (fond zinc-950/zinc-900, texte blanc)
- Animations : AnimatePresence sur le filtre (layout transition entre les cartes)
- Mobile first, responsive

Après création : git add app/galerie/ && git commit -m "feat(marketing): add /galerie template showcase page"
```

---

## Notes pour TEMPLATE_CITY_LABELS (à ajouter dans lib/templates/sectors.ts)

Après la création par Antigravity, il faudra manuellement ajouter ces lignes dans TEMPLATE_CITY_LABELS :

```typescript
// Fast-food
'impact-292': 'BurgerCo · Paris',
'impact-293': 'Pizza Napoli · Lyon',
'impact-294': 'Sultan Kebab · Marseille',
'impact-295': 'Wok Master · Paris',
'impact-296': 'Caliente Tacos · Bordeaux',
// 5ème variantes
'impact-297': 'Dr. Faure · Toulouse',
'impact-298': 'Dr. Blanc · Montpellier',
'impact-299': 'KinéPro Sport · Lyon',
'impact-300': 'Ostéo Périnatal · Nice',
'impact-301': 'Dubois & Partenaires · Bordeaux',
'impact-302': 'Nexus Compta · Toulouse',
'impact-303': 'Studio Peak · Paris',
'impact-304': 'Rapido Plomberie · Paris',
'impact-305': 'Courant Fort · Bordeaux',
'impact-306': 'La Miette Heureuse · Montpellier',
'impact-307': 'Lumière & Vœux · Lyon',
'impact-308': 'Re-Thread Studio · Bordeaux',
'impact-309': 'Encre Délicate · Bordeaux',
'impact-310': 'Jardins de l\'Hérault · Montpellier',
```
