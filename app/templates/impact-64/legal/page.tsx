"use client";

import React from "react";
import { C, mono, sans } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: sans }}>
        <h1 style={{ fontFamily: mono, fontSize: "2.5rem", fontWeight: 700, color: C.green, marginBottom: "3rem" }}>
          Mentions Légales
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: 1.75, fontSize: "0.95rem", color: C.textMuted }}>
          <div>
            <h2 style={{ fontFamily: mono, fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}> Éditeur du site</h2>
            <p>
              Ce site internet est édité par Aevia WS, entreprise individuelle gérée par Valentin Milliand.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <strong>SIREN :</strong> 852 546 225<br />
              <strong>RCS :</strong> Bourg-en-Bresse<br />
              <strong>Régime :</strong> Micro-entrepreneur (TVA non applicable, article 293 B du CGI)<br />
              <strong>Contact :</strong> valentinmilliand@aevia.services
            </p>
            <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
              Adresse physique communiquée sur simple demande à valentinmilliand@aevia.services (Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse).
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: mono, fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}> Hébergement</h2>
            <p>
              Le site est hébergé par la plateforme d'hébergement Aevia WS.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: mono, fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}> Propriété Intellectuelle</h2>
            <p>
              L’ensemble des contenus présents sur ce site (textes, images, illustrations, logos, codes sources) est la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sur quelque support que ce soit est interdite sauf autorisation expresse écrite.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: mono, fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}> Protection des Données (RGPD)</h2>
            <p>
              Les données personnelles collectées via les formulaires de ce site sont destinées uniquement à la qualification de votre besoin de sécurité. Aucune donnée n'est cédée à des tiers. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données en écrivant à valentinmilliand@aevia.services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
