"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#0a0a0a",
  card: "#111111",
  gold: "#c4a96a",
  goldLight: "#d9c08a",
  cream: "#f5f0e8",
  border: "rgba(196,169,106,0.18)",
  borderStrong: "rgba(196,169,106,0.4)",
  text: "#d4cfc8",
  muted: "#7a7570",
  white: "#f5f0e8",
}

const FONT_SERIF = '"Cormorant Garamond", Georgia, serif'
const FONT_BODY = "system-ui, -apple-system, sans-serif"

const PORTFOLIO_COMPANIES = [
  { name: "Karlia", sector: "SaaS CRM B2B", stage: "Série A", flag: "🇫🇷" },
  { name: "Convictional", sector: "Commerce B2B", stage: "Série A", flag: "🇨🇦" },
  { name: "Pennylane", sector: "FinTech PME", stage: "Série B", flag: "🇫🇷" },
  { name: "Watershed", sector: "Climate Tech", stage: "Série B", flag: "🇺🇸" },
]

const FOCUS_AREAS = [
  {
    id: "saas",
    icon: "◈",
    title: "SaaS B2B",
    subtitle: "Verticaux métier & infrastructure",
    body: "Nous ciblons les logiciels métier qui résolvent des problèmes complexes dans des secteurs peu digitalisés : RH, supply chain, comptabilité, conformité, gestion de flotte. Notre thèse : des niches profondes avec LTV élevée et churn structurellement bas.",
    metrics: ["ARR cible seed : 500k€–2M€", "NRR attendu : >110%", "Deal size B2B >5k€/an"],
  },
  {
    id: "fintech",
    icon: "◎",
    title: "FinTech & InsurTech",
    subtitle: "Réinventer les services financiers",
    body: "Paiements B2B, gestion de trésorerie, assurance paramétrique, crédit alternatif. Nous privilégions les modèles qui désintermédiient des acteurs établis via la technologie et la distribution directe, non via le dumping de prix.",
    metrics: ["Marge brute >60%", "Régulé ou en cours", "Fondateurs ex-banque ou ex-assurance"],
  },
  {
    id: "deeptech",
    icon: "◉",
    title: "DeepTech & IA",
    subtitle: "Avantage défendable par la technologie",
    body: "Modèles fondationnels appliqués à la santé, au juridique et à l'industrie. Nous évitons les wrappers GPT. Nous finançons des équipes qui construisent de vrais avantages techniques : données propriétaires, modèles fine-tunés, intégrations systèmes critiques.",
    metrics: ["IP ou data moat identifié", "Publication académique ou brevet", "Time-to-market 18–36 mois"],
  },
  {
    id: "climate",
    icon: "◷",
    title: "Climate & Énergie",
    subtitle: "Décarbonation et transition énergétique",
    body: "Efficacité énergétique industrielle, gestion des énergies renouvelables, marchés carbone volontaires, mobilité bas-carbone B2B. Nous finançons des solutions rentables sans subvention, avec un plan vers la profitabilité visible avant 2028.",
    metrics: ["Tonne CO₂ évitée mesurable", "LCOE compétitif", "Réglementaire comme tailwind"],
  },
]

const TESTIMONIALS = [
  {
    quote: "Summit ne s'est pas comporté comme un investisseur classique. Dès la term sheet, ils nous ont connectés avec trois directeurs achats chez des grands comptes que nous cherchions depuis six mois. Leur réseau a accéléré notre premier million d'ARR.",
    name: "Antoine Ferrand",
    role: "CEO & Co-fondateur",
    company: "Karlia",
    raise: "Série A — 4,2M€",
    avatar: "AF",
  },
  {
    quote: "La due diligence a été sérieuse mais rapide — 18 jours du premier meeting à la term sheet. Ce que j'ai apprécié : ils ont challengé nos hypothèses de marché sans jamais remettre en cause notre vision. C'est rare dans l'écosystème early-stage.",
    name: "Sarah Benoist",
    role: "CTO & Co-fondatrice",
    company: "Helixia",
    raise: "Seed — 1,8M€",
    avatar: "SB",
  },
  {
    quote: "Trois ans après l'investissement initial, Summit est encore actif au board. Ils ont apporté deux CFO intérimaires lors de notre pivot, facilité notre entrée en Allemagne et participé à notre Série B aux côtés de Balderton. Ce n'est pas du capital — c'est un accélérateur.",
    name: "Mathieu Durand",
    role: "Fondateur",
    company: "Fintecture",
    raise: "Seed → Série A → Série B",
    avatar: "MD",
  },
  {
    quote: "Nous avions peur de perdre le contrôle de notre cap table trop tôt. Summit nous a proposé une structure propre avec un board d'un seul membre, des droits d'information standards et aucune clause de liquidation préférentielle participante. Un partenaire aligné long terme.",
    name: "Léa Vignon",
    role: "CEO",
    company: "Clearpath Analytics",
    raise: "Seed — 2,1M€",
    avatar: "LV",
  },
]

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Candidature",
    sub: "Formulaire en ligne",
    body: "Soumettez votre dossier via notre formulaire structuré : deck, métriques actuelles, usage des fonds. Nous lisons toutes les candidatures. Réponse initiale sous 5 jours ouvrés — oui ou non, avec un retour argumenté.",
    icon: "◈",
  },
  {
    num: "02",
    title: "Analyse",
    sub: "2 à 3 semaines",
    body: "Premier call (30 min) puis rencontre avec les fondateurs (2h). Analyse du marché, des métriques, de la technologie et de la concurrence. Calls avec clients de référence. Feedback détaillé transmis à l'issue de cette phase.",
    icon: "◎",
  },
  {
    num: "03",
    title: "Comité",
    sub: "Décision sous 30 jours",
    body: "Présentation au comité d'investissement (fondateurs + associés Summit). Discussion interne. Vous recevez notre décision motivée dans les 72h suivant le comité. En cas de go, nous avançons vers la term sheet immédiatement.",
    icon: "◉",
  },
  {
    num: "04",
    title: "Term Sheet",
    sub: "Si le fit est confirmé",
    body: "Term sheet négociée en 5 à 10 jours, closing juridique sous 3 à 6 semaines. Nous travaillons avec des avocats M&A reconnus pour fluidifier le process. Dès le closing, votre Account Partner Summit est désigné et actif.",
    icon: "◷",
  },
]

const FAQS = [
  {
    q: "Quel ticket d'investissement proposez-vous ?",
    a: "Nous investissons entre 500k€ et 3M€ en seed, et entre 3M€ et 12M€ en Série A. Nous co-investissons systématiquement avec d'autres fonds sur les tours importants. Nous réservons une capacité de suivi pour les tours suivants — typiquement 30 à 50% du ticket initial.",
  },
  {
    q: "Quels secteurs excluez-vous ?",
    a: "Nous n'investissons pas dans : les ICO, cryptomonnaies spéculatives, tabac, armement, jeux d'argent, médias grand public ou e-commerce pur. Nous sommes également prudents sur les marketplaces B2C à marge faible et les modèles fortement dépendants de la publicité.",
  },
  {
    q: "Prenez-vous un board seat systématiquement ?",
    a: "En seed, nous demandons un siège observateur et un siège au board uniquement si nous leadons le tour (>50% du montant). En Série A, nous prenons toujours un board seat. Nous visons un board efficient : 5 membres maximum, avec une charte de gouvernance claire dès le closing.",
  },
  {
    q: "Quelle est votre zone géographique d'investissement ?",
    a: "Principalement France et Europe francophone (Belgique, Suisse, Luxembourg). Nous pouvons accompagner des tours en Europe germanophone ou ibérique si nous co-investissons avec un fonds local. Nous n'investissons pas aux États-Unis ou en Asie en lead.",
  },
  {
    q: "Comment assurez-vous le suivi post-investissement ?",
    a: "Chaque portefeuille bénéficie d'un Account Partner dédié, d'un accès à notre réseau de 280+ executives (CTO, CFO, VP Sales à disposition), de sessions de board préparées, d'introductions VC pour les tours suivants et d'un accès prioritaire à nos partenaires RH pour les recrutements clés.",
  },
  {
    q: "Peut-on postuler sans avoir de revenus ?",
    a: "Oui, en pré-seed. Nous finançons des équipes en phase de validation produit si nous croyons au marché et à la composition de l'équipe. Nous attendons a minima : un MVP en production, des premiers utilisateurs payants ou un LOI signé, et une équipe technique fondatrice. Les projets 100% idée sans traction sont hors scope.",
  },
]

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          fontFamily: FONT_SERIF,
          fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
          fontWeight: 700,
          fontStyle: "italic",
          color: C.gold,
          letterSpacing: "-0.5px",
          lineHeight: 1,
          marginBottom: "10px",
        }}
      >
        {value}
      </motion.div>
      <div style={{
        fontSize: "0.78rem",
        fontFamily: FONT_BODY,
        color: C.muted,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function Page() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const portfolioY = useTransform(scrollY, [0, 500], [0, -25])

  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [direction, setDirection] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function prevTestimonial() {
    const idx = (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    setDirection(-1)
    setActiveTestimonial(idx)
  }
  function nextTestimonial() {
    const idx = (activeTestimonial + 1) % TESTIMONIALS.length
    setDirection(1)
    setActiveTestimonial(idx)
  }
  function goToTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, overflowX: "hidden" }}>

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 60px",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "36px", height: "36px",
            border: `1.5px solid ${C.gold}`,
            borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: FONT_SERIF, fontSize: "1.1rem",
              fontWeight: 700, color: C.gold, fontStyle: "italic",
            }}>S</span>
          </div>
          <div>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: "1.15rem",
              fontWeight: 700, color: C.cream, letterSpacing: "0.04em",
            }}>Summit Capital</div>
            <div style={{ fontSize: "0.6rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "-2px" }}>
              Seed & Série A
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {["Thèse", "Portefeuille", "Équipe", "Actualités"].map((link) => (
            <Link key={link} href="#" style={{
              fontFamily: FONT_BODY, color: C.muted, textDecoration: "none",
              fontSize: "0.875rem", letterSpacing: "0.02em", cursor: "pointer",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >{link}</Link>
          ))}
        </div>

        <motion.a
          href="#"
          whileHover={{ backgroundColor: C.gold, color: "#0a0a0a" }}
          style={{
            border: `1px solid ${C.gold}`, color: C.gold,
            padding: "11px 24px", borderRadius: "2px",
            textDecoration: "none", fontSize: "0.8rem",
            fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.25s",
            fontFamily: FONT_BODY,
          }}
        >
          Soumettre un Dossier
        </motion.a>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "140px 60px 100px",
        maxWidth: "1300px", margin: "0 auto",
        gap: "80px",
      }}>
        <motion.div style={{ flex: "0 0 60%", y: heroTextY }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <div style={{
              fontSize: "0.7rem", fontFamily: FONT_BODY, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: C.gold, marginBottom: "32px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ width: "32px", height: "1px", background: C.gold }} />
              Fonds de Capital-Risque — Paris
            </div>

            <h1 style={{
              fontFamily: FONT_SERIF,
              fontSize: "clamp(3.2rem, 5.5vw, 5rem)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 1.06,
              letterSpacing: "-1px",
              color: C.cream,
              marginBottom: "0",
            }}>
              Nous Investissons
              <br />
              dans les
              <br />
              <span style={{ color: C.gold }}>Bâtisseurs.</span>
            </h1>

            {/* Gold underline rule */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "180px" }}
              transition={{ duration: 0.9, delay: 0.8 }}
              style={{
                height: "2px",
                background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                margin: "28px 0 36px",
              }}
            />

            <p style={{
              fontSize: "1.05rem", fontFamily: FONT_BODY,
              lineHeight: 1.8, color: C.muted, maxWidth: "520px",
              marginBottom: "48px",
            }}>
              Summit Capital investit en seed et Série A dans des startups tech B2B européennes. 280M€ sous gestion, 47 participations, une conviction : les meilleurs fondateurs ont besoin d'un partenaire — pas d'un actionnaire.
            </p>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <motion.a
                href="#"
                whileHover={{ backgroundColor: C.gold, color: "#0a0a0a" }}
                style={{
                  border: `1px solid ${C.gold}`, color: C.gold,
                  padding: "15px 32px", display: "inline-block",
                  textDecoration: "none", fontSize: "0.85rem",
                  fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                  transition: "all 0.25s", fontFamily: FONT_BODY,
                  borderRadius: "2px",
                }}
              >
                Soumettre Votre Dossier
              </motion.a>
              <Link href="#" style={{
                color: C.muted, textDecoration: "none",
                fontSize: "0.85rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "color 0.2s", fontFamily: FONT_BODY,
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                Notre thèse d'investissement →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Portfolio list */}
        <motion.div
          style={{ flex: "0 0 35%", y: portfolioY }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div style={{
            borderLeft: `2px solid ${C.gold}`,
            paddingLeft: "28px",
          }}>
            <div style={{
              fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.gold, marginBottom: "24px",
            }}>
              Quelques participations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {PORTFOLIO_COMPANIES.map((co, i) => (
                <motion.div
                  key={co.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  style={{
                    padding: "18px 20px",
                    background: i % 2 === 0 ? C.card : "transparent",
                    borderRadius: "2px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{
                        fontFamily: FONT_SERIF, fontSize: "1.3rem",
                        fontWeight: 700, color: C.cream, letterSpacing: "-0.3px",
                        marginBottom: "4px",
                      }}>
                        {co.flag} {co.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FONT_BODY }}>
                        {co.sector}
                      </div>
                    </div>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700,
                      color: C.gold, border: `1px solid ${C.border}`,
                      padding: "3px 10px", borderRadius: "1px",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      fontFamily: FONT_BODY,
                    }}>{co.stage}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{
              marginTop: "20px", paddingTop: "16px",
              borderTop: `1px solid ${C.border}`,
            }}>
              <Link href="#" style={{
                fontSize: "0.78rem", color: C.gold, textDecoration: "none",
                letterSpacing: "0.06em", cursor: "pointer", fontFamily: FONT_BODY,
                fontWeight: 600,
              }}>
                Voir les 47 participations →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: C.card,
        padding: "64px 60px",
      }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px", alignItems: "center",
        }}>
          <StatCounter value="280M€" label="Sous gestion" />
          <StatCounter value="47" label="Participations actives" />
          <StatCounter value="12 sorties" label="Dont 3 licornes" />
          <StatCounter value="2008" label="Fondé à Paris" />
        </div>
      </section>

      {/* ── INVESTMENT FOCUS (replaces Features/Tabs) ─────────── */}
      <section style={{ padding: "110px 60px", maxWidth: "1300px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "64px" }}
        >
          <div style={{
            fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: C.gold, marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "24px", height: "1px", background: C.gold }} />
            Thèse d'Investissement
          </div>
          <h2 style={{
            fontFamily: FONT_SERIF, fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
            fontWeight: 700, fontStyle: "italic",
            color: C.cream, letterSpacing: "-0.5px",
            maxWidth: "600px", lineHeight: 1.15,
          }}>
            Quatre domaines où nous avons une conviction forte
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {FOCUS_AREAS.map((area, i) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ borderColor: C.goldLight }}
              style={{
                background: C.card, borderRadius: "2px",
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${C.gold}`,
                padding: "40px 36px",
                transition: "border-color 0.3s",
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "20px",
              }}>
                <span style={{ fontSize: "1.4rem", color: C.gold }}>{area.icon}</span>
                <div>
                  <div style={{
                    fontFamily: FONT_SERIF, fontSize: "1.4rem",
                    fontWeight: 700, color: C.cream, letterSpacing: "-0.2px",
                  }}>{area.title}</div>
                  <div style={{ fontSize: "0.75rem", color: C.gold, fontFamily: FONT_BODY, fontWeight: 500 }}>
                    {area.subtitle}
                  </div>
                </div>
              </div>

              <p style={{
                fontSize: "0.9rem", lineHeight: 1.8, color: C.muted,
                marginBottom: "24px", fontFamily: FONT_BODY,
              }}>
                {area.body}
              </p>

              <div style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: "20px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                {area.metrics.map((m) => (
                  <div key={m} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    fontSize: "0.8rem", color: C.muted, fontFamily: FONT_BODY,
                  }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                    {m}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "110px 60px",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: "64px" }}
          >
            <div style={{
              fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: C.gold, marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ width: "24px", height: "1px", background: C.gold }} />
              Ce que disent les fondateurs
            </div>
            <h2 style={{
              fontFamily: FONT_SERIF, fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700, fontStyle: "italic",
              color: C.cream, letterSpacing: "-0.5px",
            }}>
              Au-delà du capital
            </h2>
          </motion.div>

          <div style={{ position: "relative", minHeight: "320px" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45 }}
                style={{
                  background: C.bg, borderRadius: "2px",
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${C.gold}`,
                  padding: "48px 56px",
                }}
              >
                <div style={{
                  fontFamily: FONT_SERIF, fontSize: "1.15rem",
                  fontStyle: "italic", lineHeight: 1.85,
                  color: C.text, marginBottom: "36px",
                }}>
                  « {TESTIMONIALS[activeTestimonial].quote} »
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "44px", height: "44px",
                      border: `1.5px solid ${C.gold}`,
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: FONT_BODY, fontWeight: 700,
                      fontSize: "0.8rem", color: C.gold,
                    }}>
                      {TESTIMONIALS[activeTestimonial].avatar}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: FONT_SERIF, fontSize: "1rem",
                        fontWeight: 700, color: C.cream,
                      }}>
                        {TESTIMONIALS[activeTestimonial].name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: C.muted, fontFamily: FONT_BODY }}>
                        {TESTIMONIALS[activeTestimonial].role} — {TESTIMONIALS[activeTestimonial].company}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: "0.72rem", fontFamily: FONT_BODY,
                    color: C.gold, fontWeight: 600,
                    padding: "6px 14px", border: `1px solid ${C.border}`,
                    borderRadius: "1px", letterSpacing: "0.04em",
                  }}>
                    {TESTIMONIALS[activeTestimonial].raise}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "28px" : "8px",
                    height: "2px",
                    background: i === activeTestimonial ? C.gold : C.border,
                    border: "none", cursor: "pointer",
                    transition: "all 0.3s", borderRadius: "1px",
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button
                onClick={prevTestimonial}
                whileHover={{ borderColor: C.gold, color: C.gold }}
                style={{
                  width: "40px", height: "40px",
                  background: "transparent", border: `1px solid ${C.border}`,
                  color: C.muted, cursor: "pointer", fontSize: "0.9rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "1px", transition: "all 0.2s",
                }}
              >←</motion.button>
              <motion.button
                onClick={nextTestimonial}
                whileHover={{ borderColor: C.gold, color: C.gold }}
                style={{
                  width: "40px", height: "40px",
                  background: "transparent", border: `1px solid ${C.border}`,
                  color: C.muted, cursor: "pointer", fontSize: "0.9rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "1px", transition: "all 0.2s",
                }}
              >→</motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS (replaces Pricing) ────────────────────────── */}
      <section style={{ padding: "110px 60px", maxWidth: "1300px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "64px" }}
        >
          <div style={{
            fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: C.gold, marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "24px", height: "1px", background: C.gold }} />
            Notre Processus
          </div>
          <h2 style={{
            fontFamily: FONT_SERIF, fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
            fontWeight: 700, fontStyle: "italic",
            color: C.cream, letterSpacing: "-0.5px", lineHeight: 1.15,
          }}>
            De la candidature
            <br />à la term sheet
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ position: "relative" }}
            >
              {/* Connector line */}
              {i < PROCESS_STEPS.length - 1 && (
                <div style={{
                  position: "absolute", top: "56px", right: "-1px",
                  width: "2px", height: "calc(100% - 80px)",
                  background: C.border, zIndex: 0,
                  display: "none",
                }} />
              )}
              <div style={{
                background: C.card, padding: "36px 28px",
                borderTop: `2px solid ${i === 1 ? C.gold : C.border}`,
                height: "100%",
              }}>
                <div style={{
                  fontFamily: FONT_SERIF, fontSize: "2.8rem",
                  fontWeight: 700, fontStyle: "italic",
                  color: i === 1 ? C.gold : "rgba(196,169,106,0.2)",
                  lineHeight: 1, marginBottom: "20px",
                }}>{step.num}</div>

                <div style={{
                  fontFamily: FONT_SERIF, fontSize: "1.25rem",
                  fontWeight: 700, color: C.cream, marginBottom: "4px",
                }}>{step.title}</div>
                <div style={{
                  fontSize: "0.72rem", fontFamily: FONT_BODY,
                  color: C.gold, fontWeight: 600, letterSpacing: "0.04em",
                  marginBottom: "16px", textTransform: "uppercase",
                }}>{step.sub}</div>

                <p style={{
                  fontSize: "0.85rem", lineHeight: 1.8,
                  color: C.muted, fontFamily: FONT_BODY,
                }}>{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: "40px", padding: "28px 36px",
            background: "rgba(196,169,106,0.05)",
            border: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: "24px", flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: "1.1rem",
              fontWeight: 700, color: C.cream, marginBottom: "4px",
            }}>
              Délai moyen de décision : 30 jours
            </div>
            <div style={{ fontSize: "0.82rem", color: C.muted, fontFamily: FONT_BODY }}>
              Du premier contact à la term sheet signée. Nous respectons votre temps.
            </div>
          </div>
          <motion.a
            href="#"
            whileHover={{ backgroundColor: C.gold, color: "#0a0a0a" }}
            style={{
              border: `1px solid ${C.gold}`, color: C.gold,
              padding: "13px 28px", textDecoration: "none",
              fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.25s",
              fontFamily: FONT_BODY, whiteSpace: "nowrap",
              borderRadius: "1px",
            }}
          >
            Commencer le processus →
          </motion.a>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "110px 60px",
      }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: "56px" }}
          >
            <div style={{
              fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: C.gold, marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ width: "24px", height: "1px", background: C.gold }} />
              Questions Fréquentes
            </div>
            <h2 style={{
              fontFamily: FONT_SERIF, fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700, fontStyle: "italic",
              color: C.cream, letterSpacing: "-0.5px",
            }}>
              Ce que les fondateurs nous demandent
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "24px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "transparent", border: "none", cursor: "pointer",
                    textAlign: "left", gap: "24px",
                  }}
                >
                  <span style={{
                    fontFamily: FONT_SERIF, fontSize: "1.05rem",
                    fontWeight: 700, color: openFaq === i ? C.cream : C.text,
                    lineHeight: 1.4, fontStyle: "italic",
                    transition: "color 0.2s",
                  }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      color: C.gold, fontSize: "1.4rem",
                      flexShrink: 0, fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >+</motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{
                        paddingBottom: "28px", color: C.muted,
                        fontSize: "0.9rem", lineHeight: 1.85,
                        fontFamily: FONT_BODY,
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section style={{ padding: "80px 60px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "1000px", margin: "0 auto",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${C.gold}`,
            padding: "72px 80px",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: "60px", alignItems: "center",
          }}
        >
          <div>
            <div style={{
              fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: C.gold, marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{ width: "24px", height: "1px", background: C.gold }} />
              Prêt à nous rencontrer ?
            </div>
            <h2 style={{
              fontFamily: FONT_SERIF, fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700, fontStyle: "italic",
              color: C.cream, letterSpacing: "-0.5px", lineHeight: 1.15,
              marginBottom: "20px",
            }}>
              Soumettre Votre Dossier
            </h2>
            <p style={{
              fontSize: "0.95rem", fontFamily: FONT_BODY,
              color: C.muted, lineHeight: 1.8, maxWidth: "480px",
            }}>
              Deck, métriques, vision. Pas de template imposé. Nous lisons toutes les candidatures et répondons sous 5 jours ouvrés avec un retour argumenté — qu'il soit positif ou négatif.
            </p>
            <div style={{
              display: "flex", gap: "32px", marginTop: "32px",
              flexWrap: "wrap",
            }}>
              {[
                { icon: "◈", text: "Réponse sous 5 jours" },
                { icon: "◎", text: "Retour toujours argumenté" },
                { icon: "◷", text: "Décision en 30 jours max" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: C.gold, fontSize: "0.9rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.8rem", color: C.muted, fontFamily: FONT_BODY }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "200px" }}>
            <motion.a
              href="#"
              whileHover={{ backgroundColor: C.gold, color: "#0a0a0a" }}
              style={{
                border: `1px solid ${C.gold}`, color: C.gold,
                padding: "16px 32px", textDecoration: "none",
                fontWeight: 600, fontSize: "0.85rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.25s",
                fontFamily: FONT_BODY, textAlign: "center",
                display: "block", borderRadius: "1px",
              }}
            >
              Soumettre un Dossier
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: C.cream }}
              style={{
                color: C.muted, textDecoration: "none",
                fontSize: "0.82rem", textAlign: "center",
                cursor: "pointer", fontFamily: FONT_BODY,
                transition: "color 0.2s", padding: "10px",
              }}
            >
              Rencontrer l'équipe →
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        background: "#050505",
        padding: "64px 60px 40px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "56px", marginBottom: "56px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div style={{
                  width: "36px", height: "36px",
                  border: `1.5px solid ${C.gold}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: FONT_SERIF, fontSize: "1.1rem",
                    fontWeight: 700, color: C.gold, fontStyle: "italic",
                  }}>S</span>
                </div>
                <div>
                  <div style={{
                    fontFamily: FONT_SERIF, fontSize: "1.1rem",
                    fontWeight: 700, color: C.cream,
                  }}>Summit Capital</div>
                  <div style={{ fontSize: "0.6rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Paris · Genève · Bruxelles
                  </div>
                </div>
              </div>
              <p style={{
                color: C.muted, fontSize: "0.82rem",
                lineHeight: 1.8, maxWidth: "260px", marginBottom: "28px",
                fontFamily: FONT_BODY,
              }}>
                Fonds de capital-risque indépendant. 280M€ sous gestion. Seed et Série A, tech B2B, Europe.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  {
                    label: "LinkedIn",
                    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
                  },
                  {
                    label: "MessageSquare",
                    d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.5 7-3.8 1.1 0 3-1.2 3-1.2z",
                  },
                  {
                    label: "AngelList",
                    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
                  },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    style={{
                      width: "36px", height: "36px",
                      border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: C.muted, textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    aria-label={social.label}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={social.d} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              { title: "Fonds", links: ["Thèse d'investissement", "Portefeuille", "Équipe", "Track Record"] },
              { title: "Fondateurs", links: ["Soumettre un dossier", "FAQ", "Processus", "Nos partenaires"] },
              { title: "Ressources", links: ["Blog", "Podcast", "Événements", "Presse"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{
                  fontSize: "0.65rem", fontFamily: FONT_BODY, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.gold, marginBottom: "22px",
                }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" style={{
                        color: C.muted, textDecoration: "none",
                        fontSize: "0.82rem", fontFamily: FONT_BODY,
                        cursor: "pointer", transition: "color 0.2s",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                      >{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: "28px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "16px",
          }}>
            <span style={{ fontSize: "0.75rem", color: C.muted, fontFamily: FONT_BODY }}>
              © 2025 Summit Capital SAS. AMF agréé — GP n°GP-XXXXXX. Tous droits réservés.
            </span>
            <div style={{ display: "flex", gap: "28px" }}>
              {["Mentions légales", "Politique RGPD", "Conflits d'intérêts"].map((l) => (
                <Link key={l} href="#" style={{
                  fontSize: "0.75rem", color: C.muted,
                  textDecoration: "none", cursor: "pointer",
                  fontFamily: FONT_BODY, transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                >{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
