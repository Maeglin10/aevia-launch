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
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Utensils,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
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
   NEXUS COMPTA — Expert-comptable Toulouse — e-commerce, créateurs de contenu, auto-entrepreneurs. Raleway, indigo / corail.
   Fichier auto-suffisant premium généré par Antigravity.
   ════════════════════════════════════════════════════════════════════════════ */

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive primaryLight/primaryDark from the client's brand color.
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
  primary: "#3949ab",
  primaryLight: "#5562c4",
  primaryDark: "#283593",
  bg: "#fafbff",
  bgDeep: "#f0f2ff",
  bgCard: "#ffffff",
  text: "#0d1240",
  textMuted: "#6070a0",
  accent: "#ef6c00",
  white: "#ffffff",
  black: "#000000",
};

const SERIF = "'Raleway', sans-serif" as const;
const SANS = "'Source Sans Pro', sans-serif" as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
  special: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  gallery4: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
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

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENTS
   ════════════════════════════════════════════════════════════════════════════ */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, primary: brand, primaryLight: shadeColor(brand, 25), primaryDark: shadeColor(brand, -20) };
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '8%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const menuItemsFiltered = activeCategory === "Tous"
    ? [{"name": "Pack Création d'Entreprise", "category": "Création", "desc": "Choix du statut juridique, rédaction des statuts, dépôt au greffe.", "price": "350,00 €"}, {"name": "Tenue Comptable Mensuelle", "category": "Comptabilité", "desc": "Saisie des pièces, rapprochement bancaire, déclarations de TVA incluses.", "price": "99,00 € / mois"}, {"name": "Déclaration Fiscale Annuelle", "category": "Fiscalité", "desc": "Établissement du bilan, compte de résultat et liasse fiscale.", "price": "400,00 €"}]
    : [{"name": "Pack Création d'Entreprise", "category": "Création", "desc": "Choix du statut juridique, rédaction des statuts, dépôt au greffe.", "price": "350,00 €"}, {"name": "Tenue Comptable Mensuelle", "category": "Comptabilité", "desc": "Saisie des pièces, rapprochement bancaire, déclarations de TVA incluses.", "price": "99,00 € / mois"}, {"name": "Déclaration Fiscale Annuelle", "category": "Fiscalité", "desc": "Établissement du bilan, compte de résultat et liasse fiscale.", "price": "400,00 €"}].filter(item => item.category === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
    }
  };

  
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
              fd?.businessName ?? "Nexus Compta"
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
                Devis gratuit
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
                    Devis gratuit
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
          height: '110vh',
          minHeight: 650,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '12vh',
          background: C.bgDeep,
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
          <img 
            src={PHOTO.hero} 
            alt="Hero image showing Nexus Compta core business" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
          <Reveal delay={0.1}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 30,
              padding: '6px 16px',
              marginBottom: 24,
              backdropFilter: 'blur(8px)'
            }}>
              <Sparkles size={12} color="#ffffff" />
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 600 }}>
                Expert-comptable · Toulouse
              </span>
            </div>
          </Reveal>

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
              L'Expertise Comptable<br />des Entrepreneurs
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
              TPE, e-commerce, créateurs de contenu, auto-entrepreneurs. Comptabilité digitale 100% en ligne.
            </>}</p>
          </Reveal>

          <Reveal delay={0.55}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <Button filled>Devis gratuit</Button>
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
                  Nos services
                </button>
              </a>
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
            {menuItemsFiltered.length > 0 && [{"value": "100%", "label": "Digitalisé"}, {"value": "24h", "label": "Temps Réponse"}, {"value": "0 papier", "label": "App Mobile"}].map((stat, i) => (
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
                <Eyebrow>{fd?.businessName ?? "Nexus Compta"}</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  lineHeight: 1.15,
                  color: C.primary,
                  marginBottom: 24,
                  fontWeight: 700
                }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  La Compta Réinventée
                </>}</h2>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.textMuted,
                  marginBottom: 20
                }}>{c?.aboutText ?? <>
                  Nexus Compta accompagne les nouvelles formes d'entrepreneuriat : influenceurs, e-commerçants, freelances et micro-entrepreneurs. Dématérialisation complète, reporting mensuel clair.
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
                  <Button filled>Devis gratuit</Button>
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
              Pour les Créateurs
            </h2>
            <p style={{
              fontSize: 16,
              color: C.textMuted,
              maxWidth: 600,
              margin: '0 auto 64px',
              lineHeight: 1.6
            }}>
              Optimisation fiscale pour streamers, YouTubers, influenceurs. Statut SASU vs micro-entreprise, TVA, droits voisins.
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
                Nos Services
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
                {["Tous","Créateurs","E-Commerce","Conseil"].map((tab, i) => (
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
            {menuItemsFiltered.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{
                  paddingBottom: 24,
                  borderBottom: `1px solid ${C.primary}12`,
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
                      marginBottom: 6
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
              </Reveal>
            ))}
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
                <img src={PHOTO.gallery1} alt="Visuel galerie 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={PHOTO.gallery2} alt="Visuel galerie 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={PHOTO.gallery3} alt="Visuel galerie 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '1/1' }}>
                <img src={PHOTO.gallery4} alt="Visuel galerie 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                "Une prestation irréprochable et un souci du détail impressionnant. Les délais ont été parfaitement respectés, et la communication a toujours été fluide."
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={C.primary} color={C.primary} />)}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary }}>
                Marie Lauret · Bordeaux
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
            {[{"q":"Quels outils logiciels fournissez-vous ?","a":"Chaque forfait intègre un accès à notre application partenaire Penylane permettant de prendre en photo vos factures et de suivre votre trésorerie en temps réel."},{"q":"Comment s'effectue la transition depuis mon ancien comptable ?","a":"Nous nous occupons de tout. Nous envoyons la lettre de résiliation à votre ancien cabinet et récupérons vos historiques sans coupure."},{"q":"Puis-je vous rencontrer physiquement à Toulouse ?","a":"Absolument. Nos bureaux sont basés à Toulouse, vous pouvez y prendre rendez-vous pour des points fiscaux réguliers."}].map((item, i) => (
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
                      <a href={`mailto:${fd?.email ?? "contact@mysite.com"}`} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>{fd?.email ?? "contact@nexuscompta.com"}</a>
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
                      <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>{fd?.city ?? "Toulouse"}</div>
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
                      <h3 style={{ fontFamily: SERIF, fontSize: 22, color: C.primary, marginBottom: 8, fontWeight: 700 }}>Demande reçue !</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>
                        Merci {formData.name}, nous avons bien reçu votre message et nous vous recontacterons très rapidement.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Nom Complet</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: C.bgCard,
                            border: `1px solid ${C.primary}1a`,
                            borderRadius: 2,
                            color: C.text,
                            fontFamily: SANS,
                            fontSize: 14,
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Adresse E-mail</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: C.bgCard,
                            border: `1px solid ${C.primary}1a`,
                            borderRadius: 2,
                            color: C.text,
                            fontFamily: SANS,
                            fontSize: 14,
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Votre Message</label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          style={{
                            width: '100%',
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
                      <Button type="submit" filled>Devis gratuit</Button>
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
              <h4 style={{ fontFamily: SERIF, fontSize: 18, color: C.primary, marginBottom: 16, fontWeight: 700 }}>{fd?.businessName ?? "Nexus Compta"}</h4>
              <p style={{ lineHeight: 1.6 }}>
                Expert-comptable Toulouse
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
                Lun–Ven 9h–18h30 · Réponse sous 24h
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Légal</h5>
              <p style={{ lineHeight: 1.6, fontSize: 12 }}>
                SIRET: 894 302 596 00012<br />
                TVA Intracommunautaire: FR 89 894302596<br />
                Responsable de publication: Nexus Compta<br />
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
            © {new Date().getFullYear()} Nexus Compta. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
