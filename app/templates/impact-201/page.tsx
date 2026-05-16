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
import { ChefHat, Star, Clock, Utensils, Leaf, Wine, Users, Camera, Menu, Check, MapPin, Phone } from "lucide-react"

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

const MENUS = [
  { name: "Dîner en amoureux", desc: "Apéritif, 5 plats, accord mets-vins, dessert — pour 2 personnes en intimité totale", guests: "2 pers.", price: "320 €", img: "photo-1414235077428-338989a2e8c0" },
  { name: "Réception privée", desc: "Cocktail dînatoire ou dîner assis pour votre soirée exceptionnelle", guests: "8–30 pers.", price: "À partir de 85 €/pers.", img: "photo-1530103862676-de8c9debad1d" },
  { name: "Brunch dominical", desc: "Sélection salée et sucrée de saison, viennoiseries maison, jus frais", guests: "4–20 pers.", price: "À partir de 45 €/pers.", img: "photo-1504674900247-0877df9cc836" },
  { name: "Chef à domicile", desc: "Votre chef en cuisine le temps d'un repas — préparation devant vos invités", guests: "2–12 pers.", price: "À partir de 180 €", img: "photo-1546069901-ba9599a7e63c" },
]

const SAVOIR_FAIRE = [
  { icon: Leaf, title: "Produits locaux & de saison", desc: "Chaque menu est construit autour des meilleurs producteurs locaux — légumes bio du Val-de-Loire, poissons de la criée de Concarneau." },
  { icon: Wine, title: "Accords mets & vins", desc: "Sélection de vins naturels et biodynamiques en accord avec chaque plat — du Champagne à l'apéro au Sauternes sur le dessert." },
  { icon: ChefHat, title: "Formation étoilée", desc: "Formé chez Alain Passard (L'Arpège, 3★) et Anne-Sophie Pic (Maison Pic, 3★) — une technique irréprochable au service de vos papilles." },
  { icon: Users, title: "Service blanc-gant", desc: "Serveur(s) inclus dans toutes les formules groupe — mise en place de la table, service, débarrassage et nettoyage complets." },
]

const STATS = [
  { val: "850+", label: "Repas créés" },
  { val: "12 ans", label: "En cuisine pro" },
  { val: "4.9/5", label: "Note clients" },
  { val: "100%", label: "Produits sourcés" },
  { val: "3★", label: "Formation étoilée" },
]

const TESTIMONIALS = [
  { name: "Isabelle & Frédéric Morel", role: "Dîner anniversaire", rating: 5, text: "Antoine a transformé notre salle à manger en restaurant étoilé. Le menu 5 plats était un voyage gustatif inoubliable. On ne mange plus jamais aussi bien au restaurant !", avatar: "IF" },
  { name: "Caroline Dupuis", role: "Réception 15 personnes", rating: 5, text: "La qualité des produits est exceptionnelle. Antoine est arrivé 3h avant, a tout géré seul, et nous a laissé une cuisine impeccable. Nos invités sont encore sous le charme.", avatar: "CD" },
  { name: "Pierre Beaumont", role: "Client fidèle", rating: 5, text: "Je fais appel à Maison Saveur pour tous mes dîners d'affaires. La présentation est digne d'un grand restaurant, et l'accord mets-vins est toujours une révélation.", avatar: "PB" },
  { name: "Sophie & Marc Aubert", role: "Brunch dominical", rating: 5, text: "Le brunch était d'une générosité et d'une fraîcheur incroyables. Les viennoiseries et le granola maison... on en parle encore 2 mois plus tard.", avatar: "SA" },
  { name: "Thomas Legrand", role: "Chef à domicile", rating: 5, text: "Voir Antoine travailler en direct dans ma cuisine, expliquer ses techniques, partager ses sources... c'était presque aussi bon que de manger !", avatar: "TL" },
]

const PRICING = [
  { name: "Solo / Duo", price: "180", unit: "à partir de", desc: "Repas intime 1 à 2 personnes", features: ["Menu 4 plats personnalisé", "Ingrédients premium inclus", "2h de prestation chef", "Service à table", "Nettoyage inclus"] },
  { name: "Groupe", price: "75", unit: "par personne", desc: "De 6 à 30 convives", featured: true, features: ["Menu 4–6 plats sur mesure", "Consultation menu offerte", "Chef + serveur inclus", "Vaisselle & nappage fournis", "Accord vins disponible", "Nettoyage complet inclus"] },
  { name: "Événement", price: "Sur devis", unit: "", desc: "Cocktail, séminaire, mariage", features: ["Équipe complète dédiée", "Menu cocréé avec vous", "Dégustation préliminaire", "Logistique & matériel", "Service professionnel 5h+", "Traiteur & pièce montée"] },
]

const FAQS = [
  { q: "Quels sont vos délais de réservation ?", a: "Pour un dîner en semaine, 3–5 jours suffisent. Pour les weekends et grandes occasions, réservez 2 à 4 semaines à l'avance. Pour les événements de plus de 20 personnes, 1 mois minimum." },
  { q: "Êtes-vous autonome en matériel ?", a: "Oui, j'arrive avec tout le matériel nécessaire : ustensiles, couteaux, équipement de cuisson si besoin. Pour les groupes, je fournis également vaisselle, verres et nappage sur demande." },
  { q: "Comment fonctionne la commande des produits ?", a: "Je me charge de tout. Vous validez le menu, je commande chez mes producteurs partenaires. Le coût des ingrédients est inclus dans le tarif affiché, sans surprise." },
  { q: "Gérez-vous les allergies et régimes spéciaux ?", a: "Absolument. Intolérance au gluten, allergies aux noix, régime végétarien, vegan, halal — il suffit de me le signaler lors de la réservation. Je crée des menus adaptés sans jamais sacrifier la gourmandise." },
  { q: "Puis-je voir le menu à l'avance ?", a: "Oui, je vous envoie le menu proposé 5 jours avant. Vous pouvez demander des ajustements. Le menu final est validé ensemble 48h avant la prestation." },
  { q: "Travaillez-vous en dehors de Paris ?", a: "Je travaille dans tout l'Île-de-France sans supplément. Pour les destinations plus éloignées (week-end en Normandie, villa côte d'Azur...), des frais de déplacement s'appliquent — devis sur demande." },
]

export default function MaisonSaveurPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#0e0b08", color: "#f5f0e8", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(14,11,8,0.9)", borderBottom: "1px solid rgba(245,240,232,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <ChefHat size={22} color="#d4a96a" />
            <span style={{ fontSize: 20, fontWeight: 400, color: "#f5f0e8", letterSpacing: "0.1em" }}>Maison Saveur</span>
          </Link>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {["Menus", "Savoir-faire", "Avis", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace("savoir-faire", "savoirfaire")}`}
                style={{ color: "rgba(245,240,232,0.55)", textDecoration: "none", fontSize: 14, fontFamily: "system-ui", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#d4a96a")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.55)")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "10px 24px", background: "#d4a96a", color: "#0e0b08", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
              RÉSERVER
            </motion.button>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#f5f0e8", cursor: "pointer" }} className="md:hidden block"><Menu size={24} /></button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#0e0b08" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Menus", "Savoir-faire", "Avis", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)} style={{ color: "#f5f0e8", textDecoration: "none", fontSize: 18, fontFamily: "system-ui" }}>{item}</a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 680, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80" alt="Cuisine gastronomique" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(14,11,8,0.9) 45%, rgba(14,11,8,0.4) 100%)" }} />
        </motion.div>
        <motion.div style={{ position: "relative", zIndex: 10, padding: "0 10vw", maxWidth: 680, opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(212,169,106,0.1)", color: "#d4a96a", border: "1px solid rgba(212,169,106,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 28, fontFamily: "system-ui", padding: "6px 14px" }}>
              CHEF PRIVÉ — FORMATION ÉTOILÉE
            </Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(42px, 6.5vw, 82px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 28, color: "#f5f0e8" }}>
            La grande cuisine<br />dans votre <em style={{ color: "#d4a96a" }}>maison.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 17, color: "rgba(245,240,232,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 40, maxWidth: 480 }}>
            Antoine Lefèvre, chef formé chez Alain Passard et Anne-Sophie Pic, compose pour vous des menus d'exception à domicile — produits locaux, technique étoilée.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(212,169,106,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "#d4a96a", color: "#0e0b08", border: "none", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
              RÉSERVER UNE PRESTATION
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }}
              style={{ padding: "16px 36px", background: "transparent", color: "#f5f0e8", border: "1px solid rgba(245,240,232,0.2)", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", cursor: "pointer" }}>
              VOIR LES MENUS
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 48, bottom: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(212,169,106,0.2)", borderRadius: 12, padding: "20px 24px", zIndex: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 300, color: "#d4a96a" }}>850+</div>
          <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", fontFamily: "system-ui" }}>repas d'exception</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "48px 32px", background: "rgba(212,169,106,0.05)", borderTop: "1px solid rgba(212,169,106,0.1)", borderBottom: "1px solid rgba(212,169,106,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 130 }}>
                <div style={{ fontSize: 34, fontWeight: 300, color: "#d4a96a" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "rgba(245,240,232,0.45)", fontFamily: "system-ui", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MENUS */}
      <section id="menus" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(212,169,106,0.1)", color: "#d4a96a", border: "1px solid rgba(212,169,106,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>FORMULES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.01em", color: "#f5f0e8" }}>Une occasion, un menu <em style={{ color: "#d4a96a", fontStyle: "italic" }}>sur mesure</em></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {MENUS.map((menu, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
                  style={{ borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,169,106,0.1)", cursor: "pointer" }}>
                  <div style={{ position: "relative", aspectRatio: "4/3" }}>
                    <Image src={`https://images.unsplash.com/${menu.img}?w=500&q=80`} alt={menu.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "22px 20px" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8, color: "#f5f0e8" }}>{menu.name}</h3>
                    <p style={{ fontSize: 14, color: "rgba(245,240,232,0.55)", fontFamily: "system-ui", lineHeight: 1.65, marginBottom: 16 }}>{menu.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(245,240,232,0.45)", fontFamily: "system-ui" }}><Users size={12} style={{ display: "inline", marginRight: 4 }} />{menu.guests}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#d4a96a", fontFamily: "system-ui" }}>{menu.price}</span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SAVOIR-FAIRE TABS */}
      <section id="savoirfaire" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(212,169,106,0.1)", color: "#d4a96a", border: "1px solid rgba(212,169,106,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>SAVOIR-FAIRE</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f5f0e8" }}>Ce qui rend chaque repas <em style={{ color: "#d4a96a", fontStyle: "italic" }}>unique</em></h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {SAVOIR_FAIRE.map((sf, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ borderColor: "rgba(212,169,106,0.35)" }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,169,106,0.1)", borderRadius: 16, padding: "28px 24px", transition: "border-color 0.3s" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(212,169,106,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <sf.icon size={20} color="#d4a96a" />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 400, marginBottom: 10, color: "#f5f0e8" }}>{sf.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(245,240,232,0.55)", fontFamily: "system-ui", lineHeight: 1.7 }}>{sf.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="avis" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f5f0e8" }}>Ils ont dîné <em style={{ color: "#d4a96a", fontStyle: "italic" }}>avec Antoine</em></h2>
            </div>
          </Reveal>
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,169,106,0.1)", borderRadius: 12 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#d4a96a" color="#d4a96a" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(245,240,232,0.7)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar><AvatarFallback style={{ background: "rgba(212,169,106,0.15)", color: "#d4a96a", fontSize: 12, fontWeight: 700 }}>{t.avatar}</AvatarFallback></Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#f5f0e8" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,169,106,0.25)", color: "#d4a96a" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,169,106,0.25)", color: "#d4a96a" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f5f0e8" }}>Tarifs transparents</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(212,169,106,0.15)" : "0 8px 32px rgba(0,0,0,0.4)" }}
                  style={{ borderRadius: 12, border: plan.featured ? "1px solid rgba(212,169,106,0.4)" : "1px solid rgba(255,255,255,0.06)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#d4a96a" }} />}
                  <div style={{ padding: "28px 22px", background: plan.featured ? "rgba(212,169,106,0.04)" : "rgba(255,255,255,0.02)" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(212,169,106,0.15)", color: "#d4a96a", fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 12, fontFamily: "system-ui" }}>POPULAIRE</div>}
                    <h3 style={{ fontSize: 20, fontWeight: 400, color: "#f5f0e8", marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(245,240,232,0.4)", fontFamily: "system-ui", marginBottom: 18 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 24 }}>
                      {plan.unit && <span style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", fontFamily: "system-ui" }}>{plan.unit} </span>}
                      <span style={{ fontSize: plan.price === "Sur devis" ? 20 : 36, fontWeight: 300, color: "#d4a96a" }}>{plan.price}</span>
                      {plan.price !== "Sur devis" && <span style={{ fontSize: 14, color: "rgba(245,240,232,0.4)", fontFamily: "system-ui" }}> €</span>}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(245,240,232,0.6)", fontFamily: "system-ui" }}>
                          <Check size={13} color="#d4a96a" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "12px", background: plan.featured ? "#d4a96a" : "transparent", color: plan.featured ? "#0e0b08" : "#d4a96a", border: plan.featured ? "none" : "1px solid rgba(212,169,106,0.35)", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                      RÉSERVER
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
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, color: "#f5f0e8" }}>Questions fréquentes</h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(212,169,106,0.1)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 400, color: "#f5f0e8", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "rgba(245,240,232,0.55)", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(212,169,106,0.1) 0%, rgba(212,169,106,0.04) 100%)", borderTop: "1px solid rgba(212,169,106,0.15)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <ChefHat size={40} color="#d4a96a" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 50px)", fontWeight: 300, color: "#f5f0e8", marginBottom: 16 }}>
              Votre prochain repas sera <em style={{ color: "#d4a96a" }}>inoubliable</em>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(245,240,232,0.55)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 36 }}>
              Devis gratuit sous 24h. Disponible 7j/7 en Île-de-France et sur destination.
            </p>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(212,169,106,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 40px", background: "#d4a96a", color: "#0e0b08", border: "none", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
              DEMANDER UN DEVIS GRATUIT
            </motion.button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 32px 32px", background: "#060402" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <ChefHat size={18} color="#d4a96a" />
                <span style={{ fontSize: 18, fontWeight: 400, color: "#d4a96a", letterSpacing: "0.1em" }}>Maison Saveur</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(245,240,232,0.35)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 280 }}>Chef Antoine Lefèvre — Prestation culinaire à domicile. Paris & Île-de-France. SIRET 842 571 234 00018</p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { title: "Services", links: ["Dîner intime", "Réception privée", "Brunch", "Chef à domicile"] },
                { title: "Contact", links: ["Réserver", "Devis gratuit", "Camera", "Mentions légales"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#d4a96a", marginBottom: 16, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(245,240,232,0.35)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.05)", marginBottom: 20 }} />
          <p style={{ fontSize: 12, color: "rgba(245,240,232,0.2)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Maison Saveur — Chef Antoine Lefèvre</p>
        </div>
      </footer>
    </div>
  )
}
