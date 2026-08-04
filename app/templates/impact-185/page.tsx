"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scissors, Star, Phone, MapPin, Clock, ChevronRight, Shield, Calendar, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  clientCity,
  clientName,
  clientReviews,
  clientServices,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   GENTLEMAN'S CUT — Barbier premium (Bordeaux)
   Palette : noir encre #0a0908 / or vintage #c9a84c / ivoire #f5f0e8 / charcoal #1e1c1a
   Fonts : Playfair Display (titres) + DM Mono (labels)
   Style : éditorial masculin, premium, brasserie chic, contrasté
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Réservation", h: "#reservation" },
  { l: "À propos", h: "#a-propos" },
  { l: "Contact", h: "#contact" },
];

const TARIFS_DEMO = [
  { a: "Coupe homme", p: "29 €", n: "Shampooing, coupe aux ciseaux, coiffage. 40 minutes." },
  { a: "Coupe & barbe", p: "45 €", n: "Le classique de la maison. Serviette chaude, rasoir droit, baume." },
  { a: "Taille de barbe", p: "22 €", n: "Contours au rasoir, huile et baume. 25 minutes." },
  { a: "Rasage traditionnel", p: "35 €", n: "Deux passages, serviette chaude, pierre d'alun. 35 minutes." },
  { a: "Coupe enfant (-12 ans)", p: "20 €", n: "Sans rendez-vous le mercredi après-midi." },
  { a: "Forfait marié", p: "80 €", n: "Essai deux semaines avant, prestation complète le jour J." },
];
let TARIFS = TARIFS_DEMO;

const SERVICES_SOURCE = [
  { title: "Coupe classique", price: "28€", desc: "Coupe ciseau + tondeuse, finitions rasoir droite. Inclut consultation, shampoing, séchage et coiffage." },
  { title: "Rasage traditionnel", price: "35€", desc: "Rasoir droit à l'ancienne. Serviette chaude, mousse artisanale, baume après-rasage maison. 45 minutes de pure détente." },
  { title: "Combo barbe + coupe", price: "55€", desc: "La formule complète. Coupe sur mesure + taille et soin de barbe. Le must pour repartir à 100%." },
  { title: "Taille de barbe", price: "22€", desc: "Mise en forme, taille précise, soin hydratant. Contours nets au rasoir. Résultat impeccable garanti." },
  { title: "Color & gris", price: "45€", desc: "Coloration naturelle ou couvrance des cheveux blancs. Teinte personnalisée, respect de la matière." },
  { title: "Soin cuir chevelu", price: "30€", desc: "Gommage + masque nourrissant. Idéal cuirs chevelu secs, desquamation ou chute de cheveux. En add-on ou seul." },
]
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_DEMO;

const TIME_SLOTS = ["9h00", "10h00", "11h00", "14h00", "15h00", "16h00", "17h00", "18h00"]

function BookingModal({
  open,
  onClose,
  services,
  initialService,
}: {
  open: boolean
  onClose: () => void
  services: { title: string; price: string }[]
  initialService: string | null
}) {
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setService(initialService ?? "")
      setDate(""); setTime(""); setName(""); setEmail(""); setPhone("")
      setLoading(false); setSent(false)
    }
  }, [open, initialService])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!service || !date || !time || !name || !phone) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1400)
  }

  const inputCls = "w-full bg-[#1e1c1a] border border-[var(--brand,#c9a84c)]/15 px-4 py-3 text-sm text-[#f5f0e8] outline-none focus:border-[var(--brand,#c9a84c)] focus:ring-2 focus:ring-[var(--brand,#c9a84c)]/25 transition-colors"
  const labelCls = "block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#c9a84c)]/60 mb-2"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10,9,8,0.82)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0f0e0c] border border-[var(--brand,#c9a84c)]/15 max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-[#f5f0e8]/50 hover:text-[var(--brand,#c9a84c)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full border border-[var(--brand,#c9a84c)] flex items-center justify-center mx-auto mb-6 text-[var(--brand,#c9a84c)] text-xl">✓</div>
                  <h3 className="text-2xl font-bold text-[#f5f0e8] mb-3">Rendez-vous demandé</h3>
                  <p className="text-sm text-[#f5f0e8]/40 leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Merci {name}. {service} confirmé le {date} à {time}. Un SMS de confirmation va suivre.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/60 mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Réservation</div>
                  <h3 className="text-2xl font-bold text-[#f5f0e8] mb-6">Prendre rendez-vous</h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="bk-service" className={labelCls}>Prestation *</label>
                      <select id="bk-service" required value={service} onChange={(e) => setService(e.target.value)} className={inputCls + " cursor-pointer"}>
                        <option value="">Choisir une prestation</option>
                        {services.map((s) => (
                          <option key={s.title} value={s.title}>{s.title} — {s.price}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bk-date" className={labelCls}>Date *</label>
                        <input id="bk-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="bk-time" className={labelCls}>Heure *</label>
                        <select id="bk-time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputCls + " cursor-pointer"}>
                          <option value="">—</option>
                          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bk-name" className={labelCls}>Nom *</label>
                      <input id="bk-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Julien Fabre" />
                    </div>
                    <div>
                      <label htmlFor="bk-phone" className={labelCls}>Téléphone *</label>
                      <input id="bk-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="06 XX XX XX XX" />
                    </div>
                    <div>
                      <label htmlFor="bk-email" className={labelCls}>Email</label>
                      <input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="julien@email.fr" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 min-h-[44px] px-8 py-3.5 bg-[var(--brand,#c9a84c)] text-[#0a0908] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#b8973d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="w-3.5 h-3.5 border border-[#0a0908]/40 border-t-[#0a0908] rounded-full inline-block"
                          />
                          Envoi en cours…
                        </>
                      ) : "Confirmer le rendez-vous"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TEMOIGNAGES_LIVE() {
  return [
  { q: "Meilleur barbier de " + (clientCity({ formData: fd }) ?? "Bordeaux") + ", sans discussion. Rasage au rasoir droit parfait, ambiance vintage au top, et le gars sait vraiment écouter ce qu'on veut.", n: "Julien F.", l: (clientCity({ formData: fd }) ?? "Bordeaux") + " Centre" },
  { q: "Je viens depuis 3 ans. On parle de moi d'un coup de ciseau à l'autre, et chaque fois c'est nickel. La fidélité se mérite — ici elle est bien méritée.", n: "Pierre-Louis B.", l: "Mérignac" },
  { q: "Barbier de confiance, propre, précis, discret. Le genre d'endroit où on revient pas pour l'ambiance (bien qu'elle soit top) mais pour le résultat.", n: "Karim T.", l: "Pessac" },
];
}
let TEMOIGNAGES = TEMOIGNAGES_LIVE();


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function GentlemansCutPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  TEMOIGNAGES = TEMOIGNAGES_LIVE();

  SERVICES_DEMO = resolveList(clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], title: s.title , ...(s.price ? { price: s.price } : {})})), SERVICES_SOURCE);
  TARIFS = resolveList(
    clientServices(session)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  SERVICES = resolveList(
    clientServices(session)?.map((s, i) => ({ ...SERVICES_DEMO[i % SERVICES_DEMO.length], title: s.title })),
    SERVICES_DEMO,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | null>(null)
  const openBooking = useCallback((service: string | null) => {
    setBookingService(service)
    setBookingOpen(true)
  }, [])

  // Dynamic Services & Testimonials Mutation for Session Data
  return (
    <div className="bg-[#0a0908] text-[#f5f0e8] overflow-x-hidden" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0908]/97 backdrop-blur-xl py-3 border-b border-[var(--brand,#c9a84c)]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Scissors className="w-4 h-4 text-[var(--brand,#c9a84c)]" />
                <span className="font-bold text-[#f5f0e8] tracking-wide text-sm">{/* NOM_LOGO */ clientName({ formData: fd }) ?? (<>Gentleman's <span className="text-[var(--brand,#c9a84c)]">Cut</span></>)}</span>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5f0e8]/25" style={{ fontFamily: "'DM Mono', monospace" }}>
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#c9a84c)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0556789012"}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#c9a84c)] font-bold text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Phone className="w-4 h-4" /> {fd?.phone ?? "05 56 78 90 12"}
            </a>
            <button onClick={() => openBooking(null)} className="hidden md:block min-h-[44px] px-5 py-2.5 border border-[var(--brand,#c9a84c)] text-[var(--brand,#c9a84c)] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[var(--brand,#c9a84c)] hover:text-[#0a0908] transition-all cursor-pointer" style={{ fontFamily: "'DM Mono', monospace" }}>
              Réserver
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#f5f0e8]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0f0e0c] border-[var(--brand,#c9a84c)]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#f5f0e8] hover:text-[var(--brand,#c9a84c)] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0556789012"}`} className="flex items-center gap-3 text-[var(--brand,#c9a84c)] font-bold text-lg mt-4"><Phone className="w-5 h-5" /> {fd?.phone ?? "05 56 78 90 12"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <style>{`
        /* items-end overflows upward when the stack is taller than the hero,
           sliding the eyebrow under the fixed navbar. */
        @media (max-width: 640px) {
          .imx185-hero { align-items: flex-start !important; padding-top: 104px !important; padding-bottom: 32px !important; }
        }
      `}</style>
      <section id="hero" ref={heroRef} className="imx185-hero relative h-[100dvh] min-h-[640px] flex [align-items:safe_flex-end] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=88&w=2400")} alt="Barbier rasage traditionnel" fill className="object-cover object-top" priority style={{ filter: "brightness(0.35) contrast(1.05)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/70 via-[#0a0908]/20 to-transparent" />
        </motion.div>

        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--brand,#c9a84c)]/20 to-transparent z-10" />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-[1px] bg-[var(--brand,#c9a84c)]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.55em] text-[var(--brand,#c9a84c)]/70" style={{ fontFamily: "'DM Mono', monospace" }}>Barbier Traditionnel · {clientCity({ formData: fd }) ?? "Bordeaux"}</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[96px] font-bold leading-[0.85] tracking-tight mb-3 text-[#f5f0e8]">{c?.heroHeadline ?? <>
            The Art
          </>}</motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[96px] font-bold italic leading-[0.85] tracking-tight mb-10 text-[var(--brand,#c9a84c)]">
            of Grooming.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-sm text-sm text-[#f5f0e8]/30 leading-relaxed mb-12" style={{ fontFamily: "'DM Mono', monospace", fontStyle: "normal" }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Coupe au ciseau, rasage droit, taille de barbe. Techniques ancestrales, produits artisanaux, précision chirurgicale.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button onClick={() => openBooking(null)} className="min-h-[44px] px-9 py-4 bg-[var(--brand,#c9a84c)] text-[#0a0908] font-bold text-[10px] uppercase tracking-[0.3em]  hover:bg-[#b8973d] transition-colors cursor-pointer" style={{ fontFamily: "'DM Mono', monospace" }}>{c?.ctaText ?? <>
              Prendre rendez-vous
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0556789012"}`} className="flex items-center gap-3 px-9 py-4 border border-[#f5f0e8]/12 text-[#f5f0e8]/50 font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#c9a84c)]/40 hover:text-[var(--brand,#c9a84c)] transition-all" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Phone className="w-4 h-4" /> {fd?.phone ?? "05 56 78 90 12"}
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.6 }} className="w-[1px] h-12 bg-gradient-to-b from-[var(--brand,#c9a84c)]/40 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <div className="py-12 border-y border-[var(--brand,#c9a84c)]/12 bg-[#0f0e0c]">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl text-[#f5f0e8]/25 italic leading-relaxed">
            "Un homme bien coiffé n'a pas besoin de se justifier."
          </p>
          <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c9a84c)]/40" style={{ fontFamily: "'DM Mono', monospace" }}>— L'esprit Gentleman's Cut</div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#0a0908]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/60 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— Nos prestations</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0e8]">Chaque service,<br /><span className="text-[var(--brand,#c9a84c)] italic">à la perfection.</span></h2>
            </div>
          </Reveal>
          <div className="divide-y divide-[var(--brand,#c9a84c)]/8">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openBooking(s.title)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(s.title) } }}
                  className="group py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-12 hover:bg-[#1e1c1a]/30 -mx-4 px-4 transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-[var(--brand,#c9a84c)]/30 w-8 shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#f5f0e8] group-hover:text-[var(--brand,#c9a84c)] transition-colors">{s.title}</h3>
                      <div className="text-xl font-bold text-[var(--brand,#c9a84c)]">{s.price}</div>
                    </div>
                    <p className="text-sm text-[#f5f0e8]/25 leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--brand,#c9a84c)]/20 group-hover:text-[var(--brand,#c9a84c)]/60 group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-28 bg-[#0f0e0c]">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/50 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— Tarifs</div>
            <h2 className="text-4xl font-bold text-[#f5f0e8]">Affichés, <span className="italic text-[var(--brand,#c9a84c)]">jamais négociés.</span></h2>
          </div></Reveal>
          <div className="border border-[var(--brand,#c9a84c)]/12">
            {TARIFS.map((t, i) => (
              <Reveal key={t.a} delay={i * 0.05}>
                <div className={`flex flex-wrap items-baseline justify-between gap-3 px-7 py-5 ${i ? "border-t border-[var(--brand,#c9a84c)]/12" : ""}`}>
                  <div className="min-w-0">
                    <div className="font-bold text-[#f5f0e8] text-sm">{t.a}</div>
                    <div className="text-xs text-[#f5f0e8]/30 mt-0.5">{t.n}</div>
                  </div>
                  <div className="font-bold text-[var(--brand,#c9a84c)] text-sm shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-xs text-[#f5f0e8]/25 mt-6 leading-relaxed max-w-[70ch]">
              Espèces et carte acceptées, pas de supplément. Un retard de plus de quinze minutes libère
              le créneau : on vous replace au premier trou de la journée, sans rancune.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="a-propos" className="py-28 bg-[#0a0908]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/50 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— La maison</div>
            <h2 className="text-4xl font-bold text-[#f5f0e8]">Ouvert en 2009, <span className="italic text-[var(--brand,#c9a84c)]">jamais déménagé.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal>
              <div className="space-y-5 text-sm text-[#f5f0e8]/45 leading-relaxed">
                <p>
                  Trois fauteuils Belmont d'époque, un plancher qui grince et un miroir qu'on n'a jamais
                  remplacé parce qu'il fait bien son travail. La boutique tient dans quarante mètres carrés
                  rue Saint-Rémi, et c'est très bien ainsi.
                </p>
                <p>
                  On coupe aux ciseaux, on rase au coupe-chou, on prend le temps. Une coupe dure quarante
                  minutes parce qu'une coupe dure quarante minutes — pas parce qu'on facture le temps.
                </p>
                <p>
                  Aucun produit n'est vendu à la caisse par obligation. Si vos cheveux n'ont besoin de rien,
                  on vous le dira.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border border-[var(--brand,#c9a84c)]/12 p-8 space-y-5">
                {[
                  ["2009", "Ouverture rue Saint-Rémi, un seul fauteuil."],
                  ["2014", "Second fauteuil, arrivée de Malik au rasage."],
                  ["2019", "Formation coupe-chou certifiée, agrément apprentissage."],
                  ["2024", "Troisième fauteuil et ouverture le lundi."],
                ].map(([y, t]) => (
                  <div key={y} className="flex gap-6">
                    <div className="text-[var(--brand,#c9a84c)] font-bold text-sm shrink-0 w-12" style={{ fontFamily: "'DM Mono', monospace" }}>{y}</div>
                    <div className="text-sm text-[#f5f0e8]/45 leading-relaxed">{t}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── RÉSERVATION RAPIDE ── */}
      <section id="reservation" className="py-24 bg-[#1e1c1a]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/50 mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>Réservation</div>
                <h2 className="text-4xl font-bold text-[#f5f0e8] mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>Votre prochain<br /><span className="text-[var(--brand,#c9a84c)] italic">rendez-vous.</span></>}</h2>
                <p className="text-sm text-[#f5f0e8]/25 leading-relaxed mb-8" style={{ fontFamily: "'DM Mono', monospace" }}>{c?.aboutText ?? <>
                  Réservez en ligne en moins de 2 minutes. Confirmation SMS immédiate. Annulation gratuite jusqu'à 2h avant.
                </>}</p>
                <div className="space-y-4">
                  {[
                    { icon: Clock, t: "Mar-Sam · 9h–19h" },
                    { icon: MapPin, t: `12 rue du Pas Saint-Georges, 33000 ${clientCity({ formData: fd }) ?? "Bordeaux"}` },
                    { icon: Calendar, t: "Résa en ligne ou " + (fd?.phone ?? "05 56 78 90 12") },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <item.icon className="w-4 h-4 text-[var(--brand,#c9a84c)]" />
                      <span className="text-sm text-[#f5f0e8]/40" style={{ fontFamily: "'DM Mono', monospace" }}>{item.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={photo(1, "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=85&w=900")} alt="Intérieur barbier vintage" fill className="object-cover" style={{ filter: "brightness(0.6) sepia(0.15)" }} />
                <div className="absolute inset-0 border border-[var(--brand,#c9a84c)]/15" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-28 bg-[#0a0908]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#c9a84c)]/50 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>— Ce qu'ils disent</div>
            <h2 className="text-4xl font-bold text-[#f5f0e8]">La parole <span className="italic text-[var(--brand,#c9a84c)]">des clients.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--brand,#c9a84c)]/8">
            {TEMOIGNAGES.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0a0908] p-10 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[var(--brand,#c9a84c)] text-[var(--brand,#c9a84c)]" />)}
                  </div>
                  <p className="text-sm text-[#f5f0e8]/30 leading-relaxed italic flex-1" style={{ fontFamily: "'DM Mono', monospace" }}>{`"${t.q}"`}</p>
                  <div className="mt-8 pt-6 border-t border-[var(--brand,#c9a84c)]/8">
                    <div className="font-bold text-[#f5f0e8] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[var(--brand,#c9a84c)]/50 mt-1 flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace" }}><MapPin className="w-2.5 h-2.5" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-28 border-t border-[var(--brand,#c9a84c)]/12 bg-[#0f0e0c]">
        <Reveal>
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-16 bg-[var(--brand,#c9a84c)]/30" />
              <Scissors className="w-5 h-5 text-[var(--brand,#c9a84c)]/40" />
              <div className="h-[1px] w-16 bg-[var(--brand,#c9a84c)]/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0e8] mb-5">
              Prêt pour une<br /><span className="italic text-[var(--brand,#c9a84c)]">coupe parfaite ?</span>
            </h2>
            <p className="text-[#f5f0e8]/25 mb-10 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              Disponible du mardi au samedi · {clientCity({ formData: fd }) ?? "Bordeaux"} Centre · Sur rendez-vous
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => openBooking(null)} className="min-h-[44px] px-10 py-4 bg-[var(--brand,#c9a84c)] text-[#0a0908] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#b8973d] transition-colors cursor-pointer" style={{ fontFamily: "'DM Mono', monospace" }}>
                Réserver maintenant
              </button>
              <a href={`tel:${fd?.phone ?? "0556789012"}`} className="min-h-[44px] flex items-center gap-3 px-10 py-4 border border-[#f5f0e8]/10 text-[#f5f0e8]/35 font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#c9a84c)]/40 hover:text-[var(--brand,#c9a84c)] transition-all cursor-pointer" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Phone className="w-4 h-4" /> Appeler
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} services={SERVICES} initialService={bookingService} />

      {/* ── FOOTER ── */}
      <footer className="bg-[#050403] pt-16 pb-8 px-6 border-t border-[var(--brand,#c9a84c)]/8">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Scissors className="w-4 h-4 text-[var(--brand,#c9a84c)]" /><span className="font-bold text-[#f5f0e8] text-sm">Gentleman's Cut</span></div>
            <p className="text-[#f5f0e8]/15 text-sm leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>Barbier traditionnel à {clientCity({ formData: fd }) ?? "Bordeaux"}. Coupe, rasage, barbe. Depuis 2011.</p>
          </div>
          {[
            { t: "Services", ls: ["Coupe classique", "Rasage traditionnel", "Combo barbe + coupe", "Taille de barbe", "Coloration & gris"] },
            { t: "Infos", ls: ["Notre histoire", "L'équipe", "FAQ", "Avis clients", "Politique hygiène"] },
            { t: "Adresse", ls: ["12 rue du Pas Saint-Georges", "33000 " + (clientCity({ formData: fd }) ?? "Bordeaux"), "Mar-Sam 9h–19h", (fd?.phone ?? "05 56 78 90 12"), (fd?.email ?? "contact@gentlemanscut.fr")] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#c9a84c)]/50 mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f5f0e8]/15 text-sm hover:text-[#f5f0e8]/50 transition-colors" style={{ fontFamily: "'DM Mono', monospace" }}>{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[var(--brand,#c9a84c)]/6 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-[#f5f0e8]/8" style={{ fontFamily: "'DM Mono', monospace" }}>
          <span>© 2026 Gentleman's Cut · SIRET 890 123 456 00078 · {clientCity({ formData: fd }) ?? "Bordeaux"}{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
          <span className="text-[var(--brand,#c9a84c)]/20">The Art of Grooming</span>
        </div>
      </footer>
    </div>
  )
}
