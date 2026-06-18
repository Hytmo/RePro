'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {Link} from '@/i18n/navigation';

type Labels = {
  getInTouch: string;
  contact: string;
  quote: string;
  message: string;
  messagePlaceholder: string;
  email: string;
  consent: string;
  send: string;
  sent: string;
  signInPrompt: string;
  signInCta: string;
  consentRequired: string;
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
      <div className="repro-card rounded-lg p-6">
        <h2 className="text-xs font-black uppercase text-muted">{labels.getInTouch}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{labels.signInPrompt}</p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-full bg-ink px-4 py-2 text-sm font-black text-white transition hover:bg-brand-700"
        >
          {labels.signInCta}
        </Link>
      </div>
    );
  }

  if (ok) {
    return (
      <div className="rounded-lg border border-mint-500/25 bg-mint-500/10 p-6">
        <p className="text-sm font-bold text-mint-600">{labels.sent}</p>
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
    const {data, error} = await supabase
      .from('leads')
      .insert({
        company_id: companyId,
        user_id: userId,
        type,
        message,
        contact_email: email || null,
        consent
      })
      .select('id')
      .single();
    setBusy(false);
    if (error) setError(error.message);
    else {
      setOk(true);
      if (data?.id) {
        supabase.functions.invoke('notify-lead', {body: {lead_id: data.id}}).catch(() => {});
      }
    }
  }

  const input =
    'w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-muted focus:ring-2 focus:ring-brand-300';

  return (
    <form onSubmit={submit} className="repro-card rounded-lg p-6">
      <h2 className="text-xs font-black uppercase text-muted">{labels.getInTouch}</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-surface p-1">
        <button
          type="button"
          onClick={() => setType('contact')}
          className={`rounded-full px-3 py-2 text-xs font-black transition ${
            type === 'contact' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {labels.contact}
        </button>
        <button
          type="button"
          onClick={() => setType('quote')}
          className={`rounded-full px-3 py-2 text-xs font-black transition ${
            type === 'quote' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {labels.quote}
        </button>
      </div>
      <textarea
        className={`${input} mt-4 min-h-[110px]`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={labels.messagePlaceholder}
        required
        maxLength={2000}
      />
      <input
        className={`${input} mt-3`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.email}
      />
      <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-brand-600"
        />
        {labels.consent}
      </label>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm font-black text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {labels.send}
      </button>
    </form>
  );
}
