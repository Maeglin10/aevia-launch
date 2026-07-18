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
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  ClipboardCheck,
  FileText,
  Gem,
  Globe,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react';

const Instagram = ({ size = 24, ...props }: React.ComponentProps<'svg'> & { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════════════
   PRO-NETTOYAGE SERVICES — Nettoyage professionnel de bureaux & locaux B2B.
   Cinzel, marine / or. Fichier auto-suffisant premium généré par Antigravity.
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
  primary: "#d97706",
  primaryLight: "#f59e0b",
  primaryDark: "#b45309",
  bg: "#ffffff",
  bgDeep: "#fafafa",
  bgCard: "#f5f5f5",
  text: "#0f172a",
  textMuted: "#475569",
  accent: "#0f172a",
  white: "#ffffff",
  black: "#000000",
};

const SERIF = "'Cinzel', serif" as const;
const SANS = "'Inter', sans-serif" as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1600&auto=format&fit=crop",
  special: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
  gallery4: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop",
} as const;

function Eyebrow({ children, color = C.primary, align = 'left' }: { children: React.ReactNode; color?: string; align?: 'left' | 'center' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: align === 'center' ? 'center' : 'flex-start', marginBottom: 16 }}>
      <span style={{ width: 32, height: 1.5, background: color, opacity: 0.6 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color, fontWeight: 700 }}>{children}</span>
      {align === 'center' && <span style={{ width: 32, height: 1.5, background: color, opacity: 0.6 }} />}
    </div>
  );
}

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.0, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

function Button({ children, onClick, filled = false, type = 'button' }: { children: React.ReactNode; onClick?: () => void; filled?: boolean; type?: 'button' | 'submit' }) {
  const [hover, setHover] = useState(false);
  return (
    <button type={type} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px',
        fontFamily: SANS, fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
        border: `1.5px solid ${C.primary}`, background: filled ? C.primary : 'transparent', color: filled ? C.white : C.primary,
        borderRadius: 2, transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover && filled ? `0 6px 20px ${C.primary}33` : 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      {children}
      <ArrowRight size={13} style={{ transform: hover ? 'translateX(4px)' : 'none', transition: 'transform 0.4s ease' }} />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */

let fd: any = null;
let c: any = null;
let brand: any = null;

const SERVICES = [
  { icon: <Building2 size={28} />, title: "Nettoyage de Bureaux", desc: "Entretien quotidien ou hebdomadaire de vos open-spaces, salles de réunion et espaces communs." },
  { icon: <Layers size={28} />, title: "Copropriétés", desc: "Parties communes, halls d'entrée, escaliers, locaux poubelles. Contrat sur mesure." },
  { icon: <Globe size={28} />, title: "Vitrerie Professionnelle", desc: "Nettoyage intérieur et extérieur de baies vitrées, façades, verrières de grande hauteur." },
  { icon: <ShieldCheck size={28} />, title: "Désinfection", desc: "Protocole virucide certifié EN 14476 pour bureaux, salles d'attente et espaces médicaux." },
  { icon: <Sparkles size={28} />, title: "Remise en État", desc: "Nettoyage après travaux, fin de bail, déménagement. Restitution à l'état d'origine." },
  { icon: <ClipboardCheck size={28} />, title: "Audit & Qualité", desc: "Contrôles qualité réguliers, reporting mensuel, interlocuteur dédié. Certification ISO 14001." },
];

const TESTIMONIALS = [
  { name: "Laurent P.", role: "Directeur Général, TechCorp Paris", text: "Pro-Nettoyage assure l'entretien de nos 2 000 m² de bureaux depuis 3 ans. Fiabilité exemplaire, équipes discrètes et résultats constants.", rating: 5 },
  { name: "Nathalie F.", role: "Syndic, Résidence Les Érables", text: "Les parties communes n'ont jamais été aussi propres. Les résidents sont unanimes. Le reporting mensuel est un vrai plus.", rating: 5 },
  { name: "Stéphane R.", role: "DRH, Cabinet Juridique Bordeaux", text: "Passage quotidien impeccable, équipe stable et professionnelle. Notre cabinet a un standing irréprochable grâce à leur travail.", rating: 5 },
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
      aboutText?: string; ctaText?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`).then((r) => r.json()).then(setSession).catch(() => {});
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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '8%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (formData.name && formData.email) setFormSubmitted(true); };

  useEffect(() => {
    if (c?.services) {
      [SERVICES].forEach(arr => {
        if (arr) arr.forEach((s, idx) => {
          if (idx < 3 && c.services[idx]) { s.title = c.services[idx].title ?? s.title; if ('desc' in s) s.desc = c.services[idx].description ?? s.desc; }
        });
      });
    }
    if (c?.testimonials) {
      [TESTIMONIALS].forEach(arr => {
        if (arr) arr.forEach((t, idx) => {
          if (idx < 3 && c.testimonials[idx]) { t.name = c.testimonials[idx].name ?? t.name; if ('role' in t) t.role = c.testimonials[idx].role ?? t.role; if ('text' in t) t.text = c.testimonials[idx].text ?? t.text; }
        });
      });
    }
  }, [c]);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: SANS, minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ════════ NAVBAR ════════ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.accent}0d` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#hero" style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.accent, textDecoration: 'none', letterSpacing: '0.08em', display: 'flex', alignItems: 'center' }}>
            {fd?.logoBase64 ? (
              <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
            ) : (
              <>PRO-NETTOYAGE<span style={{ color: C.primary, marginLeft: 6 }}>SERVICES</span></>
            )}
          </a>
          <div style={{ gap: 28, alignItems: 'center' }} className="hidden md:flex">
            <a href="#services" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Services</a>
            <a href="#about" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Entreprise</a>
            <a href="#avis" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Références</a>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <button style={{ background: C.accent, color: C.white, border: 'none', padding: '9px 18px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2, cursor: 'pointer' }}>
                Devis gratuit
              </button>
            </a>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: C.accent, cursor: 'pointer' }} className="md:hidden" aria-label="Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: C.bgDeep, borderBottom: `1px solid ${C.accent}0d`, overflow: 'hidden' }} className="md:hidden">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Services</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Entreprise</a>
                <a href="#avis" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Références</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{ background: C.accent, color: C.white, border: 'none', padding: '12px 24px', width: '100%', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2 }}>Devis gratuit</button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" ref={heroRef} style={{ position: 'relative', height: '100vh', minHeight: 650, display: 'flex', alignItems: 'center', background: C.accent, overflow: 'hidden', paddingTop: 80 }}>
        <motion.div style={{ position: 'absolute', inset: 0, scale: heroScale, y: heroY, opacity: heroOpacity }}>
          <img src={PHOTO.hero} alt="Bureaux professionnels modernes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 100%)' }} />
        </motion.div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <Reveal delay={0.1}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 2, padding: '6px 16px', marginBottom: 24 }}>
              <Award size={12} color={C.primary} />
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, fontWeight: 600 }}>
                ISO 14001 · Depuis 2008
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 5.5vw, 72px)', lineHeight: 1.1, fontWeight: 700, color: C.white, marginBottom: 20 }}>
              {c?.heroHeadline ?? <>L'excellence au service<br />de vos espaces professionnels</>}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 650, marginBottom: 36 }}>
              {c?.heroSubline ?? fd?.tagline ?? "Nettoyage de bureaux, copropriétés et locaux commerciaux. Équipes formées, certifiées et engagées pour un résultat irréprochable."}
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#contact" style={{ textDecoration: 'none' }}><Button filled>Demander un devis</Button></a>
              <a href="#services" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s' }}>
                  Nos prestations
                </button>
              </a>
            </div>
          </Reveal>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.6, color: '#ffffff', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <span>Défiler</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section style={{ padding: '80px 24px', background: C.bg, borderBottom: `1px solid ${C.accent}0a` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { value: "350+", label: "Clients B2B actifs" },
              { value: "1.2M", label: "m² nettoyés / mois" },
              { value: "16 ans", label: "d'expérience" },
              { value: "ISO", label: "14001 certifié" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: '16px 8px' }}>
                  <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 700, color: C.primary, marginBottom: 6 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontWeight: 600 }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 64, alignItems: 'center' }}>
            <Reveal>
              <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img src={PHOTO.about} alt="Nos équipes en action" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(transparent, rgba(15,23,42,0.9))' }}>
                  <div style={{ fontFamily: SERIF, color: C.primary, fontSize: 14, fontWeight: 700, letterSpacing: '0.1em' }}>DEPUIS 2008</div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.15}>
                <Eyebrow>Notre entreprise</Eyebrow>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.15, color: C.text, marginBottom: 24, fontWeight: 700 }}>
                  {c?.aboutTitle ?? "Un partenaire de confiance pour vos locaux"}
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, marginBottom: 20 }}>
                  {c?.aboutText ?? "Pro-Nettoyage Services accompagne les entreprises, syndics et collectivités dans l'entretien de leurs espaces. Notre engagement : des locaux impeccables, des équipes stables et un interlocuteur unique."}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, marginBottom: 36 }}>
                  Certifiés ISO 14001, nous utilisons des produits éco-responsables et des protocoles rigoureux pour garantir hygiène et durabilité.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {["Certification ISO 14001", "Contrôle qualité mensuel", "Personnel formé & déclaré", "Assurance RC Pro incluse", "Interlocuteur dédié"].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color={C.primary} />
                      <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" style={{ textDecoration: 'none' }}><Button filled>Demander un audit gratuit</Button></a>
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
              <Eyebrow align="center">Nos prestations B2B</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>
                Des solutions sur mesure pour chaque espace
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, maxWidth: 600, margin: '0 auto' }}>
                Bureaux, commerces, copropriétés ou établissements de santé — nous adaptons nos protocoles à chaque environnement.
              </p>
            </Reveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            {SERVICES.map((service, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
                  style={{ background: C.bgDeep, borderRadius: 4, padding: 32, border: `1px solid ${C.accent}0a`, height: '100%' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 4, background: `${C.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, marginBottom: 20 }}>
                    {service.icon}
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 10 }}>{service.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textMuted }}>{service.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROCESS ════════ */}
      <section style={{ padding: '120px 24px', background: C.accent }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center" color={C.primary}>Notre processus</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.white, marginBottom: 16, fontWeight: 700 }}>
                Du premier contact à l'excellence quotidienne
              </h2>
            </Reveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 32 }}>
            {[
              { step: "01", title: "Audit gratuit", desc: "Visite de vos locaux, analyse des besoins et cahier des charges personnalisé." },
              { step: "02", title: "Devis détaillé", desc: "Proposition claire, transparente et sans engagement sous 48h." },
              { step: "03", title: "Mise en place", desc: "Équipe dédiée, planning adapté à vos horaires, clés en main." },
              { step: "04", title: "Suivi qualité", desc: "Contrôles réguliers, reporting mensuel et ajustements continus." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 700, color: C.primary, marginBottom: 16 }}>{item.step}</div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ GALERIE ════════ */}
      <section id="gallery" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Réalisations</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>
                Des espaces qui inspirent confiance
              </h2>
            </Reveal>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: 16 }}>
            {[PHOTO.gallery1, PHOTO.gallery2, PHOTO.gallery3, PHOTO.gallery4].map((src, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img src={src} alt={`Réalisation ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="avis" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Références clients</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>Ce que disent nos partenaires</h2>
            </Reveal>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.bg, borderRadius: 4, padding: 32, border: `1px solid ${C.accent}0a`, height: '100%' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill={C.primary} color={C.primary} />)}
                  </div>
                  <Quote size={20} color={C.primary} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.text, marginBottom: 20, fontStyle: 'italic' }}>{t.text}</p>
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
      <section id="faq" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Reveal>
              <Eyebrow align="center">FAQ</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>Questions fréquentes</h2>
            </Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: "Quelle est la durée minimum d'engagement ?", a: "Nos contrats sont flexibles. Nous proposons des engagements de 3, 6 ou 12 mois avec des conditions avantageuses pour les contrats annuels. Un préavis de 30 jours suffit." },
              { q: "Intervenez-vous en dehors des heures de bureau ?", a: "Oui, nos équipes s'adaptent à vos horaires : interventions matinales dès 5h, en soirée après 19h ou le week-end. Aucun supplément pour les créneaux standards hors bureau." },
              { q: "Comment gérez-vous les accès et la sécurité ?", a: "Chaque agent signe une clause de confidentialité. Nous gérons les badges, clés et protocoles d'accès en coordination avec votre responsable sécurité." },
              { q: "Proposez-vous un suivi de qualité ?", a: "Absolument. Un responsable qualité effectue des contrôles mensuels. Vous recevez un rapport détaillé avec photos et scores de conformité." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ background: C.bgDeep, borderRadius: 4, border: `1px solid ${C.accent}0a`, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: C.text }}>
                    <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.text }}>{item.q}</span>
                    <ChevronDown size={18} style={{ transform: expandedFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', color: C.primary, flexShrink: 0, marginLeft: 12 }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 24px 24px', fontSize: 14, lineHeight: 1.6, color: C.textMuted }}>{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section style={{ padding: '100px 24px', background: C.accent, textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.white, marginBottom: 20, fontWeight: 700 }}>
              Prêt à transformer vos espaces ?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
              Audit gratuit de vos locaux. Devis sous 48h. Sans engagement.
            </p>
            <a href="#contact" style={{ textDecoration: 'none' }}><Button filled>Planifier mon audit gratuit</Button></a>
          </Reveal>
        </div>
      </section>

      {/* ════════ CONTACT ════════ */}
      <section id="contact" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 64 }}>
            <div>
              <Reveal>
                <Eyebrow>Contact commercial</Eyebrow>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.text, marginBottom: 24, fontWeight: 700 }}>Demandez votre devis personnalisé</h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, marginBottom: 40 }}>
                  Notre équipe commerciale vous recontacte sous 24h pour organiser un audit gratuit de vos locaux.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: <Phone size={18} />, label: "Téléphone", value: fd?.phone ?? "+33 (0)1 00 00 00 00", href: `tel:${fd?.phone ?? "+33100000000"}` },
                    { icon: <Mail size={18} />, label: "E-mail", value: fd?.email ?? "commercial@pro-nettoyage.fr", href: `mailto:${fd?.email ?? "commercial@pro-nettoyage.fr"}` },
                    { icon: <MapPin size={18} />, label: "Zone d'intervention", value: fd?.city ?? "Île-de-France & Grand Ouest" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${C.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>{item.value}</a>
                        ) : (
                          <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>{item.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.15}>
                <div style={{ background: C.bgDeep, padding: 40, borderRadius: 4, border: `1px solid ${C.accent}0a` }}>
                  {formSubmitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ color: C.primary, marginBottom: 16 }}><CheckCircle size={48} style={{ margin: '0 auto' }} /></div>
                      <h3 style={{ fontFamily: SERIF, fontSize: 22, color: C.primary, marginBottom: 8, fontWeight: 700 }}>Demande envoyée !</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Merci {formData.name}, notre équipe commerciale vous recontactera sous 24h.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {[
                        { label: "Nom & Prénom", key: "name", type: "text", required: true },
                        { label: "E-mail professionnel", key: "email", type: "email", required: true },
                        { label: "Entreprise", key: "company", type: "text", required: false },
                        { label: "Téléphone", key: "phone", type: "tel", required: false },
                      ].map((field) => (
                        <div key={field.key}>
                          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>{field.label}</label>
                          <input type={field.type} required={field.required} value={(formData as any)[field.key]}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.accent}12`, borderRadius: 2, color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none' }}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Décrivez votre besoin</label>
                        <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Surface des locaux, fréquence souhaitée, horaires d'intervention…"
                          style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.accent}12`, borderRadius: 2, color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none', resize: 'none' }}
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
      <footer style={{ background: C.accent, padding: '80px 24px 40px', borderTop: `1px solid ${C.primary}12`, fontSize: 13.5, color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 48, marginBottom: 64 }}>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 18, color: C.primary, marginBottom: 16, fontWeight: 700 }}>PRO-NETTOYAGE SERVICES</h4>
              <p style={{ lineHeight: 1.6 }}>Nettoyage professionnel B2B</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <a href={fd?.instagram ?? "https://instagram.com"} target="_blank" rel="noreferrer" style={{ color: C.primary, opacity: 0.7 }}><Instagram size={18} /></a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Navigation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</a>
                <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>Entreprise</a>
                <a href="#avis" style={{ textDecoration: 'none', color: 'inherit' }}>Références</a>
                <a href="#contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Horaires</h5>
              <p style={{ lineHeight: 1.6 }}>Interventions 5h–22h · Bureau Lun–Ven 8h30–18h</p>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Légal</h5>
              <p style={{ lineHeight: 1.6, fontSize: 12 }}>
                SIRET: 894 302 596 00012<br />
                TVA: FR 89 894302596<br />
                Responsable: Pro-Nettoyage Services<br />
                Hébergeur: Vercel Inc.
              </p>
            </div>
          </div>
          <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: 11.5, letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Pro-Nettoyage Services. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
