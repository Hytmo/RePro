'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function AdminGenerateSummaries({label, busyLabel}: {label: string; busyLabel: string}) {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setMsg(null);
    const {data, error} = await supabase.functions.invoke('summarize-company', {body: {}});
    setBusy(false);
    if (error) {
      setMsg('AI not configured yet (add ANTHROPIC_API_KEY).');
      return;
    }
    if (data?.skipped) {
      setMsg('Add ANTHROPIC_API_KEY to enable.');
      return;
    }
    setMsg(`Generated ${data?.done ?? 0} summaries.`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={go} disabled={busy} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-brand-400 disabled:opacity-60">{busy ? busyLabel : label}</button>
      {msg && <span className="text-xs text-muted">{msg}</span>}
    </div>
  );
}
