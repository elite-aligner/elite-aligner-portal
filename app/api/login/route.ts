import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (email === 'panorama_farea@outlook.com' && password === 'admin123') {
      return NextResponse.json({
        user: {
          id: 'admin-1',
          email: 'panorama_farea@outlook.com',
          name: 'Admin',
          role: 'admin'
        },
        token: 'admin-token-' + Date.now()
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}