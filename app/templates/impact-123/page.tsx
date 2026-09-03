"use client";
// @ts-nocheck
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Car, ArrowRight, Menu, Zap, Gauge, Shield, Settings, Timer, ChevronRight, Activity, MoveRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientAccrocheRestante,
  clientCity,
  clientHeroLine,
  clientName,
  clientPhotos,
  clientServices,
  clientStats,
  clientText,
  clientWorks,
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

const SOCIALS = [
  { l: "Instagram", h: "https://instagram.com" },
  { l: "YouTube", h: "https://youtube.com" },
  { l: "LinkedIn", h: "https://linkedin.com" },
  { l: "Facebook", h: "https://facebook.com" },
];


function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

function MODELS_DEMO_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ name: o.title, year: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}) })), [
  { name: "V1 Prototype", year: "2024", topSpeed: "380 km/h", power: "1,200 hp", img: (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/10359536/pexels-photo-10359536.jpeg?auto=compress&cs=tinysrgb&w=1200") },
  { name: "Iron Lung S", year: "2023", topSpeed: "420 km/h", power: "1,600 hp", img: (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/16352272/pexels-photo-16352272.jpeg?auto=compress&cs=tinysrgb&w=1200") },
  { name: "Apex Track", year: "2024", topSpeed: "340 km/h", power: "900 hp", img: (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/11189630/pexels-photo-11189630.jpeg?auto=compress&cs=tinysrgb&w=1200") },
]);
}
let MODELS_DEMO = MODELS_DEMO_LIVE();

const SPECS_SOURCE = [
  { label: "0-100 km/h", value: "2.1s" },
  { label: "Lateral G", value: "1.8G" },
  { label: "Weight", value: "1,240kg" },
  { label: "Aero Downforce", value: "800kg" },
]
let SPECS = SPECS_SOURCE;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function VulcanMotorsPage() {
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
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;

  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  MODELS_DEMO = MODELS_DEMO_LIVE();
  SPECS = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({ ...SPECS_SOURCE[i % SPECS_SOURCE.length], value: s.value, label: s.label })),
    SPECS_SOURCE,
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 3;
    const _photoArrays: any[] = [MODELS_DEMO];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const MODELS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      name: s.title ?? s.name ?? MODELS_DEMO[i % MODELS_DEMO.length].name,
      year: MODELS_DEMO[i % MODELS_DEMO.length].year,
      topSpeed: MODELS_DEMO[i % MODELS_DEMO.length].topSpeed,
      power: MODELS_DEMO[i % MODELS_DEMO.length].power,
      img: MODELS_DEMO[i % MODELS_DEMO.length].img,
    })),
    MODELS_DEMO
  );

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // ── Test session booking modal ──────────────────────────────────────────
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)
  const [bookingForm, setBookingForm] = useState({ model: "", date: "", name: "", email: "", phone: "" })

  useEffect(() => {
    if (!bookingOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeBookingModal() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [bookingOpen]);

  function closeBookingModal() {
    setBookingOpen(false)
    setBookingLoading(false)
    setBookingSent(false)
    setBookingForm({ model: "", date: "", name: "", email: "", phone: "" })
  }

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBookingLoading(true)
    setTimeout(() => {
      setBookingLoading(false)
      setBookingSent(true)
    }, 1000)
  }

  return (
    <div className="bg-[#050505] text-white font-sans min-h-dvh selection:bg-[var(--brand,#ff3b30)] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-red-600/20 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center -skew-x-12 group-hover:scale-110 transition-transform duration-500">
                  <Car className="w-6 h-6 text-black fill-current" />
                </div>
                <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase italic whitespace-nowrap">{clientName(sessionData) ?? "Vulcan"}{!clientName(sessionData) && <span className="text-red-600">Motors</span>}</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Atelier", "Collection", "Performance", "Reserve"].map(l => (
              <Link key={l} href="#realisations" className="hover:text-red-500 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="hidden md:block px-6 py-2.5 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Owner Portal</button>
            <button className="px-3.5 py-2 sm:px-8 sm:py-3 bg-red-600 text-white text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white hover:text-black transition-all duration-500 italic whitespace-nowrap shrink-0">Configure</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-red-600/20 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["The Atelier", "Models", "Tech Specs", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-3xl font-black uppercase tracking-tighter hover:text-red-600 transition-colors italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-dvh flex items-center pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={photo(3, "https://images.pexels.com/photos/596815/pexels-photo-596815.jpeg?auto=compress&cs=tinysrgb&w=2400")} alt="Hypercar Detail" fill className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <Reveal delay={0.1} y={60}>
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-12">{<>{clientHeroLine(sessionData, 0, 3, 7) ?? "Pure"}<br/>{clientHeroLine(sessionData, 1, 3, 7) ?? "Kinetic"}<br/><span className="text-red-600">{clientHeroLine(sessionData, 2, 3, 7) ?? "Soul."}</span>
              </>}</h1>
      {/* ACCROCHE_SOUS_TITRE — le titre est trop étroit pour la phrase du client */}
      {clientAccrocheRestante(sessionData, 3, 7) && (
        <p style={{ fontSize: "clamp(15px, 1.5vw, 20px)", lineHeight: 1.5, opacity: 0.92, marginTop: 12, maxWidth: "44ch", textShadow: "0 1px 3px rgba(0,0,0,0.42)" }}>
          {clientAccrocheRestante(sessionData, 3, 7)}
        </p>
      )}

            </Reveal>
            <Reveal delay={0.25}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl border-t border-white/10 pt-12">
                {SPECS.map((s, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{s.label}</div>
                    <div className="text-3xl font-black italic">{s.value}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            <span>Mechanical Audits</span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-red-600" />
            </div>
          </div>
        </section>

        {/* ── ATELIER ───────────────── */}
        <section id="realisations" className="py-40 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/2" />
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Engineering Manifesto</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 leading-tight">{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>Hand-Forged <br/>In <span className="text-white/20 italic">The Dark.</span></>)}</h2>
                  <div className="space-y-12">
                    {[
                      { icon: Settings, t: "Mechanical Purity", d: "Naturally aspirated power plants without digital intervention. Raw, unfiltered combustion." },
                      { icon: Shield, t: "Aeronautic Materials", d: "Châssis en titane grade 5 et carrosserie en composite carbone cuit en autoclave, pour une rigidité extrême." },
                      { icon: Timer, t: "Analog Precision", d: "Each component calibrated by hand in our specialized test cells over 600 hours." }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-16 h-16 shrink-0 bg-white/5 border border-white/10 flex items-center justify-center -skew-x-12 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-700">
                            <f.icon className="w-6 h-6 text-red-600 group-hover:text-black transition-colors" />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold uppercase italic mb-2 tracking-tight">{f.t}</h4>
                            <p className="text-white/40 leading-relaxed text-sm max-w-sm">{f.d}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                <div className="aspect-square relative grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5 p-4 bg-white/[0.02]">
                   <ParallaxImg src={photo(4, "https://images.pexels.com/photos/11189630/pexels-photo-11189630.jpeg?auto=compress&cs=tinysrgb&w=1200")} alt="Engine Detail" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-red-600/20 rotate-45 pointer-events-none" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── MODELS ────────────────── */}
        <section className="py-40 bg-[#0a0a0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Active Fleet</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>The <span className="text-white/20">Lineup.</span></>)}</h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 text-white/40 transition-colors group">
                  Private Inventory <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {MODELS.map((m, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer">
                    <Image src={m.img} alt={m.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">{m.year} Production</div>
                      <h3 className="text-4xl font-black italic uppercase mb-8">{m.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/20 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                         <div>
                            <div className="text-[10px] font-bold uppercase text-white/40 mb-1">Top Speed</div>
                            <div className="text-xl font-bold italic uppercase">{m.topSpeed}</div>
                         </div>
                         <div>
                            <div className="text-[10px] font-bold uppercase text-white/40 mb-1">Power</div>
                            <div className="text-xl font-bold italic uppercase">{m.power}</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECS TABLE ───────────── */}
        <section id="contact" className="py-40 bg-[#050505] border-t border-red-600/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Performance Data</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>The <span className="text-white/20">Numbers.</span></>)}</h2>
                </div>
                <div className="text-sm text-white/30 font-light italic">Tested at Portimão circuit under FIA-sanctioned conditions. All figures SAE certified.</div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-red-600/10">
              {[...SPECS,
                { label: "Braking 100-0", value: "28m" },
                { label: "Engine", value: "V12 Biturbo" },
                { label: "Gearbox", value: "7-speed PDK" },
                { label: "Active Aero Modes", value: "5" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="bg-[#050505] p-12 group hover:bg-red-600/5 transition-colors duration-500">
                    <div className="text-3xl md:text-4xl font-black italic text-white mb-3 group-hover:text-red-500 transition-colors">{s.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-8 p-10 border border-red-600/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Production Run</div>
                  <div className="text-2xl font-black italic text-white">24 units per annum. Each hand-assembled.</div>
                </div>
                <div className="flex gap-12">
                  {[{ v: "24", l: "Units/year" }, { v: "1,800hr", l: "Assembly time" }, { v: "8yr", l: "Delivery wait" }].map(k => (
                    <div key={k.l} className="text-center">
                      <div className="text-2xl font-black italic text-red-500">{k.v}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">{k.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TRACK EXPERIENCE ──────── */}
        <section className="py-40 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-8">Beyond the Road</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Born On <br /><span className="font-light not-italic text-white/20">Track.</span></>)}</h2>
                <div className="space-y-8">
                  {[
                    { icon: Timer, t: "Owner Track Days", d: `Quarterly invitations to Portimão, Spa, and Suzuka. ${clientName(sessionData) ?? "Vulcan"} engineering crew on-site.` },
                    { icon: Gauge, t: "Tailored Calibration", d: "Every car leaves the atelier pre-mapped to the owner's preferred circuit. Updates over-the-air." },
                    { icon: Activity, t: "Telemetry Suite", d: `Real-time data transmitted to the ${clientName(sessionData) ?? "Vulcan"} server farm. Lap coaching from ex-F1 engineers.` },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 shrink-0 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-700 -skew-x-6">
                        <f.icon className="w-5 h-5 text-red-600/60 group-hover:text-white transition-colors skew-x-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black uppercase italic mb-2">{f.t}</h4>
                        <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-square grayscale hover:grayscale-0 transition-all duration-[2000ms]">
                  <ParallaxImg src={photo(5, "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=1200")} alt="Track" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-red-600" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
          <div className="relative z-10 text-center px-6">
            <Reveal>
              <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase italic leading-[0.75] text-black mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
                Command<br/>Gravity.
              </>)}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="px-16 py-6 min-h-[44px] bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:px-20 transition-all duration-700 italic cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Book A Test Session
                </button>
                <button className="px-16 py-6 border-2 border-black text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                  Configure Yours
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-red-600 flex items-center justify-center -skew-x-12">
                <Car className="w-6 h-6 text-black fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">{/* Le suffixe se collait au nom du client : la barre affichait
                « Atelier VérificationMotors ». Il n'appartient qu'au nom de la
                démonstration. */}
                {clientName(sessionData) ?? (<>Vulcan<span className="text-red-600">Motors</span></>)}</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm italic font-light">{c?.aboutText ?? <>
              Restaurer le passé, dessiner l'avenir. {clientName(sessionData) ?? "Vulcan"} Un atelier voué à la préservation et à l'évolution de l'hypercar.
            </>}</p>
            <div className="flex gap-8">
               {SOCIALS.map(s => (
                 <Link key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-red-600 transition-colors">{s.l}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Atelier", l: ["Restoration", "Bespoke Builds", "Engine Lab", "Carbon Cell"] },
            { t: "Inventory", l: ["V1 Prototype", "Iron Lung S", "Apex Track", "Archive"] },
            { t: "Owners", l: ["Concierge", "Documentation", "Global Track Days", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#contact" className="text-xs text-white/40 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 {clientName(sessionData) ?? "VULCAN MOTORS ATELIER. REDLINE"} ADDICTED.{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">MODENA, IT</Link>
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">SILVERSTONE, UK</Link>
          </div>
        </div>
      </footer>

      {/* ── TEST SESSION BOOKING MODAL ─────────── */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={closeBookingModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-red-600/20 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={closeBookingModal}
                aria-label="Close"
                className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>

              <div className="p-8 md:p-10">
                {bookingSent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-red-600 -skew-x-12 flex items-center justify-center mx-auto mb-8">
                      <span className="text-black font-black text-2xl skew-x-6">&#10003;</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tight mb-4">Session Requested</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-8">
                      Our concierge team will contact you within 24 hours to confirm your track date and vehicle allocation.
                    </p>
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      className="px-10 py-4 min-h-[44px] bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 italic cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-3">Private Track Access</div>
                    <h3 id="booking-modal-title" className="text-3xl md:text-4xl font-black uppercase italic tracking-tight mb-8">Book A Test<br />Session.</h3>

                    <div className="space-y-6">
                      <div>
                        <label htmlFor="booking-model" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Model</label>
                        <select
                          id="booking-model"
                          required
                          value={bookingForm.model}
                          onChange={(e) => setBookingForm(f => ({ ...f, model: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-red-600 focus-visible:ring-2 focus-visible:ring-red-600 transition-colors cursor-pointer"
                        >
                          <option value="" className="bg-black">Select a model</option>
                          {MODELS.map((m: any) => (
                            <option key={m.name} value={m.name} className="bg-black">{m.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="booking-date" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Preferred Date</label>
                        <input
                          id="booking-date"
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-red-600 focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="booking-name" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                        <input
                          id="booking-name"
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Jonathan Rhys"
                          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-600 focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="booking-email" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Email</label>
                          <input
                            id="booking-email"
                            type="email"
                            required
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="you@email.com"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-600 focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="booking-phone" className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Phone</label>
                          <input
                            id="booking-phone"
                            type="tel"
                            required
                            value={bookingForm.phone}
                            onChange={(e) => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+1 555 000 0000"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-600 focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full mt-10 px-10 py-4 min-h-[44px] bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 italic disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 flex items-center justify-center gap-3"
                    >
                      {bookingLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : "Confirm Request"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
