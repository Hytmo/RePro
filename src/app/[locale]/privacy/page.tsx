import {setRequestLocale} from 'next-intl/server';

export const metadata = {title: 'Privacy policy'};

export default async function PrivacyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Privacy policy</h1>
      <p className="mt-1 text-sm text-muted">Last updated: 17 June 2026</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Draft for review. This is a starting template and not legal advice — please have it reviewed by a qualified lawyer before launch.
      </div>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
        <p>RePro (&quot;we&quot;, &quot;us&quot;) operates RePro.lu, a review platform for businesses in Luxembourg. This policy explains what personal data we process and your rights under the EU General Data Protection Regulation (GDPR).</p>
        <h2 className="text-lg font-semibold text-ink">Data we collect</h2>
        <p>Account data (email, display name), content you create (reviews, ratings, photos, enquiries), limited technical data needed to operate the service, and your cookie preferences. We do not sell your personal data.</p>
        <h2 className="text-lg font-semibold text-ink">Lawful basis</h2>
        <p>We process your data to perform our contract with you (providing the service), on the basis of your consent (e.g. non-essential cookies, sending an enquiry to a business), and for our legitimate interests in running a trustworthy review platform and preventing fraud and abuse.</p>
        <h2 className="text-lg font-semibold text-ink">How we use it</h2>
        <p>To create and secure your account, publish your reviews, route enquiries to businesses with your consent, moderate content, and improve the service.</p>
        <h2 className="text-lg font-semibold text-ink">Sharing</h2>
        <p>Reviews and your display name are public. Enquiries are shared with the business you contact. We use service providers (hosting, database, email) that process data on our behalf within the EU where possible.</p>
        <h2 className="text-lg font-semibold text-ink">Retention</h2>
        <p>We keep your data while your account is active. You can delete your account at any time, which removes your profile, reviews and enquiries.</p>
        <h2 className="text-lg font-semibold text-ink">Your rights</h2>
        <p>You have the right to access, rectify, erase, restrict, port and object to the processing of your personal data. You can export your data and delete your account from your account page, and you may lodge a complaint with the Luxembourg data protection authority (CNPD).</p>
        <h2 className="text-lg font-semibold text-ink">Cookies</h2>
        <p>We use essential cookies to keep you signed in. Non-essential cookies are off by default and only set with your consent.</p>
        <h2 className="text-lg font-semibold text-ink">Contact</h2>
        <p>For any privacy request, contact privacy@repro.lu.</p>
      </div>
    </div>
  );
}
