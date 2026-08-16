"use client";

/**
 * Le nom de l'éditeur du site, et la ville de son registre.
 *
 * `LegalIdentity` rend déjà le SIREN du client dès qu'il en déclare un. Le nom
 * qui l'accompagne, lui, restait écrit en dur dans cinquante-six fichiers de
 * thèmes — celui du gérant d'Aevia, et la ville de son registre. Un couvreur
 * d'Annecy livrait donc des mentions légales désignant quelqu'un d'autre comme
 * éditeur de son propre site : c'est faux en droit, et le premier client qui
 * ouvre sa page de mentions le voit.
 *
 * La démonstration continue d'afficher l'identité d'Aevia — c'est ce qui
 * protège le catalogue. Dès qu'une session porte le nom du client, c'est le
 * sien qui s'affiche.
 */

import { useEffect, useState } from "react";
import { clientCity, clientLegalForm, clientName } from "@/lib/templates/clientContent";

export function EditeurDuSite({
  repli = "Aevia WS",
  /** "ville" rend la ville du registre plutôt que le nom. */
  quoi = "nom",
}: {
  repli?: string;
  quoi?: "nom" | "ville";
}) {
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
  }, []);

  const s = session as Parameters<typeof clientName>[0];
  if (quoi === "ville") return <>{clientCity(s) ?? "Bourg-en-Bresse"}</>;

  const nom = clientName(s);
  if (!nom) return <>{repli}</>;
  const forme = clientLegalForm(s);
  return <>{forme ? `${nom} (${forme})` : nom}</>;
}
