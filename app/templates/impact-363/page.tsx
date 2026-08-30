"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, ArrowRight, CheckCircle, Clock, Footprints, Mail, MapPin, Phone, Scan, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { MosaicPush } from "@/lib/templates/hero-kit-3";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
  clientCertifications,
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
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

/* Pédicure-podologue, 1re variante. Signature : MosaicPush — la semelle qui se construit couche par couche, en tuiles. Tuiles CSS sans photo. */

let C: Record<string, string> = {
  bg: "#f6fafa",
  bgSection: "#e9f2f1",
  bgDark: "#0f2523",
  text: "#122120",
  textMuted: "#546b68",
  accent: "var(--brand,#1d7a72)",
  accentDark: "var(--brand, #135e57)",
  accentLight: "#d9ecea",
  hi: "#7fc7bd",
  white: "#ffffff",
  border: "#d8e5e3",
};
/*
  La paire du plan (P8) : « Newsreader » porte la voix du thème,
  « Manrope » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'Newsreader', Georgia, 'Times New Roman', serif";
const FONT = "'Manrope', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Soins", "h": "#services"}, {"l": "L'examen", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [
  { k: "La semelle sur mesure", sub: "Construite couche par couche, au cabinet.", tiles: [{ icon: Scan, t: "1. L'empreinte", d: "Plateforme de pression et scan 3D : votre appui, mesuré pas deviné.", bg: "#d9ecea", fg: "var(--brand, #135e57)" }, { icon: Footprints, t: "2. La correction", d: "Éléments posés au dixième de millimètre selon l'examen clinique.", bg: "#0f2523", fg: "#d9ecea" }, { icon: Activity, t: "3. Le contrôle", d: "Re-testée sur plateforme à un mois, ajustée gratuitement.", bg: "#e9f2f1", fg: "var(--brand, #135e57)" }] },
  { k: "La pédicurie médicale", sub: "Les soins que l'on n'ose pas demander.", tiles: [{ icon: Footprints, t: "Cors & durillons", d: "Traités à l'instrument stérile, cause mécanique corrigée.", bg: "#0f2523", fg: "#d9ecea" }, { icon: Activity, t: "Ongles incarnés", d: "Soins et orthonyxie : la pince à ongles n'est pas une fatalité.", bg: "#d9ecea", fg: "var(--brand, #135e57)" }, { icon: Scan, t: "Pied diabétique", d: "Gradation du risque, soins remboursés, prévention des plaies.", bg: "#e9f2f1", fg: "var(--brand, #135e57)" }] },
  { k: "Le sport", sub: "Courir plus, se blesser moins.", tiles: [{ icon: Activity, t: "Analyse de course", d: "Tapis instrumenté, vidéo : la foulée décortiquée image par image.", bg: "#e9f2f1", fg: "var(--brand, #135e57)" }, { icon: Scan, t: "Semelles sport", d: "Fines, dynamiques, adaptées à la chaussure et à la discipline.", bg: "#d9ecea", fg: "var(--brand, #135e57)" }, { icon: Footprints, t: "Suivi de saison", d: "Contrôles avant marathon et reprise après blessure.", bg: "#0f2523", fg: "#d9ecea" }] }
];

const SERVICES_SOURCE = [{"titre": "Semelles orthopédiques", "desc": "Sur prescription : examen clinique, plateforme de pression, fabrication au cabinet en 8 jours, contrôle à un mois inclus.", "tag": "Semelles"}, {"titre": "Pédicurie médicale", "desc": "Cors, durillons, hyperkératoses, ongles épais ou incarnés : instruments stériles à usage unique, sans douleur.", "tag": "Pédicurie"}, {"titre": "Pied diabétique", "desc": "Gradation du risque podologique, soins pris en charge par l'Assurance Maladie selon le grade, coordination avec votre médecin.", "tag": "Diabète"}, {"titre": "Podologie du sport", "desc": "Analyse de course sur tapis, semelles dynamiques fines, conseils chaussage par discipline — course, trail, foot, ski.", "tag": "Sport"}, {"titre": "Enfants & croissance", "desc": "Pieds plats, marche en dedans, douleurs de croissance : on surveille, on rassure, on ne corrige que ce qui doit l'être.", "tag": "Enfants"}, {"titre": "Orthoplasties & orthonyxies", "desc": "Protections sur mesure en silicone, redressement d'ongles : le petit appareillage qui évite la chirurgie.", "tag": "Appareillage"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Anamnèse complète", "d": "Douleurs, chaussage, activité, antécédents : le pied s'explique rarement tout seul."}, {"n": "02", "t": "Examen clinique et postural", "d": "Debout, allongé, en marche : cheville, genou, bassin — la chaîne entière est regardée."}, {"n": "03", "t": "Plateforme et scan 3D", "d": "Pressions statiques et dynamiques enregistrées, empreinte numérique pour la fabrication."}, {"n": "04", "t": "Fabrication et contrôle", "d": "Semelles faites au cabinet, essayées dans VOS chaussures, re-testées à un mois. Ajustements inclus."}];
const ENGAGEMENT_DEMO = ["Pédicures-podologues D.E., inscrits à l'Ordre national — n° ADELI affichés", "Instruments stériles à usage unique ou stérilisés en autoclave contrôlé", "Semelles fabriquées au cabinet : pas d'envoi en série dans un atelier lointain", "Devis remis avant tout appareillage, prise en charge expliquée mutuelle en main"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Bilan podologique + semelles", "p": "160 €", "n": "Examen complet, plateforme, fabrication, contrôle à 1 mois inclus."}, {"a": "Soin de pédicurie", "p": "35 €", "n": "Cors, durillons, ongles : 45 minutes, instruments stériles."}, {"a": "Pied diabétique (gradé 2-3)", "p": "pris en charge", "n": "Forfaits annuels remboursés par l'Assurance Maladie."}, {"a": "Analyse de course (vidéo + tapis)", "p": "90 €", "n": "Compte rendu et conseils chaussage, déduit si semelles sport."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Talalgie depuis un an, deux paires de semelles inefficaces ailleurs. Ici : plateforme, vidéo, semelles refaites — plus aucune douleur au réveil depuis trois mois.", "auteur": "Nathalie B.", "detail": "Semelles sur mesure"}, {"texte": "Le contrôle à un mois n'est pas du marketing : mes semelles ont été retouchées deux fois, sans frais, jusqu'à l'oubli total. C'est ça le sur-mesure.", "auteur": "Étienne R.", "detail": "Suivi inclus"}, {"texte": "Mon père diabétique est suivi tous les deux mois, remboursé, avec un compte rendu envoyé au médecin. Ses pieds n'ont jamais été aussi bien surveillés.", "auteur": "Fille de M. C.", "detail": "Pied diabétique"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "2", "label": "Podologues D.E."}, {"value": "J+8", "label": "Semelles livrées et testées"}, {"value": "1 mois", "label": "Contrôle et ajustement inclus"}, {"value": "ADELI", "label": "Inscrits à l'Ordre"}];
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

export default function PodoMarchePage() {
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
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );
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
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  const tiles = S.tiles.map(({ icon: Icon, t: tt, d, bg, fg }, n) => ({
    area: { gridColumn: "1", gridRow: `${n + 1}` },
    node: (
      <div style={{ background: bg, color: fg, borderRadius: 14, padding: "20px 22px", height: "100%", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon size={22} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 5 }}>{tt}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, opacity: 0.85 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 73 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33473000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "rdv@podo-marche.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* La tuile du moment déborde du bord bas de la photographie. */
        .i363-tuile { position: absolute; left: clamp(14px, 2vw, 26px); right: clamp(14px, 2vw, 26px); bottom: clamp(-26px, -2vw, -16px); z-index: 2; }

        @media (max-width: 900px) { #i363-nav { display: none !important; } .i363-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 560px) { .i363-navtrade { display: none !important; } }
        @media (max-width: 860px) {
          .i363-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 30px !important; }
          .i363-tuile { position: static !important; margin: -46px 14px 0 !important; }
          .i363-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i363-split { grid-template-columns: 1fr !important; }
          .i363-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i363-stats .i363-statcell { border-right: none !important; }
          .i363-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i363-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Footprints size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cabinet Podo'Marche")}</span>
              <span className="i363-navtrade" style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6, whiteSpace: "nowrap" }}>{clientTrade(sessionData) ?? "Podologie"}</span>
            </>
          )}
        </div>
        <div id="i363-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33473000000").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Prendre RDV
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i363-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33473000000").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Prendre RDV</a>
        </div>
      )}

      {/* ── HERO — split inversé : le soin à gauche, la parole à droite ────
             L'image ouvre la page ; le texte la suit. C'est l'inverse du
             réflexe de toute la série — texte à gauche, média à droite — et
             l'œil rencontre le cabinet avant le discours. Les tuiles du
             moment gardent leur geste MosaicPush, posées sur le bord bas de
             la photographie. */}
      <section className="i363-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)", gap: "clamp(28px, 4.5vw, 64px)", alignItems: "center", padding: "clamp(120px, 15vh, 150px) clamp(24px, 5vw, 64px) clamp(48px, 7vh, 70px)", maxWidth: 1260, margin: "0 auto" }}>
        {/* ── La colonne du soin : la photographie, et la tuile du moment ── */}
        <div className="i363-soin" style={{ position: "relative", minWidth: 0 }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: C.accentLight, aspectRatio: "4 / 4.6", boxShadow: "0 42px 80px -52px rgba(61,45,52,0.5)" }}>
            <img
              src={photo(0, "https://images.pexels.com/photos/5619447/pexels-photo-5619447.jpeg?auto=compress&cs=tinysrgb&w=1400")}
              alt="Soin de pédicurie au cabinet"
              loading="eager"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(61,45,52,0.5) 0%, rgba(61,45,52,0.05) 42%, transparent 70%)" }} />
          </div>

          {/* La tuile du moment, en débord sur le bord bas de l'image. */}
          <div className="i363-tuile">
            <MosaicPush index={i} tiles={[{ ...tiles[0], area: { gridColumn: "1", gridRow: "1" } }]} stagger={0.09} style={{ display: "grid", gridTemplateColumns: "1fr", gridAutoRows: "minmax(96px, auto)" }} />
          </div>
        </div>

        {/* ── La colonne de parole ───────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            {clientEyebrow(sessionData) ?? `Pédicure-podologue · ${clientCity(sessionData) ?? "Clermont-Ferrand"}`}
          </motion.span>
          {/*
            Titre d'un seul tenant, d'une seule couleur : la seconde ligne
            dans l'accent était la signature de gabarit de la série.
          */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(32px, 4.4vw, 58px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px", overflowWrap: "break-word" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
              c?.heroHeadline ??
              clientHeroLine(sessionData, 0, 1, 40) ??
              "Vos pieds portent tout. On s'occupe d'eux."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 30 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Analyse de la marche sur plateforme, semelles fabriquées au cabinet, soins de pédicurie médicale : deux podologues diplômés d'État pour marcher, courir et vieillir sans douleur."}
          </motion.p>
          {/* Une seule action pleine ; les soins restent un lien. */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
            <a href="#services" style={{ fontSize: 13, color: C.text, textDecoration: "none", borderBottom: `1px solid ${C.accentDark}`, paddingBottom: 3 }}>
              Nos soins
            </a>
          </motion.div>

          {/*
            Le soin montré, et de quoi passer aux autres. La fraction
            « 01 / 03 » ne disait pas ce qu'on regardait.
          */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, color: C.textMuted, minWidth: 0 }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Soin ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 34, height: 3, padding: 0, border: "none", borderRadius: 2, cursor: "pointer", background: n === i ? C.accentDark : C.border, transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i363-stats i363-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i363-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── RESPIRATION — une phrase, un filet ──────────────────────────── */}
      <section style={{ background: C.bg, padding: "clamp(66px,9vw,120px) clamp(24px,8vw,160px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: FONT_TITRE, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px,2.9vw,38px)", lineHeight: 1.4, color: C.text, maxWidth: 840, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
              <>Un pied qui ne fait pas parler de lui, c'est toute la journée qui change.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ width: 1, height: 72, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(28px,4vw,48px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i363-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Soins</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Du soin du quotidien<br /><em>à la biomécanique.</em>
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
      <section id="methode" className="i363-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'examen</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                On mesure d'abord,<br /><em>on corrige ensuite.</em>
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
      <section id="engagements" className="i363-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i363-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src={photo(1, "https://images.pexels.com/photos/5619451/pexels-photo-5619451.jpeg?auto=compress&cs=tinysrgb&w=1400")} alt="Analyse de la marche sur plateforme" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le cabinet</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Diplômés d'État,<br /><em>équipés pour mesurer.</em>
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
      <section id="tarifs" className="i363-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Annoncés, <em>mutuelles décodées.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (<>Les semelles sur prescription sont partiellement remboursées (Sécurité sociale + mutuelle selon contrat) ; le pied diabétique gradé est pris en charge. On vous fait le calcul exact avant.</>)}</p>
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
      <section className="i363-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Ils marchent <em style={{ color: C.hi }}>sans y penser</em>.</>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
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
      <section id="contact" className="i363-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>On vous attend</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            La douleur au pied<br /><em>n'est pas une fatalité.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>Rendez-vous sous huit jours, le samedi matin aussi. Apportez vos chaussures les plus portées — elles parlent.</>)}</p>
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
      <footer className="i363-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cabinet Podo'Marche")}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Pédicures-podologues D.E. · {clientCity(sessionData) ?? "Clermont-Ferrand"}<br />Ordre national des pédicures-podologues — n° ADELI affichés</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "63000", "Clermont-Ferrand") + ", Puy-de-Dôme") }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Lun–Ven 8h30–19h · Sam 8h30–13h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Cabinet Podo'Marche")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
