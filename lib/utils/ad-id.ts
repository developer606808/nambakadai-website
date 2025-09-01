/**
 * Generate adId for products and vehicles
 * Format: 'NK-MS(store words first letters)time()'
 * @param storeName - Name of the store
 * @returns Generated adId string
 */
export function generateAdId(storeName: string): string {
  // Extract first letters from store name words
  const words = storeName.trim().split(/\s+/);
  const firstLetters = words
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3); // Limit to 3 characters

  // Get current timestamp
  const timestamp = Date.now();

  // Format: NK-MS + first letters + timestamp
  return `NK-MS${firstLetters}${timestamp}`;
}

/**
 * Generate adId for products (uses store name from session)
 * @param storeName - Name of the store
 * @returns Generated adId string
 */
export function generateProductAdId(storeName: string): string {
  return generateAdId(storeName);
}

/**
 * Generate adId for vehicles (uses store name from session)
 * @param storeName - Name of the store
 * @returns Generated adId string
 */
export function generateVehicleAdId(storeName: string): string {
  return generateAdId(storeName);
}