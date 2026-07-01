// @ts-nocheck
"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  Film,
  Award,
  Camera,
  Layers,
  MessageSquare,
  Link2,
  Users2,
  Mail,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

/* ─── COLOUR PALETTE ─────────────────────────────────────────── */
const C = {
  bg: "#0E0C07",
  bgCard: "#17140D",
  bgDeep: "#0A0804",
  text: "#F0EAD8",
  muted: "#7A6E58",
  amber: "#C8961E",
  amberLight: "#E4B840",
  amberSoft: "rgba(200,150,30,0.10)",
  amberGlow: "rgba(200,150,30,0.20)",
  border: "rgba(200,150,30,0.14)",
  borderMid: "rgba(200,150,30,0.28)",
  white: "#FFFFFF",
  grain:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
};

/* ─── GOOGLE FONT ─────────────────────────────────────────────── */
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

/* ─── DATA ────────────────────────────────────────────────────── */
const NAV_LINKS = ["Studio", "Productions", "Services", "Clients", "Contact"];

const PROJECTS = [
  {
    id: 1,
    year: "2025",
    cat: "Publicité",
    client: "Cartier",
    title: "Lumière Perpétuelle",
    format: "Spot 90s — Cannes Lions Or",
    desc: "Une ode au temps en images. Plan séquence unique, lumière naturelle, silence habité.",
    accent: "#C8961E",
  },
  {
    id: 2,
    year: "2024",
    cat: "Fiction",
    client: "Arte France",
    title: "Les Heures Grises",
    format: "Long-métrage 100min — Festival Berlin",
    desc: "Drame intime sur les espaces interstitiels de Paris. Tournage sur pellicule 16mm.",
    accent: "#8FA89C",
  },
  {
    id: 3,
    year: "2024",
    cat: "Documentaire",
    client: "France Télévisions",
    title: "Mineurs de Nuit",
    format: "Série 4×52min — Prix Scam",
    desc: "Portrait documentaire d'une génération invisible. Immersion sur dix-huit mois.",
    accent: "#A87C45",
  },
  {
    id: 4,
    year: "2023",
    cat: "Publicité",
    client: "Hermès",
    title: "Le Geste Juste",
    format: "Film institutionnel 3min — Grand Prix ADC",
    desc: "Hommage aux maîtres artisans de la maison. Macro photographie et sons d'atelier.",
    accent: "#C8961E",
  },
  {
    id: 5,
    year: "2023",
    cat: "Fiction",
    client: "Canal+",
    title: "Nocturne",
    format: "Court-métrage 24min — César 2023",
    desc: "Une nuit à Belleville vue par trois personnages. Caméra portée, lumière ambiante.",
    accent: "#7A8CA0",
  },
  {
    id: 6,
    year: "2022",
    cat: "Documentaire",
    client: "National Geographic",
    title: "Forêts Primaires",
    format: "Doc 90min — Sundance 2023",
    desc: "Expédition de six semaines dans les forêts tempérées européennes. 4K HDR.",
    accent: "#5E8C6A",
  },
];

const SERVICES = [
  {
    icon: Film,
    title: "Fiction & Série",
    sub: "Court, long-métrage, série",
    desc: "Du développement au DCP, nous accompagnons les projets de fiction avec une direction artistique au service de la voix d'auteur. Partenaires : Arte, Canal+, Netflix France, RAI.",
    items: ["Développement éditorial", "Coproduction & financement", "Direction artistique", "Montage & post-production complète"],
  },
  {
    icon: Camera,
    title: "Publicité & Marque",
    sub: "TV, digital, institutionnel",
    desc: "Chaque campagne est traitée comme un objet cinématographique. Notre approche narrative transforme les valeurs de marque en émotions mémorables. Budget de 20K€ à 2M€.",
    items: ["Conception créative", "Tournage multi-lieux", "VFX & motion design", "Déclinaisons tous formats"],
  },
  {
    icon: Layers,
    title: "Documentaire",
    sub: "Cinéma, TV, plateformes",
    desc: "Une équipe dédiée aux projets documentaires de long court et de série. Nous maîtrisons les mécaniques de financement Procirep, Angoa, CNC et les coproductions européennes.",
    items: ["Recherche & écriture", "Immersion terrain", "Montage son Dolby Atmos", "Diffusion & festivals"],
  },
  {
    icon: Award,
    title: "Post-Production",
    sub: "Étalonnage, son, VFX",
    desc: "Studio intégré à Paris 11e : étalonnage 4K HDR Dolby Vision, mixage Atmos 7.1.4, VFX Unreal Engine, sous-titrage 28 langues. Prestation externe acceptée.",
    items: ["Étalonnage DCI 4K", "Mixage Dolby Atmos", "VFX Unreal Engine", "Localisation 28 langues"],
  },
];

const STATS = [
  { val: "2009", label: "Fondé à Paris" },
  { val: "280+", label: "Productions livrées" },
  { val: "22", label: "Festivals internationaux" },
  { val: "94%", label: "Clients fidèles" },
];

const TESTIMONIALS = [
  {
    q: "Urban Pulse a capturé quelque chose que nous ne savions pas mettre en mots. 'Le Geste Juste' est désormais notre film de référence interne — une lecture cinématographique de notre ADN de maison.",
    name: "Isabelle Fontaine",
    role: "Directrice de la Création",
    co: "Hermès International",
    init: "IF",
    stars: 5,
  },
  {
    q: "L'équipe a su transformer un sujet difficile — la précarité invisible — en une série documentaire qui a touché des millions de téléspectateurs. Rigueur éditoriale et humanité à toutes les étapes.",
    name: "Marc Delacroix",
    role: "Directeur des Documentaires",
    co: "France Télévisions",
    init: "MD",
    stars: 5,
  },
  {
    q: "Notre court-métrage avec Urban Pulse a ouvert plus de portes en six mois que nos trois années précédentes. La post-production est à un niveau cinema que peu de studios en France peuvent offrir.",
    name: "Chloé Martineau",
    role: "Productrice Exécutive",
    co: "Les Films du Losange",
    init: "CM",
    stars: 5,
  },
  {
    q: "Nous les avons mandatés sur une campagne globale avec un délai serré. Résultat : Grand Prix ADC, 40M de vues organiques en 72h. C'est la définition d'un studio à la hauteur de nos ambitions.",
    name: "Antoine Roux",
    role: "VP Marketing Global",
    co: "Cartier",
    init: "AR",
    stars: 5,
  },
];

const PRICING = [
  {
    name: "Contenu Digital",
    price: "à partir de 15 000€",
    desc: "Spot 30 à 90 secondes, motion design, livraison tous formats",
    features: [
      "Direction artistique dédiée",
      "1 à 2 jours de tournage",
      "Motion design & habillage",
      "Étalonnage cinéma",
      "Livraison 4K + formats réseaux",
      "3 rounds de corrections",
    ],
    cta: "Demander un devis",
    hot: false,
  },
  {
    name: "Production Long Format",
    price: "Sur devis",
    desc: "Long-métrage, court, série — du développement à la livraison DCP",
    features: [
      "Développement éditorial complet",
      "Coproduction & financement CNC",
      "Équipe artistique de direction",
      "Tournage multi-jours & multi-lieux",
      "Post-production intégrale",
      "DCP cinéma + masters broadcast",
      "Accompagnement festivals",
    ],
    cta: "Parlons de votre projet",
    hot: true,
  },
  {
    name: "Partenariat Studio",
    price: "Sur devis",
    desc: "Retainer annuel — disponibilité prioritaire & tarif préférentiel",
    features: [
      "Volume annuel défini ensemble",
      "Réalisateur dédié à la marque",
      "Disponibilité prioritaire 48h",
      "Accès studio post-production",
      "Veille créative mensuelle",
      "Rapport de performance trimestriel",
    ],
    cta: "Contacter notre équipe",
    hot: false,
  },
];

const FAQS = [
  {
    q: "Quel est le délai moyen d'un spot publicitaire ?",
    a: "Pour un spot 30–90 secondes : 6 à 10 semaines de la signature à la livraison master. Pré-production 2 semaines, tournage 1 à 3 jours, post-production 3 à 5 semaines. Les productions avec VFX complexes s'étendent sur 12 à 16 semaines. Nous fournissons un rétroplanning détaillé avant tout démarrage.",
  },
  {
    q: "Travaillez-vous en coproduction internationale ?",
    a: "La coproduction internationale est au cœur de notre activité. Nous avons des accords-cadres actifs avec des producteurs en Belgique, Allemagne, Italie, Suède et Canada. Nous maîtrisons les mécaniques Eurimages, Creative Europe et les treaty co-productions bilatéraux.",
  },
  {
    q: "Les droits musicaux sont-ils inclus dans le devis ?",
    a: "Deux options : composition originale par nos compositeurs partenaires (inclus sur les packs Partenariat), ou acquisition de licences synchronisation + master sur musique existante (budgétisée séparément, avec alternatives). Aucune mauvaise surprise sur les droits.",
  },
  {
    q: "Proposez-vous le sous-titrage et la version française ?",
    a: "Notre département localisation gère sous-titrage en 28 langues, VF, VOST et audiodescription. Nous travaillons avec des traducteurs spécialisés dans le registre cinématographique pour préserver la qualité narrative dans chaque langue.",
  },
  {
    q: "Comment démarrer un projet avec Urban Pulse ?",
    a: "Envoyez-nous une description de votre projet — même ébauche. Notre directrice commerciale répond sous 48h ouvrées pour organiser un échange de 30 à 45 minutes. Si l'alignement créatif est là, nous préparons une note d'intention et un budget indicatif en une semaine, gratuitement.",
  },
];

/* ─── FILM STRIP SVG — Signature Element ─────────────────────── */
function FilmStripSVG({ count = 8 }: { count?: number }) {
  return (
    <svg
      width="100%"
      height="64"
      viewBox={`0 0 ${count * 72} 64`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Top sprocket holes */}
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={`t${i}`}
          x={i * 72 + 10}
          y={4}
          width={16}
          height={10}
          rx={2}
          fill="rgba(200,150,30,0.18)"
          stroke="rgba(200,150,30,0.35)"
          strokeWidth={0.8}
        />
      ))}
      {/* Bottom sprocket holes */}
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={`b${i}`}
          x={i * 72 + 10}
          y={50}
          width={16}
          height={10}
          rx={2}
          fill="rgba(200,150,30,0.18)"
          stroke="rgba(200,150,30,0.35)"
          strokeWidth={0.8}
        />
      ))}
      {/* Frame dividers */}
      {Array.from({ length: count - 1 }).map((_, i) => (
        <line
          key={`d${i}`}
          x1={(i + 1) * 72}
          y1={0}
          x2={(i + 1) * 72}
          y2={64}
          stroke="rgba(200,150,30,0.20)"
          strokeWidth={0.8}
        />
      ))}
      {/* Outer border */}
      <rect
        x={0.5}
        y={0.5}
        width={count * 72 - 1}
        height={63}
        rx={3}
        stroke="rgba(200,150,30,0.25)"
        strokeWidth={1}
      />
    </svg>
  );
}

/* ─── ANIMATED FILM COUNTER — Hero Signature ─────────────────── */
function FilmCounter() {
  const [frame, setFrame] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f >= 24 ? 1 : f + 1)), 120);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        right: 48,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.7rem",
        color: C.amberLight,
        opacity: 0.7,
        letterSpacing: "0.1em",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
        userSelect: "none",
        zIndex: 10,
      }}
    >
      <span>FRAME {String(frame).padStart(2, "0")}/24</span>
      <span>24.000 FPS</span>
      <span style={{ color: C.amber }}>● REC</span>
    </div>
  );
}

/* ─── STAT COUNTER ───────────────────────────────────────────── */
function StatItem({ val, label }: { val: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center", padding: "0 24px" }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(2.2rem, 4vw, 3rem)",
          fontWeight: 700,
          color: C.amber,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {val}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          color: C.muted,
          marginTop: 8,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function UrbanPulsePage() {
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

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const stripX = useTransform(scrollYProgress, [0, 0.3], ["0%", "-4%"]);

  const [activeProject, setActiveProject] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [activeTesti, setActiveTesti] = useState(0);
  const [testiDir, setTestiDir] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function nextTesti() {
    setTestiDir(1);
    setActiveTesti((i) => (i + 1) % TESTIMONIALS.length);
  }
  function prevTesti() {
    setTestiDir(-1);
    setActiveTesti((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  
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
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: FONT_DISPLAY,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── 1. NAVBAR ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 5vw, 64px)",
          height: 72,
          background: "rgba(14,12,7,0.94)",
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo */}
        <Link href="#hero" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Film gate icon */}
            <div
              style={{
                width: 38,
                height: 38,
                background: C.amberSoft,
                border: `1.5px solid ${C.borderMid}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 3,
                    background: i === 1 ? C.amber : "rgba(200,150,30,0.35)",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: C.text,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >{fd?.businessName ?? "Urban Pulse"}</div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: C.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Studio Cinéma · Paris
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href="#n"
              style={{
                color: C.muted,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                transition: "color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {l}
            </a>
          ))}
          <motion.button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              border: `1px solid ${C.amber}`,
              color: C.amber,
              padding: "9px 22px",
              borderRadius: 3,
              fontWeight: 600,
              fontSize: "0.8rem",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = C.amberSoft)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            Votre Projet
          </motion.button>
          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              display: "none",
            }}
          >
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: C.bgDeep,
              display: "flex",
              flexDirection: "column",
              padding: "80px 48px",
              gap: 32,
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 32,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.muted,
              }}
            >
              <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 6l16 16M22 6L6 22"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l}
                href="#n"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: C.muted,
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.amber)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. HERO ───────────────────────────────────────────────── */}
      <section id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
          paddingTop: 72,
          background: C.bgDeep,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage: C.grain,
            backgroundSize: "180px 180px",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Amber glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 600,
            height: 600,
            background: C.amberGlow,
            borderRadius: "50%",
            filter: "blur(140px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Film counter — signature element */}
        <FilmCounter />

        {/* Vertical side labels */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center",
            fontSize: "0.6rem",
            color: C.muted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            zIndex: 5,
            whiteSpace: "nowrap",
          }}
        >
          Urban Pulse Studio · Fondé 2009 · Paris, France
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 5 }}
        >
          {/* Hero text block */}
          <div
            style={{
              padding: "0 clamp(48px, 8vw, 120px)",
              paddingBottom: 80,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 1,
                  background: C.amber,
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: C.amber,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Studio de Production Cinéma · Publicité · Documentaire
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(3.8rem, 9vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: C.text,
                marginBottom: 32,
              }}
            >{c?.heroHeadline ?? <>
              Faire exister
              <br />
              <span
                style={{
                  color: C.amber,
                  WebkitTextStroke: "0px",
                }}
              >
                l'image
              </span>
              <span style={{ color: "rgba(240,234,216,0.18)" }}>.</span>
            </>}</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              style={{
                fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                color: C.muted,
                maxWidth: 480,
                lineHeight: 1.75,
                marginBottom: 44,
                fontWeight: 400,
              }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Maison de production parisienne. Fiction, documentaire, publicité de prestige.
              Nous fabriquons des images qui traversent le temps.
            </>}</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <motion.button onClick={() => document.getElementById("productions")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${C.amberGlow}` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.amber,
                  color: C.bgDeep,
                  padding: "14px 30px",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <Play size={15} />
                Voir les productions
              </motion.button>
              <motion.button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid rgba(240,234,216,0.2)`,
                  color: C.text,
                  padding: "14px 30px",
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = C.border)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(240,234,216,0.2)")
                }
              >
                Votre projet
                <ArrowRight size={15} />
              </motion.button>
            </motion.div>
          </div>

          {/* Film strip — signature element */}
          <motion.div
            style={{ x: stripX }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <FilmStripSVG count={12} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. STATS BAR ─────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgCard,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "64px 48px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {STATS.map((s) => (
            <StatItem key={s.label} val={s.val} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── 4. PRODUCTIONS — Horizontal scroll archive ────────────── */}
      <section
        id="productions"
        style={{
          padding: "100px 0 80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
            marginBottom: 48,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Archives — 2022 / 2025
            </div>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >{c?.aboutTitle ?? fd?.businessName ?? <>
              Productions récentes
            </>}</h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: C.muted,
                maxWidth: 480,
                lineHeight: 1.7,
              }}
            >{c?.aboutText ?? <>
              Fiction, documentaire, publicité de prestige. Chaque projet est unique dans
              sa forme et son ambition.
            </>}</p>
          </motion.div>
        </div>

        {/* Horizontal scroll project list */}
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            padding: "0 clamp(24px, 5vw, 64px) 24px",
            scrollSnapType: "x mandatory",
            display: "flex",
            gap: 20,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              onClick={() => setActiveProject(i)}
              style={{
                flex: "0 0 340px",
                scrollSnapAlign: "start",
                background: C.bgCard,
                border: `1px solid ${activeProject === i ? C.borderMid : C.border}`,
                borderRadius: 4,
                padding: "36px 32px",
                cursor: "pointer",
                transition: "border-color 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent line top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: p.accent,
                  opacity: activeProject === i ? 1 : 0.3,
                  transition: "opacity 0.3s",
                }}
              />

              {/* Film perforation row */}
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  marginBottom: 24,
                }}
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 13,
                      height: 9,
                      borderRadius: 2,
                      background: "rgba(240,234,216,0.07)",
                      border: "1px solid rgba(240,234,216,0.06)",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: C.amber,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderBottom: `1px solid ${C.amber}`,
                    paddingBottom: 3,
                  }}
                >
                  {p.cat}
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: C.muted,
                  }}
                >
                  {p.year}
                </span>
              </div>

              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginBottom: 8,
                  letterSpacing: "0.04em",
                }}
              >
                {p.client}
              </div>

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {p.title}
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  color: C.amber,
                  opacity: 0.75,
                  marginBottom: 16,
                }}
              >
                {p.format}
              </div>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: C.muted,
                  lineHeight: 1.65,
                }}
              >
                {p.desc}
              </p>

              {/* Bottom perforations */}
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  marginTop: 24,
                }}
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 13,
                      height: 9,
                      borderRadius: 2,
                      background: "rgba(240,234,216,0.07)",
                      border: "1px solid rgba(240,234,216,0.06)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. SERVICES / TABS ───────────────────────────────────── */}
      <section
        style={{
          background: C.bgCard,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "100px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 56 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Notre savoir-faire
            </div>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Quatre disciplines,<br />une seule exigence
            </h2>
          </motion.div>

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: `1px solid rgba(240,234,216,0.08)`,
              marginBottom: 52,
              flexWrap: "wrap",
            }}
          >
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActiveService(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "14px 28px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: FONT_DISPLAY,
                  color: activeService === i ? C.amber : C.muted,
                  borderBottom:
                    activeService === i
                      ? `2px solid ${C.amber}`
                      : "2px solid transparent",
                  marginBottom: -1,
                  transition: "all 0.25s",
                  whiteSpace: "nowrap",
                }}
              >
                {s.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 52,
                    height: 52,
                    background: C.amberSoft,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    marginBottom: 24,
                    color: C.amber,
                  }}
                >
                  {(() => {
                    const Icon = SERVICES[activeService].icon;
                    return <Icon size={22} />;
                  })()}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: C.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {SERVICES[activeService].sub}
                </div>
                <h3
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    marginBottom: 20,
                  }}
                >
                  {SERVICES[activeService].title}
                </h3>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: C.muted,
                    lineHeight: 1.8,
                  }}
                >
                  {SERVICES[activeService].desc}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  borderLeft: `1px solid rgba(240,234,216,0.07)`,
                  paddingLeft: 48,
                }}
              >
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: C.muted,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  Ce que nous livrons
                </div>
                {SERVICES[activeService].items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    style={{
                      padding: "18px 0",
                      borderBottom: `1px solid rgba(240,234,216,0.06)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.amber,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: C.text,
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}

                <motion.button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                  whileHover={{ scale: 1.02, color: C.amber }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 28,
                    color: C.text,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                >
                  En savoir plus
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 6. CLIENT LOGOS MARQUEE ─────────────────────────────── */}
      <section
        style={{
          padding: "72px 0",
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "0.65rem",
            color: C.muted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Ils nous font confiance
        </div>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
        >
          {[
            "Arte France",
            "Canal+",
            "Netflix France",
            "National Geographic",
            "Hermès",
            "Cartier",
            "Louis Vuitton",
            "France Télévisions",
            "RAI Fiction",
            "BBC Two",
            "Arte France",
            "Canal+",
            "Netflix France",
            "National Geographic",
            "Hermès",
            "Cartier",
            "Louis Vuitton",
            "France Télévisions",
            "RAI Fiction",
            "BBC Two",
          ].map((client, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 48,
                padding: "0 48px",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "rgba(240,234,216,0.25)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {client}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: C.amber,
                  opacity: 0.4,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────── */}
      <section
        style={{
          background: C.bgCard,
          borderBottom: `1px solid ${C.border}`,
          padding: "100px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Ce qu'ils disent
            </div>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Des collaborations<br />qui comptent
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Main testimonial */}
            <div style={{ position: "relative" }}>
              <AnimatePresence mode="wait" custom={testiDir}>
                <motion.div
                  key={activeTesti}
                  custom={testiDir}
                  initial={{ opacity: 0, x: testiDir * 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: testiDir * -36 }}
                  transition={{ duration: 0.45 }}
                >
                  <div
                    style={{
                      fontSize: "5rem",
                      color: C.amber,
                      opacity: 0.25,
                      lineHeight: 0.8,
                      marginBottom: 20,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    "
                  </div>
                  <blockquote
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                      lineHeight: 1.7,
                      color: C.text,
                      fontWeight: 400,
                      marginBottom: 36,
                    }}
                  >
                    {TESTIMONIALS[activeTesti].q}
                  </blockquote>

                  {/* Stars */}
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 16,
                    }}
                  >
                    {Array.from({ length: TESTIMONIALS[activeTesti].stars }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={C.amber}
                          color={C.amber}
                        />
                      )
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: C.amberSoft,
                        border: `1px solid ${C.borderMid}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: C.amber,
                        flexShrink: 0,
                      }}
                    >
                      {TESTIMONIALS[activeTesti].init}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: C.text,
                        }}
                      >
                        {TESTIMONIALS[activeTesti].name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.77rem",
                          color: C.muted,
                          marginTop: 2,
                        }}
                      >
                        {TESTIMONIALS[activeTesti].role} — {TESTIMONIALS[activeTesti].co}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 40,
                }}
              >
                <button
                  onClick={prevTesti}
                  style={{
                    background: "none",
                    border: `1px solid rgba(240,234,216,0.12)`,
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: C.muted,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.amber)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(240,234,216,0.12)")
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setTestiDir(i > activeTesti ? 1 : -1);
                        setActiveTesti(i);
                      }}
                      style={{
                        width: i === activeTesti ? 28 : 8,
                        height: 8,
                        borderRadius: 100,
                        background:
                          i === activeTesti ? C.amber : "rgba(240,234,216,0.15)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTesti}
                  style={{
                    background: "none",
                    border: `1px solid rgba(240,234,216,0.12)`,
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: C.muted,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.amber)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(240,234,216,0.12)")
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Side client list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: C.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Clients réguliers
              </div>
              {[
                "Arte France",
                "Canal+",
                "Netflix France",
                "National Geographic",
                "Hermès",
                "Cartier",
              ].map((client) => (
                <div
                  key={client}
                  style={{
                    padding: "12px 16px",
                    border: `1px solid rgba(240,234,216,0.06)`,
                    borderRadius: 4,
                    fontSize: "0.85rem",
                    color: C.muted,
                    fontWeight: 500,
                  }}
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. PRICING ──────────────────────────────────────────── */}
      <section style={{ padding: "100px 0", background: C.bg }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 56 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Nos formules
            </div>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Chaque projet mérite<br />son propre cadre
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              alignItems: "start",
            }}
          >
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -4 }}
                style={{
                  background: plan.hot ? C.amberSoft : C.bgCard,
                  border: plan.hot
                    ? `1px solid ${C.borderMid}`
                    : `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "36px 32px",
                  position: "relative",
                  transform: plan.hot ? "scale(1.02)" : "scale(1)",
                }}
              >
                {plan.hot && (
                  <div
                    style={{
                      position: "absolute",
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.amber,
                      color: C.bgDeep,
                      padding: "4px 18px",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      borderRadius: 2,
                    }}
                  >
                    Notre cœur de métier
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: plan.hot ? C.amber : C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {plan.price}
                </div>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: C.muted,
                    marginBottom: 28,
                    lineHeight: 1.6,
                  }}
                >
                  {plan.desc}
                </p>

                <div
                  style={{
                    borderTop: `1px solid rgba(240,234,216,0.07)`,
                    paddingTop: 24,
                    marginBottom: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {plan.features.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: C.amber,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.83rem",
                          color: C.text,
                          lineHeight: 1.5,
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 3,
                    border: plan.hot ? "none" : `1px solid rgba(240,234,216,0.12)`,
                    background: plan.hot ? C.amber : "transparent",
                    color: plan.hot ? C.bgDeep : C.text,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontFamily: FONT_DISPLAY,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgCard,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "100px 0",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 56 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Questions fréquentes
            </div>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Ce que nos clients<br />nous demandent
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                style={{
                  borderBottom: `1px solid rgba(240,234,216,0.07)`,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 20,
                    fontFamily: FONT_DISPLAY,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: openFaq === i ? C.text : "rgba(240,234,216,0.8)",
                      lineHeight: 1.4,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0 }}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke={openFaq === i ? C.amber : C.muted}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          paddingBottom: 24,
                          color: C.muted,
                          fontSize: "0.9rem",
                          lineHeight: 1.8,
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA CONTACT ────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          background: C.bgDeep,
          position: "relative",
          overflow: "hidden",
          padding: "120px 0",
        }}
      >
        {/* Amber glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background: C.amberGlow,
            borderRadius: "50%",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        {/* Grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: C.grain,
            backgroundSize: "180px 180px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px)",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.amber,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Prenons contact
            </div>

            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginBottom: 24,
                color: C.text,
              }}
            >
              Parlons de<br />
              <span style={{ color: C.amber }}>votre projet</span>
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: 52,
                maxWidth: 460,
                margin: "0 auto 52px",
              }}
            >
              Fiction, documentaire ou campagne de marque — partagez-nous votre
              intention. Notre directrice commerciale répond sous 48h ouvrées.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <motion.a
                href={`mailto:${fd?.email ?? "contact@urbanpulse.fr"}`}
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 0 48px ${C.amberGlow}`,
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.amber,
                  color: C.bgDeep,
                  padding: "18px 40px",
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <Mail size={15} />
                Écrire à l'équipe
              </motion.a>
              <motion.button onClick={() => document.getElementById("productions")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  color: C.text,
                  border: `1px solid rgba(240,234,216,0.2)`,
                  padding: "18px 36px",
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s",
                }}
              >
                Voir les productions
              </motion.button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                marginTop: 52,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: MapPin, label: "12 rue Oberkampf, 75011 Paris" },
                { icon: Phone, label: "+33 1 48 XX XX XX" },
                { icon: Mail, label: "contact@urbanpulse.fr" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.78rem",
                    color: C.muted,
                  }}
                >
                  <Icon size={13} color={C.amber} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. FOOTER ──────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          padding: "64px clamp(24px, 5vw, 64px) 44px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 56,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: C.amberSoft,
                    border: `1.5px solid ${C.borderMid}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 16,
                        height: 2.5,
                        background:
                          i === 1 ? C.amber : "rgba(200,150,30,0.35)",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: C.text,
                    }}
                  >{fd?.businessName ?? "Urban Pulse"}</div>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      color: C.muted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Studio Cinéma · Paris
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.83rem",
                  color: C.muted,
                  lineHeight: 1.7,
                  maxWidth: 260,
                  marginBottom: 24,
                }}
              >
                Maison de production cinéma, publicité et contenu de marque.
                Paris, depuis 2009.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { Icon: Camera, href: "/templates/impact-96" },
                  { Icon: MessageSquare, href: "/templates/impact-96" },
                  { Icon: Link2, href: "/templates/impact-96" },
                  { Icon: Users2, href: "/templates/impact-96" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 3,
                      border: `1px solid rgba(240,234,216,0.08)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: C.muted,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.amber;
                      (e.currentTarget as HTMLElement).style.color = C.amber;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(240,234,216,0.08)";
                      (e.currentTarget as HTMLElement).style.color = C.muted;
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Disciplines",
                links: [
                  "Fiction & Série",
                  "Publicité & Marque",
                  "Documentaire",
                  "Post-Production",
                ],
              },
              {
                title: "Studio",
                links: [
                  "Notre histoire",
                  "L'équipe",
                  "Nos partenaires",
                  "Presse & prix",
                ],
              },
              {
                title: "Contact",
                links: [
                  "Votre projet",
                  "Casting",
                  "Stages & emploi",
                  "Coproduction",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: C.amber,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 18,
                  }}
                >
                  {col.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#n"
                      style={{
                        fontSize: "0.82rem",
                        color: C.muted,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.text)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = C.muted)
                      }
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `1px solid rgba(240,234,216,0.06)`,
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: "0.73rem", color: C.muted }}>
              © 2026 Urban Pulse SAS · 12 rue Oberkampf, 75011 Paris · SIRET 512 XXX XXX 00024
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "Mentions légales", href: "/templates/impact-96/legal/mentions-legales" },
                { label: "Confidentialité", href: "/templates/impact-96/legal/confidentialite" },
                { label: "CGV", href: "/templates/impact-96/legal/cgu" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: "0.73rem",
                    color: C.muted,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
