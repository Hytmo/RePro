import type {LucideIcon} from 'lucide-react';
import {
  Baby, BadgePercent, Bath, Beef, Blocks, BrickWall, Briefcase, Bug, Building, Building2,
  Cake, Calculator, Camera, Car, CarFront, ChefHat, Code, Coffee, Cross, Disc3, DoorOpen,
  Drill, Droplet, Droplets, Dumbbell, Fence, Flame, Flower, Flower2, Glasses, GraduationCap,
  Hammer, Hand, HandPlatter, Handshake, Home, Hotel, Key, KeyRound, Languages, Laptop, Layers,
  Megaphone, Music, Network, PaintRoller, Paintbrush, Palette, PartyPopper, PawPrint, PencilRuler,
  Printer, Recycle, Ruler, Scale, Scissors, Shield, ShieldCheck, Smartphone, Sofa, Sparkles,
  SprayCan, Sprout, Stethoscope, Store, SunMedium, Thermometer, TreeDeciduous, Trees, Truck,
  UtensilsCrossed, Users, Wallpaper, Wine, Wrench, Zap
} from 'lucide-react';

// New categories store the Lucide icon name directly; legacy rows use Tabler-style names.
const BY_NAME: Record<string, LucideIcon> = {
  Baby, BadgePercent, Bath, Beef, Blocks, BrickWall, Briefcase, Bug, Building, Building2,
  Cake, Calculator, Camera, Car, CarFront, ChefHat, Code, Coffee, Cross, Disc3, DoorOpen,
  Drill, Droplet, Droplets, Dumbbell, Fence, Flame, Flower, Flower2, Glasses, GraduationCap,
  Hammer, Hand, HandPlatter, Handshake, Home, Hotel, Key, KeyRound, Languages, Laptop, Layers,
  Megaphone, Music, Network, PaintRoller, Paintbrush, Palette, PartyPopper, PawPrint, PencilRuler,
  Printer, Recycle, Ruler, Scale, Scissors, Shield, ShieldCheck, Smartphone, Sofa, Sparkles,
  SprayCan, Sprout, Stethoscope, Store, SunMedium, Thermometer, TreeDeciduous, Trees, Truck,
  UtensilsCrossed, Users, Wallpaper, Wine, Wrench, Zap
};

const LEGACY: Record<string, LucideIcon> = {
  'ti-droplet': Droplet,
  'ti-bolt': Zap,
  'ti-home-2': Home,
  'ti-brush': Paintbrush,
  'ti-car': Car,
  'ti-scissors': Scissors,
  'ti-tools-kitchen-2': UtensilsCrossed,
  'ti-spray': SprayCan,
  'ti-truck': Truck,
  'ti-ruler-2': Ruler,
  'ti-calculator': Calculator,
  'ti-plant-2': Sprout,
  'ti-temperature': Thermometer,
  'ti-device-laptop': Laptop,
  'ti-building-store': Store
};

const ICONS: Record<string, LucideIcon> = {...BY_NAME, ...LEGACY};

export default function CategoryIcon({
  icon,
  className = 'h-5 w-5'
}: {
  icon?: string | null;
  className?: string;
}) {
  const Icon = ICONS[icon ?? ''] ?? Building2;
  return <Icon className={className} aria-hidden="true" strokeWidth={2.2} />;
}
