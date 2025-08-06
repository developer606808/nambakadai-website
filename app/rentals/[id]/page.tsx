import Link from "next/link"
import { Calendar, Clock, MapPin, Share2, Star, User } from "lucide-react"
import MainLayout from "@/components/main-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LazyImage } from "@/components/ui/lazy-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

export async function generateMetadata({ params }: { params: { id: string } }) {
  // In a real app, fetch the rental data based on the ID
  const rental = {
    id: params.id,
    title: "John Deere 5075E Utility Tractor",
  }

  return {
    title: `${rental.title} | Equipment Rental | Nanbakadai`,
    description: `Rent the ${rental.title} for your farming needs. Available for daily, weekly, or monthly rental with flexible pickup options.`,
    openGraph: {
      title: `${rental.title} | Equipment Rental`,
      description: `Rent the ${rental.title} for your farming needs. Available for daily, weekly, or monthly rental with flexible pickup options.`,
      images: ["/placeholder.svg?height=630&width=1200"],
    },
  }
}

export default function RentalDetailsPage({ params }: { params: { id: string } }) {
  // Mock rental data - in a real app, fetch this based on the ID
  const rental = {
    id: params.id,
    title: "John Deere 5075E Utility Tractor",
    category: "Tractors",
    price: {
      daily: 15000,
      weekly: 90000,
      monthly: 300000,
    },
    location: "Fukuoka, Japan",
    owner: {
      name: "Tanaka Farms",
      rating: 4.9,
      reviews: 42,
      responseTime: "Within 1 hour",
      image: "/placeholder.svg?height=100&width=100",
    },
    rating: 4.8,
    reviews: 24,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800&text=Image+2",
      "/placeholder.svg?height=600&width=800&text=Image+3",
      "/placeholder.svg?height=600&width=800&text=Image+4",
      "/placeholder.svg?height=600&width=800&text=Image+5",
    ],
    available: true,
    description:
      "The John Deere 5075E utility tractor is perfect for small to medium-sized farms. With 75 horsepower and a comfortable operator station, this tractor can handle a variety of tasks from plowing to harvesting.",
    features: [
      "75 horsepower diesel engine",
      "4-wheel drive",
      "Power steering",
      "Adjustable seat",
      "Hydraulic system",
      "PTO (Power Take-Off)",
      "Drawbar and 3-point hitch",
      "Weather canopy included",
    ],
    specifications: {
      Engine: "John Deere PowerTech™ 3-cylinder diesel",
      Horsepower: "75 HP",
      Transmission: "9F/3R SyncShuttle™",
      Hydraulics: "Open center system",
      "Lift Capacity": "1,800 kg",
      "Fuel Capacity": "68 L",
      Weight: "2,900 kg",
      Dimensions: "3.6m L x 1.8m W x 2.5m H",
    },
    rentalTerms: [
      "Valid driver's license required",
      "Security deposit of ¥50,000 required",
      "Fuel not included in rental price",
      "24-hour notice required for cancellation",
      "Insurance included in rental price",
      "Delivery and pickup available for additional fee",
      "Maintenance and repairs covered by owner",
      "Renter responsible for any damage due to misuse",
    ],
    availability: {
      nextAvailable: "2023-05-25",
      bookedDates: ["2023-05-26", "2023-05-27", "2023-05-28", "2023-06-05", "2023-06-06"],
    },
  }

  // Similar rentals
  const similarRentals = [
    {
      id: 2,
      title: "Kubota L3901 Compact Tractor",
      price: 12000,
      period: "day",
      image: "/placeholder.svg?height=200&width=300&text=Kubota",
      rating: 4.7,
    },
    {
      id: 3,
      title: "Massey Ferguson 1840M",
      price: 14000,
      period: "day",
      image: "/placeholder.svg?height=200&width=300&text=Massey",
      rating: 4.6,
    },
    {
      id: 4,
      title: "New Holland Workmaster 75",
      price: 13500,
      period: "day",
      image: "/placeholder.svg?height=200&width=300&text=New+Holland",
      rating: 4.5,
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{rental.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                {rental.location}
              </div>
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{rental.rating}</span>
                <span className="ml-1">({rental.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Response time: {rental.owner.responseTime}</span>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
                <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                  <LazyImage src={rental.images[0]} alt={rental.title} fill className="object-cover" />
                </div>
                {rental.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <LazyImage src={image} alt={`${rental.title} - Image ${index + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs for details */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-gray-900 pb-2"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-gray-900 pb-2"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-gray-900 pb-2"
                >
                  Rental Terms
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-gray-900 pb-2"
                >
                  Reviews ({rental.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-4">
                <LazyLoadWrapper>
                  <p className="text-gray-700 mb-4">{rental.description}</p>

                  <h3 className="font-semibold text-lg mb-2">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {rental.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="specifications" className="pt-4">
                <LazyLoadWrapper>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(rental.specifications).map(([key, value], index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2 px-4 font-medium">{key}</td>
                            <td className="py-2 px-4">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="terms" className="pt-4">
                <LazyLoadWrapper>
                  <h3 className="font-semibold text-lg mb-2">Rental Terms & Conditions</h3>
                  <ul className="space-y-2 mb-4">
                    {rental.rentalTerms.map((term, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="text-green-500 mr-2">•</span>
                        {term}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    <h4 className="font-medium mb-1">Important Notice</h4>
                    <p className="text-sm">
                      Please read all terms carefully before renting. By proceeding with the rental, you agree to all
                      terms and conditions listed above.
                    </p>
                  </div>
                </LazyLoadWrapper>
              </TabsContent>

              <TabsContent value="reviews" className="pt-4">
                <LazyLoadWrapper>
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 text-white rounded-lg px-3 py-1 font-bold text-xl mr-2">
                      {rental.rating}
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.floor(rental.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">Based on {rental.reviews} reviews</span>
                    </div>
                  </div>

                  {/* Mock reviews */}
                  <div className="space-y-4">
                    {[
                      {
                        name: "Hiroshi T.",
                        rating: 5,
                        date: "2 weeks ago",
                        comment:
                          "Excellent tractor, well-maintained and powerful. The owner was very helpful with instructions.",
                      },
                      {
                        name: "Keiko M.",
                        rating: 4,
                        date: "1 month ago",
                        comment:
                          "Good equipment, delivered on time. Only issue was a small oil leak that was quickly fixed.",
                      },
                      {
                        name: "Takashi S.",
                        rating: 5,
                        date: "2 months ago",
                        comment: "Perfect for my small farm. Easy to operate and very fuel efficient.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="text-gray-500 text-sm">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="mt-4 w-full">
                    View All {rental.reviews} Reviews
                  </Button>
                </LazyLoadWrapper>
              </TabsContent>
            </Tabs>

            {/* Similar rentals */}
            <LazyLoadWrapper>
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Similar Equipment</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {similarRentals.map((item) => (
                    <Link
                      href={`/rentals/${item.id}`}
                      key={item.id}
                      className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative h-40">
                        <LazyImage
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="font-bold">¥{item.price.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">/{item.period}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm ml-1">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </LazyLoadWrapper>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold">¥{rental.price.daily.toLocaleString()}</span>
                  <span className="text-gray-500">/day</span>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="border-t border-b py-3 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly rate:</span>
                  <span className="font-medium">¥{rental.price.weekly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly rate:</span>
                  <span className="font-medium">¥{rental.price.monthly.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="rental-dates" className="block text-sm font-medium mb-1">
                  Rental Dates
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <input
                    type="text"
                    id="rental-dates"
                    placeholder="Select start & end dates"
                    className="w-full outline-none"
                  />
                </div>

                <label htmlFor="rental-period" className="block text-sm font-medium mb-1">
                  Rental Period
                </label>
                <select id="rental-period" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3">
                  <option value="daily">Daily (¥{rental.price.daily.toLocaleString()}/day)</option>
                  <option value="weekly">Weekly (¥{rental.price.weekly.toLocaleString()}/week)</option>
                  <option value="monthly">Monthly (¥{rental.price.monthly.toLocaleString()}/month)</option>
                </select>

                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Rental fee (3 days)</span>
                    <span>¥{(rental.price.daily * 3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service fee</span>
                    <span>¥{(rental.price.daily * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Insurance</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>¥{(rental.price.daily * 3 + rental.price.daily * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 mb-3" asChild>
                <Link href={`/rentals/${rental.id}/request`}>Request to Rent</Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/rentals/${rental.id}/contact`}>Contact Owner</Link>
              </Button>

              {/* Owner information */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center mb-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                    <LazyImage src={rental.owner.image} alt={rental.owner.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{rental.owner.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>
                        {rental.owner.rating} · {rental.owner.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Equipment rental provider since 2018. We offer well-maintained farming equipment for all your
                  agricultural needs.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
