import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getCategoryTree} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import CategoryIcon from '@/components/CategoryIcon';

export default async function CategoriesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('categories');
  const sectors = await getCategoryTree();
  const subTotal = sectors.reduce((n: number, s: any) => n + s.children.length, 0);

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
          {t('count', {count: subTotal})}
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {sectors.map((sector: any) => (
          <section key={sector.slug}>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <Link href={`/category/${sector.slug}`} className="group flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface text-brand-700 transition group-hover:bg-brand-50">
                  <CategoryIcon icon={sector.icon} />
                </span>
                <h2 className="text-lg font-black tracking-tight text-ink group-hover:text-brand-700">
                  {localizedName(sector.name, locale)}
                </h2>
              </Link>
              <Link href={`/category/${sector.slug}`} className="shrink-0 text-xs font-bold text-brand-700 hover:underline">
                {t('viewAll')}
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {sector.children.map((c: any) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface text-brand-700 transition group-hover:bg-brand-50">
                    <CategoryIcon icon={c.icon} className="h-4 w-4" />
                  </span>
                  <span className="truncate text-sm font-bold text-ink">
                    {localizedName(c.name, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
