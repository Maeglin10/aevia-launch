"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  C,
  F,
  NAV_LINKS,
  CursorTrail,
  GLOBAL_STYLES,
} from "./shared";

export default function Impact52Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-52") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden selection:bg-pink-500 selection:text-white"
      style={{
        backgroundColor: C.BG,
        fontFamily: "'Courier New', monospace",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <CursorTrail />

      {/* =====================================================================
          NAVBAR
          ===================================================================== */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#06000f]/90 backdrop-blur-xl border-b border-[#ff2d78]/20 py-5 px-6 md:px-10 flex items-center justify-between"
      >
        <Link href="/templates/impact-52" className="flex items-center gap-2">
          <Zap
            size={20}
            style={{ color: C.PINK, filter: `drop-shadow(0 0 8px ${C.PINK})` }}
          />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 900,
              color: C.PINK,
              textShadow: `0 0 16px ${C.PINK}, 0 0 32px ${C.PINK}66`,
              letterSpacing: "0.08em",
            }}
          >
            PARTICLE<span style={{ color: `${C.PINK}66` }}> // </span>FIELD
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                color: isActive(link.href) ? C.PINK : C.CYAN,
                textDecoration: "none",
                letterSpacing: "0.2em",
                textShadow: isActive(link.href)
                  ? `0 0 12px ${C.PINK}`
                  : `0 0 8px ${C.CYAN}55`,
                transition: "all 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/templates/impact-52/contact"
            style={{
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.6rem",
              fontWeight: 900,
              color: C.BG,
              background: C.PINK,
              padding: "0.5rem 1.2rem",
              textDecoration: "none",
              letterSpacing: "0.2em",
              boxShadow: `0 0 14px ${C.PINK}88`,
              transition: "all 0.2s",
            }}
          >
            CONNECT
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#00f5ff] hover:text-[#ff2d78]"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: `${C.BG}f8`,
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              borderLeft: `1px solid ${C.PINK}44`,
            }}
          >
            <div className="flex justify-between items-center mb-12">
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: C.PINK,
                  textShadow: `0 0 16px ${C.PINK}`,
                  letterSpacing: "0.08em",
                }}
              >
                PARTICLE // FIELD
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: "none",
                  border: `1px solid ${C.PINK}44`,
                  color: C.PINK,
                  padding: "0.5rem",
                  display: "flex",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: i % 2 === 0 ? C.PINK : C.CYAN,
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    textShadow: `0 0 20px ${i % 2 === 0 ? C.PINK : C.CYAN}88`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/templates/impact-52/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textAlign: "center",
                fontSize: "0.7rem",
                fontWeight: 900,
                color: C.PINK,
                border: `1px solid ${C.PINK}`,
                padding: "1rem",
                textDecoration: "none",
                letterSpacing: "0.3em",
                boxShadow: `0 0 20px ${C.PINK}44`,
              }}
            >
              CONNECT →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      <div style={{ paddingTop: 100 }}>{children}</div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer className="border-t border-[#ff2d78]/20 bg-[#0d0018]/50 py-16 px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Zap
                size={16}
                style={{ color: C.PINK, filter: `drop-shadow(0 0 8px ${C.PINK})` }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: C.PINK,
                  letterSpacing: "0.18em",
                }}
              >
                PARTICLE // FIELD
              </span>
            </div>
            <p className="text-xs text-[#00f5ff]/60 leading-relaxed max-w-sm mb-6">
              Cyber-infrastructure, immersive visual design, void pipeline
              routing. We architect digital ghosts for mission critical systems.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.62rem",
                color: C.PINK,
                letterSpacing: "0.2em",
                marginBottom: "1rem",
              }}
            >
              NAVIGATION
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.58rem",
                      color: C.CYAN,
                      textDecoration: "none",
                      letterSpacing: "0.15em",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.62rem",
                color: C.PINK,
                letterSpacing: "0.2em",
                marginBottom: "1rem",
              }}
            >
              GRID DETAILS
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/legal/mentions-legales"
                  style={{
                    fontSize: "0.58rem",
                    color: C.CYAN,
                    textDecoration: "none",
                    letterSpacing: "0.15em",
                  }}
                  className="hover:text-white transition-colors"
                >
                  LEGAL MENTIONS
                </Link>
              </li>
              <li>
                <Link
                  href="/templates/impact-52/contact"
                  style={{
                    fontSize: "0.58rem",
                    color: C.CYAN,
                    textDecoration: "none",
                    letterSpacing: "0.15em",
                  }}
                  className="hover:text-white transition-colors"
                >
                  TRANSMISSIONS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#ff2d78]/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[0.55rem] text-[#00f5ff]/40 tracking-widest uppercase">
          <span>
            © 2026 AEVIA WS — SIREN 852 546 225. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8">
            <Link
              href="/legal/mentions-legales"
              className="hover:text-white transition-colors"
            >
              Mentions Légales
            </Link>
            <Link
              href="/templates/impact-52/contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
