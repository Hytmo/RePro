import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getCategories} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import CategoryIcon from '@/components/CategoryIcon';

export default async function CategoriesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('categories');
  const categories = await getCategories();

  return (
    <div className="shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-7 sm:flex-row sm:items-end">
        <div>
          <span className="repro-kicker">{t('kicker')}</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm font-medium text-muted">{t('subtitle')}</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink-soft ring-1 ring-border">
          {t('count', {count: categories.length})}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c: any) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group rounded-lg border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-surface text-brand-700 transition group-hover:bg-brand-50">
              <CategoryIcon icon={c.icon} />
            </span>
            <span className="mt-5 block text-base font-black text-ink">
              {localizedName(c.name, locale)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
