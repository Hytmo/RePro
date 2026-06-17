import {setRequestLocale} from 'next-intl/server';

export const metadata = {title: 'Terms of service'};

export default async function TermsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Terms of service</h1>
      <p className="mt-1 text-sm text-muted">Last updated: 17 June 2026</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Draft for review. This is a starting template and not legal advice — please have it reviewed by a qualified lawyer before launch.
      </div>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
        <p>By using RePro.lu you agree to these terms. If you do not agree, please do not use the service.</p>
        <h2 className="text-lg font-semibold text-ink">Accounts</h2>
        <p>You are responsible for your account and for keeping your credentials secure. You must provide accurate information and be at least 16 years old to create an account.</p>
        <h2 className="text-lg font-semibold text-ink">Reviews and content</h2>
        <p>You may only post reviews that reflect a genuine experience. You retain ownership of your content and grant us a licence to display it on the platform. Content must not be false, defamatory, illegal, or infringe others&apos; rights.</p>
        <h2 className="text-lg font-semibold text-ink">Business listings</h2>
        <p>Businesses may claim or create a profile and respond to reviews. Paid features (such as a verification badge) provide additional visibility and tools but never change review-based rankings.</p>
        <h2 className="text-lg font-semibold text-ink">Acceptable use</h2>
        <p>No spam, manipulation of ratings, fake or incentivised reviews, scraping, or attempts to disrupt the service.</p>
        <h2 className="text-lg font-semibold text-ink">Liability</h2>
        <p>The service is provided &quot;as is&quot;. Reviews are the opinions of their authors. To the extent permitted by law, we are not liable for content posted by users or businesses.</p>
        <h2 className="text-lg font-semibold text-ink">Governing law</h2>
        <p>These terms are governed by the laws of the Grand Duchy of Luxembourg.</p>
      </div>
    </div>
  );
}
