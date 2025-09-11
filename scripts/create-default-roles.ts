import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultRoles() {
  console.log('🌱 Creating default admin roles...');

  try {
    // Create default roles
    const roles = await Promise.all([
      prisma.adminRole.upsert({
        where: { name: 'Super Admin' },
        update: {},
        create: {
          name: 'Super Admin',
          description: 'Full access to all system features and settings',
          permissions: [
            'dashboard',
            'users',
            'products',
            'stores',
            'rentals',
            'categories',
            'units',
            'banners',
            'states',
            'cities',
            'roles',
            'settings',
            'reports',
            'analytics',
            'notifications',
            'messages',
            'payments'
          ],
          isSystem: true,
        },
      }),
      prisma.adminRole.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
          name: 'Admin',
          description: 'Access to most features except system settings',
          permissions: [
            'dashboard',
            'users',
            'products',
            'stores',
            'rentals',
            'categories',
            'units',
            'banners',
            'states',
            'cities',
            'reports',
            'analytics',
            'notifications',
            'messages',
            'payments'
          ],
          isSystem: true,
        },
      }),
      prisma.adminRole.upsert({
        where: { name: 'Content Manager' },
        update: {},
        create: {
          name: 'Content Manager',
          description: 'Manage products, stores, categories, and banners',
          permissions: [
            'dashboard',
            'products',
            'stores',
            'categories',
            'units',
            'banners',
            'reports'
          ],
          isSystem: false,
        },
      }),
      prisma.adminRole.upsert({
        where: { name: 'Customer Support' },
        update: {},
        create: {
          name: 'Customer Support',
          description: 'Handle user inquiries and basic content management',
          permissions: [
            'dashboard',
            'users',
            'messages',
            'notifications',
            'reports'
          ],
          isSystem: false,
        },
      }),
      prisma.adminRole.upsert({
        where: { name: 'Analytics Manager' },
        update: {},
        create: {
          name: 'Analytics Manager',
          description: 'Access to analytics and reporting features',
          permissions: [
            'dashboard',
            'reports',
            'analytics',
            'payments'
          ],
          isSystem: false,
        },
      }),
    ]);

    console.log(`✅ Created ${roles.length} default roles`);
    console.log('Roles created:', roles.map((r: { name: string }) => r.name));

  } catch (error) {
    console.error('❌ Error creating default roles:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultRoles();