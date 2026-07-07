// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Mail } from "lucide-react";
import { MagneticBtn, Reveal } from "./shared";
import "../premium.css";

export default function AetherRoastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/templates/impact-78" },
    { name: "Collection", href: "/templates/impact-78/collection" },
    { name: "Brewing", href: "/templates/impact-78/brewing" },
    { name: "Origins", href: "/templates/impact-78/origins" },
    { name: "Subscribe", href: "/templates/impact-78/subscribe" },
  ];

  return (
    <div
      className="premium-theme min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-mono selection:bg-orange-900 selection:text-white overflow-x-hidden flex flex-col justify-between"
      style={{ scrollBehavior: "smooth" }}
    >
      <div>
        {/* ==========================================
            NAVIGATION
            ========================================== */}
        <nav
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${
            scrolled
              ? "bg-[#0c0a09]/95 backdrop-blur-md py-4 border-b border-white/5"
              : "bg-transparent py-10"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
            <Link href="/templates/impact-78" className="flex flex-col items-start">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-orange-500/40 mb-1">
                Artisanal.
              </span>
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">
                AETHER<span className="text-orange-900">.ROAST</span>
              </span>
            </>
              )}</Link>

            <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? "text-orange-500"
                      : "text-white/20 hover:text-orange-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden xl:flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                  Global Sourcing
                </span>
                <span className="text-[11px] font-black text-orange-500 flex items-center gap-1">
                  100% ETHICAL_TRACE <Globe className="w-3 h-3" />
                </span>
              </div>
              <Link href="/templates/impact-78/contact">
                <MagneticBtn className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-orange-500 hover:text-white transition-all">
                  SHOP_BEANS
                </MagneticBtn>
              </Link>
              <button onClick={() => setMenuOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6 text-stone-500" />
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.5 }}
              className="fixed inset-0 z-[100] bg-[#0c0a09] p-8 pt-32 flex flex-col border-l border-white/5"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-10 right-8 text-stone-500"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic text-orange-900/50">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/templates/impact-78/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-24">{children}</main>
      </div>

      {/* ==========================================
          6. MEGA FOOTER (Premium Minimal)
          ========================================== */}
      <footer className="bg-[#0a0a0a] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                    Artisanal.
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">
                    AETHER<span className="text-orange-900">.ROAST</span>
                  </span>
                </div>
                <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  The infrastructure for the next generation of specialty
                  coffee. Est. 2026. Precision roasted. Globally sourced.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="ENROLL_IN_THE_MANIFESTO"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-orange-900 text-white transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-900 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    ENROLL
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-900 mb-10">
                Shop
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="/templates/impact-78/collection" className="hover:text-orange-500 transition-colors">
                    Light_Roasts
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-78/collection" className="hover:text-orange-500 transition-colors">
                    Medium_Roasts
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-78/collection" className="hover:text-orange-500 transition-colors">
                    Dark_Roasts
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-900 mb-10">
                Learn
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <Link href="/templates/impact-78/brewing" className="hover:text-orange-500 transition-colors">
                    Brew_Guides
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-78/origins" className="hover:text-orange-500 transition-colors">
                    Origins_Blog
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-78/legal" className="hover:text-orange-500 transition-colors">
                    Legal_Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-900 mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-500 transition-colors flex items-center gap-3"
                  >
                    <Globe className="w-3 h-3" /> LinkedIn
                  </a>
                </li>
                <li>
                  <Link
                    href="/templates/impact-78/contact"
                    className="hover:text-orange-500 transition-colors flex items-center gap-3"
                  >
                    <Mail className="w-3 h-3" /> Contact_Control
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} AETHER ROASTS Technologies Inc.
              </span>
              <Link href="/templates/impact-78/legal" className="hover:text-white transition-colors">
                Regulatory_Terms
              </Link>
              <Link href="/templates/impact-78/legal" className="hover:text-white transition-colors">
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Addis Ababa // Bogota // Berlin</span>
              <span>In Caffeine We Trust</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#0c0a09}
        ::-webkit-scrollbar-thumb{background:rgba(124,45,18,0.2)}
      `}</style>
    </div>
  );
}
