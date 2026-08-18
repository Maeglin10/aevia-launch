"use client";
import { MARQUE_DEMO, MARQUE_DEMO_COLLEE } from "@/lib/templates/marquesDemo";

import { useEffect } from "react";

// Sets the CSS custom properties --brand / --brand-light on the document root
// from the client's brandColor (wizard session). Every template's accent color
// is written as `var(--brand, #originalHex)`, so with no client color the theme
// keeps its original look, and when the client picks a brand color the whole
// theme recolors via CSS cascade — no per-template re-render needed. Rendered
// once in the /templates layout, it covers all templates (incl. the preview
// iframe, which runs this layout in its own document).
function lighten(hex: string, amt = 22): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const cl = (v: number) => Math.max(0, Math.min(255, v));
  const r = cl((n >> 16) + Math.round(2.55 * amt));
  const g = cl(((n >> 8) & 0xff) + Math.round(2.55 * amt));
  const b = cl((n & 0xff) + Math.round(2.55 * amt));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

/** Luminance relative, au sens du calcul de contraste. */
function luminance(r: number, g: number, b: number): number {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function versRGB(couleur: string): [number, number, number] | null {
  const m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/i.exec(couleur);
  if (!m) return null;
  // Une couleur transparente ne dit rien du fond réellement peint dessous.
  if (m[4] !== undefined && Number(m[4]) < 0.85) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/*
  Le client choisit une couleur ; le thème l'applique partout où il a écrit
  « var(--brand) ». Sur impact-197, cette variable servait à la fois de fond de
  bouton et de couleur de texte : l'appel à l'action principal s'affichait orange
  sur orange — mesuré à 1,0:1 — et le bouton paraissait vide.

  Aucun thème ne peut prévoir les couleurs qu'un client choisira. On vérifie donc
  après coup, et l'on ne touche qu'aux textes devenus illisibles : en dessous de
  trois pour un, la couleur passe au noir ou au blanc, selon le fond. Au-dessus,
  rien ne bouge — le dessin du thème reste celui qu'il a voulu.
*/
function rendreLesBoutonsLisibles() {
  const cibles = document.querySelectorAll<HTMLElement>("button, a, [role='button'], input[type='submit']");
  for (const e of cibles) {
    const s = getComputedStyle(e);
    const fond = versRGB(s.backgroundColor);
    const texte = versRGB(s.color);
    if (!fond || !texte) continue;

    const lf = luminance(...fond);
    const lt = luminance(...texte);
    const contraste = (Math.max(lf, lt) + 0.05) / (Math.min(lf, lt) + 0.05);
    if (contraste >= 3) continue;

    e.style.setProperty("color", lf > 0.42 ? "#111111" : "#ffffff", "important");
  }
}

/*
  Ce que le client écrit finit souvent sur une photographie — son accroche sous
  le titre du hero, sa ville, son téléphone. La couleur de ce texte a été choisie
  pour la phrase de la démonstration, à cet endroit-là de cette image-là.

  Mesuré : soixante-dix thèmes affichent une donnée du client en dessous du seuil
  de lisibilité alors que le thème nu, lui, se lit bien — « Votre plombier de
  confiance à Annecy » écrit en brun sombre sur une photographie de pains dorés.

  On ne touche ni à la couleur ni à la taille : une ombre portée d'un pixel
  suffit à détacher les lettres du fond. Elle ne s'applique qu'aux textes qui
  portent la donnée du client, et seulement quand ils sont posés sur une image.
*/
function detacherLesTextesDuClient(
  donnees: Record<string, unknown> | undefined,
  profil?: Record<string, any>,
) {
  if (!donnees) return;
  const valeurs = ["tagline", "businessName", "city", "phone", "address", "businessType"]
    .map((k) => (typeof donnees[k] === "string" ? (donnees[k] as string).trim() : ""))
    .filter((v) => v.length >= 4);

  /*
    Le profil aussi, pas seulement le formulaire. Une prestation au libellé
    long, un intitulé de chiffre-clé, un nom d'équipier : ces textes-là sortaient
    de l'écran sans que la passe les reconnaisse comme venant du client — elle
    ne connaissait que le nom, la ville et l'accroche. Mesuré sur les carrousels
    d'impact-341, 357 et 372, et sur les bandeaux de chiffres de quatre autres.
  */
  const duProfil = (liste: any[] | undefined, champs: string[]) =>
    (Array.isArray(liste) ? liste : [])
      .flatMap((r) => champs.map((c) => (typeof r?.[c] === "string" ? r[c].trim() : "")))
      .filter((v: string) => v.length >= 4);

  valeurs.push(
    ...duProfil(profil?.services, ["name", "title", "description"]),
    ...duProfil(profil?.menu, ["name", "category"]),
    ...duProfil(profil?.products, ["name"]),
    ...duProfil(profil?.keyStats, ["value", "label"]),
    ...duProfil(profil?.team, ["name", "role"]),
    ...duProfil(profil?.faq, ["q"]),
    ...duProfil(profil?.beforeAfter, ["caption"]),
    ...duProfil(profil?.reputation?.featuredReviews, ["author", "text"]),
    ...(Array.isArray(profil?.certifications) ? profil!.certifications : [])
      .filter((v: unknown) => typeof v === "string" && v.trim().length >= 4)
      .map((v: string) => v.trim()),
  );

  if (valeurs.length === 0) return;

  const surUneImage = (e: Element): boolean => {
    let n: Element | null = e;
    for (let i = 0; i < 6 && n; i++) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== "none") return true;
      // Beaucoup de thèmes posent la photographie en <img> calée derrière le texte.
      if (n.querySelector?.("img")) return true;
      n = n.parentElement;
    }
    return false;
  };

  for (const e of document.querySelectorAll<HTMLElement>("p, span, h1, h2, h3, div, a")) {
    if (e.children.length > 0) continue;
    const t = (e.textContent ?? "").trim();
    if (t.length < 4) continue;
    /*
      Les thèmes mettent volontiers leurs titres en capitales par la feuille de
      style, mais « textContent » rend la casse du source — sauf quand le
      remplacement s'est fait en dur. On compare donc sans tenir compte de la
      casse : « ATELIERS VIDAL & FILS » est bien le nom saisi au wizard.
    */
    const tb = t.toLowerCase();
    /*
      Le texte porte la donnée du client — ou n'en est qu'un morceau. Certains
      titres découpent le nom mot par mot, chacun dans son bloc : aucun élément
      ne contient alors le nom entier, et la passe les laissait tous passer.
      « ÉTABLISSEMENTS » sortait ainsi de quatre-vingt-douze pixels sur
      impact-52 sans que rien ne le voie.
    */
    const porteLaDonnee = valeurs.some(
      (v) => tb.includes(v.toLowerCase()) || (t.length >= 6 && v.toLowerCase().includes(tb)),
    );
    if (!porteLaDonnee) continue;

    /*
      Le débordement se traite partout, la lisibilité seulement sur une photo :
      ce sont deux questions différentes. Un filigrane en trente-cinq pour cent
      de la largeur, un mot de carrousel tenu sur un rang, un titre à effet —
      aucun n'est posé sur une image, et tous sortaient de l'écran de quatre
      cents pixels dès que la donnée du client était plus longue que prévu.
    */
    ajusterAuCadre(e);

    if (!surUneImage(e)) continue;
    // Une ombre déjà posée n'empêche pas de corriger la couleur : ce sont deux
    // décisions distinctes, et la première ne sauve pas un brun sur du doré.
    const ombreDejaLa = getComputedStyle(e).textShadow !== "none";

    const c = versRGB(getComputedStyle(e).color);
    if (!c) continue;

    /*
      Le titre du hero est lisible sur cette photographie : ses auteurs l'ont
      choisi pour elle. Quand la phrase du client s'en écarte franchement —
      brun sombre sous un titre crème, sur impact-259 — elle reprend sa
      couleur. C'est celle du thème, pas une couleur inventée.
    */
    const section = e.closest("section, header, div[class*='hero'], main") ?? document.body;
    const titre = section.querySelector("h1, h2");
    const ct = titre ? versRGB(getComputedStyle(titre).color) : null;
    let lum = luminance(...c);
    if (ct && Math.abs(luminance(...ct) - lum) > 0.25) {
      e.style.setProperty("color", `rgb(${ct[0]}, ${ct[1]}, ${ct[2]})`, "important");
      lum = luminance(...ct);
    }

    if (!ombreDejaLa) {
      e.style.textShadow = lum > 0.45
        ? "0 1px 3px rgba(0,0,0,0.55)"
        : "0 1px 3px rgba(255,255,255,0.65)";
    }
  }
}

/**
 * Écrire sans arracher le DOM sous React.
 *
 * `textContent = …` supprime tous les nœuds enfants et en crée un nouveau ;
 * `innerHTML = …` en détruit davantage encore. React garde des références sur
 * ces nœuds : au premier re-rendu, il tente d'en retirer un qui n'existe plus
 * et la page entière disparaît — « NotFoundError: Failed to execute
 * 'removeChild' ». Quatre thèmes étaient tombés ainsi.
 *
 * On se contente donc de changer la valeur des nœuds texte déjà en place.
 * React les reconnaît, la structure ne bouge pas, et rien ne casse.
 */
function ecrireTexte(e: HTMLElement, valeur: string): boolean {
  const textes = [...e.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE && (n.nodeValue ?? "").trim());
  if (textes.length === 0) return false;
  textes[0].nodeValue = valeur;
  // Les nœuds texte suivants sont vidés, jamais retirés.
  for (const autre of textes.slice(1)) autre.nodeValue = "";
  return true;
}

/**
 * Le nom du client, amputé par le cadre qui l'accueille.
 *
 * Les en-têtes réservent la place d'un mot — « Vidal », « Bloom » — et coupent
 * le reste avec des points de suspension. « Ateliers Vidal & Fils » devient
 * « Ateliers Vi… » : le nom de l'entreprise, la première chose qu'on lit,
 * arrive amputé. Mesuré sur six thèmes avec un nom de vingt et une lettres,
 * ce qui n'a rien d'extravagant.
 *
 * On rétrécit la police jusqu'à ce que le nom tienne, par paliers, sans
 * descendre sous onze pixels. La barre garde sa hauteur, le dessin ne bouge
 * pas, et le nom se lit en entier. Si même onze pixels ne suffisent pas, on
 * autorise enfin le repli — mieux vaut deux lignes qu'un nom tronqué.
 */
function rendreLesNomsEntiers(nom: string | undefined) {
  if (!nom || nom.trim().length < 4) return;
  const cherche = nom.trim().toLowerCase();

  for (const e of document.querySelectorAll<HTMLElement>("span, a, div, p, h1, h2, h3")) {
    if (e.children.length > 0) continue;
    const t = (e.textContent ?? "").trim();
    if (t.toLowerCase() !== cherche) continue;
    if (e.dataset.nomAjuste) continue;
    if (e.scrollWidth <= e.clientWidth + 4) continue;

    e.dataset.nomAjuste = "1";
    retrecirJusquAuCadre(e);
  }

  /*
    Le nom n'est pas toujours coupé : parfois il pousse ses voisins hors de
    l'écran. « Établissements Vidal-Marquisats & Fils Réunis depuis 1912 »
    laisse le bouton « Prendre rendez-vous » à soixante-sept pixels du bord
    droit — mesuré sur dix-sept thèmes, toujours dans l'en-tête. Le nom, lui,
    tient dans son propre cadre : rien ne le signalait.
  */
  for (const entete of document.querySelectorAll<HTMLElement>("header, nav")) {
    const largeur = document.documentElement.clientWidth;
    const deborde = [...entete.querySelectorAll<HTMLElement>("*")]
      .some((x) => x.children.length === 0 && x.getBoundingClientRect().right > largeur + 4);
    if (!deborde) continue;

    for (const e of entete.querySelectorAll<HTMLElement>("span, a, div, p, h1, h2")) {
      if (e.children.length > 0 || e.dataset.nomRetreci) continue;
      /*
        Le nom, ou l'un de ses morceaux. Les en-têtes le découpent souvent en
        deux blocs — « Ateliers » puis « Vidal & Fils » — et l'égalité stricte
        ne trouvait alors rien à rétrécir : le bouton « Prendre rendez-vous »
        restait poussé hors de l'écran.
      */
      const texte = (e.textContent ?? "").trim().toLowerCase();
      if (texte.length < 4) continue;
      if (texte !== cherche && !cherche.includes(texte) && !texte.includes(cherche)) continue;
      e.dataset.nomRetreci = "1";
      const depart = parseFloat(getComputedStyle(e).fontSize) || 16;
      for (let taille = depart - 1; taille >= 11; taille -= 1) {
        e.style.fontSize = `${taille}px`;
        const encore = [...entete.querySelectorAll<HTMLElement>("*")]
          .some((x) => x.children.length === 0 && x.getBoundingClientRect().right > largeur + 4);
        if (!encore) break;
      }
    }

    /*
      L'en-tête peut déborder sans que le nom y soit pour rien : sur impact-117
      c'est la barre de liens elle-même qui dépasse de deux cents pixels dès que
      le bloc de marque s'allonge. Aucun nom à rétrécir, et pourtant deux
      boutons hors de l'écran.

      On resserre alors la barre entière, d'un cran à la fois et quatre crans au
      plus. C'est ce qu'un maquettiste ferait devant une barre trop chargée, et
      cela ne se déclenche que si elle déborde vraiment.
    */
    const feuilles = [...entete.querySelectorAll<HTMLElement>("*")]
      .filter((x) => x.children.length === 0 && (x.textContent ?? "").trim().length > 1);
    const debordeEncore = () => feuilles.some((x) => x.getBoundingClientRect().right > largeur + 4);
    for (let cran = 0; cran < 10 && debordeEncore(); cran++) {
      for (const x of feuilles) {
        const taille = parseFloat(getComputedStyle(x).fontSize) || 14;
        if (taille <= 8) continue;
        x.style.fontSize = `${Math.max(8, taille - 1)}px`;
      }
    }

    /*
      Une barre reste parfois trop longue même en petits caractères : ses liens
      sont nombreux et son interlettrage large. On resserre alors l'espacement
      des lettres avant de renoncer — c'est invisible à la lecture et cela rend
      les derniers pixels.
    */
    if (debordeEncore()) {
      for (const x of feuilles) {
        const espace = parseFloat(getComputedStyle(x).letterSpacing);
        if (Number.isFinite(espace) && espace > 0) x.style.letterSpacing = `${Math.max(0, espace - 0.5)}px`;
      }
    }

    /*
      Dernier recours : une barre trop chargée pour un téléphone, même en huit
      pixels. Plutôt que de laisser un bouton hors de l'écran, on autorise ses
      rangées à se replier — elle passe sur deux lignes et rien n'est perdu.
      Mesuré sur impact-59, qui ne masque pas sa navigation sur mobile.
    */
    if (debordeEncore()) {
      for (const x of feuilles) {
        /*
          Tous les conteneurs souples jusqu'à l'en-tête, et non le premier
          rencontré : celui-ci ne fait souvent que cent vingt-cinq pixels et le
          replier ne change rien — c'est la rangée de trois cent quatre-vingt-dix
          qui doit céder.
        */
        let n: HTMLElement | null = x.parentElement;
        for (let i = 0; i < 6 && n && n !== entete.parentElement; i++) {
          if (!n.dataset.barreRepliee && getComputedStyle(n).display.includes("flex")) {
            n.dataset.barreRepliee = "1";
            n.style.flexWrap = "wrap";
          }
          n = n.parentElement;
        }
      }
    }
  }
}

/**
 * Un texte du client qui ne tient pas : on le laisse d'abord se replier, puis
 * on rétrécit la police. Le dessin du thème est conservé tant que le texte
 * tient ; on n'intervient qu'au-delà.
 */
/**
 * L'élément vit-il dans quelque chose qui bouge ou qui défile ?
 *
 * Un titre qui défile horizontalement déborde de son cadre par dessein : c'est
 * le geste même. Le rétrécir revient à effacer le thème — impact-347 affichait
 * son titre de héros en onze pixels, la taille plancher, au lieu de soixante.
 *
 * On remonte jusqu'au corps de page : l'animation d'un bandeau est souvent
 * posée bien plus haut que l'élément qui porte le texte.
 */
function dansUnElementQuiBouge(e: Element): boolean {
  let n: Element | null = e;
  let niveau = 0;
  while (n && n !== document.body) {
    const s = getComputedStyle(n);
    /*
      Une animation ou un cadre qui défile protègent sur toute la chaîne : le
      bandeau d'avis d'impact-336 porte la sienne très haut.
    */
    if (["auto", "scroll"].includes(s.overflowX) || ["auto", "scroll"].includes(s.overflow)) return true;
    if (s.animationName !== "none") return true;
    /*
      Une transformation, en revanche, ne protège qu'à deux niveaux. Étendue à
      toute la chaîne, un simple `scale(1.06)` décoratif posé haut dans
      impact-160 mettait à l'abri trente et un éléments qui sortaient vraiment
      de l'écran — dont le nom du client, en titre, à cinq cents pixels d'un
      écran qui en fait trois cent quatre-vingt-dix.
    */
    if (niveau <= 1 && /matrix|translate/.test(s.transform)) return true;
    n = n.parentElement;
    niveau++;
  }
  return false;
}

function ajusterAuCadre(e: HTMLElement) {
  /*
    L'ajustement se refait quand le texte change, et seulement alors : un
    carrousel remplace le mot dans le même élément toutes les trois secondes,
    et la taille calculée pour « Détartrage » ne convient pas à « Installation
    de pompe à chaleur ». Le marquer traité une fois pour toutes le laissait
    tronqué ; le refaire à chaque passe rouvrait à chaque fois une fenêtre où
    l'élément reprend sa taille d'origine avant d'être rétréci — et la page
    clignotait.
  */
  const texte = (e.textContent ?? "").trim();
  if (e.dataset.texteAjuste === texte) return;

  const large = document.documentElement.clientWidth;
  const r = e.getBoundingClientRect();
  const deborde = r.right > large + 4 || e.scrollWidth > e.clientWidth + 4;
  if (!deborde) return;
  /* Ce qui défile déborde à dessein : le rétrécir efface le geste du thème. */
  if (dansUnElementQuiBouge(e)) return;

  // On repart de la taille d'origine, sinon les rétrécissements s'additionnent.
  if (!e.dataset.tailleOrigine) {
    e.dataset.tailleOrigine = String(parseFloat(getComputedStyle(e).fontSize) || 16);
  } else {
    e.style.fontSize = `${e.dataset.tailleOrigine}px`;
  }
  e.dataset.texteAjuste = texte;
  e.dataset.clientAjuste = "1";
  e.style.overflowWrap = "anywhere";
  e.style.maxWidth = "100%";
  if (getComputedStyle(e).whiteSpace.startsWith("nowrap")) e.style.whiteSpace = "normal";

  const encore = () =>
    e.getBoundingClientRect().right > large + 4 || e.scrollWidth > e.clientWidth + 4;

  /*
    « cent pour cent » suit le parent, pas l'écran. Sur impact-146 le parent
    fait quatre cent soixante-quatorze pixels pour un écran de trois cent
    quatre-vingt-dix : l'accroche centrée sortait des deux côtés, quarante-deux
    pixels à gauche, autant à droite, sans que la page déborde. On borne donc
    sur la largeur de l'écran.
  */
  if (encore()) e.style.maxWidth = "calc(100vw - 2rem)";
  if (encore()) retrecirJusquAuCadre(e);
}

/**
 * Le nom au bas de la page.
 *
 * La passe qui rend la marque ne regarde que l'en-tête. Le pied de page, lui,
 * garde son « © 2026 L'ÉTOILE ANNECY · ALL RIGHTS RESERVED » — le nom du
 * restaurant de la démonstration, en bas du site d'un couvreur qui l'a payé.
 *
 * On ne remplace que le segment qui suit l'année, jamais la ligne entière :
 * la mention légale, l'éditeur, l'hébergeur sont écrits ailleurs et sont justes.
 */
function rendreLeCopyright(nom: string | undefined) {
  if (!nom || nom.trim().length < 2) return;
  const propre = nom.trim();
  /*
     Le millésime peut être une plage : « © 2011–2026 Maison Brûlot ». Le motif
     ne lisait qu'une année, et douze pieds de page gardaient donc le nom de la
     démonstration — juste sous le nom du client affiché partout ailleurs. Le
     séparateur peut être un tiret court, long ou une barre oblique.
  */
  const motif = /(©\s*\d{4}(?:\s*[–—\-\/]\s*\d{4})?\s+)([^·—|\n]{2,60}?)(\s*(?:·|—|\||\.|$))/;

  /*
     Tout ce qui porte un « © », et pas seulement ce qui vit dans un <footer>.
     Beaucoup de thèmes composent leur bas de page avec un <div> ou une <section>
     — « © 2026 Le Barber Club — Site par Aevia WS » n'était donc jamais réécrit.
  */
  for (const e of document.querySelectorAll<HTMLElement>("body *")) {
    if (e.children.length > 0 || e.dataset.copyrightRendu) continue;
    const t = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!t.includes("©")) continue;
    if (t.toLowerCase().includes(propre.toLowerCase())) continue;
    const m = motif.exec(t);
    if (!m) continue;

    /*
      On écrit dans le nœud de texte existant, jamais `textContent = …` :
      cette affectation détruit les enfants et en crée un nouveau, alors que
      React garde une référence sur l'ancien. Au rendu suivant il tente
      d'insérer devant un nœud qui n'est plus là — « Failed to execute
      insertBefore » — et la page entière disparaît. Vu en production sur
      impact-380, après déploiement.
    */
    const noeud = Array.from(e.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
    if (!noeud) continue;
    e.dataset.copyrightRendu = "1";
    noeud.nodeValue = (noeud.nodeValue ?? "").replace(motif, `$1${propre}$3`);
  }
}

/**
 * Le téléphone et le courriel du client, quand la page ne les porte nulle part.
 *
 * Cent soixante et onze thèmes du catalogue n'affichent ni l'un ni l'autre —
 * pas même en lien `tel:`. Pour un site d'artisan, c'est le manque le plus
 * coûteux qui soit : le visiteur trouve le métier, la ville, les prestations,
 * et repart sans pouvoir appeler.
 *
 * On ne redessine rien : on ajoute une ligne au pied de page, dans sa couleur
 * et sa fonte, et seulement si le numéro n'apparaît nulle part ailleurs. Un
 * thème qui affiche déjà le contact ne bouge pas d'un pixel.
 */
function poserLeContact(donnees: Record<string, unknown> | undefined) {
  const tel = typeof donnees?.phone === "string" ? donnees.phone.trim() : "";
  const mail = typeof donnees?.email === "string" ? donnees.email.trim() : "";
  if (!tel && !mail) return;

  /*
    Trois thèmes n'ont pas de balise `footer` du tout — impact-115, 121 et 131.
    La ligne n'avait alors nulle part où se poser, et le client restait
    injoignable. À défaut de pied de page, on la met en fin de document, avec un
    filet au-dessus pour qu'elle ne paraisse pas tomber là par accident.
  */
  if (document.querySelector("[data-contact-pose]")) return;

  /* Le besoin d'abord : sans quoi la passe, qui repasse six fois, sèmerait six
     blocs vides sur les pages qui affichent déjà le contact. */
  const texte = document.body.textContent ?? "";
  const manqueTel = Boolean(tel) && !texte.includes(tel);
  const manqueMail = Boolean(mail) && !texte.includes(mail);
  if (!manqueTel && !manqueMail) return;

  /*
    Trois thèmes n'ont pas de balise `footer` du tout — impact-115, 121 et 131.
    La ligne n'avait alors nulle part où se poser, et le client restait
    injoignable. À défaut de pied de page, on la met en fin de document, avec un
    filet au-dessus pour qu'elle ne paraisse pas tomber là par accident.
  */
  const pied =
    document.querySelector<HTMLElement>("footer") ??
    (() => {
      const bloc = document.createElement("div");
      bloc.style.cssText =
        "padding:28px 6vw;border-top:1px solid currentColor;opacity:0.75;font-size:14px";
      document.body.appendChild(bloc);
      return bloc;
    })();

  pied.dataset.contactPose = "1";
  const ligne = document.createElement("div");
  ligne.style.cssText =
    "margin-top:16px;display:flex;gap:20px;flex-wrap:wrap;align-items:center;font-size:14px;line-height:1.6;opacity:0.9";

  const lien = (href: string, libelle: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = libelle;
    a.style.cssText = "color:inherit;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:1px";
    return a;
  };
  if (manqueTel) ligne.appendChild(lien(`tel:${tel.replace(/[^\d+]/g, "")}`, tel));
  if (manqueMail) ligne.appendChild(lien(`mailto:${mail}`, mail));
  pied.appendChild(ligne);
}

/**
 * Le fond du thème jusqu'au bas du document.
 *
 * impact-333 finit sur cent trente pixels blancs sous son pied de page noir.
 * Le thème peint son fond sur sa propre enveloppe ; quand le document est plus
 * haut qu'elle — un décor en position absolue, une ancre, un espace de fin —
 * c'est le blanc du navigateur qui apparaît dessous.
 *
 * On recopie donc le fond de l'enveloppe sur `html` et `body`. Rien ne change
 * quand le thème est clair ; sur les thèmes sombres, la bande disparaît.
 */
/*
  Le lexique d'interface, dans les quatre langues que nous vendons.

  Établi sur le corpus réel : les libellés relevés à l'écran sur les 373
  thèmes, triés par fréquence. Ce sont les mots que le client ne peut pas
  changer lui-même — navigation, boutons, titres de section.
*/
const LEXIQUE_INTERFACE: Record<string, Record<string, string>> = {
  fr: {
    "all rights reserved.": "Tous droits réservés.",
    ". all rights reserved.": ". Tous droits réservés.",
    "terms of service": "Conditions générales",
    "start a project": "Démarrer un projet",
    "initiate project": "Démarrer un projet",
    "start engagement": "Démarrer la mission",
    "start free trial": "Essayer gratuitement",
    "start free week": "Une semaine offerte",
    "get started free": "Commencer gratuitement",
    "buy now": "Acheter",
    "apply now": "Postuler",
    "get tickets": "Réserver une place",
    "book this package": "Réserver cette formule",
    "book consultation": "Prendre rendez-vous",
    "next slide": "Suivant",
    "previous slide": "Précédent",
    "scroll to explore": "Faites défiler",
    "view projects": "Voir les réalisations",
    "view work": "Voir les réalisations",
    "all projects": "Toutes les réalisations",
    "selected works": "Réalisations choisies",
    "works": "Réalisations",
    "view profile": "Voir le profil",
    "discover more": "En savoir plus",
    "read case study": "Lire l'étude de cas",
    "get directions": "Itinéraire",
    "our philosophy": "Notre philosophie",
    "how we work": "Comment nous travaillons",
    "what we do": "Ce que nous faisons",
    "guest reviews": "Avis des clients",
    "best-seller": "Le plus demandé",
    "the experience": "L'expérience",
    "the journal": "Le journal",
    "the atelier": "L'atelier",
    "unlimited projects": "Projets illimités",
    "opening hours": "Horaires d'ouverture",
    "our clients": "Nos clients",
    "our approach": "Notre approche",
    "the process": "La méthode",
    "our expertise": "Notre savoir-faire",
    "meet the team": "Faire connaissance",
    "case studies": "Études de cas",
    "send a message": "Envoyer un message",
    "request access": "Demander un accès",
    "get early access": "Accès anticipé",
    "choose your plan": "Choisir sa formule",
    "most popular": "Le plus choisi",
    "coming soon": "Bientôt disponible",
    "view all projects": "Voir toutes les réalisations",
    "back to top": "Haut de page",
    "services built for impact.": "Des prestations qui comptent.",
    "our process, step by step.": "Notre méthode, étape par étape.",
    "let's talk": "Parlons-en",
    "recent projects.": "Réalisations récentes.",
    "ready to build something great?": "Un projet en tête ?",
    "what our clients say": "Ce que disent nos clients",
    "made by hand, with intention.": "Fait main, avec intention.",
    "questions & answers": "Questions et réponses",
    "everything you need.": "Tout ce qu'il vous faut.",
    "nothing you don't.": "Rien de superflu.",
    "how it works": "Comment ça se passe",
    "the story": "L'histoire",
    "our story": "Notre histoire",
    "get in touch": "Nous écrire",
    "selected work": "Réalisations choisies",
    "view case": "Voir le projet",
    "trusted by": "Ils nous font confiance",
    "home": "Accueil",
    "about": "À propos",
    "about us": "À propos",
    "services": "Prestations",
    "our services": "Nos prestations",
    "pricing": "Tarifs",
    "prices": "Tarifs",
    "plans": "Formules",
    "team": "Équipe",
    "our team": "Notre équipe",
    "the team": "L'équipe",
    "testimonials": "Avis",
    "reviews": "Avis",
    "gallery": "Galerie",
    "portfolio": "Réalisations",
    "work": "Réalisations",
    "our work": "Nos réalisations",
    "recent projects": "Réalisations récentes",
    "projects": "Projets",
    "process": "Méthode",
    "our process": "Notre méthode",
    "features": "Ce qui est inclus",
    "questions": "Questions",
    "faq": "Questions fréquentes",
    "frequently asked questions": "Questions fréquentes",
    "common questions": "Questions fréquentes",
    "contact": "Contact",
    "contact us": "Nous contacter",
    "book now": "Réserver",
    "book": "Réserver",
    "book a call": "Prendre rendez-vous",
    "get started": "Commencer",
    "start free": "Essayer gratuitement",
    "learn more": "En savoir plus",
    "read more": "Lire la suite",
    "view all": "Tout voir",
    "see more": "Voir plus",
    "all": "Tout",
    "discover": "Découvrir",
    "explore": "Explorer",
    "menu": "Carte",
    "blog": "Blog",
    "news": "Actualités",
    "journal": "Journal",
    "hours": "Horaires",
    "location": "Adresse",
    "find us": "Nous trouver",
    "follow us": "Nous suivre",
    "call us": "Nous appeler",
    "email us": "Nous écrire",
    "request a quote": "Demander un devis",
    "get a quote": "Demander un devis",
    "free quote": "Devis gratuit",
    "why choose us": "Pourquoi nous choisir",
    "our values": "Nos valeurs",
    "certifications": "Certifications",
    "guarantees": "Garanties",
    "legal": "Mentions légales",
    "legal notice": "Mentions légales",
    "privacy": "Confidentialité",
    "privacy policy": "Politique de confidentialité",
    "terms": "Conditions",
    "all rights reserved": "Tous droits réservés",
    "send": "Envoyer",
    "send message": "Envoyer le message",
    "your name": "Votre nom",
    "your email": "Votre e-mail",
    "your message": "Votre message",
    "next": "Suivant",
    "previous": "Précédent",
    "close": "Fermer",
    "back": "Retour",
    "more": "Plus",
    "details": "Détails",
    "our history": "Notre histoire",
    "the method": "La méthode",
    "the firm": "Le cabinet",
    "the people": "L'équipe",
    "the practitioners": "Les praticiens",
    "the partners": "Les associés",
    "our partners": "Nos partenaires",
    "our manifesto": "Notre manifeste",
    "the collection": "La collection",
    "the archive": "Les archives",
    "the review": "La revue",
    "the journey": "Le parcours",
    "the protocol": "Le protocole",
    "the cellar": "La cave",
    "the fleet": "La flotte",
    "the movement": "Le mouvement",
    "terms of use": "Conditions d'utilisation",
    "read whitepaper": "Lire le livre blanc",
    "watch demo": "Voir la démonstration",
    "start a conversation": "Entamer la conversation",
    "best value": "Le meilleur rapport",
    "sold out": "Complet",
    "members only": "Réservé aux membres",
    "response time": "Délai de réponse",
    "years in practice": "Années d'exercice",
    "years of experience": "Années d'expérience",
    "all systems operational": "Tous les systèmes fonctionnent",
    "new enquiry": "Nouvelle demande",
    "see the fees": "Voir les tarifs",
    "expertise report": "Rapport d'expertise",
    "open source": "Code ouvert",
    "open data": "Données ouvertes",
    "practice areas": "Domaines d'intervention",
    "senior partners": "Les associés",
    "what we publish": "Nos publications",
    "what we closed": "Nos dossiers",
    "a legacy of": "Un héritage d'",
    "featured work": "Réalisations choisies",
    "trusted by top brands": "Ils nous font confiance",
    "by the numbers": "En chiffres",
    "project workflow": "Notre méthode",
    "awards & recognition": "Distinctions",
    "pricing guide": "Nos tarifs",
    "typical project ranges": "Fourchettes indicatives",
    "package includes": "Ce qui est compris",
    "the raw materials": "Les matières",
    "the first three trials": "Les trois premiers essais",
    "our mission": "Notre mission",
    "read the issue": "Lire le numéro",
    "the weekly dispatch": "La lettre hebdomadaire",
    "shop the drop": "Voir la collection",
    "materials that age with you": "Des matières qui vieillissent avec vous",
    "what we build": "Ce que nous construisons",
    "view our work": "Voir nos réalisations",
    "start building for free": "Commencer gratuitement",
    "plan your voyage": "Préparer votre séjour",
    "enter the atelier": "Entrer dans l'atelier",
    "the thermal circuit": "Le parcours thermal",
    "scroll": "Faites défiler",
    "careers": "Recrutement",
    "press": "Presse",
    "support": "Assistance",
    "docs": "Documentation",
    "technology": "Technologie",
    "bespoke": "Sur mesure",
    "lookbook": "Catalogue",
    "business": "Économie",
    "apply": "Candidater",
    "subscribe": "S'abonner",
    "sign in": "Se connecter",
    "log in": "Se connecter",
    "sign up": "Créer un compte",
    "register": "S'inscrire",
    "shop": "Boutique",
    "learn": "Apprendre",
    "magazine": "Magazine",
    "craft": "Savoir-faire",
    "politics": "Politique",
    "drops": "Nouveautés",
    "acquire": "Acquérir",
    "account": "Mon compte",
    "stories": "Récits",
    "limited": "Édition limitée",
    "done": "Terminé",
    "finish": "Terminer",
    "join": "Rejoindre",
    "cart": "Panier",
    "checkout": "Commander",
    "search": "Rechercher",
    "browse": "Parcourir",
    "watch": "Regarder",
    "share": "Partager",
    "submit": "Envoyer",
    "cancel": "Annuler",
  },
  es: {
    "all rights reserved.": "Todos los derechos reservados.",
    ". all rights reserved.": ". Todos los derechos reservados.",
    "terms of service": "Condiciones del servicio",
    "start a project": "Empezar un proyecto",
    "initiate project": "Iniciar el proyecto",
    "start engagement": "Iniciar el encargo",
    "start free trial": "Prueba gratuita",
    "start free week": "Semana gratis",
    "get started free": "Empezar gratis",
    "buy now": "Comprar",
    "apply now": "Postular",
    "get tickets": "Comprar entradas",
    "book this package": "Reservar este paquete",
    "book consultation": "Reservar consulta",
    "next slide": "Siguiente",
    "previous slide": "Anterior",
    "scroll to explore": "Desplázate",
    "view projects": "Ver proyectos",
    "view work": "Ver trabajos",
    "all projects": "Todos los proyectos",
    "selected works": "Trabajos seleccionados",
    "works": "Trabajos",
    "view profile": "Ver perfil",
    "discover more": "Descubrir más",
    "read case study": "Leer el caso",
    "get directions": "Cómo llegar",
    "our philosophy": "Nuestra filosofía",
    "how we work": "Cómo trabajamos",
    "what we do": "Lo que hacemos",
    "guest reviews": "Opiniones de los huéspedes",
    "best-seller": "Más vendido",
    "the experience": "La experiencia",
    "the journal": "El diario",
    "the atelier": "El taller",
    "unlimited projects": "Proyectos ilimitados",
    "opening hours": "Horario de apertura",
    "our clients": "Nuestros clientes",
    "our approach": "Nuestro enfoque",
    "the process": "El método",
    "our expertise": "Nuestra experiencia",
    "meet the team": "Conoce al equipo",
    "case studies": "Casos prácticos",
    "send a message": "Enviar un mensaje",
    "request access": "Solicitar acceso",
    "get early access": "Acceso anticipado",
    "choose your plan": "Elige tu plan",
    "most popular": "El más popular",
    "coming soon": "Próximamente",
    "view all projects": "Ver todos los proyectos",
    "back to top": "Volver arriba",
    "services built for impact.": "Servicios que cuentan.",
    "our process, step by step.": "Nuestro método, paso a paso.",
    "let's talk": "Hablemos",
    "recent projects.": "Proyectos recientes.",
    "ready to build something great?": "¿Tienes un proyecto?",
    "what our clients say": "Lo que dicen nuestros clientes",
    "made by hand, with intention.": "Hecho a mano, con intención.",
    "questions & answers": "Preguntas y respuestas",
    "everything you need.": "Todo lo que necesitas.",
    "nothing you don't.": "Nada de más.",
    "how it works": "Cómo funciona",
    "the story": "La historia",
    "our story": "Nuestra historia",
    "get in touch": "Escríbenos",
    "selected work": "Trabajos seleccionados",
    "view case": "Ver el caso",
    "trusted by": "Confían en nosotros",
    "home": "Inicio",
    "about": "Sobre nosotros",
    "about us": "Sobre nosotros",
    "services": "Servicios",
    "our services": "Nuestros servicios",
    "pricing": "Tarifas",
    "prices": "Tarifas",
    "plans": "Planes",
    "team": "Equipo",
    "our team": "Nuestro equipo",
    "the team": "El equipo",
    "testimonials": "Opiniones",
    "reviews": "Opiniones",
    "gallery": "Galería",
    "portfolio": "Portafolio",
    "work": "Trabajos",
    "our work": "Nuestros trabajos",
    "recent projects": "Proyectos recientes",
    "projects": "Proyectos",
    "process": "Método",
    "our process": "Nuestro método",
    "features": "Características",
    "questions": "Preguntas",
    "faq": "Preguntas frecuentes",
    "frequently asked questions": "Preguntas frecuentes",
    "common questions": "Preguntas frecuentes",
    "contact": "Contacto",
    "contact us": "Contáctanos",
    "book now": "Reservar",
    "book": "Reservar",
    "book a call": "Agendar una llamada",
    "get started": "Empezar",
    "start free": "Prueba gratis",
    "learn more": "Saber más",
    "read more": "Leer más",
    "view all": "Ver todo",
    "see more": "Ver más",
    "all": "Todo",
    "discover": "Descubrir",
    "explore": "Explorar",
    "menu": "Carta",
    "blog": "Blog",
    "news": "Noticias",
    "journal": "Diario",
    "hours": "Horario",
    "location": "Dirección",
    "find us": "Encuéntranos",
    "follow us": "Síguenos",
    "call us": "Llámanos",
    "email us": "Escríbenos",
    "request a quote": "Solicitar presupuesto",
    "get a quote": "Solicitar presupuesto",
    "free quote": "Presupuesto gratuito",
    "why choose us": "Por qué elegirnos",
    "our values": "Nuestros valores",
    "certifications": "Certificaciones",
    "guarantees": "Garantías",
    "legal": "Aviso legal",
    "legal notice": "Aviso legal",
    "privacy": "Privacidad",
    "privacy policy": "Política de privacidad",
    "terms": "Condiciones",
    "all rights reserved": "Todos los derechos reservados",
    "send": "Enviar",
    "send message": "Enviar mensaje",
    "your name": "Tu nombre",
    "your email": "Tu correo",
    "your message": "Tu mensaje",
    "next": "Siguiente",
    "previous": "Anterior",
    "close": "Cerrar",
    "back": "Volver",
    "more": "Más",
    "details": "Detalles",
    "our history": "Nuestra historia",
    "the method": "El método",
    "the firm": "El despacho",
    "the people": "El equipo",
    "the practitioners": "Los profesionales",
    "the partners": "Los socios",
    "our partners": "Nuestros socios",
    "our manifesto": "Nuestro manifiesto",
    "the collection": "La colección",
    "the archive": "El archivo",
    "the review": "La revista",
    "the journey": "El recorrido",
    "the protocol": "El protocolo",
    "the cellar": "La bodega",
    "the fleet": "La flota",
    "the movement": "El movimiento",
    "terms of use": "Condiciones de uso",
    "read whitepaper": "Leer el informe",
    "watch demo": "Ver la demostración",
    "start a conversation": "Iniciar la conversación",
    "best value": "La mejor relación",
    "sold out": "Agotado",
    "members only": "Solo para socios",
    "response time": "Tiempo de respuesta",
    "years in practice": "Años de ejercicio",
    "years of experience": "Años de experiencia",
    "all systems operational": "Todos los sistemas operativos",
    "new enquiry": "Nueva solicitud",
    "see the fees": "Ver las tarifas",
    "expertise report": "Informe de peritaje",
    "open source": "Código abierto",
    "open data": "Datos abiertos",
    "practice areas": "Áreas de práctica",
    "senior partners": "Los socios",
    "what we publish": "Nuestras publicaciones",
    "what we closed": "Nuestros casos",
    "a legacy of": "Un legado de",
    "featured work": "Trabajos destacados",
    "trusted by top brands": "Confían en nosotros",
    "by the numbers": "En cifras",
    "project workflow": "Nuestro método",
    "awards & recognition": "Reconocimientos",
    "pricing guide": "Nuestras tarifas",
    "typical project ranges": "Rangos indicativos",
    "package includes": "Qué incluye",
    "the raw materials": "Las materias",
    "the first three trials": "Los tres primeros ensayos",
    "our mission": "Nuestra misión",
    "read the issue": "Leer el número",
    "the weekly dispatch": "El boletín semanal",
    "shop the drop": "Ver la colección",
    "materials that age with you": "Materiales que envejecen con usted",
    "what we build": "Lo que construimos",
    "view our work": "Ver nuestros trabajos",
    "start building for free": "Empezar gratis",
    "plan your voyage": "Planifique su viaje",
    "enter the atelier": "Entrar en el taller",
    "the thermal circuit": "El circuito termal",
    "scroll": "Desplace",
    "careers": "Empleo",
    "press": "Prensa",
    "support": "Soporte",
    "docs": "Documentación",
    "technology": "Tecnología",
    "bespoke": "A medida",
    "lookbook": "Catálogo",
    "business": "Economía",
    "apply": "Presentar candidatura",
    "subscribe": "Suscribirse",
    "sign in": "Iniciar sesión",
    "log in": "Iniciar sesión",
    "sign up": "Crear una cuenta",
    "register": "Registrarse",
    "shop": "Tienda",
    "learn": "Aprender",
    "magazine": "Revista",
    "craft": "Oficio",
    "politics": "Política",
    "drops": "Novedades",
    "acquire": "Adquirir",
    "account": "Mi cuenta",
    "stories": "Relatos",
    "limited": "Edición limitada",
    "done": "Hecho",
    "finish": "Terminar",
    "join": "Unirse",
    "cart": "Carrito",
    "checkout": "Pagar",
    "search": "Buscar",
    "browse": "Explorar",
    "watch": "Ver",
    "share": "Compartir",
    "submit": "Enviar",
    "cancel": "Cancelar",
  },
  de: {
    "all rights reserved.": "Alle Rechte vorbehalten.",
    ". all rights reserved.": ". Alle Rechte vorbehalten.",
    "terms of service": "Nutzungsbedingungen",
    "start a project": "Projekt starten",
    "initiate project": "Projekt starten",
    "start engagement": "Auftrag starten",
    "start free trial": "Kostenlos testen",
    "start free week": "Gratiswoche",
    "get started free": "Kostenlos starten",
    "buy now": "Jetzt kaufen",
    "apply now": "Jetzt bewerben",
    "get tickets": "Tickets sichern",
    "book this package": "Dieses Paket buchen",
    "book consultation": "Termin vereinbaren",
    "next slide": "Weiter",
    "previous slide": "Zurück",
    "scroll to explore": "Nach unten scrollen",
    "view projects": "Projekte ansehen",
    "view work": "Arbeiten ansehen",
    "all projects": "Alle Projekte",
    "selected works": "Ausgewählte Arbeiten",
    "works": "Arbeiten",
    "view profile": "Profil ansehen",
    "discover more": "Mehr entdecken",
    "read case study": "Fallstudie lesen",
    "get directions": "Route berechnen",
    "our philosophy": "Unsere Philosophie",
    "how we work": "Wie wir arbeiten",
    "what we do": "Was wir tun",
    "guest reviews": "Gästebewertungen",
    "best-seller": "Bestseller",
    "the experience": "Das Erlebnis",
    "the journal": "Das Journal",
    "the atelier": "Das Atelier",
    "unlimited projects": "Unbegrenzte Projekte",
    "opening hours": "Öffnungszeiten",
    "our clients": "Unsere Kunden",
    "our approach": "Unser Ansatz",
    "the process": "Der Ablauf",
    "our expertise": "Unsere Expertise",
    "meet the team": "Das Team kennenlernen",
    "case studies": "Fallstudien",
    "send a message": "Nachricht senden",
    "request access": "Zugang anfordern",
    "get early access": "Früher Zugang",
    "choose your plan": "Paket wählen",
    "most popular": "Am beliebtesten",
    "coming soon": "Demnächst",
    "view all projects": "Alle Projekte ansehen",
    "back to top": "Nach oben",
    "services built for impact.": "Leistungen, die zählen.",
    "our process, step by step.": "Unser Ablauf, Schritt für Schritt.",
    "let's talk": "Sprechen wir",
    "recent projects.": "Aktuelle Projekte.",
    "ready to build something great?": "Ein Projekt im Kopf?",
    "what our clients say": "Was unsere Kunden sagen",
    "made by hand, with intention.": "Handgemacht, mit Absicht.",
    "questions & answers": "Fragen und Antworten",
    "everything you need.": "Alles, was Sie brauchen.",
    "nothing you don't.": "Nichts Überflüssiges.",
    "how it works": "So läuft es ab",
    "the story": "Die Geschichte",
    "our story": "Unsere Geschichte",
    "get in touch": "Schreiben Sie uns",
    "selected work": "Ausgewählte Arbeiten",
    "view case": "Projekt ansehen",
    "trusted by": "Vertrauen uns",
    "home": "Startseite",
    "about": "Über uns",
    "about us": "Über uns",
    "services": "Leistungen",
    "our services": "Unsere Leistungen",
    "pricing": "Preise",
    "prices": "Preise",
    "plans": "Pakete",
    "team": "Team",
    "our team": "Unser Team",
    "the team": "Das Team",
    "testimonials": "Stimmen",
    "reviews": "Bewertungen",
    "gallery": "Galerie",
    "portfolio": "Portfolio",
    "work": "Arbeiten",
    "our work": "Unsere Arbeiten",
    "recent projects": "Aktuelle Projekte",
    "projects": "Projekte",
    "process": "Ablauf",
    "our process": "Unser Ablauf",
    "features": "Leistungsmerkmale",
    "questions": "Fragen",
    "faq": "Häufige Fragen",
    "frequently asked questions": "Häufige Fragen",
    "common questions": "Häufige Fragen",
    "contact": "Kontakt",
    "contact us": "Kontakt aufnehmen",
    "book now": "Jetzt buchen",
    "book": "Buchen",
    "book a call": "Termin vereinbaren",
    "get started": "Loslegen",
    "start free": "Kostenlos testen",
    "learn more": "Mehr erfahren",
    "read more": "Weiterlesen",
    "view all": "Alle ansehen",
    "see more": "Mehr sehen",
    "all": "Alle",
    "discover": "Entdecken",
    "explore": "Erkunden",
    "menu": "Speisekarte",
    "blog": "Blog",
    "news": "Aktuelles",
    "journal": "Journal",
    "hours": "Öffnungszeiten",
    "location": "Adresse",
    "find us": "So finden Sie uns",
    "follow us": "Folgen Sie uns",
    "call us": "Rufen Sie uns an",
    "email us": "Schreiben Sie uns",
    "request a quote": "Angebot anfordern",
    "get a quote": "Angebot anfordern",
    "free quote": "Kostenloses Angebot",
    "why choose us": "Warum wir",
    "our values": "Unsere Werte",
    "certifications": "Zertifizierungen",
    "guarantees": "Garantien",
    "legal": "Impressum",
    "legal notice": "Impressum",
    "privacy": "Datenschutz",
    "privacy policy": "Datenschutzerklärung",
    "terms": "AGB",
    "all rights reserved": "Alle Rechte vorbehalten",
    "send": "Senden",
    "send message": "Nachricht senden",
    "your name": "Ihr Name",
    "your email": "Ihre E-Mail",
    "your message": "Ihre Nachricht",
    "next": "Weiter",
    "previous": "Zurück",
    "close": "Schließen",
    "back": "Zurück",
    "more": "Mehr",
    "details": "Details",
    "our history": "Unsere Geschichte",
    "the method": "Die Methode",
    "the firm": "Die Kanzlei",
    "the people": "Das Team",
    "the practitioners": "Die Fachkräfte",
    "the partners": "Die Partner",
    "our partners": "Unsere Partner",
    "our manifesto": "Unser Manifest",
    "the collection": "Die Kollektion",
    "the archive": "Das Archiv",
    "the review": "Die Revue",
    "the journey": "Der Weg",
    "the protocol": "Das Protokoll",
    "the cellar": "Der Weinkeller",
    "the fleet": "Die Flotte",
    "the movement": "Die Bewegung",
    "terms of use": "Nutzungsbedingungen",
    "read whitepaper": "Whitepaper lesen",
    "watch demo": "Demo ansehen",
    "start a conversation": "Gespräch beginnen",
    "best value": "Bestes Verhältnis",
    "sold out": "Ausverkauft",
    "members only": "Nur für Mitglieder",
    "response time": "Antwortzeit",
    "years in practice": "Jahre im Beruf",
    "years of experience": "Jahre Erfahrung",
    "all systems operational": "Alle Systeme betriebsbereit",
    "new enquiry": "Neue Anfrage",
    "see the fees": "Preise ansehen",
    "expertise report": "Gutachten",
    "open source": "Open Source",
    "open data": "Offene Daten",
    "practice areas": "Tätigkeitsbereiche",
    "senior partners": "Die Partner",
    "what we publish": "Unsere Veröffentlichungen",
    "what we closed": "Unsere Mandate",
    "a legacy of": "Ein Erbe der",
    "featured work": "Ausgewählte Arbeiten",
    "trusted by top brands": "Sie vertrauen uns",
    "by the numbers": "In Zahlen",
    "project workflow": "Unsere Methode",
    "awards & recognition": "Auszeichnungen",
    "pricing guide": "Unsere Preise",
    "typical project ranges": "Übliche Preisspannen",
    "package includes": "Im Preis enthalten",
    "the raw materials": "Die Rohstoffe",
    "the first three trials": "Die ersten drei Versuche",
    "our mission": "Unsere Mission",
    "read the issue": "Ausgabe lesen",
    "the weekly dispatch": "Der Wochenbrief",
    "shop the drop": "Zur Kollektion",
    "materials that age with you": "Materialien, die mit Ihnen altern",
    "what we build": "Was wir bauen",
    "view our work": "Unsere Arbeiten ansehen",
    "start building for free": "Kostenlos loslegen",
    "plan your voyage": "Reise planen",
    "enter the atelier": "Zum Atelier",
    "the thermal circuit": "Der Thermalparcours",
    "scroll": "Scrollen",
    "careers": "Karriere",
    "press": "Presse",
    "support": "Hilfe",
    "docs": "Doku",
    "technology": "Technologie",
    "bespoke": "Maßarbeit",
    "lookbook": "Katalog",
    "business": "Wirtschaft",
    "apply": "Bewerben",
    "subscribe": "Abonnieren",
    "sign in": "Anmelden",
    "log in": "Anmelden",
    "sign up": "Registrieren",
    "register": "Registrieren",
    "shop": "Shop",
    "learn": "Lernen",
    "magazine": "Magazin",
    "craft": "Handwerk",
    "politics": "Politik",
    "drops": "Neuheiten",
    "acquire": "Erwerben",
    "account": "Mein Konto",
    "stories": "Geschichten",
    "limited": "Limitiert",
    "done": "Fertig",
    "finish": "Beenden",
    "join": "Beitreten",
    "cart": "Warenkorb",
    "checkout": "Zur Kasse",
    "search": "Suchen",
    "browse": "Durchsehen",
    "watch": "Ansehen",
    "share": "Teilen",
    "submit": "Absenden",
    "cancel": "Abbrechen",
  },
  pt: {
    "all rights reserved.": "Todos os direitos reservados.",
    ". all rights reserved.": ". Todos os direitos reservados.",
    "terms of service": "Termos de serviço",
    "start a project": "Iniciar um projeto",
    "initiate project": "Iniciar projeto",
    "start engagement": "Iniciar o trabalho",
    "start free trial": "Testar gratuitamente",
    "start free week": "Semana grátis",
    "get started free": "Começar grátis",
    "buy now": "Comprar",
    "apply now": "Candidatar-se",
    "get tickets": "Comprar bilhetes",
    "book this package": "Reservar este pacote",
    "book consultation": "Marcar consulta",
    "next slide": "Seguinte",
    "previous slide": "Anterior",
    "scroll to explore": "Deslize para ver",
    "view projects": "Ver projetos",
    "view work": "Ver trabalhos",
    "all projects": "Todos os projetos",
    "selected works": "Trabalhos selecionados",
    "works": "Trabalhos",
    "view profile": "Ver perfil",
    "discover more": "Saber mais",
    "read case study": "Ler o estudo de caso",
    "get directions": "Como chegar",
    "our philosophy": "A nossa filosofia",
    "how we work": "Como trabalhamos",
    "what we do": "O que fazemos",
    "guest reviews": "Avaliações dos hóspedes",
    "best-seller": "Mais vendido",
    "the experience": "A experiência",
    "the journal": "O jornal",
    "the atelier": "O ateliê",
    "unlimited projects": "Projetos ilimitados",
    "opening hours": "Horário de funcionamento",
    "our clients": "Os nossos clientes",
    "our approach": "A nossa abordagem",
    "the process": "O método",
    "our expertise": "A nossa experiência",
    "meet the team": "Conheça a equipa",
    "case studies": "Estudos de caso",
    "send a message": "Enviar mensagem",
    "request access": "Pedir acesso",
    "get early access": "Acesso antecipado",
    "choose your plan": "Escolha o seu plano",
    "most popular": "Mais escolhido",
    "coming soon": "Em breve",
    "view all projects": "Ver todos os projetos",
    "back to top": "Voltar ao topo",
    "services built for impact.": "Serviços que contam.",
    "our process, step by step.": "O nosso método, passo a passo.",
    "let's talk": "Vamos falar",
    "recent projects.": "Projetos recentes.",
    "ready to build something great?": "Tem um projeto?",
    "what our clients say": "O que dizem os nossos clientes",
    "made by hand, with intention.": "Feito à mão, com intenção.",
    "questions & answers": "Perguntas e respostas",
    "everything you need.": "Tudo o que precisa.",
    "nothing you don't.": "Nada a mais.",
    "how it works": "Como funciona",
    "the story": "A história",
    "our story": "A nossa história",
    "get in touch": "Fale connosco",
    "selected work": "Trabalhos selecionados",
    "view case": "Ver o caso",
    "trusted by": "Confiam em nós",
    "home": "Início",
    "about": "Sobre nós",
    "about us": "Sobre nós",
    "services": "Serviços",
    "our services": "Os nossos serviços",
    "pricing": "Preços",
    "prices": "Preços",
    "plans": "Planos",
    "team": "Equipa",
    "our team": "A nossa equipa",
    "the team": "A equipa",
    "testimonials": "Testemunhos",
    "reviews": "Avaliações",
    "gallery": "Galeria",
    "portfolio": "Portefólio",
    "work": "Trabalhos",
    "our work": "Os nossos trabalhos",
    "recent projects": "Projetos recentes",
    "projects": "Projetos",
    "process": "Método",
    "our process": "O nosso método",
    "features": "Funcionalidades",
    "questions": "Perguntas",
    "faq": "Perguntas frequentes",
    "frequently asked questions": "Perguntas frequentes",
    "common questions": "Perguntas frequentes",
    "contact": "Contacto",
    "contact us": "Contacte-nos",
    "book now": "Reservar",
    "book": "Reservar",
    "book a call": "Marcar uma chamada",
    "get started": "Começar",
    "start free": "Começar grátis",
    "learn more": "Saber mais",
    "read more": "Ler mais",
    "view all": "Ver tudo",
    "see more": "Ver mais",
    "all": "Tudo",
    "discover": "Descobrir",
    "explore": "Explorar",
    "menu": "Ementa",
    "blog": "Blog",
    "news": "Notícias",
    "journal": "Jornal",
    "hours": "Horário",
    "location": "Morada",
    "find us": "Encontre-nos",
    "follow us": "Siga-nos",
    "call us": "Ligue-nos",
    "email us": "Envie-nos um email",
    "request a quote": "Pedir orçamento",
    "get a quote": "Pedir orçamento",
    "free quote": "Orçamento grátis",
    "why choose us": "Porquê escolher-nos",
    "our values": "Os nossos valores",
    "certifications": "Certificações",
    "guarantees": "Garantias",
    "legal": "Aviso legal",
    "legal notice": "Aviso legal",
    "privacy": "Privacidade",
    "privacy policy": "Política de privacidade",
    "terms": "Condições",
    "all rights reserved": "Todos os direitos reservados",
    "send": "Enviar",
    "send message": "Enviar mensagem",
    "your name": "O seu nome",
    "your email": "O seu email",
    "your message": "A sua mensagem",
    "next": "Seguinte",
    "previous": "Anterior",
    "close": "Fechar",
    "back": "Voltar",
    "more": "Mais",
    "details": "Detalhes",
    "our history": "A nossa história",
    "the method": "O método",
    "the firm": "A firma",
    "the people": "A equipa",
    "the practitioners": "Os profissionais",
    "the partners": "Os sócios",
    "our partners": "Os nossos parceiros",
    "our manifesto": "O nosso manifesto",
    "the collection": "A coleção",
    "the archive": "O arquivo",
    "the review": "A revista",
    "the journey": "O percurso",
    "the protocol": "O protocolo",
    "the cellar": "A cave",
    "the fleet": "A frota",
    "the movement": "O movimento",
    "terms of use": "Condições de utilização",
    "read whitepaper": "Ler o relatório",
    "watch demo": "Ver a demonstração",
    "start a conversation": "Iniciar a conversa",
    "best value": "Melhor relação",
    "sold out": "Esgotado",
    "members only": "Reservado a membros",
    "response time": "Tempo de resposta",
    "years in practice": "Anos de exercício",
    "years of experience": "Anos de experiência",
    "all systems operational": "Todos os sistemas operacionais",
    "new enquiry": "Novo pedido",
    "see the fees": "Ver os preços",
    "expertise report": "Relatório de peritagem",
    "open source": "Código aberto",
    "open data": "Dados abertos",
    "practice areas": "Áreas de atuação",
    "senior partners": "Os sócios",
    "what we publish": "As nossas publicações",
    "what we closed": "Os nossos processos",
    "a legacy of": "Um legado de",
    "featured work": "Trabalhos em destaque",
    "trusted by top brands": "Confiam em nós",
    "by the numbers": "Em números",
    "project workflow": "O nosso método",
    "awards & recognition": "Distinções",
    "pricing guide": "Os nossos preços",
    "typical project ranges": "Faixas indicativas",
    "package includes": "O que está incluído",
    "the raw materials": "As matérias",
    "the first three trials": "Os três primeiros ensaios",
    "our mission": "A nossa missão",
    "read the issue": "Ler a edição",
    "the weekly dispatch": "A carta semanal",
    "shop the drop": "Ver a coleção",
    "materials that age with you": "Materiais que envelhecem consigo",
    "what we build": "O que construímos",
    "view our work": "Ver os nossos trabalhos",
    "start building for free": "Começar gratuitamente",
    "plan your voyage": "Planeie a sua viagem",
    "enter the atelier": "Entrar no atelier",
    "the thermal circuit": "O circuito termal",
    "scroll": "Deslize",
    "careers": "Recrutamento",
    "press": "Imprensa",
    "support": "Apoio",
    "docs": "Documentação",
    "technology": "Tecnologia",
    "bespoke": "Por medida",
    "lookbook": "Catálogo",
    "business": "Economia",
    "apply": "Candidatar-se",
    "subscribe": "Subscrever",
    "sign in": "Iniciar sessão",
    "log in": "Iniciar sessão",
    "sign up": "Criar conta",
    "register": "Registar-se",
    "shop": "Loja",
    "learn": "Aprender",
    "magazine": "Revista",
    "craft": "Ofício",
    "politics": "Política",
    "drops": "Novidades",
    "acquire": "Adquirir",
    "account": "A minha conta",
    "stories": "Histórias",
    "limited": "Edição limitada",
    "done": "Concluído",
    "finish": "Terminar",
    "join": "Juntar-se",
    "cart": "Carrinho",
    "checkout": "Finalizar compra",
    "search": "Pesquisar",
    "browse": "Explorar",
    "watch": "Ver",
    "share": "Partilhar",
    "submit": "Enviar",
    "cancel": "Cancelar",
  },
};

/*
  Traduire les libellés du thème dans la langue du client.

  Soixante-treize thèmes portent une démonstration en anglais, et le catalogue
  est vendu en cinq langues. Un couvreur d'Annecy recevait un site dont la
  navigation, les boutons et les titres de sections restaient anglais —
  « Services », « Learn more », « What Our Clients Say » — sans qu'il puisse y
  changer quoi que ce soit : le formulaire ne les demande nulle part.

  On ne traduit qu'un nœud de texte dont le contenu entier correspond à une
  entrée du lexique. Jamais un fragment : « Contact » se traduit, « Contactez
  Marie » ne se touche pas. Sans langue connue, on ne traduit rien — traduire au
  hasard serait pire.
*/
/*
  Effacer le nom de la démonstration partout où il reste écrit en dur.

  Les thèmes lisent le nom du client à l'endroit qui compte — l'en-tête, le
  pied, le titre d'accueil — mais leur prose garde le leur : « At Neuralis, we
  believe… », « Année de fondation de Terre Vivante », « now included in every
  WaveForm plan ». Ces phrases vivent dans un témoignage, une question
  fréquente, des conditions générales : des centaines d'endroits, dans des
  centaines de fichiers.

  Un passage sur le texte affiché les prend tous d'un coup, et prendra aussi
  ceux qu'on écrira demain. On ne touche qu'aux nœuds de texte, jamais aux
  attributs ni au balisage, et l'on borne le nom sur les lettres — accents
  compris, puisque « é » n'est pas une lettre pour les bornes de mot de
  JavaScript, si bien que « Éclat » se couperait avant son « c ».

  Les noms d'un seul mot courant — « Atelier », « Table », « Terre » — sont déjà
  écartés de la carte : les remplacer dans une phrase l'abîmerait.
*/
const LETTRE_MARQUE = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/;

function effacerLaMarqueDeDemonstration(nom: string | undefined) {
  if (!nom || nom.trim().length < 2) return;
  const propre = nom.trim();

  const chemin = window.location.pathname.match(/\/templates\/(impact-[\w-]+)/);
  if (!chemin) return;
  const seul = MARQUE_DEMO[chemin[1]];
  if (!seul || seul === propre) return;
  /* Le client s'appelle déjà comme la démonstration : rien à remplacer. */
  if (propre.toLowerCase().includes(seul.toLowerCase())) return;

  /*
     Le nom collé passe en premier : « AnandaFlow » contient « Ananda », et
     traiter le court d'abord laisserait « Cabinet Rive-GaucheFlow ».
  */
  const noms = [...(MARQUE_DEMO_COLLEE[chemin[1]] ?? []), seul]
    .sort((a, b) => b.length - a.length);

  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const aRefaire: Array<[Text, string]> = [];
  for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
    const parent = (n as Text).parentElement;
    if (!parent || parent.closest("style,script,noscript,template")) continue;

    let valeur = n.nodeValue ?? "";
    let deplace = false;
    for (const demo of noms) {
      if (!valeur.includes(demo)) continue;
      let sortie = "", reste = valeur;
      for (let i = reste.indexOf(demo); i >= 0; i = reste.indexOf(demo)) {
        const avant = reste[i - 1] ?? " ";
        const apres = reste[i + demo.length] ?? " ";
        const entier = !LETTRE_MARQUE.test(avant) && !LETTRE_MARQUE.test(apres);
        sortie += reste.slice(0, i) + (entier ? propre : demo);
        if (entier) deplace = true;
        reste = reste.slice(i + demo.length);
      }
      valeur = sortie + reste;
    }
    if (deplace) aRefaire.push([n as Text, valeur]);
  }
  /* On écrit après la lecture : modifier pendant le parcours le fait dérailler. */
  for (const [n, valeur] of aRefaire) n.nodeValue = valeur;
}

/*
  Effacer la queue d'une marque coupée en deux.

  Certains thèmes écrivent leur nom en deux éléments — « Clinique » dans le
  premier, « du Bois Vert » dans le second — et seul le premier lit le nom du
  client. Le visiteur voyait donc « Cabinet Rive-Gauche du Bois Vert ».

  On ne touche qu'au cas non ambigu : deux éléments frères, seuls sous leur
  parent, le premier portant exactement le nom du client, le second un fragment
  court qui commence par un article ou une préposition — jamais une phrase.
  Ailleurs, on laisse : un nom suivi d'un vrai texte est fréquent, et l'effacer
  ferait disparaître du contenu.
*/
const QUEUE = /^(?:de|du|des|d'|d’|la|le|les|et|&)\b[^.!?]{0,22}$/i;

function effacerLaQueueDeLaMarque(nom: string | undefined) {
  if (!nom || nom.trim().length < 2) return;
  const propre = nom.trim();

  for (const e of document.querySelectorAll<HTMLElement>("body *")) {
    if (e.dataset.queueRendue) continue;
    if ((e.textContent ?? "").trim() !== propre) continue;

    const suivant = e.nextElementSibling as HTMLElement | null;
    if (!suivant || suivant.children.length > 0) continue;
    /* Les deux éléments doivent être seuls sous leur parent. */
    if (e.parentElement && e.parentElement.children.length !== 2) continue;

    const queue = (suivant.textContent ?? "").trim();
    if (!queue || queue.length > 24 || !QUEUE.test(queue)) continue;

    e.dataset.queueRendue = "1";
    suivant.style.display = "none";
  }
}

/*
  La prose de démonstration du thème, dans la langue du visiteur.

  Le lexique global ne porte que des libellés — « Contact », « Nos tarifs » — et
  s'arrête à soixante caractères. Ce qui reste en anglais sur une page française
  n'est pas du libellé : ce sont les paragraphes que le thème écrit en dur,
  propres à lui seul. « Our master nose blends the rare absolutes… » ne se
  partage avec aucun autre thème.

  Chaque thème porte donc son propre dictionnaire, chargé avec lui et avec lui
  seul : mille cent trente-six paragraphes en cinq langues dans un lexique
  global pèseraient sur toutes les pages pour ne servir qu'à une.

  Ces phrases disparaissent dès que le client remplit le bloc correspondant.
  Les traduire n'est donc pas un pis-aller : c'est ce qui tient la page pendant
  qu'il ne l'a pas encore rempli.
*/
let traductionsDuTheme: Record<string, Record<string, string>> | null = null;
let themeCharge = "";

async function chargerLesTraductions(theme: string) {
  if (themeCharge === theme) return traductionsDuTheme;
  themeCharge = theme;
  traductionsDuTheme = null;
  try {
    const mod = await import(`./${theme}/traductions`);
    traductionsDuTheme = (mod as { TRADUCTIONS?: Record<string, Record<string, string>> }).TRADUCTIONS ?? null;
  } catch {
    /* Un thème sans dictionnaire n'en a pas besoin : rien à traduire. */
  }
  return traductionsDuTheme;
}

/*
  Les chiffres à l'anglaise sur une page qui ne l'est pas.

  Un site de fleuriste français annonçait « 4,000+ arrangements créés » — la
  virgule des milliers est anglaise, le français met une espace. Une page de
  logiciel affichait « $124.5K » de chiffre d'affaires : un visiteur européen
  n'y lit pas sa monnaie.

  Ces chiffres sont des chiffres de démonstration ; ils disparaissent dès que le
  client remplit ses propres chiffres clés. Tant qu'ils sont là, ils doivent au
  moins s'écrire dans la langue de la page.

  Une seule passe pour les trois cent soixante-treize thèmes : deux cent
  soixante-sept séparateurs et quatre-vingt-quatre montants vivent dans cinq
  cent soixante-huit fichiers, qu'on ne va pas réécrire un à un.
*/
const SEPARATEUR: Record<string, string> = { fr: "\u202f", es: ".", de: ".", pt: "." };

function chiffresDeLaLangue(locale: string | undefined) {
  if (!locale || locale === "en") return;
  const mille = SEPARATEUR[locale];
  if (!mille) return;

  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const aReecrire: [Text, string][] = [];
  for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
    const brut = n.nodeValue ?? "";
    if (!/\d/.test(brut)) continue;
    const e = n.parentElement;
    if (!e || e.closest("style,script,noscript,template,input,textarea")) continue;

    let sortie = brut;
    /* Le dollar devient l'euro : ces montants sont du décor, pas une conversion. */
    sortie = sortie.replace(/\$\s?(\d[\d.,]*\s?[KMB]?)/g, (_, n) => `${n} €`);
    /* La virgule des milliers devient le séparateur de la langue. On exige
       exactement trois chiffres derrière, pour ne pas toucher aux décimales
       écrites « 1,5 ». Deux passes : « 1,234,567 » a deux virgules qui se
       chevauchent, et un seul remplacement en laisserait une. */
    for (let i = 0; i < 2; i++) sortie = sortie.replace(/(\d),(\d{3})\b/g, `$1${mille}$2`);

    if (sortie !== brut) aReecrire.push([n as Text, sortie]);
  }
  for (const [n, valeur] of aReecrire) n.nodeValue = valeur;
}

function traduireLaProse(locale: string | undefined, dico: Record<string, string> | undefined) {
  if (!locale || locale === "en" || !dico) return;

  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const aTraduire: [Text, string][] = [];
  for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
    const brut = n.nodeValue ?? "";
    const texte = brut.trim();
    if (!texte) continue;
    const e = n.parentElement;
    if (!e || e.closest("style,script,noscript,template,input,textarea")) continue;
    const trouve = dico[texte.toLowerCase()];
    if (!trouve) continue;
    aTraduire.push([n as Text, brut.replace(texte, trouve)]);
  }
  /* On écrit dans le nœud existant : `textContent = …` détruirait ce que React
     tient, comme on l'a appris sur impact-380. */
  for (const [n, valeur] of aTraduire) n.nodeValue = valeur;

  /* Un paragraphe coupé entre deux éléments, comme pour les libellés. */
  const ecraser = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const parForme: Record<string, string> = {};
  for (const [k, v] of Object.entries(dico)) parForme[ecraser(k)] = v;

  for (const e of document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,span,a,button,li,blockquote")) {
    const entier = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!entier) continue;
    const trouve = dico[entier.toLowerCase()] ?? parForme[ecraser(entier)];
    if (!trouve) continue;
    if (e.closest("input,textarea,style,script")) continue;
    const noeuds: Text[] = [];
    const m = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n = m.nextNode(); n; n = m.nextNode()) if ((n.nodeValue ?? "").trim()) noeuds.push(n as Text);
    if (noeuds.length < 2) continue;
    noeuds[0].nodeValue = trouve;
    for (let i = 1; i < noeuds.length; i++) noeuds[i].nodeValue = "";
  }
}

function traduireLesLibelles(locale: string | undefined) {
  if (!locale || locale === "en") return;
  const dict = LEXIQUE_INTERFACE[locale];
  if (!dict) return;

  const casseDe = (source: string, traduit: string) => {
    if (source === source.toUpperCase() && source !== source.toLowerCase()) return traduit.toUpperCase();
    if (source[0] === source[0]?.toUpperCase()) return traduit[0].toUpperCase() + traduit.slice(1);
    return traduit.toLowerCase();
  };

  const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const aTraduire: [Text, string][] = [];
  for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
    const brut = n.nodeValue ?? "";
    const texte = brut.trim();
    if (!texte || texte.length > 60) continue;
    const e = n.parentElement;
    if (!e || e.closest("style,script,noscript,template,input,textarea")) continue;
    const trouve = dict[texte.toLowerCase()];
    if (!trouve) continue;
    aTraduire.push([n as Text, brut.replace(texte, casseDe(texte, trouve))]);
  }
  /* On écrit dans le nœud existant : `textContent = …` détruirait ce que React
     tient, comme on l'a appris sur impact-380. */
  for (const [n, valeur] of aTraduire) n.nodeValue = valeur;

  /*
     Les titres coupés entre deux éléments.

     « Services built for impact. » s'écrit souvent en deux morceaux pour
     colorer la seconde moitié : aucun nœud de texte ne porte la phrase
     entière, et le lexique passe à côté. On regarde donc aussi le texte
     complet des titres, et l'on réécrit le premier nœud en vidant les autres.
  */
  /*
     La clé est écrasée : sans espaces ni ponctuation. Deux éléments collés
     rendent « Services builtfor impact. » — l'espace manque entre les balises,
     et une comparaison littérale passe à côté.
  */
  const ecraser = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const parForme: Record<string, string> = {};
  for (const [k, v] of Object.entries(dict)) parForme[ecraser(k)] = v;

  for (const e of document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,span,a,button")) {
    const entier = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!entier || entier.length > 60) continue;
    const trouve = dict[entier.toLowerCase()] ?? parForme[ecraser(entier)];
    if (!trouve) continue;
    if (e.closest("input,textarea,style,script")) continue;
    const noeuds: Text[] = [];
    const m = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n = m.nextNode(); n; n = m.nextNode()) if ((n.nodeValue ?? "").trim()) noeuds.push(n as Text);
    if (noeuds.length < 2) continue;
    noeuds[0].nodeValue = casseDe(entier, trouve);
    for (let i = 1; i < noeuds.length; i++) noeuds[i].nodeValue = "";
  }
}

function prolongerLeFond() {
  const corps = document.body;
  if (!corps || corps.dataset.fondProlonge) return;

  const peint = (e: Element | null): string | null => {
    if (!e) return null;
    const f = getComputedStyle(e).backgroundColor;
    return f && f !== "transparent" && f !== "rgba(0, 0, 0, 0)" ? f : null;
  };

  /*
    C'est le bas de la page qui compte : la bande apparaît sous le pied de
    page. On prend donc sa couleur — et non celle de l'enveloppe, souvent
    transparente parce que chaque section peint la sienne.
  */
  const pied = document.querySelector("footer");
  let fond = peint(pied);
  if (!fond && pied) {
    for (const e of Array.from(pied.querySelectorAll("*")).slice(0, 40)) {
      fond = peint(e);
      if (fond) break;
    }
  }
  if (!fond) {
    for (const e of Array.from(corps.children)) {
      fond = peint(e);
      if (fond) break;
    }
  }
  if (!fond) return;

  corps.dataset.fondProlonge = "1";
  corps.style.background = fond;
  document.documentElement.style.background = fond;
}

/**
 * Un mot du client coupé en deux lignes.
 *
 * « COUVREU / R À ANNECY » : le titre d'impact-332 casse le mot en plein
 * milieu. Aucun garde ne le voyait, et pour une bonne raison — le texte TIENT
 * dans son cadre. `scrollWidth` n'excède pas `clientWidth`, rien ne sort de
 * l'écran : du point de vue de la mesure, tout va bien. C'est le repli
 * `overflow-wrap: break-word` qui a fait son office, sur un mot plus large que
 * la colonne.
 *
 * On ne peut pas deviner la largeur d'un mot depuis sa longueur : elle dépend
 * de la fonte, de la graisse, de l'interlettrage. On la mesure donc — un
 * `Range` posé sur le mot rend un rectangle par ligne occupée. Deux rectangles
 * à des hauteurs différentes, c'est un mot coupé.
 */
function motCoupeDans(e: HTMLElement): boolean {
  const parcours = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  const plage = document.createRange();
  for (let n = parcours.nextNode(); n; n = parcours.nextNode()) {
    const texte = n.textContent ?? "";
    for (const m of texte.matchAll(/\S+/g)) {
      /* « à », « de », « et » : les couper ne se voit pas, et ils ne le sont jamais. */
      if (m[0].length < 4) continue;
      plage.setStart(n, m.index);
      plage.setEnd(n, m.index + m[0].length);
      const rects = [...plage.getClientRects()].filter((r) => r.width > 0.5);
      if (rects.length < 2) continue;
      if (new Set(rects.map((r) => Math.round(r.top))).size > 1) return true;
    }
  }
  return false;
}

/**
 * Rendre au client ses mots entiers.
 *
 * On rétrécit par paliers jusqu'à ce que plus aucun mot ne soit coupé. Si même
 * la moitié de la taille n'y suffit pas, on rend sa taille d'origine : un titre
 * minuscule ET coupé serait deux défauts au lieu d'un.
 */
function rendreLesMotsEntiers() {
  /*
    Pas seulement les titres : le prix d'impact-321 est un `div` en corps 50,
    et « 180 € le déplacement » s'y coupait en « déplac / ement ». On retient
    donc tout texte assez grand pour que la coupure se voie, et on écarte les
    conteneurs — leurs enfants sont examinés pour eux.
  */
  for (const e of document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, p, div, span, li, td, a, strong, em, blockquote")) {
    if (e.children.length > 0 && !/^H[1-4]$/.test(e.tagName)) continue;
    const style = getComputedStyle(e);
    /* Le petit texte se replie sans qu'on le remarque ; c'est l'affiche qui blesse. */
    if (parseFloat(style.fontSize) < 24) continue;
    if (!motCoupeDans(e)) continue;

    if (!e.dataset.tailleOrigine) e.dataset.tailleOrigine = style.fontSize;
    const depart = parseFloat(e.dataset.tailleOrigine);
    let repare = false;
    for (let taille = depart - 2; taille >= depart * 0.5; taille -= 2) {
      e.style.fontSize = `${taille}px`;
      if (!motCoupeDans(e)) { repare = true; break; }
    }
    if (!repare) e.style.fontSize = "";
  }
}

/** La police rétrécit par paliers jusqu'à ce que le texte tienne, sans jamais descendre sous onze pixels. */
function retrecirJusquAuCadre(e: HTMLElement) {
  const large = document.documentElement.clientWidth;
  /*
    Deux façons de ne pas tenir : le contenu dépasse son cadre, ou le cadre
    lui-même sort de l'écran. Un titre à effet dont chaque mot occupe son propre
    bloc — le GlitchHeadline d'impact-52 — replie son texte sans rien faire
    déborder, et pourtant sort de quatre-vingt-douze pixels.
  */
  const tient = () =>
    e.scrollWidth <= e.clientWidth + 2 && e.getBoundingClientRect().right <= large + 4;

  const depart = parseFloat(getComputedStyle(e).fontSize) || 16;
  for (let taille = depart - 1; taille >= 11; taille -= 1) {
    e.style.fontSize = `${taille}px`;
    if (tient()) return;
  }
  // Même onze pixels ne suffisent pas : mieux vaut deux lignes qu'un nom tronqué.
  e.style.whiteSpace = "normal";
  e.style.overflowWrap = "anywhere";
  e.style.textOverflow = "clip";
}

/**
 * La marque de l'en-tête, sur les pages annexes.
 *
 * Cent cinquante et une sous-pages — la carte, l'atelier, les archives, le
 * contact — chargent la session sans jamais s'en servir : leur en-tête garde
 * « Aether Sound Labs » ou « Atelier NOIR ». Un client qui achète le thème
 * livre donc vingt-deux pages au nom d'une autre entreprise, et il ne les
 * regarde pas toutes avant de publier.
 *
 * On ne touche qu'au lien qui ramène à l'accueil depuis l'en-tête : c'est là
 * que vit la marque, et nulle part ailleurs.
 */
function rendreLaMarque(nom: string | undefined) {
  if (!nom || nom.trim().length < 2) return;
  const propre = nom.trim();
  const racine = /^\/templates\/impact-[\w-]+$/;

  /*
    Une page n'a qu'une marque. Beaucoup de thèmes portent deux en-têtes — l'un
    pour l'ordinateur, l'autre pour le téléphone — et les traiter séparément
    écrivait le nom deux fois de suite.
  */
  let marqueFaite = false;
  for (const entete of document.querySelectorAll("header, nav")) {
    if (marqueFaite) break;
    /*
      Le premier lien vers l'accueil seulement. Les en-têtes de sous-page en
      ont souvent deux — le logo, puis « ← Retour » — et remplacer les deux
      affichait le nom en double.
    */
    let dejaFait = false;
    for (const lien of entete.querySelectorAll<HTMLElement>("a")) {
      if (dejaFait) break;
      const href = lien.getAttribute("href") ?? "";
      if (!racine.test(href)) continue;
      if (lien.dataset.marqueRendue) continue;
      const texte = (lien.textContent ?? "").replace(/\s+/g, " ").trim();
      if (texte.length === 0 || texte.length > 44) continue;
      // Déjà au nom du client : rien à faire, et surtout rien à réécrire.
      if (texte.toLowerCase().includes(propre.toLowerCase())) { dejaFait = true; marqueFaite = true; continue; }
      // Un lien de retour n'est pas une marque, quelle que soit sa destination.
      if (/retour|back|accueil|home|←|<-/i.test(texte)) continue;

      dejaFait = true;
      marqueFaite = true;
      lien.dataset.marqueRendue = "1";
      /*
        Les marques s'écrivent souvent en deux morceaux — « Aether » puis
        « Sound Labs ». Le premier reçoit le nom, les suivants s'effacent :
        garder « Sound Labs » sous « Ateliers Vidal » ne voudrait rien dire.
      */
      const morceaux = [...lien.querySelectorAll<HTMLElement>("span, div, strong, b")]
        .filter((x) => x.children.length === 0 && (x.textContent ?? "").trim().length > 0);
      if (morceaux.length >= 1) {
        if (!ecrireTexte(morceaux[0], propre)) continue;
        for (const autre of morceaux.slice(1)) autre.style.display = "none";
      } else {
        ecrireTexte(lien, propre);
      }

      /*
        La signature du modèle vit souvent hors du lien, juste après :
        « Reach Orbital Group » sous « NOVA », « Grill & Cellar » sous « EMBER ».
        La laisser affiche le nom d'une autre entreprise à côté de celui du
        client.
      */
      const apres = lien.nextElementSibling as HTMLElement | null;
      const texteApres = (apres?.textContent ?? "").replace(/\s+/g, " ").trim();
      if (apres && texteApres.length > 1 && texteApres.length <= 34
          && !/accueil|home|menu|contact|services?|blog|tarifs?|pricing|connexion|login|panier/i.test(texteApres)
          && apres.querySelectorAll("a, button").length === 0) {
        apres.style.display = "none";
      }
    }

  }
}

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const ABREGE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

/** « 08:00 » se lit « 8h », « 18:30 » se lit « 18h30 » — comme les thèmes l'écrivent. */
function heureCourte(h: string): string {
  const m = /^(\d{1,2})[:h.](\d{2})?$/.exec(h.trim());
  if (!m) return h.trim();
  const minutes = m[2] && m[2] !== "00" ? m[2] : "";
  return `${Number(m[1])}h${minutes}`;
}

/**
 * Les horaires du client, à la place de ceux de la démonstration.
 *
 * Cent dix-huit thèmes affichent des jours et des heures ; vingt-sept
 * seulement les tiraient de ce que le client a saisi. Les autres gardaient
 * « Lun–Ven 9h–18h » de leur modèle : un cabinet fermé le lundi affichait
 * qu'il ouvrait, et son téléphone sonnait pour rien.
 *
 * On remplace le texte, jamais la mise en page : une ligne condensée reste une
 * ligne condensée, une ligne par jour garde sa ligne. Sans horaires saisis,
 * rien ne bouge.
 */
/*
  Les jours que le client a écrits.

  Le formulaire demande le jour en texte libre, et personne n'écrit un jour à la
  fois : « Lundi au vendredi », « Lun–Ven », « Du lundi au samedi », « Lundi,
  mardi, jeudi ». Ce passage n'acceptait qu'un nom de jour seul et rendait la
  main sans rien écrire — les horaires du client n'arrivaient donc jamais à
  l'écran, et le thème gardait ceux de sa démonstration. Mesuré sur impact-32 :
  le cabinet ouvre « Lundi — vendredi 8h–19h », la page affichait « Lun–Sam
  8h–20h », l'horaire de l'exemple.

  On lit donc une plage, une énumération, ou un jour seul. Un intervalle qui
  repart en arrière — « vendredi au lundi » — fait le tour de la semaine, comme
  l'écrit un commerce ouvert le week-end.
*/
function indexDuJour(mot: string): number {
  const propre = mot.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const plein = JOURS.indexOf(propre);
  if (plein >= 0) return plein;
  return ABREGE.findIndex((a) => propre === a || propre === `${a}.`);
}

function joursDe(brut: string | undefined): number[] {
  const texte = String(brut ?? "").trim();
  if (!texte) return [];

  const mots = texte.toLowerCase().split(/[^a-zà-ÿ.]+/).filter(Boolean);
  const separateurRange = /\b(?:au|a|à|to|jusqu.au)\b|[-–—\/]/.test(texte);

  const index = mots.map(indexDuJour).filter((i) => i >= 0);
  if (index.length === 0) return [];
  if (index.length === 1) return index;

  if (separateurRange && index.length === 2) {
    const [debut, fin] = index;
    const out: number[] = [];
    for (let i = debut; ; i = (i + 1) % 7) {
      out.push(i);
      if (i === fin || out.length > 7) break;
    }
    return out;
  }
  /* Une énumération : « lundi, mardi, jeudi ». */
  return [...new Set(index)];
}

function rendreLesHoraires(horaires: Array<{ day?: string; open?: string; close?: string; closed?: boolean }> | undefined) {
  if (!Array.isArray(horaires) || horaires.length === 0) return;

  const parJour = new Map<number, string>();
  for (const h of horaires) {
    const jours = joursDe(h?.day);
    if (jours.length === 0) continue;
    const ferme = h?.closed || (!h?.open && !h?.close);
    const valeur = ferme ? "Fermé" : `${heureCourte(h.open ?? "")}–${heureCourte(h.close ?? "")}`;
    for (const i of jours) parJour.set(i, valeur);
  }
  if (parJour.size === 0) return;

  /*
    La forme condensée regroupe les jours consécutifs de même horaire, comme
    l'écrivent les thèmes : « Lun–Ven 8h–18h30 · Sam 9h–12h ».
  */
  const tranches: string[] = [];
  let debut = -1;
  for (let i = 0; i <= 7; i++) {
    const ici = parJour.get(i);
    const avant = debut >= 0 ? parJour.get(debut) : undefined;
    if (ici && ici === avant) continue;
    if (debut >= 0 && avant && avant !== "Fermé") {
      const jours = debut === i - 1 ? capitale(ABREGE[debut]) : `${capitale(ABREGE[debut])}–${capitale(ABREGE[i - 1])}`;
      tranches.push(`${jours} ${avant}`);
    }
    debut = ici ? i : -1;
  }
  const condense = tranches.join(" · ");
  if (!condense) return;

  /*
    Beaucoup de tableaux séparent les deux : « Lundi — Vendredi » dans une
    colonne, « 7h00 — 19h00 » dans la suivante. Aucun des deux éléments ne porte
    à lui seul un horaire ; pris isolément, ils passaient au travers.
  */
  for (const e of document.querySelectorAll<HTMLElement>("p, span, div, li, td, dd, time, a")) {
    if (e.children.length > 0 || e.dataset.horairesRendus) continue;
    const t = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (t.length < 3 || t.length > 40) continue;
    if (/\d{1,2}\s?[h:]/.test(t)) continue;
    const jours = JOURS.filter((j) => t.toLowerCase().includes(j));
    const abreges = ABREGE.filter((j) => new RegExp(`\\b${j}\\b`, "i").test(t));
    if (jours.length === 0 && abreges.length === 0) continue;

    const voisin = e.nextElementSibling as HTMLElement | null;
    const texteVoisin = (voisin?.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!voisin || voisin.children.length > 0 || !/^\D{0,4}\d{1,2}\s?[h:]/.test(texteVoisin)) continue;

    e.dataset.horairesRendus = "1";
    voisin.dataset.horairesRendus = "1";
    const un = jours.length + abreges.length === 1;
    if (un) {
      const nom = jours[0] ?? abreges[0];
      const i = JOURS.indexOf(nom) >= 0 ? JOURS.indexOf(nom) : ABREGE.indexOf(nom);
      const valeur = parJour.get(i);
      if (valeur) ecrireTexte(voisin, valeur);
    } else {
      /*
        On garde le libellé de jours du thème pour ne pas défaire sa colonne,
        et l'on ne remplace que les heures : la première tranche du client,
        celle qui couvre la semaine.
      */
      const heures = tranches[0]?.replace(/^\S+\s/, "");
      if (heures) ecrireTexte(voisin, heures);
    }
  }

  for (const e of document.querySelectorAll<HTMLElement>("p, span, div, li, td, dd, time, a")) {
    /*
      Un bloc d'horaires tient souvent en un seul élément coupé par des <br> :
      « Lun – Ven : 6h – 22h<br />Samedi : 8h – 18h ». Ces <br> comptent comme
      enfants, et le bloc passait à travers — c'était le cas d'impact-87.
    */
    const queDesRetours = [...e.children].every((x) => x.tagName === "BR");
    if (e.children.length > 0 && !queDesRetours) continue;
    if (e.dataset.horairesRendus) continue;
    const t = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (t.length < 5) continue;

    /*
      Plusieurs lignes dans un seul élément : on remplace ligne à ligne, en
      gardant les retours, plutôt que d'aplatir le bloc en une phrase.
    */
    if (queDesRetours && e.children.length > 0) {
      /*
        Les <br> découpent déjà le bloc en nœuds texte : un par ligne. On les
        modifie un à un, sans jamais réécrire l'intérieur de l'élément —
        remplacer innerHTML détruisait les nœuds que React suivait, et la page
        entière disparaissait au premier re-rendu.
      */
      let change = false;
      for (const noeud of [...e.childNodes]) {
        if (noeud.nodeType !== Node.TEXT_NODE) continue;
        const nu = (noeud.nodeValue ?? "").replace(/\s+/g, " ").trim();
        if (!nu || !/\d{1,2}\s?[h:]/.test(nu)) continue;
        const noms = JOURS.filter((j) => nu.toLowerCase().includes(j));
        const abr = ABREGE.filter((j) => new RegExp(`\\b${j}\\b`, "i").test(nu));
        if (noms.length === 0 && abr.length === 0) continue;
        if (noms.length + abr.length === 1) {
          const nom = noms[0] ?? abr[0];
          const i = JOURS.indexOf(nom) >= 0 ? JOURS.indexOf(nom) : ABREGE.indexOf(nom);
          const valeur = parJour.get(i);
          if (!valeur) continue;
          noeud.nodeValue = `${capitale(noms.length ? JOURS[i] : ABREGE[i])} : ${valeur}`;
        } else {
          if (!tranches[0]) continue;
          noeud.nodeValue = tranches[0];
        }
        change = true;
      }
      if (change) e.dataset.horairesRendus = "1";
      continue;
    }

    /*
      Dans une phrase, on ne remplace que le fragment horaire : « Notre équipe
      est disponible du lundi au samedi, de 9h à 18h, pour toute commande » doit
      garder sa phrase et changer ses heures, pas disparaître.
    */
    if (t.length > 90) {
      // La virgule sépare souvent les jours des heures — « du lundi au samedi,
      // de 9h à 18h » — et l'exclure faisait manquer la forme la plus courante.
      const fragment = /\b(du\s+)?(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+(au|à|-|–)\s*(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)?[^.;]{0,30}?\d{1,2}\s?h\s?\d{0,2}[^.;]{0,16}?\d{1,2}\s?h\s?\d{0,2}/i;
      if (fragment.test(t)) {
        e.dataset.horairesRendus = "1";
        ecrireTexte(e, t.replace(fragment, condense));
      }
      continue;
    }

    const bas = t.toLowerCase();
    const nomsPresents = JOURS.filter((j) => bas.includes(j));
    const abregesPresents = ABREGE.filter((j) => new RegExp(`\\b${j}`).test(bas));
    const aDesHeures = /\d{1,2}\s?[h:]\s?\d{0,2}/.test(t);
    if (!aDesHeures) continue;
    /*
      Sans nom de jour, ce n'est pas un horaire : « 24h/24 », « en 30 min »,
      « depuis 1998 » portent des chiffres et n'ont rien à voir.
    */
    const jours = nomsPresents.length ? nomsPresents : abregesPresents.length ? abregesPresents : [];
    if (jours.length === 0) continue;

    e.dataset.horairesRendus = "1";
    if (jours.length === 1) {
      // Une ligne pour un seul jour : on ne remplace que ses heures.
      const i = JOURS.indexOf(jours[0]) >= 0 ? JOURS.indexOf(jours[0]) : ABREGE.indexOf(jours[0]);
      const valeur = parJour.get(i);
      if (valeur) ecrireTexte(e, `${capitale(nomsPresents.length ? JOURS[i] : ABREGE[i])} ${valeur}`);
    } else {
      ecrireTexte(e, condense);
    }
  }
}

function capitale(x: string): string {
  return x ? `${x[0].toUpperCase()}${x.slice(1)}` : x;
}

/**
 * Sur un site livré, aucun texte ne sort de l'écran.
 *
 * Les passes précédentes ne s'occupent que de ce que le client a écrit. Restait
 * le texte des thèmes : un sous-titre calibré pour une mise en page avec photo,
 * qui déborde de quarante-deux pixels dès que le client n'en fournit aucune ;
 * un bandeau de spécifications trop long pour un téléphone. Quatorze thèmes
 * mesurés, dont douze débordaient déjà dans la démonstration.
 *
 * La démonstration du catalogue garde son dessin — cette passe ne tourne que
 * lorsqu'une session existe, c'est-à-dire sur le site de quelqu'un. Et elle
 * laisse tranquilles les bandeaux qui défilent : leur texte est plus large que
 * leur cadre par construction.
 */
function bornerLesTextesDuTheme() {
  const large = document.documentElement.clientWidth;

  for (const e of document.querySelectorAll<HTMLElement>("p, span, div, li, h1, h2, h3, h4, a, td, dd, button")) {
    if (e.children.length > 0 || e.dataset.borne) continue;
    const t = (e.textContent ?? "").trim();
    if (t.length < 3) continue;
    const s = getComputedStyle(e);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    if (r.right <= large + 4 && e.scrollWidth <= e.clientWidth + 4) continue;
    if (dansUnElementQuiBouge(e)) continue;

    e.dataset.borne = "1";
    e.style.overflowWrap = "anywhere";
    e.style.maxWidth = "calc(100vw - 1.5rem)";

    const tient = () =>
      e.getBoundingClientRect().right <= large + 4 && e.scrollWidth <= e.clientWidth + 4;

    /*
      Un `nowrap` posé par le thème est une intention, pas un oubli : le prix
      d'impact-341 tient sur une ligne parce qu'un montant se lit d'un coup.
      L'annuler d'emblée donnait « à partir / de 9 400 / € » sur trois lignes,
      le symbole seul en bas — trois lignes que J'AVAIS créées.

      On rétrécit donc d'abord, et on ne permet le repli que si même la plus
      petite taille ne suffit pas.
    */
    if (s.whiteSpace.startsWith("nowrap")) {
      if (!tient()) retrecirJusquAuCadre(e);
      if (!tient()) { e.style.whiteSpace = "normal"; e.style.fontSize = ""; }
    }
    if (!tient()) retrecirJusquAuCadre(e);
  }
}

/*
  Le libellé qui fait d'un bouton un bouton de réservation. « Contact »,
  « devis » et « appeler » en sont exclus à dessein : ils mènent au formulaire
  ou au téléphone, et les détourner vers l'agenda serait une erreur.
*/
const LIBELLE_RESERVATION =
  /(prendre\s+(un\s+)?(rendez-?vous|rdv)|prenez\s+rendez-?vous|réserv(er|ez|ation en ligne)|reserver|book\s+(a|an|now|online)|schedule\s+(a|an)|jetzt\s+buchen|reservar)/i;

/**
 * Le lien de réservation du client, sous les boutons qui le promettent.
 *
 * Cent cinquante et un thèmes affichent « Prendre rendez-vous » ; cinq
 * seulement menaient à l'agenda que le client avait saisi. Les autres
 * renvoyaient vers une ancre interne — le champ était demandé pour rien.
 *
 * On corrige en un point plutôt que dans cent cinquante fichiers : la
 * destination change, le bouton garde son dessin, et sans lien saisi rien ne
 * bouge.
 */
function relierLesBoutonsDeReservation(url: string | undefined) {
  if (!url) return;
  const cible = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  for (const e of document.querySelectorAll<HTMLElement>("a, button, [role='button']")) {
    if (e.dataset.reservationReliee) continue;
    const texte = (e.textContent ?? "").replace(/\s+/g, " ").trim();
    if (texte.length > 40 || !LIBELLE_RESERVATION.test(texte)) continue;

    /*
      Un lien déjà sorti du site — téléphone, courriel, ou l'agenda lui-même —
      n'a pas à être détourné.
    */
    const href = e.getAttribute("href") ?? "";
    if (/^(mailto:|tel:)/i.test(href)) continue;
    if (href && !href.startsWith("#") && !href.startsWith("/")) continue;

    e.dataset.reservationReliee = "1";
    if (e.tagName === "A") {
      e.setAttribute("href", cible);
      e.setAttribute("target", "_blank");
      e.setAttribute("rel", "noopener noreferrer");
    } else {
      /*
        Un bouton garde son action propre — ouvrir une fiche, choisir un
        créneau. On n'ajoute la nôtre que s'il ne fait que défiler vers une
        ancre, ce qu'on ne peut pas savoir de l'extérieur ; on ouvre donc
        l'agenda en plus, sans empêcher la sienne.
      */
      e.addEventListener("click", () => window.open(cible, "_blank", "noopener,noreferrer"));
      e.style.cursor = "pointer";
    }
  }
}

/*
  Le menu du téléphone, atteignable au doigt.

  Cent quatre thèmes ouvrent leur navigation par un bouton portant « ☰ », posé
  avec `padding: 0` : mesuré à 20 × 22 px sur impact-10, quand un doigt en vise
  quarante. C'est la commande de navigation principale sur téléphone — la
  manquer, c'est ne plus pouvoir circuler dans le site.

  On agrandit la zone touchable par du rembourrage, et on annule le
  déplacement par une marge négative de même valeur. Le bouton n'a ni fond ni
  bordure : rien ne se voit, le glyphe garde sa taille et sa position. Le
  dessin du thème n'est pas touché.

  Neutre par construction : ne s'applique qu'aux commandes sans texte visible
  (un glyphe, une icône) déjà plus petites que la cible. Un bouton libellé
  « Réserver » ou déjà confortable n'est jamais modifié.
*/
/*
  La zone cliquable s'étend par un pseudo-élément, pas par du rembourrage.

  Première version : padding pour agrandir, marge négative pour compenser. Ça
  ne compense pas partout — sur un bouton à largeur fixe en `box-sizing:
  border-box`, le rembourrage rogne le contenu au lieu d'agrandir la boîte, et
  les trois barres du burger d'impact-41 se décalaient de quatre pixels.

  Un `::after` en position absolue déborde de son parent sans rien pousser :
  aucune boîte ne change de taille, aucun voisin ne bouge. L'inset vient d'une
  propriété personnalisée posée sur l'élément, qui n'a elle-même aucun effet
  de mise en page.
*/
function poserLaFeuilleTactile() {
  if (document.getElementById("cible-tactile-style")) return;
  const s = document.createElement("style");
  s.id = "cible-tactile-style";
  s.textContent = `
[data-cible-agrandie]::after {
  content: "";
  position: absolute;
  top: calc(-1 * var(--cible-y, 0px));
  bottom: calc(-1 * var(--cible-y, 0px));
  left: calc(-1 * var(--cible-x, 0px));
  right: calc(-1 * var(--cible-x, 0px));
}`;
  document.head.appendChild(s);
}

function agrandirLesCommandesTactiles() {
  const CIBLE = 40;
  poserLaFeuilleTactile();
  for (const e of document.querySelectorAll<HTMLElement>("button, a, [role=button]")) {
    if (e.dataset.cibleAgrandie) continue;
    const s = getComputedStyle(e);
    if (s.display === "none" || s.visibility === "hidden" || s.pointerEvents === "none") continue;
    /*
      Un lien au fil d'une phrase garde sa hauteur : l'agrandir décalerait la
      ligne autour de lui, et WCAG 2.5.8 l'exempte précisément pour ça. Seuls
      les liens posés en bloc — une colonne de pied de page, une liste de
      navigation — sont des cibles que le doigt vise isolément.
    */
    if (e.tagName === "A" && s.display === "inline") continue;
    if (/\bsr-only\b|lien-evitement|skip-link/.test(String(e.className ?? ""))) continue;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const texte = (e.textContent ?? "").trim();

    /*
      Le pseudo-élément a besoin d'un ancrage : sans position non statique sur
      le parent, il se placerait par rapport à un ancêtre lointain. `relative`
      ne déplace rien tant qu'aucun décalage n'est posé.
    */
    if (getComputedStyle(e).position === "static") e.style.position = "relative";

    if (texte.length <= 2) {
      // Un glyphe ou une icône : trop petit dans les deux sens, on agrandit les deux.
      if (Math.min(r.width, r.height) >= 32) continue;
      const marge = Math.ceil((CIBLE - Math.min(r.width, r.height)) / 2);
      e.style.setProperty("--cible-x", `${marge}px`);
      e.style.setProperty("--cible-y", `${marge}px`);
      e.dataset.cibleAgrandie = "1";
      continue;
    }

    /*
      Un lien libellé manque d'une dimension ou de l'autre, jamais des deux :
      « Mentions légales » en pied de page fait soixante pixels de large et
      quatorze de haut ; un menu en texte vertical fait neuf de large et cent
      quatre-vingts de haut. On n'agrandit que l'axe déficient — une première
      version ne traitait que la hauteur et laissait les menus verticaux
      intacts sur vingt pages.

      Et jamais au-delà de la moitié de l'espace qui sépare la cible de sa
      voisine : deux cibles qui se recouvrent sont pires qu'une cible étroite.
    */
    const ecart = (axe: "x" | "y") => {
      let mini = Infinity;
      for (const a of document.querySelectorAll<HTMLElement>("a, button, [role=button]")) {
        if (a === e) continue;
        const q = a.getBoundingClientRect();
        if (q.width === 0 || q.height === 0) continue;
        if (axe === "x") {
          if (q.bottom < r.top || q.top > r.bottom) continue; // pas sur la même ligne
          mini = Math.min(mini, q.left >= r.right ? q.left - r.right : r.left >= q.right ? r.left - q.right : 0);
        } else {
          if (q.right < r.left || q.left > r.right) continue; // pas dans la même colonne
          mini = Math.min(mini, q.top >= r.bottom ? q.top - r.bottom : r.top >= q.bottom ? r.top - q.bottom : 0);
        }
      }
      return mini;
    };

    const poser = (axe: "x" | "y", taille: number) => {
      if (taille >= 24) return false;
      const place = ecart(axe);
      const marge = Math.max(0, Math.min(Math.ceil((24 - taille) / 2) + 4,
        place === Infinity ? 12 : Math.floor(place / 2) - 1));
      if (marge <= 0) return false;
      e.style.setProperty(axe === "x" ? "--cible-x" : "--cible-y", `${marge}px`);
      return true;
    };

    const fait = [poser("y", r.height), poser("x", r.width)].some(Boolean);
    if (fait) e.dataset.cibleAgrandie = "1";
  }
}

export function BrandColorVar() {
  useEffect(() => {
    /*
      Cette passe-ci ne dépend pas du client : c'est une dette du thème, elle
      doit s'appliquer même sur un site sans session — la galerie, un aperçu
      partagé sans paramètre.
    */
    const tactile = () => { try { agrandirLesCommandesTactiles(); } catch {} };
    requestAnimationFrame(() => requestAnimationFrame(tactile));
    for (const delai of [600, 1800, 3500]) setTimeout(tactile, delai);
    /*
      Une commande peut n'apparaître qu'au défilement — un pied de page monté
      tard, un panneau révélé à l'approche. Aux seules passes minutées, le
      résultat variait d'une mesure à l'autre : présente une fois, absente la
      suivante. On repasse donc à chaque défilement, au plus une fois par
      cadre.
    */
    let enAttente = false;
    const auDefilement = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => { enAttente = false; tactile(); });
    };
    window.addEventListener("scroll", auDefilement, { passive: true });

    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        const c: string | undefined = d?.formData?.brandColor;
        if (c && /^#?[0-9a-f]{6}$/i.test(c.trim())) {
          const root = document.documentElement.style;
          root.setProperty("--brand", c);
          root.setProperty("--brand-light", lighten(c));
        }
        /*
          Chaque thème va chercher la session de son côté : le texte du client
          apparaît donc après notre première passe, et parfois bien après — le
          temps d'une animation d'entrée. On repasse à quelques reprises, sur
          moins de trois secondes, plutôt que d'observer tout le document.
        */
        const passer = () => {
          rendreLesBoutonsLisibles();
          detacherLesTextesDuClient(d?.formData, d?.businessProfile);
          relierLesBoutonsDeReservation(d?.businessProfile?.bookingSystem?.url);
          rendreLesNomsEntiers(d?.formData?.businessName);
          rendreLesHoraires(d?.businessProfile?.openingHours);
          rendreLaMarque(d?.formData?.businessName);
          bornerLesTextesDuTheme();
          rendreLesMotsEntiers();
          rendreLeCopyright(d?.formData?.businessName);
          poserLeContact(d?.formData);
          effacerLaMarqueDeDemonstration(d?.formData?.businessName);
          effacerLaQueueDeLaMarque(d?.formData?.businessName);
          /*
            Sans session — la galerie publique des thèmes — la page se lit en
            français : c'est la langue de la boutique. Un visiteur qui choisit
            son thème voyait « EXPEDITIONS · GEAR » là où l'aperçu, lui, était
            déjà traduit. La langue du navigateur décide entre nos cinq langues,
            le français en repli.
          */
          const langue = d?.formData?.locale
            ?? (["fr", "es", "de", "pt", "en"].find((l) => navigator.language?.startsWith(l)) ?? "fr");
          traduireLesLibelles(langue);
          traduireLaProse(langue, traductionsDuTheme?.[langue]);
          chiffresDeLaLangue(langue);
          prolongerLeFond();
        };
        /* Le dictionnaire du thème arrive de façon asynchrone : on repasse dès
           qu'il est là. Posé APRÈS la définition de `passer` — le référencer
           plus haut le mettrait dans sa zone morte. */
        const theme = window.location.pathname.match(/\/templates\/(impact-[\w-]+)/)?.[1];
        if (theme) void chargerLesTraductions(theme).then(() => passer());

        requestAnimationFrame(() => requestAnimationFrame(passer));
        /*
          Une dernière passe tardive : sur une connexion lente, ou sur un thème
          dont l'animation d'entrée dure, la session arrive après la troisième.
          Mesuré sur impact-146, où le sous-titre restait débordant jusqu'à
          trois secondes et demie.
        */
        for (const delai of [400, 1200, 2500, 4000]) setTimeout(passer, delai);

        /*
          Un carrousel change de mot toutes les trois secondes : la prestation
          du client y apparaît longtemps après la dernière passe, et n'était
          jamais ajustée — « Détartrage Vidal » restait tronqué de quarante et
          un pixels sur impact-341.

          On observe donc les changements de texte, groupés par tiers de
          seconde, et l'on repasse. Vingt fois au plus : au-delà, la page a fini
          de vivre et l'observateur se retire — nos propres écritures le
          réveilleraient sans fin.
        */
        let repasses = 0;
        let attente: ReturnType<typeof setTimeout> | undefined;
        const veille = new MutationObserver((mutations) => {
          /*
            L'élément qui vient de changer est ajusté tout de suite, sans
            attendre le regroupement : un carrousel affiche son mot pendant
            trois secondes, et cent vingt millisecondes de texte tronqué se
            voient. Le regroupement, lui, sert au reste de la page.
          */
          for (const m of mutations) {
            const cible = m.target.nodeType === Node.TEXT_NODE
              ? (m.target as Node).parentElement
              : (m.target as HTMLElement);
            if (!(cible instanceof HTMLElement)) continue;
            /*
              Un carrousel ne remplace pas un mot : il remplace tout un
              sous-arbre. Ne regarder que l'élément muté laissait le mot du
              client tronqué, puisque c'est son conteneur qui change.
            */
            /*
              Au prochain rendu, jamais tout de suite : un élément qui vient
              d'être inséré n'a pas encore de mise en page, sa largeur vaut
              zéro, et rien ne paraît déborder.
            */
            requestAnimationFrame(() => {
              if (cible.children.length === 0) { ajusterAuCadre(cible); return; }
              for (const f of cible.querySelectorAll<HTMLElement>("*")) {
                if (f.children.length === 0 && (f.textContent ?? "").trim().length >= 3) ajusterAuCadre(f);
              }
            });
          }
          /*
            Un carrousel tourne tant que la page est ouverte : vingt repasses
            couvraient une minute, après quoi le mot suivant restait tronqué.
            Deux cents en couvrent dix, et la passe ne coûte rien quand rien ne
            déborde — elle mesure, constate, et s'arrête.
          */
          if (repasses >= 200) { veille.disconnect(); return; }
          clearTimeout(attente);
          attente = setTimeout(() => { repasses++; passer(); }, 120);
        });
        veille.observe(document.body, { childList: true, subtree: true, characterData: true });
      })
      .catch(() => {});
  }, []);
  return null;
}
