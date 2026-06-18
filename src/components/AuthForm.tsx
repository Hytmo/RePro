'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {Link} from '@/i18n/navigation';

type Labels = {
  email: string;
  password: string;
  displayName: string;
  submit: string;
  switchPrompt: string;
  switchLink: string;
  checkEmail: string;
};

export default function AuthForm({
  mode,
  labels
}: {
  mode: 'signin' | 'signup';
  labels: Labels;
}) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const {data, error} = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {display_name: name},
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) setError(error.message);
        else if (data.session) {
          const seg = window.location.pathname.split('/')[1];
          const loc = ['en', 'de', 'fr', 'lb'].includes(seg) ? seg : 'en';
          window.location.assign(`/${loc}`);
        } else setNotice(labels.checkEmail);
      } else {
        const {error} = await supabase.auth.signInWithPassword({email, password});
        if (error) setError(error.message);
        else {
          const seg = window.location.pathname.split('/')[1];
          const loc = ['en', 'de', 'fr', 'lb'].includes(seg) ? seg : 'en';
          window.location.assign(`/${loc}`);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const input =
    'w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-muted focus:ring-2 focus:ring-brand-300';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label className="mb-1 block text-sm font-bold text-ink-soft">{labels.displayName}</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">{labels.email}</label>
        <input type="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">{labels.password}</label>
        <input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} className={input} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">{notice}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-4 py-3 text-sm font-black text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {labels.submit}
      </button>

      <p className="text-center text-sm text-muted">
        {labels.switchPrompt}{' '}
        <Link href={mode === 'signin' ? '/sign-up' : '/sign-in'} className="font-bold text-brand-700 hover:underline">
          {labels.switchLink}
        </Link>
      </p>
    </form>
  );
}
