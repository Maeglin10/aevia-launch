"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, MapPin, Mail, Phone, Clock, Star, CheckCircle, Calendar } from "lucide-react"

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
  bg: "#f4f8fb",
  bgSection: "#e8f0f6",
  text: "#1a2c3d",
  textMuted: "#637585",
  accent: "#2d6a8f",
  accentDark: "#1d4d6b",
  accentLight: "#d4e8f5",
  warm: "#5b9e6f",
  white: "#ffffff",
  border: "#d5e4ef",
  shadow: "0 2px 14px rgba(29,76,107,0.08)",
  shadowLg: "0 16px 48px rgba(29,76,107,0.14)",
};const FONT = "'Nunito', system-ui, sans-serif"
const FONT_SERIF = "'Merriweather', Georgia, serif"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "2 800+", label: "Patients suivis" },
  { value: "15 ans", label: "D'expérience" },
  { value: "4.9★", label: "Avis patients" },
  { value: "48h", label: "Délai de prise en charge" },
]

const SPECIALITES = [
  { titre: "Rééducation post-opératoire", desc: "Genou, hanche, épaule — protocoles adaptés après chirurgie orthopédique pour une récupération fonctionnelle rapide et complète.", tag: "Sport & Ortho", color: C.accent },
  { titre: "Lombalgies & cervicalgies", desc: "Prise en charge globale des douleurs chroniques du dos et du cou. Mobilisation, renforcement, éducation thérapeutique.", tag: "Colonne", color: C.accent },
  { titre: "Rééducation neurologique", desc: "Accompagnement post-AVC, sclérose en plaques, Parkinson. Approche pluridisciplinaire pour maintenir l'autonomie et la qualité de vie.", tag: "Neuro", color: C.warm },
  { titre: "Kiné respiratoire", desc: "Désencombrement bronchique, asthme, BPCO, kinésithérapie respiratoire pédiatrique et adulte. Techniques manuelles et instrumentales.", tag: "Respiratoire", color: C.warm },
  { titre: "Rééducation du sportif", desc: "Entorse, déchirure musculaire, tendinopathie. Protocoles de retour au sport progressifs avec évaluation fonctionnelle continue.", tag: "Sport", color: C.accent },
  { titre: "Prise en charge pédiatrique", desc: "Scoliose, troubles posturaux, rééducation motrice de l'enfant. Approche ludique et bienveillante pour les 0–18 ans.", tag: "Pédiatrie", color: C.warm },
]

const APPROCHE = [
  "Bilan initial complet de 45 minutes pour chaque nouveau patient",
  "Plan de soins personnalisé, réévalué à chaque séance",
  "Exercices à domicile transmis via application dédiée",
  "Coordination avec médecins, chirurgiens et autres soignants",
]

const TEMOIGNAGES = [
  { texte: "Après mon opération du genou, j'avais peur de ne plus courir. L'équipe du cabinet m'a accompagné pas à pas. 4 mois après, j'ai terminé mon premier 10 km. Merci infiniment.", auteur: "Thomas B.", detail: "Rééducation LCA, 34 ans" },
  { texte: "Une prise en charge sérieuse et très humaine. Mon lumbago chronique qui durait depuis 3 ans a considérablement diminué en 8 séances. La qualité d'écoute est remarquable.", auteur: "Isabelle M.", detail: "Lombalgie chronique, 52 ans" },
  { texte: "Mon fils de 7 ans avait des troubles de la marche. Le suivi en pédiatrie a été exceptionnel — ils l'ont mis à l'aise immédiatement. Les progrès sont visibles chaque semaine.", auteur: "Famille Gautier", detail: "Rééducation motrice pédiatrique" },
]

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

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function CabinetKinePage() {
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
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
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
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Merriweather:ital,wght@0,300;0,400;1,300&display=swap');
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 5vw, 64px)",
        background: scrolled ? "rgba(244,248,251,0.97)" : "transparent",
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
              <span style={{ fontSize: 18, fontWeight: 800, color: scrolled ? C.accent : "#fff" }}>Kiné</span>
              <span style={{ fontSize: 18, fontWeight: 300, color: scrolled ? C.text : "rgba(255,255,255,0.85)" }}> Mouvement</span>
            </>
          )}
        </div>
        <div style={{ gap: 32, alignItems: "center" }} className="hidden md:flex">
          {["Spécialités", "L'équipe", "Tarifs", "Contact"].map(l => {
            const href = l === "Spécialités" ? "#spécialités" : l === "L'équipe" ? "#approche" : "#contact";
            return (
              <a key={l} href={href} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
            );
          })}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Prendre RDV
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
          {["Spécialités", "L'équipe", "Tarifs", "Contact"].map(l => {
            const href = l === "Spécialités" ? "#spécialités" : l === "L'équipe" ? "#approche" : "#contact";
            return (
              <a key={l} href={href} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
            );
          })}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Prendre RDV
          </motion.a>
        </div>
      )}

      {/* Hero */}
      <section ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=80" alt="Cabinet kiné Mouvement Nantes" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,25,40,0.90) 0%, rgba(10,25,40,0.40) 45%, rgba(10,25,40,0.06) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 6vw, 80px) 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(45,106,143,0.20)", border: "1px solid rgba(45,106,143,0.40)", borderRadius: 20, padding: "7px 18px" }}>
            <span style={{ color: "#a8d4f0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Cabinet de kinésithérapie · Nantes</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(42px, 5.5vw, 76px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Retrouver le mouvement,<br /><em>retrouver la vie.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 40, maxWidth: 530 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Kiné Mouvement accompagne chaque patient avec une approche personnalisée et bienveillante. Rééducation orthopédique, neurologique, sportive et respiratoire — nous sommes là à chaque étape.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}55` }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Calendar size={18} /> Prendre rendez-vous
            </motion.a>
            <motion.a href={`tel:${fd?.phone ?? "+33240000000"}`} style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              <Phone size={16} /> 02 40 00 00 00
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accentLight }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "32px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 40, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Spécialités */}
      <section id="spécialités" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos spécialités</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 300, color: C.text, marginTop: 12, lineHeight: 1.15 }}>
              Une prise en charge <em>adaptée à chaque patient</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22, maxWidth: 1200, margin: "0 auto" }}>
          {SPECIALITES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "28px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approche */}
      <section id="approche" style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" alt="Rééducation cabinet kiné" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre approche</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 300, color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>
              L'humain au cœur <em>de chaque séance</em>.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {APPROCHE.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{a}</span>
                </div>
              ))}
            </div>
            <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.accent, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" style={{ padding: "100px 80px", background: C.text }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentLight }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 300, color: "#fff", marginTop: 12 }}>Des parcours <em style={{ color: C.accentLight }}>qui inspirent</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "30px 26px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accentLight} color={C.accentLight} />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, marginBottom: 18 }}>"{t.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.accentLight, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "110px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Prise en charge</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 300, color: C.text, margin: "16px 0 18px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Votre rééducation commence <em>aujourd'hui</em>.</>}</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Prenez rendez-vous en ligne ou par téléphone. Nous acceptons tous les patients, avec ou sans ordonnance médicale.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33240000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Phone size={18} /> 02 40 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@kine-mouvement.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accentDark}`, borderRadius: 8, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white, borderColor: C.accent }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.text, padding: "52px 80px 26px", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.accentLight, marginBottom: 10 }}>Kiné Mouvement</div>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.6, maxWidth: 250 }}>Cabinet de kinésithérapie à Nantes. Lun–Sam 8h–20h.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ icon: <MapPin size={13} />, t: "Nantes, Loire-Atlantique" }, { icon: <Phone size={13} />, t: "02 40 00 00 00" }, { icon: <Clock size={13} />, t: "Lun–Ven 8h–20h | Sam 8h–13h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.48)", fontSize: 13 }}>
                <span style={{ color: C.accentLight }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.24)", fontSize: 12 }}>© 2026 Kiné Mouvement — Site réalisé par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.24)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
