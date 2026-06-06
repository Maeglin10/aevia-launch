// @ts-nocheck
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { TemplateIcon } from '@/components/TemplateIcon';
import { PartyPopper } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#0e0a08',
  bgAlt:        '#13100c',
  bgCard:       '#1a1510',
  accent:       '#d4601a',
  accentLight:  '#f08040',
  gold:         '#c9993a',
  goldLight:    '#e8b850',
  text:         '#f0e8da',
  textMuted:    '#9e9080',
  border:       'rgba(212,96,26,0.18)',
  borderLight:  'rgba(240,232,218,0.07)',
  white:        '#ffffff',
  overlay:      'rgba(14,10,8,0.85)',
  glassHero:    'rgba(14,10,8,0.55)',
  cardShadow:   '0 8px 40px rgba(0,0,0,0.6)',
  glowAccent:   '0 0 30px rgba(212,96,26,0.35)',
  glowGold:     '0 0 24px rgba(201,153,58,0.3)',
};

// ─── Products Data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    brand: 'Invicta',
    name: 'Prélude 8kW — Acier Noir',
    shortName: 'Invicta Prélude',
    type: 'Poêle à bois',
    price: 1290,
    priceOld: 1490,
    kw: 8,
    surface: '90 m²',
    rating: 4.8,
    reviews: 127,
    label: 'Flamme Verte 7★',
    tag: 'Bestseller',
    emoji: '🔥',
    certEco: true,
  },
  {
    id: 2,
    brand: 'MCZ',
    name: 'Musa Comfort 11kW — Pellet',
    shortName: 'MCZ Musa 11kW',
    type: 'Poêle à granulés',
    price: 2490,
    priceOld: 2790,
    kw: 11,
    surface: '120 m²',
    rating: 4.9,
    reviews: 89,
    label: 'Classe A++',
    tag: 'Nouveau',
    emoji: '✨',
    certEco: true,
  },
  {
    id: 3,
    brand: 'Godin',
    name: 'Fonte Noire 7kW — Traditionnel',
    shortName: 'Godin Fonte Noire',
    type: 'Poêle à bois',
    price: 890,
    priceOld: 990,
    kw: 7,
    surface: '75 m²',
    rating: 4.6,
    reviews: 214,
    label: 'Flamme Verte 5★',
    tag: 'Promo',
    emoji: '🌿',
    certEco: true,
  },
  {
    id: 4,
    brand: 'Stuv',
    name: '16-78 Insert Design',
    shortName: 'Stuv 16 Insert',
    type: 'Insert cheminée',
    price: 3200,
    priceOld: null,
    kw: 12,
    surface: '140 m²',
    rating: 4.9,
    reviews: 52,
    label: 'Haut de gamme',
    tag: 'Premium',
    emoji: '💎',
    certEco: true,
  },
  {
    id: 5,
    brand: 'Edilkamin',
    name: 'Ecomonobloc 10kW — Pellet',
    shortName: 'Edilkamin Eco',
    type: 'Poêle à granulés',
    price: 2890,
    priceOld: 3100,
    kw: 10,
    surface: '110 m²',
    rating: 4.7,
    reviews: 73,
    label: 'Classe A+',
    tag: '',
    emoji: '⚡',
    certEco: true,
  },
  {
    id: 6,
    brand: 'Planika',
    name: 'Pure Flame 3 — Éthanol',
    shortName: 'Planika Pure Flame',
    type: 'Cheminée éthanol',
    price: 680,
    priceOld: null,
    kw: null,
    surface: 'Décoratif',
    rating: 4.5,
    reviews: 168,
    label: 'Design contemporain',
    tag: 'Coup de cœur',
    emoji: '🏠',
    certEco: false,
  },
];

const FEATURED = [
  { id: 101, name: 'MCZ Musa 11kW', type: 'Poêle à granulés', price: 2490, emoji: '✨', label: 'Classe A++', desc: 'Pellet ultra-silencieux, connexion Wi-Fi, programmable à distance.' },
  { id: 102, name: 'Invicta Prélude 8kW', type: 'Poêle à bois', price: 1290, emoji: '🔥', label: 'Flamme Verte 7★', desc: 'Design acier épuré, combustion optimisée, rendement 85 %.' },
  { id: 103, name: 'Stuv 16 Insert', type: 'Insert cheminée', price: 3200, emoji: '💎', label: 'Haut de gamme', desc: 'Façade vitrocéramique panoramique, habillage acier inoxydable.' },
];

const CATEGORIES = [
  { id: 1, label: 'Poêles à bois', count: 48, emoji: '🪵', desc: 'Chaleur naturelle & authenticité' },
  { id: 2, label: 'Poêles à granulés', count: 32, emoji: '🌾', desc: 'Confort moderne & économies' },
  { id: 3, label: 'Cheminées & Inserts', count: 24, emoji: '🏛️', desc: 'Élégance & tradition française' },
  { id: 4, label: 'Accessoires', count: 120, emoji: '🛠️', desc: 'Entretien & décoration' },
];

const USPS = [
  { icon: '🚚', title: 'Livraison 48h', desc: 'Livraison express en France métropolitaine sous 48 heures ouvrées. Suivi en temps réel inclus.' },
  { icon: '🔧', title: 'Installation incluse', desc: 'Option installation par nos techniciens certifiés RGE. Devis gratuit sous 24h.' },
  { icon: '🌿', title: 'Certifiés Flamme Verte', desc: 'Tous nos appareils respectent les normes Flamme Verte & Écoconception 2022.' },
  { icon: '🛡️', title: 'SAV 5 ans', desc: 'Garantie constructeur jusqu\'à 5 ans. Service après-vente basé en France, réactif et humain.' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Isabelle M.', city: 'Lyon', product: 'Invicta Prélude 8kW', rating: 5, text: 'Magnifique poêle, installation parfaite. Livré en 2 jours, service impeccable. Après 3 mois d\'utilisation, notre maison est toujours à la bonne température.', verified: true, date: 'Janvier 2025' },
  { id: 2, name: 'Thomas D.', city: 'Bordeaux', product: 'MCZ Musa 11kW', rating: 5, text: 'Le granulés MCZ Musa est silencieux, efficace et l\'application mobile est bluffante. On programme la chauffe depuis le lit ! Qualité premium à prix justifié.', verified: true, date: 'Février 2025' },
  { id: 3, name: 'Claire & Paul R.', city: 'Strasbourg', product: 'Stuv 16 Insert', rating: 5, text: 'Cet insert a transformé notre salon. Le flamme est spectaculaire derrière la vitre panoramique. L\'équipe Flamme & Co nous a très bien conseillés.', verified: true, date: 'Décembre 2024' },
  { id: 4, name: 'Marc-Antoine B.', city: 'Toulouse', product: 'Godin Fonte Noire', rating: 4, text: 'Très bon rapport qualité-prix. Le design fonte classique s\'adapte parfaitement à notre maison de campagne. Chauffe vite et longtemps.', verified: true, date: 'Novembre 2024' },
  { id: 5, name: 'Sophie V.', city: 'Nantes', product: 'Edilkamin Eco 10kW', rating: 5, text: 'Edilkamin m\'a bluffée par son rendement. La qualité de fabrication italienne est au rendez-vous. Flamme & Co a été très réactif pour le SAV lors d\'une petite question technique.', verified: true, date: 'Mars 2025' },
  { id: 6, name: 'Laurent P.', city: 'Marseille', product: 'Planika Pure Flame 3', rating: 4, text: 'Décoratif et élégant, ce brûleur éthanol est parfait pour notre terrasse. La flamme est réelle et hypnotique. Livraison rapide, emballage soigné.', verified: true, date: 'Avril 2025' },
];

const EXTRA_TESTIMONIALS = [
  { id: 7, name: 'Héloïse G.', city: 'Rennes', product: 'MCZ Musa 11kW', rating: 5, text: 'J\'hésite pendant des semaines, et finalement Flamme & Co m\'a convaincue avec un conseil personnalisé. Le poêle à granulés MCZ est parfait pour notre maison de 110 m².' , verified: true, date: 'Mars 2025' },
  { id: 8, name: 'Benoît L.', city: 'Grenoble', product: 'Invicta Prélude 8kW', rating: 5, text: 'Parfait pour nos hivers montagnards ! Très content de mon achat. Le rendement est au top, et l\'équipe Flamme & Co était disponible pour répondre à toutes mes questions.', verified: true, date: 'Octobre 2024' },
];

const FAQS = [
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Nous livrons en 48h ouvrées en France métropolitaine pour la majorité de nos produits en stock. Pour les commandes sur mesure ou les produits en précommande, comptez 2 à 3 semaines. Un email de suivi vous est envoyé dès l\'expédition.'
  },
  {
    q: 'Proposez-vous un service d\'installation ?',
    a: 'Oui ! Nous proposons une option installation par nos techniciens certifiés RGE. Le devis est gratuit et sans engagement. Nos installateurs interviennent dans toute la France métropolitaine. L\'installation comprend la pose, le raccordement au conduit de fumée, et la mise en service.'
  },
  {
    q: 'Quelle est la différence entre un poêle à bois et un poêle à granulés ?',
    a: 'Le poêle à bois fonctionne avec des bûches et offre une chaleur naturelle et authentique. Il ne nécessite pas d\'électricité pour fonctionner. Le poêle à granulés (pellets) est plus automatisé, programmable et souvent plus économique en combustible. Il nécessite une alimentation électrique mais offre un confort de gestion supérieur.'
  },
  {
    q: 'Quelles aides financières puis-je obtenir ?',
    a: 'En France, vous pouvez bénéficier de MaPrimeRénov\' (jusqu\'à 2 500€ selon vos revenus), de l\'éco-prêt à taux zéro, et de la TVA réduite à 5,5 % pour les poêles labellisés Flamme Verte. Notre équipe vous aide à monter votre dossier d\'aides gratuitement.'
  },
  {
    q: 'Comment choisir la puissance de mon poêle ?',
    a: 'En règle générale, comptez environ 1 kW pour 10 m² bien isolés. Pour une maison de 80 m², un poêle de 8 kW sera adapté. Pour les maisons mal isolées ou les régions froides, prévoyez 1 kW pour 7-8 m². Notre configurateur en ligne vous aide à trouver la puissance idéale.'
  },
  {
    q: 'Puis-je retourner un produit si je ne suis pas satisfait ?',
    a: 'Conformément à la loi française, vous disposez de 14 jours de rétractation à compter de la livraison. Le produit doit être retourné dans son emballage d\'origine et non installé. Pour les appareils déjà posés, nous étudions chaque situation au cas par cas. Contactez notre service client au 01 23 45 67 89.'
  },
  {
    q: 'Les appareils Flamme Verte ouvrent-ils droit à des crédits d\'impôt ?',
    a: 'Oui ! Les appareils labellisés Flamme Verte 5 étoiles et plus ouvrent droit à MaPrimeRénov\'. Pour la campagne 2025, les montants d\'aide peuvent atteindre 2 000 à 3 000€ selon votre tranche de revenu et le type d\'appareil. Nous vous fournirons tous les documents nécessaires à votre demande.'
  },
];

// ─── Multi-page navigation config ───────────────────────────────────────────
// PATTERN (reused across impact themes): a single `page` state drives in-page
// navigation. NAV_PAGES maps the route key -> nav label. The existing single-page
// content renders verbatim under page === "home"; every other key renders a
// theme-native sub-page built from the same `C` tokens, fonts (Playfair + Inter)
// and section/card styling. Nav, footer and cart stay mounted across all pages.
type FlammePage = 'home' | 'boutique' | 'blog' | 'about' | 'contact' | 'cgv' | 'mentions';

const NAV_PAGES: { key: FlammePage; label: string }[] = [
  { key: 'home',     label: 'Accueil' },
  { key: 'boutique', label: 'Boutique' },
  { key: 'blog',     label: 'Blog' },
  { key: 'about',    label: 'À propos' },
  { key: 'contact',  label: 'Contact' },
  { key: 'cgv',      label: 'CGV' },
  { key: 'mentions', label: 'Mentions' },
];

// ─── Blog mock data (FR — chauffage / poêles) ─────────────────────────────────
const BLOG_POSTS = [
  {
    slug: 'bois-ou-granules',
    title: 'Poêle à bois ou à granulés : lequel choisir ?',
    date: '14 mai 2025',
    category: 'Guide d\'achat',
    emoji: '🔥',
    excerpt:
      'Bûches authentiques ou pellets automatisés ? On compare rendement, confort d\'usage, coût du combustible et entretien pour vous aider à trancher.',
    body: [
      'Le poêle à bois séduit par la chaleur naturelle et le crépitement des bûches. Il ne nécessite aucune électricité, fonctionne en cas de coupure de courant et offre un rendement de 75 à 85 % sur les modèles labellisés Flamme Verte. En contrepartie, il demande un rechargement manuel toutes les heures ou deux et un stockage de bois conséquent.',
      'Le poêle à granulés, lui, mise sur l\'automatisation : réservoir de pellets, allumage programmé, régulation par sonde et pilotage Wi-Fi sur les modèles récents comme le MCZ Musa. Son rendement dépasse souvent 90 %, et le combustible est plus dense et plus facile à stocker. Il requiert toutefois une alimentation électrique et un entretien régulier du brûleur.',
      'Notre conseil : privilégiez le bois si vous recherchez l\'ambiance et l\'autonomie énergétique, et le granulés si le confort de gestion et la programmation priment. Dans les deux cas, notre configurateur en ligne calcule la puissance idéale selon votre surface.',
    ],
  },
  {
    slug: 'aides-2025',
    title: 'MaPrimeRénov\' 2025 : toutes les aides pour votre poêle',
    date: '2 mai 2025',
    category: 'Financement',
    emoji: '🌿',
    excerpt:
      'MaPrimeRénov\', éco-PTZ, TVA à 5,5 % : le point complet sur les dispositifs qui peuvent réduire la facture de plusieurs milliers d\'euros.',
    body: [
      'En 2025, l\'installation d\'un appareil de chauffage au bois labellisé Flamme Verte 5 étoiles et plus ouvre droit à MaPrimeRénov\'. Le montant varie de 1 000 à 3 000 € selon votre tranche de revenus et le type d\'appareil installé.',
      'À cela s\'ajoute l\'éco-prêt à taux zéro, qui permet de financer le reste à charge sans intérêt, ainsi qu\'une TVA réduite à 5,5 % appliquée directement sur la fourniture et la pose par un professionnel certifié RGE.',
      'Nos conseillers montent gratuitement votre dossier d\'aides et vous fournissent l\'ensemble des justificatifs (facture détaillée, attestation RGE, fiche technique). De quoi alléger sensiblement votre investissement.',
    ],
  },
  {
    slug: 'puissance-poele',
    title: 'Bien dimensionner la puissance de son poêle',
    date: '21 avril 2025',
    category: 'Conseils',
    emoji: '⚡',
    excerpt:
      'Un poêle surdimensionné encrasse, un poêle sous-dimensionné peine à chauffer. Voici la méthode pour calculer les kW dont vous avez réellement besoin.',
    body: [
      'La règle de base consiste à compter environ 1 kW pour 10 m² dans un logement bien isolé et avec une hauteur sous plafond standard de 2,5 m. Pour une maison de 80 m², un poêle de 8 kW comme l\'Invicta Prélude sera parfaitement adapté.',
      'Dans une habitation mal isolée ou située en région froide, on resserre le ratio à 1 kW pour 7 à 8 m². À l\'inverse, dans un logement BBC très performant, un appareil légèrement moins puissant suffit et évite la surchauffe.',
      'Attention au surdimensionnement : un poêle trop puissant tourne au ralenti, encrasse la vitre et le conduit, et perd en rendement. Mieux vaut un appareil correctement calibré, quitte à le faire fonctionner à pleine charge.',
    ],
  },
  {
    slug: 'entretien-hivernal',
    title: 'Entretien : préparer son poêle pour l\'hiver',
    date: '8 avril 2025',
    category: 'Entretien',
    emoji: '🛠️',
    excerpt:
      'Ramonage, joints, vitre, conduit : la check-list complète pour repartir sur une saison de chauffe sereine et performante.',
    body: [
      'Le ramonage du conduit est obligatoire au moins une fois par an, et deux fois pour les appareils à bois selon les communes. Faites-le réaliser par un professionnel qui vous remettra un certificat indispensable pour votre assurance.',
      'Vérifiez ensuite l\'état des joints de porte et de vitre : un joint durci ou écrasé laisse entrer de l\'air parasite et dégrade la combustion. Leur remplacement est simple et peu coûteux. Nettoyez la vitre avec un produit adapté ou de la cendre humide.',
      'Pour les poêles à granulés, aspirez le creuset, videz le bac à cendres et contrôlez la vis sans fin et le ventilateur. Un appareil bien entretenu consomme moins, chauffe mieux et dure beaucoup plus longtemps.',
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return n.toLocaleString('fr-FR') + ' €';
}

function Stars({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <span style={{ color: C.goldLight, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function TagBadge({ tag }: { tag: string }) {
  if (!tag) return null;
  const colors: Record<string, string> = {
    Bestseller:    C.accent,
    Nouveau:       '#2a7a4f',
    Promo:         '#8b2020',
    Premium:       C.gold,
    'Coup de cœur': '#7a2a7a',
  };
  return (
    <span style={{
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
      background: colors[tag] ?? C.accent,
      color: C.white,
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '0.2rem 0.55rem',
      borderRadius: '4px',
      fontFamily: 'Inter, sans-serif',
      zIndex: 2,
    }}>
      {tag}
    </span>
  );
}

// ─── Ember Particle ────────────────────────────────────────────────────────────
function Ember({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${x}%`,
        width:  size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.accentLight}, ${C.gold})`,
        boxShadow: `0 0 ${size * 2}px ${C.accent}`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      initial={{ y: 0, opacity: 0, scale: 0.3 }}
      animate={{
        y:       [0, -(220 + Math.random() * 260)],
        opacity: [0, 0.9, 0.6, 0],
        scale:   [0.3, 1, 0.7, 0],
        x:       [0, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration: 3.2 + Math.random() * 2,
        repeat:   Infinity,
        delay:    delay,
        ease:     'easeOut',
      }}
    />
  );
}

// ─── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard({
  p,
  i,
  onAddToCart,
}: {
  p: typeof FEATURED[number];
  i: number;
  onAddToCart: (item: { id: number; name: string; price: number; emoji: string }) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.12 + 0.2, duration: 0.6, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${C.bgCard}, #201810)`
          : C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: '16px',
        padding: '2rem 1.75rem',
        cursor: 'pointer',
        transition: 'all 0.35s ease',
        boxShadow: hovered ? C.glowAccent : C.cardShadow,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* glow strip */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        }}
      />
      <div style={{ marginBottom: '0.75rem' }}><TemplateIcon emoji={p.emoji} size={40} /></div>
      <p style={{ color: C.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{p.type}</p>
      <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{p.name}</h3>
      <p style={{ color: C.textMuted, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700 }}>
          {fmt(p.price)}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAddToCart({ id: p.id, name: p.name, price: p.price, emoji: p.emoji })}
          style={{
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: C.white,
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontSize: '0.8rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Ajouter au panier
        </motion.button>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <span style={{
          background: `${C.accent}22`,
          color: C.accentLight,
          fontSize: '0.7rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          border: `1px solid ${C.border}`,
        }}>
          {p.label}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({ c, i }: { c: typeof CATEGORIES[number]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${C.bgCard}, #211610)`
          : C.bgCard,
        border: `1px solid ${hovered ? C.accentLight : C.borderLight}`,
        borderRadius: '20px',
        padding: '2.25rem 1.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 0 35px rgba(212,96,26,0.25)` : 'none',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '1rem' }}
      >
        <TemplateIcon emoji={c.emoji} size={45} />
      </motion.div>
      <h3 style={{
        color: C.text,
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: '0.35rem',
      }}>
        {c.label}
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}>
        {c.desc}
      </p>
      <span style={{ color: C.accentLight, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        {c.count} produits →
      </span>
    </motion.div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  p,
  i,
  onAddToCart,
}: {
  p: typeof PRODUCTS[number];
  i: number;
  onAddToCart: (item: { id: number; name: string; price: number; emoji: string }) => void;
}) {
  const [liked,   setLiked]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const [adding,  setAdding]  = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const handleAddToCart = useCallback(() => {
    setAdding(true);
    onAddToCart({ id: p.id, name: p.name, price: p.price, emoji: p.emoji });
    setTimeout(() => setAdding(false), 1200);
  }, [p, onAddToCart]);

  const discount = p.priceOld ? Math.round((1 - p.price / p.priceOld) * 100) : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(160deg, ${C.bgCard}, #1f1610)`
          : C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.borderLight}`,
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.32s ease',
        boxShadow: hovered ? C.glowAccent : C.cardShadow,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Product image placeholder */}
      <div style={{
        background: `linear-gradient(145deg, #1e1208, #2a1a0a)`,
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
          style={{}}
        >
          <TemplateIcon emoji={p.emoji} size={80} />
        </motion.div>
        <TagBadge tag={p.tag} />
        {discount && (
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: '#8b2020',
            color: C.white,
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontFamily: 'Inter, sans-serif',
          }}>
            -{discount}%
          </span>
        )}
        {/* like button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            background: liked ? `${C.accent}` : 'rgba(0,0,0,0.5)',
            border: `1px solid ${liked ? C.accent : C.borderLight}`,
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
        >
          <TemplateIcon emoji={liked ? '❤️' : '🤍'} size={14} />
        </motion.button>
        {/* eco badge */}
        {p.certEco && (
          <span style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            background: 'rgba(42,122,79,0.85)',
            color: '#9affc3',
            fontSize: '0.6rem',
            fontWeight: 700,
            padding: '0.18rem 0.45rem',
            borderRadius: '4px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.06em',
          }}>
            Éco-cert.
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ color: C.accentLight, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</span>
          <span style={{ color: C.textMuted, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif' }}>·</span>
          <span style={{ color: C.textMuted, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>{p.type}</span>
        </div>

        <h3 style={{
          color: C.text,
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: 1.35,
        }}>
          {p.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Stars rating={p.rating} />
          <span style={{ color: C.textMuted, fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>
            {p.rating} ({p.reviews} avis)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          {p.kw && (
            <span style={{ color: C.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
              {p.kw} kW
            </span>
          )}
          <span style={{ color: C.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            {p.surface}
          </span>
        </div>

        <div style={{ marginBottom: '0.6rem' }}>
          <span style={{
            background: `${C.gold}22`,
            color: C.goldLight,
            fontSize: '0.67rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            padding: '0.18rem 0.55rem',
            borderRadius: '20px',
            border: `1px solid ${C.gold}44`,
          }}>
            {p.label}
          </span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700 }}>
              {fmt(p.price)}
            </span>
            {p.priceOld && (
              <span style={{ color: C.textMuted, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                {fmt(p.priceOld)}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleAddToCart}
            style={{
              background: adding
                ? `linear-gradient(135deg, #2a7a4f, #3aad6f)`
                : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white,
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1rem',
              fontSize: '0.78rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            {adding ? '✓ Ajouté' : '+ Panier'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── USP Card ─────────────────────────────────────────────────────────────────
function USPCard({ u, i }: { u: typeof USPS[number]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.55, ease: 'easeOut' }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.borderLight}`,
        borderRadius: '18px',
        padding: '2rem 1.75rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: `${C.accent}22`,
        border: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem',
      }}>
        <TemplateIcon emoji={u.icon} size={29} />
      </div>
      <h3 style={{
        color: C.text,
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: '0.65rem',
      }}>
        {u.title}
      </h3>
      <p style={{
        color: C.textMuted,
        fontSize: '0.86rem',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.7,
      }}>
        {u.desc}
      </p>
    </motion.div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────────────────────────
function TestiCard({ t, i }: { t: typeof TESTIMONIALS[number]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.borderLight}`,
        borderRadius: '18px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, ${C.gold})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.white,
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: '1rem',
          flexShrink: 0,
        }}>
          {t.name.charAt(0)}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
            {t.verified && (
              <span style={{
                background: 'rgba(42,122,79,0.25)',
                color: '#7aecaa',
                fontSize: '0.6rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: '3px',
              }}>
                ✓ Vérifié
              </span>
            )}
          </div>
          <div style={{ color: C.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            {t.city} · {t.date}
          </div>
        </div>
      </div>

      <Stars rating={t.rating} />

      <p style={{
        color: C.text,
        fontSize: '0.88rem',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        "{t.text}"
      </p>

      <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: '0.75rem' }}>
        <span style={{ color: C.accentLight, fontSize: '0.73rem', fontFamily: 'Inter, sans-serif' }}>
          {t.product}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Configurator ─────────────────────────────────────────────────────────────
function Configurator() {
  const [step,    setStep]    = useState(0);
  const [type,    setType]    = useState('');
  const [surface, setSurface] = useState('');
  const [budget,  setBudget]  = useState('');
  const [result,  setResult]  = useState<typeof PRODUCTS[number] | null>(null);
  const [done,    setDone]    = useState(false);

  const stoveTypes = [
    { id: 'bois',     label: 'Poêle à bois',      emoji: '🪵' },
    { id: 'granules', label: 'Poêle à granulés',   emoji: '🌾' },
    { id: 'insert',   label: 'Insert cheminée',    emoji: '🏛️' },
    { id: 'ethanol',  label: 'Cheminée éthanol',   emoji: '✨' },
  ];
  const surfaces = [
    { id: 'small',  label: 'Moins de 50 m²' },
    { id: 'medium', label: '50 – 100 m²' },
    { id: 'large',  label: '100 – 150 m²' },
    { id: 'xlarge', label: 'Plus de 150 m²' },
  ];
  const budgets = [
    { id: 'low',    label: 'Moins de 1 000 €' },
    { id: 'mid',    label: '1 000 – 2 000 €' },
    { id: 'high',   label: '2 000 – 3 500 €' },
    { id: 'luxury', label: 'Plus de 3 500 €' },
  ];

  const recommend = useCallback(() => {
    const budgetMap: Record<string, number> = { low: 1000, mid: 2000, high: 3500, luxury: 99999 };
    const maxBudget = budgetMap[budget] ?? 99999;
    const typeMap:   Record<string, string> = {
      bois: 'Poêle à bois', granules: 'Poêle à granulés', insert: 'Insert cheminée', ethanol: 'Cheminée éthanol'
    };
    const wantType = typeMap[type] ?? '';
    const candidates = PRODUCTS.filter(p => {
      const matchType   = !wantType || p.type === wantType;
      const matchBudget = p.price <= maxBudget;
      return matchType && matchBudget;
    }).sort((a, b) => b.rating - a.rating);
    setResult(candidates[0] ?? PRODUCTS[0]);
    setDone(true);
    setStep(3);
  }, [type, budget]);

  const reset = useCallback(() => {
    setStep(0); setType(''); setSurface(''); setBudget(''); setResult(null); setDone(false);
  }, []);

  const progress = ((step) / 3) * 100;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ background: C.borderLight, borderRadius: '4px', height: '4px', marginBottom: '2.5rem', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`, borderRadius: '4px' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
              Étape 1 — Quel type d'appareil ?
            </h3>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
              Choisissez le type d'appareil qui correspond à votre projet.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {stoveTypes.map(t => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setType(t.id); setStep(1); }}
                  style={{
                    background: type === t.id ? `${C.accent}33` : C.bgCard,
                    border: `1px solid ${type === t.id ? C.accent : C.border}`,
                    borderRadius: '12px',
                    padding: '1.5rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}><TemplateIcon emoji={t.emoji} size={32} /></div>
                  <div style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}>{t.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
              Étape 2 — Quelle surface à chauffer ?
            </h3>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
              La surface influe directement sur la puissance requise.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {surfaces.map(s => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSurface(s.id); setStep(2); }}
                  style={{
                    background: surface === s.id ? `${C.accent}33` : C.bgCard,
                    border: `1px solid ${surface === s.id ? C.accent : C.border}`,
                    borderRadius: '10px',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: C.text,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all 0.25s',
                  }}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setStep(0)}
              style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginTop: '1.25rem', textDecoration: 'underline' }}
            >
              ← Retour
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
              Étape 3 — Quel est votre budget ?
            </h3>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
              Nous sélectionnerons le meilleur rapport qualité/prix.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {budgets.map(b => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setBudget(b.id); recommend(); }}
                  style={{
                    background: budget === b.id ? `${C.accent}33` : C.bgCard,
                    border: `1px solid ${budget === b.id ? C.accent : C.border}`,
                    borderRadius: '10px',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: C.text,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all 0.25s',
                  }}
                >
                  {b.label}
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginTop: '1.25rem', textDecoration: 'underline' }}
            >
              ← Retour
            </button>
          </motion.div>
        )}

        {step === 3 && done && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              background: `linear-gradient(135deg, ${C.bgCard}, #201508)`,
              border: `1px solid ${C.accent}`,
              borderRadius: '20px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: C.glowAccent,
            }}
          >
            <div style={{ marginBottom: '1rem' }}><TemplateIcon emoji={result.emoji} size={56} /></div>
            <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              Notre recommandation
            </p>
            <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {result.name}
            </h3>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {result.type} · {result.surface} · {result.kw ? `${result.kw} kW` : 'Décoratif'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Stars rating={result.rating} />
              <span style={{ color: C.textMuted, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                {result.rating} ({result.reviews} avis)
              </span>
            </div>
            <p style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {fmt(result.price)}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                  color: C.white,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.9rem 2rem',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Voir le produit →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                style={{
                  background: 'transparent',
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '0.9rem 2rem',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Recommencer
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Cart Drawer ───────────────────────────────────────────────────────────────
type CartItem = { id: number; name: string; price: number; emoji: string; qty: number };

function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onQtyChange,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onQtyChange: (id: number, delta: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 999,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: C.bgAlt,
              borderLeft: `1px solid ${C.border}`,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1.75rem',
              borderBottom: `1px solid ${C.borderLight}`,
              position: 'sticky',
              top: 0,
              background: C.bgAlt,
              zIndex: 2,
            }}>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700 }}>
                Votre Panier ({items.reduce((s, i) => s + i.qty, 0)})
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.textMuted,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </motion.button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
                  <div style={{ marginBottom: '1rem' }}><TemplateIcon emoji="🛒" size={48} /></div>
                  <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
                    Votre panier est vide
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      style={{
                        background: C.bgCard,
                        border: `1px solid ${C.borderLight}`,
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flexShrink: 0 }}><TemplateIcon emoji={item.emoji} size={32} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </p>
                        <p style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', margin: '0.2rem 0 0' }}>
                          {fmt(item.price * item.qty)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => onQtyChange(item.id, -1)}
                          style={{ background: C.border, border: 'none', borderRadius: '4px', width: '24px', height: '24px', color: C.text, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button
                          onClick={() => onQtyChange(item.id, 1)}
                          style={{ background: C.border, border: 'none', borderRadius: '4px', width: '24px', height: '24px', color: C.text, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1 }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          style={{ background: 'none', border: 'none', color: '#cc3333', cursor: 'pointer', fontSize: '1rem', marginLeft: '0.25rem', padding: 0 }}
                        >
                          🗑
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '1.25rem 1.75rem 2rem',
                borderTop: `1px solid ${C.borderLight}`,
                position: 'sticky',
                bottom: 0,
                background: C.bgAlt,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Total</span>
                  <span style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700 }}>
                    {fmt(total)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                    color: C.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                  }}
                >
                  Commander maintenant →
                </motion.button>
                <p style={{ color: C.textMuted, fontSize: '0.73rem', fontFamily: 'Inter, sans-serif', textAlign: 'center', marginTop: '0.75rem' }}>
                  Livraison offerte · Paiement 3× sans frais disponible
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile Nav Drawer ─────────────────────────────────────────────────────────
function MobileNavDrawer({
  open,
  onClose,
  navPages,
  currentPage,
  goTo,
}: {
  open: boolean;
  onClose: () => void;
  navPages: { key: FlammePage; label: string }[];
  currentPage: FlammePage;
  goTo: (p: FlammePage) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }}
          />
          <motion.div
            key="nav-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed',
              left: 0, top: 0, bottom: 0,
              width: 'min(320px, 85vw)',
              background: C.bgAlt,
              borderRight: `1px solid ${C.border}`,
              zIndex: 300,
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem 1.75rem',
              gap: '0.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700 }}>
                Flamme & Co
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </motion.button>
            </div>
            {navPages.map((lnk, idx) => (
              <motion.button
                key={lnk.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                onClick={() => goTo(lnk.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${C.borderLight}`,
                  color: currentPage === lnk.key ? C.accentLight : C.text,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.05rem',
                  fontWeight: currentPage === lnk.key ? 700 : 500,
                  textDecoration: 'none',
                  padding: '0.85rem 0',
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                {lnk.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: '2rem',
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                color: C.white,
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Obtenir un devis
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '780px', margin: '0 auto' }}>
      {FAQS.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            style={{
              background: C.bgCard,
              border: `1px solid ${isOpen ? C.accent : C.borderLight}`,
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'border-color 0.3s',
            }}
          >
            <button
              id={`faq-btn-${idx}`}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '1.2rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                gap: '1rem',
              }}
            >
              <span style={{
                color: C.text,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.97rem',
                fontWeight: 600,
                textAlign: 'left',
                flex: 1,
              }}>
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ color: C.accent, fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key={`faq-answer-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '0 1.5rem 1.35rem',
                    color: C.textMuted,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                  }}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }, [email]);

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="nl-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '520px', margin: '0 auto' }}
        >
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            style={{
              flex: '1 1 260px',
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              padding: '0.9rem 1.25rem',
              color: C.text,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white,
              border: 'none',
              borderRadius: '10px',
              padding: '0.9rem 1.75rem',
              fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? '...' : "S'inscrire"}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          key="nl-success"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ marginBottom: '0.75rem' }}><PartyPopper style={{ width: 48, height: 48 }} /></div>
          <p style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700 }}>
            Merci de votre inscription !
          </p>
          <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Vous recevrez nos meilleures offres et conseils chauffage.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="promo-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `linear-gradient(90deg, ${C.accent}, #c84000, ${C.gold})`,
            backgroundSize: '200% 100%',
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, ${C.accent}, #c84000, ${C.gold}, ${C.accent})`,
              backgroundSize: '300% 100%',
            }}
          />
          <p style={{
            color: C.white,
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            margin: 0,
          }}>
            Livraison offerte sur toute la France · Code promo <strong>FLAMME10</strong> : −10 % sur votre première commande
          </p>
          <button
            onClick={() => setVisible(false)}
            style={{
              position: 'absolute',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: C.white,
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-page hero (shared by all inner pages) ────────────────────────────────
function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(5rem, 12vw, 8rem) 2rem clamp(3rem, 7vw, 4.5rem)',
      background: `radial-gradient(ellipse at 50% 0%, rgba(212,96,26,0.16) 0%, transparent 60%), ${C.bg}`,
      textAlign: 'center',
      borderBottom: `1px solid ${C.borderLight}`,
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${C.borderLight} 1px, transparent 1px), linear-gradient(90deg, ${C.borderLight} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '780px', margin: '0 auto' }}
      >
        <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.75rem' }}>
          {eyebrow}
        </p>
        <h1 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.1rem, 5.5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.12 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', lineHeight: 1.7, maxWidth: '560px', margin: '1.25rem auto 0' }}>
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}

// ─── Boutique sub-page (grid reuses ProductCard + detail view) ────────────────
function BoutiquePage({
  productDetail,
  setProductDetail,
  onAddToCart,
}: {
  productDetail: number | null;
  setProductDetail: (i: number | null) => void;
  onAddToCart: (item: { id: number; name: string; price: number; emoji: string }) => void;
}) {
  if (productDetail !== null && PRODUCTS[productDetail]) {
    return (
      <ProductDetailView
        p={PRODUCTS[productDetail]}
        onBack={() => setProductDetail(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <div style={{ background: C.bg }}>
      <PageHero
        eyebrow="Toute la boutique"
        title="Notre catalogue chauffage"
        subtitle="Poêles à bois, poêles à granulés, inserts et cheminées design. Cliquez sur un appareil pour consulter sa fiche détaillée et l'ajouter au panier."
      />
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(4rem, 9vw, 7rem)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="fc-grid-products">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                onClick={() => {
                  setProductDetail(i);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
                }}
              >
                <ProductCard p={p} i={i} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Product detail view (theme styling: image panel + specs + add to cart) ───
function ProductDetailView({
  p,
  onBack,
  onAddToCart,
}: {
  p: typeof PRODUCTS[number];
  onBack: () => void;
  onAddToCart: (item: { id: number; name: string; price: number; emoji: string }) => void;
}) {
  const [added, setAdded] = useState(false);
  const discount = p.priceOld ? Math.round((1 - p.price / p.priceOld) * 100) : null;

  const handleAdd = useCallback(() => {
    onAddToCart({ id: p.id, name: p.name, price: p.price, emoji: p.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [p, onAddToCart]);

  const specs = [
    { label: 'Type', value: p.type },
    { label: 'Puissance', value: p.kw ? `${p.kw} kW` : 'Décoratif' },
    { label: 'Surface chauffée', value: p.surface },
    { label: 'Marque', value: p.brand },
    { label: 'Label', value: p.label },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '70vh' }}>
      <section style={{ padding: 'clamp(4.5rem, 9vw, 7rem) 0 clamp(4rem, 9vw, 7rem)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 2rem' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: C.textMuted,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              marginBottom: '2.5rem',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.accentLight)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
          >
            ← Retour à la boutique
          </button>

          <div className="fc-grid-2" style={{ alignItems: 'start' }}>
            {/* Image panel */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              style={{
                background: `linear-gradient(145deg, #1e1208, #2a1a0a)`,
                border: `1px solid ${C.border}`,
                borderRadius: '20px',
                height: 'clamp(340px, 50vw, 520px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: C.cardShadow,
              }}
            >
              <TagBadge tag={p.tag} />
              {discount && (
                <span style={{
                  position: 'absolute', top: '0.9rem', right: '0.9rem',
                  background: '#8b2020', color: C.white, fontSize: '0.72rem',
                  fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  -{discount}%
                </span>
              )}
              <TemplateIcon emoji={p.emoji} size={140} />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ color: C.accentLight, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</span>
                <span style={{ color: C.textMuted, fontSize: '0.7rem' }}>·</span>
                <span style={{ color: C.textMuted, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>{p.type}</span>
              </div>
              <h1 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.18, marginBottom: '1rem' }}>
                {p.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <Stars rating={p.rating} />
                <span style={{ color: C.textMuted, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
                  {p.rating} · {p.reviews} avis vérifiés
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '1.75rem' }}>
                <span style={{ color: C.gold, fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 800 }}>{fmt(p.price)}</span>
                {p.priceOld && (
                  <span style={{ color: C.textMuted, fontSize: '1rem', fontFamily: 'Inter, sans-serif', textDecoration: 'line-through' }}>{fmt(p.priceOld)}</span>
                )}
              </div>

              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '480px' }}>
                Le {p.shortName} allie performance et design pour réchauffer jusqu'à {p.surface} avec élégance.
                Appareil {p.certEco ? 'éco-certifié, ' : ''}livré sous 48 h en France métropolitaine, installation par technicien
                certifié RGE disponible en option.
              </p>

              {/* Specs */}
              <div style={{
                background: C.bgCard,
                border: `1px solid ${C.borderLight}`,
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                {specs.map((s, idx) => (
                  <div key={s.label} style={{
                    display: 'flex', justifyContent: 'space-between', gap: '1rem',
                    padding: '0.6rem 0',
                    borderBottom: idx < specs.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                  }}>
                    <span style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>{s.label}</span>
                    <span style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>{s.value}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  background: added
                    ? `linear-gradient(135deg, #2a7a4f, #3aad6f)`
                    : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                  color: C.white,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.3s',
                }}
              >
                {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
              </motion.button>
              <p style={{ color: C.textMuted, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginTop: '0.85rem' }}>
                Livraison offerte · Paiement 3× sans frais · Garantie SAV 5 ans
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Blog sub-page (index + single article) ───────────────────────────────────
function BlogPage({
  blogSlug,
  setBlogSlug,
}: {
  blogSlug: string | null;
  setBlogSlug: (s: string | null) => void;
}) {
  const post = blogSlug ? BLOG_POSTS.find(b => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div style={{ background: C.bg }}>
        <PageHero eyebrow={post.category} title={post.title} />
        <section style={{ padding: 'clamp(3rem, 7vw, 4.5rem) 0 clamp(4rem, 9vw, 7rem)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 2rem' }}>
            <button
              onClick={() => setBlogSlug(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', marginBottom: '2rem',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.accentLight)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
            >
              ← Tous les articles
            </button>
            <div style={{
              height: '220px', borderRadius: '18px',
              background: `linear-gradient(145deg, #1e1208, #2a1a0a)`,
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <TemplateIcon emoji={post.emoji} size={72} />
            </div>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', marginBottom: '2rem' }}>
              {post.date} · {post.category}
            </p>
            {post.body.map((para, idx) => (
              <p key={idx} style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                {para}
              </p>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg }}>
      <PageHero
        eyebrow="Le journal Flamme & Co"
        title="Conseils & guides chauffage"
        subtitle="Guides d'achat, aides financières, dimensionnement, entretien : nos experts partagent leurs conseils pour bien chauffer votre intérieur."
      />
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(4rem, 9vw, 7rem)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="fc-grid-2">
            {BLOG_POSTS.map((b, i) => (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 2) * 0.08, duration: 0.55 }}
                onClick={() => {
                  setBlogSlug(b.slug);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                whileHover={{ y: -6 }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: '18px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: C.cardShadow,
                }}
              >
                <div style={{
                  height: '170px',
                  background: `linear-gradient(145deg, #1e1208, #2a1a0a)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: `1px solid ${C.borderLight}`,
                }}>
                  <TemplateIcon emoji={b.emoji} size={56} />
                </div>
                <div style={{ padding: '1.5rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{
                    alignSelf: 'flex-start',
                    background: `${C.accent}22`, color: C.accentLight,
                    fontSize: '0.68rem', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem', borderRadius: '20px', border: `1px solid ${C.border}`,
                    marginBottom: '0.85rem',
                  }}>
                    {b.category}
                  </span>
                  <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.6rem' }}>
                    {b.title}
                  </h3>
                  <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>
                    {b.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>{b.date}</span>
                    <span style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600 }}>Lire →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── À propos sub-page ────────────────────────────────────────────────────────
function AboutPage({ goTo }: { goTo: (p: FlammePage) => void }) {
  const values = [
    { icon: '🌿', title: 'Engagement écologique', desc: 'Tous nos appareils respectent les normes Flamme Verte et Écoconception 2022. Chauffer mieux en consommant moins, c\'est notre priorité.' },
    { icon: '🤝', title: 'Conseil humain', desc: 'Une équipe de passionnés basée en France, joignable par téléphone, qui vous accompagne du choix de l\'appareil au montage de votre dossier d\'aides.' },
    { icon: '🏅', title: 'Marques sélectionnées', desc: 'Nous travaillons exclusivement avec les meilleurs fabricants européens : MCZ, Invicta, Godin, Stuv, Edilkamin, Planika.' },
    { icon: '🛡️', title: 'SAV réactif', desc: 'Garantie constructeur jusqu\'à 5 ans et service après-vente basé en France, pour une tranquillité totale, saison après saison.' },
  ];

  return (
    <div style={{ background: C.bg }}>
      <PageHero
        eyebrow="Notre histoire"
        title="Flamme & Co, l'art de chauffer"
        subtitle="Spécialiste du chauffage au bois et à granulés depuis 2008, nous réchauffons les foyers français avec exigence et passion."
      />

      <section className="fc-section-pad" style={{ background: C.bg }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
            Fondée en 2008 par une famille de passionnés de chauffage, Flamme & Co est née d'une conviction simple :
            la chaleur d'un poêle ne devrait jamais se résumer à un radiateur. C'est une ambiance, un rituel, un confort
            qui transforme une maison en foyer.
          </p>
          <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
            En plus de quinze ans, nous avons équipé plus de 4 200 foyers à travers toute la France. De la sélection
            rigoureuse des meilleures marques européennes à l'installation par nos techniciens certifiés RGE, nous
            maîtrisons chaque étape pour vous offrir un appareil parfaitement adapté à votre logement.
          </p>
          <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.85 }}>
            Aujourd'hui, notre catalogue couvre poêles à bois, poêles à granulés, inserts, foyers fermés et cheminées
            design. Et notre engagement reste le même : des produits performants, certifiés Flamme Verte, et un
            accompagnement humain de bout en bout.
          </p>
        </div>
      </section>

      <section className="fc-section-pad" style={{ background: C.bgAlt, paddingTop: 0 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
              Nos valeurs
            </p>
            <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Ce qui nous guide
            </h2>
          </div>
          <div className="fc-grid-2">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: '18px',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: '54px', height: '54px', borderRadius: '50%', flexShrink: 0,
                  background: `${C.accent}22`, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TemplateIcon emoji={v.icon} size={26} />
                </div>
                <div>
                  <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => goTo('boutique')}
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                color: C.white, border: 'none', borderRadius: '12px',
                padding: '1rem 2.25rem', fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
              }}
            >
              Découvrir la boutique →
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Contact sub-page ─────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  }, [form]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '0.9rem 1.1rem',
    color: C.text,
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: C.textMuted,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    letterSpacing: '0.02em',
  };

  const infos = [
    { icon: '📞', label: 'Téléphone', value: '01 23 45 67 89', sub: 'Lun–Ven, 9h–18h' },
    { icon: '✉️', label: 'Email', value: 'contact@flammeetco.fr', sub: 'Réponse sous 24 h' },
    { icon: '📍', label: 'Showroom', value: 'France métropolitaine', sub: 'Livraison & installation partout' },
  ];

  return (
    <div style={{ background: C.bg }}>
      <PageHero
        eyebrow="Nous contacter"
        title="Parlons de votre projet"
        subtitle="Une question sur un appareil, un devis d'installation ou les aides disponibles ? Notre équipe vous répond rapidement."
      />
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(4rem, 9vw, 7rem)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="fc-grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
            {/* Infos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {infos.map(info => (
                <div key={info.label} style={{
                  background: C.bgCard,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.1rem',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0,
                    background: `${C.accent}22`, border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <TemplateIcon emoji={info.icon} size={24} />
                  </div>
                  <div>
                    <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{info.label}</p>
                    <p style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700 }}>{info.value}</p>
                    <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', marginTop: '0.15rem' }}>{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              boxShadow: C.cardShadow,
            }}>
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label htmlFor="contact-name" style={labelStyle}>Nom complet</label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Jean Dupont"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label htmlFor="contact-email" style={labelStyle}>Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="jean@email.fr"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label htmlFor="contact-message" style={labelStyle}>Votre message</label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Décrivez votre projet (surface, type de logement, budget...)"
                        required
                        rows={5}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%',
                        background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                        color: C.white, border: 'none', borderRadius: '12px',
                        padding: '1rem', fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                        fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
                      }}
                    >
                      Envoyer le message
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    style={{ textAlign: 'center', padding: '2rem 0' }}
                  >
                    <div style={{ marginBottom: '1rem' }}><PartyPopper style={{ width: 48, height: 48 }} /></div>
                    <h3 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      Message envoyé !
                    </h3>
                    <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
                      Merci, notre équipe vous recontacte sous 24 heures.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Legal sub-page (CGV + Mentions) ──────────────────────────────────────────
function LegalPage({ variant }: { variant: 'cgv' | 'mentions' }) {
  const sectionTitle: React.CSSProperties = {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.4rem',
    fontWeight: 700,
    color: C.text,
    marginTop: '2.5rem',
    marginBottom: '0.85rem',
  };
  const para: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.95rem',
    color: C.textMuted,
    lineHeight: 1.85,
    marginBottom: '0.9rem',
  };
  const strong: React.CSSProperties = { color: C.text, fontWeight: 600 };

  if (variant === 'mentions') {
    return (
      <div style={{ background: C.bg }}>
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section style={{ padding: 'clamp(2.5rem, 6vw, 4rem) 0 clamp(4rem, 9vw, 7rem)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={sectionTitle}>Éditeur du site</h2>
            <p style={para}><span style={strong}>Aevia WS</span> — entrepreneur individuel (auto-entrepreneur).</p>
            <p style={para}>Directeur de la publication : <span style={strong}>Valentin Milliand</span>.</p>
            <p style={para}>SIREN : <span style={strong}>852 546 225</span> — RCS Bourg-en-Bresse.</p>
            <p style={para}>Contact : <span style={strong}>contact@aevia.io</span></p>
            <p style={para}>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>

            <h2 style={sectionTitle}>TVA</h2>
            <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 style={sectionTitle}>Hébergeur</h2>
            <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 style={sectionTitle}>Propriété intellectuelle</h2>
            <p style={para}>
              L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
              de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
              de l'éditeur.
            </p>

            <h2 style={sectionTitle}>Données personnelles</h2>
            <p style={para}>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous
              concernant. Pour exercer ce droit, écrivez à contact@aevia.io.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg }}>
      <PageHero eyebrow="Conditions générales" title="Conditions générales de vente" />
      <section style={{ padding: 'clamp(2.5rem, 6vw, 4rem) 0 clamp(4rem, 9vw, 7rem)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ ...para, fontStyle: 'italic', color: C.textMuted }}>Dernière mise à jour : juin 2025.</p>

          <h2 style={sectionTitle}>Article 1 — Objet</h2>
          <p style={para}>
            Les présentes conditions générales de vente régissent les relations contractuelles entre Flamme & Co et tout
            client effectuant un achat sur le site. Toute commande implique l'acceptation sans réserve des présentes CGV.
          </p>

          <h2 style={sectionTitle}>Article 2 — Prix</h2>
          <p style={para}>
            Les prix sont indiqués en euros, toutes taxes comprises. Flamme & Co se réserve le droit de modifier ses prix à
            tout moment ; les articles sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>

          <h2 style={sectionTitle}>Article 3 — Commande</h2>
          <p style={para}>
            La commande est validée après confirmation du paiement. Un email récapitulatif est adressé au client. Flamme & Co
            se réserve le droit d'annuler toute commande en cas de litige de paiement ou de rupture de stock.
          </p>

          <h2 style={sectionTitle}>Article 4 — Paiement</h2>
          <p style={para}>
            Le règlement s'effectue par carte bancaire via un prestataire de paiement sécurisé, ou en 3× sans frais selon
            éligibilité. Aucune donnée bancaire n'est conservée par Flamme & Co.
          </p>

          <h2 style={sectionTitle}>Article 5 — Livraison</h2>
          <p style={para}>
            Les délais de livraison sont de 48 heures ouvrées en France métropolitaine pour les produits en stock. La livraison
            est offerte. Les risques liés au transport sont transférés au client à la réception du colis.
          </p>

          <h2 style={sectionTitle}>Article 6 — Installation</h2>
          <p style={para}>
            L'installation par nos techniciens certifiés RGE est proposée en option, sur devis gratuit. Elle comprend la pose,
            le raccordement au conduit de fumée et la mise en service de l'appareil.
          </p>

          <h2 style={sectionTitle}>Article 7 — Droit de rétractation</h2>
          <p style={para}>
            Conformément au Code de la consommation, le client dispose d'un délai de 14 jours à compter de la réception pour
            retourner un article non installé, dans son emballage d'origine, sans avoir à justifier de motif. Le remboursement
            intervient sous 14 jours après réception du retour.
          </p>

          <h2 style={sectionTitle}>Article 8 — Garanties</h2>
          <p style={para}>
            Tous les produits bénéficient des garanties légales de conformité et contre les vices cachés, ainsi que de la
            garantie constructeur pouvant aller jusqu'à 5 ans selon l'appareil.
          </p>

          <h2 style={sectionTitle}>Article 9 — Droit applicable</h2>
          <p style={para}>
            Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant
            toute action judiciaire.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function FlammeEtCoPage() {
  const [cartItems,    setCartItems]    = useState<CartItem[]>([]);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [navOpen,      setNavOpen]      = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  // Multi-page state
  const [page,          setPage]          = useState<FlammePage>('home');
  const [productDetail, setProductDetail] = useState<number | null>(null);
  const [blogSlug,      setBlogSlug]      = useState<string | null>(null);

  const goTo = useCallback((p: FlammePage) => {
    setPage(p);
    setProductDetail(null);
    setBlogSlug(null);
    setNavOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 500], [0, 80]);

  // Nav darkening on scroll
  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  const addToCart = useCallback((item: { id: number; name: string; price: number; emoji: string }) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci => ci.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prev => prev.filter(ci => ci.id !== id));
  }, []);

  const changeQty = useCallback((id: number, delta: number) => {
    setCartItems(prev =>
      prev.flatMap(ci => {
        if (ci.id !== id) return [ci];
        const nq = ci.qty + delta;
        return nq <= 0 ? [] : [{ ...ci, qty: nq }];
      })
    );
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const EMBERS = Array.from({ length: 18 }, (_, i) => ({
    x:     4 + (i / 18) * 92,
    delay: (i * 0.33) % 4.5,
    size:  3 + (i % 4) * 1.5,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.text}; }

        .fc-grid-2       { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .fc-grid-3       { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .fc-grid-4       { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .fc-grid-products{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .fc-section-pad  { padding: 7rem 0; }

        @media(max-width:1024px) {
          .fc-grid-products { grid-template-columns: repeat(2, 1fr); }
          .fc-grid-4        { grid-template-columns: repeat(2, 1fr); }
        }
        @media(max-width:768px) {
          .fc-grid-2        { grid-template-columns: 1fr !important; }
          .fc-grid-3        { grid-template-columns: 1fr 1fr; }
          .fc-grid-4        { grid-template-columns: 1fr 1fr; }
          .fc-grid-products { grid-template-columns: 1fr 1fr; }
          .fc-section-pad   { padding: 4rem 0; }
        }
        @media(max-width:480px) {
          .fc-grid-3        { grid-template-columns: 1fr; }
          .fc-grid-4        { grid-template-columns: 1fr; }
          .fc-grid-products { grid-template-columns: 1fr; }
        }

        .fc-nav-lnk { display: none; }
        @media(min-width:960px) { .fc-nav-lnk { display: block !important; } }

        input::placeholder { color: ${C.textMuted}; }
        button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 3px; }
        a { color: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'Inter, sans-serif' }}>

        {/* ── Promo Banner ──────────────────────────────────────────────────── */}
        <PromoBanner />

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <motion.nav
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: scrolled ? `rgba(14,10,8,0.97)` : 'transparent',
            borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            transition: 'all 0.35s ease',
          }}
        >
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 2rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}>
            {/* Logo */}
            <button onClick={() => goTo('home')} style={{ background: 'none', border: 'none', textDecoration: 'none', flexShrink: 0, cursor: 'pointer', padding: 0 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 800, color: C.text }}>
                <span style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flamme</span>{' '}
                <span style={{ color: C.text }}>&amp; Co</span>
              </span>
            </button>

            {/* Desktop nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
              {NAV_PAGES.map(lnk => {
                const active = page === lnk.key;
                return (
                  <button
                    key={lnk.key}
                    onClick={() => goTo(lnk.key)}
                    className="fc-nav-lnk"
                    style={{
                      background: active ? C.borderLight : 'transparent',
                      border: 'none',
                      color: active ? C.text : C.textMuted,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 500,
                      cursor: 'pointer',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      transition: 'color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.text; (e.currentTarget as HTMLButtonElement).style.background = C.borderLight; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = active ? C.text : C.textMuted; (e.currentTarget as HTMLButtonElement).style.background = active ? C.borderLight : 'transparent'; }}
                  >
                    {lnk.label}
                  </button>
                );
              })}
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              {/* Cart */}
              <motion.button
                id="cart-open-btn"
                whileTap={{ scale: 0.92 }}
                onClick={() => setCartOpen(true)}
                style={{
                  background: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  color: C.text,
                  cursor: 'pointer',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <TemplateIcon emoji="🛒" size={18} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: C.accent,
                        color: C.white,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        fontSize: '0.65rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* CTA (desktop) */}
              <motion.button
                className="fc-nav-lnk"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                  color: C.white,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'none',
                }}
              >
                Devis gratuit
              </motion.button>

              {/* Hamburger */}
              <motion.button
                id="nav-hamburger"
                whileTap={{ scale: 0.9 }}
                onClick={() => setNavOpen(true)}
                style={{
                  background: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  color: C.text,
                  cursor: 'pointer',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                ☰
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* ── HOME PAGE (gated; renders exactly as before) ──────────────────── */}
        {page === 'home' && (<>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          style={{
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: `radial-gradient(ellipse at 50% 90%, rgba(212,96,26,0.18) 0%, transparent 65%), ${C.bg}`,
          }}
        >
          {/* Ember particles */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', pointerEvents: 'none' }}>
            {EMBERS.map((em, i) => (
              <Ember key={i} x={em.x} delay={em.delay} size={em.size} />
            ))}
          </div>

          {/* Background grid texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${C.borderLight} 1px, transparent 1px), linear-gradient(90deg, ${C.borderLight} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            opacity: 0.4,
          }} />

          {/* Hero content */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              padding: '2rem',
              maxWidth: '860px',
              margin: '0 auto',
              opacity: heroOpacity,
              y: heroY,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: `${C.accent}22`,
                border: `1px solid ${C.border}`,
                borderRadius: '20px',
                padding: '0.4rem 1rem',
                marginBottom: '1.75rem',
              }}
            >
              <span style={{ color: C.accentLight, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Spécialiste chauffage premium depuis 2008
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.4rem, 7vw, 5.2rem)',
                fontWeight: 800,
                color: C.text,
                lineHeight: 1.12,
                marginBottom: '1.25rem',
              }}
            >
              Réchauffez{' '}
              <span style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                votre intérieur
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: C.textMuted,
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '620px',
                margin: '0 auto 2.5rem',
              }}
            >
              Découvrez notre sélection de poêles à bois, poêles à granulés et cheminées design. 
              Expédition rapide, installation professionnelle, service après-vente réactif.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}
            >
              <motion.a
                href="#products"
                whileHover={{ scale: 1.06, boxShadow: C.glowAccent }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                  color: C.white,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2.25rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.02em',
                }}
              >
                Voir nos poêles →
              </motion.a>
              <motion.a
                href="#configurateur"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'transparent',
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '1rem 2.25rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Configurateur
              </motion.a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{
                display: 'flex',
                gap: '0',
                justifyContent: 'center',
                flexWrap: 'wrap',
                background: `${C.bgCard}cc`,
                border: `1px solid ${C.borderLight}`,
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
                maxWidth: '620px',
                margin: '0 auto',
              }}
            >
              {[
                { value: '4 200+', label: 'Clients satisfaits' },
                { value: '48h',    label: 'Livraison express' },
                { value: '5 ans',  label: 'Garantie SAV' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 160px',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'center',
                    borderRight: idx < 2 ? `1px solid ${C.borderLight}` : 'none',
                  }}
                >
                  <div style={{
                    color: C.accentLight,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    marginBottom: '0.2rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    color: C.textMuted,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              zIndex: 2,
            }}
          >
            <span style={{ color: C.textMuted, fontSize: '0.72rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Défiler</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ color: C.accent, fontSize: '1.1rem' }}
            >
              ↓
            </motion.div>
          </motion.div>
        </section>

        {/* ── Featured Strip ────────────────────────────────────────────────── */}
        <section id="featured" style={{ background: C.bgAlt, padding: '5rem 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Sélection Flamme & Co
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                Nos produits phares
              </h2>
            </div>
            <div className="fc-grid-3">
              {FEATURED.map((p, i) => (
                <FeaturedCard key={p.id} p={p} i={i} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Category Grid ─────────────────────────────────────────────────── */}
        <section id="categories" className="fc-section-pad" style={{ background: C.bg }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Explorer par catégorie
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                Trouvez votre appareil idéal
              </h2>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
                Chaque catégorie regroupe nos meilleures références sélectionnées pour leur rendement, leur design et leur fiabilité.
              </p>
            </div>
            <div className="fc-grid-4">
              {CATEGORIES.map((c, i) => (
                <CategoryCard key={c.id} c={c} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Products Grid ─────────────────────────────────────────────────── */}
        <section id="products" className="fc-section-pad" style={{ background: C.bgAlt }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                  Notre catalogue
                </p>
                <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                  Tous nos appareils
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Tous', 'Bois', 'Granulés', 'Design'].map(f => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: f === 'Tous' ? `${C.accent}33` : C.bgCard,
                      border: `1px solid ${f === 'Tous' ? C.accent : C.border}`,
                      color: f === 'Tous' ? C.accentLight : C.textMuted,
                      borderRadius: '8px',
                      padding: '0.45rem 1rem',
                      fontSize: '0.82rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="fc-grid-products">
              {PRODUCTS.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* ── USPs ─────────────────────────────────────────────────────────── */}
        <section id="usps" className="fc-section-pad" style={{ background: C.bg }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Pourquoi Flamme & Co ?
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                L'excellence à chaque étape
              </h2>
            </div>
            <div className="fc-grid-4">
              {USPS.map((u, i) => (
                <USPCard key={i} u={u} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Configurateur ─────────────────────────────────────────────────── */}
        <section id="configurateur" className="fc-section-pad" style={{ background: C.bgAlt }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Outil interactif
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                Trouvez votre poêle en 3 étapes
              </h2>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                Notre configurateur analyse votre profil et vous recommande l'appareil parfait pour votre logement et votre budget.
              </p>
            </div>
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.borderLight}`,
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 5vw, 3.5rem)',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: C.cardShadow,
            }}>
              <Configurator />
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <section id="testimonials" className="fc-section-pad" style={{ background: C.bg }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Ils nous font confiance
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                Avis vérifiés clients
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <Stars rating={4.8} />
                <span style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
                  4.8/5 · 923 avis vérifiés
                </span>
              </div>
            </div>
            <div className="fc-grid-3">
              {TESTIMONIALS.map((t, i) => (
                <TestiCard key={t.id} t={t} i={i} />
              ))}
            </div>
            {/* Extra testimonials row */}
            <div style={{ marginTop: '1.5rem' }} className="fc-grid-2">
              {EXTRA_TESTIMONIALS.map((t, i) => (
                <TestiCard key={t.id} t={t} i={i + TESTIMONIALS.length} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof Banner ────────────────────────────────────────────── */}
        <section style={{ background: `linear-gradient(135deg, #1a0d06, #2a1008)`, padding: '4rem 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-around' }}>
              {[
                { icon: '🏅', value: '4 200+', label: 'Foyers équipés' },
                { icon: '⭐', value: '4.8/5', label: 'Note moyenne' },
                { icon: '🚀', value: '48h', label: 'Délai moyen livraison' },
                { icon: '🛡️', value: '5 ans', label: 'Garantie SAV' },
                { icon: '🌿', value: '100%', label: 'Certifiés Flamme Verte' },
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ marginBottom: '0.5rem' }}><TemplateIcon emoji={s.icon} size={32} /></div>
                  <div style={{ color: C.accentLight, fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 800 }}>{s.value}</div>
                  <div style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 500, marginTop: '0.25rem' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section id="faq" className="fc-section-pad" style={{ background: C.bgAlt }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.65rem' }}>
                Questions fréquentes
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                Tout savoir avant d'acheter
              </h2>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
                Retrouvez les réponses à vos questions sur nos produits, la livraison, les aides financières et l'installation.
              </p>
            </div>
            <FAQAccordion />
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Vous ne trouvez pas votre réponse ?
              </p>
              <motion.a
                href="mailto:contact@flammeetco.fr"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: C.accentLight,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
              >
                Contactez-nous
              </motion.a>
            </div>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────────────────────────── */}
        <section id="newsletter" className="fc-section-pad" style={{ background: C.bg }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.bgCard}, #200e06)`,
              border: `1px solid ${C.border}`,
              borderRadius: '28px',
              padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 0 80px rgba(212,96,26,0.12)`,
            }}>
              {/* Decorative ember glow */}
              <div style={{
                position: 'absolute',
                bottom: '-40%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '500px',
                height: '300px',
                background: `radial-gradient(ellipse, rgba(212,96,26,0.15), transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <p style={{ color: C.accentLight, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.75rem', position: 'relative' }}>
                Newsletter exclusive
              </p>
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', position: 'relative' }}>
                Offres & conseils chauffage
              </h2>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 2.5rem', lineHeight: 1.65, position: 'relative' }}>
                Recevez nos meilleures promotions, guides d'achat et conseils d'experts directement dans votre boîte mail.
              </p>
              <div style={{ position: 'relative' }}>
                <Newsletter />
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.72rem', fontFamily: 'Inter, sans-serif', marginTop: '1.25rem', position: 'relative' }}>
                Pas de spam · Désabonnement en 1 clic · Données protégées (RGPD)
              </p>
            </div>
          </div>
        </section>

        {/* ── Trust Logos ───────────────────────────────────────────────────── */}
        <section style={{ background: C.bgAlt, padding: '3rem 0', borderTop: `1px solid ${C.borderLight}` }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '2rem' }}>
              Nos marques partenaires
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
              {['MCZ', 'Invicta', 'Godin', 'Stuv', 'Edilkamin', 'Planika', 'Rocal', 'Jotul'].map(brand => (
                <div
                  key={brand}
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.borderLight}`,
                    borderRadius: '10px',
                    padding: '0.65rem 1.5rem',
                    color: C.textMuted,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
        </>)}

        {/* ── INNER PAGES (theme-native, same tokens/fonts/nav/footer) ───────── */}
        {page === 'boutique' && (
          <BoutiquePage
            productDetail={productDetail}
            setProductDetail={setProductDetail}
            onAddToCart={addToCart}
          />
        )}
        {page === 'blog' && <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />}
        {page === 'about' && <AboutPage goTo={goTo} />}
        {page === 'contact' && <ContactPage />}
        {page === 'cgv' && <LegalPage variant="cgv" />}
        {page === 'mentions' && <LegalPage variant="mentions" />}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer style={{ background: '#0a0806', borderTop: `1px solid ${C.border}`, padding: '5rem 0 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="fc-grid-4" style={{ marginBottom: '4rem' }}>
              {/* Column 1 — Brand */}
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: '1rem' }}>
                  <span style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flamme</span> &amp; Co
                </div>
                <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.87rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                  Votre spécialiste en chauffage au bois et à granulés depuis 2008. 
                  Nous sélectionnons les meilleures marques européennes pour réchauffer votre intérieur avec élégance.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: C.bgCard,
                        border: `1px solid ${C.borderLight}`,
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <TemplateIcon emoji={icon} size={14} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Column 2 — Catégories */}
              <div>
                <h4 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Catégories
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {['Poêles à bois', 'Poêles à granulés', 'Cheminées & Inserts', 'Foyers fermés', 'Cheminées éthanol', 'Accessoires', 'Pièces détachées', 'Entretien'].map(cat => (
                    <a
                      key={cat}
                      href="#"
                      style={{
                        color: C.textMuted,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.86rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = C.accentLight}
                      onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = C.textMuted}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 3 — Services */}
              <div>
                <h4 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Services
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {['Devis en ligne', 'Installation à domicile', 'Entretien annuel', 'SAV & dépannage', 'Reprise ancienne cheminée', 'Financement 3×', 'Guide d\'achat', 'Configurateur'].map(svc => (
                    <a
                      key={svc}
                      href="#"
                      style={{
                        color: C.textMuted,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.86rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = C.accentLight}
                      onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = C.textMuted}
                    >
                      {svc}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 4 — À propos */}
              <div>
                <h4 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  À propos
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  {['Notre histoire', 'L\'équipe', 'Nos engagements', 'Flamme Verte', 'Presse', 'Recrutement', 'Contact', 'Blog chauffage'].map(lnk => (
                    <a
                      key={lnk}
                      href="#"
                      style={{
                        color: C.textMuted,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.86rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = C.accentLight}
                      onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = C.textMuted}
                    >
                      {lnk}
                    </a>
                  ))}
                </div>
                <div style={{
                  background: C.bgCard,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: '12px',
                  padding: '1rem',
                }}>
                  <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', marginBottom: '0.35rem' }}>Service client</p>
                  <p style={{ color: C.text, fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 }}>01 23 45 67 89</p>
                  <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.73rem', marginTop: '0.2rem' }}>Lun–Ven, 9h–18h</p>
                </div>
              </div>
            </div>

            {/* Payment logos strip */}
            <div style={{
              borderTop: `1px solid ${C.borderLight}`,
              paddingTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Virement', '3× sans frais'].map(p => (
                  <span
                    key={p}
                    style={{
                      background: C.bgCard,
                      border: `1px solid ${C.borderLight}`,
                      borderRadius: '6px',
                      padding: '0.3rem 0.65rem',
                      color: C.textMuted,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>
                © 2025 Flamme & Co · Tous droits réservés ·{' '}
                <button onClick={() => goTo('mentions')} style={{ background: 'none', border: 'none', padding: 0, color: C.textMuted, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>Mentions légales</button>
                {' · '}
                <button onClick={() => goTo('cgv')} style={{ background: 'none', border: 'none', padding: 0, color: C.textMuted, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>CGV</button>
                {' · '}
                <button onClick={() => goTo('mentions')} style={{ background: 'none', border: 'none', padding: 0, color: C.textMuted, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>Confidentialité</button>
              </p>
            </div>
          </div>
        </footer>

        {/* ── Cart Drawer ───────────────────────────────────────────────────── */}
        <CartDrawer
          open={cartOpen}
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onQtyChange={changeQty}
        />

        {/* ── Mobile Nav Drawer ─────────────────────────────────────────────── */}
        <MobileNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          navPages={NAV_PAGES}
          currentPage={page}
          goTo={goTo}
        />

        {/* ── Sticky CTA Bar (mobile) ────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            display: 'flex',
            gap: '0.75rem',
            background: `${C.bgAlt}ee`,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '0.7rem 1.25rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            maxWidth: 'calc(100vw - 2rem)',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (page !== 'home') { goTo('home'); }
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  document.getElementById('configurateur')?.scrollIntoView({ behavior: 'smooth' });
                }, page !== 'home' ? 80 : 0);
              }
            }}
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white,
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              fontSize: '0.82rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Configurateur
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCartOpen(true)}
            style={{
              background: C.bgCard,
              color: C.text,
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              fontSize: '0.82rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            Panier
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: C.accent,
                color: C.white,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.62rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </motion.button>
        </motion.div>

      </div>
    </>
  );
}
