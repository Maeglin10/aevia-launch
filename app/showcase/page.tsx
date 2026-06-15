"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";

/* ─── Niche data ─────────────────────────────────────────────── */
const NICHES = [
  {
    icon: "🍽",
    thumbIds: ["impact-33", "impact-37", "impact-40"],
    cat: "Food & Drink",
    label: { fr: "Restaurant & Café", en: "Restaurant & Café", es: "Restaurante & Café", de: "Restaurant & Café", pt: "Restaurante & Café" },
    desc: {
      fr: "Menu en ligne, réservations, galerie photo, localisation Google Maps.",
      en: "Online menu, reservations, photo gallery, Google Maps.",
      es: "Menú online, reservas, galería de fotos, Google Maps.",
      de: "Online-Menü, Reservierungen, Fotogalerie, Google Maps.",
      pt: "Cardápio online, reservas, galeria de fotos, Google Maps.",
    },
    color: "#FB923C",
  },
  {
    icon: "🔨",
    thumbIds: ["impact-14", "impact-39", "impact-41"],
    cat: "Services",
    label: { fr: "Artisan & Travaux", en: "Trades & Services", es: "Artesano & Servicios", de: "Handwerk & Service", pt: "Artesão & Serviços" },
    desc: {
      fr: "Devis en ligne, galerie réalisations, zone d'intervention, avis clients.",
      en: "Online quotes, project gallery, service area, client reviews.",
      es: "Presupuesto online, galería de obras, zona de servicio, reseñas.",
      de: "Online-Angebote, Projektgalerie, Einsatzgebiet, Kundenbewertungen.",
      pt: "Orçamento online, galeria de obras, área de atuação, avaliações.",
    },
    color: "#F59E0B",
  },
  {
    icon: "💚",
    thumbIds: ["impact-30", "impact-31", "impact-32"],
    cat: "Health",
    label: { fr: "Santé & Bien-être", en: "Health & Wellness", es: "Salud & Bienestar", de: "Gesundheit & Wellness", pt: "Saúde & Bem-estar" },
    desc: {
      fr: "Prise de RDV en ligne, présentation du praticien, FAQ, témoignages.",
      en: "Online booking, practitioner bio, FAQ, patient testimonials.",
      es: "Citas online, perfil del profesional, FAQ, testimonios.",
      de: "Online-Terminbuchung, Arztprofil, FAQ, Patientenbewertungen.",
      pt: "Agendamento online, perfil profissional, FAQ, depoimentos.",
    },
    color: "#14B8A6",
  },
  {
    icon: "🛍",
    thumbIds: ["impact-47", "impact-03", "impact-168"],
    cat: "E-Commerce",
    label: { fr: "Boutique en ligne", en: "Online Store", es: "Tienda Online", de: "Online-Shop", pt: "Loja Online" },
    desc: {
      fr: "Catalogue produits, panier d'achat, paiement Stripe, gestion des stocks.",
      en: "Product catalogue, shopping cart, Stripe payments, inventory.",
      es: "Catálogo de productos, carrito, pago Stripe, gestión de stock.",
      de: "Produktkatalog, Warenkorb, Stripe-Zahlung, Lagerverwaltung.",
      pt: "Catálogo de produtos, carrinho, pagamento Stripe, estoque.",
    },
    color: "#EC4899",
  },
  {
    icon: "🏨",
    thumbIds: ["impact-10", "impact-43", "impact-04"],
    cat: "Hospitality",
    label: { fr: "Hôtel & Hébergement", en: "Hotel & Accommodation", es: "Hotel & Alojamiento", de: "Hotel & Unterkunft", pt: "Hotel & Hospedagem" },
    desc: {
      fr: "Galerie chambres, tarifs, réservation directe, page expériences.",
      en: "Room gallery, rates, direct booking, experiences page.",
      es: "Galería de habitaciones, tarifas, reserva directa, experiencias.",
      de: "Zimmerbilder, Preise, Direktbuchung, Erlebnisseite.",
      pt: "Galeria de quartos, tarifas, reserva direta, página de experiências.",
    },
    color: "#C9A86C",
  },
  {
    icon: "💼",
    thumbIds: ["impact-39", "impact-02", "impact-17"],
    cat: "Services",
    label: { fr: "Coach & Consultant", en: "Coach & Consultant", es: "Coach & Consultor", de: "Coach & Berater", pt: "Coach & Consultor" },
    desc: {
      fr: "Bio, offres de services, témoignages clients, formulaire de contact.",
      en: "Bio, service offers, client testimonials, contact form.",
      es: "Bio, ofertas de servicios, testimonios, formulario de contacto.",
      de: "Biografie, Dienstleistungen, Testimonials, Kontaktformular.",
      pt: "Bio, ofertas de serviços, depoimentos, formulário de contato.",
    },
    color: "#A855F7",
  },
];

const T = {
  fr: {
    badge: "200+ thèmes disponibles",
    title: "Votre site, pour votre métier",
    sub: "Choisissez votre secteur et on vous livre un site professionnel en 2 heures — IA rédige, on déploie.",
    cta: "Commander mon site",
    seethemes: "Voir tous les thèmes",
    examples: "exemples de thèmes",
    delivered: "Livré en 2h · IA rédige",
    bottomTitle: "Prêt à lancer votre site ?",
    bottomSub: "Choisissez un thème, remplissez le formulaire (3 min), on s'occupe du reste.",
    bottomCta: "Commencer — c'est gratuit",
  },
  en: {
    badge: "200+ themes available",
    title: "Your site, built for your business",
    sub: "Choose your industry and get a professional website in 2 hours — AI writes the copy, we deploy.",
    cta: "Order my site",
    seethemes: "Browse all themes",
    examples: "theme examples",
    delivered: "Delivered in 2h · AI writes",
    bottomTitle: "Ready to go live?",
    bottomSub: "Pick a theme, fill the form (3 min), we handle everything else.",
    bottomCta: "Start — it's free",
  },
  es: {
    badge: "200+ temas disponibles",
    title: "Tu sitio, para tu negocio",
    sub: "Elige tu sector y recibe un sitio web profesional en 2 horas — la IA escribe, nosotros desplegamos.",
    cta: "Pedir mi sitio",
    seethemes: "Ver todos los temas",
    examples: "ejemplos de temas",
    delivered: "Entregado en 2h · IA escribe",
    bottomTitle: "¿Listo para lanzar?",
    bottomSub: "Elige un tema, rellena el formulario (3 min), nosotros nos encargamos del resto.",
    bottomCta: "Empezar — es gratis",
  },
  de: {
    badge: "200+ Themes verfügbar",
    title: "Deine Website, für dein Unternehmen",
    sub: "Wähle deine Branche und erhalte eine professionelle Website in 2 Stunden — KI schreibt, wir deployen.",
    cta: "Website bestellen",
    seethemes: "Alle Themes ansehen",
    examples: "Theme-Beispiele",
    delivered: "In 2h geliefert · KI schreibt",
    bottomTitle: "Bereit zum Launch?",
    bottomSub: "Theme wählen, Formular ausfüllen (3 Min), wir kümmern uns um den Rest.",
    bottomCta: "Starten — kostenlos",
  },
  pt: {
    badge: "200+ temas disponíveis",
    title: "O seu site, para o seu negócio",
    sub: "Escolha o seu setor e receba um site profissional em 2 horas — IA escreve, nós fazemos o deploy.",
    cta: "Encomendar o meu site",
    seethemes: "Ver todos os temas",
    examples: "exemplos de temas",
    delivered: "Entregue em 2h · IA escreve",
    bottomTitle: "Pronto para lançar?",
    bottomSub: "Escolha um tema, preencha o formulário (3 min), nós tratamos do resto.",
    bottomCta: "Começar — é grátis",
  },
} as const;

function ThumbStack({ thumbIds, color }: { thumbIds: string[]; color: string }) {
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const visibleIds = thumbIds.filter((id) => !failedIds.has(id));

  if (visibleIds.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}15` }}>
        <Sparkles className="w-8 h-8 text-white/20" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {visibleIds.slice(0, 3).map((id, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={`/thumbnails/${id}.webp`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300"
          style={{
            opacity: i === 0 ? 1 : 0,
            zIndex: visibleIds.length - i,
          }}
          onError={() => setFailedIds((prev) => new Set([...prev, id]))}
        />
      ))}
    </div>
  );
}

function NicheSection({ niche, index }: { niche: typeof NICHES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { locale } = useLang();
  const lk = (locale as keyof typeof niche.label) in niche.label ? (locale as keyof typeof niche.label) : "en";
  const t = T[locale as keyof typeof T] ?? T.fr;
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      {/* Niche header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${niche.color}20`, border: `1px solid ${niche.color}40` }}>
          {niche.icon}
        </div>
        <div>
          <h2 className="text-xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>{niche.label[lk]}</h2>
          <p className="text-sm text-zinc-500">{niche.desc[lk]}</p>
        </div>
        <Link
          href={`/themes?cat=${encodeURIComponent(niche.cat)}`}
          className="ml-auto text-xs font-semibold transition-colors"
          style={{ color: niche.color }}
        >
          {niche.thumbIds.length} {t.examples} →
        </Link>
      </div>

      {/* Template thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {niche.thumbIds.map((thumbId, i) => (
          <Link
            key={thumbId}
            href={`/templates/${thumbId}`}
            className="group relative rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ borderColor: hoveredThumb === i ? `${niche.color}60` : `${niche.color}20` }}
            onMouseEnter={() => setHoveredThumb(i)}
            onMouseLeave={() => setHoveredThumb(null)}
          >
            <div className="relative aspect-video bg-zinc-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/thumbnails/${thumbId}.webp`}
                alt=""
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {/* Badge */}
              {i === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: `${niche.color}25`, color: niche.color, border: `1px solid ${niche.color}40` }}>
                  {t.delivered}
                </div>
              )}
            </div>
            {/* CTA overlay */}
            <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full py-2 px-3 rounded-lg text-xs font-bold text-center text-white"
                style={{ background: `${niche.color}90` }}>
                {t.cta}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function ShowcasePage() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <AeviaHeader />

      <main className="pt-24 pb-32 px-6">
        <div className="mx-auto max-w-5xl">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" />
              {t.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
              {t.title}
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">{t.sub}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/configure"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all hover:scale-105"
              >
                {t.cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/themes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-sm transition-all"
              >
                {t.seethemes}
              </Link>
            </div>
          </motion.div>

          {/* Niches */}
          {NICHES.map((niche, i) => (
            <NicheSection key={niche.cat + niche.icon} niche={niche} index={i} />
          ))}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 p-12 rounded-3xl border border-violet-500/20 bg-violet-600/8"
          >
            <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>{t.bottomTitle}</h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">{t.bottomSub}</p>
            <Link
              href="/configure"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all hover:scale-105 shadow-lg shadow-violet-600/30"
            >
              {t.bottomCta} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
