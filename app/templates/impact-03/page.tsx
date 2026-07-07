"use client";
// @ts-nocheck

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import React, { useState, useRef, useEffect, useCallback } from 'react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const COLLECTION = [
  {
    id: 1,
    name: 'Velvet Noir Coat',
    category: 'Outerwear',
    price: 4_200,
    badge: 'New',
    color: '#1a1a2e',
    desc: 'Double-faced cashmere in midnight velvet. Structured shoulders, silk-satin lining, and hand-stitched lapels by Parisian ateliers.',
  },
  {
    id: 2,
    name: 'Sable Silk Midi',
    category: 'Dresses',
    price: 2_800,
    badge: null,
    color: '#2d1b1b',
    desc: 'Bias-cut heavy silk charmeuse that moves like water. Invisible zip, French seams throughout, hand-finished hem.',
  },
  {
    id: 3,
    name: 'Heritage Leather Tote',
    category: 'Bags',
    price: 3_600,
    badge: 'Bestseller',
    color: '#2c1810',
    desc: 'Full-grain vegetable-tanned leather ages with the wearer. Solid brass hardware, suede interior, three interior pockets.',
  },
  {
    id: 4,
    name: 'Sculptural Heel Mule',
    category: 'Shoes',
    price: 1_950,
    badge: null,
    color: '#1a1a1a',
    desc: 'Architectural block heel cast in solid resin. Nappa leather upper, padded insole, resoleable leather outsole.',
  },
  {
    id: 5,
    name: 'Geometric Wrap Blazer',
    category: 'Tailoring',
    price: 3_100,
    badge: 'Limited',
    color: '#0d1b2a',
    desc: 'Japanese wool-mohair blend with a distinctive wrap silhouette. Unlined for fluidity, covered buttons, contrast stitching.',
  },
  {
    id: 6,
    name: 'Column Knit Gown',
    category: 'Eveningwear',
    price: 5_400,
    badge: null,
    color: '#1c1c3a',
    desc: 'Fine merino wool in column silhouette. Subtle side slit, draped cowl back, hand-embroidered hem detail.',
  },
];

const LOOKBOOK_ITEMS = [
  { ratio: '3/4', label: 'SS26 Campaign' },
  { ratio: '1/1', label: 'The Coat Edit' },
  { ratio: '4/5', label: 'Evening Looks' },
  { ratio: '1/1', label: 'Accessories' },
  { ratio: '3/4', label: 'Tailoring' },
];

const SUSTAINABILITY_ITEMS = [
  {
    number: '94%',
    label: 'Natural fibres',
    detail: 'All materials are natural, organic, or recycled from verified sources.',
  },
  {
    number: '0',
    label: 'Virgin plastic',
    detail: 'All packaging is paper-based, compostable, or reusable.',
  },
  {
    number: '400',
    label: 'Artisan hours per garment',
    detail: 'Made-to-order in partner ateliers with fair-wage certification.',
  },
];

const STORES = [
  { city: 'Paris', address: '12 Rue Saint-Honoré, 75001', hours: 'Mon–Sat 10–19' },
  { city: 'London', address: '47 Sloane Street, SW1X 9LP', hours: 'Mon–Sat 10–18' },
  { city: 'New York', address: '850 Madison Avenue, NY 10021', hours: 'Mon–Sat 10–19' },
  { city: 'Tokyo', address: '5-4-1 Minami-Aoyama, Minato', hours: 'Daily 11–20' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ACCENT COLOR SCROLL PALETTE
   Sections map: 0→hero, 1→collection, 2→gallery, 3→lookbook, 4→sustainability
───────────────────────────────────────────────────────────────────────────── */

const ACCENT_STOPS = ['#0a0a0a', '#8b4513', '#1a3a5c', '#2d4a1e'];

/* ─────────────────────────────────────────────────────────────────────────────
   GEOMETRIC PRODUCT (CSS-DRAWN — simulates a structured bag / watch)
───────────────────────────────────────────────────────────────────────────── */

function GeometricProduct({ rotateY }: { rotateY: import('framer-motion').MotionValue<number> }) {
  return (
    <motion.div
      style={{
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer frame */}
      <div
        style={{
          width: 240,
          height: 240,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main body — bag silhouette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid #0a0a0a',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f0ede8 0%, #e8e3db 100%)',
          }}
        />
        {/* Top flap */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 80,
            borderBottom: '2px solid #0a0a0a',
            background: 'linear-gradient(135deg, #d4cfc7 0%, #c8c2b9 100%)',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
        {/* Clasp */}
        <div
          style={{
            position: 'absolute',
            top: 68,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 28,
            height: 28,
            border: '2px solid #0a0a0a',
            borderRadius: '50%',
            background: '#e8c97a',
            zIndex: 2,
          }}
        />
        {/* Stitching lines */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            border: '1px dashed rgba(10,10,10,0.2)',
            borderRadius: 2,
            pointerEvents: 'none',
          }}
        />
        {/* Handle left */}
        <div
          style={{
            position: 'absolute',
            top: -36,
            left: 48,
            width: 60,
            height: 40,
            borderTop: '2px solid #0a0a0a',
            borderLeft: '2px solid #0a0a0a',
            borderRight: '2px solid #0a0a0a',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        />
        {/* Handle right */}
        <div
          style={{
            position: 'absolute',
            top: -36,
            right: 48,
            width: 60,
            height: 40,
            borderTop: '2px solid #0a0a0a',
            borderLeft: '2px solid #0a0a0a',
            borderRight: '2px solid #0a0a0a',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        />
        {/* Decorative corner accents */}
        {[
          { top: 90, left: 12 },
          { top: 90, right: 12 },
          { bottom: 12, left: 12 },
          { bottom: 12, right: 12 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              background: '#e8c97a',
              borderRadius: '50%',
              ...pos,
            }}
          />
        ))}
        {/* Shadow plane */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '10%',
            width: '80%',
            height: 12,
            background: 'rgba(10,10,10,0.08)',
            filter: 'blur(8px)',
            borderRadius: '50%',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LINE-BY-LINE EDITORIAL REVEAL
───────────────────────────────────────────────────────────────────────────── */

function EditorialHeading({
  lines,
  fontSize = 72,
  accentColor,
}: {
  lines: string[];
  fontSize?: number;
  accentColor: import('framer-motion').MotionValue<string>;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            overflow: 'hidden',
            lineHeight: 1,
            marginBottom: '0.08em',
          }}
        >
          <motion.div
            initial={{ y: '105%' }}
            animate={inView ? { y: '0%' } : { y: '105%' }}
            transition={{
              duration: 1.0,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontSize,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#0a0a0a',
            }}
          >
            {line.startsWith('*') ? (
              <motion.em style={{ color: accentColor, fontStyle: 'italic' }}>
                {line.slice(1)}
              </motion.em>
            ) : (
              line
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOVER IMAGE MAGNIFIER PRODUCT CARD
───────────────────────────────────────────────────────────────────────────── */

function MagnifierCard({
  product,
  index,
  accentColor,
}: {
  product: (typeof COLLECTION)[0];
  index: number;
  accentColor: import('framer-motion').MotionValue<string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursor({ x, y });

    // Position panel: right side if cursor on left half, left side if right half
    const panelX = x > rect.width / 2 ? x - 240 - 16 : x + 16;
    const panelY = Math.max(0, Math.min(y - 80, rect.height - 180));
    setPanelPos({ x: panelX, y: panelY });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        cursor: hovered ? 'none' : 'auto',
        userSelect: 'none',
      }}
    >
      {/* Custom cursor dot */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#0a0a0a',
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Detail panel that follows cursor */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              left: panelPos.x,
              top: panelPos.y,
              width: 220,
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              padding: '16px',
              zIndex: 20,
              pointerEvents: 'none',
              boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
            }}
          >
            {/* Mini geometric swatch */}
            <div
              style={{
                width: '100%',
                height: 80,
                background: product.color,
                marginBottom: 12,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 13,
                color: '#0a0a0a',
                marginBottom: 4,
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 11,
                color: '#666',
                lineHeight: 1.5,
              }}
            >
              {product.desc.slice(0, 80)}…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card body */}
      <div
        style={{background: brand ?? '#f5f3f0',
          borderRadius: 2,
          overflow: 'hidden',
          aspectRatio: '3/4',
          position: 'relative',
          marginBottom: 16,
        }}
      >
        {/* CSS-drawn garment silhouette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 100,
              height: 140,
              background: product.color,
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              opacity: 0.85,
            }}
          >
            {/* Collar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 30,
                background: '#fafafa',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              }}
            />
            {/* Button line */}
            {[0, 1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  position: 'absolute',
                  top: 38 + n * 18,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
            {/* Left sleeve */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: -32,
                width: 32,
                height: 60,
                background: product.color,
                borderRadius: '4px 0 0 4px',
                opacity: 0.9,
              }}
            />
            {/* Right sleeve */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: -32,
                width: 32,
                height: 60,
                background: product.color,
                borderRadius: '0 4px 4px 0',
                opacity: 0.9,
              }}
            />
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              padding: '4px 10px',
              background: '#0a0a0a',
              color: '#fafafa',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,10,10,0.06)',
          }}
        />
      </div>

      {/* Card meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 15,
              color: '#0a0a0a',
              marginBottom: 4,
              letterSpacing: '0.01em',
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#999',
            }}
          >
            {product.category}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 15,
            color: '#0a0a0a',
          }}
        >
          ${product.price.toLocaleString("en-US")}
        </div>
      </div>

      {/* Add to bag — slides up on hover */}
      <motion.button
        animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          marginTop: 12,
          width: '100%',
          padding: '12px 0',
          background: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          pointerEvents: hovered ? 'auto' : 'none',
        }}
      >
        Add to Bag
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL-FADE REVEAL (generic)
───────────────────────────────────────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function FashionEditorialTemplate() {
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

  /* ── Refs ── */
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const lookbookRef = useRef<HTMLElement>(null);
  const sustainRef = useRef<HTMLElement>(null);

  /* ── Global scroll ── */
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });

  /* ── REQUIREMENT 1: Scroll-scrubbed rotateY for hero product ── */
  const heroProduct3DRotate = useTransform(scrollYProgress, [0, 0.15], [0, 360]);

  /* ── Hero section local scroll for opacity/scale ── */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);

  /* ── REQUIREMENT 3: Horizontal gallery track ── */
  const { scrollYProgress: galleryScrub } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });
  // Map vertical scroll to horizontal translation for 6 cards × 340px wide + gap
  const galleryX = useTransform(galleryScrub, [0.05, 0.95], ['0%', '-58%']);

  /* ── REQUIREMENT 4: Accent color scroll interpolation ── */
  // We split scrollYProgress into 3 bands across the total page
  const rawAccentR = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.82, 1],
    [10, 139, 26, 45, 10]
  );
  const rawAccentG = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.82, 1],
    [10, 69, 58, 74, 10]
  );
  const rawAccentB = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.82, 1],
    [10, 19, 92, 30, 10]
  );

  const springR = useSpring(rawAccentR, { stiffness: 40, damping: 20 });
  const springG = useSpring(rawAccentG, { stiffness: 40, damping: 20 });
  const springB = useSpring(rawAccentB, { stiffness: 40, damping: 20 });

  const accentColor = useMotionTemplate`rgb(${springR}, ${springG}, ${springB})`;

  /* ── Nav / UI state ── */
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* ── Multi-page state ── */
  type ActivePage = 'home' | 'boutique' | 'blog' | 'about' | 'contact' | 'cgv' | 'mentions';
  const [page, setPage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const goTo = (p: ActivePage) => {
    setPage(p);
    setSelectedProduct(null);
    setSelectedPost(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleAddToCart = useCallback(() => {
    setCartCount((n) => n + 1);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */

  
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
      ref={pageRef}
      style={{
        background: '#fafafa',
        color: '#0a0a0a',
        minHeight: '100vh',
        overflowX: 'clip',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Mobile fallback for the inline rigid grids below — stylesheet
          !important beats inline styles, so this is the lightest fix that
          doesn't touch the desktop rendering at all. */}
      <style>{`
        @media (max-width: 700px) {
          .i03-grid-3 { grid-template-columns: 1fr !important; }
          .i03-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .i03-timeline { grid-template-columns: 1fr !important; }
          .i03-timeline-line { display: none !important; }
        }
      `}</style>
      {/* ─── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 48px',
          background: 'rgba(250,250,250,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          boxSizing: 'border-box',
        }}
      >
        {/* Left links */}
        <div
          style={{
            display: 'flex',
            gap: 40,
          }}
        >
          {['Home', 'Boutique', 'Blog', 'About', 'Contact'].map((label) => {
            const key = label.toLowerCase() as ActivePage;
            return (
              <button
                key={label}
                onClick={() => goTo(key)}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: page === key ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.25s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = '#0a0a0a')}
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.color = page === key ? '#0a0a0a' : 'rgba(10,10,10,0.45)')
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Wordmark */}
        <div
          onClick={() => goTo('home')}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Georgia', serif",
            fontSize: 22,
            letterSpacing: '0.08em',
            fontWeight: 300,
            cursor: 'pointer',
          }}
        >
          <span style={{ fontStyle: 'italic' }}>Atelier</span>{' '}
          <span style={{ fontWeight: 400 }}>NOIR</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <button
            onClick={() => {
              if (page !== 'home') {
                goTo('home');
                setTimeout(() => scrollTo('stores'), 100);
              } else {
                scrollTo('stores');
              }
            }}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.45)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Stores
          </button>
          {/* Cart icon */}
          <button
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#0a0a0a',
                  color: '#fafafa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </nav>

      {page === 'home' && (
      <>
      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 1: EDITORIAL HERO — scroll-spin product + line reveal
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'stretch',
          paddingTop: 80,
          position: 'relative',
        }}
      >
        {/* Left: editorial text */}
        <motion.div
          style={{
            opacity: heroOpacity,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 48px 80px 64px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.4)',
              marginBottom: 40,
            }}
          >
            Spring · Summer 2026
          </motion.div>

          {/* REQUIREMENT 2: Line-by-line reveal */}
          <EditorialHeading
            lines={['The art', 'of quiet', '*luxury.']}
            fontSize={72}
            accentColor={accentColor}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
              lineHeight: 1.8,
              color: 'rgba(10,10,10,0.5)',
              maxWidth: 360,
              marginTop: 36,
              marginBottom: 48,
            }}
          >
            Garments that speak in silence. Each piece considered from fibre to finish — made to last a
            lifetime, designed to feel entirely your own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            style={{ display: 'flex', gap: 16, alignItems: 'center' }}
          >
            <button
              onClick={() => scrollTo('collection')}
              style={{
                padding: '14px 36px',
                background: '#0a0a0a',
                color: '#fafafa',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Explore Collection
            </button>
            <button
              onClick={() => scrollTo('lookbook')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(10,10,10,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Lookbook
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* Right: REQUIREMENT 1 — scroll-scrubbed rotateY product */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f2efe9',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background grid decoration */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Rotating label ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: 340,
              height: 340,
              borderRadius: '50%',
              border: '1px dashed rgba(10,10,10,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {['A', 'T', 'E', 'L', 'I', 'E', 'R', ' ', 'N', 'O', 'I', 'R', ' ', '·', ' '].map(
              (char, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    color: 'rgba(10,10,10,0.3)',
                    transform: `rotate(${i * (360 / 15)}deg) translateY(-168px)`,
                  }}
                >
                  {char}
                </span>
              )
            )}
          </motion.div>

          {/* The 3D-rotating product */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <GeometricProduct rotateY={heroProduct3DRotate} />
          </div>

          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 8,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.3)',
              }}
            >
              Scroll to rotate
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.3)" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 2: NEW COLLECTION — magnifier product grid
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="collection"
        style={{
          padding: '140px 64px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <Reveal style={{ marginBottom: 80 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <motion.div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                  color: accentColor,
                }}
              >
                New Collection
              </motion.div>
              <EditorialHeading lines={['The pieces', '*that define.']} fontSize={52} accentColor={accentColor} />
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13,
                color: 'rgba(10,10,10,0.45)',
                lineHeight: 1.8,
                maxWidth: 320,
              }}
            >
              Each garment in our SS26 collection is made to order in a single atelier in Paris. Delivery in 6–8 weeks.
            </div>
          </div>
        </Reveal>

        <div
          className="i03-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {COLLECTION.map((product, i) => (
            <MagnifierCard
              key={product.id}
              product={product}
              index={i}
              accentColor={accentColor}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 3: HORIZONTAL GALLERY — REQUIREMENT 3
          Sticky container: vertical scroll drives horizontal x translation
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="gallery"
        ref={galleryRef}
        style={{
          height: '300vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Section header */}
          <div
            style={{
              padding: '0 64px',
              marginBottom: 48,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <motion.div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: 12,
                }}
              >
                Featured Gallery
              </motion.div>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 42,
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: '#0a0a0a',
                  lineHeight: 1.1,
                }}
              >
                Scroll to explore
              </div>
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <svg width="32" height="1" viewBox="0 0 32 1">
                <line x1="0" y1="0" x2="32" y2="0" stroke="rgba(10,10,10,0.3)" strokeWidth="1" />
              </svg>
              Drag horizontally
            </div>
          </div>

          {/* Horizontal track — REQUIREMENT 3 */}
          <div
            style={{
              paddingLeft: 64,
              overflow: 'visible',
            }}
          >
            <motion.div
              style={{
                display: 'flex',
                gap: 24,
                x: galleryX,
                width: 'max-content',
              }}
            >
              {COLLECTION.map((product, i) => (
                <div
                  key={product.id}
                  style={{
                    width: 320,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {/* Image placeholder — CSS-drawn */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '2/3',
                      background: product.color,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: 20,
                    }}
                  >
                    {/* Abstract pattern overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%)`,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 20px 20px',
                      }}
                    />
                    {/* Product number label */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 64,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.06)',
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      0{i + 1}
                    </div>
                    {/* Center garment icon */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 110,
                          background: 'rgba(255,255,255,0.12)',
                          borderRadius: 2,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 32,
                            height: 24,
                            background: 'rgba(255,255,255,0.08)',
                            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                          }}
                        />
                      </div>
                    </div>

                    {product.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          padding: '4px 10px',
                          background: 'rgba(250,250,250,0.15)',
                          color: '#fafafa',
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: 9,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 17,
                      color: '#0a0a0a',
                      marginBottom: 6,
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: 11,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(10,10,10,0.4)',
                      marginBottom: 6,
                    }}
                  >
                    {product.category}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 15,
                      color: '#0a0a0a',
                    }}
                  >
                    ${product.price.toLocaleString("en-US")}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              padding: '32px 64px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'rgba(10,10,10,0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: '#0a0a0a',
                  width: useTransform(galleryScrub, [0.05, 0.95], ['0%', '100%']),
                }}
              />
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.3)',
              }}
            >
              {COLLECTION.length} pieces
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 4: LOOKBOOK — editorial grid
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="lookbook"
        ref={lookbookRef}
        style={{
          background: '#0a0a0a',
          color: '#fafafa',
          padding: '120px 64px',
        }}
      >
        <Reveal style={{ marginBottom: 72 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <motion.div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: 20,
                }}
              >
                Lookbook SS26
              </motion.div>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 52,
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.08,
                  color: '#fafafa',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ display: 'block' }}>Dressed</span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <em>with intention.</em>
                </div>
              </div>
            </div>
            <button
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,250,0.5)',
                background: 'none',
                border: '1px solid rgba(250,250,250,0.15)',
                padding: '12px 28px',
                cursor: 'pointer',
              }}
            >
              View all
            </button>
          </div>
        </Reveal>

        {/* Lookbook grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 12,
          }}
        >
          {LOOKBOOK_ITEMS.map((item, i) => {
            const positions = [
              { gridColumn: '1', gridRow: '1 / 3' },
              { gridColumn: '2', gridRow: '1' },
              { gridColumn: '3', gridRow: '1' },
              { gridColumn: '2', gridRow: '2' },
              { gridColumn: '3', gridRow: '2' },
            ];

            return (
              <Reveal
                key={i}
                delay={i * 0.1}
                style={{ ...positions[i], position: 'relative' }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: i === 0 ? '2/3' : '1/1',
                    background: `hsl(${20 + i * 15}, 10%, ${8 + i * 3}%)`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* Texture pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)`,
                    }}
                  />

                  {/* Abstract figure */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40%',
                      height: '70%',
                      background: `hsl(${20 + i * 15}, 12%, ${14 + i * 2}%)`,
                      borderRadius: '4px 4px 0 0',
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 9,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(250,250,250,0.45)',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <motion.div
                    whileHover={{ background: 'rgba(0,0,0,0.25)' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0)',
                      transition: 'background 0.4s ease',
                    }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 5: SUSTAINABILITY
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="sustainability"
        ref={sustainRef}
        style={{
          padding: '140px 64px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <Reveal style={{ marginBottom: 96 }}>
          <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 360px' }}>
              <motion.div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: 24,
                }}
              >
                Our Responsibility
              </motion.div>
              <EditorialHeading
                lines={['Built to', 'last forever.']}
                fontSize={52}
                accentColor={accentColor}
              />
            </div>
            <div
              style={{
                flex: '1 1 360px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: 8,
              }}
            >
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: 'rgba(10,10,10,0.5)',
                  maxWidth: 400,
                }}
              >
                We believe the most sustainable garment is one that never needs replacing. Every decision from
                fibre selection to final packaging is made through this lens. Atelier NOIR is a certified
                B-Corp and member of the Fashion Pact.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Stats row */}
        <div
          className="i03-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'rgba(10,10,10,0.08)',
          }}
        >
          {SUSTAINABILITY_ITEMS.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 0.15}
              style={{
                background: '#fafafa',
                padding: '60px 48px',
              }}
            >
              <motion.div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 64,
                  fontWeight: 300,
                  color: accentColor,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {item.number}
              </motion.div>
              <div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#0a0a0a',
                  marginBottom: 16,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'rgba(10,10,10,0.45)',
                }}
              >
                {item.detail}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Timeline / process */}
        <Reveal style={{ marginTop: 96 }}>
          <div
            className="i03-timeline"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
              position: 'relative',
            }}
          >
            {/* Connecting line */}
            <div
              className="i03-timeline-line"
              style={{
                position: 'absolute',
                top: 20,
                left: '12.5%',
                width: '75%',
                height: 1,
                background: 'rgba(10,10,10,0.12)',
              }}
            />

            {['Fibre sourcing', 'Artisan weaving', 'Atelier cutting', 'Hand finishing'].map(
              (step, i) => (
                <div key={i} style={{ textAlign: 'center', paddingTop: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid #0a0a0a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      background: '#fafafa',
                      position: 'relative',
                      zIndex: 1,
                      fontFamily: "'Georgia', serif",
                      fontSize: 14,
                      color: '#0a0a0a',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#0a0a0a',
                    }}
                  >
                    {step}
                  </div>
                </div>
              )
            )}
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 6: STORE LOCATOR
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="stores"
        style={{
          background: '#f5f2ed',
          padding: '120px 64px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal style={{ marginBottom: 72 }}>
            <motion.div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: accentColor,
                marginBottom: 20,
              }}
            >
              Our Maisons
            </motion.div>
            <EditorialHeading
              lines={['Find us', '*worldwide.']}
              fontSize={52}
              accentColor={accentColor}
            />
          </Reveal>

          <div
            className="i03-grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,
              background: 'rgba(10,10,10,0.08)',
            }}
          >
            {STORES.map((store, i) => (
              <Reveal
                key={store.city}
                delay={i * 0.1}
                style={{
                  background: '#f5f2ed',
                  padding: '48px 40px',
                }}
              >
                {/* City initial — large */}
                <div
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: 80,
                    fontWeight: 300,
                    color: 'rgba(10,10,10,0.06)',
                    lineHeight: 1,
                    marginBottom: 8,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {store.city[0]}
                </div>
                <div
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: 20,
                    color: '#0a0a0a',
                    marginBottom: 12,
                  }}
                >
                  {store.city}
                </div>
                <div
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 12,
                    color: 'rgba(10,10,10,0.5)',
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  {store.address}
                </div>
                <div
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(10,10,10,0.35)',
                  }}
                >
                  {store.hours}
                </div>
                <motion.button
                  whileHover={{ x: 4 }}
                  style={{
                    marginTop: 24,
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Get directions
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 7: NEWSLETTER
      ───────────────────────────────────────────────────────────────────── */}
      <section
        id="newsletter"
        style={{
          background: '#0a0a0a',
          color: '#fafafa',
          padding: '120px 64px',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <motion.div
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: 32,
            }}
          >
            Private List
          </motion.div>

          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 52,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <span>Join the inner</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <em>circle.</em>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
              color: 'rgba(250,250,250,0.4)',
              lineHeight: 1.8,
              maxWidth: 480,
              margin: '0 auto 48px',
            }}
          >
            Exclusive access to new arrivals, private sales, and invitations to our atelier events before
            anyone else.
          </p>

          {!submitted ? (
            <div
              style={{
                display: 'flex',
                gap: 0,
                maxWidth: 440,
                margin: '0 auto',
              }}
            >
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Your email address"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  background: 'rgba(250,250,250,0.06)',
                  border: '1px solid rgba(250,250,250,0.12)',
                  borderRight: 'none',
                  color: '#fafafa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => emailValue && setSubmitted(true)}
                style={{
                  padding: '16px 28px',
                  background: '#fafafa',
                  color: '#0a0a0a',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,250,0.5)',
              }}
            >
              Welcome to the circle.
            </motion.div>
          )}

          {/* Decorative divider */}
          <div
            style={{
              marginTop: 80,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 60, height: 1, background: 'rgba(250,250,250,0.1)' }} />
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 18,
                color: 'rgba(250,250,250,0.15)',
                fontStyle: 'italic',
              }}
            >
              Atelier NOIR
            </div>
            <div style={{ width: 60, height: 1, background: 'rgba(250,250,250,0.1)' }} />
          </div>
        </Reveal>
      </section>
      </>
      )}

      {/* ── SUB-PAGES ROUTING ── */}
      {page === 'boutique' && (
        <BoutiquePage
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
          accentColor={accentColor}
        />
      )}
      {page === 'blog' && (
        <BlogPage
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          accentColor={accentColor}
        />
      )}
      {page === 'about' && <AboutPage accentColor={accentColor} />}
      {page === 'contact' && <ContactPage accentColor={accentColor} />}
      {page === 'cgv' && <LegalPage variant="cgv" accentColor={accentColor} />}
      {page === 'mentions' && <LegalPage variant="mentions" accentColor={accentColor} />}

      {/* ─────────────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────────────── */}
      <footer id="contact"
        style={{
          background: '#0a0a0a',
          color: '#fafafa',
          borderTop: '1px solid rgba(250,250,250,0.05)',
          padding: '64px 64px 40px',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: 48,
              marginBottom: 64,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 24,
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                  marginBottom: 20,
                }}
              >
                <em>Atelier</em> NOIR
              </div>
              <p
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 12,
                  lineHeight: 1.8,
                  color: 'rgba(250,250,250,0.3)',
                  maxWidth: 280,
                }}
              >{c?.aboutText ?? <>
                Slow fashion of the highest order. Made in Paris, worn worldwide. B-Corp certified since 2021.
              </>}</p>
            </div>

            {[
              { heading: 'Maison', links: [{ label: 'Collection', key: 'home' as const }, { label: 'About', key: 'about' as const }] },
              { heading: 'Services', links: [{ label: 'Boutique', key: 'boutique' as const }, { label: 'Blog', key: 'blog' as const }, { label: 'Contact', key: 'contact' as const }] },
              { heading: 'Legal', links: [{ label: 'Mentions Légales', key: 'mentions' as const }, { label: 'CGV', key: 'cgv' as const }] },
            ].map((col) => (
              <div key={col.heading}>
                <div
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,250,250,0.3)',
                    marginBottom: 20,
                  }}
                >
                  {col.heading}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => goTo(link.key)}
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: 12,
                          color: 'rgba(250,250,250,0.4)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'color 0.2s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLButtonElement).style.color = '#fafafa')
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLButtonElement).style.color = 'rgba(250,250,250,0.4)')
                        }
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(250,250,250,0.06)',
              paddingTop: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                color: 'rgba(250,250,250,0.2)',
                letterSpacing: '0.1em',
              }}
            >
              © 2026 Atelier NOIR. All rights reserved.
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                color: 'rgba(250,250,250,0.2)',
                letterSpacing: '0.1em',
              }}
            >
              Paris · London · New York · Tokyo
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: BOUTIQUE
───────────────────────────────────────────────────────────────────────────── */
function BoutiquePage({
  selectedProduct,
  setSelectedProduct,
  onAddToCart,
  accentColor,
}: {
  selectedProduct: any | null;
  setSelectedProduct: (p: any | null) => void;
  onAddToCart: () => void;
  accentColor: import('framer-motion').MotionValue<string>;
}) {
  if (selectedProduct) {
    return (
      <div style={{ padding: '120px 64px 80px', maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <button
          onClick={() => setSelectedProduct(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 48,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to boutique
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
          {/* Visual wrapper */}
          <div
            style={{
              aspectRatio: '3/4',
              background: selectedProduct.color,
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 140,
                height: 200,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 50,
                  height: 38,
                  background: 'rgba(255,255,255,0.1)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>
          </div>

          {/* Product details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.4)',
                marginBottom: 16,
              }}
            >
              {selectedProduct.category}
            </div>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 36,
                fontWeight: 300,
                color: '#0a0a0a',
                marginBottom: 16,
                letterSpacing: '-0.02em',
              }}
            >
              {selectedProduct.name}
            </h1>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 22,
                color: '#0a0a0a',
                marginBottom: 32,
              }}
            >
              ${selectedProduct.price.toLocaleString("en-US")}
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: 'rgba(10,10,10,0.6)',
                marginBottom: 40,
              }}
            >
              {selectedProduct.desc}
            </p>

            <button
              onClick={onAddToCart}
              style={{
                padding: '16px 48px',
                background: '#0a0a0a',
                color: '#fafafa',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 24,
                width: 'fit-content',
              }}
            >
              Add to Bag
            </button>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(10,10,10,0.4)',
                lineHeight: 1.6,
              }}
            >
              • Made to order in Paris<br />
              • Complimentary worldwide shipping<br />
              • Returns accepted within 14 days
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 64px 100px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 16,
          }}
        >
          The Boutique
        </h1>
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          Explore our permanent edit of hand-finished quiet luxury garments.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 32,
        }}
      >
        {COLLECTION.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              setSelectedProduct(product);
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{background: brand ?? '#f5f3f0',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '3/4',
                position: 'relative',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 140,
                  background: product.color,
                  borderRadius: 2,
                  opacity: 0.85,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: 15,
                    color: '#0a0a0a',
                    marginBottom: 4,
                  }}
                >
                  {product.name}
                </h3>
                <div
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#999',
                  }}
                >
                  {product.category}
                </div>
              </div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: '#0a0a0a' }}>
                ${product.price.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: BLOG
───────────────────────────────────────────────────────────────────────────── */
const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Philosophy of Slow Fashion',
    date: 'October 12, 2025',
    category: 'Philosophy',
    excerpt: 'Understanding why buying less but buying better is the ultimate luxury for the modern wardrobe.',
    content: [
      'In a world dominated by ultra-fast fashion, quiet luxury represents a return to form. It is the conscious choice to value craftsmanship, material integrity, and longevity over fleeting trends.',
      'At Atelier NOIR, every piece is designed to be worn for decades. We select raw fibers that age beautifully, and we partner with heritage weavers who keep traditional techniques alive. This commitment is slower, but it produces garments that carry stories.',
      'To build a wardrobe with intention is to curate your life. It is selecting twelve perfectly fitting pieces rather than fifty disposable ones. It is knowing the hands that spun the silk and the tailors who cut the wool.'
    ]
  },
  {
    id: 2,
    title: 'How to Care for Double-Faced Cashmere',
    date: 'September 28, 2025',
    category: 'Care',
    excerpt: 'A comprehensive guide to preserving the texture, warmth, and shape of your hand-stitched cashmere coats.',
    content: [
      'Cashmere is a delicate, living fiber. Double-faced cashmere, which uses two layers of cashmere woven together, requires special attention to keep its loft and softness.',
      'Never machine wash or dry clean your cashmere coat frequently. Instead, brush it gently with a soft garment brush to remove surface dust. If a stain occurs, spot clean immediately with cold water and mild baby shampoo.',
      'Store your coat on a wide, padded hanger to maintain the shoulder structure. During summer, store it in a breathable cotton garment bag with cedar blocks to protect it from pests. Treated correctly, it will keep its beauty for generations.'
    ]
  }
];

function BlogPage({
  selectedPost,
  setSelectedPost,
  accentColor,
}: {
  selectedPost: any | null;
  setSelectedPost: (p: any | null) => void;
  accentColor: import('framer-motion').MotionValue<string>;
}) {
  if (selectedPost) {
    return (
      <div style={{ padding: '120px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <button
          onClick={() => setSelectedPost(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 48,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to blog
        </button>

        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: 16 }}>
          {selectedPost.category} · {selectedPost.date}
        </div>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 40,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 40,
            lineHeight: 1.2,
          }}
        >
          {selectedPost.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {selectedPost.content.map((p: string, idx: number) => (
            <p key={idx} style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 64px 100px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 16,
          }}
        >
          The Notebook
        </h1>
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          Insights on design, materiality, and the quiet luxury way of life.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => {
              setSelectedPost(post);
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 48,
              cursor: 'pointer',
              borderBottom: '1px solid rgba(10,10,10,0.06)',
              paddingBottom: 48,
            }}
          >
            {/* Post meta */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
                {post.category}
              </div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: 'rgba(10,10,10,0.3)' }}>
                {post.date}
              </div>
            </div>

            {/* Post preview */}
            <div>
              <h2
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 24,
                  fontWeight: 300,
                  color: '#0a0a0a',
                  marginBottom: 12,
                  letterSpacing: '-0.01em',
                }}
              >
                {post.title}
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, lineHeight: 1.7, color: 'rgba(10,10,10,0.5)', marginBottom: 20 }}>
                {post.excerpt}
              </p>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
                Read notebook
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: ABOUT
───────────────────────────────────────────────────────────────────────────── */
function AboutPage({ accentColor }: { accentColor: import('framer-motion').MotionValue<string> }) {
  return (
    <div style={{ padding: '120px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 16,
          }}
        >
          Our Story
        </h1>
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          Craftsmanship, design, and longevity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontSize: 15, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
        <p>
          Founded in Paris in 2021, Atelier NOIR is an independent fashion house dedicated to the art of quiet luxury. We reject the rapid cycles of fast fashion in favor of a slower, more deliberate method of creation.
        </p>
        <p>
          Our garments are defined by architectural simplicity, meticulous tailoring, and exceptional materials. We work exclusively with certified natural fibers—organic cashmere, French flax linen, and Japanese silk—sourced from mills that guarantee raw material traceability and ecological responsibility.
        </p>
        <p>
          Every piece is handcrafted to order in our Parisian atelier by master artisans who bring decades of high-fashion experience. By making only what is ordered, we eliminate excess production and waste, creating garments that are as responsible as they are beautiful.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: CONTACT
───────────────────────────────────────────────────────────────────────────── */
function ContactPage({ accentColor }: { accentColor: import('framer-motion').MotionValue<string> }) {
  const [formSent, setFormSent] = useState(false);

  return (
    <div style={{ padding: '120px 64px 100px', maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            marginBottom: 16,
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          Enquire about bespoke orders or private appointments.
        </p>
      </div>

      {!formSent ? (
        <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Name</label>
            <input required type="text" style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Email</label>
            <input required type="email" style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Message</label>
            <textarea required rows={5} style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13, resize: 'none' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '16px', background: '#0a0a0a', color: '#fafafa', border: 'none', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 12 }}>
            Send message
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(10,10,10,0.6)' }}>
          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Thank you.</h3>
          <p style={{ fontSize: 13 }}>Your enquiry has been received. Our team will contact you within 24 hours.</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-PAGE: LEGAL (MENTIONS / CGV)
───────────────────────────────────────────────────────────────────────────── */
function LegalPage({ variant, accentColor }: { variant: 'cgv' | 'mentions'; accentColor: import('framer-motion').MotionValue<string> }) {
  return (
    <div style={{ padding: '120px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {variant === 'mentions' ? (
        <>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 40 }}>Mentions Légales</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Éditeur</h2>
              <p>
                Aevia WS — Valentin Milliand<br />
                Entrepreneur individuel<br />
                SIREN 852 546 225<br />
                RCS Bourg-en-Bresse<br />{fd?.email ?? "valentinmilliand@aevia.services"}</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Hébergeur</h2>
              <p>
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789, USA
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Adresse physique</h2>
              <p>Communiquée sur demande.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 40 }}>Conditions Générales de Vente</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>1. Objet</h2>
              <p>Les présentes Conditions Générales de Vente régissent les relations contractuelles entre Atelier NOIR et tout client effectuant un achat sur notre boutique en ligne.</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>2. Prix et commande</h2>
              <p>Les prix de nos produits sont indiqués en Dollars ($) ou Euros (€) toutes taxes comprises. La commande est validée après paiement complet de la commande.</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>3. Livraison et Retours</h2>
              <p>Nos pièces étant réalisées sur commande dans notre atelier parisien, le délai de fabrication et d&apos;expédition est de 6 à 8 semaines. Les retours sont possibles sous 14 jours.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
