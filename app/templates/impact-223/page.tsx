"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ShieldCheck, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Menu, Wrench, Award, Users, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"

/* ═══════════════════════════════════════════════════════════════════════════
   VOLTPRO ÉLECTRICITÉ — Électricien professionnel (France)
   Palette : noir profond / jaune électrique / blanc
   Fonts : Syne (titles) + Space Mono (accents)
   Style : dark industrial, high-contrast, Tailwind Reveal
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 40, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
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

// "À propos" was in both navigations with no section behind it.
const APROPOS = [
  { k: "2009", t: "Deux électriciens, un utilitaire", d: "Karim Sadaoui et Bruno Vermeil se rencontrent sur un chantier de Nanterre. Ils partent à deux, avec un Kangoo et un fichier client vide." },
  { k: "2014", t: "Qualification RGE", d: "Obtention de la mention RGE, qui ouvre les aides à la rénovation à nos clients. Première embauche la même année." },
  { k: "2019", t: "L'atelier de Gennevilliers", d: "Un local à nous : stock de câble, tableaux préparés à l'avance, un dépannage qui ne dépend plus des horaires d'un grossiste." },
  { k: "Aujourd'hui", t: "Onze personnes, un seul métier", d: "Neuf électriciens, deux à l'atelier. Aucune sous-traitance : celui qui vient chez vous est salarié, et il revient si quelque chose ne va pas." },
];

const SERVICES_DEMO = [
  { icon: Zap, title: "Installation électrique", desc: "Tableaux de distribution, câblage neuf, mise aux normes NF C 15-100. Habitat individuel et collectif." },
  { icon: ShieldCheck, title: "Mise en conformité", desc: "Diagnostic CONSUEL, rapport de vérification, levée des réserves. Attestations pour vente ou location." },
  { icon: Wrench, title: "Dépannage 7j/7", desc: "Disjoncteur sauté, panne totale, court-circuit. Intervention sous 2h dans un rayon de 30 km." },
  { icon: Zap, title: "Domotique & Smart Home", desc: "Volets connectés, éclairage scénique, thermostat Netatmo, borne de recharge IRVE pour véhicule électrique." },
  { icon: ShieldCheck, title: "Éclairage intérieur/extérieur", desc: "LED basse consommation, spots encastrés, éclairage de sécurité, illumination de façade et terrasse." },
  { icon: Wrench, title: "Chantiers neufs & rénovation", desc: "Accompagnement complet de la conception au CONSUEL. Plans, devis gratuit sous 24h, suivi chantier." },
]

const REALIZATIONS_DEMO = [
  { label: "Villa contemporaine · 280 m²", tag: "Installation complète", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200" },
  { label: "Immeuble 12 logements · Bordeaux", tag: "Mise en conformité NFC15-100", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200" },
  { label: "Commerce · Cuisine industrielle", tag: "Triphasé + TGBT", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" },
]

const STEPS = [
  { num: "01", title: "Devis gratuit sous 24h", desc: "Prise de contact, visite technique si nécessaire, chiffrage précis et transparent. Sans engagement." },
  { num: "02", title: "Planification", desc: "Choix des matériaux, planning d'intervention, coordination avec les autres corps de métier si besoin." },
  { num: "03", title: "Exécution soignée", desc: "Travail propre, matériaux certifiés NF, respect des délais. Votre domicile remis en état après chantier." },
  { num: "04", title: "CONSUEL & garantie", desc: "Attestation de conformité CONSUEL, garantie décennale, disponibilité en cas de question post-chantier." },
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
export default function VoltProPage() {
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [REALIZATIONS_DEMO];
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
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const SERVICES = resolveList(
    bp?.services?.map((s: any, i: number) => ({
      icon: SERVICES_DEMO[i % SERVICES_DEMO.length].icon,
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
    })),
    SERVICES_DEMO
  );
  const REALIZATIONS = resolveList(
    bp?.beforeAfter?.map((r: any, i: number) => ({
      label: r.caption ?? REALIZATIONS_DEMO[i % REALIZATIONS_DEMO.length].label,
      tag: REALIZATIONS_DEMO[i % REALIZATIONS_DEMO.length].tag,
      img: r.afterUrl ?? r.beforeUrl ?? REALIZATIONS_DEMO[i % REALIZATIONS_DEMO.length].img,
    })),
    REALIZATIONS_DEMO
  );
  const TESTIMONIALS = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any, i: number) => ({
      quote: r.text ?? r.quote,
      name: r.name ?? r.author,
      loc: r.location ?? "",
      stars: r.stars ?? 5,
    })),
    [
      { quote: "Intervention rapide après une panne totale la veille d'un réveillon. Professionnel, rassurant, tarif transparent. Je ne ferai appel qu'à VoltPro.", name: "Marie-France D.", loc: "Vincennes (94)", stars: 5 },
      { quote: "Mise aux normes complète de notre maison des années 70. Le rapport CONSUEL a été obtenu sans réserve du premier coup. Travail impeccable.", name: "Thierry K.", loc: "Roissy-en-Brie (77)", stars: 5 },
      { quote: "Installation de 4 bornes IRVE pour notre parking de copropriété. Coordination parfaite avec le syndic, délais tenus. Vraiment sérieux.", name: "Sylvie & Jean-Pierre N.", loc: "Montreuil (93)", stars: 5 },
    ]
  );

  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#080a0c] text-white min-h-dvh overflow-x-hidden" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#080a0c]/95 backdrop-blur-xl border-b border-[var(--brand,#facc15)]/10 py-3" : "bg-transparent py-7"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-[var(--brand,#facc15)] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black fill-black" />
                </div>
                <span className="text-lg font-extrabold tracking-[0.15em] uppercase">VoltPro</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
            {[
              { label: "Services", href: "#services" },
              { label: "Réalisations", href: "#realisations" },
              { label: "À propos", href: "#apropos" },
              { label: "Zone d'intervention", href: "#zone" },
              { label: "Contact", href: "#contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="hover:text-[var(--brand,#facc15)] transition-colors">{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${fd?.phone ?? "0612345678"}`} className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--brand,#facc15)] uppercase">
              <Phone className="w-3 h-3" /> {fd?.phone ?? "06 12 34 56 78"}
            </a>
            <button className="hidden md:block px-6 py-2.5 bg-[var(--brand,#facc15)] text-black text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#080a0c] border-[var(--brand,#facc15)]/10 p-10">
                <div className="flex flex-col gap-8 mt-16">
                  {[
                    { label: "Services", href: "#services" },
                    { label: "Réalisations", href: "#realisations" },
                    { label: "À propos", href: "#apropos" },
                    { label: "Contact", href: "#contact" },
                  ].map(({ label, href }) => (
                    <Link key={label} href={href} className="text-3xl font-extrabold uppercase tracking-widest hover:text-[var(--brand,#facc15)] transition-colors">{label}</Link>
                  ))}
                  <a href={`tel:${fd?.phone ?? "0612345678"}`} className="flex items-center gap-3 text-[var(--brand,#facc15)] font-bold text-lg mt-4">
                    <Phone className="w-5 h-5" /> {fd?.phone ?? "06 12 34 56 78"}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section id="hero" className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image
              src={photo(0, "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=85&w=2400")}
              alt="Électricien au travail sur tableau électrique"
              fill className="object-cover opacity-50" priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c] via-[#080a0c]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/60 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-28">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-12 bg-[var(--brand,#facc15)]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Électricien certifié RGE · Île-de-France</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30" style={{ fontFamily: "'Space Mono', monospace" }}>Particuliers & professionnels · Depuis 2009</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12} y={60}>
              <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[9rem] font-extrabold tracking-tighter leading-[0.85] uppercase mb-8 break-words">{c?.heroHeadline ?? <>
                L'électricité<br />sans<br /><span className="text-[var(--brand,#facc15)]">compromis.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="max-w-xl text-base md:text-lg text-white/45 leading-relaxed mb-10" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.82rem" }}>{c?.heroSubline ?? fd?.tagline ?? <>
                Installation, mise en conformité, domotique et dépannage 7j/7. Devis gratuit sous 24h, intervention soignée, attestation CONSUEL garantie.
              </>}</p>
            </Reveal>
            <Reveal delay={0.38}>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-[var(--brand,#facc15)] text-black font-extrabold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors duration-300">{c?.ctaText ?? <>
                  Devis Gratuit
                </>}</button>
                <a href={`tel:${fd?.phone ?? "0612345678"}`} className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white/70 font-bold uppercase tracking-[0.15em] text-[10px] hover:border-[var(--brand,#facc15)]/50 hover:text-[var(--brand,#facc15)] transition-all duration-300">
                  <Phone className="w-4 h-4" /> Appeler maintenant
                </a>
              </div>
            </Reveal>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20" style={{ fontFamily: "'Space Mono', monospace" }}>scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-[1px] h-8 bg-gradient-to-b from-[var(--brand,#facc15)]/50 to-transparent" />
          </div>
        </section>

        {/* ── URGENCE BANNER ── */}
        <section className="bg-[var(--brand,#facc15)] py-5">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-black fill-black" />
              <span className="text-black font-extrabold text-sm uppercase tracking-widest">Dépannage d'urgence disponible 24h/24 — 7j/7</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-black font-bold text-sm">
                <Clock className="w-4 h-4" /> Intervention &lt; 2h
              </div>
              <a href={`tel:${fd?.phone ?? "0612345678"}`} className="bg-black text-[var(--brand,#facc15)] px-6 py-2 font-extrabold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                {fd?.phone ?? "06 12 34 56 78"}
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "15+", l: "Années d'expérience" },
              { v: "1 200+", l: "Chantiers réalisés" },
              { v: "4.9★", l: "Note Google" },
              { v: "100%", l: "Attestations CONSUEL" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center border border-white/5 p-8 hover:border-[var(--brand,#facc15)]/20 transition-colors duration-500">
                  <div className="text-4xl font-extrabold text-[var(--brand,#facc15)] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Ce que nous faisons</span>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Nos <span className="text-[var(--brand,#facc15)]">prestations.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {SERVICES.map((s, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="bg-[#080a0c] p-10 group hover:bg-[#0f1214] transition-colors duration-500 h-full flex flex-col gap-6">
                    <div className="w-12 h-12 border border-[var(--brand,#facc15)]/20 flex items-center justify-center group-hover:bg-[var(--brand,#facc15)] group-hover:border-[var(--brand,#facc15)] transition-all duration-500">
                      <s.icon className="w-5 h-5 text-[var(--brand,#facc15)] group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold uppercase tracking-tight mb-3 group-hover:text-[var(--brand,#facc15)] transition-colors">{s.title}</h3>
                      <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#facc15)]/0 group-hover:text-[var(--brand,#facc15)] transition-colors duration-500">
                      En savoir plus <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── RÉALISATIONS ── */}
        <section id="realisations" className="py-32 bg-[#05070a]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Portfolio</span>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Nos <span className="text-[var(--brand,#facc15)]">réalisations.</span></h2>
                </div>
                <button className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[var(--brand,#facc15)] transition-colors">
                  Voir tout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {REALIZATIONS.map((r, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group relative aspect-[4/3] overflow-hidden cursor-pointer">
                    <ParallaxImg src={r.img} alt={r.label} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-[var(--brand,#713f12)]/60 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#facc15)] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>{r.tag}</div>
                      <h3 className="text-lg font-extrabold uppercase tracking-tight text-white">{r.label}</h3>
                    </div>
                    <div className="absolute top-6 right-6 w-10 h-10 border border-[var(--brand,#facc15)]/0 group-hover:border-[var(--brand,#facc15)] flex items-center justify-center transition-all duration-500">
                      <ArrowRight className="w-4 h-4 text-[var(--brand,#facc15)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="py-32 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Comment ça marche</span>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Notre <span className="text-[var(--brand,#facc15)]">méthode.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {STEPS.map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="relative p-10 border-l border-white/5 first:border-l-0 md:first:border-l md:border-l group hover:bg-[#0f1214] transition-colors duration-500">
                    <div className="text-[3.5rem] font-extrabold text-white/[0.03] mb-4 leading-none" style={{ fontFamily: "'Space Mono', monospace" }}>{step.num}</div>
                    <div className="w-8 h-[2px] bg-[var(--brand,#facc15)] mb-6" />
                    <h3 className="text-base font-extrabold uppercase tracking-wide mb-4 group-hover:text-[var(--brand,#facc15)] transition-colors">{step.title}</h3>
                    <p className="text-sm text-white/30 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ── */}
        {/* À PROPOS */}
        <section id="apropos" className="py-32 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// À propos</span>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Qui on <span className="text-[var(--brand,#facc15)]">est.</span></h2>
              </div>
            </Reveal>
            <Reveal>
              <p className="max-w-[70ch] text-white/45 leading-relaxed mb-16">
                On ne fait que de l&apos;électricité. Pas de plomberie, pas de peinture, pas de &laquo;&nbsp;tous corps
                d&apos;état&nbsp;&raquo;. C&apos;est le seul moyen qu&apos;on connaisse de savoir vraiment ce qu&apos;on fait
                quand on ouvre un tableau qui a trente ans.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
              {APROPOS.map((a, i) => (
                <Reveal key={a.k} delay={i * 0.07}>
                  <div className="bg-[#05070a] p-8 h-full">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#facc15)] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>{a.k}</div>
                    <h3 className="text-lg font-extrabold uppercase tracking-tight mb-3">{a.t}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{a.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="avis" className="py-32 bg-[#05070a] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Avis clients</span>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Ce qu'ils <span className="text-[var(--brand,#facc15)]">disent.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="border border-white/5 p-10 flex flex-col gap-6 hover:border-[var(--brand,#facc15)]/15 transition-colors duration-500 h-full">
                    <div className="flex gap-1">
                      {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#facc15)] text-[var(--brand,#facc15)]" />)}
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed italic flex-1">{`"${t.quote}"`}</p>
                    <div className="border-t border-white/5 pt-6">
                      <div className="font-extrabold text-sm uppercase tracking-widest text-white">{t.name}</div>
                      {t.loc && <div className="flex items-center gap-2 text-[10px] text-[var(--brand,#facc15)]/60 mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                        <MapPin className="w-3 h-3" /> {t.loc}
                      </div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS & GARANTIES ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-16 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Qualifications</span>
                <h2 className="text-4xl font-extrabold uppercase tracking-tighter">Certifié, assuré, <span className="text-[var(--brand,#facc15)]">garanti.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {[
                { title: "Qualifié RGE", sub: "Reconnu Garant de l'Environnement", icon: Award },
                { title: "CONSUEL", sub: "Attestation de conformité garantie", icon: ShieldCheck },
                { title: "Décennale", sub: "Assurance responsabilité civile", icon: CheckCircle },
                { title: "Qualifelec", sub: "Certification entreprise artisanale", icon: Zap },
              ].map((c, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bg-[#080a0c] p-8 flex flex-col items-center text-center gap-4 hover:bg-[#0f1214] transition-colors duration-500">
                    <div className="w-14 h-14 border border-[var(--brand,#facc15)]/20 flex items-center justify-center">
                      <c.icon className="w-6 h-6 text-[var(--brand,#facc15)]" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm uppercase tracking-widest mb-1">{c.title}</div>
                      <div className="text-[11px] text-white/30 leading-snug">{c.sub}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ZONE D'INTERVENTION ── */}
        <section id="zone" className="py-24 bg-[#05070a] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 items-center">
            <Reveal className="flex-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] block mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>// Secteur géographique</span>
                <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>Zone d'<span className="text-[var(--brand,#facc15)]">intervention.</span></>}</h2>
                <p className="text-white/40 leading-relaxed mb-8 text-sm">{c?.aboutText ?? <>
                  VoltPro intervient sur Paris et toute l'Île-de-France — notamment les départements 75, 77, 78, 91, 92, 93, 94 et 95. Délai d'intervention habituel : 24h à 48h (dépannage urgent : &lt; 2h).
                </>}</p>
                <div className="flex flex-wrap gap-3">
                  {["Paris (75)", "Val-de-Marne (94)", "Seine-et-Marne (77)", "Hauts-de-Seine (92)", "Seine-Saint-Denis (93)", "Essonne (91)", "Yvelines (78)", "Val-d'Oise (95)"].map(z => (
                    <span key={z} className="px-4 py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:border-[var(--brand,#facc15)]/30 hover:text-[var(--brand,#facc15)]/70 transition-colors cursor-default">
                      <MapPin className="w-2.5 h-2.5 inline mr-1.5" />{z}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                {[
                  { v: "< 2h", l: "Urgences" },
                  { v: "24/48h", l: "Standard" },
                  { v: "30 km", l: "Rayon Paris" },
                  { v: "8 dépt.", l: "Couverts" },
                ].map((s, i) => (
                  <div key={i} className="w-32 h-32 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-[var(--brand,#facc15)]/20 transition-colors">
                    <div className="text-2xl font-extrabold text-[var(--brand,#facc15)]" style={{ fontFamily: "'Space Mono', monospace" }}>{s.v}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className="relative py-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src={photo(1, "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400")} alt="Câblage électrique moderne" fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-[#080a0c]/80" />
          </div>
          <Reveal className="relative z-10 text-center px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#facc15)] mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>// Prendre contact</div>
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase mb-8">
              Un projet ?<br /><span className="text-[var(--brand,#facc15)]">Parlons-en.</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto mb-10 leading-relaxed text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
              Devis gratuit et sans engagement sous 24h.<br />Réponse garantie le jour même.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-5 bg-[var(--brand,#facc15)] text-black font-extrabold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors duration-300">
                Demander un devis
              </button>
              <a href={`tel:${fd?.phone ?? "0612345678"}`} className="flex items-center gap-3 px-10 py-5 border border-white/15 text-white font-bold uppercase tracking-[0.15em] text-[10px] hover:border-[var(--brand,#facc15)]/50 hover:text-[var(--brand,#facc15)] transition-all">
                <Phone className="w-4 h-4" /> {fd?.phone ?? "06 12 34 56 78"}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#040608] pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-[var(--brand,#facc15)] flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
              </div>
              <span className="font-extrabold tracking-[0.15em] uppercase">VoltPro Électricité</span>
            </div>
            <p className="text-sm text-white/25 leading-relaxed mb-6">Électricien qualifié RGE · Île-de-France. Installation, conformité, domotique, dépannage urgent.</p>
            <div className="flex items-center gap-2 text-[var(--brand,#facc15)] text-sm font-bold">
              <Phone className="w-4 h-4" />
              <a href={`tel:${fd?.phone ?? "0612345678"}`} className="hover:text-white transition-colors">{fd?.phone ?? "06 12 34 56 78"}</a>
            </div>
          </div>
          {[
            { title: "Services", links: ["Installation électrique", "Mise en conformité", "Domotique & Smart Home", "Bornes IRVE", "Éclairage LED", "Dépannage urgent"] },
            { title: "Informations", links: ["Qui sommes-nous", "Certifications", "Zone d'intervention", "Témoignages", "Blog & conseils"] },
            { title: "Contact", links: ["Devis gratuit", "06 12 34 56 78", "contact@voltpro.fr", "Horaires : 8h–19h", "Urgences 24h/24"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#facc15)] mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l, idx) => <li key={l}><Link href={col.title === 'Services' ? '#services' : col.title === 'Contact' ? '#contact' : '#hero'} className="text-sm text-white/25 hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/15" style={{ fontFamily: "'Space Mono', monospace" }}>© 2026 VoltPro Électricité · SIRET 123 456 789 00010 · RGE QualiPV · Qualifelec</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#facc15)]/30" style={{ fontFamily: "'Space Mono', monospace" }}>Artisan électricien certifié · Île-de-France</span>
        </div>
      </footer>
    </div>
  )
}
