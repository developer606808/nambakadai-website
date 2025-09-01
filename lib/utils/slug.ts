import { prisma } from "@/lib/data/prisma";

/**
 * Generate a unique slug for a product within a store
 * @param title The product title
 * @param storeId The store ID to check for uniqueness
 * @returns A unique slug string
 */
export async function generateUniqueSlug(title: string, storeId?: number): Promise<string> {
  // Create base slug from title
  let slug = createSlug(title);
  
  try {
    // If storeId is provided, check for uniqueness within the store
    // Otherwise, allow duplicates across stores
    if (storeId) {
      // Check if slug already exists within this store
      let existingProduct = await prisma.product.findFirst({
        where: {
          slug: slug,
          storeId: storeId
        }
      });
      
      // If slug exists, append a number and check again
      let counter = 1;
      while (existingProduct) {
        const newSlug = `${slug}-${counter}`;
        existingProduct = await prisma.product.findFirst({
          where: {
            slug: newSlug,
            storeId: storeId
          }
        });
        
        if (!existingProduct) {
          slug = newSlug;
          break;
        }
        
        counter++;
      }
    }
    // If no storeId is provided, we allow duplicates across stores
    // so we just return the base slug
  } catch (error) {
    console.error("Error generating unique slug:", error);
    // If there's an error with the slug generation, just return the base slug
  }
  
  return slug;
}

/**
 * Create a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A slug string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}