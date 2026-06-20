"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { INIT_LINES, BlinkCursor, ProgressBar, TerminalWindow } from "./shared";

export default function GhostShellPage() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let finished = false;

    const tick = () => {
      if (finished) return;
      const line = INIT_LINES[lineIdx];
      if (charIdx < line.length) {
        setCurrentLine(line.slice(0, charIdx + 1));
        charIdx++;
        setTimeout(tick, 28 + Math.random() * 22);
      } else {
        setTypedLines(prev => [...prev, line]);
        setCurrentLine("");
        lineIdx++;
        charIdx = 0;
        if (lineIdx >= INIT_LINES.length) {
          finished = true;
          setDoneTyping(true);
          return;
        }
        setTimeout(tick, 260);
      }
    };

    const timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: "calc(100vh - 52px)",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Terminal title bar */}
        <div style={{
          backgroundColor: "#001200",
          borderBottom: "1px solid #008F11",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <span style={{ color: "#ff5f57", fontSize: "10px" }}>●</span>
          <span style={{ color: "#febc2e", fontSize: "10px" }}>●</span>
          <span style={{ color: "#28c840", fontSize: "10px" }}>●</span>
          <span style={{ color: "#008F11", fontSize: "11px", marginLeft: "16px", letterSpacing: "0.1em" }}>
            GHOST_SHELL — bash — 80x24
          </span>
          <span style={{ marginLeft: "auto", color: "#003300", fontSize: "10px" }}>
            PID 4291 · SSH authenticated · AES-256
          </span>
        </div>

        {/* Terminal body */}
        <div style={{
          flex: 1,
          padding: "32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}>
          {/* Init sequence */}
          <div style={{ marginBottom: "40px" }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{
                fontSize: "14px",
                lineHeight: "2",
                color: i === typedLines.length - 1 && doneTyping ? "#00FF41" : "#008F11",
                letterSpacing: "0.04em",
              }}>
                {line}
              </div>
            ))}
            {!doneTyping && (
              <div style={{ fontSize: "14px", lineHeight: "2", color: "#00FF41", letterSpacing: "0.04em" }}>
                {currentLine}<BlinkCursor />
              </div>
            )}
          </div>

          {/* ASCII GHOST SHELL logotype */}
          <div style={{
            margin: "20px 0 32px",
            lineHeight: "1.15",
            overflowX: "auto",
          }}>
            <pre style={{
              color: "#00FF41",
              fontSize: "clamp(6px, 1.1vw, 13px)",
              margin: 0,
              fontFamily: "'Courier New', Courier, monospace",
              textShadow: "0 0 12px rgba(0,255,65,0.6)",
              userSelect: "none",
            }}>{`
  ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗    ███████╗██╗  ██╗███████╗██╗     ██╗
  ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝    ██╔════╝██║  ██║██╔════╝██║     ██║
  ██║  ███╗███████║██║   ██║███████╗   ██║       ███████╗███████║█████╗  ██║     ██║
  ██║   ██║██╔══██║██║   ██║╚════██║   ██║       ╚════██║██╔══██║██╔══╝  ██║     ██║
  ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║       ███████║██║  ██║███████╗███████╗███████╗
   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝       ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝`}</pre>
          </div>

          {/* Sub-headline */}
          <div style={{ color: "#008F11", fontSize: "13px", marginBottom: "48px", letterSpacing: "0.14em" }}>
            ▶ cybersecurity engineering · stealth deployment · adversarial design
          </div>

          {/* Deploy prompt */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "15px",
            color: "#00FF41",
            letterSpacing: "0.06em",
          }}>
            <span style={{ color: "#008F11" }}>ghost@shell:~$</span>
            <span>deploy --env production --silent --zero-trace</span>
            <BlinkCursor />
          </div>

          <div style={{ marginTop: "48px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/templates/impact-55/contact" style={{
              backgroundColor: "#00FF41",
              color: "#000",
              border: "none",
              padding: "12px 32px",
              fontSize: "12px",
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: "bold",
              letterSpacing: "0.14em",
              cursor: "pointer",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              [EXECUTE]
            </Link>
            <Link href="/templates/impact-55/about" style={{
              backgroundColor: "transparent",
              color: "#00FF41",
              border: "1px solid #008F11",
              padding: "12px 32px",
              fontSize: "12px",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.14em",
              cursor: "pointer",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00FF41"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#008F11"; }}
            >
              ▶ man ghost_shell
            </Link>
          </div>
        </div>
      </section>

      {/* ── SYSTEM STATUS ──────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", borderTop: "1px solid #003300" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
            ■ SECTION_02
          </div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
            SYSTEM_STATUS
          </h2>

          <TerminalWindow title="status.sh — live readout">
            <div style={{ color: "#008F11", fontSize: "11px", marginBottom: "24px", letterSpacing: "0.08em" }}>
              $ ./status.sh --verbose --live
            </div>
            <ProgressBar pct={99.99} label="UPTIME" value="99.99%" />
            <ProgressBar pct={12}    label="THREAT_LEVEL" value="LOW / NOMINAL" />
            <ProgressBar pct={91}    label="CLIENTS_ACTIVE" value="2,847" />
            <ProgressBar pct={78}    label="COMMITS_TOTAL" value="84,291" />
            <ProgressBar pct={100}   label="CVE_PATCHES_APPLIED" value="1,204 / 1,204" />
            <div style={{ marginTop: "28px", color: "#008F11", fontSize: "11px", letterSpacing: "0.08em" }}>
              <div style={{ marginBottom: "6px" }}>last_heartbeat:  {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC</div>
              <div>daemon_status:   <span style={{ color: "#00FF41" }}>RUNNING (PID 4291)</span></div>
            </div>
          </TerminalWindow>
        </div>
      </section>

      {/* ── CAPABILITIES ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", borderTop: "1px solid #003300" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>■ SECTION_03</div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>CAPABILITIES</h2>
          <TerminalWindow title="modules.sh — capability manifest">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {[
                { module: "GHOST_NET", code: "v4.1.0", desc: "Stealth network penetration framework. Zero-trace lateral movement across segmented environments." },
                { module: "CIPHER_VAULT", code: "v3.8.2", desc: "End-to-end encryption layer with quantum-resistant key exchange (Kyber-1024). No backdoors." },
                { module: "PHANTOM_OPS", code: "v5.0.0", desc: "Adversarial red team operations. We find the holes before the attackers do. 100% authorized." },
                { module: "SENTINEL_AI", code: "v2.4.1", desc: "ML-powered anomaly detection. 4ms response time. Trained on 12B malicious event signatures." },
                { module: "ZERO_TRACE", code: "v1.9.3", desc: "Anti-forensics toolkit for authorized deployments. Memory scrubbing, log rotation, artifact removal." },
                { module: "NEXUS_C2", code: "v3.3.0", desc: "Encrypted command-and-control infrastructure for red team engagements. OPSEC-hardened." },
              ].map((cap) => (
                <div key={cap.module} style={{ borderLeft: "1px solid #003300", paddingLeft: "16px" }}>
                  <div style={{ color: "#00FF41", fontSize: "11px", fontWeight: "bold", letterSpacing: "0.08em", marginBottom: "4px" }}>{cap.module} <span style={{ color: "#008F11" }}>[{cap.code}]</span></div>
                  <div style={{ color: "#008F11", fontSize: "10px", lineHeight: "1.6", letterSpacing: "0.04em" }}>{cap.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "28px", color: "#008F11", fontSize: "11px" }}>
              $ echo &quot;All modules loaded. Type [EXECUTE] to initiate engagement.&quot;
            </div>
          </TerminalWindow>
        </div>
      </section>

      {/* ── ENGAGEMENTS ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", borderTop: "1px solid #003300" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>■ SECTION_04</div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>ENGAGEMENT_LOG</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { id: "ENG-2847", client: "[REDACTED]", scope: "Full red team engagement — 14-day persistent access attempt", result: "SUCCESS — 3 critical paths found, patched before handoff", year: "2025" },
              { id: "ENG-2831", client: "[REDACTED]", scope: "Cloud infrastructure audit — AWS multi-account, 400+ services", result: "SUCCESS — IAM misconfiguration led to privilege escalation", year: "2025" },
              { id: "ENG-2790", client: "[REDACTED]", scope: "Zero-day research — browser extension attack surface", result: "SUCCESS — CVE-2025-XXXX (awaiting disclosure)", year: "2024" },
              { id: "ENG-2764", client: "[REDACTED]", scope: "Physical + digital hybrid intrusion test", result: "SUCCESS — Social engineering + RF cloning combo", year: "2024" },
            ].map((eng) => (
              <div key={eng.id} style={{ borderTop: "1px solid #001500", padding: "20px 0", display: "grid", gridTemplateColumns: "120px 1fr 200px 60px", gap: "24px", alignItems: "start" }}>
                <span style={{ color: "#008F11", fontSize: "10px", letterSpacing: "0.1em" }}>{eng.id}</span>
                <div>
                  <div style={{ color: "#008F11", fontSize: "10px", marginBottom: "4px" }}>CLIENT: {eng.client}</div>
                  <div style={{ color: "#00FF41", fontSize: "11px", letterSpacing: "0.04em" }}>{eng.scope}</div>
                </div>
                <span style={{ color: "#008F11", fontSize: "10px", lineHeight: "1.5" }}>{eng.result}</span>
                <span style={{ color: "#003300", fontSize: "10px" }}>{eng.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", borderTop: "1px solid #003300", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "24px" }}>■ INITIATE_CONTACT</div>
          <h2 style={{ color: "#00FF41", fontSize: "clamp(28px, 4vw, 48px)", marginBottom: "24px", letterSpacing: "0.04em", fontWeight: "normal" }}>DEPLOY_YOUR_BRIEF</h2>
          <p style={{ color: "#008F11", fontSize: "12px", lineHeight: "1.8", marginBottom: "48px", letterSpacing: "0.06em" }}>
            All engagements are confidential by default. We operate under NDA before the first message.
            Authorized personnel only. No script kiddies.
          </p>
          <Link href="/templates/impact-55/contact" style={{
            display: "inline-block",
            backgroundColor: "#00FF41",
            color: "#000",
            padding: "14px 40px",
            fontSize: "12px",
            fontFamily: "'Courier New', monospace",
            fontWeight: "bold",
            letterSpacing: "0.14em",
            textDecoration: "none",
          }}>
            [SEND_BRIEF]
          </Link>
        </div>
      </section>
    </div>
  );
}
