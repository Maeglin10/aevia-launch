"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Menu, X, Mail, Phone, Globe } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

export default function SatoriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-62") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "The_Menu", href: "/templates/impact-62/menu" },
    { label: "The_Chef", href: "/templates/impact-62/chef" },
    { label: "Locations", href: "/templates/impact-62/contact" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0f0d0b] text-[#f5efe0] font-sans selection:bg-[#b8860b] selection:text-black overflow-x-hidden relative" style={{ scrollBehavior: "smooth" }}>
      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#0f0d0b]/95 backdrop-blur-md py-4 border-b border-[#b8860b]/10" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-62" className="flex flex-col items-center" style={{ textDecoration: "none" }}>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-1">
              Restaurant
            </span>
            <span className="text-xl md:text-3xl font-light tracking-[0.3em] uppercase text-white">
              SATORI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5efe0]/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#b8860b] transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#b8860b" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
              {[1, 2, 3].map((i) => (
                <Star key={i} className="w-3 h-3 fill-[#b8860b]" />
              ))}
              <span className="ml-2">Michelin 2026</span>
            </div>
            <MagneticBtn
              onClick={() => setReserveOpen(true)}
              className="px-8 py-3 border border-[#b8860b]/30 text-[#b8860b] text-[10px] font-bold uppercase tracking-widest hover:bg-[#b8860b] hover:text-black transition-all rounded-sm shadow-2xl bg-transparent cursor-pointer"
            >
              RESERVE
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden bg-transparent border-none cursor-pointer text-white">
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
            className="fixed inset-0 z-[100] bg-[#0f0d0b] p-8 pt-32 flex flex-col border-l border-[#b8860b]/10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 bg-transparent border-none text-white cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light tracking-tighter uppercase italic">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
                  {link.label.replace("_", " ")}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
      <div style={{ paddingTop: scrolled ? "75px" : "115px" }} className="transition-all duration-1000">
        {children}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#0f0d0b] pt-32 pb-12 px-6 md:px-12 border-t border-[#b8860b]/10 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-1">
                    Restaurant
                  </span>
                  <span className="text-2xl font-light tracking-[0.3em] uppercase">
                    SATORI
                  </span>
                </div>
                <p className="text-[#f5efe0]/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                  The pinnacle of three-Michelin-star gastronomy. Where fire
                  meets master precision.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Dining
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-62/menu" className="hover:text-[#b8860b] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Tasting_Menu
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-62/chef" className="hover:text-[#b8860b] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Chef's_Table
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Atelier
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-62/chef" className="hover:text-[#b8860b] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    The_Chef
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-62/contact" className="hover:text-[#b8860b] transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                    Artisan_Network
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] mb-10">
                Connect
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-62/contact" className="hover:text-[#b8860b] transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Mail className="w-3 h-3" /> Paris_Studio
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-62/contact" className="hover:text-[#b8860b] transition-colors flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
                    <Phone className="w-3 h-3" /> Booking_Line
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} Satori Gastronomy Group.
              </span>
              <Link href="/legal/mentions-legales" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>
                Mentions_Légales
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Paris // Geneva // Tokyo</span>
              <span>Surrender to Fire</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RESERVATION MODAL */}
      <AnimatePresence>
        {reserveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setReserveOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0f0d0b] border border-[#b8860b]/20 max-w-2xl w-full p-12 rounded-sm shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setReserveOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-[#b8860b] transition-colors bg-transparent border-none cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-4 block">
                  Secure a Table
                </span>
                <h3 className="text-4xl font-light uppercase tracking-tighter italic text-white">
                  Reservation Protocol.
                </h3>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setReserveOpen(false); alert("Reservation registered."); }} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Guest_Count
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="2"
                      className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Service_Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Authentication_Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@vault.com"
                    className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Special_Directives
                  </label>
                  <textarea
                    placeholder="Dietary adjustments, allergens, or floor preferences..."
                    className="w-full bg-white/5 border border-white/5 p-4 text-xs font-bold outline-none focus:border-[#b8860b] transition-all h-32 text-white"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer border-none">
                  Initialize_Request
                </button>
                <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-bold">
                  Requests are processed within 24 business hours.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`::-webkit-scrollbar{width:4px;background:#0f0d0b}::-webkit-scrollbar-thumb{background:#b8860b20}`}</style>
    </div>
  );
}
