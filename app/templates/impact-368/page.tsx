"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CalendarHeart, CheckCircle, Clock, HeartPulse, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { PanelRise } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
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

/* Cabinet de sages-femmes, 2e variante, cabinet de groupe moderne. Signature : PanelRise — les bandeaux qui s'élèvent. Sans photographie. */

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
/*
  La paire du plan (P5) : « DM Serif Display » porte la voix du thème,
  « DM Sans » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'DM Serif Display', Georgia, 'Times New Roman', serif";
const FONT = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Consultations", "h": "#services"}, {"l": "L'organisation", "h": "#methode"}, {"l": "Prise en charge", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];

const SERVICES_SOURCE = [{"titre": "Suivi de grossesse", "desc": "Grossesses physiologiques suivies de A à Z, monitorings au cabinet, échographies de datation en partenariat. Dossier partagé entre les trois praticiennes.", "tag": "Grossesse"}, {"titre": "Préparation — présentiel & visio", "desc": "8 séances remboursées : classiques, en piscine (partenariat), ou en visio pour les grossesses alitées. Le co-parent est toujours bienvenu.", "tag": "Préparation"}, {"titre": "Post-partum & PRADO", "desc": "Visites à domicile dès la sortie, pesées, allaitement, moral : la première semaine ne se traverse pas seule.", "tag": "Domicile"}, {"titre": "Urgences allaitement", "desc": "Engorgement, crevasses, bébé qui ne prend pas : un créneau d'urgence chaque jour, réservé le matin pour le jour même.", "tag": "Urgence"}, {"titre": "Rééducation périnéale", "desc": "Manuelle et biofeedback, 10 séances remboursées, créneaux du soir pour les reprises de travail.", "tag": "Rééducation"}, {"titre": "Gynécologie & contraception", "desc": "Frottis, pilule, DIU posés au cabinet, conseil sans jugement — de 16 à 96 ans, en bonne santé, la sage-femme suffit.", "tag": "Gynéco"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Un dossier partagé", "d": "Vos informations suivies par les trois praticiennes : en congé ou en garde, quelqu'un qui VOUS connaît répond."}, {"n": "02", "t": "Des créneaux réels", "d": "Soirs jusqu'à 20 h, samedi matin, urgences quotidiennes : l'agenda est fait pour les gens qui travaillent."}, {"n": "03", "t": "La visio quand il faut", "d": "Alitement, distance, bébé endormi : préparation et consultations de suivi possibles en visio remboursée."}, {"n": "04", "t": "Le relais organisé", "d": "Maternités, PMI, ostéopathes, psychologues périnatales : on adresse, on suit, on ne lâche pas le fil."}];
const ENGAGEMENT_DEMO = ["Trois sages-femmes diplômées d'État, conventionnées, inscrites à l'Ordre", "Secrétariat téléphonique humain en semaine, agenda en ligne 24h/24", "Astreinte 7j/7 pour la patientèle en fin de grossesse et post-partum", "Tiers payant systématique — la maternité ne devrait rien coûter d'avance"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
function TARIFS_DEMO_LIVE() {
  return [{"a": "Consultation (suivi, gynéco)", "p": "tarif conventionné", "n": "Tiers payant : carte Vitale, zéro avance."}, {"a": "Préparation naissance (×8)", "p": "100 % prises en charge", "n": "Présentiel, piscine ou visio."}, {"a": "Visite à domicile post-partum", "p": "prise en charge", "n": "PRADO et au-delà si nécessaire, sur " + (clientCity(sessionData) ?? "Caen") + " et 15 km."}, {"a": "Pose de DIU", "p": "tarif conventionné", "n": "Consultation préalable + pose, remboursées."}];
}
let TARIFS_DEMO = TARIFS_DEMO_LIVE();;
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Rendez-vous à 19h30 après le travail, urgence allaitement vue un dimanche matin par la sage-femme de garde qui avait tout mon dossier : ce cabinet est organisé comme on en rêve.", "auteur": "Pauline D.", "detail": "Suivi + urgence allaitement"}, {"texte": "Grossesse alitée : toute la préparation en visio, sans rien rater. Le co-parent assistait depuis son bureau. On est arrivés au jour J prêts tous les deux.", "auteur": "Margaux & Thibault", "detail": "Préparation en visio"}, {"texte": "La rééducation à 19h45, c'est ce qui m'a permis de la faire vraiment, au lieu d'abandonner comme pour l'aîné. Dix séances tenues.", "auteur": "Charlotte V.", "detail": "Rééducation périnéale"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "3", "label": "Sages-femmes D.E."}, {"value": "20h", "label": "Dernier créneau du soir"}, {"value": "J+0", "label": "Urgence allaitement, vue le jour même"}, {"value": "7j/7", "label": "Astreinte patientèle post-partum"}];
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

export default function NeufMoisPage() {
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
  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;
  TARIFS_DEMO = TARIFS_DEMO_LIVE();


  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
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

  const phone = fd?.phone ?? "02 31 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33231000000"}`;
  const mail = fd?.email ?? "secretariat@neufmois-caen.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        @media (max-width: 900px) { #i368-nav { display: none !important; } .i368-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i368-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i368-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i368-split { grid-template-columns: 1fr !important; }
          .i368-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i368-stats .i368-statcell { border-right: none !important; }
          .i368-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i368-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <HeartPulse size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Neuf Mois & Vous"))}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Sages-femmes</span>
            </>
          )}
        </div>
        <div id="i368-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33231000000"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            RDV en ligne
          </motion.a>
        </div>
        <button className="i368-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${fd?.phone ?? "+33231000000"}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>RDV en ligne</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="i368-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Cabinet de sages-femmes · {clientCity(sessionData) ?? "Caen"}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(34px, 4.6vw, 60px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 18) ?? "Trois sages-femmes,"}<br /><em style={{ color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 18) ?? "des créneaux qui existent vraiment."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Un cabinet de groupe pensé pour les agendas réels : créneaux du soir et du samedi, urgences allaitement le jour même, cours en visio pour les alitées — et trois praticiennes qui partagent vos dossiers."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Nos consultations
            </motion.a>
          </motion.div>
          
        </div>
        <div className="i368-card"><div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3.2", justifyContent: "center" , overflow: "hidden" }}><img src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/7108415/pexels-photo-7108415.jpeg?auto=compress&cs=tinysrgb&w=1400"))} alt="Échographie de contrôle" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <PanelRise><section style={{ background: C.bgDark }}>
        <div className="i368-stats i368-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i368-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section></PanelRise>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i368-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Consultations</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Tous les suivis,<br /><em>tous les emplois du temps.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.white, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT_TITRE, fontSize: 18.5, color: C.text, margin: "15px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE / INFOS ─────────────────────────────────────────────── */}
      <section id="methode" className="i368-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'organisation</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Un cabinet de groupe,<br /><em>pas trois cabinets côte à côte.</em>
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
      <section id="engagements" className="i368-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i368-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le cabinet</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Sérieuses,<br /><em>et joignables.</em>
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
      <section id="tarifs" className="i368-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prise en charge</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Remboursé, <em>et sans avance.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Tarifs conventionnés secteur 1. Prise en charge à 100 % du 6e mois de grossesse au 12e jour post-natal, tiers payant systématique.</p>
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
      <section className="i368-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Suivies, <em style={{ color: C.hi }}>vraiment</em>.</>)}</h2>
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
      <section id="contact" className="i368-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>On vous attend</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Un cabinet qui répond,<br /><em>ça existe encore.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Agenda en ligne 24h/24, secrétariat en semaine, urgences allaitement réservées chaque matin pour le jour même.</p>
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
      <footer className="i368-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Neuf Mois & Vous"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Cabinet de sages-femmes · {clientCity(sessionData) ?? "Caen"}<br />Conventionnées CPAM — Ordre des sages-femmes</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? ((clientCity(sessionData) ?? "Caen") + ", Calvados")) }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Lun–Sam 8h–20h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Neuf Mois & Vous"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
