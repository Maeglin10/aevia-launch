"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const C = {
  bg: "#fdfaf5",
  dark: "#1a1412",
  rose: "#c4847a",
  roseLight: "#e8b4ad",
  roseDark: "#9d5f56",
  ivory: "#f7f2ea",
  ivoryDark: "#ede4d6",
  textMuted: "#8a7570",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};

export default function EbookSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/stripe/session?id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => { if (d.email) setEmail(d.email); })
      .catch(() => {});
  }, [sessionId]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: C.fontSans }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ maxWidth: 520, width: "100%", textAlign: "center" }}
      >
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 32 }}>
          ✨
        </div>
        <h1 style={{ fontFamily: C.font, fontSize: "clamp(36px,6vw,56px)", fontWeight: 300, color: C.dark, lineHeight: 1.1, marginBottom: 16 }}>
          Merci pour<br /><em>votre achat !</em>
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 32 }}>
          {email
            ? <>Votre guide a été envoyé à <strong style={{ color: C.dark }}>{email}</strong>. Vérifiez aussi vos spams.</>
            : "Votre guide a été envoyé à votre adresse e-mail. Vérifiez aussi vos spams."}
        </p>
        <div style={{ background: C.ivory, border: `1px solid ${C.ivoryDark}`, borderRadius: 4, padding: "28px 32px", marginBottom: 40, textAlign: "left" }}>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
            📖 <strong style={{ color: C.dark }}>Le Guide Complet de la Beauté du Regard</strong> — 244 pages · 7 chapitres · 4 bonus
          </p>
        </div>
        <Link href="/maison-maria" style={{ display: "inline-block", fontFamily: C.fontSans, fontSize: 13, fontWeight: 600, color: C.roseDark, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", border: `1.5px solid ${C.rose}`, borderRadius: 2 }}>
          ← Retour à Maison Maria
        </Link>
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.25)", marginTop: 24 }}>
          Un problème ? <a href="mailto:contact@maisonmarialyon69.fr" style={{ color: C.rose, textDecoration: "none" }}>contact@maisonmarialyon69.fr</a>
        </p>
      </motion.div>
    </div>
  );
}
