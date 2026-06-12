"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

export default function SkillsPage() {
  const [termInput, setTermInput] = useState("")
  const [termLogs, setTermLogs] = useState<{ type: "input" | "output", text: string }[]>([
    { type: "output", text: "glitch.dev Shell v1.0.0" },
    { type: "output", text: "Type 'help' to view available commands." },
  ])

  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termInput.trim()) return

    const input = termInput.trim().toLowerCase()
    const newLogs = [...termLogs, { type: "input" as const, text: `$ ${termInput}` }]

    let response: string[] = []

    switch (input) {
      case "help":
        response = [
          "Available commands:",
          "  info         - Display personal credentials",
          "  skills       - List core technical stack",
          "  experience   - Output career highlights",
          "  neofetch     - Display ASCII logo & system stats",
          "  clear        - Reset terminal window"
        ]
        break
      case "info":
        response = [
          "Credentials:",
          "  NAME: Raphaël Genet",
          "  ROLE: Staff Engineer & Open Source Advocate",
          "  LOC:  Paris, France",
          "  AVAIL: Q3 2026 contracts"
        ]
        break
      case "skills":
        response = [
          "Technical Capabilities:",
          "  LANGUAGES : TypeScript, Rust, Go, Python, C++",
          "  FRONTEND  : React 19, Next.js, Framer Motion, Radix UI",
          "  BACKEND   : Axum, Node.js, Gin, tRPC, WebSockets",
          "  INFRA     : K8s, Docker, PostgreSQL, Redis, Cloudflare"
        ]
        break
      case "experience":
        response = [
          "Career History Summary:",
          "  2024 - Staff Engineer @ Stripe",
          "  2023 - Senior Frontend Developer @ Vercel",
          "  2021 - Founding Engineer @ Linear",
          "  2019 - Backend Engineer @ Algolia"
        ]
        break
      case "neofetch":
        response = [
          "   ____ _ _ _       glitch@dev-machine",
          "  / ___| (_) |_ ___ _ _    ------------------",
          " | |  _| | | __/ __| '_ \\   OS: NixOS unstable x86_64",
          " | |_| | | | |_\\__ \\ | | |  Kernel: 6.9.3-nix",
          "  \\____|_|_|\\__|___/_| |_|  Shell: zsh 5.9",
          "                            CPU: Apple M3 Max Virtualized",
          "                            Memory: 64 GB / 128 GB"
        ]
        break
      case "clear":
        setTermLogs([])
        setTermInput("")
        return
      default:
        response = [`Error: command not found: '${termInput}'. Type 'help' for options.`]
    }

    setTermLogs([...newLogs, ...response.map(text => ({ type: "output" as const, text }))])
    setTermInput("")
  }

  return (
    <div className="pt-32 min-h-screen px-6 pb-24 max-w-6xl mx-auto">
      <div className="border-b border-[#00F5D4]/10 pb-6 mb-12">
        <span className="text-xs text-[#00F5D4] font-bold block mb-1">/usr/bin/neofetch</span>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">SKILLS_RESOURCES</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Unix Terminal Shell Emulator */}
        <div className="lg:col-span-7">
          <div className="border border-[#00F5D4]/20 rounded-lg overflow-hidden bg-[#0D1323] flex flex-col h-[500px]">
            {/* Title Bar */}
            <div className="bg-[#0F1729] border-b border-[#00F5D4]/10 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-xs text-[#475569] ml-2">glitch-shell-v1.0.0</span>
              </div>
              <button 
                onClick={() => setTermLogs([{ type: "output", text: "glitch.dev Shell v1.0.0" }, { type: "output", text: "Type 'help' to view available commands." }])}
                className="text-[#475569] hover:text-[#00F5D4] text-xs flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" /> reset
              </button>
            </div>

            {/* Shell Output Logs */}
            <div className="p-4 flex-1 overflow-y-auto space-y-2 text-sm font-mono scrollbar-thin select-text">
              {termLogs.map((log, idx) => (
                <div key={idx} className={log.type === "input" ? "text-[#00F5D4]" : "text-[#94A3B8] whitespace-pre-wrap"}>
                  {log.text}
                </div>
              ))}
            </div>

            {/* Shell Form Input */}
            <form onSubmit={handleTermSubmit} className="border-t border-[#00F5D4]/10 bg-[#0A0E1A] px-4 py-3 flex items-center shrink-0">
              <span className="text-[#00F5D4] font-mono mr-2">$</span>
              <input 
                type="text" 
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="Type a command e.g. neofetch, info, skills..."
                className="bg-transparent border-none text-[#E2E8F0] font-mono text-sm focus:outline-none focus:ring-0 w-full"
              />
            </form>
          </div>
        </div>

        {/* Right: Traditional Skill Matrix & Meters */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-bold text-xl text-[#00F5D4]">// Stacks & Proficiency</h3>
          
          {[
            { title: "Languages (Rust, TypeScript, Go)", pct: 90, bar: "█████████░" },
            { title: "Frontend Frameworks (Next.js, React)", pct: 85, bar: "████████░░" },
            { title: "Distributed Systems (Axum, Gin, tRPC)", pct: 80, bar: "████████░░" },
            { title: "Infrastructure (Docker, K8s, Cloudflare)", pct: 75, bar: "███████░░░" },
          ].map((sk) => (
            <div key={sk.title} className="border border-[#00F5D4]/10 p-4 bg-[#0D1323]">
              <div className="flex justify-between text-xs font-bold text-white mb-2">
                <span>{sk.title}</span>
                <span className="text-[#00F5D4]">{sk.pct}%</span>
              </div>
              <div className="font-mono text-[#00F5D4] tracking-widest text-sm">
                {sk.bar}
              </div>
            </div>
          ))}

          <div className="border border-[#00F5D4]/10 p-6 text-xs text-[#475569] leading-relaxed">
            Our development approach prioritizes memory safety, low resource utilization, and clean API endpoints. We specialize in migratable distributed system setups.
          </div>
        </div>
      </div>
    </div>
  )
}
