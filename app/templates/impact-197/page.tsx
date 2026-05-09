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
import { Globe, Compass, Star, MapPin, Phone, Mail, Camera, MessageSquare, Link2, Users2, Menu, X, ChevronRight, Shield, Clock, Award, Users, Plane, Anchor, Mountain, Heart, Check, ArrowRight } from "lucide-react"

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const DESTINATIONS = [
  { name: "Maldives Privées", tag: "Océan Indien", img: "photo-1514282401047-d79a71a590e8", duration: "10 nuits", price: "12 400 €" },
  { name: "Kyoto Imperiale", tag: "Japon", img: "photo-1528360983277-13d401cdc186", duration: "12 nuits", price: "9 800 €" },
  { name: "Patagonie Sauvage", tag: "Chili & Argentine", img: "photo-1501854140801-50d01698950b", duration: "14 nuits", price: "11 200 €" },
  { name: "Kenya & Masaï Mara", tag: "Afrique de l'Est", img: "photo-1547036967-23d11aacaee0", duration: "10 nuits", price: "8 900 €" },
  { name: "Santorin Exclusive", tag: "Grèce", img: "photo-1533105079780-92b9be482077", duration: "8 nuits", price: "6 700 €" },
  { name: "Antarctique Legend", tag: "Pôle Sud", img: "photo-1494548162494-384bba4ab999", duration: "18 nuits", price: "29 900 €" },
]

const STATS = [
  { val: "4 200+", label: "Voyages sur mesure" },
  { val: "98%", label: "Taux de satisfaction" },
  { val: "87", label: "Pays parcourus" },
  { val: "12 ans", label: "D'expertise premium" },
  { val: "340+", label: "Partenaires exclusifs" },
]

const TESTIMONIALS = [
  { name: "Isabelle Fontaine", role: "CEO, Fontaine Industries", rating: 5, text: "Notre voyage aux Maldives était simplement parfait. L'équipe d'Évasion Dorée a pensé à chaque détail — du transfert en hydravion privé au menu personnalisé sur notre île.", avatar: "IF" },
  { name: "Marc & Sophie Delacroix", role: "Couples voyageurs", rating: 5, text: "Notre safari au Kenya a dépassé toutes nos attentes. Les guides locaux exclusifs, le lodge privé, les couchers de soleil sur la savane... un rêve éveillé.", avatar: "MD" },
  { name: "Philippe Aumont", role: "Directeur Général, Aumont Capital", rating: 5, text: "Évasion Dorée gère nos voyages d'affaires et de loisirs depuis 5 ans. Leur conciergerie 24h/24 est un atout inestimable pour un dirigeant comme moi.", avatar: "PA" },
  { name: "Nathalie Rousseau", role: "Chirurgienne, Paris", rating: 5, text: "L'expédition en Antarctique organisée par Évasion Dorée a été l'aventure de ma vie. Logistique parfaite, confort et authenticité à la fois. Je recommande sans hésitation.", avatar: "NR" },
  { name: "Antoine Leblanc", role: "Architecte & Entrepreneur", rating: 5, text: "De Kyoto aux temples d'Angkor, Évasion Dorée a créé pour moi un itinéraire sur mesure avec des accès exclusifs à des lieux fermés au grand public. Exceptionnel.", avatar: "AL" },
]

const PRICING = [
  { name: "Découverte", price: "4 900", period: "par personne", color: "from-slate-700 to-slate-800", features: ["Itinéraire personnalisé", "Hôtels 4-5 étoiles sélectionnés", "Transfers & logistique", "Guide local francophone", "Assistance voyage 24/7", "2 excursions privées incluses"] },
  { name: "Prestige", price: "12 400", period: "par personne", color: "from-amber-700 to-yellow-800", featured: true, features: ["Tout Découverte inclus", "Hôtels & lodges 5★ exclusifs", "Vol business class inclus", "Conciergerie dédiée", "Expériences privées illimitées", "Accès VIP monuments & sites", "Dîners gastronomiques réservés"] },
  { name: "Signature", price: "29 900", period: "par personne", color: "from-slate-800 to-slate-900", features: ["Tout Prestige inclus", "Vol en jet privé", "Villa ou yacht privatisé", "Chef cuisinier dédié", "Médecin de voyage inclus", "Photographe professionnel", "Itinéraire 100% secret exclusif"] },
]

const FAQS = [
  { q: "Comment fonctionne la création d'un voyage sur mesure ?", a: "Après un appel de découverte avec l'un de nos experts, nous créons un itinéraire personnalisé sous 72h. Vous validez, ajustez, et nous gérons tout le reste — de l'avion à l'hôtel en passant par chaque expérience." },
  { q: "Quels sont les délais de réservation recommandés ?", a: "Pour les destinations prisées (Maldives, Japon en sakura, Antarctique), nous conseillons 6 à 12 mois à l'avance. Pour des voyages plus flexibles, 3 mois suffisent généralement." },
  { q: "Proposez-vous des assurances et protections voyage ?", a: "Oui, chaque voyage Évasion Dorée inclut une assistance rapatriement, une assurance annulation premium et une couverture médicale internationale. Des formules renforcées sont disponibles." },
  { q: "Peut-on modifier son itinéraire en cours de voyage ?", a: "Absolument. Notre équipe conciergerie est disponible 24h/24 et 7j/7. Si vous souhaitez prolonger votre séjour, changer de destination ou ajouter une expérience, nous nous en occupons en temps réel." },
  { q: "Organisez-vous des voyages pour entreprises et séminaires ?", a: "Oui, nous avons un pôle MICE (Meetings, Incentives, Conferences, Events) spécialisé dans les voyages de motivation et séminaires de direction dans des cadres d'exception." },
  { q: "Quelle est votre politique d'annulation ?", a: "Nous proposons des conditions d'annulation flexibles selon la formule choisie. La formule Prestige et Signature bénéficient d'annulation sans frais jusqu'à 30 jours avant le départ." },
  { q: "Travaillez-vous avec des voyageurs en situation de handicap ?", a: "Nous sommes experts en voyages accessibles. Nos conseillers connaissent les hébergements et expériences adaptés dans chaque destination pour garantir confort et autonomie." },
]

export default function EvasionDoreePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDestination, setActiveDestination] = useState<number | null>(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#06091a", color: "white", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(16px)", background: "rgba(6,9,26,0.85)", borderBottom: "1px solid rgba(201,169,110,0.15)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c9a96e, #f0d090)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Compass size={18} color="#06091a" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#c9a96e", letterSpacing: "0.08em" }}>ÉVASION DORÉE</span>
          </Link>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {["Destinations", "Services", "Témoignages", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, letterSpacing: "0.06em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
                {item}
              </a>
            ))}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #c9a96e, #f0d090)", color: "#06091a", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
              PLANIFIER MON VOYAGE
            </motion.button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ display: "none", background: "none", border: "none", color: "white", cursor: "pointer" }} className="md:hidden block">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#06091a", borderLeft: "1px solid rgba(201,169,110,0.2)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 48 }}>
                {["Destinations", "Services", "Témoignages", "Contact"].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                    style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 18, letterSpacing: "0.06em" }}>
                    {item}
                  </a>
                ))}
                <button style={{ padding: "14px 24px", background: "linear-gradient(135deg, #c9a96e, #f0d090)", color: "#06091a", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  PLANIFIER MON VOYAGE
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="Destination de rêve" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,9,26,0.5) 0%, rgba(6,9,26,0.3) 40%, rgba(6,9,26,0.85) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800, padding: "0 32px", opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge style={{ background: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.4)", fontSize: 12, letterSpacing: "0.12em", marginBottom: 24, padding: "6px 16px" }}>
              AGENCE DE VOYAGES PREMIUM — DEPUIS 2012
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(42px, 7vw, 88px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, color: "white" }}>
            Voyages <em style={{ color: "#c9a96e", fontStyle: "italic" }}>d'exception</em><br />pour âmes rares
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Des itinéraires sur mesure vers les destinations les plus exclusives du monde. Chaque voyage, une œuvre unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 8px 40px rgba(201,169,110,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "linear-gradient(135deg, #c9a96e, #f0d090)", color: "#06091a", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
              CRÉER MON VOYAGE
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 4, fontSize: 14, letterSpacing: "0.08em", cursor: "pointer", backdropFilter: "blur(8px)" }}>
              VOIR LES DESTINATIONS
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 40, bottom: 120, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 12, padding: "20px 28px", zIndex: 10 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#c9a96e" }}>4 200+</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>Voyages réalisés</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          style={{ position: "absolute", left: 40, bottom: 120, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 12, padding: "20px 28px", zIndex: 10 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#c9a96e" }}>98%</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>Clients satisfaits</div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section style={{ padding: "48px 32px", background: "rgba(201,169,110,0.06)", borderTop: "1px solid rgba(201,169,110,0.12)", borderBottom: "1px solid rgba(201,169,110,0.12)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#c9a96e", letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>DESTINATIONS PHARES</Badge>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 16 }}>
                Les routes <em style={{ color: "#c9a96e", fontStyle: "italic" }}>les plus belles</em> du monde
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: "0 auto" }}>Chaque destination soigneusement choisie pour son caractère unique et ses expériences incomparables.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {DESTINATIONS.map((dest, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3" }}
                  onClick={() => setActiveDestination(i)}>
                  <Image src={`https://images.unsplash.com/${dest.img}?w=600&q=80`} alt={dest.name} fill style={{ objectFit: "cover", transition: "transform 0.6s ease" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(6,9,26,0.9) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", top: 16, left: 16 }}>
                    <Badge style={{ background: "rgba(201,169,110,0.2)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.4)", fontSize: 11, backdropFilter: "blur(8px)" }}>
                      <MapPin size={10} style={{ marginRight: 4 }} />{dest.tag}
                    </Badge>
                  </div>
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{dest.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}><Clock size={12} style={{ display: "inline", marginRight: 4 }} />{dest.duration}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#c9a96e" }}>À partir de {dest.price}</span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES TABS */}
      <section id="services" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>NOS SERVICES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em" }}>
                Une expertise <em style={{ color: "#c9a96e", fontStyle: "italic" }}>totale</em> à votre service
              </h2>
            </div>
          </Reveal>

          <Tabs defaultValue="destinations" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.15)", marginBottom: 40, display: "flex", flexWrap: "wrap", height: "auto", gap: 4, padding: 4 }}>
              <TabsTrigger value="destinations" style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.06em" }}>Destinations Signature</TabsTrigger>
              <TabsTrigger value="concierge" style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.06em" }}>Conciergerie</TabsTrigger>
              <TabsTrigger value="experiences" style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.06em" }}>Expériences Privées</TabsTrigger>
            </TabsList>

            <TabsContent value="destinations">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Globe size={22} color="#c9a96e" />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>87 pays, des milliers d'expériences</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>Nous sélectionnons chaque destination selon des critères stricts d'exclusivité, d'authenticité et de qualité d'hébergement.</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Accès à des lodges et villas non répertoriés", "Partenariats avec 340+ établissements 5 étoiles", "Destinations hors des sentiers battus exclusives", "Certifications éco-responsabilité vérifiées"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                        <Check size={16} color="#c9a96e" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80" alt="Destinations" fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="concierge">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80" alt="Conciergerie" fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Phone size={22} color="#c9a96e" />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>Un conseiller dédié, disponible 24/7</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>Votre conseiller personnel prend en charge chaque détail de votre voyage, avant, pendant et après.</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Assistance téléphonique en 3 langues 24h/24", "Gestion des imprévus et modifications en temps réel", "Réservations restaurants étoilés sur demande", "Coordination jets privés, yachts et transfers VIP"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                        <Check size={16} color="#c9a96e" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experiences">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Star size={22} color="#c9a96e" />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>Des expériences inaccessibles au grand public</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>Dîner privé sur le Machu Picchu, plongée nocturne en Corse avec un biologiste marin, safari à pied dans le Serengeti...</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Accès privatif à des sites fermés au public", "Rencontres avec experts, artisans et scientifiques locaux", "Expériences gastronomiques avec chefs étoilés", "Activités aventure supervisées par des pros certifiés"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                        <Check size={16} color="#c9a96e" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
                  <Image src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80" alt="Expériences" fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="témoignages" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>TÉMOIGNAGES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em" }}>Ils ont voyagé avec nous</h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 12, height: "100%" }}>
                    <CardContent style={{ padding: 32 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#c9a96e" color="#c9a96e" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar>
                          <AvatarFallback style={{ background: "rgba(201,169,110,0.2)", color: "#c9a96e", fontSize: 13, fontWeight: 700 }}>{t.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>FORMULES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em" }}>Choisissez votre niveau d'exception</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>Tarifs indicatifs par personne — chaque voyage est devisé sur mesure</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 60px rgba(201,169,110,0.25)" : "0 12px 40px rgba(0,0,0,0.4)" }}
                  style={{ borderRadius: 16, overflow: "hidden", border: plan.featured ? "1px solid rgba(201,169,110,0.5)" : "1px solid rgba(255,255,255,0.08)", position: "relative", cursor: "pointer" }}>
                  {plan.featured && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #c9a96e, #f0d090)" }} />
                  )}
                  <div style={{ padding: "36px 28px", background: plan.featured ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.03)" }}>
                    {plan.featured && (
                      <div style={{ display: "inline-block", background: "rgba(201,169,110,0.15)", color: "#c9a96e", fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 16, border: "1px solid rgba(201,169,110,0.3)" }}>RECOMMANDÉ</div>
                    )}
                    <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{plan.name}</h3>
                    <div style={{ fontSize: 42, fontWeight: 700, color: "#c9a96e", letterSpacing: "-0.02em", marginBottom: 4 }}>{plan.price} €</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>{plan.period}</div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                          <Check size={14} color="#c9a96e" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "14px", background: plan.featured ? "linear-gradient(135deg, #c9a96e, #f0d090)" : "rgba(255,255,255,0.08)", color: plan.featured ? "#06091a" : "white", border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
                      DEMANDER UN DEVIS
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
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.12em", marginBottom: 16 }}>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em" }}>Questions fréquentes</h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(201,169,110,0.15)", borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "20px 24px", fontSize: 15, fontWeight: 500, color: "white", textAlign: "left" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 24px 20px", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(240,208,144,0.06) 100%)", borderTop: "1px solid rgba(201,169,110,0.2)", borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Compass size={40} color="#c9a96e" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Votre prochain voyage<br /><em style={{ color: "#c9a96e", fontStyle: "italic" }}>de légende</em> commence ici
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              Entretien gratuit avec un conseiller expert. Itinéraire préliminaire offert sous 72h.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 40px rgba(201,169,110,0.35)" }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "18px 40px", background: "linear-gradient(135deg, #c9a96e, #f0d090)", color: "#06091a", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
                PRENDRE RENDEZ-VOUS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                style={{ padding: "18px 40px", background: "transparent", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.4)", borderRadius: 4, fontSize: 14, letterSpacing: "0.08em", cursor: "pointer" }}>
                +33 1 47 23 58 90
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "64px 32px 40px", background: "#030510" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #c9a96e, #f0d090)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Compass size={16} color="#06091a" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#c9a96e", letterSpacing: "0.08em" }}>ÉVASION DORÉE</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>Agence de voyages de luxe fondée en 2012. Membre AFTM & Virtuoso. Certifiée ISO 9001.</p>
              <div style={{ display: "flex", gap: 12 }}>
                {[Camera, MessageSquare, Link2, Users2].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15, color: "#c9a96e" }} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                    <Icon size={15} />
                  </motion.button>
                ))}
              </div>
            </div>

            {[
              { title: "Destinations", links: ["Maldives", "Japon", "Afrique", "Amériques", "Europe", "Antarctique"] },
              { title: "Services", links: ["Voyages sur mesure", "Conciergerie", "MICE & Incentives", "Lune de miel", "Jets privés"] },
              { title: "Agence", links: ["À propos", "Notre équipe", "Partenaires", "Mentions légales", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#c9a96e", marginBottom: 20 }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator style={{ background: "rgba(201,169,110,0.12)", marginBottom: 32 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2024 Évasion Dorée — Tous droits réservés</p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Confidentialité", "CGV", "Cookies"].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
