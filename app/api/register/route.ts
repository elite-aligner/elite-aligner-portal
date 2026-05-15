// @ts-nocheck
export const runtime = 'nodejs';  // ✅ تغيير من edge إلى nodejs
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Required' }, { status: 400 });
    }

    const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ email, password })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json({ error: authData.message || 'Failed to create user' }, { status: 400 });
    }

    const doctorResponse = await fetch(`${supabaseUrl}/rest/v1/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        id: authData.user.id,
        email,
        name,
        role: 'doctor'
      })
    });

    if (!doctorResponse.ok) {
      return NextResponse.json({ error: 'Failed to add doctor' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email,
        name,
        role: 'doctor'
      }
    });
    
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}