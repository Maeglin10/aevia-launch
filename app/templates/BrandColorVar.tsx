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
function detacherLesTextesDuClient(donnees: Record<string, unknown> | undefined) {
  if (!donnees) return;
  const valeurs = ["tagline", "businessName", "city", "phone", "address", "businessType"]
    .map((k) => (typeof donnees[k] === "string" ? (donnees[k] as string).trim() : ""))
    .filter((v) => v.length >= 4);
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
    if (!valeurs.some((v) => tb.includes(v.toLowerCase()))) continue;
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

    /*
      Sur téléphone, un nom long — « ATELIERS VIDAL & FILS » là où le thème
      écrivait un mot — sort de l'écran par la droite : soixante pixels perdus,
      mesurés sur impact-57. On n'autorise la césure que là où ça dépasse
      vraiment ; ailleurs, rien ne change.
    */
    const r = e.getBoundingClientRect();
    if (r.right > document.documentElement.clientWidth + 4) {
      e.style.overflowWrap = "anywhere";
      e.style.maxWidth = "100%";
      // Une ligne tenue sur un seul rang ne peut pas se replier : il faut le lui permettre.
      if (getComputedStyle(e).whiteSpace.startsWith("nowrap")) e.style.whiteSpace = "normal";
    }

    if (!ombreDejaLa) {
      e.style.textShadow = lum > 0.45
        ? "0 1px 3px rgba(0,0,0,0.55)"
        : "0 1px 3px rgba(255,255,255,0.65)";
    }
  }
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
    const depart = parseFloat(getComputedStyle(e).fontSize) || 16;
    for (let taille = depart - 1; taille >= 11; taille -= 1) {
      e.style.fontSize = `${taille}px`;
      if (e.scrollWidth <= e.clientWidth + 2) break;
    }
    if (e.scrollWidth > e.clientWidth + 2) {
      e.style.whiteSpace = "normal";
      e.style.overflowWrap = "anywhere";
      e.style.textOverflow = "clip";
    }
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
          detacherLesTextesDuClient(d?.formData);
          relierLesBoutonsDeReservation(d?.businessProfile?.bookingSystem?.url);
          rendreLesNomsEntiers(d?.formData?.businessName);
        };
        requestAnimationFrame(() => requestAnimationFrame(passer));
        for (const delai of [400, 1200, 2500]) setTimeout(passer, delai);
      })
      .catch(() => {});
  }, []);
  return null;
}
