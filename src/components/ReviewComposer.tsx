'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter, Link} from '@/i18n/navigation';
import StarInput from './StarInput';

type Labels = {
  writeTitle: string;
  editTitle: string;
  signInPrompt: string;
  signInCta: string;
  quality: string;
  value: string;
  communication: string;
  punctuality: string;
  recommend: string;
  reviewTitle: string;
  reviewTitlePlaceholder: string;
  body: string;
  bodyPlaceholder: string;
  submit: string;
  update: string;
  posted: string;
  rateAll: string;
};

export default function ReviewComposer({
  companyId,
  userId,
  signedIn,
  existing,
  labels
}: {
  companyId: string;
  userId: string | null;
  signedIn: boolean;
  existing: any | null;
  labels: Labels;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [q, setQ] = useState<number>(existing?.rating_quality ?? 0);
  const [v, setV] = useState<number>(existing?.rating_value ?? 0);
  const [c, setC] = useState<number>(existing?.rating_communication ?? 0);
  const [p, setP] = useState<number>(existing?.rating_punctuality ?? 0);
  const [rec, setRec] = useState<boolean>(existing ? existing.would_recommend : true);
  const [title, setTitle] = useState<string>(existing?.title ?? '');
  const [body, setBody] = useState<string>(existing?.body ?? '');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-6 text-center">
        <p className="text-ink-soft">{labels.signInPrompt}</p>
        <Link href="/sign-in" className="mt-2 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          {labels.signInCta}
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!q || !v || !c || !p) {
      setError(labels.rateAll);
      return;
    }
    setLoading(true);
    const {error} = await supabase.from('reviews').upsert(
      {
        company_id: companyId,
        author_id: userId,
        rating_quality: q,
        rating_value: v,
        rating_communication: c,
        rating_punctuality: p,
        would_recommend: rec,
        title: title || null,
        body,
        status: 'published'
      },
      {onConflict: 'company_id,author_id'}
    );
    setLoading(false);
    if (error) setError(error.message);
    else {
      setOk(true);
      router.refresh();
    }
  }

  const input = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-background p-5">
      <h3 className="font-semibold text-ink">{existing ? labels.editTitle : labels.writeTitle}</h3>
      <div className="mt-4 space-y-2.5">
        <StarInput label={labels.quality} value={q} onChange={setQ} />
        <StarInput label={labels.value} value={v} onChange={setV} />
        <StarInput label={labels.communication} value={c} onChange={setC} />
        <StarInput label={labels.punctuality} value={p} onChange={setP} />
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={rec} onChange={(e) => setRec(e.target.checked)} className="h-4 w-4 rounded border-border text-brand-600" />
        {labels.recommend}
      </label>
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-ink-soft">{labels.reviewTitle}</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={labels.reviewTitlePlaceholder} maxLength={120} />
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-sm font-medium text-ink-soft">{labels.body}</label>
        <textarea className={`${input} min-h-[110px]`} value={body} onChange={(e) => setBody(e.target.value)} placeholder={labels.bodyPlaceholder} required maxLength={5000} />
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {ok && <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">{labels.posted}</p>}
      <button type="submit" disabled={loading} className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
        {existing ? labels.update : labels.submit}
      </button>
    </form>
  );
}
