"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"
import { useToast } from "@/components/ui/use-toast"

export default function AddCropPage({ params }: { params: { season: string } }) {
  const [formData, setFormData] = useState({
    name: "",
    days: "",
    seedQuantity: "",
    fertilizer: "",
    manpower: "",
    techniques: "",
    description: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const season = params.season.charAt(0).toUpperCase() + params.season.slice(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Crop added successfully!",
        description: `${formData.name} has been added to ${season} season.`,
      })

      // Reset form
      setFormData({
        name: "",
        days: "",
        seedQuantity: "",
        fertilizer: "",
        manpower: "",
        techniques: "",
        description: "",
        tags: [],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add crop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            href={`/season/${params.season}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {season} Crops
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <h1 className="text-2xl font-bold">Add New Crop</h1>
              <p className="text-green-100 mt-2">Add a new crop to the {season} season</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Crop Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Rice, Wheat, Tomato"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="days">Growing Days *</Label>
                    <Input
                      id="days"
                      name="days"
                      type="number"
                      value={formData.days}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the crop..."
                    rows={3}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Cultivation Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Cultivation Details</h2>

                <div className="space-y-2">
                  <Label htmlFor="seedQuantity">Seed Quantity</Label>
                  <Textarea
                    id="seedQuantity"
                    name="seedQuantity"
                    value={formData.seedQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 25-30 kg per acre"
                    rows={2}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fertilizer">Fertilizer Requirements</Label>
                  <Textarea
                    id="fertilizer"
                    name="fertilizer"
                    value={formData.fertilizer}
                    onChange={handleInputChange}
                    placeholder="Describe fertilizer requirements and application methods..."
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manpower">Manpower Requirements</Label>
                  <Textarea
                    id="manpower"
                    name="manpower"
                    value={formData.manpower}
                    onChange={handleInputChange}
                    placeholder="Describe labor requirements for cultivation..."
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techniques">Cultivation Techniques</Label>
                  <Textarea
                    id="techniques"
                    name="techniques"
                    value={formData.techniques}
                    onChange={handleInputChange}
                    placeholder="Describe cultivation methods and techniques..."
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Tags</h2>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g., Organic, Traditional)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="hover:bg-green-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full animate-fadeIn"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-green-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Crop Image</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" className="flex-1" asChild>
                  <Link href={`/season/${params.season}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Crop...
                    </div>
                  ) : (
                    "Add Crop"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
