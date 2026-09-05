"use client";
import {
  clientAddress,
  clientCity,
  clientInstagram,
  clientName,
  clientPhone,
} from "@/lib/templates/clientContent";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, MapPin, Phone, Clock, MessageSquare, Trash2, Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { C, navLinks, CartProvider, useCart } from "./shared";

function FloristLayoutContent({ children }: { children: React.ReactNode }) {
  const { cartItems, cartCount, removeFromCart, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSent, setCheckoutSent] = useState(false);
  const pathname = usePathname();

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const closeCart = () => {
    setCartOpen(false);
    setCheckoutOpen(false);
    setCheckoutSent(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutSent(true);
    }, 1800);
  };

  const [__layoutSession, __setLayoutSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setLayoutSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);
  const fd = __layoutSession?.formData;

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
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
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
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 28 28" style={{ width: 28, height: 28 }}>
                  <circle cx="14" cy="14" r="5" fill={C.accent} />
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx={14 + 9 * Math.cos((angle * Math.PI) / 180)} cy={14 + 9 * Math.sin((angle * Math.PI) / 180)} rx="3.5" ry="5.5" fill={C.rose} opacity="0.85" transform={`rotate(${angle + 90} ${14 + 9 * Math.cos((angle * Math.PI) / 180)} ${14 + 9 * Math.sin((angle * Math.PI) / 180)})`} />
                  ))}
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.accent, letterSpacing: "0.02em" }}>{clientName(__layoutSession) ?? "Pétales & Co"}</div>
                {clientName(__layoutSession) ? null : <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 10, color: C.sage, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>Artisan Florist</div>}
              </div>
            </div></>
            )}
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
                    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white }}>{clientName(__layoutSession) ?? "Pétales & Co"}</div>
                    <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 10, color: C.rose, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Artisan Florist</div>
                  </div>
                </div>
              </Link>
              <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Hand-crafted floral arrangements, seasonal subscriptions, and wedding floral direction. {clientCity(__layoutSession) ?? "Paris"}, France.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={14} color={C.rose} />
                <span style={{ fontFamily: "'Poppins', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>@{clientInstagram(__layoutSession) ?? "petalesandco"}</span>
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
                { Icon: MapPin, text: clientAddress(__layoutSession) ?? clientCity(__layoutSession) ?? "18 Rue du Marché, Paris 11e" },
                { Icon: Phone, text: clientPhone(__layoutSession) ?? "+33 1 43 00 00 00" },
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
              · © 2026 {/* NOM_PIED */ clientName(__layoutSession) ?? "Pétales & Co"}.
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
              onClick={closeCart}
              style={{ position: "fixed", inset: 0, background: "rgba(45,26,31,0.45)", zIndex: 200 }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 90vw)", background: C.white, borderLeft: `1px solid ${C.border}`, zIndex: 201, display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: C.accent, fontWeight: 700 }}>
                  {checkoutOpen ? (checkoutSent ? "Commande confirmée" : "Vos coordonnées") : `Votre panier (${cartCount})`}
                </div>
                <button onClick={closeCart} aria-label="Fermer le panier" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={20} /></button>
              </div>

              {!checkoutOpen ? (
                <>
                  {cartItems.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 24 }}>
                      <ShoppingBag size={32} color={C.textDim} />
                      <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Poppins', system-ui", textAlign: "center" as const }}>
                        Votre panier est vide pour le moment.
                      </p>
                    </div>
                  ) : (
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
                      {cartItems.map(item => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                            <div style={{ fontFamily: "'Poppins', system-ui", fontSize: 12, color: C.textDim }}>Qté {item.qty} · {item.price} € / unité</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: C.accent, fontWeight: 700 }}>{item.price * item.qty} €</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Retirer ${item.name}`}
                              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.textDim }}
                            ><Trash2 size={15} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ padding: "24px 28px", borderTop: `1px solid ${C.border}` }}>
                    {cartItems.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontFamily: "'Poppins', system-ui" }}>
                        <span style={{ fontSize: 14, color: C.textMuted }}>Total</span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{cartTotal} €</span>
                      </div>
                    )}
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      disabled={cartItems.length === 0}
                      style={{ width: "100%", minHeight: 44, padding: "16px", background: cartItems.length === 0 ? C.textDim : C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: cartItems.length === 0 ? "not-allowed" : "pointer", fontFamily: "'Poppins', system-ui", borderRadius: 2 }}
                    >Passer commande</button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                  <AnimatePresence mode="wait">
                    {checkoutSent ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "24px 0" }}>
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                          style={{ width: 60, height: 60, borderRadius: "50%", background: C.rose ? `${C.rose}22` : "rgba(0,0,0,0.06)", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}
                        ><Check size={26} /></motion.div>
                        <p style={{ fontFamily: "'Poppins', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
                          Merci ! Votre commande de <strong style={{ color: C.text }}>{cartTotal} €</strong> a bien été enregistrée. Nous vous recontactons sous peu pour confirmer la livraison.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleCheckoutSubmit}>
                        <div style={{ marginBottom: 16 }}>
                          <label htmlFor="co-name" style={{ display: "block", fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Nom complet</label>
                          <input id="co-name" name="name" type="text" required placeholder="Camille Dubois" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, padding: "12px 14px", fontSize: 14, fontFamily: "'Poppins', system-ui", outline: "none", color: C.text, borderRadius: 2 }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label htmlFor="co-email" style={{ display: "block", fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>E-mail</label>
                          <input id="co-email" name="email" type="email" required placeholder="vous@email.com" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, padding: "12px 14px", fontSize: 14, fontFamily: "'Poppins', system-ui", outline: "none", color: C.text, borderRadius: 2 }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label htmlFor="co-phone" style={{ display: "block", fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Téléphone</label>
                          <input id="co-phone" name="phone" type="tel" required placeholder="06 12 34 56 78" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, padding: "12px 14px", fontSize: 14, fontFamily: "'Poppins', system-ui", outline: "none", color: C.text, borderRadius: 2 }} />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                          <label htmlFor="co-address" style={{ display: "block", fontFamily: "'Poppins', system-ui", fontSize: 11, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>Adresse de livraison</label>
                          <input id="co-address" name="address" type="text" required placeholder="18 Rue du Marché, Paris 11e" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.border}`, padding: "12px 14px", fontSize: 14, fontFamily: "'Poppins', system-ui", outline: "none", color: C.text, borderRadius: 2 }} />
                        </div>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          style={{ width: "100%", minHeight: 44, padding: "16px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: checkoutLoading ? "not-allowed" : "pointer", fontFamily: "'Poppins', system-ui", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: checkoutLoading ? 0.75 : 1 }}
                        >
                          {checkoutLoading ? (<><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>) : ("Confirmer la commande")}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              )}
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
