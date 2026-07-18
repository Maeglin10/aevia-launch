"use client";
// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Building, Calendar, MapPin, Search, ShoppingCart, 
  X, ChevronRight, ChevronLeft, Menu, Star, Check, 
  Instagram, Briefcase, Award, Clock, ArrowRight, User, Mail, CreditCard, FileText, ChevronDown, Linkedin, Twitter
} from "lucide-react";

/**
 * ==========================================
 * IMPACT-325: B2B SEMINAR HUB (Event E-Commerce)
 * ==========================================
 * Business: Professional Seminars & Masterclasses
 * Vibe: Corporate, Premium, Elegant, Light
 * Fonts: Lora (Headings) & Inter (Body)
 * Colors: Navy Blue (#1e3a8a), Gold (#eab308), Canvas
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
  primary: "#1e3a8a", // Navy Blue
  primaryLight: "#3b82f6",
  primaryDark: "#172554",
  bg: "#f8fafc", // Light Canvas
  bgDeep: "#ffffff",
  bgCard: "#f1f5f9",
  text: "#0f172a", // Dark Text
  textMuted: "#64748b",
  accent: "#eab308", // Gold
  white: "#ffffff",
  black: "#000000",
  success: "#16a34a",
  danger: "#dc2626",
  border: "#e2e8f0"
};

const SERIF = "'Lora', serif";
const SANS = "'Inter', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  about: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  event1: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event2: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event3: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  event4: "https://images.unsplash.com/photo-1475721025592-251f28ff1207?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  speaker1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  speaker2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
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
    fontWeight: 500,
    borderRadius: "2px", // Professional, sharp edges
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: fullWidth ? "100%" : "auto",
    border: "none",
    outline: "none",
    gap: "8px",
    letterSpacing: "0.5px"
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "13px" },
    md: { padding: "12px 24px", fontSize: "15px" },
    lg: { padding: "16px 32px", fontSize: "16px" }
  };

  const variants = {
    primary: {
      backgroundColor: C.primary,
      color: C.white,
    },
    accent: {
      backgroundColor: C.accent,
      color: C.primaryDark,
      fontWeight: 600
    },
    outline: {
      backgroundColor: "transparent",
      color: C.primary,
      border: `1px solid ${C.primary}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: C.text,
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: variant === 'primary' || variant === 'accent' ? "0 4px 12px rgba(0,0,0,0.1)" : "none" }}
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
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
      <div style={{ width: "40px", height: "1px", backgroundColor: C.accent }} />
      <span style={{ 
        color: C.accent, 
        fontFamily: SANS, 
        fontWeight: 600, 
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontSize: "12px"
      }}>
        {text}
      </span>
    </div>
  );
}

// --- MOCK DATA ---

const MOCK_EVENTS = [
  { id: "s1", title: "Leadership Masterclass 2026", speaker: "Dr. Jonathan Hayes", date: "2026-09-10", time: "09:00 - 17:00", venue: "Grand Hotel Paris", price: 450, image: PHOTOS.event1, category: "Leadership", level: "Executive" },
  { id: "s2", title: "Future of AI in Business", speaker: "Sarah Chen", date: "2026-09-22", time: "10:00 - 16:00", venue: "Tech Hub London", price: 300, image: PHOTOS.event2, category: "Technology", level: "All Levels" },
  { id: "s3", title: "Advanced Financial Strategy", speaker: "Robert Sterling", date: "2026-10-05", time: "09:00 - 18:00", venue: "Finance Center Frankfurt", price: 600, image: PHOTOS.event3, category: "Finance", level: "Advanced" },
  { id: "s4", title: "Strategic Marketing Summit", speaker: "Elena Rodriguez", date: "2026-10-15", time: "09:30 - 15:30", venue: "Palais des Congrès", price: 350, image: PHOTOS.event4, category: "Marketing", level: "Intermediate" },
];

// --- MAIN PAGE COMPONENT ---

export default function Impact325SeminarHub({ session }) {
  const fd = session?.formData || {};
  const c = session?.generatedContent || {};

  // Override brand color if provided
  if (fd.brandColor) {
    C.primary = fd.brandColor;
    C.primaryLight = shadeColor(fd.brandColor, 40);
    C.primaryDark = shadeColor(fd.brandColor, -20);
  }

  const businessName = fd.businessName || "ExecutiveHub";
  const contactEmail = fd.contactEmail || "contact@executivehub.example";

  // State
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: none, 1: cart, 2: details, 3: success
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", ...Array.from(new Set(MOCK_EVENTS.map(e => e.category)))];

  const filteredEvents = MOCK_EVENTS.filter(e => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getTicketPrice = (basePrice, type) => {
    if (type === "Early Bird") return basePrice * 0.8;
    if (type === "Executive") return basePrice * 1.5;
    return basePrice;
  };

  const addToCart = (event, qty = 1, type = "Standard") => {
    setCartItems(prev => {
      const existing = prev.find(item => item.event.id === event.id && item.type === type);
      if (existing) {
        return prev.map(item => item.event.id === event.id && item.type === type ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { event, qty, type, price: getTicketPrice(event.price, type) }];
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
    }, 5000);
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: SANS, minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* NAVIGATION */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        zIndex: 50,
        transition: "all 0.3s ease",
        padding: "20px 4%"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Building color={scrolled ? C.primary : C.white} size={28} />
            <h1 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 700, margin: 0, color: scrolled ? C.primary : C.white }}>
              {businessName}
            </h1>
          </div>

          <div style={{ display: "none", gap: "40px", alignItems: "center", '@media(minWidth: 768px)': { display: 'flex' } }}>
            {["Seminars", "Speakers", "Corporate", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: scrolled ? C.text : C.white, textDecoration: "none", fontSize: "14px", fontWeight: 500, fontFamily: SANS, transition: "color 0.2s"
              }} onMouseOver={e => e.currentTarget.style.color = C.accent} onMouseOut={e => e.currentTarget.style.color = scrolled ? C.text : C.white}>
                {item}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={() => { setCartOpen(true); setCheckoutStep(1); }}
              style={{
                background: "transparent", border: "none", color: scrolled ? C.text : C.white, cursor: "pointer", position: "relative", padding: "8px"
              }}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0, backgroundColor: C.accent, color: C.primaryDark,
                  fontSize: "11px", fontWeight: "bold", width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <Button variant={scrolled ? "primary" : "outline"} size="sm" style={{ display: "none", '@media(minWidth: 768px)': { display: "inline-flex" } }}>
              Login
            </Button>
            <div style={{ display: "block", color: scrolled ? C.text : C.white, '@media(minWidth: 768px)': { display: "none" } }}>
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
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", zIndex: 99 }}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "500px", backgroundColor: C.bgDeep, zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "-5px 0 25px rgba(0,0,0,0.1)" }}
            >
              <div style={{ padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 600, margin: 0, color: C.primary }}>
                  {checkoutStep === 1 ? "Your Registration" : checkoutStep === 2 ? "Attendee Details" : "Invoice Sent"}
                </h2>
                <button onClick={() => setCartOpen(false)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
                {checkoutStep === 1 && (
                  cartItems.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.textMuted }}>
                      <Briefcase size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
                      <p>No seminars selected.</p>
                      <Button variant="outline" style={{ marginTop: "20px" }} onClick={() => setCartOpen(false)}>Browse Seminars</Button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {cartItems.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "16px", paddingBottom: "24px", borderBottom: `1px solid ${C.border}` }}>
                          <img src={item.event.image} alt={item.event.title} style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "4px" }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontFamily: SERIF, fontWeight: 600, color: C.primary }}>{item.event.title}</h4>
                            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: C.textMuted }}>{item.type} Access • {item.event.date}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${C.border}`, padding: "4px 8px", borderRadius: "2px" }}>
                                <button onClick={() => updateQty(item.event.id, item.type, -1)} style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: "0 4px" }}>-</button>
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.qty}</span>
                                <button onClick={() => updateQty(item.event.id, item.type, 1)} style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: "0 4px" }}>+</button>
                              </div>
                              <span style={{ fontWeight: 600, color: C.text }}>${item.price * item.qty}</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.event.id, item.type)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", alignSelf: "flex-start", padding: 0 }}>
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {checkoutStep === 2 && (
                  <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontFamily: SANS, fontWeight: 600, margin: "0 0 16px 0", color: C.primary }}>Company Details</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input type="text" placeholder="Company Name" required style={{ width: "100%", padding: "12px", borderRadius: "2px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: SANS }} />
                        <input type="text" placeholder="VAT Number (Optional)" style={{ width: "100%", padding: "12px", borderRadius: "2px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: SANS }} />
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: "16px", fontFamily: SANS, fontWeight: 600, margin: "0 0 16px 0", color: C.primary }}>Primary Contact</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <input type="text" placeholder="First Name" required style={{ flex: 1, padding: "12px", borderRadius: "2px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: SANS }} />
                          <input type="text" placeholder="Last Name" required style={{ flex: 1, padding: "12px", borderRadius: "2px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: SANS }} />
                        </div>
                        <input type="email" placeholder="Corporate Email Address" required style={{ width: "100%", padding: "12px", borderRadius: "2px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, fontFamily: SANS }} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: C.bgCard, padding: "16px", borderRadius: "4px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <FileText size={20} color={C.primary} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>
                        An invoice will be generated and sent to the provided email address upon confirmation. Payment terms are 30 days net.
                      </p>
                    </div>
                  </form>
                )}

                {checkoutStep === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: `${C.success}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                      <Check size={40} color={C.success} />
                    </div>
                    <h2 style={{ fontFamily: SERIF, fontSize: "24px", color: C.primary, margin: "0 0 16px 0" }}>Registration Successful</h2>
                    <p style={{ color: C.textMuted, marginBottom: "32px", lineHeight: 1.6 }}>
                      Thank you for registering. The invoice and attendee access details have been sent to your corporate email.
                    </p>
                    <div style={{ backgroundColor: C.bgCard, padding: "20px", borderRadius: "4px", width: "100%" }}>
                      <p style={{ fontSize: "13px", color: C.textMuted, margin: "0 0 8px 0" }}>Registration ID</p>
                      <p style={{ fontSize: "18px", fontWeight: 600, color: C.text, margin: 0, fontFamily: SANS }}>B2B-{Math.floor(Math.random() * 100000)}</p>
                    </div>
                  </div>
                )}
              </div>

              {checkoutStep < 3 && cartItems.length > 0 && (
                <div style={{ padding: "30px", borderTop: `1px solid ${C.border}`, backgroundColor: C.bgDeep }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: C.textMuted }}>
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "14px", color: C.textMuted }}>
                    <span>Tax (VAT 20%)</span>
                    <span>${(cartTotal * 0.2).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "20px", fontWeight: 600, fontFamily: SERIF }}>
                    <span>Total</span>
                    <span style={{ color: C.primary }}>${(cartTotal * 1.2).toFixed(2)}</span>
                  </div>
                  
                  {checkoutStep === 1 ? (
                    <Button fullWidth size="lg" onClick={() => setCheckoutStep(2)}>Continue to Details</Button>
                  ) : (
                    <Button fullWidth size="lg" onClick={handleCheckout}>Confirm Registration</Button>
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
        padding: "120px 4% 80px",
        backgroundColor: C.primary,
        overflow: "hidden"
      }}>
        {/* Abstract shapes / Image background */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "60%",
          backgroundImage: `url(${PHOTOS.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)"
        }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.primaryDark} 40%, transparent 100%)`, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ maxWidth: "700px" }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", backgroundColor: `${C.accent}20`, border: `1px solid ${C.accent}`, color: C.accent, fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "30px" }}
            >
              Executive Masterclasses
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              style={{ fontFamily: SERIF, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 500, lineHeight: 1.1, margin: "0 0 24px 0", color: C.white }}
            >
              Elevate Your Corporate Strategy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
              style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)", margin: "0 0 40px 0", lineHeight: 1.6, fontWeight: 300 }}
            >
              {c?.heroText || "Join industry leaders in exclusive seminars designed for executives and visionaries. Equip your team with the knowledge to drive innovation and growth."}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button size="lg" variant="accent" onClick={() => { document.getElementById("seminars").scrollIntoView({ behavior: "smooth" }); }}>
                View Upcoming Seminars
              </Button>
              <Button variant="outline" size="lg" style={{ color: C.white, borderColor: "rgba(255,255,255,0.3)" }}>
                Corporate Solutions
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: "40px 4%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", textAlign: "center" }}>
           {[
             { label: "Industry Leaders", value: "50+", icon: <User size={24}/> },
             { label: "Corporate Partners", value: "200+", icon: <Building size={24}/> },
             { label: "Global Locations", value: "12", icon: <MapPin size={24}/> },
             { label: "Satisfaction Rate", value: "98%", icon: <Award size={24}/> },
           ].map((stat, i) => (
             <Reveal key={i} delay={i * 0.1}>
               <div style={{ color: C.primary, marginBottom: "12px", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
               <div style={{ fontFamily: SERIF, fontSize: "32px", fontWeight: 600, color: C.text, marginBottom: "4px" }}>{stat.value}</div>
               <div style={{ color: C.textMuted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
             </Reveal>
           ))}
        </div>
      </section>

      {/* SEMINARS CATALOG */}
      <section id="seminars" style={{ padding: "100px 4%", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "60px" }}>
              <Eyebrow text="Curriculum" />
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, margin: "0", color: C.text }}>
                Upcoming Masterclasses
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
                    padding: "8px 20px", borderRadius: "20px", border: `1px solid ${activeCategory === cat ? C.primary : C.border}`,
                    backgroundColor: activeCategory === cat ? C.primary : C.white, color: activeCategory === cat ? C.white : C.textMuted,
                    fontFamily: SANS, fontWeight: 500, fontSize: "14px", cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List/Grid View */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {filteredEvents.map((event, idx) => (
              <Reveal key={event.id} delay={idx * 0.1}>
                <div style={{ 
                  backgroundColor: C.white, borderRadius: "4px", overflow: "hidden", border: `1px solid ${C.border}`, 
                  display: "flex", flexDirection: "row", flexWrap: "wrap", transition: "box-shadow 0.3s ease",
                  ':hover': { boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }
                }} className="seminar-card">
                  <div style={{ width: "100%", maxWidth: "300px", minHeight: "200px", position: "relative" }}>
                    <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                    <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: C.white, padding: "4px 12px", borderRadius: "2px", fontSize: "12px", fontWeight: 600, color: C.primary }}>
                      {event.category}
                    </div>
                  </div>
                  
                  <div style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: "300px" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 600, margin: 0, color: C.text }}>{event.title}</h3>
                        <span style={{ fontSize: "20px", fontWeight: 700, color: C.primary }}>${event.price}</span>
                      </div>
                      <p style={{ fontSize: "15px", color: C.textMuted, marginBottom: "20px" }}>Led by <span style={{ fontWeight: 600, color: C.text }}>{event.speaker}</span></p>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: C.textMuted }}>
                          <Calendar size={16} color={C.primary} /> <span>{event.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: C.textMuted }}>
                          <Clock size={16} color={C.primary} /> <span>{event.time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: C.textMuted }}>
                          <MapPin size={16} color={C.primary} /> <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <Button onClick={() => addToCart(event)}>Register Now</Button>
                      <select 
                        onChange={(e) => addToCart(event, 1, e.target.value)}
                        style={{ padding: "10px 16px", borderRadius: "2px", border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: "14px", backgroundColor: C.bg, cursor: "pointer", outline: "none" }}
                        defaultValue=""
                      >
                        <option value="" disabled>Other Ticket Types...</option>
                        <option value="Early Bird">Early Bird (-20%)</option>
                        <option value="Executive">Executive (+50%)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US / CORPORATE SOLUTIONS */}
      <section style={{ padding: "100px 4%", backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "60px", alignItems: "center" }}>
          <Reveal>
            <Eyebrow text="For Enterprises" />
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, margin: "0 0 24px 0", color: C.text }}>
              Transform your leadership team
            </h2>
            <p style={{ color: C.textMuted, fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
              Our executive masterclasses are designed to provide actionable insights and strategic frameworks. We offer comprehensive corporate packages including private workshops, dedicated account management, and centralized invoicing.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "Customized curriculum alignment",
                "Volume licensing and group discounts",
                "Post-seminar implementation support",
                "Priority access to global industry experts"
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: C.text, fontSize: "15px" }}>
                  <Check size={18} color={C.primary} /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline">Request Corporate Brochure</Button>
          </Reveal>
          
          <Reveal delay={0.2} style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100%", height: "100%", border: `2px solid ${C.accent}`, zIndex: 0 }} />
            <img src={PHOTOS.about} alt="Corporate Seminar" style={{ width: "100%", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: C.text, color: C.white, padding: "80px 4% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <Building color={C.accent} size={28} />
                <h2 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 700, margin: 0, color: C.white }}>
                  {businessName}
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, maxWidth: "400px", marginBottom: "24px" }}>
                Empowering leaders and organizations through world-class seminars, strategic insights, and global networking opportunities.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href="#" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}><Linkedin size={20} /></a>
                <a href="#" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}><Twitter size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 600, color: C.white, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Programs</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Executive Leadership</a></li>
                <li><a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Financial Strategy</a></li>
                <li><a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Tech & Innovation</a></li>
                <li><a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Corporate Custom</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: SANS, fontSize: "14px", fontWeight: 600, color: C.white, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Contact</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  <Mail size={16} /> {contactEmail}
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  <MapPin size={16} style={{ marginTop: "2px" }} /> 100 Corporate Blvd, Business District
                </li>
              </ul>
            </div>
          </div>
          
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>&copy; 2026 {businessName}. All rights reserved.</p>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px" }}>Privacy Policy</a>
              <a href="#" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
