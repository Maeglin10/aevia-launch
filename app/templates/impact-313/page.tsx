"use client";
// @ts-nocheck
/*
 * Template: Urgence Plomberie 24/7
 * Description: Plumber - Dark Urgent. Fast assistance, emergency styling, sticky banner.
 * Fonts: Barlow Condensed & Roboto
 * Colors: Red (#dc2626), deep navy/charcoal (#0b0f19)
 * Credits: AeviaLaunch
 */

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  AnimatePresence 
} from "framer-motion";
import {
  PhoneCall,
  AlertTriangle,
  Clock,
  Wrench,
  Droplet,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  MapPin,
  Mail,
  CheckCircle2,
  Star,
  MessageSquare,
  ArrowRight,
  Menu,
  X,
  Plus
} from "lucide-react";

// Helper: Shade Color
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

// Colors and Fonts Configuration
const DEFAULT_C = {
  primary: "#dc2626", // Red
  primaryLight: "#ef4444",
  primaryDark: "#b91c1c",
  bg: "#0b0f19", // Deep navy/charcoal
  bgDeep: "#05070c",
  bgCard: "#111827",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  accent: "#f59e0b", // Amber for urgent highlights
  white: "#ffffff",
  black: "#000000"
};

// Antigravity referenced `C` throughout but only defined DEFAULT_C — alias it.
const C = DEFAULT_C;

const SERIF = "'Barlow Condensed', sans-serif";
const SANS = "'Roboto', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1607472586893-edb57cb5b3e1?auto=format&fit=crop&q=80&w=2000",
  worker1: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
  worker2: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=1200",
  tools: "https://images.unsplash.com/photo-1540103711724-14b434c4b6fc?auto=format&fit=crop&q=80&w=1200",
  pipe: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1200",
  gallery: [
    "https://images.unsplash.com/photo-1607472586893-edb57cb5b3e1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1540103711724-14b434c4b6fc?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  ]
};

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Reusable Components
const Reveal = ({ children, delay = 0, y = 30, className = "", width = "100%", once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <div ref={ref} style={{ width, position: "relative", overflow: "hidden" }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: y },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Eyebrow = ({ children, color }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem"
  }}>
    <div style={{ width: "30px", height: "2px", backgroundColor: color }} />
    <span style={{
      fontFamily: SANS,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: color,
      fontSize: "0.875rem"
    }}>
      {children}
    </span>
  </div>
);

const Button = ({ children, variant = "primary", href = "#", className = "", icon = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "1rem 2rem",
    borderRadius: "4px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    border: "none",
    zIndex: 1
  };

  const variants = {
    primary: {
      backgroundColor: C.primary,
      color: C.white,
      border: `2px solid ${C.primary}`,
    },
    outline: {
      backgroundColor: "transparent",
      color: C.white,
      border: `2px solid ${C.primary}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: C.white,
      border: "2px solid transparent",
    }
  };

  return (
    <motion.a
      href={href}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: variant === "primary" ? C.primaryDark : C.primary,
          zIndex: -1,
          originX: 0
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
      {children}
      {icon && (
        <motion.span
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {icon}
        </motion.span>
      )}
    </motion.a>
  );
};

// Fallback Content
const FALLBACK_SERVICES = [
  {
    title: "Dépannage d'Urgence 24/7",
    description: "Intervention rapide pour fuites d'eau, ruptures de canalisation, et pannes critiques. Nous sommes là quand vous en avez le plus besoin.",
    icon: <AlertTriangle size={32} />
  },
  {
    title: "Débouchage Canalisation",
    description: "Utilisation d'équipements de pointe (caméra d'inspection, hydrocurage) pour un débouchage efficace et durable.",
    icon: <Wrench size={32} />
  },
  {
    title: "Recherche de Fuites",
    description: "Détection non destructive de fuites encastrées. Méthodes acoustiques et thermographiques pour localiser le problème sans dégâts.",
    icon: <Droplet size={32} />
  },
  {
    title: "Installation Sanitaire",
    description: "Pose et remplacement de WC, lavabos, douches, baignoires et robinetterie. Matériel professionnel garanti.",
    icon: <ShieldCheck size={32} />
  }
];

const FALLBACK_TESTIMONIALS = [
  {
    name: "Jean Dupont",
    role: "Particulier",
    content: "Intervention en pleine nuit pour un dégât des eaux. Le technicien était là en 30 minutes. Professionnel, efficace et rassurant. Je recommande vivement !",
    rating: 5
  },
  {
    name: "Marie Leroy",
    role: "Commerçante",
    content: "Service impeccable. Transparence totale sur les prix avant l'intervention, aucune mauvaise surprise. Le travail est propre et bien fait.",
    rating: 5
  },
  {
    name: "Pierre Martin",
    role: "Syndic de copropriété",
    content: "Nous faisons appel à eux pour toutes nos urgences de copropriété. Toujours réactifs et fiables. C'est un partenaire de confiance.",
    rating: 4
  }
];

const FALLBACK_FAQS = [
  {
    question: "En combien de temps pouvez-vous intervenir ?",
    answer: "Pour les urgences, nous garantissons une intervention dans les 30 à 45 minutes suivant votre appel, 24h/24 et 7j/7, dimanches et jours fériés inclus."
  },
  {
    question: "Vos tarifs sont-ils majorés la nuit et le week-end ?",
    answer: "Nos tarifs sont transparents. Une majoration est appliquée pour les interventions de nuit (20h-8h) et les week-ends/jours fériés, mais le devis vous est toujours communiqué et doit être validé avant toute intervention."
  },
  {
    question: "Effectuez-vous des réparations temporaires ?",
    answer: "Notre objectif est toujours de réaliser une réparation définitive. Cependant, si une pièce spécifique doit être commandée, nous mettons en place une solution temporaire sécurisée pour vous permettre d'utiliser vos installations."
  },
  {
    question: "Comment puis-je payer l'intervention ?",
    answer: "Nous acceptons les paiements par carte bancaire, espèces, ou virement immédiat. Une facture acquittée vous est remise sur place, utile pour vos assurances en cas de dégât des eaux."
  }
];

// Main Template Component
export default function PlumberDarkUrgent() {
  const [session, setSession] = useState(null);
  const [C, setC] = useState(DEFAULT_C);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  // Standard session loading (matches every other template): the wizard
  // links here as /templates/impact-313?session=<id>, not via localStorage.
  // Without this, fd.logoBase64 / fd.photoUrls / fd.businessName below never
  // receive real data outside of a same-browser localStorage fallback.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  // Try to load session from local storage or window
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem("aevia_session");
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        setSession(parsed);
        
        // Dynamic color extraction
        if (parsed?.formData?.brandColor) {
          const baseColor = parsed.formData.brandColor;
          setC(prev => ({
            ...prev,
            primary: baseColor,
            primaryLight: shadeColor(baseColor, 20),
            primaryDark: shadeColor(baseColor, -20)
          }));
        }
        
        // Data binding
        if (parsed?.generatedContent?.services && Array.isArray(parsed.generatedContent.services)) {
          setServices(parsed.generatedContent.services.map((s, i) => ({
            ...s,
            icon: FALLBACK_SERVICES[i % FALLBACK_SERVICES.length].icon
          })));
        }
        
        if (parsed?.generatedContent?.testimonials && Array.isArray(parsed.generatedContent.testimonials)) {
          setTestimonials(parsed.generatedContent.testimonials);
        }
      }
    } catch (e) {
      console.warn("Failed to parse session", e);
    }
    
    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  const businessName = fd.businessName || "Urgence Plomberie 24/7";
  const businessPhone = fd.businessPhone || "01 23 45 67 89";
  const businessEmail = fd.businessEmail || "contact@urgence-plomberie.fr";
  const businessCity = fd.businessCity || "Paris";
  
  const heroTitle = c.heroTitle || "DÉPANNAGE PLOMBERIE D'URGENCE EN 30 MIN";
  const heroSubtitle = c.heroSubtitle || "Fuite d'eau, débouchage, panne de chauffe-eau. Interventions 24h/24 et 7j/7 par des artisans qualifiés.";

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero shot first.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) { PHOTO.hero = p[0]; PHOTO.gallery[0] = p[0]; }
    if (p[1]) { PHOTO.worker1 = p[1]; PHOTO.gallery[1] = p[1]; }
    if (p[2]) { PHOTO.worker2 = p[2]; PHOTO.gallery[2] = p[2]; }
    if (p[3]) { PHOTO.tools = p[3]; PHOTO.gallery[3] = p[3]; }
    if (p[4]) { PHOTO.pipe = p[4]; PHOTO.gallery[4] = p[4]; }
    if (p[5]) PHOTO.gallery[5] = p[5];
  }, [fd]);

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <div style={{
      backgroundColor: C.bg,
      color: C.text,
      fontFamily: SANS,
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative"
    }}>
      {/* GLOBAL STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; background-color: ${C.bg}; }
        ::selection { background: ${C.primary}; color: ${C.white}; }
        * { box-sizing: border-box; }
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 { fontFamily: ${SERIF}; margin: 0; font-weight: 700; text-transform: uppercase; }
        p { margin: 0; line-height: 1.6; }
        a { text-decoration: none; color: inherit; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        ::-webkit-scrollbar-thumb { background: ${C.primary}; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.primaryLight}; }
        
        /* Utility Classes */
        .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section-pad { padding: 6rem 0; }
        .title-huge { font-size: clamp(3rem, 8vw, 6rem); line-height: 0.9; }
        .title-large { font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1; }
        .title-medium { font-size: clamp(1.5rem, 3vw, 2.5rem); line-height: 1.2; }
        .text-body { font-size: 1.125rem; color: ${C.textMuted}; }
        
        /* Responsive Grids */
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 2rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 2rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 1.5rem; }
        
        @media (max-width: 768px) {
          .section-pad { padding: 4rem 0; }
          .mobile-hide { display: none !important; }
        }
      `}} />

      {/* URGENT BANNER */}
      <div style={{
        backgroundColor: C.primary,
        color: C.white,
        padding: "0.5rem 0",
        textAlign: "center",
        fontFamily: SANS,
        fontSize: "0.875rem",
        fontWeight: 600,
        position: "relative",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        animation: "pulse 2s infinite"
      }}>
        <style dangerouslySetInnerHTML={{__html:`
          @keyframes pulse {
            0% { background-color: ${C.primary}; }
            50% { background-color: ${C.primaryDark}; }
            100% { background-color: ${C.primary}; }
          }
        `}} />
        <AlertTriangle size={16} />
        <span>URGENCE PLOMBERIE 24/7 SUR {businessCity.toUpperCase()} - INTERVENTION EN 30 MIN</span>
      </div>

      {/* HEADER */}
      <header style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 99,
        backgroundColor: isScrolled ? `rgba(5, 7, 12, 0.95)` : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderBottom: isScrolled ? `1px solid rgba(255,255,255,0.05)` : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "1rem 0"
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Logo */}
          <a href="#" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none"
          }}>
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: C.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transform: "rotate(-10deg)"
                }}>
                  <Wrench color={C.white} size={24} />
                </div>
                <span style={{
                  fontFamily: SERIF,
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  {businessName.split(" ").slice(0,2).join(" ")}
                  <span style={{ color: C.primary, fontSize: "1rem" }}>{businessName.split(" ").slice(2).join(" ")}</span>
                </span>
              </>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="mobile-hide" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["Services", "Avantages", "Réalisations", "Avis"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontFamily: SANS,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "color 0.2s ease"
              }}
              onMouseOver={e => e.target.style.color = C.primary}
              onMouseOut={e => e.target.style.color = C.text}
              >
                {item}
              </a>
            ))}
            
            <a href={`tel:${businessPhone}`} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: C.primary,
              color: C.white,
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: `0 4px 15px rgba(220, 38, 38, 0.3)`,
              transition: "transform 0.2s ease"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <PhoneCall size={18} />
              {businessPhone}
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button 
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: C.white,
              cursor: "pointer",
              padding: "0.5rem"
            }}
            className="mobile-show"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <style dangerouslySetInnerHTML={{__html:`
              @media(max-width: 768px){ .mobile-show { display: block !important; } }
            `}}/>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: "80px",
              left: 0,
              width: "100%",
              backgroundColor: C.bgDeep,
              zIndex: 98,
              borderBottom: `1px solid ${C.primary}`,
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}
          >
             {["Services", "Avantages", "Réalisations", "Avis"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: SANS,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: C.text,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "0.5rem"
                }}
              >
                {item}
              </a>
            ))}
            <a href={`tel:${businessPhone}`} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              backgroundColor: C.primary,
              color: C.white,
              padding: "1rem",
              borderRadius: "4px",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "1.125rem",
              textDecoration: "none",
              marginTop: "1rem"
            }}>
              <PhoneCall size={20} />
              APPELER MAINTENANT
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        overflow: "hidden"
      }}>
        {/* Background Image & Overlay */}
        <motion.div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%",
          backgroundImage: `url(${PHOTO.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: yHero,
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(to right, ${C.bgDeep} 0%, rgba(5,7,12,0.8) 50%, rgba(5,7,12,0.4) 100%)`,
          zIndex: 1
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "800px" }}>
            <Reveal>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                border: `1px solid ${C.primary}`,
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                marginBottom: "2rem"
              }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: C.primary, animation: "blink 1s infinite" }} />
                <style dangerouslySetInnerHTML={{__html:`@keyframes blink { 50% { opacity: 0; } }`}}/>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: C.white, textTransform: "uppercase" }}>
                  Techniciens disponibles actuellement
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="title-huge" style={{ color: C.white, marginBottom: "1.5rem" }}>
                {heroTitle}
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-body" style={{ fontSize: "1.25rem", color: "#cbd5e1", marginBottom: "2.5rem", maxWidth: "600px" }}>
                {heroSubtitle}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <Button href={`tel:${businessPhone}`} variant="primary" icon={<ArrowRight size={18} />} style={{ fontSize: "1.125rem", padding: "1.25rem 2.5rem" }}>
                  Intervention Immédiate
                </Button>
                <Button href="#contact" variant="outline">
                  Demander un devis
                </Button>
              </div>
            </Reveal>

            {/* Quick Badges */}
            <Reveal delay={0.5}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "4rem" }}>
                {[
                  { icon: <Clock size={24} color={C.primary}/>, text: "Disponible 24/7" },
                  { icon: <ShieldCheck size={24} color={C.primary}/>, text: "Devis Gratuit" },
                  { icon: <Star size={24} color={C.primary}/>, text: "Artisans Qualifiés" }
                ].map((badge, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {badge.icon}
                    <span style={{ fontFamily: SANS, fontWeight: 600, color: C.white, fontSize: "1rem" }}>{badge.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ backgroundColor: C.bgCard, borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div className="container">
          <div className="grid-4" style={{ padding: "3rem 0" }}>
            {[
              { num: "30", suffix: "min", label: "Temps d'intervention moyen" },
              { num: "15", suffix: "+", label: "Années d'expérience" },
              { num: "24", suffix: "/7", label: "Disponibilité totale" },
              { num: "100", suffix: "%", label: "Clients satisfaits" }
            ].map((stat, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <div style={{ fontFamily: SERIF, fontSize: "3.5rem", fontWeight: 700, color: C.primary, lineHeight: 1, marginBottom: "0.5rem" }}>
                    {stat.num}<span style={{ fontSize: "2rem", color: C.white }}>{stat.suffix}</span>
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <section id="services" className="section-pad" style={{ backgroundColor: C.bg, position: "relative" }}>
        {/* Subtle grid background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          zIndex: 0,
          pointerEvents: "none"
        }}/>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Reveal>
              <Eyebrow color={C.primary}>Nos Interventions</Eyebrow>
              <h2 className="title-large" style={{ color: C.white, marginTop: "1rem" }}>EXPERTISE & RÉACTIVITÉ</h2>
            </Reveal>
          </div>

          <div className="grid-2">
            {services.map((srv, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{
                  backgroundColor: C.bgCard,
                  padding: "2.5rem",
                  borderRadius: "8px",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                className="service-card"
                >
                  <style dangerouslySetInnerHTML={{__html:`
                    .service-card:hover { border-color: ${C.primary}; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                    .service-card:hover .service-icon { color: ${C.white} !important; background-color: ${C.primary} !important; }
                  `}}/>
                  
                  <div className="service-icon" style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.primary,
                    marginBottom: "1.5rem",
                    transition: "all 0.3s ease"
                  }}>
                    {srv.icon}
                  </div>

                  <h3 style={{ fontFamily: SERIF, fontSize: "1.75rem", color: C.white, marginBottom: "1rem" }}>
                    {srv.title}
                  </h3>
                  
                  <p className="text-body" style={{ marginBottom: "1.5rem", flexGrow: 1 }}>
                    {srv.description}
                  </p>

                  <a href={`tel:${businessPhone}`} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: C.primary,
                    fontFamily: SANS,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    marginTop: "auto"
                  }}>
                    Demander une intervention <ArrowRight size={16} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="avantages" className="section-pad" style={{ backgroundColor: C.bgDeep }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center" }}>
            
            {/* Image side */}
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  left: "-20px",
                  width: "100%",
                  height: "100%",
                  border: `2px solid ${C.primary}`,
                  borderRadius: "8px",
                  zIndex: 0
                }}/>
                <img 
                  src={PHOTO.worker1} 
                  alt="Plombier professionnel en intervention" 
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                  }}
                />
                
                {/* Floating Badge */}
                <div style={{
                  position: "absolute",
                  bottom: "-30px",
                  right: "-30px",
                  backgroundColor: C.bgCard,
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  zIndex: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: C.primary,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white
                  }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: "1.5rem", fontWeight: 700, color: C.white, lineHeight: 1 }}>AGRÉÉ</div>
                    <div style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted }}>Toutes assurances</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Content side */}
            <div style={{ paddingLeft: "10%" }}>
              <Reveal delay={0.2}>
                <Eyebrow color={C.primary}>Pourquoi nous choisir</Eyebrow>
                <h2 className="title-medium" style={{ color: C.white, marginBottom: "1.5rem", marginTop: "1rem" }}>
                  LA GARANTIE D'UN TRAVAIL BIEN FAIT, SANS SURPRISE
                </h2>
                <p className="text-body" style={{ marginBottom: "2rem" }}>
                  Face à une urgence de plomberie, vous avez besoin d'un partenaire de confiance. Notre équipe de professionnels qualifiés intervient rapidement avec un équipement de pointe pour résoudre vos problèmes durablement.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[
                    { title: "Transparence des prix", desc: "Devis détaillé et gratuit avant toute intervention. Aucun frais caché." },
                    { title: "Rapidité d'action", desc: "Présence sur les lieux en moins de 45 minutes pour les urgences absolues." },
                    { title: "Qualité garantie", desc: "Pièces et main d'œuvre garanties. Nous utilisons uniquement du matériel professionnel." }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ color: C.primary, marginTop: "0.25rem" }}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SANS, fontSize: "1.125rem", fontWeight: 700, color: C.white, marginBottom: "0.25rem" }}>
                          {item.title}
                        </h4>
                        <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.5 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: "3rem" }}>
                   <Button href={`tel:${businessPhone}`} variant="primary">Contacter un technicien</Button>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY / REALIZATIONS SECTION */}
      <section id="realisations" className="section-pad" style={{ backgroundColor: C.bg }}>
        <div className="container">
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <Reveal>
              <Eyebrow color={C.primary}>Nos Réalisations</Eyebrow>
              <h2 className="title-medium" style={{ color: C.white, marginTop: "1rem" }}>INTERVENTIONS RÉCENTES</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <Button href="#" variant="outline">Voir tout</Button>
            </Reveal>
          </div>

          <div className="grid-3">
            {PHOTO.gallery.map((img, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  cursor: "pointer"
                }}
                className="gallery-item"
                >
                  <style dangerouslySetInnerHTML={{__html:`
                    .gallery-item img { transition: transform 0.5s ease; }
                    .gallery-item:hover img { transform: scale(1.1); }
                    .gallery-item .overlay { opacity: 0; transition: opacity 0.3s ease; }
                    .gallery-item:hover .overlay { opacity: 1; }
                  `}}/>
                  <img src={img} alt={`Réalisation ${idx+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="overlay" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(220, 38, 38, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Plus color={C.white} size={48} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="avis" className="section-pad" style={{ backgroundColor: C.bgDeep, position: "relative", overflow: "hidden" }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", backgroundColor: C.primary, filter: "blur(150px)", opacity: 0.2, borderRadius: "50%", zIndex: 0 }} />
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Reveal>
              <Eyebrow color={C.primary}>Témoignages Clients</Eyebrow>
              <h2 className="title-medium" style={{ color: C.white, marginTop: "1rem" }}>ILS NOUS ONT FAIT CONFIANCE</h2>
            </Reveal>
          </div>

          <div className="grid-3">
            {testimonials.map((testi, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{
                  backgroundColor: C.bgCard,
                  padding: "2rem",
                  borderRadius: "8px",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{ display: "flex", gap: "0.25rem", color: C.accent, marginBottom: "1.5rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < testi.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  
                  <p style={{ fontFamily: SANS, fontSize: "1rem", color: C.text, fontStyle: "italic", lineHeight: 1.6, flexGrow: 1, marginBottom: "2rem" }}>
                    "{testi.content}"
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: C.bgDeep, display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 700, color: C.white, fontSize: "1rem" }}>{testi.name}</div>
                      <div style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted }}>{testi.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section-pad" style={{ backgroundColor: C.bg }}>
        <div className="container">
          <div className="grid-2">
            <div>
              <Reveal>
                <Eyebrow color={C.primary}>Foire Aux Questions</Eyebrow>
                <h2 className="title-medium" style={{ color: C.white, marginTop: "1rem", marginBottom: "1.5rem" }}>
                  QUESTIONS FRÉQUENTES
                </h2>
                <p className="text-body" style={{ marginBottom: "2rem" }}>
                  Vous avez une question concernant nos interventions, nos tarifs ou nos garanties ? Consultez notre FAQ ou contactez-nous directement.
                </p>
                <Button href={`tel:${businessPhone}`} variant="outline" icon={<PhoneCall size={18}/>}>
                  Appeler maintenant
                </Button>
              </Reveal>
            </div>
            
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {FALLBACK_FAQS.map((faq, idx) => {
                  const [isOpen, setIsOpen] = useState(false);
                  return (
                    <Reveal key={idx} delay={idx * 0.1}>
                      <div 
                        style={{
                          backgroundColor: C.bgCard,
                          border: `1px solid rgba(255,255,255,0.05)`,
                          borderRadius: "4px",
                          overflow: "hidden"
                        }}
                      >
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          style={{
                            width: "100%",
                            padding: "1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "none",
                            border: "none",
                            color: C.white,
                            fontFamily: SANS,
                            fontWeight: 600,
                            fontSize: "1rem",
                            textAlign: "left",
                            cursor: "pointer"
                          }}
                        >
                          {faq.question}
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                            <ChevronDown size={20} color={C.primary} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", color: C.textMuted, fontFamily: SANS, lineHeight: 1.6 }}>
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT SECTION */}
      <section id="contact" className="section-pad" style={{ backgroundColor: C.primary, position: "relative" }}>
         <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${PHOTO.pipe})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          mixBlendMode: "multiply",
          zIndex: 0
        }}/>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid-2" style={{ alignItems: "center" }}>
            
            <div>
              <Reveal>
                <h2 className="title-large" style={{ color: C.white, marginBottom: "1.5rem" }}>
                  BESOIN D'UNE INTERVENTION URGENTE ?
                </h2>
                <p style={{ fontFamily: SANS, fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem" }}>
                  Nos techniciens sont prêts à intervenir 24h/24 et 7j/7. N'attendez pas que les dégâts s'aggravent.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: C.white, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>
                      <PhoneCall size={24} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>Téléphone Urgence</div>
                      <a href={`tel:${businessPhone}`} style={{ fontFamily: SERIF, fontSize: "2rem", fontWeight: 700, color: C.white }}>{businessPhone}</a>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>Zone d'intervention</div>
                      <div style={{ fontFamily: SANS, fontSize: "1.125rem", fontWeight: 600, color: C.white }}>{businessCity} et 30km aux alentours</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal delay={0.2}>
                <div style={{ backgroundColor: C.bgCard, padding: "3rem", borderRadius: "8px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: "2rem", color: C.white, marginBottom: "2rem", textAlign: "center" }}>DEMANDER UN DEVIS</h3>
                  <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <input 
                      type="text" 
                      placeholder="Nom complet" 
                      style={{ width: "100%", padding: "1rem", backgroundColor: C.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "4px", color: C.white, fontFamily: SANS, fontSize: "1rem" }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Téléphone" 
                      style={{ width: "100%", padding: "1rem", backgroundColor: C.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "4px", color: C.white, fontFamily: SANS, fontSize: "1rem" }}
                    />
                    <select 
                      style={{ width: "100%", padding: "1rem", backgroundColor: C.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "4px", color: C.white, fontFamily: SANS, fontSize: "1rem", appearance: "none" }}
                    >
                      <option value="">Type de problème...</option>
                      <option value="fuite">Fuite d'eau</option>
                      <option value="debouchage">Débouchage canalisation</option>
                      <option value="chauffe_eau">Panne chauffe-eau</option>
                      <option value="autre">Autre intervention</option>
                    </select>
                    <textarea 
                      placeholder="Description brève de la situation..." 
                      rows={4}
                      style={{ width: "100%", padding: "1rem", backgroundColor: C.bgDeep, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "4px", color: C.white, fontFamily: SANS, fontSize: "1rem", resize: "vertical" }}
                    />
                    <button type="submit" style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: C.primary,
                      color: C.white,
                      border: "none",
                      borderRadius: "4px",
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = C.primaryDark}
                    onMouseOut={e => e.target.style.backgroundColor = C.primary}
                    >
                      Envoyer la demande
                    </button>
                  </form>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: C.bgDeep, paddingTop: "4rem", paddingBottom: "2rem", borderTop: `1px solid rgba(255,255,255,0.05)` }}>
        <div className="container">
          <div className="grid-4" style={{ marginBottom: "4rem" }}>
            
            {/* Column 1 */}
            <div>
               <a href="#" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                marginBottom: "1.5rem"
              }}>
                <div style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: C.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transform: "rotate(-10deg)"
                }}>
                  <Wrench color={C.white} size={18} />
                </div>
                <span style={{
                  fontFamily: SERIF,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  {businessName.split(" ").slice(0,2).join(" ")}
                  <span style={{ color: C.primary, fontSize: "0.75rem" }}>{businessName.split(" ").slice(2).join(" ")}</span>
                </span>
              </a>
              <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Spécialistes du dépannage d'urgence en plomberie. Intervention rapide 24h/24 et 7j/7 pour particuliers et professionnels.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="#" style={{ color: C.textMuted, transition: "color 0.3s ease" }} onMouseOver={e=>e.target.style.color=C.primary} onMouseOut={e=>e.target.style.color=C.textMuted}>
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "1.125rem", color: C.white, marginBottom: "1.5rem", fontWeight: 700 }}>Interventions</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["Recherche de fuites", "Débouchage WC & canalisations", "Réparation chauffe-eau", "Remplacement robinetterie", "Dégât des eaux"].map((item, i) => (
                  <li key={i}>
                    <a href="#" style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, textDecoration: "none", transition: "color 0.3s ease", display: "flex", alignItems: "center", gap: "0.5rem" }}
                       onMouseOver={e=>{e.target.style.color=C.primary; e.target.style.paddingLeft="5px"}} 
                       onMouseOut={e=>{e.target.style.color=C.textMuted; e.target.style.paddingLeft="0px"}}
                    >
                      <ChevronRight size={14} /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "1.125rem", color: C.white, marginBottom: "1.5rem", fontWeight: 700 }}>Liens utiles</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["À propos de nous", "Demander un devis", "Tarifs des interventions", "Mentions légales", "Politique de confidentialité"].map((item, i) => (
                  <li key={i}>
                    <a href="#" style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, textDecoration: "none", transition: "color 0.3s ease", display: "flex", alignItems: "center", gap: "0.5rem" }}
                       onMouseOver={e=>{e.target.style.color=C.primary; e.target.style.paddingLeft="5px"}} 
                       onMouseOut={e=>{e.target.style.color=C.textMuted; e.target.style.paddingLeft="0px"}}
                    >
                      <ChevronRight size={14} /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "1.125rem", color: C.white, marginBottom: "1.5rem", fontWeight: 700 }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <MapPin size={18} color={C.primary} style={{ marginTop: "0.25rem" }} />
                  <span style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.5 }}>
                    Intervention sur {businessCity}<br />et agglomération
                  </span>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <PhoneCall size={18} color={C.primary} />
                  <a href={`tel:${businessPhone}`} style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.white, textDecoration: "none", fontWeight: 600 }}>
                    {businessPhone}
                  </a>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <Mail size={18} color={C.primary} />
                  <a href={`mailto:${businessEmail}`} style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted, textDecoration: "none" }}>
                    {businessEmail}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div style={{
            borderTop: `1px solid rgba(255,255,255,0.05)`,
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted }}>
              &copy; {new Date().getFullYear()} {businessName}. Tous droits réservés.
            </p>
            <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: C.textMuted }}>
              Propulsé par <span style={{ color: C.white, fontWeight: 600 }}>AeviaLaunch</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
