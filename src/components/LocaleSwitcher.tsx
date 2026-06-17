'use client';

import {useLocale} from 'next-intl';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

const fullNames: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  lb: 'Lëtzebuergesch'
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: string) {
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <div className="relative">
      <select
        aria-label="Language"
        value={locale}
        disabled={isPending}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-sm font-medium text-ink-soft transition hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {fullNames[l] ?? l.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted">
        ▾
      </span>
    </div>
  );
}
