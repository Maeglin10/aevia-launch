"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Car, CheckCircle, Clock, Mail, MapPin, Phone, Star, Zap } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { HardCutRebuild } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
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

/* Auto-école, 2e variante, urbaine et directe, public jeune. Signature : HardCutRebuild — on cale, coupure nette, on redémarre pièce par pièce. Sans photographie. */

let C: Record<string, string> = {
  bg: "#0b0d11",
  bgSection: "#101319",
  bgDark: "#07090c",
  text: "#f2f1ed",
  textMuted: "#9aa0ab",
  accent: "var(--brand,#f2760a)",
  accentDark: "#f2a25c",
  accentLight: "#1c1610",
  hi: "#f2a25c",
  white: "#12151b",
  border: "rgba(255,255,255,0.09)",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Formations", "h": "#services"}, {"l": "Comment ça marche", "h": "#methode"}, {"l": "Formules", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO_SOURCE = [{"k": "Permis B", "line": "TU CALES ? ON REPART.", "sub": "La boîte manuelle apprise sans drame, en créneaux qui collent à tes cours ou ton taf."}, {"k": "Code intensif", "line": "LE CODE EN 3 SEMAINES.", "sub": "Stage accéléré encadré par un moniteur, examen dans la foulée dans un centre partenaire."}, {"k": "Permis boost", "line": "18 H CHRONO, PRÊT.", "sub": "Évaluation, plan d'heures serré, examens blancs filmés et débriefés."}];
let HERO = HERO_SOURCE;

function SERVICES_SOURCE_LIVE() {
  return [{"titre": "Code accéléré", "desc": "Stage de 3 jours + accès illimité à l'application. Séances de correction en direct avec moniteur, pas un écran qui débite.", "tag": "Code"}, {"titre": "Permis B", "desc": "Créneaux 7h-21h et le samedi. Moniteur référent, livret numérique, points bloquants traités au simulateur avant la voiture.", "tag": "Conduite"}, {"titre": "Simulateur nouvelle génération", "desc": "Premières heures et situations à risque (pluie, nuit, autoroute) travaillées au simulateur — comptabilisées dans le forfait, deux fois moins chères.", "tag": "Simu"}, {"titre": "Conduite supervisée", "desc": "Après 18 ans : réduis le coût entre deux présentations en conduisant avec un proche, cadré par nous.", "tag": "Supervisée"}, {"titre": "Stage dernière ligne droite", "desc": "6 h sur les parcours d'examen de " + (clientCity(sessionData) ?? "Montpellier") + " la semaine du passage, examen blanc filmé et débriefé.", "tag": "Examen"}, {"titre": "CPF & financements", "desc": "Permis B éligible CPF, permis à 1 €/jour pour les 15-25 ans, mission locale acceptée. On monte le dossier avec toi.", "tag": "Financement"}];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();;
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Éval de départ offerte", "d": "45 min en voiture. Ton volume d'heures estimé est écrit au contrat — et on s'y tient."}, {"n": "02", "t": "Résa en ligne 24h/24", "d": "Tes créneaux depuis ton téléphone, annulation gratuite 48 h avant, liste d'attente automatique."}, {"n": "03", "t": "Simulateur + voiture", "d": "Le simulateur déblaye les bases et les situations à risque ; la voiture sert à progresser, pas à répéter."}, {"n": "04", "t": "Examens blancs filmés", "d": "Deux passages blancs filmés et débriefés image par image. Le jour J, tu l'as déjà vécu."}];
const ENGAGEMENT_DEMO = ["Agrément préfectoral E 26 034 0118 0, moniteurs diplômés Titre Pro ECSR", "Taux de réussite affichés en vitrine et en ligne, mis à jour chaque trimestre", "Heure supplémentaire au prix du forfait, écrit au contrat", "Frais de transfert de dossier : 0 € — tu restes parce que ça marche, pas parce que c'est cher de partir"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Code intensif (3 jours + appli)", "p": "330 €", "n": "Jusqu'à réussite, examen en centre partenaire à 30 € en sus (tarif d'État)."}, {"a": "Forfait 20 h mixte simu/voiture", "p": "1 290 €", "n": "6 h simulateur + 14 h voiture, examens blancs filmés inclus."}, {"a": "Forfait 20 h tout voiture", "p": "1 450 €", "n": "Créneaux soir et samedi sans supplément."}, {"a": "Heure supplémentaire", "p": "45 €", "n": "Identique au tarif forfait, réservable à l'unité en ligne."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Le simulateur m'a évité de griller 6 heures de voiture à apprendre l'embrayage. Permis en 4 mois en bossant à côté, créneaux du samedi nickel.", "auteur": "Inès B., 22 ans", "detail": "Forfait mixte"}, {"texte": "L'examen blanc filmé, ça pique — mais le jour J j'avais déjà corrigé mes deux défauts. Reçue, 29/31.", "auteur": "Manon F., 19 ans", "detail": "Stage dernière ligne droite"}, {"texte": "Code en 3 semaines en sortant du lycée, permis avant la fac. Résa en ligne à minuit depuis mon lit : c'est comme ça que ça devrait marcher partout.", "auteur": "Adam R., 18 ans", "detail": "Code intensif + B"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "75 %", "label": "Réussite 1er passage"}, {"value": "7 j/7", "label": "Réservation en ligne 24h/24"}, {"value": "3 sem.", "label": "Pour le code en intensif"}, {"value": "4×", "label": "Paiement sans frais"}];
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

export default function PermisCapSudPage() {
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
  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();




  // L'accroche du client remplace la première ligne du carrousel : c'est la


  // seule des trois qui parle de lui, les autres décrivent des spécialités.


  HERO = clientTagline({ formData: fd, generatedContent: c })


    ? HERO_SOURCE.map((h, i) => (i === 0 ? { ...h, line: clientTagline({ formData: fd, generatedContent: c })! } : h))


    : HERO_SOURCE;
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
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "04 67 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33467000000"}`;
  const mail = fd?.email ?? "go@permis-cap-sud.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i342-nav { display: none !important; } .i342-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i342-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i342-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i342-split { grid-template-columns: 1fr !important; }
          .i342-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i342-stats .i342-statcell { border-right: none !important; }
          .i342-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i342-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Car size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Permis Cap Sud"))}</span>
              
            </>
          )}
        </div>
        <div id="i342-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33467000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Inscription
          </motion.a>
        </div>
        <button className="i342-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${fd?.phone ?? "+33467000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Inscription</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      <section className="i342-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px 64px 70px", maxWidth: 1080, margin: "0 auto" }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Auto-école · {clientCity(sessionData) ?? "Montpellier"}</span>
        <HardCutRebuild index={i} stagger={0.09}>
              {[
                <div key="k" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{S.k}</div>,
                <h1 key="h" style={{ fontFamily: FONT, fontSize: "clamp(36px, 5.4vw, 68px)", fontWeight: 800, color: C.text, lineHeight: 1.05, margin: "0 0 14px" }}>{S.line}</h1>,
                <p key="d" style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 540, margin: 0 }}>{S.sub}</p>,
              ]}
            </HardCutRebuild>
        <p style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 560, margin: "14px 0 32px" }}>
          {fd?.tagline ?? c?.heroSubline ?? "Code en accéléré, conduite en créneaux du soir et du samedi, résultats affichés à la vitrine. Pas de blabla : un plan d'heures écrit, un prix qui ne bouge pas, ton permis."}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
            Je m'inscris <ArrowRight size={16} />
          </motion.a>
          <motion.a href="#tarifs" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
            Les formules
          </motion.a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 44, flexWrap: "wrap" }}>
          <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textMuted} className="" />
          <span style={{ fontSize: 13.5, color: C.textMuted }}><strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}</span>
          <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i342-stats i342-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i342-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i342-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Formations</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Le permis,<br /><em>version efficace.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5 }} style={{ background: C.white, borderRadius: 12, padding: "26px 24px", border: `1px solid ${C.border}`, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accent, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 18.5, color: C.text, margin: "15px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE / INFOS ─────────────────────────────────────────────── */}
      <section id="methode" className="i342-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Comment ça marche</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Un plan d'heures,<br /><em>pas un compteur qui tourne.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 24px", height: "100%" }}>
                  <div style={{ fontFamily: FONT, fontSize: 28, color: C.accent, marginBottom: 12 }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.text, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i342-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i342-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src={photo(0, "https://images.pexels.com/photos/9518030/pexels-photo-9518030.jpeg?auto=compress&cs=tinysrgb&w=1400")} alt="Élève au volant en conduite urbaine" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Tout est affiché,<br /><em>même ce qui fâche.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: C.accent, color: "#101010", borderRadius: 8, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.02 }}>
                Nous appeler <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="i342-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Formules</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des prix nets, <em>paiement en 4×.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Tous les forfaits incluent les frais de dossier et une présentation à l'examen. Paiement en 4 fois sans frais, CPF accepté.</p>
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
                  <div style={{ fontFamily: FONT, fontSize: 19, color: C.accent, whiteSpace: "nowrap" }}>{tt.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i342-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Ils l'ont eu <em style={{ color: C.hi }}>du premier coup</em>.</>)}</h2>
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
      <section id="contact" className="i342-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>On t'attend</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Passe à l'agence,<br /><em>repars avec un plan.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Évaluation offerte, plan d'heures écrit, dossier CPF monté sur place. L'agence est ouverte non-stop, même entre midi et deux.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i342-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Permis Cap Sud"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Auto-école agréée · {clientCity(sessionData) ?? "Montpellier"}<br />Agrément préfectoral E 26 034 0118 0</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Montpellier") + ", Hérault" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Sam 9h–19h non-stop" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Permis Cap Sud"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
