"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Search, Star, ExternalLink, ArrowUpRight } from "lucide-react";
import { TEMPLATES_REGISTRY } from "@/lib/templates/registry";
import { INDUSTRIES, SECTOR_TEMPLATES, TEMPLATE_CITY_LABELS } from "@/lib/templates/sectors";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";
import { useLang } from "@/lib/LangContext";

// Fallback high-quality photos by specialty if local webp thumbnail is missing
const FALLBACK_PHOTOS: Record<string, string> = {
  medecin: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
  dentiste: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",
  kine: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800&auto=format&fit=crop",
  osteo: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
  avocat: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
  comptable: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  coach: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
  plombier: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
  electricien: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=800&auto=format&fit=crop",
  boulangerie: "https://images.unsplash.com/photo-1509440159258-1c1c3e5f3f5b?q=80&w=800&auto=format&fit=crop",
  mariage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  couture: "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=800&auto=format&fit=crop",
  tatoueur: "https://images.unsplash.com/photo-1590246814883-57f5114cbd94?q=80&w=800&auto=format&fit=crop",
  paysagiste: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  restauration_rapide: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
};

// Colors for Broad Industries
const INDUSTRY_COLOR: Record<string, string> = {
  sante: "#14b8a6",
  services: "#f59e0b",
  droit_finance: "#3b82f6",
  restauration: "#ef4444",
  sport_coaching: "#8b5cf6",
  art_creation: "#ec4899",
  evenementiel: "#10b981",
};

interface GalleryTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  style: "Dark" | "Light" | "Vibrant" | "Brutalist";
  specialtyId: string;
  specialtyLabel: string;
  specialtyEmoji: string;
  industryId: string;
  cityLabel: string;
}

function TemplateCard({ template, index }: { template: GalleryTemplate; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const thumbSrc = `/thumbnails/${template.id}.webp`;
  const fallbackSrc = FALLBACK_PHOTOS[template.specialtyId] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setThumbLoaded(true);
    }
  }, []);

  // Compute style settings based on the template style archetype
  const cardStyle = useMemo(() => {
    switch (template.style) {
      case "Dark":
        return {
          wrapper: "bg-[#0d0d0e] border border-zinc-800/80 rounded-2xl",
          hover: "group-hover:border-zinc-700 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]",
          textTitle: "text-zinc-100",
          textMuted: "text-zinc-500",
          styleBadge: "bg-zinc-900/60 text-zinc-400 border border-zinc-800/50",
          ctaPrimary: "bg-white hover:bg-zinc-200 text-black",
          ctaSecondary: "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800/50",
        };
      case "Light":
        return {
          wrapper: "bg-[#fafafb] border border-zinc-200/80 rounded-2xl",
          hover: "group-hover:border-zinc-300 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)]",
          textTitle: "text-zinc-900",
          textMuted: "text-zinc-500",
          styleBadge: "bg-zinc-200/40 text-zinc-700 border border-zinc-200/50",
          ctaPrimary: "bg-zinc-950 hover:bg-zinc-800 text-white",
          ctaSecondary: "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
        };
      case "Vibrant":
        return {
          wrapper: "bg-[#0a0717] border border-violet-950/40 rounded-2xl",
          hover: "group-hover:border-violet-500/40 group-hover:shadow-[0_0_35px_rgba(139,92,246,0.18)]",
          textTitle: "text-violet-50",
          textMuted: "text-violet-400/50",
          styleBadge: "bg-violet-950/40 text-violet-300 border border-violet-900/30",
          ctaPrimary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white",
          ctaSecondary: "bg-violet-950/20 border border-violet-900/40 text-violet-200 hover:bg-violet-900/30",
        };
      case "Brutalist":
        return {
          wrapper: "bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] transition-all",
          hover: "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_#000000]",
          textTitle: "text-black font-black uppercase tracking-tight",
          textMuted: "text-zinc-700 font-mono text-[10px]",
          styleBadge: "bg-yellow-300 text-black border border-black font-bold uppercase tracking-wider",
          ctaPrimary: "bg-black hover:bg-zinc-800 text-white rounded-none border border-black font-bold",
          ctaSecondary: "bg-white border border-black text-black hover:bg-yellow-300/20 rounded-none font-bold",
        };
      default:
        return {
          wrapper: "bg-zinc-900 border border-zinc-800 rounded-2xl",
          hover: "group-hover:border-zinc-700 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
          textTitle: "text-zinc-100",
          textMuted: "text-zinc-500",
          styleBadge: "bg-zinc-900 text-zinc-400 border border-zinc-800",
          ctaPrimary: "bg-white hover:bg-zinc-200 text-black",
          ctaSecondary: "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800/50",
        };
    }
  }, [template.style]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min((index % 6) * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${cardStyle.wrapper} ${cardStyle.hover}`}>
        {/* Preview image or fallback */}
        <div className="w-full aspect-video relative overflow-hidden bg-zinc-950 border-b border-black/10 shrink-0">
          {/* Main Unsplash Fallback background (always present as backdrop or active fallback) */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fallbackSrc}
              alt=""
              className="w-full h-full object-cover opacity-20 filter blur-xs group-hover:scale-105 transition-transform duration-[4s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>

          {/* Fallback Graphic (shown if thumbnail fails) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 opacity-20 border border-white/10 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-1">{template.specialtyLabel}</span>
            <h4 className="text-lg font-extrabold text-white/60 tracking-tight uppercase group-hover:text-white transition-colors duration-700">{template.name}</h4>
          </div>

          {/* Real Thumbnail screenshot */}
          {!thumbFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={thumbSrc}
              alt={template.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-300"
              style={{
                opacity: thumbLoaded ? 1 : 0,
                objectPosition: hovered ? "center 100%" : "center 0%",
                transition: `opacity 400ms, object-position ${hovered ? "4.5s" : "800ms"} ease-in-out`,
              }}
              onLoad={() => setThumbLoaded(true)}
              onError={() => setThumbFailed(true)}
            />
          )}

          {/* Interactive preview tag */}
          {thumbLoaded && !thumbFailed && (
            <div
              className={`absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ${
                hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              }`}
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#a78bfa",
                border: "1px solid rgba(167,139,250,0.3)"
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Aperçu live
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-300">
                {template.specialtyEmoji} {template.specialtyLabel}
              </span>
            </div>
            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${cardStyle.styleBadge}`}>
              {template.style}
            </span>
          </div>

          <h3 className={`text-base font-bold mb-1 tracking-tight ${cardStyle.textTitle}`}>{template.name}</h3>
          <p className={`text-xs mb-4 font-mono font-medium opacity-80 ${cardStyle.textMuted}`}>{template.cityLabel}</p>
          <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3 mb-6 flex-grow">{template.description}</p>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
            <Link
              href={`/templates/${template.id}`}
              className={`py-2 px-3 text-xs font-bold text-center rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${cardStyle.ctaSecondary}`}
            >
              Voir la démo
              <ExternalLink size={12} />
            </Link>
            <Link
              href={`/onboarding?template=${template.id}`}
              className={`py-2 px-3 text-xs font-bold text-center rounded-lg transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] ${cardStyle.ctaPrimary}`}
            >
              Choisir
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryShowcase() {
  const { locale } = useLang();

  // Selected state filters
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Translate broad industry labels dynamically
  const getIndustryLabel = (ind: typeof INDUSTRIES[0]) => {
    if (locale === "fr") return ind.label;
    return ind.labels[locale as keyof typeof ind.labels] || ind.label;
  };

  // Translate specialty labels dynamically
  const getSpecialtyLabel = (spec: typeof INDUSTRIES[0]["specialties"][0]) => {
    if (locale === "fr") return spec.label;
    return spec.labels[locale as keyof typeof spec.labels] || spec.label;
  };

  // Helper mappings
  const templateToSpecialty = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [specId, tids] of Object.entries(SECTOR_TEMPLATES)) {
      for (const tid of tids) {
        map[tid] = specId;
      }
    }
    return map;
  }, []);

  const specialtyToIndustry = useMemo(() => {
    const map: Record<string, string> = {};
    for (const ind of INDUSTRIES) {
      for (const spec of ind.specialties) {
        map[spec.id] = ind.id;
      }
    }
    return map;
  }, []);

  // Filter list of active specialties under the selected broad industry
  const specialtiesInSelectedIndustry = useMemo(() => {
    if (selectedIndustry === "All") return [];
    const ind = INDUSTRIES.find(i => i.id === selectedIndustry);
    return ind ? ind.specialties : [];
  }, [selectedIndustry]);

  // Construct active gallery templates based on SECTOR_TEMPLATES mapping
  const allTemplates = useMemo<GalleryTemplate[]>(() => {
    const templates: GalleryTemplate[] = [];

    for (const tpl of TEMPLATES_REGISTRY) {
      const specId = templateToSpecialty[tpl.id];
      if (!specId) continue; // Only show templates mapped to sectors

      const indId = specialtyToIndustry[specId];
      const industry = INDUSTRIES.find(i => i.id === indId);
      const specialty = industry?.specialties.find(s => s.id === specId);

      // Resolve specialty text/emoji
      const specLabel = specialty ? getSpecialtyLabel(specialty) : tpl.category;
      const specEmoji = specialty?.emoji || "✨";

      // Resolve display city label
      const cityLabel = TEMPLATE_CITY_LABELS[tpl.id] || `${tpl.name} · Paris`;

      templates.push({
        id: tpl.id,
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        style: tpl.style,
        specialtyId: specId,
        specialtyLabel: specLabel,
        specialtyEmoji: specEmoji,
        industryId: indId || "",
        cityLabel,
      });
    }

    return templates;
  }, [templateToSpecialty, specialtyToIndustry, locale]);

  // Filter templates list based on active categories, specialties, and search query
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allTemplates.filter((t) => {
      // 1. Industry match
      if (selectedIndustry !== "All" && t.industryId !== selectedIndustry) return false;
      // 2. Specialty match
      if (selectedSpecialty !== "All" && t.specialtyId !== selectedSpecialty) return false;
      // 3. Search text match
      if (q) {
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesCity = t.cityLabel.toLowerCase().includes(q);
        const matchesSpec = t.specialtyLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCity && !matchesSpec) return false;
      }
      return true;
    });
  }, [allTemplates, selectedIndustry, selectedSpecialty, searchQuery]);

  // Reset specialty if industry changes
  const selectIndustry = (indId: string) => {
    setSelectedIndustry(indId);
    setSelectedSpecialty("All");
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col" style={{ overflowX: "hidden" }}>
      <AeviaHeader />

      <main className="flex-grow pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header section with radial background glow */}
          <div className="relative mb-16 text-center max-w-3xl mx-auto z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/10 rounded-full filter blur-[80px] pointer-events-none -z-10" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 mb-6 uppercase tracking-wider"
            >
              <Sparkles size={12} className="text-violet-400" />
              Vitrine de Thèmes Professionnels
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-[1.05]"
            >
              Le site idéal pour votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">activité</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-base sm:text-lg leading-relaxed font-medium"
            >
              Découvrez notre collection exclusive de sites web optimisés pour le référencement, 100% responsives et personnalisés avec précision par notre IA.
            </motion.p>
          </div>

          {/* Search and Filters container */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 sm:p-8 mb-12 backdrop-blur-md">
            
            {/* Search Input */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher un modèle par nom, spécialité, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 rounded-xl text-sm placeholder-zinc-500 text-white outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 hover:text-white"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Broad Industry Filters */}
            <div className="mb-6">
              <span className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3">
                Filtrer par secteur
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => selectIndustry("All")}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${
                    selectedIndustry === "All"
                      ? "bg-white text-black border-white shadow-lg shadow-white/5"
                      : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  Tous les modèles
                </button>
                {INDUSTRIES.map((ind) => {
                  const isActive = selectedIndustry === ind.id;
                  const label = getIndustryLabel(ind);
                  return (
                    <button
                      key={ind.id}
                      onClick={() => selectIndustry(ind.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all border flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white text-black border-white shadow-lg shadow-white/5"
                          : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      <span>{ind.emoji}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialty Sub-Filters (animated entrance) */}
            <AnimatePresence mode="wait">
              {selectedIndustry !== "All" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-white/5 pt-5"
                >
                  <span className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3">
                    Spécialité / Métier
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSpecialty("All")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        selectedSpecialty === "All"
                          ? "bg-zinc-800 border-zinc-700 text-white"
                          : "bg-zinc-900/40 text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
                      }`}
                    >
                      Tous les métiers
                    </button>
                    {specialtiesInSelectedIndustry.map((spec) => {
                      const isActive = selectedSpecialty === spec.id;
                      const label = getSpecialtyLabel(spec);
                      return (
                        <button
                          key={spec.id}
                          onClick={() => setSelectedSpecialty(spec.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border flex items-center gap-1.5 ${
                            isActive
                              ? "bg-zinc-800 border-zinc-700 text-white"
                              : "bg-zinc-900/40 text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
                          }`}
                        >
                          <span>{spec.emoji}</span>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {filteredTemplates.length} modèle{filteredTemplates.length > 1 ? "s" : ""} trouvé{filteredTemplates.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Templates Grid Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((tpl, i) => (
                <TemplateCard key={tpl.id} template={tpl} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20"
            >
              <Search className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Aucun modèle ne correspond à votre recherche</h3>
              <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
                Essayez d&apos;ajuster vos filtres de secteur ou d&apos;effacer votre recherche textuelle pour explorer d&apos;autres alternatives.
              </p>
              <button
                onClick={() => {
                  setSelectedIndustry("All");
                  setSelectedSpecialty("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </motion.div>
          )}

          {/* Bottom Onboarding CTA Section */}
          <div className="mt-24 relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-[#0d0a1c] to-[#050506] p-8 sm:p-12 text-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-violet-600/5 rounded-full filter blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-cyan-600/5 rounded-full filter blur-[100px] pointer-events-none" />
            
            <div className="relative max-w-2xl mx-auto z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles size={24} className="text-violet-400" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Vous hésitez encore sur le modèle idéal ?
              </h2>
              
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
                Laissez notre onboarding intelligent analyser votre activité, vos préférences de design et vos objectifs pour vous proposer automatiquement la charte idéale en 2 minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                >
                  Trouver mon modèle idéal
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center"
                >
                  Découvrir nos tarifs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
