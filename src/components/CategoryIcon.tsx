import type {LucideIcon} from 'lucide-react';
import {
  Building2,
  Calculator,
  Car,
  Droplet,
  Home,
  Laptop,
  Paintbrush,
  Ruler,
  Scissors,
  Sprout,
  SprayCan,
  Store,
  Thermometer,
  Truck,
  UtensilsCrossed,
  Zap
} from 'lucide-react';

// Maps the category `icon` field (Tabler-style names stored in the DB) to a
// distinct Lucide icon per trade.
const ICONS: Record<string, LucideIcon> = {
  'ti-droplet': Droplet,                  // plumbers
  'ti-bolt': Zap,                         // electricians
  'ti-home-2': Home,                      // roofers
  'ti-brush': Paintbrush,                 // painters
  'ti-car': Car,                          // garages & auto
  'ti-scissors': Scissors,                // hairdressers
  'ti-tools-kitchen-2': UtensilsCrossed,  // restaurants
  'ti-spray': SprayCan,                   // cleaning
  'ti-truck': Truck,                      // movers
  'ti-ruler-2': Ruler,                    // architects
  'ti-calculator': Calculator,            // accountants
  'ti-plant-2': Sprout,                   // gardeners
  'ti-temperature': Thermometer,          // heating & HVAC
  'ti-device-laptop': Laptop,             // IT services
  'ti-building-store': Store
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
