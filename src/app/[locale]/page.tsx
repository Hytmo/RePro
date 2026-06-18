import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import SearchBar from '@/components/SearchBar';
import CompanyCard from '@/components/CompanyCard';
import CategoryIcon from '@/components/CategoryIcon';
import {getCategoryTree, searchCompanies} from '@/lib/queries';
import {localizedName} from '@/lib/format';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('company');
  const sectors = await getCategoryTree();
  const featured = (await searchCompanies({sort: 'rating'})).slice(0, 3);
  const reviewCount = featured.reduce((sum: number, c: any) => sum + Number(c.rating_count ?? 0), 0);

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="shell py-12 lg:py-16">
          {/* Full-width search, sitting beneath the header with margin */}
          <SearchBar
            placeholder={t('searchPlaceholder')}
            locationPlaceholder={t('searchLocationPlaceholder')}
            buttonLabel={t('searchButton')}
            serviceLabel={t('serviceLabel')}
            locationLabel={t('locationLabel')}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="min-w-0">
              <span className="repro-kicker">
                <span className="h-2 w-2 rounded-full bg-mint-500" />
                {t('kicker')}
              </span>
              <h1 className="mt-5 max-w-3xl text-[clamp(2.35rem,6vw,4.8rem)] font-black leading-[0.96] tracking-tight text-ink">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="repro-panel min-w-0 rounded-lg p-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-bold uppercase text-muted">{t('snapshotLabel')}</p>
                  <p className="mt-1 text-lg font-black text-ink">{t('snapshotTitle')}</p>
                </div>
                <div className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
                  {t('liveMvp')}
                </div>
              </div>

              <div className="grid gap-3 py-5 sm:grid-cols-3">
                <Metric value={featured.length.toString()} label={t('topMatches')} />
                <Metric value={reviewCount.toString()} label={t('sampleReviews')} />
                <Metric value="0" label={t('paidRankBoosts')} />
              </div>

              <div className="space-y-3">
                {featured.map((company: any, index: number) => (
                  <Link
                    key={company.id}
                    href={`/company/${company.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-4 py-3 transition hover:border-brand-300"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-700">
                          {index + 1}
                        </span>
                        <p className="truncate font-bold text-ink">{company.name}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted">
                        {company.city} - {t('reviewCount', {count: Number(company.rating_count)})}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-400/20 px-2.5 py-1 text-xs font-black text-ink">
                      {Number(company.rating_avg).toFixed(1)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-muted">{t('popularCategories')}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
              {t('categoryHeading')}
            </h2>
          </div>
          <Link href="/categories" className="text-sm font-bold text-brand-700 hover:underline">
            {t('viewAllCategories')}
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sectors.map((c: any) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group rounded-lg border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface text-brand-700 transition group-hover:bg-brand-50">
                <CategoryIcon icon={c.icon} />
              </span>
              <span className="mt-4 block text-sm font-black text-ink">
                {localizedName(c.name, locale)}
              </span>
              <span className="mt-1 block text-xs font-medium text-muted">
                {t('servicesCount', {count: c.children.length})}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <ValueCard title={t('valueProps.verifiedTitle')} text={t('valueProps.verifiedText')} />
          <ValueCard title={t('valueProps.multiTitle')} text={t('valueProps.multiText')} />
          <ValueCard title={t('valueProps.transparentTitle')} text={t('valueProps.transparentText')} />
        </div>
      </section>

      <section className="shell py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-muted">{t('exploreKicker')}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">{t('featuredHeading')}</h2>
          </div>
          <Link href="/search?sort=rating" className="text-sm font-bold text-brand-700 hover:underline">
            {t('seeSearch')}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featured.map((company: any) => (
            <CompanyCard
              key={company.id}
              company={company}
              locale={locale}
              badgeLabel={tc('verified')}
              noReviewsLabel={tc('noReviewsYet')}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function Metric({value, label}: {value: string; label: string}) {
  return (
    <div className="rounded-lg bg-white p-4">
      <p className="text-2xl font-black text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase text-muted">{label}</p>
    </div>
  );
}

function ValueCard({title, text}: {title: string; text: string}) {
  return (
    <div className="repro-card rounded-lg p-6">
      <div className="h-1.5 w-10 rounded-full bg-[linear-gradient(90deg,var(--color-lux-500),var(--color-brand-500))]" />
      <h3 className="mt-5 text-lg font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
