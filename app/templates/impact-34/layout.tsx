"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Radio, Headphones, Play, Pause, Menu, X } from "lucide-react"
import { C, FONT, NAV_LINKS, FOOTER_LINKS, ScrollProgressBar, GlassCard } from "./shared"

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playProgress, setPlayProgress] = useState(32)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Simulate play progress
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlayProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 200)
    return () => clearInterval(interval)
  }, [isPlaying])

  const isActive = (href: string) => pathname === href

  return (
    <div
      className="bg-[#0F0F23] text-[#F8FAFC] min-h-screen flex flex-col overflow-x-hidden"
      style={{ fontFamily: FONT }}
    >
      {/* Load Inter Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      <ScrollProgressBar />

      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-white/5 bg-[#0F0F23]/95 backdrop-blur-[20px]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/templates/impact-34" className="flex items-center gap-3">
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div className="relative flex items-center gap-1.5">
              <Radio className="w-5 h-5 text-[#F97316]" />
              <span className="text-lg font-black tracking-tight text-white">WAVEFORM</span>
              {/* Pulse dot */}
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
              </span>
            </div>
          </>
          )}</Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/templates/impact-34"
              className={`text-sm font-medium transition-colors ${
                isActive("/templates/impact-34") ? "text-white" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Home
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-white" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/templates/impact-34/pricing" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/templates/impact-34/pricing"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
              style={{ backgroundColor: C.accent }}
            >
              Start Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-white/5 px-6 py-5 bg-[#0F0F23]/98 backdrop-blur-[20px]"
            >
              <div className="flex flex-col gap-4">
                <Link
                  href="/templates/impact-34"
                  className="text-sm font-medium text-[#94A3B8] hover:text-white py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-[#94A3B8] hover:text-white py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-white/10" />
                <Link
                  href="/templates/impact-34/pricing"
                  className="w-full text-center py-3 rounded-xl text-white text-sm font-semibold"
                  style={{ backgroundColor: C.accent }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-16 pb-10 px-6 bg-[#070713]">
        <div className="max-w-7xl mx-auto">
          {/* Top footer */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Radio className="w-5 h-5 text-[#F97316]" />
                <span className="text-lg font-black text-white">WAVEFORM</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
                </span>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                The podcast platform built for creators who are serious about growing their audience and monetizing their content.
              </p>
              {/* Mini player */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F97316]/20">
                    <Headphones className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F8FAFC] truncate">The Startup Blueprint #42</p>
                    <p className="text-[10px] text-[#64748B]">Sarah Leroy · 52min</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F97316] hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                    )}
                  </button>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${playProgress}%`, backgroundColor: C.accent }}
                  />
                </div>
              </GlassCard>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-[#F8FAFC] mb-4 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#475569] hover:text-[#F97316] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter strip */}
          <div className="p-6 rounded-2xl border border-white/5 mb-10 bg-white/[0.02]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-[#F8FAFC] mb-1">Get creator tips weekly</p>
                <p className="text-xs text-[#64748B]">Growth strategies, platform updates, and monetization tips.</p>
              </div>
              {newsletterSubmitted ? (
                <div className="text-sm text-emerald-400 font-semibold">
                  Merci, nous vous répondrons sous 24h.
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubmitted(true); }} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#475569] outline-none focus:border-[#F97316]/50 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                    style={{ backgroundColor: C.accent }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#334155]">
              © 2024 WaveForm. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/templates/impact-34/legal" className="text-xs text-[#334155] hover:text-[#F97316] transition-colors">
                Mentions légales
              </Link>
              <Link href="/templates/impact-34/legal" className="text-xs text-[#334155] hover:text-[#F97316] transition-colors">
                Confidentialité
              </Link>
              <Link href="/templates/impact-34/legal" className="text-xs text-[#334155] hover:text-[#F97316] transition-colors">
                CGU
              </Link>
            </div>
            <div className="flex gap-3">
              {["TW", "LI", "YT", "IG"].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold text-[#475569] hover:border-[#F97316]/40 hover:text-[#F97316] transition-all cursor-pointer bg-white/[0.01]"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
