// @ts-nocheck
"use client"

import { motion, useScroll } from "framer-motion"
import { useEffect, useState } from "react"
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

const SERVICES = [
  { title: "Portraits & Éditorial", desc: "Portraits intimes et éditoriaux pour magazines, agences et particuliers. Studio ou extérieur.", from: "600€" },
  { title: "Campagnes Mode", desc: "Direction artistique et photographie pour collections et lookbooks. Équipe complète sur demande.", from: "2 400€" },
  { title: "Reportage Événementiel", desc: "Mariage, lancement produit, conférence. Documentation professionnelle haute définition.", from: "900€" },
  { title: "Architecture & Intérieur", desc: "Valorisation de projets architecturaux et d'espaces de vie. Post-production cinématographique.", from: "1 200€" },
]

export default function ServicesPage() {
  useFonts()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollYProgress } = useScroll()

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
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${item.name === "Services" ? "text-[#C9A86C] font-bold" : ""}`}
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
                      className={`text-2xl hover:text-[#C9A86C] transition-colors ${item.name === "Services" ? "text-[#C9A86C] font-bold" : "text-white/60"}`}
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
        <section className="py-24 px-6 bg-[#0E0B08]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Prestations</span>
              <h1 className="text-5xl md:text-7xl font-light leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Services & Tarifs</h1>
              <p className="max-w-xl mx-auto text-white/50 text-sm font-sans font-light">
                Une approche sur mesure pour chaque projet photographique, de la direction artistique préliminaire au tirage d'exposition.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-24">
              {SERVICES.map((s, i) => (
                <div key={s.title} className="bg-[#131008] border border-white/5 rounded-3xl p-8 hover:border-[#C9A86C]/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-6 border-b border-white/5 pb-4">
                      <h3 className="text-white text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                      <span className="text-[#C9A86C] text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dès {s.from}</span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed mb-8 font-sans">
                      {s.desc} Comprend la sélection des clichés sur planche contact numérique, le travail d'étalonnage colorimétrique complet et la retouche fine des fichiers haute définition.
                    </p>
                  </div>
                  <Link href="/templates/impact-16/propos" className="w-full text-center block py-4 border border-[#C9A86C]/30 hover:border-[#C9A86C] text-[#C9A86C] hover:text-black hover:bg-[#C9A86C] rounded-xl text-xs tracking-widest uppercase transition-all font-mono">
                    Demander un Devis
                  </Link>
                </div>
              ))}
            </div>

            <div className="border border-[#C9A86C]/20 bg-[#C9A86C]/5 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Matériel & Tirages d'Art</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans mb-0">
                 Chaque prise de vue est réalisée avec des boîtiers Leica M11 numériques et des chambres moyen format argentiques Hasselblad. Nous collaborons avec des laboratoires parisiens de confiance pour réaliser des tirages d'exposition haut de gamme sur papiers fine art certifiés Hahnemühle.
              </p>
            </div>
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
