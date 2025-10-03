
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  console.log('🔄 Auth callback received code:', !!code);

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      console.log('✅ Session exchange result:', { user: data.user?.email, error });
    } catch (error) {
      console.error('❌ Auth callback error:', error);
    }
  }

  console.log('🏠 Redirecting to:', `${requestUrl.origin}${next}`);
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}

