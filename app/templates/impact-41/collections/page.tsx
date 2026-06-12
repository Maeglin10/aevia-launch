'use client';

import React from 'react';
import { SCENES, RunwayCarousel, FabricSection } from '../shared';

export default function CollectionsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: SCENES[1].bg }}>
      <FabricSection pattern="herringbone" scene={SCENES[1]}>
        <div style={{ padding: '6rem 5rem 0' }}>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              color: SCENES[1].accent,
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            Défilé Permanent
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 300,
              color: SCENES[1].textPrimary,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
              marginBottom: '2rem',
            }}
          >
            Les Collections
          </h1>
        </div>
        <RunwayCarousel scene={SCENES[1]} />
      </FabricSection>
    </div>
  );
}
