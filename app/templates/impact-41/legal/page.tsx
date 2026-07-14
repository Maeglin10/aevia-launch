'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCENES } from '../shared';

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

  const scene = SCENES[0];

  return (
    <div style={{ padding: '6rem 5rem', minHeight: '80vh', backgroundColor: scene.bg }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '3rem',
            fontWeight: 300,
            color: scene.textPrimary,
            letterSpacing: '0.04em',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          Informations Légales
        </h1>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            borderBottom: `1px solid ${scene.borderColor}`,
            paddingBottom: '1rem',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={() => setActiveTab('mentions')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'mentions' ? scene.accent : scene.textSecondary,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: activeTab === 'mentions' ? 600 : 400,
              transition: 'color 0.3s',
            }}
          >
            Mentions Légales
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'privacy' ? scene.accent : scene.textSecondary,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: activeTab === 'privacy' ? 600 : 400,
              transition: 'color 0.3s',
            }}
          >
            Privacy Policy
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ color: scene.textSecondary, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', lineHeight: 1.8 }}>
          {activeTab === 'mentions' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Éditeur du Site</h2>
                <p>
                  Ce site internet est édité par <strong>Valentin Milliand</strong>, exerçant sous le nom commercial <strong>Aevia WS</strong>.
                  <br />
                  SIREN : 852 546 225
                  <br />
                  RCS : Bourg-en-Bresse
                  <br />
                  Siège social : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à <a href="mailto:valentinmilliand@aevia.services" style={{ color: scene.accent, textDecoration: 'none' }}>valentinmilliand@aevia.services</a>).
                </p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Directeur de la Publication</h2>
                <p>Valentin Milliand — valentinmilliand@aevia.services</p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Hébergeur</h2>
                <p>
                  Le site est hébergé par Firebase App Hosting / Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande.
                </p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Propriété Intellectuelle</h2>
                <p>
                  L'ensemble des éléments constituant ce site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Data Controller</h2>
                <p>
                  The data controller for information collected on this website is <strong>Valentin Milliand</strong> (Aevia WS). For any requests or questions regarding your personal data, please contact us at <a href="mailto:valentinmilliand@aevia.services" style={{ color: scene.accent, textDecoration: 'none' }}>valentinmilliand@aevia.services</a>.
                </p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Information Collection & Use</h2>
                <p>
                  We only collect personal information that you voluntarily provide to us via contact or press request forms. This information is strictly used to process your requests and is never shared with third parties without your explicit consent.
                </p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Cookies</h2>
                <p>
                  This site may use functional cookies to enhance your browsing experience. No tracking or marketing cookies are set without your consent. You can configure your browser to decline all cookies if you prefer.
                </p>
              </div>

              <div>
                <h2 style={{ color: scene.textPrimary, fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Your Rights</h2>
                <p>
                  In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, delete, or request the portability of your personal data. To exercise these rights, please email us at valentinmilliand@aevia.services.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', backgroundColor: SCENES[0].bg }} />}>
      <LegalContent />
    </Suspense>
  );
}
