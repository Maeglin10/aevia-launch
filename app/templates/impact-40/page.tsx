"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Leaf,
  ShoppingBasket,
  Sun,
  Snowflake,
  Flower2,
  TreeDeciduous,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Check,
  Star,
  ArrowRight,
  Clock,
  Package,
  Users,
  Heart,
  Menu,
  X,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#fdf9ee",
  bgAlt: "#f5efdc",
  bgDark: "#2d5016",
  text: "#1a2e08",
  textLight: "#5a6e48",
  textMuted: "#8a9a78",
  accent: "#f0c040",
  accentDark: "#c8a020",
  earth: "#8b5e3c",
  earthLight: "#b8845a",
  white: "#ffffff",
  border: "#ddd5ba",
  shadow: "rgba(45, 80, 22, 0.12)",
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'Merriweather Sans', system-ui, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const seasons = ["spring", "summer", "fall", "winter"] as const;
type Season = (typeof seasons)[number];

const seasonData: Record<
  Season,
  { label: string; icon: React.ReactNode; color: string; items: { name: string; desc: string; emoji: string }[] }
> = {
  spring: {
    label: "Printemps",
    icon: <Flower2 size={18} />,
    color: "#7bb85a",
    items: [
      { name: "Asperges vertes", desc: "Tendres et croquantes, récoltées à l'aube", emoji: "🌿" },
      { name: "Radis multicolores", desc: "Rose, blanc et violet — croquant garanti", emoji: "🌈" },
      { name: "Épinards baby", desc: "Doux et riches en fer, parfaits crus", emoji: "🥬" },
      { name: "Petits pois", desc: "Sucrés et frais, à croquer directement", emoji: "🫛" },
      { name: "Fraises Gariguette", desc: "Parfumées et juteuses, cuites au soleil", emoji: "🍓" },
      { name: "Ail des ours", desc: "Sauvage, récolté dans nos bois adjacents", emoji: "🌱" },
    ],
  },
  summer: {
    label: "Été",
    icon: <Sun size={18} />,
    color: "#f0c040",
    items: [
      { name: "Tomates anciennes", desc: "12 variétés — noir de Crimée, Green Zebra, Cœur de bœuf", emoji: "🍅" },
      { name: "Courgettes", desc: "Rondes et longues, cueillie avant maturité", emoji: "🥒" },
      { name: "Maïs doux", desc: "Bicolore, à cuire le jour même", emoji: "🌽" },
      { name: "Melons charentais", desc: "Sucrés et odorants, elevés sous filets", emoji: "🍈" },
      { name: "Haricots verts fins", desc: "Croquants, sans fil, récoltés à la main", emoji: "🫘" },
      { name: "Basilic grand vert", desc: "Aromatique et copieux, en bouquet", emoji: "🌿" },
    ],
  },
  fall: {
    label: "Automne",
    icon: <TreeDeciduous size={18} />,
    color: "#c4703a",
    items: [
      { name: "Courges Butternut", desc: "Fondantes et sucrées, parfaites en velouté", emoji: "🎃" },
      { name: "Pommes reinette", desc: "Acidulées et croquantes, verger biologique", emoji: "🍎" },
      { name: "Champignons cultivés", desc: "Shiitake, pleurotes et Paris rosé", emoji: "🍄" },
      { name: "Poireaux", desc: "Doux et tendres, blancs sur 30 cm", emoji: "🧅" },
      { name: "Noix fraîches", desc: "Récoltées de nos noyers centenaires", emoji: "🪨" },
      { name: "Betteraves chioggia", desc: "Rayées rose et blanc, crues ou rôties", emoji: "🟣" },
    ],
  },
  winter: {
    label: "Hiver",
    icon: <Snowflake size={18} />,
    color: "#6ea8d0",
    items: [
      { name: "Choux de Bruxelles", desc: "Tendres et légèrement sucrés après gelée", emoji: "🥦" },
      { name: "Carottes de sable", desc: "Extra-sucrées, élevées en pleine terre", emoji: "🥕" },
      { name: "Endives bressanes", desc: "Blanches et tendres, culture traditionnelle", emoji: "🌿" },
      { name: "Mâche", desc: "Douce et délicate, sans assaisonnement", emoji: "🥗" },
      { name: "Topinambours", desc: "Rustiques et gourmands, en velouté ou sautés", emoji: "🌰" },
      { name: "Céleris-raves", desc: "Denses et parfumés, crus en rémoulade", emoji: "⚪" },
    ],
  },
};

const testimonials = [
  {
    name: "Marie-Claire Dubois",
    role: "Abonnée depuis 3 ans",
    text: "Mes enfants mangent désormais des légumes qu'ils refusaient avant. La qualité de Terre Vivante a transformé notre façon de cuisiner. Chaque panier est une surprise joyeuse.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Chef Antoine Moreau",
    role: "Restaurant L'Ardoise, Lyon",
    text: "En tant que chef, j'ai besoin de produits irréprochables. Terre Vivante est mon seul fournisseur de légumes depuis deux ans. La traçabilité et la fraîcheur sont incomparables.",
    rating: 5,
    avatar: "AM",
  },
  {
    name: "Sophie & Pierre Leclerc",
    role: "Famille de 4, abonnés 18 mois",
    text: "Le panier famille est parfaitement calibré. On ne gaspille plus rien car tout est frais et nos recettes sont guidées par les saisons. Un vrai retour aux sources.",
    rating: 5,
    avatar: "SP",
  },
];

const plans = [
  {
    name: "Panier Solo",
    price: "28",
    freq: "/ semaine",
    desc: "Idéal pour 1–2 personnes",
    items: [
      "5–6 variétés de légumes",
      "1 bouquet d'herbes aromatiques",
      "Fruits de saison (500 g)",
      "Fiche recette hebdomadaire",
    ],
    color: C.accent,
    textColor: C.bgDark,
    popular: false,
  },
  {
    name: "Panier Famille",
    price: "48",
    freq: "/ semaine",
    desc: "Parfait pour 3–5 personnes",
    items: [
      "8–10 variétés de légumes",
      "2 bouquets d'herbes aromatiques",
      "Fruits de saison (1,5 kg)",
      "Fiche recette + livret mensuel",
      "Œufs de poules élevées sur site (6)",
      "Accès prioritaire aux surplus",
    ],
    color: C.bgDark,
    textColor: C.bg,
    popular: true,
  },
  {
    name: "Panier Restaurateur",
    price: "120",
    freq: "/ semaine",
    desc: "Pour professionnels exigeants",
    items: [
      "15–20 variétés sur mesure",
      "Herbes fraîches à la demande",
      "Fruits et fleurs comestibles",
      "Livraison mardi + vendredi",
      "Commande personnalisée J−5",
      "Facturation mensuelle",
      "Accès récolte sur place",
    ],
    color: C.earth,
    textColor: C.white,
    popular: false,
  },
];

const faqs = [
  {
    q: "Comment fonctionne l'abonnement AMAP ?",
    a: "Vous vous engagez sur 6 mois minimum. Chaque semaine, votre panier est prêt le jeudi matin. Vous pouvez le récupérer à la ferme ou opter pour la livraison (rayon 30 km, incluse dans le Panier Famille).",
  },
  {
    q: "Puis-je personnaliser le contenu du panier ?",
    a: "Le panier Solo et Famille suivent notre sélection saisonnière. Le panier Restaurateur est entièrement personnalisable 5 jours à l'avance. Pour les allergies, contactez-nous et nous adaptons au mieux.",
  },
  {
    q: "La ferme est-elle certifiée bio ?",
    a: "Oui, certifiée Agriculture Biologique depuis 2008 par Écocert. Nous allons au-delà du bio avec des pratiques biodynamiques sur 40 % de nos parcelles et aucun intrant chimique depuis 1998.",
  },
  {
    q: "Que se passe-t-il si je suis absent ?",
    a: "Prévenez-nous avant le lundi soir. Vous pouvez suspendre jusqu'à 4 semaines par an sans frais, désigner un voisin pour récupérer votre panier, ou reporter à la semaine suivante.",
  },
  {
    q: "Proposez-vous des visites de la ferme ?",
    a: "Absolument ! Chaque premier samedi du mois, nous organisons des portes ouvertes gratuites. Nos abonnés peuvent aussi visiter librement pendant les horaires de récolte (7 h–12 h).",
  },
  {
    q: "Comment stocker les légumes pour qu'ils restent frais ?",
    a: "Chaque panier est accompagné de conseils de conservation adaptés. En général : légumes-feuilles au réfrigérateur dans un linge humide, courges et tomates à température ambiante, racines dans le bac à légumes.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function GrowingPlant({ progress }: { progress: ReturnType<typeof useTransform> }) {
  const leafOpacity = useTransform(progress, [0.05, 0.35], [0, 1]);
  const leaf2Opacity = useTransform(progress, [0.2, 0.5], [0, 1]);
  const flowerOpacity = useTransform(progress, [0.35, 0.65], [0, 1]);
  const stemScaleY = useTransform(progress, [0, 0.5], [0, 1]);

  return (
    <svg width="160" height="220" viewBox="0 0 160 220" style={{ overflow: "visible" }}>
      <ellipse cx="80" cy="200" rx="55" ry="9" fill={C.earth} opacity={0.25} />
      {/* Stem with scaleY from bottom */}
      <motion.g style={{ originY: "200px", scaleY: stemScaleY }}>
        <line x1="80" y1="200" x2="80" y2="72" stroke={C.bgDark} strokeWidth="4.5" strokeLinecap="round" />
      </motion.g>
      {/* Left leaf */}
      <motion.path
        d="M80 148 C58 136 36 142 42 158 C52 170 76 158 80 148Z"
        fill="#3a6e1a"
        style={{ opacity: leafOpacity }}
      />
      {/* Right leaf */}
      <motion.path
        d="M80 112 C102 100 126 106 120 122 C110 134 84 122 80 112Z"
        fill="#4a8022"
        style={{ opacity: leaf2Opacity }}
      />
      {/* Flower petals */}
      <motion.g style={{ opacity: flowerOpacity }}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <ellipse
            key={i}
            cx={80 + 14 * Math.cos((deg * Math.PI) / 180)}
            cy={72 + 14 * Math.sin((deg * Math.PI) / 180)}
            rx="7"
            ry="5"
            fill={C.accentDark}
            opacity={0.7}
            transform={`rotate(${deg} ${80 + 14 * Math.cos((deg * Math.PI) / 180)} ${72 + 14 * Math.sin((deg * Math.PI) / 180)})`}
          />
        ))}
        <circle cx="80" cy="72" r="9" fill={C.accent} />
        <circle cx="80" cy="72" r="4.5" fill={C.accentDark} />
      </motion.g>
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "1.1rem 0",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: C.headingFont, fontSize: "1.05rem", color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, marginTop: 2 }}>
          <ChevronDown size={20} color={C.textLight} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.8, paddingBottom: "1.1rem" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function TerreVivantePage() {
  const [activeSeason, setActiveSeason] = useState<Season>("spring");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const plantProgress = useTransform(scrollYProgress, [0, 0.65], [0, 1]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Produits", href: "#produits" },
    { label: "Notre histoire", href: "#histoire" },
    { label: "Paniers", href: "#paniers" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? "0.7rem 2.5rem" : "1.3rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled ? "rgba(253,249,238,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled ? `0 1px 24px ${C.shadow}` : "none",
          transition: "all 0.38s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div
            style={{
              width: 38, height: 38,
              borderRadius: "50%",
              backgroundColor: C.bgDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Leaf size={18} color={C.accent} />
          </div>
          <span style={{ fontFamily: C.headingFont, fontSize: "1.4rem", fontWeight: 700, color: scrolled ? C.bgDark : C.bg }}>
            Terre Vivante
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.88rem",
                color: scrolled ? C.textLight : "rgba(253,249,238,0.8)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolled ? C.bgDark : C.accent)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = scrolled ? C.textLight : "rgba(253,249,238,0.8)")}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tarifs"
            style={{
              backgroundColor: C.bgDark,
              color: C.accent,
              padding: "0.55rem 1.35rem",
              borderRadius: "2rem",
              textDecoration: "none",
              fontSize: "0.87rem",
              fontWeight: 700,
              fontFamily: C.bodyFont,
            }}
          >
            S'abonner
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
          aria-label="Menu"
        >
          {menuOpen ? <X color={scrolled ? C.bgDark : C.bg} size={24} /> : <Menu color={scrolled ? C.bgDark : C.bg} size={24} />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: "fixed",
              top: 64, left: 0, right: 0,
              zIndex: 99,
              backgroundColor: C.bg,
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxShadow: `0 8px 32px ${C.shadow}`,
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: C.text, textDecoration: "none", fontSize: "1.05rem", fontFamily: C.bodyFont, fontWeight: 500 }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#tarifs"
              onClick={() => setMenuOpen(false)}
              style={{
                backgroundColor: C.bgDark,
                color: C.accent,
                padding: "0.7rem 1.5rem",
                borderRadius: "2rem",
                textDecoration: "none",
                fontWeight: 700,
                fontFamily: C.bodyFont,
                textAlign: "center",
              }}
            >
              S'abonner
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          backgroundColor: C.bgDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "5rem",
        }}
      >
        {/* Background rings */}
        {[340, 220, 120].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "12%",
              right: `${6 + i * 5}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1.5px solid rgba(240,192,64,${0.08 + i * 0.04})`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Texture dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(240,192,64,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 860, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-block",
              backgroundColor: "rgba(240,192,64,0.12)",
              border: `1px solid rgba(240,192,64,0.35)`,
              color: C.accent,
              padding: "0.35rem 1.1rem",
              borderRadius: "2rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
              fontFamily: C.bodyFont,
            }}
          >
            Ferme biologique certifiée Écocert depuis 2008
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14 }}
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(3rem, 7.5vw, 5.8rem)",
              fontWeight: 700,
              color: C.bg,
              lineHeight: 1.08,
              marginBottom: "1.5rem",
            }}
          >
            De nos champs<br />
            <span style={{ color: C.accent }}>à votre table</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.12rem",
              color: "rgba(253,249,238,0.72)",
              maxWidth: 560,
              margin: "0 auto 2.75rem",
              lineHeight: 1.8,
            }}
          >
            Terre Vivante cultive 85 variétés de légumes, fruits et herbes dans le Beaujolais. Chaque panier raconte la saison, cueilli le matin même.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="#tarifs"
              style={{
                backgroundColor: C.accent,
                color: C.bgDark,
                padding: "1rem 2.4rem",
                borderRadius: "3rem",
                textDecoration: "none",
                fontWeight: 800,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 8px 32px rgba(240,192,64,0.32)",
              }}
            >
              Choisir mon panier <ArrowRight size={16} />
            </a>
            <a
              href="#histoire"
              style={{
                border: `2px solid rgba(253,249,238,0.28)`,
                color: C.bg,
                padding: "1rem 2.4rem",
                borderRadius: "3rem",
                textDecoration: "none",
                fontWeight: 600,
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
              }}
            >
              Notre histoire
            </a>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.58 }}
            style={{ display: "flex", gap: "3rem", justifyContent: "center", marginTop: "4rem", flexWrap: "wrap" }}
          >
            {[
              { val: "85", label: "variétés cultivées" },
              { val: "320", label: "familles abonnées" },
              { val: "28 ha", label: "de terres bio" },
              { val: "26 ans", label: "d'agriculture durable" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "2.1rem", fontWeight: 700, color: C.accent }}>{s.val}</div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.55)", marginTop: "0.2rem", letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated plant */}
        <div style={{ position: "absolute", right: "5%", bottom: "8%", zIndex: 3 }}>
          <GrowingPlant progress={plantProgress} />
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          <ChevronDown color={C.accent} size={30} opacity={0.55} />
        </motion.div>
      </section>

      {/* ── SEASONAL PRODUCE ── */}
      <section id="produits" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                Nos saisons
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.text, marginTop: "0.6rem", marginBottom: "1rem", fontWeight: 700 }}>
                Produits du moment
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
                Nous cultivons en harmonie avec les cycles naturels. Découvrez ce que la terre offre aujourd'hui.
              </p>
            </div>
          </SectionReveal>

          {/* Season tabs */}
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
              {seasons.map((s) => {
                const sd = seasonData[s];
                const isActive = activeSeason === s;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSeason(s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.6rem 1.5rem",
                      borderRadius: "2rem",
                      border: `2px solid ${isActive ? sd.color : C.border}`,
                      backgroundColor: isActive ? sd.color : "transparent",
                      color: isActive ? C.white : C.textLight,
                      fontFamily: C.bodyFont,
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {sd.icon}
                    {sd.label}
                  </button>
                );
              })}
            </div>
          </SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSeason}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.25rem" }}
            >
              {seasonData[activeSeason].items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -5, boxShadow: `0 16px 44px ${C.shadow}` }}
                  style={{
                    backgroundColor: C.white,
                    borderRadius: "1.35rem",
                    padding: "1.6rem",
                    border: `1px solid ${C.border}`,
                    cursor: "default",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{item.emoji}</div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.05rem", color: C.text, fontWeight: 700, marginBottom: "0.45rem" }}>
                    {item.name}
                  </h3>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.65 }}>{item.desc}</p>
                  <div style={{ marginTop: "1.1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: seasonData[activeSeason].color }} />
                    <span style={{ fontSize: "0.77rem", color: seasonData[activeSeason].color, fontWeight: 700, fontFamily: C.bodyFont }}>
                      {seasonData[activeSeason].label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section id="histoire" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "5rem", alignItems: "center" }}>
            <SectionReveal>
              <div
                style={{
                  backgroundColor: C.bgDark,
                  borderRadius: "2rem",
                  padding: "3.5rem 3rem",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 380,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* decorative bars */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06 }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        width: 3,
                        height: `${35 + i * 14}px`,
                        backgroundColor: C.accent,
                        left: `${10 + i * 14}%`,
                        bottom: 0,
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  ))}
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: C.headingFont, fontSize: "4rem", color: C.accent, fontWeight: 700, lineHeight: 1 }}>1998</div>
                  <div style={{ fontFamily: C.bodyFont, color: "rgba(253,249,238,0.6)", fontSize: "0.88rem", marginTop: "0.4rem" }}>
                    Année de fondation de Terre Vivante
                  </div>
                </div>
                <div style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 2 }}>
                  <Heart size={26} color={C.accent} fill={C.accent} opacity={0.55} />
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.14}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                Notre histoire
              </span>
              <h2
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)",
                  color: C.text,
                  fontWeight: 700,
                  margin: "0.75rem 0 1.35rem",
                  lineHeight: 1.2,
                }}
              >
                26 ans de passion pour la terre vivante
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.94rem", marginBottom: "1.25rem" }}>
                En 1998, Brigitte et Jean-Paul Forestier quittent leurs métiers de comptable et d'ingénieur pour acquérir 12 hectares de terres argilo-calcaires dans le Beaujolais. Sans expérience agricole mais avec une conviction profonde : nourrir leur communauté de façon honnête.
              </p>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.85, fontSize: "0.94rem", marginBottom: "2.25rem" }}>
                Aujourd'hui, leurs fils Pierre et Mathieu cultivent 28 hectares, maintenant des variétés anciennes en voie de disparition, pratiquant la biodynamie et accueillant 400 familles dans leur AMAP chaque année.
              </p>
              <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap" }}>
                {[
                  { icon: <MapPin size={16} />, label: "Lancié, Beaujolais" },
                  { icon: <Users size={16} />, label: "Famille Forestier" },
                  { icon: <Package size={16} />, label: "AMAP depuis 2006" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: C.earth }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.84rem", color: C.textLight, fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── CSA BOX CONTENTS ── */}
      <section id="paniers" style={{ padding: "7rem 2rem", backgroundColor: C.bgDark }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.9rem)", color: C.bg, fontWeight: 700, marginBottom: "1rem" }}>
                Ce que contient votre panier
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: "rgba(253,249,238,0.6)", fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
                Chaque panier est une surprise préparée avec amour, reflet fidèle de ce que la semaine a donné.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Leaf size={22} />, title: "Légumes de saison", desc: "5 à 10 variétés, récoltées le matin de la livraison", accent: "#7bb85a" },
              { icon: <Sun size={22} />, title: "Fruits frais", desc: "500 g à 2 kg selon la saison et le panier choisi", accent: C.accent },
              { icon: <Flower2 size={22} />, title: "Herbes aromatiques", desc: "1 à 2 bouquets : basilic, thym, coriandre, persil…", accent: "#b8d4a0" },
              { icon: <Heart size={22} />, title: "Surprise du producteur", desc: "Un produit transformé : confiture, sirop, tapenade…", accent: C.earthLight },
              { icon: <Package size={22} />, title: "Fiche recette", desc: "2 recettes hebdomadaires adaptées au contenu du panier", accent: "#6ea8d0" },
              { icon: <Clock size={22} />, title: "Bulletin de ferme", desc: "Actualités, calendrier des récoltes et dates de visites", accent: "#d4a0c0" },
            ].map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.08}>
                <div
                  style={{
                    backgroundColor: "rgba(253,249,238,0.05)",
                    border: "1px solid rgba(253,249,238,0.09)",
                    borderRadius: "1.35rem",
                    padding: "1.85rem",
                  }}
                >
                  <div style={{ color: item.accent, marginBottom: "1rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.05rem", color: C.bg, fontWeight: 700, marginBottom: "0.5rem" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: "rgba(253,249,238,0.55)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="temoignages" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                Témoignages
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.9rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0" }}>
                Ils ont rejoint notre communauté
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: C.white,
                    borderRadius: "1.6rem",
                    padding: "2.25rem",
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: `0 2px 20px ${C.shadow}`,
                  }}
                >
                  <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.35rem" }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={15} color={C.accent} fill={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.93rem", color: C.textLight, lineHeight: 1.82, flex: 1, fontStyle: "italic" }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                    <div
                      style={{
                        width: 46, height: 46,
                        borderRadius: "50%",
                        backgroundColor: C.bgDark,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: C.headingFont,
                        fontSize: "0.85rem",
                        color: C.accent,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{t.name}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.1rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                Abonnements CSA
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.9rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem" }}>
                Choisissez votre panier
              </h2>
              <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem" }}>
                Engagement 6 mois minimum — résiliation avec préavis 4 semaines.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem", alignItems: "start" }}>
            {plans.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: plan.color,
                    borderRadius: "1.85rem",
                    padding: "2.5rem",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: C.accent,
                        color: C.bgDark,
                        padding: "0.3rem 1.3rem",
                        borderRadius: "2rem",
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        fontFamily: C.bodyFont,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.05em",
                      }}
                    >
                      LE PLUS POPULAIRE
                    </div>
                  )}
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, color: plan.textColor, opacity: 0.6 }}>
                    {plan.desc}
                  </span>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.45rem", fontWeight: 700, color: plan.textColor, margin: "0.4rem 0 1rem" }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "2rem" }}>
                    <span style={{ fontFamily: C.headingFont, fontSize: "3.2rem", fontWeight: 700, color: plan.popular ? C.accent : plan.textColor }}>
                      {plan.price}€
                    </span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: plan.textColor, opacity: 0.65 }}>
                      {plan.freq}
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.25rem", flex: 1 }}>
                    {plan.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "0.8rem" }}>
                        <Check size={15} color={plan.popular ? C.accent : plan.textColor} style={{ flexShrink: 0, marginTop: "0.18rem" }} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: plan.textColor, opacity: 0.82, lineHeight: 1.55 }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    style={{
                      display: "block",
                      textAlign: "center",
                      backgroundColor: plan.popular ? C.accent : "rgba(255,255,255,0.15)",
                      color: plan.popular ? C.bgDark : plan.textColor,
                      padding: "0.95rem",
                      borderRadius: "1rem",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontFamily: C.bodyFont,
                      fontSize: "0.9rem",
                      border: plan.popular ? "none" : `2px solid rgba(255,255,255,0.25)`,
                    }}
                  >
                    Commencer l'abonnement
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.earth }}>
                Questions fréquentes
              </span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 4vw, 2.7rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 0" }}>
                Tout ce que vous devez savoir
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div>
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: C.bgDark, padding: "5rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.35rem" }}>
                <div
                  style={{
                    width: 38, height: 38,
                    borderRadius: "50%",
                    backgroundColor: "rgba(240,192,64,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Leaf size={18} color={C.accent} />
                </div>
                <span style={{ fontFamily: C.headingFont, fontSize: "1.25rem", color: C.bg, fontWeight: 700 }}>Terre Vivante</span>
              </div>
              <p style={{ fontFamily: C.bodyFont, fontSize: "0.86rem", color: "rgba(253,249,238,0.5)", lineHeight: 1.8, maxWidth: 290 }}>
                Ferme biologique familiale dans le Beaujolais depuis 1998. Nous cultivons la terre avec amour et la partageons avec notre communauté.
              </p>
              <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {[
                  { icon: <MapPin size={13} />, text: "Route de Belleville, 69220 Lancié" },
                  { icon: <Phone size={13} />, text: "04 74 66 08 31" },
                  { icon: <Mail size={13} />, text: "contact@terrevivante.fr" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.accent }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.45)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Navigation", links: ["Nos produits", "Notre histoire", "Paniers CSA", "Visites ferme"] },
              { title: "Abonnements", links: ["Panier Solo", "Panier Famille", "Panier Restaurateur", "Points de retrait"] },
              { title: "Infos", links: ["Certification bio", "Agenda récoltes", "Blog & recettes", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: C.headingFont, fontSize: "1rem", color: C.bg, fontWeight: 700, marginBottom: "1.35rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{ fontFamily: C.bodyFont, fontSize: "0.875rem", color: "rgba(253,249,238,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(253,249,238,0.45)")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(253,249,238,0.09)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.3)" }}>
              © 2026 Terre Vivante SARL. Tous droits réservés. SIRET 422 890 123 00034.
            </p>
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {["Mentions légales", "Confidentialité", "CGV"].map((l) => (
                <a key={l} href="#" style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.3)", textDecoration: "none" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
