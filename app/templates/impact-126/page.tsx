// @ts-nocheck
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const C = {
  bg: "#FAF8F3",
  bgCard: "#F0EBE0",
  bgDark: "#1A1008",
  terracotta: "#C8603A",
  gold: "#C9A86C",
  dark: "#1E1208",
  muted: "#8A7868",
  border: "rgba(200,96,58,0.14)",
  white: "#FFFFFF",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontSans: "'Inter', system-ui, sans-serif",
};

/* ==========================================================================
   MENU DATA
   ========================================================================== */

const MENU_CATEGORIES = ["Antipasti", "Primi", "Secondi", "Dolci"] as const;
type MenuCategory = (typeof MENU_CATEGORIES)[number];

const MENU_ITEMS: Record<MenuCategory, { name: string; price: string; desc: string; highlight?: boolean }[]> = {
  Antipasti: [
    { name: "Burrata e Pomodorini", price: "€18", desc: "Fresh Apulian burrata, confit datterini tomatoes, basil emulsion, toasted pine nuts.", highlight: true },
    { name: "Carpaccio di Manzo", price: "€22", desc: "Thinly sliced Fassona beef, 24-month Parmigiano Reggiano, wild rocket, white truffle oil." },
    { name: "Vitello Tonnato", price: "€20", desc: "Slow-cooked veal loin, traditional tuna and caper sauce, cucunci." },
    { name: "Fiori di Zucca", price: "€16", desc: "Crispy zucchini blossoms stuffed with ricotta and smoked provola, anchovy aioli." },
  ],
  Primi: [
    { name: "Cacio e Pepe", price: "€22", desc: "Tonnarelli, Pecorino Romano DOP, toasted black pepper. Served from the cheese wheel.", highlight: true },
    { name: "Agnolotti del Plin", price: "€26", desc: "Handmade Piedmontese ravioli, roasted meats, veal reduction, sage butter." },
    { name: "Spaghetti alle Vongole", price: "€28", desc: "Artisanal spaghetti, Veraci clams, garlic, chili, parsley, white wine." },
    { name: "Risotto allo Zafferano", price: "€30", desc: "Acquerello rice, Milanese saffron, bone marrow, 36-month Parmigiano." },
  ],
  Secondi: [
    { name: "Ossobuco alla Milanese", price: "€38", desc: "Braised veal shank, traditional gremolata, served with saffron risotto.", highlight: true },
    { name: "Branzino al Sale", price: "€42", desc: "Whole Mediterranean sea bass baked in sea salt crust, lemon emulsion, grilled asparagus." },
    { name: "Bistecca alla Fiorentina", price: "€85", desc: "1.2 kg Chianina beef T-bone, roasted potatoes, rosemary. Per due persone." },
    { name: "Melanzane alla Parmigiana", price: "€24", desc: "Layered eggplant, San Marzano tomato, mozzarella di bufala, fresh basil." },
  ],
  Dolci: [
    { name: "Tiramisù Classico", price: "€12", desc: "Mascarpone cream, savoiardi dipped in espresso, bitter cocoa.", highlight: true },
    { name: "Panna Cotta alla Vaniglia", price: "€10", desc: "Vanilla bean panna cotta, wild berry coulis, almond crumble." },
    { name: "Cannolo Siciliano", price: "€11", desc: "Crispy pastry shell, sheep's milk ricotta, candied orange peel, pistachios." },
  ],
};

const WINES = [
  { name: "Barolo DOCG 'Monfortino' 2013", region: "Piedmont", grape: "Nebbiolo", price: "€450", note: "Giacomo Conterno. Complex, tar and roses, infinite length." },
  { name: "Brunello di Montalcino 2016", region: "Tuscany", grape: "Sangiovese Grosso", price: "€120", note: "Biondi-Santi. Elegant, bright cherry, mineral precision." },
  { name: "Franciacorta Cuvée Prestige", region: "Lombardy", grape: "Chardonnay · Pinot Noir", price: "€85", note: "Ca' del Bosco. Fine perlage, white flowers, citrus." },
  { name: "Amarone della Valpolicella 2015", region: "Veneto", grape: "Corvina", price: "€160", note: "Masi Costasera. Dark cherry, chocolate, robust structure." },
];

const MARQUEE_ITEMS = [
  "Burrata e Pomodorini",
  "Cacio e Pepe",
  "Carpaccio di Manzo",
  "Ossobuco alla Milanese",
  "Risotto allo Zafferano",
  "Agnolotti del Plin",
  "Branzino al Sale",
  "Tiramisù Classico",
  "Vitello Tonnato",
  "Spaghetti alle Vongole",
  "Fiori di Zucca",
  "Bistecca alla Fiorentina",
];

/* ==========================================================================
   GOOGLE FONTS INJECTION
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "gfonts-impact126";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

/* ==========================================================================
   TEXT REVEAL — overflow hidden + y: "110%" → 0
   ========================================================================== */

function TextReveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   MAGNETIC BUTTON — useMotionValue + useSpring
   ========================================================================== */

function MagneticButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.35);
      y.set((e.clientY - cy) * 0.35);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   MARQUEE STRIP — x: "0%" → "-50%" infinite
   ========================================================================== */

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        background: C.bgDark,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "20px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap", willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontDisplay,
              fontSize: "clamp(12px, 1.4vw, 16px)",
              fontStyle: "italic",
              color: i % 2 === 0 ? C.gold : C.muted,
              padding: "0 40px",
              letterSpacing: "0.04em",
              display: "inline-block",
              flexShrink: 0,
            }}
          >
            {item}
            <span style={{ color: C.terracotta, margin: "0 8px", fontStyle: "normal" }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   PASTA THREAD — SVG plate with animated spaghetti strands
   ========================================================================== */

const PASTA_STRANDS = [
  "M 50,140 C 80,100 200,180 230,140",
  "M 60,155 C 100,110 190,175 225,150",
  "M 45,165 C 90,125 195,160 235,165",
  "M 55,175 C 100,140 185,145 235,180",
  "M 65,185 C 110,150 175,135 225,190",
  "M 48,130 C 85,95 205,195 235,155",
  "M 70,145 C 105,115 180,170 220,135",
  "M 52,160 C 90,130 195,145 230,170",
  "M 62,120 C 95,90 210,200 238,145",
  "M 75,170 C 115,145 170,130 215,175",
];

function PastaThreadSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Glow behind plate */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(200,96,58,0.18) 0%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

/* ==========================================================================
   FADE UP REVEAL
   ========================================================================== */

function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   MENU ITEM WITH HOVER REVEAL (AnimatePresence)
   ========================================================================== */

function MenuItem({
  item,
  index,
}: {
  item: { name: string; price: string; desc: string; highlight?: boolean };
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "24px 0",
        borderBottom: `1px solid ${C.border}`,
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Hover bg reveal */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="hover-bg"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, rgba(200,96,58,0.06) 0%, transparent 100%)`,
              borderRadius: 4,
              transformOrigin: "left center",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, position: "relative" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: C.fontDisplay,
                fontSize: "clamp(17px, 1.9vw, 22px)",
                fontWeight: 500,
                color: item.highlight ? C.terracotta : C.dark,
                letterSpacing: "-0.01em",
              }}
            >
              {item.name}
            </span>
            {item.highlight && (
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  border: `1px solid ${C.terracotta}`,
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                Chef
              </span>
            )}
          </div>
          <AnimatePresence>
            {hovered && (
              <motion.p
                key="desc"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: C.fontSans, fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 480 }}
              >
                {item.desc}
              </motion.p>
            )}
          </AnimatePresence>
          {!hovered && (
            <p style={{ fontFamily: C.fontSans, fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 480 }}>
              {item.desc}
            </p>
          )}
        </div>
        <span
          style={{
            fontFamily: C.fontDisplay,
            fontSize: "clamp(16px, 1.6vw, 20px)",
            fontWeight: 600,
            color: C.terracotta,
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {item.price}
        </span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ImpactRestaurantPage() {
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

  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Antipasti");
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 700], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.onChange((v) => setNavScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  /* ---- NAV ---- */
  
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
      style={{
        fontFamily: C.fontSans,
        background: C.bg,
        color: C.dark,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ============================================================
          SECTION 1 — NAVIGATION (fixed)
          ============================================================ */}
      <motion.nav
        animate={{
          backgroundColor: navScrolled ? "rgba(250,248,243,0.96)" : "rgba(250,248,243,0)",
          borderBottomColor: navScrolled ? C.border : "transparent",
          boxShadow: navScrolled ? "0 1px 24px rgba(30,18,8,0.08)" : "none",
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: `1px solid transparent`,
          backdropFilter: navScrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: navScrolled ? "blur(16px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "0 32px",
            height: navScrolled ? 68 : 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "height 0.4s ease",
          }}
        >
          {/* Left nav links */}
          <div
            style={{
              display: "flex",
              gap: 36,
              fontFamily: C.fontSans,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.muted,
            }}
          >
            {["Menu", "Chef", "Cantina"].map((link) => (
              <button
                key={link}
                onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  color: C.muted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = C.terracotta)}
                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = C.muted)}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Logo center */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Terracotta logomark circle */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.terracotta,
                marginBottom: 4,
              }}
            />
            <span
              style={{
                fontFamily: C.fontDisplay,
                fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.dark,
              }}
            >
              Aureliano
            </span>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: C.terracotta,
              }}
            >
              Roma
            </span>
          </div>

          {/* Right CTA */}
          <div id="mb126-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.12em",
                color: C.muted,
              }}
            >
              +39 06 9876 543
            </span>
            <MagneticButton
              onClick={() => setReservationOpen(true)}
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.white,
                background: C.terracotta,
                border: "none",
                padding: "12px 24px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Prenota
            </MagneticButton>
      </div>
        <button
          className="mb126-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileMenuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
        </div>
      </motion.nav>
      {mobileMenuOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.12em",
                color: C.muted,
              }}
            >
              +39 06 9876 543
            </span>
            <MagneticButton
              onClick={() => setReservationOpen(true)}
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.white,
                background: C.terracotta,
                border: "none",
                padding: "12px 24px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Prenota
            </MagneticButton>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb126-nav { display: none !important; } .mb126-burger { display: flex !important; } }`}</style>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.38 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: C.bgDark,
              display: "flex",
              flexDirection: "column",
              padding: 40,
            }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                alignSelf: "flex-end",
                background: "none",
                border: "none",
                color: C.gold,
                fontSize: 28,
                cursor: "pointer",
                marginBottom: 60,
              }}
            >
              ×
            </button>
            {["Menu", "Chef", "Cantina", "Prenota"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: 36,
                  fontWeight: 400,
                  color: C.white,
                  paddingBottom: 24,
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                  marginBottom: 24,
                  cursor: "pointer",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          SECTION 2 — HERO
          ============================================================ */}
      <section id="hero"
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          minHeight: 640,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Parallax background image */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-10%",
            y: heroParallaxY,
            opacity: heroOpacity,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Wheat/pasta watermark pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(200,96,58,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(201,168,108,0.10) 0%, transparent 50%),
              linear-gradient(180deg, rgba(30,18,8,0.28) 0%, rgba(30,18,8,0.65) 60%, rgba(30,18,8,0.92) 100%)
            `,
            pointerEvents: "none",
          }}
        />

        {/* SVG pasta watermark */}
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 920,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <span style={{ display: "block", width: 32, height: 1, background: C.gold }} />
            Ristorante · Roma, Trastevere
            <span style={{ display: "block", width: 32, height: 1, background: C.gold }} />
          </motion.div>

          <div style={{ overflow: "hidden", marginBottom: 12 }}>
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: C.fontDisplay,
                fontSize: "clamp(52px, 9vw, 116px)",
                fontWeight: 700,
                lineHeight: 0.92,
                color: "#FAF8F3",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >{c?.heroHeadline ?? <>
              Cucina
            </>}</motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 36 }}>
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: C.fontDisplay,
                fontStyle: "italic",
                fontSize: "clamp(52px, 9vw, 116px)",
                fontWeight: 400,
                lineHeight: 0.92,
                color: C.terracotta,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Autentica.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: "clamp(14px, 1.4vw, 17px)",
              fontWeight: 300,
              color: "rgba(250,248,243,0.72)",
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto 48px",
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            A celebration of Roman culinary heritage — sourced daily from Campo de' Fiori, prepared with the rigor of a centuries-old tradition.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <MagneticButton
              onClick={() => setReservationOpen(true)}
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.white,
                background: C.terracotta,
                border: "none",
                padding: "16px 40px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Prenota un Tavolo
            </MagneticButton>
            <MagneticButton
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.gold,
                background: "none",
                border: `1px solid rgba(201,168,108,0.55)`,
                padding: "16px 36px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Scopri il Menu
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${C.gold}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ============================================================
          SECTION 3 — MARQUEE STRIP
          ============================================================ */}
      <MarqueeStrip />

      {/* ============================================================
          SECTION 4 — PASTA THREAD SIGNATURE
          ============================================================ */}
      <section
        style={{
          background: C.bgCard,
          padding: "100px 32px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <div>
            <FadeUp>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                La Tradizione
              </span>
            </FadeUp>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: "clamp(36px, 4.5vw, 58px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: C.dark,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                L'Arte
              </h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <h2
                style={{
                  fontFamily: C.fontDisplay,
                  fontStyle: "italic",
                  fontSize: "clamp(36px, 4.5vw, 58px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: C.terracotta,
                  letterSpacing: "-0.02em",
                  marginBottom: 36,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                della Pasta
              </>}</h2>
            </TextReveal>
            <FadeUp delay={0.3}>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.8,
                  maxWidth: 420,
                  marginBottom: 52,
                }}
              >{c?.aboutText ?? <>
                Every strand is rolled by hand each morning. Our tonnarelli for Cacio e Pepe is made with semola di grano duro from a single mill in Molise. No shortcuts. No compromise.
              </>}</p>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.4}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                {[
                  { num: "1987", label: "Fondato" },
                  { num: "12", label: "Pasta fresche" },
                  { num: "400+", label: "Etichette vino" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontFamily: C.fontDisplay,
                        fontSize: "clamp(28px, 3vw, 40px)",
                        fontWeight: 600,
                        color: C.dark,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: C.terracotta,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right: PastaThread SVG */}
          <FadeUp delay={0.15} style={{ display: "flex", justifyContent: "center" }}>
            <PastaThreadSVG />
          </FadeUp>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — MENU (filterable with AnimatePresence)
          ============================================================ */}
      <section
        id="menu"
        style={{ background: C.bg, padding: "100px 32px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <FadeUp>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  display: "block",
                  marginBottom: 16,
                }}
              >
                La Carta
              </span>
            </FadeUp>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 600,
                  lineHeight: 1.08,
                  color: C.dark,
                  letterSpacing: "-0.02em",
                }}
              >
                Il Menu
              </h2>
            </TextReveal>
          </div>

          {/* Category filter tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              marginBottom: 52,
              background: C.bgCard,
              padding: 6,
              borderRadius: 6,
            }}
          >
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "10px 24px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: activeCategory === cat ? C.terracotta : "transparent",
                  color: activeCategory === cat ? C.white : C.muted,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}>
              {MENU_ITEMS[activeCategory].map((item, i) => (
                <MenuItem key={item.name} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Disclaimer */}
          <FadeUp delay={0.2}>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 11,
                color: C.muted,
                textAlign: "center",
                marginTop: 40,
                lineHeight: 1.7,
              }}
            >
              Informate il vostro cameriere di eventuali allergie o intolleranze alimentari.
              <br />
              Un supplemento di servizio del 12,5% sarà aggiunto al conto.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 — WINE CELLAR
          ============================================================ */}
      <section
        id="cantina"
        style={{ background: C.bgDark, padding: "100px 32px", overflow: "hidden" }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            {/* Left sticky header */}
            <div style={{ position: "sticky", top: 120 }}>
              <FadeUp>
                <span
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    color: C.gold,
                    display: "block",
                    marginBottom: 20,
                  }}
                >
                  La Vigna
                </span>
              </FadeUp>
              <TextReveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: C.fontDisplay,
                    fontSize: "clamp(36px, 4vw, 52px)",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: "#FAF8F3",
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                  }}
                >
                  La Cantina
                </h2>
              </TextReveal>
              <TextReveal delay={0.2}>
                <h2
                  style={{
                    fontFamily: C.fontDisplay,
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 4vw, 52px)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    color: C.gold,
                    letterSpacing: "-0.02em",
                    marginBottom: 36,
                  }}
                >
                  di Aureliano
                </h2>
              </TextReveal>
              <FadeUp delay={0.3}>
                <p
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    fontWeight: 300,
                    color: "rgba(250,248,243,0.6)",
                    lineHeight: 1.8,
                    maxWidth: 340,
                  }}
                >
                  Over 400 labels curated over three decades — a journey through Barolo, Brunello, and beyond. Our sommelier guides every table through the finest expressions of Italian terroir.
                </p>
              </FadeUp>
            </div>

            {/* Right: wine cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {WINES.map((wine, i) => (
                <FadeUp key={wine.name} delay={i * 0.1}>
                  <div
                    style={{
                      borderBottom: `1px solid rgba(201,168,108,0.15)`,
                      padding: "32px 0",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.paddingLeft = "12px";
                      (e.currentTarget as HTMLDivElement).style.transition = "padding 0.3s ease";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.paddingLeft = "0px";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                      <div>
                        <div
                          style={{
                            fontFamily: C.fontDisplay,
                            fontSize: "clamp(16px, 1.6vw, 20px)",
                            fontWeight: 500,
                            color: "#FAF8F3",
                            marginBottom: 8,
                          }}
                        >
                          {wine.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            marginBottom: 10,
                          }}
                        >
                          {[wine.region, wine.grape].map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: C.fontSans,
                                fontSize: 9,
                                fontWeight: 500,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: C.gold,
                                border: `1px solid rgba(201,168,108,0.35)`,
                                padding: "3px 8px",
                                borderRadius: 2,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p
                          style={{
                            fontFamily: C.fontSans,
                            fontSize: 13,
                            color: "rgba(250,248,243,0.5)",
                            lineHeight: 1.65,
                          }}
                        >
                          {wine.note}
                        </p>
                      </div>
                      <span
                        style={{
                          fontFamily: C.fontDisplay,
                          fontSize: "clamp(18px, 1.8vw, 22px)",
                          fontWeight: 600,
                          color: C.gold,
                          flexShrink: 0,
                        }}
                      >
                        {wine.price}
                      </span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — CHEF STORY
          ============================================================ */}
      <section
        id="chef"
        style={{ background: C.bg, padding: "100px 32px" }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: image */}
          <FadeUp style={{ position: "relative", height: 560 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                borderRadius: 2,
              }}
            />
            {/* Terracotta accent block */}
            <div
              style={{
                position: "absolute",
                bottom: -24,
                right: -24,
                width: 160,
                height: 160,
                background: C.terracotta,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: 42,
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1,
                }}
              >
                37
              </span>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                }}
              >
                Anni di cucina
              </span>
            </div>
          </FadeUp>

          {/* Right: text */}
          <div>
            <FadeUp>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                Il Maestro
              </span>
            </FadeUp>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: "clamp(32px, 3.8vw, 48px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: C.dark,
                  letterSpacing: "-0.02em",
                  marginBottom: 6,
                }}
              >
                Marco Aurelio
              </h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <h3
                style={{
                  fontFamily: C.fontDisplay,
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2vw, 24px)",
                  fontWeight: 400,
                  color: C.muted,
                  marginBottom: 36,
                  letterSpacing: "-0.01em",
                }}
              >
                Chef Patron & Fondatore
              </h3>
            </TextReveal>
            <FadeUp delay={0.3}>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.85,
                  marginBottom: 28,
                }}
              >
                Born in Trastevere, Marco apprenticed under three generations of Roman cooks before founding Aureliano in 1987. His philosophy is radical simplicity: the finest ingredients, the most honest preparations.
              </p>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.85,
                  marginBottom: 40,
                }}
              >
                "Cooking is not performance," he says. "It is the act of remembering who you are, where you come from — and offering that to a stranger across a table."
              </p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div style={{ display: "flex", gap: 40 }}>
                {[
                  { n: "2", label: "Stelle Michelin" },
                  { n: "3", label: "Premi Identità" },
                ].map((a) => (
                  <div key={a.label}>
                    <div
                      style={{
                        fontFamily: C.fontDisplay,
                        fontSize: 38,
                        fontWeight: 700,
                        color: C.terracotta,
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {a.n}
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
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8 — RESERVATIONS CTA
          ============================================================ */}
      <section
        style={{
          background: C.terracotta,
          padding: "100px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                display: "block",
                marginBottom: 24,
              }}
            >
              Prenotazioni
            </span>
          </FadeUp>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.fontDisplay,
                fontSize: "clamp(36px, 5.5vw, 68px)",
                fontWeight: 600,
                lineHeight: 1.05,
                color: C.white,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Prenota la tua
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <h2
              style={{
                fontFamily: C.fontDisplay,
                fontStyle: "italic",
                fontSize: "clamp(36px, 5.5vw, 68px)",
                fontWeight: 400,
                lineHeight: 1.05,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "-0.02em",
                marginBottom: 36,
              }}
            >
              serata perfetta.
            </h2>
          </TextReveal>
          <FadeUp delay={0.3}>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.75,
                marginBottom: 48,
              }}
            >
              Lunch Wednesday – Sunday, 12:30 – 14:30<br />
              Dinner Tuesday – Sunday, 19:30 – 23:00
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <MagneticButton
                onClick={() => setReservationOpen(true)}
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  background: C.white,
                  border: "none",
                  padding: "18px 44px",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                Prenota Online
              </MagneticButton>
              <MagneticButton
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.white,
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.55)",
                  padding: "18px 40px",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                +39 06 9876 543
              </MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================================================
          SECTION 9 — LOCATION + HOURS
          ============================================================ */}
      <section id="contact"
        style={{ background: C.bgCard, padding: "100px 32px" }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 60,
          }}
        >
          {/* Map placeholder */}
          <FadeUp style={{ gridColumn: "span 1" }}>
            <div
              style={{
                height: 320,
                background: `linear-gradient(135deg, rgba(200,96,58,0.08) 0%, rgba(201,168,108,0.1) 100%)`,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="22" r="8" stroke={C.terracotta} strokeWidth="2" fill="none" />
                <path d="M24 2 C13 2 5 10 5 22 C5 34 24 46 24 46 C24 46 43 34 43 22 C43 10 35 2 24 2Z" stroke={C.terracotta} strokeWidth="2" fill={`rgba(200,96,58,0.08)`} />
              </svg>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                }}
              >
                Via della Lungaretta, 82
              </span>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 12,
                  color: C.muted,
                }}
              >
                00153 Roma — Trastevere
              </span>
            </div>
          </FadeUp>

          {/* Hours */}
          <FadeUp delay={0.1}>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: C.terracotta,
                display: "block",
                marginBottom: 24,
              }}
            >
              Orari
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { day: "Lun", hours: "Chiuso" },
                { day: "Mar – Ven", hours: "19:30 – 23:00" },
                { day: "Sab", hours: "12:30–14:30 · 19:30–23:30" },
                { day: "Dom", hours: "12:30 – 14:30" },
              ].map((row) => (
                <div
                  key={row.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: 16,
                    borderBottom: `1px solid ${C.border}`,
                    fontFamily: C.fontSans,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: C.dark, fontWeight: 500 }}>{row.day}</span>
                  <span style={{ color: row.hours === "Chiuso" ? C.muted : C.terracotta }}>{row.hours}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Contact */}
          <FadeUp delay={0.2}>
            <span
              style={{
                fontFamily: C.fontSans,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: C.terracotta,
                display: "block",
                marginBottom: 24,
              }}
            >
              Contatti
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "Telefono", value: "+39 06 9876 543" },
                { label: "Email", value: "info@aureliano.roma" },
                { label: "Indirizzo", value: "Via della Lungaretta, 82\n00153 Roma" },
              ].map((c) => (
                <div key={c.label}>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: C.muted,
                      marginBottom: 6,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.dark,
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================================================
          SECTION 10 — FOOTER
          ============================================================ */}
      <footer style={{ background: C.bgDark, padding: "64px 32px 40px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 40,
              marginBottom: 60,
              paddingBottom: 60,
              borderBottom: `1px solid rgba(201,168,108,0.15)`,
              flexWrap: "wrap",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: 32,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#FAF8F3",
                  marginBottom: 8,
                }}
              >
                Aureliano
              </div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                Roma · dal 1987
              </div>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  color: "rgba(250,248,243,0.45)",
                  lineHeight: 1.75,
                  maxWidth: 280,
                }}
              >
                Cucina romana autentica nel cuore di Trastevere. Una storia di famiglia, tradizione e sapori senza tempo.
              </p>
            </div>

            {/* Footer nav */}
            <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>
              {[
                { title: "Ristorante", links: ["Il Menu", "La Cantina", "Il Chef", "Gallery"] },
                { title: "Info", links: ["Prenotazioni", "Orari", "Contatti", "Press"] },
              ].map((col) => (
                <div key={col.title}>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: C.gold,
                      marginBottom: 20,
                    }}
                  >
                    {col.title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {col.links.map((link) => (
                      <a
                        key={link}
                        href="#menu"
                        style={{
                          fontFamily: C.fontSans,
                          fontSize: 13,
                          color: "rgba(250,248,243,0.55)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = C.gold)}
                        onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(250,248,243,0.55)")}
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
              fontFamily: C.fontSans,
              fontSize: 10,
              color: "rgba(250,248,243,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            <span>© {new Date().getFullYear()} Ristorante Aureliano. Tutti i diritti riservati.</span>
            <div style={{ display: "flex", gap: 28 }}>
              {["Privacy Policy", "Cookie", "Legal"].map((l) => (
                <a
                  key={l}
                  href="#menu"
                  style={{
                    color: "rgba(250,248,243,0.3)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = C.gold)}
                  onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(250,248,243,0.3)")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          RESERVATION MODAL (AnimatePresence)
          ============================================================ */}
      <AnimatePresence>
        {reservationOpen && (
          <motion.div
            key="reservation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setReservationOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(30,18,8,0.82)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              key="reservation-panel"
              initial={{ scale: 0.94, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 520,
                background: C.bg,
                borderRadius: 4,
                padding: "52px 48px",
                position: "relative",
                boxShadow: "0 32px 80px rgba(30,18,8,0.4)",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setReservationOpen(false)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "none",
                  border: "none",
                  color: C.muted,
                  fontSize: 22,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>

              {/* Header */}
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  marginBottom: 16,
                }}
              >
                Prenotazione
              </div>
              <h3
                style={{
                  fontFamily: C.fontDisplay,
                  fontSize: 32,
                  fontWeight: 600,
                  color: C.dark,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                  lineHeight: 1.1,
                }}
              >
                Riserva il tuo tavolo
              </h3>

              <form
                onSubmit={(e) => { e.preventDefault(); setReservationOpen(false); }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Data", type: "date" },
                    { label: "Ora", type: "time" },
                  ].map((f) => (
                    <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span
                        style={{
                          fontFamily: C.fontSans,
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: C.muted,
                        }}
                      >
                        {f.label}
                      </span>
                      <input
                        type={f.type}
                        style={{
                          fontFamily: C.fontSans,
                          fontSize: 14,
                          color: C.dark,
                          background: C.bgCard,
                          border: `1px solid ${C.border}`,
                          borderRadius: 2,
                          padding: "12px 14px",
                          outline: "none",
                        }}
                      />
                    </label>
                  ))}
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: C.muted,
                    }}
                  >
                    Numero di persone
                  </span>
                  <select
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.dark,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 2,
                      padding: "12px 14px",
                      outline: "none",
                      appearance: "none",
                    }}
                  >
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={n}>{n} {n === 1 ? "persona" : "persone"}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: C.muted,
                    }}
                  >
                    Nome
                  </span>
                  <input
                    type="text"
                    placeholder="Il tuo nome"
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: C.dark,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 2,
                      padding: "12px 14px",
                      outline: "none",
                    }}
                  />
                </label>

                <MagneticButton
                  style={{
                    marginTop: 8,
                    fontFamily: C.fontSans,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: C.white,
                    background: C.terracotta,
                    border: "none",
                    padding: "16px 0",
                    cursor: "pointer",
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  Conferma Prenotazione
                </MagneticButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
