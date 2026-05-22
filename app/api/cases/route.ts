import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const DATABASE_URL = process.env.POSTGRES_URL || '';
const sql = postgres(DATABASE_URL);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await sql`
      INSERT INTO cases ${sql(body)}
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM cases ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}