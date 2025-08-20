import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL('/api/auth/signin/credentials', req.url); 
  return NextResponse.redirect(url.toString());
}