"use client"

import React from "react"
import { motion } from "framer-motion"
import { Mic, Rss, BarChart3, DollarSign, Zap, Globe, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { C, Reveal, GlassCard } from "../shared"

const DETAIL_FEATURES = [
  {
    id: "host",
    icon: Mic,
    title: "Upload & Host",
    tagline: "Hebergement ultra-rapide et stockage illimité",
    desc: "Publiez vos épisodes en quelques secondes grâce à notre interface intuitive de glisser-déposer. WaveForm s'occupe de la conversion audio, de la génération de métadonnées et même du design de vos jaquettes grâce à notre IA intégrée.",
    color: C.accent,
    bullets: [
      "Upload drag-and-drop rapide et fiabilisé",
      "Génération automatique d'ID3 tags et chapitres",
      "Créateur de jaquette automatisé par IA",
      "Planification intelligente des sorties d'épisodes",
    ],
  },
  {
    id: "rss",
    icon: Rss,
    title: "RSS Distribution",
    tagline: "Un seul upload, 15+ plateformes connectées",
    desc: "Ne perdez plus de temps à uploader votre podcast manuellement sur chaque plateforme. WaveForm distribue automatiquement vos nouveaux épisodes à Spotify, Apple Podcasts, Amazon Music, Google Podcasts et plus, instantanément.",
    color: C.green,
    bullets: [
      "Flux RSS valide à 100% conforme aux standards Apple/Spotify",
      "Soumission en un clic aux répertoires mondiaux",
      "Redirection 301 automatique en cas de migration",
      "Support des tags Apple Podcasts avancés (saisons, bandes-annonces)",
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics Dashboard",
    tagline: "Prenez des décisions basées sur de vraies données",
    desc: "Visualisez les performances de votre émission en temps réel. Découvrez d'où viennent vos auditeurs, quand ils arrêtent d'écouter, quelles applications ils utilisent et comment votre audience progresse semaine après semaine.",
    color: C.blue,
    bullets: [
      "Suivi des téléchargements certifié IAB v2",
      "Graphiques de drop-off minute par minute",
      "Géolocalisation précise et classement par pays/villes",
      "Statistiques détaillées des appareils et applications d'écoute",
    ],
  },
  {
    id: "monetize",
    icon: DollarSign,
    title: "Monetization",
    tagline: "Valorisez votre travail dès le premier jour",
    desc: "Générez des revenus récurrents grâce à notre bouquet d'outils de monétisation. Activez les dons directs, proposez des abonnements premium avec épisodes exclusifs sans publicité, ou insérez des publicités dynamiques géociblées.",
    color: C.purple,
    bullets: [
      "Abonnements premium avec gestion des accès privés",
      "Insertion publicitaire dynamique (Dynamic Ad Insertion)",
      "Bouton de dons sécurisé (Stripe & PayPal)",
      "Statistiques financières et versement mensuel automatique",
    ],
  },
  {
    id: "transcription",
    icon: Zap,
    title: "Transcription IA",
    tagline: "Rendez votre podcast accessible et SEO-friendly",
    desc: "Notre moteur de reconnaissance vocale transcrit vos épisodes en quelques minutes dans plus de 15 langues. Générez automatiquement des show notes structurées, des chapitres clairs et des sous-titres prêts à être partagés sur les réseaux.",
    color: "#F59E0B",
    bullets: [
      "Transcription mot-à-mot précise à 98% en 15+ langues",
      "Créateur automatique de chapitres avec horodatage",
      "Show notes optimisées SEO prêtes à copier",
      "Export au format SRT/VTT pour vos vidéos réseaux sociaux",
    ],
  },
  {
    id: "domain",
    icon: Globe,
    title: "Custom Domain",
    tagline: "Un site web complet et professionnel pour votre podcast",
    desc: "WaveForm génère automatiquement un site web responsive et optimisé pour le référencement naturel avec votre propre nom de domaine. Personnalisez l'affichage, intégrez notre lecteur audio ultra-rapide partout et collectez des emails.",
    color: "#EC4899",
    bullets: [
      "Site web généré automatiquement avec certificat SSL gratuit",
      "Nom de domaine personnalisé (.com, .fr, .audio, etc.)",
      "Formulaire d'inscription newsletter intégré",
      "Player audio universel personnalisable en couleur",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      {/* Intro */}
      <Reveal>
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
            Features Details
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Des outils pros pour booster<br />
            <span style={{ color: C.accent }}>votre audience</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Découvrez en détail l'ensemble des fonctionnalités incluses dans la plateforme
            WaveForm pour propulser votre podcast au niveau supérieur.
          </p>
        </div>
      </Reveal>

      {/* Grid detailed features */}
      <div className="flex flex-col gap-24">
        {DETAIL_FEATURES.map((feature, idx) => {
          const IconComp = feature.icon
          const isEven = idx % 2 === 0
          return (
            <Reveal key={feature.id} y={40} delay={0.05}>
              <div
                id={feature.id}
                className={`grid lg:grid-cols-12 gap-12 items-center border-b border-white/5 pb-16 scroll-mt-24`}
              >
                {/* Visual / Bullet list */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-last" : ""}`}>
                  <GlassCard className="p-8 border-[#F97316]/20 relative overflow-hidden bg-white/[0.02]">
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-[40px] pointer-events-none"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: feature.color + "20" }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6">Inclus dans l'outil :</h3>
                    <ul className="flex flex-col gap-4">
                      {feature.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8]">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: feature.color + "25" }}
                          >
                            <Check className="w-3 h-3" style={{ color: feature.color }} />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>

                {/* Text explanation */}
                <div className="lg:col-span-7">
                  <span
                    className="text-xs font-bold uppercase tracking-wider block mb-2"
                    style={{ color: feature.color }}
                  >
                    {feature.tagline}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                    {feature.title}
                  </h2>
                  <p className="text-[#94A3B8] leading-relaxed mb-8 text-base md:text-lg">
                    {feature.desc}
                  </p>
                  <Link href="/templates/impact-34/pricing">
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: C.accent }}
                    >
                      Essayer gratuitement <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* CTA Box */}
      <Reveal y={30}>
        <div className="mt-24 p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden bg-white/[0.02] text-center">
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-10 blur-[80px]"
            style={{ backgroundColor: C.accent }}
          />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Prêt à lancer votre émission ?
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto mb-8 text-sm md:text-base">
            Profitez de 14 jours d'essai gratuit sur la formule Creator. Aucune carte de crédit requise.
          </p>
          <Link href="/templates/impact-34/pricing">
            <button
              className="px-8 py-4 rounded-xl text-white text-base font-bold transition-all hover:opacity-90 shadow-lg shadow-orange-500/20"
              style={{ backgroundColor: C.accent }}
            >
              Créer mon compte gratuit
            </button>
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
