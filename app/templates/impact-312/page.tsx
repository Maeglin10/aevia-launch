"use client";
// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Shield,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Settings,
  PenTool,
  Layers,
  Zap,
  Info,
  MessageSquare,
  Briefcase,
  Users,
  Heart,
  Camera,
  Globe,
  Search,
  Award
} from "lucide-react";
const Facebook = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Twitter = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Instagram = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);

/*
  Template Name: Garage Minimalist (Garage - Light Clean)
  Description: Clean, modern, trustworthy workshop
  Fonts: Plus Jakarta Sans, Inter
  Colors: Pure white (#ffffff), Gray (#f4f4f5), graphite, orange accent (#f97316)
  Credits: Aevia Launch
*/

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;
  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  return "#"+RR+GG+BB;
}

const defaultPrimary = "#f97316";

const C = {
  primary: defaultPrimary,
  primaryLight: shadeColor(defaultPrimary, 40),
  primaryDark: shadeColor(defaultPrimary, -40),
  bg: "#ffffff",
  bgDeep: "#f4f4f5",
  bgCard: "#ffffff",
  text: "#1a1a1a",
  textMuted: "#666666",
  accent: "#f97316",
  white: "#ffffff",
  black: "#000000",
  graphite: "#27272a"
};

const SANS = "'Plus Jakarta Sans', sans-serif";
const SERIF = "'Inter', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop",
  services: [
    "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590226462491-a128e47bf0aa?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598007787383-8a306c599187?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503375751996-5e003058866e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520113412547-81498fc7183e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501066927591-314112b5eaed?q=80&w=800&auto=format&fit=crop"
  ],
  about: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=1200&auto=format&fit=crop",
  cta: "https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=1500&auto=format&fit=crop",
  stats: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop"
};

const CustomInstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Reveal = ({ children, delay = 0, y = 30, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Eyebrow = ({ children, className = "" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }} className={className}>
    <span style={{ width: "30px", height: "2px", backgroundColor: C.primary, display: "block" }}></span>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.primary }}>
      {children}
    </span>
  </div>
);

const Button = ({ children, variant = "primary", onClick, href, className = "", icon = null }) => {
  const isPrimary = variant === "primary";
  const Element = href ? "a" : "button";
  
  return (
    <Element
      href={href}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1rem 2rem",
        borderRadius: "0",
        backgroundColor: isPrimary ? C.primary : "transparent",
        color: isPrimary ? C.white : C.text,
        border: `1px solid ${isPrimary ? C.primary : C.text}`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      className={`btn-hover ${className}`}
      onMouseOver={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = C.primaryDark;
          e.currentTarget.style.borderColor = C.primaryDark;
        } else {
          e.currentTarget.style.backgroundColor = C.text;
          e.currentTarget.style.color = C.white;
        }
      }}
      onMouseOut={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = C.primary;
          e.currentTarget.style.borderColor = C.primary;
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = C.text;
        }
      }}
    >
      {children}
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
    </Element>
  );
};

export default function GarageMinimalistTemplate() {
  const [session, setSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [stats, setStats] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Standard session loading (matches every other template): the wizard
  // links here as /templates/impact-312?session=<id>, not via localStorage.
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

  useEffect(() => {
    let savedSession = null;
    try {
      const stored = localStorage.getItem("builder_session");
      if (stored) {
        savedSession = JSON.parse(stored);
        setSession(savedSession);
      }
    } catch (err) {}

    const fd = savedSession?.formData || {};
    const c = savedSession?.generatedContent || {};

    if (fd.brandColor) {
      C.primary = fd.brandColor;
      C.primaryLight = shadeColor(fd.brandColor, 40);
      C.primaryDark = shadeColor(fd.brandColor, -40);
      C.accent = fd.brandColor;
    }

    setTestimonials(c.testimonials || [
      { name: "Jean Dupont", role: "Propriétaire de BMW", content: "Un service irréprochable. Mon véhicule a été pris en charge rapidement et les réparations sont parfaites. Le garage est d'une propreté incroyable.", rating: 5 },
      { name: "Marie Laurent", role: "Cliente régulière", content: "Transparence totale sur les prix et les interventions. Je recommande ce garage les yeux fermés pour leur professionnalisme et leur honnêteté.", rating: 5 },
      { name: "Paul Martin", role: "Flotte d'entreprise", content: "Nous confions toute notre flotte à ce garage. Leur réactivité et leur expertise nous permettent de ne jamais avoir de véhicules immobilisés trop longtemps.", rating: 5 }
    ]);

    setServices(c.services || [
      { title: "Révision Complète", description: "Entretien périodique selon les préconisations du constructeur avec garantie préservée.", icon: <Wrench size={24} /> },
      { title: "Diagnostic Électronique", description: "Recherche de pannes complexes avec matériel de pointe multimarque.", icon: <Zap size={24} /> },
      { title: "Freinage & Sécurité", description: "Contrôle et remplacement des disques, plaquettes et liquide de frein.", icon: <Shield size={24} /> },
      { title: "Climatisation", description: "Recharge, nettoyage et réparation du circuit de climatisation.", icon: <Settings size={24} /> }
    ]);

    setFaqs(c.faqs || [
      { q: "Proposez-vous un véhicule de prêt ?", a: "Oui, nous mettons à votre disposition des véhicules de courtoisie récents pendant toute la durée des réparations, sur réservation." },
      { q: "Quels sont vos délais d'intervention ?", a: "Pour l'entretien courant, nous pouvons généralement vous recevoir sous 48h. Pour les réparations plus complexes, le délai dépend de la disponibilité des pièces." },
      { q: "Les devis sont-ils gratuits ?", a: "Nos devis sont 100% gratuits et sans engagement. Aucune réparation n'est effectuée sans votre accord préalable." },
      { q: "Quelles marques prenez-vous en charge ?", a: "Notre équipement nous permet d'intervenir sur la quasi-totalité des marques européennes et asiatiques." },
      { q: "Garantissez-vous vos interventions ?", a: "Toutes nos pièces et mains d'œuvre sont garanties au minimum 1 an. Nous n'utilisons que des pièces de qualité d'origine." }
    ]);

    setFeatures(c.features || [
      { title: "Transparence Totale", desc: "Explications claires et devis détaillé avant chaque intervention." },
      { title: "Pièces d'Origine", desc: "Utilisation exclusive de pièces certifiées pour préserver votre garantie." },
      { title: "Équipe Qualifiée", desc: "Techniciens formés en continu aux nouvelles technologies." },
      { title: "Éco-Responsable", desc: "Recyclage à 100% de nos déchets (huiles, filtres, batteries)." }
    ]);

    setStats([
      { value: "15+", label: "Années d'expérience" },
      { value: "2000+", label: "Clients satisfaits" },
      { value: "5", label: "Mécaniciens experts" },
      { value: "100%", label: "Transparence" }
    ]);

    setGallery(PHOTO.gallery);

  }, []);

  const fd = session?.formData || {};
  const businessName = fd.businessName || "Garage Minimalist";
  const phone = fd.phone || "01 23 45 67 89";
  const email = fd.email || "contact@garageminimalist.fr";
  const address = fd.location || "123 Avenue de l'Automobile, 75000 Paris";

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero shot and about-section image first.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) PHOTO.hero = p[0];
    if (p[1]) PHOTO.about = p[1];
    if (p[2]) PHOTO.cta = p[2];
    if (p[3]) PHOTO.stats = p[3];
    for (let i = 4; i < p.length && i - 4 < PHOTO.gallery.length; i++) {
      if (p[i]) PHOTO.gallery[i - 4] = p[i];
    }
  }, [fd]);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Styles globals
  const sectionStyle = {
    padding: "8rem 5%",
    backgroundColor: C.bg,
    color: C.text,
    position: "relative",
    overflow: "hidden"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 10
  };

  return (
    <div style={{ fontFamily: SERIF, backgroundColor: C.bg, color: C.text, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        h1, h2, h3, h4, h5, h6 { font-family: ${SANS}; margin-top: 0; }
        p { line-height: 1.7; color: ${C.textMuted}; margin-top: 0; }
        .grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 2rem; }
        .grid-auto-sm { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr)); gap: 1.5rem; }
        
        .nav-link { position: relative; color: ${C.text}; text-decoration: none; font-family: ${SANS}; font-weight: 500; font-size: 0.95rem; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background-color: ${C.primary}; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        
        .image-hover-zoom { overflow: hidden; }
        .image-hover-zoom img { transition: transform 0.7s ease; }
        .image-hover-zoom:hover img { transform: scale(1.05); }
        
        .faq-btn { width: 100%; text-align: left; background: none; border: none; border-bottom: 1px solid #e5e7eb; padding: 1.5rem 0; font-family: ${SANS}; font-weight: 600; font-size: 1.1rem; color: ${C.text}; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: color 0.3s; }
        .faq-btn:hover { color: ${C.primary}; }
        
        .contact-input { width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #e5e7eb; background: ${C.bgDeep}; font-family: ${SERIF}; font-size: 1rem; transition: border-color 0.3s; }
        .contact-input:focus { outline: none; border-color: ${C.primary}; }
        
        @media (max-width: 768px) {
          .mobile-menu-open { overflow: hidden; }
          .hero-title { font-size: clamp(2.5rem, 8vw, 3.5rem) !important; }
          section { padding: 4rem 5% !important; }
        }
      `}} />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #f4f4f5",
        padding: "1rem 5%",
        display: "flex", justifyContent: "space-between", alignItems: "center"
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
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: "1.5rem", color: C.graphite, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: C.primary, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
              <Wrench size={18} />
            </div>
            {businessName}
          </div>
        )}

        {/* Desktop Menu */}
        <div style={{ display: "none", gap: "2.5rem", alignItems: "center" }} className="desktop-menu">
          <style>{`@media(min-width: 992px) { .desktop-menu { display: flex !important; } }`}</style>
          <a href="#services" className="nav-link">Services</a>
          <a href="#why-us" className="nav-link">Pourquoi Nous</a>
          <a href="#gallery" className="nav-link">Réalisations</a>
          <a href="#testimonials" className="nav-link">Avis</a>
          <Button href="#contact" variant="primary">Prendre RDV</Button>
        </div>

        {/* Mobile Toggle */}
        <div style={{ display: "block" }} className="mobile-toggle">
          <style>{`@media(min-width: 992px) { .mobile-toggle { display: none !important; } }`}</style>
          <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text }}>
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "400px",
              backgroundColor: C.white, zIndex: 1000, padding: "2rem",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: "1.25rem" }}>Menu</div>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text }}>
                <X size={32} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", color: C.text, fontSize: "1.25rem", fontFamily: SANS, fontWeight: 600 }}>Services</a>
              <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", color: C.text, fontSize: "1.25rem", fontFamily: SANS, fontWeight: 600 }}>Pourquoi Nous</a>
              <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", color: C.text, fontSize: "1.25rem", fontFamily: SANS, fontWeight: 600 }}>Réalisations</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", color: C.text, fontSize: "1.25rem", fontFamily: SANS, fontWeight: 600 }}>Avis Clients</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", color: C.text, fontSize: "1.25rem", fontFamily: SANS, fontWeight: 600 }}>FAQ</a>
            </div>

            <div style={{ marginTop: "auto" }}>
              <Button href="#contact" variant="primary" style={{ width: "100%" }} onClick={() => setIsMobileMenuOpen(false)}>
                Prendre Rendez-vous
              </Button>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", color: C.textMuted }}>
                <a href="#" style={{ color: "inherit" }}><Instagram size={24} /></a>
                <a href="#" style={{ color: "inherit" }}><Facebook size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
        />
      )}

      {/* HERO SECTION */}
      <section style={{ 
        position: "relative", 
        height: "100vh", 
        minHeight: "700px",
        display: "flex", 
        alignItems: "center",
        paddingTop: "5rem", // offset for navbar
        overflow: "hidden"
      }}>
        {/* BG Image */}
        <motion.div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
          y: heroY, opacity: heroOpacity
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(255,255,255,0.85)", zIndex: 2
          }} />
          <img src={PHOTO.hero} alt="Garage hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        <div style={{ ...containerStyle, zIndex: 10, width: "100%" }}>
          <div style={{ maxWidth: "800px" }}>
            <Reveal>
              <Eyebrow>Excellence Mécanique</Eyebrow>
              <h1 className="hero-title" style={{ 
                fontSize: "clamp(3rem, 6vw, 4.5rem)", 
                fontWeight: 800, 
                lineHeight: 1.1, 
                color: C.graphite,
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em"
              }}>
                L'entretien automobile <span style={{ color: C.primary, fontStyle: "italic" }}>réinventé.</span>
              </h1>
            </Reveal>
            
            <Reveal delay={0.2}>
              <p style={{ fontSize: "1.25rem", maxWidth: "600px", marginBottom: "2.5rem", color: C.textMuted }}>
                Un service transparent, des techniciens experts et un atelier moderne pour prendre soin de votre véhicule dans les meilleures conditions.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button href="#contact" variant="primary" icon={<ArrowRight size={20} />}>
                  Devis Gratuit
                </Button>
                <Button href="#services" variant="outline">
                  Nos Services
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div style={{ marginTop: "4rem", display: "flex", alignItems: "center", gap: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ display: "flex", color: "#f59e0b" }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.9rem" }}>
                    4.9/5 <span style={{ color: C.textMuted, fontWeight: 400 }}>(200+ avis)</span>
                  </div>
                </div>
                <div style={{ width: "1px", height: "30px", backgroundColor: "#e5e7eb" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontFamily: SANS, fontSize: "0.9rem", fontWeight: 600 }}>
                  <CheckCircle2 size={20} color={C.primary} />
                  Garanti 1 an
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ backgroundColor: C.graphite, padding: "4rem 5%", color: C.white }}>
        <div style={containerStyle}>
          <div className="grid-auto-sm">
            {stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ borderLeft: `2px solid ${C.primary}`, paddingLeft: "1.5rem" }}>
                  <div style={{ fontFamily: SANS, fontSize: "3rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.5rem" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: SERIF, color: "#a1a1aa", fontSize: "1rem" }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" style={{ ...sectionStyle, backgroundColor: C.bgDeep }}>
        <div style={containerStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "4rem" }}>
            <Reveal>
              <Eyebrow>Nos Prestations</Eyebrow>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: C.graphite }}>Expertise Multimarque</h2>
              <p style={{ maxWidth: "600px", margin: "1rem auto 0" }}>
                De l'entretien courant aux réparations complexes, notre atelier est équipé pour répondre à tous vos besoins avec précision et transparence.
              </p>
            </Reveal>
          </div>

          <div className="grid-auto">
            {services.map((service, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ 
                  backgroundColor: C.bgCard, 
                  padding: "2.5rem", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; }}
                >
                  <div style={{ width: "60px", height: "60px", backgroundColor: C.primaryLight, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", marginBottom: "1.5rem" }}>
                    {service.icon || <Wrench size={30} />}
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>{service.title}</h3>
                  <p style={{ fontSize: "0.95rem", marginBottom: "1.5rem" }}>{service.description}</p>
                  
                  <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: C.primary, textDecoration: "none", fontFamily: SANS, fontWeight: 600, fontSize: "0.9rem" }}>
                    Demander un devis <ChevronRight size={16} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "4rem", alignItems: "center" }}>
            
            <Reveal>
              <div style={{ position: "relative" }}>
                <img src={PHOTO.about} alt="Atelier moderne" style={{ width: "100%", borderRadius: "8px", objectFit: "cover", height: "500px" }} />
                <div style={{ position: "absolute", bottom: "-2rem", right: "-2rem", backgroundColor: C.primary, padding: "2rem", borderRadius: "8px", color: C.white, maxWidth: "250px" }}>
                  <div style={{ fontFamily: SANS, fontSize: "3rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.5rem" }}>100%</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>de transparence sur nos interventions et tarifs.</div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>La Différence</Eyebrow>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: C.graphite, marginBottom: "1.5rem" }}>
                  Pourquoi choisir notre garage ?
                </h2>
                <p style={{ marginBottom: "2.5rem" }}>
                  Nous avons repensé l'expérience du garage automobile. Fini l'opacité, les devis incompréhensibles et l'attente interminable. Nous vous offrons un service moderne, clair et efficace.
                </p>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {features.map((feat, idx) => (
                  <Reveal key={idx} delay={0.2 + (idx * 0.1)}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <div style={{ marginTop: "0.25rem", color: C.primary }}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SANS, fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{feat.title}</h4>
                        <p style={{ fontSize: "0.95rem", margin: 0 }}>{feat.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY / REALIZATIONS */}
      <section id="gallery" style={{ ...sectionStyle, padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0" }}>
          {gallery.slice(0, 4).map((img, idx) => (
            <Reveal key={idx} delay={idx * 0.1} className="image-hover-zoom" style={{ height: "350px", width: "100%", position: "relative" }}>
              <img src={img} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", opacity: 0, transition: "opacity 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseOver={e => e.currentTarget.style.opacity = 1}
                onMouseOut={e => e.currentTarget.style.opacity = 0}
              >
                <div style={{ width: "50px", height: "50px", backgroundColor: C.primary, color: C.white, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Instagram size={24} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ ...sectionStyle, backgroundColor: C.bgDeep }}>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Reveal>
              <Eyebrow>Témoignages</Eyebrow>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: C.graphite }}>Ce que disent nos clients</h2>
            </Reveal>
          </div>

          <div className="grid-auto">
            {testimonials.map((test, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ backgroundColor: C.bgCard, padding: "2.5rem", borderRadius: "8px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", color: "#f59e0b", marginBottom: "1rem" }}>
                    {[...Array(test.rating || 5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p style={{ fontSize: "1rem", color: C.text, flexGrow: 1, fontStyle: "italic", marginBottom: "2rem" }}>
                    "{test.content}"
                  </p>
                  <div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem" }}>{test.name}</div>
                    <div style={{ fontSize: "0.85rem", color: C.textMuted }}>{test.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Reveal>
              <Eyebrow>Notre Méthodologie</Eyebrow>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: C.graphite }}>Simple. Rapide. Transparent.</h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "40px", left: "10%", right: "10%", height: "2px", backgroundColor: "#e5e7eb", zIndex: 0, display: "none" }} className="process-line">
              <style>{`@media(min-width: 768px) { .process-line { display: block !important; } }`}</style>
            </div>
            
            {[
              { num: "01", title: "Prise de RDV", desc: "Contactez-nous ou réservez en ligne pour choisir votre créneau." },
              { num: "02", title: "Diagnostic", desc: "Nos experts examinent votre véhicule et établissent un devis gratuit." },
              { num: "03", title: "Validation", desc: "Aucune intervention n'est réalisée sans votre accord formel." },
              { num: "04", title: "Récupération", desc: "Repartez avec un véhicule fiable, propre et sous garantie." }
            ].map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.1} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: C.white, border: `2px solid ${C.primary}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: "1.5rem", fontWeight: 800, color: C.primary, margin: "0 auto 1.5rem" }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ fontSize: "0.95rem" }}>{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...sectionStyle, backgroundColor: C.bgDeep }}>
        <div style={containerStyle}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
              <Eyebrow>Questions Fréquentes</Eyebrow>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: C.graphite }}>Vos questions, nos réponses</h2>
            </Reveal>

            <div style={{ backgroundColor: C.bgCard, padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ borderBottom: idx !== faqs.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                  <button
                    className="faq-btn"
                    style={{ borderBottom: "none" }}
                    onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: activeFaq === idx ? 180 : 0 }}>
                      <ChevronRight size={20} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ paddingBottom: "1.5rem", margin: 0, fontSize: "0.95rem" }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA SECTION */}
      <section id="contact" style={{ padding: 0, position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          
          <div style={{ flex: "1 1 50%", padding: "6rem 5%", backgroundColor: C.graphite, color: C.white, display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "500px", width: "100%" }}>
              <Reveal>
                <Eyebrow>Contactez-nous</Eyebrow>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.5rem", color: C.white }}>Prendre rendez-vous</h2>
                <p style={{ color: "#a1a1aa", marginBottom: "3rem" }}>
                  Remplissez le formulaire ci-dessous ou contactez-nous directement. Nous vous répondrons dans les plus brefs délais pour confirmer votre rendez-vous.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <form onSubmit={e => e.preventDefault()}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input type="text" placeholder="Nom" className="contact-input" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.white }} />
                    <input type="text" placeholder="Prénom" className="contact-input" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.white }} />
                  </div>
                  <input type="email" placeholder="Email" className="contact-input" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.white }} />
                  <input type="tel" placeholder="Téléphone" className="contact-input" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.white }} />
                  <textarea placeholder="Décrivez votre besoin (Modèle de voiture, problème rencontré...)" className="contact-input" rows="4" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.white, resize: "vertical" }}></textarea>
                  <Button variant="primary" style={{ width: "100%" }}>Envoyer la demande</Button>
                </form>
              </Reveal>
            </div>
          </div>

          <div style={{ flex: "1 1 50%", padding: "6rem 5%", backgroundColor: C.bgCard, display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "500px", width: "100%" }}>
              <Reveal>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem", color: C.graphite }}>Nos Coordonnées</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ color: C.primary, marginTop: "0.25rem" }}><MapPin size={24} /></div>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem" }}>Adresse</div>
                      <div style={{ color: C.textMuted }}>{address}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ color: C.primary, marginTop: "0.25rem" }}><Phone size={24} /></div>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem" }}>Téléphone</div>
                      <div style={{ color: C.textMuted }}>{phone}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ color: C.primary, marginTop: "0.25rem" }}><Mail size={24} /></div>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem" }}>Email</div>
                      <div style={{ color: C.textMuted }}>{email}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ color: C.primary, marginTop: "0.25rem" }}><Clock size={24} /></div>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem" }}>Horaires</div>
                      <div style={{ color: C.textMuted }}>Lun-Ven: 08:00 - 18:30<br/>Samedi: 09:00 - 12:30</div>
                    </div>
                  </div>
                </div>

                <div style={{ width: "100%", height: "250px", backgroundColor: "#e5e7eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}>
                  <MapPin size={48} opacity={0.5} />
                  <span style={{ marginLeft: "1rem", fontFamily: SANS }}>Carte Interactive (Google Maps)</span>
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#111827", color: "#f3f4f6", padding: "4rem 5% 2rem", fontFamily: SERIF }}>
        <div style={{ ...containerStyle, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "3rem", marginBottom: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
            
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: "1.5rem", color: C.white, display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: C.primary, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                  <Wrench size={18} />
                </div>
                {businessName}
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                L'expertise mécanique à votre service. Transparence, qualité et satisfaction garantie pour l'entretien et la réparation de votre véhicule.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="#" style={{ color: "#9ca3af", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}><Facebook size={20} /></a>
                <a href="#" style={{ color: "#9ca3af", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}><CustomInstagramIcon size={20} /></a>
                <a href="#" style={{ color: "#9ca3af", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}><Twitter size={20} /></a>
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", color: C.white }}>Navigation</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><a href="#services" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Nos Services</a></li>
                <li><a href="#why-us" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Pourquoi Nous</a></li>
                <li><a href="#gallery" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Réalisations</a></li>
                <li><a href="#faq" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", color: C.white }}>Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Révision Auto</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Diagnostic</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Freinage</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Climatisation</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", color: C.white }}>Légal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Mentions Légales</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>Politique de Confidentialité</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }} onMouseOver={e=>e.currentTarget.style.color=C.primary} onMouseOut={e=>e.currentTarget.style.color="#9ca3af"}>CGV</a></li>
              </ul>
            </div>

          </div>
        </div>
        
        <div style={{ ...containerStyle, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            &copy; {new Date().getFullYear()} {businessName}. Tous droits réservés.
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Fait avec passion par Aevia Launch
          </div>
        </div>
      </footer>
    </div>
  );
}
