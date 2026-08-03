"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Coffee,
  Compass,
  DollarSign,
  Euro,
  FileText,
  Flame,
  Heart,
  Info,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Scissors,
  Shield,
  ShoppingBag,
  Star,
  Sun,
  TrendingUp,
  Utensils,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { resolveList } from "@/lib/templates/resolveList";
import { DWELL, useSlides, BlurThrough, SlideIndex, HairlineArrows } from '@/lib/templates/hero-kit-2';
import { CrossPush } from '@/lib/templates/hero-kit-3';
import {
  clientFaq,
  clientPhotos,
  clientReviews,
  clientServices,
} from "@/lib/templates/clientContent";

/* CrossPush (v07, the tattoo recording itself): the outgoing photograph
   slides left while the next arrives from the right — two passing shots,
   both subjects on screen for an instant, no fade. The three photos were
   already in this file (hero / about / special), verified at the merge. */
const HERO_STYLES_DEMO = [
  { k: 'Fineline', d: 'Traits fins, précision millimétrée', img: 'https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { k: 'Aquarelle', d: 'Couleurs diluées, contours libres', img: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=1600&auto=format&fit=crop' },
  { k: 'Botanique', d: 'Fleurs et feuillages sur mesure', img: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop' },
];
let HERO_STYLES = HERO_STYLES_DEMO;

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;
// Custom Instagram icon component for compatibility
const Instagram = ({ size = 24, ...props }: React.ComponentProps<'svg'> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


/* ════════════════════════════════════════════════════════════════════════════
   ENCRE DÉLICATE — Studio tatouage fineline Bordeaux — aquarelle, fineline féminin, sur RDV. Playfair Display, blanc / rose poudré.
   Fichier auto-suffisant premium généré par Antigravity.
   ════════════════════════════════════════════════════════════════════════════ */

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
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
  primary: "var(--brand,#c8a0b0)",
  primaryLight: "var(--brand-light,#dab8c6)",
  primaryDark: "#a08090",
  bg: "#fefefe",
  bgDeep: "#f8f4f6",
  bgCard: "#ffffff",
  text: "#0d0508",
  textMuted: "#8a7880",
  accent: '#0d0508',
  white: "#ffffff",
  black: "#000000",
};

const SERIF = "'Playfair Display', serif" as const;
const SANS = "'DM Mono', monospace" as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=1600",
  about: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=1600&auto=format&fit=crop",
  special: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=800&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=800&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop",
  gallery4: "https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=800"
} as const;

/* ── Primitives Reutilisables ─────────────────────────────────────────────── */

function Eyebrow({
  children,
  color = C.primary,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      marginBottom: 16
    }}>
      <span style={{ width: 32, height: 1.5, background: color, opacity: 0.6 }} />
      <span style={{
        fontFamily: SANS,
        fontSize: 10.5,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color,
        fontWeight: 700
      }}>{children}</span>
      {align === 'center' && <span style={{ width: 32, height: 1.5, background: color, opacity: 0.6 }} />}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Button({
  children,
  onClick,
  filled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 28px',
        fontFamily: SANS,
        fontSize: 11.5,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 700,
        cursor: 'pointer',
        border: `1.5px solid ${C.primary}`,
        background: filled ? C.primary : 'transparent',
        color: filled ? (C.white) : C.primary,
        borderRadius: 2,
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover && filled ? `0 6px 20px ${C.primary}33` : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
      <ArrowRight size={13} style={{
        transform: hover ? 'translateX(4px)' : 'none',
        transition: 'transform 0.4s ease'
      }} />
    </button>
  );
}

/* Booking form field — bordered box style matching this template's existing
   contact form, with a visible focus ring (the pre-existing inputs had none). */
function FormField({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>
        {label}{required && <span style={{ color: C.primary }}> *</span>}
      </label>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: '100%',
          minHeight: 44,
          boxSizing: 'border-box',
          padding: '12px 16px',
          background: C.bgCard,
          border: focused ? `1.5px solid ${C.primary}` : `1px solid ${C.primary}1a`,
          boxShadow: focused ? `0 0 0 3px ${C.primary}22` : 'none',
          borderRadius: 2,
          color: C.text,
          fontFamily: SANS,
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
    </div>
  );
}

function FormSelect({
  label,
  required,
  children,
  ...props
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>
        {label}{required && <span style={{ color: C.primary }}> *</span>}
      </label>
      <select
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: '100%',
          minHeight: 44,
          boxSizing: 'border-box',
          padding: '12px 16px',
          background: C.bgCard,
          border: focused ? `1.5px solid ${C.primary}` : `1px solid ${C.primary}1a`,
          boxShadow: focused ? `0 0 0 3px ${C.primary}22` : 'none',
          borderRadius: 2,
          color: C.text,
          fontFamily: SANS,
          fontSize: 14,
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {children}
      </select>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENTS
   ════════════════════════════════════════════════════════════════════════════ */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
export default function Page() {
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
    businessProfile?: any;
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 0;
    const _photoArrays: any[] = [PHOTO];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  HERO_STYLES = HERO_STYLES_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, primary: brand, primaryLight: shadeColor(brand, 25), primaryDark: shadeColor(brand, -20) };
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', style: '', date: '', time: '', message: '' });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_STYLES.length, DWELL.slow);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '8%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const MENU_DEMO: any[] = [{"name": "Tatouage Fineline Poignet", "category": "Fineline", "desc": "Motif floral délicat tracé avec des aiguilles ultra-fines.", "price": "120,00 €"}, {"name": "Projet Aquarelle Dos", "category": "Aquarelle", "desc": "Composition colorée à effet aquarelle fluide et fondue.", "price": "250,00 €"}, {"name": "Mini Flash Lettrage", "category": "Minimaliste", "desc": "Mot ou date symbolique, typographie fine sur mesure.", "price": "80,00 €"}];
  const menuItemsAll = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      name: s.title ?? MENU_DEMO[i % MENU_DEMO.length].name,
      category: MENU_DEMO[i % MENU_DEMO.length].category,
      desc: s.description ?? MENU_DEMO[i % MENU_DEMO.length].desc,
      price: s.price ?? MENU_DEMO[i % MENU_DEMO.length].price,
    })),
    MENU_DEMO,
  );
  const menuItemsFiltered = activeCategory === "Tous"
    ? menuItemsAll
    : menuItemsAll.filter((item: any) => item.category === activeCategory);

  // Distinct style names for the booking form's style picker — sourced from
  // the same catalog rendered above, so the form never drifts from the menu.
  const styleOptions: string[] = Array.from(new Set(menuItemsAll.map((item: any) => item.name as string)));
  const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
  const todayISO = new Date().toISOString().split('T')[0];

  const selectStyleForBooking = (styleName: string) => {
    setSelectedStyle(styleName);
    setFormData((f) => ({ ...f, style: styleName }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.style || !formData.date || !formData.time) return;
    setFormLoading(true);
    // No real backend for this template — simulate a submission round-trip
    // so the flow feels real (loading state → confirmation) without faking success instantly.
    window.setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1500 + Math.round(Math.random() * 700));
  };



return (
    <div style={{
      background: C.bg,
      color: C.text,
      fontFamily: SANS,
      minHeight: '100dvh',
      overflowX: 'hidden'
    }}>
      
      {/* ════════ NAVBAR ════════ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: `rgba(${(C.bg as string) === '#ffffff' ? '255,255,255' : '18,18,18'}, 0.85)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.primary}12`
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="#hero" style={{
            fontFamily: SERIF,
            fontSize: 22,
            fontWeight: 700,
            color: C.primary,
            textDecoration: 'none',
            letterSpacing: '0.05em'
          }}>
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              fd?.businessName ?? "Encre Délicate"
            )}
          </a>

          {/* Desktop links */}
          <div style={{ gap: 28, alignItems: 'center' }} className="hidden md:flex">
            <a href="#about" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>À Propos</a>
            <a href="#menu" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Nos Tarifs
            </a>
            <a href="#gallery" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Galerie</a>
            <a href="#faq" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>FAQ</a>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <button style={{
                background: C.primary,
                color: C.white,
                border: 'none',
                padding: '9px 18px',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: 2,
                cursor: 'pointer'
              }}>
                Prendre rendez-vous
              </button>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.primary,
              cursor: 'pointer'
            }}
            className="md:hidden"
            aria-label="Menu mobile"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: C.bgDeep,
                borderBottom: `1px solid ${C.primary}12`,
                overflow: 'hidden'
              }}
              className="md:hidden"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>À Propos</a>
                <a href="#menu" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>
                  Nos Tarifs
                </a>
                <a href="#gallery" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Galerie</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>FAQ</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: C.primary,
                    color: C.white,
                    border: 'none',
                    padding: '12px 24px',
                    width: '100%',
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    borderRadius: 2
                  }}>
                    Prendre rendez-vous
                  </button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════ HERO SECTION ════════ */}
      <section 
        id="hero" 
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100dvh',
          minHeight: 650,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '12vh',
          /* Fond de repli sombre : sans photo (réseau lent, image 404), il ne
             reste que le dégradé — le titre blanc doit rester lisible. */
          background: C.text,
          overflow: 'hidden'
        }}
      >
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          scale: heroScale,
          y: heroY,
          opacity: heroOpacity
        }}>
          <CrossPush
            images={HERO_STYLES.map((st, n) => fd?.photoUrls?.[n] || st.img)}
            index={heroI}
            overlay={0}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)'
          }} />
        </motion.div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          <Reveal delay={0.25}>
            <h1 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px, 6.5vw, 84px)',
              lineHeight: 1.05,
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 20,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>{c?.heroHeadline ?? <>
              Tatouage Fineline<br />& Aquarelle
            </>}</h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 19px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 650,
              margin: '0 auto 36px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>{c?.heroSubline ?? fd?.tagline ?? <>
              Studio féminin sur rendez-vous. Fineline, aquarelle, tatouages délicats et durables. Bordeaux.
            </>}</p>
          </Reveal>

          <Reveal delay={0.55}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <Button filled>Prendre rendez-vous</Button>
              </a>
              <a href="#menu" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  fontSize: 11.5,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                  Portfolio
                </button>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.7}>
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <SlideIndex i={heroI} total={HERO_STYLES.length} variant="fraction" className="" color="rgba(255,255,255,0.6)" />
              <BlurThrough index={heroI} amount={8}>
                <span style={{ fontFamily: SERIF, fontSize: 16, color: '#fff' }}>
                  {HERO_STYLES[heroI].k}
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}> — {HERO_STYLES[heroI].d}</span>
                </span>
              </BlurThrough>
              <HairlineArrows onPrev={heroPrev} onNext={heroNext} color="rgba(255,255,255,0.7)" labels={{ prev: 'Style précédent', next: 'Style suivant' }} />
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.7,
          color: '#ffffff',
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          <span>Défiler</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ════════ STATS & BADGES ════════ */}
      <section style={{ padding: '80px 24px', background: C.bgDeep, borderBottom: `1px solid ${C.primary}0d` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 40,
            textAlign: 'center'
          }}>
            {menuItemsFiltered.length > 0 && [{"value": "100%", "label": "Usage Unique"}, {"value": "Vegan", "label": "Encres Certifiées"}, {"value": "1-to-1", "label": "Consultation"}].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: '16px 8px' }}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 48,
                    fontWeight: 700,
                    color: C.primary,
                    marginBottom: 8
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: C.textMuted,
                    fontWeight: 600
                  }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT / STORY SECTION ════════ */}
      <section id="about" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64,
            alignItems: 'center'
          }}>
            <Reveal>
              <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img 
                  src={PHOTO.about} 
                  alt="About portrait showing our craft" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  border: `12px solid ${C.bg}`,
                  pointerEvents: 'none'
                }} />
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.15}>
                <Eyebrow>{fd?.businessName ?? "Encre Délicate"}</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  lineHeight: 1.15,
                  color: C.primary,
                  marginBottom: 24,
                  fontWeight: 700
                }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  L'Art du Trait Fin
                </>}</h2>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.textMuted,
                  marginBottom: 20
                }}>{c?.aboutText ?? <>
                  Encre Délicate est un studio féminin spécialisé dans le tatouage fineline et aquarelle. Chaque pièce est dessinée sur mesure, adaptée à votre anatomie et à votre sensibilité.
                </>}</p>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.textMuted,
                  marginBottom: 36
                }}>
                  Chaque détail est pensé pour créer une expérience singulière, alliant savoir-faire historique et modernité.
                </p>
                <a href="#contact" style={{ textDecoration: 'none' }}>
                  <Button filled>Prendre rendez-vous</Button>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HIGHLIGHT / SPECIAL FEATURES ════════ */}
      <section style={{ padding: '100px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <Eyebrow align="center">Savoir-Faire Unique</Eyebrow>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: C.primary,
              marginBottom: 16,
              fontWeight: 700
            }}>
              Tatouage Aquarelle
            </h2>
            <p style={{
              fontSize: 16,
              color: C.textMuted,
              maxWidth: 600,
              margin: '0 auto 64px',
              lineHeight: 1.6
            }}>
              Effet peinture aquarelle, couleurs douces et fondues. Technique unique pour des résultats poétiques et durables.
            </p>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 32
          }}>
            <Reveal delay={0.1}>
              <div style={{
                background: C.bgCard,
                padding: 40,
                borderRadius: 4,
                textAlign: 'left',
                border: `1px solid ${C.primary}0f`,
                height: '100%'
              }}>
                <div style={{ color: C.primary, marginBottom: 20 }}><Award size={32} /></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 20, color: C.primary, marginBottom: 12, fontWeight: 700 }}>Qualité Absolue</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Sélection minutieuse de chaque élément pour un résultat d'exception.</p>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div style={{
                background: C.bgCard,
                padding: 40,
                borderRadius: 4,
                textAlign: 'left',
                border: `1px solid ${C.primary}0f`,
                height: '100%'
              }}>
                <div style={{ color: C.primary, marginBottom: 20 }}><Clock size={32} /></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 20, color: C.primary, marginBottom: 12, fontWeight: 700 }}>Prise de Rendez-vous</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Des créneaux flexibles et un accompagnement réactif sous 24h.</p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div style={{
                background: C.bgCard,
                padding: 40,
                borderRadius: 4,
                textAlign: 'left',
                border: `1px solid ${C.primary}0f`,
                height: '100%'
              }}>
                <div style={{ color: C.primary, marginBottom: 20 }}><Shield size={32} /></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 20, color: C.primary, marginBottom: 12, fontWeight: 700 }}>Garantie &amp; Sécurité</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Conformité totale avec les normes en vigueur et transparence tarifaire.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ MENU / SERVICES SECTION ════════ */}
      <section id="menu" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Reveal>
              <Eyebrow align="center">Tarifs & Services</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: C.primary,
                marginBottom: 24,
                fontWeight: 700
              }}>
                Nos Styles
              </h2>
            </Reveal>

            {/* Tabs */}
            <Reveal delay={0.15}>
              <div style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                background: C.bgDeep,
                padding: 6,
                borderRadius: 30,
                maxWidth: 550,
                margin: '0 auto'
              }}>
                {["Tous","Flashs","Projets","Soins"].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCategory(tab)}
                    style={{
                      background: activeCategory === tab ? C.primary : 'transparent',
                      color: activeCategory === tab 
                        ? C.white
                        : C.textMuted,
                      border: 'none',
                      padding: '8px 20px',
                      fontSize: 11.5,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      borderRadius: 20,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Menu Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {menuItemsFiltered.map((item, i) => {
              const isSelected = selectedStyle === item.name;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div style={{
                    paddingBottom: 24,
                    borderBottom: `1px solid ${C.primary}12`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 20,
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 12,
                          marginBottom: 6,
                          flexWrap: 'wrap'
                        }}>
                          <h4 style={{
                            fontFamily: SERIF,
                            fontSize: 18,
                            fontWeight: 700,
                            color: C.primary,
                            margin: 0
                          }}>
                            {item.name}
                          </h4>
                          <span style={{
                            background: `${C.primary}1a`,
                            color: C.primary,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 10
                          }}>
                            {item.category}
                          </span>
                        </div>
                        <p style={{
                          fontSize: 13.5,
                          color: C.textMuted,
                          margin: 0,
                          lineHeight: 1.5
                        }}>
                          {item.desc}
                        </p>
                      </div>
                      <div style={{
                        fontFamily: SERIF,
                        fontSize: 18,
                        fontWeight: 700,
                        color: C.accent,
                        whiteSpace: 'nowrap'
                      }}>
                        {item.price}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectStyleForBooking(item.name)}
                      aria-pressed={isSelected}
                      style={{
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        minHeight: 44,
                        padding: '10px 18px',
                        background: isSelected ? C.primary : 'transparent',
                        color: isSelected ? C.white : C.primary,
                        border: `1.5px solid ${C.primary}`,
                        borderRadius: 2,
                        fontFamily: SANS,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isSelected ? <Check size={14} /> : null}
                      {isSelected ? 'Style sélectionné pour le RDV' : 'Réserver ce style'}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ PORTFOLIO / GALERIE ════════ */}
      <section id="gallery" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <Eyebrow align="center">Portfolio</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: C.primary,
                marginBottom: 16,
                fontWeight: 700
              }}>
                Notre Galerie Visuelle
              </h2>
            </div>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: 20
          }}>
            <Reveal delay={0.1}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={bp?.beforeAfter?.[0]?.afterUrl ?? bp?.beforeAfter?.[0]?.beforeUrl ?? PHOTO.gallery1} alt={bp?.beforeAfter?.[0]?.caption ?? "Visuel galerie 1"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={bp?.beforeAfter?.[1]?.afterUrl ?? bp?.beforeAfter?.[1]?.beforeUrl ?? PHOTO.gallery2} alt={bp?.beforeAfter?.[1]?.caption ?? "Visuel galerie 2"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={bp?.beforeAfter?.[2]?.afterUrl ?? bp?.beforeAfter?.[2]?.beforeUrl ?? PHOTO.gallery3} alt={bp?.beforeAfter?.[2]?.caption ?? "Visuel galerie 3"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={bp?.beforeAfter?.[3]?.afterUrl ?? bp?.beforeAfter?.[3]?.beforeUrl ?? PHOTO.gallery4} alt={bp?.beforeAfter?.[3]?.caption ?? "Visuel galerie 4"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <Eyebrow align="center">Témoignages</Eyebrow>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: C.primary,
              marginBottom: 64,
              fontWeight: 700
            }}>
              Ce que disent nos clients
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ position: 'relative', background: C.bgDeep, padding: '48px 32px', borderRadius: 4, border: `1px solid ${C.primary}0c` }}>
              <div style={{ color: C.primary, opacity: 0.15, position: 'absolute', top: 24, left: 24 }}><Quote size={56} /></div>
              <p style={{
                fontFamily: SERIF,
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                lineHeight: 1.5,
                color: C.text,
                fontStyle: 'italic',
                marginBottom: 24,
                position: 'relative',
                zIndex: 2
              }}>
                "{clientReviews(sessionData)?.[0]?.text ?? "Une prestation irréprochable et un souci du détail impressionnant. Les délais ont été parfaitement respectés, et la communication a toujours été fluide."}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={C.primary} color={C.primary} />)}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary }}>
                {clientReviews(sessionData)?.[0]?.name
                  ? `${bp.reputation.featuredReviews[0].name}${bp.reputation.featuredReviews[0].location ? ` · ${bp.reputation.featuredReviews[0].location}` : ""}`
                  : "Marie Lauret · Bordeaux"}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ FAQ SECTION ════════ */}
      <section id="faq" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Reveal>
              <Eyebrow align="center">Foire aux questions</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: C.primary,
                marginBottom: 16,
                fontWeight: 700
              }}>
                Des questions ? Nos réponses.
              </h2>
            </Reveal>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {resolveList(clientFaq(sessionData)?.map((f: any) => ({ q: f.q, a: f.a })), [{"q":"Quelles sont les consignes d'hygiène ?","a":"Nous utilisons exclusivement du matériel à usage unique stérile ouvert devant vous, et notre studio respecte les protocoles de stérilisation de classe médicale."},{"q":"Est-ce douloureux le tatouage fineline ?","a":"Le tracé fin utilise des aiguilles beaucoup plus fines que le tatouage classique, ce qui réduit significativement la sensation de douleur et facilite la cicatrisation."},{"q":"Comment réserver une séance ?","a":"Remplissez le formulaire de contact en détaillant votre idée, la taille souhaitée et l'emplacement sur le corps. Nous vous répondrons sous 5 jours."}] as any[]).map((item: any, i: number) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: C.bgCard,
                  borderRadius: 4,
                  border: `1px solid ${C.primary}0d`,
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: C.text
                    }}
                  >
                    <span style={{ fontFamily: SERIF, fontSize: 16.5, fontWeight: 700, color: C.primary }}>
                      {item.q}
                    </span>
                    <ChevronDown size={18} style={{
                      transform: expandedFaq === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease',
                      color: C.primary
                    }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '0 24px 24px',
                          fontSize: 14.5,
                          lineHeight: 1.6,
                          color: C.textMuted
                        }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CONTACT & FORM ════════ */}
      <section id="contact" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64
          }}>
            <div>
              <Reveal>
                <Eyebrow>Contact &amp; Réservations</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  color: C.primary,
                  marginBottom: 24,
                  fontWeight: 700
                }}>
                  Discutons de votre projet
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, marginBottom: 40 }}>
                  Remplissez notre formulaire ou contactez-nous directement par téléphone. Notre équipe vous répondra sous un délai maximum de 24h ouvrées.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `${C.primary}0d`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.primary,
                      flexShrink: 0
                    }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>Téléphone</div>
                      <a href={`tel:${fd?.phone ?? "+33500000000"}`} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>+33 (0)5 00 00 00 00</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `${C.primary}0d`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.primary,
                      flexShrink: 0
                    }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>Adresse E-mail</div>
                      <a href={`mailto:${fd?.email ?? "contact@mysite.com"}`} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>contact@encredélicate.com</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `${C.primary}0d`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.primary,
                      flexShrink: 0
                    }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>Localisation</div>
                      <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>
                        tatouage fineline Bordeaux
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal delay={0.15}>
                <div style={{
                  background: C.bgDeep,
                  padding: 40,
                  borderRadius: 4,
                  border: `1px solid ${C.primary}0d`
                }}>
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '24px 0' }}
                    >
                      <div style={{ color: C.primary, marginBottom: 16 }}><CheckCircle size={48} style={{ margin: '0 auto' }} /></div>
                      <h3 style={{ fontFamily: SERIF, fontSize: 22, color: C.primary, marginBottom: 8, fontWeight: 700 }}>Demande de rendez-vous reçue !</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
                        Merci {formData.name}, votre demande a bien été enregistrée. Nous vous recontactons sous 24h ouvrées pour confirmer votre créneau — aucun paiement ne vous est demandé à ce stade.
                      </p>
                      <div style={{
                        textAlign: 'left',
                        background: C.bgCard,
                        border: `1px solid ${C.primary}1a`,
                        borderRadius: 2,
                        padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5 }}>
                          <span style={{ color: C.textMuted }}>Style</span>
                          <span style={{ color: C.text, fontWeight: 700, textAlign: 'right' }}>{formData.style}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5 }}>
                          <span style={{ color: C.textMuted }}>Date souhaitée</span>
                          <span style={{ color: C.text, fontWeight: 700, textAlign: 'right' }}>
                            {formData.date
                              ? new Date(`${formData.date}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                              : '—'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5 }}>
                          <span style={{ color: C.textMuted }}>Créneau</span>
                          <span style={{ color: C.text, fontWeight: 700, textAlign: 'right' }}>{formData.time}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5 }}>
                          <span style={{ color: C.textMuted }}>Contact</span>
                          <span style={{ color: C.text, fontWeight: 700, textAlign: 'right' }}>{formData.phone || formData.email}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
                        gap: 20
                      }}>
                        <FormField
                          label="Nom Complet"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <FormField
                          label="Téléphone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <FormField
                        label="Adresse E-mail"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />

                      <FormSelect
                        label="Style de tatouage"
                        required
                        value={formData.style}
                        onChange={(e) => {
                          setFormData({ ...formData, style: e.target.value });
                          setSelectedStyle(e.target.value || null);
                        }}
                      >
                        <option value="">— Choisir un style —</option>
                        {styleOptions.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                        <option value="Autre / à discuter">Autre / à discuter en RDV</option>
                      </FormSelect>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
                        gap: 20
                      }}>
                        <FormField
                          label="Date souhaitée"
                          type="date"
                          required
                          min={todayISO}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <FormSelect
                          label="Créneau souhaité"
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        >
                          <option value="">— Choisir une heure —</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </FormSelect>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Précisions sur votre projet (facultatif)</label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '12px 16px',
                            background: C.bgCard,
                            border: `1px solid ${C.primary}1a`,
                            borderRadius: 2,
                            color: C.text,
                            fontFamily: SANS,
                            fontSize: 14,
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                      </div>

                      <p style={{ fontSize: 11.5, color: C.textMuted, margin: 0 }}>
                        * Champs obligatoires
                      </p>

                      <button
                        type="submit"
                        disabled={formLoading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          minHeight: 48,
                          padding: '14px 28px',
                          fontFamily: SANS,
                          fontSize: 11.5,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          cursor: formLoading ? 'not-allowed' : 'pointer',
                          border: `1.5px solid ${C.primary}`,
                          background: formLoading ? C.primaryLight : C.primary,
                          color: C.white,
                          borderRadius: 2,
                          opacity: formLoading ? 0.85 : 1,
                          transition: 'all 0.3s'
                        }}
                      >
                        {formLoading ? (
                          <>
                            <span style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              border: `2px solid ${C.white}66`,
                              borderTopColor: C.white,
                              animation: 'impact309-spin 0.8s linear infinite',
                              display: 'inline-block'
                            }} />
                            Envoi en cours…
                          </>
                        ) : (
                          <>
                            Prendre rendez-vous
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                      <style>{`@keyframes impact309-spin { to { transform: rotate(360deg); } }`}</style>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{
        background: C.bgDeep,
        padding: '80px 24px 40px',
        borderTop: `1px solid ${C.primary}0d`,
        fontSize: 13.5,
        color: C.textMuted
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 48,
            marginBottom: 64
          }}>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 18, color: C.primary, marginBottom: 16, fontWeight: 700 }}>{fd?.businessName ?? "Encre Délicate"}</h4>
              <p style={{ lineHeight: 1.6 }}>
                Studio tatouage fineline Bordeaux
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: C.primary, opacity: 0.7 }}><Instagram size={18} /></a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Navigation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>À Propos</a>
                <a href="#menu" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Nos Tarifs
                </a>
                <a href="#gallery" style={{ textDecoration: 'none', color: 'inherit' }}>Galerie</a>
                <a href="#faq" style={{ textDecoration: 'none', color: 'inherit' }}>FAQ</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Horaires</h5>
              <p style={{ lineHeight: 1.6 }}>
                Mar–Sam 10h–19h · Uniquement sur rendez-vous
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Légal</h5>
              <p style={{ lineHeight: 1.6, fontSize: 12 }}>
                SIRET: 894 302 596 00012<br />
                TVA Intracommunautaire: FR 89 894302596<br />
                Responsable de publication: Encre Délicate<br />
                Hébergeur: Vercel Inc.
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: 32,
            borderTop: `1px solid ${C.primary}12`,
            textAlign: 'center',
            fontSize: 11.5,
            letterSpacing: '0.05em'
          }}>
            © {new Date().getFullYear()} Encre Délicate. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
