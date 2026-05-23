// @ts-nocheck
// ⚠️ هذا الملف معطل — نستخدم Supabase مباشرة من Browser
// بسبب مشاكل DNS في Vercel Serverless

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'API disabled — use client-side Supabase' }, 
    { status: 400 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: 'API disabled — use client-side Supabase' }, 
    { status: 400 }
  );
}