import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/server';
import EnquiryRow from '@/components/EnquiryRow';

const STATUS_STYLES: Record<string, string> = {
  verified: 'bg-brand-50 text-brand-700',
  pending: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-700',
  draft: 'bg-surface-2 text-ink-soft'
};

export default async function BusinessPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('business');
  const tl = await getTranslations('leads');
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  let mine: any[] = [];
  let leads: any[] = [];
  if (user) {
    const {data} = await supabase.from('companies').select('id,name,slug,status').or(`owner_id.eq.${user.id},created_by.eq.${user.id}`).order('created_at', {ascending: false});
    mine = data ?? [];
    const ids = mine.map((c) => c.id);
    if (ids.length) {
      const {data: l} = await supabase.from('leads').select('*, companies(name)').in('company_id', ids).order('created_at', {ascending: false}).limit(50);
      leads = l ?? [];
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t('subtitle')}</p>
      <Link href={user ? '/business/new' : '/sign-in'} className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">{t('listCta')}</Link>

      {user && mine.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-ink">{t('yourBusinesses')}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
            {mine.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-3">
                {c.status === 'verified' ? (
                  <Link href={`/company/${c.slug}`} className="font-medium text-ink hover:text-brand-700">{c.name}</Link>
                ) : (
                  <span className="font-medium text-ink">{c.name}</span>
                )}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status] ?? ''}`}>{t(`status.${c.status}`)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {user && mine.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-ink">{tl('enquiries')}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
            {leads.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-muted">{tl('noEnquiries')}</p>
            ) : (
              leads.map((lead) => (
                <EnquiryRow key={lead.id} lead={lead} labels={{markResponded: tl('markResponded'), answered: tl('answered'), quote: tl('quote'), contact: tl('contact')}} />
              ))
            )}
          </div>
        </section>
      )}

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <Benefit title={t('benefitRespondTitle')} text={t('benefitRespondText')} />
        <Benefit title={t('benefitFoundTitle')} text={t('benefitFoundText')} />
        <Benefit title={t('benefitFreeTitle')} text={t('benefitFreeText')} />
      </section>
    </div>
  );
}

function Benefit({title, text}: {title: string; text: string}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
