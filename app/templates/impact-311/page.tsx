"use client";
// @ts-nocheck
import React, { useRef, useState, useEffect, FormEvent } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Zap,
  Settings,
  Wrench,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  Cpu,
  Activity,
  BatteryCharging,
  Gauge
} from 'lucide-react';
const Facebook = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Twitter = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);

/*
 * ========================================================
 * TEMPLATE: Atelier Performance (Garage - Dark Premium)
 * ID: impact-311
 * DESCRIPTION: High-end mechanical workshop template with a dark, premium aesthetic and subtle neon glows.
 * FONTS: Orbitron (Headings), Inter (Body)
 * COLORS: Deep Anthracite (#0d0d11), Electric Blue (#2563eb)
 * ========================================================
 */

// ==========================================
// 1. UTILS & CONSTANTS
// ==========================================

const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt("" + R * (100 + percent) / 100);
  G = parseInt("" + G * (100 + percent) / 100);
  B = parseInt("" + B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
};

const DEFAULT_BRAND_COLOR = "#2563eb";

const C = {
  primary: DEFAULT_BRAND_COLOR,
  primaryLight: shadeColor(DEFAULT_BRAND_COLOR, 20),
  primaryDark: shadeColor(DEFAULT_BRAND_COLOR, -20),
  bg: '#0d0d11',
  bgDeep: '#050507',
  bgCard: '#15151c',
  bgHover: '#1f1f2a',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  accent: '#3b82f6',
  white: '#ffffff',
  black: '#000000',
  border: '#2a2a35'
};

const SERIF = "'Orbitron', sans-serif";
const SANS = "'Inter', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTO = {
  hero: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  about: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  service1: "https://images.unsplash.com/photo-1517524285303-d6fc6834adb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  service2: "https://images.unsplash.com/photo-1520623631622-44f2d3bbbd08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  service3: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery1: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery2: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery3: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery4: "https://images.unsplash.com/photo-1503375894013-7b41469bf1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

// ==========================================
// 2. INLINE ICONS & COMPONENTS
// ==========================================

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Reveal = ({ children, delay = 0, direction = 'up', width = '100%' }: { children: React.ReactNode, delay?: number, direction?: 'up'|'down'|'left'|'right', width?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <div ref={ref} style={{ width, position: 'relative', overflow: 'hidden' }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Eyebrow = ({ children, color = C.primary }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: EASE }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    }}
  >
    <span style={{ width: '30px', height: '2px', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
    <span style={{
      fontFamily: SERIF,
      fontSize: '0.875rem',
      fontWeight: 700,
      letterSpacing: '0.15em',
      color: color,
      textTransform: 'uppercase'
    }}>
      {children}
    </span>
  </motion.div>
);

const Button = ({ children, variant = 'primary', icon, onClick, className = '' }: any) => {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: isPrimary ? C.primaryLight : C.bgHover }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1rem 2rem',
        backgroundColor: isPrimary ? C.primary : 'transparent',
        color: isPrimary ? C.white : C.text,
        border: `1px solid ${isPrimary ? C.primary : C.border}`,
        borderRadius: '0px',
        fontFamily: SERIF,
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isPrimary ? `0 0 20px ${C.primary}40` : 'none',
        transition: 'all 0.3s ease'
      }}
      className={className}
    >
      <span style={{ zIndex: 1, position: 'relative' }}>{children}</span>
      {icon && <span style={{ zIndex: 1, position: 'relative' }}>{icon}</span>}
      {isPrimary && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease',
        }} className="btn-shine" />
      )}
    </motion.button>
  );
};

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function AtelierPerformanceTemplate() {
  const [session, setSession] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Data States
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  
  // Theme State
  const [themeColor, setThemeColor] = useState(DEFAULT_BRAND_COLOR);

  useEffect(() => {
    setIsMounted(true);
    
    // Simulate fetching session
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data && data.session) {
          setSession(data.session);
          if (data.session.brandColor) {
            setThemeColor(data.session.brandColor);
            C.primary = data.session.brandColor;
            C.primaryLight = shadeColor(data.session.brandColor, 20);
            C.primaryDark = shadeColor(data.session.brandColor, -20);
          }
        }
      } catch (err) {
        console.log("No session found, using defaults");
      }
    };
    
    fetchSession();
    
    // Fallback Data
    const defaultServices = [
      {
        title: "Reprogrammation Moteur",
        description: "Optimisation de la cartographie moteur pour des performances accrues et une consommation réduite.",
        icon: <Cpu size={32} color={C.primary} />,
        features: ["Stage 1, 2, 3", "Passage au banc de puissance", "Garantie logicielle"]
      },
      {
        title: "Préparation Châssis",
        description: "Amélioration de la tenue de route avec des pièces haute performance pour circuit ou route.",
        icon: <Settings size={32} color={C.primary} />,
        features: ["Suspensions combinés filetés", "Barres anti-rapprochement", "Réglage géométrie sur mesure"]
      },
      {
        title: "Échappement Sur Mesure",
        description: "Création et installation de lignes d'échappement sport pour une sonorité envoûtante.",
        icon: <Gauge size={32} color={C.primary} />,
        features: ["Inox haute qualité", "Ligne complète avec ou sans clapet", "Homologation sur demande"]
      }
    ];

    const defaultTestimonials = [
      {
        name: "Julien R.",
        role: "Propriétaire BMW M3",
        text: "Un travail d'orfèvre sur ma M3. La reprogrammation est parfaite, la courbe de puissance est lisse et impressionnante. L'équipe est passionnée et à l'écoute.",
        rating: 5
      },
      {
        name: "Sophie T.",
        role: "Pilote Amateur",
        text: "Le réglage châssis réalisé pour mes trackdays a complètement transfiguré ma voiture. Je gagne de précieuses secondes à chaque tour en toute sécurité.",
        rating: 5
      },
      {
        name: "Marc E.",
        role: "Passionné Auto",
        text: "Ligne d'échappement installée avec soin. Le son est incroyable tout en restant raisonnable à bas régime. Superbe expérience du début à la fin.",
        rating: 5
      }
    ];

    const defaultFaqs = [
      {
        question: "La reprogrammation annule-t-elle la garantie constructeur ?",
        answer: "Certains constructeurs peuvent annuler la garantie si la modification est détectée. Nous proposons des solutions de retour à l'origine en cas de besoin et sauvegardons toujours votre cartographie d'origine."
      },
      {
        question: "Combien de temps faut-il pour une préparation Stage 1 ?",
        answer: "Une reprogrammation Stage 1 classique prend généralement une demi-journée. Cela inclut le diagnostic, la lecture, la modification, l'écriture et le passage au banc pour valider les gains."
      },
      {
        question: "Fournissez-vous des véhicules de courtoisie ?",
        answer: "Oui, nous mettons à disposition de nos clients des véhicules de courtoisie sur réservation préalable pendant la durée de l'intervention sur votre véhicule."
      }
    ];

    setServices(defaultServices);
    setTestimonials(defaultTestimonials);
    setFaqs(defaultFaqs);

  }, []);

  const fd = session?.formData;
  const c = session?.generatedContent;

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero shot and about-section image first.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) PHOTO.hero = p[0];
    if (p[1]) PHOTO.about = p[1];
    if (p[2]) PHOTO.gallery1 = p[2];
    if (p[3]) PHOTO.gallery2 = p[3];
    if (p[4]) PHOTO.gallery3 = p[4];
    if (p[5]) PHOTO.gallery4 = p[5];
  }, [fd]);

  const businessName = fd?.businessName || "Atelier Performance";
  const heroTitle = c?.heroTitle || "L'Excellence Mécanique à l'État Pur.";
  const heroSubtitle = c?.heroSubtitle || "Spécialistes en préparation et optimisation de véhicules de prestige. Poussez les limites de votre machine avec notre expertise de pointe.";
  
  if (!isMounted) return null;

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: SANS, minHeight: '100vh', overflowX: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: ${C.bg}; color: ${C.text}; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.primary}; }
        
        .glass-nav {
          background: rgba(13, 13, 17, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .btn-shine:hover {
          transform: translateX(100%) !important;
        }

        .neon-text {
          text-shadow: 0 0 10px ${C.primary}80, 0 0 20px ${C.primary}40;
        }

        .grid-bg {
          background-image: 
            linear-gradient(to right, ${C.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${C.border} 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.2;
        }
      `}} />

      {/* NAVIGATION */}
      <Navigation businessName={businessName} themeColor={themeColor} logoBase64={fd?.logoBase64} />

      {/* MAIN CONTENT */}
      <main>
        
        {/* HERO SECTION */}
        <section style={{ 
          position: 'relative', 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px',
          overflow: 'hidden'
        }}>
          {/* Background Image & Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${PHOTO.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(90deg, ${C.bgDeep} 0%, rgba(5,5,7,0.8) 50%, rgba(5,5,7,0.4) 100%)`,
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at 80% 50%, ${C.primary}20 0%, transparent 50%)`,
            zIndex: 1
          }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <Reveal delay={0.2}>
                <Eyebrow color={themeColor}>Atelier Performance</Eyebrow>
              </Reveal>
              
              <Reveal delay={0.4}>
                <h1 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                  color: C.white,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  {heroTitle.split(' ').map((word, i) => (
                    <span key={i} style={{ 
                      color: i % 3 === 0 ? themeColor : C.white,
                      display: 'inline-block',
                      marginRight: '0.3em',
                      textShadow: i % 3 === 0 ? `0 0 20px ${themeColor}60` : 'none'
                    }}>{word}</span>
                  ))}
                </h1>
              </Reveal>

              <Reveal delay={0.6}>
                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: C.textMuted,
                  marginBottom: '2.5rem',
                  maxWidth: '500px'
                }}>
                  {heroSubtitle}
                </p>
              </Reveal>

              <Reveal delay={0.8}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button variant="primary" icon={<ArrowRight size={18} />} onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
                    Réserver un Diagnostic
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>
                    Découvrir nos services
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: C.textMuted
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
            <div style={{ width: '1px', height: '40px', backgroundColor: C.border, position: 'relative', overflow: 'hidden' }}>
              <motion.div 
                animate={{ y: [-40, 40] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ width: '100%', height: '50%', backgroundColor: themeColor }}
              />
            </div>
          </motion.div>
        </section>

        {/* STATS STRIP */}
        <section style={{ backgroundColor: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '3rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { value: "15+", label: "Années d'expérience" },
              { value: "500+", label: "Véhicules préparés" },
              { value: "100%", label: "Satisfaction client" },
              { value: "3", label: "Bancs de puissance" }
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div style={{
                  fontFamily: SERIF,
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: '0.5rem',
                  textShadow: `0 0 15px ${themeColor}40`
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" style={{ padding: '8rem 2rem', position: 'relative' }}>
          <div className="grid-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} />
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
              <Reveal>
                <Eyebrow color={themeColor}>Nos Compétences</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: C.white,
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  Des Services Taillés pour la <span style={{ color: themeColor }}>Performance</span>
                </h2>
                <p style={{ color: C.textMuted, fontSize: '1.125rem' }}>
                  De la simple reprogrammation à la préparation complète pour la compétition, nous maîtrisons chaque aspect de la mécanique haute performance.
                </p>
              </Reveal>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: '2rem'
            }}>
              {services.map((srv, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    style={{
                      backgroundColor: C.bgCard,
                      border: `1px solid ${C.border}`,
                      padding: '2.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Hover Glow */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100%',
                      height: '2px',
                      background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
                      opacity: 0.5
                    }} />

                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: `${themeColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0',
                      marginBottom: '1.5rem',
                      border: `1px solid ${themeColor}30`
                    }}>
                      {srv.icon}
                    </div>
                    
                    <h3 style={{
                      fontFamily: SERIF,
                      fontSize: '1.25rem',
                      color: C.white,
                      marginBottom: '1rem',
                      textTransform: 'uppercase'
                    }}>{srv.title}</h3>
                    
                    <p style={{ color: C.textMuted, marginBottom: '2rem', flexGrow: 1 }}>
                      {srv.description}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {srv.features.map((feature: string, idx: number) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: C.text,
                          fontSize: '0.875rem',
                          marginBottom: '0.75rem'
                        }}>
                          <CheckCircle2 size={16} color={themeColor} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US SECTION (IMAGE + TEXT) */}
        <section style={{ backgroundColor: C.bgDeep, padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            
            <Reveal direction="left">
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px', left: '-20px',
                  width: '100%', height: '100%',
                  border: `2px solid ${themeColor}`,
                  zIndex: 0
                }} />
                <img 
                  src={PHOTO.about} 
                  alt="Workshop" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'grayscale(50%) contrast(1.2)'
                  }}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: '-30px', right: '-30px',
                    backgroundColor: C.bgCard,
                    padding: '2rem',
                    border: `1px solid ${C.border}`,
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '50px', height: '50px', 
                      backgroundColor: `${themeColor}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%'
                    }}>
                      <Shield color={themeColor} size={24} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: '1.25rem', color: C.white, fontWeight: 700 }}>Garantie</div>
                      <div style={{ color: C.textMuted, fontSize: '0.875rem' }}>Sur toutes interventions</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Reveal>

            <div>
              <Reveal direction="right">
                <Eyebrow color={themeColor}>L'Atelier</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  color: C.white,
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  Une passion guidée par la <span style={{ color: themeColor }}>Technique</span>
                </h2>
                <p style={{ color: C.textMuted, fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  Fondé par des ingénieurs motoristes passionnés, notre atelier est équipé des dernières technologies de diagnostic et de métrologie. Nous ne faisons pas que remplacer des pièces, nous concevons des solutions.
                </p>
                <p style={{ color: C.textMuted, fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                  Chaque véhicule qui entre chez nous est traité avec le même niveau d'exigence qu'une voiture de course. La précision est notre standard, la performance notre objectif.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {[
                    { icon: <Activity size={24} color={themeColor} />, title: "Banc de Puissance 4x4" },
                    { icon: <Wrench size={24} color={themeColor} />, title: "Outillage de Précision" },
                    { icon: <Award size={24} color={themeColor} />, title: "Techniciens Certifiés" },
                    { icon: <BatteryCharging size={24} color={themeColor} />, title: "Diagnostic Avancé" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {item.icon}
                      <span style={{ color: C.text, fontSize: '0.875rem', fontWeight: 500 }}>{item.title}</span>
                    </div>
                  ))}
                </div>

                <Button variant="primary">En Savoir Plus</Button>
              </Reveal>
            </div>

          </div>
        </section>

        {/* GALLERY / REALIZATIONS */}
        <section style={{ padding: '8rem 2rem', backgroundColor: C.bg }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ maxWidth: '600px' }}>
                <Reveal>
                  <Eyebrow color={themeColor}>Nos Réalisations</Eyebrow>
                  <h2 style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                    color: C.white,
                    textTransform: 'uppercase',
                    lineHeight: 1.2
                  }}>
                    Machines <span style={{ color: themeColor }}>Optimisées</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                <Button variant="outline" className="hidden sm:inline-flex">Voir tout le portfolio</Button>
              </Reveal>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
              gap: '1rem'
            }}>
              {[PHOTO.gallery1, PHOTO.gallery2, PHOTO.gallery3, PHOTO.gallery4].map((src, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'relative',
                      height: '300px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <img 
                      src={src} 
                      alt={`Realization ${i+1}`} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(30%)',
                        transition: 'filter 0.4s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.filter = 'grayscale(0%)'}
                      onMouseOut={e => e.currentTarget.style.filter = 'grayscale(30%)'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      padding: '1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.4s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <h4 style={{ fontFamily: SERIF, color: C.white, margin: '0 0 0.5rem 0' }}>Projet Alpha {i+1}</h4>
                      <p style={{ color: themeColor, fontSize: '0.875rem', margin: 0 }}>Stage 2 + Ligne</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'block' }} className="sm:hidden">
              <Button variant="outline">Voir tout le portfolio</Button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ backgroundColor: C.bgCard, padding: '8rem 2rem', borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <Reveal>
                <Eyebrow color={themeColor}>Témoignages</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  color: C.white,
                  textTransform: 'uppercase',
                  lineHeight: 1.2
                }}>
                  Ils nous font <span style={{ color: themeColor }}>Confiance</span>
                </h2>
              </Reveal>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '2rem'
            }}>
              {testimonials.map((testi, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div style={{
                    backgroundColor: C.bg,
                    padding: '2.5rem',
                    border: `1px solid ${C.border}`,
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={16} fill={idx < testi.rating ? themeColor : 'none'} color={idx < testi.rating ? themeColor : C.border} />
                      ))}
                    </div>
                    <p style={{ 
                      color: C.text, 
                      fontSize: '1rem', 
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                      marginBottom: '2rem'
                    }}>
                      "{testi.text}"
                    </p>
                    <div>
                      <div style={{ fontFamily: SERIF, color: C.white, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {testi.name}
                      </div>
                      <div style={{ color: C.textMuted, fontSize: '0.875rem' }}>
                        {testi.role}
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '2rem', right: '2rem',
                      opacity: 0.1,
                      fontFamily: SERIF,
                      fontSize: '4rem',
                      lineHeight: 1,
                      color: themeColor
                    }}>
                      "
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ padding: '8rem 2rem', backgroundColor: C.bgDeep }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <Reveal>
                <Eyebrow color={themeColor}>FAQ</Eyebrow>
                <h2 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                  color: C.white,
                  textTransform: 'uppercase',
                  lineHeight: 1.2
                }}>
                  Questions <span style={{ color: themeColor }}>Fréquentes</span>
                </h2>
              </Reveal>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} themeColor={themeColor} />
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" style={{ padding: '8rem 2rem', backgroundColor: C.bg, position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
              gap: '4rem'
            }}>
              
              <Reveal direction="left">
                <div>
                  <Eyebrow color={themeColor}>Contact</Eyebrow>
                  <h2 style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                    color: C.white,
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                    marginBottom: '1.5rem'
                  }}>
                    Prendre <span style={{ color: themeColor }}>Rendez-vous</span>
                  </h2>
                  <p style={{ color: C.textMuted, fontSize: '1.125rem', marginBottom: '3rem' }}>
                    Prêt à libérer le potentiel de votre véhicule ? Contactez-nous pour un devis personnalisé ou pour réserver votre session sur banc.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: C.bgCard, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin color={themeColor} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SERIF, color: C.white, margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Adresse</h4>
                        <p style={{ color: C.textMuted, margin: 0 }}>Z.A. Les Portes de la Forêt<br/>77000 Melun, France</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: C.bgCard, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone color={themeColor} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SERIF, color: C.white, margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Téléphone</h4>
                        <p style={{ color: C.textMuted, margin: 0 }}>+33 (0)1 23 45 67 89</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: C.bgCard, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock color={themeColor} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: SERIF, color: C.white, margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Horaires</h4>
                        <p style={{ color: C.textMuted, margin: 0 }}>Lundi - Vendredi: 9h - 18h<br/>Samedi: Sur rendez-vous</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="right">
                <div style={{
                  backgroundColor: C.bgCard,
                  padding: '3rem',
                  border: `1px solid ${C.border}`,
                  position: 'relative'
                }}>
                  {/* Decorative corner */}
                  <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '30px', height: '30px', borderTop: `2px solid ${themeColor}`, borderRight: `2px solid ${themeColor}` }} />
                  <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '30px', height: '30px', borderBottom: `2px solid ${themeColor}`, borderLeft: `2px solid ${themeColor}` }} />
                  
                  <h3 style={{ fontFamily: SERIF, color: C.white, fontSize: '1.5rem', marginBottom: '2rem', textTransform: 'uppercase' }}>Demande de Devis</h3>
                  
                  <form onSubmit={(e) => { e.preventDefault(); alert("Formulaire envoyé (démo)"); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Nom complet" 
                        required
                        style={{
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: C.bgDeep,
                          border: `1px solid ${C.border}`,
                          color: C.text,
                          fontFamily: SANS,
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = themeColor}
                        onBlur={(e) => e.target.style.borderColor = C.border}
                      />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        required
                        style={{
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: C.bgDeep,
                          border: `1px solid ${C.border}`,
                          color: C.text,
                          fontFamily: SANS,
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = themeColor}
                        onBlur={(e) => e.target.style.borderColor = C.border}
                      />
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Véhicule (Marque, Modèle, Année, Motorisation)" 
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: C.bgDeep,
                        border: `1px solid ${C.border}`,
                        color: C.text,
                        fontFamily: SANS,
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = themeColor}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    />
                    
                    <textarea 
                      placeholder="Détails de votre demande (Reprogrammation, pièces, etc.)" 
                      rows={4}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: C.bgDeep,
                        border: `1px solid ${C.border}`,
                        color: C.text,
                        fontFamily: SANS,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = themeColor}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    ></textarea>
                    
                    <Button variant="primary" style={{ width: '100%' }}>Envoyer la demande</Button>
                  </form>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#050507', borderTop: `1px solid ${C.border}`, paddingTop: '5rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 800, color: C.white, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {businessName}
                <span style={{ color: themeColor }}>.</span>
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                L'expert de la reprogrammation moteur et de la préparation sur mesure. Libérez le potentiel de votre véhicule avec des professionnels passionnés.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <SocialLink icon={<InstagramIcon size={20} />} themeColor={themeColor} />
                <SocialLink icon={<Facebook size={20} />} themeColor={themeColor} />
                <SocialLink icon={<Twitter size={20} />} themeColor={themeColor} />
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, color: C.white, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Services</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <FooterLink>Reprogrammation Moteur</FooterLink>
                <FooterLink>Préparation Châssis</FooterLink>
                <FooterLink>Ligne d'Échappement</FooterLink>
                <FooterLink>Passage au Banc</FooterLink>
                <FooterLink>Entretien Spécifique</FooterLink>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, color: C.white, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Entreprise</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <FooterLink>À Propos</FooterLink>
                <FooterLink>Nos Réalisations</FooterLink>
                <FooterLink>Témoignages</FooterLink>
                <FooterLink>FAQ</FooterLink>
                <FooterLink>Contact</FooterLink>
              </ul>
            </div>

          </div>

          <div style={{ 
            borderTop: `1px solid ${C.border}`, 
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ color: C.textMuted, fontSize: '0.75rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} {businessName}. Tous droits réservés.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ color: C.textMuted, fontSize: '0.75rem', cursor: 'pointer' }}>Mentions Légales</span>
              <span style={{ color: C.textMuted, fontSize: '0.75rem', cursor: 'pointer' }}>Politique de Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ==========================================
// 4. HELPER COMPONENTS
// ==========================================

const Navigation = ({ businessName, themeColor, logoBase64 }: { businessName: string, themeColor: string, logoBase64?: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        padding: scrolled ? '1rem 0' : '1.5rem 0',
        backgroundColor: scrolled ? 'rgba(13,13,17,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          {logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={logoBase64}
              alt={businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{
              fontFamily: SERIF,
              fontSize: '1.5rem',
              fontWeight: 800,
              color: C.white,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center'
            }}>
              {businessName.split(' ')[0]}
              <span style={{ color: themeColor }}>.</span>
            </div>
          )}

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <NavLink href="#services" themeColor={themeColor}>Services</NavLink>
            <NavLink href="#réalisations" themeColor={themeColor}>Réalisations</NavLink>
            <NavLink href="#faq" themeColor={themeColor}>FAQ</NavLink>
            <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="ml-4">
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: C.white, cursor: 'pointer', padding: '0.5rem' }}
            >
              <div style={{ width: '24px', height: '2px', backgroundColor: C.white, marginBottom: '6px', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }} />
              <div style={{ width: '24px', height: '2px', backgroundColor: C.white, marginBottom: '6px', opacity: mobileMenuOpen ? 0 : 1, transition: 'all 0.3s' }} />
              <div style={{ width: '24px', height: '2px', backgroundColor: C.white, transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0, right: 0,
              backgroundColor: C.bgDeep,
              borderBottom: `1px solid ${C.border}`,
              padding: '2rem',
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <MobileNavLink href="#services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="#réalisations" onClick={() => setMobileMenuOpen(false)}>Réalisations</MobileNavLink>
            <MobileNavLink href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</MobileNavLink>
            <Button variant="primary" onClick={() => { setMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); }}>
              Contact
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ href, children, themeColor }: any) => {
  return (
    <a 
      href={href}
      style={{
        color: C.text,
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontFamily: SERIF,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 500,
        transition: 'color 0.3s ease',
        position: 'relative'
      }}
      onMouseOver={(e) => e.currentTarget.style.color = themeColor}
      onMouseOut={(e) => e.currentTarget.style.color = C.text}
    >
      {children}
    </a>
  );
};

const MobileNavLink = ({ href, children, onClick }: any) => (
  <a 
    href={href} 
    onClick={onClick}
    style={{
      color: C.white,
      textDecoration: 'none',
      fontSize: '1.125rem',
      fontFamily: SERIF,
      textTransform: 'uppercase',
      fontWeight: 600,
      borderBottom: `1px solid ${C.border}`,
      paddingBottom: '1rem'
    }}
  >
    {children}
  </a>
);

const FooterLink = ({ children }: { children: React.ReactNode }) => (
  <li>
    <a 
      href="#" 
      style={{ 
        color: C.textMuted, 
        textDecoration: 'none', 
        fontSize: '0.875rem',
        transition: 'color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.color = C.white}
      onMouseOut={(e) => e.currentTarget.style.color = C.textMuted}
    >
      {children}
    </a>
  </li>
);

const SocialLink = ({ icon, themeColor }: { icon: React.ReactNode, themeColor: string }) => (
  <a 
    href="#"
    style={{
      width: '40px',
      height: '40px',
      backgroundColor: C.bgCard,
      border: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: C.white,
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.borderColor = themeColor;
      e.currentTarget.style.color = themeColor;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.borderColor = C.border;
      e.currentTarget.style.color = C.white;
    }}
  >
    {icon}
  </a>
);

const FaqItem = ({ question, answer, themeColor }: { question: string, answer: string, themeColor: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      backgroundColor: isOpen ? C.bgCard : 'transparent',
      transition: 'all 0.3s ease'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          color: C.white,
          fontFamily: SERIF,
          fontSize: '1.125rem',
          textAlign: 'left',
          cursor: 'pointer'
        }}
      >
        <span>{question}</span>
        <span style={{ color: themeColor }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: C.textMuted, lineHeight: 1.6 }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
