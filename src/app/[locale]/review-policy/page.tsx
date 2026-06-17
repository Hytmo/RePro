import {setRequestLocale} from 'next-intl/server';

export const metadata = {title: 'Review policy'};

export default async function ReviewPolicyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Review policy</h1>
      <p className="mt-1 text-sm text-muted">Last updated: 17 June 2026</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Draft for review. This is a starting template and not legal advice — please have it reviewed by a qualified lawyer before launch.
      </div>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
        <p>Trust is the product. These rules keep reviews on RePro honest and useful.</p>
        <h2 className="text-lg font-semibold text-ink">Genuine experiences only</h2>
        <p>Write only about a real, first-hand experience with the business. One review per business per person; you can edit it later.</p>
        <h2 className="text-lg font-semibold text-ink">No fake or incentivised reviews</h2>
        <p>Businesses may not write reviews about themselves or competitors, and may not offer rewards in exchange for reviews. We use account checks, rate limiting and moderation to detect manipulation.</p>
        <h2 className="text-lg font-semibold text-ink">Keep it lawful and fair</h2>
        <p>No defamation, hate speech, personal data of others, or illegal content. Focus on the service you received.</p>
        <h2 className="text-lg font-semibold text-ink">Company responses</h2>
        <p>Businesses can respond publicly to any review. Disagreements should be handled professionally.</p>
        <h2 className="text-lg font-semibold text-ink">Reporting and moderation</h2>
        <p>Anyone can report a review. Our moderators review reports and may remove content that breaks these rules. Businesses can flag and dispute reviews they believe are fake or unfair.</p>
      </div>
    </div>
  );
}
