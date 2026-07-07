"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Link2, GitBranch } from "lucide-react";
import { C, mono, sans, StyleInjector } from "./shared";

export default function NeuronSecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (href: string) => {
    if (href === "/templates/impact-64") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Accueil", href: "/templates/impact-64" },
    { label: "Solutions", href: "/templates/impact-64/solutions" },
    { label: "Red Team", href: "/templates/impact-64/red-team" },
    { label: "Tarifs", href: "/templates/impact-64/tarifs" },
    { label: "Contact", href: "/templates/impact-64/contact" },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: sans, overflowX: "hidden" }}>
      <StyleInjector />

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, transformOrigin: "left" }}
        />
        <div style={{
          background: scrolled ? "rgba(3,11,5,0.97)" : "rgba(3,11,5,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.greenBorder}`,
          padding: "0 2.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s",
        }}>
          <Link href="/templates/impact-64" style={{ textDecoration: "none" }}>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <><span style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 700, color: C.green, letterSpacing: "0.05em" }}>
              NEURON<span style={{ color: C.text }}>SEC</span>
            </span></>
            )}
          </Link>
          <div id="mb64-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: mono,
                  fontSize: "0.72rem",
                  color: isActive(l.href) ? C.green : C.textMuted,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  transition: "color 0.2s",
                  fontWeight: isActive(l.href) ? 700 : 400,
                }}
                onMouseEnter={e => { if (!isActive(l.href)) e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { if (!isActive(l.href)) e.currentTarget.style.color = C.textMuted; }}
              >
                {l.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href="/templates/impact-64/contact"
              style={{
                fontFamily: mono,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                background: C.green,
                color: C.bg,
                padding: "0.55rem 1.2rem",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(0,230,118,0.4)`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              AUDIT GRATUIT
            </Link>
      </div>
        <button
          className="mb64-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
        </div>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: mono,
                  fontSize: "0.72rem",
                  color: isActive(l.href) ? C.green : C.textMuted,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  transition: "color 0.2s",
                  fontWeight: isActive(l.href) ? 700 : 400,
                }}
                onMouseEnter={e => { if (!isActive(l.href)) e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { if (!isActive(l.href)) e.currentTarget.style.color = C.textMuted; }}
              >
                {l.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href="/templates/impact-64/contact"
              style={{
                fontFamily: mono,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                background: C.green,
                color: C.bg,
                padding: "0.55rem 1.2rem",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(0,230,118,0.4)`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              AUDIT GRATUIT
            </Link>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb64-nav { display: none !important; } .mb64-burger { display: flex !important; } }`}</style>

      {/* Spacer for Fixed Navbar */}
      <div style={{ height: "68px" }} />

      {/* ── TICKER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "0.9rem 0", borderBottom: `1px solid ${C.greenBorder}`, overflow: "hidden", background: C.bgAlt }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}
        >
          {[...Array(2)].map((_, rep) => (
            ["3 847 incidents bloqués cette année", "● SOC ACTIF 24H/24", "ISO 27001:2022 certifié", "PRIS ANSSI — niveau Expert", "99.98% uptime SLA", "NIS2 compliant", "CVSSv3.1 scoring", "MITRE ATT&CK framework"].map((item, i) => (
              <span key={`${rep}-${i}`} style={{ fontFamily: mono, fontSize: "0.72rem", color: item.startsWith("●") ? C.green : C.textMuted, letterSpacing: "0.1em" }}>
                {item}
              </span>
            ))
          ))}
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
      <main style={{ minHeight: "calc(100vh - 400px)" }}>
        {children}
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgCard, borderTop: `1px solid ${C.greenBorder}`, padding: "4rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: "1rem", fontWeight: 700, color: C.green, marginBottom: "1rem", letterSpacing: "0.05em" }}>
                NEURON<span style={{ color: C.text }}>SEC</span>
              </div>
              <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "300px", marginBottom: "1.5rem" }}>
                Centre opérationnel de cybersécurité. SOC 24/7, Red Team, ISO 27001. Qualifié PRIS ANSSI niveau Expert. Paris, France.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[{ icon: MessageSquare, label: "Contact" }, { icon: Link2, label: "LinkedIn" }, { icon: GitBranch, label: "GitHub" }].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Link key={i} href="/templates/impact-64/contact" style={{
                      width: "36px", height: "36px", borderRadius: "6px",
                      background: "rgba(0,230,118,0.05)", border: `1px solid ${C.greenBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = "rgba(0,230,118,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.background = "rgba(0,230,118,0.05)"; }}
                    >
                      <Icon size={14} color={C.textMuted} />
                    </Link>
                  );
                })}
              </div>
            </div>
            {[
              { title: "Solutions", links: [
                { name: "SOC 24/7", href: "/templates/impact-64/solutions" },
                { name: "Red Team", href: "/templates/impact-64/red-team" },
                { name: "Tarifs", href: "/templates/impact-64/tarifs" },
              ] },
              { title: "Entreprise", links: [
                { name: "À propos", href: "/templates/impact-64" },
                { name: "Équipe", href: "/templates/impact-64" },
                { name: "Mentions légales", href: "/templates/impact-64/legal/mentions-legales" },
                { name: "Confidentialité", href: "/templates/impact-64/legal/confidentialite" },
                { name: "CGU", href: "/templates/impact-64/legal/cgu" },
              ] },
              { title: "Contact", links: [
                { name: "Paris — 10ème arr.", href: "/templates/impact-64/contact" },
                { name: "soc@neuronsec.fr", href: "/templates/impact-64/contact" },
                { name: "Urgence cyber", href: "/templates/impact-64/contact" },
              ] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.green, letterSpacing: "0.15em", marginBottom: "1.25rem" }}>{col.title.toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {col.links.map((l, idx) => (
                    <Link key={idx} href={l.href} style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.greenBorder}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted }}>© 2026 NeuronSec SAS — Tous droits réservés</span>
            <div style={{ display: "flex", gap: "2rem" }}>
              <Link href="/templates/impact-64/legal" style={{ fontFamily: mono, fontSize: "0.62rem", color: C.textMuted, textDecoration: "none", letterSpacing: "0.05em" }}>Mentions légales</Link>
              <Link href="/templates/impact-64/legal" style={{ fontFamily: mono, fontSize: "0.62rem", color: C.textMuted, textDecoration: "none", letterSpacing: "0.05em" }}>Confidentialité</Link>
              <Link href="/templates/impact-64/legal" style={{ fontFamily: mono, fontSize: "0.62rem", color: C.textMuted, textDecoration: "none", letterSpacing: "0.05em" }}>CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
