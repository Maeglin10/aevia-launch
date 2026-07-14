"use client";

import React from "react";
import { C } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 40px 120px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }}>
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.5em', marginBottom: 16 }}>
            // LEGAL_NOTICE.EXE
          </div>
          <h1
            className="glitch-text"
            data-text="LEGAL & TERMS"
            style={{
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 900,
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            LEGAL & TERMS
          </h1>
        </div>

        <div style={{ fontSize: 13, color: C.textMid, border: `1px solid rgba(0,255,100,0.15)`, background: C.gray, padding: 40, clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0 100%)' }}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>// WEBSITE PUBLISHER</h2>
            <p style={{ margin: 0 }}>This website is published by: <strong>Valentin Milliand</strong>, owner of Aevia WS.</p>
            <p style={{ margin: "8px 0 0 0" }}>Registration: <strong>SIREN 852 546 225</strong>, registered with the Registry of Commerce and Companies (RCS) of Bourg-en-Bresse.</p>
            <p style={{ margin: "8px 0 0 0" }}>Physical Headquarters: Physical address withheld for security reasons (address provided upon request at valentinmilliand@aevia.services).</p>
            <p style={{ margin: "8px 0 0 0" }}>Contact: <strong>valentinmilliand@aevia.services</strong></p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>// WEB HOSTING</h2>
            <p style={{ margin: 0 }}>This site is hosted by: Google Firebase App Hosting (Google Cloud LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).</p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, color: C.green, letterSpacing: "0.1em", marginBottom: 12 }}>// PRIVACY & COOKIES</h2>
            <p style={{ margin: 0 }}>All personal information submitted via the tryout application form (such as handle, email, region, and clips) is used exclusively for recruitment evaluation. It is never sold, shared, or distributed. You may request data access or deletion at valentinmilliand@aevia.services.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
