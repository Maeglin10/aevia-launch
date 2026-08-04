"use client";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Truck, Package, Shield } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { HardCutRebuild } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientName,
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

/* Déménageur — donneur : impact-236 (ÉlectroPro, sombre, Inter, accent vif).
   Signature : HardCutRebuild. Coupe brutale (0,12 s) puis reconstruction
   pièce par pièce — c'est littéralement le métier : on démonte tout, on
   remonte tout. Hero sans photographie (aucune image de camion vérifiée
   dans le repo) : typographie et blocs, précédent impact-213. */

let C: Record<string, string> = {
  bg: "#0b0d11", bgCard: "#12151b", bgLight: "#f6f5f2",
  text: "#f2f1ed", textMuted: "#9aa0ab", textDark: "#16181d", textDarkMuted: "#5c6169",
  accent: "var(--brand,#f2760a)", accentDark: "#c85e05", accentSoft: "rgba(242,118,10,0.12)",
  border: "rgba(255,255,255,0.09)", borderLight: "#e5e2db",
  shadowLg: "0 18px 52px rgba(0,0,0,0.45)",
};
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const NAV = [
  { l: "Formules", h: "#formules" },
  { l: "Services", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Contact", h: "#contact" },
];

/* Les trois formules, coupées net et remontées pièce par pièce. */
const HERO_FORMULES = [
  {
    k: "Éco",
    big: "ON TRANSPORTE.",
    p: "dès 490 €",
    d: "Vous emballez, nous portons, roulons et livrons. Le prix le plus juste pour un studio ou un T2.",
  },
  {
    k: "Standard",
    big: "ON EMBALLE.",
    p: "dès 890 €",
    d: "Le fragile emballé par nos équipes, le mobilier démonté et remonté. La formule de la plupart des familles.",
  },
  {
    k: "Clé en main",
    big: "ON S'OCCUPE DE TOUT.",
    p: "dès 1 490 €",
    d: "Cartons faits et défaits, meubles remontés à l'identique, penderies re-rangées. Vous n'ouvrez pas un carton.",
  },
];

const SERVICES_SOURCE = [
  { titre: "Déménagement particuliers", desc: "Du studio à la maison familiale, dans toute la France. Camions capitonnés, sangles, couvertures et équipe formée au portage lourd.", tag: "Particuliers" },
  { titre: "Monte-meubles", desc: "Étages sans ascenseur, cages d'escalier étroites, pianos : monte-meubles jusqu'au 8e étage, opérateur certifié inclus.", tag: "Technique" },
  { titre: "Garde-meubles sécurisé", desc: "Box individuels de 3 à 30 m³, accès sur rendez-vous, site alarmé et assuré. Au mois, sans engagement de durée.", tag: "Stockage" },
  { titre: "Transfert d'entreprise", desc: "Bureaux, ateliers, archives. Intervention le week-end pour zéro jour d'activité perdu, référent unique côté client.", tag: "Pro" },
  { titre: "Emballage professionnel", desc: "Vaisselle, verrerie, œuvres et écrans emballés par nos équipes avec bulle, croisillons et caisses renforcées.", tag: "Fragile" },
  { titre: "Cartons & fournitures", desc: "Packs de cartons livrés à domicile avant le jour J, repris gratuitement après. Adhésif, housses matelas, penderies.", tag: "Fournitures" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "Visite & devis en 45 min", d: "À domicile ou en visio. Volume calculé pièce par pièce, devis ferme remis sous 24 h — c'est lui qui fait foi." },
  { n: "02", t: "Cartons livrés avant le jour J", d: "Fournitures déposées chez vous une semaine avant. En formule Standard et Clé en main, on emballe le fragile la veille." },
  { n: "03", t: "Jour J : démonté, roulé, remonté", d: "Mobilier démonté, protégé, remonté à l'identique dans le nouveau logement. Lettre de voiture signée au départ et à l'arrivée." },
  { n: "04", t: "Tour du logement ensemble", d: "Rien ne part avant un dernier tour des pièces avec vous, rien n'est terminé avant votre signature à l'arrivée." },
];

const ENGAGEMENT_DEMO = [
  "Inscrits au registre des transporteurs — DREAL Pays de la Loire",
  "Assurance ad valorem incluse jusqu'à 50 000 € de mobilier déclaré",
  "Devis ferme après visite : le prix signé est le prix facturé",
  "Lettre de voiture réglementaire remise au départ et à l'arrivée",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const STATS_DEMO = [
  { value: "1 800+", label: "Déménagements réalisés" },
  { value: "98,4%", label: "Sans aucune casse déclarée" },
  { value: "45 min", label: "Pour un devis ferme" },
  { value: "50 000 €", label: "D'assurance incluse" },
];
let STATS = STATS_DEMO;

const AVIS_SOURCE = [
  { texte: "Formule clé en main pour un T4 avec piano. Le monte-meubles était en place à 8h, le piano remonté au salon à 14h, et pas une rayure sur les murs — ni les leurs, ni les nôtres.", auteur: "Sophie & Marc D.", detail: "Nantes → Rennes, clé en main" },
  { texte: "Le devis n'a pas bougé d'un euro alors qu'on avait sous-estimé la cave. L'équipe a absorbé la différence sans commentaire. C'est rare et ça mérite d'être écrit.", auteur: "Antoine G.", detail: "T2, formule éco" },
  { texte: "Transfert de nos bureaux un samedi : le lundi matin, chaque poste était remonté, branché, étiqueté. Aucune heure d'activité perdue.", auteur: "Cabinet Ligeria", detail: "Transfert d'entreprise" },
];
let AVIS_DEMO = AVIS_SOURCE;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}


export default function CapDemenagementsPage() {
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
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? SERVICES_DEMO[i % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[i % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[i % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
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
  const { i, next, prev } = useSlides(HERO_FORMULES.length, DWELL.normal);
  const f = HERO_FORMULES[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "02 40 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33240000000"}`;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i329-nav { display: none !important; } .i329-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i329-split { grid-template-columns: 1fr !important; }
          .i329-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i329-stats .i329-statcell { border-right: none !important; }
          .i329-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i329-hero { padding: 128px 24px 54px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "rgba(11,13,17,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Truck size={19} color={C.accent} />
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Cap Déménagements"))}</span>
            </>
          )}
        </div>
        <div id="i329-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ scale: 1.03 }}>
            Devis gratuit
          </motion.a>
        </div>
        <button className="i329-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(11,13,17,0.98)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4, backdropFilter: "blur(12px)" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Devis gratuit</a>
        </div>
      )}

      {/* ── HERO — HardCutRebuild, sans photographie ────────────────────── */}
      <section className="i329-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px 64px 70px", maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        {/* Pile de « cartons » : simple rythme de blocs, aucun asset externe. */}
        <div aria-hidden style={{ position: "absolute", right: 48, top: "20%", bottom: "20%", width: "min(30vw, 320px)", opacity: 0.5, display: "grid", gridTemplateRows: "repeat(5, 1fr)", gap: 10, pointerEvents: "none" }}>
          {[0.5, 0.8, 0.65, 0.9, 0.55].map((w, n) => (
            <motion.div key={n} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + n * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: `${w * 100}%`, justifySelf: "end", border: `1px solid ${C.border}`, borderRadius: 6, background: n % 2 ? C.bgCard : "transparent" }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 16px", fontSize: 12.5, color: C.textMuted, marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
            Déménageur professionnel · Nantes & toute la France
          </motion.div>

          {/* La coupe franche puis la reconstruction, élément par élément :
              exactement ce qu'on vend. */}
          <HardCutRebuild index={i} stagger={0.09}>
            {[
              <div key="k" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3.2, textTransform: "uppercase", color: C.accent, marginBottom: 14 }}>
                Formule {f.k}
              </div>,
              <h1 key="big" style={{ fontSize: "clamp(38px, 6vw, 76px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.02, margin: "0 0 18px" }}>
                {c?.heroHeadline ?? f.big}
              </h1>,
              <div key="p" style={{ fontSize: 21, fontWeight: 800, color: C.accent, marginBottom: 14 }}>{f.p}</div>,
              <p key="d" style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 520, margin: 0 }}>
                {c?.heroSubline ?? f.d}
              </p>,
            ]}
          </HardCutRebuild>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginTop: 34 }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "15px 30px", fontWeight: 800, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              Obtenir mon devis ferme <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#formules" style={{ background: "rgba(255,255,255,0.05)", color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.09)" }}>
              Comparer les formules
            </motion.a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 46 }}>
            <SlideIndex i={i} total={HERO_FORMULES.length} variant="fraction" color={C.textMuted} className="" />
            <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgCard }}>
        <div className="i329-stats i329-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i329-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FORMULES ────────────────────────────────────────────────────── */}
      <section id="formules" className="i329-pad" style={{ padding: "100px 64px" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Trois formules</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: -1, marginTop: 10, lineHeight: 1.1 }}>
                Vous choisissez où<br />vous vous arrêtez.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 18 }}>
            {HERO_FORMULES.map((fo, idx) => (
              <Reveal key={fo.k} delay={idx * 0.08}>
                <div style={{ background: idx === 1 ? C.accentSoft : C.bgCard, border: `1px solid ${idx === 1 ? C.accent : C.border}`, borderRadius: 12, padding: "30px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                  {idx === 1 && <span style={{ alignSelf: "flex-start", background: C.accent, color: "#101010", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>La plus choisie</span>}
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2.6, textTransform: "uppercase", color: C.accent }}>{fo.k}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, margin: "10px 0 4px" }}>{fo.p}</div>
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7, flexGrow: 1 }}>{fo.d}</p>
                  <a href={telHref} style={{ marginTop: 20, textAlign: "center", background: idx === 1 ? C.accent : "rgba(255,255,255,0.06)", color: idx === 1 ? "#101010" : C.text, border: `1px solid ${idx === 1 ? C.accent : C.border}`, borderRadius: 8, padding: "13px 20px", fontWeight: 700, fontSize: 14.5, textDecoration: "none" }}>
                    Chiffrer cette formule
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i329-pad" style={{ padding: "100px 64px", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>{tr(sessionData, "Services")}</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: -1, marginTop: 10, lineHeight: 1.1 }}>
                Tout ce qui roule,<br />porte et protège.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.bg, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentSoft, color: C.accent, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontSize: 17.5, fontWeight: 800, margin: "16px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ─────────────────────────────────────────────────────── */}
      <section id="methode" className="i329-pad" style={{ padding: "100px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>La méthode</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: -1, marginTop: 10, lineHeight: 1.1 }}>
                Démonté. Roulé.<br />Remonté.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.accent, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{ marginTop: 44, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 28px", display: "flex", flexWrap: "wrap", gap: "14px 34px", alignItems: "center", background: C.bgCard }}>
              <Shield size={22} color={C.accent} style={{ flexShrink: 0 }} />
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13.5, color: C.textMuted }}>
                  <CheckCircle size={14} color={C.accent} style={{ flexShrink: 0 }} />
                  {e}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i329-pad" style={{ padding: "100px 64px", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.4vw, 44px)", fontWeight: 900, letterSpacing: -1 }}>
              Ils ont posé leurs cartons<span style={{ color: C.accent }}>.</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}
                </div>
                <p style={{ fontSize: 14.5, color: "rgba(242,241,237,0.85)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i329-pad" style={{ padding: "100px 64px", textAlign: "center" }}>
        <Reveal>
          <Package size={30} color={C.accent} style={{ margin: "0 auto 18px" }} />
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
            On chiffre votre volume<br />en 45 minutes.
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Visite à domicile ou en visio, devis ferme sous 24 h. Cartons offerts dès la formule Standard.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "16px 36px", fontWeight: 800, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "devis@cap-demenagements.fr"}`} style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "15px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ borderColor: C.accent }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i329-pad" style={{ borderTop: `1px solid ${C.border}`, padding: "44px 64px 22px", background: C.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Cap Déménagements"))}</div>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>
                Déménageur professionnel · {clientCity(sessionData) ?? "Nantes"}<br />Registre des transporteurs — DREAL Pays de la Loire
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Nantes, Loire-Atlantique" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Sam 8h–19h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: C.textMuted, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Cap Déménagements"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
