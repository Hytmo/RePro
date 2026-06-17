'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('repro-consent')) setShow(true);
    } catch {}
  }, []);

  function choose(value: 'all' | 'essential') {
    try {
      localStorage.setItem('repro-consent', value);
      document.cookie = `repro-consent=${value}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-ink-soft">
          {t('text')}{' '}
          <Link href="/privacy" className="font-medium text-brand-700 hover:underline">{t('learnMore')}</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose('essential')} className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-brand-400">{t('essential')}</button>
          <button onClick={() => choose('all')} className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">{t('accept')}</button>
        </div>
      </div>
    </div>
  );
}
