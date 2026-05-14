import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ✅ استخدم القيم مباشرة - تم التحديث
const supabaseUrl = 'https://ogysyioeyvsdzhelau.supabase.co';
const supabaseKey = 'sb_publishable_0drLNWdB48knxLuh7bzlvQ_nWRCaiXT';

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