"use client";

import React from "react";
import { Users, Award, ShieldAlert } from "lucide-react";
import { T, Reveal } from "../shared";

export default function AboutPage() {
  return (
    <main style={{ background: "#ffffff", paddingTop: 140, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ marginBottom: 80 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
                display: "block",
              }}
            >
              About Nexus
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.25,
                paddingBottom: "8px",
                marginBottom: 16,
              }}
            >
              Unified workflow, <br />
              powering fast-moving teams
            </h1>
            <p
              style={{
                fontSize: 18,
                color: T.muted,
                fontFamily: T.bodyFont,
                lineHeight: 1.6,
                fontWeight: 450,
                maxWidth: 720,
              }}
            >
              We believe in simplifying the tools engineers and product teams use every day. By combining deep business analytics with robust pipelines and enterprise-grade security, we enable you to focus on building features, not wiring databases.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 80 }}>
          <Reveal>
            <div style={{ background: "#fafafa", border: `1px solid ${T.border}`, borderRadius: 16, padding: 40, height: "100%" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Users style={{ width: 20, height: 20, color: T.accent }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 12 }}>
                Built for Teams
              </h3>
              <p style={{ fontSize: 14, color: T.muted, fontFamily: T.bodyFont, lineHeight: 1.6 }}>
                Nexus was designed from the ground up for collaborative engineering and product environments. Real-time updates, presence, and logs make cooperation seamless.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ background: "#fafafa", border: `1px solid ${T.border}`, borderRadius: 16, padding: 40, height: "100%" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <ShieldAlert style={{ width: 20, height: 20, color: T.accent }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 12 }}>
                Secure by Default
              </h3>
              <p style={{ fontSize: 14, color: T.muted, fontFamily: T.bodyFont, lineHeight: 1.6 }}>
                Your data security is our highest priority. Nexus adheres strictly to SOC 2, HIPAA, and GDPR standards, with real-time audit logs and end-to-end encryption.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div style={{ background: T.subtle, borderRadius: 16, padding: 40, textAlign: "center" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 12 }}>
              Join the future of SaaS logic
            </h3>
            <p style={{ fontSize: 14, color: T.muted, fontFamily: T.bodyFont, maxWidth: 500, margin: "0 auto 24px" }}>
              Nexus is trusted by thousands of builders worldwide. Experience zero configuration and fast deployments.
            </p>
            <button
              style={{
                background: T.text,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: T.bodyFont,
              }}
            >
              Get started free
            </button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
