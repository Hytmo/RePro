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
    <div className="shell py-10">
      <div className="border-b border-border pb-6">
        <span className="repro-kicker">Category</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          {localizedName(cat.name, locale)}
        </h1>
        <p className="mt-2 text-sm font-medium text-muted">{t('resultsCount', {count: results.length})}</p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {results.map((c: any) => (
          <CompanyCard key={c.id} company={c} locale={locale} badgeLabel={tc('verified')} />
        ))}
      </div>
    </div>
  );
}
