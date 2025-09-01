"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, Globe, Mail, CreditCard, Shield, Palette, FileText, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsClientPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure global settings for the Farm Marketplace application</p>
      </div>

      <SettingsTabs />
    </div>
  )
}

function SettingsTabs() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your system settings have been updated successfully.",
      variant: "success",
    })
  }

  const handleReset = () => {
    toast({
      title: "Settings reset",
      description: "Settings have been reset to default values.",
      variant: "default",
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList className="grid grid-cols-5 w-fit">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} size="sm" disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <TabsContent value="general" className="space-y-6">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="email" className="space-y-6">
        <EmailSettings />
      </TabsContent>

      <TabsContent value="payment" className="space-y-6">
        <PaymentSettings />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <AdvancedSettings />
      </TabsContent>
    </Tabs>
  )
}

function GeneralSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic information about your marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Farm Marketplace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL</Label>
              <Input id="site-url" defaultValue="https://farm-marketplace.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              defaultValue="A marketplace for farmers to sell their products and rent equipment"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" defaultValue="admin@farm-marketplace.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" defaultValue="support@farm-marketplace.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Default Timezone</Label>
            <Select defaultValue="asia-tokyo">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                <SelectItem value="america-new_york">America/New_York (GMT-5)</SelectItem>
                <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                <SelectItem value="australia-sydney">Australia/Sydney (GMT+11)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration & Access</CardTitle>
          <CardDescription>Control user registration and access settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-registration">Allow User Registration</Label>
              <p className="text-sm text-muted-foreground">Enable or disable new user registrations</p>
            </div>
            <Switch id="allow-registration" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-verification">Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">Users must verify their email before accessing the site</p>
            </div>
            <Switch id="email-verification" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="store-approval">Require Store Approval</Label>
              <p className="text-sm text-muted-foreground">New store registrations require admin approval</p>
            </div>
            <Switch id="store-approval" defaultChecked />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="default-role">Default User Role</Label>
            <Select defaultValue="customer">
              <SelectTrigger id="default-role">
                <SelectValue placeholder="Select default role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="both">Customer & Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
          <CardDescription>Configure location and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-country">Default Country</Label>
            <Select defaultValue="jp">
              <SelectTrigger id="default-country">
                <SelectValue placeholder="Select default country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-language">Default Language</Label>
            <Select defaultValue="ja">
              <SelectTrigger id="default-language">
                <SelectValue placeholder="Select default language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select defaultValue="jpy">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select default currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpy">Japanese Yen (¥)</SelectItem>
                <SelectItem value="usd">US Dollar ($)</SelectItem>
                <SelectItem value="eur">Euro (€)</SelectItem>
                <SelectItem value="gbp">British Pound (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="distance-unit">Distance Unit</Label>
              <p className="text-sm text-muted-foreground">Unit used for displaying distances</p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="km" className="cursor-pointer">
                km
              </Label>
              <Switch id="distance-unit" defaultChecked />
              <Label htmlFor="mi" className="cursor-pointer">
                mi
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function AppearanceSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the appearance of your marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-scheme">Color Scheme</Label>
            <Select defaultValue="green">
              <SelectTrigger id="color-scheme">
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green (Default)</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex">
                <Input id="primary-color" defaultValue="#16A34A" />
                <div className="w-10 h-10 ml-2 rounded border bg-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex">
                <Input id="secondary-color" defaultValue="#84CC16" />
                <div className="w-10 h-10 ml-2 rounded border bg-lime-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex">
                <Input id="accent-color" defaultValue="#F59E0B" />
                <div className="w-10 h-10 ml-2 rounded border bg-amber-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
            </div>
            <Switch id="dark-mode" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="seasonal-themes">Seasonal Themes</Label>
              <p className="text-sm text-muted-foreground">Enable automatic seasonal themes</p>
            </div>
            <Switch id="seasonal-themes" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
          <CardDescription>Configure the layout of your marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homepage-layout">Homepage Layout</Label>
            <Select defaultValue="grid">
              <SelectTrigger id="homepage-layout">
                <SelectValue placeholder="Select homepage layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid (Default)</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="featured">Featured Slider + Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="products-per-page">Products Per Page</Label>
            <Select defaultValue="20">
              <SelectTrigger id="products-per-page">
                <SelectValue placeholder="Select number of products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="36">36</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-breadcrumbs">Show Breadcrumbs</Label>
              <p className="text-sm text-muted-foreground">Display breadcrumb navigation on pages</p>
            </div>
            <Switch id="show-breadcrumbs" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sticky-header">Sticky Header</Label>
              <p className="text-sm text-muted-foreground">Keep header visible when scrolling</p>
            </div>
            <Switch id="sticky-header" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="infinite-scroll">Infinite Scroll</Label>
              <p className="text-sm text-muted-foreground">Use infinite scroll instead of pagination</p>
            </div>
            <Switch id="infinite-scroll" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo & Favicon</CardTitle>
          <CardDescription>Upload your marketplace logo and favicon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Site Logo</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-4">
                <div className="w-48 h-16 bg-muted rounded flex items-center justify-center">
                  <img src="/placeholder.svg?height=64&width=192" alt="Current logo" className="max-h-16" />
                </div>
                <Button variant="outline" size="sm">
                  Upload New Logo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Recommended size: 192×64px. PNG or SVG format.</p>
            </div>

            <div className="space-y-4">
              <Label>Favicon</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <img src="/placeholder.svg?height=32&width=32" alt="Current favicon" className="w-8 h-8" />
                </div>
                <Button variant="outline" size="sm">
                  Upload New Favicon
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Recommended size: 32×32px. PNG or ICO format.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function EmailSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email Provider</CardTitle>
          <CardDescription>Configure your email service provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-provider">Email Service</Label>
            <Select defaultValue="smtp">
              <SelectTrigger id="email-provider">
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP Server</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailchimp">Mailchimp</SelectItem>
                <SelectItem value="ses">Amazon SES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" defaultValue="587" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input id="smtp-username" defaultValue="username@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="smtp-encryption">Use Encryption (TLS/SSL)</Label>
              <p className="text-sm text-muted-foreground">Enable secure connection for email sending</p>
            </div>
            <Switch id="smtp-encryption" defaultChecked />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Configure email templates for various notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-template">Select Template</Label>
            <Select defaultValue="welcome">
              <SelectTrigger id="email-template">
                <SelectValue placeholder="Select email template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="password-reset">Password Reset</SelectItem>
                <SelectItem value="order-confirmation">Order Confirmation</SelectItem>
                <SelectItem value="store-approval">Store Approval</SelectItem>
                <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-subject">Email Subject</Label>
            <Input id="email-subject" defaultValue="Welcome to Farm Marketplace!" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-content">Email Content</Label>
            <Textarea
              id="email-content"
              rows={10}
              defaultValue={`<h1>Welcome to Farm Marketplace!</h1>
<p>Dear {{user.name}},</p>
<p>Thank you for joining Farm Marketplace. We're excited to have you as part of our community!</p>
<p>With your new account, you can:</p>
<ul>
  <li>Browse and purchase fresh farm products</li>
  <li>Rent farming equipment</li>
  <li>Connect with local farmers</li>
</ul>
<p>If you have any questions, please don't hesitate to contact our support team.</p>
<p>Happy farming!</p>
<p>The Farm Marketplace Team</p>`}
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Available Variables</AlertTitle>
            <AlertDescription>
              You can use these variables in your template:{" "}
              {`{{user.name}}, {{user.email}}, {{site.name}}, {{site.url}}`}
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button variant="outline" size="sm">
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure which emails are sent to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="welcome-email">Welcome Email</Label>
              <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
            </div>
            <Switch id="welcome-email" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-emails">Order Notifications</Label>
              <p className="text-sm text-muted-foreground">Send emails for order status updates</p>
            </div>
            <Switch id="order-emails" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Send promotional emails and newsletters</p>
            </div>
            <Switch id="marketing-emails" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="admin-notifications">Admin Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to admin for new registrations and orders
              </p>
            </div>
            <Switch id="admin-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function PaymentSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
          <CardDescription>Configure payment methods for your marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <img src="/placeholder.svg?height=32&width=48" alt="Stripe" className="max-h-6" />
              </div>
              <div>
                <h4 className="font-medium">Stripe</h4>
                <p className="text-sm text-muted-foreground">Credit/debit cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <Switch id="stripe-enabled" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <img src="/placeholder.svg?height=32&width=48" alt="PayPal" className="max-h-6" />
              </div>
              <div>
                <h4 className="font-medium">PayPal</h4>
                <p className="text-sm text-muted-foreground">PayPal account, credit/debit cards</p>
              </div>
            </div>
            <Switch id="paypal-enabled" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <img src="/placeholder.svg?height=32&width=48" alt="Bank Transfer" className="max-h-6" />
              </div>
              <div>
                <h4 className="font-medium">Bank Transfer</h4>
                <p className="text-sm text-muted-foreground">Direct bank transfer</p>
              </div>
            </div>
            <Switch id="bank-enabled" />
          </div>

          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <img src="/placeholder.svg?height=32&width=48" alt="Cash on Delivery" className="max-h-6" />
              </div>
              <div>
                <h4 className="font-medium">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground">Pay when receiving products</p>
              </div>
            </div>
            <Switch id="cod-enabled" />
          </div>

          <Button variant="outline" size="sm" className="mt-2">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>Configure your Stripe payment gateway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-public-key">Publishable Key</Label>
              <Input id="stripe-public-key" defaultValue="pk_test_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">Secret Key</Label>
              <Input id="stripe-secret-key" type="password" defaultValue="sk_test_..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
            <Input id="stripe-webhook-secret" type="password" defaultValue="whsec_..." />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stripe-test-mode">Test Mode</Label>
              <p className="text-sm text-muted-foreground">Use Stripe in test mode</p>
            </div>
            <Switch id="stripe-test-mode" defaultChecked />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Settings</CardTitle>
          <CardDescription>Configure marketplace commission rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commission-type">Commission Type</Label>
            <Select defaultValue="percentage">
              <SelectTrigger id="commission-type">
                <SelectValue placeholder="Select commission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="mixed">Mixed (% + Fixed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission-rate">Commission Rate (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-commission">Minimum Commission (¥)</Label>
              <Input id="min-commission" type="number" defaultValue="100" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payout-schedule">Payout Schedule</Label>
            <Select defaultValue="monthly">
              <SelectTrigger id="payout-schedule">
                <SelectValue placeholder="Select payout schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-payout">Automatic Payouts</Label>
              <p className="text-sm text-muted-foreground">Process payouts automatically on schedule</p>
            </div>
            <Switch id="auto-payout" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function AdvancedSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security options for your marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Switch id="two-factor" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="password-policy">Strong Password Policy</Label>
              <p className="text-sm text-muted-foreground">Require complex passwords for all users</p>
            </div>
            <Switch id="password-policy" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
            </div>
            <Switch id="session-timeout" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
            <Select defaultValue="30">
              <SelectTrigger id="timeout-duration">
                <SelectValue placeholder="Select timeout duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-attempts">Max Login Attempts</Label>
            <Select defaultValue="5">
              <SelectTrigger id="login-attempts">
                <SelectValue placeholder="Select max attempts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 attempts</SelectItem>
                <SelectItem value="5">5 attempts</SelectItem>
                <SelectItem value="10">10 attempts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API & Integrations</CardTitle>
          <CardDescription>Manage API access and third-party integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="api-access">Enable API Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow external applications to access your marketplace data
              </p>
            </div>
            <Switch id="api-access" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex">
              <Input id="api-key" defaultValue="farm_api_12345678" readOnly className="flex-1" />
              <Button variant="outline" size="sm" className="ml-2">
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this key secret. Do not share it in public repositories or client-side code.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Active Integrations</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <img src="/placeholder.svg?height=32&width=32" alt="Google Analytics" className="max-h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">Google Analytics</h4>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <img src="/placeholder.svg?height=32&width=32" alt="Facebook Pixel" className="max-h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">Facebook Pixel</h4>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <img src="/placeholder.svg?height=32&width=32" alt="Mailchimp" className="max-h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mailchimp</h4>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Add New Integration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Maintenance</CardTitle>
          <CardDescription>Manage system maintenance and optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cache Management</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Clear Cache
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Rebuild Index
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Optimize Database
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Put site in maintenance mode (only admins can access)</p>
              <Switch id="maintenance-mode" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              rows={3}
              defaultValue="We're currently performing scheduled maintenance. Please check back soon!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-level">Log Level</Label>
            <Select defaultValue="error">
              <SelectTrigger id="log-level">
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug (Verbose)</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View Logs
            </Button>
            <Button variant="destructive" size="sm">
              Reset System
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
