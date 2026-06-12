'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SCENES } from './shared';

export default function VMMaisonLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Collections', href: '/templates/impact-41/collections' },
    { label: 'Lookbook', href: '/templates/impact-41/lookbook' },
    { label: "L'Atelier", href: '/templates/impact-41/atelier' },
    { label: 'Contact', href: '/templates/impact-41/contact' },
  ];

  const isHome = pathname === '/templates/impact-41';

  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
        backgroundColor: SCENES[0].bg,
        color: SCENES[0].textPrimary,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* Google Fonts import via global style */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: inherit; opacity: 0.35; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAVBAR */}
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: scrolled || !isHome ? '1.2rem 4rem' : '1.8rem 4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: scrolled || !isHome ? `${SCENES[0].bg}f0` : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
          borderBottom: scrolled || !isHome ? `1px solid ${SCENES[0].borderColor}` : '1px solid transparent',
          transition: 'all 0.5s ease',
        }}
      >
        {/* Logo */}
        <Link
          href="/templates/impact-41"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.05rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: SCENES[0].textPrimary,
            fontWeight: 300,
            textDecoration: 'none',
          }}
        >
          VM Maison
        </Link>

        {/* Nav Links */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: isActive ? SCENES[0].accent : SCENES[0].textSecondary,
                  textDecoration: 'none',
                  transition: 'color 0.25s ease',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/templates/impact-41/contact" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ letterSpacing: '0.32em' }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: SCENES[0].accent,
              border: `1px solid ${SCENES[0].accent}`,
              padding: '0.65rem 1.5rem',
              cursor: 'pointer',
            }}
          >
            Prendre Contact
          </motion.div>
        </Link>
      </motion.nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : '80px' }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: SCENES[0].bg,
          borderTop: `1px solid ${SCENES[0].borderColor}`,
          padding: '4rem 5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Link
              href="/templates/impact-41"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.5rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: SCENES[0].textPrimary,
                fontWeight: 300,
                marginBottom: '0.5rem',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              VM Maison
            </Link>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: SCENES[0].textSecondary,
                textTransform: 'uppercase',
              }}
            >
              Haute Couture — Paris — Est. 2008
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4rem' }}>
            {[
              {
                title: 'Maison',
                links: [
                  { label: 'Accueil', href: '/templates/impact-41' },
                  { label: "L'Atelier", href: '/templates/impact-41/atelier' },
                  { label: 'Lookbook', href: '/templates/impact-41/lookbook' },
                ],
              },
              {
                title: 'Collections',
                links: [
                  { label: 'Automne Hiver', href: '/templates/impact-41/collections' },
                  { label: 'Printemps Été', href: '/templates/impact-41/collections' },
                  { label: 'Haute Couture', href: '/templates/impact-41/collections' },
                  { label: 'Capsule', href: '/templates/impact-41/collections' },
                ],
              },
              {
                title: 'Services',
                links: [
                  { label: 'Sur-mesure', href: '/templates/impact-41/contact' },
                  { label: 'Boutiques', href: '/templates/impact-41/contact' },
                  { label: 'Presse', href: '/templates/impact-41/contact' },
                  { label: 'Contact', href: '/templates/impact-41/contact' },
                ],
              },
            ].map((col) => (
              <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: SCENES[0].accent,
                    marginBottom: '0.25rem',
                  }}
                >
                  {col.title}
                </div>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '0.9rem',
                      color: SCENES[0].textSecondary,
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${SCENES[0].borderColor}`,
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              color: SCENES[0].textSecondary,
              textTransform: 'uppercase',
            }}
          >
            © 2026 VM Maison — Tous droits réservés
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link
              href="/templates/impact-41/legal?tab=mentions"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.15em',
                color: SCENES[0].textSecondary,
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Mentions Légales
            </Link>
            <Link
              href="/templates/impact-41/legal?tab=privacy"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.15em',
                color: SCENES[0].textSecondary,
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
