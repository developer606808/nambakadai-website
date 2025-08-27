import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting
// In production, you would use a real Redis instance
const redis = Redis.fromEnv();

// Create a rate limiter for sensitive routes
const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes
  analytics: true,
});

// Create a rate limiter for general API routes
const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

// Create a rate limiter for report endpoints (extra strict)
const reportRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 reports per hour
  analytics: true,
});

// Rate limiting middleware
export async function rateLimitMiddleware(
  request: NextRequest,
  options: {
    limit?: 'auth' | 'api' | 'report';
    identifier?: string;
  } = {}
) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  const identifier = options.identifier || request.ip || 'anonymous';
  let ratelimit: Ratelimit;

  switch (options.limit) {
    case 'auth':
      ratelimit = authRateLimiter;
      break;
    case 'report':
      ratelimit = reportRateLimiter;
      break;
    default:
      ratelimit = apiRateLimiter;
  }

  const { success } = await ratelimit.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}