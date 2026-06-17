'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

type Labels = {
  exportTitle: string; exportText: string; exportButton: string;
  dangerTitle: string; deleteText: string; deleteButton: string; deleteConfirm: string;
};

export default function AccountActions({userId, labels}: {userId: string; labels: Labels}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function exportData() {
    setBusy(true);
    const [profile, reviews, leads] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('reviews').select('*').eq('author_id', userId),
      supabase.from('leads').select('*').eq('user_id', userId)
    ]);
    const data = {profile: profile.data, reviews: reviews.data, leads: leads.data, exported_at: new Date().toISOString()};
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repro-my-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setBusy(false);
  }

  async function deleteAccount() {
    if (!window.confirm(labels.deleteConfirm)) return;
    setBusy(true);
    await supabase.rpc('delete_my_account');
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="font-semibold text-ink">{labels.exportTitle}</h2>
        <p className="mt-1 text-sm text-ink-soft">{labels.exportText}</p>
        <button onClick={exportData} disabled={busy} className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-brand-400 disabled:opacity-60">{labels.exportButton}</button>
      </section>
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">{labels.dangerTitle}</h2>
        <p className="mt-1 text-sm text-red-700">{labels.deleteText}</p>
        <button onClick={deleteAccount} disabled={busy} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">{labels.deleteButton}</button>
      </section>
    </div>
  );
}
