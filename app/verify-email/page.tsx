"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setVerificationStatus('error')
      setMessage('No verification token provided')
      setIsVerifying(false)
      return
    }

    verifyEmail(token)
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const result = await response.json()

      if (response.ok) {
        setVerificationStatus('success')
        setMessage(result.message || 'Email verified successfully!')
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 3000)
      } else {
        setVerificationStatus('error')
        setMessage(result.error || 'Email verification failed')
      }
    } catch (error) {
      setVerificationStatus('error')
      setMessage('An error occurred during verification')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              {verificationStatus === 'loading' && <Loader2 className="w-6 h-6 text-green-600 animate-spin" />}
              {verificationStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {verificationStatus === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
            </div>
            <CardTitle className="text-2xl">
              {verificationStatus === 'loading' && 'Verifying Email...'}
              {verificationStatus === 'success' && 'Email Verified!'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {verificationStatus === 'loading' && 'Please wait while we verify your email address.'}
              {verificationStatus === 'success' && 'Your email has been successfully verified.'}
              {verificationStatus === 'error' && 'There was a problem verifying your email.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={verificationStatus === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  You will be redirected to the login page in a few seconds...
                </div>
                <Link href="/login?verified=true">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    The verification link may be expired or invalid.
                  </p>
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Create New Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'loading' && (
              <div className="text-center">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-green-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
