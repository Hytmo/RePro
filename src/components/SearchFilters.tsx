'use client';

import {useRouter} from '@/i18n/navigation';
import {useSearchParams} from 'next/navigation';

type Cat = {slug: string; label: string};

export default function SearchFilters({
  categories,
  cities,
  labels
}: {
  categories: Cat[];
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

  const sel =
    'rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink-soft outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className={sel} value={sp.get('category') ?? ''} onChange={(e) => update('category', e.target.value)}>
        <option value="">{labels.allCategories}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>

      <select className={sel} value={sp.get('city') ?? ''} onChange={(e) => update('city', e.target.value)}>
        <option value="">{labels.allCities}</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select className={sel} value={sp.get('minRating') ?? ''} onChange={(e) => update('minRating', e.target.value)}>
        <option value="">{labels.minRating}: {labels.any}</option>
        <option value="3">3.0+</option>
        <option value="4">4.0+</option>
        <option value="4.5">4.5+</option>
      </select>

      <select className={sel} value={sp.get('sort') ?? ''} onChange={(e) => update('sort', e.target.value)}>
        <option value="">{labels.relevance}</option>
        <option value="rating">{labels.rating}</option>
        <option value="reviews">{labels.reviews}</option>
        <option value="newest">{labels.newest}</option>
      </select>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={sp.get('badged') === '1'}
          onChange={(e) => update('badged', e.target.checked ? '1' : null)}
          className="h-4 w-4 rounded border-border text-brand-600"
        />
        {labels.badgedOnly}
      </label>
    </div>
  );
}
