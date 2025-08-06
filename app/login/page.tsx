import type { Metadata } from "next"
import MainLayout from "@/components/main-layout"
import { LoginFormRedux } from "@/components/auth/login-form-redux"

export const metadata: Metadata = {
  title: "Login | Nanbakadai Farm Marketplace",
  description: "Sign in to your Nanbakadai account to access your profile, post ads, and connect with local farmers.",
}

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <LoginFormRedux />
        </div>
      </div>
    </MainLayout>
  )
}
