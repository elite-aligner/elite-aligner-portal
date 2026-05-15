// @ts-nocheck
import { NextResponse } from 'next/server';
import { USERS } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    const existingUser = USERS.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' }, 
        { status: 409 }
      );
    }
    
    const newUser = {
      id: String(USERS.length + 1),
      name,
      email,
      password,
      role: 'doctor',
      createdAt: new Date().toISOString()
    };
    
    USERS.push(newUser);
    
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}