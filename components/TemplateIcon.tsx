import {
  Flame, Thermometer, Snowflake, Wrench, Trophy, Target, Phone, MapPin,
  Mail, Clock, Truck, Package, Timer, Droplets, Wind, Home, Factory,
  Shield, Hammer, Globe, Zap, Check, CheckCircle2, Sparkles, Tag,
  ShoppingBag, Search, Leaf, Heart, Sprout, Star, Award, BarChart3,
  Lightbulb, Key, Users, Smartphone, Monitor, TrendingUp, Palette, Link,
  Layers, PartyPopper, Cog, Rocket, Film, TreePine, Gem, Bell, Newspaper,
  ChevronRight, Circle, type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

const EMOJI_ICON_MAP: Record<string, LucideIcon> = {
  "🔥": Flame,
  "♨️": Thermometer,
  "❄️": Snowflake,
  "🛠️": Wrench,
  "🏆": Trophy,
  "🎯": Target,
  "📞": Phone,
  "📍": MapPin,
  "✉️": Mail,
  "🕐": Clock, "🕑": Clock, "🕒": Clock, "🕓": Clock, "🕔": Clock,
  "🚚": Truck,
  "🚛": Truck,
  "💧": Droplets,
  "🌬️": Wind,
  "🏚️": Home,
  "🏠": Home,
  "🏡": Home,
  "📦": Package,
  "⏱️": Timer,
  "🏭": Factory,
  "🛡️": Shield,
  "⚒️": Hammer,
  "⬛": Circle,
  "🔲": Circle,
  "🔵": Circle,
  "🔴": Circle,
  "🌍": Globe,
  "🌐": Globe,
  "⚡": Zap,
  "✓": Check,
  "✅": CheckCircle2,
  "✨": Sparkles,
  "🏷️": Tag,
  "🛍️": ShoppingBag,
  "🔍": Search,
  "🌿": Leaf,
  "🔧": Wrench,
  "❤️": Heart,
  "🤍": Heart,
  "🌱": Sprout,
  "⭐": Star,
  "🌟": Star,
  "🏅": Award,
  "💡": Lightbulb,
  "🔑": Key,
  "👥": Users,
  "📱": Smartphone,
  "🖥️": Monitor,
  "📈": TrendingUp,
  "🎨": Palette,
  "🔗": Link,
  "🧱": Layers,
  "🎉": PartyPopper,
  "🔩": Cog,
  "⚙️": Cog,
  "🚀": Rocket,
  "🎬": Film,
  "📰": Newspaper,
  "🪵": TreePine,
  "🚨": Bell,
  "🌡️": Thermometer,
  "💎": Gem,
  "📊": BarChart3,
  "▸": ChevronRight,
};

interface TemplateIconProps {
  emoji: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function TemplateIcon({ emoji, size = 24, color, style, className }: TemplateIconProps) {
  const Icon = EMOJI_ICON_MAP[emoji];
  if (!Icon) {
    return <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>{emoji}</span>;
  }
  return <Icon size={size} color={color} style={style} className={className} />;
}
