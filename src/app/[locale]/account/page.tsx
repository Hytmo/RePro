import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import AccountActions from '@/components/AccountActions';

export const metadata = {title: 'Account'};

export default async function AccountPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in`);
  const {data: profile} = await supabase.from('profiles').select('display_name').eq('id', user!.id).maybeSingle();
  const t = await getTranslations('account');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <span className="repro-kicker">{t('kicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{t('title')}</h1>
      <p className="mt-2 text-ink-soft">{t('signedInAs')} <span className="font-bold text-ink">{profile?.display_name || user!.email}</span></p>
      <AccountActions
        userId={user!.id}
        labels={{
          exportTitle: t('exportTitle'), exportText: t('exportText'), exportButton: t('exportButton'),
          dangerTitle: t('dangerTitle'), deleteText: t('deleteText'), deleteButton: t('deleteButton'), deleteConfirm: t('deleteConfirm')
        }}
      />
    </div>
  );
}
