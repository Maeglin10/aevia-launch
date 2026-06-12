"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Truck } from "lucide-react";
import { C, SERVICES_DATA, SectionReveal } from "../shared";

export default function ServicesPage() {
  return (
    <div style={{ background: C.bg }}>
      {/* Hero band */}
      <div style={{ background: C.navy, padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <Truck size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Nos prestations</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 900, color: C.white, lineHeight: 1.1, marginBottom: 18 }}>
            Tous vos déménagements,<br />
            <span style={{ color: C.orange }}>une seule équipe</span>
          </h1>
          <p style={{ fontSize: 18, color: "#93c5fd", maxWidth: 540, lineHeight: 1.75 }}>
            Du studio au bureau, du local à l'international — nous avons l'expérience, le matériel et les équipes pour chaque projet.
          </p>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {SERVICES_DATA.map((svc, i) => (
            <SectionReveal key={svc.name} delay={i * 0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0, background: C.bg, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(30,58,95,0.05)" }} className="grid md:grid-cols-1">
                {/* Left accent */}
                <div style={{ background: i % 2 === 0 ? C.navy : C.bgAlt, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ width: 60, height: 60, background: C.orange, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <svc.icon size={30} color={C.white} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{svc.tagline}</div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: i % 2 === 0 ? C.white : C.navy, marginBottom: 12 }}>{svc.name}</h2>
                  <p style={{ fontSize: 14, color: i % 2 === 0 ? "#93c5fd" : C.textMuted, lineHeight: 1.7 }}>{svc.shortDesc}</p>
                  <div style={{ marginTop: 28 }}>
                    <span style={{ fontSize: 13, color: i % 2 === 0 ? "#93c5fd" : C.textMuted }}>À partir de </span>
                    <span style={{ fontSize: 26, fontWeight: 900, color: C.orange }}>{svc.from}</span>
                  </div>
                </div>
                {/* Right detail */}
                <div style={{ padding: "48px 48px" }}>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32 }}>{svc.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }} className="grid sm:grid-cols-1">
                    {svc.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={12} color={C.orange} />
                        </div>
                        <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/templates/impact-39/devis" style={{ textDecoration: "none" }}>
                    <button
                      type="button"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui" }}
                    >
                      Demander un devis <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
