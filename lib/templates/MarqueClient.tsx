"use client";

import { useEffect, useState } from "react";
import { clientName } from "./clientContent";

/**
 * Le nom du client, dans un en-tête partagé.
 *
 * Les `layout.tsx` des thèmes enveloppent toutes les pages annexes — c'est là
 * que vivent la marque du haut et celle du pied de page. Mais un layout n'a pas
 * la variable `sessionData` que les pages se donnent : y écrire
 * `clientName(sessionData)` fait planter la page entière
 * (« sessionData is not defined »), ce que j'ai vérifié en le cassant sur six
 * thèmes.
 *
 * Ce composant va donc chercher la session lui-même, comme le fait chaque page,
 * et retombe sur la marque du thème tant qu'aucun client n'est chargé.
 */
export function MarqueClient({ repli }: { repli: string }) {
  const [session, setSession] = useState<unknown>(null);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cle = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSession(s))
      .catch(() => {});
  }, []);

  return <>{clientName(session as Parameters<typeof clientName>[0]) ?? repli}</>;
}
