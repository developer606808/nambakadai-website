"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

const vehicleSchema = z.object({
  name: z.string()
    .min(2, 'Equipment name must be at least 2 characters')
    .max(100, 'Equipment name must be less than 100 characters'),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),

  type: z.string()
    .min(1, 'Please select equipment type'),

  category: z.string()
    .min(1, 'Please select a category'),

  pricePerDay: z.number()
    .min(0, 'Daily price cannot be negative')
    .max(50000, 'Daily price must be less than ₹50,000')
    .optional(),

  pricePerHour: z.number()
    .min(1, 'Hourly price must be greater than 0')
    .max(5000, 'Hourly price must be less than ₹5,000'),

  capacity: z.string()
    .min(1, 'Please specify capacity/specifications'),

  fuelType: z.string()
    .min(1, 'Please select fuel type'),

  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),

  horsepower: z.number()
    .min(0, 'Horsepower cannot be negative')
    .max(1000, 'Horsepower must be less than 1000 HP')
    .optional(),

  workingWidth: z.number()
    .min(0, 'Working width cannot be negative')
    .max(50, 'Working width must be less than 50 feet')
    .optional(),

  minimumHours: z.number()
    .min(1, 'Minimum hours must be at least 1')
    .max(168, 'Minimum hours cannot exceed 168 (1 week)')
    .optional(),

  operatorIncluded: z.boolean().default(false),

  features: z.array(z.string())
    .min(1, 'Please add at least one feature'),

  attachments: z.array(z.string())
    .optional(),

  images: z.array(z.string())
    .min(1, 'At least one equipment image is required')
    .max(5, 'Maximum 5 images allowed')
})

type VehicleFormData = z.infer<typeof vehicleSchema>

const vehicleTypes = [
  "TRACTOR", "TRUCK", "LORRY", "VAN", "HARVESTING_MACHINE",
  "PLANTING_MACHINE", "THRESHING_MACHINE", "CULTIVATOR",
  "PLOUGH", "SPRAYER", "TRAILER", "OTHER_EQUIPMENT"
]

const categories = {
  TRACTOR: ["Compact Tractor", "Utility Tractor", "Row Crop Tractor", "Orchard Tractor"],
  TRUCK: ["Mini Truck", "Medium Truck", "Heavy Truck", "Pickup Truck"],
  LORRY: ["Small Lorry", "Medium Lorry", "Heavy Lorry", "Container Lorry"],
  VAN: ["Cargo Van", "Delivery Van", "Mini Van"],
  HARVESTING_MACHINE: ["Combine Harvester", "Paddy Harvester", "Wheat Harvester", "Multi-crop Harvester"],
  PLANTING_MACHINE: ["Seed Drill", "Transplanter", "Paddy Planter", "Multi-crop Plananter"],
  THRESHING_MACHINE: ["Paddy Thresher", "Wheat Thresher", "Multi-crop Thresher"],
  CULTIVATOR: ["Field Cultivator", "Spring Cultivator", "Disc Cultivator"],
  PLOUGH: ["Disc Plough", "Mould Board Plough", "Reversible Plough"],
  SPRAYER: ["Boom Sprayer", "Knapsack Sprayer", "Tractor Mounted Sprayer"],
  TRAILER: ["Farm Trailer", "Tipping Trailer", "Water Tanker"],
  OTHER_EQUIPMENT: ["Rotavator", "Harrow", "Leveler", "Weeder", "Reaper"]
}

const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC", "CNG", "HYBRID"]

const commonFeatures = [
  "Operator Included", "Self Operation", "Insurance Included", "24/7 Support",
  "Fuel Included", "Maintenance Included", "Delivery Available", "Pickup Available",
  "Training Provided", "Technical Support", "Spare Parts Available", "Emergency Service"
]

const tractorAttachments = [
  "Rotavator", "Plough", "Cultivator", "Harrow", "Seed Drill", "Sprayer",
  "Trailer", "Mower", "Thresher", "Water Tanker", "Leveler", "Weeder"
]

export default function NewVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string>("")
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
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      operatorIncluded: false,
      pricePerDay: undefined,
      horsepower: undefined,
      workingWidth: undefined,
      minimumHours: undefined
    }
  })

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

  // Fetch units (for now, we'll use the existing units API)
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

  // Get unit label based on selected unit
  const getUnitLabel = () => {
    switch (selectedUnit) {
      case 'tons': return 'Ton'
      case 'kilograms': return 'Kg'
      case 'liters': return 'Liter'
      case 'pieces': return 'Piece'
      case 'hectares': return 'Hectare'
      default: return 'Unit'
    }
  }

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

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setValue('type', type)
    setValue('category', '') // Reset category when type changes
  }

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature]

    setSelectedFeatures(newFeatures)
    setValue('features', newFeatures)
  }

  const handleAttachmentToggle = (attachment: string) => {
    const newAttachments = selectedAttachments.includes(attachment)
      ? selectedAttachments.filter(a => a !== attachment)
      : [...selectedAttachments, attachment]

    setSelectedAttachments(newAttachments)
    setValue('attachments', newAttachments)
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
    setIsLoading(true)
    clearErrors()

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Prepare vehicle data
      const vehicleData = {
        ...data,
        images: imageUrls,
        pricePerDay: data.pricePerDay ? Number(data.pricePerDay) : undefined,
        pricePerHour: Number(data.pricePerHour),
        horsepower: data.horsepower ? Number(data.horsepower) : undefined,
        workingWidth: data.workingWidth ? Number(data.workingWidth) : undefined,
        minimumHours: data.minimumHours ? Number(data.minimumHours) : undefined,
        features: selectedFeatures,
        attachments: selectedAttachments
      }

      const response = await fetch('/api/vehicles', {
        method: 'POST',
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
        throw new Error(result.error || 'Failed to create vehicle listing')
      }

      toast({
        title: "Vehicle listed successfully!",
        description: "Your vehicle is now available for rent.",
      })

      router.push("/seller/rent-vehicles")
    } catch (error) {
      console.error('Vehicle creation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create vehicle listing",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-600">List your vehicle for rent</p>
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
              Enter the basic details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mahindra Bolero Pickup"
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
                    setValue('type', value)
                    // Clear category when type changes
                    setValue('category', '')
                  }}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  onValueChange={(value) => setValue('category', value)}
                  disabled={!selectedType}
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
                <Select onValueChange={(value) => setValue('fuelType', value)}>
                  <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.fuelType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your vehicle, its condition, and any special features..."
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

            {/* Unit Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Unit Information</CardTitle>
                <CardDescription>
                  Select the unit for measuring capacity and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select onValueChange={(value) => setSelectedUnit(value)}>
                    <SelectTrigger className="text-gray-500">
                      <SelectValue placeholder="Select a unit (for reference only)" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.name_en} ({unit.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  placeholder="1000"
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
                <Label htmlFor="pricePerHour">Price per {getUnitLabel()} (₹) *</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  placeholder="100"
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
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  placeholder={`e.g., 1 ${getUnitLabel()}`}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Chennai, Tamil Nadu"
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
              Upload clear images of your vehicle (1-5 images)
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
                required={vehicleImages.length === 0}
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
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                List Vehicle
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
