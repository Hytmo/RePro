'use client';

import {useId, useState} from 'react';
import {MapPin, Search} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';

export default function SearchBar({
  placeholder,
  locationPlaceholder,
  buttonLabel,
  serviceLabel = 'Service',
  locationLabel = 'Commune',
  defaultQ = '',
  defaultCity = '',
  size = 'lg'
}: {
  placeholder: string;
  locationPlaceholder: string;
  buttonLabel: string;
  serviceLabel?: string;
  locationLabel?: string;
  defaultQ?: string;
  defaultCity?: string;
  size?: 'lg' | 'sm';
}) {
  const router = useRouter();
  const serviceId = useId();
  const locationId = useId();
  const [q, setQ] = useState(defaultQ);
  const [city, setCity] = useState(defaultCity);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const compact = size === 'sm';

  return (
    <form
      onSubmit={submit}
      className={`repro-card mx-auto grid w-full max-w-3xl gap-2 rounded-lg p-2 sm:grid-cols-[1.35fr_0.9fr_auto] ${
        compact ? '' : 'shadow-2xl shadow-brand-900/10'
      }`}
    >
      <label
        htmlFor={serviceId}
        className="group flex min-h-[3.75rem] items-center gap-3 rounded-md bg-white px-4 ring-1 ring-transparent transition focus-within:ring-brand-300"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
          <Search className="h-4 w-4" aria-hidden="true" strokeWidth={2.3} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase text-muted">{serviceLabel}</span>
          <input
            id={serviceId}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent py-1 text-[15px] font-medium text-ink outline-none placeholder:text-muted"
          />
        </span>
      </label>

      <label
        htmlFor={locationId}
        className="group flex min-h-[3.75rem] items-center gap-3 rounded-md bg-white px-4 ring-1 ring-transparent transition focus-within:ring-brand-300"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-ink-soft">
          <MapPin className="h-4 w-4" aria-hidden="true" strokeWidth={2.3} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase text-muted">{locationLabel}</span>
          <input
            id={locationId}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={locationPlaceholder}
            className="w-full bg-transparent py-1 text-[15px] font-medium text-ink outline-none placeholder:text-muted"
          />
        </span>
      </label>

      <button
        type="submit"
        className="min-h-[3.75rem] rounded-md bg-ink px-7 text-sm font-black text-white transition hover:bg-brand-700"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
