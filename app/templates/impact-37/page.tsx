"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { Globe, Star, Check } from "lucide-react";
import Link from "next/link";
import {
  C,
  SERIF,
  SANS,
  WINE_REGIONS as WINE_REGIONS_DEMO,
  EVENTS,
  MEMBERSHIP_TIERS,
  TESTIMONIALS as TESTIMONIALS_DEMO,
  FAQS as FAQS_DEMO,
  WineBottleSVG,
  FAQItem,
  SectionReveal,
} from "./shared";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientFaq,
  clientName,
  clientPhotos,
  clientReviews,
  clientStats,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les
// saisir, le thème ne les lisait pas.
const STATS_INLINE_SOURCE = [
  { value: "280+", label: "Références en cave" },
                    { value: "12 ans", label: "Expérience MW" },
                    { value: "40+", label: "Vignerons partenaires" }
];
let STATS_INLINE = STATS_INLINE_SOURCE;

let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;


/* ════════════════════════════════════════════════════════════════════════════
   HERO — the wine list IS the hero.

   Five wines; picking one re-composes the whole stage. Motion vocabulary is
   deliberate (see docs/SLIDER_REVOLUTION_TEARDOWN.md):
   - power3/power4 inOut easings, not easeOut — slow start, real acceleration,
     settled landing. That is what reads as expensive.
   - entrances land on a strict 0 / 300 / 500ms grid instead of scattered delays,
     so the whole hero shares one rhythm.
   - layers arrive through a perspective container (rotateY/Z), so they come from
     depth rather than sliding up from the bottom.
   - a very slow ambient drift runs underneath the fast entrances.
   ════════════════════════════════════════════════════════════════════════════ */

const EASE_3: [number, number, number, number] = [0.65, 0, 0.35, 1]; // power3.inOut
const EASE_4: [number, number, number, number] = [0.76, 0, 0.24, 1]; // power4.inOut

function WINES_DEMO_LIVE() {
  return [
  {
    name: "Clos Ardent",
    vintage: "2018",
    region: "Saint-Émilion Grand Cru",
    grape: "Merlot · Cabernet Franc",
    note: "Cerise noire et cacao amer, une trame tannique serrée qui s'ouvre lentement. Le genre de bouteille qui impose le silence à table.",
    glass: "14",
    bottle: "78",
    img: (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/3820514/pexels-photo-3820514.jpeg?auto=compress&cs=tinysrgb&w=2000"),
  },
  {
    name: "Pierre Blanche",
    vintage: "2021",
    region: "Chablis Premier Cru",
    grape: "Chardonnay",
    note: "Tendu, salin, presque minéral. Une lame de citron confit sur un fond de craie — à boire face à des huîtres ou à personne.",
    glass: "12",
    bottle: "64",
    img: (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/11851422/pexels-photo-11851422.jpeg?auto=compress&cs=tinysrgb&w=2000"),
  },
  {
    name: "Nuit Rousse",
    vintage: "2019",
    region: "Côte-Rôtie",
    grape: "Syrah · Viognier",
    note: "Violette, poivre noir, lard fumé. Une syrah septentrionale qui garde de la retenue là où d'autres crient.",
    glass: "18",
    bottle: "96",
    img: (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/36826094/pexels-photo-36826094.jpeg?auto=compress&cs=tinysrgb&w=2000"),
  },
  {
    name: "Vent d'Ambre",
    vintage: "2016",
    region: "Jura — Vin Jaune",
    grape: "Savagnin",
    note: "Noix fraîche, curry doux, oxydation maîtrisée. Déroutant les dix premières secondes, inoubliable ensuite.",
    glass: "22",
    bottle: "128",
    img: (clientPhotos(sessionData)[3] || "https://images.pexels.com/photos/7372032/pexels-photo-7372032.jpeg?auto=compress&cs=tinysrgb&w=2000"),
  },
  {
    name: "Dernière Heure",
    vintage: "2012",
    region: "Champagne — Blanc de Noirs",
    grape: "Pinot Noir",
    note: "Brioche, pomme rôtie, une bulle si fine qu'elle disparaît. Notre bouteille de fin de service, celle qu'on ouvre pour rester.",
    glass: "26",
    bottle: "165",
    img: (clientPhotos(sessionData)[4] || "https://images.pexels.com/photos/30206422/pexels-photo-30206422.jpeg?auto=compress&cs=tinysrgb&w=2000"),
  },
];
}
let WINES_DEMO = WINES_DEMO_LIVE();

function WineHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const wines = resolveList(
    bp?.wines?.map((w: any, i: number) => ({
      ...WINES_DEMO[i % WINES_DEMO.length],
      name: w.name ?? WINES_DEMO[i % WINES_DEMO.length].name,
      note: w.description ?? WINES_DEMO[i % WINES_DEMO.length].note,
      glass: w.price ?? WINES_DEMO[i % WINES_DEMO.length].glass,
      img: w.imageUrl ?? WINES_DEMO[i % WINES_DEMO.length].img,
    })),
    WINES_DEMO
  );

  const wine = wines[active % wines.length];

  // Auto-advance, but never fight the visitor: any interaction pauses it.
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % wines.length), 7000);
    return () => clearTimeout(t);
  }, [active, paused, reduce, wines.length]);

  const pick = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "safe center",
        overflow: "hidden",
        background: C.burgundyDark,
        // depth for every layer inside — this is what makes entrances read as 3D
        perspective: "1400px",
        padding: "clamp(104px,14vh,150px) clamp(20px,5vw,72px) clamp(140px,18vh,180px)",
      }}
    >
      {/* ── Stage: photo cross-fade with a slow ambient drift ───────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={wine.img}
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{
            opacity: 1,
            scale: reduce ? 1.04 : [1.1, 1.02],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.1, ease: EASE_3 },
            scale: { duration: reduce ? 0 : 15, ease: "linear" },
          }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <img
            src={fd?.photoUrls?.[active] || wine.img}
            alt={`${wine.name} — ${wine.region}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scrims: keep the copy legible whatever the photo does */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(100deg, ${C.burgundyDark}fa 0%, ${C.burgundyDark}f0 34%, ${C.burgundyDark}a6 58%, ${C.burgundyDark}8c 78%, ${C.burgundyDark}e6 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(120% 90% at 20% 40%, transparent 30%, ${C.burgundyDark}b3 100%)`,
        }}
      />

      {/* ── Ghost vintage numeral — the ambient layer ───────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`v-${active}`}
          aria-hidden
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 0.07, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 1.4, ease: EASE_4 }}
          style={{
            position: "absolute",
            right: "-2%",
            top: "50%",
            translateY: "-50%",
            zIndex: 1,
            fontFamily: SERIF,
            fontSize: "clamp(180px, 34vw, 520px)",
            lineHeight: 0.8,
            color: C.gold,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {wine.vintage}
        </motion.div>
      </AnimatePresence>

      {/* ── Copy stack — everything lands on the 0 / 300 / 500ms grid ───────── */}
      <div style={{ position: "relative", zIndex: 3, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <AnimatePresence mode="wait">
          <motion.div key={`c-${active}`} style={{ maxWidth: 640 }}>
            {/* 0ms — region line */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: EASE_3 } }}
              transition={{ duration: 0.22, ease: EASE_3, delay: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}
            >
              <span style={{ width: 40, height: 1, background: C.gold, display: "block" }} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                {wine.region}
              </span>
            </motion.div>

            {/* 0ms — the name, wiped in through a clip mask + a touch of depth */}
            <motion.h1
              initial={{ opacity: 0, rotateY: reduce ? 0 : -14, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, rotateY: 0, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0, rotateY: reduce ? 0 : 10, clipPath: "inset(0 0 0 100%)", transition: { duration: 0.28, ease: EASE_4 } }}
              transition={{ duration: 0.75, ease: EASE_4 }}
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(46px, 7.5vw, 104px)",
                fontWeight: 700,
                lineHeight: 1.0,
                color: C.cream,
                margin: "0 0 8px",
                transformOrigin: "left center",
              }}
            >
              {active === 0 && c?.heroHeadline ? c.heroHeadline : wine.name}
            </motion.h1>

            {/* 300ms — grape + vintage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: EASE_3 } }}
              transition={{ duration: 0.45, ease: EASE_3, delay: 0.3 }}
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "clamp(17px, 2vw, 23px)",
                color: C.gold,
                marginBottom: 26,
              }}
            >
              {wine.grape} · {wine.vintage}
            </motion.div>

            {/* 300ms — tasting note */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: EASE_3 } }}
              transition={{ duration: 0.5, ease: EASE_3, delay: 0.3 }}
              style={{
                fontFamily: SANS,
                fontSize: 16,
                lineHeight: 1.85,
                fontWeight: 300,
                color: "rgba(253,246,236,0.74)",
                maxWidth: 470,
                marginBottom: 34,
              }}
            >
              {active === 0 && (fd?.tagline ?? c?.heroSubline) ? (c.heroSubline ?? fd.tagline) : wine.note}
            </motion.p>

            {/* 500ms — price + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.22, ease: EASE_3 } }}
              transition={{ duration: 0.5, ease: EASE_3, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: SERIF, fontSize: 34, color: C.cream }}>{wine.glass}€</span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(253,246,236,0.5)",
                  }}
                >
                  le verre · {wine.bottle}€ la bouteille
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/templates/impact-37/reservation" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "15px 30px",
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      minHeight: 44,
                    }}
                  >
                    Réserver une table
                  </span>
                </Link>
                <Link href="/templates/impact-37/carte" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      color: C.gold,
                      border: `1px solid ${C.gold}66`,
                      padding: "15px 30px",
                      fontFamily: SANS,
                      fontWeight: 400,
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      minHeight: 44,
                    }}
                  >
                    La carte complète
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── The rail: this is the wine list, and it is the navigation ───────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 4,
          borderTop: `1px solid ${C.gold}26`,
          background: `linear-gradient(to top, ${C.burgundyDark}f2, ${C.burgundyDark}00)`,
        }}
      >
        <div
          className="imx37-rail"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: `repeat(${wines.length}, minmax(0,1fr))`,
          }}
        >
          {wines.map((w: any, i: number) => {
            const on = i === active;
            return (
              <button
                key={w.name}
                onClick={() => pick(i)}
                onMouseEnter={() => setPaused(true)}
                aria-label={`Voir ${w.name}`}
                aria-current={on}
                style={{
                  position: "relative",
                  border: "none",
                  borderRight: i < wines.length - 1 ? `1px solid ${C.gold}1f` : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "20px clamp(10px,1.6vw,22px) 22px",
                  minHeight: 44,
                  transition: "background 600ms cubic-bezier(0.65,0,0.35,1)",
                  background: on ? `${C.gold}14` : "transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    color: on ? C.gold : "rgba(253,246,236,0.35)",
                    marginBottom: 7,
                    transition: "color 600ms",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="imx37-railname"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(13px,1.5vw,18px)",
                    lineHeight: 1.15,
                    color: on ? C.cream : "rgba(253,246,236,0.52)",
                    transition: "color 600ms",
                  }}
                >
                  {w.name}
                </div>
                {/* progress underline — also the "which one am I on" signal */}
                <motion.span
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={{ duration: on && !paused && !reduce ? 7 : 0.5, ease: on && !paused && !reduce ? "linear" : EASE_3 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    background: C.gold,
                    transformOrigin: "left center",
                    display: "block",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Below 640px five columns would be unreadable, so the rail scrolls
           horizontally instead of squeezing each wine into ~70px. */
        @media (max-width: 640px) {
          /* The rail is pinned to the section's bottom, so the section must not
             outgrow the viewport or the rail falls below the fold (measured:
             698px tall vs a 667px viewport before this). */
          #hero {
            padding-top: 88px !important;
            padding-bottom: 96px !important;
          }
          #hero h1 { font-size: clamp(38px, 11vw, 52px) !important; }
          .imx37-rail {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .imx37-rail > button {
            flex: 0 0 46%;
            scroll-snap-align: start;
          }
          .imx37-rail::-webkit-scrollbar { height: 0; }
        }
      `}</style>
    </section>
  );
}

export default function ClosDuSoirPage() {
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
    businessProfile?: any;
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;

  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  memoriserSession(sessionData);
  WINES_DEMO = WINES_DEMO_LIVE();

  STATS_INLINE = resolveList(

    clientStats(sessionData)?.map((s: any, i: number) => ({

      ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],

      value: s.value,

      label: s.label,

    })),

    STATS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Wine regions ← bp.menu grouped by category (real business menu) else demo
  const WINE_REGIONS = resolveList(
    bp?.menu
      ? (Object.values(
          (bp.menu as any[]).reduce((acc: any, m: any, i: number) => {
            const cat = m.category ?? "Sélection";
            if (!acc[cat]) {
              const d = WINE_REGIONS_DEMO[Object.keys(acc).length % WINE_REGIONS_DEMO.length];
              acc[cat] = { region: cat, flag: d.flag, description: d.description, selections: [] };
            }
            acc[cat].selections.push({
              name: m.name,
              grape: m.description ?? "",
              price: String(m.price ?? "").replace(/[^0-9.,]/g, ""),
              glass: true,
            });
            return acc;
          }, {})
        ) as any[])
      : undefined,
    WINE_REGIONS_DEMO
  );

  const TESTIMONIALS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      name: r.name,
      role: TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].role,
      avatar: String(r.name ?? "")
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      text: r.text,
      rating: r.stars ?? r.rating ?? 5,
    })),
    TESTIMONIALS_DEMO
  );

  const FAQS = resolveList(clientFaq(sessionData), FAQS_DEMO);

  return (
    <div style={{ overflowX: "clip", background: C.bg }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* HERO — the wine list is the hero (see WineHero above) */}
      <WineHero />

      {/* WINE LIST BY REGION */}
      <section
        style={{ padding: "100px 5%", background: C.bgAlt }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                La Carte des Vins
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 16,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                Curated from the world's finest regions
              </>}</h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textMuted,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >{c?.aboutText ?? <>
                Our 280-reference cellar is personally curated by Head Sommelier Claire Vidal MW. Updated seasonally with small-production gems.
              </>}</p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: 32,
            }}
          >
            {WINE_REGIONS.map((region, i) => (
              <SectionReveal key={region.region} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Globe size={16} color={C.gold} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.burgundy,
                      }}
                    >
                      {region.region}
                    </span>
                    <span
                      style={{
                        background: C.goldLight,
                        color: C.gold,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {region.flag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    {region.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {region.selections.map((wine: any, j: number) => (
                      <div
                        key={wine.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom:
                            j < region.selections.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: SERIF,
                              fontSize: 15,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {wine.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.textMuted,
                              marginTop: 2,
                              fontStyle: "italic",
                            }}
                          >
                            {wine.grape}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: SERIF,
                              fontSize: 18,
                              fontWeight: 700,
                              color: C.burgundy,
                            }}
                          >
                            {wine.price} €
                          </div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>
                            EUR / verre
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE — Sommelier story */}
      <section
        style={{ padding: "100px 5%", background: C.burgundy }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            <SectionReveal>
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 20,
                  }}
                >
                  L'Expérience
                </div>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 700,
                    color: C.cream,
                    lineHeight: 1.15,
                    marginBottom: 24,
                  }}
                >{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                  Guided by Claire Vidal,{" "}
                  <span style={{ fontStyle: "italic", color: C.rose }}>
                    Master of Wine
                  </span>
                </>)}</h2>
                <p
                  style={{fontSize: 16,
                    color: brand ?? 'var(--brand,#c4a882)',
                    lineHeight: 1.9,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  Claire spent a decade as a buyer for a Michelin three-star in Lyon before dedicating herself to a single vision: a wine bar where the story of every bottle is told with care.
                </p>
                <p
                  style={{fontSize: 16,
                    color: brand ?? 'var(--brand,#c4a882)',
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  Each evening at {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Clos du Soir"))}, she or one of her carefully trained team guides guests through the language of terroir, vintage, and winemaker intention — making every glass a conversation.
                </p>
                <div
                  style={{
                    marginTop: 36,
                    display: "flex",
                    gap: 40,
                  }}
                >
                  {STATS_INLINE.map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 32,
                          fontWeight: 700,
                          color: C.gold,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{fontSize: 13,
                          color: brand ?? 'var(--brand,#c4a882)',
                          marginTop: 4,
                          fontWeight: 300,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  padding: 36,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 24,
                  }}
                >
                  Une soirée au {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Clos du Soir"))}
                </div>
                {[
                  {
                    time: "19:00",
                    desc: "Arrivée — amuse-bouche de courtoisie et premier verre sélectionné par le sommelier",
                  },
                  {
                    time: "19:30",
                    desc: "Découverte de la carte avec les recommandations de notre équipe",
                  },
                  {
                    time: "20:30",
                    desc: "Vol d'initiation — dégustation comparative de 3 vins d'un même terroir",
                  },
                  {
                    time: "21:30",
                    desc: "Sélection cave — bouteilles à emporter à emporter avec conseil direct",
                  },
                  {
                    time: "22:30",
                    desc: "Dernier verre et départ avec votre bouteille coup de cœur",
                  },
                ].map((step, i) => (
                  <div
                    key={step.time}
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                      paddingBottom: 20,
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.gold,
                        flexShrink: 0,
                        width: 44,
                      }}
                    >
                      {step.time}
                    </div>
                    <div
                      style={{fontSize: 14,
                        color: brand ?? 'var(--brand,#c4a882)',
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* TASTING EVENTS */}
      <section
        style={{ padding: "100px 5%", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 14,
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
                Prochaines Dégustations
              </>)}</h2>
              <p
                style={{
                  fontSize: 15,
                  color: C.textMuted,
                  maxWidth: 440,
                  margin: "0 auto",
                  fontWeight: 300,
                }}
              >
                Intimate evenings curated for curiosity. Members receive priority booking.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
              gap: 20,
            }}
          >
            {EVENTS.map((ev, i) => (
              <SectionReveal key={ev.title} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 28,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    opacity: ev.sold ? 0.7 : 1,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: ev.sold ? C.border : C.goldLight,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: SERIF,
                      fontSize: 13,
                      fontWeight: 700,
                      color: ev.sold ? C.textMuted : C.burgundy,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: SERIF,
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                        }}
                      >
                        {ev.title}
                      </h3>
                      {ev.sold && (
                        <span
                          style={{
                            background: "#fef2f2",
                            color: "var(--brand-light,#dc2626)",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 2,
                            textTransform: "uppercase",
                          }}
                        >
                          Complet
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: C.textMuted,
                        lineHeight: 1.65,
                        marginBottom: 14,
                        fontWeight: 300,
                      }}
                    >
                      {ev.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: SERIF,
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.burgundy,
                          }}
                        >
                          {ev.price} €
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: ev.spots === 0 ? "var(--brand-light,#dc2626)" : C.gold,
                            fontWeight: 600,
                          }}
                        >
                          {ev.spots === 0
                            ? "Plus de places"
                            : `${ev.spots} places restantes`}
                        </span>
                      </div>
                      {!ev.sold && (
                        <Link href="/templates/impact-37/contact" style={{ textDecoration: "none" }}>
                          <span
                            style={{
                              background: C.burgundy,
                              color: C.cream,
                              padding: "8px 18px",
                              borderRadius: 2,
                              fontSize: 12,
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              fontFamily: SANS,
                            }}
                          >
                            Réserver
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
                Ce qu'en disent nos membres
              </>)}</h2>
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill={C.gold}
                        color={C.gold}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: C.text,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: C.goldLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.burgundy,
                        flexShrink: 0,
                        fontFamily: SERIF,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontWeight: 700,
                          fontSize: 15,
                          color: C.burgundy,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: C.textMuted }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section
        style={{ padding: "100px 5%", background: C.burgundyDark }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 16,
                }}
              >
                Adhésion
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px, 4vw, 50px)",
                  fontWeight: 700,
                  color: C.cream,
                  marginBottom: 16,
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
                Rejoignez le Club
              </>)}</h2>
              <p
                style={{fontSize: 15,
                  color: brand ?? 'var(--brand,#c4a882)',
                  maxWidth: 440,
                  margin: "0 auto",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Membership unlocks privileges, curated bottles, and a community of like-minded enthusiasts.
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 24,
            }}
          >
            {MEMBERSHIP_TIERS.map((tier, i) => (
              <SectionReveal key={tier.name} delay={i * 0.12}>
                <div
                  style={{
                    background: tier.highlight
                      ? C.burgundy
                      : "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    padding: 36,
                    border: tier.highlight
                      ? `2px solid ${C.gold}`
                      : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: C.gold,
                        color: C.burgundyDark,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Recommandé
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 28,
                      fontWeight: 700,
                      color: tier.color,
                      marginBottom: 6,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div
                    style={{fontSize: 12,
                      color: brand ?? 'var(--brand,#c4a882)',
                      fontStyle: "italic",
                      marginBottom: 20,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tier.tagline}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 44,
                        fontWeight: 700,
                        color: C.cream,
                      }}
                    >
                      {tier.price} €
                    </span>
                    <span
                      style={{fontSize: 14,
                        color: brand ?? 'var(--brand,#c4a882)',
                        marginLeft: 4,
                      }}
                    >
                      /{tier.period === "per month" ? "mois" : tier.period}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 28,
                    }}
                  >
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <Check
                          size={14}
                          color={C.gold}
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{fontSize: 13,
                            color: brand ?? 'var(--brand,#c4a882)',
                            lineHeight: 1.5,
                            fontWeight: 300,
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link href="/templates/impact-37/contact" style={{ textDecoration: "none" }}>
                    <span
                      style={{
                        width: "100%",
                        display: "block",
                        textAlign: "center",
                        background: tier.highlight ? C.gold : "transparent",
                        color: tier.highlight ? C.burgundyDark : C.gold,
                        padding: "14px 24px",
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        border: tier.highlight ? "none" : `1px solid ${C.gold}60`,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: SANS,
                      }}
                    >
                      Rejoindre {tier.name}
                    </span>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: C.burgundy,
                  marginBottom: 12,
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
                Questions Fréquentes
              </>)}</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.55 }}>
        {clientName(sessionData) ?? "impact-37"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
