"use client"

import { useScroll, motion, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react";
import Link from "next/link"
import { Box } from "lucide-react"
import { useFonts } from "./shared"

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

  return (
    <div ref={containerRef} className="min-h-dvh bg-[#0C0712] text-white selection:bg-[#9B5CF6]/30 selection:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#9B5CF6] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/templates/impact-27" className="flex items-center gap-2 text-white hover:opacity-90">
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div className="w-8 h-8 bg-[#9B5CF6] rounded-xl flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Vertex Studio</span>
          </>
          )}</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/55">
            <Link href="/templates/impact-27/work" className="hover:text-white transition-colors text-sm font-medium">Work</Link>
            <Link href="/templates/impact-27/services" className="hover:text-white transition-colors text-sm font-medium">Services</Link>
            <Link href="/templates/impact-27/studio" className="hover:text-white transition-colors text-sm font-medium">Studio</Link>
          </div>
          <Link href="/templates/impact-27/contact" className="hidden md:block bg-[#9B5CF6] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#7C3AED] transition-colors">
            Start a project
          </Link>
          <button className="md:hidden p-2 cursor-pointer bg-transparent border-none flex flex-col gap-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="w-5 h-0.5 bg-white" />
            <div className="w-5 h-0.5 bg-white" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-[#130D1E] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-sm text-left max-w-6xl mx-auto"
            >
              {[
                { label: "Work", href: "/templates/impact-27/work" },
                { label: "Services", href: "/templates/impact-27/services" },
                { label: "Studio", href: "/templates/impact-27/studio" },
                { label: "Contact", href: "/templates/impact-27/contact" }
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white transition-colors text-sm font-medium">{item.label}</Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="min-h-dvh">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#09050E]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/templates/impact-27" className="flex items-center gap-2 text-white">
            <div className="w-7 h-7 bg-[#9B5CF6] rounded-xl flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Vertex Studio</span>
          </Link>
          <div className="flex flex-wrap gap-6 text-sm text-white/30">
            <Link href="/templates/impact-27/work" className="hover:text-white transition-colors">Work</Link>
            <Link href="/templates/impact-27/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/templates/impact-27/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/templates/impact-27/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/templates/impact-27/legal" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/templates/impact-27/legal" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/templates/impact-27/legal" className="hover:text-white transition-colors">CGU</Link>
          </div>
          <p className="text-white/20 text-sm">© 2026 Vertex Studio</p>
        </div>
      </footer>
    </div>
  )
}
