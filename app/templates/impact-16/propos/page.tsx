"use client";
// @ts-nocheck

import { motion, useScroll } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Mail } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("obs-fonts")) return
    const s = document.createElement("style")
    s.id = "obs-fonts"
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Grotesk:wght@400;500&display=swap');`
    document.head.appendChild(s)
  }, [])
}

const AWARDS = [
  { name: "World Photography Awards", year: "2025", category: "Portrait" },
  { name: "IPA — International Photography Awards", year: "2024", category: "Mode" },
  { name: "Prix Roger-Viollet", year: "2023", category: "Reportage" },
]

const CLIENTS = ["Vogue France", "Le Monde", "LVMH", "Chanel", "Elle", "Air France"]

export default function ProposPage() {
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
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer ${item.name === "À propos" ? "text-[#C9A86C] font-bold" : ""}`}
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
                      className={`text-2xl hover:text-[#C9A86C] transition-colors ${item.name === "À propos" ? "text-[#C9A86C] font-bold" : "text-white/60"}`}
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
        <section className="py-24 px-6 bg-[#0A0806]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
              <div className="lg:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5">
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80" alt="Elena Korr Obscura" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="lg:col-span-7">
                <span className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4 block font-mono">Elena Korr</span>
                <h2 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Capturer le <span className="italic">temps suspendu.</span></h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6 font-sans font-light">
                  Diplômée de l'École Nationale Supérieure des Arts Décoratifs de Paris, je consacre ma pratique photographique à l'étude des ambiances lumineuses contrastées et à la géométrie rigoureuse des lignes architecturales.
                </p>
                <p className="text-white/40 text-sm leading-relaxed mb-10 font-sans font-light">
                   Mon travail navigue entre la spontanéité du reportage de rue et la rigueur millimétrée du portrait de mode en studio. J'ai eu l'opportunité de collaborer avec des maisons de haute couture internationales et des rédactions de presse indépendantes qui partagent cette même obsession de l'excellence visuelle.
                </p>
                
                <div className="flex gap-4">
                  <a href="mailto:contact@obscura.fr" className="bg-[#C9A86C] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors flex items-center gap-2 font-mono"><Mail className="w-4 h-4" /> contact@obscura.fr</a>
                  <a href="#contact" className="border border-white/10 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2 font-mono"><Instagram className="w-4 h-4" /> @obscuraphoto</a>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
              <div>
                <h3 className="text-3xl font-light mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prix & Reconnaissance</h3>
                <div className="space-y-4">
                  {AWARDS.map((a, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 font-mono text-xs">
                      <div>
                        <p className="text-white font-medium">{a.name}</p>
                        <p className="text-white/30 text-[10px]">{a.category}</p>
                      </div>
                      <span className="text-white/30">{a.year}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-light mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Publications & Clients</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 font-sans font-light">
                   Mon travail est régulièrement exposé dans des galeries parisiennes et publié dans des magazines de mode internationaux. Nous assurons la production de A à Z (casting, stylisme, repérages).
                </p>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs text-[#C9A86C]">
                  {CLIENTS.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
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
