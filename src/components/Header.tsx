import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import UserMenu from './UserMenu';
import BrandSeal from './BrandSeal';
import {createClient} from '@/lib/supabase/server';

export default async function Header() {
  const t = await getTranslations('nav');
  const supabase = await createClient();
  // Verify the JWT locally (no network round-trip to the Auth server); the proxy
  // middleware already validates & refreshes the session cookie on each request.
  const {data: claimsData} = await supabase.auth.getClaims();
  const claims = claimsData?.claims as {sub?: string; email?: string} | undefined;

  let displayName: string | null = null;
  let isAdmin = false;
  if (claims?.sub) {
    const {data} = await supabase
      .from('profiles')
      .select('display_name, role')
      .eq('id', claims.sub)
      .maybeSingle();
    displayName = data?.display_name || claims.email || 'Account';
    isAdmin = data?.role === 'admin';
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="h-1 bg-[linear-gradient(90deg,var(--color-lux-500),var(--color-brand-500),var(--color-mint-500))]" />
      <div className="shell flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 text-ink"
          aria-label="RePro.lu"
        >
          <BrandSeal className="h-10 w-10 shrink-0 text-brand-600 transition-transform group-hover:scale-105" />
          <span className="hidden leading-none min-[440px]:block">
            <span className="block text-lg font-black tracking-tight">
              RePro<span className="text-brand-600">.lu</span>
            </span>
            <span className="hidden text-[11px] font-semibold uppercase text-muted sm:block">
              {t('tagline')}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-border bg-white/70 p-1 text-sm font-semibold text-ink-soft md:flex">
          <Link
            href="/categories"
            className="rounded-full px-4 py-2 transition hover:bg-surface hover:text-brand-700"
          >
            {t('categories')}
          </Link>
          <Link
            href="/business"
            className="rounded-full px-4 py-2 transition hover:bg-surface hover:text-brand-700"
          >
            {t('forBusiness')}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 transition hover:bg-surface hover:text-brand-700"
            >
              {t('admin')}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          {claims?.sub ? (
            <UserMenu name={displayName!} signOutLabel={t('signOut')} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-brand-700 sm:inline"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
