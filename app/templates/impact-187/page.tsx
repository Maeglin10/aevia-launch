// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, Target, TrendingUp, Timer, Users, Star, Phone, MapPin, ArrowRight, CheckCircle, Dumbbell, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   MAX PERFORMANCE — Coach sportif personnel (Paris)
   Palette : noir #0a0a0a / orange électrique #f97316 / gris foncé #1a1a1a / blanc cassé #f8f5f0
   Fonts : Anton (titres impact) + Geist (corps)
   Style : énergie, impact, transformation, résultats
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const PROGRAMMES = [
  { icon: Target, title: "Coaching privatif", desc: "Séances 1-on-1, 60 ou 90 minutes. Programme sur mesure selon vos objectifs : perte de poids, prise de masse, endurance, rééducation." },
  { icon: Zap, title: "Bootcamp intensif", desc: "Séances groupe de 4 max, HIIT, circuits training, cardio-renforcement. L'efficacité du collectif avec le suivi du coaching individuel." },
  { icon: TrendingUp, title: "Bilan & suivi mensuel", desc: "Composition corporelle, VO2max, tests force. Tableau de bord personnel, courbes de progression, ajustements de programme chaque mois." },
  { icon: Timer, title: "Nutrition & récupération", desc: "Plan alimentaire personnalisé, macros calculées, supplémentation raisonnée. Protocoles récupération, sommeil, gestion du stress sportif." },
  { icon: Dumbbell, title: "Prépa compétition", desc: "Préparation physique spécifique à votre discipline (run, CrossFit, triathlon, tennis). Périodisation, pic de forme, stratégie de course." },
  { icon: Users, title: "Coaching en ligne", desc: "Programme 100% digital, suivi via app dédiée, vidéos explicatives, check-in hebdo en visio. Pour les voyageurs et profils full remote." },
]

export default function MaxPerformancePage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#f8f5f0] overflow-x-hidden" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0a0a]/97 backdrop-blur-xl py-3 border-b border-[#f97316]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            <span className="font-black text-[#f8f5f0] tracking-widest text-sm uppercase" style={{ fontFamily: "'Anton', impact, sans-serif" }}>MAX<span className="text-[#f97316]">.</span>PERF</span>
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8f5f0]/25">
            {["Programmes", "Méthode", "Résultats", "Tarifs", "Contact"].map(l => (
              <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-[#f97316] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0612345678" className="hidden md:flex items-center gap-2 text-[#f97316] font-bold text-sm">
              <Phone className="w-4 h-4" /> 06 12 34 56 78
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#f97316] text-[#0a0a0a] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#ea650a] transition-colors">
              Séance offerte
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5 text-[#f8f5f0]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#111] border-[#f97316]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Programmes", "Méthode", "Contact"].map(l => <Link key={l} href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-3xl font-black uppercase text-[#f8f5f0] hover:text-[#f97316] transition-colors" style={{ fontFamily: "'Anton', sans-serif" }}>{l}</Link>)}
                  <a href="tel:0612345678" className="flex items-center gap-3 text-[#f97316] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 06 12 34 56 78</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[115vh] min-h-[900px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=88&w=2400" alt="Coach sportif entraînement intense" fill className="object-cover object-center" priority style={{ filter: "brightness(0.3) saturate(0.8)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/75 to-transparent" />
          {/* Orange diagonal accent */}
          <div className="absolute bottom-0 right-0 w-[40%] h-[3px] bg-[#f97316] opacity-60" />
        </motion.div>

        {/* Stats floating card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
          className="absolute right-8 md:right-16 bottom-32 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#f97316]/20 p-5 hidden lg:block">
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f97316]/60 mb-3">En ce moment</div>
          <div className="text-3xl font-black text-[#f97316]" style={{ fontFamily: "'Anton', sans-serif" }}>143</div>
          <div className="text-[10px] text-[#f8f5f0]/30 mt-1">clients transformés en 2026</div>
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[2px] bg-[#f97316]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#f97316]/70">Coach sportif certifié · Paris & Online</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="font-black uppercase leading-none tracking-tight mb-2 text-[#f8f5f0]" style={{ fontFamily: "'Anton', impact, sans-serif", fontSize: "clamp(64px,10vw,120px)" }}>
              STOP
            </h1>
            <h1 className="font-black uppercase leading-none tracking-tight mb-2 text-[#f97316]" style={{ fontFamily: "'Anton', impact, sans-serif", fontSize: "clamp(64px,10vw,120px)" }}>
              WAITING.
            </h1>
            <h1 className="font-black uppercase leading-none tracking-tight mb-10 text-[#f8f5f0]/20" style={{ fontFamily: "'Anton', impact, sans-serif", fontSize: "clamp(32px,4.5vw,56px)" }}>
              Start performing.
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-sm text-sm text-[#f8f5f0]/30 leading-relaxed mb-10">
            Coaching sportif personnalisé à Paris. Perte de poids, prise de masse, prépa trail/triathlon. 1ère séance offerte. Résultats visibles en 4 semaines ou remboursement.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button className="px-9 py-4 bg-[#f97316] text-[#0a0a0a] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#ea650a] transition-colors" style={{ fontFamily: "'Anton', sans-serif" }}>
              1ère séance offerte
            </button>
            <a href="tel:0612345678" className="flex items-center gap-3 px-9 py-4 border border-[#f8f5f0]/10 text-[#f8f5f0]/40 font-bold text-[10px] uppercase tracking-widest hover:border-[#f97316]/40 hover:text-[#f97316] transition-all">
              <Phone className="w-4 h-4" /> 06 12 34 56 78
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-12 bg-gradient-to-b from-[#f97316]/40 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-14 bg-[#1a1a1a] border-y border-[#f97316]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "8 ans", l: "D'expérience" },
            { v: "480+", l: "Clients coachés" },
            { v: "94%", l: "Taux de résultats" },
            { v: "4.9★", l: "Note Google" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-4">
                <div className="text-4xl font-black text-[#f97316] mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>{s.v}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#f8f5f0]/25">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROGRAMMES ── */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#f97316]/60 mb-4">— Mes programmes</div>
              <h2 className="font-black uppercase text-[#f8f5f0]" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(36px,4vw,56px)" }}>
                Ce qu'on fait<br /><span className="text-[#f97316]">ensemble.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROGRAMMES.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-7 border border-[#f8f5f0]/5 hover:border-[#f97316]/30 hover:bg-[#1a1a1a] transition-all duration-500 h-full">
                  <div className="w-10 h-10 bg-[#f97316]/10 flex items-center justify-center mb-5 group-hover:bg-[#f97316] transition-colors duration-500">
                    <p.icon className="w-5 h-5 text-[#f97316] group-hover:text-[#0a0a0a] transition-colors" />
                  </div>
                  <h3 className="font-black uppercase text-[#f8f5f0] mb-3 text-sm group-hover:text-[#f97316] transition-colors" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}>{p.title}</h3>
                  <p className="text-sm text-[#f8f5f0]/25 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ── */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#f97316]/50 mb-4">La méthode</div>
            <h2 className="font-black uppercase text-[#f8f5f0] text-4xl" style={{ fontFamily: "'Anton', sans-serif" }}>4 semaines <span className="text-[#f97316]">pour tout changer.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n: "01", t: "BILAN", d: "Composition corporelle, objectifs, historique, contraintes. On part de la réalité, pas d'une fiction." },
              { n: "02", t: "PROGRAMME", d: "Plan 100% personnalisé. Entraînements, nutrition, récupération. Rien de générique." },
              { n: "03", t: "EXÉCUTION", d: "On s'entraîne. Dur. Mais intelligemment. Progression linéaire, technique irréprochable." },
              { n: "04", t: "RÉSULTATS", d: "Suivi hebdo, ajustements, mesures. Les chiffres ne mentent pas — et ils seront bons." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="bg-[#0a0a0a] border border-[#f8f5f0]/5 p-7 h-full">
                  <div className="font-black text-5xl text-[#f97316]/10 mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>{s.n}</div>
                  <div className="font-black uppercase text-[#f97316] mb-3 text-xs tracking-[0.2em]" style={{ fontFamily: "'Anton', sans-serif" }}>{s.t}</div>
                  <p className="text-sm text-[#f8f5f0]/25 leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMOIGNAGES ── */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#f97316]/50 mb-4">— Résultats clients</div>
            <h2 className="font-black uppercase text-[#f8f5f0] text-4xl" style={{ fontFamily: "'Anton', sans-serif" }}>Ils ont <span className="text-[#f97316]">tout donné.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "J'ai perdu 14kg en 4 mois. Pas de régime miracle — juste de la méthode, de la constance, et un coach qui ne lâche rien. Je suis de retour dans ma vie.", n: "Romain V.", r: "−14kg en 4 mois" },
              { q: "Triathlon terminé pour la première fois à 43 ans. Je n'aurais JAMAIS pensé possible. La prépa avec Maxime a tout changé : technique, mental, nutrition.", n: "Isabelle D.", r: "Premier Ironman 70.3" },
              { q: "Coaching online depuis Dubai. Suivi nickel, programme intelligent, résultats surprenants avec très peu de matériel. Le meilleur investissement santé que j'ai fait.", n: "Karim B.", r: "+8kg de masse / 12 sem." },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-[#f8f5f0]/5 hover:border-[#f97316]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[#f97316] text-[#f97316]" />)}
                  </div>
                  <p className="text-sm text-[#f8f5f0]/30 leading-relaxed flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f8f5f0]/5">
                    <div className="font-bold text-[#f8f5f0] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#f97316] mt-1 font-bold uppercase tracking-wide">{t.r}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-[#f97316]">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-black uppercase text-[#0a0a0a] mb-6" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(40px,5vw,64px)" }}>
              Prêt à vraiment<br />te dépasser ?
            </h2>
            <p className="text-[#0a0a0a]/55 mb-10 text-sm leading-relaxed">1ère séance gratuite · Engagement 0 · Résultats visibles en 4 semaines garantis</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#0a0a0a] text-[#f8f5f0] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#1a1a1a] transition-colors" style={{ fontFamily: "'Anton', sans-serif" }}>
                Séance offerte maintenant
              </button>
              <a href="tel:0612345678" className="flex items-center gap-3 px-10 py-4 border-2 border-[#0a0a0a]/20 text-[#0a0a0a] font-bold text-[10px] uppercase tracking-widest hover:border-[#0a0a0a]/40 transition-all">
                <Phone className="w-4 h-4" /> 06 12 34 56 78
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] pt-16 pb-8 px-6 border-t border-[#f97316]/8">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-black uppercase text-[#f8f5f0] text-sm mb-5" style={{ fontFamily: "'Anton', sans-serif" }}>MAX<span className="text-[#f97316]">.</span>PERF</div>
            <p className="text-[#f8f5f0]/15 text-sm leading-relaxed">Coach sportif certifié BPJEPS. Paris & online worldwide. Coaching privé, bootcamp, prépa compétition.</p>
          </div>
          {[
            { t: "Programmes", ls: ["Coaching privatif", "Bootcamp", "Prépa compétition", "Coaching en ligne", "Nutrition & récup"] },
            { t: "Infos", ls: ["Méthode MAX", "Mon parcours", "Certifications", "Avis clients", "FAQ"] },
            { t: "Contact", ls: ["06 12 34 56 78", "max@maxperf.fr", "Paris 11e", "Online worldwide", "1ère séance offerte"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f97316]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f8f5f0]/15 text-sm hover:text-[#f8f5f0]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#f97316]/6 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-[#f8f5f0]/8">
          <span>© 2026 Max Performance · SIRET 123 456 789 00100 · BPJEPS AF · Paris</span>
          <span className="text-[#f97316]/20">Stop Waiting. Start Performing.</span>
        </div>
      </footer>
    </div>
  )
}
