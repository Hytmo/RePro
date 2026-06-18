import type {LucideIcon} from 'lucide-react';
import {
  BriefcaseBusiness,
  Building2,
  Car,
  GraduationCap,
  Hammer,
  Home,
  Laptop,
  Leaf,
  Paintbrush,
  Plug,
  Scale,
  Scissors,
  Sparkles,
  Store,
  Stethoscope,
  Utensils,
  Wrench
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'ti-building-store': Store,
  'ti-building': Building2,
  'ti-briefcase': BriefcaseBusiness,
  'ti-car': Car,
  'ti-cut': Scissors,
  'ti-hammer': Hammer,
  'ti-home': Home,
  'ti-leaf': Leaf,
  'ti-paint': Paintbrush,
  'ti-paintbrush': Paintbrush,
  'ti-plug': Plug,
  'ti-scale': Scale,
  'ti-school': GraduationCap,
  'ti-sparkles': Sparkles,
  'ti-stethoscope': Stethoscope,
  'ti-tools': Wrench,
  'ti-tool': Wrench,
  'ti-utensils': Utensils,
  'ti-device-laptop': Laptop
};

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
