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
>>>>>>> Stashed changes
import Link from 'next/link'
import Cropper from 'react-easy-crop'

export default function CreateCommunityPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
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
    fetchCategories()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        toast({
          title: "Community Created!",
          description: "Your farming community has been successfully created.",
        })

        router.push(`/community/${communityData.uuid}`)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create community. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="icon" asChild>
              <Link href="/community">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Create New Community
              </h1>
              <p className="text-gray-600">Build a space for farmers to connect and share knowledge</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Community Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Organic Farming Japan"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what your community is about..."
                          required
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Japan, Global"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Privacy Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-green-600" />
                        Privacy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={formData.privacy}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                          <RadioGroupItem value="public" id="public" />
                          <div className="flex-1">
                            <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                              <Globe className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">Public</div>
                                <div className="text-sm text-gray-500">Anyone can see and join this community</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                          <RadioGroupItem value="private" id="private" />
                          <div className="flex-1">
                            <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                              <Lock className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">Private</div>
                                <div className="text-sm text-gray-500">Only invited members can see and join</div>
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
                  transition={{ delay: 0.3 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle>Community Rules (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.rules}
                        onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                        placeholder="Set guidelines for your community members..."
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-green-600" />
                        Profile Picture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                            <input
                              ref={fileInputRefs.image}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload('image')}
                              className="hidden"
                              id="image-upload"
                            />
                            {!imagePreviews.image ? (
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Click to upload profile picture</p>
                                <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                              </label>
                            ) : (
                              <div className="relative">
                                <img
                                  src={imagePreviews.image}
                                  alt="Profile preview"
                                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('image')}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {formData.image && !imagePreviews.image && (
                          <p className="text-sm text-green-600">✓ Image selected: {formData.image.name}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Banner Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-blue-600" />
                        Banner Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <input
                              ref={fileInputRefs.banner}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload('banner')}
                              className="hidden"
                              id="banner-upload"
                            />
                            {!imagePreviews.banner ? (
                              <label htmlFor="banner-upload" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Click to upload banner</p>
                                <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                              </label>
                            ) : (
                              <div className="relative">
                                <img
                                  src={imagePreviews.banner}
                                  alt="Banner preview"
                                  className="w-full h-32 object-cover rounded-lg mb-4"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage('banner')}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {formData.banner && !imagePreviews.banner && (
                          <p className="text-sm text-blue-600">✓ Banner selected: {formData.banner.name}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Banner Preview */}
                        {imagePreviews.banner && (
                          <div className="relative">
                            <img
                              src={imagePreviews.banner}
                              alt="Banner preview"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Profile Picture Preview */}
                          <div className="flex-shrink-0">
                            {imagePreviews.image ? (
                              <img
                                src={imagePreviews.image}
                                alt="Profile preview"
                                className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{formData.name || 'Community Name'}</h3>
                            <p className="text-sm text-gray-600">{formData.description || 'Community description...'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                              <Users className="h-4 w-4" />
                              <span>0 members</span>
                            </div>
                            {formData.category && (
                              <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                                {formData.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.description || !formData.category}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Users className="mr-2 h-5 w-5" />
                    )}
                    {isLoading ? 'Creating...' : 'Create Community'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperState.isOpen && cropperState.imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Crop {cropperState.imageType === 'image' ? 'Profile Picture' : 'Banner'}
            </h3>
            <div className="mb-4 relative" style={{ height: '400px' }}>
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
    </MainLayout>
  )
}