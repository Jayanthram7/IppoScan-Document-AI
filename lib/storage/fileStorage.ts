import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
export async function ensureUploadDir(): Promise<void> {
  await fs.ensureDir(UPLOAD_DIR);
}

export async function saveFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{ filePath: string; fileName: string }> {
  await ensureUploadDir();
  
  // Generate unique filename
  const ext = path.extname(originalName);
  const fileName = `${Date.now()}-${uuidv4()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Save file
  await fs.writeFile(filePath, fileBuffer);
  
  return {
    filePath: `/uploads/${fileName}`,
    fileName,
  };
}

export async function readFile(filePath: string): Promise<Buffer> {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  return await fs.readFile(fullPath);
}

export async function deleteFile(filePath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  if (await fs.pathExists(fullPath)) {
    await fs.remove(fullPath);
  }
}

export function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export function isValidFileType(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.pdf'].includes(ext);
}

