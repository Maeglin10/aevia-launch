"use client";
import { resolveList } from "@/lib/templates/resolveList";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { C, STATS, OrbitCenter, AnimatedCounter } from "./shared";

import "../premium.css";
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { num: "01", title: "Brand Strategy", desc: "Positioning, naming, messaging architecture, and competitive landscaping. We build the logic before the aesthetics." },
              { num: "02", title: "Visual Identity", desc: "Logo, type system, color, motion principles, and brand guidelines that hold up from a business card to a stadium banner." },
              { num: "03", title: "Digital Experience", desc: "Websites and interactive platforms that convert intent. Performance-first, scroll-driven, and designed to be remembered." },
              { num: "04", title: "Art Direction", desc: "Campaign concepting, editorial systems, and production oversight for brand moments that have to land perfectly." },
              { num: "05", title: "Packaging Design", desc: "Retail presence that earns shelf space. We design for attention at 2 meters and delight at 20 centimeters." },
              { num: "06", title: "Brand Architecture", desc: "Multi-brand and sub-brand hierarchies that scale without cannibalizing. Built for acquirers and acquirees alike." }
];
let STATS_INLINE = STATS_INLINE_SOURCE;


// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { num: "01", name: "Solstice Energy", cat: "Brand Identity · Digital", desc: "Complete brand redesign for a €2B clean energy challenger entering 8 European markets.", year: "2025" },
              { num: "02", name: "Maison Obrecht", cat: "Visual Identity · Packaging", desc: "Heritage repositioning for a 4th-generation Alsatian wine domaine targeting international collectors.", year: "2024" },
              { num: "03", name: "FORM Studio", cat: "Website · Art Direction", desc: "Digital experience for the Brutalist architecture studio behind the Prix d'Architecture 2024 laureate.", year: "2024" },
              { num: "04", name: "Kova Athletics", cat: "Brand System · Campaign", desc: "Full brand system and launch campaign for a DTC athletic brand hitting €1.2M GMV in month one.", year: "2023" }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;


export default function OrbitHomePage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  sessionData = session;
  memoriserSession(sessionData);
  c = session?.generatedContent;

  STATS_INLINE = resolveList(

    clientStats(sessionData)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      num: s.value,

      title: s.label,

    })),

    STATS_INLINE_SOURCE,

  );


  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      name: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh" }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 40px 80px",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${C.border} 1px, transparent 1px),
              linear-gradient(90deg, ${C.border} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "80px",
              alignItems: "center",
              width: "100%",
            }}
            className="grid-hero-68 imx-mobstack"
          >
            {/* Left — headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(52px, 7vw, 96px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                  color: C.text,
                  marginBottom: "32px",
                  paddingBottom: "0.15em",
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>{<>{clientHeroLine(sessionData, 0, 3, 11) ?? "Brands that"}<br />
                <span style={{ color: C.accent }}>{clientHeroLine(sessionData, 1, 3, 11) ?? "shift"}</span>
                <br />{clientHeroLine(sessionData, 2, 3, 11) ?? "perception."}</>}</>)}</motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(15px, 1.4vw, 18px)",
                  lineHeight: 1.7,
                  color: C.textMuted,
                  maxWidth: "480px",
                  marginBottom: "48px",
                }}
              >{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                We build identity systems for ambitious companies — from seed-stage startups to century-old maisons. Strategy, visual identity, and art direction that makes the right people stop scrolling.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
              >
                <Link
                  href="/templates/impact-68/work"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: C.white,
                    background: C.accent,
                    padding: "16px 32px",
                    textDecoration: "none",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "transform 0.15s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
                    (e.currentTarget as HTMLElement).style.background = C.accentDark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.background = C.accent;
                  }}
                >
                  View Our Work
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/templates/impact-68/contact"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: C.textMuted,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  {tr({ formData: fd }, "Get in touch")}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                style={{
                  marginTop: "64px",
                  paddingTop: "32px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  gap: "40px",
                }}
              >
                {/* LISTE_LIBELLES */ (clientList(sessionData, "bloc.liste1") ?? ["94 projects", "12 countries", "Est. 2015"]).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: C.textMuted,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Orbit signature element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0, 0, 1] }}
            >
              <OrbitCenter />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} style={{ color: C.textMuted }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "0",
          }}
          className="grid-stats-68"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "24px",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                textAlign: "left",
              }}
              className="border-right-none-68"
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                {stat.prefix}
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: C.text,
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  color: C.textMuted,
                }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ─── WORK ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} style={{ marginBottom: "5rem" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ display: "inline-block", width: "32px", height: "1px", background: C.accent }} />
              Selected Work
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
              94 brands.<br /><span style={{ color: C.accent }}>One obsession.</span>
            </>)}</h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: C.border }}>
            {PRESTATIONS_INLINE.map((w, i) => (
              <motion.div key={w.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
                <div
                  style={{ background: C.bgAlt, padding: "2.5rem", display: "grid", gridTemplateColumns: "64px 1fr 160px 80px", gap: "2rem", alignItems: "center", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.bg)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.bgAlt)}
                >
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: C.accent, fontWeight: 700, letterSpacing: "0.1em" }}>{w.num}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{w.name}</h3>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>{w.desc}</p>
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: C.textMuted, letterSpacing: "0.05em" }}>{w.cat}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: C.textMuted }}>{w.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}>
            <div style={{ marginTop: "2.5rem", textAlign: "right" }}>
              <Link href="/templates/impact-68/work" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 600, color: C.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", letterSpacing: "0.04em" }}>
                See all projects <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 2.5rem", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} style={{ marginBottom: "5rem" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ display: "inline-block", width: "32px", height: "1px", background: C.accent }} />
              Capabilities
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
              What we do<br />and <span style={{ color: C.accent }}>how we do it.</span>
            </>)}</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "2px", background: C.border }}>
            {STATS_INLINE.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
                <div style={{ background: C.bg, padding: "3rem 2.5rem", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", marginBottom: "1.5rem" }}>{s.num}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "10rem 2.5rem", background: C.accent, textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: C.white, opacity: 0.6, textTransform: "uppercase", marginBottom: "2rem" }}>
              New Brief
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: C.white, marginBottom: "2rem" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              Let's make<br />something<br />unforgettable.
            </>}</h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", color: C.white, opacity: 0.7, lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 3.5rem" }}>{c?.aboutText ?? <>
              We take on 6 projects per quarter. If your brief has ambition and your deadline has adrenaline, we want to hear it.
            </>}</p>
            <Link
              href="/templates/impact-68/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: C.white, color: C.accent, padding: "18px 44px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none", transition: "transform 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              Start a Project <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "impact-68"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
