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
