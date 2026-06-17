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
      className="group block rounded-2xl border border-border bg-background p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-100 font-semibold text-brand-700">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-12 w-12 object-cover" />
          ) : (
            initials(company.name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-ink group-hover:text-brand-700">
              {company.name}
            </h3>
            {company.is_badged && <VerifiedBadge label={badgeLabel} />}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">
            {topCat ? localizedName(topCat.name, locale) : ''}
            {company.city ? ` · ${company.city}` : ''}
          </p>
          <div className="mt-2">
            <StarRating value={Number(company.rating_avg)} count={company.rating_count} showValue />
          </div>
        </div>
      </div>
      {company.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {company.description}
        </p>
      )}
    </Link>
  );
}
