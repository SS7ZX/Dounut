// src/app/auth/callback/route.ts
// Handles Supabase OAuth callback
// Supports BOTH flows: PKCE (code param) and Implicit (#fragment)

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url    = new URL(request.url);
  const code   = url.searchParams.get('code');
  const next   = url.searchParams.get('next') ?? '/dashboard';
  const origin = url.origin;

  // No code = Implicit flow — tokens in URL fragment (#access_token=...)
  // Fragment cannot be read server-side, redirect to client-side page
  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/confirm?next=${encodeURIComponent(next)}`
    );
  }

  // PKCE flow — exchange code for session server-side
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}