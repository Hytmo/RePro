import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getCompanyBySlug, getCompanyReviews} from '@/lib/queries';
import {createClient} from '@/lib/supabase/server';
import {localizedName, initials} from '@/lib/format';
import StarRating from '@/components/StarRating';
import RatingBars from '@/components/RatingBars';
import VerifiedBadge from '@/components/VerifiedBadge';
import CompanyMap from '@/components/CompanyMap';
import ReviewComposer from '@/components/ReviewComposer';
import HelpfulButton from '@/components/HelpfulButton';
import ReportButton from '@/components/ReportButton';

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
  const reviews = await getCompanyReviews(company.id);

  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  let myReview: any = null;
  const myHelpful = new Set<string>();
  if (user) {
    const {data: mine} = await supabase.from('reviews').select('*').eq('company_id', company.id).eq('author_id', user.id).maybeSingle();
    myReview = mine;
    const {data: votes} = await supabase.from('review_votes').select('review_id, vote').eq('voter_id', user.id);
    (votes ?? []).forEach((v: any) => v.vote === 1 && myHelpful.add(v.review_id));
  }

  const t = await getTranslations('company');
  const tr = await getTranslations('reviews');
  const tcw = await getTranslations('compose');

  const cats = (company.company_categories ?? []).map((cc: any) => cc.categories).filter(Boolean);
  const dateFmt = new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'short', day: 'numeric'});
  const hours = company.opening_hours as Record<string, string> | null;
  const otherReviews = reviews.filter((r: any) => r.author_id !== user?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/search" className="text-sm text-brand-700 hover:underline">← {t('backToSearch')}</Link>

      <header className="mt-4 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-xl font-semibold text-brand-700">
          {initials(company.name)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-ink">{company.name}</h1>
            {company.is_badged && <VerifiedBadge label={t('verified')} />}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating value={Number(company.rating_avg)} count={company.rating_count} size={20} showValue />
            {company.rating_count > 0 && (
              <span className="text-sm text-muted">· {t('recommend', {pct: Math.round(Number(company.recommend_pct))})}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {cats.map((c: any) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft hover:text-brand-700">
                {localizedName(c.name, locale)}
              </Link>
            ))}
            {company.city && <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft">{company.city}</span>}
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

          {company.rating_count > 0 && (
            <section className="mb-8 rounded-2xl border border-border bg-background p-6">
              <h2 className="mb-4 text-lg font-semibold text-ink">{t('criteriaTitle')}</h2>
              <RatingBars
                labels={{quality: t('criteria.quality'), value: t('criteria.value'), communication: t('criteria.communication'), punctuality: t('criteria.punctuality')}}
                quality={Number(company.rating_quality)}
                value={Number(company.rating_value)}
                communication={Number(company.rating_communication)}
                punctuality={Number(company.rating_punctuality)}
              />
            </section>
          )}

          <section className="mb-8">
            <ReviewComposer
              companyId={company.id}
              userId={user?.id ?? null}
              signedIn={!!user}
              existing={myReview}
              labels={{
                writeTitle: tcw('writeTitle'), editTitle: tcw('editTitle'), signInPrompt: tcw('signInPrompt'), signInCta: tcw('signInCta'),
                quality: tcw('quality'), value: tcw('value'), communication: tcw('communication'), punctuality: tcw('punctuality'),
                recommend: tcw('recommend'), reviewTitle: tcw('reviewTitle'), reviewTitlePlaceholder: tcw('reviewTitlePlaceholder'),
                body: tcw('body'), bodyPlaceholder: tcw('bodyPlaceholder'), submit: tcw('submit'), update: tcw('update'), posted: tcw('posted'), rateAll: tcw('rateAll')
              }}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">{t('reviewsTitle')} <span className="text-muted">({reviews.length})</span></h2>
            <div className="space-y-5">
              {otherReviews.map((rv: any) => {
                const _rr = rv.review_responses; const resp = Array.isArray(_rr) ? _rr[0] : _rr;
                return (
                  <article key={rv.id} className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-ink-soft">
                          {initials(rv.profiles?.display_name ?? '?')}
                        </span>
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
                      <div className="mt-4 rounded-xl border-l-2 border-brand-300 bg-surface px-4 py-3">
                        <p className="text-xs font-semibold text-brand-700">{tr('businessResponse')}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{resp.body}</p>
                      </div>
                    )}
                  </article>
                );
              })}
              {otherReviews.length === 0 && <p className="text-sm text-muted">{tr('none')}</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{t('contact')}</h2>
            <ul className="space-y-2 text-sm">
              {company.phone && <li className="flex items-center gap-2 text-ink-soft"><i className="ti ti-phone" aria-hidden="true" />{company.phone}</li>}
              {company.email && <li className="flex items-center gap-2 text-ink-soft"><i className="ti ti-mail" aria-hidden="true" />{company.email}</li>}
              {company.website && <li className="flex items-center gap-2"><i className="ti ti-world text-ink-soft" aria-hidden="true" /><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">{t('website')}</a></li>}
              {company.address && <li className="flex items-start gap-2 text-ink-soft"><i className="ti ti-map-pin mt-0.5" aria-hidden="true" /><span>{company.address}{company.postal_code ? `, ${company.postal_code}` : ''} {company.city}</span></li>}
            </ul>
          </section>

          {hours && (
            <section className="rounded-2xl border border-border bg-background p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{t('openingHours')}</h2>
              <table className="w-full text-sm"><tbody>
                {DAYS.map((d) => (
                  <tr key={d}><td className="py-1 text-ink-soft">{t(`days.${d}`)}</td><td className="py-1 text-right text-ink">{!hours[d] || hours[d] === 'closed' ? t('closed') : hours[d]}</td></tr>
                ))}
              </tbody></table>
            </section>
          )}

          {company.lat && company.lng && (
            <section className="rounded-2xl border border-border bg-background p-3">
              <CompanyMap lat={Number(company.lat)} lng={Number(company.lng)} name={company.name} />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
