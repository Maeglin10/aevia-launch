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
            <Link href="/templates/impact-11/cours" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"tarifs" === "cours" ? "text-[#7C3AED] font-bold" : ""}`}>Cours</Link>
// @ts-ignore
            <Link href="/templates/impact-11/mentoring" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"tarifs" === "mentoring" ? "text-[#7C3AED] font-bold" : ""}`}>Mentoring</Link>
// @ts-ignore
            <Link href="/templates/impact-11/tarifs" className={`hover:text-[#7C3AED] transition-colors cursor-pointer ${"tarifs" === "tarifs" ? "text-[#7C3AED] font-bold" : ""}`}>Tarifs</Link>
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
                  <Link href="/templates/impact-11/cours" className={`text-xl hover:text-[#7C3AED] transition-colors ${"tarifs" === "cours" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Cours</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/mentoring" className={`text-xl hover:text-[#7C3AED] transition-colors ${"tarifs" === "mentoring" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Mentoring</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/tarifs" className={`text-xl hover:text-[#7C3AED] transition-colors ${"tarifs" === "tarifs" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Tarifs</Link>
// @ts-ignore
                  <Link href="/templates/impact-11/legal" className={`text-xl hover:text-[#7C3AED] transition-colors ${"tarifs" === "legal" ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>Mentions Légales</Link>
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