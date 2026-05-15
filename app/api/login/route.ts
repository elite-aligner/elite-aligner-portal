import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    // ✅ يقبل أي بريد وكلمة مرور (مؤقتاً للتجربة)
    const token = btoa(`${email}:${Date.now()}`);
    
    return NextResponse.json({
      success: true,
      user: {
        id: 'user-' + Date.now(),
        email: email,
        name: email.split('@')[0],
        role: email === 'panorama_farea@outlook.com' ? 'admin' : 'doctor'
      },
      session: {
        access_token: token,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000
      }
    });
    
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}