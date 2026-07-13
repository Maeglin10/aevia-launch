"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion"

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0d0b08",
  bgAlt: "#13110d",
  cream: "#f5f0e4",
  creamMuted: "#c8c0a8",
  gold: "#c9a84c",
  goldLight: "#e2c97e",
  goldDark: "#8f6e28",
  border: "rgba(201,168,76,0.18)",
  borderLight: "rgba(245,240,228,0.08)",
}

const font = {
  serif: `"Cormorant Garamond", Georgia, "Times New Roman", serif`,
  sans: `"Inter", system-ui, -apple-system, sans-serif`,
}

// ─── SVG France Map coordinates (simplified) ──────────────────────────────────
const INGREDIENT_DOTS = [
  { id: "bretagne",  cx: 92,  cy: 155, label: "Huîtres de Bretagne", producer: "Maison Cadoret, Riec-sur-Bélon", color: "#5ba4cf" },
  { id: "perigord",  cx: 200, cy: 270, label: "Foie gras du Périgord", producer: "Ferme de la Madeleine, Sarlat", color: "#c9a84c" },
  { id: "auvergne",  cx: 235, cy: 245, label: "Fromages d'Auvergne", producer: "Fromagerie Saint-Nectaire", color: "#8dc68d" },
  { id: "provence",  cx: 270, cy: 315, label: "Truffes de Provence", producer: "Domaine Perluisi, Apt", color: "#b8860b" },
  { id: "alsace",    cx: 330, cy: 120, label: "Choucroute d'Alsace", producer: "Jean Galler, Krautergersheim", color: "#e07b54" },
  { id: "normandie", cx: 155, cy: 100, label: "Beurre de Normandie", producer: "Laiterie de Cambremer", color: "#f5e4a0" },
]

// ─── Menu Courses ─────────────────────────────────────────────────────────────
const COURSES = [
  {
    label: "Amuse-bouche",
    title: "Éveil des sens",
    items: [
      { name: "Caviar Osciètre & crème fraîche de Normandie", note: "Gelée de champagne rosé, ciboulette cristallisée" },
      { name: "Tartelette de foie gras", note: "Chutney de figues violettes, fleur de sel de Guérande" },
    ],
  },
  {
    label: "Entrée",
    title: "Prélude",
    items: [
      { name: "Huître de Bélon en gelée d'eau de mer", note: "Granité de citron vert, écume iodée, caviar de hareng" },
      { name: "Carpaccio de Saint-Jacques de Bretagne", note: "Truffe noire du Périgord, huile d'olive de Nyons, micro-herbes" },
    ],
  },
  {
    label: "Poisson",
    title: "Dialogue marin",
    items: [
      { name: "Turbot sauvage de l'Atlantique", note: "Beurre noisette aux câpres, pomme de terre ratte, velouté de vin jaune" },
      { name: "Homard bleu breton mi-cuit", note: "Bisque légère au corail, fenouil confit, zeste de bergamote" },
    ],
  },
  {
    label: "Viande",
    title: "Intensité",
    items: [
      { name: "Filet de bœuf Wagyu A5 en croûte d'herbes", note: "Jus corsé au madère, gratin dauphinois à la truffe blanche" },
      { name: "Pigeon de Vendée rôti à la broche", note: "Jus au vieux porto, lentilles vertes du Puy, foie gras poêlé" },
    ],
  },
  {
    label: "Fromage",
    title: "Terroir & Caractère",
    items: [
      { name: "Sélection affinée de la fromagerie Androuet", note: "Pain aux noix maison, confiture de cerises noires, miel de châtaignier" },
    ],
  },
  {
    label: "Dessert",
    title: "Dénouement",
    items: [
      { name: "Soufflé chaud au Grand Marnier", note: "Crème anglaise à la vanille de Tahiti, tuile de caramel" },
      { name: "Millefeuille revisité à la crème légère", note: "Caramel beurre salé de Guérande, biscuit feuilleté à l'encre de seiche" },
    ],
  },
]

// Real menu from the client's wizard input (c?.menuItems) takes priority over
// the demo COURSES above. Categories are derived from the items' `category`
// field (fallback "Menu"); prices are kept EXACTLY as provided (already
// strings, may include "€") and shown next to each dish — the fixed-price
// tasting-menu badges only make sense for the demo COURSES, so they're
// hidden when a real (per-dish-priced) menu is present.
function buildCourses(items: { name: string; price: string; description?: string; category?: string }[]) {
  const order: string[] = [];
  const grouped: Record<string, { name: string; note: string; price: string }[]> = {};
  for (const item of items) {
    const cat = item.category || "Menu";
    if (!grouped[cat]) { grouped[cat] = []; order.push(cat); }
    grouped[cat].push({ name: item.name, note: item.description || "", price: item.price });
  }
  return order.map((cat) => ({ label: cat, title: cat, items: grouped[cat] }));
}

// ─── Events ───────────────────────────────────────────────────────────────────
const EVENTS = [
  { date: "14 Juin 2026", title: "Dîner des Vignerons", desc: "Un voyage gustatif à travers les grands crus de Bourgogne, en présence du domaine Leflaive.", seats: "12 couverts" },
  { date: "21 Juillet 2026", title: "Soirée Truffe d'Été", desc: "Menu entièrement dédié à la truffe noire melanosporum de nos partenaires du Périgord.", seats: "8 couverts" },
  { date: "3 Septembre 2026", title: "Table du Chef", desc: "Une expérience unique : dîner en cuisine, face aux fourneaux, avec commentaires du chef.", seats: "6 couverts" },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useParallax(value: ReturnType<typeof useMotionValue>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated horizontal divider line */
function GoldLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <div ref={ref} style={{ width: "100%", height: 1, background: C.border, position: "relative", overflow: "hidden", margin: "0 0 2.5rem 0" }}>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight}, transparent)`, transformOrigin: "left" }}
      />
    </div>
  )
}

/** Floating label input field */
function ElegantField({
  label,
  type = "text",
  children,
}: {
  label: string
  type?: string
  children?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)

  const isSelect = type === "select"

  return (
    <div style={{ position: "relative", marginBottom: "2rem" }}>
      <motion.label
        animate={{
          y: focused || filled ? -22 : 0,
          scale: focused || filled ? 0.78 : 1,
          color: focused ? C.gold : C.creamMuted,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: font.sans,
          fontWeight: 300,
          fontSize: "0.875rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      >
        {label}
      </motion.label>

      {isSelect ? (
        <select
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setFilled(e.target.value !== "") }}
          onChange={(e) => setFilled(e.target.value !== "")}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${C.border}`,
            color: C.cream,
            fontFamily: font.sans,
            fontWeight: 300,
            fontSize: "0.95rem",
            padding: "1.2rem 0 0.5rem 0",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setFilled(e.target.value !== "") }}
          onChange={(e) => setFilled(e.target.value !== "")}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${C.border}`,
            color: C.cream,
            fontFamily: font.sans,
            fontWeight: 300,
            fontSize: "0.95rem",
            padding: "1.2rem 0 0.5rem 0",
            outline: "none",
          }}
        />
      )}

      {/* Animated underline */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, overflow: "hidden" }}>
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0, background: C.gold, transformOrigin: "left" }}
        />
      </div>
    </div>
  )
}

/** Pulsing SVG dot for the map */
function MapDot({ dot, onClick, active }: { dot: typeof INGREDIENT_DOTS[0]; onClick: () => void; active: boolean }) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Pulse ring */}
      <motion.circle
        cx={dot.cx} cy={dot.cy} r={10}
        fill="none"
        stroke={dot.color}
        strokeWidth={1.5}
        initial={{ scale: 0.6, opacity: 0.6 }}
        animate={{ scale: [0.6, 1.6, 0.6], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1.5 }}
        style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
      />
      {/* Inner dot */}
      <motion.circle
        cx={dot.cx} cy={dot.cy} r={5}
        fill={dot.color}
        whileHover={{ scale: 1.5 }}
        animate={{ scale: active ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    </g>
  )
}

/** Chef signature swirl drawn on hover */
function SignatureSwirl({ draw }: { draw: boolean }) {
  const pathLength = useMotionValue(0)
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (draw) {
      animate(pathLength, 1, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
    } else {
      animate(pathLength, 0, { duration: 0.4 })
    }
  }, [draw, pathLength])

  return (
    <svg viewBox="0 0 200 60" style={{ width: 180, height: 50, position: "absolute", bottom: -20, right: 20 }}>
      <motion.path
        ref={ref}
        d="M 10 40 C 30 10, 50 50, 70 30 C 90 10, 110 45, 130 25 C 150 5, 165 35, 190 20"
        fill="none"
        stroke={C.gold}
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{ pathLength }}
      />
    </svg>
  )
}

/** Course card — slides up on scroll */
function CourseCard({ course, index }: { course: typeof COURSES[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: "3.5rem" }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "0.5rem" }}>
        <span style={{
          fontFamily: font.sans,
          fontSize: "0.68rem",
          fontWeight: 400,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: C.gold,
        }}>
          {course.label}
        </span>
        <h3 style={{
          fontFamily: font.serif,
          fontSize: "clamp(1.4rem, 2vw, 1.9rem)",
          fontStyle: "italic",
          fontWeight: 400,
          color: C.cream,
          margin: 0,
        }}>
          {course.title}
        </h3>
      </div>

      {/* Line drawing in from left */}
      <div style={{ width: "100%", height: 1, background: C.borderLight, position: "relative", overflow: "hidden", marginBottom: "1.5rem" }}>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.gold}60, transparent)`, transformOrigin: "left" }}
        />
      </div>

      {course.items.map((item: any, i) => (
        <div key={i} style={{ marginBottom: "1.4rem", paddingLeft: "1.5rem", borderLeft: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
            <p style={{
              fontFamily: font.serif,
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: C.cream,
              margin: "0 0 0.3rem 0",
            }}>
              {item.name}
            </p>
            {item.price && (
              <span style={{
                fontFamily: font.sans,
                fontSize: "0.78rem",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: C.gold,
                whiteSpace: "nowrap",
              }}>
                {item.price}
              </span>
            )}
          </div>
          <p style={{
            fontFamily: font.sans,
            fontSize: "0.8rem",
            fontWeight: 300,
            color: C.creamMuted,
            margin: 0,
            letterSpacing: "0.04em",
            lineHeight: 1.6,
          }}>
            {item.note}
          </p>
        </div>
      ))}
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact211Page() {
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

  // Real client menu (from the wizard) or template demo tasting-menu courses.
  const hasRealMenu = !!(c?.menuItems && c.menuItems.length > 0);
  const courses = hasRealMenu ? buildCourses(c.menuItems) : COURSES;

  const [activeMapDot, setActiveMapDot] = useState<string | null>(null)
  const [chefHovered, setChefHovered] = useState(false)
  const [reservationLoading, setReservationLoading] = useState(false)
  const [reservationSent, setReservationSent] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const overlayOpacity = useTransform(heroScrollProgress, [0, 0.6], [0, 1])
  const dishY = useTransform(heroScrollProgress, [0, 1], [0, 80])
  const heroTextY = useTransform(heroScrollProgress, [0, 0.6], [0, -40])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, []);

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
  }, [c]);const handleReservation = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setReservationLoading(true)
    setTimeout(() => {
      setReservationLoading(false)
      setReservationSent(true)
    }, 2200)
  }, [])

  const activeDot = INGREDIENT_DOTS.find(d => d.id === activeMapDot)

  // ─── Styles ────────────────────────────────────────────────────────────────
  const sectionStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 2rem",
  }

  const eyebrowStyle: React.CSSProperties = {
    fontFamily: font.sans,
    fontSize: "0.68rem",
    fontWeight: 400,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: C.gold,
    marginBottom: "1.2rem",
    display: "block",
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: font.serif,
    fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
    fontStyle: "italic",
    fontWeight: 400,
    color: C.cream,
    lineHeight: 1.15,
    margin: "0 0 1.5rem 0",
  }

  const bodyStyle: React.CSSProperties = {
    fontFamily: font.sans,
    fontSize: "0.9rem",
    fontWeight: 300,
    color: C.creamMuted,
    lineHeight: 1.85,
    letterSpacing: "0.03em",
  }

  return (
    <div style={{ background: C.bg, color: C.cream, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Global Styles ───────────────────────────────────────────────────── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.gold}40; color: ${C.cream}; }
        input, select, textarea, button { font-family: inherit; }
        select option { background: ${C.bgAlt}; color: ${C.cream}; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@300;400&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <motion.nav
        animate={{ backgroundColor: scrolled ? "rgba(13,11,8,0.95)" : "transparent" }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: font.serif, fontSize: "1.6rem", fontStyle: "italic", letterSpacing: "0.06em", color: C.cream }}
          >{fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>{fd?.businessName ?? "Maison Éclat"}</>
          )}</motion.div>

          <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {["Histoire", "Menu", "Terroir", "Chef", "Réservation"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace("é", "e")}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
                style={{
                  fontFamily: font.sans,
                  fontSize: "0.72rem",
                  fontWeight: 300,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.creamMuted,
                  textDecoration: "none",
                  display: "none",
                }}
                className="nav-link"
                whileHover={{ color: C.gold }}
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              href="#reservation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{
                fontFamily: font.sans,
                fontSize: "0.72rem",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.bg,
                background: C.gold,
                padding: "0.65rem 1.5rem",
                textDecoration: "none",
                letterSpacing: "0.15em",
              }}
              className="nav-cta-211"
              whileHover={{ background: C.goldLight }}
            >
              Réserver
            </motion.a>

            <button
              className="mb211-burger"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Menu"
              style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <span style={{ display: "block", width: 24, height: 1.5, background: C.creamMuted, transition: "all 0.3s", transform: navOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
              <span style={{ display: "block", width: 24, height: 1.5, background: C.creamMuted, transition: "all 0.3s", opacity: navOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 24, height: 1.5, background: C.creamMuted, transition: "all 0.3s", transform: navOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
            </button>
          </nav>
        </div>

        {navOpen && (
          <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(13,11,8,0.97)", borderBottom: `1px solid ${C.border}`, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
            {["Histoire", "Menu", "Terroir", "Chef", "Réservation"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace("é", "e")}`} onClick={() => setNavOpen(false)} style={{ fontFamily: font.sans, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted, textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
        )}

        <style>{`
          @media (min-width: 800px) { .nav-link { display: block !important; } .nav-cta-211 { display: inline-flex !important; } }
          @media (max-width: 799px) { .nav-cta-211 { display: none !important; } .mb211-burger { display: flex !important; } }
        `}</style>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="hero"
        ref={heroRef}
        style={{ position: "relative", height: "115vh", minHeight: "900px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
      >
        {/* Background texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, #1a1510 0%, ${C.bg} 70%)`,
        }} />

        {/* Grain overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.6,
          pointerEvents: "none",
        }} />

        {/* CSS Dish — centered, parallax */}
        <motion.div
          style={{ position: "relative", zIndex: 2, y: dishY }}
        >
          {/* Plate */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 35% 35%, #f8f4ed, #e8e0ce, #d4c9b0)`,
              boxShadow: `0 0 0 2px rgba(201,168,76,0.3), 0 0 0 12px rgba(201,168,76,0.06), 0 40px 120px rgba(0,0,0,0.8)`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Plate rim decorative ring */}
            <div style={{
              position: "absolute",
              inset: 16,
              borderRadius: "50%",
              border: `1px solid rgba(201,168,76,0.35)`,
              pointerEvents: "none",
            }} />

            {/* Food elements — geometric art */}
            {/* Main element: meat/poisson silhouette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                position: "absolute",
                width: 90,
                height: 55,
                background: "linear-gradient(135deg, #4a2c0a, #7a4a18, #5c3510)",
                borderRadius: "45% 55% 40% 60% / 50% 45% 55% 50%",
                top: "38%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            />

            {/* Sauce pools */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                position: "absolute",
                width: 50,
                height: 22,
                background: "linear-gradient(135deg, #2a1505, #4a2c0a)",
                borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
                top: "52%",
                left: "30%",
                opacity: 0.85,
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                position: "absolute",
                width: 35,
                height: 15,
                background: "#8B2000",
                borderRadius: "50%",
                top: "44%",
                left: "62%",
                opacity: 0.7,
              }}
            />

            {/* Herb garnish */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
              style={{
                position: "absolute",
                width: 8,
                height: 28,
                background: "#2d5a1e",
                borderRadius: "50%",
                top: "30%",
                left: "54%",
                transform: "rotate(-15deg)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.85, type: "spring" }}
              style={{
                position: "absolute",
                width: 6,
                height: 22,
                background: "#3a7025",
                borderRadius: "50%",
                top: "28%",
                left: "49%",
                transform: "rotate(10deg)",
              }}
            />

            {/* Gold dots — caviar */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
                style={{
                  position: "absolute",
                  width: 5,
                  height: 5,
                  background: C.gold,
                  borderRadius: "50%",
                  top: `${40 + Math.sin(i * 1.2) * 10}%`,
                  left: `${38 + i * 5}%`,
                  boxShadow: `0 0 6px ${C.gold}80`,
                }}
              />
            ))}

            {/* Microgreens accent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{
                position: "absolute",
                width: 30,
                height: 14,
                background: "#1a4a10",
                borderRadius: "70% 30% 60% 40% / 40% 60% 40% 60%",
                top: "32%",
                left: "42%",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Scroll-activated text overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: overlayOpacity,
            background: "rgba(13,11,8,0.7)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <motion.p style={{ ...eyebrowStyle, textAlign: "center" }}>Paris · Étoilé Michelin</motion.p>
          <h1 style={{
            fontFamily: font.serif,
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: C.cream,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}>{c?.heroHeadline ?? <>
            Une expérience<br />hors du temps
          </>}</h1>
        </motion.div>

        {/* Initial hero text */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            x: "-50%",
            y: heroTextY,
            textAlign: "center",
            zIndex: 4,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p style={{
            fontFamily: font.serif,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: C.cream,
            marginBottom: "0.5rem",
          }}>{c?.heroSubline ?? fd?.tagline ?? <>{fd?.businessName ?? "Maison Éclat"}</>}</p>
          <p style={{ ...eyebrowStyle, textAlign: "center", marginBottom: "2rem" }}>
            7ème arrondissement · Paris
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: C.gold, fontSize: "1.2rem" }}
          >
            ↓
          </motion.div>
        </motion.div>

        {/* Side decorative text */}
        <div style={{
          position: "absolute",
          right: "3rem",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: font.sans,
          fontSize: "0.65rem",
          fontWeight: 300,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.gold,
          opacity: 0.6,
        }}>
          Gastronomie Française
        </div>
        <div style={{
          position: "absolute",
          left: "3rem",
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontFamily: font.sans,
          fontSize: "0.65rem",
          fontWeight: 300,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.gold,
          opacity: 0.6,
        }}>
          Depuis 1978
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — HISTOIRE
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="histoire" style={{ padding: "8rem 0" }}>
        <div className="imx-mobstack" style={{ ...sectionStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <style>{`
            @media (max-width: 768px) {
              .histoire-grid { grid-template-columns: 1fr !important; }
              .histoire-visual { order: -1; }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={eyebrowStyle}>Notre histoire</span>
            <h2 style={sectionTitleStyle}>{c?.aboutTitle ?? fd?.businessName ?? <>
              L&apos;art de<br />la table française
            </>}</h2>
            <GoldLine delay={0.2} />
            <p style={{ ...bodyStyle, marginBottom: "1.5rem" }}>{c?.aboutText ?? <>
              Fondée en 1978 par le chef Jean-Pierre Mercier dans le 7ème arrondissement de Paris, la Maison Éclat incarne quatre décennies d&apos;excellence gastronomique. Nichée à deux pas du Musée d&apos;Orsay, notre maison cultive une philosophie singulière : honorer les produits d&apos;exception en leur donnant la parole.
            </>}</p>
            <p style={bodyStyle}>
              Aujourd&apos;hui portée par Adrien Mercier, fils du fondateur et formé chez Robuchon et Pierre Gagnaire, la Maison Éclat reçoit deux étoiles Michelin depuis 2019. Chaque assiette est une conversation entre la mémoire familiale et l&apos;audace contemporaine.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: "flex", gap: "3rem", marginTop: "3rem" }}
            >
              {[{ num: "2★", label: "Étoiles Michelin" }, { num: "47", label: "Ans d'histoire" }, { num: "12", label: "Couverts par service" }].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: font.serif, fontSize: "2.2rem", fontStyle: "italic", color: C.gold, lineHeight: 1 }}>{stat.num}</div>
                  <div style={{ fontFamily: font.sans, fontSize: "0.72rem", fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: C.creamMuted, marginTop: "0.4rem" }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="histoire-visual"
            style={{ position: "relative" }}
          >
            {/* Decorative frame */}
            <div style={{
              width: "100%",
              aspectRatio: "3/4",
              background: `linear-gradient(145deg, #1a1510, #241e16)`,
              border: `1px solid ${C.border}`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* Abstract interior art */}
              <svg viewBox="0 0 300 400" style={{ width: "80%", height: "80%", opacity: 0.5 }}>
                <circle cx="150" cy="200" r="80" fill="none" stroke={C.gold} strokeWidth="0.5" />
                <circle cx="150" cy="200" r="120" fill="none" stroke={C.gold} strokeWidth="0.3" />
                <line x1="30" y1="200" x2="270" y2="200" stroke={C.gold} strokeWidth="0.3" opacity="0.4" />
                <line x1="150" y1="30" x2="150" y2="370" stroke={C.gold} strokeWidth="0.3" opacity="0.4" />
                <path d="M 70 120 Q 150 80 230 120 Q 270 200 230 280 Q 150 320 70 280 Q 30 200 70 120 Z" fill="none" stroke={C.gold} strokeWidth="0.5" />
                <text x="150" y="205" textAnchor="middle" fill={C.gold} fontSize="12" fontFamily={font.serif} fontStyle="italic" opacity="0.8">{fd?.businessName ?? "Maison Éclat"}</text>
                <text x="150" y="222" textAnchor="middle" fill={C.creamMuted} fontSize="7" fontFamily={font.sans} opacity="0.6" letterSpacing="3">PARIS · MMXXVI</text>
              </svg>

              {/* Corner decorations */}
              {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                <div key={pos} style={{
                  position: "absolute",
                  [pos.includes("top") ? "top" : "bottom"]: 16,
                  [pos.includes("left") ? "left" : "right"]: 16,
                  width: 24,
                  height: 24,
                  borderTop: pos.includes("top") ? `1px solid ${C.gold}60` : "none",
                  borderBottom: pos.includes("bottom") ? `1px solid ${C.gold}60` : "none",
                  borderLeft: pos.includes("left") ? `1px solid ${C.gold}60` : "none",
                  borderRight: pos.includes("right") ? `1px solid ${C.gold}60` : "none",
                }} />
              ))}
            </div>

            {/* Gold accent line */}
            <div style={{
              position: "absolute",
              bottom: -24,
              right: -24,
              width: "50%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C.gold})`,
            }} />
            <div style={{
              position: "absolute",
              bottom: -24,
              right: -24,
              width: 1,
              height: "30%",
              background: `linear-gradient(180deg, ${C.gold}, transparent)`,
            }} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — MENU SCROLL REVEAL
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="menu" style={{ padding: "8rem 0", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: "center", marginBottom: "6rem" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={eyebrowStyle}
            >
              Menu Dégustation
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={sectionTitleStyle}
            >
              Le parcours du Chef
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ ...bodyStyle, maxWidth: 520, margin: "0 auto 2rem", textAlign: "center" }}
            >
              Un voyage en sept actes, composé selon les arrivages du marché et l&apos;inspiration du moment. Allergènes et régimes spéciaux sur demande.
            </motion.p>

            {!hasRealMenu && (
              <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
                {["Menu Éclat — 195 €", "Accord mets & vins — 135 €"].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    style={{
                      fontFamily: font.sans,
                      fontSize: "0.78rem",
                      fontWeight: 300,
                      letterSpacing: "0.12em",
                      color: C.gold,
                      border: `1px solid ${C.border}`,
                      padding: "0.6rem 1.4rem",
                    }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 5rem" }}>
            <style>{`@media (max-width: 700px) { .menu-grid { grid-template-columns: 1fr !important; } }`}</style>
            {courses.map((course, i) => (
              <CourseCard key={course.label} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — INGREDIENT PROVENANCE MAP
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="terroir" style={{ padding: "8rem 0" }}>
        <div style={sectionStyle}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={eyebrowStyle}>Nos producteurs</span>
              <h2 style={sectionTitleStyle}>
                La carte<br />du terroir
              </h2>
              <GoldLine />
              <p style={{ ...bodyStyle, marginBottom: "2rem" }}>
                Chaque ingrédient porte en lui une histoire, un lieu, un homme. Nous travaillons en direct avec nos producteurs depuis plus de vingt ans, construisant des relations fondées sur la confiance, le respect du vivant et l&apos;excellence partagée.
              </p>
              <p style={bodyStyle}>
                Cliquez sur les points pour découvrir nos partenaires producteurs et les ingrédients d&apos;exception qu&apos;ils nous confient.
              </p>

              {/* Active dot info */}
              <AnimatePresence mode="wait">
                {activeDot && (
                  <motion.div
                    key={activeDot.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      marginTop: "2rem",
                      padding: "1.5rem",
                      border: `1px solid ${C.border}`,
                      background: "rgba(201,168,76,0.04)",
                    }}
                  >
                    <div style={{ ...eyebrowStyle, marginBottom: "0.5rem" }}>{activeDot.label}</div>
                    <div style={{ ...bodyStyle, fontSize: "0.85rem" }}>{activeDot.producer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* SVG France Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative" }}
            >
              <svg
                viewBox="0 0 400 450"
                style={{ width: "100%", maxWidth: 460 }}
              >
                {/* Simplified France outline */}
                <path
                  d="M 160 30 L 200 20 L 240 35 L 290 50 L 340 90 L 360 130 L 355 170 L 340 200 L 350 230 L 330 270 L 300 310 L 280 350 L 240 380 L 200 395 L 160 380 L 130 350 L 100 310 L 80 280 L 60 250 L 50 210 L 55 175 L 70 145 L 65 110 L 85 75 L 120 45 Z"
                  fill="rgba(201,168,76,0.05)"
                  stroke={C.border}
                  strokeWidth="1.5"
                />
                {/* Internal texture lines */}
                <path d="M 120 45 L 160 30 L 200 20" fill="none" stroke={C.border} strokeWidth="0.5" />
                <path d="M 55 175 L 100 180 L 150 170 L 200 185 L 250 175 L 300 190 L 340 200" fill="none" stroke={C.border} strokeWidth="0.5" />
                <path d="M 80 280 L 130 265 L 180 275 L 230 265 L 280 275" fill="none" stroke={C.border} strokeWidth="0.5" />

                {/* Ingredient dots */}
                {INGREDIENT_DOTS.map((dot) => (
                  <MapDot
                    key={dot.id}
                    dot={dot}
                    onClick={() => setActiveMapDot(activeMapDot === dot.id ? null : dot.id)}
                    active={activeMapDot === dot.id}
                  />
                ))}

                {/* Labels */}
                {INGREDIENT_DOTS.map((dot) => (
                  activeMapDot === dot.id && (
                    <motion.text
                      key={`label-${dot.id}`}
                      x={dot.cx + 14}
                      y={dot.cy + 4}
                      fill={dot.color}
                      fontSize="9"
                      fontFamily={font.sans}
                      fontWeight="300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {dot.label.split(" ")[0]}
                    </motion.text>
                  )
                ))}

                {/* France label */}
                <text x="200" y="220" textAnchor="middle" fill={C.gold} fontSize="10" fontFamily={font.serif} fontStyle="italic" opacity="0.3">France</text>
              </svg>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "1.5rem" }}>
                {INGREDIENT_DOTS.map((dot) => (
                  <button
                    key={dot.id}
                    onClick={() => setActiveMapDot(activeMapDot === dot.id ? null : dot.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: activeMapDot === dot.id ? "rgba(201,168,76,0.1)" : "transparent",
                      border: `1px solid ${activeMapDot === dot.id ? C.gold + "50" : C.border}`,
                      padding: "0.4rem 0.8rem",
                      cursor: "pointer",
                      color: C.creamMuted,
                      fontFamily: font.sans,
                      fontSize: "0.72rem",
                      fontWeight: 300,
                      letterSpacing: "0.08em",
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot.color, flexShrink: 0 }} />
                    {dot.label.split(" ").slice(0, 2).join(" ")}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — CHEF PROFILE
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="chef" style={{ padding: "8rem 0", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={sectionStyle}>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>

            {/* Chef portrait with hover zoom + signature */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative" }}
            >
              <motion.div
                onHoverStart={() => setChefHovered(true)}
                onHoverEnd={() => setChefHovered(false)}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={{
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/4",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                {/* Portrait placeholder — elegant CSS */}
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(160deg, #1e1a14, #2a2318, #1a1610)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Head shape */}
                  <div style={{
                    width: 120,
                    height: 140,
                    background: `linear-gradient(160deg, #c8a882, #b89268, #a07848)`,
                    borderRadius: "50% 50% 45% 45%",
                    position: "absolute",
                    top: "18%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                  }} />
                  {/* Body/torso */}
                  <div style={{
                    width: 180,
                    height: 200,
                    background: `linear-gradient(160deg, #f5f0e4, #e8e2d4)`,
                    borderRadius: "50% 50% 0 0",
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }} />
                  {/* Chef hat */}
                  <div style={{width: 100,
                    height: 70,
                    background: brand ?? '#f5f0e4',
                    borderRadius: "8px 8px 2px 2px",
                    position: "absolute",
                    top: "6%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }} />
                  <div style={{
                    width: 130,
                    height: 20,
                    background: "#e8e2d4",
                    position: "absolute",
                    top: "18%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }} />

                  {/* Overlay on hover */}
                  <motion.div
                    animate={{ opacity: chefHovered ? 0.3 : 0 }}
                    style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.gold}30, transparent)` }}
                  />
                </div>

                {/* Bio text slides up on hover */}
                <AnimatePresence>
                  {chefHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "2rem 1.5rem 1.5rem",
                        background: "linear-gradient(to top, rgba(13,11,8,0.95) 0%, rgba(13,11,8,0.5) 80%, transparent 100%)",
                      }}
                    >
                      <p style={{ ...bodyStyle, fontSize: "0.82rem", color: C.cream }}>
                        Formé chez Robuchon à Monaco et Gagnaire à Paris, Adrien Mercier incarne la troisième génération d&apos;une lignée de chefs passionnés par le produit brut et la précision technique.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Signature SVG */}
              <SignatureSwirl draw={chefHovered} />
            </motion.div>

            {/* Bio text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={eyebrowStyle}>Le Chef</span>
              <h2 style={sectionTitleStyle}>
                Adrien<br />Mercier
              </h2>
              <GoldLine />

              <p style={{ ...bodyStyle, marginBottom: "1.5rem" }}>
                Né dans les cuisines de la Maison Éclat, Adrien Mercier a grandi entre les odeurs du beurre noisette et les discussions animées de son père avec les producteurs. À vingt-deux ans, il quitte Paris pour parfaire son art auprès des plus grands noms de la gastronomie mondiale.
              </p>
              <p style={{ ...bodyStyle, marginBottom: "1.5rem" }}>
                Son retour en 2017 marque un tournant : il impose sa propre lecture de la gastronomie française, plus introspective, nourrie de voyages et d&apos;une obsession pour le terroir. En 2019, la Maison Éclat décroche sa deuxième étoile Michelin.
              </p>
              <p style={bodyStyle}>
                <em style={{ fontFamily: font.serif, fontSize: "1.05rem", fontStyle: "italic", color: C.cream }}>
                  &ldquo;Je ne cuisine pas pour épater, je cuisine pour émouvoir. Un repas réussi, c&apos;est celui dont on se souvient un an plus tard.&rdquo;
                </em>
              </p>

              {/* Accolades */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "2.5rem" }}>
                {[
                  "★★ Michelin — depuis 2019",
                  "17/20 Gault & Millau — Chef de l'Année 2022",
                  "Meilleur Ouvrier de France — 2016",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: 24, height: 1, background: C.gold, flexShrink: 0 }} />
                    <span style={{ fontFamily: font.sans, fontSize: "0.8rem", fontWeight: 300, color: C.creamMuted, letterSpacing: "0.06em" }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — EVENTS
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="evenements" style={{ padding: "8rem 0" }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={eyebrowStyle}
            >
              Agenda
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={sectionTitleStyle}
            >
              Événements<br />& Dîners privés
            </motion.h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            <style>{`@media (max-width: 768px) { .events-grid { grid-template-columns: 1fr !important; } }`}</style>
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                style={{
                  padding: "2.5rem",
                  border: `1px solid ${C.border}`,
                  background: C.bgAlt,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* Gold corner */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 2, background: C.gold }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 40, background: C.gold }} />

                <div style={{ ...eyebrowStyle, marginBottom: "1rem" }}>{event.date}</div>
                <h3 style={{
                  fontFamily: font.serif,
                  fontSize: "1.4rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: C.cream,
                  marginBottom: "1rem",
                  lineHeight: 1.25,
                }}>
                  {event.title}
                </h3>
                <p style={{ ...bodyStyle, fontSize: "0.82rem", marginBottom: "1.5rem" }}>
                  {event.desc}
                </p>
                <div style={{
                  fontFamily: font.sans,
                  fontSize: "0.72rem",
                  fontWeight: 300,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.gold,
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: "1rem",
                }}>
                  {event.seats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — RESERVATION FORM
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="reservation" style={{ padding: "8rem 0", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ ...sectionStyle, maxWidth: 680 }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={eyebrowStyle}
            >
              Réservation
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={sectionTitleStyle}
            >
              Réserver<br />votre table
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ ...bodyStyle, maxWidth: 480, margin: "0 auto" }}
            >
              La Maison Éclat reçoit douze couverts par service. Nous vous invitons à réserver au minimum 21 jours à l&apos;avance. Toute réservation est confirmée par notre équipe dans les 24 heures.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {reservationSent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: "center", padding: "4rem 2rem" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: `1px solid ${C.gold}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 2rem",
                    fontSize: "1.4rem",
                    color: C.gold,
                  }}
                >
                  ✓
                </motion.div>
                <h3 style={{ ...sectionTitleStyle, fontSize: "1.8rem" }}>
                  Demande reçue
                </h3>
                <p style={{ ...bodyStyle, marginTop: "1rem" }}>
                  Notre équipe vous contactera dans les 24 heures pour confirmer votre réservation. Nous nous réjouissons de vous accueillir.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleReservation}
              >
                <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 3rem" }}>
                  <style>{`@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr !important; } }`}</style>
                  <ElegantField label="Prénom" />
                  <ElegantField label="Nom" />
                </div>
                <ElegantField label="Adresse e-mail" type="email" />
                <ElegantField label="Téléphone" type="tel" />
                <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 3rem" }}>
                  <ElegantField label="Date souhaitée" type="date" />
                  <ElegantField label="Heure" type="select">
                    <option value="">—</option>
                    <option value="19:00">19h00 — Service du soir</option>
                    <option value="19:30">19h30 — Service du soir</option>
                    <option value="20:00">20h00 — Service du soir</option>
                    <option value="20:30">20h30 — Service du soir</option>
                    <option value="21:00">21h00 — Service du soir</option>
                  </ElegantField>
                </div>
                <ElegantField label="Nombre de couverts" type="select">
                  <option value="">—</option>
                  {[2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>
                  ))}
                </ElegantField>
                <ElegantField label="Occasion spéciale ou remarque (facultatif)" />

                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <motion.button
                    type="submit"
                    whileHover={reservationLoading ? {} : { backgroundColor: C.goldLight }}
                    whileTap={reservationLoading ? {} : { scale: 0.98 }}
                    disabled={reservationLoading}
                    style={{
                      background: C.gold,
                      color: C.bg,
                      border: "none",
                      padding: "1.1rem 3.5rem",
                      fontFamily: font.sans,
                      fontSize: "0.78rem",
                      fontWeight: 400,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: reservationLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "1rem",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {reservationLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `1px solid ${C.bg}`,
                            borderTopColor: "transparent",
                          }}
                        />
                        Envoi en cours…
                      </>
                    ) : (
                      "Demander une réservation"
                    )}
                  </motion.button>
                </div>

                <p style={{ ...bodyStyle, fontSize: "0.72rem", textAlign: "center", marginTop: "1.5rem", opacity: 0.6 }}>
                  En soumettant ce formulaire, vous acceptez nos conditions générales. Une empreinte bancaire pourra être demandée à la confirmation.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8 — CONTACT & FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer id="contact" style={{ padding: "5rem 0 3rem", borderTop: `1px solid ${C.border}` }}>
        <div style={sectionStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "4rem", marginBottom: "5rem" }}>
            <style>{`@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }`}</style>

            <div>
              <div style={{ fontFamily: font.serif, fontSize: "2rem", fontStyle: "italic", color: C.cream, marginBottom: "1.2rem" }}>{fd?.businessName ?? "Maison Éclat"}</div>
              <p style={{ ...bodyStyle, marginBottom: "1.5rem", maxWidth: 320 }}>
                Un restaurant gastronomique parisien au cœur du 7ème arrondissement, entre tradition et innovation, produit et émotion.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                {["★★", "MOF", "GM 17"].map((badge) => (
                  <div key={badge} style={{
                    border: `1px solid ${C.border}`,
                    padding: "0.4rem 0.8rem",
                    fontFamily: font.sans,
                    fontSize: "0.68rem",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                    color: C.gold,
                  }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, marginBottom: "1.5rem" }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {[
                  { label: "Réservations", value: "+33 1 42 61 XX XX" },
                  { label: "Email", value: "table@maisoneclat.fr" },
                  { label: "Adresse", value: "14 rue de Varenne, 75007 Paris" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontFamily: font.sans, fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: "0.2rem" }}>{item.label}</div>
                    <div style={{ fontFamily: font.sans, fontSize: "0.82rem", fontWeight: 300, color: C.creamMuted }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, marginBottom: "1.5rem" }}>Horaires</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { day: "Mardi – Samedi", hours: "19h30 – 22h30" },
                  { day: "Dimanche", hours: "Fermé" },
                  { day: "Lundi", hours: "Fermé" },
                ].map((item) => (
                  <div key={item.day} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ fontFamily: font.sans, fontSize: "0.78rem", fontWeight: 300, color: C.creamMuted }}>{item.day}</span>
                    <span style={{ fontFamily: font.sans, fontSize: "0.78rem", fontWeight: 300, color: item.hours === "Fermé" ? C.gold + "80" : C.cream }}>{item.hours}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2rem" }}>
                <div style={{ ...eyebrowStyle, marginBottom: "1rem" }}>Réseaux</div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {["Instagram", "Facebook"].map((social) => (
                    <motion.a
                      key={social}
                      href={social === "Instagram" ? "https://instagram.com" : "https://facebook.com"}
                      whileHover={{ color: C.gold }}
                      style={{
                        fontFamily: font.sans,
                        fontSize: "0.72rem",
                        fontWeight: 300,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: C.creamMuted,
                        textDecoration: "none",
                      }}
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontFamily: font.sans, fontSize: "0.72rem", fontWeight: 300, color: C.creamMuted, opacity: 0.5, letterSpacing: "0.06em" }}>
              © 2026 Maison Éclat · Tous droits réservés · SIRET 123 456 789 00010
            </p>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map((link) => (
                <motion.a
                  key={link}
                  href="#contact"
                  whileHover={{ color: C.gold }}
                  style={{
                    fontFamily: font.sans,
                    fontSize: "0.7rem",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: C.creamMuted,
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Brand mark bottom center */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <div style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
            }}>
              <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.gold}60)` }} />
              <span style={{
                fontFamily: font.serif,
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: C.gold,
                opacity: 0.4,
                letterSpacing: "0.15em",
              }}>
                Maison Éclat · Paris
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
