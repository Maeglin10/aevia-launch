"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Eye, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight } from "lucide-react"

const C = {
  bg: "#f0f7ff",
  bgSection: "#e4f0fc",
  text: "#0b2240",
  textMuted: "#486887",
  accent: "#0f3460",
  accentDark: "#091f3d",
  accentLight: "#cce5ff",
  cyan: "#0ea5e9",
  cyanLight: "#e0f4fe",
  white: "#ffffff",
  border: "#bfdbf7",
  shadow: "0 2px 12px rgba(15,52,96,0.08)",
  shadowLg: "0 16px 48px rgba(15,52,96,0.16)",
}
const FONT = "'Nunito', system-ui, sans-serif"

const STATS = [
  { value: "20 ans", label: "D'expertise optique" },
  { value: "3 500+", label: "Clients équipés" },
  { value: "4.8★", label: "Avis Google" },
  { value: "1h", label: "Examen de vue complet" },
]

const OFFRES = [
  { titre: "Lunettes de vue", desc: "Plus de 400 montures sélectionnées : grandes marques (Ray-Ban, Lindberg, Persol) et créateurs indépendants. Verres haute définition, anti-lumière bleue, amincis.", tag: "Vue" },
  { titre: "Lentilles de contact", desc: "Journalières, mensuelles, toriques, multifocales. Adaptation par nos opticiens diplômés avec suivi à 1 mois. Commande en ligne disponible.", tag: "Lentilles" },
  { titre: "Examen de vue", desc: "Bilan visuel complet avec équipements de pointe (topographe, fond d'œil). Résultats immédiats et prescription remise en main propre.", tag: "Bilan" },
  { titre: "Lunettes solaires", desc: "Du classique au sport, avec verres polarisants, teintés ou photochromiques. Protection UV 400 certifiée sur toutes nos montures.", tag: "Solaire" },
  { titre: "Basse vision", desc: "Matériel spécialisé pour patients malvoyants : loupes électroniques, systèmes d'agrandissement, filtres chromiques. Prise en charge 100% Sécu.", tag: "Santé" },
  { titre: "Réparations express", desc: "Remplacement de vis, ressoudage, changement de plaquettes — réparations en 15 minutes en boutique pour la plupart des marques.", tag: "SAV" },
]

const ENGAGEMENTS = [
  "Opticiens diplômés DSCVO sur tous nos créneaux",
  "Tiers-payant intégral avec toutes les mutuelles",
  "Délai de commande lunettes : 5 à 7 jours ouvrés",
  "Garantie 2 ans sur montures et verres",
]

const AVIS = [
  { texte: "Examen de vue très complet avec des explications claires. J'avais peur de devoir attendre longtemps pour mes lunettes, elles étaient prêtes en 5 jours. Qualité irréprochable.", auteur: "Nicolas P.", detail: "Lunettes progressives" },
  { texte: "Enfin un opticien qui prend le temps ! 45 minutes de bilan, conseils vraiment personnalisés pour mes lentilles. Et le tiers payant fonctionne parfaitement avec ma mutuelle.", auteur: "Hélène T.", detail: "Adaptation lentilles" },
  { texte: "Mon fils de 8 ans avait besoin de ses premières lunettes. L'accueil a été parfait, il est reparti avec des montures qui lui font vraiment envie de les porter. Merci !", auteur: "Famille Bertrand", detail: "Optique enfant" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VisionClairePage() {
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
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(240,247,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <div style={{ background: C.cyan, borderRadius: 8, padding: "7px 9px", display: "flex" }}>
                <Eye size={18} color="#fff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: scrolled ? C.accent : "#fff" }}>Vision<span style={{ color: C.cyan }}>Claire</span></span>
            </>
          )}
        </div>
        <div id="mb138-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Offres", "Bilan visuel", "Lentilles", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33240000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Prendre RDV
          </motion.a>
      </div>
        <button
          className="mb138-burger"
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
          {["Offres", "Bilan visuel", "Lentilles", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33240000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Prendre RDV
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb138-nav { display: none !important; } .mb138-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&q=80" alt="Opticien Vision Claire Nantes" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,18,40,0.92) 0%, rgba(5,18,40,0.42) 45%, rgba(5,18,40,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}20 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.35)", borderRadius: 20, padding: "7px 18px" }}>
            <Eye size={12} color={C.cyan} />
            <span style={{ color: C.cyan, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Opticien diplômé · Nantes</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontSize: "clamp(40px, 5.5vw, 70px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Bien voir le monde,<br /><span style={{ color: C.cyan }}>avec style.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Opticien indépendant à Nantes depuis 20 ans. Lunettes, lentilles, examens de vue complets — tiers-payant toutes mutuelles, conseils personnalisés, délais rapides.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33240000001"}`} style={{ background: C.cyan, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.cyan}44` }} whileHover={{ scale: 1.03 }}>
              Prendre rendez-vous
            </motion.a>
            <motion.a href="#offres" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Nos offres
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="tarifs" style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.cyan, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Offres */}
      <section id="offres" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.cyan }}>Nos offres</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: C.text, marginTop: 10, lineHeight: 1.1 }}>
              Tout pour votre confort visuel,<br />sous un même toit.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {OFFRES.map((o, i) => (
            <Reveal key={o.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{background: C.cyanLight, color: brand ?? '#0369a1', borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{o.tag}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "14px 0 10px" }}>{o.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{o.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80" alt="Opticien conseil lunettes" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.cyan }}>Nos engagements</span>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 800, color: C.text, margin: "12px 0 28px", lineHeight: 1.15 }}>
              Un opticien indépendant<br />qui prend son temps.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ENGAGEMENTS.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.cyan} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
            </div>
            <motion.a href={`tel:${fd?.phone ?? "+33240000001"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.accent, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* Avis */}
      <section style={{ padding: "100px 80px", background: C.accent }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.cyan }}>Avis patients</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", marginTop: 10 }}>Ils voient <span style={{ color: C.cyan }}>la différence</span>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.cyan} color={C.cyan} />)}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.cyan, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.cyanLight, textAlign: "center" }}>
        <Reveal>
          <span style={{fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: brand ?? '#0369a1' }}>Prise en charge</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Prêt à mieux voir ?</>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Réservez votre examen de vue ou venez découvrir nos montures. Tiers-payant intégral, accueil sans rendez-vous possible du mardi au samedi.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33240000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 02 40 00 00 01
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@visionclaire.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.accentDark, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.cyan, marginBottom: 8 }}>VisionClaire</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>Opticien indépendant · Nantes<br />Mar–Sam 9h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Nantes, Loire-Atlantique" }, { icon: <Phone size={13} />, t: "02 40 00 00 01" }, { icon: <Clock size={13} />, t: "Mar–Sam 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                <span style={{ color: C.cyan }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 VisionClaire — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
