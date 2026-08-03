"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Ruler } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { ExpandFrame } from "@/lib/templates/hero-kit-2";
import {
  clientCertifications,
  clientCity,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* Cuisiniste / agencement sur mesure — donneur : impact-230 (Atelier du Bois).
   Signature : ExpandFrame. Le cadre qui s'ouvre du plan à la pièce : chaque
   projet entre par un clip-path resserré qui se déploie plein cadre — c'est
   le plan 3D qui devient la cuisine. Aucun autre geste en signature. */

let C: Record<string, string> = {
  bg: "#faf8f4", bgSection: "#f1ebe2", bgDark: "#191410",
  text: "#1e1812", textMuted: "#6f6355",
  accent: "var(--brand,#a4552e)", accentDark: "#7e3f20", accentLight: "#f6e5da",
  oak: "#c99f6a", oakLight: "#fdf4e6",
  white: "#ffffff", border: "#e3d9ca",
  shadow: "0 2px 14px rgba(30,24,18,0.08)", shadowLg: "0 18px 52px rgba(164,85,46,0.20)",
};
const FONT = "'Libre Baskerville', Georgia, serif";
const FONT_BODY = "'Cabin', system-ui, sans-serif";

const STATS_DEMO = [
  { value: "240+", label: "Cuisines posées" },
  { value: "10 ans", label: "Garantie caissons" },
  { value: "2-3 j", label: "De pose chez vous" },
  { value: "0 €", label: "L'étude 3D, déduite" },
];
let STATS = STATS_DEMO;

const NAV = [
  { l: "Prestations", h: "#prestations" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Trois projets pour le hero. Photos : URLs déjà présentes dans le repo
   (atelier bois du donneur, intérieur design) — sujets à contrôler en prod. */
const HERO_PROJETS_DEMO = [
  {
    k: "Cuisine chêne & laque",
    sub: "Îlot central, façades sans poignée, plan de travail céramique.",
    img: "https://images.pexels.com/photos/6920452/pexels-photo-6920452.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Plan de travail et façades bois d'une cuisine sur mesure",
  },
  {
    k: "De l'atelier à la pièce",
    sub: "Caissons et façades fabriqués en France, ajustés au millimètre.",
    img: "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Atelier de fabrication des caissons et façades",
  },
  {
    k: "Agencement séjour",
    sub: "Bibliothèque toute hauteur et meuble TV, mêmes essences que la cuisine.",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
    alt: "Intérieur aménagé avec rangements sur mesure",
  },
];
let HERO_PROJETS = HERO_PROJETS_DEMO;

const PRESTATIONS_DEMO = [
  { titre: "Cuisine sur mesure", desc: "Conception, fabrication et pose. Caissons 19 mm, façades bois, laque ou stratifié, quincaillerie Blum garantie à vie. Électroménager intégré au projet.", tag: "Cuisine" },
  { titre: "Dressing & placards", desc: "Sous pente, toute hauteur, portes coulissantes ou battantes. Chaque centimètre exploité, éclairage LED intégré sur demande.", tag: "Rangement" },
  { titre: "Bibliothèques & meubles TV", desc: "Agencement du séjour dans les mêmes essences que votre cuisine, pour une maison qui parle d'une seule voix.", tag: "Séjour" },
  { titre: "Salle de bain", desc: "Meubles vasque suspendus, colonnes, plans en céramique ou bois traité. Résistance à l'humidité garantie.", tag: "Bain" },
  { titre: "Conception 3D", desc: "Relevé au laser chez vous, plans 3D photoréalistes, trois allers-retours de modification inclus. L'étude est déduite à la commande.", tag: "Étude" },
  { titre: "Pose par nos menuisiers", desc: "Pose par nos menuisiers salariés — jamais sous-traitée. Chantier protégé, gravats évacués, cuisine opérationnelle sous trois jours.", tag: "Pose" },
];

const METHODE = [
  { n: "01", t: "Relevé & écoute", d: "Chez vous, au laser. On parle habitudes de cuisine, rangements, circulation — avant de parler meubles." },
  { n: "02", t: "Plan 3D & devis fermé", d: "Un projet photoréaliste et un devis ferme, poste par poste. Pas de « à partir de » : le prix signé est le prix payé." },
  { n: "03", t: "Fabrication française", d: "Caissons et façades fabriqués en France, quincaillerie allemande. Six semaines en moyenne entre commande et pose." },
  { n: "04", t: "Pose en 2-3 jours", d: "Nos menuisiers salariés posent, raccordent et ajustent. Vous cuisinez le soir du dernier jour." },
];

const ENGAGEMENT_DEMO = [
  "Devis ferme et définitif — aucun supplément découvert en cours de chantier",
  "Garantie 10 ans sur les caissons, quincaillerie garantie à vie",
  "RC professionnelle et garantie décennale sur la pose",
  "Showroom sur rendez-vous : touchez les façades avant de choisir",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Cuisine complète posée", p: "dès 8 900 €", n: "Caissons, façades, plan de travail, pose et raccordements. Électroménager en sus selon votre sélection." },
  { a: "Dressing sur mesure", p: "dès 2 400 €", n: "Toute hauteur, aménagements intérieurs et pose comprise." },
  { a: "Bibliothèque / meuble TV", p: "dès 1 900 €", n: "Sur mesure au millimètre, dans l'essence de votre choix." },
  { a: "Étude & plans 3D", p: "offerte", n: "Déduite intégralement à la commande. Facturée 290 € si le projet ne se fait pas — remboursée si vous commandez." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_DEMO = [
  { texte: "Le devis ferme change tout : pas une ligne n'a bougé entre la signature et la facture. La cuisine a été posée en deux jours et demi, plan céramique ajusté au millimètre autour d'un mur qui n'était pas droit.", auteur: "Camille & Hugo T.", detail: "Cuisine îlot, Lyon 6e" },
  { texte: "Troisième cuisiniste consulté, le seul qui a parlé de notre façon de cuisiner avant de parler catalogue. Le dressing assorti posé six mois plus tard est parfait.", auteur: "Nathalie B.", detail: "Cuisine + dressing" },
  { texte: "Un caisson est arrivé rayé — remplacé sous huit jours sans discussion, le poseur est revenu un samedi. C'est là qu'on juge une maison sérieuse.", auteur: "Famille Roussel", detail: "Agencement complet" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function LignesEtBoisPage() {
  const [session, setSession] = useState<any>(null);

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
  HERO_PROJETS = HERO_PROJETS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const PRESTATIONS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].titre,
      desc: s.description ?? PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].desc,
      tag: PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].tag,
    })),
    PRESTATIONS_DEMO
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      texte: r.text ?? AVIS_DEMO[i % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[i % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[i % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO_PROJETS.length, DWELL.normal);
  const projet = HERO_PROJETS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "04 72 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33472000000"}`;

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cabin:wght@400;500;600;700&display=swap');`}</style>
      <style>{`
        @media (max-width: 900px) { #i327-nav { display: none !important; } .i327-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i327-split { grid-template-columns: 1fr !important; }
          .i327-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i327-stats .i327-statcell { border-right: none !important; }
          .i327-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i327-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "rgba(250,248,244,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Ruler size={18} color={scrolled ? C.accent : "#fff"} />
              <span style={{ fontFamily: FONT, fontSize: 19, color: scrolled ? C.text : "#fff" }}>Lignes <em>& Bois</em></span>
            </>
          )}
        </div>
        <div id="i327-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Étude 3D offerte
          </motion.a>
        </div>
        <button className="i327-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4, backdropFilter: "blur(12px)" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Étude 3D offerte</a>
        </div>
      )}

      {/* ── HERO — ExpandFrame plein cadre ──────────────────────────────── */}
      <section id="hero" style={{ height: "100dvh", minHeight: 640, position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden", background: C.bgDark }}>
        {/* Le plan qui devient la pièce : le projet courant se déploie depuis
            un cadre resserré jusqu'au plein écran. ExpandFrame code sa position
            en inline (relative) : on l'étire via un wrapper absolu, jamais en
            lui passant absolute inset-0 (boîte de hauteur nulle sinon). */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ExpandFrame src={photo(i, projet.img)} alt={projet.alt} index={i} className="w-full h-full" radius={0} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,7,2,0.92) 0%, rgba(12,7,2,0.38) 46%, rgba(12,7,2,0.10) 100%)", pointerEvents: "none" }} />
        <div className="i327-herotext" style={{ position: "relative", zIndex: 1, padding: "0 72px 76px", maxWidth: 860 }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.oak }}>
            Cuisines & agencement sur mesure · {clientCity(sessionData) ?? "Lyon"}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", lineHeight: 1.12, margin: "16px 0 20px" }}>
            {c?.heroHeadline ?? (<>Du plan 3D<br /><em style={{ color: C.oak }}>à la pièce à vivre.</em></>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 34, maxWidth: 520 }}>
            {c?.heroSubline ?? fd?.tagline ?? "Cuisines, dressings et agencements dessinés au millimètre, fabriqués en France, posés par nos menuisiers salariés. Devis ferme, garantie 10 ans."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 30px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 8px 32px ${"rgba(164,85,46,0.4)"}` }} whileHover={{ scale: 1.03 }}>
              Réserver mon étude 3D <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#prestations" style={{ background: "rgba(255,255,255,0.09)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "13px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.15)" }}>
              Nos prestations
            </motion.a>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 42, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO_PROJETS.length} variant="fraction" color="rgba(255,255,255,0.85)" className="" />
            <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)" }}>
              <strong style={{ color: "#fff", fontWeight: 600 }}>{projet.k}</strong> — {projet.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color="#fff" className="" />
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i327-stats i327-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i327-statcell" style={{ padding: "28px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 34, color: C.oak, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS ─────────────────────────────────────────────────── */}
      <section id="prestations" className="i327-pad" style={{ padding: "100px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Prestations</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 50px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>
                Toute la maison,<br /><em>au millimètre.</em>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {PRESTATIONS.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ─────────────────────────────────────────────────────── */}
      <section id="methode" className="i327-pad" style={{ padding: "100px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>La méthode</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 48px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>
                Quatre étapes,<br /><em>un devis qui ne bouge pas.</em>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontFamily: FONT, fontSize: 30, color: C.oak, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.text, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS + photo ─────────────────────────────────────────── */}
      <section className="i327-pad" style={{ padding: "100px 64px", background: C.bg }}>
        <div className="i327-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(3, "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600")} alt="Menuisier ajustant une façade à l'atelier" loading="lazy" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 42px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.2 }}>
                Le sur-mesure,<br /><em>sans les surprises.</em>
              </h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, background: C.accent, color: C.white, borderRadius: 6, padding: "14px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
                Parler de votre projet <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i327-pad" style={{ padding: "100px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 46px)", color: C.text, marginTop: 10 }}>Des prix <em>fermes.</em></h2>
            </div>
          </Reveal>
          {TARIFS.map((t, idx) => (
            <Reveal key={t.a} delay={idx * 0.06}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 17.5, color: C.text }}>{t.a}</div>
                  <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{t.n}</div>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 19, color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i327-pad" style={{ padding: "100px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 44px)", color: "#fff" }}>
              Ils cuisinent <em style={{ color: C.oak }}>dans nos réalisations</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.oak} color={C.oak} />)}
                </div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.oak, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i327-pad" style={{ padding: "100px 64px", background: C.oakLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Étude offerte</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 50px)", color: C.text, margin: "14px 0 16px" }}>
            Et si on dessinait<br /><em>votre cuisine ?</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Relevé à domicile et plans 3D offerts, déduits à la commande. Showroom sur rendez-vous.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "16px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@lignes-et-bois.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i327-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", color: C.oak, marginBottom: 8 }}>{fd?.businessName ?? "Lignes & Bois"}</div>
              <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13, lineHeight: 1.7 }}>
                Cuisiniste · Agencement sur mesure · {clientCity(sessionData) ?? "Lyon"}<br />Fabrication française, pose par menuisiers salariés
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Lyon, Rhône" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Showroom sur RDV — Mar–Sam 9h–19h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.oak }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Lignes & Bois"} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
