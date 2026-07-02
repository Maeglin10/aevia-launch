'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { C } from "../shared";

function LegalContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'mentions' | 'privacy'>('mentions');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'privacy') {
      setActiveTab('privacy');
    } else {
      setActiveTab('mentions');
    }
  }, [searchParams]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "2.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: "2.5rem" }}>
          <button
            onClick={() => setActiveTab('mentions')}
            style={{
              padding: "0.75rem 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: C.headingFont,
              fontSize: "1.2rem",
              letterSpacing: "0.08em",
              color: activeTab === 'mentions' ? C.accent : C.textMuted,
              borderBottom: activeTab === 'mentions' ? `2px solid ${C.accent}` : "2px solid transparent",
              transition: "all 0.2s",
              marginBottom: "-1px",
            }}
          >
            MENTIONS LÉGALES
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: "0.75rem 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: C.headingFont,
              fontSize: "1.2rem",
              letterSpacing: "0.08em",
              color: activeTab === 'privacy' ? C.accent : C.textMuted,
              borderBottom: activeTab === 'privacy' ? `2px solid ${C.accent}` : "2px solid transparent",
              transition: "all 0.2s",
              marginBottom: "-1px",
            }}
          >
            CONFIDENTIALITÉ
          </button>
        </div>

        {activeTab === 'mentions' ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              {
                title: "Éditeur du site",
                content: "Ce site internet est édité par Valentin Milliand, exerçant sous le nom commercial Aevia WS.\nSIREN : 852 546 225\nRCS : Bourg-en-Bresse\nEmail : valentinmilliand@aevia.services\nSiège social : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à valentinmilliand@aevia.services)."
              },
              {
                title: "Hébergement",
                content: "Le site est hébergé par Firebase App Hosting / Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande."
              },
              {
                title: "Directeur de publication",
                content: "Le directeur de la publication est Valentin Milliand — valentinmilliand@aevia.services."
              },
              {
                title: "Propriété intellectuelle",
                content: "L'ensemble du contenu de ce site (textes, images, sons, vidéos, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation sans autorisation préalable est interdite."
              },
              {
                title: "Responsabilité",
                content: "Aevia WS s'efforce d'assurer l'exactitude des informations publiées sur ce site. Toutefois, nous ne pouvons garantir l'exhaustivité ou l'absence d'erreur. La société se réserve le droit de modifier le contenu à tout moment."
              },
            ].map((section) => (
              <div key={section.title} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "1.75rem" }}>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{section.title}</h2>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: C.text, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { title: "Collecte des données", content: "Nous collectons uniquement les données que vous nous fournissez volontairement via nos formulaires de contact et de réservation (nom, email, téléphone, informations de projet). Ces données sont utilisées exclusivement pour traiter vos demandes." },
              { title: "Utilisation des données", content: "Vos données personnelles sont utilisées pour :\n• Traiter vos demandes de réservation\n• Vous recontacter dans le cadre de votre projet\n• Améliorer nos services\n\nNous ne vendons, ne louons ni ne partageons vos données avec des tiers à des fins commerciales." },
              { title: "Conservation des données", content: "Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et, le cas échéant, pour une durée de 3 ans à des fins de prospection commerciale, conformément à la réglementation RGPD." },
              { title: "Vos droits", content: "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement\n• Droit à la portabilité\n• Droit d'opposition\n\nPour exercer ces droits : valentinmilliand@aevia.services" },
              { title: "Cookies", content: "Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de tracking tiers n'est utilisé sans votre consentement explicite." },
              { title: "Contact DPO", content: "Pour toute question relative à la protection de vos données : valentinmilliand@aevia.services\nAevia WS — SIREN : 852 546 225" },
            ].map((section) => (
              <div key={section.title} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "1.75rem" }}>
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{section.title}</h2>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: C.text, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: C.bg }} />}>
      <LegalContent />
    </Suspense>
  );
}
