"use client";

/*
  L'accès aux mentions légales, garanti sur les 373 thèmes.

  Mesuré : 103 thèmes n'avaient aucune page de mentions légales, et beaucoup
  de ceux qui en ont une ne la lient nulle part. La LCEN (art. 6-III) impose
  qu'un site professionnel rende ces informations « facilement accessibles » —
  et c'est le CLIENT qui est éditeur, donc lui qui encourt l'amende.

  Ce composant n'ajoute rien quand le thème fait déjà le travail : il ne pose
  son lien que si aucun lien vers /legal, /mentions ou /privacy n'existe dans
  la page. Posé une fois dans le layout du catalogue, comme les autres
  correctifs transverses.
*/

import { useEffect, useState } from "react";

export function LienMentionsLegales() {
  const [chemin, setChemin] = useState<string | null>(null);

  useEffect(() => {
    const theme = window.location.pathname.split("/")[2];
    if (!theme?.startsWith("impact-")) return;

    /* Le thème lie-t-il déjà ses pages légales ? */
    const dejaLie = Array.from(document.querySelectorAll("a")).some((a) =>
      /\/(legal|mentions|mentions-legales|privacy|confidentialite|cgv|cgu)(\/|$|\?)/.test(
        a.getAttribute("href") ?? "",
      ),
    );
    if (dejaLie) return;

    const session = new URLSearchParams(window.location.search).get("session");
    setChemin(`/templates/${theme}/legal${session ? `?session=${session}` : ""}`);
  }, []);

  if (!chemin) return null;

  return (
    <div
      style={{
        padding: "18px 20px 26px",
        textAlign: "center",
        background: "rgba(0,0,0,0.03)",
        borderTop: "1px solid rgba(128,128,128,0.18)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <a
        href={chemin}
        style={{ fontSize: 12.5, color: "inherit", opacity: 0.72, textDecoration: "underline" }}
      >
        Mentions légales
      </a>
    </div>
  );
}
