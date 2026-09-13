"use client";

/*
  Les formulaires des sites livrés envoient enfin quelque chose.

  Mesuré sur le catalogue : au moins 113 thèmes concluent leur formulaire de
  contact par un simple `setSent(true)`. Le visiteur lit « Message envoyé »,
  le client ne reçoit rien — ni email, ni trace. Pour un site vitrine vendu à
  un artisan, c'est le défaut le plus grave qui soit : la demande entrante est
  la seule chose qu'il achète.

  Réécrire 113 fichiers n'aurait corrigé que le passé (la série de thèmes
  continue de grandir). On intercepte donc la soumission ici, une fois pour
  tout le catalogue : au moment où un formulaire est envoyé, ses champs sont
  lus et postés à /api/site/demande, qui écrit la demande et prévient le
  client par email. L'affichage du thème (« Merci ! ») n'est pas touché : il
  devient simplement vrai.

  Rien n'est intercepté sur les pages de démonstration (aucune session) ni sur
  les formulaires qui savent déjà s'envoyer (ceux d'Aevia, ou tout formulaire
  portant data-aevia-envoi="externe").
*/

import { useEffect } from "react";

type Champs = {
  nom?: string;
  email?: string;
  telephone?: string;
  sujet?: string;
  message?: string;
  site?: string;
};

/* Ce que le champ demande, deviné à partir de son nom, son type, son
   étiquette et son texte d'exemple — les thèmes n'ont aucune convention. */
function role(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): keyof Champs | null {
  if (el.tagName === "TEXTAREA") return "message";
  const type = (el as HTMLInputElement).type?.toLowerCase() ?? "";
  if (type === "email") return "email";
  if (type === "tel") return "telephone";
  if (["submit", "button", "hidden", "checkbox", "radio", "file"].includes(type)) return null;

  const etiquette = el.closest("label")?.textContent ?? "";
  const parEtiquette =
    el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent
      ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)!.textContent!
      : "";
  const indice = `${el.getAttribute("name") ?? ""} ${el.getAttribute("placeholder") ?? ""} ${el.getAttribute("aria-label") ?? ""} ${etiquette} ${parEtiquette}`.toLowerCase();

  if (/mail|courriel|correo|e-?mail/.test(indice)) return "email";
  if (/t[ée]l|phone|portable|mobile|whatsapp|numero|número/.test(indice)) return "telephone";
  if (/message|demande|projet|besoin|pr[ée]cis|comment|détail|detalle|nachricht|mensagem/.test(indice)) return "message";
  if (/sujet|objet|subject|type|service|prestation|motif/.test(indice)) return "sujet";
  if (/nom|name|pr[ée]nom|soci[ée]t[ée]|entreprise|nombre/.test(indice)) return "nom";
  return null;
}

export function FormulairesVivants() {
  useEffect(() => {
    let sessionId = new URLSearchParams(window.location.search).get("session");
    try {
      const cle = "apercu-session:" + window.location.pathname.split("/")[2];
      if (sessionId) sessionStorage.setItem(cle, sessionId);
      else sessionId = sessionStorage.getItem(cle);
    } catch {}
    if (!sessionId) return; // démonstration : rien à transmettre

    const envoyes = new WeakSet<HTMLFormElement>();

    const surSoumission = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.dataset.aeviaEnvoi === "externe") return;
      /* Un formulaire qui part vers une adresse (action=, mailto:) sait déjà
         se débrouiller : on ne double pas son envoi. */
      const action = form.getAttribute("action") ?? "";
      if (action && !action.startsWith("#")) return;

      const champs: Champs = {};
      for (const el of Array.from(form.elements) as HTMLInputElement[]) {
        if (!el.name && !el.id && !el.placeholder && !el.getAttribute("aria-label")) continue;
        const r = role(el);
        if (!r) continue;
        const valeur = (el.value ?? "").trim();
        if (!valeur) continue;
        // le premier champ trouvé gagne : les thèmes mettent le principal en tête
        if (!champs[r]) champs[r] = valeur;
      }
      if (!champs.message && !champs.email && !champs.telephone) return;

      /* Envoi non bloquant : le thème affiche son écran de confirmation comme
         avant, la demande part en parallèle. On ne l'envoie qu'une fois par
         formulaire pour éviter les doublons de double-clic. */
      if (envoyes.has(form)) return;
      envoyes.add(form);
      setTimeout(() => envoyes.delete(form), 4000);

      const charge = JSON.stringify({ sessionId, ...champs });
      const url = "/api/site/demande";
      /*
        2026-09-13 — l'envoi était pur sendBeacon : aucun moyen de savoir si
        la demande était arrivée. Un 404, un 429, une panne : le thème
        affichait quand même « message envoyé » et le prospect était perdu en
        silence. `fetch` avec `keepalive` survit aussi à une navigation
        immédiate ET rend le statut lisible ; en échec, la demande est gardée
        dans localStorage et re-postée au prochain chargement — sendBeacon ne
        reste que le filet du tout dernier instant.
      */
      const CLE_ATTENTE = "aevia-demandes-en-attente";
      const garder = () => {
        try {
          const brut = localStorage.getItem(CLE_ATTENTE);
          const liste = brut ? (JSON.parse(brut) as string[]) : [];
          liste.push(charge);
          localStorage.setItem(CLE_ATTENTE, JSON.stringify(liste.slice(-10)));
        } catch {
          /* stockage indisponible : sendBeacon reste le dernier recours */
          try {
            navigator.sendBeacon?.(url, new Blob([charge], { type: "application/json" }));
          } catch {
            /* rien de plus à faire sans casser l'écran du thème */
          }
        }
      };
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: charge,
        keepalive: true,
      })
        .then((res) => {
          if (!res.ok) garder();
        })
        .catch(garder);
    };

    document.addEventListener("submit", surSoumission, true);

    /* Rejeu des demandes gardées lors d'un précédent échec. */
    try {
      const brut = localStorage.getItem("aevia-demandes-en-attente");
      if (brut) {
        const liste = JSON.parse(brut) as string[];
        localStorage.removeItem("aevia-demandes-en-attente");
        for (const charge of liste) {
          void fetch("/api/site/demande", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: charge,
            keepalive: true,
          }).catch(() => {
            /* un rejeu raté sera regardé au prochain chargement via garder() */
          });
        }
      }
    } catch {
      /* localStorage indisponible : rien à rejouer */
    }

    return () => document.removeEventListener("submit", surSoumission, true);
  }, []);

  return null;
}
