import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star, MapPin, Phone, Calendar, Clock, Fuel, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/main-layout';
import { prisma } from '@/lib/prisma';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ params: string[] }>
}): Promise<Metadata> {
  const { params: routeParams } = await params;
  const [slug, publicKey] = routeParams || [];

  if (!slug || !publicKey) {
    return {
      title: 'Rental Not Found',
    };
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { publicKey },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    if (!vehicle) {
      return {
        title: 'Rental Not Found',
      };
    }

    return {
      title: `${vehicle.name} - Rent on Nambakadai`,
      description: vehicle.description || `Rent ${vehicle.name} on Nambakadai. Quality rental equipment from trusted providers.`,
      openGraph: {
        title: `${vehicle.name} - Rent on Nambakadai`,
        description: vehicle.description || `Rent ${vehicle.name} on Nambakadai.`,
        images: vehicle.images.length > 0 ? [vehicle.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Rental Not Found',
    };
  }
}

export default async function RentalDetailsPage({
  params
}: {
  params: Promise<{ params: string[] }>
}) {
  const { params: routeParams } = await params;
  const [slug, publicKey] = routeParams || [];

  if (!slug || !publicKey) {
    notFound();
  }

  try {
    // Fetch vehicle details
    const vehicle = await prisma.vehicle.findUnique({
      where: { publicKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        }
      }
    });

    if (!vehicle) {
      notFound();
    }

    // Calculate average rating (simplified - using vehicle.rating field)
    const avgRating = vehicle.rating || 4.5;

    return (
      <MainLayout>
        <div className="min-h-screen bg-[#f9fcf7]">
          {/* Vehicle Header */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicle Images */}
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={vehicle.images[0] || "/placeholder.svg"}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {vehicle.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {vehicle.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${vehicle.name} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {vehicle.category}
                      </Badge>
                      <Badge variant="outline" className={`${
                        vehicle.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{avgRating.toFixed(1)}</span>
                        <span className="text-gray-500">({vehicle.totalBookings} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vehicle.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                    <div className="space-y-3">
                      {vehicle.pricePerDay && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Per Day</span>
                          <span className="text-2xl font-bold text-green-600">₹{vehicle.pricePerDay}</span>
                        </div>
                      )}
                      {vehicle.pricePerHour && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Per Hour</span>
                          <span className="text-2xl font-bold text-green-600">₹{vehicle.pricePerHour}</span>
                        </div>
                      )}
                      {vehicle.minimumHours && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Minimum {vehicle.minimumHours} hours</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Specs */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Type:</span> {vehicle.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Fuel:</span> {vehicle.fuelType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Capacity:</span> {vehicle.capacity}
                        </span>
                      </div>
                      {vehicle.horsepower && (
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            <span className="font-medium">Power:</span> {vehicle.horsepower} HP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-white">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      disabled={vehicle.status !== 'AVAILABLE'}
                    >
                      {vehicle.status === 'AVAILABLE' ? 'Request to Rent' : 'Currently Unavailable'}
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      Contact Owner
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              {vehicle.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Owner Information */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Owner Information</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={vehicle.user.avatar || "/placeholder.svg"}
                      alt={vehicle.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{vehicle.user.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {vehicle.user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{vehicle.user.phone}</span>
                        </div>
                      )}
                      {vehicle.user.email && (
                        <div className="flex items-center gap-1">
                          <span>{vehicle.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Rentals */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Similar Rentals</h2>
              <Link href="/rentals">
                <Button variant="outline" className="flex items-center gap-2">
                  View All Rentals
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">More rental options coming soon!</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for similar vehicles.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    notFound();
  }
}