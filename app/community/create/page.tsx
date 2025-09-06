'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Users, Globe, Lock, ImageIcon, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { MainLayout } from '@/components/main-layout'
import Link from 'next/link'
import Cropper from 'react-easy-crop'

export default function CreateCommunityPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [checkingCommunity, setCheckingCommunity] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    location: '',
    rules: '',
    image: null as File | null, // Profile picture
    banner: null as File | null // Banner image
  })

  // Character count states
  const [charCounts, setCharCounts] = useState({
    name: 0,
    description: 0,
    location: 0,
    rules: 0
  })

  // Max lengths
  const maxLengths = {
    name: 50,
    description: 500,
    location: 100,
    rules: 1000
  }

  const [imagePreviews, setImagePreviews] = useState({
    image: null as string | null, // Profile picture preview
    banner: null as string | null // Banner preview
  })

  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageType: null as 'image' | 'banner' | null,
    imageSrc: null as string | null
  })

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const fileInputRefs = {
    image: useRef<HTMLInputElement>(null),
    banner: useRef<HTMLInputElement>(null)
  }

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
              const file = new File([blob], `cropped-${cropperState.imageType}.jpg`, { type: 'image/jpeg' })
              resolve(file)
            }
          }, 'image/jpeg')
        }
      }
    })
  }

  useEffect(() => {
    checkExistingCommunity()
  }, [])

  const checkExistingCommunity = async () => {
    try {
      setCheckingCommunity(true)
      const response = await fetch('/api/community')

      if (response.ok) {
        const data = await response.json()
        const communities = data.communities || []

        // If user already has a community, redirect to community page
        if (communities.length > 0) {
          toast({
            title: "Community Already Exists",
            description: "You already have a community. You can only create one community per account.",
          })
          router.push('/community')
          return
        }
      }

      // If no community found or API error, proceed with loading categories
      fetchCategories()
    } catch (error) {
      console.error('Error checking existing community:', error)
      // On error, still allow access to create page
      fetchCategories()
    } finally {
      setCheckingCommunity(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        // Extract category names from the API response
        if (Array.isArray(data)) {
          const categoryNames = data.map((cat: any) => cat.name_en)
          setCategories(categoryNames)
        } else {
          // If data is not an array, use default
          setCategories([
            'Organic', 'Rice', 'Vegetables', 'Technology', 'Fruits', 'Sustainability',
            'Livestock', 'Aquaculture', 'Greenhouse', 'Equipment', 'Seeds', 'Fertilizers'
          ])
        }
      } else {
        // Fallback to default categories if API fails
        setCategories([
          'Organic', 'Rice', 'Vegetables', 'Technology', 'Fruits', 'Sustainability',
          'Livestock', 'Aquaculture', 'Greenhouse', 'Equipment', 'Seeds', 'Fertilizers'
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to default categories
      setCategories([
        'Organic', 'Rice', 'Vegetables', 'Technology', 'Fruits', 'Sustainability',
        'Livestock', 'Aquaculture', 'Greenhouse', 'Equipment', 'Seeds', 'Fertilizers'
      ])
    } finally {
      setIsLoadingCategories(false)
      setCheckingCommunity(false)
    }
  }

  const handleImageUpload = (type: 'image' | 'banner') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create image preview for cropper
      const reader = new FileReader()
      reader.onload = (event) => {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setCropperState({
          isOpen: true,
          imageType: type,
          imageSrc: event.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async () => {
    if (cropperState.imageType && croppedAreaPixels && cropperState.imageSrc) {
      const croppedFile = await getCroppedImg(cropperState.imageSrc, croppedAreaPixels)
      const croppedUrl = URL.createObjectURL(croppedFile)
      setFormData(prev => ({ ...prev, [cropperState.imageType!]: croppedFile }))
      setImagePreviews(prev => ({
        ...prev,
        [cropperState.imageType!]: croppedUrl
      }))
    }
    setCropperState({ isOpen: false, imageType: null, imageSrc: null })
    setCroppedAreaPixels(null)
  }

  const handleCropCancel = () => {
    const currentType = cropperState.imageType
    setCropperState({ isOpen: false, imageType: null, imageSrc: null })
    setCroppedAreaPixels(null)
    // Clear the file input
    if (currentType && fileInputRefs[currentType].current) {
      fileInputRefs[currentType].current.value = ''
    }
  }

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const removeImage = (type: 'image' | 'banner') => {
    setFormData(prev => ({ ...prev, [type]: null }))
    setImagePreviews(prev => ({ ...prev, [type]: null }))
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current.value = ''
    }
  }

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Update character count
    if (field in charCounts) {
      setCharCounts(prev => ({ ...prev, [field]: value.length }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent double submission
    if (isLoading) return

    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('privacy', formData.privacy)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('rules', formData.rules)

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (formData.banner) {
        formDataToSend.append('banner', formData.banner)
      }

      const response = await fetch('/api/community', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const communityData = await response.json()
        setIsSuccess(true)
        toast({
          title: "Community Created!",
          description: "Your farming community has been successfully created.",
        })

        // Add a small delay to show success message before navigation
        setTimeout(() => {
          // Navigate to the correct community page URL
          if (communityData.uuid) {
            router.push(`/community/${communityData.uuid}`)
          } else {
            // Fallback to community list if UUID is not available
            router.push('/community')
          }
        }, 1500)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create community. Please try again.",
          variant: "destructive"
        })
        setIsLoading(false) // Re-enable button on error
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false) // Re-enable button on error
    }
    // Don't set isLoading to false here - let the navigation handle it
  }

  // Show loading while checking for existing communities
  if (checkingCommunity) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-500"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin animation-delay-300"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Checking your communities...</h3>
                <p className="text-sm text-gray-600">Please wait while we verify your community status</p>
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <Button
              variant="outline"
              size="icon"
              asChild
              className="bg-white/80 hover:bg-white border-green-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Link href="/community">
                <ArrowLeft className="h-4 w-4 text-green-600" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create New Community
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Build a thriving space for farmers to connect and share knowledge</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Form */}
              <div className="xl:col-span-8 space-y-6">
                {/* Basic Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                          Basic Information
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Community Name</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            placeholder="e.g., Organic Farming Japan"
                            required
                            maxLength={maxLengths.name}
                            className="h-12 text-base border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80 pr-16"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium">
                            <span className={`${charCounts.name > maxLengths.name * 0.9 ? 'text-red-500' : charCounts.name > maxLengths.name * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                              {charCounts.name}/{maxLengths.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Description</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            placeholder="Describe what your community is about..."
                            required
                            rows={4}
                            maxLength={maxLengths.description}
                            className="text-base border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80 resize-none pr-20"
                          />
                          <div className="absolute right-3 bottom-3 text-xs font-medium">
                            <span className={`${charCounts.description > maxLengths.description * 0.9 ? 'text-red-500' : charCounts.description > maxLengths.description * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                              {charCounts.description}/{maxLengths.description}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>Category</span>
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80">
                              <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category} className="hover:bg-green-50 focus:bg-green-50">
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                            Location <span className="text-gray-400 text-xs">(optional)</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => handleFormChange('location', e.target.value)}
                              placeholder="e.g., Japan, Global"
                              maxLength={maxLengths.location}
                              className="h-12 text-base border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80 pr-16"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium">
                              <span className={`${charCounts.location > maxLengths.location * 0.9 ? 'text-red-500' : charCounts.location > maxLengths.location * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {charCounts.location}/{maxLengths.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Privacy Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <Lock className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                          Privacy Settings
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={formData.privacy}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                        className="space-y-4"
                      >
                        <div className="relative flex items-center space-x-3 p-5 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 cursor-pointer group">
                          <RadioGroupItem value="public" id="public" className="border-2 border-gray-300 group-hover:border-green-400" />
                          <div className="flex-1">
                            <Label htmlFor="public" className="flex items-center gap-3 cursor-pointer">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                                <Globe className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-base">Public Community</div>
                                <div className="text-sm text-gray-600 mt-1">Anyone can discover, view, and join this community</div>
                              </div>
                            </Label>
                          </div>
                        </div>

                        <div className="relative flex items-center space-x-3 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer group">
                          <RadioGroupItem value="private" id="private" className="border-2 border-gray-300 group-hover:border-blue-400" />
                          <div className="flex-1">
                            <Label htmlFor="private" className="flex items-center gap-3 cursor-pointer">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                                <Lock className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-base">Private Community</div>
                                <div className="text-sm text-gray-600 mt-1">Only invited members can see and join this community</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Community Rules */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                          Community Rules
                        </span>
                        <span className="text-sm text-gray-400 font-normal">(Optional)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="relative">
                          <Textarea
                            value={formData.rules}
                            onChange={(e) => handleFormChange('rules', e.target.value)}
                            placeholder="Set guidelines for your community members...&#10;&#10;Example:&#10;• Be respectful to all members&#10;• Share knowledge and experiences&#10;• No spam or promotional content&#10;• Keep discussions on-topic"
                            rows={6}
                            maxLength={maxLengths.rules}
                            className="text-base border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80 resize-none pr-20"
                          />
                          <div className="absolute right-3 bottom-3 text-xs font-medium">
                            <span className={`${charCounts.rules > maxLengths.rules * 0.9 ? 'text-red-500' : charCounts.rules > maxLengths.rules * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                              {charCounts.rules}/{maxLengths.rules}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Community rules help maintain a positive and productive environment
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-4 space-y-6">
                {/* Profile Picture */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Profile Picture</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group cursor-pointer">
                            <input
                              ref={fileInputRefs.image}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload('image')}
                              className="hidden"
                              id="image-upload"
                            />
                            {!imagePreviews.image ? (
                              <label htmlFor="image-upload" className="cursor-pointer block">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                  <Upload className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">Click to upload profile picture</p>
                                <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                                <div className="mt-3 px-4 py-2 bg-green-100 text-green-700 text-xs rounded-full inline-block">
                                  Recommended: Square image (1:1 ratio)
                                </div>
                              </label>
                            ) : (
                              <div className="relative">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                  <img
                                    src={imagePreviews.image}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover rounded-xl border-4 border-white shadow-lg"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => removeImage('image')}
                                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg opacity-0 hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-green-600 mb-1">✓ Profile picture uploaded</p>
                                  <button
                                    type="button"
                                    onClick={() => removeImage('image')}
                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                  >
                                    Remove and upload different image
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Banner Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                          <ImageIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Banner Image</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer">
                            <input
                              ref={fileInputRefs.banner}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload('banner')}
                              className="hidden"
                              id="banner-upload"
                            />
                            {!imagePreviews.banner ? (
                              <label htmlFor="banner-upload" className="cursor-pointer block">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                  <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">Click to upload banner image</p>
                                <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                                <div className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 text-xs rounded-full inline-block">
                                  Recommended: Landscape image (3:1 ratio)
                                </div>
                              </label>
                            ) : (
                              <div className="relative">
                                <div className="relative w-full h-32 mx-auto mb-4">
                                  <img
                                    src={imagePreviews.banner}
                                    alt="Banner preview"
                                    className="w-full h-full object-cover rounded-xl border-4 border-white shadow-lg"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => removeImage('banner')}
                                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg opacity-0 hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-blue-600 mb-1">✓ Banner image uploaded</p>
                                  <button
                                    type="button"
                                    onClick={() => removeImage('banner')}
                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                  >
                                    Remove and upload different image
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Live Preview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Banner Preview */}
                        {imagePreviews.banner && (
                          <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={imagePreviews.banner}
                              alt="Banner preview"
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        )}

                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                          <div className="flex items-start gap-4">
                            {/* Profile Picture Preview */}
                            <div className="flex-shrink-0">
                              {imagePreviews.image ? (
                                <div className="relative">
                                  <img
                                    src={imagePreviews.image}
                                    alt="Profile preview"
                                    className="w-16 h-16 object-cover rounded-xl border-4 border-white shadow-lg"
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md">
                                  <Users className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl text-gray-900 mb-1">
                                {formData.name || 'Your Community Name'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {formData.description || 'Your community description will appear here...'}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span className="font-medium">0 members</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>{formData.location || 'Global'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {formData.category && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                                    {formData.category}
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  formData.privacy === 'public'
                                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                                }`}>
                                  {formData.privacy === 'public' ? '🌐 Public' : '🔒 Private'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500 italic">
                            This is how your community will appear to other users
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {/* Progress Indicator */}
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Setup Progress</span>
                        <span className="text-sm font-bold text-green-600">
                          {[
                            formData.name,
                            formData.description,
                            formData.category,
                            formData.privacy,
                            (formData.image || formData.banner)
                          ].filter(Boolean).length}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${([
                              formData.name,
                              formData.description,
                              formData.category,
                              formData.privacy,
                              (formData.image || formData.banner)
                            ].filter(Boolean).length / 5) * 100}%`
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Basic Info</span>
                        <span>Privacy</span>
                        <span>Images</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || isSuccess || !formData.name || !formData.description || !formData.category}
                      className="w-full h-14 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60"
                    >
                      {isSuccess ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">Community Created!</span>
                            <span className="text-xs opacity-90">Redirecting to your community...</span>
                          </div>
                        </div>
                      ) : isLoading ? (
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-bold">Creating Community...</span>
                            <span className="text-xs opacity-90">This may take a few moments</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">Create Community</span>
                            <span className="text-xs opacity-90">Launch your farming community</span>
                          </div>
                        </div>
                      )}
                    </Button>

                    {/* Helper Text */}
                    {!isLoading && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          By creating a community, you agree to our community guidelines and terms of service
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperState.isOpen && cropperState.imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 sm:p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {cropperState.imageType === 'image' ? (
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold truncate">
                      Crop {cropperState.imageType === 'image' ? 'Profile Picture' : 'Banner Image'}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
                      Adjust the crop area to fit your {cropperState.imageType === 'image' ? 'profile' : 'banner'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCropCancel}
                  className="text-white hover:bg-white/20 rounded-full flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            {/* Cropper Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 relative bg-gray-100 rounded-xl overflow-hidden" style={{ height: '300px', minHeight: '250px' }}>
                <Cropper
                  image={cropperState.imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropperState.imageType === 'image' ? 1 : 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Control */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Zoom Level
                  </label>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1.0x</span>
                  <span>3.0x</span>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCropCancel}
                  className="border-gray-300 hover:bg-gray-50 font-medium px-4 sm:px-6 py-3 h-12"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleCropComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-4 sm:px-6 py-3 h-12 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Use This Image
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  )
}