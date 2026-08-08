"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, Sparkles, Star, TreePine, Users } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { PortalZoom } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
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

/* Salle de réception / domaine de mariage, 1re variante. Signature : PortalZoom — le portail qui s'ouvre sur le domaine. Images repo (cérémonie, salle, nature). */

let C: Record<string, string> = {
  bg: "#faf8f3",
  bgSection: "#f2ede3",
  bgDark: "#161a24",
  text: "#1c1a16",
  textMuted: "#655e52",
  accent: "var(--brand,#8a6d3f)",
  accentDark: "#6d5530",
  accentLight: "#f0e6d2",
  hi: "#cfb37a",
  white: "#ffffff",
  border: "#e2d9c8",
};
const FONT = "Georgia, 'Times New Roman', serif";
const FONT_BODY = "system-ui, -apple-system, sans-serif";

const NAV = [{"l": "Les espaces", "h": "#services"}, {"l": "Votre événement", "h": "#methode"}, {"l": "Formules", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
function HERO_DEMO_LIVE() {
  return [{"k": "La grande salle", "sub": "220 convives assis, pierre apparente et poutres de chêne.", "img": (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"), "alt": "La grande salle dressée pour un dîner"}, {"k": "La cérémonie au parc", "sub": "L'allée de charmes, l'arche, et quatre hectares pour les photos.", "img": (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"), "alt": "Cérémonie dressée dans le parc"}, {"k": "Les lendemains", "sub": "12 chambres sur place — le brunch se fait en peignoir.", "img": (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"), "alt": "Le parc au matin"}];
}
let HERO_DEMO = HERO_DEMO_LIVE();
let HERO = HERO_DEMO;

const SERVICES_SOURCE = [{"titre": "La grande salle", "desc": "320 m² de tuffeau et de chêne, 220 couverts, office traiteur professionnel attenant, sono et lumières installées.", "tag": "Salle"}, {"titre": "Le parc & la cérémonie", "desc": "Cérémonie laïque sous l'allée de charmes, cocktail sur la terrasse ouest au couchant, plan B pluie prévu et beau.", "tag": "Parc"}, {"titre": "L'hébergement", "desc": "12 chambres (26 couchages) dans la longère et les dépendances : les proches restent, le brunch du lendemain a lieu ici.", "tag": "Nuits"}, {"titre": "Séminaires & journées d'équipe", "desc": "En semaine : salle plénière lumineuse, sous-commissions dans les dépendances, parc pour les formats qui respirent.", "tag": "Entreprise"}, {"titre": "Traiteurs : libres ou conseillés", "desc": "Cuisine professionnelle aux normes pour le traiteur de votre choix — ou notre liste de cinq maisons éprouvées.", "tag": "Traiteur"}, {"titre": "Coordination du jour J", "desc": "Notre intendante orchestre prestataires et timing le jour même : vous êtes invités chez vous.", "tag": "Jour J"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "La visite", "d": "Une heure trente, aux heures où VOTRE événement vivra : la lumière du parc à 18 h ne se raconte pas."}, {"n": "02", "t": "L'option posée", "d": "Date bloquée gratuitement 15 jours, devis détaillé espace par espace — pas de forfait opaque."}, {"n": "03", "t": "La préparation cadrée", "d": "Deux rendez-vous techniques, plan d'implantation, fiche prestataires : tout est écrit avant le jour J."}, {"n": "04", "t": "Le jour, orchestré", "d": "L'intendante gère les arrivées, le timing, les imprévus. Le domaine est à vous jusqu'au lendemain 15 h."}];
const ENGAGEMENT_DEMO = ["ERP de 5e catégorie contrôlé : commission de sécurité, accessibilité PMR", "Un seul événement à la fois — jamais deux mariages qui s'entendent chanter", "Sonorisation extérieure limitée à 22 h, salle insonorisée jusqu'à l'aube : les voisins et la fête coexistent", "Assurance RC organisateur exigée et vérifiée — protection de tous"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Mariage — samedi haute saison", "p": "6 900 €", "n": "Du vendredi 14 h au dimanche 15 h : salle, parc, chambres, intendante."}, {"a": "Mariage — vendredi ou hors saison", "p": "4 900 €", "n": "Mêmes prestations, dates d'octobre à avril ou vendredis d'été."}, {"a": "Séminaire journée (< 80 pers.)", "p": "1 900 €", "n": "Salle plénière, 2 salles annexes, parc, café d'accueil compris."}, {"a": "Grande tablée familiale (< 60)", "p": "2 400 €", "n": "Anniversaires, noces d'or : la salle des dépendances et la terrasse."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Le domaine entier à nous du vendredi au dimanche : la cérémonie sous les charmes, la fête jusqu'à 4 h sans un voisin fâché, le brunch en peignoir. Exactement le mariage qu'on voulait.", "auteur": "Camille & Antoine", "detail": "Mariage — juin 2026"}, {"texte": "L'intendante du jour J vaut de l'or : un prestataire en retard, une averse surprise — nous n'avons rien su de tout ça avant le lendemain.", "auteur": "Les mariés de septembre", "detail": "Coordination jour J"}, {"texte": "Séminaire stratégique de deux jours : équipes logées sur place, sessions dans les dépendances, soirée au parc. Le cadre a fait la moitié du travail de cohésion.", "auteur": "DG, scale-up tourangelle", "detail": "Séminaire résidentiel"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "220", "label": "Convives assis en salle"}, {"value": "4 ha", "label": "De parc clos"}, {"value": "12", "label": "Chambres sur place"}, {"value": "1", "label": "Seul événement à la fois"}];
let STATS = STATS_DEMO;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function DomaineCharmillesPage() {
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
  HERO_DEMO = HERO_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO = HERO_DEMO.map((row, i) => ({
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

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "02 47 00 00 01";
  const telHref = `tel:${fd?.phone ?? "+33247000001"}`;
  const mail = fd?.email ?? "evenements@domaine-charmilles.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i369-nav { display: none !important; } .i369-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i369-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i369-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i369-split { grid-template-columns: 1fr !important; }
          .i369-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i369-stats .i369-statcell { border-right: none !important; }
          .i369-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i369-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Sparkles size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)",  fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Domaine des Charmilles"))}</span>
              
            </>
          )}
        </div>
        <div id="i369-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33247000001"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Réserver une visite
          </motion.a>
        </div>
        <button className="i369-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={`tel:${fd?.phone ?? "+33247000001"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Réserver une visite</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      <section id="hero" style={{ height: "100dvh", minHeight: 640, position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden", background: C.bgDark }}>
        <PortalZoom images={HERO.map((s) => s.img)} index={i} overlay={0.45} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.40) 46%, rgba(8,8,10,0.10) 100%)", pointerEvents: "none" }} />
        <div className="i369-herotext" style={{ position: "relative", zIndex: 1, padding: "0 72px 76px", maxWidth: 860 }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.hi }}>
            Domaine de réception · Val de Loire
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", lineHeight: 1.1, margin: "16px 0 20px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 22) ?? "Le lieu fait"}<br /><em style={{ color: C.hi }}>{clientHeroLine(sessionData, 1, 2, 22) ?? "la moitié du souvenir."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, marginBottom: 32, maxWidth: 520 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Une longère de tuffeau, un parc de quatre hectares, une salle de 220 couverts et des chambres pour les lève-tard : le Domaine des Charmilles reçoit mariages, séminaires et grandes tablées familiales."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              Visiter le domaine <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: "rgba(255,255,255,0.09)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.15)" }}>
              Les espaces
            </motion.a>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color="rgba(255,255,255,0.85)" className="" />
            <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.78)" }}>
              <strong style={{ color: "#fff", fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color="#fff" className="" />
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i369-stats i369-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i369-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i369-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Les espaces</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Un domaine entier,<br /><em>rien que pour vous.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.white, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 18.5, color: C.text, margin: "15px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE / INFOS ─────────────────────────────────────────────── */}
      <section id="methode" className="i369-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Votre événement</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Du premier regard<br /><em>au dernier feu du parc.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontFamily: FONT, fontSize: 28, color: C.accentDark, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.text, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i369-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i369-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(3, (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"))} alt="Cérémonie dans le parc du domaine" loading="lazy" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le domaine</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Beau,<br /><em>et en règle.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: C.accentDark, color: "#fff", borderRadius: 8, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.02 }}>
                Nous appeler <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i369-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Formules</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Le domaine, <em>aux dates vraies.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Le tarif dépend de la saison et du jour — il est publié, pas négocié à la tête du client. Acompte 30 %, solde à J-30.</p>
            </div>
          </Reveal>
          <div style={{ marginTop: 38 }}>
            {TARIFS.map((tt, idx) => (
              <Reveal key={tt.a} delay={idx * 0.06}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 17.5, color: C.text }}>{tt.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{tt.n}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 19, color: C.accentDark, whiteSpace: "nowrap" }}>{tt.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i369-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Des jours <em style={{ color: C.hi }}>qui comptent</em>.</>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.hi} color={C.hi} />)}
                </div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.hi, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i369-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Visites</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Venez à 18 h,<br /><em>quand le parc s'allume.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Visites sur rendez-vous, 7j/7 en saison. Les samedis de mai à septembre 2027 partent vite — l'option de 15 jours est gratuite.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i369-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)",  fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Domaine des Charmilles"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Domaine de réception · Amboise, Val de Loire<br />ERP contrôlé — capacité 220 convives assis</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Amboise, Indre-et-Loire" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Visites sur rendez-vous, 7j/7 en saison" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Domaine des Charmilles"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)",  color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
