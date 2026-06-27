import type { SessionData } from './sessions'

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

export function buildLocalBusinessSchema(session: SessionData): Record<string, unknown> {
  const { formData, generatedContent } = session
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

  return schema
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
