"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { T, GLOBAL_CSS, FontInjector, NAV_LINKS } from "./shared";

export default function Impact51Layout({
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-51") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen selection:bg-indigo-500 selection:text-white"
      style={{
        backgroundColor: T.bg,
        color: T.text,
        fontFamily: T.bodyFont,
      }}
    >
      <FontInjector />
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* =====================================================================
          NAVBAR
          ===================================================================== */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 h-[70px] px-6 md:px-10 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-[#e4e4e7] shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/templates/impact-51" className="flex items-center gap-2.5">
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
          <div className="w-[34px] h-[34px] rounded-lg bg-[#6366f1] flex items-center justify-center">
            <Zap className="w-[18px] h-[18px] text-white" />
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: T.headingFont }}
          >
            Nexus
          </span>
        </>
          )}</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-[#6366f1]"
                  : "text-[#6b7280] hover:text-[#0f0f0f]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/templates/impact-51/contact"
            className="text-sm font-semibold text-[#6b7280] hover:text-[#0f0f0f] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/templates/impact-51/contact"
            className="px-5 py-2.5 bg-[#0f0f0f] text-white text-sm font-semibold rounded-lg hover:bg-[#1a1a1a] transition-all"
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 md:hidden text-[#6b7280] hover:text-[#0f0f0f]"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-white border-b border-[#e4e4e7] py-6 px-6 md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2 ${
                    isActive(link.href) ? "text-[#6366f1]" : "text-[#6b7280]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[#e4e4e7] my-2" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/templates/impact-51/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-semibold text-[#6b7280] hover:bg-zinc-50 rounded-lg border border-[#e4e4e7]"
                >
                  Sign in
                </Link>
                <Link
                  href="/templates/impact-51/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-semibold text-white bg-[#0f0f0f] rounded-lg hover:bg-zinc-900 block"
                >
                  Start free trial
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
      <footer className="bg-[#f4f4f5] border-t border-[#e4e4e7] pt-24 pb-12 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div>
              <Link
                href="/templates/impact-51"
                className="flex items-center gap-2.5 mb-6"
              >
                <div className="w-[30px] h-[30px] rounded-lg bg-[#6366f1] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span
                  className="font-bold text-base tracking-tight"
                  style={{ fontFamily: T.headingFont }}
                >
                  Nexus
                </span>
              </Link>
              <p className="text-sm text-[#6b7280] leading-relaxed max-w-sm mb-6">
                Decentralized premium SaaS analytics and pipeline logic systems.
                Simplifying complex workflows since 2024.
              </p>
            </div>

            {/* Links Columns */}
            {[
              {
                title: "Product",
                items: [
                  { label: "Features", href: "/templates/impact-51" },
                  { label: "Integrations", href: "/templates/impact-51" },
                  { label: "Pricing", href: "/templates/impact-51/pricing" },
                ],
              },
              {
                title: "Company",
                items: [
                  { label: "About", href: "/templates/impact-51/about" },
                  { label: "Blog", href: "/templates/impact-51/blog" },
                  { label: "Contact", href: "/templates/impact-51/contact" },
                ],
              },
              {
                title: "Legal",
                items: [
                  { label: "Mentions légales", href: "/templates/impact-51/legal" },
                  { label: "Privacy Policy", href: "/templates/impact-51/legal" },
                  { label: "Terms of Service", href: "/templates/impact-51/legal" },
                ],
              },
            ].map((col, idx) => (
              <div key={idx} className="space-y-6">
                <h4
                  className="text-xs font-semibold uppercase tracking-wider text-[#0f0f0f]"
                  style={{ fontFamily: T.headingFont }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#6b7280] hover:text-[#0f0f0f] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-[#e4e4e7] flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#6b7280]">
            <span>
              © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés.
            </span>
            <div className="flex gap-8">
              <Link
                href="/templates/impact-51/legal"
                className="hover:text-[#0f0f0f] transition-colors"
              >
                Mentions Légales
              </Link>
              <Link
                href="/templates/impact-51/contact"
                className="hover:text-[#0f0f0f] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
