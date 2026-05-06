"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
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
import { Menu, X, ArrowRight, ArrowUpRight, Play, ShoppingBag, Plus, Minus, Instagram, Facebook, Twitter, Hexagon } from "lucide-react"

// ─── UTILS & ANIMATION COMPONENTS ─────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RevealImg({ src, alt, aspect = "aspect-[3/4]" }: { src: string; alt: string; aspect?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${aspect}`}>
      <motion.div
        initial={{ height: "100%" }}
        animate={isInView ? { height: "0%" } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[#e8e6e1] z-10"
      />
      <motion.div
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

// ─── DATA MANIFESTS ─────────────────────────────────────────────────────────

const MANIFEST = {
  hero: {
    collection: "Automne / Hiver 2026",
    title: "Le Crépuscule d'Or",
    desc: "A brutal juxtaposition of fragile silks and severe tailoring. The AW26 collection explores the tension between architectural rigidity and fluid femininity.",
  },
  looks: [
    { id: "01", name: "L'Architecte", price: "€4,200", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" },
    { id: "02", name: "Ombre et Lumière", price: "€3,800", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" },
    { id: "03", name: "La Nuit Velours", price: "€5,100", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" },
    { id: "04", name: "Écho De Soie", price: "€2,900", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" }
  ],
  atelier: [
    { title: "Savoir-Faire", desc: "Every garment requires a minimum of 120 hours of manual labor at our Parisian atelier. Embroidery is executed by Lesage, ensuring ancestral techniques survive the modern era.", img: "https://images.unsplash.com/photo-1558769132-cb1fac0840f8?w=800&q=80" },
    { title: "Matériaux Purs", desc: "We source our cashmere exclusively from ethical farms in Inner Mongolia, and our silks are woven on century-old looms in Lyon. Compromise is not in our vocabulary.", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80" }
  ],
  press: [
    { quote: "Maison reshapes the very silhouette of modern elegance. A triumph of austere beauty.", publication: "Vogue Paris", author: "Emmanuelle Alt" },
    { quote: "The AW26 collection proves that true luxury still resides in the whispered details, not the scream of logos.", publication: "The Business of Fashion", author: "Tim Blanks" },
    { quote: "Tailoring so sharp it could cut glass, draped in fabrics that float like smoke.", publication: "WWD", author: "Miles Socha" }
  ],
  faq: [
    { q: "How do I secure an appointment at the Paris Atelier?", a: "Private fittings are strictly by appointment. Please submit a request via our concierge portal, and a client advisor will contact you within 48 hours." },
    { q: "Do you offer international shipping for ready-to-wear?", a: "Yes, we ship globally via secure, insured courier services. Delivery typically occurs within 3-5 business days." },
    { q: "Can a runway piece be customized to my measurements?", a: "Made-to-measure services are available exclusively for our Haute Couture clients. Ready-to-wear pieces can be altered at our flagship boutiques." },
    { q: "What is the return policy?", a: "Unworn ready-to-wear items may be returned within 14 days of receipt. Haute Couture and personalized items are final sale." }
  ]
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function MaisonFashionPage() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-[#fcfbf9] text-[#111111] font-sans min-h-screen selection:bg-[#cfae70] selection:text-white overflow-x-hidden">
      
      {/* ─── NAVBAR ────────────────────────────────────────────────────── */}
      <motion.nav 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#fcfbf9]/90 backdrop-blur-md py-4" : "bg-transparent py-8 mix-blend-difference text-white"}`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em]">
            {["Collections", "Maison", "Atelier", "Boutiques"].map((link) => (
              <Link key={link} href="#" className="hover:text-[#cfae70] transition-colors relative group">
                {link}
              </Link>
            ))}
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-3xl lg:text-4xl font-light tracking-[0.3em] uppercase" style={{ fontFamily: "Georgia, serif" }}>
              Maison
            </h1>
          </Link>

          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="#" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#cfae70] transition-colors">
              <Search className="w-4 h-4" /> Search
            </Link>
            <Link href="#" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#cfae70] transition-colors">
              <ShoppingBag className="w-4 h-4" /> (0)
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center justify-center hover:text-[#cfae70] transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#111111] text-[#fcfbf9] border-none p-12">
                <div className="flex flex-col gap-8 mt-20">
                  {["Collections", "Maison", "Atelier", "Boutiques", "Client Services", "Login"].map((link) => (
                    <Link key={link} href="#" className="text-4xl font-light uppercase tracking-widest hover:text-[#cfae70] transition-colors" style={{ fontFamily: "Georgia, serif" }}>
                      {link}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative h-screen min-h-[800px] overflow-hidden bg-[#111111]">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image 
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=2000&q=80" 
              alt="Maison Hero" 
              fill 
              className="object-cover opacity-70"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />

          <motion.div style={{ y: textY }} className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#fcfbf9] px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#cfae70] mb-6 block">
                {MANIFEST.hero.collection}
              </span>
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-light uppercase tracking-[0.1em] mb-8 leading-none" style={{ fontFamily: "Georgia, serif" }}>
                {MANIFEST.hero.title}
              </h2>
              <p className="max-w-2xl mx-auto text-sm md:text-base font-light italic leading-relaxed text-white/70">
                "{MANIFEST.hero.desc}"
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="absolute bottom-12">
              <div className="w-[1px] h-24 bg-white/30" />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── LOOKBOOK CAROUSEL ─────────────────────────────────────────── */}
        <section className="py-32 overflow-hidden">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-20">
            <Reveal>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#cfae70] mb-4">Runway</div>
                  <h3 className="text-5xl md:text-7xl font-light uppercase tracking-widest" style={{ fontFamily: "Georgia, serif" }}>
                    The Looks
                  </h3>
                </div>
                <Link href="#" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#111111] pb-1 hover:text-[#cfae70] hover:border-[#cfae70] transition-colors">
                  View Full Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="pl-6 md:pl-12">
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-8">
                {MANIFEST.looks.map((look, i) => (
                  <CarouselItem key={look.id} className="pl-4 md:pl-8 basis-[85%] md:basis-[45%] lg:basis-[30%]">
                    <Reveal delay={i * 0.1}>
                      <Link href="#" className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#f0eee9]">
                          <Image src={look.img} alt={look.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="bg-white text-[#111111] px-6 py-3 text-[10px] font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              Discover
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-bold text-[#111111]/50 mb-1">Look {look.id}</div>
                            <h4 className="text-lg font-light uppercase tracking-widest" style={{ fontFamily: "Georgia, serif" }}>{look.name}</h4>
                          </div>
                          <div className="text-sm font-light text-[#cfae70]">{look.price}</div>
                        </div>
                      </Link>
                    </Reveal>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* ─── ATELIER SECTION (SPLIT LAYOUT) ────────────────────────────── */}
        <section className="py-32 bg-[#111111] text-[#fcfbf9]">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="text-center mb-32">
              <Reveal>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#cfae70] mb-4">L'Artisanat</div>
                <h2 className="text-5xl md:text-7xl font-light uppercase tracking-[0.1em]" style={{ fontFamily: "Georgia, serif" }}>
                  The Atelier
                </h2>
              </Reveal>
            </div>

            <div className="flex flex-col gap-32">
              {MANIFEST.atelier.map((item, i) => (
                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 items-center`}>
                  <div className="w-full lg:w-1/2">
                    <RevealImg src={item.img} alt={item.title} aspect="aspect-[4/5]" />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <Reveal delay={0.2}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#cfae70] mb-6">0{i+1}</div>
                      <h3 className="text-4xl lg:text-5xl font-light uppercase tracking-widest mb-8 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-lg font-light italic leading-relaxed text-white/60 max-w-md">
                        "{item.desc}"
                      </p>
                      <button className="mt-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#cfae70] transition-colors">
                        <span className="w-8 h-[1px] bg-[#cfae70]" /> Explore
                      </button>
                    </Reveal>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRESS QUOTES ──────────────────────────────────────────────── */}
        <section className="py-40 bg-[#f4f2eb] border-y border-[#111111]/10">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#cfae70] mb-16">Press</div>
            </Reveal>
            <Carousel opts={{ align: "center", loop: true }}>
              <CarouselContent>
                {MANIFEST.press.map((quote, i) => (
                  <CarouselItem key={i}>
                    <Reveal delay={0.1}>
                      <h3 className="text-3xl md:text-5xl font-light italic leading-relaxed mb-12 text-[#111111]" style={{ fontFamily: "Georgia, serif" }}>
                        "{quote.quote}"
                      </h3>
                      <div className="text-sm font-bold uppercase tracking-widest">
                        {quote.publication}
                      </div>
                      <div className="text-[10px] font-bold text-[#111111]/50 uppercase tracking-widest mt-2">
                        — {quote.author}
                      </div>
                    </Reveal>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-32 max-w-[800px] mx-auto px-6">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.1em] mb-4" style={{ fontFamily: "Georgia, serif" }}>
                Client Services
              </h2>
            </Reveal>
          </div>
          
          <Reveal delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              {MANIFEST.faq.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-[#111111]/10">
                  <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-6 hover:text-[#cfae70] hover:no-underline text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#111111]/60 leading-relaxed pb-6 font-light italic">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* ─── VIDEO/IMAGE CTA ───────────────────────────────────────────── */}
        <section className="h-[80vh] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000&q=80" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#111111]/40" />
          </div>
          <div className="relative z-10 text-center text-white">
            <Reveal>
              <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-10 hover:bg-white hover:text-[#111111] transition-colors cursor-pointer backdrop-blur-sm">
                <Play className="w-6 h-6 ml-1" />
              </div>
              <h2 className="text-5xl md:text-7xl font-light uppercase tracking-[0.1em] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                The Campaign
              </h2>
              <p className="text-sm uppercase tracking-[0.3em] font-bold">Watch the Film</p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#111111] text-white pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
          
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-light tracking-[0.3em] uppercase mb-8" style={{ fontFamily: "Georgia, serif" }}>
              Maison
            </h1>
            <form className="max-w-md relative mb-12">
              <input 
                type="email" 
                placeholder="SUBSCRIBE TO THE NEWSLETTER" 
                className="w-full bg-transparent border-b border-white/20 py-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#cfae70] transition-colors placeholder:text-white/30"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#cfae70] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#cfae70] mb-8">Client Services</h4>
            <ul className="space-y-4 text-[10px] font-bold tracking-widest uppercase text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Book an Appointment</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#cfae70] mb-8">La Maison</h4>
            <ul className="space-y-4 text-[10px] font-bold tracking-widest uppercase text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">Our History</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Legal</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1800px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-bold uppercase tracking-widest text-white/40">
          <div>© 2026 MAISON. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-white transition-colors">WeChat</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
