'use client';
import { resolveList } from "@/lib/templates/resolveList";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import {
  clientCity,
  clientName,
  clientProducts,
  clientTagline,
  clientText,
} from "@/lib/templates/clientContent";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, X, ShoppingBag, Check, Loader2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from "react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

type CartItem = { id: number; name: string; price: number; size: string; qty: number };

const COLLECTION_DEMO_ANNEXE = [
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
function COLLECTION_LIVE() {
  return resolveList(clientProducts(sessionData)?.map((p: any, i: number) => ({ ...COLLECTION_DEMO_ANNEXE[i % COLLECTION_DEMO_ANNEXE.length], name: p.name, price: p.price ?? COLLECTION_DEMO_ANNEXE[i % COLLECTION_DEMO_ANNEXE.length].price, desc: p.description ?? p.desc ?? COLLECTION_DEMO_ANNEXE[i % COLLECTION_DEMO_ANNEXE.length].desc })), COLLECTION_DEMO_ANNEXE);
}
let COLLECTION = COLLECTION_DEMO_ANNEXE;


function CartDrawer({
  cart,
  onRemove,
  onClose,
}: {
  cart: CartItem[];
  onRemove: (id: number, size: string) => void;
  onClose: () => void;
}) {
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,10,10,0.5)', display: 'flex', justifyContent: 'flex-end' }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(420px, 92vw)', height: '100%', background: '#fafafa', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(10,10,10,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, color: '#0a0a0a' }}>
            {checkout ? (sent ? 'Confirmed' : 'Your details') : `Your Bag (${cart.length})`}
          </span>
          <button
            onClick={onClose}
            aria-label="Close bag"
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,0.5)' }}
          >
            <X size={18} />
          </button>
        </div>

        {!checkout ? (
          <>
            {cart.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(10,10,10,0.4)' }}>
                <ShoppingBag size={28} />
                <span style={{ fontSize: 13 }}>Your bag is empty.</span>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(10,10,10,0.08)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: '#0a0a0a', marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)' }}>Size {item.size} · Qty {item.qty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: '#0a0a0a' }}>${(item.price * item.qty).toLocaleString('en-US')}</span>
                      <button
                        onClick={() => onRemove(item.id, item.size)}
                        aria-label={`Remove ${item.name}`}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,0.35)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: '24px 28px', borderTop: '1px solid rgba(10,10,10,0.1)' }}>
              {cart.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: 'rgba(10,10,10,0.5)' }}>Total</span>
                  <span style={{ fontFamily: "'Georgia', serif", fontSize: 18, color: '#0a0a0a' }}>${total.toLocaleString('en-US')}</span>
                </div>
              )}
              <button
                onClick={() => setCheckout(true)}
                disabled={cart.length === 0}
                style={{ width: '100%', minHeight: 44, padding: '16px', background: cart.length === 0 ? 'rgba(10,10,10,0.25)' : '#0a0a0a', color: '#fafafa', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', border: 'none', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '24px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                    style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(10,10,10,0.06)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}
                  >
                    <Check size={26} />
                  </motion.div>
                  <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.6)', lineHeight: 1.7 }}>
                    Thank you. Your order of <strong style={{ color: '#0a0a0a' }}>${total.toLocaleString('en-US')}</strong> has been placed. A confirmation email is on its way.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="bq-name" style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.5)', marginBottom: 6 }}>Full name</label>
                    <input id="bq-name" name="name" type="text" required placeholder="Jane Doe" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.15)', padding: '12px 14px', fontSize: 14, outline: 'none', color: '#0a0a0a', background: '#fff' }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="bq-email" style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.5)', marginBottom: 6 }}>Email</label>
                    <input id="bq-email" name="email" type="email" required placeholder="you@email.com" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.15)', padding: '12px 14px', fontSize: 14, outline: 'none', color: '#0a0a0a', background: '#fff' }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label htmlFor="bq-address" style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.5)', marginBottom: 6 }}>Shipping address</label>
                    <input id="bq-address" name="address" type="text" required placeholder="12 Rue de Rivoli, 75001 Paris" style={{ width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.15)', padding: '12px 14px', fontSize: 14, outline: 'none', color: '#0a0a0a', background: '#fff' }} />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', minHeight: 44, padding: '16px', background: '#0a0a0a', color: '#fafafa', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (<><Loader2 size={14} className="animate-spin" /> Placing order…</>) : ('Place order')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


export default function BoutiquePage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
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
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;
  COLLECTION = COLLECTION_LIVE();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === selectedProduct.id && i.size === selectedSize);
      if (existing) {
        return prev.map((i) => (i.id === selectedProduct.id && i.size === selectedSize ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, size: selectedSize, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemove = (id: number, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
            <button
              onClick={() => { setSelectedProduct(null); setSelectedSize(null); }}
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
              }}
            >
              <ArrowLeft size={14} />
              Back to boutique
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Bag (${cart.length})`}
              style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0a' }}
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#0a0a0a', color: '#fafafa', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.reduce((s, i) => s + i.qty, 0)}</span>
              )}
            </button>
          </div>

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
               {/* TEXTE_SECTION */ clientText(sessionData, "boutique.titre") ?? "{selectedProduct.name}"}
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
            {/* TEXTE_SECTION */ clientText(sessionData, "boutique.texte") ?? clientTagline(sessionData) ?? "{selectedProduct.desc}"}</p>

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.45)', marginBottom: 10 }}>
                  Size {!selectedSize && '(required)'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      aria-pressed={selectedSize === s}
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        padding: '0 4px',
                        background: selectedSize === s ? '#0a0a0a' : 'transparent',
                        color: selectedSize === s ? '#fafafa' : '#0a0a0a',
                        border: `1px solid ${selectedSize === s ? '#0a0a0a' : 'rgba(10,10,10,0.25)'}`,
                        fontSize: 12,
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                style={{
                  minHeight: 44,
                  padding: '16px 48px',
                  background: selectedSize ? '#0a0a0a' : 'rgba(10,10,10,0.25)',
                  color: '#fafafa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: selectedSize ? 'pointer' : 'not-allowed',
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
                • Made to order in {clientCity(sessionData) ?? "Paris"}<br />
                • Complimentary worldwide shipping<br />
                • Returns accepted within 14 days
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div style={{ padding: '40px 64px 100px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
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
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} />
              Retour à l'accueil
            </Link>
            {/* L'identité du client, là où le thème n'affichait que « Retour à l'accueil ». */}
            <EnteteAnnexe session={sessionData} repli="Atelier NOIR" accueil="/templates/impact-03" />
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Bag (${cart.length})`}
              style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0a' }}
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#0a0a0a', color: '#fafafa', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.reduce((s, i) => s + i.qty, 0)}</span>
              )}
            </button>
          </div>
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
                  setSelectedSize(null);
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

      <AnimatePresence>
        {cartOpen && <CartDrawer cart={cart} onRemove={handleRemove} onClose={() => setCartOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
