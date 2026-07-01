// @ts-nocheck
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

const SERVICES = [
  {
    id: 1,
    title: "Soin Visage Signature",
    subtitle: "90 min — 145€",
    description:
      "Un soin sur-mesure à base d'huiles botaniques rares. Modelage du visage, drainage lymphatique et masque à l'argile rose pour un éclat immédiat.",
    icon: "✦",
    tag: "Best-seller",
  },
  {
    id: 2,
    title: "Rituel Corps Doré",
    subtitle: "75 min — 120€",
    description:
      "Gommage au sucre de canne et beurre de karité, enveloppement à l'or 24 carats, massage aux pierres chaudes. Un cocon de douceur absolue.",
    icon: "◈",
    tag: "Luxe",
  },
  {
    id: 3,
    title: "Coiffure & Styling",
    subtitle: "60 min — 95€",
    description:
      "Coupe créative, balayage naturel ou coloration végétale. Chaque séance débute par un diagnostic capillaire personnalisé.",
    icon: "❋",
    tag: "Populaire",
  },
  {
    id: 4,
    title: "Maquillage Artiste",
    subtitle: "45 min — 80€",
    description:
      "Du naturel lumineux au glamour sophistiqué. Techniques de contouring, smoky et no-makeup look par nos artistes certifiées.",
    icon: "◇",
    tag: "Événement",
  },
  {
    id: 5,
    title: "Manucure Japonaise",
    subtitle: "60 min — 75€",
    description:
      "Technique de limage traditionnel, soin à la poudre de perle, pose de vernis longue durée et massage main à l'huile de rose.",
    icon: "✿",
    tag: "Nouveau",
  },
  {
    id: 6,
    title: "Sourcils Architecture",
    subtitle: "45 min — 65€",
    description:
      "Design et restructuration complète, lamination sourcils, teinture végétale. Le regard transformé en une séance.",
    icon: "⌘",
    tag: "Tendance",
  },
];

const INGREDIENTS = [
  { name: "Rose de Damas", origin: "Bulgarie", benefit: "Éclat & Hydratation", img: "photo-1490750967868-88df5691cc2c" },
  { name: "Huile d'Argan", origin: "Maroc", benefit: "Nutrition profonde", img: "photo-1608248597279-f99d160bfcbc" },
  { name: "Argile Rose", origin: "France", benefit: "Purification douce", img: "photo-1556228578-8c89e6adf883" },
  { name: "Beurre de Karité", origin: "Ghana", benefit: "Protection & Douceur", img: "photo-1620916566398-39f1143ab7be" },
];

const TEAM = [
  {
    name: "Camille Rousseau",
    role: "Fondatrice & Esthéticienne",
    bio: "15 ans d'expérience, formée à Paris et Tokyo. Spécialiste des soins visage et techniques de drainage lymphatique. Camille a révolutionné l'approche holistique du soin chez Lumière.",
    img: "photo-1487412947147-5cebf100ffc2",
    specialties: ["Soins visage", "Drainage", "Anti-âge"],
  },
  {
    name: "Sophie Leblanc",
    role: "Coiffeuse Senior",
    bio: "Diplômée de l'École Française de Coiffure, Sophie maîtrise les techniques de balayage naturel et coloration végétale. Ses créations allient tendance et durabilité.",
    img: "photo-1522337360788-8b13dee7a37e",
    specialties: ["Balayage", "Coloration végétale", "Coupe créative"],
  },
  {
    name: "Marie Chen",
    role: "Artiste Maquillage",
    bio: "Ancienne maquilleuse de plateau pour les maisons de couture parisiennes, Marie apporte son savoir-faire cinématographique au quotidien.",
    img: "photo-1457972729786-0411a3b2b626",
    specialties: ["Mariages", "Shooting", "Cours maquillage"],
  },
  {
    name: "Isabelle Martin",
    role: "Thérapeute Corps",
    bio: "Certifiée en ayurveda et phytothérapie, Isabelle conçoit des rituels corps sur-mesure en harmonie avec les cycles naturels.",
    img: "photo-1531746020798-e6953c6e8e04",
    specialties: ["Rituels corps", "Ayurveda", "Massages"],
  },
];

const TESTIMONIALS = [
  {
    text: "Un moment hors du temps. Le soin visage signature a transformé ma peau en une seule séance. Camille est une véritable artiste du soin.",
    author: "Léa M.",
    role: "Cliente fidèle depuis 3 ans",
    rating: 5,
  },
  {
    text: "Je ne confie mes cheveux qu'à Sophie. Son talent pour le balayage naturel est incomparable — elle comprend exactement ce dont vos cheveux ont besoin.",
    author: "Charlotte B.",
    role: "Cliente depuis 2 ans",
    rating: 5,
  },
  {
    text: "Le rituel corps doré est une expérience de luxe pur. Je repars chaque fois transformée, apaisée, et avec une peau de bébé.",
    author: "Mathilde D.",
    role: "Cliente VIP",
    rating: 5,
  },
  {
    text: "Marie a réalisé mon maquillage de mariée. Résultat parfait du matin au soir — des larmes de bonheur n'ont rien abîmé !",
    author: "Amélie R.",
    role: "Mariée, Juin 2024",
    rating: 5,
  },
];

const PACKAGES = [
  {
    name: "Évasion Dorée",
    duration: "3h30",
    price: "285€",
    tag: "Automne / Hiver",
    includes: ["Soin visage signature", "Rituel corps doré", "Manucure japonaise", "Tisane & encas bio"],
    color: C.rose,
    highlight: false,
  },
  {
    name: "Jour de Noces",
    duration: "5h",
    price: "450€",
    tag: "Événement Spécial",
    includes: ["Soin visage éclat", "Coiffure mariée", "Maquillage artiste", "Manucure gel", "Champagne & traiteur"],
    color: C.dark,
    highlight: true,
  },
  {
    name: "Détox Printanière",
    duration: "2h",
    price: "175€",
    tag: "Printemps / Été",
    includes: ["Soin corps exfoliant", "Masque purifiant", "Modelage relaxant", "Infusion detox"],
    color: C.rose,
    highlight: false,
  },
];

const MARQUEE_ITEMS = [
  "Soins Bio Certifiés",
  "Produits Naturels",
  "Expertise Parisienne",
  "Éco-Responsable",
  "Formules Exclusives",
  "Résultats Garantis",
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
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
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
        </div>
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
          src={`https://images.unsplash.com/${ing.img}?q=80&w=800&auto=format&fit=crop`}
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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact198Page() {
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
        >{fd?.businessName ?? "Lumière Beauty"}</div>

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
            onClick={() => scrollTo("booking")}
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
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1400&auto=format&fit=crop"
            alt="Lumière Beauty salon"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(253,250,245,0.3) 0%, rgba(253,250,245,0.6) 60%, rgba(253,250,245,0.9) 100%)",
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
            Institut de Beauté · Paris 7ème
          </motion.div>

          <TextReveal delay={0.3}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(52px, 9vw, 120px)",
                fontWeight: 300,
                color: C.dark,
                lineHeight: 0.95,
                marginBottom: 0,
              }}
            >{c?.heroHeadline ?? <>
              L'art du soin
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.45}>
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
              à votre service
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
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Formules exclusives, ingrédients naturels certifiés et expertise parisienne au service de votre beauté naturelle.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => scrollTo("booking")}
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
          <div style={{ marginBottom: 64 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
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
                  fontSize: "clamp(38px, 5vw, 68px)",
                  fontWeight: 400,
                  color: C.dark,
                  lineHeight: 1.05,
                }}
              >
                Des soins pensés
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
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.rose,
                    marginBottom: 16,
                    fontWeight: 500,
                  }}
                >
                  Formules Bio
                </div>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(34px, 4vw, 56px)",
                    fontWeight: 400,
                    color: C.dark,
                    lineHeight: 1.1,
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  La nature comme
                  <br />
                  <em>alliée beauté</em>
                </>}</h2>
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
            >{c?.aboutText ?? <>
              Tous nos soins sont formulés à partir d'ingrédients naturels, sélectionnés pour leur efficacité prouvée et leur provenance éthique. Nous travaillons en direct avec des producteurs certifiés biologiques dans 12 pays.
            </>}</motion.p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.rose,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Notre Équipe
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 400,
                  color: C.dark,
                }}
              >
                Des expertes <em>passionnées</em>
              </h2>
            </TextReveal>
          </div>

          {/* Team tabs */}
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
                  src={`https://images.unsplash.com/${TEAM[activeTeam].img}?q=80&w=800&auto=format&fit=crop`}
                  alt={TEAM[activeTeam].name}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
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
                  fontSize: 11,
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
                  fontSize: "clamp(36px, 5vw, 60px)",
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
                  fontSize: 11,
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
                  fontSize: "clamp(36px, 5vw, 60px)",
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
                fontSize: 11,
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
              Nous appeler
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
              { label: "Soins certifiés bio", value: "100%" },
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
      <footer id="contact"
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
        >{fd?.businessName ?? "Lumière Beauty"}</div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 12,
            letterSpacing: "0.05em",
          }}
        >
          © 2025 Lumière Beauty · 12 Rue de Grenelle, Paris 7ème · Institut certifié bio
        </div>
      </footer>
    </div>
  );
}
