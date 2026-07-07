// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Menu, X, Leaf, Wind, Check, Clock, Globe, Mail, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MagneticBtn } from "./shared";

import "../premium.css";

export default function ZenSpaceLayout({
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

  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState("Vinyasa Flow");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenBooking = () => {
      setIsBookingOpen(true);
      setBookingStep(1);
    };
    window.addEventListener("open-zenspace-booking", handleOpenBooking);
    return () => window.removeEventListener("open-zenspace-booking", handleOpenBooking);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-71") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Practices", href: "/templates/impact-71/practices" },
    { label: "Timetable", href: "/templates/impact-71/timetable" },
    { label: "Guides", href: "/templates/impact-71/guides" },
    { label: "Contact", href: "/templates/impact-71/contact" },
  ];

  const triggerBooking = () => {
    window.dispatchEvent(new CustomEvent("open-zenspace-booking"));
  };

  return (
    <div
      className="premium-theme min-h-screen bg-[#faf9f6] text-[#33302c] font-sans selection:bg-[#e8e4db] selection:text-[#33302c] overflow-x-hidden relative"
      style={{ scrollBehavior: "smooth" }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 4px; background: #faf9f6; }
        ::-webkit-scrollbar-thumb { background: #e8e4db; }
      `}</style>

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#faf9f6]/95 backdrop-blur-md py-4 border-b border-stone-200/50 shadow-sm" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-71" className="flex flex-col items-center group" style={{ textDecoration: "none" }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-stone-400 mb-1 group-hover:text-[#c9a84c] transition-colors">
              Sanctuary.
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase text-[#33302c]">
              ZEN<span className="text-[#c9a84c]">SPACE</span>
            </span>
          </>
            )}</Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#c9a84c] transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#c9a84c" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
                Morning Ritual
              </span>
              <span className="text-[11px] font-bold text-[#c9a84c] flex items-center gap-1">
                LIVE AT 07:00 <Sun className="w-3 h-3" />
              </span>
            </div>
            <MagneticBtn
              onClick={triggerBooking}
              className="px-8 py-3 bg-[#33302c] text-[#faf9f6] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9a84c] transition-all cursor-pointer border-none"
            >
              BOOK_MAT
            </MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden bg-transparent border-none cursor-pointer">
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
            className="fixed inset-0 z-[100] bg-[#faf9f6] p-8 pt-32 flex flex-col border-l border-stone-200"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-stone-400 bg-transparent border-none cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-light tracking-tighter uppercase italic text-stone-400">
              <Link href="/templates/impact-71" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }} className="hover:text-[#c9a84c] transition-colors">
                Home
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }} className="hover:text-[#c9a84c] transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/templates/impact-71/legal" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }} className="hover:text-[#c9a84c] transition-colors">
                Mentions Légales
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-28" />

      {/* MAIN CONTENT */}
      <main className="relative z-10">{children}</main>

      {/* ==========================================
          MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#1a1814] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden text-white z-[60]">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <div className="flex flex-col mb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                  Sanctuary.
                </span>
                <span className="text-2xl font-light tracking-[0.4em] uppercase text-white">
                  ZEN<span className="text-[#c9a84c]">SPACE</span>
                </span>
              </div>
              <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                An architectural sanctuary designed for the conscious evolution
                of mind and body. Est. 2026.
              </p>
              <form
                className="relative max-w-md"
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerBooking();
                }}
              >
                <input
                  type="email"
                  placeholder="ENROLL_IN_THE_MANIFESTO"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-[#c9a84c] text-white transition-all uppercase tracking-widest"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#c9a84c] hover:text-white transition-colors uppercase tracking-[0.3em] bg-transparent border-none cursor-pointer"
                >
                  ENROLL
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-10">
                Practices
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-71/practices" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Vinyasa_Flow
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/practices" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Ashtanga_Rigour
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/practices" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Yin_Stillness
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/practices" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Meditation_Core
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-10">
                Sanctuary
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-71/contact" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Our_Ethos
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/guides" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Guide_Profiles
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/contact" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Studio_Tour
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-71/legal" className="hover:text-[#c9a84c] transition-colors" style={{ textDecoration: "none" }}>
                    Mentions_Legales
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-10">
                Terminal
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link
                    href="/templates/impact-71/contact"
                    className="hover:text-[#c9a84c] transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-71/contact"
                    className="hover:text-[#c9a84c] transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <Mail className="w-3 h-3" /> Contact_Control
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-71/contact"
                    className="hover:text-[#c9a84c] transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <MapPin className="w-3 h-3" /> Find_Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} ZEN SPACE Wellness Ltd.
              </span>
              <Link href="/templates/impact-71/legal" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                Regulatory_Terms
              </Link>
              <Link href="/templates/impact-71/legal" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>Geneva // Kyoto // London</span>
              <span>In Silence We Grow</span>
            </div>
          </div>
        </div>
      </footer>

      {/* GLOBAL BOOKING DIALOG */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#faf9f6] text-[#33302c] border border-stone-200 p-8 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light uppercase tracking-widest text-center italic mb-4">
              Reserve Your <span className="text-[#c9a84c]">Stillness</span>
            </DialogTitle>
          </DialogHeader>

          {bookingStep === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBookingStep(2);
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Select Practice</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                >
                  <option value="Vinyasa Flow">Vinyasa Flow (60 min - All Levels)</option>
                  <option value="Yin & Sound Bath">Yin & Sound Bath (90 min - Beginner)</option>
                  <option value="Ashtanga Primary">Ashtanga Primary (75 min - Advanced)</option>
                  <option value="Hatha Awakening">Hatha Awakening (60 min - All Levels)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#c9a84c] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#33302c] text-[#faf9f6] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#c9a84c] transition-all cursor-pointer border-none"
              >
                REQUEST_RESERVATION
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#c9a84c]" />
              </div>
              <h3 className="text-xl font-light uppercase tracking-widest">Mat Requested</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed italic">
                Your request for <strong className="text-[#33302c]">{selectedClass}</strong> has been logged. A confirmation email and pass have been dispatched.
              </p>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="px-8 py-3 bg-[#33302c] text-[#faf9f6] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#c9a84c] transition-all cursor-pointer border-none"
              >
                CLOSE_WINDOW
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
