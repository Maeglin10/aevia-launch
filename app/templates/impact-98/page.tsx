"use client";
// @ts-nocheck

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Watch, Zap, Diamond, ShieldCheck, Star, Globe, Mail, MapPin, ChevronRight, ArrowRight, X, Menu, Clock, Activity, Maximize, Settings, Compass, Shield, Award, Focus, Frame, Monitor, Share2, Lock, Search, ShoppingBag } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { ScrollSpin } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";

import "../premium.css";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
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

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================= */

function COLLECTIONS_SOURCE_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ name: o.title, category: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}), desc: o.desc || "" })), [
  {
    id: 1,
    name: "Astra Chrono",
    category: "Complications",
    price: "dès 12 500 €",
    desc: "Chronographe squelette anglé main, réserve de marche de 72 heures, fond saphir.",
    img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"),
  },
  {
    id: 2,
    name: "Deep Horizon",
    category: "Sport",
    price: "dès 4 800 €",
    desc: "Boîtier titane grade 5, étanche 30 bars, lunette céramique, bracelet interchangeable.",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80"),
  },
  {
    id: 3,
    name: "Legacy Perpetual",
    category: "Patrimoine",
    price: "dès 9 200 €",
    desc: "Quantième à phase de lune en or rose, réglé pour ne pas dévier avant 122 ans.",
    img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80"),
  },
]);
}
let COLLECTIONS_SOURCE = COLLECTIONS_SOURCE_LIVE();
let COLLECTIONS_DEMO = COLLECTIONS_SOURCE;

const CRAFTSMANSHIP = [
  {
    title: "Calibres finis main",
    desc: "Chaque pont est anglé à la main, chaque rouage poli miroir, à l'établi de l'atelier.",
    icon: Settings,
  },
  {
    title: "Métaux d'exception",
    desc: "Or contrôlé et poinçonné, titane grade 5, aciers durcis : des alliages choisis pour durer, pas pour briller six mois.",
    icon: Diamond,
  },
  {
    title: "Précision chronométrique",
    desc: "Chaque pièce est contrôlée sur banc de marche avant livraison, bulletin de test remis à l'acheteur.",
    icon: Clock,
  },
];

const AVIS_SOURCE = [
  { texte: "Ma montre de famille, arrêtée depuis vingt ans, repartie comme en 1962 — avec le bulletin de marche pour le prouver.", auteur: "Hélène M.", detail: "Restauration" },
  { texte: "On m'a déconseillé la pièce la plus chère de la vitrine, parce qu'elle n'allait pas à mon poignet. C'est ce jour-là qu'ils m'ont gagné.", auteur: "Franck D.", detail: "Conseil en boutique" },
  { texte: "Devis d'expertise précis, rachat au prix annoncé, virement le jour même. Rigoureux de bout en bout.", auteur: "Succession B.", detail: "Expertise & rachat" },
];
let AVIS_LISTE = AVIS_SOURCE;

const STATS_DEMO = [
  { label: "Composants par montre", value: "320+" },
  { label: "Horlogers à l'établi", value: "4" },
  { label: "Heures de contrôle", value: "120" },
  { label: "Ans de maison", value: "45" },
];
let STATS = STATS_DEMO;

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticBtn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    },
    [x, y],
  );

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================= */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ZenithWatchesPage() {
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
  COLLECTIONS_SOURCE = COLLECTIONS_SOURCE_LIVE();

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [COLLECTIONS_DEMO];
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
  COLLECTIONS_DEMO = resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ ...COLLECTIONS_SOURCE[i % COLLECTIONS_SOURCE.length], name: s.title , ...(s.price ? { price: s.price } : {})})), COLLECTIONS_SOURCE);
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  AVIS_LISTE = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Product collection ← client's business profile (falls back to demo).
  const COLLECTIONS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      id: i + 1,
      name: s.title ?? s.name,
      category: s.category ?? COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].category,
      price: s.price ?? COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].price,
      desc: s.description ?? COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].desc,
      img: COLLECTIONS_DEMO[i % COLLECTIONS_DEMO.length].img,
    })),
    COLLECTIONS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWatch, setActiveWatch] = useState<number | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="premium-theme min-h-dvh bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[var(--brand,#b08d3f)] selection:text-white overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-center">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <span className="i98-serif text-3xl font-black tracking-[0.14em] uppercase leading-none italic">
                  {fd?.businessName ?? clientName(sessionData) ?? "Zenith"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[var(--brand,#b08d3f)] -mt-1 ml-1">
                  {clientTrade(sessionData) ?? "Haute horlogerie"}
                </span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {[
              "Collections",
              "Complications",
              "Savoir-faire",
              "Maison",
              "Contact",
            ].map((link) => (
              <Link
                key={link}
                href="#collections"
                className="hover:text-[var(--brand,#b08d3f)] transition-colors cursor-pointer"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[var(--brand,#b08d3f)] transition-colors">
                Prendre rendez-vous
              </span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[var(--brand,#b08d3f)] group-hover:text-black group-hover:border-[var(--brand,#b08d3f)] transition-all">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[var(--brand,#b08d3f)]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40 hover:text-[var(--brand,#b08d3f)]"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-4 text-7xl font-black uppercase text-white/10">
              {["Collections", "Complications", "Atelier", "Contact"].map(
                (l) => (
                  <Link
                    key={l}
                    href="#collections"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[var(--brand,#b08d3f)] hover:translate-x-4 transition-all"
                  >
                    {l}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] flex items-center overflow-hidden pt-24 md:pt-0">
        <div className="absolute inset-0">
          <Image
            src={photo(3, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80")}
            alt="Watch Movement"
            fill
            className="object-cover opacity-40 mix-blend-luminosity grayscale contrast-150"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl md:text-[8rem] lg:text-[6rem] xl:text-[7.5rem] 2xl:text-[9.5rem] font-black leading-[0.95] md:leading-[0.75] tracking-tighter mb-12 uppercase text-white italic break-words">{<>{clientHeroLine(sessionData, 0, 2, 9) ?? "Dompter"}<br />{" "}
              <span className="text-[var(--brand,#b08d3f)] not-italic">{clientHeroLine(sessionData, 1, 2, 9) ?? "le temps."}</span>
            </>}</h1>
            <p className="max-w-md text-xl text-white/50 leading-relaxed font-light mb-12 tracking-wide">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
              La maîtrise mécanique du temps, assemblée et réglée à l'atelier.
              Pièces neuves, restaurations, et le service qui va avec.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <MagneticBtn className="px-12 py-5 bg-[var(--brand,#b08d3f)] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all cursor-pointer shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                Les pièces maîtresses
              </MagneticBtn>
              <Link
                href="#collections"
                className="px-12 py-5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
              >
                La collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="hidden lg:flex justify-end pr-12 relative">
            <Reveal delay={0.4}>
              {/* Geste de signature : ScrollSpin — le balancier n'a pas
                  d'horloge propre, c'est le défilement qui l'entraîne. La
                  boîte de suivi est plus haute que le dessin : le composant
                  mesure sa propre hauteur pour établir la course. */}
              <div style={{ minHeight: 520, display: "grid", placeItems: "center" }}>
                <ScrollSpin degrees={200}>
                  <div className="relative w-96 h-96 rounded-full border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-[var(--brand,#b08d3f)] rounded-full" />
                    <div className="absolute inset-6 rounded-full border border-white/10" />
                    {[...Array(12)].map((_, n) => (
                      <span key={n} aria-hidden className="absolute left-1/2 top-1/2 w-[1px] h-44 origin-top" style={{ transform: `rotate(${n * 30}deg)` }}>
                        <span className="block w-[1px] h-3 bg-white/25" />
                      </span>
                    ))}
                    <div className="text-center">
                      <span className="i98-serif text-5xl font-black italic block text-[var(--brand,#b08d3f)]">
                        Cal. 98
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                        Remontage manuel
                      </span>
                    </div>
                  </div>
                </ScrollSpin>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--brand,#b08d3f)] rounded-full blur-2xl opacity-20 animate-pulse" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="realisations" className="py-24 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#b08d3f)] mb-2">
                    {stat.label}
                  </div>
                  <div className="text-5xl font-black italic text-white">
                    {stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section id="collections" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 uppercase text-white">{/* TEXTE_SECTION */ clientText(sessionData, "collections.titre") ?? (<>
                  Les <br /> <span className="text-[var(--brand,#b08d3f)]">pièces.</span>
                </>)}</h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                  {/* TEXTE_SECTION */ clientText(sessionData, "collections.legende") ?? (<>Assemblées, réglées et garanties par la maison</>)}
                </p>
              </div>
              <Link
                href="#collections"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#b08d3f)] border-b border-[var(--brand,#b08d3f)] pb-2 hover:text-white hover:border-white transition-all"
              >
                Recevoir le catalogue
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {COLLECTIONS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <div
                  className="group space-y-10 cursor-pointer"
                  onMouseEnter={() => setActiveWatch(item.id)}
                  onMouseLeave={() => setActiveWatch(null)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1s]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/50 backdrop-blur-md text-white border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                        {item.category}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeWatch === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-[var(--brand,#b08d3f)]/10 backdrop-blur-[2px]"
                        >
                          <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">
                            Voir la fiche
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic group-hover:text-[var(--brand,#b08d3f)] transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-lg font-black text-[var(--brand,#b08d3f)] tracking-tighter">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 font-light leading-relaxed tracking-wide">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-[var(--brand,#b08d3f)]/20 transition-all" />
                      <Settings className="w-5 h-5 text-white/10 group-hover:text-[var(--brand,#b08d3f)] transition-all" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAVOIR-FAIRE ── */}
      <section id="contact" className="py-40 bg-[#0d0d0d] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[var(--brand,#b08d3f)]/5 blur-[120px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#b08d3f)] mb-8 block">
                {clientEyebrow(sessionData) ?? "L'atelier"}
              </span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Le{" "}
                <span className="text-[var(--brand,#b08d3f)] not-italic">savoir-faire.</span>
              </>)}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {CRAFTSMANSHIP.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-16 border border-white/5 bg-white/[0.01] hover:border-[var(--brand,#b08d3f)]/30 transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-[var(--brand,#b08d3f)] mb-10 group-hover:bg-[var(--brand,#b08d3f)] group-hover:text-black transition-all duration-500">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter text-white group-hover:translate-x-2 transition-transform">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/40 font-light leading-relaxed mb-12 flex-1 tracking-wide">
                    {s.desc}
                  </p>
                  <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#b08d3f)] group-hover:gap-6 transition-all">
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE HERITAGE ── */}
      <section className="py-40 px-6 md:px-12 bg-black">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-white/5">
              <Image
                src={photo(4, "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80")}
                alt="Vintage Heritage"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-[2s] mix-blend-luminosity grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-16 left-16 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-[var(--brand,#b08d3f)]">
                  {/* TEXTE_SECTION */ clientText(sessionData, "maison.depuis") ?? (<>La maison</>)}
                </span>
                <h4 className="i98-serif text-5xl font-black italic uppercase tracking-tighter leading-none text-[var(--brand,#b08d3f)]">
                  L'or, <br /> en héritage.
                </h4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#b08d3f)] mb-8 block">
              La philosophie
            </span>
            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] mb-12 uppercase text-white">{/* TEXTE_SECTION */ clientText(sessionData, "maison.titre") ?? c?.aboutTitle ?? <>
              Le battement <br />{" "}
              <span className="text-[var(--brand,#b08d3f)] not-italic">juste.</span>
            </>}</h2>
            <p className="text-white/40 text-xl leading-relaxed mb-16 font-light tracking-wide">{/* TEXTE_SECTION */ clientText(sessionData, "maison.texte") ?? c?.aboutText ?? <>
              Nous ne vendons pas des montres : nous réglons des battements.
              Chaque pièce qui sort de l'atelier est ajustée, contrôlée sur
              banc, et suivie toute sa vie.
            </>}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {(clientList(sessionData, "maison.garanties") ?? clientCertifications(sessionData) ?? [
                "Poinçon or contrôlé — bureau de garantie",
                "Garantie 5 ans, mouvement et étanchéité",
                "Atelier de réparation agréé toutes marques",
                "Expertise et rachat sur estimation écrite",
              ]).slice(0, 4).map((txt: string, i: number) => ({ icon: [Compass, Shield, Globe, Award][i % 4], label: String(txt).split("—")[0].split(",")[0], desc: String(txt) })).map((val, i) => (
                <div key={i} className="space-y-4">
                  <val.icon className="w-6 h-6 text-[var(--brand,#b08d3f)]" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                    {val.label}
                  </h4>
                  <p className="text-[10px] font-light text-white/30 uppercase tracking-widest leading-loose">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
            <MagneticBtn className="mt-20 px-14 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[var(--brand,#b08d3f)] hover:text-white transition-all shadow-2xl">
              Rendez-vous privé en boutique
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── LA CLIENTÈLE — la confiance, à voix basse ── */}
      <section id="avis" className="py-32 px-6 md:px-12 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#b08d3f)] mb-6 block">
                La clientèle
              </span>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
                Ils reviennent <span className="text-[var(--brand,#b08d3f)] not-italic">pour l'établi.</span>
              </>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {AVIS_LISTE.map((a: any, i: number) => (
              <Reveal key={`${a.auteur}-${i}`} delay={i * 0.1}>
                <figure className="h-full m-0 p-10 border border-white/5 bg-white/[0.02] hover:border-[var(--brand,#b08d3f)]/40 transition-all duration-500 flex flex-col">
                  <span className="i98-serif text-6xl leading-none text-[var(--brand,#b08d3f)]/60 select-none" aria-hidden>«</span>
                  <blockquote className="i98-serif italic text-lg text-white/70 leading-relaxed mt-2 mb-8 flex-1">{a.texte}</blockquote>
                  <figcaption className="pt-6 border-t border-white/10">
                    <div className="text-[11px] font-black uppercase tracking-widest text-white">{a.auteur}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#b08d3f)] mt-2">{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] pt-40 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-32 mb-40">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-col mb-12">
                <span className="i98-serif text-5xl font-black tracking-[0.14em] uppercase leading-none italic">
                  {fd?.businessName ?? clientName(sessionData) ?? "Zenith"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#b08d3f)] -mt-1 ml-1">
                  {clientTrade(sessionData) ?? "Haute horlogerie"} · {clientCity(sessionData) ?? "Nice"}
                </span>
              </div>
              <p className="text-white/30 max-w-md mb-16 text-[12px] tracking-wide leading-loose">
                {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "06000", "Nice") + ", boutique sur rendez-vous"}
                <br />
                {(clientPhone(sessionData) ?? fd?.phone ?? "04 93 00 00 00") + " · " + (clientEmail(sessionData) ?? fd?.email ?? "atelier@zenith-horlogerie.fr")}
              </p>
              <div className="flex gap-6">
                {[Globe, Globe, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[var(--brand,#b08d3f)] hover:text-black hover:border-[var(--brand,#b08d3f)] transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--brand,#b08d3f)] mb-12">
              Collection
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  La collection Astra
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Les plongeuses
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  La ligne Patrimoine
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Pièces sur mesure
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--brand,#b08d3f)] mb-12">
              Atelier
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Le mouvement
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Les finitions
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Le contrôle
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  Les matières
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--brand,#b08d3f)] mb-12">
              Maison
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  La maison
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  La boutique
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  L'entretien
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-white transition-colors">
                  La presse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
          <div className="flex items-center gap-12">
            <span>
              &copy; {new Date().getFullYear()} {fd?.businessName ?? clientName(sessionData) ?? "Zenith"}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
          </div>
          <div className="flex gap-8 normal-case tracking-normal">
            <span>Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
            <span>Éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500;1,700;1,900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .premium-theme { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .i98-serif, .premium-theme h1, .premium-theme h2 { font-family: 'Playfair Display', Georgia, serif; }
        ::-webkit-scrollbar{width:4px;background:#050505}
        ::-webkit-scrollbar-thumb{background:var(--brand,#b08d3f)}
      `}</style>

    </div>
  );
}
