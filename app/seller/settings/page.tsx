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
  Package
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function SellerSettings() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

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

  const handleSaveStore = () => {
    // In real app, save to API
    console.log("Saving store data:", storeData)
    setIsEditing(false)
  }

  const handleSaveProfile = () => {
    // In real app, save to API
    console.log("Saving profile data:", profileData)
    setIsEditingProfile(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={storeData.logo} />
                      <AvatarFallback>
                        <Store className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {storeData.logo && storeData.logo !== "/api/placeholder/100/100" ? (
                        <p className="text-sm text-green-600 mb-2">✓ Logo uploaded</p>
                      ) : (
                        <p className="text-sm text-gray-500 mb-2">No logo uploaded</p>
                      )}
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Logo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Store Banner</Label>
                  <div className="space-y-2">
                    <img
                      src={storeData.banner}
                      alt="Store banner"
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    {storeData.banner && storeData.banner !== "/api/placeholder/400/200" ? (
                      <p className="text-sm text-green-600">✓ Banner uploaded</p>
                    ) : (
                      <p className="text-sm text-gray-500">No banner uploaded</p>
                    )}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Banner
                      </Button>
                    )}
                  </div>
                </div>
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
                          [day]: { ...prev[day], closed: !checked }
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
                            [day]: { ...prev[day], open: e.target.value }
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
                            [day]: { ...prev[day], close: e.target.value }
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
