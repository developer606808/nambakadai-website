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


  operatorIncluded: z.boolean(),

  minimumHours: z.number()
    .min(1, 'Minimum hours must be at least 1')
    .max(24, 'Minimum hours must be less than 24')
    .optional(),
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


export default function NewVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
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
      features: [],
      images: []
    }
  })

  // Fetch categories by type
  useEffect(() => {
    if (selectedType) {
      const fetchCategories = async () => {
        try {
          console.log('Fetching categories for type:', selectedType)
          // Get all RENTAL categories and filter client-side based on vehicle type
          const response = await fetch(`/api/categories?type=RENTAL`)
          const data = await response.json()
          const allRentalCategories = data.categories || data || []
          console.log('All rental categories:', allRentalCategories)

          // Filter categories based on selected vehicle type
          const filteredCategories = filterCategoriesByVehicleType(allRentalCategories, selectedType)
          console.log('Filtered categories for', selectedType, ':', filteredCategories)

          setCategories(filteredCategories)
        } catch (error) {
          console.error('Error fetching categories:', error)
          setCategories([])
        }
      }

      fetchCategories()
    } else {
      setCategories([])
    }
  }, [selectedType])

  // Ensure category is properly selected when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      const currentCategoryValue = watch('category')
      console.log('Categories loaded, current category value:', currentCategoryValue)
      console.log('Available categories:', categories.map(c => c.name_en))

      // If we have a category value but it's not in the current categories list, try to find a match
      if (currentCategoryValue) {
        const matchingCategory = categories.find(cat => cat.name_en === currentCategoryValue)
        if (!matchingCategory) {
          console.log('Category not found in current list, looking for alternatives...')
          // Try to find a category that might be a close match
          const alternativeCategory = categories.find(cat =>
            cat.name_en.toLowerCase().includes(currentCategoryValue.toLowerCase()) ||
            currentCategoryValue.toLowerCase().includes(cat.name_en.toLowerCase())
          )
          if (alternativeCategory) {
            console.log('Found alternative category:', alternativeCategory.name_en)
            setValue('category', alternativeCategory.name_en)
          }
        } else {
          console.log('Category found and preselected:', matchingCategory.name_en)
        }
      }
    }
  }, [categories, setValue, watch])

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
    setValue('type', type as any)
    setValue('category', '') // Reset category when type changes
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

  // Filter categories based on vehicle type
  const filterCategoriesByVehicleType = (categories: any[], vehicleType: string) => {
    const categoryNameMap: { [key: string]: string[] } = {
      'TRACTOR': ['Tractor'],
      'HARVESTING_MACHINE': ['Harvesting Machine'],
      'SPRAYER': ['Sprayer'],
      'TRUCK': ['Mini Truck'],
      'LORRY': ['Mini Truck'], // Map Lorry to Mini Truck
      'VAN': ['Mini Truck'],   // Map Van to Mini Truck
      'PLANTING_MACHINE': [],  // No specific category
      'THRESHING_MACHINE': [], // No specific category
      'CULTIVATOR': [],        // No specific category
      'OTHER_EQUIPMENT': [],   // No specific category
    }

    const allowedNames = categoryNameMap[vehicleType] || []
    if (allowedNames.length === 0) {
      // If no specific mapping, return all categories
      return categories
    }

    return categories.filter(category =>
      allowedNames.some(name =>
        category.name_en.toLowerCase().includes(name.toLowerCase())
      )
    )
  }

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature]

    setSelectedFeatures(newFeatures)
    setValue('features', newFeatures)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/seller/rent-vehicles">
            <Button variant="outline" size="sm" className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Vehicles</span>
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Add New Vehicle</h1>
            <p className="text-sm sm:text-base text-gray-600">List your vehicle for rent</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden md:inline">Step 1 of 5:</span>
          <span className="font-medium">Vehicle Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Indicator */}
        <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Form Completion</span>
              <span className="text-sm text-gray-600">3/3 sections</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>✓ Basic Info</span>
              <span>✓ Images</span>
              <span>✓ Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              Vehicle Information
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter the basic details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    setValue('type', value as any)
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
                <Select onValueChange={(value) => setValue('fuelType', value as any)}>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day (₹)</Label>
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
                <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
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
                <Label htmlFor="minimumHours">Minimum Hours</Label>
                <Input
                  id="minimumHours"
                  type="number"
                  placeholder="4"
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              Vehicle Images
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Upload high-quality images of your vehicle to attract more customers ({vehicleImages.length}/5)
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
                  placeholder="Click to upload vehicle image"
                  required={vehicleImages.length === 0}
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
                  Click on any image to remove it. Upload up to {5 - vehicleImages.length} more images.
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
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Vehicle Listing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  List My Vehicle
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
