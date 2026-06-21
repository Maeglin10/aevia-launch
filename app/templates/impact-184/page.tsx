// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, CheckCircle, Phone, Star, MapPin, Clock, Shield, Leaf, Home, Building, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   BRILLO NET — Entreprise de ménage & nettoyage professionnel (Lyon)
   Palette : blanc pur / turquoise frais #0d9488 / fond doux #f0fafa / charbon #1c2b2b
   Fonts : Plus Jakarta Sans (titres) + Inter (corps)
   Style : ultra propre, aéré, confiance, professionnel
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SERVICES = [
  { icon: Home, title: "Ménage domicile", desc: "Passage régulier hebdomadaire ou bihebdomadaire. Dépoussiérage, aspiration, nettoyage sols, sanitaires, cuisine. Produits écologiques certifiés." },
  { icon: Building, title: "Nettoyage bureaux", desc: "Locaux professionnels, open spaces, salles de réunion, sanitaires. Intervention en soirée ou week-end pour ne pas perturber l'activité." },
  { icon: Sparkles, title: "Nettoyage fin de chantier", desc: "Déblayage et nettoyage complet post-travaux. Vitres, plinthes, enduits, carrelage. Rendu prêt à emménager en 1 intervention." },
  { icon: Leaf, title: "Ménage écologique", desc: "Produits certifiés Ecocert / Ecolabel uniquement. Zéro toxique, zéro résidu chimique. Idéal familles avec enfants en bas âge ou allergiques." },
  { icon: Clock, title: "Ménage express & ponctuel", desc: "Avant/après emménagement, avant une réception, entre deux locataires Airbnb. Intervention rapide sous 24h sur Lyon Métropole." },
  { icon: Shield, title: "Vitres & surfaces vitrées", desc: "Lavage de vitres intérieures et extérieures jusqu'au 3ème étage. Velux, baies, vérandas. Sans traces garanties, finition cristal." },
]

export default function BrilloNetPage() {
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
  }, [])

  return (
    <div className="bg-white text-[#1c2b2b] overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/98 backdrop-blur-xl py-3 shadow-sm border-b border-[#0d9488]/10" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0d9488]" />
            <span className="font-bold text-[#1c2b2b] tracking-tight text-sm">Brillo<span className="text-[#0d9488]">Net</span></span>
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c2b2b]/30">
            {["Services", "Tarifs", "Zone", "Avis", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-[#0d9488] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:0478123456" className="hidden md:flex items-center gap-2 text-[#0d9488] font-bold text-sm">
              <Phone className="w-4 h-4" /> 04 78 12 34 56
            </a>
            <button className="hidden md:block px-5 py-2.5 bg-[#0d9488] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#0b7d73] transition-colors rounded-full">
              Devis gratuit
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-slate-100 p-10">
                <div className="flex flex-col gap-7 mt-16">
                  {["Services", "Tarifs", "Contact"].map(l => <Link key={l} href="#" className="text-3xl font-bold text-[#1c2b2b] hover:text-[#0d9488] transition-colors">{l}</Link>)}
                  <a href="tel:0478123456" className="flex items-center gap-3 text-[#0d9488] font-bold text-xl mt-4"><Phone className="w-5 h-5" /> 04 78 12 34 56</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[110vh] min-h-[820px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=85&w=2400" alt="Nettoyage professionnel intérieur" fill className="object-cover" priority style={{ filter: "brightness(0.45)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e1e] via-[#0a1e1e]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e1e]/60 to-transparent" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
          className="absolute top-28 right-8 md:right-16 z-10 bg-[#0d9488]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
          <Leaf className="w-3 h-3" /> Produits 100% éco
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-[1px] bg-[#0d9488]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#2dd4bf]">Ménage & Nettoyage Pro · Lyon Métropole</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[82px] font-bold leading-[0.88] tracking-tight mb-8 text-white">
            Votre intérieur,<br />impeccable.
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.72 }}
            className="max-w-md text-sm text-white/38 leading-relaxed mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Entreprise de ménage et nettoyage sur Lyon. Domicile, bureaux, fin de chantier. Intervenantes formées, assurées, ponctualité garantie. Premier passage sans engagement.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.98 }} className="flex flex-wrap gap-3 mb-8">
            <button className="px-8 py-4 bg-[#0d9488] text-white font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-[#0b7d73] transition-colors rounded-full">
              Devis gratuit sous 2h
            </button>
            <a href="tel:0478123456" className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#0d9488]/50 hover:text-[#2dd4bf] transition-all rounded-full">
              <Phone className="w-4 h-4" /> Appeler maintenant
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.7 }} className="flex flex-wrap items-center gap-6">
            {["Assurés RC Pro", "Ponctualité garantie", "Devis gratuit 2h"].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#0d9488]" />
                <span className="text-[10px] font-bold text-white/35 uppercase tracking-wide">{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="w-[1px] h-10 bg-gradient-to-b from-[#0d9488]/60 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-[#f0fafa]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { v: "12 ans", l: "D'expérience" },
            { v: "1 400+", l: "Clients réguliers" },
            { v: "4.9★", l: "Note Google" },
            { v: "0 toxique", l: "Produits éco certifiés" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-[#0d9488] mb-1">{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#1c2b2b]/35">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16 flex flex-col md:flex-row md:items-end gap-8 justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0d9488] mb-4">Nos prestations</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1c2b2b]">Des solutions pour<br /><span className="text-[#0d9488]">chaque besoin.</span></h2>
              </div>
              <p className="max-w-xs text-sm text-[#1c2b2b]/40 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Particuliers ou professionnels, ponctuel ou régulier, écologique en option standard.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group p-7 rounded-2xl border border-[#e8f7f6] hover:border-[#0d9488]/25 hover:shadow-xl hover:shadow-[#0d9488]/5 transition-all duration-500 bg-white h-full">
                  <div className="w-10 h-10 bg-[#0d9488]/8 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0d9488] transition-colors duration-500">
                    <s.icon className="w-5 h-5 text-[#0d9488] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1c2b2b] mb-3 text-sm">{s.title}</h3>
                  <p className="text-sm text-[#1c2b2b]/40 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-24 bg-[#f0fafa]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0d9488] mb-4">Simple comme bonjour</div>
            <h2 className="text-4xl font-bold text-[#1c2b2b]">Comment ça marche ?</h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Devis en ligne", d: "Remplissez le formulaire ou appelez. Réponse sous 2h avec tarif et disponibilités." },
              { n: "02", t: "On s'organise", d: "On choisit ensemble la fréquence, les horaires et les pièces à traiter." },
              { n: "03", t: "Premier passage", d: "Une intervenante formée se présente à l'heure. Badge, blouse, matériel inclus." },
              { n: "04", t: "Vous validez", d: "Satisfaction garantie. Retouche gratuite si quoi que ce soit ne vous convient pas." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="bg-white rounded-2xl p-7 shadow-sm h-full">
                  <div className="text-4xl font-bold text-[#0d9488]/15 mb-4 tracking-tight">{s.n}</div>
                  <div className="font-bold text-[#1c2b2b] mb-2 text-sm">{s.t}</div>
                  <p className="text-sm text-[#1c2b2b]/40 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal><div className="mb-16 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0d9488] mb-4">Ce qu'ils disent</div>
            <h2 className="text-4xl font-bold text-[#1c2b2b]">Clients satisfaits,<br /><span className="text-[#0d9488]">maisons impeccables.</span></h2>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "Intervenante ponctuelle, souriante, impeccable. Notre appartement n'a jamais été aussi propre. On renouvelle chaque semaine sans hésitation.", n: "Claire & Thomas M.", l: "Lyon 6e" },
              { q: "Nettoyage fin de chantier parfait. La cuisine et les vitres étincelaient. Équipe rapide, pro et avec les bons produits. Vraiment recommandé.", n: "Mathieu V.", l: "Villeurbanne" },
              { q: "Nos bureaux sont nettoyés 3 fois par semaine. Zéro problème depuis 2 ans, intervenantes discrètes, travail remarquable. C'est pas donné à tout le monde.", n: "Agence ARBO", l: "Lyon 2e" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl bg-[#f0fafa] border border-[#0d9488]/10 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[#0d9488] text-[#0d9488]" />)}
                  </div>
                  <p className="text-sm text-[#1c2b2b]/50 leading-relaxed italic flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>{`"${t.q}"`}</p>
                  <div className="mt-6 pt-5 border-t border-[#0d9488]/10">
                    <div className="font-bold text-[#1c2b2b] text-sm">{t.n}</div>
                    <div className="text-[10px] text-[#0d9488] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-[#0d9488]">
        <Reveal>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45 mb-6">Premier passage</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Sans engagement,<br />sans contrat forcé.</h2>
            <p className="text-white/55 mb-10 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Devis gratuit en 2h · Premier passage sur Lyon Métropole · Résiliation libre à tout moment
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-[#0d9488] font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[#f0fafa] transition-colors rounded-full shadow-lg">
                Demander mon devis
              </button>
              <a href="tel:0478123456" className="flex items-center gap-3 px-10 py-4 border border-white/25 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all rounded-full">
                <Phone className="w-4 h-4" /> 04 78 12 34 56
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1c2b2b] pt-20 pb-10 px-6">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5"><Sparkles className="w-4 h-4 text-[#0d9488]" /><span className="font-bold text-white text-sm">BrilloNet</span></div>
            <p className="text-white/20 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Ménage & nettoyage professionnel sur Lyon. Particuliers et professionnels. Produits éco certifiés.</p>
          </div>
          {[
            { t: "Services", ls: ["Ménage domicile", "Nettoyage bureaux", "Fin de chantier", "Nettoyage écologique", "Vitres & surfaces"] },
            { t: "Infos", ls: ["Qui sommes-nous", "Zone d'intervention", "Tarifs indicatifs", "Avis clients", "Blog nettoyage"] },
            { t: "Contact", ls: ["04 78 12 34 56", "contact@brillonet.fr", "Lyon Métropole", "7j/7 8h-20h", "Devis gratuit en 2h"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0d9488] mb-5">{col.t}</h4>
              <ul className="space-y-2.5">
                {col.ls.map(l => <li key={l}><Link href="#" className="text-white/20 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1300px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 BrilloNet · SIRET 789 012 345 00067 · RC Pro · Assurance décennale</span>
          <span className="text-[#0d9488]/30">Ménage professionnel · Lyon</span>
        </div>
      </footer>
    </div>
  )
}
