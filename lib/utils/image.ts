export type ImageSize = 'thumb' | 'small' | 'medium' | 'large' | 'original';

export const imageSizes: Record<ImageSize, { width: number; height: number }> = {
  thumb: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  original: { width: 0, height: 0 } // No resizing
};

export function getImageUrl(
  publicId: string,
  size: ImageSize = 'medium',
  format: string = 'webp'
): string {
  // In a real implementation, you would use a service like Cloudinary
  // For now, we'll return a placeholder
  
  const { width, height } = imageSizes[size];
  
  if (width === 0 && height === 0) {
    return `/images/${publicId}.${format}`;
  }
  
  return `/images/${publicId}_${width}x${height}.${format}`;
}

export function optimizeImage(imageUrl: string, maxWidth: number = 800): string {
  // In a real implementation, you would use Next.js Image component or a service
  // For now, we'll just return the original URL
  
  return imageUrl;
}