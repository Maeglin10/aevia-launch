"use client"

import { useState } from "react"
import { Reveal } from "../shared"

export default function ServicesPage() {
  const [calcType, setCalcType] = useState<string>("Residential")
  const [calcArea, setCalcArea] = useState<number>(5000)

  // Calculate project estimates
  const getTimelineEstimates = (type: string, area: number) => {
    let baseMonths = 12
    let baseCost = 2500 // per sqm
    if (type === "Commercial") {
      baseMonths = 18
      baseCost = 3000
    } else if (type === "Cultural") {
      baseMonths = 24
      baseCost = 4200
    } else if (type === "Mixed Use") {
      baseMonths = 20
      baseCost = 2800
    }

    const areaFactor = Math.max(0.5, Math.min(2.5, area / 5000))
    const designMonths = Math.round(6 * areaFactor)
    const constructionMonths = Math.round(baseMonths * areaFactor)
    const totalEstCost = Math.round((area * baseCost) / 1000000) // Millions

    return {
      design: designMonths,
      construction: constructionMonths,
      cost: totalEstCost,
      concreteVolume: Math.round(area * 0.45),
    }
  }

  const est = getTimelineEstimates(calcType, calcArea)

  return (
    <div className="pt-32 min-h-dvh px-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-black pb-8 mb-12">
        <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Our Capabilities</div>
        <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          SERVICES & METHODOLOGY
        </h1>
      </div>

      {/* Detailed Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          {
            num: "01",
            title: "ARCHITECTURAL DESIGN",
            scope: ["Concept Modeling", "Material Sourcing", "Construction Drawings", "Permit Strategy"],
            body: "End-to-end design from sketch to concrete pouring. We operate with structural honesty as our primary directive, refusing visual compromises."
          },
          {
            num: "02",
            title: "URBAN MASTERPLANNING",
            scope: ["District Development", "Campus Masterplans", "Circulation Infrastructure", "Public Commons"],
            body: "Large-scale layout strategies for public institutions and campuses. We design masterplans that anchor architectural clusters with logical brutalist layouts."
          },
          {
            num: "03",
            title: "INTERIOR ARCHITECTURE",
            scope: ["Bespoke Casting", "Ribbed Slabs", "Steel Details", "Exposed Conduits"],
            body: "We leave steel, concrete, and conduits exposed, making interior systems an integral part of the aesthetic rather than hiding them behind plaster."
          },
          {
            num: "04",
            title: "HERITAGE REHABILITATION",
            scope: ["Reinforced Structures", "Industrial Preservation", "Adaptive Reuse", "Masonry Stabilization"],
            body: "Retrofitting historic industrial relics with modern brutalist interventions, maintaining original material values while upgrading structural safety."
          },
          {
            num: "05",
            title: "COMPETITION STRATEGY",
            scope: ["Massing Prototypes", "Structural Studies", "Feasibility Audits", "Render Layouts"],
            body: "We collaborate with developers and public committees on international tenders, creating robust, cost-effective design solutions."
          }
        ].map((s) => (
          <div key={s.num} className="border-4 border-black p-8 bg-white flex flex-col justify-between">
            <div>
              <div className="font-black text-6xl text-gray-200 mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.num}</div>
              <h3 className="font-black text-2xl uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{s.body}</p>
            </div>
            <div className="border-t-2 border-black pt-4">
              <h4 className="font-bold text-xs uppercase tracking-widest mb-2">Scope of Work:</h4>
              <ul className="space-y-1.5">
                {s.scope.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <span className="w-1.5 h-1.5 bg-black" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive estimator tool */}
      <div className="border-4 border-black p-8 md:p-12 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/50 mb-2 block">Phase Simulator</span>
            <h2 className="font-black text-4xl md:text-5xl uppercase leading-none mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              ESTIMATE DESIGN TIMELINE
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Select your topology and specify your target usable area (sqm) to simulate our design phases, concrete volume, and structural planning metrics.
            </p>

            <div className="space-y-6">
              {/* Select Project Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Project Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Residential", "Commercial", "Cultural", "Mixed Use"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCalcType(type)}
                      className={`py-3 border-2 font-bold uppercase tracking-wider text-xs transition-colors ${
                        calcType === type ? "bg-white text-black border-white" : "bg-transparent text-white border-white/30 hover:border-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Input (sqm) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Target Usable Area ({calcArea.toLocaleString()} sqm)</label>
                <input 
                  type="range" 
                  min={1000} 
                  max={50000} 
                  step={500} 
                  value={calcArea}
                  onChange={(e) => setCalcArea(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 appearance-none cursor-pointer accent-white" 
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
                  <span>1,000 SQM</span>
                  <span>50,000 SQM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculations breakdown */}
          <div className="bg-white text-black p-8 border-4 border-white flex flex-col justify-between">
            <div>
              <h3 className="font-black text-2xl uppercase border-b-2 border-black pb-4 mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                SIMULATED PHASES
              </h3>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">SCHEMATIC DESIGN PHASE:</span>
                  <span className="font-bold">{est.design} MONTHS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CONSTRUCTION TIMELINE:</span>
                  <span className="font-bold">{est.construction} MONTHS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">EST. CONCRETE VOLUME:</span>
                  <span className="font-bold">{est.concreteVolume.toLocaleString()} M³</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-4 text-base">
                  <span className="text-black font-bold">TOTAL EST. COST:</span>
                  <span className="font-black text-xl">€{est.cost}M — €{Math.round(est.cost * 1.25)}M</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t-2 border-black pt-4 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              *Estimates are calculated based on raw structural concrete finishes. Actual project metrics will vary.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
