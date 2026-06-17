import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default async function Header() {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            R
          </span>
          <span>
            RePro<span className="text-brand-600">.lu</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
          <Link href="/categories" className="transition hover:text-brand-700">
            {t('categories')}
          </Link>
          <Link href="/business" className="transition hover:text-brand-700">
            {t('forBusiness')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/sign-in"
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    </header>
  );
}
