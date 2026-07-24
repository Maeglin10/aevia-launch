"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem, MagneticButton } from "./AnimationHelpers";
import { Utensils, Clock, MapPin, X, Check, Users, Calendar, ChefHat, Star, Quote, Globe, Phone, Mail, ArrowRight, Wine, Sparkles, Award, HelpCircle, ShieldCheck } from "lucide-react";

const MENU_DATA = {
  Entrees: [
    { name: "Roasted Beetroot", desc: "Whipped goat cheese, candied walnuts, balsamic reduction.", price: 16 },
    { name: "Scallop Carpaccio", desc: "Citrus dressing, chili, micro-herbs.", price: 22 },
    { name: "Wild Mushroom Arancini", desc: "Truffle aioli, parmesan snow.", price: 18 },
  ],
  Plats: [
    { name: "Pan-Seared Sea Bass", desc: "Lemon risotto, asparagus, caper butter sauce.", price: 34 },
    { name: "Herb-Crusted Lamb Rack", desc: "Dauphinoise potatoes, mint jus, heirloom carrots.", price: 42 },
    { name: "Truffle Tagliatelle", desc: "Handmade pasta, wild mushrooms, aged parmesan.", price: 28 },
  ],
  Desserts: [
    { name: "Dark Chocolate Fondant", desc: "Salted caramel core, vanilla bean gelato.", price: 14 },
    { name: "Lemon Myrtle Posset", desc: "Shortbread crumble, fresh berries.", price: 12 },
    { name: "Selection of Fine Cheeses", desc: "Quince paste, artisan crackers.", price: 18 },
  ]
};

export function RestaurantTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  const brand = formData.brandColor || "#7c3aed";

  const [activeTab, setActiveTab] = useState<keyof typeof MENU_DATA>("Entrees");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  return (
    <ThemeWrapper session={session} dark={false}>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={formData.heroImageUrl || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80"} 
            className="w-full h-full object-cover brightness-50" 
          />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl px-6">
          <Reveal>
            <div className="w-20 h-[1px] bg-white/40 mx-auto mb-8" />
            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none">
              {c?.heroHeadline}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light italic mb-12 max-w-2xl mx-auto">
              {c?.heroSubline}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => setIsBookingOpen(true)}
                style={{ background: brand }}
                className="px-10 py-5 text-white font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl"
              >
                Reserve a Table
              </button>
              <button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all"
              >
                View The Menu
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Info Bar */}
      <section className="py-12 bg-zinc-900 text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/50"><MapPin className="w-4 h-4 text-white" /> {formData.city}</div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/50"><Clock className="w-4 h-4 text-white" /> Tue - Sun: 18:00 - 23:00</div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/50"><Utensils className="w-4 h-4 text-white" /> Fine Dining</div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-6">Our Story // Heritage</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">Culinary Art In Every Plate.</h2>
              <p className="text-xl text-zinc-500 leading-relaxed italic mb-12">
                {c?.aboutText}
              </p>
              <div className="flex gap-12 items-center">
                <div className="flex flex-col gap-2">
                  <div className="text-4xl font-black italic">12</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Years Exp</div>
                </div>
                <div className="w-[1px] h-12 bg-zinc-200" />
                <div className="flex flex-col gap-2">
                  <div className="text-4xl font-black italic">4.9</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Stars Rating</div>
                </div>
              </div>
            </Reveal>
            
            <div className="flex gap-6 h-[600px]">
              <motion.div 
                whileHover={{ flex: 1.5 }}
                className="flex-1 h-full overflow-hidden rounded-3xl transition-all duration-700"
              >
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                whileHover={{ flex: 1.5 }}
                className="flex-1 h-full overflow-hidden rounded-3xl transition-all duration-700"
              >
                <img src="https://images.unsplash.com/photo-1550966841-3ee7adac1668?w=800&q=80" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal className="mb-20">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Seasonal Menu</h2>
            <div className="flex justify-center gap-10 border-b">
              {Object.keys(MENU_DATA).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-black' : 'text-zinc-300'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-black" 
                    />
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {MENU_DATA[activeTab].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                  <div className="text-left">
                    <h3 className="text-xl font-bold uppercase group-hover:italic transition-all">{item.name}</h3>
                    <p className="text-zinc-400 font-light italic text-sm">{item.desc}</p>
                  </div>
                  <div className="w-full md:w-auto flex items-center gap-4">
                    <div className="hidden md:block flex-1 h-[1px] bg-zinc-100 min-w-[50px] group-hover:min-w-[100px] transition-all" />
                    <span className="text-xl font-black" style={{ color: brand }}>${item.price}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ SECTION 5: PHOTO GALLERY ═══ */}
      <section className="py-32 bg-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-6">Gallery // Moments</div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">The Experience</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
              "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&q=80",
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
              "https://images.unsplash.com/photo-1482275548304-a58859dc31b7?w=600&q=80",
              "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80",
            ].map((img, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`overflow-hidden rounded-2xl group ${i === 0 || i === 5 ? 'row-span-2' : ''}`}>
                  <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 aspect-square" alt="" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: TESTIMONIALS ═══ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-6">Reviews</div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Guest Voices</h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(c?.testimonials || [
              { name: "Claire M.", role: "Food Critic", text: "An extraordinary culinary journey. Every dish tells a story.", rating: 5 },
              { name: "Thomas R.", role: "Regular Guest", text: "Our go-to for special occasions. Impeccable service and flavors.", rating: 5 },
              { name: "Ana P.", role: "Travel Blogger", text: "A hidden gem. The tasting menu is an absolute masterpiece.", rating: 5 },
            ]).map((t, i) => (
              <StaggerItem key={i}>
                <div className="p-8 bg-zinc-50 rounded-3xl border hover:shadow-xl transition-all h-full flex flex-col">
                  <Quote className="w-6 h-6 mb-6 opacity-10" />
                  <p className="text-lg italic text-zinc-600 leading-relaxed mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-zinc-400">{t.role}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ SECTION 7: CHEF / TEAM ═══ */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80" className="w-full h-full object-cover" alt="Chef" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-6">Meet The Chef</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10 italic">A Passion For<br/>Exceptional Flavors.</h2>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8">
                With over 15 years of experience in Michelin-starred kitchens across Europe, our head chef brings a unique fusion of classical technique and modern innovation to every dish.
              </p>
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-zinc-200">
                <div><div className="text-3xl font-black italic">15+</div><div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Years</div></div>
                <div><div className="text-3xl font-black italic">3</div><div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Michelin Stars</div></div>
                <div><div className="text-3xl font-black italic">200+</div><div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Recipes</div></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: PRIVATE EVENTS ═══ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[40px] overflow-hidden relative" style={{ background: brand }}>
            <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=80" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="relative z-10 p-16 md:p-24 text-white text-center">
              <Wine className="w-10 h-10 mx-auto mb-8 opacity-60" />
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic">Private Events</h2>
              <p className="text-xl opacity-80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Host your next celebration at {formData.businessName}. Custom menus, dedicated service, and an unforgettable atmosphere for up to 80 guests.
              </p>
              <button className="px-10 py-5 bg-white font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all" style={{ color: brand }}>
                Inquire About Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 9: CONTACT FORM ═══ */}
      <section id="contact" className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <Reveal>
              <div className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-6">Get In Touch</div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">We&apos;d Love To Hear From You</h2>
              <div className="space-y-6 text-zinc-500">
                <div className="flex items-center gap-4"><Mail className="w-5 h-5" style={{ color: brand }} /> {formData.email}</div>
                {formData.phone && <div className="flex items-center gap-4"><Phone className="w-5 h-5" style={{ color: brand }} /> {formData.phone}</div>}
                <div className="flex items-center gap-4"><MapPin className="w-5 h-5" style={{ color: brand }} /> {formData.city}</div>
                <div className="flex items-center gap-4"><Clock className="w-5 h-5" style={{ color: brand }} /> Tuesday — Sunday, 18:00 — 23:00</div>
              </div>
              {(formData.instagram || formData.linkedin) && (
                <div className="flex gap-4 mt-10">
                  {formData.instagram && <a href={`https://instagram.com/${formData.instagram}`} className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"><Globe className="w-5 h-5" /></a>}
                </div>
              )}
            </Reveal>
            <Reveal delay={0.2}>
              <form className="space-y-6 bg-white p-10 rounded-3xl border shadow-sm" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Name</label>
                    <input type="text" className="w-full p-4 bg-zinc-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-offset-2" style={{ '--tw-ring-color': brand } as any} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</label>
                    <input type="email" className="w-full p-4 bg-zinc-50 border rounded-xl text-sm outline-none" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                  <textarea rows={4} className="w-full p-4 bg-zinc-50 border rounded-xl text-sm outline-none resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" style={{ background: brand }} className="w-full py-5 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-xl hover:brightness-110 transition-all rounded-xl">
                  Send Message
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10: PARTNER AWARDS / PRESS ═══ */}
      <section className="py-24 bg-zinc-50 border-y overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Recognized Excellence</span>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
                <Award className="w-8 h-8" /> MICHELIN_2026
             </div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
                <Star className="w-8 h-8" /> FORBES_TRAVEL
             </div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
                <Award className="w-8 h-8" /> JAMES_BEARD
             </div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
                <ShieldCheck className="w-8 h-8" /> TIMES_FOOD
             </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 11: INSTAGRAM SOCIAL WALL ═══ */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Social Circle</h2>
            <p className="text-zinc-400 mt-4 uppercase text-[10px] font-bold tracking-widest italic">Tag us @{formData.businessName.replace(/\s+/g, '')} to be featured</p>
          </Reveal>
          <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
             Follow our story <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
            "https://images.unsplash.com/photo-1550966841-3ee4ad004051?w=600&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
            "https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=600&q=80",
          ].map((img, i) => (
            <StaggerItem key={i}>
              <div className="aspect-square overflow-hidden rounded-2xl group relative cursor-pointer">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Globe className="w-8 h-8 text-white" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ═══ SECTION 12: LOCATIONS & INTERACTIVE MAP ═══ */}
      <section className="py-32 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <Reveal>
             <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 italic leading-none">Find Your<br/>Sanctuary.</h2>
             <div className="space-y-12">
                <div>
                   <div className="flex items-center gap-4 mb-4" style={{ color: brand }}>
                      <MapPin className="w-6 h-6" />
                      <span className="text-sm font-black uppercase tracking-widest">Flagship Location</span>
                   </div>
                   <p className="text-2xl font-light italic opacity-60">124 Gastronomy Ave, <br/>{formData.city || 'Paris'}, France 75001</p>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                   <div>
                      <div className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-2">Lunch Service</div>
                      <div className="text-sm font-black">12:00 PM — 2:30 PM</div>
                   </div>
                   <div>
                      <div className="text-[10px] uppercase font-black tracking-widest opacity-30 mb-2">Dinner Service</div>
                      <div className="text-sm font-black">7:00 PM — 11:00 PM</div>
                   </div>
                </div>
             </div>
          </Reveal>
          
          <Reveal delay={0.2} className="relative aspect-square md:aspect-video lg:aspect-square bg-zinc-800 rounded-[4rem] overflow-hidden border border-white/5">
             <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=80" className="w-full h-full object-cover opacity-40 grayscale" alt="Map View" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center animate-pulse shadow-2xl">
                   <MapPin className="w-8 h-8" />
                </div>
             </div>
             <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-xl border border-white/10 flex justify-between items-center rounded-3xl">
                <div className="text-xs font-black uppercase tracking-widest">Get Directions</div>
                <ArrowRight className="w-5 h-5" />
             </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 13: FAQ / POLICIES ═══ */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-24">
             <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 italic">House Policies</h2>
             <p className="text-zinc-500 italic">Ensuring the perfect ambiance for all our guests.</p>
          </Reveal>
          <div className="space-y-4">
             {[
               { q: "What is your cancellation policy?", a: "We require at least 24 hours notice for any cancellations or changes to your reservation. Late cancellations may incur a fee of €50 per guest." },
               { q: "Do you have a dress code?", a: "We maintain a smart-casual dress code. We kindly ask our guests to avoid athletic wear or beachwear during dinner service." },
               { q: "Can you accommodate dietary restrictions?", a: "Absolutely. Our culinary team is skilled in tailoring menus for allergies and dietary preferences. Please note these when booking." },
             ].map((item, i) => (
               <Reveal key={i} delay={i * 0.1}>
                 <div className="p-10 bg-zinc-50 rounded-[2rem] hover:bg-white border border-transparent hover:border-zinc-100 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-sm font-black uppercase tracking-widest">{item.q}</span>
                       <HelpCircle className="w-5 h-5 text-zinc-300 group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-600 transition-colors italic">{item.a}</p>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 14: FINAL CTA ═══ */}
      <section className="py-32 bg-zinc-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Sparkles className="w-8 h-8 mx-auto mb-8 opacity-40" />
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 leading-none">
              Your Table<br/>Awaits<span style={{ color: brand }}>.</span>
            </h2>
            <p className="text-xl text-white/50 mb-16 max-w-xl mx-auto italic">{c?.heroSubline}</p>
            <button onClick={() => setIsBookingOpen(true)} style={{ background: brand }} className="px-12 py-6 text-white font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl">
              Reserve Now
            </button>
          </Reveal>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="fixed inset-0 bg-black/80 z-[2000] backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white z-[2001] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-12">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-6 h-6" style={{ color: brand }} />
                    <span className="font-black uppercase tracking-widest">Table Reservation</span>
                  </div>
                  <button onClick={() => setIsBookingOpen(false)} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
                </div>

                {bookingStep === 1 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</label>
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 border rounded-xl">
                          <Calendar className="w-4 h-4" />
                          <input type="date" className="bg-transparent text-sm font-bold outline-none w-full" defaultValue="2026-05-20" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Guests</label>
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 border rounded-xl">
                          <Users className="w-4 h-4" />
                          <select className="bg-transparent text-sm font-bold outline-none w-full">
                            <option>2 People</option>
                            <option>4 People</option>
                            <option>6 People</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookingStep(2)}
                      style={{ background: brand }}
                      className="w-full py-5 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-xl hover:brightness-110 transition-all"
                    >
                      Check Availability
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-emerald-50 text-emerald-500">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Table Confirmed!</h3>
                    <p className="text-zinc-400 mb-12">We&apos;ve sent a confirmation email to your inbox.<br/>See you at {formData.businessName}.</p>
                    <button 
                      onClick={() => { setIsBookingOpen(false); setBookingStep(1); }}
                      className="px-12 py-4 border font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 transition-colors"
                    >
                      Back to Site
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ThemeWrapper>
  );
}
