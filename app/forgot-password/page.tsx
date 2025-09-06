"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainLayout } from "@/components/main-layout"
import { Mail, Loader2, ArrowLeft, CheckCircle, Shield, Key } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (email && email.includes("@")) {
        setIsSubmitted(true)
        toast({
          title: "Reset link sent!",
          description: "Please check your email for password reset instructions.",
        })
      } else {
        setError("Please enter a valid email address")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Nature-inspired floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/15 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/10 rounded-full animate-float-fast"></div>
          <div className="absolute top-1/3 right-10 w-28 h-28 bg-green-300/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-emerald-200/15 rounded-full animate-float-medium"></div>

          {/* Leaf patterns */}
          <div className="absolute top-16 left-1/3 text-green-300/30 text-6xl animate-sway">🌿</div>
          <div className="absolute top-32 right-1/4 text-emerald-400/25 text-5xl animate-sway-delayed">🍃</div>
          <div className="absolute bottom-40 left-16 text-teal-300/20 text-7xl animate-sway">🌱</div>
          <div className="absolute bottom-16 right-16 text-green-400/30 text-4xl animate-sway-delayed">🌾</div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-100/5 to-emerald-100/10"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Back to Login Link */}
            <div className="mb-6">
              <Link href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Login</span>
              </Link>
            </div>

            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <Key className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                {isSubmitted ? "Check Your Email" : "Reset Password"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                {isSubmitted
                  ? "We've sent you a password reset link"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4 text-white/20 text-4xl">
                  {isSubmitted ? <CheckCircle className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    {isSubmitted ? "Email Sent!" : "Password Recovery"}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {isSubmitted
                      ? "Check your inbox for the reset link"
                      : "Secure password reset process"
                    }
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                {isSubmitted ? (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Reset Link Sent</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We&apos;ve sent a password reset link to <strong className="text-green-700">{email}</strong>.
                        Please check your email and click the link to create a new password.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Didn&apos;t receive the email?</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Check your spam/junk folder</li>
                          <li>• Make sure the email address is correct</li>
                          <li>• Wait a few minutes for delivery</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                        variant="outline"
                        className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Try Different Email
                      </Button>
                      <Link href="/login" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white">
                          Back to Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                        <Mail className="w-4 h-4 text-green-600" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500">
                        We&apos;ll send a secure reset link to this email
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending Reset Link...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Need help?</span>
                <a href="/contact" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors">
                  Contact Support
                </a>
              </div>
              <div className="text-xs text-gray-400">
                Your account security is our top priority
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}