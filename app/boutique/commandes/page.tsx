"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/*
  Le carnet de commandes du marchand. Le jeton d'édition vit dans le
  localStorage du navigateur qui a créé le site : la page le récupère
  elle-même — l'URL partagée sans jeton ne montre rien.
*/
interface Commande {
  id: string;
  lignes: { nom: string; prixCents: number; quantite: number }[];
  totalCents: number;
  emailAcheteur?: string;
  nomAcheteur?: string;
  creeLe: string;
  statut: string;
}

const euros = (c: number) => (c / 100).toFixed(2).replace(".", ",") + " €";

function Contenu() {
  const params = useSearchParams();
  const sessionId = params.get("session");
  const [etat, setEtat] = useState<"chargement" | "interdit" | "pret">("chargement");
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    let token: string | null = null;
    try {
      token = window.localStorage.getItem(`aevia-edit-token-${sessionId}`);
    } catch {}
    if (!token) {
      setEtat("interdit");
      return;
    }
    (async () => {
      const r = await fetch(`/api/boutique/commandes?session=${sessionId}&token=${token}`);
      if (!r.ok) {
        setEtat("interdit");
        return;
      }
      const d = await r.json();
      setCommandes(d.commandes ?? []);
      setEtat("pret");
    })();
  }, [sessionId]);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, margin: "0 0 6px" }}>Vos commandes</h1>
      <p style={{ color: "#71717a", fontSize: 13.5, margin: "0 0 26px" }}>
        Chaque paiement arrive directement sur votre compte Stripe ; le détail complet
        (remboursements, virements) vit dans votre tableau de bord Stripe.
      </p>

      {etat === "chargement" && <p style={{ color: "#71717a" }}>Chargement…</p>}
      {etat === "interdit" && (
        <p style={{ color: "#71717a" }}>
          Cette page ne s'ouvre que depuis le navigateur qui a créé le site (il détient la
          clé d'édition). Ouvrez-la depuis votre site, panneau Boutique.
        </p>
      )}
      {etat === "pret" && commandes.length === 0 && (
        <p style={{ color: "#71717a" }}>Pas encore de commande — elles apparaîtront ici dès la première vente.</p>
      )}
      {commandes.map((c) => (
        <div key={c.id} style={{ border: "1px solid #e4e4e7", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>
              {c.nomAcheteur ?? "Acheteur"} {c.emailAcheteur ? `· ${c.emailAcheteur}` : ""}
            </strong>
            <span style={{ fontSize: 13, color: "#71717a" }}>{new Date(c.creeLe).toLocaleString("fr-FR")}</span>
          </div>
          {c.lignes.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "3px 0" }}>
              <span>{l.quantite} × {l.nom}</span>
              <span>{euros(l.prixCents * l.quantite)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f0f0f2", marginTop: 8, paddingTop: 8, fontWeight: 700, fontSize: 14 }}>
            <span>Total {c.statut === "remboursee" ? "(remboursée)" : ""}</span>
            <span>{euros(c.totalCents)}</span>
          </div>
        </div>
      ))}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Contenu />
    </Suspense>
  );
}
