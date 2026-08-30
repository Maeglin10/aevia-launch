"use client";

import { useEffect } from "react";

/**
 * Le texte alternatif des images, posé une fois pour tout le catalogue.
 *
 * Ce qui a été compté avant d'écrire ce fichier : 698 balises `<img>` sur
 * 1 034 n'ont aucun attribut `alt`, réparties sur 245 des 373 thèmes. Le
 * composant `SiteImages` remplace bien les photos par celles du client, mais
 * n'a jamais rien écrit dans `alt` — donc même une photo correctement
 * substituée reste muette. Pour un lecteur d'écran l'image n'existe pas ; pour
 * un moteur de recherche c'est une image sans légende sur le site d'un client
 * qui nous paie pour être trouvé.
 *
 * Pourquoi ici et pas dans chaque thème : les mêmes raisons que la barre
 * d'appel et que le reflow des grilles — 245 fichiers contre un seul, et une
 * règle unique qu'on peut corriger d'un endroit. Le principe est celui de
 * `BarreActionMobile` : ne rien supposer du thème, tout lire dans la page
 * rendue.
 *
 * L'ordre de préférence, du plus précis au plus général :
 *
 *   1. la légende de la figure qui porte l'image ;
 *   2. le `title` ou l'`aria-label` déjà présent sur la balise ;
 *   3. le texte alternatif du lien qui l'entoure, quand l'image est un logo
 *      cliquable ;
 *   4. le titre de la section où elle vit, complété du nom de l'entreprise ;
 *   5. à défaut de tout cela : `alt=""` et `role="presentation"`. Ce n'est pas
 *      un aveu d'échec — une image purement décorative DOIT porter un alt vide,
 *      sans quoi le lecteur d'écran lit l'URL du fichier à voix haute.
 *
 * Jamais le nom du fichier : « photo-1519681393784.jpg » n'est pas une
 * description, et le poser en `alt` serait pire que rien.
 */

/** Le nom de l'entreprise tel que la page l'affiche, pas tel qu'on l'imagine. */
function nomEntreprise(): string {
  const candidats = [
    document.querySelector("h1"),
    document.querySelector("header a[href='/'] , header a[href^='/templates']"),
    document.querySelector("footer strong, footer b"),
  ];
  for (const el of candidats) {
    const t = (el?.textContent ?? "").trim().replace(/\s+/g, " ");
    if (t.length > 1 && t.length < 60) return t;
  }
  return "";
}

/** Le titre de section le plus proche, en remontant puis en cherchant au-dessus. */
function titreDeSection(img: HTMLImageElement): string {
  const bloc = img.closest("section, article, aside, header, footer, main") ?? document.body;
  const titre = bloc.querySelector("h1, h2, h3, h4");
  const t = (titre?.textContent ?? "").trim().replace(/\s+/g, " ");
  return t.length > 1 && t.length < 120 ? t : "";
}

function texteDuLien(img: HTMLImageElement): string {
  const lien = img.closest("a");
  if (!lien) return "";
  const t = (lien.textContent ?? "").trim().replace(/\s+/g, " ");
  if (t.length > 1 && t.length < 80) return t;
  const aria = lien.getAttribute("aria-label")?.trim();
  return aria && aria.length < 80 ? aria : "";
}

function legende(img: HTMLImageElement): string {
  const fig = img.closest("figure");
  const cap = fig?.querySelector("figcaption");
  const t = (cap?.textContent ?? "").trim().replace(/\s+/g, " ");
  return t.length > 1 && t.length < 160 ? t : "";
}

/**
 * Une image est-elle décorative ?
 *
 * Mesuré sur le catalogue : les petites images posées en fond de bloc, les
 * séparateurs et les textures n'apportent rien à la compréhension. Les
 * décrire encombre la lecture au lecteur d'écran au lieu de l'aider.
 */
function decorative(img: HTMLImageElement): boolean {
  const r = img.getBoundingClientRect();
  if (r.width > 0 && r.width < 48 && r.height < 48) return true;
  const src = (img.getAttribute("src") ?? "").toLowerCase();
  return /texture|pattern|separator|divider|shape|blob|noise|grain/.test(src);
}

function poserAlt(img: HTMLImageElement, nom: string) {
  // Une balise qui porte déjà un alt — même vide — a fait son choix : on n'y
  // touche pas. `hasAttribute` et non `img.alt`, qui vaut "" dans les deux cas.
  if (img.hasAttribute("alt")) return;

  if (decorative(img)) {
    img.setAttribute("alt", "");
    img.setAttribute("role", "presentation");
    return;
  }

  const propre =
    legende(img) ||
    img.getAttribute("title")?.trim() ||
    img.getAttribute("aria-label")?.trim() ||
    texteDuLien(img) ||
    "";

  if (propre) {
    img.setAttribute("alt", propre);
    return;
  }

  const section = titreDeSection(img);
  if (section && nom && !section.toLowerCase().includes(nom.toLowerCase())) {
    img.setAttribute("alt", `${section} — ${nom}`);
    return;
  }
  if (section) {
    img.setAttribute("alt", section);
    return;
  }
  if (nom) {
    img.setAttribute("alt", nom);
    return;
  }

  // Rien de fiable à dire : l'alt vide est la bonne réponse, pas l'URL.
  img.setAttribute("alt", "");
  img.setAttribute("role", "presentation");
}

export function TexteAlternatif() {
  useEffect(() => {
    const passer = () => {
      const nom = nomEntreprise();
      document
        .querySelectorAll<HTMLImageElement>("img:not([alt])")
        .forEach((img) => poserAlt(img, nom));

      /*
        Tant qu'on parcourt les images : deux attributs qui coûtent zéro et que
        les thèmes anciens n'ont pas. `loading="lazy"` sort les photos du bas de
        page du chemin critique (le LCP est la mesure que Google regarde), et
        `decoding="async"` évite de bloquer la peinture. Jamais sur la première
        image : la différer dégraderait précisément le LCP qu'on cherche à tenir.
      */
      const images = [...document.querySelectorAll<HTMLImageElement>("img")];
      images.forEach((img, i) => {
        if (i === 0) return;
        if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
        if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
      });
    };

    passer();

    /*
      Les thèmes vont chercher leur session après le montage et `SiteImages`
      substitue les photos ensuite : une passe unique manquerait tout ce qui
      arrive après. On observe donc les ajouts, en regroupant les rafales par
      image d'animation pour ne pas repasser à chaque nœud inséré.
    */
    let enAttente = false;
    const observateur = new MutationObserver(() => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        passer();
      });
    });
    observateur.observe(document.body, { childList: true, subtree: true });

    // Filet de sécurité pour les thèmes qui ne rendent leur pied de page
    // qu'après plusieurs secondes — même constat que pour la barre d'appel.
    const minuteries = [1400, 4000].map((d) => setTimeout(passer, d));

    return () => {
      observateur.disconnect();
      minuteries.forEach(clearTimeout);
    };
  }, []);

  return null;
}
