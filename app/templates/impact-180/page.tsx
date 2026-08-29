"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flame, Thermometer, Phone, Clock, Star, MapPin, ArrowRight, CheckCircle, Wrench, Shield, Zap, Menu, Award } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientAreas,
  clientCity,
  clientEmail,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientSiret,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

/* ═══════════════════════════════════════════════════════════════════════════
   THERMOTEK CHAUFFAGE — Chauffagiste professionnel ({clientCity(sessionData) ?? "Bordeaux"})
   Palette : noir charbon / orange flamme #ea580c / cuivre / blanc
   Fonts : DM Sans (titres) + Fira Code (accents)
   Style : dark industrial warm, technique et rassurant
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
  { l: "Contrats", h: "#contrats" },
  { l: "Zone", h: "#zone" },
  { l: "Contact", h: "#contact" },
];

function REALISATIONS_LIVE() {
  return [
  { t: `Copropriété · 84 lots, ${clientCity({ formData: fd }) ?? "Villeurbanne"}`, n: "Chaufferie gaz condensation", d: "Remplacement de deux chaudières de 1998 par une cascade de trois modules. Coupure de trois jours, en juin, avec production d'eau chaude maintenue." },
  { t: "Maison 1962 · Sainte-Foy", n: "Pompe à chaleur air/eau", d: "Dépose d'une chaudière fioul, PAC 11 kW et remplacement de six radiateurs. Facture de chauffage divisée par 2,4 sur la première saison." },
  { t: "Restaurant · " + (clientCity(sessionData) ?? "Lyon") + " 2e", n: "Production ECS renforcée", d: "Ballon 500 L et bouclage sanitaire pour un service en continu. Posé de nuit pour ne pas fermer la salle." },
  { t: "Atelier · Corbas", n: "Aérothermes gaz", d: "800 m² à chauffer sans reprendre le réseau existant. Quatre aérothermes suspendus, régulation par zone." },
];
}
let REALISATIONS = REALISATIONS_LIVE();

const CONTRATS = [
  { f: "Essentiel", p: "179 €/an", n: "Une visite annuelle, réglage complet, attestation d'entretien. Obligatoire pour les chaudières gaz." },
  { f: "Sérénité", p: "289 €/an", n: "L'Essentiel, plus le dépannage sans frais de déplacement et la main-d'œuvre comprise." },
  { f: "Sérénité +", p: "419 €/an", n: "Le précédent, pièces d'usure comprises et intervention garantie sous 24 h en période de chauffe." },
  { f: "Copropriétés", p: "sur devis", n: "Chaufferie collective, télésurveillance, astreinte week-end et rapport annuel au syndic." },
];

function ZONES_DEMO_LIVE() {
  return [
  { v: "Lyon et " + (clientCity({ formData: fd }) ?? "Villeurbanne"), d: "Entretien et dépannage, sous 24 h en hiver" },
  { v: "Ouest lyonnais", d: "Écully, Tassin, Craponne, Francheville" },
  { v: "Est lyonnais", d: "Bron, Vénissieux, Saint-Priest, Décines" },
  { v: "Nord", d: "Caluire, Rillieux, Neuville, Genay" },
  { v: "Sud", d: "Oullins, Pierre-Bénite, Vernaison, Givors" },
  { v: "Reste du Rhône et Ain sud", d: "Installation uniquement, sur planning" },
];
}
let ZONES_DEMO = ZONES_DEMO_LIVE();;
let ZONES = ZONES_DEMO;

const SERVICES_SOURCE = [
  { icon: Flame, title: "Installation chaudière", desc: "Chaudière gaz, fioul, condensation, micro-cogénération. Toutes marques. Mise en service et formation à l'utilisation incluses." },
  { icon: Thermometer, title: "Pompe à chaleur (PAC)", desc: "PAC air-air, air-eau, géothermique. Dossier CEE et aides MaPrimeRénov' gérés par nos soins. Garantie 5 ans." },
  { icon: Wrench, title: "Entretien & révision", desc: "Contrat d'entretien annuel (obligatoire pour les chaudières gaz). Rapport de combustion, nettoyage, diagnostic." },
  { icon: Zap, title: "Dépannage d'urgence", desc: "Plus de chauffage en plein hiver ? Intervention sous 4h dans la métropole bordelaise. Astreinte 7j/7 de novembre à mars." },
  { icon: Shield, title: "Plancher chauffant", desc: "Pose de plancher chauffant hydraulique sur dalle neuve ou rénovation. Conception de la régulation par pièce." },
  { icon: Flame, title: "VMC & ventilation", desc: "VMC simple et double flux, DRV, traitement de l'air. Bilan aéraulique, pose, entretien. Labels QualAir et RGE." },
]
let SERVICES_DEMO = SERVICES_SOURCE;

// Testimonials — hoisted from an inline JSX array literal so resolveList can
// swap in clientReviews(session) when the client provided real
// reviews.
/* Recalculée après l'arrivée de la session : figée à l'import, elle gardait la démonstration. */
function TEMOIGNAGES_DEMO_LIVE() {
  return [
  { q: "Chaudière tombée en panne un dimanche soir de janvier. Technicien présent en 3h. Pièce remplacée, chaudière repartie. Service au top.", n: "Bernard L.", l: (clientCity(sessionData) ?? "Bordeaux") + " (33)" },
  { q: "Thermotek nous a installé une PAC air-eau et géré toutes les aides MaPrimeRénov'. Économie de 60% sur notre facture de gaz. Exceptionnel.", n: "Isabelle & Marc D.", l: "Mérignac (33)" },
  { q: "Entretien annuel ponctuel, technicien sérieux et pédagogue. Le rapport de combustion est clair. On continue avec Thermotek depuis 8 ans.", n: "Sylvain A.", l: "Pessac (33)" },
];
}
let TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function ThermotekChauffagePage() {
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
  TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();
  c = session?.generatedContent;
  ZONES_DEMO = ZONES_DEMO_LIVE();
  REALISATIONS = REALISATIONS_LIVE();



  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], title: s.title })),
    SERVICES_SOURCE,
  );
  ZONES = resolveList(
    clientAreas(session)?.map((z, i) => ({ ...ZONES_DEMO[i % ZONES_DEMO.length], v: z })),
    ZONES_DEMO,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  // Real business data (resolveList) replaces demo content wholesale when
  // present — see the DEMO consts above for the shape each section falls
  // back to. Field access in JSX uses `??` chains so both shapes render.
  // Note: businessProfile is a sibling of formData on SessionData, not
  // nested inside it — read from `session`, not `fd`.
  const bp = session?.businessProfile;
  const services = resolveList(clientServices(session), SERVICES_DEMO);
  const temoignages = resolveList(clientReviews(session)?.map((r: any) => ({ q: r.text, n: r.author, l: r.detail })), TEMOIGNAGES_DEMO);

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#0a0906] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0906]/97 backdrop-blur-xl py-3 border-b border-[var(--brand,#ea580c)]/10" : "bg-transparent py-6"}`}>
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
                <Flame className="w-6 h-6 text-[var(--brand,#ea580c)] fill-[var(--brand,#ea580c)]/20" />
                <span className="font-bold text-lg tracking-tight" style={{ textShadow: "0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)" }}>{clientName({ formData: fd }) ?? "Thermo"}<span className="text-[var(--brand,#ea580c)]">tek</span></span>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#ea580c)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0556123456").replace(/[^+0-9]/g, "")}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#ea580c)] font-bold text-sm">
              <Phone className="w-4 h-4" /> {clientPhone(sessionData) ?? fd?.phone ?? "05 56 12 34 56"}
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[var(--brand,#ea580c)] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#f97316] transition-colors">
              Devis Gratuit
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0906] border-[var(--brand,#ea580c)]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold hover:text-[var(--brand,#ea580c)] transition-colors">{l}</Link>)}
                  <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0556123456").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 text-[var(--brand,#ea580c)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {clientPhone(sessionData) ?? fd?.phone ?? "05 56 12 34 56"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/7859953/pexels-photo-7859953.jpeg?auto=compress&cs=tinysrgb&w=2400"))} alt="Chauffagiste intervention chaudière" fill className="object-cover" priority style={{ filter: "brightness(0.5)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906] via-[#0a0906]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0906]/60 to-transparent" />
          <div className="absolute inset-0 bg-[var(--brand,#ea580c)]/5 mix-blend-overlay" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.h1 initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-9">{<>{clientHeroLine(sessionData, 0, 3, 15) ?? "Votre confort"}<br />{clientHeroLine(sessionData, 1, 3, 15) ?? "thermique,"}<br /><span className="text-[var(--brand,#ea580c)]">{clientHeroLine(sessionData, 2, 3, 15) ?? "notre priorité."}</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/40 leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
            Installation, entretien et dépannage de chaudières, pompes à chaleur et planchers chauffants. Certifié RGE, éligible aides MaPrimeRénov'. Intervention d'urgence sous 4h.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-wrap gap-3">
            <button className="px-8 py-4 bg-[var(--brand,#ea580c)] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#f97316] transition-colors">{c?.ctaText ?? <>
              Devis gratuit
            </>}</button>
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0556123456").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#ea580c)]/50 hover:text-[var(--brand,#ea580c)] transition-all">
              <Phone className="w-4 h-4" /> Urgence 4h
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#ea580c)]/60 to-transparent" />
        </div>
      </section>

      {/* ── URGENCE BANNER ── */}
      <section className="bg-[var(--brand,#ea580c)] py-4">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-sm text-white">{/* TEXTE_SECTION */ clientText(sessionData, "section-2.texte") ?? (<>Panne de chauffage ? Astreinte 7j/7 de novembre à mars</>)}</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-white/85 font-semibold text-sm"><Clock className="w-4 h-4" /> &lt; 4h d'intervention</span>
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0556123456").replace(/[^+0-9]/g, "")}`} className="bg-white text-[var(--brand,#ea580c)] px-5 py-2 font-bold text-sm hover:bg-orange-50 transition-colors">{clientPhone(sessionData) ?? fd?.phone ?? "05 56 12 34 56"}</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "22+", l: "Ans d'expérience" },
            { v: "3 200+", l: "Installations" },
            { v: "98%", l: "Satisfaction clients" },
            { v: "RGE", l: "Qualibat / QualiPAC" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center border border-white/5 p-6 hover:border-[var(--brand,#ea580c)]/20 transition-colors">
                <div className="text-3xl font-bold text-[var(--brand,#ea580c)] mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Nos métiers</div>
              <h2 className="text-4xl md:text-5xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Ce que nous <span className="text-[var(--brand,#ea580c)]">maîtrisons.</span></>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {services.map((s: any, i: number) => {
              const Icon = s.icon ?? Flame;
              return (
                <Reveal key={s.title ?? s.name ?? i} delay={i * 0.07}>
                  <div className="bg-[#0a0906] p-9 group hover:bg-[#140c07] transition-colors duration-500 h-full flex flex-col gap-5">
                    <div className="w-11 h-11 border border-[var(--brand,#ea580c)]/20 flex items-center justify-center group-hover:bg-[var(--brand,#ea580c)] group-hover:border-[var(--brand,#ea580c)] transition-all duration-500">
                      <Icon className="w-5 h-5 text-[var(--brand,#ea580c)] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-3 group-hover:text-[var(--brand,#ea580c)] transition-colors">{s.title ?? s.name}</h3>
                      <p className="text-sm text-white/30 leading-relaxed">{s.desc ?? s.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section id="realisations" className="py-28 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Réalisations</div>
            <h2 className="text-4xl md:text-5xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>Des chantiers <span className="text-[var(--brand,#ea580c)]">terminés.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {REALISATIONS.map((r, i) => (
              <Reveal key={r.t} delay={i * 0.07}>
                <div className="bg-[#0a0710] p-8 h-full">
                  <h3 className="text-lg font-bold mb-1">{r.t}</h3>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>{r.n}</div>
                  <p className="text-sm text-white/40 leading-relaxed">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRATS ── */}
      <section id="contrats" className="py-28 bg-[#06040a] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Contrats d'entretien</div>
            <h2 className="text-4xl md:text-5xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "contrats.titre") ?? (<>Une visite par an, <span className="text-[var(--brand,#ea580c)]">au minimum.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {CONTRATS.map((c, i) => (
              <Reveal key={c.f} delay={i * 0.07}>
                <div className="border border-white/8 p-8 h-full">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>{c.f}</div>
                  <div className="text-3xl font-bold mb-4">{c.p}</div>
                  <p className="text-sm text-white/40 leading-relaxed">{c.n}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-xs text-white/30 leading-relaxed max-w-[80ch]">
              L'entretien annuel d'une chaudière gaz est obligatoire depuis 2009 et conditionne la prise
              en charge par votre assurance en cas de sinistre. Nous vous rappelons chaque année, à la date
              de la dernière visite. Résiliable à tout moment après la première année, sans motif.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ZONE ── */}
      <section id="zone" className="py-28 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Zone d'intervention</div>
            <h2 className="text-4xl md:text-5xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "zone.titre") ?? (<>Où l'on <span className="text-[var(--brand,#ea580c)]">se déplace.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {ZONES.map((z, i) => (
              <Reveal key={z.v} delay={i * 0.05}>
                <div className="bg-[#0a0710] p-7 h-full">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--brand,#ea580c)]" />{z.v}
                  </div>
                  <p className="text-sm text-white/40">{z.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-28 bg-[#06040a] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#ea580c)] mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>// Avis clients</div>
            <h2 className="text-4xl font-bold">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce qu'ils <span className="text-[var(--brand,#ea580c)]">disent.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {temoignages.map((t: any, i: number) => (
              <Reveal key={t.n ?? t.author ?? i} delay={i * 0.1}>
                <div className="border border-white/5 p-9 hover:border-[var(--brand,#ea580c)]/15 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#ea580c)] text-[var(--brand,#ea580c)]" />)}
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed italic flex-1">{`"${t.q ?? t.text}"`}</p>
                  <div className="border-t border-white/5 pt-5 mt-6">
                    <div className="font-bold text-sm uppercase tracking-widest">{t.n ?? t.author}</div>
                    {(t.l ?? t.source) && <div className="text-[10px] text-[var(--brand,#ea580c)]/60 mt-1"><MapPin className="w-2.5 h-2.5 inline mr-1" />{t.l ?? t.source}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-36 bg-[var(--brand,#ea580c)] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6" style={{ fontFamily: "'Fira Code', monospace" }}>// Prendre contact</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Besoin de chaleur ?<br />On s'en occupe.</>)}</h2>
            <p className="text-white/60 mb-10 text-sm leading-relaxed">Devis gratuit sous 24h · Éligible MaPrimeRénov' · Certifié RGE</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[var(--brand,#ea580c)] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-orange-50 transition-colors">
                Demander un devis
              </button>
              <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0556123456").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" /> {clientPhone(sessionData) ?? fd?.phone ?? "05 56 12 34 56"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#040302] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Flame className="w-5 h-5 text-[var(--brand,#ea580c)]" />
              <span className="font-bold text-sm">Thermotek Chauffage</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">{clientTrade(sessionData) ?? "Chauffagiste"} RGE · {clientCity(sessionData) ?? "Bordeaux"} Métropole. Chaudières, PAC, plancher chauffant depuis 2002.</p>
          </div>
          {[
            { t: "Services", ls: ["Chaudière gaz/condensation", "Pompe à chaleur", "Plancher chauffant", "VMC double flux", "Entretien annuel", "Dépannage urgent"] },
            { t: "Aides", ls: ["MaPrimeRénov'", "CEE (Certificats Économie Énergie)", "Eco-prêt taux zéro", "TVA à 5,5%", "Dossiers pris en charge"] },
            { t: "Contact", ls: [(clientPhone(sessionData) ?? fd?.phone ?? "05 56 12 34 56"), (clientEmail(sessionData) ?? fd?.email ?? "contact@thermotek.fr"), (clientCity(sessionData) ?? "Bordeaux") + " Métropole", "Astreinte hiver 24h/24", "Devis gratuit 24h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#ea580c)] mb-5" style={{ fontFamily: "'Fira Code', monospace" }}>{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-white/25 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 {clientName(sessionData) ?? "Thermotek Chauffage"}{clientSiret(sessionData) ? ` · SIRET ${clientSiret(sessionData)}` : clientName(sessionData) ? "" : " · SIRET 345 678 901 00034"} · RGE Qualibat · QualiPAC · Assurance Décennale{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}</span>
          <span className="text-[var(--brand,#ea580c)]/30">{clientTrade(sessionData) ?? "Chauffagiste"} certifié · {clientCity({ formData: fd }) ?? "Bordeaux"}</span>
        </div>
      </footer>
    </div>
  )
}
