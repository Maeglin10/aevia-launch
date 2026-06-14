"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useTransform, motion } from "framer-motion";
import { C, FONT_LABEL, FONT_HEADING } from "./shared";
import "../premium.css";

export default function AureliusHeritageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const basePath = "/templates/impact-83";
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(26,15,5,0)", "rgba(26,15,5,0.97)"]);

  const links = [
    { label: "Collections", href: `${basePath}/collections` },
    { label: "Horlogerie", href: `${basePath}/horlogerie` },
    { label: "Sur Mesure", href: `${basePath}/sur-mesure` },
    { label: "Maison", href: `${basePath}/maison` },
    { label: "Contact", href: `${basePath}/contact` },
  ];

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily: FONT_HEADING,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.accentGlow}; color: ${C.accent}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accentDark}; border-radius: 2px; }
      `}</style>

      {/* Grain texture */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.04,
          filter: "url(#grain)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Ornamental lines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(${C.borderGold} 1px, transparent 1px), linear-gradient(90deg, ${C.borderGold} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          borderBottom: `1px solid rgba(201,169,110,0.1)`,
          backdropFilter: "blur(12px)",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <Link href={basePath} style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
          <span style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 300, color: C.accent, letterSpacing: "0.12em" }}>
            AURELIUS
          </span>
          <span style={{ fontFamily: FONT_LABEL, fontSize: 9, letterSpacing: "0.35em", color: C.textMuted, textTransform: "uppercase" }}>
            Heritage · Est. 1887
          </span>
        </Link>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: FONT_LABEL,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isActive ? C.accent : C.textMuted,
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href={`${basePath}/contact`}>
            <button
              style={{
                fontFamily: FONT_LABEL,
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.bg,
                background: C.accent,
                padding: "10px 24px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Rendez-vous privé
            </button>
          </Link>
        </div>
      </motion.nav>

      <div style={{ paddingTop: 72 }}>{children}</div>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          padding: "100px 48px 48px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 60,
            marginBottom: 80,
          }}
        >
          <div>
            <h4 style={{ fontFamily: FONT_HEADING, fontSize: 20, color: C.accent, marginBottom: 20, fontWeight: 300 }}>
              AURELIUS HERITAGE
            </h4>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
              Maison de haute joaillerie et d&apos;horlogerie de prestige fondée en 1887.
            </p>
          </div>
          <div>
            <h5 style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", color: C.accent, marginBottom: 24 }}>
              COLLECTIONS
            </h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              <li><Link href={`${basePath}/collections`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Haute Joaillerie</Link></li>
              <li><Link href={`${basePath}/horlogerie`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Horlogerie</Link></li>
              <li><Link href={`${basePath}/sur-mesure`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Création Sur Mesure</Link></li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.2em", color: C.accent, marginBottom: 24 }}>
              MAISON
            </h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              <li><Link href={`${basePath}/maison`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Histoire & Savoir-faire</Link></li>
              <li><Link href={`${basePath}/legal`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Mentions Légales</Link></li>
              <li><Link href={`${basePath}/legal`} style={{ textDecoration: "none", color: C.textMuted, fontSize: 14 }}>Sécurité & Assurance</Link></li>
            </ul>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderTop: `1px solid ${C.border}`,
            paddingTop: 40,
            display: "flex",
            justifyContent: "between",
            flexWrap: "wrap",
            gap: 20,
            fontSize: 12,
            color: C.textMuted,
            fontFamily: FONT_LABEL,
          }}
        >
          <span>© {new Date().getFullYear()} Aurelius Heritage. Tous droits réservés.</span>
          <span>Paris — Genève — Tokyo</span>
        </div>
      </footer>
    </div>
  );
}
