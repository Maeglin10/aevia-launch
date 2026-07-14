"use client";
// @ts-nocheck

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
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Link2,
  Camera,
  Users2,
  Layers,
  Pen,
  Zap,
  Globe,
  Target,
  TrendingUp,
  Eye,
  Palette,
} from "lucide-react";

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
  bg: "#0a0f0a",
  bgAlt: "#0d130d",
  bgCard: "#111711",
  bgPanel: "#0f140f",
  text: "#f0f4f0",
  textMuted: "#8a9e8a",
  textDim: "#4a5e4a",
  emerald: "#014421",
  emeraldMid: "#025e30",
  emeraldBright: "#03a355",
  emeraldGlow: "#05c96a",
  emeraldLight: "#e8f5ee",
  white: "#ffffff",
  border: "#1a2a1a",
  borderLight: "#2a3e2a",
  gold: "#b8994a",
};

const PROJECTS = [
  {
    id: "01",
    title: "Folio Maison",
    category: "Brand Identity",
    year: "2025",
    tags: ["Logotype", "Visual Identity", "Motion"],
    desc: "Rebranding complet d'une maison d'édition genevoise fondée en 1932. Nouveau système typographique, palette chromatique et guidelines motion pour le digital.",
    result: "+340% engagement brand",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1200&auto=format&fit=crop",
    color: C.emeraldBright,
  },
  {
    id: "02",
    title: "Altitude Collective",
    category: "Digital Experience",
    year: "2025",
    tags: ["Web Design", "3D", "Interaction"],
    desc: "Plateforme digitale pour un collectif d'artistes alpins. Navigation immersive avec rendu 3D en temps réel et système de galerie dynamique.",
    result: "Awwwards Site of the Day",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    color: C.gold,
  },
  {
    id: "03",
    title: "Helix Pharma",
    category: "Brand System",
    year: "2024",
    tags: ["Corporate ID", "Packaging", "Guidelines"],
    desc: "Identité institutionnelle pour une biotech lausannoise cotée en bourse. Du logo au rapport annuel, un système visuel cohérent et évolutif.",
    result: "Brand Value +2.4M CHF",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop",
    color: C.emeraldBright,
  },
  {
    id: "04",
    title: "Quartier Libre",
    category: "Campaign",
    year: "2024",
    tags: ["Art Direction", "Print", "OOH"],
    desc: "Campagne 360° pour le lancement d'un nouveau quartier résidentiel premium à Carouge. Direction artistique et production pour presse, affichage et digital.",
    result: "94% des unités vendues",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop",
    color: C.gold,
  },
  {
    id: "05",
    title: "Novae Cosmetics",
    category: "Packaging Design",
    year: "2024",
    tags: ["Packaging", "Luxury", "Retail"],
    desc: "Collection packaging premium pour une marque de cosmétiques suisse axée sur la durabilité. Matériaux recyclés, impression végétale, unboxing experience.",
    result: "Red Dot Award 2024",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop",
    color: C.emeraldBright,
  },
  {
    id: "06",
    title: "Swiss Rail Heritage",
    category: "Exhibition Design",
    year: "2023",
    tags: ["Spatial Design", "Type", "Archive"],
    desc: "Scénographie de l'exposition centenaire des CFF au Musée National. Typographie murale monumentale et système de navigation spatiale immersif.",
    result: "220,000 visiteurs",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
    color: C.gold,
  },
];

const SERVICES = [
  {
    icon: <Palette size={22} />,
    title: "Brand Identity",
    desc: "Logotype, système typographique, palette chromatique, guidelines complets. Une identité qui dure des décennies.",
    price: "Dès CHF 8'500",
    deliverables: ["Logotype + déclinaisons", "Charte graphique", "Brand book PDF", "Fichiers sources"],
  },
  {
    icon: <Globe size={22} />,
    title: "Digital Experience",
    desc: "Conception UX/UI pour sites web, applications et plateformes digitales. Du wireframe au pixel parfait.",
    price: "Dès CHF 12'000",
    deliverables: ["Audit UX existant", "Wireframes annotés", "UI Design Figma", "Prototype interactif"],
  },
  {
    icon: <Layers size={22} />,
    title: "Art Direction",
    desc: "Direction créative de campagnes, shootings, publications. Vision cohérente sur tous les supports.",
    price: "Dès CHF 4'500",
    deliverables: ["Moodboard créatif", "Direction shooting", "Supervision production", "Livrables calibrés"],
  },
  {
    icon: <Pen size={22} />,
    title: "Packaging Design",
    desc: "Conception packaging produit — du dessin technique aux fichiers d'impression. Matériaux durables en priorité.",
    price: "Dès CHF 5'500",
    deliverables: ["Étude matériaux", "Design 3D mockup", "Fichiers print-ready", "Suivi imprimeur"],
  },
  {
    icon: <Target size={22} />,
    title: "Strategic Branding",
    desc: "Audit de marque, positionnement, naming, storytelling. Avant de dessiner, on pense.",
    price: "Dès CHF 3'200",
    deliverables: ["Audit concurrentiel", "Ateliers positionnement", "Plateforme de marque", "Document stratégique"],
  },
  {
    icon: <Zap size={22} />,
    title: "Motion & Animation",
    desc: "Animation de logo, motion graphics, vidéos de marque. La marque en mouvement.",
    price: "Dès CHF 2'800",
    deliverables: ["Logo animé", "Transitions brand", "Social formats", "Export multi-formats"],
  },
];

const PROCESS = [
  {
    num: "01",
    title: "Brief & Découverte",
    desc: "Immersion dans votre univers. Atelier de deux heures, audit complet, définition des objectifs mesurables.",
    duration: "1 semaine",
  },
  {
    num: "02",
    title: "Exploration Créative",
    desc: "Trois directions distinctes présentées. Chaque piste est argumentée, documentée, comparée.",
    duration: "2 semaines",
  },
  {
    num: "03",
    title: "Développement",
    desc: "La direction validée est poussée dans ses moindres détails. Applications réelles, tests contextuels.",
    duration: "3 semaines",
  },
  {
    num: "04",
    title: "Production & Livraison",
    desc: "Fichiers sources organisés, brand book complet, formation équipe interne, suivi post-lancement.",
    duration: "1 semaine",
  },
];

const STATS = [
  { value: 180, suffix: "+", label: "Projets livrés" },
  { value: 12, suffix: " ans", label: "D'expérience" },
  { value: 94, suffix: "%", label: "Clients fidèles" },
  { value: 3, suffix: " awards", label: "Red Dot, ADC, Awwwards" },
];

const TESTIMONIALS = [
  {
    name: "Mathieu Rosset",
    role: "CEO, Folio Maison",
    city: "Genève",
    avatar: "MR",
    rating: 5,
    text: "Verso a transformé notre marque centenaire en identité contemporaine sans trahir notre héritage. Un travail d'orfèvre, une écoute exceptionnelle.",
  },
  {
    name: "Sara Lüdi",
    role: "Directrice Marketing, Helix Pharma",
    city: "Lausanne",
    avatar: "SL",
    rating: 5,
    text: "Le brief était complexe — concilier rigueur scientifique et accessibilité grand public. Ils ont livré exactement ça, et au-delà.",
  },
  {
    name: "David Chable",
    role: "Fondateur, Quartier Libre",
    city: "Carouge",
    avatar: "DC",
    rating: 5,
    text: "94% de vente en pré-lancement. Je ne peux pas tout attribuer à Verso, mais la direction artistique y est clairement pour beaucoup.",
  },
  {
    name: "Nora Wyss",
    role: "Creative Lead, Swiss Rail Heritage",
    city: "Zurich",
    avatar: "NW",
    rating: 5,
    text: "Concevoir une expo pour 200K visiteurs avec un budget muséal serré — ils ont relevé le défi avec une élégance remarquable.",
  },
];

const TEAM = [
  {
    name: "Lucas Berger",
    role: "Creative Director & Fondateur",
    bio: "15 ans de direction artistique entre Paris, Berlin et Genève. Ex-Pentagram, ex-BBDO.",
    initials: "LB",
  },
  {
    name: "Amélie Favre",
    role: "Senior Brand Designer",
    bio: "Spécialiste identités visuelles systémiques. ECAL Lausanne, stage Wolff Olins Londres.",
    initials: "AF",
  },
  {
    name: "Rafael Montes",
    role: "Digital Experience Lead",
    bio: "UX/UI et développement front. Believer de l'interaction meaningful et de l'accessibilité.",
    initials: "RM",
  },
  {
    name: "Chloé Müller",
    role: "Motion & Packaging Designer",
    bio: "ZHDK Zurich. Passeport entre le statique et le mouvement. Red Dot Award 2024.",
    initials: "CM",
  },
];

const FAQS = [
  {
    q: "Travaillez-vous uniquement avec des entreprises suisses ?",
    a: "Non — notre portfolio s'étend à la France, l'Allemagne et le Royaume-Uni. Nous travaillons à distance avec une aisance totale. Les ateliers de brief peuvent se tenir en présentiel à Genève ou via Zoom.",
  },
  {
    q: "Quelle est votre disponibilité actuelle ?",
    a: "Nous acceptons 3 à 4 projets majeurs par trimestre pour garantir l'attention que chacun mérite. Prenez contact tôt — les délais sont souvent de 6 à 8 semaines.",
  },
  {
    q: "Proposez-vous des forfaits pour startups ?",
    a: "Oui. Notre pack 'Early Stage' inclut logotype, one-pager et kit réseaux sociaux à partir de CHF 3'800. Idéal pour les levées de fonds en phase d'amorçage.",
  },
  {
    q: "Livrez-vous les fichiers sources ?",
    a: "Systématiquement. AI, EPS, SVG pour les logos. Figma partagé pour les UI. Tous les assets organisés par dossiers avec nomenclature documentée.",
  },
  {
    q: "Combien de cycles de révision sont inclus ?",
    a: "Deux cycles complets par phase. Nous constatons que des briefs solides en amont réduisent drastiquement le besoin de révisions — c'est pourquoi nous investissons dans la phase découverte.",
  },
];

// Counter animé
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(t); return; }
      setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(t);
  }, [isInView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// Split screen signature element
function SplitRevealHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const leftX = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.6], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { label: "Brand Identity", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop" },
    { label: "Digital Experience", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1400&auto=format&fit=crop" },
    { label: "Art Direction", image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1400&auto=format&fit=crop" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveSlide(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero"
      ref={containerRef}
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* LEFT — IMAGE */}
      <motion.div
        style={{
          x: leftX,
          width: "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${slides[activeSlide].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.7)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${C.emerald}80 0%, transparent 60%)`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div style={{ position: "absolute", bottom: 40, left: 40, display: "flex", gap: 8, zIndex: 10 }}>
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{
                width: i === activeSlide ? 32 : 8,
                height: 3,
                background: i === activeSlide ? C.emeraldGlow : `${C.white}40`,
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s ease",
                borderRadius: 2,
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Slide label */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 32,
            left: 40,
            paddingTop: 24,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlide}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                color: `${C.white}90`,
                fontSize: 13,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              {slides[activeSlide].label}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* DIVIDER */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.emeraldBright, zIndex: 20, opacity: 0.4 }} />
      <div style={{ position: "absolute", left: "calc(50% - 6px)", top: "50%", transform: "translateY(-50%)", width: 12, height: 12, background: C.emeraldGlow, borderRadius: "50%", zIndex: 21 }} />

      {/* RIGHT — CONTENT */}
      <motion.div
        style={{
          x: rightX,
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px 0 72px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, marginBottom: 24 }}>
            Studio de design — Genève
          </p>
          <h1 style={{ fontSize: "clamp(48px, 5.5vw, 88px)", fontWeight: 700, lineHeight: 1.0, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 28, letterSpacing: "-0.03em" }}>
            Identités
            <br />
            <span style={{ color: C.emeraldGlow }}>qui durent.</span>
          </h1>
          <p style={{ color: C.textMuted, fontSize: 18, lineHeight: 1.6, maxWidth: 440, marginBottom: 48, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Verso est un studio de branding genevois. Nous créons des identités visuelles, des expériences digitales et des systèmes de communication pour des marques exigeantes.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: C.emeraldGlow,
                color: C.bg,
                padding: "15px 28px",
                borderRadius: 4,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Démarrer un projet <ArrowRight size={16} />
            </button>
            <button onClick={() => document.getElementById("projets")?.scrollIntoView({behavior:"smooth"})}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                color: C.text,
                padding: "15px 28px",
                borderRadius: 4,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: 15,
                textDecoration: "none",
                border: `1px solid ${C.border}`,
              }}
            >
              Voir nos projets
            </button>
          </div>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: 40, marginTop: 60, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
            {[{ v: "180+", l: "Projets" }, { v: "12 ans", l: "D'expérience" }, { v: "3 Awards", l: "Internationaux" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: "-0.02em" }}>{s.v}</div>
                <div style={{ fontSize: 13, color: C.textMuted, fontFamily: "'DM Sans', system-ui, sans-serif", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div style={{ opacity }} style={{ position: "absolute", bottom: 32, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", color: C.textMuted, textTransform: "uppercase", fontFamily: "'DM Sans', system-ui, sans-serif", writingMode: "vertical-rl" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ width: 1, height: 40, background: C.emeraldGlow, opacity: 0.5 }}
        />
      </motion.div>
    </section>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact130Page() {
  // Mobile menu state — was mistakenly declared inside Counter (different
  // component), leaving it undefined here and 500ing every SSR render.
  const [mb130Open, setMb130Open] = useState(false);
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
    C = { ...C, emeraldGlow: brand };
  }

  const [activeFilter, setActiveFilter] = useState("Tous");
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filters = ["Tous", "Brand Identity", "Digital Experience", "Art Direction", "Packaging Design", "Campaign"];
  const filteredProjects = activeFilter === "Tous" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  const statsRef = useRef(null);
  const processRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);

  const { scrollYProgress: mainProgress } = useScroll();
  const progressBar = useTransform(mainProgress, [0, 1], ["0%", "100%"]);

  
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
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.emeraldMid}; border-radius: 2px; }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: 2, background: C.emeraldGlow, width: progressBar, zIndex: 100 }} />

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `${C.bg}ee`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <a href="#contact" style={{ textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: C.emeraldGlow, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 12, height: 12, background: C.bg, borderRadius: 1 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>Verso</span>
            </div>
          )}
        </a>

        <div id="mb130-nav" style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {["Projets", "Services", "Studio", "Process", "Contact"].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: C.textMuted, fontSize: 14, textDecoration: "none", fontWeight: 500, transition: "color 0.2s", letterSpacing: "0.01em" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >
              {item}
            </a>
          ))}
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            style={{
              background: C.emeraldGlow,
              color: C.bg,
              padding: "9px 20px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.03em",
            }}
          >
            Nouveau projet
          </button>
        </div>

        <button
          className="mb130-burger"
          onClick={() => setMb130Open(!mb130Open)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mb130Open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mb130Open ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mb130Open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>

      {mb130Open && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: `${C.bg}f5`, borderBottom: `1px solid ${C.border}`, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Projets", "Services", "Studio", "Process", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMb130Open(false)} style={{ color: C.textMuted, fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
              {item}
            </a>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb130-nav { display: none !important; } .mb130-burger { display: flex !important; } }`}</style>

      {/* HERO — SPLIT REVEAL SIGNATURE ELEMENT */}
      <SplitRevealHero />

      {/* STATS */}
      <section ref={statsRef} id="stats" style={{ padding: "100px 80px", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48 }}>
            {STATS.map((stat, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ fontSize: "clamp(48px, 4vw, 72px)", fontWeight: 700, color: C.emeraldGlow, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 14, color: C.textMuted, marginTop: 12, letterSpacing: "0.03em" }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section id="projets" style={{ padding: "120px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
              >
                Portfolio sélectionné
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                Projets récents
              </motion.h2>
            </div>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{ color: C.textMuted, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Voir tout <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 100,
                  border: `1px solid ${f === activeFilter ? C.emeraldGlow : C.border}`,
                  background: f === activeFilter ? `${C.emeraldGlow}15` : "transparent",
                  color: f === activeFilter ? C.emeraldGlow : C.textMuted,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: f === activeFilter ? 600 : 400,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grille projets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{ position: "relative", overflow: "hidden", borderRadius: 8, cursor: "pointer", aspectRatio: "4/3" }}
                  onMouseEnter={() => setActiveProject(i)}
                  onMouseLeave={() => setActiveProject(null)}
                  onClick={() => setActiveProject(i)}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      transform: activeProject === i ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0f0aee 0%, transparent 50%)" }} />

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeProject === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `${C.emerald}e0`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 32,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: C.emeraldGlow, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>{project.category}</p>
                    <p style={{ color: C.text, fontSize: 15, lineHeight: 1.5, marginBottom: 16 }}>{project.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.emeraldGlow, fontSize: 13, fontWeight: 600 }}>
                      <TrendingUp size={14} /> {project.result}
                    </div>
                  </motion.div>

                  {/* Info basse */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <p style={{ color: `${C.white}70`, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{project.category}</p>
                        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{project.title}</h3>
                      </div>
                      <span style={{ color: C.textDim, fontSize: 13 }}>{project.year}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      {project.tags.map(t => (
                        <span key={t} style={{ background: `${C.white}15`, color: `${C.white}80`, padding: "3px 10px", borderRadius: 100, fontSize: 11 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section ref={servicesRef} id="services" style={{ padding: "120px 80px", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
          >
            Nos expertises
          </motion.p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 480 }}
            >
              Ce que nous créons pour vous
            </motion.h2>
            <p style={{ color: C.textMuted, maxWidth: 320, fontSize: 16, lineHeight: 1.6 }}>
              Chaque service est un continuum — pas une prestation isolée. Nous pensons en systèmes.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {SERVICES.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ background: C.bgCard }}
                style={{
                  padding: "40px 36px",
                  border: `1px solid ${C.border}`,
                  background: C.bg,
                  cursor: "default",
                  transition: "background 0.3s",
                }}
              >
                <div style={{ color: C.emeraldGlow, marginBottom: 20 }}>{service.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12, letterSpacing: "-0.02em" }}>{service.title}</h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{service.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  {service.deliverables.map((d, di) => (
                    <div key={di} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Check size={13} color={C.emeraldGlow} />
                      <span style={{ color: C.textMuted, fontSize: 13 }}>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ color: C.emeraldGlow, fontSize: 14, fontWeight: 600 }}>{service.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section ref={processRef} id="process" style={{ padding: "120px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
          >
            Notre méthode
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 80 }}
          >
            4 phases, zéro surprise
          </motion.h2>

          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", left: 24, top: 40, bottom: 40, width: 1, background: C.border }} />

            {PROCESS.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-80px" });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ display: "flex", gap: 48, marginBottom: i < PROCESS.length - 1 ? 64 : 0, position: "relative", paddingLeft: 0 }}
                >
                  {/* Node */}
                  <div style={{ flexShrink: 0, width: 48, height: 48, border: `1px solid ${C.emeraldGlow}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, zIndex: 2 }}>
                    <span style={{ color: C.emeraldGlow, fontSize: 13, fontWeight: 700 }}>{step.num}</span>
                  </div>

                  <div style={{ paddingTop: 8, flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>{step.title}</h3>
                      <span style={{ color: C.textDim, fontSize: 13, background: C.bgCard, padding: "4px 12px", borderRadius: 100, border: `1px solid ${C.border}` }}>{step.duration}</span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.6, maxWidth: 600 }}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testimonialsRef} style={{ padding: "120px 80px", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
          >
            Ils nous font confiance
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 72 }}
          >
            Ce que disent nos clients
          </motion.h2>

          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 40 }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={14} color={C.gold} fill={C.gold} />
                  ))}
                </div>
                <p style={{ color: C.text, fontSize: 16, lineHeight: 1.7, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, background: `${C.emeraldGlow}20`, border: `1px solid ${C.emeraldGlow}40`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: C.emeraldGlow, fontSize: 13, fontWeight: 700 }}>{t.avatar}</span>
                  </div>
                  <div>
                    <div style={{ color: C.text, fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                    <div style={{ color: C.textMuted, fontSize: 13 }}>{t.role} — {t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="studio" style={{ padding: "120px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
          >
            L'équipe
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 72 }}
          >
            Qui sommes-nous
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 32, textAlign: "center" }}
              >
                <div style={{ width: 72, height: 72, background: `${C.emeraldGlow}15`, border: `1px solid ${C.emeraldGlow}30`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <span style={{ color: C.emeraldGlow, fontSize: 20, fontWeight: 700 }}>{member.initials}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4, letterSpacing: "-0.01em" }}>{member.name}</h3>
                <p style={{ color: C.emeraldGlow, fontSize: 12, letterSpacing: "0.05em", marginBottom: 14, fontWeight: 500 }}>{member.role}</p>
                <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "120px 80px", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}
          >
            Questions fréquentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 56 }}
          >
            Vos questions, nos réponses
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ border: `1px solid ${openFaq === i ? C.emeraldGlow : C.border}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.3s" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: openFaq === i ? `${C.emeraldGlow}08` : C.bgCard, border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ color: C.text, fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={18} color={C.textMuted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ padding: "0 28px 24px", color: C.textMuted, fontSize: 15, lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section id="contact" style={{ padding: "160px 80px", background: C.emerald, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(5, 201, 106, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(5, 201, 106, 0.08) 0%, transparent 50%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ color: C.emeraldGlow, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 24 }}>Nouveau projet</p>
            <h2 style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 24 }}>
              Prêt à bâtir
              <br />
              votre identité ?
            </h2>
            <p style={{ color: C.textMuted, fontSize: 18, lineHeight: 1.6, marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
              Parlez-nous de votre projet. Nous répondons sous 24h avec une première analyse gratuite.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href={`mailto:${fd?.email ?? "hello@verso-studio.ch"}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.emeraldGlow, color: C.bg, padding: "16px 32px", borderRadius: 4, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 16, textDecoration: "none" }}
              >
                <Mail size={18} />{fd?.email ?? "hello@verso-studio.ch"}</motion.a>
              <motion.a
                href={`tel:${fd?.phone ?? "+41225000000"}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.text, padding: "16px 32px", borderRadius: 4, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 16, textDecoration: "none", border: `1px solid ${C.borderLight}` }}
              >
                <Phone size={18} /> +41 22 500 00 00
              </motion.a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, paddingTop: 40, borderTop: `1px solid ${C.borderLight}` }}>
              {[{ icon: <MapPin size={15} />, text: "Rue du Rhône 24, 1204 Genève" }, { icon: <Clock size={15} />, text: "Lun–Ven 9h–18h" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: C.textMuted, fontSize: 14 }}>
                  <span style={{ color: C.emeraldGlow }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "56px 80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 24, height: 24, background: C.emeraldGlow, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 10, background: C.bg, borderRadius: 1 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Verso</span>
              </div>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, maxWidth: 220 }}>Studio de design basé à Genève. Identités visuelles, digital, direction artistique.</p>
            </div>
            {[
              { title: "Studio", links: ["À propos", "L'équipe", "Méthode", "Clients"] },
              { title: "Services", links: ["Brand Identity", "Digital Experience", "Art Direction", "Packaging"] },
              { title: "Contact", links: ["hello@verso-studio.ch", "+41 22 500 00 00", "Geneva, Suisse", "Disponibilités"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ color: C.textMuted, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>{col.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link, li) => (
                    <a key={li} href="#stats" style={{ color: C.textMuted, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
            <p style={{ color: C.textDim, fontSize: 13 }}>© 2025 Verso Studio SA, Genève. Tous droits réservés.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {[{ icon: <MessageSquare size={16} />, label: "Twitter" }, { icon: <Camera size={16} />, label: "Instagram" }, { icon: <Link2 size={16} />, label: "LinkedIn" }].map((s, i) => (
                <a key={i} href="#stats" style={{ color: C.textDim, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.emeraldGlow)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
