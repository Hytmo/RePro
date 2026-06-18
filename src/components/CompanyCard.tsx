import {Link} from '@/i18n/navigation';
import StarRating from './StarRating';
import VerifiedBadge from './VerifiedBadge';
import {localizedName, initials} from '@/lib/format';

/* eslint-disable @next/next/no-img-element */
export default function CompanyCard({
  company,
  locale,
  badgeLabel
}: {
  company: any;
  locale: string;
  badgeLabel: string;
}) {
  const cats = (company.company_categories ?? [])
    .map((cc: any) => cc.categories)
    .filter(Boolean);
  const topCat = cats[0];

  return (
    <Link
      href={`/company/${company.slug}`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-lux-500),var(--color-brand-500),var(--color-mint-500))] opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink font-black text-white">
          <span className="absolute inset-x-0 top-0 h-1 bg-lux-500" />
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-14 w-14 object-cover" />
          ) : (
            initials(company.name)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-ink group-hover:text-brand-700">
                {company.name}
              </h3>
              <p className="mt-1 truncate text-sm font-medium text-muted">
                {topCat ? localizedName(topCat.name, locale) : ''}
                {company.city ? ` - ${company.city}` : ''}
              </p>
            </div>
            {company.is_badged && <VerifiedBadge label={badgeLabel} />}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <StarRating value={Number(company.rating_avg)} count={company.rating_count} showValue />
            <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft">
              {Math.round(Number(company.recommend_pct ?? 0))}% rec.
            </span>
          </div>
        </div>
      </div>

      {company.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {company.description}
        </p>
      )}
    </Link>
  );
}
