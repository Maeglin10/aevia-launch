"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Cross, Mail, MapPin, Phone, Star, Syringe } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { StickyProgress } from "@/lib/templates/hero-kit-3";
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

/* Pharmacie, 2e variante (la 1re est impact-330, MosaicPush). Signature : StickyProgress — le parcours de l'ordonnance, étape par étape, pendant que le titre reste épinglé. Sans photographie. */

let C: Record<string, string> = {
  bg: "#faf8fb",
  bgSection: "#f0ebf4",
  bgDark: "#231a2b",
  text: "#211a28",
  textMuted: "#655d6d",
  accent: "var(--brand,#6d4a8a)",
  accentDark: "#54386b",
  accentLight: "#e9def2",
  hi: "#bda0d8",
  white: "#ffffff",
  border: "#e2d9ea",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Services", "h": "#services"}, {"l": "Infos pratiques", "h": "#methode"}, {"l": "Prise en charge", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];
const PARCOURS = [{"n": "01", "title": "Photographiez", "body": "L'ordonnance en entier, recto complet, depuis votre téléphone. Un mail suffit — pas d'application à installer."}, {"n": "02", "title": "Nous préparons", "body": "Vérification des interactions, substitutions expliquées si besoin, tout est prêt et mis de côté sous deux heures."}, {"n": "03", "title": "Vous passez", "body": "Moins de cinq minutes au comptoir dédié. Carte Vitale et mutuelle : tiers payant appliqué, aucune avance de frais."}, {"n": "04", "title": "Nous suivons", "body": "Renouvellements anticipés, rappels quand il est temps, et un pharmacien joignable pour toute question sur le traitement."}];
const SERVICES_DEMO = [{"titre": "Ordonnances & renouvellements", "desc": "Préparation anticipée par mail, renouvellement des traitements chroniques dans le cadre légal, livraison possible pour les patients isolés.", "tag": "Comptoir"}, {"titre": "Vaccination", "desc": "Grippe, COVID-19, rappels dTP : par nos pharmaciens formés, sans rendez-vous, tracé dans votre carnet de vaccination électronique.", "tag": "Prévention"}, {"titre": "Tests rapides", "desc": "Angine (TROD), glycémie, tension : résultat en quelques minutes et orientation médicale quand c'est nécessaire.", "tag": "Dépistage"}, {"titre": "Entretiens pharmaceutiques", "desc": "Asthme, anticoagulants, chimiothérapie orale : des entretiens de suivi pris en charge par l'Assurance Maladie.", "tag": "Suivi"}, {"titre": "Matériel médical", "desc": "Location et vente : cannes, fauteuils, lits médicalisés, tire-lait. Tarifs LPP, tiers payant sur ordonnance, livraison à domicile.", "tag": "Matériel"}, {"titre": "Préparations magistrales", "desc": "Préparatoire agréé sur place : dosages pédiatriques, gélules à façon, préparations dermatologiques sur prescription.", "tag": "Préparatoire"}];
const METHODE = [{"n": "01", "t": "Horaires étendus", "d": "Lun–Sam 8h30–19h30 sans interruption, sous l'horloge de la Grande Rue."}, {"n": "02", "t": "Comptoir ordonnances", "d": "File dédiée aux ordonnances préparées : moins de cinq minutes, mesuré chaque mois."}, {"n": "03", "t": "Accès et parking", "d": "Arrêt de tram à 50 m, parking Saint-Pierre gratuit 30 minutes avec validation."}, {"n": "04", "t": "Garde et urgences", "d": "En dehors de nos horaires, composez le 3237 pour la pharmacie de garde, le 15 pour le SAMU."}];
const ENGAGEMENT_DEMO = ["Inscrite à l'Ordre national des pharmaciens — licence n° 25#002214", "Un pharmacien diplômé d'État présent à chaque heure d'ouverture", "Tiers payant carte Vitale + mutuelle : aucune avance de frais", "Secret professionnel au comptoir : un espace de confidentialité dédié"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Vaccination grippe", "p": "prise en charge", "n": "Sur bon de l'Assurance Maladie pour les publics éligibles ; sinon vaccin + injection au tarif affiché."}, {"a": "Entretien pharmaceutique", "p": "remboursé", "n": "Asthme, AVK, anticancéreux oraux : pris en charge à 100 % par l'Assurance Maladie."}, {"a": "Location lit médicalisé", "p": "tarif LPP", "n": "Tiers payant intégral sur ordonnance, livraison et installation comprises."}, {"a": "Test angine (TROD)", "p": "pris en charge", "n": "Sur orientation ou sans ordonnance selon votre situation — résultat en 10 minutes."}];
let TARIFS = TARIFS_DEMO;
const AVIS_DEMO = [{"texte": "Le traitement de mon père fait onze lignes. Je l'envoie par mail, tout est prêt, vérifié, et la pharmacienne m'a signalé une interaction que l'hôpital avait ratée.", "auteur": "Sylvie R.", "detail": "Renouvellement chronique"}, {"texte": "Vaccinée un samedi matin en cinq minutes, rappel dTP vérifié au passage. C'est exactement ce qu'on attend d'une pharmacie de quartier.", "auteur": "Inès K.", "detail": "Vaccination"}, {"texte": "Lit médicalisé livré et installé en 24 h pour mon mari, tiers payant complet, explications posées. Merci pour l'humanité.", "auteur": "Colette D.", "detail": "Matériel médical"}];
const STATS_DEMO = [{"value": "2 h", "label": "Ordonnance préparée"}, {"value": "6 j/7", "label": "Sans interruption"}, {"value": "0 €", "label": "D'avance de frais"}, {"value": "5", "label": "Pharmaciens diplômés"}];
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

export default function PharmacieHorlogePage() {
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
  


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "03 81 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33381000000"}`;
  const mail = fd?.email ?? "ordonnances@pharmacie-horloge.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i336-nav { display: none !important; } .i336-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i336-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i336-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i336-split { grid-template-columns: 1fr !important; }
          .i336-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i336-stats .i336-statcell { border-right: none !important; }
          .i336-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i336-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Cross size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie de l'Horloge"))}</span>
              
            </>
          )}
        </div>
        <div id="i336-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`mailto:${fd?.email ?? "ordonnances@pharmacie-horloge.fr"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Envoyer mon ordonnance
          </motion.a>
        </div>
        <button className="i336-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`mailto:${fd?.email ?? "ordonnances@pharmacie-horloge.fr"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Envoyer mon ordonnance</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="i336-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Pharmacie · Besançon centre
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(34px, 4.6vw, 60px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>
            {c?.heroHeadline ?? (<>La santé de quartier,<br /><em style={{ color: C.accentDark }}>au rythme de l'horloge.</em></>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            {c?.heroSubline ?? fd?.tagline ?? "Ordonnance envoyée le matin, prête à midi. Vaccination sans rendez-vous, tests rapides, matériel médical — et de vrais conseils au comptoir, pas une file d'attente."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={`mailto:${mail}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Envoyer mon ordonnance <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Nos services
            </motion.a>
          </motion.div>
          
        </div>
        <div className="i336-card"><div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3.2", justifyContent: "center" , overflow: "hidden" }}><img src={photo(0, "https://images.pexels.com/photos/8657373/pexels-photo-8657373.jpeg?auto=compress&cs=tinysrgb&w=1400")} alt="Comptoir de la pharmacie" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i336-stats i336-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i336-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Signature : StickyProgress ─────────────────────────────────── */}
      <section className="i336-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <StickyProgress
            steps={PARCOURS}
            className="i336-split"
            style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: 40 }}
            renderTitle={(active) => (
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le parcours</span>
                <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 44px)", color: C.text, lineHeight: 1.15, margin: "12px 0 0" }}>
                  Votre ordonnance,<br /><em style={{ color: C.accentDark }}>quatre temps, zéro attente.</em>
                </h2>
                <div style={{ marginTop: 26, display: "flex", gap: 8 }}>
                  {PARCOURS.map((st, n) => (
                    <motion.span key={st.n} className="block" animate={{ width: n === active ? 44 : 18, opacity: n === active ? 1 : 0.3 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ display: "block", height: 3, borderRadius: 99, background: C.accent }} />
                  ))}
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i336-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos services</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Une officine qui soigne,<br /><em>pas un libre-service.</em>
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
      <section id="methode" className="i336-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Infos pratiques</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Venir, se garer,<br /><em>être servi vite.</em>
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
      <section id="engagements" className="i336-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i336-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Cross size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Une officine de l'Ordre</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                Ce que garantit<br /><em>une vraie pharmacie.</em>
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
      <section id="tarifs" className="i336-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prise en charge</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Remboursé, <em>expliqué.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>La plupart de nos actes sont pris en charge par l'Assurance Maladie. Ce qui reste à votre charge est annoncé avant, jamais découvert en caisse.</p>
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
      <section className="i336-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Le quartier <em style={{ color: C.hi }}>en parle</em>.</h2>
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
      <section id="contact" className="i336-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>À votre service</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            Une question santé ?<br /><em>Un pharmacien répond.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Par téléphone aux horaires d'ouverture, ou passez : le conseil ne prend pas de ticket.</p>
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
      <footer className="i336-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie de l'Horloge"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Pharmacie d'officine · {clientCity(sessionData) ?? "Besançon"}<br />Ordre national des pharmaciens — licence n° 25#002214</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Besançon, Doubs" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Sam 8h30–19h30 · Garde : 3237" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie de l'Horloge"))} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
