"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, MapPin, TrendingUp, Building, Users, Award, ChevronRight, Mail, Phone } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-blueprint"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const PROJECTS = [
  { name: "Résidence Le Marais", type: "Résidentiel prestige", location: "Paris 4e", size: "42 appartements", status: "Livraison 2026", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", progress: 78 },
  { name: "Tour Verre & Acier", type: "Bureau premium", location: "La Défense", size: "18 000 m²", status: "En cours", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", progress: 45 },
  { name: "Domaine Bois-Fleuri", type: "Résidentiel luxe", location: "Neuilly-sur-Seine", size: "8 villas", status: "Livraison 2025", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80", progress: 92 },
  { name: "Le Carré Saint-Cloud", type: "Mixte", location: "Saint-Cloud", size: "120 logements + commerces", status: "Permis obtenu", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80", progress: 20 },
  { name: "Athéna Bureaux", type: "Tertiaire", location: "Paris 8e", size: "6 500 m²", status: "Livré 2024", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", progress: 100 },
  { name: "Villeneuve Parc", type: "Résidentiel senior", location: "Lyon", size: "96 logements", status: "En cours", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", progress: 60 },
]

const TEAM = [
  { name: "Édouard Marchand", title: "Président Directeur Général", exp: "32 ans d'expérience", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Sophie Renault", title: "Directrice de programmes", exp: "18 ans d'expérience", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Luc Vigneron", title: "Directeur financier", exp: "24 ans d'expérience", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
]

export default function BlueprintPage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1A1612]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#C9A86C] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F7F5F2]/95 backdrop-blur-md border-b border-[#E0D8CC]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#" className="flex flex-col">
            <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A86C]">Développements Immobiliers</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-light text-[#6B5A40]">
            {["Programmes", "Réalisations", "L'entreprise", "Investisseurs", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase().replace("l'", "").replace(/ /g, "-")}`} className="hover:text-[#1A1612] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#contact" className="ml-2 px-5 py-2.5 bg-[#1A1612] text-[#F7F5F2] text-xs tracking-widest uppercase hover:bg-[#C9A86C] transition-colors duration-300 cursor-pointer">
              Nous contacter
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#1A1612] text-[#F7F5F2] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3020]">
              <span style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Programmes", "Réalisations", "L'entreprise", "Investisseurs", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1600&q=85" alt="Blueprint Developments" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1612]/90 via-[#1A1612]/60 to-[#1A1612]/10" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 min-h-screen flex flex-col justify-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86C] mb-8">Promoteur immobilier — Fondé en 1989</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-normal text-[#F7F5F2] leading-[1.0] mb-8 max-w-3xl" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Construire<br /><em>l&apos;excellence</em><br />durable
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#C8B89A] text-lg max-w-lg mb-12 leading-relaxed">
              Depuis 35 ans, Blueprint réalise des programmes immobiliers d&apos;exception. Résidentiel haut de gamme, bureaux premium, opérations mixtes — nous concevons des lieux qui durent.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="#programmes" className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A86C] text-[#1A1612] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                Nos programmes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#investisseurs" className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C]/50 text-[#F7F5F2] font-light text-sm tracking-wide uppercase hover:border-[#C9A86C] transition-colors cursor-pointer">
                Espace investisseurs
              </Link>
            </div>
          </Reveal>
          <div className="mt-20 pt-10 border-t border-[#3A3020] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["35 ans", "D'expérience"], ["4 200+", "Logements livrés"], ["2,4 Md€", "Volume réalisé"], ["A+", "Notation ESG"]].map(([val, label]) => (
              <Reveal key={label} delay={0.05}>
                <div>
                  <div className="text-[#C9A86C] text-2xl font-light mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{val}</div>
                  <div className="text-xs text-[#8A7860] uppercase tracking-wide">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programmes" className="py-28 bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Programmes en cours</p>
              <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Nos <em>réalisations</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="#réalisations" className="text-sm text-[#C9A86C] flex items-center gap-2 hover:gap-4 transition-all cursor-pointer">
                Voir toutes nos réalisations <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.name} delay={i * 0.08}>
                <div className="group cursor-pointer" onMouseEnter={() => setActiveProject(i)} onMouseLeave={() => setActiveProject(null)}>
                  <div className="relative overflow-hidden aspect-[4/3] mb-5">
                    <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#1A1612]/30 group-hover:bg-[#1A1612]/10 transition-all duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#C9A86C] text-[#1A1612] text-[10px] tracking-widest uppercase px-2.5 py-1">{project.status}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl font-normal mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{project.name}</h3>
                    <p className="text-sm text-[#C9A86C] mb-1">{project.type}</p>
                    <p className="text-sm text-[#6B5A40] flex items-center gap-1.5"><MapPin className="w-3 h-3" />{project.location} · {project.size}</p>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-[#8A7860] mb-2">
                      <span>Avancement</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1 bg-[#E0D8CC] rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#C9A86C] rounded-full"
                        initial={{ width: 0 }} whileInView={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About / Enterprise */}
      <section id="lentreprise" className="py-28 bg-[#1A1612] text-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Notre ADN</p>
              <h2 className="text-4xl md:text-5xl font-normal leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                35 ans de<br /><em>savoir-faire</em><br />institutionnel
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#8A7860] leading-relaxed mb-6">
                Blueprint a été fondé en 1989 par Édouard Marchand avec une conviction : le développement immobilier de qualité ne se résume pas à construire des murs. Il s&apos;agit de créer des lieux de vie, de travail, de rencontre.
              </p>
              <p className="text-[#8A7860] leading-relaxed">
                Cette vision nous a conduit à développer une expertise multidisciplinaire : architecture, ingénierie, environnement, finance. Chaque programme Blueprint est une réponse globale à des besoins spécifiques.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-[#3A3020]">
            {[{ Icon: Building, title: "Architecture durable", desc: "Certifications HQE, BREEAM et E+C- sur tous nos programmes depuis 2018." }, { Icon: Users, title: "Engagement humain", desc: "Concertation systématique avec riverains et collectivités avant chaque projet." }, { Icon: TrendingUp, title: "Performance financière", desc: "18 ans de rendement continu pour nos partenaires institutionnels." }, { Icon: Award, title: "Excellence reconnue", desc: "Prix de l'Immobilier Durable 2023, Trophée Constructeur 2022." }].map((p, i) => {
              const Icon = p.Icon
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="bg-[#1A1612] p-8 group hover:bg-[#231E14] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#C9A86C] mb-6" />
                    <h3 className="text-lg font-normal mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>{p.title}</h3>
                    <p className="text-sm text-[#6A6058] leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-28 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Direction</p>
            <h2 className="text-4xl md:text-5xl font-normal mb-14" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Notre <em>équipe dirigeante</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden mb-6">
                    <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C9A86C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-normal mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>{member.name}</h3>
                  <p className="text-sm text-[#C9A86C] mb-1">{member.title}</p>
                  <p className="text-xs text-[#8A7860]">{member.exp}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investisseurs" className="py-28 bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Espace investisseurs</p>
                <h2 className="text-4xl md:text-5xl font-normal leading-tight mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Investir dans<br />l&apos;immobilier<br /><em>d&apos;exception</em>
                </h2>
                <p className="text-[#6B5A40] leading-relaxed mb-10">
                  Blueprint propose des opportunités d&apos;investissement à des partenaires institutionnels et familles d&apos;investisseurs. Nos programmes présentent des caractéristiques de risque maîtrisées et des perspectives de rendement attractives.
                </p>
                <div className="space-y-4 mb-10">
                  {[["Rendement net annualisé", "6,2% – 8,5%"], ["Horizon d'investissement", "24 – 60 mois"], ["Ticket minimum", "200 000 €"], ["Structures disponibles", "Club Deal, SCPI, Foncière"]].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[#E0D8CC]">
                      <span className="text-sm text-[#6B5A40]">{label}</span>
                      <span className="text-sm font-medium text-[#1A1612]">{value}</span>
                    </div>
                  ))}
                </div>
                <Link href="#contact" className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A86C] text-[#1A1612] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                  Contacter notre équipe <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Investissement" fill className="object-cover" />
                <div className="absolute bottom-6 right-6 bg-[#C9A86C] text-[#1A1612] p-6">
                  <div className="text-3xl font-normal mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Aa</div>
                  <div className="text-xs uppercase tracking-wide">Notation Moody&apos;s</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-[#1A1612] text-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Contact</p>
                <h2 className="text-4xl md:text-5xl font-normal leading-tight mb-8" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Parlons de<br />votre <em>projet</em>
                </h2>
                <p className="text-[#8A7860] leading-relaxed mb-10">
                  Qu&apos;il s&apos;agisse d&apos;un projet de développement, d&apos;une opportunité foncière ou d&apos;une démarche d&apos;investissement, notre équipe vous répondra sous 48 heures.
                </p>
                <div className="space-y-5">
                  {[{ Icon: MapPin, text: "8 avenue Hoche, 75008 Paris" }, { Icon: Phone, text: "+33 1 44 15 62 00" }, { Icon: Mail, text: "contact@blueprint-dev.fr" }].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm text-[#8A7860]">
                      <Icon className="w-4 h-4 text-[#C9A86C] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  {["Prénom", "Nom"].map(f => (
                    <div key={f}>
                      <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">{f}</label>
                      <input className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F7F5F2] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                {[["Société", "text", "Votre société"], ["Email", "email", "contact@societe.fr"], ["Téléphone", "tel", "+33..."]].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">{label}</label>
                    <input type={type} className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F7F5F2] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">Objet de la demande</label>
                  <select className="w-full bg-[#231E14] border border-[#3A3020] px-4 py-3 text-sm text-[#F7F5F2] focus:outline-none focus:border-[#C9A86C] transition-colors">
                    <option>Projet de développement</option>
                    <option>Opportunité foncière</option>
                    <option>Investissement</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5A5040] mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-transparent border border-[#3A3020] px-4 py-3 text-sm text-[#F7F5F2] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Décrivez votre projet ou votre demande..." />
                </div>
                <button type="submit" className="w-full bg-[#C9A86C] text-[#1A1612] py-4 text-xs tracking-widest uppercase font-medium hover:bg-[#E0BC70] transition-colors duration-300 cursor-pointer">
                  Envoyer le message
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0A06] text-[#5A5040] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="text-[#F7F5F2] font-normal text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint Developments</div>
              <div className="text-xs text-[#C9A86C] tracking-widest uppercase mb-4">Promoteur Immobilier depuis 1989</div>
              <p className="text-sm leading-relaxed max-w-xs">Conception, réalisation et valorisation de programmes immobiliers d&apos;exception en France et en Europe.</p>
            </div>
            <div>
              <p className="text-[#F7F5F2] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {["Programmes", "Réalisations", "L'entreprise", "Investisseurs", "Contact"].map(l => (
                <Link key={l} href={`#${l.toLowerCase()}`} className="block text-sm hover:text-[#F7F5F2] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#F7F5F2] text-xs tracking-widest uppercase mb-5">Siège social</p>
              <p className="text-sm mb-2">8 avenue Hoche</p>
              <p className="text-sm mb-2">75008 Paris, France</p>
              <p className="text-sm mb-4">+33 1 44 15 62 00</p>
              <p className="text-xs text-[#C9A86C]">SIREN : 342 789 001 · RCS Paris</p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2A1E12] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Blueprint Developments — Tous droits réservés</span>
            <div className="flex gap-6">
              {["Mentions légales", "Politique de confidentialité", "Données personnelles"].map(l => (
                <Link key={l} href="#" className="hover:text-[#F7F5F2] transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
