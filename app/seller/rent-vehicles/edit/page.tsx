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
  const publicKey = searchParams.get('id')
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
        const response = await fetch(`/api/vehicles/${publicKey}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch vehicle')
        }

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
      }
    }

    fetchVehicle()
  }, [publicKey, session, router, setValue])

  // Fetch categories by type
  useEffect(() => {
    if (selectedType) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`/api/categories?type=RENTAL&search=${selectedType}`)
          const data = await response.json()
          setCategories(data.data || [])
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
    
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  if (status === 'loading' || fetching) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/seller/rent-vehicles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-600">Update your vehicle listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Vehicle Information
            </CardTitle>
            <CardDescription>
              Update the details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  placeholder="e.g., 5 tons, 2000 liters"
                  {...register('capacity')}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.capacity.message}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Add technical specifications for your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horsepower">Horsepower (Optional)</Label>
                <Input
                  id="horsepower"
                  type="number"
                  placeholder="0"
                  {...register('horsepower', { valueAsNumber: true })}
                  className={errors.horsepower ? 'border-red-500' : ''}
                />
                {errors.horsepower && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.horsepower.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingWidth">Working Width (ft) (Optional)</Label>
                <Input
                  id="workingWidth"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...register('workingWidth', { valueAsNumber: true })}
                  className={errors.workingWidth ? 'border-red-500' : ''}
                />
                {errors.workingWidth && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.workingWidth.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Add features of your vehicle (up to 10)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watch('features').map((feature, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.features && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.features.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>
              Add available attachments/implements (optional, up to 10)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={attachmentInput}
                onChange={(e) => setAttachmentInput(e.target.value)}
                placeholder="Enter an attachment"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
              />
              <Button type="button" onClick={addAttachment}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(watch('attachments') || []).map((attachment, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{attachment}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Vehicle Images
            </CardTitle>
            <CardDescription>
              Upload high-quality images of your vehicle (1-5 images)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicleImages.length < 5 && (
              <ImageUpload
                onImageChange={handleImageChange}
                aspectRatio={16/9}
                cropShape="rect"
                maxSize={5}
                placeholder="Upload vehicle image"
              />
            )}

            {vehicleImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {vehicleImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.images.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/seller/rent-vehicles">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Vehicle
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}