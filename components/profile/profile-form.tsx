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
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className={phoneError ? "border-red-500" : ""}
          />
          {phoneError && (
            <p className="text-xs text-red-500 mt-1">{phoneError}</p>
          )}
        </div>
        <div>
          <Label>Member Since</Label>
          <Input
            value={user.joinDate}
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={updating}
          className="bg-green-500 hover:bg-green-600"
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}