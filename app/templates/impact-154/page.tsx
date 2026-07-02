"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  History, Landmark, Award, Star,
  ArrowRight, Menu, X, Plus,
  Maximize2, Share2, Download, ExternalLink,
  Archive, Search, Clock, Hash,
  Layers, Frame, Eye, Lock, Crosshair,
  ShieldCheck, MapPin, ChevronRight, ChevronLeft, Play,
  BookOpen, PenTool, Radio, Activity,
  Database, Microscope, Fingerprint, Scan,
  Palette, Camera, Shield, FileText,
  UserCheck, Globe2, AlertCircle, Mail, Check
} from "lucide-react"

/* ==========================================================================
   IVORY ARCHIVE DATASET (ULTRA DENSITY)
   ========================================================================== */

const COLLECTIONS = [
  {
    id: "art-01",
    title: "The Renaissance Veil",
    period: "15th Century",
    status: "Private_Vault",
    location: "Zurich Node",
    desc: "Une étude rare attribuée au cercle de Vinci, conservée dans des conditions atmosphériques contrôlées.",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc067985c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "art-02",
    title: "Celestial Marbles",
    period: "Classical Era",
    status: "In_Exhibition",
    location: "Paris Annex",
    desc: "Sculptures hellénistiques retrouvées lors de l'expédition de 1924 en mer Égée.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "art-03",
    title: "Gilded Manuscripts",
    period: "Medieval",
    status: "Restoration",
    location: "London Lab",
    desc: "Enluminures byzantines sur parchemin de soie, en cours de stabilisation pigmentaire.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200&auto=format&fit=crop"
  }
]

const PROVENANCE_LOGS = [
  { year: "1892", event: "Acquired by the von Hardenburg family, Vienna." },
  { year: "1946", event: "Recovered from the Salt Mines of Altaussee." },
  { year: "1978", event: "Private auction, Sotheby’s Geneva, Record Sale." },
  { year: "2024", event: "Secured by The Ivory Archive for conservation." }
]

const LAB_METRICS = [
  { label: "Humidity", value: "42.5%", status: "Nominal" },
  { label: "UV Exposure", value: "0.01 lux", status: "Optimal" },
  { label: "CO2 Levels", value: "350 ppm", status: "Secure" },
  { label: "Surface Temp", value: "18.2°C", status: "Stable" }
]

/* ==========================================================================
   EXTENDED DATASET FOR SUB-PAGES (theme-native, luxury/art register)
   ========================================================================== */

// Full curated collection for the Collection / Œuvres page (extends COLLECTIONS).
const ARCHIVE_WORKS = [
  ...COLLECTIONS,
  {
    id: "art-04",
    title: "The Obsidian Triptych",
    period: "Baroque",
    status: "Private_Vault",
    location: "Tokyo Node",
    desc: "Triptyque dévotionnel sur bois d'ébène, rehaussé de feuille d'or, attribué à un maître flamand anonyme.",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "art-05",
    title: "Veduta of the Lost City",
    period: "18th Century",
    status: "In_Exhibition",
    location: "Paris Annex",
    desc: "Vue capricieuse à l'huile d'une cité engloutie, étude topographique d'une précision saisissante.",
    image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "art-06",
    title: "Reliquary of the Silent Order",
    period: "Romanesque",
    status: "Restoration",
    location: "London Lab",
    desc: "Reliquaire en argent niellé, serti de pierres semi-précieuses, en cours d'analyse métallurgique.",
    image: "https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=1200&auto=format&fit=crop"
  }
]

// Long-form provenance + technical detail per work (Collection detail view).
const WORK_DETAILS: Record<string, {
  medium: string
  dimensions: string
  acquisition: string
  essay: string[]
}> = {
  "art-01": {
    medium: "Huile et tempera sur panneau de peuplier",
    dimensions: "62 × 47 cm",
    acquisition: "Acquise par voie privée, 2024",
    essay: [
      "Émergeant du clair-obscur d'un atelier florentin de la fin du Quattrocento, The Renaissance Veil incarne le sommet d'une recherche sur la transparence et la lumière. Le voile, traité en glacis successifs, semble respirer sous la surface du panneau.",
      "Les analyses réflectographiques infrarouges révèlent un dessin sous-jacent d'une assurance rare, ponctué de repentirs qui rapprochent l'œuvre du cercle immédiat de Vinci. La conservation s'effectue sous atmosphère inerte, à l'abri de toute variation hygrométrique.",
      "La pièce demeure scellée dans le coffre de Zurich, accessible aux seuls conservateurs accrédités. Sa monstration publique n'est envisagée que dans le cadre d'expositions institutionnelles d'exception."
    ]
  },
  "art-02": {
    medium: "Marbre pentélique",
    dimensions: "Hauteur 1,40 m",
    acquisition: "Expédition de la mer Égée, 1924",
    essay: [
      "Remontées des fonds de la mer Égée lors de l'expédition de 1924, ces marbres hellénistiques portent encore la mémoire concrétionnée des siècles d'immersion. Leur drapé, d'une fluidité presque liquide, témoigne d'une virtuosité athénienne tardive.",
      "Le dessalement progressif, conduit sur plusieurs années, a permis de stabiliser la pierre sans en altérer la patine marine. Chaque étape du traitement est consignée dans le registre de provenance de l'Archive.",
      "Présentées par rotation dans l'annexe parisienne, les Celestial Marbles constituent l'une des rares ensembles statuaires de cette période conservés dans des conditions muséales contemporaines."
    ]
  },
  "art-03": {
    medium: "Enluminure et or sur parchemin de soie",
    dimensions: "Folio 31 × 22 cm",
    acquisition: "Dépôt de conservation, 2021",
    essay: [
      "Ces enluminures byzantines déploient une orfèvrerie picturale où l'or bruni dialogue avec des pigments d'une saturation intacte. Le parchemin de soie, support d'une fragilité extrême, exige une intervention d'une délicatesse absolue.",
      "Le laboratoire de Londres procède actuellement à une stabilisation pigmentaire par consolidation locale, sous microscope binoculaire et éclairage filtré. La moindre fluctuation lumineuse pourrait compromettre les liants d'origine.",
      "Une fois la campagne de restauration achevée, les manuscrits rejoindront le registre permanent et feront l'objet d'une numérisation multispectrale à haute résolution."
    ]
  },
  "art-04": {
    medium: "Huile et feuille d'or sur bois d'ébène",
    dimensions: "Panneau central 90 × 60 cm",
    acquisition: "Acquise par voie privée, 2023",
    essay: [
      "Le Obsidian Triptych conjugue la profondeur insondable de l'ébène à l'éclat liturgique de la feuille d'or. Cette tension entre obscurité et lumière confère à l'objet une présence presque architecturale.",
      "L'attribution à un maître flamand anonyme repose sur l'analyse du faire et la composition des couches picturales. Les volets latéraux, mobiles, révèlent une iconographie dévotionnelle d'une grande raffinement.",
      "Conservé dans le coffre de Tokyo, le triptyque n'est manipulé que par paires de conservateurs, sous protocole de double validation."
    ]
  },
  "art-05": {
    medium: "Huile sur toile",
    dimensions: "118 × 165 cm",
    acquisition: "Acquise en vente publique, 2019",
    essay: [
      "Veduta of the Lost City appartient à la grande tradition du caprice architectural du XVIIIe siècle, où la topographie réelle se mêle à l'imaginaire pour composer une cité idéale et engloutie.",
      "La précision perspective et la maîtrise atmosphérique de la lumière rasante situent l'œuvre au plus haut niveau de production de son époque. La toile a bénéficié d'un rentoilage prudent et d'un allègement du vernis oxydé.",
      "Régulièrement présentée à l'annexe parisienne, la veduta dialogue avec les autres pièces topographiques de la collection dans un parcours thématique consacré à la ville rêvée."
    ]
  },
  "art-06": {
    medium: "Argent niellé, pierres semi-précieuses",
    dimensions: "24 × 16 × 12 cm",
    acquisition: "Dépôt de conservation, 2022",
    essay: [
      "Le Reliquary of the Silent Order témoigne de l'apogée de l'orfèvrerie romane, où le travail du niellage atteint une finesse graphique exceptionnelle. La châsse, structurée comme une architecture miniature, abrite un compartiment scellé.",
      "Le laboratoire de Londres conduit actuellement une analyse métallurgique non destructive afin d'identifier les alliages et de cartographier les zones de corrosion active. Aucune intervention n'est entreprise sans cartographie préalable complète.",
      "L'objet rejoindra le registre permanent une fois sa stabilité chimique garantie, accompagné d'un rapport d'expertise scellé."
    ]
  }
}

// Journal — editorial articles in the maison's register (index + article view).
const JOURNAL = [
  {
    slug: "silence-du-temps",
    title: "Le silence du temps : philosophie de la conservation",
    date: "4 juin 2026",
    category: "Conservation",
    excerpt: "Conserver n'est pas figer. C'est offrir à l'œuvre les conditions de son propre silence, pour que l'histoire continue de parler à travers elle.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop",
    body: [
      "La conservation est souvent perçue comme un acte de fixation, une lutte contre l'écoulement du temps. Cette vision, séduisante, est profondément erronée. Conserver, ce n'est pas arrêter le temps : c'est le ralentir avec assez de douceur pour que l'œuvre demeure lisible par les générations à venir.",
      "Chaque chef-d'œuvre porte en lui une double mémoire : celle de sa création et celle de son parcours. Le rôle du conservateur consiste à respecter ces deux strates, sans jamais imposer une lecture contemporaine qui trahirait l'intention première.",
      "Dans nos coffres atmosphériques, le silence n'est pas une absence. Il est une présence active, une vigilance permanente des instruments qui veillent sur l'hygrométrie, la lumière et la stabilité de chaque pièce.",
      "C'est dans ce silence maîtrisé que l'histoire trouve les conditions de sa transmission. Faire taire le temps, c'est paradoxalement lui permettre de continuer à parler."
    ]
  },
  {
    slug: "imagerie-multispectrale",
    title: "Sous la surface : l'imagerie multispectrale au service de l'œuvre",
    date: "19 mai 2026",
    category: "Le Laboratoire",
    excerpt: "Réflectographie infrarouge, fluorescence ultraviolette, radiographie : autant de regards qui dévoilent ce que l'œil seul ne peut percevoir.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop",
    body: [
      "Avant toute intervention, l'œuvre est interrogée. Non par la parole, mais par la lumière. L'imagerie multispectrale permet de cartographier ce qui se dérobe au regard : dessins sous-jacents, repentirs, restaurations anciennes, altérations naissantes.",
      "La réflectographie infrarouge traverse les couches picturales pour révéler le tracé préparatoire. La fluorescence ultraviolette met en évidence les vernis et les retouches. La radiographie, enfin, dévoile la structure interne du support.",
      "Ces examens, strictement non destructifs, constituent le préalable indispensable à toute campagne de restauration. Ils nourrissent un diagnostic d'une précision chirurgicale, consigné dans le rapport d'expertise de chaque pièce.",
      "Voir sous la surface, c'est comprendre l'œuvre dans son intégrité matérielle. Et comprendre, dans notre métier, est la condition de tout geste juste."
    ]
  },
  {
    slug: "chaine-de-provenance",
    title: "La chaîne de provenance : écrire la mémoire des œuvres",
    date: "2 mai 2026",
    category: "Provenance",
    excerpt: "Une œuvre sans histoire documentée est une œuvre orpheline. La traçabilité de la provenance est le fondement même de l'authenticité.",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1200&auto=format&fit=crop",
    body: [
      "La provenance n'est pas un détail administratif. Elle est le récit continu d'une œuvre, depuis sa création jusqu'à son entrée dans nos coffres. Chaque maillon manquant fragilise l'authenticité ; chaque maillon documenté la consolide.",
      "Notre registre privé consigne, pour chaque pièce, l'ensemble des transferts, expositions, restaurations et expertises. Cette chronologie, scellée sur protocole privé, garantit l'intégrité de l'histoire que l'œuvre porte en elle.",
      "Reconstituer une provenance, c'est mener une enquête patiente dans les archives, les catalogues de vente et les correspondances. Un travail d'historien autant que de conservateur.",
      "Car une œuvre dont on connaît le chemin est une œuvre que l'on peut véritablement transmettre. La mémoire est, ici aussi, la condition de la pérennité."
    ]
  },
  {
    slug: "ethique-acquisition",
    title: "Éthique de l'acquisition : le devoir de discernement",
    date: "16 avril 2026",
    category: "Registre",
    excerpt: "Acquérir une œuvre, c'est en accepter la responsabilité morale. Notre registre n'accueille que des pièces dont la légitimité est irréprochable.",
    image: "https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=1200&auto=format&fit=crop",
    body: [
      "Toute acquisition engage une responsabilité qui dépasse la simple transaction. Accueillir une œuvre dans le registre de l'Archive, c'est se porter garant de la légitimité de son parcours et de la rectitude des conditions de sa sortie d'origine.",
      "Nous appliquons une procédure de diligence raisonnée à chaque pièce envisagée : vérification de la provenance, consultation des bases de biens spoliés, et expertise indépendante. Le moindre doute entraîne le refus.",
      "Cette exigence éthique n'est pas une contrainte. Elle est le socle de la confiance que nous accordent institutions muséales et collectionneurs certifiés, et la condition de la valeur durable des pièces enregistrées.",
      "Le discernement, dans notre métier, n'est jamais un luxe. Il est un devoir."
    ]
  }
]

/* ==========================================================================
   MULTI-PAGE NAVIGATION CONFIG
   --------------------------------------------------------------------------
   PATTERN (reused from the impact-46 / impact-168 references): a single `page`
   state drives in-page navigation. The original single-page content renders
   verbatim under page === "home"; every other key renders a theme-native
   sub-page built from the SAME Tailwind classes, the dark luxury palette
   (#0c0c0e / #b4925e gold / #fdfcfb ivory) and the serif display font.
   The Ivory Archive is a gallery / conservation maison — it does NOT sell
   pieces with a cart/checkout (acquisition is by private application). It is
   therefore VITRINE-leaning: Collection/Œuvres (+ detail), Journal, À propos,
   Contact, Mentions, Confidentialité — and there is NO CGV.
   ========================================================================== */
type ArchivePage =
  | "home"
  | "collection"
  | "journal"
  | "about"
  | "contact"
  | "mentions"
  | "privacy"

const NAV_PAGES: { key: ArchivePage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "collection", label: "Collection" },
  { key: "journal", label: "Journal" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
  { key: "mentions", label: "Mentions" }
]

/* ==========================================================================
   ADVANCED ANIMATION COMPONENTS
   ========================================================================== */

function Reveal({ children, delay = 0, y = 40, x = 0 }: { children: React.ReactNode, delay?: number, y?: number, x?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ subtitle, title, alignment = "center" }: { subtitle: string, title: string, alignment?: "center" | "left" }) {
  return (
    <div className={`mb-32 ${alignment === "center" ? "text-center" : "text-left"}`}>
       <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#b4925e] mb-8 block italic underline underline-offset-8">
             {subtitle}
          </span>
          <h2 className="text-6xl md:text-[8vw] font-light italic leading-none tracking-tighter uppercase text-[#fdfcfb]" style={{ fontFamily: "serif" }}>
             {title}
          </h2>
       </Reveal>
    </div>
  )
}

// Compact page-header band reused by every sub-page (theme-native).
function PageHeader({ chapter, title, intro }: { chapter: string, title: string, intro?: string }) {
  return (
    <section id="hero" className="relative pt-48 pb-24 px-8 md:px-20 border-b border-white/5 overflow-hidden">
       <div className="absolute top-0 right-0 p-40 bg-[#b4925e] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
       <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#b4925e] mb-8 block italic underline underline-offset-8">
                {chapter}
             </span>
             <h1 className="text-5xl md:text-[7vw] font-light italic leading-[0.85] tracking-tighter uppercase text-[#fdfcfb]" style={{ fontFamily: "serif" }}>
                {title}
             </h1>
             {intro && (
                <p className="mt-12 max-w-2xl text-[12px] md:text-sm text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic">
                   {intro}
                </p>
             )}
          </Reveal>
       </div>
    </section>
  )
}

/* ==========================================================================
   THE IVORY ARCHIVE - MAIN APPLICATION
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function IvoryArchivePremium() {
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
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [page, setPage] = useState<ArchivePage>("home")
  const [activeWork, setActiveWork] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<string | null>(null)
  const [vaultOpen, setVaultOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Parallax & Depth Effects
  const galleryX = useTransform(scrollYProgress, [0, 1], [0, -500])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  const goTo = (p: ArchivePage) => {
    setPage(p)
    setActiveWork(null)
    setActiveArticle(null)
    setMobileNav(false)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" })
  }

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div ref={containerRef} className="bg-[#0c0c0e] text-[#fdfcfb] font-sans selection:bg-[#b4925e] selection:text-black min-h-screen overflow-x-hidden">

      {/* GLOBAL HUD & NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-20 flex items-center justify-between border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl py-5">
         <button onClick={() => goTo("home")} className="flex flex-col group text-left">
            <span className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white flex items-center gap-4">
               <Landmark className="w-7 h-7 md:w-8 md:h-8 text-[#b4925e]" />
               IVORY<span className="text-[#b4925e] font-black italic">.ARCHIVE</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.6em] text-white/20 uppercase italic hidden md:block">Elite Art Conservation & Private Registry</span>
         </button>

         <div className="hidden lg:flex items-center gap-12">
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
               {NAV_PAGES.map(l => (
                 <button
                   key={l.key}
                   onClick={() => goTo(l.key)}
                   className={`transition-colors uppercase tracking-[0.4em] ${page === l.key ? "text-[#b4925e]" : "text-white/30 hover:text-white"}`}
                 >
                   {l.label}
                 </button>
               ))}
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button
              onClick={() => setVaultOpen(true)}
              className="flex items-center gap-3 px-8 py-3 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
            >
               <Lock className="w-4 h-4" /> Collector Vault
            </button>
         </div>

         <button onClick={() => setMobileNav(v => !v)} className="lg:hidden w-10 h-10 flex items-center justify-center border border-white/10">
            {mobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </nav>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 w-full z-[99] bg-[#0c0c0e]/98 backdrop-blur-xl border-b border-white/10 lg:hidden px-8 py-8 flex flex-col gap-6"
          >
             {NAV_PAGES.map(l => (
               <button
                 key={l.key}
                 onClick={() => goTo(l.key)}
                 className={`text-left text-[11px] font-black uppercase tracking-[0.4em] ${page === l.key ? "text-[#b4925e]" : "text-white/40"}`}
               >
                 {l.label}
               </button>
             ))}
             <button
               onClick={() => { setMobileNav(false); setVaultOpen(true) }}
               className="mt-4 flex items-center gap-3 px-8 py-4 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest"
             >
                <Lock className="w-4 h-4" /> Collector Vault
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
        {page === "home" && (
        <>
        {/* ==========================================
            1. THE PROLOGUE (HERO)
            ========================================== */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
             <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80"
                alt="Classical Sculpture in Museum"
                fill
                className="object-cover opacity-20 grayscale"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-[#0c0c0e]" />
          </motion.div>

          <div className="relative z-10 text-center max-w-7xl px-8">
             <Reveal>
                <div className="inline-flex items-center gap-4 px-4 py-1 border border-[#b4925e]/30 bg-[#b4925e]/5 text-[10px] font-bold uppercase tracking-[0.5em] text-[#b4925e] mb-12 italic">
                   Status // High_Security_Node: Zurich
                </div>
                <h1 className="text-7xl md:text-[14vw] font-light italic leading-[0.75] tracking-tighter uppercase mb-16" style={{ fontFamily: "serif" }}>{c?.heroHeadline ?? <>
                   Heritage <br/> <span className="not-italic font-black text-white/5 italic">Eternalized.</span>
                </>}</h1>
                <div className="grid md:grid-cols-3 gap-12 md:gap-24 text-left max-w-5xl mx-auto border-t border-white/10 pt-16">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#b4925e]">The Mandate</h3>
                      <p className="text-[11px] text-white/30 leading-loose uppercase tracking-widest font-bold italic">{c?.heroSubline ?? fd?.tagline ?? <>
                         Nous assurons la pérennité des chefs-d'œuvre mondiaux à travers une expertise scientifique et une conservation de haute sphère.
                      </>}</p>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">1.4B</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Aggregate Vault Value (USD)</span>
                   </div>
                   <div className="flex flex-col justify-end">
                      <span className="text-5xl font-light tracking-tighter">42</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Centuries of Provance</span>
                   </div>
                </div>
             </Reveal>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Explore_The_Repository</span>
             <div className="h-20 w-px bg-gradient-to-b from-[#b4925e] to-transparent" />
          </div>
        </section>

        {/* ==========================================
            2. THE GALLERY (Z-INDEX DEPTH)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-8 md:px-20">
              <SectionTitle subtitle="Chapitre I // Curated Selection" title="The Repository." />

              <div className="grid md:grid-cols-3 gap-16 relative">
                 {COLLECTIONS.map((art, i) => (
                   <Reveal key={art.id} delay={i * 0.1} y={80}>
                      <div
                         onClick={() => { goTo("collection"); setActiveWork(art.id) }}
                         className="group relative bg-[#0c0c0e] border border-white/5 p-12 hover:border-[#b4925e]/30 transition-all duration-700 cursor-pointer"
                      >
                         <div className="relative aspect-[3/4] mb-12 overflow-hidden shadow-2xl">
                            <Image
                               src={art.image}
                               alt={art.title}
                               fill
                               className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                            <div className="absolute top-6 left-6">
                               <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{art.period}</span>
                            </div>
                         </div>

                         <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[#b4925e] transition-colors mb-6" style={{ fontFamily: "serif" }}>{art.title}</h3>
                         <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-widest mb-12">
                            <span>ID: {art.id}</span>
                            <span className="text-[#b4925e]">{art.status}</span>
                         </div>
                         <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic mb-12">
                            {art.desc}
                         </p>
                         <div className="flex justify-between items-center border-t border-white/5 pt-8">
                            <div className="flex items-center gap-3">
                               <MapPin className="w-3 h-3 text-[#b4925e]" />
                               <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{art.location}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#b4925e] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                               Expertise Report <ChevronRight className="w-4 h-4" />
                            </span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ==========================================
            3. CONSERVATION LAB (TECHNICAL DENSITY)
            ========================================== */}
        <section className="py-60 bg-[#0c0c0e] relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <SectionTitle subtitle="Chapitre II // The Science" title="Conservation Lab." alignment="left" />
                       <p className="text-xl font-light text-white/40 leading-relaxed italic mb-16 uppercase tracking-widest">{c?.aboutText ?? <>
                          La préservation du patrimoine mondial exige une rigueur scientifique sans compromis. Notre laboratoire utilise l'imagerie multi-spectrale et la stabilisation atomique pour contrer les effets du temps.
                       </>}</p>
                       <div className="grid grid-cols-2 gap-8 mb-20">
                          {LAB_METRICS.map((metric, i) => (
                            <div key={i} className="p-8 bg-black border border-white/5 hover:border-[#b4925e]/30 transition-all">
                               <div className="text-[8px] font-black uppercase text-[#b4925e] mb-2 tracking-[0.3em]">{metric.label}</div>
                               <div className="text-3xl font-light text-white mb-4 italic">{metric.value}</div>
                               <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-white/20 italic">
                                  <Activity className="w-3 h-3" /> {metric.status}
                               </div>
                            </div>
                          ))}
                       </div>
                       <button className="w-full py-6 border-2 border-[#b4925e] text-[#b4925e] text-[10px] font-black uppercase tracking-widest hover:bg-[#b4925e] hover:text-black transition-all shadow-2xl">
                          Request Lab Analysis Log
                       </button>
                    </Reveal>
                 </div>
                 <div className="relative">
                    <Reveal delay={0.3} x={40}>
                       <div className="aspect-square bg-black border border-white/10 p-12 flex flex-col justify-between relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-40 bg-[#b4925e] opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.1] transition-opacity" />
                          <div className="flex justify-between items-start z-10">
                             <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">System_ID // ARCH-V4</span>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Multi-Spectral_Scan</span>
                             </div>
                             <Microscope className="w-5 h-5 text-[#b4925e]" />
                          </div>

                          <div className="flex flex-col gap-12 relative z-10">
                             <div className="flex items-center justify-center gap-8">
                                <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center text-[#b4925e] shadow-[0_0_30px_rgba(180,146,94,0.1)]">
                                   <Palette className="w-12 h-12" />
                                </div>
                             </div>
                             <div className="text-center">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block mb-4 italic">Scan_Efficiency</span>
                                <div className="text-4xl font-black italic text-[#b4925e]">99.98% // SECURE</div>
                             </div>
                          </div>

                          <div className="flex gap-4 relative z-10">
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                   animate={{ x: ["-100%", "100%"] }}
                                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                   className="w-1/2 h-full bg-[#b4925e]"
                                />
                             </div>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            4. PROVENANCE TIMELINE (STORYTELLING)
            ========================================== */}
        <section className="py-60 bg-black relative border-y border-white/5 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 md:px-20">
              <div className="grid lg:grid-cols-2 gap-32 items-center">
                 <div className="relative aspect-[4/5] overflow-hidden group">
                    <Image
                       src="https://images.unsplash.com/photo-1510850473394-d236d1e3d0cd?q=80&w=1200&auto=format&fit=crop"
                       alt="Art Restorer Working"
                       fill
                       className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all" />
                    <div className="absolute inset-0 p-16 flex flex-col justify-end">
                       <div className="text-white">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#b4925e] mb-4 block italic underline underline-offset-8">Featured Provenance // Case-09</span>
                          <h4 className="text-5xl font-light tracking-tighter uppercase italic mb-8" style={{ fontFamily: "serif" }}>The Royal <br/> Archive Trace.</h4>
                          <button onClick={() => goTo("about")} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border-b border-[#b4925e] pb-2">
                             Full Chronology <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <Reveal>
                       <SectionTitle subtitle="Chapitre III // Provenance" title="Chain of Custody." alignment="left" />
                       <div className="space-y-12">
                          {PROVENANCE_LOGS.map((log, i) => (
                            <div key={i} className="group border-l border-white/5 pl-12 hover:border-[#b4925e] transition-all cursor-default">
                               <div className="flex justify-between items-center mb-4">
                                  <span className="text-[10px] font-black text-[#b4925e] uppercase tracking-widest">{log.year}</span>
                                  <History className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                               </div>
                               <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold leading-relaxed">{log.event}</p>
                            </div>
                          ))}
                       </div>
                       <div className="mt-20 pt-10 border-t border-white/5">
                          <p className="text-xs text-white/20 italic font-light leading-relaxed">
                             Toute pièce enregistrée auprès de The Ivory Archive bénéficie d'une authentification certifiée sur protocole blockchain privé, garantissant l'intégrité de son histoire.
                          </p>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ==========================================
            5. THE REGISTRY (PRIVATE ACCESS)
            ========================================== */}
        <section className="py-60 bg-white text-black relative">
           <div className="max-w-[1200px] mx-auto px-8 md:px-20 text-center">
              <Reveal>
                 <SectionTitle subtitle="Acquisitions // Privilège" title="Registry Application." />
                 <p className="max-w-2xl mx-auto text-xl font-light text-black/40 leading-relaxed italic mb-20 uppercase tracking-widest">
                    L'accès à notre registre privé et aux opportunités d'acquisition est réservé aux institutions muséales et aux collectionneurs certifiés.
                 </p>

                 <form className="max-w-xl mx-auto space-y-12" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Surname</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Sterling" />
                       </div>
                       <div className="border-b border-black/10 py-4 text-left">
                          <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Entity</label>
                          <input type="text" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="Private Institution" />
                       </div>
                    </div>
                    <div className="border-b border-black/10 py-4 text-left">
                       <label className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 block mb-2">Digital Signature</label>
                       <input type="email" className="w-full bg-transparent outline-none text-xl font-light italic" placeholder="alistair@sterling.ch" />
                    </div>
                    <button className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#b4925e] transition-all shadow-2xl">
                       Request Acquisition Handshake
                    </button>
                 </form>
              </Reveal>
           </div>
        </section>
        </>
        )}

        {/* ══════════ COLLECTION / ŒUVRES (index + detail) ══════════ */}
        {page === "collection" && (
          activeWork ? (
            <CollectionDetail
              id={activeWork}
              onBack={() => { setActiveWork(null); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }) }}
              onContact={() => goTo("contact")}
            />
          ) : (
            <CollectionIndex onOpen={(id) => { setActiveWork(id); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }) }} />
          )
        )}

        {/* ══════════ JOURNAL (index + article) ══════════ */}
        {page === "journal" && (
          activeArticle ? (
            <JournalArticle
              slug={activeArticle}
              onBack={() => { setActiveArticle(null); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }) }}
            />
          ) : (
            <JournalIndex onOpen={(slug) => { setActiveArticle(slug); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }) }} />
          )
        )}

        {/* ══════════ OTHER SUB-PAGES ══════════ */}
        {page === "about" && <AboutPage onContact={() => goTo("contact")} />}
        {page === "contact" && <ContactPage />}
        {page === "mentions" && <LegalPage variant="mentions" />}
        {page === "privacy" && <LegalPage variant="privacy" />}

        {/* MEGA FOOTER */}
        <footer className="bg-black pt-60 pb-12 px-8 md:px-20 relative z-50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-32 mb-60 text-white">
              <div className="lg:col-span-2">
                 <button onClick={() => goTo("home")} className="flex items-center gap-4 mb-12 text-left">
                    <div className="w-10 h-10 bg-[#b4925e] flex items-center justify-center rounded-sm">
                       <Landmark className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-3xl font-light tracking-[0.2em] uppercase">IVORY<span className="text-[#b4925e] font-black">.ARCHIVE</span></span>
                 </button>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-sm mb-16 italic">
                    "La conservation est l'art de faire taire le temps pour laisser parler l'histoire." — Archive Ivory V.4
                 </p>
                 <div className="flex gap-12">
                    {["Camera", "ArtsNet", "UNESCO_Partner", "LinkedIn"].map(s => (
                       <span key={s} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#b4925e] transition-colors italic cursor-pointer">{s}</span>
                    ))}
                 </div>
              </div>

              {[
                { t: "REPOSITORY", links: [
                  { label: "Collection", page: "collection" as ArchivePage },
                  { label: "Journal", page: "journal" as ArchivePage },
                  { label: "À propos", page: "about" as ArchivePage },
                  { label: "Contact", page: "contact" as ArchivePage }
                ] },
                { t: "SERVICES", links: [
                  { label: "Conservation Lab", page: "about" as ArchivePage },
                  { label: "Expertise", page: "about" as ArchivePage },
                  { label: "Provenance", page: "about" as ArchivePage },
                  { label: "Acquisition", page: "contact" as ArchivePage }
                ] },
                { t: "LEGAL", links: [
                  { label: "Mentions légales", page: "mentions" as ArchivePage },
                  { label: "Confidentialité", page: "privacy" as ArchivePage },
                  { label: "Contact", page: "contact" as ArchivePage }
                ] }
              ].map((col, i) => (
                <div key={i} className="flex flex-col gap-12">
                   <h4 className="text-[10px] font-black text-[#b4925e] uppercase tracking-[0.5em] italic">{col.t}</h4>
                   <ul className="flex flex-col gap-6">
                      {col.links.map(link => (
                         <li key={link.label}>
                            <button
                               onClick={() => goTo(link.page)}
                               className="text-[10px] font-bold text-white/20 hover:text-white transition-colors cursor-pointer uppercase tracking-widest italic text-left"
                            >
                               {link.label}
                            </button>
                         </li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>

           <div className="max-w-[1600px] mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12 text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
              <span>© 2026 THE IVORY ARCHIVE FOUNDATION. // ALL_RIGHTS_RESERVED</span>
              <div className="flex gap-12">
                 <span>SECURITY: LVL_9</span>
                 <span>LATENCY: 14ms</span>
                 <span>v4.2.18</span>
              </div>
           </div>
        </footer>
      </main>

      {/* COLLECTOR VAULT OVERLAY (SIMULATED) */}
      <AnimatePresence>
        {vaultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="max-w-md w-full border border-[#b4925e]/30 p-12 relative bg-[#0c0c0e]">
                <button onClick={() => setVaultOpen(false)} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                </button>
                <div className="flex flex-col items-center gap-12">
                   <div className="w-20 h-20 bg-[#b4925e]/10 flex items-center justify-center rounded-full">
                      <Fingerprint className="w-10 h-10 text-[#b4925e]" />
                   </div>
                   <div className="text-center">
                      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Collector_Handshake</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 leading-relaxed">
                         Veuillez scanner votre identité biométrique ou entrer votre clé d'accréditation privée pour accéder au catalogue d'acquisition confidentiel.
                      </p>
                   </div>
                   <div className="w-full space-y-4">
                      <input
                         type="text"
                         placeholder="IDENT_ACCESS_KEY"
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 text-base font-bold uppercase tracking-[0.3em] outline-none focus:border-[#b4925e] text-white"
                      />
                      <button className="w-full py-4 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest">
                         Authenticate Access
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: COLLECTION INDEX (Œuvres grid)
   ========================================================================== */
function CollectionIndex({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div>
      <PageHeader
        chapter="Chapitre I // Curated Selection"
        title="The Collection."
        intro="Un ensemble restreint de chefs-d'œuvre conservés dans nos coffres atmosphériques, à travers les nodes de Zurich, Paris, Londres et Tokyo. Chaque pièce est documentée, expertisée et scellée."
      />
      <section id="realisations" className="py-32 bg-black border-y border-white/5">
         <div className="max-w-[1600px] mx-auto px-8 md:px-20">
            <div className="grid md:grid-cols-3 gap-16">
               {ARCHIVE_WORKS.map((art, i) => (
                 <Reveal key={art.id} delay={(i % 3) * 0.1} y={60}>
                    <div
                       onClick={() => onOpen(art.id)}
                       className="group relative bg-[#0c0c0e] border border-white/5 p-12 hover:border-[#b4925e]/30 transition-all duration-700 cursor-pointer h-full"
                    >
                       <div className="relative aspect-[3/4] mb-12 overflow-hidden shadow-2xl">
                          <Image
                             src={art.image}
                             alt={art.title}
                             fill
                             className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                          <div className="absolute top-6 left-6">
                             <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{art.period}</span>
                          </div>
                       </div>
                       <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[#b4925e] transition-colors mb-6" style={{ fontFamily: "serif" }}>{art.title}</h3>
                       <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-widest mb-12">
                          <span>ID: {art.id}</span>
                          <span className="text-[#b4925e]">{art.status}</span>
                       </div>
                       <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic mb-12">
                          {art.desc}
                       </p>
                       <div className="flex justify-between items-center border-t border-white/5 pt-8">
                          <div className="flex items-center gap-3">
                             <MapPin className="w-3 h-3 text-[#b4925e]" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{art.location}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#b4925e] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                             Expertise Report <ChevronRight className="w-4 h-4" />
                          </span>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: COLLECTION DETAIL (single work expertise report)
   ========================================================================== */
function CollectionDetail({ id, onBack, onContact }: { id: string, onBack: () => void, onContact: () => void }) {
  const art = ARCHIVE_WORKS.find(a => a.id === id)
  const detail = WORK_DETAILS[id]
  if (!art) {
    return (
      <div className="pt-48 pb-32 px-8 md:px-20 max-w-[1200px] mx-auto text-center">
         <p className="text-white/40 uppercase tracking-widest text-sm italic mb-12">Œuvre introuvable.</p>
         <button onClick={onBack} className="text-[#b4925e] uppercase tracking-widest text-[10px] font-black">← Retour à la collection</button>
      </div>
    )
  }
  return (
    <div className="pt-40 pb-32">
       <div className="max-w-[1500px] mx-auto px-8 md:px-20">
          <button
             onClick={onBack}
             className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-[#b4925e] transition-colors mb-16"
          >
             <ChevronLeft className="w-4 h-4" /> Toute la collection
          </button>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
             {/* Visual */}
             <Reveal>
                <div className="relative aspect-[3/4] overflow-hidden border border-white/10 shadow-2xl group">
                   <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                   />
                   <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{art.period}</span>
                   </div>
                </div>
             </Reveal>

             {/* Expertise report */}
             <Reveal delay={0.2} x={30}>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#b4925e] mb-8 block italic underline underline-offset-8">
                   Expertise Report // {art.id}
                </span>
                <h1 className="text-5xl md:text-6xl font-light italic uppercase tracking-tighter text-white leading-[0.9] mb-10" style={{ fontFamily: "serif" }}>
                   {art.title}
                </h1>

                <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 mb-12">
                   {[
                     { label: "Statut", value: art.status },
                     { label: "Node", value: art.location },
                     { label: "Médium", value: detail?.medium ?? "—" },
                     { label: "Dimensions", value: detail?.dimensions ?? "—" }
                   ].map((row, i) => (
                     <div key={i} className="bg-[#0c0c0e] p-6">
                        <div className="text-[8px] font-black uppercase text-[#b4925e] mb-2 tracking-[0.3em]">{row.label}</div>
                        <div className="text-sm font-light text-white italic">{row.value}</div>
                     </div>
                   ))}
                </div>

                <div className="space-y-6 mb-12">
                   {(detail?.essay ?? [art.desc]).map((para, i) => (
                     <p key={i} className="text-[12px] text-white/40 leading-loose uppercase tracking-[0.15em] font-bold italic">
                        {para}
                     </p>
                   ))}
                </div>

                <div className="border-t border-white/5 pt-8 mb-12">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#b4925e]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Acquisition</span>
                   </div>
                   <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold italic">{detail?.acquisition ?? "Dossier confidentiel."}</p>
                </div>

                <button
                   onClick={onContact}
                   className="w-full py-6 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                   <Lock className="w-4 h-4" /> Demander le dossier de provenance
                </button>
             </Reveal>
          </div>
       </div>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: JOURNAL INDEX (editorial articles)
   ========================================================================== */
function JournalIndex({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <div>
      <PageHeader
        chapter="Chapitre IV // Editorial"
        title="The Journal."
        intro="Réflexions, méthodes et regards de l'Archive sur l'art de conserver, d'expertiser et de transmettre les chefs-d'œuvre confiés à notre garde."
      />
      <section className="py-32 bg-black border-y border-white/5">
         <div className="max-w-[1500px] mx-auto px-8 md:px-20">
            <div className="grid md:grid-cols-2 gap-16">
               {JOURNAL.map((post, i) => (
                 <Reveal key={post.slug} delay={(i % 2) * 0.1} y={60}>
                    <article
                       onClick={() => onOpen(post.slug)}
                       className="group relative bg-[#0c0c0e] border border-white/5 hover:border-[#b4925e]/30 transition-all duration-700 cursor-pointer h-full flex flex-col"
                    >
                       <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                             src={post.image}
                             alt={post.title}
                             fill
                             className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute top-6 left-6">
                             <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{post.category}</span>
                          </div>
                       </div>
                       <div className="p-12 flex flex-col flex-1">
                          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">{post.date}</span>
                          <h3 className="text-2xl md:text-3xl font-light italic uppercase tracking-tighter text-white group-hover:text-[#b4925e] transition-colors mb-8 leading-tight" style={{ fontFamily: "serif" }}>
                             {post.title}
                          </h3>
                          <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic mb-8 flex-1">
                             {post.excerpt}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#b4925e] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                             Lire l'article <ChevronRight className="w-4 h-4" />
                          </span>
                       </div>
                    </article>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: JOURNAL ARTICLE (single editorial)
   ========================================================================== */
function JournalArticle({ slug, onBack }: { slug: string, onBack: () => void }) {
  const post = JOURNAL.find(p => p.slug === slug)
  if (!post) {
    return (
      <div className="pt-48 pb-32 px-8 md:px-20 max-w-[1200px] mx-auto text-center">
         <p className="text-white/40 uppercase tracking-widest text-sm italic mb-12">Article introuvable.</p>
         <button onClick={onBack} className="text-[#b4925e] uppercase tracking-widest text-[10px] font-black">← Retour au journal</button>
      </div>
    )
  }
  return (
    <article className="pt-40 pb-32">
       <div className="max-w-[860px] mx-auto px-8 md:px-12">
          <button
             onClick={onBack}
             className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-[#b4925e] transition-colors mb-16"
          >
             <ChevronLeft className="w-4 h-4" /> Tout le journal
          </button>

          <div className="flex items-center gap-6 mb-10">
             <span className="px-3 py-1 bg-[#b4925e] text-black text-[8px] font-black uppercase tracking-widest">{post.category}</span>
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">{post.date}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light italic uppercase tracking-tighter text-white leading-[0.9] mb-16" style={{ fontFamily: "serif" }}>
             {post.title}
          </h1>

          <div className="relative aspect-[16/9] overflow-hidden border border-white/10 shadow-2xl mb-16">
             <Image src={post.image} alt={post.title} fill className="object-cover grayscale" />
          </div>

          <div className="space-y-8">
             {post.body.map((para, i) => (
               <p key={i} className="text-base md:text-lg text-white/50 leading-loose font-light italic" style={{ fontFamily: "serif" }}>
                  {para}
               </p>
             ))}
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
             <p className="text-[10px] text-white/20 italic font-bold uppercase tracking-[0.3em] leading-relaxed">
                Article rédigé par les conservateurs de The Ivory Archive. Ce contenu est diffusé à titre éditorial et ne constitue pas une expertise contractuelle.
             </p>
          </div>
       </div>
    </article>
  )
}

/* ==========================================================================
   SUB-PAGE: À PROPOS (maison story / values / nodes)
   ========================================================================== */
function AboutPage({ onContact }: { onContact: () => void }) {
  const ABOUT_PARAS = [
    "Fondée pour répondre à une exigence singulière — celle de conserver l'inestimable —, The Ivory Archive est une maison de conservation et de registre privé dédiée aux chefs-d'œuvre de l'histoire de l'art.",
    "Notre mandat ne se limite pas à la garde. Il engage une science : imagerie multispectrale, stabilisation atmosphérique, expertise métallurgique et pigmentaire. Chaque geste est documenté, chaque pièce est traçée du premier au dernier maillon de sa provenance.",
    "Réparti sur quatre nodes de haute sécurité — Zurich, Paris, Londres et Tokyo —, l'Archive opère dans la plus stricte confidentialité, au service des institutions muséales et des collectionneurs les plus exigeants."
  ]
  const VALUES = [
    { icon: ShieldCheck, title: "Discrétion", text: "La confidentialité absolue gouverne chacune de nos interventions, du premier contact à la conservation pérenne." },
    { icon: Microscope, title: "Science", text: "Une rigueur de laboratoire sans compromis : chaque diagnostic précède chaque geste, chaque geste est consigné." },
    { icon: History, title: "Mémoire", text: "Reconstituer et préserver la chaîne de provenance, condition même de l'authenticité et de la transmission." }
  ]
  const NODES = [
    { city: "Zurich", role: "High-Security Vault" },
    { city: "Paris", role: "Exhibition Annex" },
    { city: "London", role: "Conservation Lab" },
    { city: "Tokyo", role: "Private Node" }
  ]
  return (
    <div>
      <PageHeader
        chapter="La Maison"
        title="The Ivory Archive."
        intro="Une maison de conservation et de registre privé, vouée à faire taire le temps pour laisser parler l'histoire."
      />

      {/* Story */}
      <section id="about" className="py-32 bg-[#0c0c0e]">
         <div className="max-w-[860px] mx-auto px-8 md:px-12">
            {ABOUT_PARAS.map((para, i) => (
              <Reveal key={i} delay={i * 0.1}>
                 <p className="text-lg md:text-xl text-white/45 leading-loose font-light italic mb-10" style={{ fontFamily: "serif" }}>
                    {para}
                 </p>
              </Reveal>
            ))}
         </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-black border-y border-white/5">
         <div className="max-w-[1400px] mx-auto px-8 md:px-20">
            <SectionTitle subtitle="Nos principes" title="Doctrine." />
            <div className="grid md:grid-cols-3 gap-16">
               {VALUES.map((v, i) => (
                 <Reveal key={v.title} delay={i * 0.12} y={60}>
                    <div className="bg-[#0c0c0e] border border-white/5 p-12 hover:border-[#b4925e]/30 transition-all duration-700 h-full">
                       <div className="w-16 h-16 bg-[#b4925e]/10 border border-[#b4925e]/20 flex items-center justify-center mb-10">
                          <v.icon className="w-7 h-7 text-[#b4925e]" />
                       </div>
                       <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white mb-6" style={{ fontFamily: "serif" }}>{v.title}</h3>
                       <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic">{v.text}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* Provenance recap (reuse PROVENANCE_LOGS) */}
      <section className="py-32 bg-[#0c0c0e]">
         <div className="max-w-[1400px] mx-auto px-8 md:px-20 grid lg:grid-cols-2 gap-32 items-center">
            <div>
               <SectionTitle subtitle="Chain of Custody" title="Provenance." alignment="left" />
               <div className="space-y-12">
                  {PROVENANCE_LOGS.map((log, i) => (
                    <div key={i} className="group border-l border-white/5 pl-12 hover:border-[#b4925e] transition-all cursor-default">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-[#b4925e] uppercase tracking-widest">{log.year}</span>
                          <History className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                       </div>
                       <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold leading-relaxed">{log.event}</p>
                    </div>
                  ))}
               </div>
            </div>
            <Reveal delay={0.2} x={30}>
               <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                  {NODES.map((node, i) => (
                    <div key={i} className="bg-black p-10 hover:bg-[#0c0c0e] transition-colors">
                       <Globe2 className="w-5 h-5 text-[#b4925e] mb-6" />
                       <div className="text-2xl font-light italic uppercase tracking-tighter text-white mb-3" style={{ fontFamily: "serif" }}>{node.city}</div>
                       <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">{node.role}</div>
                    </div>
                  ))}
               </div>
            </Reveal>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black border-t border-white/5">
         <div className="max-w-[1200px] mx-auto px-8 md:px-20 text-center">
            <Reveal>
               <h2 className="text-4xl md:text-6xl font-light italic uppercase tracking-tighter text-white mb-10" style={{ fontFamily: "serif" }}>
                  Confier une œuvre.
               </h2>
               <p className="max-w-2xl mx-auto text-[12px] text-white/40 leading-loose uppercase tracking-[0.2em] font-bold italic mb-12">
                  L'accès à notre registre privé est réservé aux institutions muséales et aux collectionneurs certifiés. Initiez un premier échange confidentiel.
               </p>
               <button
                  onClick={onContact}
                  className="inline-flex items-center gap-3 px-12 py-6 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl"
               >
                  Prendre contact <ArrowRight className="w-4 h-4" />
               </button>
            </Reveal>
         </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: CONTACT (address-on-request + form, inputs ≥16px)
   ========================================================================== */
function ContactPage() {
  const [sent, setSent] = useState(false)
  const inputClass = "w-full bg-transparent border-b border-white/10 py-4 text-base font-light italic text-white outline-none focus:border-[#b4925e] transition-colors placeholder:text-white/20"
  const labelClass = "text-[8px] font-black uppercase tracking-[0.4em] text-[#b4925e] block mb-2"
  return (
    <div>
      <PageHeader
        chapter="Acquisitions // Privilège"
        title="Contact."
        intro="Un premier échange confidentiel pour évoquer une conservation, une expertise ou une demande d'accès au registre privé."
      />
      <section className="py-32 bg-black border-y border-white/5">
         <div className="max-w-[1300px] mx-auto px-8 md:px-20 grid lg:grid-cols-2 gap-24">
            {/* Info */}
            <div>
               {[
                 { icon: Mail, label: "Email", value: "contact@aevia.io" },
                 { icon: MapPin, label: "Siège", value: "Adresse communiquée sur demande" },
                 { icon: Clock, label: "Horaires", value: "Lun – Ven · 9h – 19h" },
                 { icon: ShieldCheck, label: "Confidentialité", value: "Discrétion absolue garantie" }
               ].map((row, i) => (
                 <div key={i} className="flex gap-6 items-start mb-10 border-b border-white/5 pb-8">
                    <div className="w-12 h-12 bg-[#b4925e]/10 border border-[#b4925e]/20 flex items-center justify-center flex-shrink-0">
                       <row.icon className="w-5 h-5 text-[#b4925e]" />
                    </div>
                    <div>
                       <div className={labelClass}>{row.label}</div>
                       <div className="text-xl font-light italic text-white" style={{ fontFamily: "serif" }}>{row.value}</div>
                    </div>
                 </div>
               ))}
               <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold italic leading-loose mt-8">
                  Pour des raisons de sécurité propres à notre activité, l'adresse de nos nodes n'est communiquée qu'aux interlocuteurs accrédités, sur demande à contact@aevia.io.
               </p>
            </div>

            {/* Form */}
            <div>
               {sent ? (
                 <div className="border border-white/10 p-16 text-center bg-[#0c0c0e]">
                    <div className="w-16 h-16 bg-[#b4925e]/10 border border-[#b4925e]/20 flex items-center justify-center mx-auto mb-8">
                       <Check className="w-7 h-7 text-[#b4925e]" />
                    </div>
                    <h3 className="text-3xl font-light italic uppercase tracking-tighter text-white mb-4" style={{ fontFamily: "serif" }}>Message reçu</h3>
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold italic leading-loose">
                       Merci. Un conservateur de l'Archive vous répondra sous 24 heures ouvrées, en toute confidentialité.
                    </p>
                 </div>
               ) : (
                 <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="border border-white/10 p-10 md:p-12 bg-[#0c0c0e] space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                          <label className={labelClass}>Nom</label>
                          <input className={inputClass} type="text" placeholder="Votre nom" required />
                       </div>
                       <div>
                          <label className={labelClass}>Institution</label>
                          <input className={inputClass} type="text" placeholder="Entité / collection" />
                       </div>
                    </div>
                    <div>
                       <label className={labelClass}>Email</label>
                       <input className={inputClass} type="email" placeholder="votre@email.com" required />
                    </div>
                    <div>
                       <label className={labelClass}>Nature de la demande</label>
                       <input className={inputClass} type="text" placeholder="Conservation · Expertise · Acquisition" />
                    </div>
                    <div>
                       <label className={labelClass}>Message</label>
                       <textarea className={`${inputClass} min-h-[140px] resize-y`} placeholder="Décrivez brièvement votre demande." required />
                    </div>
                    <button
                       type="submit"
                       className="w-full py-6 bg-[#b4925e] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl"
                    >
                       Envoyer la demande
                    </button>
                 </form>
               )}
            </div>
         </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   SUB-PAGE: LEGAL (Mentions légales + Confidentialité)
   --------------------------------------------------------------------------
   `mentions` content is verbatim per legal requirement. NEVER print a street
   address for the siège social.
   ========================================================================== */
function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const Heading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl md:text-3xl font-light italic uppercase tracking-tighter text-white mt-16 mb-6" style={{ fontFamily: "serif" }}>
       {children}
    </h2>
  )
  const Para = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm text-white/40 leading-loose font-light mb-4">{children}</p>
  )
  const Strong = ({ children }: { children: React.ReactNode }) => (
    <span className="text-white font-bold">{children}</span>
  )

  if (variant === "mentions") {
    return (
      <div>
        <PageHeader chapter="Informations légales" title="Mentions Légales." />
        <section className="py-24 bg-black border-y border-white/5">
           <div className="max-w-[820px] mx-auto px-8 md:px-12">
              <Heading>Éditeur</Heading>
              <Para><Strong>Aevia WS</Strong> — entrepreneur individuel (auto-entrepreneur).</Para>
              <Para>Directeur de la publication : <Strong>Valentin Milliand</Strong>.</Para>
              <Para>SIREN : <Strong>852 546 225</Strong> — RCS Bourg-en-Bresse.</Para>
              <Para>Contact : <Strong>{fd?.email ?? "contact@aevia.io"}</Strong></Para>
              <Para>Adresse du siège social communiquée sur demande à contact@aevia.io.</Para>

              <Heading>TVA</Heading>
              <Para>TVA non applicable, art. 293 B du CGI.</Para>

              <Heading>Hébergeur</Heading>
              <Para>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</Para>

              <Heading>Propriété intellectuelle</Heading>
              <Para>
                 L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
                 de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
                 de l'éditeur.
              </Para>

              <Heading>Responsabilité</Heading>
              <Para>
                 Les informations diffusées sur ce site sont fournies à titre indicatif et ne constituent pas une expertise
                 contractuelle. Elles ne sauraient engager la responsabilité de l'éditeur.
              </Para>
           </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader chapter="Protection des données" title="Confidentialité." />
      <section id="contact" className="py-24 bg-black border-y border-white/5">
         <div className="max-w-[820px] mx-auto px-8 md:px-12">
            <Para><span className="italic text-white/30">Dernière mise à jour : juin 2026.</span></Para>

            <Heading>Responsable du traitement</Heading>
            <Para>
               Le responsable du traitement des données personnelles est <Strong>Aevia WS</Strong>, éditeur du site.
               Pour toute question, écrivez à <Strong>{fd?.email ?? "contact@aevia.io"}</Strong>.
            </Para>

            <Heading>Données collectées</Heading>
            <Para>
               Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact
               (nom, email, institution et message), aux seules fins de répondre à votre demande.
            </Para>

            <Heading>Finalité et base légale</Heading>
            <Para>
               Vos données sont traitées sur la base de votre consentement et de l'intérêt légitime de la maison à répondre
               aux sollicitations. Elles ne font l'objet d'aucune cession à des tiers à des fins commerciales.
            </Para>

            <Heading>Durée de conservation</Heading>
            <Para>
               Les données issues du formulaire de contact sont conservées le temps nécessaire au traitement de votre demande,
               puis archivées ou supprimées conformément aux obligations légales applicables.
            </Para>

            <Heading>Vos droits</Heading>
            <Para>
               Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et
               d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
            </Para>

            <Heading>Cookies</Heading>
            <Para>
               Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies techniques strictement nécessaires
               au fonctionnement du site peuvent être utilisés.
            </Para>
         </div>
      </section>
    </div>
  )
}