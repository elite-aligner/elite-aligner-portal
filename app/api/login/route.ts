// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// ✅ منع البناء المسبق
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Required' }, { status: 400 });
    }
    
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { data: doctorData } = await supabaseServer
      .from('doctors')
      .select('id, email, name, role')
      .eq('email', email)
      .single();

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
        access_token: authData.session.access_token,
        expires_at: authData.session.expires_at
      }
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}