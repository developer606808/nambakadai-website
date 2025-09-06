"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Truck, Upload, XCircle } from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import { useSession } from "next-auth/react"

const vehicleSchema = z.object({
  name: z.string()
    .min(2, 'Vehicle name must be at least 2 characters')
    .max(100, 'Vehicle name must be less than 100 characters'),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),

  type: z.enum(['TRACTOR', 'TRUCK', 'LORRY', 'VAN', 'HARVESTING_MACHINE', 'PLANTING_MACHINE', 'THRESHING_MACHINE', 'CULTIVATOR', 'PLOUGH', 'SPRAYER', 'TRAILER', 'OTHER_EQUIPMENT']),

  category: z.string()
    .min(1, 'Category is required'),

  pricePerDay: z.number()
    .min(1, 'Daily price must be greater than 0')
    .max(50000, 'Daily price must be less than ₹50,000')
    .optional(),

  pricePerHour: z.number()
    .min(1, 'Hourly price must be greater than 0')
    .max(5000, 'Hourly price must be less than ₹5,000'),

  capacity: z.string()
    .min(1, 'Capacity is required'),

  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID']),

  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),

  features: z.array(z.string())
    .min(1, 'At least one feature is required'),

  images: z.array(z.string())
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),

  horsepower: z.number()
    .min(1, 'Horsepower must be greater than 0')
    .max(500, 'Horsepower must be less than 500')
    .optional(),

  workingWidth: z.number()
    .min(1, 'Working width must be greater than 0')
    .max(50, 'Working width must be less than 50 feet')
    .optional(),

  attachments: z.array(z.string()).optional(),

  operatorIncluded: z.boolean(),

  minimumHours: z.number()
    .min(1, 'Minimum hours must be at least 1')
    .max(24, 'Minimum hours must be less than 24')
    .optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface Vehicle {
  id: number;
  publicKey: string;
  name: string;
  description: string;
  type: string;
  category: string;
  pricePerDay: number | null;
  pricePerHour: number;
  capacity: string;
  fuelType: string;
  location: string;
  features: string[];
  images: string[];
  horsepower: number | null;
  workingWidth: number | null;
  attachments: string[];
  operatorIncluded: boolean;
  minimumHours: number | null;
}

export default function EditVehiclePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const publicKey = searchParams?.get('id')
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [featureInput, setFeatureInput] = useState("")
  const [attachmentInput, setAttachmentInput] = useState("")
  const [vehicleId, setVehicleId] = useState<string>("")
  const [fetching, setFetching] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema)
  })

  // Fetch vehicle data
  useEffect(() => {
    if (!publicKey || !session) return

    const fetchVehicle = async () => {
      try {
        setFetching(true)
        const response = await fetch(`/api/vehicles/${publicKey}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch vehicle')
        }

        // Set vehicle ID
        setVehicleId(data.id)

        // Set form values
        Object.keys(data).forEach(key => {
          if (key === 'features') {
            setSelectedFeatures(data[key] || [])
          } else if (key === 'attachments') {
            setSelectedAttachments(data[key] || [])
          } else if (key === 'images') {
            setVehicleImages(data[key] || [])
          } else if (key === 'type') {
            setSelectedType(data[key])
            setValue(key as keyof VehicleFormData, data[key])
          } else {
            setValue(key as keyof VehicleFormData, data[key])
          }
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        toast({
          title: "Error",
          description: "Failed to load vehicle data",
          variant: "destructive"
        })
        router.push('/seller/rent-vehicles')
      } finally {
        setFetching(false)
      }
    }

    fetchVehicle()
  }, [publicKey, session, router, setValue])

  // Fetch categories by type
  useEffect(() => {
    if (selectedType) {
      const fetchCategories = async () => {
        try {
          const searchTerm = getSearchTerm(selectedType)
          const response = await fetch(`/api/categories?type=RENTAL&search=${searchTerm}`)
          const data = await response.json()
          setCategories(data.categories || data || [])
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      }

      fetchCategories()
    } else {
      setCategories([])
    }
  }, [selectedType])

  // Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch('/api/units')
        const data = await response.json()
        setUnits(data.data || [])
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    fetchUnits()
  }, [])

  const handleImageChange = (imageUrl: string, imageFile: File) => {
    if (vehicleImages.length >= 5) {
      toast({
        title: "Maximum images reached",
        description: "You can upload maximum 5 images per vehicle",
        variant: "destructive"
      })
      return
    }

    setVehicleImages(prev => [...prev, imageUrl])
    setImageFiles(prev => [...prev, imageFile])
    setValue('images', [...vehicleImages, imageUrl])
    clearErrors('images')
  }

  const handleImageRemove = (index: number) => {
    const newImages = vehicleImages.filter((_, i) => i !== index)
    const newFiles = imageFiles.filter((_, i) => i !== index)
    
    setVehicleImages(newImages)
    setImageFiles(newFiles)
    setValue('images', newImages)
  }

  // Map vehicle types to appropriate search terms
  const getSearchTerm = (vehicleType: string) => {
    switch (vehicleType) {
      case 'TRACTOR':
      case 'HARVESTING_MACHINE':
      case 'PLANTING_MACHINE':
      case 'THRESHING_MACHINE':
      case 'CULTIVATOR':
      case 'PLOUGH':
      case 'SPRAYER':
        return 'Farming'
      case 'TRUCK':
      case 'LORRY':
      case 'VAN':
        return 'Transportation'
      case 'OTHER_EQUIPMENT':
        return 'Services'
      default:
        return vehicleType
    }
  }

  const addFeature = () => {
    if (featureInput.trim() && watch('features').length < 10) {
      const currentFeatures = watch('features');
      setValue('features', [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  }

  const removeFeature = (index: number) => {
    const currentFeatures = watch('features');
    setValue('features', currentFeatures.filter((_, i) => i !== index));
  }

  const addAttachment = () => {
    if (attachmentInput.trim() && (watch('attachments')?.length || 0) < 10) {
      const currentAttachments = watch('attachments') || [];
      setValue('attachments', [...currentAttachments, attachmentInput.trim()]);
      setAttachmentInput("");
    }
  }

  const removeAttachment = (index: number) => {
    const currentAttachments = watch('attachments') || [];
    setValue('attachments', currentAttachments.filter((_, i) => i !== index));
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []
    
    for (const file of imageFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'vehicle')

      const response = await fetch('/api/upload/vehicle-images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      uploadedUrls.push(result.url)
    }

    return uploadedUrls
  }

  const onSubmit = async (data: VehicleFormData) => {
    if (!vehicleId) return;

    setIsSubmitting(true)
    clearErrors()

    try {
      // Upload new images if any
      let imageUrls = vehicleImages;
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages()
      }

      // Prepare vehicle data
      const vehicleData = {
        ...data,
        images: imageUrls,
        pricePerDay: data.pricePerDay || null,
        horsepower: data.horsepower || null,
        workingWidth: data.workingWidth || null,
        minimumHours: data.minimumHours || null,
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof VehicleFormData, {
              type: 'server',
              message: message as string
            })
          })
          return
        }
        throw new Error(result.error || 'Failed to update vehicle')
      }

      toast({
        title: "Vehicle updated successfully!",
        description: "Your vehicle listing has been updated.",
      })

      router.push("/seller/rent-vehicles")
    } catch (error) {
      console.error('Vehicle update error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update vehicle",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] flex-col">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading vehicle data...</p>
      </div>
    );
  }

  if (!vehicleId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">Vehicle Not Found</h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">No vehicle ID was provided. Please go back and select a vehicle to edit.</p>
        <Link href="/seller/rent-vehicles">
          <Button size="lg">
            Back to Vehicles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/seller/rent-vehicles">
            <Button variant="outline" size="sm" className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Vehicles</span>
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Edit Vehicle</h1>
            <p className="text-sm sm:text-base text-gray-600">Update your vehicle listing details</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden md:inline">Editing:</span>
          <span className="font-medium">Vehicle Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              Vehicle Information
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update the basic details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter vehicle name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select 
                  onValueChange={(value) => {
                    setSelectedType(value)
                    setValue('type', value as any)
                    // Clear category when type changes
                    setValue('category', '')
                  }} 
                  value={watch('type')}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRACTOR">Tractor</SelectItem>
                    <SelectItem value="TRUCK">Truck</SelectItem>
                    <SelectItem value="LORRY">Lorry</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="HARVESTING_MACHINE">Harvesting Machine</SelectItem>
                    <SelectItem value="PLANTING_MACHINE">Planting Machine</SelectItem>
                    <SelectItem value="THRESHING_MACHINE">Threshing Machine</SelectItem>
                    <SelectItem value="CULTIVATOR">Cultivator</SelectItem>
                    <SelectItem value="PLOUGH">Plough</SelectItem>
                    <SelectItem value="SPRAYER">Sprayer</SelectItem>
                    <SelectItem value="TRAILER">Trailer</SelectItem>
                    <SelectItem value="OTHER_EQUIPMENT">Other Equipment</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  onValueChange={(value) => setValue('category', value)}
                  disabled={!selectedType}
                  value={watch('category')}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name_en}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select onValueChange={(value) => setValue('fuelType', value as any)} value={watch('fuelType')}>
                  <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETROL">Petrol</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="ELECTRIC">Electric</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.fuelType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                  {...register('location')}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your vehicle, its features, and rental terms..."
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">₹</span>
              Pricing
            </CardTitle>
            <CardDescription>
              Set your rental pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('pricePerHour', { valueAsNumber: true })}
                  className={errors.pricePerHour ? 'border-red-500' : ''}
                />
                {errors.pricePerHour && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.pricePerHour.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day (₹) (Optional)</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('pricePerDay', { valueAsNumber: true })}
                  className={errors.pricePerDay ? 'border-red-500' : ''}
                />
                {errors.pricePerDay && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.pricePerDay.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumHours">Minimum Hours (Optional)</Label>
                <Input
                  id="minimumHours"
                  type="number"
                  placeholder="0"
                  {...register('minimumHours', { valueAsNumber: true })}
                  className={errors.minimumHours ? 'border-red-500' : ''}
                />
                {errors.minimumHours && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.minimumHours.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="operatorIncluded"
                {...register('operatorIncluded')}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="operatorIncluded">Operator Included</Label>
            </div>
          </CardContent>
        </Card>



        {/* Attachments */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-lg">🔧</span>
              </div>
              Attachments & Implements
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add available attachments and implements for enhanced functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={attachmentInput}
                onChange={(e) => setAttachmentInput(e.target.value)}
                placeholder="Enter an attachment or implement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                className="flex-1"
              />
              <Button type="button" onClick={addAttachment} className="shrink-0">Add Attachment</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(watch('attachments') || []).map((attachment, index) => (
                <div key={index} className="flex items-center bg-orange-100 hover:bg-orange-200 rounded-full px-3 py-2 transition-colors">
                  <span className="text-sm font-medium">{attachment}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="ml-2 text-orange-600 hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {(!watch('attachments') || watch('attachments')?.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No attachments added yet. Add attachments to increase rental value!</p>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Images */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              Vehicle Images
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update your vehicle images to showcase your equipment ({vehicleImages.length}/5)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {vehicleImages.length < 5 && (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <ImageUpload
                  onImageChange={handleImageChange}
                  aspectRatio={16/9}
                  cropShape="rect"
                  maxSize={5}
                  placeholder="Click to add more images"
                />
              </div>
            )}

            {vehicleImages.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {vehicleImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm">
                        <img
                          src={image}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        onClick={() => handleImageRemove(index)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Hover over images to remove them. You can add up to {5 - vehicleImages.length} more images.
                </p>
              </div>
            )}

            {errors.images && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {errors.images.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 sm:-mx-6">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 max-w-4xl mx-auto">
            <Link href="/seller/rent-vehicles" className="w-full sm:w-auto">
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating Vehicle...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Vehicle
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}