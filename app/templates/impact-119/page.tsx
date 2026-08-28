"use client";
// @ts-nocheck
/*
  impact-119 — IronX Fitness · Marseille. L'infrastructure cloud devient la
  salle qu'on vendait : le terminal de déploiement est désormais le tableau
  de séance, les régions edge des créneaux, les SLA des horaires.
  Geste : WipeReveal — le tableau de la séance se dévoile de gauche à
  droite à chaque changement de discipline (un seul index pilote la
  discipline, le tableau et le compteur ; flèches manuelles + DWELL lent).
  Fontes P6 Archivo + Inter · palette #0f1113 / #d94a26.
  Vendu à 6 métiers (coach, salle de sport, auto-école, crèche, école de
  musique, formation) : tout le contenu passe par le contrat — programmes,
  tarifs, chiffres, avis, accroche — la démo reste la salle du libellé.
*/
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Menu, Dumbbell, Flame, Timer, Activity, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { WipeReveal } from "@/lib/templates/hero-kit-3";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhone,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let sessionData: any = null;
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

/* Le tableau de séance de chaque discipline — la démo de la salle. */
const SEANCES = [
  {
    discipline: "Cross-training",
    heure: "aujourd'hui · 12h30 & 18h30",
    blocs: [
      ["Échauffement", "rameur 3 min + mobilité épaules"],
      ["Force", "5 × 5 soulevé de terre, montée progressive"],
      ["Metcon 12 min", "12 wall balls · 9 tractions · 6 burpees"],
      ["Retour au calme", "gainage + respiration, 5 min"],
    ],
  },
  {
    discipline: "Boxe pieds-poings",
    heure: "aujourd'hui · 19h30",
    blocs: [
      ["Corde & mobilité", "3 rounds de 2 min"],
      ["Technique", "enchaînement jab-cross-low kick au sac"],
      ["Sparring léger", "4 rounds de 2 min, casque obligatoire"],
      ["Abdos-lombaires", "circuit au sol, 8 min"],
    ],
  },
  {
    discipline: "Haltérophilie",
    heure: "aujourd'hui · 17h30",
    blocs: [
      ["Barre à vide", "arraché — placement et trajectoire"],
      ["Technique", "épaulé-jeté 6 × 2 à 70 %"],
      ["Force", "squat clavicule 4 × 4"],
      ["Accessoires", "tirages + gainage lesté"],
    ],
  },
];

const PROGRAMMES_DEMO = [
  { title: "Cross-training", desc: "Force, cardio et gym : la séance encadrée qui change chaque jour, en groupe de douze maximum.", icon: Flame },
  { title: "Boxe pieds-poings", desc: "Technique, sac et sparring maîtrisé — du premier cours de découverte à la préparation compétition.", icon: Activity },
  { title: "Haltérophilie & force", desc: "Arraché, épaulé-jeté, squat : le plateau complet et des coachs qui corrigent chaque barre.", icon: Dumbbell },
]

const STATS_DEMO = [
  { value: "600 m²", label: "de plateau" },
  { value: "40+", label: "cours par semaine" },
  { value: "6h — 23h", label: "sept jours sur sept" },
  { value: "12", label: "coachs diplômés" },
]

export default function IronXFitnessPage() {
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
  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;

  const PROGRAMMES = resolveList(
    clientServices(sessionData)?.map((sv: any, i: number) => ({
      ...PROGRAMMES_DEMO[i % PROGRAMMES_DEMO.length],
      title: sv.title,
      desc: sv.desc || PROGRAMMES_DEMO[i % PROGRAMMES_DEMO.length].desc,
    })),
    PROGRAMMES_DEMO,
  );
  const STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)
  /* Un seul index : la discipline pilote le tableau, l'étiquette et le compteur. */
  const { i: seance, next: seanceSuivante, prev: seancePrecedente } = useSlides(SEANCES.length, DWELL.slow);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  const TESTIMONIALS_DEMO = [
    { quote: "Un an de cross-training, moins douze kilos et un dos qui ne se plaint plus. Les coachs corrigent chaque mouvement, tout le temps.", name: "Karim B.", title: "adhérent depuis 2024" },
    { quote: "Je suis arrivée sans jamais avoir mis les pieds dans une salle. Le groupe de midi est devenu mon rendez-vous non négociable.", name: "Laure T.", title: "cours de midi" },
    { quote: "Le plateau d'haltéro est le mieux équipé que j'aie vu à Marseille — et on t'y apprend vraiment la technique.", name: "Nicolas V.", title: "haltérophilie" },
  ];
  const TESTIMONIALS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      quote: r.text ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].quote,
      name: r.name ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].name,
      title: r.location ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].title,
    })),
    TESTIMONIALS_DEMO
  );

  const ville = clientCity(sessionData) ?? "Marseille";
  const tel = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "04 91 20 45 45";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@ironx-fitness.fr";
  const S = SEANCES[seance];

return (
    <div className="i119 bg-[#0f1113] text-white min-h-dvh selection:bg-[var(--brand,#d94a26)] selection:text-white overflow-x-clip" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        .i119 h1, .i119 h2, .i119 h3, .i119 h4, .i119 .titre { font-family: 'Archivo', Inter, sans-serif; }
      `}</style>

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0f1113]/85 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
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
                <div className="w-10 h-10 bg-[var(--brand,#d94a26)] flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase titre">
                  {fd?.businessName ? fd.businessName : <>Iron<span className="text-[var(--brand,#d94a26)]">X</span></>}
                </span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {[["Programmes", "#programmes"], ["Encadrement", "#coaching"], ["Tarifs", "#tarifs"], ["Contact", "#contact"]].map(([l, a]) => (
              <Link key={l} href={a} className="hover:text-[var(--brand,#d94a26)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href={telHref} className="hidden md:block px-6 py-2.5 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{tel}</a>
            <Link href="#contact" className="px-4 py-2 md:px-6 md:py-2.5 bg-[var(--brand,#d94a26)] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#b83a1c] transition-all shadow-[0_0_20px_rgba(217,74,38,0.3)] whitespace-nowrap">Séance d'essai</Link>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0f1113] border-white/5 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {[["Programmes", "#programmes"], ["Encadrement", "#coaching"], ["Tarifs", "#tarifs"], ["Avis", "#avis"], ["Contact", "#contact"]].map(([l, a]) => (
                    <Link key={l} href={a} className="text-2xl font-black uppercase tracking-widest hover:text-[var(--brand,#d94a26)] transition-colors titre">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO — H5 : rail latéral, titre bloc, tableau de séance ────── */}
        <section id="hero" className="relative min-h-dvh flex items-center pt-32 pb-20 overflow-hidden">
          {/* Repli sans photo : halos braise + trame de plateau dessinée. */}
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[var(--brand,#d94a26)]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[var(--brand,#d94a26)]/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 118px, rgba(255,255,255,0.5) 118px 120px)" }} />
          </div>

          {/* Le rail latéral — vertical, comme la ligne de craie du tableau. */}
          <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-10" aria-hidden>
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-[var(--brand,#d94a26)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 [writing-mode:vertical-rl]">{clientEyebrow(sessionData) ?? `Salle de sport · ${ville}`}</span>
            <div className="w-px h-24 bg-gradient-to-t from-transparent to-[var(--brand,#d94a26)]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">{<>{clientHeroLine(sessionData, 0, 3, 9) ?? "Soulever."}<br/>{clientHeroLine(sessionData, 1, 3, 9) ?? "Frapper."}<br/><span className="text-[var(--brand,#d94a26)]">{clientHeroLine(sessionData, 2, 3, 9) ?? "Tenir."}</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-xl text-slate-400 font-light max-w-lg leading-relaxed mb-10">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                    Cross-training, boxe et haltérophilie sous le même toit, encadrés par des coachs diplômés d'État. Pas de miroir à selfies — un plateau, des barres, un programme.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-wrap gap-4">
                    <Link href="#contact" className="px-10 py-4 bg-white text-[#0f1113] font-bold hover:bg-[var(--brand,#d94a26)] hover:text-white transition-all duration-500 shadow-xl uppercase text-sm tracking-wide">
                      Réserver la séance d'essai
                    </Link>
                    <Link href="#programmes" className="px-10 py-4 border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2 uppercase text-sm tracking-wide">
                      Les programmes
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Le tableau de séance — WipeReveal : la craie se tire de gauche
                  à droite quand la discipline change. */}
              <Reveal delay={0.4} y={30}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[var(--brand,#d94a26)]/15 blur-2xl" aria-hidden />
                  <div className="relative p-1 bg-gradient-to-br from-[var(--brand,#d94a26)]/30 to-white/5 border border-white/10">
                    <div className="bg-[#15171a] p-6 border border-white/5 overflow-hidden">
                      <div className="flex items-center justify-between mb-6 gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Le tableau du jour</span>
                        <div className="flex items-center gap-2">
                          <button onClick={seancePrecedente} aria-label="Discipline précédente" className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[var(--brand,#d94a26)] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                          <span className="text-[10px] font-bold tabular-nums text-white/30 w-10 text-center">{seance + 1} / {SEANCES.length}</span>
                          <button onClick={seanceSuivante} aria-label="Discipline suivante" className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[var(--brand,#d94a26)] transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <WipeReveal index={seance}>
                        <div>
                          <div className="flex items-baseline justify-between gap-4 mb-5 border-b border-white/10 pb-4">
                            <h3 className="text-2xl font-black uppercase tracking-tight">{S.discipline}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#d94a26)] whitespace-nowrap">{S.heure}</span>
                          </div>
                          <div className="space-y-3 font-mono text-sm leading-relaxed">
                            {S.blocs.map(([t, d], i) => (
                              <div key={i} className="flex gap-4">
                                <span className="text-[var(--brand,#d94a26)] shrink-0 w-32 uppercase text-xs font-bold tracking-wide pt-0.5">{t}</span>
                                <span className="text-slate-400">{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </WipeReveal>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CHIFFRES — les KPI de la salle ─────────── */}
        <section className="py-20 border-y border-white/5 bg-[#121417]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {STATS.map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-3xl md:text-4xl font-black text-[var(--brand,#d94a26)] mb-1 titre">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROGRAMMES ────────── */}
        <section id="programmes" className="py-32 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#d94a26)] block mb-4">Programmes</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "programmes.titre") ?? (<>Trois écoles, <span className="text-[var(--brand,#d94a26)]">un plateau.</span></>)}</h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROGRAMMES.map((n, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group p-10 bg-[#15171a] border border-white/5 hover:border-[var(--brand,#d94a26)]/40 transition-all duration-500 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden>
                      <n.icon className="w-32 h-32" />
                    </div>
                    <div className="w-14 h-14 bg-[#0f1113] flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      <n.icon className="w-6 h-6 text-[var(--brand,#d94a26)]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{n.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">{n.desc}</p>
                    <Link href="#tarifs" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#d94a26)] group-hover:gap-4 transition-all">
                      Voir les formules <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENCADREMENT ──────────────── */}
        <section id="coaching" className="py-32 bg-gradient-to-b from-[#121417] to-[#0f1113]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <Reveal>
                {/* Le cadran d'effort — dessiné, pas photographié. */}
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-[var(--brand,#d94a26)]/15 blur-[100px] rounded-full" aria-hidden />
                  <div className="relative h-full flex items-center justify-center">
                    <div className="w-64 h-64 border border-[var(--brand,#d94a26)]/25 rounded-full flex items-center justify-center">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--brand,#d94a26)] flex items-center justify-center"><Dumbbell className="w-4 h-4" /></div>
                    </div>
                    <div className="absolute w-40 h-40 border border-white/15 rounded-full flex items-center justify-center">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-9 h-9 bg-white text-[#0f1113] flex items-center justify-center"><Flame className="w-4 h-4" /></div>
                    </div>
                    <Timer className="w-16 h-16 text-[var(--brand,#d94a26)]" />
                  </div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#d94a26)] block mb-4">Encadrement</span>
                  <h2 className="text-5xl font-black tracking-tighter mb-8 uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "coaching.titre") ?? (<>Coachés, <span className="text-[var(--brand,#d94a26)] italic">vraiment.</span></>)}</h2>
                  <div className="space-y-6">
                    {[
                      { t: "Diplômés d'État", d: "Chaque cours est mené par un coach BPJEPS ou STAPS — pas par une vidéo projetée au mur." },
                      { t: "Douze par cours, pas plus", d: "Les groupes sont plafonnés pour que chaque barre, chaque garde, chaque posture soit corrigée." },
                      { t: "Un suivi qui dure", d: "Bilan d'entrée, objectifs posés, point mensuel : la progression s'écrit, elle ne se devine pas." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand,#d94a26)] mt-2 shrink-0" />
                        <div>
                          <h4 className="font-bold mb-1">{item.t}</h4>
                          <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── AVIS ──────────── */}
        <section id="avis" className="py-40 bg-[#0f1113] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#d94a26)]/60 mb-6">Ils s'entraînent ici</p>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-20 leading-tight tracking-tight uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
                Ce que dit <span className="text-white/20 font-light">le vestiaire.</span>
              </>)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {TESTIMONIALS.map((t: any, i: number) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#0f1113] p-12 flex flex-col gap-6 hover:bg-[#121417] transition-colors h-full">
                    <div className="flex gap-1" aria-hidden>
                      {[...Array(5)].map((_, s) => <span key={s} className="text-[var(--brand,#d94a26)] text-xs">★</span>)}
                    </div>
                    <p className="text-white/40 leading-relaxed italic flex-1">{t.quote}</p>
                    <div className="border-t border-white/5 pt-6">
                      <div className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-[10px] text-[var(--brand,#d94a26)]/60 tracking-wide mt-1">{t.title}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARIFS ───────────────── */}
        <section id="tarifs" className="py-40 bg-[#121417] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#d94a26)]/60 mb-6">Tarifs</p>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>
                Sans engagement <span className="text-white/20 font-light">caché.</span>
              </>)}</h2>
              <p className="text-white/30 mb-20 max-w-lg leading-relaxed">Pas de frais de dossier, pas de reconduction piégée. On vient, on s'entraîne, on reste parce qu'on progresse.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {/* TARIFS */ resolveList(clientServices(sessionData)?.map((s: any) => ({ name: s.title, ...(s.price ? { price: s.price } : {}) })), [
                { name: "Accès libre", price: "34 €", unit: "/mois", highlight: false, features: ["Plateau libre 6h-23h", "Vestiaires et douches", "Bilan d'entrée offert", "Sans engagement"] },
                { name: "Accès + cours", price: "54 €", unit: "/mois", highlight: true, features: ["Tous les cours collectifs", "Plateau libre 6h-23h", "Réservation par appli", "Point mensuel avec un coach", "Sans engagement"] },
                { name: "Coaching perso", price: "Sur devis", unit: "", highlight: false, features: ["Programme individuel", "Séances en tête-à-tête", "Suivi nutrition possible", "Objectif daté et mesuré"] },
              ]).map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1}>
                  <div className={`p-12 flex flex-col gap-6 h-full ${p.highlight ? "bg-[var(--brand,#d94a26)]" : "bg-[#0f1113]"}`}>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">{p.name}</div>
                      <div className="text-4xl font-bold text-white">{p.price}<span className="text-base font-light text-white/40">{p.unit}</span></div>
                    </div>
                    <ul className="flex flex-col gap-3 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                          <Activity className="w-3 h-3 flex-shrink-0" style={{ color: p.highlight ? "#fff" : "var(--brand,#d94a26)" }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="#contact" className={`text-[10px] uppercase tracking-widest font-bold py-3 px-6 text-center border ${p.highlight ? "border-white text-white hover:bg-white hover:text-[var(--brand,#d94a26)]" : "border-[var(--brand,#d94a26)]/40 text-[var(--brand,#d94a26)] hover:border-[var(--brand,#d94a26)]"} transition-colors`}>
                      Commencer
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────── */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--brand,#d94a26)]/5" aria-hidden />
          <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>La première séance<br/>est <span className="text-[var(--brand,#d94a26)]">offerte.</span></>)}</h2>
              <p className="text-xl text-slate-400 font-light mb-12">{c?.ctaText ?? "Venez avec une tenue et une bouteille d'eau — on s'occupe du reste. Un coach vous accueille, évalue votre niveau et vous met dans le bon groupe."}</p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <a href={telHref} className="inline-flex items-center gap-2 px-12 py-5 bg-[var(--brand,#d94a26)] text-white font-bold hover:bg-[#b83a1c] transition-all shadow-2xl shadow-[var(--brand,#d94a26)]/20 uppercase text-sm tracking-wide">
                  <Phone className="w-4 h-4" /> {tel}
                </a>
                <a href={`mailto:${mail}`} className="inline-flex items-center gap-2 px-12 py-5 border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase text-sm tracking-wide">
                  <Mail className="w-4 h-4" /> Écrire
                </a>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {clientCodePostalVille(sessionData, "13006", "Marseille")}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#0c0e10] pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[var(--brand,#d94a26)] flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase titre">
                {fd?.businessName ? fd.businessName : <>Iron<span className="text-[var(--brand,#d94a26)]">X</span></>}
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-8">{c?.aboutText ?? <>
              La salle de {ville} où l'on apprend avant de charger. Cross-training, boxe et haltérophilie, encadrés du premier squat au premier podium.
            </>}</p>
            <div className="flex gap-4">
              {/* LISTE_LIBELLES */ (clientList(sessionData, "contact.liste1") ?? ["instagram", "facebook", "strava"]).map(s => (
                <div key={s} className="w-10 h-10 bg-[#15171a] border border-white/5 flex items-center justify-center hover:bg-[#1a1d21] transition-colors cursor-pointer text-slate-400 hover:text-white uppercase text-[10px] font-bold tracking-widest">{s.slice(0, 2)}</div>
              ))}
            </div>
          </div>
          {[
            { t: "La salle", l: [["Programmes", "#programmes"], ["Encadrement", "#coaching"], ["Tarifs", "#tarifs"], ["Avis", "#avis"]] },
            { t: "Pratique", l: [["Séance d'essai", "#contact"], ["Nous trouver", "#contact"], ["Nous appeler", telHref]] },
            { t: "Contact", l: [[tel, telHref], [mail, `mailto:${mail}`], [clientCodePostalVille(sessionData, "13006", "Marseille"), "#contact"]] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#d94a26)] mb-8">{col.t}</h4>
              <ul className="space-y-4">
                {col.l.map(([link, href]) => <li key={link}><a href={href} className="text-sm text-slate-500 hover:text-white transition-colors break-all">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>© {clientName(sessionData) ?? "IronX Fitness"}{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} · Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /></span>
          <div className="flex gap-8">
            <Link href="#contact" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-white transition-colors">CGV</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Règlement intérieur</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
