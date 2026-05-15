// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password and name are required' }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' }, 
        { status: 400 }
      );
    }
    
    // ✅ إنشاء مستخدم في Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message }, 
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' }, 
        { status: 500 }
      );
    }

    // ✅ إضافة للجدول doctors
    const { data: doctorData, error: doctorError } = await supabaseServer
      .from('doctors')
      .insert([{ 
        id: authData.user.id,
        email, 
        name, 
        role: 'doctor' 
      }]);

    if (doctorError) {
      return NextResponse.json(
        { error: doctorError.message }, 
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: err.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}