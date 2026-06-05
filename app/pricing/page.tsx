"use client";

import { Check, Rocket, Zap, Star, Crown, MessageSquare } from "lucide-react";
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
        name: "Landing",
        price: "399",
        desc: "Une page unique, percutante. Parfaite pour valider une idée ou lancer un produit rapidement.",
        icon: Rocket,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Landing page une page",
          "Design responsive premium",
          "SEO de base",
          "Formulaire de contact",
          "Mise en ligne incluse",
        ],
        cta: "Lancer ma Landing",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Essentiel",
        price: "599",
        desc: "Portfolio ou site vitrine simple. Idéal pour les freelances et créateurs.",
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
        name: "Landing",
        price: "399",
        desc: "A single, high-impact page. Perfect to validate an idea or launch a product fast.",
        icon: Rocket,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "One-page landing site",
          "Premium responsive design",
          "Basic SEO",
          "Contact form",
          "Go-live included",
        ],
        cta: "Launch my Landing",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Essential",
        price: "599",
        desc: "Portfolio or simple showcase site. Ideal for freelancers and creators.",
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
  es: {
    badge: "Tarifas",
    title: "Tu sitio web profesional,",
    titleAccent: "al precio justo",
    subtitle: "Sin suscripción. Sin sorpresas. Pagas una vez y tu sitio es tuyo para siempre.",
    mostPopular: "Más elegido",
    perSite: "pago único",
    tiers: [
      {
        name: "Landing",
        price: "399",
        desc: "Una sola página de alto impacto. Perfecta para validar una idea o lanzar un producto rápido.",
        icon: Rocket,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Landing page de una página",
          "Diseño responsive premium",
          "SEO básico",
          "Formulario de contacto",
          "Publicación incluida",
        ],
        cta: "Lanzar mi Landing",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Esencial",
        price: "599",
        desc: "Portafolio o sitio escaparate simple. Ideal para freelancers y creadores.",
        icon: Zap,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Diseño personalizado generado por IA",
          "Redacción completa por IA (ES/EN)",
          "Despliegue en Vercel incluido",
          "SSL + dominio personalizado listo",
          "5–7 secciones optimizadas para SEO",
          "Entregado en 2 a 4 horas",
        ],
        cta: "Lanzar mi sitio Esencial",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Pro",
        price: "899",
        desc: "Restaurante, inmobiliaria, pyme, asociación. El sitio que convierte visitantes en clientes.",
        icon: Star,
        color: "border-violet-500",
        bg: "bg-violet-950/30",
        popular: true,
        features: [
          "Todo lo de Esencial, más:",
          "10–15 secciones con animaciones",
          "Formulario de contacto integrado",
          "Blog o noticias generadas por IA",
          "Integración de redes sociales",
          "Analítica con Google Tag Manager",
          "3 meses de mantenimiento gratis",
        ],
        cta: "Lanzar mi sitio Pro",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        name: "Premium",
        price: "1 499",
        desc: "E-commerce, lujo, 3D interactivo. Para marcas que quieren impresionar.",
        icon: Crown,
        color: "border-amber-500",
        bg: "bg-amber-950/20",
        features: [
          "Todo lo de Pro, más:",
          "Tienda e-commerce completa",
          "Efectos 3D y animaciones avanzadas",
          "Embudo de conversión optimizado",
          "Integración de pago (Stripe)",
          "Soporte prioritario 6 meses",
          "Revisiones ilimitadas 30 días",
        ],
        cta: "Lanzar mi sitio Premium",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿El pago es realmente único?",
        a: "Sí. Pagas una vez por la creación y despliegue de tu sitio. Los únicos costes recurrentes son el hosting en Vercel (gratis hasta cierto tráfico) y tu dominio (~10–15€/año).",
      },
      {
        q: "¿Cuánto tarda en entregarse mi sitio?",
        a: "La IA genera tu contenido en 60 segundos. La validación y el despliegue toman entre 2 y 4 horas laborables según la complejidad.",
      },
      {
        q: "¿Puedo editar el sitio tras la entrega?",
        a: "Sí, el código fuente es tuyo en su totalidad. Puedes editarlo tú mismo o pedirnos actualizaciones (presupuesto a petición).",
      },
      {
        q: "¿Está realmente optimizado para SEO?",
        a: "La IA estructura el contenido siguiendo las mejores prácticas SEO: etiquetas H1/H2, meta descripciones, velocidad de carga, sitemap XML y schema JSON-LD incluidos.",
      },
    ],
    ctaBand: "¿Necesitas un presupuesto a medida?",
    ctaBandSub: "Proyecto complejo, multi-página, integraciones específicas — hablemos.",
    ctaBandBtn: "Pedir presupuesto",
  },
  de: {
    badge: "Preise",
    title: "Deine professionelle Website,",
    titleAccent: "fair bepreist",
    subtitle: "Kein Abo. Keine versteckten Kosten. Einmal bezahlen, Website für immer behalten.",
    mostPopular: "Am meisten gewählt",
    perSite: "Einmalzahlung",
    tiers: [
      {
        name: "Landing",
        price: "399",
        desc: "Eine einzige, wirkungsstarke Seite. Perfekt, um eine Idee zu testen oder ein Produkt schnell zu launchen.",
        icon: Rocket,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Einseitige Landing Page",
          "Premium-Responsive-Design",
          "Basis-SEO",
          "Kontaktformular",
          "Veröffentlichung inklusive",
        ],
        cta: "Landing starten",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Essenziell",
        price: "599",
        desc: "Portfolio oder einfache Visitenseite. Ideal für Freelancer und Kreative.",
        icon: Zap,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Individuelles, KI-generiertes Design",
          "Vollständige KI-Texte (DE/EN)",
          "Vercel-Deployment inklusive",
          "SSL + eigene Domain bereit",
          "5–7 SEO-optimierte Sektionen",
          "Lieferung in 2–4 Stunden",
        ],
        cta: "Essenziell-Website starten",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Pro",
        price: "899",
        desc: "Restaurant, Immobilien, KMU, Verein. Die Website, die Besucher zu Kunden macht.",
        icon: Star,
        color: "border-violet-500",
        bg: "bg-violet-950/30",
        popular: true,
        features: [
          "Alles aus Essenziell, plus:",
          "10–15 Sektionen mit Animationen",
          "Integriertes Kontaktformular",
          "KI-generierter Blog / News",
          "Social-Media-Integration",
          "Analytics mit Google Tag Manager",
          "3 Monate Wartung gratis",
        ],
        cta: "Pro-Website starten",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        name: "Premium",
        price: "1 499",
        desc: "E-Commerce, Luxus, interaktives 3D. Für Marken, die beeindrucken wollen.",
        icon: Crown,
        color: "border-amber-500",
        bg: "bg-amber-950/20",
        features: [
          "Alles aus Pro, plus:",
          "Vollwertiger E-Commerce-Shop",
          "3D-Effekte und Premium-Animationen",
          "Optimierter Conversion-Funnel",
          "Zahlungsintegration (Stripe)",
          "Prioritäts-Support 6 Monate",
          "Unbegrenzte Revisionen 30 Tage",
        ],
        cta: "Premium-Website starten",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
      },
    ],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      {
        q: "Ist die Zahlung wirklich einmalig?",
        a: "Ja. Du zahlst einmal für die Erstellung und das Deployment deiner Website. Die einzigen wiederkehrenden Kosten sind das Vercel-Hosting (bis zu einem Schwellenwert kostenlos) und deine Domain (~10–15 €/Jahr).",
      },
      {
        q: "Wie lange dauert es bis zur Auslieferung?",
        a: "Die KI generiert deinen Inhalt in 60 Sekunden. Validierung und Deployment dauern je nach Komplexität 2 bis 4 Geschäftsstunden.",
      },
      {
        q: "Kann ich die Website nach der Lieferung bearbeiten?",
        a: "Ja, der Quellcode gehört vollständig dir. Du kannst ihn selbst bearbeiten oder uns Updates anvertrauen (Angebot auf Anfrage).",
      },
      {
        q: "Ist die Website wirklich SEO-optimiert?",
        a: "Die KI strukturiert die Inhalte nach den besten SEO-Praktiken: H1/H2-Tags, Meta-Beschreibungen, Ladegeschwindigkeit, XML-Sitemap und JSON-LD-Schema inklusive.",
      },
    ],
    ctaBand: "Brauchst du ein individuelles Angebot?",
    ctaBandSub: "Komplexes Projekt, mehrseitig, spezifische Integrationen — sprich uns an.",
    ctaBandBtn: "Angebot anfragen",
  },
  pt: {
    badge: "Preços",
    title: "Seu site profissional,",
    titleAccent: "ao preço justo",
    subtitle: "Sem assinatura. Sem surpresas. Pague uma vez e seu site é seu para sempre.",
    mostPopular: "Mais escolhido",
    perSite: "pagamento único",
    tiers: [
      {
        name: "Landing",
        price: "399",
        desc: "Uma única página de alto impacto. Perfeita para validar uma ideia ou lançar um produto rápido.",
        icon: Rocket,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Landing page de uma página",
          "Design responsivo premium",
          "SEO básico",
          "Formulário de contato",
          "Publicação incluída",
        ],
        cta: "Lançar minha Landing",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Essencial",
        price: "599",
        desc: "Portfólio ou site institucional simples. Ideal para freelancers e criadores.",
        icon: Zap,
        color: "border-zinc-700",
        bg: "bg-zinc-900/40",
        features: [
          "Design personalizado gerado por IA",
          "Redação completa por IA (PT/EN)",
          "Deploy no Vercel incluído",
          "SSL + domínio personalizado pronto",
          "5–7 seções otimizadas para SEO",
          "Entregue em 2 a 4 horas",
        ],
        cta: "Lançar meu site Essencial",
        ctaStyle: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
      },
      {
        name: "Pro",
        price: "899",
        desc: "Restaurante, imobiliária, PME, associação. O site que transforma visitantes em clientes.",
        icon: Star,
        color: "border-violet-500",
        bg: "bg-violet-950/30",
        popular: true,
        features: [
          "Tudo do Essencial, mais:",
          "10–15 seções com animações",
          "Formulário de contato integrado",
          "Blog ou notícias geradas por IA",
          "Integração de redes sociais",
          "Analytics com Google Tag Manager",
          "3 meses de manutenção grátis",
        ],
        cta: "Lançar meu site Pro",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        name: "Premium",
        price: "1 499",
        desc: "E-commerce, luxo, 3D interativo. Para marcas que querem impressionar.",
        icon: Crown,
        color: "border-amber-500",
        bg: "bg-amber-950/20",
        features: [
          "Tudo do Pro, mais:",
          "Loja e-commerce completa",
          "Efeitos 3D e animações avançadas",
          "Funil de conversão otimizado",
          "Integração de pagamento (Stripe)",
          "Suporte prioritário 6 meses",
          "Revisões ilimitadas 30 dias",
        ],
        cta: "Lançar meu site Premium",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
      },
    ],
    faqTitle: "Perguntas frequentes",
    faqs: [
      {
        q: "O pagamento é realmente único?",
        a: "Sim. Você paga uma vez pela criação e deploy do seu site. Os únicos custos recorrentes são o hosting na Vercel (gratuito até certo tráfego) e seu domínio (~10–15€/ano).",
      },
      {
        q: "Quanto tempo demora para receber meu site?",
        a: "A IA gera seu conteúdo em 60 segundos. A validação e o deploy levam de 2 a 4 horas úteis dependendo da complexidade.",
      },
      {
        q: "Posso editar o site após a entrega?",
        a: "Sim, o código-fonte é totalmente seu. Você pode editar você mesmo ou nos confiar as atualizações (orçamento sob consulta).",
      },
      {
        q: "O site é realmente otimizado para SEO?",
        a: "A IA estrutura o conteúdo com as melhores práticas de SEO: tags H1/H2, meta descrições, velocidade de carregamento, sitemap XML e schema JSON-LD incluídos.",
      },
    ],
    ctaBand: "Precisa de um orçamento personalizado?",
    ctaBandSub: "Projeto complexo, multi-página, integrações específicas — vamos conversar.",
    ctaBandBtn: "Solicitar orçamento",
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
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              {t.titleAccent}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
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
