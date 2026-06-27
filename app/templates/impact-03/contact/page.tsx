'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);

  return (
    <div
      style={{
        background: '#fafafa',
        color: '#0a0a0a',
        minHeight: '100vh',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        paddingTop: 80,
      }}
    >
      <div style={{ padding: '40px 64px 100px', maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
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

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
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
            Contact Us
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
            Enquire about bespoke orders or private appointments.
          </motion.p>
        </div>

        {!formSent ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={(e) => { e.preventDefault(); setFormSent(true); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <div>
              <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Name</label>
              <input required type="text" style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Email</label>
              <input required type="email" style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 8, display: 'block' }}>Message</label>
              <textarea required rows={5} style={{ width: '100%', padding: '16px', background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.1)', outline: 'none', fontSize: 13, resize: 'none' }}></textarea>
            </div>
            <button type="submit" style={{ padding: '16px', background: '#0a0a0a', color: '#fafafa', border: 'none', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 12 }}>
              Send message
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(10,10,10,0.6)' }}
          >
            <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Thank you.</h3>
            <p style={{ fontSize: 13 }}>Your enquiry has been received. Our team will contact you within 24 hours.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
