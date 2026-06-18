'use client';

import {useRouter} from '@/i18n/navigation';
import {useSearchParams} from 'next/navigation';

type Cat = {slug: string; label: string};
type Group = {slug: string; label: string; allLabel: string; children: Cat[]};

export default function SearchFilters({
  groups,
  cities,
  labels
}: {
  groups: Group[];
  cities: string[];
  labels: {
    category: string;
    allCategories: string;
    city: string;
    allCities: string;
    minRating: string;
    any: string;
    badgedOnly: string;
    sortBy: string;
    relevance: string;
    rating: string;
    reviews: string;
    newest: string;
  };
}) {
  const router = useRouter();
  const sp = useSearchParams();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const selectClass =
    'h-11 rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink-soft outline-none transition hover:border-brand-300 focus:ring-2 focus:ring-brand-300';

  return (
    <div className="repro-panel rounded-lg p-3">
      <div className="grid gap-3 md:grid-cols-[1fr_0.85fr_0.7fr_0.8fr_auto] md:items-center">
        <Filter label={labels.category}>
          <select
            className={selectClass}
            value={sp.get('category') ?? ''}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="">{labels.allCategories}</option>
            {groups.map((g) => (
              <optgroup key={g.slug} label={g.label}>
                <option value={g.slug}>{g.allLabel}</option>
                {g.children.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Filter>

        <Filter label={labels.city}>
          <select
            className={selectClass}
            value={sp.get('city') ?? ''}
            onChange={(e) => update('city', e.target.value)}
          >
            <option value="">{labels.allCities}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label={labels.minRating}>
          <select
            className={selectClass}
            value={sp.get('minRating') ?? ''}
            onChange={(e) => update('minRating', e.target.value)}
          >
            <option value="">{labels.any}</option>
            <option value="3">3.0+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </Filter>

        <Filter label={labels.sortBy}>
          <select
            className={selectClass}
            value={sp.get('sort') ?? ''}
            onChange={(e) => update('sort', e.target.value)}
          >
            <option value="">{labels.relevance}</option>
            <option value="rating">{labels.rating}</option>
            <option value="reviews">{labels.reviews}</option>
            <option value="newest">{labels.newest}</option>
          </select>
        </Filter>

        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-bold text-ink-soft transition hover:border-brand-300">
          <input
            type="checkbox"
            checked={sp.get('badged') === '1'}
            onChange={(e) => update('badged', e.target.checked ? '1' : null)}
            className="h-4 w-4 rounded border-border text-brand-600"
          />
          {labels.badgedOnly}
        </label>
      </div>
    </div>
  );
}

function Filter({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="grid gap-1">
      <span className="px-1 text-[11px] font-black uppercase text-muted">{label}</span>
      {children}
    </label>
  );
}
