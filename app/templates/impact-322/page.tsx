"use client";
// @ts-nocheck
/*
 * -------------------------------------------------------------------
 * BUSINESS NAME: Agence Prestige (Impact-322)
 * DESCRIPTION: Luxury corporate events agency vitrine.
 * FEEL: Gala, prestige, high-end events, dark mode.
 * PRIMARY FONT: Playfair Display
 * SECONDARY FONT: Montserrat
 * PRIMARY COLOR: Champagne Gold (#c5a880)
 * BACKGROUND: Carbon Black (#121212)
 * CREDITS: AeviaLaunch
 * -------------------------------------------------------------------
 */

import React, { useRef, useState, useEffect, FormEvent } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Check,
  Menu,
  X,
  Star,
  Quote,
  ChevronDown,
  Calendar,
  Users,
  Award,
  Globe,
  Camera,
  Music,
  Wine,
  Sparkles,
  Building,
  GlassWater,
  Briefcase
} from "lucide-react";
const Instagram = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Linkedin = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);

// --- HELPERS ---
function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(`${(R * (100 + percent)) / 100}`);
  G = parseInt(`${(G * (100 + percent)) / 100}`);
  B = parseInt(`${(B * (100 + percent)) / 100}`);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

// --- CONSTANTS ---
const SERIF = "'Playfair Display', serif";
const SANS = "'Montserrat', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const DEFAULT_BRAND_COLOR = "#c5a880";

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2070", // Elegant venue
  about: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=2070", // Event planning
  service1: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=2065", // Gala
  service2: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070", // Conference
  service3: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2098", // Fine dining
  gallery1: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=2070",
  gallery2: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=2070",
  gallery3: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070",
  gallery4: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=2070",
  gallery5: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2070",
  gallery6: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069"
};

// --- COMPONENTS ---

const Reveal = ({ children, delay = 0, y = 30, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Button = ({ children, primary = true, onClick, className = "", style = {}, C }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-8 py-4 uppercase tracking-widest text-xs font-semibold rounded-none transition-all duration-300 flex items-center justify-center gap-3 ${className}`}
      style={{
        fontFamily: SANS,
        backgroundColor: primary ? C.primary : 'transparent',
        color: primary ? C.black : C.primary,
        border: `1px solid ${primary ? C.primary : C.primary}`,
        ...style
      }}
    >
      {children}
      <ArrowRight size={14} />
    </motion.button>
  );
};

const Eyebrow = ({ text, C, className = "" }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div style={{ width: '40px', height: '1px', backgroundColor: C.primary }} />
    <span 
      style={{ fontFamily: SANS, color: C.primary, letterSpacing: '0.2em' }}
      className="uppercase text-xs font-semibold"
    >
      {text}
    </span>
  </div>
);

// --- MAIN TEMPLATE ---

export default function Impact322() {
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    // Simulate fetching session
    const fetchSession = () => {
      try {
        const stored = sessionStorage.getItem("app_session");
        if (stored) {
          setSession(JSON.parse(stored));
        }
      } catch (e) {
        console.error("No session found");
      }
    };
    fetchSession();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  const brandColor = fd?.brandColor || DEFAULT_BRAND_COLOR;
  
  const C = {
    primary: brandColor,
    primaryLight: shadeColor(brandColor, 20),
    primaryDark: shadeColor(brandColor, -20),
    bg: "#121212",
    bgDeep: "#0a0a0a",
    bgCard: "#1a1a1a",
    text: "#ffffff",
    textMuted: "#a0a0a0",
    accent: "#f4f4f4",
    white: "#ffffff",
    black: "#000000",
  };

  const services = c?.services || [
    {
      title: "Galas & Réceptions",
      description: "Organisation sur mesure d'événements prestigieux. Du choix du lieu d'exception à la scénographie, nous créons des soirées inoubliables pour vos invités de marque.",
      icon: <GlassWater size={32} />
    },
    {
      title: "Lancements de Produits",
      description: "Des mises en scène spectaculaires pour révéler vos nouveautés. Nous concevons des expériences immersives qui marquent les esprits et subliment votre marque.",
      icon: <Sparkles size={32} />
    },
    {
      title: "Séminaires Haut de Gamme",
      description: "Des retraites professionnelles alliant travail et raffinement. Retrouvez cohésion et inspiration dans des cadres exclusifs et confidentiels.",
      icon: <Briefcase size={32} />
    }
  ];

  const testimonials = c?.testimonials || [
    {
      name: "Jean-Pierre Laurent",
      role: "Directeur Général, Maison L.",
      content: "Une exécution parfaite pour notre gala annuel. L'attention aux détails et le raffinement de l'organisation ont ébloui nos partenaires internationaux."
    },
    {
      name: "Claire Dubois",
      role: "VP Marketing, TechLuxe",
      content: "Le lancement de notre nouvelle collection a été un succès retentissant. Leur équipe a su capturer l'essence de notre marque avec une élégance rare."
    },
    {
      name: "Marc Antoine",
      role: "CEO, Horizon Groupe",
      content: "Le séminaire de direction organisé à Courchevel restera dans les annales. Un service discret, réactif et d'un professionnalisme absolu."
    }
  ];

  const navLinks = [
    { label: "Accueil", href: "#hero" },
    { label: "L'Agence", href: "#about" },
    { label: "Expertises", href: "#services" },
    { label: "Réalisations", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: SANS, minHeight: "100vh" }} className="overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* HEADER */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b"
        style={{ 
          backgroundColor: scrolled ? 'rgba(18, 18, 18, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderColor: scrolled ? 'rgba(255,255,255,0.05)' : 'transparent',
          paddingTop: scrolled ? '1rem' : '1.5rem',
          paddingBottom: scrolled ? '1rem' : '1.5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex-shrink-0 z-50">
            <span style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 600, color: C.white }}>
              {fd?.businessName || "Agence Prestige"}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="text-sm font-medium tracking-wide transition-colors uppercase"
                style={{ color: C.text }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = C.text}
              >
                {link.label}
              </a>
            ))}
            <Button onClick={() => window.location.href = '#contact'} C={C}>
              Demander une consultation
            </Button>
          </nav>

          <button 
            className="md:hidden z-50 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8"
            style={{ backgroundColor: C.bgDeep }}
          >
            {navLinks.map((link, i) => (
              <a 
                key={i}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl uppercase tracking-widest font-light"
                style={{ fontFamily: SERIF, color: C.white }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src={PHOTOS.hero} 
              alt="Luxury Event" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(18,18,18,0.4), rgba(18,18,18,1))` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, transparent 0%, ${C.bg} 100%)`, opacity: 0.8 }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          <Reveal>
            <span 
              className="inline-block uppercase tracking-[0.3em] text-xs font-semibold mb-6 px-4 py-1 border"
              style={{ color: C.primary, borderColor: 'rgba(197, 168, 128, 0.3)' }}
            >
              L'Art de Recevoir
            </span>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 
              style={{ fontFamily: SERIF, fontSize: 'clamp(40px, 8vw, 90px)', lineHeight: 1.1 }}
              className="mb-8 font-light"
            >
              Créateurs d'Événements <br />
              <span style={{ fontStyle: 'italic', color: C.primary }}>d'Exception</span>
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p 
              className="max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed"
              style={{ color: C.textMuted }}
            >
              {fd?.description || "Nous concevons et orchestrons des moments rares pour les entreprises les plus exigeantes. L'excellence dans chaque détail."}
            </p>
          </Reveal>

          <Reveal delay={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button onClick={() => window.location.href = '#contact'} C={C}>
              Nous Contacter
            </Button>
            <Button primary={false} onClick={() => window.location.href = '#portfolio'} C={C}>
              Découvrir nos réalisations
            </Button>
          </Reveal>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.textMuted }}>Scroll</span>
          <div className="w-[1px] h-12" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <motion.div 
              className="w-full h-1/2" 
              style={{ backgroundColor: C.primary }}
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* CLIENT LOGO STRIP (MARQUEE) */}
      <section className="py-12 border-b border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: C.bgDeep }}>
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <p className="text-center uppercase text-[10px] tracking-[0.3em] mb-8" style={{ color: C.textMuted }}>
            Ils nous font confiance
          </p>
          <div className="flex items-center justify-center gap-12 md:gap-24 opacity-40 grayscale flex-wrap">
            {/* Dummy Logos */}
            {['Chanel', 'LVMH', 'Cartier', 'Dior', 'Rolex'].map((brand, i) => (
              <span key={i} style={{ fontFamily: SERIF }} className="text-2xl font-bold tracking-wider">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="aspect-[4/5] relative z-10 overflow-hidden">
                  <img src={PHOTOS.about} alt="About Us" className="w-full h-full object-cover" />
                </div>
                <div 
                  className="absolute -bottom-8 -right-8 w-2/3 aspect-square z-20 border p-2"
                  style={{ backgroundColor: C.bg, borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <img src={PHOTOS.gallery2} alt="Detail" className="w-full h-full object-cover" />
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow text="Notre Signature" C={C} className="mb-6" />
                <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light mb-8 leading-tight">
                  L'Exigence au service <br />de l'<span style={{ fontStyle: 'italic', color: C.primary }}>Émotion</span>.
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-lg mb-6 font-light leading-relaxed" style={{ color: C.textMuted }}>
                  Depuis plus de 10 ans, notre agence conçoit des événements exclusifs pour les marques prestigieuses et les entreprises ambitieuses. Nous ne faisons pas qu'organiser un événement, nous créons un moment suspendu dans le temps.
                </p>
                <p className="text-lg mb-10 font-light leading-relaxed" style={{ color: C.textMuted }}>
                  Notre approche sur mesure garantit une exécution sans faille, où la créativité rencontre la rigueur. Chaque détail est pensé, chaque instant est chorégraphié.
                </p>
              </Reveal>

              <Reveal delay={0.4} className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div style={{ fontFamily: SERIF, color: C.primary }} className="text-4xl mb-2">150+</div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: C.textMuted }}>Événements Prestigieux</div>
                </div>
                <div>
                  <div style={{ fontFamily: SERIF, color: C.primary }} className="text-4xl mb-2">10</div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: C.textMuted }}>Années d'Excellence</div>
                </div>
              </Reveal>

              <Reveal delay={0.5}>
                <Button primary={false} C={C}>En savoir plus sur l'agence</Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 md:py-32" style={{ backgroundColor: C.bgCard }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <Reveal>
              <Eyebrow text="Nos Expertises" C={C} className="mb-6" />
              <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light">
                Savoir-Faire <span style={{ fontStyle: 'italic', color: C.primary }}>Événementiel</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="max-w-md font-light" style={{ color: C.textMuted }}>
                Des solutions complètes pour répondre aux plus hautes exigences de nos clients corporatifs.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}>
            {services.map((service, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div 
                  className="group relative h-full p-10 border transition-all duration-500 hover:-translate-y-2 flex flex-col"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: C.bg }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-8 transition-colors duration-500"
                    style={{ backgroundColor: 'rgba(197, 168, 128, 0.1)', color: C.primary }}
                  >
                    {service.icon || <Star size={24} />}
                  </div>
                  
                  <h3 style={{ fontFamily: SERIF }} className="text-2xl mb-4 group-hover:text-[#c5a880] transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="font-light mb-8 flex-grow" style={{ color: C.textMuted }}>
                    {service.description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-4 text-xs uppercase tracking-widest font-semibold" style={{ color: C.text }}>
                    <span className="transition-transform group-hover:translate-x-2">Découvrir</span>
                    <ArrowRight size={14} style={{ color: C.primary }} />
                  </div>

                  {/* Hover Accent Line */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: C.primary }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO / GALLERY */}
      <section id="portfolio" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
          <Reveal>
            <Eyebrow text="Portfolio" C={C} className="mb-6 justify-center" />
            <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light">
              Nos Dernières <span style={{ fontStyle: 'italic', color: C.primary }}>Réalisations</span>
            </h2>
          </Reveal>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[PHOTOS.gallery1, PHOTOS.gallery2, PHOTOS.gallery3, PHOTOS.gallery4, PHOTOS.gallery5, PHOTOS.gallery6].map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Gallery ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center p-6">
                    <span className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: C.primary }}>Soirée de Gala</span>
                    <h3 style={{ fontFamily: SERIF }} className="text-2xl text-white">Lancement Collection Hiver</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
          <Button primary={false} C={C}>Voir tout le portfolio</Button>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: C.bgDeep }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ backgroundColor: C.primary }} />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ backgroundColor: C.primaryDark }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <Reveal>
                <Eyebrow text="Pourquoi Nous" C={C} className="mb-6" />
                <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light mb-8">
                  L'Art de <span style={{ fontStyle: 'italic', color: C.primary }}>l'Excellence</span>
                </h2>
                <p className="text-lg font-light mb-12" style={{ color: C.textMuted }}>
                  Nous ne laissons rien au hasard. Chaque étape de la conception à la réalisation est gérée avec une précision chirurgicale et une vision esthétique sans compromis.
                </p>
              </Reveal>

              <div className="space-y-8">
                {[
                  { title: "Réseau Exclusif", desc: "Accès privilégié aux lieux les plus convoités et aux prestataires haut de gamme." },
                  { title: "Design Sur Mesure", desc: "Scénographie et direction artistique pensées spécifiquement pour votre marque." },
                  { title: "Discrétion Absolue", desc: "Confidentialité totale pour vos événements VIP et comités de direction." }
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 0.1} className="flex gap-6">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: C.primary, color: C.primary }}>
                        <Check size={14} />
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: SERIF }} className="text-xl mb-2">{item.title}</h4>
                      <p className="font-light" style={{ color: C.textMuted }}>{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="relative">
              <Reveal>
                <div className="aspect-square relative overflow-hidden">
                  <img src={PHOTOS.service1} alt="Excellence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[20px]" style={{ borderColor: C.bgDeep }} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32" style={{ backgroundColor: C.bg }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
          <Reveal>
            <Eyebrow text="Témoignages" C={C} className="mb-6 justify-center" />
            <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light">
              Mots de nos <span style={{ fontStyle: 'italic', color: C.primary }}>Clients</span>
            </h2>
          </Reveal>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}>
            {testimonials.map((testi, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div 
                  className="p-10 relative flex flex-col h-full"
                  style={{ backgroundColor: C.bgCard }}
                >
                  <Quote size={40} className="absolute top-6 right-6 opacity-10" style={{ color: C.primary }} />
                  
                  <div className="flex text-yellow-500 mb-6 gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  
                  <p className="font-light italic text-lg leading-relaxed mb-8 flex-grow" style={{ color: C.textMuted }}>
                    "{testi.content}"
                  </p>
                  
                  <div className="mt-auto">
                    <p style={{ fontFamily: SERIF }} className="text-xl font-medium">{testi.name}</p>
                    <p className="text-xs uppercase tracking-wider mt-1" style={{ color: C.primary }}>
                      {testi.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 z-0">
          <img src={PHOTOS.service3} alt="Contact Background" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
          <div className="border p-10 md:p-16 flex flex-col md:flex-row gap-16 backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(18,18,18,0.7)' }}>
            
            <div className="flex-1">
              <Reveal>
                <Eyebrow text="Contact" C={C} className="mb-6" />
                <h2 style={{ fontFamily: SERIF }} className="text-4xl md:text-5xl font-light mb-8">
                  Planifions votre <br />
                  <span style={{ fontStyle: 'italic', color: C.primary }}>Événement</span>
                </h2>
                <p className="font-light mb-12" style={{ color: C.textMuted }}>
                  Confiez-nous vos envies, nous en ferons une réalité. Notre équipe est à votre disposition pour une première consultation confidentielle.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Phone style={{ color: C.primary }} size={20} />
                    <span className="font-light">{fd?.contactPhone || "+33 1 23 45 67 89"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail style={{ color: C.primary }} size={20} />
                    <span className="font-light">{fd?.contactEmail || "contact@agence-prestige.com"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin style={{ color: C.primary }} size={20} />
                    <span className="font-light">{fd?.location || "8 Avenue Montaigne, 75008 Paris"}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="flex-1">
              <Reveal delay={0.2}>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>Nom complet</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b py-3 px-0 focus:outline-none focus:border-white transition-colors rounded-none"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', color: C.white }}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>Entreprise</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b py-3 px-0 focus:outline-none focus:border-white transition-colors rounded-none"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', color: C.white }}
                      placeholder="Votre Société"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>Email professionnel</label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border-b py-3 px-0 focus:outline-none focus:border-white transition-colors rounded-none"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', color: C.white }}
                      placeholder="jean@societe.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>Type d'événement</label>
                    <select className="w-full bg-transparent border-b py-3 px-0 focus:outline-none focus:border-white transition-colors appearance-none rounded-none" style={{ borderColor: 'rgba(255,255,255,0.2)', color: C.textMuted }}>
                      <option className="bg-[#121212] text-white">Gala / Soirée</option>
                      <option className="bg-[#121212] text-white">Lancement de produit</option>
                      <option className="bg-[#121212] text-white">Séminaire / Congrès</option>
                      <option className="bg-[#121212] text-white">Autre</option>
                    </select>
                  </div>
                  <Button className="w-full mt-8" C={C}>
                    Envoyer la demande
                  </Button>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-24 pb-12 border-t" style={{ backgroundColor: C.bgDeep, borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="md:col-span-2">
              <span style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 600, color: C.white }} className="block mb-6">
                {fd?.businessName || "Agence Prestige"}
              </span>
              <p className="max-w-sm font-light mb-8 leading-relaxed" style={{ color: C.textMuted }}>
                Créateurs d'événements d'exception pour entreprises prestigieuses. L'art de recevoir à la française.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-white hover:text-black" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-white hover:text-black" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="uppercase tracking-widest text-xs font-semibold mb-6" style={{ color: C.primary }}>Navigation</h4>
              <ul className="space-y-4">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="font-light hover:text-white transition-colors" style={{ color: C.textMuted }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="uppercase tracking-widest text-xs font-semibold mb-6" style={{ color: C.primary }}>Légal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="font-light hover:text-white transition-colors" style={{ color: C.textMuted }}>Mentions Légales</a></li>
                <li><a href="#" className="font-light hover:text-white transition-colors" style={{ color: C.textMuted }}>Politique de confidentialité</a></li>
                <li><a href="#" className="font-light hover:text-white transition-colors" style={{ color: C.textMuted }}>CGV</a></li>
              </ul>
            </div>
            
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-light" style={{ color: C.textMuted }}>
              © {new Date().getFullYear()} {fd?.businessName || "Agence Prestige"}. Tous droits réservés.
            </p>
            <p className="text-xs font-light" style={{ color: C.textMuted }}>
              Design by AeviaLaunch
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
