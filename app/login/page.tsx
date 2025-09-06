import type { Metadata } from "next"
import { MainLayout } from "@/components/main-layout"
import { LoginFormRedux } from "@/components/auth/login-form-redux"

export const metadata: Metadata = {
  title: "Login | Nanbakadai Farm Marketplace",
  description: "Sign in to your Nanbakadai account to access your profile, post ads, and connect with local farmers.",
}

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Nature-inspired floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/15 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/10 rounded-full animate-float-fast"></div>
          <div className="absolute top-1/3 right-10 w-28 h-28 bg-green-300/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-emerald-200/15 rounded-full animate-float-medium"></div>

          {/* Leaf patterns */}
          <div className="absolute top-16 left-1/3 text-green-300/30 text-6xl animate-sway">🌿</div>
          <div className="absolute top-32 right-1/4 text-emerald-400/25 text-5xl animate-sway-delayed">🍃</div>
          <div className="absolute bottom-40 left-16 text-teal-300/20 text-7xl animate-sway">🌱</div>
          <div className="absolute bottom-16 right-16 text-green-400/30 text-4xl animate-sway-delayed">🌾</div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-100/5 to-emerald-100/10"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <span className="text-2xl">🌾</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                Sign in to your Nanbakadai account and continue your farming journey
              </p>
            </div>

            <LoginFormRedux />

            {/* Additional Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Need help?</span>
                <a href="/contact" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors">
                  Contact Support
                </a>
              </div>
              <div className="text-xs text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
