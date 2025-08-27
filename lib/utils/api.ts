import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function createApiResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  });
}

export function createApiError(
  error: string,
  status: number = 500
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error
    },
    { status }
  );
}

export function createApiSuccess(
  message: string,
  status: number = 200
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: true,
      message
    },
    { status }
  );
}