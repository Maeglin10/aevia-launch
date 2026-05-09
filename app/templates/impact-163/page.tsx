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
import { BookOpen, ArrowRight, Search, Menu, MessageSquare, Camera, Link2, Rss, Star, Check, TrendingUp, Users, Clock } from "lucide-react"

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

const FEATURED_ARTICLE = {
  cat: "STRATÉGIE",
  title: "Pourquoi 94% des startups B2B ratent leur go-to-market (et comment faire partie des 6%)",
  excerpt: "Analyse de 340 startups européennes sur 5 ans : les patterns qui séparent les gagnants des losers, les erreurs fatales commises avant même le premier client.",
  author: "Marc Delacroix",
  readTime: "12 min",
  date: "8 mai 2026",
  img: "photo-1460925895917-afdab827c52f",
}

const ARTICLES = [
  { cat: "PRODUCT", title: "Le product-led growth est mort. Vive le product-led sales.", author: "Sophie Chen", readTime: "8 min", img: "photo-1551288049-bebda4e38f71" },
  { cat: "MARKETING", title: "SEO en 2026 : les 5 signaux qui comptent vraiment (les autres sont du bruit)", author: "Thomas Müller", readTime: "11 min", img: "photo-1432888622747-4eb9a8efeb07" },
  { cat: "FINANCEMENT", title: "Lever 2M€ en pre-seed sans VC : le playbook complet d'une fondatrice", author: "Camille Aubert", readTime: "15 min", img: "photo-1507679799987-c73779587ccf" },
  { cat: "IA & TECH", title: "RAG vs Fine-tuning : guide décisionnel pour les équipes produit non-téchniques", author: "Kevin Park", readTime: "9 min", img: "photo-1677442135703-1787eea5ce01" },
  { cat: "CULTURE", title: "Remote-first à 80 personnes : les rituels qui ont sauvé notre culture d'équipe", author: "Julie Fontaine", readTime: "7 min", img: "photo-1522071820081-009f0129c71c" },
  { cat: "VENTES", title: "Cold outreach en 2026 : les séquences qui génèrent 40% de reply rate", author: "Antoine Lebrun", readTime: "10 min", img: "photo-1563013544-824ae1b704d3" },
]

const CATEGORIES = ["Stratégie", "Product", "Marketing", "IA & Tech", "Financement", "Culture", "Ventes"]

const STATS = [
  { val: "48 000+", label: "Lecteurs actifs" },
  { val: "2x/sem.", label: "Newsletters" },
  { val: "340+", label: "Articles publiés" },
  { val: "4.8/5", label: "Note lecteurs" },
]

const TESTIMONIALS = [
  { name: "Claire Dupont", role: "CMO, Spendr", rating: 5, text: "Essentiel — la seule newsletter que j'ouvre toujours en premier. Chaque article change ma façon de travailler. L'article sur le PLG m'a fait repenser toute notre stratégie product.", avatar: "CD" },
  { name: "Alexandre Martin", role: "Fondateur, NordX", rating: 5, text: "Le niveau d'analyse est incomparable avec ce qu'on trouve ailleurs. Pas de bullshit, pas de checklists vides — juste des insights actionnables avec des vraies données.", avatar: "AM" },
  { name: "Sophie Renard", role: "Partner, Accel Paris", rating: 5, text: "Je partage les articles à tous mes portfolios. La qualité éditoriale est proche de Harvard Business Review mais avec une praticité que HBR n'a pas.", avatar: "SR" },
  { name: "Thomas Girard", role: "CEO, Growthly", rating: 5, text: "J'ai recruté 3 membres de mon équipe grâce aux offres partagées dans la newsletter. La communauté est exactement le réseau dont j'avais besoin.", avatar: "TG" },
  { name: "Marie Chen", role: "Head of Growth, Aevia", rating: 5, text: "La série 'Go-to-market réel' est la meilleure ressource que j'ai trouvée sur le sujet. Des cas pratiques avec des vraies chiffres — du jamais vu.", avatar: "MC" },
]

const PLANS = [
  { name: "Gratuit", price: "0", desc: "L'essentiel pour démarrer", features: ["2 articles/semaine en accès libre", "Newsletter hebdo résumé", "Archive 30 jours", "Accès app mobile"] },
  { name: "Pro", price: "12", desc: "Pour les pros qui veulent tout", featured: true, features: ["Articles illimités sans limite", "Newsletter premium 2x/sem.", "Archive complète 340+ articles", "Synthèses audio des meilleurs articles", "Accès communauté Slack (2 400 membres)", "Replays des événements live", "Téléchargement PDF & epub"] },
  { name: "Équipe", price: "39", desc: "Pour toute votre équipe", features: ["Tout Pro inclus", "Jusqu'à 10 sièges inclus", "Tableau de bord lecture équipe", "Articles partagés & annotations", "Formation onboarding dédiée", "Facturation entreprise"] },
]

const FAQS = [
  { q: "À quelle fréquence publiez-vous ?", a: "Deux articles longs formats par semaine (mardi et jeudi), plus une synthèse de curation le vendredi. Les abonnés Pro reçoivent en plus une newsletter premium le dimanche avec des analyses exclusives." },
  { q: "Qui écrit les articles ?", a: "Notre équipe de 8 rédacteurs spécialisés, tous anciens opérationnels (ex-fondateurs, VP Product, CMO). Chaque article est édité par notre rédacteur en chef et fact-checké par un expert externe." },
  { q: "Puis-je accéder aux anciens articles ?", a: "Les abonnés gratuits ont accès aux 30 derniers jours. Les abonnés Pro ont accès à l'intégralité de l'archive depuis 2018 — soit 340+ articles, classés par thème et niveau de séniorité." },
  { q: "Y a-t-il une version audio ?", a: "Oui, les abonnés Pro bénéficient de synthèses audio de 10-15 minutes pour chaque article long format, disponibles dès la publication. Parfait pour écouter en transports ou en sport." },
  { q: "Comment fonctionne la communauté Slack ?", a: "Les abonnés Pro rejoignent un Slack privé de 2 400 professionnels. Des fils thématiques (product, growth, financement...), des AMA réguliers avec des experts invités, et des offres emploi exclusives." },
  { q: "Puis-je annuler à tout moment ?", a: "Oui, annulation possible à tout moment depuis votre espace abonné. Aucun engagement, aucun frais de résiliation. Vous conservez l'accès jusqu'à la fin de votre période payée." },
]

export default function EssentialBlogPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const titleX = useTransform(scrollY, [0, 400], ["0%", "-8%"])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#f8f7f4", color: "#0d0d0d", fontFamily: "'Times New Roman', Georgia, serif" }}>

      {/* NAVBAR — horizontal editorial bar */}
      <motion.nav initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#0d0d0d", borderBottom: "none" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: "#f8f7f4", textDecoration: "none", letterSpacing: "-0.01em", fontFamily: "system-ui" }}>
              L'Essentiel
            </Link>
            <div style={{ display: "flex", gap: 20 }} className="hidden md:flex">
              {CATEGORIES.slice(0, 5).map(cat => (
                <a key={cat} href="#" style={{ color: "rgba(248,247,244,0.5)", textDecoration: "none", fontSize: 12, fontFamily: "system-ui", fontWeight: 500, letterSpacing: "0.06em", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f8f7f4")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,247,244,0.5)")}>
                  {cat.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", color: "rgba(248,247,244,0.6)", cursor: "pointer" }}>
              <Search size={18} />
            </button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "7px 18px", background: "#e8d44d", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 12, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
              S'ABONNER
            </motion.button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button style={{ background: "none", border: "none", color: "#f8f7f4", cursor: "pointer" }} className="md:hidden block"><Menu size={22} /></button>
              </SheetTrigger>
              <SheetContent side="left" style={{ background: "#0d0d0d", width: 300 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 48 }}>
                  {CATEGORIES.map(cat => (
                    <a key={cat} href="#" onClick={() => setMobileOpen(false)} style={{ color: "#f8f7f4", textDecoration: "none", fontSize: 16, fontFamily: "system-ui", fontWeight: 600 }}>{cat}</a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      {/* HERO — oversized scrolling title */}
      <section style={{ paddingTop: 56, background: "#0d0d0d", overflow: "hidden", position: "relative" }}>
        <div style={{ padding: "60px 0 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Oversized scrolling headline */}
          <motion.div style={{ x: titleX }} className="whitespace-nowrap">
            <div style={{ fontSize: "clamp(80px, 14vw, 180px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", color: "#f8f7f4", padding: "0 40px 32px", fontFamily: "system-ui", display: "inline-block", whiteSpace: "nowrap" }}>
              STRATÉGIE · PRODUCT · GROWTH · MARKETING · IA · CULTURE ·
            </div>
          </motion.div>

          {/* Featured article */}
          <div style={{ padding: "40px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "end", maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ paddingBottom: 48 }}>
              <Badge style={{ background: "rgba(232,212,77,0.15)", color: "#e8d44d", border: "1px solid rgba(232,212,77,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 20, fontFamily: "system-ui" }}>{FEATURED_ARTICLE.cat}</Badge>
              <h1 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20, color: "#f8f7f4" }}>
                {FEATURED_ARTICLE.title}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(248,247,244,0.65)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 28 }}>{FEATURED_ARTICLE.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "rgba(248,247,244,0.5)", fontFamily: "system-ui" }}>Par {FEATURED_ARTICLE.author}</span>
                <span style={{ fontSize: 13, color: "rgba(248,247,244,0.5)", fontFamily: "system-ui" }}>{FEATURED_ARTICLE.readTime} de lecture</span>
                <span style={{ fontSize: 13, color: "rgba(248,247,244,0.5)", fontFamily: "system-ui" }}>{FEATURED_ARTICLE.date}</span>
              </div>
              <motion.button whileHover={{ gap: 12 }} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 32, padding: "13px 24px", background: "#e8d44d", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
                LIRE L'ARTICLE <ArrowRight size={16} />
              </motion.button>
            </div>
            <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
              <Image src={`https://images.unsplash.com/${FEATURED_ARTICLE.img}?w=700&q=80`} alt="Featured" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,13,0.1)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — white background */}
      <section style={{ padding: "32px 40px", background: "#f8f7f4", borderBottom: "2px solid #0d0d0d" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center", alignItems: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#0d0d0d", fontFamily: "system-ui", letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#6b6b6b", fontFamily: "system-ui", fontWeight: 500, letterSpacing: "0.08em", marginTop: 4 }}>{s.label.toUpperCase()}</div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "12px 28px", background: "#0d0d0d", color: "#f8f7f4", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
              REJOINDRE 48 000 LECTEURS
            </motion.button>
          </Reveal>
        </div>
      </section>

      {/* ARTICLES GRID — editorial newspaper layout */}
      <section style={{ padding: "64px 40px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40, borderBottom: "3px solid #0d0d0d", paddingBottom: 12 }}>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", fontFamily: "system-ui" }}>Articles récents</h2>
              <a href="#" style={{ fontSize: 13, fontFamily: "system-ui", fontWeight: 600, color: "#0d0d0d", textDecoration: "none", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                TOUT VOIR <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderLeft: "1px solid rgba(13,13,13,0.1)" }}>
            {ARTICLES.map((article, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div whileHover={{ background: "rgba(13,13,13,0.03)" }}
                  style={{ padding: "28px 28px 32px", borderRight: "1px solid rgba(13,13,13,0.1)", borderBottom: "1px solid rgba(13,13,13,0.1)", cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", marginBottom: 20, borderRadius: 4 }}>
                    <Image src={`https://images.unsplash.com/${article.img}?w=500&q=80`} alt={article.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <Badge style={{ background: "rgba(13,13,13,0.08)", color: "#0d0d0d", border: "none", fontSize: 10, letterSpacing: "0.1em", marginBottom: 12, fontFamily: "system-ui", fontWeight: 700 }}>{article.cat}</Badge>
                  <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 12, color: "#0d0d0d" }}>{article.title}</h3>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b6b6b", fontFamily: "system-ui" }}>
                    <span>{article.author}</span>
                    <span><Clock size={11} style={{ display: "inline", marginRight: 3 }} />{article.readTime}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA — bold black split */}
      <section style={{ background: "#0d0d0d", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <div>
              <div style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", color: "#f8f7f4", fontFamily: "system-ui", marginBottom: 24 }}>
                48 000<br /><span style={{ color: "#e8d44d" }}>lecteurs</span><br />ne peuvent<br />pas avoir tort.
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div>
              <p style={{ fontSize: 17, color: "rgba(248,247,244,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 32 }}>
                Les meilleurs articles sur la stratégie, le product et la croissance — deux fois par semaine dans votre boîte mail.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <input type="email" placeholder="votre@email.com" style={{ padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, fontSize: 15, color: "#f8f7f4", fontFamily: "system-ui", outline: "none" }} />
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(232,212,77,0.3)" }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "14px", background: "#e8d44d", color: "#0d0d0d", border: "none", borderRadius: 6, fontSize: 14, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
                  S'ABONNER GRATUITEMENT
                </motion.button>
              </div>
              <p style={{ fontSize: 12, color: "rgba(248,247,244,0.35)", fontFamily: "system-ui" }}>Aucun spam. Désabonnement en 1 clic. RGPD compliant.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 40px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", fontFamily: "system-ui", marginBottom: 48, borderBottom: "3px solid #0d0d0d", paddingBottom: 12 }}>
              Ce qu'en disent nos lecteurs
            </h2>
          </Reveal>
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 0, flexBasis: "calc(50% - 8px)", paddingRight: 16 }}>
                  <div style={{ border: "1px solid rgba(13,13,13,0.1)", padding: "28px", background: "white" }}>
                    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                      {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#e8d44d" color="#e8d44d" />)}
                    </div>
                    <p style={{ fontSize: 16, color: "#2d2d2d", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar><AvatarFallback style={{ background: "#0d0d0d", color: "#e8d44d", fontSize: 12, fontWeight: 800, fontFamily: "system-ui" }}>{t.avatar}</AvatarFallback></Avatar>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0d0d0d", fontFamily: "system-ui" }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "#6b6b6b", fontFamily: "system-ui" }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "#0d0d0d", border: "none", color: "#f8f7f4" }} />
            <CarouselNext style={{ background: "#0d0d0d", border: "none", color: "#f8f7f4" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "80px 40px", background: "white", borderTop: "2px solid #0d0d0d" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "system-ui", marginBottom: 12 }}>Accès illimité.</h2>
            <p style={{ fontSize: 17, color: "#6b6b6b", fontFamily: "system-ui", marginBottom: 48 }}>Toute la valeur, le prix d'un café par semaine.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "2px solid #0d0d0d" }}>
            {PLANS.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: "32px 28px", borderRight: i < 2 ? "2px solid #0d0d0d" : "none", background: plan.featured ? "#0d0d0d" : "transparent", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: -1, left: -1, right: -1, height: 4, background: "#e8d44d" }} />}
                  <h3 style={{ fontSize: 22, fontWeight: 900, fontFamily: "system-ui", color: plan.featured ? "#f8f7f4" : "#0d0d0d", marginBottom: 6 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: plan.featured ? "rgba(248,247,244,0.5)" : "#6b6b6b", fontFamily: "system-ui", marginBottom: 20 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, fontFamily: "system-ui", color: plan.featured ? "#e8d44d" : "#0d0d0d" }}>{plan.price}€</span>
                    {plan.price !== "0" && <span style={{ fontSize: 14, color: plan.featured ? "rgba(248,247,244,0.5)" : "#6b6b6b", fontFamily: "system-ui" }}>/mois</span>}
                    {plan.price === "0" && <span style={{ fontSize: 14, color: plan.featured ? "rgba(248,247,244,0.5)" : "#6b6b6b", fontFamily: "system-ui" }}> — pour toujours</span>}
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: plan.featured ? "rgba(248,247,244,0.75)" : "#2d2d2d", fontFamily: "system-ui" }}>
                        <Check size={13} color={plan.featured ? "#e8d44d" : "#0d0d0d"} style={{ marginTop: 2, flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", padding: "13px", background: plan.featured ? "#e8d44d" : "#0d0d0d", color: plan.featured ? "#0d0d0d" : "#f8f7f4", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
                    {plan.price === "0" ? "COMMENCER GRATUITEMENT" : "S'ABONNER"}
                  </motion.button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 40px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, fontFamily: "system-ui", letterSpacing: "-0.02em", marginBottom: 40, borderBottom: "2px solid #0d0d0d", paddingBottom: 12 }}>Questions</h2>
          </Reveal>
          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ borderBottom: "1px solid rgba(13,13,13,0.15)", background: "transparent" }}>
                <AccordionTrigger style={{ padding: "20px 0", fontSize: 16, fontWeight: 700, color: "#0d0d0d", fontFamily: "system-ui", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 0 20px", fontSize: 14, color: "#4a4a4a", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d0d0d", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#f8f7f4", fontFamily: "system-ui", marginBottom: 12 }}>L'Essentiel</div>
              <p style={{ fontSize: 13, color: "rgba(248,247,244,0.4)", fontFamily: "system-ui", lineHeight: 1.7, maxWidth: 280 }}>Le media indépendant des professionnels du digital — stratégie, product, growth, culture.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[MessageSquare, Camera, Link2, Rss].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15, color: "#e8d44d" }} style={{ width: 32, height: 32, borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(248,247,244,0.45)" }}>
                    <Icon size={14} />
                  </motion.button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
              {[
                { title: "Catégories", links: ["Stratégie", "Product", "Marketing", "IA & Tech", "Financement", "Culture"] },
                { title: "L'Essentiel", links: ["À propos", "Notre équipe", "Partenariats", "Publicité", "Contact"] },
                { title: "Abonnés", links: ["Se connecter", "Mon compte", "Newsletter", "Communauté Slack", "FAQ"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: "#e8d44d", letterSpacing: "0.1em", fontFamily: "system-ui", marginBottom: 16 }}>{col.title.toUpperCase()}</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(248,247,244,0.4)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "rgba(248,247,244,0.2)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 L'Essentiel — Media indépendant · ISSN 2698-XXXX</p>
        </div>
      </footer>
    </div>
  )
}
