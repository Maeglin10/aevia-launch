"use client";
import { useEffect, useState } from "react";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import {
  clientAddress,
  clientCity,
  clientEmail,
  clientName,
  clientPhone,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";

import React from "react";
import { TerminalWindow, MODULES, OPERATIONS } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function WorkPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div style={{ minHeight: "calc(100vh - 104px)" }}>
      <EnteteAnnexe session={sessionData} repli="Ghost Shell" accueil="/templates/impact-55" />
      {/* ── MODULES ────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
            ■ SECTION_03 // MODULES
          </div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "12px", letterSpacing: "0.08em", fontWeight: "normal" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? "MODULES"}
          </h2>
          <div style={{ color: "#008F11", fontSize: "12px", marginBottom: "48px", letterSpacing: "0.08em" }}>
            $ ls -1 /etc/ghost_shell/modules/
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "24px" }}>
            {MODULES.map((mod) => (
              <TerminalWindow key={mod.id} title={mod.id}>
                <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "#00FF41", fontSize: "16px", fontWeight: "bold", letterSpacing: "0.04em" }}>
                    {mod.name}
                  </span>
                  <span style={{
                    border: "1px solid #008F11",
                    color: "#008F11",
                    fontSize: "10px",
                    padding: "2px 8px",
                    letterSpacing: "0.14em",
                  }}>{mod.tag}</span>
                </div>
                <div style={{ color: "#008F11", fontSize: "12px", lineHeight: "1.7", marginBottom: "20px", letterSpacing: "0.04em" }}>
                  {mod.synopsis}
                </div>
                <div style={{ borderTop: "1px solid #002200", paddingTop: "16px" }}>
                  {mod.config.map((line, i) => (
                    <div key={i} style={{ color: "#005500", fontSize: "11px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
                      {line}
                    </div>
                  ))}
                </div>
                <button style={{
                  marginTop: "20px",
                  backgroundColor: "transparent",
                  border: "1px solid #003300",
                  color: "#008F11",
                  fontSize: "10px",
                  padding: "7px 14px",
                  fontFamily: "'Courier New', Courier, monospace",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.borderColor = "#008F11" }}
                onMouseLeave={e => { e.currentTarget.style.color = "#008F11"; e.currentTarget.style.borderColor = "#003300" }}
                >
                  ▶ man {mod.name}
                </button>
              </TerminalWindow>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", borderTop: "1px solid #003300" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
            ■ SECTION_04 // OPERATIONS
          </div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "12px", letterSpacing: "0.08em", fontWeight: "normal" }}>
            OPERATIONS
          </h2>
          <div style={{ color: "#008F11", fontSize: "12px", marginBottom: "36px", letterSpacing: "0.08em" }}>
            $ ls -la /ops/classified/
          </div>

          <TerminalWindow title="ops_log.sh — classified directory">
            <div style={{ color: "#008F11", fontSize: "11px", marginBottom: "20px", letterSpacing: "0.08em" }}>
              total {OPERATIONS.length} entries &nbsp;·&nbsp; clearance required: TOP SECRET
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #002200" }}>
                    {["DATE", "PERMISSIONS", "SIZE", "OPERATION", "DESCRIPTION"].map(h => (
                      <th key={h} style={{
                        textAlign: "left",
                        color: "#005500",
                        padding: "6px 16px 10px 0",
                        fontWeight: "normal",
                        letterSpacing: "0.12em",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OPERATIONS.map((op, i) => (
                    <tr key={i}
                      style={{ cursor: "pointer", transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#001200")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ color: "#008F11", padding: "10px 16px 10px 0", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{op.date}</td>
                      <td style={{ color: "#005500", padding: "10px 16px 10px 0", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{op.perms}</td>
                      <td style={{ color: "#008F11", padding: "10px 16px 10px 0", whiteSpace: "nowrap", textAlign: "right", paddingRight: "24px" }}>{op.size}</td>
                      <td style={{ color: "#00FF41", padding: "10px 16px 10px 0", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{op.name}</td>
                      <td style={{ color: "#005500", padding: "10px 0", letterSpacing: "0.04em" }}># {op.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TerminalWindow>
        </div>
      </section>
    </div>
  );
}
