"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Ear, Mail, MapPin, Phone, Star, Volume2 } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ParticleOrb } from "@/lib/templates/hero-kit-3";

/* Audioprothésiste, 1re variante. Signature : ParticleOrb — le son rendu visible, un halo de particules qui tourne lentement. Sans photographie. */

let C: Record<string, string> = {
  bg: "#fbf9f4",
  bgSection: "#f3eee2",
  bgDark: "#1e1a12",
  text: "#221d14",
  textMuted: "#6a6152",
  accent: "var(--brand,#8a6a2f)",
  accentDark: "#6b5124",
  accentLight: "#f2e8d2",
  hi: "#d3b878",
  white: "#ffffff",
  border: "#e5dcc8",
};
const FONT = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const NAV = [{"l": "Accompagnements", "h": "#services"}, {"l": "Le parcours", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];

const SERVICES_DEMO = [{"titre": "Bilan auditif complet", "desc": "Audiométrie tonale et vocale en cabine, dans le calme et dans le bruit. Résultats expliqués, compte rendu transmis à votre médecin.", "tag": "Bilan"}, {"titre": "Essai 30 jours", "desc": "Vos appareils réglés puis portés un mois dans votre vraie vie : repas de famille, téléphone, télévision. On ajuste, vous décidez.", "tag": "Essai"}, {"titre": "Appareillage sur mesure", "desc": "Intra-auriculaires invisibles, contours discrets, connectés au téléphone. Toutes grandes marques, choisies pour votre perte, pas pour la marge.", "tag": "Appareils"}, {"titre": "Suivi 4 ans inclus", "desc": "Réglages illimités, nettoyages, contrôles semestriels : inclus dans le prix affiché, comme l'exige le 100 % Santé — et au-delà.", "tag": "Suivi"}, {"titre": "Protections auditives", "desc": "Bouchons sur mesure pour musiciens, chasseurs, travail en bruit et sommeil. Empreintes prises au centre.", "tag": "Protection"}, {"titre": "Acouphènes", "desc": "Bilan spécifique et solutions d'habituation sonore. On ne promet pas de miracle : on améliore le quotidien, mesurablement.", "tag": "Acouphènes"}];
const METHODE = [{"n": "01", "t": "Bilan et écoute", "d": "Une heure pour mesurer votre audition et comprendre vos situations difficiles — la réunion, le restaurant, les aigus."}, {"n": "02", "t": "Choix argumenté", "d": "Deux ou trois appareils proposés avec prix, classe et différences expliquées. Le devis normalisé part avec vous."}, {"n": "03", "t": "Essai d'un mois", "d": "Port réel à domicile, réglages à mi-parcours. Vous ne payez qu'à l'adoption, jamais à l'essai."}, {"n": "04", "t": "Suivi de long terme", "d": "Réglages illimités 4 ans, remplacement des pièces d'usure, contrôle annuel de l'audition."}];
const ENGAGEMENT = ["Audioprothésistes diplômés d'État — le titre est protégé, le nôtre est affiché", "Devis normalisé systématique : classe I (0 € de reste à charge) toujours proposée", "Essai de 30 jours sans engagement, prescription médicale respectée", "Tiers payant Sécurité sociale et mutuelles : aucune avance de frais"];
const TARIFS = [{"a": "Appareil classe I (100 % Santé)", "p": "0 € de reste à charge", "n": "Prix plafonné 950 €, intégralement remboursé Sécurité sociale + mutuelle responsable."}, {"a": "Appareil classe II", "p": "dès 1 190 €", "n": "Technologies premium : réduction de bruit avancée, connectivité, rechargeable. Remboursement partiel."}, {"a": "Bilan auditif", "p": "offert", "n": "Audiométrie complète en cabine. Le bilan médical ORL reste indispensable pour la prescription."}, {"a": "Protections sur mesure", "p": "dès 89 €", "n": "La paire, empreintes et ajustage compris."}];
const AVIS_DEMO = [{"texte": "Trois ans à faire répéter tout le monde. Après l'essai d'un mois, j'ai signé : au repas de Noël, j'ai suivi toutes les conversations, même en bout de table.", "auteur": "Michel P., 71 ans", "detail": "Appareillage classe II"}, {"texte": "Ma mutuelle ne couvre pas grand-chose : l'audioprothésiste a défendu la classe I d'emblée. Zéro euro, et elle entend la télévision sans la mettre à fond.", "auteur": "Fils de Mme R.", "detail": "100 % Santé"}, {"texte": "Acouphènes depuis dix ans. Pas de promesse magique ici, mais un vrai protocole : je dors à nouveau, et le sifflement s'oublie des heures entières.", "auteur": "Laurence V.", "detail": "Prise en charge acouphènes"}];
const STATS = [{"value": "30 j", "label": "D'essai réel, à domicile"}, {"value": "0 €", "label": "Reste à charge classe I"}, {"value": "4 ans", "label": "De suivi et réglages inclus"}, {"value": "2", "label": "Audioprothésistes D.E."}];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}

export default function MaisonAuditionPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fid = "fonts-i339";
    if (document.getElementById(fid)) return;
    const s = document.createElement("style");
    s.id = fid;
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(s);
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    bp?.services?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "02 47 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33247000000"}`;
  const mail = fd?.email ?? "rdv@maison-audition-tours.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i339-nav { display: none !important; } .i339-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i339-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i339-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i339-split { grid-template-columns: 1fr !important; }
          .i339-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i339-stats .i339-statcell { border-right: none !important; }
          .i339-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i339-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Ear size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? "Maison de l'Audition"}</span>
              
            </>
          )}
        </div>
        <div id="i339-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href="tel:+33247000000" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Bilan auditif offert
          </motion.a>
        </div>
        <button className="i339-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href="tel:+33247000000" style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Bilan auditif offert</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      <section className="i339-hero" style={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 80px", overflow: "hidden" }}>
        <ParticleOrb color={C.hi} count={620} seconds={46} className="" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(70vw, 620px)", aspectRatio: "1", opacity: 0.55, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Audioprothésistes · Tours</span>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(36px, 5.2vw, 66px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>
            {c?.heroHeadline ?? (<>Réentendre les voix,<br /><em style={{ color: C.accentDark }}>pas seulement le bruit.</em></>)}
          </h1>
          <p style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.78, maxWidth: 560, margin: "0 auto 32px" }}>
            {c?.heroSubline ?? fd?.tagline ?? "Bilan auditif complet, essai réel de 30 jours à domicile, réglages illimités. Des appareils invisibles au 100 % Santé sans reste à charge — choisis pour votre oreille, pas pour la vitrine."}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 999, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              Réserver un bilan auditif <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, padding: "14px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Nos accompagnements
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i339-stats i339-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i339-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i339-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Accompagnements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                L'audition se règle,<br /><em>elle ne s'achète pas.</em>
              </h2>
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
      <section id="methode" className="i339-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le parcours</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Quatre rendez-vous<br /><em>pour réentendre durablement.</em>
              </h2>
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
      <section id="engagements" className="i339-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i339-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Ear size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                La transparence,<br /><em>jusqu'au tympan.</em>
              </h2>
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
      <section id="tarifs" className="i339-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Le 100 % Santé, <em>pour de vrai.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Depuis 2021, chaque devis comporte obligatoirement une offre 100 % Santé (classe I). Chez nous, elle est présentée en premier — pas en note de bas de page.</p>
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
      <section className="i339-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Ils ont retrouvé <em style={{ color: C.hi }}>les conversations</em>.</h2>
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
      <section id="contact" className="i339-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Bilan offert</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            Trente minutes pour savoir<br /><em>où en est votre audition.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Bilan auditif offert, sans engagement. Venez accompagné : les voix familières sont le meilleur test.</p>
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
      <footer className="i339-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? "Maison de l'Audition"}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Audioprothésistes diplômés d'État · Tours<br />Centre agréé 100 % Santé, tiers payant</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Tours, Indre-et-Loire" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h30 · Sam 9h–13h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? "Maison de l'Audition"} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
