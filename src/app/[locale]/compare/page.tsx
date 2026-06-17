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

  const ids = (sp.ids ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const companies = await getCompaniesBySlugs(ids);
  const ordered = ids.map((s) => companies.find((c: any) => c.slug === s)).filter(Boolean) as any[];

  if (ordered.length < 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('pickPrompt')}</p>
        <Link href="/search" className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{t('backToSearch')}</Link>
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">{t('title')}</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40"></th>
              {ordered.map((c) => (
                <th key={c.id} className="p-3 text-left align-bottom">
                  <Link href={`/company/${c.slug}`} className="block">
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-700">{initials(c.name)}</span>
                    <span className="font-semibold text-ink hover:text-brand-700">{c.name}</span>
                    <span className="block text-xs font-normal text-muted">{c.city}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {starRows.map((row) => (
              <tr key={row.key}>
                <td className="py-3 pr-3 text-ink-soft">{row.label}</td>
                {ordered.map((c) => (
                  <td key={c.id} className="p-3"><StarRating value={Number(c[row.key])} size={15} showValue /></td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-3 pr-3 text-ink-soft">{t('recommend')}</td>
              {ordered.map((c) => (<td key={c.id} className="p-3 font-medium text-ink">{Math.round(Number(c.recommend_pct))}%</td>))}
            </tr>
            <tr>
              <td className="py-3 pr-3 text-ink-soft">{t('reviewsCount')}</td>
              {ordered.map((c) => (<td key={c.id} className="p-3 font-medium text-ink">{c.rating_count}</td>))}
            </tr>
            <tr>
              <td className="py-3 pr-3 text-ink-soft">{t('verified')}</td>
              {ordered.map((c) => (<td key={c.id} className="p-3">{c.is_badged ? <span className="text-brand-700">✓</span> : <span className="text-muted">—</span>}</td>))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
