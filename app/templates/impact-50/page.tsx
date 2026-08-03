"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Calendar } from "lucide-react"
import {
  DWELL,
  useSlides,
  AnchoredBackdrop,
  BlurThrough,
  SlideIndex,
  HairlineArrows,
} from "@/lib/templates/hero-kit-2"
import { PanelRise } from "@/lib/templates/hero-kit-3"
import {
  clientReviews,
  clientServices,
} from "@/lib/templates/clientContent";

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
  bg: "#faf7f4",
  bgSection: "#f2ece5",
  text: "#2a1f14",
  textMuted: "var(--brand-light,#7a6655)",
  accent: "#4a7c6f",
  accentDark: "#355c52",
  accentLight: "#d8ede9",
  warm: "#9b7c5e",
  warmLight: "#f0e6d9",
  white: "#ffffff",
  border: "#e0d5c8",
  shadow: "0 2px 14px rgba(42,31,20,0.07)",
  shadowLg: "0 16px 48px rgba(42,31,20,0.12)",
};
const FONT = "'Nunito', system-ui, sans-serif"
const FONT_SERIF = "'Lora', Georgia, serif"

const STATS = [
  { value: "15 ans", label: "De pratique clinique" },
  { value: "800+", label: "Patients accompagnés" },
  { value: "Remboursé", label: "Complémentaires santé" },
  { value: "48h", label: "Premier rendez-vous" },
]


const NAV = [
  { l: "Accompagnements", h: "#accompagnements" },
  { l: "Approche", h: "#approche" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];
const SEANCES = [
  { n: "Première rencontre", p: "0 €", d: "Vingt minutes au téléphone, pour savoir si le courant passe et si je suis la bonne personne. Sans engagement." },
  { n: "Séance individuelle", p: "65 €", d: "50 minutes, au cabinet ou en visio. Réglable par carte, chèque ou virement le jour même." },
  { n: "Forfait 5 séances", p: "300 €", d: "Valable un an, sans obligation de rythme. Un accompagnement se construit rarement en une fois." },
  { n: "Séance de couple", p: "90 €", d: "1 h 15. Les deux personnes présentes, toujours — c'est la condition du travail." },
  { n: "Suivi adolescent", p: "60 €", d: "45 minutes. Un point avec les parents tous les trois mois, avec l'accord de l'adolescent." },
  { n: "Supervision de professionnels", p: "95 €", d: "1 h, en individuel ou en petit groupe. Sur rendez-vous, en journée." },
];

const ACCOMPAGNEMENTS = [
  { titre: "Anxiété & troubles du stress", desc: "Prise en charge des troubles anxieux généralisés, phobies, TOC, stress post-traumatique et crises de panique. Protocoles TCC et EMDR.", tag: "Anxiété" },
  { titre: "Dépression & burnout", desc: "Accompagnement des épisodes dépressifs, épuisement professionnel et crises existentielles. Thérapie centrée sur la personne et activation comportementale.", tag: "Dépression" },
  { titre: "Thérapie de couple", desc: "Gestion des conflits, communication non-violente, infidélité, séparation. Séances individuelles ou en couple selon les besoins.", tag: "Couple" },
  { titre: "Suivi des adolescents", desc: "Troubles émotionnels, anxiété scolaire, crise identitaire, harcèlement. Approche adaptée aux 12-18 ans avec implication des parents si nécessaire.", tag: "Ado" },
  { titre: "Deuil & transitions de vie", desc: "Perte d'un être cher, divorce, licenciement, retraite, déménagement. Accompagnement pour traverser et dépasser les grandes transitions.", tag: "Deuil" },
  { titre: "Développement personnel", desc: "Confiance en soi, assertivité, gestion des émotions, pleine conscience. Pour ceux qui vont bien et souhaitent aller encore mieux.", tag: "Bien-être" },
]

const APPROCHE = [
  "Thérapies validées scientifiquement : TCC, EMDR, pleine conscience",
  "Confidentialité absolue et secret professionnel garantis",
  "Consultation possible en présentiel ou en visioconférence",
  "Remboursement partiel par de nombreuses mutuelles",
]

const AVIS_DEMO = [
  { texte: "J'hésitais à consulter depuis longtemps. Laurence m'a mise à l'aise dès la première séance. En 4 mois, ma relation à l'anxiété a complètement changé. Je regrette seulement de ne pas y être allée plus tôt.", auteur: "Camille R.", detail: "Suivi anxiété, 34 ans" },
  { texte: "Burn-out sévère après 8 ans dans la finance. Mon médecin m'a orienté vers Mme Moreau. La progression est lente mais réelle. Je récupère des ressources que je pensais avoir perdues.", auteur: "Vincent L.", detail: "Burnout professionnel, 42 ans" },
  { texte: "Ma fille de 15 ans traversait une période très difficile. L'approche avec les adolescents est remarquable — elle repart de chaque séance avec quelque chose de concret. Merci.", auteur: "Famille Martin", detail: "Thérapie adolescente" },
]
let AVIS = AVIS_DEMO;

/* Château mechanic, two views: the practice, then the practitioner. Both
   photographs were already in this file and verified at the merge — no third
   image was risked unseen. The headline never moves; only the photograph
   dissolves, on the slow beat that suits the room. */
const HERO_VIEWS = [
  {
    k: "Le cabinet",
    d: "Une pièce calme au coeur de Montpellier, pensée pour que la parole puisse se poser.",
    img: "https://images.pexels.com/photos/4672717/pexels-photo-4672717.jpeg?auto=compress&cs=tinysrgb&w=1920",
  },
  {
    k: "La praticienne",
    d: "Psychologue clinicienne, formée aux thérapies fondées sur les preuves — TCC, EMDR, pleine conscience.",
    img: "https://images.pexels.com/photos/3958409/pexels-photo-3958409.jpeg?auto=compress&cs=tinysrgb&w=1920",
  },
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
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function CabinetMoreauPage() {
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
  AVIS = resolveList(
    clientReviews(session)?.map((r, i) => ({ ...AVIS_DEMO[i % AVIS_DEMO.length], texte: r.text, auteur: r.author })),
    AVIS_DEMO,
  );
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

  const heroRef = useRef<HTMLElement>(null)
  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_VIEWS.length, DWELL.slow)
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
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
          /* stats: 4 colonnes tronquées sur mobile -> 2x2 */
          .imx-stats { grid-template-columns: 1fr 1fr !important; }
          .imx-stats > * > div { border-right: none !important; }
        }
      `}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(250,247,244,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        {fd?.logoBase64 ? (
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div>
            <span style={{ fontFamily: FONT_SERIF, fontSize: 17, fontStyle: "italic", color: scrolled ? C.accent : "#fff" }}>Laurence Moreau</span>
            <span style={{ fontSize: 13, color: scrolled ? C.textMuted : "rgba(255,255,255,0.65)", marginLeft: 8 }}>Psychologue clinicienne</span>
          </div>
        )}
        <div id="mb50-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33434000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Calendar size={14} /> Prendre RDV
          </motion.a>
      </div>
        <button
          className="mb50-burger"
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
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33434000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Calendar size={14} /> Prendre RDV
          </motion.a>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) { #mb50-nav { display: none !important; } .mb50-burger { display: flex !important; } }
        /* alignItems:flex-end plus clamp() padding wasn't enough on its own:
           when the badge+h1+paragraph+CTAs stack is taller than the mobile
           viewport, flex-end still pushes the whole block above y:0, hiding
           the badge under the fixed nav regardless of padding values.
           flex-start + real top clearance fixes it at the alignment level. */
        @media (max-width: 640px) {
          .imx50-hero { align-items: flex-start !important; height: auto !important; min-height: 100dvh !important; }
          .imx50-hero-content { padding-top: 96px !important; }
          /* the slide band shares the top-right corner with the headline on a
             phone — the dissolve still plays, the caption yields */
          .imx50-slideband { display: none !important; }
        }
      `}</style>

      {/* Hero */}
      <section ref={heroRef} className="imx50-hero" style={{ height: "100dvh", minHeight: "560px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <AnchoredBackdrop
            images={HERO_VIEWS.map((v, n) => fd?.photoUrls?.[n] || v.img)}
            index={heroI}
            overlay={0}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,10,5,0.90) 0%, rgba(15,10,5,0.38) 45%, rgba(15,10,5,0.05) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />

        <motion.div className="imx50-hero-content" style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px,7vw,80px) clamp(40px,8vw,90px)", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(40px, 5.2vw, 68px)", fontWeight: 400, color: "#fff", lineHeight: 1.12, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Un espace pour se retrouver,<br /><em>à son propre rythme.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Psychologue clinicienne à Montpellier, je vous accompagne face aux difficultés émotionnelles, relationnelles et professionnelles avec bienveillance et méthodes fondées sur les preuves.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33434000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Calendar size={18} /> Prendre rendez-vous
            </motion.a>
            <motion.a href="#accompagnements" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Mes accompagnements
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bandeau de slide : la vue en cours + flèches. Posé en haut à
            droite pour ne pas toucher au contenu bas-aligné du hero. */}
        <div className="imx50-slideband" style={{ position: "absolute", top: 96, right: "clamp(20px,4vw,56px)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, textAlign: "right" }}>
          <SlideIndex i={heroI} total={HERO_VIEWS.length} variant="fraction" className="" color="rgba(255,255,255,0.75)" />
          <BlurThrough index={heroI} amount={9}>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
              {HERO_VIEWS[heroI].k}
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: "34ch", margin: "6px 0 0" }}>
              {HERO_VIEWS[heroI].d}
            </p>
          </BlurThrough>
          <HairlineArrows onPrev={heroPrev} onNext={heroNext} color="rgba(255,255,255,0.7)" labels={{ prev: "Vue précédente", next: "Vue suivante" }} />
        </div>
      </section>

      {/* Stats — PanelRise (v03): the hero's headline never leaves, this
          section climbs over it like a shutter as you scroll */}
      <PanelRise>
      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div className="imx-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 400, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      </PanelRise>

      {/* Accompagnements */}
      <section id="accompagnements" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Accompagnements</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>
              Pour chaque difficulté,<br /><em>un espace d'écoute.</em>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {ACCOMPAGNEMENTS.map((a, i) => (
            <Reveal key={a.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.tag}</span>
                <h3 style={{ fontFamily: FONT_SERIF, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{a.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{a.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approche */}
      <section id="approche" style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src={photo(1, "https://images.pexels.com/photos/3958409/pexels-photo-3958409.jpeg?auto=compress&cs=tinysrgb&w=800")} alt="Psychologue bienveillante" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Mon approche</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>
              Un cadre sécurisant,<br /><em>sans jugement.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {APPROCHE.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{a}</span>
                </div>
              ))}
            </div>
            <motion.a href={`tel:${fd?.phone ?? "+33434000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.accent, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Prendre rendez-vous <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>
              Le prix est dit<br /><em>avant de commencer.</em>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {SEANCES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                <h3 style={{ fontFamily: FONT_SERIF, fontSize: 18, color: C.text }}>{s.n}</h3>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, margin: "8px 0 14px" }}>{s.p}</div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p style={{ maxWidth: 1200, margin: "22px auto 0", fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
            Les séances ne sont pas remboursées par l&apos;Assurance maladie. Beaucoup de mutuelles prennent en charge
            quatre à huit séances par an : une facture vous est remise à chaque fois, sans avoir à la demander.
          </p>
        </Reveal>
      </section>

      {/* Témoignages */}
      <section style={{ padding: "100px 80px", background: "#2a1f14" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: brand ?? 'var(--brand,#9fd4c9)' }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff", marginTop: 10 }}>Des chemins <em style={{color: brand ?? 'var(--brand,#9fd4c9)' }}>retrouvés</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill="var(--brand,#9fd4c9)" color="var(--brand,#9fd4c9)" />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.80)", lineHeight: 1.72, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{color: brand ?? 'var(--brand,#9fd4c9)', fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.warmLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.warm }}>Prendre rendez-vous</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Le premier pas<br /><em>est souvent le plus difficile.</em></>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Premier rendez-vous disponible sous 48h. Consultation en présentiel à Montpellier ou en visioconférence.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33434000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Phone size={18} /> {fd?.phone ?? "04 34 00 00 00"}
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@laurencemoreau-psy.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: "#2a1f14", padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{fontFamily: FONT_SERIF, fontSize: 18, fontStyle: "italic", color: brand ?? 'var(--brand,#9fd4c9)', marginBottom: 8 }}>Laurence Moreau</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>Psychologue clinicienne · Montpellier<br />Lun–Ven 9h–19h | Sam 9h–13h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Montpellier, Hérault" }, { icon: <Phone size={13} />, t: "04 34 00 00 00" }, { icon: <Clock size={13} />, t: "Lun–Ven 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                <span style={{color: brand ?? 'var(--brand,#9fd4c9)' }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 Cabinet Laurence Moreau — Site par Aevia WS</span>
          <a href="/templates/impact-50/legal" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
