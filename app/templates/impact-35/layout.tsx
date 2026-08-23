"use client";
/*
  impact-35 — Carré Daviel. Nav et pied de page partagés entre l'accueil et
  les sous-pages (expertises, cabinet, honoraires, équipe).
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
import { C, SERIF, SANS, NAV_LINKS } from "./shared";

export default function CarreDavielLayout({ children }: { children: React.ReactNode }) {
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const tel = clientPhone(__layoutSession) ?? "01 42 61 08 30";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(__layoutSession) ?? "contact@carre-daviel.fr";

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.bg,
        color: C.text,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Barre de nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(247,246,243,0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 72,
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link href="/templates/impact-35" style={{ textDecoration: "none", color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "46vw" }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? "logo"}
                style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }}
              />
            ) : (
              <span style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, letterSpacing: "0.01em" }}>
                {/* NOM_LOGO */ clientName(__layoutSession) ?? <>Carré <span style={{ color: C.navy }}>Daviel</span></>}
              </span>
            )}
          </Link>

          <div className="i35-nav" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 12.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isActive(l.href) ? C.navyFixe : C.textMuted,
                  fontWeight: isActive(l.href) ? 700 : 500,
                  transition: "color 0.2s",
                }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={telHref}
              style={{
                padding: "11px 22px",
                background: C.navy,
                color: "#fff",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 700,
                borderRadius: 2,
                whiteSpace: "nowrap",
              }}
            >
              {tel}
            </a>
          </div>

          <button
            className="i35-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, color: C.text }}
          >
            <span style={{ display: "block", width: 24, height: 2, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: 24, height: 2, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 24, height: 2, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
        {mobileOpen && (
          <div style={{ borderTop: `1px solid ${C.border}`, background: C.bg, padding: "20px 5% 28px", display: "flex", flexDirection: "column", gap: 18 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", color: isActive(l.href) ? C.navyFixe : C.textMuted, fontWeight: 600, padding: "6px 0" }}
              >
                {l.label}
              </Link>
            ))}
            <a href={telHref} style={{ padding: "13px 22px", background: C.navy, color: "#fff", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2, textAlign: "center" }}>
              {tel}
            </a>
          </div>
        )}
      </nav>
      <style>{`@media (max-width: 920px) { .i35-nav { display: none !important; } .i35-burger { display: flex !important; } }`}</style>

      {/* Contenu */}
      <main style={{ flex: 1, paddingTop: 72 }}>{children}</main>

      {/* Pied de page */}
      <footer style={{ background: C.navyDark, color: "rgba(255,255,255,0.75)", padding: "64px 5% 36px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 44, marginBottom: 52 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
                {clientName(__layoutSession) ?? <>Carré <span style={{ color: C.or }}>Daviel</span></>}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 280, margin: 0, color: "rgba(255,255,255,0.55)" }}>
                Avocats, experts-comptables et conseil patrimonial{clientCity(__layoutSession) ? ` à ${clientCity(__layoutSession)}` : ""} — le chiffre et le droit sous un même toit.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 18 }}>Le cabinet</div>
              {NAV_LINKS.map((l) => (
                <div key={l.label} style={{ marginBottom: 10 }}>
                  <Link href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>{l.label}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 18 }}>Contact</div>
              <div style={{ fontSize: 13, lineHeight: 2.1 }}>
                <div><a href={telHref} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>{tel}</a></div>
                <div><a href={`mailto:${mail}`} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", wordBreak: "break-all" }}>{mail}</a></div>
                <div>{clientCodePostalVille(__layoutSession, "75002", "Paris")}</div>
                <div>Sur rendez-vous, du lundi au vendredi</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 18 }}>Déontologie</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.8, margin: 0, color: "rgba(255,255,255,0.5)" }}>
                Les avocats du cabinet sont inscrits au barreau et soumis au secret professionnel ; l'expertise comptable est exercée sous l'agrément de l'Ordre.
              </p>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <span>© {clientName(__layoutSession) ?? "Carré Daviel"} · Site réalisé par Aevia WS — SIREN <LegalIdentity /></span>
            <div style={{ display: "flex", gap: 22 }}>
              <Link href="/templates/impact-35/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions légales</Link>
              <Link href="/templates/impact-35/legal" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/templates/impact-35/legal" style={{ color: "inherit", textDecoration: "none" }}>CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
