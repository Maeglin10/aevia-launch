"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { C, faqs } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function FAQPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>FAQ</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 56px)", color: C.white, margin: 0, fontWeight: 700 }}>Questions & Answers</h1>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.white, fontWeight: 600 }}>{faq.q}</span>
                <div style={{ transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                  <ChevronDown size={18} color={C.accent} />
                </div>
              </button>
              <div
                style={{
                  height: openIdx === i ? "auto" : 0,
                  opacity: openIdx === i ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  paddingBottom: openIdx === i ? 24 : 0
                }}
              >
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
