import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Product validation schemas
export const productSchema = z.object({
  title: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),

  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),

  categoryId: z.number().int('Category ID must be an integer')
    .min(1, 'Please select a category'),

  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(100000, 'Price must be less than ₹1,00,000'),

  stock: z.number()
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock must be less than 10,000'),

  unitId: z.number().int('Unit ID must be an integer')
    .min(1, 'Please select a unit'),

  images: z.array(z.string())
    .min(1, 'At least one product image is required')
    .max(5, 'Maximum 5 images allowed'),

  isOrganic: z.boolean().optional(),
  origin: z.string().optional(),
});

// Vehicle validation schema
export const vehicleSchema = z.object({
  name: z.string()
    .min(2, 'Vehicle name must be at least 2 characters')
    .max(100, 'Vehicle name must be less than 100 characters'),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),

  type: z.enum(['truck', 'car', 'van', 'bike', 'bus', 'auto']),

  category: z.string()
    .min(1, 'Category is required'),

  pricePerDay: z.number()
    .min(1, 'Daily price must be greater than 0')
    .max(50000, 'Daily price must be less than ₹50,000'),

  pricePerHour: z.number()
    .min(1, 'Hourly price must be greater than 0')
    .max(5000, 'Hourly price must be less than ₹5,000'),

  capacity: z.string()
    .min(1, 'Capacity is required'),

  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid']),

  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),

  features: z.array(z.string())
    .min(1, 'At least one feature is required'),

  images: z.array(z.string())
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed')
});

// Store validation schemas (for frontend with terms)
export const storeFormSchema = z.object({
  name: z.string()
    .min(2, 'Store name must be at least 2 characters')
    .max(100, 'Store name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&'.,()]+$/, 'Store name contains invalid characters'),

  contactName: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(50, 'Contact name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Contact name can only contain letters, spaces, hyphens, and apostrophes'),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters')
    .optional(),

  stateId: z.number()
    .int('State ID must be an integer')
    .min(1, 'Please select a state'),

  cityId: z.number()
    .int('City ID must be an integer')
    .min(1, 'Please select a city'),

  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits and cannot start with 0')
    .optional(),

  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true

      // Remove all non-digit characters except + at the beginning
      const cleaned = phone.replace(/[^\d+]/g, '')
      const digits = cleaned.replace(/^\+/, '')

      // Indian phone number validation
      if (digits.length === 10) {
        return /^[6-9]\d{9}$/.test(digits)
      } else if (digits.length === 12 && digits.startsWith('91')) {
        const mobile = digits.slice(2)
        return /^[6-9]\d{9}$/.test(mobile)
      } else if (digits.length === 11) {
        return /^91[6-9]\d{9}$/.test(digits) || /^[1-9]\d{2,3}\d{6,8}$/.test(digits)
      }

      return false
    }, 'Please enter a valid Indian phone number'),

  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  logo: z.string().optional(),
  banner: z.string().optional(),

  acceptTerms: z.boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions to create a store')
});

// Store validation schema (for backend API - without acceptTerms)
export const storeSchema = storeFormSchema.omit({ acceptTerms: true });

// Report validation schemas
export const reportSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().optional(),
  productId: z.string().optional(),
  userId: z.string().optional()
}).refine((data) => data.productId || data.userId, {
  message: "Either product or user must be reported",
  path: ["productId"]
});