import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';
import connectMongo from '@/lib/data/connectMongo';

export async function GET() {
  try {
    // Check PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check MongoDB connection
    await connectMongo();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        postgresql: 'connected',
        mongodb: 'connected',
        nextjs: 'running'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        postgresql: 'disconnected',
        mongodb: 'disconnected',
        nextjs: 'running'
      }
    }, { status: 503 });
  }
}