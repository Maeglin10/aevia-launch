// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { TemplateIcon } from '@/components/TemplateIcon'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"

function Reveal({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }}>{children}</motion.div>
}

function Counter({ target, suffix="" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const step = Math.ceil(target / 60)
    const t = setInterval(() => setCount(c => Math.min(c + step, target)), 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function MagneticBtn({ children, className="" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 500, damping: 25 })
  const sy = useSpring(y, { stiffness: 500, damping: 25 })
  const ref = useRef<HTMLButtonElement>(null)
  const handleMouse = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width/2) * 0.35)
    y.set((e.clientY - r.top - r.height/2) * 0.35)
  }
  return <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0) }} className={className}>{children}</motion.button>
}

const SERVICES = [
  {
    name: "Motion Graphics",
    desc: "Cinematic motion design for brands and campaigns",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["30-sec spots", "Full-length videos", "Social content"],
    price: "Starting at $8,000",
  },
  {
    name: "3D Animation",
    desc: "Complex 3D modeling and animation",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["3D renders", "Product animation", "Character rigging"],
    price: "Starting at $12,000",
  },
  {
    name: "Brand Films",
    desc: "Full-scale commercial production",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["Pre-production", "Shoot management", "Post-production"],
    price: "Starting at $25,000",
  },
  {
    name: "Interactive",
    desc: "Web and app interactive experiences",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["Interactive design", "WebGL", "Animation"],
    price: "Starting at $15,000",
  },
  {
    name: "AR/VR",
    desc: "Immersive augmented and virtual reality",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["AR filters", "VR experiences", "Spatial design"],
    price: "Starting at $20,000",
  },
  {
    name: "Brand Exploration",
    desc: "Creative concept development and ideation",
    reels: ["Reel 1", "Reel 2", "Reel 3"],
    deliverables: ["Conceptual design", "Mood boards", "Style frames"],
    price: "Starting at $5,000",
  },
]

const TEAM = [
  { name: "Alex Kim", role: "Creative Director", specialty: "Motion Design" },
  { name: "Maya Patel", role: "Lead 3D Artist", specialty: "CGI/Animation" },
  { name: "Jordan Rodriguez", role: "Producer", specialty: "Project Management" },
  { name: "Casey Wong", role: "Interactive Dev", specialty: "WebGL/XR" },
  { name: "Samantha Lee", role: "Colorist", specialty: "Post-Production" },
  { name: "Marco Russo", role: "Sound Designer", specialty: "Audio Branding" },
]

const PROCESS = [
  { step: "Discovery & Concept", icon: "📋" },
  { step: "Storyboarding & Design", icon: "🎨" },
  { step: "Animation & Production", icon: "🎬" },
  { step: "Compositing & Effects", icon: "✨" },
  { step: "Sound & Final Review", icon: "🔊" },
]

const REELTHUMB = [
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85",
  "https://picsum.photos/seed/motion1/1200/750",
  "https://picsum.photos/seed/motion/1200/750",
  "https://picsum.photos/seed/motion2/1200/750",
]

export default function KineticStudio() {
  const [activeService, setActiveService] = useState(0)
  const [reel, setReel] = useState(0)
  const [showreelOpen, setShowreelOpen] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  // Auto-cycle reel thumbnails
  useEffect(() => {
    const interval = setInterval(() => {
      setReel((prev) => (prev + 1) % REELTHUMB.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <motion.section style={{ y: heroY }} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#06060a] to-[#06060a]" />
        <div className="absolute inset-0 opacity-20">
          {REELTHUMB.map((thumb, idx) => (
            <motion.div key={idx} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: reel === idx ? 1 : 0 }} transition={{ duration: 0.5 }}>
              <Image src={thumb + "?w=1600&h=900"} alt="Reel" fill className="object-cover" />
            </motion.div>
          ))}
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-6xl md:text-8xl font-bold mb-6">
            KINETIC
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl font-light">
            Motion Design & Animation Studio
          </motion.p>
        </div>
      </motion.section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Our Services</h2>
        </Reveal>
        <Tabs defaultValue="Motion Graphics" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-[#1a1a2e] border border-[#ff5500]/20">
            {SERVICES.map((svc) => (
              <TabsTrigger key={svc.name} value={svc.name} className="data-[state=active]:bg-[#ff5500] data-[state=active]:text-black text-xs">
                {svc.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {SERVICES.map((service) => (
            <TabsContent key={service.name} value={service.name} className="mt-12">
              <div className="grid md:grid-cols-2 gap-12">
                <Reveal>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {service.reels.map((reel, idx) => (
                        <CarouselItem key={idx}>
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1a1a2e]">
                            <Image src={REELTHUMB[idx] + "?w=600&h=340"} alt={reel} fill className="object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                              <div className="text-white text-5xl">▶</div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-white" />
                    <CarouselNext className="text-white" />
                  </Carousel>
                </Reveal>
                <Reveal delay={0.1}>
                  <div>
                    <h3 className="text-3xl font-light text-white mb-4">{service.name}</h3>
                    <p className="text-white/70 mb-8">{service.desc}</p>
                    <div className="mb-8">
                      <h4 className="text-sm font-light uppercase tracking-widest text-[#ff5500] mb-4">Deliverables</h4>
                      <ul className="space-y-3">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#ff5500] rounded-full" />
                            <span className="text-white/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Badge className="bg-[#ff5500] text-black font-light">{service.price}</Badge>
                  </div>
                </Reveal>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Our Process</h2>
        </Reveal>
        <Accordion type="single" collapsible className="max-w-4xl mx-auto">
          {PROCESS.map((item, idx) => (
            <AccordionItem key={idx} value={`step-${idx}`} className="border-[#ff5500]/20">
              <AccordionTrigger className="text-white text-lg">
                <span className="mr-4 flex items-center"><TemplateIcon emoji={item.icon} size={24} color="#ff5500" /></span>
                {item.step}
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                {idx === 0 && "We collaborate with you to understand your vision, target audience, and project goals."}
                {idx === 1 && "Our creative team develops concepts, creates detailed storyboards, and establishes visual direction."}
                {idx === 2 && "Animation and motion design production begins, with regular progress reviews and feedback integration."}
                {idx === 3 && "All elements are composited together with visual effects, color grading, and final polish."}
                {idx === 4 && "Professional sound design, music selection, and final review before delivery."}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Featured Work</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {REELTHUMB.map((thumb, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <motion.div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer" whileHover={{ scale: 1.05 }}>
                <Image src={thumb + "?w=400&h=400"} alt={`Project ${idx + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">▶</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Trusted By Top Brands</h2>
        </Reveal>
        <div className="flex justify-center gap-12 flex-wrap">
          {["Nike", "Apple", "Google", "Netflix", "Spotify", "Adobe", "Meta", "Amazon"].map((brand, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <p className="text-white/40 font-light">{brand}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>By The Numbers</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Projects Completed", value: 300 },
            { label: "Years Experience", value: 8 },
            { label: "Brands Served", value: 50 },
            { label: "Awards Won", value: 12 },
          ].map((stat, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-light mb-2" style={{ color: "#ff5500" }}>
                  <Counter target={stat.value} />
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>The Team</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Card className="bg-[#06060a] border-[#ff5500]/20">
                <CardContent className="p-6">
                  <Avatar className="w-16 h-16 mb-4" style={{ backgroundColor: "#ff5500" }}>
                    <AvatarFallback className="text-black">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-light text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-[#ff5500] mb-3">{member.role}</p>
                  <Badge variant="outline" className="border-[#ff5500] text-[#ff5500]">{member.specialty}</Badge>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Testimonials</h2>
        </Reveal>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {[1, 2, 3].map((idx) => (
              <CarouselItem key={idx}>
                <Card className="bg-[#1a1a2e] border-[#ff5500]/20">
                  <CardContent className="p-8">
                    <p className="text-lg text-white mb-6 italic">"KINETIC brought our brand vision to life with stunning motion design. Their creativity and professionalism are exceptional."</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12" style={{ backgroundColor: "#ff5500" }}>
                        <AvatarFallback className="text-black">C{idx}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-light text-white">Client {idx}</p>
                        <p className="text-sm text-white/60">Brand Director</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white" />
          <CarouselNext className="text-white" />
        </Carousel>
      </section>

      <Dialog open={showreelOpen} onOpenChange={setShowreelOpen}>
        <DialogContent className="max-w-4xl bg-[#1a1a2e] border-[#ff5500]/20">
          <DialogHeader>
            <DialogTitle className="text-3xl text-white">Showreel 2025</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black relative rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/motion3/800/450" alt="Showreel" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button className="text-white text-6xl hover:scale-110 transition-transform">▶</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>FAQ</h2>
        </Reveal>
        <Accordion type="single" collapsible className="max-w-2xl">
          {[
            { q: "What's your typical project timeline?", a: "Most projects take 4-12 weeks depending on scope. Rush timelines are available with expedited pricing." },
            { q: "Do you handle the entire production?", a: "Yes, we manage concept through final delivery. Clients can request involvement at any stage." },
            { q: "What about usage rights?", a: "All deliverables include perpetual use rights for the client. We retain portfolio/reel rights." },
            { q: "Can we request revisions?", a: "Yes, we include 2 rounds of revisions. Additional revisions are billed hourly at $150/hour." },
          ].map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-[#ff5500]/20">
              <AccordionTrigger className="text-white">{item.q}</AccordionTrigger>
              <AccordionContent className="text-white/70">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>About KINETIC</h2>
        </Reveal>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-white/70 mb-6 text-lg">Founded in 2017, KINETIC Studio has become a leading creative force in motion design, animation, and interactive media. Our team of 25+ artists and technologists collaborate with brands at the forefront of innovation.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/70 mb-6 text-lg">We specialize in telling brand stories through motion, creating experiences that captivate, inspire, and drive results. From concept to delivery, we bring technical excellence and creative vision to every project.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/70 text-lg">Our work has been featured in Cannes Lions, D&AD Awards, and The Webby Awards. We're committed to pushing the boundaries of what's possible in motion and interactive media.</p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Project Workflow</h2>
        </Reveal>
        <Accordion type="single" collapsible className="max-w-4xl mx-auto">
          {PROCESS.map((item, idx) => (
            <AccordionItem key={idx} value={`step-${idx}`} className="border-[#ff5500]/20 mb-3">
              <AccordionTrigger className="text-white text-lg hover:text-[#ff5500] transition-colors">
                <span className="mr-4 flex items-center"><TemplateIcon emoji={item.icon} size={24} color="#ff5500" /></span>
                <span className="font-light">Phase {idx + 1}: {item.step}</span>
              </AccordionTrigger>
              <AccordionContent className="text-white/70 space-y-2">
                <p>Duration: {idx === 0 ? "1-2 weeks" : idx === 1 ? "2-3 weeks" : idx === 2 ? "4-8 weeks" : idx === 3 ? "2-4 weeks" : "1-2 weeks"}</p>
                <p>Deliverables: {
                  idx === 0 ? "Creative brief, moodboards, strategy document" :
                  idx === 1 ? "Storyboards, animatic, style frames, color palette" :
                  idx === 2 ? "Animated sequences, rough cuts, asset library" :
                  idx === 3 ? "Composited footage, color grading, VFX integration" :
                  "Final mix, subtitles/captions, multiple formats"
                }</p>
                {idx === 0 && <p>Our team immerses in your brand, audience, and objectives to develop a compelling creative strategy that resonates.</p>}
                {idx === 1 && <p>Visual concepts come to life through detailed storyboards and animated previews, ensuring alignment before full production.</p>}
                {idx === 2 && <p>Animators bring concepts to vivid life with motion, effects, and performance that capture emotion and energy.</p>}
                {idx === 3 && <p>Every frame is refined through compositing, color science, and visual effects mastery for cinematic quality.</p>}
                {idx === 4 && <p>Professional sound design, music selection, and final review create a complete sensory experience ready for delivery.</p>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Our Expertise</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "Motion Graphics", skills: "Kinetic typography, data visualization, broadcast design, lower thirds, infographics" },
            { title: "3D Animation", skills: "Character animation, product visualization, architectural walkthroughs, VFX" },
            { title: "Interactive Design", skills: "WebGL experiences, interactive websites, app UI animation, real-time experiences" },
          ].map((expertise, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div>
                <h4 className="text-lg font-light text-[#ff5500] mb-4">{expertise.title}</h4>
                <p className="text-white/70">{expertise.skills}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Case Studies</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { brand: "Nike", project: "Air Max Launch Campaign", scope: "30-sec TV spot + social assets", result: "2M+ views, 15% engagement rate" },
            { brand: "Google", project: "AI Overview Explainer", scope: "60-sec motion design + interactive", result: "Featured on homepage, 5M+ impressions" },
          ].map((study, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Card className="bg-[#1a1a2e] border-[#ff5500]/20">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-[#ff5500] text-black">{study.brand}</Badge>
                  <h4 className="text-lg font-light text-white mb-3">{study.project}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#ff5500] font-light">Scope</p>
                      <p className="text-white/70">{study.scope}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#ff5500] font-light">Results</p>
                      <p className="text-white/70">{study.result}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Awards & Recognition</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Cannes Lions", "D&AD Awards", "The Webby Awards", "Graphis Award", "One Show", "Indie Short Fest", "Vimeo Awards", "IATSE Choice"].map((award, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <Card className="bg-[#06060a] border-[#ff5500]/20 text-center">
                <CardContent className="p-6">
                  <p className="text-sm font-light text-[#ff5500]">{award}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Pricing Guide</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <Reveal>
            <div>
              <h3 className="text-2xl font-light text-white mb-6">Typical Project Ranges</h3>
              <ul className="space-y-4 text-white/70">
                <li className="flex justify-between">
                  <span>Motion Graphics (30-sec)</span>
                  <span className="text-[#ff5500]">$8,000 - $15,000</span>
                </li>
                <li className="flex justify-between">
                  <span>3D Animation (60-sec)</span>
                  <span className="text-[#ff5500]">$12,000 - $25,000</span>
                </li>
                <li className="flex justify-between">
                  <span>Brand Film Production</span>
                  <span className="text-[#ff5500]">$25,000 - $75,000+</span>
                </li>
                <li className="flex justify-between">
                  <span>Interactive Experience</span>
                  <span className="text-[#ff5500]">$15,000 - $40,000</span>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-2xl font-light text-white mb-6">Package Includes</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff5500] font-light">›</span>
                  <span>Unlimited revisions (first 2 rounds included)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff5500] font-light">›</span>
                  <span>All source files and assets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff5500] font-light">›</span>
                  <span>Multiple formats and resolutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff5500] font-light">›</span>
                  <span>Perpetual usage rights</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#1a1a2e]">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Get In Touch</h2>
        </Reveal>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-white/70 mb-8">Let's collaborate on your next project. Reach out to discuss your creative vision.</p>
          <div className="space-y-4 text-white/70 mb-12">
            <div>
              <p className="font-light text-[#ff5500] text-sm">Email</p>
              <p>hello@kineticstudio.com</p>
            </div>
            <div>
              <p className="font-light text-[#ff5500] text-sm">Phone</p>
              <p>+1 (212) 555-0300</p>
            </div>
            <div>
              <p className="font-light text-[#ff5500] text-sm">Location</p>
              <p>Brooklyn, New York</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <h2 className="text-5xl font-light mb-12" style={{ color: "#ff5500" }}>Let's Create Motion Magic</h2>
        </Reveal>
        <div className="text-center">
          <p className="text-lg text-white/70 mb-8">Bring your brand story to life with cutting-edge motion design and animation</p>
          <MagneticBtn className="px-12 py-4 rounded-lg font-light text-black transition-colors" style={{ backgroundColor: "#ff5500" }}>
            Get in Touch
          </MagneticBtn>
        </div>
      </section>
    </div>
  )
}
