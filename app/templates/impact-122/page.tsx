"use client";
// @ts-nocheck
/*
  impact-122 — Chronicle Formation. L'ADN magazine du savoir (une, rubriques,
  barre de lecture, serif éditoriale) mis au service d'un organisme de
  formation professionnelle : la une est la formation phare, les brèves sont
  les prochaines sessions, les essais du dimanche sont les dates inter.
  Geste : PanelRise — le catalogue monte par-dessus la une au défilement.
  Fontes P10 Spectral + IBM Plex · palette #f6f6f9 / #3d4bc9.
*/
import { motion, useScroll, useInView, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Menu, ArrowRight, Clock, Calendar, Newspaper, Sparkles, Phone, Mail, MapPin } from "lucide-react"
import { PanelRise } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientFaq,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let brand: any = null;

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

function MANIFEST_LIVE() {
  const services = clientServices(sessionData);
  return {
  hero: {
    category: "Management",
    title: "Manager une équipe qu'on n'a pas choisie",
    intervenante: "Hélène Vasseur, formatrice senior",
    date: "Prochaine session : 12 octobre",
    duree: "2 jours · 14 heures",
    excerpt: "Prendre un poste sans avoir composé son équipe : poser le cadre, gagner la légitimité, mener les entretiens qui comptent. Deux jours pour transformer une prise de poste en position tenable."
  },
  sessions: /* PROCHAINES SESSIONS — brèves du magazine */ resolveList(
    services?.slice(0, 3).map((s: any) => ({ title: s.title })),
    [
      { cat: "Management", title: "Conduire l'entretien annuel", time: "9 oct. · 4 places" },
      { cat: "Bureautique", title: "Excel — consolider et automatiser", time: "16 oct. · 6 places" },
      { cat: "Prévention", title: "Gestes et postures au poste de travail", time: "23 oct. · complet" }
    ]),
  catalogue: /* CATALOGUE — les rubriques de la une */ resolveList(
    services?.map((s: any) => ({
      title: s.title,
      excerpt: s.desc || undefined,
      prix: s.price || undefined,
    })),
    [
      {
        id: "management",
        cat: "Parcours certifiant",
        title: "Management d'équipe — parcours 6 jours",
        excerpt: "Prise de poste, animation d'équipe, entretiens individuels et gestion des situations tendues. Six journées espacées, avec mise en pratique entre chaque module.",
        prix: "dès 390 € / jour",
        img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80")
      },
      {
        id: "bureautique",
        cat: "Parcours certifiant",
        title: "Bureautique & outils digitaux",
        excerpt: "Excel du tableau croisé à l'automatisation, messagerie et travail partagé. Un positionnement en amont place chaque stagiaire au bon niveau.",
        prix: "dès 350 € / jour",
        img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80")
      },
      {
        id: "langues",
        cat: "Parcours certifiant",
        title: "Anglais professionnel",
        excerpt: "Réunions, courriels, appels : un anglais utile au poste, évalué en début et en fin de parcours. En petit groupe ou en cours individuel.",
        prix: "dès 55 € / heure",
        img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80")
      }
    ]),
  inter: [
    { title: "Manager une équipe qu'on n'a pas choisie", lieu: "Paris 11e", date: "12-13 oct." },
    { title: "Excel — consolider et automatiser", lieu: "Classe virtuelle", date: "16 oct." },
    { title: "Conduire l'entretien annuel", lieu: "Paris 11e", date: "6 nov." },
    { title: "Anglais professionnel — remise à niveau", lieu: "Classe virtuelle", date: "entrées permanentes" }
  ],
  formats: {
    tiers: [
      { name: "Inter-entreprises", price: "dès 390 € / jour", features: ["Petits groupes de 4 à 8 participants", "Sessions garanties dès 3 inscrits", "Supports et attestation inclus", "À Paris ou en classe virtuelle"] },
      { name: "Intra-entreprise", price: "Sur devis", features: ["Dans vos locaux ou à distance", "Programme ajusté à vos équipes", "Jusqu'à 12 participants", "Entretien de cadrage préalable inclus"], recommended: true },
      { name: "Sur mesure", price: "Sur devis", features: ["Ingénierie pédagogique dédiée", "Parcours multi-modules dans la durée", "Accompagnement individuel possible", "Bilan des acquis à 90 jours"] }
    ]
  },
  avis: /* AVIS — le courrier des stagiaires */ resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({
      text: r.text,
      author: r.author,
      detail: r.detail || undefined,
    })),
    [
      { text: "Deux jours denses, zéro théorie plaquée : je suis reparti avec une trame d'entretien que j'utilise encore.", author: "Julien M.", detail: "chef d'équipe logistique" },
      { text: "La formatrice a repris nos cas réels en séance. C'est la première formation dont mon équipe a vu la différence.", author: "Sarah B.", detail: "responsable de plateau" },
      { text: "Dossier de prise en charge géré de bout en bout, calendrier tenu, supports propres.", author: "Nadia K.", detail: "RH, PME industrielle" }
    ]),
  faq: resolveList(clientFaq(sessionData), [
    { q: "La formation peut-elle être financée par mon OPCO ?", a: "Oui. Nous établissons la convention de formation, le programme détaillé et le devis nécessaires à votre demande de prise en charge. Comptez deux à quatre semaines d'instruction selon les OPCO — anticipez d'autant votre inscription." },
    { q: "Proposez-vous le distanciel ?", a: "Chaque formation existe en présentiel à Paris et en classe virtuelle, avec les mêmes contenus, les mêmes exercices et des effectifs réduits. Les parcours mixtes présentiel-distanciel sont possibles en intra." },
    { q: "Quels documents recevons-nous ?", a: "Convocation avant la session, feuilles d'émargement, attestation de fin de formation mentionnant les acquis évalués, et un support complet remis à chaque participant." },
    { q: "Les formations sont-elles accessibles aux personnes en situation de handicap ?", a: "Oui. Signalez vos besoins dès l'inscription : notre référent handicap adapte le rythme, les supports et le lieu de la session avec vous." },
    { q: "Quel est le délai pour entrer en formation ?", a: "Deux semaines en moyenne entre votre demande et l'entrée en session, selon le calendrier inter-entreprises et le mode de financement retenu." }
  ])
};
}
let MANIFEST = MANIFEST_LIVE();

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}
export default function ChronicleEditorialPage() {
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
  MANIFEST = MANIFEST_LIVE();

  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  // Reading progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, []);

  const ville = clientCity(sessionData) ?? "Paris";
  const tel = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "01 84 60 12 34";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@chronicle-formation.fr";

  return (
    <div className="i122 bg-[#f6f6f9] text-[#191a24] min-h-dvh selection:bg-[var(--brand,#3d4bc9)] selection:text-white overflow-x-clip" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .i122 .font-serif { font-family: 'Spectral', Georgia, serif; }
      `}</style>

      {/* ─── BARRE DE PROGRESSION DE LECTURE ───────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--brand,#3d4bc9)] z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#f6f6f9]/95 backdrop-blur-sm border-b border-[#191a24]/10 py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[var(--brand,#3d4bc9)] transition-colors">
                  <Menu className="w-5 h-5" /> Menu
                </SheetTrigger>
              <SheetContent side="left" className="bg-[#191a24] text-[#f6f6f9] border-r-0 p-12 w-full sm:w-[400px]">
                <div className="mt-12 flex flex-col gap-8">
                  {[["La une", "#hero"], ["Catalogue", "#catalogue"], ["Dates inter", "#sessions"], ["Formats & tarifs", "#formats"], ["Financements", "#faq"], ["Contact", "#contact"]].map(([link, ancre]) => (
                    <Link key={link} href={ancre} className="text-4xl font-serif italic hover:text-[#8a94e8] transition-colors">
                      {link}
                    </Link>
                  ))}
                  <div className="w-full h-[1px] bg-white/10 my-4" />
                  <Link href="#contact" className="text-sm font-bold uppercase tracking-widest text-[#8a94e8] hover:text-white transition-colors">Demander un devis</Link>
                  <a href={telHref} className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">{tel}</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="#hero" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <h1 className="hero-ecran-court text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter max-w-[52vw] md:max-w-none text-center" style={{ fontFamily: "'Spectral', Georgia, serif" }}>{clientName({ formData: fd }) ?? clientHeroLine(sessionData, 0, 1, 28) ?? c?.heroHeadline ?? <>
                  Chronicle.
                </>}</h1>
                {!scrolled && <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#191a24]/50 mt-1">Formation professionnelle</span>}
              </>
            )}
          </Link>

          <div className="flex items-center gap-6">
            <Link href="#catalogue" className="hidden md:block text-xs font-bold uppercase tracking-widest hover:text-[var(--brand,#3d4bc9)] transition-colors">
              Catalogue
            </Link>
            <Link href="#contact" className="hidden sm:block bg-[var(--brand,#3d4bc9)] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#2c37a3] transition-colors">
              Demander un devis
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* ─── BANDEAU DE SESSION ──────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 mb-12">
          <div className="w-full border-y border-[#191a24]/10 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs font-bold uppercase tracking-widest text-[#191a24]/50">
            <div className="flex gap-8">
              <span>{clientEyebrow(sessionData) ?? "Session d'automne — inscriptions ouvertes"}</span>
              <span className="hidden md:inline">Inter & intra-entreprise</span>
            </div>
            <div className="flex gap-8">
              <span className="hidden md:inline">Éligible OPCO</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ville} & distanciel</span>
            </div>
          </div>
        </div>

        {/* ─── LA UNE — formation phare + brèves des sessions ──────────── */}
        <section id="hero" className="max-w-[1400px] mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* PROCHAINES SESSIONS (colonne des brèves) */}
            <div className="lg:col-span-3 order-2 lg:order-1 hidden md:block">
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#191a24] pb-4 mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "sessions.titre") ?? (<>Prochaines sessions</>)}</h3>
              <div className="flex flex-col gap-6">
                {MANIFEST.sessions.map((news, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <Link href="#sessions" className="group block cursor-pointer">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#3d4bc9)] mb-2">{news.cat}</div>
                      <h4 className="font-serif text-lg leading-snug group-hover:underline decoration-2 underline-offset-4 decoration-[var(--brand,#3d4bc9)]/30 mb-2">
                        {news.title}
                      </h4>
                      <div className="text-[10px] text-[#191a24]/40 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {news.time}
                      </div>
                    </Link>
                    {i !== MANIFEST.sessions.length - 1 && <div className="w-full h-[1px] bg-[#191a24]/10 mt-6" />}
                  </Reveal>
                ))}
              </div>
              <div className="mt-8 p-6 bg-[#ececf2] border border-[#191a24]/10">
                <Newspaper className="w-8 h-8 text-[var(--brand,#3d4bc9)] mb-4" />
                <h4 className="font-serif italic text-xl mb-2">Le calendrier du mois</h4>
                <p className="text-sm text-[#191a24]/60 mb-4 leading-relaxed">{clientTagline(sessionData) ?? c?.heroSubline ?? <>Toutes les dates inter-entreprises et les places restantes, une fois par mois.</>}</p>
                <Link href="#contact" className="block text-center w-full py-2 bg-[#191a24] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--brand,#3d4bc9)] transition-colors">{c?.ctaText ?? <>
                  Le recevoir
                </>}</Link>
              </div>
            </div>

            {/* FORMATION PHARE (la une) */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <Reveal>
                <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-[#e3e3ec] mb-8 overflow-hidden group">
                  <Image
                    src={photo(3, "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80")}
                    alt="Salle de formation"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    Formation phare
                  </div>
                </div>

                <div className="max-w-3xl mx-auto text-center md:text-left">
                  <div className="text-xs font-black uppercase tracking-widest text-[var(--brand,#3d4bc9)] mb-4">
                    {clientTrade(sessionData) ?? MANIFEST.hero.category}
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
                    {clientHeroLine(sessionData, 0, 1, 64) ?? MANIFEST.hero.title}
                  </>)}</h2>
                  <p className="text-lg md:text-2xl font-serif italic text-[#191a24]/70 leading-relaxed mb-8">
                    {clientHeroSubtitle(sessionData) ?? MANIFEST.hero.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-y border-[#191a24]/10">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <Avatar className="w-10 h-10 border border-[#191a24]/10">
                        <AvatarImage src={photo(4, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80")} />
                        <AvatarFallback>HV</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-xs font-bold uppercase tracking-widest">Animée par {MANIFEST.hero.intervenante}</div>
                        <div className="text-[10px] text-[#191a24]/50 font-bold uppercase tracking-widest mt-1">
                          {MANIFEST.hero.date} • {MANIFEST.hero.duree}
                        </div>
                      </div>
                    </div>
                    <Link href="#contact" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand,#3d4bc9)] hover:text-[#191a24] transition-colors">
                      Demander le programme <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── CATALOGUE — PanelRise : la page monte par-dessus la une ──── */}
        <div style={{ background: "#191a24" }}>
          <PanelRise style={{ background: "#ececf2", overflow: "hidden" }}>
            <section id="catalogue" className="py-24 border-y border-[#191a24]/10">
              <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-serif italic">{/* TEXTE_SECTION */ clientText(sessionData, "catalogue.titre") ?? (<>Le catalogue</>)}</h3>
                  <Link href="#formats" className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[var(--brand,#3d4bc9)] transition-colors">
                    Formats & tarifs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {MANIFEST.catalogue.map((story, i) => (
                    <Reveal key={story.id ?? i} delay={i * 0.1}>
                      <Link href="#contact" className="group flex flex-col h-full">
                        <div className="relative w-full aspect-[4/3] bg-[#e3e3ec] mb-6 overflow-hidden">
                          <Image src={story.img} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--brand,#3d4bc9)] mb-3">{story.cat}</div>
                        <h4 className="text-2xl font-serif leading-snug mb-4 group-hover:text-[var(--brand,#3d4bc9)] transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-[#191a24]/70 font-serif leading-relaxed mb-6 flex-1">
                          {story.excerpt}
                        </p>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#191a24]/50 mt-auto border-t border-[#191a24]/10 pt-4">
                          {story.prix ?? "Sur devis"}
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </PanelRise>
        </div>

        {/* ─── DATES INTER-ENTREPRISES ───────────────────────────────────── */}
        <section id="sessions" className="py-24 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <Reveal>
                <div className="w-16 h-[2px] bg-[var(--brand,#3d4bc9)] mb-8" />
                <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">{/* TEXTE_SECTION */ clientText(sessionData, "inter.titre") ?? (<>
                  Les <span className="italic">dates</span><br />inter-entreprises.
                </>)}</h2>
                <p className="text-lg text-[#191a24]/70 leading-relaxed mb-12 max-w-md">{c?.aboutText ?? <>
                  Des sessions courtes, en petit groupe, garanties dès trois inscrits. On s'y inscrit seul ou à plusieurs — et ce qui s'y apprend se pratique dès le lundi suivant.
                </>}</p>
                <div className="flex flex-col border-t border-[#191a24]/10">
                  {MANIFEST.inter.map((essay, i) => (
                    <Link key={i} href="#contact" className="group flex items-center justify-between gap-4 py-6 border-b border-[#191a24]/10 hover:bg-[#ececf2] transition-colors -mx-6 px-6">
                      <div>
                        <h4 className="text-xl font-serif mb-2 group-hover:text-[var(--brand,#3d4bc9)] transition-colors">{essay.title}</h4>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#191a24]/50">{essay.lieu}</div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#191a24]/40 text-right shrink-0 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {essay.date}
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="order-1 lg:order-2">
              <Reveal delay={0.2}>
                <div className="relative w-full aspect-[3/4] bg-[#e3e3ec] p-8 md:p-12 flex flex-col justify-end overflow-hidden group">
                  <Image src={photo(5, "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80")} alt="Atelier en entreprise" fill className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191a24]/90 via-[#191a24]/20 to-transparent" />
                  <div className="relative z-10 text-white">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#8a94e8] mb-4">Sur mesure</div>
                    <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-4">
                      Un parcours construit pour vos équipes
                    </h3>
                    <p className="text-white/70 italic font-serif mb-6">
                      Entretien de cadrage, programme ajusté à vos situations réelles, bilan des acquis à 90 jours.
                    </p>
                    <Link href="#contact" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#8a94e8] transition-colors">
                      Parler de votre projet <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── FORMATS & TARIFS ──────────────────────────────────────────── */}
        <section id="formats" className="bg-[#191a24] text-[#f6f6f9] py-32 border-y-[10px] border-[var(--brand,#3d4bc9)]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-20">
              <Reveal>
                <Sparkles className="w-8 h-8 mx-auto text-[#8a94e8] mb-6" />
                <h2 className="text-4xl md:text-6xl font-serif mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "formats.titre") ?? (<>Trois façons de se former</>)}</h2>
                <p className="text-[#f6f6f9]/60 max-w-xl mx-auto text-lg italic font-serif">
                  Le même exigeant travail de fond, servi au format qui convient à votre équipe — une place en session, une session chez vous, ou un parcours entier.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MANIFEST.formats.tiers.map((tier, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-10 border ${tier.recommended ? 'border-[var(--brand,#3d4bc9)] bg-[#232436]' : 'border-[#f6f6f9]/10 bg-[#1e1f2c]'} relative flex flex-col h-full`}>
                    {tier.recommended && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--brand,#3d4bc9)] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Le plus demandé
                      </div>
                    )}
                    <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold tracking-tight mb-8">{tier.price}</div>

                    <ul className="space-y-4 mb-10 flex-1">
                      {tier.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#f6f6f9]/80">
                          <div className="w-1.5 h-1.5 bg-[#8a94e8] rounded-full mt-1.5 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <Link href="#contact" className={`block text-center w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors ${tier.recommended ? 'bg-[var(--brand,#3d4bc9)] text-white hover:bg-[#2c37a3]' : 'bg-[#f6f6f9] text-[#191a24] hover:bg-[var(--brand,#3d4bc9)] hover:text-white'}`}>
                      Demander un devis
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LE COURRIER DES STAGIAIRES ────────────────────────────────── */}
        <section className="py-24 max-w-[1100px] mx-auto px-6">
          <Reveal>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#191a24] pb-4 mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Le courrier des stagiaires</>)}</h3>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MANIFEST.avis.map((a, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="h-full flex flex-col">
                  <blockquote className="font-serif italic text-xl leading-relaxed text-[#191a24]/80 mb-6 flex-1">
                    « {a.text} »
                  </blockquote>
                  <figcaption className="text-[10px] font-bold uppercase tracking-widest text-[#191a24]/50 border-t border-[#191a24]/10 pt-4">
                    {a.author}{a.detail ? ` — ${a.detail}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── FAQ — financements & pratique ─────────────────────────────── */}
        <section className="py-32 max-w-[800px] mx-auto px-6 border-t border-[#191a24]/10" id="faq">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-4xl font-serif mb-4">{/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>Financements & questions</>)}</h2>
              <p className="text-[#191a24]/60 italic font-serif">Prise en charge, distanciel, attestations, accessibilité.</p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              {MANIFEST.faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-[#191a24]/10">
                  <AccordionTrigger className="text-lg font-serif py-6 hover:text-[var(--brand,#3d4bc9)] hover:no-underline text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#191a24]/70 leading-relaxed pb-6 text-sm">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* ─── CONTACT ───────────────────────────────────────────────────── */}
        <section id="contact" className="py-24 bg-[#ececf2] border-y border-[#191a24]/10">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <Reveal>
              <Newspaper className="w-10 h-10 mx-auto text-[var(--brand,#3d4bc9)] mb-8" />
              <h2 className="text-4xl md:text-5xl font-serif mb-6">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Parler de votre projet de formation</>)}</h2>
              <p className="text-[#191a24]/70 max-w-lg mx-auto mb-10 font-serif italic text-lg">
                Un besoin, un effectif, une échéance : nous vous répondons sous deux jours ouvrés avec un programme et un devis — jamais un formulaire de plus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a href={telHref} className="inline-flex items-center justify-center gap-2 bg-[#191a24] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[var(--brand,#3d4bc9)] transition-colors">
                  <Phone className="w-4 h-4" /> {tel}
                </a>
                <a href={`mailto:${mail}`} className="inline-flex items-center justify-center gap-2 border border-[#191a24]/20 bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-[var(--brand,#3d4bc9)] hover:text-[var(--brand,#3d4bc9)] transition-colors">
                  <Mail className="w-4 h-4" /> Écrire
                </a>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#191a24]/50 flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {clientCodePostalVille(sessionData, "75011", "Paris")} · sessions à distance partout en France
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#191a24] text-[#f6f6f9]/60 pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-24">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#f6f6f9] mb-6" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
              {clientName(sessionData) ?? c?.heroHeadline ?? "Chronicle."}
            </h1>
            <p className="max-w-sm text-sm font-serif italic leading-relaxed mb-8">
              Organisme de formation professionnelle. Des sessions courtes, des formateurs de terrain, des acquis évalués — le savoir traité avec le sérieux d'une rédaction.
            </p>
            <p className="max-w-sm text-[10px] font-bold uppercase tracking-widest leading-relaxed text-[#f6f6f9]/40">
              Déclaration d'activité enregistrée auprès du préfet de région — cet enregistrement ne vaut pas agrément de l'État.
            </p>
          </div>

          <div>
            <h4 className="text-[#f6f6f9] text-xs font-bold uppercase tracking-widest mb-6">Domaines</h4>
            <ul className="space-y-4 text-sm font-serif">
              {["Management", "Bureautique & digital", "Langues", "Prévention & sécurité", "Efficacité professionnelle"].map(link => (
                <li key={link}><Link href="#catalogue" className="hover:text-[#8a94e8] transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#f6f6f9] text-xs font-bold uppercase tracking-widest mb-6">L'organisme</h4>
            <ul className="space-y-4 text-sm font-serif">
              {[["La formation phare", "#hero"], ["Dates inter", "#sessions"], ["Formats & tarifs", "#formats"], ["Financements", "#faq"], ["Contact", "#contact"]].map(([link, ancre]) => (
                <li key={link}><Link href={ancre} className="hover:text-white transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#f6f6f9] text-xs font-bold uppercase tracking-widest mb-6">Coordonnées</h4>
            <ul className="space-y-4 text-sm font-serif">
              <li><a href={telHref} className="hover:text-white transition-colors">{tel}</a></li>
              <li><a href={`mailto:${mail}`} className="hover:text-white transition-colors break-all">{mail}</a></li>
              <li>{clientCodePostalVille(sessionData, "75011", "Paris")}</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-[#f6f6f9]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest">
          <div>© {clientName(sessionData) ?? "Chronicle Formation"}{/* VILLE_PIED */}{clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""} · Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#contact" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-white transition-colors">CGV</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Accessibilité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
