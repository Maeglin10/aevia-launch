"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, CustomCursor, StyleInjector, NAV_LINKS } from "./shared";

export default function MaskUnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const navOpacity = useTransform(scrollYProgress, [0, 0.04], [0.8, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-57") return pathname === href;
    return pathname.startsWith(href);
  };
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <StyleInjector />
      <CustomCursor />

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          background: C.accent,
          width: progressWidth,
          zIndex: 200,
          transformOrigin: "left",
        }}
      />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          opacity: navOpacity,
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/templates/impact-57" style={{ textDecoration: "none", color: C.text, fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em" }}>
          MASK<span style={{ color: C.accent }}>_</span>UNIT
        </Link>
        <div id="mb57-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                color: isActive(item.href) ? C.accent : C.textMuted,
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = isActive(item.href) ? C.accent : C.textMuted}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
      </div>
        <button
          className="mb57-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
        <Link
          href="/templates/impact-57/contact"
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textMuted,
            padding: "0.5rem 1.25rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.accent; e.currentTarget.style.color = C.bg }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = C.textMuted }}
        >
          START A PROJECT
        </Link>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                color: isActive(item.href) ? C.accent : C.textMuted,
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = isActive(item.href) ? C.accent : C.textMuted}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb57-nav { display: none !important; } .mb57-burger { display: flex !important; } }`}</style>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }} className="grid grid-cols-1 md:grid-cols-4">
          <div>
            <Link href="/templates/impact-57" style={{ textDecoration: "none", fontFamily: "'Space Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", display: "block" }}>
              MASK<span style={{ color: C.accent }}>_</span>UNIT
            </Link>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: C.textDim, lineHeight: 1.8, maxWidth: "32ch" }}>
              Studio créatif indépendant. Paris, France. Branding · Motion · Digital.
            </p>
          </div>
          {[
            { title: "WORK", items: [{ label: "Selected Projects", href: "/templates/impact-57/work" }, { label: "All Work", href: "/templates/impact-57/work" }] },
            { title: "STUDIO", items: [{ label: "About", href: "/templates/impact-57/studio" }, { label: "Team", href: "/templates/impact-57/studio" }] },
            { title: "CONTACT", items: [{ label: "Start a Project", href: "/templates/impact-57/contact" }, { label: "Mentions Légales", href: "/templates/impact-57/legal/mentions-legales" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = C.accent}
                    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }} className="flex flex-col md:row items-center gap-4 text-center">
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            © 2025 MASK UNIT STUDIO — Valentin Milliand. ALL RIGHTS RESERVED.
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            PARIS · BRANDING · MOTION · DIGITAL
          </div>
        </div>
      </footer>
    </div>
  );
}
