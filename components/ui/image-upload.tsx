"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { ImageCropper } from './image-cropper'
import { Upload, Image as ImageIcon, X, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onImageChange: (imageUrl: string, imageFile: File) => void
  onRemove?: () => void
  currentImage?: string
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
  maxSize?: number // in MB
  className?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export function ImageUpload({
  onImageChange,
  onRemove,
  currentImage,
  aspectRatio = 1,
  cropShape = 'rect',
  maxSize = 5,
  className,
  placeholder = 'Click to upload or drag and drop',
  required = false,
  disabled = false
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file'
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed'
    }

    return null
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return

    const file = acceptedFiles[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSelectedFile(file)
    setIsCropperOpen(true)
  }, [disabled, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled
  })

  const handleCropComplete = (croppedImageUrl: string, croppedImageFile: File) => {
    onImageChange(croppedImageUrl, croppedImageFile)
    setIsCropperOpen(false)
    setSelectedFile(null)
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    setError('')
  }

  const handleEdit = () => {
    if (currentImage && selectedFile) {
      setIsCropperOpen(true)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {currentImage ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
            <img
              src={currentImage}
              alt="Uploaded image"
              className={cn(
                'w-full h-48 object-cover',
                cropShape === 'round' && 'rounded-full'
              )}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsCropperOpen(true)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {onRemove && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleRemove}
                    className="bg-red-500/90 hover:bg-red-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-red-500 bg-red-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {isDragActive ? (
                <Upload className="w-6 h-6 text-green-600" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? 'Drop the image here' : placeholder}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to {maxSize}MB
                {required && <span className="text-red-500 ml-1">*</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false)
          setSelectedFile(null)
        }}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
        aspectRatio={aspectRatio}
        cropShape={cropShape}
        title={cropShape === 'round' ? 'Crop Logo' : 'Crop Banner'}
      />
    </div>
  )
}
