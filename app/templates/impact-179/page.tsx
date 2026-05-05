"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Globe,
  Users,
  Menu,
  X,
  Star,
  CheckCircle2,
  BookOpen,
  HandHeart,
  Shield,
  ArrowRight,
  ChevronRight,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Droplets,
  Sprout,
  Sun,
  Activity,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const PROGRAMS = [
  {
    id: "water",
    icon: <Droplets className="w-8 h-8" />,
    title: "Clean Water Initiative",
    location: "Sub-Saharan Africa",
    desc: "Providing sustainable, solar-powered water filtration systems to remote communities, eliminating waterborne diseases and drastically improving childhood mortality rates.",
    metrics: [
      "142 Wells Built",
      "50,000+ People Reached",
      "100% Maintenance Funded",
      "Solar-Powered Pumps",
    ],
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "education",
    icon: <BookOpen className="w-8 h-8" />,
    title: "Girls Education Fund",
    location: "South Asia",
    desc: "Breaking the cycle of poverty by building safe learning environments, providing long-term scholarships, and ensuring young women have access to STEM programs.",
    metrics: [
      "12 Schools Constructed",
      "3,500 Full Scholarships",
      "98% Graduation Rate",
      "Community-Led Teaching",
    ],
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "health",
    icon: <Activity className="w-8 h-8" />,
    title: "Mobile Health Clinics",
    location: "Southeast Asia",
    desc: "Deploying fully-equipped mobile medical units to regions without hospital access, delivering critical maternal care, vaccines, and emergency interventions.",
    metrics: [
      "40 Active Units",
      "2M+ Patients Treated",
      "Zero Maternal Deaths in 2025",
      "Local Doctor Training",
    ],
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=1200&auto=format&fit=crop",
  },
];

const IMPACT_VOICES = [
  {
    name: "Dr. Amara Osei",
    role: "Field Medical Director",
    quote:
      "We aren't just treating symptoms; we are building health infrastructure. The funding from Essential Giving translates directly into saved lives. It is measurable and profound.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "James McAllister",
    role: "Founding Donor",
    quote:
      "What drew me in was the absolute financial transparency. I know exactly where my endowment goes, and I receive quarterly audits verifying the impact on the ground.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Sarah Chen",
    role: "Volunteer Teacher",
    quote:
      "Spending six months in the newly built schools in Nepal changed my life. The dedication to sustainable, community-led growth rather than temporary charity is what makes this work.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Elena Rodriguez",
    role: "Water Systems Engineer",
    quote:
      "We design these systems to be maintained entirely by the local village. It's not about giving them technology; it's about giving them ownership and independence.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
];

const SPONSORSHIP_TIERS = [
  {
    name: "Advocate",
    price: "$50",
    period: "/month",
    desc: "Provides sustained support for our ongoing nutritional and educational field operations.",
    features: [
      "Funds 1 student's monthly meals",
      "Quarterly impact reports",
      "Digital certificate of support",
      "Tax-deductible receipt",
    ],
    highlight: false,
    cta: "Become an Advocate",
  },
  {
    name: "Champion",
    price: "$250",
    period: "/month",
    desc: "Our most impactful tier. Funds vital infrastructure and medical supply chains.",
    features: [
      "Provides clean water for 1 family",
      "Monthly detailed field updates",
      "Exclusive invitations to galas",
      "100% direct-to-field guarantee",
    ],
    highlight: true,
    cta: "Become a Champion",
  },
  {
    name: "Philanthropist",
    price: "$10k+",
    period: "/annual",
    desc: "Endow specific projects like building a new school or deploying a medical unit.",
    features: [
      "Direct project naming rights",
      "Private briefings with directors",
      "Annual guided field visits",
      "Dedicated impact manager",
    ],
    highlight: false,
    cta: "Contact Our Board",
  },
];

const FAQS = [
  {
    q: "How much of my donation actually goes to the field?",
    a: "100% of your public donation goes directly to field programs. Our administrative overhead and fundraising costs are entirely covered by a private group of founding donors (The Core Board), ensuring your gift has maximum impact.",
  },
  {
    q: "Are my contributions tax-deductible?",
    a: "Yes. Essential Giving is a registered 501(c)(3) non-profit organization in the United States. All donations are fully tax-deductible to the extent allowed by law. You will receive an automated receipt for your records.",
  },
  {
    q: "How do you measure and report on your impact?",
    a: "We use third-party auditors and rigorous data collection via our field teams. We publish quarterly transparency reports detailing exact financial expenditures and measurable outcomes (e.g., mortality rate drops, graduation rates, gallons of water purified).",
  },
  {
    q: "Can I volunteer to work on the ground?",
    a: "Absolutely. We run skilled volunteer programs for medical professionals, educators, and engineers. We also offer 2-week immersion trips for donors who wish to assist with construction and logistics. Please visit our Volunteer page for requirements.",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "down";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 40 };
      case "down":
        return { opacity: 0, y: -40 };
      case "left":
        return { opacity: 0, x: 40 };
      case "right":
        return { opacity: 0, x: -40 };
      default:
        return { opacity: 0, y: 40 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth custom easing
      }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */

export default function EssentialGivingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parallax Setup
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });
  const heroY = useTransform(smoothY, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(smoothY, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(smoothY, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="premium-theme min-h-screen bg-[#faf5f0] text-[#2a1f14] font-serif selection:bg-[#c2410c] selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          1. STICKY NAVBAR & MOBILE SHEET
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "bg-[#faf5f0]/90 backdrop-blur-xl py-4 border-b border-[#2a1f14]/10 shadow-sm"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-2xl font-black tracking-tighter uppercase font-sans"
          >
            <div className="w-10 h-10 bg-[#c2410c] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#c2410c]/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#c2410c] transition-colors">
              Essential
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a1f14]/70 font-sans">
            {["Mission", "Programs", "Impact", "Sponsorship"].map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:text-[#c2410c] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#c2410c] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button className="px-8 py-3.5 bg-[#c2410c] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2a1f14] transition-all hover:shadow-xl hover:shadow-[#c2410c]/20 transform hover:-translate-y-1 font-sans">
              Donate
            </button>
          </div>

          {/* Mobile Menu Sheet */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#2a1f14]">
                  <Menu className="w-7 h-7" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#faf5f0] border-l-0 w-full sm:w-[400px] p-10 font-sans">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 text-2xl font-black tracking-tighter mb-16 uppercase">
                    <div className="w-10 h-10 bg-[#c2410c] rounded-full flex items-center justify-center text-white">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span>Essential</span>
                  </div>

                  <div className="flex flex-col gap-8 text-3xl font-bold tracking-tight">
                    {["Mission", "Programs", "Impact", "Sponsorship"].map((link) => (
                      <Link
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:text-[#c2410c] transition-colors"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-10 border-t border-[#2a1f14]/10">
                    <button className="w-full py-5 bg-[#c2410c] text-white text-sm font-bold uppercase tracking-widest rounded-full mb-6 shadow-xl">
                      Make a Donation
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. HERO (Cinematic Parallax)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#2a1f14]"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000&auto=format&fit=crop"
            alt="Children smiling"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a1f14] via-[#2a1f14]/50 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 text-center pt-32">
          <Reveal>
            <Badge
              variant="outline"
              className="mb-8 px-5 py-2 border-white/20 bg-white/10 backdrop-blur-md text-white font-sans font-bold tracking-[0.3em] uppercase text-[10px]"
            >
              <Shield className="w-3 h-3 mr-2 inline" /> 100% Direct Impact Model
            </Badge>
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-medium leading-[0.9] tracking-tighter mb-8 text-white">
              Compassion, <br /> <span className="italic font-light text-[#c2410c]">Engineered.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/70 leading-relaxed font-light mb-12">
              We circumvent bureaucracy to deliver resources directly to the communities that need them most. Transparent, data-driven, and relentlessly focused on measurable human outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-10 py-5 bg-[#c2410c] text-white font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-[#c2410c] transition-all shadow-2xl shadow-[#c2410c]/40 flex items-center justify-center gap-2">
                Donate Now
              </button>
              <button className="px-10 py-5 bg-transparent border border-white/30 text-white font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Read the 2025 Impact Report
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          3. STATS BAR
          ========================================== */}
      <section className="py-20 bg-white border-b border-[#2a1f14]/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-[#2a1f14]/10">
            {[
              { value: 12, suffix: "M+", prefix: "$", label: "Funds Deployed" },
              { value: 450, suffix: "K", label: "Lives Improved" },
              { value: 28, label: "Countries Active" },
              { value: 100, suffix: "%", label: "Public Donation to Field" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="flex flex-col items-center">
                  <div className="text-5xl md:text-6xl font-bold text-[#c2410c] mb-3 tracking-tighter">
                    <Counter to={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#2a1f14]/40">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. PROGRAMS (Shadcn Tabs with Rich UI)
          ========================================== */}
      <section id="programs" className="py-32 bg-[#faf5f0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] mb-8">
                Our <span className="italic font-light text-[#c2410c]">Initiatives.</span>
              </h2>
              <p className="text-lg text-[#2a1f14]/60 font-light leading-relaxed">
                We focus intensely on three pillars of human development. By solving these foundational challenges, communities can break the cycle of extreme poverty.
              </p>
            </Reveal>
          </div>

          <Tabs defaultValue="water" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-white p-2 rounded-2xl shadow-sm font-sans border border-[#2a1f14]/5">
                {PROGRAMS.map((prog) => (
                  <TabsTrigger
                    key={prog.id}
                    value={prog.id}
                    className="px-8 py-4 rounded-xl data-[state=active]:bg-[#faf5f0] data-[state=active]:text-[#c2410c] font-bold text-sm transition-all uppercase tracking-widest"
                  >
                    {prog.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {PROGRAMS.map((prog) => (
              <TabsContent key={prog.id} value={prog.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <Reveal direction="left">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[#2a1f14]/20 mix-blend-multiply" />
                      <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl text-[#c2410c] shadow-xl">
                        {prog.icon}
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-4">
                          <MapPin className="w-6 h-6 text-[#c2410c]" />
                          <span className="font-sans font-bold uppercase tracking-widest text-sm">
                            Active in: {prog.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction="right">
                    <h3 className="text-4xl font-medium tracking-tight mb-6">
                      {prog.title}
                    </h3>
                    <p className="text-[#2a1f14]/60 text-lg mb-12 leading-relaxed font-light">
                      {prog.desc}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 mb-12">
                      {prog.metrics.map((metric, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#c2410c]/10 flex items-center justify-center text-[#c2410c] mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="font-sans font-bold text-sm uppercase tracking-wider text-[#2a1f14]">{metric}</span>
                        </div>
                      ))}
                    </div>

                    <button className="px-8 py-4 bg-[#c2410c] text-white font-sans font-bold uppercase tracking-widest rounded-full hover:bg-[#2a1f14] transition-colors flex items-center gap-2">
                      Fund this Project <ChevronRight className="w-4 h-4" />
                    </button>
                  </Reveal>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS (Shadcn Carousel)
          ========================================== */}
      <section id="impact" className="py-32 bg-white relative overflow-hidden border-y border-[#2a1f14]/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <Reveal>
              <Badge variant="outline" className="mb-6 border-[#c2410c] text-[#c2410c] font-sans">
                Community Voices
              </Badge>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9]">
                Verifiable <br /> <span className="italic font-light text-[#c2410c]">Change.</span>
              </h2>
            </Reveal>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {IMPACT_VOICES.map((voice, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                  <div className="p-12 bg-[#faf5f0] border border-[#2a1f14]/5 rounded-[2rem] h-full flex flex-col hover:border-[#c2410c]/30 transition-colors">
                    <QuoteIcon className="w-10 h-10 text-[#c2410c]/20 mb-8" />
                    <p className="text-lg text-[#2a1f14]/80 leading-relaxed font-light italic mb-10 flex-1">
                      "{voice.quote}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto pt-8 border-t border-[#2a1f14]/10">
                      <Avatar className="w-14 h-14 border border-[#c2410c]/20">
                        <AvatarImage src={voice.avatar} />
                        <AvatarFallback className="font-sans font-bold">{voice.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold font-sans text-sm">{voice.name}</div>
                        <div className="text-[10px] font-sans font-bold text-[#c2410c] uppercase tracking-widest mt-1">
                          {voice.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-4 mt-12 relative lg:absolute lg:top-[-80px] lg:right-12">
              <CarouselPrevious className="relative inset-auto translate-x-0 translate-y-0 bg-[#faf5f0] border-[#2a1f14]/10 hover:bg-[#c2410c] hover:text-white hover:border-[#c2410c]" />
              <CarouselNext className="relative inset-auto translate-x-0 translate-y-0 bg-[#faf5f0] border-[#2a1f14]/10 hover:bg-[#c2410c] hover:text-white hover:border-[#c2410c]" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ==========================================
          6. PRICING / SPONSORSHIP (3 Tiers with Cards)
          ========================================== */}
      <section id="sponsorship" className="py-32 bg-[#2a1f14] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] mb-8">
                Fund The <br /> <span className="italic font-light text-[#c2410c]">Future.</span>
              </h2>
              <p className="text-lg text-white/50 font-light">
                Choose a sponsorship tier. Because our board covers all operating costs, your entire contribution goes directly to the field.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center font-sans">
            {SPONSORSHIP_TIERS.map((tier, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Card className={`relative overflow-hidden transition-all duration-300 border-none ${
                  tier.highlight 
                    ? "bg-[#c2410c] text-white shadow-2xl shadow-[#c2410c]/30 scale-100 md:scale-105 z-10" 
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}>
                  {tier.highlight && (
                    <div className="absolute top-0 right-0 bg-white text-[#c2410c] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                      Highest Impact
                    </div>
                  )}
                  <CardHeader className="p-8 pb-4 text-center md:text-left">
                    <CardTitle className="text-2xl font-black mb-2">{tier.name}</CardTitle>
                    <CardDescription className={tier.highlight ? "text-white/80" : "text-white/50"}>
                      {tier.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 text-center md:text-left">
                    <div className="mb-8">
                      <span className="text-5xl font-black">{tier.price}</span>
                      <span className={`text-sm font-bold uppercase tracking-widest ml-2 ${tier.highlight ? "text-white/70" : "text-white/40"}`}>
                        {tier.period}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 justify-center md:justify-start">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.highlight ? "text-white" : "text-[#c2410c]"}`} />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <button className={`w-full py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                      tier.highlight 
                        ? "bg-white text-[#c2410c] hover:bg-[#2a1f14] hover:text-white shadow-xl" 
                        : "bg-white/10 text-white hover:bg-[#c2410c]"
                    }`}>
                      {tier.cta}
                    </button>
                  </CardFooter>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ (Shadcn Accordion)
          ========================================== */}
      <section className="py-32 bg-[#faf5f0]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter">
                Transparency & Trust
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full font-sans">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-[#2a1f14]/10">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-[#c2410c] hover:no-underline py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#2a1f14]/60 text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          8. CTA BANNER
          ========================================== */}
      <section className="py-32 relative overflow-hidden bg-white border-y border-[#2a1f14]/5">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c2410c]/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <div className="w-24 h-24 bg-[#c2410c]/10 rounded-full flex items-center justify-center mx-auto mb-10">
              <Globe className="w-10 h-10 text-[#c2410c]" />
            </div>
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter mb-8">
              Become a <br /> <span className="italic font-light text-[#c2410c]">Catalyst.</span>
            </h2>
            <p className="text-xl text-[#2a1f14]/60 font-light mb-12 max-w-2xl mx-auto">
              You have the power to fundamentally alter the trajectory of a community. Join us in building a sustainable, equitable world.
            </p>
            <button className="px-12 py-6 bg-[#c2410c] text-white font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#2a1f14] transition-all transform hover:scale-105 shadow-2xl shadow-[#c2410c]/30">
              Make Your First Donation
            </button>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          9. MEGA FOOTER
          ========================================== */}
      <footer className="bg-[#2a1f14] pt-32 pb-12 text-white/80 font-sans">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-2xl font-black tracking-tighter uppercase mb-8 text-white"
              >
                <div className="w-10 h-10 bg-[#c2410c] rounded-full flex items-center justify-center text-white">
                  <Heart className="w-5 h-5" />
                </div>
                <span>Essential</span>
              </Link>
              <p className="text-white/50 mb-8 max-w-sm leading-relaxed text-sm">
                A 501(c)(3) non-profit organization dedicated to transparent, direct-impact philanthropy in the world's most vulnerable regions.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c2410c] hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#c2410c] mb-6">Initiatives</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Clean Water", "Girls Education", "Mobile Health", "Disaster Relief", "Agriculture"].map((item) => (
                  <li key={item}><Link href="#" className="hover:text-[#c2410c] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#c2410c] mb-6">Organization</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Our Story", "Leadership Board", "Financial Audits", "Careers", "Contact"].map((item) => (
                  <li key={item}><Link href="#" className="hover:text-[#c2410c] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#c2410c] mb-6">Connect</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#c2410c]" />
                  <span>New York, NY 10012</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#c2410c]" />
                  <span>impact@essential.org</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
            <div>&copy; 2026 Essential Giving. All rights reserved. 501(c)(3) EIN: 12-3456789</div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Use</Link>
              <Link href="#" className="hover:text-white">Donor Rights</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple custom SVG icon for quotes
function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
