import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const featuredProducts = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    title: "Fresh Organic Apples",
    price: 3.99,
    unit: "per pound",
    rating: 4.5,
    reviews: 128,
    location: "Oakland, CA",
    seller: "Green Valley Farms",
    sellerId: "1",
    isOrganic: true,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    title: "Heirloom Tomatoes",
    price: 4.99,
    unit: "per lb",
    rating: 4.7,
    reviews: 86,
    location: "Berkeley, CA",
    seller: "Miller's Garden",
    sellerId: "2",
    isBestSeller: true,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=200",
    title: "Organic Strawberries",
    price: 5.99,
    unit: "per box",
    rating: 4.8,
    reviews: 152,
    location: "Santa Cruz, CA",
    seller: "Berry Farm",
    sellerId: "3",
    isOrganic: true,
    isBestSeller: true,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=200",
    title: "Fresh Farm Eggs",
    price: 6.99,
    unit: "per dozen",
    rating: 4.9,
    reviews: 210,
    location: "Palo Alto, CA",
    seller: "Happy Hens Farm",
    sellerId: "4",
    isOrganic: true,
  },
];

export async function GET() {
  return NextResponse.json(featuredProducts);
}