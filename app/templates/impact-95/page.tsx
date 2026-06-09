"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { Menu, X, ArrowRight, CheckCircle, ChevronRight, Phone, Mail, Clock, Award, Microscope, Shield, FlaskConical, Stethoscope, Sparkles, Star } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type MedPage = "home" | "traitements" | "equipe" | "rdv" | "tarifs" | "contact" | "mentions" | "privacy"

// ─── Fonts ───────────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "fonts-lumiere-clinic"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(s)
  }, [])
}

// ─── Reveal animation ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TREATMENTS = [
  {
    id: "botox",
    icon: Sparkles,
    label: "Toxine botulique",
    title: "Relaxation musculaire de précision",
    desc: "Traitement des rides d'expression par injection de toxine botulique de grade médical. Protocole personnalisé selon l'anatomie faciale, résultats naturels préservant l'expressivité.",
    duration: "30 min",
    results: "3–6 mois",
    price: "à partir de 290 €",
    detail: ["Rides du front", "Pattes d'oie", "Rides du lion", "Transpiration excessive (hyperhidrose)"],
  },
  {
    id: "filler",
    icon: FlaskConical,
    label: "Acide hyaluronique",
    title: "Restauration volumétrique ciblée",
    desc: "Comblement des rides profondes, restauration des volumes faciaux et traitement des cernes. Produits réversibles et biodégradables, techniques d'injection cannule.",
    duration: "45 min",
    results: "12–18 mois",
    price: "à partir de 350 €",
    detail: ["Lèvres & contour buccal", "Sillons naso-géniens", "Cernes & joues", "Remodelage mandibulaire"],
  },
  {
    id: "laser",
    icon: Microscope,
    label: "Lasers médicaux",
    title: "Photobiostimulation & resurfaçage",
    desc: "Gamme de lasers Nd:YAG, CO2 fractionné et IPL pour le traitement des taches pigmentaires, du vieillissement cutané, de la rosacée et des cicatrices.",
    duration: "20–60 min",
    results: "Permanent",
    price: "à partir de 250 €",
    detail: ["Taches pigmentaires", "Rosacée & couperose", "Resurfaçage cutané", "Épilation définitive"],
  },
  {
    id: "peeling",
    icon: Shield,
    label: "Peeling chimique",
    title: "Renouvellement cellulaire par exfoliation",
    desc: "Solutions AHA, BHA ou TCA appliquées selon la profondeur souhaitée. Trois niveaux de traitement : superficiel pour l'éclat, médian pour les rides légères, profond pour le remodelage cutané.",
    duration: "30–60 min",
    results: "6–12 mois",
    price: "à partir de 180 €",
    detail: ["Peeling superficiel (AHA)", "Peeling médian (TCA 20%)", "Peeling profond (TCA 35%)", "Imperfections & irrégularités de teint"],
  },
  {
    id: "meso",
    icon: Stethoscope,
    label: "Mésothérapie",
    title: "Micronutrition cutanée profonde",
    desc: "Cocktails de vitamines, acide hyaluronique non réticulé et oligoéléments injectés en micro-doses dans le derme. Amélioration de l'hydratation, de l'éclat et de la texture cutanée.",
    duration: "30 min",
    results: "3–6 mois",
    price: "150 €/séance",
    detail: ["Cocktails vitamines & minéraux", "Acide hyaluronique non réticulé", "4 à 6 séances conseillées", "Traitement de fond anti-âge"],
  },
  {
    id: "cryo",
    icon: Award,
    label: "Cryolipolyse",
    title: "Réduction non invasive des graisses",
    desc: "Refroidissement contrôlé des cellules graisseuses (adipocytes) à -10°C pour déclencher leur mort naturelle. Réduction visible et permanente des graisses localisées sans chirurgie.",
    duration: "1 heure",
    results: "Permanent",
    price: "450 €/zone",
    detail: ["Ventre & flancs", "Cuisses & culotte de cheval", "Bras & dos", "Réduction moyenne de 20% par séance"],
  },
]

const SCIENCE = [
  { icon: FlaskConical, title: "Protocoles validés", desc: "Tous nos traitements reposent sur des études cliniques de niveau 1 et des recommandations de sociétés savantes (SFML, SFD)." },
  { icon: Shield, title: "Produits CE médical", desc: "Nous utilisons exclusivement des produits homologués CE et FDA, approvisionnés directement auprès des laboratoires." },
  { icon: Microscope, title: "Matériel de pointe", desc: "Lasers médicaux Alma, Quanta et Cynosure. Maintenance certifiée, calibrage semestriel par les constructeurs." },
  { icon: Award, title: "Formation continue", desc: "Nos praticiens se forment chaque année aux congrès IMCAS (Paris), AMWC (Monaco) et AAD (USA)." },
]

// ─── Sub-pages ────────────────────────────────────────────────────────────────

function TraitementsPage({ goTo }: { goTo: (p: MedPage) => void }) {
  const [active, setActive] = useState(0)
  const ActiveIcon = TREATMENTS[active].icon
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Catalogue complet</p>
          <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Nos <em>traitements</em>
          </h1>
          <p className="text-[#6B6560] leading-relaxed max-w-2xl mb-16">
            Chaque traitement est précédé d&apos;une consultation médicale gratuite (30 min). Nous établissons un bilan complet, définissons les objectifs et proposons un protocole adapté. Aucun geste sans accord éclairé.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-0 border border-[#E8E4DE] mb-20">
          <div className="lg:col-span-2 border-r border-[#E8E4DE]">
            {TREATMENTS.map((t, i) => {
              const Icon = t.icon
              return (
                <button key={t.id} type="button" onClick={() => setActive(i)}
                  className={`w-full text-left p-5 border-b border-[#E8E4DE] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${active === i ? "bg-[#181410] text-[#FAFAF8]" : "hover:bg-[#F0EDE8]"}`}>
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 text-[#3A8080]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${active === i ? "text-[#FAFAF8]" : "text-[#181410]"}`}>{t.label}</div>
                    <div className={`text-xs mt-0.5 ${active === i ? "text-[#8A9A9A]" : "text-[#8A8278]"}`}>{t.price}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${active === i ? "text-[#3A8080]" : "text-[#3A8080] opacity-0 group-hover:opacity-100"}`} />
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="w-12 h-12 border border-[#3A8080] flex items-center justify-center">
                    <ActiveIcon className="w-6 h-6 text-[#3A8080]" />
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{TREATMENTS[active].duration}</span>
                    <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5">Résultats : {TREATMENTS[active].results}</span>
                    <span className="bg-[#F0EDE8] text-[#8A6840] px-3 py-1.5">{TREATMENTS[active].price}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {TREATMENTS[active].title}
                </h2>
                <p className="text-[#6B6560] leading-relaxed mb-8">{TREATMENTS[active].desc}</p>
                <div className="space-y-3 mb-10">
                  <p className="text-xs tracking-[0.2em] uppercase text-[#3A8080] mb-4">Indications traitées</p>
                  {TREATMENTS[active].detail.map(d => (
                    <div key={d} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#3A8080] flex-shrink-0" />
                      <span className="text-[#3A3028]">{d}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => goTo("rdv")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#181410] text-[#FAFAF8] text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
                  Réserver une consultation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Science pillars */}
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Notre approche</p>
          <h2 className="text-3xl font-light mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Rigueur médicale au service de l&apos;<em>esthétique</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCIENCE.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="bg-[#F0EDE8] p-7 group hover:bg-[#181410] transition-colors duration-300">
                  <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center mb-5 group-hover:bg-[#3A8080] transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#3A8080] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-light mb-3 group-hover:text-[#FAFAF8] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                  <p className="text-sm text-[#6B6560] group-hover:text-[#8A8278] leading-relaxed transition-colors duration-300">{s.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EquipePage() {
  const team = [
    {
      name: "Dr. Sophie Lemaire",
      spec: "Médecin esthétique",
      diploma: "DU Médecine esthétique — Sorbonne Paris",
      exp: "10 ans d'expérience · Spécialité injections",
      quote: "Je crois en une esthétique médicale honnête : améliorer sans effacer, sublimer sans uniformiser.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    },
    {
      name: "Dr. Thomas Blanc",
      spec: "Dermatologue & Expert Laser",
      diploma: "DES Dermatologie — Université Paris Cité",
      exp: "Speaker IMCAS Paris · Expert lasers médicaux",
      quote: "La technologie laser permet aujourd'hui des résultats que l'on croyait réservés à la chirurgie. Avec moins de risques et zéro cicatrice.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop",
    },
    {
      name: "Camille Martin",
      spec: "Infirmière coordinatrice médicale",
      diploma: "IFSI Paris · DU Soins esthétiques",
      exp: "Coordinatrice des parcours patients",
      quote: "Mon rôle est de vous accompagner à chaque étape, de la première question jusqu'au suivi post-traitement.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&fit=crop",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">L&apos;équipe</p>
          <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Nos <em>praticiens</em>
          </h1>
          <p className="text-[#6B6560] leading-relaxed max-w-2xl mb-16">
            Une équipe de médecins et soignants diplômés d&apos;État, formés dans les meilleures institutions françaises et en formation continue permanente aux dernières avancées de la médecine esthétique.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {team.map((doc, i) => (
            <Reveal key={doc.name} delay={i * 0.1}>
              <div className="bg-[#FAFAF8] border border-[#E8E4DE] group overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={doc.image} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale" loading="lazy" />
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3A8080] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{doc.name}</h3>
                  <p className="text-[#3A8080] text-xs tracking-widest uppercase mb-4">{doc.spec}</p>
                  <p className="text-xs text-[#8A8278] mb-1">{doc.diploma}</p>
                  <p className="text-xs text-[#8A8278] mb-5">{doc.exp}</p>
                  <blockquote className="border-l-2 border-[#3A8080] pl-4 italic text-[#6B6560] text-sm leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px" }}>
                    &ldquo;{doc.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="bg-[#F0EDE8] p-10 md:p-14 grid md:grid-cols-4 gap-10 border border-[#D8D0C8]">
            {[["3", "Médecins"], ["10+", "Ans d'expérience min."], ["4 800+", "Patients suivis"], ["97%", "Satisfaction patient"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-light text-[#3A8080] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                <div className="text-xs text-[#8A8278] uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function RdvPage() {
  const [submitted, setSubmitted] = useState(false)
  const [firstVisit, setFirstVisit] = useState<"premiere" | "suivi">("premiere")

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center py-28">
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="w-16 h-16 border-2 border-[#3A8080] flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-[#3A8080]" />
            </div>
            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Demande enregistrée</h2>
            <p className="text-[#6B6560] leading-relaxed">
              Votre demande est enregistrée. Confirmation par email dans les 24h. Notre équipe vous contactera pour confirmer votre créneau de consultation.
            </p>
            <p className="text-xs text-[#8A8278] mt-6">Consultation initiale gratuite · Aucun engagement</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Rendez-vous</p>
          <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Prendre <em>rendez-vous</em>
          </h1>
          <div className="flex items-center gap-2 mb-10 text-sm text-[#3A8080]">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Consultation gratuite avant tout traitement · Médecins diplômés d&apos;État</span>
          </div>
        </Reveal>

        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
          {/* Type de visite */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-3">Type de visite</label>
            <div className="grid grid-cols-2 gap-3">
              {[["premiere", "Première visite"], ["suivi", "Suivi / retour"]].map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setFirstVisit(val as "premiere" | "suivi")}
                  className={`py-3 px-4 text-sm border transition-all duration-200 cursor-pointer ${firstVisit === val ? "bg-[#181410] text-[#FAFAF8] border-[#181410]" : "bg-transparent border-[#D8D0C8] text-[#6B6560] hover:border-[#181410]"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Traitement */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Traitement souhaité</label>
            <select className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
              <option>Consultation initiale (bilan complet)</option>
              {TREATMENTS.map(t => <option key={t.id}>{t.label} — {t.price}</option>)}
            </select>
          </div>

          {/* Date & heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Date souhaitée</label>
              <input type="date" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Créneau préféré</label>
              <select className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                <option>Matin (9h–12h)</option>
                <option>Après-midi (12h–17h)</option>
                <option>Fin de journée (17h–19h)</option>
                <option>Samedi matin</option>
              </select>
            </div>
          </div>

          {/* Identité */}
          <div className="grid grid-cols-2 gap-4">
            {["Prénom", "Nom"].map(f => (
              <div key={f}>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{f}</label>
                <input className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={f} />
              </div>
            ))}
          </div>

          {/* Âge */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Âge <span className="normal-case text-[#C47A5A]">(18 ans minimum requis)</span></label>
            <input type="number" min={18} max={99} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="Votre âge" />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Email</label>
              <input type="email" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="votre@email.fr" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Téléphone</label>
              <input type="tel" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="+33 6..." />
            </div>
          </div>

          {/* Médical */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Médicaments en cours / allergies connues <span className="normal-case">(optionnel)</span></label>
            <textarea rows={3} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors resize-none"
              placeholder="Ex : anticoagulants, allergie à la lidocaïne..." />
          </div>

          <button type="submit"
            className="w-full bg-[#181410] text-[#FAFAF8] py-4 text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
            Envoyer ma demande de rendez-vous
          </button>
          <p className="text-xs text-[#8A8278] text-center">Confirmation par email dans les 24h · Données protégées RGPD</p>
        </form>
      </div>
    </div>
  )
}

function TarifsPage({ goTo }: { goTo: (p: MedPage) => void }) {
  const categories = [
    {
      label: "Injections — Toxine botulique",
      items: [
        { name: "Front", price: "290 €" },
        { name: "Rides du lion (glabelle)", price: "180 €" },
        { name: "Pattes d'oie", price: "180 €" },
        { name: "Visage complet (3 zones)", price: "550 €" },
        { name: "Hyperhidrose axillaire", price: "490 €" },
      ],
    },
    {
      label: "Acide hyaluronique",
      items: [
        { name: "Lèvres", price: "350 €" },
        { name: "Cernes (tear trough)", price: "450 €" },
        { name: "Sillons naso-géniens", price: "380 €" },
        { name: "Joues & pommettes", price: "480 €" },
        { name: "Menton & mandibule", price: "420 €" },
      ],
    },
    {
      label: "Lasers médicaux",
      items: [
        { name: "Taches pigmentaires (séance)", price: "250 €" },
        { name: "Rosacée & couperose (séance)", price: "350 €" },
        { name: "Laser CO2 fractionné (séance)", price: "500 €" },
        { name: "Épilation laser (zone visage)", price: "80 €" },
        { name: "Épilation laser (zone corps)", price: "120 €" },
      ],
    },
    {
      label: "Peeling chimique",
      items: [
        { name: "Peeling superficiel (AHA)", price: "150 €" },
        { name: "Peeling médian (TCA 20%)", price: "280 €" },
        { name: "Peeling profond (TCA 35%)", price: "480 €" },
        { name: "Forfait 3 peelings superficiels", price: "390 €" },
      ],
    },
  ]

  const packs = [
    { name: "Regard parfait", desc: "Botox (pattes d'oie) + AH cernes", price: "680 €", saving: "Économie 50 €" },
    { name: "Bouche & lèvres", desc: "AH lèvres + contour + hydratation", price: "520 €", saving: "Économie 30 €" },
    { name: "Rajeunissement complet", desc: "3 séances au choix (laser + peeling + meso)", price: "1 200 €", saving: "Économie 180 €" },
    { name: "Éclat printemps", desc: "Mésothérapie x3 + peeling superficiel", price: "580 €", saving: "Économie 70 €" },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Honoraires</p>
          <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Transparence <em>tarifaire</em>
          </h1>
          <p className="text-[#6B6560] leading-relaxed max-w-2xl mb-2">
            Consultation initiale gratuite. Devis personnalisé remis systématiquement lors de la consultation, avant tout acte médical.
          </p>
          <div className="flex items-center gap-2 mb-16 text-sm text-[#3A8080]">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Aucun frais caché · Actes pratiqués par des médecins diplômés d&apos;État</span>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat, ci) => (
            <Reveal key={cat.label} delay={ci * 0.07}>
              <div className="border border-[#E8E4DE]">
                <div className="bg-[#F0EDE8] px-6 py-4 border-b border-[#E8E4DE]">
                  <h3 className="text-sm font-medium tracking-wide text-[#3A3028]">{cat.label}</h3>
                </div>
                <div className="divide-y divide-[#E8E4DE]">
                  {cat.items.map(item => (
                    <div key={item.name} className="px-6 py-4 flex items-center justify-between gap-4">
                      <span className="text-sm text-[#6B6560]">{item.name}</span>
                      <span className="text-base font-light text-[#3A8080] flex-shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Packs */}
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Packs &amp; forfaits</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Protocoles <em>combinés</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {packs.map((pack, i) => (
            <Reveal key={pack.name} delay={i * 0.07}>
              <div className="border border-[#E8E4DE] p-6 hover:border-[#3A8080] transition-colors duration-300 group">
                <div className="text-xs text-[#C9A86C] tracking-widest uppercase mb-4">{pack.saving}</div>
                <h3 className="text-lg font-light mb-2 group-hover:text-[#3A8080] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{pack.name}</h3>
                <p className="text-xs text-[#8A8278] mb-5 leading-relaxed">{pack.desc}</p>
                <div className="text-2xl font-light text-[#3A8080]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{pack.price}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="bg-[#F0EDE8] border border-[#D8D0C8] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-medium text-sm mb-1">Consultation médicale initiale</p>
              <p className="text-xs text-[#8A8278] max-w-md">Gratuite · 30 minutes · Bilan complet + proposition de protocole personnalisé. Aucun geste sans votre accord éclairé.</p>
            </div>
            <button type="button" onClick={() => goTo("rdv")}
              className="flex-shrink-0 px-6 py-3 bg-[#181410] text-[#FAFAF8] text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
              Prendre RDV
            </button>
          </div>
        </Reveal>

        <p className="text-xs text-[#8A8278] mt-6">* Les honoraires sont indicatifs et peuvent varier selon l&apos;anatomie et le protocole établi en consultation. Un devis détaillé est remis avant tout acte.</p>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Nous contacter</p>
              <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Prenez <em>contact</em>
              </h1>
              <p className="text-[#6B6560] leading-relaxed mb-10">
                Notre équipe est disponible pour répondre à toutes vos questions. Adresse du cabinet communiquée sur demande.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#3A8080]" />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#8A8278] mb-1">Email</div>
                    <a href="mailto:contact@aevia.io" className="text-sm text-[#181410] hover:text-[#3A8080] transition-colors">contact@aevia.io</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#3A8080]" />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#8A8278] mb-1">Téléphone</div>
                    <a href="tel:+33145729830" className="text-sm text-[#181410] hover:text-[#3A8080] transition-colors">+33 1 45 72 98 30</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#3A8080]" />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#8A8278] mb-1">Horaires</div>
                    <p className="text-sm text-[#6B6560]">Lun–Ven 9h–18h</p>
                    <p className="text-sm text-[#6B6560]">Sam 9h–13h</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                {["Prénom", "Nom"].map(f => (
                  <div key={f}>
                    <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{f}</label>
                    <input className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={f} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Email</label>
                <input type="email" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="votre@email.fr" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Sujet</label>
                <select className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                  <option>Demande d&apos;information générale</option>
                  <option>Question sur un traitement</option>
                  <option>Demande de devis</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Message</label>
                <textarea rows={5} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors resize-none" placeholder="Votre message..." />
              </div>
              <button type="submit" className="w-full bg-[#181410] text-[#FAFAF8] py-4 text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
                Envoyer le message
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {type === "mentions" ? (
          <>
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Informations légales</p>
              <h1 className="text-4xl md:text-5xl font-light mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mentions légales</h1>
            </Reveal>
            <div className="space-y-10 text-sm text-[#6B6560] leading-relaxed">
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Éditeur du site</h2>
                <p>Ce site est édité par <strong className="text-[#181410]">Aevia WS</strong>, auto-entrepreneur enregistré sous le numéro SIREN <strong className="text-[#181410]">852 546 225</strong>.</p>
                <p className="mt-2">Contact : <a href="mailto:contact@aevia.io" className="text-[#3A8080] hover:underline">contact@aevia.io</a></p>
                <p className="mt-2">Adresse du siège social communiquée sur demande.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Hébergement</h2>
                <p>Ce site est hébergé par <strong className="text-[#181410]">Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Propriété intellectuelle</h2>
                <p>L&apos;ensemble des contenus présents sur ce site (textes, images, graphismes, logo) sont la propriété exclusive d&apos;Aevia WS et sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Responsabilité</h2>
                <p>Les informations figurant sur ce site sont fournies à titre indicatif. Les résultats des traitements médicaux varient selon les individus. Ce site ne constitue pas un avis médical. Consultez un médecin qualifié avant tout acte esthétique.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Ordre professionnel</h2>
                <p>Les actes médicaux présentés sur ce site sont réalisés par des médecins inscrits au Conseil National de l&apos;Ordre des Médecins, conformément aux dispositions du Code de la Santé Publique.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Protection des données</p>
              <h1 className="text-4xl md:text-5xl font-light mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Politique de confidentialité</h1>
            </Reveal>
            <div className="space-y-10 text-sm text-[#6B6560] leading-relaxed">
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Responsable du traitement</h2>
                <p>Aevia WS (SIREN 852 546 225) est responsable du traitement de vos données personnelles. Contact : <a href="mailto:contact@aevia.io" className="text-[#3A8080] hover:underline">contact@aevia.io</a></p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Données collectées</h2>
                <p>Dans le cadre de l&apos;utilisation de ce site et de la prise de rendez-vous, nous collectons : nom, prénom, email, téléphone, informations médicales fournies volontairement. Ces données sont nécessaires à la gestion de votre dossier médical et à la prise en charge.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Base légale et finalités</h2>
                <p>Le traitement de vos données est fondé sur votre consentement (Art. 6.1.a RGPD) et, pour les données médicales, sur la nécessité aux fins de la médecine préventive et curative (Art. 9.2.h RGPD). Vos données sont utilisées exclusivement pour la gestion de votre suivi médical.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Durée de conservation</h2>
                <p>Les données médicales sont conservées conformément aux obligations légales applicables aux dossiers médicaux (20 ans à compter de la dernière consultation). Les données de contact à des fins commerciales sont conservées 3 ans.</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Vos droits</h2>
                <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" className="text-[#3A8080] hover:underline">contact@aevia.io</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
              </div>
              <div>
                <h2 className="text-base font-medium text-[#181410] mb-3">Cookies</h2>
                <p>Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie de traçage publicitaire n&apos;est déposé sans votre consentement explicite.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function LumiereCliniquePage() {
  useFonts()
  const [page, setPage] = useState<MedPage>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTreatment, setActiveTreatment] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  const goTo = (p: MedPage) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ActiveIcon = TREATMENTS[activeTreatment].icon

  const NAV_LINKS: { label: string; key: MedPage }[] = [
    { label: "Traitements", key: "traitements" },
    { label: "Notre Équipe", key: "equipe" },
    { label: "Prendre RDV", key: "rdv" },
    { label: "Tarifs", key: "tarifs" },
    { label: "Contact", key: "contact" },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#181410]" style={{ fontFamily: "'Inter', sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#3A8080] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* ── Nav ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || page !== "home" ? "bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E4DE]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button type="button" onClick={() => goTo("home")} className="flex flex-col text-left cursor-pointer">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em" }}>Lumière Clinic</span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#3A8080]">Médecine esthétique médicale</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#6B6560]">
            {NAV_LINKS.map(l => (
              <button key={l.key} type="button" onClick={() => goTo(l.key)}
                className={`hover:text-[#181410] transition-colors duration-200 cursor-pointer ${page === l.key ? "text-[#181410] border-b border-[#3A8080] pb-0.5" : ""}`}>
                {l.label}
              </button>
            ))}
            <button type="button" onClick={() => goTo("rdv")}
              className="ml-2 px-5 py-2.5 bg-[#181410] text-[#FAFAF8] text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
              Prendre RDV
            </button>
          </div>
          <button type="button" className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#FAFAF8] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DE]">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">Lumière Clinic</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {NAV_LINKS.map((l, i) => (
                <motion.div key={l.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <button type="button" onClick={() => goTo(l.key)}
                    className={`text-3xl font-light hover:text-[#3A8080] transition-colors cursor-pointer text-left ${page === l.key ? "text-[#3A8080]" : ""}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l.label}</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page routing ── */}
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

          {page === "home" && (
            <>
              {/* Hero */}
              <section ref={heroRef} className="relative min-h-screen overflow-hidden">
                <motion.div className="absolute inset-0" style={{ y: heroY }}>
                  <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85&fit=crop" alt="Lumière Clinic" fill className="object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8]/95 via-[#FAFAF8]/70 to-[#FAFAF8]/20" />
                </motion.div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 min-h-screen flex flex-col justify-center">
                  <Reveal>
                    <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-8">Médecine esthétique de précision</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-light leading-[1.0] mb-8 max-w-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      La beauté<br /><em>comme résultat</em><br />de la science
                    </h1>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-[#6B6560] text-lg leading-relaxed max-w-lg mb-12">
                      Lumière Clinic allie rigueur médicale et approche esthétique personnalisée. Chaque protocole est co-construit avec le patient, fondé sur des preuves scientifiques et exécuté avec précision.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="flex flex-col sm:flex-row gap-5">
                      <button type="button" onClick={() => goTo("rdv")}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#181410] text-[#FAFAF8] text-sm uppercase tracking-widest hover:bg-[#3A8080] transition-colors cursor-pointer">
                        Consultation médicale <ArrowRight className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => goTo("traitements")}
                        className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9C0B0] text-[#181410] text-sm uppercase tracking-widest hover:border-[#181410] transition-colors cursor-pointer">
                        Nos traitements
                      </button>
                    </div>
                  </Reveal>
                  <div className="mt-20 pt-10 border-t border-[#E8E4DE] grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
                    {[["3 médecins", "Spécialistes"], ["10 ans", "D'expertise min."], ["4 800+", "Patients suivis"], ["97%", "Satisfaction"]].map(([val, label]) => (
                      <div key={label}>
                        <div className="text-2xl font-light text-[#3A8080] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                        <div className="text-xs text-[#8A8278] uppercase tracking-wide">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Treatments section */}
              <section className="py-28 bg-[#FAFAF8]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="grid md:grid-cols-5 gap-10 mb-16">
                    <div className="md:col-span-2">
                      <Reveal>
                        <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Traitements</p>
                        <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Protocoles<br />médicaux de<br /><em>référence</em>
                        </h2>
                      </Reveal>
                    </div>
                    <div className="md:col-span-3">
                      <Reveal delay={0.1}>
                        <p className="text-[#6B6560] leading-relaxed">
                          Chaque traitement est précédé d&apos;une consultation médicale approfondie (30 min). Nous établissons un bilan complet, définissons les objectifs et proposons un protocole adapté. Aucun geste sans accord éclairé.
                        </p>
                        <button type="button" onClick={() => goTo("traitements")}
                          className="mt-6 inline-flex items-center gap-2 text-sm text-[#3A8080] border-b border-[#3A8080] pb-0.5 hover:text-[#181410] hover:border-[#181410] transition-colors cursor-pointer">
                          Voir tous les traitements <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Reveal>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-5 gap-0 border border-[#E8E4DE]">
                    <div className="lg:col-span-2 border-r border-[#E8E4DE]">
                      {TREATMENTS.map((t, i) => {
                        const Icon = t.icon
                        return (
                          <button key={t.id} type="button" onClick={() => setActiveTreatment(i)}
                            className={`w-full text-left p-5 border-b border-[#E8E4DE] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${activeTreatment === i ? "bg-[#181410] text-[#FAFAF8]" : "hover:bg-[#F0EDE8]"}`}>
                            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 text-[#3A8080]">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${activeTreatment === i ? "text-[#FAFAF8]" : "text-[#181410]"}`}>{t.label}</div>
                            </div>
                            <ChevronRight className={`w-4 h-4 ml-auto transition-colors ${activeTreatment === i ? "text-[#3A8080]" : "text-[#3A8080] opacity-0 group-hover:opacity-100"}`} />
                          </button>
                        )
                      })}
                    </div>

                    <div className="lg:col-span-3">
                      <AnimatePresence mode="wait">
                        <motion.div key={activeTreatment} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                          className="p-8 md:p-12">
                          <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="w-12 h-12 border border-[#3A8080] flex items-center justify-center">
                              <ActiveIcon className="w-6 h-6 text-[#3A8080]" />
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{TREATMENTS[activeTreatment].duration}</span>
                              <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5">Résultats : {TREATMENTS[activeTreatment].results}</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {TREATMENTS[activeTreatment].title}
                          </h3>
                          <p className="text-[#6B6560] leading-relaxed mb-8">{TREATMENTS[activeTreatment].desc}</p>
                          <div className="space-y-3">
                            <p className="text-xs tracking-[0.2em] uppercase text-[#3A8080] mb-4">Indications traitées</p>
                            {TREATMENTS[activeTreatment].detail.map(d => (
                              <div key={d} className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-[#3A8080] flex-shrink-0" />
                                <span className="text-[#3A3028]">{d}</span>
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={() => goTo("rdv")}
                            className="mt-10 inline-flex items-center gap-2 text-sm text-[#3A8080] border-b border-[#3A8080] pb-0.5 hover:text-[#181410] hover:border-[#181410] transition-colors cursor-pointer">
                            Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </section>

              {/* Doctors */}
              <section className="py-28 bg-[#F0EDE8]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="mb-14">
                    <Reveal>
                      <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">L&apos;équipe médicale</p>
                      <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Nos <em>praticiens</em>
                      </h2>
                    </Reveal>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { name: "Dr. Sophie Lemaire", spec: "Médecin esthétique", diploma: "DU Médecine esthétique — Sorbonne", exp: "10 ans · Spécialité injections", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop" },
                      { name: "Dr. Thomas Blanc", spec: "Dermatologue & Lasers", diploma: "DES Dermatologie — Univ. Paris Cité", exp: "Speaker IMCAS Paris", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop" },
                      { name: "Camille Martin", spec: "Coordinatrice médicale", diploma: "IFSI Paris · DU Soins esthétiques", exp: "Coordinatrice parcours patients", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&fit=crop" },
                    ].map((doc, i) => (
                      <Reveal key={doc.name} delay={i * 0.1}>
                        <div className="bg-[#FAFAF8] group cursor-pointer" onClick={() => goTo("equipe")}>
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image src={doc.image} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale" loading="lazy" />
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3A8080] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{doc.name}</h3>
                            <p className="text-[#3A8080] text-xs tracking-wide uppercase mb-3">{doc.spec}</p>
                            <p className="text-xs text-[#8A8278] mb-1">{doc.diploma}</p>
                            <p className="text-xs text-[#8A8278]">{doc.exp}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <Reveal delay={0.15}>
                    <button type="button" onClick={() => goTo("equipe")}
                      className="mt-10 inline-flex items-center gap-2 text-sm text-[#3A8080] border-b border-[#3A8080] pb-0.5 hover:text-[#181410] hover:border-[#181410] transition-colors cursor-pointer">
                      Découvrir toute l&apos;équipe <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Reveal>
                </div>
              </section>

              {/* Science pillars */}
              <section className="py-28 bg-[#181410] text-[#FAFAF8]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="grid md:grid-cols-2 gap-16 mb-16">
                    <Reveal>
                      <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Notre approche scientifique</p>
                      <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        La rigueur médicale<br />au service de<br /><em>l&apos;esthétique</em>
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <p className="text-[#8A8278] leading-relaxed mt-8 md:mt-0">
                        Nous refusons les traitements « tendance » sans fondement clinique. Chaque technique que nous pratiquons est validée par la communauté scientifique internationale. Notre réputation repose sur des résultats durables, pas sur des promesses.
                      </p>
                    </Reveal>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3A3020]">
                    {SCIENCE.map((s, i) => {
                      const Icon = s.icon
                      return (
                        <Reveal key={s.title} delay={i * 0.08}>
                          <div className="bg-[#181410] p-8 group hover:bg-[#231E14] transition-colors duration-300">
                            <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center mb-6 group-hover:bg-[#3A8080] transition-colors duration-300">
                              <Icon className="w-5 h-5 text-[#3A8080] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                            <p className="text-sm text-[#8A8278] leading-relaxed">{s.desc}</p>
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-28 bg-[#FAFAF8]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <Reveal>
                    <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4 text-center">Témoignages patients</p>
                    <h2 className="text-4xl font-light text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Des résultats qui <em>parlent</em>
                    </h2>
                  </Reveal>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { name: "Claire M.", age: "47 ans", treatment: "Toxine botulique + AH", text: "J'appréhendais depuis des années. Le Dr. Lemaire a pris le temps de m'expliquer chaque geste. Le résultat est exactement ce que je voulais : naturel. On ne voit pas que j'ai été traitée, on dit seulement que j'ai l'air reposée.", stars: 5 },
                      { name: "Sophie L.", age: "38 ans", treatment: "Laser pigmentaire", text: "Trois séances pour des taches que j'avais depuis ma grossesse. Le Dr. Blanc a été d'une précision chirurgicale. Six mois plus tard, les taches ont complètement disparu. Incroyable.", stars: 5 },
                      { name: "Marie-Anne P.", age: "54 ans", treatment: "Peeling médian + mésothérapie", text: "L'éclat que j'avais perdu est revenu progressivement sur 2 mois. Aucune rougeur durable, aucun effet agressif. Camille a suivi mon parcours de A à Z avec une disponibilité rare.", stars: 5 },
                    ].map((t, i) => (
                      <Reveal key={t.name} delay={i * 0.1}>
                        <div className="bg-[#F0EDE8] p-8">
                          <div className="flex gap-1 mb-5">
                            {[...Array(t.stars)].map((_, si) => (
                              <Star key={si} className="w-3 h-3 fill-[#C9A86C] text-[#C9A86C]" />
                            ))}
                          </div>
                          <p className="text-[#3A3028] leading-relaxed mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
                            &ldquo;{t.text}&rdquo;
                          </p>
                          <div>
                            <div className="font-medium text-sm">{t.name} · {t.age}</div>
                            <div className="text-xs text-[#8A8278] mt-0.5">{t.treatment}</div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA tarifs */}
              <section className="py-20 bg-[#F0EDE8]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <Reveal>
                      <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-3">Transparence tarifaire</p>
                      <h2 className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Consultation initiale <em>gratuite</em>
                      </h2>
                      <p className="text-[#6B6560] text-sm mt-3 max-w-md">Devis personnalisé remis systématiquement lors de la consultation, avant tout acte médical.</p>
                    </Reveal>
                  </div>
                  <Reveal delay={0.1}>
                    <div className="flex gap-4 flex-shrink-0">
                      <button type="button" onClick={() => goTo("tarifs")}
                        className="px-6 py-3 border border-[#181410] text-[#181410] text-xs tracking-widest uppercase hover:bg-[#181410] hover:text-[#FAFAF8] transition-colors duration-300 cursor-pointer">
                        Voir les tarifs
                      </button>
                      <button type="button" onClick={() => goTo("rdv")}
                        className="px-6 py-3 bg-[#181410] text-[#FAFAF8] text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
                        Prendre RDV
                      </button>
                    </div>
                  </Reveal>
                </div>
              </section>
            </>
          )}

          {page === "traitements" && <TraitementsPage goTo={goTo} />}
          {page === "equipe" && <EquipePage />}
          {page === "rdv" && <RdvPage />}
          {page === "tarifs" && <TarifsPage goTo={goTo} />}
          {page === "contact" && <ContactPage />}
          {page === "mentions" && <LegalPage type="mentions" />}
          {page === "privacy" && <LegalPage type="privacy" />}

        </motion.div>
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="bg-[#0E0A06] text-[#6B6560] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <button type="button" onClick={() => goTo("home")} className="text-left cursor-pointer">
                <div className="text-[#FAFAF8] text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Lumière Clinic</div>
                <div className="text-[#3A8080] text-xs tracking-widest uppercase mb-4">Médecine esthétique médicale</div>
              </button>
              <p className="text-sm leading-relaxed max-w-xs mb-5">Rigueur médicale, résultats naturels. Traitements validés cliniquement, pratiqués par des médecins diplômés d&apos;État.</p>
              <p className="text-xs text-[#4A4038] leading-relaxed max-w-xs">
                Les résultats varient selon les individus. Actes réalisés par des médecins diplômés d&apos;État. Avant tout traitement, une consultation médicale préalable est obligatoire.
              </p>
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {NAV_LINKS.map(l => (
                <button key={l.key} type="button" onClick={() => goTo(l.key)}
                  className="block text-sm hover:text-[#FAFAF8] mb-3 transition-colors cursor-pointer text-left">
                  {l.label}
                </button>
              ))}
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Contact</p>
              <p className="text-sm mb-2">Adresse sur demande</p>
              <a href="mailto:contact@aevia.io" className="text-sm mb-2 block hover:text-[#FAFAF8] transition-colors">contact@aevia.io</a>
              <a href="tel:+33145729830" className="text-sm mb-2 block hover:text-[#FAFAF8] transition-colors">+33 1 45 72 98 30</a>
              <p className="text-sm text-[#3A8080] mt-4 text-xs">Lun–Ven 9h–18h · Sam 9h–13h</p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2A1E12] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2025 Lumière Clinic — Aevia WS · SIREN 852 546 225 · Ordre National des Médecins</span>
            <div className="flex gap-6">
              <button type="button" onClick={() => goTo("mentions")} className="hover:text-[#FAFAF8] transition-colors cursor-pointer">Mentions légales</button>
              <button type="button" onClick={() => goTo("privacy")} className="hover:text-[#FAFAF8] transition-colors cursor-pointer">Confidentialité</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
