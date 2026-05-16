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
import { Sparkles, Star, Heart, Clock, MapPin, Phone, Mail, Camera, Users2, Menu, Check, ArrowRight, Leaf, Flower2, Smile } from "lucide-react"

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

const SERVICES = [
  { icon: Sparkles, name: "Soin du visage", desc: "Hydratation profonde, anti-âge, éclat — adaptés à votre peau", duration: "60 min", price: "89 €" },
  { icon: Heart, name: "Épilation à la cire", desc: "Cires douces biologiques, résultats durables 4 semaines", duration: "30–60 min", price: "25–65 €" },
  { icon: Flower2, name: "Manucure & Pédicure", desc: "Semi-permanent, gel, nail art — pose et entretien", duration: "45–90 min", price: "35–75 €" },
  { icon: Leaf, name: "Massage relaxant", desc: "Californien, suédois, aux pierres chaudes — détente totale", duration: "60–90 min", price: "75–110 €" },
  { icon: Smile, name: "Maquillage", desc: "Jour, soirée, mariée — maquillage longue tenue professionnel", duration: "60–90 min", price: "55–120 €" },
  { icon: Sparkles, name: "Extension de cils", desc: "Volume russe, effet naturel, hybride — tenue 3-4 semaines", duration: "90–150 min", price: "95–165 €" },
]

const STATS = [
  { val: "1 800+", label: "Clientes fidèles" },
  { val: "9 ans", label: "D'expertise beauté" },
  { val: "4.9/5", label: "Note Google" },
  { val: "98%", label: "Satisfaction clients" },
  { val: "100%", label: "Produits bio certifiés" },
]

const TESTIMONIALS = [
  { name: "Amélie Chartier", role: "Cliente depuis 3 ans", rating: 5, text: "Le soin signature Lumière est tout simplement incroyable. Ma peau n'a jamais été aussi lumineuse. Léa est une magicienne !", avatar: "AC" },
  { name: "Sophie Marchand", role: "Mariée de l'été 2023", rating: 5, text: "J'ai choisi Lumière Beauty pour mon maquillage de mariage — un coup de génie. Charlotte a sublimé mon regard exactement comme je le voulais.", avatar: "SM" },
  { name: "Clara Vidal", role: "Cliente régulière", rating: 5, text: "Enfin un institut qui utilise uniquement des produits naturels ! Mes ongles sont magnifiques et les soins ne sont jamais agressifs.", avatar: "CV" },
  { name: "Lucie Perrin", role: "Cliente VIP", rating: 5, text: "L'ambiance est tellement apaisante. On se sent entre de bonnes mains dès l'accueil. Je viens toutes les 3 semaines pour mes extensions.", avatar: "LP" },
  { name: "Marie-Claire Aubert", role: "Cliente depuis 5 ans", rating: 5, text: "Je recommande Lumière à toutes mes amies. Les masseuses sont expertes et l'on repart vraiment ressourcée. Un vrai havre de paix en ville.", avatar: "MA" },
]

const PRICING = [
  { name: "Découverte", price: "89", desc: "Idéal pour votre première visite", features: ["1 soin du visage hydratant", "Consultation beauté offerte", "Produits d'entretien conseillés", "Accès vestiaire & espace détente", "Thé & infusions bio offerts"] },
  { name: "Sérénité", price: "199", desc: "Notre formule la plus populaire", featured: true, features: ["Soin visage anti-âge premium", "Massage relaxant 60 min", "Manucure semi-permanent", "Gommage corps aux sels de mer", "Accueil champagne", "Produit offert (valeur 35€)"] },
  { name: "Prestige", price: "349", desc: "Une journée entièrement dédiée à vous", features: ["Tout Sérénité inclus", "Massage aux pierres chaudes", "Extension de cils", "Maquillage personnalisé", "Déjeuner végétalien inclus", "Kit beauté maison offert (valeur 80€)"] },
]

const FAQS = [
  { q: "Faut-il réserver à l'avance ?", a: "Oui, la réservation est recommandée, surtout le week-end. Vous pouvez réserver en ligne 24h/24 ou par téléphone. Des créneaux de dernière minute sont parfois disponibles." },
  { q: "Quels produits utilisez-vous ?", a: "Nous travaillons exclusivement avec des produits certifiés biologiques et cruelty-free : Thalgo, Phytomer, et notre propre gamme Lumière Naturals. Aucun parabène ni sulfate." },
  { q: "Proposez-vous des forfaits cadeau ?", a: "Absolument. Nos cartes cadeaux sont disponibles pour tous les montants et toutes les prestations. Elles sont valables 12 mois et se commandent en boutique ou en ligne." },
  { q: "Y a-t-il un âge minimum pour les soins ?", a: "Les soins sont accessibles dès 16 ans. Pour les mineures, l'accord parental est requis. Nous proposons des soins adaptés pour les ados (peaux mixtes, grasses)." },
  { q: "Comment préparer ma peau avant un soin ?", a: "Venez sans maquillage si possible. Pour les soins corps, évitez l'épilation la veille. Pour les massages, n'hésitez pas à boire suffisamment d'eau avant et après." },
  { q: "Pratiquez-vous des soins pendant la grossesse ?", a: "Oui, nous proposons des soins spécialement adaptés aux femmes enceintes (massages prénatal, soins doux sans huiles essentielles contre-indiquées) dès le 2ème trimestre." },
  { q: "Quelle est votre politique d'annulation ?", a: "Annulation gratuite jusqu'à 24h avant votre rendez-vous. En deçà, des frais de 50% de la prestation peuvent s'appliquer. En cas de no-show, la prestation est facturée intégralement." },
]

export default function LumierBeautyPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#faf8f5", color: "#2d1f17", fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(250,248,245,0.9)", borderBottom: "1px solid rgba(180,130,90,0.15)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #c4855a, #e8a97e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontSize: 19, fontWeight: 700, color: "#8b4513", letterSpacing: "0.04em" }}>Lumière Beauty</span>
          </Link>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {["Services", "À propos", "Avis", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace("à ", "")}`}
                style={{ color: "#6b4c3b", textDecoration: "none", fontSize: 14, fontFamily: "system-ui, sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c4855a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#6b4c3b")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #c4855a, #e8a97e)", color: "white", border: "none", borderRadius: 40, fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 600, cursor: "pointer" }}>
              Réserver
            </motion.button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#2d1f17", cursor: "pointer" }} className="md:hidden block">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#faf8f5" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Services", "À propos", "Avis", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)}
                    style={{ color: "#2d1f17", textDecoration: "none", fontSize: 18 }}>{item}</a>
                ))}
                <button style={{ padding: "14px 24px", background: "linear-gradient(135deg, #c4855a, #e8a97e)", color: "white", border: "none", borderRadius: 40, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Réserver
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 680, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1600&q=80" alt="Institut de beauté" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(250,248,245,0.92) 45%, rgba(250,248,245,0.4) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, padding: "0 10vw", maxWidth: 680, opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(196,133,90,0.12)", color: "#c4855a", border: "1px solid rgba(196,133,90,0.3)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>
              INSTITUT DE BEAUTÉ — PRODUITS BIO CERTIFIÉS
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: "#2d1f17" }}>
            Révélez votre <em style={{ color: "#c4855a", fontStyle: "italic" }}>éclat naturel</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 17, color: "#6b4c3b", lineHeight: 1.75, marginBottom: 40, fontFamily: "system-ui, sans-serif", maxWidth: 480 }}>
            Soins du visage, massages, manucure et maquillage — des rituels beauté haut de gamme dans un cocon de douceur, avec des produits 100% naturels.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(196,133,90,0.35)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "linear-gradient(135deg, #c4855a, #e8a97e)", color: "white", border: "none", borderRadius: 40, fontSize: 15, fontFamily: "system-ui, sans-serif", fontWeight: 600, cursor: "pointer" }}>
              Prendre rendez-vous
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "transparent", color: "#8b4513", border: "2px solid rgba(196,133,90,0.4)", borderRadius: 40, fontSize: 15, fontFamily: "system-ui, sans-serif", cursor: "pointer" }}>
              Nos soins
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 60, bottom: 100, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(196,133,90,0.2)", borderRadius: 16, padding: "20px 28px", zIndex: 10 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#c4855a" color="#c4855a" />)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#2d1f17", fontFamily: "system-ui" }}>4.9 / 5</div>
          <div style={{ fontSize: 12, color: "#6b4c3b", fontFamily: "system-ui" }}>+340 avis Google</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "48px 32px", background: "white", borderBottom: "1px solid rgba(196,133,90,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 130 }}>
                <div style={{ fontSize: 34, fontWeight: 700, color: "#c4855a" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "#8b7355", fontFamily: "system-ui", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 32px", background: "#faf8f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(196,133,90,0.1)", color: "#c4855a", border: "1px solid rgba(196,133,90,0.25)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui" }}>NOS SOINS</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#2d1f17", marginBottom: 16 }}>Des soins <em style={{ color: "#c4855a" }}>pensés pour vous</em></h2>
              <p style={{ fontSize: 16, color: "#6b4c3b", fontFamily: "system-ui", maxWidth: 480, margin: "0 auto" }}>Chaque prestation est personnalisée selon votre peau, vos envies et votre rythme de vie.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(196,133,90,0.15)" }}
                  style={{ background: "white", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(196,133,90,0.12)", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(196,133,90,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <s.icon size={20} color="#c4855a" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#2d1f17" }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: "#8b7355", fontFamily: "system-ui", lineHeight: 1.65, marginBottom: 20 }}>{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(196,133,90,0.1)" }}>
                    <span style={{ fontSize: 13, color: "#8b7355", fontFamily: "system-ui" }}><Clock size={12} style={{ display: "inline", marginRight: 4 }} />{s.duration}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#c4855a" }}>{s.price}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES TABS */}
      <section id="propos" style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#2d1f17", letterSpacing: "-0.02em" }}>
                L'excellence <em style={{ color: "#c4855a" }}>Lumière</em>
              </h2>
            </div>
          </Reveal>

          <Tabs defaultValue="approche" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(196,133,90,0.06)", marginBottom: 40, display: "flex", height: "auto", gap: 4, padding: 4, borderRadius: 40, border: "1px solid rgba(196,133,90,0.15)" }}>
              <TabsTrigger value="approche" style={{ flex: 1, borderRadius: 36, fontSize: 13, fontFamily: "system-ui", color: "#8b7355" }}>Notre approche</TabsTrigger>
              <TabsTrigger value="produits" style={{ flex: 1, borderRadius: 36, fontSize: 13, fontFamily: "system-ui", color: "#8b7355" }}>Nos produits</TabsTrigger>
              <TabsTrigger value="equipe" style={{ flex: 1, borderRadius: 36, fontSize: 13, fontFamily: "system-ui", color: "#8b7355" }}>L'équipe</TabsTrigger>
            </TabsList>

            <TabsContent value="approche">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 20, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80" alt="Soin visage" fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 700, color: "#2d1f17", marginBottom: 16 }}>Un regard holistique sur votre beauté</h3>
                  <p style={{ fontSize: 15, color: "#8b7355", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 24 }}>Chez Lumière, nous croyons que la beauté extérieure rayonne depuis le bien-être intérieur. Chaque soin est un moment de reconnexion avec vous-même.</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Diagnostic personnalisé avant chaque soin", "Protocoles adaptés à chaque type de peau", "Ambiance zen et musique apaisante", "Confidentialité et respect absolu"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#6b4c3b", fontFamily: "system-ui" }}>
                        <Check size={15} color="#c4855a" style={{ flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="produits">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 700, color: "#2d1f17", marginBottom: 16 }}>100% naturel, 100% éthique</h3>
                  <p style={{ fontSize: 15, color: "#8b7355", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 24 }}>Nous sélectionnons chaque produit avec soin : certifications COSMOS Organic, sans parabènes, sans silicones, cruelty-free et fabriqués en France.</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Gamme Thalgo Marine certifiée bio", "Phytomer — soins marins bretons", "Lumière Naturals — notre propre gamme", "Produits disponibles à l'achat en boutique"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#6b4c3b", fontFamily: "system-ui" }}>
                        <Leaf size={15} color="#c4855a" style={{ flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 20, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Produits bio" fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="equipe">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 20, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" alt="Équipe" fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 700, color: "#2d1f17", marginBottom: 16 }}>Des expertes passionnées</h3>
                  <p style={{ fontSize: 15, color: "#8b7355", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 24 }}>Notre équipe de 6 esthéticiennes est certifiée CAP Esthétique, formée aux dernières techniques et passionnée par leur métier.</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Léa Moreau — fondatrice, 12 ans d'expérience", "Charlotte Viel — spécialiste maquillage & cils", "Emma Faure — experte massages & bien-être", "Formation continue chaque année"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#6b4c3b", fontFamily: "system-ui" }}>
                        <Sparkles size={14} color="#c4855a" style={{ flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="avis" style={{ padding: "100px 32px", background: "#faf8f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(196,133,90,0.1)", color: "#c4855a", border: "1px solid rgba(196,133,90,0.25)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui" }}>TÉMOIGNAGES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#2d1f17" }}>Ce que disent <em style={{ color: "#c4855a" }}>nos clientes</em></h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "white", border: "1px solid rgba(196,133,90,0.12)", borderRadius: 16, height: "100%" }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#c4855a" color="#c4855a" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "#6b4c3b", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar>
                          <AvatarFallback style={{ background: "rgba(196,133,90,0.15)", color: "#c4855a", fontSize: 13, fontWeight: 700 }}>{t.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d1f17" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#8b7355", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "white", border: "1px solid rgba(196,133,90,0.3)", color: "#c4855a" }} />
            <CarouselNext style={{ background: "white", border: "1px solid rgba(196,133,90,0.3)", color: "#c4855a" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(196,133,90,0.1)", color: "#c4855a", border: "1px solid rgba(196,133,90,0.25)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui" }}>FORFAITS</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#2d1f17" }}>Des offres pour chaque moment</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 16px 50px rgba(196,133,90,0.25)" : "0 8px 32px rgba(0,0,0,0.08)" }}
                  style={{ borderRadius: 20, border: plan.featured ? "2px solid #c4855a" : "1px solid rgba(196,133,90,0.15)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #c4855a, #e8a97e)" }} />}
                  <div style={{ padding: "32px 24px", background: plan.featured ? "rgba(196,133,90,0.04)" : "white" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(196,133,90,0.15)", color: "#c4855a", fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 12, fontFamily: "system-ui" }}>LE PLUS POPULAIRE</div>}
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#2d1f17", marginBottom: 6 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "#8b7355", fontFamily: "system-ui", marginBottom: 16 }}>{plan.desc}</p>
                    <div style={{ fontSize: 40, fontWeight: 700, color: "#c4855a", marginBottom: 24 }}>{plan.price} €</div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#6b4c3b", fontFamily: "system-ui" }}>
                          <Check size={14} color="#c4855a" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "13px", background: plan.featured ? "linear-gradient(135deg, #c4855a, #e8a97e)" : "transparent", color: plan.featured ? "white" : "#c4855a", border: plan.featured ? "none" : "2px solid rgba(196,133,90,0.4)", borderRadius: 40, fontSize: 13, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer" }}>
                      Réserver ce forfait
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="contact" style={{ padding: "100px 32px", background: "#faf8f5" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Badge style={{ background: "rgba(196,133,90,0.1)", color: "#c4855a", border: "1px solid rgba(196,133,90,0.25)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui" }}>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#2d1f17" }}>Vos questions, nos réponses</h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(196,133,90,0.15)", borderRadius: 12, overflow: "hidden", background: "white" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 600, color: "#2d1f17", fontFamily: "system-ui", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "#8b7355", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, #c4855a 0%, #e8a97e 100%)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Sparkles size={36} color="white" style={{ marginBottom: 20 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700, color: "white", marginBottom: 16 }}>Offrez-vous un moment rien que pour vous</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 36 }}>Réservez en ligne en 2 minutes. Premier soin ? Consultation gratuite offerte.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 36px", background: "white", color: "#c4855a", border: "none", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                Réserver maintenant
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 36px", background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 40, fontSize: 15, fontFamily: "system-ui", cursor: "pointer" }}>
                Offrir un bon cadeau
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px 32px 36px", background: "#2d1f17" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #c4855a, #e8a97e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={14} color="white" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#e8a97e" }}>Lumière Beauty</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 20, maxWidth: 260 }}>Institut de beauté bio & naturel. 14 rue des Fleurs, 75006 Paris. Ouvert Lun–Sam 9h–19h.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Camera, Users2].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                    <Icon size={15} />
                  </motion.button>
                ))}
              </div>
            </div>
            {[
              { title: "Soins", links: ["Visage", "Corps", "Ongles", "Massages", "Maquillage"] },
              { title: "Institut", links: ["À propos", "Notre équipe", "Produits", "Carte cadeau"] },
              { title: "Pratique", links: ["Réserver", "Tarifs", "Horaires", "Contact", "FAQ"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#e8a97e", marginBottom: 18, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "system-ui", cursor: "pointer" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Lumière Beauty — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}
