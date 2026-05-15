// @ts-nocheck
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Required' }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // ✅ استخدام fetch بدلاً من supabaseServer
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
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
      return NextResponse.json({ error: authData.message || 'Invalid credentials' }, { status: 401 });
    }

    // ✅ جلب بيانات الطبيب
    const doctorResponse = await fetch(`${supabaseUrl}/rest/v1/doctors?email=eq.${email}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const doctors = await doctorResponse.json();
    const doctorData = doctors[0];

    if (!doctorData) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: doctorData.id,
        email: doctorData.email,
        name: doctorData.name,
        role: doctorData.role || 'doctor'
      },
      session: {
        access_token: authData.access_token,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000
      }
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}