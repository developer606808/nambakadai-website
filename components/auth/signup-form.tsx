"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Upload, Loader2, CheckCircle, XCircle, AlertCircle, User, Mail, Phone, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { signupSchema, getPasswordStrength, validateIndianPhone, type SignupInput } from "@/lib/validations/auth"

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] })
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    setError,
    clearErrors
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      acceptTerms: false
    }
  })

  const watchedPassword = watch('password', '')
  const watchedEmail = watch('email', '')

  // Update password strength when password changes
  React.useEffect(() => {
    if (watchedPassword) {
      const strength = getPasswordStrength(watchedPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [watchedPassword])

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)
    clearErrors()

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (result.details) {
          result.details.forEach((error: { field: string; message: string }) => {
            setError(error.field as keyof SignupInput, {
              type: 'server',
              message: error.message
            })
          })
        }
        throw new Error(result.error || 'Registration failed')
      }

      toast({
        title: "Account created successfully!",
        description: result.emailSent
          ? "Please check your email to verify your account before logging in."
          : "You can now log in with your credentials.",
        duration: 6000,
      })

      router.push('/login?registered=true')
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('field'))) {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg border shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-500 mt-2">Join Nanbakadai Farm Marketplace</p>
      </div>

      {/* Profile Image Upload */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <div
            className={`w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 ${
              !profileImage ? "bg-gray-100 flex items-center justify-center" : ""
            }`}
          >
            {profileImage ? (
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload profile image</span>
          </label>
          <input type="file" id="profile-image" className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <p className="text-sm text-gray-500">Add profile picture (optional)</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210 or +91 98765 43210"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.phone.message}
            </p>
          )}
          {!errors.phone && (
            <p className="text-xs text-gray-500">
              Enter Indian mobile number (10 digits starting with 6-9) or with +91 country code
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register('password')}
              className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {watchedPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Password strength:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.score <= 2 ? 'text-red-600' :
                  passwordStrength.score <= 4 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {passwordStrength.score <= 2 ? 'Weak' :
                   passwordStrength.score <= 4 ? 'Medium' : 'Strong'}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs text-gray-600 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {feedback}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>



        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="acceptTerms"
              checked={watch('acceptTerms')}
              onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
              className={errors.acceptTerms ? 'border-red-500' : ''}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-5 cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            <p>Form Valid: {isValid ? 'Yes' : 'No'}</p>
            <p>Errors: {Object.keys(errors).length > 0 ? Object.keys(errors).join(', ') : 'None'}</p>
            <p>Accept Terms: {watch('acceptTerms') ? 'Yes' : 'No'}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
