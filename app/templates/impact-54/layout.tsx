"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StyleInjector, NAV_LINKS, GLOBAL_STYLES } from "./shared";

export default function Impact54Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-54") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen text-[#e8e8ff] overflow-x-hidden selection:bg-purple-600 selection:text-white"
      style={{
        backgroundColor: "#050510",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StyleInjector />
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Ambient scan line */}
      <div className="scan-line" />

      {/* =====================================================================
          NAVBAR
          ===================================================================== */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 72,
          background: scrolled ? "rgba(5,5,16,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(124,58,237,0.15)" : "none",
          transition: "background 0.5s, backdrop-filter 0.5s, border-color 0.5s",
        }}
      >
        {/* Logo */}
        <Link href="/templates/impact-54" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #7c3aed, #00ffd1)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles style={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#e8e8ff",
              letterSpacing: "-0.02em",
            }}
          >
            ARTGEN
          </span>
        </Link>

        {/* Links */}
        <div
          className="hidden md:flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(232,232,255,0.5)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                textDecoration: "none",
                color: isActive(link.href) ? "#00ffd1" : "inherit",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/templates/impact-54/contact"
            className="hidden md:inline-block"
            style={{
              textDecoration: "none",
              color: "rgba(232,232,255,0.5)",
              fontSize: 13,
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/templates/impact-54/contact"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: 8,
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              textDecoration: "none",
            }}
          >
            Get Early Access
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              background: "none",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#e8e8ff",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              zIndex: 49,
              background: "rgba(5,5,16,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(124,58,237,0.15)",
              padding: "20px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  color: isActive(link.href) ? "#00ffd1" : "rgba(232,232,255,0.7)",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ height: "1px", background: "rgba(124,58,237,0.15)" }} />
            <Link
              href="/templates/impact-54/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "#e8e8ff",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      <div style={{ paddingTop: 72 }}>{children}</div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer
        style={{
          borderTop: "1px solid rgba(124,58,237,0.12)",
          background: "#03030d",
          padding: "80px 40px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 60,
          }}
          className="grid grid-cols-1 md:grid-cols-4"
        >
          <div className="md:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg, #7c3aed, #00ffd1)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "#fff" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#e8e8ff",
                }}
              >
                ARTGEN
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(232,232,255,0.4)", lineHeight: 1.6, maxWidth: 300 }}>
              The generative product engine for modern studios. Infinite canvas synthesis on direct GPU networks.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "/templates/impact-54" },
                { label: "Pricing", href: "/templates/impact-54/pricing" },
                { label: "Developer API", href: "/templates/impact-54" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Atelier", href: "/templates/impact-54/about" },
                { label: "Team Blog", href: "/templates/impact-54/blog" },
                { label: "Mentions légales", href: "/legal/mentions-legales" },
              ],
            },
          ].map((col, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e8e8ff" }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        textDecoration: "none",
                        color: "rgba(232,232,255,0.4)",
                        fontSize: 13,
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderTop: "1px solid rgba(232,232,255,0.06)",
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 12,
            color: "rgba(232,232,255,0.3)",
          }}
        >
          <span>
            © 2026 AEVIA WS — SIREN 852 546 225. ALL RIGHTS RESERVED.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            <Link
              href="/legal/mentions-legales"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Mentions Légales
            </Link>
            <Link
              href="/templates/impact-54/contact"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
