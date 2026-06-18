import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Globe, Mail, MapPin, Minus, Phone, Plus} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getCompanyBySlug, getCompanyReviews, getCompanySummary} from '@/lib/queries';
import {createClient} from '@/lib/supabase/server';
import {localizedName, initials, formatResponseTime} from '@/lib/format';
import StarRating from '@/components/StarRating';
import RatingBars from '@/components/RatingBars';
import VerifiedBadge from '@/components/VerifiedBadge';
import CompanyMap from '@/components/CompanyMap';
import ReviewComposer from '@/components/ReviewComposer';
import HelpfulButton from '@/components/HelpfulButton';
import ReportButton from '@/components/ReportButton';
import ClaimButton from '@/components/ClaimButton';
import ResponseComposer from '@/components/ResponseComposer';
import LeadForm from '@/components/LeadForm';

export async function generateMetadata({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {slug} = await params;
  const c = await getCompanyBySlug(slug);
  if (!c) return {title: 'Company'};
  return {title: c.name, description: c.description ?? undefined};
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default async function CompanyPage({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();
  const [reviews, summary] = await Promise.all([getCompanyReviews(company.id), getCompanySummary(company.id)]);

  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  const isOwner = !!user && company.owner_id === user.id;
  let myReview: any = null;
  let myClaimPending = false;
  const myHelpful = new Set<string>();
  if (user) {
    const {data: mine} = await supabase.from('reviews').select('*').eq('company_id', company.id).eq('author_id', user.id).maybeSingle();
    myReview = mine;
    const {data: votes} = await supabase.from('review_votes').select('review_id, vote').eq('voter_id', user.id);
    (votes ?? []).forEach((v: any) => v.vote === 1 && myHelpful.add(v.review_id));
    if (!company.owner_id) {
      const {data: claim} = await supabase.from('company_claims').select('id').eq('company_id', company.id).eq('user_id', user.id).maybeSingle();
      myClaimPending = !!claim;
    }
  }

  const t = await getTranslations('company');
  const tr = await getTranslations('reviews');
  const tcw = await getTranslations('compose');
  const tl = await getTranslations('leads');
  const tai = await getTranslations('ai');

  const cats = (company.company_categories ?? []).map((cc: any) => cc.categories).filter(Boolean);
  const dateFmt = new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'short', day: 'numeric'});
  const hours = company.opening_hours as Record<string, string> | null;
  const otherReviews = reviews.filter((r: any) => r.author_id !== user?.id);
  const respLabels = {respond: tcw('respond'), edit: tcw('editResponse'), save: tcw('saveResponse'), placeholder: tcw('responsePlaceholder')};
  const responseTime = formatResponseTime(company.response_time_hours == null ? null : Number(company.response_time_hours));
  const loves: string[] = (summary?.loves as string[]) ?? [];
  const complaints: string[] = (summary?.complaints as string[]) ?? [];
  const hasSummary = loves.length > 0 || complaints.length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    description: company.description ?? undefined,
    telephone: company.phone ?? undefined,
    url: company.website ?? undefined,
    address: company.address ? {'@type': 'PostalAddress', streetAddress: company.address, addressLocality: company.city, postalCode: company.postal_code, addressCountry: company.country} : undefined,
    aggregateRating: company.rating_count > 0 ? {'@type': 'AggregateRating', ratingValue: Number(company.rating_avg), reviewCount: company.rating_count} : undefined
  };

  return (
    <div className="shell py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <Link
        href="/search"
        className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-bold text-brand-700 ring-1 ring-border transition hover:ring-brand-300"
      >
        {t('backToSearch')}
      </Link>

      <header className="repro-card mt-5 overflow-hidden rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink text-2xl font-black text-white">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-lux-500" />
          {initials(company.name)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-ink sm:text-5xl">{company.name}</h1>
            {company.is_badged && <VerifiedBadge label={t('verified')} />}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating value={Number(company.rating_avg)} count={company.rating_count} size={20} showValue />
            {company.rating_count > 0 && <span className="text-sm text-muted">- {t('recommend', {pct: Math.round(Number(company.recommend_pct))})}</span>}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {cats.map((c: any) => (<Link key={c.slug} href={`/category/${c.slug}`} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft hover:text-brand-700">{localizedName(c.name, locale)}</Link>))}
            {company.city && <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft">{company.city}</span>}
            {!company.owner_id && !isOwner && (<ClaimButton companyId={company.id} userId={user?.id ?? null} signedIn={!!user} alreadyClaimed={myClaimPending} labels={{claim: t('claim'), pending: t('claimPending')}} />)}
          </div>
        </div>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {company.description && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-ink">{t('about')}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{company.description}</p>
            </section>
          )}

          {hasSummary ? (
            <section className="repro-card mb-8 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-ink">{tai('title')}</h2>
              <p className="mb-4 text-xs text-muted">{tai('disclaimer')}</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-brand-700">{tai('loves')}</h3>
                  <ul className="space-y-1.5 text-sm text-ink-soft">{loves.map((x, i) => (<li key={i} className="flex gap-2"><Plus className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />{x}</li>))}</ul>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-amber-700">{tai('complaints')}</h3>
                  <ul className="space-y-1.5 text-sm text-ink-soft">{complaints.map((x, i) => (<li key={i} className="flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />{x}</li>))}</ul>
                </div>
              </div>
            </section>
          ) : company.rating_count >= 3 ? (
            <section className="mb-8 rounded-lg border border-dashed border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">{tai('title')}</h2>
              <p className="mt-1 text-sm text-muted">{tai('placeholder')}</p>
            </section>
          ) : null}

          {company.rating_count > 0 && (
            <section className="repro-card mb-8 rounded-lg p-6">
              <h2 className="mb-4 text-lg font-semibold text-ink">{t('criteriaTitle')}</h2>
              <RatingBars labels={{quality: t('criteria.quality'), value: t('criteria.value'), communication: t('criteria.communication'), punctuality: t('criteria.punctuality')}} quality={Number(company.rating_quality)} value={Number(company.rating_value)} communication={Number(company.rating_communication)} punctuality={Number(company.rating_punctuality)} />
            </section>
          )}

          {!isOwner && (
            <section className="mb-8">
              <ReviewComposer companyId={company.id} userId={user?.id ?? null} signedIn={!!user} existing={myReview} labels={{writeTitle: tcw('writeTitle'), editTitle: tcw('editTitle'), signInPrompt: tcw('signInPrompt'), signInCta: tcw('signInCta'), quality: tcw('quality'), value: tcw('value'), communication: tcw('communication'), punctuality: tcw('punctuality'), recommend: tcw('recommend'), reviewTitle: tcw('reviewTitle'), reviewTitlePlaceholder: tcw('reviewTitlePlaceholder'), body: tcw('body'), bodyPlaceholder: tcw('bodyPlaceholder'), submit: tcw('submit'), update: tcw('update'), posted: tcw('posted'), rateAll: tcw('rateAll')}} />
            </section>
          )}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">{t('reviewsTitle')} <span className="text-muted">({reviews.length})</span></h2>
            <div className="space-y-5">
              {otherReviews.map((rv: any) => {
                const _rr = rv.review_responses; const resp = Array.isArray(_rr) ? _rr[0] : _rr;
                return (
                  <article key={rv.id} className="rounded-lg border border-border bg-white p-5 shadow-sm shadow-brand-900/5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-ink-soft">{initials(rv.profiles?.display_name ?? '?')}</span>
                        <div>
                          <p className="text-sm font-medium text-ink">{rv.profiles?.display_name ?? tr('anonymous')}</p>
                          <p className="text-xs text-muted">{dateFmt.format(new Date(rv.created_at))}</p>
                        </div>
                      </div>
                      <StarRating value={Number(rv.overall)} size={15} />
                    </div>
                    {rv.title && <h3 className="mt-3 font-semibold text-ink">{rv.title}</h3>}
                    <p className="mt-1 leading-relaxed text-ink-soft">{rv.body}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <HelpfulButton reviewId={rv.id} userId={user?.id ?? null} signedIn={!!user} initialVoted={myHelpful.has(rv.id)} count={rv.helpful_count} label={tr('helpful')} />
                      <ReportButton reviewId={rv.id} companyId={company.id} userId={user?.id ?? null} signedIn={!!user} labels={{report: tr('report'), reason: tr('reportReason'), submit: tr('reportSubmit'), reported: tr('reported')}} />
                    </div>
                    {resp && (
                      <div className="mt-4 rounded-lg border-l-4 border-brand-300 bg-surface px-4 py-3">
                        <p className="text-xs font-semibold text-brand-700">{tr('businessResponse')}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{resp.body}</p>
                        {isOwner && <div className="mt-2"><ResponseComposer reviewId={rv.id} userId={user!.id} existingBody={resp.body} labels={respLabels} /></div>}
                      </div>
                    )}
                    {!resp && isOwner && <div className="mt-3"><ResponseComposer reviewId={rv.id} userId={user!.id} existingBody={null} labels={respLabels} /></div>}
                  </article>
                );
              })}
              {otherReviews.length === 0 && <p className="text-sm text-muted">{tr('none')}</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="repro-card rounded-lg p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{t('contact')}</h2>
            {responseTime && <p className="mb-3 text-xs font-medium text-brand-700">{tl('respondsIn', {time: responseTime})}</p>}
            <ul className="space-y-2 text-sm">
              {company.phone && <li className="flex items-center gap-2 text-ink-soft"><Phone className="h-4 w-4" aria-hidden="true" />{company.phone}</li>}
              {company.email && <li className="flex items-center gap-2 text-ink-soft"><Mail className="h-4 w-4" aria-hidden="true" />{company.email}</li>}
              {company.website && <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-ink-soft" aria-hidden="true" /><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">{t('website')}</a></li>}
              {company.address && <li className="flex items-start gap-2 text-ink-soft"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{company.address}{company.postal_code ? `, ${company.postal_code}` : ''} {company.city}</span></li>}
            </ul>
          </section>

          <LeadForm companyId={company.id} userId={user?.id ?? null} signedIn={!!user} defaultEmail={user?.email ?? null} labels={{getInTouch: tl('getInTouch'), contact: tl('contact'), quote: tl('quote'), message: tl('message'), messagePlaceholder: tl('messagePlaceholder'), email: tl('email'), consent: tl('consent'), send: tl('send'), sent: tl('sent'), signInPrompt: tl('signInPrompt'), signInCta: tl('signInCta'), consentRequired: tl('consentRequired')}} />

          {hours && (
            <section className="repro-card rounded-lg p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{t('openingHours')}</h2>
              <table className="w-full text-sm"><tbody>
                {DAYS.map((d) => (<tr key={d}><td className="py-1 text-ink-soft">{t(`days.${d}`)}</td><td className="py-1 text-right text-ink">{!hours[d] || hours[d] === 'closed' ? t('closed') : hours[d]}</td></tr>))}
              </tbody></table>
            </section>
          )}

          {company.lat && company.lng && (
            <section className="repro-card rounded-lg p-3">
              <CompanyMap lat={Number(company.lat)} lng={Number(company.lng)} name={company.name} />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
