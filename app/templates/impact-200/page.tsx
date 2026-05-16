"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
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
import { Heart, Star, Flower2, Camera, Music, Utensils, MapPin, Phone, Mail, Share2, Bookmark, Menu, Check, Clock, Calendar, Users } from "lucide-react"

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

const GALLERY = [
  { img: "photo-1519741497674-611481863552", label: "Villa Toscane — 180 invités" },
  { img: "photo-1511285560929-80b456fea0bc", label: "Château de Provence — 120 invités" },
  { img: "photo-1465495976277-4387d4b0b4c6", label: "Jardins de Paris — 240 invités" },
  { img: "photo-1606216794074-735e91aa2c92", label: "Domaine Viticole — 90 invités" },
  { img: "photo-1583939003579-730e3918a45a", label: "Plage Corse — Cérémonie intime" },
  { img: "photo-1469371670807-013ccf25f16a", label: "Manoir Normand — 160 invités" },
]

const SERVICES_LIST = [
  { icon: Calendar, name: "Organisation complète", desc: "De la demande en mairie au dernier slow — nous gérons tout, vous vivez pleinement", price: "À partir de 4 500 €" },
  { icon: Users, name: "Coordination Jour J", desc: "Notre équipe présente toute la journée pour que vous n'ayez qu'à profiter", price: "À partir de 1 800 €" },
  { icon: Flower2, name: "Décoration florale", desc: "Compositions florales sur mesure, de l'arche de cérémonie à la table d'honneur", price: "À partir de 2 200 €" },
  { icon: Camera, name: "Mise en scène", desc: "Direction artistique, moodboard, scénographie — votre mariage comme au cinéma", price: "À partir de 950 €" },
  { icon: Utensils, name: "Coordination traiteur", desc: "Sélection des prestataires, dégustation, menu sur mesure — gastronomie garantie", price: "Inclus formule complète" },
  { icon: Music, name: "Animation musicale", desc: "DJ, orchestre jazz, quartet à cordes — la bande-son parfaite pour chaque moment", price: "À partir de 1 200 €" },
]

const STATS = [
  { val: "340+", label: "Mariages organisés" },
  { val: "12 ans", label: "D'expertise" },
  { val: "98%", label: "Couples recommandent" },
  { val: "3", label: "Planneuses expertes" },
  { val: "50+", label: "Lieux partenaires" },
]

const TESTIMONIALS = [
  { name: "Lucie & Antoine Berger", role: "Mariés le 14 juin 2023", rating: 5, text: "Camille et son équipe ont transformé notre rêve en réalité. Chaque détail était parfait — les fleurs, la lumière, la musique. Nous avons pu profiter sans aucun stress.", avatar: "LA" },
  { name: "Sophie & Marc Delaunay", role: "Mariés le 2 septembre 2023", rating: 5, text: "Nous avons choisi la formule complète et c'était la meilleure décision. Cérémonie s'est occupée de tout, même des petits imprévus du jour J sans qu'on s'en aperçoive.", avatar: "SM" },
  { name: "Emma & Thomas Faure", role: "Mariés le 30 avril 2024", rating: 5, text: "Un mariage de 220 personnes organisé en 8 mois — un défi que Cérémonie a relevé avec grâce. La décoration florale était à couper le souffle.", avatar: "ET" },
  { name: "Julie & Nicolas Arnaud", role: "Mariés le 7 juillet 2023", rating: 5, text: "La coordination le Jour J était impeccable. Je n'ai pas eu à penser à une seule logistique. Cérémonie est une équipe de magiciennes.", avatar: "JN" },
  { name: "Clara & Hugo Mercier", role: "Mariés le 12 mai 2024", rating: 5, text: "Mariage en Provence avec 140 invités et un budget maîtrisé. Inès a négocié avec tous les prestataires pour nous obtenir les meilleures conditions. Merci infiniment.", avatar: "CH" },
]

const PRICING = [
  { name: "Essentielle", price: "1 800", desc: "Coordination Jour J", features: ["Planning heure par heure", "Réunion de brief 1 mois avant", "Coordination le jour J (12h)", "Liaison avec tous les prestataires", "Gestion des imprévus", "Debriefing post-mariage"] },
  { name: "Signature", price: "4 500", desc: "Organisation complète", featured: true, features: ["Tout Essentielle inclus", "De 12 mois avant jusqu'au Jour J", "Sélection de tous les prestataires", "Décoration & moodboard", "Accompagnement budget complet", "3 visites de lieu incluses", "Séance de dégustation traiteur"] },
  { name: "Prestige", price: "8 500", desc: "Mariage de luxe sur mesure", features: ["Tout Signature inclus", "Scénographie & mise en scène", "Décoration florale complète incluse", "Coordination internationale", "Photographe partenaire recommandé", "Vidéaste cinématographique", "Voyages repérages inclus"] },
]

const FAQS = [
  { q: "À quel moment faut-il contacter une wedding planner ?", a: "Idéalement 12 à 18 mois avant la date souhaitée pour un mariage en haute saison (mai à septembre). Pour la coordination Jour J uniquement, 3 à 6 mois suffisent. Contactez-nous dès que la décision est prise !" },
  { q: "Comment se passe la première rencontre ?", a: "La découverte est un appel ou une rencontre de 45 minutes, sans engagement et sans frais. Nous écoutons votre vision, votre budget et vos contraintes pour vous proposer la formule la plus adaptée." },
  { q: "Travaillez-vous avec nos propres prestataires ?", a: "Absolument. Si vous avez déjà votre photographe, votre traiteur ou votre fleuriste, nous les intégrons parfaitement. Nous avons aussi un carnet d'adresses premium si vous souhaitez des recommandations." },
  { q: "Organisez-vous des mariages à l'étranger ?", a: "Oui, nous avons organisé des mariages en Italie, Grèce, Portugal, Maroc et Île Maurice. Les frais de déplacement sont inclus dans nos formules Prestige ou facturés au coût réel pour les autres formules." },
  { q: "Comment gérez-vous les imprévus le Jour J ?", a: "Nous avons un protocole de gestion de crise rodé. Notre équipe est toujours en doublon sur le terrain et nous avons des solutions de secours pour les situations les plus courantes (météo, prestataire défaillant, etc.)." },
  { q: "Proposez-vous des paiements échelonnés ?", a: "Oui, nous proposons un échéancier en 3 versements : 30% à la signature, 40% à 6 mois du mariage, et le solde 30 jours avant. Des arrangements personnalisés sont possibles." },
  { q: "Organisez-vous aussi les PACS et cérémonies laïques ?", a: "Tout à fait. Nous accompagnons tous les couples, quelle que soit la forme de leur union. Cérémonies laïques, symboliques, religieuses — chaque amour mérite une célébration parfaite." },
]

export default function CeremoniePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#fdfaf7", color: "#2c1810", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(253,250,247,0.92)", borderBottom: "1px solid rgba(180,140,110,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Heart size={18} color="#b87c5a" fill="rgba(184,124,90,0.2)" />
            <span style={{ fontSize: 22, fontWeight: 400, color: "#2c1810", letterSpacing: "0.12em" }}>Cérémonie</span>
          </Link>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {["Services", "Galerie", "Témoignages", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ color: "#7a5c4a", textDecoration: "none", fontSize: 14, fontFamily: "system-ui, sans-serif", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#b87c5a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7a5c4a")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "10px 26px", background: "#b87c5a", color: "white", border: "none", borderRadius: 40, fontSize: 13, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em" }}>
              Nous contacter
            </motion.button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#2c1810", cursor: "pointer" }} className="md:hidden block">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#fdfaf7" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 48 }}>
                {["Services", "Galerie", "Témoignages", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)}
                    style={{ color: "#2c1810", textDecoration: "none", fontSize: 20, fontStyle: "italic" }}>{item}</a>
                ))}
                <button style={{ padding: "14px", background: "#b87c5a", color: "white", border: "none", borderRadius: 40, fontSize: 14, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer" }}>
                  Nous contacter
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 680, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80" alt="Mariage romantique" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(253,250,247,0.5) 0%, rgba(253,250,247,0.15) 40%, rgba(253,250,247,0.8) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 760, padding: "0 32px", opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 32, fontFamily: "system-ui", padding: "6px 18px" }}>
              WEDDING PLANNER — PARIS & DESTINATION
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(44px, 7vw, 90px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, color: "#2c1810" }}>
            Le plus beau jour<br />de votre vie,<br /><em style={{ color: "#b87c5a", fontStyle: "italic" }}>magnifié.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 18, color: "#7a5c4a", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 44, maxWidth: 540, margin: "0 auto 44px" }}>
            Organisation complète ou coordination Jour J — nous orchestrons chaque détail pour que vous n'ayez qu'à vous aimer.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(184,124,90,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 40px", background: "#b87c5a", color: "white", border: "none", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer" }}>
              Planifier mon mariage
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 40px", background: "rgba(255,255,255,0.7)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.35)", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", cursor: "pointer", backdropFilter: "blur(8px)" }}>
              Voir la galerie
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 48, bottom: 100, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(184,124,90,0.2)", borderRadius: 16, padding: "20px 28px", zIndex: 10 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: "#b87c5a" }}>340+</div>
          <div style={{ fontSize: 12, color: "#7a5c4a", fontFamily: "system-ui" }}>mariages orchestrés</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "48px 32px", background: "white", borderBottom: "1px solid rgba(184,124,90,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ fontSize: 36, fontWeight: 300, color: "#b87c5a" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "#7a5c4a", fontFamily: "system-ui", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" style={{ padding: "100px 32px", background: "#fdfaf7" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>GALERIE</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.01em", color: "#2c1810" }}>
                Quelques <em style={{ color: "#b87c5a", fontStyle: "italic" }}>histoires d'amour</em> orchestrées
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {GALLERY.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.02 }} style={{ position: "relative", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
                  <Image src={`https://images.unsplash.com/${item.img}?w=600&q=80`} alt={item.label} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.7) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "system-ui" }}>{item.label}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES TABS */}
      <section id="services" style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>NOS SERVICES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#2c1810" }}>
                De la vision <em style={{ color: "#b87c5a" }}>à la réalité</em>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {SERVICES_LIST.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(184,124,90,0.12)" }}
                  style={{ background: "#fdfaf7", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(184,124,90,0.1)", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,124,90,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <s.icon size={20} color="#b87c5a" />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 400, marginBottom: 10, color: "#2c1810" }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: "#7a5c4a", fontFamily: "system-ui", lineHeight: 1.65, marginBottom: 16 }}>{s.desc}</p>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#b87c5a", fontFamily: "system-ui" }}>{s.price}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="témoignages" style={{ padding: "100px 32px", background: "#fdfaf7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>TÉMOIGNAGES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#2c1810" }}>Ils nous ont confié leur grand jour</h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "white", border: "1px solid rgba(184,124,90,0.1)", borderRadius: 16 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#b87c5a" color="#b87c5a" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "#7a5c4a", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar>
                          <AvatarFallback style={{ background: "rgba(184,124,90,0.12)", color: "#b87c5a", fontSize: 12, fontWeight: 700 }}>{t.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#2c1810" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#7a5c4a", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "white", border: "1px solid rgba(184,124,90,0.3)", color: "#b87c5a" }} />
            <CarouselNext style={{ background: "white", border: "1px solid rgba(184,124,90,0.3)", color: "#b87c5a" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>FORMULES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#2c1810" }}>Une formule pour chaque vision</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(184,124,90,0.2)" : "0 8px 32px rgba(0,0,0,0.06)" }}
                  style={{ borderRadius: 20, border: plan.featured ? "1.5px solid #b87c5a" : "1px solid rgba(184,124,90,0.12)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #b87c5a, #daa882)" }} />}
                  <div style={{ padding: "32px 24px", background: plan.featured ? "rgba(184,124,90,0.03)" : "white" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(184,124,90,0.12)", color: "#b87c5a", fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "3px 12px", borderRadius: 20, marginBottom: 12, fontFamily: "system-ui" }}>RECOMMANDÉE</div>}
                    <h3 style={{ fontSize: 22, fontWeight: 400, color: "#2c1810", marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "#7a5c4a", fontFamily: "system-ui", marginBottom: 20 }}>{plan.desc}</p>
                    <div style={{ fontSize: 38, fontWeight: 300, color: "#b87c5a", marginBottom: 28 }}>{plan.price} €</div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#7a5c4a", fontFamily: "system-ui" }}>
                          <Check size={14} color="#b87c5a" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "13px", background: plan.featured ? "#b87c5a" : "transparent", color: plan.featured ? "white" : "#b87c5a", border: plan.featured ? "none" : "1.5px solid rgba(184,124,90,0.4)", borderRadius: 40, fontSize: 13, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer" }}>
                      Demander un devis
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="contact" style={{ padding: "100px 32px", background: "#fdfaf7" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Badge style={{ background: "rgba(184,124,90,0.1)", color: "#b87c5a", border: "1px solid rgba(184,124,90,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, color: "#2c1810" }}>Vos questions</h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(184,124,90,0.12)", borderRadius: 12, overflow: "hidden", background: "white" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 400, color: "#2c1810", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "#7a5c4a", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, #b87c5a 0%, #daa882 100%)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Heart size={40} color="white" fill="rgba(255,255,255,0.3)" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 300, color: "white", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Votre histoire mérite<br />d'être célébrée parfaitement
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 40 }}>
              Premier échange gratuit. Réponse sous 48h. Disponible 7j/7 pour nos futurs mariés.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 40px", background: "white", color: "#b87c5a", border: "none", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                Nous écrire
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 40px", background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", cursor: "pointer" }}>
                +33 6 12 34 56 78
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px 32px 36px", background: "#1a0f0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Heart size={16} color="#daa882" />
                <span style={{ fontSize: 20, fontWeight: 300, color: "#daa882", letterSpacing: "0.12em" }}>Cérémonie</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>
                Wedding Planner Paris & Destination. Membre AFWP. 8 rue du Faubourg Saint-Antoine, 75011 Paris.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Share2, Bookmark].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
                    <Icon size={15} />
                  </motion.button>
                ))}
              </div>
            </div>
            {[
              { title: "Services", links: ["Organisation complète", "Coordination Jour J", "Décoration florale", "Mise en scène", "MICE & mariages pro"] },
              { title: "Mariage", links: ["Notre approche", "Galerie", "Témoignages", "Tarifs", "Blog inspiration"] },
              { title: "Agence", links: ["À propos", "L'équipe", "Partenaires", "Presse", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#daa882", marginBottom: 18, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Cérémonie — Wedding Planner Paris</p>
        </div>
      </footer>
    </div>
  )
}
