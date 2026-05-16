"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Droplets, Wind, Leaf, Star, ChevronDown, ArrowRight, Clock, MapPin, Phone, CheckCircle, Heart, Sunrise, Moon, Sparkles, Users } from "lucide-react"

const C = {
  bg: "#f5f3ee",
  surface: "#ede9e0",
  card: "#faf8f3",
  dark: "#2d4a3e",
  darkMid: "#3d5a4e",
  gold: "#a8935a",
  goldLight: "#c8b070",
  sage: "#8aab8a",
  text: "#1a2a22",
  muted: "#5a7060",
  subtle: "#8a9e90",
  border: "#d4c8b0",
}

const TREATMENTS = [
  { icon: Droplets, name: "Hammam Ritual", duration: "90 min", price: "€140", desc: "Ancient steam purification with black soap, kessa glove exfoliation, and ghassoul clay mask.", tag: "Bestseller" },
  { icon: Wind, name: "Signature Massage", duration: "60 min", price: "€95", desc: "Swedish and deep tissue fusion tailored to your needs with warm essential oils.", tag: null },
  { icon: Leaf, name: "Forest Bathing", duration: "120 min", price: "€185", desc: "Immersive botanical treatment with forest-harvested extracts and mindful breathwork.", tag: "Premium" },
  { icon: Sparkles, name: "Gold Radiance Facial", duration: "75 min", price: "€165", desc: "24-karat gold leaf infusion with hyaluronic serum for luminous, lifted skin.", tag: "Luxury" },
  { icon: Moon, name: "Evening Ceremony", duration: "180 min", price: "€240", desc: "Full moon ritual: thermal circuit, hot stone massage, and night-blooming jasmine wrap.", tag: "Signature" },
  { icon: Sunrise, name: "Dawn Awakening", duration: "60 min", price: "€110", desc: "Sunrise meditation, invigorating cold plunge, and energizing citrus body polish.", tag: null },
]

const CIRCUIT_STEPS = [
  { name: "Hammam", temp: "50°C", desc: "Open your pores in our traditional steam room" },
  { name: "Thermal Pool", temp: "34°C", desc: "Drift in mineral-rich thermal waters" },
  { name: "Cold Plunge", temp: "10°C", desc: "Invigorate circulation and close pores" },
  { name: "Infrared Sauna", temp: "60°C", desc: "Deep tissue warmth and toxin release" },
  { name: "Ice Fountain", temp: "5°C", desc: "Refresh and energise for the next phase" },
  { name: "Rest Lounge", temp: "22°C", desc: "Restore in our aromatic relaxation room" },
]

const PACKAGES = [
  { name: "Day Retreat", price: "€95", includes: ["Full thermal circuit (3h)", "Light lunch or tea", "Access to changing rooms", "Complimentary robe & slippers"], highlight: false },
  { name: "Weekend Escape", price: "€285", includes: ["2-night accommodation", "Full thermal circuit daily", "1 signature treatment", "Breakfast included", "Evening apéritif"], highlight: true },
  { name: "Week Renewal", price: "€990", includes: ["6-night accommodation", "Unlimited thermal access", "3 premium treatments", "Half-board dining", "Wellness consultation", "Yoga & meditation classes"], highlight: false },
]

const TESTIMONIALS = [
  { name: "Isabelle Morel", location: "Paris", quote: "The most transformative 48 hours of my year. The Hammam Ritual alone was worth the journey.", rating: 5 },
  { name: "David & Cécile R.", location: "Lyon", quote: "We come every anniversary. Serene Retreat is our sanctuary — the staff remembers our names and preferences.", rating: 5 },
  { name: "Thomas Vernet", location: "Bordeaux", quote: "The thermal circuit followed by the Forest Bathing treatment left me feeling rebuilt from the inside out.", rating: 5 },
]

const FAQS = [
  { q: "What should I bring?", a: "Just yourself. Robes, slippers, towels, and all toiletries are provided. We recommend arriving 30 minutes before your first treatment." },
  { q: "Can I book treatments without a stay?", a: "Absolutely. Our Day Retreat pass gives full access to the thermal circuit plus dining. Single treatments can be booked from €95." },
  { q: "Are there minimum age requirements?", a: "The spa is exclusively for adults aged 16+. The thermal pools and treatments are recommended for 18+ guests." },
  { q: "What is the cancellation policy?", a: "Free cancellation up to 48 hours before arrival. Within 48 hours, a 50% fee applies. Same-day cancellations are non-refundable." },
  { q: "Do you offer gift vouchers?", a: "Yes — our beautifully packaged gift vouchers are available for any treatment, package, or monetary value. Order online or at reception." },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function RippleCircle() {
  return (
    <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i}
          style={{ position: "absolute", border: `1px solid ${C.sage}`, borderRadius: "50%", width: 280 - i * 50, height: 280 - i * 50 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div style={{ width: 80, height: 80, background: C.dark, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Droplets size={36} color={C.goldLight} />
      </div>
    </div>
  )
}

export default function SereneRetreatPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Raleway', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Raleway:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? `${C.card}f0` : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: scrolled ? C.dark : C.card, letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.4s" }}>Serene Retreat</div>
        </Link>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Spa", "Treatments", "Packages", "Contact"].map(l => (
            <Link key={l} href="#" style={{ color: scrolled ? C.muted : `${C.card}cc`, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? C.dark : C.card)}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? C.muted : `${C.card}cc`)}>{l}</Link>
          ))}
          <Link href="#" style={{ padding: "10px 24px", background: C.gold, color: "#fff", borderRadius: 4, textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Book Now</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: C.dark }}>
        <motion.div style={{ y: heroY, scale: heroScale, position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 50%, ${C.dark} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238aab8a22' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E\")", opacity: 0.3 }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
          <RippleCircle />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: C.goldLight, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20 }}>Luxury Wellness & Spa</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px, 8vw, 88px)", fontWeight: 300, color: C.card, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
              Where stillness<br /><em>becomes strength</em>
            </h1>
            <p style={{ fontSize: 17, color: `${C.card}99`, maxWidth: 480, lineHeight: 1.7, marginBottom: 40, margin: "0 auto 40px" }}>An immersive sanctuary of thermal waters, ancient rituals, and bespoke wellness — designed to restore body and mind.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <Link href="#" style={{ padding: "14px 36px", background: C.gold, color: "#fff", borderRadius: 4, textDecoration: "none", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                Reserve your escape <ArrowRight size={16} />
              </Link>
              <Link href="#" style={{ padding: "14px 36px", border: `1px solid ${C.card}44`, color: `${C.card}cc`, borderRadius: 4, textDecoration: "none", fontSize: 14, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                View treatments
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 24px", background: C.dark }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, textAlign: "center" }}>
          {[["1,800 m²", "Thermal space"], ["18", "Treatment rooms"], ["4.9 / 5", "Guest rating"], ["Since 2008", "Trusted sanctuary"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: C.goldLight, marginBottom: 8 }}>{num}</div>
              <div style={{ fontSize: 12, color: C.sage, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TREATMENTS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Our Rituals</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, color: C.dark, marginBottom: 16 }}>Curated treatments</h2>
              <p style={{ fontSize: 16, color: C.muted, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>Each ritual is designed by our expert therapists and rooted in centuries-old healing traditions.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {TREATMENTS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div style={{ padding: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 2, position: "relative", transition: "box-shadow 0.3s, transform 0.3s", cursor: "default" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${C.dark}18`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}>
                  {t.tag && <div style={{ position: "absolute", top: 16, right: 16, padding: "3px 10px", background: C.gold, color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}>{t.tag}</div>}
                  <div style={{ width: 48, height: 48, background: C.surface, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <t.icon size={22} color={C.gold} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: C.dark, marginBottom: 8 }}>{t.name}</h3>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted, marginBottom: 16, letterSpacing: "0.05em" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{t.duration}</span>
                    <span style={{ color: C.gold, fontWeight: 600, fontSize: 15 }}>{t.price}</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THERMAL CIRCUIT */}
      <section style={{ padding: "100px 24px", background: C.dark }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 11, color: C.goldLight, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>The Journey</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: C.card }}>The thermal circuit</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
            {CIRCUIT_STEPS.map((step, i) => (
              <Reveal key={step.name} delay={i * 0.1}>
                <div style={{ padding: "32px 28px", background: `${C.darkMid}`, borderLeft: `3px solid ${i % 2 === 0 ? C.gold : C.sage}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: i % 2 === 0 ? C.goldLight : C.sage, marginBottom: 8 }}>{step.temp}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: C.card, marginBottom: 8, letterSpacing: "0.05em" }}>{step.name}</h3>
                  <p style={{ fontSize: 13, color: C.sage, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, textAlign: "center", marginBottom: 64, color: C.dark }}>Guest experiences</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div style={{ padding: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 2 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} color={C.gold} fill={C.gold} />)}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: C.dark, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.quote}"</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, background: C.surface, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Heart size={16} color={C.gold} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.subtle }}><MapPin size={10} style={{ display: "inline", marginRight: 4 }} />{t.location}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section style={{ padding: "100px 24px", background: C.surface }}>
        <div style={{ maxWidth: 1050, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Retreats</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: C.dark }}>Escape packages</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 0.1}>
                <div style={{ padding: 40, background: pkg.highlight ? C.dark : C.card, border: `1px solid ${pkg.highlight ? C.gold : C.border}`, borderRadius: 2 }}>
                  {pkg.highlight && <div style={{ fontSize: 10, color: C.goldLight, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Most requested</div>}
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: pkg.highlight ? C.card : C.dark, marginBottom: 8 }}>{pkg.name}</h3>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: pkg.highlight ? C.goldLight : C.gold, marginBottom: 28 }}>{pkg.price}</div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                    {pkg.includes.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: pkg.highlight ? C.sage : C.muted, lineHeight: 1.5 }}>
                        <CheckCircle size={15} color={C.gold} style={{ marginTop: 1, flexShrink: 0 }} />{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="#" style={{ display: "block", textAlign: "center", padding: "14px", background: pkg.highlight ? C.gold : C.dark, color: "#fff", borderRadius: 2, textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Reserve</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400, textAlign: "center", marginBottom: 64, color: C.dark }}>Questions & answers</h2></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "24px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 16, fontWeight: 500, color: C.dark, textAlign: "left", fontFamily: "'Raleway', sans-serif" }}>
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} color={C.muted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ paddingBottom: 24, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: "72px 24px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: C.card, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Serene Retreat</div>
              <p style={{ fontSize: 14, color: C.sage, lineHeight: 1.7, maxWidth: 240, marginBottom: 24 }}>A sanctuary for restoration, renewal, and quiet luxury in the heart of the French countryside.</p>
              <div style={{ display: "flex", gap: 8, fontSize: 13, color: C.sage, alignItems: "center" }}>
                <MapPin size={14} /><span>Route des Thermes, 63130 Royat, France</span>
              </div>
            </div>
            {[
              { title: "Spa", links: ["Treatments", "Thermal Circuit", "Packages", "Gift Vouchers"] },
              { title: "Stay", links: ["Rooms & Suites", "Dining", "Wellness Programs", "Events"] },
              { title: "Info", links: ["About", "Press", "FAQ", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: C.goldLight, marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map(l => <li key={l}><Link href="#" style={{ color: C.sage, textDecoration: "none", fontSize: 14 }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.card)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.sage)}>{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.darkMid}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 12, color: C.sage, letterSpacing: "0.05em" }}>© 2026 Serene Retreat. All rights reserved.</span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Legal"].map(l => <Link key={l} href="#" style={{ color: C.sage, textDecoration: "none", fontSize: 12 }}>{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
