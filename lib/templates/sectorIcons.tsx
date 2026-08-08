/*
  Une icône par métier, dessinée au trait.

  Les cartes du wizard portaient un emoji : le kinésithérapeute était un coureur,
  l'ostéopathe deux mains levées, l'opticien une paire d'yeux, l'audioprothésiste
  une oreille. Un emoji se rend au surplus différemment sur chaque système — le
  client ne voit pas ce qu'on a choisi — et il donne à une page de vente un air
  de brouillon.

  Le jeu ci-dessous vient de Lucide, déjà présent dans le projet : même trait,
  même graisse, même grille que les autres icônes de l'interface. Ce qui n'a pas
  d'icône juste garde la mallette : mieux vaut un signe neutre qu'un signe faux.
*/

import {
  Activity, Anchor, Baby, Bike, Briefcase, Brush, Building2, Cake, Camera, Car,
  ChefHat, Cross, Dog, Droplets, Ear, Eye, Flower2, GraduationCap, Hammer,
  HandHeart, Hotel, Landmark, Laptop, Leaf, Microscope, PaintRoller, PartyPopper,
  Pill, Ruler, Scale, Scissors, Shield, ShoppingBag, Sofa, Sparkles, Stethoscope,
  Syringe, Truck, UtensilsCrossed, Waves, Wheat, Wine, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";

const ICONES: Record<string, LucideIcon> = {
  // Les huit domaines
  sante: Stethoscope,
  services: Wrench,
  restauration: UtensilsCrossed,
  evenementiel: PartyPopper,
  beaute: Sparkles,
  hebergement: Hotel,

  // Santé
  medecin: Stethoscope,
  dentiste: Cross,
  kine: HandHeart,
  osteo: Activity,
  veterinaire: Dog,
  pharmacie: Pill,
  opticien: Eye,
  audioprothesiste: Ear,
  infirmier: Syringe,
  laboratoire: Microscope,
  podologue: Ruler,

  // Services et artisanat
  plombier: Droplets,
  electricien: Zap,
  paysagiste: Leaf,
  pisciniste: Waves,
  menage: Sparkles,
  demenageur: Truck,
  serrurier: Shield,
  pressing: ShoppingBag,
  securite: Shield,
  formation: GraduationCap,
  couvreur: Hammer,
  creche: Baby,
  peintre: PaintRoller,
  vtc: Car,
  vitrier: Building2,
  menuisier: Hammer,
  toiletteur: Dog,
  cuisiniste: Sofa,

  // Droit et finance
  avocat: Scale,
  comptable: Laptop,
  recrutement: Briefcase,
  notaire: Landmark,
  assurance: Shield,

  // Restauration
  restaurant: UtensilsCrossed,
  boulangerie: Wheat,
  brasserie: Wine,
  caviste: Wine,
  producteur: Leaf,
  cuisinier: ChefHat,

  // Sport, art, événementiel, beauté
  coach: Bike,
  tatoueur: Brush,
  couture: Scissors,
  photographe: Camera,
  fleuriste: Flower2,
  bijouterie: Sparkles,
  mariage: Cake,
  coiffeur: Scissors,

  // Immobilier, architecture, hébergement
  architecte: Ruler,
  hotel: Hotel,
  bateau: Anchor,
};

/** L'icône d'un métier ou d'un domaine. La mallette à défaut. */
export function iconeDe(id: string): LucideIcon {
  return ICONES[id] ?? Briefcase;
}
