"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Instagram, Twitter } from "./shared";

export default function VogueNoireLayout({
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const basePath = "/templates/impact-81";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Éditoriaux", href: `${basePath}/editoriaux` },
    { label: "Magazine", href: `${basePath}/magazine` },
    { label: "Maisons", href: `${basePath}/maisons` },
    { label: "Boutiques", href: `${basePath}/boutiques` },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A08] text-[#F0EBE0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
      `}</style>
      
      <motion.div className="fixed top-0 left-0 h-[1px] bg-[#F0EBE0] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0A0A08]/95 backdrop-blur-md border-b border-[#2A2A20] py-5" : "bg-transparent py-7"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href={basePath} className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>Vogue Noire</>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.15em] uppercase text-[#A0988A]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-[#F0EBE0] transition-colors duration-200 ${isActive ? "text-[#F0EBE0]" : "text-[#A0988A]"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={`${basePath}/subscribe`} className="ml-4 px-5 py-2.5 border border-[#A0988A] text-xs tracking-widest uppercase hover:bg-[#F0EBE0] hover:text-[#0A0A08] transition-all duration-300 cursor-pointer">
              S&apos;abonner
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#0A0A08] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A20]">
              <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Vogue Noire</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-10 p-10">
              {links.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)}
                    className="text-4xl font-light text-[#F0EBE0] hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                <Link href={`${basePath}/subscribe`} onClick={() => setMenuOpen(false)}
                  className="text-4xl font-light text-[#C9A86C] hover:text-[#F0EBE0] transition-colors cursor-pointer"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  S&apos;abonner
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20">{children}</div>

      {/* Footer */}
      <footer className="bg-[#0A0A08] border-t border-[#2A2A20] py-14 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Vogue Noire</div>
              <p className="text-sm text-[#6A6058] leading-relaxed max-w-xs">Magazine de mode, culture et création. Depuis 1998, la voix de la mode contemporaine.</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#3A3028] mb-5">Navigation</p>
              {links.map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-[#6A6058] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#3A3028] mb-5">Suivez-nous</p>
              {[["Instagram", "@vogue.noire"], ["Twitter", "@VogueNoire"], ["Pinterest", "Vogue Noire"]].map(([network, handle]) => (
                <p key={network} className="text-sm text-[#6A6058] mb-3">{network} <span className="text-[#C9A86C]">{handle}</span></p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#1A1A14] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#3A3028]">
            <span>© 2025 Vogue Noire — Tous droits réservés</span>
            <div className="flex gap-6">
              <Link href="/templates/impact-81/legal" className="hover:text-[#F0EBE0] transition-colors cursor-pointer">Mentions légales</Link>
              <Link href="/templates/impact-81/legal" className="hover:text-[#F0EBE0] transition-colors cursor-pointer">Politique de confidentialité</Link>
              <Link href="/templates/impact-81/legal" className="hover:text-[#F0EBE0] transition-colors cursor-pointer">CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
