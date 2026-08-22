# Reprise P0 — les 18 thèmes vendus qui livrent de la démonstration

**Source** : [AUDIT_QUALITE_2026-08-12.md](AUDIT_QUALITE_2026-08-12.md).
**Consignes d'exécution** : celles de la reprise 316-383
([REPRISE_316_383_RESTE_A_FAIRE.md](REPRISE_316_383_RESTE_A_FAIRE.md),
annexe), plus les règles propres à P0 ci-dessous.

## Ce que le profilage a montré

Trois maux distincts, souvent cumulés :

1. **Langue** : 13 des 18 ont un corps anglais, vendus à des métiers français.
2. **Sujet** : le corps de 122 (journal), 44 (équipe esport), 160
   (data-center), 119 (cloud), 35 (coworking), 151 (domaine viticole) ne
   parle pas du métier auquel le catalogue les vend — alors que leur libellé
   catalogue (« Espace Studio · Marseille », « IronX Fitness », « Maison V »,
   « Chronos Lab ») porte déjà le bon sujet.
3. **Câblage** : 2 à 6 retouches pour 500-850 lignes, photos en dur sans
   repli (35 : zéro photo substituable), sections contact absentes (97, 151),
   adresse et horaires américains en dur (36).

## Règles P0 (en plus des consignes générales)

- **Le sujet cible est le libellé catalogue existant** — on aligne le corps
  sur ce que le produit vend déjà, on n'invente aucune niche. La démo
  réécrite est fictive et métier-juste (actes réels du métier, tarifs
  plausibles, mentions réglementaires du métier cible) ; on réutilise tout ce
  qui est transposable de l'existant (mécanique visuelle, structure, textes
  neutres).
- **Corps en français.** L'ADN visuel du thème (dark omakase, brutalisme
  typographique, magazine) se garde ; la langue non.
- **Jamais deux fois le même geste dans un métier** — les gestes interdits
  par métier sont listés ci-dessous, calculés sur tout le catalogue. La
  limite « 3 usages du geste » de la série 316-383 devient « éviter la
  concentration » à l'échelle des 373 : la règle dure est le métier.
- **Un thème vendu à plusieurs métiers** doit éviter l'union de leurs gestes
  (fait dans l'allocation) et garder un contenu transposable par le wizard.
- Les **sous-pages coquilles** (impact-100 : 18 stubs de 84 lignes qui
  n'importent que `clientName`) deviennent des redirections vers les ancres
  de la page principale — un sitemap qui annonce 18 pages vides dessert la
  vente. Les sous-pages réelles (35, 36, 39, 11, 44) sont conservées et
  câblées comme l'accueil (patron impact-99).
- 97 et 151 **gagnent une section contact** (aucune aujourd'hui) ; 36 perd
  son adresse new-yorkaise au profit du contrat.

## Allocation

| id | métier(s) vendus | sujet cible (libellé existant) | geste | héros | fontes | palette |
|---|---|---|---|---|---|---|
| 122 | formation | organisme de formation, ADN magazine du savoir | PanelRise | H7 | P10 Spectral+IBM Plex | #f6f6f9 / #3d4bc9 |
| 146 | restaurant | Kuro Omakase, sushi intimiste (francisé) | HeldSwap | H3 | P3 Cormorant+system | #0a0a0a / #c19b56 |
| 136 | décorateur | studio de décoration, garder le text-mask | DifferentialExit | H4 | P9 Syne+Work Sans | #f5f3ef / #8a5a3c |
| 100 | décorateur | Nova Spaces, architecture d'intérieur (francisé) | ScrollSpin (luminaire/fauteuil) | H2 | P11 EB Garamond+Outfit | #f8f6f2 / #6b5942 |
| 44 | décorateur | Espace Studio · Marseille (ex-esport, réécriture) | PanelDrop | H5 | P6 Archivo+Inter | #101012 / #d8c8a8 |
| 160 | boutique mode | Maison V, lookbook brutaliste (ex-data-center) | GhostSolid | H6 | P6 Archivo+Inter | #0d0d0f / #e8e4da |
| 145 | agent immobilier | immobilier d'exception (francisé) | PushBlur | H3 | P2 Playfair+Space Grotesk | #0e0d0b / #b89a5a |
| 35 | avocat·comptable·patrimoine | cabinet pluridisciplinaire chiffre & droit (ex-coworking) | ExpandFrame | H1 | P2 Playfair+Space Grotesk | #f7f6f3 / #1f3a5f |
| 36 | avocat·comptable·recrutement | cabinet de recrutement dirigeants (francisé, adresse FR) | TrackingCollapse | H9 | P10 Spectral+IBM Plex | #f4f5f8 / #28415e |
| 119 | coach·salle sport·+4 | IronX Fitness (ex-cloud), stats KPI conservées | WipeReveal | H5 | P6 Archivo+Inter | #0f1113 / #d94a26 |
| 11 | auto-école·crèche·formation·musique | EduPath, organisme de formation (FR déjà) | ParticleOrb | H6 | P4 Fraunces+Inter | #f7f7fb / #5b48c9 |
| 151 | bijouterie | Chronos Lab, horlogerie-joaillerie (ex-vin, garder l'ADN alchimiste) | LineMask | H4 | P3 Cormorant+system | #14100e / #c9a227 |
| 98 | bijouterie | Zenith, haute horlogerie (francisé) | ScrollSpin (calibre qui tourne) | H1 | P2 Playfair+Space Grotesk | #0b0b0d / #b08d3f |
| 140 | hôtel | Wanderlust, hôtel d'exception — le carrousel destinations devient suites & expériences | PortalZoom | H3 | P3 Cormorant+system | #f8f5f0 / #a3763c |
| 97 | hôtel | hôtel & marina (ex-yachts, + section contact) | LineScroll | H7 | P9 Syne+Work Sans | #0c1118 / #7fa8d9 |
| 141 | école de musique | école de musiques actuelles — le lecteur audio devient les productions des élèves | CrossPush | H3 | P12 Bricolage+Figtree | #0b0714 / #b944cf |
| 137 | café-bar | torréfacteur-café (francisé, repli ville aligné sur le libellé) | PanelDrop | H2 | P8 Newsreader+Manrope | #f7f2ec / #7a4a26 |
| 39 | déménageur (+6 rattachements) | déménageur (déjà FR, meilleur contrat du lot) | StickyProgress | H9 | P10 Spectral+IBM Plex | #f5f6f4 / #356047 |

Gestes interdits par métier (déjà pris ailleurs au catalogue) : décorateur
TrackingCollapse · comptable/recrutement WordFlight · patrimoine
StickyProgress+WordFlight · bijouterie LineScroll+HeldSwap · café-bar
HeldSwap · formation LineScroll, BentoCascade, HeldSwap, StickyProgress,
ExpandFrame · auto-école TrackingCollapse, CrossPush, HardCutRebuild,
HeldSwap, StickyProgress · crèche ComposeIn, ScrollGrow, HeldSwap,
StickyProgress · école de musique ScrollGrow, HeldSwap, StickyProgress ·
sécurité GhostSolid, TrackingCollapse · VTC HardCutRebuild, DifferentialExit ·
contrôle technique GhostSolid, LineMask · location matériel BentoCascade,
PushBlur · déménageur HardCutRebuild · paysagiste BentoCascade.
L'allocation ci-dessus les respecte tous, unions multi-métiers comprises
(11 ≠ 119 ≠ 141 ≠ 122 sur leurs métiers communs ; 35 ≠ 36 ; 44 ≠ 100 ≠ 136 ;
98 ≠ 151 ; 97 ≠ 140).

## À signaler au fondateur (décisions produit, pas prises ici)

- **impact-39 est vendu à 7 métiers** avec un contenu déménageur ; 119 à 6
  métiers, 11 à 4. La reprise rend leur contenu transposable par le wizard,
  mais ces rattachements de remplissage datent du minimum « 5 modèles par
  métier » — à réviser quand les métiers auront des thèmes dédiés.
- **impact-11 et 44 n'ont aucune photographie** ; 39 en a une. Pour crèche et
  auto-école, un thème sans visuel reste difficile à vendre — reprise faite
  avec replis CSS, mais un thème dédié avec photos serait mieux.
