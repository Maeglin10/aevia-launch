"use client";

import React from "react";
import { TerminalWindow } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "80px 40px", minHeight: "calc(100vh - 104px)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
          ■ SECTION_07 // LEGAL
        </div>
        <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
          LEGAL_MENTIONS
        </h2>

        <TerminalWindow title="legal_notice.sh — regulatory readout">
          <div style={{ color: "#008F11", fontSize: "13px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
            <p style={{ marginBottom: "16px", fontWeight: "bold" }}># 1. ÉDITEUR DU SITE</p>
            <p style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              Le site vitrine GHOST_SHELL est édité par Valentin Milliand, micro-entrepreneur.<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Adresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services).
            </p>

            <p style={{ marginBottom: "16px", fontWeight: "bold" }}># 2. HÉBERGEMENT</p>
            <p style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.
            </p>

            <p style={{ marginBottom: "16px", fontWeight: "bold" }}># 3. PROPRIÉTÉ INTELLECTUELLE</p>
            <p style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              L&apos;ensemble de la structure, des textes et des chartes graphiques de ce site sont la propriété exclusive de Valentin Milliand.
            </p>

            <p style={{ marginBottom: "16px", fontWeight: "bold" }}># 4. CONTACT</p>
            <p style={{ marginBottom: "0px", paddingLeft: "16px" }}>
              Pour toute question réglementaire ou technique, veuillez initier une connexion à l&apos;adresse suivante : valentinmilliand@aevia.services.
            </p>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
