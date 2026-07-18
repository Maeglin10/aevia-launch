"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Phone, Mail, MapPin, CheckCircle2, ChevronRight, 
  Star, ArrowRight, Droplet, Flame, PenTool, Home, Shield, 
  Clock, ThumbsUp, Wrench, Droplets, ArrowUpRight, Globe, Send, Check, Plus, Minus
} from "lucide-react";

/*
 * BUSINESS NAME: Plomberie & Confort
 * BUSINESS TYPE: Plumber - Light Modern
 * FONTS: Outfit (Display) & Inter (Body)
 * COLORS: Soft Teal (#0d9488), White (#ffffff)
 * FEEL: Modern home renovation, eco-friendly heating, clean aesthetics.
 */

// --- UTILS ---
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

  let RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  let GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  let BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

// --- INSTAGRAM ICON ---
const Camera = ({ size = 24, color = "currentColor", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// --- CONFIG ---
const INITIAL_C = {
  primary: "#0d9488",
  primaryLight: "#14b8a6",
  primaryDark: "#0f766e",
  bg: "#ffffff",
  bgDeep: "#f0fdfa",
  bgCard: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#f59e0b",
  white: "#ffffff",
  black: "#000000",
  border: "#e2e8f0"
};

const SERIF = "'Outfit', sans-serif";
const SANS = "'Inter', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000",
  about: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200",
  service1: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800",
  service2: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
  service3: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
  gallery1: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800",
  gallery2: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
  gallery3: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800",
  gallery4: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
};

// --- COMPONENTS ---

const Reveal = ({ children, delay = 0, y = 30, className = "", style = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const Eyebrow = ({ text, color, style }) => (
  <Reveal>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", ...style }}>
      <div style={{ width: "40px", height: "1px", backgroundColor: color }} />
      <span style={{ 
        fontFamily: SANS, 
        fontWeight: 600, 
        fontSize: "14px", 
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color 
      }}>
        {text}
      </span>
    </div>
  </Reveal>
);

const Button = ({ children, variant = "primary", href = "#", className = "", style = {}, C, onClick }) => {
  const isPrimary = variant === "primary";
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "14px 28px",
        borderRadius: "99px",
        backgroundColor: isPrimary ? C.primary : "transparent",
        color: isPrimary ? C.white : C.primary,
        border: \`2px solid \${C.primary}\`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "16px",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        ...style
      }}
      className={className}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = C.primaryDark;
          e.currentTarget.style.borderColor = C.primaryDark;
        } else {
          e.currentTarget.style.backgroundColor = C.primary;
          e.currentTarget.style.color = C.white;
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.backgroundColor = C.primary;
          e.currentTarget.style.borderColor = C.primary;
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = C.primary;
        }
      }}
    >
      {children}
    </motion.a>
  );
};

// --- MAIN PAGE ---
export default function Page({ session }) {
  const [C, setC] = useState(INITIAL_C);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fd, setFd] = useState(null);
  const [cData, setCData] = useState(null);
  
  // Data lists
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faq, setFaq] = useState([]);
  
  useEffect(() => {
    // Session handling
    if (session) {
      setFd(session.formData);
      setCData(session.generatedContent);
      if (session.formData?.brandColor) {
        const brandColor = session.formData.brandColor;
        setC(prev => ({
          ...prev,
          primary: brandColor,
          primaryLight: shadeColor(brandColor, 20),
          primaryDark: shadeColor(brandColor, -20)
        }));
      }
    }
  }, [session]);

  useEffect(() => {
    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Bind fallback or session data
    const fallbackServices = [
      {
        title: "Dépannage d'urgence",
        description: "Intervention rapide pour fuites, débouchages et pannes de chauffage.",
        icon: "Wrench"
      },
      {
        title: "Installation Sanitaire",
        description: "Rénovation de salle de bain, installation de douches à l'italienne.",
        icon: "Droplets"
      },
      {
        title: "Chauffage & Climatisation",
        description: "Pompes à chaleur, chaudières à condensation, entretien annuel.",
        icon: "Flame"
      },
      {
        title: "Traitement de l'eau",
        description: "Adoucisseurs d'eau et systèmes de filtration performants.",
        icon: "Droplet"
      }
    ];

    const fallbackTestimonials = [
      {
        name: "Jean Dupont",
        role: "Propriétaire",
        text: "Intervention rapide et professionnelle. Le plombier a résolu notre fuite en un rien de temps. Je recommande vivement !",
        rating: 5
      },
      {
        name: "Marie Martin",
        role: "Rénovation",
        text: "Superbe travail pour la rénovation de notre salle de bain. Finitions impeccables et conseils avisés.",
        rating: 5
      },
      {
        name: "Paul Bernard",
        role: "Client régulier",
        text: "Nous faisons appel à Plomberie & Confort pour l'entretien de notre chaudière chaque année. Toujours au top.",
        rating: 5
      }
    ];

    const fallbackFaq = [
      {
        q: "Quels sont vos délais d'intervention pour une urgence ?",
        a: "Nous intervenons généralement dans les 2 heures suivant votre appel pour les urgences absolues (fuite d'eau importante, panne de chauffage en hiver)."
      },
      {
        q: "Proposez-vous des devis gratuits ?",
        a: "Oui, tous nos devis sont 100% gratuits et sans engagement. Nous nous déplaçons pour évaluer les travaux avant toute proposition."
      },
      {
        q: "Êtes-vous certifiés RGE ?",
        a: "Absolument, nous possédons la certification RGE, ce qui vous permet de bénéficier des aides de l'État pour vos travaux de rénovation énergétique."
      },
      {
        q: "Quelles marques installez-vous ?",
        a: "Nous travaillons avec les meilleures marques du marché pour vous garantir fiabilité et durabilité (Atlantic, Viessmann, Grohe, etc.)."
      }
    ];

    setServices(cData?.services || fallbackServices);
    setTestimonials(cData?.testimonials || fallbackTestimonials);
    setFaq(cData?.faq || fallbackFaq);
  }, [cData]);

  // Derived values
  const companyName = fd?.businessName || "Plomberie & Confort";
  const phone = fd?.phone || "01 23 45 67 89";
  const email = fd?.email || "contact@plomberie-confort.fr";
  const address = fd?.address || "15 Rue de la Paix, 75002 Paris";

  const getIcon = (name) => {
    const icons = {
      Wrench: <Wrench size={32} />,
      Droplets: <Droplets size={32} />,
      Flame: <Flame size={32} />,
      Droplet: <Droplet size={32} />
    };
    return icons[name] || <Wrench size={32} />;
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: SANS, overflowX: "hidden" }}>
      {/* HEADER / NAVBAR */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          borderBottom: isScrolled ? \`1px solid \${C.border}\` : "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.3s ease",
          padding: isScrolled ? "16px 0" : "24px 0"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 101 }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              backgroundColor: C.primary, 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: C.white
            }}>
              <Droplets size={24} />
            </div>
            <span style={{ 
              fontFamily: SERIF, 
              fontWeight: 700, 
              fontSize: "20px", 
              color: isScrolled ? C.text : C.white,
              transition: "color 0.3s ease",
              display: "flex",
              alignItems: "center"
            }}>
              {companyName}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: "none", alignItems: "center", gap: "32px", '@media (min-width: 768px)': { display: "flex" } }}>
            {["Services", "À Propos", "Réalisations", "Avis", "Contact"].map((item) => (
              <a 
                key={item}
                href={\`#\${item.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")}\`}
                style={{
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: "15px",
                  color: isScrolled ? C.text : C.white,
                  textDecoration: "none",
                  transition: "opacity 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                {item}
              </a>
            ))}
            <Button variant="primary" C={C} href="#contact" style={{ padding: "10px 24px" }}>
              Devis Gratuit
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            style={{ 
              display: "block", 
              background: "none", 
              border: "none", 
              color: isScrolled ? C.text : C.white,
              cursor: "pointer",
              zIndex: 101
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md-hidden"
          >
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
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: C.white,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px"
            }}
          >
            {["Services", "À Propos", "Réalisations", "Avis", "Contact"].map((item) => (
              <a 
                key={item}
                href={\`#\${item.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")}\`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "24px",
                  color: C.text,
                  textDecoration: "none"
                }}
              >
                {item}
              </a>
            ))}
            <Button variant="primary" C={C} href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ marginTop: "24px" }}>
              Devis Gratuit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* HERO SECTION */}
        <section 
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            paddingTop: "120px", // Responsive padding
            paddingBottom: "80px",
            overflow: "hidden"
          }}
        >
          {/* Background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: 0.6, zIndex: 1 }} />
            <img 
              src={PHOTOS.hero} 
              alt="Plumbing background" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <div style={{ maxWidth: "800px" }}>
              <Reveal>
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(4px)",
                  padding: "8px 16px",
                  borderRadius: "99px",
                  marginBottom: "24px",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: C.primary }} />
                  <span style={{ color: C.white, fontFamily: SANS, fontSize: "14px", fontWeight: 500 }}>
                    Intervention 24/7 sur toute la région
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 style={{ 
                  fontFamily: SERIF, 
                  fontWeight: 700, 
                  fontSize: "clamp(40px, 6vw, 72px)", 
                  color: C.white,
                  lineHeight: 1.1,
                  marginBottom: "24px"
                }}>
                  L'Expertise Sanitaire <br/> & <span style={{ color: C.primary }}>Thermique</span>.
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p style={{ 
                  fontFamily: SANS, 
                  fontSize: "clamp(16px, 2vw, 20px)", 
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  marginBottom: "40px",
                  maxWidth: "600px"
                }}>
                  {fd?.description || "De la rénovation complète de votre salle de bain à l'installation de systèmes de chauffage performants, nous vous accompagnons avec professionnalisme et savoir-faire."}
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <Button variant="primary" C={C} href="#contact">
                    Demander un devis
                    <ArrowRight size={20} />
                  </Button>
                  <Button variant="outline" C={C} href="#services" style={{ color: C.white, borderColor: C.white }}>
                    Nos Services
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "48px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: C.white, fontFamily: SERIF, fontWeight: 700, fontSize: "32px" }}>15+</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: SANS, fontSize: "14px" }}>Années d'expérience</span>
                  </div>
                  <div style={{ width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: C.white, fontFamily: SERIF, fontWeight: 700, fontSize: "32px" }}>500+</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: SANS, fontSize: "14px" }}>Chantiers réalisés</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" style={{ padding: "100px 0", backgroundColor: C.bgDeep }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Eyebrow text="Nos Compétences" color={C.primary} />
              </div>
              <Reveal delay={0.1}>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, marginBottom: "24px" }}>
                  Solutions Complètes
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p style={{ fontFamily: SANS, color: C.textMuted, maxWidth: "600px", margin: "0 auto", fontSize: "18px", lineHeight: 1.6 }}>
                  Des prestations haut de gamme adaptées à vos besoins, réalisées dans les règles de l'art.
                </p>
              </Reveal>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", 
              gap: "32px" 
            }}>
              {services.map((service, idx) => (
                <Reveal key={idx} delay={0.1 * idx}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    style={{
                      backgroundColor: C.bgCard,
                      borderRadius: "24px",
                      padding: "40px 32px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                      border: \`1px solid \${C.border}\`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div style={{ 
                      width: "64px", 
                      height: "64px", 
                      borderRadius: "16px", 
                      backgroundColor: C.bgDeep, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: C.primary,
                      marginBottom: "24px"
                    }}>
                      {getIcon(service.icon)}
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "16px" }}>
                      {service.title}
                    </h3>
                    <p style={{ fontFamily: SANS, color: C.textMuted, lineHeight: 1.6, flexGrow: 1 }}>
                      {service.description}
                    </p>
                    <div style={{ marginTop: "24px", display: "flex", alignItems: "center", color: C.primary, fontWeight: 600, fontSize: "15px", gap: "8px", cursor: "pointer" }}>
                      En savoir plus <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US SECTION */}
        <section id="apropos" style={{ padding: "100px 0", backgroundColor: C.bg }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "64px" }}>
              
              <div style={{ flex: "1 1 500px" }}>
                <Reveal>
                  <div style={{ position: "relative" }}>
                    <div style={{ 
                      position: "absolute", 
                      top: "-20px", 
                      left: "-20px", 
                      width: "200px", 
                      height: "200px", 
                      backgroundColor: C.primaryLight, 
                      borderRadius: "50%", 
                      opacity: 0.1,
                      zIndex: 0
                    }} />
                    <img 
                      src={PHOTOS.about} 
                      alt="Artisan plombier" 
                      style={{ width: "100%", borderRadius: "24px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "-30px",
                      right: "-30px",
                      backgroundColor: C.white,
                      padding: "24px",
                      borderRadius: "16px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}>
                        <Shield size={24} />
                      </div>
                      <div>
                        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "20px", color: C.text }}>Garantie Décennale</div>
                        <div style={{ fontFamily: SANS, fontSize: "14px", color: C.textMuted }}>Sérénité absolue</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div style={{ flex: "1 1 500px" }}>
                <Eyebrow text="Pourquoi nous choisir" color={C.primary} />
                <Reveal delay={0.1}>
                  <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, marginBottom: "24px", lineHeight: 1.2 }}>
                    L'Exigence au service de votre Habitat
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p style={{ fontFamily: SANS, color: C.textMuted, fontSize: "18px", lineHeight: 1.6, marginBottom: "40px" }}>
                    Artisan passionné, nous mettons notre expertise technique à votre disposition. Qualité, respect des délais et propreté du chantier sont nos maîtres-mots.
                  </p>
                </Reveal>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {[
                    { title: "Devis clair & détaillé", desc: "Pas de mauvaises surprises, tout est transparent." },
                    { title: "Intervention rapide", desc: "Nous sommes réactifs face à vos urgences." },
                    { title: "Matériel certifié", desc: "Installation d'équipements de grandes marques." }
                  ].map((item, idx) => (
                    <Reveal key={idx} delay={0.3 + (idx * 0.1)}>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div style={{ marginTop: "4px", color: C.primary }}>
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "20px", color: C.text, marginBottom: "4px" }}>{item.title}</h4>
                          <p style={{ fontFamily: SANS, color: C.textMuted, lineHeight: 1.5 }}>{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="realisations" style={{ padding: "100px 0", backgroundColor: C.bgDeep }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "64px", gap: "24px" }}>
              <div>
                <Eyebrow text="Nos Réalisations" color={C.primary} />
                <Reveal delay={0.1}>
                  <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                    Projets Récents
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                <Button variant="outline" C={C}>Voir tout</Button>
              </Reveal>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", 
              gap: "24px" 
            }}>
              {[
                { img: PHOTOS.gallery1, tag: "Salle de Bain" },
                { img: PHOTOS.gallery2, tag: "Chauffage" },
                { img: PHOTOS.gallery3, tag: "Sanitaire" },
                { img: PHOTOS.gallery4, tag: "Rénovation" }
              ].map((item, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <motion.div 
                    whileHover="hover"
                    style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "4/5" }}
                  >
                    <motion.img 
                      src={item.img} 
                      alt={item.tag}
                      variants={{ hover: { scale: 1.05 } }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <motion.div 
                      variants={{ hover: { opacity: 1 } }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: "24px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
                        <span style={{ color: C.white, fontFamily: SERIF, fontWeight: 600, fontSize: "20px" }}>{item.tag}</span>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: C.white, display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="avis" style={{ padding: "100px 0", backgroundColor: C.bg }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Eyebrow text="Témoignages" color={C.primary} />
              </div>
              <Reveal delay={0.1}>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, marginBottom: "24px" }}>
                  Avis de nos clients
                </h2>
              </Reveal>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", 
              gap: "32px" 
            }}>
              {testimonials.map((testi, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div style={{
                    backgroundColor: C.bgDeep,
                    padding: "40px",
                    borderRadius: "24px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{ display: "flex", gap: "4px", color: C.accent, marginBottom: "24px" }}>
                      {[...Array(testi.rating || 5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <p style={{ fontFamily: SANS, color: C.text, fontSize: "18px", lineHeight: 1.6, fontStyle: "italic", marginBottom: "32px", flexGrow: 1 }}>
                      "{testi.text}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: SERIF, fontWeight: 700, fontSize: "20px" }}>
                        {testi.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.text }}>{testi.name}</div>
                        <div style={{ fontFamily: SANS, fontSize: "14px", color: C.textMuted }}>{testi.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ padding: "100px 0", backgroundColor: C.bgDeep }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Eyebrow text="Foire aux questions" color={C.primary} />
              </div>
              <Reveal delay={0.1}>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, marginBottom: "24px" }}>
                  Questions Fréquentes
                </h2>
              </Reveal>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faq.map((item, idx) => {
                const [isOpen, setIsOpen] = useState(false);
                return (
                  <Reveal key={idx} delay={idx * 0.1}>
                    <div 
                      style={{
                        backgroundColor: C.bgCard,
                        borderRadius: "16px",
                        border: \`1px solid \${C.border}\`,
                        overflow: "hidden"
                      }}
                    >
                      <button 
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "24px",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "18px", color: C.text }}>{item.q}</span>
                        <div style={{ color: C.primary, minWidth: "24px" }}>
                          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div style={{ padding: "0 24px 24px", fontFamily: SANS, color: C.textMuted, lineHeight: 1.6 }}>
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA / CONTACT SECTION */}
        <section id="contact" style={{ padding: "100px 0", backgroundColor: C.bg }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ 
              backgroundColor: C.primary, 
              borderRadius: "32px", 
              padding: "64px", 
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexWrap: "wrap",
              gap: "64px"
            }}>
              {/* Decoration */}
              <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", backgroundColor: C.primaryLight, opacity: 0.3, zIndex: 0 }} />
              
              <div style={{ flex: "1 1 400px", position: "relative", zIndex: 1 }}>
                <Reveal>
                  <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.white, marginBottom: "24px", lineHeight: 1.2 }}>
                    Prêt à démarrer votre projet ?
                  </h2>
                  <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.8)", fontSize: "18px", lineHeight: 1.6, marginBottom: "40px" }}>
                    Contactez-nous dès aujourd'hui pour un devis gratuit et personnalisé. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", color: C.white }}>
                      <Phone size={24} />
                      <span style={{ fontFamily: SANS, fontSize: "18px", fontWeight: 500 }}>{phone}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", color: C.white }}>
                      <Mail size={24} />
                      <span style={{ fontFamily: SANS, fontSize: "18px", fontWeight: 500 }}>{email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", color: C.white }}>
                      <MapPin size={24} />
                      <span style={{ fontFamily: SANS, fontSize: "18px", fontWeight: 500 }}>{address}</span>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div style={{ flex: "1 1 400px", position: "relative", zIndex: 1 }}>
                <Reveal delay={0.2}>
                  <form 
                    onSubmit={e => e.preventDefault()}
                    style={{
                      backgroundColor: C.white,
                      padding: "40px",
                      borderRadius: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px"
                    }}
                  >
                    <h3 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Envoyez un message</h3>
                    <div>
                      <label style={{ display: "block", fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text, marginBottom: "8px" }}>Nom</label>
                      <input type="text" placeholder="Votre nom" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: \`1px solid \${C.border}\`, fontFamily: SANS, fontSize: "16px", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text, marginBottom: "8px" }}>Téléphone</label>
                      <input type="tel" placeholder="Votre téléphone" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: \`1px solid \${C.border}\`, fontFamily: SANS, fontSize: "16px", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text, marginBottom: "8px" }}>Message</label>
                      <textarea placeholder="Votre besoin..." rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: \`1px solid \${C.border}\`, fontFamily: SANS, fontSize: "16px", outline: "none", resize: "vertical" }} />
                    </div>
                    <Button variant="primary" C={C} style={{ width: "100%", marginTop: "8px" }}>
                      Envoyer la demande
                    </Button>
                  </form>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0f172a", color: "#f8fafc", paddingTop: "80px", paddingBottom: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "48px",
            marginBottom: "64px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: C.primary, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Droplets size={20} color={C.white} />
                </div>
                <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "20px" }}>{companyName}</span>
              </div>
              <p style={{ fontFamily: SANS, color: "#94a3b8", lineHeight: 1.6, marginBottom: "24px" }}>
                Votre expert en plomberie et chauffage. Qualité, réactivité et professionnalisme à votre service.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href="#" style={{ color: "#f8fafc", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}><Globe size={20} /></a>
                <a href="#" style={{ color: "#f8fafc", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}><Camera size={20} /></a>
                <a href="#" style={{ color: "#f8fafc", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}><Send size={20} /></a>
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "18px", marginBottom: "24px" }}>Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Dépannage", "Chauffage", "Climatisation", "Création de salle de bain"].map((item, i) => (
                  <li key={i}>
                    <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontFamily: SANS, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = C.primary} onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "18px", marginBottom: "24px" }}>Entreprise</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["À Propos", "Réalisations", "Avis Clients", "Contact"].map((item, i) => (
                  <li key={i}>
                    <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontFamily: SANS, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = C.primary} onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "18px", marginBottom: "24px" }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: "#94a3b8", fontFamily: SANS }}>
                  <MapPin size={20} style={{ color: C.primary, flexShrink: 0 }} />
                  <span>{address}</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontFamily: SANS }}>
                  <Phone size={20} style={{ color: C.primary, flexShrink: 0 }} />
                  <span>{phone}</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontFamily: SANS }}>
                  <Mail size={20} style={{ color: C.primary, flexShrink: 0 }} />
                  <span>{email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ 
            borderTop: "1px solid rgba(255,255,255,0.1)", 
            paddingTop: "32px", 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "space-between", 
            alignItems: "center",
            gap: "16px",
            fontFamily: SANS,
            fontSize: "14px",
            color: "#64748b"
          }}>
            <p>© {new Date().getFullYear()} {companyName}. Tous droits réservés.</p>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>Mentions légales</a>
              <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
