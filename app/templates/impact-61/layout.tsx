"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, StyleInjector, MagneticButton } from "./shared";

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.04], ["rgba(255,255,255,0)", "rgba(255,255,255,0.97)"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-61") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Projets", href: "/templates/impact-61/projets" },
    { label: "Studio", href: "/templates/impact-61/studio" },
    { label: "Contact", href: "/templates/impact-61/contact" },
  ] as const;
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <StyleInjector />

      {/* Progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.gold, width: progressWidth, zIndex: 200 }} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/templates/impact-61" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.12em", color: C.text, textDecoration: "none" }}>
          SEGMENT
        </Link>
        <div id="mb61-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.8rem",
                color: isActive(link.href) ? C.text : C.textMuted,
                fontWeight: isActive(link.href) ? 600 : 400,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
      </div>
        <button
          className="mb61-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
        <Link href="/templates/impact-61/contact" style={{ textDecoration: "none" }}>
          <MagneticButton
            style={{
              background: C.bgDark,
              color: C.textLight,
              border: "none",
              padding: "0.5rem 1.5rem",
              fontFamily: "'Archivo', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            CONTACT
          </MagneticButton>
        </Link>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.8rem",
                color: isActive(link.href) ? C.text : C.textMuted,
                fontWeight: isActive(link.href) ? 600 : 400,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb61-nav { display: none !important; } .mb61-burger { display: flex !important; } }`}</style>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid #222`, padding: "5rem 3rem 3rem", background: C.bgDark }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.12em", color: C.textLight, marginBottom: "1rem" }}>
              SEGMENT
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#444", marginBottom: "1.5rem" }}>
              ARCHITECTES · PARIS
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#666", lineHeight: 1.65, maxWidth: "30ch" }}>
              Architecture pour ceux qui croient que la forme suit le vide autant que la fonction.
            </p>
          </div>
          {[
            { title: "PROJETS", items: [{ n: "Résidentiel", h: "/templates/impact-61/projets" }, { n: "Tertiaire", h: "/templates/impact-61/projets" }, { n: "Culturel", h: "/templates/impact-61/projets" }, { n: "Public", h: "/templates/impact-61/projets" }] },
            { title: "STUDIO", items: [{ n: "Philosophie", h: "/templates/impact-61/studio" }, { n: "Équipe", h: "/templates/impact-61/studio" }, { n: "Distinctions", h: "/templates/impact-61/studio" }] },
            { title: "CONTACT", items: [{ n: "Nouveau projet", h: "/templates/impact-61/contact" }, { n: "Presse", h: "/templates/impact-61/contact" }, { n: "Recrutement", h: "/templates/impact-61/contact" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#444", marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <Link
                    key={item.n}
                    href={item.h}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#777", textDecoration: "none", cursor: "pointer" }}
                  >
                    {item.n}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "4rem auto 0", paddingTop: "2rem", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#444" }}>
            © {new Date().getFullYear()} SEGMENT ARCHITECTES. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/templates/impact-61/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: "#444", textDecoration: "none", cursor: "pointer" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-61/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: "#444", textDecoration: "none", cursor: "pointer" }}>
              Confidentialité
            </Link>
            <Link href="/templates/impact-61/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: "#444", textDecoration: "none", cursor: "pointer" }}>
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
