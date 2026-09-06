"use client";

/*
  La boutique du site client, posée une fois pour tout le catalogue — comme la
  barre d'appel mobile : aucun des 373 thèmes n'est modifié.

  Trois états, selon la session :
  1. commerce.stripeAccountId présent → vraie vente : bouton « Boutique »
     flottant, tiroir catalogue (produits à prix ferme), panier, paiement
     Stripe Checkout — l'argent va au compte du marchand.
  2. commerce.storeUrl présent → bouton qui ouvre la boutique existante du
     marchand (Shopify, Etsy…) dans un nouvel onglet.
  3. Ni l'un ni l'autre mais le NAVIGATEUR détient le jeton d'édition (c'est
     le marchand qui regarde son propre site) et le thème vend des produits →
     le tiroir propose d'activer l'encaissement en ligne.
  Sinon : rien — les vitrines restent des vitrines.
*/

import { useEffect, useMemo, useState } from "react";

interface Produit {
  name: string;
  price?: string;
  description?: string;
  photoUrl?: string;
  stock?: number;
}

function prixEnCents(brut: string | undefined): number | null {
  if (!brut) return null;
  const nettoye = brut.replace(/[€$\s]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(nettoye)) return null;
  return Math.round(parseFloat(nettoye) * 100);
}

const euros = (cents: number) => (cents / 100).toFixed(2).replace(".", ",") + " €";

export function BarreBoutique() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [ouvert, setOuvert] = useState(false);
  const [panier, setPanier] = useState<Record<number, number>>({});
  const [enPaiement, setEnPaiement] = useState(false);
  const [merci, setMerci] = useState(false);
  const [jetonEdition, setJetonEdition] = useState<string | null>(null);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    try {
      const cle = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cle, id);
      else id = sessionStorage.getItem(cle);
    } catch {}
    if (!id) return;
    setSessionId(id);
    try {
      setJetonEdition(window.localStorage.getItem(`aevia-edit-token-${id}`));
    } catch {}
    if (new URLSearchParams(window.location.search).get("achat") === "merci") setMerci(true);
    (async () => {
      for (const attente of [0, 800, 2500, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) {
            setSession(donnees);
            return;
          }
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const brut = window.localStorage.getItem(`aevia-panier-${sessionId}`);
      if (brut) setPanier(JSON.parse(brut));
    } catch {}
  }, [sessionId]);
  useEffect(() => {
    if (!sessionId) return;
    try {
      window.localStorage.setItem(`aevia-panier-${sessionId}`, JSON.stringify(panier));
    } catch {}
  }, [panier, sessionId]);

  const commerce = session?.businessProfile?.commerce;
  const produits: Produit[] = useMemo(
    () => (session?.businessProfile?.products ?? []).filter((p: Produit) => p?.name),
    [session],
  );
  const vendables = useMemo(
    () => produits.map((p, i) => ({ p, i, cents: prixEnCents(p.price) })).filter((x) => x.cents !== null),
    [produits],
  );

  const modeVente = Boolean(commerce?.stripeAccountId) && vendables.length > 0;
  const modeExterne = !modeVente && Boolean(commerce?.storeUrl);
  const modeActivation = !modeVente && !modeExterne && Boolean(jetonEdition) && vendables.length > 0;
  if (!modeVente && !modeExterne && !modeActivation && !merci) return null;

  const nbArticles = Object.values(panier).reduce((t, q) => t + q, 0);
  const totalCents = vendables.reduce((t, x) => t + (panier[x.i] ?? 0) * (x.cents as number), 0);

  const ajouter = (i: number) => setPanier((p) => ({ ...p, [i]: Math.min((p[i] ?? 0) + 1, 99) }));
  const retirer = (i: number) =>
    setPanier((p) => {
      const q = (p[i] ?? 0) - 1;
      const suivant = { ...p };
      if (q <= 0) delete suivant[i];
      else suivant[i] = q;
      return suivant;
    });

  async function payer() {
    if (!sessionId || enPaiement) return;
    setEnPaiement(true);
    try {
      const lignes = Object.entries(panier)
        .filter(([, q]) => q > 0)
        .map(([i, q]) => ({ produitIndex: Number(i), quantite: q }));
      const r = await fetch("/api/boutique/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, lignes }),
      });
      const d = await r.json().catch(() => null);
      if (r.ok && d?.url) {
        window.location.href = d.url;
        return;
      }
      alert(d?.error ?? "Le paiement n'a pas pu démarrer. Réessayez dans un instant.");
    } finally {
      setEnPaiement(false);
    }
  }

  const brand = "var(--brand, #18181b)";

  return (
    <div style={{ position: "fixed", right: 16, bottom: 88, zIndex: 900, fontFamily: "system-ui, sans-serif" }}>
      {merci && (
        <div
          role="status"
          style={{ position: "fixed", left: "50%", top: 18, transform: "translateX(-50%)", background: "#16a34a", color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.25)", zIndex: 1001 }}
        >
          Merci ! Votre commande est confirmée — vous recevrez un email de Stripe.
          <button onClick={() => setMerci(false)} aria-label="Fermer" style={{ marginLeft: 12, background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: 700 }}>✕</button>
        </div>
      )}

      {modeExterne ? (
        <a
          href={commerce.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: brand, color: "#fff", padding: "12px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,.28)" }}
        >
          🛍 Boutique
        </a>
      ) : (
        <>
          {!ouvert && (
            <button
              onClick={() => setOuvert(true)}
              aria-label="Ouvrir la boutique"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: brand, color: "#fff", border: "none", padding: "12px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,.28)" }}
            >
              🛍 Boutique{nbArticles > 0 ? ` · ${nbArticles}` : ""}
            </button>
          )}
          {ouvert && (
            <div
              role="dialog"
              aria-label="Boutique"
              style={{ width: "min(380px, calc(100vw - 24px))", maxHeight: "min(560px, calc(100vh - 120px))", overflowY: "auto", background: "#fff", color: "#18181b", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,.35)", padding: 16 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <strong style={{ fontSize: 15 }}>Boutique</strong>
                <button onClick={() => setOuvert(false)} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>✕</button>
              </div>

              {modeActivation ? (
                <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 10px" }}>
                    Vous voyez ce panneau parce que vous êtes propriétaire de ce site. Activez
                    l'encaissement en ligne pour vendre ces {vendables.length} produit{vendables.length > 1 ? "s" : ""}
                    directement ici — les paiements arrivent sur votre compte Stripe.
                  </p>
                  <a
                    href={`/api/boutique/connecter?session=${sessionId}&token=${jetonEdition}`}
                    style={{ display: "inline-block", background: brand, color: "#fff", padding: "10px 16px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}
                  >
                    Activer le paiement (Stripe)
                  </a>
                  <p style={{ margin: "10px 0 0", color: "#71717a", fontSize: 12 }}>
                    Vos visiteurs ne voient pas ce message.
                  </p>
                </div>
              ) : (
                <>
                  {vendables.map(({ p, i, cents }) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderTop: "1px solid #f0f0f2" }}>
                      {p.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photoUrl} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 12.5, color: "#71717a" }}>{euros(cents as number)}</div>
                      </div>
                      {typeof p.stock === "number" && p.stock <= 0 ? (
                        <span style={{ fontSize: 12, color: "#a1a1aa" }}>Épuisé</span>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {(panier[i] ?? 0) > 0 && (
                            <>
                              <button onClick={() => retirer(i)} aria-label={`Retirer ${p.name}`} style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid #e4e4e7", background: "#fff", cursor: "pointer" }}>−</button>
                              <span style={{ fontSize: 13, minWidth: 14, textAlign: "center" }}>{panier[i]}</span>
                            </>
                          )}
                          <button onClick={() => ajouter(i)} aria-label={`Ajouter ${p.name}`} style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: brand, color: "#fff", cursor: "pointer" }}>+</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #e4e4e7", marginTop: 4 }}>
                    <span style={{ fontSize: 13.5 }}>Total</span>
                    <strong style={{ fontSize: 15 }}>{euros(totalCents)}</strong>
                  </div>
                  <button
                    onClick={payer}
                    disabled={nbArticles === 0 || enPaiement}
                    style={{ width: "100%", marginTop: 10, background: nbArticles === 0 ? "#d4d4d8" : brand, color: "#fff", border: "none", padding: "12px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: nbArticles === 0 ? "default" : "pointer" }}
                  >
                    {enPaiement ? "Redirection…" : "Payer avec Stripe"}
                  </button>
                  <p style={{ margin: "8px 0 0", color: "#a1a1aa", fontSize: 11.5, textAlign: "center" }}>
                    Paiement sécurisé Stripe — livraison et email demandés à l'étape suivante.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
