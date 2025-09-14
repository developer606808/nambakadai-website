"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  Store,
  Bell,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  Camera,
  Save,
  Edit,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Package,
  Upload,
  X
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function SellerSettings() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)

  // Initialize with current store data from session
  const [storeData, setStoreData] = useState({
    name: session?.user?.currentStore?.name || "Fresh Farm Produce",
    contactName: session?.user?.currentStore?.contactName || "Rajesh Kumar",
    description: session?.user?.currentStore?.description || "We sell fresh organic vegetables and fruits directly from our farm to your table.",
    address: session?.user?.currentStore?.address || "123 Farm Road, Village Greenfield, District Organic, State 123456",
    phone: session?.user?.currentStore?.phone || "9876543210",
    email: session?.user?.currentStore?.email || "contact@freshfarm.com",
    website: session?.user?.currentStore?.website || "https://freshfarm.com",
    logo: session?.user?.currentStore?.logo || "/api/placeholder/100/100",
    banner: session?.user?.currentStore?.banner || "/api/placeholder/400/200"
  })

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || ""
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    lowStock: true,
    weeklyReports: false,
    promotions: true
  })

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "16:00", closed: false },
    sunday: { open: "10:00", close: "14:00", closed: true }
  })

  const handleSaveStore = async () => {
    try {
      console.log("Saving store data:", storeData)

      // Save store data to API
      const storeId = session?.user?.currentStore?.id
      if (!storeId) {
        throw new Error('Store ID not found')
      }

      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: storeData.name,
          contactName: storeData.contactName,
          description: storeData.description,
          address: storeData.address,
          phone: storeData.phone,
          email: storeData.email,
          website: storeData.website,
          logo: storeData.logo,
          banner: storeData.banner,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update store')
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Store settings updated successfully",
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving store:', error)
      toast({
        title: "Error",
        description: "Failed to update store settings",
        variant: "destructive"
      })
    }
  }

  const handleSaveProfile = () => {
    // In real app, save to API
    console.log("Saving profile data:", profileData)
    setIsEditingProfile(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  // Handle logo upload
  const handleLogoUpload = async (imageUrl: string, imageFile: File) => {
    console.log('Logo upload triggered:', { imageUrl, imageFile })

    if (!session?.user?.currentStore?.id) {
      toast({
        title: "Error",
        description: "Store information not available",
        variant: "destructive"
      })
      return
    }

    setIsUploadingLogo(true)

    try {
      console.log('Uploading logo file:', imageFile.name, 'Size:', imageFile.size)

      // Upload logo to GCS
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('type', 'logo')

      const response = await fetch('/api/upload/store-images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload logo')
      }

      const result = await response.json()
      console.log('Logo upload result:', result)

      // Update store data with new logo URL
      setStoreData(prev => ({ ...prev, logo: result.url }))

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      })
    } catch (error) {
      console.error('Logo upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload logo",
        variant: "destructive"
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  // Handle banner upload
  const handleBannerUpload = async (imageUrl: string, imageFile: File) => {
    console.log('Banner upload triggered:', { imageUrl, imageFile })

    if (!session?.user?.currentStore?.id) {
      toast({
        title: "Error",
        description: "Store information not available",
        variant: "destructive"
      })
      return
    }

    setIsUploadingBanner(true)

    try {
      console.log('Uploading banner file:', imageFile.name, 'Size:', imageFile.size)

      // Upload banner to GCS
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('type', 'banner')

      const response = await fetch('/api/upload/store-images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload banner')
      }

      const result = await response.json()
      console.log('Banner upload result:', result)

      // Update store data with new banner URL
      setStoreData(prev => ({ ...prev, banner: result.url }))

      toast({
        title: "Success",
        description: "Banner uploaded successfully",
      })
    } catch (error) {
      console.error('Banner upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload banner",
        variant: "destructive"
      })
    } finally {
      setIsUploadingBanner(false)
    }
  }

  // Update store data when session loads
  useEffect(() => {
    if (session?.user?.currentStore) {
      const store = session.user.currentStore
      setStoreData({
        name: store.name || "Fresh Farm Produce",
        contactName: store.contactName || "Rajesh Kumar",
        description: store.description || "We sell fresh organic vegetables and fruits directly from our farm to your table.",
        address: store.address || "123 Farm Road, Village Greenfield, District Organic, State 123456",
        phone: store.phone || "9876543210",
        email: store.email || "contact@freshfarm.com",
        website: store.website || "https://freshfarm.com",
        logo: store.logo || "/api/placeholder/100/100",
        banner: store.banner || "/api/placeholder/400/200"
      })
    }
  }, [session])

  // Update profile data when session loads
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || ""
      })
    }
  }, [session])

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
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              Settings
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Manage your store settings and preferences with ease
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 px-4 py-2 text-sm font-medium shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Store Status: Active
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="store" className="space-y-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white p-1 shadow-lg border-2 border-gray-200 min-w-max">
                <TabsTrigger value="store" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md gap-2">
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Store</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="business" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>
            </div>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Update your store details and branding
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveStore() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Store
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Images */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Store Logo</Label>
                      {storeData.logo && storeData.logo !== "/api/placeholder/100/100" && (
                        <span className="text-sm text-green-600 font-medium">✓ Uploaded</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-200 hover:border-green-400 hover:shadow-md">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={storeData.logo} />
                        <AvatarFallback className="bg-green-100">
                          <Store className="w-10 h-10 text-green-600" />
                        </AvatarFallback>
                      </Avatar>

                      {isEditing ? (
                        <div className="w-full space-y-3">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 mb-2">Upload New Logo</p>
                            <ImageUpload
                              onImageChange={handleLogoUpload}
                              currentImage={storeData.logo !== "/api/placeholder/100/100" ? storeData.logo : undefined}
                              aspectRatio={1}
                              cropShape="round"
                              maxSize={2}
                              placeholder="Click here to select logo image"
                              disabled={isUploadingLogo}
                              className="w-full"
                            />
                          </div>
                          {isUploadingLogo && (
                            <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm font-medium">Uploading logo...</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">
                            {storeData.logo && storeData.logo !== "/api/placeholder/100/100"
                              ? "Logo uploaded successfully"
                              : "No logo uploaded yet"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Click "Edit Store" to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Store Banner</Label>
                      {storeData.banner && storeData.banner !== "/api/placeholder/400/200" && (
                        <span className="text-sm text-green-600 font-medium">✓ Uploaded</span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Current Banner Preview */}
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 shadow-sm">
                        <img
                          src={storeData.banner}
                          alt="Store banner"
                          className="w-full h-32 object-cover"
                        />
                        {(!storeData.banner || storeData.banner === "/api/placeholder/400/200") && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 bg-opacity-90">
                            <div className="text-center text-gray-600">
                              <Upload className="w-8 h-8 mx-auto mb-2 opacity-60" />
                              <p className="text-sm font-medium">No banner uploaded</p>
                              <p className="text-xs">Click "Edit Store" to upload</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Section */}
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 mb-2">Upload New Banner</p>
                            <ImageUpload
                              onImageChange={handleBannerUpload}
                              currentImage={storeData.banner !== "/api/placeholder/400/200" ? storeData.banner : undefined}
                              aspectRatio={4/1}
                              cropShape="rect"
                              maxSize={5}
                              placeholder="Click here to select banner image (4:1 ratio recommended)"
                              disabled={isUploadingBanner}
                              className="w-full"
                            />
                          </div>
                          {isUploadingBanner && (
                            <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm font-medium">Uploading banner...</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-sm font-medium text-gray-700">
                            {storeData.banner && storeData.banner !== "/api/placeholder/400/200"
                              ? "Banner uploaded successfully"
                              : "No banner uploaded yet"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Click "Edit Store" to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Instructions */}
                {isEditing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Upload Instructions</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• <strong>Logo:</strong> Square image (1:1 ratio), max 2MB, will be cropped to circle</li>
                          <li>• <strong>Banner:</strong> Wide image (4:1 ratio recommended), max 5MB, will be cropped to rectangle</li>
                          <li>• Supported formats: JPEG, PNG, WebP</li>
                          <li>• Click "Save Changes" to persist your uploads</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Store Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeData.name}
                    onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    value={storeData.contactName}
                    onChange={(e) => setStoreData(prev => ({ ...prev, contactName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  value={storeData.description}
                  onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <Textarea
                  id="address"
                  value={storeData.address}
                  onChange={(e) => setStoreData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={storeData.phone}
                    onChange={(e) => setStoreData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeData.email}
                    onChange={(e) => setStoreData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={storeData.website}
                    onChange={(e) => setStoreData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal account information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditingProfile ? "default" : "outline"}
                  onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{session?.user?.name}</h3>
                  <p className="text-sm text-gray-600">{session?.user?.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                </div>
              </div>

              {isEditingProfile && (
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about new orders and status changes</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Messages</h4>
                    <p className="text-sm text-gray-600">Receive alerts for customer messages</p>
                  </div>
                  <Switch
                    checked={notifications.newMessages}
                    onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-600">Get warned when products are running low</p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => handleNotificationChange('lowStock', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly sales and performance reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promotions & Tips</h4>
                    <p className="text-sm text-gray-600">Get marketing tips and promotional opportunities</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                  />
                </div>
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your store operating hours for customer visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <h4 className="font-medium capitalize">{day}</h4>
                    </div>
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) =>
                        setBusinessHours(prev => ({
                          ...prev,
                          [day as keyof typeof prev]: { ...prev[day as keyof typeof prev], closed: !checked }
                        }))
                      }
                    />
                  </div>
                  {!hours.closed && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setBusinessHours(prev => ({
                            ...prev,
                            [day as keyof typeof prev]: { ...prev[day as keyof typeof prev], open: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setBusinessHours(prev => ({
                            ...prev,
                            [day as keyof typeof prev]: { ...prev[day as keyof typeof prev], close: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                  {hours.closed && (
                    <Badge variant="secondary">Closed</Badge>
                  )}
                </div>
              ))}

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Update Hours
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    These actions cannot be undone
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="text-red-600 border-red-200">
                      Deactivate Store
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </motion.div>
      </div>
    </div>
  )
}
