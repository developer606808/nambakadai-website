#!/usr/bin/env node

// Database connection test script
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');

async function testPostgreSQL() {
  console.log('Testing PostgreSQL connection...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL connection successful');
    
    // Test basic query
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ PostgreSQL query successful');
    
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testMongoDB() {
  console.log('Testing MongoDB connection...');
  
  try {
    // Test connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nambakadai');
    console.log('✅ MongoDB connection successful');
    
    // Test basic operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ MongoDB operation successful');
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

async function testDatabases() {
  console.log('🚀 Testing database connections...\n');
  
  // Load environment variables
  require('dotenv').config({ path: '.env' });
  
  const postgresSuccess = await testPostgreSQL();
  const mongoSuccess = await testMongoDB();
  
  console.log('\n📊 Test Results:');
  console.log(`PostgreSQL: ${postgresSuccess ? '✅' : '❌'}`);
  console.log(`MongoDB: ${mongoSuccess ? '✅' : '❌'}`);
  
  if (postgresSuccess && mongoSuccess) {
    console.log('\n🎉 All database connections are working!');
    console.log('\nNext steps:');
    console.log('1. Run migrations: pnpm migrate');
    console.log('2. Seed database: pnpm seed');
    console.log('3. Start development: pnpm dev');
  } else {
    console.log('\n⚠️  Some database connections failed.');
    console.log('Please check your database configuration in the .env file.');
  }
}

if (require.main === module) {
  testDatabases();
}

module.exports = { testPostgreSQL, testMongoDB, testDatabases };