// Server-side file upload utilities (Node.js dependencies)
import { writeFile, mkdir, unlink, chmod } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import path from 'path';

// Server-side configuration
const SERVER_CONFIG = {
  UPLOAD_DIR: 'public/uploads',
  DEFAULT_PERMISSIONS: 0o755, // rwxr-xr-x
} as const;

// Upload directory configurations for different types
const UPLOAD_DIRS = {
  banners: 'public/uploads/banners',
  categories: 'public/uploads/categories',
  products: 'public/uploads/products',
  profiles: 'public/uploads/profiles',
  stores: 'public/uploads/stores',
  vehicles: 'public/uploads/vehicles',
} as const;

// Ensure upload directory exists with proper permissions
async function ensureUploadDir(dirPath: string): Promise<string> {
  const uploadPath = path.join(process.cwd(), dirPath);

  try {
    // Check if directory exists
    if (!existsSync(uploadPath)) {
      console.log(`Creating upload directory: ${uploadPath}`);
      await mkdir(uploadPath, { recursive: true });

      // Set proper permissions (755: rwxr-xr-x)
      await chmod(uploadPath, SERVER_CONFIG.DEFAULT_PERMISSIONS);
      console.log(`Directory created with permissions: ${SERVER_CONFIG.DEFAULT_PERMISSIONS.toString(8)}`);
    } else {
      // Verify existing permissions
      const stats = statSync(uploadPath);
      const currentMode = stats.mode & 0o777;

      // If permissions are not correct, fix them
      if (currentMode !== SERVER_CONFIG.DEFAULT_PERMISSIONS) {
        console.log(`Fixing permissions for existing directory: ${uploadPath}`);
        console.log(`Current permissions: ${currentMode.toString(8)}, Target: ${SERVER_CONFIG.DEFAULT_PERMISSIONS.toString(8)}`);
        await chmod(uploadPath, SERVER_CONFIG.DEFAULT_PERMISSIONS);
      }
    }

    return uploadPath;
  } catch (error) {
    console.error(`Error ensuring upload directory ${uploadPath}:`, error);
    throw new Error(`Failed to create or access upload directory: ${uploadPath}`);
  }
}

// Generate unique filename
function generateFileName(originalName: string, prefix: string = 'file'): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomId}${ext}`;
}

// Generic server-side upload function
export async function uploadFileServer(
  file: File,
  uploadType: keyof typeof UPLOAD_DIRS,
  customPrefix?: string
): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  try {
    const uploadDirPath = UPLOAD_DIRS[uploadType];
    if (!uploadDirPath) {
      return { success: false, error: `Invalid upload type: ${uploadType}` };
    }

    // Ensure upload directory exists with proper permissions
    const uploadDir = await ensureUploadDir(uploadDirPath);

    // Generate unique filename
    const prefix = customPrefix || uploadType.slice(0, -1); // Remove 's' from plural
    const fileName = generateFileName(file.name, prefix);
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Set file permissions (644: rw-r--r--)
    await chmod(filePath, 0o644);

    // Return public URL
    const publicUrl = `/${uploadDirPath}/${fileName}`;

    return {
      success: true,
      url: publicUrl,
      fileName
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
}

// Server-side upload functions for specific types
export async function uploadBannerImageServer(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadFileServer(file, 'banners', 'banner');
}

export async function uploadCategoryImageServer(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadFileServer(file, 'categories', 'category');
}

export async function uploadProductImageServer(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadFileServer(file, 'products', 'product');
}

export async function uploadProfileImageServer(file: File, userId: string): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  const result = await uploadFileServer(file, 'profiles', `profile-${userId}`);
  return result;
}

export async function uploadStoreImageServer(file: File, type: 'logo' | 'banner'): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadFileServer(file, 'stores', `${type}`);
}

export async function uploadVehicleImageServer(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadFileServer(file, 'vehicles', 'vehicle');
}

// Server-side delete function
export async function deleteFileServer(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl.startsWith('/uploads/')) {
      return false; // Not our uploaded file
    }

    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

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

// Server-side delete functions for specific types
export async function deleteBannerImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

export async function deleteCategoryImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

export async function deleteProductImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

export async function deleteProfileImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

export async function deleteStoreImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

export async function deleteVehicleImageServer(imageUrl: string): Promise<boolean> {
  return deleteFileServer(imageUrl);
}

// Convert base64 to file (for migration)
export async function base64ToFileServer(base64Data: string, uploadType: keyof typeof UPLOAD_DIRS): Promise<string> {
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

    // Ensure upload directory exists
    const uploadDirPath = UPLOAD_DIRS[uploadType];
    const uploadDir = await ensureUploadDir(uploadDirPath);
    const filePath = path.join(uploadDir, newFileName);

    // Convert base64 to buffer
    const buffer = new Uint8Array(Buffer.from(base64Content, 'base64'));

    // Save to uploads directory
    await writeFile(filePath, buffer);

    // Set file permissions
    await chmod(filePath, 0o644);

    // Return public URL
    return `/${uploadDirPath}/${newFileName}`;
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    throw error;
  }
}

// Initialize all upload directories on startup
export async function initializeUploadDirectories(): Promise<void> {
  try {
    console.log('Initializing upload directories...');

    for (const [type, dirPath] of Object.entries(UPLOAD_DIRS)) {
      await ensureUploadDir(dirPath);
      console.log(`✓ Upload directory initialized: ${type} -> ${dirPath}`);
    }

    console.log('All upload directories initialized successfully');
  } catch (error) {
    console.error('Error initializing upload directories:', error);
    throw error;
  }
}
