"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, Menu, Check } from "lucide-react";

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#F5F5F0",
  bgDark: "#0A0A0A",
  white: "#F5F5F0",
  text: "#0A0A0A",
  textMuted: "#666666",
  accent: "#DCFF00",
  accentDark: "#B8D900",
  border: "#0A0A0A",
  borderLight: "#E0E0DA",
  mono: "'JetBrains Mono', 'Courier New', monospace",
  sans: "system-ui, -apple-system, sans-serif",
};

const SERVICES = [
  {
    num: "01",
    name: "Branding & Identité Visuelle",
    desc: "Nom, logo, charte graphique, guidelines. On construit les fondations que vos concurrents essaieront de copier dans 3 ans. Sans compromis esthétiques, sans trend fugace.",
    tags: ["Logo", "Charte", "Guidelines", "Naming"],
    price: "À partir de 7 500 €",
    deliverable: "4 à 8 semaines",
  },
  {
    num: "02",
    name: "Web Design & Développement",
    desc: "Sites web sur-mesure en Next.js. Performants, accessibles, animés. On ne livre pas des templates habillés — on code ce qu'aucun builder ne peut faire.",
    tags: ["Next.js", "Animations", "CMS", "PWA"],
    price: "À partir de 12 000 €",
    deliverable: "6 à 12 semaines",
  },
  {
    num: "03",
    name: "Campagnes & Stratégie Média",
    desc: "Stratégie créative + production + achat média. ROI mesurable. Un brief précis, une exécution audacieuse, des résultats documentés.",
    tags: ["Social Ads", "Display", "Email", "Analytics"],
    price: "À partir de 4 500 €/mois",
    deliverable: "Engagement 3 mois min.",
  },
  {
    num: "04",
    name: "Direction Artistique & Contenu",
    desc: "Shooting photo/vidéo, motion design, direction de casting. On crée les images que vos clients vont envoyer à leurs contacts en disant 'c'est eux qu'il faut appeler'.",
    tags: ["Photo", "Vidéo", "Motion", "Casting"],
    price: "À partir de 3 200 €",
    deliverable: "2 à 4 semaines",
  },
  {
    num: "05",
    name: "UX Research & Product Design",
    desc: "User research, wireframes, prototypes interactifs, design system. Des produits que les gens utilisent avec plaisir — pas juste avec résignation.",
    tags: ["UX", "Figma", "Tests", "Design System"],
    price: "À partir de 8 500 €",
    deliverable: "5 à 10 semaines",
  },
  {
    num: "06",
    name: "Consulting Stratégique",
    desc: "Repositionnement, naming, go-to-market, audit de communication. On pense avant d'exécuter. Et parfois, penser c'est la chose la plus précieuse qu'on puisse vous offrir.",
    tags: ["Strategy", "Audit", "GTM", "Positioning"],
    price: "À partir de 2 800 €",
    deliverable: "2 à 3 semaines",
  },
];

const CASES = [
  {
    name: "Maison Leroux",
    type: "Branding complet + E-commerce",
    year: "2025",
    result: "+340% de conversions en 6 mois",
    color: C.accent,
    textColor: C.text,
    desc: "Une maison de prêt-à-porter parisienne invisible malgré un produit excellent. On a reconstruit l'identité de zéro — de l'architecture de marque au site Shopify sur-mesure.",
  },
  {
    name: "Volta Energy",
    type: "Web Design + Campagne B2B",
    year: "2025",
    result: "3× leads qualifiés / trimestre",
    color: "#7C3AED",
    textColor: "#fff",
    desc: "Une scale-up deeptech avec des investisseurs sérieux mais un site de 2019. Refonte complète + campagne LinkedIn ciblée sur les DAF des ETI de plus de 200 personnes.",
  },
  {
    name: "Nude Beauté",
    type: "Direction Art + Social Media",
    year: "2024",
    result: "680K impressions semaine 1",
    color: "#E8C4A0",
    textColor: C.text,
    desc: "Une marque beauté clean qui n'avait pas les codes visuels de sa cible. 6 semaines de direction artistique, une campagne UGC orchestrée, une communauté créée de zéro.",
  },
  {
    name: "Atelier Moreau",
    type: "Identité + Print + Packaging",
    year: "2024",
    result: "Présent dans 4 galeries parisiennes",
    color: "#1A1A1A",
    textColor: "#F5F5F0",
    desc: "Un céramiste d'exception sans identité visuelle à la hauteur de son travail. Naming, logo, système graphique et packaging premium qui ont ouvert les portes des galeries.",
  },
  {
    name: "DataFlux SaaS",
    type: "Product Design + UX Research",
    year: "2024",
    result: "Onboarding: -62% de drop",
    color: "#0A0A0A",
    textColor: "#DCFF00",
    desc: "Un outil de data viz puissant mais incompréhensible pour les non-techs. 3 semaines de research, refonte de l'onboarding, taux de complétion passé de 21% à 84%.",
  },
];

const STATS = [
  { val: "127", suffix: "+", label: "Projets livrés depuis 2019" },
  { val: "94", suffix: "%", label: "Clients en relation longue durée" },
  { val: "12×", suffix: "", label: "ROI moyen sur campagnes" },
  { val: "06", suffix: "", label: "Disciplines maîtrisées" },
];

const TEAM = [
  {
    name: "Léa Fontaine",
    role: "Directrice Générale",
    since: "2019",
    bg: C.accent,
    fg: C.text,
    initials: "LF",
    quote: "Je refuse les projets qu'on ne peut pas signer.",
  },
  {
    name: "Maxime Aubert",
    role: "Directeur Artistique",
    since: "2020",
    bg: C.bgDark,
    fg: C.white,
    initials: "MA",
    quote: "La cohérence, c'est ce qui transforme un beau logo en vraie marque.",
  },
  {
    name: "Chloé Renard",
    role: "Lead Développeur",
    since: "2021",
    bg: "#7C3AED",
    fg: "#fff",
    initials: "CR",
    quote: "Le code que j'écris sera lu par des humains, pas juste des machines.",
  },
  {
    name: "Paul Giraud",
    role: "Stratège & Conseil",
    since: "2022",
    bg: "#2A2A2A",
    fg: C.white,
    initials: "PG",
    quote: "Un bon brief vaut mieux qu'un grand budget.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Bureau a transformé notre positionnement en 6 semaines. On est passés de «une agence parmi d'autres» à «la référence» dans notre secteur. Chiffres à l'appui.",
    name: "Camille Renard",
    role: "Fondatrice, Maison Leroux",
  },
  {
    quote: "Le site qu'ils ont livré convertit à 4,8 %. Notre ancienne agence n'avait jamais dépassé 1,2 %. Les chiffres parlent d'eux-mêmes — et ils parlent fort.",
    name: "Théo Marchand",
    role: "CMO, Volta Energy",
  },
  {
    quote: "Créatifs, rigoureux, et ils disent non quand c'est nécessaire. C'est rare, et c'est précieux. On a recommandé Bureau à trois de nos partenaires.",
    name: "Léa Fontaine-Bernard",
    role: "CEO, Nude Beauté",
  },
  {
    quote: "Le seul prestataire qui a compris notre produit sans qu'on passe 3 semaines à l'expliquer. Livrés dans les temps, dans les budgets, au-delà des attentes.",
    name: "Sébastien Liu",
    role: "CTO, DataFlux",
  },
];

const PLANS = [
  {
    name: "Lancement",
    price: "8 900 €",
    note: "tarif fixe tout inclus",
    features: [
      "Branding complet (logo + charte)",
      "Site vitrine 5 pages optimisé",
      "Kit réseaux sociaux (12 formats)",
      "Stratégie contenu 3 mois",
      "1 session consulting stratégique",
      "Livraison en 6 semaines",
    ],
    cta: "Démarrer ce pack",
    highlight: false,
  },
  {
    name: "Croissance",
    price: "2 400 €",
    note: "/mois · engagement 6 mois",
    features: [
      "Tout du pack Lancement inclus",
      "Gestion social media (3 canaux)",
      "Campagnes ads avec budget géré",
      "Reporting mensuel détaillé",
      "Direction artistique continue",
      "Accès direct à l'équipe senior",
    ],
    cta: "Démarrer ce retainer",
    highlight: true,
  },
  {
    name: "Partenariat",
    price: "Sur devis",
    note: "pour marques ambitieuses",
    features: [
      "Équipe dédiée à temps plein",
      "Accès C-level permanent",
      "Retainer flexible adaptatif",
      "Relations presse & influence",
      "Accès réseau partenaires exclusifs",
      "Reporting board-ready mensuel",
    ],
    cta: "Nous écrire",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Travaillez-vous avec des startups au stade très précoce ?",
    a: "Oui — à condition que la fondation soit solide. On n'habille pas l'inexistant. On préfère les projets ambitieux aux budgets illimités : une startup qui sait où elle va, c'est plus excitant qu'une grande marque qui tourne en rond.",
  },
  {
    q: "Quels délais pour un projet de branding complet ?",
    a: "Entre 4 et 8 semaines pour un branding complet. On ne précipite pas ce qui doit durer 10 ans. Si quelqu'un vous promet une identité complète en 2 semaines, posez-vous des questions.",
  },
  {
    q: "Proposez-vous des paiements échelonnés ?",
    a: "Oui : 40% à la signature, 30% à la présentation du concept, 30% à la livraison finale. Pour les retainers mensuels, facturation en début de mois.",
  },
  {
    q: "Vous occupez-vous du suivi post-lancement ?",
    a: "Toujours. Un projet livré sans support, c'est une voiture sans révision. On reste disponibles pour les ajustements dans les 60 jours suivant la livraison — sans surcoût.",
  },
  {
    q: "Combien de propositions créatives recevons-nous ?",
    a: "Une seule — mais la bonne. On ne présente pas 3 directions pour vous laisser arbitrer à notre place. On recommande ce en quoi on croit, on explique pourquoi, et on raffine ensemble.",
  },
  {
    q: "Peut-on voir votre processus en détail ?",
    a: "Oui — réservez un call de 30 min et on vous présente notre playbook complet : découverte, brief, concept, production, livraison, support. Pas de surprise, pas de black box.",
  },
];

const MANIFESTE = [
  "On travaille avec des gens qui veulent vraiment changer quelque chose.",
  "On dit non plus souvent qu'on dit oui.",
  "La beauté sans efficacité, c'est de la décoration. On fait les deux.",
  "Un brief flou, c'est notre responsabilité de le clarifier.",
  "On ne sous-traite pas ce qu'on vous a vendu.",
  "Les délais sont des promesses. On tient les nôtres.",
];

const MARQUEE_ITEMS = "BRANDING — WEB — CAMPAGNES — DIRECTION ART — UX — CONSULTING — ";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function BureauPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

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
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand };
  }

  const [activeService, setActiveService] = useState<number | null>(null);
  const [activeCase, setActiveCase] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();

  const marqueeX = useTransform(scrollY, [0, 3000], ["0%", "-40%"]);
  const heroTextScale = useTransform(scrollY, [0, 600], [1, 0.94]);

  const statsRef = useRef(null);
  const casesRef = useRef(null);
  const pricingRef = useRef(null);
  const teamRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const casesInView = useInView(casesRef, { once: true, margin: "-80px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: C.sans, overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.bgDark, borderBottom: `2px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 60,
      }}>
        {fd?.logoBase64 ? (
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <span style={{ fontFamily: C.mono, fontSize: 14, letterSpacing: 4, textTransform: "uppercase", color: C.white, fontWeight: 700 }}>
            BUREAU
          </span>
        )}
        <div id="mb164-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {[
            { label: "Services", href: "#services" },
            { label: "Travaux", href: "#travaux" },
            { label: "Manifeste", href: "#manifeste" },
            { label: "Tarifs", href: "#tarifs" },
          ].map(link => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ color: C.accent }}
              style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "rgba(245,245,240,0.45)", transition: "color 0.15s" }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ background: C.accent, color: C.text, borderColor: C.accent }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", border: `1.5px solid ${C.white}`, background: "transparent", color: C.white, padding: "9px 22px", cursor: "pointer", transition: "all 0.15s" }}
          >
            Call 30 min →
          </motion.button>
      </div>
        <button
          className="mb164-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {[
            { label: "Services", href: "#services" },
            { label: "Travaux", href: "#travaux" },
            { label: "Manifeste", href: "#manifeste" },
            { label: "Tarifs", href: "#tarifs" },
          ].map(link => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ color: C.accent }}
              style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "rgba(245,245,240,0.45)", transition: "color 0.15s" }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ background: C.accent, color: C.text, borderColor: C.accent }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", border: `1.5px solid ${C.white}`, background: "transparent", color: C.white, padding: "9px 22px", cursor: "pointer", transition: "all 0.15s" }}
          >
            Call 30 min →
          </motion.button>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb164-nav { display: none !important; } .mb164-burger { display: flex !important; } }`}</style>

      {/* HERO — full viewport, split asymmetric */}
      <section className="imx-mobstack" id="hero" style={{ minHeight: "100dvh", paddingTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `2px solid ${C.bgDark}` }}>
        {/* Left: oversized headline */}
        <div style={{ borderRight: `2px solid ${C.bgDark}`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 64px" }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase" }}>
            Agence Créative Indépendante — Paris, depuis 2019
          </div>

          <motion.div style={{ scale: heroTextScale }}>
            <div style={{ fontSize: "clamp(56px, 8vw, 120px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-3px", marginBottom: 40 }}>
              ON FAIT<br />
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${C.bgDark}` }}>DES</span><br />
              CHOSES<br />
              <span style={{ color: C.accent, WebkitTextStroke: "0px" }}>QUI</span><br />
              MARCHENT
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 13, color: C.textMuted, lineHeight: 1.8, maxWidth: 380 }}>
              Branding, web, campagnes, direction artistique. On ne fait pas joli pour le portfolio — on fait efficace pour vos résultats.
            </div>
          </motion.div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase" }}>
              5 slots disponibles — Q3 2026
            </div>
          </div>
        </div>

        {/* Right: interactive element + CTA */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 64px", background: C.bg }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {/* Animated brutalist block */}
            <motion.div
              animate={{
                rotate: [0, 2, -2, 1, -1, 0],
                scale: [1, 1.02, 0.99, 1.01, 1],
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              style={{ width: 200, height: 200, background: C.accent, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ position: "absolute", top: 8, left: 8, right: -8, bottom: -8, border: `3px solid ${C.bgDark}`, zIndex: -1 }} />
              <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, fontWeight: 700, color: C.text, textTransform: "uppercase", textAlign: "center", lineHeight: 1.6 }}>
                DESIGN<br />IS<br />STRATEGY
              </span>
            </motion.div>
          </div>

          {/* Stacked services preview */}
          <div>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase", marginBottom: 16 }}>
              06 disciplines
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 40 }}>
              {["Branding", "Web", "Campagnes", "Direction Art", "UX", "Consulting"].map((tag, i) => (
                <span key={i} style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 2, padding: "5px 12px", border: `1px solid ${C.bgDark}`, color: C.text, textTransform: "uppercase" }}>
                  {tag}
                </span>
              ))}
            </div>
            <motion.button
              whileHover={{ background: C.accent, borderColor: C.accent, color: C.text }}
              whileTap={{ scale: 0.97 }}
              style={{ width: "100%", padding: "22px 40px", background: C.bgDark, color: C.white, border: `2px solid ${C.bgDark}`, fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}
            >
              Réserver un call de 30 min
            </motion.button>
            <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>
              SANS ENGAGEMENT — SANS BULLSHIT
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — scroll-driven, lime accent background */}
      <div style={{ overflow: "hidden", borderBottom: `2px solid ${C.bgDark}`, background: C.accent, padding: "16px 0", borderTop: `2px solid ${C.bgDark}` }}>
        <motion.div style={{ x: marqueeX, display: "flex", whiteSpace: "nowrap", willChange: "transform" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{ fontFamily: C.mono, fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: C.text, marginRight: 80, fontWeight: 700 }}>
              {MARQUEE_ITEMS}
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <section ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `2px solid ${C.bgDark}`, background: C.bg }}>
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ padding: "52px 44px", borderRight: i < 3 ? `2px solid ${C.bgDark}` : undefined }}
          >
            <div style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", fontFamily: C.sans }}>
              {s.val}<span style={{ color: C.accent }}>{s.suffix}</span>
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, marginTop: 12, textTransform: "uppercase", lineHeight: 1.6 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* SERVICES — numbered accordion list */}
      <section id="services" style={{ borderBottom: `2px solid ${C.bgDark}` }}>
        <div style={{ padding: "80px 64px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${C.bgDark}` }}>
          <div style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
            SERVICES
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase" }}>
            06 DISCIPLINES
          </div>
        </div>
        {SERVICES.map((s, i) => (
          <motion.div
            key={i}
            onHoverStart={() => setActiveService(i)}
            onHoverEnd={() => setActiveService(null)}
            style={{ borderBottom: `1.5px solid ${activeService === i ? C.bgDark : C.borderLight}`, cursor: "pointer", transition: "border-color 0.2s", overflow: "hidden" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "56px 1fr auto auto", gap: 32, alignItems: "center", padding: "28px 64px" }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: activeService === i ? C.accent : C.textMuted, fontWeight: 700, transition: "color 0.2s" }}>{s.num}</span>
              <span style={{ fontSize: "clamp(16px, 2vw, 24px)", fontWeight: 700, letterSpacing: "-0.5px" }}>{s.name}</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.tags.map(t => (
                  <span key={t} style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 2, padding: "3px 8px", border: `1px solid ${C.borderLight}`, color: C.textMuted, textTransform: "uppercase" }}>{t}</span>
                ))}
              </div>
              <motion.span
                animate={{ rotate: activeService === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 28, fontWeight: 300, color: activeService === i ? C.accent : C.text, minWidth: 32, textAlign: "right" }}
              >
                +
              </motion.span>
            </div>
            <AnimatePresence>
              {activeService === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 32, padding: "0 64px 32px", alignItems: "start" }}>
                    <div />
                    <div style={{ fontFamily: C.mono, fontSize: 12, color: C.textMuted, lineHeight: 1.85, maxWidth: 640 }}>{s.desc}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.price}</div>
                      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>{s.deliverable}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>

      {/* CASE STUDIES */}
      <section ref={casesRef} id="travaux" style={{ borderBottom: `2px solid ${C.bgDark}` }}>
        <div style={{ padding: "80px 64px 0", borderBottom: `2px solid ${C.bgDark}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-2px" }}>NOS TRAVAUX</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase" }}>→ 5 cas récents</div>
          </div>
        </div>

        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "360px 1fr" }}>
          {/* Left: case list */}
          <div style={{ borderRight: `2px solid ${C.bgDark}` }}>
            {CASES.map((c, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveCase(i)}
                initial={{ opacity: 0, x: -20 }}
                animate={casesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: "28px 44px",
                  borderBottom: i < CASES.length - 1 ? `1px solid ${C.borderLight}` : undefined,
                  cursor: "pointer",
                  background: activeCase === i ? C.bgDark : "transparent",
                  borderLeft: activeCase === i ? `4px solid ${c.color}` : "4px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: activeCase === i ? C.white : C.text }}>{c.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: activeCase === i ? "rgba(245,245,240,0.5)" : C.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>{c.type}</div>
              </motion.div>
            ))}
          </div>

          {/* Right: case detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "64px 80px", background: CASES[activeCase].color, minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: CASES[activeCase].textColor === C.text ? C.textMuted : "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 16 }}>
                  {CASES[activeCase].year} — {CASES[activeCase].type}
                </div>
                <div style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 24, color: CASES[activeCase].textColor }}>
                  {CASES[activeCase].name}
                </div>
                <div style={{ width: 60, height: 3, background: CASES[activeCase].textColor, marginBottom: 32 }} />
                <p style={{ fontFamily: C.mono, fontSize: 13, color: CASES[activeCase].textColor, opacity: 0.7, lineHeight: 1.8, maxWidth: 540, marginBottom: 36 }}>
                  {CASES[activeCase].desc}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 700, color: CASES[activeCase].textColor }}>
                  Résultat : {CASES[activeCase].result}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: "14px 28px", background: "transparent",
                    color: CASES[activeCase].textColor, border: `2px solid ${CASES[activeCase].textColor}`,
                    fontFamily: C.mono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  Voir le cas <ArrowUpRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* MANIFESTE */}
      <section id="manifeste" style={{ background: C.bgDark, borderBottom: `2px solid ${C.borderLight}`, padding: "80px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 5, color: "rgba(245,245,240,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Notre manifeste</div>
              <div style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: C.white, letterSpacing: "-1px", lineHeight: 1.1 }}>
                CE EN<br />QUOI<br />ON CROIT
              </div>
              <div style={{ width: 40, height: 4, background: C.accent, marginTop: 24 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {MANIFESTE.map((line, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ x: 12, color: C.accent }}
                    style={{ padding: "24px 0", borderBottom: `1px solid rgba(245,245,240,0.08)`, fontFamily: C.mono, fontSize: "clamp(13px, 1.5vw, 16px)", color: "rgba(245,245,240,0.65)", lineHeight: 1.6, cursor: "default", transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 20 }}
                  >
                    <span style={{ color: C.accent, fontWeight: 700, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                    {line}
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ borderBottom: `2px solid ${C.bgDark}`, padding: "80px 64px", background: C.bg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, borderBottom: `2px solid ${C.bgDark}`, paddingBottom: 12 }}>
          <Reveal>
            <div style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px" }}>ILS TÉMOIGNENT</div>
          </Reveal>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase" }}>04 avis vérifiés</div>
        </div>
        <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ borderColor: C.accent, y: -3 }}
                style={{ padding: "40px 40px", border: `2px solid ${C.borderLight}`, background: C.white, transition: "all 0.2s" }}
              >
                <div style={{ fontSize: 40, color: C.accent, fontWeight: 900, lineHeight: 1, marginBottom: 20, fontFamily: C.sans }}>
                  "
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 28, color: "#333", fontFamily: C.sans }}>{t.quote}</p>
                <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 2, color: C.textMuted, textTransform: "uppercase" }}>
                  — {t.name}, {t.role}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section ref={teamRef} style={{ borderBottom: `2px solid ${C.bgDark}`, background: C.bg }}>
        <div style={{ padding: "80px 64px 40px", borderBottom: `2px solid ${C.bgDark}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-2px" }}>L'ÉQUIPE</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase" }}>PARIS · 4 PERMANENTS</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `2px solid ${C.bgDark}` }}>
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -6 }}
              style={{ borderRight: i < 3 ? `2px solid ${C.bgDark}` : undefined, transition: "transform 0.25s" }}
            >
              <div style={{ height: 200, background: member.bg, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `2px solid ${C.bgDark}` }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: member.fg, fontFamily: C.sans, opacity: 0.9 }}>{member.initials}</span>
              </div>
              <div style={{ padding: "28px 28px 32px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase", marginBottom: 20 }}>{member.role}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted, fontStyle: "italic", lineHeight: 1.6 }}>"{member.quote}"</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} id="tarifs" style={{ borderBottom: `2px solid ${C.bgDark}`, background: C.bg }}>
        <div style={{ padding: "80px 64px 60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${C.bgDark}` }}>
          <div style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-2px" }}>PRICING</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase" }}>TRANSPARENT · FIXE · SANS SURPRISE</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: `2px solid ${C.bgDark}` }}>
          {PLANS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{
                borderRight: i < 2 ? `2px solid ${C.bgDark}` : undefined,
                background: p.highlight ? C.accent : "transparent",
                padding: "64px 52px",
                position: "relative",
              }}
            >
              {p.highlight && (
                <div style={{ position: "absolute", top: -2, left: 0, right: 0, height: 4, background: C.bgDark }} />
              )}
              <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 5, color: p.highlight ? C.text : C.textMuted, marginBottom: 24, textTransform: "uppercase", fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1, marginBottom: 8 }}>{p.price}</div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: p.highlight ? C.textMuted : C.textMuted, marginBottom: 48, letterSpacing: 1 }}>{p.note}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontFamily: C.mono, fontSize: 11, color: p.highlight ? C.text : C.textMuted, lineHeight: 1.5 }}>
                    <span style={{ color: p.highlight ? C.bgDark : C.accent, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>→</span>
                    {f}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ background: p.highlight ? C.bgDark : C.accent, color: p.highlight ? C.white : C.text }}
                whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "18px", background: p.highlight ? C.bgDark : C.bgDark, color: C.white, border: "none", fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}
              >
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderBottom: `2px solid ${C.bgDark}`, background: C.bg }}>
        <div style={{ padding: "80px 64px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: "-2px" }}>FAQ</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase" }}>{FAQS.length} QUESTIONS</div>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderTop: `1.5px solid ${C.borderLight}`, borderBottom: i === FAQS.length - 1 ? `1.5px solid ${C.borderLight}` : undefined }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 64px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, flex: 1, color: C.text, fontFamily: C.sans }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                style={{ fontSize: 26, color: C.accent, fontWeight: 300, minWidth: 26 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div style={{ padding: "0 64px 28px", fontFamily: C.mono, fontSize: 12, color: C.textMuted, lineHeight: 1.85, maxWidth: 720 }}>{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA CONTACT */}
      <section className="imx-mobstack" id="contact" style={{ borderBottom: `2px solid ${C.bgDark}`, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ borderRight: `2px solid ${C.bgDark}`, padding: "80px 64px" }}>
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.accent, marginBottom: 24, textTransform: "uppercase" }}>
            → On prend 5 nouveaux clients par trimestre
          </div>
          <div style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 40 }}>
            Votre prochain<br />projet mérite<br />mieux.
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.textMuted, lineHeight: 1.8 }}>
            Pas de pitch. Pas de slides génériques.<br />Un call honnête de 30 min sur votre situation.
          </div>
        </div>
        <div style={{ padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
          {["Votre email", "Budget approximatif", "Votre besoin en quelques mots"].map((ph, i) =>
            i < 2 ? (
              <input key={i} placeholder={ph}
                style={{ width: "100%", padding: "18px 24px", background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.text, fontFamily: C.mono, fontSize: 12, letterSpacing: 1, outline: "none" }} />
            ) : (
              <textarea key={i} placeholder={ph} rows={3}
                style={{ width: "100%", padding: "18px 24px", background: "transparent", border: `1.5px solid ${C.borderLight}`, color: C.text, fontFamily: C.mono, fontSize: 12, letterSpacing: 1, outline: "none", resize: "none" }} />
            )
          )}
          <motion.button
            whileHover={{ background: C.accent, color: C.text, borderColor: C.accent }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: "20px", background: C.bgDark, color: C.white, border: `2px solid ${C.bgDark}`, fontWeight: 900, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}
          >
            Envoyer →
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: `1px solid ${C.borderLight}` }}>
        <div style={{ padding: "48px 44px", borderRight: `1px solid ${C.borderLight}` }}>
          <div style={{ fontFamily: C.mono, fontSize: 14, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>BUREAU</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, lineHeight: 1.8, letterSpacing: 1 }}>
            Agence créative indépendante.<br />Paris 11e, France.<br />{fd?.email ?? "hello@bureau.co"}</div>
        </div>
        {[
          { title: "Services", links: ["Branding", "Web & Dev", "Campagnes", "Direction Art", "UX Design"] },
          { title: "Agence", links: ["À propos", "Travaux", "Manifeste", "Carrières", "Blog"] },
          { title: "Contact", links: ["Réserver un call", "hello@bureau.co", "+33 1 23 45 67 89", "Paris 75011"] },
        ].map((col, i) => (
          <div key={i} style={{ padding: "48px 44px", borderRight: i < 2 ? `1px solid ${C.borderLight}` : undefined }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 4, color: C.accent, marginBottom: 20, textTransform: "uppercase", fontWeight: 700 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <span key={l} style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>{l}</span>
              ))}
            </div>
          </div>
        ))}
      </footer>
      <div style={{ padding: "20px 44px", display: "flex", justifyContent: "space-between", background: C.bg }}>
        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.borderLight, letterSpacing: 2, textTransform: "uppercase" }}>© 2026 Bureau — Tous droits réservés</span>
        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.borderLight, letterSpacing: 2, textTransform: "uppercase" }}>Mentions légales · Confidentialité</span>
      </div>
    </div>
  );
}
