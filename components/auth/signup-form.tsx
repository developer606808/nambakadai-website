"use client"

<<<<<<< Updated upstream
import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Upload } from "lucide-react"
=======
import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Upload, Loader2, CheckCircle, XCircle, AlertCircle, User, Mail, Phone, Lock, X as XIcon } from "lucide-react"
>>>>>>> Stashed changes
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
<<<<<<< Updated upstream
=======
import { signupSchema, getPasswordStrength, validateIndianPhone, type SignupInput } from "@/lib/validations/auth"
import Cropper from 'react-easy-crop'
>>>>>>> Stashed changes

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
<<<<<<< Updated upstream
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
=======
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] })
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: null as string | null
  })
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Character count states
  const [charCounts, setCharCounts] = useState({
    name: 0,
    email: 0,
    phone: 0,
    password: 0,
    confirmPassword: 0
  })

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

  const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<File> => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = pixelCrop.width
          canvas.height = pixelCrop.height
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          )
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `profile-cropped.jpg`, { type: 'image/jpeg' })
              resolve(file)
            }
          }, 'image/jpeg')
        }
      }
    })
  }

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onSubmit = async (data: SignupInput) => {
>>>>>>> Stashed changes
    setIsLoading(true)

<<<<<<< Updated upstream
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
=======
    try {
      // Create FormData to include the profile image if it exists
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      formData.append('acceptTerms', data.acceptTerms.toString())
      if (data.phone) formData.append('phone', data.phone)
      if (data.deviceToken) formData.append('deviceToken', data.deviceToken)
      if (profileImageFile) formData.append('profileImage', profileImageFile)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      })
>>>>>>> Stashed changes

    toast({
      title: "Account created!",
      description: "You have successfully signed up.",
    })

    setIsLoading(false)
    router.push("/login")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setCropperState({
          isOpen: true,
          imageSrc: event.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async () => {
    if (croppedAreaPixels && cropperState.imageSrc) {
      const croppedFile = await getCroppedImg(cropperState.imageSrc, croppedAreaPixels)
      const croppedUrl = URL.createObjectURL(croppedFile)
      setProfileImage(croppedUrl)
      setProfileImageFile(croppedFile)
    }
    setCropperState({ isOpen: false, imageSrc: null })
    setCroppedAreaPixels(null)
  }

  const handleCropCancel = () => {
    setCropperState({ isOpen: false, imageSrc: null })
    setCroppedAreaPixels(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle character count updates
  const updateCharCount = (field: keyof typeof charCounts, value: string) => {
    setCharCounts(prev => ({
      ...prev,
      [field]: value.length
    }));
  };

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
          <input
            ref={fileInputRef}
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-sm text-gray-500">Add profile picture (optional)</p>
      </div>

<<<<<<< Updated upstream
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
=======
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="John Doe"
              maxLength={50}
              {...register('name', {
                onChange: (e) => updateCharCount('name', e.target.value)
              })}
              className={`pr-16 ${errors.name ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {charCounts.name}/50
            </div>
          </div>
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
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              maxLength={254}
              {...register('email', {
                onChange: (e) => updateCharCount('email', e.target.value)
              })}
              className={`pr-20 ${errors.email ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {charCounts.email}/254
            </div>
          </div>
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
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210 or +91 98765 43210"
              maxLength={15}
              {...register('phone', {
                onChange: (e) => updateCharCount('phone', e.target.value)
              })}
              className={`pr-16 ${errors.phone ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {charCounts.phone}/15
            </div>
          </div>
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
>>>>>>> Stashed changes
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
<<<<<<< Updated upstream
              required
              className="pr-10"
=======
              maxLength={128}
              {...register('password', {
                onChange: (e) => updateCharCount('password', e.target.value)
              })}
              className={`pr-20 ${errors.password ? 'border-red-500' : ''}`}
>>>>>>> Stashed changes
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {charCounts.password}/128
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long and include a number and a special character.
          </p>
        </div>

        <div className="space-y-2">
<<<<<<< Updated upstream
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" required />
=======
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              maxLength={128}
              {...register('confirmPassword', {
                onChange: (e) => updateCharCount('confirmPassword', e.target.value)
              })}
              className={`pr-20 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {charCounts.confirmPassword}/128
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
>>>>>>> Stashed changes
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
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

        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
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

      {/* Image Cropper Modal */}
      {cropperState.isOpen && cropperState.imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Crop Profile Picture
            </h3>
            <div className="mb-4 relative" style={{ height: '400px' }}>
              <Cropper
                image={cropperState.imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCropCancel}>
                Cancel
              </Button>
              <Button onClick={handleCropComplete}>
                Use Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
