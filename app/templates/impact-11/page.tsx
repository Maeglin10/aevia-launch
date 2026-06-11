// @ts-nocheck
"use client"

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Users, Star, Play, ChevronRight, Menu, X, ArrowRight, Clock, Award, BarChart2, Globe, CheckCircle, HelpCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("edu-fonts")) return
    const s = document.createElement("style")
    s.id = "edu-fonts"
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`
    document.head.appendChild(s)
  }, [])
}

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  )
}

const COURSES = [
  { title: "Data Science & IA", level: "Intermédiaire", duration: "48h", students: "12 400", rating: 4.9, price: "199€", tag: "Populaire", color: "#7C3AED", category: "Données" },
  { title: "UX Design System", level: "Débutant", duration: "32h", students: "8 200", rating: 4.8, price: "149€", tag: "Nouveau", color: "#0EA5E9", category: "Design" },
  { title: "Full-Stack React/Node", level: "Avancé", duration: "64h", students: "9 800", rating: 4.9, price: "249€", tag: "Bestseller", color: "#10B981", category: "Tech" },
  { title: "Marketing Digital", level: "Débutant", duration: "24h", students: "15 600", rating: 4.7, price: "99€", tag: "Certifiant", color: "#F59E0B", category: "Business" },
]

const CATEGORIES = ["Tous", "Tech", "Design", "Business", "Données", "Créativité"]

const FEATURES = [
  { icon: <BookOpen className="w-6 h-6" />, title: "500+ cours", desc: "Bibliothèque complète mise à jour chaque semaine" },
  { icon: <Users className="w-6 h-6" />, title: "1:1 Mentoring", desc: "Accès illimité à des mentors experts de l'industrie" },
  { icon: <Award className="w-6 h-6" />, title: "Certifications", desc: "Diplômes reconnus par 200+ entreprises partenaires" },
  { icon: <Globe className="w-6 h-6" />, title: "Communauté", desc: "Réseau de 250 000 apprenants dans 40 pays" },
]

const INSTRUCTORS = [
  { name: "Dr. Lucas Martin", specialty: "Data Science & ML", courses: 12, students: "42k", rating: 4.9, bio: "Ancien chercheur en IA chez Google, spécialiste de l'apprentissage profond et de l'architecture des réseaux de neurones." },
  { name: "Emma Chartier", specialty: "UX/UI Design", courses: 8, students: "28k", rating: 4.8, bio: "Designer produit Senior passée par Apple et Airbnb. Passionnée d'accessibilité et de design systems évolutifs." },
  { name: "Théo Bernardin", specialty: "Développement Web", courses: 15, students: "61k", rating: 4.9, bio: "Développeur Core dans l'équipe Next.js. Expert en performance web et architectures serverless à haute disponibilité." },
]

const PLANS = [
  { name: "Starter", price: "29", period: "mois", features: ["50 cours inclus", "Projets pratiques", "Forum communauté", "Certificat de suivi"], cta: "Commencer", highlight: false },
  { name: "Pro", price: "79", period: "mois", features: ["Tous les cours", "Mentoring mensuel", "Projets guidés", "Certificats officiels", "Support prioritaire"], cta: "Essai 7 jours gratuit", highlight: true },
  { name: "Équipe", price: "199", period: "mois", features: ["10 sièges inclus", "Dashboard équipe", "Rapports de progression", "Onboarding dédié", "Formateur attitré"], cta: "Contacter l'équipe", highlight: false },
]

type ActivePage = "home" | "cours" | "mentoring" | "tarifs" | "legal"

export default function EduPathPage() {
  useFonts()
  const [page, setPage] = useState<ActivePage>("home")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Tous")

  const goTo = (p: ActivePage) => {
    setPage(p)
    setMobileOpen(false)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }

  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"])

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#7C3AED]/20 selection:text-[#7C3AED]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#7C3AED] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl px-6 py-4 flex items-center justify-between">
          <div onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">EduPath</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm font-medium">
            {[
              { name: "Cours", key: "cours" },
              { name: "Mentoring", key: "mentoring" },
              { name: "Tarifs", key: "tarifs" }
            ].map(item => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${page === item.key ? "text-[#7C3AED] font-bold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => goTo("tarifs")} className="text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Se connecter</button>
            <button onClick={() => goTo("tarifs")} className="bg-[#7C3AED] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6D28D9] transition-colors cursor-pointer font-medium">Commencer</button>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
               <button className="md:hidden text-gray-900 cursor-pointer"><Menu className="w-5 h-5" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-100 p-8">
               <div className="flex items-center gap-2 mb-12">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
                  <span className="text-gray-900 font-bold text-lg">EduPath</span>
               </div>
               <div className="flex flex-col gap-6 font-medium">
                  {[
                    { name: "Accueil", key: "home" },
                    { name: "Cours", key: "cours" },
                    { name: "Mentoring", key: "mentoring" },
                    { name: "Tarifs", key: "tarifs" },
                    { name: "Mentions Légales", key: "legal" }
                  ].map(item => (
                    <a 
                      key={item.key} 
                      href={`#${item.key}`} 
                      onClick={(e) => { e.preventDefault(); goTo(item.key as any); }} 
                      className={`text-xl hover:text-[#7C3AED] transition-colors ${page === item.key ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}
                    >
                      {item.name}
                    </a>
                  ))}
               </div>
            </SheetContent>
         </Sheet>
        </div>
      </nav>

      <main className="pt-24">
        {page === "home" && (
          <>
            {/* Hero */}
            <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF] pt-20 pb-24 px-6">
              <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
                <div className="absolute top-20 right-10 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#0EA5E9]/8 rounded-full blur-3xl" />
              </motion.div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="max-w-3xl">
                  <Reveal>
                    <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
                      <Star className="w-3 h-3 fill-[#7C3AED]" /> Plateforme #1 en France · 250k apprenants
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h1 className="text-gray-900 text-5xl md:text-7xl font-bold leading-tight mb-6">
                      Apprenez les<br />
                      <span className="text-[#7C3AED]">compétences</span><br />
                      de demain
                    </h1>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-xl">
                      Des cours en ligne créés par des experts, des certifications reconnues, et un mentoring personnalisé pour accélérer votre carrière.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => goTo("cours")} className="bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#7C3AED]/20">
                        Commencer gratuitement <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => goTo("mentoring")} className="flex items-center gap-3 text-gray-700 px-6 py-4 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
                        </div>
                        Voir les mentors
                      </button>
                    </div>
                  </Reveal>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-16 max-w-md">
                  {[["250k+", "Apprenants actifs"], ["500+", "Cours disponibles"], ["92%", "Taux d'emploi"]].map(([n, l]) => (
                    <Reveal key={l}>
                      <div className="text-center">
                        <p className="text-gray-900 text-2xl font-bold">{n}</p>
                        <p className="text-gray-400 text-xs mt-1">{l}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-white border-t border-gray-100">
              <div className="max-w-6xl mx-auto">
                <Reveal className="text-center mb-16">
                  <p className="text-[#7C3AED] text-sm font-semibold mb-3">Pourquoi EduPath</p>
                  <h2 className="text-gray-900 text-4xl md:text-5xl font-bold">Tout ce dont vous avez besoin</h2>
                </Reveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FEATURES.map((f, i) => (
                    <Reveal key={f.title} delay={i * 0.1}>
                      <div onClick={() => goTo("cours")} className="bg-gray-50 rounded-2xl p-6 hover:bg-[#7C3AED]/5 transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#7C3AED]/25">
                        <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center text-[#7C3AED] mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">{f.icon}</div>
                        <h3 className="text-gray-900 font-semibold mb-2">{f.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Courses Preview */}
            <section className="py-24 px-6 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                  <div>
                    <p className="text-[#7C3AED] text-sm font-semibold mb-3">Catalogue</p>
                    <h2 className="text-gray-900 text-4xl font-bold">Cours populaires</h2>
                  </div>
                  <button onClick={() => goTo("cours")} className="text-[#7C3AED] text-sm font-bold flex items-center gap-2 hover:underline">
                    Tout le catalogue <ArrowRight className="w-4 h-4" />
                  </button>
                </Reveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {COURSES.map((c, i) => (
                    <Reveal key={c.title} delay={i * 0.08}>
                      <div onClick={() => goTo("cours")} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="h-40 relative overflow-hidden" style={{ background: `${c.color}15` }}>
                          <div className="absolute top-3 left-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ background: c.color }}>{c.tag}</span>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color }}>
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-gray-900 font-semibold mb-2 text-sm">{c.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-semibold text-gray-700">{c.rating}</span>
                            </div>
                            <span className="text-gray-900 font-bold text-sm">{c.price}</span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Instructors Preview */}
            <section className="py-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <Reveal className="flex justify-between items-end mb-12">
                  <div>
                    <p className="text-[#7C3AED] text-sm font-semibold mb-3">Formateurs</p>
                    <h2 className="text-gray-900 text-4xl font-bold">Apprenez des meilleurs</h2>
                  </div>
                  <button onClick={() => goTo("mentoring")} className="text-[#7C3AED] text-sm font-bold flex items-center gap-2 hover:underline">
                    Découvrir nos mentors <ArrowRight className="w-4 h-4" />
                  </button>
                </Reveal>
                <div className="grid md:grid-cols-3 gap-6">
                  {INSTRUCTORS.map((inst, i) => (
                    <Reveal key={inst.name} delay={i * 0.1}>
                      <div onClick={() => goTo("mentoring")} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-150">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#0EA5E9] rounded-2xl mb-4 flex items-center justify-center text-white text-xl font-bold">
                          {inst.name.charAt(4)}
                        </div>
                        <h3 className="text-gray-900 font-semibold mb-1">{inst.name}</h3>
                        <p className="text-[#7C3AED] text-sm mb-4">{inst.specialty}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{inst.courses} cours</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{inst.students} élèves</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{inst.rating}</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {page === "cours" && <CoursPage goTo={goTo} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
        {page === "mentoring" && <MentoringPage />}
        {page === "tarifs" && <TarifsPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div onClick={() => goTo("home")} className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
              <span className="text-white font-bold text-lg">EduPath</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">La plateforme d'apprentissage en ligne pour les professionnels ambitieux.</p>
          </div>
          {[
            { title: "Formation", items: [{ n: "Catalogue", k: "cours" }, { n: "Mentoring", k: "mentoring" }, { n: "Tarifs", k: "tarifs" }] },
            { title: "Ressources", items: [{ n: "Blog", k: "home" }, { n: "Communauté", k: "home" }] },
            { title: "Légal", items: [{ n: "Mentions Légales", k: "legal" }, { n: "Confidentialité", k: "legal" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map(l => <li key={l.n}><a href="#" onClick={(e) => { e.preventDefault(); goTo(l.k as any); }} className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">{l.n}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500">
          <span>© 2026 EduPath. Tous droits réservés.</span>
          <a href="#" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-white transition-colors">Fait avec amour par Aevia WS</a>
        </div>
      </footer>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE COMPONENTS (CLEAN BRIGHT EDUPATH STYLE)
   ========================================================================= */

function CoursPage({ goTo, activeCategory, setActiveCategory }: { goTo: (p: ActivePage) => void, activeCategory: string, setActiveCategory: (c: string) => void }) {
  const filteredCourses = activeCategory === "Tous" ? COURSES : COURSES.filter(c => c.category === activeCategory)

  return (
    <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#7C3AED] text-sm font-semibold mb-3 uppercase tracking-wider block">Formations</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Catalogue des Cours</h1>
          <p className="max-w-xl mx-auto text-gray-500">
            Découvrez nos parcours intensifs conçus pour vous faire maîtriser les métiers de la tech, du design et des données en quelques semaines.
          </p>

          <div className="flex gap-2 flex-wrap justify-center mt-10">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeCategory === cat ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20" : "bg-white text-gray-600 border border-gray-200 hover:border-[#7C3AED]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredCourses.map((c, i) => (
            <div key={c.title} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="h-48 relative overflow-hidden" style={{ background: `${c.color}15` }}>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: c.color }}>{c.tag}</span>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.color }}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 block">{c.category}</span>
                  <h3 className="text-gray-900 font-bold text-xl mb-3">{c.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Maîtrisez les concepts fondamentaux et réalisez des projets concrets avec l'aide de votre mentor personnel.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" />{c.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" />{c.students} élèves</span>
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{c.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Tarif unique</span>
                  <span className="text-gray-900 font-extrabold text-2xl">{c.price}</span>
                </div>
                <button onClick={() => goTo("tarifs")} className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-semibold transition-colors">
                  S'inscrire à la formation
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Financer votre formation</h3>
            <p className="text-gray-600 text-sm max-w-xl">
              EduPath est un organisme certifié Qualiopi. Toutes nos formations longues sont éligibles aux financements CPF, Pôle Emploi, et OPCO.
            </p>
          </div>
          <button onClick={() => goTo("tarifs")} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shadow-md shadow-[#7C3AED]/10">
            Tester mon éligibilité
          </button>
        </div>
      </div>
    </section>
  )
}

function MentoringPage() {
  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#7C3AED] text-sm font-semibold mb-3 uppercase tracking-wider block">Accompagnement</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Mentoring Individuel</h1>
          <p className="max-w-xl mx-auto text-gray-500">
            Ne soyez plus jamais bloqué. Chaque semaine, bénéficiez d'une session privée en visioconférence avec un expert pour valider vos projets et orienter votre carrière.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { title: "Visioconférence 1:1", desc: "Une session de 45 minutes par semaine avec votre mentor attitré pour faire le point, coder en live et poser toutes vos questions." },
            { title: "Revue de code asynchrone", desc: "Soumettez vos projets sur GitHub. Votre mentor relit votre code ligne par ligne et vous donne ses retours sous 24 heures." },
            { title: "Canal Slack Privé", desc: "Un accès permanent à la communauté d'entraide et aux mentors pour débloquer vos bugs du quotidien." }
          ].map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-3xl p-8 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center text-[#7C3AED] mb-6 font-bold">{i + 1}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-10 text-center">Nos formateurs experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {INSTRUCTORS.map((inst, i) => (
              <div key={inst.name} className="border border-gray-100 rounded-3xl p-8 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#0EA5E9] rounded-2xl mb-6 flex items-center justify-center text-white text-2xl font-bold">
                    {inst.name.charAt(4)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{inst.name}</h3>
                  <p className="text-[#7C3AED] text-xs font-semibold mb-4 uppercase tracking-wider">{inst.specialty}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{inst.bio}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{inst.courses} cours</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{inst.students} élèves</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{inst.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TarifsPage() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F5F3FF] to-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#7C3AED] text-sm font-semibold mb-3 uppercase tracking-wider block">Abonnement</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Tarifs simples & transparents</h1>
          <p className="max-w-xl mx-auto text-gray-500">
            Choisissez la formule qui correspond à votre rythme d'apprentissage. Sans engagement, annulation en un clic.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${plan.highlight ? "bg-[#7C3AED] text-white scale-105 shadow-2xl shadow-[#7C3AED]/30" : "bg-white border border-gray-200"}`}>
              <div>
                <h3 className={`font-bold text-2xl mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.price}€</span>
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-gray-400"}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#7C3AED]"}`} />
                      <span className={plan.highlight ? "text-white/90" : "text-gray-600 font-medium"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${plan.highlight ? "bg-white text-[#7C3AED] hover:bg-gray-50" : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-6">
            {[
              { q: "Puis-je utiliser mon CPF pour payer ?", a: "Oui, la majorité de nos formations certifiantes sont éligibles au Compte Personnel de Formation (CPF). Lors de votre inscription, sélectionnez l'option de paiement CPF pour être redirigé vers MonCompteFormation." },
              { q: "Comment fonctionne l'essai gratuit de 7 jours ?", a: "La formule Pro inclut un essai gratuit. Vous pouvez explorer l'ensemble de notre catalogue pendant 7 jours sans être débité. Si le service ne vous convient pas, annulez simplement depuis votre espace membre." },
              { q: "Proposez-vous des tarifs pour les étudiants ou demandeurs d'emploi ?", a: "Oui, nous offrons une réduction de 30% sur toutes nos formules pour les étudiants, alternants et demandeurs d'emploi sur présentation d'un justificatif en cours de validité." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4">
                <HelpCircle className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LegalPage() {
  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-sm leading-relaxed text-gray-600">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Mentions Légales</h1>
        
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-base">Édition & Hébergement</h3>
            <p className="space-y-1">
              <strong>Éditeur :</strong> Aevia WS — Valentin Milliand<br />
              Entrepreneur Individuel<br />
              SIREN : 852 546 225 — RCS Bourg-en-Bresse<br />
              <strong>Email :</strong> contact@aevia.io<br />
              <strong>Adresse :</strong> communiquée sur demande<br />
              <strong>Hébergeur :</strong> Vercel Inc.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#7C3AED] mb-3 text-base">Propriété Intellectuelle</h4>
            <p>
              Le design, l'arborescence, les codes sources, les graphismes, images, vidéos, et l'ensemble des textes originaux présents sur ce site sont la propriété exclusive d'EduPath et de Valentin Milliand. Toute reproduction, traduction, ou distribution non expressément autorisée par écrit préalable fera l'objet de poursuites pénales et civiles.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#7C3AED] mb-3 text-base font-semibold">Qualiopi & Financement</h4>
            <p>
              Les formations EduPath sont dispensées dans le cadre d'un enregistrement d'activité de formation professionnelle certifié Qualiopi. Ce label garantit la conformité de nos processus pédagogiques aux critères du Référentiel National Qualité (RNQ), permettant l'accès aux fonds publics CPF, OPCO et Pôle Emploi.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
