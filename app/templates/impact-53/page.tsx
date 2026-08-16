"use client";
import { resolveList } from "@/lib/templates/resolveList";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  C,
  FONT_SYNE,
  FONT_MONO,
  PROJECTS,
  STATS,
  HeroWordReveal,
  MarqueeBelt,
  MagneticCTA,
  ProjectAccordion,
  StatCounter,
  SectionLabel,
  SectionHeading,
} from "./shared";
import { DWELL, useSlides, BentoCascade, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { DifferentialExit } from "@/lib/templates/hero-kit-3";
import {
  clientAccrocheRestante,
  clientCity,
  clientList,
  clientName,
  clientReviews,
  clientServices,
  clientTagline,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { code: "01", title: "Brand Identity Systems", desc: "We architect brands as living systems — visual languages that scale from a favicon to a billboard without losing their DNA. Logo, typography, motion language, editorial system." },
              { code: "02", title: "Digital Experience Design", desc: "High-contrast, high-performance web experiences. Micro-interactions, scroll-driven animations, WebGL environments — designed to arrest attention and convert intent." },
              { code: "03", title: "Creative Direction", desc: "For studios, labels, and founders who need vision without compromise. We embed in your team as a fractional creative director — strategy, art direction, production oversight." },
              { code: "04", title: "Front-End Engineering", desc: "We build what we design. React, Next.js, Three.js, GSAP — production-ready implementations with CI/CD, performance budgets, and accessibility baked in." },
              { code: "05", title: "Campaign Architecture", desc: "Multi-touchpoint campaign systems for product launches and cultural moments. We design the logic before the aesthetics: message architecture, channel mapping, content systems." },
              { code: "06", title: "Motion & Film", desc: "From identity animations to short-form films. We direct and produce motion content from concept to delivery — titles, brand films, social content series." }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;

/* BentoCascade in a template that ships zero photography: the tiles are
   typographic — discipline, index, a red verb — in the studio's own
   black/white/red. The cascade empties and refills them per discipline. */
const HERO_DISCIPLINES = [
  { verb: "BREAK.", field: "BRAND\nIDENTITY", mono: "research / naming / systems", n: "01" },
  { verb: "BUILD.", field: "DIGITAL\nPRODUCT", mono: "web / app / commerce", n: "02" },
  { verb: "SHIP.", field: "MOTION &\nFRONT-END", mono: "webgl / rive / belts", n: "03" },
];


function HeroBento({ i }: { i: number }) {
  const d = HERO_DISCIPLINES[i];
  const cell = (bg: string, color: string, pad = "1.1rem") => ({
    background: bg, color, padding: pad, height: "100%", display: "flex",
    flexDirection: "column" as const, justifyContent: "flex-end" as const,
  });
  return (
    <BentoCascade
      index={i}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        gridTemplateRows: "repeat(3, minmax(72px, 1fr))",
        gap: "6px",
        width: "100%",
        maxWidth: 440,
        aspectRatio: "1 / 1",
      }}
      tiles={[
        {
          area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
          node: (
            <div style={cell("rgba(255,255,255,0.06)", C.white, "1.3rem")}>
              {/* « PRODUCT » sortait de sa cellule de soixante-neuf pixels : le saut de
                  ligne forcé impose la coupe, mais rien ne bornait la largeur. */}
              <span style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "clamp(1.6rem,2.6vw,2.4rem)", lineHeight: 0.95, whiteSpace: "pre-line", letterSpacing: "-0.03em", maxWidth: "100%", overflowWrap: "anywhere" }}>
                {d.field}
              </span>
            </div>
          ),
        },
        {
          area: { gridColumn: "3", gridRow: "1" },
          node: (
            <div style={cell("transparent", "rgba(255,255,255,0.35)")}>
              <span style={{ fontFamily: FONT_MONO, fontSize: "1.6rem" }}>{d.n}</span>
            </div>
          ),
        },
        {
          area: { gridColumn: "3", gridRow: "2 / span 2" },
          node: (
            <div style={{ ...cell(C.red, "#000"), justifyContent: "center" }}>
              <span style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "clamp(1rem,1.6vw,1.4rem)", letterSpacing: "-0.02em", writingMode: "vertical-rl" }}>
                {d.verb}
              </span>
            </div>
          ),
        },
        {
          area: { gridColumn: "1 / span 2", gridRow: "3" },
          node: (
            <div style={{ ...cell("transparent", "rgba(255,255,255,0.45)"), border: "1px solid rgba(255,255,255,0.14)" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{d.mono}</span>
            </div>
          ),
        },
      ]}
    />
  );
}

export default function Impact53Page() {
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


  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      title: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_DISCIPLINES.length, DWELL.normal);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div
      ref={containerRef}
      style={{
        background: C.black,
        color: C.white,
        fontFamily: FONT_SYNE,
      }}
    >
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.black,
          overflow: "hidden",
          padding: "0 2.5rem",
        }}
      >
        <TitreDeLaPage session={sessionData} />
        <motion.div
          className="i53-hero-grid"
          style={{ y: heroY, opacity: heroOpacity, textAlign: "left", zIndex: 10, width: "100%", maxWidth: "1280px", display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(2rem,5vw,5rem)", alignItems: "center" }}
        >
          <div>
          {/* three planes, three scroll speeds (v04): the depth is what makes
              the page feel deep, not a drop shadow */}
          <DifferentialExit depth={0.15}>
          <div style={{ marginBottom: "clamp(1rem,3vw,2rem)" }}>
            <HeroWordReveal />
          </div>
          </DifferentialExit>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              fontSize: "0.85rem",
              fontFamily: FONT_MONO,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.45)",
              maxWidth: "500px",
              margin: "0 0 clamp(1.5rem,4vw,3.5rem)",
              lineHeight: 1.8,
            }}
          >{c?.aboutText ?? <>
            WE ARE A HIGH-CONTRAST CREATIVE STUDIO. WE ARCHITECT DIGITAL SYSTEMS,
            BRAND IDENTITIES, AND EXPERIMENTAL FRONT-END BELTS.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <MagneticCTA />
          </motion.div>
          </div>

          {/* the cascading bento, with its own hands */}
          <motion.div
            className="i53-hero-bento"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.9rem" }}
          >
            <DifferentialExit depth={0.85}>
            <HeroBento i={heroI} />
            </DifferentialExit>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <SlideIndex i={heroI} total={HERO_DISCIPLINES.length} variant="fraction" className="" color="rgba(255,255,255,0.5)" />
              <HairlineArrows onPrev={heroPrev} onNext={heroNext} color="rgba(255,255,255,0.6)" labels={{ prev: "Previous discipline", next: "Next discipline" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* two columns collapse under lg; the bento follows the title */}
        <style>{`@media (max-width: 1023px) {
          .i53-hero-grid { grid-template-columns: minmax(0,1fr) !important; }
          .i53-hero-bento { align-items: flex-start !important; }
        }`}</style>
      </section>

      {/* ── ROTATING MARQUEE BELT ────────────────────────────────────────── */}
      <MarqueeBelt />

      {/* ── SELECTED WORKS (ACCORDION) ────────────────────────────────────── */}
      <section
        id="work"
        style={{
          background: C.black,
          padding: "8rem 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>{/* TEXTE_SECTION */ clientText(sessionData, "work.texte") ?? (<>SELECTED PORTFOLIO</>)}</SectionLabel>
            <SectionHeading>{/* TEXTE_SECTION */ clientText(sessionData, "work.texte-2") ?? (<>PROJECTS</>)}</SectionHeading>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.dim}` }}>
          {PROJECTS.map((project) => (
            <ProjectAccordion key={project.num} project={project} />
          ))}
        </div>
      </section>

      {/* ── STATISTICS / NUMBERS ─────────────────────────────────────────── */}
      <section
        style={{
          background: C.black,
          borderTop: `1px solid ${C.dim}`,
          borderBottom: `1px solid ${C.dim}`,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          }}
          className="grid grid-cols-1 md:grid-cols-4"
        >
          {STATS.map((stat, idx) => (
            <StatCounter key={stat.label} stat={stat} index={idx} />
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "8rem 2.5rem", borderTop: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>WHAT WE DO</SectionLabel>
            <SectionHeading>{tr({ formData: fd }, "SERVICES")}</SectionHeading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {PRESTATIONS_INLINE.map((s, i) => (
              <div key={s.code} style={{ background: C.black, padding: "3rem 2.5rem", borderBottom: `1px solid ${C.dim}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", marginBottom: "1.5rem" }}>{s.code} //</div>
                <h3 style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.9, letterSpacing: "0.03em" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "8rem 2.5rem", borderTop: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>CLIENT WORDS //</div>
            <h2 style={{ fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "clamp(2.5rem,6vw,5rem)", color: C.white, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.03em" }}>{/* ACCROCHE */ clientAccrocheRestante(sessionData) ?? (<>WHAT THEY<br />SAY.</>)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {[
              { quote: "They told us the concept was impossible. Void delivered it in 6 weeks. The brand now leads every category benchmark we track.", client: "CEO · Phantom Records", mark: "01" },
              { quote: "We briefed three agencies. Void came back with something that scared us a little — and then it became our most successful campaign to date.", client: "CMO · Atlas Ventures", mark: "02" },
              { quote: "The code they wrote is the first thing our engineers didn't immediately want to rewrite. That's the highest compliment in our stack.", client: "CTO · Nova Systems", mark: "03" },
            ].map((t) => (
              <div key={t.mark} style={{ background: C.black, padding: "3.5rem 2.5rem", borderBottom: `1px solid ${C.dim}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", marginBottom: "2rem" }}>{t.mark} //</div>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, letterSpacing: "0.03em", marginBottom: "2rem", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ fontFamily: FONT_SYNE, fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ──────────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "6rem 2.5rem", borderTop: `1px solid ${C.dim}`, borderBottom: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "4rem" }}>SELECT CLIENTS //</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {/* LISTE_LIBELLES */ (clientList(sessionData, "bloc.liste1") ?? ["PHANTOM", "ATLAS CO.", "NOVA SYS", "MERIDIAN", "CIPHER", "HELIX"]).map((name) => (
              <div key={name} style={{ background: C.black, padding: "2.5rem 2rem", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_SYNE, fontSize: "0.75rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: C.red, padding: "10rem 2.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: "rgba(0,0,0,0.5)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "2rem" }}>NEW BRIEF</div>
          <h2 style={{ fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "clamp(3rem,8vw,7rem)", color: C.black, textTransform: "uppercase", lineHeight: 0.95, marginBottom: "3rem", letterSpacing: "-0.02em" }}>{c?.aboutTitle ?? fd?.businessName ?? <>LET'S BUILD<br />SOMETHING<br />WRONG.</>}</h2>
          <p style={{ fontFamily: FONT_MONO, fontSize: "0.8rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.9, marginBottom: "3.5rem", letterSpacing: "0.05em" }}>
            We work with a limited number of clients per quarter.<br />
            If you have a brief that scares you a little, we want to hear it.
          </p>
          <a href="/templates/impact-53/contact" style={{ display: "inline-block", background: C.black, color: C.red, padding: "1.2rem 3.5rem", fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}>START A PROJECT →</a>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "impact-53"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
