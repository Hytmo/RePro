'use client';

import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';
import {useState} from 'react';

export default function UserMenu({name, signOutLabel}: {name: string; signOutLabel: string}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[10rem] truncate text-sm font-medium text-ink-soft sm:inline">{name}</span>
      <button
        onClick={signOut}
        disabled={busy}
        className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-brand-400 disabled:opacity-60"
      >
        {signOutLabel}
      </button>
    </div>
  );
}
