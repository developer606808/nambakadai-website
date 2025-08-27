export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type DistanceUnit = 'km' | 'miles';

export function calculateDistance(
  loc1: Location,
  loc2: Location,
  unit: DistanceUnit = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959; // Radius of the Earth in km or miles
  const dLat = deg2rad(loc2.latitude - loc1.latitude);
  const dLon = deg2rad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.latitude)) *
      Math.cos(deg2rad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatLocation(location: Location): string {
  if (location.address) {
    return location.address;
  }
  
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  // In a real implementation, you would use a service like Google Maps
  // For now, we'll return a placeholder
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}