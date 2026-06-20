"use client";

import React, { useState } from "react";
import { TerminalWindow } from "../shared";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [payload, setPayload] = useState("");
  const [connected, setConnected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setConnected(true);
    }
  };

  return (
    <section style={{ padding: "80px 40px", minHeight: "calc(100vh - 104px)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
          ■ SECTION_06 // PING
        </div>
        <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
          PING
        </h2>

        <TerminalWindow title="ping.sh — establish connection">
          <div style={{ marginBottom: "28px", fontSize: "13px", color: "#008F11", letterSpacing: "0.06em" }}>
            <div>ghost@shell:~$ ping ghost@shell.io</div>
            <div style={{ color: "#005500", marginTop: "6px" }}>PING ghost@shell.io 56 bytes of data.</div>
            <div style={{ color: "#005500" }}>64 bytes from ghost@shell.io: icmp_seq=0 ttl=64 time=0.42 ms</div>
            <div style={{ color: "#00FF41", marginTop: "6px" }}>--- ghost@shell.io ping statistics ---</div>
            <div style={{ color: "#005500" }}>1 packets transmitted, 1 received, 0.0% packet loss</div>
          </div>

          <div style={{ borderTop: "1px solid #002200", paddingTop: "28px" }}>
            {connected ? (
              <div style={{ color: "#00FF41", fontSize: "14px", lineHeight: "1.8" }}>
                <div>&gt; CONNECTION ESTABLISHED OVER SECURE TUNNEL</div>
                <div style={{ color: "#00FF41", marginTop: "8px" }}>Merci, nous vous répondrons sous 24h.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ color: "#008F11", fontSize: "12px", marginBottom: "16px", letterSpacing: "0.06em" }}>
                  ghost@shell:~$ establish_connection --encrypted
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#008F11", fontSize: "11px", marginBottom: "8px", letterSpacing: "0.12em" }}>
                    ▶ YOUR_EMAIL_ADDR:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #008F11", backgroundColor: "#000" }}>
                    <span style={{ color: "#008F11", padding: "10px 12px", fontSize: "12px", whiteSpace: "nowrap" }}>
                      input@
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="user@domain.tld"
                      style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#00FF41",
                        fontSize: "13px",
                        fontFamily: "'Courier New', Courier, monospace",
                        padding: "10px 4px",
                        letterSpacing: "0.06em",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", color: "#008F11", fontSize: "11px", marginBottom: "8px", letterSpacing: "0.12em" }}>
                    ▶ MESSAGE_PAYLOAD:
                  </label>
                  <div style={{ border: "1px solid #008F11", backgroundColor: "#000" }}>
                    <textarea
                      rows={4}
                      required
                      value={payload}
                      onChange={e => setPayload(e.target.value)}
                      placeholder="# enter your message here..."
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#00FF41",
                        fontSize: "13px",
                        fontFamily: "'Courier New', Courier, monospace",
                        padding: "10px 14px",
                        letterSpacing: "0.04em",
                        resize: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <button type="submit" style={{
                  backgroundColor: "#00FF41",
                  color: "#000",
                  border: "none",
                  padding: "12px 36px",
                  fontSize: "12px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: "bold",
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  [EXECUTE]
                </button>
              </form>
            )}
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
