"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Reveal,
  rafraichirPartage,
} from "./shared";
import { resolveList } from "@/lib/templates/resolveList";
import {
  DWELL,
  useSlides,
  BlurThrough,
  Retint,
  SlideIndex,
  HairlineArrows,
} from "@/lib/templates/hero-kit-2";
import { MosaicPush } from "@/lib/templates/hero-kit-3";
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTeam,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;

// ─── Demo content — real data (businessProfile) replaces these wholesale via
// resolveList when the client provided it; each field access below falls
// back with `??` so the same JSX renders either shape (see WIZARD_DESIGN
// .local.md § MAPPING template→champ for the field-by-field rationale).
const PROTOCOLES_DEMO = [
  { num: "01", title: "Médecine faciale", desc: "Injection de toxine botulique, acide hyaluronique, techniques de volumisation et repositionnement sans acte chirurgical. Résultats naturels garantis.", duration: "45 min", recovery: "0 jour" },
  { num: "02", title: "Lasers & Lumières", desc: "Traitements photodynamiques, lasers fractionnels CO₂, épilation définitive et rajeunissement cutané par technologie IPL de dernière génération.", duration: "60 min", recovery: "1–2 jours" },
  { num: "03", title: "Corps & Silhouette", desc: "Cryolipolyse, radiofréquence multipôlaire, HIFU corporel et drainage lymphatique instrumental pour un remodelage non-invasif durable.", duration: "90 min", recovery: "0 jour" },
  { num: "04", title: "Soin du visage médical", desc: "Peelings chimiques de profondeur modulable, mésothérapie, HydraFacial MD et protocols anti-âge sur mesure selon diagnostic cutané.", duration: "60 min", recovery: "0–3 jours" },
  { num: "05", title: "Médecine régénérative", desc: "PRP autologue, injections de polynucléotides, exosomes et bio-stimulateurs de collagène pour une régénération cellulaire profonde.", duration: "45 min", recovery: "2 jours" },
  { num: "06", title: "Programmes Sur-Mesure", desc: "Après bilan photo-morphologique complet par notre équipe médicale, nous élaborons un protocole global sur 3 à 6 mois adapté à vos objectifs spécifiques.", duration: "Sur devis", recovery: "Variable" },
];

const TEMOIGNAGES_SOURCE = [
  { name: "Sophia T.", protocol: "Médecine faciale", text: "Pour la première fois depuis des années, je me regarde dans le miroir avec plaisir. Le Dr Nakamura a compris exactement ce que je voulais — pas plus, pas moins. Le résultat est d'une discrétion absolue." },
  { name: "Claire B.", protocol: "Laser CO₂ fractionnel", text: "Après 2 séances, mes cicatrices d'acné ont pratiquement disparu. L'équipe m'a accompagnée avec une vraie attention médicale, pas commerciale. Cypher Clinic est la meilleure décision que j'ai prise pour ma peau." },
  { name: "Marc D.", protocol: "Programme sur-mesure", text: "Je m'attendais à des résultats modestes. Ce que j'ai obtenu en 4 mois dépasse tout ce que j'aurais pu imaginer. Le protocole était vraiment pensé pour mon visage spécifiquement — j'ai senti la différence." },
];
let TEMOIGNAGES_DEMO = TEMOIGNAGES_SOURCE;

function MEDECINS_DEMO_LIVE() {
  return [
  { name: "Dr. Kenji Nakamura", spec: "Médecine esthétique faciale", exp: "14 ans", bio: "Formé à l'Académie de médecine esthétique de " + (clientCity(sessionData) ?? "Paris") + ". Spécialiste des techniques d'injection ultra-précises et de la morphologie faciale.", badge: "Certifié AME" },
  { name: "Dr. Sophie Bellamy", spec: "Laser & Régénération cutanée", exp: "9 ans", bio: "Docteure en dermatologie, IDRM " + (clientCity(sessionData) ?? "Lausanne") + ". Experte des protocoles laser CO₂ et PRP pour les cicatrices et le vieillissement cutané.", badge: "Dermatologie" },
  { name: "Dr. Malik Osei", spec: "Corps & Médecine anti-âge", exp: "11 ans", bio: "Médecin du sport reconverti en esthétique corporelle. Approche globale alliant nutrition, hormonal et intervention pour des résultats durables.", badge: "Anti-âge" },
];
}
let MEDECINS_DEMO = MEDECINS_DEMO_LIVE();;

/* MosaicPush + Retint: the clinic's two verified views push out tile by
   tile to the right and rebuild from the left — the dominant tile carries
   the current view. The caption plaque still re-tints with each frame. */
function HERO_VIEWS_DEMO_LIVE() {
  return [
  {
    k: "Médecine faciale",
    d: "Injections ultra-précises, résultats invisibles — la morphologie d'abord.",
    tint: "#1c1712",
    img: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=85&fit=crop"),
  },
  {
    k: "Médecine régénérative",
    d: "PRP, polynucléotides, bio-stimulateurs — la régénération avant la correction.",
    tint: "#151a17",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600&q=85"),
  },
];
}
let HERO_VIEWS_DEMO = HERO_VIEWS_DEMO_LIVE();
let HERO_VIEWS = HERO_VIEWS_DEMO;

// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function CypherClinicPage() {
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
  MEDECINS_DEMO = MEDECINS_DEMO_LIVE();
  HERO_VIEWS_DEMO = HERO_VIEWS_DEMO_LIVE();

  memoriserSession(sessionData);

  rafraichirPartage();
  c = session?.generatedContent;


  TEMOIGNAGES_DEMO = resolveList(
    clientReviews(session)?.map((r: any, i: number) => ({ ...TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length], name: r.author, text: r.text })),
    TEMOIGNAGES_SOURCE,
  );
  HERO_VIEWS = HERO_VIEWS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[0 + i] || row.img,
  }));
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef<HTMLDivElement>(null);
  const { i: heroI, next: heroNext, prev: heroPrev } = useSlides(HERO_VIEWS.length, DWELL.slow);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const basePath = "/templates/impact-84";

  // Real business data (resolveList) replaces demo content wholesale when
  // present — see the DEMO consts above for the shape each section falls
  // back to. Field access in JSX uses `??` chains so both shapes render.
  // Note: businessProfile is a sibling of formData on SessionData, not
  // nested inside it — read from `session`, not `fd`.
  const bp = session?.businessProfile;
  const protocoles = resolveList(clientServices(session), PROTOCOLES_DEMO);
  const temoignages = resolveList(clientReviews(session), TEMOIGNAGES_DEMO);
  const medecins = resolveList(clientTeam(session), MEDECINS_DEMO);
  const bookingUrl = bp?.bookingSystem?.url;

return (
    <div className="bg-[#0C0C0A] text-[#F0EBE0]" style={{ ["--brand" as any]: brand ?? "#C9A86C", ["--brand-light" as any]: brand ?? "#E0BC70" }}>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden flex items-center">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <MosaicPush
            index={heroI}
            className=""
            style={{ position: "absolute", inset: 0, display: "grid", gap: 3, gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)" }}
            tiles={[
              { area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
                node: <div style={{ width: "100%", height: "100%", backgroundImage: `url(${fd?.photoUrls?.[heroI] || HERO_VIEWS[heroI].img})`, backgroundSize: "cover", backgroundPosition: "center" }} /> },
              { area: { gridColumn: "3", gridRow: "1 / span 2" },
                node: <div style={{ width: "100%", height: "100%", backgroundImage: `url(${fd?.photoUrls?.[(heroI + 1) % HERO_VIEWS.length] || HERO_VIEWS[(heroI + 1) % HERO_VIEWS.length].img})`, backgroundSize: "cover", backgroundPosition: "center" }} /> },
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/95 via-[#0C0C0A]/70 to-[#0C0C0A]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-24 w-full flex flex-col justify-center">
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-7xl font-light text-[#F0EBE0] leading-[1.2] mb-4 md:mb-8 max-w-3xl pb-2 md:pb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{<>{clientHeroLine(sessionData, 0, 3, 10) ?? "L'art de la médecine"}<br />{clientHeroLine(sessionData, 1, 3, 10) ?? "esthétique de"}{" "}<em>{clientHeroLine(sessionData, 2, 3, 10) ?? "précision"}</em>
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8A8278] text-base md:text-lg max-w-xl mb-6 md:mb-12 leading-relaxed">{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
              Une harmonie mesurée entre rigueur scientifique et vision artistique du visage. Nos protocoles de pointe respectent votre morphologie naturelle pour des résultats invisibles et durables.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
              <Link href={`${basePath}/protocoles`} className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand)] text-[#0C0C0A] font-medium text-sm tracking-wide uppercase hover:bg-[var(--brand-light)] transition-colors cursor-pointer">
                Découvrir nos protocoles <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`${basePath}/rdv`} className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--brand)] text-[var(--brand)] font-light text-sm tracking-wide uppercase hover:bg-[var(--brand)] hover:text-[#0C0C0A] transition-all cursor-pointer">
                Demander un rendez-vous
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Plaque Retint : l'expertise en cours, la teinte prise dans la photo.
            md+ seulement — sur téléphone elle partagerait le coin avec les CTA. */}
        <Retint
          color={HERO_VIEWS[heroI].tint}
          className="hidden md:block absolute bottom-10 right-10 z-10 border border-[#2A2820]"
          style={{ padding: "22px 26px", maxWidth: 320 }}
        >
          <SlideIndex i={heroI} total={HERO_VIEWS.length} variant="fraction" className="text-[13px] text-[#8A8278] mb-3" />
          <BlurThrough index={heroI} amount={9}>
            <div className="text-[#F0EBE0] text-lg" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              {HERO_VIEWS[heroI].k}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#8A8278]">{HERO_VIEWS[heroI].d}</p>
          </BlurThrough>
          <HairlineArrows
            onPrev={heroPrev}
            onNext={heroNext}
            color="rgba(240,235,224,0.6)"
            className="mt-3 -ml-3"
            labels={{ prev: "Expertise précédente", next: "Expertise suivante" }}
          />
        </Retint>
      </section>

      {/* ── PROTOCOLES */}
      <section className="py-24 bg-[#0F0E0C] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--brand)] mb-6">Nos Expertises</p>
            <h2 className="text-4xl md:text-5xl font-light mb-20 max-w-xl leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>
              Des protocoles conçus<br />pour <em>votre morphologie</em>.
            </>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {protocoles.map((p: any, i: number) => (
              <Reveal key={p.num ?? p.name ?? i} delay={i * 0.08}>
                <div className="p-8 border border-[#2A2820] hover:border-[var(--brand)]/30 transition-all duration-500 group">
                  <div className="text-[var(--brand)]/20 text-5xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.num ?? String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-medium text-[#F0EBE0] text-lg mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.title ?? p.name}</h3>
                  <p className="text-[#6A6258] text-sm leading-relaxed mb-6">{p.desc ?? p.description}</p>
                  <div className="flex gap-6 text-[10px] text-[var(--brand)]/60 uppercase tracking-widest border-t border-[#2A2820] pt-4">
                    {p.duration && <span>Durée : {p.duration}</span>}
                    {p.duration && p.recovery && <span>|</span>}
                    {p.recovery && <span>Récupération : {p.recovery}</span>}
                    {p.price && <span>Prix : {p.price}</span>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHIE */}
      <section className="py-24 bg-[#0C0C0A] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={photo(2, "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=85")} alt="Clinique Cypher" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#0C0C0A]/20" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--brand)] mb-8">Notre philosophie</p>
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  La beauté<br />comme <em>science.</em>
                </>}</h2>
                <p className="text-[#8A8278] leading-relaxed mb-6 text-base">{c?.aboutText ?? <>
                  Chez Cypher Clinic, nous rejetons l'idée de beauté standardisée. Chaque visage est un code unique que nous lisons avec précision avant d'intervenir. Notre protocole d'analyse morphologique en 14 points est réalisé par un médecin qualifié — jamais une esthéticienne.
                </>}</p>
                <p className="text-[#8A8278] leading-relaxed mb-10 text-base">
                  Nos médecins sont formés dans les instituts de référence mondiale (Académie de médecine esthétique de {clientCity(sessionData) ?? "Paris"}, IDRM {clientCity(sessionData) ?? "Lausanne"}). Chaque acte est documenté photographiquement avant et après pour un suivi rigoureux de votre évolution.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-[#2A2820] pt-10">
                  {[{ v: "+2400", l: "Patients traités" }, { v: "14", l: "Points d'analyse" }, { v: "9 ans", l: "D'expertise" }].map((s, i) => (
                    <div key={i}>
                      <div className="text-2xl font-light text-[var(--brand)] mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.v}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#6A6258]">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES */}
      <section className="py-24 bg-[#0F0E0C] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--brand)] mb-6">Patients</p>
            <h2 className="text-3xl font-light mb-16" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>Ce qu'ils ont vécu.</>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {temoignages.map((t: any, i: number) => (
              <Reveal key={t.name ?? t.author ?? i} delay={i * 0.1}>
                <div className="p-8 border border-[#2A2820]">
                  <p className="text-[#8A8278] text-sm leading-relaxed mb-8 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-[#2A2820] pt-6">
                    <p className="text-[#F0EBE0] font-medium text-sm">{t.name ?? t.author}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--brand)] mt-1">{t.protocol ?? t.source ?? ""}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉDECINS */}
      <section className="py-24 bg-[#0C0C0A] border-t border-[#2A2820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--brand)] mb-6">Notre équipe</p>
            <h2 className="text-3xl font-light mb-16" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Les médecins.</>)}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {medecins.map((m: any, i: number) => (
              <Reveal key={m.name ?? i} delay={i * 0.1}>
                <div className="p-8 border border-[#2A2820] flex flex-col gap-4">
                  <div className="w-14 h-14 bg-[#2A2820] flex items-center justify-center">
                    <span className="text-[var(--brand)] font-light text-xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>{String(m.name ?? "").split(" ").filter((n: string) => !n.startsWith("Dr")).map((n: string) => n[0]).join("")}</span>
                  </div>
                  <div>
                    {(m.badge ?? m.credentials ?? m.exp) && (
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] mb-1">{[m.badge ?? m.credentials, m.exp].filter(Boolean).join(" · ")}</p>
                    )}
                    <h3 className="text-[#F0EBE0] font-medium" style={{ fontFamily: "'Bodoni Moda', serif" }}>{m.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#6A6258] mt-0.5">{m.spec ?? m.specialty ?? m.role}</p>
                  </div>
                  {(m.bio) && <p className="text-[#8A8278] text-sm leading-relaxed border-t border-[#2A2820] pt-4">{m.bio}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RDV CTA */}
      <section className="py-24 bg-[var(--brand)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#0C0C0A]/60 mb-6">Premier rendez-vous</p>
            <h2 className="text-4xl font-light text-[#0C0C0A] mb-8 leading-snug" style={{ fontFamily: "'Bodoni Moda', serif" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Commençons par<br /><em>vous écouter.</em>
            </>)}</h2>
            <p className="text-[#0C0C0A]/60 mb-10 max-w-md mx-auto leading-relaxed text-sm">
              Votre première consultation avec l'un de nos médecins est dédiée à l'écoute et au diagnostic. Aucun acte n'est réalisé lors de cette séance.
            </p>
            <Link
              href={bookingUrl || `${basePath}/rdv`}
              {...(bookingUrl && { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex items-center gap-4 px-10 py-5 bg-[#0C0C0A] text-[var(--brand)] text-[10px] uppercase tracking-widest hover:gap-8 transition-all cursor-pointer"
            >
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName(sessionData) ?? "Cypher Clinic"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
