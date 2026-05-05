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
  Sparkles,
  Shield,
  Clock,
  Menu,
  X,
  Star,
  CheckCircle2,
  Home,
  Droplets,
  Leaf,
  ArrowRight,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Wind,
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

const SERVICES = [
  {
    id: "deep-clean",
    icon: <Home className="w-8 h-8" />,
    title: "Deep Home Clean",
    desc: "A meticulous, top-to-bottom sanitization of every room, targeting hidden dust and allergens.",
    features: [
      "Baseboards & moldings",
      "Inside appliances",
      "Deep carpet extraction",
      "Air vent purification",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "maintenance",
    icon: <Sparkles className="w-8 h-8" />,
    title: "Regular Upkeep",
    desc: "Weekly or bi-weekly visits designed to maintain a flawless, stress-free environment.",
    features: [
      "Surface sanitization",
      "Floor polishing",
      "Bathroom descaling",
      "Trash & recycling",
    ],
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "eco-pure",
    icon: <Leaf className="w-8 h-8" />,
    title: "Eco-Pure Sanitization",
    desc: "100% natural, non-toxic cleaning protocols safe for infants, pets, and the planet.",
    features: [
      "Plant-based solvents",
      "Essential oil finishes",
      "Zero harsh chemicals",
      "Allergen reduction",
    ],
    image:
      "https://images.unsplash.com/photo-1610526978438-e67c85ffb4cd?q=80&w=1200&auto=format&fit=crop",
  },
];

const TESTIMONIALS = [
  {
    name: "Eleanor Vance",
    role: "Architect",
    quote:
      "As someone obsessed with details, Pristine surpassed my expectations. The level of care they apply to the subtle surfaces in my home is simply extraordinary.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    name: "Jonathan Harker",
    role: "Estate Manager",
    quote:
      "We entrust Pristine with maintaining our entire portfolio of luxury rentals. Their consistency, discretion, and flawless execution are unmatched in the industry.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    name: "Sofia Rossi",
    role: "Working Mother",
    quote:
      "Coming home to a perfectly organized, beautifully smelling home after a chaotic week feels like checking into a luxury hotel. Truly life-changing.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    name: "Marcus Thorne",
    role: "Gallery Director",
    quote:
      "They handle our gallery spaces with the same reverence we give our art. The eco-friendly products ensure no damage to sensitive works.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
];

const PRICING = [
  {
    name: "Essential",
    price: "$149",
    period: "/visit",
    desc: "Perfect for apartments and smaller homes needing consistent, high-quality upkeep.",
    features: [
      "Up to 2 Bedrooms",
      "1 Bathroom",
      "Kitchen & Living Areas",
      "Standard Dusting & Mopping",
      "2 Hours Duration",
    ],
    highlight: false,
    cta: "Book Essential",
  },
  {
    name: "Pristine",
    price: "$289",
    period: "/visit",
    desc: "Our most popular tier for medium to large homes requiring deep attention to detail.",
    features: [
      "Up to 4 Bedrooms",
      "3 Bathrooms",
      "Appliance Interiors",
      "Baseboard & Window Sills",
      "Premium Eco-Products",
      "4 Hours Duration",
    ],
    highlight: true,
    cta: "Book Pristine",
  },
  {
    name: "Estate",
    price: "Custom",
    period: "",
    desc: "Bespoke cleaning protocols for luxury estates, requiring specialized surface care.",
    features: [
      "Unlimited Rooms",
      "Dedicated Team of 3+",
      "Chandelier & Art Dusting",
      "Marble & Stone Polishing",
      "On-Demand Scheduling",
      "NDA Included",
    ],
    highlight: false,
    cta: "Request Consultation",
  },
];

const FAQS = [
  {
    q: "Are your cleaning products truly safe for pets and infants?",
    a: "Absolutely. We exclusively use hospital-grade, plant-based sanitizers and aromatherapeutic essential oils. Our products are rigorously vetted to ensure zero toxic residue, volatile organic compounds (VOCs), or harsh fumes.",
  },
  {
    q: "Do I need to be home during the cleaning service?",
    a: "No, many of our clients prefer to provide us with a spare key, door code, or alarm access. Our staff are fully bonded, insured, and undergo comprehensive background checks to guarantee absolute security and peace of mind.",
  },
  {
    q: "How do you handle delicate surfaces like marble or antique wood?",
    a: "Our technicians are trained in specialized surface care. We use pH-neutral cleaners for natural stone and specific nourishing oils for antique woodwork. Prior to our first visit, we catalog all delicate surfaces to ensure the correct protocol is followed.",
  },
  {
    q: "What is your cancellation or rescheduling policy?",
    a: "We ask for a minimum of 48 hours notice for any cancellations or rescheduling requests. This allows us to reallocate our teams efficiently. Cancellations made within 24 hours may be subject to a nominal fee.",
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
        duration: 1,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom spring-like easing
      }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = to / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */

export default function PristineCleaningPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parallax Setup
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(smoothY, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(smoothY, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(smoothY, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="premium-theme min-h-screen bg-[#fcfcfc] text-[#0f2419] font-sans selection:bg-[#10b981] selection:text-white overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ==========================================
          1. STICKY NAVBAR & MOBILE SHEET
          ========================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl py-4 border-b border-[#0f2419]/5 shadow-sm"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-2xl font-black tracking-tighter"
          >
            <div className="w-10 h-10 bg-[#10b981] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#10b981]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#10b981] transition-colors">
              PRISTINE
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f2419]/60">
            {["Services", "Approach", "Testimonials", "Pricing"].map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:text-[#10b981] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#10b981] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm font-medium text-[#0f2419]/70">
              <Phone className="w-4 h-4" /> 1-800-PRISTINE
            </span>
            <button className="px-8 py-3.5 bg-[#0f2419] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#10b981] transition-all hover:shadow-xl hover:shadow-[#10b981]/20 transform hover:-translate-y-1">
              Book Now
            </button>
          </div>

          {/* Mobile Menu Sheet */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#0f2419]">
                  <Menu className="w-7 h-7" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-l-0 w-full sm:w-[400px] p-10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 text-2xl font-black tracking-tighter mb-16">
                    <div className="w-10 h-10 bg-[#10b981] rounded-2xl flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span>PRISTINE</span>
                  </div>

                  <div className="flex flex-col gap-8 text-3xl font-bold tracking-tight">
                    {["Services", "Approach", "Testimonials", "Pricing"].map((link) => (
                      <Link
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:text-[#10b981] transition-colors"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-10 border-t border-[#0f2419]/10">
                    <button className="w-full py-5 bg-[#10b981] text-white text-sm font-bold uppercase tracking-widest rounded-2xl mb-6">
                      Book a Cleaning
                    </button>
                    <p className="flex items-center justify-center gap-2 text-sm font-medium text-[#0f2419]/50">
                      <Phone className="w-4 h-4" /> 1-800-PRISTINE
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. HERO (Parallax & Split Layout)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#f0faf5] pt-20"
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="pt-20 lg:pt-0">
            <Reveal>
              <Badge
                variant="outline"
                className="mb-8 px-4 py-1.5 border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 font-bold tracking-widest uppercase text-[10px]"
              >
                <Star className="w-3 h-3 mr-2 inline" /> Top Rated Service 2026
              </Badge>
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black leading-[0.85] tracking-tighter mb-8">
                The Art <br /> of <span className="text-[#10b981]">Clean.</span>
              </h1>
              <p className="max-w-md text-lg text-[#0f2419]/60 leading-relaxed font-medium mb-10">
                Experience the luxury of a flawless environment. We provide 
                meticulous, eco-friendly cleaning services tailored to the most 
                exacting standards.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-5 bg-[#0f2419] text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#10b981] transition-all shadow-xl shadow-[#0f2419]/10 flex items-center justify-center gap-2 group">
                  Get an Estimate
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-5 bg-white border border-[#0f2419]/10 text-[#0f2419] text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#f0faf5] transition-all flex items-center justify-center gap-2">
                  View Services
                </button>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#f0faf5] overflow-hidden"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?q=80&w=100&auto=format&fit=crop`}
                        alt={`Customer ${i}`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#10b981] text-[#10b981]"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-[#0f2419]/50 uppercase tracking-widest">
                    Trusted by 2,500+ Homes
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <motion.div
            style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
            className="relative h-[600px] lg:h-[800px] w-full rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
              alt="Immaculate living room"
              fill
              className="object-cover"
              priority
            />
            {/* Glassmorphism float tag */}
            <div className="absolute bottom-10 left-10 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white max-w-xs shadow-2xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Bonded & Insured</h4>
                  <p className="text-xs text-white/70">100% Satisfaction Guarantee</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          3. STATS BAR
          ========================================== */}
      <section className="py-16 bg-[#0f2419] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10">
            {[
              { value: 12, suffix: "K+", label: "Cleans Completed" },
              { value: 99, suffix: "%", label: "Client Retention" },
              { value: 50, suffix: "+", label: "Certified Staff" },
              { value: 100, suffix: "%", label: "Eco-Friendly" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="flex flex-col items-center text-center pl-0 md:pl-8 first:pl-0 border-none md:border-solid">
                  <div className="text-4xl md:text-5xl font-black text-[#10b981] mb-2">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SERVICES / FEATURES (Shadcn Tabs)
          ========================================== */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Reveal>
              <Badge variant="outline" className="mb-6 border-[#10b981] text-[#10b981]">
                Our Protocols
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                Beyond Surface <br /> <span className="text-[#0f2419]/30">Level.</span>
              </h2>
              <p className="text-lg text-[#0f2419]/50">
                We don't just clean; we restore the harmony of your space. Select a protocol to discover our meticulous methodology.
              </p>
            </Reveal>
          </div>

          <Tabs defaultValue="deep-clean" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-[#f0faf5] p-2 rounded-2xl">
                {SERVICES.map((svc) => (
                  <TabsTrigger
                    key={svc.id}
                    value={svc.id}
                    className="px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#10b981] data-[state=active]:shadow-md font-bold text-sm transition-all"
                  >
                    {svc.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {SERVICES.map((svc) => (
              <TabsContent key={svc.id} value={svc.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <Reveal direction="left">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={svc.image}
                        alt={svc.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f2419]/40 to-transparent" />
                      <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl">
                        {svc.icon}
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction="right">
                    <h3 className="text-4xl font-black tracking-tight mb-6">
                      {svc.title}
                    </h3>
                    <p className="text-[#0f2419]/60 text-lg mb-10 leading-relaxed">
                      {svc.desc}
                    </p>
                    
                    <div className="space-y-6 mb-12">
                      {svc.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="px-8 py-4 bg-[#f0faf5] text-[#10b981] font-bold uppercase tracking-widest rounded-xl hover:bg-[#10b981] hover:text-white transition-colors flex items-center gap-2">
                      Schedule Service <ChevronRight className="w-5 h-5" />
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
      <section id="testimonials" className="py-32 bg-[#0f2419] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                Spotless <br /> <span className="text-[#10b981]">Reputation.</span>
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
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                  <div className="p-10 bg-white/5 border border-white/10 rounded-3xl h-full flex flex-col hover:bg-white/10 transition-colors">
                    <div className="flex gap-1 mb-8">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#10b981] text-[#10b981]" />
                      ))}
                    </div>
                    <p className="text-lg text-white/80 leading-relaxed font-medium mb-10 flex-1">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/10">
                      <Avatar className="w-12 h-12 border-2 border-[#10b981]">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-xs text-[#10b981] uppercase tracking-widest mt-1">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-4 mt-12 relative lg:absolute lg:top-[-100px] lg:right-12">
              <CarouselPrevious className="relative inset-auto translate-x-0 translate-y-0 bg-white/10 border-white/20 hover:bg-white hover:text-[#0f2419] text-white" />
              <CarouselNext className="relative inset-auto translate-x-0 translate-y-0 bg-white/10 border-white/20 hover:bg-white hover:text-[#0f2419] text-white" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ==========================================
          6. PRICING (3 Tiers with Cards)
          ========================================== */}
      <section id="pricing" className="py-32 bg-[#f0faf5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                Transparent <br /> <span className="text-[#10b981]">Investment.</span>
              </h2>
              <p className="text-lg text-[#0f2419]/50">
                Simple, predictable pricing for unparalleled quality. No hidden fees, just immaculate results.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {PRICING.map((tier, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Card className={`relative overflow-hidden transition-all duration-300 ${
                  tier.highlight 
                    ? "border-[#10b981] shadow-2xl shadow-[#10b981]/20 scale-100 md:scale-105 z-10 bg-[#0f2419] text-white" 
                    : "border-[#0f2419]/10 hover:border-[#10b981]/50 bg-white"
                }`}>
                  {tier.highlight && (
                    <div className="absolute top-0 right-0 bg-[#10b981] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-black mb-2">{tier.name}</CardTitle>
                    <CardDescription className={tier.highlight ? "text-white/60" : "text-[#0f2419]/50"}>
                      {tier.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="mb-8">
                      <span className="text-5xl font-black">{tier.price}</span>
                      <span className={`text-lg font-medium ml-2 ${tier.highlight ? "text-white/50" : "text-[#0f2419]/40"}`}>
                        {tier.period}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${tier.highlight ? "text-[#10b981]" : "text-[#10b981]"}`} />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      tier.highlight 
                        ? "bg-[#10b981] hover:bg-white hover:text-[#0f2419] text-white" 
                        : "bg-[#f0faf5] text-[#0f2419] hover:bg-[#10b981] hover:text-white"
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
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6">Clarity</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                Common Inquiries
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-[#0f2419]/10">
                  <AccordionTrigger className="text-left text-lg md:text-xl font-bold hover:text-[#10b981] hover:no-underline py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0f2419]/60 text-base leading-relaxed pb-6">
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f2419]">
          <Image
            src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=2000&auto=format&fit=crop"
            alt="Cleaning details"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <div className="w-20 h-20 bg-[#10b981] rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase mb-8">
              Ready for <br /> Perfection?
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied homeowners who have upgraded to the Pristine standard. Your first deep clean includes a complimentary aromatherapy treatment.
            </p>
            <button className="px-12 py-6 bg-[#10b981] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#0f2419] transition-all transform hover:scale-105 shadow-2xl shadow-[#10b981]/20">
              Book Your First Clean
            </button>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          9. MEGA FOOTER
          ========================================== */}
      <footer className="bg-white border-t border-[#0f2419]/10 pt-32 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-2xl font-black tracking-tighter mb-8"
              >
                <div className="w-10 h-10 bg-[#10b981] rounded-2xl flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span>PRISTINE</span>
              </Link>
              <p className="text-[#0f2419]/50 mb-8 max-w-sm leading-relaxed">
                Elevating the standard of residential and commercial cleaning through eco-conscious practices and uncompromising attention to detail.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#f0faf5] flex items-center justify-center text-[#0f2419] hover:bg-[#10b981] hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="font-bold uppercase tracking-widest text-xs text-[#10b981] mb-6">Services</h4>
              <ul className="space-y-4 text-sm font-medium text-[#0f2419]/70">
                {["Deep Cleaning", "Regular Upkeep", "Move In/Out", "Post-Construction", "Eco-Pure"].map((item) => (
                  <li key={item}><Link href="#" className="hover:text-[#10b981] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-xs text-[#10b981] mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-[#0f2419]/70">
                {["About Us", "Our Standards", "Careers", "Franchise", "Contact"].map((item) => (
                  <li key={item}><Link href="#" className="hover:text-[#10b981] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-bold uppercase tracking-widest text-xs text-[#10b981] mb-6">Contact</h4>
              <ul className="space-y-4 text-sm font-medium text-[#0f2419]/70">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#10b981]" />
                  <span>100 Clean Ave, NY</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#10b981]" />
                  <span>1-800-PRISTINE</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#10b981]" />
                  <span>hello@pristine.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#0f2419]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[#0f2419]/40">
            <div>&copy; 2026 Pristine Cleaning Services. All rights reserved.</div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-[#10b981]">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#10b981]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
