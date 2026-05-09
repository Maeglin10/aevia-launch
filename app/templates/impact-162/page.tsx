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
import { Coffee, Star, Clock, MapPin, Leaf, Heart, Camera, Users2, Menu, Check, Wifi, Music } from "lucide-react"

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

const MENU_ITEMS = [
  { cat: "Cafés", items: [
    { name: "Espresso Signature", desc: "Blend maison torréfié sur place — notes de chocolat noir et noisette grillée", price: "3.20 €" },
    { name: "Flat White", desc: "Double ristretto, lait entier micromoussé — velours en tasse", price: "4.50 €" },
    { name: "Latte à la Rose", desc: "Espresso, mousse de lait, sirop rose maison — notre signature florale", price: "5.00 €" },
    { name: "Cold Brew Nitro", desc: "Infusion froide 18h, service au robinet azote — crémeux et naturellement sucré", price: "5.50 €" },
  ]},
  { cat: "Douceurs", items: [
    { name: "Banana Bread", desc: "Bananes mûres, noix de pécan, caramel beurre salé maison", price: "4.50 €" },
    { name: "Croissant au beurre", desc: "Feuilletage AOP beurre de la Manche — livraison 7h du matin", price: "3.00 €" },
    { name: "Cookie Tahini", desc: "Sesame, pépites de chocolat 70%, fleur de sel — sans gluten", price: "3.50 €" },
    { name: "Cheesecake Matcha", desc: "Fromage blanc fermier, thé matcha cérémonie, biscuit sésame", price: "6.00 €" },
  ]},
]

const AMBIANCE = [
  { icon: Wifi, title: "WiFi haut débit", desc: "Connexion fibre 500 Mbps symétrique — code sur ardoise à l'accueil" },
  { icon: Music, title: "Playlist curatée", desc: "Jazz lo-fi le matin, indie le midi, ambient le soir — ambiance garantie" },
  { icon: Leaf, title: "Produits locaux", desc: "Cafés en grain de 6 origines, lait bio Île-de-France, pâtisseries du quartier" },
  { icon: Heart, title: "Pet-friendly", desc: "Votre compagnon est le bienvenu — gamelle d'eau toujours disponible" },
]

const STATS = [
  { val: "6", label: "Origines de café" },
  { val: "4.9/5", label: "Avis Google" },
  { val: "2013", label: "Fondé en" },
  { val: "7j/7", label: "Ouvert" },
  { val: "100%", label: "Ingrédients locaux" },
]

const TESTIMONIALS = [
  { name: "Sophie Marchand", role: "Cliente quotidienne", rating: 5, text: "Mon café du matin depuis 4 ans. Le flat white est le meilleur de Paris, sans discussion. L'équipe me connaît par mon prénom et mon lait d'avoine arrive automatiquement.", avatar: "SM" },
  { name: "Théo Dupuis", role: "Freelance & habitué", rating: 5, text: "Le meilleur spot de travail du 11ème. WiFi stable, bruit ambiant idéal pour se concentrer, et le banana bread me donne l'énergie pour tenir jusqu'au soir.", avatar: "TD" },
  { name: "Camille Aubert", role: "Food blogger", rating: 5, text: "Le latte à la rose est une vraie création artistique. La présentation, l'équilibre sucré-floral, la qualité du lait... c'est ce genre de détails qui font un grand café.", avatar: "CA" },
  { name: "Marc Renard", role: "Architecte", rating: 5, text: "J'y tiens mes réunions informelles. L'ambiance est parfaite — assez animée pour être stimulante, assez zen pour discuter tranquillement. La terrasse l'été est magique.", avatar: "MR" },
  { name: "Julie Petit", role: "Voisine de quartier", rating: 5, text: "Le cold brew nitro a changé ma vie l'été dernier. On en parle encore avec mon copain. Et les cookies tahini... je ne mange plus que ça au goûter.", avatar: "JP" },
]

const PRICING = [
  { name: "Fidèle", price: "15", desc: "La carte de fidélité", features: ["10 cafés achetés = 1 offert", "Viennoiserie offerte le jour de votre anniversaire", "Priorité sur les nouveautés saisonnières", "Newsletter mensuelle recettes & actualités", "Accès dégustation producteurs"] },
  { name: "Nomade", price: "49", desc: "Abonnement mensuel café illimité", featured: true, features: ["Espresso, allongé & filtre illimités", "1 spécialité/jour (flat white, latte...)", "Accès réservation table premium", "Réduction 15% sur pâtisseries", "Invitez un ami 1x/mois", "Code WiFi prioritaire"] },
  { name: "Entreprise", price: "Sur devis", desc: "Pour vos équipes et événements", features: ["Commandes régulières livrées", "Privatisation soirée ou weekend", "Atelier dégustation café", "Branding co-organisé possible", "Facturation mensuelle", "Account manager dédié"] },
]

const FAQS = [
  { q: "Proposez-vous des options véganes et sans gluten ?", a: "Oui. Nos laits végétaux (avoine, soja, amande, coco) sont disponibles pour tous les cafés. La plupart de nos pâtisseries ont une option sans gluten. Consultez notre ardoise quotidienne pour les spécialités du jour." },
  { q: "Peut-on réserver une table ?", a: "Oui, les tables du fond et la terrasse sont réservables via notre application ou par téléphone, minimum 2h à l'avance. Les comptoirs et banquettes sont en libre-accès." },
  { q: "D'où viennent vos cafés ?", a: "Nous sourceons nos grains directement chez 6 producteurs partenaires en Éthiopie, Colombie, Guatemala, Rwanda, Yemen et Indonésie. Nous visitons chaque exploitation tous les 18 mois." },
  { q: "Proposez-vous des formations barista ?", a: "Oui, nous organisons des ateliers barista le samedi matin (2h, maximum 8 participants). Inscription sur notre site. Nous proposons aussi des ateliers café pour entreprises sur demande." },
  { q: "Peut-on acheter vos cafés en grain ?", a: "Absolument. Nos 6 origines sont disponibles à la vente en boutique (250g et 1kg) et sur notre boutique en ligne. Nous proposons aussi un abonnement mensuel avec un blend différent chaque mois." },
  { q: "Les chiens sont-ils acceptés ?", a: "Oui, vos compagnons sont les bienvenus sur la terrasse et dans la salle basse. Une gamelle d'eau fraîche est toujours disponible à l'entrée." },
]

export default function EssentialCafePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenuCat, setActiveMenuCat] = useState(0)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#1a1208", color: "#f0e8d8", fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(26,18,8,0.92)", borderBottom: "1px solid rgba(200,160,80,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Coffee size={20} color="#c8a050" />
            <span style={{ fontSize: 20, fontWeight: 700, color: "#f0e8d8", letterSpacing: "0.04em" }}>Brûlerie du Canal</span>
          </Link>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {["Menu", "Nos cafés", "Ambiance", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace("nos ", "")}`}
                style={{ color: "rgba(240,232,216,0.55)", textDecoration: "none", fontSize: 14, fontFamily: "system-ui", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c8a050")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,232,216,0.55)")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "9px 20px", background: "#c8a050", color: "#1a1208", border: "none", borderRadius: 6, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
              Réserver
            </motion.button>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#f0e8d8", cursor: "pointer" }} className="md:hidden block"><Menu size={24} /></button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#1a1208" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Menu", "Nos cafés", "Ambiance", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)} style={{ color: "#f0e8d8", textDecoration: "none", fontSize: 18, fontFamily: "system-ui" }}>{item}</a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 680, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80" alt="Café" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(26,18,8,0.88) 40%, rgba(26,18,8,0.45) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, padding: "0 10vw", maxWidth: 680, opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(200,160,80,0.1)", color: "#c8a050", border: "1px solid rgba(200,160,80,0.3)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 28, fontFamily: "system-ui" }}>
              CAFÉ DE SPÉCIALITÉ — PARIS 10ème
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 24, color: "#f0e8d8" }}>
            Le café qui<br />mérite votre <em style={{ color: "#c8a050", fontStyle: "italic" }}>matin.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 17, color: "rgba(240,232,216,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}>
            Torréfaction artisanale, 6 origines directes, pâtisseries maison. Un café de quartier qui prend son métier au sérieux depuis 2013.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(200,160,80,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 32px", background: "#c8a050", color: "#1a1208", border: "none", borderRadius: 6, fontSize: 14, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
              Voir la carte
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }}
              style={{ padding: "16px 32px", background: "transparent", color: "#f0e8d8", border: "1px solid rgba(240,232,216,0.2)", borderRadius: 6, fontSize: 14, fontFamily: "system-ui", cursor: "pointer" }}>
              Réserver une table
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
            {[{ icon: Clock, text: "7h – 20h, 7j/7" }, { icon: MapPin, text: "32 quai de Valmy, Paris 10" }, { icon: Wifi, text: "WiFi 500 Mbps" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,232,216,0.55)", fontFamily: "system-ui" }}>
                <item.icon size={14} color="#c8a050" />{item.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 48, bottom: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 12, padding: "20px 24px", zIndex: 10 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#c8a050" color="#c8a050" />)}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui" }}>4.9/5</div>
          <div style={{ fontSize: 12, color: "rgba(240,232,216,0.45)", fontFamily: "system-ui" }}>+520 avis Google</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "44px 32px", background: "rgba(200,160,80,0.05)", borderTop: "1px solid rgba(200,160,80,0.1)", borderBottom: "1px solid rgba(200,160,80,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 120 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "rgba(240,232,216,0.45)", fontFamily: "system-ui", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section id="menu" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Badge style={{ background: "rgba(200,160,80,0.1)", color: "#c8a050", border: "1px solid rgba(200,160,80,0.25)", fontSize: 11, letterSpacing: "0.1em", marginBottom: 16, fontFamily: "system-ui" }}>NOTRE CARTE</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#f0e8d8" }}>Sélection du <em style={{ color: "#c8a050" }}>moment</em></h2>
            </div>
          </Reveal>

          <Tabs defaultValue="Cafés" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,160,80,0.12)", marginBottom: 36, display: "flex", height: "auto", padding: 4, gap: 4 }}>
              {MENU_ITEMS.map(cat => (
                <TabsTrigger key={cat.cat} value={cat.cat} style={{ flex: 1, fontSize: 14, fontFamily: "system-ui", fontWeight: 600, color: "rgba(240,232,216,0.55)" }}>{cat.cat}</TabsTrigger>
              ))}
            </TabsList>
            {MENU_ITEMS.map(cat => (
              <TabsContent key={cat.cat} value={cat.cat}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {cat.items.map((item, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                      <motion.div whileHover={{ borderColor: "rgba(200,160,80,0.3)" }}
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: 12, padding: "22px 20px", transition: "border-color 0.3s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f0e8d8" }}>{item.name}</h3>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui", flexShrink: 0, marginLeft: 12 }}>{item.price}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(240,232,216,0.55)", fontFamily: "system-ui", lineHeight: 1.65 }}>{item.desc}</p>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* AMBIANCE */}
      <section id="ambiance" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#f0e8d8" }}>Plus qu'un café, <em style={{ color: "#c8a050" }}>un lieu de vie</em></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {AMBIANCE.map((a, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: 12, padding: "24px 20px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(200,160,80,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <a.icon size={18} color="#c8a050" />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0e8d8", marginBottom: 8 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(240,232,216,0.55)", fontFamily: "system-ui", lineHeight: 1.65 }}>{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 20, overflow: "hidden" }}>
                <Image src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80" alt="Ambiance café" fill style={{ objectFit: "cover" }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#f0e8d8" }}>Nos <em style={{ color: "#c8a050" }}>habitués</em> parlent</h2>
            </div>
          </Reveal>
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: 12 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#c8a050" color="#c8a050" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(240,232,216,0.7)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar><AvatarFallback style={{ background: "rgba(200,160,80,0.15)", color: "#c8a050", fontSize: 12, fontWeight: 700 }}>{t.avatar}</AvatarFallback></Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#f0e8d8" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(240,232,216,0.4)", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,160,80,0.25)", color: "#c8a050" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,160,80,0.25)", color: "#c8a050" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#f0e8d8" }}>Nos offres <em style={{ color: "#c8a050" }}>fidélité</em></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(200,160,80,0.15)" : "0 8px 32px rgba(0,0,0,0.4)" }}
                  style={{ borderRadius: 16, border: plan.featured ? "1px solid rgba(200,160,80,0.4)" : "1px solid rgba(255,255,255,0.06)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#c8a050" }} />}
                  <div style={{ padding: "28px 22px", background: plan.featured ? "rgba(200,160,80,0.04)" : "rgba(255,255,255,0.02)" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(200,160,80,0.15)", color: "#c8a050", fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 12, fontFamily: "system-ui" }}>POPULAIRE</div>}
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f0e8d8", marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(240,232,216,0.4)", fontFamily: "system-ui", marginBottom: 16 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 20 }}>
                      {plan.price !== "Sur devis" ? (
                        <><span style={{ fontSize: 36, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui" }}>{plan.price}€</span><span style={{ fontSize: 13, color: "rgba(240,232,216,0.4)", fontFamily: "system-ui" }}>/mois</span></>
                      ) : (
                        <span style={{ fontSize: 22, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui" }}>Sur devis</span>
                      )}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(240,232,216,0.6)", fontFamily: "system-ui" }}>
                          <Check size={13} color="#c8a050" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "12px", background: plan.featured ? "#c8a050" : "transparent", color: plan.featured ? "#1a1208" : "#c8a050", border: plan.featured ? "none" : "1px solid rgba(200,160,80,0.35)", borderRadius: 8, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                      {plan.price === "Sur devis" ? "Nous contacter" : "S'abonner"}
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="contact" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#f0e8d8" }}>Questions fréquentes</h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(200,160,80,0.1)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: "#f0e8d8", fontFamily: "system-ui", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 20px 16px", fontSize: 14, color: "rgba(240,232,216,0.55)", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(200,160,80,0.12) 0%, rgba(200,160,80,0.04) 100%)", borderTop: "1px solid rgba(200,160,80,0.12)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Coffee size={40} color="#c8a050" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700, color: "#f0e8d8", marginBottom: 16 }}>
              On vous attend <em style={{ color: "#c8a050" }}>demain matin.</em>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(240,232,216,0.5)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 36 }}>Ouvert 7j/7 de 7h à 20h. 32 quai de Valmy, Paris 10ème.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(200,160,80,0.25)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 32px", background: "#c8a050", color: "#1a1208", border: "none", borderRadius: 6, fontSize: 14, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                Réserver une table
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 32px", background: "transparent", color: "#c8a050", border: "1px solid rgba(200,160,80,0.35)", borderRadius: 6, fontSize: 14, fontFamily: "system-ui", cursor: "pointer" }}>
                Commander en ligne
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 32px 32px", background: "#0d0904" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Coffee size={18} color="#c8a050" />
                <span style={{ fontSize: 18, fontWeight: 700, color: "#c8a050", fontFamily: "system-ui" }}>Brûlerie du Canal</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(240,232,216,0.35)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 280 }}>
                32 quai de Valmy, 75010 Paris — Ouvert 7h–20h, 7j/7<br />01 42 38 XX XX — hello@brulerieducanal.fr
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {[Camera, Users2].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(240,232,216,0.35)" }}>
                    <Icon size={14} />
                  </motion.button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { title: "Carte", links: ["Cafés", "Thés & infusions", "Douceurs", "Boissons froides", "Brunch"] },
                { title: "Infos", links: ["Notre histoire", "Nos cafés", "Ateliers", "Abonnements", "Contact"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#c8a050", marginBottom: 16, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(240,232,216,0.35)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.05)", marginBottom: 20 }} />
          <p style={{ fontSize: 12, color: "rgba(240,232,216,0.2)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Brûlerie du Canal — Café de spécialité Paris</p>
        </div>
      </footer>
    </div>
  )
}
