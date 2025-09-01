import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"

export default function SellerRegistrationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Become a Seller</h1>
              <p className="text-gray-500 mt-2">Start selling your products on Nanbakadai marketplace</p>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Business Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" placeholder="Your Farm or Business Name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <select id="businessType" className="w-full border border-gray-300 rounded-md px-3 py-2" required>
                    <option value="">Select business type</option>
                    <option value="farm">Farm</option>
                    <option value="producer">Food Producer</option>
                    <option value="artisan">Artisan/Craftsperson</option>
                    <option value="retailer">Retailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your business, products, and farming practices..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address including city, state, and zip code"
                    rows={3}
                    required
                  />
                </div>

                {/* Store Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="storeLogo">Store Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            type="file"
                            id="storeLogo"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Drag and drop or click to upload</p>
                        <p className="text-xs">PNG, JPG or GIF (max. 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Banner Upload */}
                <div className="space-y-2">
                  <Label htmlFor="storeBanner">Store Banner</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            type="file"
                            id="storeBanner"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Upload a banner image for your store (recommended size: 1200×300px)</p>
                        <p className="text-xs">PNG, JPG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Product Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="productCategories">Product Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Handmade", "Organic", "Seasonal"].map(
                      (category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                            {category}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe the products you plan to sell..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Terms & Conditions</h2>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Seller Agreement
                    </a>
                    . I confirm that all information provided is accurate and complete.
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
