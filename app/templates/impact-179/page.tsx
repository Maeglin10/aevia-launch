"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Droplets, ShieldCheck, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, Award, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientAreas,
  clientCity,
  clientServices,
} from "@/lib/templates/clientContent";

/* ═══════════════════════════════════════════════════════════════════════════
   AQUANOVA PISCINES — Pisciniste / Constructeur de piscines (Lyon)
   Palette : blanc / bleu atlantique var(--brand) / ardoise / acier
   Fonts : Outfit (titres) + Roboto Mono (accents)
   Style : clair, propre, professionnel, confiance
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Réalisations", h: "#realisations" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Zone intervention", h: "#zone" },
  { l: "Contact", h: "#contact" },
];

const TARIFS_DEMO = [
  { a: "Déplacement & diagnostic", p: "65 €", n: "Déduit de la facture si les travaux nous sont confiés." },
  { a: "Fuite apparente", p: "à partir de 130 €", n: "Recherche, réparation et mise en eau. Une heure sur place en moyenne." },
  { a: "Recherche de fuite non destructive", p: "290 €", n: "Caméra thermique, gaz traceur, corrélateur. Rapport photo pour l'assurance." },
  { a: "Débouchage canalisation", p: "à partir de 180 €", n: "Furet ou haute pression selon l'obstruction. Passage caméra inclus au-delà de 250 €." },
  { a: "Remplacement chauffe-eau 200 L", p: "à partir de 890 €", n: "Appareil, pose, évacuation de l'ancien et mise en service." },
  { a: "Majoration nuit, dimanche, férié", p: "+ 90 €", n: "Annoncée au téléphone avant de partir." },
];
let TARIFS = TARIFS_DEMO;

const ZONES_DEMO = [
  { v: "Lyon 1er — 9e", d: "Intervention sous 2 h en urgence" },
  { v: "Villeurbanne · Vaulx-en-Velin", d: "Sous 2 h" },
  { v: "Caluire · Rillieux", d: "Sous 3 h" },
  { v: "Écully · Tassin · Francheville", d: "Sous 3 h" },
  { v: "Vénissieux · Saint-Priest · Bron", d: "Sous 3 h" },
  { v: "Reste du Rhône", d: "Sur rendez-vous, hors urgence" },
];
let ZONES = ZONES_DEMO;

const SERVICE_ICONS = [Droplets, Wrench, ShieldCheck, Droplets, Wrench, ShieldCheck]
const SERVICES_DEMO = [
  { icon: Droplets, title: "Construction de piscine sur-mesure", desc: "Piscine enterrée béton ou coque polyester, forme libre ou classique. Étude de sol, terrassement, structure, étanchéité et margelles — clé en main." },
  { icon: Wrench, title: "Rénovation de piscine", desc: "Réfection d'étanchéité, changement de liner, remise à neuf des margelles et du système de filtration. Redonnez vie à votre bassin." },
  { icon: ShieldCheck, title: "Sécurité & conformité", desc: "Barrières, volets immergés, alarmes et abris conformes à la norme NF P90. Protégez votre famille en toute tranquillité." },
  { icon: Droplets, title: "Local technique & filtration", desc: "Pompes, filtres à sable, électrolyseur au sel, régulation automatique du pH. Une eau limpide toute l'année, sans effort." },
  { icon: Wrench, title: "Entretien & hivernage", desc: "Contrat d'entretien saisonnier, mise en hivernage, remise en route au printemps. Nettoyage, analyse de l'eau, traitement." },
  { icon: ShieldCheck, title: "Devis gratuit sous 48h", desc: "Étude personnalisée avec plan 3D et estimation détaillée, sans engagement. Travaux garantis, décennale incluse." },
]

const REALISATIONS_DEMO = [
  { title: "Piscine miroir 10×4 m · Villa", tag: "Béton sur-mesure", img: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=1200" },
  { title: "Rénovation liner & margelles", tag: "Rénovation complète", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200" },
  { title: "Couloir de nage 12 m · Contemporain", tag: "Nage à contre-courant", img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function AquanovaPiscinesPage() {
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

  const bpLocal: any = session?.businessProfile;
  const SERVICES = resolveList(
    bpLocal?.services?.map((s: any, i: number) => ({
      icon: SERVICE_ICONS[i % SERVICE_ICONS.length],
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    SERVICES_DEMO
  );
  const REALISATIONS = resolveList(
    bpLocal?.beforeAfter?.map((b: any, i: number) => ({
      title: b.caption ?? REALISATIONS_DEMO[i % REALISATIONS_DEMO.length].title,
      tag: "Réalisation",
      img: b.afterUrl ?? b.beforeUrl ?? REALISATIONS_DEMO[i % REALISATIONS_DEMO.length].img,
    })),
    REALISATIONS_DEMO
  );
  const AVIS = resolveList(
    bpLocal?.reputation?.featuredReviews?.map((r: any) => ({
      q: r.text ?? r.quote,
      n: r.name ?? r.author,
      l: r.location ?? r.context ?? "",
      s: r.stars ?? r.rating ?? 5,
    })),
    [
      { q: "Notre piscine miroir est une pure merveille. De l'étude 3D à la mise en eau, l'équipe a été d'un professionnalisme rare. Délais tenus, budget respecté.", n: "Sandrine M.", l: "Lyon 3ème", s: 5 },
      { q: "Rénovation complète de notre bassin des années 90 : nouveau liner, margelles, filtration au sel. Résultat bluffant. On se croirait dans une piscine neuve.", n: "Patrick & Aurélie F.", l: "Villeurbanne", s: 5 },
      { q: "Couloir de nage installé en 6 semaines, chantier propre et bien organisé. Le système de nage à contre-courant est top. Je recommande les yeux fermés.", n: "Luc B.", l: "Lyon 6ème", s: 5 },
    ]
  );

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  ZONES = resolveList(
    clientAreas(session)?.map((z, i) => ({ ...ZONES_DEMO[i % ZONES_DEMO.length], v: z })),
    ZONES_DEMO,
  );
  TARIFS = resolveList(
    clientServices(session)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 1;
    const _photoArrays: any[] = [REALISATIONS];
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
  c = session?.generatedContent;
  bp = bpLocal;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-white text-[#0f172a] overflow-x-hidden" style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif", ["--brand" as any]: brand ?? "#0369a1", ["--brand-light" as any]: brand ?? "#38bdf8" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/97 backdrop-blur-xl py-3 shadow-sm border-b border-slate-100" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-[var(--brand)] flex items-center justify-center rounded">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className={`text-lg font-bold tracking-tight ${scrolled ? "text-[#0f172a]" : "text-white"}`}>{fd?.businessName ?? <>AquaNova <span className={scrolled ? "text-[var(--brand)]" : "text-[#7dd3fc]"}>Piscines</span></>}</span>
              </>
            )}
          </div>
          <div className={`hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.2em] ${scrolled ? "text-[#0f172a]/40" : "text-white/70"}`}>
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${fd?.phone ?? "0478987654"}`} className={`hidden md:flex items-center gap-2 font-bold text-sm ${scrolled ? "text-[var(--brand)]" : "text-white"}`}>
              <Phone className="w-4 h-4" /> {fd?.phone ?? "04 78 98 76 54"}
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[var(--brand)] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className={`w-5 h-5 ${scrolled ? "text-[#0f172a]" : "text-white"}`} /></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => (
                    <Link key={l} href={h} className="text-3xl font-bold text-[#0f172a] hover:text-[var(--brand)] transition-colors">{l}</Link>
                  ))}
                  <a href={`tel:${fd?.phone ?? "0478987654"}`} className="flex items-center gap-3 text-[var(--brand)] font-bold text-xl mt-4">
                    <Phone className="w-5 h-5" /> {fd?.phone ?? "04 78 98 76 54"}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=85&w=2400")} alt="Piscine sur-mesure" fill className="object-cover" priority style={{ filter: "brightness(0.6)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/55 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 text-white">{c?.heroHeadline ?? <>
            Votre piscine<br />sur-<span className="text-[var(--brand-light)]">mesure</span><br />à Lyon.
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/45 leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
            Construction, rénovation et entretien de piscines. Bassins béton et coque, sécurité aux normes, local technique et filtration. Devis gratuit sous 48h, garantie décennale.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[var(--brand)] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">{c?.ctaText ?? <>
              Devis gratuit sous 48h
            </>}</button>
            <a href={`tel:${fd?.phone ?? "0478987654"}`} className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.15em] rounded hover:bg-white/20 transition-all">
              <Phone className="w-4 h-4" /> Nous appeler
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand-light)]/60 to-transparent" />
        </div>
      </section>

      {/* ── URGENCE BANNER ── */}
      <section className="bg-[var(--brand)] py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <div className="w-2 h-2 bg-[var(--brand-light)] rounded-full animate-pulse" />
            <span className="font-bold text-sm">Construction · Rénovation · Entretien de piscines</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white/80 text-sm font-semibold"><Clock className="w-4 h-4" /> Devis sous 48h</span>
            <a href={`tel:${fd?.phone ?? "0478987654"}`} className="bg-white text-[var(--brand)] px-5 py-2 rounded font-bold text-sm hover:bg-[#f0f9ff] transition-colors">
              {fd?.phone ?? "04 78 98 76 54"}
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "18+", l: "Ans d'expérience" },
            { v: "2 400+", l: "Interventions" },
            { v: "4.9★", l: "Avis Google" },
            { v: "2 ans", l: "Garantie travaux" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="bg-white rounded-lg border border-slate-100 p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-[var(--brand)] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)] mb-4">Nos interventions</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a]">Tout ce que nous <span className="text-[var(--brand)]">faisons.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="group p-8 border border-slate-100 rounded-xl hover:border-[var(--brand)]/30 hover:shadow-lg hover:shadow-[var(--brand)]/5 transition-all duration-500">
                  <div className="w-12 h-12 bg-[var(--brand)]/8 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[var(--brand)] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[var(--brand)] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3 group-hover:text-[var(--brand)] transition-colors">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section id="realisations" className="py-28 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)] mb-4">Portfolio</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a]">Nos <span className="text-[var(--brand)]">réalisations.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {REALISATIONS.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ParallaxImg src={r.img} alt={r.title} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--brand)] text-white text-[10px] font-bold uppercase tracking-widest rounded">{r.tag}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#0f172a] group-hover:text-[var(--brand)] transition-colors">{r.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-28 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)] mb-4">Tarifs</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a]">Le prix <span className="text-[var(--brand)]">avant l'outil.</span></h2>
          </div></Reveal>
          <div className="border border-slate-100">
            {TARIFS.map((t, i) => (
              <Reveal key={t.a} delay={i * 0.05}>
                <div className={`flex flex-wrap items-baseline justify-between gap-3 px-7 py-5 ${i ? "border-t border-slate-100" : ""}`}>
                  <div className="min-w-0">
                    <div className="font-bold text-[#0f172a] text-sm">{t.a}</div>
                    <div className="text-xs text-[#0f172a]/40 mt-0.5">{t.n}</div>
                  </div>
                  <div className="font-bold text-[var(--brand)] text-sm shrink-0">{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-xs text-[#0f172a]/40 mt-6 leading-relaxed max-w-[70ch]">
              Montants TTC, pièces comprises sauf mention contraire. Rien n'est engagé sans votre accord :
              le devis est signé sur place, sur tablette, et vous en recevez une copie par courriel avant
              que nous commencions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ZONE ── */}
      <section id="zone" className="py-28 bg-[#0f172a] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)] mb-4">Zone d'intervention</div>
            <h2 className="text-4xl md:text-5xl font-bold">Et en <span className="text-[var(--brand)]">combien de temps.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {ZONES.map((z, i) => (
              <Reveal key={z.v} delay={i * 0.05}>
                <div className="bg-[#0f172a] p-7 h-full">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--brand)]" />{z.v}
                  </div>
                  <p className="text-sm text-white/40">{z.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)] mb-4">Avis clients</div>
              <h2 className="text-4xl font-bold text-[#0f172a]">Ils nous font <span className="text-[var(--brand)]">confiance.</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVIS.map((t: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border border-slate-100 rounded-xl hover:border-[var(--brand)]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.s)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand)] text-[var(--brand)]" />)}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed italic flex-1">{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="font-bold text-[#0f172a] text-sm">{t.n}</div>
                    {t.l && <div className="flex items-center gap-1 text-[10px] text-[var(--brand)] mt-1"><MapPin className="w-3 h-3" /> {t.l}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-16 bg-[var(--brand)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { t: "Certifié RGE", s: "Reconnu Garant Environnement" },
            { t: "Garantie Décennale", s: "Assurance professionnelle" },
            { t: "Label Qualibat", s: "Excellence artisanale" },
            { t: "Garantie 2 ans", s: "Sur tous les travaux" },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-2 py-4">
                <CheckCircle className="w-8 h-8 text-white/70 mb-1" />
                <div className="font-bold text-white text-sm">{c.t}</div>
                <div className="text-white/50 text-[10px] tracking-wide">{c.s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-32 bg-[#0f172a] text-center">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand-light)] mb-6">Prendre contact</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Un projet ?<br /><span className="text-[var(--brand-light)]">Parlons-en.</span></h2>
            <p className="text-white/40 mb-10 text-sm leading-relaxed">Devis gratuit sous 48h · Étude 3D offerte · Travaux garantis décennale</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[var(--brand)] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#0284c7] transition-colors">
                Demander un devis
              </button>
              <a href={`tel:${fd?.phone ?? "0478987654"}`} className="flex items-center gap-3 px-10 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-[0.15em] rounded hover:border-[var(--brand-light)]/50 hover:text-[var(--brand-light)] transition-all">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "04 78 98 76 54"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060d18] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 bg-[var(--brand)] rounded flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">{fd?.businessName ?? "AquaNova Piscines"}</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">Pisciniste certifié · Grand Lyon. Construction, rénovation et entretien de piscines depuis 2006.</p>
          </div>
          {[
            { t: "Services", ls: ["Construction sur-mesure", "Rénovation de piscine", "Sécurité & conformité", "Local technique", "Entretien & hivernage"] },
            { t: "Informations", ls: ["Qui sommes-nous", "Certifications & garanties", "Zone d'intervention", "Témoignages", "Conseils piscine"] },
            { t: "Contact", ls: ["04 78 98 76 54", "contact@aquanova.fr", "Zone Grand Lyon", "Étude 3D offerte", "Devis gratuit sous 48h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand-light)] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 {fd?.businessName ?? "AquaNova Piscines"} · SIRET 234 567 890 00056 · Garantie Décennale · Assurance RC Pro{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
          <span className="text-[var(--brand-light)]/30">Pisciniste certifié · Grand Lyon</span>
        </div>
      </footer>
    </div>
  )
}
