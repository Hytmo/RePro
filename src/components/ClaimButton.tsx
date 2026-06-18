'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function ClaimButton({
  companyId,
  userId,
  signedIn,
  alreadyClaimed,
  labels
}: {
  companyId: string;
  userId: string | null;
  signedIn: boolean;
  alreadyClaimed: boolean;
  labels: {claim: string; pending: string};
}) {
  const router = useRouter();
  const supabase = createClient();
  const [done, setDone] = useState(alreadyClaimed);
  const [busy, setBusy] = useState(false);

  if (done) return <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft">{labels.pending}</span>;

  async function claim() {
    if (!signedIn) {
      router.push('/sign-in');
      return;
    }
    setBusy(true);
    await supabase.from('company_claims').insert({company_id: companyId, user_id: userId});
    setBusy(false);
    setDone(true);
    router.refresh();
  }

  return (
    <button onClick={claim} disabled={busy} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-brand-400 disabled:opacity-60">
      {labels.claim}
    </button>
  );
}
