"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#080808",
  card: "#111111",
  text: "#f5f0e8",
  muted: "#8a8070",
  amber: "#d97706",
  amberLight: "#f59e0b",
  amberSoft: "rgba(217,119,6,0.12)",
  border: "rgba(217,119,6,0.15)",
  borderHover: "rgba(217,119,6,0.4)",
}

const navLinks = ["Notre Studio", "Productions", "Services", "Références", "Contact"]

const stats = [
  { value: "2011", label: "Fondé à Paris" },
  { value: "300+", label: "Productions livrées" },
  { value: "18", label: "Festivals internationaux" },
  { value: "45", label: "Pays de distribution" },
]

const productions = [
  { category: "Fiction", title: "Les Heures Bleues", client: "Arte France", format: "Série 6×52min", year: "2024" },
  { category: "Publicité", title: "L'Origine", client: "Hermès", format: "Spot 90s — Cannes Lions", year: "2024" },
  { category: "Documentaire", title: "Forêts Primaires", client: "National Geographic", format: "Doc 90min — Festival de Sundance", year: "2023" },
  { category: "Fiction", title: "Nocturne", client: "Canal+", format: "Court-métrage 26min — César", year: "2023" },
  { category: "Publicité", title: "Revenir", client: "Louis Vuitton", format: "Campagne globale 60s", year: "2022" },
  { category: "Documentaire", title: "Le Silence des Baleines", client: "France Télévisions", format: "Doc 52min — Primetime", year: "2022" },
]

const features = [
  {
    tab: "Fiction & Série",
    headline: "Narratives qui traversent les écrans et les frontières",
    body: "Du développement au montage final, nous concevons des fictions qui habitent les spectateurs. Notre approche éditoriale privilégie la singularité des voix d'auteur, l'exigence de la direction artistique et la profondeur de chaque personnage. Nous coproduisons avec Arte, Canal+, Netflix France et les majors internationales.",
    works: [
      { title: "Les Heures Bleues", detail: "Arte France · Série 6×52min · 2024" },
      { title: "Nocturne", detail: "Canal+ · Court-métrage 26min · César 2023" },
      { title: "La Mémoire des Pierres", detail: "Netflix France · Long-métrage · 2025" },
      { title: "Terminus Nord", detail: "RAI Fiction · Série 4×45min · 2024" },
    ],
  },
  {
    tab: "Publicité & Marque",
    headline: "L'émotion au service de votre marque",
    body: "Nous créons des contenus publicitaires qui transcendent le format : spots TV, films de marque, campagnes digitales globales. Notre expertise narrative transforme vos valeurs en histoires mémorables. Clients réguliers : Hermès, Louis Vuitton, Chanel, Airbus, L'Oréal Paris.",
    works: [
      { title: "L'Origine", detail: "Hermès · Spot 90s · Cannes Lions 2024" },
      { title: "Revenir", detail: "Louis Vuitton · Campagne globale 60s · 2022" },
      { title: "Altitude", detail: "Airbus · Film institutionnel · 2023" },
      { title: "La Lumière Juste", detail: "L'Oréal Paris · Spot 30s + Digital · 2024" },
    ],
  },
  {
    tab: "Documentaire",
    headline: "Le réel comme matière première, l'art comme révélateur",
    body: "Nos documentaires portent des regards singuliers sur des sujets qui comptent. De la grande forme cinématographique au format série, nous fabriquons des œuvres qui circulent en festivals internationaux, sur les grandes chaînes et sur les plateformes de référence.",
    works: [
      { title: "Forêts Primaires", detail: "National Geographic · 90min · Sundance 2023" },
      { title: "Le Silence des Baleines", detail: "France TV · 52min · Primetime 2022" },
      { title: "Architectes du Possible", detail: "ARTE · 3×52min · Prix Scam · 2024" },
      { title: "Nuit Blanche", detail: "BBC Two · 75min · BAFTA sélection 2025" },
    ],
  },
  {
    tab: "Post-Production",
    headline: "Finition de niveau cinéma, pour tous les formats",
    body: "Notre studio de post-production parisien intègre étalonnage 4K HDR, mixage 5.1 Dolby Atmos, effets visuels, motion design et sous-titrage multilingue. Nous accompagnons également des productions extérieures en prestation technique sur chaque phase de finition.",
    works: [
      { title: "Étalonnage & DCP", detail: "Certification DCI 4K · HDR10 · Dolby Vision" },
      { title: "Mixage Son", detail: "Studio Dolby Atmos 7.1.4 · 200m² · Accrédité" },
      { title: "VFX & Motion Design", detail: "Équipe interne 8 artistes · Real-time Unreal Engine" },
      { title: "Localisation Mondiale", detail: "Sous-titrage 28 langues · VF · VOST · AD" },
    ],
  },
]

const testimonials = [
  {
    quote: "Pelikan a capturé quelque chose que nous n'aurions pas su mettre en mots dans notre brief. Le film 'L'Origine' est aujourd'hui notre référence créative mondiale. C'est de la mise en scène pure, au service de la marque sans jamais lui appartenir.",
    name: "Isabelle Fontaine",
    title: "Directrice de la Création, Hermès",
    avatar: "IF",
  },
  {
    quote: "Le documentaire 'Forêts Primaires' a été sélectionné dans 22 festivals en 18 mois. Ce niveau de rayonnement est le résultat d'un travail éditorial d'une exigence rare — Pelikan sait exactement où se situe la frontière entre le beau et le nécessaire.",
    name: "Marcus Webb",
    title: "Commissioning Editor, National Geographic Europe",
    avatar: "MW",
  },
  {
    quote: "Nous leur avons confié notre première série fiction avec beaucoup d'appréhension. L'équipe Pelikan a su préserver notre ambition d'auteur tout en nous aidant à construire un objet qui tient la distance sur six épisodes. Arte est très fier de cette collaboration.",
    name: "Chloé Martineau",
    title: "Directrice des Programmes Fiction, Arte France",
    avatar: "CM",
  },
  {
    quote: "Leur maîtrise de la post-production est exceptional. L'étalonnage de 'Nocturne' a reçu un prix spécial à la Berlinale pour son traitement photographique. Ce sont des artisans au sens noble du terme.",
    name: "Damien Ortega",
    title: "Directeur Artistique, Festival International du Film de Berlin",
    avatar: "DO",
  },
]

const faqs = [
  {
    q: "Quel est le délai moyen d'une production publicitaire ?",
    a: "Pour un spot publicitaire 30 à 60 secondes, comptez en général 6 à 10 semaines de la signature du devis à la livraison master : 2 semaines de pré-production (casting, repérages, storyboard), 2 à 4 jours de tournage, puis 3 à 4 semaines de post-production. Les productions de marque plus ambitieuses (60-90s avec VFX complexes) s'étendent sur 12 à 16 semaines.",
  },
  {
    q: "Les droits musicaux sont-ils inclus dans le devis ?",
    a: "Nous proposons systématiquement deux options : composition musicale originale par nos compositeurs partenaires (inclus dans les packs supérieurs), ou sélection de droits musicaux existants avec négociation et acquisition des licences synchronisation et master. Les budgets de droits sont toujours présentés séparément avec plusieurs alternatives pour vous permettre de choisir.",
  },
  {
    q: "Proposez-vous le sous-titrage et la version française ?",
    a: "Oui. Notre département localisation gère le sous-titrage dans 28 langues, la version française (VF), la version originale sous-titrée (VOST) et l'audiodescription (AD) pour l'accessibilité. Nous travaillons avec un réseau de traducteurs spécialisés dans le registre cinématographique pour garantir la qualité narrative dans chaque langue.",
  },
  {
    q: "Les rushes bruts sont-ils livrés avec les masters ?",
    a: "La livraison des rushes bruts est négociée au cas par cas. Par défaut, nous livrons les masters finaux dans les formats demandés (DCP, ProRes 4444, H.264/H.265 selon destination) ainsi que les AAF/XML de montage. La mise à disposition des rushes camera originaux peut être incluse dans les contrats de coproduction ou à facturer séparément pour les coproducteurs.",
  },
  {
    q: "Travaillez-vous sur des coproductions internationales ?",
    a: "La coproduction internationale est au cœur de notre développement. Nous avons des accords-cadres actifs avec des producteurs en Belgique, Allemagne, Italie, Suède et Canada. Nous maîtrisons les mécaniques Eurimages, Creative Europe et les treaty co-productions bilatéraux. Notre département développement accompagne les projets dès le stade de l'idée pour construire la structure la plus solide.",
  },
  {
    q: "Comment se déroule un premier contact pour un projet de marque ?",
    a: "Envoyez-nous une description de votre projet — même en quelques lignes — via notre formulaire de contact ou directement par email. Notre directrice commerciale vous répond sous 48h ouvrées pour organiser un premier échange de 30 à 45 minutes. Si l'intention créative est alignée, nous préparons une note d'intention et un budget indicatif sous une semaine, gratuitement et sans engagement.",
  },
]

const pricing = [
  {
    name: "Contenu Digital",
    price: "à partir de 12 000€",
    description: "Spot 60 secondes, motion design inclus, livraison tous formats digitaux",
    features: ["Spot 30 à 60 secondes", "Direction artistique dédiée", "1 journée de tournage", "Motion design & habillage", "Étalonnage cinéma", "Livraison 4K + formats réseaux", "3 rounds de corrections"],
    cta: "Demander un devis",
    highlighted: false,
  },
  {
    name: "Production TV / Cinéma",
    price: "Sur devis",
    description: "Long-métrage, court-métrage, série — budget complet de développement à livraison",
    features: ["Développement éditorial complet", "Coproduction & financement", "Équipe artistique de direction", "Tournage multi-jours / multi-lieux", "Post-production intégrale", "DCP cinéma + masters broadcast", "Dépôt festivals & distribution", "Accompagnement exploitation"],
    cta: "Parlons de votre projet",
    highlighted: true,
  },
  {
    name: "Partenariat Annuel",
    price: "Sur devis",
    description: "Retainer créatif pour marque — disponibilité prioritaire et tarif préférentiel",
    features: ["Volume de production annuel défini", "Disponibilité prioritaire garantie", "Réalisateur dédié à la marque", "Accès studio post-production H24", "Veille créative mensuelle", "Brief réactif 72h", "Rapport de performance trimestriel"],
    cta: "Contacter notre équipe",
    highlighted: false,
  },
]

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center", padding: "0 20px" }}
    >
      <div style={{
        fontSize: "2.75rem", fontWeight: 700, color: C.amber,
        fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic", lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", color: C.muted, marginTop: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function StudioPelikanPage() {
  const { scrollY } = useScroll()
  const heroTitleY = useTransform(scrollY, [0, 600], [0, -70])
  const stripX = useTransform(scrollY, [0, 600], ["0%", "-3%"])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [direction, setDirection] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredProduction, setHoveredProduction] = useState<number | null>(null)

  function goTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }
  function prevTestimonial() {
    const idx = (activeTestimonial - 1 + testimonials.length) % testimonials.length
    setDirection(-1)
    setActiveTestimonial(idx)
  }
  function nextTestimonial() {
    const idx = (activeTestimonial + 1) % testimonials.length
    setDirection(1)
    setActiveTestimonial(idx)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", height: "72px",
          background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)",
        }}
      >
        {/* Animated amber bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
            background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
            transformOrigin: "left",
          }}
        />

        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "4px",
              border: `1.5px solid ${C.amber}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6 8 3 12 3 16a9 9 0 0018 0c0-4-3-8-9-14z" stroke={C.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontSize: "1.1rem", color: C.text, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.1 }}>
                Pelikan
              </div>
              <div style={{ fontSize: "0.55rem", color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Studio de Production
              </div>
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {navLinks.map(link => (
            <a key={link} href="#" style={{ color: C.muted, textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.04em", transition: "color 0.2s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              {link}
            </a>
          ))}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              border: `1px solid ${C.amber}`, color: C.amber,
              padding: "9px 22px", borderRadius: "3px", fontWeight: 600,
              fontSize: "0.8rem", textDecoration: "none", cursor: "pointer",
              letterSpacing: "0.06em", textTransform: "uppercase",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.amberSoft }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
          >
            Votre Projet
          </motion.a>
        </div>
      </motion.nav>

      {/* ── 2. HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000", position: "relative", overflow: "hidden", paddingTop: "72px" }}>
        {/* Subtle grain overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          pointerEvents: "none",
        }} />

        {/* Hero title */}
        <motion.div
          style={{ y: heroTitleY, textAlign: "center", padding: "0 48px", marginBottom: "72px", zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ fontSize: "0.72rem", letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", fontWeight: 600, marginBottom: "28px" }}
          >
            Maison de Production · Paris · Fondée 2011
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(4rem, 9vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: C.text,
              marginBottom: "32px",
            }}
          >
            Raconter<br />
            <span style={{ color: C.amber }}>l'Essentiel</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            style={{
              fontSize: "1.05rem", color: C.muted, maxWidth: "480px",
              margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400,
            }}
          >
            Fiction, documentaire, publicité de prestige. Nous fabriquons des images qui demeurent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, backgroundColor: C.amber }}
              style={{
                display: "inline-block", background: C.amber, color: "#080808",
                padding: "14px 32px", borderRadius: "3px", fontWeight: 700,
                fontSize: "0.85rem", textDecoration: "none", cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              Parlons de votre projet
            </motion.a>
            <motion.a
              href="#productions"
              whileHover={{ scale: 1.02, borderColor: C.text }}
              style={{
                display: "inline-block", color: C.text, border: `1px solid rgba(245,240,232,0.3)`,
                padding: "14px 32px", borderRadius: "3px", fontWeight: 500,
                fontSize: "0.85rem", textDecoration: "none", cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "border-color 0.2s",
              }}
            >
              Voir nos productions
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Film strip */}
        <motion.div
          style={{ x: stripX, width: "100%", padding: "0 48px", zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{ display: "flex", gap: "20px", justifyContent: "center" }}
          >
            {[
              { label: "Fiction", project: "Les Heures Bleues", detail: "Arte France, 2024" },
              { label: "Publicité", project: "L'Origine", detail: "Hermès — Cannes Lions" },
              { label: "Documentaire", project: "Forêts Primaires", detail: "Nat. Geo — Sundance" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, borderColor: "rgba(217,119,6,0.5)" }}
                style={{
                  flex: "1 1 280px", maxWidth: "360px",
                  background: C.card, border: `1px solid rgba(255,255,255,0.06)`,
                  borderRadius: "4px", padding: "28px 24px",
                  cursor: "pointer", transition: "border-color 0.3s",
                }}
              >
                {/* Film perforations */}
                <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} style={{ width: "14px", height: "10px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
                <div style={{
                  display: "inline-block", fontSize: "0.65rem", fontWeight: 700,
                  color: C.amber, letterSpacing: "0.12em", textTransform: "uppercase",
                  marginBottom: "10px", borderBottom: `1px solid ${C.amber}`, paddingBottom: "4px",
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "6px", fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic" }}>
                  {item.project}
                </div>
                <div style={{ fontSize: "0.78rem", color: C.muted }}>{item.detail}</div>
                {/* Film perforations bottom */}
                <div style={{ display: "flex", gap: "5px", marginTop: "20px" }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} style={{ width: "14px", height: "10px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "0.65rem", color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Défiler</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "1px", height: "32px", background: `linear-gradient(to bottom, ${C.amber}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ── 3. STATS BAR ── */}
      <section style={{ background: C.card, borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 48px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "32px" }}>
          {stats.map(s => <StatCounter key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* ── 4. FEATURES / TABS — Productions ── */}
      <section id="productions" style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "60px" }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>Notre savoir-faire</div>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
            fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 700,
            letterSpacing: "-0.01em", lineHeight: 1.1, maxWidth: "560px",
          }}>
            Quatre disciplines,<br />une seule exigence
          </h2>
        </motion.div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "0", marginBottom: "48px", borderBottom: `1px solid rgba(255,255,255,0.08)`, flexWrap: "wrap" }}>
          {features.map((f, i) => (
            <button
              key={f.tab}
              onClick={() => setActiveTab(i)}
              style={{
                background: "none", border: "none", padding: "14px 28px",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
                color: activeTab === i ? C.amber : C.muted,
                borderBottom: activeTab === i ? `2px solid ${C.amber}` : "2px solid transparent",
                marginBottom: "-1px", transition: "all 0.25s",
                letterSpacing: "0.03em", whiteSpace: "nowrap",
              }}
            >
              {f.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}
          >
            <div>
              <h3 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
                fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.2,
                marginBottom: "20px", color: C.text,
              }}>
                {features[activeTab].headline}
              </h3>
              <p style={{ color: C.muted, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "32px" }}>
                {features[activeTab].body}
              </p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02, color: C.amber }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  color: C.text, textDecoration: "none", fontWeight: 600,
                  fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.04em",
                  textTransform: "uppercase", transition: "color 0.2s",
                }}
              >
                Nous contacter
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            </div>

            {/* Hover-reveal production list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {features[activeTab].works.map((work, i) => (
                <motion.div
                  key={work.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onMouseEnter={() => setHoveredProduction(i)}
                  onMouseLeave={() => setHoveredProduction(null)}
                  style={{
                    padding: "20px 0", cursor: "pointer",
                    borderBottom: `1px solid rgba(255,255,255,0.06)`,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Hover color bar */}
                  <motion.div
                    initial={false}
                    animate={{ scaleX: hoveredProduction === i ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
                      background: C.amber, transformOrigin: "left",
                    }}
                  />
                  <motion.div
                    animate={{ x: hoveredProduction === i ? 12 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ paddingLeft: "8px" }}
                  >
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: hoveredProduction === i ? C.text : "rgba(245,240,232,0.8)", marginBottom: "4px", transition: "color 0.2s", fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic" }}>
                      {work.title}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: hoveredProduction === i ? C.amber : C.muted, transition: "color 0.2s" }}>
                      {work.detail}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 5. TESTIMONIALS ── */}
      <section style={{ background: C.card, borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: "64px" }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>Ce qu'ils disent</div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.1,
            }}>
              Des collaborations<br />qui comptent
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "64px", alignItems: "start" }}>
            {/* Main testimonial */}
            <div style={{ position: "relative" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTestimonial}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.45 }}
                >
                  {/* Large quote mark */}
                  <div style={{ fontSize: "6rem", color: C.amber, opacity: 0.3, lineHeight: 0.8, marginBottom: "24px", fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                    "
                  </div>
                  <blockquote style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
                    fontSize: "clamp(1.2rem, 2vw, 1.5rem)", lineHeight: 1.6,
                    color: C.text, marginBottom: "40px", fontWeight: 500,
                  }}>
                    {testimonials[activeTestimonial].quote}
                  </blockquote>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      background: C.amberSoft, border: `1px solid ${C.amber}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.82rem", fontWeight: 800, color: C.amber,
                    }}>
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{testimonials[activeTestimonial].name}</div>
                      <div style={{ fontSize: "0.78rem", color: C.muted, marginTop: "2px" }}>{testimonials[activeTestimonial].title}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "40px" }}>
                <button onClick={prevTestimonial} style={{ background: "none", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted, transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.amber)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => goTestimonial(i)} style={{ width: i === activeTestimonial ? "28px" : "8px", height: "8px", borderRadius: "100px", background: i === activeTestimonial ? C.amber : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                  ))}
                </div>
                <button onClick={nextTestimonial} style={{ background: "none", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted, transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.amber)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            {/* Side — client logos placeholder + awards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "0.65rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Ils nous font confiance</div>
              {["Arte France", "Canal+", "Netflix France", "National Geographic", "Hermès", "Louis Vuitton"].map(client => (
                <div key={client} style={{
                  padding: "12px 16px", border: `1px solid rgba(255,255,255,0.06)`,
                  borderRadius: "4px", fontSize: "0.85rem", color: C.muted,
                  fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}>
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "60px" }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>Nos formules</div>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
            fontSize: "clamp(2.2rem, 4vw, 3.25rem)", fontWeight: 700, lineHeight: 1.1,
          }}>
            Chaque projet mérite<br />sa propre architecture
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "start" }}>
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -4 }}
              style={{
                background: plan.highlighted ? "rgba(217,119,6,0.06)" : C.card,
                border: plan.highlighted ? `1px solid rgba(217,119,6,0.45)` : `1px solid rgba(255,255,255,0.07)`,
                borderRadius: "4px", padding: "36px 32px",
                transform: plan.highlighted ? "scale(1.03)" : "scale(1)",
                position: "relative",
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
                  background: C.amber, color: "#080808", padding: "4px 18px",
                  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", whiteSpace: "nowrap", borderRadius: "2px",
                }}>
                  Notre coeur de métier
                </div>
              )}
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: plan.highlighted ? C.amber : C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                {plan.name}
              </div>
              <div style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
                fontSize: "1.6rem", fontWeight: 700, color: C.text, marginBottom: "10px", lineHeight: 1.2,
              }}>
                {plan.price}
              </div>
              <p style={{ fontSize: "0.82rem", color: C.muted, marginBottom: "28px", lineHeight: 1.6 }}>{plan.description}</p>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: "24px", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "14px", height: "14px", flexShrink: 0, marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.amber }} />
                    </div>
                    <span style={{ fontSize: "0.83rem", color: C.text, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", padding: "13px", borderRadius: "3px",
                  border: plan.highlighted ? "none" : `1px solid rgba(255,255,255,0.12)`,
                  background: plan.highlighted ? C.amber : "transparent",
                  color: plan.highlighted ? "#080808" : C.text,
                  fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  transition: "background 0.2s",
                }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section style={{ background: C.card, borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: "56px" }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.amber, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>Questions fréquentes</div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.1,
            }}>
              Ce que nos clients<br />nous demandent
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                style={{ borderBottom: `1px solid rgba(255,255,255,0.07)`, overflow: "hidden" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "24px 0", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", gap: "20px",
                  }}
                >
                  <span style={{
                    fontWeight: 600, fontSize: "0.95rem", color: openFaq === i ? C.text : "rgba(245,240,232,0.8)",
                    lineHeight: 1.4, fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontStyle: openFaq === i ? "italic" : "normal", transition: "all 0.2s",
                    fontSize: "1rem",
                  }}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke={openFaq === i ? C.amber : C.muted} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ paddingBottom: "24px", color: C.muted, fontSize: "0.9rem", lineHeight: 1.8 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ── */}
      <section id="contact" style={{ background: "#000", borderBottom: `1px solid rgba(255,255,255,0.05)`, position: "relative", overflow: "hidden" }}>
        {/* Decorative amber line */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "1px", height: "100%", background: `linear-gradient(to bottom, ${C.amber}, transparent)`, opacity: 0.15 }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 48px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.amber, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "24px" }}>
              Prenons contact
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic",
              fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 700,
              lineHeight: 1.0, letterSpacing: "-0.01em", marginBottom: "24px", color: C.text,
            }}>
              Parlons de<br />
              <span style={{ color: C.amber }}>Votre Projet</span>
            </h2>
            <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, marginBottom: "52px", maxWidth: "460px", margin: "0 auto 52px" }}>
              Fiction, documentaire ou campagne de marque — partagez-nous votre intention. Notre directrice commerciale vous répond sous 48 heures.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href="mailto:contact@studiopelikan.com"
                whileHover={{ scale: 1.04, boxShadow: `0 0 48px rgba(217,119,6,0.25)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-block", background: C.amber, color: "#080808",
                  padding: "18px 40px", borderRadius: "3px", fontWeight: 800,
                  fontSize: "0.85rem", textDecoration: "none", cursor: "pointer",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}
              >
                Écrire à l'équipe
              </motion.a>
              <motion.a
                href="#productions"
                whileHover={{ scale: 1.02, borderColor: "rgba(245,240,232,0.5)" }}
                style={{
                  display: "inline-block", color: C.text, border: `1px solid rgba(245,240,232,0.2)`,
                  padding: "18px 36px", borderRadius: "3px", fontWeight: 500,
                  fontSize: "0.85rem", textDecoration: "none", cursor: "pointer",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "border-color 0.2s",
                }}
              >
                Voir nos productions
              </motion.a>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "52px", flexWrap: "wrap" }}>
              {["Paris · France", "+33 1 42 XX XX XX", "contact@studiopelikan.com"].map(info => (
                <span key={info} style={{ fontSize: "0.78rem", color: C.muted, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic" }}>
                  {info}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. FOOTER ── */}
      <footer style={{ background: C.bg, borderTop: `1px solid rgba(255,255,255,0.05)`, padding: "64px 48px 44px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "3px", border: `1px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6 8 3 12 3 16a9 9 0 0018 0c0-4-3-8-9-14z" stroke={C.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontSize: "1rem", color: C.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pelikan</div>
                  <div style={{ fontSize: "0.5rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Studio de Production</div>
                </div>
              </div>
              <p style={{ fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, maxWidth: "260px", marginBottom: "24px", fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic" }}>
                Maison de production cinéma, publicité et contenu de marque. Paris, depuis 2011.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {/* Camera */}
                <a href="#" style={{ width: "38px", height: "38px", borderRadius: "3px", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.amber)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                {/* Vimeo */}
                <a href="#" style={{ width: "38px", height: "38px", borderRadius: "3px", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.amber)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}>
                    <path d="M22 7.42c-.09 2.04-1.52 4.83-4.28 8.38C14.89 19.37 12.5 21.14 10.5 21.14c-1.21 0-2.24-1.12-3.07-3.36L5.67 12.6C5.04 10.36 4.35 9.23 3.6 9.23c-.16 0-.74.35-1.72 1.04L1 9.19c1.1-.97 2.18-1.93 3.24-2.91C5.69 4.93 6.78 4.1 7.4 4.05c1.55-.15 2.5.91 2.86 3.17.39 2.44.66 3.96.81 4.56.45 2.04.94 3.06 1.49 3.06.42 0 1.05-.66 1.89-1.99.84-1.33 1.29-2.34 1.35-3.04.12-1.15-.33-1.72-1.35-1.72-.48 0-.97.11-1.49.33.99-3.23 2.88-4.81 5.67-4.72C20.63 3.39 22.11 4.73 22 7.42z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" style={{ width: "38px", height: "38px", borderRadius: "3px", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.amber)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={C.muted}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {[
              { title: "Disciplines", links: ["Fiction & Série", "Publicité & Marque", "Documentaire", "Post-Production", "Développement"] },
              { title: "Studio", links: ["Notre histoire", "L'équipe", "Nos partenaires", "Festivals & Prix", "Presse"] },
              { title: "Contact", links: ["Votre projet", "Casting", "Stages & emploi", "Coproduction", "Presse & médias"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "18px" }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ fontSize: "0.83rem", color: C.muted, textDecoration: "none", cursor: "pointer", transition: "color 0.2s", fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: "italic" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "0.75rem", color: C.muted }}>
              © 2025 Studio Pelikan SAS · 12 rue du Faubourg Saint-Antoine, 75011 Paris · SIRET 499 XXX XXX 00017
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map(link => (
                <a key={link} href="#" style={{ fontSize: "0.75rem", color: C.muted, textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
