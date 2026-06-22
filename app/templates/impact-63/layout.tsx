"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, StyleInjector, HoverGoldLine } from "./shared";

export default function MaisonDrouetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(14,12,10,0)", "rgba(14,12,10,0.95)"]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-63") return pathname === href;
    return pathname.startsWith(href);
  };

  const leftLinks = [
    { label: "Collections", href: "/templates/impact-63/collections" },
    { label: "Savoir-Faire", href: "/templates/impact-63/savoir-faire" },
  ] as const;

  const rightLinks = [
    { label: "L'Atelier", href: "/templates/impact-63/atelier" },
    { label: "Contact", href: "/templates/impact-63/contact" },
  ] as const;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'EB Garamond', serif", minHeight: "100vh", overflowX: "clip" }}>
      <StyleInjector />

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left nav links */}
        <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: isActive(link.href) ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {link.label.toUpperCase()}
              {isActive(link.href) && (
                <motion.div layoutId="nav-active" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
            </Link>
          ))}
        </div>

        {/* Logo center */}
        <Link href="/templates/impact-63" style={{ textAlign: "center", flex: 1, textDecoration: "none", cursor: "pointer" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.goldDim }}>MAISON</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.15em", color: C.text, lineHeight: 1 }}>
            DROUET
          </div>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.5rem", letterSpacing: "0.3em", color: C.textDim }}>GENÈVE · 1891</div>
        </Link>

        {/* Right nav links */}
        <div style={{ display: "flex", gap: "2rem", flex: 1, justifyContent: "flex-end" }}>
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: isActive(link.href) ? C.gold : C.textMuted,
                cursor: "pointer",
                position: "relative",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {link.label.toUpperCase()}
              {isActive(link.href) && (
                <motion.div layoutId="nav-active-r" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "1px", background: C.gold }} />
              )}
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* ── Main content ── */}
      <div style={{ paddingTop: "70px" }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid #222`, padding: "5rem 3rem 3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: C.goldDim, marginBottom: "0.5rem" }}>MAISON</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, letterSpacing: "0.15em", color: C.text, marginBottom: "1rem" }}>
              DROUET
            </div>
            <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.65, maxWidth: "32ch" }}>
              Haute Horlogerie Genevoise depuis 1891. Une quête permanente d'excellence, de rareté et de précision.
            </p>
          </div>
          {[
            { title: "COLLECTIONS", items: [{ n: "Complications", h: "/templates/impact-63/collections" }, { n: "Classic", h: "/templates/impact-63/collections" }, { n: "Sport", h: "/templates/impact-63/collections" }] },
            { title: "SAVOIR-FAIRE", items: [{ n: "Guillochage", h: "/templates/impact-63/savoir-faire" }, { n: "Anglage", h: "/templates/impact-63/savoir-faire" }, { n: "Mise au Point", h: "/templates/impact-63/savoir-faire" }] },
            { title: "LA MAISON", items: [{ n: "L'Atelier", h: "/templates/impact-63/atelier" }, { n: "Bespoke", h: "/templates/impact-63/atelier" }, { n: "Contact", h: "/templates/impact-63/contact" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <Link
                    key={item.n}
                    href={item.h}
                    style={{ fontSize: "0.85rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
                  >
                    {item.n}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "4rem auto 0", paddingTop: "2rem", borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.textDim }}>
            © {new Date().getFullYear()} MAISON DROUET. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/templates/impact-63/legal" style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-63/legal" style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }}>
              Confidentialité
            </Link>
            <Link href="/templates/impact-63/legal" style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }}>
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
