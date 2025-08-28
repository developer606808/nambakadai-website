"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export function LoginFormRedux() {
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotVerified, setEmailNotVerified] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handle URL parameters for success/error messages
  useEffect(() => {
    const registered = searchParams.get('registered')
    const verified = searchParams.get('verified')
    const verificationError = searchParams.get('error')

    if (registered === 'true') {
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account before logging in.",
        duration: 6000,
      })
    }

    if (verified === 'true') {
      toast({
        title: "Email verified successfully!",
        description: "You can now log in to your account.",
        duration: 5000,
      })
    }

    if (verificationError === 'verification_failed') {
      toast({
        title: "Email verification failed",
        description: "The verification link is invalid or expired. Please request a new one.",
        variant: "destructive",
        duration: 6000,
      })
    }
  }, [searchParams, toast])

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)
    setEmailNotVerified(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Check if error is due to unverified email
        if (result.error.includes('EMAIL_NOT_VERIFIED')) {
          setEmailNotVerified(data.email)
          setError('Please verify your email address before logging in.')
        } else {
          setError('Invalid email or password')
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        })
        router.push('/') // Redirect to home page
        router.refresh() // Refresh to update session
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!emailNotVerified) return

    setIsResendingVerification(true)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailNotVerified }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox and click the verification link.",
          duration: 6000,
        })
        setEmailNotVerified(null)
        setError(null)
      } else {
        toast({
          title: "Failed to send verification email",
          description: result.error || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResendingVerification(false)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-500">Enter your credentials to access your account</p>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {emailNotVerified && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-2">
              <p>Your email address is not verified. Please check your inbox for a verification email.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                {isResendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Resend verification email
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
