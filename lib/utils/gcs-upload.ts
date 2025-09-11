import { Storage } from '@google-cloud/storage';
import path from 'path';

// GCS Configuration
const GCS_CONFIG = {
  projectId: process.env.PROJECT_ID,
  bucketName: process.env.BUCKET_NAME,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  folderName: process.env.FOLDER_NAME || 'uploads',
};

// Initialize GCS client
let storage: Storage;
let bucket: any;

function initializeGCS() {
  if (!storage) {
    if (!GCS_CONFIG.projectId || !GCS_CONFIG.bucketName || !GCS_CONFIG.clientEmail || !GCS_CONFIG.privateKey) {
      throw new Error('Missing GCS configuration in environment variables');
    }

    // Create service account key object
    const keyData = {
      type: "service_account",
      project_id: GCS_CONFIG.projectId,
      private_key_id: "auto-generated",
      private_key: GCS_CONFIG.privateKey,
      client_email: GCS_CONFIG.clientEmail,
      client_id: "auto-generated",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(GCS_CONFIG.clientEmail)}`
    };

    // Create temporary key file path
    const keyFilePath = path.join(process.cwd(), 'gcs-service-key.json');

    // Write key file (this will be cleaned up after use)
    const fs = require('fs');
    fs.writeFileSync(keyFilePath, JSON.stringify(keyData, null, 2));

    storage = new Storage({
      projectId: GCS_CONFIG.projectId,
      keyFilename: keyFilePath
    });

    bucket = storage.bucket(GCS_CONFIG.bucketName);

    // Clean up key file after initialization
    setTimeout(() => {
      try {
        if (fs.existsSync(keyFilePath)) {
          fs.unlinkSync(keyFilePath);
        }
      } catch (error) {
        console.warn('Could not clean up temporary GCS key file:', error instanceof Error ? error.message : String(error));
      }
    }, 1000);
  }
}

// Generate unique filename
function generateFileName(originalName: string, prefix: string = 'file'): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomId}${ext}`;
}

// Upload file to GCS
export async function uploadToGCS(
  file: File,
  uploadType: string,
  customPrefix?: string
): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  try {
    initializeGCS();

    // Generate unique filename
    const prefix = customPrefix || uploadType.slice(0, -1); // Remove 's' from plural
    const fileName = generateFileName(file.name, prefix);

    // Create file path in GCS
    const gcsFilePath = `${GCS_CONFIG.folderName}/${uploadType}/${fileName}`;
    const gcsFile = bucket.file(gcsFilePath);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload options
    const uploadOptions = {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadType: uploadType,
          uploadedAt: new Date().toISOString(),
        },
      },
      public: true, // Make file publicly accessible
    };

    // Upload file
    await gcsFile.save(buffer, uploadOptions);

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${GCS_CONFIG.bucketName}/${gcsFilePath}`;

    return {
      success: true,
      url: publicUrl,
      fileName: fileName
    };

  } catch (error) {
    console.error('Error uploading to GCS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file to GCS'
    };
  }
}

// Delete file from GCS
export async function deleteFromGCS(fileUrl: string): Promise<boolean> {
  try {
    initializeGCS();

    // Extract file path from URL
    const urlPattern = `https://storage.googleapis.com/${GCS_CONFIG.bucketName}/${GCS_CONFIG.folderName}/`;
    if (!fileUrl.startsWith(urlPattern)) {
      console.warn('File URL does not match expected GCS pattern:', fileUrl);
      return false;
    }

    const filePath = fileUrl.replace(urlPattern, '');
    const gcsFile = bucket.file(filePath);

    // Check if file exists
    const [exists] = await gcsFile.exists();
    if (!exists) {
      console.warn('File does not exist in GCS:', filePath);
      return false;
    }

    // Delete file
    await gcsFile.delete();
    return true;

  } catch (error) {
    console.error('Error deleting from GCS:', error);
    return false;
  }
}

// GCS upload functions for specific types
export async function uploadBannerImageGCS(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadToGCS(file, 'banners', 'banner');
}

export async function uploadCategoryImageGCS(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'categories', 'category');
}

export async function uploadProductImageGCS(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'products', 'product');
}

export async function uploadProfileImageGCS(file: File, userId: string): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'profiles', `profile-${userId}`);
}

export async function uploadStoreImageGCS(file: File, type: 'logo' | 'banner'): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'stores', `${type}`);
}

export async function uploadVehicleImageGCS(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'vehicles', 'vehicle');
}

export async function uploadCommunityImageGCS(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  return uploadToGCS(file, 'community', 'community');
}

// GCS delete functions for specific types
export async function deleteBannerImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteCategoryImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteProductImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteProfileImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteStoreImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteVehicleImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}

export async function deleteCommunityImageGCS(imageUrl: string): Promise<boolean> {
  return deleteFromGCS(imageUrl);
}