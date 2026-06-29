"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Star, ArrowRight, ChevronLeft, Check, ShoppingBag, Leaf } from "lucide-react";
import { C, PageHero, PRODUCTS, useCart } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

function ShopCard({ p, i, onOpen }: { p: typeof PRODUCTS[0]; i: number; onOpen: () => void }) {
  const tagColors: Record<string, string> = {
    season: C.sage, sale: "#bf360c", best: C.accent, limited: "#1565c0", new: C.sageMid,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
      onClick={onOpen}
      style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "0 0 32px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      <div style={{ height: 220, position: "relative", marginBottom: 24, overflow: "hidden" }}>
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ height: "100%", background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={34} color="rgba(255,255,255,0.55)" />
          </div>
        )}
        {p.tag && (
          <div style={{ position: "absolute", top: 14, left: 14, background: p.tagType ? tagColors[p.tagType] : C.accent, color: C.white, padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", fontFamily: SANS, textTransform: "uppercase" as const }}>{p.tag}</div>
        )}
      </div>
      <div style={{ padding: "0 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>{p.collection}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.text, margin: "0 0 8px", fontWeight: 700 }}>{p.name}</h3>
        <p style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: "0 0 14px" }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 14 }}>
          {[...Array(5)].map((_, j) => (<Star key={j} size={11} fill={C.accent} color={C.accent} />))}
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: SANS, marginLeft: 4 }}>{p.rating} ({p.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontFamily: SERIF, fontSize: 22, color: C.accent, fontWeight: 700 }}>{p.price} €</span>
            {p.oldPrice && (<span style={{ fontFamily: SANS, fontSize: 13, color: C.textDim, textDecoration: "line-through" }}>{p.oldPrice} €</span>)}
          </div>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>Voir <ArrowRight size={13} /></span>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetail({ p, onBack, onAddToCart }: { p: typeof PRODUCTS[0]; onBack: () => void; onAddToCart: () => void }) {
  const [activeColor, setActiveColor] = useState(0);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { onAddToCart(); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <section style={{ background: C.bg, padding: "120px 24px 100px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: SANS, fontSize: 13, marginBottom: 36 }}
          onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
        ><ChevronLeft size={16} /> Retour à la boutique</button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ height: "clamp(380px, 56vw, 560px)", border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${p.colors[activeColor]}, ${p.colors[(activeColor + 1) % p.colors.length]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={48} color="rgba(255,255,255,0.5)" />
              </div>
            )}
            {p.tag && (<div style={{ position: "absolute", top: 18, left: 18, background: C.accent, color: C.white, padding: "5px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", fontFamily: SANS, textTransform: "uppercase" as const }}>{p.tag}</div>)}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 12 }}>{p.collection}</div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 46px)", color: C.accent, margin: "0 0 16px", fontWeight: 700 }}>{p.name}</h1>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
              {[...Array(5)].map((_, j) => (<Star key={j} size={14} fill={C.accent} color={C.accent} />))}
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, marginLeft: 6 }}>{p.rating} · {p.reviews} avis vérifiés</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 28 }}>
              <span style={{ fontFamily: SERIF, fontSize: 34, color: C.accent, fontWeight: 700 }}>{p.price} €</span>
              {p.oldPrice && (<span style={{ fontSize: 17, color: C.textDim, textDecoration: "line-through", fontFamily: SANS }}>{p.oldPrice} €</span>)}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
              {p.desc} Composé à la main dans notre atelier parisien avec des fleurs de saison ({p.material.toLowerCase()}), livré dans un emballage kraft avec ruban et carte d'entretien.
            </p>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Palette</div>
              <div style={{ display: "flex", gap: 10 }}>
                {p.colors.map((color, ci) => (
                  <button key={ci} onClick={() => setActiveColor(ci)}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: color, border: `2px solid ${activeColor === ci ? C.accent : C.border}`, cursor: "pointer", padding: 0 }} />
                ))}
              </div>
            </div>
            <button onClick={handleAdd}
              style={{ width: "100%", maxWidth: 460, padding: "17px", background: added ? C.sage : C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer", transition: "all 0.2s", fontFamily: SANS, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >{added ? (<><Check size={16} /> Ajouté au panier</>) : (<><ShoppingBag size={16} /> Ajouter au panier</>)}</button>
            <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}><Leaf size={13} color={C.sage} /> Livraison Paris offerte</span>
              <span style={{ fontSize: 12, color: C.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}><Leaf size={13} color={C.sage} /> Fleurs fraîches de saison</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Boutique() {
  const [productDetail, setProductDetail] = useState<number | null>(null);
  const { addToCart } = useCart();

  if (productDetail !== null && PRODUCTS[productDetail]) {
    return <ProductDetail p={PRODUCTS[productDetail]} onBack={() => setProductDetail(null)} onAddToCart={addToCart} />;
  }

  return (
    <div>
      <PageHero
        eyebrow="La boutique"
        title="Nos bouquets & créations"
        subtitle="Compositions de saison, plantes et créations sur mesure, façonnées à la main dans notre atelier parisien. Cliquez sur une création pour découvrir sa fiche."
      />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {PRODUCTS.map((p, i) => (
            <ShopCard key={p.name} p={p} i={i} onOpen={() => {
              setProductDetail(i);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }} />
          ))}
        </div>
      </section>
    </div>
  );
}
