// @ts-nocheck
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Required' }, { status: 400 });
    }

    const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ✅ إنشاء مستخدم في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // ✅ إضافة للجدول doctors
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .insert([{ 
        id: authData.user.id,
        email, 
        name, 
        role: 'doctor' 
      }]);

    if (doctorError) {
      return NextResponse.json({ error: doctorError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor registered successfully',
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