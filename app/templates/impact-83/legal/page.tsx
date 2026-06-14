"use client";

import React from "react";
import { C, FONT_HEADING, FONT_LABEL, Reveal } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "100px 24px", background: C.bg }} id="legal">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: 44, fontWeight: 300, color: C.text, marginBottom: 50, lineHeight: 1.15 }}>
            Mentions <em>Légales</em>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 40, color: C.textMuted, fontSize: 16, lineHeight: 1.7 }}>
            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent, marginBottom: 16, fontWeight: 300 }}>
                1. Éditeur du site
              </h3>
              <p>
                Aurelius Heritage est une marque exploitée par Valentin Milliand (propriétaire de l&apos;enseigne Aevia WS).
                <br />
                SIREN : 852 546 225
                <br />
                RCS : Bourg-en-Bresse
                <br />
                Adresse physique : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à contact@aevia.io)
                <br />
                Email : contact@aevia.io
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent, marginBottom: 16, fontWeight: 300 }}>
                2. Régime Fiscal
              </h3>
              <p>
                Régime micro-entrepreneur.
                <br />
                TVA non applicable, article 293 B du Code Général des Impôts (CGI).
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent, marginBottom: 16, fontWeight: 300 }}>
                3. Hébergeur
              </h3>
              <p>
                Le site est hébergé par la société Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, color: C.accent, marginBottom: 16, fontWeight: 300 }}>
                4. Propriété Intellectuelle
              </h3>
              <p>
                Les modèles de bijoux et de montres, les illustrations et l&apos;ensemble de la charte graphique d&apos;Aurelius Heritage sont la propriété exclusive de Valentin Milliand. Toute contrefaçon ou représentation illicite fera l&apos;objet de poursuites pénales et civiles.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
