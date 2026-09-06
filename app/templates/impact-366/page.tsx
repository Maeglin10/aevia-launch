"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Leaf, Mail, MapPin, Phone, Star, Tractor, Users } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
  clientCertifications,
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientList,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
  clientMethode,
  fusionnerEtapes,
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

/* Producteur fermier, 2e variante, maraîchage moderne et AMAP. Héros typographique : le titre tient l'écran sur le vert profond, et les trois saisons descendent en pellicule de vignettes cliquables — le plein cadre CrossPush était la composition de quatre autres thèmes. */

let C: Record<string, string> = {
  bg: "#f4f9f4",
  bgSection: "#e9f2e9",
  bgDark: "#123528",
  text: "#14231c",
  textMuted: "#57675e",
  accent: "var(--brand,#2e7d4f)",
  accentDark: "var(--brand-light, #1f5c3a)",
  accentLight: "#dcefe5",
  hi: "#7fc7a4",
  white: "#ffffff",
  border: "#dce6df",
};
/*
  La paire du plan (P12) : « Bricolage Grotesque » porte la voix du thème,
  « Figtree » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Figtree:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'Bricolage Grotesque', system-ui, -apple-system, sans-serif";
const FONT = "'Figtree', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Le champ", "h": "#services"}, {"l": "L'AMAP", "h": "#methode"}, {"l": "Contrats & prix", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
function HERO_DEMO_LIVE() {
  return [{"k": "Printemps", "sub": "Semis, plants, premières bottes — le champ redémarre.", "img": (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"), "alt": "Le champ au printemps"}, {"k": "Été", "sub": "Tomates, courgettes, haricots : la pleine saison des paniers lourds.", "img": (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/6698243/pexels-photo-6698243.jpeg?auto=compress&cs=tinysrgb&w=1920"), "alt": "Cultures d'été en pleine terre"}, {"k": "Hiver", "sub": "Courges, poireaux, choux — la saison qu'on apprend à aimer.", "img": (clientPhotos(sessionData)[3] || "https://images.pexels.com/photos/30990696/pexels-photo-30990696.jpeg?auto=compress&cs=tinysrgb&w=1920"), "alt": "Travail au champ en morte saison"}];
}
let HERO_DEMO = HERO_DEMO_LIVE();
let HERO = HERO_DEMO;

const SERVICES_SOURCE = [{"titre": "Paniers AMAP", "desc": "Un contrat de saison (6 mois), un panier chaque mardi : vous partagez la récolte — l'abondance de juillet comme la sobriété de février.", "tag": "AMAP"}, {"titre": "Marché des Lices", "desc": "Le samedi matin : l'étal complet, pour ceux qui préfèrent choisir. Les amapiens y ont leurs habitudes aussi.", "tag": "Marché"}, {"titre": "Légumes de plein champ", "desc": "Pommes de terre, courges, oignons : les gros volumes d'hiver, stockés à la ferme, vendus au cageot pour les conserves familiales.", "tag": "Stock"}, {"titre": "Plants de printemps", "desc": "En avril-mai : nos plants de tomates, courgettes et aromatiques, ceux-là mêmes que nous plantons — pas des invendus de jardinerie.", "tag": "Plants"}, {"titre": "Chantiers participatifs", "desc": "Plantation de printemps, récolte des courges : les amapiens qui veulent mettre les mains viennent — jamais obligatoire, toujours joyeux.", "tag": "Participatif"}, {"titre": "Écoles & visites", "desc": "Les classes de Vannes viennent voir pousser ce qu'elles mangent à la cantine — on livre aussi deux cantines de la ville.", "tag": "Pédagogie"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Un engagement de saison", "d": "Six mois de paniers payés d'avance : la trésorerie qui permet de semer sans emprunter."}, {"n": "02", "t": "La récolte partagée", "d": "Le panier suit le champ : généreux l'été, plus sobre l'hiver. C'est le principe — et le calendrier est publié."}, {"n": "03", "t": "La distribution ensemble", "d": "Le mardi soir à la ferme : chacun compose son panier sur la table de tri, l'équipe raconte la semaine du champ."}, {"n": "04", "t": "Les comptes ouverts", "d": "Une réunion par saison : les prix, les investissements, les galères. Les amapiens savent ce qu'ils financent."}];
const ENGAGEMENT_DEMO = ["Certification AB — contrôles annuels, dérogations : zéro", "Tout ce qui est vendu a poussé sur nos 3 hectares — pas de revente négoce", "Prix de saison publiés et stables, décidés en réunion d'AMAP", "Deux cantines scolaires de Vannes livrées en légumes de saison"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Contrat AMAP — panier solo", "p": "12 €/semaine", "n": "Sur 6 mois : l'équivalent de 4-5 légumes chaque mardi."}, {"a": "Contrat AMAP — panier famille", "p": "21 €/semaine", "n": "8-10 légumes, calendrier de récoltes publié à la signature."}, {"a": "Cageot d'hiver (10 kg)", "p": "18 €", "n": "Pommes de terre, courges, oignons — pour les caves et les conserves."}, {"a": "Plants de printemps", "p": "dès 1,50 €", "n": "Tomates anciennes, courgettes, basilic — en avril-mai à la ferme."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Quatrième saison d'AMAP : le mardi soir est devenu un rendez-vous, les enfants connaissent les maraîchers par leur prénom, et on mange mieux pour moins cher qu'au supermarché bio.", "auteur": "Famille Le Goff", "detail": "Panier famille"}, {"texte": "La réunion des comptes m'a bluffée : tout est sur la table, les prix, le tracteur à remplacer, les ratés de l'année. On ne consomme pas, on participe.", "auteur": "Anne-Sophie M.", "detail": "Amapienne depuis 2024"}, {"texte": "Le chantier courges d'octobre avec les enfants : une matinée dans la boue, cent kilos rentrés, soupe offerte. Ils en parlent encore.", "auteur": "Pierre-Yves D.", "detail": "Chantier participatif"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "100", "label": "Familles en AMAP"}, {"value": "3 ha", "label": "En agriculture biologique"}, {"value": "45+", "label": "Variétés sur l'année"}, {"value": "2", "label": "Distributions par semaine"}];
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

export default function PotagerEstuairePage() {
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
  HERO_DEMO = HERO_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO = HERO_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? "Sur devis", n: s.desc || "" })),
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

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 97 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33297000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "amap@potager-estuaire.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /*
          ── Héros typographique : le pied et la pellicule ──────────────────
        */
        .i366-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(22px, 3.4vw, 52px);
          align-items: end;
          margin-top: clamp(20px, 2.6vw, 32px);
          padding-top: clamp(18px, 2.4vw, 26px);
          border-top: 1px solid rgba(255,255,255,0.16);
        }
        .i366-pellicule {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 900px) { #i366-nav { display: none !important; } .i366-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 860px) {
          .i366-hero { padding: 118px 24px 40px !important; gap: 24px !important; }
          .i366-pied { grid-template-columns: minmax(0,1fr) !important; row-gap: 20px; }
          .i366-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i366-split { grid-template-columns: 1fr !important; }
          .i366-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i366-stats .i366-statcell { border-right: none !important; }
          .i366-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i366-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Leaf size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: "#F2F7F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Le Potager de l'Estuaire")}</span>
              
            </>
          )}
        </div>
        <div id="i366-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33297000000").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Rejoindre l'AMAP
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i366-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33297000000").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Rejoindre l'AMAP</a>
        </div>
      )}

      {/* ── HERO — typographie seule, les saisons en pellicule ────────────
             Le titre remplit l'écran sur le vert profond du thème ; plus de
             photographie en fond perdu — le plein cadre CrossPush était la
             composition d'impact-328, 340, 349 et 359. Les photos des
             saisons ne se perdent pas : elles descendent en pellicule au
             pied du héros, trois vignettes cliquables qui pilotent la
             chronique. */}
      <section id="hero" className="i366-hero" style={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(22px, 3vh, 38px)", overflow: "hidden", background: C.bgDark, padding: "clamp(116px, 14vh, 156px) clamp(24px, 5vw, 72px) clamp(40px, 5vh, 64px)" }}>
        {/* Les rangs du champ, dessinés : la seule texture du fond. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(100deg, ${C.hi} 0 1px, transparent 1px 64px)`, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 55% at 30% 80%, rgba(255,255,255,0.06), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.hi }}>
            {clientEyebrow(sessionData) ?? "Maraîchage bio · Golfe du Morbihan"}
          </motion.span>

          {/*
            Le titre tient l'écran à lui seul, d'un seul tenant et d'une
            seule couleur : la seconde ligne dans le ton clair était la
            signature de gabarit de la série.
          */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(38px, 7.6vw, 104px)", color: "#fff", lineHeight: 0.98, letterSpacing: "-0.02em", margin: "18px 0 0", maxWidth: 1060, overflowWrap: "break-word" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
              c?.heroHeadline ??
              clientHeroLine(sessionData, 0, 1, 44) ??
              "Un champ, cent familles, et les saisons pour contrat."}
          </motion.h1>

          <div className="i366-pied">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ fontSize: "clamp(14.5px, 1.3vw, 16.5px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0 }}>
              {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Le Potager nourrit cent familles en AMAP et le marché du samedi : légumes bio plantés, cueillis et distribués par la même équipe. S'engager sur une saison, c'est ce qui fait tenir une ferme."}
            </motion.p>
            {/* Une seule action pleine ; le champ reste un lien. */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
              <motion.a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.03 }}>
                Rejoindre l'AMAP <ArrowRight size={16} />
              </motion.a>
              <a href="#services" style={{ fontSize: 13, color: "#fff", textDecoration: "none", borderBottom: `1px solid ${C.hi}`, paddingBottom: 3 }}>
                Le champ
              </a>
            </motion.div>
          </div>
        </div>

        {/* ── LA PELLICULE — les trois saisons, en vignettes cliquables ──── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          <div className="i366-pellicule">
            {HERO.map((h: any, n: number) => (
              <button
                key={h.k ?? n}
                type="button"
                onClick={() => go(n)}
                aria-current={n === i}
                aria-label={`Saison : ${h.k}`}
                className="i366-vignette"
                style={{ position: "relative", padding: 0, border: `2px solid ${n === i ? C.hi : "rgba(255,255,255,0.18)"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "none", aspectRatio: "16 / 9", transition: "border-color .3s" }}
              >
                <img src={h.img} alt={h.alt} loading={n === 0 ? "eager" : "lazy"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: n === i ? 1 : 0.55, transition: "opacity .3s" }} />
                <span style={{ position: "absolute", left: 10, bottom: 8, zIndex: 1, fontFamily: FONT_TITRE, fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
                  {h.k}
                </span>
              </button>
            ))}
          </div>
          {/* La chronique de la saison montrée. */}
          <motion.div key={`sub-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginTop: 14, fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
            <strong style={{ color: "#fff", fontWeight: 700 }}>{S.k}</strong> — {S.sub}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i366-stats i366-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i366-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i366-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Le champ</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Ce qui pousse ici<br /><em>ne prend pas l'autoroute.</em>
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
      <section id="methode" className="i366-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'AMAP</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Le contrat qui fait<br /><em>tenir une ferme debout.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 18 }}>
            {resolveList(fusionnerEtapes(METHODE, clientMethode(sessionData)), METHODE).map((m, idx) => (
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
      <section id="engagements" className="i366-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i366-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <img src={photo(4, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80")} alt="Les rangs du potager en été" loading="lazy" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Bio certifié,<br /><em>local radical.</em>
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
      <section id="tarifs" className="i366-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Contrats & prix</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Payer la saison, <em>manger l'année.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>Le contrat AMAP se signe en mars (saison été) et septembre (saison hiver). Paiement en 1, 3 ou 6 chèques — la souplesse est pour vous, la visibilité pour la ferme.</p>
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
      <section className="i366-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Cent familles, <em style={{ color: C.hi }}>un champ</em>.</>)}</h2>
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
      <section id="contact" className="i366-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Rejoindre</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Il reste des paniers<br /><em>pour la saison prochaine.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Contrats ouverts en mars et septembre, visite du champ avant de signer — on préfère des amapiens qui savent où ils mettent les pieds.</p>
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
      <footer className="i366-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Le Potager de l'Estuaire")}</div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>Maraîchage biologique · {clientCity(sessionData) ?? "Vannes"}<br />{clientName(sessionData) ? "Certifié AB — AMAP et marché local" : "Certifié AB — AMAP et marché des Lices"}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "56000", "Vannes") + (clientCity(sessionData) ? "" : ", Morbihan") }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Distribution AMAP : Mar 18h–19h30 · Marché : Sam matin" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.7)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Le Potager de l'Estuaire")} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
