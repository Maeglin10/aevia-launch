"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <main style={{ background: "#050510", padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#00ffd1",
                marginBottom: 12,
                display: "block",
              }}
            >
              Legal Department
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                lineHeight: 1.25,
                paddingBottom: "8px",
                letterSpacing: "-0.03em",
                color: "#e8e8ff",
                marginBottom: 12,
              }}
            >
              Mentions Légales
            </h1>
            <p style={{ fontSize: 15, color: "rgba(232,232,255,0.45)", lineHeight: 1.6 }}>
              Legal notices and information regarding regulatory compliances, hosting, and micro-entrepreneur status.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            style={{
              background: "rgba(124, 58, 237, 0.03)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
              borderRadius: 16,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              color: "rgba(232, 232, 255, 0.65)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8e8ff", marginBottom: 12 }}>
                1. Éditeur du site
              </h2>
              <p>
                Le site internet et les services associés sont édités et exploités par :
              </p>
              <ul style={{ listStyle: "none", marginTop: 8, paddingLeft: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <li><strong>Nom de l'entreprise :</strong> Valentine Milliand</li>
                <li><strong>Statut juridique :</strong> Micro-entrepreneur</li>
                <li><strong>SIREN :</strong> 852 546 225</li>
                <li><strong>RCS :</strong> Bourg-en-Bresse</li>
                <li><strong>Adresse :</strong> Bourg-en-Bresse, France</li>
                <li><strong>Email :</strong> support@artgen.studio</li>
              </ul>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid rgba(124,58,237,0.12)" }} />

            <div>
              <h2 style={{ fontSize: 18, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8e8ff", marginBottom: 12 }}>
                2. Hébergement
              </h2>
              <p>
                Ce site internet est hébergé sur des infrastructures cloud hautement sécurisées. Le service d'hébergement est géré par les serveurs Firebase App Hosting de Google Inc., situés au sein de l'Union Européenne.
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid rgba(124,58,237,0.12)" }} />

            <div>
              <h2 style={{ fontSize: 18, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8e8ff", marginBottom: 12 }}>
                3. Propriété Intellectuelle
              </h2>
              <p>
                Tous les éléments visuels, logiques de calcul, code source, graphismes et configurations présents sur la plateforme sont protégés au titre du droit d'auteur. Toute reproduction ou distribution non autorisée du moteur de rendu ou des composants associés fera l'objet de poursuites conformément aux dispositions du Code de la propriété intellectuelle.
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid rgba(124,58,237,0.12)" }} />

            <div style={{ display: "flex", gap: 16, background: "rgba(0, 255, 209, 0.04)", border: "1px solid rgba(0, 255, 209, 0.15)", borderRadius: 12, padding: 20 }}>
              <ShieldAlert style={{ color: "#00ffd1", flexShrink: 0, marginTop: 2 }} size={20} />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e8e8ff", marginBottom: 4 }}>
                  Assistance Règlementaire
                </h3>
                <p style={{ fontSize: 13, color: "rgba(232, 232, 255, 0.5)", lineHeight: 1.5 }}>
                  Pour toute réclamation, notification de contenu abusif ou question légale, veuillez nous écrire directement à : <a href="mailto:support@artgen.studio" style={{ color: "#00ffd1", textDecoration: "none" }}>support@artgen.studio</a>.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
