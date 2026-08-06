"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scissors, Star, Phone, MapPin, Clock, Calendar, Sparkles, Heart, ArrowRight, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTeam,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   ATELIER LÉONIE — Salon de coiffure premium femmes ({clientCity(sessionData) ?? "Paris"})
   Palette : crème #faf6f1 / vieux rose #c97b7b / or rosé #d4a5a5 / encre #1a1218
   Fonts : Bodoni Moda (titres élégants) + Lato (corps épuré)
   Style : luxe accessible, féminin, chaud, boudoir élégant
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

// Explicit anchors: the generated slug turned "Équipe" into "#équipe" and the
// ids sat on the wrong blocks.
const NAV = [
  { l: "Prestations", h: "#prestations" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Équipe", h: "#equipe" },
  { l: "Galerie", h: "#galerie" },
  { l: "Contact", h: "#contact" },
];

const TARIFS = [
  { g: "Coupe", ls: [["Coupe & brushing", "58 €"], ["Coupe seule", "42 €"], ["Frange / retouche", "18 €"], ["Coupe enfant (-12 ans)", "29 €"]] },
  { g: "Couleur", ls: [["Racines", "62 €"], ["Couleur complète", "88 €"], ["Balayage", "à partir de 135 €"], ["Patine / gloss", "45 €"]] },
  { g: "Soin", ls: [["Rituel botanique", "38 €"], ["Kératine sans formol", "à partir de 180 €"], ["Diagnostic cuir chevelu", "offert"], ["Brushing seul", "34 €"]] },
];

const EQUIPE_DEMO = [
  { n: "Léonie Barbier", r: "Fondatrice · Coloriste", d: "Formée chez Christophe Robin. Balayage et corrections de couleur : c'est elle qu'on vient voir quand une couleur a mal tourné ailleurs." },
  { n: "Inès Marchetti", r: "Styliste senior", d: "Coupes courtes et carrés graphiques. Douze ans de plateau et de collections, aujourd'hui uniquement en salon." },
  { n: "Nour Benali", r: "Spécialiste cheveux texturés", d: "Boucles, frisés, crépus. Coupe à sec, méthode courbes, et un vrai diagnostic avant de toucher aux longueurs." },
  { n: "Théo Rives", r: "Styliste · Cérémonie", d: "Chignons et attachés. Essai systématique avant un mariage, déplacement possible le jour J." },
];
let EQUIPE = EQUIPE_DEMO;

const PRESTATIONS_SOURCE = [
  { title: "Coupe & brushing", price: "Dès 65€", desc: "Coupe sur mesure adaptée à votre morphologie, densité et mode de vie. Brushing professionnel ou coiffage naturel." },
  { title: "Couleur & balayage", price: "Dès 95€", desc: "Couleur pleine, balayage californien, mèches, ombré. Produits Kérastase & L'Oréal Professionnel. Bilan capillaire offert." },
  { title: "Traitement & soin", price: "Dès 45€", desc: "Soins Olaplex, masques kératine, lissage brésilien, soins anti-chute. Résultat visible dès la première séance." },
  { title: "Chignon & coiffure occasion", price: "Dès 85€", desc: "Chignon romantique, tresses, ondulations, coiffure de mariée. Essai inclus, disponible le dimanche sur RDV." },
  { title: "Extensions", price: "Dès 250€", desc: "Extensions kératine, bandes, clips. Volume, longueur, densité. Pose personnalisée, entretien et dépose assurés." },
  { title: "Consultation capillaire", price: "Offerte", desc: "Diagnostic état de la fibre, rythme colorimétrique, soins adaptés. En amont de chaque nouveau service, sur demande." },
]
let PRESTATIONS_DEMO = PRESTATIONS_SOURCE;
let PRESTATIONS = PRESTATIONS_DEMO;

function TESTIMONIALS_DEMO_LIVE() {
  return [
  { q: "Léonie a transformé mes cheveux abîmés en quelque chose de sublime. Le balayage est naturel, la couleur exactement ce que je voulais. Enfin une vraie experte.", n: "Sophie M.", l: (clientCity(sessionData) ?? "Paris") },
  { q: "Coiffure de mariée parfaite le jour J. L'essai en amont m'a permis d'ajuster chaque détail. On s'est senti chouchouté du début à la fin. Merci Atelier Léonie !", n: "Clémence R.", l: (clientCity(sessionData) ?? "Paris") + " 75" },
  { q: "Lissage brésilien impeccable. Résultat qui dure 4 mois, aucun problème aux repousses. Pour moi c'est devenu un rituel bi-annuel incontournable.", n: "Aïcha D.", l: "Neuilly-sur-Seine" },
];
}
let TESTIMONIALS_DEMO = TESTIMONIALS_DEMO_LIVE();


const SALON_TIME_SLOTS = ["9h00", "10h00", "11h00", "13h00", "14h00", "15h00", "16h00", "17h30"]

function BookingModal({
  open,
  onClose,
  services,
  initialService,
}: {
  open: boolean
  onClose: () => void
  services: { title?: string; name?: string }[]
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

  const inputCls = "w-full bg-white border border-[#f3ede6] px-4 py-3 text-sm text-[#1a1218] outline-none focus:border-[var(--brand,#c97b7b)] focus:ring-2 focus:ring-[var(--brand,#c97b7b)]/20 transition-colors"
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#1a1218]/40 mb-1.5"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(26,18,24,0.68)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#faf6f1] max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-[#1a1218]/40 hover:text-[var(--brand,#c97b7b)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-[var(--brand,#c97b7b)]/10 flex items-center justify-center mx-auto mb-6 text-[var(--brand,#c97b7b)] text-xl">✓</div>
                  <h3 className="text-2xl font-bold text-[#1a1218] mb-3" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>Rendez-vous demandé</h3>
                  <p className="text-sm text-[#1a1218]/45 leading-relaxed">
                    Merci {name}. « {service} » réservé le {date} à {time}. L'atelier vous confirmera par SMS.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-3">Réservation</div>
                  <h3 className="text-2xl font-bold text-[#1a1218] mb-6" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>Prendre rendez-vous</h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="sal-service" className={labelCls}>Prestation *</label>
                      <select id="sal-service" required value={service} onChange={(e) => setService(e.target.value)} className={inputCls + " cursor-pointer"}>
                        <option value="">Choisir une prestation</option>
                        {services.map((s, i) => (
                          <option key={i} value={s.title ?? s.name}>{s.title ?? s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="sal-date" className={labelCls}>Date *</label>
                        <input id="sal-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="sal-time" className={labelCls}>Heure *</label>
                        <select id="sal-time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputCls + " cursor-pointer"}>
                          <option value="">—</option>
                          {SALON_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="sal-name" className={labelCls}>Nom *</label>
                      <input id="sal-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Sophie Martin" />
                    </div>
                    <div>
                      <label htmlFor="sal-phone" className={labelCls}>Téléphone *</label>
                      <input id="sal-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="06 XX XX XX XX" />
                    </div>
                    <div>
                      <label htmlFor="sal-email" className={labelCls}>Email</label>
                      <input id="sal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="sophie@email.fr" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 min-h-[44px] px-8 py-3.5 bg-[var(--brand,#c97b7b)] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#b56868] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full inline-block"
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

// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function AtelierLeoniePage() {
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
    businessProfile?: any;
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
  bp = session?.businessProfile;
  sessionData = session;
  TESTIMONIALS_DEMO = TESTIMONIALS_DEMO_LIVE();

  PRESTATIONS_DEMO = resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ ...PRESTATIONS_SOURCE[i % PRESTATIONS_SOURCE.length], title: s.title , ...(s.price ? { price: s.price } : {})})), PRESTATIONS_SOURCE);
  PRESTATIONS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length], title: s.title })),
    PRESTATIONS_DEMO,
  );
  EQUIPE = resolveList(
    clientTeam(sessionData)?.map((m, i) => ({ ...EQUIPE_DEMO[i % EQUIPE_DEMO.length], n: m.name, r: m.role })),
    EQUIPE_DEMO,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const services = resolveList(clientServices(sessionData), PRESTATIONS);
  const testimonials = resolveList(clientReviews(sessionData)?.map((r: any) => ({ q: r.text, n: r.author, l: r.detail })), TESTIMONIALS_DEMO);

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

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

  return (
    <div className="bg-[#faf6f1] text-[#1a1218] overflow-x-hidden" style={{ fontFamily: "'Lato', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf6f1]/98 backdrop-blur-xl py-3 shadow-sm border-b border-[var(--brand,#c97b7b)]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="font-bold text-[#1a1218] tracking-widest text-sm" style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)",  fontFamily: "'Bodoni Moda', 'Georgia', serif" }}>{clientName(sessionData) ?? "ATELIER LÉONIE"}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)]/60">Salon de coiffure · {clientCity(sessionData) ?? "Paris"}</div>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1218]/30">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#c97b7b)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0145678901"}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#c97b7b)] font-bold text-sm">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "01 45 67 89 01"}
            </a>
            <button onClick={() => openBooking(null)} className="hidden md:block min-h-[44px] px-5 py-2.5 bg-[var(--brand,#c97b7b)] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#b56868] transition-colors cursor-pointer">
              Réserver
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf6f1] border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#1a1218] hover:text-[var(--brand,#c97b7b)] transition-colors" style={{ fontFamily: "'Bodoni Moda', serif" }}>{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0145678901"}`} className="flex items-center gap-3 text-[var(--brand,#c97b7b)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {fd?.phone ?? "01 45 67 89 01"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=88&w=2400"))} alt="Salon de coiffure élégant" fill className="object-cover object-center" priority style={{ filter: "brightness(0.4) saturate(0.9)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#110c10] via-[#110c10]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#110c10]/65 to-transparent" />
        </motion.div>

        {/* Decorative rose element */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 1.2 }}
          className="absolute top-32 right-8 md:right-20 z-10 w-20 h-20 rounded-full border border-[var(--brand,#c97b7b)]/20 flex items-center justify-center hidden lg:flex">
          <Scissors className="w-8 h-8 text-[var(--brand,#c97b7b)]/40" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[var(--brand,#c97b7b)]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#d4a5a5]">Salon de coiffure & atelier capillaire · {clientCity(sessionData) ?? "Paris"}</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-4 text-white" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>{<>{clientHeroLine(sessionData, 0, 1, 11) ?? "L'art de la"}</>}</motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold italic leading-[0.88] tracking-tight mb-10 text-[var(--brand,#c97b7b)]" style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}>
            coiffure.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.78 }}
            className="max-w-sm text-sm text-white/32 leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
            Salon de coiffure premium à {clientCity(sessionData) ?? "Paris"}. Coupe, couleur, soins, extensions, coiffure de mariée. Stylistes passionnées, produits haut de gamme, résultat sur mesure.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button onClick={() => openBooking(null)} className="min-h-[44px] px-9 py-4 bg-[var(--brand,#c97b7b)] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#b56868] transition-colors cursor-pointer">{c?.ctaText ?? <>
              Prendre rendez-vous
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0145678901"}`} className="flex items-center gap-3 px-9 py-4 border border-white/12 text-white/50 font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#c97b7b)]/40 hover:text-[#d4a5a5] transition-all">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "01 45 67 89 01"}
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#c97b7b)]/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-[#f3ede6]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "11 ans", l: "D'excellence capillaire" },
            { v: "2 800+", l: "Clientes fidèles" },
            { v: "4.9★", l: "Avis Google" },
            { v: "8", l: "Stylistes certifiées" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-5 bg-white shadow-sm">
                <div className="text-2xl font-bold text-[var(--brand,#c97b7b)] mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1218]/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section id="prestations" className="py-28 bg-[#faf6f1]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16 flex flex-col md:flex-row gap-8 justify-between items-end">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-4">Nos prestations</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>
                  Pour chaque<br /><span className="italic text-[var(--brand,#c97b7b)]">cheveu, un soin.</span>
                </>)}</h2>
              </div>
              <p className="max-w-xs text-sm text-[#1a1218]/35 leading-relaxed">Prestations personnalisées, bilan capillaire offert, produits Kérastase & Olaplex.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((p: any, i: number) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openBooking(p.title ?? p.name)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(p.title ?? p.name) } }}
                  className="group p-8 bg-white border border-[#f3ede6] hover:border-[var(--brand,#c97b7b)]/25 hover:shadow-lg hover:shadow-[var(--brand,#c97b7b)]/5 transition-all duration-500 h-full cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-[#1a1218] group-hover:text-[var(--brand,#c97b7b)] transition-colors" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.title ?? p.name}</h3>
                    {p.price && <div className="text-sm font-bold text-[var(--brand,#c97b7b)] whitespace-nowrap ml-4">{p.price}</div>}
                  </div>
                  <p className="text-sm text-[#1a1218]/38 leading-relaxed">{p.desc ?? p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-28 bg-[#f3ede6]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-4">Tarifs</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Rien qui ne soit <span className="italic text-[var(--brand,#c97b7b)]">annoncé.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TARIFS.map((g, i) => (
              <Reveal key={g.g} delay={i * 0.08}>
                <div className="bg-white p-8 h-full">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#c97b7b)] mb-6">{g.g}</div>
                  <ul className="space-y-3">
                    {g.ls.map(([a, p]) => (
                      <li key={a} className="flex justify-between gap-4 text-sm">
                        <span className="text-[#1a1218]/60">{a}</span>
                        <span className="text-[#1a1218] font-medium shrink-0">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-xs text-[#1a1218]/35 mt-6 leading-relaxed max-w-[70ch]">
              Le prix d'une couleur dépend de la longueur et de la quantité de produit : ce qui est annoncé ici
              couvre les cheveux jusqu'aux épaules. Au-delà, le supplément vous est donné avant de commencer, pas à la caisse.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ÉQUIPE ── */}
      <section id="equipe" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-4">L'équipe</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "equipe.titre") ?? (<>Huit paires de <span className="italic text-[var(--brand,#c97b7b)]">mains.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EQUIPE.map((m, i) => (
              <Reveal key={m.n} delay={i * 0.07}>
                <div className="bg-[#faf6f1] p-8 h-full">
                  <div className="text-xl font-bold text-[#1a1218] mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{m.n}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--brand,#c97b7b)] mb-4">{m.r}</div>
                  <p className="text-sm text-[#1a1218]/50 leading-relaxed">{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE RÉALISATIONS ── */}
      <section id="galerie" className="py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-4">Réalisations</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "galerie.titre") ?? (<>Le détail qui <span className="italic text-[var(--brand,#c97b7b)]">fait tout.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[60vh] min-h-[400px]">
            <div className="col-span-2 row-span-2 relative overflow-hidden"><ParallaxImg src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=85&w=800"))} alt="Coiffure femme" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src={photo(2, (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=85&w=600"))} alt="Couleur cheveux" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src={photo(3, (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=85&w=600"))} alt="Balayage" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src={photo(4, (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=85&w=600"))} alt="Maquillage brushing" /></div>
            <div className="relative overflow-hidden"><ParallaxImg src={photo(5, (clientPhotos(sessionData)[5] || "https://images.unsplash.com/photo-1554519515-242161756769?auto=format&fit=crop&q=85&w=600"))} alt="Coiffure updo" /></div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-28 bg-[#faf6f1]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#c97b7b)] mb-4">Avis clients</div>
            <h2 className="text-4xl font-bold text-[#1a1218]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Elles adorent <span className="italic text-[var(--brand,#c97b7b)]">le résultat.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border border-[#f3ede6] h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating ?? 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#c97b7b)] text-[var(--brand,#c97b7b)]" />)}
                  </div>
                  <p className="text-sm text-[#1a1218]/40 leading-relaxed italic flex-1">{`"${t.q ?? t.text}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f3ede6]">
                    <div className="font-bold text-[#1a1218] text-sm">{t.n ?? t.author}</div>
                    {(t.l ?? t.source) && <div className="text-[10px] text-[var(--brand,#c97b7b)] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l ?? t.source}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[#1a1218] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25 mb-6">Votre prochain rendez-vous</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Révélez la beauté<br /><span className="italic text-[var(--brand,#c97b7b)]">qui est en vous.</span>
            </>)}</h2>
            <p className="text-white/30 mb-10 text-sm">Réservation en ligne 24h/24 · {clientCity(sessionData) ?? "Paris"} · Consultation capillaire offerte</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => openBooking(null)} className="min-h-[44px] px-10 py-4 bg-[var(--brand,#c97b7b)] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#b56868] transition-colors cursor-pointer">
                Réserver maintenant
              </button>
              <a href={`tel:${fd?.phone ?? "0145678901"}`} className="min-h-[44px] flex items-center gap-3 px-10 py-4 border border-white/12 text-white/40 font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#c97b7b)]/40 hover:text-[#d4a5a5] transition-all cursor-pointer">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "01 45 67 89 01"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} services={services} initialService={bookingService} />

      {/* ── FOOTER ── */}
      <footer className="bg-[#110c10] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-white mb-1 text-sm" style={{ fontFamily: "'Bodoni Moda', serif" }}>Atelier Léonie</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--brand,#c97b7b)]/40 mb-5">Salon · {clientCity(sessionData) ?? "Paris"}</div>
            <p className="text-white/20 text-sm leading-relaxed">Salon de coiffure premium. Coupe, couleur, soins, extensions, coiffure de mariée. Produits Kérastase & Olaplex.</p>
          </div>
          {[
            { t: "Prestations", ls: ["Coupe & brushing", "Couleur & balayage", "Soins & traitements", "Extensions", "Coiffure mariée"] },
            { t: "Salon", ls: ["L'équipe", "Nos produits", "Tarifs", "Galerie", "FAQ"] },
            { t: "Nous trouver", ls: ["38 av. Victor Hugo", "75016 " + (clientCity(sessionData) ?? "Paris"), "Mar-Sam 9h-19h", (fd?.phone ?? "01 45 67 89 01"), (fd?.email ?? "contact@atelier-leonie.fr")] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#c97b7b)]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/20 text-sm hover:text-white/60 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-white/8">
          <span>© 2026 {clientName(sessionData) ?? "Atelier Léonie"} · SIRET 234 567 890 00011 · {clientCity(sessionData) ?? "Paris"} (75016){/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <span className="text-[var(--brand,#c97b7b)]/20">L'art de la coiffure</span>
        </div>
      </footer>
    </div>
  )
}
