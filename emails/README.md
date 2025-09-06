# Email Templates

This directory contains HTML email templates for Nambakadai application.

## Templates

### 1. Verification Email (`verification-email.html`)
Used for email verification during user registration.

**Placeholders:**
- `{{logoUrl}}` - Nambakadai logo URL
- `{{userName}}` - User's full name
- `{{verificationCode}}` - 6-digit verification code
- `{{verificationUrl}}` - Complete verification URL
- `{{currentYear}}` - Current year for copyright

### 2. Store Creation Success (`store-creation-success.html`)
Sent when a user successfully creates a store.

**Placeholders:**
- `{{logoUrl}}` - Nambakadai logo URL
- `{{userName}}` - Store owner's name
- `{{storeName}}` - Name of the created store
- `{{storeId}}` - Unique store identifier
- `{{creationDate}}` - Date when store was created
- `{{storeDashboardUrl}}` - URL to store dashboard
- `{{currentYear}}` - Current year for copyright

## Usage

Use the utility functions in `lib/email-utils.ts`:

```typescript
import { generateVerificationEmail, generateStoreCreationEmail } from '@/lib/email-utils';

// Generate verification email
const verificationHtml = generateVerificationEmail(
  'John Doe',
  '123456',
  'https://nambakadai.com/verify?code=123456'
);

// Generate store creation email
const storeHtml = generateStoreCreationEmail(
  'John Doe',
  'John\'s Farm Store',
  'STORE_123',
  'https://nambakadai.com/store/dashboard'
);
```

## Features

- ✅ **Responsive Design** - Works on all email clients and devices
- ✅ **Logo Integration** - Nambakadai logo prominently displayed
- ✅ **Professional Styling** - Clean, modern design
- ✅ **Accessibility** - Proper alt text and semantic HTML
- ✅ **Template Variables** - Easy customization with placeholders
- ✅ **Brand Consistency** - Matches Nambakadai branding

## Email Client Compatibility

- ✅ Gmail
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Mobile email clients

## Customization

To modify the templates:
1. Edit the HTML files in this directory
2. Update the utility functions in `lib/email-utils.ts` if needed
3. Test in different email clients

## Logo

The logo is automatically loaded from `/public/logo.png` and embedded in all email templates.