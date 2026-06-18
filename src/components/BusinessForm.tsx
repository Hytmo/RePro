'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'business'
  );
}

type Labels = {
  name: string;
  description: string;
  category: string;
  chooseCategory: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  submit: string;
  submitting: string;
};

export default function BusinessForm({
  userId,
  categories,
  labels
}: {
  userId: string;
  categories: {id: string; label: string}[];
  labels: Labels;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [f, setF] = useState({
    name: '',
    description: '',
    category: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setF((s) => ({...s, [k]: v}));
  const input =
    'w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-300';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const slug = `${slugify(f.name)}-${Math.random().toString(36).slice(2, 6)}`;
    const {data, error} = await supabase
      .from('companies')
      .insert({
        name: f.name,
        slug,
        description: f.description || null,
        city: f.city || null,
        address: f.address || null,
        phone: f.phone || null,
        website: f.website || null,
        email: f.email || null,
        status: 'pending',
        source: 'self_registration',
        created_by: userId,
        owner_id: userId
      })
      .select('id')
      .single();
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (f.category) {
      await supabase.from('company_categories').insert({company_id: data.id, category_id: f.category});
    }
    router.push('/business');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label={labels.name}>
        <input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} required maxLength={120} />
      </Field>
      <Field label={labels.category}>
        <select className={input} value={f.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">{labels.chooseCategory}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label={labels.description}>
        <textarea className={`${input} min-h-[90px]`} value={f.description} onChange={(e) => set('description', e.target.value)} maxLength={1000} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={labels.city}>
          <input className={input} value={f.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label={labels.phone}>
          <input className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
      </div>
      <Field label={labels.address}>
        <input className={input} value={f.address} onChange={(e) => set('address', e.target.value)} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={labels.website}>
          <input className={input} value={f.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
        </Field>
        <Field label={labels.email}>
          <input type="email" className={input} value={f.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
