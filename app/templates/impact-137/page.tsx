"use client";
import {
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientText,
} from "@/lib/templates/clientContent";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Coffee, Leaf, MapPin, Star, ArrowRight, Menu, Thermometer, Droplets, Mountain, Award, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import { DWELL, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2"
import { PanelDrop } from "@/lib/templates/hero-kit-3"
import { LegalIdentity } from "@/app/templates/LegalIdentity";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
// tarifs, jusqu'ici écrit dans le rendu sans constante nommée.
const TARIFS_ANON_SOURCE = [
                { name: "Découverte", price: "28 €", cadence: "/ quinzaine", qty: "250 g", desc: "Une origine unique, choisie par nos torréfacteurs à chaque cycle. Pour les curieux.", features: ["1 origine par cycle", "Fiche de dégustation", "Sachet compostable"], highlight: false },
                { name: "Amateur", price: "52 €", cadence: "/ quinzaine", qty: "500 g", desc: "Deux origines accordées — les contrastes de terroir, d'altitude et de méthode.", features: ["2 origines par cycle", "Guide d'extraction", "Notes SCA en clair", "Livraison offerte"], highlight: true },
                { name: "Maison", price: "96 €", cadence: "/ quinzaine", qty: "1 kg", desc: "L'expérience complète : quatre origines, accès aux lots avant sortie, dégustations au comptoir.", features: ["4 origines par cycle", "Accès aux lots rares", "Portraits de producteurs", "Livraison express offerte", "Dégustations privées"], highlight: false },
              ];
let TARIFS_ANON = TARIFS_ANON_SOURCE;

let c: any = null;
let bp: any = null;
let brand: any = null;

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-12%] w-[124%] h-[124%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

function ORIGINS_DEMO_LIVE() {
  return [
  { name: "Éthiopie Yirgacheffe", region: "Sidamo, Éthiopie", altitude: "1 800 m", process: "Lavé", notes: "Jasmin, bergamote, fruits à noyau", img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop"), score: 92 },
  { name: "Colombie Huila", region: "Huila, Colombie", altitude: "1 650 m", process: "Honey", notes: "Chocolat, caramel, agrumes", img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"), score: 89 },
  { name: "Kenya Nyeri AA", region: "Nyeri, Kenya", altitude: "1 700 m", process: "Lavé", notes: "Cassis, tomate confite, vineux", img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&q=80&w=800"), score: 91 },
  { name: "Guatemala Antigua", region: "Antigua, Guatemala", altitude: "1 500 m", process: "Nature", notes: "Chocolat noir, épices, fumé", img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800"), score: 88 },
];
}
let ORIGINS_DEMO = ORIGINS_DEMO_LIVE();

const PROCESS = [
  { step: "01", title: "Sourcer", desc: "Achat direct auprès de familles productrices, sur quatorze origines suivies d'année en année.", icon: Mountain },
  { step: "02", title: "Torréfier", desc: "Profils au degré près, par lots de 12 kg, sur un Probat UG22 restauré — visible depuis le comptoir.", icon: Thermometer },
  { step: "03", title: "Goûter", desc: "Chaque lot est noté à l'aveugle. En dessous de 85 points SCA, il ne passe pas le comptoir.", icon: Coffee },
  { step: "04", title: "Servir", desc: "Au comptoir toute la journée, et torréfié à la commande pour la maison, expédié sous 24 h.", icon: Droplets },
]


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function TorrefieCoffeePage() {
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

  sessionData = session;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  ORIGINS_DEMO = ORIGINS_DEMO_LIVE();


  TARIFS_ANON = resolveList(

    clientServices({ formData: fd, businessProfile: bp, generatedContent: c })?.map((s: any, i: number) => ({ ...TARIFS_ANON_SOURCE[i % TARIFS_ANON_SOURCE.length], name: s.title, price: s.price ?? TARIFS_ANON_SOURCE[i % TARIFS_ANON_SOURCE.length].price })),

    TARIFS_ANON_SOURCE,

  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [ORIGINS_DEMO];
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

  // Origins ← bp.menu (real coffee list) else demo. altitude/process/img/score
  // are decorative fields cycled from the demo origin.
  const ORIGINS = resolveList(
    bp?.menu?.map((m: any, i: number) => {
      const d = ORIGINS_DEMO[i % ORIGINS_DEMO.length];
      return {
        ...d,
        name: m.name ?? d.name,
        region: m.category ?? d.region,
        notes: m.description ?? d.notes,
      };
    }),
    ORIGINS_DEMO
  );

  const AVIS_SOURCE = [
    { quote: "Le Yirgacheffe a changé ma façon de boire le café. J'ai fait tous les torréfacteurs de " + (clientCity(sessionData) ?? "Paris") + " — celui-ci joue seul.", name: "Hélène Duval", location: clientCity(sessionData) ?? "Paris", origin: "Éthiopie Yirgacheffe" },
    { quote: "Torréfié le mardi, sur ma table le jeudi. Le Kenya Nyeri est extraordinaire — le cassis n'est pas un argument marketing, il est dans la tasse.", name: "Marc Vasseur", location: "Vincennes", origin: "Kenya Nyeri AA" },
    { quote: "Enfin un abonnement qui fait tourner les origines intelligemment. Mon palais a plus appris en trois mois qu'en trois ans.", name: "Claire Fontan", location: "Boulogne", origin: "Colombie Huila" },
  ];
  const AVIS_LISTE = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      quote: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].quote,
      name: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].name,
      location: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].location,
    })),
    AVIS_SOURCE,
  );

  const [scrolled, setScrolled] = useState(false)

  const { i: slide } = useSlides(3, DWELL.normal);
  const HERO_SLIDES = [
    { k: "Le comptoir", l1: "Du grain", l2: "à", l3: "l'âme.", sub: "Cafés de spécialité, torréfiés par petits lots dans notre atelier — et servis au comptoir toute la journée.", img: photo(4, "https://images.pexels.com/photos/7091096/pexels-photo-7091096.jpeg?auto=compress&cs=tinysrgb&w=1600") },
    { k: "La torréfaction", l1: "Torréfié", l2: "sur", l3: "place.", sub: "Un Probat restauré, des profils au degré près, et l'odeur qui va avec — la torréfaction se fait devant vous.", img: photo(5, "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=2400") },
    { k: "L'abonnement", l1: "Chez vous,", l2: "tous les", l3: "quinze jours.", sub: "Torréfié à la commande, expédié sous 24 heures, en sachet compostable. Pause ou arrêt quand vous voulez.", img: photo(4, "https://images.pexels.com/photos/7091096/pexels-photo-7091096.jpeg?auto=compress&cs=tinysrgb&w=1600") },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#f5f0ea] text-[#2c1810] font-sans min-h-dvh selection:bg-[var(--brand,#6b3a24)] selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f5f0ea]/90 backdrop-blur-xl border-b border-[var(--brand,#6b3a24)]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Coffee className="w-6 h-6 text-[var(--brand,#6b3a24)]" />
                <span className="text-xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>{/* NOM_LOGO */ clientName({ formData: fd }) ?? (<>
                  <span className="font-light">Torré</span><span className="font-bold text-[var(--brand,#6b3a24)]">fié</span>
                </>)}</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2c1810]/40">
            {[["Les origines", "#origines"], ["La méthode", "#methode"], ["Abonnements", "#tarifs"], ["Le comptoir", "#contact"]].map(([l, h]) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#6b3a24)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#2c1810] text-[#f5f0ea] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[var(--brand,#6b3a24)] transition-colors duration-500">
              Commander du café
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#f5f0ea] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {[["Les origines", "#origines"], ["La méthode", "#methode"], ["Abonnements", "#tarifs"], ["Le comptoir", "#contact"]].map(([l, h]) => (
                    <Link key={l} href={h} className="text-3xl font-light hover:text-[var(--brand,#6b3a24)] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO — PanelDrop : le panneau descend comme un rideau, contenu
            compris, pendant que la photo change derrière (v02 coffee-shop —
            le geste d'origine du café). Un seul index pour tout. ── */}
        <section id="hero" className="relative h-[100svh] min-h-[640px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#2c1810]">
            {HERO_SLIDES.map((h, n) => (
              <motion.div key={n} className="absolute inset-0" animate={{ opacity: n === slide ? 1 : 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                <Image src={h.img} alt={h.k} fill className="object-cover" priority={n === 0} />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0ea] via-[#f5f0ea]/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#6b3a24)] block mb-6">
              {clientEyebrow(sessionData) ?? `Torréfacteur & comptoir · ${clientCity(sessionData) ?? "Paris"}`}
            </span>
            <PanelDrop index={clientHeroLine(sessionData, 0, 3, 9) ? "client" : slide} style={{ minHeight: "min(46vh, 430px)" }}>
              <div>
                <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "Georgia, serif" }}>{<>{clientHeroLine(sessionData, 0, 3, 9) ?? HERO_SLIDES[slide].l1}<br/>{clientHeroLine(sessionData, 1, 3, 9) ?? HERO_SLIDES[slide].l2}{" "}<em className="text-[var(--brand,#6b3a24)]">{clientHeroLine(sessionData, 2, 3, 9) ?? HERO_SLIDES[slide].l3}</em>
                </>}</h1>
                <p className="max-w-lg text-lg text-[#2c1810]/50 font-light leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? HERO_SLIDES[slide].sub}</p>
              </div>
            </PanelDrop>
            <div className="flex flex-wrap items-center gap-8">
              <a href="#origines" className="px-10 py-5 bg-[#2c1810] text-[#f5f0ea] font-bold rounded-full hover:bg-[var(--brand,#6b3a24)] transition-colors duration-500 flex items-center gap-3">
                Découvrir les origines <ArrowRight className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-5">
                <SlideIndex i={slide} total={HERO_SLIDES.length} variant="fraction" color="rgba(44,24,16,0.5)" className="" />
                <span className="text-sm text-[#2c1810]/50"><strong className="text-[#2c1810] font-bold">{HERO_SLIDES[slide].k}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESS ────────────────────────────── */}
        <section id="methode" className="py-32 bg-[#2c1810] text-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c48a5a] block mb-4">La méthode</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>
                  Quatre gestes, <em className="text-[#c48a5a]">dans l'ordre.</em>
                </>)}</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="text-5xl font-light text-[#c48a5a]/20 mb-4" style={{ fontFamily: "Georgia, serif" }}>{p.step}</div>
                    <div className="w-14 h-14 rounded-full border border-[#c48a5a]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c48a5a] group-hover:border-[#c48a5a] transition-all duration-500">
                      <p.icon className="w-6 h-6 text-[#c48a5a] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                    <p className="text-sm text-[#f5f0ea]/40 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ORIGINS GRID ─────────────────────── */}
        <section id="origines" className="py-32 bg-[#f5f0ea]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#6b3a24)] block mb-4">La sélection du moment</span>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                    Les <em className="text-[var(--brand,#6b3a24)]">origines.</em>
                  </>)}</h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ORIGINS.map((o, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer flex flex-col md:flex-row gap-6 p-6 bg-white rounded-sm border border-[var(--brand,#6b3a24)]/5 hover:border-[var(--brand,#6b3a24)]/20 transition-all duration-500">
                    <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-sm shrink-0">
                      <Image src={o.img} alt={o.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#6b3a24)]">{o.process}</span>
                          <span className="text-[10px] text-[#2c1810]/20">·</span>
                          <span className="text-[10px] text-[#2c1810]/40">{o.altitude}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--brand,#6b3a24)] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{o.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-[#2c1810]/40 mb-3"><MapPin className="w-3 h-3" /> {o.region}</div>
                        <p className="text-sm text-[#2c1810]/50 italic">{o.notes}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--brand,#6b3a24)]/10">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[var(--brand,#6b3a24)]" />
                          <span className="text-sm font-bold text-[var(--brand,#6b3a24)]">SCA {o.score}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--brand,#6b3a24)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────── */}
        <section id="about" className="py-32 bg-[#2c1810] text-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c48a5a] block mb-4">Ils y goûtent</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "about.titre") ?? (<>
                  Le comptoir <em className="text-[#c48a5a]">en parle.</em>
                </>)}</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {AVIS_LISTE.map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="p-10 border border-[#c48a5a]/20 flex flex-col gap-6 h-full">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c48a5a] text-[#c48a5a]" />)}
                    </div>
                    <p className="text-[#f5f0ea]/60 font-light leading-relaxed italic flex-1" style={{ fontFamily: "Georgia, serif" }}>&ldquo;{t.quote}&rdquo;</p>
                    <div className="pt-6 border-t border-[#c48a5a]/20">
                      <div className="font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>{t.name}</div>
                      <div className="text-xs text-[#f5f0ea]/30 tracking-widest uppercase mt-1">{t.location}</div>
                      <div className="flex items-center gap-1 text-xs text-[#c48a5a] mt-1"><Coffee className="w-3 h-3" /> {t.origin}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTIONS ─────────────────── */}
        <section id="tarifs" className="py-32 bg-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#6b3a24)] block mb-4">S'abonner</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>
                  Votre <em className="text-[var(--brand,#6b3a24)]">formule.</em>
                </>)}</h2>
                <p className="text-lg text-[#2c1810]/40 font-light max-w-md mx-auto mt-4">
                  {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (<>Torréfié à la commande, expédié tous les quinze jours. Pause ou arrêt à tout moment.</>)}
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TARIFS_ANON.map((plan, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`flex flex-col h-full rounded-sm border p-10 ${plan.highlight ? "bg-[#2c1810] text-[#f5f0ea] border-[var(--brand,#6b3a24)]" : "bg-white border-[var(--brand,#6b3a24)]/10"}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${plan.highlight ? "text-[#c48a5a]" : "text-[var(--brand,#6b3a24)]"}`}>{plan.qty}</div>
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className={`text-4xl font-black ${plan.highlight ? "text-[#c48a5a]" : "text-[var(--brand,#6b3a24)]"}`}>{plan.price}</span>
                      <span className={`text-sm font-light ${plan.highlight ? "text-[#f5f0ea]/40" : "text-[#2c1810]/30"}`}>{plan.cadence}</span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-8 ${plan.highlight ? "text-[#f5f0ea]/50" : "text-[#2c1810]/50"}`}>{plan.desc}</p>
                    <ul className="space-y-3 mb-10 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? "text-[#f5f0ea]/70" : "text-[#2c1810]/60"}`}>
                          <Leaf className={`w-3 h-3 shrink-0 ${plan.highlight ? "text-[#c48a5a]" : "text-[var(--brand,#6b3a24)]"}`} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 ${plan.highlight ? "bg-[#c48a5a] text-white hover:bg-[#f5f0ea] hover:text-[#2c1810]" : "bg-[#2c1810] text-[#f5f0ea] hover:bg-[var(--brand,#6b3a24)]"}`}>
                      Choisir {plan.name}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────── */}
        <section id="contact" className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src={photo(5, "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=2400")} alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#2c1810]/70" />
          </div>
          <div className="relative z-10 text-center text-[#f5f0ea] px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "cta.titre") ?? c?.aboutTitle ?? <>
                Goûtez la<br/><em>différence.</em>
              </>}</h2>
              <p className="text-lg text-[#f5f0ea]/60 font-light max-w-md mx-auto mb-10">{/* TEXTE_SECTION */ clientText(sessionData, "cta.texte") ?? c?.aboutText ?? <>
                Abonnez-vous et recevez chez vous, tous les quinze jours, un café d'origine torréfié de la semaine.
              </>}</p>
              <button className="px-12 py-5 bg-[#f5f0ea] text-[#2c1810] font-bold rounded-full hover:bg-[#c48a5a] hover:text-white transition-all duration-500">
                Commencer l'abonnement
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="bg-[#2c1810] text-[#f5f0ea] pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-5 h-5 text-[#c48a5a]" />
              <span className="text-xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Torré<span className="font-bold text-[#c48a5a]">fié</span></span>
            </div>
            <p className="text-sm text-[#f5f0ea]/30 leading-relaxed mb-6">Café de spécialité, torréfié avec précision, sourcé en conscience.</p>
            <div className="space-y-2 text-sm text-[#f5f0ea]/40">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#c48a5a]" /> {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "75011", "Paris")}</div>
              <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33143000000").replace(/\s/g, "")}`} className="block hover:text-[#f5f0ea] transition-colors">{clientPhone(sessionData) ?? fd?.phone ?? "01 43 00 00 00"}</a>
              <a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "bonjour@torrefie.fr"}`} className="block hover:text-[#f5f0ea] transition-colors">{clientEmail(sessionData) ?? fd?.email ?? "bonjour@torrefie.fr"}</a>
            </div>
          </div>
          {[
            { title: "La boutique", links: ["Toutes les origines", "Abonnements", "Matériel", "Coffrets"] },
            { title: "Apprendre", links: ["Guides d'extraction", "Histoires d'origines", "La notation SCA", "Le journal"] },
            { title: "La maison", links: ["Notre histoire", "L'atelier", "Professionnels", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c48a5a] mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-[#f5f0ea]/30">
                {col.links.map(l => <li key={l}><Link href="#contact" className="hover:text-[#f5f0ea] transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-[#f5f0ea]/10 text-[10px] font-bold uppercase tracking-widest text-[#f5f0ea]/20 flex justify-between">
          <span>© 2026 {fd?.businessName ?? clientName(sessionData) ?? "Torréfié"}{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <span className="normal-case tracking-normal">Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /> · éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
        </div>
      </footer>
    </div>
  )
}
