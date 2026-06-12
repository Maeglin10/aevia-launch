"use client";

import React from "react";
import Link from "next/link";
import { Warehouse, CheckCircle, Shield, Clock, Zap } from "lucide-react";
import { C, STORAGE_BOXES, SectionReveal } from "../shared";

export default function StockagePage() {
  return (
    <div style={{ background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.navy, padding: "72px 5% 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <Warehouse size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Garde-meuble</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.white, marginBottom: 20 }}>
            Votre mobilier en sécurité,<br />
            <span style={{ color: C.orange }}>le temps qu'il faut</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.75 }}>
            Garde-meuble sécurisé 24/7, climatisé, accessible 7j/7. Sans engagement de durée.
          </p>
        </div>
      </div>

      {/* Photo */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 5% 0" }}>
        <SectionReveal>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 340 }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop"
              alt="Entrepôt de garde-meuble climatisé"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </SectionReveal>
      </div>

      {/* Box sizes */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 5%" }}>
        <SectionReveal>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, color: C.navy, textAlign: "center", marginBottom: 16 }}>
            Choisissez votre espace
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, textAlign: "center", marginBottom: 56 }}>
            3 tailles disponibles. Accès sécurisé 7j/7. Résiliation sans préavis.
          </p>
        </SectionReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }} className="grid md:grid-cols-1">
          {STORAGE_BOXES.map((box, i) => (
            <SectionReveal key={box.size} delay={i * 0.1}>
              <div style={{ background: i === 1 ? C.navy : C.bg, borderRadius: 20, padding: 36, border: i === 1 ? `2px solid ${C.orange}` : `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
                {i === 1 && (
                  <div style={{ position: "absolute", top: -1, right: 24, background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                    Populaire
                  </div>
                )}
                <div style={{ fontSize: 36, fontWeight: 900, color: C.orange, marginBottom: 4 }}>{box.size}</div>
                <div style={{ fontSize: 14, color: i === 1 ? "#93c5fd" : C.textMuted, marginBottom: 20 }}>{box.desc}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: i === 1 ? C.white : C.navy, marginBottom: 28 }}>
                  {box.price}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 28 }}>
                  {box.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle size={15} color={C.orange} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: i === 1 ? "#cbd5e1" : C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{ width: "100%", background: i === 1 ? C.orange : C.orangeLight, color: i === 1 ? C.white : C.orange, padding: "14px 24px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                  >
                    Réserver
                  </button>
                </Link>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Trust band */}
      <div style={{ background: C.bgAlt, padding: "60px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }} className="grid sm:grid-cols-2">
          {[
            { icon: Shield, title: "Vidéosurveillance 24/7", desc: "Caméras HD et agents de sécurité" },
            { icon: Clock, title: "Accès 7j/7", desc: "De 8 h à 20 h, tous les jours" },
            { icon: Zap, title: "Climatisé", desc: "Température et hygrométrie contrôlées" },
            { icon: CheckCircle, title: "Sans engagement", desc: "Résiliation à tout moment" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div style={{ width: 52, height: 52, background: C.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon size={24} color={C.orange} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
