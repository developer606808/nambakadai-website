import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const featuredRentals = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    title: "Farm Tractor - John Deere",
    price: 150,
    unit: "per day",
    rating: 4.5,
    reviews: 32,
    location: "San Jose, CA",
    availability: 12,
    category: "Heavy Equipment",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    title: "Pickup Truck - Ford F-150",
    price: 85,
    unit: "per day",
    rating: 4.7,
    reviews: 45,
    location: "Oakland, CA",
    availability: 20,
    category: "Trucks",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=200",
    title: "Delivery Van - Transit",
    price: 95,
    unit: "per day",
    rating: 4.6,
    reviews: 38,
    location: "San Francisco, CA",
    availability: 15,
    category: "Vans",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=200",
    title: "Compact Tractor - Kubota",
    price: 120,
    unit: "per day",
    rating: 4.8,
    reviews: 28,
    location: "Fremont, CA",
    availability: 8,
    category: "Heavy Equipment",
  },
];

export async function GET() {
  return NextResponse.json(featuredRentals);
}