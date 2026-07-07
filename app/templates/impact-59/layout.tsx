"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Search, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StyleInjector, NAV_LINKS } from "./shared";
import "../premium.css";

export default function LuminalLayout({
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-59") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="premium-theme min-h-screen bg-[#f8f5f0] text-[#2a2a2a] overflow-x-hidden selection:bg-[#3d7a5e] selection:text-white"
      style={{ scrollBehavior: "smooth" }}
    >
      <StyleInjector />

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#f8f5f0]/90 backdrop-blur-md py-4 border-b border-black/5" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/templates/impact-59"
            className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase flex items-center gap-3"
            style={{ textDecoration: "none", color: "inherit" }}
          >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
            <div className="w-8 h-8 rounded-full bg-[#3d7a5e] flex items-center justify-center text-white">
              <Leaf className="w-4 h-4" />
            </div>
            LUMINAL
          </>
          )}</Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-[#3d7a5e] transition-colors" style={{ textDecoration: "none", color: isActive(link.href) ? "#3d7a5e" : "inherit" }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:block hover:text-[#3d7a5e] transition-colors text-black/30">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/templates/impact-59/apply" className="px-8 py-3 bg-[#3d7a5e] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all text-center" style={{ textDecoration: "none" }}>
              Begin_Intake
            </Link>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
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
            className="fixed inset-0 z-[100] bg-[#f8f5f0] p-8 pt-32 flex flex-col border-l border-black/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light italic tracking-tighter uppercase">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                  {link.label.replace("_", " ")}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <div style={{ paddingTop: scrolled ? "72px" : "112px" }} className="transition-all duration-700">
        {children}
      </div>

      {/* ==========================================
          MEGA FOOTER (Editorial)
          ========================================== */}
      <footer className="bg-white pt-32 pb-12 px-6 md:px-12 border-t border-black/5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <div>
                <div className="text-2xl font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3d7a5e] flex items-center justify-center text-white">
                    <Leaf className="w-3 h-3" />
                  </div>
                  LUMINAL
                </div>
                <p className="text-black/40 max-w-sm mb-12 uppercase tracking-widest text-[11px] leading-relaxed italic">
                  Immersive retreat experiences in the world&apos;s most
                  transformative landscapes. Maximum nine participants.
                  Stillness as practice.
                </p>
                <form
                  className="relative max-w-md"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your_Intake_Email"
                    className="w-full bg-[#f8f5f0] border border-black/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-[#3d7a5e] text-black transition-all uppercase tracking-widest"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#3d7a5e] hover:text-black transition-colors uppercase tracking-[0.3em]"
                  >
                    AUTHENTICATE
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Programmes
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30 list-none p-0">
                <li>
                  <Link
                    href="/templates/impact-59/retreats"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Sonoran_Silence
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-59/retreats"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Icelandic_Reset
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-59/retreats"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Kyoto_Immersion
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Intel
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30 list-none p-0">
                <li>
                  <Link
                    href="/templates/impact-59/method"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    The_Method
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-59/method"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    FAQ_Buffer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-59/legal"
                    className="hover:text-[#3d7a5e] transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Mentions_Légales
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] mb-10">
                Network
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-black/30 list-none p-0">
                <li>
                  <Link
                    href="/templates/impact-59/retreats"
                    className="hover:text-[#3d7a5e] transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-59/retreats"
                    className="hover:text-[#3d7a5e] transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Globe className="w-3 h-3" /> X_Protocol
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/20">
            <div className="flex items-center gap-10">
              <span>&copy; {new Date().getFullYear()} Luminal Ltd. &mdash; Valentin Milliand</span>
              <Link href="/templates/impact-59/legal" className="hover:text-black transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Privacy_Protocol
              </Link>
              <Link href="/templates/impact-59/legal" className="hover:text-black transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Terms_of_Access
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Switzerland // Japan // USA</span>
              <span>Crafted with Stillness</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
