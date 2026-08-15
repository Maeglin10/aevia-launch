"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, Star, MapPin, Clock, CheckCircle, Shield, Smile, Heart, Calendar, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientTrade,
  clientAddress,
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
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   DR. LÉA FONTAINE — Cabinet dentaire moderne ({clientCity(sessionData) ?? "Nantes"})
   Palette : blanc pur / bleu confiance #1d6fa4 / bleu clair #e8f4fd / anthracite #1a2332
   Fonts : Nunito (moderne, humain, arrondi) + Inter
   Style : médical moderne, rassurant, lumineux, accessible
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-55px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const NAV = [
  { l: "Soins", h: "#soins" },
  { l: "L'équipe", h: "#equipe" },
  { l: "Urgences", h: "#urgences" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const TARIFS_DEMO = [
  { a: "Consultation & bilan", p: "23 €", n: "Base Sécurité sociale, remboursée à 70 %." },
  { a: "Détartrage", p: "28,92 €", n: "Tarif conventionné, une à deux fois par an." },
  { a: "Carie (une face)", p: "26,97 €", n: "Composite teinte dent, sans amalgame." },
  { a: "Couronne céramo-métallique", p: "500 €", n: "Plafonnée par la réforme 100 % Santé. Reste à charge nul en panier 1." },
  { a: "Implant unitaire", p: "à partir de 1 100 €", n: "Hors couronne. Non remboursé par l'Assurance Maladie, devis obligatoire." },
  { a: "Blanchiment ambulatoire", p: "350 €", n: "Gouttières sur mesure, deux séances de contrôle incluses." },
];
let TARIFS = TARIFS_DEMO;

const SOINS_SOURCE = [
  { icon: Smile, title: "Soins conservateurs", desc: "Détartrage, traitement de caries, obturations composite teintées. Matériaux sans mercure, résultat esthétique invisible." },
  { icon: Heart, title: "Prothèses & couronnes", desc: "Couronnes céramique, bridges, prothèses amovibles. Fabrication sur mesure, teintes naturelles, ajustement précis." },
  { icon: Star, title: "Esthétique dentaire", desc: "Blanchiment LED, facettes porcelaine, correction sourire. Résultat naturel garanti. Simulateur sourire en consultation." },
  { icon: Shield, title: "Implantologie", desc: "Pose d'implants sous anesthésie locale. Suivi complet, implants titanium certifiés. Résultat définitif jusqu'à 25 ans." },
  { icon: CheckCircle, title: "Orthodontie adulte", desc: "Aligneurs transparents Invisalign® ou bagues céramiques. Traitement discret, résultat durable, consultation sans engagement." },
  { icon: Clock, title: "Urgences dentaires", desc: "Créneaux réservés urgences chaque matin dès 8h30. Douleur, fracture, dent cassée — on vous prend en charge le jour même." },
]
let SOINS_DEMO = SOINS_SOURCE;


const RDV_TIME_SLOTS = ["8h30", "9h30", "10h30", "11h30", "14h00", "15h00", "16h00", "17h30"]

function AppointmentModal({
  open,
  onClose,
  soins,
  initialSoin,
}: {
  open: boolean
  onClose: () => void
  soins: { title: string }[]
  initialSoin: string | null
}) {
  const [soin, setSoin] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setSoin(initialSoin ?? "")
      setDate(""); setTime(""); setName(""); setEmail(""); setPhone("")
      setLoading(false); setSent(false)
    }
  }, [open, initialSoin])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!soin || !date || !time || !name || !phone) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1400)
  }

  const inputCls = "w-full bg-white border border-[#e8f4fd] px-4 py-3 text-sm text-[#1a2332] rounded-xl outline-none focus:border-[var(--brand,#1d6fa4)] focus:ring-2 focus:ring-[var(--brand,#1d6fa4)]/20 transition-colors"
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#1a2332]/40 mb-1.5"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(26,35,50,0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-[#1a2332]/40 hover:text-[var(--brand,#1d6fa4)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-[var(--brand,#1d6fa4)]/10 flex items-center justify-center mx-auto mb-6 text-[var(--brand,#1d6fa4)] text-xl">✓</div>
                  <h3 className="text-2xl font-bold text-[#1a2332] mb-3">Rendez-vous demandé</h3>
                  <p className="text-sm text-[#1a2332]/45 leading-relaxed">
                    Merci {name}. Votre demande pour « {soin} » le {date} à {time} a bien été reçue. Le cabinet vous enverra une confirmation SMS.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1d6fa4)] mb-3">Prise de rendez-vous</div>
                  <h3 className="text-2xl font-bold text-[#1a2332] mb-6">Réserver un créneau</h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="rdv-soin" className={labelCls}>Motif de consultation *</label>
                      <select id="rdv-soin" required value={soin} onChange={(e) => setSoin(e.target.value)} className={inputCls + " cursor-pointer"}>
                        <option value="">Choisir un soin</option>
                        {soins.map((s) => (
                          <option key={s.title} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rdv-date" className={labelCls}>Date *</label>
                        <input id="rdv-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="rdv-time" className={labelCls}>Heure *</label>
                        <select id="rdv-time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputCls + " cursor-pointer"}>
                          <option value="">—</option>
                          {RDV_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="rdv-name" className={labelCls}>Nom complet *</label>
                      <input id="rdv-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Marie-Claire Hébert" />
                    </div>
                    <div>
                      <label htmlFor="rdv-phone" className={labelCls}>Téléphone *</label>
                      <input id="rdv-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="06 22 65 65 65" />
                    </div>
                    <div>
                      <label htmlFor="rdv-email" className={labelCls}>Email</label>
                      <input id="rdv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="marie@email.fr" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 min-h-[44px] px-8 py-3.5 bg-[var(--brand,#1d6fa4)] text-white font-bold text-[10px] uppercase tracking-[0.22em] rounded-xl hover:bg-[#155d8a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
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
export default function DrFontainePage() {
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
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
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
  SOINS_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SOINS_SOURCE[i % SOINS_SOURCE.length], title: s.title })),
    SOINS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const SOINS: any[] = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      icon: SOINS_DEMO[i % SOINS_DEMO.length].icon,
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    SOINS_DEMO
  );

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  const [rdvOpen, setRdvOpen] = useState(false)
  const [rdvSoin, setRdvSoin] = useState<string | null>(null)
  const openRdv = useCallback((soin: string | null) => {
    setRdvSoin(soin)
    setRdvOpen(true)
  }, [])

  return (
    <div className="bg-white text-[#1a2332] overflow-x-hidden" style={{ fontFamily: "'Nunito', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/98 backdrop-blur-xl py-3 shadow-sm border-b border-[var(--brand,#1d6fa4)]/10" : "bg-white/95 backdrop-blur-md py-5 border-b border-[var(--brand,#1d6fa4)]/5"}`}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="font-bold text-[#1a2332] text-sm leading-tight">{clientName(sessionData) ?? "Dr. Léa Fontaine"}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1d6fa4)]/60">{clientTrade(sessionData) ?? "Chirurgien-dentiste"} · {clientCity(sessionData) ?? "Nantes"}</div>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a2332]/30">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#1d6fa4)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0240567890"}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#1d6fa4)] font-bold text-sm">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "02 40 56 78 90"}
            </a>
            <button onClick={() => openRdv(null)} className="hidden md:block min-h-[44px] px-5 py-2.5 bg-[var(--brand,#1d6fa4)] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#155d8a] transition-colors rounded-xl cursor-pointer">
              Prendre RDV
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#1a2332] hover:text-[var(--brand,#1d6fa4)] transition-colors">{l}</Link>)}
                  <a href={`tel:${fd?.phone ?? "0240567890"}`} className="flex items-center gap-3 text-[var(--brand,#1d6fa4)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {fd?.phone ?? "02 40 56 78 90"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
            {/* Mobile menu placeholder */}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=85&w=2400"))} alt="Cabinet dentaire moderne lumineux" fill className="object-cover object-center" priority style={{ filter: "brightness(0.42)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-[#0e1620]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1620]/65 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1300px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[1px] bg-[var(--brand,#1d6fa4)]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#7bc3f5]">{clientTrade(sessionData) ?? "Chirurgien-dentiste"} · {clientCity(sessionData) ?? "Nantes"} Centre</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-7 text-white">{<>{clientHeroLine(sessionData, 0, 2, 15) ?? "Votre sourire,"}<br /><span className="text-[#7bc3f5]">{clientHeroLine(sessionData, 1, 2, 15) ?? "notre priorité."}</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-white/35 leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
            Cabinet dentaire moderne à {clientCity(sessionData) ?? "Nantes"}. Soins conservateurs, implants, esthétique et orthodontie. Équipement numérique dernière génération. Prise de RDV en ligne 24h/24.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-3">
            <button onClick={() => openRdv(null)} className="min-h-[44px] px-8 py-4 bg-[var(--brand,#1d6fa4)] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#155d8a] transition-colors rounded-xl cursor-pointer">{c?.ctaText ?? <>
              Prendre rendez-vous
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0240567890"}`} className="min-h-[44px] flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7bc3f5]/50 hover:text-[#7bc3f5] transition-all rounded-xl cursor-pointer">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "02 40 56 78 90"}
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#1d6fa4)]/60 to-transparent" />
        </div>
      </section>

      {/* ── CONFIANCE BAND ── */}
      <section className="py-10 bg-[#e8f4fd]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-6 md:gap-12 justify-center md:justify-between">
            {[
              { v: "18 ans", l: "D'expérience en implantologie" },
              { v: "3 800+", l: "Patients suivis" },
              { v: "4.9★", l: "Note Google (280 avis)" },
              { v: "CEIRD", l: "Formation continue certifiée" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand,#1d6fa4)]">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a2332]/40 mt-1">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOINS ── */}
      <section id="soins" className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1d6fa4)] mb-4">Nos soins</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a2332]">{/* TEXTE_SECTION */ clientText(sessionData, "soins.titre") ?? (<>Tous vos besoins<br /><span className="text-[var(--brand,#1d6fa4)]">en un seul cabinet.</span></>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOINS.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openRdv(s.title)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRdv(s.title) } }}
                  className="group p-8 rounded-2xl border border-[#e8f4fd] hover:border-[var(--brand,#1d6fa4)]/25 hover:shadow-lg hover:shadow-[var(--brand,#1d6fa4)]/5 bg-white transition-all duration-500 h-full cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[#e8f4fd] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[var(--brand,#1d6fa4)] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[var(--brand,#1d6fa4)] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a2332] mb-3">{s.title}</h3>
                  <p className="text-sm text-[#1a2332]/40 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCES ── */}
      <section id="urgences" className="py-16 bg-[var(--brand,#1d6fa4)]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-3">Urgences dentaires</div>
            <h2 className="text-2xl font-bold text-white">{/* TEXTE_SECTION */ clientText(sessionData, "urgences.titre") ?? (<>Douleur, fracture, chute de dent ?<br />Nous vous prenons en charge le jour même.</>)}</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={`tel:${fd?.phone ?? "0240567890"}`} className="flex items-center gap-3 px-7 py-4 bg-white text-[var(--brand,#1d6fa4)] font-bold text-sm rounded-xl hover:bg-[#e8f4fd] transition-colors whitespace-nowrap">
              <Phone className="w-4 h-4" /> {fd?.phone ?? "02 40 56 78 90"}
            </a>
            <div className="flex items-center gap-2 px-7 py-4 border border-white/20 text-white/60 text-sm rounded-xl whitespace-nowrap">
              <Clock className="w-4 h-4" /> Lun-Sam dès 8h30
            </div>
          </div>
        </div>
      </section>

      {/* ── L'ÉQUIPE ── */}
      <section id="equipe" className="py-28 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1d6fa4)] mb-4">L'équipe soignante</div>
            <h2 className="text-4xl font-bold text-[#1a2332]">{/* TEXTE_SECTION */ clientText(sessionData, "equipe.titre") ?? (<>Des praticiens <span className="text-[var(--brand,#1d6fa4)]">à votre écoute.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resolveList(clientTeam(sessionData)?.map((m: any) => ({
              nom: m.name,
              sp: m.role ?? m.specialty ?? "",
              f: m.bio ?? m.credentials ?? m.specialty ?? "",
            })), [
              { nom: `${clientName(sessionData) ?? "Dr. Léa Fontaine"}`, sp: "Omnipratique & Esthétique", f: "Diplômée Faculté de " + (clientCity(sessionData) ?? "Nantes") + " 2006, DU Implantologie Tours 2010" },
              { nom: "Dr. Antoine Merle", sp: "Orthodontie & Invisalign®", f: "Spécialiste orthodontie, formateur Invisalign® Provider certifié" },
              { nom: "Sophie C.", sp: "Assistante dentaire", f: "10 ans d'expérience, spécialisée chirurgie implantaire et accueil patient" },
            ] as any[]).map((p: any, i: number) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="p-7 rounded-2xl bg-[#f5faff] border border-[#e8f4fd]">
                  <div className="w-14 h-14 rounded-full bg-[var(--brand,#1d6fa4)]/10 flex items-center justify-center mb-5">
                    <span className="text-xl font-bold text-[var(--brand,#1d6fa4)]">{p.nom.charAt(0)}{p.nom.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div className="font-bold text-[#1a2332] mb-1">{p.nom}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#1d6fa4)] mb-3">{p.sp}</div>
                  <p className="text-sm text-[#1a2332]/40 leading-relaxed">{p.f}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-24 bg-[#f5faff]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1d6fa4)] mb-4">Avis patients</div>
            <h2 className="text-3xl font-bold text-[#1a2332]">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ils nous font <span className="text-[var(--brand,#1d6fa4)]">confiance.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resolveList(clientReviews(sessionData)?.map((r: any) => ({
              q: r.text ?? r.quote,
              n: r.name ?? r.author,
              l: r.location ?? r.context ?? "",
            })), [
              { q: "Enfin un cabinet où on se sent à l'aise ! Le Dr. Fontaine prend le temps d'expliquer chaque soin. Pas de douleur, gestes précis, suivi parfait.", n: "Marie-Claire H.", l: (clientCity(sessionData) ?? "Nantes") },
              { q: "Implant posé sans douleur ni anxiété grâce à l'équipe super rassurante. Résultat bluffant — on ne voit plus la différence avec la vraie dent.", n: "Philippe T.", l: "Saint-Nazaire" },
              { q: "Aligneurs transparents pour ma fille de 16 ans. En 14 mois, résultat parfait. Suivi régulier, app de suivi, équipe disponible. Très satisfaits.", n: "Nathalie & Lucas B.", l: "Rezé (44)" },
            ] as any[]).map((t: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white rounded-2xl border border-[#e8f4fd] shadow-sm h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#1d6fa4)] text-[var(--brand,#1d6fa4)]" />)}
                  </div>
                  <p className="text-sm text-[#1a2332]/45 leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#e8f4fd]">
                    <div className="font-bold text-[#1a2332] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[var(--brand,#1d6fa4)] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-28 bg-[#f2f7fb]">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1d6fa4)] mb-4">Tarifs</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a2332]">{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Ce que ça <span className="text-[var(--brand,#1d6fa4)]">coûte vraiment.</span></>)}</h2>
          </div></Reveal>
          <div className="bg-white">
            {TARIFS.map((t, i) => (
              <Reveal key={t.a} delay={i * 0.05}>
                <div className={`flex flex-wrap items-baseline justify-between gap-3 px-7 py-5 ${i ? "border-t border-[#f2f7fb]" : ""}`}>
                  <div className="min-w-0">
                    <div className="font-bold text-[#1a2332] text-sm">{t.a}</div>
                    <div className="text-xs text-[#1a2332]/40 mt-0.5">{t.n}</div>
                  </div>
                  <div className="font-bold text-[var(--brand,#1d6fa4)] text-sm shrink-0">{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-xs text-[#1a2332]/40 mt-6 leading-relaxed max-w-[70ch]">
              Cabinet conventionné secteur 1, carte Vitale et tiers payant acceptés. Tout acte
              dépassant 70 € fait l'objet d'un devis écrit, à transmettre à votre mutuelle avant
              d'accepter. Nous vous disons systématiquement s'il existe une option prise en charge à 100 %.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[#1a2332] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-6">Prendre soin de vous</div>
            <h2 className="text-4xl font-bold text-white mb-5">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Prenez RDV<br /><span className="text-[#7bc3f5]">en moins de 2 minutes.</span></>)}</h2>
            <p className="text-white/30 mb-10 text-sm">Disponible en ligne 24h/24 · Confirmation SMS · Rappel automatique 48h avant</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => openRdv(null)} className="min-h-[44px] px-10 py-4 bg-[var(--brand,#1d6fa4)] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#155d8a] transition-colors rounded-xl cursor-pointer">
                Réserver en ligne
              </button>
              <a href={`tel:${fd?.phone ?? "0240567890"}`} className="min-h-[44px] flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#7bc3f5]/40 hover:text-[#7bc3f5] transition-all rounded-xl cursor-pointer">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "02 40 56 78 90"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <AppointmentModal open={rdvOpen} onClose={() => setRdvOpen(false)} soins={SOINS} initialSoin={rdvSoin} />

      {/* ── FOOTER ── */}
      <footer className="bg-[#111827] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-bold text-white mb-1">Dr. Léa Fontaine</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1d6fa4)]/60 mb-5">{clientTrade(sessionData) ?? "Chirurgien-dentiste"} · {clientCity(sessionData) ?? "Nantes"}</div>
            <p className="text-white/20 text-sm leading-relaxed">Cabinet dentaire moderne. Omnipratique, implants, esthétique, orthodontie. Urgences tous les matins.</p>
          </div>
          {[
            { t: "Soins", ls: [
              { l: "Soins conservateurs", h: "#soins" }, { l: "Implantologie", h: "#soins" },
              { l: "Esthétique dentaire", h: "#soins" }, { l: "Orthodontie adulte", h: "#soins" },
              { l: "Urgences dentaires", h: "#urgences" },
            ] },
            { t: "Cabinet", ls: [
              { l: "L'équipe", h: "#equipe" }, { l: "Équipement 3D", h: "#soins" },
              { l: "Tarifs & devis", h: "#tarifs" }, { l: "Avis patients", h: "#avis" },
              { l: "Accessibilité PMR", h: "#contact" },
            ] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1d6fa4)]/60 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(({ l, h }) => <li key={l}><Link href={h} className="text-white/20 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          {/* Address and phone were links to #contact. The address is text now,
              and the phone number dials. */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1d6fa4)]/60 mb-5">Adresse</h4>
            <address className="not-italic text-white/20 text-sm leading-relaxed space-y-2.5">
              <div>{clientAddress(sessionData) ?? "14 rue Crébillon"}<br />44000 {clientCity(sessionData) ?? "Nantes"}</div>
              <div>Lun — Ven 8h30 — 19h<br />Sam 8h30 — 13h</div>
              <a href={`tel:${fd?.phone ?? "0240567890"}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" />{fd?.phone ?? "02 40 56 78 90"}
              </a>
            </address>
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 {clientName(sessionData) ?? "Dr. Léa Fontaine"} · RPPS 10234567890 · Secteur 2 · {clientCity(sessionData) ?? "Nantes"} (44){/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <span className="text-[var(--brand,#1d6fa4)]/25">Cabinet dentaire · {clientCity(sessionData) ?? "Nantes"}</span>
        </div>
      </footer>
    </div>
  )
}
