import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-lg font-semibold text-ink">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
                R
              </span>
              <span>
                RePro<span className="text-brand-600">.lu</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{t('tagline')}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">{t('legal')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/privacy" className="transition hover:text-brand-700">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-brand-700">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/review-policy" className="transition hover:text-brand-700">
                  {t('reviewPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {year} RePro · {t('rights')}
        </div>
      </div>
    </footer>
  );
}
