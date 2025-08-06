"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, X } from "lucide-react"

interface AvatarUploadProps {
  initialImage?: string
  onImageChange?: (file: File) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function AvatarUpload({
  initialImage = "/placeholder.svg?height=100&width=100",
  onImageChange,
  size = "md",
  className = "",
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onImageChange) {
      onImageChange(file)
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className} group`}>
      <Image src={preview || initialImage} alt="Avatar" fill className="rounded-full object-cover" />

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-gray-700" />
            </div>
          </label>

          {preview && (
            <button
              onClick={handleRemoveImage}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}
