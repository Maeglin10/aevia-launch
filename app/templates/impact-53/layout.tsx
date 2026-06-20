"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { C, FONT_SYNE, FONT_MONO, NAV_LINKS, useFonts } from "./shared";

export default function Impact53Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useFonts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-53") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden selection:bg-red-500 selection:text-white"
      style={{
        backgroundColor: C.black,
        fontFamily: FONT_SYNE,
      }}
    >
      {/* =====================================================================
          NAVBAR
          ===================================================================== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
          borderBottom: scrolled ? `1px solid ${C.dim}` : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          height: "68px",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/templates/impact-53"
          style={{
            fontFamily: FONT_SYNE,
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.05em",
            color: C.white,
            textDecoration: "none",
            userSelect: "none",
          }}
        >
          MESH<span style={{ color: C.red }}>·</span>WARP
        </Link>

        {/* Desktop menu */}
        <div
          className="hidden md:flex"
          style={{
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                fontWeight: 700,
                color: isActive(link.href) ? C.red : C.white,
                textDecoration: "none",
                letterSpacing: "0.28em",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action / Burger */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/templates/impact-53/contact"
            className="hidden md:inline-flex"
            style={{
              fontSize: "0.6rem",
              fontWeight: 800,
              fontFamily: FONT_MONO,
              color: C.white,
              border: `1px solid ${C.white}`,
              padding: "0.45rem 1.1rem",
              textDecoration: "none",
              letterSpacing: "0.22em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.red;
              (e.currentTarget as HTMLElement).style.borderColor = C.red;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = C.white;
            }}
          >
            LET'S TALK
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              color: C.white,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "68px",
              left: 0,
              right: 0,
              zIndex: 90,
              background: "rgba(0,0,0,0.98)",
              backdropFilter: "blur(24px)",
              borderBottom: `1px solid ${C.dim}`,
              padding: "2rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: FONT_SYNE,
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: isActive(link.href) ? C.red : C.white,
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-53/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.75rem",
                color: C.red,
                textDecoration: "none",
                letterSpacing: "0.22em",
                fontWeight: 700,
                marginTop: "1rem",
              }}
            >
              START A PROJECT →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      <div style={{ paddingTop: "68px" }}>{children}</div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer
        style={{
          borderTop: `1px solid ${C.dim}`,
          background: C.black,
          padding: "7rem 2.5rem 4rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(3, 1fr)",
            gap: "4rem",
            marginBottom: "5rem",
          }}
          className="grid grid-cols-1 md:grid-cols-4"
        >
          <div>
            <div
              style={{
                fontFamily: FONT_SYNE,
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: "-0.05em",
                color: C.white,
                marginBottom: "1.5rem",
              }}
            >
              MESH<span style={{ color: C.red }}>·</span>WARP
            </div>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.72rem",
                color: C.dim,
                lineHeight: 1.8,
                maxWidth: "240px",
              }}
            >
              Est. 2019. Art direction, design systems, digital experiences.
              An independent studio engineering brand logics.
            </p>
          </div>

          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                color: C.dim,
                letterSpacing: "0.28em",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              OFFICES
            </span>
            <span
              style={{
                fontFamily: FONT_SYNE,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: C.white,
                display: "block",
                lineHeight: 1.4,
              }}
            >
              Bourg-en-Bresse, <br /> France
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                color: C.dim,
                letterSpacing: "0.28em",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              TRANSMISSIONS
            </span>
            <a
              href="mailto:contact@meshwarp.studio"
              style={{
                fontFamily: FONT_SYNE,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: C.red,
                textDecoration: "none",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              hello@meshwarp.studio
            </a>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.68rem",
                color: C.dim,
              }}
            >
              +33 4 74 12 34 56
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.62rem",
                color: C.dim,
                letterSpacing: "0.28em",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              SOCIAL
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                fontFamily: FONT_MONO,
                fontSize: "0.68rem",
              }}
            >
              {["INSTAGRAM", "TWITTER", "LINKEDIN"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{ color: C.white, textDecoration: "none" }}
                  className="hover:text-red-500 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            borderTop: `1px solid ${C.dim}`,
            paddingTop: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            fontFamily: FONT_MONO,
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            color: C.dim,
          }}
        >
          <span>
            © 2026 AEVIA WS — SIREN 852 546 225. TOUS DROITS RÉSERVÉS.
          </span>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link
              href="/legal/mentions-legales"
              style={{ color: C.white, textDecoration: "none" }}
            >
              MENTIONS LÉGALES
            </Link>
            <Link
              href="/legal/confidentialite"
              style={{ color: C.white, textDecoration: "none" }}
            >
              CONFIDENTIALITÉ
            </Link>
            <Link
              href="/legal/cgu"
              style={{ color: C.white, textDecoration: "none" }}
            >
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
