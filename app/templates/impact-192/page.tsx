"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Key, Lock, Shield, Zap, Clock, Phone, Star, MapPin, CheckCircle, AlertTriangle, Wrench, Home, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientAreas,
  clientCity,
  clientEmail,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
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
   {clientName(sessionData) ?? "SÉC'URFAST"} — Serrurier urgence & sécurité ({clientCity(sessionData) ?? "Strasbourg"})
   Palette : nuit #0d1524 / acier #1e3a5f / bleu électrique #2563eb / blanc froid #f0f4ff
   Fonts : Exo 2 (moderne, tech, lisible) + Inter
   Style : disponible 24/7, fiable, urgent, bleu nuit professionnel
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

// Demo content — real data (businessProfile) replaces this wholesale via
// resolveList when the client provided it; each field access below falls
// back with `??` so the same JSX renders either shape.
const NAV = [
  { l: "Services", h: "#services" },
  { l: "Urgences", h: "#urgences" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Zone", h: "#zone" },
  { l: "Contact", h: "#contact" },
];

const TARIFS_DEMO = [
  { a: "Ouverture de porte claquée", p: "89 €", n: "Jour ouvré, 8h — 20h. Sans dégât dans 9 cas sur 10." },
  { a: "Ouverture de porte fermée à clé", p: "à partir de 149 €", n: "Selon la serrure. Le prix vous est donné sur place, avant de commencer." },
  { a: "Majoration nuit / dimanche / férié", p: "+ 60 €", n: "20h — 8h. Annoncée au téléphone, jamais découverte sur la facture." },
  { a: "Changement de cylindre", p: "à partir de 120 €", n: "Pose comprise, cylindre européen 5 clés. Marques A2P sur devis." },
  { a: "Serrure multipoints", p: "sur devis", n: "Devis écrit gratuit, déplacement compris." },
  { a: "Déplacement sans intervention", p: "45 €", n: "Si vous renoncez après notre arrivée. Rien de plus." },
];
let TARIFS = TARIFS_DEMO;

function ZONES_DEMO_LIVE() {
  return [
  { v: (clientCity(sessionData) ?? "Strasbourg"), d: "Centre, Neudorf, Krutenau, Robertsau — 20 min" },
  { v: "Schiltigheim · Bischheim", d: "25 min en moyenne" },
  { v: "Illkirch · Ostwald", d: "25 min en moyenne" },
  { v: "Haguenau · Saverne", d: "45 min, majoration déplacement 25 €" },
  { v: "Sélestat · Obernai", d: "45 min, majoration déplacement 25 €" },
  { v: "Reste du Bas-Rhin", d: "Sur appel, délai annoncé avant de partir" },
];
}
let ZONES_DEMO = ZONES_DEMO_LIVE();;
let ZONES = ZONES_DEMO;

function SERVICES_SOURCE_LIVE() {
  return [
  { icon: AlertTriangle, title: "Urgence & dépannage 24h/24", desc: "Porte claquée, serrure bloquée, intrusion. Intervention sous 30 min sur " + (clientCity(sessionData) ?? "Strasbourg") + ". Astreinte 7j/7 nuits et jours fériés inclus." },
  { icon: Lock, title: "Changement & installation serrure", desc: "Pose serrure 3 points, blindée, connectée. Toutes marques : Vachette, Fichet, Mul-T-Lock, Abus. Devis transparent avant travaux." },
  { icon: Home, title: "Porte blindée & renforcée", desc: "Fourniture et pose de portes blindées Fichet, Mottura, Fichet Bauche. Conforme norme NF A2P. Financement disponible." },
  { icon: Shield, title: "Contrôle d'accès & visiophonie", desc: "Digicode, badge, lecteur biométrique, interphone vidéo. Système géré par smartphone. Idéal copropriétés et locaux pro." },
  { icon: Key, title: "Reproduction & trousseau", desc: "Reproduction clés plates, cylindres, badges, télécommandes de garage. Gravure sur mesure. Clés en double livrées sous 24h." },
  { icon: Wrench, title: "Coffre-fort & sécurité", desc: "Fourniture, scellement et ouverture de coffres-forts. Gamme domestique et professionnelle. Expertise assurance incluse." },
];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

function TEMOIGNAGES_DEMO_LIVE() {
  return [
  { q: "Porte claquée à 23h30 avec mes clés à l'intérieur. Arrivée en 25 minutes, ouverture en 10 minutes, porte intacte, facture correcte. Merci pour ce service pro et rapide.", n: "Émilie T.", l: (clientCity(sessionData) ?? "Strasbourg") + " Hautepierre" },
  { q: "Changement serrure 3 points après perte de clés. Devis donné par téléphone avant tout. Travail propre, serrurier ponctuel et de bon conseil pour la sécurité.", n: "Fabrice M.", l: "Schiltigheim (67)" },
  { q: "Porte blindée installée en 3 heures. Très beau travail, finitions parfaites, prise en charge partielle par mon assurance. L'investissement valait vraiment le coup.", n: "Sandra et Marc O.", l: "Illkirch-Graffenstaden" },
];
}
let TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function SecurFastPage() {
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
  sessionData = session;
  c = session?.generatedContent;
  ZONES_DEMO = ZONES_DEMO_LIVE();
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
  TEMOIGNAGES_DEMO = TEMOIGNAGES_DEMO_LIVE();




  SERVICES_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], title: s.title })),
    SERVICES_SOURCE,
  );
  ZONES = resolveList(
    clientAreas(session)?.map((z, i) => ({ ...ZONES_DEMO[i % ZONES_DEMO.length], v: z })),
    ZONES_DEMO,
  );
  TARIFS = resolveList(
    clientServices(session)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Real business data (resolveList) replaces demo content wholesale when
  // present — see the DEMO consts above for the shape each section falls
  // back to. Field access in JSX uses `??` chains so both shapes render.
  // Note: businessProfile is a sibling of formData on SessionData, not
  // nested inside it — read from `session`, not `fd`.
  const bp = session?.businessProfile;
  const services = resolveList(clientServices(session), SERVICES_DEMO);
  const temoignages = resolveList(clientReviews(session)?.map((r: any) => ({ q: r.text, n: r.author, l: r.detail })), TEMOIGNAGES_DEMO);

  return (
    <div className="bg-[#0d1524] text-[#f0f4ff] overflow-x-hidden" style={{ fontFamily: "'Exo 2', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0d1524]/98 backdrop-blur-xl py-3 border-b border-[var(--brand,#2563eb)]/15" : "bg-transparent py-7"}`}>
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
                <Lock className="w-5 h-5 text-[var(--brand,#2563eb)]" />
                <span className="font-bold text-[#f0f4ff] tracking-wide text-sm">{clientName(sessionData) ?? "SÉC'UR"}<span className="text-[var(--brand,#2563eb)]">FAST</span></span>
              </>
            )}
          </div>
          <div className="hidden lg:flex gap-9 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0f4ff]/25">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#2563eb)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="hidden md:flex items-center gap-2 text-[var(--brand,#2563eb)] font-bold text-sm">
              <Phone className="w-4 h-4" /> {clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[var(--brand,#2563eb)] text-white text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-[#1d4ed8] transition-colors">
              Urgence 24h/24
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-5 h-5 text-[#f0f4ff]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#111d30] border-[var(--brand,#2563eb)]/10 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {NAV.map(({ l, h }) => <Link key={l} href={h} className="text-3xl font-bold text-[#f0f4ff] hover:text-[var(--brand,#2563eb)] transition-colors">{l}</Link>)}
                  <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 text-[var(--brand,#2563eb)] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> {clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── URGENCE TOP BANNER ── */}
      <div className="pt-0 fixed top-0 left-0 right-0 z-40 translate-y-[72px]">
        <div className="bg-[var(--brand,#2563eb)] py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white flex items-center justify-center gap-4">
          <Zap className="w-3.5 h-3.5" />
          Disponible 24h/24 — 7j/7 — Intervention sous 30 min à {clientCity(sessionData) ?? "Strasbourg"}
          <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="underline ml-2">{clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-end overflow-hidden pt-16">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/219023/pexels-photo-219023.jpeg?auto=compress&cs=tinysrgb&w=1600"))} alt="Serrurier professionnel sécurité" fill className="object-cover object-center" priority style={{ filter: "brightness(0.22) saturate(0.6)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1524] via-[#0d1524]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1524]/90 to-transparent" />
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(37,99,235,0.015)_2px,rgba(37,99,235,0.015)_4px)]" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-24">
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.43, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.88] tracking-tight mb-7 text-[#f0f4ff]">{<>
            {clientHeroLine(sessionData, 0, 2, 10) ?? "Bloqué dehors ?"}<br /><span className="text-[var(--brand,#2563eb)]">{clientHeroLine(sessionData, 1, 2, 10) ?? "On arrive."}</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-[#f0f4ff]/28 leading-relaxed mb-10">{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
            {clientTrade(sessionData) ?? "Serrurier"} professionnel à {clientCity(sessionData) ?? "Strasbourg"}. Urgences 24h/24, 7j/7. Ouverture de porte, changement de serrure, porte blindée. Intervention sous 30 min. Devis avant intervention.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-4 mb-8">
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 px-9 py-4 bg-[var(--brand,#2563eb)] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#1d4ed8] transition-colors">
              <Phone className="w-4 h-4" /> {clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}
            </a>
            <button className="px-9 py-4 border border-[#f0f4ff]/12 text-[#f0f4ff]/40 font-bold text-[10px] uppercase tracking-widest hover:border-[var(--brand,#2563eb)]/40 hover:text-[var(--brand,#2563eb)] transition-all">
              Devis gratuit en ligne
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-6">
            {/* LISTE_LIBELLES */ (clientList(sessionData, "hero.liste1") ?? ["Intervention 30 min", "Devis avant travaux", "Agréé assurances"]).map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--brand,#2563eb)]" />
                <span className="text-[10px] font-bold text-[#f0f4ff]/25 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-[1px] h-10 bg-gradient-to-b from-[var(--brand,#2563eb)]/60 to-transparent" />
        </div>
      </section>

      {/* ── CHIFFRES ── */}
      <section className="py-14 bg-[#111d30] border-y border-[var(--brand,#2563eb)]/10">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "< 30 min", l: "Délai intervention moyen" },
            { v: "15 ans", l: "D'expérience" },
            { v: "4.8★", l: "Note Google" },
            { v: "24/7", l: "Disponibilité" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center py-3">
                <div className="text-2xl font-bold text-[var(--brand,#2563eb)] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f0f4ff]/20">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#0d1524]">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#2563eb)]/55 mb-4">— Nos interventions</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#f0f4ff]">{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Sécurité & <span className="text-[var(--brand,#2563eb)]">sérénité.</span></>)}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s: any, i: number) => (
              <Reveal key={s.title ?? s.name ?? i} delay={i * 0.07}>
                <div className="group p-7 border border-[#f0f4ff]/5 hover:border-[var(--brand,#2563eb)]/30 hover:bg-[#111d30] transition-all duration-500 h-full">
                  {s.icon && (
                    <div className="w-10 h-10 bg-[var(--brand,#2563eb)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--brand,#2563eb)] transition-colors duration-500">
                      <s.icon className="w-5 h-5 text-[var(--brand,#2563eb)] group-hover:text-white transition-colors" />
                    </div>
                  )}
                  <h3 className="font-bold text-[#f0f4ff] mb-3 group-hover:text-[var(--brand,#2563eb)] transition-colors">{s.title ?? s.name}</h3>
                  <p className="text-sm text-[#f0f4ff]/25 leading-relaxed">{s.desc ?? s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCES ── */}
      <section id="urgences" className="py-28 bg-[#111d30]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#2563eb)]/55 mb-4">— Urgences</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f0f4ff]">{/* TEXTE_SECTION */ clientText(sessionData, "urgences.titre") ?? (<>Dehors, <span className="text-[var(--brand,#2563eb)]">à 2 h du matin.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { t: "Appelez, ne forcez pas", d: "Une porte forcée coûte le double : cylindre, garniture, parfois le bloc. Deux minutes au téléphone évitent ça." },
              { t: "30 minutes sur " + (clientCity(sessionData) ?? "Strasbourg"), d: "Un serrurier de garde, pas un centre d'appel. Vous savez qui vient et en combien de temps avant de raccrocher." },
              { t: "Le prix avant l'outil", d: "Le montant est annoncé sur place, à la porte, avant la première manipulation. Vous pouvez dire non." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="p-8 border border-[#f0f4ff]/5 h-full">
                  <div className="font-bold text-[#f0f4ff] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--brand,#2563eb)]" />{c.t}
                  </div>
                  <p className="text-sm text-[#f0f4ff]/35 leading-relaxed">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="inline-flex items-center gap-3 px-9 py-4 bg-[var(--brand,#2563eb)] text-white font-bold text-[10px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity">
              <Phone className="w-4 h-4" /> Ligne d'urgence · {clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-28 bg-[#0d1524]">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#2563eb)]/55 mb-4">— Tarifs</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f0f4ff]">{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Écrits <span className="text-[var(--brand,#2563eb)]">noir sur blanc.</span></>)}</h2>
          </div></Reveal>
          <div className="border border-[#f0f4ff]/8">
            {TARIFS.map((t, i) => (
              <Reveal key={t.a} delay={i * 0.05}>
                <div className={`flex flex-wrap items-baseline justify-between gap-3 px-7 py-5 ${i ? "border-t border-[#f0f4ff]/8" : ""}`}>
                  <div className="min-w-0">
                    <div className="font-bold text-[#f0f4ff] text-sm">{t.a}</div>
                    <div className="text-xs text-[#f0f4ff]/30 mt-0.5">{t.n}</div>
                  </div>
                  <div className="font-bold text-[var(--brand,#2563eb)] text-sm shrink-0">{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE ── */}
      <section id="zone" className="py-28 bg-[#111d30]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#2563eb)]/55 mb-4">— Zone d'intervention</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f0f4ff]">{/* TEXTE_SECTION */ clientText(sessionData, "zone.titre") ?? (<>Où l'on <span className="text-[var(--brand,#2563eb)]">arrive vite.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZONES.map((z, i) => (
              <Reveal key={z.v} delay={i * 0.05}>
                <div className="p-7 border border-[#f0f4ff]/5 h-full">
                  <div className="font-bold text-[#f0f4ff] mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--brand,#2563eb)]" />{z.v}
                  </div>
                  <p className="text-sm text-[#f0f4ff]/35">{z.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-24 bg-[#111d30]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#2563eb)]/50 mb-4">— Avis clients</div>
            <h2 className="text-4xl font-bold text-[#f0f4ff]">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ils ont pu <span className="text-[var(--brand,#2563eb)]">rentrer chez eux.</span></>)}</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {temoignages.map((t: any, i: number) => (
              <Reveal key={t.n ?? t.author ?? i} delay={i * 0.1}>
                <div className="p-8 border border-[#f0f4ff]/5 hover:border-[var(--brand,#2563eb)]/20 transition-colors h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating ?? 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--brand,#2563eb)] text-[var(--brand,#2563eb)]" />)}
                  </div>
                  <p className="text-sm text-[#f0f4ff]/28 leading-relaxed flex-1">{`"${t.q ?? t.text}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#f0f4ff]/5">
                    <div className="font-bold text-[#f0f4ff] text-sm">{t.n ?? t.author}</div>
                    {(t.l ?? t.source) && (
                      <div className="text-[10px] text-[var(--brand,#2563eb)] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l ?? t.source}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 bg-[var(--brand,#2563eb)] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto px-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-5">Urgence · 24h/24 · 7j/7</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Un appel suffit.<br />On s'occupe du reste.</>)}</h2>
            <p className="text-white/55 mb-10 text-sm">Intervention sous 30 min · {clientCity(sessionData) ?? "Strasbourg"} & Bas-Rhin · Devis avant travaux</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "0388234567").replace(/[^+0-9]/g, "")}`} className="flex items-center gap-3 px-10 py-4 bg-white text-[var(--brand,#2563eb)] font-bold text-sm hover:bg-[#f0f4ff] transition-colors shadow-lg">
                <Phone className="w-5 h-5" /> {clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"}
              </a>
              <button className="px-10 py-4 border-2 border-white/30 text-white font-bold text-[10px] uppercase tracking-widest hover:border-white/60 transition-all">
                Devis en ligne
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#070d18] pt-16 pb-8 px-6 border-t border-[var(--brand,#2563eb)]/8">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5"><Lock className="w-4 h-4 text-[var(--brand,#2563eb)]" /><span className="font-bold text-[#f0f4ff] text-sm">{clientName(sessionData) ?? "SÉC'URFAST"}</span></div>
            <p className="text-[#f0f4ff]/15 text-sm leading-relaxed">{clientTrade(sessionData) ?? "Serrurier"} urgence {clientCity(sessionData) ?? "Strasbourg"}. Disponible 24h/24. Ouverture porte, serrures, porte blindée, contrôle d'accès.</p>
          </div>
          {[
            { t: "Services", ls: ["Urgence 24h/24", "Changement serrure", "Porte blindée", "Contrôle d'accès", "Coffre-fort"] },
            { t: "Infos", ls: ["Agréments & certifications", "Zone d'intervention", "Tarifs & devis", "Avis clients", "FAQ"] },
            { t: "Contact", ls: [(clientPhone(sessionData) ?? fd?.phone ?? "03 88 23 45 67"), (clientEmail(sessionData) ?? fd?.email ?? "contact@securfast.fr"), (clientCity(sessionData) ?? "Strasbourg") + " & 67", "24h/24 — 7j/7", "Devis gratuit"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#2563eb)]/40 mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#contact" className="text-[#f0f4ff]/15 text-sm hover:text-[#f0f4ff]/50 transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#f0f4ff]/5 flex flex-col md:flex-row justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-[#f0f4ff]/8">
          <span>© 2026 {clientName(sessionData) ?? "SÉC'URFAST"}{clientSiret(sessionData) ? ` · SIRET ${clientSiret(sessionData)}` : clientName(sessionData) ? "" : " · SIRET 567 890 123 00044"} · Agréé assurances · {clientCity(sessionData) ?? "Strasbourg"} (67){/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <span className="text-[var(--brand,#2563eb)]/20">{clientTrade(sessionData) ?? "Serrurier"} urgence · 24h/24</span>
        </div>
      </footer>
    </div>
  )
}
