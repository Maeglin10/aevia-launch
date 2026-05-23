"use client";

import { Check, Zap, Star, Crown, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AeviaHeader } from "@/components/AeviaHeader";
import { LegalFooter } from "@/components/LegalFooter";
import { useLang } from "@/lib/LangContext";

const T = {
  fr: {
    badge: "Tarifs",
    title: "Votre site web professionnel,",
    titleAccent: "au juste prix",
    subtitle: "Pas d'abonnement. Pas de surprise. Vous payez une fois, vous obtenez votre site pour toujours.",
    mostPopular: "Le plus choisi",
    perSite: "paiement unique",
    tiers: [
      {
        name: "Essentiel",
        price: "599",
        desc: "Portfolio, landing page, site vitrine simple. Idéal pour les freelances et créateurs.",
        icon: Zap,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Design sur mesure généré par IA",
          "Rédaction complète par IA (FR/EN)",
          "Déploiement Vercel inclus",
          "SSL + domaine custom prêt",
          "5–7 sections optimisées SEO",
          "Livraison en 2 à 4 heures",
        ],
        cta: "Lancer mon site Essentiel",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Pro",
        price: "899",
        desc: "Restaurant, immobilier, PME, association. Le site qui convertit vos visiteurs en clients.",
        icon: Star,
        color: "border-violet-500",
        bg: "bg-violet-950/30",
        popular: true,
        features: [
          "Tout Essentiel, plus :",
          "10–15 sections avec animations",
          "Formulaire de contact intégré",
          "Blog ou actualités IA-générées",
          "Intégration réseaux sociaux",
          "Analytics Google Tag Manager",
          "Maintenance 3 mois offerte",
        ],
        cta: "Lancer mon site Pro",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        name: "Premium",
        price: "1 499",
        desc: "E-commerce, luxury, 3D interactif. Pour les marques qui veulent impressionner.",
        icon: Crown,
        color: "border-amber-500",
        bg: "bg-amber-950/20",
        features: [
          "Tout Pro, plus :",
          "Boutique e-commerce complète",
          "Effets 3D & animations avancées",
          "Tunnel de conversion optimisé",
          "Intégration paiement (Stripe)",
          "Support prioritaire 6 mois",
          "Révisions illimitées 30 jours",
        ],
        cta: "Lancer mon site Premium",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
      },
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Le paiement est-il vraiment unique ?",
        a: "Oui. Vous payez une fois pour la création et le déploiement de votre site. Le seul coût récurrent possible est l'hébergement Vercel (gratuit jusqu'à un certain trafic) et votre nom de domaine (~10–15€/an).",
      },
      {
        q: "Combien de temps pour recevoir mon site ?",
        a: "L'IA génère votre contenu en 60 secondes. La validation et le déploiement prennent entre 2 et 4 heures ouvrables selon la complexité.",
      },
      {
        q: "Puis-je modifier le site après livraison ?",
        a: "Oui, le code source vous appartient intégralement. Vous pouvez modifier vous-même ou nous confier les mises à jour (devis sur demande).",
      },
      {
        q: "Le site est-il vraiment optimisé SEO ?",
        a: "L'IA structure le contenu avec les meilleures pratiques SEO : balises H1/H2, meta descriptions, vitesse de chargement, sitemap XML et JSON-LD inclus.",
      },
    ],
    ctaBand: "Besoin d'un devis personnalisé ?",
    ctaBandSub: "Projet complexe, multi-pages, intégration spécifique — parlons-en.",
    ctaBandBtn: "Demander un devis",
  },
  en: {
    badge: "Pricing",
    title: "Your professional website,",
    titleAccent: "fairly priced",
    subtitle: "No subscription. No hidden fees. Pay once, own your site forever.",
    mostPopular: "Most popular",
    perSite: "one-time payment",
    tiers: [
      {
        name: "Essential",
        price: "599",
        desc: "Portfolio, landing page, simple showcase. Ideal for freelancers and creators.",
        icon: Zap,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "AI-generated custom design",
          "Full AI copywriting (FR/EN)",
          "Vercel deployment included",
          "SSL + custom domain ready",
          "5–7 SEO-optimized sections",
          "Delivered in 2–4 hours",
        ],
        cta: "Launch my Essential site",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Pro",
        price: "899",
        desc: "Restaurant, real estate, SMB, association. The site that turns visitors into clients.",
        icon: Star,
        color: "border-violet-500",
        bg: "bg-violet-950/30",
        popular: true,
        features: [
          "Everything in Essential, plus:",
          "10–15 sections with animations",
          "Integrated contact form",
          "AI-generated blog / news",
          "Social media integration",
          "Google Tag Manager analytics",
          "3 months free maintenance",
        ],
        cta: "Launch my Pro site",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        name: "Premium",
        price: "1,499",
        desc: "E-commerce, luxury, interactive 3D. For brands that want to impress.",
        icon: Crown,
        color: "border-amber-500",
        bg: "bg-amber-950/20",
        features: [
          "Everything in Pro, plus:",
          "Full e-commerce store",
          "3D effects & advanced animations",
          "Optimized conversion funnel",
          "Payment integration (Stripe)",
          "Priority support 6 months",
          "Unlimited revisions 30 days",
        ],
        cta: "Launch my Premium site",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
      },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is the payment really one-time?",
        a: "Yes. You pay once for the creation and deployment of your site. The only recurring costs are Vercel hosting (free up to a threshold) and your domain name (~€10–15/year).",
      },
      {
        q: "How long to receive my site?",
        a: "AI generates your content in 60 seconds. Validation and deployment take 2–4 business hours depending on complexity.",
      },
      {
        q: "Can I edit the site after delivery?",
        a: "Yes, the source code is entirely yours. You can edit it yourself or ask us for updates (quote on request).",
      },
      {
        q: "Is the site really SEO-optimized?",
        a: "AI structures content following best SEO practices: H1/H2 tags, meta descriptions, loading speed, XML sitemap, and JSON-LD schema included.",
      },
    ],
    ctaBand: "Need a custom quote?",
    ctaBandSub: "Complex project, multi-page, specific integrations — let's talk.",
    ctaBandBtn: "Request a quote",
  },
};

export default function PricingPage() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <AeviaHeader />

      <main id="main-content" className="pt-28 pb-24 px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-6">
            {t.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              {t.titleAccent}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {t.tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative rounded-2xl border-2 p-8 flex flex-col ${tier.color} ${tier.bg}`}
              >
                {"popular" in tier && tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-500 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    {t.mostPopular}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-white/5">
                      <Icon size={18} className="text-violet-400" />
                    </div>
                    <h2 className="text-xl font-bold">{tier.name}</h2>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{tier.desc}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{tier.price}€</span>
                  </div>
                  <span className="text-zinc-500 text-xs">{t.perSite}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/configure?plan=${tier.name.toLowerCase()}`}
                  className={`w-full py-3.5 text-center text-sm font-semibold rounded-xl transition-all ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-2xl font-bold text-center mb-10">{t.faqTitle}</h2>
          <div className="space-y-4">
            {t.faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-white/90 hover:text-white list-none">
                  {faq.q}
                  <span className="text-violet-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>

        {/* CTA band */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/40 to-fuchsia-950/30 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-5 items-start">
            <div className="p-3 rounded-2xl bg-violet-500/15 shrink-0">
              <MessageSquare className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{t.ctaBand}</h3>
              <p className="text-zinc-400 text-sm">{t.ctaBandSub}</p>
            </div>
          </div>
          <a
            href="https://aevia.vercel.app/contact"
            className="whitespace-nowrap px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20"
          >
            {t.ctaBandBtn}
          </a>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
