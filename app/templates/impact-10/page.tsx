"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Star, ChevronRight, Menu, X, ArrowRight, Wifi, Car, Utensils, Waves, Dumbbell, Wine } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("gp-fonts")) return;
    const s = document.createElement("style");
    s.id = "gp-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const rooms = [
  { name: "Chambre Prestige", size: "38m²", view: "Cour intérieure", price: "480€", tag: "Populaire" },
  { name: "Suite Deluxe", size: "65m²", view: "Vue sur Jardin", price: "780€", tag: "Best-seller" },
  { name: "Grand Suite", size: "110m²", view: "Vue panoramique", price: "1 200€", tag: "Signature" },
];

const amenities = [
  { icon: <Wifi className="w-5 h-5" />, label: "Wi-Fi Premium" },
  { icon: <Car className="w-5 h-5" />, label: "Voiturier" },
  { icon: <Utensils className="w-5 h-5" />, label: "Restaurant étoilé" },
  { icon: <Waves className="w-5 h-5" />, label: "Spa & Piscine" },
  { icon: <Dumbbell className="w-5 h-5" />, label: "Fitness 24h" },
  { icon: <Wine className="w-5 h-5" />, label: "Bar & Cave" },
];

const gallery = [
  { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", label: "Chambre" },
  { src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", label: "Suite" },
  { src: "https://images.unsplash.com/photo-1540541338537-1220059a0de6?w=800&q=80", label: "Restaurant" },
  { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", label: "Spa" },
];

const testimonials = [
  { name: "Sophie R.", origin: "Paris", text: "Un séjour d'exception. Le service, les détails, l'atmosphère — tout est parfait. Notre nouveau palace de référence.", stars: 5 },
  { name: "James W.", origin: "London", text: "The Grand Palais redefines luxury hospitality. The suite views are breathtaking. We'll return every year.", stars: 5 },
  { name: "Hana T.", origin: "Tokyo", text: "最高の体験でした。スタッフのサービスは言葉にならないほど素晴らしい。また必ず来ます。", stars: 5 },
];

export default function GrandPalaisPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10]" style={{ fontFamily: "'Jost', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-[#0B0C10]/85 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[#C9A86C] tracking-widest text-sm uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
            Grand Palais
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/60 text-sm">
            {["Chambres", "Restaurant", "Spa", "Événements", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C9A86C] transition-colors duration-200 cursor-pointer">{item}</Link>
            ))}
          </div>
          <button className="hidden md:inline-flex bg-[#C9A86C] text-[#0B0C10] text-xs px-5 py-2.5 rounded-xl hover:bg-[#B8975E] transition-colors duration-200 cursor-pointer tracking-wide uppercase">
            Réserver
          </button>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0B0C10] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A86C] text-xl tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Grand Palais</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Chambres", "Restaurant", "Spa", "Événements", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85" alt="Grand Palais Hotel" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/60 via-[#0B0C10]/20 to-[#0B0C10]/80" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ opacity: heroOpacity }}>
          <Reveal>
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-6">Palace 5 étoiles · Paris</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Grand<br /><em>Palais</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/70 text-lg max-w-lg mb-10">L'art de vivre parisien à son apogée. Un palace d'exception au cœur de la ville lumière.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex gap-4">
              <button className="bg-[#C9A86C] text-[#0B0C10] px-8 py-4 rounded-xl text-sm uppercase tracking-wide hover:bg-[#B8975E] transition-colors cursor-pointer">
                Découvrir les suites
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl text-sm hover:bg-white/10 transition-colors cursor-pointer">
                Visite virtuelle
              </button>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#C9A86C]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[["1887", "Année de fondation"], ["87", "Chambres & Suites"], ["2 ✦", "Étoiles Michelin"], ["15min", "Des Champs-Élysées"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-[#0B0C10] text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{n}</p>
              <p className="text-[#0B0C10]/70 text-xs uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 px-6 bg-[#0F1015]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Hébergements</p>
              <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Chambres & Suites
              </h2>
            </div>
          </Reveal>
          <div className="flex gap-3 mb-8 flex-wrap">
            {rooms.map((r, i) => (
              <button key={r.name} onClick={() => setActiveRoom(i)} className={`px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer border ${i === activeRoom ? "bg-[#C9A86C] text-[#0B0C10] border-[#C9A86C]" : "border-white/10 text-white/60 hover:border-[#C9A86C]/50"}`}>
                {r.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeRoom} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} className="grid md:grid-cols-2 gap-8 bg-[#141519] border border-white/10 rounded-3xl overflow-hidden">
              <div className="relative h-72 md:h-auto">
                <Image src={gallery[activeRoom]?.src || gallery[0].src} alt={rooms[activeRoom].name} fill className="object-cover" />
              </div>
              <div className="p-10">
                <span className="text-xs bg-[#C9A86C]/10 text-[#C9A86C] border border-[#C9A86C]/20 px-3 py-1 rounded-full">{rooms[activeRoom].tag}</span>
                <h3 className="text-white text-3xl mt-4 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{rooms[activeRoom].name}</h3>
                <p className="text-white/50 text-sm mb-6">{rooms[activeRoom].size} · {rooms[activeRoom].view}</p>
                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-[#C9A86C] fill-[#C9A86C]" />)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs">À partir de</p>
                    <p className="text-[#C9A86C] text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{rooms[activeRoom].price}<span className="text-lg text-white/30">/nuit</span></p>
                  </div>
                  <button className="flex items-center gap-2 bg-[#C9A86C] text-[#0B0C10] px-6 py-3 rounded-xl text-sm hover:bg-[#B8975E] transition-colors cursor-pointer">
                    Réserver <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Galerie</p>
              <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>L'univers Grand Palais</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <Reveal key={g.label} delay={i * 0.08}>
                <div className="relative overflow-hidden rounded-2xl group cursor-pointer" style={{ aspectRatio: i === 0 ? "1/1.4" : "1/1" }}>
                  <Image src={g.src} alt={g.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-white text-xs tracking-widest uppercase">{g.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-24 px-6 bg-[#0F1015]">
        <div className="max-w-6xl mx-auto">
          <Reveal><div className="mb-12">
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Services</p>
            <h2 className="text-white text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>L'art du service</h2>
          </div></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.07}>
                <div className="bg-[#141519] border border-white/10 rounded-2xl p-6 hover:border-[#C9A86C]/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A86C]/10 flex items-center justify-center text-[#C9A86C] mb-4 group-hover:bg-[#C9A86C] group-hover:text-[#0B0C10] transition-colors">{a.icon}</div>
                  <p className="text-white text-sm">{a.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#C9A86C]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal><p className="text-[#0B0C10]/60 text-xs tracking-widest uppercase mb-12">Avis de nos hôtes</p></Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => <Star key={i} className="w-5 h-5 text-[#0B0C10] fill-[#0B0C10]" />)}
              </div>
              <p className="text-[#0B0C10] text-2xl md:text-3xl leading-relaxed mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                "{testimonials[activeTestimonial].text}"
              </p>
              <p className="text-[#0B0C10] font-medium text-sm">{testimonials[activeTestimonial].name}</p>
              <p className="text-[#0B0C10]/50 text-xs mt-1">{testimonials[activeTestimonial].origin}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`rounded-full transition-all duration-300 cursor-pointer ${i === activeTestimonial ? "w-6 h-2 bg-[#0B0C10]" : "w-2 h-2 bg-[#0B0C10]/30"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant teaser */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Restaurant Grand Palais" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">Gastronomie</p>
              <h2 className="text-white text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Le Jardin d'Or<br /><em>Restaurant</em>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">Deux étoiles Michelin. Chef Paul Vernet réinvente la gastronomie française classique avec des produits de saison sourcés dans nos jardins et chez les meilleurs producteurs français.</p>
              <button className="flex items-center gap-2 text-[#C9A86C] border border-[#C9A86C]/30 px-6 py-3 rounded-xl text-sm hover:bg-[#C9A86C]/10 transition-colors cursor-pointer">
                Réserver une table <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 px-6 bg-[#0F1015]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#141519] border border-[#C9A86C]/20 rounded-3xl p-10 md:p-16 text-center">
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-6">Réservation</p>
              <h2 className="text-white text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Vivez l'expérience<br />Grand Palais
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-10">Notre équipe de conciergerie est disponible 24h/24 pour créer votre séjour sur mesure.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#C9A86C] text-[#0B0C10] px-8 py-4 rounded-xl text-sm uppercase tracking-wide hover:bg-[#B8975E] transition-colors cursor-pointer">Réserver en ligne</button>
                <button className="border border-white/20 text-white px-8 py-4 rounded-xl text-sm hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"><Phone className="w-4 h-4" />+33 1 40 00 00 00</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080909] border-t border-white/10 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <p className="text-[#C9A86C] text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Grand Palais</p>
            <p className="text-white/40 text-sm leading-relaxed mb-4">Palace 5 étoiles au cœur de Paris depuis 1887.</p>
            <div className="space-y-1 text-xs text-white/40">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />8 Avenue de l'Opéra, 75001 Paris</div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" />+33 1 40 00 00 00</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" />reservation@grandpalais.fr</div>
            </div>
          </div>
          {[
            { title: "Hébergements", links: ["Chambres Prestige", "Suites Deluxe", "Grand Suite", "Suite Présidentielle"] },
            { title: "Expériences", links: ["Restaurant étoilé", "Spa & Bien-être", "Bar Le Crystal", "Événements privés"] },
            { title: "Informations", links: ["Tarifs & Disponibilités", "Politique d'annulation", "Offres spéciales", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><Link href="#" className="text-white/40 text-sm hover:text-[#C9A86C] transition-colors cursor-pointer">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <span>© 2026 Grand Palais. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
