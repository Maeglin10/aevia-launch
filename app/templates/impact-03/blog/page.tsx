'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Philosophy of Slow Fashion',
    date: 'October 12, 2025',
    category: 'Philosophy',
    excerpt: 'Understanding why buying less but buying better is the ultimate luxury for the modern wardrobe.',
    content: [
      'In a world dominated by ultra-fast fashion, quiet luxury represents a return to form. It is the conscious choice to value craftsmanship, material integrity, and longevity over fleeting trends.',
      'At Atelier NOIR, every piece is designed to be worn for decades. We select raw fibers that age beautifully, and we partner with heritage weavers who keep traditional techniques alive. This commitment is slower, but it produces garments that carry stories.',
      'To build a wardrobe with intention is to curate your life. It is selecting twelve perfectly fitting pieces rather than fifty disposable ones. It is knowing the hands that spun the silk and the tailors who cut the wool.'
    ]
  },
  {
    id: 2,
    title: 'How to Care for Double-Faced Cashmere',
    date: 'September 28, 2025',
    category: 'Care',
    excerpt: 'A comprehensive guide to preserving the texture, warmth, and shape of your hand-stitched cashmere coats.',
    content: [
      'Cashmere is a delicate, living fiber. Double-faced cashmere, which uses two layers of cashmere woven together, requires special attention to keep its loft and softness.',
      'Never machine wash or dry clean your cashmere coat frequently. Instead, brush it gently with a soft garment brush to remove surface dust. If a stain occurs, spot clean immediately with cold water and mild baby shampoo.',
      'Store your coat on a wide, padded hanger to maintain the shoulder structure. During summer, store it in a breathable cotton garment bag with cedar blocks to protect it from pests. Treated correctly, it will keep its beauty for generations.'
    ]
  }
];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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
      {selectedPost ? (
        <div style={{ padding: '40px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
          <button
            onClick={() => setSelectedPost(null)}
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
            Back to blog
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: 16 }}>
              {selectedPost.category} · {selectedPost.date}
            </div>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 40,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: '#0a0a0a',
                marginBottom: 40,
                lineHeight: 1.2,
              }}
            >
              {selectedPost.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {selectedPost.content.map((p: string, idx: number) => (
                <p key={idx} style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div style={{ padding: '40px 64px 100px', maxWidth: 900, margin: '0 auto' }}>
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
              The Notebook
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
              Insights on design, materiality, and the quiet luxury way of life.
            </motion.p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {BLOG_POSTS.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedPost(post);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: 48,
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(10,10,10,0.06)',
                  paddingBottom: 48,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
                    {post.category}
                  </div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: 'rgba(10,10,10,0.3)' }}>
                    {post.date}
                  </div>
                </div>

                <div>
                  <h2
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 24,
                      fontWeight: 300,
                      color: '#0a0a0a',
                      marginBottom: 12,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {post.title}
                  </h2>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, lineHeight: 1.7, color: 'rgba(10,10,10,0.5)', marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Read notebook
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
