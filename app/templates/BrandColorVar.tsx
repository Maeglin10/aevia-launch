"use client";

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

  for (const entete of document.querySelectorAll("header, nav")) {
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
      if (texte.toLowerCase().includes(propre.toLowerCase())) { dejaFait = true; continue; }
      // Un lien de retour n'est pas une marque, quelle que soit sa destination.
      if (/retour|back|accueil|home|←|<-/i.test(texte)) continue;

      dejaFait = true;
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
function rendreLesHoraires(horaires: Array<{ day?: string; open?: string; close?: string; closed?: boolean }> | undefined) {
  if (!Array.isArray(horaires) || horaires.length === 0) return;

  const parJour = new Map<number, string>();
  for (const h of horaires) {
    const i = JOURS.indexOf(String(h?.day ?? "").trim().toLowerCase());
    if (i < 0) continue;
    const ferme = h?.closed || (!h?.open && !h?.close);
    parJour.set(i, ferme ? "Fermé" : `${heureCourte(h.open ?? "")}–${heureCourte(h.close ?? "")}`);
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

  const defileOuAnime = (e: Element): boolean => {
    let n: Element | null = e;
    for (let i = 0; i < 6 && n; i++) {
      const s = getComputedStyle(n);
      if (["auto", "scroll"].includes(s.overflowX) || ["auto", "scroll"].includes(s.overflow)) return true;
      if (s.animationName !== "none" || /matrix|translate/.test(s.transform)) return true;
      n = n.parentElement;
    }
    return false;
  };

  for (const e of document.querySelectorAll<HTMLElement>("p, span, div, li, h1, h2, h3, h4, a, td, dd, button")) {
    if (e.children.length > 0 || e.dataset.borne) continue;
    const t = (e.textContent ?? "").trim();
    if (t.length < 3) continue;
    const s = getComputedStyle(e);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.15) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    if (r.right <= large + 4 && e.scrollWidth <= e.clientWidth + 4) continue;
    if (defileOuAnime(e)) continue;

    e.dataset.borne = "1";
    e.style.overflowWrap = "anywhere";
    e.style.maxWidth = "calc(100vw - 1.5rem)";
    if (s.whiteSpace.startsWith("nowrap")) e.style.whiteSpace = "normal";
    if (e.getBoundingClientRect().right > large + 4 || e.scrollWidth > e.clientWidth + 4) retrecirJusquAuCadre(e);
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

export function BrandColorVar() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
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
        };
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
