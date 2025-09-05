// Client-side file upload utilities (no Node.js dependencies)

// Configuration for file uploads (client-side safe)
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  URL_PREFIX: '/uploads/banners',
} as const;

// Validate file type and size (client-side safe)
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type as typeof UPLOAD_CONFIG.ALLOWED_TYPES[number])) {
    return {
      isValid: false,
      error: `File type must be one of: ${UPLOAD_CONFIG.ALLOWED_TYPES.join(', ')}`,
    };
  }

  return { isValid: true };
}

// Get file info from URL (client-side safe)
export function getFileInfo(imageUrl: string): { fileName: string; isUploaded: boolean } {
  const isUploaded = imageUrl.startsWith(UPLOAD_CONFIG.URL_PREFIX);
  const fileName = isUploaded ? imageUrl.split('/').pop() || '' : '';

  return { fileName, isUploaded };
}

// Optimize image URL for different sizes (future enhancement)
export function getOptimizedImageUrl(imageUrl: string): string {
  // For now, return original URL
  // In the future, you can implement image resizing here
  return imageUrl;
}
