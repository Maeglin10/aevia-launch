"use client";
/*
  impact-44 — Espace Studio. Nav et pied de page partagés entre l'accueil et
  les sous-pages (prestations, studio, réalisations, sélection, contact).
*/
import {
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientName,
  clientPhone,
} from "@/lib/templates/clientContent";

import { LegalIdentity } from "@/app/templates/LegalIdentity";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { C, NAV_LINKS } from "./shared";

export default function EspaceStudioLayout({ children }: { children: React.ReactNode }) {
  const [__layoutSession, __setLayoutSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(__setLayoutSession)
      .catch(() => {});
  }, []);
  const fd = __layoutSession?.formData;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrolled(v > 0.02));
    return unsub;
  }, [scrollYProgress]);

  const isHome = pathname === "/templates/impact-44" || pathname === "/templates/impact-44/";
  const solidNav = scrolled || !isHome;
  const tel = clientPhone(__layoutSession) ?? "04 91 33 27 84";
  const mail = clientEmail(__layoutSession) ?? "bonjour@espace-studio.fr";

  return (
    <div className="i44" style={{ background: C.bg, color: C.white, minHeight: "100dvh", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,700;0,800;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        .i44 h1, .i44 h2, .i44 h3, .i44 h4, .i44 .i44-titre { font-family: 'Archivo', Inter, sans-serif; }
      `}} />

      {/* Fil de progression — la ligne de sable */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: C.sable,
          transformOrigin: "0%",
          zIndex: 9999,
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 2,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "16px 40px",
          background: solidNav ? "rgba(16,16,18,0.92)" : "transparent",
          backdropFilter: solidNav ? "blur(12px)" : "none",
          borderBottom: solidNav ? `1px solid ${C.line}` : "1px solid transparent",
          transition: "all 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/templates/impact-44"
          className="i44-titre"
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: C.white,
            letterSpacing: "0.04em",
            textDecoration: "none",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "48vw",
          }}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
          {/* NOM_LOGO */ clientName(__layoutSession) ?? <>Espace <span style={{ color: C.sable }}>Studio</span></>}
        </>
          )}</Link>
        <div id="mb44-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: active ? C.sableFixe : C.textMid,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/templates/impact-44/recruit"
            style={{
              padding: "10px 24px",
              background: pathname === "/templates/impact-44/recruit" ? C.sable : "transparent",
              border: `1px solid ${C.sable}`,
              color: pathname === "/templates/impact-44/recruit" ? C.bg : C.sableFixe,
              fontSize: 11,
              letterSpacing: "0.22em",
              textDecoration: "none",
              textTransform: "uppercase",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            Prendre rendez-vous
          </Link>
      </div>
        <button
          className="mb44-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, color: C.white }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 999, background: "rgba(16,16,18,0.98)", borderBottom: `1px solid ${C.line}`, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: active ? C.sableFixe : C.textMid,
                  fontSize: 13,
                  letterSpacing: "0.22em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  fontWeight: active ? 700 : 500,
                  padding: "6px 0",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/templates/impact-44/recruit"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: `1px solid ${C.sable}`,
              color: C.sableFixe,
              fontSize: 12,
              letterSpacing: "0.22em",
              textDecoration: "none",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Prendre rendez-vous
          </Link>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb44-nav { display: none !important; } .mb44-burger { display: flex !important; } }`}</style>

      {/* Contenu */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Pied de page */}
      <footer
        style={{
          background: C.gray,
          borderTop: `1px solid ${C.line}`,
          padding: "64px 40px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 64 }}>
            <div>
              <div className="i44-titre" style={{ fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: "0.04em", marginBottom: 16, textTransform: "uppercase" }}>
                {clientName(__layoutSession) ?? <>Espace <span style={{ color: C.sable }}>Studio</span></>}
              </div>
              <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, maxWidth: 260 }}>
                Studio de décoration et d'architecture intérieure{clientCity(__layoutSession) ? ` à ${clientCity(__layoutSession)}` : " à Marseille"}. Le sud, sa lumière, et des lieux qui la méritent.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.sableFixe, letterSpacing: "0.35em", marginBottom: 20, textTransform: "uppercase", fontWeight: 700 }}>Le site</div>
              {NAV_LINKS.map((link) => (
                <div key={link.label} style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", marginBottom: 12 }}>
                  <Link href={link.href} style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.sableFixe, letterSpacing: "0.35em", marginBottom: 20, textTransform: "uppercase", fontWeight: 700 }}>Suivre</div>
              {["Instagram", "Pinterest"].map((s) => (
                <div key={s} style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", marginBottom: 12 }}>
                  <Link href="/templates/impact-44/bracket" style={{ textDecoration: "none", color: "inherit" }}>{s}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.sableFixe, letterSpacing: "0.35em", marginBottom: 20, textTransform: "uppercase", fontWeight: 700 }}>Contact</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 2 }}>
                <div><a href={`tel:${tel.replace(/\s/g, "")}`} style={{ color: C.textMid, textDecoration: "none" }}>{tel}</a></div>
                <div><a href={`mailto:${mail}`} style={{ color: C.textMid, textDecoration: "none", wordBreak: "break-all" }}>{mail}</a></div>
                <div style={{ marginTop: 8 }}>{clientCodePostalVille(__layoutSession, "13001", "Marseille")}</div>
                <div>Sur rendez-vous, du mardi au samedi</div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: `1px solid ${C.line}`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              color: C.textDim,
              letterSpacing: "0.18em",
              flexWrap: "wrap",
              gap: 12,
              textTransform: "uppercase",
            }}
          >
            <span>© {clientName(__layoutSession) ?? "Espace Studio"} · Site réalisé par Aevia WS — SIREN <LegalIdentity /></span>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions légales</Link>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
