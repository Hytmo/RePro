import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-ink text-white">
      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white font-black text-ink">
                <span className="absolute inset-x-0 top-0 h-1 bg-lux-500" />
                R
              </span>
              <div>
                <div className="text-xl font-black tracking-tight">
                  RePro<span className="text-brand-300">.lu</span>
                </div>
                <p className="mt-1 text-sm text-white/60">{t('tagline')}</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-white/45">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/categories" className="transition hover:text-white">
                  {t('product')}
                </Link>
              </li>
              <li>
                <Link href="/business" className="transition hover:text-white">
                  {t('company')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-white/45">{t('legal')}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-white">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/review-policy" className="transition hover:text-white">
                  {t('reviewPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} RePro. {t('rights')}</span>
          <span>{t('noPaidRanking')}</span>
        </div>
      </div>
    </footer>
  );
}
