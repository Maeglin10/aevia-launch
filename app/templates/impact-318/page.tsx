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
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle,
  ChevronDown,
  Clock,
  Droplets,
  FileText,
  Flame,
  HardHat,
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
  Thermometer,
  TrendingUp,
  Users,
  Wind,
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
   NETTOYAGE EXTRÊME — Nettoyage après sinistre, fin de chantier, désinfection.
   Exo 2, ardoise / orange chantier. Fichier auto-suffisant premium généré par Antigravity.
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
  primary: "#f97316",
  primaryLight: "#fb923c",
  primaryDark: "#ea580c",
  bg: "#0f172a",
  bgDeep: "#0a1120",
  bgCard: "#1e293b",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  accent: "#3b82f6",
  white: "#ffffff",
  black: "#000000",
};

const SERIF = "'Exo 2', sans-serif" as const;
const SANS = "'Roboto', sans-serif" as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
  special: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=1600&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
  gallery4: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
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
        border: `1.5px solid ${C.primary}`, background: filled ? C.primary : 'transparent', color: filled ? C.black : C.primary,
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
  { icon: <HardHat size={28} />, title: "Fin de Chantier", desc: "Nettoyage complet après travaux de construction ou rénovation. Poussière, gravats, résidus de peinture, joints." },
  { icon: <Droplets size={28} />, title: "Dégât des Eaux", desc: "Assèchement, extraction d'eau, nettoyage et remise en état après inondation ou fuite majeure." },
  { icon: <Flame size={28} />, title: "Après Incendie", desc: "Décontamination, élimination de la suie, traitement anti-odeurs, nettoyage structurel complet." },
  { icon: <Thermometer size={28} />, title: "Désinfection", desc: "Protocole virucide/bactéricide certifié EN 14476. Locaux professionnels, médicaux, alimentaires." },
  { icon: <Wind size={28} />, title: "Nettoyage Industriel", desc: "Entretien d'usines, entrepôts, parkings, zones de production. Haute pression, autolaveuse." },
  { icon: <Shield size={28} />, title: "Débarras & Curage", desc: "Vidage complet de locaux, caves, greniers, appartements. Tri, recyclage et évacuation en déchetterie." },
];

const TESTIMONIALS = [
  { name: "Guillaume M.", role: "Chef de chantier, BTP Provence", text: "Après un chantier de 6 mois, l'équipe a livré un immeuble impeccable en 48h. Rapport qualité-prix imbattable. Partenariat reconduit.", rating: 5 },
  { name: "Isabelle K.", role: "Expert d'assurance, AXA", text: "Intervention rapide et professionnelle après un dégât des eaux. Le rapport d'intervention détaillé facilite le traitement du sinistre.", rating: 5 },
  { name: "Romain T.", role: "Directeur usine, Agroalimentaire", text: "Désinfection mensuelle de nos locaux de production. Protocole rigoureux, traçabilité parfaite, aucune non-conformité depuis 2 ans.", rating: 5 },
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
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, primary: brand, primaryLight: shadeColor(brand, 25), primaryDark: shadeColor(brand, -20) };
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '8%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (formData.name && formData.email) setFormSubmitted(true); };

  useEffect(() => {
    if (c?.services) { [SERVICES].forEach(arr => { if (arr) arr.forEach((s, idx) => { if (idx < 3 && c.services[idx]) { s.title = c.services[idx].title ?? s.title; if ('desc' in s) s.desc = c.services[idx].description ?? s.desc; } }); }); }
    if (c?.testimonials) { [TESTIMONIALS].forEach(arr => { if (arr) arr.forEach((t, idx) => { if (idx < 3 && c.testimonials[idx]) { t.name = c.testimonials[idx].name ?? t.name; if ('role' in t) t.role = c.testimonials[idx].role ?? t.role; if ('text' in t) t.text = c.testimonials[idx].text ?? t.text; } }); }); }
  }, [c]);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: SANS, minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ════════ NAVBAR ════════ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(10,17,32,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.primary}12` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#hero" style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.primary, textDecoration: 'none', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
            {fd?.logoBase64 ? (
              <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
            ) : (
              <><AlertTriangle size={20} /> NETTOYAGE EXTRÊME</>
            )}
          </a>
          <div style={{ gap: 28, alignItems: 'center' }} className="hidden md:flex">
            <a href="#services" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Interventions</a>
            <a href="#process" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Protocole</a>
            <a href="#avis" style={{ textDecoration: 'none', color: C.text, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Avis</a>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <button style={{ background: C.primary, color: C.black, border: 'none', padding: '9px 18px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2, cursor: 'pointer' }}>
                Urgence 24h
              </button>
            </a>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: C.primary, cursor: 'pointer' }} className="md:hidden" aria-label="Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: C.bgDeep, borderBottom: `1px solid ${C.primary}12`, overflow: 'hidden' }} className="md:hidden">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Interventions</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Protocole</a>
                <a href="#avis" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: C.text, fontSize: 14, textTransform: 'uppercase', fontWeight: 600 }}>Avis</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{ background: C.primary, color: C.black, border: 'none', padding: '12px 24px', width: '100%', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2 }}>Urgence 24h</button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" ref={heroRef} style={{ position: 'relative', height: '110vh', minHeight: 650, display: 'flex', alignItems: 'flex-end', paddingBottom: '12vh', background: C.bgDeep, overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, scale: heroScale, y: heroY, opacity: heroOpacity }}>
          <img src={PHOTO.hero} alt="Chantier de nettoyage extrême" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.85) 100%)' }} />
        </motion.div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <Reveal delay={0.1}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${C.primary}18`, border: `1px solid ${C.primary}40`, borderRadius: 2, padding: '6px 16px', marginBottom: 24 }}>
              <AlertTriangle size={12} color={C.primary} />
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, fontWeight: 700 }}>
                Sinistres · Chantiers · Industrie
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 6vw, 78px)', lineHeight: 1.08, fontWeight: 700, color: C.white, marginBottom: 20, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {c?.heroHeadline ?? <>Nettoyage extrême<br />après sinistre & chantier</>}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 650, margin: '0 auto 36px' }}>
              {c?.heroSubline ?? fd?.tagline ?? "Intervention rapide 24h/24. Dégât des eaux, incendie, fin de chantier, décontamination. Équipement professionnel et protocoles certifiés."}
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ textDecoration: 'none' }}><Button filled>Appel urgence 24h</Button></a>
              <a href="#services" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, borderRadius: 2, cursor: 'pointer' }}>
                  Nos interventions
                </button>
              </a>
            </div>
          </Reveal>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.6, color: C.white, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <span>Défiler</span><ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section style={{ padding: '80px 24px', background: C.bgDeep, borderBottom: `1px solid ${C.primary}0d` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { value: "< 2h", label: "Délai d'intervention" },
              { value: "24/7", label: "Disponibilité urgence" },
              { value: "1 500+", label: "Sinistres traités" },
              { value: "100%", label: "Taux de restitution" },
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

      {/* ════════ SERVICES ════════ */}
      <section id="services" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Types d'interventions</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>
                Chaque situation exige un protocole adapté
              </h2>
            </Reveal>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            {SERVICES.map((service, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, borderColor: C.primary }} transition={{ duration: 0.3 }}
                  style={{ background: C.bgCard, borderRadius: 4, padding: 32, border: `1px solid ${C.primary}0d`, height: '100%', transition: 'border-color 0.3s' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 4, background: `${C.primary}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, marginBottom: 20 }}>
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

      {/* ════════ PROTOCOLE / PROCESS ════════ */}
      <section id="process" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Protocole d'intervention</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>
                4 étapes pour une restitution parfaite
              </h2>
            </Reveal>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 32 }}>
            {[
              { step: "01", title: "Diagnostic terrain", desc: "Évaluation sur site en moins de 2h. Identification des risques, périmètre d'intervention, devis immédiat.", icon: <Target size={24} /> },
              { step: "02", title: "Sécurisation", desc: "Mise en sécurité de la zone, balisage, extraction des matériaux dangereux et ventilation forcée.", icon: <ShieldCheck size={24} /> },
              { step: "03", title: "Nettoyage technique", desc: "Équipement haute pression, extracteurs, produits professionnels certifiés. Traitement surface par surface.", icon: <Sparkles size={24} /> },
              { step: "04", title: "Contrôle & rapport", desc: "Inspection finale, photos avant/après, rapport d'intervention détaillé pour votre assurance.", icon: <FileText size={24} /> },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div style={{ background: C.bgCard, borderRadius: 4, padding: 32, border: `1px solid ${C.primary}0d`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, right: 16, fontFamily: SERIF, fontSize: 64, fontWeight: 700, color: `${C.primary}0a`, lineHeight: 1 }}>{item.step}</div>
                  <div style={{ color: C.primary, marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.textMuted }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" style={{ padding: '120px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 64, alignItems: 'center' }}>
            <Reveal>
              <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img src={PHOTO.about} alt="Équipe d'intervention Nettoyage Extrême" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.15}>
                <Eyebrow>L'entreprise</Eyebrow>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.15, color: C.text, marginBottom: 24, fontWeight: 700 }}>
                  {c?.aboutTitle ?? "Spécialistes des situations critiques"}
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, marginBottom: 20 }}>
                  {c?.aboutText ?? "Nettoyage Extrême intervient dans les situations où le nettoyage classique ne suffit plus. Après un sinistre, un incendie ou un chantier, nos équipes formées aux protocoles de décontamination restaurent vos locaux à l'état d'origine."}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {["Intervention < 2h en zone urbaine", "Matériel professionnel haute capacité", "Rapport d'intervention pour assurances", "Protocoles EN 14476 certifiés", "Équipes formées risques chimiques"].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color={C.primary} />
                      <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" style={{ textDecoration: 'none' }}><Button filled>Demander une intervention</Button></a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="avis" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <Eyebrow align="center">Retours terrain</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>Ce que disent nos clients</h2>
            </Reveal>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: C.bgCard, borderRadius: 4, padding: 32, border: `1px solid ${C.primary}0d`, height: '100%' }}>
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
              <Eyebrow align="center">FAQ technique</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.text, marginBottom: 16, fontWeight: 700 }}>Questions fréquentes</h2>
            </Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: "Quel est votre délai d'intervention en urgence ?", a: "Nous sommes sur site en moins de 2 heures en zone urbaine, et sous 4 heures en zone rurale. Disponibilité 24h/24, 7j/7, week-ends et jours fériés compris." },
              { q: "Travaillez-vous directement avec les assurances ?", a: "Oui. Notre rapport d'intervention détaillé (photos avant/après, protocole suivi, produits utilisés) est conçu pour faciliter vos démarches auprès de votre assurance habitation ou multirisque." },
              { q: "Quels types de produits utilisez-vous ?", a: "Nous utilisons des produits professionnels certifiés (EN 14476 pour les virucides, EN 1276 pour les bactéricides). Pour les interventions en milieu alimentaire, nous employons des produits agréés contact alimentaire." },
              { q: "Intervenez-vous pour les particuliers ?", a: "Oui. Nous intervenons aussi bien pour les professionnels (BTP, industrie, syndics) que pour les particuliers (dégât des eaux à domicile, nettoyage après travaux de rénovation)." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ background: C.bgCard, borderRadius: 4, border: `1px solid ${C.primary}0d`, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: C.text }}>
                    <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.primary }}>{item.q}</span>
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

      {/* ════════ CONTACT ════════ */}
      <section id="contact" style={{ padding: '120px 24px', background: C.bgDeep }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 64 }}>
            <div>
              <Reveal>
                <Eyebrow>Urgence & Devis</Eyebrow>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', color: C.text, marginBottom: 24, fontWeight: 700 }}>Intervention rapide</h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textMuted, marginBottom: 40 }}>
                  Sinistre en cours ? Appelez-nous directement. Pour un devis planifié, remplissez le formulaire ci-contre.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: <Phone size={18} />, label: "Urgence 24h/24", value: fd?.phone ?? "+33 (0)1 00 00 00 00", href: `tel:${fd?.phone ?? "+33100000000"}` },
                    { icon: <Mail size={18} />, label: "E-mail", value: fd?.email ?? "urgence@nettoyage-extreme.fr", href: `mailto:${fd?.email ?? "urgence@nettoyage-extreme.fr"}` },
                    { icon: <MapPin size={18} />, label: "Zone d'intervention", value: fd?.city ?? "France métropolitaine" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${C.primary}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted }}>{item.label}</div>
                        {item.href ? <a href={item.href} style={{ fontSize: 15, color: C.text, fontWeight: 700, textDecoration: 'none' }}>{item.value}</a> : <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>{item.value}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.15}>
                <div style={{ background: C.bgCard, padding: 40, borderRadius: 4, border: `1px solid ${C.primary}0d` }}>
                  {formSubmitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ color: C.primary, marginBottom: 16 }}><CheckCircle size={48} style={{ margin: '0 auto' }} /></div>
                      <h3 style={{ fontFamily: SERIF, fontSize: 22, color: C.primary, marginBottom: 8, fontWeight: 700 }}>Demande reçue !</h3>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Merci {formData.name}, un technicien vous recontactera dans les plus brefs délais.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {[
                        { label: "Nom complet", key: "name", type: "text" },
                        { label: "E-mail", key: "email", type: "email" },
                        { label: "Téléphone", key: "phone", type: "tel" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>{field.label}</label>
                          <input type={field.type} required={field.key !== 'phone'} value={(formData as any)[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.primary}1a`, borderRadius: 2, color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none' }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Description du sinistre / besoin</label>
                        <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Type de sinistre, surface, urgence…"
                          style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.primary}1a`, borderRadius: 2, color: C.text, fontFamily: SANS, fontSize: 14, outline: 'none', resize: 'none' }} />
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
      <footer style={{ background: C.bgDeep, padding: '80px 24px 40px', borderTop: `1px solid ${C.primary}0d`, fontSize: 13.5, color: C.textMuted }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 48, marginBottom: 64 }}>
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: 18, color: C.primary, marginBottom: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} /> Nettoyage Extrême
              </h4>
              <p style={{ lineHeight: 1.6 }}>Spécialistes sinistres & chantiers</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <a href={fd?.instagram ?? "https://instagram.com"} target="_blank" rel="noreferrer" style={{ color: C.primary, opacity: 0.7 }}><Instagram size={18} /></a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Navigation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Interventions</a>
                <a href="#process" style={{ textDecoration: 'none', color: 'inherit' }}>Protocole</a>
                <a href="#avis" style={{ textDecoration: 'none', color: 'inherit' }}>Avis</a>
                <a href="#contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Disponibilité</h5>
              <p style={{ lineHeight: 1.6 }}>Urgences 24h/24 · 7j/7<br />Bureau Lun–Ven 8h–18h</p>
            </div>
            <div>
              <h5 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: 16, fontWeight: 700 }}>Légal</h5>
              <p style={{ lineHeight: 1.6, fontSize: 12 }}>
                SIRET: 894 302 596 00012<br />
                TVA: FR 89 894302596<br />
                Responsable: Nettoyage Extrême<br />
                Hébergeur: Vercel Inc.
              </p>
            </div>
          </div>
          <div style={{ paddingTop: 32, borderTop: `1px solid ${C.primary}12`, textAlign: 'center', fontSize: 11.5, letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Nettoyage Extrême. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
