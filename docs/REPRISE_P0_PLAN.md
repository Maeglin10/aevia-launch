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


## Suivi d'exécution — mis à jour le 23 août

Fait à la main, sans agents, un thème à la fois, commis et poussé après les
quatre contrôles de contrat et le comptage d'URLs d'images (zéro inventée
partout) :

| id | fait | l'essentiel |
|---|---|---|
| 98 | ✔ | francisé, ScrollSpin sur le calibre (plus d'horloge autonome), prix en euros, section avis créée, Playfair/Space Grotesk |
| 146 | ✔ | francisé et rapatrié (Paris, euros), HeldSwap sur la pièce de saison, flèches mortes re-câblées sur l'index |
| 151 | ✔ | vin → horlogerie-joaillerie (ADN alchimiste conservé), LineMask sur les devises, contact créé, presse fictive retirée |
| 137 | ✔ | francisé, PanelDrop (le rideau du café), ville alignée sur le libellé, avis câblés |
| 145 | ✔ | francisé et rapatrié (euros, loi Hoguet), PushBlur plein cadre à index unique |
| 140 | ✔ | voyagiste → hôtel : les destinations deviennent les chambres, PortalZoom en baie vitrée |
| 97 | ✔ | yachts → hôtel du canal : la péniche au ponton privé, LineScroll sur les devises, contact créé |
| 141 | ✔ | label → école de musique : le lecteur joue les productions des élèves, CrossPush plein cadre, cours tarifés câblés |
| 122 | ✔ | journal → organisme de formation : la une devient la formation phare, les essais les dates inter, PanelRise sur le catalogue, Spectral/IBM Plex |
| 119 | ✔ | cloud → salle IronX : le terminal devient le tableau de séance sous WipeReveal, Archivo/Inter, texture externe retirée |
| 160 | ✔ | data-center → Maison V : le registre des nœuds devient le vestiaire, GhostSolid sur le titre, essayage privé en modale |
| 136 | ✔ | agence web → studio déco, text-mask conservé, DifferentialExit sur le manifeste (3 plans), réalisations clientWorks, Syne/Work Sans |
| 100 | ✔ | Nova francisé (EB Garamond/Outfit), ScrollSpin sur la suspension dessinée, fausses accréditations RIBA/AIA retirées, 18 coquilles → redirections d'ancres |
| 44 | ✔ | esport → Espace Studio : réécriture complète, 5 sous-pages recontenues sur leurs routes, PanelDrop sur le nuancier du moodboard |
| 35 | ✔ | coworking → Carré Daviel (chiffre & droit) : honoraires écrits d'avance, ExpandFrame sur les vues du cabinet, déontologie au pied |
| 36 | ✔ | Apex Talent francisé, adresse new-yorkaise remplacée par le contrat, TrackingCollapse sur le mot du titre, Spectral/IBM Plex |
| 11 | ✔ | EduPath relevé : ParticleOrb (la sphère en canvas), Fraunces/Inter sur les 6 pages, avis et coordonnées ajoutés (absents) |
| 39 | ✔ | déménageur passé au vert forêt #356047, StickyProgress sur la méthode (titre collé, étapes qui s'allument), Spectral/IBM Plex |

**Les 18 sont transformés.** Défauts trouvés à la mesure et en capture, tous
corrigés : courriel du pied de 100 débordant de 4 px, tarifs client absents
sur 100 et 36, compteur « NaN » du héros de 35 (prop `i` de SlideIndex),
période de démo collée au prix client sur 35, sur-titre « Management » de
démo au-dessus du titre client sur 122, logo long débordant sur le menu
mobile de 122.

Applications de gestes toutes distinctes chez les porteurs multiples :
PortalZoom = fenêtre de château (369) / voûte de cave (381) / arche (322) /
baie vitrée (140) ; LineScroll = programme (321), calepinage (376), canal
(97) ; HeldSwap = médaillon (345), panier (365), pièce d'omakase (146) ;
PanelDrop = rideau du café (137) / nuancier du moodboard (44) ; PanelRise =
respiration (335 et série) / catalogue sur la une (122) ; ScrollSpin =
calibre de montre (98) / suspension d'atelier (100) ; WipeReveal = mot du
héros (368) / tableau de séance (119) ; DifferentialExit = héros produit
(316) / manifeste (136) ; ExpandFrame = héros des séries 32x / vues du
cabinet (35) ; StickyProgress = méthode du déménageur (39, seul porteur).

Reste pour la passe d'alignement (déjà prévue) : régénérer capabilities,
photoSlots, sectionManifest et les paliers (98 a gagné une section d'avis ;
146, 151, 97, 141, 122, 119, 160, 136, 100, 11, 44 aussi ou des sections
recomposées), et mettre à jour les descriptions registry/i18n de 44 (le
catalogue décrit « warm white and terracotta », le thème est désormais
sombre #101012/#d8c8a8) et de 160/122/119 dont l'esthétique a changé.
