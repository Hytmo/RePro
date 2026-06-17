import {getTranslations, setRequestLocale} from 'next-intl/server';
import {searchCompanies, getCategories, getCities} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import CompanyCard from '@/components/CompanyCard';
import SearchFilters from '@/components/SearchFilters';

export default async function SearchPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{[k: string]: string | undefined}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('search');
  const tc = await getTranslations('company');

  const [categories, cities, results] = await Promise.all([
    getCategories(),
    getCities(),
    searchCompanies({
      q: sp.q,
      category: sp.category,
      city: sp.city,
      minRating: sp.minRating ? Number(sp.minRating) : undefined,
      badgedOnly: sp.badged === '1',
      sort: sp.sort
    })
  ]);

  const catOptions = categories.map((c: any) => ({slug: c.slug, label: localizedName(c.name, locale)}));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">{t('title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('resultsCount', {count: results.length})}</p>

      <div className="mt-6">
        <SearchFilters
          categories={catOptions}
          cities={cities}
          labels={{
            category: t('category'),
            allCategories: t('allCategories'),
            city: t('city'),
            allCities: t('allCities'),
            minRating: t('minRating'),
            any: t('any'),
            badgedOnly: t('badgedOnly'),
            sortBy: t('sortBy'),
            relevance: t('relevance'),
            rating: t('rating'),
            reviews: t('reviews'),
            newest: t('newest')
          }}
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-medium text-ink">{t('noResults')}</p>
          <p className="mt-1 text-sm text-muted">{t('noResultsHint')}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((c: any) => (
            <CompanyCard key={c.id} company={c} locale={locale} badgeLabel={tc('verified')} />
          ))}
        </div>
      )}
    </div>
  );
}
