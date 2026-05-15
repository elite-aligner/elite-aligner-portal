import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
    
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}