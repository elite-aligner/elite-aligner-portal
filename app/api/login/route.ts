// @ts-nocheck
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Required' }, { status: 400 });
    }
    
    // ✅ إنشاء عميل Supabase مباشرة
    const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ✅ التحقق من Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // ✅ جلب بيانات الطبيب
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id, email, name, role')
      .eq('email', email)
      .single();

    if (doctorError || !doctorData) {
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
        access_token: authData.session.access_token,
        expires_at: authData.session.expires_at
      }
    });
    
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}