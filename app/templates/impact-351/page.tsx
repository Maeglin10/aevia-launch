"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, CloudRain, Home, Mail, MapPin, Phone, Shield, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { HardCutRebuild } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
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

/* Couvreur-zingueur, 1re variante. Signature : HardCutRebuild — la toiture déposée d'un coup puis remontée rang par rang. Sans photographie. */

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

const NAV = [{"l": "Savoir-faire", "h": "#services"}, {"l": "Le chantier", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [{"k": "Réfection complète", "line": "ON DÉPOSE. ON REMONTE.", "sub": "Couverture refaite rang par rang, isolation posée au passage — la maison au sec pour quarante ans."}, {"k": "Ardoise d'Anjou", "line": "L'ARDOISE, POSÉE AU CROCHET.", "sub": "Le matériau du pays, posé comme le veulent les Compagnons : au crochet inox, sur voliges saines."}, {"k": "Urgence tempête", "line": "BÂCHÉ CETTE NUIT.", "sub": "Après la tempête, on sécurise d'abord : bâchage sous 24 h, dossier photo pour votre assurance."}];

const SERVICES_SOURCE = [{"titre": "Réfection de couverture", "desc": "Dépose complète, contrôle de charpente, écran sous-toiture et remontage en ardoise, tuile ou zinc. Le chantier type qui engage quarante ans.", "tag": "Réfection"}, {"titre": "Zinguerie", "desc": "Gouttières, noues, abergements de cheminée, toitures zinc à joint debout : façonnés à l'atelier, soudés sur place.", "tag": "Zinc"}, {"titre": "Isolation de toiture", "desc": "Sarking ou combles perdus, éligible aux aides (MaPrimeRénov'). Le bon moment, c'est pendant la réfection — on chiffre les deux.", "tag": "Isolation"}, {"titre": "Réparations & entretien", "desc": "Ardoises glissées, tuiles gélives, mousse : forfait d'entretien annuel avec passage après l'hiver et rapport photo.", "tag": "Entretien"}, {"titre": "Fenêtres de toit", "desc": "Pose et remplacement de fenêtres de toit, raccords d'étanchéité garantis, volets solaires possibles.", "tag": "Lumière"}, {"titre": "Urgences & assurances", "desc": "Bâchage sous 24 h, chiffrage conforme aux attentes des experts, photos avant/après pour votre dossier.", "tag": "Urgence"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Visite et diagnostic", "d": "Montée sur toit ou drone selon l'accès, photos commentées, diagnostic écrit de la charpente à la gouttière."}, {"n": "02", "t": "Devis détaillé", "d": "Matériaux nommés (ardoise, crochet, écran), quantités, délais. Les aides à la rénovation sont chiffrées avec."}, {"n": "03", "t": "Chantier protégé", "d": "Échafaudage aux normes, bâchage chaque soir, gravats évacués en benne — jamais dans votre jardin."}, {"n": "04", "t": "Réception en toiture", "d": "Réception avec photos de chaque zone, garanties remises, facture conforme pour l'assurance habitation."}];
const ENGAGEMENT_DEMO = ["Garantie décennale couverture-zinguerie — attestation remise avec chaque devis", "Qualibat 3212, équipes formées au travail en hauteur (habilitations à jour)", "Devis gratuit et détaillé matériau par matériau, jamais de forfait flou", "Après tempête : bâchage d'abord, devis ensuite — on ne profite pas de l'urgence"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Réfection ardoise naturelle", "p": "140–180 €/m²", "n": "Dépose, écran, ardoise d'Anjou au crochet inox, zinguerie comprise."}, {"a": "Réfection tuile terre cuite", "p": "95–130 €/m²", "n": "Tuiles de pays, faîtage scellé ou à sec selon DTU."}, {"a": "Gouttière zinc posée", "p": "dès 68 €/ml", "n": "Façonnée à l'atelier, naissances et descentes comprises."}, {"a": "Forfait entretien annuel", "p": "dès 290 €", "n": "Passage après l'hiver, ardoises remplacées, rapport photo envoyé."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Toiture ardoise de 1930 refaite à l'identique, isolation sarking au passage. Le chantier a duré trois semaines, bâché chaque soir, jardin impeccable au départ.", "auteur": "Famille Hervé", "detail": "Réfection complète + isolation"}, {"texte": "Tempête de novembre : bâchés le soir même à 22 h, dossier photo transmis à l'assurance, réparation programmée sans qu'on ait à se battre avec l'expert.", "auteur": "Monique C.", "detail": "Urgence tempête"}, {"texte": "Ils ont refusé de remplacer toute la toiture que deux autres artisans condamnaient : 40 ardoises reprises, gouttière refaite, 800 € au lieu de 30 000. On sait où on ira le jour venu.", "auteur": "Pierre L.", "detail": "Réparation honnête"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "10 ans", "label": "Garantie décennale"}, {"value": "Qualibat", "label": "3212 — couverture"}, {"value": "24 h", "label": "Bâchage d'urgence"}, {"value": "380+", "label": "Toitures refaites"}];
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

export default function ToitsDeLoirePage() {
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

  /*
    Les services venaient uniquement de `bp` (businessProfile), rempli par les
    seules niches pilotes. Pour tout le reste, `bp` est vide et la page servait
    les services de démonstration — un couvreur lyonnais lisait ceux d'un
    couvreur d'Angers. On lit donc aussi `c.services`, que la génération
    produit pour chaque client.
  */
  const CLIENT_SERVICES = clientServices(sessionData);
  const SERVICES = resolveList(
    CLIENT_SERVICES?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const CLIENT_AVIS = clientReviews(sessionData);
  const AVIS = resolveList(
    CLIENT_AVIS?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /*
    Le hero affichait toujours les trois accroches de démonstration. La première
    diapositive porte désormais le titre généré pour le client ; les suivantes
    gardent celles du thème, qui montrent d'autres facettes du métier. Si la
    génération n'a rien produit, on retombe sur la démo — mais alors c'est un
    repli, pas le cas normal.
  */
  const HERO_SLIDES = c?.heroHeadline
    ? [
        {
          k: (CLIENT_SERVICES?.[0]?.title as string) ?? HERO[0].k,
          line: c.heroHeadline as string,
          sub: (c.heroSubline as string) ?? HERO[0].sub,
        },
        // Les diapositives suivantes viennent des services du client, pas du
        // thème : garder « L'ARDOISE, POSÉE AU CROCHET » et « Ardoise d'Anjou »
        // sur le site d'un couvreur lyonnais, c'est laisser la démonstration
        // parler à sa place.
        // `k` sert de sur-titre au-dessus du `line` : y remettre le même mot
        // l'affichait deux fois. On y met la promesse du métier, pas le titre.
        ...(CLIENT_SERVICES ?? []).slice(1, 3).map((sv: any) => ({
          k: HERO[0].k,
          line: ((sv.title as string) ?? "").toUpperCase(),
          sub: (sv.description as string) ?? (sv.desc as string) ?? "",
        })),
      ]
    : HERO;
  /*
    La photo tourne avec la diapositive. On ne met une image que si le client en
    a fourni : afficher une photo de stock à la place de la sienne serait pire
    que de n'en afficher aucune.
  */
  const HERO_IMG: string | null = fd?.photoUrls?.length
    ? fd.photoUrls[0]
    : null;
  const { i, next, prev } = useSlides(HERO_SLIDES.length, DWELL.normal);
  const S = HERO_SLIDES[i];


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = fd?.phone ?? "02 41 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33241000000"}`;
  const mail = fd?.email ?? "devis@toits-de-loire.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i351-nav { display: none !important; } .i351-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i351-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i351-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i351-split { grid-template-columns: 1fr !important; }
          .i351-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i351-stats .i351-statcell { border-right: none !important; }
          .i351-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i351-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Home size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Couvreur-zingueur</span>
            </>
          )}
        </div>
        <div id="i351-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33241000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Devis toiture
          </motion.a>
        </div>
        <button className="i351-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${fd?.phone ?? "+33241000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Devis toiture</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}

      {/*
        Le hero n'avait aucune image : la photo du client n'apparaissait nulle
        part au-dessus de la ligne de flottaison, et le geste d'animation
        n'animait que du texte. Deux colonnes sur grand écran, une seule en
        dessous de 900 px — la media query .i351-hero le prévoyait déjà.
      */}
      <section className="i351-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: HERO_IMG ? "minmax(0,1.05fr) minmax(0,0.95fr)" : "1fr", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1180, margin: "0 auto" }}>
        <div>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>
          {/* Angers était écrit en dur : la ville du thème survivait à celle du client. */}
          Couvreur-zingueur{fd?.city ? ` · ${fd.city}` : " · Angers"}
        </span>
        <HardCutRebuild index={i} stagger={0.09}>
              {[
                <div key="k" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{S.k}</div>,
                <h1 key="h" style={{ fontFamily: FONT, fontSize: "clamp(36px, 5.4vw, 68px)", fontWeight: 800, color: C.text, lineHeight: 1.05, margin: "0 0 14px" }}>{S.line}</h1>,
                <p key="d" style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 540, margin: 0 }}>{S.sub}</p>,
              ]}
            </HardCutRebuild>
        <p style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 560, margin: "14px 0 32px" }}>
          {c?.heroSubline ?? fd?.tagline ?? "Ardoise d'Anjou, zinc à joint debout, tuiles de pays : trois équipes de couvreurs qui déposent, isolent et remontent dans les règles de l'art. Décennale, Qualibat, et un bâchage d'urgence qui répond la nuit."}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
            Demander un devis <ArrowRight size={16} />
          </motion.a>
          <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
            Nos chantiers
          </motion.a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 44, flexWrap: "wrap" }}>
          <SlideIndex i={i} total={HERO_SLIDES.length} variant="fraction" color={C.textMuted} className="" />
          <span style={{ fontSize: 13.5, color: C.textMuted }}><strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}</span>
          <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
        </div>
        </div>

        {/* Pas de ratio imposé sur la boîte : entre elle et l'image, le wrapper
            du geste n'a pas de hauteur, donc `height:100%` ne résolvait à rien
            et une bande vide restait sous la photo. L'image donne sa hauteur. */}
        {HERO_IMG && (
          <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <HardCutRebuild index={i} stagger={0.09}>
              {[
                <img
                  key="img"
                  src={HERO_IMG}
                  alt={`${fd?.businessName ?? "Chantier"} — ${S.k}`}
                  loading="eager"
                  style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                />,
              ]}
            </HardCutRebuild>
          </div>
        )}
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i351-stats i351-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i351-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i351-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Savoir-faire</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Du faîtage<br /><em>à la gouttière.</em>
              </h2>
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
      <section id="methode" className="i351-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Le chantier</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>
                Une toiture se refait<br /><em>dans l'ordre, ou pas du tout.</em>
              </h2>
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
      <section id="engagements" className="i351-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i351-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src={photo(0, "https://images.pexels.com/photos/31762405/pexels-photo-31762405.jpeg?auto=compress&cs=tinysrgb&w=1400")} alt="Couvreurs sur une toiture" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>
                Couvreurs,<br /><em>et assurés pour l'être.</em>
              </h2>
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
      <section id="tarifs" className="i351-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>Des repères <em>honnêtes.</em></h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Chaque toit est unique : ces fourchettes situent le budget, le devis après visite fait foi. Aides MaPrimeRénov' déduites quand l'isolation s'y prête.</p>
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
      <section className="i351-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>Des toits <em style={{ color: C.hi }}>qui tiennent</em>.</h2>
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
      <section id="contact" className="i351-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Devis gratuit</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>
            Faites regarder votre toit<br /><em>avant qu'il ne se rappelle à vous.</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Visite et diagnostic gratuits dans tout le Maine-et-Loire. Urgence bâchage : on répond aussi la nuit.</p>
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
      <footer className="i351-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Couverture · Zinguerie · Angers et Maine-et-Loire<br />Garantie décennale, Qualibat 3212</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: "Angers, Maine-et-Loire" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 7h30–18h · Urgence bâchage 7j/7" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))} — Site réalisé par Aevia WS · SIREN <LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur Aevia WS · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
