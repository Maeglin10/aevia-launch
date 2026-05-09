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
import { Gem, Star, Shield, Award, Heart, Package, Instagram, Facebook, Twitter, Menu, Check, ArrowRight, Sparkles, RefreshCw } from "lucide-react"

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

const COLLECTIONS = [
  { name: "Éternité", desc: "Bagues solitaires & alliances — diamants GVS, platine 950", img: "photo-1515562141207-7a88fb7ce338", items: 24, from: "1 890 €" },
  { name: "Soleil d'Or", desc: "Colliers & pendentifs — or jaune 18K, pierres naturelles", img: "photo-1599643478518-a784e5dc4c8f", items: 18, from: "480 €" },
  { name: "Minuit Bleu", desc: "Bracelet & manchettes — saphirs de Ceylan, or blanc 18K", img: "photo-1630018548696-8e5e5b4d7c1b", items: 12, from: "740 €" },
  { name: "Héritage", desc: "Boucles d'oreilles statement — opales, turquoises, ambre", img: "photo-1535632066927-ab7c9ab60908", items: 30, from: "320 €" },
]

const MATERIALS = [
  { icon: Gem, name: "Diamants certifiés GIA", desc: "Chaque diamant est certifié par le GIA (Gemological Institute of America) — couleur D-F, pureté VS, taille Excellent." },
  { icon: Award, name: "Or 18K & Platine 950", desc: "Nous utilisons uniquement de l'or 18 carats et du platine 950 d'origine traçable, recyclé ou extrait de manière éthique." },
  { icon: Shield, name: "Pierres précieuses sourcées", desc: "Rubis du Mozambique, émeraudes de Colombie, saphirs de Ceylan — chaque pierre est accompagnée d'un certificat d'origine." },
  { icon: Sparkles, name: "Artisanat parisien", desc: "Chaque pièce est réalisée à la main dans notre atelier du Marais, Paris, par des artisans formés aux Beaux-Arts et à l'École de Joaillerie." },
]

const STATS = [
  { val: "1 200+", label: "Pièces créées" },
  { val: "18K", label: "Or certifié" },
  { val: "35 ans", label: "Maîtrise artisanale" },
  { val: "4.9/5", label: "Avis clients" },
  { val: "GIA", label: "Certification diamants" },
]

const TESTIMONIALS = [
  { name: "Marianne Voss", role: "Bague de fiançailles", rating: 5, text: "Je cherchais une bague unique pour ma demande en mariage. L'équipe d'Aurum a créé une pièce qui a fait pleurer ma fiancée. Un travail exceptionnel, un service irréprochable.", avatar: "MV" },
  { name: "Thomas Girard", role: "Alliance personnalisée", rating: 5, text: "Nos alliances sur mesure sont parfaites. Le processus de création — du dessin initial aux essayages — était une expérience en soi. Merci à toute l'équipe.", avatar: "TG" },
  { name: "Camille Fontaine", role: "Collier Éternité", rating: 5, text: "Le collier avec le diamant de ma grand-mère réinserti dans un nouveau design contemporain est magnifique. Aurum a su respecter l'histoire de la pierre tout en créant quelque chose de moderne.", avatar: "CF" },
  { name: "Alexandre Petit", role: "Boucles Héritage", rating: 5, text: "J'offre systématiquement les bijoux Aurum pour les occasions importantes. La qualité est constante, l'emballage soigné, et chaque pièce raconte une histoire.", avatar: "AP" },
  { name: "Sophie Renard", role: "Bracelet Minuit Bleu", rating: 5, text: "Les saphirs sont d'une couleur et d'une clarté absolument remarquables. Le bracelet est devenu la pièce de joaillerie dont je reçois le plus de compliments.", avatar: "SR" },
]

const PRICING = [
  { name: "Signature", price: "480", desc: "Pièces prêt-à-porter de la collection", features: ["Bijoux de la collection en stock", "Or 18K & argent sterling", "Pierres semi-précieuses sélectionnées", "Écrin Aurum signature", "Certificat d'authenticité", "Gravure offerte"] },
  { name: "Sur Mesure", price: "1 890", desc: "Création unique à votre image", featured: true, features: ["Consultation atelier 60 min", "Design exclusif & moodboard", "Matériaux premium certifiés", "Diamants & pierres GIA", "3 essayages inclus", "Livraison assurée", "Garantie 10 ans atelier"] },
  { name: "Prestige", price: "Sur devis", desc: "Pièces de haute joaillerie", features: ["Diamants D-IF exclusifs", "Platine 950 ou or 24K", "Pierres rares & collection", "Atelier privé dédié", "Expertise GIA sur site", "Assurance & coffre-fort", "Service après-vente vie"] },
]

const FAQS = [
  { q: "Proposez-vous des bijoux sur mesure ?", a: "Absolument. La création sur mesure est au cœur de notre maison. Après une consultation gratuite dans notre atelier du Marais, nos artisans créent un dessin unique avant la réalisation." },
  { q: "Quels matériaux utilisez-vous ?", a: "Nous travaillons exclusivement avec de l'or 18 carats (jaune, blanc, rose), du platine 950, de l'argent 925 Sterling, et des pierres précieuses certifiées GIA ou accompagnées d'un certificat d'origine." },
  { q: "Comment sont certifiés vos diamants ?", a: "Tous nos diamants de plus de 0,30 ct sont certifiés GIA (Gemological Institute of America), le plus strict organisme de certification mondial. Chaque certificat accompagne votre bijou." },
  { q: "Acceptez-vous la reprise ou la transformation d'anciens bijoux ?", a: "Oui, c'est l'un de nos services les plus demandés. Vous apportez un bijou de famille, nous extraisons les pierres et les remettons en valeur dans un nouveau design qui vous ressemble." },
  { q: "Quels sont les délais pour une création sur mesure ?", a: "Comptez 4 à 8 semaines selon la complexité de la pièce. Pour les occasions urgentes (demande en mariage imminente !), nous proposons un service express de 2 semaines sur certaines créations." },
  { q: "Proposez-vous des cartes cadeaux ?", a: "Oui, disponibles en boutique et en ligne, de 100 € à 5 000 €. Valables 12 mois, elles sont échangeables contre toute pièce de la collection ou en acompte sur une création sur mesure." },
  { q: "Quelle est votre garantie ?", a: "Nos pièces sur mesure sont garanties 10 ans contre les défauts de fabrication. Nous proposons également un service d'entretien annuel (nettoyage, rhodiage, vérification des griffes) à tarif préférentiel." },
]

export default function AurumJewelryPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(0)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth", background: "#0a0806", color: "#f4ede3", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* NAVBAR */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(20px)", background: "rgba(10,8,6,0.88)", borderBottom: "1px solid rgba(212,180,140,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <Gem size={18} color="#c9a96e" />
            <span style={{ fontSize: 22, fontWeight: 400, color: "#f4ede3", letterSpacing: "0.18em" }}>AURUM</span>
          </Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {["Collections", "Sur Mesure", "Atelier", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "")}`}
                style={{ color: "rgba(244,237,227,0.5)", textDecoration: "none", fontSize: 13, fontFamily: "system-ui", letterSpacing: "0.1em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,237,227,0.5)")}>
                {item.toUpperCase()}
              </a>
            ))}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "9px 22px", background: "transparent", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.4)", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer" }}>
              BOUTIQUE
            </motion.button>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button style={{ background: "none", border: "none", color: "#f4ede3", cursor: "pointer" }} className="md:hidden block"><Menu size={24} /></button>
            </SheetTrigger>
            <SheetContent side="right" style={{ background: "#0a0806", borderLeft: "1px solid rgba(201,169,110,0.1)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 60 }}>
                {["Collections", "Sur Mesure", "Atelier", "Contact"].map(item => (
                  <a key={item} href="#" onClick={() => setMobileOpen(false)} style={{ color: "#f4ede3", textDecoration: "none", fontSize: 20, letterSpacing: "0.12em" }}>{item}</a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
          <Image src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80" alt="Bijoux de luxe" fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(10,8,6,0.88) 40%, rgba(10,8,6,0.45) 100%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, padding: "0 10vw", maxWidth: 680, opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 32, fontFamily: "system-ui", padding: "6px 16px" }}>
              MAISON DE JOAILLERIE — PARIS, DEPUIS 1989
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.01em", marginBottom: 28, color: "#f4ede3" }}>
            L'art de<br />sublimer<br /><em style={{ color: "#c9a96e", fontStyle: "italic" }}>l'éternel.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 17, color: "rgba(244,237,227,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 44, maxWidth: 440 }}>
            Bijoux haute joaillerie créés à la main dans notre atelier parisien. Diamants GIA, or 18K, pierres précieuses sourcées éthiquement.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(201,169,110,0.25)" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "#c9a96e", color: "#0a0806", border: "none", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer" }}>
              DÉCOUVRIR LES COLLECTIONS
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }}
              style={{ padding: "16px 36px", background: "transparent", color: "#f4ede3", border: "1px solid rgba(244,237,227,0.2)", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", letterSpacing: "0.12em", cursor: "pointer" }}>
              CRÉER SUR MESURE
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ position: "absolute", right: 48, bottom: 100, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, padding: "20px 24px", zIndex: 10 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: "#c9a96e" }}>GIA</div>
          <div style={{ fontSize: 11, color: "rgba(244,237,227,0.45)", fontFamily: "system-ui", letterSpacing: "0.08em" }}>Diamants certifiés</div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "44px 32px", background: "rgba(201,169,110,0.04)", borderTop: "1px solid rgba(201,169,110,0.1)", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", minWidth: 130 }}>
                <div style={{ fontSize: 34, fontWeight: 300, color: "#c9a96e", letterSpacing: "0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(244,237,227,0.4)", fontFamily: "system-ui", letterSpacing: "0.1em", marginTop: 6 }}>{s.label.toUpperCase()}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.25)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20, fontFamily: "system-ui" }}>NOS COLLECTIONS</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 54px)", fontWeight: 300, letterSpacing: "-0.01em", color: "#f4ede3" }}>
                Quatre univers, <em style={{ color: "#c9a96e", fontStyle: "italic" }}>une obsession</em>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {COLLECTIONS.map((col, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
                  style={{ borderRadius: 4, overflow: "hidden", cursor: "pointer", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.1)" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4" }}>
                    <Image src={`https://images.unsplash.com/${col.img}?w=500&q=80`} alt={col.name} fill style={{ objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,8,6,0.8) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 300, letterSpacing: "0.08em", marginBottom: 4 }}>{col.name}</h3>
                      <p style={{ fontSize: 12, color: "rgba(244,237,227,0.6)", fontFamily: "system-ui", lineHeight: 1.5 }}>{col.desc}</p>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "rgba(244,237,227,0.4)", fontFamily: "system-ui", letterSpacing: "0.08em" }}>{col.items} pièces</span>
                    <span style={{ fontSize: 14, color: "#c9a96e", fontFamily: "system-ui" }}>À partir de {col.from}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MATÉRIAUX TABS */}
      <section id="surmesure" style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.25)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20, fontFamily: "system-ui" }}>NOTRE SAVOIR-FAIRE</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f4ede3" }}>
                L'excellence <em style={{ color: "#c9a96e", fontStyle: "italic" }}>à chaque détail</em>
              </h2>
            </div>
          </Reveal>

          <Tabs defaultValue="mat0" style={{ width: "100%" }}>
            <TabsList style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.12)", marginBottom: 40, display: "flex", height: "auto", padding: 4, gap: 4 }}>
              {MATERIALS.map((m, i) => (
                <TabsTrigger key={i} value={`mat${i}`} style={{ flex: 1, fontSize: 12, fontFamily: "system-ui", color: "rgba(244,237,227,0.5)", letterSpacing: "0.06em" }}>{m.name.split(" ")[0]}</TabsTrigger>
              ))}
            </TabsList>

            {MATERIALS.map((mat, i) => (
              <TabsContent key={i} value={`mat${i}`}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                  <div>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                      <mat.icon size={22} color="#c9a96e" />
                    </div>
                    <h3 style={{ fontSize: 28, fontWeight: 300, color: "#f4ede3", marginBottom: 16, letterSpacing: "0.02em" }}>{mat.name}</h3>
                    <p style={{ fontSize: 16, color: "rgba(244,237,227,0.6)", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 28 }}>{mat.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Traçabilité complète de l'origine", "Certification internationale", "Stock réservé & personnalisé", "Documentation complète fournie"].map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(244,237,227,0.6)", fontFamily: "system-ui" }}>
                          <Check size={14} color="#c9a96e" style={{ flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: 8, overflow: "hidden" }}>
                    <Image src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80" alt="Matériaux" fill style={{ objectFit: "cover" }} />
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
              <Badge style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.25)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20, fontFamily: "system-ui" }}>TÉMOIGNAGES</Badge>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f4ede3" }}>Ce qu'ils portent, <em style={{ color: "#c9a96e", fontStyle: "italic" }}>ce qu'ils ressentent</em></h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent style={{ paddingLeft: 8 }}>
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} style={{ paddingLeft: 16, flexBasis: "calc(50% - 8px)" }}>
                  <Card style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.1)", borderRadius: 8 }}>
                    <CardContent style={{ padding: 28 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#c9a96e" color="#c9a96e" />)}
                      </div>
                      <p style={{ fontSize: 15, color: "rgba(244,237,227,0.65)", fontFamily: "system-ui", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar><AvatarFallback style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e", fontSize: 12, fontWeight: 700 }}>{t.avatar}</AvatarFallback></Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 400, color: "#f4ede3", letterSpacing: "0.04em" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(244,237,227,0.35)", fontFamily: "system-ui" }}>{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.25)", color: "#c9a96e" }} />
            <CarouselNext style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.25)", color: "#c9a96e" }} />
          </Carousel>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: "#f4ede3" }}>Nos <em style={{ color: "#c9a96e", fontStyle: "italic" }}>formules</em></h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, boxShadow: plan.featured ? "0 20px 50px rgba(201,169,110,0.15)" : "0 8px 32px rgba(0,0,0,0.5)" }}
                  style={{ borderRadius: 8, border: plan.featured ? "1px solid rgba(201,169,110,0.4)" : "1px solid rgba(255,255,255,0.05)", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#c9a96e" }} />}
                  <div style={{ padding: "32px 24px", background: plan.featured ? "rgba(201,169,110,0.04)" : "rgba(255,255,255,0.02)" }}>
                    {plan.featured && <div style={{ display: "inline-block", background: "rgba(201,169,110,0.12)", color: "#c9a96e", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, padding: "3px 10px", borderRadius: 2, marginBottom: 12, fontFamily: "system-ui" }}>LE PLUS CHOISI</div>}
                    <h3 style={{ fontSize: 22, fontWeight: 300, color: "#f4ede3", letterSpacing: "0.08em", marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(244,237,227,0.38)", fontFamily: "system-ui", marginBottom: 20 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 24 }}>
                      {plan.price !== "Sur devis" && <span style={{ fontSize: 12, color: "rgba(244,237,227,0.38)", fontFamily: "system-ui" }}>À partir de </span>}
                      <span style={{ fontSize: plan.price === "Sur devis" ? 20 : 36, fontWeight: 300, color: "#c9a96e" }}>{plan.price}</span>
                      {plan.price !== "Sur devis" && <span style={{ fontSize: 14, color: "rgba(244,237,227,0.38)", fontFamily: "system-ui" }}> €</span>}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(244,237,227,0.6)", fontFamily: "system-ui" }}>
                          <Check size={13} color="#c9a96e" style={{ marginTop: 2, flexShrink: 0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", padding: "12px", background: plan.featured ? "#c9a96e" : "transparent", color: plan.featured ? "#0a0806" : "#c9a96e", border: plan.featured ? "none" : "1px solid rgba(201,169,110,0.35)", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                      {plan.price === "Sur devis" ? "DEMANDER UN DEVIS" : "COMMANDER"}
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="atelier" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Badge style={{ background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.25)", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20, fontFamily: "system-ui" }}>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, color: "#f4ede3" }}>Vos questions</h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`q${i}`} style={{ border: "1px solid rgba(201,169,110,0.1)", borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                <AccordionTrigger style={{ padding: "18px 22px", fontSize: 15, fontWeight: 300, color: "#f4ede3", textAlign: "left", letterSpacing: "0.02em" }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ padding: "0 22px 18px", fontSize: 14, color: "rgba(244,237,227,0.55)", fontFamily: "system-ui", lineHeight: 1.8 }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "80px 32px", background: "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.03) 100%)", borderTop: "1px solid rgba(201,169,110,0.12)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Gem size={36} color="#c9a96e" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 52px)", fontWeight: 300, color: "#f4ede3", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Créez le bijou <em style={{ color: "#c9a96e", fontStyle: "italic" }}>de votre vie</em>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(244,237,227,0.5)", fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 36 }}>
              Consultation gratuite en atelier. Devis personnalisé sous 48h. Livraison assurée dans le monde entier.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(201,169,110,0.25)" }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 36px", background: "#c9a96e", color: "#0a0806", border: "none", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer" }}>
                PRENDRE RENDEZ-VOUS
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                style={{ padding: "16px 36px", background: "transparent", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.35)", borderRadius: 2, fontSize: 12, fontFamily: "system-ui", letterSpacing: "0.12em", cursor: "pointer" }}>
                VOIR LA BOUTIQUE
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px 32px 36px", background: "#060402" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Gem size={16} color="#c9a96e" />
                <span style={{ fontSize: 18, fontWeight: 300, color: "#c9a96e", letterSpacing: "0.18em" }}>AURUM</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(244,237,227,0.3)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>
                Maison de joaillerie artisanale fondée à Paris en 1989. 24 rue des Francs-Bourgeois, 75004 Paris.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(244,237,227,0.35)" }}>
                    <Icon size={14} />
                  </motion.button>
                ))}
              </div>
            </div>
            {[
              { title: "Collections", links: ["Éternité", "Soleil d'Or", "Minuit Bleu", "Héritage", "Nouvelles pièces"] },
              { title: "Services", links: ["Sur mesure", "Transformation", "Entretien", "Expertise", "Carte cadeau"] },
              { title: "Maison", links: ["Notre histoire", "L'atelier", "Certifications", "Presse", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#c9a96e", marginBottom: 18, fontFamily: "system-ui" }}>{col.title.toUpperCase()}</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(244,237,227,0.3)", textDecoration: "none", fontFamily: "system-ui" }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <Separator style={{ background: "rgba(255,255,255,0.05)", marginBottom: 24 }} />
          <p style={{ fontSize: 12, color: "rgba(244,237,227,0.18)", fontFamily: "system-ui", textAlign: "center" }}>© 2024 Aurum — Maison de Joaillerie Paris</p>
        </div>
      </footer>
    </div>
  )
}
