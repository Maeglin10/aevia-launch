"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  C,
  GLOBAL_CSS,
  NAV_LINKS,
  FOOTER_LINKS,
  ScrollProgressBar,
  useFonts,
} from "./shared";

export default function Impact49Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useFonts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-49") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen text-[#4B5563]"
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <ScrollProgressBar />

      {/* =====================================================================
          NAVBAR
          ===================================================================== */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#F5F3FF]/80 backdrop-blur-lg border-b border-[#E0E7FF] py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/templates/impact-49" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-[#1E1B4B]">
              SKILLBRIDGE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-[#6366F1]"
                    : "text-[#1E1B4B] hover:text-[#6366F1]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/templates/impact-49/contact"
              className="text-sm font-bold text-[#1E1B4B] hover:text-[#6366F1] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/templates/impact-49/contact"
              className="px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-bold hover:bg-[#4F46E5] transition-all flex items-center gap-2"
            >
              Rejoindre
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Btn */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-[#1E1B4B] hover:text-[#6366F1] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[77px] z-40 bg-white border-b border-[#E5E7EB] py-6 px-6 md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold py-2 ${
                    isActive(link.href) ? "text-[#6366F1]" : "text-[#1E1B4B]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[#E5E7EB] my-2" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/templates/impact-49/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold text-[#1E1B4B] hover:bg-[#F9FAFB] rounded-xl transition-colors border border-[#E5E7EB] block"
                >
                  Se connecter
                </Link>
                <Link
                  href="/templates/impact-49/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold text-white bg-[#6366F1] rounded-xl hover:bg-[#4F46E5] transition-all block"
                >
                  Rejoindre gratuitement
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      {children}

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer className="bg-[#1E1B4B] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top footer */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">
                  SKILLBRIDGE
                </span>
              </div>
              <p className="text-sm text-[#A5B4FC] leading-relaxed mb-6">
                La plateforme de formation en ligne qui transforme votre expertise
                en opportunités réelles.
              </p>
              <div className="flex gap-3">
                {["TW", "LI", "YT", "IG"].map((social) => (
                  <div
                    key={social}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#818CF8] hover:bg-[#6366F1] hover:border-[#6366F1] hover:text-white transition-all cursor-pointer"
                  >
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href={
                          link.toLowerCase().includes("tarif")
                            ? "/templates/impact-49/pricing"
                            : link.toLowerCase().includes("aide") || link.toLowerCase().includes("contact")
                            ? "/templates/impact-49/contact"
                            : "/templates/impact-49/about"
                        }
                        className="text-sm text-[#818CF8] hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom footer */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6366F1]/60">
              © 2026 Skillbridge. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {[
                { label: "Confidentialité", href: "/legal/confidentialite" },
                { label: "CGU", href: "/legal/cgu" },
                { label: "Cookies", href: "/legal/cgu" },
                { label: "Mentions légales", href: "/legal/mentions-legales" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-[#818CF8]/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
