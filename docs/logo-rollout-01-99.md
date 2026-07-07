# Logo rollout — impact-01 à impact-99

Rapport append-only. Chaque ligne : fichier | fait/skippé (raison).
Référence : `app/templates/impact-219/page.tsx` (nav ~ligne 117-144).

## impact-01 à impact-10

- impact-01/page.tsx | skippé — nav = wordmark "IMPACT." 100% hardcodé (branding du showcase agence), aucune lecture `fd?.businessName` dans la nav (fd est bien assigné mais jamais lu, même ailleurs dans le fichier hormis brandColor/email).
- impact-02/page.tsx | skippé — nav = "ElenaKorr" hardcodé (portfolio perso), pas de `fd?.businessName` dans la nav (fd est utilisé ailleurs — about/image alt — mais pas dans la nav).
- impact-03/page.tsx | skippé — nav = wordmark "Atelier NOIR" hardcodé (fashion editorial), aucune lecture businessName dans la nav ni ailleurs (fd utilisé seulement pour brandColor/email).
- impact-04/page.tsx | skippé — nav = "L'Étoile" hardcodé (restaurant), aucune lecture businessName dans la nav (fd utilisé ailleurs pour heroHeadline/aboutTitle/tagline, pas la nav).
- impact-05/page.tsx | fait — variable `fd`. Nav desktop (Link, icône Zap + span businessName) et menu mobile (Sheet, icône Zap + span businessName) enveloppés dans le conditionnel logoBase64 (footer, plus bas, non touché intentionnellement).
- impact-06/page.tsx | fait — variable `fd`. Nav (Link avec 2 spans businessName + "Augmentation Lab") enveloppée ; le bloc identique dans le FOOTER (ligne ~718) laissé intact (hors périmètre nav).
- impact-07/page.tsx | skippé — nav = "Aether Sound Labs" hardcodé, aucune lecture businessName dans la nav (fd utilisé seulement pour brandColor/tagline/aboutTitle ailleurs).
- impact-08/page.tsx | skippé — nav = "Vulcan Motor Group Modena" hardcodé, aucune lecture businessName dans la nav.
- impact-09/page.tsx | skippé — nav = "Astrum. Reach Orbital Group" hardcodé, aucune lecture businessName dans la nav.
- impact-10/page.tsx | fait — variable `fd`. Nav = `NavBar()` function, marque = bouton texte seul (`{fd?.businessName ?? "Grand Palais"}`, pas d'icône) ; conditionnel ajouté à l'intérieur du bouton (onClick goTo('home') conservé), image 32px.

