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
    </div>
  );
}
