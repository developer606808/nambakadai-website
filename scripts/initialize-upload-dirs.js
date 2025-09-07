#!/usr/bin/env node

/**
 * Initialize Upload Directories Script
 *
 * This script ensures all upload directories exist with proper permissions
 * before the application starts. It should be run during deployment or
 * when setting up the application for the first time.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const UPLOAD_DIRS = {
  banners: 'public/uploads/banners',
  categories: 'public/uploads/categories',
  products: 'public/uploads/products',
  profiles: 'public/uploads/profiles',
  stores: 'public/uploads/stores',
  vehicles: 'public/uploads/vehicles',
};

const DEFAULT_PERMISSIONS = 0o755; // rwxr-xr-x

/**
 * Ensure upload directory exists with proper permissions
 */
async function ensureUploadDir(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);

  try {
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating upload directory: ${fullPath}`);
      fs.mkdirSync(fullPath, { recursive: true });

      // Set proper permissions (755: rwxr-xr-x)
      fs.chmodSync(fullPath, DEFAULT_PERMISSIONS);
      console.log(`✓ Directory created with permissions: ${DEFAULT_PERMISSIONS.toString(8)}`);
    } else {
      // Verify existing permissions
      const stats = fs.statSync(fullPath);
      const currentMode = stats.mode & 0o777;

      // If permissions are not correct, fix them
      if (currentMode !== DEFAULT_PERMISSIONS) {
        console.log(`Fixing permissions for existing directory: ${fullPath}`);
        console.log(`Current permissions: ${currentMode.toString(8)}, Target: ${DEFAULT_PERMISSIONS.toString(8)}`);
        fs.chmodSync(fullPath, DEFAULT_PERMISSIONS);
        console.log(`✓ Permissions fixed`);
      } else {
        console.log(`✓ Directory already exists with correct permissions: ${fullPath}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`✗ Error ensuring upload directory ${fullPath}:`, error.message);
    return false;
  }
}

/**
 * Initialize all upload directories
 */
async function initializeUploadDirectories() {
  console.log('🚀 Initializing upload directories...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const [type, dirPath] of Object.entries(UPLOAD_DIRS)) {
    const success = await ensureUploadDir(dirPath);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log(`\n📊 Initialization Summary:`);
  console.log(`✓ Successful: ${successCount}`);
  if (failureCount > 0) {
    console.log(`✗ Failed: ${failureCount}`);
    process.exit(1);
  } else {
    console.log(`🎉 All upload directories initialized successfully!`);
  }
}

// Run the initialization
if (require.main === module) {
  initializeUploadDirectories().catch((error) => {
    console.error('Fatal error during initialization:', error);
    process.exit(1);
  });
}

module.exports = { initializeUploadDirectories, ensureUploadDir };