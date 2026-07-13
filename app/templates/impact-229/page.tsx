"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Sparkles, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Heart } from "lucide-react"

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
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
  bg: "#fdf8f5", bgSection: "#f6ede5", bgDark: "#1e0f08",
  text: "#1e0f08", textMuted: "#8a6450",
  accent: "#c4634a", accentDark: "#a8482f", accentLight: "#fce8e2",
  rose: "#e8a090", roseDark: "#d4705a",
  gold: "#c9a07a",
  white: "#ffffff", border: "#edd8cc",
  shadow: "0 2px 14px rgba(30,15,8,0.07)", shadowLg: "0 16px 48px rgba(196,99,74,0.18)",
};
const FONT = "'Cormorant Garamond', Georgia, serif"
const FONT_BODY = "'Karla', system-ui, sans-serif"

const STATS = [{ value: "14 ans", label: "D'expertise beauté" }, { value: "3 200+", label: "Soins réalisés" }, { value: "4.9★", label: "Avis Google" }, { value: "90 min", label: "Soin signature" }]

const SOINS = [
  { titre: "Soins visage sur mesure", desc: "Nettoyage en profondeur, exfoliation, masque, sérum, hydratation. Protocole personnalisé après diagnostic de peau — 60 à 90 min.", tag: "Visage" },
  { titre: "Massage corps & modelage", desc: "Relaxant suédois, drainant lymphatique, modelage amincissant. Huiles végétales et essentielles biologiques. Dès 60 min.", tag: "Corps" },
  { titre: "Épilation & soins intimes", desc: "Épilation cire tiède ou orientale, soins post-épilation. Résultats durables et confort maximal. Zones corps et visage.", tag: "Épilation" },
  { titre: "Pédicurie médicale", desc: "Soin des pieds, traitement callosités, mycoses, ongles incarnés. Protocole hygiénique rigoureux avec matériel stérilisé.", tag: "Pieds" },
  { titre: "Maquillage & ongles", desc: "Semi-permanent mains et pieds, nail art, pose gel. Maquillage occasion : mariage, soirée, shooting photo — sur RDV.", tag: "Beauté" },
  { titre: "Rituel spa & détente", desc: "Forfaits duo ou individuel : enveloppement corps, gommage, bain aromatique, massage. Idéal pour offrir ou se ressourcer.", tag: "Spa" },
]

const VALEURS = [
  "Produits biologiques et naturels : Nuxe, L'Occitane, Phytomer",
  "Cabines individuelles climatisées et lumière naturelle",
  "Coffrets cadeaux disponibles toute l'année",
  "Formation continue annuelle de toute l'équipe",
]

const AVIS = [
  { texte: "Le soin visage hydratant a complètement transformé ma peau en 6 semaines. L'esthéticienne a pris le temps d'analyser ma peau et adapté le protocole. Je n'avais jamais vécu ça ailleurs.", auteur: "Emma G.", detail: "Soin visage sur mesure" },
  { texte: "Massage drainant avant mon mariage : résultat visible en une séance. Corps léger, jambes désenflées, peau lumineuse. J'avais le corps de mes rêves le jour J. Merci !", auteur: "Sophie B.", detail: "Forfait mariage" },
  { texte: "Ritual spa duo avec ma meilleure amie pour notre anniversaire. Accueil aux petits soins, ambiance cocooning, soins au top. On a passé l'après-midi dans un vrai état de lévitation.", auteur: "Clara & Inès", detail: "Rituel spa duo" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function EclatSpaPage() {
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
    const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h)
  }, []);

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
  }, [c]);return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Karla:wght@300;400;500;600;700&display=swap');
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <motion.nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", background: scrolled ? "rgba(253,248,245,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s ease" }}>
        <div style={{ fontFamily: FONT, fontSize: 22, fontStyle: "italic", color: scrolled ? C.accent : "#fff" }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>Éclat <span style={{ color: scrolled ? C.gold : "rgba(255,255,255,0.7)" }}>Spa</span></>
          )}
        </div>
        <div id="mb229-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Soins", "Forfaits", "Cadeaux", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33493000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>Réserver</motion.a>
      </div>
        <button
          className="mb229-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Soins", "Forfaits", "Cadeaux", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33493000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>Réserver</motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb229-nav { display: none !important; } .mb229-burger { display: flex !important; } }`}</style>

      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80" alt="Institut spa Éclat Nice" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,4,2,0.92) 0%, rgba(10,4,2,0.36) 45%, rgba(10,4,2,0.06) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}15 0%, transparent 55%)` }} />
        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(196,99,74,0.15)", border: "1px solid rgba(196,99,74,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <Sparkles size={12} color={C.rose} />
            <span style={{ color: C.rose, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Institut de beauté & spa · Nice</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(42px, 5.2vw, 70px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Révélez votre éclat,<br /><em style={{ color: C.rose }}>corps et âme.</em>
          </>}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Institut de beauté et spa à Nice. Soins visage, massages, épilation, maquillage — des rituels de bien-être avec des produits biologiques et une expertise de 14 ans.
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33493000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> Réserver un soin
            </motion.a>
            <motion.a href="#soins" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 8, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Nos soins
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.rose }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.18)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="soins" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos soins</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>Un univers dédié<br /><em>à votre bien-être.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {SOINS.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre philosophie</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>Beauté consciente,<br /><em>plaisir sensoriel.</em></h2>
            {VALEURS.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <Heart size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{v}</span>
              </div>
            ))}
            <motion.a href={`tel:${fd?.phone ?? "+33493000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Réserver <ArrowRight size={16} />
            </motion.a>
          </div></Reveal>
          <Reveal><img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80" alt="Soin visage naturel" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.rose }}>Témoignages</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff", marginTop: 10 }}>Elles <em style={{ color: C.rose }}>rayonnent.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.rose} color={C.rose} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.72, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.rose, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <Sparkles size={28} color={C.accent} style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, marginBottom: 16 }}>Offrez-vous<br /><em>un moment rien qu'à vous.</em></h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Réservation par téléphone ou email. Coffrets cadeaux disponibles — parfaits pour offrir.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33493000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 04 93 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "bonjour@eclatspa.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} />{fd?.email ?? "bonjour@eclatspa.fr"}</motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 20, fontStyle: "italic", color: C.rose, marginBottom: 8 }}>Éclat Spa</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>Institut beauté & spa · Nice<br />Mar–Sam 9h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: "Nice, Alpes-Maritimes" }, { icon: <Phone size={13} />, t: "04 93 00 00 00" }, { icon: <Clock size={13} />, t: "Mar–Sam 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.rose }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 Éclat Spa — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
