"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, ArrowRight, ChevronRight, Menu, X, CheckCircle2, 
  PlayCircle, Star, Quote, Mail, Phone, ExternalLink, Instagram, Facebook, 
  Linkedin, Twitter, ChevronDown, Clock, Users, Zap, Globe, Shield, Ticket,
  Microphone, Radio, Target, Cpu, Code
} from 'lucide-react';

/* 
 * ==========================================
 * Business Name: AI Horizons Tech Summit
 * Description: Event Landing Page - Tech Summit
 * Fonts: Orbitron (Serif/Display) & Inter (Sans)
 * Colors: Cyan (#06b6d4), Deep Void Dark (#030712), White
 * Theme: Dark, Tech, Future
 * Credits: AeviaLaunch Templates
 * ==========================================
 */

const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
};

// --- DEFAULT STYLES ---
const DEFAULT_BRAND_COLOR = "#06b6d4";

const C = {
  primary: DEFAULT_BRAND_COLOR,
  primaryLight: shadeColor(DEFAULT_BRAND_COLOR, 40),
  primaryDark: shadeColor(DEFAULT_BRAND_COLOR, -40),
  bg: "#0a0a0a", // Deep Void Dark fallback
  bgDeep: "#030712",
  bgCard: "#111827", // slightly lighter dark
  text: "#f9fafb",
  textMuted: "#9ca3af",
  accent: "#8b5cf6", // Purple accent
  white: "#ffffff",
  black: "#000000"
};

const SERIF = "'Orbitron', sans-serif";
const SANS = "'Inter', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

// --- FALLBACK IMAGES ---
const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
  speakers: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  ],
  gallery: [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475721028070-20516140ee55?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop"
  ],
  sponsors: [
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg"
  ]
};


// --- UTILS & COMPONENTS ---
const Reveal = ({ children, delay = 0, y = 20, style = {}, threshold = 0.2, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: \`-\${threshold * 100}%\` });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const Eyebrow = ({ text, color = C.primary }) => (
  <Reveal>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <div style={{ width: '40px', height: '1px', backgroundColor: color }} />
      <span style={{ 
        fontFamily: SERIF, 
        fontSize: '14px', 
        letterSpacing: '3px', 
        textTransform: 'uppercase', 
        color: color,
        fontWeight: 600
      }}>
        {text}
      </span>
    </div>
  </Reveal>
);

const Button = ({ children, href, primary, icon: Icon, onClick, style = {} }) => {
  const [hover, setHover] = useState(false);
  
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 32px',
    fontFamily: SANS,
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textDecoration: 'none',
    border: \`1px solid \${primary ? C.primary : 'rgba(255,255,255,0.2)'}\`,
    backgroundColor: primary ? (hover ? C.primaryLight : C.primary) : (hover ? 'rgba(255,255,255,0.05)' : 'transparent'),
    color: primary ? C.bgDeep : C.white,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    ...style
  };

  const Element = href ? 'a' : 'button';

  return (
    <Element 
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={baseStyle}
    >
      {children}
      {Icon && (
        <motion.span
          animate={{ x: hover ? 5 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <Icon size={18} />
        </motion.span>
      )}
    </Element>
  );
};

// --- CUSTOM SVG GRAPHICS ---
const CyberGrid = () => (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: \`
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
    \`,
    backgroundSize: '4rem 4rem',
    pointerEvents: 'none',
    zIndex: 0
  }} />
);

const GlowOrb = ({ color, top, left, right, bottom, size = "40vw", opacity = 0.15 }) => (
  <div style={{
    position: 'absolute',
    top, left, right, bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: \`radial-gradient(circle, \${color} 0%, transparent 70%)\`,
    opacity,
    pointerEvents: 'none',
    filter: 'blur(60px)',
    zIndex: 0,
    transform: 'translate(-50%, -50%)'
  }} />
);

// --- MAIN TEMPLATE ---

export default function AIHorizonsTemplate() {
  const [session, setSession] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Agenda tabs

  // Fetch session data placeholder
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');
        if (sessionId) {
          const res = await fetch(\`/api/session/\${sessionId}\`);
          if (res.ok) {
            const data = await res.json();
            setSession(data);
          }
        }
      } catch (err) {
        console.error("No session found", err);
      }
    };
    fetchSession();
  }, []);

  // Update Brand Color
  useEffect(() => {
    if (session?.formData?.brandColor) {
      C.primary = session.formData.brandColor;
      C.primaryLight = shadeColor(C.primary, 40);
      C.primaryDark = shadeColor(C.primary, -40);
    }
  }, [session]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fd = session?.formData;
  const c = session?.generatedContent;

  const businessName = fd?.businessName || "AI Horizons '26";
  const eventDate = fd?.eventDate || "15 - 17 Novembre 2026";
  const eventLocation = fd?.eventLocation || "Station F, Paris";

  // Navigation Links
  const navLinks = [
    { name: "À Propos", href: "#about" },
    { name: "Intervenants", href: "#speakers" },
    { name: "Agenda", href: "#agenda" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "Billetterie", href: "#tickets" }
  ];

  // --- SECTIONS DATA (Fallback to Premium French) ---

  const heroTitle = c?.heroTitle || "LE SOMMET DES INTELLIGENCES";
  const heroSubtitle = c?.heroSubtitle || "Explorez les frontières de l'IA. 3 jours de conférences, d'ateliers techniques et de networking exclusif avec les pionniers du domaine.";

  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2026-11-15T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Stats
  const stats = [
    { value: "50+", label: "Conférenciers Experts" },
    { value: "3000+", label: "Participants" },
    { value: "3", label: "Jours d'Immersion" },
    { value: "100+", label: "Startups & Exposants" }
  ];

  // Speakers
  const speakers = [
    { name: "Elena Rostova", role: "Directrice de Recherche IA, TechGiant", photo: PHOTOS.speakers[0] },
    { name: "Marc Delattre", role: "Fondateur, NeuralNetworks Inc.", photo: PHOTOS.speakers[1] },
    { name: "Dr. Sarah Chen", role: "Professeure en Éthique de l'IA", photo: PHOTOS.speakers[2] },
    { name: "James Holden", role: "CTO, FutureRobotics", photo: PHOTOS.speakers[3] },
    { name: "Camille Laurent", role: "Lead Data Scientist, DataCorp", photo: PHOTOS.speakers[4] },
    { name: "Alexandre Dubois", role: "Investisseur, AI Ventures", photo: PHOTOS.speakers[5] }
  ];

  // Agenda
  const agendaDays = [
    {
      date: "Jour 1 - 15 Nov",
      title: "Fondations & Futur",
      sessions: [
        { time: "09:00 - 10:30", title: "Keynote d'Ouverture : L'état de l'IA en 2026", speaker: "Elena Rostova", type: "Keynote" },
        { time: "11:00 - 12:30", title: "Réseaux Neuronaux Avancés : Nouvelles Architectures", speaker: "Marc Delattre", type: "Masterclass" },
        { time: "14:00 - 15:30", title: "L'IA Générative dans le Design Industriel", speaker: "Camille Laurent", type: "Workshop" },
        { time: "16:00 - 17:30", title: "Panel : Régulation et Éthique de l'IA", speaker: "Dr. Sarah Chen & Invités", type: "Panel" }
      ]
    },
    {
      date: "Jour 2 - 16 Nov",
      title: "Applications & Industrie",
      sessions: [
        { time: "09:30 - 11:00", title: "Robotics and AI Integration", speaker: "James Holden", type: "Keynote" },
        { time: "11:30 - 13:00", title: "IA en Santé : Du diagnostic aux traitements", speaker: "Dr. Clara Martin", type: "Masterclass" },
        { time: "14:30 - 16:00", title: "Financer sa startup IA en 2026", speaker: "Alexandre Dubois", type: "Workshop" }
      ]
    },
    {
      date: "Jour 3 - 17 Nov",
      title: "Networking & Hackathon",
      sessions: [
        { time: "09:00 - 18:00", title: "Hackathon IA Horizons : Résoudre les défis climatiques", speaker: "Mentors divers", type: "Compétition" },
        { time: "19:00 - 23:00", title: "Gala de Clôture & Remise des Prix", speaker: "Toute l'équipe", type: "Networking" }
      ]
    }
  ];

  // Tickets
  const tickets = [
    {
      name: "Early Bird",
      price: "299€",
      desc: "Accès limité aux 500 premiers inscrits.",
      features: ["Accès aux 3 jours", "Conférences principales", "Application de networking", "Café & Déjeuners"],
      primary: false
    },
    {
      name: "Pass Standard",
      price: "499€",
      desc: "L'expérience complète AI Horizons.",
      features: ["Accès aux 3 jours", "Toutes les conférences & panels", "Application de networking", "Café, Déjeuners & Cocktails", "Vidéos en replay"],
      primary: true
    },
    {
      name: "Pass VIP",
      price: "999€",
      desc: "Pour les cadres et investisseurs.",
      features: ["Accès prioritaire", "Toutes les conférences & panels", "Lounge VIP exclusif", "Dîner privé avec les speakers", "Accès illimité aux replays"],
      primary: false
    }
  ];

  // FAQ
  const faqs = [
    { q: "L'événement sera-t-il retransmis en ligne ?", a: "Oui, un pass virtuel est disponible pour suivre les conférences principales en direct." },
    { q: "Puis-je changer le nom sur mon billet ?", a: "Oui, vous pouvez transférer votre billet jusqu'à 7 jours avant l'événement via notre plateforme." },
    { q: "Y a-t-il des tarifs de groupe ?", a: "Nous offrons 15% de réduction pour les groupes de 5 personnes ou plus. Contactez-nous directement." },
    { q: "Le lieu est-il accessible aux PMR ?", a: "Absolument, Station F est entièrement accessible. N'hésitez pas à nous prévenir pour des besoins spécifiques." }
  ];


  return (
    <div style={{
      fontFamily: SANS,
      backgroundColor: C.bgDeep,
      color: C.text,
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* GLOBAL STYLES */}
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;700;900&display=swap');
        
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; background-color: \${C.bgDeep}; }
        * { box-sizing: border-box; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: \${C.bgDeep}; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: \${C.primary}; }
        
        .nav-link {
          position: relative;
          color: \${C.text};
          text-decoration: none;
          font-family: \${SANS};
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
        }
        .nav-link:hover { color: \${C.primary}; }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: \${C.primary};
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .glass-panel {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .countdown-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: clamp(70px, 8vw, 100px);
          height: clamp(70px, 8vw, 100px);
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 8px;
        }
        .countdown-num {
          font-family: \${SERIF};
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 700;
          color: \${C.primary};
          line-height: 1;
        }
        .countdown-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: \${C.textMuted};
          margin-top: 4px;
        }

        .section-padding {
          padding: 120px 5%;
        }
        @media (max-width: 768px) {
          .section-padding { padding: 80px 5%; }
        }

        .title-display {
          font-family: \${SERIF};
          font-size: clamp(32px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 24px;
        }
        .title-section {
          font-family: \${SERIF};
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 40px;
        }

        .gradient-text {
          background: linear-gradient(to right, #fff, \${C.textMuted});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-text-primary {
          background: linear-gradient(to right, \${C.primary}, \${C.primaryLight});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      \`}} />

      {/* HEADER NAVIGATION */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(3, 7, 18, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: C.primary, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu color={C.bgDeep} size={24} />
          </div>
          <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>
            {businessName.split(' ')[0]}<span style={{ color: C.primary }}>{businessName.substring(businessName.indexOf(' '))}</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '40px', '@media (min-width: 992px)': { display: 'flex' } }} className="desktop-nav">
          {navLinks.map((link, i) => (
            <a key={i} href={link.href} className="nav-link">{link.name}</a>
          ))}
        </nav>
        <div style={{ display: 'none', '@media (min-width: 992px)': { display: 'block' } }} className="desktop-btn">
           <Button href="#tickets" primary>Réserver un Pass</Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: C.white,
            cursor: 'pointer',
            display: 'block',
            padding: '8px'
          }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <style dangerouslySetInnerHTML={{__html:\`
          @media (min-width: 992px) {
            .mobile-toggle { display: none !important; }
            .desktop-nav { display: flex !important; }
            .desktop-btn { display: block !important; }
          }
        \`}} />
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0, right: 0,
              backgroundColor: 'rgba(3, 7, 18, 0.98)',
              backdropFilter: 'blur(20px)',
              padding: '40px 5%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              zIndex: 999,
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: C.white,
                  textDecoration: 'none',
                  fontFamily: SERIF,
                  fontSize: '24px',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '16px'
                }}
              >
                {link.name}
              </a>
            ))}
            <div style={{ marginTop: '16px' }}>
              <Button href="#tickets" primary onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                Réserver un Pass
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px', // Account for header
        overflow: 'hidden'
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: \`url('\${PHOTOS.hero}')\`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          zIndex: -2
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: \`linear-gradient(to bottom, \${C.bgDeep}00 0%, \${C.bgDeep} 100%)\`,
          zIndex: -1
        }} />
        <CyberGrid />
        <GlowOrb color={C.primary} top="20%" left="80%" opacity={0.1} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 5%', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            <Reveal y={30} delay={0.1}>
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', borderRadius: '30px', 
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: \`1px solid rgba(6, 182, 212, 0.3)\`,
                marginBottom: '32px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, boxShadow: \`0 0 10px \${C.primary}\` }} />
                <span style={{ fontFamily: SANS, fontSize: '13px', fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Édition 2026 Officielle
                </span>
              </div>
            </Reveal>

            <Reveal y={40} delay={0.2}>
              <h1 className="title-display">
                {heroTitle.split(' ').map((word, i) => (
                  <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                    {i % 2 === 1 ? <span className="gradient-text-primary">{word}</span> : word}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal y={40} delay={0.3}>
              <p style={{
                fontFamily: SANS,
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.6,
                color: C.textMuted,
                maxWidth: '800px',
                margin: '0 auto 48px auto'
              }}>
                {heroSubtitle}
              </p>
            </Reveal>

            <Reveal y={40} delay={0.4}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginBottom: '64px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar color={C.primary} />
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{eventDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin color={C.primary} />
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{eventLocation}</span>
                </div>
              </div>
            </Reveal>

            <Reveal y={40} delay={0.5}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '64px' }}>
                <Button primary href="#tickets" icon={ArrowRight} style={{ padding: '20px 40px', fontSize: '16px' }}>
                  Réserver ma place
                </Button>
                <Button href="#agenda" style={{ padding: '20px 40px', fontSize: '16px' }}>
                  Voir le programme
                </Button>
              </div>
            </Reveal>

            {/* Countdown */}
            <Reveal y={50} delay={0.6}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.days}</span>
                  <span className="countdown-label">Jours</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.hours}</span>
                  <span className="countdown-label">Heures</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.minutes}</span>
                  <span className="countdown-label">Min</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-num">{timeLeft.seconds}</span>
                  <span className="countdown-label">Sec</span>
                </div>
              </div>
            </Reveal>
            
          </div>
        </div>
      </section>

      {/* ========================================================
          STATS & LOGOS STRIP
          ======================================================== */}
      <section style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: '40px',
            textAlign: 'center'
          }}>
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: '48px', fontWeight: 900, color: C.white, marginBottom: '8px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: C.primary }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          ABOUT SECTION
          ======================================================== */}
      <section id="about" className="section-padding" style={{ position: 'relative' }}>
        <GlowOrb color={C.accent} top="50%" left="-10%" opacity={0.1} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
            
            <div style={{ flex: '1 1 min(500px, 100%)' }}>
              <Eyebrow text="À Propos de l'événement" />
              <h2 className="title-section">Façonner le futur de <span className="gradient-text-primary">l'Intelligence Artificielle</span></h2>
              <Reveal delay={0.2}>
                <p style={{ fontSize: '18px', color: C.textMuted, lineHeight: 1.7, marginBottom: '24px' }}>
                  AI Horizons rassemble les esprits les plus brillants de l'industrie technologique pour explorer, débattre et construire l'avenir de l'IA. Pendant trois jours intenses, plongez au cœur des innovations qui redéfinissent notre monde.
                </p>
                <p style={{ fontSize: '18px', color: C.textMuted, lineHeight: 1.7, marginBottom: '40px' }}>
                  Que vous soyez chercheur, développeur, ou dirigeant d'entreprise, cet événement est votre passerelle vers les technologies de demain.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ color: C.primary, marginTop: '4px' }}><Target size={24} /></div>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontFamily: SERIF }}>Visions Stratégiques</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: C.textMuted }}>Des keynotes inspirantes sur les tendances à 5-10 ans.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ color: C.primary, marginTop: '4px' }}><Code size={24} /></div>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontFamily: SERIF }}>Ateliers Pratiques</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: C.textMuted }}>Codez et déployez des modèles avec les experts.</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div style={{ flex: '1 1 min(500px, 100%)', position: 'relative' }}>
              <Reveal delay={0.4}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-20px', background: \`linear-gradient(45deg, \${C.primary}, \${C.accent})\`, opacity: 0.2, filter: 'blur(30px)', borderRadius: '24px' }} />
                  <img 
                    src={PHOTOS.about} 
                    alt="AI Conference" 
                    style={{ width: '100%', height: 'auto', borderRadius: '16px', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)' }} 
                  />
                  
                  {/* Floating badge */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: C.bgCard, padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 700 }}>100%</div>
                      <div style={{ fontSize: '12px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Innovation IA</div>
                    </div>
                  </motion.div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          SPEAKERS SECTION
          ======================================================== */}
      <section id="speakers" className="section-padding" style={{ backgroundColor: '#0a0a0a', position: 'relative' }}>
        <CyberGrid />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Eyebrow text="Line-up 2026" />
            <h2 className="title-section">Les <span className="gradient-text-primary">Visionnaires</span></h2>
            <p style={{ color: C.textMuted, maxWidth: '600px', margin: '0 auto' }}>
              Apprenez directement de ceux qui construisent l'IA d'aujourd'hui et imaginent celle de demain.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: '32px'
          }}>
            {speakers.map((speaker, i) => (
              <Reveal key={i} delay={i * 0.1} y={30}>
                <div className="glass-panel" style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  ':hover': { transform: 'translateY(-10px)' }
                }}>
                  <div style={{ height: '300px', overflow: 'hidden' }}>
                    <img 
                      src={speaker.photo} 
                      alt={speaker.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', filter: 'grayscale(30%)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'grayscale(0%)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'grayscale(30%)'; }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontFamily: SERIF, fontSize: '20px' }}>{speaker.name}</h3>
                    <p style={{ margin: 0, color: C.primary, fontSize: '14px', fontWeight: 500 }}>{speaker.role}</p>
                    
                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                      <a href="#" style={{ color: C.textMuted, transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=C.white} onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}><Linkedin size={18} /></a>
                      <a href="#" style={{ color: C.textMuted, transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=C.white} onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}><Twitter size={18} /></a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <Button>Voir tous les intervenants (50+)</Button>
          </div>

        </div>
      </section>

      {/* ========================================================
          AGENDA SECTION
          ======================================================== */}
      <section id="agenda" className="section-padding">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Eyebrow text="Programme Officiel" />
            <h2 className="title-section">Agenda <span className="gradient-text-primary">du Sommet</span></h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
            {agendaDays.map((day, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  background: activeTab === i ? C.primary : 'transparent',
                  color: activeTab === i ? C.bgDeep : C.white,
                  border: \`1px solid \${activeTab === i ? C.primary : 'rgba(255,255,255,0.2)'}\`,
                  padding: '16px 32px',
                  borderRadius: '30px',
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {day.date}
              </button>
            ))}
          </div>

          {/* Agenda List */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: 'clamp(20px, 4vw, 40px)' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: '24px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              {agendaDays[activeTab].title}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  {agendaDays[activeTab].sessions.map((session, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: '24px',
                      padding: '24px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      borderLeft: \`4px solid \${C.primary}\`
                    }}>
                      <div style={{ flex: '0 0 150px', color: C.primary, fontFamily: SERIF, fontWeight: 700, fontSize: '18px' }}>
                        {session.time}
                      </div>
                      <div style={{ flex: '1 1 min(300px, 100%)' }}>
                        <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', color: C.textMuted }}>
                          {session.type}
                        </div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>{session.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted }}>
                          <Microphone size={16} />
                          <span style={{ fontSize: '14px' }}>{session.speaker}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          SPONSORS SECTION
          ======================================================== */}
      <section id="sponsors" className="section-padding" style={{ backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow text="Partenaires" />
          <h2 className="title-section">Ils rendent cela <span className="gradient-text-primary">possible</span></h2>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '60px',
            marginTop: '60px',
            opacity: 0.6
          }}>
            {PHOTOS.sponsors.map((logo, i) => (
              <img key={i} src={logo} alt="Sponsor Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
            ))}
          </div>
          
          <div style={{ marginTop: '60px' }}>
            <p style={{ color: C.textMuted, marginBottom: '24px' }}>Vous souhaitez devenir partenaire ?</p>
            <Button>Devenir Sponsor</Button>
          </div>
        </div>
      </section>


      {/* ========================================================
          TICKETS SECTION
          ======================================================== */}
      <section id="tickets" className="section-padding" style={{ position: 'relative' }}>
        <GlowOrb color={C.primary} top="80%" left="20%" opacity={0.1} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Eyebrow text="Billetterie" />
            <h2 className="title-section">Sécurisez votre <span className="gradient-text-primary">Accès</span></h2>
            <p style={{ color: C.textMuted, maxWidth: '600px', margin: '0 auto' }}>
              Les places sont limitées pour garantir une expérience de networking optimale.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: '32px',
            alignItems: 'center'
          }}>
            {tickets.map((ticket, i) => (
              <Reveal key={i} delay={i * 0.1} y={40}>
                <div style={{
                  backgroundColor: ticket.primary ? 'rgba(6, 182, 212, 0.05)' : C.bgCard,
                  border: ticket.primary ? \`2px solid \${C.primary}\` : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '40px',
                  position: 'relative',
                  transform: ticket.primary ? 'scale(1.05)' : 'scale(1)',
                  zIndex: ticket.primary ? 10 : 1,
                  boxShadow: ticket.primary ? \`0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(6, 182, 212, 0.2)\` : 'none'
                }}>
                  {ticket.primary && (
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: C.primary, color: C.bgDeep, padding: '8px 24px', borderRadius: '30px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Plus Populaire
                    </div>
                  )}
                  
                  <h3 style={{ fontFamily: SERIF, fontSize: '24px', margin: '0 0 16px 0' }}>{ticket.name}</h3>
                  <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: SERIF, color: ticket.primary ? C.primary : C.white, marginBottom: '16px' }}>
                    {ticket.price}
                  </div>
                  <p style={{ color: C.textMuted, fontSize: '15px', marginBottom: '32px', minHeight: '45px' }}>
                    {ticket.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                    {ticket.features.map((feat, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <CheckCircle2 size={20} color={ticket.primary ? C.primary : C.textMuted} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: C.text }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Button primary={ticket.primary} style={{ width: '100%' }}>
                    Réserver maintenant
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          FAQ SECTION
          ======================================================== */}
      <section className="section-padding" style={{ backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Eyebrow text="FAQ" />
            <h2 className="title-section">Questions <span className="gradient-text-primary">Fréquentes</span></h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={i} className="glass-panel" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'none', border: 'none', color: C.white, cursor: 'pointer', textAlign: 'left',
                      fontFamily: SANS, fontSize: '16px', fontWeight: 500
                    }}
                  >
                    {faq.q}
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                      <ChevronDown size={20} color={C.primary} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 24px 24px 24px', color: C.textMuted, lineHeight: 1.6 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          CTA & FOOTER
          ======================================================== */}
      <section style={{ padding: '100px 5%', backgroundColor: C.primary, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: C.bgDeep, marginBottom: '24px' }}>
            Prêt à façonner l'avenir ?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(3, 7, 18, 0.8)', marginBottom: '40px' }}>
            Rejoignez des milliers de professionnels à l'événement tech de l'année.
          </p>
          <Button href="#tickets" style={{ backgroundColor: C.bgDeep, color: C.white, border: 'none', padding: '20px 40px' }}>
            Obtenir mon Pass 2026
          </Button>
        </div>
      </section>

      <footer style={{ backgroundColor: C.bgDeep, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 5% 40px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: '60px', marginBottom: '80px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: C.primary, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu color={C.bgDeep} size={20} />
              </div>
              <span style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>
                {businessName.split(' ')[0]}<span style={{ color: C.primary }}>{businessName.substring(businessName.indexOf(' '))}</span>
              </span>
            </div>
            <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              L'événement européen de référence pour les professionnels de l'Intelligence Artificielle.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: C.textMuted }}><Twitter size={20} /></a>
              <a href="#" style={{ color: C.textMuted }}><Linkedin size={20} /></a>
              <a href="#" style={{ color: C.textMuted }}><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: SERIF, fontSize: '16px', marginBottom: '24px' }}>Liens Rapides</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navLinks.map((l, i) => (
                <li key={i}><a href={l.href} style={{ color: C.textMuted, textDecoration: 'none', fontSize: '14px' }}>{l.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: SERIF, fontSize: '16px', marginBottom: '24px' }}>Légal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '14px' }}>Mentions Légales</a></li>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '14px' }}>Politique de Confidentialité</a></li>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '14px' }}>CGV Billetterie</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: SERIF, fontSize: '16px', marginBottom: '24px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: C.textMuted, fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> contact@aihorizons.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} /> Station F, Paris
              </div>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', color: C.textMuted, fontSize: '14px' }}>
          © {new Date().getFullYear()} {businessName}. Tous droits réservés. <br/>
          Créé avec AeviaLaunch.
        </div>
      </footer>
    </div>
  );
}
