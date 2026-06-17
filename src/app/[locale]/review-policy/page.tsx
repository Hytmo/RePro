import {getTranslations, setRequestLocale} from 'next-intl/server';
import ComingSoon from '@/components/ComingSoon';

export default async function ReviewPolicyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('footer');
  return <ComingSoon title={t('reviewPolicy')} />;
}
