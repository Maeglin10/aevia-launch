"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Home, Mail, MapPin, PawPrint, Phone, Scissors, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { PushBlur } from "@/lib/templates/hero-kit-3";
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

/* Toiletteur canin-félin & pension, 2e variante de la niche. Signature : PushBlur — la carte qui file, l'animal qui passe en courant. Carte CSS sans photo. */

let C: Record<string, string> = {
  bg: "#f6fafa",
  bgSection: "#e9f2f1",
  bgDark: "#0f2523",
  text: "#122120",
  textMuted: "#546b68",
  accent: "var(--brand,#1d7a72)",
  accentDark: "#135e57",
  accentLight: "#d9ecea",
  hi: "#7fc7bd",
  white: "#ffffff",
  border: "#d8e5e3",
};
/*
  La paire du plan (P4) : « Fraunces » porte la voix du thème,
  « Inter » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'Fraunces', Georgia, 'Times New Roman', serif";
const FONT = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Prestations", "h": "#services"}, {"l": "Notre approche", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [{"k": "Toilettage complet", "line": "Un seul animal à la fois, jamais de cage d'attente.", "sub": "Bain, séchage main, coupe aux ciseaux ou tondeuse."}, {"k": "Chiens anxieux", "line": "Le rendez-vous long, pour ceux que ça effraie.", "sub": "Séances d'habituation gratuites avant le premier toilettage."}, {"k": "Pension familiale", "line": "Six places, dans la maison — pas dans un chenil.", "sub": "Photos quotidiennes, sorties à la Loire, rythme respecté."}];

const SERVICES_SOURCE = [{"titre": "Toilettage complet", "desc": "Brossage, bain adapté à la peau, séchage à la main, coupe aux ciseaux ou à la tondeuse selon la race, soins des oreilles et griffes.", "tag": "Complet"}, {"titre": "Chiens anxieux ou âgés", "desc": "Rendez-vous longs, pauses autorisées, séances d'habituation gratuites : certains chiens ont besoin de trois visites avant la première coupe. C'est normal.", "tag": "Douceur"}, {"titre": "Chats", "desc": "Toilettage félin par une toiletteuse formée : démêlage, coupe sanitaire, bains médicaux. Sans contention brutale, sans sédation.", "tag": "Chats"}, {"titre": "Soins spécifiques", "desc": "Shampooings antiparasitaires ou dermatologiques sur conseil vétérinaire, épilation des races à poil dur, entretien des cordés.", "tag": "Soins"}, {"titre": "Pension familiale", "desc": "Six places dans notre maison avec jardin clos : votre animal vit avec nous, pas dans un box. Sorties quotidiennes au bord de Loire.", "tag": "Pension"}, {"titre": "Garde à la journée", "desc": "Pour les journées trop longues : accueil de 8 h à 19 h, jeux, sieste, retour fatigué et heureux.", "tag": "Journée"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "On prend le temps", "d": "Un seul animal à la fois au salon : pas d'aboiements, pas d'attente en cage, pas de stress d'ambiance."}, {"n": "02", "t": "On respecte les refus", "d": "Si un chien dit non, on s'arrête et on recommence un autre jour. Aucune contention musclée, jamais."}, {"n": "03", "t": "On adapte les produits", "d": "Peaux sensibles, allergies, animaux âgés : les shampooings sont choisis pour la peau, pas pour le parfum."}, {"n": "04", "t": "On raconte la séance", "d": "Ce qui s'est bien passé, ce qui a coincé, ce qu'il faut travailler à la maison entre deux visites."}];
const ENGAGEMENT_DEMO = ["Toiletteuse diplômée (CTM toilettage canin-félin), formation continue comportement", "Pension déclarée en préfecture (DDPP), certificat de capacité animaux domestiques", "Aucune sédation, aucune contention forcée — si l'animal refuse, on arrête", "Vaccins à jour exigés pour la pension : protection de tous les pensionnaires"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Toilettage petit chien (< 10 kg)", "p": "dès 42 €", "n": "Bain, séchage main, coupe, oreilles et griffes."}, {"a": "Toilettage grand chien (> 25 kg)", "p": "dès 68 €", "n": "Comptez 2 h 30 : on ne bâcle pas les grands gabarits."}, {"a": "Toilettage chat", "p": "dès 55 €", "n": "Sans sédation, par une toiletteuse formée au félin."}, {"a": "Pension (nuitée)", "p": "24 €", "n": "Repas, sorties, photos quotidiennes. Dégressif dès 7 nuits."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Mon bouvier bernois terrorisé par les salons a eu droit à trois visites d'habituation gratuites avant sa première coupe. Aujourd'hui il tire sur la laisse pour entrer. Merci mille fois.", "auteur": "Propriétaire de Gustave", "detail": "Chien anxieux"}, {"texte": "Deux semaines de pension pendant nos vacances : deux photos par jour, des nouvelles vraies, et un chat qui n'a pas boudé au retour — du jamais vu.", "auteur": "Famille Bouchet", "detail": "Pension familiale"}, {"texte": "Toiletteuse qui explique ce qu'elle fait et comment brosser à la maison. Mon caniche n'a plus jamais eu de nœuds depuis ses conseils. C'est du vrai conseil, pas de la vente.", "auteur": "Maryse P.", "detail": "Toilettage régulier"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "1", "label": "Animal à la fois au salon"}, {"value": "0", "label": "Cage d'attente, jamais"}, {"value": "6", "label": "Places en pension familiale"}, {"value": "2/jour", "label": "Photos envoyées aux propriétaires"}];
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

export default function PoilsEtCompagniePage() {
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


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 41 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33241000001").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "rdv@poils-et-compagnie.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        @media (max-width: 900px) { #i383-nav { display: none !important; } .i383-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 860px) {
          .i383-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i383-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i383-split { grid-template-columns: 1fr !important; }
          .i383-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i383-stats .i383-statcell { border-right: none !important; }
          .i383-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i383-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <PawPrint size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Poils & Compagnie")}</span>
              
            </>
          )}
        </div>
        <div id="i383-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33241000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Prendre RDV
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i383-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33241000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Prendre RDV</a>
        </div>
      )}

      {/* ── HERO — split inversé : l'animal à gauche, la parole à droite ──
             L'image ouvre la page ; le texte la suit — l'inverse du réflexe
             de la série. Le geste PushBlur reste sur la photographie, qui
             occupe toute la hauteur de sa colonne au lieu d'une carte. */}
      <section className="i383-hero" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)", gap: "clamp(28px, 4.5vw, 62px)", alignItems: "center", padding: "clamp(118px, 15vh, 150px) clamp(24px, 5vw, 64px) clamp(48px, 7vh, 70px)", maxWidth: 1260, margin: "0 auto" }}>
        {/* ── L'animal, à gauche — pleine hauteur de colonne ─────────────── */}
        <div className="i383-animal" style={{ position: "relative", minWidth: 0 }}>
          <PushBlur index={i} amount={16}>
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: C.accentLight, aspectRatio: "4 / 4.5", boxShadow: "0 42px 80px -52px rgba(43,34,25,0.5)" }}>
              <img
                src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/6816837/pexels-photo-6816837.jpeg?auto=compress&cs=tinysrgb&w=1400"))}
                alt="Toilettage sur table"
                loading="eager"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(43,34,25,0.5) 0%, rgba(43,34,25,0.05) 42%, transparent 70%)" }} />
              {/* La prestation montrée, posée sur l'image. */}
              <div style={{ position: "absolute", left: 18, right: 18, bottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                <motion.span key={`k-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
                  {S.k}
                </motion.span>
                {/*
                  La fraction « 01 / 03 » ne disait pas ce qu'on regardait ;
                  ces traits mènent directement à chaque prestation.
                */}
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                  {HERO.map((h: any, n: number) => (
                    <button
                      key={h.k ?? n}
                      type="button"
                      onClick={() => go(n)}
                      aria-label={h.k ?? `Prestation ${n + 1}`}
                      aria-current={n === i}
                      style={{ width: 30, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(255,255,255,0.4)", transition: "background .3s" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PushBlur>
        </div>

        {/* ── La parole, à droite ────────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
            Toilettage & pension · {clientCity(sessionData) ?? "Angers"}
          </motion.span>
          {/*
            Titre d'un seul tenant, d'une seule couleur : la seconde ligne
            dans l'accent était la signature de gabarit de la série.
          */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(32px, 4.4vw, 58px)", color: C.text, lineHeight: 1.1, margin: "18px 0 20px", overflowWrap: "break-word" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
              c?.heroHeadline ??
              clientHeroLine(sessionData, 0, 1, 34) ??
              "Votre chien ressort beau. Et surtout, détendu."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, marginBottom: 30 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Un salon sans cage d'attente, un seul animal à la fois, des produits adaptés à la peau : le toilettage pensé pour l'animal avant la photo. Et une pension familiale de six places quand vous partez."}
          </motion.p>
          {/* Une seule action pleine ; les prestations restent un lien. */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
            <a href="#services" style={{ fontSize: 13, color: C.text, textDecoration: "none", borderBottom: `1px solid ${C.accentDark}`, paddingBottom: 3 }}>
              Nos prestations
            </a>
          </motion.div>

          {/* La légende de la prestation montrée. */}
          <motion.div key={`sub-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginTop: 34, paddingTop: 18, borderTop: `1px solid ${C.border}`, fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 }}>
            <strong style={{ color: C.text, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i383-stats i383-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i383-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i383-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prestations</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Le toilettage,<br /><em>au rythme de l'animal.</em>
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
      <section id="methode" className="i383-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Notre approche</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Un animal détendu<br /><em>est un animal bien toiletté.</em>
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
      <section id="engagements" className="i383-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i383-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Le bien-être<br /><em>avant l'esthétique.</em>
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
      <section id="tarifs" className="i383-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Selon la race, <em>annoncés avant.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Le prix dépend de la taille, du poil et de son état. Un forfait démêlage s'ajoute si le poil est très emmêlé — annoncé avant de commencer, jamais découvert à la caisse.</p>
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
      <section className="i383-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Des animaux <em style={{ color: C.hi }}>qui reviennent contents</em>.</>)}</h2>
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
      <section id="contact" className="i383-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prenez rendez-vous</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Un seul animal à la fois,<br /><em>alors les places sont comptées.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Rendez-vous par téléphone du mardi au samedi. Pension : réservez tôt pour les vacances scolaires, six places partent vite.</p>
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
      <footer className="i383-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Poils & Compagnie")}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Salon de toilettage & pension familiale · {clientCity(sessionData) ?? "Angers"}<br />Toiletteuse diplômée — pension déclarée DDPP</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? ((clientCity(sessionData) ?? "Angers") + ", Maine-et-Loire")) }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Mar–Sam 9h–18h30 · pension 7j/7 sur réservation" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Poils & Compagnie")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
