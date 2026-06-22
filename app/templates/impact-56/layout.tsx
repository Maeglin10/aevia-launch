"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, Camera, Globe, MapPin, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, WINES } from "./shared";

export default function ChateauVestigeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-56") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-serif" style={{ overflowX: "clip" }}>
      {/* ─── FONTS INJECTION ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2D1B0E]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link
            href="/templates/impact-56"
            className="flex flex-col items-center group cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <span className="text-2xl font-serif tracking-[0.2em] uppercase text-[#2D1B0E]">
              Château Vestige
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1 font-sans">Margaux</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer font-sans ${
                  isActive(item.href)
                    ? "text-[#2D1B0E] border-b-2 border-[#C4A265] pb-0.5"
                    : "text-zinc-500 hover:text-[#2D1B0E]"
                }`}
                style={{ textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2D1B0E] font-sans">FR / EN</span>
            <Link
              href="/templates/impact-56/vins"
              className="px-6 py-3 bg-[#2D1B0E] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#4A2820] transition-colors duration-300 cursor-pointer font-sans"
              style={{ textDecoration: "none" }}
            >
              Nos Vins
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-[#2D1B0E] cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#FDFBF7] z-50 border-l border-[#2D1B0E]/10 shadow-2xl flex flex-col pt-24 px-8 gap-6"
            >
              <button
                type="button"
                className="absolute top-6 right-6 text-[#2D1B0E]"
                onClick={() => setMobileOpen(false)}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-left text-lg font-serif tracking-widest uppercase transition-colors cursor-pointer ${
                    isActive(item.href) ? "text-[#2D1B0E]" : "text-zinc-500 hover:text-[#2D1B0E]"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
              <Separator className="bg-[#2D1B0E]/10" />
              <Link
                href="/templates/impact-56/vins"
                className="px-6 py-4 bg-[#2D1B0E] text-white text-sm font-bold tracking-widest uppercase cursor-pointer text-center font-sans"
                style={{ textDecoration: "none" }}
              >
                Accéder aux Vins
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── PAGE CONTENT ─── */}
      <div className="pt-24">{children}</div>

      {/* ─── FOOTER (always visible) ─── */}
      <footer className="bg-[#1A1A1A] pt-32 pb-12 text-zinc-400 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <Link
                href="/templates/impact-56"
                className="flex flex-col items-start gap-1 mb-8 cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <span className="text-2xl font-serif tracking-[0.2em] uppercase text-white">
                  Château Vestige
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#C4A265]">Margaux</span>
              </Link>
              <p className="text-sm leading-relaxed mb-8">
                1er Grand Cru Classé. Un patrimoine viticole d'exception cultivé avec passion depuis 1789.
              </p>
              <div className="flex gap-4">
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#2D1B0E] transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                </button>
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-white hover:bg-[#2D1B0E] transition-colors cursor-pointer">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Le Domaine</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/templates/impact-56/terroir" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                    Le Terroir
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-56/terroir" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                    La Vinification
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-56/visite" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                    Visites & Expériences
                  </Link>
                </li>
                <li>
                  <Link href="/templates/impact-56/contact" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Les Vins</h4>
              <ul className="space-y-4">
                {WINES.map(w => (
                  <li key={w.id}>
                    <Link href="/templates/impact-56/vins" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                      {w.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/templates/impact-56/commande" className="hover:text-white transition-colors text-sm cursor-pointer" style={{ textDecoration: "none", color: "inherit" }}>
                    Commander en ligne
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Contact & Visite</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-sm">
                  <MapPin className="w-5 h-5 text-[#C4A265] shrink-0" />
                  <span>Appellation Margaux<br />Gironde, France<br /><span className="text-xs text-zinc-500">Adresse sur demande</span></span>
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Phone className="w-5 h-5 text-[#C4A265]" /> +33 (0)5 56 00 00 00
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Mail className="w-5 h-5 text-[#C4A265]" /> contact@aevia.io
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
            <p>&copy; 2026 Château Vestige — Valentin Milliand. L'abus d'alcool est dangereux pour la santé.</p>
            <div className="flex gap-8">
              <Link
                href="/templates/impact-56/legal"
                className="hover:text-white transition-colors cursor-pointer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Mentions Légales
              </Link>
              <Link
                href="/templates/impact-56/legal"
                className="hover:text-white transition-colors cursor-pointer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Confidentialité
              </Link>
              <Link
                href="/templates/impact-56/legal"
                className="hover:text-white transition-colors cursor-pointer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
