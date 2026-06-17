import {getTranslations, setRequestLocale} from 'next-intl/server';

// Illustrative category chips for the M0 skeleton. Replaced by the real,
// localised category system in M1.
const categoryChips = [
  'Plumbers',
  'Electricians',
  'Roofers',
  'Garages',
  'Hairdressers',
  'Restaurants',
  'Cleaning',
  'Movers',
  'Architects',
  'Accountants'
];

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-50 to-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
            {t('heroSubtitle')}
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm sm:flex-row">
            <input
              type="text"
              disabled
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted disabled:bg-transparent"
            />
            <input
              type="text"
              disabled
              placeholder={t('searchLocationPlaceholder')}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted disabled:bg-transparent sm:max-w-[40%] sm:border-l sm:border-border"
            />
            <button
              disabled
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white opacity-90"
            >
              {t('searchButton')}
            </button>
          </div>

          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {categoryChips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <ValueCard
            title={t('valueProps.verifiedTitle')}
            text={t('valueProps.verifiedText')}
          />
          <ValueCard
            title={t('valueProps.multiTitle')}
            text={t('valueProps.multiText')}
          />
          <ValueCard
            title={t('valueProps.transparentTitle')}
            text={t('valueProps.transparentText')}
          />
        </div>

        <p className="mx-auto mt-12 max-w-2xl rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-center text-sm text-brand-800">
          {t('comingSoon')}
        </p>
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
