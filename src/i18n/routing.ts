import {defineRouting} from 'next-intl/routing';

// Supported locales. English is the build default; German, French and
// Luxembourgish are first-class and fully routed from day one.
export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'lb'],
  defaultLocale: 'en',
  // Every locale is prefixed (/en, /de, /fr, /lb). "/" redirects to /en.
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];
