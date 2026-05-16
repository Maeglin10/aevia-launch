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

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  navy: "#1a2744",
  navyDark: "#0f1829",
  navyMid: "#243156",
  ivory: "#f8f5ef",
  ivoryDark: "#eee9e0",
  gold: "#c9a855",
  goldLight: "#e2c97e",
  goldDark: "#a8882e",
  white: "#ffffff",
  charcoal: "#2c2c2c",
  warm: "#9a8e7e",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'Jost', -apple-system, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Properties", "Market", "Neighborhoods", "Process", "Contact"];

const PROPERTIES = [
  {
    id: 1,
    title: "Hôtel Particulier",
    subtitle: "Saint-Germain-des-Prés, VIe",
    price: "€ 4 200 000",
    area: "312 m²",
    rooms: "7 pièces",
    floor: "Hôtel particulier",
    description: "An exceptional 18th-century private mansion entirely renovated by architect Pierre Margot. Original Versailles parquet, period fireplaces, private garden of 280m².",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
    tags: ["Jardin Privé", "Patrimoine", "Coup de Cœur"],
    featured: true,
  },
  {
    id: 2,
    title: "Appartement Haussmannien",
    subtitle: "Trocadéro, XVIe",
    price: "€ 2 850 000",
    area: "218 m²",
    rooms: "6 pièces",
    floor: "3e étage noble",
    description: "Perfectly preserved Haussmann apartment with Tour Eiffel view. Original mouldings, chevron parquet, and 4.2m ceiling heights throughout.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop",
    tags: ["Vue Tour Eiffel", "Duplex", "Terrasse"],
    featured: false,
  },
  {
    id: 3,
    title: "Loft Industriel Contemporain",
    subtitle: "Marais, IVe",
    price: "€ 1 750 000",
    area: "165 m²",
    rooms: "4 pièces",
    floor: "RDC avec jardin",
    description: "Former 19th-century workshop transformed into a singular loft with double-height volumes, steel structure exposed, and private patio.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
    tags: ["Loft", "Patio", "Architecte"],
    featured: false,
  },
];

const STATS = [
  { value: "€ 14 200", label: "Prix médian / m² — Paris Centre", suffix: "" },
  { value: "28", label: "Années d'expertise sur le marché parisien", suffix: "ans" },
  { value: "94", label: "Transactions réussies en 2024", suffix: "%" },
  { value: "340", label: "Biens vendus ces 5 dernières années", suffix: "+" },
];

const NEIGHBORHOODS = [
  {
    name: "Saint-Germain",
    arrondissement: "VIe",
    character: "Literary, artistic, refined. The spiritual home of the Parisian intellectual. Cafés where Sartre wrote, galleries where history was made.",
    priceRange: "€ 15 000 – 22 000 / m²",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Le Marais",
    arrondissement: "IVe",
    character: "Renaissance hôtels particuliers, contemporary galleries, and the best falafel in Europe. History layered on history.",
    priceRange: "€ 12 000 – 18 000 / m²",
    image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Trocadéro",
    arrondissement: "XVIe",
    character: "Monumental Haussmann architecture, the finest views of the Eiffel Tower, and quiet residential streets that feel like a village.",
    priceRange: "€ 13 000 – 20 000 / m²",
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Île Saint-Louis",
    arrondissement: "IVe",
    character: "The most rarefied address in Paris. 17th-century private mansions on an island. Time moves differently here.",
    priceRange: "€ 16 000 – 28 000 / m²",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1400&auto=format&fit=crop",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Écoute & Qualification",
    description: "Every mandate begins with an hour-long consultation. We listen to what you want, what you truly need, and what history you want to inherit.",
  },
  {
    number: "02",
    title: "Recherche & Accès Off-Market",
    description: "70% of our transactions never appear on public listings. Our network of notaires, architects, and owners gives you access to the invisible market.",
  },
  {
    number: "03",
    title: "Négociation & Due Diligence",
    description: "We negotiate with rigor and discretion. Our legal and technical partners ensure every stone of the transaction is solid before you commit.",
  },
  {
    number: "04",
    title: "Accompagnement à l'Acte",
    description: "From the promesse to the acte authentique, we stand beside you at every signature. After the keys: we remain your resource for everything that follows.",
  },
];

const TESTIMONIALS = [
  { quote: "Rive Gauche found us our apartment in four weeks. Three off-market viewings, one offer. They know this city in a way that takes decades to learn.", author: "Edward & Caroline H.", origin: "London" },
  { quote: "I had worked with three agencies before. This was different from the first meeting. They asked questions no one had asked.", author: "Mathieu L.", origin: "Paris" },
  { quote: "The negotiation they conducted on our behalf saved us €180,000. Quietly, professionally, without drama.", author: "Ingrid S.", origin: "Stockholm" },
];

const MARQUEE_ITEMS = [
  "Saint-Germain",
  "Le Marais",
  "Île Saint-Louis",
  "Trocadéro",
  "Palais-Royal",
  "Odéon",
  "Luxembourg",
  "Montparnasse",
  "Batignolles",
  "Pigalle Supérieur",
];

// ─── Font Loader ──────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "impact-167-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

// ─── Shared Components ────────────────────────────────────────────────────────
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
  accentColor,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
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
  const accent = accentColor || "201,168,85";
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(${accent},0.08) 0%, ${externalStyle?.background || C.ivory} 60%)`
          : externalStyle?.background || C.ivory,
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
  textColor,
}: {
  items: string[];
  bg: string;
  textColor: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: bg, paddingTop: 18, paddingBottom: 18 }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textColor,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              fontFamily: C.fontSans,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: textColor,
                opacity: 0.4,
                display: "inline-block",
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  index,
  isActive,
  onActivate,
}: {
  property: (typeof PROPERTIES)[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onActivate}
      style={{
        cursor: "pointer",
        position: "relative",
        background: isActive ? C.navyDark : C.white,
        border: isActive ? `1px solid ${C.gold}` : `1px solid ${C.ivoryDark}`,
        transition: "border-color 0.4s, background 0.4s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "4/3",
        }}
      >
        <img
          src={property.image}
          alt={property.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
            transform: isActive ? "scale(1.04)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isActive
              ? "linear-gradient(to top, rgba(10,16,35,0.8) 0%, rgba(10,16,35,0.2) 60%, transparent 100%)"
              : "linear-gradient(to top, rgba(10,16,35,0.5) 0%, transparent 60%)",
            transition: "background 0.4s",
          }}
        />
        {property.featured && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: C.gold,
              color: C.navy,
              fontFamily: C.fontSans,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "5px 14px",
            }}
          >
            Coup de Cœur
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: C.white,
            letterSpacing: "0.02em",
          }}
        >
          {property.price}
        </div>
      </div>

      <div style={{ padding: "28px 28px 32px" }}>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: isActive ? C.gold : C.gold,
            marginBottom: 8,
          }}
        >
          {property.subtitle}
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 26,
            fontWeight: 400,
            color: isActive ? C.white : C.navy,
            marginBottom: 14,
            lineHeight: 1.15,
            transition: "color 0.4s",
          }}
        >
          {property.title}
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Surface", value: property.area },
            { label: "Pièces", value: property.rooms },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive ? "rgba(255,255,255,0.5)" : C.warm,
                  marginBottom: 2,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 18,
                  color: isActive ? C.white : C.navy,
                  transition: "color 0.4s",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.75,
                  marginBottom: 20,
                  fontWeight: 300,
                  paddingTop: 8,
                  borderTop: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                {property.description}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {property.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: C.gold,
                      border: `1px solid rgba(201,168,85,0.3)`,
                      padding: "4px 12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                style={{
                  background: C.gold,
                  color: C.navy,
                  border: "none",
                  padding: "12px 28px",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Demander une visite
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Stat Block ───────────────────────────────────────────────────────────────
function StatBlock({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{
        textAlign: "center",
        padding: "40px 24px",
        borderRight: index < STATS.length - 1 ? `1px solid rgba(201,168,85,0.15)` : "none",
      }}
    >
      <div
        style={{
          fontFamily: C.font,
          fontSize: "clamp(36px, 3.5vw, 54px)",
          fontWeight: 300,
          color: C.gold,
          lineHeight: 1,
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}
      >
        {stat.value}
        {stat.suffix && (
          <span style={{ fontSize: "0.5em", marginLeft: 4 }}>{stat.suffix}</span>
        )}
      </div>
      <div
        style={{
          fontFamily: C.fontSans,
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.05em",
          lineHeight: 1.5,
          maxWidth: 180,
          margin: "0 auto",
          fontWeight: 300,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

// ─── Neighborhood Tab ─────────────────────────────────────────────────────────
function NeighborhoodTab({
  neighborhood,
  isActive,
}: {
  neighborhood: (typeof NEIGHBORHOODS)[0];
  isActive: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={neighborhood.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            minHeight: 440,
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={neighborhood.image}
              alt={neighborhood.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: 440,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent, rgba(26,39,68,0.3))",
              }}
            />
          </div>
          <div
            style={{
              background: C.navyMid,
              padding: "56px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 12,
              }}
            >
              Arrondissement {neighborhood.arrondissement}
            </div>
            <div
              style={{
                fontFamily: C.font,
                fontSize: 40,
                fontWeight: 300,
                color: C.white,
                marginBottom: 20,
                lineHeight: 1.1,
                fontStyle: "italic",
              }}
            >
              {neighborhood.name}
            </div>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: 32,
              }}
            >
              {neighborhood.character}
            </div>
            <div
              style={{
                borderTop: `1px solid rgba(201,168,85,0.2)`,
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 6,
                }}
              >
                Fourchette de prix
              </div>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 24,
                  color: C.gold,
                  fontWeight: 300,
                }}
              >
                {neighborhood.priceRange}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Impact167Page() {
  useFonts();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState(0);
  const [activeNeighborhood, setActiveNeighborhood] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "60%"]);
  const scrollWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ background: C.ivory, minHeight: "100vh", fontFamily: C.fontSans }}
    >
      {/* Scroll Progress */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          background: C.gold,
          width: scrollWidth,
          zIndex: 1000,
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "0 56px",
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? `rgba(26,39,68,0.97)` : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid rgba(201,168,85,0.15)` : "none",
          transition: "background 0.5s, border-color 0.5s",
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: C.white,
            letterSpacing: "0.06em",
            cursor: "pointer",
            fontStyle: "italic",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Rive Gauche
          <span style={{ color: C.gold }}> · </span>
          Immobilier
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                padding: 0,
                fontWeight: 400,
                transition: "color 0.2s",
              }}
            >
              {link}
            </button>
          ))}

          <MagneticButton
            onClick={() => scrollTo("Contact")}
            style={{
              background: "transparent",
              color: C.gold,
              border: `1px solid ${C.gold}`,
              padding: "10px 28px",
              fontFamily: C.fontSans,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Nous Contacter
          </MagneticButton>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 22,
                  height: 1.5,
                  background: C.white,
                  display: "block",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translateY(6.5px)"
                      : menuOpen && i === 1
                      ? "scaleX(0)"
                      : menuOpen && i === 2
                      ? "rotate(-45deg) translateY(-6.5px)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 80,
              left: 0,
              right: 0,
              background: C.navyDark,
              zIndex: 998,
              padding: "36px 56px",
              borderBottom: `1px solid rgba(201,168,85,0.15)`,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.font,
                  fontSize: 32,
                  color: C.white,
                  padding: "10px 0",
                  fontWeight: 300,
                  fontStyle: "italic",
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — Split Layout */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "55% 45%",
          overflow: "hidden",
        }}
      >
        {/* Navy Left */}
        <div
          style={{
            background: C.navy,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop"
            alt="Paris luxury property"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.22,
              y: heroBgY,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${C.navyDark} 0%, rgba(26,39,68,0.7) 100%)`,
            }}
          />

          <motion.div
            style={{ position: "relative", zIndex: 1, y: heroTextY }}
          >
            <TextReveal delay={0.3}>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 24,
                }}
              >
                Immobilier de Prestige — Paris
              </div>
            </TextReveal>

            <TextReveal delay={0.5}>
              <h1
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(44px, 5vw, 76px)",
                  fontWeight: 300,
                  color: C.white,
                  lineHeight: 1.05,
                  fontStyle: "italic",
                  marginBottom: 28,
                }}
              >
                L'art de trouver<br />l'exceptionnel
              </h1>
            </TextReveal>

            <TextReveal delay={0.7}>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.85,
                  fontWeight: 300,
                  maxWidth: 420,
                  marginBottom: 44,
                }}
              >
                Vingt-huit années à rechercher, négocier et transmettre les biens les plus rares de Paris. Un accès privilégié au marché invisible.
              </p>
            </TextReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <MagneticButton
                onClick={() => scrollTo("Properties")}
                style={{
                  background: C.gold,
                  color: C.navy,
                  border: "none",
                  padding: "16px 36px",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Voir les biens
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("Contact")}
                style={{
                  background: "transparent",
                  color: C.white,
                  border: `1px solid rgba(255,255,255,0.3)`,
                  padding: "16px 36px",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Nous contacter
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Ivory Right */}
        <div
          style={{
            background: C.ivory,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px 64px 80px",
          }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop"
            alt="Paris streets"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              y: useTransform(heroScroll, [0, 1], ["0%", "20%"]),
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, rgba(248,245,239,0.98) 0%, rgba(248,245,239,0.6) 50%, rgba(248,245,239,0.1) 100%)`,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {[
              { num: "28", label: "Années d'expertise" },
              { num: "340+", label: "Biens vendus" },
              { num: "Off-market", label: "70% de nos transactions" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: i < 2 ? `1px solid ${C.ivoryDark}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 32,
                    fontWeight: 300,
                    color: C.navy,
                    lineHeight: 1,
                  }}
                >
                  {item.num}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    color: C.warm,
                    letterSpacing: "0.1em",
                    textAlign: "right",
                  }}
                >
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
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
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, rgba(201,168,85,0.8), transparent)",
            }}
          />
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" style={{ padding: "120px 80px", background: C.ivory }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 72,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 14,
                  }}
                >
                  Sélection Exclusive
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(34px, 4vw, 56px)",
                    fontWeight: 300,
                    color: C.navy,
                    lineHeight: 1.08,
                    fontStyle: "italic",
                  }}
                >
                  Propriétés<br />d'exception
                </h2>
              </TextReveal>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ x: 4 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.navy,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 0,
              }}
            >
              Voir toutes les propriétés
              <span style={{ fontSize: 18 }}>→</span>
            </motion.button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 2,
            }}
          >
            {PROPERTIES.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={i}
                isActive={activeProperty === i}
                onActivate={() => setActiveProperty(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section id="market" style={{ background: C.navyDark, padding: "100px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 14,
                }}
              >
                Le Marché Parisien
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 3.5vw, 48px)",
                  fontWeight: 300,
                  color: C.white,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Chiffres qui définissent<br />notre réalité
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              border: `1px solid rgba(201,168,85,0.15)`,
            }}
          >
            {STATS.map((stat, i) => (
              <StatBlock key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Guide */}
      <section id="neighborhoods" style={{ padding: "120px 0", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }}>
          <div style={{ marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 14,
                }}
              >
                Guide des Quartiers
              </div>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 3.5vw, 48px)",
                  fontWeight: 300,
                  color: C.white,
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                Paris, arrondissement<br />par arrondissement
              </h2>
            </TextReveal>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
            {NEIGHBORHOODS.map((n, i) => (
              <button
                key={n.name}
                onClick={() => setActiveNeighborhood(i)}
                style={{
                  background: activeNeighborhood === i ? C.gold : "rgba(255,255,255,0.08)",
                  color: activeNeighborhood === i ? C.navy : "rgba(255,255,255,0.6)",
                  border: "none",
                  padding: "12px 28px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontWeight: activeNeighborhood === i ? 600 : 400,
                  transition: "background 0.3s, color 0.3s",
                }}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          {NEIGHBORHOODS.map((n, i) => (
            <NeighborhoodTab key={n.name} neighborhood={n} isActive={activeNeighborhood === i} />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.gold} textColor={C.navy} />

      {/* Process */}
      <section id="process" style={{ padding: "120px 80px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            <div style={{ position: "sticky", top: 120 }}>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 14,
                  }}
                >
                  Notre Méthode
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(32px, 3.5vw, 48px)",
                    fontWeight: 300,
                    color: C.navy,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                    marginBottom: 28,
                  }}
                >
                  Un processus<br />sans compromis
                </h2>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  color: C.warm,
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                Chaque transaction est une relation. Nous ne traitons pas de volume — nous accompagnons des individus dans l'une des décisions les plus importantes de leur vie.
              </motion.p>
            </div>

            <div>
              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  style={{
                    display: "flex",
                    gap: 36,
                    paddingBottom: i < PROCESS_STEPS.length - 1 ? 48 : 0,
                    marginBottom: i < PROCESS_STEPS.length - 1 ? 48 : 0,
                    borderBottom: i < PROCESS_STEPS.length - 1 ? `1px solid ${C.ivoryDark}` : "none",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      fontFamily: C.font,
                      fontSize: 52,
                      fontWeight: 300,
                      color: C.gold,
                      opacity: 0.5,
                      lineHeight: 1,
                      width: 60,
                    }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: C.font,
                        fontSize: 26,
                        fontWeight: 400,
                        color: C.navy,
                        marginBottom: 12,
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 15,
                        color: C.warm,
                        lineHeight: 1.8,
                        fontWeight: 300,
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        style={{
          background: C.navyMid,
          padding: "100px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            border: `1px solid rgba(201,168,85,0.06)`,
            borderRadius: "50%",
          }}
        />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <TextReveal style={{ textAlign: "center", marginBottom: 64 }}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(32px, 3.5vw, 48px)",
                fontWeight: 300,
                color: C.white,
                fontStyle: "italic",
              }}
            >
              Ils nous ont fait confiance
            </h2>
          </TextReveal>

          <div style={{ position: "relative", minHeight: 220 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: activeTestimonial === i ? 1 : 0,
                  y: activeTestimonial === i ? 0 : 20,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  pointerEvents: activeTestimonial === i ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 64,
                    color: C.gold,
                    lineHeight: 0.5,
                    marginBottom: 28,
                    opacity: 0.4,
                  }}
                >
                  &ldquo;
                </div>
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 24,
                    fontStyle: "italic",
                    color: C.white,
                    lineHeight: 1.65,
                    marginBottom: 28,
                    maxWidth: 680,
                  }}
                >
                  {t.quote}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.author} — {t.origin}
                </div>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 48,
            }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeTestimonial === i ? C.gold : "rgba(201,168,85,0.25)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: "120px 80px", background: C.ivory }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            <div>
              <TextReveal>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 14,
                  }}
                >
                  Premier Contact
                </div>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(32px, 3.5vw, 52px)",
                    fontWeight: 300,
                    color: C.navy,
                    lineHeight: 1.1,
                    fontStyle: "italic",
                    marginBottom: 24,
                  }}
                >
                  Commençons<br />la conversation
                </h2>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  color: C.warm,
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: 40,
                }}
              >
                Chaque mandat commence par une écoute. Parlez-nous de votre projet — achat, vente, investissement — et nous vous dirons ce que nous pouvons faire pour vous.
              </motion.p>

              {[
                { label: "Agence", value: "12 Rue de l'Université, 75007 Paris" },
                { label: "Téléphone", value: "+33 1 45 48 23 67" },
                { label: "Email", value: "contact@rivegauche-immo.fr" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.gold,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 18,
                      color: C.navy,
                      fontWeight: 400,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                background: C.white,
                border: `1px solid ${C.ivoryDark}`,
                padding: "48px 44px",
              }}
            >
              {[
                { label: "Nom Complet", type: "text", placeholder: "Charlotte Beaumont" },
                { label: "Email", type: "email", placeholder: "charlotte@email.com" },
                { label: "Téléphone", type: "tel", placeholder: "+33 6 12 34 56 78" },
              ].map((field) => (
                <div key={field.label} style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.navy,
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      border: `1px solid ${C.ivoryDark}`,
                      background: C.ivory,
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.navy,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.navy,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Type de projet
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.ivoryDark}`,
                    background: C.ivory,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    color: C.navy,
                    outline: "none",
                  }}
                >
                  <option>Acquisition — résidence principale</option>
                  <option>Acquisition — investissement</option>
                  <option>Vente de bien</option>
                  <option>Conseil & estimation</option>
                </select>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.navy,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Votre projet en quelques mots
                </label>
                <textarea
                  rows={4}
                  placeholder="Budget, quartiers souhaités, superficie, délai..."
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.ivoryDark}`,
                    background: C.ivory,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    color: C.navy,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <MagneticButton
                style={{
                  width: "100%",
                  background: C.navy,
                  color: C.white,
                  border: "none",
                  padding: "16px 40px",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Envoyer ma demande
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.navyDark,
          padding: "56px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
          borderTop: `1px solid rgba(201,168,85,0.1)`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: C.font,
              fontSize: 20,
              fontWeight: 400,
              color: C.white,
              fontStyle: "italic",
              marginBottom: 4,
            }}
          >
            Rive Gauche · Immobilier
          </div>
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            12 Rue de l'Université, 75007 Paris
          </div>
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © 2025 Rive Gauche Immobilier. Tous droits réservés. Carte professionnelle T n° 75-XXX-2024.
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Mentions légales", "Confidentialité", "Plan du site"].map((link) => (
            <button
              key={link}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                padding: 0,
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
