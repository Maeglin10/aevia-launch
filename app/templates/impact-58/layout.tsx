"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, StyleInjector, NAV_LINKS } from "./shared";

export default function SkewLayout({
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
    if (href === "/templates/impact-58") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <StyleInjector />

      {/* Scroll progress */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.violet, width: progressWidth, zIndex: 200 }} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          opacity: navOpacity,
          background: "rgba(7,7,10,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/templates/impact-58" style={{ textDecoration: "none", color: C.text, fontFamily: "'Syne', sans-serif", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.05em" }}>
          SKEW<span style={{ color: C.violet }}>.</span>
        </Link>
        <div style={{ display: "flex", gap: "3rem" }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: "0.7rem",
                color: isActive(item.href) ? C.violetLight : C.textMuted,
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.violetLight}
              onMouseLeave={e => e.currentTarget.style.color = isActive(item.href) ? C.violetLight : C.textMuted}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/templates/impact-58/contact"
          style={{
            background: "transparent",
            border: `1px solid ${C.borderBright}`,
            color: C.textMuted,
            padding: "0.5rem 1.25rem",
            fontFamily: "'Syne Mono', monospace",
            fontSize: "0.65rem",
            cursor: "pointer",
            transition: "all 0.3s",
            letterSpacing: "0.1em",
            textDecoration: "none"
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.violet; e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = C.text }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.color = C.textMuted }}
        >
          START PROJECT
        </Link>
      </motion.nav>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }} className="grid grid-cols-1 md:grid-cols-4">
          <div>
            <Link href="/templates/impact-58" style={{ textDecoration: "none", fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: C.text, marginBottom: "1rem", display: "block" }}>
              SKEW<span style={{ color: C.violet }}>.</span>
            </Link>
            <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem", color: C.textDim, lineHeight: 1.8 }}>
              Motion design · Brand films · VFX<br />Paris, France
            </p>
          </div>
          {[
            { title: "WORK", items: [{ label: "All Projects", href: "/templates/impact-58/work" }, { label: "Films", href: "/templates/impact-58/work" }] },
            { title: "STUDIO", items: [{ label: "About", href: "/templates/impact-58/studio" }, { label: "Awards", href: "/templates/impact-58/studio" }] },
            { title: "CONTACT", items: [{ label: "New Projects", href: "/templates/impact-58/contact" }, { label: "Mentions Légales", href: "/legal/mentions-legales" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = C.violetLight}
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
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            © 2025 SKEW STUDIO — Valentin Milliand. ALL RIGHTS RESERVED.
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            PARIS · MOTION · FILM
          </div>
        </div>
      </footer>
    </div>
  );
}
