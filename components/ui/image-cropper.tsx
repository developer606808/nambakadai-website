"use client"

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, Crop as CropIcon, X } from 'lucide-react'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
   isOpen: boolean
   onClose: () => void
   onCropComplete: (croppedImageUrl: string, croppedImageFile: File) => void
   imageFile: File | null
   imgSrc: string
   aspectRatio?: number
   cropShape?: 'rect' | 'round'
   title?: string
 }

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropper({
   isOpen,
   onClose,
   onCropComplete,
   imageFile,
   imgSrc,
   aspectRatio = 1,
   cropShape = 'rect',
   title = 'Crop Image'
 }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
  }, [aspectRatio])

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return

    setIsProcessing(true)

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No 2d context')

      const image = imgRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = completedCrop.width
      canvas.height = completedCrop.height

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      )

      return new Promise<{ url: string; file: File }>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Failed to create blob')
          
          const url = URL.createObjectURL(blob)
          const file = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now(),
          })
          
          resolve({ url, file })
        }, imageFile.type)
      })
    } catch (error) {
      console.error('Error cropping image:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [completedCrop, imageFile])

  const handleCropComplete = async () => {
    try {
      const result = await getCroppedImg()
      if (result) {
        onCropComplete(result.url, result.file)
        onClose()
      }
    } catch (error) {
      console.error('Error processing crop:', error)
    }
  }

  const handleClose = () => {
    setCrop(undefined)
    setCompletedCrop(undefined)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {imgSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                circularCrop={cropShape === 'round'}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}

          <div className="text-sm text-gray-600 text-center">
            Drag to adjust the crop area. The selected area will be used for your image.
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleCropComplete} 
            disabled={!completedCrop || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CropIcon className="w-4 h-4 mr-2" />
                Apply Crop
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
