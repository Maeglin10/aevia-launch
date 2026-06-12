"use client";

import { motion } from "framer-motion";
import { C, FONT } from "../shared";

export default function LegalPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 38 }}>
          Mentions Légales
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 32, fontSize: 14, lineHeight: 1.7, color: C.textMuted }}>
          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>1. Éditeur du Site Internet</h2>
            <p style={{ fontWeight: 600, color: C.text }}>Aevia WS — Valentin Milliand</p>
            <p>SIREN : 852 546 225</p>
            <p>RCS : Bourg-en-Bresse</p>
            <p>Email de contact : contact@aevia.services</p>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>Conformément à la réglementation sur la protection de la vie privée, l'adresse physique est transmissible sur simple demande justifiée.</p>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>2. Hébergement du Site</h2>
            <p style={{ fontWeight: 600, color: C.text }}>Vercel Inc.</p>
            <p>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
            <p>Site Internet : vercel.com</p>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>3. Droits de Propriété Intellectuelle</h2>
            <p>
              L'ensemble du contenu publié sur ce site (graphismes, illustrations vectorielles, animations, logos) relève de la législation française et internationale sur le droit d'auteur. Toute reproduction totale ou partielle sans consentement exprès de l'éditeur constitue une contrefaçon passible de sanctions judiciaires.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>4. Cookies & Données Personnelles</h2>
            <p>
              Ce site à visée de démonstration ne dépose aucun cookie publicitaire et n'enregistre aucune donnée utilisateur de façon permanente. Les saisies dans le formulaire de simulation ou de contact restent stockées localement en mémoire et sont purgées lors de la fermeture de l'onglet.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
