"use client";

/*
  Aucune certification inventée sous le nom d'un client.

  Mesuré sur le catalogue : 117 thèmes portent des marques de certification
  réglementées en dur (RGE, Qualibat, Qualiopi…) sans lire les certifications
  du client. Le mélange est toxique : la démo dit « certifié RGE », la
  personnalisation injecte le nom et la ville du client autour — un plombier
  non-RGE livrait une page « certifié RGE à Annecy ». RGE conditionne des
  aides d'État : c'est de la pratique commerciale trompeuse, pour le client
  comme pour nous.

  Règle produit : une certification ne se hérite JAMAIS de la démonstration.
  Quand une session client est chargée, toute mention d'une marque réglementée
  que le client n'a pas déclarée (businessProfile.certifications) est retirée
  de l'écran — l'élément porteur le plus proche est masqué. Sans session
  (démo pure), rien ne change.

  Posé ici, une fois pour les 373 thèmes, comme TexteAlternatif et la barre
  d'appel — un correctif catalogue, pas 117 éditions.
*/

import { useEffect } from "react";
import { sessionPartagee } from "@/lib/templates/sessionPartagee";

/* Marques dont l'usage est réglementé ou vérifiable — jamais le mot
   « certifié » seul, qui purgerait des phrases légitimes du client. */
const MARQUES = [
  /\bRGE\b/,
  /Qualibat/i,
  /QualiPAC/i,
  /QualiSol/i,
  /Qualifelec/i,
  /Qualiopi/i,
  /Qualit'?EnR/i,
  /Certibat/i,
  /Handibat/i,
  /Écocert|Ecocert/,
  /MaPrimeR[ée]nov/i,
  /\bCEE\b/,
  /\bQualianor\b/i,
];

function texteAutorise(texte: string, certificationsClient: string[]): boolean {
  const marque = MARQUES.find((m) => m.test(texte));
  if (!marque) return true;
  /* Le client a-t-il déclaré une certification couvrant cette mention ?
     (comparaison souple : « RGE » saisi couvre « certifié RGE QualiPAC ») */
  const minuscule = texte.toLowerCase();
  return certificationsClient.some((c) => {
    const cMin = c.toLowerCase().trim();
    return cMin.length >= 3 && (minuscule.includes(cMin) || cMin.split(/\s+/).some((mot) => mot.length >= 3 && minuscule.includes(mot)));
  });
}

export function GardeCertifications() {
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    try {
      const cle = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return; // démo pure : les mentions du thème restent

    let certifications: string[] = [];
    let arret = false;
    let observer: MutationObserver | null = null;

    const purger = () => {
      const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const aMasquer: Element[] = [];
      while (marcheur.nextNode()) {
        const noeud = marcheur.currentNode as Text;
        const texte = noeud.textContent ?? "";
        if (texte.length < 3) continue;
        if (!texteAutorise(texte, certifications)) {
          const parent = noeud.parentElement;
          if (parent && !aMasquer.includes(parent)) aMasquer.push(parent);
        }
      }
      for (const el of aMasquer) {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        el.setAttribute("data-certification-purgee", "1");
      }
      return aMasquer.length;
    };

    (async () => {
      for (const attente of [0, 800, 2500, 6000]) {
        if (arret) return;
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const session = await sessionPartagee(id);
          if (!session?.formData?.businessName) return; // pas un site client
          certifications = (session.businessProfile?.certifications ?? []).filter(
            (c: unknown): c is string => typeof c === "string" && c.trim().length > 0,
          );
          purger();
          /* Les sections animées (useInView) montent leur contenu plus tard :
             on surveille le DOM un moment, puis on lâche prise. */
          observer = new MutationObserver(() => purger());
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
          setTimeout(() => observer?.disconnect(), 30_000);
          return;
        } catch {}
      }
    })();

    return () => {
      arret = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
