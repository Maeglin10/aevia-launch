"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Scale } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { ArcSwap } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
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

/* Étude notariale — donneur : impact-03 (Maison Dorée, luxe clair, serif Georgia).
   Signature : ArcSwap. La plaque en laiton d'une étude est littéralement un
   objet suspendu qui oscille — chaque domaine d'intervention entre et sort
   en balancier, pivot au pied, pendant que le texte reste immobile. */

let C: Record<string, string> = {
  bg: "#faf8f3", bgSection: "#f2ede3", bgDark: "#161a24",
  text: "#1c1a16", textMuted: "#6b6357",
  accent: "var(--brand,#8a6d3f)", accentDark: "#6d5530", accentLight: "#f0e6d2",
  navy: "#1d2a44",
  white: "#ffffff", border: "#e2d9c8",
  shadow: "0 2px 14px rgba(28,26,22,0.07)", shadowLg: "0 18px 52px rgba(138,109,63,0.20)",
};
const FONT = "Georgia, 'Times New Roman', serif";
const FONT_BODY = "system-ui, -apple-system, sans-serif";

const STATS_DEMO = [
  { value: "2", label: "Notaires associés" },
  { value: "30 ans", label: "D'exercice cumulé" },
  { value: "1 200", label: "Actes reçus par an" },
  { value: "8 jours", label: "Premier rendez-vous" },
];
let STATS = STATS_DEMO;

const NAV = [
  { l: "Domaines", h: "#domaines" },
  { l: "L'étude", h: "#etude" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Les trois faces de la plaque du hero. Photos : uniquement des URLs déjà
   présentes dans le repo et vérifiées (cabinets juridiques / documents). */
function HERO_DOMAINES_DEMO_LIVE() {
  return [
  {
    k: "Immobilier",
    line: "L'acte authentique qui sécurise la vente.",
    sub: "Compromis, vente, VEFA — chaque clause vérifiée avant signature.",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"),
    alt: "Dossier d'acte de vente sur le bureau de l'étude",
  },
  {
    k: "Famille",
    line: "Transmettre sans laisser de conflit derrière soi.",
    sub: "Donations, testaments authentiques, successions réglées au clair.",
    img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"),
    alt: "Signature d'une donation, stylo et documents",
  },
  {
    k: "Entreprise",
    line: "Des statuts aux murs, l'entreprise sur des bases saines.",
    sub: "Cessions de fonds, baux commerciaux, garanties et sûretés.",
    img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80"),
    alt: "Bibliothèque juridique du bureau des notaires",
  },
];
}
let HERO_DOMAINES_DEMO = HERO_DOMAINES_DEMO_LIVE();
let HERO_DOMAINES = HERO_DOMAINES_DEMO;

const DOMAINES_DEMO = [
  { titre: "Immobilier", desc: "Avant-contrat, vente, VEFA, servitudes, prêt hypothécaire. Nous vérifions urbanisme, diagnostics et origine de propriété avant que vous n'engagiez votre signature.", tag: "Acte authentique" },
  { titre: "Famille & succession", desc: "Contrat de mariage, PACS, donation entre époux, testament authentique, règlement complet de succession avec déclaration fiscale.", tag: "Transmission" },
  { titre: "Entreprise", desc: "Cession de fonds de commerce, baux commerciaux, constitution de sociétés, garanties. Le notaire donne date certaine et force exécutoire à vos accords.", tag: "Professionnels" },
  { titre: "Patrimoine & conseil", desc: "Démembrement, SCI familiale, anticipation de la dépendance, mandat de protection future. Un rendez-vous conseil avant les grandes décisions.", tag: "Conseil" },
];

const ENGAGEMENT_DEMO = [
  "Officiers publics nommés par le garde des Sceaux — nos actes ont force exécutoire",
  "Membres de la Chambre des notaires de la Gironde, contrôlés chaque année",
  "Secret professionnel absolu, sur chaque dossier et chaque échange",
  "Réponse écrite sous 48 h ouvrées à toute demande de rendez-vous",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

/* Émoluments : barème national fixé par arrêté (art. A444 du code de commerce).
   Les montants cités sont les émoluments d'actes courants, hors débours et taxes. */
const TARIFS_DEMO = [
  { a: "Acte de notoriété (succession)", p: "57,69 € HT", n: "Émolument fixe national — identique dans toute la France." },
  { a: "Donation entre époux", p: "115,39 € HT", n: "Émolument fixe, hors droits d'enregistrement éventuels." },
  { a: "PACS (convention par acte notarié)", p: "101,41 € HT", n: "Enregistrement et formalités inclus dans nos formalités courantes." },
  { a: "Vente immobilière", p: "barème proportionnel", n: "Émoluments dégressifs par tranches, fixés par l'État. Simulation chiffrée remise avant tout engagement." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Succession de mon père réglée en cinq mois, avec une déclaration fiscale limpide. Chaque étape nous a été expliquée avant d'être engagée, sans jargon.", auteur: "Hélène D.", detail: "Règlement de succession" },
  { texte: "Achat de notre première maison. L'étude a repéré une servitude non déclarée dans le compromis et l'a fait corriger avant signature. C'est exactement ce qu'on attend d'un notaire.", auteur: "Julien & Sarah M.", detail: "Vente immobilière" },
  { texte: "Cession de mon fonds de commerce préparée en parallèle du bail. Calendrier tenu à la semaine près, et un conseil fiscal qui m'a évité une erreur coûteuse.", auteur: "Patrick L.", detail: "Cession de fonds" },
];
let AVIS_DEMO = AVIS_SOURCE;

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

export default function EtudeNotarialePage() {
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
  HERO_DOMAINES_DEMO = HERO_DOMAINES_DEMO_LIVE();
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO_DOMAINES = HERO_DOMAINES_DEMO.map((row, i) => ({
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

  const DOMAINES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? DOMAINES_DEMO[i % DOMAINES_DEMO.length].titre,
      desc: s.description ?? DOMAINES_DEMO[i % DOMAINES_DEMO.length].desc,
      tag: DOMAINES_DEMO[i % DOMAINES_DEMO.length].tag,
    })),
    DOMAINES_DEMO
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
  const { i, go, next, prev } = useSlides(HERO_DOMAINES.length, DWELL.normal);
  const dom = HERO_DOMAINES[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "05 56 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33556000000"}`;

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i326-nav { display: none !important; } .i326-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i326-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i326-plaque { max-width: 340px; margin: 0 auto; }
          .i326-split { grid-template-columns: 1fr !important; }
          .i326-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i326-stats .i326-statcell { border-right: none !important; }
          .i326-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "rgba(250,248,243,0.97)" : "rgba(250,248,243,0.6)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Scale size={17} color={C.accent} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, letterSpacing: 0.4 }}>{fd?.businessName ?? "Vasseur & Delmas"}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.4, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Notaires</span>
            </>
          )}
        </div>
        <div id="i326-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={telHref} style={{ background: C.navy, color: "#fff", borderRadius: 3, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ opacity: 0.92 }}>
            Prendre rendez-vous
          </motion.a>
        </div>
        <button className="i326-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 74, left: 0, right: 0, zIndex: 99, background: "rgba(250,248,243,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.navy, color: "#fff", borderRadius: 3, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Prendre rendez-vous</a>
        </div>
      )}

      {/* ── HERO — ArcSwap sur la plaque de l'étude ─────────────────────── */}
      <section className="i326-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1280, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Étude notariale · {clientCity(sessionData) ?? "Bordeaux"}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(34px, 4.6vw, 62px)", color: C.text, lineHeight: 1.12, margin: "18px 0 22px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>Un acte qui engage,<br /><em style={{ color: C.accent }}>un conseil qui protège.</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 34 }}>
            {fd?.tagline ?? c?.heroSubline ?? "Immobilier, famille, entreprise : deux notaires associés reçoivent, expliquent et sécurisent chacun de vos engagements — au tarif réglementé, le même partout en France."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.navy, color: "#fff", borderRadius: 3, padding: "15px 30px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#domaines" style={{ color: C.text, border: `1px solid ${C.border}`, background: C.white, borderRadius: 3, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Nos domaines
            </motion.a>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 46 }}>
            <SlideIndex i={i} total={HERO_DOMAINES.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted }}>
              <strong style={{ color: C.text, fontWeight: 600 }}>{dom.k}</strong> — {dom.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
          </div>
        </div>

        {/* La plaque : elle est suspendue, elle oscille. ArcSwap et lui seul. */}
        <div className="i326-plaque" style={{ position: "relative" }}>
          <ArcSwap index={i} sweep={46}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", boxShadow: C.shadowLg }}>
              <img src={photo(i, dom.img)} alt={dom.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "22px 24px 24px", borderTop: `3px solid ${C.accent}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accentDark, marginBottom: 8 }}>{dom.k}</div>
                <div style={{ fontFamily: FONT, fontSize: 19, color: C.text, lineHeight: 1.35 }}>{dom.line}</div>
              </div>
            </div>
          </ArcSwap>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i326-stats i326-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i326-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 34, color: "var(--brand, #cfb37a)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DOMAINES ────────────────────────────────────────────────────── */}
      <section id="domaines" className="i326-pad" style={{ padding: "100px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Domaines d'intervention</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 48px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "domaines.titre") ?? (<>
                Quatre domaines,<br /><em>une même exigence.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))", gap: 18 }}>
            {DOMAINES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.07}>
                <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 4, padding: "28px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 2, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 20, color: C.text, margin: "16px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'ÉTUDE ─────────────────────────────────────────────────────── */}
      <section id="etude" className="i326-pad" style={{ padding: "100px 64px", background: C.bgSection }}>
        <div className="i326-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(3, (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"))} alt="Notaire associé de l'étude" loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'étude</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 42px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "etude.titre") ?? (<>
                Un officier public<br /><em>à votre service.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, background: C.navy, color: "#fff", borderRadius: 3, padding: "14px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ opacity: 0.92 }}>
                Exposer votre situation <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i326-pad" style={{ padding: "100px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 46px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des émoluments <em>réglementés.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>
                La rémunération du notaire est fixée par l'État (barème national) : pour un même acte, l'émolument est identique dans toute la France. Hors débours, droits et taxes collectés pour le Trésor public.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: 40 }}>
            {TARIFS.map((t, idx) => (
              <Reveal key={t.a} delay={idx * 0.06}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "20px 24px", marginBottom: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 17.5, color: C.text }}>{t.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{t.n}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 19, color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i326-pad" style={{ padding: "100px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 44px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Ils nous ont confié <em style={{ color: "var(--brand, #cfb37a)" }}>leurs actes</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="var(--brand, #cfb37a)" color="var(--brand, #cfb37a)" />)}
                </div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: "var(--brand, #cfb37a)", fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i326-pad" style={{ padding: "100px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Premier rendez-vous</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 50px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Votre situation mérite<br /><em>un conseil posé.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Premier échange au téléphone sans engagement. Rendez-vous à l'étude sous huit jours, en soirée le jeudi.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.navy, color: "#fff", borderRadius: 3, padding: "16px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@etude-vasseur-delmas.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.navy}`, borderRadius: 3, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.navy, color: "#fff" }}>
              <Mail size={18} /> Écrire à l'étude
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i326-pad" style={{ background: C.bgDark, padding: "48px 64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: "var(--brand, #cfb37a)", marginBottom: 8 }}>{fd?.businessName ?? "Vasseur & Delmas"} — Notaires associés</div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7 }}>
                Officiers publics et ministériels · {clientCity(sessionData) ?? "Bordeaux"}<br />Membres de la Chambre des notaires de la Gironde
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Bordeaux") + ", Gironde" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h, jeudi jusqu'à 20h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: "var(--brand, #cfb37a)" }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Vasseur & Delmas"} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
