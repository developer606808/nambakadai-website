"use client";

import { useEffect, useState } from "react";
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
import { motion } from "framer-motion"
import { ArrowLeft, Save, Package, Upload, XCircle } from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import { useSession } from "next-auth/react"

const productSchema = z.object({
  title: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  category: z.string()
    .min(1, 'Please select a category'),
  
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(100000, 'Price must be less than ₹1,00,000'),
  
  stock: z.number()
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock must be less than 10,000'),
  
  unit: z.string()
    .min(1, 'Please select a unit'),
  
  images: z.array(z.string())
    .min(1, 'At least one product image is required')
    .max(5, 'Maximum 5 images allowed')
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
  slug: string;
}

interface Unit {
  id: number;
  name_en: string;
  name_ta: string;
  symbol: string;
}

// Create a URL-friendly slug from a string
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  const { data: session, status } = useSession();
  const userHasStore = session?.user?.hasStore; // Check if user has a store

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      unit: '',
      images: []
    }
  })

  // Auto-generate slug when title changes
  const titleValue = watch('title');
  useEffect(() => {
    if (titleValue) {
      const generatedSlug = createSlug(titleValue);
      setValue('slug', generatedSlug);
    }
  }, [titleValue, setValue]);

  useEffect(() => {
    async function fetchCategoriesAndUnits() {
      try {
        const [categoriesRes, unitsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/units'),
        ]);

        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!unitsRes.ok) throw new Error('Failed to fetch units');

        const categoriesData = await categoriesRes.json();
        const unitsData = await unitsRes.json();

        // Handle different response structures
        const categories = categoriesData.categories || categoriesData.data || [];
        const units = unitsData.data || unitsData.units || [];

        setCategories(Array.isArray(categories) ? categories : []);
        setUnits(Array.isArray(units) ? units : []);
      } catch (error) {
        console.error('Error fetching categories or units:', error);
        toast({
          title: "Error",
          description: "Failed to load categories or units. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchCategoriesAndUnits();
  }, [toast]);

  const handleImageChange = (imageUrl: string, imageFile: File) => {
    if (productImages.length >= 5) {
      toast({
        title: "Maximum images reached",
        description: "You can upload maximum 5 images per product",
        variant: "destructive"
      })
      return
    }

    setProductImages(prev => [...prev, imageUrl])
    setImageFiles(prev => [...prev, imageFile])
    setValue('images', [...productImages, imageUrl])
    clearErrors('images')
  }

  const handleImageRemove = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index)
    const newFiles = imageFiles.filter((_, i) => i !== index)
    
    setProductImages(newImages)
    setImageFiles(newFiles)
    setValue('images', newImages)
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []
    
    for (const file of imageFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'product')

      const response = await fetch('/api/upload/product-images', {
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

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    clearErrors()

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Find selected category and unit IDs
      const selectedCategory = categories.find(cat => cat.name_en === data.category);
      const selectedUnit = units.find(u => u.name_en === data.unit);

      if (!selectedCategory) {
        toast({
          title: "Error",
          description: "Selected category not found.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!selectedUnit) {
        toast({
          title: "Error",
          description: "Selected unit not found.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Prepare product data
      const productData = {
        ...data,
        categoryId: selectedCategory.id,  // This should be a number
        unitId: selectedUnit.id,          // This should be a number
        images: imageUrls,
        price: Number(data.price),
        stock: Number(data.stock),
        slug: data.slug,
      }

      // Remove original category, unit, and slug strings as they are replaced by IDs
      delete (productData as any).category;
      delete (productData as any).unit;
      delete (productData as any).slug;

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof ProductFormData, {
              type: 'server',
              message: message as string
            })
          })
          return
        }
        // Show detailed error message from server
        const errorMessage = result.error || result.message || 'Failed to create product'
        throw new Error(errorMessage)
      }

      toast({
        title: "Product created successfully!",
        description: "Your product has been added to your store.",
      })

      router.push("/seller/products")
    } catch (error) {
      console.error('Product creation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] flex-col">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading user session...</p>
      </div>
    );
  }

  // If user is a seller but does not have a store, display a message
  if (session?.user?.role === 'SELLER' && !userHasStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">Store Required to Add Products</h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">It looks like you don't have a store associated with your seller account yet. Please create a store to start listing your products.</p>
        <Link href="/create-store">
          <Button size="lg">
            Create My Store
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Link href="/seller/products">
              <Button
                variant="outline"
                size="sm"
                className="h-12 px-4 bg-white hover:bg-gray-50 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Products</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                Add New Product
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Create a new product listing for your store with rich details
              </p>
            </div>
          </div>
        </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                Product Information
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-2">
                Enter the basic details about your product to create an attractive listing
              </CardDescription>
            </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Product Name</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register('title')}
                  className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.title.message}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="slug" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Slug</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  {...register('slug')}
                  className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.slug ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.slug && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.slug.message}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Category</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.name_en}>
                          {category.name_en}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.category.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center">
                <span>Description</span>
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product, its quality, origin, and benefits..."
                rows={4}
                {...register('description')}
                className={`text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                  errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                  <XCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.description.message}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Price (₹)</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                  className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.price ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.price && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.price.message}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="stock" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Stock Quantity</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register('stock', { valueAsNumber: true })}
                  className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.stock ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.stock && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.stock.message}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:col-span-2">
                <Label htmlFor="unit" className="text-sm font-semibold text-gray-700 flex items-center">
                  <span>Unit</span>
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('unit', value)}>
                  <SelectTrigger className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.unit ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(units) && units.length > 0 ? (
                      units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name_en}>
                          {unit.name_en} ({unit.symbol})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No units available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.unit.message}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                Product Images
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-2">
                Upload high-quality images of your product (1-5 images, max 5MB each)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              {productImages.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200 bg-gray-50 hover:bg-green-50">
                  <ImageUpload
                    onImageChange={handleImageChange}
                    aspectRatio={1}
                    cropShape="rect"
                    maxSize={5}
                    placeholder="Click to upload product image"
                    required={productImages.length === 0}
                  />
                  <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG, WebP (Max 5MB)</p>
                </div>
              )}

              {productImages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Uploaded Images ({productImages.length}/5)</h4>
                    <div className="text-sm text-gray-500">
                      {productImages.length < 5 && "Upload more images to showcase your product"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {productImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative group"
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                          onClick={() => handleImageRemove(index)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {errors.images && (
                <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300 bg-red-50 p-4 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{errors.images.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200"
        >
          <Link href="/seller/products">
            <Button
              variant="outline"
              type="button"
              className="h-12 px-8 border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Product...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Create Product</span>
              </div>
            )}
          </Button>
        </motion.div>
      </form>
      </div>
    </div>
  )
}
