"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Menu, X, Music, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import "../premium.css";

export default function VelvetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-70") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Experiences", href: "/templates/impact-70/experience" },
    { label: "Events", href: "/templates/impact-70/events" },
    { label: "Members", href: "/templates/impact-70/members" },
    { label: "Contact", href: "/templates/impact-70/contact" },
  ];

  return (
    <div className="bg-[#050005] text-[#d1d1d1] font-sans min-h-screen selection:bg-[#ff00ff] selection:text-white overflow-x-hidden relative">
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050005; }
        ::-webkit-scrollbar-thumb { background: #ff00ff20; border-radius: 2px; }
      `}</style>

      {/* ── AMBIENT GLOWS ────────── */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff00ff]/10 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4b0082]/10 blur-[150px] pointer-events-none z-0" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-70" className="flex items-center gap-4 group" style={{ textDecoration: "none" }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff00ff] to-[#4b0082] flex items-center justify-center group-hover:rotate-180 transition-all duration-700 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Velvet <span className="font-bold">Night</span></span>
          </Link>

          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#ff00ff] transition-colors"
                style={{ textDecoration: "none", color: isActive(link.href) ? "#ff00ff" : "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => router.push("/templates/impact-70/members")}
              className="hidden md:block bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-[#ff00ff]/30 cursor-pointer"
            >
              VIP Login
            </button>
            <button
              onClick={() => router.push("/templates/impact-70/members")}
              className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#ff00ff] hover:text-white transition-all duration-700 shadow-xl cursor-pointer border-none"
            >
              Join The Circle
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 bg-transparent border-none text-white cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#050005] p-12 pt-32 flex flex-col border-l border-white/5"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 bg-transparent border-none text-white cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-10 mt-16 text-left">
              <Link href="/templates/impact-70" onClick={() => setMenuOpen(false)} className="text-4xl font-light uppercase tracking-widest hover:text-[#ff00ff] transition-all italic text-white" style={{ textDecoration: "none" }}>
                Home
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-4xl font-light uppercase tracking-widest hover:text-[#ff00ff] transition-all italic text-white" style={{ textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/templates/impact-70/legal" onClick={() => setMenuOpen(false)} className="text-4xl font-light uppercase tracking-widest hover:text-[#ff00ff] transition-all italic text-white" style={{ textDecoration: "none" }}>
                Mentions Légales
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-28" />

      {/* MAIN CONTENT */}
      <main className="relative z-10">{children}</main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050005] pt-40 pb-12 px-6 border-t border-white/5 relative z-[60]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
          <div className="md:col-span-2">
            <Link href="/templates/impact-70" className="flex items-center gap-4 mb-10 group" style={{ textDecoration: "none" }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff00ff] to-[#4b0082] flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Velvet Night</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
              "In the shadows of the night, we find the truth of the spirit. Curated for the few who understand the silence."
            </p>
            <div className="flex gap-10">
              {["Camera", "Vimeo", "Soundcloud", "Contact"].map((s) => (
                <Link key={s} href="/templates/impact-70/contact" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#ff00ff] transition-colors italic" style={{ textDecoration: "none" }}>
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {[
            { title: "THE EXPERIENCE", links: [{ label: "Atmosphere", href: "/templates/impact-70/experience" }, { label: "VIP Tables", href: "/templates/impact-70/members" }, { label: "Sound Lab", href: "/templates/impact-70/experience" }] },
            { title: "LOCATIONS", links: [{ label: "Berlin Hub", href: "/templates/impact-70/contact" }, { label: "Ibiza Retreat", href: "/templates/impact-70/contact" }, { label: "Tokyo Underground", href: "/templates/impact-70/contact" }] },
            { title: "ENTITY", links: [{ label: "Membership", href: "/templates/impact-70/members" }, { label: "Mentions Légales", href: "/legal/mentions-legales" }] }
          ].map((col, i) => (
            <div key={i} className="space-y-12">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20">{col.title}</h4>
              <ul className="space-y-6 list-none p-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors italic" style={{ textDecoration: "none" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
          <span>© {new Date().getFullYear()} VELVET NIGHT GLOBAL COMMISSIONS. THE NIGHT IS ETERNAL.</span>
          <div className="flex gap-12">
            <Link href="/templates/impact-70/legal" className="hover:text-white transition-all underline decoration-[#ff00ff]/20" style={{ textDecoration: "none" }}>SLA: NOMINAL</Link>
            <Link href="/templates/impact-70/legal" className="hover:text-white transition-all underline decoration-[#ff00ff]/20" style={{ textDecoration: "none" }}>DRESS_CODE: BLACK_TIE</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
