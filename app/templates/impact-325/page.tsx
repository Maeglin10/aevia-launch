"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, Check, Clock, FileText, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "../LegalIdentity";
import { DWELL, ExpandFrame, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientHeroLine,
  clientHeroSubtitle,
  clientEyebrow,
  clientTrade,
  clientCertifications,
  clientCity,
  clientName,
  clientPhone,
  clientEmail,
  clientAddress,
  clientCodePostalVille,
  clientPhotos,
  clientServices,
  clientStats,
  clientTeam,
  clientWorks,
  clientList,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let sessionData: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   IMPACT-325 · EXECUTIVEHUB — séminaires corporate (masterclasses B2B)
   Réécriture premium — geste signature : ExpandFrame (le cadre qui s'ouvre).
   Héros H7 magazine : méta-rangée filée, titre serif géant, bandeau média bas.
   Fontes P2 : Playfair Display (serif) + Space Grotesk (sans).
   Signature : cadre qui s'ouvre · table de tarifs à lignes fines ·
   références en grille 56px/1fr. Palette claire #f7f7f4 / #1e3a8a.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Grotesk:wght@300;400;500;600&display=swap');`;

let C: Record<string, string> = {
  bg: "#f7f7f4",
  bgAlt: "#efefe9",
  bgDark: "#101a33",
  bgDarkAlt: "#0a1124",
  bgCard: "#ffffff",
  accent: "var(--brand,#1e3a8a)",
  accentDark: "var(--brand-light,#41599f)",
  accentLight: "#e4e8f3",
  ink: "#161a24",
  textMuted: "#4d5361",
  textFaint: "#8b8f99",
  border: "#dbdad0",
  white: "#ffffff",
  gold: "#9a7b2d", // clé métier : filets dorés du programme
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Space Grotesk', system-ui, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos — URLs existantes du thème, jamais d'URL inventée ────────────── */
const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // 0 bandeau média A
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // 1 volet corporate
  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 2 séminaire I (+ bandeau B)
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 3 séminaire II
  "https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 4 séminaire III (+ bandeau C)
  "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=800", // 5 séminaire IV
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // 6 intervenant 1
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // 7 intervenante 2
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Données de démonstration (contenu rédactionnel conservé) ────────────── */

const SEMINARS_SOURCE = [
  { id: "s1", num: "I", title: "Leadership Masterclass 2026", speaker: "Dr. Jonathan Hayes", date: "2026-09-10", dateLabel: "September 10, 2026", time: "09:00 – 17:00", venue: "Grand Hotel Paris", category: "Leadership", level: "Executive", price: 450, pi: 2 },
  { id: "s2", num: "II", title: "Future of AI in Business", speaker: "Sarah Chen", date: "2026-09-22", dateLabel: "September 22, 2026", time: "10:00 – 16:00", venue: "Tech Hub London", category: "Technology", level: "All Levels", price: 300, pi: 3 },
  { id: "s3", num: "III", title: "Advanced Financial Strategy", speaker: "Robert Sterling", date: "2026-10-05", dateLabel: "October 5, 2026", time: "09:00 – 18:00", venue: "Finance Center Frankfurt", category: "Finance", level: "Advanced", price: 600, pi: 4 },
  { id: "s4", num: "IV", title: "Strategic Marketing Summit", speaker: "Elena Rodriguez", date: "2026-10-15", dateLabel: "October 15, 2026", time: "09:30 – 15:30", venue: "Palais des Congrès", category: "Marketing", level: "Intermediate", price: 350, pi: 5 },
];

function SEMINARS_LIVE() {
  const ville = clientCity(sessionData);
  const base = SEMINARS_SOURCE.map((s) => ({
    ...s,
    venue: ville ? s.venue.replace("Paris", ville) : s.venue,
  }));
  return /* REALISATIONS */ resolveList(
    clientWorks(sessionData)?.map((o: any, i: number) => ({
      ...base[i % base.length],
      title: o.title ?? base[i % base.length].title,
      category: o.detail || base[i % base.length].category,
      ...(o.imageUrl ? { img: o.imageUrl } : {}),
    })),
    base,
  );
}
let SEMINARS = SEMINARS_LIVE();

/* Table des droits d'inscription — lignes fines. */
const TARIFS_SOURCE = [
  { k: "Leadership Masterclass 2026", eb: "$360", std: "$450", ex: "$675", n: "Executive level · Grand Hotel Paris" },
  { k: "Future of AI in Business", eb: "$240", std: "$300", ex: "$450", n: "All levels · Tech Hub London" },
  { k: "Advanced Financial Strategy", eb: "$480", std: "$600", ex: "$900", n: "Advanced · Finance Center Frankfurt" },
  { k: "Strategic Marketing Summit", eb: "$280", std: "$350", ex: "$525", n: "Intermediate · Palais des Congrès" },
];

function TARIFS_LIVE() {
  return resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      k: s.title ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].k,
      std: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].std,
      eb: s.price ? "− 20 %" : TARIFS_SOURCE[i % TARIFS_SOURCE.length].eb,
      ex: s.price ? "+ 50 %" : TARIFS_SOURCE[i % TARIFS_SOURCE.length].ex,
      n: s.description ?? s.desc ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
}
let TARIFS = TARIFS_LIVE();

const STATS_SOURCE = [
  { v: "50+", l: "Industry leaders" },
  { v: "200+", l: "Corporate partners" },
  { v: "12", l: "Global locations" },
  { v: "98%", l: "Satisfaction rate" },
];

function STATS_LIVE() {
  return resolveList(
    clientStats(sessionData)?.map((s: any) => ({ v: s.value, l: s.label })),
    STATS_SOURCE,
  );
}
let STATS = STATS_LIVE();

/* Références — les intervenants du programme, en grille 56px / 1fr. */
const REFS_SOURCE = [
  { name: "Dr. Jonathan Hayes", role: "Leadership Masterclass 2026", tag: "Leadership · Executive", pi: 6 },
  { name: "Sarah Chen", role: "Future of AI in Business", tag: "Technology · All levels", pi: 7 },
  { name: "Robert Sterling", role: "Advanced Financial Strategy", tag: "Finance · Advanced", pi: -1 },
  { name: "Elena Rodriguez", role: "Strategic Marketing Summit", tag: "Marketing · Intermediate", pi: -1 },
];

function REFS_LIVE() {
  return resolveList(
    clientTeam(sessionData)?.map((m: any, i: number) => ({
      ...REFS_SOURCE[i % REFS_SOURCE.length],
      name: m.name ?? REFS_SOURCE[i % REFS_SOURCE.length].name,
      role: m.role ?? REFS_SOURCE[i % REFS_SOURCE.length].role,
      ...(m.photoUrl ? { img: m.photoUrl } : {}),
    })),
    REFS_SOURCE,
  );
}
let REFS = REFS_LIVE();

const BULLETS_SOURCE = [
  "Customized curriculum alignment",
  "Volume licensing and group discounts",
  "Post-seminar implementation support",
  "Priority access to global industry experts",
];

function BULLETS_LIVE() {
  return resolveList(
    clientList(sessionData, "bloc.liste1") ?? clientCertifications(sessionData),
    BULLETS_SOURCE,
  );
}
let BULLETS = BULLETS_LIVE();

const PROGRAMS = ["Executive Leadership", "Financial Strategy", "Tech & Innovation", "Corporate Custom"];

const NAV = [
  { l: "Calendar", h: "#seminars" },
  { l: "Fees", h: "#fees" },
  { l: "Enterprises", h: "#corporate" },
  { l: "Speakers", h: "#speakers" },
  { l: "Contact", h: "#contact" },
];

/* ── Primitives ──────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.38em", textTransform: "uppercase", color, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function NavLink({ l, h }: { l: string; h: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", color: hov ? C.accent : C.textMuted, fontFamily: SANS, fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", padding: "12px 2px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 7, height: 1, width: hov ? "100%" : "0%", background: C.gold, transition: "width 0.5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Impact325ExecutiveHub() {
  const [session, setSession] = useState<any>(null);

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
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  SEMINARS = SEMINARS_LIVE();
  TARIFS = TARIFS_LIVE();
  STATS = STATS_LIVE();
  REFS = REFS_LIVE();
  BULLETS = BULLETS_LIVE();

  const businessName = fd?.businessName ?? (clientName(sessionData) ?? "ExecutiveHub");
  const ville = clientCity(sessionData) ?? "Paris";
  const mail = clientEmail(sessionData) || "contact@executivehub.example";
  const phone = clientPhone(sessionData);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaHov, setCtaHov] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Un seul index pilote tout le héros : le cadre qui s'ouvre et sa légende. */
  const BAND = [photo(0, FALLBACK_PHOTOS[0]), photo(2, FALLBACK_PHOTOS[2]), photo(4, FALLBACK_PHOTOS[4])];
  const { i: bandIdx, next, prev } = useSlides(BAND.length, DWELL.slow);
  const bandSem = SEMINARS[bandIdx % SEMINARS.length];

  const heroLigne1 = clientHeroLine(sessionData, 0, 2, 18);
  const heroLigne2 = clientHeroLine(sessionData, 1, 2, 18);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        @media (max-width: 900px) {
          .i325-navlinks { display: none !important; }
          .i325-burger { display: flex !important; }
        }
        @media (max-width: 860px) {
          .i325-meta { grid-template-columns: 1fr !important; row-gap: 0; }
          .i325-meta > div { border-right: none !important; border-bottom: 1px solid ${"#dbdad0"}; }
          .i325-feat { grid-template-columns: 1fr !important; }
          .i325-feat > * { order: initial !important; }
          .i325-split { grid-template-columns: 1fr !important; }
          .i325-split > * { order: initial !important; }
          .i325-herofoot { flex-direction: column; align-items: flex-start !important; gap: 16px; }
        }
      `}</style>

      {/* ── MASTHEAD — filet de tête façon revue ─────────────────────────── */}
      <div aria-hidden style={{ height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.gold}, transparent)` }} />

      {/* ── NAV — collante, 4 propriétés en transition ───────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: scrolled ? "12px clamp(20px,4.5vw,56px)" : "22px clamp(20px,4.5vw,56px)",
          background: scrolled ? "rgba(247,247,244,0.94)" : C.bg,
          backdropFilter: scrolled ? "blur(12px) saturate(120%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? "0 14px 34px -26px rgba(22,26,36,0.35)" : "none",
          transition: "padding 0.55s cubic-bezier(.16,1,.3,1), background 0.55s cubic-bezier(.16,1,.3,1), border-color 0.55s cubic-bezier(.16,1,.3,1), box-shadow 0.55s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "baseline", gap: 10, textDecoration: "none", minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={businessName} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block", alignSelf: "center" }} />
          ) : (
            <>
              <span style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{businessName}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.32em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap" }}>{clientTrade(sessionData) ?? "Executive seminars"}</span>
            </>
          )}
        </a>
        <div className="i325-navlinks" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,28px)" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} {...n} />
          ))}
          <a
            href="#contact"
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.white,
              background: ctaHov ? C.accentDark : C.accent,
              padding: "12px 22px",
              textDecoration: "none",
              transform: ctaHov ? "translateY(-2px)" : "none",
              boxShadow: ctaHov ? "0 14px 30px -14px rgba(30,58,138,0.55)" : "none",
              transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
            }}
          >
            Register
          </a>
        </div>
        <button
          className="i325-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "16px 26px 26px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => (
            <a key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "13px 0" }}>
              {n.l}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} style={{ background: C.accent, color: C.white, padding: "14px 24px", fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Register
          </a>
        </div>
      )}

      {/* ── HÉROS H7 magazine — méta-rangée, titre serif géant, bandeau bas ─ */}
      <header style={{ position: "relative", padding: "clamp(28px,4vw,56px) clamp(20px,4.5vw,56px) 0", maxWidth: 1280, margin: "0 auto" }}>
        {/* Méta-rangée filée */}
        <motion.div
          className="i325-meta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", borderTop: `1px solid ${C.ink}`, borderBottom: `1px solid ${C.border}` }}
        >
          <div style={{ padding: "14px clamp(2px,1vw,14px) 14px 0", borderRight: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textMuted }}>
            {clientEyebrow(sessionData) ?? `Executive seminars · ${ville}`}
          </div>
          <div style={{ padding: "14px clamp(10px,1.4vw,18px)", borderRight: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textMuted }}>
            Season 2026 · N° IV
          </div>
          <div style={{ padding: "14px 0 14px clamp(10px,1.4vw,18px)", fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.gold }}>
            Masterclasses &amp; corporate programs
          </div>
        </motion.div>

        {/* Titre serif géant */}
        <div style={{ position: "relative", padding: "clamp(40px,6vw,84px) 0 clamp(30px,4.4vw,58px)" }}>
          <span aria-hidden style={{ position: "absolute", top: "6%", right: "-2%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(120px,20vw,300px)", lineHeight: 1, color: "rgba(30,58,138,0.05)", pointerEvents: "none", userSelect: "none" }}>
            26
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.18 }}
            style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(2.7rem,7vw,6.6rem)", lineHeight: 0.99, letterSpacing: "-0.015em", color: C.ink, margin: 0, maxWidth: 980, position: "relative" }}
          >
            {heroLigne1 ?? (<>Elevate your</>)}
            <span style={{ display: "block" }}>
              {heroLigne2 ?? (<><em style={{ fontStyle: "italic", color: C.accent }}>corporate</em> strategy.</>)}
            </span>
          </motion.h1>
          <motion.div
            className="i325-herofoot"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.4 }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30, marginTop: "clamp(24px,3.4vw,44px)", flexWrap: "wrap" }}
          >
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15px,1.5vw,18px)", color: C.textMuted, maxWidth: 520, lineHeight: 1.75, margin: 0 }}>
              {clientHeroSubtitle(sessionData) ?? c?.heroText ?? "Join industry leaders in exclusive seminars designed for executives and visionaries. Equip your team with the knowledge to drive innovation and growth."}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <HeroCta href="#seminars" filled>
                View the calendar
              </HeroCta>
              <HeroCta href="#corporate">Corporate solutions</HeroCta>
            </div>
          </motion.div>
        </div>

        {/* Bandeau média bas — le cadre s'ouvre (ExpandFrame) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.55 }}>
          <div style={{ position: "relative", background: C.bgDark, overflow: "hidden" }}>
            <ExpandFrame
              src={BAND[bandIdx % BAND.length]}
              alt={`${businessName} — ${bandSem?.title ?? "seminar"}`}
              index={bandIdx}
              radius={0}
              className=""
            />
            {/* L'ExpandFrame est absolu : cette boîte donne la hauteur du bandeau. */}
            <div aria-hidden style={{ aspectRatio: "21/9", minHeight: 260 }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,17,36,0.55), transparent 45%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: "clamp(16px,2.4vw,32px)", bottom: "clamp(14px,2vw,26px)", color: C.white, maxWidth: "80%" }}>
              <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>{bandSem?.category}</div>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(18px,2.2vw,28px)", fontWeight: 500, lineHeight: 1.15 }}>{bandSem?.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 7 }}>
                {bandSem?.dateLabel} · {bandSem?.venue}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, borderBottom: `1px solid ${C.border}`, padding: "12px 2px 14px", flexWrap: "wrap" }}>
            <SlideIndex i={bandIdx} total={BAND.length} variant="flat" color={C.textFaint} className="" />
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>The frame opens on the next session</span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Previous session", next: "Next session" }} />
          </div>
        </motion.div>

        {/* Chiffres — rail fileté sous le bandeau */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px,100%),1fr))", gap: 0, padding: "clamp(8px,1vw,14px) 0 clamp(30px,4vw,54px)" }}>
          {STATS.map((s, idx) => (
            <Reveal key={`${s.l}-${idx}`} delay={idx * 0.08}>
              <div style={{ padding: "clamp(16px,2vw,26px) clamp(4px,1vw,18px) 0", borderLeft: idx > 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(26px,3vw,40px)", fontWeight: 500, color: C.accent, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint, marginTop: 9 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </header>

      {/* ── RESPIRATION ──────────────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, padding: "clamp(72px,10vw,140px) clamp(24px,7vw,120px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px,3vw,42px)", lineHeight: 1.42, color: C.ink, maxWidth: 900, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>Actionable insights and strategic frameworks — taught by the people who wrote them.</>)}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div aria-hidden style={{ width: 1, height: "clamp(48px,6vw,80px)", background: `linear-gradient(${C.gold}, transparent)`, margin: "clamp(28px,3.6vw,46px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── CALENDRIER — dossiers de séminaires en rangées magazine ──────── */}
      <section id="seminars" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Curriculum</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,58px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.01em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(30px,4.4vw,58px)", maxWidth: 760 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "seminars.titre") ?? (<>Upcoming <em style={{ fontStyle: "italic", color: C.accent }}>masterclasses.</em></>)}
            </h2>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.ink}` }}>
            {SEMINARS.map((s, idx) => (
              <SeminarFeature key={`${s.id}-${idx}`} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — table à lignes fines ────────────────────────────────── */}
      <section id="fees" style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "clamp(80px,10vw,140px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Registration fees</Kicker>
          </Reveal>
          <div className="i325-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,0.8fr)", gap: "clamp(20px,3vw,44px)", alignItems: "end", margin: "clamp(14px,2vw,22px) 0 clamp(30px,4vw,50px)" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.01em", color: C.ink, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>One page, <em style={{ fontStyle: "italic", color: C.accent }}>three seats.</em></>)}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (<>Early Bird closes thirty days before each session. Executive access includes priority seating and the private lunch. Prices before VAT (20 %).</>)}
            </p>
          </div>

          <Reveal delay={0.1}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontFamily: SANS }}>
                <thead>
                  <tr>
                    {["Seminar", "Early Bird — 20 %", "Standard", "Executive + 50 %"].map((h, j) => (
                      <th key={h} style={{ textAlign: j === 0 ? "left" : "right", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500, color: C.textFaint, padding: "0 clamp(8px,1.4vw,18px) 14px", borderBottom: `1px solid ${C.ink}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TARIFS.map((t, idx) => (
                    <TarifRow key={`${t.k}-${idx}`} t={t} />
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: C.bg, border: `1px solid ${C.border}`, padding: "clamp(16px,2vw,24px)", marginTop: "clamp(26px,3.4vw,40px)" }}>
              <FileText size={19} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                An invoice will be generated and sent to the provided email address upon confirmation. Payment terms are 30 days net. Volume licensing and centralized invoicing available for corporate accounts.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ENTREPRISES — volet corporate, cadre doré décalé ─────────────── */}
      <section id="corporate" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(20px,4.5vw,56px)" }}>
        <div className="i325-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px,5.5vw,84px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>For enterprises</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.8vw,48px)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.01em", color: C.ink, margin: "clamp(14px,2vw,20px) 0 clamp(16px,2vw,24px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>Transform your <em style={{ fontStyle: "italic", color: C.accent }}>leadership</em> team.</>)}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.8, maxWidth: 500, margin: "0 0 clamp(24px,3vw,36px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "corporate.texte") ?? (<>Our executive masterclasses are designed to provide actionable insights and strategic frameworks. We offer comprehensive corporate packages including private workshops, dedicated account management, and centralized invoicing.</>)}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 clamp(26px,3.4vw,40px)", display: "flex", flexDirection: "column", gap: 13 }}>
                {/* LISTE_LIBELLES */ BULLETS.map((b, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>{b}</span>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.accent}`, color: C.accent, padding: "14px 28px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none" }}>
                Request corporate brochure <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ position: "relative", padding: "clamp(14px,1.8vw,22px) clamp(14px,1.8vw,22px) 0 0" }}>
              <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: "88%", height: "92%", border: `1px solid ${C.gold}` }} />
              <div style={{ position: "relative", background: C.bgDark, overflow: "hidden" }}>
                {photo(1, FALLBACK_PHOTOS[1]) ? (
                  <img src={photo(1, FALLBACK_PHOTOS[1])} alt={`Corporate seminar — ${businessName}`} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                ) : (
                  <div aria-hidden style={{ aspectRatio: "4/3", background: `linear-gradient(150deg, ${C.bgDark}, ${C.bgDarkAlt})` }} />
                )}
                <div aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RÉFÉRENCES — intervenants en grille 56px / 1fr ───────────────── */}
      <section id="speakers" style={{ background: C.bgDark, padding: "clamp(80px,10vw,140px) clamp(20px,4.5vw,56px)", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", top: "-6%", right: "-2%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(140px,24vw,340px)", lineHeight: 1, color: "rgba(255,255,255,0.03)", pointerEvents: "none", userSelect: "none" }}>
          &amp;
        </span>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker color={C.gold}>References</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.01em", color: C.white, margin: "clamp(14px,2vw,22px) 0 clamp(30px,4vw,52px)", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "references.titre") ?? (<>Led by the <em style={{ fontStyle: "italic", color: C.gold }}>industry.</em></>)}
            </h2>
          </Reveal>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
            {REFS.map((r, idx) => (
              <RefRow key={`${r.name}-${idx}`} r={r} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(20px,4.5vw,56px)" }}>
        <div className="i325-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(36px,5vw,72px)", alignItems: "start" }}>
          <div>
            <Reveal>
              <Kicker>Contact</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.01em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(16px,2.2vw,26px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Reserve the <em style={{ fontStyle: "italic", color: C.accent }}>next seat.</em></>)}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.8, maxWidth: 460, margin: "0 0 clamp(26px,3.4vw,40px)" }}>
                Registrations are confirmed by email with the invoice and attendee access details. Group registrations and private workshops are quoted within one working day.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, padding: "16px 32px", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
                  <Mail size={16} /> Write to us
                </a>
                {phone && (
                  <a href={`tel:${phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`, color: C.ink, padding: "15px 30px", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}>
                    <Phone size={16} /> {phone}
                  </a>
                )}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: "clamp(20px,2.6vw,36px)", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <Mail size={15} color={C.accent} />, t: "Email", d: mail },
                { icon: <MapPin size={15} color={C.accent} />, t: "Address", d: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "75000", "Paris") },
                { icon: <Calendar size={15} color={C.accent} />, t: "Season", d: "September — October 2026, four sessions" },
                { icon: <Clock size={15} color={C.accent} />, t: "Invoicing", d: "Invoice on confirmation · payment terms 30 days net" },
              ].map((l) => (
                <div key={l.t} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span style={{ marginTop: 3 }}>{l.icon}</span>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginBottom: 5 }}>{l.t}</div>
                    <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, lineHeight: 1.6, overflowWrap: "anywhere" }}>{l.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(48px,6vw,84px) clamp(20px,4.5vw,56px) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px,100%),1fr))", gap: "clamp(26px,3.5vw,48px)", marginBottom: "clamp(30px,4vw,52px)" }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: C.white, marginBottom: 14 }}>{businessName}</div>
              <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 340, margin: 0 }}>
                Empowering leaders and organizations through world-class seminars, strategic insights, and global networking opportunities.
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 18px" }}>Programs</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {PROGRAMS.map((p) => (
                  <li key={p}>
                    <a href="#seminars" style={{ color: "rgba(255,255,255,0.62)", textDecoration: "none", fontFamily: SANS, fontSize: 13.5 }}>{p}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 18px" }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(255,255,255,0.62)", fontFamily: SANS, fontSize: 13.5, overflowWrap: "anywhere" }}>
                  <Mail size={14} color={C.gold} /> {mail}
                </li>
                {phone && (
                  <li style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(255,255,255,0.62)", fontFamily: SANS, fontSize: 13.5 }}>
                    <Phone size={14} color={C.gold} /> {phone}
                  </li>
                )}
                <li style={{ display: "flex", alignItems: "flex-start", gap: 9, color: "rgba(255,255,255,0.62)", fontFamily: SANS, fontSize: 13.5 }}>
                  <MapPin size={14} color={C.gold} style={{ marginTop: 3, flexShrink: 0 }} /> {clientCodePostalVille(sessionData, "75000", "Paris")}
                </li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              © 2026 {businessName}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — all rights reserved.
            </span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /> · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Bouton de héros — flèche qui avance, élévation, deux ombres. */
function HeroCta({ children, href, filled = false }: { children: React.ReactNode; href: string; filled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "15px 28px",
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 600,
        border: `1px solid ${filled ? C.accent : C.border}`,
        background: filled ? (hov ? C.accentDark : C.accent) : hov ? C.accentLight : "transparent",
        color: filled ? C.white : C.ink,
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 16px 34px -18px rgba(30,58,138,0.5), 0 4px 12px -8px rgba(22,26,36,0.25)" : "none",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: hov ? "translateX(4px)" : "none", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/* Dossier de séminaire — rangée magazine alternée, numéro romain fantôme. */
function SeminarFeature({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const reverse = idx % 2 === 1;
  const img = s.img || photo(s.pi, FALLBACK_PHOTOS[s.pi]);
  return (
    <Reveal delay={Math.min(idx * 0.05, 0.2)}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="i325-feat"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)",
          gap: "clamp(22px,3.4vw,54px)",
          alignItems: "center",
          padding: "clamp(28px,4vw,52px) 0",
          borderBottom: `1px solid ${C.border}`,
          position: "relative",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: "clamp(16px,2.4vw,30px)", right: 0, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(52px,7vw,104px)", lineHeight: 1, color: "rgba(30,58,138,0.07)", pointerEvents: "none", userSelect: "none" }}>
          {s.num}
        </span>
        <div style={{ order: reverse ? 2 : 1, position: "relative", background: C.bgDark, overflow: "hidden" }}>
          {img ? (
            <img
              src={img}
              alt={s.title}
              loading="lazy"
              style={{ width: "100%", height: "auto", aspectRatio: "3/2", objectFit: "cover", display: "block", transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.7s cubic-bezier(.16,1,.3,1)" }}
            />
          ) : (
            <div aria-hidden style={{ aspectRatio: "3/2", background: `linear-gradient(150deg, ${C.bgDark}, ${C.bgDarkAlt})` }} />
          )}
          <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: hov ? "100%" : "0%", background: C.gold, transition: "width 0.7s cubic-bezier(.16,1,.3,1)" }} />
        </div>
        <div style={{ order: reverse ? 1 : 2, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, fontWeight: 500 }}>{s.category}</span>
            <span aria-hidden style={{ width: 26, height: 1, background: C.border }} />
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textFaint }}>{s.level}</span>
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.8vw,36px)", fontWeight: 500, lineHeight: 1.14, letterSpacing: "-0.01em", color: hov ? C.accent : C.ink, margin: "0 0 12px", transition: "color 0.5s cubic-bezier(.16,1,.3,1)" }}>{s.title}</h3>
          <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.7, margin: "0 0 16px" }}>
            Led by <span style={{ color: C.ink, fontWeight: 500 }}>{s.speaker}</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(12px,1.8vw,26px)", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13, color: C.textMuted }}>
              <Calendar size={14} color={C.accent} /> {s.dateLabel}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13, color: C.textMuted }}>
              <Clock size={14} color={C.accent} /> {s.time}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13, color: C.textMuted }}>
              <MapPin size={14} color={C.accent} /> {s.venue}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <a
              href="#fees"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: SANS, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: hov ? C.accent : C.textMuted, textDecoration: "none", padding: "12px 2px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
            >
              See the fees
              <ArrowRight size={14} style={{ transform: hov ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
            </a>
            <span style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.8vw,22px)", fontWeight: 500, color: C.ink }}>${s.price}</span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* Ligne de la table des droits — filet fin, survol discret. */
function TarifRow({ t }: { t: any }) {
  const [hov, setHov] = useState(false);
  const cell: React.CSSProperties = { padding: "clamp(16px,2vw,24px) clamp(8px,1.4vw,18px)", borderBottom: `1px solid ${C.border}`, verticalAlign: "top" };
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? C.bg : "transparent", transition: "background 0.45s cubic-bezier(.16,1,.3,1)" }}>
      <td style={{ ...cell, textAlign: "left" }}>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.7vw,20px)", fontWeight: 500, color: hov ? C.accent : C.ink, lineHeight: 1.25, transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}>{t.k}</div>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, marginTop: 6, lineHeight: 1.55 }}>{t.n}</div>
      </td>
      <td style={{ ...cell, textAlign: "right", fontFamily: SANS, fontSize: 14.5, color: C.textMuted, whiteSpace: "nowrap" }}>{t.eb}</td>
      <td style={{ ...cell, textAlign: "right", fontFamily: SERIF, fontSize: "clamp(16px,1.7vw,20px)", fontWeight: 500, color: C.ink, whiteSpace: "nowrap" }}>{t.std}</td>
      <td style={{ ...cell, textAlign: "right", fontFamily: SANS, fontSize: 14.5, color: C.gold, whiteSpace: "nowrap" }}>{t.ex}</td>
    </tr>
  );
}

/* Référence — rangée 56px / 1fr : portrait ou folio, puis le dossier. */
function RefRow({ r, idx }: { r: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const img = r.img || (r.pi >= 0 ? photo(r.pi, FALLBACK_PHOTOS[r.pi]) : "");
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="i325-ref"
      style={{
        display: "grid",
        gridTemplateColumns: "56px minmax(0,1fr)",
        gap: "clamp(16px,2.2vw,30px)",
        alignItems: "center",
        padding: "clamp(18px,2.4vw,28px) 0",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        paddingLeft: hov ? 10 : 0,
        transition: "padding-left 0.5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {img ? (
        <img src={img} alt={r.name} loading="lazy" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", display: "block", border: `1px solid ${hov ? C.gold : "rgba(255,255,255,0.2)"}`, transition: "border-color 0.5s cubic-bezier(.16,1,.3,1)" }} />
      ) : (
        <span aria-hidden style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${hov ? C.gold : "rgba(255,255,255,0.2)"}`, display: "grid", placeItems: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 19, color: hov ? C.gold : "rgba(255,255,255,0.55)", transition: "color 0.5s cubic-bezier(.16,1,.3,1), border-color 0.5s cubic-bezier(.16,1,.3,1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.9vw,23px)", fontWeight: 500, color: hov ? C.gold : C.white, lineHeight: 1.25, transition: "color 0.5s cubic-bezier(.16,1,.3,1)" }}>{r.name}</div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 5 }}>{r.role}</div>
        </div>
        <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{r.tag}</span>
      </div>
    </div>
  );
}
