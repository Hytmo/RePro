'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!localStorage.getItem('repro-consent')) setShow(true);
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
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
      <div className="shell flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-ink-soft">
          {t('text')}{' '}
          <Link href="/privacy" className="font-bold text-brand-700 hover:underline">{t('learnMore')}</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose('essential')} className="rounded-full border border-border bg-white px-3.5 py-2 text-sm font-bold text-ink-soft transition hover:border-brand-400">{t('essential')}</button>
          <button onClick={() => choose('all')} className="rounded-full bg-ink px-3.5 py-2 text-sm font-black text-white transition hover:bg-brand-700">{t('accept')}</button>
        </div>
      </div>
    </div>
  );
}
