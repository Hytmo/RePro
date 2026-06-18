'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function EnquiryRow({
  lead,
  labels
}: {
  lead: any;
  labels: {markResponded: string; answered: string; quote: string; contact: string};
}) {
  const supabase = createClient();
  const router = useRouter();
  const [responded, setResponded] = useState(!!lead.responded_at);
  const [busy, setBusy] = useState(false);

  async function mark() {
    setBusy(true);
    await supabase.from('leads').update({responded_at: new Date().toISOString(), status: 'responded'}).eq('id', lead.id);
    setBusy(false);
    setResponded(true);
    router.refresh();
  }

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-soft">{lead.type === 'quote' ? labels.quote : labels.contact}</span>
          <span className="text-sm font-medium text-ink">{lead.companies?.name}</span>
        </div>
        {responded ? (
          <span className="text-xs font-medium text-brand-700">{labels.answered}</span>
        ) : (
          <button onClick={mark} disabled={busy} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-brand-400 disabled:opacity-60">{labels.markResponded}</button>
        )}
      </div>
      <p className="mt-2 text-sm text-ink-soft">{lead.message}</p>
      {lead.contact_email && <p className="mt-1 text-xs text-muted">{lead.contact_email}</p>}
    </div>
  );
}
