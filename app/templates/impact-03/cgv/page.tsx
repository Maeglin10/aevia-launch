'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export default function CGVPage() {
  return (
    <div
      style={{
        background: '#fafafa',
        color: '#0a0a0a',
        minHeight: '100dvh',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        paddingTop: 80,
      }}
    >
      <div style={{ padding: '40px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <Link
          href="/templates/impact-03"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 48,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 40 }}
        >
          Conditions Générales de Vente
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}
        >
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>1. Objet</h2>
            <p>Les présentes Conditions Générales de Vente régissent les relations contractuelles entre Atelier NOIR et tout client effectuant un achat sur notre boutique en ligne.</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>2. Prix et commande</h2>
            <p>Les prix de nos produits sont indiqués en Dollars ($) ou Euros (€) toutes taxes comprises. La commande est validée après paiement complet de la commande.</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>3. Livraison et Retours</h2>
            <p>Nos pièces étant réalisées sur commande dans notre atelier parisien, le délai de fabrication et d&apos;expédition est de 6 à 8 semaines. Les retours sont possibles sous 14 jours.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
