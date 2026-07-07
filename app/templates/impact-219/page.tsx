"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Workflow,
  Users,
  Globe,
  Check,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Star,
  Sparkles,
} from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   NovaSaaS — Clean, light SaaS landing page (violet/indigo)
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#ffffff',
  bgSoft: '#f7f7fc',
  bgViolet: '#f3f0ff',
  card: '#ffffff',
  border: '#e8e6f2',
  borderStrong: '#d8d4ec',
  primary: brand ?? '#6d4aff',
  primaryDark: '#5a37e0',
  primaryLight: '#8b6dff',
  indigo: '#4338ca',
  ink: '#15131f',
  inkSoft: '#4a4660',
  muted: '#807c96',
  faint: '#b4b1c6',
  green: '#16a34a',
  font: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.ink,
  fontFamily: C.font,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const pad: React.CSSProperties = { paddingInline: 'clamp(20px, 6vw, 96px)' };
const maxw: React.CSSProperties = { maxWidth: 1180, marginInline: 'auto' };

const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  fontSize: 13,
  fontWeight: 600,
  color: C.primary,
  background: C.bgViolet,
  border: `1px solid ${C.border}`,
  padding: '6px 14px',
  borderRadius: 999,
};

const primaryBtn: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
  color: '#fff',
  border: 'none',
  padding: '13px 24px',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  boxShadow: '0 8px 24px rgba(109,74,255,0.28)',
};

/* ════════════════════════════════════════════════════════════════════════════
   1. NAV
   ════════════════════════════════════════════════════════════════════════════ */

function Nav() {
  const links = ['Fonctionnalités', 'Tarifs', 'Blog'];
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
        ...pad,
      }}
    >
      <div
        style={{
          ...maxw,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                }}
              >
                <Sparkles size={17} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>{fd?.businessName ?? "NovaSaaS"}</span>
            </>
          )}
        </div>

        <nav className="ns-nav" style={{ display: 'flex', gap: 30 }}>
          {links.map((l) => (
            <a
              key={l}
              href={`#${l === 'Fonctionnalités' ? 'features' : l === 'Tarifs' ? 'pricing' : 'cta'}`}
              style={{ color: C.inkSoft, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}
            >
              {l}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="#cta" className="ns-nav" style={{ color: C.inkSoft, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
            Connexion
          </a>
          <a href="#cta" style={primaryBtn}>
            Démarrer gratuitement
          </a>
          <button
            aria-label="Menu"
            className="ns-burger"
            onClick={() => setOpen((v) => !v)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: C.ink }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ ...maxw, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map((l) => (
                <a key={l} href={`#${l === 'Fonctionnalités' ? 'features' : l === 'Tarifs' ? 'pricing' : 'cta'}`} style={{ color: C.inkSoft, textDecoration: 'none', padding: '8px 0' }}>
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. HERO with animated dashboard mockup
   ════════════════════════════════════════════════════════════════════════════ */

function DashboardMockup() {
  const bars = [42, 68, 54, 88, 73, 96, 61];
  return (
    <div
      style={{
        borderRadius: 18,
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: '0 30px 80px -30px rgba(67,56,202,0.35)',
        overflow: 'hidden',
      }}
    >
      {/* window chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '12px 16px',
          borderBottom: `1px solid ${C.border}`,
          background: C.bgSoft,
        }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: 999, background: c }} />
        ))}
        <span style={{ marginLeft: 12, fontSize: 12, color: C.muted, fontWeight: 600 }}>
          app.novasaas.io / overview
        </span>
      </div>

      <div style={{ padding: 22, display: 'grid', gap: 18 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Revenu', val: '€48,2k', up: '+12%' },
            { label: 'Utilisateurs', val: '9,841', up: '+8%' },
            { label: 'Conversion', val: '4,7%', up: '+1,2pt' },
          ].map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ background: C.bgSoft, borderRadius: 12, padding: 14 }}
            >
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{k.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 2px' }}>{k.val}</p>
              <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{k.up}</span>
            </motion.div>
          ))}
        </div>

        {/* chart area */}
        <div style={{ background: C.bgSoft, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Performance hebdomadaire</span>
            <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>7 derniers jours</span>
          </div>
          {/* SVG line chart */}
          <svg viewBox="0 0 320 90" width="100%" height="90" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="ns-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity="0.3" />
                <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 70 L53 50 L106 58 L160 28 L213 40 L266 16 L320 30"
              fill="none"
              stroke={C.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <path
              d="M0 70 L53 50 L106 58 L160 28 L213 40 L266 16 L320 30 L320 90 L0 90 Z"
              fill="url(#ns-area)"
            />
            {[[0, 70], [53, 50], [106, 58], [160, 28], [213, 40], [266, 16], [320, 30]].map(([x, y], i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#fff"
                stroke={C.primary}
                strokeWidth="2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.08 }}
              />
            ))}
          </svg>
        </div>

        {/* animated bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 70 }}>
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                background: i === 5 ? `linear-gradient(180deg, ${C.primary}, ${C.indigo})` : C.bgViolet,
                borderRadius: 6,
                minHeight: 6,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero"
      style={{
        ...pad,
        paddingBlock: 'clamp(56px, 9vw, 120px)',
        background: `radial-gradient(ellipse at 50% -10%, ${C.bgViolet} 0%, ${C.bg} 55%)`,
      }}
    >
      <div
        style={{
          ...maxw,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={pill}>
            <Sparkles size={13} /> Nouveau : tableaux de bord IA
          </span>
          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.04,
              margin: '22px 0 18px',
            }}
          >
            Pilotez votre croissance,{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              sans le chaos.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: C.inkSoft, lineHeight: 1.65, maxWidth: 480, margin: '0 0 32px' }}>
            NovaSaaS réunit vos données, vos équipes et vos automatisations dans une
            seule plateforme. Décidez plus vite, avec des analyses en temps réel.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#cta" style={{ ...primaryBtn, padding: '15px 28px', fontSize: 16 }}>
              Démarrer gratuitement <ArrowRight size={17} />
            </a>
            <a
              href="#how"
              style={{
                color: C.ink,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Voir une démo
              <span style={{ width: 28, height: 28, borderRadius: 999, background: C.bgViolet, display: 'grid', placeItems: 'center', color: C.primary }}>
                ▶
              </span>
            </a>
          </div>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 22 }}>
            Sans carte bancaire · 14 jours d&apos;essai · Annulez à tout moment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. CLIENT LOGOS
   ════════════════════════════════════════════════════════════════════════════ */

function Logos() {
  const logos = ['Stripe', 'Notion', 'Linear', 'Figma', 'Vercel', 'Supabase'];
  return (
    <section id="realisations" style={{ ...pad, paddingBlock: 48, borderBlock: `1px solid ${C.border}`, background: C.bgSoft }}>
      <div style={{ ...maxw, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 28 }}>
          PLUS DE 4 000 ÉQUIPES NOUS FONT CONFIANCE
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(24px, 5vw, 56px)',
          }}
        >
          {logos.map((l, i) => (
            <motion.span
              key={l}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.55 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{ fontSize: 'clamp(18px, 2.6vw, 26px)', fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4. BENEFITS — 6 cards with scroll-reveal stagger
   ════════════════════════════════════════════════════════════════════════════ */

interface Benefit {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const BENEFITS: Benefit[] = [
  { icon: <BarChart3 size={22} />, title: 'Analytics temps réel', body: 'Visualisez vos métriques clés en direct, sans attendre les rapports de fin de mois.' },
  { icon: <Workflow size={22} />, title: 'Automatisations', body: 'Créez des workflows sans code pour éliminer les tâches répétitives de vos équipes.' },
  { icon: <Users size={22} />, title: 'Collaboration', body: 'Commentaires, mentions et permissions granulaires pour aligner toute l’organisation.' },
  { icon: <ShieldCheck size={22} />, title: 'Sécurité SOC 2', body: 'Chiffrement de bout en bout, SSO et journaux d’audit conformes aux normes entreprise.' },
  { icon: <Globe size={22} />, title: 'Multi-régions', body: 'Hébergement en Europe et aux États-Unis, avec résidence des données configurable.' },
  { icon: <Zap size={22} />, title: 'Performances', body: 'Une interface ultra-rapide, optimisée pour des millions d’événements par seconde.' },
];

function Benefits() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id="features" style={{ ...pad, paddingBlock: 100 }} ref={ref}>
      <div style={{ ...maxw }}>
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 56px' }}>
          <span style={pill}>Fonctionnalités</span>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 14px' }}>
            Tout ce qu&apos;il faut pour aller vite
          </h2>
          <p style={{ fontSize: 17, color: C.inkSoft, lineHeight: 1.6 }}>
            Une plateforme pensée pour les équipes produit, marketing et data qui
            veulent décider sur la donnée — pas sur l&apos;intuition.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 22,
          }}
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, borderColor: C.primaryLight }}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                padding: 28,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 13,
                  background: C.bgViolet,
                  display: 'grid',
                  placeItems: 'center',
                  color: C.primary,
                  marginBottom: 18,
                }}
              >
                {b.icon}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.65, margin: 0 }}>{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5. HOW IT WORKS — 3 steps with connecting line
   ════════════════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const steps: { title: string; body: string }[] = [
    { title: 'Connectez vos outils', body: 'Reliez Stripe, HubSpot, votre base de données et plus de 80 intégrations en quelques clics.' },
    { title: 'Construisez vos vues', body: 'Glissez-déposez des widgets pour créer les tableaux de bord dont vos équipes ont besoin.' },
    { title: 'Partagez & automatisez', body: 'Diffusez des rapports, déclenchez des alertes et laissez NovaSaaS travailler pour vous.' },
  ];
  return (
    <section id="how" style={{ ...pad, paddingBlock: 100, background: C.bgSoft }} ref={ref}>
      <div style={{ ...maxw }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 64px' }}>
          <span style={pill}>Comment ça marche</span>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 0' }}>
            Opérationnel en 3 étapes
          </h2>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 36 }}>
          {/* connecting line */}
          <div
            className="ns-howline"
            style={{
              position: 'absolute',
              top: 28,
              left: '16%',
              right: '16%',
              height: 2,
              background: C.borderStrong,
              zIndex: 0,
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${C.primary}, ${C.indigo})`, transformOrigin: 'left' }}
            />
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.5 }}
              style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  margin: '0 auto 22px',
                  background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 22,
                  boxShadow: '0 8px 22px rgba(109,74,255,0.3)',
                }}
              >
                {i + 1}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.65, maxWidth: 280, margin: '0 auto' }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6. PRICING
   ════════════════════════════════════════════════════════════════════════════ */

interface Tier {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: '0€',
    period: '/mois',
    desc: 'Pour démarrer et explorer la plateforme.',
    features: ['Jusqu’à 3 utilisateurs', '5 tableaux de bord', 'Intégrations de base', 'Support communautaire'],
    cta: 'Commencer',
  },
  {
    name: 'Pro',
    price: '29€',
    period: '/mois',
    desc: 'Pour les équipes qui passent à l’échelle.',
    features: ['Utilisateurs illimités', 'Tableaux de bord illimités', '80+ intégrations', 'Automatisations', 'Support prioritaire'],
    highlight: true,
    cta: 'Essayer 14 jours',
  },
  {
    name: 'Business',
    price: '99€',
    period: '/mois',
    desc: 'Pour les organisations exigeantes.',
    features: ['Tout Pro inclus', 'SSO & SAML', 'Journaux d’audit', 'Résidence des données', 'CSM dédié'],
    cta: 'Contacter les ventes',
  },
];

function Pricing() {
  return (
    <section id="pricing" style={{ ...pad, paddingBlock: 100 }}>
      <div style={{ ...maxw }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <span style={pill}>Tarifs</span>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 14px' }}>
            Une tarification simple et transparente
          </h2>
          <p style={{ fontSize: 17, color: C.inkSoft }}>Sans frais cachés. Changez ou annulez à tout moment.</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                position: 'relative',
                background: t.highlight ? `linear-gradient(160deg, ${C.indigo}, ${C.primary})` : C.card,
                color: t.highlight ? '#fff' : C.ink,
                border: `1px solid ${t.highlight ? 'transparent' : C.border}`,
                borderRadius: 22,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: t.highlight ? '0 30px 70px -25px rgba(67,56,202,0.5)' : 'none',
                transform: t.highlight ? 'scale(1.03)' : 'none',
              }}
            >
              {t.highlight && (
                <span
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    color: C.primary,
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '5px 14px',
                    borderRadius: 999,
                    letterSpacing: '0.02em',
                  }}
                >
                  LE PLUS POPULAIRE
                </span>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>{t.name}</h3>
              <p style={{ fontSize: 14, color: t.highlight ? 'rgba(255,255,255,0.8)' : C.muted, margin: '0 0 20px' }}>
                {t.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em' }}>{t.price}</span>
                <span style={{ fontSize: 15, color: t.highlight ? 'rgba(255,255,255,0.75)' : C.muted }}>{t.period}</span>
              </div>
              <a
                href="#cta"
                style={{
                  textAlign: 'center',
                  padding: '13px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  marginBottom: 26,
                  background: t.highlight ? '#fff' : `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
                  color: t.highlight ? C.primary : '#fff',
                }}
              >
                {t.cta}
              </a>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 13 }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5 }}>
                    <Check
                      size={17}
                      strokeWidth={3}
                      color={t.highlight ? '#fff' : C.green}
                      style={{ flexShrink: 0 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7. TESTIMONIALS — 6 cards, 2 rows
   ════════════════════════════════════════════════════════════════════════════ */

interface Testi {
  name: string;
  role: string;
  body: string;
  hue: string;
  img: string;
}

const AV = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=160&h=160&auto=format&fit=crop&crop=faces`;

const TESTIS: Testi[] = [
  { name: 'Sophie Laurent', role: 'Head of Growth, Welly', hue: '#6d4aff', img: AV('1494790108377-be9c29b29330'), body: 'On a divisé par deux le temps passé sur le reporting. Les équipes adorent enfin leurs dashboards.' },
  { name: 'Thomas Berger', role: 'CTO, Fluxio', hue: '#4338ca', img: AV('1500648767791-00dcc994a43e'), body: 'L’API et les automatisations sont d’une fiabilité rare. Déployé en production en une après-midi.' },
  { name: 'Inès Moreau', role: 'CMO, Brightside', hue: '#8b6dff', img: AV('1438761681033-6461ffad8d80'), body: 'Le suivi de conversion en temps réel a transformé nos arbitrages budgétaires hebdomadaires.' },
  { name: 'Karl Nyström', role: 'Data Lead, Nordata', hue: '#5a37e0', img: AV('1507003211169-0a1dd7228f2d'), body: 'Enfin un outil que mon équipe data ET mon équipe marketing utilisent sans se battre.' },
  { name: 'Amélie Dubois', role: 'COO, Vértigo', hue: '#7c5cff', img: AV('1517841905240-472988babdf9'), body: 'Le support est excellent et la conformité SOC 2 a débloqué nos plus gros comptes entreprise.' },
  { name: 'Diego Ferreira', role: 'Founder, Layerbase', hue: '#6d4aff', img: AV('1472099645785-5658abf4ff4e'), body: 'Passés de tableurs chaotiques à une source de vérité unique. Retour sur investissement immédiat.' },
];

function Testimonials() {
  return (
    <section id="about" style={{ ...pad, paddingBlock: 100, background: C.bgSoft }}>
      <div style={{ ...maxw }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <span style={pill}>Témoignages</span>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 0' }}>
            Aimé par les équipes qui livrent
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {TESTIS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} fill="#f5b50a" color="#f5b50a" />
                ))}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: C.inkSoft, margin: '0 0 22px' }}>
                &ldquo;{t.body}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  width={42}
                  height={42}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    objectFit: 'cover',
                    border: `2px solid ${t.hue}`,
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5 }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 13, color: C.muted }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8. FAQ
   ════════════════════════════════════════════════════════════════════════════ */

const FAQS: { q: string; a: string }[] = [
  { q: 'Puis-je essayer NovaSaaS gratuitement ?', a: 'Oui. L’offre Starter est gratuite à vie, et tous les plans payants incluent 14 jours d’essai sans carte bancaire.' },
  { q: 'Mes données sont-elles en sécurité ?', a: 'Absolument. Nous sommes certifiés SOC 2 Type II, chiffrons toutes les données en transit et au repos, et proposons le SSO sur les plans Business.' },
  { q: 'Puis-je changer d’offre à tout moment ?', a: 'Oui, les changements de plan sont immédiats et la facturation est calculée au prorata. Aucun engagement de durée.' },
  { q: 'Quelles intégrations proposez-vous ?', a: 'Plus de 80 intégrations natives (Stripe, HubSpot, Salesforce, Postgres…) plus une API REST et des webhooks pour le reste.' },
  { q: 'Proposez-vous un support en français ?', a: 'Oui, notre équipe support répond en français et en anglais. Les plans Pro et Business bénéficient d’un support prioritaire.' },
];

function FAQItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '22px 4px',
          textAlign: 'left',
          fontSize: 17,
          fontWeight: 600,
          color: C.ink,
          fontFamily: C.font,
        }}
      >
        {item.q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ color: C.primary, flexShrink: 0 }}>
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.7, margin: '0 4px 22px', maxWidth: 720 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  return (
    <section style={{ ...pad, paddingBlock: 100 }}>
      <div style={{ ...maxw, maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={pill}>FAQ</span>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 0' }}>
            Questions fréquentes
          </h2>
        </div>
        <div>
          {FAQS.map((f, i) => (
            <FAQItem key={f.q} item={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9. FINAL CTA
   ════════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section id="cta" style={{ ...pad, paddingBlock: 90 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          ...maxw,
          maxWidth: 980,
          borderRadius: 28,
          background: `linear-gradient(135deg, ${C.indigo}, ${C.primary})`,
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 18px' }}>
            Prêt à piloter votre croissance ?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Lancez votre premier tableau de bord en moins de cinq minutes. Gratuit, sans carte bancaire.
          </p>
          <a
            href="#cta"
            style={{
              background: '#fff',
              color: C.primary,
              padding: '16px 34px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 16,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Démarrer gratuitement <ArrowRight size={18} />
          </a>

          {/* social proof */}
          <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['#fff', '#e0d9ff', '#c7b8ff', '#b1a0ff', '#9d88ff'].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background: c,
                    border: '2px solid ' + C.primary,
                    marginLeft: i === 0 ? 0 : -12,
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              Rejoint par plus de 12 000 fondateurs et équipes
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10. FOOTER
   ════════════════════════════════════════════════════════════════════════════ */

function ContactSection() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section
      id="contact"
      style={{
        ...pad,
        paddingBlock: 80,
        background: C.bgSoft,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ ...maxw, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '18px 0 14px', color: C.ink }}>
          Contactez-nous
        </h2>
        <p style={{ fontSize: 16, color: C.muted, margin: '0 0 32px', lineHeight: 1.6 }}>
          Une question ? Notre équipe vous répond sous 24 heures.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim() && msg.trim()) setDone(true);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@adresse.com"
            aria-label="Email"
            style={{
              width: '100%',
              background: '#fff',
              border: `1px solid ${C.borderStrong}`,
              color: C.ink,
              padding: '14px 18px',
              fontSize: 15,
              outline: 'none',
              borderRadius: 10,
              fontFamily: C.font,
            }}
          />
          <textarea
            required
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Votre message..."
            aria-label="Message"
            style={{
              width: '100%',
              background: '#fff',
              border: `1px solid ${C.borderStrong}`,
              color: C.ink,
              padding: '14px 18px',
              fontSize: 15,
              outline: 'none',
              borderRadius: 10,
              fontFamily: C.font,
              resize: 'vertical',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              background: done ? C.ink : C.primary,
              color: '#fff',
              border: 'none',
              padding: '14px 28px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              borderRadius: 10,
              transition: 'background 0.3s',
            }}
          >
            {done ? 'Envoyé avec succès !' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: 'Produit', links: ['Fonctionnalités', 'Tarifs', 'Intégrations', 'Changelog', 'Roadmap'] },
    { title: 'Ressources', links: ['Blog', 'Documentation', 'Guides', 'Centre d’aide', 'API'] },
    { title: 'Entreprise', links: ['À propos', 'Carrières', 'Clients', 'Presse', 'Contact'] },
    { title: 'Légal', links: ['Confidentialité', 'CGU', 'Cookies', 'RGPD', 'Sécurité'] },
  ];

  const getAnchor = (item: string) => {
    const normalized = item.toLowerCase();
    if (normalized === 'fonctionnalités' || normalized.includes('intégration') || normalized.includes('changelog') || normalized.includes('roadmap') || normalized.includes('propos') || normalized.includes('client')) {
      return '#features';
    }
    if (normalized === 'tarifs') {
      return '#pricing';
    }
    if (normalized === 'contact' || normalized.includes('aide')) {
      return '#contact';
    }
    return '#cta';
  };

  return (
    <footer style={{ ...pad, paddingBlock: 64, borderTop: `1px solid ${C.border}`, background: C.bgSoft }}>
      <div style={{ ...maxw }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 40 }}>
          <div style={{ minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                }}
              >
                <Sparkles size={15} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18 }}>{fd?.businessName ?? "NovaSaaS"}</span>
            </div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 230 }}>
              La plateforme d&apos;analytics et d&apos;automatisation pour les équipes qui avancent vite.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 14 }}>{col.title}</p>
              {col.links.map((l) => (
                <a
                  key={l}
                  href={getAnchor(l)}
                  style={{ display: 'block', fontSize: 14, color: C.muted, textDecoration: 'none', padding: '5px 0' }}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
            color: C.muted,
          }}
        >
          <span>© 2026 NovaSaaS SAS. Tous droits réservés.</span>
          <span>Fait avec soin à Lyon, France.</span>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function Impact219Page() {
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
    <main style={pageStyle}>
      <style>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 820px){
          .ns-nav { display: none !important; }
          .ns-burger { display: grid !important; }
          .ns-howline { display: none !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Logos />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <ContactSection />
      <Footer />
    </main>
  );
}
