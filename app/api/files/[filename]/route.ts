import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const filePath = join(process.cwd(), 'public', 'files', filename);
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/sla',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}