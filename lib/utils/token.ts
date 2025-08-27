import crypto from 'crypto';

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateVerificationToken(): string {
  return generateToken(32);
}

export function generatePasswordResetToken(): string {
  return generateToken(32);
}

export function generateCSRFToken(): string {
  return generateToken(32);
}