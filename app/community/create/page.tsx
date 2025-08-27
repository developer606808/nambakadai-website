'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Users, Globe, Lock, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import MainLayout from '@/components/main-layout'
import Link from 'next/link'

const categories = [
  'Organic', 'Rice', 'Vegetables', 'Technology', 'Fruits', 'Sustainability',
  'Livestock', 'Aquaculture', 'Greenhouse', 'Equipment', 'Seeds', 'Fertilizers'
]

export default function CreateCommunityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    location: '',
    rules: '',
    image: null as File | null
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', formData.name)
      formData.append('description', formData.description)
      formData.append('category', formData.category)
      formData.append('privacy', formData.privacy)
      formData.append('location', formData.location)
      formData.append('rules', formData.rules)
      
      if (formData.image) {
        formData.append('image', formData.image)
      }

      const response = await fetch('/api/community', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Community Created!",
          description: "Your farming community has been successfully created.",
        })
        
        router.push('/community')
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create community. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="icon" asChild>
              <Link href="/community">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Create New Community
              </h1>
              <p className="text-gray-600">Build a space for farmers to connect and share knowledge</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Community Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Organic Farming Japan"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what your community is about..."
                          required
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Japan, Global"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Privacy Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-green-600" />
                        Privacy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={formData.privacy}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                          <RadioGroupItem value="public" id="public" />
                          <div className="flex-1">
                            <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                              <Globe className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">Public</div>
                                <div className="text-sm text-gray-500">Anyone can see and join this community</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                          <RadioGroupItem value="private" id="private" />
                          <div className="flex-1">
                            <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                              <Lock className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">Private</div>
                                <div className="text-sm text-gray-500">Only invited members can see and join</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Community Rules */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle>Community Rules (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.rules}
                        onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                        placeholder="Set guidelines for your community members..."
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Community Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-green-600" />
                        Community Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Click to upload image</p>
                            <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                          </label>
                        </div>
                        {formData.image && (
                          <p className="text-sm text-green-600">✓ Image selected: {formData.image.name}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{formData.name || 'Community Name'}</h3>
                          <p className="text-sm text-gray-600">{formData.description || 'Community description...'}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>0 members</span>
                        </div>
                        {formData.category && (
                          <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {formData.category}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.description || !formData.category}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Users className="mr-2 h-5 w-5" />
                    )}
                    {isLoading ? 'Creating...' : 'Create Community'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}