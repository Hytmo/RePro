import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';

// "/" is normally redirected to the default locale by the i18n middleware.
// Safe fallback so the root path is never a dead end.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
