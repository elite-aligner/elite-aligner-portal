// @ts-nocheck
import { NextResponse } from 'next/server';

// ✅ قائمة المستخدمين (مؤقتاً)
const USERS = [
  {
    id: '1',
    email: 'panorama_farea@outlook.com',
    password: '123456',
    name: 'Dr. Panorama',
    role: 'doctor'
  }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    // ✅ البحث عن المستخدم
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    
    // ✅ إنشاء توكن
    const token = btoa(`${user.id}:${Date.now()}`);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
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