"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, HelpCircle, Landmark } from "lucide-react"
import { Reveal } from "../shared"

export default function InvestisseursPage() {
  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-dvh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section 1: Introduction & Rating */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-16 items-center mb-28">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Espace Institutionnel</p>
            <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#1A1612] leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Valoriser votre capital<br />dans l&apos;immobilier <em>d&apos;exception</em>
            </h1>
            <p className="text-[#6B5A40] text-lg mt-6 font-light leading-relaxed">
              Blueprint Developments offre aux investisseurs institutionnels, banques de gestion privée et family offices des opportunités d&apos;investissement de premier plan. Nos projets ciblent des actifs stratégiques à forte valeur ajoutée.
            </p>
            <p className="text-[#6B5A40] text-base mt-4 font-light leading-relaxed">
              Grâce à notre rigueur opérationnelle et notre notation financière de référence, nous offrons une structure de risques hautement maîtrisée.
            </p>
          </Reveal>
          
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden shadow-lg border border-[#E0D8CC] flex flex-col justify-between p-8 bg-[#1A1612] text-[#F7F5F2]">
              <div className="absolute inset-0 z-0 opacity-40">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                  alt="Financial building"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#1A1612]/90" />
              </div>
              <div className="relative z-10 flex items-center gap-3 text-[#C9A86C]">
                <Shield className="w-5 h-5" />
                <span className="text-xs tracking-wider uppercase">Solidité Financière</span>
              </div>
              <div className="relative z-10">
                <div className="text-8xl font-light text-[#C9A86C] mb-2 font-serif">Aa</div>
                <div className="text-sm uppercase tracking-widest text-[#F7F5F2] font-semibold">Notation Moody&apos;s</div>
                <p className="text-xs text-[#8A7860] mt-2 leading-relaxed">
                  Reflet d&apos;une gestion rigoureuse, d&apos;un endettement maîtrisé et d&apos;une forte résilience de notre modèle économique face aux cycles de marché.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Section 2: Yield Ratios & Key Indicators */}
        <div className="mb-28">
          <Reveal>
            <h2 className="text-3xl font-normal font-serif text-[#1A1612] mb-12" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Indicateurs <em>clés & Ratios</em> de rendement
            </h2>
          </Reveal>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Rendement net ciblé",
                val: "6,2% - 8,5%",
                desc: "Rendement net annuel moyen distribué à nos partenaires de co-investissement."
              },
              {
                title: "Ticket d'entrée min.",
                val: "200 000 €",
                desc: "Seuil d&apos;accès minimal requis pour participer à nos opérations de co-promotion."
              },
              {
                title: "Horizon de placement",
                val: "24 - 60 mois",
                desc: "Durée moyenne de blocage des fonds selon le cycle de vie du programme immobilier."
              },
              {
                title: "Taux de sinistralité",
                val: "0,0%",
                desc: "Aucun défaut de remboursement de capital ou d&apos;intérêts depuis notre fondation."
              }
            ].map((metric, i) => (
              <Reveal key={metric.title} delay={i * 0.08}>
                <div className="bg-white border border-[#E0D8CC] p-8 h-full flex flex-col justify-between hover:border-[#C9A86C] transition-colors duration-300">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#8A7860] mb-4 font-semibold">{metric.title}</h3>
                    <div className="text-3xl font-serif text-[#1A1612] font-light mb-4">{metric.val}</div>
                  </div>
                  <p className="text-xs text-[#6B5A40] leading-relaxed font-light mt-auto">{metric.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Section 3: Club Deals & Investment Structures */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch mb-24">
          <Reveal>
            <div className="bg-white border border-[#E0D8CC] p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[#C9A86C] mb-6">
                  <Landmark className="w-5 h-5" />
                  <span className="text-xs tracking-wider uppercase font-semibold">Club Deals Privés</span>
                </div>
                <h3 className="text-2xl font-normal font-serif text-[#1A1612] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Co-promotion exclusive
                </h3>
                <p className="text-[#6B5A40] text-sm leading-relaxed mb-6 font-light">
                  Nos Club Deals permettent à un nombre restreint d&apos;investisseurs de s&apos;associer directement à un projet de promotion immobilière dès sa phase d&apos;acquisition foncière. Cette structure optimise le couple rendement/risque en éliminant les intermédiaires de gestion classiques.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Accès direct au sous-jacent immobilier",
                    "Rapports trimestriels détaillés",
                    "Comité consultatif d'investisseurs",
                    "Priorité de souscription sur les tranches futures"
                  ].map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#6B5A40] font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/templates/impact-82/contact" className="inline-flex items-center gap-2 text-sm text-[#C9A86C] hover:gap-4 transition-all font-medium">
                Demander un dossier de présentation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          
          <Reveal delay={0.15}>
            <div className="bg-[#1A1612] text-[#F7F5F2] border border-[#3A3020] p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[#C9A86C] mb-6">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs tracking-wider uppercase font-semibold">Véhicules Institutionnels</span>
                </div>
                <h3 className="text-2xl font-normal font-serif text-white mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  SCPI, Foncières & OPCI
                </h3>
                <p className="text-[#8A7860] text-sm leading-relaxed mb-6 font-light">
                  Nous concevons des partenariats sous forme de mandats dédiés ou de prises de participations au sein de nos filiales foncières. Ces structures permettent une gestion d&apos;actifs déléguée et une liquidité accrue pour les institutionnels de premier plan.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Structuration sur-mesure",
                    "Gouvernance institutionnelle conforme AMF",
                    "Optimisation fiscale transfrontalière",
                    "Reporting ESG & Audit indépendant annuel"
                  ].map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#8A7860] font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/templates/impact-82/contact" className="inline-flex items-center gap-2 text-sm text-[#C9A86C] hover:gap-4 transition-all font-medium">
                Contacter notre conseil institutionnel <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
