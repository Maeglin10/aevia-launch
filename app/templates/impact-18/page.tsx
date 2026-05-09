"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#060e1f",
  card: "#0d1a35",
  accent: "#2563eb",
  border: "rgba(37,99,235,0.2)",
  text: "#f0f4ff",
  muted: "#8b9cc8",
  white: "#ffffff",
}

const TABS = [
  {
    id: "projects",
    label: "Gestion de Projets",
    icon: "◈",
    headline: "Vision complète sur chaque projet",
    body: "Kanban, Gantt, listes ou calendrier — choisissez la vue qui correspond à votre façon de travailler. Assignez des tâches, définissez des jalons, suivez les dépendances. Streamline adapte son interface à votre méthode, pas l'inverse.",
    items: ["Vues Kanban, Gantt et Timeline", "Jalons et dépendances de tâches", "Templates de projets réutilisables", "Notifications et rappels automatiques"],
  },
  {
    id: "time",
    label: "Suivi du Temps",
    icon: "◷",
    headline: "Chaque heure compte, littéralement",
    body: "Timer intégré, saisie manuelle ou import depuis vos outils existants. Vos équipes enregistrent leur temps sans friction. Vous visualisez en temps réel si un projet dépasse son budget avant que la situation devienne problématique.",
    items: ["Timer intégré sur chaque tâche", "Rapports d'utilisation par membre", "Alertes de dépassement de budget-temps", "Export vers la paie et la facturation"],
  },
  {
    id: "billing",
    label: "Facturation Client",
    icon: "◎",
    headline: "De la tâche à la facture en deux clics",
    body: "Convertissez automatiquement le temps suivi en factures professionnelles. Gérez les taux horaires par client, par projet ou par rôle. Envoyez, relancez et encaissez sans quitter Streamline.",
    items: ["Factures générées depuis le temps suivi", "Taux horaires différenciés par client", "Devis, bons de commande et relances", "Intégration Stripe et virement SEPA"],
  },
  {
    id: "analytics",
    label: "Rapports & Analytics",
    icon: "◉",
    headline: "Des données qui orientent vos décisions",
    body: "Tableaux de bord personnalisables, rapports de rentabilité par client, analyse de la charge équipe — tout ce dont vous avez besoin pour piloter votre agence avec précision et anticiper les crises avant qu'elles arrivent.",
    items: ["Rentabilité par projet et par client", "Charge de travail prévisionnelle", "Rapports exportables en PDF et CSV", "Dashboard direction avec KPIs personnalisés"],
  },
]

const TESTIMONIALS = [
  {
    quote: "On a réduit le temps consacré au reporting de 6 heures par semaine à moins d'une heure. Streamline a transformé notre façon de piloter les projets — nos clients reçoivent des updates clairs, notre équipe sait exactement où elle en est.",
    name: "Camille Rousseau",
    role: "Directrice Générale",
    company: "Atelier Pixel, Paris",
    avatar: "CR",
    rating: 5,
  },
  {
    quote: "Nous avons testé 8 outils différents en 4 ans. Streamline est le seul qui ait survécu plus de 3 mois dans notre studio. La flexibilité des vues et la qualité de la facturation intégrée sont incomparables à ce prix.",
    name: "Théo Marchand",
    role: "Fondateur & Creative Director",
    company: "Studio Forma, Lyon",
    avatar: "TM",
    rating: 5,
  },
  {
    quote: "L'onboarding de nouveaux chefs de projet prend maintenant 45 minutes au lieu de deux jours. L'interface est tellement intuitive que nos freelances s'y retrouvent immédiatement sans formation.",
    name: "Inès Charpentier",
    role: "Head of Operations",
    company: "Agence Nordique, Bordeaux",
    avatar: "IC",
    rating: 5,
  },
  {
    quote: "Le module de suivi du temps a littéralement sauvé deux projets qui allaient dans le mur. On a détecté le dérapage à la semaine 3 au lieu de le découvrir à la facturation finale. Indispensable.",
    name: "Romain Lefevre",
    role: "Project Manager Senior",
    company: "Momentum Digital, Nantes",
    avatar: "RL",
    rating: 5,
  },
]

const FAQS = [
  {
    q: "Comment migrer depuis un autre outil de gestion de projets ?",
    a: "Streamline propose un import en un clic depuis Asana, Trello, Monday, Notion et ClickUp. Notre équipe onboarding vous accompagne gratuitement sur la migration : nettoyage des données, structuration des espaces de travail, formation des équipes. La migration moyenne prend 2 jours ouvrés.",
  },
  {
    q: "Quelles intégrations sont disponibles ?",
    a: "Plus de 60 intégrations natives : Slack, Google Workspace, Microsoft Teams, Figma, GitHub, GitLab, Stripe, HubSpot, Salesforce, Zapier et Make. Notre API REST ouverte permet de connecter n'importe quel outil métier. Les utilisateurs Agence ont accès aux webhooks et à l'API complète.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Hébergement en Europe (Frankfurt), chiffrement AES-256 au repos et TLS 1.3 en transit, sauvegardes quotidiennes avec rétention 90 jours. Streamline est certifié SOC 2 Type II et RGPD-compliant. Vos données ne sont jamais vendues ni utilisées pour entraîner des modèles IA.",
  },
  {
    q: "Faut-il une carte de crédit pour l'essai gratuit ?",
    a: "Non. L'essai de 14 jours est entièrement gratuit, sans carte de crédit, sans engagement. Vous avez accès à toutes les fonctionnalités du plan Pro pendant 14 jours. À la fin de l'essai, vous choisissez votre plan ou repassez au plan Starter gratuit — vos données restent intactes.",
  },
  {
    q: "Peut-on annuler à tout moment ?",
    a: "Oui, sans préavis ni pénalité. Vous pouvez annuler depuis votre espace administrateur en moins de 2 minutes. La facturation s'arrête à la fin de la période en cours. Nous proposons également une suspension de compte (pause) si votre agence traverse une période creuse.",
  },
  {
    q: "Le plan Starter est-il vraiment gratuit pour toujours ?",
    a: "Oui. 3 projets actifs, 5 utilisateurs, 1 Go de stockage — à vie, sans carte de crédit. C'est notre façon de permettre aux petites structures de démarrer. Quand vous grandissez, la mise à niveau vers Pro se fait en un clic, avec toutes vos données préservées.",
  },
]

const PRICING = [
  {
    name: "Starter",
    price: "0€",
    period: "",
    desc: "Pour les petites équipes qui démarrent",
    highlight: false,
    features: ["3 projets actifs", "5 utilisateurs maximum", "Vues Kanban et liste", "Suivi du temps basique", "1 Go de stockage", "Support communauté"],
    cta: "Démarrer Gratuitement",
  },
  {
    name: "Pro",
    price: "24€",
    period: "/mois/utilisateur",
    desc: "Pour les agences en croissance",
    highlight: true,
    features: ["Projets illimités", "Utilisateurs illimités", "Toutes les vues (Gantt, Timeline)", "Facturation client intégrée", "Analytics avancés", "Intégrations natives (60+)", "50 Go de stockage", "Support prioritaire 24h"],
    cta: "Essai Gratuit 14 Jours",
  },
  {
    name: "Agence",
    price: "79€",
    period: "/mois/utilisateur",
    desc: "Pour les grandes agences et studios",
    highlight: false,
    features: ["Tout le plan Pro", "White-label complet", "API REST + Webhooks", "SSO et SAML", "Espaces clients dédiés", "Rôles et permissions avancés", "Stockage illimité", "Account manager dédié"],
    cta: "Contacter les Ventes",
  },
]

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ textAlign: "center", padding: "0 32px" }}
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: "2.6rem",
          fontWeight: 800,
          color: C.accent,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-1px",
          lineHeight: 1,
        }}
      >
        {value}
      </motion.div>
      <div
        style={{
          fontSize: "0.875rem",
          color: C.muted,
          marginTop: "8px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}

export default function Page() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -40])
  const dashboardY = useTransform(scrollY, [0, 500], [0, 20])

  const [activeTab, setActiveTab] = useState("projects")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [direction, setDirection] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0]

  function goToTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }
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

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: "1100px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(6,14,31,0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: 800, color: C.white,
          }}>S</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: C.white, letterSpacing: "-0.3px" }}>Streamline</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {["Fonctionnalités", "Tarifs", "Cas Clients", "Blog"].map((link) => (
            <Link key={link} href="#" style={{
              color: C.muted, textDecoration: "none", fontSize: "0.875rem",
              fontWeight: 500, transition: "color 0.2s", cursor: "pointer",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >{link}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="#" style={{
            color: C.muted, textDecoration: "none", fontSize: "0.875rem",
            fontWeight: 500, cursor: "pointer",
          }}>Connexion</Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ position: "relative" }}>
            <Link href="#" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: C.accent, color: C.white, padding: "9px 20px",
              borderRadius: "10px", textDecoration: "none", fontSize: "0.875rem",
              fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em",
            }}>
              Essai Gratuit
              <span style={{
                background: "#facc15", color: "#0a0a0a", fontSize: "0.6rem",
                fontWeight: 800, padding: "2px 6px", borderRadius: "4px",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>NOUVEAU</span>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "140px 24px 80px", maxWidth: "1200px", margin: "0 auto",
        gap: "60px",
      }}>
        <motion.div style={{ flex: "1 1 50%", y: heroTextY }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(37,99,235,0.12)", border: `1px solid ${C.border}`,
              borderRadius: "100px", padding: "6px 14px", marginBottom: "28px",
            }}>
              <span style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: "0.78rem", color: C.accent, fontWeight: 600, letterSpacing: "0.04em" }}>
                NOUVEAU — Rapports IA en temps réel
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 800,
              lineHeight: 1.08, letterSpacing: "-2px", color: C.white,
              marginBottom: "24px",
            }}>
              Gérez Tout.
              <br />
              <span style={{ color: C.accent }}>Livrez Vite.</span>
            </h1>

            <p style={{
              fontSize: "1.1rem", lineHeight: 1.7, color: C.muted,
              maxWidth: "480px", marginBottom: "40px",
            }}>
              La plateforme de gestion de projets pensée pour les agences et studios créatifs. Kanban, suivi du temps, facturation client — tout au même endroit.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: `0 0 32px rgba(37,99,235,0.5)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-block", background: C.accent,
                  color: C.white, padding: "16px 32px", borderRadius: "12px",
                  textDecoration: "none", fontWeight: 700, fontSize: "1rem",
                  cursor: "pointer", letterSpacing: "0.01em",
                }}
              >
                Essai Gratuit — 14 jours
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ background: "rgba(37,99,235,0.1)" }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  border: `1px solid ${C.border}`, color: C.text,
                  padding: "16px 28px", borderRadius: "12px", textDecoration: "none",
                  fontWeight: 600, fontSize: "1rem", cursor: "pointer",
                }}
              >
                <span style={{
                  width: "32px", height: "32px", background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.8rem",
                }}>▶</span>
                Voir la démo
              </motion.a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "36px" }}>
              <div style={{ display: "flex" }}>
                {["A", "B", "C", "D"].map((l, i) => (
                  <div key={l} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: `hsl(${210 + i * 30}, 70%, 50%)`,
                    border: `2px solid ${C.bg}`, marginLeft: i > 0 ? "-10px" : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700, color: C.white,
                  }}>{l}</div>
                ))}
              </div>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>
                <strong style={{ color: C.white }}>12,000+ équipes</strong> font confiance à Streamline
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          style={{ flex: "1 1 50%", y: dashboardY }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div style={{
            background: C.card, borderRadius: "20px",
            border: `1px solid ${C.border}`,
            padding: "20px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.1)",
          }}>
            {/* Mockup header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, height: "24px", background: "rgba(255,255,255,0.04)",
                borderRadius: "6px", marginLeft: "8px", display: "flex",
                alignItems: "center", paddingLeft: "10px",
              }}>
                <span style={{ fontSize: "0.7rem", color: C.muted }}>app.streamline.io/projets/website-rebrand</span>
              </div>
            </div>

            {/* Kanban */}
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { col: "À Faire", color: "#64748b", tasks: [
                  { title: "Brief client", tag: "Design", tagColor: "#7c3aed" },
                  { title: "Wireframes v2", tag: "UX", tagColor: "#0891b2" },
                  { title: "Audit SEO", tag: "Marketing", tagColor: "#16a34a" },
                ]},
                { col: "En Cours", color: "#2563eb", tasks: [
                  { title: "Maquettes Figma", tag: "Design", tagColor: "#7c3aed" },
                  { title: "Dev Front-End", tag: "Dev", tagColor: "#dc2626" },
                ]},
                { col: "Terminé", color: "#16a34a", tasks: [
                  { title: "Benchmark concurrents", tag: "Stratégie", tagColor: "#d97706" },
                  { title: "Charte graphique", tag: "Design", tagColor: "#7c3aed" },
                  { title: "Contrats signés", tag: "Admin", tagColor: "#64748b" },
                ]},
              ].map(({ col, color, tasks }) => (
                <div key={col} style={{ flex: 1 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    marginBottom: "10px", padding: "4px 0",
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{col}</span>
                    <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1px 6px", color: C.muted }}>{tasks.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {tasks.map((task) => (
                      <div key={task.title} style={{
                        background: "rgba(255,255,255,0.04)", borderRadius: "8px",
                        padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)",
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: C.text, marginBottom: "6px" }}>{task.title}</div>
                        <span style={{
                          fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px",
                          borderRadius: "100px", background: `${task.tagColor}22`,
                          color: task.tagColor, letterSpacing: "0.04em",
                        }}>{task.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.7rem", color: C.muted }}>Progression globale</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.accent }}>64%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "64%" }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  style={{ height: "100%", background: C.accent, borderRadius: "3px" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: C.card,
        padding: "56px 24px",
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "40px",
        }}>
          <StatCounter value="12,000+" label="Équipes actives dans le monde" />
          <div style={{ width: "1px", background: C.border, alignSelf: "stretch" }} />
          <StatCounter value="4.9★" label="Note moyenne sur G2" />
          <div style={{ width: "1px", background: C.border, alignSelf: "stretch" }} />
          <StatCounter value="98%" label="Taux de rétention annuel" />
          <div style={{ width: "1px", background: C.border, alignSelf: "stretch" }} />
          <StatCounter value="45 min" label="Onboarding moyen (équipe entière)" />
        </div>
      </section>

      {/* ── FEATURES / TABS ───────────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800,
            letterSpacing: "-1.5px", color: C.white, marginBottom: "16px",
          }}>
            Tout ce dont votre agence a besoin
          </h2>
          <p style={{ fontSize: "1rem", color: C.muted, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Une plateforme unifiée. Zéro jonglage entre les outils, zéro perte d'information, zéro frustration.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px",
          marginBottom: "48px", flexWrap: "wrap",
        }}>
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 22px", borderRadius: "10px", border: "none",
                cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
                fontFamily: "system-ui, -apple-system, sans-serif",
                background: activeTab === tab.id ? C.accent : "rgba(255,255,255,0.05)",
                color: activeTab === tab.id ? C.white : C.muted,
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px",
              alignItems: "center",
              background: C.card, borderRadius: "20px",
              border: `1px solid ${C.border}`, padding: "48px",
            }}
          >
            <div>
              <div style={{
                fontSize: "0.78rem", fontWeight: 700, color: C.accent,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px",
              }}>
                {currentTab.icon} {currentTab.label}
              </div>
              <h3 style={{
                fontSize: "1.8rem", fontWeight: 800, color: C.white,
                letterSpacing: "-0.5px", marginBottom: "18px", lineHeight: 1.2,
              }}>
                {currentTab.headline}
              </h3>
              <p style={{ color: C.muted, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "32px" }}>
                {currentTab.body}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentTab.items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: C.text, fontSize: "0.9rem" }}>
                    <span style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: "rgba(37,99,235,0.2)", color: C.accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", flexShrink: 0, marginTop: "2px",
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              background: "rgba(37,99,235,0.05)", borderRadius: "16px",
              border: `1px solid ${C.border}`, padding: "32px",
              display: "flex", flexDirection: "column", gap: "16px",
              minHeight: "280px", justifyContent: "center",
            }}>
              {currentTab.items.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: C.accent, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "0.85rem", color: C.text }}>{item}</span>
                  <div style={{
                    marginLeft: "auto", width: `${50 + i * 15}%`,
                    height: "6px", background: "rgba(37,99,235,0.2)",
                    borderRadius: "3px", position: "relative", maxWidth: "100px",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      style={{ position: "absolute", top: 0, left: 0, height: "100%", background: C.accent, borderRadius: "3px" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "100px 24px",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
              letterSpacing: "-1px", color: C.white, marginBottom: "12px",
            }}>
              12,000 équipes. Une seule plateforme.
            </h2>
            <p style={{ color: C.muted, fontSize: "0.95rem" }}>Ce qu'ils en disent vraiment.</p>
          </motion.div>

          <div style={{ position: "relative", overflow: "hidden", minHeight: "280px" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: C.bg, borderRadius: "20px",
                  border: `1px solid ${C.border}`,
                  padding: "40px 48px",
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                    <span key={i} style={{ color: "#facc15", fontSize: "1.1rem" }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: "1.1rem", lineHeight: 1.75, color: C.text,
                  fontStyle: "italic", marginBottom: "28px",
                }}>
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: C.accent, display: "flex", alignItems: "center",
                    justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: C.white,
                  }}>
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: C.white, fontSize: "0.9rem" }}>
                      {TESTIMONIALS[activeTestimonial].name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: C.muted }}>
                      {TESTIMONIALS[activeTestimonial].role} — {TESTIMONIALS[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" }}>
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "transparent", border: `1px solid ${C.border}`,
                color: C.muted, cursor: "pointer", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >←</motion.button>

            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "24px" : "8px",
                    height: "8px", borderRadius: "4px",
                    background: i === activeTestimonial ? C.accent : "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "transparent", border: `1px solid ${C.border}`,
                color: C.muted, cursor: "pointer", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >→</motion.button>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800,
            letterSpacing: "-1.5px", color: C.white, marginBottom: "16px",
          }}>
            Prix simples, sans surprise
          </h2>
          <p style={{ color: C.muted, fontSize: "0.95rem" }}>
            Commencez gratuitement. Montez en puissance quand vous êtes prêt.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              style={{
                background: plan.highlight ? C.accent : C.card,
                borderRadius: "20px",
                border: plan.highlight ? "none" : `1px solid ${C.border}`,
                padding: "36px 32px",
                position: "relative",
                boxShadow: plan.highlight ? "0 24px 60px rgba(37,99,235,0.3)" : "none",
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
                  background: "#facc15", color: "#0a0a0a", fontSize: "0.7rem",
                  fontWeight: 800, padding: "4px 14px", borderRadius: "100px",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  Le Plus Populaire
                </div>
              )}

              <div style={{ marginBottom: "28px" }}>
                <div style={{
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: plan.highlight ? "rgba(255,255,255,0.7)" : C.muted,
                  marginBottom: "10px",
                }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "2.8rem", fontWeight: 800, color: C.white, letterSpacing: "-1px" }}>{plan.price}</span>
                  <span style={{ fontSize: "0.8rem", color: plan.highlight ? "rgba(255,255,255,0.6)" : C.muted }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: plan.highlight ? "rgba(255,255,255,0.7)" : C.muted }}>
                  {plan.desc}
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "10px", fontSize: "0.875rem", color: plan.highlight ? C.white : C.text }}>
                    <span style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : C.accent, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "block", textAlign: "center",
                  padding: "14px", borderRadius: "10px",
                  background: plan.highlight ? C.white : "rgba(37,99,235,0.15)",
                  color: plan.highlight ? C.accent : C.white,
                  textDecoration: "none", fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer",
                }}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "100px 24px",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
              letterSpacing: "-1px", color: C.white, marginBottom: "12px",
            }}>
              Questions fréquentes
            </h2>
            <p style={{ color: C.muted, fontSize: "0.95rem" }}>
              Tout ce que vous devez savoir avant de démarrer.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: C.bg, borderRadius: "14px",
                  border: `1px solid ${openFaq === i ? C.accent : C.border}`,
                  overflow: "hidden", transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "transparent", border: "none", cursor: "pointer",
                    textAlign: "left", gap: "16px",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.95rem", color: C.white, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: C.accent, fontSize: "1.2rem", flexShrink: 0, fontWeight: 300 }}
                  >+</motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{
                        padding: "0 24px 22px", color: C.muted,
                        fontSize: "0.9rem", lineHeight: 1.8,
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
      <section style={{ padding: "80px 24px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: "900px", margin: "0 auto",
            background: `linear-gradient(135deg, ${C.accent} 0%, #1d4ed8 100%)`,
            borderRadius: "24px", padding: "72px 60px",
            textAlign: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 32px 80px rgba(37,99,235,0.35)",
          }}
        >
          {/* decorative circles */}
          <div style={{
            position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", top: "-80px", right: "-60px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)", bottom: "-60px", left: "-40px",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-block", background: "rgba(255,255,255,0.15)",
              borderRadius: "100px", padding: "6px 16px",
              fontSize: "0.78rem", fontWeight: 700, color: C.white,
              letterSpacing: "0.06em", marginBottom: "24px",
            }}>
              AUCUNE CARTE DE CRÉDIT REQUISE
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800,
              color: C.white, letterSpacing: "-1.5px", marginBottom: "18px", lineHeight: 1.1,
            }}>
              Démarrer Votre Essai Gratuit
              <br />de 14 Jours
            </h2>
            <p style={{
              fontSize: "1rem", color: "rgba(255,255,255,0.75)",
              marginBottom: "40px", maxWidth: "440px", margin: "0 auto 40px", lineHeight: 1.7,
            }}>
              Rejoignez 12,000 agences qui ont transformé leur gestion de projets. Configuration en moins de 5 minutes.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-block", background: C.white,
                  color: C.accent, padding: "16px 36px",
                  borderRadius: "12px", textDecoration: "none",
                  fontWeight: 800, fontSize: "1rem", cursor: "pointer",
                }}
              >
                Démarrer Gratuitement →
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ background: "rgba(255,255,255,0.2)" }}
                style={{
                  display: "inline-block",
                  border: "2px solid rgba(255,255,255,0.4)",
                  color: C.white, padding: "16px 28px",
                  borderRadius: "12px", textDecoration: "none",
                  fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                }}
              >
                Voir une démo live
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        background: C.card,
        padding: "64px 24px 40px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: C.accent, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, fontSize: "16px", color: C.white,
                }}>S</div>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: C.white }}>Streamline</span>
              </div>
              <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "260px", marginBottom: "24px" }}>
                La plateforme de gestion de projets pour les agences et studios créatifs qui veulent livrer plus vite.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "MessageSquare", d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.5 7-3.8 1.1 0 3-1.2 3-1.2z" },
                  { label: "LinkedIn", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
                  { label: "GitHub", d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.15, color: C.accent }}
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: C.muted, textDecoration: "none",
                    }}
                    aria-label={social.label}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={social.d} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              { title: "Produit", links: ["Fonctionnalités", "Tarifs", "Mises à jour", "Roadmap"] },
              { title: "Ressources", links: ["Documentation", "Blog", "Webinaires", "Statut"] },
              { title: "Entreprise", links: ["À propos", "Partenaires", "Recrutement", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: C.muted, marginBottom: "20px",
                }}>
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" style={{
                        color: C.muted, textDecoration: "none", fontSize: "0.875rem",
                        transition: "color 0.2s", cursor: "pointer",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
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
            <span style={{ fontSize: "0.8rem", color: C.muted }}>
              © 2025 Streamline Technologies SAS. Tous droits réservés.
            </span>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Confidentialité", "CGU", "Cookies"].map((l) => (
                <Link key={l} href="#" style={{
                  fontSize: "0.8rem", color: C.muted, textDecoration: "none",
                  cursor: "pointer", transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
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
