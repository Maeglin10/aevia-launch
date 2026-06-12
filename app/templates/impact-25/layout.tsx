"use client"

import { useScroll, motion } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { BarChart3, ChevronDown } from "lucide-react"
import { useFonts } from "./shared"

export default function Layout({ children }: { children: React.ReactNode }) {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0B0F1A] text-white selection:bg-[#6C47FF]/40 selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/templates/impact-25" className="flex items-center gap-2 text-white hover:opacity-90">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6C47FF] to-[#A78BFA] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Prism</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <Link href="/templates/impact-25/features" className="hover:text-white transition-colors text-sm font-medium">Features</Link>
            <Link href="/templates/impact-25/integrations" className="hover:text-white transition-colors text-sm font-medium">Integrations</Link>
            <Link href="/templates/impact-25/pricing" className="hover:text-white transition-colors text-sm font-medium">Pricing</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/templates/impact-25/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Log in</Link>
            <Link href="/templates/impact-25/pricing" className="bg-[#6C47FF] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#7C5CFF] transition-colors">
              Start free
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
        
        {menuOpen && (
          <div className="mt-2 bg-[#0F1626] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-sm">
            {[
              { label: "Features", href: "/templates/impact-25/features" },
              { label: "Integrations", href: "/templates/impact-25/integrations" },
              { label: "Pricing", href: "/templates/impact-25/pricing" }
            ].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#090C16]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/templates/impact-25" className="flex items-center gap-2 text-white">
            <div className="w-7 h-7 bg-gradient-to-br from-[#6C47FF] to-[#A78BFA] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Prism Analytics</span>
          </Link>
          <div className="flex gap-8 text-sm text-white/40">
            <Link href="/templates/impact-25/features" className="hover:text-white transition-colors">Product</Link>
            <Link href="/templates/impact-25/integrations" className="hover:text-white transition-colors">Integrations</Link>
            <Link href="/templates/impact-25/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/templates/impact-25/legal" className="hover:text-white transition-colors">Privacy & Legal</Link>
          </div>
          <p className="text-white/30 text-sm">© 2026 Prism Analytics, Inc.</p>
        </div>
      </footer>
    </div>
  )
}
