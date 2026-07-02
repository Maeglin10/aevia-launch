"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Scale, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Shield } from "lucide-react"

const C = {
  bg: "#f7f5f0",
  bgSection: "#efece4",
  text: "#1a1a2e",
  textMuted: "#6b6460",
  accent: "#1a1a2e",
  gold: "#c9a84c",
  goldLight: "#f5edcb",
  white: "#ffffff",
  border: "#ddd8cc",
  shadow: "0 2px 14px rgba(26,26,46,0.08)",
  shadowLg: "0 16px 48px rgba(201,168,76,0.18)",
}
const FONT = "'Source Serif 4', Georgia, serif"
const FONT_BODY = "'Source Sans 3', system-ui, sans-serif"

const STATS = [
  { value: "22 ans", label: "D'exercice au barreau" },
  { value: "1 200+", label: "Dossiers traités" },
  { value: "94%", label: "Taux de succès" },
  { value: "48h", label: "Premier entretien" },
]

const DOMAINES = [
  { titre: "Droit des affaires & commercial", desc: "Création d'entreprise, rédaction de contrats, litiges commerciaux, contentieux entre associés, recouvrement de créances. Conseil aux PME et ETI.", tag: "Affaires" },
  { titre: "Droit du travail", desc: "Rupture conventionnelle, licenciement abusif, harcèlement, discrimination. Assistance salarié et employeur devant le Conseil de Prud'hommes.", tag: "Travail" },
  { titre: "Droit de la famille", desc: "Divorce, séparation de biens, garde d'enfants, pension alimentaire, succession et héritage. Médiation familiale proposée.", tag: "Famille" },
  { titre: "Droit immobilier", desc: "Vente, bail commercial ou d'habitation, construction, servitudes, copropriété. Contentieux immobilier et construction.", tag: "Immobilier" },
  { titre: "Droit pénal des affaires", desc: "Abus de biens sociaux, fraude, escroquerie, blanchiment. Défense pénale et assistance aux dirigeants mis en cause.", tag: "Pénal" },
  { titre: "Protection des données (RGPD)", desc: "Mise en conformité RGPD, rédaction de politiques de confidentialité, DPO externalisé, accompagnement en cas de violations.", tag: "RGPD" },
]

const ENGAGEMENTS = [
  "Membre du Barreau de Paris depuis 2002",
  "Devis honoraires transparents avant tout engagement",
  "Convention d'honoraires systématique et détaillée",
  "Aide juridictionnelle acceptée sous conditions",
]

const AVIS = [
  { texte: "Maître Renard a géré un litige commercial complexe avec une rigueur impressionnante. Gain de cause en première instance. Communication impeccable tout au long de la procédure.", auteur: "Pierre V.", detail: "Litige commercial B2B" },
  { texte: "Licenciement abusif après 12 ans dans l'entreprise. Maître Renard m'a accompagnée patiemment et obtenu une indemnisation bien supérieure à ce que j'espérais.", auteur: "Sandra M.", detail: "Droit du travail, CDI" },
  { texte: "Divorce difficile après 15 ans. Maître Renard a su rester humain tout en défendant mes intérêts avec fermeté. L'accord amiable final est bien au-delà de mes attentes.", auteur: "François D.", detail: "Droit de la famille" },
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
export default function CabinetRenardPage() {
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
  }, [c]);
return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(247,245,240,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div>
          <span style={{ fontFamily: FONT, fontSize: 16, fontStyle: "italic", color: scrolled ? C.text : "#fff" }}>Maître Renard</span>
          <span style={{ fontSize: 13, color: scrolled ? C.textMuted : "rgba(255,255,255,0.65)", marginLeft: 6 }}>& Associés</span>
        </div>
        <div id="mb55-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Domaines", "L'équipe", "Honoraires", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace("'", "").replace("é", "e")}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33144000001"}`} style={{ background: C.gold, color: C.text, borderRadius: 4, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: "#b8952e" }}>
            Consultation
          </motion.a>
      </div>
        <button
          className="mb55-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Domaines", "L'équipe", "Honoraires", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace("'", "").replace("é", "e")}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33144000001"}`} style={{ background: C.gold, color: C.text, borderRadius: 4, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: "#b8952e" }}>
            Consultation
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb55-nav { display: none !important; } .mb55-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80" alt="Cabinet avocat Maître Renard Paris" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,12,0.94) 0%, rgba(5,5,12,0.48) 45%, rgba(5,5,12,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.gold}14 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <Scale size={12} color={C.gold} />
            <span style={{ color: C.gold, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT_BODY }}>Cabinet d'avocats · Paris</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            La justice mérite<br /><em style={{ color: C.gold }}>d'être défendue avec rigueur.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Cabinet Renard & Associés — expertise en droit des affaires, droit du travail, droit de la famille et RGPD. 22 ans d'exercice au Barreau de Paris.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33144000001"}`} style={{ background: C.gold, color: C.text, borderRadius: 4, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.gold}44` }} whileHover={{ background: "#b8952e", scale: 1.03 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#domaines" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 4, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Nos domaines
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.gold}28` : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 300, color: C.gold, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Domaines */}
      <section id="domaines" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.gold }}>Domaines d'expertise</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 300, color: C.text, marginTop: 10, lineHeight: 1.15 }}>
              Une expertise pluridisciplinaire<br /><em>au service de vos intérêts.</em>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {DOMAINES.map((d, i) => (
            <Reveal key={d.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 4, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.goldLight, color: "#8a6a1c", borderRadius: 4, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{d.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 400, color: C.text, margin: "14px 0 10px" }}>{d.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{d.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80" alt="Cabinet juridique Paris" style={{ width: "100%", borderRadius: 4, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.gold }}>Nos engagements</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 300, color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>
              La transparence,<br /><em>une valeur fondamentale.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ENGAGEMENTS.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Shield size={16} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
            </div>
            <motion.a href={`tel:${fd?.phone ?? "+33144000001"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.gold, color: C.text, borderRadius: 4, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "#b8952e", scale: 1.02 }}>
              Consultation <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* Avis */}
      <section style={{ padding: "100px 80px", background: C.accent }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.gold }}>Références clients</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 300, color: "#fff", marginTop: 10 }}>Ils nous <em style={{ color: C.gold }}>ont confié leurs dossiers</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.gold}20`, borderRadius: 4, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.gold} color={C.gold} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.80)", lineHeight: 1.72, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: `1px solid ${C.gold}20`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.gold, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.goldLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "#8a6a1c" }}>Premier entretien</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Votre dossier mérite<br /><em>une expertise sérieuse.</em></>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Premier entretien disponible sous 48h. Honoraires transparents communiqués avant toute intervention.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33144000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 4, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 01 44 00 00 01
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@cabinet-renard.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 4, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.accent, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", fontWeight: 300, color: C.gold, marginBottom: 8 }}>Maître Renard & Associés</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>Cabinet d'avocats · Paris<br />Barreau de Paris</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Paris, Île-de-France" }, { icon: <Phone size={13} />, t: "01 44 00 00 01" }, { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                <span style={{ color: C.gold }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.gold}20`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 Cabinet Renard & Associés — Site par Aevia WS</span>
          <a href="/templates/impact-55/legal" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
