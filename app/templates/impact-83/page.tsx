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
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Gem,
  Shield,
  Package,
  Camera,
  MessageSquare,
  Link2,
  Users2,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
} from "lucide-react";

const C = {
  bg: "#1a0f05",
  bgAlt: "#120a03",
  bgCard: "#221508",
  text: "#f5e8d0",
  textMuted: "#a08060",
  accent: "#C9A96E",
  accentDark: "#9e7a45",
  accentLight: "#e8c88a",
  accentGlow: "rgba(201,169,110,0.15)",
  border: "#3a2510",
  borderGold: "rgba(201,169,110,0.3)",
  white: "#ffffff",
  ruby: "#9b2335",
  sapphire: "#1a3a6b",
  emerald: "#1a5c3a",
  diamond: "#c8d8e8",
  amethyst: "#5c2d7a",
};

const FONT_HEADING = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'Cormorant Garamond', Georgia, serif";
const FONT_LABEL = "system-ui, sans-serif";

const COLLECTIONS = [
  {
    id: "high-jewelry",
    label: "High Jewelry",
    pieces: [
      {
        name: "Constellation Noir",
        subtitle: "Collier haute joaillerie",
        price: "€185,000",
        stone: "Diamant noir 8 ct",
        metal: "Or blanc 18k",
        gem: "diamond",
        desc: "Un firmament de diamants noirs taille étoile, serti en micro-pavé sur or blanc rhodié. Pièce unique, certificat GIA.",
        limited: true,
      },
      {
        name: "Flamme Imperiale",
        subtitle: "Bracelet manchette",
        price: "€94,000",
        stone: "Rubis Mogok 6 ct",
        metal: "Or jaune 22k",
        gem: "ruby",
        desc: "Rubis de Birmanie d'une pureté exceptionnelle, entouré de diamants blancs taille brillant. Collection Imperiale.",
        limited: false,
      },
      {
        name: "Larme d'Azur",
        subtitle: "Bague solitaire",
        price: "€67,000",
        stone: "Saphir Cachemire 4.2 ct",
        metal: "Platine 950",
        gem: "sapphire",
        desc: "Saphir de Cachemire non-chauffé, couleur Royal Blue certifiée. Entourage diamants taille ancienne.",
        limited: false,
      },
      {
        name: "Forêt Secrète",
        subtitle: "Parure collier + boucles",
        price: "€52,000",
        stone: "Émeraude Colombie 5.5 ct",
        metal: "Or rose 18k",
        gem: "emerald",
        desc: "Émeraude vivid green de Colombie en taille cabochon. Feuillage ciselé à la main par nos maîtres joailliers.",
        limited: true,
      },
    ],
  },
  {
    id: "timepieces",
    label: "Horlogerie",
    pieces: [
      {
        name: "Aurelius Perpetuel",
        subtitle: "Calendrier perpétuel",
        price: "€142,000",
        stone: "Cadran nacre",
        metal: "Or blanc 18k",
        gem: "diamond",
        desc: "Mouvement manufacture Calibre AH-21, 396 composants. Calendrier perpétuel, phases de lune, réserve de marche 72h.",
        limited: true,
      },
      {
        name: "Héritage Tourbillon",
        subtitle: "Tourbillon volant",
        price: "€285,000",
        stone: "Saphir massif",
        metal: "Titane grade 5",
        gem: "sapphire",
        desc: "Tourbillon volant à cage ouverte visible à 6h. Boîte en titane brossé, fond saphir, bracelet alligator Hermès.",
        limited: true,
      },
      {
        name: "Solstice Dame",
        subtitle: "Montre dame parée",
        price: "€89,000",
        stone: "Diamants 2.8 ct total",
        metal: "Or rose 18k",
        gem: "ruby",
        desc: "Boîte entièrement pavée de diamants roses. Cadran nacre rose, aiguilles feuilles d'or. Mouvement manufacture quartz haute précision.",
        limited: false,
      },
      {
        name: "Nuit Éternelle",
        subtitle: "Skeleton automatique",
        price: "€76,000",
        stone: "Cadran squelette laqué",
        metal: "Or gris 18k",
        gem: "amethyst",
        desc: "Architecture squelette ouverte révélant le Calibre AH-14. Décor côtes de Genève poli à la main, 40h de réserve.",
        limited: false,
      },
    ],
  },
  {
    id: "bespoke",
    label: "Sur Mesure",
    pieces: [
      {
        name: "Service Bespoke",
        subtitle: "Création unique",
        price: "Sur devis",
        stone: "Pierre de votre choix",
        metal: "Métal de votre choix",
        gem: "diamond",
        desc: "Nos maîtres joailliers créent votre pièce unique. Consultation privée à Paris, Monaco ou à domicile. Délai : 6 à 18 mois.",
        limited: false,
      },
      {
        name: "Héritage Familial",
        subtitle: "Transformation et restauration",
        price: "À partir de €8,000",
        stone: "Vos pierres existantes",
        metal: "Vos métaux existants",
        gem: "emerald",
        desc: "Donnez une seconde vie à vos bijoux de famille. Redesign complet ou restauration à l'identique par nos experts.",
        limited: false,
      },
      {
        name: "Alliance Éternité",
        subtitle: "Alliances personnalisées",
        price: "À partir de €12,000",
        stone: "Diamant de votre choix",
        metal: "Or ou Platine",
        gem: "sapphire",
        desc: "Alliances gravées à vos initiales, ornées de la pierre qui symbolise votre histoire. Écrin assorti inclus.",
        limited: false,
      },
      {
        name: "Montre Signature",
        subtitle: "Cadran personnalisé",
        price: "À partir de €45,000",
        stone: "Email grand feu",
        metal: "Or 18k",
        gem: "amethyst",
        desc: "Votre peinture miniature sur email grand feu, artisanat vieux de 3 siècles. Portrait, paysage ou motif symbolique.",
        limited: false,
      },
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Isabelle de Montfort",
    role: "Collectionneuse, Paris VIIe",
    note: 5,
    text: "La Constellation Noir surpasse tout ce que j'ai vu chez Van Cleef ou Cartier. L'attention au détail est simplement bouleversante.",
    piece: "Constellation Noir",
  },
  {
    name: "Richard Ashworth",
    role: "CEO, Londres",
    note: 5,
    text: "Le Tourbillon Héritage que j'ai commandé est une œuvre d'art mécanique. L'équipe Aurelius a su transcender mes attentes.",
    piece: "Héritage Tourbillon",
  },
  {
    name: "Sophia Marchetti",
    role: "Architecte d'intérieur, Milan",
    note: 5,
    text: "Mon service bespoke a été une expérience inoubliable. Six mois de collaboration intense pour une bague qui me ressemble.",
    piece: "Service Bespoke",
  },
  {
    name: "Ibrahim Al-Rashidi",
    role: "Ambassadeur, Genève",
    note: 5,
    text: "Aurelius Heritage est l'une des rares maisons à allier l'excellence horlogère suisse à l'art de la joaillerie française. Unique.",
    piece: "Solstice Dame",
  },
  {
    name: "Caroline Lefebvre",
    role: "Présidente de galerie, Monaco",
    note: 5,
    text: "La parure Forêt Secrète est le summum du raffinement. Portée lors d'un gala, elle a suscité l'admiration générale.",
    piece: "Forêt Secrète",
  },
];

const STATS = [
  { value: "1887", label: "Fondée en", suffix: "" },
  { value: "138", label: "Années de savoir-faire", suffix: "" },
  { value: "4,200", label: "Pièces créées", suffix: "+" },
  { value: "32", label: "Pays représentés", suffix: "" },
];

const PROCESS = [
  {
    num: "01",
    title: "Consultation Privée",
    desc: "Rencontre confidentielle dans notre atelier parisien ou à domicile pour définir votre vision, vos désirs et le budget.",
  },
  {
    num: "02",
    title: "Sélection des Matières",
    desc: "Nos gemmologues GIA présentent une sélection exclusive de pierres certifiées. Chaque pierre est choisie pour son caractère unique.",
  },
  {
    num: "03",
    title: "Esquisse & Design",
    desc: "Nos dessinateurs créent plusieurs propositions à la main. Aquarelles, dessins techniques, modélisation 3D si souhaité.",
  },
  {
    num: "04",
    title: "Création en Atelier",
    desc: "Fabrication entièrement à la main par nos maîtres joailliers. Chaque pièce requiert entre 200 et 800 heures de travail.",
  },
  {
    num: "05",
    title: "Remise Cérémonielle",
    desc: "Présentation privée accompagnée du certificat d'authenticité, du passeport de la pierre et de l'écrin Aurelius Heritage.",
  },
];

const TEAM = [
  {
    name: "Édouard Aurelius III",
    role: "Maître Joaillier & Directeur",
    bio: "Troisième génération de la famille fondatrice. Formé à l'École des Arts Joailliers, perfectionnement à Anvers et à Tokyo.",
    exp: "28 ans",
  },
  {
    name: "Céleste Fontenay",
    role: "Gemmologue GIA",
    bio: "Docteure en minéralogie, diplômée du GIA (Gemological Institute of America). Spécialiste des rubis birmans et des saphirs du Cachemire.",
    exp: "19 ans",
  },
  {
    name: "Viktor Brandt",
    role: "Maître Horloger",
    bio: "Ancien chef d'atelier chez Patek Philippe. Membre de l'Académie Horlogère de Genève. Spécialiste des complications grands feux.",
    exp: "34 ans",
  },
  {
    name: "Amélie Rousseau",
    role: "Designer Joaillier",
    bio: "École Boulle, puis ESMA Paris. Primée au Grand Prix de la Création de la Ville de Paris. Auteure de 47 collections.",
    exp: "15 ans",
  },
];

const FAQ = [
  {
    q: "Proposez-vous un service de transport sécurisé ?",
    a: "Oui, nous travaillons avec Brink's et Ferrari Lux pour le transport de valeurs. Toutes nos pièces sont livrées sous escorte et pleinement assurées Lloyd's of London.",
  },
  {
    q: "Puis-je essayer une pièce avant de l'acheter ?",
    a: "Toutes nos pièces disponibles peuvent être présentées lors d'un rendez-vous privé dans notre atelier. Nous proposons également un service de prêt de 48h pour les clients fidèles.",
  },
  {
    q: "Quels sont vos délais pour le sur-mesure ?",
    a: "Les délais varient selon la complexité : 6 mois pour une bague simple, jusqu'à 24 mois pour une montre à complications. Nous vous tenons informés à chaque étape.",
  },
  {
    q: "Acceptez-vous les reprises de bijoux ou montres ?",
    a: "Oui, nous évaluons et rachetions les pièces de haute joaillerie et d'horlogerie de prestige, ou les intégrons dans un échange partiel pour une nouvelle création.",
  },
  {
    q: "Proposez-vous une garantie sur vos créations ?",
    a: "Toutes nos pièces sont garanties à vie contre les défauts de fabrication. Un service d'entretien annuel est inclus les 5 premières années.",
  },
];

const GEM_COLORS: Record<string, { fill: string; glow: string; name: string }> = {
  diamond: { fill: C.diamond, glow: "rgba(200,216,232,0.6)", name: "Diamant" },
  ruby: { fill: C.ruby, glow: "rgba(155,35,53,0.6)", name: "Rubis" },
  sapphire: { fill: C.sapphire, glow: "rgba(26,58,107,0.6)", name: "Saphir" },
  emerald: { fill: C.emerald, glow: "rgba(26,92,58,0.6)", name: "Émeraude" },
  amethyst: { fill: C.amethyst, glow: "rgba(92,45,122,0.6)", name: "Améthyste" },
};

// ── Animated gemstone SVG ──────────────────────────────────────────────────
function GemStoneSVG({ type, size = 120, animated = true }: { type: string; size?: number; animated?: boolean }) {
  const gem = GEM_COLORS[type] || GEM_COLORS.diamond;
  const [hovered, setHovered] = useState(false);
  const glowSize = hovered ? size * 1.4 : size * 1.1;

  const facets = [
    "M60,10 L90,40 L60,55 Z",
    "M60,10 L30,40 L60,55 Z",
    "M90,40 L100,75 L60,55 Z",
    "M30,40 L20,75 L60,55 Z",
    "M100,75 L60,100 L60,55 Z",
    "M20,75 L60,100 L60,55 Z",
    "M60,100 L90,40 L100,75 Z",
    "M60,100 L30,40 L20,75 Z",
  ];
  const opacities = [0.9, 0.7, 0.8, 0.6, 0.85, 0.65, 0.75, 0.55];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "relative", width: size, height: size, cursor: "pointer" }}
    >
      {/* Glow */}
      <motion.div
        animate={{ width: glowSize, height: glowSize, opacity: hovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${gem.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <motion.svg
        viewBox="0 0 120 110"
        width={size}
        height={size}
        animate={animated ? { rotateY: hovered ? 180 : 0 } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 ${hovered ? 16 : 8}px ${gem.glow})` }}
      >
        {facets.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill={gem.fill}
            fillOpacity={opacities[i]}
            stroke={C.accentLight}
            strokeWidth="0.5"
            animate={{ fillOpacity: hovered ? opacities[i] * 1.2 : opacities[i] }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          />
        ))}
        {/* Center sparkle */}
        {hovered && (
          <motion.circle
            cx="60" cy="55" r="3"
            fill={C.white}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: [0, 1, 0], r: [0, 4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </motion.svg>
    </motion.div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ target, suffix }: { target: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const isNumeric = !isNaN(parseInt(target.replace(/,/g, "")));
  const numericTarget = isNumeric ? parseInt(target.replace(/,/g, "")) : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start = 0;
    const duration = 2000;
    const step = duration / numericTarget;
    const timer = setInterval(() => {
      start += Math.ceil(numericTarget / 80);
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, numericTarget, isNumeric]);

  return (
    <span ref={ref}>
      {isNumeric ? count.toLocaleString("fr-FR") : target}
      {suffix}
    </span>
  );
}

export default function Impact83Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  const [activeCollection, setActiveCollection] = useState("high-jewelry");
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [heroGem, setHeroGem] = useState<string>("diamond");

  const currentCollection = COLLECTIONS.find((c) => c.id === activeCollection)!;

  // Rotate hero gem
  useEffect(() => {
    const gems = ["diamond", "ruby", "sapphire", "emerald", "amethyst"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % gems.length;
      setHeroGem(gems[i]);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const statsRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const collectionsInView = useInView(collectionsRef, { once: true, margin: "-80px" });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(26,15,5,0)", "rgba(26,15,5,0.97)"]);

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily: FONT_BODY,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.accentGlow}; color: ${C.accent}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accentDark}; border-radius: 2px; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          borderBottom: `1px solid rgba(201,169,110,0.1)`,
          backdropFilter: "blur(12px)",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 300, color: C.accent, letterSpacing: "0.12em" }}>
            AURELIUS
          </span>
          <span style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.35em", color: C.textMuted, textTransform: "uppercase" }}>
            Heritage · Est. 1887
          </span>
        </motion.div>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Collections", "Horlogerie", "Sur Mesure", "Maison", "Contact"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ color: C.accent }}
              style={{
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.textMuted,
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              {item}
            </button>
          ))}
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: FONT_LABEL,
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: C.bg,
              background: C.accent,
              padding: "10px 24px",
              textDecoration: "none",
            }}
          >
            Rendez-vous privé
          </button>
        </div>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bg} 60%, #2a1808 100%)`,
        }}
      >
        {/* Grain texture */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            filter: "url(#grain)",
            pointerEvents: "none",
          }}
        />

        {/* Ornamental lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${C.borderGold} 1px, transparent 1px), linear-gradient(90deg, ${C.borderGold} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 24px" }}>
            {/* Gem signature element */}
            <motion.div
              style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroGem}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <GemStoneSVG type={heroGem} size={140} animated={false} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 24,
              }}
            >
              Maison de Joaillerie & Horlogerie
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                lineHeight: 0.9,
                color: C.text,
                marginBottom: 8,
              }}
            >
              L'Art du
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 8vw, 120px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 0.9,
                color: C.accent,
                marginBottom: 40,
              }}
            >
              Temps Précieux
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 20,
                fontWeight: 300,
                color: C.textMuted,
                maxWidth: 520,
                margin: "0 auto 56px",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              Depuis 1887, Aurelius Heritage perpétue l'excellence de la joaillerie française et l'art horloger suisse pour les collectionneurs du monde entier.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
            >
              <button onClick={() => document.getElementById("collections")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.03, background: C.accentLight }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.accent,
                  color: C.bg,
                  padding: "16px 36px",
                  fontFamily: FONT_LABEL,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Découvrir les Collections <ArrowRight size={14} />
              </button>
              <button onClick={() => document.getElementById("bespoke")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.03, borderColor: C.accent, color: C.accent }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${C.borderGold}`,
                  color: C.textMuted,
                  padding: "16px 36px",
                  fontFamily: FONT_LABEL,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                Sur Mesure <Gem size={14} />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <ChevronDown size={20} color={C.textMuted} />
        </motion.div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        style={{
          padding: "100px 48px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.borderGold}`,
          borderBottom: `1px solid ${C.borderGold}`,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              style={{
                textAlign: "center",
                padding: "40px 20px",
                borderRight: i < 3 ? `1px solid ${C.borderGold}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: 300,
                  color: C.accent,
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontFamily: FONT_LABEL,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.textMuted,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS ─────────────────────────────────────────────────── */}
      <section
        id="collections"
        ref={collectionsRef}
        style={{ padding: "120px 48px", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={collectionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              Nos Créations
            </p>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 300,
                color: C.text,
                lineHeight: 1.1,
              }}
            >
              Collections <em style={{ color: C.accent }}>Exclusives</em>
            </h2>
          </motion.div>

          {/* Collection filter tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 64, borderBottom: `1px solid ${C.borderGold}` }}>
            {COLLECTIONS.map((col) => (
              <motion.button
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                whileHover={{ color: C.accent }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeCollection === col.id ? `1px solid ${C.accent}` : "1px solid transparent",
                  color: activeCollection === col.id ? C.accent : C.textMuted,
                  fontFamily: FONT_LABEL,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "14px 32px",
                  cursor: "pointer",
                  marginBottom: -1,
                  transition: "all 0.3s",
                }}
              >
                {col.label}
              </motion.button>
            ))}
          </div>

          {/* Pieces grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCollection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
            >
              {currentCollection.pieces.map((piece, i) => (
                <motion.div
                  key={piece.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onHoverStart={() => setHoveredPiece(i)}
                  onHoverEnd={() => setHoveredPiece(null)}
                  style={{
                    background: hoveredPiece === i ? C.bgCard : C.bgAlt,
                    border: `1px solid ${hoveredPiece === i ? C.borderGold : C.border}`,
                    padding: "40px",
                    cursor: "pointer",
                    transition: "all 0.4s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {piece.limited && (
                    <div
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        fontFamily: FONT_LABEL,
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.bg,
                        background: C.accent,
                        padding: "4px 10px",
                      }}
                    >
                      Pièce unique
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0 }}>
                      <GemStoneSVG type={piece.gem} size={80} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: FONT_LABEL,
                          fontSize: 9,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: C.textMuted,
                          marginBottom: 8,
                        }}
                      >
                        {piece.subtitle}
                      </p>
                      <h3
                        style={{
                          fontFamily: FONT_HEADING,
                          fontSize: 28,
                          fontWeight: 300,
                          color: C.text,
                          marginBottom: 8,
                          fontStyle: "italic",
                        }}
                      >
                        {piece.name}
                      </h3>
                      <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                        {piece.desc}
                      </p>
                      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <span style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted }}>
                            Pierre
                          </span>
                          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.accent }}>{piece.stone}</p>
                        </div>
                        <div>
                          <span style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted }}>
                            Métal
                          </span>
                          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.text }}>{piece.metal}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <p
                            style={{
                              fontFamily: FONT_HEADING,
                              fontSize: 26,
                              fontWeight: 300,
                              color: C.accent,
                            }}
                          >
                            {piece.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {hoveredPiece === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.borderGold}`, display: "flex", gap: 16 }}
                      >
                        <button
                          style={{
                            flex: 1,
                            background: C.accent,
                            border: "none",
                            color: C.bg,
                            fontFamily: FONT_LABEL,
                            fontSize: 10,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            padding: "12px 20px",
                            cursor: "pointer",
                          }}
                        >
                          Consulter
                        </button>
                        <button
                          style={{
                            padding: "12px 20px",
                            background: "none",
                            border: `1px solid ${C.borderGold}`,
                            color: C.textMuted,
                            fontFamily: FONT_LABEL,
                            fontSize: 10,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                          }}
                        >
                          En savoir plus
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────────── */}
      <section
        id="bespoke"
        ref={processRef}
        style={{ padding: "120px 48px", background: C.bgAlt, borderTop: `1px solid ${C.borderGold}` }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              Notre Démarche
            </p>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.text,
                lineHeight: 1.1,
              }}
            >
              L'Expérience <em style={{ color: C.accent }}>Sur Mesure</em>
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PROCESS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={processInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                style={{
                  display: "flex",
                  gap: 48,
                  alignItems: "flex-start",
                  padding: "40px 0",
                  borderBottom: i < PROCESS.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 80,
                    fontWeight: 300,
                    color: C.borderGold,
                    lineHeight: 0.8,
                    flexShrink: 0,
                    width: 100,
                    textAlign: "center",
                  }}
                >
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 28,
                      fontWeight: 300,
                      color: C.text,
                      marginBottom: 12,
                      fontStyle: "italic",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.textMuted, lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{ textAlign: "center", marginTop: 64 }}
          >
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              whileHover={{ scale: 1.03, background: C.accentLight }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: C.accent,
                color: C.bg,
                padding: "16px 40px",
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Démarrer mon projet <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────── */}
      <section
        ref={teamRef}
        style={{ padding: "120px 48px", background: C.bg }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              Les Artisans
            </p>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.text,
                lineHeight: 1.1,
              }}
            >
              Maîtres <em style={{ color: C.accent }}>d'Excellence</em>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                style={{
                  background: C.bgAlt,
                  border: `1px solid ${C.border}`,
                  padding: "40px 28px",
                  transition: "all 0.3s",
                }}
              >
                {/* Avatar placeholder */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: `1px solid ${C.borderGold}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    background: C.bgCard,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 28,
                      fontWeight: 300,
                      color: C.accent,
                      fontStyle: "italic",
                    }}
                  >
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 20,
                    fontWeight: 400,
                    color: C.text,
                    marginBottom: 4,
                    fontStyle: "italic",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontFamily: FONT_LABEL,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: 16,
                  }}
                >
                  {member.role}
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 16 }}>
                  {member.bio}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={12} color={C.accentDark} />
                  <span style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.textMuted }}>
                    {member.exp} d'expérience
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        ref={testimonialsRef}
        style={{
          padding: "120px 48px",
          background: C.bgAlt,
          borderTop: `1px solid ${C.borderGold}`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              Témoignages
            </p>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.text,
              }}
            >
              Ils nous font <em style={{ color: C.accent }}>confiance</em>
            </h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.borderGold}`,
                  padding: "60px 64px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
                  {Array(TESTIMONIALS[activeTestimonial].note).fill(0).map((_, i) => (
                    <Star key={i} size={16} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: "clamp(18px, 2.5vw, 26px)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: C.text,
                    lineHeight: 1.6,
                    marginBottom: 40,
                  }}
                >
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 400, color: C.accent, marginBottom: 4 }}>
                    {TESTIMONIALS[activeTestimonial].name}
                  </p>
                  <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted }}>
                    {TESTIMONIALS[activeTestimonial].role}
                  </p>
                  <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accentDark, marginTop: 8 }}>
                    — {TESTIMONIALS[activeTestimonial].piece}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                style={{
                  width: 44,
                  height: 44,
                  border: `1px solid ${C.borderGold}`,
                  background: "none",
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {TESTIMONIALS.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    animate={{
                      width: i === activeTestimonial ? 24 : 8,
                      background: i === activeTestimonial ? C.accent : C.border,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: 2,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                style={{
                  width: 44,
                  height: 44,
                  border: `1px solid ${C.borderGold}`,
                  background: "none",
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        ref={faqRef}
        style={{ padding: "120px 48px", background: C.bg }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
              Questions
            </p>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: C.text,
              }}
            >
              Vos <em style={{ color: C.accent }}>Interrogations</em>
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                  }}
                >
                  <span style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 400, color: C.text, fontStyle: "italic" }}>
                    {item.q}
                  </span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.3 }}>
                    <Plus size={16} color={C.accent} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 28px 24px", borderTop: `1px solid ${C.border}` }}>
                        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.7, paddingTop: 16 }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          padding: "140px 48px",
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${C.bgCard} 100%)`,
          borderTop: `1px solid ${C.borderGold}`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gems */}
        <div style={{ position: "absolute", top: 40, left: 60, opacity: 0.15 }}>
          <GemStoneSVG type="ruby" size={80} animated={false} />
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 80, opacity: 0.15 }}>
          <GemStoneSVG type="sapphire" size={100} animated={false} />
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 24 }}
          >
            Rendez-vous Privé
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 300,
              color: C.text,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Créons ensemble votre <em style={{ color: C.accent }}>chef-d'œuvre</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              fontStyle: "italic",
              color: C.textMuted,
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            Notre équipe vous reçoit en toute discrétion à Paris 1er, Monaco ou directement chez vous. Consultation sans engagement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.03, background: C.accentLight }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: C.accent,
                border: "none",
                color: C.bg,
                padding: "16px 40px",
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Prendre rendez-vous <ArrowRight size={14} />
            </motion.button>
            <motion.a
              href="tel:+33142881887"
              whileHover={{ scale: 1.03, color: C.accent }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${C.borderGold}`,
                color: C.textMuted,
                padding: "16px 40px",
                fontFamily: FONT_LABEL,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              <Phone size={14} /> +33 1 42 88 18 87
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.borderGold}`,
          padding: "64px 48px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 300, color: C.accent, letterSpacing: "0.12em" }}>
                  AURELIUS HERITAGE
                </p>
                <p style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.35em", color: C.textMuted, textTransform: "uppercase" }}>
                  Joaillerie & Horlogerie · Est. 1887
                </p>
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.7, maxWidth: 300 }}>
                Maison parisienne perpétuant l'art du bijou d'exception et de l'horlogerie de prestige depuis cinq générations.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                {[MessageSquare, Camera, Link2].map((Icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15, color: C.accent }}
                    style={{
                      width: 36,
                      height: 36,
                      border: `1px solid ${C.border}`,
                      background: "none",
                      color: C.textMuted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "color 0.3s",
                    }}
                  >
                    <Icon size={14} />
                  </motion.button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Collections",
                links: ["Haute Joaillerie", "Horlogerie de Prestige", "Sur Mesure", "Alliances & Fiançailles"],
              },
              {
                title: "Maison",
                links: ["Notre Histoire", "L'Atelier", "Gemmologie", "Presse"],
              },
              {
                title: "Services",
                links: ["Consultation Privée", "Livraison Sécurisée", "Entretien & SAV", "Estimation"],
              },
            ].map((col, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: FONT_LABEL,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: 20,
                  }}
                >
                  {col.title}
                </p>
                {col.links.map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    whileHover={{ color: C.accent, x: 4 }}
                    style={{
                      display: "block",
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      color: C.textMuted,
                      textDecoration: "none",
                      marginBottom: 12,
                      transition: "color 0.2s",
                    }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 32,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.textMuted, letterSpacing: "0.1em" }}>
              © 2026 Aurelius Heritage SAS — 14 Place Vendôme, 75001 Paris
            </p>
            <div style={{ display: "flex", gap: 28 }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ color: C.accent }}
                  style={{
                    fontFamily: FONT_LABEL,
                    fontSize: 10,
                    color: C.textMuted,
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    transition: "color 0.2s",
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
