"use client";
// @ts-nocheck

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
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
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
            <div className="imx-mobstack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
  navLinks,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
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
              {fd?.logoBase64 ? (
                <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
              ) : (
                <span style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700 }}>{fd?.businessName ?? "Flamme & Co"}</span>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </motion.button>
            </div>
            {navLinks.map((lnk, idx) => (
              <motion.a
                key={lnk.href}
                href={lnk.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                onClick={onClose}
                style={{
                  color: C.text,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '0.85rem 0',
                  borderBottom: `1px solid ${C.borderLight}`,
                  display: 'block',
                  transition: 'color 0.2s',
                }}
              >
                {lnk.label}
              </motion.a>
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

// ─── Main Page Component ───────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function FlammeEtCoPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25) };
  }

  const [cartItems,    setCartItems]    = useState<CartItem[]>([]);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [navOpen,      setNavOpen]      = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 500], [0, 80]);

  // Nav darkening on scroll
  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  const navLinks = [
    { label: 'Poêles à bois',      href: '#categories' },
    { label: 'Granulés',           href: '#categories' },
    { label: 'Cheminées',          href: '#categories' },
    { label: 'Accessoires',        href: '#categories' },
    { label: 'Configurateur',      href: '#configurateur' },
  ];

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
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'Inter, sans-serif' }}>

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
            <a href="/templates/impact-215" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 800, color: C.text }}>
                <span style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flamme</span>{' '}
                <span style={{ color: C.text }}>&amp; Co</span>
              </span>
            </a>

            {/* Desktop nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
              {navLinks.map(lnk => (
                <a
                  key={lnk.href + lnk.label}
                  href={lnk.href}
                  className="fc-nav-lnk"
                  style={{
                    color: C.textMuted,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    transition: 'color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = C.text; (e.target as HTMLAnchorElement).style.background = C.borderLight; }}
                  onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = C.textMuted; (e.target as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  {lnk.label}
                </a>
              ))}
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

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          style={{
            minHeight: '100dvh',
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
            >{c?.heroHeadline ?? <>
              Réchauffez{' '}
              <span style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                votre intérieur
              </span>
            </>}</motion.h1>

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
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Découvrez notre sélection de poêles à bois, poêles à granulés et cheminées design. 
              Expédition rapide, installation professionnelle, service après-vente réactif.
            </>}</motion.p>

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
              <h2 style={{ color: C.text, fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                Trouvez votre appareil idéal
              </>}</h2>
              <p style={{ color: C.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>{c?.aboutText ?? <>
                Chaque catégorie regroupe nos meilleures références sélectionnées pour leur rendement, leur design et leur fiabilité.
              </>}</p>
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
                href={`mailto:${fd?.email ?? "contact@flammeetco.fr"}`}
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
                      href="/templates/impact-215"
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
                      href="/templates/impact-215"
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
                      href="/templates/impact-215"
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
                <a href="/templates/impact-215" style={{ color: C.textMuted, textDecoration: 'underline' }}>Mentions légales</a>
                {' · '}
                <a href="/templates/impact-215" style={{ color: C.textMuted, textDecoration: 'underline' }}>CGV</a>
                {' · '}
                <a href="/templates/impact-215" style={{ color: C.textMuted, textDecoration: 'underline' }}>Confidentialité</a>
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
          navLinks={navLinks}
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
          <motion.a
            href="#configurateur"
            whileTap={{ scale: 0.95 }}
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
          </motion.a>
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
