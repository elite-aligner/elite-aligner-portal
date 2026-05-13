import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  'https://ogvsyioeyvsdzhelau.supabase.co',
  'eyJhbGc1OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndnN5aW9leXZzZHpoZWxhdSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE1MjA0MjAwLCJleHAiOjIwMzA3ODAyMDB9...'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
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