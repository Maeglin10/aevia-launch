"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Bike,
  CheckCircle,
  Clock,
  Droplets,
  Leaf,
  Mail,
  MapPin,
  Package,
  Phone,
  Recycle,
  Shirt,
  Star,
  Wind,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { InvertSweep } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientAreas,
  clientCertifications,
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

/* ════════════════════════════════════════════════════════════════════════════
   AQUA VERT — Pressing écologique de quartier · Strasbourg Neudorf.
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : InvertSweep — la page entière bascule du sombre (le linge
   déposé le soir) au clair (le linge rendu), pendant qu'une forme fluide monte.
   Un seul index pilote le héros : la progression `invert` colore le kicker, le
   titre, le cadran de cycle et le compteur.

   PIÈGE CONNU, tenu ici : dans le héros, AUCUNE couleur n'est fixée. Kicker,
   titre, filets, cadran et légendes héritent tous de la couleur pilotée par le
   geste (`currentColor`) — un accent figé serait illisible sur l'un des deux
   fonds. Seul le bouton plein garde l'accent, avec du blanc dessus.

   Héros H6 : typographique, sans photographie. Fontes P12 (Bricolage Grotesque
   + Figtree). Palette #f9faf7 / #5c7a4e. Signature de section : soins en tuiles
   bento inégales, tournée en itinéraire pointillé avec rail de chiffres en
   marge, tarifs en cartes, avis en colonnes décalées.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f9faf7",
  bgAlt: "#eef2ea",
  bgDark: "#1c2119",
  bgDarkAlt: "#141810",
  bgCard: "#ffffff",
  accent: "var(--brand,#5c7a4e)",
  accentDark: "var(--brand-light,#3f5a34)",
  accentLight: "#e4ecdd",
  ink: "#1b2016",
  textMuted: "#5b6552",
  textFaint: "#8b957f",
  border: "#dde4d6",
  borderSoft: "#e8ede2",
  borderDark: "rgba(255,255,255,0.10)",
  white: "#ffffff",
  inkLight: "#f3f6ef",
  sap: "#a9c491",
};

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif";
const BODY = "'Figtree', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Les soins", h: "#soins" },
  { l: "La tournée", h: "#tournee" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Engagements", h: "#engagements" },
  { l: "Collecte", h: "#collecte" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const SERVICES_SOURCE = [
  { titre: "Aquanettoyage", desc: "Programmes doux par fibre, essorage contrôlé, détergents Écolabel européen. Vos laines ne feutrent pas, vos couleurs restent.", tag: "Éco", icon: Droplets, taille: "large" },
  { titre: "Costumes & vestes", desc: "Nettoyage à l'eau puis apprêt vapeur sur mannequin. Le tombé retrouvé sans odeur de solvant.", tag: "Ville", icon: Shirt, taille: "petite" },
  { titre: "Pièces délicates", desc: "Soie, cachemire, viscose : traitées à la main, séchées à plat, rendues sous housse en coton réutilisable.", tag: "Délicat", icon: Wind, taille: "petite" },
  { titre: "Couettes & rideaux", desc: "Machines grand volume, séchage complet mesuré à la sonde — pas de moisissure surprise dans trois mois.", tag: "Maison", icon: Package, taille: "moyenne" },
  { titre: "Collecte & livraison à vélo", desc: "Deux tournées par jour dans le quartier : on collecte à votre porte, on livre au créneau choisi. Zéro voiture.", tag: "Vélo", icon: Bike, taille: "moyenne" },
  { titre: "Abonnement pressing", desc: "Forfait mensuel familles et actifs : chemises, tailleurs et urgences du dimanche soir compris. Sans engagement.", tag: "Abonnement", icon: Recycle, taille: "large" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Vous réservez un créneau", d: "Par téléphone ou au comptoir. La tournée du matin collecte avant 9 h 30, celle du soir avant 18 h 30.", h: "Matin ou soir" },
  { n: "02", t: "Sac consigné, fiche par pièce", d: "Un sac réutilisable consigné, chaque vêtement examiné et noté à l'atelier.", h: "À la collecte" },
  { n: "03", t: "Atelier dans la boutique", d: "Tout se fait sur place, derrière la vitrine — venez voir, ça sent la vapeur, pas le solvant.", h: "Sur place" },
  { n: "04", t: "Livré au créneau choisi", d: "Sous 48 h à vélo-cargo, ou en boutique dès le lendemain 17 h.", h: "48 h" },
];
let METHODE = METHODE_SOURCE;

/* La tournée porte le nom du quartier : « dans le quartier » restait vrai
   partout, la ville du client le rend concret dès qu'elle est connue. */
function METHODE_LIVE() {
  const ville = clientCity(sessionData);
  if (!ville) return METHODE_SOURCE;
  return METHODE_SOURCE.map((m, i) => (i === 3 ? { ...m, d: `${m.d} Tournées assurées dans tout ${ville}.` } : m));
}

const ENGAGEMENT_SOURCE = [
  "Zéro perchloroéthylène ni solvant chloré — aquanettoyage exclusivement",
  "Détergents Écolabel européen, doses pilotées par la machine",
  "Cintres consignés et réutilisés, housses coton lavables au lieu du plastique",
  "Pièce abîmée par notre fait = indemnisée au barème IFTH, sans discussion",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Chemise", p: "4,50 €", n: "Lavée, repassée main, sur cintre consigné ou pliée." },
  { a: "Costume 2 pièces", p: "18,90 €", n: "Aquanettoyage + apprêt mannequin, rendu 48 h." },
  { a: "Couette 2 places", p: "23,90 €", n: "Séchage sonde, housse coton offerte." },
  { a: "Abonnement actif (8 pièces/mois)", p: "49 €/mois", n: "Report des pièces non utilisées, sans engagement." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "La collecte à vélo avant le bureau, la livraison le jeudi soir : je n'ai littéralement plus à y penser. Et mes pulls ne sentent plus le produit chimique.", auteur: "Julie W.", detail: "Abonnement actif" },
  { texte: "Couette de bébé nettoyée impeccable, rendue dans une housse en coton avec la fiche du programme utilisé. C'est ce genre de détail qui fait confiance.", auteur: "Léna & Tom", detail: "Linge de maison" },
  { texte: "Je croyais que « écologique » voulait dire « moins efficace ». Ma veste en lin tachée d'huile dit le contraire. Bravo et merci.", auteur: "Pascal H.", detail: "Détachage difficile" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "100 %", label: "Aquanettoyage à l'eau" },
  { value: "0", label: "Solvant chloré depuis l'ouverture" },
  { value: "2×/j", label: "Tournées de livraison à vélo" },
  { value: "92 %", label: "De cintres réutilisés" },
];
let STATS = STATS_SOURCE;

const ZONES_SOURCE = ["Neudorf", "Krutenau", "Esplanade", "Gare", "Petite France"];
let ZONES = ZONES_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli CSS tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/11125301/pexels-photo-11125301.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
];

// Photo du client à l'emplacement i, repli sur celle du thème quand il y en a.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Kicker : filet 40×1 px puis capitales filées.
 *
 * `tone="inherit"` est le mode du héros : tout est peint en `currentColor`,
 * donc dans la couleur que le geste pilote. C'est la correction du défaut
 * connu de ce thème — un accent fixe ne contraste que sur un des deux fonds.
 */
function Kicker({ children, tone = "ink", center = false }: { children: React.ReactNode; tone?: "ink" | "light" | "inherit"; center?: boolean }) {
  const col = tone === "inherit" ? "currentColor" : tone === "light" ? "rgba(255,255,255,0.6)" : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.6, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: "currentColor", opacity: tone === "inherit" ? 0.75 : 1 }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.6, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * Cadran de cycle — le détail gratuit du héros.
 *
 * L'arc suit la progression réelle de la bascule : le tambour tourne pendant
 * qu'on défile, comme un cycle de lavage qui s'achève. Tout est tracé en
 * `currentColor` : lisible sur le fond sombre comme sur le fond clair.
 */
function CycleDial({ progress }: { progress: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, color: "currentColor" }}>
      <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden style={{ flexShrink: 0 }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
        <g transform={`rotate(${progress * 300} 64 64)`} opacity="0.55">
          <circle cx="64" cy="34" r="3" fill="currentColor" />
          <circle cx="88" cy="76" r="3" fill="currentColor" />
          <circle cx="40" cy="76" r="3" fill="currentColor" />
        </g>
        <text x="64" y="69" textAnchor="middle" fontFamily={BODY} fontSize="19" fontWeight="700" fill="currentColor">
          {Math.round(progress * 100)}%
        </text>
      </svg>
      <div style={{ maxWidth: 190 }}>
        <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.6 }}>Cycle</div>
        <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.6, opacity: 0.72, margin: "6px 0 0" }}>
          Faites défiler — l'avant / après se révèle.
        </p>
      </div>
    </div>
  );
}

/**
 * Surface photographique avec repli dessiné : gouttes et feuille au trait,
 * dégradé végétal. La section reste belle images bloquées.
 */
function Plate({ src, alt, ratio = "4/3", label }: { src: string; alt: string; ratio?: string; label?: string }) {
  return (
    <div style={{ position: "relative", aspectRatio: ratio, background: C.accentLight, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${C.border}` }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage: `radial-gradient(circle at 20% 20%, ${C.white} 0 3px, transparent 3px), radial-gradient(circle at 70% 55%, ${C.white} 0 4px, transparent 4px)`,
          backgroundSize: "48px 48px, 66px 66px",
        }}
      />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, transparent 30%, ${C.sap} 140%)`, opacity: 0.35 }} />
      {!src && (
        <svg aria-hidden viewBox="0 0 120 90" style={{ position: "absolute", left: "50%", top: "50%", width: "38%", transform: "translate(-50%,-50%)", opacity: 0.55 }}>
          <path d="M60 20c16 10 24 22 24 34a24 24 0 0 1-48 0c0-12 8-24 24-34Z" fill="none" stroke={C.accentDark} strokeWidth="1" />
          <path d="M60 34v34" fill="none" stroke={C.accentDark} strokeWidth="1" />
        </svg>
      )}
      {src && <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "36%", height: 3, background: C.accent }} />
      {label && (
        <span style={{ position: "absolute", left: 16, bottom: 16, fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.ink, background: "rgba(255,255,255,0.9)", padding: "6px 12px" }}>
          {label}
        </span>
      )}
    </div>
  );
}

/* Tuile de soin — les tailles sont inégales : le plateau du pressing n'est pas
   une grille régulière. Survol : élévation, deux ombres, filet d'accent. */
function SoinTile({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Droplets;
  const grande = s.taille === "large";
  return (
    <article
      className={`i344-tile i344-tile-${s.taille ?? "moyenne"}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: hov ? C.white : C.bgCard,
        border: `1px solid ${hov ? C.accent : C.border}`,
        padding: grande ? "clamp(26px, 3vw, 40px)" : "clamp(22px, 2.4vw, 30px)",
        minHeight: grande ? 260 : 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(27,32,22,0.10), 0 4px 12px rgba(27,32,22,0.06)" : "0 1px 0 rgba(27,32,22,0.03)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        aria-hidden
        style={{ position: "absolute", right: 12, bottom: -14, fontFamily: DISPLAY, fontWeight: 800, fontSize: grande ? 128 : 90, lineHeight: 0.8, color: C.ink, opacity: 0.05, pointerEvents: "none", userSelect: "none" }}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ width: 36, height: 36, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentDark, flexShrink: 0 }}>
            <Icon size={17} aria-hidden />
          </span>
          <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: grande ? "clamp(21px, 2.4vw, 29px)" : "clamp(18px, 2vw, 22px)", lineHeight: 1.15, letterSpacing: "-0.01em", color: C.ink, margin: "0 0 10px" }}>{s.titre}</h3>
        <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.72, color: C.textMuted, margin: 0, maxWidth: 460 }}>{s.desc}</p>
      </div>
      <div style={{ position: "relative", marginTop: 20, display: "flex", alignItems: "center", gap: 9, fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: hov ? C.accent : C.textFaint, transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        Programmer une collecte
        <ArrowRight size={14} aria-hidden style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
    </article>
  );
}

/* Carte de tarif : le prix domine, la note explique, la barre d'accent pousse. */
function TarifCard({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: C.bgCard,
        border: `1px solid ${hov ? C.accent : C.border}`,
        padding: "clamp(24px, 2.8vw, 34px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(27,32,22,0.10), 0 4px 12px rgba(27,32,22,0.05)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span aria-hidden style={{ position: "absolute", left: 0, top: 0, width: hov ? "100%" : 46, height: 3, background: C.accent, transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginBottom: 14 }}>
        Tarif {String(idx + 1).padStart(2, "0")}
      </div>
      <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.2, color: C.ink, margin: "0 0 12px" }}>{t.a}</h3>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1, letterSpacing: "-0.02em", color: hov ? C.accent : C.accentDark, transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {t.p}
      </div>
      <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: C.textMuted, margin: "14px 0 0" }}>{t.n}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function AquaVertPressingPage() {
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

  /* Blocs vivants : recalculés à chaque rendu, une fois la session affectée. */
  METHODE = METHODE_LIVE();
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  ZONES = resolveList(clientAreas(sessionData) ?? clientList(sessionData, "collecte.zones"), ZONES_SOURCE);
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price || TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description || s.desc || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text || AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name || r.author || AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location || r.role || AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title || SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description || s.desc || SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
      taille: SERVICES_DEMO[n % SERVICES_DEMO.length].taille,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", adresse: "", creneau: "Matin — avant 9h30", message: "" });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "Aqua Vert";
  const ville = clientCity(sessionData) ?? "Strasbourg";
  const metier = clientTrade(sessionData) ?? "Pressing écologique";
  const phone = clientPhone(sessionData) ?? "03 88 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33388000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "boutique@aqua-vert-pressing.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "67100", "Strasbourg");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.phone) setFormSent(true);
  };

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @media (max-width: 980px) { #i344-nav { display: none !important; } .i344-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i344-bento { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; }
          .i344-tile-large { grid-column: span 2 !important; }
        }
        @media (max-width: 860px) {
          .i344-split { grid-template-columns: minmax(0,1fr) !important; }
          .i344-split > * { order: initial !important; }
          .i344-railcol { position: static !important; }
          .i344-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i344-avis > * { margin-top: 0 !important; }
        }
        @media (max-width: 620px) {
          .i344-bento { grid-template-columns: minmax(0,1fr) !important; }
          .i344-tile-large { grid-column: span 1 !important; }
        }

        .i344-navlink { position: relative; }
        .i344-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 7px; height: 1.5px; width: 0;
          background: currentColor; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i344-navlink:hover::after { width: calc(100% - 16px); }

        .i344-field {
          width: 100%; padding: 13px 15px; background: ${C.white};
          border: 1px solid ${C.border}; color: ${C.ink};
          font-family: ${BODY}; font-size: 14px; outline: none;
          transition: border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i344-field:focus { border-color: ${C.accent}; box-shadow: 0 0 0 3px ${C.accentLight}; }

        @media (prefers-reduced-motion: reduce) {
          .i344-navlink::after { transition: none; }
        }
      `}</style>

      {/* ── NAV — collante : hauteur, fond, flou, filet, couleur d'encre ─── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 62 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          background: scrolled ? "rgba(249,250,247,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          color: scrolled ? C.ink : C.inkLight,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Leaf size={17} color={scrolled ? C.accent : C.sap} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em", color: "currentColor", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: "currentColor", opacity: 0.6, marginLeft: 8 }}>{metier}</span>
            </>
          )}
        </div>
        <div id="i344-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i344-navlink" style={{ fontFamily: BODY, color: "currentColor", opacity: 0.78, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accent, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 12 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Collecte à vélo
          </motion.a>
        </div>
        <button
          className="i344-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, color: "currentColor" }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Collecte à vélo
          </a>
        </div>
      )}

      {/* ── HÉROS H6 — InvertSweep : la page bascule du sombre au clair.
             Tout le contenu hérite la couleur pilotée par le geste : pas un
             seul hex fixe dans ce bloc, hors bouton plein. ──────────────── */}
      <InvertSweep dark={C.bgDark} light={C.bg} textDark={C.inkLight} textLight={C.ink} accent={C.accent} className="">
        {(invert) => (
          <div
            style={{
              position: "relative",
              minHeight: "100dvh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(124px, 16vh, 172px) clamp(24px, 5vw, 64px) clamp(44px, 7vh, 76px)",
            }}
          >
            {/* Texture : le fil à linge, tracé en currentColor — lisible sur
                les deux fonds parce qu'il hérite lui aussi. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.07,
                backgroundImage: "repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 74px)",
              }}
            />
            {/* Marque fantôme : l'eau, seul solvant de la maison. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "-1vw",
                bottom: "6vh",
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(120px, 24vw, 340px)",
                lineHeight: 0.78,
                letterSpacing: "-0.04em",
                color: "currentColor",
                opacity: 0.055,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              H₂O
            </div>

            <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", position: "relative" }}>
              <Kicker tone="inherit">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(40px, 7vw, 88px)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.03em",
                  margin: "24px 0 26px",
                  maxWidth: 1000,
                  color: "currentColor",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
                  <>
                    <span style={{ display: "block" }}>{clientHeroLine(sessionData, 0, 2, 24) ?? "Le propre qui ne pollue"}</span>
                    {/* La seconde ligne est détourée : son trait suit la bascule,
                        donc elle reste lisible du sombre au clair. */}
                    <span
                      style={{
                        display: "block",
                        color: "transparent",
                        WebkitTextStroke: `1.6px color-mix(in srgb, ${C.ink} ${Math.round(invert * 100)}%, ${C.inkLight})`,
                      }}
                    >
                      {clientHeroLine(sessionData, 1, 2, 24) ?? "ni vos fibres, ni la ville."}
                    </span>
                  </>
                )}
              </h1>

              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(15px, 1.6vw, 17.5px)", lineHeight: 1.78, opacity: 0.76, maxWidth: 540, margin: "0 0 34px", color: "currentColor" }}>
                {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Aquanettoyage à l'eau, détergents certifiés Écolabel, consigne de cintres et livraison à vélo dans tout Neudorf. Le pressing d'à côté, en mieux pour tout le monde."}
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(36px, 6vh, 64px)" }}>
                <motion.a
                  href="#collecte"
                  style={{ background: C.accent, color: C.white, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  Programmer une collecte <ArrowRight size={16} aria-hidden />
                </motion.a>
                <a
                  href="#soins"
                  style={{ border: "1px solid currentColor", color: "currentColor", padding: "15px 26px", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, textDecoration: "none", opacity: 0.85 }}
                >
                  Nos soins
                </a>
              </div>

              {/* Le cadran de cycle : la progression réelle de la bascule. */}
              <CycleDial progress={invert} />
            </div>
          </div>
        )}
      </InvertSweep>

      {/* ── RESPIRATION — une phrase, en italique, rien d'autre ──────────── */}
      <section className="i344-pad" style={{ background: C.bg, padding: "clamp(56px, 8vw, 96px) 64px clamp(28px, 4vw, 44px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 30px)", lineHeight: 1.5, letterSpacing: "-0.015em", color: C.textMuted, maxWidth: 680, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                L'eau lave depuis toujours. <span style={{ color: C.ink }}>Le reste n'était qu'une habitude.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── LES SOINS — tuiles bento inégales ────────────────────────────── */}
      <section id="soins" className="i344-pad" style={{ background: C.bg, padding: "clamp(28px, 4vw, 48px) 64px clamp(76px, 9vw, 120px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Nos soins</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 4.4vw, 56px)", lineHeight: 1.04, letterSpacing: "-0.025em", color: C.ink, margin: "16px 0 14px", maxWidth: 700 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Laver mieux, <em style={{ fontStyle: "italic", color: C.accent }}>jeter moins.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, maxWidth: 520, margin: "0 0 clamp(28px, 4vw, 46px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>Le programme est choisi par la fibre, pas par la cadence : c'est ce qui allonge la vie d'un vêtement bien plus qu'un label.</>
              )}
            </p>
          </Reveal>
          <div className="i344-bento" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={idx * 0.055} y={20}>
                <SoinTile s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA TOURNÉE — itinéraire pointillé + rail de chiffres en marge ── */}
      <section id="tournee" className="i344-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 124px) 64px" }}>
        <div className="i344-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,0.65fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "start" }}>
          <div>
            <Reveal>
              <Kicker>La tournée</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: C.ink, margin: "16px 0 clamp(30px, 4vw, 48px)", maxWidth: 620 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Votre pressing <em style={{ fontStyle: "italic", color: C.accent }}>passe devant chez vous.</em>
                  </>
                )}
              </h2>
            </Reveal>
            <div style={{ position: "relative", paddingLeft: 34 }}>
              {/* L'itinéraire : un pointillé vertical, comme une trace de vélo. */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 9,
                  top: 8,
                  bottom: 26,
                  width: 2,
                  backgroundImage: `repeating-linear-gradient(180deg, ${C.accent} 0 6px, transparent 6px 14px)`,
                  opacity: 0.55,
                }}
              />
              {METHODE.map((m: any, idx: number) => (
                <Reveal key={m.n} delay={idx * 0.08} y={18}>
                  <div style={{ position: "relative", paddingBottom: idx === METHODE.length - 1 ? 0 : "clamp(26px, 3.4vw, 42px)" }}>
                    <span
                      aria-hidden
                      style={{ position: "absolute", left: -34, top: 4, width: 20, height: 20, borderRadius: "50%", background: C.bgAlt, border: `2px solid ${C.accent}`, display: "block" }}
                    />
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15, color: C.accentDark, letterSpacing: "0.02em" }}>{m.n}</span>
                      <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.2, color: C.ink, margin: 0 }}>{m.t}</h3>
                      <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint, border: `1px solid ${C.border}`, padding: "4px 9px" }}>{m.h}</span>
                    </div>
                    <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, margin: "10px 0 0", maxWidth: 540 }}>{m.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Les quartiers desservis — repris de la zone du client s'il l'a saisie. */}
            <Reveal delay={0.1}>
              <div style={{ marginTop: "clamp(30px, 4vw, 46px)", display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center" }}>
                <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginRight: 6 }}>Desservi</span>
                {ZONES.map((z: any, idx: number) => (
                  <span key={idx} style={{ fontFamily: BODY, fontSize: 13, color: C.ink, background: C.white, border: `1px solid ${C.border}`, padding: "7px 14px" }}>
                    {z}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Rail de chiffres : collant au défilement, statique sous 860 px. */}
          <div className="i344-railcol" style={{ position: "sticky", top: 110 }}>
            <Reveal delay={0.12}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "clamp(22px, 2.6vw, 32px)", boxShadow: "0 18px 44px rgba(27,32,22,0.06)" }}>
                <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>En chiffres</span>
                {STATS.map((s: any, idx: number) => (
                  <div key={s.label} style={{ padding: "18px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.borderSoft}`, marginTop: idx === 0 ? 14 : 0, position: "relative" }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(26px, 3vw, 36px)", lineHeight: 1, letterSpacing: "-0.02em", color: C.accent }}>{s.value}</div>
                    <div style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.55, color: C.textMuted, marginTop: 7 }}>{s.label}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 9, fontFamily: BODY, fontSize: 12, color: C.textFaint }}>
                  <Bike size={14} color={C.accent} aria-hidden /> Deux tournées par jour, zéro voiture
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Deux emplacements photo de plus, en bande : la tournée et l'atelier.
            Sans image, les aplats végétaux tiennent la bande seuls. */}
        <div style={{ maxWidth: 1160, margin: "clamp(36px, 5vw, 60px) auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
          {[
            { i: 1, alt: "Vélo-cargo de collecte devant la boutique", label: "La tournée" },
            { i: 2, alt: "Machines d'aquanettoyage en atelier", label: "L'atelier" },
          ].map((ph, idx) => (
            <Reveal key={ph.i} delay={idx * 0.08}>
              <Plate src={photo(ph.i, PHOTO_FALLBACK[ph.i])} alt={ph.alt} ratio="16/10" label={ph.label} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TARIFS — en cartes ───────────────────────────────────────────── */}
      <section id="tarifs" className="i344-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", top: "-12%", right: "-6%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.1, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker center>Tarifs</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: C.ink, textAlign: "center", margin: "16px 0 14px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Justes, <em style={{ fontStyle: "italic", color: C.accent }}>et affichés.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, maxWidth: 560, margin: "0 auto clamp(30px, 4vw, 50px)", textAlign: "center" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                <>Collecte et livraison à vélo incluses dès 25 € de dépôt dans le quartier. Détachage courant compris.</>
              )}
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a} delay={idx * 0.06} y={18}>
                <TarifCard t={t} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — panneau à gauche, preuves à droite ─────────────── */}
      <section id="engagements" className="i344-pad" style={{ background: C.bgDark, color: "rgba(255,255,255,0.82)", padding: "clamp(76px, 9.5vw, 124px) 64px" }}>
        <div className="i344-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <Plate src={photo(0, PHOTO_FALLBACK[0])} alt="Linge plié à la main" ratio="4/5" label="Atelier" />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker tone="light">Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.white, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    L'écologie, <em style={{ fontStyle: "italic", color: C.sap }}>prouvée pièces en main.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: "rgba(255,255,255,0.62)", margin: "0 0 26px", maxWidth: 480 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? c?.aboutText ?? (
                  <>Un pressing écologique se vérifie à trois choses : ce qu'il met dans l'eau, ce qu'il fait des cintres, et ce qu'il répond quand une pièce est abîmée.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.sap} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées ─────────────────────────────────────── */}
      <section className="i344-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 120px) 64px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Kicker center>Le quartier</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.ink, textAlign: "center", margin: "16px 0 clamp(34px, 5vw, 56px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Le quartier <em style={{ fontStyle: "italic", color: C.accent }}>a son pressing.</em>
                </>
              )}
            </h2>
          </Reveal>
          <div className="i344-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18, alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur} delay={idx * 0.09}>
                <figure
                  style={{
                    position: "relative",
                    margin: 0,
                    marginTop: idx === 1 ? 40 : idx === 2 ? 20 : 0,
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    padding: "28px 26px",
                    overflow: "hidden",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", right: 10, top: -26, fontFamily: DISPLAY, fontWeight: 800, fontSize: 130, lineHeight: 1, color: C.ink, opacity: 0.06, pointerEvents: "none" }}>
                    »
                  </span>
                  <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill={C.accent} color={C.accent} aria-hidden />
                    ))}
                  </div>
                  <blockquote style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.ink, margin: "0 0 18px", position: "relative" }}>
                    «&nbsp;{a.texte}&nbsp;»
                  </blockquote>
                  <figcaption style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 14 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.06em", color: C.textFaint, marginTop: 4 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTE — coordonnées + demande de créneau ──────────────────── */}
      <section id="collecte" className="i344-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9.5vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", left: "-3%", bottom: "-16%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(110px, 19vw, 280px)", lineHeight: 0.8, color: C.ink, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}
        >
          48h
        </div>
        <div className="i344-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 68px)", alignItems: "start", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>{ville} & alentours</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Un sac à préparer, <em style={{ fontStyle: "italic", color: C.accent }}>on s'occupe du reste.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 440, margin: "0 0 30px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Collectes deux fois par jour à vélo-cargo. Boutique ouverte du lundi au samedi, sans rendez-vous.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                  { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                  { icon: MapPin, label: "Boutique & atelier", value: adresse },
                  { icon: Clock, label: "Horaires", value: "Lun–Ven 8h–19h · Sam 9h–17h" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ display: "flex", gap: 15, alignItems: "center" }}>
                      <div style={{ width: 42, height: 42, background: C.white, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                        <Icon size={16} aria-hidden />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, color: C.ink, textDecoration: "none" }}>{item.value}</a>
                        ) : (
                          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, color: C.ink, lineHeight: 1.4 }}>{item.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "clamp(24px, 3vw, 38px)", boxShadow: "0 22px 50px rgba(27,32,22,0.07)" }}>
              {formSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} style={{ textAlign: "center", padding: "26px 0" }}>
                  <CheckCircle size={42} color={C.accent} style={{ margin: "0 auto 16px", display: "block" }} aria-hidden />
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, color: C.ink, margin: "0 0 8px" }}>Créneau noté</h3>
                  <p style={{ fontFamily: BODY, fontSize: 14, fontWeight: 300, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                    Merci {form.name}, la tournée vous rappelle pour confirmer le passage.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textFaint, marginBottom: 6 }}>Collecte à vélo</div>
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.15, color: C.ink, margin: 0 }}>Demander un passage</h3>
                  </div>
                  {[
                    { label: "Nom", key: "name", type: "text", required: true },
                    { label: "Téléphone", key: "phone", type: "tel", required: true },
                    { label: "Adresse de collecte", key: "adresse", type: "text", required: false },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, marginBottom: 7, fontWeight: 600 }}>{f.label}</label>
                      <input
                        className="i344-field"
                        type={f.type}
                        required={f.required}
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, marginBottom: 7, fontWeight: 600 }}>Créneau</label>
                    <select className="i344-field" value={form.creneau} onChange={(e) => setForm({ ...form, creneau: e.target.value })}>
                      <option>Matin — avant 9h30</option>
                      <option>Soir — avant 18h30</option>
                      <option>Dépôt en boutique</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, marginBottom: 7, fontWeight: 600 }}>Pièces à traiter</label>
                    <textarea
                      className="i344-field"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Chemises, couette, veste tachée…"
                      style={{ resize: "none" }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    style={{ background: C.accent, color: C.white, border: "none", padding: "16px 28px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 44 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    Programmer la collecte <ArrowRight size={15} aria-hidden />
                  </motion.button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i344-pad" style={{ background: C.bgDarkAlt, color: "rgba(255,255,255,0.6)", padding: "clamp(46px, 6vw, 68px) 64px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <Leaf size={16} color={C.sap} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: C.white }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {metier} · {clientCodePostalVille(sessionData, "67100", "Strasbourg")}
                <br />
                Aquanettoyage certifié, zéro solvant chloré
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Nous trouver</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: C.sap, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", gap: 9, alignItems: "center" }}>
                <Clock size={13} aria-hidden /> Lun–Ven 8h–19h · Sam 9h–17h
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
