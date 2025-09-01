"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  Calendar,
  Settings,
  Users,
  MapPin,
  Fuel
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SellerVehicles() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast({
        title: "Error",
        description: "Failed to fetch vehicles. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const displayVehicles = vehicles

  const filteredVehicles = displayVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || vehicle.type.toLowerCase() === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      tractor: "bg-green-100 text-green-800",
      truck: "bg-blue-100 text-blue-800",
      lorry: "bg-purple-100 text-purple-800",
      van: "bg-yellow-100 text-yellow-800",
      bike: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={typeColors[type.toLowerCase()] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Vehicles</h1>
          <p className="text-gray-600 mt-1">
            Manage your vehicle rental listings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/seller/rent-vehicles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{displayVehicles.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-green-600">
                  {displayVehicles.filter(v => v.status === 'available').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {displayVehicles.reduce((sum, vehicle) => sum + (vehicle.bookings || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {displayVehicles.length > 0 
                    ? (displayVehicles.reduce((sum, vehicle) => sum + (vehicle.rating || 0), 0) / displayVehicles.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <span className="text-yellow-500 text-2xl">★</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "tractor" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("tractor")}
              >
                Tractors
              </Button>
              <Button
                variant={filterType === "truck" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("truck")}
              >
                Trucks
              </Button>
              <Button
                variant={filterType === "lorry" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("lorry")}
              >
                Lorries
              </Button>
              <Button
                variant={filterType === "van" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("van")}
              >
                Vans
              </Button>
              <Button
                variant={filterType === "bike" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("bike")}
              >
                Bikes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first vehicle for rent"}
              </p>
              <Link href="/seller/rent-vehicles/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />

                    <div className="space-y-3 px-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(vehicle.type)}
                            <span className="text-sm text-gray-500">★ {vehicle.rating}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/seller/rent-vehicles/edit?id=${vehicle.publicKey}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Vehicle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Manage Availability
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this vehicle?')) {
                                  try {
                                    const response = await fetch(`/api/vehicles/${vehicle.publicKey}`, {
                                      method: 'DELETE',
                                    });
                                    
                                    if (!response.ok) {
                                      throw new Error('Failed to delete vehicle');
                                    }
                                    
                                    // Remove vehicle from list
                                    setVehicles(vehicles.filter(v => v.id !== vehicle.id));
                                    toast({
                                      title: "Vehicle deleted",
                                      description: "The vehicle has been successfully deleted.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete vehicle. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Vehicle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">₹{vehicle.pricePerDay}</p>
                            <p className="text-xs text-gray-500">per day</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">₹{vehicle.pricePerHour}</p>
                            <p className="text-xs text-gray-500">per hour</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">★ {vehicle.rating}</p>
                          <p className="text-xs text-gray-500">{vehicle.bookings} bookings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Fuel className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.fuelType}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}