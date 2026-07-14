'use client';

import React from 'react';
import { SCENES, AtelierSection, FabricSection } from '../shared';

export default function AtelierPage() {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[3].bg }}>
      <FabricSection pattern="diagonal" scene={SCENES[3]}>
        <div style={{ paddingTop: '4rem' }}>
          <AtelierSection scene={SCENES[3]} />
        </div>
      </FabricSection>
    </div>
  );
}
