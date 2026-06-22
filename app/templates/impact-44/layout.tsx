"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { C, NAV_LINKS } from "./shared";

export default function GhostProtocolLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrolled(v > 0.02));
    return unsub;
  }, [scrollYProgress]);

  const isHome = pathname === "/templates/impact-44" || pathname === "/templates/impact-44/";
  const solidNav = scrolled || !isHome;

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh", fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column" }}>
      {/* Global Glitch and Cyberpunk CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitch-clip-1 {
          0%   { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-4px, 0); }
          10%  { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); transform: translate(3px, 0); }
          20%  { clip-path: polygon(0 40%, 100% 40%, 100% 44%, 0 44%); transform: translate(-2px, 0); }
          30%  { clip-path: polygon(0 65%, 100% 65%, 100% 70%, 0 70%); transform: translate(4px, 0); }
          40%  { clip-path: polygon(0 80%, 100% 80%, 100% 85%, 0 85%); transform: translate(-3px, 0); }
          50%  { clip-path: polygon(0 90%, 100% 90%, 100% 95%, 0 95%); transform: translate(2px, 0); }
          60%  { clip-path: polygon(0 10%, 100% 10%, 100% 14%, 0 14%); transform: translate(-4px, 0); }
          70%  { clip-path: polygon(0 55%, 100% 55%, 100% 60%, 0 60%); transform: translate(3px, 0); }
          80%  { clip-path: polygon(0 30%, 100% 30%, 100% 33%, 0 33%); transform: translate(-1px, 0); }
          90%  { clip-path: polygon(0 70%, 100% 70%, 100% 75%, 0 75%); transform: translate(4px, 0); }
          100% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-4px, 0); }
        }

        @keyframes glitch-clip-2 {
          0%   { clip-path: polygon(0 50%, 100% 50%, 100% 54%, 0 54%); transform: translate(4px, 0); }
          15%  { clip-path: polygon(0 72%, 100% 72%, 100% 78%, 0 78%); transform: translate(-3px, 0); }
          25%  { clip-path: polygon(0 18%, 100% 18%, 100% 23%, 0 23%); transform: translate(2px, 0); }
          35%  { clip-path: polygon(0 88%, 100% 88%, 100% 93%, 0 93%); transform: translate(-4px, 0); }
          45%  { clip-path: polygon(0 5%, 100% 5%, 100% 9%, 0 9%); transform: translate(3px, 0); }
          55%  { clip-path: polygon(0 35%, 100% 35%, 100% 40%, 0 40%); transform: translate(-2px, 0); }
          65%  { clip-path: polygon(0 62%, 100% 62%, 100% 66%, 0 66%); transform: translate(4px, 0); }
          75%  { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); transform: translate(-3px, 0); }
          85%  { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(2px, 0); }
          100% { clip-path: polygon(0 50%, 100% 50%, 100% 54%, 0 54%); transform: translate(4px, 0); }
        }

        @keyframes neon-pulse {
          0%, 100% { text-shadow: 0 0 8px #00ff64, 0 0 20px #00ff64, 0 0 40px #00ff64; opacity: 1; }
          50%       { text-shadow: 0 0 4px #00ff64, 0 0 10px #00ff64, 0 0 60px #00ff64; opacity: 0.85; }
        }

        @keyframes neon-border-pulse {
          0%, 100% { box-shadow: 0 0 6px #00ff64, inset 0 0 6px rgba(0,255,100,0.1); }
          50%       { box-shadow: 0 0 18px #00ff64, inset 0 0 12px rgba(0,255,100,0.2); }
        }

        @keyframes scanline-sweep {
          0%   { transform: translateY(-100vh); opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes crt-flicker {
          0%   { opacity: 0; }
          5%   { opacity: 0.9; }
          8%   { opacity: 0.2; }
          12%  { opacity: 0.95; }
          20%  { opacity: 0.1; }
          25%  { opacity: 1; }
          30%  { opacity: 0.4; }
          35%  { opacity: 0.9; }
          40%  { opacity: 0.05; }
          50%  { opacity: 1; }
          60%  { opacity: 0.8; }
          70%  { opacity: 1; }
          80%  { opacity: 0.9; }
          90%  { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        @keyframes char-walk {
          0%   { transform: translateY(0px); }
          25%  { transform: translateY(-6px); }
          50%  { transform: translateY(0px); }
          75%  { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }

        .glitch-text {
          position: relative;
          display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
        }
        .glitch-text:hover::before {
          color: #ff3c00;
          opacity: 0.85;
          animation: glitch-clip-1 0.5s infinite linear;
          left: -3px;
        }
        .glitch-text:hover::after {
          color: #00eeff;
          opacity: 0.85;
          animation: glitch-clip-2 0.5s infinite linear;
          left: 3px;
        }

        .neon-num {
          animation: neon-pulse 2s ease-in-out infinite;
          color: #00ff64;
        }

        .neon-border {
          animation: neon-border-pulse 2s ease-in-out infinite;
        }

        .scanline-overlay::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,100,0.03) 2px,
            rgba(0,255,100,0.03) 4px
          );
          pointer-events: none;
          z-index: 9998;
        }

        .feature-card {
          clip-path: polygon(0 0, 100% 0, 96% 100%, 0 100%);
        }

        .angled-section {
          clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
        }

        .angled-section-reverse {
          clip-path: polygon(5% 0, 100% 0, 100% 100%, 0 100%);
        }
      `}} />

      {/* Progress Scroll Indicator */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: C.green,
          boxShadow: `0 0 10px ${C.green}`,
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
          background: solidNav ? "rgba(6,10,6,0.92)" : "transparent",
          backdropFilter: solidNav ? "blur(12px)" : "none",
          borderBottom: solidNav ? `1px solid rgba(0,255,100,0.1)` : "1px solid transparent",
          transition: "all 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/templates/impact-44"
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: C.green,
            letterSpacing: "0.15em",
            textShadow: `0 0 20px ${C.green}`,
            textDecoration: "none",
          }}
        >
          GHOST<span style={{ color: C.white }}>PROTOCOL</span>
        </Link>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: active ? C.green : C.textMid,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  fontWeight: active ? 700 : 400,
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
              background: pathname === "/templates/impact-44/recruit" ? C.green : "transparent",
              border: `1px solid ${C.green}`,
              color: pathname === "/templates/impact-44/recruit" ? C.bg : C.green,
              fontSize: 11,
              letterSpacing: "0.25em",
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: `0 0 12px rgba(0,255,100,0.15)`,
              transition: "all 0.2s",
            }}
          >
            RECRUIT
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: C.gray,
          borderTop: `1px solid rgba(0,255,100,0.15)`,
          padding: "64px 40px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.green, letterSpacing: "0.12em", marginBottom: 16, textShadow: `0 0 15px ${C.green}` }}>
                GHOST<span style={{ color: C.white }}>PROTOCOL</span>
              </div>
              <p style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7, letterSpacing: "0.05em", maxWidth: 240 }}>
                PROFESSIONAL ESPORTS ORGANIZATION. WE COMPETE. WE WIN. WE REBUILD.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.green, letterSpacing: "0.4em", marginBottom: 20 }}>NAVIGATE</div>
              {NAV_LINKS.map((link) => (
                <div key={link.label} style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12 }}>
                  <Link href={link.href} style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.green, letterSpacing: "0.4em", marginBottom: 20 }}>SOCIALS</div>
              {["TWITCH", "YOUTUBE", "TWITTER/X", "DISCORD", "INSTAGRAM"].map((s) => (
                <div key={s} style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12, cursor: "pointer" }}>
                  {s}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.green, letterSpacing: "0.4em", marginBottom: 20 }}>CONTACT</div>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.05em", lineHeight: 1.8 }}>
                <div>PARTNERSHIPS:</div>
                <div style={{ color: C.textMid }}>business@ghostprotocol.gg</div>
                <div style={{ marginTop: 12 }}>RECRUITMENT:</div>
                <div style={{ color: C.textMid }}>tryout@ghostprotocol.gg</div>
                <div style={{ marginTop: 12 }}>PRESS:</div>
                <div style={{ color: C.textMid }}>press@ghostprotocol.gg</div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(0,255,100,0.1)",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              color: C.textDim,
              letterSpacing: "0.2em",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span>© 2026 Aevia WS — SIREN 852 546 225. ALL RIGHTS RESERVED.</span>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>LEGAL NOTICE</Link>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>PRIVACY</Link>
              <Link href="/templates/impact-44/legal" style={{ color: "inherit", textDecoration: "none" }}>CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
