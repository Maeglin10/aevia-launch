"use client";
// @ts-nocheck

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

export default function LegalPage() {
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
                className={`hover:text-[#C9A86C] transition-colors cursor-pointer`}
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
                      className={`text-2xl hover:text-[#C9A86C] transition-colors ${item.name === "Mentions Légales" ? "text-[#C9A86C] font-bold" : "text-white/60"}`}
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
        <section id="contact" className="py-24 px-6 bg-[#0A0806] font-mono text-xs">
          <div className="max-w-3xl mx-auto space-y-16">
            <div>
              <span className="text-[#C9A86C] text-[10px] uppercase tracking-widest mb-4 block">Compliance</span>
              <h1 className="text-4xl md:text-6xl font-light uppercase text-white mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mentions Légales</h1>
            </div>

            <div className="border border-[#C9A86C]/20 bg-[#0E0B08] p-10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                 <div className="text-white/30 text-[10px] font-black uppercase mb-2">EDITEUR</div>
                 <p className="text-white font-medium uppercase leading-relaxed">
                    Aevia WS — Valentin Milliand<br />
                    Entrepreneur Individuel<br />
                    SIREN : 852 546 225<br />
                    RCS : Bourg-en-Bresse<br />
                    Email : valentinmilliand@aevia.services<br />
                    Adresse : Communiquée sur demande
                 </p>
              </div>

              <div className="border-b border-white/10 pb-4">
                 <div className="text-white/30 text-[10px] font-black uppercase mb-2">HEBERGEUR</div>
                 <p className="text-white font-medium uppercase leading-relaxed">
                    Vercel Inc.<br />
                    340 S Lemon Ave #4133<br />
                    Walnut, CA 91789, USA
                 </p>
              </div>

              <div>
                 <div className="text-white/30 text-[10px] font-black uppercase mb-2">PROPRIETE INTELLECTUELLE</div>
                 <p className="text-white/50 font-medium uppercase leading-relaxed font-sans">
                    Toutes les photographies, images, logos, structures de code et fichiers multimédias présents sur ce site sont la propriété exclusive d'Elena Korr Studio ou de ses représentants autorisés. Toute reproduction sans accord écrit préalable fera l'objet de poursuites pénales.
                 </p>
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
