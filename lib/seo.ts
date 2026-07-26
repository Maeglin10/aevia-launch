import type { SessionData } from './sessions'
import { sectorGeoFor } from './geo/sectorGeo'

// Maps free-text businessType to the most appropriate schema.org type
const SCHEMA_TYPE_MAP: [RegExp, string][] = [
  [/restaurant|brasserie|bistro|café|pizz|sushi|burger|bar\b|snack|traiteur/i, 'Restaurant'],
  [/hôtel|hotel|hébergement|chambre d'hôtes|gîte|auberge|airbnb/i, 'LodgingBusiness'],
  [/coach|coaching|consultant|conseil|formateur|formation|mentor/i, 'ProfessionalService'],
  [/artisan|plombier|électricien|maçon|menuisier|charpentier|carreleur|peintre en bâtiment/i, 'HomeAndConstructionBusiness'],
  [/médecin|docteur|kiné|kinésithérapeute|dentiste|opticien|pharmacie|infirmier/i, 'MedicalBusiness'],
  [/avocat|notaire|huissier|expert.comptable|comptable|juridique/i, 'LegalService'],
  [/salon de coiffure|coiffeur|esthétique|spa|massag|beauté|onglerie/i, 'BeautySalon'],
  [/immobilier|agence immo|promoteur|syndic|gestion locative/i, 'RealEstateAgent'],
  [/fitness|salle de sport|gym|musculation|yoga|pilates|crossfit/i, 'SportsActivityLocation'],
  [/boutique|e-commerce|commerce|magasin|vente en ligne|shop/i, 'Store'],
  [/agence|studio|creative|design|marketing|communication|digital/i, 'ProfessionalService'],
  [/auto.école|conduite|permis/i, 'DrivingSchool'],
  [/école|académie|cours particuliers|soutien scolaire|tutorat/i, 'EducationalOrganization'],
  [/association|ong|bénévol|non.profit|fondation/i, 'NGO'],
]

function inferSchemaType(businessType: string): string {
  for (const [pattern, type] of SCHEMA_TYPE_MAP) {
    if (pattern.test(businessType)) return type
  }
  return 'LocalBusiness'
}

// Map a free-text day label (FR/EN, full or abbreviated) to the schema.org
// DayOfWeek URL. Returns null for anything we can't confidently map, so a
// malformed row is dropped rather than emitting a wrong day.
const DAY_MAP: [RegExp, string][] = [
  [/^lun|^mon/i, 'https://schema.org/Monday'],
  [/^mar|^tue/i, 'https://schema.org/Tuesday'],
  [/^mer|^wed/i, 'https://schema.org/Wednesday'],
  [/^jeu|^thu/i, 'https://schema.org/Thursday'],
  [/^ven|^fri/i, 'https://schema.org/Friday'],
  [/^sam|^sat/i, 'https://schema.org/Saturday'],
  [/^dim|^sun/i, 'https://schema.org/Sunday'],
]
function schemaDay(day: string): string | null {
  for (const [re, url] of DAY_MAP) if (re.test(day.trim())) return url
  return null
}

export function buildLocalBusinessSchema(session: SessionData): Record<string, unknown> {
  const { formData, generatedContent } = session
  const bp = session.businessProfile
  const schemaType = inferSchemaType(formData.businessType ?? '')

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: formData.businessName,
    description: generatedContent?.metaDescription ?? formData.tagline,
    url: `https://launch.aevia.services/preview/${session.id}`,
  }

  if (formData.city) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: formData.city,
      addressCountry: 'FR',
    }
  }

  if (formData.email) schema.email = formData.email
  if (formData.phone) schema.telephone = formData.phone

  if (formData.instagram) {
    schema.sameAs = [
      `https://instagram.com/${formData.instagram.replace(/^@/, '')}`,
    ]
  }

  if (generatedContent?.services?.length) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: generatedContent.services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Offer',
          name: s.title,
          description: s.description,
        },
      })),
    }
  }

  if (generatedContent?.testimonials?.length) {
    schema.review = generatedContent.testimonials.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
      },
    }))
  }

  // ── Richer GEO signals from the captured businessProfile ──────────────────
  // Structured data is the strongest signal generative engines (ChatGPT,
  // Perplexity, Gemini, Copilot) use to cite a local business. Emit everything
  // we actually captured: logo/image, priceRange, full postal address, service
  // area, opening hours and an aggregate rating.
  if (formData.logoUrl) {
    schema.image = formData.logoUrl
    schema.logo = formData.logoUrl
  }
  if (formData.priceRange) schema.priceRange = formData.priceRange
  if (bp?.paymentMethods?.length) schema.paymentAccepted = bp.paymentMethods.join(', ')

  // Full postal address (street from geo.address when present) overrides the
  // city-only address set earlier.
  const street = bp?.geo?.address
  const city = bp?.geo?.primaryCity || formData.city
  if (street || city) {
    schema.address = {
      '@type': 'PostalAddress',
      ...(street ? { streetAddress: street } : {}),
      ...(city ? { addressLocality: city } : {}),
      addressCountry: 'FR',
    }
  }
  if (bp?.geo?.serviceAreas?.length) {
    schema.areaServed = bp.geo.serviceAreas.map((a) => ({ '@type': 'City', name: a }))
  }

  // Opening hours → openingHoursSpecification (drop rows we can't map / closed).
  if (bp?.openingHours?.length) {
    const specs = bp.openingHours
      .filter((h) => !h.closed && h.open && h.close && schemaDay(h.day))
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: schemaDay(h.day),
        opens: h.open,
        closes: h.close,
      }))
    if (specs.length) schema.openingHoursSpecification = specs
  }

  // Aggregate rating: prefer a real review source with a count, else derive
  // from the featured/testimonial ratings we already display.
  const src = bp?.reputation?.sources?.find((s) => s.rating && s.reviewCount)
  if (src) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: src.rating,
      reviewCount: src.reviewCount,
      bestRating: 5,
    }
  } else {
    const ratings = [
      ...(bp?.reputation?.featuredReviews ?? []).map((r) => r.rating),
      ...(generatedContent?.testimonials ?? []).map((t) => t.rating),
    ].filter((n): n is number => typeof n === 'number' && n > 0)
    if (ratings.length >= 2) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: Math.round(avg * 10) / 10,
        reviewCount: ratings.length,
        bestRating: 5,
      }
    }
  }

  // Sector keywords (pre-loaded per business type) merged with any the client
  // typed — a further GEO signal that is populated the moment a niche is picked.
  const geo = sectorGeoFor(bp?.niche)
  const clientKeywords = (formData.businessType ?? '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const keywords = Array.from(new Set([...clientKeywords, ...geo.keywords]))
  if (keywords.length) schema.keywords = keywords.join(', ')

  return schema
}

/**
 * FAQPage JSON-LD for a session — one of the strongest GEO signals. Uses the
 * client's own FAQ when captured (businessProfile.faq), otherwise the sector
 * default so the page is answer-rich the moment a niche is chosen. Returns null
 * only if there is genuinely nothing to emit.
 */
export function buildFaqSchemaForSession(
  session: SessionData,
): Record<string, unknown> | null {
  const clientFaq = session.businessProfile?.faq
    ?.filter((f) => f.q && f.a)
    .map((f) => ({ question: f.q, answer: f.a }))
  const sectorFaq = sectorGeoFor(session.businessProfile?.niche).faq.map((f) => ({
    question: f.q,
    answer: f.a,
  }))
  const faqs = clientFaq && clientFaq.length ? clientFaq : sectorFaq
  return faqs.length ? buildFaqSchema(faqs) : null
}

export function buildFaqSchema(
  faqs: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
