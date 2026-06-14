"use client"

import React, { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react"
import { Reveal } from "../shared"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    societe: "",
    email: "",
    tel: "",
    subject: "Projet de développement",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setFormSubmitted(true)
  }

  return (
    <div className="bg-[#F7F5F2] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16">
          {/* Left: Info */}
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4">Contact & Accès</p>
              <h1 className="text-4xl md:text-5xl font-normal font-serif text-[#1A1612] leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Parlons de<br />votre <em>projet</em>
              </h1>
              <p className="text-[#6B5A40] text-base mt-6 font-light leading-relaxed mb-10">
                Nos équipes sont à votre disposition pour étudier vos propositions foncières, vos projets de développement ou vos besoins de placement. Remplissez le formulaire ci-contre pour être mis en relation avec le service concerné.
              </p>
              
              <div className="space-y-6">
                {[
                  { Icon: MapPin, label: "Adresse du siège", val: "8 avenue Hoche, 75008 Paris" },
                  { Icon: Phone, label: "Téléphone", val: "+33 1 44 15 62 00" },
                  { Icon: Mail, label: "Adresse e-mail", val: "contact@blueprint-dev.fr" },
                  { Icon: Clock, label: "Heures d'ouverture", val: "Lundi au Vendredi — 8h30 à 19h00" }
                ].map(({ Icon, label, val }) => (
                  <div key={label} className="flex gap-4 items-start text-sm">
                    <div className="w-10 h-10 rounded-full border border-[#E0D8CC] flex items-center justify-center bg-white text-[#C9A86C] flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#8A7860] uppercase tracking-wider mb-0.5">{label}</div>
                      <div className="text-[#1A1612] font-light">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <Reveal delay={0.15}>
            <div className="bg-white border border-[#E0D8CC] p-8 md:p-12 shadow-sm">
              {formSubmitted ? (
                <div className="py-16 text-center">
                  <CheckCircle2 className="w-16 h-16 text-[#C9A86C] mx-auto mb-6" />
                  <h3 className="text-2xl font-serif text-[#1A1612] mb-2 font-normal" style={{ fontFamily: "'Libre Baskerville', serif" }}>Message envoyé</h3>
                  <p className="text-sm text-[#6B5A40] font-light max-w-sm mx-auto leading-relaxed">
                    Merci pour votre intérêt. Notre équipe commerciale ou institutionnelle étudiera votre demande et vous répondra sous 48 heures ouvrées.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-8 px-6 py-2.5 border border-[#C9A86C] text-[#C9A86C] text-xs font-semibold uppercase tracking-widest hover:bg-[#C9A86C] hover:text-white transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Prénom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.prenom}
                        onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                        className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all" 
                        placeholder="Jean" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Nom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.nom}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all" 
                        placeholder="Dupont" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Société</label>
                    <input 
                      type="text" 
                      value={formData.societe}
                      onChange={e => setFormData({ ...formData, societe: e.target.value })}
                      className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all" 
                      placeholder="Nom de l'entreprise (optionnel)" 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all" 
                        placeholder="jean.dupont@entreprise.fr" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Téléphone</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.tel}
                        onChange={e => setFormData({ ...formData, tel: e.target.value })}
                        className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all" 
                        placeholder="+33 6..." 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Objet de la demande</label>
                    <select 
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all"
                    >
                      <option>Projet de développement</option>
                      <option>Opportunité foncière</option>
                      <option>Co-investissement</option>
                      <option>Partenariats institutionnels</option>
                      <option>Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#8A7860] font-semibold mb-2">Message</label>
                    <textarea 
                      rows={5} 
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#F7F5F2] border border-[#E0D8CC] px-4 py-3 text-sm text-[#1A1612] focus:outline-none focus:border-[#C9A86C] focus:bg-white transition-all resize-none" 
                      placeholder="Décrivez votre projet ou votre demande en détail..." 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1A1612] text-white hover:bg-[#C9A86C] hover:text-[#1A1612] py-4 text-xs tracking-widest uppercase font-semibold transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Envoyer le message <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
