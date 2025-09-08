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

interface Product {
  id: number;
  publicKey: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: number;
  unitId: number;
  category: Category;
  unit: Unit;
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

export default function EditProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams?.get('id')
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [fetching, setFetching] = useState(true)

  const { data: session, status } = useSession();

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
    if (titleValue && !product) {
      const generatedSlug = createSlug(titleValue);
      setValue('slug', generatedSlug);
    }
  }, [titleValue, setValue, product]);

  // Fetch product data if editing
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const productData = await response.json();
        setProduct(productData);
        
        // Set form values
        setValue('title', productData.title);
        setValue('slug', productData.slug);
        setValue('description', productData.description);
        setValue('price', productData.price);
        setValue('stock', productData.stock);
        setValue('images', productData.images);
        
        setProductImages(productData.images);
        
        // Set category and unit
        if (productData.category) {
          setValue('category', productData.category.name_en);
        }
        if (productData.unit) {
          setValue('unit', productData.unit.name_en);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    }
    
    fetchProduct();
  }, [productId, setValue, toast]);

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
    if (!product?.publicKey) {
      toast({
        title: "Error",
        description: "Product data not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true)
    clearErrors()

    try {
      // Upload new images if any
      let imageUrls = productImages;
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages()
      }

      // Find selected category and unit IDs
      const selectedCategory = categories.find(cat => cat.name_en === data.category);
      const selectedUnit = units.find(u => u.name_en === data.unit);

      if (!selectedCategory) {
        console.error('Selected category not found:', data.category);
        console.log('Available categories:', categories.map(c => c.name_en));
        toast({
          title: "Error",
          description: "Selected category not found. Please select a valid category.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!selectedUnit) {
        console.error('Selected unit not found:', data.unit);
        console.log('Available units:', units.map(u => u.name_en));
        toast({
          title: "Error",
          description: "Selected unit not found. Please select a valid unit.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Prepare product data
      const productData = {
        ...data,
        categoryId: selectedCategory.id,
        unitId: selectedUnit.id,
        images: imageUrls,
        price: Number(data.price),
        stock: Number(data.stock),
      }


      const response = await fetch(`/api/products/${product.publicKey}`, {
        method: 'PUT',
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
        throw new Error(result.error || 'Failed to update product')
      }

      toast({
        title: "Product updated successfully!",
        description: "Your product has been updated.",
      })

      router.push("/seller/products")
    } catch (error) {
      console.error('Product update error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
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
        <p className="mt-4 text-lg text-gray-700">Loading product data...</p>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">Product Not Found</h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">No product ID was provided. Please go back and select a product to edit.</p>
        <Link href="/seller/products">
          <Button size="lg">
            Back to Products
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
          <Link href="/seller/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update your product listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Update the details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  {...register('slug')}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)} value={watch('category')}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product, its quality, origin, and benefits..."
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register('stock', { valueAsNumber: true })}
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select onValueChange={(value) => setValue('unit', value)} value={watch('unit')}>
                  <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name_en}>
                        {unit.name_en} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Product Images
            </CardTitle>
            <CardDescription>
              Upload high-quality images of your product (1-5 images)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {productImages.length < 5 && (
              <ImageUpload
                onImageChange={handleImageChange}
                aspectRatio={1}
                cropShape="rect"
                maxSize={3}
                placeholder="Upload product image"
              />
            )}

            {productImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {productImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
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
          <Link href="/seller/products">
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
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}