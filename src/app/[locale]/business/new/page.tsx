import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {getCategories} from '@/lib/queries';
import {localizedName} from '@/lib/format';
import BusinessForm from '@/components/BusinessForm';

export default async function NewBusinessPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in`);
  const t = await getTranslations('business');
  const categories = (await getCategories()).map((c: any) => ({id: c.id, label: localizedName(c.name, locale)}));

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <span className="repro-kicker">{t('formKicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{t('newTitle')}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{t('newSubtitle')}</p>
      <div className="repro-card mt-6 rounded-lg p-6">
        <BusinessForm
          userId={user!.id}
          categories={categories}
          labels={{
            name: t('fName'), description: t('fDescription'), category: t('fCategory'), chooseCategory: t('fChooseCategory'),
            city: t('fCity'), address: t('fAddress'), phone: t('fPhone'), website: t('fWebsite'), email: t('fEmail'),
            submit: t('fSubmit'), submitting: t('fSubmitting')
          }}
        />
      </div>
    </div>
  );
}
