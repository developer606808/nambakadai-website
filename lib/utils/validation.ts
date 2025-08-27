import { ZodError } from 'zod';
import { ApiResponse, createApiError } from '@/lib/utils/api';

export function handleZodError(error: ZodError): ApiResponse<null> {
  return {
    success: false,
    error: 'Validation failed',
    message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  };
}

export function handleZodErrorResponse(error: ZodError) {
  return createApiError(
    `Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
  );
}