'use client';

import {useState} from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import StarRating from './StarRating';
import VerifiedBadge from './VerifiedBadge';
import {localizedName, initials} from '@/lib/format';

export default function CompareResults({
  companies,
  locale,
  badgeLabel,
  labels
}: {
  companies: any[];
  locale: string;
  badgeLabel: string;
  labels: {select: string; compareCta: string; clear: string};
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length < 3 ? [...s, slug] : s));
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {companies.map((company) => {
          const cats = (company.company_categories ?? []).map((cc: any) => cc.categories).filter(Boolean);
          const topCat = cats[0];
          const checked = selected.includes(company.slug);
          return (
            <div key={company.id} className={`relative rounded-2xl border bg-background p-5 transition ${checked ? 'border-brand-400' : 'border-border'}`}>
              <label className="absolute right-4 top-4 flex cursor-pointer items-center gap-1.5 text-xs text-muted">
                <input type="checkbox" checked={checked} onChange={() => toggle(company.slug)} className="h-4 w-4 rounded border-border text-brand-600" />
                {labels.select}
              </label>
              <Link href={`/company/${company.slug}`} className="block">
                <div className="flex items-start gap-3 pr-20">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 font-semibold text-brand-700">{initials(company.name)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-ink">{company.name}</h3>
                      {company.is_badged && <VerifiedBadge label={badgeLabel} />}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">{topCat ? localizedName(topCat.name, locale) : ''}{company.city ? ` · ${company.city}` : ''}</p>
                    <div className="mt-2"><StarRating value={Number(company.rating_avg)} count={company.rating_count} showValue /></div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {selected.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <button onClick={() => setSelected([])} className="text-sm text-muted hover:text-ink">{labels.clear}</button>
            <button onClick={() => router.push(`/compare?ids=${selected.join(',')}`)} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
              {labels.compareCta} ({selected.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
