import {NextResponse} from 'next/server';
import type {EmailOtpType} from '@supabase/supabase-js';
import {createClient} from '@/lib/supabase/server';

// Handles email-confirmation / magic-link / recovery / OAuth callbacks.
// Supports both the PKCE `code` flow and the `token_hash`+`type` email flow,
// so confirmation links work regardless of the Supabase email template.
export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const supabase = await createClient();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type) {
    await supabase.auth.verifyOtp({type, token_hash: tokenHash});
  }
  return NextResponse.redirect(`${origin}${next}`);
}
