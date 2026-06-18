import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/server';
import EnquiryRow from '@/components/EnquiryRow';
import UpgradeButton from '@/components/UpgradeButton';

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
    const {data} = await supabase.from('companies').select('id,name,slug,status,is_badged').or(`owner_id.eq.${user.id},created_by.eq.${user.id}`).order('created_at', {ascending: false});
    mine = data ?? [];
    const ids = mine.map((c) => c.id);
    if (ids.length) {
      const {data: l} = await supabase.from('leads').select('*, companies(name)').in('company_id', ids).order('created_at', {ascending: false}).limit(50);
      leads = l ?? [];
    }
  }

  return (
    <div className="shell py-12">
      <div className="repro-card rounded-lg p-7 sm:p-9">
        <span className="repro-kicker">{t('kicker')}</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">{t('title')}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-soft">{t('subtitle')}</p>
        <Link href={user ? '/business/new' : '/sign-in'} className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-brand-700">{t('listCta')}</Link>
      </div>

      {user && mine.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-black text-ink">{t('yourBusinesses')}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white shadow-sm shadow-brand-900/5">
            {mine.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                {c.status === 'verified' ? (
                  <Link href={`/company/${c.slug}`} className="font-medium text-ink hover:text-brand-700">{c.name}</Link>
                ) : (
                  <span className="font-medium text-ink">{c.name}</span>
                )}
                <div className="flex items-center gap-3">
                  {c.status === 'verified' && !c.is_badged && <UpgradeButton companyId={c.id} locale={locale} label={t('upgrade')} unavailable={t('billingUnavailable')} />}
                  {c.is_badged && <span className="text-xs font-medium text-brand-700">{t('badged')}</span>}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status] ?? ''}`}>{t(`status.${c.status}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {user && mine.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-black text-ink">{tl('enquiries')}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white shadow-sm shadow-brand-900/5">
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
    <div className="repro-card rounded-lg p-5">
      <h3 className="font-black text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
