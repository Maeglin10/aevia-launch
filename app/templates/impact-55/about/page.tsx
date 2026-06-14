"use client";

import React from "react";
import { TerminalWindow } from "../shared";

export default function AboutPage() {
  return (
    <section style={{ padding: "80px 40px", minHeight: "calc(100vh - 104px)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
          ■ SECTION_05 // WHOAMI
        </div>
        <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
          WHOAMI
        </h2>

        <TerminalWindow title="whoami.sh — identity disclosure">
          <div style={{ marginBottom: "20px" }}>
            <span style={{ color: "#008F11", fontSize: "12px", letterSpacing: "0.06em" }}>ghost@shell:~$ </span>
            <span style={{ color: "#00FF41", fontSize: "12px", letterSpacing: "0.06em" }}>whoami --verbose</span>
          </div>

          <div style={{ borderLeft: "2px solid #003300", paddingLeft: "20px", marginBottom: "28px" }}>
            {[
              ["uid",       "0(ghost) gid=0(root) groups=0(root),4(adm),27(sudo)"],
              ["shell",     "/bin/ghost_shell"],
              ["hostname",  "ghost-prod-01.internal"],
              ["uptime",    "847 days, 14:22:09"],
              ["clearance", "CLASSIFIED / SAP ACCESS"],
            ].map(([key, val]) => (
              <div key={key} style={{ display: "flex", gap: "12px", fontSize: "12px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
                <span style={{ color: "#005500", minWidth: "90px" }}>{key}:</span>
                <span style={{ color: "#008F11" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ color: "#008F11", fontSize: "13px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
            <p style={{ marginBottom: "16px" }}>
              # Ghost Shell is a stealth-first engineering collective operating at the intersection
              # of offensive security and product design. We build systems that resist adversaries
              # by design — not as an afterthought.
            </p>
            <p style={{ marginBottom: "16px" }}>
              # Our team has shipped infrastructure for red-team operations, zero-trust enterprise
              # dashboards, and anonymized deployment pipelines used by 2,847+ clients across
              # 38 jurisdictions.
            </p>
            <p style={{ marginBottom: "0px" }}>
              # We don&apos;t leave traces. <span style={{ color: "#00FF41" }}>That&apos;s the point.</span>
            </p>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
