"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Cross, Syringe, Pill, HeartPulse, Baby, Stethoscope, ShieldCheck } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { MosaicPush } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientName,
  clientReviews,
  clientServices,
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

/* Pharmacie / parapharmacie — donneur : impact-30 (Smile Studio, clair et
   rassurant). Signature : MosaicPush. La grille qui pousse, c'est le
   rayonnage de l'officine : chaque univers arrive rayon par rayon.
   Hero sans photographie (aucune image d'officine vérifiée dans le repo) :
   tuiles CSS — pictogramme, teinte, libellé — comme une signalétique. */

let C: Record<string, string> = {
  bg: "#f7faf8", bgSection: "#eef4f0", bgDark: "#123528",
  text: "#14231c", textMuted: "#5b6b62",
  accent: "var(--brand,#1a7a52)", accentDark: "#125c3d", accentLight: "#dcefe5",
  mint: "#7fc7a4",
  white: "#ffffff", border: "#dce6df",
  shadow: "0 2px 14px rgba(20,35,28,0.07)", shadowLg: "0 18px 52px rgba(26,122,82,0.18)",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Ordonnances", h: "#ordonnances" },
  { l: "Infos pratiques", h: "#infos" },
  { l: "Contact", h: "#contact" },
];

/* Trois univers du rayonnage, chacun en trois tuiles CSS. */
const HERO_UNIVERS = [
  {
    k: "Ordonnances",
    line: "Votre ordonnance préparée avant votre arrivée.",
    tiles: [
      { icon: Pill, t: "Renouvellement", d: "Traitements chroniques suivis, rappels quand il est temps.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: ShieldCheck, t: "Tiers payant", d: "Aucune avance de frais avec carte Vitale et mutuelle.", bg: "#123528", fg: "#dcefe5" },
      { icon: Stethoscope, t: "Conseil du pharmacien", d: "Interactions vérifiées à chaque délivrance.", bg: "#f2ecdc", fg: "#5c4a1e" },
    ],
  },
  {
    k: "Prévention",
    line: "Vaccins et dépistage, sans rendez-vous médical.",
    tiles: [
      { icon: Syringe, t: "Vaccination", d: "Grippe, COVID, rappels — pharmaciens formés, sur place.", bg: "#123528", fg: "#dcefe5" },
      { icon: HeartPulse, t: "Tests TROD", d: "Angine, glycémie, tension : résultat en quelques minutes.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: CheckCircle, t: "Entretiens", d: "Asthme, anticoagulants : suivis personnalisés remboursés.", bg: "#e8e9f4", fg: "#2e3470" },
    ],
  },
  {
    k: "Parapharmacie",
    line: "Le dermo-conseil, pas seulement le rayon.",
    tiles: [
      { icon: Baby, t: "Bébé & maman", d: "Lait, soins, tire-lait en location sur ordonnance.", bg: "#f2ecdc", fg: "#5c4a1e" },
      { icon: Cross, t: "Matériel médical", d: "Béquilles, lits, tensiomètres — vente et location LPP.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: Star, t: "Dermo-cosmétique", d: "Peaux sensibles et traitements : conseils de diplômés.", bg: "#123528", fg: "#dcefe5" },
    ],
  },
];

const SERVICES_SOURCE = [
  { titre: "Ordonnances & renouvellement", desc: "Envoyez la photo de votre ordonnance : elle vous attend, préparée et vérifiée. Renouvellement des traitements chroniques dans le cadre légal.", tag: "Click & collect" },
  { titre: "Vaccination à l'officine", desc: "Grippe, COVID-19 et rappels du calendrier vaccinal, par nos pharmaciens formés. Sans rendez-vous, traçé dans votre carnet.", tag: "Prévention" },
  { titre: "Tests rapides (TROD)", desc: "Angine, glycémie, tension artérielle. Résultat en quelques minutes, orientation vers le médecin quand c'est nécessaire.", tag: "Dépistage" },
  { titre: "Entretiens pharmaceutiques", desc: "Asthme, anticoagulants (AVK), chimiothérapie orale : des entretiens de suivi pris en charge par l'Assurance Maladie.", tag: "Suivi" },
  { titre: "Matériel médical & location", desc: "Cannes, béquilles, lits médicalisés, tire-lait. Vente et location au tarif LPP, tiers payant sur ordonnance.", tag: "Location" },
  { titre: "Parapharmacie & dermo-conseil", desc: "Dermo-cosmétique, nutrition, aromathérapie : des conseils de pharmaciens diplômés, pas un simple libre-service.", tag: "Conseil" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const ENGAGEMENT_DEMO = [
  "Pharmacie inscrite à l'Ordre national des pharmaciens — licence n° 59#004512",
  "Pharmaciens diplômés d'État présents à chaque ouverture",
  "Tiers payant carte Vitale + mutuelle : aucune avance de frais",
  "Pharmacie de garde : composez le 3237 (0,35 €/min) en dehors de nos horaires",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const INFOS = [
  { t: "Horaires étendus", d: "Lun–Sam 8h30–19h30, sans interruption. Le samedi jusqu'à 19h." },
  { t: "Ordonnance en avance", d: "Photo par mail ou en boutique : préparée sous 2 h, conservée 7 jours." },
  { t: "Stationnement", d: "Parking du Parc gratuit 30 min, dépose-minute devant l'officine." },
  { t: "Garde & urgences", d: "En dehors des horaires : 3237 pour la pharmacie de garde, 15 pour le SAMU." },
];

const AVIS_SOURCE = [
  { texte: "J'envoie l'ordonnance de ma mère par mail le matin, tout est prêt à midi, tiers payant compris. Pour un traitement de 12 lignes, ça change la vie.", auteur: "Sandrine P.", detail: "Renouvellement chronique" },
  { texte: "Vaccinée contre la grippe un samedi en cinq minutes, sans rendez-vous. La pharmacienne a vérifié mes rappels au passage — le tétanos datait de 12 ans.", auteur: "Marie-Claude B.", detail: "Vaccination" },
  { texte: "Location d'un lit médicalisé pour mon père en 24 h, livré et installé. On nous a expliqué la prise en charge, on n'a rien avancé.", auteur: "Éric D.", detail: "Matériel médical" },
];
let AVIS_DEMO = AVIS_SOURCE;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}


export default function PharmacieDuParcPage() {
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
  const { i, next, prev } = useSlides(HERO_UNIVERS.length, DWELL.normal);
  const univers = HERO_UNIVERS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "03 20 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33320000000"}`;
  const mail = fd?.email ?? "ordonnances@pharmacieduparc-lille.fr";

  /* Le rayonnage : trois tuiles empilées, poussées de gauche à droite
     à chaque changement d'univers. */
  const tiles = univers.tiles.map(({ icon: Icon, t, d, bg, fg }, n) => ({
    area: { gridColumn: "1", gridRow: `${n + 1}` },
    node: (
      <div style={{ background: bg, color: fg, borderRadius: 14, padding: "20px 22px", height: "100%", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon size={22} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 5 }}>{t}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, opacity: 0.85 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i330-nav { display: none !important; } .i330-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i330-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i330-split { grid-template-columns: 1fr !important; }
          .i330-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: "rgba(247,250,248,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "border 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span aria-hidden style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Cross size={16} />
              </span>
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.4 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie du Parc"))}</span>
            </>
          )}
        </div>
        <div id="i330-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`mailto:${mail}`} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ scale: 1.03 }}>
            Envoyer mon ordonnance
          </motion.a>
        </div>
        <button className="i330-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(247,250,248,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={`mailto:${mail}`} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Envoyer mon ordonnance</a>
        </div>
      )}

      {/* ── HERO — MosaicPush : le rayonnage ────────────────────────────── */}
      <section className="i330-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "7px 16px", fontSize: 12.5, fontWeight: 600, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
            Ouvert Lun–Sam 8h30–19h30, sans interruption
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ fontSize: "clamp(34px, 4.6vw, 60px)", fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.08, margin: "0 0 20px" }}>
            {c?.heroHeadline ?? (<>Votre pharmacie,<br /><span style={{ color: C.accent }}>au-delà du comptoir.</span></>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 500, marginBottom: 32 }}>
            {fd?.tagline ?? c?.heroSubline ?? "Ordonnances préparées à l'avance, vaccination sans rendez-vous, tests rapides et vrai conseil de pharmaciens diplômés — au cœur du quartier du Parc, à Lille."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={`mailto:${mail}`} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: C.shadowLg }} whileHover={{ scale: 1.03 }}>
              Envoyer mon ordonnance <ArrowRight size={16} />
            </motion.a>
            <motion.a href={telHref} style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }} whileHover={{ borderColor: C.accent }}>
              <Phone size={16} /> {phone}
            </motion.a>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 44, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO_UNIVERS.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>{univers.k}</strong> — {univers.line}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
          </div>
        </div>

        {/* Le rayonnage : trois tuiles poussées rayon par rayon. */}
        <MosaicPush
          index={i}
          tiles={tiles}
          stagger={0.09}
          style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "repeat(3, minmax(112px, auto))", gap: 12 }}
        />
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i330-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos services</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 800, letterSpacing: -1, marginTop: 10, lineHeight: 1.12 }}>
                Une officine qui soigne,<br />pas seulement qui délivre.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.06}>
                <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                  <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                  <h3 style={{ fontSize: 17.5, fontWeight: 700, margin: "16px 0 10px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDONNANCES ─────────────────────────────────────────────────── */}
      <section id="ordonnances" className="i330-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div className="i330-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ background: C.bgDark, borderRadius: 18, padding: "36px 34px", color: "#eaf4ee" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.mint, marginBottom: 16 }}>Ordonnance en avance</div>
              {["Photographiez votre ordonnance recto complète", "Envoyez-la par mail avec votre nom et une heure de passage", "Elle est préparée et vérifiée sous 2 h, conservée 7 jours", "Passage en caisse en moins de 5 minutes, tiers payant appliqué"].map((step, n) => (
                <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "rgba(127,199,164,0.18)", color: C.mint, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{n + 1}</span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.65, opacity: 0.9 }}>{step}</span>
                </div>
              ))}
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, background: C.mint, color: "#123528", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 14.5, textDecoration: "none" }}>
                {mail}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Une officine de l'Ordre</span>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 800, letterSpacing: -0.8, margin: "12px 0 26px", lineHeight: 1.15 }}>
                Ce que garantit<br />une vraie pharmacie.
              </h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ─────────────────────────────────────────────── */}
      <section id="infos" className="i330-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Infos pratiques</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 800, letterSpacing: -1, marginTop: 10, lineHeight: 1.12 }}>
                Venir, se garer,<br />être servi vite.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {INFOS.map((m, idx) => (
              <Reveal key={m.t} delay={idx * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "26px 24px", height: "100%" }}>
                  <Clock size={20} color={C.accent} style={{ marginBottom: 14 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 9 }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i330-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.4vw, 42px)", fontWeight: 800, letterSpacing: -0.8, color: "#fff" }}>
              Le quartier en parle<span style={{ color: C.mint }}>.</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "26px 24px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.mint} color={C.mint} />)}
                </div>
                <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.mint, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i330-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>À votre service</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1, margin: "14px 0 16px" }}>
            Une question santé ?<br />Un pharmacien répond.
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Par téléphone aux horaires d'ouverture, ou passez simplement : le conseil ne prend pas de ticket.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> {phone}
            </motion.a>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i330-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie du Parc"))}</div>
              <p style={{ color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.7 }}>
                Pharmacie d'officine · {clientCity(sessionData) ?? "Lille"}<br />
                Ordre national des pharmaciens — licence n° 59#004512
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: `Quartier du Parc, ${clientCity(sessionData) ?? "Lille"}` }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Sam 8h30–19h30 · Garde : 3237" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.45)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.mint }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Pharmacie du Parc"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
