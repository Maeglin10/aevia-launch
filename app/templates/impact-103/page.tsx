"use client";
import { resolveList } from "@/lib/templates/resolveList";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scale, ArrowRight, Menu, Star, Shield, Gavel, Briefcase, Landmark, Globe, ChevronRight, Quote, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  clientCity,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTeam,
  clientText,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les avis, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const AVIS_INLINE_SOURCE = [
  { quote: "Lumina Law navigated our cross-border merger with precision and discretion. Their partners think like strategists, not just lawyers. The outcome exceeded expectations at every level.", name: "C. Harding", title: "CFO · Global Ventures Ltd" },
                { quote: "When we faced a regulatory crisis, their team assembled overnight and had a response strategy by morning. Lumina's institutional knowledge is unmatched in our industry.", name: "P. Nkosi", title: "CEO · Meridian Industries" },
                { quote: "We've retained Lumina for eight years across litigation, M&A, and regulatory matters. They have become an indispensable extension of our executive leadership.", name: "S. Fontaine", title: "General Counsel · Arcadia Group" }
];
let AVIS_INLINE = AVIS_INLINE_SOURCE;


// L'équipe, jusqu'ici écrit(e)s dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const EQUIPE_INLINE_SOURCE = [
  { name: "Eleanor Voss", title: "Managing Partner", focus: "M&A · Corporate Governance", called: "1994", initials: "EV" },
                { name: "David Osei", title: "Senior Partner", focus: "Litigation · Dispute Resolution", called: "2001", initials: "DO" },
                { name: "Margaux Petit", title: "Partner", focus: "Regulatory · Compliance", called: "2008", initials: "MP" },
                { name: "James Lim", title: "Partner", focus: "Tax · International Structuring", called: "2010", initials: "JL" }
];
let EQUIPE_INLINE = EQUIPE_INLINE_SOURCE;

let c: any = null;
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
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

// Every nav item pointed at #services, including "Partners" while a #partners
// section existed. Two of the four had no section at all.
const NAV = [
  { l: "Expertise", h: "#services" },
  { l: "Partners", h: "#partners" },
  { l: "Insights", h: "#insights" },
  { l: "Case Studies", h: "#cases" },
];

const INSIGHTS = [
  { k: "Corporate", t: "The earn-out clause that survives a downturn", d: "Three quarters of the disputes we see on acquisitions start in the same paragraph. What we now insist on drafting differently." },
  { k: "Litigation", t: "Why we settle more cases than we try", d: "A 98% trial record is only meaningful next to the cases that never reached a courtroom. The arithmetic, in full." },
  { k: "Regulatory", t: "DORA: what actually changed in January", d: "Financial entities operating in the EU now answer for their ICT suppliers. The obligations that carry real penalties." },
  { k: "Cross-border", t: "Enforcing an English judgment after Brexit", d: "The Hague 2019 route, its exclusions, and where a fresh action in the local court is still faster." },
];

const CASES = [
  { s: "Corporate", t: "€2.1bn cross-border consolidation", d: "Fourteen jurisdictions, eleven months, one regulator holding it up until the last week. Closed without a price adjustment." },
  { s: "Litigation", t: "Shareholder claim dismissed at first instance", d: "A €340m derivative action against a listed board. Struck out on standing before the merits were ever argued." },
  { s: "Restructuring", t: "Scheme of arrangement, 1,900 creditors", d: "Court-sanctioned in under six months, with 94% approval in the largest class." },
  { s: "Regulatory", t: "Dawn raid to closed file in nine months", d: "A competition authority inspection across three offices. No fine, no commitments, no publication." },
];

const EXPERTISE_DEMO = [
  { icon: Gavel, title: "High-Stakes Litigation", desc: "Aggressive representation in complex civil and criminal proceedings with a track record of landmark victories." },
  { icon: Briefcase, title: "Strategic M&A", desc: "Navigating multi-billion dollar transactions with surgical precision and cross-border expertise." },
  { icon: Landmark, title: "Regulatory Affairs", desc: "Shaping the landscape of tomorrow through deep-level engagement with legislative and regulatory bodies." },
]
let EXPERTISE = EXPERTISE_DEMO;

function PARTNERS_DEMO_SOURCE_LIVE() {
  return [
  { name: "Julian Thorne", role: "Managing Partner", focus: "Global Litigation", img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800") },
  { name: "Elena Rossi", role: "Senior Partner", focus: "M&A / Private Equity", img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800") },
  { name: "Marcus Vane", role: "Senior Partner", focus: "International Law", img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800") },
];
}
let PARTNERS_DEMO_SOURCE = PARTNERS_DEMO_SOURCE_LIVE();
let PARTNERS_DEMO = PARTNERS_DEMO_SOURCE;
let PARTNERS = PARTNERS_DEMO;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function LuminaLawPage() {
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
  PARTNERS_DEMO_SOURCE = PARTNERS_DEMO_SOURCE_LIVE();

  PARTNERS_DEMO = resolveList(
    clientTeam(session)?.map((m: any, i: number) => ({ ...PARTNERS_DEMO_SOURCE[i % PARTNERS_DEMO_SOURCE.length], name: m.name, role: m.role })),
    PARTNERS_DEMO_SOURCE,
  );

  AVIS_INLINE = resolveList(

    clientReviews(session)?.map((r: any, i: number) => ({

      ...AVIS_INLINE_SOURCE[i % AVIS_INLINE_SOURCE.length],

      quote: r.text, name: r.author,

    })),

    AVIS_INLINE_SOURCE,

  );

  EQUIPE_INLINE = resolveList(

    clientTeam(session)?.map((m: any, i: number) => ({

      ...EQUIPE_INLINE_SOURCE[i % EQUIPE_INLINE_SOURCE.length],

      name: m.name, title: m.role,

    })),

    EQUIPE_INLINE_SOURCE,

  );
  EXPERTISE = resolveList(
    clientServices(session)?.map((s, i) => ({ ...EXPERTISE_DEMO[i % EXPERTISE_DEMO.length], title: s.title })),
    EXPERTISE_DEMO,
  );
  PARTNERS = PARTNERS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[0 + i] || row.img,
  }));

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 2;
    const _photoArrays: any[] = [PARTNERS];
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

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] font-sans min-h-dvh selection:bg-[var(--brand,#1a365d)] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-8"}`}>
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
                <div className="w-10 h-10 bg-[var(--brand,#1a365d)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-[var(--brand,#1a365d)]">{/* NOM_LOGO */ clientName(sessionData) ?? (<>Lumina<span className="font-light">Law</span></>)}</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#1a365d)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-black/40 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors">Client Portal</button>
            <button className="px-8 py-3 bg-[var(--brand,#1a365d)] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#2c5282] transition-all duration-500">Consultation</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-black" /></SheetTrigger>
              <SheetContent side="right" className="bg-white border-black/5 p-12 text-black">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {[...NAV, { l: "Contact", h: "#contact" }].map(({ l, h }) => (
                    <Link key={l} href={h} className="text-3xl font-bold tracking-tighter hover:text-[var(--brand,#1a365d)] transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative min-h-dvh flex items-center pt-24 pb-10 md:pt-32 md:pb-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-5 md:mb-10">
                     <div className="w-12 h-[2px] bg-[var(--brand,#1a365d)]" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1a365d)]">{clientEyebrow(sessionData) ?? "Elite Legal Counsel"}</span>
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-5xl sm:text-6xl md:text-[9rem] font-bold tracking-tighter leading-[0.95] md:leading-[0.8] text-[#1a1a1a] mb-6 md:mb-12 uppercase break-words" style={{ fontFamily: "serif" }}>{<>{clientHeroLine(sessionData, 0, 2, 9) ?? "Power"}<br/> <span className="text-[var(--brand,#1a365d)] font-light italic italic-none">{clientHeroLine(sessionData, 1, 2, 9) ?? "In Truth."}</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-base md:text-xl text-black/60 font-light max-w-lg leading-relaxed mb-6 md:mb-12">{clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? <>
                    Lumina Law is a high-stakes firm dedicated to complex litigation and corporate strategy. When the outcome defines your legacy, we are the standard.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-8">
                    <button className="px-12 py-5 bg-[var(--brand,#1a365d)] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all duration-700">
                       Meet The Partners
                    </button>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group">
                       Our Success Map <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.5} y={0}>
                 <div className="relative hidden lg:block">
                    <div className="absolute -inset-10 bg-[var(--brand,#1a365d)]/5 blur-[100px] rounded-full" />
                    <div className="relative aspect-[4/5] bg-white border border-black/5 p-3 rounded-sm shadow-2xl">
                       <ParallaxImg src={photo(3, "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200")} alt="Law Office" />
                       <div className="absolute bottom-10 left-10 p-10 bg-white border border-black/5 w-72 hidden md:block shadow-xl">
                          <Quote className="w-8 h-8 mb-6 text-[var(--brand,#1a365d)]/20" />
                          <p className="text-sm italic font-light leading-relaxed mb-4" style={{ fontFamily: "serif" }}>"Integrity is the only foundation upon which true victory can be built."</p>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#1a365d)]">Julian Thorne — Founding Partner</div>
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── EXPERTISE ─────────────── */}
        <section className="py-40 bg-white border-y border-black/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-32">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#1a365d)] block mb-6">Our Dominance</span>
                 <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>Practice <span className="font-light italic">Areas.</span></>)}</h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {EXPERTISE.map((e, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-12 bg-[#fafafa] border border-black/5 hover:border-[var(--brand,#1a365d)]/20 transition-all duration-700 group h-full">
                    <div className="w-16 h-16 bg-white border border-black/5 flex items-center justify-center mb-10 group-hover:bg-[var(--brand,#1a365d)] transition-all duration-700">
                      <e.icon className="w-6 h-6 text-[var(--brand,#1a365d)] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight" style={{ fontFamily: "serif" }}>{e.title}</h3>
                    <p className="text-black/40 leading-relaxed text-sm font-light mb-10">{e.desc}</p>
                    <Link href="#hero" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#1a365d)] group-hover:gap-6 transition-all">
                       {tr({ formData: fd }, "Learn More")} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERS ──────────────── */}
        <section id="partners" className="py-40 bg-[#fafafa]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1a365d)] block mb-4">Leadership</span>
                  <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-[#1a1a1a]" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "partners.titre") ?? (<>The <span className="italic font-light">Partners.</span></>)}</h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/20 mb-2">120+ Years of Combined Experience</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {PARTNERS.map((p, i) => (
                <Reveal key={i} delay={i * 0.2}>
                  <div className="group">
                    <div className="relative aspect-[4/5] mb-10 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden">
                      <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand,#1a365d)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center">
                       <h3 className="text-3xl font-bold uppercase tracking-tight mb-2" style={{ fontFamily: "serif" }}>{p.name}</h3>
                       <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#1a365d)] mb-4">{p.role}</div>
                       <p className="text-sm text-black/40 font-light italic">{p.focus}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS / PHILOSOPHY ────── */}
        <section id="services" className="py-40 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--brand,#1a365d)]/5 -skew-x-12 translate-x-1/4" />
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <h2 className="text-5xl md:text-7xl font-bold uppercase text-[#1a1a1a] mb-16" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>A Legacy <br/> Of <span className="italic font-light text-[var(--brand,#1a365d)]">Excellence.</span></>)}</h2>
                       <div className="space-y-12">
                          {[
                            { v: "$40B+", l: "Transaction Volume Handled", d: "Expertise in large-scale corporate consolidation and global capital flows." },
                            { v: "98%", l: "Trial Success Rate", d: "Preparation is our strongest weapon. We never step into a courtroom we haven't already mastered." },
                            { v: "14", l: "Global Jurisdictions", d: "A truly international reach with local expertise in key financial hubs." }
                          ].map((s, idx) => (
                            <div key={idx} className="flex gap-10">
                               <div className="text-5xl font-bold text-[var(--brand,#1a365d)] shrink-0 w-32">{s.v}</div>
                               <div>
                                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{s.l}</h4>
                                  <p className="text-sm text-black/40 font-light leading-relaxed">{s.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <Reveal delay={0.3}>
                    <div className="aspect-[4/5] relative border border-black/5 p-4 bg-[#fafafa]">
                       <ParallaxImg src={photo(4, "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200")} alt="Legal Gavel" />
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--brand,#1a365d)] flex items-center justify-center text-white p-8 text-center rounded-sm shadow-2xl">
                          <div className="text-[10px] font-bold uppercase tracking-[0.3em]">Established 1984</div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section className="py-40 bg-[#fafafa] border-t border-black/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#1a365d)]/40 mb-6">Client Testimonials</p>
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--brand,#1a365d)] mb-20 leading-tight" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
                What Our Clients <em className="font-light">Say.</em>
              </>)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {AVIS_INLINE.map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="bg-white p-10 border border-black/5 flex flex-col gap-6 h-full">
                    <Quote className="w-6 h-6 text-[var(--brand,#1a365d)]/20" />
                    <p className="text-[#4a5568] leading-relaxed italic flex-1 text-base">{t.quote}</p>
                    <div className="border-t border-black/5 pt-6">
                      <div className="text-sm font-bold text-[var(--brand,#1a365d)] uppercase tracking-widest">{t.name}</div>
                      <div className="text-xs text-[#718096] tracking-wide mt-1">{t.title}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ATTORNEYS ─────────────── */}
        <section id="equipe" className="py-40 bg-white border-t border-black/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#1a365d)]/40 mb-6">{tr({ formData: fd }, "Our Team")}</p>
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--brand,#1a365d)] mb-20 leading-tight" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "equipe.titre") ?? (<>
                Senior <em className="font-light">Partners.</em>
              </>)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {EQUIPE_INLINE.map((a, i) => (
                <Reveal key={a.name} delay={i * 0.1}>
                  <div className="flex flex-col gap-5">
                    <div className="w-16 h-16 bg-[var(--brand,#1a365d)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{a.initials}</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand,#1a365d)]/40 mb-1">Called {a.called}</div>
                      <h3 className="font-bold text-[var(--brand,#1a365d)] text-lg leading-snug" style={{ fontFamily: "serif" }}>{a.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-[#718096] mt-0.5">{a.title}</p>
                    </div>
                    <p className="text-xs text-[#4a5568] border-t border-black/5 pt-4 leading-relaxed">{a.focus}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        {/* INSIGHTS */}
        <section id="insights" className="py-40 bg-[#f7f7f5]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20 border-b border-black/10 pb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1a365d)] block mb-5">Insights</span>
                <h2 className="text-5xl md:text-7xl font-bold uppercase text-[#1a1a1a]" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "insights.titre") ?? (<>What We <span className="italic font-light text-[var(--brand,#1a365d)]">Publish.</span></>)}</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 border border-black/10">
              {INSIGHTS.map((n, i) => (
                <Reveal key={n.t} delay={i * 0.06}>
                  <article className="bg-[#f7f7f5] p-10 h-full">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1a365d)]">{n.k}</span>
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mt-4 mb-4 leading-snug" style={{ fontFamily: "serif" }}>{n.t}</h3>
                    <p className="text-sm text-black/45 leading-relaxed">{n.d}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDIES */}
        <section id="cases" className="py-40 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20 border-b border-black/10 pb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1a365d)] block mb-5">Case Studies</span>
                <h2 className="text-5xl md:text-7xl font-bold uppercase text-[#1a1a1a]" style={{ fontFamily: "serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "cases.titre") ?? (<>What We <span className="italic font-light text-[var(--brand,#1a365d)]">Closed.</span></>)}</h2>
              </div>
            </Reveal>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {CASES.map((c, i) => (
                <Reveal key={c.t} delay={i * 0.06}>
                  <div className="py-10 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--brand,#1a365d)] pt-2">{c.s}</span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3" style={{ fontFamily: "serif" }}>{c.t}</h3>
                      <p className="text-sm text-black/45 leading-relaxed max-w-[75ch]">{c.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="text-xs text-black/30 mt-10 max-w-[75ch] leading-relaxed">
                Matters are described in outline only. Named parties, figures and jurisdictions are altered or omitted
                wherever the engagement or its settlement remains confidential.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="py-40 bg-[var(--brand,#1a365d)] text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.8] mb-12" style={{ fontFamily: "serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                Define Your <br/> <span className="italic font-light text-white/60">Defense.</span>
              </>}</h2>
              <p className="text-xl text-white/60 font-light mb-16 leading-relaxed">{c?.aboutText ?? <>
                Contact our intake team for a strictly confidential consultation. We handle the complexities so you can focus on your legacy.
              </>}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-white text-[var(--brand,#1a365d)] font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 shadow-2xl">
                   Request Initial Brief
                </button>
                <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                   Global Offices
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-32 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[var(--brand,#1a365d)] flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-[var(--brand,#1a365d)]">Lumina<span className="font-light">Law</span></span>
            </Link>
            <p className="text-black/30 max-w-sm leading-relaxed mb-10 text-sm font-light italic" style={{ fontFamily: "serif" }}>
              "The law is a shield for the righteous and a sword for the strategic. We provide both."
            </p>
            <div className="flex gap-10">
               {[{ l: "LinkedIn", h: "https://linkedin.com" }, { l: "Journal", h: "#insights" }, { l: "Archive", h: "#cases" }, { l: "Contact", h: "#contact" }].map(s => (
                 <Link key={s.l} href={s.h} className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-[var(--brand,#1a365d)] transition-colors">{s.l}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Firm", l: ["Our History", "Expertise", "Partners", "Culture"] },
            { t: "Expertise", l: ["Litigation", "Corporate", "M&A", "Real Estate"] },
            { t: "Resources", l: ["Insights", "Case Studies", "Press", "Alumni"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#1a365d)]">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href={link === "Partners" ? "#equipe" : "#services"} className="text-xs text-black/30 hover:text-black transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-black/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-black/10">
          <span>© 2026 {clientName(sessionData) ?? "LUMINA LAW GLOBAL PARTNERSHIP."} STRENGTH IN TRUTH.{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <div className="flex gap-12">
             <Link href="#contact" className="hover:text-black transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> LONDON · NEW YORK · SINGAPORE</Link>
             <Link href="#contact" className="hover:text-black transition-colors flex items-center gap-2"><FileText className="w-3 h-3" /> LEGAL TERMS</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
