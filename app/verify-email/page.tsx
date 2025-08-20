"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/main-layout';
import { CheckCircle, XCircle, Info, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setVerificationStatus('error');
      setMessage('No verification token found.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${tokenFromUrl}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified! You can now log in.');
        } else {
          setVerificationStatus('error');
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (err) {
        setVerificationStatus('error');
        setMessage('An unexpected error occurred during verification.');
        console.error('Verification fetch error:', err);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!token) {
      setResendMessage('Cannot resend: No token available.');
      return;
    }

    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the token
      });

      const data = await response.json();

      // Always display as an error message, regardless of response.ok
      setResendMessage(data.message || 'Failed to resend verification email.');
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendMessage('An unexpected error occurred while resending email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-lg text-center">
          <div>
            {verificationStatus === 'loading' && (
              <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
            )}
            {verificationStatus === 'idle' && (
              <Info className="mx-auto h-16 w-16 text-gray-500" />
            )}
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>
          <div className="mt-8">
            {verificationStatus === 'error' && token && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">If your link has expired or is invalid, you can request a new one:</p>
                <Button onClick={handleResendVerification} disabled={isResending} className="w-full">
                  {isResending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                {resendMessage && (
                  <p className="text-sm mt-2" style={{ color: 'red' }}> {/* Always red now */}
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 mt-4 block">
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}