// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X, Radio, Globe, Mail } from "lucide-react";
import { MagneticBtn } from "./shared";

import "../premium.css";

export default function StreamHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveViewers, setLiveViewers] = useState(142852);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    const t = setInterval(
      () => setLiveViewers((prev) => prev + Math.floor(Math.random() * 100)),
      1000
    );
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(t);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-73") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Browse", href: "/templates/impact-73/browse" },
    { label: "Creators", href: "/templates/impact-73/creators" },
    { label: "Go_Live", href: "/templates/impact-73/go-live" },
    { label: "About", href: "/templates/impact-73/about" },
    { label: "Contact", href: "/templates/impact-73/contact" },
  ];

  return (
    <div
      className="premium-theme min-h-screen bg-[#08080c] text-white font-mono selection:bg-rose-500 selection:text-white overflow-x-hidden relative"
      style={{ scrollBehavior: "smooth" }}
    >
      <style>{`
        ::-webkit-scrollbar{width:4px;background:#08080c}
        ::-webkit-scrollbar-thumb{background:rgba(225,29,72,0.2)}
      `}</style>

      {/* ==========================================
          NAVIGATION
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${scrolled ? "bg-[#08080c]/95 backdrop-blur-md py-4 border-b border-rose-500/10" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-73" className="flex flex-col items-start" style={{ textDecoration: "none" }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-rose-500/40 mb-1">
              Live.
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white font-sans">
              STREAM<span className="text-rose-500">HUB.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-rose-400 transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#f43f5e" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                Aggregate Global Reach
              </span>
              <span className="text-[11px] font-black text-rose-500 flex items-center gap-1">
                {liveViewers.toLocaleString()} ONLINE{" "}
                <Activity className="w-3 h-3" />
              </span>
            </div>
            <MagneticBtn
              onClick={() => router.push("/templates/impact-73/go-live")}
              className="px-8 py-3 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 border-none cursor-pointer"
            >
              START_STREAMING
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
            className="fixed inset-0 z-[100] bg-[#08080c] p-8 pt-32 flex flex-col border-l border-rose-500/10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/20 bg-transparent border-none cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase italic text-rose-500">
              <Link href="/templates/impact-73" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                Home
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/legal/mentions-legales" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                Legal
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
      <footer className="bg-[#0a0a14] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden z-20">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <div className="flex flex-col mb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 mb-1">
                  Live.
                </span>
                <span className="text-2xl font-black tracking-tighter uppercase text-white font-sans">
                  STREAM<span className="text-rose-500">HUB.</span>
                </span>
              </div>
              <p className="text-white/20 max-w-sm mb-12 uppercase tracking-widest text-[10px] font-bold leading-relaxed italic">
                The infrastructure for the next generation of digital
                performance. Est. 2026. Empowering creators globally.
              </p>
              <form
                className="relative max-w-md"
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push("/templates/impact-73/go-live");
                }}
              >
                <input
                  type="email"
                  placeholder="ENROLL_IN_THE_MANIFESTO"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-4 text-xs font-bold outline-none focus:border-rose-600 text-white transition-all uppercase tracking-widest"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-500 hover:text-white transition-colors uppercase tracking-[0.3em] bg-transparent border-none cursor-pointer"
                >
                  ENROLL
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Platform
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-73/browse" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Browse_Streams
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-73/creators" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Top_Creators
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-73/go-live" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Partner_Program
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-73/about" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Creator_Tools
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Company
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link href="/templates/impact-73/about" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Our_Mission
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-73/about" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Press_Kit
                  </Link>
                </li>
                <li>
                  <Link href="/legal/mentions-legales" className="hover:text-rose-500 transition-colors" style={{ textDecoration: "none" }}>
                    Mentions_Legales
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-10">
                Terminal
              </h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/20 list-none p-0">
                <li>
                  <Link
                    href="/templates/impact-73/contact"
                    className="hover:text-rose-500 transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <Globe className="w-3 h-3" /> Globe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/impact-73/contact"
                    className="hover:text-rose-500 transition-colors flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <Mail className="w-3 h-3" /> Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/10">
            <div className="flex items-center gap-10">
              <span>
                &copy; {new Date().getFullYear()} Aevia WS — SIREN 852 546 225. Tous droits réservés.
              </span>
              <Link href="/legal/mentions-legales" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                Regulatory_Terms
              </Link>
              <Link href="/legal/mentions-legales" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                Privacy_Buffer
              </Link>
            </div>
            <div className="flex gap-10">
              <span>San Francisco // Tokyo // Berlin</span>
              <span>StreamHub OS v8.4.2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
