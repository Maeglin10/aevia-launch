'use client';

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { C } from "../shared";

export default function StudiosPage() {
  const [activeTab, setActiveTab] = useState(0);

  const studioDetails = [
    {
      name: "Studio A",
      tag: "Main Room",
      size: "80 m²",
      rate: "800€/jour",
      color: C.accent,
      img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
      desc: "Notre flagship. Grand live room acoustique de 80 m² avec traitement sur-mesure, pensé pour capter les grands ensembles — orchestres de chambre, groupes rock, chœurs. La console SSL 9000 J 72 canaux est l'une des rares en France.",
      console: "SSL 9000 J — 72 ch.",
      gear: [
        "SSL 9000 J console — 72 canaux",
        "Neve 1073 × 8 (preamps)",
        "Pro Tools HDX + Logic Pro",
        "Neumann U87, U47, C414",
        "Hammond B3 + Leslie 122",
        "Steinway D (grand piano)",
        "Grand live room — 80 m²",
        "Iso booth 15 m² intégrée",
        "Isolation 72 dB",
        "Dante audio network",
      ],
    },
    {
      name: "Studio B",
      tag: "Production & Mixing",
      size: "45 m²",
      rate: "500€/jour",
      color: "#f97316",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
      desc: "Studio polyvalent taillé pour la production moderne et le mixing hybride. L'SSL Duality 48ch et l'Avid S6 offrent une flexibilité totale — full ITB, full analog, ou rig hybride au choix de l'ingénieur.",
      console: "SSL Duality — 48 ch.",
      gear: [
        "SSL Duality 48ch console",
        "Avid S6 control surface",
        "Full ITB + hybrid rig",
        "2 iso booths indépendantes",
        "Pro Tools HDX",
        "Neumann U47, U87",
        "Universal Audio Apollo 16",
        "Genelec 1234A monitors",
        "Yamaha NS-10M",
        "UAD Quad Core × 2",
      ],
    },
    {
      name: "Mastering Suite",
      tag: "Mastering",
      size: "20 m²",
      rate: "200€/h",
      color: "#8b5cf6",
      img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&fit=crop",
      desc: "Suite de mastering de précision acoustique. Calibrée pour une reproduction sonore de référence, elle accueille les sessions de mastering analogique et numérique. Accessible en autonomie 24/7 pour les clients abonnés.",
      console: "Prism Dream ADA-8XR",
      gear: [
        "Prism Dream ADA-8XR (conversion)",
        "Dangerous Master (summing)",
        "Sennheiser HD800S",
        "Adam A77X monitors",
        "Sequoia + Pro Tools",
        "Izotope Ozone 11 Advanced",
        "Plugin Alliance Mastering Suite",
        "Référence acoustique calibrée",
        "Accès autonome 24/7",
        "Archivage session inclus",
      ],
    },
  ];

  const outboard = [
    { brand: "Neve", items: ["1073 × 8", "33609 compressor"] },
    { brand: "API", items: ["512c × 4", "2500 bus compressor"] },
    { brand: "Universal Audio", items: ["1176LN × 4", "LA-2A × 2"] },
    { brand: "Empirical Labs", items: ["Distressor × 2", "Fatso"] },
    { brand: "Manley", items: ["Vari-Mu", "SLAM!"] },
    { brand: "Pultec", items: ["EQP-1A × 2", "MEQ-5 × 2"] },
  ];

  const s = studioDetails[activeTab];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      {/* Header */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nos espaces</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>NOS STUDIOS</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75 }}>
          Trois espaces pensés pour des besoins différents. Chacun dispose d'un parc matériel haut de gamme et d'une acoustique traitée par des experts.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: "2.5rem" }}>
          {studioDetails.map((sd, i) => (
            <button
              key={sd.name}
              type="button"
              onClick={() => setActiveTab(i)}
              style={{
                padding: "0.75rem 1.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.headingFont,
                fontSize: "1.1rem",
                letterSpacing: "0.08em",
                color: activeTab === i ? sd.color : C.textMuted,
                borderBottom: activeTab === i ? `2px solid ${sd.color}` : "2px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-1px",
              }}
            >
              {sd.name}
            </button>
          ))}
        </div>
      </div>

      {/* Studio detail */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem 4rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: s.color, letterSpacing: "0.04em" }}>{s.name}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: s.color, border: `1px solid ${s.color}55`, padding: "0.2rem 0.7rem", borderRadius: "4px", fontWeight: 700 }}>{s.tag}</span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Surface</div>
                    <div style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.04em" }}>{s.size}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tarif</div>
                    <div style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: s.color, letterSpacing: "0.04em" }}>{s.rate}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Console</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.text, fontWeight: 600 }}>{s.console}</div>
                  </div>
                </div>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.85, marginBottom: "2rem" }}>{s.desc}</p>
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                  <img src={s.img} alt={s.name} loading="lazy" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.bg}88, transparent)` }} />
                </div>
              </div>
              {/* Right — gear grid */}
              <div>
                <h3 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>ÉQUIPEMENT INCLUS</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "2.5rem" }}>
                  {s.gear.map((item) => (
                    <div key={item} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "0.75rem 0.9rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
                  <div
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: s.color, color: C.white, padding: "0.9rem 2rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.9rem", boxShadow: `0 4px 20px ${s.color}33`, letterSpacing: "0.02em" }}
                  >
                    <Calendar size={15} /> Réserver {s.name} <ArrowRight size={15} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Outboard section */}
      <div style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Outboard</span>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 2.5rem" }}>NOTRE ARSENAL</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "1.25rem" }}>
            {outboard.map((o) => (
              <div key={o.brand} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.5rem" }}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1rem" }}>{o.brand}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {o.items.map((item) => (
                    <li key={item} style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, padding: "0.35rem 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
