"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, MagneticButton } from "./shared";

import "../premium.css";

export default function LeaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/templates/impact-69") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Work", href: "/templates/impact-69/work" },
    { label: "Exhibitions", href: "/templates/impact-69/exhibitions" },
    { label: "Prints", href: "/templates/impact-69/prints" },
    { label: "About", href: "/templates/impact-69/about" },
  ];

  return (
    <div style={{ background: C.bg, color: C.cream, minHeight: "100vh", fontFamily: "'Archivo', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.amber}; color: ${C.bg}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.moss}; border-radius: 2px; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,12,6,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <Link href="/templates/impact-69" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {/* Leaf mark */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.moss} strokeWidth="1.5">
            <path d="M12 2C6 2 2 8 2 12c0 5.5 4 9 9 9 1 0 2-.2 3-.5C8 19 6 15 6 12c0-4 4-6 8-6s8 2 8 6-2 7-5 8" />
            <line x1="12" y1="12" x2="12" y2="22" />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", color: C.cream, textTransform: "uppercase" }}>Léa Rousseau</span>
        </Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="flex-nav-69">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                color: isActive(link.href) ? C.cream : C.muted,
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) e.currentTarget.style.color = C.cream;
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) e.currentTarget.style.color = C.muted;
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/templates/impact-69/prints" style={{ textDecoration: "none" }}>
            <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.bg, background: C.moss, padding: "8px 18px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Print Shop
            </MagneticButton>
          </Link>
        </div>
      </nav>

      <div style={{ paddingTop: "64px" }} />

      {/* MAIN CONTENT */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 32px", background: C.bgCard }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="flex-footer-69">
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>© {new Date().getFullYear()} Léa Rousseau. All prints reserved.</p>
          <div style={{ display: "flex", gap: 24 }} className="gap-16-mobile">
            <Link href="/templates/impact-69/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.cream} onMouseLeave={(e) => e.currentTarget.style.color = C.muted}>
              Regulatory
            </Link>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>
              contact@aevia.io
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
