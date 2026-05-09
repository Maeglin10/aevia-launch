"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#060b18",
  card: "#0d1829",
  text: "#e8f4ff",
  muted: "#7a9bb5",
  accent: "#00d4ff",
  border: "rgba(0,212,255,0.15)",
  borderHover: "rgba(0,212,255,0.4)",
  gradient: "linear-gradient(135deg, #060b18 0%, #0a1628 100%)",
}

const navLinks = ["Produit", "Solutions", "Sécurité", "Tarifs", "Docs"]

const stats = [
  { value: "850+", label: "Entreprises clientes", suffix: "" },
  { value: "2Md+", label: "Requêtes par mois", suffix: "" },
  { value: "99.99%", label: "Disponibilité garantie", suffix: "" },
  { value: "40ms", label: "Latence médiane", suffix: "" },
]

const features = [
  {
    tab: "RAG & Knowledge Base",
    headline: "Connectez vos données, interrogez en langage naturel",
    body: "Ingérez n'importe quelle source de données — PDF, bases de données, APIs, data lakes — et construisez des pipelines RAG haute performance avec chunking intelligent, reranking et cache sémantique. Vos équipes obtiennent des réponses précises ancrées dans vos données propriétaires.",
    points: ["Chunking adaptatif par type de document", "Reranking croisé multi-modèle", "Cache vectoriel avec TTL configurable", "Connecteurs natifs S3, GCS, SharePoint, Confluence"],
  },
  {
    tab: "Agents IA",
    headline: "Orchestrez des agents autonomes sur vos workflows métier",
    body: "Déployez des agents multi-étapes capables de planifier, exécuter et corriger leurs actions. Intégration native avec vos outils existants via 200+ connecteurs. Supervision temps réel, audit trail complet et kill-switch instantané.",
    points: ["Agents multi-step avec mémoire persistante", "200+ connecteurs Zapier, Salesforce, SAP", "Monitoring en temps réel avec traces", "Rollback instantané sur erreur détectée"],
  },
  {
    tab: "Analytics & BI",
    headline: "Transformez vos données brutes en insight décisionnels",
    body: "Interface en langage naturel sur vos entrepôts de données. Posez vos questions en français, obtenez des dashboards, des graphiques et des analyses narratives. Connecté nativement à BigQuery, Snowflake, Redshift et dbt.",
    points: ["SQL auto-généré et auditable", "Dashboards interactifs exportables", "Analyse de séries temporelles et prédiction", "Intégration Metabase, Tableau, Power BI"],
  },
  {
    tab: "Sécurité & Conformité",
    headline: "Conformité RGPD, SOC2 et ISO 27001 par défaut",
    body: "Vos données restent dans votre région cloud. Chiffrement AES-256 au repos, TLS 1.3 en transit. Audit log immuable, contrôle d'accès granulaire par rôle, et options de déploiement on-premise ou VPC privé.",
    points: ["RGPD, SOC2 Type II, ISO 27001 certifiés", "Déploiement on-premise ou VPC isolé", "Audit log immuable et exportable", "SSO SAML 2.0 / OIDC avec MFA obligatoire"],
  },
]

const testimonials = [
  {
    quote: "NimbusAI nous a permis de déployer notre premier agent IA en production en moins de 3 semaines. Le ROI était visible dès le deuxième mois : 60% de réduction des tickets niveau 1.",
    name: "Camille Rousseau",
    title: "CTO, Fintech Scale-up (Série B)",
    avatar: "CR",
  },
  {
    quote: "La performance du RAG est impressionnante. On interroge 40 ans d'archives juridiques en moins de 200ms. Aucun autre fournisseur n'a pu s'approcher de ce niveau de précision sur notre corpus.",
    name: "Édouard Marchetti",
    title: "Directeur Data, Cabinet d'avocats international",
    avatar: "EM",
  },
  {
    quote: "La certification SOC2 native et le déploiement dans notre VPC privé étaient non-négociables pour notre DSI. NimbusAI était la seule plateforme à cocher toutes les cases en enterprise.",
    name: "Sofia Andriessen",
    title: "VP Engineering, Assureur européen Top 10",
    avatar: "SA",
  },
  {
    quote: "On a remplacé 3 outils distincts par NimbusAI. L'unification du pipeline IA a réduit notre complexité opérationnelle de 70% et nos coûts d'infrastructure de 45%.",
    name: "Thomas Keller",
    title: "Head of Data, Retailer 500M€ de CA",
    avatar: "TK",
  },
]

const faqs = [
  {
    q: "Où sont hébergées mes données ?",
    a: "Vos données sont hébergées dans la région cloud de votre choix — Europe (Paris, Francfort), US ou APAC. Nous supportons AWS, GCP et Azure. En option Entreprise, déploiement entièrement dans votre infrastructure on-premise ou VPC privé, sans aucune donnée quittant votre périmètre.",
  },
  {
    q: "Puis-je utiliser mes propres LLMs (GPT-4, Claude, Mistral) ?",
    a: "Oui. NimbusAI est model-agnostic. Vous choisissez le modèle pour chaque tâche : OpenAI, Anthropic, Mistral, Cohere, ou vos propres modèles fine-tunés déployés sur HuggingFace ou SageMaker. Le routage intelligent peut basculer automatiquement selon le coût ou la performance.",
  },
  {
    q: "Est-il possible de déployer sans écrire de code ?",
    a: "Absolument. Notre interface no-code permet de construire des pipelines RAG, des agents et des dashboards analytiques par glisser-déposer. Pour les équipes techniques, notre SDK Python/TypeScript et notre API REST donnent un contrôle total. Les deux approches sont disponibles sur tous les plans.",
  },
  {
    q: "Comment NimbusAI assure-t-il la conformité RGPD ?",
    a: "Nous sommes sous-traitant au sens du RGPD. Nous signons un DPA (Data Processing Agreement) standard. Nos datacenters européens sont certifiés ISO 27001. Aucune donnée n'est utilisée pour entraîner nos modèles. Vous conservez la pleine propriété et le droit à l'effacement de toutes vos données.",
  },
  {
    q: "Quel est le délai de mise en production réaliste ?",
    a: "Les cas d'usage standards (chatbot sur documents, agent de support) sont en production en 1 à 3 semaines. Les intégrations complexes (multi-systèmes, on-premise, compliance stricte) prennent 4 à 8 semaines avec l'accompagnement de notre équipe Solutions Engineering dédiée.",
  },
  {
    q: "Proposez-vous un environnement de test avant achat ?",
    a: "Oui. Notre POC gratuit de 30 jours vous donne accès à toutes les fonctionnalités Business sans engagement. Vous êtes accompagné par un Solutions Engineer dédié qui vous aide à connecter vos sources de données réelles et à valider le ROI sur votre cas d'usage spécifique.",
  },
]

const pricing = [
  {
    name: "Starter",
    price: "490€",
    period: "/mois",
    description: "Idéal pour valider votre premier projet IA en production",
    features: ["1M tokens inclus/mois", "3 projets IA actifs", "RAG jusqu'à 50K documents", "Connecteurs standards (10)", "Support email 9h-18h", "Dashboard analytics de base", "API REST + SDK Python"],
    cta: "Démarrer gratuitement",
    highlighted: false,
  },
  {
    name: "Business",
    price: "1 990€",
    period: "/mois",
    description: "Pour les équipes qui scalent leur IA en entreprise",
    features: ["10M tokens inclus/mois", "Projets IA illimités", "RAG documents illimité", "Tous connecteurs (200+)", "SLA 99.9% garanti contractuellement", "Support prioritaire 24/7", "SSO SAML 2.0 / OIDC", "Agents multi-step avancés", "Fine-tuning de modèles"],
    cta: "Essayer 30 jours",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Déploiement souverain et conformité maximale",
    features: ["Tokens illimités", "Déploiement on-premise ou VPC privé", "SLA 99.99% avec pénalités", "Support dédié 24/7 avec CSM", "Compliance RGPD, SOC2, ISO 27001", "Audit trail immuable", "Formation équipes incluse", "Intégrations custom sur mesure"],
    cta: "Contacter les ventes",
    highlighted: false,
  },
]

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ textAlign: "center", padding: "0 24px" }}
    >
      <div style={{ fontSize: "2.75rem", fontWeight: 800, color: C.accent, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.875rem", color: C.muted, marginTop: "8px", fontWeight: 500 }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function NimbusAIPage() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -40])
  const diagramY = useTransform(scrollY, [0, 500], [0, 30])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [direction, setDirection] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function goTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }
  function prevTestimonial() {
    const idx = (activeTestimonial - 1 + testimonials.length) % testimonials.length
    setDirection(-1)
    setActiveTestimonial(idx)
  }
  function nextTestimonial() {
    const idx = (activeTestimonial + 1) % testimonials.length
    setDirection(1)
    setActiveTestimonial(idx)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", height: "64px",
          background: "rgba(6,11,24,0.92)", backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: `linear-gradient(135deg, ${C.accent}, #0090cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: C.text, letterSpacing: "-0.02em" }}>NimbusAI</span>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {navLinks.map(link => (
            <a key={link} href="#" style={{ color: C.muted, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              {link}
            </a>
          ))}
          <motion.a
            href="#poc"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.accent, color: "#060b18", padding: "9px 20px",
              borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem",
              textDecoration: "none", cursor: "pointer", letterSpacing: "-0.01em",
            }}
          >
            Démarrer le POC
          </motion.a>
        </div>
      </motion.nav>

      {/* ── 2. HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 48px 80px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "20%", left: "10%", width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1280px", margin: "0 auto", gap: "64px" }}>

          {/* Left — text */}
          <motion.div style={{ flex: "1 1 50%", y: heroTextY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(0,212,255,0.08)", border: `1px solid ${C.border}`,
                borderRadius: "100px", padding: "6px 14px", marginBottom: "28px",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Nouvelle infrastructure IA · v3.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.08,
                letterSpacing: "-0.04em", marginBottom: "24px", color: C.text,
              }}
            >
              L'IA d'Entreprise.<br />
              <span style={{ color: C.accent }}>Prête à l'Emploi.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{ fontSize: "1.15rem", color: C.muted, lineHeight: 1.65, marginBottom: "36px", maxWidth: "500px" }}
            >
              Déployez des pipelines RAG, des agents autonomes et des analytics génératifs en production en quelques semaines — sans compromis sur la sécurité ni la conformité.
            </motion.p>

            {/* Metric pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "44px" }}
            >
              {["99.9% SLA", "<200ms latence", "SOC2 Certifié"].map(pill => (
                <div key={pill} style={{
                  background: "rgba(0,212,255,0.07)", border: `1px solid ${C.border}`,
                  borderRadius: "100px", padding: "7px 16px",
                  fontSize: "0.8rem", fontWeight: 600, color: C.accent,
                  fontFamily: '"JetBrains Mono", monospace',
                }}>
                  {pill}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <motion.a
                href="#poc"
                whileHover={{ scale: 1.03, boxShadow: `0 0 32px rgba(0,212,255,0.3)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-block", background: C.accent, color: "#060b18",
                  padding: "14px 28px", borderRadius: "10px", fontWeight: 800,
                  fontSize: "1rem", textDecoration: "none", cursor: "pointer",
                }}
              >
                Démarrer votre POC gratuit
              </motion.a>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  color: C.text, textDecoration: "none", padding: "14px 24px",
                  border: `1px solid ${C.border}`, borderRadius: "10px",
                  fontWeight: 600, fontSize: "1rem", cursor: "pointer",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={C.accent} strokeWidth="2"/>
                  <path d="M10 8l6 4-6 4V8z" fill={C.accent}/>
                </svg>
                Voir la démo
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right — AI Pipeline diagram */}
          <motion.div style={{ flex: "1 1 45%", y: diagramY }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px",
                padding: "32px", position: "relative",
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "12px", fontSize: "0.8rem", color: C.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                  nimbus — ai-pipeline.yml
                </span>
              </div>

              {/* Pipeline diagram */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                {/* Box 1: Data Sources */}
                <div style={{
                  flex: 1, background: "rgba(0,212,255,0.06)", border: `1px solid ${C.border}`,
                  borderRadius: "12px", padding: "16px 12px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>🗄️</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.text, fontFamily: '"JetBrains Mono", monospace' }}>Data Sources</div>
                  <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: "4px" }}>PDF · SQL · API · S3</div>
                </div>

                {/* Connector 1 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: "0 0 auto" }}>
                  <div style={{ width: "40px", height: "2px", background: `linear-gradient(90deg, ${C.border}, ${C.accent})`, borderRadius: "2px", position: "relative" }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        position: "absolute", right: "-4px", top: "-4px",
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: C.accent, boxShadow: `0 0 8px ${C.accent}`,
                      }}
                    />
                  </div>
                </div>

                {/* Box 2: NimbusAI */}
                <div style={{
                  flex: 1, background: `linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.04))`,
                  border: `2px solid rgba(0,212,255,0.4)`,
                  borderRadius: "12px", padding: "16px 12px", textAlign: "center",
                  boxShadow: `0 0 24px rgba(0,212,255,0.1)`,
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>⚡</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.accent, fontFamily: '"JetBrains Mono", monospace' }}>NimbusAI</div>
                  <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: "4px" }}>RAG · Agents · BI</div>
                </div>

                {/* Connector 2 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: "0 0 auto" }}>
                  <div style={{ width: "40px", height: "2px", background: `linear-gradient(90deg, ${C.accent}, ${C.border})`, borderRadius: "2px", position: "relative" }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                      style={{
                        position: "absolute", right: "-4px", top: "-4px",
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: C.accent, boxShadow: `0 0 8px ${C.accent}`,
                      }}
                    />
                  </div>
                </div>

                {/* Box 3: Business Output */}
                <div style={{
                  flex: 1, background: "rgba(0,212,255,0.06)", border: `1px solid ${C.border}`,
                  borderRadius: "12px", padding: "16px 12px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>📊</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.text, fontFamily: '"JetBrains Mono", monospace' }}>Business Output</div>
                  <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: "4px" }}>Insights · Actions</div>
                </div>
              </div>

              {/* Metrics row */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                {[
                  { label: "Requêtes/s", value: "12,847", trend: "+12%" },
                  { label: "Précision RAG", value: "97.3%", trend: "+3.1%" },
                  { label: "Latence P99", value: "187ms", trend: "-8%" },
                ].map(m => (
                  <div key={m.label} style={{
                    flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: "8px",
                    padding: "10px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "0.65rem", color: C.muted, marginBottom: "4px" }}>{m.label}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: C.text, fontFamily: '"JetBrains Mono", monospace' }}>{m.value}</div>
                    <div style={{ fontSize: "0.65rem", color: "#22c55e", marginTop: "2px", fontFamily: '"JetBrains Mono", monospace' }}>{m.trend}</div>
                  </div>
                ))}
              </div>

              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}
                />
                <span style={{ fontSize: "0.72rem", color: C.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                  Pipeline actif · Tous systèmes opérationnels
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. STATS BAR ── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "52px 48px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "32px" }}>
          {stats.map(s => <StatCounter key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Plateforme complète</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Tout ce dont votre équipe IA a besoin
          </h2>
        </motion.div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "40px", borderBottom: `1px solid ${C.border}`, paddingBottom: "0", flexWrap: "wrap" }}>
          {features.map((f, i) => (
            <button
              key={f.tab}
              onClick={() => setActiveTab(i)}
              style={{
                background: "none", border: "none", padding: "12px 20px",
                cursor: "pointer", fontSize: "0.875rem", fontWeight: 600,
                color: activeTab === i ? C.accent : C.muted,
                borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                marginBottom: "-1px", transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              {f.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}
          >
            <div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1.25 }}>
                {features[activeTab].headline}
              </h3>
              <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "1rem", marginBottom: "28px" }}>
                {features[activeTab].body}
              </p>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  color: C.accent, textDecoration: "none", fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer",
                }}
              >
                Voir en démo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {features[activeTab].points.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: "10px", padding: "14px 16px",
                  }}
                >
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "0.875rem", color: C.text, lineHeight: 1.5 }}>{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 5. TESTIMONIALS ── */}
      <section style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Témoignages clients</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Ce que disent nos clients
            </h2>
          </motion.div>

          <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: "20px",
                  padding: "44px 48px", textAlign: "center",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "24px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={C.accent}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: "1.1rem", color: C.text, lineHeight: 1.7, marginBottom: "32px", fontStyle: "italic" }}>
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.accent}, #0090cc)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 800, color: "#060b18",
                  }}>
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{testimonials[activeTestimonial].name}</div>
                    <div style={{ fontSize: "0.8rem", color: C.muted }}>{testimonials[activeTestimonial].title}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "32px" }}>
              <button onClick={prevTestimonial} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => goTestimonial(i)} style={{ width: i === activeTestimonial ? "24px" : "8px", height: "8px", borderRadius: "100px", background: i === activeTestimonial ? C.accent : C.border, border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                ))}
              </div>
              <button onClick={nextTestimonial} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Tarification transparente</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "16px" }}>
            Des plans qui s'adaptent à votre croissance
          </h2>
          <p style={{ color: C.muted, maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            Commencez avec un POC gratuit de 30 jours. Passez à l'échelle sans surprises.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "start" }}>
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{
                background: plan.highlighted ? `linear-gradient(160deg, rgba(0,212,255,0.1), ${C.card})` : C.card,
                border: plan.highlighted ? `2px solid rgba(0,212,255,0.5)` : `1px solid ${C.border}`,
                borderRadius: "16px", padding: "36px 32px",
                transform: plan.highlighted ? "scale(1.03)" : "scale(1)",
                boxShadow: plan.highlighted ? `0 0 40px rgba(0,212,255,0.12)` : "none",
                position: "relative",
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  background: C.accent, color: "#060b18", padding: "4px 16px",
                  borderRadius: "100px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  Recommandé
                </div>
              )}
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: plan.highlighted ? C.accent : C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {plan.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: C.text, letterSpacing: "-0.04em", fontFamily: '"JetBrains Mono", monospace' }}>
                  {plan.price}
                </span>
                {plan.period && <span style={{ fontSize: "0.875rem", color: C.muted }}>{plan.period}</span>}
              </div>
              <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "28px", lineHeight: 1.5 }}>{plan.description}</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
                      <path d="M20 6L9 17l-5-5" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: "0.85rem", color: C.text, lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%", padding: "13px", borderRadius: "10px",
                  border: plan.highlighted ? "none" : `1px solid ${C.border}`,
                  background: plan.highlighted ? C.accent : "transparent",
                  color: plan.highlighted ? "#060b18" : C.text,
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Questions fréquentes</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Tout ce que vous devez savoir
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                style={{ background: C.bg, border: `1px solid ${openFaq === i ? "rgba(0,212,255,0.35)" : C.border}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", gap: "16px",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke={openFaq === i ? C.accent : C.muted} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </motion.div>
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
                      <div style={{ padding: "0 24px 22px", color: C.muted, fontSize: "0.9rem", lineHeight: 1.7 }}>
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

      {/* ── 8. CTA BANNER ── */}
      <section id="poc" style={{ background: `linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,144,204,0.06) 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 48px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
              POC gratuit · 30 jours · Aucune CB requise
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "20px" }}>
              Démarrer Votre POC<br />
              <span style={{ color: C.accent }}>Gratuitement</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: C.muted, lineHeight: 1.65, marginBottom: "44px", maxWidth: "520px", margin: "0 auto 44px" }}>
              Connectez vos données réelles, testez vos cas d'usage, mesurez le ROI. Accompagné par un Solutions Engineer dédié — sans engagement.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href="/poc"
                whileHover={{ scale: 1.04, boxShadow: `0 0 48px rgba(0,212,255,0.35)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-block", background: C.accent, color: "#060b18",
                  padding: "16px 36px", borderRadius: "12px", fontWeight: 800,
                  fontSize: "1.05rem", textDecoration: "none", cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
              >
                Démarrer votre POC gratuit
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-block", color: C.text, border: `1px solid ${C.border}`,
                  padding: "16px 32px", borderRadius: "12px", fontWeight: 600,
                  fontSize: "1.05rem", textDecoration: "none", cursor: "pointer",
                }}
              >
                Parler aux ventes
              </motion.a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "40px", flexWrap: "wrap" }}>
              {["RGPD conforme", "Hébergement EU", "SLA contractuel", "Support dédié"].map(badge => (
                <div key={badge} style={{ display: "flex", alignItems: "center", gap: "8px", color: C.muted, fontSize: "0.8rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. FOOTER ── */}
      <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "60px 48px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `linear-gradient(135deg, ${C.accent}, #0090cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontWeight: 700, color: C.text }}>NimbusAI</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.65, maxWidth: "260px", marginBottom: "20px" }}>
                La plateforme IA d'entreprise qui transforme vos données en avantage compétitif.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {/* GitHub */}
                <a href="#" style={{ width: "36px", height: "36px", borderRadius: "8px", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" style={{ width: "36px", height: "36px", borderRadius: "8px", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* MessageSquare/X */}
                <a href="#" style={{ width: "36px", height: "36px", borderRadius: "8px", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {[
              { title: "Produit", links: ["RAG & Knowledge Base", "Agents IA", "Analytics & BI", "Sécurité", "API & SDK", "Statut système"] },
              { title: "Solutions", links: ["Finance & Assurance", "Retail & E-commerce", "Santé & Pharma", "Industrie", "Secteur public"] },
              { title: "Entreprise", links: ["Tarifs", "Documentation", "Blog technique", "Cas clients", "Partenaires", "Nous contacter"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: C.text, marginBottom: "16px" }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "0.8rem", color: C.muted }}>
              © 2025 NimbusAI SAS. Tous droits réservés. · Hébergé en Europe · RGPD conforme
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Confidentialité", "Conditions d'utilisation", "Mentions légales", "Cookies"].map(link => (
                <a key={link} href="#" style={{ fontSize: "0.8rem", color: C.muted, textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
