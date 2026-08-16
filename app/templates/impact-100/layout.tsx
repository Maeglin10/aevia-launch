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

export default function impact100Layout({
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
      const cle = "apercu-session:impact-100";
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSession(s))
      .catch(() => {});
  }, [surUneAnnexe]);

  return (
    <>
      {surUneAnnexe && (
        <EnteteAnnexe session={session} repli="" accueil="/templates/impact-100" />
      )}
      {children}
    </>
  );
}
