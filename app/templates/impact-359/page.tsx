"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, HardHat, Mail, MapPin, Phone, Star, TreePine, Truck, Wrench, Zap } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { BentoCascade, DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
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

/* Location de matériel BTP et espaces verts, 1re variante. Signature : BentoCascade — le parc machines qui se déploie en grille. Sans photo. */

let C: Record<string, string> = {
  bg: "#0b0d11",
  bgSection: "#101319",
  bgDark: "#07090c",
  text: "#f2f1ed",
  textMuted: "#9aa0ab",
  accent: "var(--brand,#f2760a)",
  accentDark: "var(--brand, #f2a25c)",
  accentLight: "#1c1610",
  hi: "var(--brand, #f2a25c)",
  white: "#12151b",
  border: "rgba(255,255,255,0.09)",
};
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Le parc", "h": "#services"}, {"l": "Comment louer", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [
  { k: "Terrassement", sub: "Ce qui creuse, nivelle et compacte.", tiles: [{ icon: HardHat, t: "Mini-pelles 1 à 5 t", d: "Livrées sur remorque ou porte-engin, godets au choix.", bg: "#1c1610", fg: "var(--brand, #f2a25c)" }, { icon: Wrench, t: "Plaques & pilonneuses", d: "Compactage tranchées et allées, EPI fournis.", bg: "#12151b", fg: "#f2f1ed" }, { icon: Truck, t: "Dumpers & brouettes motorisées", d: "Évacuer sans se casser le dos, même en pente.", bg: "#181310", fg: "var(--brand, #f2a25c)" }] },
  { k: "Jardin", sub: "Ce qui taille, broie et tond — en grand.", tiles: [{ icon: TreePine, t: "Broyeurs de branches", d: "Jusqu'à 12 cm de diamètre, le tas d'automne en une matinée.", bg: "#12151b", fg: "#f2f1ed" }, { icon: Wrench, t: "Motoculteurs & tondeuses pro", d: "Autoportées et débroussailleuses pour les grands terrains.", bg: "#1c1610", fg: "var(--brand, #f2a25c)" }, { icon: TreePine, t: "Carottes & tarières", d: "Clôtures et plantations : le trou parfait sans pioche.", bg: "#181310", fg: "var(--brand, #f2a25c)" }] },
  { k: "Bâtiment", sub: "Ce qui monte, perce et alimente.", tiles: [{ icon: HardHat, t: "Échafaudages roulants", d: "Alu certifiés, notice de montage et garde-corps complets.", bg: "#181310", fg: "var(--brand, #f2a25c)" }, { icon: Zap, t: "Groupes électrogènes", d: "2 à 40 kVA, silencieux disponibles pour l'événementiel.", bg: "#1c1610", fg: "var(--brand, #f2a25c)" }, { icon: Wrench, t: "Perfos, carotteuses, rainureuses", d: "Le gros électroportatif qui ne s'achète pas pour un week-end.", bg: "#12151b", fg: "#f2f1ed" }] }
];

function SERVICES_SOURCE_LIVE() {
  return [{"titre": "Terrassement & compactage", "desc": "Mini-pelles, dumpers, plaques : révision entre chaque location, carnet de maintenance consultable, prise en main faite au dépôt.", "tag": "TP"}, {"titre": "Espaces verts", "desc": "Broyeurs, tarières, débroussailleuses professionnelles : affûtés, réglés, avec les EPI qui vont avec (fournis).", "tag": "Jardin"}, {"titre": "Élévation", "desc": "Échafaudages roulants alu, échelles pro : conformes, complets, avec notice — et le rappel des règles avant le départ.", "tag": "Hauteur"}, {"titre": "Énergie & pompage", "desc": "Groupes électrogènes, pompes vide-cave, chauffages de chantier : la panne et la montée d'eau n'attendent pas.", "tag": "Énergie"}, {"titre": "Livraison chantier", "desc": "Camion-grue et porte-engin : la machine posée où vous travaillez, reprise à la fin. Sur " + (clientCity(sessionData) ?? "Nancy") + " et 40 km.", "tag": "Livraison"}, {"titre": "Conseil d'usage", "desc": "Le bon calibre pour votre chantier — pas le plus gros. On préfère relouer la bonne machine que reprendre la mauvaise cassée.", "tag": "Conseil"}];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();;
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Réserver au téléphone", "d": "On vérifie le calibre avec vous, la machine est bloquée à votre nom, caution annoncée d'avance."}, {"n": "02", "t": "Prise en main au dépôt", "d": "Démarrage, sécurités, gestes de base : dix minutes qui évitent la panne du samedi midi."}, {"n": "03", "t": "Le chantier chez vous", "d": "Carburant fourni au départ (plein/plein), assistance téléphonique aux heures d'ouverture."}, {"n": "04", "t": "Retour vérifié ensemble", "d": "État contradictoire au retour, caution levée immédiatement — pas de retenue surprise à J+15."}];
const ENGAGEMENT_DEMO = ["Vérifications générales périodiques (VGP) à jour, registres consultables au comptoir", "Révision et nettoyage entre chaque location — une machine sale ne repart pas", "EPI de base fournis avec chaque machine à risque (casque, lunettes, gants)", "Caution transparente : montant affiché, levée au retour après état contradictoire"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Mini-pelle 1,8 t", "p": "180 €/jour", "n": "Godets 30/60 cm inclus, remorque +30 €/jour, permis BE requis."}, {"a": "Broyeur de branches (8 cm)", "p": "95 €/jour", "n": "EPI fournis, sacs de collecte disponibles."}, {"a": "Échafaudage roulant 8 m", "p": "65 €/jour", "n": "Complet avec garde-corps et stabilisateurs, montage expliqué."}, {"a": "Plaque vibrante 90 kg", "p": "45 €/jour", "n": "Dégressif : 3 jours = 2,5 ; semaine = 4 jours."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Mini-pelle réservée le jeudi, livrée le samedi 7h30 posée dans le jardin, reprise le lundi. La piscine est creusée, le dos est intact, la caution levée au retour du camion.", "auteur": "Fabrice N.", "detail": "Particulier — terrassement"}, {"texte": "Artisan, je loue chez eux ce que je n'amortis pas : carotteuse, groupe, échafaudage. Les machines démarrent, les VGP sont à jour, la facture mensuelle est propre.", "auteur": "SARL Maçonnerie Grandidier", "detail": "Compte pro"}, {"texte": "On m'a déconseillé la grosse tarière « qui fait peur » pour un modèle une personne, moitié prix. Vingt trous de clôture plus tard : ils avaient raison.", "auteur": "Sylvain P.", "detail": "Conseil de calibre"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "400+", "label": "Références au parc"}, {"value": "VGP", "label": "Contrôles réglementaires à jour"}, {"value": "7h", "label": "Retrait dès l'ouverture"}, {"value": "J+1", "label": "Livraison sur chantier"}];
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

export default function LocamatPage() {
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
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();


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

  const phone = fd?.phone ?? "03 83 00 00 00";
  const telHref = `tel:${fd?.phone ?? "+33383000000"}`;
  const mail = fd?.email ?? "resa@locamat-nancy.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`
        @media (max-width: 900px) { #i359-nav { display: none !important; } .i359-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i359-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i359-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i359-split { grid-template-columns: 1fr !important; }
          .i359-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i359-stats .i359-statcell { border-right: none !important; }
          .i359-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i359-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Wrench size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Locamat"))}</span>
              <span style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>Location matériel</span>
            </>
          )}
        </div>
        <div id="i359-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33383000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Réserver
          </motion.a>
        </div>
        <button className="i359-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${fd?.phone ?? "+33383000000"}`} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Réserver</a>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
<section className="i359-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: 56, alignItems: "center", padding: "140px 64px 70px", maxWidth: 1260, margin: "0 auto" }}>
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>
            Location de matériel · {clientCity(sessionData) ?? "Nancy"}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT, fontSize: "clamp(34px, 4.6vw, 60px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 13) ?? "Le bon outil,"}<br /><em style={{ color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 13) ?? "juste le temps qu'il faut."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Mini-pelles, plaques vibrantes, broyeurs, échafaudages : 400 références entretenues et contrôlées, à l'heure, à la journée ou au mois. Pros et particuliers, remorque comprise si besoin."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Réserver une machine <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#services" style={{ background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ borderColor: C.accent }}>
              Le parc
            </motion.a>
          </motion.div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 42, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.text} className="" />
          </div>
        </div>
        <BentoCascade index={i} tiles={tiles}  style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "repeat(3, minmax(112px, auto))", gap: 12 }} />
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i359-stats i359-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i359-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i359-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Le parc</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Entretenu, contrôlé,<br /><em>prêt à démarrer.</em>
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
      <section id="methode" className="i359-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Comment louer</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Simple comme<br /><em>réserver, charger, rendre.</em>
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
      <section id="engagements" className="i359-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i359-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", justifyContent: "center" , overflow: "hidden" }}><img src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/29502220/pexels-photo-29502220.jpeg?auto=compress&cs=tinysrgb&w=1400"))} alt="Grue mobile disponible à la location" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Des machines<br /><em>qui démarrent.</em>
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
      <section id="tarifs" className="i359-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>À la journée, <em>dégressifs, affichés.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Week-end = tarif 1,5 jour (retrait samedi 7h30, retour lundi 9h). Assurance casse optionnelle 10 % du tarif. Pros : compte et facturation mensuelle.</p>
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
      <section className="i359-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Des chantiers <em style={{ color: C.hi }}>finis à l'heure</em>.</>)}</h2>
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
      <section id="contact" className="i359-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Le dépôt</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Réservez aujourd'hui,<br /><em>creusez samedi.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Réservation par téléphone, retrait dès 7 h. Livraison sur chantier à J+1 dans un rayon de 40 km.</p>
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
      <footer className="i359-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Locamat"))}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Location de matériel BTP & jardin · {clientCity(sessionData) ?? "Nancy"}<br />Matériel contrôlé (VGP à jour), pros et particuliers</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Nancy") + ", Meurthe-et-Moselle" }, { icon: <Phone size={13} />, t: phone }, { icon: <Clock size={13} />, t: "Lun–Ven 7h–18h30 · Sam 7h30–17h" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Locamat"))} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
