'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function UpgradeButton({companyId, locale, label, unavailable}: {companyId: string; locale: string; label: string; unavailable: string}) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setErr(null);
    const {data, error} = await supabase.functions.invoke('create-checkout', {body: {company_id: companyId, locale}});
    setBusy(false);
    if (error || !data?.url) {
      setErr(unavailable);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={go} disabled={busy} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">{label}</button>
      {err && <span className="text-xs text-muted">{err}</span>}
    </div>
  );
}
