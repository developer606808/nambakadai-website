"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Store, ArrowLeft, User, Phone, Mail, Globe, MapPin, FileText, Image as ImageIcon, XCircle, Shield } from "lucide-react"
import Link from "next/link"
import { storeFormSchema } from "@/lib/validations/schemas"
import type { z } from "zod"

type StoreFormData = z.infer<typeof storeFormSchema>

export default function CreateStorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null)

  // Character count states
  const [charCounts, setCharCounts] = useState({
    name: 0,
    contactName: 0,
    description: 0,
    address: 0,
    phone: 0,
    email: 0,
    website: 0
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      contactName: '',
      description: '',
      address: '',
      stateId: undefined,
      cityId: undefined,
      pincode: '',
      phone: '',
      email: '',
      website: '',
      acceptTerms: false
    }
  })

  // Redirect if user already has a store
  useEffect(() => {
    if (session?.user?.hasStore) {
      router.push("/seller/dashboard");
    }
  }, [session]);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        if (response.ok) {
          const data = await response.json();
          setStates(data.states);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedStateId) {
        setCities([]);
        return;
      }

      try {
        const response = await fetch(`/api/cities?stateId=${selectedStateId}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data.cities);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [selectedStateId]);

  // Redirect if not logged in
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session?.user) {
    router.push("/login")
    return null
  }

  // Handle state selection
  const handleStateChange = (stateId: number) => {
    setSelectedStateId(stateId);
    setValue('stateId', stateId);
    // Reset city selection when state changes
    setCities([]);
    clearErrors('stateId');
    clearErrors('cityId');
  };

  // Handle city selection
  const handleCityChange = (cityId: number) => {
    setValue('cityId', cityId);
    clearErrors('cityId');
  };

  // Handle character count updates
  const updateCharCount = (field: keyof typeof charCounts, value: string) => {
    setCharCounts(prev => ({
      ...prev,
      [field]: value.length
    }));
  };

  // Image upload handlers
  const handleLogoChange = (imageUrl: string, imageFile: File) => {
    setLogoPreview(imageUrl)
    setLogoFile(imageFile)
    setValue('logo', imageUrl)
    clearErrors('logo')
  }

  const handleBannerChange = (imageUrl: string, imageFile: File) => {
    setBannerPreview(imageUrl)
    setBannerFile(imageFile)
    setValue('banner', imageUrl)
    clearErrors('banner')
  }

  const handleLogoRemove = () => {
    setLogoPreview('')
    setLogoFile(null)
    setValue('logo', '')
  }

  const handleBannerRemove = () => {
    setBannerPreview('')
    setBannerFile(null)
    setValue('banner', '')
  }

  // Upload image to server
  const uploadImage = async (file: File, type: 'logo' | 'banner'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload/store-images', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload image')
    }

    const result = await response.json()
    return result.url
  }

  const onSubmit = async (data: StoreFormData) => {
    setIsLoading(true)
    clearErrors()

    try {
      // Upload images if they exist
      let logoUrl = ''
      let bannerUrl = ''

      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logo')
      }

      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banner')
      }

      // Prepare store data (exclude acceptTerms from API call)
      const { acceptTerms, ...storeFields } = data
      const storeData = {
        ...storeFields,
        logo: logoUrl,
        banner: bannerUrl,
      }

      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof StoreFormData, {
              type: 'server',
              message: message as string
            })
          })
          return
        }
        throw new Error(result.error || 'Failed to create store')
      }

      toast({
        title: "Store created successfully!",
        description: "Your store has been created. You can now start adding products.",
      })

      // Refresh session to update store status
      window.location.href = "/seller/dashboard"
    } catch (error) {
      console.error('Store creation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create store",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Create Your Store</CardTitle>
            <CardDescription>
              Set up your store and start selling to customers in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Store Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Store Name *
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Enter your store name"
                    maxLength={100}
                    {...register('name', {
                      onChange: (e) => updateCharCount('name', e.target.value)
                    })}
                    className={`pr-16 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {charCounts.name}/100
                  </div>
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="contactName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Person Name *
                </Label>
                <div className="relative">
                  <Input
                    id="contactName"
                    placeholder="Enter contact person's full name"
                    maxLength={50}
                    {...register('contactName', {
                      onChange: (e) => updateCharCount('contactName', e.target.value)
                    })}
                    className={`pr-16 ${errors.contactName ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {charCounts.contactName}/50
                  </div>
                </div>
                {errors.contactName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              {/* Store Images */}
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Store Images
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Store Logo (Optional)</Label>
                      <ImageUpload
                        onImageChange={handleLogoChange}
                        onRemove={handleLogoRemove}
                        currentImage={logoPreview}
                        aspectRatio={1}
                        cropShape="round"
                        maxSize={2}
                        placeholder="Upload store logo"
                        className="h-48"
                      />
                      <p className="text-xs text-gray-500">
                        Square logo recommended. Will be displayed as circular.
                      </p>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Store Banner (Optional)</Label>
                      <ImageUpload
                        onImageChange={handleBannerChange}
                        onRemove={handleBannerRemove}
                        currentImage={bannerPreview}
                        aspectRatio={16/9}
                        cropShape="rect"
                        maxSize={5}
                        placeholder="Upload store banner"
                        className="h-48"
                      />
                      <p className="text-xs text-gray-500">
                        16:9 aspect ratio recommended for best display.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Store Description
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Describe what your store sells, your specialties, and what makes you unique..."
                    rows={4}
                    maxLength={500}
                    {...register('description', {
                      onChange: (e) => updateCharCount('description', e.target.value)
                    })}
                    className={`pr-20 ${errors.description ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                    {charCounts.description}/500
                  </div>
                </div>
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  A good description helps customers understand what you offer.
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Store Address
                </Label>
                <div className="relative">
                  <Textarea
                    id="address"
                    placeholder="Enter your complete store address"
                    rows={3}
                    maxLength={200}
                    {...register('address', {
                      onChange: (e) => updateCharCount('address', e.target.value)
                    })}
                    className={`pr-20 ${errors.address ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                    {charCounts.address}/200
                  </div>
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    State *
                  </Label>
                  <select
                    id="state"
                    value={watch('stateId') || ''}
                    onChange={(e) => handleStateChange(parseInt(e.target.value))}
                    className={`w-full border rounded-md px-3 py-2 bg-white ${errors.stateId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name_en}
                      </option>
                    ))}
                  </select>
                  {errors.stateId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.stateId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City *
                  </Label>
                  <select
                    id="city"
                    value={watch('cityId') || ''}
                    onChange={(e) => handleCityChange(parseInt(e.target.value))}
                    disabled={!selectedStateId || cities.length === 0}
                    className={`w-full border rounded-md px-3 py-2 bg-white ${errors.cityId ? 'border-red-500' : 'border-gray-300'} ${!selectedStateId || cities.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">
                      {selectedStateId ? (cities.length === 0 ? 'Loading cities...' : 'Select City') : 'Select State first'}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name_en}
                      </option>
                    ))}
                  </select>
                  {errors.cityId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.cityId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    {...register('pincode')}
                    className={errors.pincode ? 'border-red-500' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errors.pincode.message}
                    </p>
                  )}
                  {!errors.pincode && (
                    <p className="text-xs text-gray-500">
                      6-digit postal code
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
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
                      <XCircle className="w-3 h-3" />
                      {errors.phone.message}
                    </p>
                  )}
                  {!errors.phone && (
                    <p className="text-xs text-gray-500">
                      Indian mobile number (10 digits starting with 6-9)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Store Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="store@example.com"
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
                      <XCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourstore.com"
                    maxLength={200}
                    {...register('website', {
                      onChange: (e) => updateCharCount('website', e.target.value)
                    })}
                    className={`pr-20 ${errors.website ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {charCounts.website}/200
                  </div>
                </div>
                {errors.website && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.website.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Terms and Conditions
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                    <h4 className="font-medium text-gray-900">By creating a store, you agree to:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Provide accurate and truthful information about your store and products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Comply with all local laws and regulations regarding food safety and business operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Maintain high quality standards for all products sold through the platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Respond promptly to customer inquiries and resolve any issues professionally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Pay applicable platform fees and commissions as outlined in our seller agreement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Not engage in fraudulent activities or misrepresent your products</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={watch('acceptTerms')}
                        onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
                        className={errors.acceptTerms ? 'border-red-500' : ''}
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-5 cursor-pointer">
                        I have read and agree to the{" "}
                        <Link href="/terms" className="text-green-600 hover:underline font-medium">
                          Terms of Service
                        </Link>
                        ,{" "}
                        <Link href="/privacy" className="text-green-600 hover:underline font-medium">
                          Privacy Policy
                        </Link>
                        , and{" "}
                        <Link href="/seller-agreement" className="text-green-600 hover:underline font-medium">
                          Seller Agreement
                        </Link>
                        . I understand that my store will be reviewed before being approved for public listing.
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !watch('acceptTerms')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  "Create Store"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
