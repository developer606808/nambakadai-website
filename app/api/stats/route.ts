import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, this data would come from your database or analytics service
    const stats = [
      { label: "Active Farmers", value: "10,000+", icon: "Users", color: "from-green-400 to-emerald-500" },
      { label: "Quality Products", value: "50,000+", icon: "Award", color: "from-blue-400 to-cyan-500" },
      { label: "Cities Covered", value: "100+", icon: "MapPin", color: "from-purple-400 to-pink-500" },
      { label: "Happy Customers", value: "25,000+", icon: "TrendingUp", color: "from-orange-400 to-red-500" }
    ];
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
