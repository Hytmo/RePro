import {getTranslations} from 'next-intl/server';

// Lightweight placeholder for routes scaffolded in M0 but built out later.
// Keeps the whole skeleton navigable and fully translated.
export default async function ComingSoon({title}: {title: string}) {
  const t = await getTranslations('common');

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800">
        {t('comingSoonBadge')}
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-ink-soft">{t('comingSoonBody')}</p>
    </section>
  );
}
