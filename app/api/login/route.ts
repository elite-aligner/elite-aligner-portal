import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ✅ استخدم SUPABASE_URL بدلاً من NEXT_PUBLIC_SUPABASE_URL في API Routes
const supabaseUrl = process.env.SUPABASE_URL || 'https://sknybbyxencuhbenshk.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_TqgzLzUYs9Hn9jyIAXUCOg_9TlGXlNO';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}