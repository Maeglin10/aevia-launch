"use client";

/**
 * Le panier visible : un bouton flottant qui compte les articles, et un tiroir.
 *
 * Il ne s'affiche que si un fournisseur est monté — donc seulement sur une
 * boutique qui accepte réellement le paiement. Sur une vitrine, rien
 * n'apparaît, et c'est la bonne chose : un panier sans paiement est le
 * « checkout théâtral » que ce chantier existe pour supprimer.
 *
 * Styles en ligne et neutres : ce composant est injecté par-dessus 373 thèmes
 * dont il ne connaît pas les classes utilitaires.
 */

import { usePanier } from "./PanierProvider";
import { formaterCents, prixEnCents } from "@/lib/boutique/prix";

export function TiroirPanier({ devise = "EUR" }: { devise?: string }) {
  const panier = usePanier();
  if (!panier) return null;
  const { lignes, nombreArticles, totalCents, ouvert, setOuvert, produits } = panier;

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        aria-label={`Panier, ${nombreArticles} article(s)`}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          borderRadius: 999,
          border: "none",
          background: "#111",
          color: "#fff",
          font: "600 15px/1 system-ui, sans-serif",
          cursor: "pointer",
          boxShadow: "0 6px 24px rgba(0,0,0,.25)",
        }}
      >
        Panier{nombreArticles > 0 ? ` · ${nombreArticles}` : ""}
      </button>

      {ouvert && (
        <div
          role="dialog"
          aria-label="Votre panier"
          style={{
            position: "fixed",
            inset: "0 0 0 auto",
            width: "min(380px, 100vw)",
            zIndex: 9999,
            background: "#fff",
            color: "#111",
            borderLeft: "1px solid #e5e5e5",
            display: "flex",
            flexDirection: "column",
            font: "15px/1.5 system-ui, sans-serif",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 18px",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>Votre panier</strong>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Fermer le panier"
              style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", lineHeight: 1 }}
            >
              ×
            </button>
          </header>

          {/* `min-height: 0` avec `overflow: auto` : sans lui, la liste pousse
              le pied de page hors de l'écran et le bouton Payer devient
              inatteignable sur mobile. */}
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 18px" }}>
            {lignes.length === 0 && <p style={{ color: "#666" }}>Votre panier est vide.</p>}
            {lignes.map((l) => {
              const p = produits[l.produitIndex];
              const cents = prixEnCents(p?.price);
              return (
                <div
                  key={l.produitIndex}
                  style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f2f2f2" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p?.name ?? "Article"}
                    </div>
                    {cents !== null && (
                      <div style={{ color: "#666", fontSize: 13 }}>{formaterCents(cents, devise)}</div>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={l.quantite}
                    onChange={(e) => panier.definirQuantite(l.produitIndex, Number(e.target.value))}
                    aria-label={`Quantité pour ${p?.name ?? "l’article"}`}
                    style={{ width: 58, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => panier.retirer(l.produitIndex)}
                    aria-label={`Retirer ${p?.name ?? "l’article"}`}
                    style={{ border: "none", background: "none", color: "#999", cursor: "pointer", fontSize: 18 }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <footer style={{ padding: "14px 18px", borderTop: "1px solid #eee" }}>
            {panier.erreur && (
              <p role="alert" style={{ color: "#b00020", margin: "0 0 10px", fontSize: 14 }}>
                {panier.erreur}
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontWeight: 600 }}>
              <span>Total</span>
              <span>{formaterCents(totalCents, devise)}</span>
            </div>
            <button
              type="button"
              onClick={() => void panier.payer()}
              disabled={lignes.length === 0 || panier.enCours}
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 10,
                border: "none",
                background: lignes.length === 0 || panier.enCours ? "#bbb" : "#111",
                color: "#fff",
                font: "600 15px/1 system-ui, sans-serif",
                cursor: lignes.length === 0 || panier.enCours ? "default" : "pointer",
              }}
            >
              {panier.enCours ? "Redirection…" : "Payer"}
            </button>
            <p style={{ color: "#888", fontSize: 12, margin: "10px 0 0", textAlign: "center" }}>
              Paiement sécurisé par Stripe
            </p>
          </footer>
        </div>
      )}
    </>
  );
}
