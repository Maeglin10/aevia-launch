"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Zap, BarChart3, Shield, Code2, Layers, Globe, Check, Star, Menu, ArrowRight, MessageSquare, Link2, GitBranch, ChevronRight, Users, TrendingUp, Lock, RefreshCw } from "lucide-react"

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const FEATURES = [
  { icon: Zap, title: "Automatisation intelligente", desc: "Automatisez vos workflows répétitifs avec notre moteur IA — économisez 12h de travail par semaine en moyenne." },
  { icon: BarChart3, title: "Analytics en temps réel", desc: "Tableaux de bord dynamiques, alertes proactives et rapports automatisés pour des décisions data-driven." },
  { icon: Shield, title: "Sécurité enterprise", desc: "SOC 2 Type II, chiffrement AES-256, SSO SAML, RBAC granulaire — la sécurité n'est pas une option." },
  { icon: Code2, title: "API & intégrations", desc: "REST + GraphQL API, webhooks, 200+ intégrations natives (Salesforce, HubSpot, Slack, Jira, etc.)." },
  { icon: Layers, title: "Multi-tenant & scalable", desc: "Architecture cloud-native conçue pour scaler de 10 à 10 000 utilisateurs sans friction." },
  { icon: Globe, title: "Collaboration globale", desc: "Workspaces partagés, gestion des permissions, commentaires en contexte — votre équipe en sync 24/7." },
]

const STATS = [
  { val: "8 400+", label: "Entreprises clientes" },
  { val: "99.98%", label: "Uptime SLA" },
  { val: "12h", label: "Économisées / semaine" },
  { val: "4.9/5", label: "G2 & Capterra" },
  { val: "SOC 2", label: "Type II certifié" },
]

const TESTIMONIALS = [
  { name: "Alexandre Dubois", role: "CTO, Spendr", rating: 5, text: "On a réduit notre temps de reporting de 80% en 3 semaines. L'API est propre, la doc est excellente, et le support est réactif. C'est ce qu'on attendait depuis des années.", avatar: "AD" },
  { name: "Marie Chen", role: "VP Ops, NordX", rating: 5, text: "L'intégration Salesforce + Slack a transformé nos workflows commerciaux. Les alertes automatisées ont réduit notre churn de 23% en un trimestre.", avatar: "MC" },
  { name: "Thomas Müller", role: "Fondateur, Growthly", rating: 5, text: "Migration depuis notre ancienne solution en 48h chrono. L'équipe support a été présente à chaque étape. On ne reviendra jamais en arrière.", avatar: "TM" },
  { name: "Sarah Leclerc", role: "Head of Product, Aevia", rating: 5, text: "La scalabilité est impressionnante. On est passé de 50 à 2 400 utilisateurs en 6 mois sans un seul incident. Le pricing était aussi franchement compétitif.", avatar: "SL" },
  { name: "Kevin Park", role: "CEO, DataNexus", rating: 5, text: "Les dashboards en temps réel ont complètement changé notre relation aux données. Nos investisseurs adorent les rapports automatisés qu'on leur envoie maintenant.", avatar: "KP" },
]

const PRICING = [
  { name: "Starter", price: "49", period: "/mois", desc: "Pour les équipes qui démarrent", features: ["5 utilisateurs inclus", "10 workflows automatisés", "Analytics 30 jours", "API 10K calls/mois", "Support email", "Intégrations de base (20+)"] },
  { name: "Growth", price: "199", period: "/mois", desc: "Pour les équipes en croissance", featured: true, features: ["25 utilisateurs inclus", "Workflows illimités", "Analytics 12 mois", "API 500K calls/mois", "Support prioritaire 24/7", "200+ intégrations", "SSO & SAML", "Rôles & permissions avancés"] },
  { name: "Enterprise", price: "Sur mesure", period: "", desc: "Pour les grandes organisations", features: ["Utilisateurs illimités", "Infrastructure dédiée", "SLA 99.99% garanti", "Support dédié + CSM", "Audit logs complets", "RBAC granulaire", "On-premise disponible", "Formation & onboarding inclus"] },
]

const FAQS = [
  { q: "Quelle est la durée minimale d'engagement ?", a: "Aucun engagement. Nos plans Starter et Growth sont mensuels, sans frais d'annulation. L'Enterprise inclut un contrat annuel avec des conditions de résiliation transparentes." },
  { q: "Comment fonctionne l'onboarding ?", a: "Après votre inscription, un Customer Success Manager vous contacte sous 24h pour un call d'onboarding. Notre équipe peut importer vos données existantes et configurer vos premiers workflows." },
  { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Nous sommes certifiés SOC 2 Type II, RGPD compliant, et toutes les données sont chiffrées en transit et au repos (AES-256). Vos données n'ont jamais accès à nos modèles IA." },
  { q: "Puis-je migrer depuis un autre outil ?", a: "Oui. Nous proposons des migrations assistées depuis Zapier, Make, Monday, Asana, et Notion. Notre équipe technique s'occupe de tout sans interruption de service." },
  { q: "L'API est-elle complète ?", a: "Notre API REST + GraphQL expose l'intégralité des fonctionnalités de la plateforme. Documentation OpenAPI interactive, SDK JavaScript/Python/PHP inclus, webhooks temps réel." },
  { q: "Y a-t-il une version d'essai ?", a: "Oui, 14 jours d'essai gratuit sur le plan Growth, sans carte bancaire requise. Accès complet à toutes les fonctionnalités, données d'essai incluses pour tester rapidement." },
  { q: "Que se passe-t-il si je dépasse mes limites ?", a: "Vous recevez une alerte à 80% d'utilisation. Si vous dépassez, les services continuent de fonctionner et on vous propose une upgrade — pas de coupure surprise." },
]

export default function EssentialSaaSPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#06070f", color: "#e8eaf6", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* NAVBAR */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(6,7,15,0.9)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e8eaf6", letterSpacing: "-0.01em" }}>FlowSync</span>
          </Link>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {["Fonctionnalités", "Intégrations", "Tarifs", "Docs"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ color: "rgba(232,234,246,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#818cf8")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,234,246,0.6)")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "9px 20px", background: "transparent", color: "rgba(232,234,246,0.7)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Se connecter
            </motion.button>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "9px 20px", background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Essai gratuit 14j
            </motion.button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#e8eaf6", cursor: "pointer" }} className="md:hidden block"><Menu size={24} /></button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#06070f", borderLeft: "1px solid rgba(99,102,241,0.15)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Fonctionnalités", "Intégrations", "Tarifs", "Docs"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)} style={{ color: "#e8eaf6", textDecoration: "none", fontSize: 18, fontWeight: 500 }}>{item}</a>
                ))}
                <button style={{ padding: "14px", background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Essai gratuit 14j
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 68 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <motion.div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "80px 32px", textAlign: "center", opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)", fontSize: 12, marginBottom: 24, padding: "5px 14px" }}>
              ✦ Nouveau — Automatisation IA disponible
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(40px, 6.5vw, 82px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: "#e8eaf6" }}>
            Automatisez votre business.<br /><span style={{ background: "linear-gradient(135deg, #6366f1, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Multipliez vos résultats.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            style={{ fontSize: 19, color: "rgba(232,234,246,0.65)", lineHeight: 1.7, marginBottom: 44, maxWidth: 580, margin: "0 auto 44px" }}>
            FlowSync connecte vos outils, automatise vos workflows et vous donne les insights pour prendre de meilleures décisions — sans une ligne de code.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Commencer gratuitement
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.05)", color: "#e8eaf6", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 16, cursor: "pointer", backdropFilter: "blur(8px)" }}>
              Voir la démo ↗
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, overflow: "hidden", maxWidth: 900, margin: "0 auto" }}>
            <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Dashboard FlowSync" width={900} height={500} style={{ width: "100%", height: "auto", display: "block" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "48px 32px", background: "rgba(99,102,241,0.04)", borderTop: "1px solid rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#818cf8", letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "rgba(232,234,246,0.45)", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnalités" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)", fontSize: 12, marginBottom: 16 }}>FONCTIONNALITÉS</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#e8eaf6" }}>Tout ce dont votre équipe a besoin</h2>
              <p style={{ fontSize: 16, color: "rgba(232,234,246,0.5)", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>Une plateforme unifiée pour automatiser, analyser et collaborer — sans multiplier les outils.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.3)" }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 14, padding: "28px 24px", cursor: "pointer", transition: "border-color 0.3s" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <f.icon size={20} color="#818cf8" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8eaf6", marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(232,234,246,0.55)", lineHeight: 1.7 }}>{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS TABS */}
      <section id="intégrations" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#e8eaf6", letterSpacing: "-0.02em" }}>200+ intégrations <span style={{ color: "#818cf8" }}>natives</span></h2>
            </div>
          </Reveal>

          <Tabs defaultValue="crm" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.15)", marginBottom: 40, display: "flex", height: "auto", padding: 4, gap: 4 }}>
              <TabsTrigger value="crm" style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "rgba(232,234,246,0.55)" }}>CRM & Sales</TabsTrigger>
              <TabsTrigger value="dev" style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "rgba(232,234,246,0.55)" }}>Dev & Ops</TabsTrigger>
              <TabsTrigger value="collab" style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "rgba(232,234,246,0.55)" }}>Collaboration</TabsTrigger>
            </TabsList>

            {[
              { id: "crm", title: "Salesforce, HubSpot, Pipedrive, Intercom, Zendesk", desc: "Synchronisez vos contacts, deals et tickets en temps réel. Déclenchez des workflows CRM depuis n'importe quel événement.", items: ["Sync bidirectionnel automatique", "Création de leads depuis formulaires", "Alertes churn prédictif", "Rapports revenue automatisés"] },
              { id: "dev", title: "GitHub, Jira, Linear, Datadog, PagerDuty", desc: "Automatisez vos pipelines CI/CD, incidents et tickets de développement en connectant vos outils de prod.", items: ["Webhook sur PR, deploy, incident", "Alertes Datadog → Slack", "Sprint planning automatisé", "Release notes générées par IA"] },
              { id: "collab", title: "Slack, Teams, Notion, Google Workspace, Zoom", desc: "Gardez votre équipe en sync sans effort. Notifications intelligentes, résumés automatiques et mises à jour contextuelles.", items: ["Résumés de réunion IA", "Tâches depuis messages Slack", "Docs Notion synchronisés", "Rapports hebdo automatiques"] },
            ].map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 700, color: "#e8eaf6", marginBottom: 8 }}>{tab.title}</h3>
                    <p style={{ fontSize: 15, color: "rgba(232,234,246,0.6)", lineHeight: 1.75, marginBottom: 24 }}>{tab.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {tab.items.map(item => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(232,234,246,0.7)" }}>
                          <Check size={15} color="#818cf8" style={{ flexShrink: 0 }} />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 16, padding: "40px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={80} color="rgba(129,140,248,0.3)" />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#e8eaf6", letterSpacing: "-0.02em" }}>Ils ont fait le switch</h2>
            </div>
          </Reveal>
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 14 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#818cf8" color="#818cf8" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(232,234,246,0.7)", lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar><AvatarFallback style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 700 }}>{t.avatar}</AvatarFallback></Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf6" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(232,234,246,0.4)" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#e8eaf6", letterSpacing: "-0.02em" }}>Tarifs simples et <span style={{ color: "#818cf8" }}>transparents</span></h2>
              <p style={{ fontSize: 15, color: "rgba(232,234,246,0.45)", marginTop: 12 }}>Annuel : -20%. Pas de frais cachés. Annulation à tout moment.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(99,102,241,0.25)" : "0 8px 32px rgba(0,0,0,0.4)" }}
                  style={{ borderRadius: 16, border: plan.featured ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.06)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #6366f1, #818cf8)" }} />}
                  <div style={{ padding: "32px 24px", background: plan.featured ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 12 }}>RECOMMANDÉ</div>}
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "#e8eaf6", marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(232,234,246,0.4)", marginBottom: 20 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 24 }}>
                      {plan.price !== "Sur mesure" ? (
                        <><span style={{ fontSize: 42, fontWeight: 800, color: "#818cf8" }}>{plan.price}€</span><span style={{ fontSize: 14, color: "rgba(232,234,246,0.4)" }}>{plan.period}</span></>
                      ) : (
                        <span style={{ fontSize: 28, fontWeight: 700, color: "#818cf8" }}>{plan.price}</span>
                      )}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(232,234,246,0.65)" }}>
                          <Check size={13} color="#818cf8" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "13px", background: plan.featured ? "linear-gradient(135deg, #6366f1, #818cf8)" : "transparent", color: plan.featured ? "white" : "#818cf8", border: plan.featured ? "none" : "1px solid rgba(99,102,241,0.4)", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      {plan.price === "Sur mesure" ? "Nous contacter" : "Commencer"}
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#e8eaf6", letterSpacing: "-0.02em" }}>Questions fréquentes</h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(99,102,241,0.12)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 600, color: "#e8eaf6", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "rgba(232,234,246,0.55)", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)", borderTop: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: "#e8eaf6", marginBottom: 16, letterSpacing: "-0.02em" }}>
              Prêt à automatiser ?<br /><span style={{ color: "#818cf8" }}>Commencez en 2 minutes.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(232,234,246,0.55)", lineHeight: 1.7, marginBottom: 40 }}>14 jours gratuits. Aucune carte bancaire requise. Setup en moins de 5 minutes.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 36px", background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                Démarrer gratuitement
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 36px", background: "rgba(255,255,255,0.06)", color: "#e8eaf6", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 16, cursor: "pointer" }}>
                Voir une démo
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px 32px 36px", background: "#030408" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} color="white" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#e8eaf6" }}>FlowSync</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(232,234,246,0.35)", lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>Plateforme d'automatisation SaaS pour équipes ambitieuses. SOC 2 Type II · RGPD compliant.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[MessageSquare, Link2, GitBranch].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(232,234,246,0.4)" }}>
                    <Icon size={14} />
                  </motion.button>
                ))}
              </div>
            </div>
            {[
              { title: "Produit", links: ["Fonctionnalités", "Intégrations", "API", "Changelog", "Statut"] },
              { title: "Ressources", links: ["Documentation", "Blog", "Tutoriels", "Templates", "Communauté"] },
              { title: "Société", links: ["À propos", "Carrières", "Presse", "Sécurité", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#818cf8", marginBottom: 18 }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(232,234,246,0.35)", textDecoration: "none" }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
          <p style={{ fontSize: 12, color: "rgba(232,234,246,0.2)", textAlign: "center" }}>© 2024 FlowSync — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}
