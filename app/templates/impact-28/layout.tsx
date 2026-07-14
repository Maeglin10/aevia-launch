"use client"

import { useScroll, motion, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react";
import Link from "next/link"
import { useFonts } from "./shared"
import { usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
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

  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div ref={containerRef} className="min-h-dvh bg-white text-black select-none selection:bg-black selection:text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/templates/impact-28"
            className="font-black text-xl tracking-[0.15em] uppercase cursor-pointer transition-transform hover:-translate-y-[2px]" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.4rem", letterSpacing: "0.2em" }}
          >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            BRUTCO
          </>
          )}</Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold uppercase tracking-widest">
            <Link href="/templates/impact-28/work" className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${isActive('/templates/impact-28/work') ? 'underline underline-offset-4' : ''}`}>Work</Link>
            <Link href="/templates/impact-28/services" className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${isActive('/templates/impact-28/services') ? 'underline underline-offset-4' : ''}`}>Services</Link>
            <Link href="/templates/impact-28/studio" className={`hover:underline hover:underline-offset-4 transition-all cursor-pointer ${isActive('/templates/impact-28/studio') ? 'underline underline-offset-4' : ''}`}>Studio</Link>
            <Link href="/templates/impact-28#contact" className="hover:underline hover:underline-offset-4 transition-all cursor-pointer">Contact</Link>
          </div>
          <Link 
            href="/templates/impact-28#contact" 
            className="hidden md:block bg-black text-white text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-gray-900 transition-colors cursor-pointer border-2 border-black hover:border-gray-900"
          >
            Get in touch →
          </Link>
          <button className="md:hidden font-black text-xl cursor-pointer bg-transparent border-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t-4 border-black bg-white"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
                <Link href="/templates/impact-28/work" onClick={() => setMenuOpen(false)} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Work</Link>
                <Link href="/templates/impact-28/services" onClick={() => setMenuOpen(false)} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Services</Link>
                <Link href="/templates/impact-28/studio" onClick={() => setMenuOpen(false)} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Studio</Link>
                <Link href="/templates/impact-28#contact" onClick={() => setMenuOpen(false)} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Contact</Link>
                <Link href="/templates/impact-28/legal" onClick={() => setMenuOpen(false)} className="text-left py-2 hover:ml-2 transition-all cursor-pointer">Mentions légales</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="min-h-dvh">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 border-t-4 border-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link 
            href="/templates/impact-28"
            className="font-black text-xl uppercase tracking-[0.2em] cursor-pointer hover:opacity-80" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            BRUTCO
          </Link>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
            <Link href="/templates/impact-28/work" className="hover:text-white transition-colors cursor-pointer">Work</Link>
            <Link href="/templates/impact-28/services" className="hover:text-white transition-colors cursor-pointer">Services</Link>
            <Link href="/templates/impact-28/studio" className="hover:text-white transition-colors cursor-pointer">Studio</Link>
            <Link href="/templates/impact-28/legal" className="hover:text-white transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="/templates/impact-28/legal" className="hover:text-white transition-colors cursor-pointer">Confidentialité</Link>
            <Link href="/templates/impact-28/legal" className="hover:text-white transition-colors cursor-pointer">CGU</Link>
          </div>
          <div className="text-white/30 text-xs uppercase tracking-widest">© 2026 Brutco Architecture</div>
        </div>
      </footer>
    </div>
  )
}
