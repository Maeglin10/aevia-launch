"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, CheckCircle, ChevronRight, Phone, Mail, Clock, Award, Microscope, Shield, FlaskConical, Stethoscope, Sparkles, Star } from "lucide-react"

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

const FAQ_ITEMS = [
  {
    q: "Comment prendre rendez-vous pour une consultation ?",
    a: "Vous pouvez utiliser notre formulaire de prise de rendez-vous en ligne ci-dessous, ou nous contacter par téléphone au +33 1 45 72 98 30. La première consultation de diagnostic est entièrement gratuite.",
  },
  {
    q: "Quels sont les délais pour obtenir un rendez-vous ?",
    a: "Nous faisons de notre mieux pour vous proposer un créneau sous 24 à 48 heures pour les consultations urgentes ou les suivis. Pour une première consultation, le délai moyen est d'une semaine.",
  },
  {
    q: "Les injections de toxine botulique ou d'acide hyaluronique sont-elles douloureuses ?",
    a: "Les injections sont très peu douloureuses. Nous utilisons des aiguilles et des cannules ultra-fines, et la plupart de nos produits de comblement contiennent un anesthésiant local (lidocaïne) pour un confort optimal.",
  },
  {
    q: "Quels sont les effets secondaires possibles après un traitement ?",
    a: "Des rougeurs légères, un petit gonflement ou des ecchymoses peuvent apparaître aux points d'injection. Ces effets sont tout à fait normaux et disparaissent généralement sous 24 à 72 heures.",
  },
  {
    q: "Quelle est votre politique d'annulation ?",
    a: "En cas d'empêchement, nous vous demandons de bien vouloir nous prévenir au moins 24 heures à l'avance afin de libérer le créneau pour un autre patient.",
  },
]

// ─── Sub-pages refactored to Sections ──────────────────────────────────────────

function TraitementsSection() {
  const [active, setActive] = useState(0)
  const ActiveIcon = TREATMENTS[active].icon
  return (
    <div className="bg-[#FAFAF8] py-28 border-t border-[#E8E4DE]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Catalogue complet</p>
          <h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Nos <em>traitements</em>
          </h2>
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
                <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {TREATMENTS[active].title}
                </h3>
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
                <button type="button" onClick={() => document.getElementById("rdv")?.scrollIntoView({ behavior: "smooth" })}
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
          <h3 className="text-3xl font-light mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Rigueur médicale au service de l&apos;<em>esthétique</em>
          </h3>
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
                  <h4 className="text-base font-light mb-3 group-hover:text-[#FAFAF8] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h4>
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

function EquipeSection() {
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
    <div className="bg-[#FAFAF8] py-28 border-t border-[#E8E4DE]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">L&apos;équipe</p>
          <h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Nos <em>praticiens</em>
          </h2>
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
                  <p className="text-xs text-[#8A8278]">{doc.exp}</p>
                  <blockquote className="border-l-2 border-[#3A8080] pl-4 italic text-[#6B6560] text-sm leading-relaxed mt-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px" }}>
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

function RdvSection() {
  const [submitted, setSubmitted] = useState(false)
  const [firstVisit, setFirstVisit] = useState<"premiere" | "suivi">("premiere")

  return (
    <div className="bg-[#FAFAF8] py-28 border-t border-[#E8E4DE]">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Rendez-vous</p>
          <h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Prendre <em>rendez-vous</em>
          </h2>
          <div className="flex items-center gap-2 mb-10 text-sm text-[#3A8080]">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Consultation gratuite avant tout traitement · Médecins diplômés d&apos;État</span>
          </div>
        </Reveal>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="border border-[#E8E4DE] bg-white p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#3A8080] mb-4" />
            <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Merci</h3>
            <p className="text-[#6B6560] leading-relaxed">Merci, nous vous répondrons sous 24h.</p>
          </motion.div>
        ) : (
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
            {/* Type de visite */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-3">Type de visite</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <select required className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                <option value="">Sélectionner un traitement...</option>
                <option>Consultation initiale (bilan complet)</option>
                {TREATMENTS.map(t => <option key={t.id}>{t.label} — {t.price}</option>)}
              </select>
            </div>

            {/* Date & heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Date souhaitée</label>
                <input required type="date" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Créneau préféré</label>
                <select required className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                  <option value="">Sélectionner...</option>
                  <option>Matin (9h–12h)</option>
                  <option>Après-midi (12h–17h)</option>
                  <option>Fin de journée (17h–19h)</option>
                  <option>Samedi matin</option>
                </select>
              </div>
            </div>

            {/* Identité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Prénom", "Nom"].map(f => (
                <div key={f}>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{f}</label>
                  <input required className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={f} />
                </div>
              ))}
            </div>

            {/* Âge */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Âge <span className="normal-case text-[#C47A5A]">(18 ans minimum requis)</span></label>
              <input required type="number" min={18} max={99} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="Votre âge" />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Email</label>
                <input required type="email" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="votre@email.fr" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Téléphone</label>
                <input required type="tel" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="+33 6..." />
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
        )}
      </div>
    </div>
  )
}

function TarifsSection() {
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
    <div className="bg-[#FAFAF8] py-28 border-t border-[#E8E4DE]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Honoraires</p>
          <h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Transparence <em>tarifaire</em>
          </h2>
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
          <h3 className="text-3xl font-light mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Protocoles <em>combinés</em>
          </h3>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {packs.map((pack, i) => (
            <Reveal key={pack.name} delay={i * 0.07}>
              <div className="border border-[#E8E4DE] p-6 hover:border-[#3A8080] transition-colors duration-300 group">
                <div className="text-xs text-[#C9A86C] tracking-widest uppercase mb-4">{pack.saving}</div>
                <h4 className="text-lg font-light mb-2 group-hover:text-[#3A8080] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{pack.name}</h4>
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
            <button type="button" onClick={() => document.getElementById("rdv")?.scrollIntoView({ behavior: "smooth" })}
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

function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="bg-[#FAFAF8] py-28 border-t border-[#E8E4DE]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-4">Nous contacter</p>
              <h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Prenez <em>contact</em>
              </h2>
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
                    <a href={`mailto:${fd?.email ?? "valentinmilliand@aevia.services"}`} className="text-sm text-[#181410] hover:text-[#3A8080] transition-colors">{fd?.email ?? "valentinmilliand@aevia.services"}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#3A8080]" />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-[#8A8278] mb-1">Téléphone</div>
                    <a href={`tel:${fd?.phone ?? "+33145729830"}`} className="text-sm text-[#181410] hover:text-[#3A8080] transition-colors">+33 1 45 72 98 30</a>
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
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="border border-[#E8E4DE] bg-white p-12 text-center flex flex-col items-center justify-center h-full">
                <CheckCircle className="w-8 h-8 text-[#3A8080] mb-4" />
                <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Merci</h3>
                <p className="text-[#6B6560] leading-relaxed">Merci, nous vous répondrons sous 24h.</p>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Prénom", "Nom"].map(f => (
                    <div key={f}>
                      <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{f}</label>
                      <input required className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Email</label>
                  <input required type="email" className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder="votre@email.fr" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Sujet</label>
                  <select required className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                    <option value="">Sélectionner un sujet...</option>
                    <option>Demande d&apos;information générale</option>
                    <option>Question sur un traitement</option>
                    <option>Demande de devis</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Message</label>
                  <textarea required rows={5} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors resize-none" placeholder="Votre message..." />
                </div>
                <button type="submit" className="w-full bg-[#181410] text-[#FAFAF8] py-4 text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
                  Envoyer le message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  )
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-28 bg-[#FAFAF8] border-t border-[#E8E4DE]">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4 text-center">FAQ</p>
          <h2 className="text-4xl font-light text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Questions <em>fréquentes</em>
          </h2>
        </Reveal>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border border-[#E8E4DE] bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-light text-[#181410] text-base md:text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#3A8080] flex-shrink-0 ml-4"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="p-6 pt-0 text-sm text-[#6B6560] leading-relaxed font-light border-t border-[#E8E4DE] mt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LumiereCliniquePage() {
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

  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTreatment, setActiveTreatment] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, []);

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
  }, [c]);const ActiveIcon = TREATMENTS[activeTreatment].icon

  const NAV_LINKS = [
    { label: "Traitements", id: "traitements" },
    { label: "Notre Équipe", id: "equipe" },
    { label: "Prendre RDV", id: "rdv" },
    { label: "Tarifs", id: "tarifs" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#181410]" style={{ fontFamily: "'Inter', sans-serif", overflowX: "clip" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#3A8080] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* ── Nav ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E4DE]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button type="button" onClick={() => scrollToSection("hero")} className="flex flex-col text-left cursor-pointer">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em" }}>{fd?.businessName ?? "Lumière Clinic"}</span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#3A8080]">Médecine esthétique médicale</span>
              </>
            )}
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#6B6560]">
            {NAV_LINKS.map(l => (
              <button key={l.id} type="button" onClick={() => scrollToSection(l.id)}
                className="hover:text-[#181410] transition-colors duration-200 cursor-pointer">
                {l.label}
              </button>
            ))}
            <button type="button" onClick={() => scrollToSection("rdv")}
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
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">{fd?.businessName ?? "Lumière Clinic"}</span>
              )}
              <button type="button" onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {NAV_LINKS.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <button type="button" onClick={() => scrollToSection(l.id)}
                    className="text-3xl font-light hover:text-[#3A8080] transition-colors cursor-pointer text-left"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l.label}</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <div className="pt-20">
        {/* Hero */}
        <section id="hero" ref={heroRef} className="relative min-h-[calc(100vh-80px)] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85&fit=crop" alt={fd?.businessName ?? "Lumière Clinic"} fill className="object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8]/95 via-[#FAFAF8]/70 to-[#FAFAF8]/20" />
          </motion.div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-24 min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-8">Médecine esthétique de précision</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-light leading-[1.0] mb-8 max-w-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{c?.heroHeadline ?? <>
                La beauté<br /><em>comme résultat</em><br />de la science
              </>}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#6B6560] text-lg leading-relaxed max-w-lg mb-12">{c?.heroSubline ?? fd?.tagline ?? <>
                Lumière Clinic allie rigueur médicale et approche esthétique personnalisée. Chaque protocole est co-construit avec le patient, fondé sur des preuves scientifiques et exécuté avec précision.
              </>}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-5">
                <button type="button" onClick={() => scrollToSection("rdv")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#181410] text-[#FAFAF8] text-sm uppercase tracking-widest hover:bg-[#3A8080] transition-colors cursor-pointer">
                  Consultation médicale <ArrowRight className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => scrollToSection("traitements")}
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

        {/* Traitements Section */}
        <section id="traitements">
          <TraitementsSection />
        </section>

        {/* Equipe Section */}
        <section id="equipe">
          <EquipeSection />
        </section>

        {/* RDV Section */}
        <section id="rdv">
          <RdvSection />
        </section>

        {/* Tarifs Section */}
        <section id="tarifs">
          <TarifsSection />
        </section>

        {/* FAQ Section */}
        <FaqSection />

        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#0E0A06] text-[#6B6560] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <button type="button" onClick={() => scrollToSection("hero")} className="text-left cursor-pointer">
                <div className="text-[#FAFAF8] text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fd?.businessName ?? "Lumière Clinic"}</div>
                <div className="text-[#3A8080] text-xs tracking-widest uppercase mb-4">Médecine esthétique médicale</div>
              </button>
              <p className="text-sm leading-relaxed max-w-xs mb-5">{c?.aboutText ?? <>Rigueur médicale, résultats naturels. Traitements validés cliniquement, pratiqués par des médecins diplômés d&apos;État.</>}</p>
              <p className="text-xs text-[#4A4038] leading-relaxed max-w-xs">
                Les résultats varient selon les individus. Actes réalisés par des médecins diplômés d&apos;État. Avant tout traitement, une consultation médicale préalable est obligatoire.
              </p>
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {NAV_LINKS.map(l => (
                <button key={l.id} type="button" onClick={() => scrollToSection(l.id)}
                  className="block text-sm hover:text-[#FAFAF8] mb-3 transition-colors cursor-pointer text-left">
                  {l.label}
                </button>
              ))}
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Contact</p>
              <p className="text-sm mb-2">Adresse sur demande</p>
              <a href={`mailto:${fd?.email ?? "valentinmilliand@aevia.services"}`} className="text-sm mb-2 block hover:text-[#FAFAF8] transition-colors">{fd?.email ?? "valentinmilliand@aevia.services"}</a>
              <a href={`tel:${fd?.phone ?? "+33145729830"}`} className="text-sm mb-2 block hover:text-[#FAFAF8] transition-colors">+33 1 45 72 98 30</a>
              <p className="text-sm text-[#3A8080] mt-4 text-xs">Lun–Ven 9h–18h · Sam 9h–13h</p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2A1E12] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2025 Lumière Clinic — Aevia WS · SIREN 852 546 225 · Ordre National des Médecins</span>
            <div className="flex gap-6">
              <Link href="#contact" className="hover:text-[#FAFAF8] transition-colors cursor-pointer">Mentions légales</Link>
              <Link href="#contact" className="hover:text-[#FAFAF8] transition-colors cursor-pointer">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
