import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import SearchBar from '@/components/SearchBar';
import {getCategories} from '@/lib/queries';
import {localizedName} from '@/lib/format';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const categories = (await getCategories()).slice(0, 10);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-50 to-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{t('heroTitle')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">{t('heroSubtitle')}</p>
          <div className="mt-8">
            <SearchBar
              placeholder={t('searchPlaceholder')}
              locationPlaceholder={t('searchLocationPlaceholder')}
              buttonLabel={t('searchButton')}
            />
          </div>
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {categories.map((c: any) => (
              <Link
                key={c.slug}
                href={`/search?category=${c.slug}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
              >
                {localizedName(c.name, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <ValueCard title={t('valueProps.verifiedTitle')} text={t('valueProps.verifiedText')} />
          <ValueCard title={t('valueProps.multiTitle')} text={t('valueProps.multiText')} />
          <ValueCard title={t('valueProps.transparentTitle')} text={t('valueProps.transparentText')} />
        </div>
      </section>
    </>
  );
}

function ValueCard({title, text}: {title: string; text: string}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
