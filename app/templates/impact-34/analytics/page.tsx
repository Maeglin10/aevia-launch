"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Globe, Users, Headphones, Play, Calendar } from "lucide-react"
import { C, TOP_EPISODES, WEEKLY_DATA, Reveal, GlassCard, WeeklyChart } from "../shared"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  const mockStats = {
    "7d": { listeners: "51,400", change: "+24.8%", listens: "140,500" },
    "30d": { listeners: "210,800", change: "+18.2%", listens: "590,000" },
    "90d": { listeners: "640,000", change: "+32.5%", listens: "1,840,000" },
  }[timeRange] || { listeners: "51,400", change: "+24.8%", listens: "140,500" }

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      {/* Intro */}
      <Reveal>
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
            Analytics Studio
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Décryptez votre audience<br />
            <span style={{ color: C.accent }}>en temps réel</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Accédez à des rapports certifiés et précis pour comprendre le comportement de vos auditeurs et optimiser vos contenus.
          </p>
        </div>
      </Reveal>

      {/* Control panel */}
      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#F97316]" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Dashboard Actif</span>
          </div>

          <div className="flex gap-2">
            {[
              { id: "7d", label: "7 derniers jours" },
              { id: "30d", label: "30 derniers jours" },
              { id: "90d", label: "3 mois" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTimeRange(btn.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border outline-none ${
                  timeRange === btn.id
                    ? "bg-[#F97316] border-[#F97316] text-white"
                    : "bg-white/[0.02] border-white/5 text-[#64748B] hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Main dashboard view */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Analytics main chart card */}
        <Reveal className="lg:col-span-2" delay={0.1}>
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Nombre d'auditeurs uniques</p>
                  <p className="text-3xl font-black text-white">{mockStats.listeners}</p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${C.green}15` }}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#10B981]">{mockStats.change}</span>
                </div>
              </div>

              {/* Chart */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between">
                  {WEEKLY_DATA.map((d) => (
                    <span key={d.day} className="text-[10px] text-[#475569]">{d.day}</span>
                  ))}
                </div>
                <WeeklyChart />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between text-xs text-[#64748B]">
              <span>Mise à jour il y a 2 minutes</span>
              <span>Source : WaveForm Real-time Engine</span>
            </div>
          </GlassCard>
        </Reveal>

        {/* Side statistics */}
        <div className="flex flex-col gap-6">
          <Reveal delay={0.15}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Téléchargements totaux</p>
                  <p className="text-2xl font-black text-white">{mockStats.listens}</p>
                </div>
              </div>
              <p className="text-xs text-[#475569]">
                Total cumulé d'écoutes de tous vos épisodes actifs.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.2}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Nouveaux Abonnés</p>
                  <p className="text-2xl font-black text-white">+1,240</p>
                </div>
              </div>
              <p className="text-xs text-[#475569]">
                Croissance nette sur les plateformes connectées (flux RSS).
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.25}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Pays touchés</p>
                  <p className="text-2xl font-black text-white">42</p>
                </div>
              </div>
              <p className="text-xs text-[#475569]">
                Votre contenu s'exporte à l'international.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Episodes table */}
        <Reveal delay={0.3}>
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-[#F97316]" /> Épisodes les plus écoutés
            </h3>
            <div className="flex flex-col gap-3">
              {TOP_EPISODES.map((ep) => (
                <div
                  key={ep.rank}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <span className="text-sm font-black text-[#F97316] w-6 text-center">
                    #{ep.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{ep.title}</p>
                    <p className="text-[10px] text-[#64748B]">{ep.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{ep.listens}</p>
                    <p className="text-[10px] text-[#10B981]">{ep.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        {/* Geographic Breakdown & Devices */}
        <Reveal delay={0.35}>
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#F97316]" /> Répartition Géographique
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { region: "France", pct: 62, color: C.accent },
                { region: "Canada", pct: 15, color: C.purple },
                { region: "Belgique", pct: 12, color: C.blue },
                { region: "Suisse", pct: 11, color: C.green },
              ].map((region) => (
                <div key={region.region} className="flex items-center gap-3">
                  <span className="text-xs text-[#94A3B8] w-20">{region.region}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${region.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#F8FAFC] w-8 text-right">{region.pct}%</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/5 pt-6">
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">
                Top plateformes d'écoute
              </h4>
              <div className="flex gap-4 justify-between text-xs text-[#94A3B8]">
                <span>🎧 Spotify (48%)</span>
                <span> Apple Podcasts (35%)</span>
                <span>☁️ Deezer (9%)</span>
                <span>Autres (8%)</span>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  )
}
