"use client";

/*
  L'identité du thème sur ses pages annexes.

  Les pages de ce thème n'avaient aucun en-tête commun : le visiteur qui
  arrivait sur « /mentions » ou « /contact » ne savait pas chez qui il était, et
  n'avait pas de chemin de retour. L'accueil, lui, porte déjà sa propre
  en-tête — la ligne n'apparaît donc que sur les annexes.
*/

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";

export default function impact99Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chemin = usePathname() ?? "";
  const surUneAnnexe = chemin.replace(/\/+$/, "").split("/").length > 3;
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    if (!surUneAnnexe) return;
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cle = "apercu-session:impact-99";
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, [surUneAnnexe]);

  return (
    <>
      {surUneAnnexe && (
        <EnteteAnnexe session={session} repli="" accueil="/templates/impact-99" />
      )}
      {children}
    </>
  );
}
