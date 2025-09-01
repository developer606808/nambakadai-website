import { prisma } from '@/lib/data/prisma'
import { headers } from 'next/headers'

// Device detection utility
export function parseUserAgent(userAgent: string) {
  const deviceInfo = {
    browser: 'Unknown',
    os: 'Unknown',
    device: 'Unknown'
  }

  // Browser detection
  if (userAgent.includes('Chrome')) deviceInfo.browser = 'Chrome'
  else if (userAgent.includes('Firefox')) deviceInfo.browser = 'Firefox'
  else if (userAgent.includes('Safari')) deviceInfo.browser = 'Safari'
  else if (userAgent.includes('Edge')) deviceInfo.browser = 'Edge'
  else if (userAgent.includes('Opera')) deviceInfo.browser = 'Opera'

  // OS detection
  if (userAgent.includes('Windows')) deviceInfo.os = 'Windows'
  else if (userAgent.includes('Mac OS')) deviceInfo.os = 'macOS'
  else if (userAgent.includes('Linux')) deviceInfo.os = 'Linux'
  else if (userAgent.includes('Android')) deviceInfo.os = 'Android'
  else if (userAgent.includes('iOS')) deviceInfo.os = 'iOS'

  // Device detection
  if (userAgent.includes('Mobile')) deviceInfo.device = 'Mobile'
  else if (userAgent.includes('Tablet')) deviceInfo.device = 'Tablet'
  else deviceInfo.device = 'Desktop'

  return `${deviceInfo.device} - ${deviceInfo.os} - ${deviceInfo.browser}`
}

// Get client IP address
export function getClientIP(request: Request): string {
  const headersList = headers()
  
  // Check various headers for the real IP
  const xForwardedFor = headersList.get('x-forwarded-for')
  const xRealIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip')
  
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return xForwardedFor.split(',')[0].trim()
  }
  
  if (xRealIP) return xRealIP
  if (cfConnectingIP) return cfConnectingIP
  
  // Fallback to connection remote address
  return '127.0.0.1' // localhost fallback
}

// Get approximate location from IP (you can integrate with a geolocation service)
export async function getLocationFromIP(ip: string): Promise<string> {
  try {
    // For localhost/development
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return 'Local Development'
    }

    // You can integrate with services like:
    // - ipapi.co
    // - ipgeolocation.io
    // - MaxMind GeoIP
    // For now, returning a placeholder
    
    // Example with ipapi.co (free tier)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000
    })
    
    if (response.ok) {
      const data = await response.json()
      return `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country_name || 'Unknown'}`
    }
    
    return 'Unknown Location'
  } catch (error) {
    console.error('Error getting location from IP:', error)
    return 'Unknown Location'
  }
}

// Log successful login
export async function logSuccessfulLogin(
  userId: number,
  request: Request,
  deviceToken?: string
) {
  try {
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = getClientIP(request)
    const deviceInfo = parseUserAgent(userAgent)
    const location = await getLocationFromIP(ipAddress)

    const loginLog = await prisma.loginLog.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        deviceInfo,
        location,
        success: true,
        deviceToken,
        loginAt: new Date()
      }
    })

    // Update user's last login time and device token
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        deviceToken: deviceToken || undefined
      }
    })

    console.log(`Successful login logged for user ${userId} from ${ipAddress}`)
    return loginLog
  } catch (error) {
    console.error('Error logging successful login:', error)
    // Don't throw error to avoid breaking login flow
    return null
  }
}

// Log failed login attempt
export async function logFailedLogin(
  email: string,
  request: Request,
  failureReason: string
) {
  try {
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = getClientIP(request)
    const deviceInfo = parseUserAgent(userAgent)
    const location = await getLocationFromIP(ipAddress)

    // Try to find user by email to get userId
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    const loginLog = await prisma.loginLog.create({
      data: {
        userId: user?.id || 0, // 0 for non-existent users
        ipAddress,
        userAgent,
        deviceInfo,
        location,
        success: false,
        failureReason,
        loginAt: new Date()
      }
    })

    console.log(`Failed login logged for ${email} from ${ipAddress}: ${failureReason}`)
    return loginLog
  } catch (error) {
    console.error('Error logging failed login:', error)
    return null
  }
}

// Get recent login attempts for a user
export async function getRecentLoginAttempts(userId: number, limit: number = 10) {
  try {
    return await prisma.loginLog.findMany({
      where: { userId },
      orderBy: { loginAt: 'desc' },
      take: limit,
      select: {
        id: true,
        ipAddress: true,
        deviceInfo: true,
        location: true,
        success: true,
        failureReason: true,
        loginAt: true
      }
    })
  } catch (error) {
    console.error('Error getting recent login attempts:', error)
    return []
  }
}

// Check for suspicious login activity
export async function checkSuspiciousActivity(userId: number): Promise<{
  isSuspicious: boolean
  reasons: string[]
}> {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get recent login attempts
    const recentAttempts = await prisma.loginLog.findMany({
      where: {
        userId,
        loginAt: { gte: oneDayAgo }
      },
      orderBy: { loginAt: 'desc' }
    })

    const reasons: string[] = []
    let isSuspicious = false

    // Check for too many failed attempts in the last hour
    const failedAttemptsLastHour = recentAttempts.filter(
      attempt => !attempt.success && attempt.loginAt >= oneHourAgo
    ).length

    if (failedAttemptsLastHour >= 5) {
      isSuspicious = true
      reasons.push('Too many failed login attempts in the last hour')
    }

    // Check for logins from multiple locations
    const uniqueLocations = new Set(
      recentAttempts
        .filter(attempt => attempt.success)
        .map(attempt => attempt.location)
    )

    if (uniqueLocations.size >= 3) {
      isSuspicious = true
      reasons.push('Logins from multiple locations detected')
    }

    // Check for unusual device patterns
    const uniqueDevices = new Set(
      recentAttempts
        .filter(attempt => attempt.success)
        .map(attempt => attempt.deviceInfo)
    )

    if (uniqueDevices.size >= 4) {
      isSuspicious = true
      reasons.push('Logins from multiple devices detected')
    }

    return { isSuspicious, reasons }
  } catch (error) {
    console.error('Error checking suspicious activity:', error)
    return { isSuspicious: false, reasons: [] }
  }
}

// Clean old login logs (run this periodically)
export async function cleanOldLoginLogs(daysToKeep: number = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await prisma.loginLog.deleteMany({
      where: {
        loginAt: { lt: cutoffDate }
      }
    })

    console.log(`Cleaned ${result.count} old login logs`)
    return result.count
  } catch (error) {
    console.error('Error cleaning old login logs:', error)
    return 0
  }
}

// Get login statistics for admin dashboard
export async function getLoginStatistics(days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [totalLogins, successfulLogins, failedLogins, uniqueUsers] = await Promise.all([
      prisma.loginLog.count({
        where: { loginAt: { gte: startDate } }
      }),
      prisma.loginLog.count({
        where: { 
          loginAt: { gte: startDate },
          success: true
        }
      }),
      prisma.loginLog.count({
        where: { 
          loginAt: { gte: startDate },
          success: false
        }
      }),
      prisma.loginLog.findMany({
        where: { 
          loginAt: { gte: startDate },
          success: true
        },
        select: { userId: true },
        distinct: ['userId']
      })
    ])

    return {
      totalLogins,
      successfulLogins,
      failedLogins,
      uniqueUsers: uniqueUsers.length,
      successRate: totalLogins > 0 ? (successfulLogins / totalLogins) * 100 : 0
    }
  } catch (error) {
    console.error('Error getting login statistics:', error)
    return {
      totalLogins: 0,
      successfulLogins: 0,
      failedLogins: 0,
      uniqueUsers: 0,
      successRate: 0
    }
  }
}
