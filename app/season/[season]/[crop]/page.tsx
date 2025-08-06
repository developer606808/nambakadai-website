import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"

export default function CropDetailsPage({ params }: { params: { season: string; crop: string } }) {
  const season = params.season.charAt(0).toUpperCase() + params.season.slice(1)
  const crop = params.crop.charAt(0).toUpperCase() + params.crop.slice(1)

  // Mock data for crop details
  const cropDetails = {
    name: crop,
    days: 120,
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
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href={`/season/${params.season}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Season - {season}
          </Link>

          <Link href={`/season/${params.season}/${params.crop}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit Crop
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg border">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt={cropDetails.name}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(cropDetails.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2">{cropDetails.rating}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{cropDetails.reviews} Comments</span>
              <div className="ml-auto flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                by {cropDetails.farmer}
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{cropDetails.name}</h1>
            <p className="text-gray-600 mb-6">{cropDetails.days} days</p>

            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Crop Details</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-3">Seed Quantity</h2>
                  <p className="text-gray-700">{cropDetails.seedQuantity}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-3">Fertilizer</h2>
                  <p className="text-gray-700">{cropDetails.fertilizer}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-3">Manpower</h2>
                  <p className="text-gray-700">{cropDetails.manpower}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-3">Techniques</h2>
                  <p className="text-gray-700">{cropDetails.techniques}</p>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="bg-white p-6 rounded-lg border">
                  <p className="text-gray-500 italic">No comments yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
