import {BadgeCheck} from 'lucide-react';

export default function VerifiedBadge({label}: {label: string}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mint-500/25 bg-mint-500/10 px-2.5 py-1 text-xs font-black text-mint-600">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.4} />
      {label}
    </span>
  );
}
