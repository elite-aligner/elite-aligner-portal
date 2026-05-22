import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ قيمة مباشرة (لأن env لا يعمل في هذا الملف أثناء البناء)
const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const path = formData.get('path') as string;
    
    if (!file || !bucket || !path) {
      return NextResponse.json({ error: 'Missing file, bucket, or path' }, { status: 400 });
    }

    // ✅ تحويل File إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ رفع Buffer
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // الحصول على Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path });
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}