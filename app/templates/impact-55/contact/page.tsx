"use client";

import React, { useEffect, useState } from "react";
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
import { TerminalWindow } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ContactPage() {
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

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
      <EnteteAnnexe session={sessionData} repli="Ghost Shell" accueil="/templates/impact-55" />
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
          ■ SECTION_06 // PING
        </div>
        <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
          {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? "PING"}        </h2>

        <TerminalWindow title="ping.sh — establish connection">
          <div style={{ marginBottom: "28px", fontSize: "13px", color: "#008F11", letterSpacing: "0.06em" }}>
            <div>ghost@shell:~$ ping {fd?.email ?? "ghost@shell.io"}</div>
            <div style={{ color: "#005500", marginTop: "6px" }}>PING {fd?.email ?? "ghost@shell.io"} 56 bytes of data.</div>
            <div style={{ color: "#005500" }}>64 bytes from {fd?.email ?? "ghost@shell.io"}: icmp_seq=0 ttl=64 time=0.42 ms</div>
            <div style={{ color: "#00FF41", marginTop: "6px" }}>--- {fd?.email ?? "ghost@shell.io"} ping statistics ---</div>
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
