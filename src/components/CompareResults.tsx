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
  noReviewsLabel = 'No reviews yet',
  labels
}: {
  companies: any[];
  locale: string;
  badgeLabel: string;
  noReviewsLabel?: string;
  labels: {select: string; compareCta: string; clear: string};
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((s) =>
      s.includes(slug) ? s.filter((x) => x !== slug) : s.length < 3 ? [...s, slug] : s
    );
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {companies.map((company) => {
          const cats = (company.company_categories ?? [])
            .map((cc: any) => cc.categories)
            .filter(Boolean);
          const topCat = cats[0];
          const checked = selected.includes(company.slug);

          return (
            <article
              key={company.id}
              className={`relative overflow-hidden rounded-lg border bg-white p-5 transition ${
                checked
                  ? 'border-brand-400 shadow-xl shadow-brand-900/10'
                  : 'border-border hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5'
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-lux-500),var(--color-brand-500),var(--color-mint-500))]" />
              <label className="absolute right-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(company.slug)}
                  className="h-4 w-4 rounded border-border text-brand-600"
                />
                {labels.select}
              </label>

              <Link href={`/company/${company.slug}`} className="block pr-24">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink font-black text-white">
                    <span className="absolute inset-x-0 top-0 h-1 bg-lux-500" />
                    {initials(company.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-black text-ink">{company.name}</h3>
                      {company.is_badged && <VerifiedBadge label={badgeLabel} />}
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-muted">
                      {topCat ? localizedName(topCat.name, locale) : ''}
                      {company.city ? ` - ${company.city}` : ''}
                    </p>
                    <div className="mt-3">
                      {Number(company.rating_count) > 0 ? (
                        <StarRating
                          value={Number(company.rating_avg)}
                          count={company.rating_count}
                          showValue
                        />
                      ) : (
                        <span className="text-xs font-semibold text-muted">{noReviewsLabel}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {selected.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="shell flex items-center justify-between gap-3">
            <button
              onClick={() => setSelected([])}
              className="rounded-full px-3 py-2 text-sm font-bold text-muted transition hover:bg-surface hover:text-ink"
            >
              {labels.clear}
            </button>
            <button
              onClick={() => router.push(`/compare?ids=${selected.join(',')}`)}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
            >
              {labels.compareCta} ({selected.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
