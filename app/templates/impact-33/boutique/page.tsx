"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT_HEADING, FONT_BODY, BOUTIQUE_PRODUCTS } from "../shared";

export default function BoutiquePage() {
  return (
    <section style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          La Boutique
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          Notre catalogue artisanal
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Tout est préparé chaque jour dès 4h du matin. Farines Label Rouge, beurre AOP, levain vivant — l'authenticité dans chaque bouchée.
        </p>
      </motion.div>

      {BOUTIQUE_PRODUCTS.map((cat, ci) => (
        <div key={cat.title} style={{ marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ci * 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <TemplateIcon emoji={cat.emoji} size={32} />
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text }}>{cat.title}</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22 }}>
            {cat.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 + i * 0.07 }}
                whileHover={{ y: -6, boxShadow: C.shadowLg }}
                style={{ background: C.white, borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
              >
                <img
                  src={`https://images.unsplash.com/${item.img}?w=800&q=80&fit=crop`}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
                <div style={{ padding: "20px 22px" }}>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 18 }}>{item.price}</span>
                    <Link href="/templates/impact-33/reservation" style={{ textDecoration: "none" }}>
                      <motion.button
                        type="button"
                        style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}
                        whileHover={{ background: C.accentDark, scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Commander
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
