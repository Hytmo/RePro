'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function ReportButton({
  reviewId,
  companyId,
  userId,
  signedIn,
  labels
}: {
  reviewId: string;
  companyId: string;
  userId: string | null;
  signedIn: boolean;
  labels: {report: string; reason: string; submit: string; reported: string};
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);

  if (done) return <span className="text-xs text-muted">{labels.reported}</span>;

  if (!open) {
    return (
      <button
        onClick={() => (signedIn ? setOpen(true) : router.push('/sign-in'))}
        className="text-xs text-muted transition hover:text-ink"
      >
        {labels.report}
      </button>
    );
  }

  async function submit() {
    await supabase.from('reports').insert({
      target: 'review',
      review_id: reviewId,
      company_id: companyId,
      reporter_id: userId,
      reason: reason || 'Inappropriate content'
    });
    setDone(true);
  }

  return (
    <span className="inline-flex items-center gap-1">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={labels.reason}
        className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button onClick={submit} className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-medium text-white">
        {labels.submit}
      </button>
    </span>
  );
}
