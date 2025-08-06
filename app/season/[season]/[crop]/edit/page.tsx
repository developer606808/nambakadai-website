"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MainLayout from "@/components/main-layout"
import { toast } from "@/hooks/use-toast"

const cropFormSchema = z.object({
  name: z.string().min(2, {
    message: "Crop name must be at least 2 characters.",
  }),
  days: z.string().refine((val) => !isNaN(Number.parseInt(val)), {
    message: "Days must be a valid number.",
  }),
  seedQuantity: z.string().min(2, {
    message: "Seed quantity information is required.",
  }),
  fertilizer: z.string().min(10, {
    message: "Fertilizer information must be at least 10 characters.",
  }),
  manpower: z.string().min(10, {
    message: "Manpower information must be at least 10 characters.",
  }),
  techniques: z.string().min(10, {
    message: "Techniques information must be at least 10 characters.",
  }),
  image: z.string().optional(),
})

type CropFormValues = z.infer<typeof cropFormSchema>

export default function EditCropPage({ params }: { params: { season: string; crop: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const season = params.season.charAt(0).toUpperCase() + params.season.slice(1)
  const crop = params.crop.charAt(0).toUpperCase() + params.crop.slice(1)

  // Mock data for crop details
  const cropDetails = {
    name: crop,
    days: "120",
    rating: 4.8,
    reviews: 2,
    farmer: "Arun",
    seedQuantity: "25-30 kg per acre",
    fertilizer:
      "Apply farmyard manure @ 12.5 t/ha as basal along with 50 kg of Azospirillum and 50 kg of Phosphobacteria. Apply NPK as per soil test recommendations. If soil test is not done, follow blanket recommendation of 120:40:40 kg NPK/ha.",
    manpower:
      "Requires significant labor for planting, weeding, and harvesting. Approximately 50-60 person-days per hectare.",
    techniques:
      "System of Rice Intensification (SRI), Direct Seeding, Transplanting, Organic Farming methods can be used. Water management is crucial for rice cultivation.",
    image: "/placeholder.svg?height=400&width=600",
  }

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: cropDetails.name,
      days: cropDetails.days,
      seedQuantity: cropDetails.seedQuantity,
      fertilizer: cropDetails.fertilizer,
      manpower: cropDetails.manpower,
      techniques: cropDetails.techniques,
      image: cropDetails.image,
    },
  })

  async function onSubmit(data: CropFormValues) {
    setIsLoading(true)

    try {
      // In a real app, you would send this data to your API
      console.log("Updating crop with data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Crop updated",
        description: "Your crop information has been successfully updated.",
      })

      // Redirect back to crop details page
      router.push(`/season/${params.season}/${params.crop}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update crop information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            href={`/season/${params.season}/${params.crop}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {crop}
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Crop: {crop}</h1>
          <p className="text-gray-600 mb-6">Season: {season}</p>

          <div className="bg-white p-6 rounded-lg border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter crop name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growth Days</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter number of days" {...field} />
                      </FormControl>
                      <FormDescription>The number of days required for the crop to grow.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seedQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seed Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter seed quantity information" {...field} />
                      </FormControl>
                      <FormDescription>Recommended seed quantity per acre/hectare.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fertilizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fertilizer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter fertilizer information" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>Recommended fertilizer types and application methods.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manpower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manpower</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter manpower requirements" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>Labor requirements for planting, maintenance, and harvesting.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="techniques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Techniques</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter farming techniques" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>Recommended farming techniques and best practices.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Link href={`/season/${params.season}/${params.crop}`}>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
