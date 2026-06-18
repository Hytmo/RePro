import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getCategoryBySlug, getCategoryById, getChildCategories, searchCompanies} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import CompanyCard from '@/components/CompanyCard';
import CategoryIcon from '@/components/CategoryIcon';

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
  const tcat = await getTranslations('categories');

  const isSector = !cat.parent_id;
  const [children, parent, results] = await Promise.all([
    isSector ? getChildCategories(cat.id) : Promise.resolve([]),
    cat.parent_id ? getCategoryById(cat.parent_id) : Promise.resolve(null),
    searchCompanies({category: slug, sort: 'rating'})
  ]);

  return (
    <div className="shell py-10">
      <div className="border-b border-border pb-6">
        {parent && (
          <Link href={`/category/${parent.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">
            ← {localizedName(parent.name, locale)}
          </Link>
        )}
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-surface text-brand-700">
            <CategoryIcon icon={cat.icon} className="h-6 w-6" />
          </span>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {localizedName(cat.name, locale)}
          </h1>
        </div>
        <p className="mt-2 text-sm font-medium text-muted">{t('resultsCount', {count: results.length})}</p>
      </div>

      {isSector && children.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-muted">{tcat('kicker')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {children.map((c: any) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-bold text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
              >
                <CategoryIcon icon={c.icon} className="h-4 w-4" />
                {localizedName(c.name, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-medium text-ink">{t('noResults')}</p>
          <p className="mt-1 text-sm text-muted">{t('noResultsHint')}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {results.map((c: any) => (
            <CompanyCard key={c.id} company={c} locale={locale} badgeLabel={tc('verified')} noReviewsLabel={tc('noReviewsYet')} />
          ))}
        </div>
      )}
    </div>
  );
}
