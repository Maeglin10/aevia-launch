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

// Coordonnées réelles de Maison Maria (source : Planity).
const BOOKING_URL = "https://www.planity.com/maison-maria-69200-venissieux"; // Planity
const PHONE_NUMBER = "+33617867969";
const PHONE_DISPLAY = "06 17 86 79 69";
const ADDRESS = "10 Rue Jean-Baptiste Clément, 69200 Vénissieux";
const ADDRESS_MAP = "https://maps.google.com/?q=10+Rue+Jean-Baptiste+Clément+69200+Vénissieux";
const INSTAGRAM = "https://www.instagram.com/maisonmarialyon69";
const INSTAGRAM_HANDLE = "@maisonmarialyon69";
const RATING = "4,9";
const REVIEWS_COUNT = "243";
const HOURS = [
  { d: "Lundi – Jeudi", h: "07:00 – 23:30" },
  { d: "Vendredi", h: "07:00 – 23:30" },
  { d: "Samedi", h: "07:00 – 23:00" },
  { d: "Dimanche", h: "10:00 – 23:00" },
];

function openBooking() {
  if (typeof window !== "undefined") window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
}
function callSalon() {
  if (typeof window !== "undefined") window.location.href = `tel:${PHONE_NUMBER}`;
}

// Prestations vedettes (les 6 univers phares de l'institut).
const SERVICES = [
  {
    id: 1,
    title: "Extensions de Cils",
    subtitle: "à partir de 40€",
    description:
      "Volume russe, effet wispy, wet, doll ou naturel — un regard sur-mesure, dense et léger. Pose et remplissages, tenue plusieurs semaines.",
    icon: "✦",
    tag: "Best-seller",
  },
  {
    id: 2,
    title: "Réhaussement de Cils",
    subtitle: "à partir de 55€",
    description:
      "Vos cils naturels galbés et rehaussés, pour un regard ouvert et lumineux. Sans entretien quotidien, possible en séance duo.",
    icon: "◇",
    tag: "Tendance",
  },
  {
    id: 3,
    title: "Sourcils & Teinture",
    subtitle: "à partir de 10€",
    description:
      "Restructuration, épilation à la pince, teinture simple ou au henné. Des sourcils dessinés pour harmoniser votre visage.",
    icon: "✿",
    tag: "Populaire",
  },
  {
    id: 4,
    title: "Blanchiment Dentaire",
    subtitle: "à partir de 70€",
    description:
      "Un sourire éclatant en une séance — formule simple ou extrême, en solo ou en duo. Strass dentaire Swarovski en option.",
    icon: "❋",
    tag: "Éclat",
  },
  {
    id: 5,
    title: "Micropigmentation",
    subtitle: "sur rendez-vous",
    description:
      "Sourcils semi-permanents au rendu naturel, poil par poil ou ombré. Un réveil sans crayon, pendant des mois. Sur consultation.",
    icon: "✎",
    tag: "Semi-permanent",
  },
  {
    id: 6,
    title: "Madérothérapie",
    subtitle: "à partir de 35€",
    description:
      "Modelage corps sculptant : ventre, jambes, fessiers, bras ou corps entier. Drainant, raffermissant, anti-capitons.",
    icon: "◈",
    tag: "Bien-être",
  },
];

// Carte complète des prestations, par univers (prix réels Planity).
const MENU = [
  {
    cat: "Regard — Extensions & Réhaussement",
    img: "/maison-maria/planity-2.jpg",
    items: [
      { n: "Extension cils — wispy / wet / doll / déco / plume", d: "1h", p: "60€" },
      { n: "Extension cils — pose hybride / mixte", d: "1h", p: "50€" },
      { n: "Extension cils — pose naturelle", d: "1h", p: "40€" },
      { n: "Remplissage wispy / wet / doll", d: "30 min", p: "40€" },
      { n: "Remplissage pose naturelle", d: "1h", p: "30€" },
      { n: "Réhaussement de cils (+ blanchiment dentaire)", d: "2h", p: "60€" },
      { n: "Séance duo réhaussement de cils", d: "1h", p: "55€" },
    ],
  },
  {
    cat: "Sourcils",
    img: "/maison-maria/planity-3.jpg",
    items: [
      { n: "Épilation à la pince", d: "30 min", p: "10€" },
      { n: "Teinture simple", d: "30 min", p: "15€" },
      { n: "Teinture au henné", d: "30 min", p: "20€" },
      { n: "Teinture + épilation", d: "30 min", p: "25€" },
    ],
  },
  {
    cat: "Blanchiment & Strass dentaire",
    img: "/maison-maria/planity-4.jpg",
    items: [
      { n: "Blanchiment dentaire — séance duo simple", d: "1h", p: "70€" },
      { n: "Blanchiment dentaire — séance duo extrême", d: "1h", p: "120€" },
      { n: "Strass dentaire « Swarovski »", d: "30 min", p: "30€" },
    ],
  },
  {
    cat: "Pack Beauty",
    img: "/maison-maria/planity-5.jpg",
    items: [
      { n: "Extension de cils + blanchiment dentaire", d: "2h", p: "70 – 100€" },
      { n: "Réhaussement de cils + blanchiment dentaire", d: "2h", p: "60€" },
    ],
  },
  {
    cat: "Corps — Madérothérapie",
    img: null,
    items: [
      { n: "Ventre & taille", d: "1h", p: "50€" },
      { n: "Jambes & fessiers", d: "1h", p: "50€" },
      { n: "Visage & buste", d: "1h", p: "35€" },
      { n: "Bras", d: "40 min", p: "35€" },
      { n: "Corps entier", d: "2h", p: "110€" },
    ],
  },
  {
    cat: "Épilations",
    img: null,
    items: [
      { n: "Épilation à la cire", d: "30 min", p: "10€" },
      { n: "Duvet lèvre supérieure / moustache", d: "30 min", p: "10€" },
      { n: "Pattes", d: "30 min", p: "5€" },
    ],
  },
  {
    cat: "Cheveux",
    img: null,
    items: [
      { n: "Coupe fourche (Split Ender Pro) + sérum réparateur", d: "10 min", p: "20€" },
    ],
  },
  {
    cat: "Formations certifiantes — kit + diplôme inclus",
    img: null,
    items: [
      { n: "Blanchiment dentaire", d: "6h", p: "400€" },
      { n: "Extension de cils", d: "6h", p: "350€" },
      { n: "Strass dentaire", d: "6h", p: "300€" },
      { n: "Réhaussement de cils", d: "6h", p: "250€" },
      { n: "Browlift", d: "6h", p: "250€" },
    ],
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
    bio: "Fondatrice de Maison Maria à Vénissieux, Maria conjugue maîtrise technique et sens du détail. Spécialiste de la beauté du regard — extensions de cils, sourcils, blanchiment dentaire, micropigmentation et soins du corps — elle est certifiée et formatrice, et place l'expérience cliente au cœur de chaque prestation.",
    img: "/maison-maria/maria.jpg",
    specialties: ["Extensions de cils", "Sourcils", "Blanchiment dentaire", "Micropigmentation", "Madérothérapie", "Formations"],
  },
];

// « Mon histoire » — version soignée (image de marque) du récit de Maria.
// `quote: true` met le paragraphe en exergue (citation).
const STORY = [
  "Depuis 2019, j'évolue dans l'univers de la beauté du regard. Après l'obtention de mon CAP Esthétique, j'ai choisi de me spécialiser dans l'extension de cils et de placer l'exigence au cœur de mon métier. Cinq formations spécialisées plus tard, la maîtrise technique est devenue ma signature.",
  "J'ai rapidement compris qu'une technique irréprochable ne suffisait pas. Ce que je voulais bâtir, c'était une véritable expérience — un moment de confiance et de bien-être où chaque cliente se sent écoutée, respectée et sublimée. Cette conviction m'a menée jusqu'à ouvrir mon propre salon.",
  "Le parcours n'a pas été sans épreuves. Comme tout entrepreneur, j'ai appris à m'entourer des bonnes personnes, à poser mes limites et à faire de chaque difficulté un moteur. Ces obstacles ne m'ont pas définie : ils m'ont forgée — plus déterminée, plus exigeante, plus libre.",
  { quote: "Mon choix a toujours été le même : me relever, encore plus forte que la veille." },
  "Aujourd'hui, j'avance avec une seule ambition : progresser sans cesse et offrir le meilleur de mon art. Je me forme, je me remets en question et je construis, jour après jour, une maison dont je serai fière dans dix ans.",
  "Car je suis convaincue d'une chose : notre passé ne définit pas notre avenir. Ce qui nous définit, c'est notre capacité à nous relever lorsque la vie nous met à l'épreuve.",
];

// Avis réels vérifiés sur Planity (4,9/5 · 243 avis).
const TESTIMONIALS = [
  {
    text: "Très bel accueil et très belle prestation.",
    author: "Cliente vérifiée",
    role: "Avis Planity · 09/05/2026",
    rating: 5,
  },
  {
    text: "Au top, super sympa et très bonne prestation, nickel.",
    author: "Cliente vérifiée",
    role: "Avis Planity · 04/05/2026",
    rating: 5,
  },
];

// Packs réels (Pack Beauty Planity + séances duo).
const PACKAGES = [
  {
    name: "Pack Regard",
    duration: "2h",
    price: "60€",
    tag: "Naturel & éclat",
    includes: ["Réhaussement de cils", "Blanchiment dentaire", "Un regard ouvert", "Un sourire éclatant"],
    color: C.rose,
    highlight: false,
  },
  {
    name: "Pack Éclat",
    duration: "2h",
    price: "dès 70€",
    tag: "Le plus demandé",
    includes: ["Extension de cils", "Blanchiment dentaire", "Cils sur-mesure", "Sourire lumineux"],
    color: C.dark,
    highlight: true,
  },
  {
    name: "Séance Duo",
    duration: "1h",
    price: "dès 55€",
    tag: "À vivre à deux",
    includes: ["Réhaussement de cils en duo", "ou blanchiment dentaire en duo", "Un moment partagé", "Entre amies ou en famille"],
    color: C.rose,
    highlight: false,
  },
];

const MARQUEE_ITEMS = [
  "Extensions de Cils",
  "Sourcils",
  "Blanchiment Dentaire",
  "Micropigmentation",
  "Madérothérapie",
  "Formations",
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
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => scrollTo("hero")}
        >
          {/* Brand text by default; the logo image replaces it only once it
              loads successfully (drop the file at /public/maison-maria/logo.png).
              This avoids any broken-image icon while the logo is missing. */}
          <img
            src="/maison-maria/logo.png"
            alt="Maison Maria"
            style={{ height: 46, width: "auto", display: "none" }}
            onLoad={(e) => {
              e.currentTarget.style.display = "block";
              const t = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (t) t.style.display = "none";
            }}
          />
          <span
            style={{
              fontFamily: C.font,
              fontSize: 22,
              fontWeight: 500,
              color: C.dark,
              letterSpacing: "0.05em",
            }}
          >
            Maison Maria
          </span>
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
        /* Hero photo is landscape — on portrait phones, cover crops it hard.
           Focus the framing on the lashed eye so it stays visible. */
        .mm-hero-img { object-position: center 40%; }
        @media (max-width: 768px) {
          .mm-hero-img { object-position: 32% 60%; }
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
            src="/maison-maria/planity-5.jpg"
            alt="Maison Maria — institut de beauté à Vénissieux : extensions de cils, sourcils, dentaire"
            className="mm-hero-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
            Institut de beauté · Vénissieux, Lyon
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
              Votre beauté
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
              sublimée
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
            Cils, sourcils, blanchiment dentaire, micropigmentation, soins du corps & formations. L'institut de beauté de Maria à Vénissieux — sur-mesure, dans un cadre cocooning, 7j/7. Noté {RATING}/5 sur {REVIEWS_COUNT} avis.
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
                Nos Prestations
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
                Tous vos soins,
                <br />
                <em>un seul lieu</em>
              </h2>
            </TextReveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Carte complète des prestations, par univers */}
          <div style={{ marginTop: 96 }}>
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
                  textAlign: "center",
                }}
              >
                La carte
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                  fontWeight: 400,
                  color: C.dark,
                  lineHeight: 1.05,
                  textAlign: "center",
                  marginBottom: 64,
                }}
              >
                Toutes nos <em>prestations</em>
              </h2>
            </TextReveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "48px 64px" }}>
              {MENU.map((group) => (
                <div key={group.cat}>
                  {group.img && (
                    <div style={{ height: 150, overflow: "hidden", borderRadius: 2, marginBottom: 20 }}>
                      <img src={group.img} alt={group.cat} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  )}
                  <h3
                    style={{
                      fontFamily: C.font,
                      fontSize: 24,
                      fontWeight: 500,
                      color: C.dark,
                      marginBottom: 18,
                      paddingBottom: 12,
                      borderBottom: `1px solid ${C.ivoryDark}`,
                    }}
                  >
                    {group.cat}
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                    {group.items.map((it) => (
                      <li key={it.n} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontFamily: C.fontSans, fontSize: 14.5, color: C.text, flex: "1 1 auto", lineHeight: 1.4 }}>
                          {it.n}
                          <span style={{ color: C.textMuted, fontSize: 12.5 }}> · {it.d}</span>
                        </span>
                        <span style={{ flex: "1 1 0", borderBottom: `1px dotted ${C.ivoryDark}`, transform: "translateY(-4px)", minWidth: 12 }} />
                        <span style={{ fontFamily: C.fontSans, fontSize: 15, fontWeight: 600, color: C.roseDark, whiteSpace: "nowrap" }}>{it.p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <MagneticButton
                onClick={openBooking}
                style={{
                  background: C.dark,
                  color: "#fff",
                  border: "none",
                  padding: "16px 44px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: 1,
                }}
              >
                Réserver sur Planity
              </MagneticButton>
            </div>
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
                  onError={(e) => {
                    // Fallback to the existing photo until maria.jpg is added.
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = "1";
                      e.currentTarget.src = "/maison-maria/1.jpg";
                    }
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    objectPosition: "center 25%",
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

          {/* Mon histoire */}
          <div style={{ maxWidth: 740, margin: "104px auto 0", textAlign: "center" }}>
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
                Mon histoire
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h3
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 400,
                  color: C.dark,
                  lineHeight: 1.1,
                  marginBottom: 40,
                }}
              >
                De la passion à <em>la Maison</em>
              </h3>
            </TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.9,
                textAlign: "left",
              }}
            >
              {STORY.map((para, i) =>
                typeof para === "string" ? (
                  <p key={i} style={{ marginBottom: 20 }}>
                    {para}
                  </p>
                ) : (
                  <p
                    key={i}
                    style={{
                      marginBottom: 20,
                      fontFamily: C.font,
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2.4vw, 28px)",
                      color: C.rose,
                      lineHeight: 1.3,
                    }}
                  >
                    {para.quote}
                  </p>
                )
              )}
            </div>
            <p
              style={{
                fontFamily: C.font,
                fontStyle: "italic",
                fontSize: "clamp(22px, 3vw, 34px)",
                color: C.rose,
                marginTop: 28,
                lineHeight: 1.2,
              }}
            >
              Et mon histoire ne fait que commencer.
            </p>
          </div>
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
            <TextReveal delay={0.2}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 28, background: C.ivory, border: `1px solid ${C.ivoryDark}`, borderRadius: 100, padding: "12px 28px" }}>
                <span style={{ fontFamily: C.font, fontSize: 34, fontWeight: 500, color: C.dark, lineHeight: 1 }}>{RATING}</span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ color: C.rose, fontSize: 15, letterSpacing: 2 }}>★★★★★</span>
                  <span style={{ fontFamily: C.fontSans, fontSize: 12.5, color: C.textMuted }}>{REVIEWS_COUNT} avis vérifiés sur Planity</span>
                </span>
              </div>
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
            Réservez en ligne en 2 minutes sur Planity. Ouvert 7j/7, du matin tard le soir, au cœur de Vénissieux.
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
              { label: "Note Planity", value: `${RATING}/5` },
              { label: "Avis vérifiés", value: `${REVIEWS_COUNT}` },
              { label: "Ouvert", value: "7j/7" },
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
          color: "rgba(255,255,255,0.55)",
          padding: "72px clamp(24px, 8vw, 120px) 36px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontFamily: C.font, fontSize: 28, color: "#fff", marginBottom: 14 }}>Maison Maria</div>
            <p style={{ fontFamily: C.fontSans, fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 280 }}>
              Institut de beauté à Vénissieux. Cils, sourcils, dentaire, micropigmentation, corps & formations.
            </p>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.roseLight, fontSize: 14, letterSpacing: 1 }}>★★★★★</span>
              <span style={{ fontFamily: C.fontSans, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{RATING}/5 · {REVIEWS_COUNT} avis</span>
            </div>
          </div>

          {/* Adresse & horaires */}
          <div>
            <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.roseLight, marginBottom: 16, fontWeight: 600 }}>Adresse & horaires</div>
            <a href={ADDRESS_MAP} target="_blank" rel="noopener noreferrer" style={{ fontFamily: C.fontSans, fontSize: 13.5, color: "rgba(255,255,255,0.75)", textDecoration: "none", lineHeight: 1.6, display: "block", marginBottom: 16 }}>
              {ADDRESS}
            </a>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {HOURS.map((h) => (
                <li key={h.d} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: C.fontSans, fontSize: 12.5, color: "rgba(255,255,255,0.6)" }}>
                  <span>{h.d}</span>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{h.h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.roseLight, marginBottom: 16, fontWeight: 600 }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: C.fontSans, fontSize: 13.5 }}>
              <a href={`tel:${PHONE_NUMBER}`} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>{PHONE_DISPLAY} <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>· institut</span></a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Instagram {INSTAGRAM_HANDLE}</a>
            </div>
            <button
              type="button"
              onClick={openBooking}
              style={{ marginTop: 22, background: C.rose, color: "#fff", border: "none", padding: "12px 28px", fontFamily: C.fontSans, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: 1 }}
            >
              Réserver sur Planity
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: C.fontSans, fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>
          <span>© 2026 Maison Maria · Institut de beauté · Vénissieux</span>
          <span>Majoration +10€ : prestations de nuit (21h–6h) & dimanche</span>
        </div>
      </footer>
    </div>
  );
}
