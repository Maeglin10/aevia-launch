"use client";
// @ts-nocheck
/*
  impact-100 — Nova, architecture d'intérieur. Francisé et recentré : le
  studio spatial anglophone devient l'atelier d'architecture intérieure
  vendu au catalogue. Les dix-huit sous-pages coquilles sont résorbées en
  redirections vers les ancres de cette page.
  Héros H2 : split média gauche — la photo du lieu à gauche, le titre à
  droite, et la suspension dessinée qui tourne au défilement (ScrollSpin,
  application : le luminaire ; 98 le porte sur un cadran de montre).
  Fontes P11 EB Garamond + Outfit · palette #f8f6f2 / #6b5942.
*/

import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, Mail, ChevronRight, ArrowRight, X, Menu, Box, Home, Layers, PencilLine, Ruler, Phone, MapPin, Layout } from "lucide-react";
import { ScrollSpin } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { resolveList } from "@/lib/templates/resolveList";
import {
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
  clientStats,
  clientText,
  clientWorks,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

import "../premium.css";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;

/* ==========================================================================
   DONNÉES
   ========================================================================= */

function PROJECTS_DEMO_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ name: o.title, location: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}), desc: o.desc || "" })), [
  {
    id: 1,
    name: "L'appartement Obsidienne",
    category: "Résidentiel",
    location: (clientCity(sessionData) ?? "Lyon"),
    desc: "Une étude en camaïeu minéral : béton ciré, chêne de récupération, et le calme d'un plan enfin juste.",
    img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80"),
  },
  {
    id: 2,
    name: "Les bureaux Lumière",
    category: "Tertiaire",
    location: (clientCity(sessionData) ?? "Lyon"),
    desc: "Un plateau repensé par la lumière : briques de verre acoustiques et circulations qui ne se croisent plus.",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"),
  },
  {
    id: 3,
    name: "La maison Aura",
    category: "Hôtellerie",
    location: "Annecy",
    desc: "Cinq chambres d'hôtes où chaque seuil ménage une transition — du bruit du monde au silence de la chambre.",
    img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200&q=80"),
  },
]);
}
let PROJECTS_DEMO = PROJECTS_DEMO_LIVE();

const PHILOSOPHY_SOURCE = [
  {
    title: "Le plan avant le décor",
    desc: "On redessine d'abord les circulations, la lumière et les usages. Le mobilier vient ensuite — jamais l'inverse.",
    icon: Layout,
  },
  {
    title: "La vérité des matériaux",
    desc: "Pierre, bois, métal choisis à la source, posés sans maquillage. Ce qui est beau à dix ans l'était déjà nu.",
    icon: Box,
  },
  {
    title: "La lumière comme matériau",
    desc: "L'éclairage n'est pas une finition : c'est la première matière du projet, dessinée dès l'esquisse.",
    icon: Sparkles,
  },
];
let PHILOSOPHY = PHILOSOPHY_SOURCE;

const STATS_DEMO = [
  { label: "Lieux transformés", value: "140+" },
  { label: "Années de pratique", value: "12" },
  { label: "Artisans partenaires", value: "85" },
  { label: "Clients qui reviennent", value: "98 %" },
];
let STATS = STATS_DEMO;

/* ==========================================================================
   COMPOSANTS UTILITAIRES
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

/* La suspension — le luminaire dessiné qui tourne au défilement. */
function Suspension() {
  return (
    <div aria-hidden className="flex flex-col items-center">
      <div className="w-px h-24 bg-[#221c15]/30" />
      <div
        className="w-40 h-40 rounded-full border border-[#6b5942]/40 relative"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(107,89,66,0.28) 0deg 2deg, transparent 2deg 30deg)",
        }}
      >
        <div className="absolute inset-6 rounded-full border border-[#6b5942]/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#6b5942]" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE PRINCIPALE
   ========================================================================= */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}
export default function NovaSpacesPage() {
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
  PROJECTS_DEMO = PROJECTS_DEMO_LIVE();

  PHILOSOPHY = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...PHILOSOPHY_SOURCE[i % PHILOSOPHY_SOURCE.length], title: s.title, desc: s.desc || PHILOSOPHY_SOURCE[i % PHILOSOPHY_SOURCE.length].desc, prix: s.price || undefined })),
    PHILOSOPHY_SOURCE,
  );

  STATS = resolveList(clientStats(session), STATS_DEMO);
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const PROJECTS = resolveList(
    bp?.beforeAfter?.map((b: any, i: number) => ({
      id: i + 1,
      name: b.caption ?? PROJECTS_DEMO[i % PROJECTS_DEMO.length].name,
      category: PROJECTS_DEMO[i % PROJECTS_DEMO.length].category,
      location: b.location ?? PROJECTS_DEMO[i % PROJECTS_DEMO.length].location,
      desc: b.caption ?? PROJECTS_DEMO[i % PROJECTS_DEMO.length].desc,
      img: b.afterUrl || b.beforeUrl || PROJECTS_DEMO[i % PROJECTS_DEMO.length].img,
    })),
    PROJECTS_DEMO
  );

  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
    [
      { text: "L'atelier a rendu ses proportions à un appartement qu'on croyait condamné au couloir sombre.", author: "Famille Berthier", detail: "rénovation résidentielle" },
      { text: "Le chantier a duré onze semaines — celles annoncées. C'est assez rare pour être écrit ici.", author: "M. Costa", detail: "plateau de bureaux" },
      { text: "Chaque luminaire semble avoir toujours été là. C'est exactement ce qu'on leur avait demandé : rien de spectaculaire, tout de juste.", author: "Claire & Antoine", detail: "maison de famille" },
    ],
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const ville = clientCity(sessionData) ?? "Lyon";
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "04 72 40 18 62";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "atelier@nova-interieurs.fr";

  return (
    <div className="i100 premium-theme min-h-dvh bg-[#f8f6f2] text-[#221c15] selection:bg-[#221c15] selection:text-white overflow-x-clip" style={{ fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');
        .i100 h1, .i100 h2, .i100 h3, .i100 h4, .i100 .titre { font-family: 'EB Garamond', Georgia, serif; }
      `}</style>
      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#f8f6f2]/90 backdrop-blur-2xl py-4 border-b border-black/5" : "bg-transparent py-8"}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="group flex flex-col items-start">
            {fd?.logoBase64 ? (
              <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
            ) : (
              <>
                <span className="titre text-3xl font-medium tracking-[0.25em] uppercase leading-none">
                  {clientName({ formData: fd }) ?? "Nova"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/30 mt-1">
                  Architecture d'intérieur
                </span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">
            {[["Réalisations", "#work"], ["Méthode", "#methode"], ["Atelier", "#atelier"], ["Contact", "#contact"]].map(
              ([link, ancre]) => (
                <Link
                  key={link}
                  href={ancre}
                  className="hover:text-[#6b5942] transition-colors cursor-pointer"
                >
                  {link}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-8">
            <Link href="#contact" className="hidden md:flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
                Lancer un projet
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/40 group-hover:bg-[#6b5942] group-hover:text-white group-hover:border-[#6b5942] transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-black p-2"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            className="fixed inset-0 z-[100] bg-[#f8f6f2] p-12 flex flex-col justify-center gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-black/40 p-2"
              aria-label="Fermer"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-4 text-6xl titre font-medium uppercase text-black/15">
              {[["Réalisations", "#work"], ["Méthode", "#methode"], ["Atelier", "#atelier"], ["Contact", "#contact"]].map(([l, a]) => (
                <Link
                  key={l}
                  href={a}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#6b5942] hover:translate-x-4 transition-all"
                >
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HÉROS — H2 : la photo à gauche, le titre à droite ── */}
      <section id="hero" className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-16 md:pt-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden border border-black/5 bg-[#ece7dd]">
                <Image
                  src={photo(3, "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80")}
                  alt="Intérieur signé par l'atelier"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f2]/30 to-transparent" />
                {/* La suspension tourne pendant que le héros défile. */}
                <div className="absolute -right-0 top-0 hidden md:block">
                  <ScrollSpin degrees={140}>
                    <Suspension />
                  </ScrollSpin>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.15}>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#6b5942] block mb-8">
                  {clientEyebrow(sessionData) ?? `Architecture d'intérieur · ${ville}`}
                </span>
                <h1 className="hero-ecran-court text-5xl sm:text-6xl md:text-7xl xl:text-[7.5rem] font-medium leading-[0.98] tracking-tight mb-10 text-black">{<>{clientHeroLine(sessionData, 0, 2, 12) ?? "Le silence"}<br />{" "}
                  <em className="font-medium">{clientHeroLine(sessionData, 1, 2, 12) ?? "de l'espace."}</em>
                </>}</h1>
                <p className="max-w-md text-lg text-black/50 leading-relaxed font-light mb-12">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                  L'atelier redessine les lieux par le plan, la matière et la lumière — pas par l'accumulation d'objets.
                </>}</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="#work" className="px-12 py-5 bg-[#221c15] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#6b5942] transition-all text-center">
                    Voir les lieux livrés
                  </Link>
                  <Link
                    href="#contact"
                    className="px-12 py-5 border border-black/20 text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#221c15] hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    Lancer un projet <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES ── */}
      <section id="realisations" className="py-24 border-y border-black/5 bg-[#fdfbf7]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-2">
                    {stat.label}
                  </div>
                  <div className="titre text-5xl font-medium italic text-[#6b5942]">
                    {stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LES LIEUX ── */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div>
                <h2 className="titre text-7xl md:text-[9rem] font-medium tracking-tight leading-none mb-6 text-black">{/* TEXTE_SECTION */ clientText(sessionData, "work.titre") ?? (<>
                  Les lieux<br /> <em>livrés.</em>
                </>)}</h2>
                <p className="text-black/25 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Index des projets // Architecture intérieure
                </p>
              </div>
              <Link
                href="#contact"
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-2 hover:text-[#6b5942] hover:border-[#6b5942] transition-all"
              >
                Visiter sur rendez-vous
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PROJECTS.map((item, i) => (
              <Reveal key={item.id ?? i} delay={i * 0.1}>
                <div
                  className="group space-y-10 cursor-pointer"
                  onMouseEnter={() => setActiveProject(item.id)}
                  onMouseLeave={() => setActiveProject(null)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-[1.5s] bg-[#ece7dd]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-[#f8f6f2]/30 group-hover:bg-transparent transition-colors duration-700" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/60 backdrop-blur-md text-black border-black/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                        {item.category}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeProject === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]"
                        >
                          <span className="px-10 py-4 bg-[#221c15] text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                            Voir le lieu
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline gap-4">
                      <h3 className="titre text-4xl font-medium tracking-tight text-black italic group-hover:translate-x-2 transition-transform">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/25 whitespace-nowrap">
                        {item.location}
                      </span>
                    </div>
                    <p className="text-sm text-black/45 font-light leading-loose">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-black/5" />
                      <Ruler className="w-5 h-5 text-black/10 group-hover:text-[#6b5942] transition-all" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA MÉTHODE ── */}
      <section id="methode" className="py-40 bg-[#fdfbf7] overflow-hidden relative border-t border-black/5">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-[#6b5942]/5 blur-[120px] rounded-full" aria-hidden />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-8 block">
                Ce que l'atelier prend en charge
              </span>
              <h2 className="titre text-6xl md:text-8xl font-medium italic tracking-tight">{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Trois <em className="not-italic font-semibold text-[#6b5942]">convictions.</em>
              </>)}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {PHILOSOPHY.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 lg:p-16 border border-black/5 bg-black/[0.01] hover:border-[#6b5942]/40 transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/40 mb-10 group-hover:bg-[#6b5942] group-hover:text-white transition-all duration-500">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="titre text-3xl font-medium mb-6 tracking-tight text-black group-hover:translate-x-2 transition-transform">
                    {s.title}
                  </h3>
                  <p className="text-sm text-black/45 font-light leading-loose mb-12 flex-1">
                    {s.desc}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <Link href="#contact" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/60 group-hover:text-[#6b5942] group-hover:gap-6 transition-all">
                      En parler <ArrowRight className="w-4 h-4" />
                    </Link>
                    {s.prix ? <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b5942] whitespace-nowrap">{s.prix}</span> : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'ATELIER ── */}
      <section id="atelier" className="py-40 px-6 md:px-12 bg-[#f8f6f2]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-sm overflow-hidden group border border-black/5 bg-[#ece7dd]">
              <Image
                src={photo(4, "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80")}
                alt="L'atelier au travail"
                fill
                className="object-cover group-hover:scale-110 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f2] via-transparent to-transparent" />
              <div className="absolute bottom-16 left-16 text-black">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block text-black/40">
                  L'atelier
                </span>
                <h4 className="titre text-5xl font-medium italic tracking-tight leading-none">
                  Dessiner, <br /> puis tenir.
                </h4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-8 block">
              La conduite du projet
            </span>
            <h2 className="titre text-6xl md:text-8xl font-medium italic tracking-tight leading-[0.9] mb-12 text-black">{c?.aboutTitle ?? <>
              L'ordre <br />{" "}
              <em className="not-italic font-semibold text-[#6b5942]">des choses.</em>
            </>}</h2>
            <p className="text-black/50 text-xl leading-relaxed mb-16 font-light">{c?.aboutText ?? <>
              Au-delà du décor : nous ré-agençons la structure même de l'habiter — relevé, esquisse, carnet de matériaux, chantier suivi chaque semaine jusqu'à la réception.
            </>}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  icon: Compass,
                  label: "Le relevé",
                  desc: "Mesures, orientation, lumière",
                },
                {
                  icon: PencilLine,
                  label: "Le sur-mesure",
                  desc: "Mobilier dessiné à l'atelier",
                },
                { icon: Home, label: "Le résidentiel", desc: "Appartements & maisons" },
                { icon: Layers, label: "Les matières", desc: "Carnet unique par projet" },
              ].map((val, i) => (
                <div key={i} className="space-y-4">
                  <val.icon className="w-6 h-6 text-[#6b5942]" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {val.label}
                  </h4>
                  <p className="text-sm font-light text-black/40 leading-loose">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ILS HABITENT NOS PLANS (AVIS) ── */}
      <section className="py-32 px-6 md:px-12 bg-[#fdfbf7] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="titre text-5xl md:text-7xl font-medium italic tracking-tight mb-24">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ils habitent <em className="not-italic font-semibold text-[#6b5942]">nos plans.</em></>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {AVIS.map((a: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="h-full flex flex-col">
                  <blockquote className="titre text-2xl font-medium italic text-black/70 leading-relaxed mb-8 flex-1">« {a.text} »</blockquote>
                  <figcaption className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 border-t border-black/10 pt-6">
                    {a.author}{a.detail ? <span className="block mt-2 text-[#6b5942]">{a.detail}</span> : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-40 px-6 md:px-12 bg-[#221c15] text-[#f8f6f2]">
        <div className="max-w-[1000px] mx-auto text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c2ab8d] block mb-8">
              Lancer un projet
            </span>
            <h2 className="titre text-6xl md:text-8xl font-medium italic tracking-tight mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Parlons du <em className="not-italic font-semibold text-[#c2ab8d]">lieu.</em>
            </>)}</h2>
            <p className="text-[#f8f6f2]/60 text-xl font-light leading-relaxed mb-16 max-w-xl mx-auto">
              Une visite, un relevé, une première esquisse chiffrée : le projet commence par une conversation à l'atelier ou chez vous.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <a href={telHref} className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#f8f6f2] text-[#221c15] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#c2ab8d] transition-all">
                <Phone className="w-4 h-4" /> {tel}
              </a>
              <a href={`mailto:${mail}`} className="inline-flex items-center justify-center gap-3 px-12 py-5 border border-white/20 text-[#f8f6f2] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4" /> {mail}
              </a>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f8f6f2]/40 flex items-center justify-center gap-3">
              <MapPin className="w-4 h-4" /> {clientCodePostalVille(sessionData, "69001", "Lyon")} · reçoit sur rendez-vous
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ── */}
      <footer className="bg-[#fdfbf7] pt-40 pb-16 px-6 md:px-12 border-t border-black/5">
        {/* gap-32 × 11 interstices dépassait la largeur du conteneur : les
            pistes s'écrasaient et la dernière colonne sortait du cadre. */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-col mb-12">
                <span className="titre text-4xl font-medium tracking-[0.25em] uppercase leading-none">
                  {clientName(sessionData) ?? "Nova"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mt-2">
                  Architecture d'intérieur
                </span>
              </div>
              <p className="text-black/40 max-w-md mb-16 text-sm font-light leading-loose">
                Un atelier d'architecture intérieure attaché à la justesse des plans, à la vérité des matériaux et au silence des lieux bien faits.
              </p>
              <div className="flex gap-6">
                <a href={telHref} aria-label="Téléphone" className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:bg-[#6b5942] hover:text-white hover:border-[#6b5942] transition-all">
                  <Phone className="w-5 h-5" />
                </a>
                <a href={`mailto:${mail}`} aria-label="Courriel" className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:bg-[#6b5942] hover:text-white hover:border-[#6b5942] transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              Projets
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/30">
              {[["Résidentiel", "#work"], ["Tertiaire", "#work"], ["Hôtellerie", "#work"], ["Mobilier", "#atelier"]].map(([l, a]) => (
                <li key={l}>
                  <Link href={a} className="hover:text-black transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              Méthode
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/30">
              {[["Le plan", "#methode"], ["Les matières", "#methode"], ["La lumière", "#methode"], ["Le chantier", "#atelier"]].map(([l, a]) => (
                <li key={l}>
                  <Link href={a} className="hover:text-black transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-12">
              L'atelier
            </h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-black/30">
              <li><a href={telHref} className="hover:text-black transition-colors">{tel}</a></li>
              {/* Style inline : l'interlettrage hérité rendait le courriel
                  insécable plus large que sa colonne (mesuré : +16 px). */}
              <li style={{ wordBreak: "break-all", letterSpacing: 0, textTransform: "none", minWidth: 0 }}><a href={`mailto:${mail}`} className="hover:text-black transition-colors" style={{ wordBreak: "break-all", letterSpacing: 0, textTransform: "none" }}>{mail}</a></li>
              <li>{clientCodePostalVille(sessionData, "69001", "Lyon")}</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-black/25">
          <span>
            © {clientName(sessionData) ?? "Nova"}{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""} · Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
          </span>
          <div className="flex gap-8">
            <Link href="#contact" className="hover:text-black transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-black transition-colors">CGV</Link>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar{width:4px;background:#f8f6f2}
        ::-webkit-scrollbar-thumb{background:#221c15}
      `}</style>
    </div>
  );
}
