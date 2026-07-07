// @ts-nocheck
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, MagneticButton } from "./shared";

import "../premium.css";

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
`;

export default function StackUnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isActive = (href: string) => {
    if (href === "/templates/impact-72") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Films", href: "/templates/impact-72/films" },
    { label: "Services", href: "/templates/impact-72/services" },
    { label: "Studio", href: "/templates/impact-72/studio" },
    { label: "Contact", href: "/templates/impact-72/contact" },
  ];
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{FONT}</style>
      <style>{`
        ::-webkit-scrollbar { width: 4px; background: #0A0A14; }
        ::-webkit-scrollbar-thumb { background: #CA8A04; }
      `}</style>

      {/* Progress Bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.amber, width: progressWidth, zIndex: 200 }} />

      {/* Navigation */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(10,10,20,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/templates/impact-72" style={{ textDecoration: "none" }}>
          <div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.08em", color: C.text }}>
              STACK
            </span>
            <span style={{ color: C.amber }}>_</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 300, letterSpacing: "0.08em", color: C.text }}>
              UNIT
            </span>
          </div>
        </Link>
        <div id="mb72-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.78rem",
                color: isActive(href) ? C.amberLight : C.textMuted,
                textDecoration: "none",
                transition: "color 0.2s"
              }}
            >
              {label}
            </Link>
          ))}
      </div>
        <button
          className="mb72-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
        <MagneticButton
          onClick={() => router.push("/templates/impact-72/contact")}
          style={{
            background: C.amber,
            color: C.bg,
            border: "none",
            padding: "0.5rem 1.25rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          SOUMETTRE UN PROJET
        </MagneticButton>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.78rem",
                color: isActive(href) ? C.amberLight : C.textMuted,
                textDecoration: "none",
                transition: "color 0.2s"
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb72-nav { display: none !important; } .mb72-burger { display: flex !important; } }`}</style>

      <div style={{ height: "60px" }} />

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 10 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg, position: "relative", zIndex: 20 }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 900, color: C.text, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              STACK<span style={{ color: C.amber }}>_</span>UNIT
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
              MAISON DE PRODUCTION · PARIS · EST. 2001
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textDim, lineHeight: 1.65 }}>
              Agréé CNC. Membre du SPI.
            </p>
          </div>
          {[
            { title: "FILMS", items: [{ label: "Filmographie", href: "/templates/impact-72/films" }, { label: "En production", href: "/templates/impact-72/films" }, { label: "En développement", href: "/templates/impact-72/films" }] },
            { title: "SERVICES", items: [{ label: "Production", href: "/templates/impact-72/services" }, { label: "Post-production", href: "/templates/impact-72/services" }, { label: "Distribution", href: "/templates/impact-72/services" }] },
            { title: "STUDIO", items: [{ label: "Notre histoire", href: "/templates/impact-72/studio" }, { label: "Équipe", href: "/templates/impact-72/studio" }, { label: "Presse", href: "/templates/impact-72/studio" }] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <Link key={item.label} href={item.href} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textMuted, textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: C.textDim }}>© {new Date().getFullYear()} STACK UNIT. TOUS DROITS RÉSERVÉS.</div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/templates/impact-72/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: C.textDim, textDecoration: "none" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-72/legal" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: C.textDim, textDecoration: "none" }}>
              RGPD
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
