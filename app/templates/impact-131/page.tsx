"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { TemplateIcon } from '@/components/TemplateIcon';

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const C = {
  bg: "#F8F4EE",
  bgCard: "#EDE6D8",
  bgDark: "#1A0E08",
  burgundy: "#7A2535",
  gold: "#C9A86C",
  dark: "#1E1208",
  muted: "#8A7868",
  border: "rgba(122,37,53,0.14)",
  white: "#FFFFFF",
  fontSerif: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'Montserrat', system-ui, sans-serif",
};

/* ==========================================================================
   GOOGLE FONTS
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
}

/* ==========================================================================
   WINES DATA
   ========================================================================== */

const WINES = [
  {
    id: "prestige",
    name: "Cuvée Prestige",
    vintage: "2020",
    appellation: "AOC Bordeaux Grand Cru",
    price: "€240",
    desc: "Le pinacle de notre domaine. Une robe pourpre intense aux reflets violines, un nez de fruits noirs confits, de cèdre et de réglisse. En bouche, la structure tannique est d'une finesse absolue.",
    notes: ["Cassis", "Cèdre", "Truffe"],
    abv: "13.5%",
    aging: "24 mois en fûts de chêne neuf",
  },
  {
    id: "reserve",
    name: "Cuvée Réserve",
    vintage: "2021",
    appellation: "AOC Bordeaux",
    price: "€95",
    desc: "L'expression la plus pure de notre terroir argilo-calcaire. Un vin de gastronomie, d'une élégance discrète et d'une persistance aromatique remarquable.",
    notes: ["Mûre", "Violette", "Épices"],
    abv: "13%",
    aging: "18 mois en fûts de chêne",
  },
  {
    id: "blanc",
    name: "Blanc de Grâce",
    vintage: "2022",
    appellation: "Bordeaux Blanc",
    price: "€68",
    desc: "Notre blanc de caractère issu de vieilles vignes de Sémillon et Sauvignon Blanc. Rond, généreux, avec une minéralité ciselée qui signe l'identité du domaine.",
    notes: ["Agrumes", "Fleur blanche", "Miel"],
    abv: "12.5%",
    aging: "12 mois sur lies fines",
  },
  {
    id: "rose",
    name: "Rosé d'Une Nuit",
    vintage: "2023",
    appellation: "Bordeaux Rosé",
    price: "€38",
    desc: "Macération pelliculaire de 18 heures sur Cabernet Franc et Merlot. Une robe saumonée, un nez de fraise des bois et de grenade, une bouche vive et saline.",
    notes: ["Fraise", "Grenade", "Pivoine"],
    abv: "12%",
    aging: "Sur inox, 4 mois",
  },
];

/* ==========================================================================
   TERROIR TABS DATA
   ========================================================================== */

const TERROIR_TABS = [
  {
    id: "soil",
    label: "Sol",
    title: "Argilo-calcaire d'exception",
    body: "Notre domaine repose sur un socle géologique unique : des graves garonnaises en surface, révélant un sous-sol calcaire à astéries datant du Stampien (35 millions d'années). Cette double nature confère à nos vins une tension minérale incomparable, gage de grande garde et de finesse.",
    stat: "35M d'années",
    statLabel: "Âge du sous-sol",
  },
  {
    id: "climate",
    label: "Climat",
    title: "Influences atlantiques tempérées",
    body: "Protégés par la forêt des Landes à l'ouest, nos vignes bénéficient d'un micro-climat exceptionnel : été chaud et sec, automne long et ensoleillé. La Garonne toute proche régule les températures nocturnes, préservant l'acidité naturelle des raisins et la complexité aromatique.",
    stat: "2 150h",
    statLabel: "Ensoleillement annuel",
  },
  {
    id: "farming",
    label: "Culture",
    title: "Viticulture en biodynamie",
    body: "Certifiés en agriculture biologique depuis 2018, en biodynamie depuis 2022. Nous travaillons les sols à cheval, favorisons la biodiversité (150 espèces végétales recensées), pratiquons les vendanges manuelles et sélectives. Notre empreinte carbone est compensée par nos 8 hectares de forêt gérée.",
    stat: "Bio",
    statLabel: "Certifié depuis 2018",
  },
];

/* ==========================================================================
   MAGNETIC BUTTON
   ========================================================================== */

function MagneticButton({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, cursor: "pointer", border: "none", background: "transparent", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   TEXT REVEAL
   ========================================================================== */

function TextReveal({ text, style, delay = 0 }: { text: string; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <span ref={ref} style={{ display: "inline-block", overflow: "hidden", ...style }}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ==========================================================================
   MARQUEE STRIP
   ========================================================================== */

const MARQUEE_ITEMS = [
  "Cuvée Prestige 2020",
  "★",
  "Cuvée Réserve 2021",
  "★",
  "Blanc de Grâce 2022",
  "★",
  "Rosé d'Une Nuit 2023",
  "★",
  "Millésime 2019",
  "★",
  "Grand Cru Classé",
  "★",
  "4 Générations",
  "★",
  "28 Hectares",
  "★",
  "6 Cépages",
  "★",
];

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        background: C.bgDark,
        overflow: "hidden",
        padding: "18px 0",
        borderTop: `1px solid rgba(201,168,108,0.18)`,
        borderBottom: `1px solid rgba(201,168,108,0.18)`,
      }}
    >
      <motion.div
        style={{ display: "flex", gap: 48, whiteSpace: "nowrap", willChange: "transform" }}
        animate={{ x: [0, -2400] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === "★" ? "Georgia, serif" : C.fontSans,
              fontSize: item === "★" ? 14 : 11,
              fontWeight: item === "★" ? 400 : 500,
              letterSpacing: item === "★" ? 0 : "0.18em",
              textTransform: "uppercase",
              color: item === "★" ? C.gold : "rgba(201,168,108,0.7)",
              flexShrink: 0,
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   VINE GROWTH SVG — SIGNATURE ELEMENT
   ========================================================================== */

function VineGrowth() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Trunk path
  const trunkPath = "M 20 200 C 80 190, 140 210, 200 195 C 260 180, 320 215, 380 200 C 420 190, 450 195, 480 200";

  // Branching tendrils (spiral curves) at different trunk positions
  const tendrils = [
    { d: "M 80 192 C 80 170, 95 155, 100 140 C 105 125, 95 110, 105 100", delay: 0.6 },
    { d: "M 150 204 C 140 185, 125 175, 120 155 C 115 135, 130 120, 125 108", delay: 0.75 },
    { d: "M 220 196 C 230 175, 248 162, 252 145 C 256 128, 240 115, 248 102", delay: 0.9 },
    { d: "M 300 202 C 295 182, 280 170, 275 152 C 270 134, 285 118, 278 104", delay: 1.05 },
    { d: "M 370 200 C 378 180, 395 168, 400 150 C 405 132, 388 118, 396 104", delay: 1.2 },
    { d: "M 440 196 C 450 175, 468 162, 472 145 C 476 128, 460 114, 468 100", delay: 1.35 },
  ];

  // Grape clusters: each is 7 small circles at staggered positions
  const grapeClusters = [
    {
      cx: 100, cy: 95,
      circles: [
        { cx: 0, cy: 0 }, { cx: 8, cy: -6 }, { cx: -8, cy: -6 },
        { cx: 4, cy: -13 }, { cx: -4, cy: -13 }, { cx: 0, cy: -20 }, { cx: 8, cy: -20 },
      ],
      delay: 1.9,
    },
    {
      cx: 248, cy: 97,
      circles: [
        { cx: 0, cy: 0 }, { cx: 7, cy: -6 }, { cx: -7, cy: -6 },
        { cx: 3, cy: -13 }, { cx: -3, cy: -13 }, { cx: 0, cy: -19 }, { cx: 7, cy: -19 },
      ],
      delay: 2.1,
    },
    {
      cx: 396, cy: 99,
      circles: [
        { cx: 0, cy: 0 }, { cx: 8, cy: -7 }, { cx: -8, cy: -7 },
        { cx: 4, cy: -14 }, { cx: -4, cy: -14 }, { cx: 0, cy: -21 }, { cx: 8, cy: -21 },
      ],
      delay: 2.3,
    },
    {
      cx: 275, cy: 147,
      circles: [
        { cx: 0, cy: 0 }, { cx: 7, cy: -6 }, { cx: -7, cy: -6 },
        { cx: 3, cy: -13 }, { cx: -3, cy: -13 }, { cx: 0, cy: -20 }, { cx: 7, cy: -20 },
      ],
      delay: 2.5,
    },
  ];

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <svg
        viewBox="0 0 500 260"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <motion.path
          d={trunkPath}
          fill="none"
          stroke={C.burgundy}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        {/* Tendrils */}
        {tendrils.map((t, i) => (
          <motion.path
            key={i}
            d={t.d}
            fill="none"
            stroke={C.burgundy}
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: t.delay }}
          />
        ))}

        {/* Leaves — simple ellipses at some tendril tips */}
        {[{ x: 102, y: 98, rotate: -30 }, { x: 250, y: 100, rotate: 15 }, { x: 398, y: 102, rotate: -20 }].map((leaf, i) => (
          <motion.ellipse
            key={i}
            cx={leaf.x}
            cy={leaf.y}
            rx={10}
            ry={6}
            fill="none"
            stroke={C.burgundy}
            strokeWidth={1}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px`, transform: `rotate(${leaf.rotate}deg)` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 0.55 } : {}}
            transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
          />
        ))}

        {/* Grape clusters */}
        {grapeClusters.map((cluster, ci) => (
          <g key={ci}>
            {cluster.circles.map((circle, gi) => (
              <motion.circle
                key={gi}
                cx={cluster.cx + circle.cx}
                cy={cluster.cy + circle.cy}
                r={4.5}
                fill={C.burgundy}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 0.78 } : {}}
                transition={{
                  duration: 0.4,
                  delay: cluster.delay + gi * 0.07,
                  ease: "backOut",
                }}
                style={{ transformOrigin: `${cluster.cx + circle.cx}px ${cluster.cy + circle.cy}px` }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ==========================================================================
   WINE CARD
   ========================================================================== */

function WineCard({ wine, index }: { wine: typeof WINES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        padding: "40px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative number */}
      <span
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          fontFamily: C.fontSerif,
          fontSize: 72,
          fontWeight: 700,
          color: "rgba(122,37,53,0.06)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        style={{
          display: "inline-block",
          background: C.burgundy,
          color: C.bg,
          fontFamily: C.fontSans,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "5px 12px",
          marginBottom: 20,
        }}
      >
        {wine.vintage}
      </div>

      <h3
        style={{
          fontFamily: C.fontSerif,
          fontSize: 28,
          fontWeight: 600,
          color: C.dark,
          margin: "0 0 6px",
          lineHeight: 1.2,
        }}
      >
        {wine.name}
      </h3>
      <p
        style={{
          fontFamily: C.fontSans,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: C.muted,
          margin: "0 0 20px",
        }}
      >
        {wine.appellation}
      </p>
      <p
        style={{
          fontFamily: C.fontSerif,
          fontSize: 16,
          lineHeight: 1.75,
          color: C.muted,
          margin: "0 0 24px",
        }}
      >
        {wine.desc}
      </p>

      {/* Tasting notes */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {wine.notes.map((n) => (
          <span
            key={n}
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.burgundy,
              border: `1px solid ${C.border}`,
              padding: "4px 10px",
            }}
          >
            {n}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${C.border}`,
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontFamily: C.fontSerif,
            fontSize: 26,
            fontWeight: 600,
            color: C.burgundy,
          }}
        >
          {wine.price}
        </span>
        <span
          style={{
            fontFamily: C.fontSans,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {wine.aging}
        </span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   GOLD DIVIDER
   ========================================================================== */

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
      <span style={{ color: C.gold, fontSize: 14 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
    </div>
  );
}

/* ==========================================================================
   SECTION LABEL
   ========================================================================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: C.fontSans,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: C.gold,
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function WineryTemplate() {
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [terroirTab, setTerroirTab] = useState("soil");
  const [vintageSelected, setVintageSelected] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const heroRef = useRef<HTMLDivElement>(null);
  const winesRef = useRef<HTMLDivElement>(null);
  const terroirRef = useRef<HTMLDivElement>(null);
  const visitesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const activeTerroir = TERROIR_TABS.find((t) => t.id === terroirTab) ?? TERROIR_TABS[0];

  const VINTAGES = ["2020", "2019", "2018", "2017", "2016", "2015"];

  
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
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.fontSans, overflowX: "hidden" }}>

      {/* ====================================================================
          1. NAV
          ==================================================================== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(248,244,238,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7v3h6v-3c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" stroke={C.burgundy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 20h6" stroke={C.burgundy} strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontFamily: C.fontSerif,
              fontSize: 20,
              fontWeight: 700,
              color: C.burgundy,
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            Château de Valroc
          </span>
        </div>

        <div id="mb131-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Vins", "Terroir", "Visites", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => {
                const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
                  Vins: winesRef,
                  Terroir: terroirRef,
                  Visites: visitesRef,
                  Contact: contactRef,
                };
                map[item]?.current?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.dark,
                padding: 0,
              }}
            >
              {item}
            </button>
          ))}
          <MagneticButton
            style={{
              background: C.burgundy,
              color: C.bg,
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "10px 22px",
            }}
          >
            Commander
          </MagneticButton>
      </div>
        <button
          className="mb131-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Vins", "Terroir", "Visites", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => {
                const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
                  Vins: winesRef,
                  Terroir: terroirRef,
                  Visites: visitesRef,
                  Contact: contactRef,
                };
                map[item]?.current?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.dark,
                padding: 0,
              }}
            >
              {item}
            </button>
          ))}
          <MagneticButton
            style={{
              background: C.burgundy,
              color: C.bg,
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "10px 22px",
            }}
          >
            Commander
          </MagneticButton>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb131-nav { display: none !important; } .mb131-burger { display: flex !important; } }`}</style>

      {/* ====================================================================
          2. HERO
          ==================================================================== */}
      <section id="hero"
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 72,
          background: C.bg,
        }}
      >
        {/* Layered gradient background */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #f2ebe0 0%, #f8f4ee 50%, #ede5d6 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(139,30,60,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(193,163,100,0.09) 0%, transparent 60%)", pointerEvents: "none" }} />

        {/* Vine watermark background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.12,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 800 600" style={{ width: "90%", height: "90%" }}>
            <path
              d="M 50 500 C 150 400, 250 450, 350 380 C 450 310, 500 200, 600 160 C 680 130, 750 150, 780 100"
              fill="none"
              stroke={C.burgundy}
              strokeWidth={4}
            />
            <path d="M 200 430 C 180 380, 160 340, 170 300 C 180 260, 200 230, 190 200" fill="none" stroke={C.burgundy} strokeWidth={2} />
            <path d="M 400 360 C 420 310, 440 275, 430 240 C 420 205, 400 180, 410 150" fill="none" stroke={C.burgundy} strokeWidth={2} />
            <circle cx={192} cy={195} r={12} fill={C.burgundy} />
            <circle cx={185} cy={182} r={10} fill={C.burgundy} />
            <circle cx={200} cy={180} r={11} fill={C.burgundy} />
            <circle cx={412} cy={145} r={12} fill={C.burgundy} />
            <circle cx={404} cy={133} r={10} fill={C.burgundy} />
            <circle cx={420} cy={132} r={11} fill={C.burgundy} />
          </svg>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", position: "relative", zIndex: 2, padding: "0 24px" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 28,
            }}
          >
            Bordeaux — Depuis 1892
          </motion.p>

          <h1
            style={{
              fontFamily: C.fontSerif,
              fontSize: "clamp(52px, 9vw, 120px)",
              fontWeight: 700,
              color: C.dark,
              lineHeight: 1,
              marginBottom: 16,
              letterSpacing: "-0.01em",
            }}
          >{c?.heroHeadline ?? <>
            <TextReveal text="Château" delay={0.3} />
            <br />
            <TextReveal text="de Valroc" delay={0.5} style={{ color: C.burgundy }} />
          </>}</h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              fontFamily: C.fontSerif,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              fontStyle: "italic",
              color: C.muted,
              marginBottom: 56,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Le Terroir Révélé
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              style={{
                background: C.burgundy,
                color: C.bg,
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 40px",
              }}
              onClick={() => winesRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Découvrir nos vins
            </MagneticButton>
            <MagneticButton
              style={{
                background: "transparent",
                color: C.dark,
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 40px",
                border: `1px solid ${C.border}`,
              }}
            >
              Visiter le domaine
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: "absolute", bottom: 40, left: "50%", translateX: "-50%" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={20} height={32} viewBox="0 0 20 32" fill="none">
            <rect x={1} y={1} width={18} height={30} rx={9} stroke={C.muted} strokeWidth={1.5} />
            <motion.circle
              cx={10}
              cy={9}
              r={3}
              fill={C.burgundy}
              animate={{ cy: [9, 18, 9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </section>

      {/* ====================================================================
          3. MARQUEE STRIP
          ==================================================================== */}
      <MarqueeStrip />

      {/* ====================================================================
          4. VINE GROWTH — SIGNATURE ELEMENT
          ==================================================================== */}
      <section
        style={{
          padding: "120px 48px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Left: VineGrowth SVG */}
        <div>
          <VineGrowth />
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 0,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {[
              { value: "4", label: "Générations" },
              { value: "28", label: "Hectares" },
              { value: "6", label: "Cépages" },
            ].map((stat, i) => {
              const statRef = useRef<HTMLDivElement>(null);
              const statInView = useInView(statRef, { once: true });
              return (
                <motion.div
                  key={stat.label}
                  ref={statRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  style={{
                    flex: 1,
                    padding: "28px 20px",
                    borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.fontSerif,
                      fontSize: 42,
                      fontWeight: 700,
                      color: C.burgundy,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.muted,
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Terroir philosophy */}
        <div>
          <SectionLabel>Notre philosophie</SectionLabel>
          <h2
            style={{
              fontFamily: C.fontSerif,
              fontSize: "clamp(34px, 4vw, 52px)",
              fontWeight: 600,
              color: C.dark,
              lineHeight: 1.15,
              margin: "0 0 28px",
            }}
          >{c?.aboutTitle ?? fd?.businessName ?? <>
            La vigne comme{" "}
            <em style={{ color: C.burgundy, fontStyle: "italic" }}>expression</em>{" "}
            d'un lieu
          </>}</h2>
          <p
            style={{
              fontFamily: C.fontSerif,
              fontSize: 18,
              lineHeight: 1.85,
              color: C.muted,
              marginBottom: 24,
            }}
          >{c?.aboutText ?? <>
            Depuis quatre générations, la famille Valroc cultive la même conviction : un grand vin naît d'abord dans le sol, non dans la cave. Notre domaine de 28 hectares, implanté sur des graves garonnaises et un sous-sol calcaire unique, produit des vins d'une singularité et d'une complexité que seul le temps révèle pleinement.
          </>}</p>
          <p
            style={{
              fontFamily: C.fontSerif,
              fontSize: 18,
              lineHeight: 1.85,
              color: C.muted,
              marginBottom: 40,
            }}
          >
            Chaque vendange est un dialogue entre la vigne, le ciel et la main de l'homme. Nous cultivons nos six cépages avec le même respect que celui dû à une longue tradition — en biodynamie, à cheval, vendangés à la main.
          </p>
          <GoldDivider />
          <p
            style={{
              fontFamily: C.fontSerif,
              fontSize: 16,
              fontStyle: "italic",
              color: C.burgundy,
              lineHeight: 1.7,
            }}
          >
            "Le terroir ne se crée pas. Il se révèle, par la patience et le respect."
            <br />
            <span style={{ fontStyle: "normal", fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>
              — Jean-Pierre Valroc, Chef de cave
            </span>
          </p>
        </div>
      </section>

      {/* ====================================================================
          5. WINES SECTION
          ==================================================================== */}
      <section
        ref={winesRef}
        style={{
          background: C.bgCard,
          padding: "120px 48px",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <SectionLabel>La collection</SectionLabel>
            <h2
              style={{
                fontFamily: C.fontSerif,
                fontSize: "clamp(38px, 5vw, 64px)",
                fontWeight: 600,
                color: C.dark,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Nos Grandes Cuvées
            </h2>
          </div>

          {/* Vintage selector with AnimatePresence */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 64,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setVintageSelected(null)}
              style={{
                background: vintageSelected === null ? C.burgundy : "transparent",
                color: vintageSelected === null ? C.bg : C.muted,
                border: `1px solid ${vintageSelected === null ? C.burgundy : C.border}`,
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "8px 18px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Tous
            </button>
            {VINTAGES.map((v) => (
              <button
                key={v}
                onClick={() => setVintageSelected(v === vintageSelected ? null : v)}
                style={{
                  background: vintageSelected === v ? C.burgundy : "transparent",
                  color: vintageSelected === v ? C.bg : C.muted,
                  border: `1px solid ${vintageSelected === v ? C.burgundy : C.border}`,
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={vintageSelected ?? "all"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {WINES.filter((w) => !vintageSelected || w.vintage === vintageSelected).map((wine, i) => (
                <WineCard key={wine.id} wine={wine} index={i} />
              ))}
              {WINES.filter((w) => vintageSelected && w.vintage === vintageSelected).length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "80px 0",
                    fontFamily: C.fontSerif,
                    fontSize: 22,
                    color: C.muted,
                    fontStyle: "italic",
                  }}
                >
                  Aucun vin disponible pour ce millésime.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ====================================================================
          6. TERROIR — SOIL / CLIMATE / FARMING
          ==================================================================== */}
      <section
        ref={terroirRef}
        style={{ padding: "120px 48px", background: C.bg }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Le terroir</SectionLabel>
            <h2
              style={{
                fontFamily: C.fontSerif,
                fontSize: "clamp(34px, 4.5vw, 58px)",
                fontWeight: 600,
                color: C.dark,
                lineHeight: 1.12,
                margin: 0,
              }}
            >
              Sol, Climat & Culture
            </h2>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 0,
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 60,
            }}
          >
            {TERROIR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTerroirTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${terroirTab === tab.id ? C.burgundy : "transparent"}`,
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: terroirTab === tab.id ? C.burgundy : C.muted,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={terroirTab}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 80,
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: C.fontSerif,
                    fontSize: "clamp(26px, 3vw, 40px)",
                    fontWeight: 600,
                    color: C.dark,
                    margin: "0 0 24px",
                    lineHeight: 1.2,
                  }}
                >
                  {activeTerroir.title}
                </h3>
                <p
                  style={{
                    fontFamily: C.fontSerif,
                    fontSize: 18,
                    lineHeight: 1.85,
                    color: C.muted,
                    margin: 0,
                  }}
                >
                  {activeTerroir.body}
                </p>
              </div>
              <div
                style={{
                  background: C.bgDark,
                  padding: "48px 36px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: C.fontSerif,
                    fontSize: 56,
                    fontWeight: 700,
                    color: C.gold,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {activeTerroir.stat}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(248,244,238,0.5)",
                  }}
                >
                  {activeTerroir.statLabel}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ====================================================================
          7. TASTING ROOM CTA
          ==================================================================== */}
      <section id="about"
        style={{
          background: C.bgDark,
          padding: "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 600 400" style={{ width: "100%", height: "100%" }}>
            <circle cx={300} cy={200} r={250} fill="none" stroke={C.gold} strokeWidth={1} />
            <circle cx={300} cy={200} r={180} fill="none" stroke={C.gold} strokeWidth={0.5} />
            <circle cx={300} cy={200} r={100} fill="none" stroke={C.gold} strokeWidth={0.5} />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
          <SectionLabel>Expérience sensorielle</SectionLabel>
          <h2
            style={{
              fontFamily: C.fontSerif,
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 600,
              color: C.bg,
              lineHeight: 1.1,
              margin: "0 0 24px",
            }}
          >
            La Salle de Dégustation
          </h2>
          <p
            style={{
              fontFamily: C.fontSerif,
              fontSize: 19,
              fontStyle: "italic",
              lineHeight: 1.75,
              color: "rgba(248,244,238,0.65)",
              marginBottom: 48,
            }}
          >
            Un espace intime au cœur de nos caves du XIXe siècle. Chaque dégustation est guidée par notre équipe, dans un cadre pensé pour révéler toute la profondeur de nos vins.
          </p>
          <MagneticButton
            style={{
              background: C.gold,
              color: C.dark,
              fontFamily: C.fontSans,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "18px 52px",
            }}
          >
            Réserver une dégustation
          </MagneticButton>
        </div>
      </section>

      {/* ====================================================================
          8. CHEF DE CAVE
          ==================================================================== */}
      <section
        style={{
          padding: "120px 48px",
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            {/* Abstract portrait placeholder */}
            <div
              style={{
                width: "100%",
                aspectRatio: "3/4",
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80"
                alt="Jean-Pierre Valroc"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: `linear-gradient(to top, ${C.bgCard}, transparent)`,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 28,
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.muted,
                }}
              >
                Jean-Pierre Valroc
              </span>
            </div>
          </div>

          <div>
            <SectionLabel>Le vigneron</SectionLabel>
            <h2
              style={{
                fontFamily: C.fontSerif,
                fontSize: "clamp(32px, 3.8vw, 50px)",
                fontWeight: 600,
                color: C.dark,
                lineHeight: 1.15,
                margin: "0 0 28px",
              }}
            >
              Jean-Pierre Valroc,{" "}
              <em style={{ color: C.burgundy }}>Chef de Cave</em>
            </h2>
            <p
              style={{
                fontFamily: C.fontSerif,
                fontSize: 18,
                lineHeight: 1.85,
                color: C.muted,
                marginBottom: 24,
              }}
            >
              Quatrième génération du domaine, Jean-Pierre a étudié l'oenologie à Bordeaux et fait ses armes dans la vallée du Rhône avant de reprendre Château de Valroc en 2005. Sa philosophie : laisser parler le terroir, intervenir le moins possible.
            </p>
            <p
              style={{
                fontFamily: C.fontSerif,
                fontSize: 18,
                lineHeight: 1.85,
                color: C.muted,
                marginBottom: 40,
              }}
            >
              Sous sa direction, le domaine a obtenu la certification biologique en 2018 et la biodynamie en 2022. Ses cuvées ont été récompensées dans les plus grandes revues internationales, de Decanter au Wine Spectator.
            </p>

            {/* Awards */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { award: "98/100", source: "Wine Spectator 2022" },
                { award: "Gold", source: "Decanter 2021" },
                { award: "5 étoiles", source: "Guide Hachette 2023" },
              ].map((a) => (
                <div
                  key={a.source}
                  style={{
                    borderLeft: `2px solid ${C.gold}`,
                    paddingLeft: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.fontSerif,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C.dark,
                      marginBottom: 2,
                    }}
                  >
                    {a.award}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.muted,
                    }}
                  >
                    {a.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. WINE TOURISM / VISITES
          ==================================================================== */}
      <section
        ref={visitesRef}
        style={{
          background: C.bgCard,
          padding: "120px 48px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel>Oenotourisme</SectionLabel>
            <h2
              style={{
                fontFamily: C.fontSerif,
                fontSize: "clamp(34px, 4.5vw, 58px)",
                fontWeight: 600,
                color: C.dark,
                lineHeight: 1.12,
                margin: "0 0 20px",
              }}
            >
              Vivre le Domaine
            </h2>
            <p
              style={{
                fontFamily: C.fontSerif,
                fontSize: 19,
                fontStyle: "italic",
                color: C.muted,
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Des expériences immersives pensées pour vous connecter au rythme de la vigne
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                title: "Balade dans les Vignes",
                duration: "2h",
                price: "€35 / pers",
                desc: "Guidés par notre vigneron, parcourez nos parcelles emblématiques, apprenez à lire le sol et découvrez les secrets de la biodynamie.",
                icon: "🌿",
              },
              {
                title: "Dégustation Verticale",
                duration: "3h",
                price: "€95 / pers",
                desc: "5 millésimes de notre Cuvée Prestige, de 2015 à 2020. Une exploration du temps, de l'évolution d'un vin et de la mémoire du terroir.",
                icon: "🍷",
              },
              {
                title: "Séjour Vigneron",
                duration: "2 jours",
                price: "€480 / chambre",
                desc: "Vivez la vendange de l'intérieur. Hébergement dans notre maison de maître, repas avec accord mets-vins, accès libre aux caves.",
                icon: "🏰",
              },
            ].map((exp, i) => {
              const expRef = useRef<HTMLDivElement>(null);
              const expInView = useInView(expRef, { once: true, margin: "-40px" });
              return (
                <motion.div
                  key={exp.title}
                  ref={expRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={expInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.14 }}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    padding: "40px 32px",
                  }}
                >
                  <div style={{ marginBottom: 20 }}><TemplateIcon emoji={exp.icon} size={32} /></div>
                  <h3
                    style={{
                      fontFamily: C.fontSerif,
                      fontSize: 24,
                      fontWeight: 600,
                      color: C.dark,
                      margin: "0 0 6px",
                      lineHeight: 1.2,
                    }}
                  >
                    {exp.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: C.gold,
                      }}
                    >
                      {exp.duration}
                    </span>
                    <span style={{ color: C.border, fontSize: 14 }}>|</span>
                    <span
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: C.muted,
                      }}
                    >
                      {exp.price}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: C.fontSerif,
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: C.muted,
                      margin: "0 0 28px",
                    }}
                  >
                    {exp.desc}
                  </p>
                  <button
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.burgundy}`,
                      color: C.burgundy,
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "10px 24px",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. CONTACT + FOOTER
          ==================================================================== */}
      <section id="contact"
        ref={contactRef}
        style={{
          background: C.bgDark,
          padding: "100px 48px 0",
          borderTop: `1px solid rgba(201,168,108,0.12)`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 80,
              paddingBottom: 80,
              borderBottom: `1px solid rgba(248,244,238,0.08)`,
            }}
          >
            {/* Left */}
            <div>
              <SectionLabel>Nous contacter</SectionLabel>
              <h2
                style={{
                  fontFamily: C.fontSerif,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 600,
                  color: C.bg,
                  lineHeight: 1.12,
                  margin: "0 0 32px",
                }}
              >
                Commandez, visitez,{" "}
                <em style={{ color: C.gold }}>échangez</em>
              </h2>
              <p
                style={{
                  fontFamily: C.fontSerif,
                  fontSize: 18,
                  lineHeight: 1.8,
                  color: "rgba(248,244,238,0.55)",
                  marginBottom: 40,
                }}
              >
                Notre équipe est disponible du lundi au samedi, de 9h à 18h, pour toute commande, question ou réservation de visite.
              </p>

              {/* Contact details */}
              {[
                { label: "Adresse", value: "Château de Valroc, Route des Graves, 33760 Escoussans" },
                { label: "Téléphone", value: "+33 5 56 23 78 90" },
                { label: "Email", value: "contact@chateau-valroc.fr" },
              ].map((c) => (
                <div key={c.label} style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.gold,
                      margin: "0 0 4px",
                    }}
                  >
                    {c.label}
                  </p>
                  <p
                    style={{
                      fontFamily: C.fontSerif,
                      fontSize: 17,
                      color: "rgba(248,244,238,0.7)",
                      margin: 0,
                    }}
                  >
                    {c.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Contact form */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["Nom complet", "Email"].map((placeholder) => (
                  <input
                    key={placeholder}
                    type={placeholder === "Email" ? "email" : "text"}
                    placeholder={placeholder}
                    style={{
                      background: "rgba(248,244,238,0.06)",
                      border: `1px solid rgba(248,244,238,0.12)`,
                      borderRadius: 0,
                      padding: "16px 20px",
                      fontFamily: C.fontSans,
                      fontSize: 13,
                      color: C.bg,
                      outline: "none",
                    }}
                  />
                ))}
                <select
                  style={{
                    background: "rgba(248,244,238,0.06)",
                    border: `1px solid rgba(248,244,238,0.12)`,
                    borderRadius: 0,
                    padding: "16px 20px",
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    color: "rgba(248,244,238,0.6)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Objet de votre message</option>
                  <option>Commande de vins</option>
                  <option>Réservation de visite</option>
                  <option>Renseignement</option>
                  <option>Autre</option>
                </select>
                <textarea
                  placeholder="Votre message"
                  rows={5}
                  style={{
                    background: "rgba(248,244,238,0.06)",
                    border: `1px solid rgba(248,244,238,0.12)`,
                    borderRadius: 0,
                    padding: "16px 20px",
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    color: C.bg,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                <MagneticButton
                  style={{
                    background: C.burgundy,
                    color: C.bg,
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    padding: "16px 32px",
                    alignSelf: "flex-start",
                  }}
                >
                  Envoyer le message
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "32px 0",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7v3h6v-3c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" stroke={C.gold} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 20h6" stroke={C.gold} strokeWidth={1.5} strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontFamily: C.fontSerif,
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.bg,
                  letterSpacing: "0.04em",
                }}
              >
                Château de Valroc
              </span>
            </div>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                color: "rgba(248,244,238,0.3)",
                letterSpacing: "0.12em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              © 2024 Château de Valroc — Tous droits réservés — L'abus d'alcool est dangereux pour la santé
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Instagram", "LinkedIn", "Newsletter"].map((s) => (
                <button
                  key={s}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(248,244,238,0.35)",
                    padding: 0,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
