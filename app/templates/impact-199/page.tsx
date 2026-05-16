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
import { Pen, Star, Clock, MapPin, Camera, Menu, Check, Shield, Award, Zap, Eye, Heart, Droplets } from "lucide-react"

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

const STYLES = [
  { name: "Fine Line", img: "photo-1598300042247-d088f8ab3a91", desc: "Traits fins, détails ultra-précis, élégance minimaliste" },
  { name: "Black & Grey", img: "photo-1611501275019-9b5cda994e8d", desc: "Ombrés profonds, réalisme, nuances de gris maîtrisées" },
  { name: "Aquarelle", img: "photo-1562907550-096d3bf9b25c", desc: "Couleurs fluides, dégradés organiques, effet peinture" },
  { name: "Géométrique", img: "photo-1598300042247-d088f8ab3a91", desc: "Formes précises, symétrie, mandala & dotwork" },
  { name: "Réalisme", img: "photo-1611501275019-9b5cda994e8d", desc: "Portraits, animaux, nature — rendu photographique" },
  { name: "Old School", img: "photo-1562907550-096d3bf9b25c", desc: "Boldlines, couleurs saturées, icônes classiques revisités" },
]

const ARTISTS = [
  { name: "Kaito Mura", style: "Fine Line & Géométrique", exp: "8 ans", img: "photo-1507003211169-0a1dd7228f2d", bio: "Kaito est spécialisé dans les lignes ultra-fines et les compositions géométriques. Son travail de dotwork est reconnu à l'échelle européenne." },
  { name: "Sara Venn", style: "Aquarelle & Réalisme", exp: "6 ans", img: "photo-1494790108377-be9c29b29330", bio: "Sara crée des œuvres qui ressemblent à des aquarelles peintes sur la peau. Sa technique de superposition des couleurs est unique." },
  { name: "Marco Rossi", style: "Black & Grey & Old School", exp: "11 ans", img: "photo-1500648767791-00dcc994a43e", bio: "Marco est l'un des rares artistes maîtrisant aussi bien le réalisme noir et gris que les grands classiques revisités avec sa touche italienne." },
]

const STATS = [
  { val: "2 400+", label: "Tatouages réalisés" },
  { val: "3", label: "Artistes experts" },
  { val: "100%", label: "Encres vegan certifiées" },
  { val: "4.9/5", label: "Avis clients" },
  { val: "0", label: "Infection signalée" },
]

const TESTIMONIALS = [
  { name: "Théo Lambert", role: "Client fidèle", rating: 5, text: "Kaito a réalisé un manchon géométrique sur tout mon avant-bras. Le résultat est au-delà de mes espérances — chaque détail est parfait.", avatar: "TL" },
  { name: "Julie Moreau", role: "1ère expérience tattoo", rating: 5, text: "J'avais peur pour mon premier tatouage. Sara m'a accueillie avec tellement de bienveillance, expliqué chaque étape. Le résultat est magnifique.", avatar: "JM" },
  { name: "Alexandre Petit", role: "Collection en cours", rating: 5, text: "C'est mon 4ème tatouage ici. Je ne vais nulle part ailleurs. Le studio est propre, les artistes sont des pros, et l'ambiance est vraiment cool.", avatar: "AP" },
  { name: "Camille Dupont", role: "Portrait réalisé", rating: 5, text: "Marco a reproduit le portrait de ma grand-mère avec un réalisme incroyable. Chaque fois que je le regarde, j'ai les larmes aux yeux.", avatar: "CD" },
  { name: "Noah Spiegel", role: "Aquarelle japonaise", rating: 5, text: "Sara a transformé mon croquis en une aquarelle japonaise sublissime dans le dos. Je reçois des compliments tous les jours.", avatar: "NS" },
]

const PRICING = [
  { name: "Flash", price: "80", unit: "à partir de", desc: "Designs prêts à poser, petits formats", features: ["Motifs flash exclusifs studio", "Petits formats (max 10cm)", "Encres vegan certifiées", "Soin après-tatouage inclus", "Retouche gratuite"] },
  { name: "Sur Mesure", price: "200", unit: "à partir de", desc: "Votre vision, notre expertise", featured: true, features: ["Consultation design 45 min", "Création originale exclusive", "Toutes tailles et emplacements", "Révisions incluses", "Soin aftercare premium", "Retouche gratuite 3 mois"] },
  { name: "Grand Projet", price: "Sur devis", unit: "", desc: "Sleeve, dos complet, projets XXL", features: ["Étude de projet détaillée", "Séances multiples planifiées", "Tarif dégressif par session", "Suivi photographique du projet", "Priorité de réservation", "Accès galerie privée"] },
]

const FAQS = [
  { q: "Comment se déroule la première consultation ?", a: "La consultation (30–45 min) est gratuite et sans engagement. Vous apportez vos références, on discute du placement, de la taille et du style. L'artiste vous propose un devis et un planning." },
  { q: "Vos encres sont-elles sûres ?", a: "Absolument. Nous utilisons exclusivement des encres certifiées REACH, vegan et sans métaux lourds. Nos produits sont testés dermatologiquement et conformes aux normes européennes 2023." },
  { q: "Comment préparer ma séance de tatouage ?", a: "Mangez un bon repas 2h avant, hydratez-vous, portez des vêtements amples sur la zone à tatouer. Évitez l'alcool 48h avant et le soleil intense sur la zone 2 semaines avant." },
  { q: "Est-ce que les retouches sont gratuites ?", a: "Oui, toute retouche sur un tatouage réalisé dans notre studio est gratuite pendant les 3 premiers mois, à condition d'avoir suivi nos conseils de cicatrisation." },
  { q: "Quels emplacements peuvent être douloureux ?", a: "Les zones les plus sensibles sont les côtes, les pieds, les mains, l'intérieur des bras et le cou. Nous proposons une crème anesthésiante sur demande pour les zones très sensibles." },
  { q: "Combien de temps faut-il pour la cicatrisation ?", a: "La cicatrisation superficielle prend 2–4 semaines. La cicatrisation complète (en profondeur) prend 3–6 mois. Nous vous fournissons un guide aftercare complet et un produit cicatrisant." },
  { q: "Acceptez-vous les mineurs ?", a: "Non. Nous ne tatouous pas les personnes de moins de 18 ans, même avec accord parental — c'est une règle éthique et légale à laquelle nous ne dérogeons pas." },
]

export default function EncreEtAmePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#0d0d0d", color: "#f0ece4" }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(13,13,13,0.9)", borderBottom: "1px solid rgba(240,236,228,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <Pen size={20} color="#e8d5a3" />
            <span style={{ fontSize: 20, fontWeight: 800, color: "#f0ece4", letterSpacing: "0.06em", fontFamily: "system-ui" }}>ENCRE & ÂME</span>
          </Link>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {["Portfolio", "Artistes", "Tarifs", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ color: "rgba(240,236,228,0.55)", textDecoration: "none", fontSize: 14, fontFamily: "system-ui", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e8d5a3")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,236,228,0.55)")}>
                {item}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(232,213,163,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "10px 22px", background: "#e8d5a3", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
              RÉSERVER
            </motion.button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#f0ece4", cursor: "pointer" }} className="md:hidden block">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#0d0d0d", borderLeft: "1px solid rgba(240,236,228,0.08)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Portfolio", "Artistes", "Tarifs", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)}
                    style={{ color: "#f0ece4", textDecoration: "none", fontSize: 18, fontFamily: "system-ui" }}>{item}</a>
                ))}
                <button style={{ padding: "14px", background: "#e8d5a3", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", fontWeight: 700, cursor: "pointer" }}>
                  RÉSERVER
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 680, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1567359781514-81212b4477a3?w=1600&q=80" alt="Studio tatouage" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(13,13,13,0.92) 45%, rgba(13,13,13,0.5) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, padding: "0 10vw", maxWidth: 680, opacity: textOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 28, fontFamily: "system-ui", padding: "6px 14px" }}>
              STUDIO DE TATOUAGE — PARIS 11ème
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(42px, 6.5vw, 82px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 28, fontFamily: "system-ui", color: "#f0ece4" }}>
            L'art sous<br />la peau,<br /><span style={{ color: "#e8d5a3" }}>pour toujours.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 17, color: "rgba(240,236,228,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 40, maxWidth: 460 }}>
            Trois artistes, six styles, une obsession commune : l'excellence. Encres vegan, hygiène irréprochable, créations 100% originales.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(232,213,163,0.3)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "#e8d5a3", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
              PRENDRE RDV
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "transparent", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.25)", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", letterSpacing: "0.06em", cursor: "pointer" }}>
              VOIR LE PORTFOLIO
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 48, bottom: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(232,213,163,0.2)", borderRadius: 12, padding: "20px 24px", zIndex: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#e8d5a3", fontFamily: "system-ui" }}>2 400+</div>
          <div style={{ fontSize: 12, color: "rgba(240,236,228,0.5)", fontFamily: "system-ui", letterSpacing: "0.06em" }}>œuvres réalisées</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "48px 32px", background: "rgba(232,213,163,0.04)", borderTop: "1px solid rgba(232,213,163,0.08)", borderBottom: "1px solid rgba(232,213,163,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#e8d5a3", fontFamily: "system-ui" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "rgba(240,236,228,0.45)", fontFamily: "system-ui", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PORTFOLIO STYLES */}
      <section id="portfolio" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>STYLES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, fontFamily: "system-ui", letterSpacing: "-0.02em", color: "#f0ece4" }}>Six styles, une passion</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {STYLES.map((style, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.02 }} style={{ position: "relative", aspectRatio: "3/4", borderRadius: 8, overflow: "hidden", cursor: "pointer" }}>
                  <Image src={`https://images.unsplash.com/${style.img}?w=500&q=80`} alt={style.name} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(13,13,13,0.85) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: "system-ui", marginBottom: 6, letterSpacing: "0.02em" }}>{style.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(240,236,228,0.65)", fontFamily: "system-ui", lineHeight: 1.5 }}>{style.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISTES TABS */}
      <section id="artistes" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>ARTISTES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, fontFamily: "system-ui", color: "#f0ece4" }}>Rencontrez l'équipe</h2>
            </div>
          </Reveal>

          <Tabs defaultValue="kaito" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(232,213,163,0.12)", marginBottom: 40, display: "flex", height: "auto", padding: 4, gap: 4 }}>
              {ARTISTS.map((a, i) => (
                <TabsTrigger key={i} value={a.name.toLowerCase().split(" ")[0]} style={{ flex: 1, fontSize: 13, fontFamily: "system-ui", color: "rgba(240,236,228,0.55)", letterSpacing: "0.04em" }}>{a.name}</TabsTrigger>
              ))}
            </TabsList>

            {ARTISTS.map((artist, i) => (
              <TabsContent key={i} value={artist.name.toLowerCase().split(" ")[0]}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden" }}>
                    <Image src={`https://images.unsplash.com/${artist.img}?w=600&q=80`} alt={artist.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 36, fontWeight: 900, fontFamily: "system-ui", color: "#f0ece4", marginBottom: 8 }}>{artist.name}</h3>
                    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                      <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontFamily: "system-ui", fontSize: 12 }}>{artist.style}</Badge>
                      <Badge style={{ background: "rgba(255,255,255,0.05)", color: "rgba(240,236,228,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "system-ui", fontSize: 12 }}>{artist.exp} d'expérience</Badge>
                    </div>
                    <p style={{ fontSize: 16, color: "rgba(240,236,228,0.65)", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 32 }}>{artist.bio}</p>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                      {["Consultations gratuites", "Designs 100% originaux", "Portfolio Camera @encre.ame", "Réservation en ligne possible"].map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(240,236,228,0.65)", fontFamily: "system-ui" }}>
                          <Check size={14} color="#e8d5a3" style={{ flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: "14px 28px", background: "#e8d5a3", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
                      RÉSERVER AVEC {artist.name.split(" ")[0].toUpperCase()}
                    </motion.button>
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
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>TÉMOIGNAGES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, fontFamily: "system-ui", color: "#f0ece4" }}>Ils portent notre art</h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(232,213,163,0.1)", borderRadius: 12 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#e8d5a3" color="#e8d5a3" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(240,236,228,0.7)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar>
                          <AvatarFallback style={{ background: "rgba(232,213,163,0.15)", color: "#e8d5a3", fontSize: 13, fontWeight: 700 }}>{t.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#f0ece4", fontFamily: "system-ui" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(240,236,228,0.4)", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,213,163,0.25)", color: "#e8d5a3" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,213,163,0.25)", color: "#e8d5a3" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>TARIFS</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, fontFamily: "system-ui", color: "#f0ece4" }}>Des prix transparents</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(232,213,163,0.15)" : "0 8px 32px rgba(0,0,0,0.4)" }}
                  style={{ borderRadius: 12, border: plan.featured ? "1px solid rgba(232,213,163,0.4)" : "1px solid rgba(255,255,255,0.06)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#e8d5a3" }} />}
                  <div style={{ padding: "32px 24px", background: plan.featured ? "rgba(232,213,163,0.04)" : "rgba(255,255,255,0.02)" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(232,213,163,0.15)", color: "#e8d5a3", fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 12, fontFamily: "system-ui" }}>POPULAIRE</div>}
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f0ece4", fontFamily: "system-ui", marginBottom: 6 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(240,236,228,0.4)", fontFamily: "system-ui", marginBottom: 16 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 28 }}>
                      {plan.unit && <span style={{ fontSize: 12, color: "rgba(240,236,228,0.4)", fontFamily: "system-ui" }}>{plan.unit} </span>}
                      <span style={{ fontSize: plan.price === "Sur devis" ? 22 : 38, fontWeight: 800, color: "#e8d5a3", fontFamily: "system-ui" }}>{plan.price}</span>
                      {plan.price !== "Sur devis" && <span style={{ fontSize: 14, color: "rgba(240,236,228,0.4)", fontFamily: "system-ui" }}> €</span>}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(240,236,228,0.65)", fontFamily: "system-ui" }}>
                          <Check size={13} color="#e8d5a3" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "13px", background: plan.featured ? "#e8d5a3" : "transparent", color: plan.featured ? "#0d0d0d" : "#e8d5a3", border: plan.featured ? "none" : "1px solid rgba(232,213,163,0.35)", borderRadius: 4, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
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
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Badge style={{ background: "rgba(232,213,163,0.1)", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.25)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16, fontFamily: "system-ui" }}>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, fontFamily: "system-ui", color: "#f0ece4" }}>Questions fréquentes</h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(232,213,163,0.1)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 600, color: "#f0ece4", fontFamily: "system-ui", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "rgba(240,236,228,0.55)", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(232,213,163,0.1) 0%, rgba(232,213,163,0.04) 100%)", borderTop: "1px solid rgba(232,213,163,0.12)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Pen size={40} color="#e8d5a3" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, fontFamily: "system-ui", color: "#f0ece4", marginBottom: 16 }}>
              Prêt à porter <span style={{ color: "#e8d5a3" }}>votre histoire</span> ?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(240,236,228,0.55)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 40 }}>
              Consultation gratuite — aucun engagement. Amenez vos idées, on crée le reste.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(232,213,163,0.25)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 36px", background: "#e8d5a3", color: "#0d0d0d", border: "none", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
                PRENDRE RDV EN LIGNE
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 36px", background: "transparent", color: "#e8d5a3", border: "1px solid rgba(232,213,163,0.35)", borderRadius: 4, fontSize: 14, fontFamily: "system-ui", letterSpacing: "0.06em", cursor: "pointer" }}>
                VOIR L'INSTAGRAM
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px 32px 36px", background: "#070707" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Pen size={18} color="#e8d5a3" />
                <span style={{ fontSize: 17, fontWeight: 800, color: "#e8d5a3", fontFamily: "system-ui", letterSpacing: "0.06em" }}>ENCRE & ÂME</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(240,236,228,0.35)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>
                Studio de tatouage artistique. 42 rue Oberkampf, 75011 Paris. Ouvert Mar–Sam 11h–20h.
              </p>
              <motion.button whileHover={{ scale: 1.1 }} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,213,163,0.2)", borderRadius: 6, padding: "8px 14px", cursor: "pointer", color: "#e8d5a3" }}>
                <Camera size={15} />
                <span style={{ fontSize: 13, fontFamily: "system-ui" }}>@encre.ame</span>
              </motion.button>
            </div>
            {[
              { title: "Styles", links: ["Fine Line", "Black & Grey", "Aquarelle", "Géométrique", "Réalisme"] },
              { title: "Studio", links: ["Portfolio", "Artistes", "Hygiène", "Flash du jour", "Carte cadeau"] },
              { title: "Infos", links: ["Réserver", "Tarifs", "FAQ", "Contact", "Aftercare"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#e8d5a3", marginBottom: 18, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(240,236,228,0.35)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
          <p style={{ fontSize: 12, color: "rgba(240,236,228,0.2)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Encre & Âme — Studio de tatouage artistique Paris</p>
        </div>
      </footer>
    </div>
  )
}
