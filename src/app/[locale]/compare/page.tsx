import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getCompaniesBySlugs} from '@/lib/queries';
import {initials} from '@/lib/format';
import StarRating from '@/components/StarRating';

export const metadata = {title: 'Compare'};

export default async function ComparePage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{ids?: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('compare');
  const tc = await getTranslations('company');

  const ids = (sp.ids ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const companies = await getCompaniesBySlugs(ids);
  const ordered = ids.map((s) => companies.find((c: any) => c.slug === s)).filter(Boolean) as any[];

  if (ordered.length < 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <span className="repro-kicker">{t('emptyKicker')}</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('pickPrompt')}</p>
        <Link
          href="/search"
          className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-black text-white hover:bg-brand-700"
        >
          {t('backToSearch')}
        </Link>
      </div>
    );
  }

  const starRows = [
    {label: t('overall'), key: 'rating_avg'},
    {label: tc('criteria.quality'), key: 'rating_quality'},
    {label: tc('criteria.value'), key: 'rating_value'},
    {label: tc('criteria.communication'), key: 'rating_communication'},
    {label: tc('criteria.punctuality'), key: 'rating_punctuality'}
  ];

  return (
    <div className="shell py-10">
      <span className="repro-kicker">{t('kicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">{t('title')}</h1>

      <div className="repro-card mt-6 overflow-x-auto rounded-lg p-2">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-44 p-4"></th>
              {ordered.map((c) => (
                <th key={c.id} className="p-4 text-left align-bottom">
                  <Link href={`/company/${c.slug}`} className="block">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
                      {initials(c.name)}
                    </span>
                    <span className="block font-black text-ink hover:text-brand-700">{c.name}</span>
                    <span className="mt-1 block text-xs font-semibold text-muted">{c.city}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {starRows.map((row) => (
              <tr key={row.key}>
                <td className="p-4 font-bold text-ink-soft">{row.label}</td>
                {ordered.map((c) => (
                  <td key={c.id} className="p-4">
                    <StarRating value={Number(c[row.key])} size={15} showValue />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 font-bold text-ink-soft">{t('recommend')}</td>
              {ordered.map((c) => (
                <td key={c.id} className="p-4 font-black text-ink">
                  {Math.round(Number(c.recommend_pct))}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-ink-soft">{t('reviewsCount')}</td>
              {ordered.map((c) => (
                <td key={c.id} className="p-4 font-black text-ink">
                  {c.rating_count}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-ink-soft">{t('verified')}</td>
              {ordered.map((c) => (
                <td key={c.id} className="p-4">
                  {c.is_badged ? (
                    <span className="font-black text-mint-600">{t('yes')}</span>
                  ) : (
                    <span className="text-muted">{t('no')}</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
