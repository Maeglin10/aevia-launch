"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  AWARDS,
  C,
  COLLECTIONS,
  HERITAGE,
  OrbitalComplication,
  PRESS,
  SectionLabel,
  StatNumber,
  rafraichirPartage,
} from "./shared";
import { AnimatePresence } from "framer-motion";
import {
  useHeroSelector, GhostMark, Rise, SelectorRail,
  heroSectionStyle, railResponsiveCSS, alpha, EASE_3, EASE_4, BEAT,
} from "@/lib/templates/hero-kit";
import {
  clientCity,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientReviews,
  clientServices,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

function HeroWatch() {
  const pieces = COLLECTIONS.slice(0, 5);
  const { active, paused, pick, hold, reduce } = useHeroSelector(pieces.length, 7500);
  const w: any = pieces[active % pieces.length];
  /* Each piece carries its own accent, so the hero re-tints per selection
     rather than presenting every watch in the same light. */
  const accent = w.accent || C.gold;

  const SERIF = "'Cormorant Garamond', Georgia, serif";
  const SANS = "'EB Garamond', Georgia, serif";

  const specs = [
    { k: "Mouvement", v: w.movement },
    { k: "Boîtier", v: w.case },
    { k: "Étanchéité", v: w.water },
  ];

  return (
    <section id="hero" style={heroSectionStyle(C.bg, { bottomRail: true, topOffset: 70 })}>
      {/* A single tinted glow rather than a photographic scrim — the product
          shot has to sit on near-black for the metal to read. */}
      <motion.div
        aria-hidden
        key={`glow-${active}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_3 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(58% 55% at 72% 46%, ${alpha(accent, 18)} 0%, transparent 62%)`,
        }}
      />

      <GhostMark color={accent} font={SERIF} side="left" opacity={0.05} size="clamp(150px, 27vw, 400px)">
        {w.ref?.split("-")[1] ?? String(active + 1).padStart(2, "0")}
      </GhostMark>

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div className="imx63-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <Rise beat="first" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <motion.span
                animate={{ background: accent }}
                transition={{ duration: 0.8, ease: EASE_3 }}
                style={{ width: 44, height: 1, display: "block" }}
              />
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase", color: C.textMuted }}>{clientEyebrow(sessionData) ?? "Manufacture · Vallée de Joux"}</span>
            </Rise>

            <motion.h1
              initial={{ opacity: 0, rotateY: reduce ? 0 : -12, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, rotateY: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, ease: EASE_4 }}
              style={{ fontFamily: SERIF, fontSize: "clamp(40px, 5vw, 74px)", fontWeight: 300, color: C.text, lineHeight: 1.04, margin: "0 0 16px", transformOrigin: "left center" }}
            >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>{<>{clientHeroLine(sessionData, 0, 2, 14) ?? "Le temps comme"}<br /><em style={{ fontStyle: "italic", color: C.gold }}>{clientHeroLine(sessionData, 1, 2, 14) ?? "philosophie"}</em>
            </>}</>)}</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_3, delay: BEAT.second }}
              className="hero-lede"
              style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, lineHeight: 1.8, maxWidth: 430, margin: "0 0 30px" }}
            >{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
              Six calibres manufacture, assemblés à la main, réglés sur cinq positions. Aucune pièce ne quitte l’atelier avant quarante jours d’observation.
            </>}</motion.p>

            {/* The piece — driven by the rail */}
            <div className="hero-detail" style={{ minHeight: 172, marginBottom: 26 }}>
              <AnimatePresence mode="wait">
                <motion.div key={active}>
                  <Rise beat="second" duration={0.42}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontFamily: SERIF, fontSize: 27, color: C.text, fontWeight: 400 }}>{w.name}</span>
                      <motion.span
                        animate={{ color: accent }}
                        transition={{ duration: 0.6 }}
                        style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase" }}
                      >
                        {w.category}
                      </motion.span>
                    </div>
                  </Rise>
                  <Rise beat="second" duration={0.46}>
                    <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", color: C.textDim, marginBottom: 16 }}>
                      Réf. {w.ref}
                    </div>
                  </Rise>
                  <Rise beat="second" duration={0.5}>
                    <div className="hero-secondary" style={{ display: "grid", gap: 7, marginBottom: 16, maxWidth: 430 }}>
                      {specs.map((s) => (
                        <div key={s.k} style={{ display: "flex", gap: 14, alignItems: "baseline", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
                          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textDim, minWidth: 92 }}>{s.k}</span>
                          <span style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, overflowWrap: "anywhere" }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </Rise>
                  <Rise beat="third" duration={0.45}>
                    <div style={{ fontFamily: SERIF, fontSize: 24, color: C.text }}>{w.price}</div>
                  </Rise>
                </motion.div>
              </AnimatePresence>
            </div>

            <Rise beat="third" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/templates/impact-63/contact" style={{ textDecoration: "none" }}>
                <motion.span
                  animate={{ background: accent }}
                  transition={{ duration: 0.8, ease: EASE_3 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.bg, padding: "15px 32px", fontFamily: SANS, fontWeight: 600, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", minHeight: 44 }}
                >
                  Prendre rendez-vous
                </motion.span>
              </Link>
              <Link href="/templates/impact-63/collections" style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.text, border: `1px solid ${C.border}`, padding: "15px 32px", fontFamily: SANS, fontWeight: 400, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", minHeight: 44 }}>
                  La collection
                </span>
              </Link>
            </Rise>
          </div>

          {/* The object itself. No crop, no scrim: a product shot, lit. */}
          <div className="imx63-object" style={{ position: "relative", minWidth: 0, aspectRatio: "1/1" }}>
            <AnimatePresence mode="sync">
              <motion.img
                key={w.image}
                src={fd?.photoUrls?.[active] || w.image}
                alt={`${w.name} — réf. ${w.ref}`}
                initial={{ opacity: 0, scale: 1.06, rotateY: reduce ? 0 : 12 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: EASE_3 } }}
                transition={{ duration: 1.0, ease: EASE_4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SelectorRail
        items={pieces}
        active={active}
        onPick={pick}
        onHold={hold}
        accent={accent}
        fg={C.text}
        serif={SERIF}
        sans={SANS}
        paused={paused}
        reduce={reduce}
        intervalMs={7500}
        bg={C.bg}
        id="hero"
        label={(x: any) => x.name}
        sublabel={(x: any) => x.price}
      />

      <style>{`
        ${railResponsiveCSS("hero", { titleClamp: "clamp(32px, 9vw, 44px)" })}
        @media (max-width: 900px) {
          .imx63-split { grid-template-columns: 1fr !important; }
          .imx63-object { display: none !important; }
        }
      `}</style>
    </section>
  );
}



function CarteCollection({ col, i }: { col: any; i: number }) {

              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={col.id}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  style={{ background: C.bgCard, position: "relative", overflow: "hidden", cursor: "pointer" }}
                >
                  <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                    <img
                      src={col.image}
                      alt={col.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3) brightness(0.85)", transition: "transform 0.8s, filter 0.8s" }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.05)"; (e.target as HTMLImageElement).style.filter = "grayscale(0) brightness(1)"; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; (e.target as HTMLImageElement).style.filter = "grayscale(0.3) brightness(0.85)"; }}
                    />
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(14,12,10,0.85)", padding: "2px 8px" }}>
                      <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.goldDim }}>{col.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{ padding: "1.75rem 2rem", borderTop: `1px solid ${C.borderGold}` }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: C.text, marginBottom: "0.3rem" }}>{col.name}</h3>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: C.textDim, marginBottom: "1rem" }}>{col.ref}</div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, marginBottom: "1.25rem" }}>{col.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300, color: C.gold }}>{col.price}</span>
                      <Link href="/templates/impact-63/collections" style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.goldDim, textDecoration: "none" }}>
                        CONSULTER →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
}

export default function MaisonDrouetHome() {
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
  rafraichirPartage();
  c = session?.generatedContent;


  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 0;
    const _photoArrays: any[] = [COLLECTIONS];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100dvh",
      }}
    >
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Hero — the watch is the hero.

          Fourth kit composition. The mechanic unique to this one: every piece
          in COLLECTIONS carries its own `accent` colour, so selecting a watch
          re-tints the whole hero — rule, reference, specs and glow. A house
          that sells one object at a time should not present them all in the
          same light. */}
      <HeroWatch />


      {/* Stats */}
      <section style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgSection }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
          <StatNumber value="133" label="Années d'histoire" />
          <StatNumber value="23" label="Maîtres-horlogers" />
          <StatNumber value="4,200" label="Pièces par an" />
          <StatNumber value="47" label="Distinctions" />
        </div>
      </section>

      {/* Heritage timeline */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>Notre Patrimoine</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
              133 Ans<br /><em style={{ color: C.gold }}>de Continuité</em>
            </>)}</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "6rem", top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg, transparent, ${C.border} 10%, ${C.border} 90%, transparent)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {HERITAGE.map((event, i) => {
                const ref = useRef<HTMLDivElement>(null);
                const inView = useInView(ref, { once: true, margin: "-100px" });
                return (
                  <motion.div
                    key={event.year}
                    ref={ref}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "grid", gridTemplateColumns: "6rem 1fr", gap: "3rem", paddingBottom: "3.5rem", paddingTop: "0.5rem", position: "relative" }}
                  >
                    <div style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: C.gold }}>{event.year}</div>
                      <div style={{ position: "absolute", left: "calc(6rem - 3px)", top: "0.4rem", width: "7px", height: "7px", borderRadius: "50%", background: C.gold, border: `2px solid ${C.bgSection}` }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{event.title}</div>
                      <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "60ch" }}>{event.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>Nos Garde-Temps</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
              Les Collections<br /><em style={{ color: C.gold }}>{clientName(sessionData) ?? "Maison Drouet"}</em>
            </>)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "2px", background: C.border }}>
            {COLLECTIONS.map((col, i) => (
              <CarteCollection key={col.id ?? i} col={col} i={i} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Link href="/templates/impact-63/collections" style={{ textDecoration: "none" }}>
              <motion.button
                type="button"
                whileHover={{ borderColor: C.gold, color: C.gold }}
                style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.9rem 2.5rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", transition: "all 0.3s" }}
              >
                VOIR TOUTES LES COLLECTIONS
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Bespoke */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Commande Privée</SectionLabel>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.2, paddingBottom: "0.15em", marginBottom: "1.5rem" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>{c?.aboutTitle ?? fd?.businessName ?? <>
            Une Montre<br /><em style={{ color: C.gold }}>Créée Pour Vous</em>
          </>}</>)}</h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: C.textMuted, lineHeight: 1.8, maxWidth: "50ch", margin: "0 auto 2.5rem" }}>{c?.aboutText ?? <>
            Chaque maison Drouet Bespoke commence par une conversation. Un maître-horloger, votre vision, 14 mois de fabrication. La montre que vous transmettrez.
          </>}</p>
          <Link href="/templates/impact-63/atelier" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
              whileTap={{ scale: 0.98 }}
              style={{ background: C.gold, color: C.bg, border: "none", padding: "0.9rem 2.5rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", transition: "background 0.3s" }}
            >
              PRENDRE RENDEZ-VOUS
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Press */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>Presse & Distinctions</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Ce Que l'On Dit<br /><em style={{ color: C.gold }}>de Drouet</em>
            </>)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "2px", background: C.border, marginBottom: "4rem" }}>
            {PRESS.map((item, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{ background: C.bg, padding: "2.5rem" }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: C.goldDim, lineHeight: 1, marginBottom: "1rem" }}>&quot;</div>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: C.text, lineHeight: 1.75, marginBottom: "1.5rem" }}>{item.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "1.5rem", height: "1px", background: C.goldDim }} />
                    <div>
                      <div style={{ fontSize: "0.8rem", color: C.text }}>{item.author}</div>
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textMuted }}>{item.outlet} · {item.year}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
            {(clientName(sessionData) ? [] : AWARDS).map((award) => (
              <div key={award} style={{ textAlign: "center" }}>
                <div style={{ width: "2px", height: "1.5rem", background: C.goldDim, margin: "0 auto 0.75rem" }} />
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textMuted }}>{award}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "Maison Drouet"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
