"use client";
// @ts-nocheck

/**
 * Business: Éco-Clean Habitat (Nettoyage Écolo - Natural Minimalist)
 * Description: Services de nettoyage écologique avec un design minimaliste et organique.
 * Fonts: Fraunces (Serif) & Inter (Sans)
 * Colors: Olive green (#65a30d), Beige sand (#f5f5f4), Terracotta accent
 * Credits: AeviaLaunch
 */

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Leaf,
  Sparkles,
  Droplets,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Star,
  Quote,
  ArrowRight,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

// --- Helper Functions ---

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

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

// --- Constants & Config ---

const DEFAULT_BRAND_COLOR = "#65a30d"; // Olive green
const BACKGROUND_COLOR = "#f5f5f4"; // Beige sand
const ACCENT_COLOR = "#d97757"; // Terracotta

const EASE = [0.16, 1, 0.3, 1];
const SERIF = "'Fraunces', serif";
const SANS = "'Inter', sans-serif";

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1584820927498-cafe4c239bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Clean bright room
  about: "https://images.unsplash.com/photo-1628177142898-93e46e48da63?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Eco products
  services: [
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603712725038-e9334ae8ce0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ],
};

// --- Reusable Components ---

const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const getVariants = () => {
    switch (direction) {
      case "up":
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
      case "down":
        return { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } };
      case "left":
        return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
      case "right":
        return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
      case "none":
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      default:
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Eyebrow = ({ text, color }: { text: string; color: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
    <div style={{ width: "30px", height: "1px", backgroundColor: color }} />
    <span
      style={{
        fontFamily: SANS,
        fontSize: "14px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color,
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  </div>
);

const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  C,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  C: any;
  className?: string;
}) => {
  const baseStyle = {
    fontFamily: SANS,
    fontWeight: 500,
    fontSize: "15px",
    padding: "16px 32px",
    borderRadius: "100px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: C.primary,
          color: C.white,
          border: "none",
          boxShadow: `0 4px 14px ${C.primary}40`,
        };
      case "secondary":
        return {
          backgroundColor: C.white,
          color: C.primary,
          border: "none",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: C.primary,
          border: `1px solid ${C.primary}`,
        };
      default:
        return {};
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const mergedStyle = {
    ...baseStyle,
    ...getVariantStyle(),
    transform: isHovered ? "translateY(-2px)" : "none",
    boxShadow:
      isHovered && variant === "primary"
        ? `0 6px 20px ${C.primary}60`
        : getVariantStyle().boxShadow,
  };

  const content = (
    <motion.button
      whileTap={{ scale: 0.98 }}
      style={mergedStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
      {variant === "primary" && (
        <ArrowRight size={18} style={{ transition: "transform 0.3s ease", transform: isHovered ? "translateX(4px)" : "none" }} />
      )}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none" }}>
        {content}
      </a>
    );
  }

  return content;
};

// --- Main Template Component ---

export default function Template({ session }: { session: any }) {
  // Data Binding
  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  const businessName = fd.businessName || "Éco-Clean Habitat";
  const contactEmail = fd.contactEmail || "contact@eco-clean-habitat.fr";
  const contactPhone = fd.contactPhone || "01 23 45 67 89";
  const contactAddress = fd.contactAddress || "123 Rue de la Nature, 75001 Paris";

  // Colors
  const brandColor = fd.brandColor || DEFAULT_BRAND_COLOR;
  
  const C = {
    primary: brandColor,
    primaryLight: shadeColor(brandColor, 20),
    primaryDark: shadeColor(brandColor, -20),
    accent: ACCENT_COLOR,
    bg: BACKGROUND_COLOR,
    bgDeep: "#e7e5e4", // Slightly darker beige
    bgCard: "#ffffff",
    text: "#292524", // Stone 800
    textMuted: "#57534e", // Stone 600
    white: "#ffffff",
    black: "#1c1917",
    border: "#d6d3d1",
  };

  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Lists with Fallbacks
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (c.services && c.services.length > 0) {
      setServices(c.services);
    } else {
      setServices([
        {
          title: "Nettoyage Résidentiel",
          description: "Un entretien complet de votre maison utilisant exclusivement des produits naturels, sans toxines, pour un environnement sain pour votre famille et vos animaux.",
          icon: <Leaf />,
        },
        {
          title: "Nettoyage Fin de Chantier",
          description: "Remise en état après travaux avec des méthodes douces mais efficaces pour éliminer la poussière et les résidus tout en préservant vos nouveaux matériaux.",
          icon: <Sparkles />,
        },
        {
          title: "Entretien Bureaux",
          description: "Espaces de travail purifiés. Nous créons un environnement propice à la concentration et au bien-être de vos collaborateurs avec des solutions éco-responsables.",
          icon: <ShieldCheck />,
        },
      ]);
    }

    if (c.testimonials && c.testimonials.length > 0) {
      setTestimonials(c.testimonials);
    } else {
      setTestimonials([
        {
          name: "Sophie L.",
          role: "Cliente Régulière",
          content: "Je suis ravie de leurs services. L'odeur après leur passage est fraîche et naturelle, contrairement aux produits chimiques habituels. Une vraie bouffée d'air pur dans mon appartement !",
          rating: 5,
        },
        {
          name: "Marc D.",
          role: "Propriétaire",
          content: "Efficacité redoutable et respect total des matériaux. Leurs méthodes de nettoyage écologiques ont redonné vie à mes parquets anciens sans les agresser. Je recommande vivement.",
          rating: 5,
        },
        {
          name: "Julie T.",
          role: "Gérante d'Entreprise",
          content: "Nous avons confié l'entretien de nos bureaux à Éco-Clean. Nos employés ont immédiatement remarqué la différence de qualité de l'air. Un service professionnel et aligné avec nos valeurs.",
          rating: 5,
        },
      ]);
    }

    if (c.faq && c.faq.length > 0) {
      setFaqs(c.faq);
    } else {
      setFaqs([
        {
          question: "Quels types de produits utilisez-vous ?",
          answer: "Nous utilisons exclusivement des produits certifiés écologiques, biodégradables et non toxiques. Nos formules sont souvent à base d'ingrédients naturels comme le vinaigre blanc, le bicarbonate de soude, les huiles essentielles et le savon noir.",
        },
        {
          question: "Fournissez-vous le matériel de nettoyage ?",
          answer: "Oui, nous apportons tout le matériel nécessaire (aspirateurs avec filtres HEPA, chiffons en microfibre réutilisables, balais) ainsi que tous nos produits d'entretien naturels.",
        },
        {
          question: "Vos services sont-ils adaptés aux personnes allergiques ?",
          answer: "Absolument. Nos méthodes et produits sans chimie lourde sont particulièrement recommandés pour les personnes sensibles, asthmatiques ou sujettes aux allergies. Nos aspirateurs filtrent 99% des particules fines.",
        },
        {
          question: "Comment fixer un premier rendez-vous ?",
          answer: "Vous pouvez nous contacter via le formulaire ci-dessous ou par téléphone. Nous proposons une première visite d'évaluation gratuite pour comprendre vos besoins spécifiques et établir un devis sur-mesure.",
        },
      ]);
    }
  }, [c]);

  // Global Styles injecting
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = \`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
      
      * { box-sizing: border-box; }
      body, html { margin: 0; padding: 0; overflow-x: hidden; background-color: \${C.bg}; color: \${C.text}; font-family: \${SANS}; }
      
      /* Hide scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: \${C.bgDeep}; }
      ::-webkit-scrollbar-thumb { background: \${C.border}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: \${C.primaryLight}; }
    \`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [C]);

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isScrolled ? "15px 40px" : "30px 40px",
          transition: "all 0.4s ease",
          backgroundColor: isScrolled ? `${C.bg}F2` : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          borderBottom: isScrolled ? `1px solid ${C.border}50` : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ 
          fontFamily: SERIF, 
          fontSize: "24px", 
          fontWeight: 500, 
          color: C.primaryDark,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <Leaf size={24} color={C.primary} />
          {businessName}
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "none", "@media (min-width: 768px)": { display: "flex" }, gap: "30px", alignItems: "center" }} className="hidden md:flex">
          {["Services", "À Propos", "Réalisations", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              style={{
                fontFamily: SANS,
                fontSize: "14px",
                color: C.text,
                textDecoration: "none",
                transition: "color 0.3s ease",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
            >
              {item}
            </a>
          ))}
          <Button C={C} href="#devis" variant="primary">Demander un devis</Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: C.text, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "70px",
              left: 0,
              right: 0,
              backgroundColor: C.bgCard,
              padding: "20px",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              borderBottom: `1px solid ${C.border}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            {["Services", "À Propos", "Réalisations", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: SANS,
                  fontSize: "18px",
                  color: C.text,
                  textDecoration: "none",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.bgDeep}`,
                }}
              >
                {item}
              </a>
            ))}
            <Button C={C} href="#devis" style={{ width: "100%", justifyContent: "center" }}>
              Demander un devis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "80px", // Account for fixed nav
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <img
            src={PHOTO.hero}
            alt="Intérieur propre et lumineux"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
          />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to right, ${C.bg} 40%, transparent)` }} />
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ maxWidth: "600px" }}>
            <Reveal>
              <Eyebrow text="Entretien Naturel" color={C.primaryDark} />
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(36px, 6vw, 64px)",
                  lineHeight: 1.1,
                  color: C.black,
                  marginBottom: "24px",
                  fontWeight: 400,
                }}
              >
                {c.heroTitle || "La pureté au naturel pour votre intérieur."}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(16px, 2vw, 18px)",
                  lineHeight: 1.6,
                  color: C.textMuted,
                  marginBottom: "40px",
                }}
              >
                {c.heroSubtitle || "Services de nettoyage professionnel respectueux de l'environnement, de votre santé et de votre bien-être."}
              </p>
            </Reveal>
            <Reveal delay={0.3} className="flex flex-col sm:flex-row gap-4">
              <Button C={C} href="#services">Découvrir nos services</Button>
              <Button C={C} variant="outline" href="#contact">Nous contacter</Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST BAR --- */}
      <section style={{ backgroundColor: C.primaryDark, padding: "40px 5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", textAlign: "center" }}>
          {[
            { label: "Produits Naturels", value: "100%" },
            { label: "Clients Satisfaits", value: "+500" },
            { label: "Interventions", value: "+2000" },
            { label: "Certifié", value: "Écolabel" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1} direction="up">
              <div style={{ color: C.white }}>
                <div style={{ fontFamily: SERIF, fontSize: "36px", fontWeight: 300, marginBottom: "8px" }}>{stat.value}</div>
                <div style={{ fontFamily: SANS, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" style={{ padding: "100px 5%", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 60px" }}>
            <Reveal>
              <Eyebrow text="Notre Expertise" color={C.primary} />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", color: C.black, marginBottom: "20px", fontWeight: 400 }}>
                Des solutions pour chaque espace
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "30px" }}>
            {services.map((service, index) => (
              <Reveal key={index} delay={0.1 * index}>
                <div
                  style={{
                    backgroundColor: C.bgCard,
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)";
                  }}
                >
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={PHOTO.services[index % PHOTO.services.length]}
                      alt={service.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "30px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ color: C.primary, marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "50px", height: "50px", backgroundColor: C.primaryLight + "30", borderRadius: "50%" }}>
                      {service.icon || <Sparkles />}
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: "22px", color: C.black, marginBottom: "15px", fontWeight: 500 }}>
                      {service.title}
                    </h3>
                    <p style={{ fontFamily: SANS, fontSize: "15px", color: C.textMuted, lineHeight: 1.6, flex: 1 }}>
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY US / ABOUT SECTION --- */}
      <section id="à-propos" style={{ padding: "100px 5%", backgroundColor: C.bgDeep, overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
          <div style={{ flex: "1 1 500px" }}>
            <Reveal direction="left">
              <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden" }}>
                <img
                  src={PHOTO.about}
                  alt="Produits de nettoyage naturels"
                  style={{ width: "100%", height: "auto", borderRadius: "20px", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "150px", height: "150px", backgroundColor: C.primary, borderRadius: "50%", zIndex: -1 }} />
              </div>
            </Reveal>
          </div>
          
          <div style={{ flex: "1 1 400px" }}>
            <Reveal direction="right">
              <Eyebrow text="Notre Philosophie" color={C.primary} />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", color: C.black, marginBottom: "30px", fontWeight: 400, lineHeight: 1.2 }}>
                L'alliance de l'efficacité et de l'écologie.
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "16px", color: C.textMuted, lineHeight: 1.7, marginBottom: "20px" }}>
                Nous croyons fermement qu'il n'est pas nécessaire d'utiliser des produits chimiques agressifs pour obtenir un résultat impeccable. Au contraire, la nature nous offre tout ce dont nous avons besoin pour nettoyer, assainir et parfumer nos intérieurs.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0" }}>
                {[
                  "Santé préservée pour vous et vos proches.",
                  "Respect des surfaces et matériaux délicats.",
                  "Impact environnemental réduit au minimum.",
                  "Parfums naturels et apaisants."
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px", fontFamily: SANS, fontSize: "15px", color: C.text }}>
                    <CheckCircle2 color={C.primary} size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button C={C} href="#contact">Parlons de votre projet</Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section id="réalisations" style={{ padding: "100px 5%", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <Reveal>
                <Eyebrow text="Nos Réalisations" color={C.primary} />
              </Reveal>
              <Reveal delay={0.1}>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 40px)", color: C.black, fontWeight: 400 }}>
                  Avant, pendant, après.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", gap: "15px" }}>
                 {/* Decorative element or secondary action could go here */}
              </div>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "20px" }}>
            {PHOTO.gallery.map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "4/5", position: "relative" }}>
                  <img
                    src={img}
                    alt={`Réalisation ${i+1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section style={{ padding: "100px 5%", backgroundColor: C.primaryDark, color: C.white, position: "relative", overflow: "hidden" }}>
        <Leaf size={400} color={C.white} style={{ position: "absolute", top: "-100px", right: "-100px", opacity: 0.05, transform: "rotate(45deg)", pointerEvents: "none" }} />
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Reveal>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400 }}>
                Ce qu'ils disent de nous
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "30px" }}>
            {testimonials.map((testimonial, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Quote size={40} color={C.primaryLight} style={{ opacity: 0.5, marginBottom: "20px" }} />
                  <p style={{ fontFamily: SANS, fontSize: "16px", lineHeight: 1.6, marginBottom: "30px", fontStyle: "italic" }}>
                    "{testimonial.content}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: "16px" }}>{testimonial.name}</div>
                      <div style={{ fontFamily: SANS, fontSize: "14px", opacity: 0.7 }}>{testimonial.role}</div>
                    </div>
                    <div style={{ display: "flex" }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} fill={j < testimonial.rating ? C.accent : "none"} color={j < testimonial.rating ? C.accent : "rgba(255,255,255,0.2)"} />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section style={{ padding: "100px 5%", backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Reveal>
              <Eyebrow text="Questions Fréquentes" color={C.primary} />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 40px)", color: C.black, fontWeight: 400 }}>
                Tout savoir sur notre approche
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {faqs.map((faq, i) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div 
                    style={{ 
                      backgroundColor: C.bgCard, 
                      borderRadius: "12px", 
                      overflow: "hidden",
                      border: `1px solid ${C.border}50`,
                    }}
                  >
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      style={{
                        width: "100%",
                        padding: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: SANS,
                        fontSize: "16px",
                        fontWeight: 500,
                        color: C.black,
                      }}
                    >
                      {faq.question}
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={20} color={C.primary} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div style={{ padding: "0 24px 24px 24px", fontFamily: SANS, fontSize: "15px", color: C.textMuted, lineHeight: 1.6 }}>
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
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" style={{ padding: "100px 5%", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "60px" }}>
          <div style={{ flex: "1 1 400px" }}>
            <Reveal>
              <Eyebrow text="Contact" color={C.primary} />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", color: C.black, marginBottom: "20px", fontWeight: 400 }}>
                Prêt pour un intérieur plus sain ?
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "16px", color: C.textMuted, lineHeight: 1.6, marginBottom: "40px" }}>
                Discutons de vos besoins d'entretien. Remplissez le formulaire ou contactez-nous directement, nous vous répondrons dans les plus brefs délais.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: <Phone size={20} />, text: contactPhone },
                  { icon: <Mail size={20} />, text: contactEmail },
                  { icon: <MapPin size={20} />, text: contactAddress },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px", fontFamily: SANS, fontSize: "15px", color: C.text }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: C.primaryLight + "30", display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={{ flex: "1 1 500px" }}>
            <Reveal delay={0.2} direction="up">
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  backgroundColor: C.bgCard,
                  padding: "40px",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text }}>Nom complet</label>
                    <input type="text" placeholder="Jean Dupont" style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "15px", outline: "none", transition: "border-color 0.3s" }} onFocus={(e) => e.target.style.borderColor = C.primary} onBlur={(e) => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text }}>Téléphone</label>
                    <input type="tel" placeholder="06 12 34 56 78" style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "15px", outline: "none", transition: "border-color 0.3s" }} onFocus={(e) => e.target.style.borderColor = C.primary} onBlur={(e) => e.target.style.borderColor = C.border} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text }}>Email</label>
                  <input type="email" placeholder="jean@exemple.com" style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "15px", outline: "none", transition: "border-color 0.3s" }} onFocus={(e) => e.target.style.borderColor = C.primary} onBlur={(e) => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text }}>Service souhaité</label>
                  <select style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "15px", outline: "none", backgroundColor: "transparent" }}>
                    <option>Nettoyage Résidentiel</option>
                    <option>Nettoyage Fin de Chantier</option>
                    <option>Entretien Bureaux</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 500, color: C.text }}>Message (Optionnel)</label>
                  <textarea rows={4} placeholder="Détaillez votre besoin..." style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "15px", outline: "none", transition: "border-color 0.3s", resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = C.primary} onBlur={(e) => e.target.style.borderColor = C.border} />
                </div>
                <Button C={C} style={{ width: "100%", marginTop: "10px" }} onClick={() => alert("Formulaire soumis avec succès (démo)")}>Envoyer la demande</Button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ backgroundColor: C.black, color: C.white, paddingTop: "80px", paddingBottom: "40px", paddingLeft: "5%", paddingRight: "5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "40px", marginBottom: "60px" }}>
            <div>
              <div style={{ 
                fontFamily: SERIF, 
                fontSize: "24px", 
                fontWeight: 500, 
                color: C.white,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px"
              }}>
                <Leaf size={24} color={C.primary} />
                {businessName}
              </div>
              <p style={{ fontFamily: SANS, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "20px" }}>
                Votre partenaire de confiance pour un intérieur impeccable, sain et respectueux de l'environnement.
              </p>
              <div style={{ display: "flex", gap: "15px" }}>
                <a href="#" style={{ color: C.white, opacity: 0.8, transition: "opacity 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.opacity="1"} onMouseLeave={(e) => e.currentTarget.style.opacity="0.8"}><Instagram size={20} /></a>
                <a href="#" style={{ color: C.white, opacity: 0.8, transition: "opacity 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.opacity="1"} onMouseLeave={(e) => e.currentTarget.style.opacity="0.8"}><Facebook size={20} /></a>
                <a href="#" style={{ color: C.white, opacity: 0.8, transition: "opacity 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.opacity="1"} onMouseLeave={(e) => e.currentTarget.style.opacity="0.8"}><Twitter size={20} /></a>
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Navigation</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Accueil", "Services", "À Propos", "Réalisations", "Contact"].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(" ", "-")}`} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontFamily: SANS, transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color=C.primaryLight} onMouseLeave={(e) => e.currentTarget.style.color="rgba(255,255,255,0.6)"}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {services.map((service, idx) => (
                  <li key={idx} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontFamily: SANS }}>
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
                <li style={{ display: "flex", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "14px", fontFamily: SANS }}>
                  <MapPin size={18} style={{ flexShrink: 0, color: C.primaryLight }} />
                  {contactAddress}
                </li>
                <li style={{ display: "flex", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "14px", fontFamily: SANS }}>
                  <Phone size={18} style={{ flexShrink: 0, color: C.primaryLight }} />
                  {contactPhone}
                </li>
                <li style={{ display: "flex", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "14px", fontFamily: SANS }}>
                  <Mail size={18} style={{ flexShrink: 0, color: C.primaryLight }} />
                  {contactEmail}
                </li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
            <div style={{ fontFamily: SANS, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              © {new Date().getFullYear()} {businessName}. Tous droits réservés.
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", fontFamily: SANS }}>Mentions Légales</a>
              <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", fontFamily: SANS }}>Politique de Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
