const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function uploadToGCS() {
  try {
    console.log('🚀 Starting upload to Google Cloud Storage...\n');

    // Get configuration from environment variables
    const projectId = process.env.PROJECT_ID;
    const bucketName = process.env.BUCKET_NAME;
    const clientEmail = process.env.CLIENT_EMAIL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!projectId || !bucketName || !clientEmail || !privateKey) {
      console.error('❌ Missing GCS credentials in .env file. Please ensure the following variables are set:');
      console.error('   - PROJECT_ID');
      console.error('   - BUCKET_NAME');
      console.error('   - CLIENT_EMAIL');
      console.error('   - PRIVATE_KEY');
      process.exit(1);
    }

    console.log(`📋 Configuration:`);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Bucket: ${bucketName}`);
    console.log(`   Service Account: ${clientEmail}\n`);

    // Create service account key file
    const keyFilePath = path.join(__dirname, 'gcs-key.json');
    const keyData = {
      type: "service_account",
      project_id: projectId,
      private_key_id: "auto-generated",
      private_key: privateKey.replace(/\\n/g, '\n'),
      client_email: clientEmail,
      client_id: "auto-generated",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(clientEmail)}`
    };

    fs.writeFileSync(keyFilePath, JSON.stringify(keyData, null, 2));
    console.log('🔑 Service account key file created\n');

    // Initialize GCS client with the key file
    const storage = new Storage({
      projectId,
      keyFilename: keyFilePath
    });

    const bucket = storage.bucket(bucketName);

    // Check if bucket exists, create if not
    console.log(`📦 Checking bucket: ${bucketName}`);
    const [exists] = await bucket.exists();
    if (!exists) {
      console.log(`📦 Creating bucket: ${bucketName}`);
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD'
      });
      console.log('✅ Bucket created successfully\n');
    } else {
      console.log('✅ Bucket already exists\n');
    }

    // Get all files in the project directory
    console.log('📂 Scanning project files...');
    const projectRoot = path.join(__dirname, '..');
    const files = await getAllFiles(projectRoot);

    console.log(`📊 Found ${files.length} files to upload\n`);

    // Upload files
    let uploaded = 0;
    let failed = 0;

    for (const filePath of files) {
      try {
        const relativePath = path.relative(projectRoot, filePath);
        const destination = relativePath.replace(/\\/g, '/'); // Convert Windows paths to Unix

        console.log(`📤 Uploading: ${relativePath}`);

        await bucket.upload(filePath, {
          destination,
          metadata: {
            contentType: getContentType(filePath),
          },
        });

        uploaded++;
        console.log(`✅ Uploaded: ${relativePath}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${filePath}:`, error.message);
        failed++;
      }
    }

    console.log('\n🎉 Upload completed!');
    console.log(`✅ Successfully uploaded: ${uploaded} files`);
    if (failed > 0) {
      console.log(`❌ Failed to upload: ${failed} files`);
    }
    console.log(`\n📍 Files uploaded to: gs://${bucketName}/`);

    // Clean up temporary key file
    try {
      if (fs.existsSync(keyFilePath)) {
        fs.unlinkSync(keyFilePath);
        console.log('🧹 Temporary key file cleaned up');
      }
    } catch (cleanupError) {
      console.warn('⚠️  Could not clean up temporary key file:', cleanupError.message);
    }

  } catch (error) {
    console.error('❌ Upload failed:', error.message);

    // Clean up on error too
    try {
      const keyFilePath = path.join(__dirname, 'gcs-key.json');
      if (fs.existsSync(keyFilePath)) {
        fs.unlinkSync(keyFilePath);
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    process.exit(1);
  }
}

async function getAllFiles(dirPath, files = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    // Skip certain directories and files
    if (shouldSkip(fullPath)) {
      continue;
    }

    if (stat.isDirectory()) {
      await getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function shouldSkip(filePath) {
  const skipPatterns = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.env',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'GoogleCloudSDKInstaller.exe'
  ];

  const relativePath = path.relative(process.cwd(), filePath);

  return skipPatterns.some(pattern => {
    if (pattern.includes('*')) {
      return relativePath.includes(pattern.replace('*', ''));
    }
    return relativePath.includes(pattern);
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
    '.json': 'application/json',
    '.html': 'text/html',
    '.css': 'text/css',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip'
  };

  return contentTypes[ext] || 'application/octet-stream';
}

// Run the upload
uploadToGCS();