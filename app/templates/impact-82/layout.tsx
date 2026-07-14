"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MapPin, Phone, Mail } from "lucide-react"

export default function BlueprintLayout({ children }: { children: React.ReactNode }) {
  const [__layoutSession, __setLayoutSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(__setLayoutSession)
      .catch(() => {});
  }, []);
  const fd = __layoutSession?.formData;

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const NAV_LINKS = [
    { label: "Programmes", href: "/templates/impact-82/programmes" },
    { label: "Réalisations", href: "/templates/impact-82/realisations" },
    { label: "L'entreprise", href: "/templates/impact-82/entreprise" },
    { label: "Investisseurs", href: "/templates/impact-82/investisseurs" },
    { label: "Contact", href: "/templates/impact-82/contact" },
  ]

  const isLinkActive = (href: string) => pathname === href

  return (
    <div className="min-h-dvh bg-[#F7F5F2] text-[#1A1612] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Load Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
      `}} />

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F7F5F2]/95 backdrop-blur-md border-b border-[#E0D8CC]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/templates/impact-82" className="flex flex-col select-none">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A86C]">Développements Immobiliers</span>
              </>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-light text-[#6B5A40]">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 hover:text-[#1A1612] ${
                  isLinkActive(link.href) ? "text-[#1A1612] font-medium border-b border-[#C9A86C]" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/templates/impact-82/contact" className="ml-2 px-5 py-2.5 bg-[#1A1612] text-[#F7F5F2] text-xs tracking-widest uppercase hover:bg-[#C9A86C] hover:text-[#1A1612] transition-colors duration-300 cursor-pointer">
              Nous contacter
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
          <motion.div className="fixed inset-0 z-[200] bg-[#1A1612] text-[#F7F5F2] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#3A3020]">
              <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-3xl font-light hover:text-[#C9A86C] transition-colors cursor-pointer ${
                      isLinkActive(link.href) ? "text-[#C9A86C]" : ""
                    }`}
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: NAV_LINKS.length * 0.07 }} className="pt-4">
                <Link
                  href="/templates/impact-82/contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-block px-8 py-4 bg-[#C9A86C] text-[#1A1612] text-sm tracking-widest uppercase font-medium hover:bg-[#E0BC70] transition-colors"
                >
                  Nous contacter
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0E0A06] text-[#5A5040] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="text-[#F7F5F2] font-normal text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>Blueprint Developments</div>
              <div className="text-xs text-[#C9A86C] tracking-widest uppercase mb-4">Promoteur Immobilier depuis 1989</div>
              <p className="text-sm leading-relaxed max-w-xs">Conception, réalisation et valorisation de programmes immobiliers d&apos;exception en France et en Europe.</p>
            </div>
            <div>
              <p className="text-[#F7F5F2] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="block text-sm hover:text-[#F7F5F2] mb-3 transition-colors cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-[#F7F5F2] text-xs tracking-widest uppercase mb-5">Siège social</p>
              <p className="text-sm mb-2">8 avenue Hoche</p>
              <p className="text-sm mb-2">75008 Paris, France</p>
              <p className="text-sm mb-4">+33 1 44 15 62 00</p>
              <p className="text-xs text-[#C9A86C]">SIREN : 342 789 001 · RCS Paris</p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2A1E12] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Blueprint Developments — Tous droits réservés</span>
            <div className="flex gap-6">
              <Link href="/templates/impact-82/legal" className="hover:text-[#F7F5F2] transition-colors cursor-pointer">
                Mentions légales
              </Link>
              <Link href="/templates/impact-82/legal" className="hover:text-[#F7F5F2] transition-colors cursor-pointer">
                Politique de confidentialité
              </Link>
              <Link href="/templates/impact-82/legal" className="hover:text-[#F7F5F2] transition-colors cursor-pointer">
                Données personnelles
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
