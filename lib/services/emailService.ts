import crypto from 'crypto'

// Email transporter configuration - only create if nodemailer is available and configured
let transporter: any = null

async function getTransporter() {
  if (transporter) return transporter

  // Check if email is configured
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_USER) {
    console.log('Email not configured - skipping email functionality')
    return null
  }

  try {
    // Dynamic import to avoid errors if nodemailer is not installed
    const nodemailer = await import('nodemailer')

    transporter = nodemailer.default.createTransport({
      host: process.env.EMAIL_SERVER,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    return transporter
  } catch (error) {
    console.error('Nodemailer not available:', error)
    return null
  }
}

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    const emailTransporter = await getTransporter()
    if (!emailTransporter) {
      console.log('Email not configured')
      return false
    }

    await emailTransporter.verify()
    console.log('Email server is ready to send messages')
    return true
  } catch (error) {
    console.error('Email server configuration error:', error)
    return false
  }
}

// Generate verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Generate verification URL
export function generateVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/verify-email?token=${token}`
}

// Email templates
export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Nambakadai',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 Welcome to Nambakadai!</h1>
            <p>Your local farm marketplace</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for joining Nambakadai! To complete your registration and start connecting with local farmers, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with Nambakadai, please ignore this email.
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>🛒 Browse and purchase fresh produce from local farmers</li>
              <li>🏪 Create your own store and start selling</li>
              <li>💬 Connect with the farming community</li>
              <li>📱 Receive important updates and notifications</li>
            </ul>
            
            <p>Welcome to the future of local farming!</p>
            <p>Best regards,<br>The Nambakadai Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Nambakadai. All rights reserved.</p>
            <p>If you have any questions, contact us at support@nambakadai.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name}!
      
      Welcome to Nambakadai! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Nambakadai, please ignore this email.
      
      Best regards,
      The Nambakadai Team
    `
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Nambakadai',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Nambakadai Account Security</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We received a request to reset your password for your Nambakadai account.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>For your security, please:</p>
            <ul>
              <li>Choose a strong, unique password</li>
              <li>Don't share your password with anyone</li>
              <li>Log out from shared devices</li>
            </ul>
            
            <p>Best regards,<br>The Nambakadai Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Nambakadai. All rights reserved.</p>
            <p>If you have any questions, contact us at support@nambakadai.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name}!
      
      We received a request to reset your password for your Nambakadai account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The Nambakadai Team
    `
  })
}

// Send verification email
export async function sendVerificationEmail(email: string, name: string, token: string) {
  try {
    const emailTransporter = await getTransporter()

    // If email is not configured, log and return success (for development)
    if (!emailTransporter) {
      console.log(`Email not configured - would send verification email to ${email}`)
      console.log(`Verification URL: ${generateVerificationUrl(token)}`)
      return { success: true, messageId: 'email-not-configured' }
    }

    const verificationUrl = generateVerificationUrl(token)
    const template = emailTemplates.verification(name, verificationUrl)

    const info = await emailTransporter.sendMail({
      from: `"${process.env.EMAIL_FROM || 'Nambakadai'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    })

    console.log('Verification email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  try {
    const emailTransporter = await getTransporter()

    // If email is not configured, log and return success (for development)
    if (!emailTransporter) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
      console.log(`Email not configured - would send password reset email to ${email}`)
      console.log(`Reset URL: ${resetUrl}`)
      return { success: true, messageId: 'email-not-configured' }
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
    const template = emailTemplates.passwordReset(name, resetUrl)

    const info = await emailTransporter.sendMail({
      from: `"${process.env.EMAIL_FROM || 'Nambakadai'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    })

    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
