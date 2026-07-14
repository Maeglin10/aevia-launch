"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Camera, Link2 } from "lucide-react";
import { C } from "./shared";

import "../premium.css";

export default function OrbitLayout({
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/templates/impact-68") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Work", href: "/templates/impact-68/work" },
    { label: "Services", href: "/templates/impact-68/services" },
    { label: "Studio", href: "/templates/impact-68/studio" },
    { label: "Process", href: "/templates/impact-68/process" },
    { label: "Contact", href: "/templates/impact-68/contact" },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.accent}; color: ${C.white}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(17, 17, 17, 0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo */}
        <Link href="/templates/impact-68" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `2px solid ${C.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: C.accent,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            Orbit<span style={{ color: C.accent }}>.</span>
          </span>
        </>
          )}</Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: "36px",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                color: isActive(link.href) ? C.accent : C.textMuted,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) e.currentTarget.style.color = C.textMuted;
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/templates/impact-68/contact"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.white,
              background: C.accent,
              padding: "10px 22px",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.accentDark;
              (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.accent;
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Start a Project
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.text,
            padding: "4px",
          }}
          className="mobile-only-block"
        >
          <div style={{ width: "22px", height: "2px", background: C.text, marginBottom: "5px" }} />
          <div style={{ width: "22px", height: "2px", background: C.text, marginBottom: "5px" }} />
          <div style={{ width: "14px", height: "2px", background: C.accent }} />
        </button>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "400px",
              background: C.bg,
              borderLeft: `1px solid ${C.border}`,
              padding: "120px 40px 40px",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "40px",
                background: "none",
                border: "none",
                color: C.text,
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: isActive(link.href) ? C.accent : C.text,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/templates/impact-68/legal"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: isActive("/templates/impact-68/legal/mentions-legales") ? C.accent : C.text,
                textDecoration: "none",
                marginTop: "20px",
              }}
            >
              Regulatory
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ paddingTop: "72px" }} />

      {/* MAIN CONTENT */}
      <main>{children}</main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "60px 40px",
          background: C.bgAlt,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: "60px",
            alignItems: "start",
          }}
          className="grid-footer-68"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: `2px solid ${C.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.accent }} />
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: C.text,
                }}
              >
                Orbit<span style={{ color: C.accent }}>.</span>
              </span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.7, maxWidth: "240px" }}>
              Brand identity studio. Paris, France. Est. 2015. Senior-led, intentionally small.
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
              {[MessageSquare, Camera, Link2].map((Icon, i) => (
                <div
                  key={i}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "4px",
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                    color: C.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.accent;
                    (e.currentTarget as HTMLElement).style.color = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLElement).style.color = C.textMuted;
                  }}
                >
                  <Icon size={15} />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Services",
              links: [
                { label: "Brand Identity", href: "/templates/impact-68/services" },
                { label: "Art Direction", href: "/templates/impact-68/services" },
                { label: "Brand Strategy", href: "/templates/impact-68/services" },
                { label: "Digital Expression", href: "/templates/impact-68/services" },
              ],
            },
            {
              title: "Studio",
              links: [
                { label: "About Orbit", href: "/templates/impact-68/studio" },
                { label: "Our Process", href: "/templates/impact-68/process" },
                { label: "Contact", href: "/templates/impact-68/contact" },
              ],
            },
            {
              title: "Regulatory",
              links: [
                { label: "Mentions Légales", href: "/templates/impact-68/legal/mentions-legales" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: C.textMuted,
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    display: "block",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: C.textMuted,
                    textDecoration: "none",
                    marginBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "48px auto 0",
            paddingTop: "24px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="flex-footer-68"
        >
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: C.textMuted }}>
            © {new Date().getFullYear()} Orbit Studio. All rights reserved.
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: C.textMuted }}>
            Paris · valentinmilliand@aevia.services · +33 1 XX XX XX XX
          </p>
        </div>
      </footer>
    </div>
  );
}
