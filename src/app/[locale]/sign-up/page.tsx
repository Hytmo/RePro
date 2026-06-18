import {getTranslations, setRequestLocale} from 'next-intl/server';
import AuthForm from '@/components/AuthForm';

export default async function SignUpPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <span className="repro-kicker">{t('kicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{t('signUpTitle')}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{t('signUpSubtitle')}</p>
      <div className="repro-card mt-6 rounded-lg p-6">
        <AuthForm
          mode="signup"
          labels={{
            email: t('email'),
            password: t('password'),
            displayName: t('displayName'),
            submit: t('signUpButton'),
            switchPrompt: t('haveAccount'),
            switchLink: t('signInLink'),
            checkEmail: t('checkEmail')
          }}
        />
      </div>
    </div>
  );
}
