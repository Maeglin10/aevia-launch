"use client";
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const C = {
  bg: "#F8F7F2",
  bgCard: "#EEE9E0",
  bgDark: "#0E1208",
  green: "#4A6B3C",
  greenSoft: "#8AAE78",
  amber: "#C8943A",
  dark: "#1A1E14",
  muted: "#7A8272",
  border: "rgba(74,107,60,0.14)",
  font: "'Cormorant Garamond', serif",
  fontSans: "'Inter', sans-serif",
};

/* ==========================================================================
   DATA
   ========================================================================== */

const PROJECTS = [
  {
    id: "p1",
    title: "Verdant Canopy",
    category: "Residential",
    location: "Singapore",
    year: "2025",
    desc: "A living complex woven into Singapore's tropical canopy. The building breathes, captures rainwater, and lowers ambient temperature by 4°C through passive bio-ventilation.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "p2",
    title: "The Glass House",
    category: "Residential",
    location: "Kyoto, Japan",
    year: "2024",
    desc: "Refractive glass panels scatter sunlight into a living painting that transforms hourly, dissolving the boundary between interior serenity and the ancient garden beyond.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "p3",
    title: "Moss Pavilion",
    category: "Public Space",
    location: "Oslo, Norway",
    year: "2023",
    desc: "Sustainably harvested moss panels and reclaimed timber create a sound-dampening sanctuary that sequesters carbon while offering silent refuge in the city's core.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "p4",
    title: "Thermal Baths",
    category: "Wellness",
    location: "Vals, Switzerland",
    year: "2026",
    desc: "Carved into the mountainside and clad in local quartzite, these baths harness geothermal energy to maintain perfect temperatures year-round — zero combustion.",
    image: "https://images.unsplash.com/photo-1542314831-c6a4d14faaf2?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "p5",
    title: "Bamboo Node",
    category: "Community",
    location: "Bali, Indonesia",
    year: "2024",
    desc: "Structural bamboo arches span 24 metres, creating a community hub that withstands typhoon-force winds and remains fully biodegradable at end of life.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
  },
];

const MARQUEE_ITEMS = [
  "Verdant Canopy — Singapore",
  "The Glass House — Kyoto",
  "Moss Pavilion — Oslo",
  "Thermal Baths — Vals",
  "Bamboo Node — Bali",
  "Verdant Canopy — Singapore",
  "The Glass House — Kyoto",
  "Moss Pavilion — Oslo",
  "Thermal Baths — Vals",
  "Bamboo Node — Bali",
];

const PHILOSOPHY = [
  {
    number: "01",
    title: "Biomimicry",
    subtitle: "Nature as blueprint",
    desc: "Every structural decision references 3.8 billion years of evolutionary engineering. Termite mounds, honeycombs, mycelium networks — each offers lessons no textbook can replicate.",
  },
  {
    number: "02",
    title: "Biophilic Integration",
    subtitle: "Living with the living",
    desc: "We embed living walls, rain gardens, and pollinator corridors directly into the building fabric — transforming dead square footage into active ecological habitat.",
  },
  {
    number: "03",
    title: "Carbon Neutral",
    subtitle: "Materials that heal",
    desc: "Our material palette sequesters more carbon than it emits. Cross-laminated timber, compressed earth, and myco-composites form the backbone of a regenerative construction economy.",
  },
];

const SERVICES = [
  {
    title: "Architectural Design",
    desc: "Full-spectrum design from conceptual sketches to construction documentation. We use parametric modelling to test thousands of environmental scenarios before a single brick is laid.",
  },
  {
    title: "Biophilic Consulting",
    desc: "Retrofit guidance for existing buildings — integrating living systems, natural materials, and sensory elements that measurably reduce occupant stress and increase productivity.",
  },
  {
    title: "Environmental Certification",
    desc: "Navigation of BREEAM, LEED, and WELL certification pathways. We've achieved Platinum on our last six projects and we don't accept less.",
  },
  {
    title: "Material Research",
    desc: "Our in-house lab tests emerging bio-based materials — algae panels, fungal insulation, mycelium composites — before they reach the mainstream.",
  },
  {
    title: "Landscape Integration",
    desc: "Architecture does not end at the facade. We design the soil, the water table, the micro-climate, and the habitat corridors that make a building truly alive.",
  },
];

const AWARDS = [
  { year: "2025", title: "Pritzker Prize", body: "Architecture Laureate" },
  { year: "2025", title: "World Architecture Festival", body: "Sustainable Building of the Year" },
  { year: "2024", title: "Aga Khan Award", body: "Architecture — Moss Pavilion" },
  { year: "2024", title: "RIBA International Prize", body: "Shortlisted — Bamboo Node" },
  { year: "2023", title: "Dezeen Awards", body: "Sustainable Design Studio of the Year" },
  { year: "2023", title: "Fast Company Innovation", body: "Most Innovative Architecture Firm" },
];

const STATS = [
  { value: "47", label: "Projects completed" },
  { value: "14", label: "Countries" },
  { value: "92%", label: "Carbon-negative projects" },
  { value: "23k", label: "Tonnes CO₂ sequestered" },
];

const TEAM = [
  {
    name: "Elena Rostova",
    role: "Lead Architect & Founder",
    bio: "RIBA Gold Medal laureate. Former Chair of Sustainable Architecture at the AA. Elena's practice synthesises vernacular building wisdom with advanced computational design.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Kenji Watanabe",
    role: "Partner — Material Science",
    bio: "PhD in bio-based composites from ETH Zürich. Kenji leads our material research division and has pioneered the structural use of myco-composites on three continents.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
];

/* ==========================================================================
   LEAF VEIN SVG SIGNATURE ELEMENT
   ========================================================================== */

function LeafVeinSVG({ isVisible }: { isVisible: boolean }) {
  const branches = [
    // Central stem
    { d: "M 200 420 L 200 80", delay: 0 },
    // Left main branch 1
    { d: "M 200 320 C 170 300 140 280 100 260", delay: 0.1 },
    // Right main branch 1
    { d: "M 200 320 C 230 300 260 280 300 260", delay: 0.2 },
    // Left main branch 2
    { d: "M 200 240 C 165 220 130 200 90 185", delay: 0.3 },
    // Right main branch 2
    { d: "M 200 240 C 235 220 270 200 310 185", delay: 0.4 },
    // Left main branch 3
    { d: "M 200 170 C 172 155 145 140 115 130", delay: 0.5 },
    // Right main branch 3
    { d: "M 200 170 C 228 155 255 140 285 130", delay: 0.6 },
    // Left sub-branch from branch 1
    { d: "M 140 280 C 125 265 108 252 90 245", delay: 0.7 },
    // Right sub-branch from branch 1
    { d: "M 260 280 C 275 265 292 252 310 245", delay: 0.8 },
    // Left sub-branch from branch 2
    { d: "M 130 200 C 115 190 98 180 82 175", delay: 0.9 },
    // Right sub-branch from branch 2
    { d: "M 270 200 C 285 190 302 180 318 175", delay: 1.0 },
    // Tip left
    { d: "M 115 130 C 102 122 90 115 78 112", delay: 1.1 },
    // Tip right
    { d: "M 285 130 C 298 122 310 115 322 112", delay: 1.2 },
  ];

  return (
    <svg
      viewBox="0 0 400 440"
      style={{
        width: "100%",
        maxWidth: 380,
        height: "auto",
      }}
      fill="none"
      aria-label="Leaf vein branching structure"
    >
      {/* Background leaf silhouette — very faint */}
      <ellipse
        cx={200}
        cy={250}
        rx={130}
        ry={170}
        fill={C.green}
        opacity={0.04}
        transform="rotate(-5 200 250)"
      />
      {branches.map((branch, i) => (
        <motion.path
          key={i}
          d={branch.d}
          stroke={C.green}
          strokeWidth={i === 0 ? 2.2 : 1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isVisible
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              duration: 1.2,
              delay: branch.delay,
              ease: [0.4, 0, 0.2, 1],
            },
            opacity: {
              duration: 0.2,
              delay: branch.delay,
            },
          }}
        />
      ))}
      {/* Vein tip dots */}
      {[
        [100, 260], [300, 260], [90, 185], [310, 185],
        [115, 130], [285, 130], [78, 112], [322, 112],
        [82, 175], [318, 175],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={cx}
          cy={cy}
          r={2.5}
          fill={C.greenSoft}
          initial={{ scale: 0, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 0.7 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}

/* ==========================================================================
   MAGNETIC BUTTON (21st.dev pattern)
   ========================================================================== */

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
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.35);
      y.set((e.clientY - centerY) * 0.35);
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

/* ==========================================================================
   SPOTLIGHT CARD (21st.dev pattern — radial gradient follows mouse)
   ========================================================================== */

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
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(74,107,60,0.09) 0%, ${C.bgCard} 60%)`
          : C.bgCard,
        transition: "background 0.1s ease",
      }}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   TEXT REVEAL (21st.dev pattern — overflow hidden + y slide)
   ========================================================================== */

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

/* ==========================================================================
   MARQUEE STRIP (21st.dev pattern — animate x:"0%"→"-50%")
   ========================================================================== */

function MarqueeStrip() {
  return (
    <div
      style={{
        overflow: "hidden",
        background: C.green,
        paddingTop: 18,
        paddingBottom: 18,
        width: "100%",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap", width: "max-content" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontSans,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {item}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.greenSoft,
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   HERO LEAF PARTICLES
   ========================================================================== */

function LeafParticles() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 6,
    size: 8 + Math.random() * 14,
    rotation: Math.random() * 360,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          style={{
            position: "absolute",
            left: `${leaf.x}%`,
            top: "-20px",
            width: leaf.size,
            height: leaf.size,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [leaf.rotation, leaf.rotation + 180],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 20 24" fill={C.greenSoft} opacity={0.5}>
            <path d="M10 2 C6 2 1 8 1 14 C1 19 5 22 10 22 C15 22 19 19 19 14 C19 8 14 2 10 2 Z" />
            <line x1="10" y1="22" x2="10" y2="8" stroke={C.green} strokeWidth="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact115Page() {
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  // Leaf vein section ref + visibility
  const leafVeinRef = useRef<HTMLDivElement>(null);
  const leafVeinVisible = useInView(leafVeinRef, { once: true, margin: "-100px" });

  // Page scroll progress
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Google Fonts via useEffect
  useEffect(() => {
    const id = "rostova-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    
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
return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <style>{`
        @media (max-width: 700px) {
          .i115-projects-grid { grid-template-columns: 1fr !important; }
          .i115-project-wide { grid-column: span 1 !important; }
        }
      `}</style>
      {/* Scroll progress bar — top */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: progressWidth,
          height: 2,
          background: C.green,
          zIndex: 1000,
          transformOrigin: "left",
        }}
      />

      {/* ====================================================================
          1. NAVIGATION
          ==================================================================== */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: scrolled ? 16 : 28,
          paddingBottom: scrolled ? 16 : 28,
          background: scrolled
            ? "rgba(248,247,242,0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo */}
        {fd?.logoBase64 ? (
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div
            style={{
              fontFamily: C.font,
              fontSize: 22,
              fontWeight: 600,
              color: C.green,
              display: "flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "0.06em",
            }}
          >
            <svg width={22} height={26} viewBox="0 0 22 26" fill="none">
              <path
                d="M11 2 C7 2 2 8 2 15 C2 20 6 24 11 24 C16 24 20 20 20 15 C20 8 15 2 11 2Z"
                fill={C.green}
              />
              <line x1="11" y1="24" x2="11" y2="9" stroke={C.bg} strokeWidth="1.2" />
              <line x1="11" y1="17" x2="7" y2="14" stroke={C.bg} strokeWidth="0.8" />
              <line x1="11" y1="13" x2="15" y2="10" stroke={C.bg} strokeWidth="0.8" />
            </svg>
            Rostova Studio
          </div>
        )}

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            gap: 44,
            fontFamily: C.fontSans,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          {["Projects", "Philosophy", "Services", "Studio"].map((link) => (
            <motion.a
              key={link}
              onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({behavior:"smooth"})}
              style={{ color: C.muted, textDecoration: "none" }}
              whileHover={{ color: C.green }}
              transition={{ duration: 0.2 }}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* CTA button */}
        <MagneticButton
          style={{
            background: C.green,
            color: "#fff",
            border: "none",
            borderRadius: 100,
            padding: "10px 26px",
            fontFamily: C.fontSans,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Enquire
        </MagneticButton>

        {/* Mobile menu toggle */}
        <motion.button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: C.dark,
          }}
          aria-label="Toggle menu"
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth={1.5}>
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </motion.button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: C.bgDark,
              zIndex: 190,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: 40,
              gap: 32,
            }}
          >
            {["Projects", "Philosophy", "Services", "Studio", "Contact"].map((link, i) => (
              <motion.a
                key={link}
                onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({behavior:"smooth"})}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{
                  fontFamily: C.font,
                  fontSize: 48,
                  fontWeight: 400,
                  color: "#fff",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          2. HERO
          ==================================================================== */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: C.bgDark,
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.32,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(14,18,8,0.3) 0%, rgba(14,18,8,0.6) 50%, rgba(14,18,8,0.95) 100%)`,
          }}
        />

        <LeafParticles />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            textAlign: "center",
            paddingLeft: 24,
            paddingRight: 24,
            maxWidth: 960,
            marginTop: 80,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid rgba(138,174,120,0.35)`,
              borderRadius: 100,
              padding: "7px 20px",
              marginBottom: 40,
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.greenSoft,
              }}
            />
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.greenSoft,
              }}
            >
              Biophilic Architecture Studio — Est. 2014
            </span>
          </motion.div>

          <TextReveal>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(56px, 10vw, 120px)",
                fontWeight: 500,
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: "#fff",
                marginBottom: 12,
              }}
            >{c?.heroHeadline ?? <>
              Architecture
            </>}</h1>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h1
              style={{
                fontFamily: C.font,
                fontSize: "clamp(56px, 10vw, 120px)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: C.greenSoft,
                marginBottom: 36,
              }}
            >
              that breathes.
            </h1>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 17,
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.58)",
              maxWidth: 520,
              margin: "0 auto 52px",
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Elena Rostova's studio designs living structures that regenerate their
            ecosystems, sequester carbon, and evolve alongside their inhabitants.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              style={{
                background: C.green,
                color: "#fff",
                border: "none",
                borderRadius: 100,
                padding: "15px 38px",
                fontFamily: C.fontSans,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 100,
                padding: "15px 38px",
                fontFamily: C.fontSans,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Our Philosophy
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontFamily: C.fontSans,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Scroll
          </span>
          <motion.div
            style={{
              width: 1,
              height: 56,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ====================================================================
          3. MARQUEE STRIP
          ==================================================================== */}
      <MarqueeStrip />

      {/* ====================================================================
          4. LEAF VEIN — Signature Element
          ==================================================================== */}
      <section
        id="leafvein"
        ref={leafVeinRef}
        style={{
          background: C.bg,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: text + stats */}
          <div>
            <TextReveal>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: C.green,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                The Studio in Numbers
              </span>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(38px, 5vw, 62px)",
                  fontWeight: 500,
                  lineHeight: 1.08,
                  letterSpacing: "-0.015em",
                  color: C.dark,
                  marginBottom: 24,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                Every branch
                <br />
                <em style={{ fontStyle: "italic", color: C.green }}>
                  tells a story.
                </em>
              </>}</h2>
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.8,
                color: C.muted,
                maxWidth: 420,
                marginBottom: 56,
              }}
            >{c?.aboutText ?? <>
              Like the vein of a leaf, each project radiates from a single
              principle: that architecture should give back more than it takes.
              This living diagram grows as you scroll — just as our work grows
              with the ecosystems it inhabits.
            </>}</motion.p>

            {/* Stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              {STATS.map((stat, i) => (
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
                      fontSize: 48,
                      fontWeight: 500,
                      color: C.green,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 11,
                      fontWeight: 400,
                      letterSpacing: "0.06em",
                      color: C.muted,
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: LeafVein SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: C.bgCard,
              borderRadius: 28,
              padding: "60px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${C.border}`,
              minHeight: 420,
            }}
          >
            <LeafVeinSVG isVisible={leafVeinVisible} />
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          5. PROJECTS GRID — SpotlightCard + AnimatePresence hover overlay
          ==================================================================== */}
      <section
        id="projects"
        style={{
          background: C.bgCard,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <TextReveal>
                <span
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: C.green,
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  Selected Works
                </span>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(38px, 5vw, 68px)",
                    fontWeight: 500,
                    lineHeight: 1.04,
                    letterSpacing: "-0.02em",
                    color: C.dark,
                  }}
                >
                  Five projects.
                  <br />
                  <em style={{ fontStyle: "italic", color: C.muted }}>
                    Five ecosystems.
                  </em>
                </h2>
              </TextReveal>
            </div>
            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.green,
                textDecoration: "none",
                borderBottom: `1px solid ${C.green}`,
                paddingBottom: 3,
              }}
            >
              View all projects →
            </motion.a>
          </div>

          {/* Projects grid */}
          <div
            className="i115-projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {PROJECTS.map((project, i) => {
              const isWide = i === 0 || i === 3;
              return (
                <ProjectCard key={project.id} project={project} isWide={isWide} index={i} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. PHILOSOPHY — 3 principles
          ==================================================================== */}
      <section
        id="philosophy"
        style={{
          background: C.bg,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 680, marginBottom: 80 }}>
            <TextReveal>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: C.green,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                Our Philosophy
              </span>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(38px, 5vw, 68px)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: C.dark,
                }}
              >
                Three principles.
                <br />
                <em style={{ fontStyle: "italic", color: C.green }}>
                  One conviction.
                </em>
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: 2,
            }}
          >
            {PHILOSOPHY.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                style={{
                  padding: "52px 44px",
                  background: i === 1 ? C.green : C.bgCard,
                  borderRadius: i === 0 ? "28px 4px 4px 28px" : i === 2 ? "4px 28px 28px 4px" : 4,
                }}
              >
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 64,
                    fontWeight: 400,
                    color: i === 1 ? "rgba(255,255,255,0.18)" : C.border,
                    lineHeight: 1,
                    marginBottom: 32,
                  }}
                >
                  {item.number}
                </div>
                <div
                  style={{
                    fontFamily: C.font,
                    fontSize: 28,
                    fontWeight: 500,
                    color: i === 1 ? "#fff" : C.dark,
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: i === 1 ? C.greenSoft : C.green,
                    marginBottom: 24,
                  }}
                >
                  {item.subtitle}
                </div>
                <p
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: i === 1 ? "rgba(255,255,255,0.72)" : C.muted,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SERVICES ACCORDION — useInView + AnimatePresence height expansion
          ==================================================================== */}
      <section
        id="services"
        style={{
          background: C.bgDark,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <TextReveal>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: C.greenSoft,
                display: "block",
                marginBottom: 20,
              }}
            >
              What We Do
            </span>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.font,
                fontSize: "clamp(38px, 5vw, 62px)",
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#fff",
                marginBottom: 72,
              }}
            >
              Services
            </h2>
          </TextReveal>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {SERVICES.map((service, i) => (
              <ServiceAccordionItem
                key={service.title}
                service={service}
                index={i}
                isOpen={activeService === i}
                onToggle={() => setActiveService(activeService === i ? null : i)}
                isLast={i === SERVICES.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. TEAM — Elena Rostova + partner
          ==================================================================== */}
      <section
        id="studio"
        style={{
          background: C.bg,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <TextReveal>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: C.green,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                The Team
              </span>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(38px, 5vw, 68px)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: C.dark,
                }}
              >
                The minds behind
                <br />
                <em style={{ fontStyle: "italic", color: C.muted }}>the matter.</em>
              </h2>
            </TextReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: 24,
                    overflow: "hidden",
                    aspectRatio: "3/4",
                    marginBottom: 24,
                    background: C.bgCard,
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "grayscale(20%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, rgba(14,18,8,0.7) 0%, transparent 55%)`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: C.font,
                        fontSize: 26,
                        fontWeight: 500,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {member.name}
                    </div>
                    <div
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.greenSoft,
                      }}
                    >
                      {member.role}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: C.muted,
                  }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. AWARDS & RECOGNITION
          ==================================================================== */}
      <section
        id="awards"
        style={{
          background: C.bgCard,
          paddingTop: 120,
          paddingBottom: 120,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            {/* Left heading */}
            <div>
              <TextReveal>
                <span
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: C.green,
                    display: "block",
                    marginBottom: 20,
                  }}
                >
                  Recognition
                </span>
              </TextReveal>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(38px, 4.5vw, 62px)",
                    fontWeight: 500,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                    color: C.dark,
                    marginBottom: 32,
                  }}
                >
                  Honoured by the
                  <br />
                  <em style={{ fontStyle: "italic", color: C.green }}>
                    world's finest.
                  </em>
                </h2>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: C.muted,
                  maxWidth: 380,
                }}
              >
                Eleven years of practice. Forty-seven completed projects. A
                growing archive of international recognition — but never the
                reason we build.
              </motion.p>
            </div>

            {/* Right awards list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {AWARDS.map((award, i) => (
                <motion.div
                  key={`${award.year}-${award.title}`}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    paddingTop: 20,
                    paddingBottom: 20,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.green,
                      minWidth: 44,
                    }}
                  >
                    {award.year}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: C.font,
                        fontSize: 20,
                        fontWeight: 500,
                        color: C.dark,
                        lineHeight: 1.2,
                      }}
                    >
                      {award.title}
                    </div>
                    <div
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 12,
                        color: C.muted,
                        marginTop: 2,
                      }}
                    >
                      {award.body}
                    </div>
                  </div>
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M3 13 L13 3 M13 3 H7 M13 3 V9"
                      stroke={C.green}
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. CONTACT CTA + FOOTER
          ==================================================================== */}
      <section
        id="contact"
        style={{
          background: C.bgDark,
          paddingTop: 140,
          paddingBottom: 80,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        {/* CTA block */}
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              background: C.green,
              borderRadius: 32,
              padding: "80px 72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 48,
              flexWrap: "wrap",
              marginBottom: 100,
            }}
          >
            <div>
              <TextReveal>
                <h2
                  style={{
                    fontFamily: C.font,
                    fontSize: "clamp(36px, 4.5vw, 62px)",
                    fontWeight: 500,
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  Ready to build
                  <br />
                  <em style={{ fontStyle: "italic" }}>something living?</em>
                </h2>
              </TextReveal>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.68)",
                  maxWidth: 400,
                }}
              >
                Every project begins with a conversation. Tell us about your
                site, your vision, and the ecosystem you want to protect.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 300 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#fff",
                    padding: "16px 0",
                  }}
                />
              </div>
              <MagneticButton
                style={{
                  background: "#fff",
                  color: C.green,
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 32px",
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Begin a Project
              </MagneticButton>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 48,
              paddingBottom: 48,
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              marginBottom: 40,
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 22,
                  fontWeight: 600,
                  color: C.greenSoft,
                  letterSpacing: "0.06em",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <svg width={18} height={22} viewBox="0 0 22 26" fill="none">
                  <path
                    d="M11 2 C7 2 2 8 2 15 C2 20 6 24 11 24 C16 24 20 20 20 15 C20 8 15 2 11 2Z"
                    fill={C.greenSoft}
                  />
                  <line x1="11" y1="24" x2="11" y2="9" stroke={C.bgDark} strokeWidth="1.2" />
                </svg>
                Rostova Studio
              </div>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.4)",
                  maxWidth: 280,
                }}
              >
                Biophilic architecture and sustainable design. Oslo — Singapore — Bali.
              </p>
            </div>

            {/* Studios */}
            <div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 20,
                }}
              >
                Studios
              </div>
              {["Oslo (HQ)", "Singapore", "Bali Studio"].map((s) => (
                <div
                  key={s}
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 10,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Index */}
            <div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 20,
                }}
              >
                Index
              </div>
              {["Projects", "Philosophy", "Services", "Press", "Careers"].map((link) => (
                <a
                  key={link}
                  href="#services"
                  style={{
                    display: "block",
                    fontFamily: C.fontSans,
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    marginBottom: 10,
                  }}
                >{c?.ctaText ?? <>
                  {link}
                </>}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 20,
                }}
              >
                Contact
              </div>
              <a
                href="mailto:hello@rostova.studio"
                style={{
                  display: "block",
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  fontWeight: 300,
                  color: C.greenSoft,
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                hello@rostova.studio
              </a>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                +47 22 00 00 00
              </div>
            </div>
          </div>

          {/* Footer bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 400,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.06em",
              }}
            >
              © {new Date().getFullYear()} Rostova Architecture Studio. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 28 }}>
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#contact"
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   PROJECT CARD (extracted to keep inline styles clean)
   ========================================================================== */

function ProjectCard({
  project,
  isWide,
  index,
}: {
  project: (typeof PROJECTS)[0];
  isWide: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={isWide ? "i115-project-wide" : undefined}
      style={{
        gridColumn: isWide ? "span 2" : "span 1",
      }}
    >
      <SpotlightCard
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: isWide ? "16/7" : "4/3",
            overflow: "hidden",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, rgba(14,18,8,0.85) 0%, rgba(14,18,8,0.3) 60%, transparent 100%)`,
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 28,
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  <p
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.82)",
                      maxWidth: 500,
                    }}
                  >
                    {project.desc}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category badge */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "rgba(248,247,242,0.88)",
              backdropFilter: "blur(8px)",
              borderRadius: 100,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.dark,
              }}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Card footer */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: C.font,
                fontSize: 22,
                fontWeight: 500,
                color: C.dark,
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              {project.title}
            </div>
            <div
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                color: C.muted,
                display: "flex",
                gap: 12,
              }}
            >
              <span>{project.location}</span>
              <span style={{ color: C.border }}>·</span>
              <span>{project.year}</span>
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13 L13 3 M13 3 H7 M13 3 V9"
                stroke={C.green}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ==========================================================================
   SERVICE ACCORDION ITEM
   ========================================================================== */

function ServiceAccordionItem({
  service,
  index,
  isOpen,
  onToggle,
  isLast,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: isLast ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "28px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28, textAlign: "left" }}>
          <span
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 600,
              color: C.greenSoft,
              minWidth: 24,
              letterSpacing: "0.1em",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: C.font,
              fontSize: 26,
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {service.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="2" x2="7" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth={1.4} strokeLinecap="round" />
            <line x1="2" y1="7" x2="12" y2="7" stroke="rgba(255,255,255,0.7)" strokeWidth={1.4} strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                paddingBottom: 28,
                paddingLeft: 52,
                maxWidth: 660,
              }}
            >
              {service.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
