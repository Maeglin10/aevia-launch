"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Droplets,
  Heart,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Repeat,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
  Wind,
  X,
  Zap
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
   BRISE DE PROPRETÉ — Ménage à domicile, repassage, vitres. Quicksand, mint / blanc.
   Fichier auto-suffisant premium généré par Antigravity.
   ════════════════════════════════════════════════════════════════════════════ */

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
  primary: "#10b981",
  primaryLight: "#34d399",
  primaryDark: "#059669",
  bg: "#ffffff",
  bgDeep: "#f0fdf4",
  bgCard: "#f8faf9",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#06b6d4",
  white: "#ffffff",
  black: "#000000",
};

const SERIF = "'Quicksand', sans-serif" as const;
const SANS = "'Inter', sans-serif" as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop",
  special: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1600&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
  gallery4: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop",
} as const;

/* ── Primitives Réutilisables ─────────────────────────────────────────────── */

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
      marginBottom: 16,
    }}>
      <span style={{ width: 32, height: 1.5, background: color, opacity: 0.6 }} />
      <span style={{
        fontFamily: SANS,
        fontSize: 10.5,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color,
        fontWeight: 700,
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
        color: filled ? C.white : C.primary,
        borderRadius: 30,
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover && filled ? `0 6px 20px ${C.primary}33` : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
      <ArrowRight size={13} style={{
        transform: hover ? 'translateX(4px)' : 'none',
        transition: 'transform 0.4s ease',
      }} />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

let fd: any = null;
let c: any = null;
let brand: any = null;

const SERVICES = [
  { icon: <Home size={28} />, title: "Ménage Régulier", desc: "Entretien hebdomadaire ou bi-mensuel de votre intérieur. Cuisine, salons, chambres, sanitaires — tout brille." },
  { icon: <Sparkles size={28} />, title: "Grand Nettoyage", desc: "Nettoyage en profondeur ponctuel : déménagement, fin de chantier, nettoyage de printemps." },
  { icon: <Wind size={28} />, title: "Vitres & Surfaces", desc: "Lavage intérieur et extérieur de vos vitres, baies vitrées, miroirs et surfaces vitrées." },
  { icon: <Repeat size={28} />, title: "Repassage à Domicile", desc: "Collecte, repassage soigné et livraison de votre linge. Service sur abonnement disponible." },
  { icon: <Droplets size={28} />, title: "Nettoyage Canapés", desc: "Injection-extraction professionnelle pour canapés, matelas, tapis et moquettes." },
  { icon: <Leaf size={28} />, title: "Formule Éco", desc: "Produits 100% bio-dégradables et éco-certifiés. Respect de votre intérieur et de l'environnement." },
];

const TESTIMONIALS = [
  { name: "Sophie L.", role: "Paris 15e", text: "Un service impeccable ! L'intervenante est ponctuelle, soigneuse et très professionnelle. Mon appartement n'a jamais été aussi propre.", rating: 5 },
  { name: "Marc D.", role: "Boulogne-Billancourt", text: "Abonnement ménage bi-mensuel depuis 6 mois. Fiabilité totale, qualité constante. Je recommande sans hésiter.", rating: 5 },
  { name: "Émilie R.", role: "Neuilly-sur-Seine", text: "Grand nettoyage après travaux : résultat bluffant. L'équipe a redonné vie à tout l'appartement en une journée.", rating: 5 },
];

const PLANS = [
  { name: "Essentiel", price: "49", unit: "/passage", features: ["2h de ménage", "Cuisine & sanitaires", "Aspiration & lavage sols", "Produits fournis"], popular: false },
  { name: "Confort", price: "89", unit: "/passage", features: ["3h30 de ménage", "Toutes pièces", "Repassage inclus (10 pièces)", "Vitres intérieures", "Produits éco fournis"], popular: true },
  { name: "Premium", price: "149", unit: "/passage", features: ["5h de ménage complet", "Toutes pièces + rangement", "Repassage illimité", "Vitres int. & ext.", "Nettoyage frigo/four", "Intervenante attitrée"], popular: false },
];

export default function Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
      logoBase64?: string;
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
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, primary: brand, primaryLight: shadeColor(brand, 25), primaryDark: shadeColor(brand, -20) };
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
    }
  };

  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
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
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
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
      overflowX: 'hidden',
    }}>

      {/* ════════ NAVBAR ════════ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.primary}12`,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <a href="#hero" style={{
            fontFamily: SERIF,
            fontSize: 22,
            fontWeight: 700,
            color: C.primary,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <><Leaf size={22} /> Brise de Propreté</>
            )}
          </a>

          <div style={{ gap: 28, alignItems: 'center' }} className="hidden md:flex">
            <a href="#services" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Services</a>
            <a href="#formules" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Formules</a>
            <a href="#avis" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Avis</a>
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
                borderRadius: 30,
                cursor: 'pointer',
              }}>
                Réserver
              </button>
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: C.primary, cursor: 'pointer' }}
            className="md:hidden"
            aria-label="Menu mobile"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: C.bgDeep, borderBottom: `1px solid ${C.primary}12`, overflow: 'hidden' }}
              className="md:hidden"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Services</a>
                <a href="#formules" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Formules</a>
                <a href="#avis" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Avis</a>
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
                    borderRadius: 30,
                  }}>
                    Réserver
                  </button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════ HERO ════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: C.bgDeep,
          overflow: 'hidden',
          paddingTop: 80,
        }}
      >
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          scale: heroScale,
          y: heroY,
          opacity: heroOpacity,
        }}>
          <img
            src={PHOTO.hero}
            alt="Intérieur propre et lumineux"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(240,253,244,0.92) 0%, rgba(255,255,255,0.80) 100%)',
          }} />
        </motion.div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}>
          <Reveal delay={0.1}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: `${C.primary}14`,
              border: `1px solid ${C.primary}30`,
              borderRadius: 30,
              padding: '6px 16px',
              marginBottom: 24,
            }}>
              <Sparkles size={12} color={C.primary} />
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, fontWeight: 600 }}>
                Ménage · Repassage · Vitres
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 6vw, 72px)',
              lineHeight: 1.1,
              fontWeight: 700,
              color: C.text,
              marginBottom: 20,
            }}>{c?.heroHeadline ?? <>
              Un intérieur{'\u00A0'}impeccable,<br />sans lever le petit doigt
            </>}</h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 19px)',
              lineHeight: 1.6,
              color: C.textMuted,
              maxWidth: 600,
              margin: '0 auto 36px',
            }}>{c?.heroSubline ?? fd?.tagline ?? <>
              Service de ménage à domicile professionnel. Personnel formé, assuré et vérifié. Réservation en ligne en 2 minutes.
            </>}</p>
          </Reveal>

          <Reveal delay={0.55}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <Button filled>Réserver mon ménage</Button>
              </a>
              <a href="#formules" style={{ textDecoration: 'none' }}>
                <Button>Voir les formules</Button>
              </a>
            </div>
          </Reveal>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.5,
          color: C.textMuted,
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          <span>Défiler</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ════════ CONFIANCE / STATS ════════ */}
      <section style={{ padding: '80px 24px', background: C.bg, borderBottom: `1px solid ${C.primary}0a` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 40,
            textAlign: 'center',
          }}>
            {[
              { value: "4 200+", label: "Ménages réalisés", icon: <Home size={24} /> },
              { value: "98%", label: "Clients satisfaits", icon: <ThumbsUp size={24} /> },
              { value: "100%", label: "Personnel déclaré", icon: <Shield size={24} /> },
              { value: "2 min", label: "Réservation en ligne", icon: <Zap size={24} /> },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: '16px 8px' }}>
                  <div style={{ color: C.primary, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.primary,
                    marginBottom: 6,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: C.textMuted,
                    fontWeight: 600,
                  }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64,
            alignItems: 'center',
          }}>
            <Reveal>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img
                  src={PHOTO.about}
                  alt="Notre équipe de ménage professionnelle"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.15}>
                <Eyebrow>Notre engagement</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  lineHeight: 1.15,
                  color: C.text,
                  marginBottom: 24,
                  fontWeight: 700,
                }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  La propreté, c'est notre métier
                </>}</h2>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.textMuted,
                  marginBottom: 20,
                }}>{c?.aboutText ?? <>
                  Brise de Propreté intervient chez les particuliers pour un ménage régulier, un grand nettoyage ou du repassage à domicile. Chaque intervenant·e est formé·e, déclaré·e et assuré·e. Votre satisfaction est notre priorité absolue.
                </>}</p>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: C.textMuted,
                  marginBottom: 36,
                }}>
                  Produits fournis, matériel professionnel, et une qualité constante à chaque passage. Nous traitons votre intérieur comme le nôtre.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {["Personnel vérifié & formé", "Assurance dommages incluse", "Satisfaction garantie ou re-nettoyage", "Produits éco-certifiés disponibles"].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color={C.primary} />
                      <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>

                <a href="#contact" style={{ textDecoration: 'none' }}>
                  <Button filled>Demander un devis</Button>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <section id="services" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Nos prestations</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: C.text,
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Un service complet pour votre intérieur
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, maxWidth: 600, margin: '0 auto' }}>
                Du ménage hebdomadaire au grand nettoyage ponctuel, nos intervenant·es prennent soin de chaque détail.
              </p>
            </Reveal>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 24,
          }}>
            {SERVICES.map((service, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${C.primary}12` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: C.bgDeep,
                    borderRadius: 16,
                    padding: 32,
                    border: `1px solid ${C.primary}12`,
                    height: '100%',
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${C.primary}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.primary,
                    marginBottom: 20,
                  }}>
                    {service.icon}
                  </div>
                  <h3 style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 10,
                  }}>
                    {service.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: C.textMuted,
                  }}>
                    {service.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FORMULES / PRICING ════════ */}
      <section id="formules" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Nos formules</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: C.text,
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Choisissez la formule qui vous convient
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, maxWidth: 550, margin: '0 auto' }}>
                Tarifs transparents, sans engagement. Payez en ligne et planifiez votre ménage en toute simplicité.
              </p>
            </Reveal>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}>
            {PLANS.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: plan.popular ? C.primary : C.bg,
                    borderRadius: 20,
                    padding: 36,
                    border: plan.popular ? 'none' : `1px solid ${C.primary}18`,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      right: -28,
                      background: C.primaryDark,
                      color: C.white,
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '4px 36px',
                      transform: 'rotate(45deg)',
                    }}>
                      Populaire
                    </div>
                  )}
                  <h3 style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    fontWeight: 700,
                    color: plan.popular ? C.white : C.text,
                    marginBottom: 8,
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <span style={{
                      fontFamily: SERIF,
                      fontSize: 42,
                      fontWeight: 700,
                      color: plan.popular ? C.white : C.primary,
                    }}>
                      {plan.price}€
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: plan.popular ? 'rgba(255,255,255,0.7)' : C.textMuted,
                    }}>
                      {plan.unit}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 28 }}>
                    {plan.features.map((feat, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Check size={14} color={plan.popular ? C.white : C.primary} />
                        <span style={{
                          fontSize: 13.5,
                          color: plan.popular ? 'rgba(255,255,255,0.9)' : C.textMuted,
                        }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '14px 24px',
                      background: plan.popular ? C.white : C.primary,
                      color: plan.popular ? C.primary : C.white,
                      border: 'none',
                      borderRadius: 30,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                    }}>
                      Choisir cette formule
                    </button>
                  </a>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ POURQUOI NOUS ════════ */}
      <section style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64,
            alignItems: 'center',
          }}>
            <div>
              <Reveal>
                <Eyebrow>Pourquoi nous choisir</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  color: C.text,
                  marginBottom: 32,
                  fontWeight: 700,
                }}>
                  La tranquillité d'esprit, en plus de la propreté
                </h2>

                {[
                  { icon: <Shield size={22} />, title: "Assurance complète", desc: "Chaque intervention est couverte par notre assurance responsabilité civile professionnelle." },
                  { icon: <Users size={22} />, title: "Intervenants attitrés", desc: "Vous gardez la même personne de confiance à chaque passage, pour une relation durable." },
                  { icon: <Award size={22} />, title: "Garantie satisfaction", desc: "Si le ménage ne vous convient pas, nous revenons gratuitement sous 24h." },
                  { icon: <Clock size={22} />, title: "Flexibilité totale", desc: "Modifiez ou annulez votre rendez-vous jusqu'à 24h avant, sans frais." },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: `${C.primary}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: C.primary,
                        flexShrink: 0,
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.title}</h4>
                        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.textMuted }}>{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img
                  src={PHOTO.special}
                  alt="Intérieur propre et lumineux après notre passage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ GALERIE ════════ */}
      <section id="gallery" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Nos réalisations</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: C.text,
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Avant / Après : la différence Brise
              </h2>
            </Reveal>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: 16,
          }}>
            {[PHOTO.gallery1, PHOTO.gallery2, PHOTO.gallery3, PHOTO.gallery4].map((src, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}
                >
                  <img src={src} alt={`Réalisation ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="avis" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Avis clients</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: C.text,
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Ils nous font confiance
              </h2>
            </Reveal>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 24,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: C.bgDeep,
                  borderRadius: 16,
                  padding: 32,
                  border: `1px solid ${C.primary}12`,
                  height: '100%',
                }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} fill={C.primary} color={C.primary} />
                    ))}
                  </div>
                  <Quote size={20} color={C.primary} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    color: C.text,
                    marginBottom: 20,
                    fontStyle: 'italic',
                  }}>
                    {t.text}
                  </p>
                  <div>
                    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 14, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section id="faq" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Reveal>
              <Eyebrow align="center">FAQ</Eyebrow>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: C.text,
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Questions fréquentes
              </h2>
            </Reveal>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: "Fournissez-vous les produits et le matériel ?", a: "Oui, nous apportons tout le nécessaire : aspirateur professionnel, serpillières microfibres, produits ménagers de qualité. Vous n'avez rien à prévoir." },
              { q: "Puis-je demander la même intervenante à chaque fois ?", a: "Absolument. Dès la deuxième intervention, nous vous attribuons une intervenante attitrée qui connaît vos préférences et vos habitudes." },
              { q: "Que se passe-t-il si je ne suis pas satisfait·e ?", a: "Notre garantie satisfaction vous couvre : nous revenons gratuitement sous 48h pour refaire les zones qui ne vous conviennent pas." },
              { q: "Comment fonctionne l'abonnement ?", a: "Choisissez votre fréquence (hebdomadaire, bi-mensuel, mensuel) et votre formule. Le prélèvement est automatique, sans engagement. Vous pouvez annuler à tout moment." },
              { q: "Intervenez-vous le week-end ?", a: "Oui, nous proposons des créneaux le samedi matin (8h–13h) avec un supplément de 10€ par intervention. Dimanche sur devis." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{
                  background: C.bg,
                  borderRadius: 12,
                  border: `1px solid ${C.primary}12`,
                  overflow: 'hidden',
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
                      color: C.text,
                    }}
                  >
                    <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.text }}>{item.q}</span>
                    <ChevronDown size={18} style={{
                      transform: expandedFaq === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease',
                      color: C.primary,
                      flexShrink: 0,
                      marginLeft: 12,
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
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: C.textMuted,
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

      {/* ════════ CONTACT ════════ */}
      <section id="contact" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64,
          }}>
            <div>
              <Reveal>
                <Eyebrow>Réservation</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  color: C.text,
                  marginBottom: 24,
                  fontWeight: 700,
                }}>
                  Réservez votre ménage
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, marginBottom: 40 }}>
                  Remplissez le formulaire et nous vous recontacterons sous 2h avec un créneau disponible. Devis gratuit et sans engagement.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: `${C.primary}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0,
                    }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>Téléphone</div>
                      <a href={`tel:${fd?.phone ?? "+33100000000"}`} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>{fd?.phone ?? "+33 (0)1 00 00 00 00"}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: `${C.primary}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0,
                    }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>E-mail</div>
                      <a href={`mailto:${fd?.email ?? "contact@mysite.com"}`} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>{fd?.email ?? "contact@brisedeproprete.fr"}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: `${C.primary}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0,
                    }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>Zone d'intervention</div>
                      <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>{fd?.city ?? "Paris & Île-de-France"}</div>
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
                  borderRadius: 20,
                  border: `1px solid ${C.primary}12`,
                }}>
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '24px 0' }}
                    >
                      <div style={{ color: C.primary, marginBottom: 16 }}><CheckCircle size={48} style={{ margin: '0 auto' }} /></div>
                      <h3 style={{ fontFamily: SERIF, fontSize: 22, color: C.primary, marginBottom: 8, fontWeight: 700 }}>Demande envoyée !</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>
                        Merci {formData.name}, nous vous recontacterons très rapidement avec un créneau.
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
                            width: '100%', padding: '12px 16px', background: C.bg,
                            border: `1px solid ${C.primary}1a`, borderRadius: 10,
                            color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>E-mail</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%', padding: '12px 16px', background: C.bg,
                            border: `1px solid ${C.primary}1a`, borderRadius: 10,
                            color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Téléphone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            width: '100%', padding: '12px 16px', background: C.bg,
                            border: `1px solid ${C.primary}1a`, borderRadius: 10,
                            color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Votre besoin</label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Ex : Ménage 3h chaque mardi, appartement 70m²…"
                          style={{
                            width: '100%', padding: '12px 16px', background: C.bg,
                            border: `1px solid ${C.primary}1a`, borderRadius: 10,
                            color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none', resize: 'none',
                          }}
                        />
                      </div>
                      <Button type="submit" filled>Envoyer ma demande</Button>
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
        background: '#f0fdf4',
        padding: '80px 24px 40px',
        borderTop: `1px solid ${C.primary}12`,
        fontSize: 13.5,
        color: C.textMuted,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 48,
            marginBottom: 64,
          }}>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 18, color: C.primary, marginBottom: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Leaf size={18} /> Brise de Propreté
              </h4>
              <p style={{ lineHeight: 1.6 }}>
                Ménage professionnel à domicile
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <a href={fd?.instagram ?? "https://instagram.com"} target="_blank" rel="noreferrer" style={{ color: C.primary, opacity: 0.7 }}><Instagram size={18} /></a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Navigation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</a>
                <a href="#formules" style={{ textDecoration: 'none', color: 'inherit' }}>Formules</a>
                <a href="#avis" style={{ textDecoration: 'none', color: 'inherit' }}>Avis clients</a>
                <a href="#contact" style={{ textDecoration: 'none', color: 'inherit' }}>Réservation</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Horaires</h5>
              <p style={{ lineHeight: 1.6 }}>
                Lun–Ven 7h–20h · Sam 8h–13h
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Légal</h5>
              <p style={{ lineHeight: 1.6, fontSize: 12 }}>
                SIRET: 894 302 596 00012<br />
                TVA Intracommunautaire: FR 89 894302596<br />
                Responsable: Brise de Propreté<br />
                Hébergeur: Vercel Inc.
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: 32,
            borderTop: `1px solid ${C.primary}12`,
            textAlign: 'center',
            fontSize: 11.5,
            letterSpacing: '0.05em',
          }}>
            © {new Date().getFullYear()} Brise de Propreté. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
