import { z } from 'zod'

// List of disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
  'maildrop.cc',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'emailondeck.com',
  'fakeinbox.com',
  'hide.biz.st',
  'mytrashmail.com',
  'nobulk.com',
  'sogetthis.com',
  'spamherald.com',
  'spamhole.com',
  'speed.1s.fr',
  'temporary-mail.net',
  'trashmail.at',
  'wegwerfmail.de',
  'zehnminutenmail.de'
]

// Common spam patterns - more specific to avoid blocking legitimate emails
const SPAM_PATTERNS = [
  /^test\d*@/i,     // test emails like test@, test1@, test123@
  /^admin\d*@/i,    // admin emails like admin@, admin1@
  /^noreply\d*@/i,  // noreply emails
  /^no-reply\d*@/i, // no-reply emails
  /^support\d*@/i,  // support emails (often fake)
  /^info\d*@/i,     // info emails (often fake)
  /^contact\d*@/i,  // contact emails (often fake)
  /^\d{5,}@/,       // Starting with 5+ consecutive numbers
  /^[a-z]{1,2}\d{4,}@/i, // Very short letters followed by many numbers (like a1234@)
]

// Strong password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Email validation with spam detection
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must be less than 254 characters')
  .toLowerCase()
  .refine((email) => {
    const domain = email.split('@')[1]
    return !DISPOSABLE_EMAIL_DOMAINS.includes(domain)
  }, 'Disposable email addresses are not allowed')
  .refine((email) => {
    return !SPAM_PATTERNS.some(pattern => pattern.test(email))
  }, 'This email format is not allowed')
  .refine((email) => {
    // Check for suspicious patterns
    const localPart = email.split('@')[0]
    // Too many numbers (more than 80% of the local part)
    if ((localPart.match(/\d/g) || []).length > localPart.length * 0.8) {
      return false
    }
    // Too many consecutive numbers (6 or more)
    if (/\d{6,}/.test(localPart)) {
      return false
    }
    // Check for obviously fake patterns
    if (/^(user|email|mail|account)\d+$/i.test(localPart)) {
      return false
    }
    return true
  }, 'Email format appears suspicious')

// Phone number validation - Indian numbers only
const phoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone || phone.trim() === '') return true

    // Remove all non-digit characters except + at the beginning
    const cleaned = phone.replace(/[^\d+]/g, '')

    // Remove + if present and get just the digits
    const digits = cleaned.replace(/^\+/, '')

    // Indian phone number validation
    // Format: +91XXXXXXXXXX or 91XXXXXXXXXX or XXXXXXXXXX
    // Must be 10 digits (mobile) or 11 digits (with STD code) or 12 digits (with country code)

    if (digits.length === 10) {
      // 10 digit mobile number (without country code)
      // Must start with 6, 7, 8, or 9
      return /^[6-9]\d{9}$/.test(digits)
    } else if (digits.length === 12) {
      // 12 digit number with country code +91
      // Must start with 91 followed by valid mobile number
      return /^91[6-9]\d{9}$/.test(digits)
    } else if (digits.length === 11) {
      // 11 digit number (landline with STD code)
      // STD codes are 2-4 digits, followed by 6-8 digit number
      return /^[1-9]\d{2,3}\d{6,8}$/.test(digits) || /^91[6-9]\d{9}$/.test(digits)
    }

    return false
  }, 'Please enter a valid Indian phone number (10 digits starting with 6-9, or with +91 country code)')

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .refine((name) => {
    // Check for suspicious patterns
    const words = name.trim().split(/\s+/)
    return words.every(word => word.length > 0 && word.length < 20)
  }, 'Name format is invalid')

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  deviceToken: z.string().optional(),
  rememberMe: z.boolean().optional()
})

// Signup schema
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  deviceToken: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
})

// Resend verification schema
export const resendVerificationSchema = z.object({
  email: emailSchema
})

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema
})

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>

// Utility function to check if email is suspicious
export function isEmailSuspicious(email: string): boolean {
  const domain = email.split('@')[1]

  // Check disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return true
  }

  // Check spam patterns
  if (SPAM_PATTERNS.some(pattern => pattern.test(email))) {
    return true
  }

  return false
}

// Utility function to validate and format Indian phone numbers
export function validateIndianPhone(phone: string): {
  isValid: boolean
  formatted?: string
  error?: string
} {
  if (!phone || phone.trim() === '') {
    return { isValid: true } // Optional field
  }

  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '')
  const digits = cleaned.replace(/^\+/, '')

  if (digits.length === 10) {
    // 10 digit mobile number
    if (/^[6-9]\d{9}$/.test(digits)) {
      return {
        isValid: true,
        formatted: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
      }
    } else {
      return {
        isValid: false,
        error: 'Mobile number must start with 6, 7, 8, or 9'
      }
    }
  } else if (digits.length === 12 && digits.startsWith('91')) {
    // 12 digit with country code
    const mobileNumber = digits.slice(2)
    if (/^[6-9]\d{9}$/.test(mobileNumber)) {
      return {
        isValid: true,
        formatted: `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`
      }
    } else {
      return {
        isValid: false,
        error: 'Invalid mobile number after country code'
      }
    }
  } else if (digits.length === 11) {
    // Could be landline or mobile with country code
    if (/^91[6-9]\d{9}$/.test(digits)) {
      const mobileNumber = digits.slice(2)
      return {
        isValid: true,
        formatted: `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`
      }
    } else if (/^[1-9]\d{2,3}\d{6,8}$/.test(digits)) {
      // Landline number
      return {
        isValid: true,
        formatted: `+91 ${digits}`
      }
    } else {
      return {
        isValid: false,
        error: 'Invalid phone number format'
      }
    }
  } else {
    return {
      isValid: false,
      error: 'Phone number must be 10 digits (mobile) or include +91 country code'
    }
  }
}

// Utility function to validate password strength
export function getPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Add numbers')
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters')
  
  if (password.length >= 12) score += 1
  
  return { score, feedback }
}
