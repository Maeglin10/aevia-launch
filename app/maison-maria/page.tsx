"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const C = {
  bg: "#fdfaf5",
  blush: "#f5e6da",
  dark: "#1a1412",
  rose: "#c4847a",
  roseLight: "#e8b4ad",
  roseDark: "#9d5f56",
  ivory: "#f7f2ea",
  ivoryDark: "#ede4d6",
  text: "#2d2220",
  textMuted: "#8a7570",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};


// Local photo path (starts with /) is returned as-is; otherwise build the
// Unsplash URL from a photo id. Lets the same template mix client photos and
// stock images.
function imgUrl(img: string, w = 800): string {
  return img.startsWith("/") ? img : `https://images.unsplash.com/${img}?q=80&w=${w}&auto=format&fit=crop`;
}

// Réservation — À REMPLACER par les vrais identifiants de la cliente.
// BOOKING_URL : son lien Calendly (ou Planity/Treatwell).
// PHONE_NUMBER : numéro au format international pour le lien d'appel.
const BOOKING_URL = "https://calendly.com/maison-maria/rendez-vous"; // TODO: vrai lien Calendly
const PHONE_NUMBER = "+33600000000"; // TODO: vrai numéro
const PHONE_DISPLAY = "06 00 00 00 00"; // TODO: numéro affiché

function openBooking() {
  if (typeof window !== "undefined") window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
}
function callSalon() {
  if (typeof window !== "undefined") window.location.href = `tel:${PHONE_NUMBER}`;
}

const SERVICES = [
  {
    id: 1,
    title: "Volume Russe",
    subtitle: "2h — 120€",
    description:
      "La signature Maison Maria. Pose de bouquets de cils ultra-fins pour un regard dense, fourni et glamour, tout en légèreté. Tenue impeccable jusqu'à 4 semaines.",
    icon: "✦",
    tag: "Best-seller",
  },
  {
    id: 2,
    title: "Méga Volume",
    subtitle: "2h15 — 130€",
    description:
      "Pour un regard spectaculaire et intense. Bouquets très fournis, effet maximal maîtrisé, parfait pour les événements et les amoureuses du glamour assumé.",
    icon: "◈",
    tag: "Luxe",
  },
  {
    id: 3,
    title: "Cil à Cil Classique",
    subtitle: "1h30 — 90€",
    description:
      "Un cil d'extension posé sur un cil naturel. Résultat élégant et naturel qui sublime votre regard sans artifice. L'effet mascara permanent.",
    icon: "❋",
    tag: "Naturel",
  },
  {
    id: 4,
    title: "Lifting de Cils",
    subtitle: "1h — 65€",
    description:
      "Vos cils naturels rehaussés et galbés, teinture incluse. Un regard ouvert et lumineux pendant 6 à 8 semaines, sans entretien quotidien.",
    icon: "◇",
    tag: "Tendance",
  },
  {
    id: 5,
    title: "Architecture Sourcils",
    subtitle: "45 min — 45€",
    description:
      "Restructuration complète, épilation au fil ou à la cire, teinture végétale. Des sourcils dessinés sur-mesure pour structurer et harmoniser votre visage.",
    icon: "✿",
    tag: "Populaire",
  },
  {
    id: 6,
    title: "Maquillage Longue Tenue",
    subtitle: "1h — 70€",
    description:
      "Un maquillage impeccable qui tient toute la journée et toute la soirée. Mariées, shooting, événements : votre regard sublimé, sans retouche.",
    icon: "⌘",
    tag: "Événement",
  },
];

const INGREDIENTS = [
  { name: "Cils Soie Premium", origin: "Corée du Sud", benefit: "Légèreté & tenue", img: "/maison-maria/6.jpg" },
  { name: "Colle Hypoallergénique", origin: "Qualité médicale", benefit: "Confort & respect de l'œil", img: "/maison-maria/7.jpg" },
  { name: "Teinture Végétale", origin: "France", benefit: "Sourcils intenses, sans agression", img: "/maison-maria/5.jpg" },
  { name: "Soin Fortifiant", origin: "Botanique", benefit: "Cils naturels nourris", img: "/maison-maria/4.jpg" },
];

const TEAM = [
  {
    name: "Maria",
    role: "Fondatrice & Experte du Regard",
    bio: "Spécialiste certifiée en extensions de cils et architecture de sourcils à Vénissieux. Maria sublime chaque regard avec précision, patience et un sens du détail rare. Chaque pose est sur-mesure, dans un cadre cocooning et bienveillant.",
    img: "/maison-maria/1.jpg",
    specialties: ["Volume russe", "Lifting de cils", "Architecture sourcils"],
  },
];

const TESTIMONIALS = [
  {
    text: "Un regard de rêve ! Le volume russe de Maria est d'une finesse incroyable, ça tient des semaines. Je ne mets plus jamais de mascara. Une vraie artiste du regard.",
    author: "Léa M.",
    role: "Cliente fidèle",
    rating: 5,
  },
  {
    text: "J'ai testé plein de salons à Lyon, et chez Maison Maria c'est une autre dimension. Pose précise, indolore, et le résultat est juste sublime. Je recommande à 1000%.",
    author: "Charlotte B.",
    role: "Vénissieux",
    rating: 5,
  },
  {
    text: "Le lifting de cils a complètement ouvert mon regard. Maria prend le temps, explique tout, et le cadre est ultra cosy. On se sent chouchoutée du début à la fin.",
    author: "Mathilde D.",
    role: "Cliente depuis 1 an",
    rating: 5,
  },
  {
    text: "Maria a fait mes cils et mon maquillage pour mon mariage. Tenue parfaite toute la journée, malgré les larmes de joie ! Un grand merci.",
    author: "Amélie R.",
    role: "Mariée, 2026",
    rating: 5,
  },
];

const PACKAGES = [
  {
    name: "Regard Signature",
    duration: "2h30",
    price: "150€",
    tag: "Le plus demandé",
    includes: ["Volume russe", "Architecture sourcils", "Teinture sourcils", "Conseils d'entretien"],
    color: C.rose,
    highlight: false,
  },
  {
    name: "Jour J",
    duration: "3h",
    price: "180€",
    tag: "Spécial Mariée",
    includes: ["Volume russe ou méga volume", "Architecture sourcils", "Maquillage longue tenue", "Essai inclus"],
    color: C.dark,
    highlight: true,
  },
  {
    name: "Naturel Chic",
    duration: "2h15",
    price: "120€",
    tag: "Effet naturel",
    includes: ["Lifting de cils", "Teinture cils", "Architecture sourcils", "Soin fortifiant"],
    color: C.rose,
    highlight: false,
  },
];

const MARQUEE_ITEMS = [
  "Extensions de Cils",
  "Volume Russe",
  "Lifting de Cils",
  "Architecture Sourcils",
  "Experte Certifiée",
  "Vénissieux · Lyon",
];

function useFonts() {
  useEffect(() => {
    const id = "fonts-impact-198";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

function TextReveal({
  children,
  delay = 0,
  style: externalStyle,
  animateOnMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  // Above-the-fold content (e.g. the hero title) is always visible on load, so
  // it should reveal on mount. whileInView/IntersectionObserver can miss the
  // very first element at the top of the page, leaving it stuck at opacity:0.
  animateOnMount?: boolean;
}) {
  // useInView (ref-based) is far more reliable than the declarative
  // whileInView, which intermittently failed to fire for headings and left
  // them stuck at opacity:0 (invisible). once:true keeps the reveal permanent.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = animateOnMount || inView;
  return (
    <div ref={ref} style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={show ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function MagneticButton({
  children,
  style: externalStyle,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    },
    [x, y]
  );
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return (
    <motion.button
      ref={ref}
      style={{ ...externalStyle, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({
  children,
  style: externalStyle,
  accentRgb,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentRgb?: string;
}) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);
  const handleMouseLeave = useCallback(
    () => setSpotlight((s) => ({ ...s, active: false })),
    []
  );
  const rgb = accentRgb || "196,132,122";
  const baseBg = externalStyle?.background || "#fff8f6";
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(${rgb},0.15) 0%, ${baseBg} 65%)`
          : baseBg,
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}

function MarqueeStrip({
  items,
  bg,
  color,
}: {
  items: string[];
  bg: string;
  color: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: bg, paddingTop: 18, paddingBottom: 18 }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              fontFamily: C.fontSans,
              fontWeight: 500,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: color,
                opacity: 0.5,
                display: "inline-block",
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServiceCard({ service }: { service: (typeof SERVICES)[0] }) {
  return (
    <SpotlightCard
      accentRgb="196,132,122"
      style={{
        background: "#fff8f6",
        border: `1px solid ${C.ivoryDark}`,
        borderRadius: 2,
        padding: "40px 36px",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
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
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: C.blush,
            color: C.roseDark,
            padding: "4px 10px",
            fontFamily: C.fontSans,
            fontWeight: 500,
          }}
        >
          {service.tag}
        </div>
        <div
          style={{
            fontSize: 28,
            marginBottom: 20,
            color: C.rose,
          }}
        >
          {service.icon}
        </div>
        <h3
          style={{
            fontFamily: C.font,
            fontWeight: 500,
            fontSize: 22,
            color: C.dark,
            marginBottom: 4,
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </h3>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 13,
            color: C.rose,
            marginBottom: 16,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          {service.subtitle}
        </div>
        <p
          style={{
            fontFamily: C.fontSans,
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.75,
            marginBottom: 24,
          }}
        >
          {service.description}
        </p>
        <button
          type="button"
          onClick={openBooking}
          aria-label={`Réserver — ${service.title}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: C.fontSans,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.rose,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Réserver
          <span style={{ fontSize: 16 }}>→</span>
        </button>
      </motion.div>
    </SpotlightCard>
  );
}

function IngredientCard({ ing }: { ing: (typeof INGREDIENTS)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <div style={{ height: 200, overflow: "hidden" }}>
        <img
          src={imgUrl(ing.img, 800)}
          alt={ing.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ background: C.ivory, padding: "20px 24px", border: `1px solid ${C.ivoryDark}`, borderTop: "none" }}>
        <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 500, color: C.dark, marginBottom: 2 }}>
          {ing.name}
        </div>
        <div style={{ fontFamily: C.fontSans, fontSize: 11, color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
          Origine · {ing.origin}
        </div>
        <div style={{ fontFamily: C.fontSans, fontSize: 13, color: C.rose, fontWeight: 500 }}>
          {ing.benefit}
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
            {Array.from({ length: TESTIMONIALS[active].rating }).map((_, i) => (
              <span key={i} style={{ color: C.rose, fontSize: 16 }}>★</span>
            ))}
          </div>
          <blockquote
            style={{
              fontFamily: C.font,
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontStyle: "italic",
              color: C.dark,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            "{TESTIMONIALS[active].text}"
          </blockquote>
          <div style={{ fontFamily: C.fontSans, fontWeight: 600, color: C.dark, fontSize: 14 }}>
            {TESTIMONIALS[active].author}
          </div>
          <div style={{ fontFamily: C.fontSans, color: C.textMuted, fontSize: 12, letterSpacing: "0.1em", marginTop: 4 }}>
            {TESTIMONIALS[active].role}
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? C.rose : C.ivoryDark,
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: (typeof PACKAGES)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      style={{
        background: pkg.highlight ? C.dark : "#fff",
        border: `2px solid ${pkg.highlight ? C.dark : C.ivoryDark}`,
        borderRadius: 2,
        padding: "40px 36px",
        position: "relative",
        overflow: "hidden",
        flex: "1 1 280px",
        minWidth: 260,
        maxWidth: 380,
      }}
    >
      {pkg.highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${C.rose}, ${C.roseLight})`,
          }}
        />
      )}
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: pkg.highlight ? C.roseLight : C.rose,
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        {pkg.tag}
      </div>
      <h3
        style={{
          fontFamily: C.font,
          fontSize: 28,
          fontWeight: 500,
          color: pkg.highlight ? "#fff" : C.dark,
          marginBottom: 4,
        }}
      >
        {pkg.name}
      </h3>
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 13,
          color: pkg.highlight ? "rgba(255,255,255,0.5)" : C.textMuted,
          marginBottom: 24,
        }}
      >
        Durée : {pkg.duration}
      </div>
      <div
        style={{
          fontFamily: C.font,
          fontSize: 42,
          fontWeight: 300,
          color: pkg.highlight ? "#fff" : C.dark,
          marginBottom: 28,
          lineHeight: 1,
        }}
      >
        {pkg.price}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {pkg.includes.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: pkg.highlight ? C.rose : C.blush,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 8, color: pkg.highlight ? "#fff" : C.rose }}>✓</span>
            </div>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 13,
                color: pkg.highlight ? "rgba(255,255,255,0.8)" : C.text,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={openBooking}
        style={{
          width: "100%",
          padding: "14px 24px",
          background: pkg.highlight ? C.rose : "transparent",
          border: `1.5px solid ${pkg.highlight ? C.rose : C.dark}`,
          color: pkg.highlight ? "#fff" : C.dark,
          fontFamily: C.fontSans,
          fontSize: 12,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
      >
        Réserver ce package
      </button>
    </motion.div>
  );
}

export default function MaisonMariaPage() {
  useFonts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Ingrédients", id: "ingredients" },
    { label: "L'Équipe", id: "team" },
    { label: "Avis", id: "testimonials" },
    { label: "Packages", id: "packages" },
  ];

  return (
    <div
      style={{
        background: C.bg,
        color: C.dark,
        fontFamily: C.fontSans,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Scroll progress */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          background: `linear-gradient(90deg, ${C.rose}, ${C.roseLight})`,
          width: progressWidth,
          zIndex: 1000,
          transformOrigin: "0%",
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(20px, 5vw, 80px)",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(253,250,245,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.ivoryDark}` : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 500,
            color: C.dark,
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
          onClick={() => scrollTo("hero")}
        >
          Maison Maria
        </div>

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            gap: 36,
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none",
                border: "none",
                fontFamily: C.fontSans,
                fontSize: 13,
                color: C.textMuted,
                cursor: "pointer",
                letterSpacing: "0.05em",
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.rose)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
            >
              {link.label}
            </button>
          ))}
          <MagneticButton
            onClick={openBooking}
            style={{
              background: C.rose,
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              fontFamily: C.fontSans,
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 1,
            }}
          >
            Réserver
          </MagneticButton>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
            padding: 4,
          }}
          className="hamburger"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 7 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              style={{
                display: "block",
                width: 24,
                height: 1.5,
                background: C.dark,
                borderRadius: 2,
              }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              background: "rgba(253,250,245,0.98)",
              backdropFilter: "blur(16px)",
              zIndex: 99,
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              borderBottom: `1px solid ${C.ivoryDark}`,
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: C.font,
                  fontSize: 22,
                  color: C.dark,
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>

      {/* Hero */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Parallax background */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-20% 0",
            y: heroY,
          }}
        >
          <img
            src="/maison-maria/1.jpg"
            alt="Maison Maria — extensions de cils Vénissieux"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
          />
          {/* Soft cream scrim — concentrated in the centre so the overlaid
              title/subtitle always read, while the photo stays visible at the
              edges. Avoids dark text disappearing on the dark eye area. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 70% at 50% 52%, rgba(253,250,245,0.86) 0%, rgba(253,250,245,0.62) 45%, rgba(253,250,245,0.42) 75%, rgba(253,250,245,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(253,250,245,0.2) 0%, rgba(253,250,245,0) 35%, rgba(253,250,245,0.55) 88%, rgba(253,250,245,0.95) 100%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 clamp(24px, 6vw, 100px)",
            opacity: heroOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              textTransform: "uppercase",
              color: C.rose,
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            Cils & Sourcils · Vénissieux, Lyon
          </motion.div>

          <TextReveal delay={0.3} animateOnMount>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(52px, 9vw, 120px)",
                fontWeight: 300,
                color: C.dark,
                lineHeight: 0.95,
                marginBottom: 0,
              }}
            >
              Le regard
            </h1>
          </TextReveal>
          <TextReveal delay={0.45} animateOnMount>
            <h1
              style={{
                fontFamily: C.font,
                fontStyle: "italic",
                fontSize: "clamp(52px, 9vw, 120px)",
                fontWeight: 300,
                color: C.rose,
                lineHeight: 0.95,
                marginBottom: 28,
              }}
            >
              sublimé
            </h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: C.textMuted,
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Extensions de cils, lifting et architecture de sourcils par une experte certifiée. Un regard sublimé, sur-mesure, dans un cadre cocooning à Vénissieux.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={openBooking}
              style={{
                background: C.dark,
                color: "#fff",
                border: "none",
                padding: "16px 40px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Prendre rendez-vous
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("services")}
              style={{
                background: "transparent",
                color: C.dark,
                border: `1.5px solid ${C.dark}`,
                padding: "16px 40px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Découvrir
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 9,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: C.textMuted,
            }}
          >
            Défiler
          </div>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${C.rose}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.rose} color="#fff" />

      {/* Services */}
      <section
        id="services"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.rose,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Nos Soins
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(46px, 6vw, 88px)",
                  fontWeight: 400,
                  color: C.dark,
                  lineHeight: 1.05,
                }}
              >
                Un regard pensé
                <br />
                <em>pour vous sublimer</em>
              </h2>
            </TextReveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients / Bio Products */}
      <section
        id="ingredients"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
          background: C.ivory,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
              marginBottom: 64,
            }}
          >
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.rose,
                    marginBottom: 16,
                    fontWeight: 500,
                  }}
                >
                  Le savoir-faire
                </div>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(40px, 5vw, 72px)",
                    fontWeight: 400,
                    color: C.dark,
                    lineHeight: 1.1,
                  }}
                >
                  La nature comme
                  <br />
                  <em>alliée beauté</em>
                </h2>
              </TextReveal>
            </div>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.8,
              }}
            >
              Maison Maria sélectionne des fournitures premium — cils en soie ultra-légers, colles hypoallergéniques de qualité médicale, teintures végétales. Chaque pose respecte vos cils naturels et la sensibilité de votre œil.
            </motion.p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: 24,
            }}
          >
            {INGREDIENTS.map((ing) => (
              <IngredientCard key={ing.name} ing={ing} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.rose,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                La Fondatrice
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(42px, 5.5vw, 76px)",
                  fontWeight: 400,
                  color: C.dark,
                }}
              >
                L'experte de votre <em>regard</em>
              </h2>
            </TextReveal>
          </div>

          {/* Team tabs — shown only when there is more than one member */}
          {TEAM.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 0,
                justifyContent: "center",
                marginBottom: 48,
                borderBottom: `1px solid ${C.ivoryDark}`,
              }}
            >
              {TEAM.map((member, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTeam(i)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${activeTeam === i ? C.rose : "transparent"}`,
                    padding: "12px 24px",
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    color: activeTeam === i ? C.rose : C.textMuted,
                    cursor: "pointer",
                    transition: "all 0.25s",
                    fontWeight: activeTeam === i ? 600 : 400,
                    marginBottom: -1,
                  }}
                >
                  {member.name.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              style={{
                display: "grid",
                gridTemplateColumns: "400px 1fr",
                gap: 64,
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={imgUrl(TEAM[activeTeam].img, 800)}
                  alt={TEAM[activeTeam].name}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    objectPosition: "center 28%",
                    display: "block",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: -16,
                    width: 80,
                    height: 80,
                    background: C.blush,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    color: C.rose,
                  }}
                >
                  ✦
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.rose,
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  {TEAM[activeTeam].role}
                </div>
                <h3
                  style={{
                    fontFamily: C.font,
                    fontSize: 44,
                    fontWeight: 400,
                    color: C.dark,
                    marginBottom: 20,
                    lineHeight: 1.1,
                  }}
                >
                  {TEAM[activeTeam].name}
                </h3>
                <p
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 15,
                    color: C.textMuted,
                    lineHeight: 1.8,
                    marginBottom: 32,
                  }}
                >
                  {TEAM[activeTeam].bio}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {TEAM[activeTeam].specialties.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 12,
                        color: C.roseDark,
                        background: C.blush,
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
          background: C.blush,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.roseDark,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Témoignages
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(42px, 5.5vw, 76px)",
                  fontWeight: 400,
                  color: C.dark,
                }}
              >
                Elles nous font <em>confiance</em>
              </h2>
            </TextReveal>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Seasonal packages */}
      <section
        id="packages"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.rose,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Packages Saisonniers
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(42px, 5.5vw, 76px)",
                  fontWeight: 400,
                  color: C.dark,
                }}
              >
                Des expériences <em>complètes</em>
              </h2>
            </TextReveal>
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section
        id="booking"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
          background: C.dark,
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "60vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(196,132,122,0.12) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.roseLight,
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              Réservation
            </div>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(40px, 6vw, 80px)",
                fontWeight: 300,
                color: "#fff",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Votre moment
              <br />
              <em style={{ color: C.roseLight }}>de beauté vous attend</em>
            </h2>
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              marginBottom: 44,
            }}
          >
            Réservez en ligne en 2 minutes. Consultations disponibles du mardi au samedi, de 9h à 19h.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={openBooking}
              style={{
                background: C.rose,
                color: "#fff",
                border: "none",
                padding: "18px 48px",
                fontFamily: C.fontSans,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Prendre rendez-vous
            </MagneticButton>
            <MagneticButton
              onClick={callSalon}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                padding: "18px 48px",
                fontFamily: C.fontSans,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Nous appeler · {PHONE_DISPLAY}
            </MagneticButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              marginTop: 48,
              display: "flex",
              gap: 40,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Clientes satisfaites", value: "3 400+" },
              { label: "Années d'expertise", value: "12" },
              { label: "Recommandation", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 40,
                    fontWeight: 300,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#120e0c",
          color: "rgba(255,255,255,0.5)",
          padding: "40px clamp(24px, 8vw, 120px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 18,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Maison Maria
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 12,
            letterSpacing: "0.05em",
          }}
        >
          © 2026 Maison Maria · 8 rue de la République, 69200 Vénissieux · @maisonmarialyon69
        </div>
      </footer>
    </div>
  );
}
