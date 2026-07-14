'use client';

import React from 'react';
import { SCENES, ContactSection, FabricSection } from '../shared';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[1].bg }}>
      <FabricSection pattern="grid" scene={SCENES[1]}>
        <div style={{ paddingTop: '4rem' }}>
          <ContactSection scene={SCENES[1]} />
        </div>
      </FabricSection>
    </div>
  );
}
