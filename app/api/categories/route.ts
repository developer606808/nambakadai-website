import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const categories = [
  { id: 1, name: "Fruits", icon: "🍎", bgColor: "bg-red-50", slug: "fruits" },
  { id: 2, name: "Vegetables", icon: "🥦", bgColor: "bg-green-50", slug: "vegetables" },
  { id: 3, name: "Organic Produce", icon: "🌱", bgColor: "bg-emerald-50", slug: "organic" },
  { id: 4, name: "Plants", icon: "🌾", bgColor: "bg-teal-50", slug: "plants" },
  { id: 5, name: "Milk", icon: "🍯", bgColor: "bg-yellow-50", slug: "dairy" },
  { id: 6, name: "Grains", icon: "🌽", bgColor: "bg-amber-50", slug: "grains" },
  { id: 7, name: "Seeds", icon: "🌰", bgColor: "bg-orange-50", slug: "seeds" },
  { id: 8, name: "Dairy Products", icon: "🥛", bgColor: "bg-blue-50", slug: "dairy" },
  { id: 9, name: "Homemade", icon: "🍲", bgColor: "bg-rose-50", slug: "homemade" },
  { id: 10, name: "Handmade", icon: "🧶", bgColor: "bg-purple-50", slug: "handmade" },
];

export async function GET() {
  return NextResponse.json(categories);
}