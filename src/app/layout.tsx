import type {Metadata, Viewport} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getTranslations} from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#4654f0'
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta');
  return {
    title: {default: t('title'), template: '%s · RePro'},
    description: t('description'),
    metadataBase: new URL('https://repro.lu')
  };
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-background text-ink antialiased">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
