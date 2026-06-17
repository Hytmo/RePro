import {getTranslations, setRequestLocale} from 'next-intl/server';
import AuthForm from '@/components/AuthForm';

export default async function SignUpPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">{t('signUpTitle')}</h1>
      <p className="mt-1 text-sm text-muted">{t('signUpSubtitle')}</p>
      <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-sm">
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
