'use client';

import {useLocale} from 'next-intl';
import {useTransition} from 'react';
import {ChevronDown} from 'lucide-react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

const fullNames: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Fran\u00e7ais',
  lb: 'L\u00ebtzebuergesch'
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
        className="h-10 appearance-none rounded-full border border-border bg-white pl-3 pr-8 text-sm font-bold text-ink-soft transition hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-60"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {fullNames[l] ?? l.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  );
}
