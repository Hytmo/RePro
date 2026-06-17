'use client';

import {useState} from 'react';
import {useRouter} from '@/i18n/navigation';

export default function SearchBar({
  placeholder,
  locationPlaceholder,
  buttonLabel,
  defaultQ = '',
  defaultCity = '',
  size = 'lg'
}: {
  placeholder: string;
  locationPlaceholder: string;
  buttonLabel: string;
  defaultQ?: string;
  defaultCity?: string;
  size?: 'lg' | 'sm';
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [city, setCity] = useState(defaultCity);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const pad = size === 'lg' ? 'py-3' : 'py-2';
  return (
    <form
      onSubmit={submit}
      className="mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm sm:flex-row"
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 ${pad} text-sm outline-none placeholder:text-muted`}
      />
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={locationPlaceholder}
        className={`w-full rounded-xl px-4 ${pad} text-sm outline-none placeholder:text-muted sm:max-w-[40%] sm:border-l sm:border-border`}
      />
      <button
        type="submit"
        className={`rounded-xl bg-brand-600 px-6 ${pad} text-sm font-semibold text-white transition hover:bg-brand-700`}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
