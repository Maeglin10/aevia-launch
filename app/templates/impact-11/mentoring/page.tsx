"use client";
// @ts-nocheck


import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Users, Star, Play, ChevronRight, Menu, X, ArrowRight, Clock, Award, BarChart2, Globe, CheckCircle, HelpCircle, MessageSquare } from "lucide-react"
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

const COURSES = [
  { title: "Data Science & IA", level: "Intermédiaire", duration: "48h", students: "12 400", rating: 4.9, price: "199€", tag: "Populaire", color: "#7C3AED", category: "Données" },
  { title: "UX Design System", level: "Débutant", duration: "32h", students: "8 200", rating: 4.8, price: "149€", tag: "Nouveau", color: "#0EA5E9", category: "Design" },
  { title: "Full-Stack React/Node", level: "Avancé", duration: "64h", students: "9 800", rating: 4.9, price: "249€", tag: "Bestseller", color: "#10B981", category: "Tech" },
  { title: "Marketing Digital", level: "Débutant", duration: "24h", students: "15 600", rating: 4.7, price: "99€", tag: "Certifiant", color: "#F59E0B", category: "Business" },
]

const CATEGORIES = ["Tous", "Tech", "Design", "Business", "Données", "Créativité"]

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

export default function Page() {
  useFonts()
  const [mobileOpen, setMobileOpen] = useState(false)

  const PageContent = () => {
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

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#7C3AED]/20 selection:text-[#7C3AED]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-11" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">EduPath</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm font-medium">
// @ts-ignore
            <Link href="/templates/impact-11/cours" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"mentoring" === "cours" ? "text-[#7C3AED] font-bold" : ""}`}>Cours</Link>
// @ts-ignore
            <Link href="/templates/impact-11/mentoring" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"mentoring" === "mentoring" ? "text-[#7C3AED] font-bold" : ""}`}>Mentoring</Link>
// @ts-ignore
            <Link href="/templates/impact-11/tarifs" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"mentoring" === "tarifs" ? "text-[#7C3AED] font-bold" : ""}`}>Tarifs</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/templates/impact-11/tarifs" className="text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Se connecter</Link>
            <Link href="/templates/impact-11/tarifs" className="bg-[#7C3AED] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#6D28D9] transition-colors cursor-pointer font-medium">Commencer</Link>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden text-gray-900 cursor-pointer"><Menu className="w-5 h-5" /></SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-100 p-8">
               <div className="flex items-center gap-2 mb-12">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
                  <span className="text-gray-900 font-bold text-lg">EduPath</span>
               </div>
               <div className="flex flex-col gap-6 font-medium">
                  <Link href="/templates/impact-11" className="text-xl text-gray-600 hover:text-[#7C3AED] transition-colors">Accueil</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/cours" className={`text-xl hover:text-[#7C3AED] transition-colors ${"mentoring" === "cours" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Cours</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/mentoring" className={`text-xl hover:text-[#7C3AED] transition-colors ${"mentoring" === "mentoring" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Mentoring</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/tarifs" className={`text-xl hover:text-[#7C3AED] transition-colors ${"mentoring" === "tarifs" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Tarifs</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/legal" className={`text-xl hover:text-[#7C3AED] transition-colors ${"mentoring" === "legal" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Mentions Légales</Link>
               </div>
            </SheetContent>
         </Sheet>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <PageContent />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/templates/impact-11" className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
              <span className="text-white font-bold text-lg">EduPath</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">La plateforme d'apprentissage en ligne pour les professionnels ambitieux.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Formation</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-11/cours" className="text-gray-400 text-sm hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/templates/impact-11/mentoring" className="text-gray-400 text-sm hover:text-white transition-colors">Mentoring</Link></li>
              <li><Link href="/templates/impact-11/tarifs" className="text-gray-400 text-sm hover:text-white transition-colors">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Ressources</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-11/blog" className="text-gray-400 text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/templates/impact-11/communaute" className="text-gray-400 text-sm hover:text-white transition-colors">Communauté</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/templates/impact-11/legal" className="text-gray-400 text-sm hover:text-white transition-colors">Mentions Légales</Link></li>
              <li><Link href="/templates/impact-11/confidentialite" className="text-gray-400 text-sm hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500">
          <span>© 2026 EduPath. Tous droits réservés.</span>
          <Link href="/templates/impact-11/legal" className="hover:text-white transition-colors">Fait avec amour par Aevia WS</Link>
        </div>
      </footer>
    </div>
  )
}