import { NextRequest, NextResponse } from 'next/server';
import { saveFile, isValidFileType, getMimeType } from '@/lib/storage/fileStorage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidFileType(file.name)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, and PDF are allowed.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = getMimeType(file.name);

    // Save file
    const { filePath, fileName } = await saveFile(buffer, file.name, mimeType);

    return NextResponse.json({
      success: true,
      filePath,
      fileName,
      mimeType,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

