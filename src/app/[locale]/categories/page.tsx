import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getCategories} from '@/lib/queries';
import {localizedName} from '@/lib/format';

export default async function CategoriesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('categories');
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">{t('title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c: any) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <i className={`ti ${c.icon ?? 'ti-building-store'}`} aria-hidden="true" />
            </span>
            <span className="font-medium text-ink">{localizedName(c.name, locale)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
