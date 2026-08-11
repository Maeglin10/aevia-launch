"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, Flower2 } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HeldSwap } from "@/lib/templates/hero-kit-2";
import {
  clientCertifications,
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
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

/* Pompes funèbres — donneur : impact-95 (Lumière Clinic, clair et apaisé,
   Cormorant Garamond). Signature : HeldSwap avec DWELL.slow — le temps mort
   tenu (0,5 s de scène vide) est ce qui rend un hero cher, et ici il porte
   aussi le respect. Rythme le plus lent du kit, 5,6 s par temps. Aucune
   flèche pressante : l'index seul, discret. */

let C: Record<string, string> = {
  bg: "#faf9f6", bgSection: "#f1efe9", bgDark: "#23262b",
  text: "#26241f", textMuted: "#6f6a61",
  accent: "var(--brand,#5a6b5d)", accentDark: "#42503f", accentLight: "#e9ede8",
  gold: "#a89468",
  white: "#ffffff", border: "#e3e0d7",
  shadow: "0 2px 14px rgba(38,36,31,0.06)", shadowLg: "0 18px 52px rgba(90,107,93,0.16)",
};
const FONT = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const NAV = [
  { l: "Accompagnement", h: "#accompagnement" },
  { l: "Prévoyance", h: "#prevoyance" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Trois temps de l'accompagnement, tenus lentement dans le hero.
   Photos : URLs déjà présentes dans le repo (nature, fleurs). */
function HERO_TEMPS_DEMO_LIVE() {
  return [
  {
    k: "Obsèques",
    line: "Organiser des obsèques justes, à l'image de la personne.",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"),
    alt: "Paysage calme au lever du jour",
  },
  {
    k: "Cérémonie",
    line: "Une cérémonie qui ressemble à celle ou celui qu'on entoure.",
    img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80"),
    alt: "Composition florale de cérémonie",
  },
  {
    k: "Prévoyance",
    line: "Décider pour soi, pour épargner ces choix à ses proches.",
    img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80"),
    alt: "Massif de fleurs en pleine lumière",
  },
];
}
let HERO_TEMPS_DEMO = HERO_TEMPS_DEMO_LIVE();
let HERO_TEMPS = HERO_TEMPS_DEMO;

const SERVICES_SOURCE = [
  { titre: "Organisation d'obsèques", desc: "Inhumation ou crémation. Un interlocuteur unique organise tout : cercueil, transport, cérémonie, mise en relation avec le cimetière ou le crématorium.", tag: "24h/24" },
  { titre: "Démarches administratives", desc: "Déclaration de décès, état civil, caisses de retraite, banques, notaire : nous préparons et suivons jusqu'à vingt courriers et dossiers pour vous.", tag: "Inclus" },
  { titre: "Chambre funéraire", desc: "Salons de recueillement privés, accessibles à la famille 7j/7 de 8h à 20h, en dehors de toute contrainte horaire d'hôpital.", tag: "Recueillement" },
  { titre: "Cérémonies personnalisées", desc: "Religieuses, laïques ou mixtes. Maître de cérémonie, musiques, textes, hommages — préparés avec vous, à votre rythme.", tag: "Sur mesure" },
  { titre: "Marbrerie & monuments", desc: "Création, restauration et entretien de monuments. Gravures, porcelaine, jardinières — devis clair avant toute intervention.", tag: "Marbrerie" },
  { titre: "Contrats de prévoyance", desc: "Vos volontés écrites et financées à l'avance, capital garanti. Mensualisable, modifiable, et opposable le moment venu.", tag: "Prévoyance" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const ENGAGEMENT_DEMO = [
  "Habilitation préfectorale n° 26-31-0142 — Préfecture de la Haute-Garonne",
  "Devis-type réglementé, gratuit et sans engagement, conforme à l'arrêté du 23 août 2010",
  "Un seul interlocuteur, joignable 24h/24, du premier appel à l'après-obsèques",
  "Toutes confessions, cérémonies civiles et laïques respectées",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Obsèques avec crémation", p: "dès 2 890 €", n: "Cercueil chêne, transport, démarches, redevance de crémation incluse. Devis-type détaillé remis avant toute signature." },
  { a: "Obsèques avec inhumation", p: "dès 3 200 €", n: "Hors concession funéraire, dont le prix dépend de la commune. Le devis distingue prestations obligatoires et optionnelles." },
  { a: "Contrat de prévoyance", p: "dès 32 €/mois", n: "Capital garanti, volontés consignées. Souscription possible à tout âge, à l'agence ou à domicile." },
  { a: "Entretien de sépulture", p: "dès 90 €/an", n: "Nettoyage, fleurissement à la Toussaint, photo envoyée après chaque passage." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Nous avons été reçus le soir même, sans précipitation. Chaque choix nous a été expliqué avec le prix en face. Personne n'a cherché à nous vendre quoi que ce soit de plus.", auteur: "Famille M.", detail: "Obsèques d'un père" },
  { texte: "La cérémonie laïque préparée avec le maître de cérémonie ressemblait vraiment à ma sœur. Les textes, la musique, tout était juste. Merci pour cette dignité.", auteur: "Claire V.", detail: "Cérémonie personnalisée" },
  { texte: "J'ai souscrit un contrat de prévoyance après le décès de mon mari, pour que mes enfants n'aient jamais à traverser ce que j'ai traversé. Tout est écrit, tout est financé.", auteur: "Jeanne R.", detail: "Contrat de prévoyance" },
];
let AVIS_DEMO = AVIS_SOURCE;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function MaisonEstevePage() {
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

  useEffect(() => {
    const id = "fonts-maison-esteve";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(s);
  }, []);

  fd = session?.formData;

  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  HERO_TEMPS_DEMO = HERO_TEMPS_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO_TEMPS = HERO_TEMPS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
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
  /* Le rythme le plus lent du kit : 5,6 s par temps, transition tenue. */
  const { i } = useSlides(HERO_TEMPS.length, DWELL.slow);
  const temps = HERO_TEMPS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "05 61 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33561000000"}`;

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i328-nav { display: none !important; } .i328-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i328-hero { grid-template-columns: 1fr !important; padding: 116px 24px 46px !important; gap: 34px !important; }
          .i328-heldcard { max-width: 380px; margin: 0 auto; }
          .i328-split { grid-template-columns: 1fr !important; }
          .i328-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      {/* ── Bandeau 24h/24 ──────────────────────────────────────────────── */}
      <div style={{ background: C.bgDark, color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center", padding: "9px 16px" }}>
        Nous sommes joignables 24h/24, 7j/7 —{" "}
        <a href={telHref} style={{ color: "#fff", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, padding: "8px 2px" }}>{phone}</a>
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: "rgba(250,249,246,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "border 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Flower2 size={17} color={C.accent} />
              <span style={{ fontFamily: FONT, fontSize: 21, color: C.text, fontWeight: 500 }}>{fd?.businessName ?? "Maison Estève"}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Pompes funèbres</span>
            </>
          )}
        </div>
        <div id="i328-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Nous joindre
          </a>
        </div>
        <button className="i328-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 111, left: 0, right: 0, zIndex: 99, background: "rgba(250,249,246,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Nous joindre</a>
        </div>
      )}

      {/* ── HERO — HeldSwap, tenu lentement ─────────────────────────────── */}
      <section className="i328-hero" style={{ minHeight: "calc(100dvh - 111px)", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: 60, alignItems: "center", padding: "70px 64px 60px", maxWidth: 1240, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>
            Pompes funèbres & prévoyance · {clientCity(sessionData) ?? "Toulouse"}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.0, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(36px, 4.8vw, 64px)", fontWeight: 400, color: C.text, lineHeight: 1.12, margin: "18px 0 22px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 21) ?? "Accompagner,"}<br /><em style={{ color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 21) ?? "avec calme et clarté."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.8, maxWidth: 470, marginBottom: 34 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Depuis trois générations, notre maison organise des obsèques dignes et des cérémonies fidèles à la personne — au prix annoncé, sans jamais rien presser."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.9 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "15px 30px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
              <Phone size={16} /> Nous joindre — 24h/24
            </a>
            <a href="#prevoyance" style={{ color: C.text, border: `1px solid ${C.border}`, background: C.white, borderRadius: 3, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
              Anticiper pour ses proches
            </a>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 44 }}>
            <SlideIndex i={i} total={HERO_TEMPS.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted }}>{temps.k}</span>
          </div>
        </div>

        {/* Le panneau tenu : il entre, se pose, reste. Le temps mort entre
            deux temps est voulu — c'est lui qui porte le respect. */}
        <div className="i328-heldcard">
          <HeldSwap index={i} tilt={7}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", boxShadow: C.shadowLg }}>
              <img src={photo(i, temps.img)} alt={temps.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4/3.4", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "24px 26px 26px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 10 }}>{temps.k}</div>
                <div style={{ fontFamily: FONT, fontSize: 21, fontWeight: 400, color: C.text, lineHeight: 1.4 }}>{temps.line}</div>
              </div>
            </div>
          </HeldSwap>
        </div>
      </section>

      {/* ── ACCOMPAGNEMENT ──────────────────────────────────────────────── */}
      <section id="accompagnement" className="i328-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre accompagnement</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 400, color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "accompagnement.titre") ?? (<>
                Tout est pris en charge.<br /><em>Rien ne vous est imposé.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <div style={{ background: C.white, borderRadius: 4, padding: "28px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 2, padding: "4px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 21, fontWeight: 500, color: C.text, margin: "16px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÉVOYANCE ──────────────────────────────────────────────────── */}
      <section id="prevoyance" className="i328-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div className="i328-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(4, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80")} alt="Horizon paisible au petit matin" loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Une maison de confiance</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 400, color: C.text, margin: "12px 0 26px", lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "prevoyance.titre") ?? (<>
                Ce que la loi garantit,<br /><em>ce que nous y ajoutons.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, background: C.accent, color: "#fff", borderRadius: 3, padding: "14px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                Parler prévoyance <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i328-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 400, color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des prix <em>annoncés avant tout.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.75 }}>
                Le devis-type réglementé distingue prestations obligatoires, courantes et optionnelles. Il est gratuit, remis avant tout engagement, et reste valable si vous consultez d'autres maisons.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: 40 }}>
            {TARIFS.map((t, idx) => (
              <Reveal key={t.a} delay={idx * 0.06}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "20px 24px", marginBottom: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 500, color: C.text }}>{t.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{t.n}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 20, color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─────────────────────────────────────────────────── */}
      <section className="i328-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 44px)", fontWeight: 400, color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
              Des familles <em style={{ color: C.gold }}>nous écrivent</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, padding: "26px 24px", height: "100%" }}>
                <p style={{ fontFamily: FONT, fontSize: 17, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.gold, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i328-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>À votre écoute</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 400, color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            À toute heure,<br /><em>quelqu'un répond.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75 }}>
            En cas de décès, appelez-nous : nous nous déplaçons et prenons le relais immédiatement, de jour comme de nuit.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "16px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
              <Phone size={18} /> {phone}
            </a>
            <a href={`mailto:${fd?.email ?? "contact@maison-esteve.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 3, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
              <Mail size={18} /> Nous écrire
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i328-pad" style={{ background: C.bgDark, padding: "46px 64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 20, color: C.gold, marginBottom: 8 }}>{fd?.businessName ?? "Maison Estève"}</div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7 }}>
                Pompes funèbres & prévoyance · {clientCity(sessionData) ?? "Toulouse"}<br />
                Habilitation préfectorale n° 26-31-0142
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Toulouse") + ", Haute-Garonne" }, { icon: <Phone size={13} />, t: `${phone} — 24h/24, 7j/7` }, { icon: <Clock size={13} />, t: "Agence : Lun–Sam 8h30–18h30" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.gold }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Maison Estève"} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
