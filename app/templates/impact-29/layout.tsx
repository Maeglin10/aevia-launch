"use client"

import { useScroll, motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { Terminal, ArrowRight } from "lucide-react"
import { useFonts } from "./shared"
import { usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0E1A] text-[#E2E8F0] select-none selection:bg-[#00F5D4] selection:text-[#0A0E1A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-[#00F5D4] origin-left z-50" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/templates/impact-29" className="flex items-center gap-3 cursor-pointer">
            <Terminal className="w-5 h-5 text-[#00F5D4]" />
            <span className="font-bold text-[#00F5D4]">glitch</span>
            <span className="text-[#475569]">.dev</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#475569]">
            <Link href="/templates/impact-29/work" className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${isActive('/templates/impact-29/work') ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>work
            </Link>
            <Link href="/templates/impact-29/skills" className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${isActive('/templates/impact-29/skills') ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>skills
            </Link>
            <Link href="/templates/impact-29/timeline" className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${isActive('/templates/impact-29/timeline') ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>timeline
            </Link>
            <Link href="/templates/impact-29/studio" className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${isActive('/templates/impact-29/studio') ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>studio
            </Link>
            <Link href="/templates/impact-29/contact" className={`hover:text-[#00F5D4] transition-colors cursor-pointer ${isActive('/templates/impact-29/contact') ? 'text-[#00F5D4]' : ''}`}>
              <span className="text-[#00F5D4]">// </span>contact
            </Link>
          </div>
          <Link
            href="/templates/impact-29/contact"
            className="hidden md:flex items-center gap-2 border border-[#00F5D4]/40 text-[#00F5D4] text-xs px-4 py-2 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer"
          >
            hire me <ArrowRight className="w-3 h-3" />
          </Link>
          <button className="md:hidden text-[#00F5D4] cursor-pointer bg-transparent border-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <Terminal className="w-5 h-5" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-[#00F5D4]/10 bg-[#0A0E1A] px-6 py-4 flex flex-col gap-3 text-sm"
            >
              <Link href="/templates/impact-29/work" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>work
              </Link>
              <Link href="/templates/impact-29/skills" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>skills
              </Link>
              <Link href="/templates/impact-29/timeline" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>timeline
              </Link>
              <Link href="/templates/impact-29/studio" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>studio
              </Link>
              <Link href="/templates/impact-29/contact" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>contact
              </Link>
              <Link href="/templates/impact-29/legal" onClick={() => setMenuOpen(false)} className="text-left text-[#475569] hover:text-[#00F5D4] transition-colors cursor-pointer">
                <span className="text-[#00F5D4]">// </span>legal
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#00F5D4]/10 py-10 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/templates/impact-29" className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
            <Terminal className="w-4 h-4 text-[#00F5D4]" />
            <span className="text-[#00F5D4]">glitch</span><span className="text-[#475569]">.dev</span>
          </Link>
          <div className="flex flex-wrap gap-6 text-xs text-[#475569]">
            <Link href="/templates/impact-29/work" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Work</Link>
            <Link href="/templates/impact-29/skills" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Skills</Link>
            <Link href="/templates/impact-29/timeline" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Experience</Link>
            <Link href="/templates/impact-29/studio" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Studio</Link>
            <Link href="/templates/impact-29/contact" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Contact</Link>
            <Link href="/templates/impact-29/legal" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="/templates/impact-29/legal" className="hover:text-[#00F5D4] transition-colors cursor-pointer">Confidentialité</Link>
            <Link href="/templates/impact-29/legal" className="hover:text-[#00F5D4] transition-colors cursor-pointer">CGU</Link>
          </div>
          <div className="text-[#475569] text-xs">© 2026 Raphaël Genet · Paris, France</div>
        </div>
      </footer>
    </div>
  )
}
