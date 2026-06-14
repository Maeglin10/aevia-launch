"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { C, NAV_LINKS, MagneticButton } from "./shared";

export default function SereneRetreatLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/templates/impact-43" || pathname === "/templates/impact-43/";
  // Solid navbar on sub-pages or scrolled home page
  const solidNav = scrolled || !isHome;

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: C.fontSans, display: "flex", flexDirection: "column" }}>
      {/* Global CSS Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        @keyframes ripple-out {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
        .ripple-ring {
          animation: ripple-out 3.5s ease-out infinite;
        }
        .ripple-ring:nth-child(2) { animation-delay: 1.1s; }
        .ripple-ring:nth-child(3) { animation-delay: 2.2s; }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float-anim { animation: float-up 6s ease-in-out infinite; }

        /* Hide default scrollbars but keep functionality if needed */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${C.cream};
        }
        ::-webkit-scrollbar-thumb {
          background: ${C.sage};
          border-radius: 3px;
        }
      `}} />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: solidNav ? `rgba(253,251,247,0.96)` : "transparent",
          backdropFilter: solidNav ? "blur(12px)" : "none",
          borderBottom: solidNav ? `1px solid ${C.mist}` : "none",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <Link
          href="/templates/impact-43"
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: solidNav ? C.charcoal : C.white,
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "color 0.4s",
            textDecoration: "none",
          }}
        >
          Serene Retreat
        </Link>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 36 }} className="hidden lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: C.fontSans,
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: active ? C.gold : (solidNav ? C.charcoal : "rgba(255,255,255,0.9)"),
                    padding: 0,
                    transition: "color 0.3s, opacity 0.3s",
                    display: "block",
                    textDecoration: "none",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link href="/templates/impact-43/contact" style={{ textDecoration: "none" }}>
            <MagneticButton
              style={{
                background: C.gold,
                color: C.charcoal,
                border: "none",
                padding: "10px 24px",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Book Now
            </MagneticButton>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 22,
                  height: 1.5,
                  background: solidNav ? C.charcoal : C.white,
                  display: "block",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translateY(6.5px)"
                      : menuOpen && i === 1
                      ? "scaleX(0)"
                      : menuOpen && i === 2
                      ? "rotate(-45deg) translateY(-6.5px)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              background: C.cream,
              zIndex: 998,
              padding: "32px 48px",
              borderBottom: `1px solid ${C.mist}`,
              boxShadow: "0 20px 60px rgba(44,48,40,0.1)",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: C.font,
                    fontSize: 28,
                    color: C.charcoal,
                    padding: "10px 0",
                    fontWeight: 300,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: C.charcoal,
          padding: "56px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <Link
          href="/templates/impact-43"
          style={{
            fontFamily: C.font,
            fontSize: 22,
            fontWeight: 400,
            color: C.white,
            letterSpacing: "0.06em",
            fontStyle: "italic",
            textDecoration: "none",
          }}
        >
          Serene Retreat
        </Link>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em",
          }}
        >
          © 2026 Aevia WS — SIREN 852 546 225. Tous droits réservés. Chartreuse Massif, France.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/templates/impact-43/legal" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Mentions Légales
            </button>
          </Link>
          <Link href="/templates/impact-43/legal" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Confidentialité
            </button>
          </Link>
          <Link href="/templates/impact-43/contact" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.fontSans,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Contact
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
