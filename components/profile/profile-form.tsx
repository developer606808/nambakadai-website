"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  avatar: string | null
  role: string
  isVerified: boolean
  joinDate: string
  stats: {
    productsCount: number
    storesCount: number
    wishlistCount: number
  }
}

interface ProfileFormData {
  name: string
  phone: string
}

interface ProfileFormProps {
  user: UserProfile
  formData: ProfileFormData
  onFormChange: (field: keyof ProfileFormData, value: string) => void
  onSubmit: () => void
  updating: boolean
  phoneError?: string
}

export function ProfileForm({ user, formData, onFormChange, onSubmit, updating, phoneError }: ProfileFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
            <span>Full Name</span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
            <span>Email Address</span>
            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="h-12 text-base bg-gray-50 border-gray-200 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Email cannot be changed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
            <span>Phone Number</span>
            <span className="text-gray-400 ml-1">(optional)</span>
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className={`h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              phoneError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
            }`}
          />
          {phoneError && (
            <div className="flex items-center space-x-1 text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium">{phoneError}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center">
            <span>Member Since</span>
            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Label>
          <Input
            value={user.joinDate}
            disabled
            className="h-12 text-base bg-gray-50 border-gray-200 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button
          onClick={onSubmit}
          disabled={updating}
          className="h-12 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
        >
          {updating ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}