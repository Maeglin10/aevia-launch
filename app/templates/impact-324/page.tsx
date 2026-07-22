"use client";
// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Calendar,
  MapPin,
  Search,
  ShoppingCart,
  X,
  ChevronRight,
  ChevronLeft,
  Menu,
  Star,
  Check,
  Music,
  Zap,
  Clock,
  ArrowRight,
  User,
  Mail,
  CreditCard,
  ChevronDown
} from "lucide-react";
const Facebook = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Twitter = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);
const Instagram = ({ size = 24, color = 'currentColor', ...p }: any) => (<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...p}><circle cx='12' cy='12' r='10'/></svg>);

/**
 * ==========================================
 * IMPACT-324: LIVE TICKET (Event E-Commerce)
 * ==========================================
 * Business: Concert & Event Ticket Sales
 * Vibe: Dark, Neon, Energetic, Premium
 * Fonts: Montserrat (Headings) & Roboto (Body)
 * Colors: Neon Pink (#ec4899), Midnight Blue (#0f172a), Silver
 */

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100 as any);
  G = parseInt((G * (100 + percent)) / 100 as any);
  B = parseInt((B * (100 + percent)) / 100 as any);

  R = (R < 255 ? R : 255);
  G = (G < 255 ? G : 255);
  B = (B < 255 ? B : 255);

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

const C = {
  primary: "#ec4899", // Neon pink
  primaryLight: "#fbcfe8",
  primaryDark: "#be185d",
  bg: "#0f172a", // Midnight blue
  bgDeep: "#020617",
  bgCard: "#1e293b",
  text: "#f8fafc", // Silver / light
  textMuted: "#94a3b8",
  accent: "#38bdf8", // Neon blue accent
  white: "#ffffff",
  black: "#000000",
  success: "#10b981",
  danger: "#ef4444"
};

const SERIF = "'Montserrat', sans-serif";
const SANS = "'Roboto', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1540039155732-d6749b93226a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  about: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  event1: "https://images.unsplash.com/photo-1470229722913-7c090be5c5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event2: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event3: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event4: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

const CustomInstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// --- REUSABLE COMPONENTS ---

function Reveal({ children, delay = 0, y = 30, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Button({ children, variant = "primary", onClick, className = "", fullWidth = false, size = "md" }) {
  const baseStyle = {
    fontFamily: SANS,
    fontWeight: 600,
    borderRadius: "4px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: fullWidth ? "100%" : "auto",
    border: "none",
    outline: "none",
    gap: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "12px" },
    md: { padding: "12px 24px", fontSize: "14px" },
    lg: { padding: "16px 32px", fontSize: "16px" }
  };

  const variants = {
    primary: {
      backgroundColor: C.primary,
      color: C.white,
      boxShadow: `0 4px 15px ${C.primary}40`,
    },
    outline: {
      backgroundColor: "transparent",
      color: C.primary,
      border: `2px solid ${C.primary}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: C.text,
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function Eyebrow({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: "30px", height: "2px", backgroundColor: C.primary }} />
      <span style={{ 
        color: C.primary, 
        fontFamily: SANS, 
        fontWeight: 700, 
        textTransform: "uppercase",
        letterSpacing: "2px",
        fontSize: "12px"
      }}>
        {text}
      </span>
    </div>
  );
}

// --- MOCK DATA ---

const MOCK_EVENTS = [
  { id: "e1", title: "Midnight Neon Tour", artist: "Syntax Error", date: "2026-08-15", time: "21:00", venue: "The Grand Arena, Paris", price: 45, image: PHOTOS.event1, category: "Electronic" },
  { id: "e2", title: "Acoustic Sessions", artist: "Elena Rossi", date: "2026-08-20", time: "19:30", venue: "Intimate Hall, Lyon", price: 35, image: PHOTOS.event2, category: "Acoustic" },
  { id: "e3", title: "Summer Vibes Festival", artist: "Various Artists", date: "2026-09-05", time: "14:00", venue: "Open Air Park, Marseille", price: 89, image: PHOTOS.event3, category: "Festival" },
  { id: "e4", title: "Symphony of the Night", artist: "Orchestre de Paris", date: "2026-09-12", time: "20:00", venue: "Philharmonie, Paris", price: 60, image: PHOTOS.event4, category: "Classical" },
  { id: "e5", title: "Rock Revival", artist: "The Thunders", date: "2026-09-25", time: "20:30", venue: "Zénith, Lille", price: 50, image: PHOTOS.gallery[0], category: "Rock" },
  { id: "e6", title: "Jazz & Wine Night", artist: "Blue Note Quartet", date: "2026-10-02", time: "20:00", venue: "Jazz Club, Bordeaux", price: 40, image: PHOTOS.gallery[1], category: "Jazz" },
];

// --- MAIN PAGE COMPONENT ---

export default function Impact324TicketStore({ session: initialSession }) {
  // Standard session loading (matches every other template): this page is
  // never actually given a `session` prop by Next.js routing — it must fetch
  // its own from /templates/impact-324?session=<id>, otherwise fd is always {}.
  const [session, setSession] = useState(initialSession ?? null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  // Override brand color if provided
  if (fd.brandColor) {
    C.primary = fd.brandColor;
    C.primaryLight = shadeColor(fd.brandColor, 40);
    C.primaryDark = shadeColor(fd.brandColor, -20);
  }

  const businessName = fd.businessName || "LiveTicket";

  // Client-uploaded photos (uploaded in the brief) replace the stock
  // Unsplash placeholders — hero shot and about-section image first.
  // MOCK_EVENTS captured PHOTOS.eventN by value at module init, so its
  // `.image` fields must also be mutated directly, not just PHOTOS itself.
  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    const p = fd.photoUrls;
    if (p[0]) { PHOTOS.hero = p[0]; if (MOCK_EVENTS[0]) MOCK_EVENTS[0].image = p[0]; }
    if (p[1]) { PHOTOS.about = p[1]; if (MOCK_EVENTS[1]) MOCK_EVENTS[1].image = p[1]; }
    if (p[2]) { PHOTOS.event3 = p[2]; if (MOCK_EVENTS[2]) MOCK_EVENTS[2].image = p[2]; }
    if (p[3]) { PHOTOS.event4 = p[3]; if (MOCK_EVENTS[3]) MOCK_EVENTS[3].image = p[3]; }
    if (p[4]) { PHOTOS.gallery[0] = p[4]; if (MOCK_EVENTS[4]) MOCK_EVENTS[4].image = p[4]; }
    if (p[5]) { PHOTOS.gallery[1] = p[5]; if (MOCK_EVENTS[5]) MOCK_EVENTS[5].image = p[5]; }
  }, [fd]);
  const contactEmail = fd.contactEmail || "hello@liveticket.example";

  // State
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: none, 1: cart, 2: details, 3: success
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", ...Array.from(new Set(MOCK_EVENTS.map(e => e.category)))];

  const filteredEvents = MOCK_EVENTS.filter(e => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (event, qty = 1, type = "Standard") => {
    setCartItems(prev => {
      const existing = prev.find(item => item.event.id === event.id && item.type === type);
      if (existing) {
        return prev.map(item => item.event.id === event.id && item.type === type ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { event, qty, type, price: type === "VIP" ? event.price * 2 : event.price }];
    });
    setCartOpen(true);
    setCheckoutStep(1);
  };

  const removeFromCart = (id, type) => {
    setCartItems(prev => prev.filter(item => !(item.event.id === id && item.type === type)));
  };

  const updateQty = (id, type, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.event.id === id && item.type === type) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    setCheckoutStep(3); // skip to success for demo
    setTimeout(() => {
      setCartItems([]);
      setCheckoutStep(0);
      setCartOpen(false);
    }, 4000);
  };

  return (
    <div style={{ backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS, minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* NAVIGATION */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        backgroundColor: scrolled ? 'rgba(2, 6, 23, 0.95)' : 'transparent',
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.bgCard}` : '1px solid transparent',
        zIndex: 50,
        transition: "all 0.3s ease",
        padding: "16px 4%"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Music color={C.primary} size={28} />
              <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, margin: 0, color: C.white }}>
                {businessName.toUpperCase()}
              </h1>
            </div>
          )}

          <div style={{ display: "none", gap: "32px", alignItems: "center", '@media(minWidth: 768px)': { display: 'flex' } }}>
            {["Events", "VIP Packages", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
                color: C.text, textDecoration: "none", fontSize: "14px", fontWeight: 500, fontFamily: SANS, textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.2s"
              }} onMouseOver={e => e.currentTarget.style.color = C.primary} onMouseOut={e => e.currentTarget.style.color = C.text}>
                {item}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={() => { setCartOpen(true); setCheckoutStep(1); }}
              style={{
                background: "transparent", border: "none", color: C.white, cursor: "pointer", position: "relative", padding: "8px"
              }}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0, backgroundColor: C.primary, color: C.white,
                  fontSize: "10px", fontWeight: "bold", width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <div style={{ display: "block", '@media(minWidth: 768px)': { display: "none" } }}>
              <Menu size={24} />
            </div>
          </div>
        </div>
      </nav>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 99 }}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "450px", backgroundColor: C.bgCard, zIndex: 100, display: "flex", flexDirection: "column", borderLeft: `1px solid ${C.primary}30` }}
            >
              <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
                <h2 style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 700, margin: 0, color: C.white }}>
                  {checkoutStep === 1 ? "Your Cart" : checkoutStep === 2 ? "Checkout" : "Confirmation"}
                </h2>
                <button onClick={() => setCartOpen(false)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {checkoutStep === 1 && (
                  cartItems.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
                      <ShoppingCart size={48} style={{ marginBottom: "16px" }} />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {cartItems.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "16px", backgroundColor: C.bgDeep, padding: "12px", borderRadius: "8px" }}>
                          <img src={item.event.image} alt={item.event.title} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontFamily: SERIF, fontWeight: 700 }}>{item.event.title}</h4>
                            <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: C.textMuted }}>{item.type} Ticket • {item.event.date}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: C.bgCard, padding: "4px 8px", borderRadius: "4px" }}>
                                <button onClick={() => updateQty(item.event.id, item.type, -1)} style={{ background: "none", border: "none", color: C.text, cursor: "pointer" }}>-</button>
                                <span style={{ fontSize: "14px", fontWeight: 600 }}>{item.qty}</span>
                                <button onClick={() => updateQty(item.event.id, item.type, 1)} style={{ background: "none", border: "none", color: C.text, cursor: "pointer" }}>+</button>
                              </div>
                              <span style={{ fontWeight: 700, color: C.primary }}>€{item.price * item.qty}</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.event.id, item.type)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", alignSelf: "flex-start", padding: 0 }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {checkoutStep === 2 && (
                  <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontFamily: SERIF, margin: 0, color: C.primary }}>Contact Information</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <input type="text" placeholder="Full Name" required style={{ width: "100%", padding: "12px", borderRadius: "4px", border: `1px solid ${C.textMuted}`, backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS }} />
                      <input type="email" placeholder="Email Address" required style={{ width: "100%", padding: "12px", borderRadius: "4px", border: `1px solid ${C.textMuted}`, backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS }} />
                    </div>

                    <h3 style={{ fontSize: "16px", fontFamily: SERIF, margin: "16px 0 0 0", color: C.primary }}>Payment Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ position: "relative" }}>
                        <input type="text" placeholder="Card Number" required style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "4px", border: `1px solid ${C.textMuted}`, backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS }} />
                        <CreditCard size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <input type="text" placeholder="MM/YY" required style={{ flex: 1, padding: "12px", borderRadius: "4px", border: `1px solid ${C.textMuted}`, backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS }} />
                        <input type="text" placeholder="CVC" required style={{ flex: 1, padding: "12px", borderRadius: "4px", border: `1px solid ${C.textMuted}`, backgroundColor: C.bgDeep, color: C.text, fontFamily: SANS }} />
                      </div>
                    </div>
                  </form>
                )}

                {checkoutStep === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: `${C.success}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                      <Check size={32} color={C.success} />
                    </div>
                    <h2 style={{ fontFamily: SERIF, fontSize: "24px", color: C.white, margin: "0 0 16px 0" }}>Order Confirmed!</h2>
                    <p style={{ color: C.textMuted, marginBottom: "24px" }}>Your tickets have been sent to your email. Get ready for an unforgettable experience.</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: C.primary }}>Order #LVT-{Math.floor(Math.random() * 10000)}</p>
                  </div>
                )}
              </div>

              {checkoutStep < 3 && cartItems.length > 0 && (
                <div style={{ padding: "24px", borderTop: `1px solid rgba(255,255,255,0.1)`, backgroundColor: C.bgDeep }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px", color: C.textMuted }}>
                    <span>Subtotal</span>
                    <span>€{cartTotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "18px", fontWeight: 700, fontFamily: SERIF }}>
                    <span>Total</span>
                    <span style={{ color: C.primary }}>€{cartTotal}</span>
                  </div>
                  
                  {checkoutStep === 1 ? (
                    <Button fullWidth onClick={() => setCheckoutStep(2)}>Proceed to Checkout</Button>
                  ) : (
                    <Button fullWidth onClick={handleCheckout}>Pay €{cartTotal}</Button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 4% 60px",
        overflow: "hidden"
      }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${PHOTOS.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)"
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(to bottom, ${C.bgDeep}00 0%, ${C.bgDeep} 100%)`
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: `${C.primary}20`, border: `1px solid ${C.primary}`, borderRadius: "30px", marginBottom: "32px", backdropFilter: "blur(4px)" }}
          >
            <Zap size={16} color={C.primary} />
            <span style={{ color: C.white, fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              Summer Season 2026
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{ fontFamily: SERIF, fontSize: "clamp(40px, 8vw, 90px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px 0", color: C.white, textTransform: "uppercase", letterSpacing: "-2px" }}
          >
            Feel The <span style={{ color: C.primary, textShadow: `0 0 20px ${C.primary}80` }}>Vibe</span><br/>
            Live The <span style={{ WebkitTextStroke: `2px ${C.white}`, color: "transparent" }}>Moment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: C.textMuted, maxWidth: "600px", margin: "0 0 40px 0", lineHeight: 1.6 }}
          >
            {c?.heroText || "Discover the best live concerts, festivals, and exclusive events. Secure your tickets now and make memories that last a lifetime."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Button size="lg" onClick={() => { document.getElementById("events").scrollIntoView({ behavior: "smooth" }); }}>
              Browse Events
            </Button>
            <Button variant="outline" size="lg">
              VIP Packages
            </Button>
          </motion.div>
        </div>
      </section>

      {/* EVENTS CATALOG SECTION */}
      <section id="events" style={{ padding: "80px 4%", backgroundColor: C.bgDeep, position: "relative" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <Eyebrow text="Upcoming Shows" />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, margin: "16px 0", color: C.white, textTransform: "uppercase" }}>
                Secure Your Spot
              </h2>
            </div>
          </Reveal>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", gap: "20px" }}>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", flex: 1, scrollbarWidth: "none" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "10px 20px", borderRadius: "30px", border: `1px solid ${activeCategory === cat ? C.primary : C.bgCard}`,
                    backgroundColor: activeCategory === cat ? C.primary : C.bgCard, color: activeCategory === cat ? C.white : C.text,
                    fontFamily: SANS, fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", minWidth: "250px" }}>
              <input 
                type="text" 
                placeholder="Search events, artists..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: "30px", border: `1px solid ${C.bgCard}`, backgroundColor: C.bgCard, color: C.white, fontFamily: SANS }}
              />
              <Search size={18} color={C.textMuted} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: "32px" }}>
            {filteredEvents.map((event, idx) => (
              <Reveal key={event.id} delay={idx * 0.1}>
                <div style={{ 
                  backgroundColor: C.bgCard, borderRadius: "12px", overflow: "hidden", border: `1px solid rgba(255,255,255,0.05)`, transition: "transform 0.3s ease",
                  ':hover': { transform: 'translateY(-5px)' }
                }} className="event-card">
                  <div style={{ position: "relative", height: "200px" }}>
                    <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, color: C.white }}>
                      {event.category}
                    </div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: C.primary, padding: "6px 12px", borderRadius: "4px", fontSize: "14px", fontWeight: 800, color: C.white }}>
                      €{event.price}
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 700, margin: "0 0 8px 0", color: C.white }}>{event.title}</h3>
                    <p style={{ fontSize: "14px", color: C.primary, fontWeight: 600, margin: "0 0 16px 0" }}>{event.artist}</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: C.textMuted }}>
                        <Calendar size={16} /> <span>{event.date} • {event.time}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: C.textMuted }}>
                        <MapPin size={16} /> <span>{event.venue}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <Button fullWidth onClick={() => addToCart(event)}>Add to Cart</Button>
                      <button onClick={() => addToCart(event, 1, "VIP")} style={{ width: "48px", height: "48px", borderRadius: "4px", border: `1px solid ${C.primary}`, backgroundColor: "transparent", color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} title="Add VIP Ticket">
                        <Star size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: C.textMuted }}>
              No events found matching your criteria.
            </div>
          )}
        </div>
      </section>

      {/* VIP PACKAGES SECTION */}
      <section style={{ padding: "100px 4%", backgroundColor: C.bgCard }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
          <div style={{ flex: "1 1 500px" }}>
            <Reveal>
              <Eyebrow text="Exclusive Access" />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, margin: "16px 0 24px 0", color: C.white, textTransform: "uppercase" }}>
                Upgrade to VIP Experience
              </h2>
              <p style={{ color: C.textMuted, fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>
                Take your concert experience to the next level. Enjoy premium seating, exclusive backstage access, complimentary drinks, and meet & greet opportunities with your favorite artists.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                {[
                  "Early Entry & Dedicated VIP Entrance",
                  "Premium Front Row or Balcony Seating",
                  "Exclusive Merchandise Package",
                  "Access to VIP Lounge & Private Bar"
                ].map((perk, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: `${C.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={14} color={C.primary} />
                    </div>
                    <span style={{ color: C.text, fontSize: "15px" }}>{perk}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg">Explore VIP Offers</Button>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 500px", position: "relative" }}>
            <Reveal delay={0.2}>
              <img src={PHOTOS.about} alt="VIP Experience" style={{ width: "100%", borderRadius: "12px", boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }} />
              <div style={{ position: "absolute", bottom: "-20px", left: "-20px", backgroundColor: C.primary, padding: "24px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <h3 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, margin: "0 0 8px 0", color: C.white }}>Limited Availability</h3>
                <p style={{ margin: 0, color: C.white, opacity: 0.9 }}>Book now before they sell out.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY US / STATS */}
      <section style={{ padding: "80px 4%", backgroundColor: C.bgDeep, borderTop: `1px solid ${C.bgCard}`, borderBottom: `1px solid ${C.bgCard}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", textAlign: "center" }}>
            {[
              { icon: <Ticket size={40} />, value: "500K+", label: "Tickets Sold" },
              { icon: <Star size={40} />, value: "4.9/5", label: "Customer Rating" },
              { icon: <Music size={40} />, value: "120+", label: "Live Events Yearly" },
              { icon: <Zap size={40} />, value: "100%", label: "Secure Booking" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ color: C.primary, marginBottom: "16px", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
                <div style={{ fontFamily: SERIF, fontSize: "40px", fontWeight: 900, color: C.white, marginBottom: "8px" }}>{stat.value}</div>
                <div style={{ color: C.textMuted, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 4%", backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <Eyebrow text="Fan Reviews" />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, margin: "16px 0", color: C.white, textTransform: "uppercase" }}>
                Hear the crowd
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "32px" }}>
            {[
              { name: "Sophie Martin", role: "Festival Goer", text: "Best ticketing experience I've had. Fast, secure, and I got my VIP pass without any hassle. The event was legendary!" },
              { name: "Lucas Dubois", role: "Music Enthusiast", text: "The seat selection process was incredibly smooth. Customer service was also top-notch when I needed help." },
              { name: "Emma Leroy", role: "Concert Addict", text: "I attend over 20 concerts a year and this platform is by far my favorite. Never missed a drop since I started using it." }
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ backgroundColor: C.bgCard, padding: "32px", borderRadius: "12px", borderLeft: `4px solid ${C.primary}` }}>
                  <div style={{ display: "flex", gap: "4px", color: C.primary, marginBottom: "16px" }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill={C.primary} />)}
                  </div>
                  <p style={{ color: C.text, fontSize: "16px", lineHeight: 1.6, marginBottom: "24px", fontStyle: "italic" }}>"{t.text}"</p>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: C.white, fontFamily: SERIF }}>{t.name}</h4>
                    <span style={{ color: C.textMuted, fontSize: "12px" }}>{t.role}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "80px 4%", backgroundColor: C.primary, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)` }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontFamily: SERIF, fontSize: "32px", fontWeight: 800, margin: "0 0 16px 0", color: C.white, textTransform: "uppercase" }}>Never Miss a Show</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "32px" }}>Subscribe to our newsletter for pre-sale codes, exclusive drops, and VIP offers.</p>
            <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: "12px", maxWidth: "500px", margin: "0 auto", flexWrap: "wrap" }}>
              <input type="email" placeholder="Enter your email" style={{ flex: "1 1 200px", padding: "16px", borderRadius: "30px", border: "none", outline: "none", fontFamily: SANS }} />
              <Button style={{ backgroundColor: C.bgDeep, color: C.white, borderRadius: "30px", border: `2px solid ${C.bgDeep}` }}>Subscribe</Button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: C.bgDeep, borderTop: `1px solid ${C.bgCard}`, padding: "80px 4% 40px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <Music color={C.primary} size={28} />
                <h2 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 800, margin: 0, color: C.white }}>
                  {businessName.toUpperCase()}
                </h2>
              </div>
              <p style={{ color: C.textMuted, fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
                Your ultimate destination for live music, concerts, and exclusive event experiences.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href="#" style={{ color: C.textMuted }}><Facebook size={20} /></a>
                <a href="#" style={{ color: C.textMuted }}><Twitter size={20} /></a>
                <a href="#" style={{ color: C.textMuted }}><Instagram size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "16px", fontWeight: 700, color: C.white, marginBottom: "24px" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>All Events</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>VIP Packages</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>Gift Cards</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "16px", fontWeight: 700, color: C.white, marginBottom: "24px" }}>Support</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>FAQ</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>Contact</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px" }}>Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SERIF, fontSize: "16px", fontWeight: 700, color: C.white, marginBottom: "24px" }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textMuted, fontSize: "14px" }}>
                  <Mail size={16} /> {contactEmail}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textMuted, fontSize: "14px" }}>
                  <MapPin size={16} /> 123 Live Ave, Paris, FR
                </li>
              </ul>
            </div>
          </div>
          
          <div style={{ borderTop: `1px solid ${C.bgCard}`, paddingTop: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <p style={{ color: C.textMuted, fontSize: "14px", margin: 0 }}>&copy; 2026 {businessName}. All rights reserved.</p>
            <div style={{ display: "flex", gap: "16px", color: C.textMuted, fontSize: "12px" }}>
              <span>Created by Aevia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
