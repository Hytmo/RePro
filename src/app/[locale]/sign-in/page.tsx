import {getTranslations, setRequestLocale} from 'next-intl/server';
import AuthForm from '@/components/AuthForm';

export default async function SignInPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <span className="repro-kicker">{t('kicker')}</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{t('signInTitle')}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{t('signInSubtitle')}</p>
      <div className="repro-card mt-6 rounded-lg p-6">
        <AuthForm
          mode="signin"
          labels={{
            email: t('email'),
            password: t('password'),
            displayName: t('displayName'),
            submit: t('signInButton'),
            switchPrompt: t('noAccount'),
            switchLink: t('signUpLink'),
            checkEmail: t('checkEmail')
          }}
        />
      </div>
    </div>
  );
}
