export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(options: EmailOptions): Promise<void> {
  // In a real implementation, you would use a service like Nodemailer or SendGrid
  // For now, we'll just log the email
  
  console.log('Sending email:', {
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  });
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Verify your email address</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
    text: `Verify your email address by clicking this link: ${verificationUrl}`
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
    text: `Reset your password by clicking this link: ${resetUrl}`
  });
}