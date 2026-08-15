"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Gem, X, Plus, Minus, Trash2, Check, ShoppingBag } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, FONT_BODY, COLLECTIONS, GemStoneSVG, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

/* ============================================================
   CART / CHECKOUT — types & helpers
   ============================================================ */

type Piece = {
  name: string;
  subtitle: string;
  price: string;
  stone: string;
  metal: string;
  gem: string;
  desc: string;
  limited?: boolean;
};

type CartItem = {
  key: string;
  name: string;
  subtitle: string;
  price: number;
  size: string;
  qty: number;
  gem: string;
};

const SIZE_OPTIONS = ["48 (petite)", "52 (standard)", "56 (grande)", "60 (extra grande)"];

function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: C.bgAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: "12px 16px",
  outline: "none",
  fontFamily: FONT_BODY,
  fontSize: 15,
};

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_LABEL,
  fontSize: 10,
  letterSpacing: "0.2em",
  color: C.accent,
  textTransform: "uppercase",
  display: "block",
  marginBottom: 8,
};

/* ── Piece detail modal — variant selector + add-to-cart, or quote request ── */
function PieceDetailModal({
  piece,
  onClose,
  onAddToCart,
}: {
  piece: Piece | null;
  onClose: () => void;
  onAddToCart: (size: string, qty: number) => void;
}) {
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    setSize("");
    setQty(1);
    setQuoteLoading(false);
    setQuoteSent(false);
  }, [piece?.name]);

  if (!piece) return null;
  const isQuote = parsePriceToNumber(piece.price) === 0;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setTimeout(() => {
      setQuoteLoading(false);
      setQuoteSent(true);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {piece && (
        <>
          <motion.div
            key="pd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(10,6,2,0.75)", zIndex: 300 }}
          />
          <motion.div
            key="pd-panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`Détails — ${piece.name}`}
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: "min(560px, calc(100vw - 32px))",
              maxHeight: "90vh",
              overflowY: "auto",
              background: C.bgCard,
              border: `1px solid ${C.borderGold}`,
              zIndex: 310,
            }}
          >
            <div style={{ position: "relative", padding: 40 }}>
              <button
                onClick={onClose}
                aria-label="Fermer"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: C.textMuted,
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <GemStoneSVG type={piece.gem} size={110} animated={false} />
              </div>

              <p style={{ ...labelStyle, textAlign: "center" }}>{piece.subtitle}</p>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 32, fontWeight: 300, color: C.text, textAlign: "center", marginBottom: 12 }}>
                {piece.name}
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7, textAlign: "center", marginBottom: 20 }}>
                {piece.desc}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28, fontFamily: FONT_LABEL, fontSize: 12, color: C.textMuted }}>
                <span>Matière : {piece.metal}</span>
                <span>Gemme : {piece.stone}</span>
              </div>
              <p style={{ fontFamily: FONT_HEADING, fontSize: 26, color: C.accent, textAlign: "center", marginBottom: 32 }}>
                {piece.price}
              </p>

              {isQuote ? (
                quoteSent ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Check size={22} color={C.accent} />
                    </div>
                    <h4 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.text, marginBottom: 12 }}>Demande envoyée</h4>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
                      Notre équipe vous contactera sous 24h pour organiser votre consultation privée.
                    </p>
                    <button onClick={onClose} style={{ minHeight: 44, padding: "14px 36px", background: C.accent, color: C.bg, border: "none", fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                      Fermer
                    </button>
                  </motion.div>
                ) : (
                  <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleQuoteSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label htmlFor="pd-quote-name" style={labelStyle}>Nom complet</label>
                      <input id="pd-quote-name" name="name" type="text" required style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="pd-quote-email" style={labelStyle}>Email</label>
                      <input id="pd-quote-email" name="email" type="email" required style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="pd-quote-phone" style={labelStyle}>Téléphone</label>
                      <input id="pd-quote-phone" name="phone" type="tel" required style={inputStyle} />
                    </div>
                    <button
                      type="submit"
                      disabled={quoteLoading}
                      style={{
                        minHeight: 44,
                        marginTop: 8,
                        padding: "14px 36px",
                        background: C.accent,
                        color: C.bg,
                        border: "none",
                        fontFamily: FONT_LABEL,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        cursor: quoteLoading ? "not-allowed" : "pointer",
                        opacity: quoteLoading ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      {quoteLoading ? "Envoi en cours…" : "Demander un devis"}
                    </button>
                  </motion.form>
                )
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAddToCart(size, qty);
                  }}
                >
                  <label htmlFor="pd-size" style={labelStyle}>Taille / Ajustement</label>
                  <select
                    id="pd-size"
                    name="size"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{ ...inputStyle, marginBottom: 20, cursor: "pointer" }}
                  >
                    <option value="" disabled>Choisir une taille</option>
                    {SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                    <span style={labelStyle}>Quantité</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="Diminuer la quantité"
                        style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${C.border}`, color: C.text, cursor: "pointer" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 24, textAlign: "center", fontFamily: FONT_BODY, color: C.text }}>{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + 1)}
                        aria-label="Augmenter la quantité"
                        style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${C.border}`, color: C.text, cursor: "pointer" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "16px",
                      background: C.accent,
                      color: C.bg,
                      border: "none",
                      fontFamily: FONT_LABEL,
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    <ShoppingBag size={14} />
                    Ajouter au panier
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Cart drawer — line items, total, checkout, confirmation ──────────── */
function CartDrawer({
  open,
  onClose,
  cart,
  onRemove,
  step,
  onStartCheckout,
  loading,
  onSubmitCheckout,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (key: string) => void;
  step: "cart" | "checkout" | "success";
  onStartCheckout: () => void;
  loading: boolean;
  onSubmitCheckout: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(10,6,2,0.75)", zIndex: 300 }}
          />
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 310, width: "min(440px, 100vw)", background: C.bgCard, borderLeft: `1px solid ${C.borderGold}`, display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 300, color: C.text }}>
                {step === "checkout" ? "Livraison" : step === "success" ? "Commande" : `Panier (${count})`}
              </h3>
              <button
                onClick={onClose}
                aria-label="Fermer le panier"
                style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
              <AnimatePresence mode="wait">
                {step === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "40px 0" }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                      style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
                    >
                      <Check size={22} color={C.accent} />
                    </motion.div>
                    <h4 style={{ fontFamily: FONT_HEADING, fontSize: 24, color: C.text, marginBottom: 12 }}>Commande confirmée</h4>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
                      Merci pour votre commande. Notre maison vous contactera sous 24h pour organiser la livraison sécurisée sous escorte.
                    </p>
                    <button
                      onClick={onReset}
                      style={{ width: "100%", minHeight: 44, padding: "16px", background: C.accent, color: C.bg, border: "none", fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      Fermer
                    </button>
                  </motion.div>
                ) : step === "checkout" ? (
                  <motion.form key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={onSubmitCheckout} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label htmlFor="co-name" style={labelStyle}>Nom complet</label>
                      <input id="co-name" name="name" type="text" required style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="co-email" style={labelStyle}>Email</label>
                      <input id="co-email" name="email" type="email" required style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="co-address" style={labelStyle}>Adresse de livraison</label>
                      <textarea id="co-address" name="address" rows={3} required style={{ ...inputStyle, resize: "none" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <span style={labelStyle}>Total</span>
                      <span style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent }}>{formatEUR(total)}</span>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "16px",
                        background: C.accent,
                        color: C.bg,
                        border: "none",
                        fontFamily: FONT_LABEL,
                        fontSize: 11,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {loading ? "Traitement en cours…" : "Confirmer la commande"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div key="cart-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {cart.length === 0 ? (
                      <p style={{ fontFamily: FONT_BODY, color: C.textMuted, textAlign: "center", padding: "60px 0" }}>Votre panier est vide.</p>
                    ) : (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 28 }}>
                          {cart.map((item) => (
                            <div key={item.key} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                              <div style={{ width: 56, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.bgAlt, border: `1px solid ${C.border}` }}>
                                <GemStoneSVG type={item.gem} size={40} animated={false} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: FONT_HEADING, fontSize: 16, color: C.text }}>{item.name}</p>
                                <p style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.textMuted, marginTop: 2 }}>Taille {item.size}</p>
                                <p style={{ fontFamily: FONT_LABEL, fontSize: 11, color: C.accent, marginTop: 4 }}>{item.qty} × {formatEUR(item.price)}</p>
                              </div>
                              <button
                                onClick={() => onRemove(item.key)}
                                aria-label={`Retirer ${item.name} du panier`}
                                style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", flexShrink: 0 }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderTop: `1px solid ${C.border}`, marginBottom: 24 }}>
                          <span style={labelStyle}>Total</span>
                          <span style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent }}>{formatEUR(total)}</span>
                        </div>
                        <button
                          onClick={onStartCheckout}
                          style={{ width: "100%", minHeight: 44, padding: "16px", background: C.accent, color: C.bg, border: "none", fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                        >
                          Passer la commande
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


export default function CollectionsPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [activeCollection, setActiveCollection] = useState("high-jewelry");
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const currentCollection = COLLECTIONS.find((c) => c.id === activeCollection) || COLLECTIONS[0];
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAddToCart = (size: string, qty: number) => {
    if (!selectedPiece) return;
    const key = `${selectedPiece.name}-${size}`;
    const newItem: CartItem = {
      key,
      name: selectedPiece.name,
      subtitle: selectedPiece.subtitle,
      price: parsePriceToNumber(selectedPiece.price),
      size,
      qty,
      gem: selectedPiece.gem,
    };
    setCart((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, newItem];
    });
    setSelectedPiece(null);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (key: string) => {
    setCart((prev) => prev.filter((p) => p.key !== key));
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutStep("success");
    }, 2200);
  };

  const handleResetCart = () => {
    setCart([]);
    setCheckoutStep("cart");
    setCartOpen(false);
  };

  return (
    <section style={{ padding: "100px 24px", background: C.bg }} id="collections">
      {/* Floating cart trigger */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label={`Ouvrir le panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 290,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: C.accent,
          color: C.bg,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              padding: "0 4px",
              borderRadius: "50%",
              background: C.bg,
              color: C.accent,
              border: `1px solid ${C.accent}`,
              fontFamily: FONT_LABEL,
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartCount}
          </span>
        )}
      </button>

      <PieceDetailModal piece={selectedPiece} onClose={() => setSelectedPiece(null)} onAddToCart={handleAddToCart} />

      <CartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          if (checkoutStep !== "success") setCheckoutStep("cart");
        }}
        cart={cart}
        onRemove={handleRemoveFromCart}
        step={checkoutStep}
        onStartCheckout={() => setCheckoutStep("checkout")}
        loading={checkoutLoading}
        onSubmitCheckout={handleSubmitCheckout}
        onReset={handleResetCart}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
              Créations Uniques
            </span>
            <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300, color: C.text, marginTop: 16, lineHeight: 1.15 }}>
              Haute <em>Joaillerie</em>
            </h1>
          </div>
        </Reveal>

        {/* Tab Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 30, marginBottom: 60 }}>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCollection(c.id)}
              style={{
                background: "transparent",
                border: "none",
                color: activeCollection === c.id ? C.accent : C.textMuted,
                fontFamily: FONT_LABEL,
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "10px 20px",
                borderBottom: activeCollection === c.id ? `2px solid ${C.accent}` : "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Pieces Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 30 }}>
          {currentCollection.pieces.map((piece, i) => (
            <Reveal key={piece.name} delay={i * 0.1}>
              <div
                onMouseEnter={() => setHoveredPiece(i)}
                onMouseLeave={() => setHoveredPiece(null)}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: 40,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border 0.3s",
                }}
              >
                {/* Background gem decoration */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    bottom: -20,
                    opacity: hoveredPiece === i ? 0.12 : 0.03,
                    transition: "opacity 0.4s",
                    pointerEvents: "none",
                  }}
                >
                  <GemStoneSVG type={piece.gem} size={180} animated={false} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                    <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.25em", color: C.accent, textTransform: "uppercase" }}>
                      {piece.subtitle}
                    </span>
                    {piece.limited && (
                      <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.1em", color: C.white, background: C.ruby, padding: "2px 8px" }}>
                        UNIQUE
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 300, color: C.text, marginBottom: 12 }}>
                    {piece.name}
                  </h3>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.6, marginBottom: 30 }}>
                    {piece.desc}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "between", fontSize: 13, color: C.textMuted, fontFamily: FONT_LABEL }}>
                      <span>Matière : {piece.metal}</span>
                      <span>Gemme : {piece.stone}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, color: C.accent, fontFamily: FONT_HEADING }}>
                      {piece.price}
                    </span>
                    <button
                      onClick={() => setSelectedPiece(piece)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: C.text,
                        fontFamily: FONT_LABEL,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        minHeight: 44,
                        padding: "0 4px",
                      }}
                    >
                      DÉTAILS <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
