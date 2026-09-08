"use client";

/*
  Les métadonnées du site livré appartiennent au CLIENT, pas à Aevia.

  Mesuré en production : une page de thème servie sur le domaine d'un client
  portait encore le titre, la description, l'OpenGraph et surtout le
  <link rel="canonical"> d'Aevia Launch. Autrement dit, le site du client
  déclarait à Google être un duplicata de launch.aevia.services — il ne
  pouvait donc PAS être indexé pour son propre nom, alors que le référencement
  est précisément ce qu'on lui vend.

  Les pages de thème sont des composants client (« use client ») : aucune
  métadonnée serveur n'est possible sans réécrire les 373 fichiers. On les
  corrige donc dans le document dès que la session est connue — Googlebot
  exécute le JavaScript et lit le DOM final, y compris le canonical.

  Les robots des réseaux sociaux (WhatsApp, Facebook), eux, ne l'exécutent
  pas : leur cas est traité séparément, côté serveur.
*/

import { useEffect } from "react";

function poser(selecteur: string, creer: () => HTMLElement, appliquer: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selecteur);
  if (!el) {
    el = creer();
    document.head.appendChild(el);
  }
  appliquer(el);
}

export function MetaSiteClient() {
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    try {
      const cle = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;

    let arret = false;
    (async () => {
      for (const attente of [0, 800, 2500, 6000]) {
        if (arret) return;
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const r = await fetch(`/api/sessions?id=${id}`);
          if (!r.ok) continue;
          const s = await r.json();
          const fd = s?.formData;
          const gc = s?.generatedContent;
          const nom: string | undefined = fd?.businessName?.trim();
          if (!nom) return; // page de démonstration : on ne touche à rien

          const ville = fd?.city?.trim();
          const titre =
            gc?.metaTitle?.trim() || (ville ? `${nom} — ${ville}` : nom);
          const description =
            gc?.metaDescription?.trim() ||
            fd?.tagline?.trim() ||
            `${nom}${ville ? ` à ${ville}` : ""}`;

          document.title = titre;

          poser(
            'meta[name="description"]',
            () => {
              const m = document.createElement("meta");
              m.setAttribute("name", "description");
              return m;
            },
            (el) => el.setAttribute("content", description),
          );

          /* Le canonical d'Aevia sur le site d'un client est le pire des cas :
             il annule son indexation. Il pointe désormais sa propre adresse. */
          const canonique = `${window.location.origin}${window.location.pathname}`;
          poser(
            'link[rel="canonical"]',
            () => {
              const l = document.createElement("link");
              l.setAttribute("rel", "canonical");
              return l;
            },
            (el) => el.setAttribute("href", canonique),
          );

          const og: Array<[string, string]> = [
            ["og:title", titre],
            ["og:description", description],
            ["og:url", canonique],
            ["og:site_name", nom],
            ["og:type", "website"],
          ];
          const photo = (fd?.photoUrls ?? [])[0] ?? fd?.logoUrl;
          if (typeof photo === "string" && photo.startsWith("http")) og.push(["og:image", photo]);

          for (const [prop, valeur] of og) {
            poser(
              `meta[property="${prop}"]`,
              () => {
                const m = document.createElement("meta");
                m.setAttribute("property", prop);
                return m;
              },
              (el) => el.setAttribute("content", valeur),
            );
          }

          poser(
            'meta[name="twitter:card"]',
            () => {
              const m = document.createElement("meta");
              m.setAttribute("name", "twitter:card");
              return m;
            },
            (el) => el.setAttribute("content", photo ? "summary_large_image" : "summary"),
          );
          return;
        } catch {}
      }
    })();

    return () => {
      arret = true;
    };
  }, []);

  return null;
}
