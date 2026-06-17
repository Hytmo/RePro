import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import en from '../../messages/en.json';

type Dict = {[k: string]: unknown};

// English is the source of truth; other locales override what they translate
// and fall back to English for anything missing (English-first strategy).
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = {...base};
  for (const k of Object.keys(override)) {
    const b = base[k];
    const o = override[k];
    if (b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b) && !Array.isArray(o)) {
      out[k] = deepMerge(b as Dict, o as Dict);
    } else {
      out[k] = o;
    }
  }
  return out;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const localeMessages = (await import(`../../messages/${locale}.json`)).default as Dict;
  const messages = locale === 'en' ? localeMessages : deepMerge(en as Dict, localeMessages);
  return {locale, messages};
});
