"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Landmark, Mail, MapPin, Phone, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { StickyProgress } from "@/lib/templates/hero-kit-3";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
  clientCertifications,
  clientAddress,
  clientCity,
  clientTrade,
  clientPhone,
  clientList,
  clientEmail,
  clientCodePostalVille,
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

/* Conseil en gestion de patrimoine, 2e variante (la 1re est impact-241). Signature : StickyProgress — le parcours patrimonial épinglé, étape par étape. Sans photographie. */

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
/*
  La paire du plan (P11) : « EB Garamond » porte la voix du thème,
  « Outfit » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'EB Garamond', Georgia, 'Times New Roman', serif";
const FONT = "'Outfit', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Expertises", "h": "#services"}, {"l": "Infos pratiques", "h": "#methode"}, {"l": "Honoraires", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [];
const PARCOURS_SOURCE = [{"n": "01", "title": "Le bilan complet", "body": "Actifs, dettes, fiscalité, régimes matrimoniaux, objectifs de vie : deux heures pour photographier votre situation réelle — souvent la première fois qu'elle l'est."}, {"n": "02", "title": "La stratégie écrite", "body": "Un document clair : où vous allez, par quels véhicules, avec quels risques et quels horizons. Vous le gardez, même sans nous."}, {"n": "03", "title": "La mise en œuvre", "body": "Assurance-vie, PER, SCPI, immobilier : nous sélectionnons en architecture ouverte et négocions les frais d'entrée pour vous."}, {"n": "04", "title": "Le suivi annuel", "body": "Une revue par an minimum : la vie change, la fiscalité aussi. La stratégie s'ajuste, elle ne dort jamais."}];
let PARCOURS = PARCOURS_SOURCE;
const SERVICES_SOURCE = [{"titre": "Bilan patrimonial", "desc": "La photographie complète : civil, fiscal, financier, immobilier. Le préalable à tout conseil sérieux — facturé, donc indépendant.", "tag": "Bilan"}, {"titre": "Épargne & placements", "desc": "Assurance-vie, PER, comptes-titres en architecture ouverte : les supports choisis pour votre stratégie, pas pour la commission.", "tag": "Placements"}, {"titre": "Immobilier patrimonial", "desc": "LMNP, déficit foncier, SCPI, démembrement : l'immobilier qui sert un objectif chiffré, pas une plaquette de promoteur.", "tag": "Immobilier"}, {"titre": "Retraite", "desc": "Bilan retraite complet, rachats de trimestres étudiés, PER optimisé : savoir à 45 ans ce qu'on touchera à 64.", "tag": "Retraite"}, {"titre": "Transmission", "desc": "Donations, assurance-vie, démembrement, pacte Dutreil : transmettre plus en payant le juste impôt — en lien avec votre notaire.", "tag": "Transmission"}, {"titre": "Dirigeants & professions libérales", "desc": "Rémunération, holding, prévoyance Madelin, cession d'entreprise : le patrimoine pro et perso enfin coordonnés.", "tag": "Dirigeants"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "CIF, contrôlé AMF", "d": "Le statut de Conseiller en Investissements Financiers nous soumet au contrôle de l'AMF et à une association agréée."}, {"n": "02", "t": "Lettre de mission", "d": "Périmètre, livrables et rémunération écrits avant de commencer — vous savez ce que vous payez et pourquoi."}, {"n": "03", "t": "Architecture ouverte", "d": "Aucun produit maison : nous comparons les contrats du marché et négocions les frais pour vous."}, {"n": "04", "t": "Transparence totale", "d": "Honoraires et rétrocessions détaillés dans chaque rapport annuel, au centime."}];
const ENGAGEMENT_DEMO = ["CIF adhérent d'une association agréée AMF, ORIAS n° 26 009 244", "Carte T pour les opérations immobilières, RC professionnelle complète", "Rémunération mixte affichée : honoraires + rétrocessions détaillées par écrit", "Aucun objectif commercial sur un produit : notre seul stock, c'est le conseil"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Bilan patrimonial complet", "p": "dès 890 €", "n": "Deux rendez-vous, rapport écrit de 30+ pages, plan d'action chiffré."}, {"a": "Stratégie + mise en œuvre", "p": "sur lettre de mission", "n": "Honoraires forfaitaires annoncés avant, rétrocessions déduites ou affichées."}, {"a": "Suivi annuel", "p": "dès 490 €/an", "n": "Revue complète, ajustements, disponibilité toute l'année."}, {"a": "Bilan retraite seul", "p": "590 €", "n": "Relevés analysés, projections chiffrées, rachats étudiés."}];
let TARIFS = TARIFS_DEMO;
function AVIS_SOURCE_LIVE() {
  return [{"texte": "Premier conseiller qui commence par facturer un bilan au lieu de vendre un produit : le rapport de 34 pages a mis à plat quinze ans de décisions accumulées. On sait enfin où on va.", "auteur": `Couple de médecins, ${clientCity(sessionData) ?? "Lyon"}`, "detail": "Bilan + stratégie"}, {"texte": "La cession de mon entreprise préparée trois ans en amont : holding, Dutreil, remploi. L'économie fiscale finance leurs honoraires pour vingt ans. Merci pour la rigueur.", "auteur": "Fondateur, PME industrielle", "detail": "Cession d'entreprise"}, {"texte": "Le rapport annuel détaille chaque euro de frais et de rétrocession — j'ai compris pour la première fois ce que coûtait mon assurance-vie. Et il a fait baisser la facture.", "auteur": "Cadre dirigeante, 52 ans", "detail": "Suivi annuel"}];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "CIF", "label": "Statut contrôlé par l'AMF"}, {"value": "380", "label": "Familles conseillées"}, {"value": "0", "label": "Produit « maison » à vendre"}, {"value": "1/an", "label": "Revue patrimoniale minimum"}];
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

export default function CapHorizonPatrimoinePage() {
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
  AVIS_SOURCE = AVIS_SOURCE_LIVE();


  PARCOURS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...PARCOURS_SOURCE[i % PARCOURS_SOURCE.length], title: s.title, body: s.desc || "" || "" })),
    PARCOURS_SOURCE,
  );
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
  


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "04 78 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33478000001").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "cabinet@cap-horizon-patrimoine.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        @media (max-width: 900px) { #i378-nav { display: none !important; } .i378-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 860px) {
          .i378-hero { padding: 118px 24px 40px !important; gap: 24px !important; }
          .i378-hero [style*="aspect-ratio"] { aspect-ratio: 4 / 3 !important; }
          .i378-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i378-split { grid-template-columns: 1fr !important; }
          .i378-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i378-stats .i378-statcell { border-right: none !important; }
          .i378-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i378-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Landmark size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cap Horizon Patrimoine")}</span>
              
            </>
          )}
        </div>
        <div id="i378-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33478000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Bilan patrimonial
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i378-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33478000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Bilan patrimonial</a>
        </div>
      )}

      {/* ── HERO — devanture centrée ──────────────────────────────────────
             Une colonne unique au milieu, l'étude de portefeuille en vitrine
             large dessous. La grille texte-à-gauche / carte-à-droite était
             la charpente de la série — et ce conteneur était identique au
             caractère près à ceux d'impact-373 et d'impact-382 avant leurs
             refontes. */}
      <section className="i378-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "clamp(24px, 3.2vh, 40px)", padding: "clamp(118px, 14vh, 150px) clamp(24px, 5vw, 64px) clamp(44px, 6vh, 70px)", maxWidth: 1260, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Gestion de patrimoine · {clientCity(sessionData) ?? "Lyon"}
          </motion.span>
          {/*
            Titre d'un seul tenant, d'une seule couleur : la seconde ligne
            dans l'accent était la signature de gabarit de la série.
          */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(32px, 4.8vw, 62px)", color: C.text, lineHeight: 1.08, margin: "18px 0 18px", maxWidth: 860, overflowWrap: "break-word" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
              c?.heroHeadline ??
              clientHeroLine(sessionData, 0, 1, 40) ??
              "Votre patrimoine mérite une stratégie, pas des produits."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: "clamp(14.5px, 1.3vw, 16.5px)", color: C.textMuted, lineHeight: 1.75, maxWidth: 660, margin: "0 auto 24px" }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Conseillers en investissements financiers (statut CIF, contrôle AMF) : bilan patrimonial complet, stratégie écrite, mise en œuvre suivie — rémunération transparente, sans produit maison à écouler."}
          </motion.p>
          {/* Une seule action pleine ; l'approche reste un lien. */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Demander un bilan <ArrowRight size={16} />
            </motion.a>
            <a href="#services" style={{ fontSize: 13, color: C.text, textDecoration: "none", borderBottom: `1px solid ${C.accentDark}`, paddingBottom: 3 }}>
              Notre approche
            </a>
          </motion.div>
        </div>

        {/* ── LA VITRINE — l'étude de portefeuille, en bandeau large ─────── */}
        <div style={{ width: "100%" }}>
          <div style={{ position: "relative", borderRadius: 14, border: `1px solid ${C.border}`, background: C.accentLight, overflow: "hidden", aspectRatio: "21 / 8" }}>
            <img
              src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/7693722/pexels-photo-7693722.jpeg?auto=compress&cs=tinysrgb&w=1600"))}
              alt="Étude de portefeuille avec le client"
              loading="eager"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,26,32,0.45) 0%, rgba(20,26,32,0.05) 46%, transparent 74%)" }} />
            <div style={{ position: "absolute", left: "clamp(16px, 2.4vw, 28px)", bottom: 14, textAlign: "left", fontSize: 12.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", textShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
              Bilan · stratégie · suivi
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i378-stats i378-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i378-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Signature : StickyProgress ─────────────────────────────────── */}
      <section className="i378-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <StickyProgress
            steps={PARCOURS}
            className="i378-split"
            style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: 40 }}
            renderTitle={(active) => (
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le parcours</span>
                <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 44px)", color: C.text, lineHeight: 1.15, margin: "12px 0 0" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                  Une stratégie<br /><em style={{ color: C.accentDark }}>en quatre temps.</em>
                </>)}</h2>
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
      <section id="services" className="i378-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Expertises</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Tout le patrimoine,<br /><em>pas un seul produit.</em>
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
      <section id="methode" className="i378-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Infos pratiques</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Un cabinet réglementé,<br /><em>ça change la conversation.</em>
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
      <section id="engagements" className="i378-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i378-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Votre intérêt,<br /><em>c'est le statut qui l'impose.</em>
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
      <section id="tarifs" className="i378-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Honoraires</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Le conseil se paie, <em>c'est ce qui le rend libre.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Le bilan est facturé — c'est la condition de son indépendance. Les honoraires de suivi sont dégressifs selon les encours conseillés.</p>
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
      <section className="i378-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>Des patrimoines <em style={{ color: C.hi }}>qui ont un cap</em>.</>)}</h2>
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
      <section id="contact" className="i378-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Premier échange</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Trente minutes pour voir<br /><em>si nous pouvons vous être utiles.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Premier entretien téléphonique offert et sans engagement. Si un bilan ne vous servirait à rien, nous vous le dirons.</p>
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
      <footer className="i378-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cap Horizon Patrimoine")}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Conseil en gestion de patrimoine · {clientCity(sessionData) ?? "Lyon"}<br />CIF (AMF) — ORIAS n° 26 009 244 — carte T</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? ((clientCity(sessionData) ?? "Lyon") + ", Rhône")) }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Lun–Ven 9h–19h, sam. matin sur RDV" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Cap Horizon Patrimoine")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
