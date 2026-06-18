'use client';

import {useState} from 'react';
import {ThumbsUp} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function HelpfulButton({
  reviewId,
  userId,
  signedIn,
  initialVoted,
  count,
  label
}: {
  reviewId: string;
  userId: string | null;
  signedIn: boolean;
  initialVoted: boolean;
  count: number;
  label: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [voted, setVoted] = useState(initialVoted);
  const [n, setN] = useState(count);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push('/sign-in');
      return;
    }
    setBusy(true);
    if (voted) {
      await supabase.from('review_votes').delete().eq('review_id', reviewId).eq('voter_id', userId);
      setVoted(false);
      setN((x) => Math.max(0, x - 1));
    } else {
      await supabase.from('review_votes').upsert({review_id: reviewId, voter_id: userId, vote: 1}, {onConflict: 'review_id,voter_id'});
      setVoted(true);
      setN((x) => x + 1);
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:opacity-60 ${
        voted ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-border text-ink-soft hover:border-brand-300'
      }`}
    >
      <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.4} />
      {label} {n > 0 ? `(${n})` : ''}
    </button>
  );
}
