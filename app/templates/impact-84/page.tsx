"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { Menu, X, ArrowRight, Sparkles, FlaskConical, Shield, Microscope, Clock, Phone, Mail, ChevronRight, CheckCircle, Star, Award, Zap, Heart, Scissors } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type ClinicPage = "home" | "protocoles" | "equipe" | "rdv" | "resultats" | "contact" | "mentions" | "privacy"

// ─── Fonts ────────────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "fonts-cypher-clinic"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(s)
  }, [])
}

// ─── Reveal animation ─────────────────────────────────────────────────────────
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
const PROTOCOLS = [
  {
    id: "sculpt", icon: Sparkles, label: "Sculpture faciale",
    title: "Redéfinition volumétrique avancée",
    desc: "Protocole combinant acide hyaluronique rhéologique, toxine botulique graduée et micro-canules de précision pour un remodelage facial complet aux résultats naturels et durables.",
    fullDesc: "Notre protocole de sculpture faciale est conçu pour restaurer les volumes perdus avec l'âge, redéfinir les contours du visage et harmoniser les proportions faciales selon les canons de la beauté médicale. Chaque séance est précédée d'une analyse morphologique numérisée en 3D.",
    duration: "90 min", recovery: "48h",
    results: "Visibles dès J+3, optimaux à 3 semaines",
    price: "À partir de 890 €",
    detail: ["Remodelage mandibulaire", "Restauration pommettes", "Correction cernes", "Redéfinition ovale"]
  },
  {
    id: "bio", icon: FlaskConical, label: "Bioregénération",
    title: "Régénération cellulaire de quatrième génération",
    desc: "Protocole de régénération cellulaire profonde : PRP autologue, polynucléotides PDRN et mésothérapie à base de vitamines liposomales. Amélioration mesurable de la qualité cutanée.",
    fullDesc: "La bioregénération CypherClinic combine les avancées de la biologie cellulaire et de la dermatologie régénérative. Le PRP lymphocytaire issu de votre propre sang active les facteurs de croissance naturels, tandis que les polynucléotides PDRN stimulent la synthèse de collagène en profondeur.",
    duration: "75 min", recovery: "24h",
    results: "Amélioration progressive sur 3 séances",
    price: "À partir de 650 €",
    detail: ["PRP lymphocytaire", "Polynucléotides PDRN", "Vitamines liposomales", "Enzyme complex"]
  },
  {
    id: "laser", icon: Microscope, label: "Lasers médicaux",
    title: "Photothérapie et resurfaçage de précision",
    desc: "Gamme Quanta System Q-YAG 5 et CO2 fractionné Acupulse. Traitement des lésions pigmentaires, rosacée, cicatrices et resurfaçage anti-âge avec résultats permanents.",
    fullDesc: "Notre parc laser médical est parmi les plus complets de Paris. Le laser Q-switched Nd:YAG cible les hyperpigmentations et le mélasma avec une précision nanométrique. Le CO2 fractionné Acupulse réalise un resurfaçage thermique contrôlé qui stimule la néocollagénogénèse.",
    duration: "45 – 90 min", recovery: "3 – 7 jours",
    results: "Permanents après 3 à 5 séances",
    price: "À partir de 350 €/séance",
    detail: ["Q-switched Nd:YAG", "CO2 fractionné", "IPL M22 Lumenis", "LLLT biostimulation"]
  },
  {
    id: "cyber", icon: Shield, label: "CypherSkin™",
    title: "Notre protocole signature exclusif",
    desc: "Développé en 2021 avec l'Institut de Biochimie de Paris, CypherSkin combine 6 technologies en une séance pour obtenir des résultats visibles dès J+7 et durables 18 mois.",
    fullDesc: "CypherSkin™ est notre réponse à la demande de traitements globaux à séance unique. En combinant séquentiellement radiofréquence fractionnée, ultrasons focalisés HIFU, LED thérapeutique rouge et infrarouge, cryolifting, électroporation et mésothérapie sans aiguille, ce protocole agit sur l'ensemble des couches de la peau.",
    duration: "120 min", recovery: "72h",
    results: "Visibles dès J+7, durables 18 mois",
    price: "1 200 €/séance",
    detail: ["Radiofréquence fractionnée", "Ultrasons focalisés", "LED thérapeutique", "Cryolifting"]
  },
  {
    id: "thread", icon: Scissors, label: "Thread Lifting",
    title: "Lifting sans bistouri aux fils tenseurs",
    desc: "Technique de lifting non chirurgical par fils tenseurs résorbables PDO. Repositionnement des tissus ptosés, stimulation collagénique longue durée, sans cicatrice et sans anesthésie générale.",
    fullDesc: "Le thread lifting utilise des fils résorbables en poly-dioxanone (PDO) ou PLLA pour repositionner mécaniquement les tissus tombants et stimuler la production de collagène sur 12 à 18 mois. Technique miniinvasive réalisée sous anesthésie locale, le résultat est immédiat et s'améliore dans les semaines suivantes.",
    duration: "60 min", recovery: "5 – 7 jours",
    results: "Durables 18 à 24 mois",
    price: "À partir de 1 200 €",
    detail: ["Fils PDO résorbables", "Fils PLLA structurants", "Anesthésie locale", "Zéro cicatrice visible"]
  },
  {
    id: "cryo", icon: Zap, label: "Cryolipolyse",
    title: "Réduction ciblée des graisses rebelles",
    desc: "Élimination non invasive des adipocytes par refroidissement contrôlé à -5°C. Résultats permanents sur les zones ciblées, approuvé CE médical, sans chirurgie ni éviction sociale.",
    fullDesc: "La cryolipolyse (CoolSculpting® Elite) permet de détruire définitivement 20 à 25 % des cellules graisseuses d'une zone ciblée en une seule séance. Le froid contrôlé provoque l'apoptose sélective des adipocytes, éliminés naturellement par le système lymphatique sur 6 à 12 semaines.",
    duration: "60 min/zone", recovery: "Aucune éviction",
    results: "-20 à 25% de graisses par zone",
    price: "500 € / zone",
    detail: ["CoolSculpting® Elite", "Double applicateur", "Résultats permanents", "Aucune anesthésie"]
  },
]

const SPECIALISTS = [
  {
    name: "Dr. Alexandre Noir", spec: "Médecin esthétique · Lasers",
    shortBio: "Interne médecine AP-HP · DU Médecine esthétique Paris VI",
    fullBio: "Le Dr. Alexandre Noir a effectué son internat en médecine au sein de l'Assistance Publique – Hôpitaux de Paris avant de se spécialiser en médecine esthétique avec un Diplôme Universitaire obtenu à Paris VI. Orateur régulier à l'IMCAS World Congress, il cumule 15 années d'expérience clinique et a formé plus de 200 confrères aux techniques d'injection de précision. Expert en lasers médicaux, il dirige le protocole CypherSkin™.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&fit=crop",
    certifications: ["IMCAS Speaker", "Formateur référent", "DU Paris VI"],
    experience: "15 ans d'expérience"
  },
  {
    name: "Dr. Valentine Huang", spec: "Dermatologue spécialisée",
    shortBio: "DES Dermatologie Paris V · Fellowship IMCAS Singapore",
    fullBio: "Le Dr. Valentine Huang est dermatologue titulaire d'un Diplôme d'Études Spécialisées de l'Université Paris V. Son fellowship à Singapour sous la direction du Pr. Goh Chee Leok lui a permis d'acquérir une expertise mondiale en dermatologie régénérative et traitements laser avancés. Elle prend en charge les pathologies complexes de la peau et supervise les protocoles de bioregénération.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    certifications: ["DES Dermatologie", "Fellowship Singapore", "Membre SFD"],
    experience: "11 ans d'expérience"
  },
  {
    name: "Dr. Marc Duval", spec: "Chirurgien plasticien",
    shortBio: "DESC Chirurgie plastique Pitié-Salpêtrière · FMH Lausanne",
    fullBio: "Le Dr. Marc Duval a réalisé son DESC de Chirurgie Plastique, Reconstructrice et Esthétique à l'Hôpital de la Pitié-Salpêtrière. Titulaire du titre de spécialiste FMH (Fédération des Médecins Suisses) en chirurgie plastique, il apporte à Cypher Clinic une expertise rare en techniques mini-invasives et en thread lifting. Il assure également les consultations préopératoires pour les patients envisageant une chirurgie.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop",
    certifications: ["DESC Chirurgie plastique", "FMH Lausanne", "SOFCPRE"],
    experience: "18 ans d'expérience"
  },
]

const NURSES = [
  {
    name: "Sophie Laurent", role: "Infirmière coordinatrice",
    bio: "Diplômée en soins infirmiers, spécialisée en oncologie esthétique et coordination de parcours patient. 8 ans d'expérience en clinique esthétique haut de gamme.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&fit=crop"
  },
  {
    name: "Camille Roux", role: "Infirmière coordinatrice",
    bio: "Infirmière DE avec formation complémentaire en soins post-opératoires et accompagnement psychologique du patient esthétique. Référente protocoles CypherSkin™.",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80&fit=crop"
  },
]

const TESTIMONIALS = [
  {
    name: "C. M.", age: "44 ans", protocol: "Sculpture faciale", stars: 5,
    text: "Résultat d'une naturalité absolue. Mon entourage me demande si j'ai changé de coupe. C'est exactement ce que je souhaitais. L'équipe a pris le temps de comprendre ce que je voulais vraiment, sans jamais me pousser à en faire plus."
  },
  {
    name: "S. T.", age: "38 ans", protocol: "CypherSkin™", stars: 5,
    text: "Après 3 séances de lasers et 2 CypherSkin, ma peau a une texture que je n'avais pas à 25 ans. Protocole rigoureux, équipe exceptionnelle. Le suivi photographique m'a permis de constater objectivement les progrès."
  },
  {
    name: "E. B.", age: "51 ans", protocol: "Bioregénération", stars: 5,
    text: "La qualité du suivi est remarquable. Chaque séance commence par une analyse objective. On voit les résultats se construire semaine après semaine. Je recommande Cypher Clinic les yeux fermés."
  },
  {
    name: "A. V.", age: "42 ans", protocol: "Thread Lifting", stars: 5,
    text: "J'appréhendais le thread lifting mais le Dr. Duval m'a tout expliqué en détail avant de commencer. Résultat naturel et lifting visible dès le lendemain. Cinq ans de moins sans avoir l'air 'faite'."
  },
  {
    name: "L. F.", age: "35 ans", protocol: "Cryolipolyse", stars: 5,
    text: "Deux zones traitées, résultats visibles à 8 semaines. Aucune douleur, aucune éviction sociale. L'équipe était à l'écoute et professionnelle tout au long du protocole. Je suis très satisfaite."
  },
]

// ─── Sub-pages ────────────────────────────────────────────────────────────────

function ProtocolesPage({ goTo }: { goTo: (p: ClinicPage) => void }) {
  const [active, setActive] = useState(0)
  const ActiveIcon = PROTOCOLS[active].icon
  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Catalogue complet</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Nos <em>protocoles</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Six protocoles médicaux développés et validés par notre équipe de spécialistes. Chaque approche repose sur des données cliniques publiées et un suivi objectif des résultats.
          </p>
        </Reveal>

        {/* Protocol selector */}
        <div className="grid lg:grid-cols-5 gap-0 border border-[#2A2520] mb-20">
          <div className="lg:col-span-2 border-r border-[#2A2520]">
            {PROTOCOLS.map((p, i) => {
              const Icon = p.icon
              return (
                <button key={p.id} type="button" onClick={() => setActive(i)}
                  className={`w-full text-left p-6 border-b border-[#2A2520] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${active === i ? "bg-[#1A1714]" : "hover:bg-[#141210]"}`}>
                  <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 transition-colors ${active === i ? "border-[#C9A86C] text-[#C9A86C]" : "border-[#2A2520] text-[#5A5248]"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-light transition-colors ${active === i ? "text-[#C9A86C]" : "text-[#8A8278]"}`}>{p.label}</div>
                    <div className="text-[10px] text-[#3A3028] mt-0.5">{p.price}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="w-12 h-12 border border-[#C9A86C] flex items-center justify-center flex-shrink-0">
                    <ActiveIcon className="w-6 h-6 text-[#C9A86C]" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{PROTOCOLS[active].duration}</span>
                    <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5">Reprise : {PROTOCOLS[active].recovery}</span>
                    <span className="border border-[#C9A86C]/30 text-[#C9A86C] px-3 py-1.5">{PROTOCOLS[active].price}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{PROTOCOLS[active].title}</h2>
                <p className="text-xs text-[#C9A86C] mb-5 uppercase tracking-widest">{PROTOCOLS[active].results}</p>
                <p className="text-[#6A6058] leading-relaxed mb-6">{PROTOCOLS[active].fullDesc}</p>
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A86C] mb-4">Technologies utilisées</p>
                  {PROTOCOLS[active].detail.map(d => (
                    <div key={d} className="flex items-center gap-3 text-sm py-2 border-b border-[#1A1714]">
                      <div className="w-4 h-[1px] bg-[#C9A86C]" />
                      <span className="text-[#8A8278]">{d}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => goTo("rdv")}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A86C] text-[#C9A86C] text-xs uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                  Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Protocol cards grid */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Vue d&apos;ensemble</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2520]">
          {PROTOCOLS.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <div className="bg-[#0C0C0A] p-8 flex flex-col h-full">
                  <div className="w-10 h-10 border border-[#2A2520] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="text-lg font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.label}</h3>
                  <p className="text-xs text-[#5A5248] leading-relaxed mb-5 flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between text-xs border-t border-[#1A1714] pt-4">
                    <span className="text-[#C9A86C]">{p.price}</span>
                    <span className="text-[#3A3028]">{p.duration}</span>
                  </div>
                  <button type="button" onClick={() => { setActive(i); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                    className="mt-4 text-xs text-[#8A8278] flex items-center gap-1.5 hover:text-[#C9A86C] transition-colors cursor-pointer">
                    En savoir plus <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EquipePage({ goTo }: { goTo: (p: ClinicPage) => void }) {
  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;équipe médicale</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Nos <em>spécialistes</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Trois médecins spécialistes, deux infirmières coordinatrices et une équipe administrative dédiée. Une structure pensée pour offrir une prise en charge médicale de haut niveau dans un cadre confidentiel.
          </p>
        </Reveal>

        {/* Médecins */}
        <div className="space-y-px bg-[#2A2520] mb-20">
          {SPECIALISTS.map((spec, i) => (
            <Reveal key={spec.name} delay={i * 0.08}>
              <div className={`bg-[#0C0C0A] grid md:grid-cols-5 gap-0 ${i % 2 === 1 ? "" : ""}`}>
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                  <Image src={spec.image} alt={spec.name} fill loading="lazy"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left scale-x-0 hover:scale-x-100 transition-transform duration-700" />
                </div>
                <div className="md:col-span-3 p-10 md:p-14 flex flex-col justify-center">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A86C] mb-3">{spec.spec}</p>
                  <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{spec.name}</h2>
                  <p className="text-[#8A8278] text-xs mb-2">{spec.shortBio}</p>
                  <p className="text-[#5A5248] text-sm leading-relaxed mb-6">{spec.fullBio}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {spec.certifications.map(c => (
                      <span key={c} className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#C9A86C]" />{c}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-[#C9A86C] flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    {spec.experience}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Infirmières coordinatrices */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Équipe soignante</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Infirmières <em>coordinatrices</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-[#2A2520] mb-20">
          {NURSES.map((n, i) => (
            <Reveal key={n.name} delay={i * 0.08}>
              <div className="bg-[#0C0C0A] flex gap-6 p-8">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={n.image} alt={n.name} fill loading="lazy" className="object-cover grayscale" />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{n.name}</h3>
                  <p className="text-[#C9A86C] text-xs uppercase tracking-wider mb-3">{n.role}</p>
                  <p className="text-[#5A5248] text-sm leading-relaxed">{n.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Certifications */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Accréditations & certifications</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-[#2A2520] mb-14">
          {[
            { label: "Qualiopi", desc: "Certification qualité des actions de formation — Ministère du Travail" },
            { label: "COFRAC", desc: "Comité Français d'Accréditation — laboratoire d'analyses cliniques" },
            { label: "AMEC", desc: "Association de Médecine Esthétique Certifiée — membres actifs" },
          ].map((cert, i) => (
            <Reveal key={cert.label} delay={i * 0.07}>
              <div className="bg-[#0C0C0A] p-8 text-center">
                <Award className="w-8 h-8 text-[#C9A86C] mx-auto mb-4" />
                <h3 className="text-lg font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{cert.label}</h3>
                <p className="text-xs text-[#5A5248] leading-relaxed">{cert.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center">
            <button type="button" onClick={() => goTo("rdv")}
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
              Prendre rendez-vous <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function RdvPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Prise en charge</p>
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Demande de <em>rendez-vous</em>
          </h1>
          <p className="text-[#6A6058] leading-relaxed mb-12">
            La consultation initiale (45 min) est gratuite et sans engagement. Notre coordinatrice vous contacte sous 24h ouvrées pour confirmer votre créneau.
          </p>
        </Reveal>

        {submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-[#C9A86C] p-12 text-center">
            <CheckCircle className="w-12 h-12 text-[#C9A86C] mx-auto mb-6" />
            <h2 className="text-2xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Demande reçue</h2>
            <p className="text-[#8A8278] leading-relaxed">
              Votre demande de rendez-vous est reçue. Notre coordinatrice vous contacte sous 24h ouvrées pour confirmer votre créneau.
            </p>
          </motion.div>
        ) : (
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom / Prénom */}
              <div className="grid grid-cols-2 gap-4">
                {["Prénom *", "Nom *"].map(f => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-widest uppercase text-[#3A3028] mb-2">{f}</label>
                    <input required className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f.replace(" *", "")} />
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Email *</label>
                  <input required type="email" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="votre@email.fr" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Téléphone *</label>
                  <input required type="tel" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="+33 6..." />
                </div>
              </div>

              {/* Âge */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Âge * (18 ans minimum)</label>
                <input required type="number" min="18" max="99" className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder="Votre âge" />
              </div>

              {/* Protocole */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Traitement souhaité</label>
                <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                  <option value="">Consultation initiale — bilan complet (conseillé)</option>
                  {PROTOCOLS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.price}</option>)}
                </select>
              </div>

              {/* Médecin */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Préférence médecin</label>
                <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                  <option value="">Sans préférence</option>
                  {SPECIALISTS.map(s => <option key={s.name} value={s.name}>{s.name} — {s.spec}</option>)}
                </select>
              </div>

              {/* Type consultation */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-3">Type de consultation</label>
                <div className="grid grid-cols-2 gap-3">
                  {[["Première consultation (gratuite)", "premiere"], ["Consultation de suivi", "suivi"]].map(([label, val]) => (
                    <label key={val} className="flex items-center gap-3 border border-[#2A2520] p-4 cursor-pointer hover:border-[#C9A86C] transition-colors has-[:checked]:border-[#C9A86C] has-[:checked]:bg-[#1A1714]">
                      <input type="radio" name="consultation-type" value={val} className="accent-[#C9A86C]" defaultChecked={val === "premiere"} />
                      <span className="text-xs text-[#8A8278]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Date souhaitée</label>
                  <input type="date" className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Créneau préféré</label>
                  <select className="w-full bg-[#141210] border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors">
                    <option>Matin (9h – 12h)</option>
                    <option>Après-midi (14h – 17h)</option>
                    <option>Fin de journée (17h – 19h)</option>
                  </select>
                </div>
              </div>

              {/* Antécédents */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Antécédents médicaux & allergies</label>
                <textarea rows={4} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Merci de mentionner toute allergie connue, traitement en cours ou antécédent médical pertinent..." />
              </div>

              <p className="text-[10px] text-[#3A3028] leading-relaxed">
                Les informations recueillies sont destinées à Cypher Clinic afin de traiter votre demande de rendez-vous. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès et de suppression — contact@aevia.io.
              </p>

              <button type="submit" className="w-full border border-[#C9A86C] text-[#C9A86C] py-4 text-xs tracking-widests uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                Envoyer ma demande
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </div>
  )
}

function ResultatsPage({ goTo }: { goTo: (p: ClinicPage) => void }) {
  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nos résultats</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Excellence <em>mesurée</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Chez Cypher Clinic, chaque résultat est documenté, photographié et mesuré objectivement. Nos statistiques sont issues du suivi de 2 400 patients sur 12 ans.
          </p>
        </Reveal>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-px bg-[#2A2520] mb-20">
          {[
            ["98%", "Satisfaction", "Mesurée sur 2 400+ patients"],
            ["2 400+", "Patients", "Suivis depuis 2012"],
            ["12 ans", "Expertise", "D'excellence médicale"],
            ["6", "Technologies", "Protocoles propriétaires"],
          ].map(([val, label, sub], i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="bg-[#0C0C0A] p-10 text-center">
                <div className="text-4xl font-light text-[#C9A86C] mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{val}</div>
                <div className="text-sm text-[#8A8278] mb-1">{label}</div>
                <div className="text-[10px] text-[#3A3028] uppercase tracking-widest">{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Clinic environment photos */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;environnement de soin</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Un cadre <em>médical d&apos;exception</em>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#2A2520] mb-20">
          {[
            { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&fit=crop", alt: "Salle de traitement" },
            { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&fit=crop", alt: "Équipement médical" },
            { src: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800&q=80&fit=crop", alt: "Consultation" },
            { src: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&fit=crop", alt: "Technologie laser" },
            { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&fit=crop", alt: "Espace d'accueil" },
            { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&fit=crop", alt: "Salle de repos" },
          ].map((img, i) => (
            <Reveal key={img.src} delay={i * 0.05}>
              <div className="relative aspect-[4/3] overflow-hidden group">
                <Image src={img.src} alt={img.alt} fill loading="lazy" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#0C0C0A]/20 group-hover:bg-transparent transition-all duration-500" />
                <div className="absolute bottom-3 left-3 text-xs text-[#F0EBE0]/60 group-hover:text-[#F0EBE0] transition-colors duration-300">{img.alt}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Testimonials */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Paroles de patients</p>
          <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Des résultats qui <em>parlent</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2520] mb-20">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="bg-[#0C0C0A] p-8 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#C9A86C] text-[#C9A86C]" />
                  ))}
                </div>
                <p className="text-[#6A6058] leading-relaxed mb-6 italic flex-1" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "15px" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-[#1A1714] pt-4">
                  <div className="text-sm text-[#C9A86C]">{t.name} · {t.age}</div>
                  <div className="text-[10px] text-[#3A3028] mt-0.5 uppercase tracking-wide">{t.protocol}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Presse */}
        <Reveal>
          <div className="border border-[#2A2520] p-10 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-6">Presse & médias</p>
            <p className="text-2xl font-light text-[#8A8278] mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              Vu dans <em>Elle</em>, <em>Marie Claire</em>, <em>Le Figaro Madame</em>
            </p>
            <p className="text-xs text-[#3A3028] max-w-md mx-auto leading-relaxed">
              Cypher Clinic est régulièrement cité dans la presse spécialisée et les magazines féminins de référence pour son approche scientifique de la médecine esthétique.
            </p>
          </div>
        </Reveal>

        <div className="text-center mt-14">
          <button type="button" onClick={() => goTo("rdv")}
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
            Prendre rendez-vous <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ContactPage({ goTo }: { goTo: (p: ClinicPage) => void }) {
  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nous contacter</p>
              <h1 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                Commencez votre<br /><em>parcours</em>
              </h1>
              <p className="text-[#6A6058] leading-relaxed mb-10">
                Toute prise en charge débute par une consultation médicale de 45 minutes. Bilan complet, diagnostic objectif, proposition de protocole personnalisé. Aucun geste sans accord éclairé. Consultation initiale gratuite et sans engagement.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 mb-10">
                {[
                  { Icon: Mail, label: "Adresse", text: "Adresse communiquée sur demande à contact@aevia.io" },
                  { Icon: Phone, label: "Téléphone", text: "+33 1 45 01 82 00" },
                  { Icon: Mail, label: "Email", text: "rdv@cypherclinic.fr" },
                  { Icon: Clock, label: "Horaires", text: "Lun – Ven : 9h – 19h · Sam : 9h – 16h" },
                ].map(({ Icon, label, text }) => (
                  <div key={label} className="flex items-start gap-4 text-sm">
                    <div className="w-8 h-8 border border-[#2A2520] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#C9A86C]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#C9A86C] uppercase tracking-wider mb-0.5">{label}</div>
                      <div className="text-[#6A6058]">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-[#2A2520] p-6">
                <Heart className="w-5 h-5 text-[#C9A86C] mb-3" />
                <p className="text-sm font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>Consultation initiale</p>
                <p className="text-xs text-[#5A5248] leading-relaxed">
                  Gratuite · 45 minutes · Sans engagement. Rencontrez votre médecin, discutez de vos objectifs et recevez un protocole personnalisé.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form className="space-y-5" onSubmit={e => { e.preventDefault() }}>
              <div className="grid grid-cols-2 gap-4">
                {["Prénom", "Nom"].map(f => (
                  <div key={f}>
                    <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">{f}</label>
                    <input className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={f} />
                  </div>
                ))}
              </div>
              {[["Email", "email", "votre@email.fr"], ["Téléphone", "tel", "+33 6..."]].map(([label, type, ph]) => (
                <div key={label}>
                  <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">{label}</label>
                  <input type={type} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" placeholder={ph} />
                </div>
              ))}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-[#3A3028] mb-2">Votre message</label>
                <textarea rows={5} className="w-full bg-transparent border border-[#2A2520] px-4 py-3 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" placeholder="Comment pouvons-nous vous aider ?" />
              </div>
              <button type="submit" className="w-full border border-[#C9A86C] text-[#C9A86C] py-4 text-xs tracking-widests uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                Envoyer
              </button>
              <p className="text-center">
                <button type="button" onClick={() => goTo("rdv")} className="text-xs text-[#C9A86C] underline cursor-pointer hover:text-[#F0EBE0] transition-colors">
                  Remplir le formulaire de rendez-vous complet →
                </button>
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

function LegalPage({ type, goTo }: { type: "mentions" | "privacy"; goTo: (p: ClinicPage) => void }) {
  return (
    <div className="min-h-screen bg-[#0C0C0A] py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Informations légales</p>
          <h1 className="text-3xl md:text-4xl font-light mb-12" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            {type === "mentions" ? "Mentions légales" : "Politique de confidentialité"}
          </h1>
        </Reveal>

        {type === "mentions" ? (
          <div className="space-y-10 text-[#6A6058] text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Éditeur du site</h2>
              <p>Ce site est édité par <strong className="text-[#C9A86C]">Aevia WS</strong>, auto-entrepreneur immatriculé au registre du commerce et des sociétés sous le numéro SIREN <strong className="text-[#C9A86C]">852 546 225</strong>.</p>
              <p className="mt-3">Email de contact : <a href="mailto:contact@aevia.io" className="text-[#C9A86C] hover:text-[#F0EBE0] transition-colors">contact@aevia.io</a></p>
              <p className="mt-1">Adresse du siège social communiquée sur demande à contact@aevia.io.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Directeur de publication</h2>
              <p>Le directeur de publication est Aevia WS.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Hébergement</h2>
              <p>Ce site est hébergé par <strong className="text-[#C9A86C]">Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Propriété intellectuelle</h2>
              <p>L'ensemble du contenu de ce site (textes, images, vidéos, graphismes) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite d'Aevia WS.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Responsabilité médicale</h2>
              <p>Les informations médicales présentes sur ce site sont fournies à titre informatif uniquement. Elles ne constituent pas un avis médical et ne remplacent pas une consultation avec un médecin qualifié. Les praticiens de Cypher Clinic sont inscrits à l'Ordre National des Médecins.</p>
              <p className="mt-3">Les résultats peuvent varier selon les individus. Toutes les procédures sont réalisées par des médecins diplômés d'État.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Règlement des litiges</h2>
              <p>En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux français seront compétents.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10 text-[#6A6058] text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Responsable du traitement</h2>
              <p>Le responsable du traitement des données personnelles est <strong className="text-[#C9A86C]">Aevia WS</strong>, SIREN 852 546 225. Contact : <a href="mailto:contact@aevia.io" className="text-[#C9A86C] hover:text-[#F0EBE0] transition-colors">contact@aevia.io</a>.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Données collectées</h2>
              <p>Dans le cadre des formulaires de prise de rendez-vous et de contact, nous collectons les données suivantes : nom, prénom, adresse email, numéro de téléphone, âge et, optionnellement, des informations médicales (antécédents, allergies) nécessaires à la préparation de votre consultation.</p>
              <p className="mt-3">Ces données sont transmises à nos praticiens dans le seul but de traiter votre demande de rendez-vous et d'assurer votre suivi médical.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Base légale du traitement</h2>
              <p>Le traitement de vos données repose sur votre consentement explicite (formulaire de contact) et sur l'exécution d'un contrat de soin médical (prise de rendez-vous). Les données de santé sont traitées conformément à l'article 9 du RGPD dans le cadre de la prise en charge médicale.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Durée de conservation</h2>
              <p>Les données de contact sont conservées 3 ans à compter du dernier contact. Les données médicales sont conservées 10 ans conformément aux obligations légales applicables aux professionnels de santé en France.</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Vos droits</h2>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
              <ul className="mt-3 space-y-2 list-none">
                {["Droit d'accès à vos données", "Droit de rectification", "Droit à l'effacement (« droit à l'oubli »)", "Droit à la limitation du traitement", "Droit à la portabilité", "Droit d'opposition"].map(d => (
                  <li key={d} className="flex items-center gap-3">
                    <div className="w-3 h-[1px] bg-[#C9A86C] flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4">Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" className="text-[#C9A86C] hover:text-[#F0EBE0] transition-colors">contact@aevia.io</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>Cookies</h2>
              <p>Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ni de traçage tiers n'est utilisé.</p>
            </div>
          </div>
        )}

        <div className="mt-12">
          <button type="button" onClick={() => goTo("home")} className="text-xs text-[#C9A86C] flex items-center gap-2 hover:text-[#F0EBE0] transition-colors cursor-pointer">
            ← Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CypherClinicPage() {
  useFonts()
  const [page, setPage] = useState<ClinicPage>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeProtocol, setActiveProtocol] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  const goTo = (p: ClinicPage) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ActiveIcon = PROTOCOLS[activeProtocol].icon

  const NAV_LINKS: { label: string; page: ClinicPage }[] = [
    { label: "Protocoles", page: "protocoles" },
    { label: "Notre Équipe", page: "equipe" },
    { label: "Rendez-vous", page: "rdv" },
    { label: "Résultats", page: "resultats" },
    { label: "Contact", page: "contact" },
  ]

  return (
    <div className="min-h-screen bg-[#0C0C0A] text-[#F0EBE0]" style={{ fontFamily: "'Inter', sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 h-[1px] bg-[#C9A86C] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* ── Nav (always visible) ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || page !== "home" ? "bg-[#0C0C0A]/95 backdrop-blur-md border-b border-[#2A2520]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button type="button" onClick={() => goTo("home")} className="flex flex-col cursor-pointer text-left">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Bodoni Moda', serif", letterSpacing: "0.12em" }}>Cypher Clinic</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A86C]">Médecine esthétique d&apos;élite</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#8A8278]">
            {NAV_LINKS.map(l => (
              <button key={l.page} type="button" onClick={() => goTo(l.page)}
                className={`hover:text-[#F0EBE0] transition-colors duration-200 cursor-pointer ${page === l.page ? "text-[#F0EBE0]" : ""}`}>
                {l.label}
              </button>
            ))}
            <button type="button" onClick={() => goTo("rdv")}
              className="ml-2 px-5 py-2.5 border border-[#C9A86C] text-[#C9A86C] text-xs tracking-widest uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
              Consultation
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
          <motion.div className="fixed inset-0 z-[200] bg-[#0C0C0A] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2520]">
              <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-xl">Cypher Clinic</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {NAV_LINKS.map((l, i) => (
                <motion.div key={l.page} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <button type="button" onClick={() => goTo(l.page)}
                    className={`text-3xl font-light hover:text-[#C9A86C] transition-colors cursor-pointer w-full text-left ${page === l.page ? "text-[#C9A86C]" : "text-[#F0EBE0]"}`}
                    style={{ fontFamily: "'Bodoni Moda', serif" }}>{l.label}</button>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: NAV_LINKS.length * 0.07 }}>
                <button type="button" onClick={() => goTo("rdv")}
                  className="mt-4 inline-flex items-center gap-2 border border-[#C9A86C] text-[#C9A86C] px-6 py-3 text-sm uppercase tracking-widest cursor-pointer hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300">
                  Consultation gratuite
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page router ── */}
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>

          {page === "home" && (
            <>
              {/* Hero */}
              <section ref={heroRef} className="relative min-h-screen overflow-hidden">
                <motion.div className="absolute inset-0" style={{ y: heroY }}>
                  <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85" alt="Cypher Clinic" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/95 via-[#0C0C0A]/70 to-[#0C0C0A]/20" />
                </motion.div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 min-h-screen flex flex-col justify-center">
                  <Reveal>
                    <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Médecine esthétique de précision · Paris 16e</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-light leading-[1.0] mb-8 max-w-3xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      La beauté<br />par la <em>science</em><br />de précision
                    </h1>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-[#8A8278] text-lg max-w-lg mb-12 leading-relaxed">
                      Cypher Clinic réunit chirurgiens plasticiens, dermatologues et médecins esthétiques autour de protocoles exclusifs développés avec des chercheurs universitaires.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5">
                      <button type="button" onClick={() => goTo("rdv")} className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] text-sm uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all cursor-pointer">
                        Consultation médicale <ArrowRight className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => goTo("protocoles")} className="inline-flex items-center gap-3 px-8 py-4 border border-[#2A2520] text-[#F0EBE0] text-sm uppercase tracking-widest hover:border-[#F0EBE0] transition-colors cursor-pointer">
                        Nos protocoles
                      </button>
                    </div>
                  </Reveal>
                  <div className="mt-20 pt-10 border-t border-[#2A2520] grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[["3 experts", "Spécialistes"], ["CypherSkin™", "Protocole exclusif"], ["98%", "Satisfaction"], ["12 ans", "D'expertise"]].map(([val, label]) => (
                      <Reveal key={label} delay={0.05}>
                        <div>
                          <div className="text-[#C9A86C] text-xl font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{val}</div>
                          <div className="text-xs text-[#5A5248] uppercase tracking-wide">{label}</div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* Protocols showcase */}
              <section className="py-28 bg-[#0C0C0A]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="mb-16">
                    <Reveal>
                      <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Expertise médicale</p>
                      <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                        Protocoles de <em>référence</em>
                      </h2>
                    </Reveal>
                  </div>
                  <div className="grid lg:grid-cols-5 gap-0 border border-[#2A2520]">
                    <div className="lg:col-span-2 border-r border-[#2A2520]">
                      {PROTOCOLS.map((p, i) => {
                        const Icon = p.icon
                        return (
                          <button key={p.id} type="button" onClick={() => setActiveProtocol(i)}
                            className={`w-full text-left p-6 border-b border-[#2A2520] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${activeProtocol === i ? "bg-[#1A1714]" : "hover:bg-[#141210]"}`}>
                            <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 transition-colors ${activeProtocol === i ? "border-[#C9A86C] text-[#C9A86C]" : "border-[#2A2520] text-[#5A5248]"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-sm font-light transition-colors ${activeProtocol === i ? "text-[#C9A86C]" : "text-[#8A8278]"}`}>{p.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="lg:col-span-3">
                      <AnimatePresence mode="wait">
                        <motion.div key={activeProtocol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                          className="p-8 md:p-12">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 border border-[#C9A86C] flex items-center justify-center">
                              <ActiveIcon className="w-6 h-6 text-[#C9A86C]" />
                            </div>
                            <div className="flex gap-3 text-xs">
                              <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{PROTOCOLS[activeProtocol].duration}</span>
                              <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5">Reprise : {PROTOCOLS[activeProtocol].recovery}</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>{PROTOCOLS[activeProtocol].title}</h3>
                          <p className="text-[#6A6058] leading-relaxed mb-8">{PROTOCOLS[activeProtocol].desc}</p>
                          <div>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A86C] mb-4">Technologies utilisées</p>
                            {PROTOCOLS[activeProtocol].detail.map(d => (
                              <div key={d} className="flex items-center gap-3 text-sm py-2 border-b border-[#1A1714]">
                                <div className="w-4 h-[1px] bg-[#C9A86C]" />
                                <span className="text-[#8A8278]">{d}</span>
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={() => goTo("rdv")} className="mt-8 inline-flex items-center gap-2 text-xs text-[#C9A86C] border-b border-[#C9A86C] pb-0.5 hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer uppercase tracking-widest">
                            Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-8 text-right">
                    <button type="button" onClick={() => goTo("protocoles")} className="text-xs text-[#C9A86C] flex items-center gap-1.5 ml-auto hover:text-[#F0EBE0] transition-colors cursor-pointer">
                      Voir tous nos protocoles <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Specialists */}
              <section className="py-28 bg-[#141210]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <Reveal>
                    <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">L&apos;équipe médicale</p>
                    <h2 className="text-4xl md:text-5xl font-light mb-14" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      Nos <em>spécialistes</em>
                    </h2>
                  </Reveal>
                  <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
                    {SPECIALISTS.map((spec, i) => (
                      <Reveal key={spec.name} delay={i * 0.1}>
                        <div className="bg-[#141210] group cursor-pointer p-0">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image src={spec.image} alt={spec.name} fill loading="lazy" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                          </div>
                          <div className="p-8">
                            <h3 className="text-xl font-light mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{spec.name}</h3>
                            <p className="text-[#C9A86C] text-xs tracking-wide uppercase mb-3">{spec.spec}</p>
                            <p className="text-xs text-[#5A5248] leading-relaxed">{spec.shortBio}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <div className="mt-8 text-right">
                    <button type="button" onClick={() => goTo("equipe")} className="text-xs text-[#C9A86C] flex items-center gap-1.5 ml-auto hover:text-[#F0EBE0] transition-colors cursor-pointer">
                      Découvrir toute l&apos;équipe <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Science section */}
              <section className="py-28 bg-[#0C0C0A]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
                    <Reveal>
                      <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Notre approche</p>
                      <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                        La médecine<br />esthétique fondée<br />sur les <em>preuves</em>
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <p className="text-[#6A6058] leading-relaxed mb-6">
                        Cypher Clinic a établi des partenariats formels avec l&apos;Institut de Biochimie de l&apos;Université Paris-Saclay et le laboratoire de dermatologie computationnelle de l&apos;INSERM.
                      </p>
                      <p className="text-[#6A6058] leading-relaxed">
                        Tous nos protocoles sont évalués selon des indicateurs objectifs : analyse 3D de la peau, mesure de l&apos;élasticité dermique, photographie standardisée à 6 mois. Nous publions nos résultats.
                      </p>
                    </Reveal>
                  </div>
                  <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
                    {[{ title: "Protocole CypherSkin™", stat: "J+7", desc: "Résultats visibles dès 7 jours" }, { title: "Acide hyaluronique", stat: "+18 mois", desc: "Durée moyenne observée en clinique" }, { title: "Satisfaction globale", stat: "98%", desc: "Sur 2 400 patients suivis 2012–2024" }].map((s, i) => (
                      <Reveal key={s.title} delay={i * 0.08}>
                        <div className="bg-[#0C0C0A] p-10 text-center">
                          <div className="text-4xl font-light text-[#C9A86C] mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.stat}</div>
                          <div className="text-xs text-[#8A8278] mb-1">{s.desc}</div>
                          <div className="text-[10px] text-[#3A3028] uppercase tracking-widest mt-3">{s.title}</div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* Testimonials preview */}
              <section className="py-24 bg-[#141210]">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                  <Reveal>
                    <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4 text-center">Retours patients</p>
                    <h2 className="text-3xl font-light text-center mb-14" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      Des résultats qui <em>parlent</em>
                    </h2>
                  </Reveal>
                  <div className="grid md:grid-cols-3 gap-px bg-[#2A2520]">
                    {TESTIMONIALS.slice(0, 3).map((t, i) => (
                      <Reveal key={t.name} delay={i * 0.08}>
                        <div className="bg-[#141210] p-8 h-full flex flex-col">
                          <div className="flex items-center gap-1 mb-4">
                            {Array.from({ length: t.stars }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-[#C9A86C] text-[#C9A86C]" />
                            ))}
                          </div>
                          <p className="text-[#6A6058] leading-relaxed mb-6 italic flex-1" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "16px" }}>
                            &ldquo;{t.text}&rdquo;
                          </p>
                          <div className="text-sm text-[#C9A86C]">{t.name} · {t.age}</div>
                          <div className="text-xs text-[#3A3028] mt-0.5">{t.protocol}</div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button type="button" onClick={() => goTo("resultats")} className="text-xs text-[#C9A86C] flex items-center gap-1.5 mx-auto hover:text-[#F0EBE0] transition-colors cursor-pointer">
                      Voir tous les témoignages <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* CTA band */}
              <section className="py-20 bg-[#0C0C0A] border-t border-b border-[#2A2520]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <Reveal>
                    <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-5">Première consultation gratuite</p>
                    <h2 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      Commencez votre <em>parcours esthétique</em>
                    </h2>
                    <p className="text-[#6A6058] mb-8 max-w-xl mx-auto">Rencontrez nos médecins, obtenez un diagnostic objectif et un protocole personnalisé — sans engagement.</p>
                    <button type="button" onClick={() => goTo("rdv")}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-[#C9A86C] text-[#0C0C0A] text-sm uppercase tracking-widest hover:bg-[#F0EBE0] transition-all duration-300 cursor-pointer font-medium">
                      Prendre rendez-vous <ArrowRight className="w-4 h-4" />
                    </button>
                  </Reveal>
                </div>
              </section>
            </>
          )}

          {page === "protocoles" && <ProtocolesPage goTo={goTo} />}
          {page === "equipe" && <EquipePage goTo={goTo} />}
          {page === "rdv" && <RdvPage />}
          {page === "resultats" && <ResultatsPage goTo={goTo} />}
          {page === "contact" && <ContactPage goTo={goTo} />}
          {page === "mentions" && <LegalPage type="mentions" goTo={goTo} />}
          {page === "privacy" && <LegalPage type="privacy" goTo={goTo} />}

        </motion.div>
      </AnimatePresence>

      {/* ── Footer (always visible) ── */}
      <footer className="bg-[#080806] border-t border-[#1A1714] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <button type="button" onClick={() => goTo("home")} className="flex flex-col cursor-pointer text-left mb-4">
                <div className="text-[#F0EBE0] text-xl font-light" style={{ fontFamily: "'Bodoni Moda', serif" }}>Cypher Clinic</div>
                <div className="text-[10px] text-[#C9A86C] tracking-widests uppercase">Médecine esthétique d&apos;élite · Paris</div>
              </button>
              <p className="text-xs text-[#3A3028] max-w-xs leading-relaxed">Praticiens inscrits à l&apos;Ordre National des Médecins. Adresse communiquée sur demande.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3 text-xs text-[#3A3028]">
              {NAV_LINKS.map(l => (
                <button key={l.page} type="button" onClick={() => goTo(l.page)} className="hover:text-[#F0EBE0] transition-colors cursor-pointer text-left">{l.label}</button>
              ))}
            </div>
            <div className="space-y-2 text-xs text-[#3A3028]">
              <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#C9A86C]" />+33 1 45 01 82 00</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#C9A86C]" />rdv@cypherclinic.fr</div>
              <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-[#C9A86C]" />Lun–Ven 9h–19h · Sam 9h–16h</div>
            </div>
          </div>
          <div className="border-t border-[#1A1714] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-[#3A3028] max-w-xl leading-relaxed text-center md:text-left">
              Les résultats peuvent varier selon les individus. Toutes les procédures sont réalisées par des médecins diplômés d&apos;État.
            </p>
            <div className="flex items-center gap-6 text-[10px] text-[#3A3028]">
              <span>© 2024 Cypher Clinic</span>
              <button type="button" onClick={() => goTo("mentions")} className="hover:text-[#F0EBE0] transition-colors cursor-pointer">Mentions légales</button>
              <button type="button" onClick={() => goTo("privacy")} className="hover:text-[#F0EBE0] transition-colors cursor-pointer">Confidentialité</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
