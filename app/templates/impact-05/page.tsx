// @ts-nocheck
"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Menu, X, ArrowRight, Check, ChevronDown, Zap, Shield, Globe, BarChart3, Users, Star, Play, Layers, Code2, Rocket, TrendingUp, Clock, MessageSquare, Sparkles, Terminal, GitBranch, Database, Cpu, Lock, ArrowUpRight } from "lucide-react"

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const STATS = [
  { value: "14,200+", label: "Companies", sub: "across 89 countries" },
  { value: "99.99%", label: "Uptime SLA", sub: "12-month average" },
  { value: "42ms", label: "Avg Latency", sub: "global edge network" },
  { value: "4.9/5", label: "G2 Rating", sub: "from 3,400+ reviews" },
  { value: "$2.4B", label: "Data Processed", sub: "monthly transaction volume" },
  { value: "SOC 2", label: "Certified", sub: "Type II + ISO 27001" },
]

const FEATURE_TABS = [
  {
    id: "performance",
    label: "Performance",
    icon: <Zap className="w-4 h-4" />,
    headline: "Sub-millisecond response at global scale",
    desc: "NovaPlatform runs on 42 edge nodes worldwide. Every API request is routed to the nearest region automatically, eliminating cold starts and cross-continental latency. P99 response time is under 80ms — anywhere on Earth.",
    bullets: [
      "42 global edge regions — zero cold starts",
      "Automatic traffic failover under 200ms",
      "P99 API latency: 78ms worldwide",
      "Horizontal autoscaling up to 1M req/sec",
      "Real-time performance dashboards with 1-second granularity",
    ],
    metric: { value: "78ms", label: "P99 Global Latency" },
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="w-4 h-4" />,
    headline: "Enterprise-grade security, zero complexity",
    desc: "SOC 2 Type II certified and ISO 27001 compliant, NovaPlatform implements a zero-trust architecture by default. Every request is authenticated, every piece of data encrypted at rest (AES-256) and in transit (TLS 1.3). We do the hard work so you don't have to.",
    bullets: [
      "Zero-trust architecture — every request verified",
      "AES-256 encryption at rest, TLS 1.3 in transit",
      "SOC 2 Type II + ISO 27001 certified",
      "99.97% threat detection rate (Cloudflare WAF)",
      "GDPR, HIPAA, and CCPA compliant by default",
    ],
    metric: { value: "0", label: "Security Breaches in 6 Years" },
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  },
  {
    id: "developer",
    label: "Developer Experience",
    icon: <Code2 className="w-4 h-4" />,
    headline: "The API your engineering team will actually love",
    desc: "SDKs in 14 languages, auto-generated TypeScript types, interactive API explorer, and a CLI that gets out of your way. NovaPlatform is built by engineers, for engineers — with the documentation, error messages, and tooling that reflect that obsession.",
    bullets: [
      "SDKs in 14 languages with auto-completion support",
      "Interactive API playground — test without leaving the docs",
      "Git-native deployments with branch previews",
      "Webhook testing with replay and logging",
      "VS Code extension with 4.8★ rating (62K installs)",
    ],
    metric: { value: "14", label: "Official SDK Languages" },
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  },
]

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CTO, Flowmatic",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "We migrated from three separate tools to NovaPlatform over a single weekend. Our engineering velocity doubled in the first month, and the on-call burden dropped by 70%. I wish we had switched sooner.",
    metric: "2× velocity",
    metricColor: "emerald",
  },
  {
    name: "David Kim",
    role: "CEO, CloudScale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "The analytics dashboard surfaced a $2.3M revenue opportunity in our first week that we had completely missed. The AI-powered anomaly detection is not a marketing claim — it genuinely works.",
    metric: "$2.3M found",
    metricColor: "violet",
  },
  {
    name: "Elena Ruiz",
    role: "VP Engineering, DataNest",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Best developer experience I have encountered in 15 years of writing software. The API documentation is genuinely a work of art, and the TypeScript SDK is the best I have ever used — period.",
    metric: "10× DX",
    metricColor: "blue",
  },
  {
    name: "Marcus Lin",
    role: "Platform Lead, FinEdge",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    text: "We process $180M in transactions per month through NovaPlatform's payment orchestration layer. In 18 months of production, we have had zero data incidents and three nines of uptime. That's the number that matters.",
    metric: "$180M/mo",
    metricColor: "amber",
  },
  {
    name: "Amara Osei",
    role: "Head of Product, Arkive",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    text: "The branch preview environment feature alone saved us two engineering hires. Our QA cycle went from 4 days to 6 hours, and our deployment frequency tripled within the first quarter. Transformative.",
    metric: "3× deploys",
    metricColor: "pink",
  },
]

const PRICING = [
  {
    name: "Starter",
    price: "0",
    period: "/month",
    annualPrice: "0",
    desc: "For side projects, prototypes, and early-stage products.",
    features: [
      "Up to 3 projects",
      "1,000 API calls / month",
      "Community support (48h SLA)",
      "Basic analytics & logs",
      "1 team member",
    ],
    cta: "Start for free",
    popular: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "49",
    period: "/month",
    annualPrice: "39",
    desc: "For growing teams shipping serious products.",
    features: [
      "Unlimited projects",
      "500,000 API calls / month",
      "Priority support (4h SLA)",
      "Advanced analytics + AI insights",
      "Custom domains & SSO",
      "Up to 15 team members",
      "Branch preview environments",
    ],
    cta: "Start 14-day trial",
    popular: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    annualPrice: "Custom",
    desc: "For organizations that demand the best — and can justify it.",
    features: [
      "Everything in Pro",
      "Unlimited API calls",
      "24/7 dedicated support (1h SLA)",
      "SSO, SAML 2.0 & SCIM provisioning",
      "Custom SLAs & uptime guarantees",
      "On-premises deployment option",
      "Compliance packages (HIPAA, FedRAMP)",
    ],
    cta: "Talk to sales",
    popular: false,
    badge: null,
  },
]

const FAQS = [
  { q: "How does the 14-day trial work?", a: "The Pro trial gives you full access to every Pro feature with no credit card required. At the end of 14 days, you choose to subscribe or downgrade to the free Starter plan — your data and projects are preserved either way." },
  { q: "Can I migrate from my current stack without downtime?", a: "Yes. Our migration CLI tool imports from AWS, GCP, Vercel, Netlify, and Heroku. The typical migration for a mid-size application takes under 2 hours, and you can run both environments in parallel during the cut-over period." },
  { q: "What does '99.99% uptime SLA' mean in practice?", a: "It means we guarantee less than 52 minutes of unplanned downtime per year. In the event of an SLA breach, we issue automatic service credits — you don't have to file a claim. Our actual 12-month average is 99.997%." },
  { q: "Is my data portable? What happens if I leave?", a: "You own your data entirely. Export everything as JSON, CSV, or via our full REST API at any time — no notice required, no export fees. We're committed to zero vendor lock-in." },
  { q: "How does enterprise pricing work?", a: "Enterprise contracts are custom-scoped based on API volume, team size, and compliance requirements. Typical contracts start at $2,000/month. We offer multi-year deals with price locks and volume discounts." },
  { q: "Do you offer a startup programme?", a: "Yes. Qualifying seed and Series A companies receive 12 months of Pro free, followed by a 40% discount for the next 24 months. Apply through our Startup Programme page with your funding announcement." },
  { q: "What regions does NovaPlatform operate in?", a: "We operate 42 edge regions across North America, Europe, Asia-Pacific, South America, and the Middle East. Data residency is configurable per project — EU-only, US-only, or globally distributed." },
]

const LOGOS = [
  { name: "Vercel", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&q=80" },
  { name: "Stripe", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&q=80" },
  { name: "Notion", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
  { name: "Linear", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&q=80" },
  { name: "Globe", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=120&q=80" },
  { name: "GitHub", img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=120&q=80" },
]

export default function NovaPlatformSaaS() {
  const [billingAnnual, setBillingAnnual] = useState(true)
  const [demoOpen, setDemoOpen] = useState(false)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 50, damping: 20 })
  const smy = useSpring(my, { stiffness: 50, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.015)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.015)
  }

  return (
    <div style={{ overflowX: "hidden", scrollBehavior: "smooth" }} className="bg-[#09090b] text-white min-h-screen selection:bg-violet-500 font-sans">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="#hero" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">NovaPlatform</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {(["Features", "Pricing", "FAQ", "Contact"] as const).map((item, i) => {
              const ids = ["features", "pricing", "faq", "contact"];
              return <a key={item} href={`#${ids[i]}`} className="text-sm text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer">{item}</a>;
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="text-sm text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer">Log in</button>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer">
              Get Started Free
            </button>
          </div>

          <Sheet>
            <SheetTrigger className="lg:hidden cursor-pointer"><Menu className="w-5 h-5" /></SheetTrigger>
            <SheetContent side="right" className="bg-[#09090b] border-white/10 text-white">
              <div className="flex items-center gap-2 mb-10 mt-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">NovaPlatform</span>
              </div>
              <div className="flex flex-col gap-6">
                {(["Features", "Pricing", "FAQ", "Contact"] as const).map((item, i) => {
                  const ids = ["features", "pricing", "faq", "contact"];
                  return <a key={item} href={`#${ids[i]}`} className="text-xl font-semibold hover:text-violet-400 transition-all duration-200 cursor-pointer">{item}</a>;
                })}
                <Separator className="bg-white/10 my-2" />
                <button onClick={() => document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} className="px-8 py-3 bg-violet-600 rounded-full font-semibold text-center cursor-pointer">Get Started Free</button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} onMouseMove={handleMouseMove} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 z-0">
          <motion.div animate={{ x: [0, 40, 0], y: [0, -25, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-15%] left-[15%] w-[700px] h-[700px] bg-violet-600/18 rounded-full blur-[160px]" />
          <motion.div animate={{ x: [0, -35, 0], y: [0, 45, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[8%] w-[600px] h-[600px] bg-fuchsia-600/12 rounded-full blur-[160px]" />
          <motion.div animate={{ x: [0, 25, 0], y: [0, -35, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-[35%] right-[25%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity, x: smx, rotateY: smx }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8 cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">Now with AI-powered observability</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] ml-1">New</Badge>
          </motion.div>

          <div className="overflow-hidden mb-3">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.88]">
              Ship faster.
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.65 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.88]">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Scale smarter.</span>
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform that replaces your entire infrastructure toolkit. Build, deploy, and scale to millions of users without changing your workflow.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer">
              Start building for free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button onClick={() => setDemoOpen(true)} className="px-8 py-4 border border-white/10 rounded-full text-sm font-semibold hover:border-violet-500/50 transition-all duration-200 flex items-center gap-2 cursor-pointer">
              <Play className="w-4 h-4 text-violet-400" /> Watch demo (3 min)
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80"].map((src, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-[#09090b]">
                  <AvatarImage src={src} />
                  <AvatarFallback className="bg-violet-600 text-[10px]">U</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm text-zinc-500">Trusted by <span className="text-white font-semibold">14,200+</span> companies · <span className="text-amber-400 font-semibold">4.9/5</span> on G2</p>
          </motion.div>
        </motion.div>

        {/* Floating metric cards */}
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[18%] left-[4%] hidden xl:block z-10"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl w-56">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">+47% this week</span>
              </div>
              <div className="text-2xl font-bold mb-1 text-white">$124.5K</div>
              <div className="text-[10px] text-zinc-500">Revenue processed</div>
              <Progress value={78} className="mt-3 h-1 bg-white/10" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[28%] right-[4%] hidden xl:block z-10"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl w-52">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold">Deploy time</span>
              </div>
              <div className="text-2xl font-bold mb-1">0.8s</div>
              <div className="text-[10px] text-zinc-500">Average worldwide</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[55%] right-[6%] hidden 2xl:block z-10"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl w-48">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">All systems go</span>
              </div>
              <div className="text-2xl font-bold mb-1">99.99%</div>
              <div className="text-[10px] text-zinc-500">Uptime today</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-5 h-5 text-zinc-600" />
        </motion.div>
      </section>

      {/* ── LOGO BAR ── */}
      <section id="equipe" className="border-y border-white/5 py-12 px-6 bg-[#0b0b0f]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-8 font-semibold">Trusted by teams at the world's best companies</p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-5">
            {["Vercel", "Stripe", "Notion", "Linear", "Globe", "GitHub", "Supabase", "PlanetScale"].map(logo => (
              <span key={logo} className="text-lg font-bold text-zinc-700 hover:text-zinc-400 transition-all duration-200 cursor-default">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center group cursor-default">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-white/70 mb-1">{stat.label}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES WITH TABS ── */}
      <section id="features" className="py-32 md:py-40 px-6 md:px-12 bg-[#0b0b0f] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Features</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
                Everything you need.<br />
                <span className="text-zinc-500">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Built from the ground up for modern teams who refuse to compromise on speed, security, or developer experience.</p>
            </div>
          </Reveal>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent mb-12">
              {FEATURE_TABS.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 px-6 py-3 rounded-full data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400 border border-white/10 hover:border-violet-500/40 hover:text-white transition-all duration-200 cursor-pointer text-sm font-semibold">
                  {tab.icon}{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {FEATURE_TABS.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 mb-6">
                      <span className="text-violet-400">{tab.icon}</span>
                      <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">{tab.label}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-5 leading-tight">{tab.headline}</h3>
                    <p className="text-zinc-400 leading-relaxed mb-8">{tab.desc}</p>
                    <ul className="space-y-3 mb-8">
                      {tab.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />{b}
                        </li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                      <div>
                        <div className="text-2xl font-black text-violet-400">{tab.metric.value}</div>
                        <div className="text-xs text-zinc-500">{tab.metric.label}</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/5">
                    <Image src={tab.img} alt={tab.label} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 via-transparent to-transparent" />
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="realisations" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">How It Works</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Three steps to <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">liftoff</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect your stack", desc: "Integrate in minutes with 200+ native connectors. REST, GraphQL, webhooks, or our SDKs — your choice.", icon: <Layers className="w-8 h-8" />, color: "violet" },
              { step: "02", title: "Configure & automate", desc: "Drag-and-drop workflow builder for non-technical teams. Full code editor with autocomplete for engineers.", icon: <Code2 className="w-8 h-8" />, color: "fuchsia" },
              { step: "03", title: "Launch & grow", desc: "Deploy to production instantly. Our AI automatically optimizes latency, cost, and scaling as you grow.", icon: <Rocket className="w-8 h-8" />, color: "pink" },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all duration-200 h-full cursor-default">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 mb-6">
                      {step.icon}
                    </div>
                    <div className="text-violet-400/50 text-5xl font-black mb-3 leading-none">{step.step}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS CAROUSEL ── */}
      <section id="testimonials" className="py-32 md:py-40 px-6 md:px-12 bg-[#0b0b0f] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Testimonials</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Loved by <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">builders</span>
              </h2>
            </div>
          </Reveal>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-white/[0.02] border-white/5 h-full hover:bg-white/[0.04] transition-all duration-200">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                      <Separator className="bg-white/5 mb-6" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={t.avatar} alt={t.name} />
                            <AvatarFallback className="bg-violet-600 text-xs">{t.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold">{t.name}</div>
                            <div className="text-xs text-zinc-500">{t.role}</div>
                          </div>
                        </div>
                        <Badge className={`bg-${t.metricColor}-500/10 text-${t.metricColor}-400 border-${t.metricColor}-500/20 text-[10px] font-bold`}>
                          {t.metric}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-white/10 bg-transparent text-white hover:bg-violet-600 hover:border-violet-600 transition-all duration-200 cursor-pointer -left-4" />
            <CarouselNext className="border-white/10 bg-transparent text-white hover:bg-violet-600 hover:border-violet-600 transition-all duration-200 cursor-pointer -right-4" />
          </Carousel>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Pricing</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Start free, <span className="text-zinc-500">scale infinitely.</span>
              </h2>
              <div className="inline-flex items-center gap-3 mt-4 bg-white/5 rounded-full p-1 border border-white/10 cursor-pointer">
                <button onClick={() => setBillingAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${!billingAnnual ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                  Monthly
                </button>
                <button onClick={() => setBillingAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${billingAnnual ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                  Annual <span className="text-[10px] text-emerald-400 font-bold ml-1">−20%</span>
                </button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-8 border h-full flex flex-col transition-all duration-200 hover:-translate-y-1 ${plan.popular ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent shadow-lg shadow-violet-500/10" : "border-white/5 bg-white/[0.02]"}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 rounded-full text-[10px] uppercase tracking-wider font-bold font-sans">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-zinc-500 mb-6">{plan.desc}</p>
                    <div className="flex items-baseline gap-1">
                      {plan.price !== "Custom" && <span className="text-sm text-zinc-500">$</span>}
                      <span className="text-5xl font-black text-white">
                        {plan.price === "Custom" ? plan.price : billingAnnual ? plan.annualPrice : plan.price}
                      </span>
                      {plan.period && <span className="text-sm text-zinc-500 ml-1">{plan.period}</span>}
                    </div>
                    {plan.price !== "0" && plan.price !== "Custom" && billingAnnual && (
                      <p className="text-[10px] text-emerald-400 mt-1">Saves ${(Number(plan.price) - Number(plan.annualPrice)) * 12}/year</p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />{feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${plan.popular ? "bg-violet-600 hover:bg-violet-500 text-white" : "border border-white/10 hover:border-violet-500/50 text-white hover:text-white"}`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="text-center text-xs text-zinc-600 mt-8">No credit card required for Starter. All plans include a 30-day money-back guarantee.</p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 md:py-40 px-6 md:px-12 bg-[#0b0b0f] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-violet-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">FAQ</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Common <span className="text-zinc-500">Questions</span></h2>
            </div>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-0">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/5">
                <AccordionTrigger className="text-left text-white/80 hover:text-violet-400 transition-all duration-200 py-6 font-semibold cursor-pointer hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-400 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section id="contact" className="py-32 md:py-40 px-6 md:px-12">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 65%)" }} />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Ready to build the<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">future?</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
              Join 14,200+ teams shipping faster with NovaPlatform. Free forever plan — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} className="group px-10 py-4 bg-violet-600 hover:bg-violet-500 rounded-full font-bold transition-all duration-200 flex items-center gap-2 text-lg cursor-pointer">
                Get started — it&apos;s free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="px-8 py-4 text-zinc-400 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4" /> Talk to sales
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-zinc-600">
              {["No credit card required", "14-day Pro trial", "Cancel anytime", "SOC 2 certified"].map(f => (
                <div key={f} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-500" />{f}</div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-16 px-6 md:px-12 bg-[#07070a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">NovaPlatform</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-5">The all-in-one platform for modern engineering teams. Build, deploy, and scale without limits.</p>
            <div className="flex gap-3">
              {[<Globe key="tw" className="w-4 h-4" />, <Globe key="gh" className="w-4 h-4" />, <Globe key="sl" className="w-4 h-4" />, <Globe key="li" className="w-4 h-4" />].map((icon, i) => (
                <a key={i} href="#features" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:border-violet-500/40 transition-all duration-200 cursor-pointer">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Product", items: ["Features", "Pricing", "Integrations", "Changelog", "Status"] },
            { title: "Developers", items: ["Documentation", "API Reference", "SDKs", "CLI", "GitHub"] },
            { title: "Company", items: ["About", "Blog", "Careers", "Press", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.items.map(item => {
                  const href = `/templates/impact-05/${item.toLowerCase().replace(/ /g, '-')}`;
                  return (
                    <li key={item}><Link href={href} className="text-sm text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer">{item}</Link></li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="bg-white/5 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-zinc-600">&copy; 2026 NovaPlatform, Inc. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Security", "GDPR"].map(s => {
              const href = `/templates/impact-05/${s.toLowerCase()}`;
              return (
                <Link key={s} href={href} className="text-xs text-zinc-600 hover:text-white transition-all duration-200 cursor-pointer">{s}</Link>
              );
            })}
          </div>
        </div>
      </footer>

      {/* ── DEMO DIALOG ── */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="bg-[#0b0b0f] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Product Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-violet-600/40 transition-all duration-200">
                <Play className="w-7 h-7 text-violet-400 ml-1" />
              </div>
              <p className="text-zinc-500 text-sm">NovaPlatform — 3-minute overview</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 text-center">No sign-up required · Full product walkthrough</p>
        </DialogContent>
      </Dialog>

    </div>
  )
}
