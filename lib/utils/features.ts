export type FeatureFlag = 
  | 'enable_community'
  | 'enable_chat'
  | 'enable_wishlist'
  | 'enable_ratings'
  | 'enable_reports'
  | 'enable_admin_panel'
  | 'enable_seller_panel';

export type FeatureFlags = Record<FeatureFlag, boolean>;

// Default feature flags
const defaultFeatureFlags: FeatureFlags = {
  enable_community: true,
  enable_chat: true,
  enable_wishlist: true,
  enable_ratings: true,
  enable_reports: true,
  enable_admin_panel: true,
  enable_seller_panel: true
};

// In a real implementation, you might load these from a database or config file
let featureFlags: FeatureFlags = { ...defaultFeatureFlags };

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return featureFlags[feature] ?? false;
}

export function enableFeature(feature: FeatureFlag): void {
  featureFlags[feature] = true;
}

export function disableFeature(feature: FeatureFlag): void {
  featureFlags[feature] = false;
}

export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  featureFlags = { ...featureFlags, ...flags };
}

export function getFeatureFlags(): FeatureFlags {
  return { ...featureFlags };
}

// Utility function to check multiple features
export function areAllFeaturesEnabled(features: FeatureFlag[]): boolean {
  return features.every(feature => isFeatureEnabled(feature));
}

export function isAnyFeatureEnabled(features: FeatureFlag[]): boolean {
  return features.some(feature => isFeatureEnabled(feature));
}