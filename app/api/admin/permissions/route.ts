import { NextResponse } from 'next/server';

// Define permissions
const allPermissions = [
  { id: "dashboard", name: "Dashboard", category: "General" },
  { id: "users", name: "Users Management", category: "User Management" },
  { id: "products", name: "Products Management", category: "Content Management" },
  { id: "stores", name: "Stores Management", category: "Content Management" },
  { id: "rentals", name: "Rentals Management", category: "Content Management" },
  { id: "categories", name: "Categories Management", category: "Content Management" },
  { id: "units", name: "Units Management", category: "Content Management" },
  { id: "banners", name: "Banners Management", category: "Content Management" },
  { id: "states", name: "States Management", category: "Location Management" },
  { id: "cities", name: "Cities Management", category: "Location Management" },
  { id: "roles", name: "Roles Management", category: "System Management" },
  { id: "settings", name: "System Settings", category: "System Management" },
  { id: "reports", name: "Reports", category: "Analytics" },
  { id: "analytics", name: "Analytics", category: "Analytics" },
  { id: "notifications", name: "Notifications", category: "Communication" },
  { id: "messages", name: "Messages", category: "Communication" },
  { id: "payments", name: "Payments", category: "Financial" },
];

export async function GET() {
  return NextResponse.json(allPermissions);
}
