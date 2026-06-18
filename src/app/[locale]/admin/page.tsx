import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {CompanyActions, ClaimActions, ReviewActions, ReportActions} from '@/components/AdminActions';
import AdminGenerateSummaries from '@/components/AdminGenerateSummaries';

export const metadata = {title: 'Admin'};

export default async function AdminPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in`);
  const {data: profile} = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') redirect(`/${locale}`);

  const t = await getTranslations('admin');

  const [{data: pending}, {data: claims}, {data: reports}, {data: flagged}] =
    await Promise.all([
      supabase
        .from('companies')
        .select('id,name,slug,city,created_at,source')
        .eq('status', 'pending')
        .order('created_at'),
      supabase
        .from('company_claims')
        .select('id,company_id,user_id,created_at,companies(name,slug),profiles(display_name)')
        .eq('status', 'pending')
        .order('created_at'),
      supabase
        .from('reports')
        .select('id,reason,details,created_at,review_id,reviews(title,body)')
        .eq('status', 'open')
        .order('created_at'),
      supabase
        .from('reviews')
        .select('id,title,body,status,companies(name,slug)')
        .eq('status', 'removed')
        .order('created_at')
    ]);

  const pendingList = pending ?? [];
  const claimList = claims ?? [];
  const reportList = reports ?? [];
  const removedList = flagged ?? [];
  const labelsCompany = {approve: t('approve'), reject: t('reject')};

  return (
    <div className="shell py-10">
      <span className="repro-kicker">{t('kicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">{t('title')}</h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label={t('pendingCompanies')} value={pendingList.length} />
        <Stat label={t('pendingClaims')} value={claimList.length} />
        <Stat label={t('openReports')} value={reportList.length} />
      </div>

      <div className="repro-card mt-6 flex items-center justify-between gap-3 rounded-lg px-5 py-3">
        <span className="text-sm font-black text-ink">{t('aiTools')}</span>
        <AdminGenerateSummaries label={t('generate')} busyLabel={t('generating')} />
      </div>

      <Section title={t('verificationQueue')}>
        {pendingList.length === 0 ? (
          <Empty text={t('nothingHere')} />
        ) : (
          pendingList.map((c: any) => (
            <Row key={c.id}>
              <div>
                <p className="font-bold text-ink">{c.name}</p>
                <p className="text-xs text-muted">
                  {c.city ?? '-'} - {c.source === 'user_submission' ? t('userSubmitted') : t('selfRegistered')}
                </p>
              </div>
              <CompanyActions companyId={c.id} labels={labelsCompany} />
            </Row>
          ))
        )}
      </Section>

      <Section title={t('claims')}>
        {claimList.length === 0 ? (
          <Empty text={t('nothingHere')} />
        ) : (
          claimList.map((c: any) => (
            <Row key={c.id}>
              <div>
                <p className="font-bold text-ink">{c.companies?.name}</p>
                <p className="text-xs text-muted">
                  {t('claimedBy')} {c.profiles?.display_name ?? '-'}
                </p>
              </div>
              <ClaimActions
                claimId={c.id}
                companyId={c.company_id}
                userId={c.user_id}
                labels={labelsCompany}
              />
            </Row>
          ))
        )}
      </Section>

      <Section title={t('openReports')}>
        {reportList.length === 0 ? (
          <Empty text={t('nothingHere')} />
        ) : (
          reportList.map((r: any) => (
            <Row key={r.id}>
              <div className="min-w-0">
                <p className="truncate font-bold text-ink">
                  {r.reviews?.title || r.reviews?.body?.slice(0, 60) || t('review')}
                </p>
                <p className="text-xs text-muted">
                  {t('reason')}: {r.reason}
                </p>
              </div>
              <ReportActions
                reportId={r.id}
                reviewId={r.review_id}
                labels={{resolve: t('resolve'), removeReview: t('removeReview')}}
              />
            </Row>
          ))
        )}
      </Section>

      <Section title={t('removedReviews')}>
        {removedList.length === 0 ? (
          <Empty text={t('nothingHere')} />
        ) : (
          removedList.map((r: any) => (
            <Row key={r.id}>
              <div className="min-w-0">
                <p className="truncate font-bold text-ink">{r.title || r.body?.slice(0, 60)}</p>
                <p className="text-xs text-muted">{r.companies?.name}</p>
              </div>
              <ReviewActions
                reviewId={r.id}
                removed={true}
                labels={{remove: t('remove'), restore: t('restore')}}
              />
            </Row>
          ))
        )}
      </Section>
    </div>
  );
}

function Stat({label, value}: {label: string; value: number}) {
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-black text-ink">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white shadow-sm shadow-brand-900/5">
        {children}
      </div>
    </section>
  );
}

function Row({children}: {children: React.ReactNode}) {
  return <div className="flex items-center justify-between gap-4 px-5 py-3">{children}</div>;
}

function Empty({text}: {text: string}) {
  return <p className="px-5 py-6 text-center text-sm text-muted">{text}</p>;
}
