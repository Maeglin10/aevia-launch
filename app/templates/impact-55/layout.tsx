"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StyleInjector, RAIN_COLUMNS, NAV_LINKS } from "./shared";

export default function GhostShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/templates/impact-55") return pathname === href;
    return pathname.startsWith(href);
  };

  const mono: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };

  return (
    <div style={{ ...mono, backgroundColor: "#000", color: "#00FF41", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <StyleInjector />

      {/* ── CODE RAIN BACKGROUND ───────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.18,
      }}>
        {RAIN_COLUMNS.map((col, i) => (
          <div key={i} style={{
            position: "absolute",
            left: col.left,
            top: 0,
            writingMode: "vertical-rl",
            fontSize: "12px",
            color: "#00FF41",
            letterSpacing: "4px",
            animation: `code-rain ${col.duration} linear ${col.delay} infinite`,
            userSelect: "none",
          }}>
            {col.chars}
          </div>
        ))}
      </div>

      {/* Scanline overlay */}
      <div className="gs-scanline" />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.92)",
        borderBottom: "1px solid #008F11",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "52px",
        backdropFilter: "blur(4px)",
      }}>
        <Link href="/templates/impact-55" style={{ textDecoration: "none", color: "#00FF41", fontSize: "13px", fontWeight: "bold", letterSpacing: "0.06em" }}>
          [GHOST_SHELL v2.4.1]
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{
              color: isActive(link.href) ? "#00FF41" : "#008F11",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#00FF41")}
            onMouseLeave={e => (e.currentTarget.style.color = isActive(link.href) ? "#00FF41" : "#008F11")}
            >{link.label}</Link>
          ))}
          <Link href="/templates/impact-55/contact" style={{
            border: "1px solid #00FF41",
            backgroundColor: "transparent",
            color: "#00FF41",
            fontSize: "11px",
            padding: "6px 16px",
            letterSpacing: "0.12em",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#00FF41"; e.currentTarget.style.color = "#000" }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#00FF41" }}
          >[CONNECT]</Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <main style={{ position: "relative", zIndex: 10, paddingTop: "52px" }}>
        {children}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        borderTop: "1px solid #003300",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        backgroundColor: "rgba(0,0,0,0.96)",
      }}>
        <span style={{ color: "#008F11", fontSize: "12px", letterSpacing: "0.08em" }}>
          &gt; logout // Ghost Shell © 2026 // All systems nominal
        </span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link href="/legal/mentions-legales" style={{ color: "#008F11", fontSize: "11px", textDecoration: "none", letterSpacing: "0.06em" }} onMouseEnter={e => e.currentTarget.style.color = "#00FF41"} onMouseLeave={e => e.currentTarget.style.color = "#008F11"}>
            [MENTIONS]
          </Link>
          <Link href="/legal/confidentialite" style={{ color: "#008F11", fontSize: "11px", textDecoration: "none", letterSpacing: "0.06em" }} onMouseEnter={e => e.currentTarget.style.color = "#00FF41"} onMouseLeave={e => e.currentTarget.style.color = "#008F11"}>
            [PRIVACY]
          </Link>
          <Link href="/legal/cgu" style={{ color: "#008F11", fontSize: "11px", textDecoration: "none", letterSpacing: "0.06em" }} onMouseEnter={e => e.currentTarget.style.color = "#00FF41"} onMouseLeave={e => e.currentTarget.style.color = "#008F11"}>
            [CGU]
          </Link>
          <span style={{ color: "#003300", fontSize: "11px", letterSpacing: "0.06em" }}>
            [GHOST_SHELL v2.4.1]
          </span>
        </div>
      </footer>
    </div>
  );
}
