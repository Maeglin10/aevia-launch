"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { Menu, X, ArrowLeft } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-aether-labs"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');`
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

export default function CGU() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1814]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E4DDD4]"
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/templates/impact-85" className="flex flex-col">
            <span className="text-xl font-light tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em" }}>Aether Labs</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#8B7355]">Cosmétique scientifique</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#6B5A40]">
            <Link href="/templates/impact-85" className="flex items-center gap-2 hover:text-[#1C1814] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
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
          <motion.div className="fixed inset-0 z-[200] bg-[#F8F6F2] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4DDD4]">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">Aether Labs</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/templates/impact-85" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-3xl font-light hover:text-[#8B7355] transition-colors cursor-pointer"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <ArrowLeft className="w-6 h-6" /> Accueil
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4 text-center">Conditions d'utilisation</p>
          <h1 className="text-4xl md:text-5xl font-light text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Conditions Générales <em>d'Utilisation</em>
          </h1>
        </Reveal>
        
        <Reveal delay={0.1}>
          <div className="space-y-12 text-[#6B5A40] leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-[#1C1814] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Objet des CGU</h2>
              <p>Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités de mise à disposition des services du site Aether Labs et les conditions d'utilisation de ces services par l'utilisateur.</p>
              <p className="mt-2">Tout accès ou utilisation du site suppose l'acceptation sans réserve et le respect de l'ensemble des termes des présentes conditions.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-light text-[#1C1814] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Accès au site</h2>
              <p>Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>
              <p className="mt-2">Le site peut être interrompu ou suspendu par l'éditeur, notamment à l'occasion d'une maintenance, sans obligation de préavis ou de justification.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-light text-[#1C1814] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Données personnelles</h2>
              <p>L'Utilisateur doit obligatoirement fournir des informations personnelles pour procéder à son inscription sur le site. En vertu de la loi Informatique et Libertés en date du 6 janvier 1978 modifiée, l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-light text-[#1C1814] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4. Responsabilité</h2>
              <p>Les informations communiquées sur ce site sont fournies à titre indicatif et général sans valeur contractuelle. Malgré des mises à jour régulières, Aether Labs ne peut être tenu responsable de la modification des dispositions administratives et juridiques survenant après la publication.</p>
              <p className="mt-2">Aether Labs décline également toute responsabilité quant aux éventuels virus qui pourraient infecter l'équipement informatique de l'Utilisateur suite à une utilisation, à l'accès, ou au téléchargement provenant de ce site.</p>
            </section>
          </div>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="bg-[#0E0B08] text-[#5A5040] py-14 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="text-[#F8F6F2] text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Aether Labs</div>
              <div className="text-xs text-[#8B7355] tracking-widests uppercase mb-4">Cosmétique scientifique · Grasse</div>
              <p className="text-sm leading-relaxed max-w-xs">Laboratoire fondé en 2012. Chaque formule est développée en interne, testée sous contrôle dermatologique et sourcée de façon éthique.</p>
            </div>
            <div>
              <p className="text-[#F8F6F2] text-xs tracking-widests uppercase mb-5">Navigation</p>
              <Link href="/templates/impact-85" className="block text-sm hover:text-[#F8F6F2] mb-3 transition-colors cursor-pointer">Accueil</Link>
            </div>
            <div>
              <p className="text-[#F8F6F2] text-xs tracking-widests uppercase mb-5">Certifications</p>
              {["COSMOS Natural", "Cruelty-free PETA", "Végan Society", "ISO 22716 GMP"].map(c => (
                <p key={c} className="text-sm mb-2">{c}</p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#1C1814] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Aether Labs — Tous droits réservés</span>
            <div className="flex gap-6">
              {[
                { name: "Mentions légales", path: "/templates/impact-85/templates/impact-85/legal/mentions-legales" },
                { name: "CGU", path: "/templates/impact-85/templates/impact-85/legal/cgu" },
                { name: "Confidentialité", path: "/templates/impact-85/templates/impact-85/legal/confidentialite" }
              ].map(l => (
                <Link key={l.name} href={l.path} className="hover:text-[#F8F6F2] transition-colors cursor-pointer">{l.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
