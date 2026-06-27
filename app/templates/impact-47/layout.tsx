"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, MapPin, Phone, Clock, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { C, navLinks, CartProvider, useCart } from "./shared";

function FloristLayoutContent({ children }: { children: React.ReactNode }) {
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = pathname === "/templates/impact-47" || pathname === "/templates/impact-47/";
  const solid = scrolled || !isHome;

  const footerCols = [
    {
      title: "Boutique",
      links: [
        { label: "Tous les bouquets", href: "/templates/impact-47/boutique" },
        { label: "Créations de saison", href: "/templates/impact-47/boutique" },
        { label: "Plantes & cache-pots", href: "/templates/impact-47/boutique" },
        { label: "Compositions sur mesure", href: "/templates/impact-47/boutique" },
      ],
    },
    {
      title: "Atelier",
      links: [
        { label: "Notre histoire", href: "/templates/impact-47/about" },
        { label: "Le blog", href: "/templates/impact-47/blog" },
        { label: "Nous contacter", href: "/templates/impact-47/contact" },
        { label: "Accueil", href: "/templates/impact-47" },
      ],
    },
    {
      title: "Infos",
      links: [
        { label: "CGU", href: "/templates/impact-47/legal/cgu" },
        { label: "Mentions légales", href: "/templates/impact-47/legal/mentions-legales" },
        { label: "Contact", href: "/templates/impact-47/contact" },
        { label: "Blog", href: "/templates/impact-47/blog" },
      ],
    },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global CSS for Fonts & Mobile Responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          background-color: ${C.bg};
          color: ${C.text};
        }

        @media (max-width: 860px) {
          .florist-desktop-nav { display: none !important; }
          .florist-mobile-toggle { display: flex !important; }
        }
      `}} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: solid ? "rgba(255,255,258,0.97)" : "transparent",
        borderBottom: solid ? `1px solid ${C.border}` : "none",
        backdropFilter: solid ? "blur(16px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/templates/impact-47" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                  <circle cx="14" cy="14" r="5" fill={C.accent} />
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.85" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                  ))}
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.accent, letterSpacing: "0.02em" }}>Pétales & Co</div>
                <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.sage, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>Artisan Florist</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="florist-desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  style={{
                    color: active ? C.accent : C.textMuted,
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    fontFamily: "'Poppins', system-ui",
                    fontWeight: active ? 600 : 400,
                    borderBottom: active ? `1px solid ${C.accent}` : "1px solid transparent",
                    paddingBottom: 2,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = active ? C.accent : C.textMuted)}
                >{l.label}</Link>
              );
            })}
            <button onClick={() => setCartOpen(true)}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, background: C.accent, color: C.white, padding: "10px 22px", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Poppins', system-ui", fontWeight: 600, borderRadius: 2, border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >
              <ShoppingBag size={14} /> Panier
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: C.sage, color: C.white, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="florist-mobile-toggle" onClick={() => setMenuOpen(o => !o)}
            style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: C.accent, padding: 4 }}
            aria-label="Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", background: "rgba(255,253,248,0.99)", borderBottom: `1px solid ${C.border}` }}
            >
              <div style={{ display: "flex", flexDirection: "column" as const, padding: "12px 24px 20px", gap: 4 }}>
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    style={{ color: pathname === l.href ? C.accent : C.textMuted, fontSize: 15, padding: "10px 0", textDecoration: "none", fontFamily: "'Poppins', system-ui", fontWeight: pathname === l.href ? 600 : 400, borderBottom: `1px solid ${C.border}` }}
                  >{l.label}</Link>
                ))}
                <button onClick={() => { setMenuOpen(false); setCartOpen(true); }}
                  style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.accent, color: C.white, padding: "12px", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "'Poppins', system-ui", fontWeight: 600, borderRadius: 2, border: "none", cursor: "pointer" }}
                ><ShoppingBag size={15} /> Panier ({cartCount})</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 72 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: C.text, padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 64 }}>
            <div>
              <Link href="/templates/impact-47" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                    <circle cx="14" cy="14" r="5" fill={C.accent} />
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.7" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                    ))}
                  </svg>
                  <div>
                    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white }}>Pétales & Co</div>
                    <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 9, color: C.rose, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Artisan Florist</div>
                  </div>
                </div>
              </Link>
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Hand-crafted floral arrangements, seasonal subscriptions, and wedding floral direction. Paris, France.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={14} color={C.rose} />
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>@petalesandco</span>
              </div>
            </div>

            {footerCols.map((col, idx) => (
              <div key={idx}>
                <h4 style={{ fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.rose, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link, li) => (
                    <li key={li} style={{ marginBottom: 12 }}>
                      <Link href={link.href}
                        style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const }}>
              {[
                { Icon: MapPin, text: "18 Rue du Marché, Paris 11e" },
                { Icon: Phone, text: "+33 1 43 00 00 00" },
                { Icon: Clock, text: "Mar–Sam, 9h–19h" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={13} color={C.rose} />
                  <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              <Link href="/templates/impact-47/legal" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.rose)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>Mentions légales</Link>
              ·
              <Link href="/templates/impact-47/legal" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.rose)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>CGV</Link>
              · © 2026 Pétales & Co.
            </p>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(45,26,31,0.45)", zIndex: 200 }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 90vw)", background: C.white, borderLeft: `1px solid ${C.border}`, zIndex: 201, display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.accent, fontWeight: 700 }}>Votre panier ({cartCount})</div>
                <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={20} /></button>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 24 }}>
                <ShoppingBag size={32} color={C.textDim} />
                <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Poppins', system-ui", textAlign: "center" as const }}>
                  {cartCount === 0
                    ? "Votre panier est vide pour le moment."
                    : `${cartCount} article${cartCount > 1 ? "s" : ""} ajouté${cartCount > 1 ? "s" : ""} à votre panier.`}
                </p>
              </div>
              <div style={{ padding: "24px 28px", borderTop: `1px solid ${C.border}` }}>
                <button
                  disabled={cartCount === 0}
                  style={{ width: "100%", padding: "16px", background: cartCount === 0 ? C.textDim : C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: cartCount === 0 ? "not-allowed" : "pointer", fontFamily: "'Poppins', system-ui", borderRadius: 2 }}
                >Passer commande</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FloristLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FloristLayoutContent>{children}</FloristLayoutContent>
    </CartProvider>
  );
}
