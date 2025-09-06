"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getPasswordStrength } from "@/lib/validations/auth"
import { ImageCropDialog } from "@/components/profile/image-crop-dialog"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordChangeForm } from "@/components/profile/password-change-form"
import { SavedItems } from "@/components/profile/saved-items"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  avatar: string | null
  role: string
  isVerified: boolean
  joinDate: string
  stats: {
    productsCount: number
    storesCount: number
    wishlistCount: number
  }
}

interface UserStore {
  id: number
  name: string
  publicKey: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<UserProfile | null>(null)
  const [store, setStore] = useState<UserStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [phoneError, setPhoneError] = useState<string>("")

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] })

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [rotation, setRotation] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Debug session data
  useEffect(() => {
    console.log('Profile page - Session status:', status)
    console.log('Profile page - Session data:', session)
    if (session?.user) {
      console.log('Profile page - User data:', session.user)
      console.log('Profile page - User ID:', session.user.id)
      console.log('Profile page - User ID type:', typeof session.user.id)
      console.log('Profile page - User email:', session.user.email)
      console.log('Profile page - User name:', session.user.name)
    }
  }, [status, session])

  // Fetch user profile
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      console.log('Session data:', session)
      console.log('User ID:', session.user.id)
      fetchProfile()
    } else if (status === "authenticated") {
      console.log('Session authenticated but no user ID:', session)
    }
  }, [status, session])

  // Update password strength when new password changes
  useEffect(() => {
    if (passwordForm.newPassword) {
      const strength = getPasswordStrength(passwordForm.newPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [passwordForm.newPassword])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      console.log('Fetching profile data...')

      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies for authentication
      })
      console.log('Profile API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Profile data received:', data)

        setUser(data.user)
        setStore(data.store)

        // Initialize form with current data
        setProfileForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
        })

        console.log('Profile data set successfully')
      } else {
        const errorText = await response.text()
        console.error('Profile API error:', response.status, errorText)

        // Try to parse error as JSON
        try {
          const errorData = JSON.parse(errorText)
          console.error('Parsed error:', errorData)
        } catch (e) {
          console.error('Could not parse error response')
        }

        toast({
          title: "Error",
          description: `Failed to load profile data (${response.status})`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle profile picture selection and show cropper
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      // Show loading state
      setUploadingImage(true)

      // Convert file to base64 for cropper
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setCropperOpen(true)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setRotation(0)
        setCroppedPreview(null)
        setUploadingImage(false)
      }
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the selected image",
          variant: "destructive",
        })
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Error",
        description: "Failed to process the selected image",
        variant: "destructive",
      })
      setUploadingImage(false)
    }
  }

  // Handle crop completion
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // Create cropped image
  const createCroppedImage = async (): Promise<File | null> => {
    if (!selectedImage || !croppedAreaPixels) return null

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const image = new window.Image()

      return new Promise((resolve, reject) => {
        image.onload = () => {
          canvas.width = croppedAreaPixels.width
          canvas.height = croppedAreaPixels.height

          if (ctx) {
            // Apply rotation if any
            if (rotation !== 0) {
              ctx.translate(canvas.width / 2, canvas.height / 2)
              ctx.rotate((rotation * Math.PI) / 180)
              ctx.translate(-canvas.width / 2, -canvas.height / 2)
            }

            ctx.drawImage(
              image,
              croppedAreaPixels.x,
              croppedAreaPixels.y,
              croppedAreaPixels.width,
              croppedAreaPixels.height,
              0,
              0,
              croppedAreaPixels.width,
              croppedAreaPixels.height
            )
          }

          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'profile-cropped.jpg', { type: 'image/jpeg' })
              resolve(file)
            } else {
              reject(new Error('Failed to create cropped image'))
            }
          }, 'image/jpeg', 0.9)
        }

        image.onerror = () => reject(new Error('Failed to load image'))
        image.src = selectedImage
      })
    } catch (error) {
      console.error('Error creating cropped image:', error)
      throw error
    }
  }

  // Handle final upload after cropping
  const handleCroppedUpload = async () => {
    if (!croppedAreaPixels) {
      toast({
        title: "Error",
        description: "Please crop the image before uploading",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)

      const croppedFile = await createCroppedImage()
      if (!croppedFile) {
        toast({
          title: "Error",
          description: "Failed to process image. Please try again.",
          variant: "destructive",
        })
        setUploadingImage(false)
        return
      }

      const formData = new FormData()
      formData.append('profileImage', croppedFile)

      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        })
        setCropperOpen(false)
        setSelectedImage(null)
        setCroppedPreview(null)
        // Refresh profile data
        fetchProfile()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to upload profile picture",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error uploading cropped image:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Generate preview of cropped image
  const generateCroppedPreview = async () => {
    if (!selectedImage || !croppedAreaPixels) return

    try {
      const croppedFile = await createCroppedImage()
      if (croppedFile) {
        const reader = new FileReader()
        reader.onload = () => {
          setCroppedPreview(reader.result as string)
        }
        reader.readAsDataURL(croppedFile)
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return

    // Validate phone number
    const phoneValidationError = validatePhone(profileForm.phone)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      toast({
        title: "Validation Error",
        description: phoneValidationError,
        variant: "destructive",
      })
      return
    }

    try {
      setUpdating(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        const errorData = await response.json()
        if (errorData.details) {
          // Show validation errors
          errorData.details.forEach((detail: any) => {
            toast({
              title: "Validation Error",
              description: detail.message,
              variant: "destructive",
            })
          })
        } else {
          toast({
            title: "Error",
            description: errorData.error || "Failed to update profile",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Phone validation function
  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "" // Empty is allowed
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '')

    // Check if it's a valid phone number (10-15 digits)
    if (cleanPhone.length < 10) {
      return "Phone number must be at least 10 digits"
    }

    if (cleanPhone.length > 15) {
      return "Phone number must be no more than 15 digits"
    }

    // Check if it starts with a valid country code (optional)
    if (cleanPhone.length > 10 && !cleanPhone.startsWith('1') && !cleanPhone.startsWith('91')) {
      // Allow common country codes, but don't be too strict
    }

    return ""
  }

  // Handle form changes
  const handleProfileFormChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))

    // Clear phone error when user starts typing
    if (field === 'phone') {
      setPhoneError("")
    }
  }

  const handlePasswordFormChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Handle password change
  const handlePasswordChange = async () => {
    // Frontend validation
    if (!passwordForm.currentPassword.trim()) {
      toast({
        title: "Validation Error",
        description: "Current password is required",
        variant: "destructive",
      })
      return
    }

    if (!passwordForm.newPassword.trim()) {
      toast({
        title: "Validation Error",
        description: "New password is required",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (!/[a-z]/.test(passwordForm.newPassword)) {
      toast({
        title: "Validation Error",
        description: "Password must contain at least one lowercase letter",
        variant: "destructive",
      })
      return
    }

    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      toast({
        title: "Validation Error",
        description: "Password must contain at least one uppercase letter",
        variant: "destructive",
      })
      return
    }

    if (!/\d/.test(passwordForm.newPassword)) {
      toast({
        title: "Validation Error",
        description: "Password must contain at least one number",
        variant: "destructive",
      })
      return
    }

    if (!/[^a-zA-Z0-9]/.test(passwordForm.newPassword)) {
      toast({
        title: "Validation Error",
        description: "Password must contain at least one special character",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords don't match",
        variant: "destructive",
      })
      return
    }

    try {
      setChangingPassword(true)
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      })

      if (response.ok) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast({
          title: "Success",
          description: "Password changed successfully",
        })
      } else {
        const errorData = await response.json()
        if (errorData.details) {
          // Show validation errors
          errorData.details.forEach((detail: any) => {
            toast({
              title: "Validation Error",
              description: detail.message,
              variant: "destructive",
            })
          })
        } else {
          toast({
            title: "Error",
            description: errorData.error || "Failed to change password",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  if (status === "loading" || loading) {
    console.log('status--->', status, 'loading----->', loading);
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-500"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin animation-delay-300"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Loading your profile...</h3>
                <p className="text-sm text-gray-600">Please wait while we fetch your information</p>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (status === "unauthenticated") {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">Please log in to access your profile and manage your account settings.</p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">Unable to load your profile information. Please try again or contact support if the problem persists.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                    className="flex-1 h-12 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-4 px-4 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <Breadcrumbs />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProfileSidebar
              user={user}
              store={store}
              uploadingImage={uploadingImage}
              onProfilePictureUpload={handleProfilePictureUpload}
              fileInputRef={fileInputRef}
            />

            <div className="flex-1 min-w-0">
              <Tabs defaultValue="profile" className="w-full">
                <div className="mb-4 sm:mb-6 overflow-x-auto">
                  <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-white p-1 text-muted-foreground shadow-sm min-w-max">
                    <TabsTrigger
                      value="profile"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="saved"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      Saved Items
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <TabsContent value="profile" className="mt-0">
                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <ProfileForm
                        user={user}
                        formData={profileForm}
                        onFormChange={handleProfileFormChange}
                        onSubmit={handleProfileUpdate}
                        updating={updating}
                        phoneError={phoneError}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-0">
                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <PasswordChangeForm
                        formData={passwordForm}
                        onFormChange={handlePasswordFormChange}
                        showPasswords={showPasswords}
                        onTogglePasswordVisibility={handleTogglePasswordVisibility}
                        passwordStrength={passwordStrength}
                        onSubmit={handlePasswordChange}
                        changing={changingPassword}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="saved" className="mt-0">
                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <SavedItems user={user} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <ImageCropDialog
        open={cropperOpen}
        onOpenChange={(open) => {
          setCropperOpen(open)
          if (!open) {
            setSelectedImage(null)
            setCroppedPreview(null)
            setCroppedAreaPixels(null)
          }
        }}
        selectedImage={selectedImage}
        onCropComplete={onCropComplete}
        onUpload={handleCroppedUpload}
        uploading={uploadingImage}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
        croppedPreview={croppedPreview}
        onGeneratePreview={generateCroppedPreview}
        croppedAreaPixels={croppedAreaPixels}
      />
    </MainLayout>
  )
}
