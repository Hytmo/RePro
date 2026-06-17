'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from '@/i18n/navigation';

export default function ResponseComposer({
  reviewId,
  userId,
  existingBody,
  labels
}: {
  reviewId: string;
  userId: string;
  existingBody: string | null;
  labels: {respond: string; edit: string; save: string; placeholder: string};
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(existingBody ?? '');
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-semibold text-brand-700 hover:underline">
        {existingBody ? labels.edit : labels.respond}
      </button>
    );
  }

  async function save() {
    setBusy(true);
    await supabase.from('review_responses').upsert({review_id: reviewId, responder_id: userId, body}, {onConflict: 'review_id'});
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mt-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={labels.placeholder}
        className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button onClick={save} disabled={busy || !body.trim()} className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
        {labels.save}
      </button>
    </div>
  );
}
