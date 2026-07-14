"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CypherClinicLayout({
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
  const basePath = "/templates/impact-84";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Protocoles", href: `${basePath}/protocoles` },
    { label: "L'équipe", href: `${basePath}/equipe` },
    { label: "Rendez-vous", href: `${basePath}/rdv` },
    { label: "Résultats", href: `${basePath}/resultats` },
    { label: "Contact", href: `${basePath}/contact` },
  ];

  return (
    <div className="min-h-dvh bg-[#0C0C0A] text-[#F0EBE0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0C0C0A]/95 backdrop-blur-md border-b border-[#2A2520] py-5" : "bg-transparent py-7"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href={basePath} className="flex flex-col">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <span className="text-xl font-light tracking-[0.25em] uppercase" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Cypher Clinic
            </span>
            <span className="text-[8px] tracking-[0.4em] uppercase text-[#C9A86C] mt-0.5">Médecine Esthétique & Lasers</span>
          </>
            )}</Link>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.2em] uppercase text-[#8A8278]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-[#F0EBE0] transition-colors duration-200 ${isActive ? "text-[#C9A86C]" : "text-[#8A8278]"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={`${basePath}/rdv`} className="ml-2 px-5 py-2.5 border border-[#C9A86C] text-xs tracking-widest uppercase text-[#C9A86C] hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
              Consultation
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#0C0C0A] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2520]">
              <span className="text-xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>Cypher Clinic</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5 text-white" /></button>
            </div>
            <div className="flex flex-col gap-10 p-10">
              {links.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)}
                    className="text-4xl font-light text-[#F0EBE0] hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Bodoni Moda', serif" }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20">{children}</div>

      {/* Footer */}
      <footer className="bg-[#090908] border-t border-[#2A2520] py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="text-[#F0EBE0] font-light text-2xl mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>Cypher Clinic</div>
              <div className="text-xs text-[#C9A86C] tracking-widest uppercase mb-4">Institut de Médecine Esthétique de Précision</div>
              <p className="text-sm text-[#5A5248] leading-relaxed max-w-sm">Une expertise médicale rigoureuse pour des résultats naturels et durables. Bilan morphologique personnalisé.</p>
            </div>
            <div>
              <p className="text-[#F0EBE0] text-[10px] tracking-widest uppercase mb-5">Navigation</p>
              {links.map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-[#8A8278] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-[#F0EBE0] text-[10px] tracking-widest uppercase mb-5">Support</p>
              <Link href="/templates/impact-84/legal" className="block text-sm text-[#8A8278] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">Mentions légales</Link>
              <Link href="/templates/impact-84/legal" className="block text-sm text-[#8A8278] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">Politique de confidentialité</Link>
              <Link href="/templates/impact-84/legal" className="block text-sm text-[#8A8278] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">CGU</Link>
              <Link href={`${basePath}/contact`} className="block text-sm text-[#8A8278] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">Nous trouver</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-[#1A1715] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#3A3028]">
            <span>© {new Date().getFullYear()} Cypher Clinic — Tous droits réservés</span>
            <span>Paris // France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
