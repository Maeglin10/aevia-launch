"use client";
// @ts-nocheck

import { motion, useScroll, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("obs-fonts")) return
    const s = document.createElement("style")
    s.id = "obs-fonts"
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Grotesk:wght@400;500&display=swap');`
    document.head.appendChild(s)
  }, [])
}

const CATEGORIES = ["Tous", "Portrait", "Mode", "Reportage", "Architecture", "Nature"]

const WORKS = [
  { title: "La Lumière de Minuit", category: "Portrait", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", year: "2025" },
  { title: "Couture Invisible", category: "Mode", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", year: "2025" },
  { title: "Mémoire des Rues", category: "Reportage", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", year: "2024" },
  { title: "Béton & Lumière", category: "Architecture", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", year: "2024" },
  { title: "Femme en Avant", category: "Mode", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", year: "2025" },
  { title: "Le Temps Suspendu", category: "Portrait", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", year: "2023" },
]

export default function PortfolioPage() {
  useFonts()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Tous")
  const { scrollYProgress } = useScroll()

  const filteredWorks = activeCategory === "Tous" ? WORKS : WORKS.filter(w => w.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#0A0806] text-white selection:bg-[#C9A86C]/20 selection:text-[#C9A86C] overflow-x-clip" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0A0806]/90 backdrop-blur-md border border-[#C9A86C]/15 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
          <Link href="/templates/impact-16" className="text-[#C9A86C] tracking-widest cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>
            Obscura
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/40 text-sm">
            {[
              { name: "Portfolio", href: "/templates/impact-16/portfolio" },
              { name: "Services", href: "/templates/impact-16/services" },
              { name: "À propos", href: "/templates/impact-16/propos" }
            ].map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${item.name === "Portfolio" ? "text-[#C9A86C] font-bold" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/templates/impact-16/services" className="hidden md:inline-flex border border-[#C9A86C]/30 text-[#C9A86C] text-xs px-5 py-2.5 rounded-xl hover:bg-[#C9A86C] hover:text-black transition-all cursor-pointer tracking-wide uppercase font-medium">
            Réserver
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden text-white cursor-pointer"><Menu className="w-5 h-5" /></SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0806] border-[#C9A86C]/10 text-white p-8">
               <div className="flex items-center justify-between mb-12">
                  <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Obscura</span>
               </div>
               <div className="flex flex-col gap-6 font-medium">
                  {[
                    { name: "Accueil", href: "/templates/impact-16" },
                    { name: "Portfolio", href: "/templates/impact-16/portfolio" },
                    { name: "Services", href: "/templates/impact-16/services" },
                    { name: "À propos", href: "/templates/impact-16/propos" },
                    { name: "Mentions Légales", href: "/templates/impact-16/legal" }
                  ].map(item => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setMobileOpen(false)}
                      className={`text-2xl hover:text-[#C9A86C] transition-colors ${item.name === "Portfolio" ? "text-[#C9A86C] font-bold" : "text-white/60"}`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {item.name}
                    </Link>
                  ))}
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main className="pt-32">
        <section id="realisations" className="py-24 px-6 bg-[#0A0806]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Galerie</span>
              <h1 className="text-5xl md:text-7xl font-light leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Portfolio</h1>
              <p className="max-w-xl mx-auto text-white/50 text-sm font-sans font-light mb-10">
                Parcourez nos séries photographiques argentiques et numériques. Chaque cliché témoigne d'une recherche sur l'ombre, la géométrie des espaces et la sincérité du sujet.
              </p>

              <div className="flex gap-2 flex-wrap justify-center mt-10">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all cursor-pointer rounded-lg border font-mono ${activeCategory === cat ? "bg-[#C9A86C] text-black border-[#C9A86C] shadow-md shadow-[#C9A86C]/10" : "border-white/10 text-white/40 hover:border-[#C9A86C]/40"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <motion.div layout className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
              <AnimatePresence>
                {filteredWorks.map((w, i) => (
                  <motion.div 
                    key={w.title} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    transition={{ duration: 0.4, delay: i * 0.05 }} 
                    className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid border border-white/5 bg-[#0e0b09]"
                  >
                    <div className="relative aspect-[3/4] w-full">
                      <Image src={w.src} alt={w.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 filter grayscale group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[#C9A86C] text-xs tracking-widest uppercase font-mono">{w.category} · {w.year}</span>
                        <p className="text-white text-xl mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{w.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#060402] border-t border-white/5 py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20 font-mono">
          <span className="text-[#C9A86C]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>Obscura · Photographe Paris</span>
          <div className="flex gap-6">
            <Link href="/templates/impact-16/legal" className="hover:text-[#C9A86C] transition-colors">Mentions légales</Link>
            <Link href="/templates/impact-16/legal" className="hover:text-[#C9A86C] transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
