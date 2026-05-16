"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Star, ChevronLeft, ChevronRight, ShoppingBag, Heart, MapPin, Phone, Mail, Award, Gem } from "lucide-react";

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById("oj-fonts")) return;
    const s = document.createElement("style");
    s.id = "oj-fonts";
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');`;
    document.head.appendChild(s);
  }, []);
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const collections = [
  { name: "Éternité", items: 18, theme: "Diamants taille brillant", src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { name: "Rivière", items: 12, theme: "Saphirs & diamants", src: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80" },
  { name: "Héritage", items: 24, theme: "Pièces de haute joaillerie", src: "https://images.unsplash.com/photo-1573408301185-9519f94f4bd4?w=600&q=80" },
];

const pieces = [
  { name: "Bague Étoile de Mer", collection: "Éternité", material: "Or blanc 18k · Diamants 0.82ct", price: "4 800€", src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80", inStock: true },
  { name: "Collier Rivière Céleste", collection: "Rivière", material: "Or jaune 18k · Saphirs & Diamants", price: "6 200€", src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", inStock: true },
  { name: "Bracelet Lumière", collection: "Héritage", material: "Platine · Diamants 1.4ct total", price: "8 900€", src: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80", inStock: false },
  { name: "Boucles d'oreilles Aurore", collection: "Éternité", material: "Or rose 18k · Perles & Brillants", price: "3 400€", src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", inStock: true },
];

const services = [
  { title: "Sur mesure", desc: "De l'esquisse à la livraison, créez la pièce de vos rêves avec nos maîtres joailliers." },
  { title: "Expertise & Estimation", desc: "Évaluation professionnelle de vos bijoux de famille par nos gemmologues certifiés GIA." },
  { title: "Gravure personnalisée", desc: "Rendez chaque pièce unique avec une inscription, une date, une initiale gravée à la main." },
  { title: "Entretien & Réparation", desc: "Nettoyage, rhodiage, remplacement de griffes. SAV à vie pour les pièces achetées chez Orens." },
];

const testimonials = [
  { name: "Madeleine V.", text: "La bague de fiançailles que mon mari a choisie chez Orens est d'une beauté indescriptible. Chaque détail est parfait, et le service a été d'un raffinement exceptionnel.", piece: "Bague Étoile de Mer" },
  { name: "Florent K.", text: "J'ai commandé une pièce sur mesure pour les 30 ans de ma femme. L'équipe a su capturer exactement ce que je voulais. Un résultat qui dépasse toutes mes espérances.", piece: "Pièce sur mesure" },
  { name: "Anaïs B.", text: "Les boucles d'oreilles Aurore sont mon bijou de référence. Je les porte tous les jours depuis 3 ans. Elles ne se ternissent jamais, et l'or rose est d'une chaleur magnifique.", piece: "Boucles d'oreilles Aurore" },
];

export default function OrensJewelryPage() {
  useFonts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleWishlist = (name: string) => setWishlist(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  return (
    <div className="min-h-screen bg-[#0A0806]" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-[#C9A86C] origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0806]/95 backdrop-blur-md border-b border-[#C9A86C]/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-[#C9A86C] tracking-[0.2em] text-sm uppercase" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.1rem" }}>
            Orens Jewelry
          </Link>
          <div className="hidden md:flex items-center gap-10 text-white/40 text-xs tracking-widest uppercase">
            {["Collections", "Sur mesure", "Heritage", "Services", "Contact"].map(item => (
              <Link key={item} href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">{item}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="cursor-pointer hover:opacity-60 transition-opacity"><ShoppingBag className="w-5 h-5 text-white" /></button>
          </div>
          <button className="md:hidden text-white cursor-pointer" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#0A0806] flex flex-col p-8" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>Orens Jewelry</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            </div>
            {["Collections", "Sur mesure", "Heritage", "Services", "Contact"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href="#" className="block text-white text-3xl mb-6 cursor-pointer" style={{ fontFamily: "'Bodoni Moda', serif" }} onClick={() => setMobileOpen(false)}>{item}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1573408301185-9519f94f4bd4?w=1600&q=85" alt="Orens Jewelry" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/90 via-[#0A0806]/50 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 h-full flex items-center px-6" style={{ opacity: heroOpacity }}>
          <div className="max-w-7xl mx-auto w-full">
            <Reveal>
              <div className="flex items-center gap-2 text-[#C9A86C] text-xs tracking-widest uppercase mb-8">
                <Gem className="w-3 h-3" /> Maison fondée en 1962 · Paris
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-white text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}>
                L'art de la<br /><em>joaillerie</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-white/60 text-lg max-w-md leading-relaxed mb-10">
                Chaque bijou est une histoire. Façonné à la main par nos artisans joailliers depuis plus de 60 ans.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex gap-4">
                <button className="bg-[#C9A86C] text-black text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-[#B8975E] transition-colors cursor-pointer">
                  Découvrir les collections
                </button>
                <button className="border border-white/20 text-white text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  Sur mesure
                </button>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-6 bg-[#C9A86C] overflow-hidden">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].flatMap(() => ["Haute Joaillerie", "·", "Sur Mesure", "·", "Diamants Certifiés", "·", "Or 18 Carats", "·", "Gemmologie GIA", "·"]).map((t, i) => (
            <span key={i} className="text-black text-xs tracking-widest uppercase">{t}</span>
          ))}
        </motion.div>
      </section>

      {/* Collections */}
      <section className="py-24 px-6 bg-[#0D0B09]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Collections</p>
            <h2 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}>Nos univers</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {collections.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.1}>
                <div onClick={() => setActiveCollection(i)} className={`relative overflow-hidden rounded-2xl cursor-pointer group border transition-all ${i === activeCollection ? "border-[#C9A86C]/40" : "border-transparent"}`} style={{ aspectRatio: "3/4" }}>
                  <Image src={c.src} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-1">{c.items} pièces</p>
                    <h3 className="text-white text-2xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>{c.name}</h3>
                    <p className="text-white/50 text-xs mt-1">{c.theme}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Boutique</p>
              <h2 className="text-white text-4xl" style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}>Pièces sélectionnées</h2>
            </div>
            <Link href="#" className="text-[#C9A86C] text-xs tracking-widest uppercase hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pieces.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: "3/4" }}>
                    <Image src={p.src} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    {!p.inStock && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><span className="text-white text-xs tracking-widest uppercase border border-white/30 px-3 py-1">Sur commande</span></div>}
                    <button onClick={() => toggleWishlist(p.name)} className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Heart className={`w-4 h-4 ${wishlist.has(p.name) ? "text-red-400 fill-red-400" : "text-white"}`} />
                    </button>
                  </div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-1">{p.collection}</p>
                  <h3 className="text-white text-sm mb-1" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.name}</h3>
                  <p className="text-white/30 text-xs mb-3">{p.material}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A86C]" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.price}</span>
                    <button className="text-white/40 text-xs hover:text-[#C9A86C] transition-colors cursor-pointer flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-[#0D0B09]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-3">Nos services</p>
            <h2 className="text-white text-4xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>L'exception en tout</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="border-t border-[#C9A86C]/20 pt-6 cursor-pointer group hover:border-[#C9A86C]/60 transition-colors">
                  <h3 className="text-white text-lg mb-3 group-hover:text-[#C9A86C] transition-colors" style={{ fontFamily: "'Bodoni Moda', serif" }}>{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-1 text-[#C9A86C] text-xs mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    En savoir plus <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#C9A86C]">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-black fill-black" />)}
              </div>
              <p className="text-black text-2xl md:text-3xl leading-relaxed mb-6" style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic" }}>
                "{testimonials[activeTestimonial].text}"
              </p>
              <p className="text-black font-semibold text-sm">{testimonials[activeTestimonial].name}</p>
              <p className="text-black/50 text-xs mt-1">{testimonials[activeTestimonial].piece}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`rounded-full transition-all cursor-pointer ${i === activeTestimonial ? "w-6 h-2 bg-black" : "w-2 h-2 bg-black/30"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-[#C9A86C] text-xs tracking-widest uppercase mb-4">Nos boutiques</p>
            <h2 className="text-white text-4xl mb-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>Venez nous rendre visite</h2>
            <div className="space-y-4">
              {[{ loc: "Place Vendôme, Paris", tel: "+33 1 40 00 00 00", hours: "Lun–Sam 10h–19h" }, { loc: "Promenade des Anglais, Nice", tel: "+33 4 93 00 00 00", hours: "Lun–Sam 10h–18h" }].map(b => (
                <div key={b.loc} className="border-l-2 border-[#C9A86C]/20 pl-4">
                  <p className="text-white text-sm font-medium mb-1">{b.loc}</p>
                  <p className="text-white/40 text-xs">{b.tel} · {b.hours}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" alt="Boutique Orens" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060402] border-t border-[#C9A86C]/10 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20">
          <span className="text-[#C9A86C] text-xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>Orens Jewelry · Depuis 1962</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Collections</Link>
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Mentions légales</Link>
            <Link href="#" className="hover:text-[#C9A86C] transition-colors cursor-pointer">Politique de retour</Link>
          </div>
          <span>© 2026 Orens Jewelry. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}
