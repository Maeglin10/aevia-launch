"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Hammer, Mail, MapPin, PanelTop, Phone, Star, Sun } from "lucide-react";
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

/* Vitrier-miroiterie, 1re variante. Signature : PushBlur — la carte passe avec un filé net/flou, l'effet du verre. Carte CSS sans photo. */

let C: Record<string, string> = {
  bg: "#f6f9fb",
  bgSection: "#e9f0f5",
  bgDark: "#12222e",
  text: "#132029",
  textMuted: "#54646e",
  accent: "var(--brand,#20648c)",
  accentDark: "#194e6d",
  accentLight: "#dbeaf3",
  hi: "#8cc0dd",
  white: "#ffffff",
  border: "#d9e4ea",
};
/*
  La paire du plan (P10) : « Spectral » porte la voix du thème,
  « IBM Plex Sans » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'Spectral', Georgia, 'Times New Roman', serif";
const FONT = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const NAV = [{"l": "Ouvrages", "h": "#services"}, {"l": "La méthode", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [{"k": "Urgence casse", "line": "Fermé ce soir, remplacé demain.", "sub": "Mise en sécurité immédiate, facture pour l'assurance."}, {"k": "Double vitrage", "line": "Le silence et la chaleur, au sur-mesure.", "sub": "Rénovation sans changer vos fenêtres."}, {"k": "Miroiterie d'atelier", "line": "Miroirs, crédences, parois : façonnés ici.", "sub": "Coupe, rodage, perçage sur place."}];

const SERVICES_SOURCE = [{"titre": "Urgence bris de glace", "desc": "Vitrine, fenêtre, porte : mise en sécurité le jour même, remplacement sous 24-48 h, photos et facture conformes pour votre assurance.", "tag": "Urgence"}, {"titre": "Double vitrage rénovation", "desc": "Remplacer le simple vitrage dans vos fenêtres existantes : isolation thermique et phonique sans changer les menuiseries.", "tag": "Isolation"}, {"titre": "Miroirs sur mesure", "desc": "Coupe, façon des bords, pose collée ou fixée : du miroir d'entrée à la salle de danse, l'atelier fait tout.", "tag": "Miroirs"}, {"titre": "Parois de douche & crédences", "desc": "Verre trempé sécurit, découpes pour robinetterie, crédences laquées : mesurées chez vous, posées sans joint disgracieux.", "tag": "Intérieur"}, {"titre": "Vitrines de commerce", "desc": "Vitrages feuilletés retardateurs d'effraction, portes en verre, dépannage prioritaire pour les commerces sous contrat.", "tag": "Commerces"}, {"titre": "Survitrage & petits bois", "desc": "Bâti ancien : survitrage discret et vitrages au modèle pour fenêtres à petits carreaux — l'isolation sans trahir la façade.", "tag": "Ancien"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Métré sur place", "d": "Prise de cotes au laser, contrôle d'équerrage — les murs ne sont jamais droits, nos verres s'y adaptent."}, {"n": "02", "t": "Façonnage à l'atelier", "d": "Coupe, rodage des bords, perçages : tout se fait au Havre, pas en commande à trois semaines."}, {"n": "03", "t": "Pose propre", "d": "Protection des sols, dépose de l'ancien vitrage recyclé en filière verre, mastics et parcloses soignés."}, {"n": "04", "t": "Dossier assurance", "d": "En cas de sinistre : photos avant/après, facture détaillée conforme aux attentes des assureurs."}];
const ENGAGEMENT_DEMO = ["Devis avant intervention, même en urgence — le prix ne profite pas de la panique", "Garantie décennale sur les poses, verres certifiés CE", "Verre déposé recyclé en filière agréée — le calcin redevient du verre", "Atelier de façonnage sur place : vos mesures ne voyagent pas"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Remplacement vitrage simple", "p": "dès 120 €", "n": "Fourniture, dépose et pose, mastic ou parclose."}, {"a": "Double vitrage rénovation (m²)", "p": "dès 180 €", "n": "Sur menuiserie existante, gain thermique immédiat."}, {"a": "Paroi de douche sur mesure", "p": "dès 450 €", "n": "Verre trempé 8 mm, quincaillerie inox, pose comprise."}, {"a": "Miroir sur mesure (m²)", "p": "dès 140 €", "n": "Coupe et façon des bords comprises, pose en option."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Vitrine cassée un dimanche matin : sécurisée à midi, remplacée le mardi, dossier assurance complet fourni. Le commerce n'a pas fermé une heure.", "auteur": "Boulangerie du Rond-Point", "detail": "Urgence commerce"}, {"texte": "Double vitrage posé dans nos fenêtres de 1930 sans les changer : le bruit du boulevard a disparu, les fenêtres d'origine sont sauvées. Exactement ce qu'on voulait.", "auteur": "Catherine V.", "detail": "Rénovation double vitrage"}, {"texte": "Paroi de douche aux cotes impossibles (mur en biais) : mesurée au laser, coupée à l'atelier, posée au millimètre. Le sur-mesure qui en est vraiment.", "auteur": "Damien R.", "detail": "Miroiterie sur mesure"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "7j/7", "label": "Urgence vitrage cassé"}, {"value": "24-48 h", "label": "Remplacement standard"}, {"value": "1/10 mm", "label": "Précision de façonnage"}, {"value": "10 ans", "label": "Décennale sur les poses"}];
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

export default function MiroiterieDuPortPage() {
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

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 35 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33235000001").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "atelier@miroiterie-du-port.fr";

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /*
          ── Héros « chiffre en avant » ─────────────────────────────────────
          « 1/10 mm » tient la place du titre ; la vignette d'atelier
          l'accompagne sans lui faire face.
        */
        .i375-chiffre {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
          gap: clamp(24px, 4vw, 64px);
          align-items: center;
        }
        .i375-dire {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(22px, 3.4vw, 52px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .i375-chiffre { grid-template-columns: minmax(0,1fr); row-gap: 22px; }
          .i375-nombre { font-size: clamp(56px, 17vw, 96px) !important; }
          .i375-dire { grid-template-columns: minmax(0,1fr); row-gap: 18px; }
        }

        @media (max-width: 900px) { #i375-nav { display: none !important; } .i375-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 860px) {
          .i375-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i375-card { max-width: 380px; margin: 0 auto; width: 100%; }
          .i375-split { grid-template-columns: 1fr !important; }
          .i375-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i375-stats .i375-statcell { border-right: none !important; }
          .i375-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i375-herotext { padding: 0 24px 44px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? C.bg : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <PanelTop size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Miroiterie du Port")}</span>
              
            </>
          )}
        </div>
        <div id="i375-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px" }}>{l}</a>
          ))}
          <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33235000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ scale: 1.03 }}>
            Urgence vitrage
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i375-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
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
          <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33235000001").replace(/[^+0-9]/g, "")}`} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Urgence vitrage</a>
        </div>
      )}

      {/* ── HERO — le chiffre en avant : 1/10 mm ──────────────────────────
             La précision de façonnage est l'argument entier d'un miroitier :
             elle prend la place du titre. La grille texte-à-gauche /
             carte-à-droite était la charpente de la série. Le geste PushBlur
             reste, sur la vignette d'atelier posée en regard du chiffre. */}
      <section className="i375-hero" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(22px, 3vh, 38px)", padding: "clamp(118px, 14vh, 150px) clamp(24px, 5vw, 64px) clamp(44px, 6vh, 68px)", maxWidth: 1260, margin: "0 auto" }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>
          Vitrier-miroitier · {clientCity(sessionData) ?? "Le Havre"}
        </motion.span>

        {/* ── LE CHIFFRE, et la vignette d'atelier en regard ─────────────── */}
        <div className="i375-chiffre">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ minWidth: 0 }}>
            <div className="i375-nombre" style={{ fontFamily: FONT_TITRE, fontSize: "clamp(54px, 9vw, 132px)", fontWeight: 800, lineHeight: 0.84, letterSpacing: "-0.04em", color: C.text, marginLeft: "-0.03em", whiteSpace: "nowrap" }}>
              {STATS[2]?.value ?? "1/10 mm"}
            </div>
            <div style={{ fontSize: "clamp(12px, 1.15vw, 14px)", letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMuted, marginTop: "clamp(14px, 1.8vw, 22px)", lineHeight: 1.7, maxWidth: 320 }}>
              {STATS[2]?.label ?? "Précision de façonnage"}
            </div>
          </motion.div>

          <motion.div className="i375-vignette" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}>
            <PushBlur index={i} amount={16}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 18px 52px rgba(0,0,0,0.18)" }}>
                <div style={{ aspectRatio: "16/9", background: C.accentLight, overflow: "hidden", position: "relative" }}>
                  <img src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?auto=compress&cs=tinysrgb&w=1400"))} alt="Pose d'un châssis vitré" loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "14px 18px 16px", borderTop: `3px solid ${C.accent}`, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.accentDark, marginBottom: 5 }}>{S.k}</div>
                    <div style={{ fontFamily: FONT, fontSize: 15.5, color: C.text, lineHeight: 1.35 }}>{S.line}</div>
                  </div>
                  {/*
                    La fraction « 01 / 03 » ne disait pas ce qu'on regardait ;
                    ces traits mènent directement à chaque ouvrage.
                  */}
                  <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                    {HERO.map((h: any, n: number) => (
                      <button
                        key={h.k ?? n}
                        type="button"
                        onClick={() => go(n)}
                        aria-label={h.k ?? `Ouvrage ${n + 1}`}
                        aria-current={n === i}
                        style={{ width: 28, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : C.border, transition: "background .3s" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </PushBlur>
          </motion.div>
        </div>

        {/* la règle qui sépare le chiffre de ce qu'il garantit */}
        <span aria-hidden style={{ height: 1, background: `linear-gradient(90deg, ${C.accent}, ${C.border} 42%, transparent)` }} />

        {/* ── Ce que le chiffre veut dire ────────────────────────────────── */}
        <div className="i375-dire">
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: FONT_TITRE, fontSize: "clamp(24px, 3.2vw, 42px)", color: C.text, lineHeight: 1.08, margin: 0, overflowWrap: "break-word" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
              c?.heroHeadline ??
              clientHeroLine(sessionData, 0, 1, 36) ??
              "Le verre, coupé juste, posé net."}
          </motion.h1>
          <div style={{ minWidth: 0 }}>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ fontSize: "clamp(14.5px, 1.3vw, 16px)", color: C.textMuted, lineHeight: 1.75, margin: "0 0 22px" }}>
              {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Vitrages cassés remplacés en urgence, double vitrage sur mesure, miroirs, crédences et parois de douche : l'atelier de miroiterie qui façonne sur place, au dixième de millimètre."}
            </motion.p>
            {/* Une seule action pleine ; les ouvrages restent un lien. */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
              <motion.a href={telHref} style={{ background: C.accentDark, color: "#fff", borderRadius: 8, padding: "15px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ scale: 1.02 }}>
                Appeler l'atelier <ArrowRight size={16} />
              </motion.a>
              <a href="#services" style={{ fontSize: 13, color: C.text, textDecoration: "none", borderBottom: `1px solid ${C.accentDark}`, paddingBottom: 3 }}>
                Nos ouvrages
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div className="i375-stats i375-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i375-statcell" style={{ padding: "30px 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, color: C.hi, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 7 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="i375-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Ouvrages</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Tout ce qui est verre,<br /><em>on le fait.</em>
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
      <section id="methode" className="i375-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 50 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>La méthode</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.text, marginTop: 10, lineHeight: 1.14 }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Mesurer deux fois,<br /><em>couper une.</em>
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
      <section id="engagements" className="i375-pad" style={{ padding: "96px 64px", background: C.bgSection }}>
        <div className="i375-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}><Hammer size={80} color={C.accentDark} strokeWidth={1.1} /></div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Nos engagements</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3vw, 40px)", color: C.text, margin: "12px 0 26px", lineHeight: 1.18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                L'urgence honnête,<br /><em>le sur-mesure exact.</em>
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
      <section id="tarifs" className="i375-pad" style={{ padding: "96px 64px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Tarifs</span>
              <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.text, marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Au juste prix <em>du travail d'atelier.</em></>)}</h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "14px auto 0", lineHeight: 1.7 }}>L'urgence est facturée au même barème que le programmé, majoration de déplacement affichée. Devis ferme pour tout ouvrage sur mesure.</p>
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
      <section className="i375-pad" style={{ padding: "96px 64px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(26px, 3.4vw, 42px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Le verre, <em style={{ color: C.hi }}>sans casse-tête</em>.</>)}</h2>
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
      <section id="contact" className="i375-pad" style={{ padding: "96px 64px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>L'atelier</span>
          <h2 style={{ fontFamily: FONT_TITRE, fontSize: "clamp(28px, 4vw, 48px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Un vitrage cassé ?<br /><em>Appelez avant de bâcher.</em>
          </>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>Urgence 7j/7 : mise en sécurité le jour même. Pour le sur-mesure, l'atelier reçoit sur rendez-vous avec vos cotes ou les nôtres.</p>
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
      <footer className="i375-pad" style={{ background: C.bgDark, padding: "44px 64px 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 18, color: C.hi, marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Miroiterie du Port")}</div>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.7 }}>Vitrerie · Miroiterie · {clientCity(sessionData) ?? "Le Havre"}<br />Décennale, atelier de façonnage sur place</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? ((clientCity(sessionData) ?? "Le Havre") + ", Seine-Maritime")) }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Lun–Ven 8h–18h · urgence vitrage 7j/7" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Miroiterie du Port")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
