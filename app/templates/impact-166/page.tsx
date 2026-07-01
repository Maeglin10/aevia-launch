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

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  surface: "#111111",
  card: "#161616",
  gold: "#c9a855",
  goldLight: "#e2c97e",
  goldDim: "rgba(201,168,85,0.15)",
  text: "#f0ece4",
  muted: "#7a7468",
  subtle: "#3a3730",
  border: "rgba(201,168,85,0.18)",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERIES = [
  {
    title: "Lumière Naturelle",
    count: "24 clichés",
    year: "2025",
    desc: "La lumière du jour capturée à ses heures les plus fragiles — aube dorée, heure bleue, coucher de soleil. Portraits baignés dans une luminosité qui révèle l'âme.",
    img: "photo-1492691527719-9d1e07e534b4",
    dims: "Portrait 4:5",
  },
  {
    title: "Portraits Urbains",
    count: "18 clichés",
    year: "2025",
    desc: "Des visages prélevés dans le tissu de la ville. Chaque sujet porte l'empreinte de son quartier, de sa rue, de son instant.",
    img: "photo-1504257432389-52343af06ae3",
    dims: "Paysage 16:9",
  },
  {
    title: "Architecture & Vide",
    count: "31 clichés",
    year: "2024",
    desc: "Les espaces que les hommes ont bâti, photographiés au moment où ils semblent respirer. Géométrie, silence, matière.",
    img: "photo-1531366936337-7c912a4589a7",
    dims: "Carré 1:1",
  },
  {
    title: "Instants Éphémères",
    count: "42 clichés",
    year: "2024",
    desc: "Ce qu'une seconde de trop aurait fait disparaître. Mouvement, émotion, saisissement. La photographie comme acte de préservation.",
    img: "photo-1506905925346-21bda4d32df4",
    dims: "Portrait 3:4",
  },
  {
    title: "Paysages Extrêmes",
    count: "15 clichés",
    year: "2023",
    desc: "Islande, Patagonie, Sahara. La planète dans ses états les plus crus. Tempêtes de sable, aurores boréales, glaciers en lente agonie.",
    img: "photo-1469474968028-56623f02e42e",
    dims: "Panorama 21:9",
  },
  {
    title: "Monochrome Stories",
    count: "27 clichés",
    year: "2023",
    desc: "Le monde sans couleur révèle ce que la couleur dissimule. Texture, contraste, densité. Chaque gris porte son propre poids.",
    img: "photo-1536440136628-849c177e76a1",
    dims: "Portrait 4:5",
  },
];

const SERVICES = [
  {
    name: "Éditorial & Mode",
    desc: "Lookbooks, campagnes de saison, portraits de collection. Studio parisien ou déplacements sur mesure. Direction artistique complète disponible.",
    price: "À partir de 1 400 €",
    duration: "1 journée",
    deliverables: ["40–60 visuels retouchés", "Droits commerciaux inclus", "Fichiers RAW disponibles"],
  },
  {
    name: "Portrait Corporate",
    desc: "Dirigeants, comités de direction, équipes. Personal branding pour LinkedIn et presse. Retouche professionnelle, format web & print.",
    price: "À partir de 480 €",
    duration: "2–3 heures",
    deliverables: ["20 portraits retouchés", "Formats multiples", "Livraison 72h"],
  },
  {
    name: "Mariage & Événements",
    desc: "Un seul jour, une seule chance. Reportage complet de la préparation à la soirée. Album imprimé haut de gamme inclus dans les forfaits premium.",
    price: "À partir de 2 200 €",
    duration: "Journée complète",
    deliverables: ["300+ images sélectionnées", "Album imprimé 30×30", "Galerie privée en ligne"],
  },
  {
    name: "Architecture & Intérieur",
    desc: "Immobilier haut de gamme, hôtels, showrooms et résidences privées. HDR mesuré, ambiance naturelle, angles étudiés pour valoriser chaque espace.",
    price: "À partir de 890 €",
    duration: "Demi-journée",
    deliverables: ["25 vues retouchées", "Déclinaisons verticales & horizontales", "Usage illimité"],
  },
];

const TESTIMONIALS = [
  {
    quote: "Iris a capturé en une fraction de seconde ce qu'on avait mis cinq ans à construire. Notre campagne a généré un ROI ×4 par rapport aux visuels précédents.",
    name: "Julien Bernard",
    role: "Directeur Marketing, Maison Farno",
  },
  {
    quote: "Chaque photo raconte une histoire complète. On n'avait pas besoin de légende — les images parlaient d'elles-mêmes. Rare.",
    name: "Adèle Marceau",
    role: "Rédactrice en chef, Numéro Magazine",
  },
  {
    quote: "Le shooting de mariage dépassait tout ce qu'on avait imaginé. On pleure encore en revoyant certaines images. Iris sait voir ce que les autres ne voient pas.",
    name: "Thomas & Chloé Leroux",
    role: "Mariés, Château de Vaux, juin 2024",
  },
];

const NAV_LINKS = [
  { label: "Séries", id: "series" },
  { label: "À propos", id: "about" },
  { label: "Services", id: "services" },
  { label: "Témoignages", id: "testimonials" },
  { label: "Contact", id: "contact" },
];

const MARQUEE_ITEMS = [
  "Photographie Éditoriale",
  "Portrait Corporate",
  "Mariage & Événements",
  "Architecture",
  "Mode & Lookbook",
  "Paysage",
  "Direction Artistique",
  "Fine Art Print",
];

// ─── Font loader ──────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "iris-studio-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

// ─── Animated grain overlay ───────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.045,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Reusable components ──────────────────────────────────────────────────────
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
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
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

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  const bg = externalStyle?.background || C.card;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(201,168,85,0.1) 0%, ${bg} 60%)`
          : bg,
        transition: "background 0.1s ease",
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
    <div
      style={{
        overflow: "hidden",
        background: bg,
        paddingTop: 18,
        paddingBottom: 18,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color,
              paddingLeft: 40,
              paddingRight: 40,
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.gold,
                display: "inline-block",
                opacity: 0.7,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Series card (extracted to avoid hook-in-map) ─────────────────────────────
function SeriesCard({
  s,
  index,
}: {
  s: (typeof SERIES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 2,
        aspectRatio: index % 3 === 1 ? "4/5" : "3/4",
      }}
    >
      <motion.img
        src={`https://images.unsplash.com/${s.img}?q=80&w=1400&auto=format&fit=crop`}
        alt={s.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Dark gradient base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)`,
        }}
      />

      {/* Gold reveal overlay on hover */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(201,168,85,0.22) 0%, transparent 60%)`,
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Gold top border reveal */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "32px 28px",
        }}
      >
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 10,
            opacity: 0.85,
          }}
        >
          {s.year} — {s.dims}
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 26,
            fontWeight: 400,
            color: C.text,
            lineHeight: 1.2,
            marginBottom: 10,
            letterSpacing: "0.01em",
          }}
        >
          {s.title}
        </div>
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            fontFamily: C.fontSans,
            fontSize: 13,
            lineHeight: 1.6,
            color: "rgba(240,236,228,0.7)",
            maxWidth: 280,
            marginBottom: 16,
          }}
        >
          {s.desc}
        </motion.div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              color: "rgba(240,236,228,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {s.count}
          </span>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              color: C.gold,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Voir la série →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({
  s,
  index,
}: {
  s: (typeof SERVICES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard
        style={{
          background: C.card,
          border: `1px solid ${hovered ? C.border : "rgba(201,168,85,0.08)"}`,
          borderRadius: 2,
          padding: "40px 36px",
          cursor: "default",
          transition: "border-color 0.3s ease",
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: C.font,
                fontSize: 28,
                fontWeight: 500,
                color: C.text,
                letterSpacing: "0.01em",
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 13,
                color: C.gold,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {s.price}
            </div>
          </div>

          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 14,
              lineHeight: 1.75,
              color: "rgba(240,236,228,0.55)",
              marginBottom: 28,
            }}
          >
            {s.desc}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 28,
              paddingBottom: 28,
              borderBottom: `1px solid rgba(201,168,85,0.1)`,
            }}
          >
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.muted,
              }}
            >
              Durée : {s.duration}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.deliverables.map((d, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: C.gold,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    color: "rgba(240,236,228,0.6)",
                  }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  index,
}: {
  t: (typeof TESTIMONIALS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "44px 40px",
        border: `1px solid ${C.border}`,
        background: C.surface,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: C.font,
          fontSize: 52,
          color: C.gold,
          lineHeight: 0.6,
          marginBottom: 28,
          opacity: 0.6,
        }}
      >
        "
      </div>
      <p
        style={{
          fontFamily: C.font,
          fontSize: 18,
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "rgba(240,236,228,0.85)",
          marginBottom: 32,
        }}
      >
        {t.quote}
      </p>
      <div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 13,
            fontWeight: 500,
            color: C.text,
            marginBottom: 4,
          }}
        >
          {t.name}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 11,
            color: C.muted,
            letterSpacing: "0.1em",
          }}
        >
          {t.role}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact166Page() {
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
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();

  // Scroll progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  // Hero parallax
  const heroY = useTransform(scrollY, [0, 700], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 600], ["0%", "-20%"]);
  const heroTextOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFormSent(true);
    },
    []
  );

  
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
        fontFamily: C.fontSans,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <GrainOverlay />

      {/* ── Scroll progress bar ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
          transformOrigin: "0%",
          scaleX,
          zIndex: 200,
        }}
      />

      {/* ── Navigation ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 72,
          background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: C.text,
            cursor: "pointer",
          }}
          onClick={() => scrollTo("hero")}
        >{fd?.businessName ?? "Iris Studio"}</div>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240,236,228,0.6)",
                padding: 0,
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.color = C.gold)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.color =
                  "rgba(240,236,228,0.6)")
              }
            >
              {link.label}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("contact")}
            style={{
              background: "none",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontFamily: C.fontSans,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "10px 24px",
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
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
        >
          <div
            style={{
              width: 24,
              height: 1.5,
              background: C.text,
              marginBottom: 6,
              transition: "all 0.3s ease",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <div
            style={{
              width: 24,
              height: 1.5,
              background: C.text,
              marginBottom: 6,
              opacity: menuOpen ? 0 : 1,
              transition: "all 0.3s ease",
            }}
          />
          <div
            style={{
              width: 24,
              height: 1.5,
              background: C.text,
              transition: "all 0.3s ease",
              transform: menuOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
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
              background: "rgba(10,10,10,0.98)",
              zIndex: 99,
              padding: "40px 48px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.font,
                  fontSize: 28,
                  color: C.text,
                  textAlign: "left",
                  padding: 0,
                  letterSpacing: "0.02em",
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 680,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image with parallax */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-20%",
            y: heroY,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&auto=format&fit=crop"
            alt="Iris Studio hero"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.8) 100%)",
            }}
          />
        </motion.div>

        {/* Hero content with parallax opacity */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: 900,
            padding: "0 32px",
            y: heroTextY,
            opacity: heroTextOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 32,
            }}
          >
            Paris — Photography Studio — Depuis 2018
          </motion.div>

          <TextReveal delay={0.5}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(52px, 9vw, 110px)",
                fontWeight: 300,
                lineHeight: 0.95,
                color: C.text,
                letterSpacing: "-0.01em",
                marginBottom: 0,
              }}
            >{c?.heroHeadline ?? <>
              L'image
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: C.gold,
                  fontWeight: 300,
                }}
              >
                comme
              </em>
              <br />
              mémoire
            </>}</h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(240,236,228,0.6)",
              maxWidth: 480,
              margin: "32px auto 48px",
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Photographe documentaire et commerciale basée à Paris. Je photographie
            ce qui mérite d'être vu — pour l'éditorial, la mode, le mariage et
            l'architecture.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => scrollTo("series")}
              style={{
                background: C.gold,
                border: "none",
                color: C.bg,
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "16px 40px",
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Voir les séries
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("contact")}
              style={{
                background: "none",
                border: `1px solid rgba(240,236,228,0.3)`,
                color: C.text,
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 40px",
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              Collaborer
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.muted,
            }}
          >
            Défiler
          </div>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.surface} color={C.muted} />

      {/* ── Photo Series ── */}
      <section
        id="series"
        style={{
          padding: "120px 48px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 80 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Portfolio
            </div>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                color: C.text,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              Séries photographiques
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
          {SERIES.map((s, i) => (
            <SeriesCard key={s.title} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* ── About / Film Statement ── */}
      <section
        id="about"
        style={{
          padding: "100px 48px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                À propos
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  marginBottom: 32,
                  fontStyle: "italic",
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                "Je ne photographie pas ce qui existe. Je photographie ce qui
                disparaît."
              </>}</h2>
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(240,236,228,0.6)",
                marginBottom: 24,
              }}
            >{c?.aboutText ?? <>
              Iris Beaumont. Photographe documentaire et commerciale, basée à Paris
              depuis 2018. Formée à l'École Nationale Supérieure de la Photographie
              d'Arles, j'ai collaboré avec Vogue France, Le Monde, LVMH et des
              dizaines de petites maisons indépendantes.
            </>}</motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(240,236,228,0.6)",
                marginBottom: 40,
              }}
            >
              Ma pratique oscille entre commandes commerciales et projets
              personnels. Je crois que les deux s'alimentent — qu'une campagne de
              mode peut être aussi rigoureuse qu'un travail documentaire, et qu'un
              projet personnel peut atteindre une beauté commerciale inattendue.
            </motion.p>

            <div
              style={{
                display: "flex",
                gap: 48,
              }}
            >
              {[
                { num: "7+", label: "Années d'expérience" },
                { num: "340+", label: "Clients accompagnés" },
                { num: "12", label: "Prix & distinctions" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 42,
                      fontWeight: 300,
                      color: C.gold,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 11,
                      color: C.muted,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            <img
              src="https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1400&auto=format&fit=crop"
              alt="Iris Beaumont"
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 120,
                height: 120,
                border: `1px solid ${C.gold}`,
                borderRadius: 1,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 24,
                right: -24,
                background: C.bg,
                border: `1px solid ${C.border}`,
                padding: "16px 20px",
                borderRadius: 2,
              }}
            >
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
                Disponibilité
              </div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  color: C.text,
                }}
              >
                Septembre 2025
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services ── */}
      <section
        id="services"
        style={{
          padding: "120px 48px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          <div style={{ position: "sticky", top: 120 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Prestations
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 400,
                  color: C.text,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                Chaque mission, une approche sur mesure
              </h2>
            </TextReveal>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 14,
                lineHeight: 1.8,
                color: "rgba(240,236,228,0.5)",
              }}
            >
              Je travaille en petit volume, avec un engagement total sur chaque
              projet. Pas de forfaits standard — chaque devis est construit autour
              de votre vision.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.name} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        style={{
          padding: "100px 48px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Témoignages
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 400,
                  color: C.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Ce que disent ceux qui ont osé
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>

          {/* Press logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              marginTop: 72,
              paddingTop: 48,
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 60,
              flexWrap: "wrap",
            }}
          >
            {["Vogue", "Le Monde", "Elle", "LVMH", "Numéro"].map((brand) => (
              <span
                key={brand}
                style={{
                  fontFamily: C.font,
                  fontSize: 20,
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: "rgba(240,236,228,0.2)",
                }}
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        style={{
          padding: "120px 48px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          <div>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Contact
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  marginBottom: 32,
                }}
              >
                Parlons de votre projet
              </h2>
            </TextReveal>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 14,
                lineHeight: 1.85,
                color: "rgba(240,236,228,0.5)",
                marginBottom: 48,
              }}
            >
              Je prends généralement 48h pour répondre. Si votre projet est urgent,
              mentionnez-le dans le message et je ferai de mon mieux pour accélérer.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Email", value: "iris@iris-studio.fr" },
                { label: "Téléphone", value: "+33 6 12 34 56 78" },
                { label: "Studio", value: "Paris 11e, sur rendez-vous" },
                { label: "Instagram", value: "@iris.studio.paris" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.muted,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 15,
                      color: C.text,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {formSent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "60px 40px",
                    border: `1px solid ${C.gold}`,
                    background: C.surface,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 20,
                      color: C.gold,
                      marginBottom: 16,
                    }}
                  >
                    Message reçu.
                  </div>
                  <p
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: "rgba(240,236,228,0.6)",
                      lineHeight: 1.7,
                    }}
                  >
                    Je vous répondrai dans les 48h. Merci de votre confiance.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleFormSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {[
                    { key: "name", label: "Nom complet", type: "text", placeholder: "Julien Bernard" },
                    { key: "email", label: "Email", type: "email", placeholder: "julien@exemple.fr" },
                    { key: "type", label: "Type de projet", type: "text", placeholder: "Éditorial, mariage, corporate..." },
                  ].map((field) => (
                    <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label
                        style={{
                          fontFamily: C.fontSans,
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: C.muted,
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={contactForm[field.key as keyof typeof contactForm]}
                        onChange={(e) =>
                          setContactForm((f) => ({ ...f, [field.key]: e.target.value }))
                        }
                        required
                        style={{
                          background: C.surface,
                          border: `1px solid rgba(201,168,85,0.2)`,
                          borderRadius: 1,
                          padding: "14px 18px",
                          fontFamily: C.fontSans,
                          fontSize: 14,
                          color: C.text,
                          outline: "none",
                          transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = C.gold)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(201,168,85,0.2)")
                        }
                      />
                    </div>
                  ))}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.muted,
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      placeholder="Décrivez votre projet, vos dates idéales, votre budget indicatif..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, message: e.target.value }))
                      }
                      required
                      rows={5}
                      style={{
                        background: C.surface,
                        border: `1px solid rgba(201,168,85,0.2)`,
                        borderRadius: 1,
                        padding: "14px 18px",
                        fontFamily: C.fontSans,
                        fontSize: 14,
                        color: C.text,
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = C.gold)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(201,168,85,0.2)")
                      }
                    />
                  </div>

                  <MagneticButton
                    style={{
                      background: C.gold,
                      border: "none",
                      color: C.bg,
                      fontFamily: C.fontSans,
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      padding: "18px 40px",
                      cursor: "pointer",
                      borderRadius: 1,
                      marginTop: 8,
                    }}
                  >
                    Envoyer le message
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "48px",
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: C.font,
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: C.text,
            }}
          >{fd?.businessName ?? "Iris Studio"}</div>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.muted,
                  padding: 0,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.05em",
            }}
          >
            © 2025 Iris Studio. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
