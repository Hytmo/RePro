'use client';

import {createClient} from '@/lib/supabase/client';
import {Link} from '@/i18n/navigation';
import {useState} from 'react';

export default function UserMenu({name, signOutLabel}: {name: string; signOutLabel: string}) {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    const seg = window.location.pathname.split('/')[1];
    const loc = ['en', 'de', 'fr', 'lb'].includes(seg) ? seg : 'en';
    window.location.assign(`/${loc}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        className="hidden max-w-[10rem] truncate rounded-full bg-surface px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-brand-50 hover:text-brand-700 sm:inline"
      >
        {name}
      </Link>
      <button
        onClick={signOut}
        disabled={busy}
        className="rounded-full border border-border bg-white px-3 py-2 text-sm font-bold text-ink-soft transition hover:border-brand-300 disabled:opacity-60"
      >
        {signOutLabel}
      </button>
    </div>
  );
}
