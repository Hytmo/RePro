'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {Link} from '@/i18n/navigation';

type Labels = {
  getInTouch: string; contact: string; quote: string; message: string; messagePlaceholder: string;
  email: string; consent: string; send: string; sent: string; signInPrompt: string; signInCta: string; consentRequired: string;
};

export default function LeadForm({
  companyId,
  userId,
  signedIn,
  defaultEmail,
  labels
}: {
  companyId: string;
  userId: string | null;
  signedIn: boolean;
  defaultEmail: string | null;
  labels: Labels;
}) {
  const supabase = createClient();
  const [type, setType] = useState<'contact' | 'quote'>('contact');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [consent, setConsent] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{labels.getInTouch}</h2>
        <p className="text-sm text-ink-soft">{labels.signInPrompt}</p>
        <Link href="/sign-in" className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{labels.signInCta}</Link>
      </div>
    );
  }

  if (ok) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <p className="text-sm font-medium text-brand-800">{labels.sent}</p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError(labels.consentRequired);
      return;
    }
    setBusy(true);
    const {error} = await supabase.from('leads').insert({company_id: companyId, user_id: userId, type, message, contact_email: email || null, consent});
    setBusy(false);
    if (error) setError(error.message);
    else setOk(true);
  }

  const input = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-background p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{labels.getInTouch}</h2>
      <div className="mb-3 flex gap-2">
        <button type="button" onClick={() => setType('contact')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${type === 'contact' ? 'bg-brand-600 text-white' : 'border border-border text-ink-soft'}`}>{labels.contact}</button>
        <button type="button" onClick={() => setType('quote')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${type === 'quote' ? 'bg-brand-600 text-white' : 'border border-border text-ink-soft'}`}>{labels.quote}</button>
      </div>
      <textarea className={`${input} min-h-[90px]`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={labels.messagePlaceholder} required maxLength={2000} />
      <input className={`${input} mt-3`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={labels.email} />
      <label className="mt-3 flex items-start gap-2 text-xs text-ink-soft">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-brand-600" />
        {labels.consent}
      </label>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">{labels.send}</button>
    </form>
  );
}
