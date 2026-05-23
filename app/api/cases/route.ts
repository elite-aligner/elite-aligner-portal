// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ المشروع الجديد
const supabaseUrl = 'https://fqwbfisrcidyikssm.supabase.co';
const supabaseKey = 'sb_publishable_eN2-t1lk8Cpx3TCwzhCWw_3rSVv...';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.doctor_id || !body.patient_name) {
      return NextResponse.json(
        { error: 'Missing required fields: doctor_id, patient_name' }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('cases')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create case' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id');
    
    let query = supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase select error:', error);
      throw new Error(error.message);
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cases' }, 
      { status: 500 }
    );
  }
}