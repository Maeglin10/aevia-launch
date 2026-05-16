"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Sparkles, FlaskConical, Shield, Microscope, Clock, MapPin, Phone, Mail, ChevronRight, CheckCircle } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-cypher-clinic"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');`
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

const PROTOCOLS = [
  { id: "sculpt", icon: Sparkles, label: "Sculpture faciale", title: "Redéfinition volumétrique avancée", desc: "Protocole combinant acide hyaluronique rhéologique, toxine botulique graduée et micro-canules de précision pour un remodelage facial complet aux résultats naturels et durables.", duration: "90 min", recovery: "48h", detail: ["Remodelage mandibulaire", "Restauration pommettes", "Correction cernes", "Redéfinition ovale"] },
  { id: "bio", icon: FlaskConical, label: "Bioregénération", desc: "Protocole de régénération cellulaire profonde : PRP autologue, polynucléotides PDRN et mésothérapie à base de vitamines liposomales. Amélioration mesurable de la qualité cutanée.", title: "Régénération cellulaire de quatrième génération", duration: "75 min", recovery: "24h", detail: ["PRP lymphocytaire", "Polynucléotides PDRN", "Vitamines liposomales", "Enzyme complex"] },
  { id: "laser", icon: Microscope, label: "Lasers médicaux", title: "Photothérapie et resurfaçage de précision", desc: "Gamme Quanta System Q-YAG 5 et CO2 fractionné Acupulse. Traitement des lésions pigmentaires, rosacée, cicatrices et resurfaçage anti-âge avec résultats permanents.", duration: "45 – 90 min", recovery: "3 – 7 jours", detail: ["Q-switched Nd:YAG", "CO2 fractionné", "IPL M22 Lumenis", "LLLT biostimulation"] },
  { id: "cyber", icon: Shield, label: "CypherSkin", title: "Notre protocole signature exclusif", desc: "Développé en 2021 avec l&apos;Institut de Biochimie de Paris, CypherSkin combine 6 technologies en une séance pour obtenir des résultats visibles dès J+7 et durables 18 mois.", duration: "120 min", recovery: "72h", detail: ["Radiofréquence fractionnée", "Ultrasons focalisés", "LED thérapeutique", "Cryolifting"] },
]

const SPECIALISTS = [
  { name: "Dr. Alexandre Noir", spec: "Médecine esthétique & Lasers", formation: "Interne médecine — AP-HP · DU Médecine esthétique Paris VI", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" },
  { name: "Dr. Valentine Huang", spec: "Dermatologue spécialisée", formation: "DES Dermatologie — Paris V · Fellowship IMCAS Singapore", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
  { name: "Dr. Marc Duval", spec: "Chirurgien plasticien", formation: "DESC Chirurgie plastique — Pitié-Salpêtrière · FMH Lausanne", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
]

export default function CypherClinicPage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeProtocol, setActiveProtocol] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ActiveIcon = PROTOCOLS[activeProtocol].icon

  return (
    <div className="min-h-screen bg-[#0C0C0A] text-[#F0EBE0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[1px] bg-[#C9A86C] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0C0C0A]/95 backdrop-blur-md border-b border-[#2A2520]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#" className="flex flex-col">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Bodoni Moda', serif", letterSpacing: "0.12em" }}>Cypher Clinic</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A86C]">Médecine esthétique d&apos;élite</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#8A8278]">
            {["Protocoles", "Équipe", "Science", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#F0EBE0] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#contact" className="ml-2 px-5 py-2.5 border border-[#C9A86C] text-[#C9A86C] text-xs tracking-widest uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
              Consultation
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
          <motion.div className="fixed inset-0 z-[200] bg-[#0C0C0A] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2520]">
              <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-xl">Cypher Clinic</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Protocoles", "Équipe", "Science", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light text-[#F0EBE0] hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Bodoni Moda', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85" alt="Cypher Clinic" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/95 via-[#0C0C0A]/70 to-[#0C0C0A]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 min-h-screen flex flex-col justify-center">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Médecine esthétique de précision · Paris 16e</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.0] mb-8 max-w-3xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              La beauté<br />par la <em>science</em><br />de précision
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8A8278] text-lg max-w-lg mb-12 leading-relaxed">
              Cypher Clinic réunit chirurgiens plasticiens, dermatologues et médecins esthétiques autour de protocoles exclusifs développés avec des chercheurs universitaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="#contact" className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all cursor-pointer">
                Consultation médicale <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#protocoles" className="inline-flex items-center gap-3 px-8 py-4 border border-[#2A2520] text-[#F0EBE0] text-sm uppercase tracking-widest hover:border-[#F0EBE0] transition-colors cursor-pointer">
                Nos protocoles
              </Link>
            </div>
          </Reveal>
          <div className="mt-20 pt-10 border-t border-[#2A2520] grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["3 experts", "Spécialistes"], ["CypherSkin™", "Protocole exclusif"], ["98%", "Satisfaction"], ["12 ans", "D'expertise"]].map(([val, label]) => (
              <Reveal key={label} delay={0.05}>
                <div>
                  <div className="text-[#C9A86C] text-xl font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{val}</div>
                  <div className="text-xs text-[#5A5248] uppercase tracking-wide">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section id="protocoles" className="py-28 bg-[#0C0C0A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Expertise médicale</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                Protocoles de <em>référence</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-5 gap-0 border border-[#2A2520]">
            <div className="lg:col-span-2 border-r border-[#2A2520]">
              {PROTOCOLS.map((p, i) => {
                const Icon = p.icon
                return (
                  <button key={p.id} onClick={() => setActiveProtocol(i)}
                    className={`w-full text-left p-6 border-b border-[#2A2520] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${activeProtocol === i ? "bg-[#1A1714]" : "hover:bg-[#141210]"}`}>
                    <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 ${activeProtocol === i ? "border-[#C9A86C] text-[#C9A86C]" : "border-[#2A2520] text-[#5A5248]"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-light ${activeProtocol === i ? "text-[#C9A86C]" : "text-[#8A8278]"}`}>{p.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={activeProtocol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                  className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 border border-[#C9A86C] flex items-center justify-center">
                      <ActiveIcon className="w-6 h-6 text-[#C9A86C]" />
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{PROTOCOLS[activeProtocol].duration}</span>
                      <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5">Reprise : {PROTOCOLS[activeProtocol].recovery}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{PROTOCOLS[activeProtocol].title}</h3>
                  <p className="text-[#6A6058] leading-relaxed mb-8">{PROTOCOLS[activeProtocol].desc}</p>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A86C] mb-4">Technologies utilisées</p>
                    {PROTOCOLS[activeProtocol].detail.map(d => (
                      <div key={d} className="flex items-center gap-3 text-sm py-2 border-b border-[#1A1714]">
                        <div className="w-4 h-[1px] bg-[#C9A86C]" />
                        <span className="text-[#8A8278]">{d}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#contact" className="mt-8 inline-flex items-center gap-2 text-xs text-[#C9A86C] border-b border-[#C9A86C] pb-0.5 hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer uppercase tracking-widest">
                    Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section id="équipe" className="py-28 bg-[#141210]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;équipe médicale</p>
            <h2 className="text-4xl md:text-5xl font-light mb-14" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Nos <em>spécialistes</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
            {SPECIALISTS.map((spec, i) => (
              <Reveal key={spec.name} delay={i * 0.1}>
                <div className="bg-[#141210] group cursor-pointer p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={spec.image} alt={spec.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{spec.name}</h3>
                    <p className="text-[#C9A86C] text-xs tracking-wide uppercase mb-3">{spec.spec}</p>
                    <p className="text-xs text-[#5A5248] leading-relaxed">{spec.formation}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Science */}
      <section id="science" className="py-28 bg-[#0C0C0A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Notre approche</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                La médecine<br />esthétique fondée<br />sur les <em>preuves</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#6A6058] leading-relaxed mb-6">
                Cypher Clinic a établi des partenariats formels avec l&apos;Institut de Biochimie de l&apos;Université Paris-Saclay et le laboratoire de dermatologie computationnelle de l&apos;INSERM.
              </p>
              <p className="text-[#6A6058] leading-relaxed">
                Tous nos protocoles sont évalués selon des indicateurs objectifs : analyse 3D de la peau, mesure de l&apos;élasticité dermique, photographie standardisée à 6 mois. Nous publions nos résultats.
              </p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
            {[{ title: "Protocole CypherSkin™", stat: "J+7", desc: "Résultats visibles dès 7 jours" }, { title: "Acide hyaluronique", stat: "+18 mois", desc: "Durée moyenne observée en clinique" }, { title: "Satisfaction globale", stat: "98%", desc: "Sur 1 200 patients suivis 2020–2024" }].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="bg-[#0C0C0A] p-10 text-center">
                  <div className="text-4xl font-light text-[#C9A86C] mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.stat}</div>
                  <div className="text-xs text-[#8A8278] mb-1">{s.desc}</div>
                  <div className="text-[10px] text-[#3A3028] uppercase tracking-widest mt-3">{s.title}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#141210]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4 text-center">Retours patients</p>
            <h2 className="text-3xl font-light text-center mb-14" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Des résultats qui <em>parlent</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
            {[
              { name: "C. M.", age: "44 ans", protocol: "Sculpture faciale", text: "Résultat d'une naturalité absolue. Mon entourage me demande si j'ai changé de coupe. C'est exactement ce que je souhaitais." },
              { name: "S. T.", age: "38 ans", protocol: "CypherSkin™", text: "Après 3 séances de lasers et 2 CypherSkin, ma peau a une texture que je n'avais pas à 25 ans. Protocole rigoureux, équipe exceptionnelle." },
              { name: "E. B.", age: "51 ans", protocol: "Bioregénération", text: "La qualité du suivi est remarquable. Chaque séance commence par une analyse objective. On voit les résultats se construire.", },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="bg-[#141210] p-8">
                  <p className="text-[#6A6058] leading-relaxed mb-6 italic" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "16px" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="text-sm text-[#C9A86C]">{t.name} · {t.age}</div>
                  <div className="text-xs text-[#3A3028] mt-0.5">{t.protocol}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-[#0C0C0A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Consultation</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  Commencez votre<br /><em>parcours</em>
                </h2>
                <p className="text-[#6A6058] leading-relaxed mb-10">
                  Toute prise en charge débute par une consultation médicale de 45 minutes. Bilan complet, diagnostic objectif, proposition de protocole personnalisé. Aucun geste sans accord éclairé.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-5">
                  {[{ Icon: MapPin, text: "8 avenue Foch, 75116 Paris" }, { Icon: Phone, text: "+33 1 45 01 82 00" }, { Icon: Mail, text: "rdv@cypherclinic.fr" }, { Icon: Clock, text: "Lun–Sam : 9h – 19h" }].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm text-[#6A6058]">
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
                      <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{f}</label>
                      <input className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                {[["Email", "email", "votre@email.fr"], ["Téléphone", "tel", "+33 6..."]].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{label}</label>
                    <input type={type} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Protocole d&apos;intérêt</label>
                  <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                    <option>Consultation initiale (bilan complet)</option>
                    {PROTOCOLS.map(p => <option key={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Message</label>
                  <textarea rows={3} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Décrivez votre demande..." />
                </div>
                <button type="submit" className="w-full border border-[#C9A86C] text-[#C9A86C] py-4 text-xs tracking-widests uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                  Demander une consultation
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080806] border-t border-[#1A1714] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <div className="text-[#F0EBE0] text-xl font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>Cypher Clinic</div>
            <div className="text-[10px] text-[#C9A86C] tracking-widests uppercase mb-4">Médecine esthétique d&apos;élite · Paris</div>
            <p className="text-xs text-[#3A3028] max-w-xs">8 avenue Foch, 75116 Paris · Praticiens inscrits à l&apos;Ordre National des Médecins</p>
          </div>
          <div className="flex flex-wrap gap-8 text-xs text-[#3A3028]">
            {["Protocoles", "Équipe", "Science", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#F0EBE0] transition-colors cursor-pointer">{l}</Link>
            ))}
          </div>
          <div className="text-xs text-[#3A3028]">
            <p>© 2024 Cypher Clinic</p>
            <p className="mt-1">Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
