"use client";
// @ts-nocheck

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
  bg: "#0f0e0d",
  champagne: "#e8d5a3",
  ivory: "#faf8f3",
  terracotta: "#c4622d",
  terracottaLight: "#e08060",
  champagneLight: "#f5ecd4",
  warm: "#1c1a17",
  text: "#faf8f3",
  textMuted: "rgba(250,248,243,0.5)",
  font: "'Playfair Display', Georgia, serif",
  fontSans: "'Jost', system-ui, sans-serif",
};

const EVENT_TYPES = [
  {
    id: "corporate",
    label: "Corporate",
    icon: "◈",
    title: "Événements d'Entreprise",
    description:
      "Séminaires de direction, team buildings d'exception, soirées gala annuelles. Nous orchestrons chaque moment pour refléter l'âme de votre marque.",
    capacity: "20 – 2 000 personnes",
    img: "photo-1540575467063-178a50c2df87",
    examples: ["Séminaire annuel", "Lancement produit", "Soirée collaborateurs", "Conférence internationale"],
  },
  {
    id: "gala",
    label: "Gala",
    icon: "✦",
    title: "Galas & Soirées de Prestige",
    description:
      "Des soirées inoubliables pensées dans les moindres détails — décors somptueux, gastronomie étoilée, divertissements d'exception.",
    capacity: "50 – 800 personnes",
    img: "photo-1492684223066-81342ee5ff30",
    examples: ["Gala de charité", "Dîner de prestige", "Remise de prix", "Soirée thématique"],
  },
  {
    id: "wedding",
    label: "Mariage",
    icon: "◇",
    title: "Mariages d'Exception",
    description:
      "De la déclaration à la dernière danse, nous transformons votre union en un récit de beauté et d'émotion. Chaque mariage est une première mondiale.",
    capacity: "30 – 500 personnes",
    img: "photo-1530103862676-de8c9debad1d",
    examples: ["Cérémonie laïque", "Mariage château", "Destination wedding", "Elopement luxe"],
  },
  {
    id: "launch",
    label: "Lancement",
    icon: "⌘",
    title: "Lancements & Activations",
    description:
      "Créer l'événement autour d'un produit ou d'une marque, générer l'enthousiasme, faire de votre lancement un moment culturel.",
    capacity: "100 – 1 500 personnes",
    img: "photo-1492684223066-81342ee5ff30",
    examples: ["Lancement de collection", "Opening store", "Activation marque", "Pop-up premium"],
  },
];

const PAST_EVENTS = [
  { title: "Gala Fondation Lumière", location: "Paris, France", year: "2024", img: "photo-1530103862676-de8c9debad1d", guests: "420" },
  { title: "Mariage Château Margaux", location: "Bordeaux, France", year: "2024", img: "photo-1540575467063-178a50c2df87", guests: "180" },
  { title: "Conférence TechEurope", location: "Monaco", year: "2024", img: "photo-1492684223066-81342ee5ff30", guests: "1200" },
  { title: "Lancement Maison Riviera", location: "Cannes, France", year: "2023", img: "photo-1530103862676-de8c9debad1d", guests: "350" },
  { title: "Séminaire LuxGroup", location: "Biarritz, France", year: "2023", img: "photo-1540575467063-178a50c2df87", guests: "85" },
  { title: "Gala Prestige Awards", location: "Paris, France", year: "2023", img: "photo-1492684223066-81342ee5ff30", guests: "600" },
];

const SERVICES = [
  {
    icon: "✦",
    title: "Conception Créative",
    description: "Direction artistique complète : concept, moodboard, identité visuelle de l'événement, scénographie.",
  },
  {
    icon: "◈",
    title: "Coordination Terrain",
    description: "Chef de projet dédié le jour J, équipe de 15+ prestataires coordonnés au millimètre.",
  },
  {
    icon: "◇",
    title: "Gastronomie & Traiteur",
    description: "Partenariats avec chefs étoilés et maisons de renom. Menus signature adaptés à chaque événement.",
  },
  {
    icon: "⌘",
    title: "Décor & Scénographie",
    description: "Floraux extraordinaires, mobilier exclusif, éclairages architecturaux, installations artistiques.",
  },
];

const CLIENT_LOGOS = [
  "Hermès", "LVMH", "Cartier", "Dior", "Chanel", "Moët Hennessy",
  "Kering", "L'Oréal", "Richemont", "Baccarat", "Bulgari", "Van Cleef",
];

const PROCESS = [
  { step: "01", title: "Écoute & Vision", description: "Une rencontre pour comprendre vos aspirations, votre histoire, et définir ensemble la vision de votre événement." },
  { step: "02", title: "Conception", description: "Notre équipe créative élabore le concept, la direction artistique et le programme détaillé." },
  { step: "03", title: "Sélection des Prestataires", description: "Accès à notre carnet d'adresses exclusif : chefs étoilés, fleuristes, orchestres, DJs, lieux d'exception." },
  { step: "04", title: "Production", description: "Coordination de toutes les équipes, répétitions, logistique millimétrée et plans de contingence." },
  { step: "05", title: "Le Grand Soir", description: "Notre équipe est présente du début à la fin. Vous profitez, nous orchestrons." },
];

const TESTIMONIALS = [
  {
    text: "Confluence a transformé notre gala annuel en un moment légendaire. Chaque détail témoignait d'une maîtrise et d'une élégance rares.",
    author: "François de B.",
    role: "DG, Fondation Lumière",
    rating: 5,
  },
  {
    text: "Notre mariage au château était le rêve absolu. L'équipe Confluence a su anticiper chaque besoin sans que nous ayons à y penser une seule seconde.",
    author: "Camille & Thomas R.",
    role: "Mariés en Juin 2024",
    rating: 5,
  },
  {
    text: "Du brief au jour J, une synchronisation parfaite. Nos 1200 invités sont repartis émerveillés. C'est la quatrième fois que nous leur confions notre conférence.",
    author: "Alexandra M.",
    role: "Directrice Communication, TechEurope",
    rating: 5,
  },
];

const MARQUEE_ITEMS = [
  "Événements sur Mesure",
  "Depuis 2010",
  "14 Années d'Excellence",
  "200+ Événements",
  "Chef de Projet Dédié",
  "Carnet d'Adresses Exclusif",
];

function useFonts() {
  useEffect(() => {
    const id = "fonts-impact-175";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');`;
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
  const rgb = accentRgb || "232,213,163";
  const baseBg = externalStyle?.background || "#1c1a17";
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(${rgb},0.12) 0%, ${baseBg} 65%)`
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

function GalleryCard({ event, index }: { event: (typeof PAST_EVENTS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 2,
        aspectRatio: index % 3 === 0 ? "4/5" : "3/2",
      }}
    >
      <motion.img
        src={`https://images.unsplash.com/${event.img}?q=80&w=1000&auto=format&fit=crop`}
        alt={event.title}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(15,14,13,0.95) 0%, rgba(15,14,13,0.3) 60%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 24,
        }}
      >
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.champagne,
            marginBottom: 6,
          }}
        >
          {event.location} · {event.year} · {event.guests} invités
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 20,
            color: "#fff",
            fontWeight: 400,
          }}
        >
          {event.title}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProcessStep({ step, index }: { step: (typeof PROCESS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: 28,
        alignItems: "flex-start",
        paddingBottom: 40,
        borderBottom: index < PROCESS.length - 1 ? `1px solid rgba(250,248,243,0.08)` : "none",
        marginBottom: index < PROCESS.length - 1 ? 40 : 0,
      }}
    >
      <div
        style={{
          fontFamily: C.font,
          fontSize: 48,
          fontWeight: 400,
          color: "rgba(232,213,163,0.2)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {step.step}
      </div>
      <div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            color: C.champagne,
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          {step.title}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.75,
          }}
        >
          {step.description}
        </div>
      </div>
    </motion.div>
  );
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact175Page() {
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
    C = { ...C, champagne: brand };
  }

  useFonts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeEventType, setActiveEventType] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);
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
    { label: "Types", id: "event-types" },
    { label: "Réalisations", id: "gallery" },
    { label: "Services", id: "services" },
    { label: "Processus", id: "process" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
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
          background: `linear-gradient(90deg, ${C.terracotta}, ${C.champagne})`,
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
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(15,14,13,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(232,213,163,0.1)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => scrollTo("hero")}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <span
              style={{
                fontFamily: C.font,
                fontSize: 20,
                fontWeight: 400,
                color: C.champagne,
                letterSpacing: "0.08em",
              }}
            >
              Confluence
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
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
                letterSpacing: "0.06em",
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.champagne)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
            >
              {link.label}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("contact")}
            style={{
              background: C.terracotta,
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
            Nous Contacter
          </MagneticButton>
        </div>

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
                background: C.champagne,
                borderRadius: 2,
              }}
            />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 76,
              left: 0,
              right: 0,
              background: "rgba(15,14,13,0.98)",
              backdropFilter: "blur(20px)",
              zIndex: 99,
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              borderBottom: "1px solid rgba(232,213,163,0.1)",
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
                  color: C.champagne,
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

      {/* Hero — Centered with decorative SVG circles */}
      <section
        id="hero"
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
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1400&auto=format&fit=crop"
            alt={fd?.businessName ?? "Confluence Events"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(15,14,13,0.5) 0%, rgba(15,14,13,0.75) 100%)",
            }}
          />
        </motion.div>

        {/* Decorative SVG circles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {[
            { cx: "50%", cy: "50%", r: 240, delay: 0, opacity: 0.12 },
            { cx: "50%", cy: "50%", r: 360, delay: 0.3, opacity: 0.08 },
            { cx: "50%", cy: "50%", r: 480, delay: 0.6, opacity: 0.05 },
          ].map((circle, i) => (
            <motion.svg
              key={i}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: circle.opacity, scale: 1 }}
              transition={{ duration: 1.4, delay: circle.delay, ease: "easeOut" }}
            >
              <circle
                cx={circle.cx}
                cy={circle.cy}
                r={circle.r}
                fill="none"
                stroke={C.champagne}
                strokeWidth={1}
              />
            </motion.svg>
          ))}
        </div>

        <motion.div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            padding: "0 clamp(24px, 8vw, 140px)",
            opacity: heroOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.champagne,
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Agence d'Événementiel · Paris · Monte-Carlo
          </motion.div>

          <TextReveal delay={0.5}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(54px, 9vw, 128px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
              }}
            >{c?.heroHeadline ?? <>
              Chaque instant
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.65}>
            <h1
              style={{
                fontFamily: C.font,
                fontStyle: "italic",
                fontSize: "clamp(54px, 9vw, 128px)",
                fontWeight: 400,
                color: C.champagne,
                lineHeight: 0.95,
                marginBottom: 32,
              }}
            >
              devient légende
            </h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 520,
              margin: "0 auto 44px",
              lineHeight: 1.75,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Nous créons des événements d'exception pour les maisons de prestige, les institutions et les particuliers exigeants.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => scrollTo("contact")}
              style={{
                background: C.terracotta,
                color: "#fff",
                border: "none",
                padding: "18px 48px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Planifier votre événement
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("gallery")}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1.5px solid rgba(232,213,163,0.3)",
                padding: "18px 48px",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Voir nos réalisations
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            background: "rgba(15,14,13,0.8)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(232,213,163,0.1)",
            display: "flex",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {[
            { value: "200+", label: "Événements réalisés" },
            { value: "14 ans", label: "D'expertise" },
            { value: "98%", label: "Satisfaction client" },
            { value: "40+", label: "Prestataires d'excellence" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "22px 40px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(232,213,163,0.1)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 28,
                  color: C.champagne,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  color: C.textMuted,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Event Type Selector */}
      <section
        id="event-types"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.champagne,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Notre Expertise
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 400,
                  color: C.ivory,
                  lineHeight: 1.05,
                }}
              >
                Quel événement
                <br />
                <em>pouvons-nous créer ?</em>
              </h2>
            </TextReveal>
          </div>

          {/* Type selector tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 48,
              borderBottom: "1px solid rgba(232,213,163,0.12)",
              overflowX: "auto",
            }}
          >
            {EVENT_TYPES.map((type, i) => (
              <button
                key={type.id}
                onClick={() => setActiveEventType(i)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeEventType === i ? C.champagne : "transparent"}`,
                  padding: "14px 28px",
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  color: activeEventType === i ? C.champagne : C.textMuted,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  fontWeight: activeEventType === i ? 600 : 400,
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ marginRight: 8 }}>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeEventType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: C.terracotta,
                    marginBottom: 16,
                    fontWeight: 600,
                  }}
                >
                  Capacité · {EVENT_TYPES[activeEventType].capacity}
                </div>
                <h3
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(28px, 3.5vw, 46px)",
                    fontWeight: 400,
                    color: C.ivory,
                    marginBottom: 20,
                    lineHeight: 1.1,
                  }}
                >
                  {EVENT_TYPES[activeEventType].title}
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
                  {EVENT_TYPES[activeEventType].description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {EVENT_TYPES[activeEventType].examples.map((ex) => (
                    <div
                      key={ex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontFamily: C.fontSans,
                        fontSize: 14,
                        color: C.champagne,
                      }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: C.terracotta,
                          flexShrink: 0,
                        }}
                      />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  borderRadius: 2,
                  overflow: "hidden",
                  aspectRatio: "4/3",
                }}
              >
                <img
                  src={`https://images.unsplash.com/${EVENT_TYPES[activeEventType].img}?q=80&w=1200&auto=format&fit=crop`}
                  alt={EVENT_TYPES[activeEventType].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section
        id="gallery"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
          background: C.warm,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.champagne,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Nos Réalisations
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 400,
                  color: C.ivory,
                }}
              >
                Moments <em>créés par Confluence</em>
              </h2>
            </TextReveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {PAST_EVENTS.map((event, i) => (
              <GalleryCard key={event.title} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

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
                  color: C.champagne,
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                Nos Services
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 400,
                  color: C.ivory,
                }}
              >
                Ce que nous <em>apportons</em>
              </h2>
            </TextReveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.map((svc, i) => (
              <SpotlightCard
                key={i}
                accentRgb="232,213,163"
                style={{
                  background: C.warm,
                  border: "1px solid rgba(232,213,163,0.1)",
                  borderRadius: 2,
                  padding: "40px 32px",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      color: C.champagne,
                      marginBottom: 20,
                    }}
                  >
                    {svc.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: C.font,
                      fontSize: 22,
                      color: C.ivory,
                      marginBottom: 12,
                      fontWeight: 400,
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.75,
                    }}
                  >
                    {svc.description}
                  </p>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos Marquee */}
      <div style={{ padding: "0" }}>
        <MarqueeStrip items={CLIENT_LOGOS} bg="rgba(232,213,163,0.06)" color={C.champagne} />
      </div>

      {/* Process */}
      <section
        id="process"
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
          background: C.warm,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "flex-start",
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
                    color: C.champagne,
                    marginBottom: 16,
                    fontWeight: 500,
                  }}
                >
                  Notre Processus
                </div>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(36px, 4vw, 56px)",
                    fontWeight: 400,
                    color: C.ivory,
                    lineHeight: 1.1,
                    marginBottom: 24,
                  }}
                >{c?.aboutTitle ?? fd?.businessName ?? <>
                  La méthode
                  <br />
                  <em>Confluence</em>
                </>}</h2>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  color: C.textMuted,
                  lineHeight: 1.8,
                }}
              >{c?.aboutText ?? <>
                14 années d'expérience ont forgé une méthode rodée qui garantit l'excellence à chaque étape — de la conception jusqu'au dernier verre.
              </>}</motion.p>
            </div>
            <div>
              {PROCESS.map((step, i) => (
                <ProcessStep key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        style={{
          padding: "clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <TextReveal>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 400,
                color: C.ivory,
                marginBottom: 64,
              }}
            >
              Ce que disent <em style={{ color: C.champagne }}>nos clients</em>
            </h2>
          </TextReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                style={{
                  padding: "40px 48px",
                  background: C.warm,
                  border: "1px solid rgba(232,213,163,0.1)",
                  borderRadius: 2,
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} style={{ color: C.champagne, fontSize: 14 }}>★</span>
                  ))}
                </div>
                <blockquote
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(16px, 2vw, 22px)",
                    fontStyle: "italic",
                    color: C.ivory,
                    lineHeight: 1.65,
                    marginBottom: 24,
                  }}
                >
                  "{t.text}"
                </blockquote>
                <div style={{ fontFamily: C.fontSans, fontWeight: 600, color: C.champagne, fontSize: 13 }}>
                  {t.author}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    color: C.textMuted,
                    fontSize: 12,
                    marginTop: 3,
                    letterSpacing: "0.08em",
                  }}
                >
                  {t.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        style={{
          padding: "clamp(100px, 14vw, 180px) clamp(24px, 8vw, 120px)",
          background: C.terracotta,
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-15%",
            transform: "translateY(-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, margin: "0 auto" }}>
          <TextReveal>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(42px, 7vw, 90px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1,
                marginBottom: 24,
              }}
            >
              Créons ensemble
              <br />
              <em>l'inoubliable</em>
            </h2>
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.75,
              marginBottom: 44,
            }}
          >
            Partagez votre vision avec nous. Notre équipe vous contactera sous 24h pour un échange confidentiel et sans engagement.
          </motion.p>
          <MagneticButton
            style={{
              background: "#fff",
              color: C.terracotta,
              border: "none",
              padding: "20px 56px",
              fontFamily: C.fontSans,
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 1,
            }}
          >
            Démarrer la conversation
          </MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#080706",
          color: C.textMuted,
          padding: "40px clamp(24px, 8vw, 120px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ fontFamily: C.font, fontSize: 18, color: C.champagne }}>{fd?.businessName ?? "Confluence Events"}</div>
        <div style={{ fontFamily: C.fontSans, fontSize: 12, letterSpacing: "0.05em" }}>
          © 2025 Confluence · Paris · Monte-Carlo · info@confluence-events.fr
        </div>
      </footer>
    </div>
  );
}
