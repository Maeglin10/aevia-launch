// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Star, MapPin, Clock, Car, Check } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

/* ============================================================
   DATA
   ============================================================ */

const MENUS = [
  {
    season: "Printemps",
    subtitle: "Fraîcheur & Renouveau",
    color: "from-emerald-900/20 to-transparent",
    accent: "text-emerald-400",
    borderAccent: "border-emerald-800/40",
    dishes: [
      { name: "Velouté d'asperges vertes, œuf de caille poché", price: "28€", wine: "Pouilly-Fumé 2022" },
      { name: "Tartare de bar de ligne, caviar osciètre, agrumes", price: "42€", wine: "Chablis Grand Cru" },
      { name: "Ris de veau doré, morilles fraîches, jus de veau", price: "58€", wine: "Meursault 2020" },
      { name: "Fraises Gariguette, sorbet basilic, génoise légère", price: "22€", wine: "Barsac Sauternes" },
    ],
  },
  {
    season: "Été",
    subtitle: "Intensité & Soleil",
    color: "from-amber-900/20 to-transparent",
    accent: "text-amber-400",
    borderAccent: "border-amber-800/40",
    dishes: [
      { name: "Gazpacho de tomates anciennes, burrata crémeuse", price: "26€", wine: "Rosé de Provence" },
      { name: "Homard breton rôti, beurre d'estragon, fenouil confit", price: "68€", wine: "Montrachet 2019" },
      { name: "Agneau de Sisteron en croûte d'herbes, jus corsé", price: "62€", wine: "Pauillac 2018" },
      { name: "Pêche blanche rôtie, amande fraîche, crème verveine", price: "20€", wine: "Muscat d'Alsace" },
    ],
  },
  {
    season: "Automne",
    subtitle: "Profondeur & Terres",
    color: "from-orange-900/20 to-transparent",
    accent: "text-orange-400",
    borderAccent: "border-orange-800/40",
    dishes: [
      { name: "Velouté de cèpes, truffe noire râpée, croutons dorés", price: "38€", wine: "Côte de Nuits" },
      { name: "Noix de Saint-Jacques, butternut rôti, émulsion corail", price: "48€", wine: "Puligny-Montrachet" },
      { name: "Filet de bœuf Wagyu A5, sauce périgueux, pomme soufflée", price: "78€", wine: "Pomerol 2017" },
      { name: "Tarte Tatin revisitée, glace caramel beurre salé", price: "22€", wine: "Calvados XO" },
    ],
  },
];

const GALLERY_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    alt: "Salle principale de restaurant gastronomique",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=800&auto=format&fit=crop",
    alt: "Table dressée avec élégance",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
    alt: "Bar à vin de la maison",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
    alt: "Salle privée pour événements",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=800&auto=format&fit=crop",
    alt: "Détails de décoration intérieure",
    className: "col-span-1 row-span-1",
  },
];

const EXPERIENCES = [
  {
    title: "Déjeuner d'affaires",
    price: "75€",
    priceSub: "par personne",
    desc: "Formule déjeuner 3 services, vins au verre, café gourmand. Idéal pour vos rencontres professionnelles dans un cadre raffiné et discret.",
    duration: "1h30",
    includes: ["Entrée + Plat + Dessert", "Vins sélectionnés au verre", "Café & mignardises", "Salle privative sur demande"],
  },
  {
    title: "Menu Dégustation",
    price: "145€",
    priceSub: "par personne",
    desc: "Notre carte blanche au chef. Six services soigneusement construits autour des saisons, accompagnés d'accords mets-vins pensés par notre sommelier.",
    duration: "3h",
    includes: ["6 services signature", "Accord mets-vins", "Amuse-bouche & mignardises", "Sommelier dédié"],
    highlight: true,
  },
  {
    title: "Soirée Privée",
    price: "Sur devis",
    priceSub: "à partir de 12 convives",
    desc: "Nous mettons notre maison à votre disposition. Menu sur-mesure, décoration personnalisée, animation musicale sur demande. Une soirée inoubliable.",
    duration: "Toute la soirée",
    includes: ["Menu entièrement personnalisé", "Salle exclusive", "Décoration sur-mesure", "Équipe dédiée"],
  },
];

const REVIEWS = [
  {
    text: "Une expérience sensorielle complète. Le ris de veau aux morilles est d'une précision d'exécution rarissime. Service impeccable, cave exceptionnelle.",
    author: "M. Bertrand L.",
    date: "Octobre 2025",
    stars: 5,
    occasion: "Menu Dégustation",
  },
  {
    text: "Aevia Kitchen réunit tout ce que la grande cuisine française a de plus noble : technique sans ostentation, produits d'une qualité irréprochable, accueil sincère.",
    author: "Sophie D.",
    date: "Novembre 2025",
    stars: 5,
    occasion: "Soirée anniversaire",
  },
  {
    text: "Le homard breton était une révélation. Le sommelier nous a guidés vers un Montrachet parfait. Nous reviendrons à chaque saison pour voir évoluer la carte.",
    author: "Jean-Pierre M.",
    date: "Août 2025",
    stars: 5,
    occasion: "Déjeuner d'été",
  },
];

const TIME_SLOTS = ["12h00", "12h30", "14h00", "14h30", "19h30", "20h00", "21h00", "21h30"];
const GUEST_OPTIONS = ["1 personne", "2 personnes", "3 personnes", "4 personnes", "5 personnes", "6+ personnes"];

export default function CyberSecurityPage() {
  const heroRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(0);
  const [reservationSent, setReservationSent] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", guests: "", request: "" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative w-full bg-[#faf8f5]">
      {/* ==========================================
          1. HERO
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[85vh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop"
            alt="Aevia Kitchen"
            fill
            className="object-cover brightness-[0.45]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11182a] via-[#11182a]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#c9a855]/10 rounded border border-[#c9a855]/30 text-[#c9a855] text-[10px] font-bold uppercase tracking-widest mb-10">
              <ShieldCheck className="w-3.5 h-3.5" />
              Gastronomie Française — Paris 8ème
            </div>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] leading-[1.05] tracking-tight mb-8 text-white">
              L&apos;art de la <br />
              <em className="text-[#c9a855]">table française.</em>
            </h1>
            <p className="max-w-lg text-lg text-white/50 leading-relaxed mb-12">
              Une cuisine de saison ancrée dans la tradition, portée par
              l&apos;excellence du produit et la passion de l&apos;artisanat culinaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#reservation">
                <MagneticBtn className="px-10 py-4 bg-[#c9a855] text-[#11182a] text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-[#e0bf74] transition-all cursor-pointer border-none shadow-lg shadow-[#c9a855]/20">
                  Réserver une table
                </MagneticBtn>
              </Link>
              <Link href="#menus">
                <button className="px-10 py-4 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-white hover:text-[#11182a] transition-all cursor-pointer">
                  Découvrir les menus
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          2. SEASONAL MENU PREVIEW
          ========================================== */}
      <section id="menus" className="py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-4">
                La Carte
              </p>
              <h2 className="font-serif text-4xl md:text-6xl text-[#11182a] mb-4">
                Menus de saison
              </h2>
              <p className="text-[#11182a]/50 text-sm max-w-md mx-auto leading-relaxed">
                Le chef compose sa carte au rythme des saisons et des producteurs locaux.
              </p>
            </div>
          </Reveal>

          {/* Season tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {MENUS.map((m, i) => (
              <button
                key={m.season}
                onClick={() => setActiveMenu(i)}
                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer ${
                  activeMenu === i
                    ? "bg-[#11182a] text-[#c9a855]"
                    : "bg-transparent text-[#11182a]/40 hover:text-[#11182a] border border-[#11182a]/10"
                }`}
              >
                {m.season}
              </button>
            ))}
          </div>

          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${MENUS[activeMenu].color} bg-white border border-[#11182a]/8 rounded-xl p-10 md:p-14`}
          >
            <div className="mb-10">
              <h3 className="font-serif text-3xl text-[#11182a] mb-1">
                {MENUS[activeMenu].season}
              </h3>
              <p className={`text-sm ${MENUS[activeMenu].accent} font-bold uppercase tracking-widest`}>
                {MENUS[activeMenu].subtitle}
              </p>
            </div>
            <div className="divide-y divide-[#11182a]/8">
              {MENUS[activeMenu].dishes.map((dish, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
                  <div className="flex-1">
                    <p className="font-serif text-lg text-[#11182a] mb-1">{dish.name}</p>
                    <p className="text-[10px] text-[#11182a]/40 uppercase tracking-widest font-bold">
                      Accord : {dish.wine}
                    </p>
                  </div>
                  <div className={`text-xl font-bold ${MENUS[activeMenu].accent} flex-shrink-0`}>
                    {dish.price}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          3. CHEF STORY
          ========================================== */}
      <section className="py-24 bg-[#11182a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #c9a855 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
                    alt="Chef exécutif Aevia Kitchen"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11182a]/60 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#c9a855] text-[#11182a] p-8 rounded-lg hidden md:block">
                  <div className="text-3xl font-bold mb-1">★ ★</div>
                  <div className="text-[10px] font-black uppercase tracking-widest">
                    Guide Michelin
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-6">
                  La Maison
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
                  Le Chef <br />
                  <em>Thomas Mercier</em>
                </h2>
                <div className="space-y-4 text-white/50 leading-relaxed text-sm">
                  <p>
                    Formé auprès de Joël Robuchon et de Pierre Gagnaire, Thomas Mercier
                    a fondé Aevia Kitchen en 2018 après quinze ans passés dans les plus
                    grandes maisons d&apos;Europe. Sa philosophie est simple : laisser le
                    produit parler.
                  </p>
                  <p>
                    Chaque matin, il sélectionne personnellement ses ingrédients sur les
                    marchés parisiens et auprès de producteurs de confiance — maraîchers
                    bio de l&apos;Île-de-France, éleveurs du Limousin, pêcheurs bretons.
                    La technique est au service de la nature, jamais l&apos;inverse.
                  </p>
                  <p>
                    Deux étoiles Michelin obtenues dès la deuxième année d&apos;existence,
                    Aevia Kitchen figure aujourd&apos;hui parmi les cinquante meilleures tables
                    de France selon le guide Lebey.
                  </p>
                </div>
                <div className="mt-10 flex flex-wrap gap-6">
                  {[
                    { label: "Années d'expérience", val: "22" },
                    { label: "Étoiles Michelin", val: "2 ★" },
                    { label: "Producteurs partenaires", val: "34" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-3xl font-bold text-[#c9a855] mb-1">{s.val}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. AMBIANCE GALLERY
          ========================================== */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-4">
                L&apos;Ambiance
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#11182a]">
                Un cadre hors du temps
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[500px] md:h-[600px]">
            {GALLERY_PHOTOS.map((photo, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className={`relative overflow-hidden rounded-lg h-full ${photo.className} group cursor-pointer`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#11182a]/0 group-hover:bg-[#11182a]/20 transition-colors duration-300" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. EXPERIENCES
          ========================================== */}
      <section className="py-24 bg-[#f4f1ec] border-t border-[#11182a]/6">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-4">
                Nos Propositions
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#11182a]">
                Chaque moment mérite le meilleur
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={exp.title} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col p-8 rounded-xl border transition-all duration-300 ${
                    exp.highlight
                      ? "bg-[#11182a] border-[#c9a855]/30 shadow-xl"
                      : "bg-white border-[#11182a]/8 hover:border-[#c9a855]/20 hover:shadow-md"
                  }`}
                >
                  {exp.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c9a855] text-[#11182a] text-[9px] font-black uppercase tracking-widest rounded-full">
                      Recommandé
                    </div>
                  )}
                  <div className="mb-6">
                    <h3
                      className={`font-serif text-2xl mb-2 ${
                        exp.highlight ? "text-white" : "text-[#11182a]"
                      }`}
                    >
                      {exp.title}
                    </h3>
                    <p
                      className={`text-[10px] uppercase tracking-widest font-bold ${
                        exp.highlight ? "text-[#c9a855]/70" : "text-[#11182a]/40"
                      }`}
                    >
                      Durée : {exp.duration}
                    </p>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-8 flex-1 ${
                      exp.highlight ? "text-white/50" : "text-[#11182a]/50"
                    }`}
                  >
                    {exp.desc}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {exp.includes.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <Check
                          className={`w-3 h-3 flex-shrink-0 ${
                            exp.highlight ? "text-[#c9a855]" : "text-[#c9a855]"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            exp.highlight ? "text-white/60" : "text-[#11182a]/60"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-end justify-between pt-6 border-t border-current/10">
                    <div>
                      <div
                        className={`text-3xl font-bold ${
                          exp.highlight ? "text-[#c9a855]" : "text-[#11182a]"
                        }`}
                      >
                        {exp.price}
                      </div>
                      <div
                        className={`text-[9px] uppercase tracking-widest font-bold mt-0.5 ${
                          exp.highlight ? "text-white/30" : "text-[#11182a]/30"
                        }`}
                      >
                        {exp.priceSub}
                      </div>
                    </div>
                    <Link href="#reservation">
                      <button
                        className={`flex items-center gap-2 px-5 py-3 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                          exp.highlight
                            ? "bg-[#c9a855] text-[#11182a] hover:bg-[#e0bf74] border-none"
                            : "border border-[#c9a855]/40 text-[#c9a855] hover:bg-[#c9a855] hover:text-[#11182a]"
                        }`}
                      >
                        Réserver
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TESTIMONIALS
          ========================================== */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-4">
                Avis Invités
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#11182a]">
                Ce qu&apos;ils en disent
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col h-full p-8 bg-white border border-[#11182a]/6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#c9a855] text-[#c9a855]" />
                    ))}
                  </div>
                  <p className="font-serif text-lg text-[#11182a]/80 leading-relaxed mb-8 flex-1 italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-[#11182a]/6">
                    <div>
                      <div className="font-bold text-[#11182a] text-sm">{review.author}</div>
                      <div className="text-[9px] text-[#11182a]/30 uppercase tracking-widest font-bold mt-0.5">
                        {review.date} · {review.occasion}
                      </div>
                    </div>
                    <div className="text-[#c9a855] text-xl font-serif">✦</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. RESERVATION FORM
          ========================================== */}
      <section id="reservation" className="py-24 bg-[#11182a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c9a855] mb-6">
                  Réservation
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                  Réservez votre <br />
                  <em className="text-[#c9a855]">table</em>
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-10">
                  Pour toute demande spéciale ou réservation de plus de 8 couverts,
                  contactez-nous directement au{" "}
                  <span className="text-[#c9a855]">01 42 56 78 90</span>.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: <Clock className="w-4 h-4" />, title: "Horaires", val: "Mardi – Samedi\n12h00 – 14h30 · 19h30 – 22h00" },
                    { icon: <MapPin className="w-4 h-4" />, title: "Adresse", val: "14, avenue Montaigne\n75008 Paris" },
                    { icon: <Car className="w-4 h-4" />, title: "Parking", val: "Parking Montaigne à 200m\nVoiturier disponible le soir" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded border border-[#c9a855]/20 flex items-center justify-center text-[#c9a855] flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">
                          {item.title}
                        </div>
                        <div className="text-sm text-white/60 whitespace-pre-line">
                          {item.val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                {reservationSent ? (
                  <div className="text-center py-12">
                    <div className="text-4xl text-[#c9a855] font-serif mb-4">✦</div>
                    <h3 className="font-serif text-2xl text-white mb-3">
                      Demande reçue
                    </h3>
                    <p className="text-white/40 text-sm">
                      Notre équipe vous confirmera votre réservation dans les 2 heures.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setReservationSent(true);
                    }}
                    className="space-y-5"
                  >
                    <h3 className="font-serif text-2xl text-white mb-6">
                      Votre réservation
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] text-white/30 uppercase tracking-widest font-bold mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#c9a855]/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-white/30 uppercase tracking-widest font-bold mb-2">
                          Heure
                        </label>
                        <select
                          required
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0d1520] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#c9a855]/40 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Choisir</option>
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-white/30 uppercase tracking-widest font-bold mb-2">
                        Nombre de convives
                      </label>
                      <select
                        required
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0d1520] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#c9a855]/40 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionner</option>
                        {GUEST_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-white/30 uppercase tracking-widest font-bold mb-2">
                        Demandes particulières
                      </label>
                      <textarea
                        value={form.request}
                        onChange={(e) => setForm({ ...form, request: e.target.value })}
                        placeholder="Allergies, occasion spéciale, préférences..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a855]/40 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#c9a855] hover:bg-[#e0bf74] text-[#11182a] text-[10px] font-black uppercase tracking-[0.4em] rounded transition-all cursor-pointer border-none"
                    >
                      Confirmer la demande
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
