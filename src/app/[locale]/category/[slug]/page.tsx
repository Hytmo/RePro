import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {getCategoryBySlug, searchCompanies} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import CompanyCard from '@/components/CompanyCard';

export async function generateMetadata({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  const cat = await getCategoryBySlug(slug);
  return {title: cat ? localizedName(cat.name, locale) : 'Category'};
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const tc = await getTranslations('company');
  const t = await getTranslations('search');
  const results = await searchCompanies({category: slug, sort: 'rating'});

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">{localizedName(cat.name, locale)}</h1>
      <p className="mt-1 text-sm text-muted">{t('resultsCount', {count: results.length})}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {results.map((c: any) => (
          <CompanyCard key={c.id} company={c} locale={locale} badgeLabel={tc('verified')} />
        ))}
      </div>
    </div>
  );
}
