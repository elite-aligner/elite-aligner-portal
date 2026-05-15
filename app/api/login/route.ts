import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // ✅ التحقق من Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // ✅ جلب الدور من جدول doctors
    const { data: doctorData, error: doctorError } = await supabaseServer
      .from('doctors')
      .select('id, email, name, role')
      .eq('email', email)
      .single();

    if (doctorError || !doctorData) {
      return NextResponse.json({ error: 'Doctor not found in database' }, { status: 404 });
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
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}