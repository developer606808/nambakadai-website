"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"

interface BannerUploadProps {
  initialImage?: string | null
  onImageChange?: (file: File) => void
  aspectRatio?: "16:9" | "21:9" | "4:1" | "3:1"
  className?: string
}

export default function BannerUpload({
  initialImage = null,
  onImageChange,
  aspectRatio = "3:1",
  className = "",
}: BannerUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClasses = {
    "16:9": "pt-[56.25%]", // 16:9
    "21:9": "pt-[42.85%]", // 21:9
    "4:1": "pt-[25%]", // 4:1
    "3:1": "pt-[33.33%]", // 3:1
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
    <div className={`relative w-full ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {preview ? (
        <>
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <Image src={preview || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
          </div>
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleRemoveImage}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Click or drag to upload banner</p>
            <p className="text-xs text-gray-400">Recommended size: 1200×400px</p>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}
