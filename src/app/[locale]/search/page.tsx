import {getTranslations, setRequestLocale} from 'next-intl/server';
import {searchCompanies, getCategoryTree, getCities} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import SearchFilters from '@/components/SearchFilters';
import CompareResults from '@/components/CompareResults';

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
  const tcmp = await getTranslations('compare');

  const [tree, cities, results] = await Promise.all([
    getCategoryTree(),
    getCities(),
    searchCompanies({q: sp.q, category: sp.category, city: sp.city, minRating: sp.minRating ? Number(sp.minRating) : undefined, badgedOnly: sp.badged === '1', sort: sp.sort})
  ]);
  const groups = tree.map((s: any) => {
    const label = localizedName(s.name, locale);
    return {
      slug: s.slug,
      label,
      allLabel: t('sectorAll', {name: label}),
      children: s.children.map((c: any) => ({slug: c.slug, label: localizedName(c.name, locale)}))
    };
  });

  return (
    <div className="shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <span className="repro-kicker">{t('kicker')}</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink md:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm font-medium text-muted">
            {t('resultsCount', {count: results.length})}
          </p>
        </div>
        <div className="rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white">
          {t('noPaidRanking')}
        </div>
      </div>

      <div className="mt-6">
        <SearchFilters
          groups={groups}
          cities={cities}
          labels={{category: t('category'), allCategories: t('allCategories'), city: t('city'), allCities: t('allCities'), minRating: t('minRating'), any: t('any'), badgedOnly: t('badgedOnly'), sortBy: t('sortBy'), relevance: t('relevance'), rating: t('rating'), reviews: t('reviews'), newest: t('newest')}}
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-medium text-ink">{t('noResults')}</p>
          <p className="mt-1 text-sm text-muted">{t('noResultsHint')}</p>
        </div>
      ) : (
        <div className="mt-6">
          <CompareResults companies={results} locale={locale} badgeLabel={tc('verified')} noReviewsLabel={tc('noReviewsYet')} labels={{select: tcmp('select'), compareCta: tcmp('compareCta'), clear: tcmp('clear')}} />
        </div>
      )}
    </div>
  );
}
