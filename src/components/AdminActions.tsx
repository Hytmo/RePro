'use client';

import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';
import {useState} from 'react';

const btn = 'rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50';
const approve = `${btn} bg-brand-600 text-white hover:bg-brand-700`;
const neutral = `${btn} border border-border text-ink-soft hover:border-brand-300`;
const danger = `${btn} border border-red-200 text-red-700 hover:bg-red-50`;

export function CompanyActions({companyId, labels}: {companyId: string; labels: {approve: string; reject: string}}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  async function set(status: 'verified' | 'rejected') {
    setBusy(true);
    await supabase.from('companies').update({status}).eq('id', companyId);
    setBusy(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <button className={approve} disabled={busy} onClick={() => set('verified')}>{labels.approve}</button>
      <button className={danger} disabled={busy} onClick={() => set('rejected')}>{labels.reject}</button>
    </div>
  );
}

export function ClaimActions({claimId, companyId, userId, labels}: {claimId: string; companyId: string; userId: string; labels: {approve: string; reject: string}}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  async function approveClaim() {
    setBusy(true);
    await supabase.from('companies').update({owner_id: userId}).eq('id', companyId);
    await supabase.from('company_claims').update({status: 'approved', resolved_at: new Date().toISOString()}).eq('id', claimId);
    setBusy(false);
    router.refresh();
  }
  async function rejectClaim() {
    setBusy(true);
    await supabase.from('company_claims').update({status: 'rejected', resolved_at: new Date().toISOString()}).eq('id', claimId);
    setBusy(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <button className={approve} disabled={busy} onClick={approveClaim}>{labels.approve}</button>
      <button className={danger} disabled={busy} onClick={rejectClaim}>{labels.reject}</button>
    </div>
  );
}

export function ReviewActions({reviewId, removed, labels}: {reviewId: string; removed: boolean; labels: {remove: string; restore: string}}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  async function set(status: 'published' | 'removed') {
    setBusy(true);
    await supabase.from('reviews').update({status}).eq('id', reviewId);
    setBusy(false);
    router.refresh();
  }
  return removed ? (
    <button className={neutral} disabled={busy} onClick={() => set('published')}>{labels.restore}</button>
  ) : (
    <button className={danger} disabled={busy} onClick={() => set('removed')}>{labels.remove}</button>
  );
}

export function ReportActions({reportId, reviewId, labels}: {reportId: string; reviewId: string | null; labels: {resolve: string; removeReview: string}}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  async function resolve() {
    setBusy(true);
    await supabase.from('reports').update({status: 'resolved', resolved_at: new Date().toISOString()}).eq('id', reportId);
    setBusy(false);
    router.refresh();
  }
  async function removeAndResolve() {
    setBusy(true);
    if (reviewId) await supabase.from('reviews').update({status: 'removed'}).eq('id', reviewId);
    await supabase.from('reports').update({status: 'resolved', resolved_at: new Date().toISOString()}).eq('id', reportId);
    setBusy(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <button className={neutral} disabled={busy} onClick={resolve}>{labels.resolve}</button>
      {reviewId && <button className={danger} disabled={busy} onClick={removeAndResolve}>{labels.removeReview}</button>}
    </div>
  );
}
