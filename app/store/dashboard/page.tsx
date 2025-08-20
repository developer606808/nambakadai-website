"use client";

import MainLayout from "@/components/main-layout";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreDashboardPage() {
  const { user, isAuthenticated } = useAuthRedux();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !user?.store) {
      // If logged in but no store, redirect to create store page
      router.push("/store/create");
    } else if (!isAuthenticated) {
      // If not logged in, redirect to login page
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!user?.store) {
    // Render a loading state or null while redirecting
    return (
      <MainLayout>
        <div className="container mx-auto py-12 text-center">
          <p>Loading store information or redirecting...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">{user.store.name} Dashboard</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg mb-4">Welcome to your store dashboard, {user.name}!</p>
          <p className="text-gray-700">Description: {user.store.description}</p>
          {/* Add more dashboard content here */}
        </div>
      </div>
    </MainLayout>
  );
}