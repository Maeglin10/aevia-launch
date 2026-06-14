"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, FlaskConical, Microscope, Shield, Scissors, Zap } from "lucide-react";

export const PROTOCOLS = [
  {
    id: "sculpt", icon: Sparkles, label: "Sculpture faciale",
    title: "Redéfinition volumétrique avancée",
    desc: "Protocole combinant acide hyaluronique rhéologique, toxine botulique graduée et micro-canules de précision pour un remodelage facial complet aux résultats naturels et durables.",
    fullDesc: "Notre protocole de sculpture faciale est conçu pour restaurer les volumes perdus avec l'âge, redéfinir les contours du visage et harmoniser les proportions faciales selon les canons de la beauté médicale. Chaque séance est précédée d'une analyse morphologique numérisée en 3D.",
    duration: "90 min", recovery: "48h",
    results: "Visibles dès J+3, optimaux à 3 semaines",
    price: "À partir de 890 €",
    detail: ["Remodelage mandibulaire", "Restauration pommettes", "Correction cernes", "Redéfinition ovale"]
  },
  {
    id: "bio", icon: FlaskConical, label: "Bioregénération",
    title: "Régénération cellulaire de quatrième génération",
    desc: "Protocole de régénération cellulaire profonde : PRP autologue, polynucléotides PDRN et mésothérapie à base de vitamines liposomales. Amélioration mesurable de la qualité cutanée.",
    fullDesc: "La bioregénération CypherClinic combine les avancées de la biologie cellulaire et de la dermatologie régénérative. Le PRP lymphocytaire issu de votre propre sang active les facteurs de croissance naturels, tandis que les polynucléotides PDRN stimulent la synthèse de collagène en profondeur.",
    duration: "75 min", recovery: "24h",
    results: "Amélioration progressive sur 3 séances",
    price: "À partir de 650 €",
    detail: ["PRP lymphocytaire", "Polynucléotides PDRN", "Vitamines liposomales", "Enzyme complex"]
  },
  {
    id: "laser", icon: Microscope, label: "Lasers médicaux",
    title: "Photothérapie et resurfaçage de précision",
    desc: "Gamme Quanta System Q-YAG 5 et CO2 fractionné Acupulse. Traitement des lésions pigmentaires, rosacée, cicatrices et resurfaçage anti-âge avec résultats permanents.",
    fullDesc: "Notre parc laser médical est parmi les plus complets de Paris. Le laser Q-switched Nd:YAG cible les hyperpigmentations et le mélasma avec une précision nanométrique. Le CO2 fractionné Acupulse réalise un resurfaçage thermique contrôlé qui stimule la néocollagénogénèse.",
    duration: "45 – 90 min", recovery: "3 – 7 jours",
    results: "Permanents après 3 à 5 séances",
    price: "À partir de 350 €/séance",
    detail: ["Q-switched Nd:YAG", "CO2 fractionné", "IPL M22 Lumenis", "LLLT biostimulation"]
  },
  {
    id: "cyber", icon: Shield, label: "CypherSkin™",
    title: "Notre protocole signature exclusif",
    desc: "Développé en 2021 avec l'Institut de Biochimie de Paris, CypherSkin combine 6 technologies en une séance pour obtenir des résultats visibles dès J+7 et durables 18 mois.",
    fullDesc: "CypherSkin™ est notre réponse à la demande de traitements globaux à séance unique. En combinant séquentiellement radiofréquence fractionnée, ultrasons focalisés HIFU, LED thérapeutique rouge et infrarouge, cryolifting, électroporation et mésothérapie sans aiguille, ce protocole agit sur l'ensemble des couches de la peau.",
    duration: "120 min", recovery: "72h",
    results: "Visibles dès J+7, durables 18 mois",
    price: "1 200 €/séance",
    detail: ["Radiofréquence fractionnée", "Ultrasons focalisés", "LED thérapeutique", "Cryolifting"]
  },
  {
    id: "thread", icon: Scissors, label: "Thread Lifting",
    title: "Lifting sans bistouri aux fils tenseurs",
    desc: "Technique de lifting non chirurgical par fils tenseurs résorbables PDO. Repositionnement des tissus ptosés, stimulation collagénique longue durée, sans cicatrice et sans anesthésie générale.",
    fullDesc: "Le thread lifting utilise des fils résorbables en poly-dioxanone (PDO) ou PLLA pour repositionner mécaniquement les tissus tombants et stimuler la production de collagène sur 12 à 18 mois. Technique miniinvasive réalisée sous anesthésie locale, le résultat est immédiat et s'améliore dans les semaines suivantes.",
    duration: "60 min", recovery: "5 – 7 jours",
    results: "Durables 18 à 24 mois",
    price: "À partir de 1 200 €",
    detail: ["Fils PDO résorbables", "Fils PLLA structurants", "Anesthésie locale", "Zéro cicatrice visible"]
  },
  {
    id: "cryo", icon: Zap, label: "Cryolipolyse",
    title: "Réduction ciblée des graisses rebelles",
    desc: "Élimination non invasive des adipocytes par refroidissement contrôlé à -5°C. Résultats permanents sur les zones ciblées, approuvé CE médical, sans chirurgie ni éviction sociale.",
    fullDesc: "La cryolipolyse (CoolSculpting® Elite) permet de détruire définitivement 20 à 25 % des cellules graisseuses d'une zone ciblée en une seule séance. Le froid contrôlé provoque l'apoptose sélective des adipocytes, éliminés naturellement par le système lymphatique sur 6 à 12 semaines.",
    duration: "60 min/zone", recovery: "Aucune éviction",
    results: "-20 à 25% de graisses par zone",
    price: "500 € / zone",
    detail: ["CoolSculpting® Elite", "Double applicateur", "Résultats permanents", "Aucune anesthésie"]
  },
];

export const SPECIALISTS = [
  {
    name: "Dr. Alexandre Noir", spec: "Médecin esthétique · Lasers",
    shortBio: "Interne médecine AP-HP · DU Médecine esthétique Paris VI",
    fullBio: "Le Dr. Alexandre Noir a effectué son internat en médecine au sein de l'Assistance Publique – Hôpitaux de Paris avant de se spécialiser en médecine esthétique avec un Diplôme Universitaire obtenu à Paris VI. Orateur régulier à l'IMCAS World Congress, il cumule 15 années d'expérience clinique et a formé plus de 200 confrères aux techniques d'injection de précision. Expert en lasers médicaux, il dirige le protocole CypherSkin™.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&fit=crop",
    certifications: ["IMCAS Speaker", "Formateur référent", "DU Paris VI"],
    experience: "15 ans d'expérience"
  },
  {
    name: "Dr. Valentine Huang", spec: "Dermatologue spécialisée",
    shortBio: "DES Dermatologie Paris V · Fellowship IMCAS Singapore",
    fullBio: "Le Dr. Valentine Huang est dermatologue titulaire d'un Diplôme d'Études Spécialisées de l'Université Paris V. Son fellowship à Singapour sous la direction du Pr. Goh Chee Leok lui a permis d'acquérir une expertise mondiale en dermatologie régénérative et traitements laser avancés. Elle prend en charge les pathologies complexes de la peau et supervise les protocoles de bioregénération.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop",
    certifications: ["DES Dermatologie", "Fellowship Singapore", "Membre SFD"],
    experience: "11 ans d'expérience"
  },
  {
    name: "Dr. Marc Duval", spec: "Chirurgien plasticien",
    shortBio: "DESC Chirurgie plastique Pitié-Salpêtrière · FMH Lausanne",
    fullBio: "Le Dr. Marc Duval a réalisé son DESC de Chirurgie Plastique, Reconstructrice et Esthétique à l'Hôpital de la Pitié-Salpêtrière. Titulaire du titre de spécialiste FMH (Fédération des Médecins Suisses) en chirurgie plastique, il apporte à Cypher Clinic une expertise rare en techniques mini-invasives et en thread lifting. Il assure également les consultations préopératoires pour les patients envisageant une chirurgie.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop",
    certifications: ["DESC Chirurgie plastique", "FMH Lausanne", "SOFCPRE"],
    experience: "18 ans d'expérience"
  },
];

export const NURSES = [
  {
    name: "Sophie Laurent", role: "Infirmière coordinatrice",
    bio: "Diplômée en soins infirmiers, spécialisée en oncologie esthétique et coordination de parcours patient. 8 ans d'expérience en clinique esthétique haut de gamme.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&fit=crop"
  },
  {
    name: "Camille Roux", role: "Infirmière coordinatrice",
    bio: "Infirmière DE avec formation complémentaire en soins post-opératoires et accompagnement psychologique du patient esthétique. Référente protocoles CypherSkin™.",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80&fit=crop"
  },
];

export const TESTIMONIALS = [
  {
    name: "C. M.", age: "44 ans", protocol: "Sculpture faciale", stars: 5,
    text: "Résultat d'une naturalité absolue. Mon entourage me demande si j'ai changé de coupe. C'est exactement ce que je souhaitais. L'équipe a pris le temps de comprendre ce que je voulais vraiment, sans jamais me pousser à en faire plus."
  },
  {
    name: "S. T.", age: "38 ans", protocol: "CypherSkin™", stars: 5,
    text: "Après 3 séances de lasers et 2 CypherSkin, ma peau a une texture que je n'avais pas à 25 ans. Protocole rigoureux, équipe exceptionnelle. Le suivi photographique m'a permis de constater objectivement les progrès."
  },
  {
    name: "E. B.", age: "51 ans", protocol: "Bioregénération", stars: 5,
    text: "La qualité du suivi est remarquable. Chaque séance commence par une analyse objective. On voit les résultats se construire semaine après semaine. Je recommande Cypher Clinic les yeux fermés."
  },
  {
    name: "A. V.", age: "42 ans", protocol: "Thread Lifting", stars: 5,
    text: "J'appréhendais le thread lifting mais le Dr. Duval m'a tout expliqué en détail avant de commencer. Résultat naturel et lifting visible dès le lendemain. Cinq ans de moins sans avoir l'air 'faite'."
  },
  {
    name: "L. F.", age: "35 ans", protocol: "Cryolipolyse", stars: 5,
    text: "Deux zones traitées, résultats visibles à 8 semaines. Aucune douleur, aucune éviction sociale. L'équipe était à l'écoute et professionnelle tout au long du protocole. Je suis très satisfaite."
  },
];

export function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
