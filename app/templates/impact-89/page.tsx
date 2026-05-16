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
  ArrowRight,
  Star,
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Award,
  MessageSquare,
  Camera,
  Scissors,
  Shield,
  Zap,
  Users2,
  Calendar,
  Eye,
  Pen,
} from "lucide-react";

const C = {
  bg: "#0A0A0A",
  bgAlt: "#111111",
  bgCard: "#161616",
  bgDeep: "#050505",
  text: "#F0EDE8",
  textMuted: "#8A8278",
  textDim: "#4A4642",
  accent: "#8B0000",
  accentHover: "#A50000",
  accentLight: "rgba(139,0,0,0.12)",
  accentBright: "#C41E3A",
  gold: "#B8964E",
  goldLight: "rgba(184,150,78,0.15)",
  border: "rgba(240,237,232,0.06)",
  borderAccent: "rgba(139,0,0,0.35)",
  white: "#F0EDE8",
};

const FONT_HEADING = "'Anton', 'Impact', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const NAV_LINKS = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Artists", href: "#artists" },
  { label: "Styles", href: "#styles" },
  { label: "Flash", href: "#flash" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const STYLE_FILTERS = ["All", "Réaliste", "Géométrique", "Old School", "Japonais", "Blackwork", "Fine Line"];

const PORTFOLIO = [
  {
    id: 1,
    title: "Koi Dragon Sleeve",
    artist: "Viktor Rein",
    style: "Japonais",
    size: "tall",
    img: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80",
    duration: "18h",
    year: "2024",
  },
  {
    id: 2,
    title: "Skull Architecture",
    artist: "Léa Morel",
    style: "Géométrique",
    size: "wide",
    img: "https://images.unsplash.com/photo-1590246814885-55f8d5929c92?w=800&q=80",
    duration: "6h",
    year: "2024",
  },
  {
    id: 3,
    title: "Portrait Machiné",
    artist: "Viktor Rein",
    style: "Réaliste",
    size: "square",
    img: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80",
    duration: "12h",
    year: "2025",
  },
  {
    id: 4,
    title: "Americana Eagle",
    artist: "James Wolfe",
    style: "Old School",
    size: "square",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80",
    duration: "5h",
    year: "2024",
  },
  {
    id: 5,
    title: "Botanical Fine Line",
    artist: "Léa Morel",
    style: "Fine Line",
    size: "tall",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    duration: "4h",
    year: "2025",
  },
  {
    id: 6,
    title: "Neo-Tribal Full Back",
    artist: "Viktor Rein",
    style: "Blackwork",
    size: "wide",
    img: "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=800&q=80",
    duration: "24h",
    year: "2025",
  },
  {
    id: 7,
    title: "Hannya Mask",
    artist: "James Wolfe",
    style: "Japonais",
    size: "square",
    img: "https://images.unsplash.com/photo-1612460627003-c97612d2fb3a?w=600&q=80",
    duration: "9h",
    year: "2024",
  },
  {
    id: 8,
    title: "Mandala Sternum",
    artist: "Léa Morel",
    style: "Géométrique",
    size: "square",
    img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80",
    duration: "7h",
    year: "2025",
  },
];

const ARTISTS = [
  {
    name: "Viktor Rein",
    role: "Directeur artistique & Réalisme",
    exp: "14 ans",
    city: "Paris — Ancien de Mumbai & Berlin",
    bio: "Viktor travaille à la frontière entre l'hyperréalisme photographique et l'art noir. Ses portraits sont reconnaissables pour leur profondeur de noir et leurs dégradés impossible à distinguer d'une photo.",
    styles: ["Réaliste", "Japonais", "Blackwork"],
    wait: "12–16 semaines",
    from: "€400 / session",
    pieces: 840,
    color: C.accentBright,
  },
  {
    name: "Léa Morel",
    role: "Fine Line & Architecture géométrique",
    exp: "8 ans",
    city: "Paris — Formation à Amsterdam",
    bio: "Léa pousse la précision du trait jusqu'aux limites physiques de l'aiguille. Ses compositions géométriques suivent des règles mathématiques propres, créant des pièces qui semblent générées par algorithme.",
    styles: ["Fine Line", "Géométrique", "Botanique"],
    wait: "8–10 semaines",
    from: "€280 / session",
    pieces: 620,
    color: C.gold,
  },
  {
    name: "James Wolfe",
    role: "Old School & Japonais traditionnel",
    exp: "11 ans",
    city: "Paris — Apprentissage à San Francisco",
    bio: "James maîtrise le vocabulaire iconographique du tatouage traditionnel américain et japonais. Ses couleurs saturées et ses outlines épais sont la définition de l'old school à son meilleur.",
    styles: ["Old School", "Japonais", "Neo-Traditional"],
    wait: "6–8 semaines",
    from: "€320 / session",
    pieces: 1100,
    color: "#4A90D9",
  },
];

const STATS = [
  { value: 2560, label: "Pièces réalisées", suffix: "+" },
  { value: 14, label: "Années d'excellence", suffix: "" },
  { value: 98, label: "Satisfaction client", suffix: "%" },
  { value: 3, label: "Artistes certifiés", suffix: "" },
];

const STYLE_GUIDE = [
  {
    name: "Réalisme",
    artist: "Viktor Rein",
    desc: "Du portrait au paysage, la maîtrise des valeurs et des dégradés pour rendre le tatouage photographique. Encres spécialisées, aiguilles magnums.",
    traits: ["Portrait", "Architecture", "Nature", "Dark art"],
    icon: Eye,
    color: C.accentBright,
  },
  {
    name: "Géométrique",
    artist: "Léa Morel",
    desc: "Lignes parfaites, symétries absolues, constructions mathématiques. Chaque pièce est conçue sur grille avant d'être posée à l'aiguille.",
    traits: ["Mandala", "Dotwork", "Sacré", "Minimal"],
    icon: Zap,
    color: C.gold,
  },
  {
    name: "Old School",
    artist: "James Wolfe",
    desc: "Le vocabulaire américain classique : ancres, aigles, fleurs, cœurs. Outlines épais, couleurs saturées, iconographie immédiatement lisible.",
    traits: ["Traditionnel", "Coloré", "Iconique", "Durable"],
    icon: Scissors,
    color: "#4A90D9",
  },
  {
    name: "Japonais",
    artist: "Viktor & James",
    desc: "Koi, dragons, oni, cherry blossoms — le vocabulaire Irezumi posé avec respect et maîtrise des règles de composition traditionnelles.",
    traits: ["Sleeve", "Full back", "Mythologie", "Floral"],
    icon: Award,
    color: "#D4916E",
  },
  {
    name: "Blackwork",
    artist: "Viktor Rein",
    desc: "Le noir à l'état pur. Remplissages solides, néo-tribal, illustratif sombre. Des pièces qui vieillissent comme du bois flotté.",
    traits: ["Néo-tribal", "Dark illustratif", "Sleeve", "Full back"],
    icon: Shield,
    color: "#888888",
  },
  {
    name: "Fine Line",
    artist: "Léa Morel",
    desc: "L'extrême de la finesse. Aiguille single-needle, traits microscopiques. Pour ceux qui veulent porter une gravure sur la peau.",
    traits: ["Botanique", "Portrait minimaliste", "Lettrage", "Discret"],
    icon: Pen,
    color: "#A8C5A0",
  },
];

const FLASH_SALE = [
  { title: "Serpent & Lune", artist: "Viktor", price: "€180", original: "€280", style: "Blackwork", available: 1 },
  { title: "Rose Traditionnelle", artist: "James", price: "€120", original: "€180", style: "Old School", available: 2 },
  { title: "Géo Sternum", artist: "Léa", price: "€200", original: "€320", style: "Géométrique", available: 1 },
  { title: "Koi Bras", artist: "James", price: "€280", original: "€420", style: "Japonais", available: 1 },
  { title: "Feuille Botanique", artist: "Léa", price: "€90", original: "€150", style: "Fine Line", available: 3 },
  { title: "Crâne Architecture", artist: "Viktor", price: "€220", original: "€340", style: "Réaliste", available: 1 },
];

const PROCESS = [
  {
    step: "01",
    title: "Consultation",
    desc: "Échange de 30 à 45 minutes avec votre artiste — concept, emplacement, taille, budget. Nous ne commençons pas sans comprendre votre vision.",
    duration: "Gratuit",
  },
  {
    step: "02",
    title: "Design sur-mesure",
    desc: "L'artiste crée un design uniquement pour vous. 1 à 2 semaines de conception. Ajustements inclus jusqu'à satisfaction complète.",
    duration: "1–2 semaines",
  },
  {
    step: "03",
    title: "Dépôt de réservation",
    desc: "Un dépôt de 50€ (déduit du total) confirme votre créneau. Il garantit le temps de conception et votre place dans le calendrier.",
    duration: "€50 dépôt",
  },
  {
    step: "04",
    title: "Session de tatouage",
    desc: "Nous préparons votre peau, appliquons le stencil, vérifions le placement. La session commence quand vous êtes 100% satisfait du tracé.",
    duration: "2h à 24h+",
  },
  {
    step: "05",
    title: "Soin & suivi",
    desc: "Kit de soin offert, protocole complet remis par écrit. Retouche gratuite offerte dans les 3 mois si nécessaire.",
    duration: "3 mois de suivi",
  },
];

const TESTIMONIALS = [
  {
    name: "Maxime L.",
    city: "Paris 11e",
    rating: 5,
    artist: "Viktor Rein",
    text: "Viktor a fait mon portrait de chien sur l'avant-bras. Les poils sont tellement fins qu'on croirait une photo. Trois ans plus tard, c'est encore parfait. Le studio est d'une propreté chirurgicale.",
  },
  {
    name: "Anais D.",
    city: "Paris 9e",
    rating: 5,
    artist: "Léa Morel",
    text: "Ma géométrie sternal par Léa est une œuvre d'art. Elle a passé 2 semaines à concevoir le design avant de poser la moindre aiguille. Ce niveau de sérieux, ça se paie, et ça en vaut absolument la peine.",
  },
  {
    name: "Thomas B.",
    city: "Vincennes",
    rating: 5,
    artist: "James Wolfe",
    text: "James m'a fait un sleeve japonais complet sur 6 sessions. Sa connaissance de l'Irezumi est encyclopédique — il connaît l'origine de chaque symbole, chaque règle de composition. Exceptionnel.",
  },
  {
    name: "Sarah K.",
    city: "Montreuil",
    rating: 5,
    artist: "Léa Morel",
    text: "Mon fine line botanique est d'une délicatesse inouïe. Léa travaille avec une précision de chirurgien. J'ai eu peur que les traits si fins ne tiennent pas — 2 ans plus tard, parfait.",
  },
  {
    name: "Romain F.",
    city: "Paris 20e",
    rating: 5,
    artist: "Viktor Rein",
    text: "Full back blackwork avec Viktor sur 3 sessions de 8h. Le noir est d'une saturation absolue, les zones détaillées sont nettes comme des gravures. C'est de la haute couture portée sur la peau.",
  },
  {
    name: "Julie M.",
    city: "Saint-Denis",
    rating: 5,
    artist: "James Wolfe",
    text: "Mes deux roses old school sont parfaites. James maîtrise les couleurs comme personne — après 18 mois, elles brillent encore. Son accueil est chaleureux, l'expérience était incroyable.",
  },
];

const FAQS = [
  {
    q: "Combien coûte un tatouage chez Ink & Iron ?",
    a: "Nos tarifs démarrent à €180 pour les petites pièces flash. Les sessions au taux horaire : Viktor à €100/h, Léa à €90/h, James à €95/h. Les projets complexes (sleeves, full back) sont devisés en session globale après consultation.",
  },
  {
    q: "Comment réserver une consultation ?",
    a: "Via le formulaire de contact ou directement par email. La consultation initiale est gratuite et dure 30 à 45 minutes. Nous répondons sous 48h ouvrées. Pour les projets urgents, mentionnez-le — nous faisons le nécessaire.",
  },
  {
    q: "Quelles sont vos mesures d'hygiène ?",
    a: "Studio stérilisé à l'autoclave. Toutes les aiguilles sont à usage unique, ouvertes devant vous. Nos pratiques suivent et dépassent les normes DDPP. Audit sanitaire annuel affiché à l'entrée. Zéro compromis sur la sécurité.",
  },
  {
    q: "Est-ce que vous faites des retouches ?",
    a: "Oui. Toute retouche nécessaire dans les 3 mois suivant la session est gratuite. Au-delà, le tarif de retouche est de €50 pour les petites zones. Nous voulons que chaque pièce reste parfaite.",
  },
  {
    q: "Puis-je apporter mon propre design ?",
    a: "Absolument. Apportez vos références — photos, dessins, images. Votre artiste les adaptera à votre morphologie et aux contraintes techniques du tatouage. Il peut aussi travailler exclusivement sur votre concept.",
  },
  {
    q: "Quelle est la durée de cicatrisation ?",
    a: "La cicatrisation superficielle dure 2 à 3 semaines. La peau se régénère en profondeur sur 2 à 3 mois. Nous fournissons un protocole complet écrit et répondons à vos questions pendant toute la période de soin.",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Impact89Page() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeFlash, setActiveFlash] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null);

  const filtered = activeFilter === "All"
    ? PORTFOLIO
    : PORTFOLIO.filter((p) => p.style === activeFilter);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}; }
        ::selection { background: ${C.accent}; color: ${C.white}; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
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
          padding: "0 40px",
          height: 72,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36,
              background: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}>
              <span style={{ fontFamily: FONT_HEADING, fontSize: 14, color: C.white, letterSpacing: 1 }}>I</span>
            </div>
            <span style={{ fontFamily: FONT_HEADING, fontSize: 20, letterSpacing: 4, color: C.white }}>INK & IRON</span>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: C.textMuted,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 2,
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              {link.label}
            </a>
          ))}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setBookingOpen(true)}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              padding: "10px 24px",
              fontFamily: FONT_BODY,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            Réserver
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: C.bgDeep,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://images.unsplash.com/photo-1590246814885-55f8d5929c92?w=1600&q=60")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            scale: heroScale,
            y: heroY,
            opacity: 0.12,
          }}
        />

        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }} />

        <motion.div
          style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 40,
              border: `1px solid ${C.borderAccent}`,
              padding: "8px 20px",
              background: C.accentLight,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
            <span style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: C.accent,
            }}>Studio Paris — Depuis 2010</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(72px, 14vw, 180px)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: C.text,
              marginBottom: 8,
            }}
          >
            INK
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              width: "100%",
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
              marginBottom: 8,
            }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(72px, 14vw, 180px)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: C.accent,
              marginBottom: 40,
            }}
          >
            & IRON
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: "clamp(14px, 1.5vw, 18px)",
              color: C.textMuted,
              maxWidth: 480,
              margin: "0 auto 48px",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Tatouage luxury à Paris. Trois artistes. Un standard absolu d'excellence — de la consultation à la cicatrisation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setBookingOpen(true)}
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                padding: "16px 40px",
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
              }}
            >
              Prendre RDV <ArrowRight size={16} />
            </motion.button>
            <button onClick={() => document.getElementById("portfolio")?.scrollIntoView({behavior:"smooth"})}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: "transparent",
                color: C.white,
                border: `1px solid ${C.border}`,
                padding: "16px 40px",
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              Voir le portfolio
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ChevronDown size={20} color={C.textDim} />
        </motion.div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        style={{
          padding: "80px 40px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                textAlign: "center",
                padding: "40px 20px",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(48px, 6vw, 80px)",
                color: C.accent,
                lineHeight: 1,
                marginBottom: 12,
              }}>
                {statsInView ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
              </div>
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.textMuted,
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" style={{ padding: "120px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 60 }}
          >
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: 16,
            }}>
              — Portfolio
            </div>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 0.95,
              color: C.text,
              marginBottom: 40,
            }}>
              NOTRE TRAVAIL
            </h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {STYLE_FILTERS.map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    background: activeFilter === filter ? C.accent : "transparent",
                    color: activeFilter === filter ? C.white : C.textMuted,
                    border: `1px solid ${activeFilter === filter ? C.accent : C.border}`,
                    padding: "8px 20px",
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridAutoRows: "240px",
                gap: 12,
              }}
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    gridRow: item.size === "tall" ? "span 2" : "span 1",
                    gridColumn: item.size === "wide" ? "span 2" : "span 1",
                    background: C.bgCard,
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease, filter 0.4s ease",
                      filter: "brightness(0.7) saturate(0.5)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)";
                      (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.9) saturate(0.8)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.7) saturate(0.5)";
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "32px 20px 20px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                  }}>
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: C.accent,
                      marginBottom: 4,
                    }}>
                      {item.style} — {item.artist}
                    </div>
                    <div style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 18,
                      color: C.white,
                      letterSpacing: 1,
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      color: C.textMuted,
                      marginTop: 4,
                    }}>
                      {item.duration} · {item.year}
                    </div>
                  </div>
                  <div style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "rgba(0,0,0,0.7)",
                    border: `1px solid ${C.border}`,
                    padding: "4px 10px",
                    fontFamily: FONT_MONO,
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: C.textMuted,
                  }}>
                    {item.style}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ARTISTS */}
      <section id="artists" style={{ padding: "120px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 80 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — L'équipe
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.95, color: C.text }}>
              NOS ARTISTES
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ARTISTS.map((artist, i) => (
              <motion.div
                key={artist.name}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                onMouseEnter={() => setHoveredArtist(i)}
                onMouseLeave={() => setHoveredArtist(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 40,
                  alignItems: "center",
                  padding: "48px 40px",
                  background: hoveredArtist === i ? C.bgCard : "transparent",
                  borderLeft: `3px solid ${hoveredArtist === i ? artist.color : "transparent"}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 56,
                  color: hoveredArtist === i ? artist.color : C.textDim,
                  lineHeight: 1,
                  transition: "color 0.3s",
                }}>
                  0{i + 1}
                </div>
                <div>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 36, color: C.text, letterSpacing: 1, marginBottom: 8 }}>
                    {artist.name}
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: artist.color, marginBottom: 16 }}>
                    {artist.role}
                  </div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7, maxWidth: 600 }}>
                    {artist.bio}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                    {artist.styles.map((s) => (
                      <span key={s} style={{
                        background: C.accentLight,
                        border: `1px solid ${C.borderAccent}`,
                        color: C.accent,
                        padding: "4px 12px",
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 180 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>
                    Délai
                  </div>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.text, marginBottom: 16 }}>
                    {artist.wait}
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>
                    À partir de
                  </div>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 28, color: artist.color }}>
                    {artist.from}
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textDim, marginTop: 8 }}>
                    {artist.pieces}+ pièces réalisées
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STYLE GUIDE */}
      <section id="styles" style={{ padding: "120px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 80 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — Disciplines
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.95, color: C.text }}>
              NOS STYLES
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {STYLE_GUIDE.map((style, i) => {
              const Icon = style.icon;
              return (
                <motion.div
                  key={style.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: C.bgCard,
                    padding: 40,
                    borderTop: `2px solid ${style.color}`,
                    cursor: "default",
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    background: `${style.color}15`,
                    border: `1px solid ${style.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}>
                    <Icon size={22} color={style.color} />
                  </div>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C.text, marginBottom: 8, letterSpacing: 1 }}>
                    {style.name}
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: style.color, marginBottom: 20 }}>
                    {style.artist}
                  </div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
                    {style.desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {style.traits.map((trait) => (
                      <div key={trait} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 6, height: 1, background: style.color }} />
                        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textMuted, letterSpacing: 1 }}>{trait}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section id="flash" style={{ padding: "120px 40px", background: C.bgAlt, overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 60 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — Disponible maintenant
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.95, color: C.text }}>
                FLASH SALE
              </h2>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, maxWidth: 400, lineHeight: 1.7 }}>
                Des designs créés par nos artistes, prêts à poser. Prix réduits, disponibilité limitée. Premier arrivé, premier tatou.
              </p>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {FLASH_SALE.map((flash, i) => (
              <motion.div
                key={flash.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveFlash(activeFlash === i ? null : i)}
                style={{
                  background: activeFlash === i ? C.bgCard : "transparent",
                  border: `1px solid ${activeFlash === i ? C.borderAccent : C.border}`,
                  padding: "32px 28px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {activeFlash === i && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: C.accent,
                      transformOrigin: "top",
                      boxShadow: `0 0 12px ${C.accent}`,
                    }}
                  />
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>
                      {flash.style} · {flash.artist}
                    </div>
                    <div style={{ fontFamily: FONT_HEADING, fontSize: 24, color: C.text }}>
                      {flash.title}
                    </div>
                  </div>
                  <div style={{
                    background: C.accentLight,
                    border: `1px solid ${C.borderAccent}`,
                    padding: "4px 10px",
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    color: C.accent,
                    letterSpacing: 1,
                  }}>
                    {flash.available}x dispo
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 32, color: C.accent }}>{flash.price}</div>
                  <div style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    color: C.textDim,
                    textDecoration: "line-through",
                  }}>{flash.original}</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); setBookingOpen(true); }}
                  style={{
                    marginTop: 20,
                    background: activeFlash === i ? C.accent : "transparent",
                    color: activeFlash === i ? C.white : C.textMuted,
                    border: `1px solid ${activeFlash === i ? C.accent : C.border}`,
                    padding: "10px 20px",
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  Réserver ce flash <ArrowRight size={12} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: "120px 40px", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 80 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — Notre méthode
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.95, color: C.text }}>
              LE PROCESSUS
            </h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              left: 36,
              top: 0,
              bottom: 0,
              width: 1,
              background: `linear-gradient(${C.accent}, transparent)`,
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 40,
                    paddingBottom: 60,
                  }}
                >
                  <div style={{
                    width: 72,
                    height: 72,
                    background: C.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}>
                    <span style={{ fontFamily: FONT_HEADING, fontSize: 18, color: C.white }}>{step.step}</span>
                  </div>
                  <div style={{ paddingTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
                      <div style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C.text }}>
                        {step.title}
                      </div>
                      <div style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        letterSpacing: 2,
                        color: C.accent,
                        background: C.accentLight,
                        border: `1px solid ${C.borderAccent}`,
                        padding: "4px 12px",
                      }}>
                        {step.duration}
                      </div>
                    </div>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "120px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 80 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — Témoignages
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.95, color: C.text }}>
              ILS NOUS FONT CONFIANCE
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{
                  background: C.bgCard,
                  padding: "36px 32px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill={C.gold} color={C.gold} />
                  ))}
                </div>
                <blockquote style={{
                  fontFamily: FONT_BODY,
                  fontSize: 15,
                  color: C.textMuted,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  marginBottom: 28,
                }}>
                  "{t.text}"
                </blockquote>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.accent }}>
                    {t.artist} · {t.city}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HYGIENE SECTION */}
      <section style={{ padding: "100px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>
              — Hygiène & sécurité
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.95, color: C.text, marginBottom: 32 }}>
              ZÉRO COMPROMIS
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 40 }}>
              Chaque aiguille est ouverte devant vous. Notre autoclave est contrôlé chaque semaine. Les surfaces sont stérilisées entre chaque client. Nous respectons et dépassons toutes les normes DDPP en vigueur.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Aiguilles à usage unique, ouvertes devant le client",
                "Autoclave validé — contrôle hebdomadaire",
                "Stérilisation complète entre chaque client",
                "Audit sanitaire DDPP annuel affiché en studio",
                "Formation continue aux bonnes pratiques d'hygiène",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 20, height: 20,
                    background: C.accentLight,
                    border: `1px solid ${C.borderAccent}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <Check size={11} color={C.accent} />
                  </div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: C.bgCard,
              padding: 48,
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            <Shield size={48} color={C.accent} style={{ marginBottom: 32 }} />
            <div style={{ fontFamily: FONT_HEADING, fontSize: 56, color: C.text, lineHeight: 1, marginBottom: 12 }}>
              100%
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>
              Conformité DDPP
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
              Notre dernier audit sanitaire : 14 mars 2025. Aucune non-conformité. Notre rapport complet est disponible à la demande.
            </p>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Audit DDPP", value: "Mars 2025" },
                { label: "Prochain contrôle", value: "Mars 2026" },
                { label: "Non-conformités", value: "0" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, color: C.textDim, textTransform: "uppercase" }}>{item.label}</span>
                  <span style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "120px 40px", background: C.bgAlt }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              — Questions fréquentes
            </div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.95, color: C.text }}>
              FAQ
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: "28px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 20,
                  }}
                >
                  <span style={{ fontFamily: FONT_BODY, fontSize: 17, fontWeight: 500, color: openFaq === i ? C.accent : C.text, transition: "color 0.2s", lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={20} color={openFaq === i ? C.accent : C.textDim} />
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
                      <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7, paddingBottom: 28 }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: "120px 40px",
        background: C.bg,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            border: `1px solid ${C.border}`,
            borderRadius: "50%",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            border: `1px solid ${C.borderAccent}`,
            borderRadius: "50%",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 24 }}>
            — Votre prochain tatouage
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(48px, 8vw, 100px)", lineHeight: 0.9, color: C.text, marginBottom: 24 }}>
            PRÊT À<br />COMMENCER ?
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Consultation gratuite avec l'artiste de votre choix. Pas d'engagement — juste une conversation sur votre projet.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBookingOpen(true)}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              padding: "20px 56px",
              fontFamily: FONT_HEADING,
              fontSize: 18,
              letterSpacing: 4,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              clipPath: "polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)",
            }}
          >
            PRENDRE RDV <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: C.bgDeep,
        borderTop: `1px solid ${C.border}`,
        padding: "64px 40px 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 64 }}>
            <div>
              <div style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C.text, letterSpacing: 4, marginBottom: 20 }}>
                INK & IRON
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                Studio de tatouage luxury à Paris depuis 2010. Trois artistes, un standard absolu. Rue de la Roquette, Paris 11e.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[Camera, MessageSquare, Users2].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, background: C.accent }}
                    style={{
                      width: 40, height: 40,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    <Icon size={16} color={C.textMuted} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Navigation</div>
              {["Portfolio", "Artistes", "Styles", "Flash Sale", "Processus", "FAQ"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{
                  display: "block",
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  color: C.textMuted,
                  textDecoration: "none",
                  marginBottom: 10,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                >{item}</a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Artistes</div>
              {ARTISTS.map((a) => (
                <div key={a.name} style={{
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  color: C.textMuted,
                  marginBottom: 10,
                }}>{a.name}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>Contact</div>
              {[
                { Icon: MapPin, text: "24 Rue de la Roquette\nParis 11e, 75011" },
                { Icon: Phone, text: "+33 1 43 56 78 90" },
                { Icon: Mail, text: "contact@inkandironstudio.fr" },
                { Icon: Clock, text: "Mar–Sam : 11h–20h\nDim–Lun : fermé" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                  <Icon size={14} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textMuted, lineHeight: 1.5, whiteSpace: "pre-line" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textDim, letterSpacing: 2 }}>
              © 2025 INK & IRON STUDIO — PARIS 11E
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
                <a key={item} href="#" style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textDim, textDecoration: "none", letterSpacing: 2, textTransform: "uppercase" }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setBookingOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.borderAccent}`,
                padding: 48,
                maxWidth: 540,
                width: "100%",
                position: "relative",
              }}
            >
              <button
                onClick={() => setBookingOpen(false)}
                style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer" }}
              >
                <X size={20} color={C.textMuted} />
              </button>

              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>
                — Consultation gratuite
              </div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 36, color: C.text, marginBottom: 32 }}>
                RÉSERVER
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Prénom & Nom", type: "text", placeholder: "Alexandre Martin" },
                  { label: "Email", type: "email", placeholder: "alexandre@email.com" },
                  { label: "Téléphone", type: "tel", placeholder: "+33 6 00 00 00 00" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.textDim, display: "block", marginBottom: 8 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        color: C.text,
                        padding: "12px 16px",
                        fontFamily: FONT_BODY,
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.textDim, display: "block", marginBottom: 8 }}>
                    Artiste préféré
                  </label>
                  <select style={{
                    width: "100%",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    padding: "12px 16px",
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    outline: "none",
                    cursor: "pointer",
                  }}>
                    <option>Viktor Rein — Réalisme & Japonais</option>
                    <option>Léa Morel — Fine Line & Géométrique</option>
                    <option>James Wolfe — Old School & Japonais</option>
                    <option>Sans préférence</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.textDim, display: "block", marginBottom: 8 }}>
                    Décrivez votre projet
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Style, emplacement, taille, inspirations..."
                    style={{
                      width: "100%",
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      color: C.text,
                      padding: "12px 16px",
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: C.accent,
                    color: C.white,
                    border: "none",
                    padding: "16px 32px",
                    fontFamily: FONT_HEADING,
                    fontSize: 16,
                    letterSpacing: 3,
                    cursor: "pointer",
                    width: "100%",
                    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  }}
                >
                  ENVOYER MA DEMANDE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
