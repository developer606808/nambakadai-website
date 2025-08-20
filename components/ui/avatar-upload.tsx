"use client"

import React, { useState, useRef } from "react"
import ReactCrop, { Crop, PixelCrop, PercentCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface AvatarUploadProps {
  initialImage?: string | null
  onImageUpload: (file: File) => void
}

export default function AvatarUpload({ initialImage, onImageUpload }: AvatarUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop start from scratch if an image was already loaded
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null)
        setDialogOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget
    const { width, height } = e.currentTarget
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    })
  }

  const getCroppedImg = async (): Promise<File | null> => {
    if (imgRef.current && completedCrop) {
      const image = imgRef.current
      const canvas = document.createElement("canvas")
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = completedCrop.width
      canvas.height = completedCrop.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("No 2d context")
      }

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      )

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "cropped-image.png", { type: "image/png" })
            resolve(file)
          } else {
            resolve(null)
          }
        }, "image/png")
      })
    }
    return null
  }

  const handleCropComplete = async () => {
    const croppedFile = await getCroppedImg()
    if (croppedFile) {
      onImageUpload(croppedFile)
      setImageSrc(URL.createObjectURL(croppedFile))
      setDialogOpen(false)
    }
  }

  const handleRemoveImage = () => {
    setImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageUpload(null as any) // Notify parent that image is removed
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center">
        {imageSrc ? (
          <Image src={imageSrc} alt="Avatar" fill className="object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <Upload className="h-8 w-8 text-white" />
        </div>
      </div>
      {imageSrc && (
        <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
          <X className="h-4 w-4 mr-2" /> Remove Image
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop your image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img ref={imgRef} alt="Crop me" src={imageSrc} onLoad={onImageLoad} />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCropComplete}>Crop Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}