import fs from 'fs';
import path from 'path';

export interface EmailTemplateData {
  logoUrl: string;
  userName: string;
  verificationCode?: string;
  verificationUrl?: string;
  storeName?: string;
  storeId?: string;
  creationDate?: string;
  storeDashboardUrl?: string;
  currentYear: number;
}

/**
 * Get the base URL for the application
 */
export function getBaseUrl(): string {
  // In production, this should be set via environment variable
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

/**
 * Get the logo URL for emails
 */
export function getLogoUrl(): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/logo.png`;
}

/**
 * Load email template and replace placeholders
 */
export function loadEmailTemplate(templateName: string, data: EmailTemplateData): string {
  try {
    const templatePath = path.join(process.cwd(), 'emails', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace all placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return template;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}

/**
 * Generate verification email HTML
 */
export function generateVerificationEmail(userName: string, verificationCode: string, verificationUrl: string): string {
  return loadEmailTemplate('verification-email', {
    logoUrl: getLogoUrl(),
    userName,
    verificationCode,
    verificationUrl,
    currentYear: new Date().getFullYear()
  });
}

/**
 * Generate store creation success email HTML
 */
export function generateStoreCreationEmail(
  userName: string,
  storeName: string,
  storeId: string,
  storeDashboardUrl: string
): string {
  return loadEmailTemplate('store-creation-success', {
    logoUrl: getLogoUrl(),
    userName,
    storeName,
    storeId,
    creationDate: new Date().toLocaleDateString(),
    storeDashboardUrl,
    currentYear: new Date().getFullYear()
  });
}

/**
 * Example usage:
 *
 * // For verification email
 * const verificationHtml = generateVerificationEmail(
 *   'John Doe',
 *   '123456',
 *   'http://localhost:3000/verify?code=123456'
 * );
 *
 * // For store creation email
 * const storeHtml = generateStoreCreationEmail(
 *   'John Doe',
 *   'John\'s Farm Store',
 *   'STORE_123',
 *   'http://localhost:3000/store/dashboard'
 * );
 */