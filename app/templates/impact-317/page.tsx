"use client";
// @ts-nocheck
/*
 * Template: impact-317 (Sparkle Home / Ménage Dynamique)
 * Description: Energy, modern, dynamic template with an interactive hour slider for a vibrant cleaning service.
 * Primary Color: #7c3aed (Vibrant Purple)
 * Accent Color: #facc15 (Yellow)
 * Fonts: Poppins (Serif/Heading), Inter (Sans)
 * Credits: Generated for AeviaLaunch
 */

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Star,
  Quote,
  Shield,
  Droplets,
  Wind,
  Home as HomeIcon,
  Menu,
  X,
  CalendarDays,
  Calculator,
  User,
  Zap
} from "lucide-react";
const Facebook = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Twitter = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const InstagramIcon = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);

// --- Helpers ---
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

// --- Constants ---
const EASE = [0.16, 1, 0.3, 1];
const SERIF = "'Poppins', sans-serif";
const SANS = "'Inter', sans-serif";

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000",
  about: "https://images.unsplash.com/photo-1628177142898-93e46e4653b1?auto=format&fit=crop&q=80&w=1000",
  services: [
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
  ],
};

const Instagram = ({ size = 24, color = "currentColor", style = {} }) => (
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
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// --- Components ---
const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  fullWidth = false,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 40 };
      case "down": return { opacity: 0, y: -40 };
      case "left": return { opacity: 0, x: 40 };
      case "right": return { opacity: 0, x: -40 };
      default: return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <div ref={ref} className={className} style={{ width: fullWidth ? "100%" : "auto", position: "relative" }}>
      <motion.div
        initial={getInitial()}
        animate={isInView ? getAnimate() : getInitial()}
        transition={{ duration: 0.8, delay, ease: EASE }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function TemplatePage({ session: initialSession }: { session?: any } = {}) {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [hours, setHours] = useState(2);
  const [frequency, setFrequency] = useState("weekly");
  // Standard session loading (matches every other template): this page is
  // never actually given a `session` prop by Next.js routing — it must fetch
  // its own from /templates/impact-317?session=<id>, otherwise fd is always {}.
  const [session, setSession] = useState<any>(initialSession ?? null);

  const hourlyRate = 35;

  const calculateEstimate = () => {
    let rate = hourlyRate;
    if (frequency === "weekly") rate = hourlyRate * 0.9;
    if (frequency === "biweekly") rate = hourlyRate * 0.95;
    return (hours * rate).toFixed(2);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  // Theme configuration
  const brandColor = fd.primaryColor || "#7c3aed";
  const C: Record<string, string> = {
    primary: brandColor,
    primaryLight: shadeColor(brandColor, 20),
    primaryDark: shadeColor(brandColor, -20),
    bg: "#f8fafc",
    bgDeep: "#f1f5f9",
    bgCard: "#ffffff",
    text: "#0f172a",
    textMuted: "#64748b",
    accent: "#facc15",
    white: "#ffffff",
    black: "#000000",
  };

  // Data binding
  const companyName = fd.businessName || "Ménage Dynamique";

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero shot and about-section image first.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) PHOTO.hero = p[0];
    if (p[1]) PHOTO.about = p[1];
    for (let i = 2; i < p.length && i - 2 < PHOTO.services.length; i++) {
      if (p[i]) PHOTO.services[i - 2] = p[i];
    }
    for (let i = 5; i < p.length && i - 5 < PHOTO.gallery.length; i++) {
      if (p[i]) PHOTO.gallery[i - 5] = p[i];
    }
  }, [fd]);
  const tagline = c.tagline || "Le nettoyage qui redonne vie à votre espace.";
  const heroHeading = c.heroTitle || "L'énergie de la propreté à votre service";
  const heroSub = c.heroSubtitle || "Des services de nettoyage résidentiels et commerciaux rapides, efficaces et éclatants pour un environnement toujours impeccable.";
  const cta1 = c.ctaPrimary || "Demander un devis";
  const cta2 = c.ctaSecondary || "Voir nos services";
  const phone = fd.phone || "01 23 45 67 89";
  const email = fd.email || "contact@menagedynamique.fr";
  const address = fd.address || "123 Avenue de la Propreté, 75000 Paris";

  const defaultServices = [
    { title: "Nettoyage Résidentiel", desc: "Un intérieur étincelant pour votre confort au quotidien, avec des produits respectueux de l'environnement." },
    { title: "Nettoyage Commercial", desc: "Des bureaux impeccables pour booster la productivité de vos équipes et l'image de votre entreprise." },
    { title: "Grand Ménage de Printemps", desc: "Un nettoyage en profondeur pour éliminer la poussière et les allergènes dans les moindres recoins." },
  ];

  const defaultTestimonials = [
    { name: "Marie L.", text: "Une équipe dynamique et redoutablement efficace. Mon appartement n'a jamais été aussi propre !", role: "Cliente fidèle" },
    { name: "Julien D.", text: "Le service pour nos bureaux est exceptionnel. Ils sont discrets et le résultat est toujours parfait.", role: "Manager" },
    { name: "Sophie M.", text: "J'adore leur énergie. Le nettoyage est fait avec le sourire et le niveau de détail est impressionnant.", role: "Propriétaire" },
  ];

  const [services, setServices] = useState(defaultServices);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    if (c.services && Array.isArray(c.services) && c.services.length > 0) {
      setServices(c.services.map((s: any, i: number) => ({
        title: s.title || s.name || defaultServices[i%3].title,
        desc: s.description || s.desc || defaultServices[i%3].desc
      })));
    }
    if (c.testimonials && Array.isArray(c.testimonials) && c.testimonials.length > 0) {
      setTestimonials(c.testimonials.map((t: any, i: number) => ({
        name: t.name || t.author || defaultTestimonials[i%3].name,
        text: t.text || t.content || t.quote || defaultTestimonials[i%3].text,
        role: t.role || defaultTestimonials[i%3].role
      })));
    }
  }, [c]);

  // Components
  const Eyebrow = ({ children, color = C.primary }: { children: React.ReactNode, color?: string }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: color }} />
      <span style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: color }}>
        {children}
      </span>
    </div>
  );

  const Button = ({ children, variant = "primary", className = "", ...props }: any) => {
    const isPrimary = variant === "primary";
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          backgroundColor: isPrimary ? C.primary : "transparent",
          color: isPrimary ? C.white : C.primary,
          border: `2px solid ${C.primary}`,
          padding: "16px 32px",
          borderRadius: "50px",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: "16px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          boxShadow: isPrimary ? `0 10px 20px -10px ${C.primary}` : "none",
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.button>
    );
  };

  // Parallax setup
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  if (!mounted) return <div style={{ minHeight: "100vh", backgroundColor: C.bg }} />;

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: SANS, overflow: "hidden" }}>
      
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid rgba(0,0,0,0.05)`,
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={companyName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                transform: "rotate(-10deg)"
              }}>
                <Zap size={24} />
              </div>
              <span style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, color: C.text, lineHeight: 1 }}>
                {companyName}
              </span>
            </div>
          )}

          <div className="hidden md:flex" style={{ alignItems: "center", gap: "40px" }}>
            {["Services", "Avantages", "Tarifs", "Témoignages"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontFamily: SANS,
                fontSize: "15px",
                fontWeight: 600,
                color: C.text,
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s"
              }} onMouseOver={(e) => e.currentTarget.style.color = C.primary} onMouseOut={(e) => e.currentTarget.style.color = C.text}>
                {item}
              </a>
            ))}
            <Button>
              {cta1} <ArrowRight size={18} />
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: "none", border: "none", color: C.text }}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "80px",
              left: 0,
              right: 0,
              backgroundColor: C.white,
              padding: "24px",
              zIndex: 99,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
             {["Services", "Avantages", "Tarifs", "Témoignages"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} style={{
                fontFamily: SERIF,
                fontSize: "20px",
                fontWeight: 600,
                color: C.text,
                textDecoration: "none",
                borderBottom: "1px solid #eee",
                paddingBottom: "12px"
              }}>
                {item}
              </a>
            ))}
            <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => setIsMenuOpen(false)}>
              {cta1}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "120px", // Account for fixed nav
        paddingBottom: "80px",
        overflow: "hidden"
      }}>
        {/* Background shapes */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: "hidden" }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, width: "100%", height: "100%" }}>
            <div style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              backgroundColor: C.primaryLight,
              filter: "blur(100px)",
              opacity: 0.3
            }} />
            <div style={{
              position: "absolute",
              bottom: "10%",
              left: "-10%",
              width: "40vw",
              height: "40vw",
              borderRadius: "50%",
              backgroundColor: C.accent,
              filter: "blur(80px)",
              opacity: 0.2
            }} />
          </motion.div>
        </div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "60px", alignItems: "center" }}>
            
            {/* Left Content */}
            <div>
              <Reveal>
                <Eyebrow color={C.primary}>Service Premium</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(40px, 6vw, 72px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  color: C.text,
                  letterSpacing: "-0.02em"
                }}>
                  {heroHeading.split(' ').map((word, i) => (
                    word.length > 4 && i % 2 !== 0 ? 
                      <span key={i} style={{ color: C.primary }}> {word} </span> : 
                      <span key={i}> {word} </span>
                  ))}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p style={{
                  fontFamily: SANS,
                  fontSize: "clamp(16px, 2vw, 20px)",
                  lineHeight: 1.6,
                  color: C.textMuted,
                  marginBottom: "40px",
                  maxWidth: "600px"
                }}>
                  {heroSub}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                  <Button>{cta1} <ArrowRight size={20} /></Button>
                  <Button variant="outline">{cta2}</Button>
                </div>
              </Reveal>
              
              <Reveal delay={0.4}>
                <div style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", margin: "0 -8px" }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        width: "40px", height: "40px", borderRadius: "50%", border: `3px solid ${C.bg}`,
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: "cover",
                        marginLeft: i !== 1 ? "-15px" : 0, zIndex: 10 - i
                      }} />
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", color: C.accent }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={C.accent} />)}
                    </div>
                    <span style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 600, color: C.textMuted }}>
                      Plus de 500 clients satisfaits
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Image/Dynamic Element */}
            <Reveal direction="left" delay={0.2}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  left: "-20px",
                  right: "20px",
                  bottom: "20px",
                  border: `2px dashed ${C.primary}`,
                  borderRadius: "24px",
                  zIndex: 0
                }} />
                <motion.div 
                  whileHover={{ y: -10 }}
                  transition={{ ease: EASE, duration: 0.5 }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    borderRadius: "24px",
                    overflow: "hidden",
                    aspectRatio: "4/5",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                  }}
                >
                  <img src={PHOTO.hero} alt="Cleaning Service" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  
                  {/* Floating Badge */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      bottom: "30px",
                      left: "-20px", // Slight overhang
                      backgroundColor: C.white,
                      padding: "20px",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    <div style={{
                      width: "50px", height: "50px", borderRadius: "12px", backgroundColor: C.primaryLight,
                      display: "flex", alignItems: "center", justifyContent: "center", color: C.primary
                    }}>
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, color: C.text, lineHeight: 1 }}>100%</div>
                      <div style={{ fontFamily: SANS, fontSize: "14px", color: C.textMuted, fontWeight: 600 }}>Garanti</div>
                    </div>
                  </motion.div>

                </motion.div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 24px", backgroundColor: C.primary }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "40px" }}>
            {[
              { num: "5+", label: "Années d'expérience" },
              { num: "1k+", label: "Espaces nettoyés" },
              { num: "100%", label: "Satisfaction" },
              { num: "24/7", label: "Support client" }
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div style={{ textAlign: "center", color: C.white }}>
                  <div style={{ fontFamily: SERIF, fontSize: "48px", fontWeight: 800, marginBottom: "8px" }}>{stat.num}</div>
                  <div style={{ fontFamily: SANS, fontSize: "16px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: "120px 24px", backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px", maxWidth: "800px", margin: "0 auto 80px" }}>
            <Reveal>
              <Eyebrow>Nos Prestations</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: C.text, marginTop: "16px", marginBottom: "24px", lineHeight: 1.2 }}>
                Des services conçus pour <span style={{ color: C.primary }}>briller</span>
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "18px", color: C.textMuted }}>
                Que ce soit pour votre domicile ou votre entreprise, nous avons la solution de nettoyage parfaite pour vous.
              </p>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))", gap: "40px" }}>
            {services.map((service, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  style={{
                    backgroundColor: C.bgCard,
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                    <img 
                      src={PHOTO.services[index % PHOTO.services.length]} 
                      alt={service.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    <div style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: C.white, padding: "12px", borderRadius: "50%", color: C.primary }}>
                      {index === 0 ? <HomeIcon size={24} /> : index === 1 ? <User size={24} /> : <Droplets size={24} />}
                    </div>
                  </div>
                  <div style={{ padding: "40px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "16px" }}>
                      {service.title}
                    </h3>
                    <p style={{ fontFamily: SANS, fontSize: "16px", color: C.textMuted, lineHeight: 1.6, marginBottom: "32px", flexGrow: 1 }}>
                      {service.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", color: C.primary, fontWeight: 600, fontFamily: SANS, cursor: "pointer", gap: "8px" }}>
                      En savoir plus <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Estimate Slider Section */}
      <section id="tarifs" style={{ padding: "120px 24px", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
           <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Reveal>
              <Eyebrow>Estimation instantanée</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: C.text, marginTop: "16px" }}>
                Calculez votre tarif
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div style={{ 
              backgroundColor: C.bgCard, 
              borderRadius: "32px", 
              padding: "clamp(24px, 5vw, 60px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              border: `1px solid rgba(0,0,0,0.05)`
            }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "40px" }}>
                {/* Left controls */}
                <div>
                  <h3 style={{ fontFamily: SANS, fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: C.text }}>
                    Nombre d'heures estimées
                  </h3>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                    <input 
                      type="range" 
                      min="2" 
                      max="10" 
                      step="0.5" 
                      value={hours} 
                      onChange={(e) => setHours(parseFloat(e.target.value))}
                      style={{ 
                        flexGrow: 1, 
                        accentColor: C.primary,
                        height: "8px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }} 
                    />
                    <div style={{ 
                      fontFamily: SERIF, 
                      fontSize: "24px", 
                      fontWeight: 700, 
                      color: C.primary,
                      minWidth: "60px",
                      textAlign: "right"
                    }}>
                      {hours}h
                    </div>
                  </div>

                  <h3 style={{ fontFamily: SANS, fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: C.text }}>
                    Fréquence
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { id: "weekly", label: "Hebdomadaire", discount: "-10%" },
                      { id: "biweekly", label: "Bimensuel", discount: "-5%" },
                      { id: "once", label: "Une seule fois", discount: null }
                    ].map(freq => (
                      <label key={freq.id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        border: `2px solid ${frequency === freq.id ? C.primary : "#e2e8f0"}`,
                        backgroundColor: frequency === freq.id ? C.primaryLight + "20" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <input 
                            type="radio" 
                            name="frequency" 
                            value={freq.id}
                            checked={frequency === freq.id}
                            onChange={() => setFrequency(freq.id)}
                            style={{ accentColor: C.primary, width: "18px", height: "18px" }}
                          />
                          <span style={{ fontFamily: SANS, fontWeight: 600, color: C.text }}>{freq.label}</span>
                        </div>
                        {freq.discount && (
                          <span style={{ fontFamily: SANS, fontSize: "12px", fontWeight: 700, color: C.accent, backgroundColor: C.text, padding: "4px 8px", borderRadius: "8px" }}>
                            {freq.discount}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right Result */}
                <div style={{ 
                  backgroundColor: C.primary, 
                  borderRadius: "24px", 
                  padding: "40px", 
                  color: C.white,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}>
                  <Calculator size={48} style={{ opacity: 0.8, marginBottom: "24px" }} />
                  <div style={{ fontFamily: SANS, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", opacity: 0.9 }}>
                    Tarif Estimé
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, lineHeight: 1, marginBottom: "16px" }}>
                    {calculateEstimate()}€
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: "14px", opacity: 0.8, marginBottom: "40px" }}>
                    *Ceci est une estimation. Le prix final peut varier selon l'état des lieux.
                  </div>
                  <Button style={{ width: "100%", backgroundColor: C.white, color: C.primary, border: "none" }}>
                    Réserver maintenant
                  </Button>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="avantages" style={{ padding: "120px 24px", backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "80px", alignItems: "center" }}>
            
            <Reveal direction="right">
              <div style={{ position: "relative" }}>
                <img src={PHOTO.about} alt="About Us" style={{ width: "100%", borderRadius: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} />
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  backgroundColor: C.accent,
                  color: C.text,
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  fontFamily: SERIF,
                  fontWeight: 800,
                  fontSize: "32px",
                  lineHeight: 1
                }}>
                  100%
                  <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: SANS }}>Fiable</span>
                </motion.div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>Pourquoi Nous Choisir</Eyebrow>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: C.text, marginTop: "16px", marginBottom: "32px" }}>
                  Une approche différente du nettoyage
                </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {[
                    { icon: Shield, title: "Personnel de confiance", desc: "Tous nos agents sont rigoureusement sélectionnés et formés." },
                    { icon: Clock, title: "Ponctualité garantie", desc: "Nous respectons votre emploi du temps à la minute près." },
                    { icon: Droplets, title: "Produits écologiques", desc: "Des solutions respectueuses de votre santé et de l'environnement." }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "20px" }}>
                      <div style={{ 
                        width: "60px", 
                        height: "60px", 
                        borderRadius: "16px", 
                        backgroundColor: C.white,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.primary,
                        flexShrink: 0,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                      }}>
                        <item.icon size={28} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>{item.title}</h4>
                        <p style={{ fontFamily: SANS, fontSize: "16px", color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={{ padding: "120px 24px", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Reveal>
              <Eyebrow>Nos Réalisations</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: C.text, marginTop: "16px" }}>
                Des résultats éclatants
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "24px" }}>
            {PHOTO.gallery.map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{ borderRadius: "24px", overflow: "hidden", aspectRatio: "1", cursor: "pointer" }}
                >
                  <img src={img} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="témoignages" style={{ padding: "120px 24px", backgroundColor: C.primary, position: "relative", overflow: "hidden" }}>
        
        {/* Decorative quotes */}
        <div style={{ position: "absolute", top: "40px", left: "40px", opacity: 0.1 }}>
          <Quote size={200} color={C.white} />
        </div>
        
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <Reveal>
              <Eyebrow color={C.accent}>Avis Clients</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: C.white, marginTop: "16px" }}>
                Ce qu'ils disent de nous
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))", gap: "32px" }}>
            {testimonials.map((testi, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div style={{
                  backgroundColor: C.white,
                  borderRadius: "24px",
                  padding: "40px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{ display: "flex", color: C.accent, marginBottom: "24px" }}>
                    {[1,2,3,4,5].map(star => <Star key={star} size={20} fill={C.accent} />)}
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: "18px", color: C.text, lineHeight: 1.6, fontStyle: "italic", marginBottom: "32px", flexGrow: 1 }}>
                    "{testi.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: C.bgDeep, backgroundImage: `url(https://i.pravatar.cc/150?img=${i+20})`, backgroundSize: "cover" }} />
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 700, color: C.text }}>{testi.name}</div>
                      <div style={{ fontFamily: SANS, fontSize: "14px", color: C.textMuted }}>{testi.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "120px 24px", backgroundColor: C.bg }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: C.text, marginTop: "16px" }}>
                Questions Fréquentes
              </h2>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { q: "Fournissez-vous les produits de nettoyage ?", a: "Oui, nous apportons tout le matériel et les produits nécessaires, tous respectueux de l'environnement." },
              { q: "Dois-je être présent pendant le nettoyage ?", a: "Ce n'est pas obligatoire. Vous pouvez nous confier vos clés ou être présent selon votre préférence." },
              { q: "Comment modifier ou annuler un rendez-vous ?", a: "Vous pouvez modifier ou annuler gratuitement jusqu'à 24h avant l'intervention via votre espace client ou par téléphone." },
              { q: "Vos agents sont-ils assurés ?", a: "Absolument. Tous nos agents sont entièrement assurés en cas de dommage accidentel lors de la prestation." }
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div 
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  style={{
                    backgroundColor: C.white,
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    border: `1px solid ${activeFAQ === i ? C.primary : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: activeFAQ === i ? `0 10px 20px ${C.primary}10` : "none",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 600, color: C.text }}>{faq.q}</h4>
                    <motion.div animate={{ rotate: activeFAQ === i ? 180 : 0 }}>
                      <ChevronDown size={20} color={activeFAQ === i ? C.primary : C.textMuted} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {activeFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ fontFamily: SANS, fontSize: "16px", color: C.textMuted, lineHeight: 1.6 }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section style={{ padding: "120px 24px", backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: C.white, borderRadius: "40px", overflow: "hidden", display: "flex", flexDirection: "column", md: { flexDirection: "row" }, boxShadow: "0 40px 80px rgba(0,0,0,0.05)" }} className="md:flex-row flex-col flex">
          
          <div style={{ flex: 1, padding: "clamp(40px, 6vw, 80px)", backgroundColor: C.primary, color: C.white }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, marginBottom: "24px", lineHeight: 1.2 }}>
              Prêt à faire briller votre intérieur ?
            </h2>
            <p style={{ fontFamily: SANS, fontSize: "18px", opacity: 0.9, marginBottom: "40px", lineHeight: 1.6 }}>
              Contactez-nous dès aujourd'hui pour un devis personnalisé ou pour planifier votre première prestation.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={24} />
                </div>
                <div style={{ fontFamily: SANS, fontSize: "20px", fontWeight: 600 }}>{phone}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={24} />
                </div>
                <div style={{ fontFamily: SANS, fontSize: "20px", fontWeight: 600 }}>{email}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={24} />
                </div>
                <div style={{ fontFamily: SANS, fontSize: "18px", fontWeight: 600 }}>{address}</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "clamp(40px, 6vw, 80px)" }}>
            <h3 style={{ fontFamily: SERIF, fontSize: "28px", fontWeight: 700, color: C.text, marginBottom: "32px" }}>
              Envoyez-nous un message
            </h3>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <input type="text" placeholder="Votre nom" style={{ padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: SANS, fontSize: "16px", outline: "none", width: "100%" }} />
              <input type="email" placeholder="Votre email" style={{ padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: SANS, fontSize: "16px", outline: "none", width: "100%" }} />
              <textarea placeholder="Votre message" rows={4} style={{ padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: SANS, fontSize: "16px", outline: "none", width: "100%", resize: "vertical" }} />
              <Button style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                Envoyer <ArrowRight size={18} />
              </Button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#0f172a", color: "#f8fafc", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "40px", marginBottom: "60px" }}>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}>
                  <Zap size={24} />
                </div>
                <span style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, lineHeight: 1 }}>
                  {companyName}
                </span>
              </div>
              <p style={{ fontFamily: SANS, fontSize: "16px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "24px" }}>
                {tagline}
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <InstagramIcon size={24} color="#94a3b8" style={{ cursor: "pointer" }} />
                <Facebook size={24} color="#94a3b8" style={{ cursor: "pointer" }} />
                <Twitter size={24} color="#94a3b8" style={{ cursor: "pointer" }} />
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Liens Utiles</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Accueil", "À Propos", "Services", "Tarifs", "Contact"].map(link => (
                  <li key={link}>
                    <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontFamily: SANS, fontSize: "16px", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = C.primary} onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Horaires</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontFamily: SANS, color: "#94a3b8" }}>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Lun - Ven:</span> <span>08:00 - 19:00</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Samedi:</span> <span>09:00 - 17:00</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Dimanche:</span> <span>Fermé</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Newsletter</h4>
              <p style={{ fontFamily: SANS, fontSize: "14px", color: "#94a3b8", marginBottom: "16px" }}>
                Recevez nos astuces propreté et nos offres exclusives.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="email" placeholder="Email" style={{ padding: "12px 16px", borderRadius: "8px", border: "none", outline: "none", flexGrow: 1, fontFamily: SANS }} />
                <button style={{ backgroundColor: C.primary, color: C.white, border: "none", borderRadius: "8px", padding: "0 16px", cursor: "pointer" }}>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: "32px", display: "flex", flexDirection: "column", md: { flexDirection: "row" }, justifyContent: "space-between", alignItems: "center", gap: "16px", fontFamily: SANS, fontSize: "14px", color: "#64748b" }} className="md:flex-row flex-col flex">
            <div>&copy; {new Date().getFullYear()} {companyName}. Tous droits réservés.</div>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Mentions Légales</a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Politique de Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
