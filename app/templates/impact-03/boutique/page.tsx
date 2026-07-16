'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const COLLECTION = [
  {
    id: 1,
    name: 'Velvet Noir Coat',
    category: 'Outerwear',
    price: 4_200,
    badge: 'New',
    color: '#1a1a2e',
    desc: 'Double-faced cashmere in midnight velvet. Structured shoulders, silk-satin lining, and hand-stitched lapels by Parisian ateliers.',
  },
  {
    id: 2,
    name: 'Sable Silk Midi',
    category: 'Dresses',
    price: 2_800,
    badge: null,
    color: '#2d1b1b',
    desc: 'Bias-cut heavy silk charmeuse that moves like water. Invisible zip, French seams throughout, hand-finished hem.',
  },
  {
    id: 3,
    name: 'Heritage Leather Tote',
    category: 'Bags',
    price: 3_600,
    badge: 'Bestseller',
    color: '#2c1810',
    desc: 'Full-grain vegetable-tanned leather ages with the wearer. Solid brass hardware, suede interior, three interior pockets.',
  },
  {
    id: 4,
    name: 'Sculptural Heel Mule',
    category: 'Shoes',
    price: 1_950,
    badge: null,
    color: '#1a1a1a',
    desc: 'Architectural block heel cast in solid resin. Nappa leather upper, padded insole, resoleable leather outsole.',
  },
  {
    id: 5,
    name: 'Geometric Wrap Blazer',
    category: 'Tailoring',
    price: 3_100,
    badge: 'Limited',
    color: '#0d1b2a',
    desc: 'Japanese wool-mohair blend with a distinctive wrap silhouette. Unlined for fluidity, covered buttons, contrast stitching.',
  },
  {
    id: 6,
    name: 'Column Knit Gown',
    category: 'Eveningwear',
    price: 5_400,
    badge: null,
    color: '#1c1c3a',
    desc: 'Fine merino wool in column silhouette. Subtle side slit, draped cowl back, hand-embroidered hem detail.',
  },
];

export default function BoutiquePage() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleAddToCart = () => {
    alert('Added to bag');
  };

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
      {selectedProduct ? (
        <div style={{ padding: '40px 64px 80px', maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
          <button
            onClick={() => setSelectedProduct(null)}
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
            }}
          >
            <ArrowLeft size={14} />
            Back to boutique
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}
          >
            {/* Visual wrapper */}
            <div
              style={{
                aspectRatio: '3/4',
                background: selectedProduct.color,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 200,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 50,
                    height: 38,
                    background: 'rgba(255,255,255,0.1)',
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                  }}
                />
              </div>
            </div>

            {/* Product details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(10,10,10,0.4)',
                  marginBottom: 16,
                }}
              >
                {selectedProduct.category}
              </div>
              <h1
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 36,
                  fontWeight: 300,
                  color: '#0a0a0a',
                  marginBottom: 16,
                  letterSpacing: '-0.02em',
                }}
              >
                {selectedProduct.name}
              </h1>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 22,
                  color: '#0a0a0a',
                  marginBottom: 32,
                }}
              >
                ${selectedProduct.price.toLocaleString("en-US")}
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: 'rgba(10,10,10,0.6)',
                  marginBottom: 40,
                }}
              >
                {selectedProduct.desc}
              </p>

              <button
                onClick={handleAddToCart}
                style={{
                  padding: '16px 48px',
                  background: '#0a0a0a',
                  color: '#fafafa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 24,
                  width: 'fit-content',
                }}
              >
                Add to Bag
              </button>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(10,10,10,0.4)',
                  lineHeight: 1.6,
                }}
              >
                • Made to order in Paris<br />
                • Complimentary worldwide shipping<br />
                • Returns accepted within 14 days
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div style={{ padding: '40px 64px 100px', maxWidth: 1280, margin: '0 auto' }}>
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
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 48,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: '#0a0a0a',
                marginBottom: 16,
              }}
            >
              The Boutique
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13,
                color: 'rgba(10,10,10,0.45)',
                letterSpacing: '0.05em',
              }}
            >
              Explore our permanent edit of hand-finished quiet luxury garments.
            </motion.p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
              gap: 32,
            }}
          >
            {COLLECTION.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedProduct(product);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{
                    background: '#f5f3f0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    aspectRatio: '3/4',
                    position: 'relative',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 140,
                      background: product.color,
                      borderRadius: 2,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: 15,
                        color: '#0a0a0a',
                        marginBottom: 4,
                        fontWeight: 'normal',
                        margin: 0,
                        paddingBottom: 4,
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#999',
                      }}
                    >
                      {product.category}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: '#0a0a0a' }}>
                    ${product.price.toLocaleString("en-US")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
