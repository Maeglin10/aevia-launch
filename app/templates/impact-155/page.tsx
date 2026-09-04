"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MapPin, Mail, Phone, BedDouble, Bath, Maximize, Star, TrendingUp } from "lucide-react"
import {
  clientCity,
  clientEmail,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientWorks,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

// ─── Design tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg: "#f8f7f4",
  bgSection: "#f0ede7",
  text: "#1e2b3c",
  textMuted: "#6b7a8d",
  accent: "var(--brand-light,#d4a853)",
  accentDark: "#b8903e",
  accentLight: "#fdf5e6",
  white: "#ffffff",
  border: "#e2ddd5",
  navy: "#1e3a5f",
  shadow: "0 2px 14px rgba(30,43,60,0.08)",
  shadowLg: "0 16px 48px rgba(30,43,60,0.14)",
};const FONT = "'Raleway', system-ui, sans-serif"
const FONT_SERIF = "'Playfair Display', Georgia, serif"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS_DEMO = [
  { value: "850+", label: "Biens vendus" },
  { value: "98%", label: "Satisfaction clients" },
  { value: "42j", label: "Délai moyen de vente" },
  { value: "20 ans", label: "D'expertise" },
]
let STATS = STATS_DEMO;

function BIENS_DEMO_SOURCE_LIVE() {
  return /* RÉALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ titre: o.title, lieu: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}) })), [
  { titre: "Appartement de standing", lieu: (clientCity(sessionData) ?? "Paris"), prix: "1 480 000 €", surface: "145 m²", pieces: 5, bains: 2, tag: "Exclusivité", img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80") },
  { titre: "Maison familiale", lieu: "Neuilly-sur-Seine", prix: "2 250 000 €", surface: "280 m²", pieces: 7, bains: 3, tag: "Coup de cœur", img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80") },
  { titre: "Penthouse vue Eiffel", lieu: (clientCity(sessionData) ?? "Paris"), prix: "3 900 000 €", surface: "210 m²", pieces: 5, bains: 3, tag: "Prestige", img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80") },
  { titre: "Villa contemporaine", lieu: "Saint-Cloud", prix: "1 850 000 €", surface: "320 m²", pieces: 8, bains: 4, tag: "Jardin", img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80") },
  { titre: "Loft design", lieu: (clientCity(sessionData) ?? "Paris"), prix: "890 000 €", surface: "120 m²", pieces: 3, bains: 2, tag: "Atypique", img: (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80") },
  { titre: "Résidence Belle Époque", lieu: (clientCity(sessionData) ?? "Paris"), prix: "2 650 000 €", surface: "195 m²", pieces: 6, bains: 3, tag: "Haussmannien", img: (clientPhotos(sessionData)[5] || "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80") },
]);
}
let BIENS_DEMO_SOURCE = BIENS_DEMO_SOURCE_LIVE();
let BIENS_DEMO = BIENS_DEMO_SOURCE;
let BIENS = BIENS_DEMO;

const SERVICES_SOURCE = [
  { titre: "Estimation gratuite", desc: "Évaluation précise de votre bien en 48h, basée sur notre analyse du marché local et notre expertise de 20 ans.", icon: <TrendingUp size={22} color={C.accent} /> },
  { titre: "Mise en valeur", desc: "Home staging, photos professionnelles, visites virtuelles 3D. Votre bien présenté sous son meilleur jour dès le premier regard.", icon: <Maximize size={22} color={C.accent} /> },
  { titre: "Accompagnement complet", desc: "De la première visite jusqu'à la signature chez le notaire, notre équipe gère chaque étape pour une transaction sereine.", icon: <Star size={22} color={C.accent} /> },
]
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_DEMO;

function TEMOIGNAGES_SOURCE_LIVE() {
  return [
  { texte: `Notre appartement parisien a été vendu en 18 jours au prix demandé. L'équipe ${clientName(sessionData) ?? "Pierre & Co"} a géré tout le processus avec un professionnalisme remarquable. Je recommande sans hésiter.`, auteur: "Catherine B.", detail: "Vente appartement 145 m², " + (clientCity(sessionData) ?? "Paris") },
  { texte: "Recherche longue et minutieuse, mais l'équipe ne s'est jamais découragée. Ils ont finalement trouvé notre maison de rêve à Neuilly — exactement ce que nous cherchions et dans notre budget.", auteur: "Famille Morin", detail: "Achat maison 280 m², Neuilly-sur-Seine" },
  { texte: "Honnêteté et transparence du début à la fin. Pas de surprises, pas de pression. Pierre & Co m'a conseillé au mieux de mes intérêts et pas des leurs. C'est rare dans ce métier.", auteur: "Jean-François A.", detail: "Achat + revente simultanés, " + (clientCity(sessionData) ?? "Paris") },
];
}
let TEMOIGNAGES_SOURCE = TEMOIGNAGES_SOURCE_LIVE();
let TEMOIGNAGES_DEMO = TEMOIGNAGES_SOURCE;
let TEMOIGNAGES = TEMOIGNAGES_DEMO;

// ─── Components ───────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function PierreCoPage() {
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  sessionData = session;
  c = session?.generatedContent;
  BIENS_DEMO_SOURCE = BIENS_DEMO_SOURCE_LIVE();
  TEMOIGNAGES_SOURCE = TEMOIGNAGES_SOURCE_LIVE();



  BIENS_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...BIENS_DEMO_SOURCE[i % BIENS_DEMO_SOURCE.length], titre: s.title, prix: s.price ?? BIENS_DEMO_SOURCE[i % BIENS_DEMO_SOURCE.length].prix })),
    BIENS_DEMO_SOURCE,
  );
  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  TEMOIGNAGES_DEMO = resolveList(
    clientReviews(session)?.map((r: any, i: number) => ({ ...TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length], auteur: r.author, texte: r.text })),
    TEMOIGNAGES_SOURCE,
  );
  STATS = resolveList(clientStats(session), STATS_DEMO);
  TEMOIGNAGES = resolveList(
    clientReviews(session)?.map((r, i) => ({ ...TEMOIGNAGES_DEMO[i % TEMOIGNAGES_DEMO.length], texte: r.text, auteur: r.author })),
    TEMOIGNAGES_DEMO,
  );
  BIENS = BIENS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[0 + i] || row.img,
  }));
  SERVICES = resolveList(
    clientServices(session)?.map((s, i) => ({ ...SERVICES_DEMO[i % SERVICES_DEMO.length], titre: s.title })),
    SERVICES_DEMO,
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 1;
    const _photoArrays: any[] = [BIENS];
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
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand };
  }

  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 5vw, 64px)",
        /* Voile sous la barre. */
        background: scrolled ? "rgba(248,247,244,0.97)" : "linear-gradient(180deg, rgba(16,18,22,0.72) 0%, rgba(16,18,22,0.30) 62%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <span style={{ textShadow: "0 0 2px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)",  fontFamily: FONT_SERIF, fontSize: 20, color: scrolled ? C.text : "#fff" }}>{clientName(sessionData) ?? "Pierre"}</span>
              {/* La seconde moitié du mot-symbole : « Pierre » + « & CO ». Un client qui a
                   un nom l'occupe entier — sinon on lit « Atelier Céleste & CO ». */}
              {!clientName(sessionData) && (
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: 2, marginLeft: 6 }}>&amp; CO</span>
              )}
            </>
          )}
        </div>
        <div style={{ gap: 32, alignItems: "center" }} className="hidden md:flex">
          {["Biens", "Services", "Estimation", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#estimation" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Estimer mon bien
          </motion.a>
        </div>
        
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </motion.nav>
      
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Biens", "Services", "Estimation", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#estimation" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Estimer mon bien
          </motion.a>
        </div>
      )}

      {/* Hero */}
      <style>{`@media (max-width: 640px) { #hero { height: 100dvh !important; min-height: 100dvh !important; } }`}</style>
      <section id="hero" ref={heroRef} style={{ height: "100dvh", minHeight: "640px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src={photo(6, "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80")} alt="Immobilier de prestige Pierre & Co" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,45,0.93) 0%, rgba(15,25,45,0.45) 45%, rgba(15,25,45,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}15 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 6vw, 80px) 90px", maxWidth: 820, y: heroTextY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(46px, 6vw, 84px)", fontWeight: 400, color: "#fff", lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 24 }}>{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>{<>{clientHeroLine(sessionData, 0, 2, 16) ?? "Votre bien,"}<br /><em style={{ color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 16) ?? "sa vraie valeur."}</em>
          </>}</>)}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
            Pierre & Co accompagne acheteurs et vendeurs exigeants depuis 2004. Transparence totale, évaluation précise, réseau sélect : votre transaction en mains expertes.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#biens" style={{ background: C.accent, color: C.text, borderRadius: 6, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, color: C.white, scale: 1.03 }}>
              Voir les biens <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#estimation" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Estimation gratuite
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.navy, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "36px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 400, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Biens */}
      <section id="biens" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos exclusivités</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: C.text, marginTop: 12, lineHeight: 1.1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "biens.titre") ?? (<>
              Biens d'exception, <em>sélection rigoureuse</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {BIENS.map((b, i) => (
            <Reveal key={b.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -6 }} style={{ borderRadius: 12, overflow: "hidden", background: C.white, boxShadow: C.shadow, cursor: "pointer" }}>
                <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                  <img src={b.img} alt={b.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: C.accent, color: C.text, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{b.tag}</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                    <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{b.prix}</div>
                  </div>
                </div>
                <div style={{ padding: "18px 22px 22px" }}>
                  <h3 style={{ fontFamily: FONT_SERIF, fontSize: 20, color: C.text, marginBottom: 8 }}>{b.titre}</h3>
                  <div style={{ display: "flex", gap: 14, color: C.textMuted, fontSize: 13 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{b.lieu}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Maximize size={12} />{b.surface}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BedDouble size={12} />{b.pieces}p</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bath size={12} />{b.bains}</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre expertise</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 3.5vw, 50px)", fontWeight: 400, color: C.text, marginTop: 12 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Un accompagnement <em>sans faille</em>.</>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28, maxWidth: 1000, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.1}>
              <div style={{ background: C.white, borderRadius: 14, padding: "36px 32px", boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
                <div style={{ marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontFamily: FONT_SERIF, fontSize: 22, color: C.text, marginBottom: 10 }}>{s.titre}</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section id="contact" style={{ padding: "100px 80px", background: C.navy }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 3.5vw, 50px)", fontWeight: 400, color: "#fff", marginTop: 12 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>La confiance, notre <em style={{ color: C.accent }}>meilleure référence</em>.</>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "32px 28px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>{[...Array(5)].map((_, j) => <Star key={j} size={14} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, marginBottom: 20 }}>"{t.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="estimation" style={{ padding: "110px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Estimation gratuite</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(34px, 4vw, 58px)", fontWeight: 400, color: C.text, margin: "16px 0 18px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "estimation.titre") ?? (<>Découvrez la vraie valeur <em>de votre bien</em>.</>)}</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>Évaluation offerte en 48h. Aucun engagement, aucune pression — juste une expertise honnête.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33140000000").replace(/[^+0-9]/g, "")}`} style={{ background: C.accent, color: C.text, borderRadius: 6, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, color: C.white, scale: 1.03 }}>
              <Phone size={18} /> {clientPhone(sessionData) ?? fd?.phone ?? "01 40 00 00 00"}
            </motion.a>
            <motion.a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "contact@pierreandco.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accentDark}`, borderRadius: 6, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, borderColor: C.accent }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.navy, padding: "56px 80px 28px", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 22, color: "#fff", marginBottom: 12 }}>Pierre <span style={{ color: C.accent }}>&amp; Co</span></div>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>Immobilier de prestige à {clientCity(sessionData) ?? "Paris"} et Île-de-France depuis 2004.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ icon: <MapPin size={14} />, t: (clientCity(sessionData) ?? "Paris") + " & agences IDF" }, { icon: <Phone size={14} />, t: (clientPhone(sessionData) ?? fd?.phone ?? "01 40 00 00 00") }, { icon: <Mail size={14} />, t: (clientEmail(sessionData) ?? fd?.email ?? "contact@pierreandco.fr") }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>© 2026 Pierre & Co Immobilier — Site réalisé par Aevia WS{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
