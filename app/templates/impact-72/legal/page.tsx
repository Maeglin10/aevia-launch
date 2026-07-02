"use client";
// @ts-nocheck

import React from "react";
import { C, TextReveal } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bgCard, color: C.text, minHeight: "100vh", padding: "7rem 3rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
          REGULATORY
        </div>
        <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", marginBottom: "4rem", lineHeight: 1.15, paddingBottom: "0.15em" }}>
          Mentions Légales
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.8 }}>
          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Éditeur du Site</h2>
            <p>
              Le site internet Stack Unit est édité par :
            </p>
            <ul style={{ listStyleType: "none", padding: 0, marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Nom complet : <strong style={{ color: C.text }}>Valentin Milliand</strong></li>
              <li>Régime : <strong style={{ color: C.text }}>Micro-entrepreneur (TVA non applicable, art. 293 B du CGI)</strong></li>
              <li>SIREN : <strong style={{ color: C.text }}>852 546 225</strong></li>
              <li>RCS : <strong style={{ color: C.text }}>Bourg-en-Bresse</strong></li>
              <li>Adresse physique : <strong style={{ color: C.text, fontStyle: "italic" }}>Adresse physique communiquée sur simple demande à valentinmilliand@aevia.services</strong></li>
              <li>Email de contact : <a href="mailto:valentinmilliand@aevia.services" style={{ color: C.amber, textDecoration: "none" }}>valentinmilliand@aevia.services</a></li>
            </ul>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Hébergement</h2>
            <p>
              Le site internet est hébergé par :
            </p>
            <ul style={{ listStyleType: "none", padding: 0, marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Hébergeur : <strong style={{ color: C.text }}>Firebase App Hosting / Google Cloud</strong></li>
              <li>Adresse : <strong style={{ color: C.text }}>Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</strong></li>
            </ul>
          </section>

          <section style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Propriété Intellectuelle</h2>
            <p>
              Tous les contenus de ce site (textes, images, code source, animations, etc.) sont la propriété exclusive de l'éditeur ou de ses ayants droit. Toute reproduction, copie ou diffusion partielle ou totale est interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Limitation de Responsabilité</h2>
            <p>
              L'éditeur s'efforce de fournir des informations précises et à jour sur ce site, mais ne peut garantir l'absence totale d'erreurs ou d'omissions. En aucun cas l'éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation de ce site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
