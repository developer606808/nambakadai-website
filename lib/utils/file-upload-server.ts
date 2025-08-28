// Server-side file upload utilities (Node.js dependencies)
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOAD_CONFIG } from './file-upload';

// Server-side configuration
const SERVER_CONFIG = {
  UPLOAD_DIR: 'public/uploads/banners',
} as const;

// Ensure upload directory exists
async function ensureUploadDir(): Promise<string> {
  const uploadPath = path.join(process.cwd(), SERVER_CONFIG.UPLOAD_DIR);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
  return uploadPath;
}

// Generate unique filename
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8); // Simple random ID
  return `banner_${timestamp}_${randomId}${ext}`;
}

// Server-side upload function
export async function uploadBannerImageServer(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir();

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `${UPLOAD_CONFIG.URL_PREFIX}/${fileName}`;
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

// Server-side delete function
export async function deleteBannerImageServer(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl.startsWith(UPLOAD_CONFIG.URL_PREFIX)) {
      return false; // Not our uploaded file
    }

    const fileName = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), SERVER_CONFIG.UPLOAD_DIR, fileName);

    // Check if file exists and delete
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Convert base64 to file (for migration)
export async function base64ToFileServer(base64Data: string, originalFileName: string): Promise<string> {
  try {
    // Extract the actual base64 data (remove data:image/...;base64, prefix)
    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 format');
    }

    const imageType = matches[1];
    const base64Content = matches[2];
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const newFileName = `migrated_${timestamp}_${randomId}.${imageType}`;
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir();
    const filePath = path.join(uploadDir, newFileName);
    
    // Save to uploads directory
    await writeFile(filePath, buffer);
    
    // Return public URL
    return `${UPLOAD_CONFIG.URL_PREFIX}/${newFileName}`;
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    throw error;
  }
}
